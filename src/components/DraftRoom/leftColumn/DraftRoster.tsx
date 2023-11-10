import '../../../css/draftRoom/leftColumn/draftRoster.css';
import React, { useEffect, useState } from 'react';
import PlayerInfoPopup from '../../PlayerInfoPopup';
import RoundedPickList from '../../RoundedPickList';
import { PlayerInfo } from '../../PlayerInfoPopup';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../../authentication/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

const DraftRoster = () => {

  const draftContext = useDraft();
  const draftId = draftContext?.draftId;
  const {username} = useAuth();
  const [selectedPlayerInfo, setSelectedPlayerInfo] = useState<PlayerInfo | undefined | null >();
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const roster = draftContext?.roster;

  const positionAbbreviation = {
    "pointguard": "PG", "shootingguard": "SG",
    "guard": "G", "smallforward": "SF", "powerforward": "PF",
    "forward": "F", "center": "C", "utility": "UTIL", "bench": "BE"
  }

  useEffect(() => {
    if (draftId) {
        fetch(API_URL+"/drafts/members?draftId="+draftId)
    .then(response => response.json())
    .then(data => {
      let teamNames: string[] = [];
      data.draftBots.forEach((bot: number) => {
        teamNames.push(`Team ${bot}`);
      });
      data.draftUsers.forEach((user) => {
        teamNames.push(user.username);
      });
      setTeams(teamNames);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
    }
}, [draftId]);

  return (
    <>
    <PlayerInfoPopup player={selectedPlayerInfo} setPlayer={setSelectedPlayerInfo} />
    <div className="draft-roster">
        <header>
            <b>Roster</b>
            <RoundedPickList itemList={teams} 
              defaultValue={username}
              setValue={(team) => setSelectedTeam(team as string)}
              width={100} 
              height={25}
            />
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
                  {players[index] != null && (
                    <span onClick={() => setSelectedPlayerInfo(player)}>
                      {(players[index]?.first_name[0]+". "+players[index]?.last_name)}
                    </span>
                  )}
                  {players[index] == null && (
                    <i className="empty-spot">Empty</i>
                  )}
                </td>
              </tr>
            ))
          ))}
          </tbody>
        </table>
    </div>
    </>
  )
};

export default DraftRoster;