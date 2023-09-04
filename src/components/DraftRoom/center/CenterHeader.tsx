import '../../../css/draftRoom/center/draftCenter.css';
import { useEffect, useState } from 'react';
import { useDraft } from '../DraftContext';
import { useAuth } from '../../authentication/AuthContext';

const CenterHeader = () => {

    const { userId } = useAuth();
    const {socket, draftRoomId } = useDraft();
    const [draftOrder, setDraftOrder] = useState<Pick>([]);
    const [pickCountToTurn, setPickCountToTurn] = useState(0);
    const [nextPickNumber, setNextPickNumber] = useState(0);
  
    useEffect(() => {
        // Set up the event listener first
  
        socket?.on('send-draft-order', (updatedDraftOrder: number[]) => {
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