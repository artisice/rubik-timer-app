import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TimerPage from './pages/TimerPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ModerationPage from './pages/ModerationPage';
import { useAuthStore } from './store/authStore';
import api from './api';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (e) {}
    logout();
  };

  if (!isAuthenticated) return null;

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#16213e', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: location.pathname === '/' ? '#4ea8de' : 'white', fontWeight: 'bold' }}>Главная</Link>
        <Link to="/train" style={{ color: location.pathname === '/train' ? '#4ea8de' : 'white', fontWeight: 'bold' }}>Тренировка</Link>
        <Link to="/competition" style={{ color: location.pathname === '/competition' ? '#4ea8de' : 'white', fontWeight: 'bold' }}>Соревнование</Link>
        <Link to="/leaderboard" style={{ color: location.pathname === '/leaderboard' ? '#4ea8de' : 'white', fontWeight: 'bold' }}>Таблица рекордов</Link>
        {user?.role === 'MODERATOR' && (
          <Link to="/moderation" style={{ color: location.pathname === '/moderation' ? '#f1c40f' : '#f1c40f', fontWeight: 'bold' }}>Модерация</Link>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ color: '#aaa' }}>{user?.name} ({user?.role})</span>
        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 15px' }}>Выйти</button>
      </div>
    </nav>
  );
};

const HomePage = () => {
  return <div className="page-center"><h1 style={{ fontSize: '48px' }}>Добро пожаловать в Rubik Timer!</h1></div>;
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/train" element={<ProtectedRoute><TimerPage mode="train" /></ProtectedRoute>} />
        <Route path="/competition" element={<ProtectedRoute><TimerPage mode="competition" /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/moderation" element={<ProtectedRoute><ModerationPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;