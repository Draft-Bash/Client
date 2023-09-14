import '../../css/draftRoom/rosterPickList.css';
import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '../../../env';
import { useAuth } from '../../authentication/AuthContext';
import { useDraft } from './DraftContext';
import { User } from '../../utils/users';
import { FaChevronDown } from 'react-icons/fa';

const RosterPickList = () => {

    const { userId } = useAuth();
    const modalRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const draftContext = useDraft();
    const draftRoomId = draftContext?.draftRoomId;
    const [ draftUsers, setDraftUsers ] = useState<User[]>([]);
    const [ draftBots, setDraftBots ] = useState([]);
    const [ draftUser, setDraftUser ] = useState<User>();

    useEffect(() => {
        if (draftRoomId) {
            fetch(API_URL+"/drafts/members?draftId="+draftRoomId)
        .then(response => response.json())
        .then(data => {
            const user = data.draftUsers.find(user => user.user_id == userId);
            const otherDraftUsers = data.draftUsers.filter(user => user.user_id != userId);
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
        <dialog open={isModalOpen} ref={modalRef} className="roster-list-modal"
        onClick={(e) => {if (e.target==modalRef.current) {setIsModalOpen(false)}}}
        >
            <div className="modal-content">
                <h5>Teams</h5>
                <ul>
                    <li key={`draftUser-${draftUser?.user_id}`}>{`Team ${draftUser?.username}`}</li>
                    
                    {draftUsers.map((user, index) => (
                        <li key={`draftUser-${user.user_id}`}>{`Team ${user.username}`}</li>
                    ))}

                    {draftBots.map((botNumber, index) => (
                        <li key={`draftBot-${index}`}>{`Team ${botNumber}`}</li>
                    ))}
                </ul>
            </div>
        </dialog>
        <div className="roster-picklist" onClick={() => {setIsModalOpen(true)}}>
            <input type="text" readOnly placeholder={`${draftUser?.username}`} />
            <FaChevronDown className="arrow" />
        </div>
        </>
    )
};

export default RosterPickList;