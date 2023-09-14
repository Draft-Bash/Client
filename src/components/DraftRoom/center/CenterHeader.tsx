import '../../../css/draftRoom/center/draftCenter.css';
import React, { useEffect, useState } from 'react';
import { DraftPick } from '../../../utils/draft';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../../authentication/AuthContext';

const CenterHeader = () => {

    const { userId } = useAuth();
    const draftContext = useDraft();
    const socket = draftContext?.socket;
    const [draftOrder, setDraftOrder] = useState<DraftPick[]>();
    const [pickCountToTurn, setPickCountToTurn] = useState(0);
    const [nextPickNumber, setNextPickNumber] = useState(0);
  
    useEffect(() => {
        // Set up the event listener first
  
        socket?.on('send-draft-order', (updatedDraftOrder: DraftPick[]) => {
            setDraftOrder(updatedDraftOrder);

            for (let i = 0; i < updatedDraftOrder.length; i++) {
                if (updatedDraftOrder[i].user_id === userId && !updatedDraftOrder[i].is_picked) {
                    setPickCountToTurn(i);
                    setNextPickNumber(updatedDraftOrder[i].pick_number);
                    break;
                }
            }
        });
    }, [socket]);

  return (
    <header className="user-next-pick-notifier">
        <b>{`You're on the clock in: ${pickCountToTurn} picks`}</b>
        <p>{`Round ${Math.ceil(nextPickNumber/10)}, Pick ${((nextPickNumber)%10 || 10) }`}</p>
    </header>
  )
};

export default CenterHeader;