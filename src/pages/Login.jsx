import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import FormConsent from '../components/FormConsent';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!consent) {
      setError('Debes aceptar los Términos y Condiciones y la Política de Privacidad para continuar.');
      return;
    }

    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Credenciales inválidas. Verifica tu usuario y contraseña.');
      }
    } catch {
      setError('Error al conectar con el servidor. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--bg-sunken)', boxShadow: 'var(--nm-shadow-inset-sm)', border: '1px solid var(--nm-border)', borderRadius: '50%', marginBottom: '1rem' }}>
            <ShieldAlert size={40} color="var(--primary)" />
          </div>
          <h2 className="section-title" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>Acceso Administrativo</h2>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Ingresa tus credenciales para gestionar torneos</p>
        </div>

        {error && (
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.88rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Usuario</label>
            <input 
              type="text" 
              id="username"
              className="form-input" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario administrador"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password"
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          <FormConsent 
            checked={consent}
            onChange={setConsent}
            style={{ marginBottom: '1.5rem' }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Verificando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
