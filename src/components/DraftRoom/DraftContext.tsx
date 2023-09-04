import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { addPlayer, shiftPlayer, RosterSpots, Player} from './leftColumn/DraftRoster';
import { API_URL } from '../../env';
import { useAuth } from '../authentication/AuthContext';

interface SocketContextProps {
  children: React.ReactNode;
}

interface SocketContextType {
  socket: Socket | null;
  draftRoomId: string | null; // Change the type to string | null
  setDraftRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  setRoster: React.Dispatch<React.SetStateAction<Player[] | null>>;
  roster: Player[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useDraft = (): SocketContextType | null => { // Use the custom type
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<SocketContextProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [draftRoomId, setDraftRoomId] = useState<string | null>(null);
  const [roster, setRoster] = useState(null); // Change the type
  const { userId } = useAuth();

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Return a cleanup function that disconnects the socket
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.emit('join-room', draftRoomId);
  }, [draftRoomId]);

  async function fetchDraftedPlayers() {
    try {
      const draftRulesResponse = await fetch(API_URL+"/drafts/"+draftRoomId);
      const draftRules = await draftRulesResponse.json();

      const rosterSpots: RosterSpots = {
        pointguard: Array.from({length: draftRules.pointguard_slots}, () => null),
        shootingguard: Array.from({length: draftRules.shootingguard_slots}, () => null),
        guard: Array.from({length: draftRules.guard_slots}, () => null),
        smallforward: Array.from({length: draftRules.smallforward_slots}, () => null),
        powerforward: Array.from({length: draftRules.powerforward_slots}, () => null),
        forward: Array.from({length: draftRules.forward_slots}, () => null),
        center: Array.from({length: draftRules.center_slots}, () => null),
        utility: Array.from({length: draftRules.utility_slots}, () => null),
        bench: Array.from({length: draftRules.bench_slots}, () => null)
      };

      const draftedPlayerResponse = await fetch(API_URL+`/drafts/picks?userId=${userId}&draftId=${draftRoomId}`);
      const draftedPlayers = await draftedPlayerResponse.json();

      draftedPlayers.forEach(player => {
        addPlayer(player, rosterSpots)
      });
      setRoster(rosterSpots);

    } catch (error) {console.error(error)}
  }

  useEffect(() => {
    if (userId && draftRoomId) {
      fetchDraftedPlayers();
    }
  }, [userId, draftRoomId]);

  useEffect(() => {
    console.log(roster);
  }, [roster]);

  const socketContextValue: SocketContextType = {
    socket,
    draftRoomId,
    setDraftRoomId,
    setRoster, 
    roster
  };

  return (
    <SocketContext.Provider value={socketContextValue}>
      {children}
    </SocketContext.Provider>
  );
};