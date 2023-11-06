import React, { useRef, useState, useEffect } from "react";
import "../css/invites.css";
import { useAuth } from "../authentication/AuthContext";
import {AiOutlineMail} from 'react-icons/ai';
import { useNavigate } from "react-router-dom";
import {RxCross1} from 'react-icons/rx';
const API_URL = import.meta.env.VITE_API_URL;

interface Invite {
    user_id: number;
    draft_id: number;
    is_invite_read: false;
    username: string;
    team_count: number;
    scoring_type: string;
}


const Invites = () => {
	const modalRef = useRef(null);
    const {userId} = useAuth();
	const [isOpen, setIsOpen] = useState(false);
    const [invites, setInvites] = useState<Invite[]>();
    const [unreadInviteCount, setUnreadInviteCount] = useState(0);
    const navigate = useNavigate();

    const updateInvite = async (isAccepted: boolean, draftId: number) => {
        await fetch(API_URL+"/draft-invites", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                draftId: draftId
            }),
        });
        setInvites(invites?.filter((invite) => invite.draft_id != draftId));
        if (isAccepted) {
            navigate('/modules/drafts/draftroom/'+draftId);
            setIsOpen(false);
        }
    }

    const openInvites = async () => {
        await fetch(API_URL+"/draft-invites/read?userId="+userId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: null,
        });
        setUnreadInviteCount(0);
        setIsOpen(true);
    }
    
    useEffect(() => {
        fetch(API_URL+'/draft-invites?userId='+userId)
        .then(response => {
            return response.json();
        })
        .then(inviteList => {
            setUnreadInviteCount(inviteList.filter((invite) => !invite.is_invite_read).length);
            setInvites(inviteList);
        })
    }, [userId]);

	return (
		<>
            <div className="open-invites">
                <AiOutlineMail className={isOpen ? 'open-invite-icon active' : 'open-invite-icon'}
                onClick={() => openInvites()}
                />
                <i>{(unreadInviteCount>0) ? unreadInviteCount: ""}</i>
            </div>
			<dialog
				open={isOpen}
				ref={modalRef}
				onClick={(e) => {
					if (e.target == modalRef.current) {
						setIsOpen(false);
					}
				}}
				className="modal" 
			>
                <div className="invites">
                    <h4>
                        <RxCross1 className='close'
                        onClick={() => setIsOpen(false)}/>
                        Invites
                    </h4>
                    <ul>
                        {invites?.map((invite) => (
                        <li key={invite.draft_id}>
                            <p>
                            {invite.username} invited you to their {invite.team_count}-team{" "}
                            {invite.scoring_type} draft. 
                            </p>
                            <b className="accept" onClick={() => updateInvite(true, invite.draft_id)}>
                            Accept</b> or <b className="decline" onClick={() => updateInvite(false, invite.draft_id)}>
                            decline</b>
                        </li>
                        ))}
                    </ul>
                </div>
			</dialog>
		</>
	);
};

export default Invites;
