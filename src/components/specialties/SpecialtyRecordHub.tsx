import React, { useState } from 'react';
import { 
  Patient, MedicalSpecialty, ToothFinding, ConditionType,
  OphthalmologyRecord, CardiologyRecord, PediatricsRecord,
  TraumatologyRecord, DermatologyRecord, GynecologyRecord,
  InternalMedicineRecord, NutritionRecord, KinesiologyRecord,
  OtorhinolaryngologyRecord, PneumologyRecord, NeurologyRecord,
  PsychologyRecord, UrologyRecord
} from '../../types';
import { SPECIALTIES_LIST } from '../../data/specialtiesData';
import { Odontogram } from '../Odontogram';
import { 
  Save, CheckCircle2, AlertCircle, Heart, Eye, Baby, Activity, 
  Stethoscope, Flame, Scale, Sparkles, FileText, ShieldAlert,
  ChevronRight, ArrowRight, UserCheck, Lock, Award
} from 'lucide-react';

interface SpecialtyRecordHubProps {
  patient: Patient;
  onUpdatePatient: (updatedPatient: Patient) => void;
  onUpdateOdontogramFindings?: (patientId: string, newFindings: ToothFinding[]) => void;
  conditionColors?: Record<ConditionType, string>;
  initialSpecialty?: MedicalSpecialty;
}

