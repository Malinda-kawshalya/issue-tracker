import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home";
import CreateIssue from "./pages/createIssue";
import IssueDetails from "./pages/issueDetails";
import EditIssue from "./pages/editissue";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Header from "./components/header";
import Footer from "./components/footer";
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <BrowserRouter>
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreateIssue />
                </ProtectedRoute>
              } />
              <Route path="/issue/:id" element={
                <ProtectedRoute>
                  <IssueDetails />
                </ProtectedRoute>
              } />
              <Route path="/edit/:id" element={
                <ProtectedRoute>
                  <EditIssue />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
