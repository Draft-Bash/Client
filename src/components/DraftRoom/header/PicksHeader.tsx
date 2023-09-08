import '../../../css/draftRoom/picksHeader.css';
import React, { useEffect } from 'react';
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