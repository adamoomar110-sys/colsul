import React, { useState, useMemo, useEffect } from 'react';
import { Appointment, Patient, AppointmentStatus, ClinicScheduleConfig, Dentist, AppointmentOrigin, MedicalSpecialty } from '../types';
import { SPECIALTIES_LIST } from '../data/specialtiesData';
import { 
  Calendar, Clock, Plus, Search, CheckCircle, XCircle, AlertCircle, 
  MessageSquare, User, Filter, Phone, AlertTriangle, Sparkles, Globe, 
  Building2, CreditCard, UserPlus, Stethoscope, ChevronRight 
} from 'lucide-react';
import { DEFAULT_CLINIC_SCHEDULE, getDayOfWeekKey, generateTimeSlotsFromSchedule } from '../data/mockData';

interface AppointmentsProps {
  appointments: Appointment[];
  patients: Patient[];
  onAddAppointment: (newApp: Appointment) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onTriggerTicket?: (app: Appointment) => void;
  clinicSchedule?: ClinicScheduleConfig;
  dentists?: Dentist[];
  onAddPatient?: (newPatient: Patient) => void;
}

export const Appointments: React.FC<AppointmentsProps> = ({
  appointments,
  patients,
  onAddAppointment,
  onUpdateStatus,
  onTriggerTicket,
  clinicSchedule,
  dentists,
  onAddPatient
}) => {
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [filterOrigin, setFilterOrigin] = useState<string>('todos'); // 'todos' | 'online' | 'consultorio'
  const [filterDentist, setFilterDentist] = useState<string>('todos');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('todos');
  const [filterRoom, setFilterRoom] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const activeSchedule = clinicSchedule || DEFAULT_CLINIC_SCHEDULE;

  // Médicos y especialistas activos
  const activeDentists = useMemo(() => {
    if (dentists && dentists.length > 0) {
      const act = dentists.filter(d => d.active);
      if (act.length > 0) return act;
    }
    return SPECIALTIES_LIST.map((spec, i) => ({
      id: `doc-${i + 1}`,
      name: spec.defaultDoctor,
      licenseNumber: `MP ${40000 + i * 231}`,
      specialty: spec.name,
      roomNumber: spec.defaultRoom,
      phone: '+54 9 11 4589-1234',
      email: `${spec.id}@colsul.com`,
      active: true
    }));
  }, [dentists]);

  // Form State
  const [isNewPatient, setIsNewPatient] = useState<boolean>(false);
  const [newPatientName, setNewPatientName] = useState<string>('');
  const [newPatientDni, setNewPatientDni] = useState<string>('');
  const [newPatientPhone, setNewPatientPhone] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(SPECIALTIES_LIST[0].id);
  const [roomNumber, setRoomNumber] = useState<number>(SPECIALTIES_LIST[0].defaultRoom);
  const [dentistName, setDentistName] = useState<string>(activeDentists[0]?.name || 'Dra. Amalia Merlo');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Al cambiar especialidad, actualizar médico y consultorio sugerido
  const handleSelectSpecialtyChange = (specId: string) => {
    setSelectedSpecialty(specId);
    const specMeta = SPECIALTIES_LIST.find(s => s.id === specId);
    if (specMeta) {
      setRoomNumber(specMeta.defaultRoom);
      setSpecialty(specMeta.name);
      const matchingDoc = activeDentists.find(d => d.name === specMeta.defaultDoctor || d.specialty.toLowerCase().includes(specMeta.name.toLowerCase()));
      if (matchingDoc) {
        setDentistName(matchingDoc.name);
      }
    }
  };

  const currentDayKey = getDayOfWeekKey(date);
  const currentDaySchedule = activeSchedule[currentDayKey];
  const isDayOpen = currentDaySchedule?.isOpen ?? true;

  const availableTimeSlots = useMemo(() => {
    if (!isDayOpen) return [];
    return generateTimeSlotsFromSchedule(activeSchedule, date);
  }, [activeSchedule, date, isDayOpen]);

  // Turnos ya ocupados para el día y profesional seleccionado
  const bookedAppointmentsForDentistAndDate = useMemo(() => {
    return appointments.filter(a => a.date === date && a.dentistName === dentistName && a.status !== 'cancelado');
  }, [appointments, date, dentistName]);

  const bookedSlotsList = useMemo(() => {
    return bookedAppointmentsForDentistAndDate.map(a => a.time);
  }, [bookedAppointmentsForDentistAndDate]);

  const [time, setTime] = useState<string>(availableTimeSlots[0] || '10:00');
  const [specialty, setSpecialty] = useState<string>(SPECIALTIES_LIST[0].name);
  const [notes, setNotes] = useState<string>('');

  // Ajustar hora al cambiar fecha o dentista si la seleccionada está ocupada
  useEffect(() => {
    if (availableTimeSlots.length > 0) {
      if (bookedSlotsList.includes(time) || !availableTimeSlots.includes(time)) {
        const firstFree = availableTimeSlots.find(s => !bookedSlotsList.includes(s));
        if (firstFree) {
          setTime(firstFree);
        } else {
          setTime(availableTimeSlots[0]);
        }
      }
    }
  }, [date, dentistName, availableTimeSlots, bookedSlotsList]);

  // Filtrado de Turnos
  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = app.patientName.toLowerCase().includes(q) || 
                            app.dentistName.toLowerCase().includes(q) ||
                            (app.dni && app.dni.includes(q)) ||
                            (app.notes && app.notes.toLowerCase().includes(q));
      
      const matchesStatus = filterStatus === 'todos' || app.status === filterStatus;
      const matchesDate = !filterDate || app.date === filterDate;
      const matchesOrigin = filterOrigin === 'todos' || (app.origin || 'consultorio') === filterOrigin;
      const matchesDentist = filterDentist === 'todos' || app.dentistName === filterDentist;
      const matchesSpecialty = filterSpecialty === 'todos' || 
                               app.specialty.toLowerCase().includes(filterSpecialty.toLowerCase()) ||
                               (SPECIALTIES_LIST.find(s => s.id === filterSpecialty)?.name.toLowerCase() === app.specialty.toLowerCase());
      const matchesRoom = filterRoom === 'todos' || String(app.roomNumber || '') === filterRoom;

      return matchesSearch && matchesStatus && matchesDate && matchesOrigin && matchesDentist && matchesSpecialty && matchesRoom;
    });
  }, [appointments, searchQuery, filterStatus, filterDate, filterOrigin, filterDentist, filterSpecialty, filterRoom]);

  // Estadísticas rápidas
  const stats = useMemo(() => {
    const total = appointments.length;
    const online = appointments.filter(a => a.origin === 'online').length;
    const consultorio = appointments.filter(a => !a.origin || a.origin === 'consultorio').length;
    const confirmados = appointments.filter(a => a.status === 'confirmado').length;
    return { total, online, consultorio, confirmados };
  }, [appointments]);


  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    if (bookedSlotsList.includes(time)) {
      alert(`El horario ${time} hs ya está reservado para ${dentistName}. Por favor elija otro horario.`);
      return;
    }

    let finalPatientId = selectedPatientId;
    let finalPatientName = '';
    let finalPatientPhone = '';
    let finalPatientDni = '';

    if (isNewPatient) {
      if (!newPatientName.trim()) return;
      const generatedPatId = 'pat-' + Date.now();
      finalPatientId = generatedPatId;
      finalPatientName = newPatientName.trim();
      finalPatientPhone = newPatientPhone.trim();
      finalPatientDni = newPatientDni.trim();

      if (onAddPatient) {
        const newPatient: Patient = {
          id: generatedPatId,
          name: finalPatientName,
          dni: finalPatientDni,
          age: 30,
          phone: finalPatientPhone,
          email: '',
          healthInsurance: 'Particular',
          insuranceNumber: '',
          medicalHistory: 'Alta rápida en recepción al agendar turno.',
          allergies: 'Sin alergias registradas',
          odontogramFindings: [],
          notes: 'Paciente creado desde recepción del consultorio.'
        };
        onAddPatient(newPatient);
      }
    } else {
      const patientObj = patients.find(p => p.id === selectedPatientId);
      if (!patientObj) return;
      finalPatientId = patientObj.id;
      finalPatientName = patientObj.name;
      finalPatientPhone = patientObj.phone;
      finalPatientDni = patientObj.dni;
    }

    const newApp: Appointment = {
      id: 'app-' + Date.now(),
      patientId: finalPatientId,
      patientName: finalPatientName,
      patientPhone: finalPatientPhone,
      dentistName,
      date,
      time,
      specialty,
      roomNumber,
      status: 'confirmado',
      origin: 'consultorio',
      paymentStatus: 'pendiente',
      dni: finalPatientDni,
      notes: notes.trim() ? notes.trim() : 'Agendado en consultorio por recepción'
    };

    onAddAppointment(newApp);
    if (onTriggerTicket) {
      onTriggerTicket(newApp);
    }

    setShowModal(false);
    setNotes('');
    setIsNewPatient(false);
    setNewPatientName('');
    setNewPatientDni('');
    setNewPatientPhone('');
  };

  const generateWhatsAppMessage = (app: Appointment) => {
    const text = `Hola ${app.patientName}, te recordamos tu turno en *Odonto Merlo* el día ${app.date} a las ${app.time} hs con ${app.dentistName} (${app.specialty}). Por favor confirma tu asistencia respondiendo a este mensaje. ¡Te esperamos!`;
    const encoded = encodeURIComponent(text);
    const cleanPhone = app.patientPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const generateWhatsAppImprevistoMessage = (app: Appointment) => {
    const text = `Hola ${app.patientName}, te contactamos desde *Odonto Merlo* por un imprevisto de fuerza mayor con tu turno del día ${app.date} a las ${app.time} hs (${app.specialty}). Nos gustaría reprogramar tu cita. Por favor dinos qué horario te queda cómodo. ¡Muchas gracias!`;
    const encoded = encodeURIComponent(text);
    const cleanPhone = app.patientPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmado':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"><CheckCircle className="w-3.5 h-3.5" /> Confirmado</span>;
      case 'pendiente':
        return <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"><Clock className="w-3.5 h-3.5" /> Pendiente</span>;
      case 'atendido':
        return <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"><CheckCircle className="w-3.5 h-3.5" /> Atendido</span>;
      case 'cancelado':
        return <span className="bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"><XCircle className="w-3.5 h-3.5" /> Cancelado</span>;
    }
  };

  const getOriginBadge = (origin?: AppointmentOrigin) => {
    if (origin === 'online') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-800 border border-sky-300 shadow-sm" title="Turno tomado por el paciente a través de la App Online">
          <Globe className="w-3 h-3 text-sky-600" />
          <span>App Online</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-100 text-teal-800 border border-teal-300 shadow-sm" title="Turno asignado presencialmente o por secretaría en el consultorio">
        <Building2 className="w-3 h-3 text-teal-600" />
        <span>Consultorio</span>
      </span>
    );
  };

  const getPaymentBadge = (app: Appointment) => {
    if (app.paymentStatus === 'seña_abonada') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CreditCard className="w-3 h-3 text-emerald-600" />
          <span>Seña MP Abonada</span>
        </span>
      );
    }
    if (app.paymentStatus === 'total_abonado') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span>Pago Total MP</span>
        </span>
      );
    }
    if (app.paymentStatus === 'efectivo_consultorio') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
          <span>Abonado en Clínica</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
        <span>Cobro en Clínica</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-teal-600" />
              Agenda y Registro de Turnos
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Gestión integral de turnos tomados por clientes desde la <strong>App Online</strong> y citas otorgadas en el <strong>Consultorio</strong>.
          </p>
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            setIsNewPatient(false);
          }}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Agendar Nuevo Turno en Consultorio
        </button>
      </div>

      {/* Mini Tarjetas de Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold block">Total de Turnos</span>
            <strong className="text-2xl font-extrabold text-slate-900">{stats.total}</strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-sky-800 font-bold block">Desde App Online</span>
            <strong className="text-2xl font-extrabold text-sky-900">{stats.online}</strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-sm">
            <Globe className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-teal-800 font-bold block">En Consultorio</span>
            <strong className="text-2xl font-extrabold text-teal-900">{stats.consultorio}</strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-800 font-bold block">Confirmados</span>
            <strong className="text-2xl font-extrabold text-emerald-900">{stats.confirmados}</strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por paciente, DNI, odontólogo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Filtro de Canal / Origen */}
        <div className="flex items-center gap-1.5">
          <select
            value={filterOrigin}
            onChange={(e) => setFilterOrigin(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-semibold text-slate-700 cursor-pointer"
          >
            <option value="todos">Todos los Canales</option>
            <option value="online">🌐 Solo App Online (Pacientes)</option>
            <option value="consultorio">🏥 Solo Consultorio (Recepción)</option>
          </select>
        </div>

        {/* Filtro de Especialidad */}
        <div className="flex items-center gap-1.5">
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-semibold text-slate-700 cursor-pointer"
          >
            <option value="todos">Todas las Especialidades (15)</option>
            {SPECIALTIES_LIST.map(s => (
              <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
            ))}
          </select>
        </div>

        {/* Filtro de Consultorio */}
        <div className="flex items-center gap-1.5">
          <select
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-semibold text-slate-700 cursor-pointer"
          >
            <option value="todos">Todos los Consultorios (1-10)</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(r => (
              <option key={r} value={String(r)}>Consultorio #{r}</option>
            ))}
          </select>
        </div>

        {/* Filtro de Odontólogo */}
        <div className="flex items-center gap-1.5">
          <select
            value={filterDentist}
            onChange={(e) => setFilterDentist(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-semibold text-slate-700 cursor-pointer"
          >
            <option value="todos">Todos los Profesionales</option>
            {activeDentists.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Filtro de Fecha */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          {filterDate && (
            <button onClick={() => setFilterDate('')} className="text-xs text-teal-600 hover:underline font-bold px-1">
              ✕
            </button>
          )}
        </div>

        {/* Filtro de Estado */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-semibold text-slate-700 cursor-pointer"
        >
          <option value="todos">Todos los Estados</option>
          <option value="confirmado">Confirmado</option>
          <option value="pendiente">Pendiente</option>
          <option value="atendido">Atendido</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-600">No se encontraron turnos con los filtros seleccionados.</p>
            <p className="text-xs mt-1">Prueba cambiando los filtros o agenda un nuevo turno.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map((app) => (
              <div key={app.id} className="p-5 hover:bg-slate-50/80 transition flex flex-wrap items-center justify-between gap-4">
                
                <div className="flex items-start space-x-4 min-w-[280px]">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-teal-200 shadow-sm">
                    <span className="text-base leading-none font-black">{app.time}</span>
                    <span className="text-[10px] text-teal-700 font-semibold uppercase mt-0.5">{app.date.split('-').reverse().slice(0, 2).join('/')}</span>
                    <span className="text-[9px] text-teal-600 font-mono leading-none mt-0.5">{app.date.split('-')[0]}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-slate-900 text-base">
                        {app.patientName}
                      </h4>
                      {app.dni && (
                        <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                          DNI: {app.dni}
                        </span>
                      )}
                      {getOriginBadge(app.origin)}
                      {getPaymentBadge(app)}
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-1 flex-wrap">
                      <User className="w-3.5 h-3.5 text-slate-400" /> 
                      <span className="font-semibold text-slate-700">{app.dentistName}</span>
                      <span className="text-slate-300">|</span>
                      <span className="font-semibold text-teal-700">{app.specialty}</span>
                      {app.roomNumber && (
                        <span className="bg-teal-50 text-teal-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-teal-200">
                          Consultorio #{app.roomNumber}
                        </span>
                      )}
                      {app.patientPhone && (
                        <>
                          <span className="text-slate-300">|</span>
                          <span className="flex items-center gap-1 text-slate-600 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" /> {app.patientPhone}
                          </span>
                        </>
                      )}
                    </p>

                    {app.notes && (
                      <p className="text-xs text-slate-600 mt-1.5 italic bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80 inline-block">
                        "{app.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-wrap gap-2">
                  {getStatusBadge(app.status)}

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => generateWhatsAppMessage(app)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200 flex items-center gap-1 text-xs font-bold cursor-pointer"
                      title="Enviar recordatorio por WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Recordatorio</span>
                    </button>

                    <button
                      onClick={() => generateWhatsAppImprevistoMessage(app)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 transition border border-amber-200 flex items-center gap-1 text-xs font-bold cursor-pointer"
                      title="Avisar imprevisto o reprogramación por WhatsApp"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span className="hidden sm:inline">Imprevisto</span>
                    </button>

                    <select
                      value={app.status}
                      onChange={(e) => onUpdateStatus(app.id, e.target.value as AppointmentStatus)}
                      className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmado">Confirmar</option>
                      <option value="atendido">Atendido</option>
                      <option value="cancelado">Cancelar</option>
                    </select>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Agendar Turno en Consultorio */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Agendar Turno en Consultorio</h3>
                  <p className="text-[11px] text-teal-100">Registro presencial o telefónico por secretaría</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-teal-200 hover:text-white font-bold text-xl p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-6 space-y-4">
              
              {/* Selector de tipo de paciente: Registrado vs Nuevo */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsNewPatient(false)}
                  className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    !isNewPatient ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Paciente Registrado ({patients.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewPatient(true)}
                  className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isNewPatient ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 text-teal-600" />
                  <span>➕ Dar de Alta Nuevo Paciente</span>
                </button>
              </div>

              {/* Campos de Paciente */}
              {!isNewPatient ? (
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Seleccionar Paciente:</label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white cursor-pointer"
                    required
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} — DNI: {p.dni} ({p.healthInsurance})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-3 bg-teal-50/60 p-4 rounded-2xl border border-teal-200">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-teal-900">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Datos para ficha del nuevo paciente:</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Martín Gómez"
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-teal-300 focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">DNI *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. 34.567.890"
                        value={newPatientDni}
                        onChange={(e) => setNewPatientDni(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-teal-300 focus:ring-2 focus:ring-teal-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Teléfono / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej. +54 9 11 2345-6789"
                        value={newPatientPhone}
                        onChange={(e) => setNewPatientPhone(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-teal-300 focus:ring-2 focus:ring-teal-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Especialidad, Consultorio y Profesional */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Especialidad:</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => handleSelectSpecialtyChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {SPECIALTIES_LIST.map(s => (
                      <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Consultorio:</label>
                  <select
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(r => (
                      <option key={r} value={r}>Consultorio #{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Profesional:</label>
                  <select
                    value={dentistName}
                    onChange={(e) => setDentistName(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {activeDentists.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fecha y Hora con detección de Ocupados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Fecha:</label>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isDayOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {currentDaySchedule?.label}: {isDayOpen ? 'Abierto' : 'Cerrado'}
                    </span>
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none ${
                      isDayOpen ? 'border-slate-300 bg-white' : 'border-red-400 bg-red-50 text-red-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase">
                      Horario:
                    </label>
                    <span className="text-[10px] font-bold text-teal-700">
                      {availableTimeSlots.length - bookedSlotsList.length} libres
                    </span>
                  </div>

                  {isDayOpen && availableTimeSlots.length > 0 ? (
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white cursor-pointer"
                      required
                    >
                      {availableTimeSlots.map(slot => {
                        const isBooked = bookedSlotsList.includes(slot);
                        const bookedApp = bookedAppointmentsForDentistAndDate.find(a => a.time === slot);
                        return (
                          <option 
                            key={slot} 
                            value={slot} 
                            disabled={isBooked}
                            className={isBooked ? 'text-red-500 bg-red-50 font-bold' : 'text-slate-800 font-semibold'}
                          >
                            {slot} hs {isBooked ? `⛔ (Ocupado: ${bookedApp?.patientName})` : '✓ Disponible'}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value="Consultorio Cerrado"
                      className="w-full px-3 py-2 rounded-xl border border-red-300 text-xs font-bold text-red-700 bg-red-50"
                    />
                  )}
                </div>
              </div>

              {/* Alerta si el horario seleccionado está ocupado */}
              {bookedSlotsList.includes(time) && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>El horario <strong>{time} hs</strong> ya está tomado por otro turno. Por favor elija un horario marcado como disponible.</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Observaciones / Indicaciones:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles sobre el procedimiento, antecedentes relevantes o pago presencial..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!isDayOpen || bookedSlotsList.includes(time)}
                  className={`px-5 py-2 text-sm font-bold text-white rounded-xl shadow-md transition flex items-center gap-1.5 ${
                    isDayOpen && !bookedSlotsList.includes(time)
                      ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer'
                      : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Registrar Turno en Consultorio</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
