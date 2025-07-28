import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import '../styles/issueDetails.css';

function IssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        const res = await axios.get(`http://localhost:5000/api/issues/${id}`, config);
        
        if (res.data.success && res.data.data) {
          setIssue(res.data.data);
          // Fetch comments after getting issue
          fetchComments();
        } else {
          setError('Issue not found');
        }
      } catch (err) {
        console.error('Error fetching issue:', err);
        setError('Failed to load issue');
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        const res = await axios.get(`http://localhost:5000/api/issues/${id}/comments`, config);
        
        if (res.data.success && res.data.data) {
          setComments(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setCommentsLoading(false);
      }
    };

    if (token && id) {
      fetchIssue();
    }
  }, [id, token]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentSubmitting(true);
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.post(
        `http://localhost:5000/api/issues/${id}/comments`,
        { content: newComment },
        config
      );

      if (res.data.success && res.data.data) {
        setComments([res.data.data, ...comments]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading issue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <Link to="/">Back to Issues</Link>
      </div>
    );
  }

  if (!issue) return <p>Issue not found</p>;

  return (
    <div className="issue-details-container">
      <div className="container">
        <div className="issue-details-header">
          <Link to="/" className="back-link">← Back to Issues</Link>
          {/* Only show edit button if the current user is the author */}
          {user && issue.author && (
            user.id === issue.author._id || 
            user._id === issue.author._id ||
            user.id === issue.author.id ||
            user._id === issue.author.id
          ) && (
            <Link to={`/edit/${id}`} className="edit-button">Edit Issue</Link>
          )}
        </div>

        <div className="issue-details-card">
          <div className="issue-header">
            <h1 className="issue-title">{issue.title}</h1>
            <span className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}>
              {issue.status}
            </span>
          </div>

          <div className="issue-meta-info">
            <div className="meta-item">
              <span className="meta-label">Created by:</span>
              <span className="meta-value">{issue.author?.name || 'Unknown User'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Priority:</span>
              <span className={`priority-badge priority-${issue.priority.toLowerCase()}`}>
                {issue.priority}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Created:</span>
              <span className="meta-value">{new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
            {issue.assignee && (
              <div className="meta-item">
                <span className="meta-label">Assignee:</span>
                <span className="meta-value">{issue.assignee}</span>
              </div>
            )}
          </div>

          <div className="issue-description">
            <h3>Description</h3>
            <p>{issue.description || 'No description provided'}</p>
          </div>
        </div>

        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>
          
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows="3"
              required
            />
            <button 
              type="submit" 
              disabled={commentSubmitting || !newComment.trim()}
              className="comment-submit-btn"
            >
              {commentSubmitting ? 'Adding...' : 'Add Comment'}
            </button>
          </form>

          <div className="comments-list">
            {commentsLoading ? (
              <p>Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="comment-card">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author?.name || 'Unknown User'}</span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="comment-content">
                    {comment.content}
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
