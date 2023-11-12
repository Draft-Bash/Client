import '../../css/buttons/playerInfoPopupButton.css';
import '../../css/modal.css';
import { PlayerInfo } from '../PlayerInfoPopup';
import React, {useState, useRef} from 'react';

interface Props {
  setPlayer(playerInfo: PlayerInfo| undefined | null): void
  player: PlayerInfo
}

const PlayerInfoPopupButton = (props: Props) => {

    const givenDateString = props.player.news_date;
    const givenDate = new Date(givenDateString);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - givenDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    return (
        <span className="player-popup-btn" onClick={() => props.setPlayer(props.player)}>
            {props.player.first_name+" "+props.player.last_name} <b>{props.player.injury_status}</b>
            {props.player.team_id && daysDiff < 7 && (
                <img
                    src={`/images/news.svg`}
                    onError={(event) => {
                    const imgElement = event.target as HTMLImageElement;
                    imgElement.src = `/images/chicagoB.svg`;
                    imgElement.onerror = null;
                }}
                />
            )}
            <b>{props.player.injury_status}</b>
        </span>
    );
};

export default PlayerInfoPopupButton;