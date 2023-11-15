import '../../../css/draftRoom/rightColumn/rightColumn.css';
import React from 'react';
import { useEffect, useState } from 'react';
import { useDraft } from '../DraftContext';
import { DraftPick, addPlayer, DraftRoster, Player } from '../../../utils/draft';
import { formatPlayerPositions } from '../../../utils/draft';


const RightColumn = () => {

  const draftContext = useDraft();
  const selectedTeam = draftContext?.selectedTeam;
  const socket = draftContext?.socket;
  const setRoster = draftContext?.setRoster;
  const draftRules = draftContext?.draftDetails;
  const [picks, setPicks] = useState<DraftPick[]>([]);

  useEffect(() => {
    if (draftRules) {
      const selectedTeamPicks = picks.filter(pick => 
        (pick.username == selectedTeam)||(pick.picked_by_bot_number == Number(selectedTeam))
      );
  
      const rosterSpots: DraftRoster = {
        pointguard: Array.from({ length: draftRules.pointguard_slots }, () => null),
        shootingguard: Array.from({ length: draftRules.shootingguard_slots }, () => null),
        guard: Array.from({ length: draftRules.guard_slots }, () => null),
        smallforward: Array.from({ length: draftRules.smallforward_slots }, () => null),
        powerforward: Array.from({ length: draftRules.powerforward_slots }, () => null),
        forward: Array.from({ length: draftRules.forward_slots }, () => null),
        center: Array.from({ length: draftRules.center_slots }, () => null),
        utility: Array.from({ length: draftRules.utility_slots }, () => null),
        bench: Array.from({ length: draftRules.bench_slots }, () => null)
      };
  
      selectedTeamPicks.forEach((player: unknown) => {
        addPlayer(player as Player, rosterSpots);
      });
      if (setRoster) {
        setRoster(rosterSpots);
      }
    }
  }, [picks, selectedTeam]);


  useEffect(() => {
      socket?.on('update-total-draftpicks', async (allPicks) => {
        setPicks(allPicks);
      });
  }, [socket]);

  return (
    <div className="right-column">
        <header>Picks</header>
        <ul>
        {picks.reverse()?.map((pick, index) => (
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