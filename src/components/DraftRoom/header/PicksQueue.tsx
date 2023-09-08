import '../../../css/draftRoom/picksQueue.css';
import React, { useEffect, useState } from 'react';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../../authentication/AuthContext';
import { DraftPick } from '../../../utils/draft';

const PicksQueue = () => {
    const draftContext = useDraft();
    const socket = draftContext?.socket;
    const { userId } = useAuth();
    const [draftOrder, setDraftOrder] = useState<DraftPick[]>();
    const [userNextPick, setUserNextPick] = useState<null | DraftPick>(null);

    function findUserNextPick(pickOrderList: DraftPick[]) {
        for (let i=0; i < pickOrderList.length; i++) {
            if (pickOrderList[i].user_id == userId && !pickOrderList[i].is_picked) {
                setUserNextPick(pickOrderList[i]);
                break;
            }
        }
    }
  
    useEffect(() => {
        // Set up the event listener first
  
        socket?.on('send-draft-order', (updatedDraftOrder: DraftPick[]) => {
            console.log(updatedDraftOrder);
            setDraftOrder(updatedDraftOrder);
        });
    }, [socket]);

    useEffect(() => {
        if (draftOrder){
            findUserNextPick(draftOrder);
        }
    }, [draftOrder]);
  
    return (
        <>
        <p className="picks-until-user-turn">
            ON THE CLOCK: PICK {userNextPick?.pick_number}
            <br></br><b>Team {userNextPick?.username}</b>
        </p>
        <ul>
            {draftOrder?.map((draftSpot, index) => (
            <li key={index}>
                PICK {draftSpot.pick_number}
                <br></br>Team {draftSpot.username ? draftSpot.username : draftSpot.bot_number}
            </li>
            ))}
        </ul>
        </>
    );
  };
  
  export default PicksQueue;