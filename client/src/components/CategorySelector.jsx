export default function CategorySelector({ category, onChange }) {
  return (
    <div className="category-selector">
      <button 
        onClick={() => onChange('2x2')} 
        className={`btn ${category === '2x2' ? 'btn-primary' : ''}`} 
        style={{ width: 'auto', padding: '10px 20px', opacity: category === '2x2' ? 1 : 0.5 }}
      >2x2</button>
      <button 
        onClick={() => onChange('3x3')} 
        className={`btn ${category === '3x3' ? 'btn-primary' : ''}`} 
        style={{ width: 'auto', padding: '10px 20px', opacity: category === '3x3' ? 1 : 0.5 }}
      >3x3</button>
    </div>
  );
}