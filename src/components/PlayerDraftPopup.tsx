import '../css/playerDraftPopup.css';
import '../css/modal.css';
import React, {useState, useRef} from 'react';

interface Props {
	playerId: number
}

const PlayerDraftPopup = (props: Props) => {

  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  return (
    <>
    <span className="player-draft-popup" onClick={() => setIsOpen(true)}>
      Nikola Jokic
    </span>
    <dialog
      open={isOpen}
      ref={modalRef}
      onClick={(e) => {
        if (e.target == modalRef.current) {
          setIsOpen(false);
        }
      }}
      className="modal"
		>
      <div className="player-info-box1">
        <div className="player-info-box-header">
          <img
            src={`/images/playerImages/201935.png`}
            onError={(event) => {
            const imgElement = event.target as HTMLImageElement;
            imgElement.src = "/images/playerImages/201935.png";
            imgElement.onerror = null; // Prevents future errors from being logged
            }}
          />
          <div className='rank'>Rank #20</div>
          <div className="player-info-box-header-center">
            <b className="player-name">James Harden</b>
            <p>Los Angeles Clippers</p>
          </div>
          <img
            src={`/images/nbaLogos/1610612737.svg`}
            onError={(event) => {
            const imgElement = event.target as HTMLImageElement;
            imgElement.src = "/images/nbaLogos/1610612737.svg";
            imgElement.onerror = null; // Prevents future errors from being logged
            }}
          />
        </div>
        <div className='fantasy-outlook-area'>
          <b>2023 Fantasy Outlook</b>
        </div>
      </div>
      <div className="player-info-box2">
      </div>
    </dialog>
    </>
  );
};

export default PlayerDraftPopup;