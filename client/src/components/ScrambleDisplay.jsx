export default function ScrambleDisplay({ scramble }) {
  const getMoveColor = (move) => {
    const face = move.charAt(0);
    switch (face) {
      case 'U': return '#ffffff'; case 'D': return '#f1c40f';
      case 'F': return '#2ecc71'; case 'B': return '#3498db';
      case 'R': return '#e74c3c'; case 'L': return '#e67e22';
      default: return '#ffffff';
    }
  };

  return (
    <div className="scramble-display">
      {scramble.split(' ').map((move, index) => (
        <span key={index} style={{ color: getMoveColor(move), fontWeight: 'bold' }}>
          {move}{' '}
        </span>
      ))}
    </div>
  );
}