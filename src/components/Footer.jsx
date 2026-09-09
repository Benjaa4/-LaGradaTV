import { Link } from 'react-router-dom';
import { Tv, Shield, FileText, Cookie, Settings } from 'lucide-react';

export default function Footer() {
  const handleOpenCookieSettings = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('open-cookie-settings'));
  };

  return (
    <footer className="global-footer animate-fade-in" style={{ padding: '3.5rem 1.5rem 2.5rem', borderTop: '1px solid var(--nm-border)', marginTop: '3rem', background: 'rgba(10, 11, 15, 0.65)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Top block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>

          {/* Brand info */}
          <div style={{ maxWidth: '380px' }}>
            <div style={{ fontFamily: 'Nunito', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.65rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Tv size={18} />
              </div>
              La Grada TV
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55, margin: '0 0 1rem' }}>
              Tu plataforma líder de torneos deportivos locales. Seguimiento de partidos minuto a minuto, estadísticas detalladas, galerías exclusivas y transmisiones en vivo.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="https://www.instagram.com/lagradatv/" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram" style={{ display: 'flex', padding: '0.65rem', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--nm-border)', color: 'var(--text-secondary)' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter" style={{ display: 'flex', padding: '0.65rem', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--nm-border)', color: 'var(--text-secondary)' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
                Explorar
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                <li><Link to="/" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Inicio</Link></li>
                <li><Link to="/torneos" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Torneos y Fixture</Link></li>
                <li><Link to="/albumes" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Galerías y Fotos</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
                Legal y Privacidad
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                <li>
                  <Link to="/terminos" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={14} color="var(--primary-light)" /> Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link to="/privacidad" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Shield size={14} color="var(--teal-light)" /> Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Cookie size={14} color="var(--amber-light)" /> Política de Cookies
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleOpenCookieSettings}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--primary-light)', cursor: 'pointer', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit' }}
                  >
                    <Settings size={14} /> Preferencias de Cookies
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--nm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} La Grada TV · Todos los derechos reservados.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link to="/terminos" style={{ color: 'var(--text-muted)' }}>Términos</Link>
            <Link to="/privacidad" style={{ color: 'var(--text-muted)' }}>Privacidad</Link>
            <Link to="/cookies" style={{ color: 'var(--text-muted)' }}>Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
