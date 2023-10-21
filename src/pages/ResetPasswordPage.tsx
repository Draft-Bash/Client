import React, { useState, useEffect } from "react";
import TextInput from "../components/TextInput";
import { useAuth } from "../authentication/AuthContext";
import { IoMdCheckmark } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
const API_URL = import.meta.env.VITE_API_URL;

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [isLoadingScreen, setIsLoadingScreen] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordValidationMessage, setInvalidPasswordMessage] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [username, setUsername] = useState("");
    const [token, setToken] = useState<string | null>("");
    const [userId, setUserId] = useState();
    const { setIsAuthenticated } = useAuth();

    

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const jwtToken = urlParams.get("token");
        setToken(jwtToken);

        if (jwtToken) {
            fetch(`${API_URL}/users/login`, {
                method: "GET",
                headers: { token: jwtToken },
            })
                .then((response) => response.json())
                .then((user) => {
                    console.log(user);
                    setUsername(user.username); // Update the username state with the username from the response
                    setUserId(user.user_id);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [token, API_URL]);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        let isPasswordValid = true;

        if (password != passwordConfirm) {
            setInvalidPasswordMessage("Passwords do not match");
            isPasswordValid = false;
        } else if (password.length === 0) {
            setInvalidPasswordMessage("Password is required");
            isPasswordValid = false;
        } else {
            setInvalidPasswordMessage("");
            isPasswordValid = true;
        }

        if (isPasswordValid) {
            try {
                setIsLoadingScreen(true);
                const response = await fetch(API_URL+'/users', {
                    method: 'PUT',
                    body: JSON.stringify({
                        password: password,
                        userId: userId
                    }),
                    headers: {
                    'Content-Type': 'application/json'
                    }
                });
                const urlParams = new URLSearchParams(window.location.search);
                const jwtToken = urlParams.get("token");
                if (jwtToken) {
                    localStorage.setItem('jwtToken', jwtToken);
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
        <>
            {isLoadingScreen && <LoadingScreen />}
            <div className="authentication-page">
                <h3>Draftbash</h3>
                <form className="authentication-form">
                    <h1>Reset Password for {username}</h1>
                    <TextInput placeholder="Password" isPassword={true} onChange={setPassword} />
                    <p className="invalid">{passwordValidationMessage}</p>
                    <TextInput
                        placeholder="Confirm password"
                        isPassword={true}
                        onChange={setPasswordConfirm}
                    />
                    <div className="password-rules">
                        <p className={password.length > 8 ? "valid" : "invalid"}>
                            <IoMdCheckmark /> Minimum of 8 characters
                        </p>
                        <p className={/[A-Z]/.test(password) ? "valid" : "invalid"}>
                            <IoMdCheckmark /> At least one capital letter
                        </p>
                        <p className={/\d/.test(password) ? "valid" : "invalid"}>
                            <IoMdCheckmark /> At least one number
                        </p>
                    </div>
                    <button onClick={onSubmit}>Reset Password</button>
                </form>
            </div>
        </>
    );
};

export default ResetPasswordPage;





