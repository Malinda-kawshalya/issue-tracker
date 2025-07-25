import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import '../styles/issueDetails.css';


function IssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    <div>
      <h2>{issue.title}</h2>
      <p>{issue.description}</p>
      <p>Status: {issue.status}</p>
      <Link to={`/edit/${id}`}>Edit</Link>
    </div>
  );
}

export default IssueDetails;
