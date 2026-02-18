import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useDiscussionStore from '../store/discussionStore';
import useAuthStore from '../store/authstore';
import VoteButton from '../components/discussion/VoteButton';

export default function DiscussionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentDiscussion, loading, fetchDiscussion, addComment, flag, deleteDiscussion } = useDiscussionStore();
  const { user, isAuthenticated } = useAuthStore();
  const [commentBody, setCommentBody] = useState('');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDiscussion(id);
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    setSubmitting(true);
    const result = await addComment(id, commentBody);
    if (result.success) {
      setCommentBody('');
      setTimeout(() => window.location.reload(), 300);
    }
    setSubmitting(false);
  };

  const handleFlag = async (e) => {
    e.preventDefault();
    const result = await flag('App\\Models\\Discussion', parseInt(id), flagReason);
    if (result.success) {
      setShowFlagModal(false);
      alert('Content flagged for review');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this discussion?')) {
      const result = await deleteDiscussion(id);
      if (result.success) {
        navigate('/');
      }
    }
  };

  if (loading || !currentDiscussion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const categoryStyles = {
    general: 'bg-gray-100 text-gray-700',
    question: 'bg-blue-50 text-blue-700',
    'feature-request': 'bg-purple-50 text-purple-700',
    'bug-report': 'bg-red-50 text-red-700',
    'best-practice': 'bg-green-50 text-green-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex gap-6">
            <VoteButton
              type="discussion"
              id={currentDiscussion.id}
              upvotes={currentDiscussion.upvotes}
              downvotes={currentDiscussion.downvotes}
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${categoryStyles[currentDiscussion.category]}`}>
                  {currentDiscussion.category.replace('-', ' ')}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {currentDiscussion.title}
              </h1>
              
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                <Link 
                  to={`/profile/${currentDiscussion.user.id}`}
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  {currentDiscussion.user.name}
                </Link>
                {currentDiscussion.user.role !== 'user' && (
                  <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-md font-medium text-xs">
                    {currentDiscussion.user.role}
                  </span>
                )}
                <span>•</span>
                <span>{new Date(currentDiscussion.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{currentDiscussion.body}</p>
              </div>

             <div className="mt-6 flex gap-3 text-sm">
  {user && (user.id === currentDiscussion.user_id || user.role === 'moderator' || user.role === 'admin') && (
    <>
      <Link
        to={`/discussion/${currentDiscussion.id}/edit`}
        className="text-primary-600 hover:text-primary-700 font-medium"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        className="text-red-600 hover:text-red-700 font-medium"
      >
        Delete
      </button>
    </>
  )}
  {user && user.id !== currentDiscussion.user_id && (
    <button
      onClick={() => setShowFlagModal(true)}
      className="text-gray-600 hover:text-gray-700 font-medium"
    >
      Flag
    </button>
  )}
</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comments ({currentDiscussion.comments?.length || 0})
          </h3>

          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-6">
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
              />
              <button
                type="submit"
                disabled={submitting || !commentBody.trim()}
                className="mt-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <p className="text-gray-700 font-medium mb-3">Want to join the discussion?</p>
              <div className="flex gap-3 justify-center">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {currentDiscussion.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <VoteButton
                  type="comment"
                  id={comment.id}
                  upvotes={comment.upvotes}
                  downvotes={0}
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm text-gray-900">{comment.user.name}</span>
                    {comment.user.role !== 'user' && (
                      <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-md text-xs font-medium">
                        {comment.user.role}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Flag Content</h3>
            <form onSubmit={handleFlag}>
              <textarea
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                placeholder="Why are you flagging this content?"
                rows={4}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition"
                >
                  Submit Flag
                </button>
                <button
                  type="button"
                  onClick={() => setShowFlagModal(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}