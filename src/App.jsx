import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateIssue from "./pages/CreateIssue";
import IssueDetails from "./pages/issueDetails";
import EditIssue from "./pages/editissue";
import Header from "./components/header";
import Footer from "./components/footer";
import './styles/globals.css';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateIssue />} />
            <Route path="/issue/:id" element={<IssueDetails />} />
            <Route path="/edit/:id" element={<EditIssue />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
