import React, { useRef, useState, useEffect } from "react";
import "../css/userInviter.css";
import TextInput from "./TextInput";
import { User } from "../utils/users";
import {RxCross1} from 'react-icons/rx';
import { useAuth } from "../authentication/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;

interface Props {
	setInvitedUserIds(invitedUserIds: number[]): void;
    teamsCount: number;
    invitedUsers?: User[];
}

const UserInviter = (props: Props) => {
	const modalRef = useRef(null);
    const {userId} = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (users.length > props.teamsCount) {
            const userList = users.slice(0, props.teamsCount-1)
            setUsers(userList);
            props.setInvitedUserIds(userList.map(user => user.user_id));
        }
    }, [props.teamsCount])

    useEffect(() => {
        if (props.invitedUsers) {
            setUsers(props.invitedUsers);
        }
    }, [props.invitedUsers]);

    const removeUser = (username: string) => {
        const userList = users.filter(user => user.username !== username);
        const userIds: number[] = userList.map(user => user.user_id);
        props.setInvitedUserIds(userIds);
        setUsers(userList);
    }

	const search = async (searchInput: string) => {
        if (searchInput.length > 3) {
            try {
                const response = await fetch(API_URL + "/drafts/invite", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: searchInput,
                    }),
                });
    
                const responseData= await response.json();
                const responseUsers: User[] = responseData.users;
                const currentUsernames: string[] = users.map(user => user.username);

                if (responseData.isMatch && users.length < props.teamsCount-1
                && !currentUsernames.includes(responseUsers[0].username) && responseUsers[0].user_id!=userId) {
                    const userList = [...users, responseUsers[0]];
                    const userIds: number[] = userList.map(user => user.user_id);
                    props.setInvitedUserIds(userIds);
                    setUsers(userList);
                }
                else if (!responseData.isMatch) {
                    let similarNames = "";
                    responseUsers.forEach(user => {
                        similarNames+=user.username+", "
                    })
                    if (similarNames) {
                        similarNames.slice(0, similarNames.length-3);
                        window.alert(`There is no '${searchInput}'. Did you mean any of the following?
                        ${similarNames.slice(0, similarNames.length-2)}`)
                    }
                    else {
                        window.alert(`There is no '${searchInput}'.`);
                    }
                }
                else if (currentUsernames.includes(responseUsers[0].username)) {
                    window.alert(`'${searchInput}' has already been invited`);
                }
                else if (users.length > props.teamsCount-2) {
                    window.alert(`
                        Maximum number of users have been invited. 
                        Remove some or change the number of teams in the draft`
                    );
                }
                else if (responseUsers[0].user_id==userId) {
                    window.alert(`You cannot invite yourself`);
                }
                setSearchValue("");
            } catch (error) {
                console.error("Fetch Error:", error);
            }
        }
	};

	return (
		<>
			<button className="open-user-inviter" onClick={() => setIsOpen(true)}>
				Invite Users
			</button>
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
				<div className="user-inviter">
					<div className="invite-user">
						<TextInput
							value={searchValue}
							placeholder="Invite user by username"
							onChange={setSearchValue}
						/>
						<button onClick={() => search(searchValue)}>Invite</button>
					</div>
					<ul>
						{users?.map((user, index) => (
							<li key={index}>
                                {user.username}
                                <RxCross1 className="remove"
                                onClick={() => removeUser(user.username)}
                                />
                            </li>
						))}
					</ul>
				</div>
			</dialog>
		</>
	);
};

export default UserInviter;
