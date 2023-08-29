"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocket = void 0;
const socket_io_1 = require("socket.io");
const db = require("../db");
function createWebSocket(port) {
    const io = new socket_io_1.Server(port, {
        cors: {
            origin: ["http://localhost:5173"]
        }
    });
    io.on('connection', (socket) => {
        let draftOrder = [];
        socket.on('join-room', (roomId) => __awaiter(this, void 0, void 0, function* () {
            socket.join(roomId);
            const draftOrderData = yield db.query(`SELECT user_name, draft_order_id, U.user_id, 
        draft_id, bot_number, pick_number, is_picked
        FROM draft_order AS O
        LEFT JOIN users AS U ON O.user_id = U.user_id
        WHERE draft_id = $1`, [
                roomId
            ]);
            draftOrder = draftOrderData.rows;
            const players = yield db.query(`SELECT * 
        FROM points_draft_ranking AS R
        INNER JOIN nba_player as P
        ON R.player_id = P.player_id
        INNER JOIN nba_player_season_totals AS T
        ON P.player_id = T.player_id`);
            io.in(roomId).emit('send-players', players.rows);
            io.in(roomId).emit('send-draft-order', draftOrder);
            const timeData = yield db.query("SELECT pick_time_seconds FROM draft WHERE draft_id = $1", [
                roomId
            ]);
        }));
        socket.on('disconnecting', () => {
        });
        socket.on('send-message', (message, roomId) => {
            socket.to(roomId).emit('receive-message', message);
        });
    });
    return io;
}
exports.createWebSocket = createWebSocket;
