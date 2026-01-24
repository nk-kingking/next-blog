import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Edit2, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import useApi from '../hooks/useApi';
import useStore from '../store/useStore';
import BlogForm from '../components/BlogForm';

const BlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const { user } = useStore();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use useCallback to memoize fetchBlog
  const fetchBlog = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/blogs/${id}`);
      setBlog(data.blog);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load blog');
    } finally {
      setLoading(false);
    }
  }, [id, api]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog deleted successfully');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete blog');
      toast.error('Failed to delete blog');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleEditSuccess = async () => {
    setShowEditForm(false);
    await fetchBlog();
    toast.success('Blog updated successfully');
  };

  const isAuthor = user?._id === blog?.author._id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog not found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6"
        >
          <ArrowLeft size={20} />
          Back to all posts
        </button>

        <article className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 whitespace-pre-wrap break-all">{blog.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <User size={16} />
                  {blog.author.email}
                </span>
                <span>·</span>
                <time dateTime={blog.createdAt}>
                  {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
                </time>
                {blog.updatedAt !== blog.createdAt && (
                  <>
                    <span>·</span>
                    <span className="text-xs">
                      Updated {format(new Date(blog.updatedAt), 'MMM d, yyyy')}
                    </span>
                  </>
                )}
              </div>
            </div>

            {isAuthor && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditForm(true)}
                  className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                  aria-label="Edit blog"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  aria-label="Delete blog"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap break-words">
              {blog.content}
            </p>
          </div>
        </article>
      </div>

      {showEditForm && (
        <BlogForm
          blog={blog}
          onClose={() => setShowEditForm(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete this blog post?</h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. This will permanently delete your blog post.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;