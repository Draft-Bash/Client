import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../../env';

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  userId: number;
}

interface Props {
  children: React.ReactNode;
}

// Create the context
const AuthContext = createContext<AuthState | null>(null);

// Create a custom hook to access the authentication state
export function useAuth() {
  const authState = useContext(AuthContext);
  if (!authState) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authState;
}

// Create the AuthProvider component to wrap the App component
export function AuthProvider(props: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(-1);

  async function checkAuthentication() {
    try {
      const response = await fetch(API_URL + '/users/login', {
        method: 'GET',
        headers: { token: localStorage.jwtToken },
      });

      const user = await response.json();

      if (user) {
        setIsAuthenticated(true);
        setUsername(user.user_name);
        setUserId(user.user_id);
      }
      else {
        setIsAuthenticated(false);
        setUsername('');
        setUserId(-1);
      }

    } catch (err: any) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    checkAuthentication();
  }, [isAuthenticated]);

  const authState: AuthState = {
    isAuthenticated,
    setIsAuthenticated,
    username,
    userId
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, username, userId}}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;