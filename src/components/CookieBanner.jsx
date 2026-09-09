import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Shield, Check, X, Sliders, Info } from 'lucide-react';

const STORAGE_KEY = 'lg_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    functional: true
  });

  useEffect(() => {
    // Check if consent has been saved before
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setPreferences(prev => ({ ...prev, ...parsed.preferences }));
        }
      } catch (e) {
        // legacy string format
      }
    }
  }, []);

  // Listen for global request to open cookie settings modal
  useEffect(() => {
    const handleOpen = () => {
      setShowModal(true);
      setVisible(false);
    };
    window.addEventListener('open-cookie-settings', handleOpen);
    return () => window.removeEventListener('open-cookie-settings', handleOpen);
  }, []);

  const saveConsent = (type, customPrefs = null) => {
    const payload = {
      type, // 'all', 'essential', 'custom'
      timestamp: new Date().toISOString(),
      preferences: customPrefs || (type === 'all' 
        ? { essential: true, analytics: true, functional: true }
        : { essential: true, analytics: false, functional: false })
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setVisible(false);
    setShowModal(false);
  };

  const handleAcceptAll = () => {
    saveConsent('all');
  };

  const handleAcceptEssential = () => {
    saveConsent('essential');
  };

  const handleSaveCustom = () => {
    saveConsent('custom', preferences);
  };

  if (!visible && !showModal) return null;

  return (
    <>
      {/* ── Floating Cookie Banner ── */}
      {visible && !showModal && (
        <aside 
          className="cookie-banner-wrap animate-fade-in"
          role="dialog"
          aria-label="Consentimiento de cookies"
          style={{
            position: 'fixed',
            bottom: '1.25rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 2.5rem)',
            maxWidth: '860px',
            zIndex: 9990,
            background: 'rgba(21, 22, 30, 0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--nm-border-strong)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), var(--nm-shadow-raised)',
            padding: '1.25rem 1.5rem',
            color: 'var(--text-primary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '1rem', flex: '1 1 360px' }}>
              <div 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  background: 'rgba(217, 119, 6, 0.15)', 
                  border: '1px solid rgba(217, 119, 6, 0.3)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--amber-light)',
                  flexShrink: 0
                }}
              >
                <Cookie size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.98rem', fontWeight: 800 }}>
                  Tu privacidad es importante
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  Utilizamos cookies esenciales para el funcionamiento de la plataforma y cookies opcionales para estadísticas y preferencias de torneos. Puedes consultar nuestra{' '}
                  <Link to="/cookies" style={{ color: 'var(--primary-light)', textDecoration: 'underline', fontWeight: 700 }}>
                    Política de Cookies
                  </Link>{' '}
                  y{' '}
                  <Link to="/privacidad" style={{ color: 'var(--primary-light)', textDecoration: 'underline', fontWeight: 700 }}>
                    Política de Privacidad
                  </Link>.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', alignSelf: 'center' }}>
              <button 
                type="button"
                className="btn btn-glass"
                onClick={() => setShowModal(true)}
                style={{ fontSize: '0.8rem', padding: '0.55rem 0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Sliders size={14} /> Configurar
              </button>
              <button 
                type="button"
                className="btn btn-glass"
                onClick={handleAcceptEssential}
                style={{ fontSize: '0.8rem', padding: '0.55rem 0.9rem' }}
              >
                Solo esenciales
              </button>
              <button 
                type="button"
                className="btn btn-primary"
                onClick={handleAcceptAll}
                style={{ fontSize: '0.8rem', padding: '0.55rem 1.15rem', fontWeight: 800 }}
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ── Detailed Settings Modal ── */}
      {showModal && (
        <div 
          className="cookie-modal-backdrop animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            className="cookie-modal-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--bg-card)',
              border: '1px solid var(--nm-border-strong)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
              padding: '1.75rem',
              color: 'var(--text-primary)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(79, 109, 245, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
                  <Shield size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Preferencias de Cookies</h3>
              </div>
              <button 
                className="btn btn-glass"
                style={{ padding: '0.45rem', borderRadius: '50%' }}
                onClick={() => setShowModal(false)}
                aria-label="Cerrar modal"
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Elige qué categorías de cookies permites que usemos. Las cookies técnicas son obligatorias para el funcionamiento seguro de la plataforma de torneos.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
              {/* Essential */}
              <div style={{ padding: '1rem', background: 'var(--bg-sunken)', border: '1px solid var(--nm-border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Cookies Técnicas / Esenciales</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '99px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                    Siempre activas
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Necesarias para iniciar sesión, navegar de forma segura, recordar el estado de la sesión y cargar los datos de los partidos.
                </p>
              </div>

              {/* Analytics */}
              <div style={{ padding: '1rem', background: 'var(--bg-sunken)', border: '1px solid var(--nm-border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Cookies de Rendimiento y Análisis</span>
                  <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                  </label>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Nos permiten conocer la audiencia de los partidos, estadísticas de visitas y mejorar el rendimiento de la web.
                </p>
              </div>

              {/* Functional / Preferences */}
              <div style={{ padding: '1rem', background: 'var(--bg-sunken)', border: '1px solid var(--nm-border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Cookies de Preferencias</span>
                  <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                  </label>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Recuerdan filtros seleccionados, equipos destacados y configuraciones personalizadas para tu próxima visita.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button 
                type="button"
                className="btn btn-glass"
                onClick={handleAcceptEssential}
                style={{ fontSize: '0.84rem' }}
              >
                Rechazar no esenciales
              </button>
              <button 
                type="button"
                className="btn btn-primary"
                onClick={handleSaveCustom}
                style={{ fontSize: '0.84rem', fontWeight: 800 }}
              >
                <Check size={16} /> Guardar selección
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
