import { useState, useMemo, useEffect } from 'react';
import { evaluationTrials } from '../data/tarotCards';
import CardAtmosphere from './CardAtmosphere';

// Componente para el Dorso decorativo de la Carta de Tarot
function TarotCardBack() {
  return (
    <svg 
      className="tarot-card-back-svg" 
      viewBox="0 0 165 204" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cardBackGradEval" x1="0" y1="0" x2="165" y2="204" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="50%" stopColor="#2e1065" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="goldGradEval" x1="0" y1="0" x2="165" y2="204" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <pattern id="starsPatternEval" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="9" cy="9" r="0.9" fill="#fbbf24" fillOpacity="0.28" />
        </pattern>
      </defs>

      <rect width="165" height="204" rx="18" fill="url(#cardBackGradEval)" />
      <rect x="6" y="6" width="153" height="192" rx="14" fill="url(#starsPatternEval)" />

      <rect x="7" y="7" width="151" height="190" rx="13" stroke="url(#goldGradEval)" strokeWidth="1.8" strokeOpacity="0.85" fill="none" />
      <rect x="13" y="13" width="139" height="178" rx="10" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.45" strokeDasharray="3 3" fill="none" />

      <circle cx="13" cy="13" r="2.5" fill="#f59e0b" />
      <circle cx="152" cy="13" r="2.5" fill="#f59e0b" />
      <circle cx="13" cy="191" r="2.5" fill="#f59e0b" />
      <circle cx="152" cy="191" r="2.5" fill="#f59e0b" />

      <g transform="translate(82.5, 102)">
        <circle cx="0" cy="0" r="32" stroke="url(#goldGradEval)" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
        <circle cx="0" cy="0" r="26" stroke="#c084fc" strokeWidth="0.8" fill="none" />
        <circle cx="0" cy="0" r="22" fill="#1e1b4b" fillOpacity="0.85" stroke="url(#goldGradEval)" strokeWidth="1" />
        <path d="M0 -18 L4 -5 L18 0 L4 5 L0 18 L-4 5 L-18 0 L-4 -5 Z" fill="url(#goldGradEval)" />
        <path d="M-10 -10 L0 -4 L10 -10 L4 0 L10 10 L0 4 L-10 10 L-4 0 Z" fill="#fef08a" fillOpacity="0.65" />
        <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
      </g>
    </svg>
  );
}

