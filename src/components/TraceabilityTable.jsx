import { useState, useMemo } from 'react';
import './TraceabilityTable.css';

// Definición canónica de los 3 grupos y sus relaciones según las 27 pantallas
const GROUPS_SCHEMA = [
  {
    id: 1,
    name: 'Dinero',
    icon: '🪙',
    label: 'Grupo 1 (Dinero)',
    phases: [
      { key: 'trainAB', label: 'Entrenamiento A1 → B1', relation: 'A1 → B1', screen: 1, maxAttempts: 4 },
      { key: 'trainBC', label: 'Entrenamiento B1 → C1', relation: 'B1 → C1', screen: 2, maxAttempts: 4 },
      { key: 'reflAA', label: 'Reflexividad A1 → A1', relation: 'A1 → A1', screen: 3, maxAttempts: 1 },
      { key: 'reflBB', label: 'Reflexividad B1 → B1', relation: 'B1 → B1', screen: 4, maxAttempts: 1 },
      { key: 'reflCC', label: 'Reflexividad C1 → C1', relation: 'C1 → C1', screen: 5, maxAttempts: 1 },
      { key: 'symBA', label: 'Simetría B1 → A1', relation: 'B1 → A1', screen: 6, maxAttempts: 1 },
      { key: 'symCB', label: 'Simetría C1 → B1', relation: 'C1 → B1', screen: 7, maxAttempts: 1 },
      { key: 'transAC', label: 'Transitividad A1 → C1', relation: 'A1 → C1', screen: 8, maxAttempts: 1 },
      { key: 'equivCA', label: 'Equivalencia C1 → A1', relation: 'C1 → A1', screen: 9, maxAttempts: 1 },
    ]
  },
  {
    id: 2,
    name: 'Embarazo',
    icon: '🤰',
    label: 'Grupo 2 (Embarazo)',
    phases: [
      { key: 'trainAB', label: 'Entrenamiento A2 → B2', relation: 'A2 → B2', screen: 10, maxAttempts: 4 },
      { key: 'trainBC', label: 'Entrenamiento B2 → C2', relation: 'B2 → C2', screen: 11, maxAttempts: 4 },
      { key: 'reflAA', label: 'Reflexividad A2 → A2', relation: 'A2 → A2', screen: 12, maxAttempts: 1 },
      { key: 'reflBB', label: 'Reflexividad B2 → B2', relation: 'B2 → B2', screen: 13, maxAttempts: 1 },
      { key: 'reflCC', label: 'Reflexividad C2 → C2', relation: 'C2 → C2', screen: 14, maxAttempts: 1 },
      { key: 'symBA', label: 'Simetría B2 → A2', relation: 'B2 → A2', screen: 15, maxAttempts: 1 },
      { key: 'symCB', label: 'Simetría C2 → B2', relation: 'C2 → B2', screen: 16, maxAttempts: 1 },
      { key: 'transAC', label: 'Transitividad A2 → C2', relation: 'A2 → C2', screen: 17, maxAttempts: 1 },
      { key: 'equivCA', label: 'Equivalencia C2 → A2', relation: 'C2 → A2', screen: 18, maxAttempts: 1 },
    ]
  },
  {
    id: 3,
    name: 'Trabajo',
    icon: '💼',
    label: 'Grupo 3 (Trabajo)',
    phases: [
      { key: 'trainAB', label: 'Entrenamiento A3 → B3', relation: 'A3 → B3', screen: 19, maxAttempts: 4 },
      { key: 'trainBC', label: 'Entrenamiento B3 → C3', relation: 'B3 → C3', screen: 20, maxAttempts: 4 },
      { key: 'reflAA', label: 'Reflexividad A3 → A3', relation: 'A3 → A3', screen: 21, maxAttempts: 1 },
      { key: 'reflBB', label: 'Reflexividad B3 → B3', relation: 'B3 → B3', screen: 22, maxAttempts: 1 },
      { key: 'reflCC', label: 'Reflexividad C3 → C3', relation: 'C3 → C3', screen: 23, maxAttempts: 1 },
      { key: 'symBA', label: 'Simetría B3 → A3', relation: 'B3 → A3', screen: 24, maxAttempts: 1 },
      { key: 'symCB', label: 'Simetría C3 → B3', relation: 'C3 → B3', screen: 25, maxAttempts: 1 },
      { key: 'transAC', label: 'Transitividad A3 → C3', relation: 'A3 → C3', screen: 26, maxAttempts: 1 },
      { key: 'equivCA', label: 'Equivalencia C3 → A3', relation: 'C3 → A3', screen: 27, maxAttempts: 1 },
    ]
  }
];

