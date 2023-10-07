import '../../../css/draftRoom/center/draftCenter.css';
import React, { useEffect, useState } from 'react';
import { DraftPick } from '../../../utils/draft';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../../authentication/AuthContext';

const CenterHeader = () => {

    const { userId } = useAuth();
    const draftContext = useDraft();
    const socket = draftContext?.socket;
    const isDraftStarted = draftContext?.isDraftStarted;
    const [draftOrder, setDraftOrder] = useState<DraftPick[]>();
    const [pickCountToTurn, setPickCountToTurn] = useState(0);
    const [nextPickNumber, setNextPickNumber] = useState(0);
    
  
    useEffect(() => {
        console.log(isDraftStarted);
    }, [isDraftStarted]);

    useEffect(() => {
  
        socket?.on('send-draft-order', (updatedDraftOrder: DraftPick[]) => {
            setDraftOrder(updatedDraftOrder);

            for (let i = 0; i < updatedDraftOrder.length; i++) {
                if (updatedDraftOrder[i].user_id === userId) {
                    setPickCountToTurn(i);
                    setNextPickNumber(updatedDraftOrder[i].pick_number);
                    break;
                }
            }
        });
    }, [socket]);

  return (
    <header className="user-next-pick-notifier">
        {(pickCountToTurn>0 && isDraftStarted) && (
            <b>{`You're on the clock in: ${pickCountToTurn} picks`}</b>
        )}
        {(!isDraftStarted) && (
            <b>Waiting for the owner to start the draft</b>
        )}
        {(isDraftStarted && pickCountToTurn<1 && draftOrder?.some((user) => user.user_id === userId)) && (
            <b>{`You are on the clock`}</b>
        )}
        {(!draftOrder?.some((user) => user.user_id === userId)) && (
            <b>{`Your draft is over`}</b>
        )}
        <b>.</b>
        {(!draftOrder?.some((user) => user.user_id === userId)) && (
            <p></p>
        )}
        {(isDraftStarted && draftOrder?.some((user) => user.user_id === userId)) && (
            <p>{`Round ${Math.ceil(nextPickNumber/10)}, Pick ${((nextPickNumber)%10 || 10) }`}</p>
        )}
    </header>
  )
};

export default CenterHeader;