import { useState, useEffect } from 'react';
import { getCubeState } from '../utils/cubeSimulator';

const COLORS = {
  W: '#ffffff', Y: '#ffd500', G: '#009b48',
  B: '#0046ad', R: '#b71234', O: '#ff5800',
};

export default function CubeViewer({ scramble, category }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cubeState, setCubeState] = useState(getCubeState(''));

  useEffect(() => {
    setCubeState(getCubeState(scramble));
  }, [scramble]);

  const is2x2 = category === '2x2';

  const renderFace = (faceKey) => {
    const face = cubeState[faceKey];
    
    const relevantStickers = is2x2 
      ? [face[0], face[2], face[6], face[8]] 
      : face;

    const faceClass = is2x2 ? 'cube-face-2x2' : 'cube-face';
    const stickerClass = is2x2 ? 'cube-sticker-2x2' : 'cube-sticker';

    return (
      <div className={faceClass}>
        {relevantStickers.map((color, idx) => (
          <div 
            key={idx} 
            className={stickerClass} 
            style={{ backgroundColor: COLORS[color] }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="cube-viewer-container">
      <button className="cube-toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? 'Развернуть' : 'Свернуть'}
      </button>

      {!isCollapsed && (
        <div className="cube-net">
          <div className="cube-row">
            {renderFace('U')}
          </div>
          
          <div className="cube-row">
            {renderFace('L')}
            {renderFace('F')}
            {renderFace('R')}
            {renderFace('B')}
          </div>
          
          <div className="cube-row">
            {renderFace('D')}
          </div>
        </div>
      )}
    </div>
  );
}