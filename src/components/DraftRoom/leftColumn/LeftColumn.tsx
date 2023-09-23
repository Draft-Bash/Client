import '../../../css/draftRoom/leftColumn/leftColumn.css';
import React,{ useEffect, useState } from 'react';
import ToggleButton from '../../buttons/ToggleButton';
import UserPickQueue from './UserPickQueue';
import DraftRoster from './DraftRoster';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../../authentication/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

const LeftColumn = () => {

  const draftContext = useDraft();
  const draftId = draftContext?.draftRoomId;
  const [isAutopickOn, setAutopickStatus] = useState(false);
  const { userId } = useAuth();
  const socket = draftContext?.socket;

  useEffect(() => {
    if (userId && draftId) {
      fetch(API_URL+`/drafts/autodraft?userId=${userId}&draftId=${draftId}`)
      .then(response => {
        return response.json(); // Parse the response as JSON
      })
      .then(data => {
        console.log(data)
        setAutopickStatus(data);
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
      });

      socket?.on('autodraft-enabled', (autodrafterId) => {
        if (autodrafterId==userId) {
          setAutopickStatus(true);
        };
    });
    }
  }, [userId, draftId]);

  async function toggleAutodraft() {
    socket?.emit('update-autodraft', !isAutopickOn);
    fetch(API_URL+`/drafts/autodraft`, {
      method: 'POST', // HTTP request method
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isAutopickOn: !isAutopickOn,
        userId: userId,
        draftId: draftId
      })
    })
      .then(response => {
        return response.json(); // Parse the response as JSON
      })
      .then(data => {
        console.log(!isAutopickOn);
        setAutopickStatus(!isAutopickOn);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }

  return (
    <div className="left-column">
        <header>
          <h4>Pick Queue</h4>
          <ToggleButton 
            labelName="Autopick"
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