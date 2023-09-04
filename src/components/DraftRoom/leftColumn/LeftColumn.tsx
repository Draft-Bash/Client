import '../../../css/draftRoom/leftColumn/leftColumn.css';
import { useState } from 'react';
import ToggleButton from '../../buttons/ToggleButton';
import UserPickQueue from './UserPickQueue';
import DraftRoster from './DraftRoster';

const LeftColumn = () => {

  return (
    <div className="left-column">
        <header>
          <h4>Pick Queue</h4>
          <ToggleButton labelName="Autopick" onClick={() => console.log("Hello")} />
        </header>
        <UserPickQueue />
        <DraftRoster />
    </div>
  )
};

export default LeftColumn;