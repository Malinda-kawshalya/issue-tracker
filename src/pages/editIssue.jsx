import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/editIssue.css';


function EditIssue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState({ title: "", description: "" });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/issues/${id}`).then(res => setIssue(res.data));
  }, [id]);

  const handleUpdate = e => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/issues/${id}`, issue).then(() => navigate("/"));
  };

  return (
    <form onSubmit={handleUpdate}>
      <input value={issue.title} onChange={e => setIssue({ ...issue, title: e.target.value })} />
      <textarea value={issue.description} onChange={e => setIssue({ ...issue, description: e.target.value })}></textarea>
      <button>Update</button>
    </form>
  );
}

export default EditIssue;
