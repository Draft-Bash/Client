import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import TextInput from '../../inputs/TextInput';
import RoundedButton from '../../buttons/RoundedButton';
const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
    
  const [email, setEmail] = useState('');
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const resetPasswordModalRef = useRef(null);

  const submitPasswordResetEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email)) {
      try {
        const response = await fetch(`${API_URL}/users/reset-passwords/emails`, {
          method: 'POST',
          body: JSON.stringify({
            email: email,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {}
      alert('Email sent to ' + email);
      setEmail('');
      setIsPasswordResetModalOpen(false);
    } else {
      alert('Invalid email');
    }
  };

  return (
    <StyledForgotPassword>
        <dialog
        open={isPasswordResetModalOpen}
        ref={resetPasswordModalRef}
        onClick={(e) => {
            if (e.target == resetPasswordModalRef.current) {
            setIsPasswordResetModalOpen(false);
            }
        }}
        >
            <div className="forgot-password-modal">
                <p>Enter the email associated with the account whose password you want to change.</p>
                <TextInput value={email} placeholder="Email" onChange={setEmail} />
                <RoundedButton color="blue" handleOnClick={submitPasswordResetEmail}>
                    Submit Email
                </RoundedButton>
            </div>
        </dialog>
        <p className="forgot-password-btn" onClick={() => setIsPasswordResetModalOpen(true)}>
            Forgot Password?
        </p>
    </StyledForgotPassword>
  );
};

const StyledForgotPassword = styled.div`

    dialog {
        position: fixed; /* Stay in place */
        z-index: 10; /* Sit on top of everything */
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        border: none;
        overflow: auto;
    }

    forgot-password-modal {
        background-color: var(--coolWhite);
        min-height: 250px;
        margin: auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        padding: 20px;
        width: 500px;
        height: 250px;
        min-width: 500px;
        overflow: auto;
        border-radius: 10px;
        box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
        z-index: 100;
        margin-top: 50px;
    }

    .forgot-password-modal {
        background-color: var(--coolWhite);
        min-height: 250px;
        margin: auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        padding: 20px;
        width: 500px;
        height: 250px;
        min-width: 500px;
        overflow: auto;
        border-radius: 10px;
        box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
        z-index: 100;
        margin-top: 50px;
    }

    .forgot-password-btn {
        cursor: pointer;
        width: 145px;
    }
`;


export default ForgotPassword;