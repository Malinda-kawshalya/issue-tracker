/**
 * Home Page Component
 * 
 * Main dashboard displaying all issues in the system with filtering and sorting capabilities.
 * Features responsive grid layout, loading states, and comprehensive issue information display.
 * 
 * @component Home
 * @description Central hub for viewing and managing all issues in the tracking system
 */

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import '../styles/home.css';

/**
 * Home Component - Main issues dashboard
 * @returns {JSX.Element} Rendered home page with issues grid
 */
function Home() {
  // State management for issues data and UI states
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  // Get authentication context
  const { token, user } = useAuth();

  /**
   * Fetch all issues from the API
   * @async
   * @function fetchIssues
   */
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Setup authorization headers
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };
        
        // Fetch issues from API
        const response = await axios.get("http://localhost:5000/api/issues", config);
        
        // Handle API response format
        if (response.data.success && response.data.data) {
          setIssues(response.data.data);
        } else {
          setIssues([]);
          setError('No issues data received');
        }
      } catch (err) {
        console.error('Error fetching issues:', err);
        
        // Handle different error types
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Failed to load issues. Please check your connection.');
        }
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is authenticated
    if (token) {
      fetchIssues();
    } else {
      setLoading(false);
      setError('Please log in to view issues');
    }
  }, [token]);

  /**
   * Filter issues based on status
   * @param {Array} issuesList - Array of issues to filter
   * @returns {Array} Filtered issues array
   */
  const getFilteredIssues = (issuesList) => {
    if (filterStatus === 'All') return issuesList;
    return issuesList.filter(issue => issue.status === filterStatus);
  };

  /**
   * Sort issues based on selected criteria
   * @param {Array} issuesList - Array of issues to sort
   * @returns {Array} Sorted issues array
   */
  const getSortedIssues = (issuesList) => {
    const sortedIssues = [...issuesList];
    
    switch (sortBy) {
      case 'newest':
        return sortedIssues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sortedIssues.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'priority':
        const priorityOrder = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return sortedIssues.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case 'status':
        return sortedIssues.sort((a, b) => a.status.localeCompare(b.status));
      default:
        return sortedIssues;
    }
  };

  /**
   * Get processed issues with filtering and sorting applied
   * @returns {Array} Processed issues array
   */
  const getProcessedIssues = () => {
    const filtered = getFilteredIssues(issues);
    return getSortedIssues(filtered);
  };

  /**
   * Format issue creation date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  /**
   * Retry loading issues
   */
  const handleRetry = () => {
    setError('');
    setLoading(true);
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading issues...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="home-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Unable to load issues</h3>
          <p className="error-message">{error}</p>
          <button onClick={handleRetry} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get processed issues for display
  const processedIssues = getProcessedIssues();

  return (
    <div className="home-container">
      {/* Decorative light ray effects */}
      <div className="light-ray light-ray-1" style={{'--rotation': '25deg'}}></div>
      <div className="light-ray light-ray-2" style={{'--rotation': '-15deg'}}></div>
      <div className="light-ray light-ray-3" style={{'--rotation': '45deg'}}></div>
      
      <div className="container">
        {/* Page header with title and create button */}
        <div className="home-header">
          <div className="header-content">
            <h2 className="home-title">All Issues</h2>
            <p className="home-subtitle">
              Manage and track your project issues • {issues.length} total
            </p>
          </div>
          <Link to="/create" className="create-button">
            <span className="create-button-icon">+</span>
            Create New Issue
          </Link>
        </div>

        {/* Filter and sort controls */}
        <div className="controls-section">
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="status-filter" className="filter-label">Filter by Status:</label>
              <select 
                id="status-filter"
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="sort-select" className="filter-label">Sort by:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
          
          <div className="results-info">
            Showing {processedIssues.length} of {issues.length} issues
          </div>
        </div>
        
        {/* Issues display */}
        {processedIssues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-title">
              {issues.length === 0 ? 'No issues found' : 'No issues match your filters'}
            </h3>
            <p className="empty-state-subtitle">
              {issues.length === 0 
                ? 'Create your first issue to get started' 
                : 'Try adjusting your filter criteria'
              }
            </p>
            {issues.length === 0 && (
              <Link to="/create" className="empty-state-button">
                Create First Issue
              </Link>
            )}
          </div>
        ) : (
          <div className="issues-grid">
            {processedIssues.map(issue => (
              <div key={issue._id} className="issue-card">
                <div className="issue-card-content">
                  {/* Issue header with title and status */}
                  <div className="issue-card-header">
                    <Link 
                      to={`/issue/${issue._id}`}
                      className="issue-title"
                      title={issue.title}
                    >
                      {issue.title}
                    </Link>
                    <span className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}>
                      {issue.status}
                    </span>
                  </div>
                  
                  {/* Issue author information */}
                  <div className="issue-author">
                    <span className="author-label">Created by:</span>
                    <span className="author-name">
                      {issue.author?.name || 'Unknown User'}
                    </span>
                  </div>
                  
                  {/* Issue description (truncated) */}
                  {issue.description && (
                    <p className="issue-description" title={issue.description}>
                      {issue.description.length > 120 
                        ? `${issue.description.substring(0, 120)}...` 
                        : issue.description
                      }
                    </p>
                  )}
                  
                  {/* Issue assignee */}
                  {issue.assignee && (
                    <div className="issue-assignee">
                      <span className="assignee-label">Assigned to:</span>
                      <span className="assignee-name">{issue.assignee}</span>
                    </div>
                  )}
                  
                  {/* Issue metadata */}
                  <div className="issue-meta">
                    <span className={`issue-priority priority-${issue.priority.toLowerCase()}`}>
                      🔥 {issue.priority} Priority
                    </span>
                    <span className="issue-date" title={new Date(issue.createdAt).toLocaleString()}>
                      📅 {formatDate(issue.createdAt)}
                    </span>
                  </div>
                  
                  {/* Issue additional info */}
                  {(issue.ageInDays || issue.isOverdue) && (
                    <div className="issue-additional-info">
                      {issue.ageInDays && (
                        <span className="issue-age">
                          ⏱️ {issue.ageInDays} days old
                        </span>
                      )}
                      {issue.isOverdue && (
                        <span className="issue-overdue">
                          ⚠️ Overdue
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Issue actions */}
                  <div className="issue-actions">
                    <div className="comment-info">
                      <span className="comment-count">
                        💬 {issue.commentCount || 0} comment{issue.commentCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="action-buttons">
                      <Link 
                        to={`/issue/${issue._id}`}
                        className="view-button"
                        title="View issue details"
                      >
                        👁️ View
                      </Link>
                      <Link 
                        to={`/issue/${issue._id}#comments`}
                        className="comment-button"
                        title="Add comment"
                      >
                        💬 Comment
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
