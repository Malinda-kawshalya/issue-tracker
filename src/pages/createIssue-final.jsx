/**
 * Create Issue Page Component
 * 
 * Form interface for creating new issues in the tracking system.
 * Features comprehensive validation, loading states, and responsive design.
 * 
 * @component CreateIssue
 * @description Interactive form for submitting new issues with proper validation and user feedback
 */

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import '../styles/createIssue.css';

/**
 * CreateIssue Component - New issue creation form
 * @returns {JSX.Element} Rendered create issue form page
 */
function CreateIssue() {
  // Form state management
  const [issue, setIssue] = useState({ 
    title: "", 
    description: "",
    priority: "Low",
    status: "Open",
    assignee: ""
  });
  
  // UI state management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  // Hooks for navigation and authentication
  const navigate = useNavigate();
  const { token, user } = useAuth();

  /**
   * Validate form data before submission
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const errors = {};
    
    // Title validation
    if (!issue.title.trim()) {
      errors.title = 'Title is required';
    } else if (issue.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    } else if (issue.title.trim().length > 200) {
      errors.title = 'Title cannot exceed 200 characters';
    }
    
    // Description validation (optional but with length limit)
    if (issue.description && issue.description.length > 2000) {
      errors.description = 'Description cannot exceed 2000 characters';
    }
    
    // Assignee validation (optional but with length limit)
    if (issue.assignee && issue.assignee.trim().length > 100) {
      errors.assignee = 'Assignee name cannot exceed 100 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   * @async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    setValidationErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Prepare request configuration with auth headers
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Prepare issue data with trimmed strings
      const issueData = {
        title: issue.title.trim(),
        description: issue.description.trim(),
        priority: issue.priority,
        status: issue.status,
        assignee: issue.assignee.trim()
      };

      // Submit the issue
      const response = await axios.post(API_ENDPOINTS.ISSUES, issueData, config);
      
      if (response.data.success) {
        // Success - navigate to home page
        navigate("/", { 
          state: { 
            message: 'Issue created successfully!',
            type: 'success'
          }
        });
      } else {
        setError('Failed to create issue. Please try again.');
      }
    } catch (err) {
      console.error('Error creating issue:', err);
      
      // Handle different error types
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 400) {
        // Handle validation errors from server
        const serverErrors = err.response.data.errors || [err.response.data.message];
        if (Array.isArray(serverErrors)) {
          setError(serverErrors.join(', '));
        } else {
          setError(serverErrors);
        }
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to create issue. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle input changes with validation
   * @param {string} field - Field name to update
   * @param {string} value - New value
   */
  const handleInputChange = (field, value) => {
    setIssue(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Handle cancel action
   */
  const handleCancel = () => {
    if (issue.title || issue.description) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmed) return;
    }
    navigate('/');
  };

  /**
   * Get character count for input fields
   * @param {string} text - Text to count
   * @param {number} max - Maximum allowed characters
   * @returns {Object} Character count info
   */
  const getCharacterCount = (text, max) => ({
    count: text.length,
    max,
    isNearLimit: text.length > max * 0.8,
    isOverLimit: text.length > max
  });

  return (
    <div className="create-issue-container">
      <div className="create-issue-wrapper">
        {/* Page header */}
        <div className="create-issue-header">
          <h1 className="create-issue-title">Create New Issue</h1>
          <p className="create-issue-subtitle">
            Describe the issue you'd like to track and assign priorities
          </p>
        </div>
        
        {/* Error display */}
        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}
        
        {/* Create issue form */}
        <form onSubmit={handleSubmit} className="create-issue-form" noValidate>
          {/* Title field */}
          <div className="form-group">
            <label htmlFor="title" className="form-label required">
              Issue Title
            </label>
            <input 
              id="title"
              type="text"
              placeholder="Enter a clear, concise issue title" 
              className={`form-input ${validationErrors.title ? 'error' : ''}`}
              value={issue.title}
              onChange={e => handleInputChange('title', e.target.value)}
              required
              maxLength={200}
              aria-describedby="title-error title-help"
            />
            {validationErrors.title && (
              <span id="title-error" className="field-error" role="alert">
                {validationErrors.title}
              </span>
            )}
            <div id="title-help" className="field-help">
              <span className={`char-count ${getCharacterCount(issue.title, 200).isNearLimit ? 'warning' : ''}`}>
                {getCharacterCount(issue.title, 200).count}/200 characters
              </span>
            </div>
          </div>
          
          {/* Description field */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea 
              id="description"
              placeholder="Provide detailed information about the issue, including steps to reproduce, expected behavior, and any relevant context..." 
              className={`form-input form-textarea ${validationErrors.description ? 'error' : ''}`}
              value={issue.description}
              onChange={e => handleInputChange('description', e.target.value)}
              rows="5"
              maxLength={2000}
              aria-describedby="description-error description-help"
            ></textarea>
            {validationErrors.description && (
              <span id="description-error" className="field-error" role="alert">
                {validationErrors.description}
              </span>
            )}
            <div id="description-help" className="field-help">
              <span className={`char-count ${getCharacterCount(issue.description, 2000).isNearLimit ? 'warning' : ''}`}>
                {getCharacterCount(issue.description, 2000).count}/2000 characters
              </span>
            </div>
          </div>

          {/* Priority and Status row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority" className="form-label">
                Priority Level
              </label>
              <select 
                id="priority"
                className="form-input form-select"
                value={issue.priority}
                onChange={e => handleInputChange('priority', e.target.value)}
                aria-describedby="priority-help"
              >
                <option value="Low">🟢 Low - Minor issues, nice-to-have fixes</option>
                <option value="Medium">🟡 Medium - Standard issues, normal timeline</option>
                <option value="High">🟠 High - Important issues, needs attention</option>
                <option value="Urgent">🔴 Urgent - Critical issues, immediate action</option>
              </select>
              <div id="priority-help" className="field-help">
                Select the appropriate priority level for this issue
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Initial Status
              </label>
              <select 
                id="status"
                className="form-input form-select"
                value={issue.status}
                onChange={e => handleInputChange('status', e.target.value)}
                aria-describedby="status-help"
              >
                <option value="Open">📭 Open - Ready for assignment</option>
                <option value="In Progress">⚙️ In Progress - Currently being worked on</option>
                <option value="Resolved">✅ Resolved - Solution implemented</option>
                <option value="Closed">🔒 Closed - Issue completed</option>
              </select>
              <div id="status-help" className="field-help">
                Most new issues start as "Open"
              </div>
            </div>
          </div>

          {/* Assignee field */}
          <div className="form-group">
            <label htmlFor="assignee" className="form-label">
              Assignee
            </label>
            <input 
              id="assignee"
              type="text"
              placeholder="Enter the name of the person to assign this issue to (optional)" 
              className={`form-input ${validationErrors.assignee ? 'error' : ''}`}
              value={issue.assignee}
              onChange={e => handleInputChange('assignee', e.target.value)}
              maxLength={100}
              aria-describedby="assignee-error assignee-help"
            />
            {validationErrors.assignee && (
              <span id="assignee-error" className="field-error" role="alert">
                {validationErrors.assignee}
              </span>
            )}
            <div id="assignee-help" className="field-help">
              <span>Leave empty if not assigned yet</span>
              <span className={`char-count ${getCharacterCount(issue.assignee, 100).isNearLimit ? 'warning' : ''}`}>
                {getCharacterCount(issue.assignee, 100).count}/100 characters
              </span>
            </div>
          </div>
          
          {/* Form actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={handleCancel} 
              disabled={loading}
              aria-label="Cancel issue creation"
            >
              <span className="btn-icon">❌</span>
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn-submit ${loading ? 'loading' : ''}`} 
              disabled={loading || !issue.title.trim()}
              aria-label="Create new issue"
            >
              <span className="btn-icon">
                {loading ? '⏳' : '✅'}
              </span>
              {loading ? 'Creating Issue...' : 'Create Issue'}
            </button>
          </div>
        </form>

        {/* Form tips */}
        <div className="form-tips">
          <h3 className="tips-title">💡 Tips for creating effective issues:</h3>
          <ul className="tips-list">
            <li>Use clear, descriptive titles that summarize the problem</li>
            <li>Include steps to reproduce the issue in the description</li>
            <li>Set appropriate priority levels to help with triage</li>
            <li>Assign to specific team members when possible</li>
            <li>Add relevant tags or labels in the description if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CreateIssue;
