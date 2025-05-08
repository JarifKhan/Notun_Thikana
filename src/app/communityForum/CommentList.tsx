import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  _id: string;
  text: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
}

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        // Default values for missing data
        const defaultAvatar = "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20person%2C%20neutral%20background&width=40&height=40&seq=1&orientation=squarish";
        const defaultName = "Anonymous User";

        // Check if author exists and has required properties
        const hasValidAuthor = comment.author && typeof comment.author === 'object';
        const authorAvatar = hasValidAuthor && comment.author.avatar ? comment.author.avatar : defaultAvatar;
        const authorName = hasValidAuthor && comment.author.name ? comment.author.name : defaultName;

        return (
          <div key={comment._id || `comment-${Math.random()}`} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-8 h-8 rounded-full mr-3"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = defaultAvatar;
                }}
              />
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h4 className="font-medium text-gray-800 text-sm">
                    {authorName}
                  </h4>
                  <span className="ml-2 text-xs text-gray-500">
                    {comment.createdAt ?
                      formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) :
                      'recently'}
                  </span>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {comment.text || 'No comment text'}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
