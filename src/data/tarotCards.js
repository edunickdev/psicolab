// Importación de imágenes reales desde src/assets
import a1Img from '../assets/a1.jpeg';
import a2Img from '../assets/a2 embarazo.png';
import a3Img from '../assets/a3 trabajo.png';

import c1Img from '../assets/c1 dinero.png';
import c2Img from '../assets/c2 embarazo.png';
import c3Img from '../assets/c3 trabajo.png';
import c4Img from '../assets/c4 familia.png';
import c5Img from '../assets/c5 muerte.png';
import c6Img from '../assets/c6 sexo.png';
import c7Img from '../assets/c7 amor.png';
import c8Img from '../assets/c9 infidelidad.png'; // C8 Infidelidad
import c9Img from '../assets/c9 emfermedad.png';  // C9 Enfermedad

export const tarotCards = [
  {
    id: 1,
    name: 'Dinero',
    // Estímulo A: Imagen Carta Tarot (Basto)
    stimulusA: a1Img,
    labelA: 'Dinero',
    // Estímulo B: Texto
    stimulusB: 'Dinero',
    // Estímulo C: Imagen Significado
    stimulusC: c1Img,
    labelC: 'Dinero',

    // Opciones para Fase A -> B (3 tarjetas con texto)
    optionsAB: [
      { id: 'b1', type: 'text', text: 'Dinero', isCorrect: true },
      { id: 'b4', type: 'text', text: 'Familia', isCorrect: false },
      { id: 'b5', type: 'text', text: 'Muerte', isCorrect: false }
    ],

    // Opciones para Fase B -> C (3 tarjetas con imagen)
    optionsBC: [
      { id: 'c1', type: 'image', imageUrl: c1Img, label: 'Dinero', isCorrect: true },
      { id: 'c4', type: 'image', imageUrl: c4Img, label: 'Familia', isCorrect: false },
      { id: 'c5', type: 'image', imageUrl: c5Img, label: 'Muerte', isCorrect: false }
    ]
  },
  {
    id: 2,
    name: 'Embarazo',
    // Estímulo A: Imagen Carta Tarot (La Luna)
    stimulusA: a2Img,
    labelA: 'Embarazo',
    // Estímulo B: Texto
    stimulusB: 'Embarazo',
    // Estímulo C: Imagen Significado
    stimulusC: c2Img,
    labelC: 'Embarazo',

    // Opciones para Fase A -> B (3 tarjetas con texto)
    optionsAB: [
      { id: 'b2', type: 'text', text: 'Embarazo', isCorrect: true },
      { id: 'b6', type: 'text', text: 'Sexo', isCorrect: false },
      { id: 'b7', type: 'text', text: 'Amor', isCorrect: false }
    ],

    // Opciones para Fase B -> C (3 tarjetas con imagen)
    optionsBC: [
      { id: 'c2', type: 'image', imageUrl: c2Img, label: 'Embarazo', isCorrect: true },
      { id: 'c6', type: 'image', imageUrl: c6Img, label: 'Sexo', isCorrect: false },
      { id: 'c7', type: 'image', imageUrl: c7Img, label: 'Amor', isCorrect: false }
    ]
  },
  {
    id: 3,
    name: 'Trabajo',
    // Estímulo A: Imagen Carta Tarot (Rey de Espadas)
    stimulusA: a3Img,
    labelA: 'Trabajo',
    // Estímulo B: Texto
    stimulusB: 'Trabajo',
    // Estímulo C: Imagen Significado
    stimulusC: c3Img,
    labelC: 'Trabajo',

    // Opciones para Fase A -> B (3 tarjetas con texto)
    optionsAB: [
      { id: 'b3', type: 'text', text: 'Trabajo', isCorrect: true },
      { id: 'b8', type: 'text', text: 'Infidelidad', isCorrect: false },
      { id: 'b9', type: 'text', text: 'Enfermedad', isCorrect: false }
    ],

    // Opciones para Fase B -> C (3 tarjetas con imagen)
    optionsBC: [
      { id: 'c3', type: 'image', imageUrl: c3Img, label: 'Trabajo', isCorrect: true },
      { id: 'c8', type: 'image', imageUrl: c8Img, label: 'Infidelidad', isCorrect: false },
      { id: 'c9', type: 'image', imageUrl: c9Img, label: 'Enfermedad', isCorrect: false }
    ]
  }
];
