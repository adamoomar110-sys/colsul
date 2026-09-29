export type ToothSurface = 'vestibular' | 'lingual' | 'mesial' | 'distal' | 'oclusal' | 'pieza';

export type ConditionType = 
  // Patologías / Hallazgos
  | 'sano'
  | 'caries_np'
  | 'caries_p'
  | 'surco_profundo'
  | 'fractura'
  | 'desgaste'
  | 'retenido'
  | 'supernumerario'
  // Tratamientos / Restauraciones
  | 'obturado'
  | 'obturacion_defectuosa'
  | 'endodoncia'
  | 'corona'
  | 'incrustacion'
  | 'perno'
  | 'sellador'
  // Reemplazos / Prótesis / Cirugía
  | 'implante'
  | 'puente'
  | 'protesis_removible'
  | 'protesis_total'
  | 'extraccion_indicada'
  | 'ausente'
  | 'extraido'
  // Estructura
  | 'erupcion';

export interface ConditionMeta {
  id: ConditionType;
  label: string;
  color: string; // Tailwind hex or css color
  category?: 'patologia' | 'tratamiento' | 'protesis' | 'ortodoncia';
  bgClass: string;
  textClass: string;
  description: string;
  symbol?: string;
}

export interface ToothFinding {
  id: string;
  toothNumber: number;
  surface: ToothSurface;
  condition: ConditionType;
  date: string;
  dentistName?: string;
  notes?: string;
  bridgeStart?: number;
  bridgeEnd?: number;
  bridgeRole?: 'pilar' | 'pontico';
}

export interface DentalXRay {
  id: string;
  date: string;
  title: string;
  type: 'panoramica' | 'periapical' | 'oclusal' | 'tomografia';
  imageUrl: string;
  notes?: string;
}

export interface HealthDeclaration {
  date: string;
  // Preexistentes / Crónicas
  hypertension: boolean; // Hipertensión Arterial
  diabetes: boolean; // Diabetes
  cardiacDisease: boolean; // Cardiopatías / Marcapasos
  anticoagulants: boolean; // Anticoagulados / Hemorragias
  respiratoryDisease: boolean; // Asma / Enf. Respiratoria
  hepatitis: boolean; // Hepatitis / Enf. Hepática
  epilepsy: boolean; // Epilepsia / Convulsiones
  customConditions?: string[]; // Enfermedades / Patologías personalizadas agregadas por el profesional
  // Temporales / Estado Actual
  activeInfection: boolean; // Infección activa
  fever: boolean; // Fiebre reciente
  pregnantOrLactating: boolean; // Embarazo o Lactancia
  currentMedication: string; // Medicación actual en curso
  recentSurgeries: string; // Cirugías recientes
  localAnesthesiaAllergy: boolean; // Alergia a Anestesia Local
}

export interface ClinicalEvolution {
  id: string;
  date: string; // YYYY-MM-DD
  dentistName: string; // Nombre del profesional / odontólogo/a
  toothNumber?: number; // Pieza dental (opcional)
  treatment: string; // Procedimiento realizado / Evolución del turno
  notes?: string; // Observaciones clínicas, indicación de fármacos, etc.
}

export type MedicalSpecialty = 
  | 'odontologia'
  | 'oftalmologia'
  | 'cardiologia'
  | 'pediatria'
  | 'traumatologia'
  | 'dermatologia'
  | 'ginecologia'
  | 'clinica_medica'
  | 'nutricion'
  | 'kinesiologia'
  | 'otorrinolaringologia'
  | 'neumonologia'
  | 'neurologia'
  | 'psicologia'
  | 'urologia';

export interface SpecialtyMeta {
  id: MedicalSpecialty;
  name: string;
  icon: string;
  badgeColor: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
  description: string;
  defaultRoom: number;
  defaultDoctor: string;
}

// 1. OFTALMOLOGÍA
export interface OphthalmologyRecord {
  visualAcuityRight: string; // ej: 20/20, 20/40
  visualAcuityLeft: string;
  sphereRight: number; // Refracción esférica
  sphereLeft: number;
  cylinderRight: number; // Cilindro
  cylinderLeft: number;
  axisRight: number; // Eje en grados 0-180
  axisLeft: number;
  intraocularPressureRight: number; // PIO en mmHg (normal 10-21)
  intraocularPressureLeft: number;
  fundoscopy: string; // Fondo de ojo
  biomicroscopy: string; // Lámpara de hendidura
  notes?: string;
  lastUpdated?: string;
}

