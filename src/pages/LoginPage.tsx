// Import necessary modules and components
import '../css/signupPage.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from "../components/TextInput";
import { API_URL } from '../env';
import { useAuth } from '../authentication/AuthContext';

// Define the LoginPage component
const LoginPage = () => {
    // Initialize state variables for name, password, and credentials validation
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isCredentialsFalse, setIsCredentialsFalse] = useState(false);
    const { setIsAuthenticated } = useAuth(); // Get the setIsAuthenticated function from the authentication context
    const navigate = useNavigate(); // Initialize the useNavigate hook for navigation

    // Function to handle user login
    const handleLogin = async (e: any) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            // Send a POST request to the login API with user credentials
            const response = await fetch(API_URL + '/users/login', {
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

            // Get the JWT token from the response and store it in local storage
            const jwtToken = await response.json();
            localStorage.setItem('jwtToken', jwtToken);
            
            // Set user authentication status to true
            setIsAuthenticated(true);

            // Set the previous page path for redirection after login
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
                {/* Input field for username or email */}
                <TextInput placeholder="Username or email" onChange={setName} />
                {/* Display an error message if credentials are false */}
                {isCredentialsFalse && (
                    <p className="invalid">Invalid username or password</p>
                )}
                {/* Input field for password */}
                <TextInput placeholder="Password" isPassword={true} onChange={setPassword} />
                {/* Button to initiate login */}
                <button onClick={handleLogin}>Continue</button>
            </form>
        </div>
    );
};
  
export default LoginPage;