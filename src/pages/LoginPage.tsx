import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import TextInput from '../components/inputs/TextInput';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/pages/LoadingScreen';
import RoundedButton from '../components/buttons/RoundedButton';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from '../components/pages/loginPage/ForgotPassword';
const API_URL = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isCredentialsFalse, setIsCredentialsFalse] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const { setIsAuthenticated, setUser } = useAuth();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoadingScreen(true);
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        body: JSON.stringify({
          username: name,
          email: name,
          password: password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
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
      } else {
        setIsCredentialsFalse(true);
        setIsLoadingScreen(false);
      }
    } catch (error) {
      setIsCredentialsFalse(true);
      setIsLoadingScreen(false);
    }
  };

  return (
    <>
      {isLoadingScreen && <LoadingScreen />}
      <StyledAuthenticationPage>
        <h3>DraftBash</h3>
        <form>
          <h1>
            Login
            <a href="/signup" style={{"alignSelf": "flex-end"}}>Signup</a>
          </h1>
          <TextInput placeholder="Username or email" onChange={setName} />
          {isCredentialsFalse && <p className="invalid">Invalid username or password</p>}
          <TextInput placeholder="Password" isPassword={true} onChange={setPassword} />
          <RoundedButton color="blue" handleOnClick={handleLogin}>Login</RoundedButton>
          <ForgotPassword />
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

  .invalid {
    color: var(--red);
  }
`;

export default LoginPage;