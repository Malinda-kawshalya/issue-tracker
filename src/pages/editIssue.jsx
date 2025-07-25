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
    <form onSubmit={handleUpdate}>
      <input value={issue.title} onChange={e => setIssue({ ...issue, title: e.target.value })} />
      <textarea value={issue.description} onChange={e => setIssue({ ...issue, description: e.target.value })}></textarea>
      <button>Update</button>
    </form>
  );
}

export default EditIssue;
