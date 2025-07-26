import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import '../styles/editIssue.css';


function EditIssue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const { token } = useAuth();

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

    if (token && id) {
      fetchIssue();
    }
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.put(`http://localhost:5000/api/issues/${id}`, issue, config);
      
      if (res.data.success) {
        navigate("/");
      } else {
        setError('Failed to update issue');
      }
    } catch (err) {
      console.error('Error updating issue:', err);
      setError(err.response?.data?.message || 'Failed to update issue');
    } finally {
      setUpdating(false);
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

  if (error && !issue.title) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Issues</button>
      </div>
    );
  }

  return (
    <div className="edit-issue-container">
      <div className="edit-issue-wrapper">
        <div className="edit-issue-header">
          <h1 className="edit-issue-title">Edit Issue</h1>
          <p className="edit-issue-subtitle">Update the issue details</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleUpdate} className="edit-issue-form">
          <div className="form-group">
            <label className="form-label required">Title</label>
            <input 
              type="text"
              placeholder="Enter issue title" 
              className="form-input"
              value={issue.title || ""}
              onChange={e => setIssue({ ...issue, title: e.target.value })} 
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              placeholder="Describe the issue in detail..." 
              className="form-input form-textarea"
              value={issue.description || ""}
              onChange={e => setIssue({ ...issue, description: e.target.value })}
              rows="4"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select 
                className="form-input form-select"
                value={issue.priority || "Low"}
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
                value={issue.status || "Open"}
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
              value={issue.assignee || ""}
              onChange={e => setIssue({ ...issue, assignee: e.target.value })}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate(`/issue/${id}`)} disabled={updating}>
              Cancel
            </button>
            <button type="submit" className={`btn-submit ${updating ? 'loading' : ''}`} disabled={updating}>
              {updating ? 'Updating...' : 'Update Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditIssue;
