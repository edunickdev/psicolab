import { useState, useCallback } from 'react';
import { tarotCards } from './data/tarotCards';
import TrainingPhase from './components/TrainingPhase';
import EvaluationPhase from './components/EvaluationPhase';
import './App.css';

// Rango del entorno: ±ECO_MAX respuestas netas para llegar a sol pleno / tormenta total
const ECO_MAX = 6;

function App() {
  const [currentView, setCurrentView] = useState('training'); // Iniciamos en entrenamiento
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('psico_theme') || 'light';
  });

  // Estado ambiental contingente: + aciertos / − errores
  const [ecoScore, setEcoScore] = useState(0);

  const handleResponse = useCallback((isCorrect) => {
    setEcoScore(prev => Math.max(-ECO_MAX, Math.min(ECO_MAX, prev + (isCorrect ? 1 : -1))));
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('psico_theme', nextTheme);
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'training':
        return (
          <TrainingPhase
            cards={tarotCards}
            onResponse={handleResponse}
            ecoScore={ecoScore}
            onProceedToEvaluation={() => setCurrentView('evaluation')}
          />
        );
      case 'evaluation':
        return <EvaluationPhase onBackToTraining={() => setCurrentView('training')} />;
      default:
        return (
          <div className="home-content">
            <h2>Bienvenido</h2>
            <p>Selecciona un momento del menú lateral para comenzar</p>
          </div>
        );
    }
  };

  return (
    <div className="app-layout" data-theme={theme}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-badge">🧠 PsicoLab</div>
          <h1>Equivalencia de Estímulos</h1>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigation('home')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Inicio</span>
          </button>
          <button
            className={`nav-item ${currentView === 'training' ? 'active' : ''}`}
            onClick={() => handleNavigation('training')}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-label">Momento 1: Entrenamiento</span>
          </button>
          <button
            className={`nav-item ${currentView === 'evaluation' ? 'active' : ''}`}
            onClick={() => handleNavigation('evaluation')}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-label">Momento 2: Evaluación</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
            aria-label="Cambiar tema"
          >
            <span className="theme-toggle-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
            <span className="theme-toggle-label">{theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
