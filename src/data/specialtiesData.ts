import { MedicalSpecialty, SpecialtyMeta, PatientSpecialtiesData } from '../types';

export const SPECIALTIES_LIST: SpecialtyMeta[] = [
  {
    id: 'odontologia',
    name: 'Odontología Integral',
    icon: '🦷',
    badgeColor: '#0d9488',
    bgLight: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
    description: 'Odontograma FDI interactivo, operatoria, prótesis, endodoncia y cirugía.',
    defaultRoom: 1,
    defaultDoctor: 'Dra. Amalia Merlo'
  },
  {
    id: 'oftalmologia',
    name: 'Oftalmología',
    icon: '👁️',
    badgeColor: '#0284c7',
    bgLight: 'bg-sky-50',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-200',
    description: 'Cartilla Snellen interactiva, agudeza visual, refracción esférica/cilíndrica y PIO.',
    defaultRoom: 2,
    defaultDoctor: 'Dr. Lucas Varela'
  },
  {
    id: 'cardiologia',
    name: 'Cardiología',
    icon: '❤️',
    badgeColor: '#e11d48',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    description: 'Control de PA/FC, ritmo ECG trazado sinusal/arritmias y riesgo cardiovascular Framingham.',
    defaultRoom: 3,
    defaultDoctor: 'Dra. Mariana Benítez'
  },
  {
    id: 'pediatria',
    name: 'Pediatría',
    icon: '👶',
    badgeColor: '#8b5cf6',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    description: 'Curvas y percentiles de crecimiento OMS, perímetro cefálico y calendario vacunal.',
    defaultRoom: 4,
    defaultDoctor: 'Dr. Diego Morales'
  },
  {
    id: 'traumatologia',
    name: 'Traumatología & Ortopedia',
    icon: '🦴',
    badgeColor: '#f97316',
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    description: 'Mapa anatómico articular humano, escala EVA de dolor, goniometría e inmovilización.',
    defaultRoom: 5,
    defaultDoctor: 'Dr. Esteban Carrizo'
  },
  {
    id: 'dermatologia',
    name: 'Dermatología',
    icon: '🔬',
    badgeColor: '#d97706',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    description: 'Mapeo de lesiones cutáneas, regla ABCDE de melanoma y fototipo Fitzpatrick I-VI.',
    defaultRoom: 6,
    defaultDoctor: 'Dra. Sofía Roldán'
  },
  {
    id: 'ginecologia',
    name: 'Ginecología & Obstetricia',
    icon: '🌸',
    badgeColor: '#ec4899',
    bgLight: 'bg-pink-50',
    textColor: 'text-pink-700',
    borderColor: 'border-pink-200',
    description: 'Calculadora gestacional FUM, FPP y semanas de gestación, control PAP/Colpo y mamografías.',
    defaultRoom: 7,
    defaultDoctor: 'Dra. Patricia Gómez'
  },
  {
    id: 'clinica_medica',
    name: 'Clínica Médica / Medicina Interna',
    icon: '🩺',
    badgeColor: '#0d9488',
    bgLight: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
    description: 'Signos vitales completos (TA, FC, FR, Temp, SatO2, HGT) y anamnesis sistémica por aparatos.',
    defaultRoom: 8,
    defaultDoctor: 'Dr. Guillermo Navarro'
  },
  {
    id: 'nutricion',
    name: 'Nutrición & Dietética',
    icon: '🥗',
    badgeColor: '#10b981',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    description: 'Calculadora automática de IMC, % masa grasa, requerimiento calórico TMB y plan de comidas.',
    defaultRoom: 9,
    defaultDoctor: 'Lic. Camila Méndez'
  },
  {
    id: 'kinesiologia',
    name: 'Kinesiología & Fisioterapia',
    icon: '🏃',
    badgeColor: '#06b6d4',
    bgLight: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-200',
    description: 'Plan y conteo de sesiones de rehabilitación, escala de dolor EVA y agentes fisioterapéuticos.',
    defaultRoom: 10,
    defaultDoctor: 'Lic. Lautaro Silva'
  },
  {
    id: 'otorrinolaringologia',
    name: 'Otorrinolaringología (ORL)',
    icon: '👂',
    badgeColor: '#6366f1',
    bgLight: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    description: 'Audiograma tonal por frecuencias 250-8000Hz (Oído Der/Izq), otoscopía y rinoscopía.',
    defaultRoom: 2,
    defaultDoctor: 'Dr. Marcelo Font'
  },
  {
    id: 'neumonologia',
    name: 'Neumonología',
    icon: '🫁',
    badgeColor: '#0ea5e9',
    bgLight: 'bg-sky-50',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-200',
    description: 'Espirometría computada FVC/FEV1 con interpretación de patrón, oximetría y tabaquismo.',
    defaultRoom: 3,
    defaultDoctor: 'Dr. Andrés Casares'
  },
  {
    id: 'neurologia',
    name: 'Neurología',
    icon: '🧠',
    badgeColor: '#8b5cf6',
    bgLight: 'bg-violet-50',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-200',
    description: 'Escala de Glasgow 3-15 interactiva, pares craneales, reflejos osteotendinosos y marcha.',
    defaultRoom: 5,
    defaultDoctor: 'Dra. Gabriela Suárez'
  },
  {
    id: 'psicologia',
    name: 'Psicología & Salud Mental',
    icon: '💬',
    badgeColor: '#14b8a6',
    bgLight: 'bg-teal-50',
    textColor: 'text-teal-800',
    borderColor: 'border-teal-200',
    description: 'Encuadre psicoterapéutico, notas de sesión confidenciales, escalas GAD-7/PHQ-9 y metas.',
    defaultRoom: 8,
    defaultDoctor: 'Lic. Martina Paz'
  },
  {
    id: 'urologia',
    name: 'Urología',
    icon: '💧',
    badgeColor: '#2563eb',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    description: 'Calculador IPSS de síntomas prostáticos (0-35), seguimiento de PSA Total/Libre y ecografía.',
    defaultRoom: 7,
    defaultDoctor: 'Dr. Roberto Blanco'
  }
];

