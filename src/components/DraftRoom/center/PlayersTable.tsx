import '../../../css/draftRoom/center/playersTable.css';
import React, { useEffect, useState } from 'react';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../../authentication/AuthContext';
import { addPlayer, PlayerPreviousSeasonStats, formatPlayerPositions, Player,
    ProjectedSeasonStats} from '../../../utils/draft';
import { PlayerInfo } from '../../PlayerInfoPopup';
import { FantasyPointConverter } from '../../../utils/fantasyPointConverter';
import OutlinedRoundedButton from '../../buttons/OutlinedRoundedButton';
import PlayerInfoPopup from '../../PlayerInfoPopup';
import RoundedPickList from '../../RoundedPickList';
import PlayerInfoPopupButton from '../../buttons/PlayerInfoPopupButton';

const PlayersTable = () => {

    const draftContext = useDraft();
    const draftId = draftContext?.draftId;
    let roster = draftContext?.roster;
    const setPlayerQueue = draftContext?.setPlayerQueue;
    const playerQueue = draftContext?.playerQueue;
    const setRoster = draftContext?.setRoster;
    const socket = draftContext?.socket;
    const [playerList, setPlayerList] = useState<PlayerInfo[]>();
    const currentTurnUserId = draftContext?.currentTurnUserId;
    const [filteredPlayerList, setFilteredPlayerList] = useState(playerList);
    const [searchPlayer, setSearchPlayer] = useState('');
    const [searchPosition, setSearchPosition] = useState('');
    const { userId } = useAuth();
    const [aggregateChoice, setAggregateChoice] = useState('Average');
    const [seasonChoice, setSeasonChoice] = useState('Projections');
    const [selectedPlayerInfo, setSelectedPlayerInfo] = useState<PlayerInfo | undefined | null >();
    const fanPtConverter = new FantasyPointConverter(1,1,4,4,-2,2);

    useEffect(() => {

        let filteredPlayers = playerList?.filter((player) => 
            (player.first_name.toLowerCase()+" "+player.last_name.toLowerCase()).includes(searchPlayer.toLowerCase())
        );

        if (searchPosition=='PG') {
            filteredPlayers = filteredPlayers?.filter((player) => player.is_pointguard);
        }
        else if (searchPosition=='SG') {
            filteredPlayers = filteredPlayers?.filter((player) => player.is_shootingguard);
        }
        else if (searchPosition=='SF') {
            filteredPlayers = filteredPlayers?.filter((player) => player.is_smallforward);
        }
        else if (searchPosition=='PF') {
            filteredPlayers = filteredPlayers?.filter((player) => player.is_powerforward);
        }
        else if (searchPosition=='C') {
            filteredPlayers = filteredPlayers?.filter((player) => player.is_center);
        }

        if (filteredPlayers) {
            setFilteredPlayerList(filteredPlayers);
        }
    }, [searchPlayer, searchPosition, playerList]);

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
        const updatedRoster = JSON.parse(JSON.stringify(currentRoster));
      
        if (addPlayer(pickedPlayer, updatedRoster)) {
            pickPlayer(pickedPlayer.player_id, String(userId), String(draftId));
        } 
      }
    
    return (
        <>
        <PlayerInfoPopup player={selectedPlayerInfo} setPlayer={setSelectedPlayerInfo} />
        <div className='player-table-filters'>
            <RoundedPickList itemList={['Projections', 'Last Season']} 
                defaultValue='Projections'
                setValue={(season) => setSeasonChoice(season as string)}
                width={100}
            />
            <RoundedPickList itemList={['All Pos.', 'PG', 'SG', 'SF', 'PF', 'C']} 
                defaultValue='All Pos.'
                setValue={(searchPosition) => setSearchPosition(searchPosition as string)}
                width={75}
            />
            <RoundedPickList itemList={['Total', 'Average']} 
                defaultValue='Average'
                setValue={(aggregate) => setAggregateChoice(aggregate as string)}
                width={75}
            />
            <input placeholder="🔍Search Player" className='search-player' 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchPlayer(e.target.value)}
            />
        </div>
        <div className="players-table">
            <table>
                <thead>
                    <tr>
                        <th>RK&nbsp;&nbsp;&nbsp;&nbsp;PLAYER</th>
                        <th>FPTS</th>
                        <th>AGE</th>
                        <th>GP</th>
                        <th>MP</th>
                        <th>PTS</th>
                        <th>REB</th>
                        <th>AST</th>
                        <th>BLK</th>
                        <th>STL</th>
                        <th>TO</th>
                        <th>FG%</th>
                        <th>3PM</th>
                    </tr>
                </thead>
                <tbody>
                {(filteredPlayerList as PlayerInfo[])?.map((player, index) => (
                    <tr key={index}>
                        <td className="player-cell">
                            {player.rank_number}
                            <img
                                src={`/images/playerImages/${player.player_id}.png`}
                                onError={(event) => {
                                const imgElement = event.target as HTMLImageElement;
                                imgElement.src = "/images/playerImages/defaultPlayerImage.png";
                                imgElement.onerror = null; // Prevents future errors from being logged
                                }}
                            />
                            <div className="player-details">
                                <PlayerInfoPopupButton player={player} setPlayer={setSelectedPlayerInfo} />
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
                        {seasonChoice=='Projections' && (
                        <>
                        <td>
                            {(fanPtConverter.convert(player.projected_rebounds,
                            player.projected_points, player.projected_blocks,
                            player.projected_steals, player.projected_turnovers,
                            player.projected_assists
                            )/((aggregateChoice=='Average') ? player.projected_games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {player.player_age}
                        </td>
                        <td>
                            {player.projected_games_played}
                        </td>
                        <td>
                            {(player.projected_minutes_played/((aggregateChoice=='Average') ? player.projected_games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(player.projected_points/((aggregateChoice=='Average') ? player.projected_games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(player.projected_rebounds/((aggregateChoice=='Average') ? player.projected_games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(player.projected_assists/((aggregateChoice=='Average') ? player.projected_games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(player.projected_blocks/((aggregateChoice=='Average') ? player.projected_games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(player.projected_steals/((aggregateChoice=='Average') ? player.projected_games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(player.projected_turnovers/((aggregateChoice=='Average') ? player.projected_games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(100 * player.projected_fieldgoal_percentage).toFixed(1) + '%'}
                        </td>
                        <td>
                            {(player.projected_threepointers/((aggregateChoice=='Average') ? player.projected_games_played : 1)).toFixed(1)}
                        </td>
                        </>
                        )}
                        {seasonChoice=='Last Season' && (
                        <>
                        <td>
                            {(fanPtConverter.convert(player.rebounds_total,
                            player.points_total, player.blocks_total,
                            player.steals_total, player.turnovers_total,
                            player.assists_total
                            )/((aggregateChoice=='Average') ? player.games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {player.player_age}
                        </td>
                        <td>
                            {player.games_played}
                        </td>
                        <td>
                            {(player.minutes_played/((aggregateChoice=='Average') ? player.games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(player.points_total/((aggregateChoice=='Average') ? player.games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(player.rebounds_total/((aggregateChoice=='Average') ? player.games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(player.assists_total/((aggregateChoice=='Average') ? player.games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(player.blocks_total/((aggregateChoice=='Average') ? player.games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(player.steals_total/((aggregateChoice=='Average') ? player.games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(player.turnovers_total/((aggregateChoice=='Average') ? player.games_played : 1)).toFixed(1)}
                        </td>
                        <td>
                            {(100 * player.fieldgoals_made / player.fieldgoals_attempted).toFixed(1) + '%'}
                        </td>
                        <td>
                            {(player.threes_made/((aggregateChoice=='Average') ? player.games_played : 1)).toFixed(1)}
                        </td>
                        </>
                        )}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    )
};

export default PlayersTable;