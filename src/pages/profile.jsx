import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/profile.css';

const Profile = () => {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    createdAt: '',
    updatedAt: '',
    profilePicture: ''
  });
  const [editData, setEditData] = useState({
    name: '',
    email: ''
  });
  const [userIssues, setUserIssues] = useState([]);
  const [userStats, setUserStats] = useState({
    total: 0,
    solved: 0,
    ongoing: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [uploadingPicture, setUploadingPicture] = useState(false);

  // Fetch user profile data from database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setProfileData({
            name: data.data.name || '',
            email: data.data.email || '',
            createdAt: data.data.createdAt || '',
            updatedAt: data.data.updatedAt || '',
            profilePicture: data.data.profilePicture || ''
          });
          setEditData({
            name: data.data.name || '',
            email: data.data.email || ''
          });
          if (data.data.profilePicture) {
            setProfilePicturePreview(`http://localhost:5000${data.data.profilePicture}`);
          }
        } else {
          setError('Failed to fetch profile data');
        }
      } catch (error) {
        setError('Failed to fetch profile data');
        console.error('Profile fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  // Fetch user issues
  const fetchUserIssues = async () => {
    try {
      setIssuesLoading(true);
      const response = await fetch('http://localhost:5000/api/issues/my-issues', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setUserIssues(data.data);
      }
    } catch (error) {
      console.error('Error fetching user issues:', error);
    } finally {
      setIssuesLoading(false);
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/issues/my-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setUserStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Fetch issues and stats when switching to issues tab
  useEffect(() => {
    if (activeTab === 'issues' && token) {
      fetchUserIssues();
      fetchUserStats();
    }
  }, [activeTab, token]);

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/issues/${issueId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUserIssues(userIssues.filter(issue => issue._id !== issueId));
        fetchUserStats(); // Refresh stats
        setSuccess('Issue deleted successfully!');
      } else {
        setError('Failed to delete issue');
      }
    } catch (error) {
      setError('Failed to delete issue');
      console.error('Delete error:', error);
    }
  };

  // Handle profile picture file selection
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size should be less than 5MB');
        return;
      }
      
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setError('');
    }
  };

  // Upload profile picture
  const handleUploadProfilePicture = async () => {
    if (!profilePicture) {
      setError('Please select an image first');
      return;
    }

    setUploadingPicture(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('profilePicture', profilePicture);

      const response = await fetch('http://localhost:5000/api/auth/upload-profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Profile picture uploaded successfully!');
        setProfileData(prev => ({
          ...prev,
          profilePicture: data.data.profilePicture
        }));
        setProfilePicture(null);
        // Update preview with server URL
        setProfilePicturePreview(`http://localhost:5000${data.data.profilePicture}`);
        // Update user context to reflect in header
        updateUser({ profilePicture: data.data.profilePicture });
      } else {
        setError(data.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      setError('Failed to upload profile picture');
      console.error('Profile picture upload error:', error);
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Profile updated successfully!');
        setProfileData(prev => ({
          ...prev,
          name: data.data.name,
          email: data.data.email,
          updatedAt: data.data.updatedAt
        }));
        setIsEditing(false);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original data
    setEditData({
      name: profileData.name,
      email: profileData.email
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {profilePicturePreview || profileData.profilePicture ? (
              <img 
                src={profilePicturePreview || `http://localhost:5000${profileData.profilePicture}`} 
                alt="Profile" 
                className="avatar-image"
              />
            ) : (
              <span>{profileData.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="avatar-upload">
            <input
              type="file"
              id="profilePictureInput"
              accept="image/*"
              onChange={handleProfilePictureChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="profilePictureInput" className="upload-btn">
              📷 Change Photo
            </label>
            {profilePicture && (
              <button 
                onClick={handleUploadProfilePicture}
                disabled={uploadingPicture}
                className="save-photo-btn"
              >
                {uploadingPicture ? 'Uploading...' : 'Save Photo'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Info
        </button>
        <button 
          className={`tab-button ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          My Issues ({userStats.total})
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <div className="profile-card">
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={isEditing ? editData.name : profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={isEditing ? editData.email : profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <button
                  type="button"
                  className="btn btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button
                    type="submit"
                    className="btn btn-save"
                    disabled={updateLoading}
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={handleCancel}
                    disabled={updateLoading}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>

          <div className="account-info">
            <h3>Account Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Member Since:</span>
                <span className="value">{formatDate(profileData.createdAt)}</span>
              </div>
              <div className="info-item">
                <span className="label">Last Updated:</span>
                <span className="value">{formatDate(profileData.updatedAt)}</span>
              </div>
              <div className="info-item">
                <span className="label">Account Status:</span>
                <span className="value status-active">Active</span>
              </div>
            </div>
          </div>

          <div className="danger-zone">
            <h3>Account Actions</h3>
            <button
              type="button"
              className="btn btn-logout"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Issues Tab Content */}
      {activeTab === 'issues' && (
        <div className="issues-section">
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-number">{userStats.total}</div>
              <div className="stat-label">Total Issues</div>
            </div>
            <div className="stat-card solved">
              <div className="stat-number">{userStats.solved}</div>
              <div className="stat-label">Solved</div>
            </div>
            <div className="stat-card ongoing">
              <div className="stat-number">{userStats.ongoing}</div>
              <div className="stat-label">Ongoing</div>
            </div>
            <div className="stat-card open">
              <div className="stat-number">{userStats.open}</div>
              <div className="stat-label">Open</div>
            </div>
          </div>

          {/* Issues List */}
          <div className="user-issues">
            <div className="issues-header">
              <h3>My Issues</h3>
              <Link to="/create" className="btn btn-create">
                Create New Issue
              </Link>
            </div>

            {issuesLoading ? (
              <div className="loading">Loading your issues...</div>
            ) : userIssues.length === 0 ? (
              <div className="no-issues">
                <p>You haven't created any issues yet.</p>
                <Link to="/create" className="btn btn-create">
                  Create Your First Issue
                </Link>
              </div>
            ) : (
              <div className="issues-list">
                {userIssues.map(issue => (
                  <div key={issue._id} className="issue-item">
                    <div className="issue-content">
                      <div className="issue-header-row">
                        <Link to={`/issue/${issue._id}`} className="issue-title">
                          {issue.title}
                        </Link>
                        <span className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}>
                          {issue.status}
                        </span>
                      </div>
                      
                      <p className="issue-description">
                        {issue.description || 'No description'}
                      </p>
                      
                      <div className="issue-meta">
                        <span className={`priority-badge priority-${issue.priority.toLowerCase()}`}>
                          {issue.priority} Priority
                        </span>
                        <span className="issue-date">
                          Created: {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="issue-actions">
                      <Link 
                        to={`/edit/${issue._id}`} 
                        className="btn btn-edit-small"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteIssue(issue._id)}
                        className="btn btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
