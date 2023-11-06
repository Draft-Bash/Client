import '../../../css/draftRoom/leftColumn/leftColumn.css';
import React,{ useEffect, useState } from 'react';
import ToggleButton from '../../buttons/ToggleButton';
import DraftRoster from './DraftRoster';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../../authentication/AuthContext';
import UserPickQueue from './UserPickQueue';

const API_URL = import.meta.env.VITE_API_URL;

const LeftColumn = () => {

  const draftContext = useDraft();
  const draftId = draftContext?.draftId;
  const [isAutodraftOn, setAutodraft] = useState(false);
  const { userId } = useAuth();
  const socket = draftContext?.socket;

  useEffect(() => {
    if (userId && draftId) {
      fetch(API_URL+`/drafts/autodraft?userId=${userId}&draftId=${draftId}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        setAutodraft(data.is_autodraft_on);
      });

      socket?.on('autodraft-enabled', (autodrafterId, currentDraftId) => {
        if (autodrafterId==userId && draftId==currentDraftId) {
          setAutodraft(true);
        };
    });
    }
  }, [userId, draftId]);

  async function toggleAutodraft() {
    if (!isAutodraftOn) {
      console.log(userId);
    }
    try {
      const response = await fetch(API_URL+"/drafts/autodraft", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You can add additional headers here if needed
        },
        body: JSON.stringify({
          userId: userId,
          draftId: draftId,
          isAutodraftOn: !isAutodraftOn
        })
      })
    } catch (error) {console.log(error)}

    socket?.emit('update-autodraft', !isAutodraftOn, userId, draftId);
    setAutodraft(!isAutodraftOn);
  }

  return (
    <div className="left-column">
        <header>
          <h4>Pick Queue</h4>
          <ToggleButton 
            labelName="Autodraft"
            handleOnClick={toggleAutodraft}
            defaultToggleState={isAutodraftOn}
          />
        </header>
        <UserPickQueue />
        <DraftRoster />
    </div>
  )
};

export default LeftColumn;