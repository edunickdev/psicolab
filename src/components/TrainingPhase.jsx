import { useState, useMemo, useEffect } from 'react';
import CardAtmosphere from './CardAtmosphere';
import { playApplause, playBuzzer } from '../utils/soundEffects';

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
        <linearGradient id="cardBackGrad" x1="0" y1="0" x2="165" y2="204" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="50%" stopColor="#2e1065" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="165" y2="204" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <pattern id="starsPattern" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="9" cy="9" r="0.9" fill="#fbbf24" fillOpacity="0.28" />
        </pattern>
      </defs>

      {/* Fondo y textura de estrellas */}
      <rect width="165" height="204" rx="18" fill="url(#cardBackGrad)" />
      <rect x="6" y="6" width="153" height="192" rx="14" fill="url(#starsPattern)" />

      {/* Marco Dorado Exterior e Interior */}
      <rect x="7" y="7" width="151" height="190" rx="13" stroke="url(#goldGrad)" strokeWidth="1.8" strokeOpacity="0.85" fill="none" />
      <rect x="13" y="13" width="139" height="178" rx="10" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.45" strokeDasharray="3 3" fill="none" />

      {/* Adornos de esquina */}
      <circle cx="13" cy="13" r="2.5" fill="#f59e0b" />
      <circle cx="152" cy="13" r="2.5" fill="#f59e0b" />
      <circle cx="13" cy="191" r="2.5" fill="#f59e0b" />
      <circle cx="152" cy="191" r="2.5" fill="#f59e0b" />

      {/* Medallón Celestial Central */}
      <g transform="translate(82.5, 102)">
        <circle cx="0" cy="0" r="32" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
        <circle cx="0" cy="0" r="26" stroke="#c084fc" strokeWidth="0.8" fill="none" />
        <circle cx="0" cy="0" r="22" fill="#1e1b4b" fillOpacity="0.85" stroke="url(#goldGrad)" strokeWidth="1" />
        
        {/* Estrella de 8 puntas mística */}
        <path d="M0 -18 L4 -5 L18 0 L4 5 L0 18 L-4 5 L-18 0 L-4 -5 Z" fill="url(#goldGrad)" />
        <path d="M-10 -10 L0 -4 L10 -10 L4 0 L10 10 L0 4 L-10 10 L-4 0 Z" fill="#fef08a" fillOpacity="0.65" />
        <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
        
        {/* Rayos orbitales */}
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

