import { useState, useMemo, useEffect, useRef } from 'react';
import { experimentSequence } from '../data/tarotCards';
import CardAtmosphere from './CardAtmosphere';
import { playApplause, playBuzzer } from '../utils/soundEffects';
import TraceabilityTable from './TraceabilityTable';

// Componente para el Dorso decorativo místico de la Carta de Tarot
function TarotCardBack() {
  return (
    <svg 
      className="tarot-card-back-svg" 
      viewBox="0 0 165 204" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cardBackGradRunner" x1="0" y1="0" x2="165" y2="204" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="50%" stopColor="#2e1065" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="goldGradRunner" x1="0" y1="0" x2="165" y2="204" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <pattern id="starsPatternRunner" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="9" cy="9" r="0.9" fill="#fbbf24" fillOpacity="0.28" />
        </pattern>
      </defs>

      {/* Fondo y textura de estrellas */}
      <rect width="165" height="204" rx="18" fill="url(#cardBackGradRunner)" />
      <rect x="6" y="6" width="153" height="192" rx="14" fill="url(#starsPatternRunner)" />

      {/* Marco Dorado Exterior e Interior */}
      <rect x="7" y="7" width="151" height="190" rx="13" stroke="url(#goldGradRunner)" strokeWidth="1.8" strokeOpacity="0.85" fill="none" />
      <rect x="13" y="13" width="139" height="178" rx="10" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.45" strokeDasharray="3 3" fill="none" />

      {/* Adornos de esquina */}
      <circle cx="13" cy="13" r="2.5" fill="#f59e0b" />
      <circle cx="152" cy="13" r="2.5" fill="#f59e0b" />
      <circle cx="13" cy="191" r="2.5" fill="#f59e0b" />
      <circle cx="152" cy="191" r="2.5" fill="#f59e0b" />

      {/* Medallón Celestial Central */}
      <g transform="translate(82.5, 102)">
        <circle cx="0" cy="0" r="32" stroke="url(#goldGradRunner)" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
        <circle cx="0" cy="0" r="26" stroke="#c084fc" strokeWidth="0.8" fill="none" />
        <circle cx="0" cy="0" r="22" fill="#1e1b4b" fillOpacity="0.85" stroke="url(#goldGradRunner)" strokeWidth="1" />
        
        {/* Estrella mística */}
        <path d="M0 -18 L4 -5 L18 0 L4 5 L0 18 L-4 5 L-18 0 L-4 -5 Z" fill="url(#goldGradRunner)" />
        <path d="M-10 -10 L0 -4 L10 -10 L4 0 L10 10 L0 4 L-10 10 L-4 0 Z" fill="#fef08a" fillOpacity="0.65" />
        <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
        
        <circle cx="0" cy="-29" r="1.5" fill="#f59e0b" />
        <circle cx="0" cy="29" r="1.5" fill="#f59e0b" />
        <circle cx="-29" cy="0" r="1.5" fill="#f59e0b" />
        <circle cx="29" cy="0" r="1.5" fill="#f59e0b" />
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

function ExperimentRunner({ onResponse }) {
  // Índice actual en la secuencia completa de 27 pantallas (0 a 26)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Registro de respuestas y de intentos
  const [attempts, setAttempts] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [evaluationResponses, setEvaluationResponses] = useState([]);
  const [trialHistory, setTrialHistory] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultsSubView, setResultsSubView] = useState('summary'); // 'summary' | 'bitacora'

  // Control estricto de Idempotencia y Bloqueo contra doble clic o desincronización de sonido
  const isProcessingRef = useRef(false);
  const [isLocked, setIsLocked] = useState(false);

  // Refuerzo contingente ('correct' | 'incorrect' | null)
  const [activeEffect, setActiveEffect] = useState(null);
  const [effectKey, setEffectKey] = useState(0);

  // Animación 3D de barajeo
  const [currentOptions, setCurrentOptions] = useState([]);
  const [shufflePhase, setShufflePhase] = useState('idle');

  // Pantalla actual de las 27
  const currentStage = useMemo(() => {
    return experimentSequence[currentIndex] || experimentSequence[0];
  }, [currentIndex]);

  const isTraining = currentStage.mode === 'training';
  const maxAttempts = currentStage.maxAttempts || (isTraining ? 4 : 1);
  const attemptsRemaining = maxAttempts - attempts;

  // Cargar opciones al cambiar de pantalla (orden estricto de la presentación PPT)
  useEffect(() => {
    if (currentStage && currentStage.options) {
      setCurrentOptions([...currentStage.options]);
      setAttempts(0);
      setSelectedOption(null);
      setActiveEffect(null);
      setShufflePhase('idle');
      isProcessingRef.current = false;
      setIsLocked(false);
    }
  }, [currentIndex, currentStage]);

  const handleImageError = (e, fallbackText, bgColor) => {
    e.target.onerror = null;
    e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="100%" height="100%" rx="14" fill="${bgColor || '%231e293b'}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="16" font-weight="bold">${encodeURIComponent(fallbackText)}</text></svg>`;
  };

  // Manejador al hacer clic en una opción con IDEMPOTENCIA y SINCRONIZACIÓN
  const handleOptionClick = (option) => {
    // 1. Candado de Idempotencia: Si ya se está procesando, bloqueado o barajando, ignorar clics rápidos
    if (
      isProcessingRef.current ||
      isLocked ||
      attempts >= maxAttempts ||
      shufflePhase !== 'idle' ||
      selectedOption !== null
    ) {
      return;
    }

    // Bloqueo síncrono inmediato (inmune a retrasos de re-renderizado de React)
    isProcessingRef.current = true;
    setIsLocked(true);
    setSelectedOption(option);

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Registro cronológico en la bitácora completa de trazabilidad (ensayo a ensayo)
    const historyEntry = {
      id: `screen-${currentStage.screenNumber}-att-${newAttempts}-${Date.now()}`,
      screenNumber: currentStage.screenNumber,
      mode: currentStage.mode,
      classId: currentStage.classId,
      className: currentStage.className,
      property: currentStage.property,
      propertyTitle: currentStage.propertyTitle,
      relationType: currentStage.relationType,
      attemptNumber: newAttempts,
      maxAttempts: maxAttempts,
      isCorrect: option.isCorrect,
      selectedLabel: option.label || option.text || option.id,
      correctLabel: currentStage.options.find(o => o.isCorrect)?.label || currentStage.options.find(o => o.isCorrect)?.text,
      timestamp: new Date().toLocaleTimeString()
    };
    setTrialHistory(prev => [...prev, historyEntry]);

    // ==========================================
    // CASO 1: MODO ENTRENAMIENTO (4 INTENTOS)
    // ==========================================
    if (isTraining) {
      // 1. Disparar refuerzo contingente visual
      const effectType = option.isCorrect ? 'correct' : 'incorrect';
      setActiveEffect(effectType);
      setEffectKey(prev => prev + 1);
      onResponse?.(option.isCorrect);

      // 2. Reproducir sonido
      if (option.isCorrect) {
        playApplause();
      } else {
        playBuzzer();
      }

      // En el 4to y último intento: esperar a que concluya el audio antes de desvanecer el efecto; NO se vuelve a barajar
      if (newAttempts >= maxAttempts) {
        const waitTime = option.isCorrect ? 4400 : 1500;
        setTimeout(() => {
          setActiveEffect(null);
          setIsLocked(false);
        }, waitTime);
        return;
      }

      // Intentos 1 a 3: Duraciones naturales que suman la duración del audio (~4.4s en acierto)
      const isCorrect = option.isCorrect;
      const initialDelay = isCorrect ? 800 : 450;
      const flipDownDuration = isCorrect ? 500 : 350;
      const gatherDuration = isCorrect ? 700 : 400;
      const riffleDuration = isCorrect ? 600 : 350;
      const dealDuration = isCorrect ? 900 : 500;
      const flipUpDuration = isCorrect ? 900 : 500;

      // 1. Mostrar resultado inicial con resplandor
      setTimeout(() => {
        // 2. Fase 1: Girar boca abajo y limpiar la selección inmediatamente para que las cartas queden limpias
        setShufflePhase('flipping-down');
        setSelectedOption(null);

        setTimeout(() => {
          // 3. Fase 2: Las 3 cartas se reúnen suavemente en el centro formando una baraja
          setShufflePhase('gathering');

          setTimeout(() => {
            // 4. Fase 3: Riffle/Corte en el centro y reordenación aleatoria en memoria
            setShufflePhase('riffle');
            setCurrentOptions(prev => {
              let shuffled = shuffleArray(prev);
              if (shuffled.length > 1 && shuffled[0].id === prev[0].id && shuffled[1].id === prev[1].id) {
                shuffled = [shuffled[1], shuffled[0], ...shuffled.slice(2)];
              }
              return shuffled;
            });

            setTimeout(() => {
              // 5. Fase 4: Reparto fluido desde el centro hacia los slots sin cortes
              setShufflePhase('dealing');

              setTimeout(() => {
                // 6. Fase 5: Vuelven a descubrirse boca arriba en cascada limpias
                setShufflePhase('flipping-up');

                setTimeout(() => {
                  // 7. Fase 6: Finalizado, reposo interactivo y reactivación
                  setShufflePhase('idle');
                  setActiveEffect(null);
                  isProcessingRef.current = false;
                  setIsLocked(false);
                }, flipUpDuration);
              }, dealDuration);
            }, riffleDuration);
          }, gatherDuration);
        }, flipDownDuration);
      }, initialDelay);
    } 
    // ==========================================
    // CASO 2: MODO EVALUACIÓN (1 INTENTO ÚNICO)
    // ==========================================
    else {
      const newResponse = {
        screenNumber: currentStage.screenNumber,
        classId: currentStage.classId,
        className: currentStage.className,
        property: currentStage.property,
        propertyTitle: currentStage.propertyTitle,
        relationType: currentStage.relationType,
        isCorrect: option.isCorrect,
        selectedLabel: option.label || option.text,
        correctLabel: currentStage.options.find(o => o.isCorrect)?.label || currentStage.options.find(o => o.isCorrect)?.text
      };

      setEvaluationResponses(prev => [
        ...prev.filter(r => r.screenNumber !== currentStage.screenNumber),
        newResponse
      ]);
      // En evaluación: se registra 1 intento y se mantiene el bloqueo hasta avanzar a la siguiente pantalla
    }
  };

  // Botón para avanzar a la siguiente pantalla
  const canProceed = attempts >= maxAttempts && shufflePhase === 'idle';

  const handleNext = () => {
    if (!canProceed || shufflePhase !== 'idle' || isLocked) return;

    setActiveEffect(null);
    isProcessingRef.current = false;
    setIsLocked(false);

    if (currentIndex + 1 < experimentSequence.length) {
      // Transición suave hacia la siguiente pantalla
      setShufflePhase('flipping-down');

      setTimeout(() => {
        setShufflePhase('gathering');

        setTimeout(() => {
          setShufflePhase('riffle');
          setCurrentIndex(prev => prev + 1);

          setTimeout(() => {
            setShufflePhase('dealing');

            setTimeout(() => {
              setShufflePhase('flipping-up');
              setSelectedOption(null);

              setTimeout(() => {
                setShufflePhase('idle');
                isProcessingRef.current = false;
                setIsLocked(false);
              }, 480);
            }, 420);
          }, 260);
        }, 360);
      }, 320);
    } else {
      // Se completaron las 27 pantallas
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAttempts(0);
    setSelectedOption(null);
    setEvaluationResponses([]);
    setTrialHistory([]);
    setIsCompleted(false);
    setActiveEffect(null);
    setShufflePhase('idle');
    setResultsSubView('summary');
    isProcessingRef.current = false;
    setIsLocked(false);
  };

  // Salto rápido a cualquier pantalla (útil para experimentador o pruebas)
  const handleJumpToScreen = (screenNum) => {
    const targetIdx = screenNum - 1;
    if (targetIdx >= 0 && targetIdx < experimentSequence.length) {
      setCurrentIndex(targetIdx);
      setAttempts(0);
      setSelectedOption(null);
      setActiveEffect(null);
      setShufflePhase('idle');
      isProcessingRef.current = false;
      setIsLocked(false);
    }
  };

  // Resumen analítico de resultados de evaluación
  const summary = useMemo(() => {
    const total = evaluationResponses.length;
    const correctTotal = evaluationResponses.filter(r => r.isCorrect).length;
    const byProperty = {};
    const byClass = {};

    evaluationResponses.forEach(r => {
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
  }, [evaluationResponses]);

  // Texto contextual para el botón de avance
  const getNextButtonLabel = () => {
    if (currentIndex + 1 >= experimentSequence.length) {
      return 'Finalizar y Ver Resultados 🎉';
    }
    const nextStage = experimentSequence[currentIndex + 1];
    if (currentStage.screenNumber === 2) {
      return 'Siguiente: Evaluación Clase 1 (Dinero)';
    }
    if (currentStage.screenNumber === 9) {
      return 'Siguiente: Clase 2 (Embarazo A2 → B2)';
    }
    if (currentStage.screenNumber === 11) {
      return 'Siguiente: Evaluación Clase 2 (Embarazo)';
    }
    if (currentStage.screenNumber === 18) {
      return 'Siguiente: Clase 3 (Trabajo A3 → B3)';
    }
    if (currentStage.screenNumber === 20) {
      return 'Siguiente: Evaluación Clase 3 (Trabajo)';
    }
    return `Siguiente Pantalla (${nextStage.relationType})`;
  };

  // =========================================================================
  // PANTALLAS DE RESULTADOS ANALÍTICOS (AL COMPLETAR LAS 27 PANTALLAS)
  // =========================================================================
  if (isCompleted) {
    // SUB-RUTA DEDICADA 1: VISTA DE LA BITÁCORA CON SCROLL INTERNO CONTROLADO
    if (resultsSubView === 'bitacora') {
      return (
        <div className="training-phase">
          <div className="experiment-card" style={{ maxWidth: '980px', padding: '1.8rem 2.2rem' }}>
            <TraceabilityTable
              trialHistory={trialHistory}
              onBack={() => setResultsSubView('summary')}
            />
          </div>
        </div>
      );
    }

    // SUB-RUTA DEDICADA 2: RESUMEN CIENTÍFICO GLOBAL DE EQUIVALENCIA
    return (
      <div className="training-phase">
        <div className="experiment-card" style={{ maxWidth: '920px', padding: '2.4rem 2.8rem' }}>
          <CardAtmosphere activeEffect={null} />

          <div className="training-header">
            <div className="phase-badge-container">
              <span className="phase-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
                Resultados Finales del Experimento
              </span>
              <span className="relation-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                27 Pantallas Completadas
              </span>
            </div>
            <h2 style={{ margin: '0.6rem 0 0.2rem', fontSize: '1.75rem', color: 'var(--text-title)' }}>
              Reporte de Emergencia de Equivalencia de Estímulos
            </h2>
            <p style={{ color: 'var(--text-subtitle)', fontSize: '0.95rem', margin: 0 }}>
              Paradigma de Murray Sidman • Secuencia continua de 27 pantallas
            </p>
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem', margin: '1.2rem 0' }}>
            {/* Tarjeta de porcentaje global */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.3rem 2rem',
                borderRadius: '20px',
                background: summary.percentage >= 80 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                border: summary.percentage >= 80 ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(99, 102, 241, 0.35)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtitle)', fontWeight: 700 }}>
                  Aciertos Globales en Pruebas de Equivalencia
                </span>
                <h3 style={{ margin: '0.3rem 0 0', fontSize: '1.6rem', color: 'var(--text-title)' }}>
                  {summary.correctTotal} de {summary.total} pruebas correctas
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-subtitle)' }}>
                  (Evaluación en extinción: Reflexividad, Simetría, Transitividad y Equivalencia)
                </span>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: summary.percentage >= 80 ? '#10b981' : '#6366f1' }}>
                {summary.percentage}%
              </div>
            </div>

            {/* Desglose por propiedades lógicas (Reflexividad, Simetría, Transitividad, Equivalencia) */}
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtitle)', marginBottom: '0.6rem', display: 'block' }}>
                Desglose por Propiedad Lógica:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
                {Object.entries(summary.byProperty).map(([prop, data]) => {
                  const pct = Math.round((data.correct / data.total) * 100);
                  const isPassed = pct >= 80;
                  return (
                    <div
                      key={prop}
                      style={{
                        padding: '1.1rem',
                        borderRadius: '16px',
                        background: 'var(--counter-bg)',
                        border: '1px solid var(--counter-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                      }}
                    >
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-title)', fontWeight: 700 }}>{prop}</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-title)' }}>
                          {data.correct}/{data.total}
                        </span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: isPassed ? '#10b981' : '#f59e0b' }}>
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
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtitle)', marginBottom: '0.6rem', display: 'block' }}>
                Desglose por Clase de Estímulos:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
                {Object.entries(summary.byClass).map(([cName, data]) => {
                  const pct = Math.round((data.correct / data.total) * 100);
                  const isPassed = pct >= 80;
                  return (
                    <div
                      key={cName}
                      style={{
                        padding: '1rem 1.3rem',
                        borderRadius: '16px',
                        background: 'var(--counter-bg)',
                        border: '1px solid var(--counter-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.95rem', color: 'var(--text-title)', fontWeight: 600 }}>{cName}</span>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-title)' }}>
                          {data.correct}/{data.total}
                        </span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: isPassed ? '#10b981' : '#f59e0b' }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Veredicto científico de Murray Sidman */}
            <div
              style={{
                padding: '1rem 1.6rem',
                borderRadius: '16px',
                background: summary.percentage >= 80 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                border: summary.percentage >= 80 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                color: summary.percentage >= 80 ? '#059669' : '#d97706',
                fontSize: '0.95rem',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {summary.percentage >= 80
                ? '✓ Se confirma empíricamente la formación de las clases de equivalencia de 3 miembros {A, B, C}.'
                : 'Se requiere reforzar el entrenamiento de línea base para consolidar la equivalencia plena.'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', marginTop: '1.2rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setResultsSubView('bitacora')}
              className="btn-view-bitacora"
              title="Abrir bitácora detallada de respuestas ensayo a ensayo"
            >
              <span>📋</span>
              <span>Ver Bitácora de Trazabilidad</span>
              <span>→</span>
            </button>
            <button
              onClick={handleRestart}
              className="next-button ready"
              style={{ padding: '0.9rem 2.2rem' }}
            >
              <span>Reiniciar Experimento Completo</span>
              <span>🔄</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VISTA ACTIVA DEL EXPERIMENTO (PANTALLAS 1 A 27)
  // =========================================================================
  return (
    <div className="training-phase">
      <div className="experiment-card">
        {/* Atmósfera contingente:
            - En entrenamiento: Neutro por defecto, rayos rojos Stranger Things en error, bandada de pájaros en acierto.
            - En evaluación: Siempre neutro sereno (extinción). */}
        <CardAtmosphere activeEffect={isTraining ? activeEffect : null} effectKey={effectKey} />

        {/* HUD Flotante en la esquina superior derecha */}
        <div className="attempts-hud" title={isTraining ? `Intentos restantes: ${attemptsRemaining} de ${maxAttempts}` : `Ensayo de Evaluación: 1 intento`}>
          <span className="attempts-hud-label">{isTraining ? 'Intentos:' : 'Evaluación:'}</span>
          {isTraining ? (
            <>
              <div className="attempts-counter" aria-label={`Intentos: ${attemptsRemaining} de ${maxAttempts}`}>
                {[...Array(maxAttempts)].map((_, index) => (
                  <div
                    key={index}
                    className={`attempt-dot ${index < attemptsRemaining ? 'active' : 'used'}`}
                    title={`Intento ${index + 1}`}
                  />
                ))}
              </div>
              <span className="attempts-number">{attemptsRemaining}/{maxAttempts}</span>
            </>
          ) : (
            <span className="attempts-number" style={{ fontWeight: 800 }}>
              {attempts === 0 ? '1 Intento' : 'Completado ✓'}
            </span>
          )}
        </div>


        {/* Estímulo Muestra (Sample) */}
        <div className="stimulus-display">
          <div className="stimulus-frame">
            {currentStage.sample.type === 'image' ? (
              <img 
                src={currentStage.sample.value} 
                alt={currentStage.sample.label || 'Estímulo de muestra presentado'} 
                className="main-stimulus-image"
                onError={(e) => handleImageError(e, currentStage.sample.label || `Carta ${currentStage.classId}`, '#e11d48')}
              />
            ) : (
              <div className="text-stimulus">
                <span className="text-stimulus-category">Concepto</span>
                <span className="text-stimulus-value">{currentStage.sample.value}</span>
              </div>
            )}
          </div>
        </div>

        {/* Comparaciones / Opciones con Animación 3D y Barajeo */}
        <div className="options-section">
          <div className="options-horizontal">
            {currentOptions.map((option, index) => {
              const isSelected = selectedOption?.id === option.id && (shufflePhase === 'idle' || attempts >= maxAttempts);
              
              // Clases de estado del botón
              let buttonStateClass = '';
              if (isSelected) {
                if (isTraining) {
                  buttonStateClass = option.isCorrect ? 'correct' : 'incorrect';
                } else {
                  buttonStateClass = 'selected';
                }
              }

              return (
                <div
                  key={`stage-slot-pos-${index}-${currentStage.screenNumber}`}
                  className={`card-3d-wrapper phase-${shufflePhase} slot-${index}`}
                  style={{ '--slot-index': index }}
                >
                  <button
                    className={`option-button-3d ${buttonStateClass}`}
                    onClick={() => handleOptionClick(option)}
                    disabled={isLocked || attempts >= maxAttempts || shufflePhase !== 'idle'}
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

                        {/* En entrenamiento: Overlay solo con check ✓ o cruz ✕ (sin texto banner) */}
                        {isTraining && isSelected && (
                          <div className={`option-status-overlay ${option.isCorrect ? 'correct' : 'incorrect'}`}>
                            <span>{option.isCorrect ? '✓' : '✕'}</span>
                          </div>
                        )}
                      </div>

                      {/* Cara Posterior (Dorso místico de Tarot) */}
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

        {/* Botón de Siguiente Paso / Ensayo */}
        <div className="actions-footer">
          <button 
            className={`next-button ${canProceed ? 'ready' : ''}`}
            onClick={handleNext}
            disabled={!canProceed}
          >
            <span>{getNextButtonLabel()}</span>
            <span className="btn-arrow">→</span>
          </button>
          {!canProceed && (
            <span className="next-hint">
              {isTraining 
                ? `Completa los ${attemptsRemaining} intentos restantes para desbloquear el avance` 
                : 'Selecciona una opción para registrar tu ensayo'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExperimentRunner;
