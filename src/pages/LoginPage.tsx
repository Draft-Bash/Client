// LoginPage.js
import '../css/signupPage.css'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from "../components/TextInput";
import { API_URL } from '../../env';
import { useAuth } from '../authentication/AuthContext';

const LoginPage = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isCredentialsFalse, setIsCredentialsFalse] = useState(false)
    const { setIsAuthenticated } = useAuth();

    const handleLogin = async (e: any) => {
        e.preventDefault();
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
            console.log("Invalid username or password");
            setIsCredentialsFalse(true);
        }
    }

    return (
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
    );
};
  
export default LoginPage;