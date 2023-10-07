import React, { useEffect, useState } from 'react';
import { useDraft } from '../DraftContext';
import { capitalizeWords } from '../../../utils/wordCapitalizer';
import '../../../css/draftHeader.css';
import ChatRoom from '../ChatRoom';
import OutlinedRoundedButton from '../../buttons/OutlinedRoundedButton';
import { useAuth } from '../../../authentication/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

const DraftHeader = () => {

  const [draftType, setDraftType] = useState("snake");
  const [teamCount, setTeamCount] = useState(10);
  const [scoringType, setScoringType] = useState("points");
  const [isStarted, setStarted] = useState(true);
  const draftContext = useDraft();
  const setIsDraftStarted = draftContext?.setIsDraftStarted;
  const draftRoomId = draftContext?.draftRoomId;
  const draftDetails = draftContext?.draftDetails;
  const {userId} = useAuth();
  const socket = draftContext?.socket;

  const startDraft = async () => {
    try {
      await fetch(API_URL+"/drafts/start/"+draftRoomId,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: null
      });
      setStarted(true);
      socket?.emit('start-draft');

    } catch (error) {console.log(error)}
  }


  useEffect(() => {
    if (draftRoomId) {
      async function fetchDraftData() {
        try {
          const response = await fetch(API_URL+"/drafts/"+draftRoomId);
          const draftData = await response.json();

          setDraftType(draftData.draft_type);
          setTeamCount(draftData.team_count);
          setScoringType(draftData.scoring_type);
          setStarted(draftData.is_started);

        } catch(err: any) {}
      }
  
      fetchDraftData();

      socket?.on('show-start', () => {
        if (setIsDraftStarted) {
          setIsDraftStarted(true);
          console.log("Hi there");
        }
    });
    }
    }, [draftRoomId]);

  return (
      <header className="draft-header">
          <p>
            {`${teamCount}-Team ${capitalizeWords(draftType)} ${capitalizeWords(scoringType)} Mock Draft`}
          </p>
          {(!isStarted && userId==draftDetails?.scheduled_by_user_id) &&
          <OutlinedRoundedButton
            color="red"
            handleOnClick={() => startDraft()}
            >
            START
          </OutlinedRoundedButton>}
          <ChatRoom />
      </header>
  )
};

export default DraftHeader;