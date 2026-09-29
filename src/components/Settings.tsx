import React, { useState, useMemo, useEffect } from 'react';
import { Building2, UserPlus, Stethoscope, ShieldCheck, Phone, Mail, FileBadge, Check, Trash2, Edit2, Sparkles, Save, Download, Upload, Database, RefreshCw, AlertCircle, Palette, RotateCcw, Clock, Calendar, Server, CheckCircle2, CloudLightning, MessageCircle, Eye, Users } from 'lucide-react';
import { Dentist, Patient, Appointment, Budget, ConditionType, ClinicScheduleConfig, DayOfWeek, DaySchedule } from '../types';
import { CONDITION_METAS, DEFAULT_CLINIC_SCHEDULE } from '../data/mockData';
import { apiService, AppAccessRecord } from '../services/apiService';

interface SettingsProps {
  clinicName: string;
  onUpdateClinicName: (newName: string) => void;
  clinicAddress: string;
  onUpdateClinicAddress: (newAddress: string) => void;
  clinicPhone: string;
  onUpdateClinicPhone: (newPhone: string) => void;
  dentists: Dentist[];
  onAddDentist: (dentist: Dentist) => void;
  onToggleDentistStatus: (id: string) => void;
  onDeleteDentist: (id: string) => void;
  patients: Patient[];
  appointments: Appointment[];
  budgets: Budget[];
  onRestoreBackupData: (backupData: any) => void;
  conditionColors: Record<ConditionType, string>;
  onUpdateConditionColor: (conditionId: ConditionType, newColor: string) => void;
  onResetConditionColors: () => void;
  clinicSchedule: ClinicScheduleConfig;
  onUpdateClinicSchedule: (newSchedule: ClinicScheduleConfig) => void;
  syncStatus?: 'idle' | 'syncing' | 'synced' | 'error';
  onSyncAllToMySQL?: () => Promise<any>;
  onFetchAllFromMySQL?: () => Promise<any>;
  onCheckMySQL?: () => Promise<any>;
}

