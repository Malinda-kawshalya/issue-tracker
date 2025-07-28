/**
 * Footer Component
 * 
 * Application footer with company information, quick links, and contact details.
 * Features responsive grid layout, brand logo, and organized link sections.
 * 
 * @component Footer
 * @description Comprehensive footer with logo integration and organized content sections
 */

import '../styles/globals.css';
import logo from '../assets/logo.png';

/**
 * Footer Component - Application footer
 * @returns {JSX.Element} Rendered footer with brand info and links
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Section with Logo */}
          <div className="footer-section">
            <div className="footer-brand">
              <div className="footer-brand-icon">
                <img 
                  src={logo} 
                  alt="Issue Tracker Logo" 
                  className="footer-brand-logo"
                  loading="lazy"
                  draggable="false"
                />
              </div>
              <h3 className="footer-brand-title">Issue Tracker</h3>
            </div>
            <p className="footer-description">
              Efficiently manage and track your project issues with our comprehensive 
              issue tracking system. Keep your team organized and productive with 
              powerful features and intuitive design.
            </p>
            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Issues Tracked</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Active Users</span>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="/" className="footer-link" aria-label="View all issues">
                  <span className="link-icon">📋</span>
                  All Issues
                </a>
              </li>
              <li>
                <a href="/create" className="footer-link" aria-label="Create new issue">
                  <span className="link-icon">➕</span>
                  Create New Issue
                </a>
              </li>
              <li>
                <a href="/docs" className="footer-link" aria-label="View documentation">
                  <span className="link-icon">📚</span>
                  Documentation
                </a>
              </li>
              <li>
                <a href="/support" className="footer-link" aria-label="Get support">
                  <span className="link-icon">🆘</span>
                  Support
                </a>
              </li>
              <li>
                <a href="/api" className="footer-link" aria-label="API documentation">
                  <span className="link-icon">🔌</span>
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">Resources</h4>
            <ul className="footer-links">
              <li>
                <a href="/guide" className="footer-link">
                  <span className="link-icon">📖</span>
                  User Guide
                </a>
              </li>
              <li>
                <a href="/tutorials" className="footer-link">
                  <span className="link-icon">🎓</span>
                  Tutorials
                </a>
              </li>
              <li>
                <a href="/changelog" className="footer-link">
                  <span className="link-icon">📝</span>
                  Changelog
                </a>
              </li>
              <li>
                <a href="/roadmap" className="footer-link">
                  <span className="link-icon">🗺️</span>
                  Roadmap
                </a>
              </li>
              <li>
                <a href="/community" className="footer-link">
                  <span className="link-icon">👥</span>
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Legal Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">Get in Touch</h4>
            <div className="footer-contact">
              <a href="mailto:support@issuetracker.com" className="contact-item">
                <span className="contact-icon">📧</span>
                <span>support@issuetracker.com</span>
              </a>
              <a href="tel:+15551234567" className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+1 (555) 123-4567</span>
              </a>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>123 Tech Street, Developer City</span>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="footer-social">
              <a 
                href="https://facebook.com/issuetracker" 
                className="social-link"
                aria-label="Follow us on Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>📘</span>
              </a>
              <a 
                href="https://twitter.com/issuetracker" 
                className="social-link"
                aria-label="Follow us on Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>🐦</span>
              </a>
              <a 
                href="https://linkedin.com/company/issuetracker" 
                className="social-link"
                aria-label="Connect with us on LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>💼</span>
              </a>
              <a 
                href="https://github.com/issuetracker" 
                className="social-link"
                aria-label="View our GitHub repository"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>🐙</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-legal">
            <p className="copyright">
              © {currentYear} Issue Tracker. All rights reserved.
            </p>
            <div className="legal-links">
              <a href="/privacy" className="legal-link">Privacy Policy</a>
              <span className="legal-separator">|</span>
              <a href="/terms" className="legal-link">Terms of Service</a>
              <span className="legal-separator">|</span>
              <a href="/cookies" className="legal-link">Cookie Policy</a>
            </div>
          </div>
          
          <div className="footer-tech">
            <span className="tech-info">
              Built with ❤️ using React & Node.js
            </span>
            <span className="version-info">
              v2.1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
