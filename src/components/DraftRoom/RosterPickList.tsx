import '../../css/draftRoom/rosterPickList.css'; // Import CSS for styling
import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '../../env'; // Import API_URL from environment configuration
import { useAuth } from '../../authentication/AuthContext'; // Import authentication context
import { useDraft } from './DraftContext'; // Import draft context
import { User } from '../../utils/users'; // Import User type
import { FaChevronDown } from 'react-icons/fa'; // Import down arrow icon

const RosterPickList = () => {
    // Access the userId from the authentication context
    const { userId } = useAuth();
    
    const modalRef = useRef(null); // Create a ref for the modal dialog
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const draftContext = useDraft(); // Access the draft context
    const draftRoomId = draftContext?.draftRoomId; // Get the draft room ID from the draft context

    const [draftUsers, setDraftUsers] = useState<User[]>([]); // State for draft users
    const [draftBots, setDraftBots] = useState([]); // State for draft bots
    const [draftUser, setDraftUser] = useState<User>(); // State for the current user's draft information

    useEffect(() => {
        if (draftRoomId) {
            // Fetch draft room members data from the API
            fetch(API_URL + "/drafts/members?draftId=" + draftRoomId)
                .then(response => response.json())
                .then(data => {
                    // Find the current user's draft information
                    const user = data.draftUsers.find(user => user.user_id == userId);
                    
                    // Filter out the current user from other draft users
                    const otherDraftUsers = data.draftUsers.filter(user => user.user_id != userId);
                    
                    // Set the state with the fetched data
                    setDraftUsers(otherDraftUsers);
                    setDraftBots(data.draftBots);
                    setDraftUser(user);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [draftRoomId]);

    return (
        <>
        <dialog
            open={isModalOpen}
            ref={modalRef}
            className="roster-list-modal"
            onClick={(e) => { if (e.target == modalRef.current) { setIsModalOpen(false) } }}
        >
            <div className="modal-content">
                <h5>Teams</h5>
                <ul>
                    <li key={`draftUser-${draftUser?.user_id}`}>{`Team ${draftUser?.username}`}</li>
                    
                    {/* Map and display draft users */}
                    {draftUsers.map((user, index) => (
                        <li key={`draftUser-${user.user_id}`}>{`Team ${user.username}`}</li>
                    ))}
                    
                    {/* Map and display draft bots */}
                    {draftBots.map((botNumber, index) => (
                        <li key={`draftBot-${index}`}>{`Team ${botNumber}`}</li>
                    ))}
                </ul>
            </div>
        </dialog>
        <div className="roster-picklist" onClick={() => { setIsModalOpen(true) }}>
            <input type="text" readOnly placeholder={`${draftUser?.username}`} />
            <FaChevronDown className="arrow" />
        </div>
        </>
    )
};

export default RosterPickList; // Export the RosterPickList component as the default export