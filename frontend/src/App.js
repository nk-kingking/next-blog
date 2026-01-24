import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import useStore from './store/useStore';
import useApi from './hooks/useApi';
import Auth from './components/Auth';
import Header from './components/Header';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import BlogPage from './pages/BlogPage';
import { motion } from "motion/react";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const hasVerified = useRef(false);
  const blogListRef = useRef(null);
  
  const { setUser, logout } = useStore();
  const api = useApi();

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const data = await api.get('/auth/verify');
          setUser(data.user);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Token verification failed:', err);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsVerifying(false);
    };
    
    verifyToken();
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    logout();
    setIsAuthenticated(false);
    hasVerified.current = false;
    toast.success('Logged out successfully');
  }, [logout]);

  const handleBlogSuccess = () => {
    if (editingBlog) {
      toast.success('Blog updated successfully!');
    } else {
      toast.success('Blog published successfully!');
    }
    
    setShowBlogForm(false);
    setEditingBlog(null);
    
    if (blogListRef.current) {
      blogListRef.current.refresh(!editingBlog);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Header onLogout={handleLogout} onNewBlog={() => setShowBlogForm(true)} />

      <Routes>
        <Route path="/" element={
          <main className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h1 className="blog-title text-foreground">
                Stories worth sharing
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Discover thoughtful perspectives from writers around the world.
              </p>
            </motion.div>

            <BlogList 
              ref={blogListRef}
              onEdit={(blog) => {
                setEditingBlog(blog);
                setShowBlogForm(true);
              }}
            />
          </main>
        } />
        
        <Route path="/blog/:id" element={<BlogPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showBlogForm && (
        <BlogForm
          blog={editingBlog}
          onClose={() => {
            setShowBlogForm(false);
            setEditingBlog(null);
          }}
          onSuccess={handleBlogSuccess}
        />
      )}
    </div>
  );
};

export default App;