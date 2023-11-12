import '../../../css/draftRoom/rightColumn/rightColumn.css';
import React from 'react';
import { useEffect, useState } from 'react';
import { useDraft } from '../DraftContext';
import { DraftPick } from '../../../utils/draft';
import { formatPlayerPositions } from '../../../utils/draft';


const RightColumn = () => {

  const draftContext = useDraft();
  const socket = draftContext?.socket;
  const [picks, setPicks] = useState<DraftPick[]>([]);
  useEffect(() => {
    socket?.on('update-total-draftpicks', (allPicks) => {
        setPicks(allPicks);
        console.log(allPicks);
    });
}, [socket]);

  return (
    <div className="right-column">
        <header>Picks</header>
        <ul>
        {picks?.map((pick, index) => (
          <li key={index}>
            <img
                src={`/images/playerImages/${pick.player_id}.png`}
                onError={(event) => {
                const imgElement = event.target as HTMLImageElement;
                imgElement.src = "/images/playerImages/defaultPlayerImage.png";
                imgElement.onerror = null; // Prevents future errors from being logged
                }}
            />
            <div className='details'>
              <p>
                <b>{pick.first_name[0]}. {pick.last_name}</b>/{pick.team_abbreviation} 
                <b> {formatPlayerPositions(pick.is_pointguard, pick.is_shootingguard, pick.is_smallforward, 
                  pick.is_powerforward, pick.is_center, "|")}
                </b>
              </p>
              <p>
                {`R${Math.ceil(pick.pick_number/10)}, 
                P${((pick.pick_number)%10 || 10) }`} Team {pick.username ? pick.username : pick.picked_by_bot_number}
              </p>
            </div>
          </li>
          ))}
        </ul>
    </div>
  )
};

export default RightColumn;