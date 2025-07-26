import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import '../styles/createIssue.css';


function CreateIssue() {
  const [issue, setIssue] = useState({ 
    title: "", 
    description: "",
    priority: "Low",
    status: "Open",
    assignee: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.post("http://localhost:5000/api/issues", issue, config);
      
      if (res.data.success) {
        navigate("/");
      } else {
        setError('Failed to create issue');
      }
    } catch (err) {
      console.error('Error creating issue:', err);
      setError(err.response?.data?.message || 'Failed to create issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-issue-container">
      <div className="create-issue-wrapper">
        <div className="create-issue-header">
          <h1 className="create-issue-title">Create New Issue</h1>
          <p className="create-issue-subtitle">Describe the issue you'd like to track</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="create-issue-form">
          <div className="form-group">
            <label className="form-label required">Title</label>
            <input 
              type="text"
              placeholder="Enter issue title" 
              className="form-input"
              value={issue.title}
              onChange={e => setIssue({ ...issue, title: e.target.value })} 
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              placeholder="Describe the issue in detail..." 
              className="form-input form-textarea"
              value={issue.description}
              onChange={e => setIssue({ ...issue, description: e.target.value })}
              rows="4"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select 
                className="form-input form-select"
                value={issue.priority}
                onChange={e => setIssue({ ...issue, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                className="form-input form-select"
                value={issue.status}
                onChange={e => setIssue({ ...issue, status: e.target.value })}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assignee</label>
            <input 
              type="text"
              placeholder="Enter assignee name (optional)" 
              className="form-input"
              value={issue.assignee}
              onChange={e => setIssue({ ...issue, assignee: e.target.value })}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/')} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className={`btn-submit ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? 'Creating...' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateIssue;
