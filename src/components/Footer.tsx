import React from 'react';
import { Sparkles, Shield, Building2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 bg-white border-t border-slate-200 py-6 px-6 text-slate-500 text-xs no-print">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
            🏥
          </div>
          <span className="font-extrabold text-slate-800 tracking-tight">Colsul</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">Policonsultorio Médico Multiespecialidad</span>
        </div>

        <div className="flex items-center space-x-3 text-slate-600 font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>15 Especialidades Médicas · 10 Consultorios</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-800 font-bold rounded-full border border-teal-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>© 2026 Aura. Todos los derechos reservados. Startup Aura por Omar Horacio Adamo.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
