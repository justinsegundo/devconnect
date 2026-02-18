import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authstore';


export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
             <img 
                src="/devconnect-logo.png" 
                alt="DevConnect Logo" 
                className="w-40 h-auto"
              />
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <Link 
                to="/" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition"
              >
                Discussions
              </Link>
              <Link 
                to="/leaderboard" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition"
              >
                Leaderboard
              </Link>
              {user?.role === 'moderator' || user?.role === 'admin' ? (
                <Link 
                  to="/moderation" 
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition"
                >
                  Moderation
                </Link>
              ) : null}
            </div>
          </div>

<div className="flex items-center gap-3">
  {isAuthenticated ? (
    <>
      <Link 
        to="/new" 
        className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
      >
        New Discussion
      </Link>
      
      <Link 
        to={`/profile/${user?.id}`} 
        className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-100 rounded-lg transition group"
      >
        <div className="relative">
          <div className="w-9 h-9 bg-gray-200 group-hover:bg-gray-300 rounded-full flex items-center justify-center transition">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          {user?.role !== 'user' && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary-600 rounded-full border-2 border-white flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-900">
          {user?.name}
        </span>
      </Link>
      
      <button
        onClick={handleLogout}
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link 
        to="/login" 
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        Login
      </Link>
      <Link 
        to="/register" 
        className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
      >
        Sign Up
      </Link>
    </>
  )}
</div>
        </div>
      </div>
    </nav>
  );
}