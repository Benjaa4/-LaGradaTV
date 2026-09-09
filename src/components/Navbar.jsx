import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Trophy, PlayCircle, ShieldCheck, LogOut,
  Home, Calendar, Menu, X, Tv, Search, Radio
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/',        label: 'Inicio',   icon: Home },
  { to: '/torneos', label: 'Torneos',  icon: Trophy },
  { to: '/albumes', label: 'Videos',   icon: PlayCircle },
];

export default function Navbar() {
  const { isAdmin, logout, matches, videos, openSearchModal } = useAppContext();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const liveCount = videos.filter(v => v.type === 'live').length;
  const today = new Date().toISOString().split('T')[0];
  const todayCount = matches.filter(m => m.date === today).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearchModal]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Brand */}
          <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
            <div className="brand-icon-wrap">
              <Tv size={19} />
              {liveCount > 0 && <span className="brand-live-dot" />}
            </div>
            <div className="brand-text-wrap">
              <span className="brand-text">La Grada TV</span>
              {liveCount > 0 && <span className="brand-badge-live">EN VIVO</span>}
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="navbar-links desktop-links">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${isActive(to) ? 'nav-link-active' : ''}`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}

            {liveCount > 0 && (
              <Link to="/albumes" className="nav-live-badge" title="Transmisión en vivo disponible">
                <span className="nav-live-dot" />
                EN VIVO ({liveCount})
              </Link>
            )}

            {todayCount > 0 && (
              <span className="nav-today-badge" title={`${todayCount} partidos programados para hoy`}>
                <Calendar size={13} />
                {todayCount} hoy
              </span>
            )}
          </div>

          {/* Right Actions: Search + Admin + Mobile Burger */}
          <div className="navbar-actions">
            {/* Desktop Quick Search Trigger */}
            <button
              onClick={openSearchModal}
              className="nav-search-btn desktop-links"
              title="Buscar torneos, equipos o partidos (Ctrl+K)"
              type="button"
            >
              <Search size={14} className="nav-search-icon" />
              <span className="nav-search-placeholder">Buscar torneo, equipo...</span>
              <kbd className="nav-search-kbd">Ctrl K</kbd>
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={openSearchModal}
              className="nav-mobile-search-btn"
              aria-label="Buscar en la web"
              title="Buscar"
              type="button"
            >
              <Search size={18} />
            </button>

            {/* Admin Desktop Button */}
            <div className="desktop-admin-actions">
              {isAdmin ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Link
                    to="/admin"
                    className={`nav-admin-btn ${isActive('/admin') ? 'nav-admin-btn-active' : ''}`}
                    title="Panel de Control"
                  >
                    <ShieldCheck size={16} />
                    <span>Admin</span>
                  </Link>
                  <button onClick={logout} className="nav-icon-btn nav-logout" title="Cerrar Sesión" type="button">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="nav-icon-btn nav-login" title="Acceso Administrativo">
                  <ShieldCheck size={17} />
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              className={`nav-mobile-toggle ${mobileOpen ? 'nav-mobile-toggle-open' : ''}`}
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              type="button"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileOpen && (
          <div className="mobile-drawer animate-slide-up">
            <div className="mobile-drawer-content">
              {/* Quick Search Tap inside Drawer */}
              <button 
                type="button"
                className="mobile-search-trigger"
                onClick={() => {
                  setMobileOpen(false);
                  openSearchModal();
                }}
              >
                <div className="mobile-search-icon-box">
                  <Search size={16} />
                </div>
                <span className="mobile-search-label">Buscar torneos, equipos o partidos...</span>
                <span className="mobile-search-hint">Ir ↵</span>
              </button>

              {/* Mobile Quick Status Chips */}
              {(liveCount > 0 || todayCount > 0) && (
                <div className="mobile-stats-row">
                  {liveCount > 0 && (
                    <Link 
                      to="/albumes" 
                      className="mobile-stat-chip live-chip"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Radio size={13} className="spin-slow" />
                      <span>{liveCount} En Vivo</span>
                    </Link>
                  )}
                  {todayCount > 0 && (
                    <div className="mobile-stat-chip today-chip">
                      <Calendar size={13} />
                      <span>{todayCount} Partidos Hoy</span>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Navigation Links */}
              <div className="mobile-drawer-links">
                {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`mobile-link ${isActive(to) ? 'mobile-link-active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="mobile-link-icon">
                      <Icon size={18} />
                    </div>
                    <span className="mobile-link-text">{label}</span>
                    {to === '/albumes' && liveCount > 0 && (
                      <span className="mobile-live-tag">EN VIVO</span>
                    )}
                  </Link>
                ))}

                <div className="mobile-divider" />

                {/* Mobile Admin Link */}
                <Link
                  to={isAdmin ? '/admin' : '/login'}
                  className={`mobile-link ${isActive('/admin') || isActive('/login') ? 'mobile-link-active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="mobile-link-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="mobile-link-text">
                    {isAdmin ? 'Panel de Control' : 'Acceso Administrativo'}
                  </span>
                </Link>

                {isAdmin && (
                  <button 
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }} 
                    className="mobile-link mobile-logout-btn"
                    type="button"
                  >
                    <div className="mobile-link-icon">
                      <LogOut size={18} />
                    </div>
                    <span className="mobile-link-text">Cerrar Sesión</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div className="mobile-backdrop animate-fade-in" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