// 2. CARDIOLOGÍA
export interface CardiologyRecord {
  systolicBP: number; // Presión arterial sistólica (mmHg)
  diastolicBP: number; // Presión arterial diastólica (mmHg)
  heartRate: number; // ppm
  ecgRhythm: 'sinusal_normal' | 'taquicardia_sinusal' | 'bradicardia' | 'fibrilacion_auricular' | 'extrasistoles' | 'bloqueo_rama';
  cardiovascularRisk: 'bajo' | 'moderado' | 'alto' | 'muy_alto'; // Escala Framingham
  peripheralPulses: string;
  edema: boolean;
  notes?: string;
  lastUpdated?: string;
}

// 3. PEDIATRÍA
export interface VaccineDose {
  id: string;
  vaccineName: string;
  ageTarget: string; // ej: '2 meses', 'Recién nacido', '11 años'
  applied: boolean;
  applicationDate?: string;
  batchNumber?: string;
}

export interface PediatricsRecord {
  weightKg: number;
  heightCm: number;
  headCircumferenceCm: number;
  weightPercentile: number; // 0-100 OMS
  heightPercentile: number;
  headPercentile: number;
  psychomotorMilestones: string;
  feedingType: 'lactancia_exclusiva' | 'formula' | 'mixta' | 'alimentacion_complementaria';
  vaccines: VaccineDose[];
  notes?: string;
  lastUpdated?: string;
}

// 4. TRAUMATOLOGÍA & ORTOPEDIA
export interface TraumatologyRecord {
  affectedJoint: 'hombro' | 'codo' | 'muneca' | 'columna_cervical' | 'columna_lumbar' | 'cadera' | 'rodilla' | 'tobillo' | 'pie';
  side: 'izquierdo' | 'derecho' | 'bilateral';
  painScaleEVA: number; // 1-10
  mobilityRangeROM: string; // Limitación funcional
  immobilization: 'ninguna' | 'ferula' | 'yeso' | 'cabestrillo' | 'bota_walker' | 'vendaje';
  injuryType: 'fractura' | 'esguince' | 'luxacion' | 'tendinitis' | 'artrosis' | 'desgarro';
  surgeryHistory: string;
  notes?: string;
  lastUpdated?: string;
}

// 5. DERMATOLOGÍA
export interface DermatologyRecord {
  fitzpatrickPhototype: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
  lesionLocation: string; // ej: Rostro, Espalda, Extremidades
  lesionType: 'nevus' | 'macula' | 'papula' | 'placa' | 'nodulo' | 'vesicula' | 'queratosis';
  abcdeAsymmetry: boolean;
  abcdeBorderIrregular: boolean;
  abcdeColorVariegated: boolean;
  abcdeDiameterOver6mm: boolean;
  abcdeEvolutionRapid: boolean;
  dermoscopyFindings: string;
  biopsyIndicated: boolean;
  notes?: string;
  lastUpdated?: string;
}

// 6. GINECOLOGÍA & OBSTETRICIA
export interface GynecologyRecord {
  fumDate?: string; // Fecha Última Menstruación (YYYY-MM-DD)
  gestationalWeeks?: number; // Semanas calculadas
  gestationalDays?: number;
  estimatedDueDate?: string; // FPP (Fecha Probable de Parto)
  gravidity: number; // Gestas
  parity: number; // Partos
  abortions: number; // Abortos
  papDate?: string; // Último PAP
  papResult?: string;
  colposcopyNotes?: string;
  mammographyDate?: string;
  mammographyBirads?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
  notes?: string;
  lastUpdated?: string;
}

// 7. CLÍNICA MÉDICA / MEDICINA INTERNA
export interface InternalMedicineRecord {
  systolicBP: number;
  diastolicBP: number;
  heartRate: number;
  respiratoryRate: number; // rpm
  temperatureC: number; // °C
  spo2Percent: number; // %
  bloodGlucoseMgDl?: number; // HGT mg/dL
  systemicReview: {
    cardiovascular: string;
    respiratory: string;
    gastrointestinal: string;
    neurological: string;
    osteomuscular: string;
  };
  currentSyndromes: string;
  labSummary: string;
  notes?: string;
  lastUpdated?: string;
}

