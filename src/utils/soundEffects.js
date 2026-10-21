// Utilidad de efectos de sonido reales para la fase de entrenamiento
// - Aplauso real para respuestas correctas (Refuerzo positivo) (~4.4s)
// - Chicharra real para respuestas incorrectas (Refuerzo aversivo) (~1.2s)
import applauseMp3 from '../assets/audio/applause.mp3';
import buzzerM4a from '../assets/audio/buzzer.m4a';

let currentAudio = null;

function stopCurrentAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
  }
}

/**
 * Reproduce un archivo de audio y devuelve una Promise que resuelve cuando
 * el audio finaliza completamente o cuando se alcanza un timeout de seguridad.
 */
function playSoundWithPromise(src, maxDurationMs = 5000) {
  return new Promise((resolve) => {
    try {
      stopCurrentAudio();

      const audio = new Audio(src);
      audio.volume = 0.85;
      currentAudio = audio;

      let hasResolved = false;
      const safeResolve = () => {
        if (!hasResolved) {
          hasResolved = true;
          if (currentAudio === audio) {
            currentAudio = null;
          }
          resolve();
        }
      };

      audio.addEventListener('ended', safeResolve, { once: true });
      audio.addEventListener('error', safeResolve, { once: true });

      // Timeout de seguridad en caso de que el navegador bloquee o no emita 'ended'
      const timer = setTimeout(() => {
        safeResolve();
      }, maxDurationMs);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          clearTimeout(timer);
          safeResolve();
        });
      }
    } catch (e) {
      console.warn('Error al reproducir audio:', e);
      resolve();
    }
  });
}

/**
 * Reproduce el sonido de Aplauso real para respuesta correcta en Entrenamiento.
 * Duración real: ~4.44s. Resuelve al terminar el audio.
 */
export function playApplause() {
  return playSoundWithPromise(applauseMp3, 4600);
}

/**
 * Reproduce el sonido de Chicharra real para respuesta incorrecta en Entrenamiento.
 * Duración real: ~1.24s. Resuelve al terminar el audio.
 */
export function playBuzzer() {
  return playSoundWithPromise(buzzerM4a, 1500);
}

// Alias para compatibilidad
export const playThunder = playBuzzer;
export const playStorm = playBuzzer;
