import { useParams } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import DraftHeader from '../DraftRoom/DraftHeader';
import { useDraft } from '../DraftRoom/DraftContext';
import PicksHeader from '../DraftRoom/PicksHeader';
import LeftColumn from '../DraftRoom/leftColumn/LeftColumn';
import DraftCenter from '../DraftRoom/center/DraftCenter';
import RightColumn from '../DraftRoom/RightColumn';
import '../../css/draftRoom/draftRoom.css';
import { SocketProvider } from '../DraftRoom/DraftContext';

const DraftRoomWithContext = () => (
  <SocketProvider>
    <DraftRoom />
  </SocketProvider>
);

const DraftRoom = () => {
  const { draftId } = useParams();
  const { setDraftRoomId } = useDraft();

  useEffect(() => {
    setDraftRoomId(draftId);
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