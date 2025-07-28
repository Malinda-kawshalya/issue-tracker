/**
 * Header Component
 * 
 * Navigation header with responsive design and authentication-based content.
 * Shows navigation links for authenticated users and auth buttons for guests.
 * Includes brand logo, user profile section, and logout functionality.
 * 
 * @component
 * @returns {JSX.Element} Application header with navigation
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  /**
   * Check if current route is active
   * @param {string} path - Route path to check
   * @returns {boolean} True if current path matches
   */
  const isActive = (path) => location.pathname === path;

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Get user avatar display
   * @returns {JSX.Element} Avatar image or initials
   */
  const renderUserAvatar = () => {
    if (user?.profilePicture) {
      return (
        <img 
          src={`http://localhost:5000${user.profilePicture}`} 
          alt="Profile" 
          className="avatar-image"
        />
      );
    }
    
    return (
      <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
    );
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Brand Logo */}
          <Link to="/" className="brand">
            <div className="brand-icon">
              <img 
                src={logo} 
                alt="Issue Tracker Logo" 
                className="brand-logo"
                loading="eager"
                draggable="false"
              />
            </div>
            <h1 className="brand-title">Issue Tracker</h1>
          </Link>

          {/* Main Navigation - Authenticated Users Only */}
          {isAuthenticated && (
            <nav className="nav" role="navigation" aria-label="Main navigation">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                All Issues
              </Link>
              <Link 
                to="/create" 
                className={`nav-link ${isActive('/create') ? 'nav-link-active' : ''}`}
                aria-current={isActive('/create') ? 'page' : undefined}
              >
                Create Issue
              </Link>
            </nav>
          )}

          {/* User Actions Section */}
          <div className="user-actions">
            {isAuthenticated ? (
              // Authenticated User Menu
              <div className="user-menu">
                <Link 
                  to="/profile" 
                  className="user-info"
                  aria-label={`Profile for ${user?.name}`}
                >
                  <div className="user-avatar">
                    {renderUserAvatar()}
                  </div>
                  <span className="user-name">{user?.name}</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="logout-btn"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Guest Authentication Buttons
              <div className="auth-buttons">
                <Link 
                  to="/login" 
                  className="auth-btn login-btn"
                  aria-label="Login to your account"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="auth-btn signup-btn"
                  aria-label="Create new account"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
