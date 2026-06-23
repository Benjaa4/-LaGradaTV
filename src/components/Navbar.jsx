import { Link } from 'react-router-dom';
import { Trophy, PlayCircle, ShieldCheck, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { isAdmin, logout } = useAppContext();

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Trophy size={28} className="brand-icon" />
          <span>La Grada TV</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Torneos</Link>
          <Link to="/partidos" className="nav-link">
            <PlayCircle size={18} />
            Videos & Vivo
          </Link>
          
          {isAdmin ? (
            <>
              <Link to="/admin" className="nav-link admin-link">
                <ShieldCheck size={18} />
                Panel Admin
              </Link>
              <button onClick={logout} className="nav-link logout-btn">
                <LogOut size={18} />
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Login Admin</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
