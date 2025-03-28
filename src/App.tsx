import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthScreen } from './components/AuthScreen';
import { Suspense, lazy } from 'react';
const UsersList = lazy(() => import('./components/UsersList'))
// import { UsersList } from './components/UsersList';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<AuthScreen />} />
                <Route path="/users" element={<Suspense fallback={"loading..."}><UsersList /></Suspense>} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
