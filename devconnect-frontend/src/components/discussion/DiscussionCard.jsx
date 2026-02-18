import { Link } from 'react-router-dom';
import VoteButton from './VoteButton';

export default function DiscussionCard({ discussion }) {
  const categoryStyles = {
    general: 'bg-gray-100 text-gray-700',
    question: 'bg-blue-50 text-blue-700',
    'feature-request': 'bg-purple-50 text-purple-700',
    'bug-report': 'bg-red-50 text-red-700',
    'best-practice': 'bg-green-50 text-green-700',
  };

  const categoryLabels = {
    general: 'General',
    question: 'Question',
    'feature-request': 'Feature',
    'bug-report': 'Bug',
    'best-practice': 'Best Practice',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition">
      <div className="flex gap-4">
        <VoteButton
          type="discussion"
          id={discussion.id}
          upvotes={discussion.upvotes}
          downvotes={discussion.downvotes}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${categoryStyles[discussion.category]}`}>
              {categoryLabels[discussion.category]}
            </span>
          </div>

          <Link 
            to={`/discussion/${discussion.id}`}
            className="block group"
          >
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition mb-2">
              {discussion.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {discussion.body}
          </p>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="font-medium text-gray-700">{discussion.user.name}</span>
            {discussion.user.role !== 'user' && (
              <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-md font-medium">
                {discussion.user.role}
              </span>
            )}
            <span>•</span>
            <span>{new Date(discussion.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span>{discussion.comments_count} {discussion.comments_count === 1 ? 'comment' : 'comments'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}