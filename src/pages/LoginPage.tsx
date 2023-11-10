// LoginPage.js
import '../css/authenticationPage.css'
import React, { useState, useEffect, useRef } from 'react';
import TextInput from "../components/TextInput";
import { useAuth } from '../authentication/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import RoundedButton from '../components/buttons/RoundedButton';
const API_URL = import.meta.env.VITE_API_URL;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const LoginPage = () => {

    // This will ping the server to wake it up and prepare it to handle requests
    useEffect(() => {
        fetch(SERVER_URL+'/ping')
            .then(response => response.json())
            .then(data => {
                console.log(data);  // Just for logging, can be removed
            })
            .catch(error => {
                console.error('Error pinging the server:', error);
            });
    }, []);
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isCredentialsFalse, setIsCredentialsFalse] = useState(false)
    const [isLoadingScreen, setIsLoadingScreen] = useState(false);
    const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
    const { setIsAuthenticated } = useAuth();
    const resetPasswordModalRef = useRef(null);

    const submitPasswordResetEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(email)) {
            try {
                const response = await fetch(API_URL+'/users/reset-passwords/emails', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email
                     }),
                    headers: {
                      'Content-Type': 'application/json'
                    }
                });
            } catch (error) {}
            alert("Email sent to "+email)
            setEmail("");
            setIsPasswordResetModalOpen(false);

        }
        else {
            alert("Invalid email");
        }
    }

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setIsLoadingScreen(true);
        try {
            const response = await fetch(API_URL+'/users/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: name,
                    email: name,
                    password: password,
                 }),
                headers: {
                  'Content-Type': 'application/json'
                }
            });

            const jwtToken = await response.json();
            if (jwtToken) {
                localStorage.setItem('jwtToken', jwtToken);
                setIsAuthenticated(true);
                localStorage.setItem("previousPagePath", "/modules/dashboard");
            }
            else {
                setIsCredentialsFalse(true);
                setIsLoadingScreen(false);
            }
        } catch (error) {
            setIsCredentialsFalse(true);
            setIsLoadingScreen(false);
        }
    }

    return (
        <>
        <dialog
            open={isPasswordResetModalOpen}
            ref={resetPasswordModalRef}
            onClick={(e) => {
                if (e.target == resetPasswordModalRef.current) {
                    setIsPasswordResetModalOpen(false);
                }
            }}
            className="modal" 
		>
            <div className='forgot-password-modal'>
                <p>
                    Enter the email associated with the account whose password you want to change.
                </p>
                <TextInput value={email} placeholder="Email" onChange={setEmail} />
                <RoundedButton color="blue" handleOnClick={submitPasswordResetEmail}>Submit Email</RoundedButton>
            </div>
		</dialog>
        {isLoadingScreen && <LoadingScreen />}
        <div className="authentication-page">
            <h3>DraftBash</h3>
            <form className="authentication-form">
                <h1>Login<a href="/signup">Signup</a></h1>
                <TextInput placeholder="Username or email" onChange={setName} />
                {isCredentialsFalse && (
                    <p className="invalid">Invalid username or password</p>
                )}
                <TextInput placeholder="Password" isPassword={true} onChange={setPassword} />
                <p className='forgot-password-btn' onClick={() => setIsPasswordResetModalOpen(true)}>
                    Forgot Password?
                </p>
                <button onClick={handleLogin}>Login</button>
                <button className="google-auth" onClick={() => setIsLoadingScreen(true)}>
                    <img src="images/google-icon.png" alt="google-signin"></img>
                    <a href={SERVER_URL+"/auth/google"}>
                        Sign in with Google
                    </a>
                </button>
            </form>
        </div>
        </>
    );
};
  
export default LoginPage;