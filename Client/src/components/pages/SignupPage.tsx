import '../../css/signupPage.css'
import { useState, useEffect } from 'react';
import TextInput from "../TextInput";
import { API_URL } from '../../env.ts';
import { IoMdCheckmark } from 'react-icons/io';

const SignupPage = () => {

  const [username, setUsername] = useState("");
  const [usernameValidationMessage, setInvalidUsernameMessage] = useState("");
  const [isUsernameValid, setUsernameValidity] = useState(false);
  const [email, setEmail] = useState("");
  const [emailValidationMessage, setInvalidEmailMessage] = useState("");
  const [isEmailValid, setEmailValidity] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValidationMessage, setInvalidPasswordMessage] = useState("");
  const [isPasswordValid, setPasswordValidity] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isFormValid, setFormValidity] = useState(false);

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
    if (username.length < 3 || username.length > 15) {
      setInvalidUsernameMessage("Username must be between 3 and 15 characters");
      setUsernameValidity(false);
    }
    else if (username.length > 3 && username.length < 15) {
      setInvalidUsernameMessage("");
      setUsernameValidity(true);
    }
    else {
      const response = await fetch(API_URL+`/users/unique-username/${username}`)
      const data = await response.json();
      if (data.unique) {
        setInvalidUsernameMessage("");
        setUsernameValidity(true);
      }
      else {
        setInvalidUsernameMessage("Username is already taken");
        setUsernameValidity(false);
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInvalidEmailMessage("Invalid email");
      setEmailValidity(false);
    }

    if (email.length == 0) {
      setInvalidEmailMessage("Email is required");
      setEmailValidity(false);
    }
    else {
      setInvalidEmailMessage("");
      setEmailValidity(true);
    }

    if (password != passwordConfirm) {
      setInvalidPasswordMessage("Passwords do not match");
      setPasswordValidity(false);
    }
    else {
      setInvalidPasswordMessage("");
      setPasswordValidity(true);
    }

    if (password.length == 0) {
      setInvalidPasswordMessage("Password is required");
      setPasswordValidity(false);
    }
    else {
      setInvalidPasswordMessage("");
      setPasswordValidity(true);
    }

    if (isUsernameValid && isEmailValid && isPasswordValid) {
      setFormValidity(true);
      try {
        fetch(API_URL+"/users", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            user_name: username,
            user_email: email,
            password: password
          })
        })
      } catch (error) {
        console.log(error);
    }
  }
}

  return (
    <div className="authentication-page">
      {!isFormValid &&
        <>
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
            <button onClick={onSubmit}>Continue</button>
          </form>
        </>
      }
      {isFormValid && 
      <p className="confirm-email">Email confirmation sent to {email}</p>}
    </div>
  );
};
  
export default SignupPage;