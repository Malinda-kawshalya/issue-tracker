import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import '../styles/home.css';


function Home() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        const res = await axios.get("http://localhost:5000/api/issues", config);
        
        // Handle the new API response format
        if (res.data.success && res.data.data) {
          setIssues(res.data.data);
        } else {
          setIssues([]);
        }
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError('Failed to load issues');
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchIssues();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading issues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Light ray effects */}
      <div className="light-ray light-ray-1" style={{'--rotation': '25deg'}}></div>
      <div className="light-ray light-ray-2" style={{'--rotation': '-15deg'}}></div>
      <div className="light-ray light-ray-3" style={{'--rotation': '45deg'}}></div>
      
      <div className="container">
        <div className="home-header">
          <div>
            <h2 className="home-title">All Issues</h2>
            <p className="home-subtitle">Manage and track your project issues</p>
          </div>
          <Link to="/create" className="create-button">
            <span className="create-button-icon">+</span>
            Create New
          </Link>
        </div>
        
        {issues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-title">No issues found</h3>
            <p className="empty-state-subtitle">Create your first issue to get started</p>
          </div>
        ) : (
          <div className="issues-grid">
            {issues.map(issue => (
              <div key={issue._id} className="issue-card">
                <div className="issue-card-content">
                  <div className="issue-card-header">
                    <Link 
                      to={`/issue/${issue._id}`}
                      className="issue-title"
                    >
                      {issue.title}
                    </Link>
                    <span className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}>
                      {issue.status}
                    </span>
                  </div>
                  
                  <div className="issue-author">
                    <span className="author-label">Created by:</span>
                    <span className="author-name">{issue.author?.name || 'Unknown User'}</span>
                  </div>
                  
                  {issue.description && (
                    <p className="issue-description">{issue.description}</p>
                  )}
                  
                  <div className="issue-meta">
                    <span className="issue-priority priority-${issue.priority.toLowerCase()}">
                      {issue.priority} Priority
                    </span>
                    <span className="issue-date">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="issue-actions">
                    <div className="comment-info">
                      <span className="comment-count">
                        💬 {issue.commentCount || 0} comments
                      </span>
                    </div>
                    <div className="action-buttons">
                      <Link 
                        to={`/issue/${issue._id}#comments`}
                        className="comment-button"
                        title="Add comment"
                      >
                        <span className="comment-icon">💬</span>
                        Comment
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