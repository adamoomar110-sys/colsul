import React, { useState } from 'react';
import { Patient, DentalXRay, HealthDeclaration, ClinicalEvolution, ToothFinding, ConditionType, Dentist } from '../types';
import { Odontogram } from './Odontogram';
import { SpecialtyRecordHub } from './specialties/SpecialtyRecordHub';
import { Users, UserPlus, Search, ShieldAlert, Phone, Mail, FileText, Activity, ChevronRight, Stethoscope, Camera, Image, Plus, Eye, X, ZoomIn, Upload, Sparkles, ClipboardList, AlertCircle, Heart, HeartPulse, Pill, Baby, Flame, Printer, Calendar, Clock, FilePlus, CheckCircle2, Trash2, Edit3 } from 'lucide-react';

interface PatientsProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
  onAddPatient: (newPatient: Patient) => void;
  onUpdatePatient?: (updatedPatient: Patient) => void;
  onNavigateToOdontogram: (patientId: string) => void;
  onUpdateOdontogramFindings: (patientId: string, newFindings: ToothFinding[]) => void;
  onAddClinicalEvolution: (patientId: string, newEvolution: ClinicalEvolution) => void;
  onUpdateClinicalEvolution?: (patientId: string, updatedEvolution: ClinicalEvolution) => void;
  onDeleteClinicalEvolution?: (patientId: string, evolutionId: string) => void;
  conditionColors?: Record<ConditionType, string>;
  dentists?: Dentist[];
}

