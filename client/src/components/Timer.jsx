import { useState, useEffect, useRef, useCallback } from 'react';

export default function Timer({ onStop }) {
  const [state, setState] = useState('idle');
  const [time, setTime] = useState(0);
  
  const startTimeRef = useRef(0);
  const animFrameRef = useRef(0);
  const holdTimeoutRef = useRef(null);
  
  const stateRef = useRef(state);
  
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const startRunning = useCallback(() => {
    setState('running');
    startTimeRef.current = Date.now();
    setTime(0);

    const updateTimer = () => {
      setTime(Date.now() - startTimeRef.current);
      animFrameRef.current = requestAnimationFrame(updateTimer);
    };
    animFrameRef.current = requestAnimationFrame(updateTimer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code !== 'Space') return;
      e.preventDefault();

      const currentState = stateRef.current;
      
      if (currentState === 'idle' || currentState === 'stopped') {
        holdTimeoutRef.current = setTimeout(() => {
          setState('holding');
          setTime(0);
        }, 300);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code !== 'Space') return;
      e.preventDefault();

      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }

      const currentState = stateRef.current;

      if (currentState === 'holding') {
        startRunning();
      } else if (currentState === 'running') {
        cancelAnimationFrame(animFrameRef.current);
        const finalTime = Date.now() - startTimeRef.current;
        setTime(finalTime);
        setState('stopped');
        onStop(finalTime);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [startRunning, onStop]);

  const formatTime = (ms) => {
    if (ms < 0) ms = 0;
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor(ms % 1000);

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
    }
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const getTimerColor = () => {
    switch (state) {
      case 'holding': return '#e74c3c';
      case 'running': return '#2ecc71';
      case 'stopped': return '#f1c40f';
      default: return '#ffffff';
    }
  };

  return (
    <div className="timer-container">
      <div 
        className="timer-display" 
        style={{ color: getTimerColor() }}
      >
        {formatTime(time)}
      </div>
      <p className="timer-hint">
        {state === 'idle' || state === 'stopped' ? 'Удержите ПРОБЕЛ для старта' : 
         state === 'holding' ? 'Отпустите для старта!' : 'Нажмите ПРОБЕЛ для остановки'}
      </p>
    </div>
  );
}