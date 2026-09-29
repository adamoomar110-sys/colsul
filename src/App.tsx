import React, { useState, useEffect } from 'react';
import { ActiveTab, Navbar } from './components/Navbar';
import { Odontogram } from './components/Odontogram';
import { SpecialtyRecordHub } from './components/specialties/SpecialtyRecordHub';
import { Appointments } from './components/Appointments';
import { Patients } from './components/Patients';
import { Budgets } from './components/Budgets';
import { Settings } from './components/Settings';
import { Footer } from './components/Footer';
import { IntroScreen } from './components/IntroScreen';
import { MainMenu } from './components/MainMenu';
import { PatientBooking } from './components/PatientBooking';
import { Login } from './components/Login';
import { Registro } from './components/Registro';
import { NewAppointmentTicket } from './components/NewAppointmentTicket';
import { INITIAL_PATIENTS, INITIAL_APPOINTMENTS, INITIAL_BUDGETS, CONDITION_METAS, DEFAULT_CLINIC_SCHEDULE } from './data/mockData';
import { SPECIALTIES_LIST, DEFAULT_PATIENT_SPECIALTIES } from './data/specialtiesData';
import { Patient, Appointment, Budget, ToothFinding, AppointmentStatus, Dentist, ConditionType, ClinicalEvolution, ClinicScheduleConfig } from './types';
import { Calendar, Users, LogOut, Building2, Stethoscope, Sparkles } from 'lucide-react';

type AppPhase = 'intro' | 'main_menu' | 'booking' | 'login' | 'registro' | 'app';

// Staff médico inicial para las 15 especialidades
const INITIAL_DOCTORS: Dentist[] = SPECIALTIES_LIST.map((spec, i) => ({
  id: `doc-${i + 1}`,
  name: spec.defaultDoctor,
  licenseNumber: `MP ${42000 + i * 314}`,
  specialty: spec.name,
  roomNumber: spec.defaultRoom,
  phone: '+54 9 11 4589-1234',
  email: `${spec.id}@colsul.com`,
  active: true
}));

// Pacientes con fichas de especialidades integradas
const ENRICHED_INITIAL_PATIENTS: Patient[] = INITIAL_PATIENTS.map(p => ({
  ...p,
  specialtiesData: DEFAULT_PATIENT_SPECIALTIES[p.id] || {}
}));

