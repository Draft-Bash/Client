import '../../../css/draftRoom/center/draftCenter.css';
import '../../../css/modal.css';
import React, { useEffect, useState, useRef } from 'react';
import {RxCross1} from 'react-icons/rx';
import { DraftPick } from '../../../utils/draft';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../../authentication/AuthContext';
import DraftGrade from '../draftGrade';
const API_URL = import.meta.env.VITE_API_URL;

const CenterHeader = () => {

    const { userId } = useAuth();
    const modalRef = useRef(null);
    const draftContext = useDraft();
    const socket = draftContext?.socket;
    const draftId = draftContext?.draftId;
    const isDraftStarted = draftContext?.isDraftStarted;
    const [draftOrder, setDraftOrder] = useState<DraftPick[]>();
    const [pickCountToTurn, setPickCountToTurn] = useState(0);
    const [nextPickNumber, setNextPickNumber] = useState(0);
    const [draftGrade, setDraftGrade] = useState('');
    const [draftRank, setDraftRank] = useState(0);
    const [projectedFanPtsTotal, setProjectedFanPtsTotal] = useState(0);
    const [isDraftGradeOpen, setIsDraftGradeOpen] = useState(false);

    useEffect(() => {
        if (draftOrder?.length==0) {
            fetch(API_URL+`/drafts/grades?userId=${userId}&draftId=${draftId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
                })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    setDraftGrade(data.grade);
                    setDraftRank(data.rank)
                    setProjectedFanPtsTotal(data.totalFanPts)
                    setIsDraftGradeOpen(true);
                })
        }
    }, [draftOrder]);

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
    <>
    <DraftGrade draftGrade={draftGrade} 
    draftRank={draftRank} 
    projectFanPtsTotal={projectedFanPtsTotal}
    isOpen={isDraftGradeOpen}
    />
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
    </>
  )
};

export default CenterHeader;