/**
 * Issue Details Page Component
 * 
 * Comprehensive view of a single issue with comments functionality.
 * Features detailed issue information, metadata display, and interactive commenting system.
 * 
 * @component IssueDetails
 * @description Complete issue view with commenting capabilities and edit permissions
 */

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import '../styles/issueDetails.css';

/**
 * IssueDetails Component - Individual issue view with comments
 * @returns {JSX.Element} Rendered issue details page
 */
function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management for issue data
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // UI state management
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  
  // Authentication context
  const { token, user } = useAuth();

  /**
   * Fetch issue details from API
   * @async
   * @function fetchIssue
   */
  const fetchIssue = async () => {
    try {
      setLoading(true);
      setError('');
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await axios.get(`http://localhost:5000/api/issues/${id}`, config);
      
      if (response.data.success && response.data.data) {
        setIssue(response.data.data);
        // Fetch comments after successfully getting issue
        await fetchComments();
      } else {
        setError('Issue not found or access denied');
      }
    } catch (err) {
      console.error('Error fetching issue:', err);
      
      if (err.response?.status === 404) {
        setError('Issue not found');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view this issue.');
      } else {
        setError('Failed to load issue. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch comments for the current issue
   * @async
   * @function fetchComments
   */
  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await axios.get(`http://localhost:5000/api/issues/${id}/comments`, config);
      
      if (response.data.success && response.data.data) {
        setComments(response.data.data);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      // Don't show error for comments, just log it
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  /**
   * Handle comment form submission
   * @param {Event} e - Form submit event
   * @async
   */
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    // Validate comment content
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    
    if (newComment.trim().length > 1000) {
      setCommentError('Comment cannot exceed 1000 characters');
      return;
    }

    try {
      setCommentSubmitting(true);
      setCommentError('');
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const commentData = {
        content: newComment.trim()
      };

      const response = await axios.post(
        `http://localhost:5000/api/issues/${id}/comments`,
        commentData,
        config
      );

      if (response.data.success && response.data.data) {
        // Add new comment to the top of the list
        setComments([response.data.data, ...comments]);
        setNewComment('');
        setCommentError('');
      } else {
        setCommentError('Failed to add comment. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
      
      if (err.response?.status === 401) {
        setCommentError('Authentication required. Please log in.');
      } else if (err.response?.status === 404) {
        setCommentError('Issue not found.');
      } else {
        setCommentError('Failed to add comment. Please try again.');
      }
    } finally {
      setCommentSubmitting(false);
    }
  };

  /**
   * Check if current user can edit the issue
   * @returns {boolean} True if user can edit, false otherwise
   */
  const canEditIssue = () => {
    if (!user || !issue || !issue.author) return false;
    
    // Check various possible ID formats for author comparison
    return (
      user.id === issue.author._id ||
      user._id === issue.author._id ||
      user.id === issue.author.id ||
      user._id === issue.author.id
    );
  };

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get relative time string
   * @param {string} dateString - ISO date string
   * @returns {string} Relative time string
   */
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Load issue on component mount
  useEffect(() => {
    if (token && id) {
      fetchIssue();
    } else if (!token) {
      setError('Authentication required. Please log in.');
      setLoading(false);
    } else if (!id) {
      setError('Invalid issue ID.');
      setLoading(false);
    }
  }, [id, token]);

  // Scroll to comments if hash is present
  useEffect(() => {
    if (window.location.hash === '#comments' && !loading) {
      const commentsSection = document.querySelector('.comments-section');
      if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [loading]);

  // Loading state
  if (loading) {
    return (
      <div className="issue-details-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading issue details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="issue-details-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Unable to load issue</h3>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <Link to="/" className="back-button">
              ← Back to Issues
            </Link>
            <button onClick={() => window.location.reload()} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Issue not found state
  if (!issue) {
    return (
      <div className="issue-details-container">
        <div className="not-found-container">
          <h2>Issue Not Found</h2>
          <p>The issue you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="back-button">← Back to Issues</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="issue-details-container">
      <div className="container">
        {/* Navigation header */}
        <div className="issue-details-header">
          <Link to="/" className="back-link" aria-label="Back to issues list">
            <span className="back-icon">←</span>
            Back to Issues
          </Link>
          
          {/* Edit button for issue author */}
          {canEditIssue() && (
            <Link 
              to={`/edit/${id}`} 
              className="edit-button"
              aria-label="Edit this issue"
            >
              <span className="edit-icon">✏️</span>
              Edit Issue
            </Link>
          )}
        </div>

        {/* Issue details card */}
        <div className="issue-details-card">
          {/* Issue header with title and status */}
          <div className="issue-header">
            <h1 className="issue-title">{issue.title}</h1>
            <span className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}>
              {issue.status}
            </span>
          </div>

          {/* Issue metadata */}
          <div className="issue-meta-info">
            <div className="meta-item">
              <span className="meta-label">👤 Created by:</span>
              <span className="meta-value">{issue.author?.name || 'Unknown User'}</span>
            </div>
            
            <div className="meta-item">
              <span className="meta-label">🔥 Priority:</span>
              <span className={`priority-badge priority-${issue.priority.toLowerCase()}`}>
                {issue.priority}
              </span>
            </div>
            
            <div className="meta-item">
              <span className="meta-label">📅 Created:</span>
              <span className="meta-value" title={formatDate(issue.createdAt)}>
                {getRelativeTime(issue.createdAt)}
              </span>
            </div>
            
            <div className="meta-item">
              <span className="meta-label">🕒 Updated:</span>
              <span className="meta-value" title={formatDate(issue.updatedAt)}>
                {getRelativeTime(issue.updatedAt)}
              </span>
            </div>
            
            {issue.assignee && (
              <div className="meta-item">
                <span className="meta-label">👷 Assignee:</span>
                <span className="meta-value">{issue.assignee}</span>
              </div>
            )}

            {/* Virtual fields from the model */}
            {issue.ageInDays && (
              <div className="meta-item">
                <span className="meta-label">⏱️ Age:</span>
                <span className="meta-value">{issue.ageInDays} days old</span>
              </div>
            )}

            {issue.isOverdue && (
              <div className="meta-item overdue">
                <span className="meta-label">⚠️ Status:</span>
                <span className="meta-value overdue-text">Overdue</span>
              </div>
            )}
          </div>

          {/* Issue description */}
          <div className="issue-description">
            <h3 className="description-title">📝 Description</h3>
            <div className="description-content">
              {issue.description ? (
                <p className="description-text">{issue.description}</p>
              ) : (
                <p className="no-description">No description provided</p>
              )}
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="comments-section" id="comments">
          <h3 className="comments-title">
            💬 Comments ({comments.length})
          </h3>
          
          {/* Add comment form */}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="comment-form-header">
              <label htmlFor="comment-input" className="comment-label">
                Add a comment
              </label>
              <span className="comment-char-count">
                {newComment.length}/1000 characters
              </span>
            </div>
            
            <textarea
              id="comment-input"
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
                setCommentError('');
              }}
              placeholder="Share your thoughts, updates, or questions about this issue..."
              rows="4"
              required
              maxLength={1000}
              className={commentError ? 'error' : ''}
              aria-describedby="comment-error comment-help"
            />
            
            {commentError && (
              <span id="comment-error" className="field-error" role="alert">
                {commentError}
              </span>
            )}
            
            <div id="comment-help" className="comment-form-footer">
              <div className="comment-tips">
                💡 Tip: Be specific and constructive in your comments
              </div>
              <button 
                type="submit" 
                disabled={commentSubmitting || !newComment.trim()}
                className={`comment-submit-btn ${commentSubmitting ? 'submitting' : ''}`}
                aria-label="Add comment to issue"
              >
                <span className="btn-icon">
                  {commentSubmitting ? '⏳' : '💬'}
                </span>
                {commentSubmitting ? 'Adding Comment...' : 'Add Comment'}
              </button>
            </div>
          </form>

          {/* Comments list */}
          <div className="comments-list">
            {commentsLoading ? (
              <div className="comments-loading">
                <div className="loading-spinner small"></div>
                <p>Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="no-comments">
                <div className="no-comments-icon">💭</div>
                <p className="no-comments-text">No comments yet.</p>
                <p className="no-comments-subtext">Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment, index) => (
                <div key={comment._id} className="comment-card">
                  <div className="comment-header">
                    <div className="comment-author-info">
                      <span className="comment-author">
                        {comment.author?.name || 'Unknown User'}
                      </span>
                      <span className="comment-date" title={formatDate(comment.createdAt)}>
                        {getRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <span className="comment-number">#{comments.length - index}</span>
                  </div>
                  <div className="comment-content">
                    <p>{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueDetails;
