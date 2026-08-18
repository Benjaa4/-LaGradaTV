import { Link } from 'react-router-dom';
import { Trophy, PlayCircle, ShieldCheck, LogOut, Award } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { isAdmin, logout } = useAppContext();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Trophy size={28} className="brand-icon" />
          <span className="brand-text">La Grada TV</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/torneos" className="nav-link">
            <Award size={18} />
            Torneos
          </Link>
          <Link to="/albumes" className="nav-link">
            <Folder size={18} />
            Álbumes
          </Link>
          
          {isAdmin ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--border-glass)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
              <Link to="/admin" className="nav-icon-btn admin-link" title="Panel Admin">
                <ShieldCheck size={20} />
              </Link>
              <button onClick={logout} className="nav-icon-btn logout-btn" title="Salir">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid var(--border-glass)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
              <Link to="/login" className="nav-icon-btn login-link" title="Login Admin">
                <ShieldCheck size={20} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
