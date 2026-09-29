import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CreditCard, ArrowLeft, CheckCircle2, QrCode, Copy, Sparkles, MessageCircle, ShieldCheck, AlertTriangle, CalendarPlus, XCircle, ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react';
import { Appointment, ClinicScheduleConfig, DayOfWeek, Patient, Dentist } from '../types';
import { DEFAULT_CLINIC_SCHEDULE, getDayOfWeekKey, generateTimeSlotsFromSchedule } from '../data/mockData';

interface PatientBookingProps {
  onBackToMenu: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  onTriggerTicket?: (appointment: Appointment) => void;
  clinicSchedule?: ClinicScheduleConfig;
  appointments?: Appointment[];
  patients?: Patient[];
  onAddPatient?: (patient: Patient) => void;
  dentists?: Dentist[];
}

export const PatientBooking: React.FC<PatientBookingProps> = ({
  onBackToMenu,
  onAddAppointment,
  onTriggerTicket,
  clinicSchedule,
  appointments,
  patients,
  onAddPatient,
  dentists
}) => {
  const [step, setStep] = useState<'schedule' | 'details' | 'payment' | 'confirmed'>('schedule');
  
  // Selección de fecha y turno
  const [selectedSpecialty, setSelectedSpecialty] = useState('Consulta General & Diagnóstico');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const activeSchedule = clinicSchedule || DEFAULT_CLINIC_SCHEDULE;
  const currentDayKey = getDayOfWeekKey(selectedDate);
  const currentDaySchedule = activeSchedule[currentDayKey];
  const isDayOpen = currentDaySchedule?.isOpen ?? true;

  // Odontólogos activos disponibles
  const activeDentists = useMemo(() => {
    if (dentists && dentists.length > 0) {
      const act = dentists.filter(d => d.active);
      if (act.length > 0) return act;
    }
    return [
      { id: 'den-1', name: 'Dra. Amalia Merlo', licenseNumber: 'MP 45890', specialty: 'Ortodoncia & Operatoria', phone: '+54 9 11 4589-1234', email: 'dra.merlo@odontomerlo.com', active: true },
      { id: 'den-2', name: 'Dr. Fernando Ruiz', licenseNumber: 'MP 51203', specialty: 'Endodoncia & Cirugía', phone: '+54 9 11 6723-9988', email: 'dr.ruiz@odontomerlo.com', active: true }
    ];
  }, [dentists]);

  const [selectedDentistName, setSelectedDentistName] = useState(activeDentists[0]?.name || 'Dra. Amalia Merlo');

  // Almanaque visual interactivo state
  const todayObj = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(todayObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayObj.getMonth());

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Celdas del mes para el almanaque
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Domingo, 1 = Lunes...

    const todayStr = new Date().toISOString().split('T')[0];

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      const monthStr = String(viewMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateStr = `${viewYear}-${monthStr}-${dayStr}`;
      const dayKey = getDayOfWeekKey(dateStr);
      const schedule = activeSchedule[dayKey];
      const isOpen = schedule?.isOpen ?? false;
      const isPast = dateStr < todayStr;

      days.push({
        dayNum: d,
        dateStr,
        dayKey,
        schedule,
        isOpen,
        isPast
      });
    }

    return days;
  }, [viewYear, viewMonth, activeSchedule]);

  // Turnos ya ocupados en la fecha y con ese profesional
  const bookedSlotsForDateAndDentist = useMemo(() => {
    if (!appointments) return [];
    return appointments
      .filter(a => a.date === selectedDate && a.dentistName === selectedDentistName && a.status !== 'cancelado')
      .map(a => a.time);
  }, [appointments, selectedDate, selectedDentistName]);

  const availableTimeSlots = useMemo(() => {
    if (!isDayOpen) return [];
    return generateTimeSlotsFromSchedule(activeSchedule, selectedDate);
  }, [activeSchedule, selectedDate, isDayOpen]);

  const availableNonBookedSlots = useMemo(() => {
    return availableTimeSlots.filter(slot => !bookedSlotsForDateAndDentist.includes(slot));
  }, [availableTimeSlots, bookedSlotsForDateAndDentist]);

  const [selectedTime, setSelectedTime] = useState(availableNonBookedSlots[0] || availableTimeSlots[0] || '10:00');

  useEffect(() => {
    if (bookedSlotsForDateAndDentist.includes(selectedTime) || !availableTimeSlots.includes(selectedTime)) {
      if (availableNonBookedSlots.length > 0) {
        setSelectedTime(availableNonBookedSlots[0]);
      }
    }
  }, [selectedDate, selectedDentistName, bookedSlotsForDateAndDentist, availableTimeSlots, availableNonBookedSlots, selectedTime]);

  // Datos del paciente
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dni, setDni] = useState('');

  // Mercado Pago y Pago
  const [paymentOption, setPaymentOption] = useState<'senia' | 'total'>('senia');
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [newAppointmentId, setNewAppointmentId] = useState('');

  const specialties = [
    { id: 'odontologia', name: 'Odontología Integral', icon: '🦷', room: 1, price: 30000, senia: 12000 },
    { id: 'oftalmologia', name: 'Oftalmología & Refracción', icon: '👁️', room: 2, price: 35000, senia: 15000 },
    { id: 'cardiologia', name: 'Cardiología & ECG', icon: '❤️', room: 3, price: 40000, senia: 18000 },
    { id: 'pediatria', name: 'Pediatría & Control Infantil', icon: '👶', room: 4, price: 28000, senia: 10000 },
    { id: 'traumatologia', name: 'Traumatología & Ortopedia', icon: '🦴', room: 5, price: 35000, senia: 15000 },
    { id: 'dermatologia', name: 'Dermatología & Lunares', icon: '🔬', room: 6, price: 32000, senia: 12000 },
    { id: 'ginecologia', name: 'Ginecología & Obstetricia', icon: '🌸', room: 7, price: 35000, senia: 15000 },
    { id: 'clinica_medica', name: 'Clínica Médica / General', icon: '🩺', room: 8, price: 25000, senia: 10000 },
    { id: 'nutricion', name: 'Nutrición & Dietética', icon: '🥗', room: 9, price: 26000, senia: 10000 },
    { id: 'kinesiologia', name: 'Kinesiología & Fisioterapia', icon: '🏃', room: 10, price: 24000, senia: 9000 },
    { id: 'otorrinolaringologia', name: 'Otorrinolaringología (ORL)', icon: '👂', room: 2, price: 35000, senia: 15000 },
    { id: 'neumonologia', name: 'Neumonología & Espirometría', icon: '🫁', room: 3, price: 38000, senia: 16000 },
    { id: 'neurologia', name: 'Neurología Clínica', icon: '🧠', room: 5, price: 42000, senia: 18000 },
    { id: 'psicologia', name: 'Psicología & Salud Mental', icon: '💬', room: 8, price: 28000, senia: 10000 },
    { id: 'urologia', name: 'Urología & Próstata', icon: '💧', room: 7, price: 38000, senia: 16000 },
  ];

  const currentSpecialtyObj = specialties.find(s => s.name === selectedSpecialty) || specialties[0];
  const amountToPay = paymentOption === 'senia' ? currentSpecialtyObj.senia : currentSpecialtyObj.price;

  const handleCopyAlias = () => {
    navigator.clipboard.writeText('COLSUL.POLICONSULTORIO.MP');
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2500);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      const generatedId = 'app-online-' + Date.now();
      setNewAppointmentId(generatedId);

      // Comprobar si el paciente ya existe en la base de datos por DNI o teléfono
      let targetPatientId = 'pat-' + Date.now();
      const cleanDni = dni.trim().replace(/\./g, '');
      const existingPatient = (patients || []).find(p => 
        (p.dni && p.dni.replace(/\./g, '') === cleanDni) ||
        (p.phone && p.phone.replace(/[^0-9]/g, '') === telefono.trim().replace(/[^0-9]/g, ''))
      );

      if (existingPatient) {
        targetPatientId = existingPatient.id;
      } else if (onAddPatient) {
        // Registrar automáticamente nuevo paciente para que aparezca en la ficha del consultorio
        const newPatient: Patient = {
          id: targetPatientId,
          name: nombre.trim(),
          dni: dni.trim(),
          age: 30,
          phone: telefono.trim(),
          email: '',
          healthInsurance: 'Particular',
          insuranceNumber: '',
          medicalHistory: 'Paciente registrado automáticamente vía reserva online.',
          allergies: 'Sin alergias registradas',
          odontogramFindings: [],
          notes: `Registrado vía online (${selectedSpecialty}). Seña/Pago: Mercado Pago.`
        };
        onAddPatient(newPatient);
      }

      const newApp: Appointment = {
        id: generatedId,
        patientId: targetPatientId,
        patientName: nombre.trim(),
        patientPhone: telefono.trim(),
        dentistName: selectedDentistName,
        date: selectedDate,
        time: selectedTime,
        specialty: selectedSpecialty,
        status: 'confirmado',
        origin: 'online',
        paymentStatus: paymentOption === 'senia' ? 'seña_abonada' : 'total_abonado',
        dni: dni.trim(),
        notes: `Turno reservado online por el paciente. Pago acreditado vía Mercado Pago (${paymentOption === 'senia' ? 'Seña abonada: $' + amountToPay.toLocaleString('es-AR') : 'Pago total: $' + amountToPay.toLocaleString('es-AR')}). DNI: ${dni.trim()}`
      };

      onAddAppointment(newApp);
      if (onTriggerTicket) {
        onTriggerTicket(newApp);
      }
      setIsProcessingPayment(false);
      setStep('confirmed');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Header */}
      <header className="px-6 py-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto w-full justify-between">
          <button
            onClick={onBackToMenu}
            className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-teal-400 transition-colors bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Menú</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
              🏥
            </div>
            <span className="font-extrabold text-white tracking-tight hidden sm:inline">Colsul</span>
            <span className="text-xs text-sky-400 font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
              Turnos Online · 15 Especialidades
            </span>
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col justify-center">

        {/* PASO 1: SELECCIÓN DE FECHA Y HORARIO */}
        {step === 'schedule' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl animate-fade-in">
            <div className="mb-6 space-y-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">Paso 1 de 3</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Selecciona tu Turno</h2>
                <p className="text-slate-400 text-sm mt-1">Elige la especialidad y el horario que más te convenga.</p>
              </div>

              {/* Banner Horarios de Atención del Consultorio */}
              <div className="bg-slate-950/80 border border-teal-500/30 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 font-extrabold text-teal-300 uppercase tracking-wider text-[11px]">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span>Días y Horarios de Atención del Consultorio:</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as DayOfWeek[]).map(dk => {
                    const ds = activeSchedule[dk];
                    if (!ds) return null;
                    return (
                      <span
                        key={dk}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          ds.isOpen
                            ? 'bg-teal-950/60 text-teal-200 border-teal-500/30'
                            : 'bg-slate-900/60 text-slate-500 border-slate-800'
                        }`}
                      >
                        {ds.label}: {ds.isOpen ? (ds.hasSplitShift ? `${ds.startTime} a ${ds.endTime} / ${ds.startTime2 || '16:00'} a ${ds.endTime2 || '20:00'} hs` : `${ds.startTime} a ${ds.endTime} hs`) : 'Cerrado'}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Especialidades */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-slate-300 tracking-wider mb-2">Especialidad u Odontología:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specialties.map(spec => (
                  <div
                    key={spec.id}
                    onClick={() => setSelectedSpecialty(spec.name)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedSpecialty === spec.name
                        ? 'border-sky-500 bg-sky-500/15 text-white ring-2 ring-sky-500/30'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm">{spec.name}</div>
                    <div className="text-xs text-slate-400 mt-1 flex justify-between">
                      <span>Valor: ${spec.price.toLocaleString('es-AR')}</span>
                      <span className="text-sky-400 font-semibold">Seña: ${spec.senia.toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profesional Odontólogo/a Tratante */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-slate-300 tracking-wider mb-2 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span>Profesional Odontólogo/a Tratante:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeDentists.map(dentist => (
                  <div
                    key={dentist.id}
                    onClick={() => setSelectedDentistName(dentist.name)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedDentistName === dentist.name
                        ? 'border-teal-400 bg-teal-500/15 text-white ring-2 ring-teal-500/30'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-white">{dentist.name}</div>
                      <div className="text-xs text-slate-400">{dentist.specialty} — {dentist.licenseNumber}</div>
                    </div>
                    {selectedDentistName === dentist.name && (
                      <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ALMANAQUE VISUAL INTERACTIVO (Calendario de Selección de Fecha) */}
            <div className="mb-6 bg-slate-950/90 border border-slate-800 rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800 flex-wrap gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Almanaque de Turnos: <span className="text-sky-400 capitalize">{monthNames[viewMonth]} {viewYear}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">Selecciona un día en el calendario para desplegar los horarios disponibles.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Mes Ant.</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
                  >
                    <span>Mes Sig.</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cabecera Días de la Semana */}
              <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                  <div key={d} className="text-[11px] font-black uppercase text-slate-400 py-1.5 bg-slate-900/50 rounded-lg">
                    {d}
                  </div>
                ))}
              </div>

              {/* Grilla de Días del Almanaque */}
              <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.map((item, idx) => {
                  if (!item) return <div key={`empty-${idx}`} className="h-14" />;

                  const { dayNum, dateStr, isOpen, isPast, schedule } = item;
                  const isSelected = selectedDate === dateStr;

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      disabled={isPast || !isOpen}
                      onClick={() => {
                        setSelectedDate(dateStr);
                        const slots = generateTimeSlotsFromSchedule(activeSchedule, dateStr);
                        if (slots.length > 0) setSelectedTime(slots[0]);
                      }}
                      className={`h-14 rounded-2xl border flex flex-col items-center justify-center transition-all relative p-1 ${
                        isSelected
                          ? 'bg-gradient-to-b from-sky-500 to-teal-500 border-sky-300 text-white shadow-lg shadow-sky-500/30 ring-2 ring-sky-300 scale-105 z-10 font-black'
                          : !isOpen || isPast
                          ? 'bg-slate-900/40 border-slate-850 text-slate-600 opacity-40 cursor-not-allowed'
                          : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-sky-500/60 hover:bg-slate-800/90 cursor-pointer font-extrabold'
                      }`}
                    >
                      <span className="text-sm leading-none">{dayNum}</span>
                      <span className={`text-[9px] font-extrabold tracking-tighter mt-1 px-1 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : !isOpen
                          ? 'text-red-400/80'
                          : isPast
                          ? 'text-slate-600'
                          : 'text-teal-400'
                      }`}>
                        {!isOpen ? 'Cerrado' : isPast ? 'Pasado' : schedule?.hasSplitShift ? `${schedule.startTime}-${schedule.endTime2}` : `${schedule.startTime}`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Leyenda y Fecha Seleccionada */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Seleccionado
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span> Abierto
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span> Cerrado / Pasado
                  </span>
                </div>

                <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-200 font-bold text-xs flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Fecha seleccionada: <strong className="text-sky-300">{selectedDate.split('-').reverse().join('/')}</strong> ({currentDaySchedule?.label})</span>
                </div>
              </div>
            </div>

            {/* Horarios disponibles */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase text-slate-300 tracking-wider">
                  Horarios para {currentDaySchedule?.label} con {selectedDentistName}:
                </label>
                <span className="text-[11px] text-teal-400 font-semibold">
                  {availableNonBookedSlots.length} de {availableTimeSlots.length} disponibles
                </span>
              </div>

              {isDayOpen && availableTimeSlots.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {availableTimeSlots.map(time => {
                      const isBooked = bookedSlotsForDateAndDentist.includes(time);
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2.5 px-3 rounded-xl font-bold text-sm border transition-all flex flex-col items-center justify-center ${
                            isBooked
                              ? 'bg-slate-900/60 border-red-900/30 text-red-400/50 cursor-not-allowed opacity-50'
                              : isSelected
                              ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/25 ring-2 ring-sky-300'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <span>{time} hs</span>
                          {isBooked && (
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-red-400 mt-0.5">
                              Ocupado
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {availableNonBookedSlots.length === 0 && (
                    <div className="mt-3 bg-red-950/40 border border-red-800/60 rounded-xl p-3 text-xs text-red-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Todos los turnos de este día para <strong>{selectedDentistName}</strong> ya están ocupados. Por favor selecciona otra fecha u otro profesional.</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center text-xs text-slate-400 italic">
                  No hay horarios de atención configurados para la fecha seleccionada.
                </div>
              )}
            </div>

            <button
              disabled={!isDayOpen || availableNonBookedSlots.length === 0 || bookedSlotsForDateAndDentist.includes(selectedTime)}
              onClick={() => setStep('details')}
              className={`w-full py-4 font-extrabold text-base rounded-2xl transition-all shadow-xl flex items-center justify-center space-x-2 ${
                isDayOpen && availableNonBookedSlots.length > 0 && !bookedSlotsForDateAndDentist.includes(selectedTime)
                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white shadow-sky-500/25 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <span>Continuar con Mis Datos</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>
        )}

        {/* PASO 2: REGISTRO DE DATOS DEL PACIENTE */}
        {step === 'details' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl animate-fade-in">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">Paso 2 de 3</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Tus Datos de Contacto</h2>
                <p className="text-slate-400 text-sm mt-1">Para confirmar la reserva y enviarte el recordatorio.</p>
              </div>
              <button
                onClick={() => setStep('schedule')}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Cambiar Fecha
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (nombre && telefono && dni) setStep('payment'); }}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Nombre y Apellido *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Ej: Juan Pérez"
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Teléfono / WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 11 2345-6789"
                      value={telefono}
                      onChange={e => setTelefono(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">DNI *</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Ej: 35.890.123"
                      value={dni}
                      onChange={e => setDni(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Resumen breve */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-6 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-sky-400">Resumen del Turno:</div>
                <div><strong>Especialidad:</strong> {selectedSpecialty}</div>
                <div><strong>Fecha y Hora:</strong> {selectedDate} a las {selectedTime} hs</div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('schedule')}
                  className="w-1/3 py-3.5 bg-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-700 text-sm"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2"
                >
                  <span>Ir al Pago con Mercado Pago</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PASO 3: PAGO CON MERCADO PAGO */}
        {step === 'payment' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl animate-fade-in">
            <div className="mb-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">Paso 3 de 3</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
                <span>Pago con Mercado Pago</span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  Verificado 💙
                </span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">Realiza la seña o pago total para reservar tu turno en la agenda.</p>
            </div>

            {/* Opciones de pago: Seña o Total */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div
                onClick={() => setPaymentOption('senia')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentOption === 'senia'
                    ? 'border-sky-500 bg-sky-500/15 text-white ring-2 ring-sky-500/30'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="text-xs font-bold text-sky-400">Abonar Seña (Recomendado)</div>
                <div className="text-xl font-black text-white mt-1">${currentSpecialtyObj.senia.toLocaleString('es-AR')}</div>
                <div className="text-[11px] text-slate-400 mt-1">El resto se abona en el consultorio</div>
              </div>

              <div
                onClick={() => setPaymentOption('total')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentOption === 'total'
                    ? 'border-sky-500 bg-sky-500/15 text-white ring-2 ring-sky-500/30'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="text-xs font-bold text-teal-400">Abonar Pago Total</div>
                <div className="text-xl font-black text-white mt-1">${currentSpecialtyObj.price.toLocaleString('es-AR')}</div>
                <div className="text-[11px] text-slate-400 mt-1">100% del tratamiento congelado</div>
              </div>
            </div>

            {/* Datos de transferencia de Mercado Pago */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-black">
                    MP
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Mercado Pago / CVU</div>
                    <div className="text-[11px] text-slate-400">Odonto Merlo Centro Odontológico</div>
                  </div>
                </div>
                <QrCode className="w-6 h-6 text-sky-400" />
              </div>

              {/* Alias Mercado Pago */}
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Alias Mercado Pago</div>
                  <div className="text-sm font-extrabold text-sky-300 tracking-wider">ODONTO.MERLO.MP</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAlias}
                  className="px-3 py-1.5 bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedAlias ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* CBU / CVU */}
              <div className="text-xs text-slate-400 space-y-1">
                <div><strong>CVU Mercado Pago:</strong> 0000003100045891234567</div>
                <div><strong>Monto a transferir:</strong> <span className="text-white font-bold">${amountToPay.toLocaleString('es-AR')}</span></div>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-1/3 py-4 bg-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-700 text-sm"
                >
                  Atrás
                </button>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-2/3 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Verificando Pago...</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Confirmar Reserva y Pago</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PASO 4: CONFIRMACIÓN EXITOSA */}
        {step === 'confirmed' && (
          <div className="bg-slate-900/90 border border-teal-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-xl shadow-teal-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">¡Reserva Exitosa!</span>
            <h2 className="text-3xl font-extrabold text-white mt-1 mb-2">¡Tu turno ha sido reservado!</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
              Hola <strong className="text-white">{nombre}</strong>, tu cita ha sido registrada exitosamente en la agenda del consultorio.
            </p>

            {/* Tarjeta de comprobante */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 max-w-md mx-auto text-left mb-6 text-xs text-slate-300 space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Código de Turno:</span>
                <span className="font-mono font-bold text-teal-300">{newAppointmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Especialidad:</span>
                <span className="font-bold text-white">{selectedSpecialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fecha y Hora:</span>
                <span className="font-bold text-white">{selectedDate} - {selectedTime} hs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paciente:</span>
                <span className="font-bold text-white">{nombre} (DNI: {dni})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Teléfono:</span>
                <span className="font-bold text-white">{telefono}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-teal-400 font-bold">
                <span>Estado de Pago:</span>
                <span>Mercado Pago Acreditado</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 max-w-md mx-auto">
              <a
                href={`https://wa.me/5491178295317?text=Hola%20OdontoMerlo,%20acabo%20de%20reservar%20mi%20turno%20para%20el%20${selectedDate}%20a%20las%20${selectedTime}%20hs.%20Nombre:%20${encodeURIComponent(nombre)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar Comprobante por WhatsApp</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Turno+Odontologico+${encodeURIComponent(selectedSpecialty)}&dates=${selectedDate.replace(/-/g, '')}T${selectedTime.replace(':', '')}00/${selectedDate.replace(/-/g, '')}T${selectedTime.replace(':', '')}00&details=Turno+Odontologico+en+OdontoMerlo+con+la+Dra.+Amalia+Merlo`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Agendar en Google Calendar</span>
                </a>

                <a
                  href={`https://wa.me/5491178295317?text=Hola%20OdontoMerlo,%20te%20escribo%20por%20un%20imprevisto%20con%20mi%20turno%20del%20${selectedDate}%20a%20las%20${selectedTime}%20hs.%20Nombre:%20${encodeURIComponent(nombre)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Avisar Imprevisto</span>
                </a>
              </div>

              <button
                onClick={onBackToMenu}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all border border-slate-800"
              >
                Volver al Menú Principal
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer AURA */}
      <footer className="py-6 px-6 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Colsul Policonsultorio Médico © 2026</span>
          <div className="text-slate-400 font-medium flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>© 2026 Aura. Todos los derechos reservados. Startup Aura por Omar Horacio Adamo.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
