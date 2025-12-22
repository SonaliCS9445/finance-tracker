import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // ✅ CSS file

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://finance-tracker-4-2eyg.onrender.com/api/auth/login', { email, password });

      alert('✅ Login successful');
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
  console.error("❌ Login failed:", err);
  alert(err.response?.data?.message || '❌ Login failed');
}

    
      // ⬅️ Redirect

  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Login</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
        <p className="redirect-text">
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
