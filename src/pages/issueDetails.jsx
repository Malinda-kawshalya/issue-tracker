import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import '../styles/issueDetails.css';


function IssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/issues/${id}`).then(res => setIssue(res.data));
  }, [id]);

  if (!issue) return <p>Loading...</p>;

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
