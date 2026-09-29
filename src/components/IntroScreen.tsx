import React, { useEffect, useState } from 'react';

interface IntroScreenProps {
  onFinish: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 100);
    const t2 = setTimeout(() => setPhase('exit'), 2800);
    const t3 = setTimeout(() => onFinish(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'linear-gradient(135deg, #09131d 0%, #0d233a 40%, #082d2c 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.6s ease',
        opacity: phase === 'exit' ? 0 : 1,
        overflow: 'hidden',
      }}
    >
      {/* Partículas de fondo */}
      <Particles />

      {/* Círculo brillante de fondo */}
      <div style={{
        position: 'absolute',
        width: '600px', height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)',
        animation: 'pulse-glow 2.5s ease-in-out infinite',
      }} />

      {/* Logo y contenido central */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '26px',
        transform: phase === 'enter' ? 'scale(0.6) translateY(30px)' : 'scale(1) translateY(0)',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative', zIndex: 2,
      }}>
        {/* Ícono clínico animado */}
        <div style={{
          width: '110px', height: '110px',
          background: 'linear-gradient(135deg, #0d9488, #0284c7)',
          borderRadius: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 60px rgba(13,148,136,0.5), 0 0 120px rgba(2,132,199,0.25)',
          animation: 'float 3s ease-in-out infinite',
          fontSize: '52px'
        }}>
          🏥
        </div>

        {/* Nombre del sistema */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '44px', fontWeight: '900', letterSpacing: '-1px',
            background: 'linear-gradient(90deg, #ffffff 0%, #14b8a6 50%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            lineHeight: 1.1,
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
          }}>
            Colsul
          </div>
          <div style={{
            fontSize: '13px', color: 'rgba(203,213,225,0.95)',
            letterSpacing: '2.5px', textTransform: 'uppercase',
            marginTop: '8px', fontWeight: '700',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Policonsultorio Médico Multiespecialidad
          </div>
          <div style={{
            fontSize: '11px', color: '#14b8a6',
            letterSpacing: '1px', marginTop: '4px', fontWeight: '600'
          }}>
            15 Especialidades Médicas · 10 Consultorios
          </div>
        </div>

        {/* Barra de progreso */}
        <div style={{
          width: '240px', height: '3px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '999px', overflow: 'hidden',
          marginTop: '6px',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #14b8a6, #38bdf8)',
            borderRadius: '999px',
            animation: 'progress-fill 2.4s ease forwards',
            boxShadow: '0 0 12px rgba(20,184,166,0.8)',
          }} />
        </div>

        {/* Texto cargando */}
        <div style={{
          fontSize: '11px', color: 'rgba(148,163,184,0.7)',
          letterSpacing: '2px', textTransform: 'uppercase',
          animation: 'blink 1.2s ease-in-out infinite',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          Iniciando Policonsultorio...
        </div>
      </div>

      {/* Footer Aura */}
      <div style={{
        position: 'absolute', bottom: '26px',
        fontSize: '11px', color: 'rgba(148,163,184,0.8)',
        letterSpacing: '1.5px', textTransform: 'uppercase',
        fontWeight: '600'
      }}>
        © 2026 Aura · Startup por Omar Horacio Adamo ✦
      </div>

      {/* Estilos de animación */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1.5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes particle-float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Partículas flotantes
const Particles: React.FC = () => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 5 + 5,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          width: `${p.size}px`, height: `${p.size}px`,
          borderRadius: '50%',
          background: p.id % 3 === 0
            ? 'rgba(20,184,166,0.6)'
            : p.id % 3 === 1
              ? 'rgba(56,189,248,0.5)'
              : 'rgba(255,255,255,0.3)',
          left: `${p.left}%`, bottom: '-10px',
          animation: `particle-float ${p.duration}s ${p.delay}s ease-in infinite`,
        }} />
      ))}
    </>
  );
};
