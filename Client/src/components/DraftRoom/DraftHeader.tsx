import { useEffect, useState } from 'react';
import { API_URL } from '../../env';
import { capitalizeWords } from '../../utils/wordCapitalizer';
import '../../css/draftHeader.css';
import '../../css/chatRoom.css';
import ChatRoom from './ChatRoom';

interface Props {
    draftId: number
}

const DraftHeader = (props: Props) => {

    const [draftType, setDraftType] = useState("snake");
    const [teamCount, setTeamCount] = useState(10);
    const [scoringType, setScoringType] = useState("points");

    useEffect(() => {
        async function fetchDraftData() {
          try {
            const response = await fetch(API_URL+"/drafts/"+props.draftId);
            const draftData = await response.json();

            setDraftType(draftData.draft_type);
            setTeamCount(draftData.team_count);
            setScoringType(draftData.scoring_type);

          } catch(err: any) {}
        }
    
        fetchDraftData();
      }, []);

    return (
        <header className="draft-header">
            <p>{`${teamCount}-Team ${capitalizeWords(draftType)} ${capitalizeWords(scoringType)} Mock Draft`}</p>
            <ChatRoom />
        </header>
    )
};

export default DraftHeader;