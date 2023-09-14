// Import the CSS file for styling
import '../../../css/draftRoom/center/draftCenter.css';

// Import necessary React hooks and components
import React, { useEffect, useState } from 'react';

// Import the DraftPick type from utils for type checking
import { DraftPick } from '../../../utils/draft';

// Import the draft context for accessing draft-related data
import { useDraft } from '../DraftContext';

// Import the authentication context for user-related data
import { useAuth } from '../../../authentication/AuthContext';

// Define the CenterHeader component
const CenterHeader = () => {
    // Access the user ID from the authentication context
    const { userId } = useAuth();

    // Access the draft context
    const draftContext = useDraft();
    const socket = draftContext?.socket;

    // Initialize state variables for draft order, pick count to turn, and next pick number
    const [draftOrder, setDraftOrder] = useState<DraftPick[]>();
    const [pickCountToTurn, setPickCountToTurn] = useState(0);
    const [nextPickNumber, setNextPickNumber] = useState(0);

    useEffect(() => {
        // Listen for the 'send-draft-order' socket event and update draft order
        socket?.on('send-draft-order', (updatedDraftOrder: DraftPick[]) => {
            setDraftOrder(updatedDraftOrder);

            // Iterate through the draft order to find the user's next pick
            for (let i = 0; i < updatedDraftOrder.length; i++) {
                if (updatedDraftOrder[i].user_id === userId && !updatedDraftOrder[i].is_picked) {
                    // Update pick count to turn and next pick number
                    setPickCountToTurn(i);
                    setNextPickNumber(updatedDraftOrder[i].pick_number);
                    break;
                }
            }
        });
    }, [socket]);

    return (
        <header className="user-next-pick-notifier">
            {/* Display information about the user's next pick */}
            <b>{`You're on the clock in: ${pickCountToTurn} picks`}</b>
            <p>{`Round ${Math.ceil(nextPickNumber / 10)}, Pick ${((nextPickNumber) % 10 || 10)}`}</p>
        </header>
    )
};

export default CenterHeader; // Export the CenterHeader component as the default export