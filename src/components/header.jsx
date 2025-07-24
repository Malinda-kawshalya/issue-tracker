import { Link, useLocation } from "react-router-dom";
import '../styles/globals.css';

function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
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

          {/* Navigation */}
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

          {/* User Actions */}
          <div className="user-actions">
            <div className="user-avatar">
              <span>U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;