export const SpecialtyRecordHub: React.FC<SpecialtyRecordHubProps> = ({
  patient,
  onUpdatePatient,
  onUpdateOdontogramFindings,
  conditionColors,
  initialSpecialty = 'odontologia'
}) => {
  const [activeSpecialty, setActiveSpecialty] = useState<MedicalSpecialty>(initialSpecialty);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Helper para actualizar datos de especialidad en el paciente
  const handleSaveSpecialtyData = (specId: MedicalSpecialty, data: any) => {
    const updatedSpecialties = {
      ...(patient.specialtiesData || {}),
      [specId]: {
        ...data,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    };

    const updatedPatient: Patient = {
      ...patient,
      specialtiesData: updatedSpecialties
    };

    onUpdatePatient(updatedPatient);
    setSaveSuccessMsg(`¡Ficha de ${SPECIALTIES_LIST.find(s => s.id === specId)?.name} guardada correctamente!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const currentSpecMeta = SPECIALTIES_LIST.find(s => s.id === activeSpecialty) || SPECIALTIES_LIST[0];

  return (
    <div className="space-y-6">
      {/* Header del Centro de Especialidades */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentSpecMeta.icon}</span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Módulos Clínicos por Especialidad
            </h2>
            <span className="text-xs font-bold uppercase bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-200">
              15 Especialidades
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Paciente: <strong className="text-slate-800">{patient.name}</strong> (DNI: {patient.dni} · {patient.healthInsurance}) · Consultorio #{currentSpecMeta.defaultRoom}
          </p>
        </div>

        {saveSuccessMsg && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold shadow-xs animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Selector de Pestañas de las 15 Especialidades */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {SPECIALTIES_LIST.map((spec) => {
            const isActive = activeSpecialty === spec.id;
            return (
              <button
                key={spec.id}
                onClick={() => setActiveSpecialty(spec.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-300'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>{spec.icon}</span>
                <span>{spec.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isActive ? 'bg-teal-700 text-teal-100' : 'bg-slate-200 text-slate-600'}`}>
                  C{spec.defaultRoom}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tarjeta de Información de la Especialidad Seleccionada */}
      <div className={`p-4 rounded-2xl border ${currentSpecMeta.borderColor} ${currentSpecMeta.bgLight} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 bg-white rounded-xl shadow-xs border border-slate-200">
            {currentSpecMeta.icon}
          </span>
          <div>
            <h3 className={`font-extrabold text-base ${currentSpecMeta.textColor}`}>
              {currentSpecMeta.name}
            </h3>
            <p className="text-xs text-slate-600">
              {currentSpecMeta.description} · <span className="font-semibold">Médico asignado: {currentSpecMeta.defaultDoctor}</span> (Consultorio {currentSpecMeta.defaultRoom})
            </p>
          </div>
        </div>
      </div>

      {/* CONTENIDO INTERACTIVO SEGÚN LA ESPECIALIDAD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">

        {/* 1. ODONTOLOGÍA */}
        {activeSpecialty === 'odontologia' && (
          <div>
            <Odontogram
              patient={patient}
              onUpdateFindings={(pId, findings) => {
                if (onUpdateOdontogramFindings) {
                  onUpdateOdontogramFindings(pId, findings);
                } else {
                  onUpdatePatient({ ...patient, odontogramFindings: findings });
                }
              }}
              conditionColors={conditionColors}
            />
          </div>
        )}

        {/* 2. OFTALMOLOGÍA */}
        {activeSpecialty === 'oftalmologia' && (
          <OphthalmologyModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('oftalmologia', data)}
          />
        )}

        {/* 3. CARDIOLOGÍA */}
        {activeSpecialty === 'cardiologia' && (
          <CardiologyModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('cardiologia', data)}
          />
        )}

        {/* 4. PEDIATRÍA */}
        {activeSpecialty === 'pediatria' && (
          <PediatricsModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('pediatria', data)}
          />
        )}

        {/* 5. TRAUMATOLOGÍA */}
        {activeSpecialty === 'traumatologia' && (
          <TraumatologyModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('traumatologia', data)}
          />
        )}

        {/* 6. DERMATOLOGÍA */}
        {activeSpecialty === 'dermatologia' && (
          <DermatologyModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('dermatologia', data)}
          />
        )}

        {/* 7. GINECOLOGÍA & OBSTETRICIA */}
        {activeSpecialty === 'ginecologia' && (
          <GynecologyModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('ginecologia', data)}
          />
        )}

        {/* 8. CLÍNICA MÉDICA */}
        {activeSpecialty === 'clinica_medica' && (
          <InternalMedicineModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('clinica_medica', data)}
          />
        )}

        {/* 9. NUTRICIÓN */}
        {activeSpecialty === 'nutricion' && (
          <NutritionModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('nutricion', data)}
          />
        )}

        {/* 10. KINESIOLOGÍA */}
        {activeSpecialty === 'kinesiologia' && (
          <KinesiologyModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('kinesiologia', data)}
          />
        )}

        {/* 11. OTORRINOLARINGOLOGÍA */}
        {activeSpecialty === 'otorrinolaringologia' && (
          <OtorhinolaryngologyModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('otorrinolaringologia', data)}
          />
        )}

        {/* 12. NEUMONOLOGÍA */}
        {activeSpecialty === 'neumonologia' && (
          <PneumologyModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('neumonologia', data)}
          />
        )}

        {/* 13. NEUROLOGÍA */}
        {activeSpecialty === 'neurologia' && (
          <NeurologyModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('neurologia', data)}
          />
        )}

        {/* 14. PSICOLOGÍA */}
        {activeSpecialty === 'psicologia' && (
          <PsychologyModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('psicologia', data)}
          />
        )}

        {/* 15. UROLOGÍA */}
        {activeSpecialty === 'urologia' && (
          <UrologyModule
            patient={patient}
            onSave={(data) => handleSaveSpecialtyData('urologia', data)}
          />
        )}

      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: OFTALMOLOGÍA (Cartilla Snellen + Refracción + PIO)
// =========================================================================
const OphthalmologyModule: React.FC<{ patient: Patient; onSave: (data: OphthalmologyRecord) => void }> = ({ patient, onSave }) => {
  const initial = patient.specialtiesData?.oftalmologia || {
    visualAcuityRight: '20/20',
    visualAcuityLeft: '20/25',
    sphereRight: 0,
    sphereLeft: 0,
    cylinderRight: 0,
    cylinderLeft: 0,
    axisRight: 0,
    axisLeft: 0,
    intraocularPressureRight: 14,
    intraocularPressureLeft: 15,
    fundoscopy: 'Fondo de ojo normal. Papila rosada de bordes netos, sin hemorragias.',
    biomicroscopy: 'Córnea transparente, cámara anterior amplia, cristalino traslúcido.',
    notes: ''
  };

  const [form, setForm] = useState<OphthalmologyRecord>(initial);

  const snellenLines = [
    { label: '20/200', letters: 'E', size: 'text-4xl' },
    { label: '20/100', letters: 'F P', size: 'text-3xl' },
    { label: '20/70', letters: 'T O Z', size: 'text-2xl' },
    { label: '20/50', letters: 'L P E D', size: 'text-xl' },
    { label: '20/40', letters: 'P E C F D', size: 'text-lg' },
    { label: '20/30', letters: 'E D F C Z P', size: 'text-base' },
    { label: '20/25', letters: 'F E L O P Z D', size: 'text-sm' },
    { label: '20/20', letters: 'D E F P O T E C', size: 'text-xs' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cartilla Snellen interactiva */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
            Cartilla Optométrica de Snellen
          </span>
          <div className="bg-white p-4 rounded-xl border border-slate-300 w-full max-w-xs space-y-1.5 shadow-inner font-mono tracking-widest text-slate-900 select-none">
            {snellenLines.map((line, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between border-b border-slate-100 pb-1 cursor-pointer hover:bg-sky-50 rounded px-2"
                onClick={() => setForm(f => ({ ...f, visualAcuityRight: line.label }))}
                title={`Click para asignar ${line.label} a Ojo Derecho`}
              >
                <span className="text-[10px] text-slate-400 font-sans">{line.label}</span>
                <span className={`font-black ${line.size}`}>{line.letters}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Haga clic en una línea para asignar agudeza visual</p>
        </div>

        {/* Agudeza Visual & Refracción */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agudeza Visual & Refracción</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ojo Derecho */}
            <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-200 space-y-3">
              <span className="font-extrabold text-sm text-sky-900 flex items-center gap-1.5">
                👁️ Ojo Derecho (OD)
              </span>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Agudeza Visual</label>
                <input
                  type="text"
                  value={form.visualAcuityRight}
                  onChange={(e) => setForm({ ...form, visualAcuityRight: e.target.value })}
                  placeholder="ej: 20/20"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-semibold bg-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 block">Esfera (D)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={form.sphereRight}
                    onChange={(e) => setForm({ ...form, sphereRight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Cilindro (D)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={form.cylinderRight}
                    onChange={(e) => setForm({ ...form, cylinderRight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Eje (°)</label>
                  <input
                    type="number"
                    value={form.axisRight}
                    onChange={(e) => setForm({ ...form, axisRight: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 rounded border border-slate-300 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Presión Intraocular (PIO - mmHg)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={form.intraocularPressureRight}
                    onChange={(e) => setForm({ ...form, intraocularPressureRight: parseInt(e.target.value) || 0 })}
                    className="w-24 px-3 py-1 rounded-lg border border-slate-300 text-sm font-bold bg-white"
                  />
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    form.intraocularPressureRight > 21 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {form.intraocularPressureRight > 21 ? 'Elevada (>21 mmHg)' : 'Normal (10-21)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ojo Izquierdo */}
            <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-200 space-y-3">
              <span className="font-extrabold text-sm text-sky-900 flex items-center gap-1.5">
                👁️ Ojo Izquierdo (OI)
              </span>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Agudeza Visual</label>
                <input
                  type="text"
                  value={form.visualAcuityLeft}
                  onChange={(e) => setForm({ ...form, visualAcuityLeft: e.target.value })}
                  placeholder="ej: 20/25"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-semibold bg-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 block">Esfera (D)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={form.sphereLeft}
                    onChange={(e) => setForm({ ...form, sphereLeft: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Cilindro (D)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={form.cylinderLeft}
                    onChange={(e) => setForm({ ...form, cylinderLeft: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Eje (°)</label>
                  <input
                    type="number"
                    value={form.axisLeft}
                    onChange={(e) => setForm({ ...form, axisLeft: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 rounded border border-slate-300 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Presión Intraocular (PIO - mmHg)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={form.intraocularPressureLeft}
                    onChange={(e) => setForm({ ...form, intraocularPressureLeft: parseInt(e.target.value) || 0 })}
                    className="w-24 px-3 py-1 rounded-lg border border-slate-300 text-sm font-bold bg-white"
                  />
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    form.intraocularPressureLeft > 21 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {form.intraocularPressureLeft > 21 ? 'Elevada (>21 mmHg)' : 'Normal (10-21)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Fondo de Ojo (Retina & Papila)</label>
              <textarea
                value={form.fundoscopy}
                onChange={(e) => setForm({ ...form, fundoscopy: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Biomicroscopía (Lámpara de Hendidura)</label>
              <textarea
                value={form.biomicroscopy}
                onChange={(e) => setForm({ ...form, biomicroscopy: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Observaciones Oftalmológicas & Receta</label>
            <input
              type="text"
              value={form.notes || ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Indicación de lentes, gotas humectantes, fondo de ojo bajo midriasis..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha Oftalmológica</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: CARDIOLOGÍA (PA + FC + Trazado ECG + Framingham)
// =========================================================================
const CardiologyModule: React.FC<{ patient: Patient; onSave: (data: CardiologyRecord) => void }> = ({ patient, onSave }) => {
  const initial = patient.specialtiesData?.cardiologia || {
    systolicBP: 120,
    diastolicBP: 80,
    heartRate: 72,
    ecgRhythm: 'sinusal_normal',
    cardiovascularRisk: 'bajo',
    peripheralPulses: 'Pulsos periféricos simétricos y presentes.',
    edema: false,
    notes: ''
  };

  const [form, setForm] = useState<CardiologyRecord>(initial);

  // Clasificación automática de PA
  const getBPClassification = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { label: 'Óptima / Normal', color: 'bg-emerald-100 text-emerald-800' };
    if (sys <= 129 && dia < 85) return { label: 'Normal Promedio', color: 'bg-teal-100 text-teal-800' };
    if (sys <= 139 || dia <= 89) return { label: 'Pre-Hipertensión', color: 'bg-amber-100 text-amber-800' };
    if (sys <= 159 || dia <= 99) return { label: 'Hipertensión Grado 1', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Hipertensión Grado 2/3', color: 'bg-rose-100 text-rose-800' };
  };

  const bpStatus = getBPClassification(form.systolicBP, form.diastolicBP);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tensión Arterial */}
        <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
          <span className="font-extrabold text-sm text-rose-900 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-600" /> Presión Arterial (PA)
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Sistólica (mmHg)</label>
              <input
                type="number"
                value={form.systolicBP}
                onChange={(e) => setForm({ ...form, systolicBP: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-extrabold text-lg text-slate-800 bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Diastólica (mmHg)</label>
              <input
                type="number"
                value={form.diastolicBP}
                onChange={(e) => setForm({ ...form, diastolicBP: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-extrabold text-lg text-slate-800 bg-white"
              />
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold text-center ${bpStatus.color}`}>
            Estado: {bpStatus.label} ({form.systolicBP}/{form.diastolicBP} mmHg)
          </div>
        </div>

        {/* Frecuencia Cardíaca & Riesgo Framingham */}
        <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
          <span className="font-extrabold text-sm text-rose-900 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-rose-600" /> Frecuencia Cardíaca (FC)
          </span>
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Pulsaciones (lpm)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.heartRate}
                onChange={(e) => setForm({ ...form, heartRate: parseInt(e.target.value) || 0 })}
                className="w-28 px-3 py-2 rounded-xl border border-slate-300 font-extrabold text-lg text-slate-800 bg-white"
              />
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                form.heartRate < 60 ? 'bg-amber-100 text-amber-800' : form.heartRate > 100 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {form.heartRate < 60 ? 'Bradicardia (<60)' : form.heartRate > 100 ? 'Taquicardia (>100)' : 'Normocárdico (60-100)'}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Riesgo Cardiovascular (Framingham)</label>
            <select
              value={form.cardiovascularRisk}
              onChange={(e) => setForm({ ...form, cardiovascularRisk: e.target.value as any })}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
            >
              <option value="bajo">Bajo (&lt; 10% a 10 años)</option>
              <option value="moderado">Moderado (10% - 20%)</option>
              <option value="alto">Alto (&gt; 20%)</option>
              <option value="muy_alto">Muy Alto (Enfermedad establecida)</option>
            </select>
          </div>
        </div>

        {/* Exploración Física Cardiovascular */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <span className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-teal-600" /> Examen Vascular
          </span>
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Pulsos Periféricos</label>
            <input
              type="text"
              value={form.peripheralPulses}
              onChange={(e) => setForm({ ...form, peripheralPulses: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="edema_cardio"
              checked={form.edema}
              onChange={(e) => setForm({ ...form, edema: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded"
            />
            <label htmlFor="edema_cardio" className="text-xs font-bold text-slate-700 cursor-pointer">
              Edema en miembros inferiores (Godet +)
            </label>
          </div>
        </div>

      </div>

      {/* Visor de Electrocardiograma (ECG) */}
      <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-300 uppercase">
              Trazado Electrocardiográfico en Tiempo Real (Derivación DII)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400">Ritmo:</span>
            <select
              value={form.ecgRhythm}
              onChange={(e) => setForm({ ...form, ecgRhythm: e.target.value as any })}
              className="bg-slate-800 text-emerald-300 border border-slate-700 text-xs font-mono rounded px-2 py-0.5"
            >
              <option value="sinusal_normal">Ritmo Sinusal Normal</option>
              <option value="taquicardia_sinusal">Taquicardia Sinusal</option>
              <option value="bradicardia">Bradicardia Sinusal</option>
              <option value="fibrilacion_auricular">Fibrilación Auricular (FA)</option>
              <option value="extrasistoles">Extrasístoles Ventriculares</option>
              <option value="bloqueo_rama">Bloqueo de Rama</option>
            </select>
          </div>
        </div>

        {/* SVG Trazado ECG animado */}
        <div className="w-full h-24 overflow-hidden relative flex items-center bg-slate-950/80 rounded-lg p-2 border border-slate-800">
          <svg className="w-full h-full" viewBox="0 0 800 80" preserveAspectRatio="none">
            {/* Grilla ECG */}
            <defs>
              <pattern id="ecgGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#064e3b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="800" height="80" fill="url(#ecgGrid)" />
            {/* Onda P-Q-R-S-T repetida */}
            <path
              d="M0,40 L60,40 L70,35 L80,40 L90,40 L95,47 L100,5 L108,60 L114,40 L130,40 L145,30 L160,40 
                 L220,40 L230,35 L240,40 L250,40 L255,47 L260,5 L268,60 L274,40 L290,40 L305,30 L320,40
                 L380,40 L390,35 L400,40 L410,40 L415,47 L420,5 L428,60 L434,40 L450,40 L465,30 L480,40
                 L540,40 L550,35 L560,40 L570,40 L575,47 L580,5 L588,60 L594,40 L610,40 L625,30 L640,40
                 L700,40 L710,35 L720,40 L730,40 L735,47 L740,5 L748,60 L754,40 L770,40 L785,30 L800,40"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1">Notas Cardiológicas & Tratamiento Farmacológico</label>
        <textarea
          value={form.notes || ''}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={2}
          placeholder="Enalapril 10mg/d, Bisoprolol, dieta hiposódica, solicitud de Holter o Ecocardiograma Doppler..."
          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
        />
      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha Cardiológica</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: PEDIATRÍA (Percentiles OMS + Calendario Vacunación)
// =========================================================================
const PediatricsModule: React.FC<{ patient: Patient; onSave: (data: PediatricsRecord) => void }> = ({ patient, onSave }) => {
  const defaultVaccines = [
    { id: 'v-1', vaccineName: 'BCG (Tuberculosis)', ageTarget: 'Recién nacido', applied: true, applicationDate: '2020-01-10' },
    { id: 'v-2', vaccineName: 'Hepatitis B Pediátrica', ageTarget: 'Recién nacido', applied: true, applicationDate: '2020-01-10' },
    { id: 'v-3', vaccineName: 'Quíntuple / Pentavalente (1° Dosis)', ageTarget: '2 meses', applied: true, applicationDate: '2020-03-12' },
    { id: 'v-4', vaccineName: 'IPV Polio Salk (1° Dosis)', ageTarget: '2 meses', applied: true, applicationDate: '2020-03-12' },
    { id: 'v-5', vaccineName: 'Neumococo Conjugada (1° Dosis)', ageTarget: '2 meses', applied: true, applicationDate: '2020-03-12' },
    { id: 'v-6', vaccineName: 'Rotavirus (1° Dosis)', ageTarget: '2 meses', applied: true, applicationDate: '2020-03-12' },
    { id: 'v-7', vaccineName: 'Triple Viral SRP (12 meses)', ageTarget: '12 meses', applied: true, applicationDate: '2021-01-15' },
    { id: 'v-8', vaccineName: 'Varicela (15 meses)', ageTarget: '15 meses', applied: true, applicationDate: '2021-04-18' },
    { id: 'v-9', vaccineName: 'Refuerzo Escolar (5 años)', ageTarget: '5 años', applied: false },
    { id: 'v-10', vaccineName: 'VPH Virus Papiloma Humano (11 años)', ageTarget: '11 años', applied: false },
  ];

  const initial = patient.specialtiesData?.pediatria || {
    weightKg: 16.5,
    heightCm: 104,
    headCircumferenceCm: 51,
    weightPercentile: 50,
    heightPercentile: 65,
    headPercentile: 50,
    psychomotorMilestones: 'Marcha estable, habla fluida con oraciones completas, control de esfínteres diurno.',
    feedingType: 'alimentacion_complementaria',
    vaccines: defaultVaccines,
    notes: ''
  };

  const [form, setForm] = useState<PediatricsRecord>(initial);

  const toggleVaccine = (vaccineId: string) => {
    setForm(prev => ({
      ...prev,
      vaccines: prev.vaccines.map(v => 
        v.id === vaccineId ? { ...v, applied: !v.applied, applicationDate: !v.applied ? new Date().toISOString().split('T')[0] : undefined } : v
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Antropometría & Curvas de Crecimiento OMS */}
        <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-4">
          <span className="font-extrabold text-sm text-purple-900 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-purple-600" /> Antropometría & Percentiles OMS
          </span>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-extrabold text-base bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Talla (cm)</label>
              <input
                type="number"
                step="0.5"
                value={form.heightCm}
                onChange={(e) => setForm({ ...form, heightCm: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-extrabold text-base bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">P. Cefálico (cm)</label>
              <input
                type="number"
                step="0.5"
                value={form.headCircumferenceCm}
                onChange={(e) => setForm({ ...form, headCircumferenceCm: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-extrabold text-base bg-white"
              />
            </div>
          </div>

          {/* Barras de percentiles visuales */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                <span>Percentil Peso/Edad: P{form.weightPercentile}</span>
                <span className="text-purple-700">{form.weightPercentile >= 10 && form.weightPercentile <= 90 ? 'Adecuado' : 'Control'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="99"
                value={form.weightPercentile}
                onChange={(e) => setForm({ ...form, weightPercentile: parseInt(e.target.value) })}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                <span>Percentil Talla/Edad: P{form.heightPercentile}</span>
                <span className="text-purple-700">{form.heightPercentile >= 10 && form.heightPercentile <= 90 ? 'Adecuado' : 'Control'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="99"
                value={form.heightPercentile}
                onChange={(e) => setForm({ ...form, heightPercentile: parseInt(e.target.value) })}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Desarrollo Psicomotor & Hitos Madurativos</label>
            <textarea
              value={form.psychomotorMilestones}
              onChange={(e) => setForm({ ...form, psychomotorMilestones: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
            />
          </div>
        </div>

        {/* Calendario Nacional de Vacunación */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="font-extrabold text-sm text-slate-800 flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5">💉 Calendario Nacional de Vacunación</span>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
                {form.vaccines.filter(v => v.applied).length} / {form.vaccines.length} Dosis Aplicadas
              </span>
            </span>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {form.vaccines.map((vac) => (
                <div 
                  key={vac.id} 
                  onClick={() => toggleVaccine(vac.id)}
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                    vac.applied ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={vac.applied}
                      onChange={() => {}} // controlado por div
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <div>
                      <span className="font-bold block">{vac.vaccineName}</span>
                      <span className="text-[10px] text-slate-400">Objetivo: {vac.ageTarget}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    vac.applied ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {vac.applied ? `Aplicada ${vac.applicationDate || ''}` : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha Pediátrica</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: TRAUMATOLOGÍA (Mapa Articular + Escala EVA + Inmovilización)
// =========================================================================
const TraumatologyModule: React.FC<{ patient: Patient; onSave: (data: TraumatologyRecord) => void }> = ({ patient, onSave }) => {
  const initial = patient.specialtiesData?.traumatologia || {
    affectedJoint: 'rodilla',
    side: 'derecho',
    painScaleEVA: 5,
    mobilityRangeROM: 'Flexión conservada, dolor con carga axial completa.',
    immobilization: 'ninguna',
    injuryType: 'esguince',
    surgeryHistory: 'Sin antecedentes quirúrgicos articulares.',
    notes: ''
  };

  const [form, setForm] = useState<TraumatologyRecord>(initial);

  const joints: { id: TraumatologyRecord['affectedJoint']; label: string; icon: string }[] = [
    { id: 'hombro', label: 'Hombro / Clavícula', icon: '💪' },
    { id: 'codo', label: 'Codo', icon: '🦴' },
    { id: 'muneca', label: 'Muñeca / Mano', icon: '✋' },
    { id: 'columna_cervical', label: 'Columna Cervical', icon: '👤' },
    { id: 'columna_lumbar', label: 'Columna Lumbar', icon: '🧍' },
    { id: 'cadera', label: 'Cadera / Pelvis', icon: '🦵' },
    { id: 'rodilla', label: 'Rodilla', icon: '🦿' },
    { id: 'tobillo', label: 'Tobillo', icon: '🦶' },
    { id: 'pie', label: 'Pie / Dedos', icon: '👟' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Selector Articular */}
        <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-3">
          <span className="font-extrabold text-sm text-orange-900 flex items-center gap-1.5">
            🦴 Articulación / Región Anatómica
          </span>
          <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto">
            {joints.map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => setForm({ ...form, affectedJoint: j.id })}
                className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold text-left transition-all ${
                  form.affectedJoint === j.id
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-orange-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{j.icon}</span>
                  <span>{j.label}</span>
                </span>
                {form.affectedJoint === j.id && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            {(['izquierdo', 'derecho', 'bilateral'] as const).map(side => (
              <button
                key={side}
                type="button"
                onClick={() => setForm({ ...form, side })}
                className={`flex-1 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  form.side === side ? 'bg-orange-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {side}
              </button>
            ))}
          </div>
        </div>

        {/* Escala Visual Analógica EVA (1-10) */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <span className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            ⚡ Intensidad del Dolor (Escala EVA)
          </span>

          <div className="text-center p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-3xl font-black text-orange-600 block">
              {form.painScaleEVA} / 10
            </span>
            <span className="text-xs font-bold text-slate-600 mt-1 block">
              {form.painScaleEVA <= 3 ? '😊 Dolor Leve' : form.painScaleEVA <= 6 ? '😐 Dolor Moderado' : '😫 Dolor Intenso / Severo'}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={form.painScaleEVA}
            onChange={(e) => setForm({ ...form, painScaleEVA: parseInt(e.target.value) })}
            className="w-full accent-orange-500 cursor-pointer"
          />

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Tipo de Lesión Diagnóstica</label>
            <select
              value={form.injuryType}
              onChange={(e) => setForm({ ...form, injuryType: e.target.value as any })}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
            >
              <option value="esguince">Esguince Ligamentario</option>
              <option value="fractura">Fractura Ósea</option>
              <option value="luxacion">Luxación Articular</option>
              <option value="tendinitis">Tendinitis / Entesopatía</option>
              <option value="artrosis">Artrosis Degenerativa</option>
              <option value="desgarro">Desgarro Muscular</option>
            </select>
          </div>
        </div>

        {/* Inmovilización y Rango de Movilidad */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <span className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            🩹 Inmovilización & Terapéutica
          </span>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Inmovilización Indicada</label>
            <select
              value={form.immobilization}
              onChange={(e) => setForm({ ...form, immobilization: e.target.value as any })}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
            >
              <option value="ninguna">Ninguna / Movilización libre</option>
              <option value="vendaje">Vendaje compresivo elástico</option>
              <option value="ferula">Férula de yeso / termoplástica</option>
              <option value="yeso">Bota / Valva de Yeso cerrada</option>
              <option value="cabestrillo">Cabestrillo suspendido</option>
              <option value="bota_walker">Bota Walker inmovilizadora</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Rango Articular y Goniometría (ROM)</label>
            <textarea
              value={form.mobilityRangeROM}
              onChange={(e) => setForm({ ...form, mobilityRangeROM: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
            />
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha Traumatológica</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: DERMATOLOGÍA (Fototipo Fitzpatrick + Regla ABCDE)
// =========================================================================
const DermatologyModule: React.FC<{ patient: Patient; onSave: (data: DermatologyRecord) => void }> = ({ patient, onSave }) => {
  const initial = patient.specialtiesData?.dermatologia || {
    fitzpatrickPhototype: 'III',
    lesionLocation: 'Espalda región escapular',
    lesionType: 'nevus',
    abcdeAsymmetry: false,
    abcdeBorderIrregular: false,
    abcdeColorVariegated: false,
    abcdeDiameterOver6mm: false,
    abcdeEvolutionRapid: false,
    dermoscopyFindings: 'Patrón globular simétrico sin áreas de desestructuración.',
    biopsyIndicated: false,
    notes: ''
  };

  const [form, setForm] = useState<DermatologyRecord>(initial);

  const fitzpatrickTypes = [
    { type: 'I', desc: 'Piel muy clara, siempre se quema, nunca se broncea', color: '#fef08a' },
    { type: 'II', desc: 'Piel clara, se quema con facilidad, mínimo bronceado', color: '#fde047' },
    { type: 'III', desc: 'Piel intermedia, quemaduras moderadas, bronceado gradual', color: '#facc15' },
    { type: 'IV', desc: 'Piel morena clara, se quema poco, se broncea bien', color: '#eab308' },
    { type: 'V', desc: 'Piel morena oscura, raramente se quema, intenso bronceado', color: '#ca8a04' },
    { type: 'VI', desc: 'Piel muy oscura/negra, nunca se quema', color: '#854d0e' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Fototipo Fitzpatrick */}
        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
          <span className="font-extrabold text-sm text-amber-900 flex items-center gap-1.5">
            ☀️ Fototipo Cutáneo de Fitzpatrick
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {fitzpatrickTypes.map(fp => (
              <button
                key={fp.type}
                type="button"
                onClick={() => setForm({ ...form, fitzpatrickPhototype: fp.type as any })}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  form.fitzpatrickPhototype === fp.type
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-100'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: fp.color }} />
                  <span className="font-extrabold">Tipo {fp.type}</span>
                </div>
                <span className="text-[10px] block opacity-85 leading-tight">{fp.desc}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Ubicación Lesión</label>
              <input
                type="text"
                value={form.lesionLocation}
                onChange={(e) => setForm({ ...form, lesionLocation: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Tipo Elemental</label>
              <select
                value={form.lesionType}
                onChange={(e) => setForm({ ...form, lesionType: e.target.value as any })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-bold"
              >
                <option value="nevus">Nevus / Lunar</option>
                <option value="macula">Mácula pigmentada</option>
                <option value="papula">Pápula</option>
                <option value="placa">Placa</option>
                <option value="nodulo">Nódulo</option>
                <option value="vesicula">Vesícula / Ampolla</option>
                <option value="queratosis">Queratosis seborreica</option>
              </select>
            </div>
          </div>
        </div>

        {/* Regla ABCDE del Melanoma */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <span className="font-extrabold text-sm text-slate-800 flex items-center justify-between">
            <span>🔬 Regla ABCDE de Evaluación de Lesiones</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
              (form.abcdeAsymmetry || form.abcdeBorderIrregular || form.abcdeColorVariegated || form.abcdeDiameterOver6mm || form.abcdeEvolutionRapid)
                ? 'bg-rose-100 text-rose-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {(form.abcdeAsymmetry || form.abcdeBorderIrregular || form.abcdeColorVariegated || form.abcdeDiameterOver6mm || form.abcdeEvolutionRapid)
                ? 'Criterios de Alarma Presentes'
                : 'Sin Criterios de Riesgo'}
            </span>
          </span>

          <div className="space-y-1.5 text-xs">
            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={form.abcdeAsymmetry}
                onChange={(e) => setForm({ ...form, abcdeAsymmetry: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span><strong>A - Asimetría:</strong> Los dos hemisferios de la lesión no coinciden.</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={form.abcdeBorderIrregular}
                onChange={(e) => setForm({ ...form, abcdeBorderIrregular: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span><strong>B - Bordes:</strong> Irregulares, ondulados o mal definidos.</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={form.abcdeColorVariegated}
                onChange={(e) => setForm({ ...form, abcdeColorVariegated: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span><strong>C - Color:</strong> Color no uniforme, mezcla de marrón, negro, rojo.</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={form.abcdeDiameterOver6mm}
                onChange={(e) => setForm({ ...form, abcdeDiameterOver6mm: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span><strong>D - Diámetro:</strong> Mayor a 6 mm (tamaño de goma de lápiz).</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={form.abcdeEvolutionRapid}
                onChange={(e) => setForm({ ...form, abcdeEvolutionRapid: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span><strong>E - Evolución:</strong> Cambio rápido en tamaño, forma, color o prurito.</span>
            </label>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="biopsia_chk"
              checked={form.biopsyIndicated}
              onChange={(e) => setForm({ ...form, biopsyIndicated: e.target.checked })}
              className="w-4 h-4 text-rose-600 rounded"
            />
            <label htmlFor="biopsia_chk" className="text-xs font-bold text-rose-800 cursor-pointer">
              Indicar Biopsia / Exéresis Quirúrgica
            </label>
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha Dermatológica</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: GINECOLOGÍA & OBSTETRICIA (FUM + FPP Gestacional + PAP)
// =========================================================================
const GynecologyModule: React.FC<{ patient: Patient; onSave: (data: GynecologyRecord) => void }> = ({ patient, onSave }) => {
  const initial = patient.specialtiesData?.ginecologia || {
    fumDate: '2026-05-15',
    gestationalWeeks: 15,
    gestationalDays: 3,
    estimatedDueDate: '2027-02-19',
    gravidity: 1,
    parity: 0,
    abortions: 0,
    papDate: '2026-02-15',
    papResult: 'Negativo para lesión intraepitelial.',
    colposcopyNotes: 'Epitelio trófico normal.',
    mammographyDate: '2025-11-20',
    mammographyBirads: '1',
    notes: ''
  };

  const [form, setForm] = useState<GynecologyRecord>(initial);

  // Calculadora de FPP (Regla de Naegele: FUM + 7 días + 9 meses)
  const calculatePregnancy = (fumStr: string) => {
    if (!fumStr) return;
    const parts = fumStr.split('-').map(Number);
    const fumDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const today = new Date();

    // Días de diferencia
    const diffMs = today.getTime() - fumDate.getTime();
    if (diffMs > 0) {
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(totalDays / 7);
      const days = totalDays % 7;

      // FPP = FUM + 280 días (40 semanas)
      const fppDate = new Date(fumDate.getTime() + 280 * 24 * 60 * 60 * 1000);
      const fppStr = fppDate.toISOString().split('T')[0];

      setForm(prev => ({
        ...prev,
        fumDate: fumStr,
        gestationalWeeks: weeks,
        gestationalDays: days,
        estimatedDueDate: fppStr
      }));
    } else {
      setForm(prev => ({ ...prev, fumDate: fumStr }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Calculadora Gestacional FUM */}
        <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-200 space-y-4">
          <span className="font-extrabold text-sm text-pink-900 flex items-center gap-1.5">
            🌸 Obstetricia: Calculadora Gestacional FUM
          </span>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Fecha de Última Menstruación (FUM)</label>
            <input
              type="date"
              value={form.fumDate || ''}
              onChange={(e) => calculatePregnancy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-pink-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Edad Gestacional</span>
              <span className="text-lg font-black text-pink-700">
                {form.gestationalWeeks !== undefined ? `${form.gestationalWeeks} sem + ${form.gestationalDays || 0}d` : '--'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">FPP (Fecha Parto)</span>
              <span className="text-lg font-black text-slate-800">
                {form.estimatedDueDate || '--'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-500 block font-bold">Gestas (G)</label>
              <input
                type="number"
                value={form.gravidity}
                onChange={(e) => setForm({ ...form, gravidity: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-center"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block font-bold">Partos (P)</label>
              <input
                type="number"
                value={form.parity}
                onChange={(e) => setForm({ ...form, parity: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-center"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block font-bold">Abortos (A)</label>
              <input
                type="number"
                value={form.abortions}
                onChange={(e) => setForm({ ...form, abortions: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-center"
              />
            </div>
          </div>
        </div>

        {/* Control Preventivo: PAP, Colpo y Mamografía */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <span className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            📋 Control Ginecológico Preventivo
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Último Papanicolaou (PAP)</label>
              <input
                type="date"
                value={form.papDate || ''}
                onChange={(e) => setForm({ ...form, papDate: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Mamografía (BI-RADS)</label>
              <select
                value={form.mammographyBirads || '1'}
                onChange={(e) => setForm({ ...form, mammographyBirads: e.target.value as any })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="1">BI-RADS 1: Negativo / Normal</option>
                <option value="2">BI-RADS 2: Benigno</option>
                <option value="3">BI-RADS 3: Probablemente benigno (control 6m)</option>
                <option value="4">BI-RADS 4: Sospecha de malignidad</option>
                <option value="5">BI-RADS 5: Altamente sugerente</option>
                <option value="0">BI-RADS 0: Incompleto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Resultado de PAP / Colposcopía</label>
            <input
              type="text"
              value={form.papResult || ''}
              onChange={(e) => setForm({ ...form, papResult: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Observaciones Ginecológicas</label>
            <textarea
              value={form.notes || ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
            />
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha Ginecológica</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: CLÍNICA MÉDICA (Signos Vitales + Examen Sistémico)
// =========================================================================
const InternalMedicineModule: React.FC<{ patient: Patient; onSave: (data: InternalMedicineRecord) => void }> = ({ patient, onSave }) => {
  const initial = patient.specialtiesData?.clinica_medica || {
    systolicBP: 120,
    diastolicBP: 80,
    heartRate: 72,
    respiratoryRate: 16,
    temperatureC: 36.5,
    spo2Percent: 98,
    bloodGlucoseMgDl: 95,
    systemicReview: {
      cardiovascular: 'Ruidos normofonéticos sin soplos.',
      respiratory: 'Murmullo vesicular conservado.',
      gastrointestinal: 'Abdomen blando, indoloro, ruidos hidroaéreos normales.',
      neurological: 'Vigil, orientado en tiempo y espacio.',
      osteomuscular: 'Ejes conservados sin flogosis.'
    },
    currentSyndromes: 'Evaluación de control clínico.',
    labSummary: 'Rutina de laboratorio en rango normal.',
    notes: ''
  };

  const [form, setForm] = useState<InternalMedicineRecord>(initial);

  return (
    <div className="space-y-6">
      {/* Panel de Signos Vitales */}
      <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200">
        <span className="font-extrabold text-sm text-teal-900 block mb-3">
          🩺 Panel Completo de Signos Vitales
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 block">PA Sistólica</label>
            <input
              type="number"
              value={form.systolicBP}
              onChange={(e) => setForm({ ...form, systolicBP: parseInt(e.target.value) || 0 })}
              className="w-full text-base font-black text-slate-800"
            />
            <span className="text-[9px] text-slate-400">mmHg</span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 block">PA Diastólica</label>
            <input
              type="number"
              value={form.diastolicBP}
              onChange={(e) => setForm({ ...form, diastolicBP: parseInt(e.target.value) || 0 })}
              className="w-full text-base font-black text-slate-800"
            />
            <span className="text-[9px] text-slate-400">mmHg</span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 block">FC (Pulso)</label>
            <input
              type="number"
              value={form.heartRate}
              onChange={(e) => setForm({ ...form, heartRate: parseInt(e.target.value) || 0 })}
              className="w-full text-base font-black text-slate-800"
            />
            <span className="text-[9px] text-slate-400">ppm</span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 block">F. Resp. (FR)</label>
            <input
              type="number"
              value={form.respiratoryRate}
              onChange={(e) => setForm({ ...form, respiratoryRate: parseInt(e.target.value) || 0 })}
              className="w-full text-base font-black text-slate-800"
            />
            <span className="text-[9px] text-slate-400">rpm</span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 block">Temperatura</label>
            <input
              type="number"
              step="0.1"
              value={form.temperatureC}
              onChange={(e) => setForm({ ...form, temperatureC: parseFloat(e.target.value) || 0 })}
              className="w-full text-base font-black text-slate-800"
            />
            <span className="text-[9px] text-slate-400">°C</span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 block">Sat. O2 / HGT</label>
            <input
              type="number"
              value={form.spo2Percent}
              onChange={(e) => setForm({ ...form, spo2Percent: parseInt(e.target.value) || 0 })}
              className="w-full text-base font-black text-teal-700"
            />
            <span className="text-[9px] text-slate-400">% SpO2</span>
          </div>
        </div>
      </div>

      {/* Revisión Sistémica por Aparatos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Aparato Cardiovascular & Respiratorio</label>
          <textarea
            value={form.systemicReview.cardiovascular + ' ' + form.systemicReview.respiratory}
            onChange={(e) => setForm({ 
              ...form, 
              systemicReview: { ...form.systemicReview, cardiovascular: e.target.value } 
            })}
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Abdomen & Aparato Digestivo</label>
          <textarea
            value={form.systemicReview.gastrointestinal}
            onChange={(e) => setForm({ 
              ...form, 
              systemicReview: { ...form.systemicReview, gastrointestinal: e.target.value } 
            })}
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1">Diagnóstico Clínico & Indicaciones</label>
        <textarea
          value={form.notes || ''}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={2}
          placeholder="Indicación de laboratorio de control, pautas de alarma..."
          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
        />
      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha Clínica Médica</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: NUTRICIÓN (IMC Automático + TMB Calorías + Plan)
// =========================================================================
const NutritionModule: React.FC<{ patient: Patient; onSave: (data: NutritionRecord) => void }> = ({ patient, onSave }) => {
  const initial = patient.specialtiesData?.nutricion || {
    weightKg: 75,
    heightCm: 172,
    bmi: 25.3,
    bmiCategory: 'sobrepeso',
    bodyFatPercent: 22,
    muscleMassKg: 32,
    waistCircumferenceCm: 88,
    basalMetabolicRateKcal: 1650,
    caloricTargetKcal: 1900,
    dietaryPlanSummary: 'Plan equilibrado con distribución 50% Carbohidratos complejos, 25% Proteínas, 25% Grasas saludables.',
    hydrationLitersDaily: 2.2,
    allergiesIntolerances: 'Intolerancia leve a la lactosa.',
    notes: ''
  };

  const [form, setForm] = useState<NutritionRecord>(initial);

  // Cálculo reactivo de IMC
  const updateAnthropometry = (weight: number, heightCm: number) => {
    const hM = heightCm / 100;
    const bmiVal = hM > 0 ? parseFloat((weight / (hM * hM)).toFixed(1)) : 0;
    let cat: NutritionRecord['bmiCategory'] = 'normal';
    if (bmiVal < 18.5) cat = 'bajo_peso';
    else if (bmiVal <= 24.9) cat = 'normal';
    else if (bmiVal <= 29.9) cat = 'sobrepeso';
    else if (bmiVal <= 34.9) cat = 'obesidad_1';
    else if (bmiVal <= 39.9) cat = 'obesidad_2';
    else cat = 'obesidad_3';

    // Estimación TMB Harris-Benedict aprox
    const tmb = Math.round(10 * weight + 6.25 * heightCm - 5 * patient.age + 5);

    setForm(prev => ({
      ...prev,
      weightKg: weight,
      heightCm: heightCm,
      bmi: bmiVal,
      bmiCategory: cat,
      basalMetabolicRateKcal: tmb
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Antropometría & IMC */}
        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
          <span className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
            🥗 Antropometría & Cálculo de IMC
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Peso Actual (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.weightKg}
                onChange={(e) => updateAnthropometry(parseFloat(e.target.value) || 0, form.heightCm)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-extrabold text-base bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Estatura (cm)</label>
              <input
                type="number"
                value={form.heightCm}
                onChange={(e) => updateAnthropometry(form.weightKg, parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-extrabold text-base bg-white"
              />
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Índice de Masa Corporal</span>
            <span className="text-2xl font-black text-emerald-700 block">{form.bmi} kg/m²</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full capitalize bg-emerald-100 text-emerald-800">
              {form.bmiCategory.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Metabolismo Basal y Composición Corporal */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <span className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            🔥 Gasto Energético & Calorías
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block">TMB (Metabolismo Basal)</span>
              <span className="text-lg font-black text-slate-800">{form.basalMetabolicRateKcal} kcal</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block">Meta Calórica Diaria</span>
              <input
                type="number"
                value={form.caloricTargetKcal || 2000}
                onChange={(e) => setForm({ ...form, caloricTargetKcal: parseInt(e.target.value) || 0 })}
                className="w-full font-black text-emerald-700 bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block">% Grasa Corporal</label>
              <input
                type="number"
                step="0.5"
                value={form.bodyFatPercent || 0}
                onChange={(e) => setForm({ ...form, bodyFatPercent: parseFloat(e.target.value) || 0 })}
                className="w-full px-2 py-1 rounded border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block">Circunf. Cintura (cm)</label>
              <input
                type="number"
                value={form.waistCircumferenceCm || 0}
                onChange={(e) => setForm({ ...form, waistCircumferenceCm: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 rounded border border-slate-300 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Plan Alimentario */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <span className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            📋 Pauta Dietética & Hidratación
          </span>
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Litros de Agua Recomendados</label>
            <input
              type="number"
              step="0.1"
              value={form.hydrationLitersDaily}
              onChange={(e) => setForm({ ...form, hydrationLitersDaily: parseFloat(e.target.value) || 2 })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-bold"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Plan Nutricional / Indicaciones</label>
            <textarea
              value={form.dietaryPlanSummary}
              onChange={(e) => setForm({ ...form, dietaryPlanSummary: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
            />
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha Nutricional</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: KINESIOLOGÍA (Sesiones de Rehabilitación + Agentes Físicos)
// =========================================================================
const KinesiologyModule: React.FC<{ patient: Patient; onSave: (data: KinesiologyRecord) => void }> = ({ patient, onSave }) => {
  const initial = patient.specialtiesData?.kinesiologia || {
    affectedZone: 'Hombro derecho - Manguito rotador',
    painScaleEVA: 4,
    treatmentGoals: 'Disminuir dolor, recuperar abducción y rotación externa.',
    sessionCountCompleted: 3,
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
    functionalEvolutionNotes: 'Evolución favorable. Mayor amplitud de movimiento sin compensación cervical.'
  };

  const [form, setForm] = useState<KinesiologyRecord>(initial);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Zona Afectada y Contador de Sesiones */}
        <div className="p-4 bg-cyan-50/50 rounded-2xl border border-cyan-200 space-y-3">
          <span className="font-extrabold text-sm text-cyan-900 flex items-center gap-1.5">
            🏃 Rehabilitación: Conteo de Sesiones
          </span>
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Zona Afectada</label>
            <input
              type="text"
              value={form.affectedZone}
              onChange={(e) => setForm({ ...form, affectedZone: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-bold"
            />
          </div>

          <div className="p-3 bg-white rounded-xl border border-cyan-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-700">Progreso del Tratamiento:</span>
              <span className="text-xs font-black text-cyan-700">
                {form.sessionCountCompleted} de {form.sessionCountTotal} Sesiones
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-cyan-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (form.sessionCountCompleted / (form.sessionCountTotal || 1)) * 100)}%` }}
              />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, sessionCountCompleted: Math.max(0, f.sessionCountCompleted - 1) }))}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
              >
                -1 Sesión
              </button>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, sessionCountCompleted: f.sessionCountCompleted + 1 }))}
                className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-xs"
              >
                +1 Asistencia
              </button>
            </div>
          </div>
        </div>

        {/* Agentes Fisioterapéuticos */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <span className="font-extrabold text-sm text-slate-800 block mb-2">
            ⚡ Agentes Físicos & Modalidades
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries({
              magneto: 'Magnetoterapia',
              ultrasound: 'Ultrasonido',
              tens: 'Electroestimulación TENS',
              cryotherapy: 'Crioterapia',
              thermotherapy: 'Termoterapia (Calor)',
              activeKinesio: 'Ejercicios Activos',
              manualTherapy: 'Terapia Manual'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(form.modalities as any)[key]}
                  onChange={(e) => setForm({
                    ...form,
                    modalities: { ...form.modalities, [key]: e.target.checked }
                  })}
                  className="w-3.5 h-3.5 text-cyan-600 rounded"
                />
                <span className="text-[11px] font-semibold">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Evolución Funcional */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <span className="font-extrabold text-sm text-slate-800 block">
            📝 Objetivos & Evolución Funcional
          </span>
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Objetivos Terapéuticos</label>
            <input
              type="text"
              value={form.treatmentGoals}
              onChange={(e) => setForm({ ...form, treatmentGoals: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Notas de Evolución de Sesión</label>
            <textarea
              value={form.functionalEvolutionNotes}
              onChange={(e) => setForm({ ...form, functionalEvolutionNotes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
            />
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha Kinefisiátrica</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: OTORRINOLARINGOLOGÍA (Audiograma Tonal + Otoscopía)
// =========================================================================
const OtorhinolaryngologyModule: React.FC<{ patient: Patient; onSave: (data: OtorhinolaryngologyRecord) => void }> = ({ patient, onSave }) => {
  const defaultAudiometry = [
    { frequencyHz: 250 as const, rightEarDb: 15, leftEarDb: 15 },
    { frequencyHz: 500 as const, rightEarDb: 20, leftEarDb: 20 },
    { frequencyHz: 1000 as const, rightEarDb: 15, leftEarDb: 20 },
    { frequencyHz: 2000 as const, rightEarDb: 20, leftEarDb: 25 },
    { frequencyHz: 4000 as const, rightEarDb: 25, leftEarDb: 30 },
    { frequencyHz: 8000 as const, rightEarDb: 25, leftEarDb: 35 },
  ];

  const initial = patient.specialtiesData?.otorrinolaringologia || {
    audiometry: defaultAudiometry,
    rightOtoscopy: 'Conducto auditivo permeable, membrana timpánica íntegra, reflejo luminoso presente.',
    leftOtoscopy: 'Membrana timpánica congestiva en cuadrante posterosuperior.',
    rhinoscopy: 'Cornetes eutróficos, tabique nasal sin desviaciones obstructivas.',
    oropharynx: 'Amígdalas grado 1 sin exudados.',
    hearingLossDiagnosis: 'audicion_normal',
    notes: ''
  };

  const [form, setForm] = useState<OtorhinolaryngologyRecord>(initial);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Audiograma Tonal Gráfico */}
        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-3">
          <span className="font-extrabold text-sm text-indigo-900 flex items-center justify-between">
            <span>👂 Audiograma Tonal (Umbrales de Audición)</span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
              🔴 Oído Der (O) · 🔵 Oído Izq (X)
            </span>
          </span>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-bold text-slate-500 border-b pb-1">
              <span>250 Hz</span>
              <span>500 Hz</span>
              <span>1000 Hz</span>
              <span>2000 Hz</span>
              <span>4000 Hz</span>
              <span>8000 Hz</span>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-rose-600 w-12">Oído Der:</span>
                {form.audiometry.map((aud, idx) => (
                  <input
                    key={idx}
                    type="number"
                    value={aud.rightEarDb}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      const next = [...form.audiometry];
                      next[idx].rightEarDb = val;
                      setForm({ ...form, audiometry: next });
                    }}
                    className="w-full text-center py-1 rounded border border-rose-200 text-xs font-bold text-rose-700 bg-rose-50/50"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-blue-600 w-12">Oído Izq:</span>
                {form.audiometry.map((aud, idx) => (
                  <input
                    key={idx}
                    type="number"
                    value={aud.leftEarDb}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      const next = [...form.audiometry];
                      next[idx].leftEarDb = val;
                      setForm({ ...form, audiometry: next });
                    }}
                    className="w-full text-center py-1 rounded border border-blue-200 text-xs font-bold text-blue-700 bg-blue-50/50"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Otoscopía & Rinoscopía */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <span className="font-extrabold text-sm text-slate-800 block">
            🔬 Otoscopía Timpánica Bilateral
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Oído Derecho</label>
              <textarea
                value={form.rightOtoscopy}
                onChange={(e) => setForm({ ...form, rightOtoscopy: e.target.value })}
                rows={2}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Oído Izquierdo</label>
              <textarea
                value={form.leftOtoscopy}
                onChange={(e) => setForm({ ...form, leftOtoscopy: e.target.value })}
                rows={2}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Diagnóstico Audiológico</label>
            <select
              value={form.hearingLossDiagnosis}
              onChange={(e) => setForm({ ...form, hearingLossDiagnosis: e.target.value as any })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
            >
              <option value="audicion_normal">Audición Normal (0 - 20 dB)</option>
              <option value="hipoacusia_leve">Hipoacusia Leve (21 - 40 dB)</option>
              <option value="hipoacusia_moderada">Hipoacusia Moderada (41 - 70 dB)</option>
              <option value="hipoacusia_severa">Hipoacusia Severa (71 - 90 dB)</option>
              <option value="hipoacusia_profunda">Hipoacusia Profunda (&gt; 90 dB)</option>
            </select>
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha ORL</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: NEUMONOLOGÍA (Espirometría + SatO2 + Tabaquismo)
// =========================================================================
const PneumologyModule: React.FC<{ patient: Patient; onSave: (data: PneumologyRecord) => void }> = ({ patient, onSave }) => {
  const initial = patient.specialtiesData?.neumonologia || {
    fvcLiters: 4.2,
    fvcPercentPredicted: 95,
    fev1Liters: 3.5,
    fev1PercentPredicted: 92,
    fev1FvcRatio: 83.3,
    spirometryInterpretation: 'normal',
    spo2Rest: 98,
    smokingStatus: 'no_fumador',
    packYears: 0,
    inhalerTherapy: 'Ninguna medicación broncodilatadora indicada.',
    notes: ''
  };

  const [form, setForm] = useState<PneumologyRecord>(initial);

  const calculateSpirometry = (fvc: number, fev1: number) => {
    const ratio = fvc > 0 ? parseFloat(((fev1 / fvc) * 100).toFixed(1)) : 0;
    let interp: PneumologyRecord['spirometryInterpretation'] = 'normal';
    if (ratio < 70) {
      if (fev1 >= 80) interp = 'obstructivo_leve';
      else if (fev1 >= 50) interp = 'obstructivo_moderado';
      else interp = 'obstructivo_severo';
    }
    setForm(prev => ({
      ...prev,
      fvcLiters: fvc,
      fev1Liters: fev1,
      fev1FvcRatio: ratio,
      spirometryInterpretation: interp
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Espirometría Computada */}
        <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-200 space-y-4">
          <span className="font-extrabold text-sm text-sky-900 flex items-center justify-between">
            <span>🫁 Espirometría Funcional Respiratoria</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              form.spirometryInterpretation === 'normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {form.spirometryInterpretation.replace('_', ' ').toUpperCase()}
            </span>
          </span>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">FVC (Litros)</label>
              <input
                type="number"
                step="0.1"
                value={form.fvcLiters}
                onChange={(e) => calculateSpirometry(parseFloat(e.target.value) || 0, form.fev1Liters)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">FEV1 / VEF1 (L)</label>
              <input
                type="number"
                step="0.1"
                value={form.fev1Liters}
                onChange={(e) => calculateSpirometry(form.fvcLiters, parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Relación FEV1/FVC</label>
              <div className="px-3 py-1.5 rounded-lg border border-slate-300 font-black text-sm bg-slate-100 text-slate-800 text-center">
                {form.fev1FvcRatio}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">SatO2 en reposo:</span>
            <input
              type="number"
              value={form.spo2Rest}
              onChange={(e) => setForm({ ...form, spo2Rest: parseInt(e.target.value) || 98 })}
              className="w-20 px-2 py-1 rounded border border-slate-300 font-bold text-xs bg-white text-center"
            />
            <span className="text-xs text-slate-500 font-semibold">% aire ambiente</span>
          </div>
        </div>

        {/* Tabaquismo y Terapia Inhalatoria */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <span className="font-extrabold text-sm text-slate-800 block">
            🚬 Antecedentes de Tabaquismo & Aerosolterapia
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Estado de Tabaquismo</label>
              <select
                value={form.smokingStatus}
                onChange={(e) => setForm({ ...form, smokingStatus: e.target.value as any })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="no_fumador">No Fumador</option>
                <option value="ex_fumador">Ex Fumador</option>
                <option value="fumador_activo">Fumador Activo</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Índice Paquetes-Año</label>
              <input
                type="number"
                value={form.packYears || 0}
                onChange={(e) => setForm({ ...form, packYears: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Esquema Inhalatorio / Fármacos</label>
            <textarea
              value={form.inhalerTherapy}
              onChange={(e) => setForm({ ...form, inhalerTherapy: e.target.value })}
              rows={2}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
            />
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha Neumonológica</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: NEUROLOGÍA (Escala de Glasgow 3-15 + Pares Craneales)
// =========================================================================
const NeurologyModule: React.FC<{ patient: Patient; onSave: (data: NeurologyRecord) => void }> = ({ patient, onSave }) => {
  const initial = patient.specialtiesData?.neurologia || {
    glasgowEyeOpening: 4,
    glasgowVerbal: 5,
    glasgowMotor: 6,
    glasgowTotal: 15,
    cranialNervesIntact: true,
    cranialNervesNotes: 'Pares craneales I al XII evaluados sin déficit focal.',
    motorStrengthMRC: '5',
    deepTendonReflexes: 'normales',
    sensoryExam: 'Sensibilidad táctil y termoalgésica simétrica en 4 extremidades.',
    gaitAndBalance: 'Marcha en tándem estable. Prueba de Romberg negativa.',
    notes: ''
  };

  const [form, setForm] = useState<NeurologyRecord>(initial);

  const updateGlasgow = (eye: number, verbal: number, motor: number) => {
    const total = eye + verbal + motor;
    setForm(prev => ({
      ...prev,
      glasgowEyeOpening: eye as any,
      glasgowVerbal: verbal as any,
      glasgowMotor: motor as any,
      glasgowTotal: total
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Escala de Coma de Glasgow */}
        <div className="p-4 bg-violet-50/50 rounded-2xl border border-violet-200 space-y-3">
          <span className="font-extrabold text-sm text-violet-900 flex items-center justify-between">
            <span>🧠 Escala de Coma de Glasgow</span>
            <span className="text-base font-black text-violet-700 bg-violet-100 px-3 py-0.5 rounded-full">
              Puntaje: {form.glasgowTotal} / 15
            </span>
          </span>

          <div className="space-y-2 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Apertura Ocular (1 - 4)</label>
              <select
                value={form.glasgowEyeOpening}
                onChange={(e) => updateGlasgow(parseInt(e.target.value), form.glasgowVerbal, form.glasgowMotor)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-semibold bg-white"
              >
                <option value="4">4: Espontánea</option>
                <option value="3">3: A la orden verbal</option>
                <option value="2">2: Al dolor</option>
                <option value="1">1: Ninguna</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Respuesta Verbal (1 - 5)</label>
              <select
                value={form.glasgowVerbal}
                onChange={(e) => updateGlasgow(form.glasgowEyeOpening, parseInt(e.target.value), form.glasgowMotor)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-semibold bg-white"
              >
                <option value="5">5: Orientado y conversando</option>
                <option value="4">4: Desorientado y hablando</option>
                <option value="3">3: Palabras inapropiadas</option>
                <option value="2">2: Sonidos incomprensibles</option>
                <option value="1">1: Ninguna</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Respuesta Motora (1 - 6)</label>
              <select
                value={form.glasgowMotor}
                onChange={(e) => updateGlasgow(form.glasgowEyeOpening, form.glasgowVerbal, parseInt(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-semibold bg-white"
              >
                <option value="6">6: Obedece órdenes</option>
                <option value="5">5: Localiza el dolor</option>
                <option value="4">4: Retirada al dolor</option>
                <option value="3">3: Flexión anormal (Decorticación)</option>
                <option value="2">2: Extensión anormal (Descerebración)</option>
                <option value="1">1: Ninguna</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pares Craneales y Fuerza Motora */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <span className="font-extrabold text-sm text-slate-800 block">
            ⚡ Pares Craneales & Reflejos Osteotendinosos
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Fuerza Motora (MRC 0-5)</label>
              <select
                value={form.motorStrengthMRC}
                onChange={(e) => setForm({ ...form, motorStrengthMRC: e.target.value as any })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="5">5/5: Fuerza normal contra resistencia</option>
                <option value="4">4/5: Vence gravedad y cierta resistencia</option>
                <option value="3">3/5: Vence gravedad sin resistencia</option>
                <option value="2">2/5: Moviliza sin vencer gravedad</option>
                <option value="1">1/5: Fasciculación / contracción mínima</option>
                <option value="0">0/5: Parálisis completa</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Reflejos (ROT)</label>
              <select
                value={form.deepTendonReflexes}
                onChange={(e) => setForm({ ...form, deepTendonReflexes: e.target.value as any })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="normales">++ Normorreflexia</option>
                <option value="hiperreflexia">+++ Hiperreflexia</option>
                <option value="hiporreflexia">+ Hiporreflexia</option>
                <option value="arreflexia">0 Arreflexia</option>
                <option value="clonus">++++ Clonus agotable</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Evaluación de Pares Craneales (I al XII)</label>
            <textarea
              value={form.cranialNervesNotes}
              onChange={(e) => setForm({ ...form, cranialNervesNotes: e.target.value })}
              rows={2}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
            />
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha Neurológica</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: PSICOLOGÍA (Notas Confidenciales + GAD-7 / PHQ-9 + Metas)
// =========================================================================
const PsychologyModule: React.FC<{ patient: Patient; onSave: (data: PsychologyRecord) => void }> = ({ patient, onSave }) => {
  const initial = patient.specialtiesData?.psicologia || {
    consultationReason: 'Dificultades en gestión emocional, estrés laboral y somatizaciones.',
    therapeuticApproach: 'cognitivo_conductual',
    currentEmotionalState: 'Lúcido, colaborador, afecto congruente con el relato.',
    anxietyScoreGAD7: 8,
    depressionScorePHQ9: 4,
    confidentialSessionNotes: 'Se explora historia vincular y patrones de autoexigencia. Paciente receptivo a tareas de autorregistro semanal.',
    therapeuticGoals: ['Autorregistro de pensamientos', 'Entrenamiento en asertividad', 'Higiene del descanso'],
    sessionFrequency: 'semanal'
  };

  const [form, setForm] = useState<PsychologyRecord>(initial);

  return (
    <div className="space-y-6">
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
        <Lock className="w-4 h-4 text-amber-700 shrink-0" />
        <span><strong>Privacidad Clínica:</strong> Este módulo contiene notas protegidas bajo secreto profesional y confidencialidad terapéutica.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Motivo de Consulta Psicológica</label>
            <textarea
              value={form.consultationReason}
              onChange={(e) => setForm({ ...form, consultationReason: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Enfoque Terapéutico</label>
              <select
                value={form.therapeuticApproach}
                onChange={(e) => setForm({ ...form, therapeuticApproach: e.target.value as any })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="cognitivo_conductual">Cognitivo Conductual (TCC)</option>
                <option value="psicoanalisis">Psicoanálisis</option>
                <option value="sistemica">Terapia Sistémica Familiar</option>
                <option value="gestalt">Gestalt</option>
                <option value="neuropsicologia">Neuropsicología</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Frecuencia de Sesiones</label>
              <select
                value={form.sessionFrequency}
                onChange={(e) => setForm({ ...form, sessionFrequency: e.target.value as any })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="semanal">Semanal</option>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual / Seguimiento</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Notas de Sesión & Proceso Terapéutico</label>
          <textarea
            value={form.confidentialSessionNotes}
            onChange={(e) => setForm({ ...form, confidentialSessionNotes: e.target.value })}
            rows={5}
            placeholder="Anotaciones confidenciales de la sesión, intervenciones, tareas inter-sesión..."
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono"
          />
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha Psicológica</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MÓDULO: UROLOGÍA (Score IPSS 0-35 + PSA + Ecografía)
// =========================================================================
const UrologyModule: React.FC<{ patient: Patient; onSave: (data: UrologyRecord) => void }> = ({ patient, onSave }) => {
  const initial = patient.specialtiesData?.urologia || {
    ipssScore: 6,
    ipssSeverity: 'leve_0_7',
    totalPsaNgMl: 1.2,
    freePsaNgMl: 0.38,
    psaRatioPercent: 31.6,
    digitalRectalExam: 'normal_fibroelastica',
    renalUltrasoundNotes: 'Riñones conservados, parénquima simétrico. Próstata homogénea de 24 gramos.',
    postVoidResidualMl: 10,
    notes: ''
  };

  const [form, setForm] = useState<UrologyRecord>(initial);

  const calculatePsaRatio = (total: number, free: number) => {
    const ratio = total > 0 ? parseFloat(((free / total) * 100).toFixed(1)) : 0;
    setForm(prev => ({
      ...prev,
      totalPsaNgMl: total,
      freePsaNgMl: free,
      psaRatioPercent: ratio
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Score Prostático IPSS */}
        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-4">
          <span className="font-extrabold text-sm text-blue-900 flex items-center justify-between">
            <span>💧 Puntuación Internacional de Síntomas Prostáticos (IPSS)</span>
            <span className={`text-xs font-black px-3 py-1 rounded-full ${
              form.ipssScore <= 7 ? 'bg-emerald-100 text-emerald-800' : form.ipssScore <= 19 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
            }`}>
              Score: {form.ipssScore} / 35 ({form.ipssScore <= 7 ? 'Leve' : form.ipssScore <= 19 ? 'Moderado' : 'Severo'})
            </span>
          </span>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Ajustar Puntaje IPSS Sintomatológico</label>
            <input
              type="range"
              min="0"
              max="35"
              value={form.ipssScore}
              onChange={(e) => {
                const score = parseInt(e.target.value);
                const sev = score <= 7 ? 'leve_0_7' : score <= 19 ? 'moderado_8_19' : 'severo_20_35';
                setForm({ ...form, ipssScore: score, ipssSeverity: sev });
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Tacto Rectal (TR)</label>
              <select
                value={form.digitalRectalExam}
                onChange={(e) => setForm({ ...form, digitalRectalExam: e.target.value as any })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="normal_fibroelastica">Normal / Fibroelástica</option>
                <option value="adenoma_benigno">Agrandamiento Benigno Grado I/II</option>
                <option value="nodulo_sospechoso">Nódulo indurado / Asimétrico</option>
                <option value="no_realizado">No realizado</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Residuo Post-Miccional (ml)</label>
              <input
                type="number"
                value={form.postVoidResidualMl || 0}
                onChange={(e) => setForm({ ...form, postVoidResidualMl: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white text-center"
              />
            </div>
          </div>
        </div>

        {/* Antígeno Prostático Específico (PSA) */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <span className="font-extrabold text-sm text-slate-800 block">
            🧪 Laboratorio: Antígeno Prostático Específico (PSA)
          </span>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">PSA Total (ng/ml)</label>
              <input
                type="number"
                step="0.1"
                value={form.totalPsaNgMl || 0}
                onChange={(e) => calculatePsaRatio(parseFloat(e.target.value) || 0, form.freePsaNgMl || 0)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-xs text-center"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">PSA Libre (ng/ml)</label>
              <input
                type="number"
                step="0.01"
                value={form.freePsaNgMl || 0}
                onChange={(e) => calculatePsaRatio(form.totalPsaNgMl || 0, parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-xs text-center"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Cociente Libre/Total</label>
              <div className="px-3 py-1.5 rounded-lg border border-slate-300 font-black text-xs bg-slate-100 text-slate-800 text-center">
                {form.psaRatioPercent || 0}%
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Informe de Ecografía Renal y Vesicoprostática</label>
            <textarea
              value={form.renalUltrasoundNotes}
              onChange={(e) => setForm({ ...form, renalUltrasoundNotes: e.target.value })}
              rows={2}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
            />
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Ficha Urológica</span>
        </button>
      </div>
    </div>
  );
};