export const Patients: React.FC<PatientsProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onAddPatient,
  onUpdatePatient,
  onNavigateToOdontogram,
  onUpdateOdontogramFindings,
  onAddClinicalEvolution,
  onUpdateClinicalEvolution,
  onDeleteClinicalEvolution,
  conditionColors,
  dentists = []
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showXRayModal, setShowXRayModal] = useState<boolean>(false);
  const [showHealthModal, setShowHealthModal] = useState<boolean>(false);
  const [showEvolutionModal, setShowEvolutionModal] = useState<boolean>(false);
  const [activeXRayLightbox, setActiveXRayLightbox] = useState<DentalXRay | null>(null);

  // Subtab activo dentro de la Ficha del Paciente seleccionado
  const [activePatientSubTab, setActivePatientSubTab] = useState<'ficha' | 'especialidades' | 'odontograma' | 'evoluciones'>('ficha');


  // Form State Paciente Nuevo
  const [name, setName] = useState<string>('');
  const [dni, setDni] = useState<string>('');
  const [age, setAge] = useState<number>(30);
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [healthInsurance, setHealthInsurance] = useState<string>('Particular / Sin Prepaga');
  const [insuranceNumber, setInsuranceNumber] = useState<string>('');
  const [medicalHistory, setMedicalHistory] = useState<string>('');
  const [allergies, setAllergies] = useState<string>('Ninguna conocida');
  const [notes, setNotes] = useState<string>('');

  // Form State Nueva Radiografía
  const [xrayTitle, setXRayTitle] = useState<string>('');
  const [xrayType, setXRayType] = useState<'panoramica' | 'periapical' | 'oclusal' | 'tomografia'>('panoramica');
  const [xrayDate, setXRayDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [xrayImage, setXRayImage] = useState<string>('');
  const [xrayNotes, setXRayNotes] = useState<string>('');

  // Form State Nueva / Edición Evolución del Turno / Tratamiento del Día
  const [editingEvolutionId, setEditingEvolutionId] = useState<string | null>(null);
  const [evoDate, setEvoDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [evoDentist, setEvoDentist] = useState<string>(dentists[0]?.name || 'Dra. Amalia Merlo');
  const [evoTooth, setEvoTooth] = useState<string>('');
  const [evoTreatment, setEvoTreatment] = useState<string>('');
  const [evoNotes, setEvoNotes] = useState<string>('');

  const handleOpenCreateEvolution = () => {
    setEditingEvolutionId(null);
    setEvoDate(new Date().toISOString().split('T')[0]);
    setEvoDentist(dentists[0]?.name || 'Dra. Amalia Merlo');
    setEvoTooth('');
    setEvoTreatment('');
    setEvoNotes('');
    setShowEvolutionModal(true);
  };

  const handleOpenEditEvolution = (evo: ClinicalEvolution) => {
    setEditingEvolutionId(evo.id);
    setEvoDate(evo.date);
    setEvoDentist(evo.dentistName);
    setEvoTooth(evo.toothNumber ? String(evo.toothNumber) : '');
    setEvoTreatment(evo.treatment);
    setEvoNotes(evo.notes || '');
    setShowEvolutionModal(true);
  };

  const handleSaveEvolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !evoTreatment.trim()) return;

    if (editingEvolutionId) {
      const updatedEvo: ClinicalEvolution = {
        id: editingEvolutionId,
        date: evoDate || new Date().toISOString().split('T')[0],
        dentistName: evoDentist || (dentists[0]?.name || 'Dra. Amalia Merlo'),
        toothNumber: evoTooth ? Number(evoTooth) : undefined,
        treatment: evoTreatment.trim(),
        notes: evoNotes.trim() || undefined
      };

      if (onUpdateClinicalEvolution) {
        onUpdateClinicalEvolution(selectedPatient.id, updatedEvo);
      } else if (selectedPatient.evolutions) {
        const idx = selectedPatient.evolutions.findIndex(ev => ev.id === editingEvolutionId);
        if (idx >= 0) selectedPatient.evolutions[idx] = updatedEvo;
      }
    } else {
      const newEvo: ClinicalEvolution = {
        id: 'evo-' + Date.now(),
        date: evoDate || new Date().toISOString().split('T')[0],
        dentistName: evoDentist || (dentists[0]?.name || 'Dra. Amalia Merlo'),
        toothNumber: evoTooth ? Number(evoTooth) : undefined,
        treatment: evoTreatment.trim(),
        notes: evoNotes.trim() || undefined
      };
      onAddClinicalEvolution(selectedPatient.id, newEvo);
    }

    setShowEvolutionModal(false);
    setEditingEvolutionId(null);
    setEvoTreatment('');
    setEvoNotes('');
    setEvoTooth('');
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.dni.includes(searchQuery) ||
    p.phone.includes(searchQuery)
  );

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Form State Planilla de Salud (Anamnesis)
  const [hypertension, setHypertension] = useState<boolean>(selectedPatient?.healthDeclaration?.hypertension || false);
  const [diabetes, setDiabetes] = useState<boolean>(selectedPatient?.healthDeclaration?.diabetes || false);
  const [cardiacDisease, setCardiacDisease] = useState<boolean>(selectedPatient?.healthDeclaration?.cardiacDisease || false);
  const [anticoagulants, setAnticoagulants] = useState<boolean>(selectedPatient?.healthDeclaration?.anticoagulants || false);
  const [respiratoryDisease, setRespiratoryDisease] = useState<boolean>(selectedPatient?.healthDeclaration?.respiratoryDisease || false);
  const [hepatitis, setHepatitis] = useState<boolean>(selectedPatient?.healthDeclaration?.hepatitis || false);
  const [epilepsy, setEpilepsy] = useState<boolean>(selectedPatient?.healthDeclaration?.epilepsy || false);
  const [activeInfection, setActiveInfection] = useState<boolean>(selectedPatient?.healthDeclaration?.activeInfection || false);
  const [fever, setFever] = useState<boolean>(selectedPatient?.healthDeclaration?.fever || false);
  const [pregnantOrLactating, setPregnantOrLactating] = useState<boolean>(selectedPatient?.healthDeclaration?.pregnantOrLactating || false);
  const [localAnesthesiaAllergy, setLocalAnesthesiaAllergy] = useState<boolean>(selectedPatient?.healthDeclaration?.localAnesthesiaAllergy || false);
  const [currentMedication, setCurrentMedication] = useState<string>(selectedPatient?.healthDeclaration?.currentMedication || '');
  const [recentSurgeries, setRecentSurgeries] = useState<string>(selectedPatient?.healthDeclaration?.recentSurgeries || '');
  const [customConditions, setCustomConditions] = useState<string[]>(selectedPatient?.healthDeclaration?.customConditions || []);
  const [newCustomInput, setNewCustomInput] = useState<string>('');

  const handleAddCustomCondition = () => {
    if (!newCustomInput.trim()) return;
    const val = newCustomInput.trim();
    if (!customConditions.includes(val)) {
      setCustomConditions(prev => [...prev, val]);
    }
    setNewCustomInput('');
  };

  const handleRemoveCustomCondition = (index: number) => {
    setCustomConditions(prev => prev.filter((_, i) => i !== index));
  };

  const openHealthModal = () => {
    if (selectedPatient?.healthDeclaration) {
      setHypertension(selectedPatient.healthDeclaration.hypertension);
      setDiabetes(selectedPatient.healthDeclaration.diabetes);
      setCardiacDisease(selectedPatient.healthDeclaration.cardiacDisease);
      setAnticoagulants(selectedPatient.healthDeclaration.anticoagulants);
      setRespiratoryDisease(selectedPatient.healthDeclaration.respiratoryDisease);
      setHepatitis(selectedPatient.healthDeclaration.hepatitis);
      setEpilepsy(selectedPatient.healthDeclaration.epilepsy);
      setCustomConditions(selectedPatient.healthDeclaration.customConditions || []);
      setActiveInfection(selectedPatient.healthDeclaration.activeInfection);
      setFever(selectedPatient.healthDeclaration.fever);
      setPregnantOrLactating(selectedPatient.healthDeclaration.pregnantOrLactating);
      setLocalAnesthesiaAllergy(selectedPatient.healthDeclaration.localAnesthesiaAllergy);
      setCurrentMedication(selectedPatient.healthDeclaration.currentMedication || '');
      setRecentSurgeries(selectedPatient.healthDeclaration.recentSurgeries || '');
    } else {
      setCustomConditions([]);
    }
    setShowHealthModal(true);
  };

  const handleSaveHealthDeclaration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const updatedDecl: HealthDeclaration = {
      date: new Date().toISOString().split('T')[0],
      hypertension,
      diabetes,
      cardiacDisease,
      anticoagulants,
      respiratoryDisease,
      hepatitis,
      epilepsy,
      customConditions,
      activeInfection,
      fever,
      pregnantOrLactating,
      localAnesthesiaAllergy,
      currentMedication,
      recentSurgeries
    };

    const updatedPatient: Patient = {
      ...selectedPatient,
      healthDeclaration: updatedDecl
    };

    if (onUpdatePatient) {
      onUpdatePatient(updatedPatient);
    } else {
      selectedPatient.healthDeclaration = updatedDecl;
    }

    setShowHealthModal(false);
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Patient = {
      id: 'p-' + Date.now(),
      name,
      dni,
      age: Number(age),
      phone,
      email,
      photoUrl: photoUrl.trim() || undefined,
      healthInsurance,
      insuranceNumber,
      medicalHistory,
      allergies,
      notes,
      odontogramFindings: [],
      xrays: [],
      evolutions: []
    };

    onAddPatient(newP);
    onSelectPatient(newP.id);
    setShowModal(false);
    // Reset form
    setName('');
    setDni('');
    setPhone('');
    setEmail('');
    setPhotoUrl('');
  };

  const handleFileUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddXRay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !xrayTitle.trim() || !xrayImage.trim()) return;

    const newXRay: DentalXRay = {
      id: 'xr-' + Date.now(),
      date: xrayDate,
      title: xrayTitle.trim(),
      type: xrayType,
      imageUrl: xrayImage.trim(),
      notes: xrayNotes.trim() || undefined
    };

    const updatedXrays = [newXRay, ...(selectedPatient.xrays || [])];
    if (onUpdatePatient) {
      onUpdatePatient({
        ...selectedPatient,
        xrays: updatedXrays
      });
    } else {
      if (!selectedPatient.xrays) selectedPatient.xrays = [];
      selectedPatient.xrays.unshift(newXRay);
    }

    setShowXRayModal(false);
    setXRayTitle('');
    setXRayImage('');
    setXRayNotes('');
  };



  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header del Módulo */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-teal-600" /> Fichas Clínicas & Historias de Pacientes
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Administra historias clínicas, odontogramas integrados, antecedentes médicos, radiografías y evolución diaria de turnos.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm"
        >
          <UserPlus className="w-5 h-5" />
          Registrar Nuevo Paciente
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Patients List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col min-h-[650px] lg:col-span-1">
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por Nombre, DNI o Teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[600px]">
            {filteredPatients.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">No se encontraron pacientes registrados.</p>
            ) : (
              filteredPatients.map((p) => {
                const isSelected = p.id === selectedPatient?.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectPatient(p.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/70 shadow-sm ring-1 ring-teal-400'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {p.photoUrl ? (
                        <img
                          src={p.photoUrl}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-teal-300 shadow-xs"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                          {p.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                        <p className="text-xs text-slate-500">DNI: <span className="font-semibold text-slate-700">{p.dni}</span> | {p.age} años</p>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-teal-800">
                          {p.healthInsurance}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-teal-600' : 'text-slate-300'}`} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Patient Detail Card, Embedded Odontogram & Clinical Evolutions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:col-span-2 flex flex-col justify-between space-y-6">
          {selectedPatient ? (
            <div className="space-y-6">
              
              {/* Header profile with photo */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center space-x-4">
                  {selectedPatient.photoUrl ? (
                    <img
                      src={selectedPatient.photoUrl}
                      alt={selectedPatient.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-md ring-2 ring-teal-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
                      {selectedPatient.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      <span>{selectedPatient.name}</span>
                      {selectedPatient.photoUrl && (
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-200">
                          Foto adjunta 📸
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                      <span>DNI: <strong className="text-slate-700">{selectedPatient.dni}</strong></span>
                      <span>•</span>
                      <span>Edad: <strong className="text-slate-700">{selectedPatient.age} años</strong></span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleOpenCreateEvolution}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Registrar Evolución del Día
                  </button>
                </div>
              </div>

              {/* NAVEGACIÓN POR PESTAÑAS DENTRO DE LA FICHA DEL PACIENTE */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-xs font-extrabold">
                <button
                  onClick={() => setActivePatientSubTab('ficha')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    activePatientSubTab === 'ficha'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Ficha General & Anamnesis</span>
                </button>

                <button
                  onClick={() => setActivePatientSubTab('especialidades')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    activePatientSubTab === 'especialidades'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Módulos Médicos (15 Especialidades)</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activePatientSubTab === 'especialidades' ? 'bg-teal-700 text-teal-100' : 'bg-teal-100 text-teal-800'
                  }`}>
                    Colsul
                  </span>
                </button>

                <button
                  onClick={() => setActivePatientSubTab('odontograma')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    activePatientSubTab === 'odontograma'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <span>🦷</span>
                  <span>Odontograma FDI</span>
                </button>

                <button
                  onClick={() => setActivePatientSubTab('evoluciones')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    activePatientSubTab === 'evoluciones'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Evolución del Turno / Día ({selectedPatient.evolutions?.length || 0})</span>
                </button>
              </div>

              {/* SUBTAB 1: FICHA GENERAL, ANAMNESIS & RADIOGRAFÍAS */}
              {activePatientSubTab === 'ficha' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Patient Info Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Contact & Insurance */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-teal-600" /> Cobertura & Contacto
                      </h4>
                      <div className="text-xs space-y-1.5">
                        <p><span className="text-slate-400 font-medium">Obra Social / Prepaga:</span> <strong className="text-slate-800">{selectedPatient.healthInsurance}</strong></p>
                        <p><span className="text-slate-400 font-medium">N° de Afiliado:</span> <strong className="text-slate-800">{selectedPatient.insuranceNumber || 'Sin información'}</strong></p>
                        <p><span className="text-slate-400 font-medium">Teléfono:</span> <strong className="text-teal-700">{selectedPatient.phone}</strong></p>
                        <p><span className="text-slate-400 font-medium">Email:</span> <strong className="text-slate-700">{selectedPatient.email || 'N/A'}</strong></p>
                      </div>
                    </div>

                    {/* Medical History & Allergies Alert */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-teal-600" /> Antecedentes Médicos
                      </h4>
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-xs text-red-800 flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-red-900">Alergias Conocidas:</strong>
                          {selectedPatient.allergies}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600">
                        <span className="font-bold text-slate-700">Historia Clínica:</span> {selectedPatient.medicalHistory || 'Sin hallazgos de relevancia médica registrados.'}
                      </p>
                    </div>

                  </div>

                  {/* ANAMNESIS DE SALUD */}
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-md">
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <ClipboardList className="w-5 h-5 text-teal-400" />
                        <h4 className="text-sm font-extrabold tracking-wide text-white">
                          Declaración Jurada de Salud & Anamnesis
                        </h4>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={openHealthModal}
                          className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                        >
                          <ClipboardList className="w-3.5 h-3.5" />
                          <span>Editar Planilla</span>
                        </button>

                        <button
                          onClick={() => window.print()}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs transition flex items-center gap-1.5 border border-slate-700 shadow-sm"
                          title="Imprimir la Declaración Jurada para Firma Hológrafa del Paciente"
                        >
                          <Printer className="w-3.5 h-3.5 text-teal-400" />
                          <span>Imprimir para Firma</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.healthDeclaration?.hypertension && (
                          <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full text-xs font-bold">
                            🔴 Hipertensión Arterial
                          </span>
                        )}
                        {selectedPatient.healthDeclaration?.diabetes && (
                          <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full text-xs font-bold">
                            🔴 Diabetes Mellitus
                          </span>
                        )}
                        {selectedPatient.healthDeclaration?.cardiacDisease && (
                          <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full text-xs font-bold">
                            ❤️ Cardiopatía / Marcapasos
                          </span>
                        )}
                        {selectedPatient.healthDeclaration?.anticoagulants && (
                          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold">
                            ⚠️ Anticoagulados / Hemorragias
                          </span>
                        )}
                        {selectedPatient.healthDeclaration?.respiratoryDisease && (
                          <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-full text-xs font-bold">
                            🫁 Asma / Enf. Respiratoria
                          </span>
                        )}
                        {selectedPatient.healthDeclaration?.hepatitis && (
                          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-bold">
                            🩺 Hepatitis / Enf. Hepática
                          </span>
                        )}
                        {selectedPatient.healthDeclaration?.epilepsy && (
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full text-xs font-bold">
                            🧠 Epilepsia / Convulsiones
                          </span>
                        )}
                        {selectedPatient.healthDeclaration?.customConditions?.map((cond, idx) => (
                          <span key={idx} className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-full text-xs font-bold flex items-center gap-1">
                            <span>🩺 {cond}</span>
                          </span>
                        ))}
                        {selectedPatient.healthDeclaration?.localAnesthesiaAllergy && (
                          <span className="px-3 py-1 bg-red-600/30 text-red-200 border border-red-500/50 rounded-full text-xs font-extrabold">
                            🛑 Alergia a Anestesia Local
                          </span>
                        )}
                        {selectedPatient.healthDeclaration?.activeInfection && (
                          <span className="px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/40 rounded-full text-xs font-bold">
                            🔥 Infección Activa en Curso
                          </span>
                        )}
                        {selectedPatient.healthDeclaration?.fever && (
                          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold">
                            🌡️ Fiebre Reciente
                          </span>
                        )}
                        {selectedPatient.healthDeclaration?.pregnantOrLactating && (
                          <span className="px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-full text-xs font-bold">
                            🤰 Embarazo / Lactancia
                          </span>
                        )}
                        {!selectedPatient.healthDeclaration && (
                          <span className="text-xs text-slate-400 italic">No se ha completado la planilla de enfermedades preexistentes aún.</span>
                        )}
                      </div>

                      {/* Medicación Actual Prominente */}
                      {selectedPatient.healthDeclaration?.currentMedication ? (
                        <div className="bg-slate-800/90 border border-teal-500/40 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-200 shadow-inner">
                          <span className="text-lg leading-none">💊</span>
                          <div className="flex-1">
                            <strong className="block text-teal-400 font-extrabold uppercase tracking-wider text-[11px] mb-0.5">
                              Medicación Actual en Curso:
                            </strong>
                            <span className="font-bold text-white text-sm leading-relaxed block bg-slate-900/60 p-2 rounded-lg border border-slate-700/60">
                              {selectedPatient.healthDeclaration.currentMedication}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 italic flex items-center gap-2">
                          <span>💊</span>
                          <span>Sin medicación en curso registrada en la planilla de salud.</span>
                        </div>
                      )}

                      {/* Cirugías Recientes */}
                      {selectedPatient.healthDeclaration?.recentSurgeries && (
                        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-200">
                          <span className="text-lg leading-none">🏥</span>
                          <div className="flex-1">
                            <strong className="block text-teal-400 font-extrabold uppercase tracking-wider text-[11px] mb-0.5">
                              Cirugías / Intervenciones Recientes:
                            </strong>
                            <span className="font-semibold text-slate-200 text-xs leading-relaxed block bg-slate-900/60 p-2 rounded-lg border border-slate-700/60">
                              {selectedPatient.healthDeclaration.recentSurgeries}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RADIOGRAFÍAS */}
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-md">
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <Image className="w-5 h-5 text-teal-400" />
                        <h4 className="text-sm font-extrabold tracking-wide text-white">
                          Radiografías & Estudios de Imagen ({selectedPatient.xrays?.length || 0})
                        </h4>
                      </div>

                      <button
                        onClick={() => setShowXRayModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adjuntar Radiografía</span>
                      </button>
                    </div>

                    {!selectedPatient.xrays || selectedPatient.xrays.length === 0 ? (
                      <div className="text-center py-6 px-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
                        <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 font-medium">No hay radiografías ni estudios cargados para este paciente.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedPatient.xrays.map(xr => (
                          <div
                            key={xr.id}
                            onClick={() => setActiveXRayLightbox(xr)}
                            className="group bg-slate-950 rounded-xl border border-slate-800 hover:border-teal-500/50 p-3 cursor-pointer transition-all hover:shadow-lg overflow-hidden flex flex-col justify-between"
                          >
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-3 group-hover:opacity-90">
                              <img
                                src={xr.imageUrl}
                                alt={xr.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between items-start">
                                <h5 className="font-bold text-xs text-white group-hover:text-teal-300 transition-colors line-clamp-1">{xr.title}</h5>
                                <span className="text-[10px] text-slate-400">{xr.date}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* SUBTAB ESPECIALIDADES MÉDICAS INTERACTIVAS */}
              {activePatientSubTab === 'especialidades' && (
                <div className="animate-fade-in pt-2">
                  <SpecialtyRecordHub 
                    patient={selectedPatient}
                    onUpdatePatient={(upd) => {
                      if (onUpdatePatient) onUpdatePatient(upd);
                      else Object.assign(selectedPatient, upd);
                    }}
                    onUpdateOdontogramFindings={onUpdateOdontogramFindings}
                    conditionColors={conditionColors}
                  />
                </div>
              )}

              {/* SUBTAB 2: ODONTOGRAMA INTERACTIVO EMBEBIDO EN LA FICHA */}
              {activePatientSubTab === 'odontograma' && (
                <div className="animate-fade-in pt-2">
                  <Odontogram 
                    patient={selectedPatient}
                    onUpdateFindings={onUpdateOdontogramFindings}
                    conditionColors={conditionColors}
                  />
                </div>
              )}

              {/* SUBTAB 3: EVOLUCIÓN CLÍNICA DEL TURNO / TRATAMIENTOS DEL DÍA */}
              {activePatientSubTab === 'evoluciones' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-teal-600" />
                        Historial de Evolución del Turno & Tratamientos Diarios
                      </h4>
                      <p className="text-xs text-slate-500">Registra lo que se realiza en cada sesión o consulta clínica.</p>
                    </div>

                    <button
                      onClick={handleOpenCreateEvolution}
                      className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Registrar Evolución del Día
                    </button>
                  </div>

                  {/* Timeline de evoluciones */}
                  {!selectedPatient.evolutions || selectedPatient.evolutions.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <FilePlus className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="font-bold text-slate-700 text-sm">Sin evoluciones clínicas registradas aún</p>
                      <p className="text-xs text-slate-400 mt-1">Haz clic en "Registrar Evolución del Día" para añadir la primera nota clínica de atención.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                      {selectedPatient.evolutions.map((evo) => (
                        <div key={evo.id} className="relative pl-8 animate-fade-in">
                          <span className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center ring-4 ring-white shadow-xs">
                            🩺
                          </span>

                          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-300 transition-all space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {evo.date}
                                </span>
                                <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                                  👨‍⚕️ {evo.dentistName}
                                </span>
                                {evo.toothNumber && (
                                  <span className="font-extrabold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                                    Pieza #{evo.toothNumber}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenEditEvolution(evo)}
                                  className="text-slate-400 hover:text-teal-600 transition p-1.5 rounded-lg hover:bg-slate-100"
                                  title="Editar evolución clínica"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                {onDeleteClinicalEvolution && (
                                  <button
                                    onClick={() => onDeleteClinicalEvolution(selectedPatient.id, evo.id)}
                                    className="text-slate-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-slate-100"
                                    title="Eliminar evolución"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                              <strong>Procedimiento / Tratamiento del día:</strong>
                              <p className="text-slate-800 font-normal mt-0.5">{evo.treatment}</p>
                            </div>

                            {evo.notes && (
                              <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700">
                                <strong className="text-teal-800 block mb-0.5">Observaciones & Prescripciones:</strong>
                                <span>{evo.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <p className="text-slate-400 text-center py-20">Selecciona un paciente de la lista para ver su ficha clínica completa.</p>
          )}
        </div>

      </div>

      {/* MODAL REGISTRAR / EDITAR EVOLUCIÓN CLÍNICA DEL DÍA */}
      {showEvolutionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="bg-teal-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {editingEvolutionId ? 'Editar Evolución del Turno' : 'Registrar Evolución del Turno / Día'}
              </h3>
              <button onClick={() => setShowEvolutionModal(false)} className="text-teal-100 hover:text-white font-bold text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvolution} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Fecha del Turno *</label>
                  <input
                    type="date"
                    required
                    value={evoDate}
                    onChange={e => setEvoDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Odontólogo/a Tratante *</label>
                  <select
                    value={evoDentist}
                    onChange={e => setEvoDentist(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {dentists.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>
                    ))}
                    {dentists.length === 0 && (
                      <option value="Dra. Amalia Merlo">Dra. Amalia Merlo</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Pieza Dental Intervenida (Opcional):</label>
                <input
                  type="number"
                  placeholder="Ej. 16, 24, 36..."
                  value={evoTooth}
                  onChange={e => setEvoTooth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tratamiento Realizado / Evolución del Día *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describa el trabajo realizado en el turno (ej. Apertura y conductometría, obturación con composite...)"
                  value={evoTreatment}
                  onChange={e => setEvoTreatment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Observaciones & Prescripciones (Opcional):</label>
                <textarea
                  rows={2}
                  placeholder="Medicación recetada, recomendaciones al paciente, próximo turno..."
                  value={evoNotes}
                  onChange={e => setEvoNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEvolutionModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition"
                >
                  Guardar Evolución
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR NUEVO PACIENTE */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-teal-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Ficha de Alta de Nuevo Paciente
              </h3>
              <button onClick={() => setShowModal(false)} className="text-teal-100 hover:text-white font-bold text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-teal-600" /> Foto del Paciente (Opcional)
                </label>
                <div className="flex items-center space-x-4">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="w-14 h-14 rounded-xl object-cover border-2 border-teal-500" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <label className="px-3 py-1.5 bg-teal-600 text-white font-bold text-xs rounded-lg hover:bg-teal-700 cursor-pointer inline-flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> Subir Imagen
                      <input type="file" accept="image/*" onChange={handleFileUploadPhoto} className="hidden" />
                    </label>
                    <input
                      type="url"
                      placeholder="O pega la URL de la foto..."
                      value={photoUrl}
                      onChange={e => setPhotoUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ana Paula Fernández"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">DNI / Documento *</label>
                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Ej. 35.123.456"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Edad *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Teléfono Móvil *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+54 9 11 ..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="paciente@email.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Obra Social / Cobertura:</label>
                  <input
                    type="text"
                    value={healthInsurance}
                    onChange={(e) => setHealthInsurance(e.target.value)}
                    placeholder="OSDE, Swiss Medical, IOMA, Particular..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">N° de Afiliado:</label>
                  <input
                    type="text"
                    value={insuranceNumber}
                    onChange={(e) => setInsuranceNumber(e.target.value)}
                    placeholder="N° credencial"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1 text-red-700">Alergias Medicamentosas o del Paciente:</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Ej. Penicilina, Látex, Aspirina (o 'Ninguna')"
                  className="w-full px-3 py-2 rounded-xl border border-red-200 bg-red-50/50 text-sm text-red-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Antecedentes Médicos / Enfermedades:</label>
                <textarea
                  rows={2}
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="Diabetes, hipertensión, prótesis, medicación crónica..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition"
                >
                  Guardar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADJUNTAR RADIOGRAFÍA */}
      {showXRayModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fade-in">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2 text-teal-400">
                <Camera className="w-5 h-5" /> Adjuntar Estructura / Radiografía
              </h3>
              <button onClick={() => setShowXRayModal(false)} className="text-slate-400 hover:text-white font-bold text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddXRay} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Título de la Placa / Estudio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Panorámica Pre-Tratamiento, Periapical #16"
                  value={xrayTitle}
                  onChange={e => setXRayTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tipo de Estudio:</label>
                  <select
                    value={xrayType}
                    onChange={e => setXRayType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="panoramica">Panorámica</option>
                    <option value="periapical">Periapical</option>
                    <option value="oclusal">Oclusal</option>
                    <option value="tomografia">Tomografía (CBCT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Fecha de la Placa:</label>
                  <input
                    type="date"
                    value={xrayDate}
                    onChange={e => setXRayDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Imagen de la Radiografía *</label>
                <input
                  type="text"
                  required
                  placeholder="Pegue la URL de la imagen o archivo..."
                  value={xrayImage}
                  onChange={e => setXRayImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Notas / Informe Radiológico:</label>
                <textarea
                  rows={2}
                  placeholder="Hallazgos en la placa..."
                  value={xrayNotes}
                  onChange={e => setXRayNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowXRayModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-md transition"
                >
                  Guardar Radiografía
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX VISOR DE RADIOGRAFÍAS */}
      {activeXRayLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white overflow-hidden space-y-4">
            <button
              onClick={() => setActiveXRayLightbox(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-extrabold text-2xl z-10"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <Camera className="w-5 h-5 text-teal-400" />
              <div>
                <h3 className="font-extrabold text-lg text-white">{activeXRayLightbox.title}</h3>
                <span className="text-xs text-teal-400 uppercase font-bold tracking-wider">{activeXRayLightbox.type} • {activeXRayLightbox.date}</span>
              </div>
            </div>

            <div className="max-h-[65vh] overflow-hidden rounded-xl bg-black flex items-center justify-center border border-slate-800">
              <img
                src={activeXRayLightbox.imageUrl}
                alt={activeXRayLightbox.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            {activeXRayLightbox.notes && (
              <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                <strong className="text-teal-400 block mb-0.5">Informe Radiológico:</strong>
                {activeXRayLightbox.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* MODAL EDITAR DECLARACIÓN JURADA DE SALUD (ANAMNESIS) */}
      {showHealthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in">
            <div className="bg-teal-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <ClipboardList className="w-5 h-5" /> Editar Declaración Jurada de Salud (Anamnesis)
              </h3>
              <button onClick={() => setShowHealthModal(false)} className="text-teal-100 hover:text-white font-bold text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHealthDeclaration} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              <div>
                <h4 className="font-extrabold text-teal-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-800">
                  1. Enfermedades Preexistentes y Condición Crónica
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 cursor-pointer hover:bg-slate-800">
                    <input type="checkbox" checked={hypertension} onChange={e => setHypertension(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-400" />
                    <span className="font-bold text-slate-200">🔴 Hipertensión Arterial</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 cursor-pointer hover:bg-slate-800">
                    <input type="checkbox" checked={diabetes} onChange={e => setDiabetes(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-400" />
                    <span className="font-bold text-slate-200">🔴 Diabetes Mellitus</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 cursor-pointer hover:bg-slate-800">
                    <input type="checkbox" checked={cardiacDisease} onChange={e => setCardiacDisease(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-400" />
                    <span className="font-bold text-slate-200">❤️ Cardiopatías / Marcapasos</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 cursor-pointer hover:bg-slate-800">
                    <input type="checkbox" checked={anticoagulants} onChange={e => setAnticoagulants(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-400" />
                    <span className="font-bold text-slate-200">⚠️ Anticoagulados / Hemorragias</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 cursor-pointer hover:bg-slate-800">
                    <input type="checkbox" checked={respiratoryDisease} onChange={e => setRespiratoryDisease(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-400" />
                    <span className="font-bold text-slate-200">🫁 Asma / Enf. Respiratoria</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 cursor-pointer hover:bg-slate-800">
                    <input type="checkbox" checked={hepatitis} onChange={e => setHepatitis(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-400" />
                    <span className="font-bold text-slate-200">🩺 Hepatitis / Enf. Hepática</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 cursor-pointer hover:bg-slate-800 sm:col-span-2">
                    <input type="checkbox" checked={epilepsy} onChange={e => setEpilepsy(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-400" />
                    <span className="font-bold text-slate-200">🧠 Epilepsia / Convulsiones</span>
                  </label>
                </div>

                {/* Agregar Otra Enfermedad Personalizada */}
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-teal-300 uppercase">
                    ➕ Agregar Otra Enfermedad o Condición Preexistente:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej. Hipotiroidismo, Insuficiencia Renal, Lupus..."
                      value={newCustomInput}
                      onChange={e => setNewCustomInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomCondition();
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomCondition}
                      className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition shrink-0 flex items-center gap-1"
                    >
                      <span>Agregar +</span>
                    </button>
                  </div>

                  {customConditions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 pt-1">
                      {customConditions.map((cond, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-teal-950/90 border border-teal-500/50 text-teal-200 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
                        >
                          <span>🩺 {cond}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomCondition(idx)}
                            className="text-teal-400 hover:text-red-400 font-extrabold text-sm leading-none ml-1"
                            title="Eliminar esta condición"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-teal-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-800">
                  2. Estado Actual, Alergias y Embarazo
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2 bg-red-950/40 p-2.5 rounded-xl border border-red-800/50 cursor-pointer hover:bg-red-950/60">
                    <input type="checkbox" checked={localAnesthesiaAllergy} onChange={e => setLocalAnesthesiaAllergy(e.target.checked)} className="rounded text-red-500 focus:ring-red-400" />
                    <span className="font-extrabold text-red-200">🛑 Alergia a Anestesia Local</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 cursor-pointer hover:bg-slate-800">
                    <input type="checkbox" checked={activeInfection} onChange={e => setActiveInfection(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-400" />
                    <span className="font-bold text-slate-200">🔥 Infección Activa en Curso</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 cursor-pointer hover:bg-slate-800">
                    <input type="checkbox" checked={fever} onChange={e => setFever(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-400" />
                    <span className="font-bold text-slate-200">🌡️ Fiebre Reciente</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 cursor-pointer hover:bg-slate-800">
                    <input type="checkbox" checked={pregnantOrLactating} onChange={e => setPregnantOrLactating(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-400" />
                    <span className="font-bold text-slate-200">🤰 Embarazo / Lactancia</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-teal-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-800">
                  3. Medicamentos y Cirugías
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Medicación Actual en Curso (fármacos, dosis, horarios):</label>
                    <textarea
                      rows={2}
                      placeholder="Ej. Enalapril 10mg diario, Amoxicilina 500mg cada 8hs..."
                      value={currentMedication}
                      onChange={e => setCurrentMedication(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Cirugías, Intervenciones u Operaciones Recientes:</label>
                    <textarea
                      rows={2}
                      placeholder="Ej. Reemplazo de cadera 2024, Colecistectomía..."
                      value={recentSurgeries}
                      onChange={e => setRecentSurgeries(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowHealthModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:bg-slate-800 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-md transition"
                >
                  Guardar Planilla de Salud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
