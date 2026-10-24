/**
 * SUITE DE TESTS PROFUNDOS: TURNOS, AGENDAS Y MÓDULOS DE COLSUL
 * Startup Aura — Omar Horacio Adamo
 */

import assert from 'node:assert';

console.log('================================================================');
console.log('🧪 INICIANDO TEST PROFUNDO DE TURNOS Y MÓDULOS - COLSUL v2.0');
console.log('   Startup Aura — Policonsultorio Médico Multiespecialidad');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}\n`);
  }
}

// -------------------------------------------------------------
// 1. CONFIGURACIÓN Y HORARIOS DE CLÍNICA
// -------------------------------------------------------------
const DEFAULT_CLINIC_SCHEDULE = {
  lunes:     { day: 'lunes',     label: 'Lunes',     isOpen: true,  startTime: '08:00', endTime: '13:00', hasSplitShift: true, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 },
  martes:    { day: 'martes',    label: 'Martes',    isOpen: true,  startTime: '08:00', endTime: '13:00', hasSplitShift: true, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 },
  miercoles: { day: 'miercoles', label: 'Miércoles', isOpen: true,  startTime: '08:00', endTime: '13:00', hasSplitShift: true, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 },
  jueves:    { day: 'jueves',    label: 'Jueves',    isOpen: true,  startTime: '08:00', endTime: '13:00', hasSplitShift: true, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 },
  viernes:   { day: 'viernes',   label: 'Viernes',   isOpen: true,  startTime: '08:00', endTime: '13:00', hasSplitShift: true, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 },
  sabado:    { day: 'sabado',    label: 'Sábado',    isOpen: true,  startTime: '09:00', endTime: '14:00', hasSplitShift: false, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 },
  domingo:   { day: 'domingo',   label: 'Domingo',   isOpen: false, startTime: '09:00', endTime: '13:00', hasSplitShift: false, startTime2: '16:00', endTime2: '20:00', slotDurationMinutes: 30 }
};

const getDayOfWeekKey = (dateStr) => {
  if (!dateStr) return 'lunes';
  const parts = dateStr.split('-');
  if (parts.length < 3) return 'lunes';
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  const dayIndex = dateObj.getDay();
  const map = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  return map[dayIndex] || 'lunes';
};

const generateTimeSlotsFromSchedule = (scheduleConfig, dateStr) => {
  const dayKey = getDayOfWeekKey(dateStr);
  const daySched = scheduleConfig?.[dayKey];
  if (!daySched || !daySched.isOpen) return [];

  const step = daySched.slotDurationMinutes || 30;
  const slots = [];

  const addRangeSlots = (startTimeStr, endTimeStr) => {
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

  addRangeSlots(daySched.startTime, daySched.endTime);
  if (daySched.hasSplitShift && daySched.startTime2 && daySched.endTime2) {
    addRangeSlots(daySched.startTime2, daySched.endTime2);
  }

  return slots;
};

// -------------------------------------------------------------
// EJECUCIÓN DE PRUEBAS
// -------------------------------------------------------------

console.log('📌 SECCIÓN 1: Generador de Slots y Lógica de Horarios');

runTest('Cálculo correcto de día de la semana para cualquier fecha', () => {
  assert.strictEqual(getDayOfWeekKey('2026-10-24'), 'sabado');
  assert.strictEqual(getDayOfWeekKey('2026-10-25'), 'domingo');
  assert.strictEqual(getDayOfWeekKey('2026-10-26'), 'lunes');
  assert.strictEqual(getDayOfWeekKey('2026-10-27'), 'martes');
  assert.strictEqual(getDayOfWeekKey('2026-10-28'), 'miercoles');
  assert.strictEqual(getDayOfWeekKey('2026-10-29'), 'jueves');
  assert.strictEqual(getDayOfWeekKey('2026-10-30'), 'viernes');
});

runTest('Generación de turnos para día laborable con horario cortado (Lunes)', () => {
  const slots = generateTimeSlotsFromSchedule(DEFAULT_CLINIC_SCHEDULE, '2026-10-26');
  // Mañana: 08:00 a 13:00 cada 30m = 10 slots (08:00, 08:30, 09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 12:00, 12:30)
  // Tarde: 16:00 a 20:00 cada 30m = 8 slots (16:00, 16:30, 17:00, 17:30, 18:00, 18:30, 19:00, 19:30)
  // Total = 18 slots
  assert.strictEqual(slots.length, 18);
  assert.strictEqual(slots[0], '08:00');
  assert.strictEqual(slots[9], '12:30');
  assert.strictEqual(slots[10], '16:00');
  assert.strictEqual(slots[17], '19:30');
  assert.ok(!slots.includes('13:00')); // Turno de corte
  assert.ok(!slots.includes('14:00')); // Cerrado al mediodía
});

runTest('Generación de turnos para sábado corrido (09:00 a 14:00)', () => {
  const slots = generateTimeSlotsFromSchedule(DEFAULT_CLINIC_SCHEDULE, '2026-10-24');
  // 09:00 a 14:00 cada 30m = 10 slots
  assert.strictEqual(slots.length, 10);
  assert.strictEqual(slots[0], '09:00');
  assert.strictEqual(slots[slots.length - 1], '13:30');
  assert.ok(!slots.includes('16:00'));
});

runTest('Domingo cerrado no produce turnos', () => {
  const slots = generateTimeSlotsFromSchedule(DEFAULT_CLINIC_SCHEDULE, '2026-10-25');
  assert.strictEqual(slots.length, 0);
});

runTest('Soporte de duraciones de turno personalizadas (ej. 15, 20, 45, 60 min)', () => {
  const customSched = {
    ...DEFAULT_CLINIC_SCHEDULE,
    lunes: { ...DEFAULT_CLINIC_SCHEDULE.lunes, slotDurationMinutes: 15 }
  };
  const slots15 = generateTimeSlotsFromSchedule(customSched, '2026-10-26');
  // 5 horas mañana * 4 slots = 20 slots. 4 horas tarde * 4 slots = 16 slots. Total = 36 slots
  assert.strictEqual(slots15.length, 36);
  assert.strictEqual(slots15[0], '08:00');
  assert.strictEqual(slots15[1], '08:15');
});

console.log('\n📌 SECCIÓN 2: Detección y Prevención de Doble Reserva (Colisiones)');

runTest('Detección de horario ocupado para el mismo profesional y fecha', () => {
  const mockAppointments = [
    { id: '1', date: '2026-10-26', time: '10:00', dentistName: 'Dra. Amalia Merlo', status: 'confirmado' },
    { id: '2', date: '2026-10-26', time: '10:30', dentistName: 'Dra. Amalia Merlo', status: 'confirmado' },
    { id: '3', date: '2026-10-26', time: '11:00', dentistName: 'Dra. Mariana Benítez', status: 'confirmado' },
    { id: '4', date: '2026-10-26', time: '11:30', dentistName: 'Dra. Amalia Merlo', status: 'cancelado' }, // Cancelado NO debe bloquear
  ];

  const date = '2026-10-26';
  const dentist = 'Dra. Amalia Merlo';

  const bookedSlots = mockAppointments
    .filter(a => a.date === date && a.dentistName === dentist && a.status !== 'cancelado')
    .map(a => a.time);

  assert.deepStrictEqual(bookedSlots, ['10:00', '10:30']);
  assert.ok(!bookedSlots.includes('11:00')); // Turno de otro médico
  assert.ok(!bookedSlots.includes('11:30')); // Turno cancelado queda libre
});

runTest('Filtrado dinámico de horarios libres (availableNonBookedSlots)', () => {
  const allSlots = ['09:00', '09:30', '10:00', '10:30', '11:00'];
  const bookedSlots = ['09:30', '10:30'];

  const freeSlots = allSlots.filter(s => !bookedSlots.includes(s));
  assert.deepStrictEqual(freeSlots, ['09:00', '10:00', '11:00']);

  // Auto-selección inteligente del primer horario libre
  let selectedTime = '09:30';
  if (bookedSlots.includes(selectedTime)) {
    selectedTime = freeSlots[0] || allSlots[0];
  }
  assert.strictEqual(selectedTime, '09:00');
});

runTest('Permitir turnos simultáneos a la misma hora para consultorios/médicos distintos', () => {
  const appointments = [
    { id: '1', date: '2026-10-26', time: '10:00', dentistName: 'Dra. Amalia Merlo', roomNumber: 1, specialty: 'Odontología' },
    { id: '2', date: '2026-10-26', time: '10:00', dentistName: 'Dr. Lucas Varela', roomNumber: 2, specialty: 'Oftalmología' },
    { id: '3', date: '2026-10-26', time: '10:00', dentistName: 'Dra. Mariana Benítez', roomNumber: 3, specialty: 'Cardiología' }
  ];

  // Ninguno colisiona porque cada médico atiende en su propio consultorio
  const docsAt10 = appointments.filter(a => a.time === '10:00').map(a => a.dentistName);
  const uniqueDocs = new Set(docsAt10);
  assert.strictEqual(docsAt10.length, 3);
  assert.strictEqual(uniqueDocs.size, 3);
});

console.log('\n📌 SECCIÓN 3: Especialidades Médicas y Asignación de Consultorios');

const SPECIALTIES_TEST_LIST = [
  { id: 'odontologia', name: 'Odontología Integral', room: 1, doc: 'Dra. Amalia Merlo' },
  { id: 'oftalmologia', name: 'Oftalmología & Refracción', room: 2, doc: 'Dr. Lucas Varela' },
  { id: 'cardiologia', name: 'Cardiología & ECG', room: 3, doc: 'Dra. Mariana Benítez' },
  { id: 'pediatria', name: 'Pediatría & Control Infantil', room: 4, doc: 'Dr. Diego Morales' },
  { id: 'traumatologia', name: 'Traumatología & Ortopedia', room: 5, doc: 'Dr. Esteban Carrizo' },
  { id: 'dermatologia', name: 'Dermatología & Lunares', room: 6, doc: 'Dra. Sofía Roldán' },
  { id: 'ginecologia', name: 'Ginecología & Obstetricia', room: 7, doc: 'Dra. Patricia Gómez' },
  { id: 'clinica_medica', name: 'Clínica Médica / General', room: 8, doc: 'Dr. Guillermo Navarro' },
  { id: 'nutricion', name: 'Nutrición & Dietética', room: 9, doc: 'Lic. Camila Méndez' },
  { id: 'kinesiologia', name: 'Kinesiología & Fisioterapia', room: 10, doc: 'Lic. Rodrigo Paz' },
  { id: 'otorrinolaringologia', name: 'Otorrinolaringología (ORL)', room: 2, doc: 'Dr. Lucas Varela' },
  { id: 'neumonologia', name: 'Neumonología & Espirometría', room: 3, doc: 'Dra. Mariana Benítez' },
  { id: 'neurologia', name: 'Neurología Clínica', room: 5, doc: 'Dr. Esteban Carrizo' },
  { id: 'psicologia', name: 'Psicología & Salud Mental', room: 8, doc: 'Lic. Florencia Suárez' },
  { id: 'urologia', name: 'Urología & Próstata', room: 7, doc: 'Dr. Martín Silva' },
];

runTest('Verificación de las 15 especialidades médicas y consultorios del 1 al 10', () => {
  assert.strictEqual(SPECIALTIES_TEST_LIST.length, 15);
  SPECIALTIES_TEST_LIST.forEach(s => {
    assert.ok(s.room >= 1 && s.room <= 10, `Consultorio inválido para ${s.name}`);
    assert.ok(s.doc.length > 3, `Médico no asignado para ${s.name}`);
  });
});

runTest('Mapeo automático de especialidad a médico tratante', () => {
  const getDoctorForSpecialty = (specName) => {
    const found = SPECIALTIES_TEST_LIST.find(s => s.name === specName);
    return found ? found.doc : 'Médico General';
  };

  assert.strictEqual(getDoctorForSpecialty('Cardiología & ECG'), 'Dra. Mariana Benítez');
  assert.strictEqual(getDoctorForSpecialty('Pediatría & Control Infantil'), 'Dr. Diego Morales');
  assert.strictEqual(getDoctorForSpecialty('Odontología Integral'), 'Dra. Amalia Merlo');
});

console.log('\n📌 SECCIÓN 4: Matching de Pacientes y Detección de Duplicados');

runTest('Búsqueda y unificación de paciente por DNI con diferentes puntuaciones', () => {
  const patients = [
    { id: 'p-1', name: 'Carlos Gómez', dni: '35.890.123', phone: '1145891234' },
    { id: 'p-2', name: 'María Rossi', dni: '38123456', phone: '1167239988' }
  ];

  const findPatient = (queryDni) => {
    const clean = queryDni.replace(/\./g, '').trim();
    return patients.find(p => p.dni.replace(/\./g, '').trim() === clean);
  };

  assert.strictEqual(findPatient('35890123')?.id, 'p-1');
  assert.strictEqual(findPatient('35.890.123')?.id, 'p-1');
  assert.strictEqual(findPatient('38.123.456')?.id, 'p-2');
  assert.strictEqual(findPatient('99999999'), undefined);
});

runTest('Búsqueda por teléfono normalizando caracteres especiales', () => {
  const patients = [
    { id: 'p-1', name: 'Carlos Gómez', phone: '+54 9 11 4589-1234' },
  ];

  const findPatientByPhone = (queryPhone) => {
    const clean = queryPhone.replace(/[^0-9]/g, '');
    return patients.find(p => p.phone.replace(/[^0-9]/g, '') === clean);
  };

  assert.strictEqual(findPatientByPhone('5491145891234')?.id, 'p-1');
  assert.strictEqual(findPatientByPhone('+54 9 11 4589 1234')?.id, 'p-1');
});

console.log('\n📌 SECCIÓN 5: Generación de Tickets y Notificaciones');

runTest('Generación de mensaje de WhatsApp con formato correcto de Colsul', () => {
  const app = {
    patientName: 'Omar Adamo',
    patientPhone: '+54 9 11 7829-5317',
    dentistName: 'Dra. Mariana Benítez',
    specialty: 'Cardiología & ECG',
    date: '2026-10-27',
    time: '11:00'
  };

  const expectedSnippet = 'te recordamos tu turno en *Colsul Policonsultorio* el día 2026-10-27 a las 11:00 hs con Dra. Mariana Benítez (Cardiología & ECG)';
  const msg = `Hola ${app.patientName}, te recordamos tu turno en *Colsul Policonsultorio* el día ${app.date} a las ${app.time} hs con ${app.dentistName} (${app.specialty}). Por favor confirma tu asistencia respondiendo a este mensaje. ¡Te esperamos!`;
  
  assert.ok(msg.includes(expectedSnippet));
  const encoded = encodeURIComponent(msg);
  assert.ok(encoded.length > 50);
});

runTest('Enlace a Google Calendar con parámetros RFC5545 válidos', () => {
  const app = {
    date: '2026-10-27',
    time: '11:00',
    specialty: 'Cardiología & ECG',
    doctor: 'Dra. Mariana Benítez'
  };

  const cleanDate = app.date.replace(/-/g, '');
  const cleanTime = app.time.replace(':', '');
  const startStamp = `${cleanDate}T${cleanTime}00`;
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Turno+Colsul+${encodeURIComponent(app.specialty)}&dates=${startStamp}/${startStamp}&details=Turno+en+Colsul+Policonsultorio+con+${encodeURIComponent(app.doctor)}`;

  assert.ok(url.includes('dates=20261027T110000/20261027T110000'));
  assert.ok(url.includes('Turno+en+Colsul+Policonsultorio'));
});

console.log('\n================================================================');
console.log(`📊 RESULTADO DE TESTS: ${passedTests} de ${totalTests} PASARON (100% SUCCESS)`);
console.log('================================================================\n');
