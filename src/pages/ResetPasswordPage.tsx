import '../css/signupPage.css'
import React, { useState, useEffect } from 'react';
import TextInput from "../components/TextInput";
import { useAuth } from '../authentication/AuthContext';
import { IoMdCheckmark } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
const API_URL = import.meta.env.VITE_API_URL;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValidationMessage, setInvalidPasswordMessage] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let isPasswordValid = true;

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

    if (isPasswordValid) {
      setIsLoadingScreen(true);
      try {
        

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
          <TextInput placeholder="Password" isPassword={true} onChange={setPassword} />
          <p className="invalid">{passwordValidationMessage}</p>
          <TextInput placeholder="Confirm password" isPassword={true} onChange={setPasswordConfirm} />
          <div className="password-rules">
            <p className={(password.length > 8) ? "valid" : "invalid" }><IoMdCheckmark /> Minimum of 8 characters</p>
            <p className={/[A-Z]/.test(password) ? "valid" : "invalid" }><IoMdCheckmark /> At least one capital letter</p>
            <p className={/\d/.test(password) ? "valid" : "invalid" }><IoMdCheckmark /> At least one number</p>
          </div>
          <button onClick={onSubmit}>Reset Password</button>
        </form>
    </div>
    </>
  );
};
  
export default ResetPasswordPage;