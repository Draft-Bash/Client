import '../../css/chatRoom.css';
import React, { useEffect, useState, useRef } from 'react';
import { useDraft } from './DraftContext';
import TextInput from '../TextInput';
import {BsChatFill} from 'react-icons/bs';
import { useAuth } from '../../authentication/AuthContext';
import TranslucentButton from '../buttons/TranslucentButton';

interface Message {
  username: string;
  message: string;
}

const ChatRoom = () => {

    const draftContext = useDraft();
    const socket = draftContext?.socket;
    const draftId = draftContext?.draftId;
    const {username} = useAuth()
    const modalRef = useRef(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const sendMessage = (message: string) => {
        socket?.emit('send-message', message, username);
    }
  
    useEffect(() => {
        if (draftId) {
            socket?.on('receive-message', (message: Message) => {
                let messageList = [...messages, message];
                console.log(message);
                messages.push({message: message.message, username: username});
                setMessages(messageList);
                setUnreadMessageCount(unreadMessageCount+1);
                if (isOpen) {
                  setUnreadMessageCount(0)
                } else{
                  setUnreadMessageCount(unreadMessageCount+1);
                }
            });
        }
    }, [draftId]);

    return (
        <>
        <BsChatFill onClick={() => {setIsOpen(true); setUnreadMessageCount(0)}} className="chat-icon" />
        {unreadMessageCount > 0 && (
          <b className='chat-message-count'>
            {unreadMessageCount}
          </b>
        )}
        <dialog open={isOpen} ref={modalRef} 
            onClick={(e) => {if (e.target==modalRef.current) {setIsOpen(false)}}} className="modal"
        >
          <div className="chat-room">
            <ul className="messages">
              {messages.map((message: Message, index: number) => (
                <li key={index}>
                    {username==message.username && (
                      <p className='sent-by-self'>{message.message}</p>
                    )}
                    {username!=message.username && (
                      <p className='sent-by-other'>{message.username}: {message.message}</p>
                    )}
                </li>
              ))}
            </ul>
            <div className="send-text">
              <label>Message</label>
              <TextInput value={message} placeholder="Enter message" onChange={setMessage} />
              <TranslucentButton handleOnClick={() => {setMessage(""); sendMessage(message)}}>Send</TranslucentButton>
            </div>
          </div>
        </dialog>
        </>
      );
};

export default ChatRoom;