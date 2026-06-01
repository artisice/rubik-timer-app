import { useState, useEffect } from 'react';
import api from '../api';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

export default function ModerationPage() {
  const { user } = useAuthStore();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  if (user?.role !== 'MODERATOR') return <Navigate to="/" />;

  useEffect(() => { fetchPending(); }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await api.get('/records/pending');
      setRecords(res.data);
    } catch (err) { console.error('Ошибка загрузки заявок'); } 
    finally { setLoading(false); }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/records/${id}/${action}`);
      setRecords(records.filter(r => r.id !== id));
    } catch (err) { alert('Ошибка при изменении статуса'); }
  };

  if (loading) return <div className="page-center">Загрузка заявок...</div>;

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Модерация рекордов</h1>
      {records.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '20px' }}>Нет ожидающих заявок</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {records.map(record => (
            <div key={record.id} className="card" style={{ maxWidth: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
              <div>
                <h3 style={{ color: '#4ea8de', margin: 0 }}>{record.userName}</h3>
                <p style={{ margin: '5px 0' }}>Категория: <strong>{record.category}</strong></p>
                <p style={{ fontSize: '28px', color: '#f1c40f', fontWeight: 'bold', margin: '5px 0' }}>{(record.time / 1000).toFixed(3)}s</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <a href={record.videoUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: 'auto', textDecoration: 'none', textAlign: 'center' }}> Смотреть видео</a>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleAction(record.id, 'approve')} className="btn btn-success" style={{ width: 'auto', padding: '10px 20px' }}> Одобрить</button>
                  <button onClick={() => handleAction(record.id, 'reject')} className="btn btn-danger" style={{ width: 'auto', padding: '10px 20px' }}> Отклонить</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}