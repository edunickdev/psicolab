import './CardAtmosphere.css';

/**
 * CardAtmosphere: Overlay visual contingente sobre la tarjeta principal (.experiment-card).
 *
 * Arquitectura:
 * 1. Paisaje Neutro (Base permanente): Suave, despejado, colinas verdes serenas y cielo diurno.
 * 2. Refuerzo de Error (Stranger Things): Tormenta de rayos rojos ramificados, flash estroboscópico,
 *    esporas carmesí y viñeta amenazante mientras se barajan las cartas.
 * 3. Refuerzo de Acierto (Celebración): Bandada de pájaros que surcan la pantalla en formación,
 *    resplandor solar dorado y destellos cálidos.
 */

const CLOUD_PATH =
  'M40 80 C 15 80, 10 55, 32 50 C 30 30, 58 22, 72 36 C 82 14, 120 12, 130 38 C 150 28, 178 40, 172 60 C 192 62, 192 80, 172 80 Z';

// Datos de la bandada de pájaros (trayectorias fluidas de izquierda a derecha)
const FLOCK_BIRDS = [
  { id: 1, startX: -80, startY: 140, endX: 980, endY: 20, scale: 0.9, delay: 0.05, dur: '2.4s', width: 42 },
  { id: 2, startX: -130, startY: 110, endX: 950, endY: 45, scale: 0.75, delay: 0.2, dur: '2.5s', width: 36 },
  { id: 3, startX: -60, startY: 170, endX: 1000, endY: 15, scale: 1.05, delay: 0.0, dur: '2.3s', width: 46 },
  { id: 4, startX: -160, startY: 150, endX: 940, endY: 55, scale: 0.7, delay: 0.35, dur: '2.6s', width: 34 },
  { id: 5, startX: -100, startY: 90, endX: 990, endY: 30, scale: 0.85, delay: 0.15, dur: '2.4s', width: 40 },
  { id: 6, startX: -40, startY: 195, endX: 960, endY: 70, scale: 0.8, delay: 0.25, dur: '2.3s', width: 38 },
  { id: 7, startX: -180, startY: 125, endX: 920, endY: 40, scale: 0.65, delay: 0.4, dur: '2.7s', width: 32 },
];

// Esporas / Cenizas flotantes de Stranger Things
const RED_EMBERS = [
  { top: '65%', left: '15%', driftX: -25, delay: 0.1 },
  { top: '75%', left: '28%', driftX: 30, delay: 0.3 },
  { top: '60%', left: '42%', driftX: -18, delay: 0.05 },
  { top: '80%', left: '55%', driftX: 35, delay: 0.2 },
  { top: '70%', left: '72%', driftX: -30, delay: 0.15 },
  { top: '85%', left: '84%', driftX: 20, delay: 0.35 },
  { top: '50%', left: '20%', driftX: 25, delay: 0.25 },
  { top: '55%', left: '65%', driftX: -20, delay: 0.1 },
  { top: '68%', left: '90%', driftX: 15, delay: 0.4 },
  { top: '62%', left: '8%', driftX: -15, delay: 0.3 },
];

// Destellos dorados en acierto
const GOLDEN_SPARKLES = [
  { top: '50%', left: '22%', driftX: 20, delay: 0.1 },
  { top: '60%', left: '35%', driftX: -15, delay: 0.25 },
  { top: '45%', left: '50%', driftX: 25, delay: 0.05 },
  { top: '55%', left: '68%', driftX: -20, delay: 0.3 },
  { top: '65%', left: '82%', driftX: 18, delay: 0.15 },
  { top: '40%', left: '15%', driftX: -25, delay: 0.2 },
  { top: '70%', left: '45%', driftX: 30, delay: 0.35 },
];

/**
 * Pájaro individual en pleno vuelo con aleteo
 */
