import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import '../styles/globals.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo/Brand */}
          <Link to="/" className="brand">
            <div className="brand-icon">
              <span>IT</span>
            </div>
            <h1 className="brand-title">Issue Tracker</h1>
          </Link>

          {/* Navigation - only show if authenticated */}
          {isAuthenticated && (
            <nav className="nav">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}
              >
                All Issues
              </Link>
              <Link 
                to="/create" 
                className={`nav-link ${isActive('/create') ? 'nav-link-active' : ''}`}
              >
                Create Issue
              </Link>
            </nav>
          )}

          {/* User Actions */}
          <div className="user-actions">
            {isAuthenticated ? (
              <div className="user-menu">
                <div className="user-info">
                  <div className="user-avatar">
                    <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                  <span className="user-name">{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="auth-btn login-btn">
                  Login
                </Link>
                <Link to="/signup" className="auth-btn signup-btn">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;