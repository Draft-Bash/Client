import React from 'react';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const GoogleAuth = () => {

    const { setIsAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        // Do something with the token, such as storing it in local storage
        if (token) {
            localStorage.setItem('jwtToken', token);
            setIsAuthenticated(true);
            localStorage.setItem("previousPagePath", "/modules/dashboard");
            navigate('/modules/dashboard');
        }
    }, []);

  return (
    <>
    </>
  )
};

export default GoogleAuth;