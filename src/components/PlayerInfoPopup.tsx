import '../css/playerDraftPopup.css';
import '../css/modal.css';
import { Player } from '../utils/draft';
import React, {useState, useRef, useEffect} from 'react';
import CloseButton from './buttons/CloseButton';

export interface PlayerInfo extends Player {
  fantasy_outlook: string;
  injury_status: string;
  points_total: number
  rebounds_total: number;
  assists_total: number;
  blocks_total: number;
  steals_total: number;
  projected_points: number;
  projected_rebounds: number;
  projected_assists: number;
  projected_blocks: number;
  projected_steals: number;
  projected_turnovers: number;
  team_abbreviation: string;
  games_played: number;
  projected_games_played: number;
  city_name: string;
  team_name: string;
  rank_number: number;
  projected_fieldgoal_percentage: number;
  projected_minutes_played: number;
  projected_threepointers: number;
  turnovers_total: number;
  minutes_played: number;
  fieldgoals_made: number;
  fieldgoals_attempted: number;
  threes_made: number;
  summary: string;
  analysis: string;
  title: string;
  news_date: string;
}

interface Props {
  player: PlayerInfo | undefined | null;
  setPlayer(playerInfo: PlayerInfo | undefined | null): void;
}

const PlayerInfoPopup = (props: Props) => {

  const [isOpen, setIsOpen] = useState(false);
  const [player, setPlayer] = useState<PlayerInfo | undefined | null>()
  const modalRef = useRef(null);

  const formatDate = (dateString) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const date = new Date(dateString);
    const monthIndex = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
  
    return `${months[monthIndex]} ${day+1}, ${year}`;
  };

  useEffect(() => {
    if (props.player) {
      setIsOpen(true);
      setPlayer(props.player);
    }
  }, [props.player])

  return (
    <>
    {player && (
        <dialog
        open={isOpen}
        ref={modalRef}
        onClick={(e) => {
          if (e.target == modalRef.current) {
            setIsOpen(false);
            props.setPlayer(null);
          }
        }}
        className="modal"
      >
        <div className="player-info-box1">
          <div className='center'>
            <div className="player-info-box-header">
              {player && (
                <img
                src={`/images/playerImages/${player.player_id}.png`}
                onError={(event) => {
                const imgElement = event.target as HTMLImageElement;
                imgElement.onerror = null; // Prevents future errors from being logged
                }}
              />
              )}
              <div className='rank'>
                {`Rank #${player.rank_number}`}
                <span>
                {player.is_shootingguard && (
                  <b className='shootingguard'>
                    SG
                  </b>
                )}
                &nbsp;
                {player.is_pointguard && (
                  <b className='pointguard'>
                    PG
                  </b>
                )}
                &nbsp;
                {player.is_smallforward && (
                  <b className='smallforward'>
                    SF
                  </b>
                )}
                &nbsp;
                {player.is_powerforward && (
                  <b className='powerforward'>
                    PF
                  </b>
                )}
                &nbsp;
                {player.is_center && (
                  <b className='center'>
                    C
                  </b>
                )}
                </span>
                <CloseButton handleOnClick={() => {setIsOpen(false); props.setPlayer(null);}} />
              </div>
              <div className="player-info-box-header-center">
                <b className="player-name">{player.first_name+" "+player.last_name}</b>
                <p>{player.city_name+" "+player.team_name}</p>
              </div>
              <img
                src={`/images/nbaLogos/${player.team_id}.svg`}
                onError={(event) => {
                const imgElement = event.target as HTMLImageElement;
                imgElement.onerror = null; // Prevents future errors from being logged
                }}
              />
            </div>
            <div className={"injury-status "+player.injury_status?.toLowerCase()}>
              <b>
                {player.injury_status ? player.injury_status : 'HEALTHY'}
              </b>
            </div>
            <div className='player-stats-tables'>
              <div className='prev-season-stats'>
                <p>Last Season Stats</p>
                <table>
                    <thead>
                      <tr>
                        <th>PTS</th>
                        <th>REB</th>
                        <th>AST</th>
                        <th>STL</th>
                        <th>BLK</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{(player.points_total/player.games_played).toFixed(1)}</td>
                        <td>{(player.rebounds_total/player.games_played).toFixed(1)}</td>
                        <td>{(player.assists_total/player.games_played).toFixed(1)}</td>
                        <td>{(player.steals_total/player.games_played).toFixed(1)}</td>
                        <td>{(player.blocks_total/player.games_played).toFixed(1)}</td>
                      </tr>
                    </tbody>
                </table>
              </div>
              <div className='projected-stats'>
                <p>Projected Stats</p>
                <table>
                <thead>
                      <tr>
                        <th>PTS</th>
                        <th>REB</th>
                        <th>AST</th>
                        <th>STL</th>
                        <th>BLK</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{(player.projected_points/player.projected_games_played).toFixed(1)}</td>
                        <td>{(player.projected_rebounds/player.projected_games_played).toFixed(1)}</td>
                        <td>{(player.projected_assists/player.projected_games_played).toFixed(1)}</td>
                        <td>{(player.projected_steals/player.projected_games_played).toFixed(1)}</td>
                        <td>{(player.projected_blocks/player.projected_games_played).toFixed(1)}</td>
                      </tr>
                    </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='fantasy-outlook-area'>
            <b>Fantasy Outlook</b>
            <p>
              {player.fantasy_outlook}
            </p>
          </div>
        </div>
        <div className="player-info-box2">
          <div className='player-news'>
            <b className='title'>
              {player.title}
            </b>
            <b className='date'>
              {formatDate(player.news_date)}
            </b>
            <p>
              {player.summary}
            </p>
            <b className='analysis'>
              Analysis
            </b>
            <p>
              {player.analysis}
            </p>
          </div>
        </div>
      </dialog>
    )}
    </>
  );
};

export default PlayerInfoPopup;