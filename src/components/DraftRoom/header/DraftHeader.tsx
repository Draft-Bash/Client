import React, { useEffect, useState } from 'react';
import { API_URL } from '../../../../env';
import { useDraft } from '../DraftContext';
import { capitalizeWords } from '../../../utils/wordCapitalizer';
import '../../../css/draftHeader.css';
import '../../../css/chatRoom.css';
import ChatRoom from '../ChatRoom';

const DraftHeader = () => {

  const [draftType, setDraftType] = useState("snake");
  const [teamCount, setTeamCount] = useState(10);
  const [scoringType, setScoringType] = useState("points");
  const draftContext = useDraft();
  const draftRoomId = draftContext?.draftRoomId;

  useEffect(() => {
    if (draftRoomId) {
      async function fetchDraftData() {
        try {
          const response = await fetch(API_URL+"/drafts/"+draftRoomId);
          const draftData = await response.json();

          setDraftType(draftData.draft_type);
          setTeamCount(draftData.team_count);
          setScoringType(draftData.scoring_type);

        } catch(err: any) {}
      }
  
      fetchDraftData();
    }
    }, [draftRoomId]);

  return (
      <header className="draft-header">
          <p>{`${teamCount}-Team ${capitalizeWords(draftType)} ${capitalizeWords(scoringType)} Mock Draft`}</p>
          <ChatRoom />
      </header>
  )
};

export default DraftHeader;