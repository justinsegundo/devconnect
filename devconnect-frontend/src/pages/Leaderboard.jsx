import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/leaderboard');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard');
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Top Contributors</h1>
            <p className="text-sm text-gray-600 mt-1">Community members with the highest reputation</p>
          </div>
          
          <div className="space-y-3">
            {users.map((user, index) => (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-200 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-primary-50 text-primary-700'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition">
                      {user.name}
                    </span>
                    {user.role !== 'user' && (
                      <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-md text-xs font-medium">
                        {user.role}
                      </span>
                    )}
                  </div>
                  {user.badges && user.badges.length > 0 && (
                    <div className="flex gap-2 text-xs">
                      {user.badges.slice(0, 3).map((badge) => (
                        <span key={badge.id} className="text-yellow-600">
                          🏆 {badge.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-primary-600">{user.reputation_score}</div>
                  <div className="text-xs text-gray-500 font-medium">reputation</div>
                </div>
              </Link>
            ))}
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No contributors yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}