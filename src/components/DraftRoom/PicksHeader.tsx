import '../../css/draftRoom/picksHeader.css';
import { useEffect } from 'react';
import { useDraft } from './DraftContext';
import PicksQueue from './PicksQueue';
import DraftClock from './draftClock';

const PicksHeader = () => {
  
    return (
        <div className="picks-header">
            <DraftClock />
            <PicksQueue />
        </div>
    );
  };
  
  export default PicksHeader;