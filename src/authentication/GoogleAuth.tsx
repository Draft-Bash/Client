import React from 'react';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

const GoogleAuth = () => {

    const { setIsAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
          fetch(`${API_URL}/users/login`, {
              method: "GET",
              headers: { token: token },
          })
              .then((response) => response.json())
              .then((user) => {
                  if (user) {
                    localStorage.setItem('jwtToken', token);
                    setIsAuthenticated(true);
                    localStorage.setItem("previousPagePath", "/modules/dashboard");
                    navigate('/modules/dashboard');
                  }
              })
              .catch((error) => {
                  console.log(error);
              });
      }
    }, []);

  return (
    <>
    </>
  )
};

export default GoogleAuth;