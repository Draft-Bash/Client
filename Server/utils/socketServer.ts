import { Server, Socket } from 'socket.io';
const db = require("../db");

export function createWebSocket(port: number) {
  const io = new Server(port, {
    cors: {
      origin: ["http://localhost:5173"]
    }
  });

  io.on('connection', (socket: Socket) => {
    let draftOrder: number[] = [];

    socket.on('join-room', async roomId => {
      socket.join(roomId);

      const draftOrderData = await db.query(
        `SELECT user_name, draft_order_id, U.user_id, 
        draft_id, bot_number, pick_number, is_picked
        FROM draft_order AS O
        LEFT JOIN users AS U ON O.user_id = U.user_id
        WHERE draft_id = $1
        LIMIT 15`, [
        roomId
      ]);
      draftOrder = draftOrderData.rows;

      io.in(roomId).emit('send-draft-order', draftOrder);

      const timeData = await db.query("SELECT pick_time_seconds FROM draft WHERE draft_id = $1", [
        roomId
      ]);
    });

    socket.on('disconnecting', () => {
    });

    socket.on('send-message', (message, roomId) => {
      socket.to(roomId).emit('receive-message', message);
    });

    socket.on('send-players', (players, roomId) => {
      socket.broadcast.to(roomId).emit('receive-message', players);
    });
  });

  return io;
}