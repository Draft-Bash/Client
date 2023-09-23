import '../../../css/draftRoom/center/playersTable.css';
import React, { useEffect, useState } from 'react';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../../authentication/AuthContext';
import { addPlayer, PlayerPreviousSeasonStats } from '../../../utils/draft';
import OutlinedRoundedButton from '../../buttons/OutlinedRoundedButton';
import { DraftRoster } from '../../../utils/draft';
const API_URL = import.meta.env.VITE_API_URL;

const PlayersTable = () => {

    const draftContext = useDraft();
    const draftRoomId = draftContext?.draftRoomId;
    const roster = draftContext?.roster;
    const setRoster = draftContext?.setRoster;
    const socket = draftContext?.socket;
    const [playerList, setPlayerList] = useState<PlayerPreviousSeasonStats[]>();
    const currentTurnUserId = draftContext?.currentTurnUserId;
    const { userId } = useAuth();


    const pickPlayer = (playerId: string, userId: string, draftId: string) => {
        socket?.emit('pick-player', playerId, userId, draftId);
    }
  
    useEffect(() => {
        socket?.on('receive-available-players', (availablePlayers) => {
            setPlayerList(availablePlayers);
        });
    }, [socket]);

    async function handleDraftClick(pickedPlayer, currentRoster) {
        const updatedRoster = { ...currentRoster }; 
      
        if (setRoster) { // Check if setRoster is defined
            if (addPlayer(pickedPlayer, updatedRoster)) {
                pickPlayer(pickedPlayer.player_id, String(userId), String(draftRoomId));
                setRoster(updatedRoster);

            } else {
                console.log(roster);
                }
            } else {
                console.error("setRoster is not defined.");
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
                            const imgElement = event.target as HTMLImageElement;
                            imgElement.src = "/images/playerImages/defaultPlayerImage.png";
                            imgElement.onerror = null; // Prevents future errors from being logged
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