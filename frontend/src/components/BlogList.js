import React, { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BlogCard from './BlogCard';
import Pagination from './Pagination';
import useStore from '../store/useStore';
import useApi from '../hooks/useApi';

const BlogList = forwardRef(({ onEdit, onView }, ref) => {
  const { blogs, loading, totalPages, currentPage, setBlogs, setPagination } = useStore();
  const api = useApi();
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const fetchBlogs = useCallback(async (page = 1) => {
    try {
      setLocalError(null);
      const data = await api.get(`/blogs?page=${page}&limit=6`);
      setBlogs(data.blogs);
      setPagination(data.totalPages, data.currentPage);
    } catch (err) {
      console.error('Fetch blogs error:', err);
      setLocalError('Failed to load blogs');
    }
  }, [api, setBlogs, setPagination]);

  // Fetch blogs only when currentPage changes
  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage, fetchBlogs]);

  // Expose refresh method to parent
  useImperativeHandle(ref, () => ({
    refresh: (resetToFirstPage = false) => {
      if (resetToFirstPage) {
        setPagination(1, 1);
        fetchBlogs(1);
      } else {
        fetchBlogs(currentPage);
      }
    }
  }));

  const handlePageChange = (page) => {
    setPagination(totalPages, page);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await api.delete(`/blogs/${deleteId}`);
      
      const updatedBlogs = blogs.filter(blog => blog._id !== deleteId);
      setBlogs(updatedBlogs);
      
      setDeleteId(null);
      toast.success('Blog deleted successfully');
      
      if (updatedBlogs.length === 0 && currentPage > 1) {
        setPagination(totalPages - 1, currentPage - 1);
      } else {
        await fetchBlogs(currentPage);
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete blog');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading stories...</p>
        </div>
      </div>
    );
  }

  if (localError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-red-600">
          <AlertCircle className="h-8 w-8" />
          <p>{localError}</p>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={() => fetchBlogs(currentPage)}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <FileText className="h-12 w-12" />
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-900">No stories yet</h3>
            <p className="mt-1">Be the first to share your thoughts.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid gap-6 md:grid-cols-2 auto-rows-auto">
        {blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            blog={blog}
            onEdit={() => onEdit(blog)}
            onDelete={() => handleDeleteClick(blog._id)}
            onView={() => onView(blog)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete this blog post?</h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. This will permanently delete your blog post.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
});

BlogList.displayName = 'BlogList';

export default BlogList;