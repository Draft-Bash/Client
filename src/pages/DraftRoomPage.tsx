import { useParams } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';
import { useDraft } from '../contexts/DraftContext';

const DraftRoomPage = () => {
  const { draft_id } = useParams();
  const draftContext = useDraft();

  useEffect(() => {
    if (draft_id != null) {
      draftContext?.setDraftId(draft_id);
    }
  }, [draft_id]);

  return (
    <div className='draft-room'>
      
    </div>
  )
};

export default DraftRoomPage;