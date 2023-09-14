// Import necessary modules and components
import '../css/signupPage.css';
import React, { useState, useEffect } from 'react';
import TextInput from "../components/TextInput";
import { API_URL } from '../env';
import { useAuth } from '../authentication/AuthContext';
import { IoMdCheckmark } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

// Define the SignupPage component
const SignupPage = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook for navigation
  const [username, setUsername] = useState(""); // State variable for username input
  const [usernameValidationMessage, setInvalidUsernameMessage] = useState(""); // State variable for username validation message
  const [isUsernameValid, setUsernameValidity] = useState(false); // State variable to track username validity
  const [email, setEmail] = useState(""); // State variable for email input
  const [emailValidationMessage, setInvalidEmailMessage] = useState(""); // State variable for email validation message
  const [password, setPassword] = useState(""); // State variable for password input
  const [passwordValidationMessage, setInvalidPasswordMessage] = useState(""); // State variable for password validation message
  const [passwordConfirm, setPasswordConfirm] = useState(""); // State variable for password confirmation
  const { setIsAuthenticated } = useAuth(); // Get the setIsAuthenticated function from the authentication context

  // UseEffect to validate the username input
  useEffect(() => {
    try {
      if (username.length === 0) {
        setInvalidUsernameMessage("");
        setUsernameValidity(true);
      } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
        setInvalidUsernameMessage("Username can only contain numbers or letters");
        setUsernameValidity(false);
      } else {
        setInvalidUsernameMessage("");
        setUsernameValidity(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [username]);

  // Function to handle form submission
  const onSubmit = async (e: any) => {
    e.preventDefault();

    // Initialize variables to track input validation
    let isUsernameValid = true;
    let isEmailValid = true;
    let isPasswordValid = true;

    // Validate username
    if (username.length < 3 || username.length > 15) {
      setInvalidUsernameMessage("Username must be between 3 and 15 characters");
      isUsernameValid = false;
    } else if (username.length > 3 && username.length < 15) {
      setInvalidUsernameMessage("");
      isUsernameValid = true;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInvalidEmailMessage("Invalid email");
      isEmailValid = true;
    } else if (email.length === 0) {
      setInvalidEmailMessage("Email is required");
      isEmailValid = false;
    } else {
      setInvalidEmailMessage("");
      isEmailValid = true;
    }

    // Validate password
    if (password !== passwordConfirm) {
      setInvalidPasswordMessage("Passwords do not match");
      isPasswordValid = false;
    } else if (password.length === 0) {
      setInvalidPasswordMessage("Password is required");
      isPasswordValid = false;
    } else {
      setInvalidPasswordMessage("");
      isPasswordValid = true;
    }

    // If all input is valid, send a POST request to create a new user
    if (isUsernameValid && isEmailValid && isPasswordValid) {
      try {
        const response = await fetch(API_URL + "/users", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password
          })
        });

        const signupResponse = await response.json();

        // Check if the username and email are unique
        if (!signupResponse.uniqueColumns.isUsernameUnique) {
          setInvalidUsernameMessage("Username must be unique");
        }
        if (!signupResponse.uniqueColumns.isEmailUnique) {
          setInvalidEmailMessage("Email must be unique");
        }

        // If both username and email are unique, set user authentication and navigate to the dashboard
        if (signupResponse.uniqueColumns.isEmailUnique && signupResponse.uniqueColumns.isUsernameUnique) {
          localStorage.setItem('jwtToken', signupResponse.jwtToken);
          setIsAuthenticated(true);
          localStorage.setItem("previousPagePath", "/modules/dashboard");
          navigate('/modules/dashboard');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="authentication-page">
      <>
        <h3>Draftbash</h3>
        <form className="authentication-form">
          <h1>Signup<a href="/login">Login</a></h1>
          {/* Input field for username */}
          <TextInput placeholder="Username" onChange={setUsername} />
          {/* Display username validation message */}
          <p className="invalid">{usernameValidationMessage}</p>
          {/* Input field for email */}
          <TextInput placeholder="Email" onChange={setEmail} />
          {/* Display email validation message */}
          <p className="invalid">{emailValidationMessage}</p>
          {/* Input field for password */}
          <TextInput placeholder="Password" isPassword={true} onChange={setPassword} />
          {/* Display password validation message */}
          <p className="invalid">{passwordValidationMessage}</p>
          {/* Input field for password confirmation */}
          <TextInput placeholder="Confirm password" isPassword={true} onChange={setPasswordConfirm} />
          <div className="password-rules">
            <p className={(password.length > 8) ? "valid" : "invalid" }><IoMdCheckmark /> Minimum of 8 characters</p>
            <p className={/[A-Z]/.test(password) ? "valid" : "invalid" }><IoMdCheckmark /> At least one capital letter</p>
            <p className={/\d/.test(password) ? "valid" : "invalid" }><IoMdCheckmark /> At least one number</p>
          </div>
          {/* Button to submit the form */}
          <button onClick={onSubmit}>Sign up</button>
        </form>
      </>
    </div>
  );
};

export default SignupPage;