import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, Stethoscope, X, BellRing, Sparkles, Globe, Building2, CreditCard } from 'lucide-react';
import { Appointment } from '../types';

interface NewAppointmentTicketProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const NewAppointmentTicket: React.FC<NewAppointmentTicketProps> = ({
  appointment,
  onClose
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!appointment) return;

    setProgress(100);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 100); // 100ms * 100 = 10.000ms = 10 segundos

    return () => clearInterval(interval);
  }, [appointment, onClose]);

  if (!appointment) return null;

  const isOnline = appointment.origin === 'online';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short select-none">
      <div className={`border-2 text-white p-5 rounded-3xl shadow-2xl backdrop-blur-xl relative overflow-hidden ${
        isOnline 
          ? 'bg-slate-950 border-sky-400 shadow-sky-500/30' 
          : 'bg-slate-900 border-teal-400 shadow-teal-500/30'
      }`}>
        
        {/* Luz brillante decorativa */}
        <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-xl pointer-events-none ${
          isOnline ? 'bg-sky-500/20' : 'bg-teal-500/20'
        }`} />

        {/* Barra de progreso decreciente (10 segundos) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              isOnline 
                ? 'bg-gradient-to-r from-sky-400 to-indigo-400' 
                : 'bg-gradient-to-r from-teal-400 to-emerald-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Encabezado del Ticket */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold border animate-pulse ${
              isOnline ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
            }`}>
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 ${
                isOnline ? 'text-sky-400' : 'text-teal-400'
              }`}>
                <Sparkles className="w-3 h-3" /> Ticket en Pantalla (10s)
              </span>
              <h4 className="text-sm font-extrabold text-white">¡Nuevo Turno Registrado!</h4>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Badge de Canal / Origen */}
        <div className="mb-2 flex items-center justify-between gap-2">
          {isOnline ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500/20 text-sky-300 border border-sky-400/40">
              <Globe className="w-3 h-3 text-sky-400" />
              <span>Reserva Online (App Paciente)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-400/40">
              <Building2 className="w-3 h-3 text-teal-400" />
              <span>Agendado en Consultorio</span>
            </span>
          )}

          {appointment.paymentStatus === 'seña_abonada' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              <CreditCard className="w-2.5 h-2.5 text-emerald-400" />
              <span>Seña MP OK</span>
            </span>
          )}
          {appointment.paymentStatus === 'total_abonado' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              <span>Total MP OK</span>
            </span>
          )}
        </div>

        {/* Detalle del Turno */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-200 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2">
              <User className={`w-4 h-4 shrink-0 ${isOnline ? 'text-sky-400' : 'text-teal-400'}`} />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">PACIENTE:</span>
                <strong className="text-white font-extrabold text-sm">{appointment.patientName}</strong>
              </div>
            </div>
            {appointment.dni && (
              <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
                DNI: {appointment.dni}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-300">
              <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">FECHA:</span>
                <span className="font-bold text-white">{appointment.date.split('-').reverse().join('/')}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-300">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">HORA:</span>
                <span className="font-bold text-teal-300">{appointment.time} hs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-300">
            <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">PROFESIONAL & TRATAMIENTO:</span>
              <span className="font-bold text-white text-[11px] block">{appointment.dentistName}</span>
              <span className="text-emerald-300 text-[10px]">{appointment.specialty}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