export default function TraceabilityTable({ trialHistory = [] }) {
  const [viewMode, setViewMode] = useState('matrix'); // 'matrix' | 'table'

  // Métricas rápidas
  const stats = useMemo(() => {
    const total = trialHistory.length;
    const correct = trialHistory.filter(t => t.isCorrect).length;
    const incorrect = total - correct;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { total, correct, incorrect, accuracy };
  }, [trialHistory]);

  // Indexar historial por pantalla e intento para búsqueda instantánea O(1)
  const historyIndex = useMemo(() => {
    const map = {};
    trialHistory.forEach(item => {
      const key = `${item.screenNumber}-${item.attemptNumber}`;
      map[key] = item;
    });
    return map;
  }, [trialHistory]);

  // Exportar Bitácora a archivo CSV con UTF-8 BOM
  const handleDownloadCSV = () => {
    if (!trialHistory || trialHistory.length === 0) {
      alert('Aún no hay respuestas registradas en la bitácora.');
      return;
    }

    const headers = [
      'N°',
      'Pantalla',
      'Grupo / Clase',
      'Fase',
      'Relación',
      'Intento',
      'Resultado',
      'Respuesta Emitida',
      'Respuesta Correcta',
      'Hora'
    ];

    const rows = trialHistory.map((item, idx) => {
      const resultado = item.isCorrect ? 'CORRECTO (✓)' : 'INCORRECTO (✗)';
      const safe = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

      return [
        idx + 1,
        item.screenNumber,
        safe(item.className ? `Clase ${item.classId} (${item.className})` : `Clase ${item.classId}`),
        safe(item.property || (item.mode === 'training' ? 'Entrenamiento' : 'Evaluación')),
        safe(item.relationType),
        safe(`${item.attemptNumber}/${item.maxAttempts || 1}`),
        safe(resultado),
        safe(item.selectedLabel || ''),
        safe(item.correctLabel || ''),
        safe(item.timestamp || '')
      ].join(',');
    });

    // Prefijo \uFEFF para que Excel interprete correctamente acentos y caracteres UTF-8
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    link.setAttribute('href', url);
    link.setAttribute('download', `PsicoLab_Bitacora_Trazabilidad_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Función para imprimir reporte / exportar PDF mediante navegador
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="traceability-container">
      <div className="traceability-card">
        {/* Encabezado y Barra de Acciones */}
        <div className="trace-header">
          <div className="trace-title-group">
            <h3 className="trace-title">
              <span>📋</span> Bitácora de Trazabilidad de Respuestas
            </h3>
            <p className="trace-subtitle">
              Registro ensayo a ensayo con diagnóstico de aciertos (✓) y fallos (✗)
            </p>
          </div>

          <div className="trace-actions">
            {/* Selector de Vista: Matriz por Grupos vs Lista Cronológica */}
            <div className="trace-view-toggle">
              <button
                type="button"
                className={`trace-tab-btn ${viewMode === 'matrix' ? 'active' : ''}`}
                onClick={() => setViewMode('matrix')}
              >
                📊 Matriz por Grupos
              </button>
              <button
                type="button"
                className={`trace-tab-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                📄 Lista Detallada
              </button>
            </div>

            {/* Botón Descargar CSV */}
            <button
              type="button"
              className="trace-btn trace-btn-csv"
              onClick={handleDownloadCSV}
              title="Descargar bitácora completa en formato CSV para Excel o SPSS"
            >
              <span>📥</span>
              <span>Descargar CSV</span>
            </button>

            {/* Botón Imprimir / PDF */}
            <button
              type="button"
              className="trace-btn trace-btn-print"
              onClick={handlePrint}
              title="Imprimir o guardar reporte en PDF"
            >
              <span>🖨️</span>
              <span>PDF / Imprimir</span>
            </button>
          </div>
        </div>

        {/* Barra de KPIs rápidos */}
        <div className="trace-kpi-bar">
          <div className="trace-kpi-chip">
            <span>Total Ensayos:</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="trace-kpi-chip success">
            <span>Aciertos:</span>
            <strong>{stats.correct} (✓)</strong>
          </div>
          <div className="trace-kpi-chip error">
            <span>Fallos:</span>
            <strong>{stats.incorrect} (✗)</strong>
          </div>
          <div className="trace-kpi-chip">
            <span>Precisión:</span>
            <strong>{stats.accuracy}%</strong>
          </div>
        </div>

        {/* ================================================================= */}
        {/* VISTA 1: MATRIZ AGRUPADA POR GRUPOS (ESTRUCTURA SOLICITADA)        */}
        {/* ================================================================= */}
        {viewMode === 'matrix' && (
          <div className="groups-matrix">
            {GROUPS_SCHEMA.map((group) => {
              // Calcular aciertos dentro de este grupo
              const groupTrials = trialHistory.filter(t => t.classId === group.id);
              const groupCorrect = groupTrials.filter(t => t.isCorrect).length;
              const groupTotal = groupTrials.length;

              return (
                <div key={group.id} className="group-row-card">
                  {/* Encabezado del Grupo */}
                  <div className="group-card-header">
                    <div className="group-badge-title">
                      <span className="group-tag">Clase {group.id}</span>
                      <span className="group-class-name">{group.icon} {group.name}</span>
                    </div>
                    <div className="group-success-rate">
                      {groupTotal > 0 ? (
                        <span>
                          {groupCorrect} de {groupTotal} aciertos (
                          {Math.round((groupCorrect / groupTotal) * 100)}%)
                        </span>
                      ) : (
                        <span style={{ opacity: 0.6 }}>Sin ensayos registrados</span>
                      )}
                    </div>
                  </div>

                  {/* Fases del Grupo en columnas organizadas */}
                  <div className="group-phases-grid">
                    {/* 1. Bloque: Entrenamiento A -> B (4 intentos) */}
                    <div className="phase-block">
                      <div className="phase-block-title">
                        <span>Entrenamiento</span>
                        <span className="phase-block-relation">A{group.id} → B{group.id}</span>
                      </div>
                      <div className="cells-row">
                        {[1, 2, 3, 4].map((attNum) => {
                          const phase = group.phases.find(p => p.key === 'trainAB');
                          const item = historyIndex[`${phase.screen}-${attNum}`];
                          return (
                            <div key={attNum} className="cell-wrapper">
                              <span className="cell-sublabel">i{attNum}</span>
                              <div
                                className={`trace-cell ${
                                  !item ? 'empty' : item.isCorrect ? 'correct' : 'incorrect'
                                }`}
                                title={
                                  item
                                    ? `Pantalla ${item.screenNumber} | Intento ${attNum}: ${
                                        item.isCorrect ? '✓ Correcto' : '✗ Fallo'
                                      }\nSeleccionó: "${item.selectedLabel}"\nCorrecto: "${item.correctLabel}"`
                                    : `Intento ${attNum}: No alcanzado`
                                }
                              >
                                {!item ? '-' : item.isCorrect ? '✓' : '✗'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Bloque: Entrenamiento B -> C (4 intentos) */}
                    <div className="phase-block">
                      <div className="phase-block-title">
                        <span>Entrenamiento</span>
                        <span className="phase-block-relation">B{group.id} → C{group.id}</span>
                      </div>
                      <div className="cells-row">
                        {[1, 2, 3, 4].map((attNum) => {
                          const phase = group.phases.find(p => p.key === 'trainBC');
                          const item = historyIndex[`${phase.screen}-${attNum}`];
                          return (
                            <div key={attNum} className="cell-wrapper">
                              <span className="cell-sublabel">i{attNum}</span>
                              <div
                                className={`trace-cell ${
                                  !item ? 'empty' : item.isCorrect ? 'correct' : 'incorrect'
                                }`}
                                title={
                                  item
                                    ? `Pantalla ${item.screenNumber} | Intento ${attNum}: ${
                                        item.isCorrect ? '✓ Correcto' : '✗ Fallo'
                                      }\nSeleccionó: "${item.selectedLabel}"\nCorrecto: "${item.correctLabel}"`
                                    : `Intento ${attNum}: No alcanzado`
                                }
                              >
                                {!item ? '-' : item.isCorrect ? '✓' : '✗'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Bloque: Reflexividad (A->A, B->B, C->C) */}
                    <div className="phase-block">
                      <div className="phase-block-title">
                        <span>Reflexividad</span>
                        <span className="phase-block-relation">A, B, C</span>
                      </div>
                      <div className="cells-row">
                        {['reflAA', 'reflBB', 'reflCC'].map((key) => {
                          const phase = group.phases.find(p => p.key === key);
                          const item = historyIndex[`${phase.screen}-1`];
                          return (
                            <div key={key} className="cell-wrapper">
                              <span className="cell-sublabel">{phase.relation}</span>
                              <div
                                className={`trace-cell ${
                                  !item ? 'empty' : item.isCorrect ? 'correct' : 'incorrect'
                                }`}
                                title={
                                  item
                                    ? `Pantalla ${item.screenNumber} (${phase.relation}): ${
                                        item.isCorrect ? '✓ Correcto' : '✗ Fallo'
                                      }\nSeleccionó: "${item.selectedLabel}"\nCorrecto: "${item.correctLabel}"`
                                    : `Pantalla ${phase.screen} (${phase.relation}): Pendiente`
                                }
                              >
                                {!item ? '-' : item.isCorrect ? '✓' : '✗'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Bloque: Simetría (B->A, C->B) */}
                    <div className="phase-block">
                      <div className="phase-block-title">
                        <span>Simetría</span>
                        <span className="phase-block-relation">B→A, C→B</span>
                      </div>
                      <div className="cells-row">
                        {['symBA', 'symCB'].map((key) => {
                          const phase = group.phases.find(p => p.key === key);
                          const item = historyIndex[`${phase.screen}-1`];
                          return (
                            <div key={key} className="cell-wrapper">
                              <span className="cell-sublabel">{phase.relation}</span>
                              <div
                                className={`trace-cell ${
                                  !item ? 'empty' : item.isCorrect ? 'correct' : 'incorrect'
                                }`}
                                title={
                                  item
                                    ? `Pantalla ${item.screenNumber} (${phase.relation}): ${
                                        item.isCorrect ? '✓ Correcto' : '✗ Fallo'
                                      }\nSeleccionó: "${item.selectedLabel}"\nCorrecto: "${item.correctLabel}"`
                                    : `Pantalla ${phase.screen} (${phase.relation}): Pendiente`
                                }
                              >
                                {!item ? '-' : item.isCorrect ? '✓' : '✗'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 5. Bloque: Transitividad y Equivalencia */}
                    <div className="phase-block">
                      <div className="phase-block-title">
                        <span>Trans. / Equiv.</span>
                        <span className="phase-block-relation">A→C / C→A</span>
                      </div>
                      <div className="cells-row">
                        {['transAC', 'equivCA'].map((key) => {
                          const phase = group.phases.find(p => p.key === key);
                          const item = historyIndex[`${phase.screen}-1`];
                          return (
                            <div key={key} className="cell-wrapper">
                              <span className="cell-sublabel">{phase.relation}</span>
                              <div
                                className={`trace-cell ${
                                  !item ? 'empty' : item.isCorrect ? 'correct' : 'incorrect'
                                }`}
                                title={
                                  item
                                    ? `Pantalla ${item.screenNumber} (${phase.relation}): ${
                                        item.isCorrect ? '✓ Correcto' : '✗ Fallo'
                                      }\nSeleccionó: "${item.selectedLabel}"\nCorrecto: "${item.correctLabel}"`
                                    : `Pantalla ${phase.screen} (${phase.relation}): Pendiente`
                                }
                              >
                                {!item ? '-' : item.isCorrect ? '✓' : '✗'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================================================================= */}
        {/* VISTA 2: LISTA CRONOLÓGICA DETALLADA                             */}
        {/* ================================================================= */}
        {viewMode === 'table' && (
          <div className="trace-table-wrapper">
            <table className="trace-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Pantalla</th>
                  <th>Clase</th>
                  <th>Fase / Propiedad</th>
                  <th>Relación</th>
                  <th>Intento</th>
                  <th>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {trialHistory.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-subtitle)' }}>
                      No hay respuestas registradas aún en el experimento.
                    </td>
                  </tr>
                ) : (
                  trialHistory.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td><strong>{idx + 1}</strong></td>
                      <td>Pantalla {item.screenNumber}</td>
                      <td>Clase {item.classId} ({item.className})</td>
                      <td>{item.property || (item.mode === 'training' ? 'Entrenamiento' : 'Evaluación')}</td>
                      <td><code>{item.relationType}</code></td>
                      <td>{item.attemptNumber} de {item.maxAttempts || 1}</td>
                      <td>
                        <span
                          className={`badge-result ${item.isCorrect ? 'correct' : 'incorrect'}`}
                          title={`Respuesta emitida: ${item.selectedLabel} | Correcta: ${item.correctLabel}`}
                        >
                          {item.isCorrect ? '✓' : '✗'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
