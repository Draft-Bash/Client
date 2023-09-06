import '../../../css/draftRoom/center/playersTable.css';
import React, { useEffect, useState } from 'react';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../authentication/AuthContext';
import { API_URL } from '../../../env';
import { addPlayer } from '../leftColumn/DraftRoster';
import OutlinedRoundedButton from '../../buttons/OutlinedRoundedButton';

const PlayersTable = () => {

    const {socket, draftRoomId, roster, setRoster } = useDraft();
    const [playerList, setPlayerlist] = useState();
    const { userId } = useAuth();
  
    useEffect(() => {
        if (draftRoomId) {
            fetch(API_URL+"/drafts/players?draftId="+draftRoomId)
            .then(response => {
                return response.json();
            })
            .then(data => {
                setPlayerlist(data);
            })
            .catch(error => {console.log(error)});
        }
    }, [draftRoomId, roster]);

    async function handleDraftClick(pickedPlayer, currentRoster) {
        const updatedRoster = {...currentRoster}; 
    
        if (addPlayer(pickedPlayer, updatedRoster)) {
            setRoster(updatedRoster);
            console.log(roster);
            try {
                const response = await fetch(API_URL+"/drafts/picks", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: userId, 
                        player_id: pickedPlayer.player_id, 
                        draft_id: draftRoomId
                    })
                });
                // Handle the response...
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log(roster);
        }
    }
    
    return (
        <div className="players-table">
            <table>
                <thead>
                    <tr>
                        <th>RK</th>
                        <th>PLAYER</th>
                        <th>AGE</th>
                        <th>GP</th>
                        <th>MPG</th>
                        <th>PTS</th>
                        <th>REBS</th>
                        <th>ASTS</th>
                    </tr>
                </thead>
                <tbody>
                    {playerList?.map((player, index) => (
                    <tr key={index}>
                        <td>{player.rank_number}</td>
                        <td className="player-cell">
                        <img
                        src={`/images/playerImages/${player.player_id}.png`}
                        loading="lazy"
                        onError={(event) => {
                            event.target.src = "/images/playerImages/defaultPlayerImage.png";
                            event.target.onerror = null; // Prevents future errors from being logged
                        }}
                        />
                            {player.first_name+" "+player.last_name}
                            <OutlinedRoundedButton 
                            color="red" 
                            handleOnClick={() => handleDraftClick(player, roster)}
                            >
                                DRAFT
                            </OutlinedRoundedButton>
                        </td>
                        <td>{player.player_age}</td>
                        <td>{player.games_played}</td>
                        <td>{(player.minutes_played/player.games_played).toFixed(1)}</td>
                        <td>{player.points_total}</td>
                        <td>{player.rebounds_total}</td>
                        <td>{player.assists_total}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default PlayersTable;