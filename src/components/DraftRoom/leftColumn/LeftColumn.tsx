import '../../../css/draftRoom/leftColumn/leftColumn.css';
import React,{ useEffect, useState } from 'react';
import ToggleButton from '../../buttons/ToggleButton';
import UserPickQueue from './UserPickQueue';
import DraftRoster from './DraftRoster';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../../authentication/AuthContext';

const LeftColumn = () => {

  const draftContext = useDraft();
  const draftId = draftContext?.draftRoomId;
  const [isAutopickOn, setAutopickStatus] = useState(false);
  const { userId } = useAuth();
  const socket = draftContext?.socket;

  useEffect(() => {
    if (userId && draftId) {
      socket?.on('autodraft-enabled', (autodrafterId) => {
        if (autodrafterId==userId) {
          setAutopickStatus(true);
        };
    });
    }
  }, [userId, draftId]);

  async function toggleAutodraft() {
    socket?.emit('update-autodraft', !isAutopickOn);
    setAutopickStatus(!isAutopickOn);
  }

  return (
    <div className="left-column">
        <header>
          <h4>Pick Queue</h4>
          <ToggleButton 
            labelName="Autodraft"
            handleOnClick={toggleAutodraft}
            defaultToggleState={isAutopickOn}
          />
        </header>
        <UserPickQueue />
        <DraftRoster />
    </div>
  )
};

export default LeftColumn;