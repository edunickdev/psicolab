// Archivo de datos generado con referencias exactas a src/assets/extracted y src/assets
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
import c8Img from '../assets/c9 infidelidad.png';
import c9Img from '../assets/c9 emfermedad.png';

// Imágenes extraídas directamente de la presentación PPTX
import img1 from '../assets/extracted/image1.png';
import img5 from '../assets/extracted/image5.png';
import img6 from '../assets/extracted/image6.png';
import img7 from '../assets/extracted/image7.png';
import img8 from '../assets/extracted/image8.png';
import img9 from '../assets/extracted/image9.png';
import img10 from '../assets/extracted/image10.png';
import img11 from '../assets/extracted/image11.png';
import img14 from '../assets/extracted/image14.png';
import img15 from '../assets/extracted/image15.png';
import img24 from '../assets/extracted/image24.png';
import img25 from '../assets/extracted/image25.png';
import img26 from '../assets/extracted/image26.png';
import img27 from '../assets/extracted/image27.png';
import img28 from '../assets/extracted/image28.png';
import img29 from '../assets/extracted/image29.png';
import img30 from '../assets/extracted/image30.png';
import img31 from '../assets/extracted/image31.png';
import img32 from '../assets/extracted/image32.png';
import img34 from '../assets/extracted/image34.png';
import img35 from '../assets/extracted/image35.png';
import img36 from '../assets/extracted/image36.png';
import img37 from '../assets/extracted/image37.png';
import img44 from '../assets/extracted/image44.png';

export const tarotCards = [
  {
    id: 1,
    name: 'Dinero',
    stimulusA: a1Img,
    labelA: 'Dinero',
    stimulusB: 'Dinero',
    stimulusC: c1Img,
    labelC: 'Dinero',
    optionsAB: [
      { id: 'b1', type: 'text', text: 'Dinero', isCorrect: true },
      { id: 'b4', type: 'text', text: 'Familia', isCorrect: false },
      { id: 'b5', type: 'text', text: 'Muerte', isCorrect: false }
    ],
    optionsBC: [
      { id: 'c4', type: 'image', imageUrl: c4Img, label: 'Familia', isCorrect: false },
      { id: 'c5', type: 'image', imageUrl: c5Img, label: 'Muerte', isCorrect: false },
      { id: 'c1', type: 'image', imageUrl: c1Img, label: 'Dinero', isCorrect: true }
    ]
  },
  {
    id: 2,
    name: 'Embarazo',
    stimulusA: a2Img,
    labelA: 'Embarazo',
    stimulusB: 'Embarazo',
    stimulusC: c2Img,
    labelC: 'Embarazo',
    optionsAB: [
      { id: 'b2', type: 'text', text: 'Embarazo', isCorrect: true },
      { id: 'b6', type: 'text', text: 'Sexo', isCorrect: false },
      { id: 'b7', type: 'text', text: 'Amor', isCorrect: false }
    ],
    optionsBC: [
      { id: 'c6', type: 'image', imageUrl: c6Img, label: 'Sexo', isCorrect: false },
      { id: 'c2', type: 'image', imageUrl: c2Img, label: 'Embarazo', isCorrect: true },
      { id: 'c7', type: 'image', imageUrl: c7Img, label: 'Amor', isCorrect: false }
    ]
  },
  {
    id: 3,
    name: 'Trabajo',
    stimulusA: a3Img,
    labelA: 'Trabajo',
    stimulusB: 'Trabajo',
    stimulusC: c3Img,
    labelC: 'Trabajo',
    optionsAB: [
      { id: 'b8', type: 'text', text: 'Infidelidad', isCorrect: false },
      { id: 'b3', type: 'text', text: 'Trabajo', isCorrect: true },
      { id: 'b9', type: 'text', text: 'Enfermedad', isCorrect: false }
    ],
    optionsBC: [
      { id: 'c3', type: 'image', imageUrl: c3Img, label: 'Trabajo', isCorrect: true },
      { id: 'c8', type: 'image', imageUrl: c8Img, label: 'Infidelidad', isCorrect: false },
      { id: 'c9', type: 'image', imageUrl: c9Img, label: 'Enfermedad', isCorrect: false }
    ]
  }
];

