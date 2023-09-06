import '../../../css/draftRoom/leftColumn/draftRoster.css';
import RosterPickList from '../RosterPickList';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../../env';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../authentication/AuthContext';
export interface Player {
  first_name: string,
  last_name: string,
  is_pointguard: boolean,
  is_shootingguard: boolean,
  is_smallforward: boolean,
  is_powerforward: boolean,
  is_center: boolean,
  player_age: number,
  player_id: number,
  team_id: number
}
export interface RosterSpots {
  pointguard: Player|null[],
  shootingguard: Player|null[],
  guard: Player|null[],
  smallforward: Player|null[],
  powerforward: Player|null[],
  forward: Player|null[],
  center: Player|null[],
  utility: Player|null[],
  bench: Player|null[]
}

export function shiftPlayer(player: Player, currentSpot: string, currentSpotIndex: number, rosterSpots: RosterSpots) {
  for (const position of Object.keys(rosterSpots)) {
    if (player["is_" + position] || position == 'bench' || position == 'utility'
    || ((player.is_pointguard || player.is_shootingguard) && position == "guard")
    || ((player.is_smallforward || player.is_powerforward) && position == "forward")) {
      let emptyIndex = rosterSpots[position].findIndex(slot => slot == null);
      if (emptyIndex != -1) {
        rosterSpots[position][emptyIndex] = player;
        rosterSpots[currentSpot][currentSpotIndex] = null;
        return true;
      }
    }
  }
  return false;
}

export function addPlayer(player: Player, rosterSpots: RosterSpots) {
  for (const position of Object.keys(rosterSpots)) {
    if (player["is_" + position] || position == 'bench' || position == 'utility') {
      let emptyIndex = rosterSpots[position].findIndex(slot => slot == null);
      if (emptyIndex != -1) {
        rosterSpots[position][emptyIndex] = player;
        return true;
      }
      else {
        for (let i=0; i < rosterSpots[position].length; i++) {
          if (shiftPlayer(rosterSpots[position][i], position, i, rosterSpots)) {
            rosterSpots[position][i] = player;
            return true;
          }
        }
      }
    }
  }
  return false
}

const DraftRoster = () => {

  const { draftRoomId, roster } = useDraft();
  const { userId } = useAuth();

  const positionAbbreviation = {
    "pointguard": "PG", "shootingguard": "SG",
    "guard": "G", "smallforward": "SF", "powerforward": "PF",
    "forward": "F", "center": "C", "utility": "UTIL", "bench": "BE"
  }

  return (
    <div className="draft-roster">
        <header>
            <b>Roster</b>
            <RosterPickList />
        </header>
        <table>
          <thead>
            <tr>
              <th>POS</th>
              <th>PLAYER</th>
            </tr>
          </thead>
          <tbody>
          {roster && Object.entries(roster).map(([position, players]) => (
            players.map((player, index) => (
              <tr key={position+index}>
                <td>
                  {positionAbbreviation[position]}
                </td>
                <td>
                  {players[index] != null ?
                    (players[index]?.first_name[0]+". "+players[index]?.last_name)
                    : <i className="empty-spot">Empty</i>
                  }
                </td>
              </tr>
            ))
          ))}
          </tbody>
        </table>
    </div>
  )
};

export default DraftRoster;