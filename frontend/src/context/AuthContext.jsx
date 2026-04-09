import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const res = await axios.get('https://budgetpacker-ai-powered-trip-planner.onrender.com//api/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('https://budgetpacker-ai-powered-trip-planner.onrender.com//api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const register = async (name, email, password) => {
    // Registration now only sends OTP, doesn't return token yet
    await axios.post('https://budgetpacker-ai-powered-trip-planner.onrender.com//api/auth/register', { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