export const Settings: React.FC<SettingsProps> = ({
  clinicName,
  onUpdateClinicName,
  clinicAddress,
  onUpdateClinicAddress,
  clinicPhone,
  onUpdateClinicPhone,
  dentists,
  onAddDentist,
  onToggleDentistStatus,
  onDeleteDentist,
  patients,
  appointments,
  budgets,
  onRestoreBackupData,
  conditionColors,
  onUpdateConditionColor,
  onResetConditionColors,
  clinicSchedule,
  onUpdateClinicSchedule,
  syncStatus = 'synced',
  onSyncAllToMySQL,
  onFetchAllFromMySQL,
  onCheckMySQL
}) => {
  // Estado local para los campos del consultorio
  const [tempClinicName, setTempClinicName] = useState(clinicName);
  const [tempAddress, setTempAddress] = useState(clinicAddress);
  const [tempPhone, setTempPhone] = useState(clinicPhone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estado local para la grilla de horarios del consultorio
  const [tempSchedule, setTempSchedule] = useState<ClinicScheduleConfig>(clinicSchedule || DEFAULT_CLINIC_SCHEDULE);
  const [scheduleSavedMessage, setScheduleSavedMessage] = useState(false);

  const handleToggleDayOpen = (dayKey: DayOfWeek, isOpen: boolean) => {
    setTempSchedule(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], isOpen }
    }));
  };

  const handleUpdateDayTime = (dayKey: DayOfWeek, field: keyof DaySchedule, value: any) => {
    setTempSchedule(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value }
    }));
  };

  const handleSaveSchedule = () => {
    onUpdateClinicSchedule(tempSchedule);
    setScheduleSavedMessage(true);
    setTimeout(() => setScheduleSavedMessage(false), 3500);
  };

  // Estado local para el formulario de nuevo Odontólogo/a
  const [newDentistName, setNewDentistName] = useState('');
  const [newLicense, setNewLicense] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('Odontología General & Ortodoncia');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [dentistSavedMessage, setDentistSavedMessage] = useState(false);

  // Estado local para Backup
  const [restoreSuccessMessage, setRestoreSuccessMessage] = useState(false);
  const [restoreErrorMessage, setRestoreErrorMessage] = useState('');

  // Filtro de categoría en gestor de colores
  const [colorCategoryFilter, setColorCategoryFilter] = useState<string>('todas');

  // Estado local para MySQL Ferozo
  const [dbCheckResult, setDbCheckResult] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbStatusMsg, setDbStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleTestConnection = async () => {
    if (!onCheckMySQL) return;
    setDbLoading(true);
    setDbStatusMsg({ text: 'Verificando tablas y conexión MySQL en Ferozo...', type: 'info' });
    try {
      const res = await onCheckMySQL();
      setDbCheckResult(res);
      if (res && res.success) {
        setDbStatusMsg({ text: '¡Conexión y tablas verificadas con éxito en MySQL a0170001_colsul!', type: 'success' });
      } else {
        setDbStatusMsg({ text: res?.message || 'Error al conectar con la base de datos', type: 'error' });
      }
    } catch (e: any) {
      setDbStatusMsg({ text: e.message || 'Error de red con el servidor DonWeb', type: 'error' });
    } finally {
      setDbLoading(false);
    }
  };

  const handleManualSyncAll = async () => {
    if (!onSyncAllToMySQL) return;
    setDbLoading(true);
    setDbStatusMsg({ text: 'Sincronizando pacientes, turnos y estudios hacia MySQL Ferozo...', type: 'info' });
    try {
      const res = await onSyncAllToMySQL();
      if (res && res.success) {
        setDbStatusMsg({ 
          text: `¡Sincronizado! Guardados en MySQL: ${res.saved?.pacientes ?? 0} pacientes, ${res.saved?.turnos ?? 0} turnos, ${res.saved?.presupuestos ?? 0} presupuestos.`, 
          type: 'success' 
        });
      } else {
        setDbStatusMsg({ text: res?.message || 'Fallo en la sincronización con MySQL', type: 'error' });
      }
    } catch (e: any) {
      setDbStatusMsg({ text: e.message || 'Error al sincronizar con el servidor', type: 'error' });
    } finally {
      setDbLoading(false);
    }
  };

  const handleManualFetchAll = async () => {
    if (!onFetchAllFromMySQL) return;
    setDbLoading(true);
    setDbStatusMsg({ text: 'Descargando datos actualizados desde MySQL Ferozo...', type: 'info' });
    try {
      const res = await onFetchAllFromMySQL();
      if (res) {
        setDbStatusMsg({ text: '¡Datos descargados y actualizados exitosamente desde MySQL Ferozo!', type: 'success' });
      } else {
        setDbStatusMsg({ text: 'No se pudieron descargar los datos desde MySQL.', type: 'error' });
      }
    } catch (e: any) {
      setDbStatusMsg({ text: e.message || 'Error al descargar datos del servidor', type: 'error' });
    } finally {
      setDbLoading(false);
    }
  };

  // Estado local para Registros de Acceso de Usuarios
  const [registros, setRegistros] = useState<AppAccessRecord[]>([]);
  const [loadingRegistros, setLoadingRegistros] = useState(false);

  const fetchRegistros = async () => {
    setLoadingRegistros(true);
    try {
      const data = await apiService.getRegistros();
      setRegistros(data);
    } catch (e) {
      console.warn('Error al cargar registros de acceso:', e);
    } finally {
      setLoadingRegistros(false);
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  const handleDeleteRegistro = async (id: number) => {
    if (!window.confirm('¿Deseas eliminar este registro de acceso?')) return;
    const ok = await apiService.deleteRegistro(id);
    if (ok) {
      setRegistros(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSaveClinicSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempClinicName.trim()) return;
    onUpdateClinicName(tempClinicName.trim());
    onUpdateClinicAddress(tempAddress.trim());
    onUpdateClinicPhone(tempPhone.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCreateDentist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDentistName.trim() || !newLicense.trim()) return;

    const newDentist: Dentist = {
      id: 'dentist-' + Date.now(),
      name: newDentistName.trim(),
      licenseNumber: newLicense.trim(),
      specialty: newSpecialty.trim(),
      phone: newPhone.trim() || '+54 9 11 0000-0000',
      email: newEmail.trim() || 'contacto@consultorio.com',
      active: true
    };

    onAddDentist(newDentist);
    setNewDentistName('');
    setNewLicense('');
    setNewPhone('');
    setNewEmail('');
    setDentistSavedMessage(true);
    setTimeout(() => setDentistSavedMessage(false), 3000);
  };

  // Handler para Descargar Backup a la PC del cliente
  const handleDownloadBackup = () => {
    const fullData = {
      version: '1.2.0',
      exportDate: new Date().toISOString(),
      clinicInfo: {
        name: clinicName,
        address: clinicAddress,
        phone: clinicPhone
      },
      conditionColors,
      dentists,
      patients,
      appointments,
      budgets
    };

    const jsonStr = JSON.stringify(fullData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `backup-odontomerlo-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handler para Cargar y Restaurar Backup desde la PC del cliente
  const handleFileUploadRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target?.result as string);
        if (!parsedData.clinicInfo || !parsedData.patients) {
          throw new Error('El archivo no contiene un formato de copia de seguridad válido.');
        }
        onRestoreBackupData(parsedData);
        if (parsedData.clinicInfo.name) setTempClinicName(parsedData.clinicInfo.name);
        if (parsedData.clinicInfo.address) setTempAddress(parsedData.clinicInfo.address);
        if (parsedData.clinicInfo.phone) setTempPhone(parsedData.clinicInfo.phone);

        setRestoreSuccessMessage(true);
        setTimeout(() => setRestoreSuccessMessage(false), 4000);
      } catch (err: any) {
        setRestoreErrorMessage(err.message || 'Error al leer el archivo de backup.');
        setTimeout(() => setRestoreErrorMessage(''), 4000);
      }
    };
    reader.readAsText(file);
  };

  const filteredConditionList = useMemo(() => {
    return Object.values(CONDITION_METAS).filter(cond => {
      return colorCategoryFilter === 'todas' || cond.category === colorCategoryFilter;
    });
  }, [colorCategoryFilter]);

  // Preset Palettes
  const applyPresetPalette = (preset: 'facultad' | 'neon' | 'pastel') => {
    if (preset === 'facultad') {
      onResetConditionColors();
    } else if (preset === 'neon') {
      const neonMap: Partial<Record<ConditionType, string>> = {
        caries_np: '#ff0055',
        caries_p: '#ff0000',
        obturado: '#00d2ff',
        obturacion_defectuosa: '#ef4444',
        endodoncia: '#7b00ff',
        corona: '#00ffaa',
        incrustacion: '#00ffff',
        implante: '#39ff14',
        extraccion_indicada: '#ff007f',
        ausente: '#ff2a2a',
        extraido: '#0055ff'
      };
      Object.keys(neonMap).forEach(key => {
        onUpdateConditionColor(key as ConditionType, neonMap[key as ConditionType]!);
      });
    } else if (preset === 'pastel') {
      const pastelMap: Partial<Record<ConditionType, string>> = {
        caries_np: '#f87171',
        caries_p: '#ef4444',
        obturado: '#60a5fa',
        obturacion_defectuosa: '#f87171',
        endodoncia: '#818cf8',
        corona: '#38bdf8',
        incrustacion: '#38bdf8',
        implante: '#34d399',
        extraccion_indicada: '#fb7185',
        ausente: '#f87171',
        extraido: '#3b82f6'
      };
      Object.keys(pastelMap).forEach(key => {
        onUpdateConditionColor(key as ConditionType, pastelMap[key as ConditionType]!);
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Encabezado del Módulo */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              ⚙️
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Configuración & Personalización Profesional</h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Administra los datos de la clínica, odontólogos, personalización de colores del odontograma y copias de seguridad.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Odonto Merlo v1.6</span>
        </div>
      </div>

      {/* SECCIÓN HORARIOS Y DÍAS DE ATENCIÓN DEL CONSULTORIO */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Días y Horarios de Atención del Consultorio</h3>
              <p className="text-xs text-slate-500">Configura los días abiertos y la franja horaria disponible para la reserva de turnos de pacientes.</p>
            </div>
          </div>
          {scheduleSavedMessage && (
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              ¡Horarios del consultorio guardados!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as DayOfWeek[]).map(dayKey => {
            const dayData = tempSchedule[dayKey] || DEFAULT_CLINIC_SCHEDULE[dayKey];
            return (
              <div
                key={dayKey}
                className={`p-4 rounded-xl border transition-all ${
                  dayData.isOpen
                    ? 'bg-slate-50 border-teal-200 ring-1 ring-teal-100 shadow-xs'
                    : 'bg-slate-100/60 border-slate-200 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 pb-2">
                  <span className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    {dayData.label}
                  </span>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dayData.isOpen}
                      onChange={e => handleToggleDayOpen(dayKey, e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span className={`text-[11px] font-black ${dayData.isOpen ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {dayData.isOpen ? 'ABIERTO' : 'CERRADO'}
                    </span>
                  </label>
                </div>

                {dayData.isOpen ? (
                  <div className="space-y-2.5 text-xs">
                    {/* Tramo 1 */}
                    <div className="bg-white p-2 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-wider block">
                        {dayData.hasSplitShift ? 'Turno Mañana (Tramo 1):' : 'Horario Continuo:'}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Apertura 1:</label>
                          <input
                            type="time"
                            value={dayData.startTime || '08:00'}
                            onChange={e => handleUpdateDayTime(dayKey, 'startTime', e.target.value)}
                            className="w-full px-2 py-1 rounded-md border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Cierre 1:</label>
                          <input
                            type="time"
                            value={dayData.endTime || '13:00'}
                            onChange={e => handleUpdateDayTime(dayKey, 'endTime', e.target.value)}
                            className="w-full px-2 py-1 rounded-md border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Checkbox Horario Cortado */}
                    <label className="flex items-center space-x-2 cursor-pointer bg-teal-50/60 p-2 rounded-lg border border-teal-100 hover:bg-teal-50 transition">
                      <input
                        type="checkbox"
                        checked={dayData.hasSplitShift || false}
                        onChange={e => handleUpdateDayTime(dayKey, 'hasSplitShift', e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                      />
                      <span className="text-[11px] font-extrabold text-teal-900">
                        ☕ Horario Cortado (Re-apertura Tarde)
                      </span>
                    </label>

                    {/* Tramo 2 (Tarde) */}
                    {dayData.hasSplitShift && (
                      <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200/80 space-y-1 animate-fade-in">
                        <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
                          Turno Tarde (Tramo 2):
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Re-Apertura:</label>
                            <input
                              type="time"
                              value={dayData.startTime2 || '16:00'}
                              onChange={e => handleUpdateDayTime(dayKey, 'startTime2', e.target.value)}
                              className="w-full px-2 py-1 rounded-md border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Cierre Final:</label>
                            <input
                              type="time"
                              value={dayData.endTime2 || '20:00'}
                              onChange={e => handleUpdateDayTime(dayKey, 'endTime2', e.target.value)}
                              className="w-full px-2 py-1 rounded-md border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Duración del Turno:</label>
                      <select
                        value={dayData.slotDurationMinutes}
                        onChange={e => handleUpdateDayTime(dayKey, 'slotDurationMinutes', Number(e.target.value))}
                        className="w-full px-2 py-1 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                      >
                        <option value={20}>20 Minutos</option>
                        <option value={30}>30 Minutos</option>
                        <option value={45}>45 Minutos</option>
                        <option value={60}>60 Minutos (1 hora)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-4 text-center font-medium">Consultorio Cerrado</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveSchedule}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Días y Horarios de Atención</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECCIÓN 1: NOMBRE Y DATOS DEL CONSULTORIO */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">1. Nombre del Consultorio</h3>
              <p className="text-xs text-slate-500">Información visible en la portada, turnos y presupuestos.</p>
            </div>
          </div>

          <form onSubmit={handleSaveClinicSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nombre del Consultorio *</label>
              <input
                type="text"
                required
                value={tempClinicName}
                onChange={e => setTempClinicName(e.target.value)}
                placeholder="Ej: Odonto Merlo"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Dirección del Consultorio</label>
              <input
                type="text"
                value={tempAddress}
                onChange={e => setTempAddress(e.target.value)}
                placeholder="Ej: Av. del Libertador 1450, Merlo"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Teléfono Principal de Contacto</label>
              <input
                type="text"
                value={tempPhone}
                onChange={e => setTempPhone(e.target.value)}
                placeholder="Ej: +54 9 11 4589-1234"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
              />
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>¡Nombre y datos del consultorio actualizados correctamente!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios del Consultorio</span>
            </button>
          </form>
        </div>

        {/* SECCIÓN 2: FORMULARIO DE ALTA DE ODONTÓLOGOS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">2. Crear Nuevo/a Odontólogo/a</h3>
              <p className="text-xs text-slate-500">Registra un nuevo profesional para atender y firmar historias clínicas.</p>
            </div>
          </div>

          <form onSubmit={handleCreateDentist} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Dra. Amalia Merlo"
                  value={newDentistName}
                  onChange={e => setNewDentistName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Matrícula Profesional (MN/MP) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: MP 48902"
                  value={newLicense}
                  onChange={e => setNewLicense(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Especialidad Principal</label>
              <input
                type="text"
                placeholder="Ej: Endodoncia & Ortodoncia"
                value={newSpecialty}
                onChange={e => setNewSpecialty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Teléfono Directo</label>
                <input
                  type="tel"
                  placeholder="Ej: +54 9 11 3456-7890"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="Ej: dra.merlo@odontomerlo.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
                />
              </div>
            </div>

            {dentistSavedMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>¡Nuevo/a Odontólogo/a dado de alta exitosamente!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrar Odontólogo/a</span>
            </button>
          </form>
        </div>

      </div>

      {/* SECCIÓN 3: PERSONALIZACIÓN DE COLORES DEL ODONTOGRAMA Y TRATAMIENTOS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                3. Personalización de Colores del Odontograma y Tratamientos
                <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  23 Patologías y Tratamientos
                </span>
              </h3>
              <p className="text-xs text-slate-500">Cambia el color de cada afección o tratamiento para adaptar el odontograma a tus preferencias clínicas.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyPresetPalette('facultad')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Colores FDI Tradicionales de Universidad"
            >
              🎓 Facultad Tradicional
            </button>
            <button
              onClick={() => applyPresetPalette('neon')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 transition"
              title="Colores de Alto Contraste / Neón"
            >
              ⚡ Neón / Alto Contraste
            </button>
            <button
              onClick={() => applyPresetPalette('pastel')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 transition"
              title="Colores Pasteles Suaves"
            >
              🎨 Pastel Clínico
            </button>
            <button
              onClick={onResetConditionColors}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition flex items-center gap-1"
              title="Restablecer todos los colores a valores por defecto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer
            </button>
          </div>
        </div>

        {/* Filtros de Categoría para Colores */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {[
            { id: 'todas', label: 'Todas (23)' },
            { id: 'patologia', label: 'Patologías & Hallazgos (8)' },
            { id: 'tratamiento', label: 'Tratamientos & Restauraciones (7)' },
            { id: 'protesis', label: 'Prótesis, Implantes & Cirugía (8)' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setColorCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                colorCategoryFilter === cat.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de Selectores de Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredConditionList.map((cond) => {
            const currentColor = conditionColors[cond.id] || cond.color;
            return (
              <div 
                key={cond.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-purple-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Visual Preview Swatch */}
                  <div 
                    className="w-8 h-8 rounded-xl border border-slate-300 shadow-inner flex items-center justify-center text-xs shrink-0 relative overflow-hidden"
                    style={{ backgroundColor: currentColor }}
                  >
                    {cond.symbol && <span className="font-extrabold text-white drop-shadow-xs">{cond.symbol}</span>}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-800 truncate" title={cond.label}>{cond.label}</h4>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{currentColor}</span>
                  </div>
                </div>

                {/* Color Picker Input */}
                <div className="relative shrink-0">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => onUpdateConditionColor(cond.id, e.target.value)}
                    className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white shadow-xs hover:scale-105 transition-transform"
                    title={`Cambiar color para: ${cond.label}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 4: COPIA DE SEGURIDAD Y RESTAURACIÓN LOCAL (PC DEL CLIENTE) */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold border border-teal-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                4. Copia de Seguridad & Respaldos (PC Local del Cliente)
                <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  100% Seguro 🛡️
                </span>
              </h3>
              <p className="text-xs text-slate-400">Descarga un archivo con toda tu información a tu computadora o restaura un backup previo.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Opción A: Descargar Backup */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm mb-2">
                <Download className="w-4 h-4" />
                <span>A. Descargar Copia de Seguridad a tu Computadora</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Descarga un archivo seguro conteniendo la lista de pacientes, odontogramas, colores personalizados, turnos y presupuestos.
              </p>
            </div>

            <button
              onClick={handleDownloadBackup}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Backup Ahora (.json)</span>
            </button>
          </div>

          {/* Opción B: Restaurar Backup */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm mb-2">
                <RefreshCw className="w-4 h-4" />
                <span>B. Restaurar Datos desde un Backup Previo</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Selecciona un archivo de backup previamente descargado (`.json`) para recuperar instantáneamente todos tus datos.
              </p>
            </div>

            <div>
              <label className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-all">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>Seleccionar y Restaurar Backup</span>
                <input type="file" accept=".json" onChange={handleFileUploadRestore} className="hidden" />
              </label>
            </div>
          </div>

        </div>

        {restoreSuccessMessage && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>¡Copia de seguridad restaurada exitosamente! Todos los pacientes, turnos e historias clínicas han sido recuperados.</span>
          </div>
        )}

        {restoreErrorMessage && (
          <div className="p-4 bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{restoreErrorMessage}</span>
          </div>
        )}
      </div>

      {/* SECCIÓN 5: BASE DE DATOS MYSQL EN FEROZO (DONWEB) */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-teal-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold border border-teal-500/40">
              <Server className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                5. Base de Datos MySQL en Ferozo (DonWeb)
                <span className="text-[10px] font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                  Conexión Activa
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Base de datos oficial <code className="text-teal-300 font-mono">a0170001_colsul</code> en Ferozo · Policonsultorio Colsul
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Estado:</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              syncStatus === 'syncing' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              syncStatus === 'error' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                syncStatus === 'syncing' ? 'bg-amber-400 animate-ping' :
                syncStatus === 'error' ? 'bg-rose-400' : 'bg-emerald-400'
              }`}></span>
              {syncStatus === 'syncing' ? 'Sincronizando...' : syncStatus === 'error' ? 'Error' : 'MySQL Vinculado'}
            </span>
          </div>
        </div>

        {/* Resumen de Tablas y Datos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Pacientes</span>
            <span className="text-xl font-extrabold text-teal-300">{patients.length}</span>
            <span className="text-[10px] text-slate-500 block">En memoria local</span>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Turnos Médicos</span>
            <span className="text-xl font-extrabold text-sky-300">{appointments.length}</span>
            <span className="text-[10px] text-slate-500 block">Agenda total</span>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Presupuestos</span>
            <span className="text-xl font-extrabold text-amber-300">{budgets.length}</span>
            <span className="text-[10px] text-slate-500 block">Tratamientos</span>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Especialidades</span>
            <span className="text-xl font-extrabold text-purple-300">15</span>
            <span className="text-[10px] text-slate-500 block">10 Consultorios</span>
          </div>
        </div>

        {/* Botones de acción MySQL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleManualSyncAll}
            disabled={dbLoading}
            className="py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md shadow-teal-500/20 flex items-center justify-center space-x-2"
          >
            <CloudLightning className="w-4 h-4" />
            <span>Sincronizar Todo a MySQL</span>
          </button>

          <button
            onClick={handleManualFetchAll}
            disabled={dbLoading}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-sky-300 font-extrabold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${dbLoading ? 'animate-spin' : ''}`} />
            <span>Descargar Todo desde MySQL</span>
          </button>

          <button
            onClick={handleTestConnection}
            disabled={dbLoading}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-teal-300 font-extrabold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verificar Tablas en Ferozo</span>
          </button>
        </div>

        {/* Mensaje de estado */}
        {dbStatusMsg && (
          <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in border ${
            dbStatusMsg.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
            dbStatusMsg.type === 'error' ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' :
            'bg-sky-500/20 border-sky-500/40 text-sky-300'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current shrink-0"></span>
            <span>{dbStatusMsg.text}</span>
          </div>
        )}

        {/* Detalle técnico de verificación de tablas */}
        {dbCheckResult && dbCheckResult.tables && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <span className="font-mono text-teal-400 block font-bold text-[11px]">
              Estatus del Esquema SQL en DonWeb ({dbCheckResult.database}):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              {Object.entries(dbCheckResult.tables).map(([tbl, info]: [string, any]) => (
                <div key={tbl} className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">{tbl}</span>
                  <span className="text-emerald-400 font-bold">✓ {info.records ?? 0} reg</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabla de Personas Registradas que usan la App */}
        <div className="pt-5 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-teal-400" />
              <h4 className="font-bold text-white text-sm">
                Personas Registradas que usan la App ({registros.length})
              </h4>
            </div>
            <button
              onClick={fetchRegistros}
              disabled={loadingRegistros}
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingRegistros ? 'animate-spin' : ''}`} />
              <span>Actualizar Registros</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Aquí quedan guardados todos los usuarios que ingresan su Nombre y Celular en la pantalla de bienvenida.
          </p>

          {registros.length === 0 ? (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
              No hay personas registradas aún en la base de datos MySQL.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Fecha y Hora</th>
                    <th className="py-2.5 px-3">Nombre Completo</th>
                    <th className="py-2.5 px-3">Celular</th>
                    <th className="py-2.5 px-3">Rol / Usuario</th>
                    <th className="py-2.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {registros.map((reg) => {
                    const cleanPhone = reg.celular.replace(/[^0-9]/g, '');
                    return (
                      <tr key={reg.id} className="hover:bg-slate-900/50 transition">
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {reg.fecha_registro}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">
                          {reg.nombre}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 font-mono text-xs transition"
                            title="Abrir chat en WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{reg.celular}</span>
                          </a>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                            {reg.usuario || 'Usuario'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteRegistro(reg.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition cursor-pointer"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 6: LISTADO Y ESTADO DE ODONTÓLOGOS DEL STAFF */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Staff Odontológico ({dentists.length} Registrados)</h3>
              <p className="text-xs text-slate-500">Nómina de odontólogos habilitados para atender en el consultorio.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dentists.map((dentist) => (
            <div
              key={dentist.id}
              className={`p-5 rounded-2xl border transition-all ${
                dentist.active
                  ? 'border-slate-200 bg-white shadow-xs hover:border-teal-300'
                  : 'border-slate-200 bg-slate-50 opacity-75'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    👨‍⚕️
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{dentist.name}</h4>
                    <span className="text-xs text-teal-700 font-bold flex items-center gap-1">
                      <FileBadge className="w-3.5 h-3.5" />
                      {dentist.licenseNumber}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleDentistStatus(dentist.id)}
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border cursor-pointer ${
                    dentist.active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}
                >
                  {dentist.active ? 'Activo/a' : 'Inactivo/a'}
                </button>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div><strong>Especialidad:</strong> {dentist.specialty}</div>
                <div><strong>Teléfono:</strong> {dentist.phone}</div>
                <div><strong>Email:</strong> {dentist.email}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
                {dentists.length > 1 && (
                  <button
                    onClick={() => onDeleteDentist(dentist.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar profesional"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
