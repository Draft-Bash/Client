import { Route, Navigate, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PageLayout from './components/PageLayout';
import CreateMockDraft from './pages/CreateMockDraft';
import DraftsPage from './pages/DraftsPage';
import DraftRoomWithContext from './pages/DraftRoom';
import { useLocation } from 'react-router-dom';
import { useAuth } from './authentication/AuthContext';
import React from 'react';

function ProtectedRoutes() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    localStorage.setItem("previousPagePath", location.pathname);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <Routes>
            <Route path="modules" element={<PageLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="drafts" element={<DraftsPage />} />
                <Route path="mock-drafts/configure" element={<CreateMockDraft />} />
                <Route path="drafts/draftroom/:draftId" element={<DraftRoomWithContext />} />
            </Route>
        </Routes>
    );
}

export default ProtectedRoutes;