import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-3xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-sm text-gray-600 mt-1">{user.email}</p>
              </div>
            </div>
            {user.role !== 'user' && (
              <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                {user.role}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-900">{user.reputation_score}</div>
              <div className="text-sm text-blue-700 font-medium mt-1">Reputation</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-900">{user.discussions_count}</div>
              <div className="text-sm text-green-700 font-medium mt-1">Discussions</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-900">{user.comments_count}</div>
              <div className="text-sm text-purple-700 font-medium mt-1">Comments</div>
            </div>
          </div>

          {user.badges && user.badges.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Badges</h2>
              <div className="flex flex-wrap gap-3">
                {user.badges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-xl">🏆</span>
                    <div>
                      <div className="font-medium text-yellow-900 text-sm">{badge.name}</div>
                      <div className="text-xs text-yellow-700">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {user.discussions && user.discussions.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Discussions</h2>
              <div className="space-y-3">
                {user.discussions.map((discussion) => (
                  <Link
                    key={discussion.id}
                    to={`/discussion/${discussion.id}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="font-medium text-gray-900 mb-1">{discussion.title}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(discussion.created_at).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}