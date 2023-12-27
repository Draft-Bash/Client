import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TextInput from "../components/inputs/TextInput";
import { useAuth } from '../contexts/AuthContext';
import { IoMdCheckmark } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/pages/LoadingScreen';
import RoundedButton from '../components/buttons/RoundedButton';
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
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const { setIsAuthenticated, setUser } = useAuth();

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

  const handleSignup = async (e: any) => {
    e.preventDefault();
    let isUsernameValid = true;
    let isEmailValid = true;
    let isPasswordValid = true;

    if (username.length < 3 || username.length > 15) {
      setInvalidUsernameMessage("Username must be between 3 and 15 characters");
      isUsernameValid = false;
    } else {
      setInvalidUsernameMessage("");
      isUsernameValid = true;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInvalidEmailMessage("Invalid email");
      isEmailValid = false;
    } else if (email.length === 0) {
      setInvalidEmailMessage("Email is required");
      isEmailValid = false;
    } else {
      setInvalidEmailMessage("");
      isEmailValid = true;
    }

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
        });

        const result = await response.json();

        if (result.jwt_token) {
          const userDataResponse = await fetch(`${API_URL}/users/login?jwt_token=${result.jwt_token}`);
          const userData = await userDataResponse.json();
          setUser(userData);
          localStorage.setItem('jwt_token', result.jwt_token);
          setIsAuthenticated(true);
          localStorage.setItem('previousPagePath', '/modules/login');
          navigate('/modules/drafts');
        }

        if (result.isUsernameUnique === false) {
          setInvalidUsernameMessage("Username must be unique");
          setIsLoadingScreen(false);
        }

        if (result.isUsernameUnique === false) {
          setInvalidEmailMessage("Email must be unique");
          setIsLoadingScreen(false);
        }
      } catch (error) {
        console.log(error.isUsernameUnique);
        setInvalidUsernameMessage("Username must be unique");
        setInvalidEmailMessage("Email must be unique");
        setIsLoadingScreen(false);
      }
    }
  };

  return (
    <>
      {isLoadingScreen && <LoadingScreen />}
      <StyledAuthenticationPage>
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
          <RoundedButton color="blue" handleOnClick={handleSignup}>Login</RoundedButton>
        </form>
      </StyledAuthenticationPage>
    </>
  );
};

const StyledAuthenticationPage = styled.div`
  background-color: var(--black);
  display: flex;
  height: 100vh;

  h3 {
    width: 40%;
    color: white;
    font-size: 30px;
    text-align: center;
    padding-top: 15%;
  }

  form {
    box-shadow: -10px 0px 10px rgba(0, 0, 0, 0.5);
    width: 60%;
    margin-left: auto;
    display: flex;
    gap: 10px;
    background-color: var(--coolWhite);
    flex-direction: column;
    padding: 50px 60px 50px 60px;
    height: 100vh;
    overflow-y: auto;
  }

  h1 {
    padding-bottom: 10px;
    font-size: 35px;
    border-bottom: 1px solid var(--grey);
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  h1 a {
    align-self: flex-end;
  }

  .invalid {
    color: var(--red);
  }

  .password-rules {
    flex-direction: column;
  }
  .password-rules p.valid {
    color: var(--green);
  }
  .password-rules p.invalid {
    color: var(--red);
  }
`;

export default SignupPage;