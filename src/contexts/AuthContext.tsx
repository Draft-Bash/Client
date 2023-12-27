import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../dataTypes/User';
const API_URL = import.meta.env.VITE_API_URL;

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface Props {
  children: React.ReactNode;
}

// Create a context for the authentication state
const AuthContext = createContext<AuthState | null>(null);

// Custom hook to access the authentication state
export function useAuth() {
  // Use the useContext hook to access the AuthContext
  const authState = useContext(AuthContext);

  // If the authState is not available, throw an error
  if (!authState) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Return the authState
  return authState;
}

// Provider component for the AuthContext
export function AuthProvider({ children }: Props) {
  // State variables for the authentication status and user data
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Use the useEffect hook to check the authentication status when the component mounts
  useEffect(() => {
    // Define an async function to check the authentication status
    async function checkAuthentication() {
      try {
        // Send a GET request to the login endpoint with the JWT token
        const response = await fetch(`${API_URL}/users/login?jwt_token=${localStorage.jwt_token}`);

        // Parse the response data as JSON
        const userData = await response.json();

        // If the user data is available, set the authentication status to true and update the user data
        if (userData.user_id) {
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          // If the user data is not available, set the authentication status to false and clear the user data
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err: any) {
        setIsAuthenticated(false);
        console.error(err.message);
      }
    }

    // Call the checkAuthentication function
    checkAuthentication();
  }, []); // Empty dependency array means this effect runs once on mount

  // Define the authState object
  const authState: AuthState = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser
  };

  // Return the AuthContext.Provider component with the authState as its value
  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}

export default AuthProvider;