export const experimentSequence = [
  // =========================================================================
  // BLOQUE CLASE 1: DINERO (Pantallas 1 a 9)
  // =========================================================================
  {
    screenNumber: 1,
    classId: 1,
    className: 'Dinero',
    mode: 'training',
    property: 'Entrenamiento',
    propertyTitle: 'Entrenamiento (A1 → B1)',
    relationType: 'A1 → B1',
    maxAttempts: 4,
    hasReinforcement: true,
    sample: { type: 'image', value: a1Img, label: 'A1 Dinero (As de Bastos)' },
    stimulusLabel: 'Carta de Tarot presentada (A1):',
    optionsLabel: 'Selecciona el concepto correspondiente (B):',
    options: [
      { id: 'b1', type: 'text', text: 'Dinero', isCorrect: true },
      { id: 'b4', type: 'text', text: 'Familia', isCorrect: false },
      { id: 'b5', type: 'text', text: 'Muerte', isCorrect: false }
    ]
  },
  {
    screenNumber: 2,
    classId: 1,
    className: 'Dinero',
    mode: 'training',
    property: 'Entrenamiento',
    propertyTitle: 'Entrenamiento (B1 → C1)',
    relationType: 'B1 → C1',
    maxAttempts: 4,
    hasReinforcement: true,
    sample: { type: 'text', value: 'Dinero', label: 'B1 Dinero' },
    stimulusLabel: 'Concepto presentado (B1):',
    optionsLabel: 'Selecciona la imagen correspondiente (C):',
    options: [
      { id: 'c4', type: 'image', imageUrl: c4Img, label: 'C4 Familia', isCorrect: false },
      { id: 'c5', type: 'image', imageUrl: c5Img, label: 'C5 Muerte', isCorrect: false },
      { id: 'c1', type: 'image', imageUrl: c1Img, label: 'C1 Dinero', isCorrect: true }
    ]
  },
  {
    screenNumber: 3,
    classId: 1,
    className: 'Dinero',
    mode: 'evaluation',
    property: 'Reflexividad',
    propertyTitle: 'Reflexividad (A1 → A1)',
    relationType: 'A1 → A1',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img1, label: 'A1 Dinero' },
    stimulusLabel: 'Carta de Tarot presentada (A1):',
    optionsLabel: 'Selecciona la carta de Tarot correspondiente (A):',
    options: [
      { id: 'a1', type: 'image', imageUrl: img7, label: 'A1 Dinero', isCorrect: true },
      { id: 'a4', type: 'image', imageUrl: img5, label: 'A4 Familia', isCorrect: false },
      { id: 'a5', type: 'image', imageUrl: img6, label: 'A5 Muerte', isCorrect: false }
    ]
  },
  {
    screenNumber: 4,
    classId: 1,
    className: 'Dinero',
    mode: 'evaluation',
    property: 'Reflexividad',
    propertyTitle: 'Reflexividad (B1 → B1)',
    relationType: 'B1 → B1',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'text', value: 'Dinero', label: 'B1 Dinero' },
    stimulusLabel: 'Concepto presentado (B1):',
    optionsLabel: 'Selecciona el concepto correspondiente (B):',
    options: [
      { id: 'b1', type: 'text', text: 'Dinero', isCorrect: true },
      { id: 'b4', type: 'text', text: 'Familia', isCorrect: false },
      { id: 'b5', type: 'text', text: 'Muerte', isCorrect: false }
    ]
  },
  {
    screenNumber: 5,
    classId: 1,
    className: 'Dinero',
    mode: 'evaluation',
    property: 'Reflexividad',
    propertyTitle: 'Reflexividad (C1 → C1)',
    relationType: 'C1 → C1',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img8, label: 'C1 Dinero' },
    stimulusLabel: 'Imagen presentada (C1):',
    optionsLabel: 'Selecciona la imagen correspondiente (C):',
    options: [
      { id: 'c1', type: 'image', imageUrl: img11, label: 'C1 Dinero', isCorrect: true },
      { id: 'c4', type: 'image', imageUrl: img9, label: 'C4 Familia', isCorrect: false },
      { id: 'c5', type: 'image', imageUrl: img10, label: 'C5 Muerte', isCorrect: false }
    ]
  },
  {
    screenNumber: 6,
    classId: 1,
    className: 'Dinero',
    mode: 'evaluation',
    property: 'Simetría',
    propertyTitle: 'Simetría (B1 → A1)',
    relationType: 'B1 → A1',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'text', value: 'Dinero', label: 'B1 Dinero' },
    stimulusLabel: 'Concepto presentado (B1):',
    optionsLabel: 'Selecciona la carta de Tarot correspondiente (A):',
    options: [
      { id: 'a1', type: 'image', imageUrl: a1Img, label: 'A1 Dinero', isCorrect: true },
      { id: 'a4', type: 'image', imageUrl: img5, label: 'A4 Familia', isCorrect: false },
      { id: 'a5', type: 'image', imageUrl: img6, label: 'A5 Muerte', isCorrect: false }
    ]
  },
  {
    screenNumber: 7,
    classId: 1,
    className: 'Dinero',
    mode: 'evaluation',
    property: 'Simetría',
    propertyTitle: 'Simetría (C1 → B1)',
    relationType: 'C1 → B1',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img8, label: 'C1 Dinero' },
    stimulusLabel: 'Imagen presentada (C1):',
    optionsLabel: 'Selecciona el concepto correspondiente (B):',
    options: [
      { id: 'b1', type: 'text', text: 'Dinero', isCorrect: true },
      { id: 'b4', type: 'text', text: 'Familia', isCorrect: false },
      { id: 'b5', type: 'text', text: 'Muerte', isCorrect: false }
    ]
  },
  {
    screenNumber: 8,
    classId: 1,
    className: 'Dinero',
    mode: 'evaluation',
    property: 'Transitividad',
    propertyTitle: 'Transitividad (A1 → C1)',
    relationType: 'A1 → C1',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img1, label: 'A1 Dinero' },
    stimulusLabel: 'Carta de Tarot presentada (A1):',
    optionsLabel: 'Selecciona la imagen correspondiente (C):',
    options: [
      { id: 'c1', type: 'image', imageUrl: img8, label: 'C1 Dinero', isCorrect: true },
      { id: 'c4', type: 'image', imageUrl: img14, label: 'C4 Familia', isCorrect: false },
      { id: 'c5', type: 'image', imageUrl: img15, label: 'C5 Muerte', isCorrect: false }
    ]
  },
  {
    screenNumber: 9,
    classId: 1,
    className: 'Dinero',
    mode: 'evaluation',
    property: 'Equivalencia',
    propertyTitle: 'Equivalencia (C1 → A1)',
    relationType: 'C1 → A1',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img8, label: 'C1 Dinero' },
    stimulusLabel: 'Imagen presentada (C1):',
    optionsLabel: 'Selecciona la carta de Tarot correspondiente (A):',
    options: [
      { id: 'a1', type: 'image', imageUrl: a1Img, label: 'A1 Dinero', isCorrect: true },
      { id: 'a4', type: 'image', imageUrl: img5, label: 'A4 Familia', isCorrect: false },
      { id: 'a5', type: 'image', imageUrl: img6, label: 'A5 Muerte', isCorrect: false }
    ]
  },

  // =========================================================================
  // BLOQUE CLASE 2: EMBARAZO (Pantallas 10 a 18)
  // =========================================================================
  {
    screenNumber: 10,
    classId: 2,
    className: 'Embarazo',
    mode: 'training',
    property: 'Entrenamiento',
    propertyTitle: 'Entrenamiento (A2 → B2)',
    relationType: 'A2 → B2',
    maxAttempts: 4,
    hasReinforcement: true,
    sample: { type: 'image', value: a2Img, label: 'A2 Embarazo (La Luna)' },
    stimulusLabel: 'Carta de Tarot presentada (A2):',
    optionsLabel: 'Selecciona el concepto correspondiente (B):',
    options: [
      { id: 'b2', type: 'text', text: 'Embarazo', isCorrect: true },
      { id: 'b6', type: 'text', text: 'Sexo', isCorrect: false },
      { id: 'b7', type: 'text', text: 'Amor', isCorrect: false }
    ]
  },
  {
    screenNumber: 11,
    classId: 2,
    className: 'Embarazo',
    mode: 'training',
    property: 'Entrenamiento',
    propertyTitle: 'Entrenamiento (B2 → C2)',
    relationType: 'B2 → C2',
    maxAttempts: 4,
    hasReinforcement: true,
    sample: { type: 'text', value: 'Embarazo', label: 'B2 Embarazo' },
    stimulusLabel: 'Concepto presentado (B2):',
    optionsLabel: 'Selecciona la imagen correspondiente (C):',
    options: [
      { id: 'c6', type: 'image', imageUrl: c6Img, label: 'C6 Sexo', isCorrect: false },
      { id: 'c2', type: 'image', imageUrl: c2Img, label: 'C2 Embarazo', isCorrect: true },
      { id: 'c7', type: 'image', imageUrl: c7Img, label: 'C7 Amor', isCorrect: false }
    ]
  },
  {
    screenNumber: 12,
    classId: 2,
    className: 'Embarazo',
    mode: 'evaluation',
    property: 'Reflexividad',
    propertyTitle: 'Reflexividad (A2 → A2)',
    relationType: 'A2 → A2',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img24, label: 'A2 Embarazo' },
    stimulusLabel: 'Carta de Tarot presentada (A2):',
    optionsLabel: 'Selecciona la carta de Tarot correspondiente (A):',
    options: [
      { id: 'a6', type: 'image', imageUrl: img25, label: 'A6 Sexo', isCorrect: false },
      { id: 'a2', type: 'image', imageUrl: img27, label: 'A2 Embarazo', isCorrect: true },
      { id: 'a7', type: 'image', imageUrl: img26, label: 'A7 Amor', isCorrect: false }
    ]
  },
  {
    screenNumber: 13,
    classId: 2,
    className: 'Embarazo',
    mode: 'evaluation',
    property: 'Reflexividad',
    propertyTitle: 'Reflexividad (B2 → B2)',
    relationType: 'B2 → B2',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'text', value: 'Embarazo', label: 'B2 Embarazo' },
    stimulusLabel: 'Concepto presentado (B2):',
    optionsLabel: 'Selecciona el concepto correspondiente (B):',
    options: [
      { id: 'b6', type: 'text', text: 'Sexo', isCorrect: false },
      { id: 'b2', type: 'text', text: 'Embarazo', isCorrect: true },
      { id: 'b7', type: 'text', text: 'Amor', isCorrect: false }
    ]
  },
  {
    screenNumber: 14,
    classId: 2,
    className: 'Embarazo',
    mode: 'evaluation',
    property: 'Reflexividad',
    propertyTitle: 'Reflexividad (C2 → C2)',
    relationType: 'C2 → C2',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img32, label: 'C2 Embarazo' },
    stimulusLabel: 'Imagen presentada (C2):',
    optionsLabel: 'Selecciona la imagen correspondiente (C):',
    options: [
      { id: 'c2', type: 'image', imageUrl: img44, label: 'C2 Embarazo', isCorrect: true },
      { id: 'c6', type: 'image', imageUrl: c6Img, label: 'C6 Sexo', isCorrect: false },
      { id: 'c7', type: 'image', imageUrl: c7Img, label: 'C7 Amor', isCorrect: false }
    ]
  },
  {
    screenNumber: 15,
    classId: 2,
    className: 'Embarazo',
    mode: 'evaluation',
    property: 'Simetría',
    propertyTitle: 'Simetría (B2 → A2)',
    relationType: 'B2 → A2',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'text', value: 'Embarazo', label: 'B2 Embarazo' },
    stimulusLabel: 'Concepto presentado (B2):',
    optionsLabel: 'Selecciona la carta de Tarot correspondiente (A):',
    options: [
      { id: 'a2', type: 'image', imageUrl: a2Img, label: 'A2 Embarazo', isCorrect: true },
      { id: 'a6', type: 'image', imageUrl: img25, label: 'A6 Sexo', isCorrect: false },
      { id: 'a7', type: 'image', imageUrl: img26, label: 'A7 Amor', isCorrect: false }
    ]
  },
  {
    screenNumber: 16,
    classId: 2,
    className: 'Embarazo',
    mode: 'evaluation',
    property: 'Simetría',
    propertyTitle: 'Simetría (C2 → B2)',
    relationType: 'C2 → B2',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img32, label: 'C2 Embarazo' },
    stimulusLabel: 'Imagen presentada (C2):',
    optionsLabel: 'Selecciona el concepto correspondiente (B):',
    options: [
      { id: 'b2', type: 'text', text: 'Embarazo', isCorrect: true },
      { id: 'b6', type: 'text', text: 'Sexo', isCorrect: false },
      { id: 'b7', type: 'text', text: 'Amor', isCorrect: false }
    ]
  },
  {
    screenNumber: 17,
    classId: 2,
    className: 'Embarazo',
    mode: 'evaluation',
    property: 'Transitividad',
    propertyTitle: 'Transitividad (A2 → C2)',
    relationType: 'A2 → C2',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img24, label: 'A2 Embarazo' },
    stimulusLabel: 'Carta de Tarot presentada (A2):',
    optionsLabel: 'Selecciona la imagen correspondiente (C):',
    options: [
      { id: 'c2', type: 'image', imageUrl: img32, label: 'C2 Embarazo', isCorrect: true },
      { id: 'c6', type: 'image', imageUrl: c6Img, label: 'C6 Sexo', isCorrect: false },
      { id: 'c7', type: 'image', imageUrl: c7Img, label: 'C7 Amor', isCorrect: false }
    ]
  },
  {
    screenNumber: 18,
    classId: 2,
    className: 'Embarazo',
    mode: 'evaluation',
    property: 'Equivalencia',
    propertyTitle: 'Equivalencia (C2 → A2)',
    relationType: 'C2 → A2',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img32, label: 'C2 Embarazo' },
    stimulusLabel: 'Imagen presentada (C2):',
    optionsLabel: 'Selecciona la carta de Tarot correspondiente (A):',
    options: [
      { id: 'a2', type: 'image', imageUrl: a2Img, label: 'A2 Embarazo', isCorrect: true },
      { id: 'a6', type: 'image', imageUrl: img25, label: 'A6 Sexo', isCorrect: false },
      { id: 'a7', type: 'image', imageUrl: img26, label: 'A7 Amor', isCorrect: false }
    ]
  },

  // =========================================================================
  // BLOQUE CLASE 3: TRABAJO (Pantallas 19 a 27)
  // =========================================================================
  {
    screenNumber: 19,
    classId: 3,
    className: 'Trabajo',
    mode: 'training',
    property: 'Entrenamiento',
    propertyTitle: 'Entrenamiento (A3 → B3)',
    relationType: 'A3 → B3',
    maxAttempts: 4,
    hasReinforcement: true,
    sample: { type: 'image', value: a3Img, label: 'A3 Trabajo (Rey de Espadas)' },
    stimulusLabel: 'Carta de Tarot presentada (A3):',
    optionsLabel: 'Selecciona el concepto correspondiente (B):',
    options: [
      { id: 'b8', type: 'text', text: 'Infidelidad', isCorrect: false },
      { id: 'b3', type: 'text', text: 'Trabajo', isCorrect: true },
      { id: 'b9', type: 'text', text: 'Enfermedad', isCorrect: false }
    ]
  },
  {
    screenNumber: 20,
    classId: 3,
    className: 'Trabajo',
    mode: 'training',
    property: 'Entrenamiento',
    propertyTitle: 'Entrenamiento (B3 → C3)',
    relationType: 'B3 → C3',
    maxAttempts: 4,
    hasReinforcement: true,
    sample: { type: 'text', value: 'Trabajo', label: 'B3 Trabajo' },
    stimulusLabel: 'Concepto presentado (B3):',
    optionsLabel: 'Selecciona la imagen correspondiente (C):',
    options: [
      { id: 'c3', type: 'image', imageUrl: c3Img, label: 'C3 Trabajo', isCorrect: true },
      { id: 'c8', type: 'image', imageUrl: c8Img, label: 'C8 Infidelidad', isCorrect: false },
      { id: 'c9', type: 'image', imageUrl: c9Img, label: 'C9 Enfermedad', isCorrect: false }
    ]
  },
  {
    screenNumber: 21,
    classId: 3,
    className: 'Trabajo',
    mode: 'evaluation',
    property: 'Reflexividad',
    propertyTitle: 'Reflexividad (A3 → A3)',
    relationType: 'A3 → A3',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img28, label: 'A3 Trabajo' },
    stimulusLabel: 'Carta de Tarot presentada (A3):',
    optionsLabel: 'Selecciona la carta de Tarot correspondiente (A):',
    options: [
      { id: 'a9', type: 'image', imageUrl: img30, label: 'A9 Enfermedad', isCorrect: false },
      { id: 'a8', type: 'image', imageUrl: img29, label: 'A8 Infidelidad', isCorrect: false },
      { id: 'a3', type: 'image', imageUrl: img31, label: 'A3 Trabajo', isCorrect: true }
    ]
  },
  {
    screenNumber: 22,
    classId: 3,
    className: 'Trabajo',
    mode: 'evaluation',
    property: 'Reflexividad',
    propertyTitle: 'Reflexividad (B3 → B3)',
    relationType: 'B3 → B3',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'text', value: 'Trabajo', label: 'B3 Trabajo' },
    stimulusLabel: 'Concepto presentado (B3):',
    optionsLabel: 'Selecciona el concepto correspondiente (B):',
    options: [
      { id: 'b9', type: 'text', text: 'Infidelidad', isCorrect: false },
      { id: 'b3', type: 'text', text: 'Trabajo', isCorrect: true },
      { id: 'b8', type: 'text', text: 'Enfermedad', isCorrect: false }
    ]
  },
  {
    screenNumber: 23,
    classId: 3,
    className: 'Trabajo',
    mode: 'evaluation',
    property: 'Reflexividad',
    propertyTitle: 'Reflexividad (C3 → C3)',
    relationType: 'C3 → C3',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img34, label: 'C3 Trabajo' },
    stimulusLabel: 'Imagen presentada (C3):',
    optionsLabel: 'Selecciona la imagen correspondiente (C):',
    options: [
      { id: 'c3', type: 'image', imageUrl: img37, label: 'C3 Trabajo', isCorrect: true },
      { id: 'c8', type: 'image', imageUrl: img35, label: 'C8 Infidelidad', isCorrect: false },
      { id: 'c9', type: 'image', imageUrl: img36, label: 'C9 Enfermedad', isCorrect: false }
    ]
  },
  {
    screenNumber: 24,
    classId: 3,
    className: 'Trabajo',
    mode: 'evaluation',
    property: 'Simetría',
    propertyTitle: 'Simetría (B3 → A3)',
    relationType: 'B3 → A3',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'text', value: 'Trabajo', label: 'B3 Trabajo' },
    stimulusLabel: 'Concepto presentado (B3):',
    optionsLabel: 'Selecciona la carta de Tarot correspondiente (A):',
    options: [
      { id: 'a3', type: 'image', imageUrl: a3Img, label: 'A3 Trabajo', isCorrect: true },
      { id: 'a8', type: 'image', imageUrl: img29, label: 'A8 Infidelidad', isCorrect: false },
      { id: 'a9', type: 'image', imageUrl: img30, label: 'A9 Enfermedad', isCorrect: false }
    ]
  },
  {
    screenNumber: 25,
    classId: 3,
    className: 'Trabajo',
    mode: 'evaluation',
    property: 'Simetría',
    propertyTitle: 'Simetría (C3 → B3)',
    relationType: 'C3 → B3',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img34, label: 'C3 Trabajo' },
    stimulusLabel: 'Imagen presentada (C3):',
    optionsLabel: 'Selecciona el concepto correspondiente (B):',
    options: [
      { id: 'b3', type: 'text', text: 'Trabajo', isCorrect: true },
      { id: 'b8', type: 'text', text: 'Infidelidad', isCorrect: false },
      { id: 'b9', type: 'text', text: 'Enfermedad', isCorrect: false }
    ]
  },
  {
    screenNumber: 26,
    classId: 3,
    className: 'Trabajo',
    mode: 'evaluation',
    property: 'Transitividad',
    propertyTitle: 'Transitividad (A3 → C3)',
    relationType: 'A3 → C3',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img28, label: 'A3 Trabajo' },
    stimulusLabel: 'Carta de Tarot presentada (A3):',
    optionsLabel: 'Selecciona la imagen correspondiente (C):',
    options: [
      { id: 'c3', type: 'image', imageUrl: img34, label: 'C3 Trabajo', isCorrect: true },
      { id: 'c8', type: 'image', imageUrl: img35, label: 'C8 Infidelidad', isCorrect: false },
      { id: 'c9', type: 'image', imageUrl: img36, label: 'C9 Enfermedad', isCorrect: false }
    ]
  },
  {
    screenNumber: 27,
    classId: 3,
    className: 'Trabajo',
    mode: 'evaluation',
    property: 'Equivalencia',
    propertyTitle: 'Equivalencia (C3 → A3)',
    relationType: 'C3 → A3',
    maxAttempts: 1,
    hasReinforcement: false,
    sample: { type: 'image', value: img34, label: 'C3 Trabajo' },
    stimulusLabel: 'Imagen presentada (C3):',
    optionsLabel: 'Selecciona la carta de Tarot correspondiente (A):',
    options: [
      { id: 'a3', type: 'image', imageUrl: img28, label: 'A3 Trabajo', isCorrect: true },
      { id: 'a8', type: 'image', imageUrl: img29, label: 'A8 Infidelidad', isCorrect: false },
      { id: 'a9', type: 'image', imageUrl: img30, label: 'A9 Enfermedad', isCorrect: false }
    ]
  }
];

export const evaluationTrials = experimentSequence.filter(s => s.mode === 'evaluation');
