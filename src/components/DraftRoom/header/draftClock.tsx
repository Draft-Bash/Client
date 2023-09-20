import '../../../css/draftRoom/draftClock.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useDraft } from '../DraftContext';

const DraftClock = () => {

    const draftContext = useDraft();
    const socket = draftContext?.socket;
    const draftRoomId = draftContext?.draftRoomId;
    const [time, setTime] = useState(0)

    useEffect(() => {
        if (draftRoomId) {
            socket?.on('update-clock', (remainingTime: number) => {
                setTime(remainingTime);
            });
        }
    }, [draftRoomId]);
  
    return (
        <div className="draft-clock">
            {time}
        </div>
    );
    };
  
export default DraftClock;