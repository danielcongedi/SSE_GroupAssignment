import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginScreen.css';
import config from '../config';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     setError('Please enter both email and password');
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     setError('');
      
  //     const response = await axios.post(`${config.API_BASE_URL}/api/users/login`, { 
  //       email, 
  //       password 
  //     });
      
  //     console.log('Login response:', response.data);
      
  //     // ✅ Use sessionStorage instead of localStorage
  //     sessionStorage.setItem('token', response.data.token);
  //     sessionStorage.setItem('userId', response.data.userId);
  //     sessionStorage.setItem('userRole', response.data.role);
      
  //     console.log('Session data stored');
  //     navigate('/');
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Invalid email or password');
  //     console.error('Login error:', err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const handleLogin = async () => {
  try {
    setIsLoading(true);
    setError('');
    
    const response = await axios.post('http://localhost:3001/api/users/login', { 
      email, 
      password 
    });
    
    console.log('✅ Login response:', response.data);
    
    // Store in sessionStorage - backend now provides all fields
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('userId', response.data.userId);
    sessionStorage.setItem('userRole', response.data.role);
    
    console.log('✅ Stored in sessionStorage:', {
      token: sessionStorage.getItem('token') ? 'OK' : 'FAILED',
      userId: sessionStorage.getItem('userId'),
      role: sessionStorage.getItem('userRole')
    });
    
    navigate('/');
  } catch (err) {
    setError(err.response?.data?.message || 'Invalid email or password');
    console.error('❌ Login error:', err);
  } finally {
    setIsLoading(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h1>Home Services</h1>
          <p>Book trusted local service providers</p>
        </div>
        
        <h2>Login to Your Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="form-input"
          />
        </div>
        
        <button 
          onClick={handleLogin} 
          className="login-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="register-link">
          <p>Don't have an account?</p>
          <button onClick={() => navigate('/register')} className="link-btn">
            Create new account
          </button>
        </div>
      </div>
    </div>
  );
}