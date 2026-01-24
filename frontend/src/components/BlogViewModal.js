import React from 'react';
import { User } from 'lucide-react';

const BlogViewModal = ({ blog, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 break-words">{blog.title}</h2>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b">
          <span className="flex items-center gap-1">
            <User size={16} />
            {blog.author.email}
          </span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          {blog.updatedAt !== blog.createdAt && (
            <span className="text-xs">(Edited: {new Date(blog.updatedAt).toLocaleDateString()})</span>
          )}
        </div>

        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 whitespace-pre-wrap break-words">{blog.content}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BlogViewModal;