import { Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import { AuthProvider, useAuth } from "./authentication/AuthContext";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoutes from "./ProtectedRoutes";

function LoginRedirect() {
  const { isAuthenticated } = useAuth();
  const previousPagePath = localStorage.getItem("previousPagePath") || "/default-path";

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