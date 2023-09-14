import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client'; // Import socket.io for real-time communication
import { addPlayer, shiftPlayer, DraftRoster, Player } from '../../utils/draft'; // Import utility functions and types
import { API_URL, SERVER_URL } from '../../env'; // Import API and server URLs
import { useAuth } from '../../authentication/AuthContext'; // Import authentication context

// Define the props for the SocketContext
interface SocketContextProps {
  children: React.ReactNode;
}

// Define the DraftContextType for the context
interface DraftContextType {
  socket: Socket | null; // Socket for real-time communication
  draftRoomId: string | null; // Current draft room ID
  setDraftRoomId: React.Dispatch<React.SetStateAction<string | null>>; // Function to set the draft room ID
  setRoster: React.Dispatch<React.SetStateAction<DraftRoster | undefined>>; // Function to set the roster
  roster: DraftRoster | undefined; // Draft roster
}

// Create a context for the DraftContextType
const SocketContext = createContext<DraftContextType | null>(null);

// Custom hook to access the draft context
export const useDraft = (): DraftContextType | null => {
  return useContext(SocketContext);
};

// SocketProvider component to provide the draft context
export const SocketProvider: React.FC<SocketContextProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null); // State for the socket connection
  const [draftRoomId, setDraftRoomId] = useState<string | null>(null); // State for the current draft room ID
  const [roster, setRoster] = useState<DraftRoster | undefined>(); // State for the draft roster
  const { userId } = useAuth(); // Access the user ID from the authentication context

  // Set up the socket connection when the component mounts
  useEffect(() => {
    const newSocket = io(SERVER_URL); // Create a new socket connection
    setSocket(newSocket); // Set the socket in state

    // Return a cleanup function that disconnects the socket when unmounting
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join the draft room when the draftRoomId changes
  useEffect(() => {
    socket?.emit('join-room', draftRoomId); // Emit a socket event to join the room
  }, [draftRoomId]);

  // Function to fetch drafted players and update the roster
  async function fetchDraftedPlayers() {
    try {
      const draftRulesResponse = await fetch(API_URL + "/drafts/" + draftRoomId); // Fetch draft rules from the API
      const draftRules = await draftRulesResponse.json();

      // Initialize roster spots based on draft rules
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

      const draftedPlayerResponse = await fetch(API_URL + `/drafts/picks?userId=${userId}&draftId=${draftRoomId}`);
      const draftedPlayers = await draftedPlayerResponse.json();

      // Add drafted players to the roster
      draftedPlayers.forEach(player => {
        addPlayer(player, rosterSpots);
      });

      setRoster(rosterSpots); // Update the roster state

    } catch (error) {
      console.error(error);
    }
  }

  // Fetch drafted players when userId and draftRoomId change
  useEffect(() => {
    if (userId && draftRoomId) {
      fetchDraftedPlayers();
    }
  }, [userId, draftRoomId]);

  // Log the roster when it changes
  useEffect(() => {
    console.log(roster);
  }, [roster]);

  // Define the socket context value
  const socketContextValue: DraftContextType = {
    socket,
    draftRoomId,
    setDraftRoomId,
    setRoster,
    roster
  };

  // Provide the context value to children components
  return (
    <SocketContext.Provider value={socketContextValue}>
      {children}
    </SocketContext.Provider>
  );
};