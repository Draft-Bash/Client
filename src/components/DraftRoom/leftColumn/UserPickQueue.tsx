import '../../../css/draftRoom/leftColumn/userPickQueue.css';
import React from 'react';

const UserPickQueue = () => {
  
    return (
        <div className="user-pick-queue">
            <header>
                <b>Rank</b>
                <b>Player</b>
            </header>
            <ul>
                <li className="no-players-queued-message">No Players queued</li>
            </ul>
        </div>
    );
  };
  
  export default UserPickQueue;