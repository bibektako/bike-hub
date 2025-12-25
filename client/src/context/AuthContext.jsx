import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    console.log('🔐 [AuthContext] Fetching user data...');
    try {
      const { data } = await axios.get('/api/auth/me');
      console.log('✅ [AuthContext] User fetched successfully:', {
        id: data._id,
        email: data.email,
        role: data.role,
        name: data.name
      });
      setUser(data);
    } catch (error) {
      console.error('❌ [AuthContext] Error fetching user:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      console.log('🏁 [AuthContext] Fetch user completed');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 [AuthContext] Initializing auth context...');
    const token = localStorage.getItem('token');
    if (token) {
      console.log('🔑 [AuthContext] Token found, setting up authorization');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      console.log('⚠️ [AuthContext] No token found, user not authenticated');
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    console.log('🔐 [AuthContext] Attempting login for:', email);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      console.log('✅ [AuthContext] Login successful:', {
        userId: data._id,
        email: data.email,
        role: data.role
      });
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
      return { success: true };
    } catch (error) {
      console.error('❌ [AuthContext] Login failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post('/api/auth/register', userData);
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const setUserFromToken = (userData, token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUserFromToken }}>
      {children}
    </AuthContext.Provider>
  );
};

