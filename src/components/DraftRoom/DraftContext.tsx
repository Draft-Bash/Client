import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { addPlayer, shiftPlayer, DraftRoster, Player, Draft } from '../../utils/draft';
import { useAuth } from '../../authentication/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

interface SocketContextProps {
  children: React.ReactNode;
}

interface DraftContextType {
  socket: Socket | null;
  draftRoomId: string | null;
  setDraftRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  setRoster: React.Dispatch<React.SetStateAction<DraftRoster| undefined>>;
  roster: DraftRoster | undefined; // Change the type
  currentTurnUserId: number;
  draftDetails: Draft | undefined;
}

const SocketContext = createContext<DraftContextType | null>(null);

export const useDraft = (): DraftContextType | null => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<SocketContextProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [draftRoomId, setDraftRoomId] = useState<string | null>(null);
  const [roster, setRoster] = useState<DraftRoster>(); // Change the type
  const [currentTurnUserId, setCurrentTurnUserId] = useState(-1);
  const [draftDetails, setDraftDetails] = useState<Draft>();
  const { userId } = useAuth();

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    // Return a cleanup function that disconnects the socket
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.emit('join-room', draftRoomId, userId);
    socket?.on('update-draft-turn', (userId: number) => {
      setCurrentTurnUserId(userId);
    });
    socket?.on('update-roster', (roster) => {
      if (roster.userId==userId) {
        handleRoster(roster.players);
      }
    });
  }, [draftRoomId]);

  async function handleRoster(players) {
    try {
      const draftRulesResponse = await fetch(API_URL + "/drafts/" + draftRoomId);
      const draftRules = await draftRulesResponse.json();

      const rosterSpots: DraftRoster = {
        pointguard: Array.from({ length: draftRules.pointguard_slots }, () => null),
        shootingguard: Array.from({ length: draftRules.shootingguard_slots }, () => null),
        guard: Array.from({ length: draftRules.guard_slots }, () => null),
        smallforward: Array.from({ length: draftRules.smallforward_slots }, () => null),
        powerforward: Array.from({ length: draftRules.powerforward_slots }, () => null),
        forward: Array.from({ length: draftRules.forward_slots }, () => null),
        center: Array.from({ length: draftRules.center_slots }, () => null),
        utility: Array.from({ length: draftRules.utility_slots }, () => null),
        bench: Array.from({ length: draftRules.bench_slots }, () => null)
      };

      players.forEach(player => {
        addPlayer(player, rosterSpots);
      });
      setRoster(rosterSpots);

    } catch (error) { console.error(error) }
  }

  useEffect(() => {
    if (userId && draftRoomId) {
      fetch(API_URL + `/drafts/picks?userId=${userId}&draftId=${draftRoomId}`)
      .then((draftedPlayerResponse) => {
        return draftedPlayerResponse.json();
      })
      .then((draftedPlayers) => {
        handleRoster(draftedPlayers);
      });

      fetch(API_URL + `/drafts/${draftRoomId}`)
      .then((response) => {
        return response.json();
      })
      .then((draftData) => {
        setDraftDetails(draftData);
      });
    }
  }, [userId, draftRoomId]);

  const socketContextValue: DraftContextType = {
    socket,
    draftRoomId,
    setDraftRoomId,
    setRoster,
    roster,
    currentTurnUserId,
    draftDetails
  };

  return (
    <SocketContext.Provider value={socketContextValue}>
      {children}
    </SocketContext.Provider>
  );
};