import { useState, useEffect } from 'react';
import api from '../api';

export default function LeaderboardPage() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      const res = await api.get('/leaderboard');
      setRecords(res.data);
    } catch (err) { console.error('Ошибка загрузки таблицы'); }
  };

  const filteredRecords = filter === 'all' ? records : records.filter(r => r.category === filter);

  const thStyle = { padding: '12px', textAlign: 'left', color: '#e9e9eb' };
  const tdStyle = { padding: '12px', color: '#e9e9eb' };

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Таблица рекордов</h1>
      <div className="category-selector" style={{ justifyContent: 'center', marginBottom: '30px' }}>
        <button onClick={() => setFilter('all')} className="btn btn-primary" style={{width: 'auto', padding: '8px 20px', opacity: filter === 'all' ? 1 : 0.5}}>Все</button>
        <button onClick={() => setFilter('2x2')} className="btn btn-primary" style={{width: 'auto', padding: '8px 20px', opacity: filter === '2x2' ? 1 : 0.5}}>2x2</button>
        <button onClick={() => setFilter('3x3')} className="btn btn-primary" style={{width: 'auto', padding: '8px 20px', opacity: filter === '3x3' ? 1 : 0.5}}>3x3</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#16213e', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#0f3460' }}>
            <th style={thStyle}>#</th><th style={thStyle}>Спидкубер</th><th style={thStyle}>Категория</th><th style={thStyle}>Время</th><th style={thStyle}>Видео</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, index) => (
            <tr key={record.id} style={{ borderBottom: '1px solid #1a1a2e' }}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{record.userName}</td>
              <td style={tdStyle}>{record.category}</td>
              <td style={{ ...tdStyle, fontWeight: 'bold', color: '#f1c40f' }}>{(record.time / 1000).toFixed(3)}s</td>
              <td style={tdStyle}><a href={record.videoUrl} target="_blank" rel="noreferrer" style={{ color: '#4ea8de' }}>Смотреть</a></td>
            </tr>
          ))}
          {filteredRecords.length === 0 && (
            <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center' }}>Рекордов пока нет</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}