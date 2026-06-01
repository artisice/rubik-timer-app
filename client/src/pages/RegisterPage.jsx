import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', { name, email, age: age ? Number(age) : undefined, password });
      alert('Регистрация успешна! Теперь войдите.');
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Ошибка регистрации');
      }
    }
  };

  return (
    <div className="page-center">
      <form onSubmit={handleSubmit} className="card">
        <h2>Регистрация</h2>
        {error && <p className="text-error">{error}</p>}
        <div className="form-group">
          <input type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <input type="number" placeholder="Возраст (необязательно)" value={age} onChange={(e) => setAge(e.target.value)} className="form-input" />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
        </div>
        <button type="submit" className="btn btn-success">Зарегистрироваться</button>
      </form>
    </div>
  );
}