function TrainingPhase({ cards, onResponse, onProceedToEvaluation }) {
  const [attempts, setAttempts] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [cardIndex, setCardIndex] = useState(0); // 0: Dinero, 1: Embarazo, 2: Trabajo
  const [trainingPhase, setTrainingPhase] = useState('AB'); // 'AB' o 'BC'

  // Estados de refuerzo contingente inmediato ('correct' | 'incorrect' | null)
  const [activeEffect, setActiveEffect] = useState(null);
  const [effectKey, setEffectKey] = useState(0);

  // Estados de animación fluidos (Gather -> Riffle -> Deal -> Reveal)
  const [currentOptions, setCurrentOptions] = useState([]);
  const [shufflePhase, setShufflePhase] = useState('idle'); // 'idle' | 'flipping-down' | 'gathering' | 'riffle' | 'dealing' | 'flipping-up'

  const maxAttempts = 4;

  // Carta actual en orden
  const currentCard = useMemo(() => {
    return cards[cardIndex % cards.length];
  }, [cards, cardIndex]);

  // Inicializar opciones al cambiar de carta o de fase (A->B o B->C)
  useEffect(() => {
    const rawOptions = trainingPhase === 'AB' ? currentCard.optionsAB : currentCard.optionsBC;
    setCurrentOptions(shuffleArray(rawOptions));
    setShufflePhase('idle');
  }, [currentCard, trainingPhase]);

  const handleImageError = (e, fallbackText, bgColor) => {
    e.target.onerror = null;
    e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="100%" height="100%" rx="14" fill="${bgColor || '%231e293b'}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="16" font-weight="bold">${encodeURIComponent(fallbackText)}</text></svg>`;
  };

  const handleOptionClick = (option) => {
    if (attempts >= maxAttempts || shufflePhase !== 'idle') return;

    setSelectedOption(option);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Disparar estímulo de refuerzo contingente (Rayos rojos en error / Pájaros en acierto)
    const effectType = option.isCorrect ? 'correct' : 'incorrect';
    setActiveEffect(effectType);
    setEffectKey(prev => prev + 1);

    onResponse?.(option.isCorrect);

    // Efecto sonoro: Aplauso en respuesta correcta, Chicharra en respuesta incorrecta
    if (option.isCorrect) {
      playApplause();
    } else {
      playBuzzer();
    }

    // En el 4to y último intento: NO volver a barajar las cartas.
    // Se mantiene la selección con su feedback y se habilita directamente el botón para avanzar.
    if (newAttempts >= maxAttempts) {
      setTimeout(() => {
        setActiveEffect(null);
      }, 3400);
      return;
    }

    // 1. Mostrar resultado inicial con resplandor (700ms)
    setTimeout(() => {
      // 2. Fase 1: Girar boca abajo (400ms)
      setShufflePhase('flipping-down');

      setTimeout(() => {
        // 3. Fase 2: Las 3 cartas se reúnen suavemente en el centro formando una baraja (420ms)
        setShufflePhase('gathering');

        setTimeout(() => {
          // 4. Fase 3: Riffle/Corte en el centro y reordenación aleatoria en memoria (280ms)
          setShufflePhase('riffle');
          setCurrentOptions(prev => {
            let shuffled = shuffleArray(prev);
            if (shuffled.length > 1 && shuffled[0].id === prev[0].id && shuffled[1].id === prev[1].id) {
              shuffled = [shuffled[1], shuffled[0], ...shuffled.slice(2)];
            }
            return shuffled;
          });

          setTimeout(() => {
            // 5. Fase 4: Reparto fluido desde el centro hacia los slots con curva elástica (480ms)
            setShufflePhase('dealing');

            setTimeout(() => {
              // 6. Fase 5: Vuelven a descubrirse boca arriba en cascada 1-2-3 (550ms)
              setShufflePhase('flipping-up');
              setSelectedOption(null);

              setTimeout(() => {
                // 7. Fase 6: Finalizado, reposo interactivo y regreso al paisaje neutro
                setShufflePhase('idle');
                setTimeout(() => {
                  setActiveEffect(null);
                }, 550);
              }, 550);
            }, 500);
          }, 280);
        }, 420);
      }, 400);
    }, 700);
  };

  const isLastTrainingStep = cardIndex + 1 >= cards.length && trainingPhase === 'BC';

  const handleNext = () => {
    if (shufflePhase !== 'idle') return;

    setActiveEffect(null);
    if (trainingPhase === 'AB') {
      // Pasar a fase B→C para la misma carta
      setTrainingPhase('BC');
      setAttempts(0);
      setSelectedOption(null);
    } else if (cardIndex + 1 < cards.length) {
      // Avanzar a la siguiente carta de entrenamiento
      setTrainingPhase('AB');
      setAttempts(0);
      setSelectedOption(null);
      setCardIndex(prev => prev + 1);
    } else {
      // Completó el entrenamiento de las 3 cartas
      if (onProceedToEvaluation) {
        onProceedToEvaluation();
      }
    }
  };

  const canProceed = attempts >= maxAttempts && shufflePhase === 'idle';
  const attemptsRemaining = maxAttempts - attempts;

  const getTitle = () => {
    if (trainingPhase === 'AB') {
      return {
        stepLabel: 'Paso 1: Carta → Concepto',
        relation: 'Relación A → B',
        stimulus: currentCard.stimulusA,
        stimulusType: 'image',
        stimulusLabel: `Carta presentada (A${currentCard.id}):`,
        optionsLabel: 'Selecciona el concepto correspondiente (B):'
      };
    } else {
      return {
        stepLabel: 'Paso 2: Concepto → Significado',
        relation: 'Relación B → C',
        stimulus: currentCard.stimulusB,
        stimulusType: 'text',
        stimulusLabel: `Concepto presentado (B${currentCard.id}):`,
        optionsLabel: 'Selecciona la imagen correspondiente (C):'
      };
    }
  };

  const titleInfo = getTitle();

  return (
    <div className="training-phase">
      <div className="experiment-card">
        {/* Overlay Atmosférico Contingente sobre la Tarjeta */}
        <CardAtmosphere activeEffect={activeEffect} effectKey={effectKey} />

        {/* HUD Flotante: Contador de intentos en la esquina superior derecha */}
        <div className="attempts-hud" title={`Intentos restantes: ${attemptsRemaining} de ${maxAttempts}`}>
          <span className="attempts-hud-label">Intentos:</span>
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
        </div>


        {/* Estímulo Muestra (Sample) */}
        <div className="stimulus-display">
          <div className="stimulus-frame">
            {titleInfo.stimulusType === 'image' ? (
              <img 
                src={titleInfo.stimulus} 
                alt="Carta de tarot presentada" 
                className="main-stimulus-image"
                onError={(e) => handleImageError(e, currentCard.labelA || `Carta ${currentCard.id}`, '#e11d48')}
              />
            ) : (
              <div className="text-stimulus">
                <span className="text-stimulus-category">Concepto</span>
                <span className="text-stimulus-value">{titleInfo.stimulus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Comparaciones / Opciones con Animación 3D y Barajeo */}
        <div className="options-section">
          <div className="options-horizontal">
            {currentOptions.map((option, index) => {
              const isSelected = selectedOption?.id === option.id;
              return (
                <div
                  key={`slot-${option.id}-${trainingPhase}-${currentCard.id}`}
                  className={`card-3d-wrapper phase-${shufflePhase} slot-${index}`}
                  style={{ '--slot-index': index }}
                >
                  <button
                    className={`option-button-3d ${
                      isSelected
                        ? option.isCorrect
                          ? 'correct'
                          : 'incorrect'
                        : ''
                    }`}
                    onClick={() => handleOptionClick(option)}
                    disabled={attempts >= maxAttempts || shufflePhase !== 'idle'}
                    aria-label={`Opción ${index + 1}`}
                  >
                    <div className="card-3d-inner">
                      {/* Cara Frontal (Texto o Imagen según la relación) */}
                      <div className="card-face card-front">
                        {option.type === 'image' ? (
                          <img 
                            src={option.imageUrl} 
                            alt={option.label || `Opción ${option.id}`}
                            className="option-image-horizontal"
                            onError={(e) => handleImageError(e, option.label || 'Significado', '#2563eb')}
                          />
                        ) : (
                          <div className="text-option-card">
                            <span className="text-option-value">{option.text}</span>
                          </div>
                        )}
                        {isSelected && (
                          <div className={`option-status-overlay ${option.isCorrect ? 'correct' : 'incorrect'}`}>
                            <span>{option.isCorrect ? '✓' : '✕'}</span>
                          </div>
                        )}
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

        {/* Botón de Siguiente Paso / Carta */}
        <div className="actions-footer">
          <button 
            className={`next-button ${canProceed ? 'ready' : ''}`}
            onClick={handleNext}
            disabled={!canProceed}
          >
            <span>
              {trainingPhase === 'AB'
                ? 'Siguiente Paso (B → C)'
                : cardIndex + 1 < cards.length
                ? `Siguiente Carta (${cards[(cardIndex + 1) % cards.length].name})`
                : 'Pasar a Evaluación (Momento 2)'}
            </span>
            <span className="btn-arrow">→</span>
          </button>
          {!canProceed && (
            <span className="next-hint">Completa los {attemptsRemaining} intentos restantes para desbloquear</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrainingPhase;
