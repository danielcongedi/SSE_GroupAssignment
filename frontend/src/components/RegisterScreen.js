import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterScreen.css';
import config from '../config';

// export default function RegisterScreen() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('client');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleRegister = async () => {
//     if (!name || !email || !password) {
//       setError('Please fill in all fields');
//       return;
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError('');
      
//       await axios.post(`${config.API_BASE_URL}/api/users/register`, { 
//         name, 
//         email, 
//         password,
//         role 
//       });
      
//       alert('Registration successful! Please login with your credentials.');
//       navigate('/login');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed. Please try again.');
//       console.error('Registration error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleRegister();
//     }
//   };

//   return (
//     <div className="register-container">
//       <div className="register-form">
//         <div className="register-header">
//           <h1>Home Services</h1>
//           <p>Join our community of service providers and clients</p>
//         </div>
        
//         <h2>Create Your Account</h2>
        
//         {error && <div className="error-message">{error}</div>}
        
//         <div className="form-group">
//           <label>Full Name:</label>
//           <input
//             type="text"
//             placeholder="Enter your full name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="form-input"
//           />
//         </div>
        
//         <div className="form-group">
//           <label>Email Address:</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="form-input"
//           />
//         </div>
        
//         <div className="form-group">
//           <label>Password:</label>
//           <input
//             type="password"
//             placeholder="Enter your password (min. 6 characters)"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="form-input"
//           />
//         </div>
        
//         <div className="form-group">
//           <label>I want to:</label>
//           <select 
//             value={role} 
//             onChange={(e) => setRole(e.target.value)}
//             className="form-select"
//           >
//             <option value="client">Find Service Providers</option>
//             <option value="serviceProvider">Offer My Services</option>
//           </select>
//         </div>
        
//         <button 
//           onClick={handleRegister} 
//           className="register-btn"
//           disabled={isLoading}
//         >
//           {isLoading ? 'Creating Account...' : 'Create Account'}
//         </button>
        
//         <div className="login-link">
//           <button onClick={() => navigate('/login')} className="link-btn">
//             Already have an account? Sign in here
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await axios.post(`${config.API_BASE_URL}/api/users/register`, { 
        name, 
        email, 
        password,
        role 
      });
      
      alert('Registration successful! Please login with your credentials.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <div className="register-header">
          <h1>Home Services</h1>
          <p>Join our community of service providers and clients</p>
        </div>
        
        <h2>Create Your Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="form-input"
          />
        </div>
        
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
            placeholder="Enter your password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>I want to:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="form-select"
          >
            <option value="client">Find Service Providers</option>
            <option value="serviceProvider">Offer My Services</option>
          </select>
        </div>
        
        <button 
          onClick={handleRegister} 
          className="register-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <div className="login-link">
          <button onClick={() => navigate('/login')} className="link-btn">
            Already have an account? Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}