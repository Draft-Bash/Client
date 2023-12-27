import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

interface DraftContextProps {
  children: React.ReactNode;
}

interface DraftContextType {
  socket: Socket | null;
  draftId: string | null;
  setDraftId: React.Dispatch<React.SetStateAction<string | null>>;
}

const DraftContext = createContext<DraftContextType | null>(null);

export const useDraft = (): DraftContextType | null => {
  return useContext(DraftContext);
};

export const DraftProvider: React.FC<DraftContextProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io(SERVER_URL+'/drafts');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.emit('joinRoom', draftId);
  }, [draftId]);

  const draftContextValue: DraftContextType = {
    socket,
    draftId,
    setDraftId,
  };

  return (
    <DraftContext.Provider value={draftContextValue}>
      {children}
    </DraftContext.Provider>
  );
};