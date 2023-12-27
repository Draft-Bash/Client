import React, { useRef, useState, useEffect } from "react";
import "../../../css/userInviter.css";
import { User } from "../../../dataTypes/User";
import TextInput from "../../inputs/TextInput";
import {RxCross1} from 'react-icons/rx';
import { useAuth } from "../../../contexts/AuthContext";
import TranslucentButton from "../../buttons/TranslucentButton";
import CloseButton from "../../buttons/CloseButton";
const API_URL = import.meta.env.VITE_API_URL;

interface Props {
	setInvitedUserIds(invitedUserIds: number[]): void;
    teamsCount: number;
    invitedUsers?: User[];
}

const DraftInviter = (props: Props) => {
	const modalRef = useRef(null);
    const { user } = useAuth();
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

	const search = async (searchInput: string, e) => {
        e.preventDefault();
        if (searchInput.length > 3) {
            try {
                const response = await fetch(API_URL + "/users/search", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: searchInput,
                    }),
                });
    
                const result = await response.json();
                console.log(result);
                const matchingUser: User | null = result.matching_user
                const similarUsernames: User[] = result.similar_users;
                const currentUsernames: string[] = users.map(user => user.username);

                if (matchingUser && users.length < props.teamsCount-1
                && !currentUsernames.includes(matchingUser.username) && matchingUser.user_id!=user?.user_id) {
                    const userList = [...users, matchingUser];
                    const userIds: number[] = userList.map(user => user.user_id);
                    props.setInvitedUserIds(userIds);
                    setUsers(userList);
                }
                else if (!matchingUser) {
                    if (similarUsernames.length > 0) {
                        window.alert(`There is no '${searchInput}'. Did you mean any of the following?
                        ${similarUsernames.slice(0, similarUsernames.length-2)}`)
                    }
                    else {
                        window.alert(`There is no '${searchInput}'.`);
                    }
                }
                else if (currentUsernames.includes(searchInput)) {
                    window.alert(`'${searchInput}' has already been invited`);
                }
                else if (users.length > props.teamsCount-2) {
                    window.alert(`
                        Maximum number of users have been invited. 
                        Remove some or change the number of teams in the draft`
                    );
                }
                else if (matchingUser?.user_id==user?.user_id) {
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
        <TranslucentButton handleOnClick={() => setIsOpen(true)}>Invite Users</TranslucentButton>
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
                <form className="invite-user">
                    <CloseButton handleOnClick={() => {setIsOpen(false)}} />
                    <TextInput
                        value={searchValue}
                        placeholder="Invite user by username"
                        onChange={setSearchValue}
                    />
                    <TranslucentButton handleOnClick={(e) => search(searchValue, e)}>
                        Invite
                        </TranslucentButton>
                </form>
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

export default DraftInviter;