// 8. NUTRICIÓN & DIETÉTICA
export interface NutritionRecord {
  weightKg: number;
  heightCm: number;
  bmi: number; // IMC calculado automático
  bmiCategory: 'bajo_peso' | 'normal' | 'sobrepeso' | 'obesidad_1' | 'obesidad_2' | 'obesidad_3';
  bodyFatPercent?: number;
  muscleMassKg?: number;
  waistCircumferenceCm?: number;
  basalMetabolicRateKcal?: number; // TMB
  caloricTargetKcal?: number;
  dietaryPlanSummary: string;
  hydrationLitersDaily: number;
  allergiesIntolerances: string;
  notes?: string;
  lastUpdated?: string;
}

// 9. KINESIOLOGÍA & FISIOTERAPIA
export interface KinesiologyRecord {
  affectedZone: string;
  painScaleEVA: number; // 1-10
  treatmentGoals: string;
  sessionCountCompleted: number;
  sessionCountTotal: number;
  modalities: {
    magneto: boolean;
    ultrasound: boolean;
    tens: boolean;
    cryotherapy: boolean;
    thermotherapy: boolean;
    activeKinesio: boolean;
    manualTherapy: boolean;
  };
  functionalEvolutionNotes: string;
  lastUpdated?: string;
}

// 10. OTORRINOLARINGOLOGÍA (ORL)
export interface AudiometryFrequency {
  frequencyHz: 250 | 500 | 1000 | 2000 | 4000 | 8000;
  rightEarDb: number; // 0 a 120 dB
  leftEarDb: number;
}

export interface OtorhinolaryngologyRecord {
  audiometry: AudiometryFrequency[];
  rightOtoscopy: string; // Tímpano derecho
  leftOtoscopy: string; // Tímpano izquierdo
  rhinoscopy: string; // Fosas nasales / tabique
  oropharynx: string; // Amígdalas / fauces
  hearingLossDiagnosis: 'audicion_normal' | 'hipoacusia_leve' | 'hipoacusia_moderada' | 'hipoacusia_severa' | 'hipoacusia_profunda';
  notes?: string;
  lastUpdated?: string;
}

// 11. NEUMONOLOGÍA
export interface PneumologyRecord {
  fvcLiters: number; // Capacidad Vital Forzada
  fvcPercentPredicted: number;
  fev1Liters: number; // VEF1
  fev1PercentPredicted: number;
  fev1FvcRatio: number; // Relación FEV1/FVC %
  spirometryInterpretation: 'normal' | 'obstructivo_leve' | 'obstructivo_moderado' | 'obstructivo_severo' | 'restrictivo_sugestivo';
  spo2Rest: number;
  smokingStatus: 'no_fumador' | 'ex_fumador' | 'fumador_activo';
  packYears?: number; // Paquetes-año
  inhalerTherapy: string;
  notes?: string;
  lastUpdated?: string;
}

// 12. NEUROLOGÍA
export interface NeurologyRecord {
  glasgowEyeOpening: 1 | 2 | 3 | 4; // 1-4
  glasgowVerbal: 1 | 2 | 3 | 4 | 5; // 1-5
  glasgowMotor: 1 | 2 | 3 | 4 | 5 | 6; // 1-6
  glasgowTotal: number; // 3-15
  cranialNervesIntact: boolean;
  cranialNervesNotes: string;
  motorStrengthMRC: '0' | '1' | '2' | '3' | '4' | '5'; // Escala 0-5
  deepTendonReflexes: 'arreflexia' | 'hiporreflexia' | 'normales' | 'hiperreflexia' | 'clonus';
  sensoryExam: string;
  gaitAndBalance: string; // Marcha y Romberg
  notes?: string;
  lastUpdated?: string;
}

