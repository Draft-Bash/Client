import { useParams } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import DraftHeader from '../components/DraftRoom/header/DraftHeader';
import { useDraft } from '../components/DraftRoom/DraftContext';
import PicksHeader from '../components/DraftRoom/header/PicksHeader';
import LeftColumn from '../components/DraftRoom/leftColumn/LeftColumn';
import DraftCenter from '../components/DraftRoom/center/DraftCenter';
import RightColumn from '../components/DraftRoom/RightColumn';
import '../css/draftRoom/draftRoom.css';
import { SocketProvider } from '../components/DraftRoom/DraftContext';

const DraftRoomWithContext = () => (
  <SocketProvider>
    <DraftRoom />
  </SocketProvider>
);

const DraftRoom = () => {
  const { draftId } = useParams();
  const draftContext = useDraft();

  useEffect(() => {
    if (draftId) {
      draftContext?.setDraftRoomId(draftId);
    }
  }, []);

  return (
    <div className='draft-room'>
      <DraftHeader />
      <PicksHeader />
      <main>
        <LeftColumn />
        <DraftCenter />
        <RightColumn />
      </main>
    </div>
  )
};

export default DraftRoomWithContext;