function FlockBird({ bird }) {
  return (
    <div
      className="ca-flock-bird"
      style={{
        '--start-x': `${bird.startX}px`,
        '--start-y': `${bird.startY}px`,
        '--end-x': `${bird.endX}px`,
        '--end-y': `${bird.endY}px`,
        '--bird-scale': bird.scale,
        animationDelay: `${bird.delay}s`,
        animationDuration: bird.dur,
        width: `${bird.width}px`,
      }}
    >
      <svg viewBox="0 0 46 22" className="ca-bird-body">
        <g className="ca-bird-wing-beat">
          {/* Cuerpo y alas arqueadas en pleno vuelo */}
          <path
            d="M 2 16 Q 12 0, 23 12 Q 34 0, 44 16 Q 33 6, 23 14 Q 13 6, 2 16 Z"
            fill="#0284c7"
            stroke="#0369a1"
            strokeWidth="1.2"
          />
          <circle cx="23" cy="13" r="1.8" fill="#38bdf8" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Rayos Rojos estilo Stranger Things (Upside Down)
 */
function StrangerThingsLightning() {
  return (
    <svg viewBox="0 0 1000 320" className="st-lightning-svg" preserveAspectRatio="none">
      <defs>
        <filter id="stRedGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ff0033" floodOpacity="0.95" />
          <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#dc2626" floodOpacity="0.85" />
          <feDropShadow dx="0" dy="0" stdDeviation="28" floodColor="#991b1b" floodOpacity="0.65" />
        </filter>
      </defs>

      {/* RAYO IZQUIERDO PRINCIPAL */}
      <g className="st-bolt-main">
        <path
          d="M 180 -10 L 210 48 L 195 62 L 240 120 L 225 135 L 280 200 L 265 212 L 310 270"
          stroke="#ff0033"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="st-bolt-glow"
        />
        <path
          d="M 180 -10 L 210 48 L 195 62 L 240 120 L 225 135 L 280 200 L 265 212 L 310 270"
          stroke="#fff1f2"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      <g className="st-bolt-branch">
        <path
          d="M 210 48 L 260 75 L 250 92 L 295 125"
          stroke="#ff2244"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="st-bolt-glow"
        />
        <path
          d="M 210 48 L 260 75 L 250 92 L 295 125"
          stroke="#ffe4e6"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 240 120 L 200 155 L 190 170 L 170 195"
          stroke="#dc2626"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="st-bolt-glow"
        />
        <path
          d="M 240 120 L 200 155 L 190 170 L 170 195"
          stroke="#fecdd3"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* RAYO DERECHO PRINCIPAL */}
      <g className="st-bolt-main">
        <path
          d="M 780 -10 L 740 55 L 758 70 L 700 130 L 720 145 L 660 215 L 680 230 L 630 290"
          stroke="#ff0033"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="st-bolt-glow"
        />
        <path
          d="M 780 -10 L 740 55 L 758 70 L 700 130 L 720 145 L 660 215 L 680 230 L 630 290"
          stroke="#fff1f2"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      <g className="st-bolt-branch">
        <path
          d="M 740 55 L 695 85 L 680 110"
          stroke="#ff2244"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="st-bolt-glow"
        />
        <path
          d="M 740 55 L 695 85 L 680 110"
          stroke="#ffe4e6"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 700 130 L 750 160 L 770 190"
          stroke="#dc2626"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="st-bolt-glow"
        />
        <path
          d="M 700 130 L 750 160 L 770 190"
          stroke="#fecdd3"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* RAYO CENTRAL TIPO RED DE ARAÑA */}
      <g className="st-bolt-main">
        <path
          d="M 480 -10 L 460 42 L 515 85 L 475 128 L 530 170"
          stroke="#ff0033"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="st-bolt-glow"
        />
        <path
          d="M 480 -10 L 460 42 L 515 85 L 475 128 L 530 170"
          stroke="#fff1f2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      <g className="st-bolt-branch">
        <path
          d="M 460 42 L 400 62 L 365 92"
          stroke="#ff2244"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="st-bolt-glow"
        />
        <path
          d="M 460 42 L 400 62 L 365 92"
          stroke="#ffe4e6"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 515 85 L 575 102 L 610 135"
          stroke="#ff2244"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="st-bolt-glow"
        />
        <path
          d="M 515 85 L 575 102 L 610 135"
          stroke="#ffe4e6"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

/**
 * Paisaje Neutro Base (Colinas verdes, árboles pacíficos y sol suave)
 */
function NeutralBaseLandscape() {
  return (
    <div className="ca-neutral-base" aria-hidden="true">
      {/* Franja Alta: Cielo Neutro */}
      <div className="ca-neutral-sky">
        <div className="ca-neutral-sun" />
        <div className="ca-neutral-cloud ca-cloud-1">
          <svg viewBox="0 0 200 100"><path d={CLOUD_PATH} fill="#ffffff" /></svg>
        </div>
        <div className="ca-neutral-cloud ca-cloud-2">
          <svg viewBox="0 0 200 100"><path d={CLOUD_PATH} fill="#ffffff" /></svg>
        </div>
        <div className="ca-neutral-cloud ca-cloud-3">
          <svg viewBox="0 0 200 100"><path d={CLOUD_PATH} fill="#ffffff" /></svg>
        </div>
      </div>

      {/* Franja Baja: Suelo Neutro */}
      <div className="ca-neutral-ground">
        <svg viewBox="0 0 1000 140" preserveAspectRatio="xMidYMax slice" className="ca-ground-svg">
          <defs>
            <linearGradient id="neuHillBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>
            <linearGradient id="neuHillFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>

          {/* Colina trasera */}
          <path d="M0 75 C 160 50, 320 60, 480 72 C 640 85, 800 50, 1000 65 L1000 140 L0 140 Z" fill="url(#neuHillBack)" />

          {/* Árboles en colina trasera */}
          <g transform="translate(130 92) scale(0.65)">
            <rect x="-4" y="-24" width="8" height="26" rx="2" fill="#78350f" />
            <circle cx="0" cy="-38" r="20" fill="#10b981" />
            <circle cx="-12" cy="-30" r="14" fill="#059669" />
            <circle cx="12" cy="-32" r="14" fill="#34d399" />
          </g>
          <g transform="translate(860 88) scale(0.68)">
            <rect x="-4" y="-24" width="8" height="26" rx="2" fill="#78350f" />
            <circle cx="0" cy="-38" r="20" fill="#10b981" />
            <circle cx="-12" cy="-30" r="14" fill="#059669" />
            <circle cx="12" cy="-32" r="14" fill="#34d399" />
          </g>

          {/* Colina delantera */}
          <path d="M0 102 C 220 85, 420 95, 620 102 C 820 110, 920 90, 1000 98 L1000 140 L0 140 Z" fill="url(#neuHillFront)" />

          {/* Árboles en primer plano (laterales para dejar libre el centro) */}
          <g transform="translate(80 126) scale(0.85)">
            <rect x="-5" y="-30" width="10" height="32" rx="3" fill="#6b4423" />
            <circle cx="0" cy="-48" r="25" fill="#10b981" />
            <circle cx="-16" cy="-36" r="18" fill="#059669" />
            <circle cx="15" cy="-38" r="18" fill="#34d399" />
          </g>
          <g transform="translate(915 124) scale(0.9)">
            <rect x="-5" y="-30" width="10" height="32" rx="3" fill="#6b4423" />
            <circle cx="0" cy="-48" r="25" fill="#10b981" />
            <circle cx="-16" cy="-36" r="18" fill="#059669" />
            <circle cx="15" cy="-38" r="18" fill="#34d399" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function CardAtmosphere({ activeEffect = null, effectKey = 0 }) {
  return (
    <div className="card-atmosphere-overlay" aria-hidden="true">
      {/* 1. PAISAJE NEUTRO SIEMPRE PRESENTE */}
      <NeutralBaseLandscape />

      {/* 2. REFUERZO DE ERROR: TORMENTA DE RAYOS ROJOS (STRANGER THINGS) */}
      {activeEffect === 'incorrect' && (
        <div key={`st-storm-${effectKey}`} className="st-storm-overlay">
          <div className="st-sky-tint" />
          <div className="st-screen-flash" />
          <StrangerThingsLightning />
          {RED_EMBERS.map((e, i) => (
            <div
              key={`ember-${i}`}
              className="st-ember"
              style={{
                top: e.top,
                left: e.left,
                '--drift-x': `${e.driftX}px`,
                animationDelay: `${e.delay}s`,
              }}
            />
          ))}
          <div className="st-vignette" />
        </div>
      )}

      {/* 3. REFUERZO DE ACIERTO: BANDADA DE PÁJAROS & RESPLANDOR DORADO */}
      {activeEffect === 'correct' && (
        <div key={`birds-celeb-${effectKey}`} className="birds-celebration-overlay">
          <div className="birds-sky-tint" />
          <div className="birds-sunburst">
            <div className="birds-sunburst-rays" />
            <div className="birds-sunburst-core" />
          </div>
          {FLOCK_BIRDS.map((b) => (
            <FlockBird key={`flock-bird-${b.id}`} bird={b} />
          ))}
          {GOLDEN_SPARKLES.map((s, i) => (
            <div
              key={`sparkle-${i}`}
              className="ca-sparkle"
              style={{
                top: s.top,
                left: s.left,
                '--drift-x': `${s.driftX}px`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
          <div className="birds-vignette" />
        </div>
      )}
    </div>
  );
}

export default CardAtmosphere;
