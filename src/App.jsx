import { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import PastDishes from './components/PastDishes';
import Pantry from './components/Pantry';
import GeneratorDashboard from './components/GeneratorDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('breakfast');
  const [pastBreakfasts, setPastBreakfasts] = useLocalStorage('ai-breakfast-dishes', []);
  const [pastLunches, setPastLunches] = useLocalStorage('ai-lunch-dishes', []);
  const [pastDinners, setPastDinners] = useLocalStorage('ai-dinner-dishes', []);
  const [ingredients, setIngredients] = useLocalStorage('ai-breakfast-ingredients', []);

  useEffect(() => {
    document.body.className = `theme-${activeTab}`;
  }, [activeTab]);

  const pastDishes = activeTab === 'breakfast' ? pastBreakfasts : activeTab === 'lunch' ? pastLunches : pastDinners;
  const setPastDishes = activeTab === 'breakfast' ? setPastBreakfasts : activeTab === 'lunch' ? setPastLunches : setPastDinners;

  return (
    <div className="container">
      <nav className="navbar">
        <div className="brand-logo">
          <span style={{ fontSize: '2rem', marginRight: '6px' }}>🍲</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
            <span style={{ fontStyle: 'italic', fontWeight: 700 }}>Bengali</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Breakfast House</span>
          </div>
        </div>
        <div className="nav-links">
          <a href="#" className={activeTab === 'breakfast' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('breakfast'); }}>Breakfast</a>
          <a href="#" className={activeTab === 'lunch' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('lunch'); }}>Lunch</a>
          <a href="#" className={activeTab === 'dinner' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('dinner'); }}>Dinner</a>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-text">
          <h1 style={{ lineHeight: '1.2' }}>Authentic<br />Bengali<br />{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}.</h1>
          <p style={{ fontSize: '1.25rem', marginTop: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>Simple. Fresh. Homemade.</p>
          <button
            onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            style={{
              marginTop: '2.5rem',
              padding: '1rem 2rem',
              borderRadius: '40px',
              fontSize: '1.1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'var(--primary)'
            }}
          >
            View Menu <span style={{ fontSize: '1.2rem' }}>→</span>
          </button>
        </div>
        <div className="hero-image">
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Pantry ingredients={ingredients} setIngredients={setIngredients} />
      </div>

      <div className="dashboard-layout">
        <div className="sidebar custom-scrollbar">
          <PastDishes dishes={pastDishes} setDishes={setPastDishes} mealType={activeTab} />
        </div>

        <div className="main-content">
          <GeneratorDashboard ingredients={ingredients} pastDishes={pastDishes} mealType={activeTab} />
        </div>
      </div>
    </div>
  );
}

export default App;