export const App: React.FC = () => {
  // ── TODOS los hooks siempre al tope (regla de React) ──
  const [appPhase, setAppPhase] = useState<AppPhase>('intro');
  const [usuarioActivo, setUsuarioActivo] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('specialties');

  // Estado con persistencia en localStorage
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('colsul_patients') || localStorage.getItem('odonto_patients');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(p => ({
            ...p,
            specialtiesData: p.specialtiesData || DEFAULT_PATIENT_SPECIALTIES[p.id] || {}
          }));
        }
      } catch (e) {}
    }
    return ENRICHED_INITIAL_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('colsul_appointments') || localStorage.getItem('odonto_appointments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_APPOINTMENTS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('colsul_budgets') || localStorage.getItem('odonto_budgets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_BUDGETS;
  });

  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    const saved = localStorage.getItem('colsul_patients') || localStorage.getItem('odonto_patients');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed[0].id;
      } catch (e) {}
    }
    return ENRICHED_INITIAL_PATIENTS[0].id;
  });

  // Guardado reactivo en localStorage
  useEffect(() => {
    localStorage.setItem('colsul_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('colsul_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('colsul_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Estado de Colores Personalizados para el Odontograma
  const [conditionColors, setConditionColors] = useState<Record<ConditionType, string>>(() => {
    const saved = localStorage.getItem('colsul_condition_colors') || localStorage.getItem('odonto_condition_colors');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const defaults: Record<string, string> = {};
    Object.keys(CONDITION_METAS).forEach(key => {
      defaults[key] = CONDITION_METAS[key as ConditionType].color;
    });
    return defaults as Record<ConditionType, string>;
  });

  // Estado del ticket flotante de 10s
  const [latestTicketAppointment, setLatestTicketAppointment] = useState<Appointment | null>(null);

  // Estado del consultorio, horarios y staff de médicos
  const [clinicName, setClinicName] = useState<string>(() => {
    return localStorage.getItem('colsul_clinic_name') || 'Colsul';
  });
  const [clinicAddress, setClinicAddress] = useState<string>(() => {
    return localStorage.getItem('colsul_clinic_address') || 'Av. San Martín 1450, Policonsultorio Central';
  });
  const [clinicPhone, setClinicPhone] = useState<string>(() => {
    return localStorage.getItem('colsul_clinic_phone') || '+54 9 11 4589-1234';
  });

  useEffect(() => {
    localStorage.setItem('colsul_clinic_name', clinicName);
  }, [clinicName]);

  useEffect(() => {
    localStorage.setItem('colsul_clinic_address', clinicAddress);
  }, [clinicAddress]);

  useEffect(() => {
    localStorage.setItem('colsul_clinic_phone', clinicPhone);
  }, [clinicPhone]);

  const [clinicSchedule, setClinicSchedule] = useState<ClinicScheduleConfig>(() => {
    const saved = localStorage.getItem('colsul_clinic_schedule') || localStorage.getItem('odonto_clinic_schedule');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_CLINIC_SCHEDULE;
  });

  const handleUpdateClinicSchedule = (newSchedule: ClinicScheduleConfig) => {
    setClinicSchedule(newSchedule);
    localStorage.setItem('colsul_clinic_schedule', JSON.stringify(newSchedule));
  };

  const [dentists, setDentists] = useState<Dentist[]>(() => {
    const saved = localStorage.getItem('colsul_dentists') || localStorage.getItem('odonto_dentists');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) return parsed;
      } catch (e) {}
    }
    return INITIAL_DOCTORS;
  });

  useEffect(() => {
    localStorage.setItem('colsul_dentists', JSON.stringify(dentists));
  }, [dentists]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Handlers para Colores del Odontograma
  const handleUpdateConditionColor = (conditionId: ConditionType, newColor: string) => {
    setConditionColors(prev => {
      const updated = { ...prev, [conditionId]: newColor };
      localStorage.setItem('colsul_condition_colors', JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetConditionColors = () => {
    const defaults: Record<string, string> = {};
    Object.keys(CONDITION_METAS).forEach(key => {
      defaults[key] = CONDITION_METAS[key as ConditionType].color;
    });
    localStorage.setItem('colsul_condition_colors', JSON.stringify(defaults));
    setConditionColors(defaults as Record<ConditionType, string>);
  };

  // Handlers generales
  const handleUpdateOdontogramFindings = (patientId: string, newFindings: ToothFinding[]) => {
    setPatients(prev => prev.map(p =>
      p.id === patientId ? { ...p, odontogramFindings: newFindings } : p
    ));
  };

  const handleAddClinicalEvolution = (patientId: string, newEvolution: ClinicalEvolution) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const updatedEvo = [newEvolution, ...(p.evolutions || [])];
        return { ...p, evolutions: updatedEvo };
      }
      return p;
    }));
  };

  const handleUpdateClinicalEvolution = (patientId: string, updatedEvolution: ClinicalEvolution) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const updatedEvoList = (p.evolutions || []).map(e =>
          e.id === updatedEvolution.id ? updatedEvolution : e
        );
        return { ...p, evolutions: updatedEvoList };
      }
      return p;
    }));
  };

  const handleDeleteClinicalEvolution = (patientId: string, evolutionId: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const updatedEvo = (p.evolutions || []).filter(e => e.id !== evolutionId);
        return { ...p, evolutions: updatedEvo };
      }
      return p;
    }));
  };

  const handleAddAppointment = (newApp: Appointment) => {
    setAppointments([newApp, ...appointments]);
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients([newPatient, ...patients]);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  const handleAddBudget = (newBudget: Budget) => {
    setBudgets([newBudget, ...budgets]);
  };

  const handleUpdatePayment = (budgetId: string, addedPayment: number) => {
    setBudgets(prev => prev.map(b => {
      if (b.id === budgetId) {
        return { ...b, paidAmount: b.paidAmount + addedPayment };
      }
      return b;
    }));
  };

  // Handlers Médicos / Especialistas
  const handleAddDentist = (newDentist: Dentist) => {
    setDentists(prev => [newDentist, ...prev]);
  };

  const handleToggleDentistStatus = (id: string) => {
    setDentists(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  const handleDeleteDentist = (id: string) => {
    setDentists(prev => prev.filter(d => d.id !== id));
  };

  // Handler para Restaurar Backup Completo
  const handleRestoreBackupData = (backupData: any) => {
    if (backupData.clinicInfo) {
      if (backupData.clinicInfo.name) setClinicName(backupData.clinicInfo.name);
      if (backupData.clinicInfo.address) setClinicAddress(backupData.clinicInfo.address);
      if (backupData.clinicInfo.phone) setClinicPhone(backupData.clinicInfo.phone);
    }
    if (backupData.conditionColors) {
      setConditionColors(backupData.conditionColors);
      localStorage.setItem('colsul_condition_colors', JSON.stringify(backupData.conditionColors));
    }
    if (Array.isArray(backupData.dentists)) setDentists(backupData.dentists);
    if (Array.isArray(backupData.patients)) {
      setPatients(backupData.patients);
      if (backupData.patients.length > 0) setSelectedPatientId(backupData.patients[0].id);
    }
    if (Array.isArray(backupData.appointments)) setAppointments(backupData.appointments);
    if (Array.isArray(backupData.budgets)) setBudgets(backupData.budgets);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr);

  // ── Flujo de fases ──
  if (appPhase === 'intro') {
    return <IntroScreen onFinish={() => setAppPhase('main_menu')} />;
  }

  if (appPhase === 'main_menu') {
    return (
      <MainMenu
        onSelectConsultorio={() => setAppPhase('login')}
        onSelectReservarTurno={() => setAppPhase('booking')}
      />
    );
  }

  if (appPhase === 'booking') {
    return (
      <>
        <PatientBooking
          onBackToMenu={() => setAppPhase('main_menu')}
          onAddAppointment={handleAddAppointment}
          onTriggerTicket={(app) => setLatestTicketAppointment(app)}
          clinicSchedule={clinicSchedule}
          appointments={appointments}
          patients={patients}
          onAddPatient={handleAddPatient}
          dentists={dentists}
        />
        <NewAppointmentTicket
          appointment={latestTicketAppointment}
          onClose={() => setLatestTicketAppointment(null)}
        />
      </>
    );
  }

  if (appPhase === 'login') {
    return <Login onLogin={(role) => { setUsuarioActivo(role); setAppPhase('registro'); }} />;
  }

  if (appPhase === 'registro') {
    return <Registro usuarioLogin={usuarioActivo} onDone={() => setAppPhase('app')} />;
  }

  // ── App principal ──
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white relative">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        todayAppointmentsCount={todayAppointments.length}
        clinicName={clinicName}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">

        {/* Barra superior de Selección de Paciente y Estadísticas */}
        {(activeTab === 'specialties' || activeTab === 'odontogram') && (
          <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold uppercase text-slate-400">Paciente Activo:</span>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="px-4 py-2 rounded-xl border border-teal-300 bg-teal-50 text-teal-900 font-bold text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - DNI: {p.dni} ({p.healthInsurance})</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-600" /> {patients.length} Pacientes
              </span>
              <span className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-teal-600" /> 15 Especialidades
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-600" /> 10 Consultorios
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" /> {todayAppointments.length} Turnos Hoy
              </span>
              <button
                onClick={() => setAppPhase('main_menu')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors border border-slate-300"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-600" />
                <span>Menú</span>
              </button>
            </div>
          </div>
        )}

        {/* 1. MÓDULOS MÉDICOS DE LAS 15 ESPECIALIDADES */}
        {(activeTab === 'specialties' || activeTab === 'odontogram') && (
          <SpecialtyRecordHub
            patient={selectedPatient}
            onUpdatePatient={handleUpdatePatient}
            onUpdateOdontogramFindings={handleUpdateOdontogramFindings}
            conditionColors={conditionColors}
            initialSpecialty={activeTab === 'odontogram' ? 'odontologia' : 'odontologia'}
          />
        )}

        {/* 2. TURNOS & AGENDA MULTIESPECIALIDAD */}
        {activeTab === 'appointments' && (
          <Appointments
            appointments={appointments}
            patients={patients}
            onAddAppointment={handleAddAppointment}
            onUpdateStatus={handleUpdateAppointmentStatus}
            onTriggerTicket={(app) => setLatestTicketAppointment(app)}
            clinicSchedule={clinicSchedule}
            dentists={dentists}
            onAddPatient={handleAddPatient}
          />
        )}

        {/* 3. HISTORIAS CLÍNICAS */}
        {activeTab === 'patients' && (
          <Patients
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
            onAddPatient={handleAddPatient}
            onUpdatePatient={handleUpdatePatient}
            onNavigateToOdontogram={(pId) => {
              setSelectedPatientId(pId);
              setActiveTab('specialties');
            }}
            onUpdateOdontogramFindings={handleUpdateOdontogramFindings}
            onAddClinicalEvolution={handleAddClinicalEvolution}
            onUpdateClinicalEvolution={handleUpdateClinicalEvolution}
            onDeleteClinicalEvolution={handleDeleteClinicalEvolution}
            conditionColors={conditionColors}
            dentists={dentists}
          />
        )}

        {/* 4. PRESUPUESTOS & ARANCELES */}
        {activeTab === 'budgets' && (
          <Budgets
            budgets={budgets}
            patients={patients}
            onAddBudget={handleAddBudget}
            onUpdatePayment={handleUpdatePayment}
          />
        )}

        {/* 5. CONFIGURACIÓN */}
        {activeTab === 'settings' && (
          <Settings
            clinicName={clinicName}
            onUpdateClinicName={setClinicName}
            clinicAddress={clinicAddress}
            onUpdateClinicAddress={setClinicAddress}
            clinicPhone={clinicPhone}
            onUpdateClinicPhone={setClinicPhone}
            dentists={dentists}
            onAddDentist={handleAddDentist}
            onToggleDentistStatus={handleToggleDentistStatus}
            onDeleteDentist={handleDeleteDentist}
            patients={patients}
            appointments={appointments}
            budgets={budgets}
            onRestoreBackupData={handleRestoreBackupData}
            conditionColors={conditionColors}
            onUpdateConditionColor={handleUpdateConditionColor}
            onResetConditionColors={handleResetConditionColors}
            clinicSchedule={clinicSchedule}
            onUpdateClinicSchedule={handleUpdateClinicSchedule}
          />
        )}

      </main>

      <Footer />

      {/* Ticket Emergente de 10 Segundos */}
      <NewAppointmentTicket
        appointment={latestTicketAppointment}
        onClose={() => setLatestTicketAppointment(null)}
      />
    </div>
  );
};

export default App;
