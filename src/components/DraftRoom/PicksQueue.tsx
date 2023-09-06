import '../../css/draftRoom/picksQueue.css';
import React, { useEffect, useState } from 'react';
import { useDraft } from './DraftContext';
import { useAuth } from '../authentication/AuthContext';

interface Pick {
    user_draft_order_id: number;
    user_id: number;
    draft_id: number;
    bot_number: number;
    pick_number: number;
    is_picked: boolean;
}

const PicksQueue = () => {
    const {socket, draftRoomId } = useDraft();
    const { userId } = useAuth();
    const [draftOrder, setDraftOrder] = useState<Pick>([]);
    const [userNextPick, setUserNextPick] = useState(null);

    function findUserNextPick(pickOrderList: Pick[]) {
        for (let i=0; i < pickOrderList.length; i++) {
            if (pickOrderList[i].user_id == userId && !pickOrderList[i].is_picked) {
                setUserNextPick(pickOrderList[i]);
                break;
            }
        }
    }
  
    useEffect(() => {
        // Set up the event listener first
  
        socket?.on('send-draft-order', (updatedDraftOrder: number[]) => {
            setDraftOrder(updatedDraftOrder);
        });
    }, [socket]);

    useEffect(() => {
        findUserNextPick(draftOrder);
    }, [draftOrder]);
  
    return (
        <>
        <p className="picks-until-user-turn">
            ON THE CLOCK: PICK {userNextPick?.pick_number}
            <br></br><b>Team {userNextPick?.user_name}</b>
        </p>
        <ul>
            {draftOrder.map((draftSpot, index) => (
            <li key={index}>
                PICK {draftSpot.pick_number}
                <br></br>Team {draftSpot.user_name ? draftSpot.user_name : draftSpot.bot_number}
            </li>
            ))}
        </ul>
        </>
    );
  };
  
  export default PicksQueue;