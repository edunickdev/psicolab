// Utilidad de efectos de sonido reales para la fase de entrenamiento
// - Aplauso real para respuestas correctas (Refuerzo positivo)
// - Chicharra real para respuestas incorrectas (Refuerzo aversivo)
import applauseMp3 from '../assets/audio/applause.mp3';
import buzzerM4a from '../assets/audio/buzzer.m4a';

// Instancias de audio pre-cargadas para reproducción inmediata sin latencia
let applauseAudio = null;
let buzzerAudio = null;

try {
  applauseAudio = new Audio(applauseMp3);
  applauseAudio.volume = 0.85;

  buzzerAudio = new Audio(buzzerM4a);
  buzzerAudio.volume = 0.85;
} catch (e) {
  console.warn('Audio HTML5 no disponible en este entorno:', e);
}

/**
 * Reproduce el sonido de Aplauso real para respuesta correcta en Entrenamiento
 */
export function playApplause() {
  try {
    if (applauseAudio) {
      applauseAudio.currentTime = 0;
      const promise = applauseAudio.play();
      if (promise !== undefined) {
        promise.catch(() => {
          const fresh = new Audio(applauseMp3);
          fresh.volume = 0.85;
          fresh.play().catch((err) => console.warn('Error fallback aplauso:', err));
        });
      }
    } else {
      const fresh = new Audio(applauseMp3);
      fresh.volume = 0.85;
      fresh.play().catch((err) => console.warn('Error fallback aplauso:', err));
    }
  } catch (e) {
    console.warn('Error al reproducir aplauso:', e);
  }
}

/**
 * Reproduce el sonido de Chicharra real para respuesta incorrecta en Entrenamiento
 */
export function playBuzzer() {
  try {
    if (buzzerAudio) {
      buzzerAudio.currentTime = 0;
      const promise = buzzerAudio.play();
      if (promise !== undefined) {
        promise.catch(() => {
          const fresh = new Audio(buzzerM4a);
          fresh.volume = 0.85;
          fresh.play().catch((err) => console.warn('Error fallback chicharra:', err));
        });
      }
    } else {
      const fresh = new Audio(buzzerM4a);
      fresh.volume = 0.85;
      fresh.play().catch((err) => console.warn('Error fallback chicharra:', err));
    }
  } catch (e) {
    console.warn('Error al reproducir chicharra:', e);
  }
}

// Alias para compatibilidad con cualquier componente que use playThunder o playStorm
export const playThunder = playBuzzer;
export const playStorm = playBuzzer;
