import '../../../css/draftRoom/center/playersTable.css';
import React, { useEffect, useState } from 'react';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../../authentication/AuthContext';
import { addPlayer, PlayerPreviousSeasonStats, formatPlayerPositions, Player} from '../../../utils/draft';
import OutlinedRoundedButton from '../../buttons/OutlinedRoundedButton';
const API_URL = import.meta.env.VITE_API_URL;

const PlayersTable = () => {

    const draftContext = useDraft();
    const draftId = draftContext?.draftId;
    let roster = draftContext?.roster;
    const setPlayerQueue = draftContext?.setPlayerQueue;
    const playerQueue = draftContext?.playerQueue;
    const setRoster = draftContext?.setRoster;
    const socket = draftContext?.socket;
    const [playerList, setPlayerList] = useState<PlayerPreviousSeasonStats[]>();
    const currentTurnUserId = draftContext?.currentTurnUserId;
    const { userId } = useAuth();

    const handleQueueClick = (player: Player) => {
        const tempRoster = JSON.parse(JSON.stringify(roster));

        if (setPlayerQueue && playerQueue && tempRoster && addPlayer(player, tempRoster)) {
            if (!playerQueue?.some((queuedPlayer: Player) => queuedPlayer.player_id==player.player_id)) {
                const newPlayerQueue = playerQueue.slice();
                newPlayerQueue?.push(player);
                setPlayerQueue(newPlayerQueue);
                socket?.emit('enqueue-pick', userId, draftId, player.player_id, newPlayerQueue?.length);
            }
        }
    }

    const pickPlayer = (playerId: string, userId: string, draftId: string) => {
        socket?.emit('pick-player', playerId, userId, draftId);
    }
  
    useEffect(() => {
        socket?.on('receive-available-players', (availablePlayers) => {
            setPlayerList(availablePlayers);
        });
        socket?.on('queued-picks', (queuedPicks) => {
            if (setPlayerQueue) {
                setPlayerQueue(queuedPicks.filter(pick => pick.user_id == userId));
            }
        });
    }, [socket]);

    async function handleDraftClick(pickedPlayer, currentRoster) {
        const updatedRoster = { ...currentRoster }; 
      
        if (setRoster) { // Check if setRoster is defined
            if (addPlayer(pickedPlayer, updatedRoster)) {
                pickPlayer(pickedPlayer.player_id, String(userId), String(draftId));
                setRoster(updatedRoster);
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
                                onError={(event) => {
                                const imgElement = event.target as HTMLImageElement;
                                imgElement.src = "/images/playerImages/defaultPlayerImage.png";
                                imgElement.onerror = null; // Prevents future errors from being logged
                                }}
                            />
                            <div className="player-details">
                                {player.first_name + " " + player.last_name}
                                <p>
                                    {player.team_abbreviation}&nbsp;
                                    <b> 
                                        {formatPlayerPositions(player.is_pointguard, player.is_shootingguard, player.is_smallforward, 
                                        player.is_powerforward, player.is_center, "/")}
                                    </b>
                                </p>
                            </div>
                            {currentTurnUserId == userId && (
                                <OutlinedRoundedButton
                                color="red"
                                handleOnClick={() => handleDraftClick(player, roster)}
                                >
                                DRAFT
                                </OutlinedRoundedButton>
                            )}
                            {currentTurnUserId != userId && (
                                <OutlinedRoundedButton
                                color="black"
                                handleOnClick={() => handleQueueClick(player)}
                                >
                                QUEUE
                                </OutlinedRoundedButton>
                            )}
                        </td>
                        <td>{player.player_age}</td>
                        <td>{player.games_played}</td>
                        <td>{(player.minutes_played / player.games_played).toFixed(1)}</td>
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