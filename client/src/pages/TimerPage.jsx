import { useState, useCallback } from 'react';
import Timer from '../components/Timer';
import ScrambleDisplay from '../components/ScrambleDisplay';
import CategorySelector from '../components/CategorySelector';
import CubeViewer from '../components/CubeViewer';
import { generateScramble } from '../utils/scramble';
import api from '../api';

export default function TimerPage({ mode }) {
  const isCompetition = mode === 'competition';
  
  const [category, setCategory] = useState('3x3');
  const [scramble, setScramble] = useState(() => generateScramble('3x3'));
  const [lastTime, setLastTime] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const resetScramble = () => {
    setScramble(generateScramble(category));
    setLastTime(null);
    setMessage('');
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setScramble(generateScramble(cat));
    setLastTime(null);
    setMessage('');
  };

  const handleTimerStop = useCallback((time) => {
    setLastTime(time);
    if (isCompetition) {
      setIsModalOpen(true);
    }
  }, [isCompetition]);

  const handleSubmitRecord = async () => {
    if (!videoUrl) { alert('Пожалуйста, вставьте ссылку на видео'); return; }
    setLoading(true);
    try {
      await api.post('/records', { category, time: lastTime, videoUrl });
      setMessage('Рекорд успешно отправлен на модерацию!');
      setIsModalOpen(false);
      setVideoUrl('');
    } catch (err) {
      alert('Ошибка отправки рекорда');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center" style={{ flexDirection: 'column', gap: '30px' }}>
      
      <CategorySelector category={category} onChange={handleCategoryChange} />
      <ScrambleDisplay scramble={scramble} />
      <Timer onStop={handleTimerStop} />

      {message && <p style={{ color: '#2ecc71', fontSize: '20px' }}>{message}</p>}

      {lastTime !== null && !isModalOpen && !message && (
        <button onClick={resetScramble} className="btn btn-success" style={{width: 'auto', padding: '10px 30px'}}>
          Следующий скрамбл
        </button>
      )}

      {isCompetition && isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>Рекорд: {(lastTime / 1000).toFixed(3)}s</h2>
            <p style={{ marginBottom: '20px' }}>Для подтверждения прикрепите ссылку на видео:</p>
            <input type="url" placeholder="https://youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="form-input" />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => { setIsModalOpen(false); resetScramble(); }} className="btn btn-danger" style={{width: '50%'}}>Отмена</button>
              <button onClick={handleSubmitRecord} className="btn btn-success" disabled={loading} style={{width: '50%'}}>{loading ? 'Отправка...' : 'Отправить'}</button>
            </div>
          </div>
        </div>
      )}

      <CubeViewer scramble={scramble} category={category} />

    </div>
  );
}