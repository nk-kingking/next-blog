import React, { useState } from 'react';
import useStore from '../store/useStore';
import useApi from '../hooks/useApi';

const Auth = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null); // ✅ Local error state
  const [localLoading, setLocalLoading] = useState(false); // ✅ Local loading state
  const { setUser } = useStore();
  const api = useApi();

  const validateForm = () => {
    if (!email.trim()) {
      setLocalError('Email is required');
      return false;
    }
    if (!password) {
      setLocalError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please provide a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLocalError(null);
    if (!validateForm()) {
      return;
    }

    setLocalLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = await api.post(endpoint, { email: email.trim(), password });
      
      localStorage.setItem('token', data.token);
      setUser(data.user);
      onSuccess();
    } catch (err) {
      console.error('Auth error:', err);
      setLocalError(err.message || 'An error occurred during authentication');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // ✅ Clear error when switching between login/signup
  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setLocalError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="blog-title text-3xl font-bold text-gray-800 mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {localError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {localError}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="your@email.com"
              disabled={localLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="••••••••"
              disabled={localLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={localLoading}
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-600/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {localLoading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={handleToggleMode}
            disabled={localLoading}
            className="text-orange-600 hover:text-orange-600/80 font-medium disabled:opacity-50"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;