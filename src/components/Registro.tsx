import React, { useState } from 'react';
import { User, Phone, CheckCircle } from 'lucide-react';

interface RegistroProps {
  usuarioLogin: string;
  onDone: () => void;
}

export const Registro: React.FC<RegistroProps> = ({ usuarioLogin, onDone }) => {
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<'nombre' | 'celular' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !celular.trim()) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/registro.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          celular: celular.trim(),
          usuario: usuarioLogin,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al guardar el registro');
      }

      setLoading(false);
      onDone();
    } catch (err: any) {
      console.warn('Backend API warning (procediendo en frontend):', err);
      // En caso de que no haya conexión a la BD aún o sea prueba local sin PHP:
      setLoading(false);
      onDone();
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 45%, #0a2e2a 100%)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Fondo decorativo */}
      <div style={{
        position: 'absolute', top: '-200px', right: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '400px', margin: '0 20px',
        animation: 'slide-up 0.5s ease both',
      }}>
        {/* Ícono de bienvenida */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(20,184,166,0.35)',
          }}>
            <CheckCircle style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
          <h2 style={{
            fontSize: '22px', fontWeight: '800',
            background: 'linear-gradient(90deg, #ffffff 0%, #14b8a6 60%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            margin: '0 0 6px',
          }}>
            ¡Bienvenido/a!
          </h2>
          <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
            Antes de entrar, dejá tu nombre<br />y número de celular
          </p>
        </div>

        {/* Card formulario */}
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '28px 32px 32px',
          backdropFilter: 'blur(20px)',
        }}>

          {/* Campo nombre */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: '600',
              color: 'rgba(148,163,184,0.9)', letterSpacing: '0.5px',
              textTransform: 'uppercase', marginBottom: '8px',
            }}>
              Nombre completo
            </label>
            <div style={{ position: 'relative' }}>
              <User style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', width: '16px', height: '16px',
                color: focused === 'nombre' ? '#14b8a6' : 'rgba(100,116,139,0.8)',
                transition: 'color 0.2s',
              }} />
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                onFocus={() => setFocused('nombre')}
                onBlur={() => setFocused(null)}
                placeholder="Ej: María García"
                required
                style={{
                  width: '100%', padding: '13px 14px 13px 42px',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${focused === 'nombre' ? 'rgba(20,184,166,0.7)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px', color: '#ffffff', fontSize: '14px',
                  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                  boxShadow: focused === 'nombre' ? '0 0 0 3px rgba(20,184,166,0.12)' : 'none',
                }}
              />
            </div>
          </div>

          {/* Campo celular */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: '600',
              color: 'rgba(148,163,184,0.9)', letterSpacing: '0.5px',
              textTransform: 'uppercase', marginBottom: '8px',
            }}>
              Número de celular
            </label>
            <div style={{ position: 'relative' }}>
              <Phone style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', width: '16px', height: '16px',
                color: focused === 'celular' ? '#14b8a6' : 'rgba(100,116,139,0.8)',
                transition: 'color 0.2s',
              }} />
              <input
                type="tel"
                value={celular}
                onChange={e => setCelular(e.target.value)}
                onFocus={() => setFocused('celular')}
                onBlur={() => setFocused(null)}
                placeholder="Ej: 11 2345-6789"
                required
                style={{
                  width: '100%', padding: '13px 14px 13px 42px',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${focused === 'celular' ? 'rgba(20,184,166,0.7)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px', color: '#ffffff', fontSize: '14px',
                  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                  boxShadow: focused === 'celular' ? '0 0 0 3px rgba(20,184,166,0.12)' : 'none',
                }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '10px 14px',
              color: '#fca5a5', fontSize: '13px', marginBottom: '16px',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading
                ? 'rgba(20,184,166,0.4)'
                : 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
              border: 'none', borderRadius: '12px',
              color: '#ffffff', fontSize: '15px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(20,184,166,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px', height: '16px',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: 'white', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Guardando...
              </>
            ) : (
              '→ Entrar al sistema'
            )}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '20px',
          fontSize: '11px', color: 'rgba(71,85,105,0.7)',
          letterSpacing: '1px', textTransform: 'uppercase',
        }}>
          © 2026 Aura · Startup Aura por Omar Horacio Adamo
        </p>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: rgba(100,116,139,0.5); }
      `}</style>
    </div>
  );
};
