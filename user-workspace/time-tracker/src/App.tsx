import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import TimeTracker from './components/TimeTracker';
import LandingPage from './components/LandingPage';
import LoadingSpinner from './components/LoadingSpinner';
import AuthenticatedLayout from './components/AuthenticatedLayout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return currentUser ? <AuthenticatedLayout>{children}</AuthenticatedLayout> : <Navigate to="/login" />;
}

function HomeRoute() {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" /> : <LandingPage />;
}

function App() {
  return (
    <Router basename="/time-tracker">
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <TimeTracker />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<HomeRoute />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
