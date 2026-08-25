import { Link, useLocation } from 'react-router-dom';
import { Trophy, PlayCircle, ShieldCheck, LogOut, Home, Calendar, Menu, X, Tv } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useState, useEffect } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/',        label: 'Inicio',   icon: Home },
  { to: '/torneos', label: 'Torneos',  icon: Trophy },
  { to: '/albumes', label: 'Videos',   icon: PlayCircle },
];

export default function Navbar() {
  const { isAdmin, logout, matches, videos } = useAppContext();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const liveCount = videos.filter(v => v.type === 'live').length;
  const today = new Date().toISOString().split('T')[0];
  const todayCount = matches.filter(m => m.date === today).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on navigate
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">

          {/* Brand */}
          <Link to="/" className="navbar-brand">
            <div className="brand-icon-wrap">
              <Tv size={20} />
            </div>
            <span className="brand-text">La Grada TV</span>
          </Link>

          {/* Desktop nav */}
          <div className="navbar-links desktop-links">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${isActive(to) ? 'nav-link-active' : ''}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}

            {/* Live indicator */}
            {liveCount > 0 && (
              <Link to="/albumes" className="nav-live-badge">
                <span className="nav-live-dot" />
                EN VIVO
              </Link>
            )}

            {/* Today matches pill */}
            {todayCount > 0 && (
              <span className="nav-today-badge">
                <Calendar size={13} />
                {todayCount} hoy
              </span>
            )}
          </div>

          {/* Admin + mobile toggle */}
          <div className="navbar-actions">
            {isAdmin ? (
              <>
                <Link to="/admin" className={`nav-admin-btn ${isActive('/admin') ? 'nav-admin-btn-active' : ''}`} title="Panel Admin">
                  <ShieldCheck size={17} />
                  Admin
                </Link>
                <button onClick={logout} className="nav-icon-btn nav-logout" title="Salir">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-icon-btn nav-login" title="Acceso Admin">
                <ShieldCheck size={18} />
              </Link>
            )}
            <button
              className="nav-mobile-toggle"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="mobile-menu animate-slide-up">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className={`mobile-link ${isActive(to) ? 'mobile-link-active' : ''}`}>
                <Icon size={18} />
                {label}
                {isActive(to) && <span className="mobile-active-dot" />}
              </Link>
            ))}
            {liveCount > 0 && (
              <Link to="/albumes" className="mobile-link mobile-link-live">
                <span className="nav-live-dot" /> {liveCount} En Vivo
              </Link>
            )}
            <div className="mobile-divider" />
            {isAdmin ? (
              <>
                <Link to="/admin" className="mobile-link"><ShieldCheck size={18} /> Panel Admin</Link>
                <button onClick={logout} className="mobile-link mobile-link-danger"><LogOut size={18} /> Cerrar sesión</button>
              </>
            ) : (
              <Link to="/login" className="mobile-link"><ShieldCheck size={18} /> Acceso Admin</Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
