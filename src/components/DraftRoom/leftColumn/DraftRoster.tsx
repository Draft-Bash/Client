import '../../../css/draftRoom/leftColumn/draftRoster.css';
import RosterPickList from '../RosterPickList';
import React, { useEffect, useState } from 'react';
import { useDraft } from '../DraftContext';

const DraftRoster = () => {

  const draftContext = useDraft();
  const roster = draftContext?.roster;

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