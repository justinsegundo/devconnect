import { useState, useEffect } from 'react';
import useDiscussionStore from '../store/discussionStore';
import DiscussionCard from '../components/discussion/DiscussionCard';

export default function Home() {
  const { discussions, loading, fetchDiscussions } = useDiscussionStore();
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('latest');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadDiscussions();
  }, [category, sort]);

  const loadDiscussions = () => {
    const params = {};
    if (category !== 'all') params.category = category;
    if (sort) params.sort = sort;
    if (search) params.search = search;
    fetchDiscussions(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadDiscussions();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Discussions</h1>
          
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search discussions..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </form>

          <div className="flex flex-wrap gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="question">Question</option>
              <option value="feature-request">Feature Request</option>
              <option value="bug-report">Bug Report</option>
              <option value="best-practice">Best Practice</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No discussions found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {discussions.map((discussion) => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}