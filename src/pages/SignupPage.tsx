import '../css/authenticationPage.css'
import React, { useState, useEffect } from 'react';
import TextInput from "../components/TextInput";
import { useAuth } from '../authentication/AuthContext';
import { IoMdCheckmark } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
const API_URL = import.meta.env.VITE_API_URL;

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [usernameValidationMessage, setInvalidUsernameMessage] = useState("");
  const [isUsernameValid, setUsernameValidity] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailValidationMessage, setInvalidEmailMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidationMessage, setInvalidPasswordMessage] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    try {
      if (username.length == 0) {
        setInvalidUsernameMessage("");
        setUsernameValidity(true);
      }
      else if (!/^[a-zA-Z0-9]+$/.test(username)) {
        setInvalidUsernameMessage("Username can only contain numbers or letters");
        setUsernameValidity(false);
      }
      else {
        setInvalidUsernameMessage("");
        setUsernameValidity(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [username]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let isUsernameValid = true;
    let isEmailValid = true;
    let isPasswordValid = true;
    if (username.length < 3 || username.length > 15) {
      setInvalidUsernameMessage("Username must be between 3 and 15 characters");
      isUsernameValid =false
    }
    else if (username.length > 3 && username.length < 15) {
      setInvalidUsernameMessage("");
      isUsernameValid = true;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInvalidEmailMessage("Invalid email");
      isEmailValid = true;
    }
    else if (email.length == 0) {
      setInvalidEmailMessage("Email is required");
      isEmailValid = false;
    }
    else {
      setInvalidEmailMessage("");
      isEmailValid = true;
    }

    if (password != passwordConfirm) {
      setInvalidPasswordMessage("Passwords do not match");
      isPasswordValid = false;
    }
    else if (password.length == 0) {
      setInvalidPasswordMessage("Password is required");
      isPasswordValid = false;
    }
    else {
      setInvalidPasswordMessage("");
      isPasswordValid = true;
    }

    if (isUsernameValid && isEmailValid && isPasswordValid) {
      setIsLoadingScreen(true);
      try {
        const response = await fetch(API_URL+"/users", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password
          })
        })
        
        const signupResponse = await response.json();
        if (!signupResponse.uniqueColumns.isUsernameUnique) {
          setInvalidUsernameMessage("Username must be unique");
          setIsLoadingScreen(false);
        }
        if (!signupResponse.uniqueColumns.isEmailUnique) {
          setInvalidEmailMessage("Email must be unique");
          setIsLoadingScreen(false);
        }

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
}

  return (
    <>
    {isLoadingScreen && <LoadingScreen />}
    <div className="authentication-page">
        <h3>Draftbash</h3>
        <form className="authentication-form">
          <h1>Signup<a href="/login">Login</a></h1>
          <TextInput placeholder="Username" onChange={setUsername} />
          <p className="invalid">{usernameValidationMessage}</p>
          <TextInput placeholder="Email" onChange={setEmail} />
          <p className="invalid">{emailValidationMessage}</p>
          <TextInput placeholder="Password" isPassword={true} onChange={setPassword} />
          <p className="invalid">{passwordValidationMessage}</p>
          <TextInput placeholder="Confirm password" isPassword={true} onChange={setPasswordConfirm} />
          <div className="password-rules">
            <p className={(password.length > 8) ? "valid" : "invalid" }><IoMdCheckmark /> Minimum of 8 characters</p>
            <p className={/[A-Z]/.test(password) ? "valid" : "invalid" }><IoMdCheckmark /> At least one capital letter</p>
            <p className={/\d/.test(password) ? "valid" : "invalid" }><IoMdCheckmark /> At least one number</p>
          </div>
          <button onClick={onSubmit}>Sign up</button>
        </form>
    </div>
    </>
  );
};
  
export default SignupPage;