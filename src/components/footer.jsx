import '../styles/globals.css';
import logo from '../assets/logo.png';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-brand">
              <div className="footer-brand-icon">
                <img src={logo} alt="Issue Tracker Logo" className="footer-brand-logo" />
              </div>
              <h3 className="footer-brand-title">Issue Tracker</h3>
            </div>
            <p className="footer-description">
              Efficiently manage and track your project issues with our comprehensive 
              issue tracking system. Keep your team organized and productive.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="/" className="footer-link">
                  All Issues
                </a>
              </li>
              <li>
                <a href="/create" className="footer-link">
                  Create New Issue
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-section-title">Get in Touch</h4>
            <div className="footer-contact">
              <p>📧 support@issuetracker.com</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 123 Tech Street, Developer City</p>
            </div>
            <div className="footer-social">
              <a href="#" className="social-link">
                <span>📘</span>
              </a>
              <a href="#" className="social-link">
                <span>🐦</span>
              </a>
              <a href="#" className="social-link">
                <span>💼</span>
              </a>
            </div>
          </div>
        </div>


      </div>
    </footer>
  );
}
export default Footer;