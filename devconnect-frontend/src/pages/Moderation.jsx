import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Moderation() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      const response = await api.get('/flags');
      setFlags(response.data.data);
    } catch (error) {
      console.error('Failed to fetch flags');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (flagId, action) => {
    try {
      await api.post(`/flags/${flagId}/review`, { action });
      setFlags(flags.filter(flag => flag.id !== flagId));
      alert(`Content ${action === 'approve' ? 'removed' : 'kept'} successfully`);
    } catch (error) {
      alert('Failed to review flag');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Moderation Queue</h1>
            <p className="text-sm text-gray-600 mt-1">Review flagged content from the community</p>
          </div>
          
          {flags.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">All clear!</p>
              <p className="text-sm text-gray-400 mt-1">No pending flags to review</p>
            </div>
          ) : (
            <div className="space-y-6">
              {flags.map((flag) => (
                <div key={flag.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Flagged by</span>
                      <p className="font-medium text-gray-900">{flag.user.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(flag.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium">
                      {flag.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Reason:</div>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{flag.reason}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Flagged Content:</div>
                    {flag.flaggable_type === 'App\\Models\\Discussion' ? (
                      <>
                        <div className="font-semibold text-gray-900 mb-2">
                          {flag.flaggable?.title}
                        </div>
                        <p className="text-gray-700 line-clamp-3">
                          {flag.flaggable?.body}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-700">{flag.flaggable?.body}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview(flag.id, 'approve')}
                      className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                    >
                      Remove Content
                    </button>
                    <button
                      onClick={() => handleReview(flag.id, 'reject')}
                      className="flex-1 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                    >
                      Keep Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}