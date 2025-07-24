import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/home.css';


function Home() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/issues").then(res => {
      setIssues(res.data);
    });
  }, []);

  return (
    <div className="home-container">
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
                    <span className={`status-badge ${
                      issue.status === 'open' ? 'status-open' :
                      issue.status === 'in-progress' ? 'status-in-progress' :
                      'status-closed'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                  {issue.description && (
                    <p className="issue-description">{issue.description}</p>
                  )}
                  <div className="issue-meta">
                    <span className="issue-date">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
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