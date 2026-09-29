import React from 'react';
import { Stethoscope, CalendarCheck, Sparkles, Shield, ChevronRight, Building2 } from 'lucide-react';

interface MainMenuProps {
  onSelectConsultorio: () => void;
  onSelectReservarTurno: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectConsultorio,
  onSelectReservarTurno,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-slate-100 font-sans relative overflow-hidden select-none">
      
      {/* Luces decorativas de fondo */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-8 max-w-7xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-400 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-teal-500/20">
            🏥
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Colsul <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">Policonsultorio</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">15 Especialidades Médicas · 10 Consultorios</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 backdrop-blur-md">
          <Shield className="w-3.5 h-3.5 text-teal-400" />
          <span>Atención Multiespecialidad</span>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 flex flex-col justify-center items-center z-10">
        
        {/* Título de bienvenida */}
        <div className="text-center max-w-2xl mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/15 to-sky-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
            <span>Bienvenido a Colsul Policonsultorio</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            ¿Qué deseas realizar hoy?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Ingreso al sistema clínico multiespecialidad o reserva de turnos online en nuestros 10 consultorios.
          </p>
        </div>

        {/* Las 2 Tarjetas de Menú Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">

          {/* Menú 1: Acceso Consultorio */}
          <div
            onClick={onSelectConsultorio}
            className="group relative bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 hover:border-teal-500/50 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/15 hover:-translate-y-1 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/40">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white mb-6 shadow-xl shadow-teal-500/25 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-8 h-8" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">Área Profesional & Médica</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-3 group-hover:text-teal-300 transition-colors">
                1. Acceso Policonsultorio
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Ingreso exclusivo para médicos y profesionales de las 15 especialidades. Odontograma, Snellen, ECG, Percentiles, Glasgow, IPSS, Fichas Clínicas y Aranceles.
              </p>
            </div>

            <div className="flex items-center text-xs font-bold text-teal-400 group-hover:text-teal-300 gap-1.5 pt-4 border-t border-slate-800/80">
              <span>Ingresar al Sistema Clínico</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Menú 2: Ver Turnos Disponibles y Reservar */}
          <div
            onClick={onSelectReservarTurno}
            className="group relative bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/50 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/15 hover:-translate-y-1 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 border border-sky-500/40">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white mb-6 shadow-xl shadow-sky-500/25 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">Portal de Pacientes</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-3 group-hover:text-sky-300 transition-colors">
                2. Reservar Turno Online
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Elige tu especialidad médica de preferencia, consulta horarios disponibles en nuestros 10 consultorios y confirma tu cita online.
              </p>
            </div>

            <div className="flex items-center text-xs font-bold text-sky-400 group-hover:text-sky-300 gap-1.5 pt-4 border-t border-slate-800/80">
              <span>Ver Horarios & Reservar Turno</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

        </div>

      </main>

      {/* Footer AURA */}
      <footer className="py-6 px-6 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md text-center text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span>Colsul © 2026</span>
            <span>•</span>
            <span>Policonsultorio Médico Multiespecialidad</span>
          </div>
          <div className="text-slate-400 font-medium flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>© 2026 Aura. Todos los derechos reservados. Startup Aura por Omar Horacio Adamo.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
