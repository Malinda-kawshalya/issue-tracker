/**
 * Protected Route Component
 * 
 * Wrapper component that protects routes requiring authentication.
 * Redirects to login page if user is not authenticated.
 * Shows loading spinner while authentication status is being determined.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Protected content or navigation to login
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" aria-label="Loading"></div>
        <p>Verifying authentication...</p>
      </div>
    );
  }

  // Render protected content if authenticated, otherwise redirect to login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
