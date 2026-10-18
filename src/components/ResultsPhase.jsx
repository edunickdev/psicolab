function ResultsPhase({ score, onRestart }) {
  const total = score.correct + score.incorrect;
  const percentage = total > 0 ? Math.round((score.correct / total) * 100) : 0;

  return (
    <div className="results-phase">
      <h2>Resultados</h2>
      
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

      <button className="restart-button" onClick={onRestart}>
        Reiniciar
      </button>
    </div>
  );
}

export default ResultsPhase;
