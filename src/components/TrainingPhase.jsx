import { useState, useMemo } from 'react';

function TrainingPhase({ cards }) {
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [cardKey, setCardKey] = useState(0);
  const [trainingPhase, setTrainingPhase] = useState('AC'); // 'AC' o 'BC'

  const maxAttempts = 4;

  // Seleccionar carta aleatoria al cargar el componente o cuando cambia cardKey
  const currentCard = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
  }, [cards, cardKey]);

  // Generar 4 opciones (1 correcta + 3 incorrectas)
  const options = useMemo(() => {
    const correctOption = {
      id: currentCard.id,
      imageUrl: currentCard.stimulusC,
      isCorrect: true
    };

    const incorrectCards = cards.filter(c => c.id !== currentCard.id);
    const incorrectOptions = incorrectCards.slice(0, 3).map(card => ({
      id: card.id,
      imageUrl: card.stimulusC,
      isCorrect: false
    }));

    // Mezclar todas las opciones
    return [...incorrectOptions, correctOption].sort(() => Math.random() - 0.5);
  }, [currentCard, cards]);

  const handleImageError = (e, fallbackText, bgColor) => {
    e.target.onerror = null;
    e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="100%" height="100%" rx="14" fill="${bgColor || '%231e293b'}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="16" font-weight="bold">${encodeURIComponent(fallbackText)}</text></svg>`;
  };

  const handleOptionClick = (option) => {
    if (attempts >= maxAttempts) return; // Ya completó los intentos

    setSelectedOption(option);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (option.isCorrect) {
      setFeedback('¡Correcto!');
    } else {
      setFeedback('Incorrecto');
    }
    
    // Resetear selección después de 1 segundo para permitir otro intento
    setTimeout(() => {
      if (newAttempts < maxAttempts) {
        setSelectedOption(null);
        setFeedback('');
      }
    }, 1000);
  };

  const handleNext = () => {
    if (trainingPhase === 'AC') {
      // Pasar a fase B→C
      setTrainingPhase('BC');
      setAttempts(0);
      setSelectedOption(null);
      setFeedback('');
    } else {
      // Completó ambas fases, pasar a siguiente carta
      setTrainingPhase('AC');
      setAttempts(0);
      setSelectedOption(null);
      setFeedback('');
      setCardKey(cardKey + 1); // Forzar nueva carta aleatoria
    }
  };

  // El botón se activa solo cuando se completan los 4 intentos
  const canProceed = attempts >= maxAttempts;
  const attemptsRemaining = maxAttempts - attempts;

  const getTitle = () => {
    if (trainingPhase === 'AC') {
      return {
        label: 'Paso 1: Carta → Significado',
        stimulus: currentCard.stimulusA,
        stimulusType: 'image',
        stimulusLabel: 'Carta presentada:'
      };
    } else {
      return {
        label: 'Paso 2: Nombre → Significado',
        stimulus: currentCard.stimulusB,
        stimulusType: 'text',
        stimulusLabel: 'Nombre de la carta:'
      };
    }
  };

  const titleInfo = getTitle();

  return (
    <div className="training-phase">
      <div className="experiment-card">
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

        {/* Encabezado con título */}
        <div className="training-header">
          <div className="phase-badge-container">
            <span className="phase-badge">Momento 1: Entrenamiento</span>
            <span className="relation-tag">{trainingPhase === 'AC' ? 'Relación A → C' : 'Relación B → C'}</span>
          </div>
          <h2>{trainingPhase === 'AC' ? 'Emparejamiento Carta → Significado' : 'Emparejamiento Nombre → Significado'}</h2>
          <p className="training-subtitle">Observa el estímulo muestra y selecciona el significado equivalente</p>
        </div>

        {/* Estímulo Muestra (Sample) */}
        <div className="stimulus-display">
          <div className="stimulus-label-badge">
            <span className="stimulus-dot"></span>
            {titleInfo.stimulusLabel}
          </div>
          <div className="stimulus-frame">
            {titleInfo.stimulusType === 'image' ? (
              <img 
                src={titleInfo.stimulus} 
                alt="Carta de tarot presentada" 
                className="main-stimulus-image"
                onError={(e) => handleImageError(e, `Carta ${currentCard.id}`, '#e11d48')}
              />
            ) : (
              <div className="text-stimulus">
                <span className="text-stimulus-category">Nombre de la Carta</span>
                <span className="text-stimulus-value">{titleInfo.stimulus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Comparaciones / Opciones */}
        <div className="options-section">
          <span className="options-guide-label">Selecciona el significado correspondiente:</span>
          <div className="options-horizontal">
            {options.map((option, index) => (
              <button
                key={`opt-${option.id}-${trainingPhase}-${cardKey}-${index}`}
                className={`option-button-horizontal ${
                  selectedOption?.id === option.id
                    ? option.isCorrect
                      ? 'correct'
                      : 'incorrect'
                    : ''
                }`}
                onClick={() => handleOptionClick(option)}
                disabled={attempts >= maxAttempts}
                aria-label={`Opción de significado ${index + 1}`}
              >
                <div className="card-shine-effect"></div>
                <img 
                  src={option.imageUrl} 
                  alt={`Significado opción ${option.id}`}
                  className="option-image-horizontal"
                  onError={(e) => handleImageError(e, `Significado ${option.id}`, option.id === 1 ? '#16a34a' : option.id === 2 ? '#2563eb' : '#d97706')}
                />
                {selectedOption?.id === option.id && (
                  <div className={`option-status-overlay ${option.isCorrect ? 'correct' : 'incorrect'}`}>
                    <span>{option.isCorrect ? '✓' : '✕'}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Zona de Feedback estable sin saltos de layout */}
        <div className="feedback-container">
          {feedback ? (
            <div className={`feedback-badge ${feedback.includes('Correcto') ? 'correct' : 'incorrect'}`}>
              <span className="feedback-icon">{feedback.includes('Correcto') ? '✓' : '✕'}</span>
              <span className="feedback-text">{feedback}</span>
            </div>
          ) : attempts >= maxAttempts ? (
            <div className="feedback-badge completed">
              <span className="feedback-icon">🔒</span>
              <span className="feedback-text">Has completado los 4 intentos. Presiona el botón para avanzar.</span>
            </div>
          ) : (
            <div className="feedback-badge placeholder">
              <span className="feedback-icon">💡</span>
              <span className="feedback-text">Haz clic en una carta para evaluar tu respuesta.</span>
            </div>
          )}
        </div>

        {/* Botón de Siguiente Paso / Carta */}
        <div className="actions-footer">
          <button 
            className={`next-button ${canProceed ? 'ready' : ''}`}
            onClick={handleNext}
            disabled={!canProceed}
          >
            <span>{trainingPhase === 'AC' ? 'Siguiente Paso' : 'Siguiente Carta'}</span>
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
