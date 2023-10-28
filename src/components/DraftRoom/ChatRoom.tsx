import '../../css/chatRoom.css';
import React, { useEffect, useState, useRef } from 'react';
import { useDraft } from './DraftContext';
import TextInput from '../TextInput';
import {BsChatFill} from 'react-icons/bs';

const ChatRoom = () => {

    const draftContext = useDraft();
    const socket = draftContext?.socket;
    const draftId = draftContext?.draftId;
    const modalRef = useRef(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const sendMessage = (message: string) => {
        socket?.emit('send-message', message, draftId);
        let messageList = [...messages, message];
        messages.push(message);
        setMessages(messageList);
    }
  
    useEffect(() => {
        if (draftId) {
            socket?.on('receive-message', (message: string) => {
                let messageList = [...messages, message];
                messages.push(message);
                setMessages(messageList);
            });
        }
    }, [draftId]);

    return (
        <>
        <BsChatFill onClick={() => setIsOpen(true)} className="chat-icon" />
        <dialog open={isOpen} ref={modalRef} 
            onClick={(e) => {if (e.target==modalRef.current) {setIsOpen(false)}}} className="modal"
        >
          <div className="chat-room">
            <ul className="messages">
              {messages.map((message: string, index: number) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
            <div className="send-text">
              <label>Message</label>
              <TextInput value={message} placeholder="Enter message" onChange={setMessage} />
              <button onClick={() => {setMessage(""); sendMessage(message)}}>Send</button>
            </div>
          </div>
        </dialog>
        </>
      );
};

export default ChatRoom;