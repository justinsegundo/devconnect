import { useState } from 'react';
import useDiscussionStore from '../../store/discussionStore';

export default function VoteButton({ type, id, upvotes, downvotes }) {
  const { vote } = useDiscussionStore();
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [loading, setLoading] = useState(false);

  const handleVote = async (voteType) => {
    if (loading) return;
    
    setLoading(true);
    const votableType = type === 'discussion' ? 'App\\Models\\Discussion' : 'App\\Models\\Comment';
    
    if (voteType === 'up') {
      setLocalUpvotes(prev => prev + 1);
    } else {
      setLocalDownvotes(prev => prev + 1);
    }

    const result = await vote(votableType, id, voteType);
    
    if (!result.success) {
      if (voteType === 'up') {
        setLocalUpvotes(prev => prev - 1);
      } else {
        setLocalDownvotes(prev => prev - 1);
      }
    }
    
    setLoading(false);
    setTimeout(() => window.location.reload(), 300);
  };

  const score = localUpvotes - localDownvotes;

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <button
        onClick={() => handleVote('up')}
        disabled={loading}
        className="group p-1 hover:bg-gray-100 rounded transition disabled:opacity-50"
      >
        <svg 
          className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      
      <span className={`text-sm font-semibold tabular-nums ${
        score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-500'
      }`}>
        {score}
      </span>
      
      <button
        onClick={() => handleVote('down')}
        disabled={loading}
        className="group p-1 hover:bg-gray-100 rounded transition disabled:opacity-50"
      >
        <svg 
          className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}