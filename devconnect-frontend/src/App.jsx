import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authstore';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './pages/Home';
import CreateDiscussion from './pages/CreateDiscussion';
import DiscussionDetail from './pages/DiscussionDetail';
import UserProfile from './pages/UserProfile';
import Leaderboard from './pages/Leaderboard';
import Moderation from './pages/Moderation';
import EditDiscussion from './pages/EditDiscussion';

function App() {
  const { fetchUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/discussion/:id" element={<DiscussionDetail />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          <Route
            path="/new"
            element={
              <ProtectedRoute>
                <CreateDiscussion />
              </ProtectedRoute>
            }
          />

          <Route
            path="/discussion/:id/edit"
            element={
              <ProtectedRoute>
                <EditDiscussion />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/moderation"
            element={
              <ProtectedRoute requireModerator={true}>
                <Moderation />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;