// Algoritmo de barajeo Fisher-Yates
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function EvaluationPhase({ onBackToTraining }) {
  const [classFilter, setClassFilter] = useState('all'); // 'all' | 1 | 2 | 3
  const [trialIndex, setTrialIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [responses, setResponses] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Estados de animación fluidos (Gather -> Riffle -> Deal -> Reveal)
  const [currentOptions, setCurrentOptions] = useState([]);
  const [shufflePhase, setShufflePhase] = useState('idle');

  const activeTrials = useMemo(() => {
    if (classFilter === 'all') return evaluationTrials;
    return evaluationTrials.filter(t => t.classId === classFilter);
  }, [classFilter]);

  const currentTrial = activeTrials[trialIndex];
  const totalTrials = activeTrials.length;

  // Al cambiar de filtro o de trial, cargar y barajar opciones
  useEffect(() => {
    if (currentTrial) {
      setCurrentOptions(shuffleArray(currentTrial.options));
      setSelectedOption(null);
      setShufflePhase('idle');
    }
  }, [trialIndex, currentTrial]);

  const handleFilterChange = (newFilter) => {
    setClassFilter(newFilter);
    setTrialIndex(0);
    setSelectedOption(null);
    setResponses([]);
    setIsCompleted(false);
    setShufflePhase('idle');
  };

  const handleImageError = (e, fallbackText, bgColor) => {
    e.target.onerror = null;
    e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="100%" height="100%" rx="14" fill="${bgColor || '%231e293b'}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="16" font-weight="bold">${encodeURIComponent(fallbackText)}</text></svg>`;
  };

  // En evaluación: 1 intento por ensayo, sin refuerzo contingente (extinción)
  const handleOptionClick = (option) => {
    if (selectedOption !== null || shufflePhase !== 'idle') return;

    setSelectedOption(option);

    const newResponse = {
      trialId: currentTrial.id,
      screenNumber: currentTrial.screenNumber,
      relationType: currentTrial.relationType,
      property: currentTrial.property,
      classId: currentTrial.classId,
      className: currentTrial.className,
      isCorrect: option.isCorrect,
      selectedLabel: option.label || option.text
    };

    setResponses(prev => [...prev, newResponse]);
  };

  const handleNext = () => {
    if (selectedOption === null || shufflePhase !== 'idle') return;

    if (trialIndex + 1 < totalTrials) {
      // 1. Voltear cartas y barajar hacia el siguiente trial
      setShufflePhase('flipping-down');

      setTimeout(() => {
        setShufflePhase('gathering');

        setTimeout(() => {
          setShufflePhase('riffle');
          setTrialIndex(prev => prev + 1);

          setTimeout(() => {
            setShufflePhase('dealing');

            setTimeout(() => {
              setShufflePhase('flipping-up');
              setSelectedOption(null);

              setTimeout(() => {
                setShufflePhase('idle');
              }, 500);
            }, 450);
          }, 260);
        }, 380);
      }, 350);
    } else {
      // Fin de la evaluación
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setTrialIndex(0);
    setSelectedOption(null);
    setResponses([]);
    setIsCompleted(false);
    setShufflePhase('idle');
  };

  // Resumen analítico de resultados por propiedad y por clase
  const summary = useMemo(() => {
    const total = responses.length;
    const correctTotal = responses.filter(r => r.isCorrect).length;
    const byProperty = {};
    const byClass = {};

    responses.forEach(r => {
      // Agrupación por propiedad matemática
      if (!byProperty[r.property]) {
        byProperty[r.property] = { total: 0, correct: 0 };
      }
      byProperty[r.property].total += 1;
      if (r.isCorrect) byProperty[r.property].correct += 1;

      // Agrupación por clase
      const cName = r.className || `Clase ${r.classId}`;
      if (!byClass[cName]) {
        byClass[cName] = { total: 0, correct: 0 };
      }
      byClass[cName].total += 1;
      if (r.isCorrect) byClass[cName].correct += 1;
    });

    return {
      total,
      correctTotal,
      percentage: total > 0 ? Math.round((correctTotal / total) * 100) : 0,
      byProperty,
      byClass
    };
  }, [responses]);

  if (isCompleted) {
    return (
      <div className="training-phase">
        <div className="experiment-card" style={{ maxWidth: '860px', padding: '2.2rem 2.8rem' }}>
          <CardAtmosphere activeEffect={null} />

          <div className="training-header">
            <div className="phase-badge-container">
              <span className="phase-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
                Momento 2: Resultados de Evaluación
              </span>
            </div>
            <h2 style={{ margin: '0.6rem 0 0.2rem', fontSize: '1.6rem', color: 'var(--text-title)' }}>
              Pruebas de Emergencia de Equivalencia
            </h2>
            <p style={{ color: 'var(--text-subtitle)', fontSize: '0.95rem', margin: 0 }}>
              Evaluación de las 27 pantallas del paradigma de Murray Sidman
            </p>
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem', margin: '1rem 0' }}>
            {/* Tarjeta de porcentaje global */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.2rem 1.8rem',
                borderRadius: '18px',
                background: summary.percentage >= 80 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                border: summary.percentage >= 80 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtitle)', fontWeight: 700 }}>
                  Aciertos Globales de Equivalencia
                </span>
                <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.5rem', color: 'var(--text-title)' }}>
                  {summary.correctTotal} de {summary.total} ensayos correctos
                </h3>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: summary.percentage >= 80 ? '#10b981' : '#6366f1' }}>
                {summary.percentage}%
              </div>
            </div>

            {/* Desglose por propiedades lógicas (Reflexividad, Simetría, Transitividad, Equivalencia) */}
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtitle)', marginBottom: '0.5rem', display: 'block' }}>
                Desglose por Propiedad Lógica:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.8rem' }}>
                {Object.entries(summary.byProperty).map(([prop, data]) => {
                  const pct = Math.round((data.correct / data.total) * 100);
                  const isPassed = pct >= 80;
                  return (
                    <div
                      key={prop}
                      style={{
                        padding: '1rem',
                        borderRadius: '14px',
                        background: 'var(--counter-bg)',
                        border: '1px solid var(--counter-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                      }}
                    >
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-title)', fontWeight: 700 }}>{prop}</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-title)' }}>
                          {data.correct}/{data.total}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isPassed ? '#10b981' : '#f59e0b' }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desglose por Clase de Estímulos */}
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtitle)', marginBottom: '0.5rem', display: 'block' }}>
                Desglose por Clase de Estímulos:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.8rem' }}>
                {Object.entries(summary.byClass).map(([cName, data]) => {
                  const pct = Math.round((data.correct / data.total) * 100);
                  const isPassed = pct >= 80;
                  return (
                    <div
                      key={cName}
                      style={{
                        padding: '0.9rem 1.1rem',
                        borderRadius: '14px',
                        background: 'var(--counter-bg)',
                        border: '1px solid var(--counter-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-title)', fontWeight: 600 }}>{cName}</span>
                      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-title)' }}>
                          {data.correct}/{data.total}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isPassed ? '#10b981' : '#f59e0b' }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Veredicto de formación de clase */}
            <div
              style={{
                padding: '0.9rem 1.4rem',
                borderRadius: '14px',
                background: summary.percentage >= 80 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                border: summary.percentage >= 80 ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
                color: summary.percentage >= 80 ? '#059669' : '#d97706',
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {summary.percentage >= 80
                ? '✓ Se confirma empíricamente la formación de las clases de equivalencia {A, B, C}.'
                : 'Se requiere reforzar el entrenamiento de línea base para consolidar la equivalencia plena.'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button
              onClick={handleRestart}
              className="next-button ready"
              style={{ padding: '0.8rem 1.8rem' }}
            >
              <span>Repetir Evaluación</span>
              <span>🔄</span>
            </button>
            {onBackToTraining && (
              <button
                onClick={onBackToTraining}
                className="next-button"
                style={{ padding: '0.8rem 1.8rem', background: 'var(--toggle-btn-bg)', color: 'var(--toggle-btn-text)', border: '1px solid var(--toggle-btn-border)' }}
              >
                <span>Volver a Entrenamiento</span>
                <span>📚</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const canProceed = selectedOption !== null && shufflePhase === 'idle';

  return (
    <div className="training-phase">
      <div className="experiment-card">
        {/* Atmósfera siempre neutra (sin refuerzo contingente en evaluación) */}
        <CardAtmosphere activeEffect={null} />

        {/* HUD Flotante: Indicador de Ensayo de Evaluación */}
        <div className="attempts-hud" title={`Ensayo ${trialIndex + 1} de ${totalTrials}`}>
          <span className="attempts-hud-label">Ensayo:</span>
          <span className="attempts-number" style={{ fontWeight: 800 }}>
            {trialIndex + 1}/{totalTrials}
          </span>
        </div>


        {/* Estímulo Muestra (Sample) */}
        <div className="stimulus-display">
          <div className="stimulus-frame">
            {currentTrial.sample.type === 'image' ? (
              <img 
                src={currentTrial.sample.value} 
                alt={currentTrial.sample.label} 
                className="main-stimulus-image"
                onError={(e) => handleImageError(e, currentTrial.sample.label, '#6366f1')}
              />
            ) : (
              <div className="text-stimulus">
                <span className="text-stimulus-category">Concepto</span>
                <span className="text-stimulus-value">{currentTrial.sample.value}</span>
              </div>
            )}
          </div>
        </div>

        {/* Comparaciones / Opciones con Animación 3D */}
        <div className="options-section">
          <div className="options-horizontal">
            {currentOptions.map((option, index) => {
              const isSelected = selectedOption?.id === option.id;
              return (
                <div
                  key={`eval-slot-${option.id}-${trialIndex}-${classFilter}`}
                  className={`card-3d-wrapper phase-${shufflePhase} slot-${index}`}
                  style={{ '--slot-index': index }}
                >
                  <button
                    className={`option-button-3d ${isSelected ? 'selected' : ''}`}
                    style={
                      isSelected
                        ? {
                            boxShadow: '0 0 0 3px #6366f1, 0 12px 28px rgba(99, 102, 241, 0.35)',
                            transform: 'translateY(-4px) scale(1.02)',
                          }
                        : {}
                    }
                    onClick={() => handleOptionClick(option)}
                    disabled={selectedOption !== null || shufflePhase !== 'idle'}
                    aria-label={`Opción ${index + 1}`}
                  >
                    <div className="card-3d-inner">
                      {/* Cara Frontal (Texto o Imagen) */}
                      <div className="card-face card-front">
                        {option.type === 'image' ? (
                          <img 
                            src={option.imageUrl} 
                            alt={option.label || `Opción ${option.id}`}
                            className="option-image-horizontal"
                            onError={(e) => handleImageError(e, option.label || 'Opción', '#2563eb')}
                          />
                        ) : (
                          <div className="text-option-card">
                            <span className="text-option-value">{option.text}</span>
                          </div>
                        )}
                        {/* En evaluación NO hay overlay de check o cruz (sin refuerzo) */}
                      </div>

                      {/* Cara Posterior (Dorso místico de la carta) */}
                      <div className="card-face card-back">
                        <TarotCardBack />
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón de Siguiente Ensayo / Ver Resultados */}
        <div className="actions-footer">
          <button 
            className={`next-button ${canProceed ? 'ready' : ''}`}
            onClick={handleNext}
            disabled={!canProceed}
          >
            <span>{trialIndex + 1 === totalTrials ? 'Ver Resultados' : 'Siguiente Ensayo'}</span>
            <span className="btn-arrow">→</span>
          </button>
          {!canProceed && (
            <span className="next-hint">Selecciona una opción para registrar tu respuesta</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default EvaluationPhase;
