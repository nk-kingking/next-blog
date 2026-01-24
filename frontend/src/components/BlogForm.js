import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import useApi from '../hooks/useApi';

const BlogForm = ({ blog, onClose, onSuccess }) => {
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const api = useApi();

  const validateForm = () => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    if (title.trim().length > 200) {
      setError('Title cannot exceed 200 characters');
      return false;
    }
    if (!content.trim()) {
      setError('Content is required');
      return false;
    }
    if (content.trim().length < 10) {
      setError('Content must be at least 10 characters');
      return false;
    }
    if (content.trim().length > 10000) {
      setError('Content cannot exceed 10,000 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const sanitizedTitle = DOMPurify.sanitize(title.trim(), { ALLOWED_TAGS: [] });
      const sanitizedContent = DOMPurify.sanitize(content.trim(), { ALLOWED_TAGS: [] });

      if (blog) {
        await api.put(`/blogs/${blog._id}`, { 
          title: sanitizedTitle, 
          content: sanitizedContent 
        });
      } else {
        await api.post('/blogs', { 
          title: sanitizedTitle, 
          content: sanitizedContent 
        });
      }
      
      // ✅ Call onSuccess to trigger refresh
      if (onSuccess) {
        await onSuccess(); // Wait for success handler
      }
      
      onClose();
    } catch (err) {
      console.error('Blog form error:', err);
      setError(err.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {blog ? 'Edit Blog' : 'Write a new Blog'}
        </h3>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title ({title.length}/200)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title..."
              maxLength={200}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content ({content.length}/10,000)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              placeholder="Write your blog content here..."
              maxLength={10000}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading || !title.trim() || !content.trim()}
              className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-600/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : blog ? 'Update Blog' : 'Publish Blog'}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;