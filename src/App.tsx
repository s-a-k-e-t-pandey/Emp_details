import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthScreen } from './components/AuthScreen';
import { Suspense, lazy } from 'react';
const UsersList = lazy(() => import('./components/UsersList'))

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<AuthScreen />} />
                <Route 
                    path="/users" 
                    element={
                        <Suspense fallback={
                            <div className="h-screen w-full flex items-center justify-center bg-slate-900">
                                <div className="text-cyan-400 text-xl">Loading...</div>
                            </div>
                        }>
                            <UsersList />
                        </Suspense>
                    } 
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
