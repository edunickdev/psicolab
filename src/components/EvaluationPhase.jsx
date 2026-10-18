import { useState, useMemo } from 'react';

function EvaluationPhase({ cards }) {
  const [currentTrial, setCurrentTrial] = useState(0);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, byType: {} });
  const [feedback, setFeedback] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  // Generar los trials de evaluación
  const trials = useMemo(() => generateTrials(cards), [cards]);
  const totalTrials = trials.length;

  const currentTrialData = trials[currentTrial];

  function generateTrials(cards) {
    const trials = [];
    
    cards.forEach(card => {
      // Buscar otra carta para las opciones incorrectas
      const otherCard = cards.find(c => c.id !== card.id);

      // Trial A→B: Mostrar imagen carta A, elegir nombre B correcto entre 2 opciones
      trials.push({
        type: 'A→B',
        stimulusType: 'A',
        stimulusValue: card.stimulusA,
        options: [
          { value: card.stimulusB, optionType: 'text', isCorrect: true },
          { value: otherCard.stimulusB, optionType: 'text', isCorrect: false }
        ]
      });

      // Trial B→C: Mostrar nombre B, elegir imagen significado C correcta
      trials.push({
        type: 'B→C',
        stimulusType: 'B',
        stimulusValue: card.stimulusB,
        options: [
          { value: card.stimulusC, optionType: 'image', isCorrect: true },
          { value: otherCard.stimulusC, optionType: 'image', isCorrect: false }
        ]
      });

      // Trial A→C (relación emergente): Mostrar imagen carta A, elegir imagen significado C
      trials.push({
        type: 'A→C',
        stimulusType: 'A',
        stimulusValue: card.stimulusA,
        options: [
          { value: card.stimulusC, optionType: 'image', isCorrect: true },
          { value: otherCard.stimulusC, optionType: 'image', isCorrect: false }
        ]
      });

      // Trial C→A (relación emergente): Mostrar imagen significado C, elegir imagen carta A
      trials.push({
        type: 'C→A',
        stimulusType: 'C',
        stimulusValue: card.stimulusC,
        options: [
          { value: card.stimulusA, optionType: 'image', isCorrect: true },
          { value: otherCard.stimulusA, optionType: 'image', isCorrect: false }
        ]
      });
    });

    // Mezclar los trials aleatoriamente
    return trials.sort(() => Math.random() - 0.5);
  }

  function handleOptionClick(option) {
    if (selectedOption || isComplete) return;

    setSelectedOption(option);

    if (option.isCorrect) {
      setFeedback('¡Correcto!');
      setScore(prev => ({
        ...prev,
        correct: prev.correct + 1,
        byType: {
          ...prev.byType,
          [currentTrialData.type]: (prev.byType[currentTrialData.type] || 0) + 1
        }
      }));
    } else {
      setFeedback('Incorrecto');
      setScore(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        byType: {
          ...prev.byType,
          [currentTrialData.type]: prev.byType[currentTrialData.type] || 0
        }
      }));
    }

    // Avanzar al siguiente trial después de 1.5 segundos
    setTimeout(() => {
      if (currentTrial < totalTrials - 1) {
        setCurrentTrial(currentTrial + 1);
        setFeedback('');
        setSelectedOption(null);
      } else {
        setIsComplete(true);
      }
    }, 1500);
  }

  const handleRestart = () => {
    setCurrentTrial(0);
    setScore({ correct: 0, incorrect: 0, byType: {} });
    setFeedback('');
    setSelectedOption(null);
    setIsComplete(false);
  };

  if (isComplete) {
    const total = score.correct + score.incorrect;
    const percentage = total > 0 ? Math.round((score.correct / total) * 100) : 0;

    return (
      <div className="results-phase">
        <h2>Resultados de la Evaluación</h2>
        
        <div className="results-score">
          {percentage}%
        </div>

        <div className="results-breakdown">
          <div className="result-item">
            <span className="result-label">Respuestas correctas:</span>
            <span className="result-value">{score.correct}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Respuestas incorrectas:</span>
            <span className="result-value">{score.incorrect}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Total de intentos:</span>
            <span className="result-value">{total}</span>
          </div>
        </div>

        {Object.keys(score.byType).length > 0 && (
          <>
            <h3 style={{ color: '#667eea', marginTop: '2rem' }}>Desglose por tipo de relación:</h3>
            <div className="results-breakdown">
              {Object.entries(score.byType).map(([type, count]) => (
                <div key={type} className="result-item">
                  <span className="result-label">{type}:</span>
                  <span className="result-value">{count} correctas</span>
                </div>
              ))}
            </div>
          </>
        )}

        <button className="restart-button" onClick={handleRestart}>
          Volver a Evaluar
        </button>
      </div>
    );
  }

  return (
    <div className="evaluation-phase">
      <div className="evaluation-header">
        <h2>Momento 2: Evaluación</h2>
        <p>Selecciona el estímulo equivalente</p>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentTrial + 1) / totalTrials) * 100}%` }}
          />
        </div>
        <div className="progress-text">
          Pregunta {currentTrial + 1} de {totalTrials}
        </div>
      </div>

      <div className="evaluation-question">
        <h3>Relación: {currentTrialData.type}</h3>
        <p>Selecciona el estímulo equivalente</p>
      </div>

      <div className="stimulus-display">
        {currentTrialData.stimulusType === 'B' ? (
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            padding: '2rem 3rem', 
            background: '#f5f5f5',
            borderRadius: '15px',
            color: '#333'
          }}>
            {currentTrialData.stimulusValue}
          </div>
        ) : (
          <img 
            src={currentTrialData.stimulusValue} 
            alt="Estímulo" 
            className="main-stimulus-image"
            style={{
              width: currentTrialData.stimulusType === 'C' ? '250px' : '200px',
              height: currentTrialData.stimulusType === 'C' ? '250px' : '300px',
            }}
          />
        )}
      </div>

      <div className="options-grid">
        {currentTrialData.options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              selectedOption === option 
                ? option.isCorrect 
                  ? 'correct' 
                  : 'incorrect'
                : ''
            }`}
            onClick={() => handleOptionClick(option)}
            disabled={selectedOption !== null}
          >
            {option.optionType === 'text' ? (
              <div style={{ 
                padding: '2rem', 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: '#333'
              }}>
                {option.value}
              </div>
            ) : (
              <img 
                src={option.value} 
                alt="Opción" 
                className="option-image"
              />
            )}
          </button>
        ))}
      </div>

      <div className={`feedback-message ${feedback.includes('Correcto') ? 'correct' : feedback ? 'incorrect' : ''}`}>
        {feedback}
      </div>
    </div>
  );
}

export default EvaluationPhase;
