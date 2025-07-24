import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/createIssue.css';


function CreateIssue() {
  const [issue, setIssue] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/issues", issue).then(() => navigate("/"));
  };

  return (
    <div className="create-issue-container">
      <div className="create-issue-wrapper">
        <div className="create-issue-header">
          <h1 className="create-issue-title">Create New Issue</h1>
          <p className="create-issue-subtitle">Describe the issue you'd like to track</p>
        </div>
        
        <form onSubmit={handleSubmit} className="create-issue-form">
          <div className="form-group">
            <label className="form-label required">Title</label>
            <input 
              type="text"
              placeholder="Enter issue title" 
              className="form-input"
              onChange={e => setIssue({ ...issue, title: e.target.value })} 
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              placeholder="Describe the issue in detail..." 
              className="form-input form-textarea"
              onChange={e => setIssue({ ...issue, description: e.target.value })}
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateIssue;
