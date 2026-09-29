import { Patient, Appointment, Budget, ConditionMeta, ConditionType, ClinicScheduleConfig, DayOfWeek } from '../types';

export const CONDITION_METAS: Record<ConditionType, ConditionMeta> = {
  // 1. PATOLOGÍAS Y HALLAZGOS
  sano: {
    id: 'sano',
    label: 'Sano / Sin Patología',
    color: '#94a3b8',
    category: 'patologia',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-700',
    description: 'Pieza dental en buen estado sin alteraciones'
  },
  caries_np: {
    id: 'caries_np',
    label: 'Caries No Penetrante (NP)',
    color: '#ef4444',
    category: 'patologia',
    bgClass: 'bg-red-100',
    textClass: 'text-red-700',
    description: 'Lesión cariosa no penetrante / superficial',
    symbol: 'NP'
  },
  caries_p: {
    id: 'caries_p',
    label: 'Caries Penetrante (P)',
    color: '#dc2626',
    category: 'patologia',
    bgClass: 'bg-red-200',
    textClass: 'text-red-900',
    description: 'Lesión cariosa penetrante / profunda',
    symbol: 'P'
  },
  surco_profundo: {
    id: 'surco_profundo',
    label: 'Surco Profundo',
    color: '#ef4444',
    category: 'patologia',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800',
    description: 'Surco profundo marcado con una raya horizontal roja por cara',
    symbol: '➖'
  },
  fractura: {
    id: 'fractura',
    label: 'Fractura Dental',
    color: '#dc2626',
    category: 'patologia',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800',
    description: 'Rayito rojo marcado por cara dental seleccionada',
    symbol: '⚡'
  },
  desgaste: {
    id: 'desgaste',
    label: 'Desgaste / Bruxismo / Atrición',
    color: '#06b6d4',
    category: 'patologia',
    bgClass: 'bg-cyan-100',
    textClass: 'text-cyan-800',
    description: 'Línea celeste marcada por cara dental seleccionada',
    symbol: '📈'
  },
  retenido: {
    id: 'retenido',
    label: 'Diente Retenido / Impactado',
    color: '#854d0e',
    category: 'patologia',
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-900',
    description: 'Diente no erupcionado alojado en el maxilar',
    symbol: '🛑'
  },
  supernumerario: {
    id: 'supernumerario',
    label: 'Diente Supernumerario',
    color: '#14b8a6',
    category: 'patologia',
    bgClass: 'bg-teal-100',
    textClass: 'text-teal-800',
    description: 'Pieza dental adicional al esquema normal',
    symbol: '➕'
  },
  // 2. TRATAMIENTOS Y RESTAURACIONES
  obturado: {
    id: 'obturado',
    label: 'Obturado / Restauración',
    color: '#3b82f6',
    category: 'tratamiento',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-700',
    description: 'Arreglo con composite, ionómero o amalgama',
    symbol: '🔵'
  },
  obturacion_defectuosa: {
    id: 'obturacion_defectuosa',
    label: 'Restauración Filtrada',
    color: '#ef4444',
    category: 'tratamiento',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800',
    description: 'Restauración filtrada en el color rojo de la caries con bordes azules',
    symbol: '🔴'
  },
  endodoncia: {
    id: 'endodoncia',
    label: 'Tratamiento de Conducto (TC)',
    color: '#2563eb',
    category: 'tratamiento',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-700',
    description: 'Indicado con las letras TC sobre la pieza sin marcar el diente',
    symbol: 'TC'
  },
  corona: {
    id: 'corona',
    label: 'Corona / Prótesis Fija',
    color: '#0284c7',
    category: 'tratamiento',
    bgClass: 'bg-sky-100',
    textClass: 'text-sky-800',
    description: 'Funda / Corona sobre diente o muñón',
    symbol: '👑'
  },
  incrustacion: {
    id: 'incrustacion',
    label: 'Incrustación / Carilla Estética',
    color: '#06b6d4',
    category: 'tratamiento',
    bgClass: 'bg-cyan-100',
    textClass: 'text-cyan-800',
    description: 'Marcado por cara dental en color celeste',
    symbol: '💎'
  },
  perno: {
    id: 'perno',
    label: 'Perno / Poste Intrarradicular',
    color: '#4f46e5',
    category: 'tratamiento',
    bgClass: 'bg-indigo-100',
    textClass: 'text-indigo-800',
    description: 'Perno colado o de fibra de vidrio en conducto',
    symbol: '📌'
  },
  sellador: {
    id: 'sellador',
    label: 'Sellador de Fosas y Fisuras',
    color: '#38bdf8',
    category: 'tratamiento',
    bgClass: 'bg-sky-100',
    textClass: 'text-sky-700',
    description: 'Protección preventiva en surcos oclusales',
    symbol: '🛡️'
  },
  // 3. REEMPLAZOS / PRÓTESIS / CIRUGÍA
  implante: {
    id: 'implante',
    label: 'Implante Dental',
    color: '#10b981',
    category: 'protesis',
    bgClass: 'bg-emerald-100',
    textClass: 'text-emerald-800',
    description: 'Implante osteointegrado intraóseo',
    symbol: '🔩'
  },
  puente: {
    id: 'puente',
    label: 'Puente Fijo',
    color: '#059669',
    category: 'protesis',
    bgClass: 'bg-emerald-100',
    textClass: 'text-emerald-900',
    description: 'Prótesis fija conectando pilares y pónticos',
    symbol: '🌉'
  },
  protesis_removible: {
    id: 'protesis_removible',
    label: 'Prótesis Removible (PPR)',
    color: '#8b5cf6',
    category: 'protesis',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-800',
    description: 'Prótesis parcial removible metálica o acrílica',
    symbol: '🦷'
  },
  protesis_total: {
    id: 'protesis_total',
    label: 'Prótesis Total / Completa',
    color: '#7c3aed',
    category: 'protesis',
    bgClass: 'bg-violet-100',
    textClass: 'text-violet-900',
    description: 'Dentadura completa superior o inferior',
    symbol: '😁'
  },
  extraccion_indicada: {
    id: 'extraccion_indicada',
    label: 'Extracción Indicada (Exodoncia)',
    color: '#e11d48',
    category: 'protesis',
    bgClass: 'bg-rose-100',
    textClass: 'text-rose-800',
    description: 'Pieza dental con indicación de exodoncia',
    symbol: '═'
  },
  ausente: {
    id: 'ausente',
    label: 'Diente Ausente',
    color: '#ef4444',
    category: 'protesis',
    bgClass: 'bg-red-100',
    textClass: 'text-red-700',
    description: 'Pieza ausente por agenesia o pérdida',
    symbol: '❌'
  },
  extraido: {
    id: 'extraido',
    label: 'Diente Extraído',
    color: '#1d4ed8',
    category: 'protesis',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-800',
    description: 'Pieza extraída previamente por profesional',
    symbol: '❌'
  },
  erupcion: {
    id: 'erupcion',
    label: 'Diente en Erupción',
    color: '#10b981',
    category: 'protesis',
    bgClass: 'bg-emerald-100',
    textClass: 'text-emerald-800',
    description: 'Pieza dental emergiendo en la arcada',
    symbol: '⬆️'
  }
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-1',
    name: 'Carlos Alberto Gómez',
    dni: '32.455.890',
    age: 38,
    phone: '+54 9 11 4589-1234',
    email: 'carlos.gomez@email.com',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    healthInsurance: 'OSDE 310',
    insuranceNumber: '4890123901',
    medicalHistory: 'Hipertensión controlada con enalapril. Sin cirugías previas.',
    allergies: 'Penicilina (Alergia moderada)',
    healthDeclaration: {
      date: '2026-07-15',
      hypertension: true,
      diabetes: false,
      cardiacDisease: false,
      anticoagulants: false,
      respiratoryDisease: false,
      hepatitis: false,
      epilepsy: false,
      activeInfection: true,
      fever: false,
      pregnantOrLactating: false,
      currentMedication: 'Enalapril 10mg diario, Amoxicilina 500mg por 7 días',
      recentSurgeries: 'Ninguna',
      localAnesthesiaAllergy: false
    },
    notes: 'Paciente con sensibilidad en premolares superiores.',
    odontogramFindings: [
      { id: 'f-1', toothNumber: 16, surface: 'oclusal', condition: 'caries_np', date: '2026-07-15', notes: 'Caries oclusal Grado II' },
      { id: 'f-2', toothNumber: 16, surface: 'mesial', condition: 'caries_np', date: '2026-07-15', notes: 'Mancha cariosa' },
      { id: 'f-3', toothNumber: 24, surface: 'oclusal', condition: 'obturado', date: '2026-05-10', notes: 'Composite estético' },
      { id: 'f-4', toothNumber: 36, surface: 'pieza', condition: 'endodoncia', date: '2026-03-20', notes: 'Conducto rematado en 3 conductos' },
      { id: 'f-5', toothNumber: 46, surface: 'pieza', condition: 'ausente', date: '2025-11-04', notes: 'Exodoncia antigua' },
      { id: 'f-6', toothNumber: 11, surface: 'vestibular', condition: 'sellador', date: '2026-01-12', notes: 'Protección preventiva' },
    ],
    xrays: [
      {
        id: 'xr-1',
        date: '2026-07-10',
        title: 'Radiografía Panorámica Maxilar',
        type: 'panoramica',
        imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
        notes: 'Evaluación general de maxilares y piezas 16, 24, 36. Se observa ligera rarefacción en pieza 36.'
      },
      {
        id: 'xr-2',
        date: '2026-03-18',
        title: 'Periapical Pieza 36 (Pre-Conducto)',
        type: 'periapical',
        imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
        notes: 'Conductos mesiales visibles de 19mm. Sin lesión periapical evidente.'
      }
    ],
    evolutions: [
      {
        id: 'evo-1',
        date: '2026-08-20',
        dentistName: 'Dra. Amalia Merlo',
        toothNumber: 16,
        treatment: 'Apertura de cavidad y eliminación de tejido cariado oclusal. Tallado biomecánico.',
        notes: 'Se coloca restauración provisoria con eugenato. Se indica control en 7 días.'
      },
      {
        id: 'evo-2',
        date: '2026-07-15',
        dentistName: 'Dr. Fernando Ruiz',
        toothNumber: 36,
        treatment: 'Paso 2 de Endodoncia: Limpieza, instrumentación y conductometría.',
        notes: 'Longitud de trabajo 21mm. Irrigación activa con NaOCl 2.5%. Paciente asintomático.'
      },
      {
        id: 'evo-3',
        date: '2026-05-10',
        dentistName: 'Dra. Amalia Merlo',
        toothNumber: 24,
        treatment: 'Obturación con composite fotopolimerizable en cara oclusal.',
        notes: 'Grabado ácido 15s, adhesivo universal, restauración estética y pulido con discos.'
      }
    ]
  },
  {
    id: 'p-2',
    name: 'María Florencia Rossi',
    dni: '28.912.443',
    age: 44,
    phone: '+54 9 11 6723-9988',
    email: 'mflor.rossi@email.com',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    healthInsurance: 'Swiss Medical',
    insuranceNumber: '89012384',
    medicalHistory: 'Sin patologías previas.',
    allergies: 'Ninguna conocida.',
    notes: 'Iniciando tratamiento ortodóncico.',
    odontogramFindings: [
      { id: 'f-7', toothNumber: 14, surface: 'oclusal', condition: 'obturado', date: '2026-06-01' },
      { id: 'f-8', toothNumber: 26, surface: 'pieza', condition: 'corona', date: '2026-02-18', notes: 'Corona porcelana sobre zirconio' },
      { id: 'f-9', toothNumber: 38, surface: 'pieza', condition: 'ausente', date: '2024-09-10' },
      { id: 'f-10', toothNumber: 48, surface: 'pieza', condition: 'ausente', date: '2024-09-10' },
    ],
    xrays: [
      {
        id: 'xr-3',
        date: '2026-02-15',
        title: 'Radiografía Panorámica Ortodoncia',
        type: 'panoramica',
        imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
        notes: 'Alineación de arcadas superior e inferior. Control pre-ortodóncico.'
      }
    ]
  },
  {
    id: 'p-3',
    name: 'Joaquín Benítez',
    dni: '41.003.551',
    age: 26,
    phone: '+54 9 11 3412-8877',
    email: 'joaco.benitez@email.com',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    healthInsurance: 'IOMA',
    insuranceNumber: '77612349',
    medicalHistory: 'Bruxismo leve nocturno. Usa placa de descanso.',
    allergies: 'Aspirina',
    notes: 'Evaluación para limpieza ultrasónica y blanqueamiento.',
    odontogramFindings: [
      { id: 'f-11', toothNumber: 47, surface: 'oclusal', condition: 'caries_np', date: '2026-07-28' },
      { id: 'f-12', toothNumber: 37, surface: 'oclusal', condition: 'caries_np', date: '2026-07-28' }
    ]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    patientId: 'p-1',
    patientName: 'Carlos Alberto Gómez',
    patientPhone: '+54 9 11 4589-1234',
    dentistName: 'Dra. Amalia Merlo',
    date: new Date().toISOString().split('T')[0], // Today
    time: '09:30',
    specialty: 'Operatoria & Arreglos',
    status: 'confirmado',
    notes: 'Tratamiento de caries en pieza 16 (Oclusal y Mesial).'
  },
  {
    id: 'app-2',
    patientId: 'p-2',
    patientName: 'María Florencia Rossi',
    patientPhone: '+54 9 11 6723-9988',
    dentistName: 'Dra. Amalia Merlo',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    specialty: 'Ortodoncia & Control',
    status: 'pendiente',
    notes: 'Ajuste de arcos y control de corona en pieza 26.'
  },
  {
    id: 'app-3',
    patientId: 'p-3',
    patientName: 'Joaquín Benítez',
    patientPhone: '+54 9 11 3412-8877',
    dentistName: 'Dra. Amalia Merlo',
    date: new Date().toISOString().split('T')[0],
    time: '15:00',
    specialty: 'Limpieza Ultrasónica',
    status: 'pendiente',
    notes: 'Profilaxis dental y fluoración.'
  },
  {
    id: 'app-4',
    patientId: 'p-1',
    patientName: 'Carlos Alberto Gómez',
    patientPhone: '+54 9 11 4589-1234',
    dentistName: 'Dra. Amalia Merlo',
    date: '2026-08-10',
    time: '10:00',
    specialty: 'Endodoncia Control',
    status: 'confirmado',
    notes: 'Revisión clínica radiográfica post-conducto.'
  }
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'bud-1',
    patientId: 'p-1',
    patientName: 'Carlos Alberto Gómez',
    date: '2026-07-20',
    items: [
      { id: 'i-1', toothNumber: 16, description: 'Restauración estética con composite (2 superficies)', cost: 45000 },
      { id: 'i-2', toothNumber: 36, description: 'Tratamiento de conducto multirradicular', cost: 95000 },
      { id: 'i-3', description: 'Limpieza profunda ultrasónica + Perno y reconstrucción', cost: 50000 }
    ],
    totalCost: 190000,
    paidAmount: 95000,
    status: 'en_proceso'
  },
  {
    id: 'bud-2',
    patientId: 'p-3',
    patientName: 'Joaquín Benítez',
    date: '2026-07-28',
    items: [
      { id: 'i-4', toothNumber: 47, description: 'Obturación simple fotocurada', cost: 35000 },
      { id: 'i-5', toothNumber: 37, description: 'Obturación simple fotocurada', cost: 35000 },
      { id: 'i-6', description: 'Placa miorrelajante para bruxismo', cost: 65000 }
    ],
    totalCost: 135000,
    paidAmount: 0,
    status: 'aprobado'
  }
];

