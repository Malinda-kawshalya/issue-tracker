/**
 * Authentication Context Provider
 * 
 * Manages user authentication state across the application.
 * Provides login, logout, signup, and user profile management functionality.
 * Uses React Context API with useReducer for state management.
 * 
 * @component
 * @provides {Object} AuthContext - Authentication state and methods
 */

import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Authentication state interface
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
};

// Action types for reducer
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  LOAD_USER: 'LOAD_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  SET_LOADING: 'SET_LOADING',
  UPDATE_USER: 'UPDATE_USER'
};

/**
 * Authentication state reducer
 * @param {Object} state - Current authentication state
 * @param {Object} action - Action object with type and payload
 * @returns {Object} Updated authentication state
 */
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case AUTH_ACTIONS.LOGOUT:
    case AUTH_ACTIONS.AUTH_ERROR:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    default:
      return state;
  }
};

// Create authentication context
const AuthContext = createContext();

/**
 * Authentication Provider Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Configure axios defaults
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Load user on app initialization
  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  /**
   * Load authenticated user from server
   */
  const loadUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      dispatch({
        type: AUTH_ACTIONS.LOAD_USER,
        payload: {
          user: response.data.user,
          token: state.token
        }
      });
    } catch (error) {
      console.error('Load user error:', error);
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
    }
  };

  /**
   * User login
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response or error
   */
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  /**
   * User registration
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User full name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @returns {Promise<Object>} Registration response or error
   */
  const signup = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  /**
   * User logout
   */
  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Update response or error
   */
  const updateUser = async (userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, userData);
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: response.data.user
      });
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      return { success: false, error: message };
    }
  };

  /**
   * Upload user profile picture
   * @param {File} file - Profile picture file
   * @returns {Promise<Object>} Upload response or error
   */
  const uploadProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await axios.post(`${API_BASE_URL}/auth/upload-profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: { profilePicture: response.data.profilePictureUrl }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile picture upload failed';
      return { success: false, error: message };
    }
  };

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    
    // Methods
    login,
    signup,
    logout,
    updateUser,
    uploadProfilePicture,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use authentication context
 * @returns {Object} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