// Datos clínicos mockeados iniciales para los pacientes del policonsultorio
export const DEFAULT_PATIENT_SPECIALTIES: Record<string, PatientSpecialtiesData> = {
  'p-1': {
    oftalmologia: {
      visualAcuityRight: '20/25',
      visualAcuityLeft: '20/30',
      sphereRight: -0.75,
      sphereLeft: -1.00,
      cylinderRight: -0.50,
      cylinderLeft: -0.25,
      axisRight: 90,
      axisLeft: 85,
      intraocularPressureRight: 15,
      intraocularPressureLeft: 16,
      fundoscopy: 'Papila de bordes netos, excavación 0.3 fisiológica. Retina aplicada, sin microaneurismas.',
      biomicroscopy: 'Córnea transparente, cámara anterior profunda, cristalino claro.',
      notes: 'Control anual de refracción. Se receta corrección aérea para trabajo de oficina.',
      lastUpdated: '2026-08-15'
    },
    cardiologia: {
      systolicBP: 135,
      diastolicBP: 85,
      heartRate: 74,
      ecgRhythm: 'sinusal_normal',
      cardiovascularRisk: 'moderado',
      peripheralPulses: 'Presentes simétricos 2/4 en ambos miembros inferiores.',
      edema: false,
      notes: 'Hipertensión arterial estadio 1 en control con Enalapril 10mg/día. ECG sin signos de isquemia aguda.',
      lastUpdated: '2026-08-22'
    },
    clinica_medica: {
      systolicBP: 132,
      diastolicBP: 84,
      heartRate: 72,
      respiratoryRate: 16,
      temperatureC: 36.6,
      spo2Percent: 98,
      bloodGlucoseMgDl: 96,
      systemicReview: {
        cardiovascular: 'R1 y R2 normofonéticos en 4 focos. Silencios libres.',
        respiratory: 'Murmullo vesicular conservado bilateralmente, sin ruidos agregados.',
        gastrointestinal: 'Abdomen blando, depresible, indoloro. RHA presentes.',
        neurological: 'Vigil, orientado en tiempo y espacio. Sin foco neurológico.',
        osteomuscular: 'Movilidad articular conservada, sin signos inflamatorios.'
      },
      currentSyndromes: 'Hipertensión arterial esencial controlada.',
      labSummary: 'Hemograma normal, Glucemia 96 mg/dL, Colesterol Total 190 mg/dL, Creatinina 0.9 mg/dL.',
      notes: 'Chequeo clínico semestral. Buen estado general.',
      lastUpdated: '2026-08-22'
    },
    traumatologia: {
      affectedJoint: 'rodilla',
      side: 'derecho',
      painScaleEVA: 4,
      mobilityRangeROM: 'Flexión 120° (ligero dolor en últimos grados), extensión completa 0°.',
      immobilization: 'vendaje',
      injuryType: 'tendinitis',
      surgeryHistory: 'Sin cirugías previas.',
      notes: 'Tendinitis rotuliana post esfuerzo deportivo. Se indica reposo relativo y derivación a kinesiología.',
      lastUpdated: '2026-08-10'
    },
    nutricion: {
      weightKg: 82,
      heightCm: 178,
      bmi: 25.9,
      bmiCategory: 'sobrepeso',
      bodyFatPercent: 23.5,
      muscleMassKg: 34.2,
      waistCircumferenceCm: 92,
      basalMetabolicRateKcal: 1760,
      caloricTargetKcal: 2000,
      dietaryPlanSummary: 'Plan hiposódico mediterráneo, aumento de fibra soluble y vegetales, restricción de ultraprocesados.',
      hydrationLitersDaily: 2.5,
      allergiesIntolerances: 'Ninguna conocida.',
      notes: 'Meta: descenso progresivo de 4 kg en 3 meses.',
      lastUpdated: '2026-08-05'
    },
    kinesiologia: {
      affectedZone: 'Rodilla derecha - Tendón rotuliano',
      painScaleEVA: 3,
      treatmentGoals: 'Disminuir dolor, desinflamar el tendón rotuliano y fortalecer cuádriceps excéntrico.',
      sessionCountCompleted: 4,
      sessionCountTotal: 10,
      modalities: {
        magneto: true,
        ultrasound: true,
        tens: true,
        cryotherapy: true,
        thermotherapy: false,
        activeKinesio: true,
        manualTherapy: true
      },
      functionalEvolutionNotes: 'Buena respuesta tras sesión 4. Refiere menor dolor al bajar escaleras.',
      lastUpdated: '2026-08-25'
    }
  },
  'p-2': {
    ginecologia: {
      fumDate: '2026-05-10',
      gestationalWeeks: 16,
      gestationalDays: 2,
      estimatedDueDate: '2027-02-14',
      gravidity: 2,
      parity: 1,
      abortions: 0,
      papDate: '2026-02-10',
      papResult: 'PAP Negativo para lesión intraepitelial o malignidad (Bethesda).',
      colposcopyNotes: 'Zona de transformación visible tipo 1, epitelio escamoso original sin atipias.',
      mammographyDate: '2025-10-15',
      mammographyBirads: '1',
      notes: 'Control de segundo trimestre de embarazo. FCF presente y rítmica 148 lpm.',
      lastUpdated: '2026-08-28'
    },
    dermatologia: {
      fitzpatrickPhototype: 'II',
      lesionLocation: 'Región dorsal interescapular',
      lesionType: 'nevus',
      abcdeAsymmetry: false,
      abcdeBorderIrregular: false,
      abcdeColorVariegated: false,
      abcdeDiameterOver6mm: false,
      abcdeEvolutionRapid: false,
      dermoscopyFindings: 'Patrón reticular homogéneo benigno. Red de pigmento regular.',
      biopsyIndicated: false,
      notes: 'Nevus melanocítico benigno sin signos de alarma. Control fotográfico en 12 meses.',
      lastUpdated: '2026-07-18'
    }
  },
  'p-3': {
    neurologia: {
      glasgowEyeOpening: 4,
      glasgowVerbal: 5,
      glasgowMotor: 6,
      glasgowTotal: 15,
      cranialNervesIntact: true,
      cranialNervesNotes: 'Pares craneales del I al XII evaluados sin déficit focal.',
      motorStrengthMRC: '5',
      deepTendonReflexes: 'normales',
      sensoryExam: 'Sensibilidad táctil y termoalgésica conservada simétrica.',
      gaitAndBalance: 'Marcha en tándem y Romberg negativos.',
      notes: 'Consulta por cefalea tensional recurrente asociada a bruxismo y estrés laboral.',
      lastUpdated: '2026-08-14'
    },
    psicologia: {
      consultationReason: 'Nivel elevado de estrés laboral, dificultades para conciliar el sueño y bruxismo nocturno.',
      therapeuticApproach: 'cognitivo_conductual',
      currentEmotionalState: 'Ansioso, colaborador, buena introspección.',
      anxietyScoreGAD7: 11,
      depressionScorePHQ9: 5,
      confidentialSessionNotes: 'Se trabaja sobre reestructuración cognitiva de pensamientos automáticos ante plazos laborales y técnicas de relajación progresiva de Jacobson previa al sueño.',
      therapeuticGoals: ['Higiene del sueño', 'Reducción de somatización', 'Manejo asertivo de límites laborales'],
      sessionFrequency: 'semanal',
      lastUpdated: '2026-08-20'
    },
    urologia: {
      ipssScore: 4,
      ipssSeverity: 'leve_0_7',
      totalPsaNgMl: 1.1,
      freePsaNgMl: 0.35,
      psaRatioPercent: 31.8,
      digitalRectalExam: 'normal_fibroelastica',
      renalUltrasoundNotes: 'Riñones de tamaño y parénquima normal. Vejiga de paredes delgadas sin litiasis ni residuos patológicos.',
      postVoidResidualMl: 15,
      notes: 'Chequeo urológico preventivo. Sin signos de hiperplasia prostática benigna obstructiva.',
      lastUpdated: '2026-06-20'
    }
  }
};
