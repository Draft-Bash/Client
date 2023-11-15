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
  const setSelectedTeam = draftContext?.setSelectedTeam
  const {username} = useAuth();
  const [selectedPlayerInfo, setSelectedPlayerInfo] = useState<PlayerInfo | undefined | null >();
  const [teams, setTeams] = useState<string[]>([]);
  const roster = draftContext?.roster;
  const draftDetails = draftContext?.draftDetails;

  const positionAbbreviation = {
    "pointguard": "PG", "shootingguard": "SG",
    "guard": "G", "smallforward": "SF", "powerforward": "PF",
    "forward": "F", "center": "C", "utility": "UTIL", "bench": "BE"
  }

  useEffect(() => {
    if (draftId && draftDetails) {
        fetch(API_URL+"/drafts/members?draftId="+draftId)
    .then(response => response.json())
    .then(data => {
      let teamNames: string[] = [];
      const totalTeamCount = draftDetails?.team_count;
      data.draftUsers.forEach((user) => {
        teamNames.push(user.username);
      });

      for (let i=data.draftUsers.length+1; i <= totalTeamCount; i++) {
        teamNames.push(`Team ${i}`);
      }
      setTeams(teamNames);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
    }
}, [draftId, draftDetails]);

  return (
    <>
    <PlayerInfoPopup player={selectedPlayerInfo} setPlayer={setSelectedPlayerInfo} />
    <div className="draft-roster">
        <header>
            <b>Roster</b>
            {setSelectedTeam && (
              <RoundedPickList itemList={teams} 
                defaultValue={username}
                setValue={(team) => setSelectedTeam((team as string).replace('Team ', ''))}
                width={100} 
                height={25}
              />
            )}
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