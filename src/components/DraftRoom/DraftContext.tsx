import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Player, Draft } from '../../utils/draft';
import { useAuth } from '../../authentication/AuthContext';
import { BasketballRosterList } from '../../utils/types/drafts';
import {BasketballRoster} from '../../utils/drafts/roster';
const API_URL = import.meta.env.VITE_API_URL;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

interface SocketContextProps {
  children: React.ReactNode;
}

interface DraftContextType {
  socket: Socket | null;
  draftId: string | null;
  setDraftId: React.Dispatch<React.SetStateAction<string | null>>;
  setRoster: React.Dispatch<React.SetStateAction<BasketballRosterList | undefined>>;
  roster: BasketballRosterList| undefined;
  currentTurnUserId: number;
  draftDetails: Draft | undefined;
  isDraftStarted: boolean;
  setIsDraftStarted: React.Dispatch<React.SetStateAction<boolean>>;
  playerQueue: Player[];
  setPlayerQueue: React.Dispatch<React.SetStateAction<Player[]>>;
  setSelectedTeam: React.Dispatch<React.SetStateAction<string>>;
  selectedTeam: string;
}

const SocketContext = createContext<DraftContextType | null>(null);

export const useDraft = (): DraftContextType | null => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<SocketContextProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [roster, setRoster] = useState<BasketballRosterList>();
  const [currentTurnUserId, setCurrentTurnUserId] = useState(-1);
  const [draftDetails, setDraftDetails] = useState<Draft>();
  const [isDraftStarted, setIsDraftStarted] = useState(false);
  const [playerQueue, setPlayerQueue] = useState<Player[]>([]);
  const { userId, username } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState(username);

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.emit('join-room', draftId, userId);
    socket?.on('update-draft-turn', (userId: number) => {
      setCurrentTurnUserId(userId);
    });
    socket?.on('update-roster', (roster) => {
      if (roster.user_id == userId) {
        //handleRoster(roster.players);
      }
    });
  }, [draftId]);

  async function handleRoster(players) {
    try {
      const draftRulesResponse = await fetch(API_URL + "/drafts/" + draftId);
      const draftRules = await draftRulesResponse.json();

      const rosterSpots: BasketballRoster = new BasketballRoster(draftRules);
      rosterSpots.addPlayers(players);
      setRoster(rosterSpots.getRosterList())

    } catch (error) { console.error(error) }
  }

  useEffect(() => {
    if (userId && draftId) {
      fetch(API_URL + `/drafts/picks?userId=${userId}&draftId=${draftId}`)
      .then((draftedPlayerResponse) => {
        return draftedPlayerResponse.json();
      })
      .then((draftedPlayers) => {
        handleRoster(draftedPlayers);
      });

      fetch(API_URL + `/drafts/${draftId}`)
      .then((response) => {
        return response.json();
      })
      .then((draftData) => {
        setDraftDetails(draftData);
        setIsDraftStarted(draftData.is_started);
      });
    }
  }, [userId, draftId]);

  const socketContextValue: DraftContextType = {
    socket,
    draftId,
    setDraftId,
    setRoster,
    roster,
    currentTurnUserId,
    draftDetails,
    isDraftStarted,
    setIsDraftStarted,
    playerQueue,
    setPlayerQueue,
    setSelectedTeam,
    selectedTeam
  };

  return (
    <SocketContext.Provider value={socketContextValue}>
      {children}
    </SocketContext.Provider>
  );
};