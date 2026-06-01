import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/services'; 
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login(email, password);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Ошибка входа');
      }
    }
  };

  return (
    <div className="page-center">
      <form onSubmit={handleSubmit} className="card">
        <h2>Вход</h2>
        {error && <p className="text-error">{error}</p>}
        <div className="form-group">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
        </div>
        <button type="submit" className="btn btn-primary">Войти</button>
        <p className="text-center mt-4">
          Нет аккаунта? <a href="/register">Регистрация</a>
        </p>
      </form>
    </div>
  );
}