// 13. PSICOLOGÍA & SALUD MENTAL
export interface PsychologyRecord {
  consultationReason: string;
  therapeuticApproach: 'cognitivo_conductual' | 'psicoanalisis' | 'sistemica' | 'gestalt' | 'neuropsicologia';
  currentEmotionalState: string;
  anxietyScoreGAD7?: number; // 0-21
  depressionScorePHQ9?: number; // 0-27
  confidentialSessionNotes: string;
  therapeuticGoals: string[];
  sessionFrequency: 'semanal' | 'quincenal' | 'mensual';
  lastUpdated?: string;
}

// 14. UROLOGÍA
export interface UrologyRecord {
  ipssScore: number; // IPSS 0-35
  ipssSeverity: 'leve_0_7' | 'moderado_8_19' | 'severo_20_35';
  totalPsaNgMl?: number; // PSA Total
  freePsaNgMl?: number; // PSA Libre
  psaRatioPercent?: number; // Cociente Libre/Total
  digitalRectalExam: 'no_realizado' | 'normal_fibroelastica' | 'adenoma_benigno' | 'nodulo_sospechoso';
  renalUltrasoundNotes: string;
  postVoidResidualMl?: number; // Residuo post-miccional
  notes?: string;
  lastUpdated?: string;
}

// Mapa agregado de registros de especialidad por paciente
export interface PatientSpecialtiesData {
  oftalmologia?: OphthalmologyRecord;
  cardiologia?: CardiologyRecord;
  pediatria?: PediatricsRecord;
  traumatologia?: TraumatologyRecord;
  dermatologia?: DermatologyRecord;
  ginecologia?: GynecologyRecord;
  clinica_medica?: InternalMedicineRecord;
  nutricion?: NutritionRecord;
  kinesiologia?: KinesiologyRecord;
  otorrinolaringologia?: OtorhinolaryngologyRecord;
  neumonologia?: PneumologyRecord;
  neurologia?: NeurologyRecord;
  psicologia?: PsychologyRecord;
  urologia?: UrologyRecord;
}

export interface Patient {
  id: string;
  name: string;
  dni: string;
  age: number;
  phone: string;
  email: string;
  photoUrl?: string; // Foto opcional del paciente
  healthInsurance: string;
  insuranceNumber: string;
  medicalHistory: string;
  allergies: string;
  healthDeclaration?: HealthDeclaration; // Planilla de antecedentes y salud
  odontogramFindings: ToothFinding[];
  xrays?: DentalXRay[]; // Radiografías y estudios diagnósticos
  evolutions?: ClinicalEvolution[]; // Evolución clínica de turnos y tratamientos
  specialtiesData?: PatientSpecialtiesData; // Fichas especializadas independientes (15 especialidades)
  notes: string;
}

export type AppointmentStatus = 'pendiente' | 'confirmado' | 'atendido' | 'cancelado';
export type AppointmentOrigin = 'online' | 'consultorio';
export type AppointmentPaymentStatus = 'pendiente' | 'seña_abonada' | 'total_abonado' | 'efectivo_consultorio';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  dentistName: string; // Nombre del profesional médico
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  specialty: MedicalSpecialty | string;
  roomNumber?: number; // Consultorio Físico 1 al 10
  status: AppointmentStatus;
  notes: string;
  origin?: AppointmentOrigin;
  paymentStatus?: AppointmentPaymentStatus;
  dni?: string;
}

export interface BudgetItem {
  id: string;
  toothNumber?: number;
  specialty?: MedicalSpecialty | string;
  description: string;
  cost: number;
}

export interface Budget {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  items: BudgetItem[];
  totalCost: number;
  paidAmount: number;
  status: 'borrador' | 'aprobado' | 'en_proceso' | 'completado';
}

export interface Dentist {
  id: string;
  name: string;
  licenseNumber: string; // Matrícula Profesional
  specialty: MedicalSpecialty | string;
  roomNumber?: number; // Consultorio asignado (1 al 10)
  phone: string;
  email: string;
  active: boolean;
}

export type Doctor = Dentist;

export type DayOfWeek = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

export interface DaySchedule {
  day: DayOfWeek;
  label: string;
  isOpen: boolean;
  startTime: string; // e.g. '08:00'
  endTime: string; // e.g. '13:00'
  hasSplitShift?: boolean;
  startTime2?: string;
  endTime2?: string;
  slotDurationMinutes: number;
}

export type ClinicScheduleConfig = Record<DayOfWeek, DaySchedule>;


