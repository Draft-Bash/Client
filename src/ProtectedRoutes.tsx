import { Route, Navigate, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import PageLayout from './components/pages/PageLayout';
import React from 'react';
import DraftsPage from './pages/DraftsPage';
import { DraftProvider } from './contexts/DraftContext';
import DraftRoomPage from './pages/DraftRoomPage';
import CreateMockDraft from './pages/CreateMockDraft';
import UpdateMockDraft from './pages/UpdateMockDraft';

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
                <Route path="mock-drafts/update/:draft_id" element={<UpdateMockDraft />} />
                <Route path="drafts/draftroom/:draft_id" element={(<DraftProvider><DraftRoomPage /></DraftProvider>)} />
            </Route>
        </Routes>
    );
}

export default ProtectedRoutes;