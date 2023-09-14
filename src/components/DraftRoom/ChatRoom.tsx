import '../../css/chatRoom.css'; // Import CSS for styling
import React, { useEffect, useState, useRef } from 'react';
import { useDraft } from './DraftContext'; // Import draft context
import TextInput from '../TextInput'; // Import TextInput component for user input
import { BsChatFill } from 'react-icons/bs'; // Import chat icon

const ChatRoom = () => {
    const draftContext = useDraft(); // Access the draft context
    const socket = draftContext?.socket; // Access the socket from the draft context
    const draftRoomId = draftContext?.draftRoomId; // Access the draft room ID from the draft context
    const modalRef = useRef(null); // Create a ref for the modal dialog
    const [message, setMessage] = useState(""); // State for the user's message
    const [messages, setMessages] = useState<string[]>([]); // State for chat messages
    const [isOpen, setIsOpen] = useState(false); // State for modal visibility

    // Function to send a chat message
    const sendMessage = (message: string) => {
        socket?.emit('send-message', message, draftRoomId); // Emit a socket event to send the message
        let messageList = [...messages, message];
        messages.push(message);
        setMessages(messageList);
    }

    useEffect(() => {
        if (draftRoomId) {
            // Listen for incoming chat messages from the server
            socket?.on('receive-message', (message: string) => {
                let messageList = [...messages, message];
                messages.push(message);
                setMessages(messageList);
            });

            // Listen for the socket connection event
            socket?.on('connect', () => {
                console.log("Socket connected");
            });
        }
    }, [draftRoomId]);

    return (
        <>
        <BsChatFill onClick={() => setIsOpen(true)} className="chat-icon" /> {/* Display chat icon */}
        <dialog
            open={isOpen}
            ref={modalRef}
            onClick={(e) => { if (e.target == modalRef.current) { setIsOpen(false) } }}
            className="modal"
        >
            <div className="chat-room">
                <ul className="messages">
                    {/* Map and display chat messages */}
                    {messages.map((message: string, index: number) => (
                        <li key={index}>{message}</li>
                    ))}
                </ul>
                <div className="send-text">
                    <label>Message</label>
                    <TextInput placeholder="Enter message" onChange={setMessage} /> {/* Display input field for user message */}
                    <button onClick={() => sendMessage(message)}>Send</button> {/* Display send button */}
                </div>
            </div>
        </dialog>
        </>
    );
};

export default ChatRoom; // Export the ChatRoom component as the default export