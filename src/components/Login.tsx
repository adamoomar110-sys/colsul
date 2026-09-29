import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Activity } from 'lucide-react';

// Credenciales hardcodeadas (se pueden migrar a backend en el futuro)
const VALID_CREDENTIALS = [
  { username: 'admin', password: 'odonto2025', role: 'Administrador' },
  { username: 'doctor', password: 'doctor123', role: 'Odontólogo' },
];

interface LoginProps {
  onLogin: (role: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [focused, setFocused] = useState<'user' | 'pass' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const match = VALID_CREDENTIALS.find(
        c => c.username === username.trim() && c.password === password
      );
      if (match) {
        onLogin(match.role);
      } else {
        setLoading(false);
        setError('Usuario o contraseña incorrectos.');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    }, 900);
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
        position: 'absolute', bottom: '-150px', left: '-150px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card principal */}
      <div style={{
        width: '100%', maxWidth: '420px', margin: '0 20px',
        animation: shake ? 'shake 0.5s ease' : 'slide-up 0.5s ease both',
      }}>

        {/* Header del card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px 24px 0 0',
          padding: '32px 32px 24px',
          backdropFilter: 'blur(20px)',
          textAlign: 'center',
          borderBottom: 'none',
        }}>
          {/* Logo */}
          <div style={{
            width: '72px', height: '72px', margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(20,184,166,0.35)',
            fontSize: '36px'
          }}>
            🏥
          </div>

          <h1 style={{
            fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px',
            background: 'linear-gradient(90deg, #ffffff 0%, #14b8a6 60%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            margin: '0 0 6px',
          }}>
            Colsul
          </h1>
          <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: '13px', margin: 0 }}>
            Policonsultorio Médico Multiespecialidad
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '0 0 24px 24px',
          padding: '24px 32px 32px',
          backdropFilter: 'blur(20px)',
        }}>

          {/* Campo usuario */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: '600',
              color: 'rgba(148,163,184,0.9)', letterSpacing: '0.5px',
              textTransform: 'uppercase', marginBottom: '8px',
            }}>
              Usuario
            </label>
            <div style={{ position: 'relative' }}>
              <User style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', width: '16px', height: '16px',
                color: focused === 'user' ? '#14b8a6' : 'rgba(100,116,139,0.8)',
                transition: 'color 0.2s',
              }} />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onFocus={() => setFocused('user')}
                onBlur={() => setFocused(null)}
                placeholder="Ingresá tu usuario"
                required
                style={{
                  width: '100%', padding: '13px 14px 13px 42px',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${focused === 'user' ? 'rgba(20,184,166,0.7)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px',
                  color: '#ffffff', fontSize: '14px',
                  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                  boxShadow: focused === 'user' ? '0 0 0 3px rgba(20,184,166,0.12)' : 'none',
                }}
              />
            </div>
          </div>

          {/* Campo contraseña */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: '600',
              color: 'rgba(148,163,184,0.9)', letterSpacing: '0.5px',
              textTransform: 'uppercase', marginBottom: '8px',
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', width: '16px', height: '16px',
                color: focused === 'pass' ? '#14b8a6' : 'rgba(100,116,139,0.8)',
                transition: 'color 0.2s',
              }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('pass')}
                onBlur={() => setFocused(null)}
                placeholder="Ingresá tu contraseña"
                required
                style={{
                  width: '100%', padding: '13px 44px 13px 42px',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${focused === 'pass' ? 'rgba(20,184,166,0.7)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px',
                  color: '#ffffff', fontSize: '14px',
                  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                  boxShadow: focused === 'pass' ? '0 0 0 3px rgba(20,184,166,0.12)' : 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(100,116,139,0.8)', padding: 0,
                  display: 'flex', alignItems: 'center',
                }}
              >
                {showPass
                  ? <EyeOff style={{ width: '16px', height: '16px' }} />
                  : <Eye style={{ width: '16px', height: '16px' }} />
                }
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '10px 14px',
              color: '#fca5a5', fontSize: '13px', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Botón ingresar */}
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
              letterSpacing: '0.3px',
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
                Verificando...
              </>
            ) : (
              <>
                <Activity style={{ width: '16px', height: '16px' }} />
                Ingresar al Sistema
              </>
            )}
          </button>

          {/* Hint de credenciales */}
          <div style={{
            marginTop: '20px', padding: '12px',
            background: 'rgba(20,184,166,0.06)',
            border: '1px solid rgba(20,184,166,0.15)',
            borderRadius: '10px',
            fontSize: '11px', color: 'rgba(100,116,139,0.8)',
            lineHeight: '1.6',
          }}>
            <strong style={{ color: 'rgba(148,163,184,0.7)' }}>Acceso demo:</strong><br />
            👤 <code style={{ color: '#14b8a6' }}>admin</code> / 🔑 <code style={{ color: '#14b8a6' }}>odonto2025</code>
          </div>
        </form>

        {/* Footer */}
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: rgba(100,116,139,0.5); }
      `}</style>
    </div>
  );
};
