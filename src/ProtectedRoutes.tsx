// Import necessary components and modules
import { Route, Navigate, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PageLayout from './components/PageLayout';
import CreateMockDraft from './pages/CreateMockDraft';
import DraftsPage from './pages/DraftsPage';
import DraftRoomWithContext from './pages/DraftRoom';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import { useAuth } from './authentication/AuthContext'; // Import the authentication context
import React from 'react';

function ProtectedRoutes() {
    // Access authentication status using the AuthContext
    const { isAuthenticated } = useAuth();

    // Use the useLocation hook to track the current route location
    const location = useLocation();

    // Store the current page path in localStorage for future reference
    localStorage.setItem("previousPagePath", location.pathname);

    // If the user is not authenticated, redirect to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render protected routes within a Routes component
    return (
        <Routes>
            {/* Protect all routes under the "modules" path */}
            <Route path="modules" element={<PageLayout />}>
                {/* Define protected routes within the "modules" path */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="drafts" element={<DraftsPage />} />
                <Route path="mock-drafts/configure" element={<CreateMockDraft />} />
                <Route path="drafts/draftroom/:draftId" element={<DraftRoomWithContext />} />
            </Route>
        </Routes>
    );
}

export default ProtectedRoutes;