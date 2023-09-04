import { Route, Navigate, Routes} from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import PageLayout from '../PageLayout';
import ConfigureMockDraft from '../MockDrafts/ConfigureMockDraft';
import DraftsPage from '../pages/DraftsPage';
import DraftRoomWithContext from '../pages/DraftRoom';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';
import { SocketProvider } from '../DraftRoom/DraftContext';

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
                <Route path="mock-drafts/configure" element={<ConfigureMockDraft />} />
                <Route path="drafts/draftroom/:draftId" element={<DraftRoomWithContext />} />
            </Route>
        </Routes>
    );
}

export default ProtectedRoutes;