export const DEFAULT_CLINIC_SCHEDULE: ClinicScheduleConfig = {
  lunes:     { day: 'lunes',     label: 'Lunes',     isOpen: true,  startTime: '08:00', endTime: '13:00', hasSplitShift: true, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 },
  martes:    { day: 'martes',    label: 'Martes',    isOpen: true,  startTime: '08:00', endTime: '13:00', hasSplitShift: true, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 },
  miercoles: { day: 'miercoles', label: 'Miércoles', isOpen: true,  startTime: '08:00', endTime: '13:00', hasSplitShift: true, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 },
  jueves:    { day: 'jueves',    label: 'Jueves',    isOpen: true,  startTime: '08:00', endTime: '13:00', hasSplitShift: true, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 },
  viernes:   { day: 'viernes',   label: 'Viernes',   isOpen: true,  startTime: '08:00', endTime: '13:00', hasSplitShift: true, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 },
  sabado:    { day: 'sabado',    label: 'Sábado',    isOpen: true,  startTime: '09:00', endTime: '14:00', hasSplitShift: false, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 },
  domingo:   { day: 'domingo',   label: 'Domingo',   isOpen: false, startTime: '09:00', endTime: '13:00', hasSplitShift: false, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 }
};

export const getDayOfWeekKey = (dateStr: string): DayOfWeek => {
  if (!dateStr) return 'lunes';
  const parts = dateStr.split('-');
  if (parts.length < 3) return 'lunes';
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  const dayIndex = dateObj.getDay();
  const map: DayOfWeek[] = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  return map[dayIndex] || 'lunes';
};

export const generateTimeSlotsFromSchedule = (scheduleConfig: ClinicScheduleConfig, dateStr: string): string[] => {
  const dayKey = getDayOfWeekKey(dateStr);
  const daySched = scheduleConfig?.[dayKey];
  if (!daySched || !daySched.isOpen) return [];

  const step = daySched.slotDurationMinutes || 30;
  const slots: string[] = [];

  const addRangeSlots = (startTimeStr?: string, endTimeStr?: string) => {
    if (!startTimeStr || !endTimeStr) return;
    const [startH, startM] = startTimeStr.split(':').map(Number);
    const [endH, endM] = endTimeStr.split(':').map(Number);
    if (isNaN(startH) || isNaN(endH)) return;

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes < endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
      currentMinutes += step;
    }
  };

  // Primer Tramo / Mañana
  addRangeSlots(daySched.startTime, daySched.endTime);

  // Segundo Tramo / Tarde (si tiene horario cortado activo)
  if (daySched.hasSplitShift && daySched.startTime2 && daySched.endTime2) {
    addRangeSlots(daySched.startTime2, daySched.endTime2);
  }

  return slots;
};
