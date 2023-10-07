import '../../../css/draftRoom/picksQueue.css';
import React, { useEffect, useState } from 'react';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../../authentication/AuthContext';
import { DraftPick } from '../../../utils/draft';

const PicksQueue = () => {
    const draftContext = useDraft();
    const socket = draftContext?.socket;
    const { userId } = useAuth();
    const [draftOrder, setDraftOrder] = useState<DraftPick[]>([]);
    const [userNextPick, setUserNextPick] = useState<null | DraftPick>(null);
    const [time, setTime] = useState(90);

    useEffect(() => {
            socket?.on('update-clock', (remainingTime: number) => {
                setTime(remainingTime);
            });
    }, [socket]);

    function findUserNextPick(pickOrderList: DraftPick[]) {
        for (let i=0; i < pickOrderList.length; i++) {
            if (pickOrderList[i].user_id == userId) {
                setUserNextPick(pickOrderList[i]);
                break;
            }
        }
    }
  
    useEffect(() => {
        socket?.on('send-draft-order', (updatedDraftOrder: DraftPick[]) => {
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
        <div className="picks-until-user-turn">
            {(draftOrder?.length>1) && (
                <p className={`picks-until-user-turn
                    ${time<=10 ? " turn-expiring" : ""}
                    ${(draftOrder[0].user_id==userId && time>10) ? " is-turn" : ""}`
                }>
                ON THE CLOCK: PICK {userNextPick?.pick_number}
                <br></br>
                <b>Team {draftOrder[0].username ? draftOrder[0].username : draftOrder[0].bot_number}</b>
            </p>
            )}
        </div>
        <ul>
            {draftOrder?.map((draftSpot, index) => (
            <li key={index}>
                PICK {draftSpot.pick_number}
                <br></br>
                Team {draftSpot.username ? draftSpot.username : draftSpot.bot_number}
            </li>
            ))}
        </ul>
        </>
    );
  };
  
  export default PicksQueue;