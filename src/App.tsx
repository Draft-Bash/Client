import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./components/authentication/AuthContext";
import { useEffect } from "react";
import AuthProvider from "./components/authentication/AuthContext";
import SignupPage from "./components/pages/SignupPage";
import LoginPage from "./components/pages/LoginPage";
import ProtectedRoutes from "./components/authentication/ProtectedRoutes";
import Dashboard from "./components/pages/Dashboard";
import { SocketProvider } from "./components/DraftRoom/DraftContext";

function LoginRedirect() {
  const { isAuthenticated } = useAuth();
  const previousPagePath = localStorage.getItem("previousPagePath");

  if (isAuthenticated) {
    // If the user is authenticated, redirect them back to the previous page (if available)
    return <Navigate to={previousPagePath} replace />;
  } else {
    return <LoginPage />;
  }
}

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginRedirect />} />
          <Route path="/" element={<LoginRedirect />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;