import React from 'react';
import { Calendar, Users, FileText, DollarSign, Activity, Stethoscope, Settings as SettingsIcon } from 'lucide-react';

export type ActiveTab = 'specialties' | 'odontogram' | 'appointments' | 'patients' | 'budgets' | 'settings';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  todayAppointmentsCount: number;
  clinicName?: string;
  syncStatus?: 'idle' | 'syncing' | 'synced' | 'error';
  onSyncNow?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  todayAppointmentsCount,
  clinicName = 'Colsul',
  syncStatus = 'synced',
  onSyncNow
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'specialties', label: 'Módulos Médicos (15)', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'appointments', label: 'Turnos & Agenda', icon: <Calendar className="w-4 h-4" />, badge: todayAppointmentsCount },
    { id: 'patients', label: 'Historias Clínicas', icon: <Users className="w-4 h-4" /> },
    { id: 'budgets', label: 'Presupuestos', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'settings', label: 'Configuración', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black text-xl flex items-center justify-center shadow-md ring-2 ring-teal-200">
              🏥
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-tight flex items-center gap-2">
                {clinicName}
                <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
                  Policonsultorio
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">15 Especialidades Médicas · 10 Consultorios</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'specialties' && activeTab === 'odontogram');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 bg-teal-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center space-x-2.5">
            {/* MySQL Sync Pill Button */}
            {onSyncNow && (
              <button
                onClick={onSyncNow}
                disabled={syncStatus === 'syncing'}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  syncStatus === 'syncing'
                    ? 'bg-amber-50 border-amber-300 text-amber-800 animate-pulse'
                    : syncStatus === 'error'
                    ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-2xs'
                }`}
                title="Sincronizar cambios con MySQL Ferozo (DonWeb)"
              >
                <span className={`w-2 h-2 rounded-full ${
                  syncStatus === 'syncing' ? 'bg-amber-500 animate-ping' :
                  syncStatus === 'error' ? 'bg-rose-500' : 'bg-emerald-500'
                }`} />
                <span className="font-mono text-[11px]">
                  {syncStatus === 'syncing' ? 'Sincronizando...' : 'MySQL Ferozo'}
                </span>
                <span className="text-[10px] bg-white/80 px-1 py-0.2 rounded text-slate-700 font-semibold">
                  ↻
                </span>
              </button>
            )}

            {/* User profile badge */}
            <div className="hidden lg:flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                 OA
              </div>
              <div className="text-left text-xs">
                <span className="block font-bold text-slate-800">Omar Horacio Adamo</span>
                <span className="block text-[10px] text-teal-600 font-semibold">Director Policonsultorio</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
