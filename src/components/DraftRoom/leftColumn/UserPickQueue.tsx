import '../../../css/draftRoom/leftColumn/userPickQueue.css';
import React, { useEffect, useState, useRef } from 'react';
import { Player } from '../../../utils/draft';
import { useDraft } from '../DraftContext';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { useAuth } from '../../../authentication/AuthContext';

const UserPickQueue = () => {
  const draftContext = useDraft();
  const playerQueue = draftContext?.playerQueue;
  const [swappedQueuedPlayerIndex, setSwappedQueuedPlayerIndex] = useState<number | null>(null);
  const setPlayerQueue = draftContext?.setPlayerQueue;
  const queueRef = useRef<HTMLTableElement>(null);
  const socket = draftContext?.socket;
  const draftId = draftContext?.draftRoomId
  const {userId} = useAuth();

  useEffect(() => {
    socket?.on('updated-pick-queue', (pickQueue) => {
      if (setPlayerQueue) {
        const filteredPickQueue = pickQueue.filter(pick => pick.user_id == userId);
        setPlayerQueue(filteredPickQueue);
      }
    });
  }, [socket]);

  const removePlayerFromQueue = (event: React.MouseEvent<SVGElement, MouseEvent>, removedPlayer: Player) => {
    event.stopPropagation(); // Stop the propagation of the click event
    if (playerQueue && setPlayerQueue) {
      setPlayerQueue(playerQueue.filter(player => player !== removedPlayer));
      setSwappedQueuedPlayerIndex(null);
      socket?.emit('dequeue-pick', removedPlayer.player_id, userId, draftId);
    }
  };

  const swapPlayers = (index: number) => {
    if (playerQueue && setPlayerQueue) {
      if (swappedQueuedPlayerIndex !== null) {
        const updatedPlayerQueue = playerQueue.slice();
        const temp = updatedPlayerQueue[swappedQueuedPlayerIndex];

        socket?.emit('swap-queued-picks', updatedPlayerQueue[swappedQueuedPlayerIndex].player_id, 
        swappedQueuedPlayerIndex+1, updatedPlayerQueue[index].player_id, index+1, userId, draftId);

        updatedPlayerQueue[swappedQueuedPlayerIndex] = updatedPlayerQueue[index];
        updatedPlayerQueue[index] = temp;
        setPlayerQueue(updatedPlayerQueue);
        setSwappedQueuedPlayerIndex(null);
      } else {
        setSwappedQueuedPlayerIndex(index);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (queueRef.current && !queueRef.current.contains(event.target as Node)) {
        setSwappedQueuedPlayerIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <table className="user-pick-queue" ref={queueRef}>
      <thead>
        <tr>
          <th>RK</th>
          <th>PLAYERS</th>
        </tr>
      </thead>
      <tbody>
        {playerQueue && playerQueue.length < 1 && (
          <tr>
            <td></td>
            <td className="no-players-queued-message">No Players queued</td>
          </tr>
        )}
        {playerQueue && playerQueue.length > 0 && (
          playerQueue.map((player, index) => (
            <tr
              key={index}
              onClick={() => swapPlayers(index)}
              className={index === swappedQueuedPlayerIndex ? "is-swapping" : ""}
            >
              <td>{index + 1}</td>
              <td>
                <div className='queued-player'>
                  {player.first_name[0] + ". " + player.last_name}
                  <span className="update-queue-btns">
                    <RiDeleteBin5Line
                      className="delete"
                      onClick={(event) => removePlayerFromQueue(event, player)}
                    />
                  </span>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default UserPickQueue;