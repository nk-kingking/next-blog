import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import useStore from '../store/useStore';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const BlogCard = ({ blog, onEdit, onDelete }) => {
  const { user } = useStore();
  const isAuthor = user?._id === blog.author._id;
  
  const getPreview = () => {
    if (blog.content.length <= 150) {
      return blog.content;
    }
    return blog.content.slice(0, 150) + '...';
  };

  return (
    <Link to={`/blog/${blog._id}`}>
      <div
        className="group relative rounded-lg border border-border bg-card p-6 transition-all hover:border-orange-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col cursor-pointer h-full"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{blog.author.email}</span>
            <span>·</span>
            <time dateTime={blog.createdAt}>
              {format(new Date(blog.createdAt), 'MMM d, yyyy')}
            </time>
          </div>
          {isAuthor && (
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                }}
                aria-label="Edit blog"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                className="h-8 w-8 text-muted-foreground hover:text-red-600"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
                aria-label="Delete blog"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex-grow">
          <h2 className="blog-card-title mb-3 text-foreground transition-colors group-hover:text-orange-600 break-words">
            {blog.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-4 break-words">
            {getPreview()}
          </p>
        </div>

        {blog.content.length > 150 && (
          <div className="mt-4 text-sm font-medium text-orange-600 group-hover:underline">
            Read more →
          </div>
        )}
      </div>
    </Link>
  );
};

export default BlogCard;