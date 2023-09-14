// Import the CSS file for styling
import '../../../css/draftRoom/picksQueue.css';

// Import necessary React hooks and components
import React, { useEffect, useState } from 'react';

// Import the draft context for accessing draft-related data
import { useDraft } from '../DraftContext';

// Import the authentication context for user-related data
import { useAuth } from '../../../authentication/AuthContext';

// Import the DraftPick type from utils for type checking
import { DraftPick } from '../../../utils/draft';

// Define the PicksQueue component
const PicksQueue = () => {
    // Access the draft context
    const draftContext = useDraft();
    const socket = draftContext?.socket;

    // Access the user ID from the authentication context
    const { userId } = useAuth();

    // Initialize state variables for draft order and the user's next pick
    const [draftOrder, setDraftOrder] = useState<DraftPick[]>();
    const [userNextPick, setUserNextPick] = useState<null | DraftPick>(null);

    // Function to find the user's next pick in the draft order
    function findUserNextPick(pickOrderList: DraftPick[]) {
        for (let i = 0; i < pickOrderList.length; i++) {
            if (pickOrderList[i].user_id == userId && !pickOrderList[i].is_picked) {
                setUserNextPick(pickOrderList[i]);
                break;
            }
        }
    }

    useEffect(() => {
        // Listen for the 'send-draft-order' socket event and update draft order
        socket?.on('send-draft-order', (updatedDraftOrder: DraftPick[]) => {
            console.log(updatedDraftOrder); // Log the updated draft order
            setDraftOrder(updatedDraftOrder); // Update the draft order state
        });
    }, [socket]);

    useEffect(() => {
        if (draftOrder) {
            // Find the user's next pick when the draft order changes
            findUserNextPick(draftOrder);
        }
    }, [draftOrder]);

    return (
        <>
        {/* Display the user's next pick information */}
        <p className="picks-until-user-turn">
            ON THE CLOCK: PICK {userNextPick?.pick_number}
            <br></br><b>Team {userNextPick?.username}</b>
        </p>
        <ul>
            {/* Display the next 15 spots in the draft order */}
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

export default PicksQueue; // Export the PicksQueue component as the default export