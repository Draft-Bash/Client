// LoginPage.js
import '../css/signupPage.css'
import React, { useState, useEffect } from 'react';
import TextInput from "../components/TextInput";
import { useAuth } from '../authentication/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
const API_URL = import.meta.env.VITE_API_URL;

const LoginPage = () => {

    // This will ping the server to wake it up and prepare it to handle requests
    useEffect(() => {
        fetch('https://draftbash-test.azurewebsites.net/ping')
            .then(response => response.json())
            .then(data => {
                console.log(data);  // Just for logging, can be removed
            })
            .catch(error => {
                console.error('Error pinging the server:', error);
            });
    }, []);
    
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isCredentialsFalse, setIsCredentialsFalse] = useState(false)
    const [isLoadingScreen, setIsLoadingScreen] = useState(false);
    const { setIsAuthenticated } = useAuth();

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
            localStorage.setItem('jwtToken', jwtToken);
            setIsAuthenticated(true);
            localStorage.setItem("previousPagePath", "/modules/dashboard");
        } catch (error) {
            console.log(error);
            setIsCredentialsFalse(true);
            setIsLoadingScreen(false);
        }
    }

    return (
        <>
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
                <button onClick={handleLogin}>Continue</button>
            </form>
        </div>
        </>
    );
};
  
export default LoginPage;