import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Calendar as CalendarIcon,
  MapPin, Folder, LogOut, SlidersHorizontal, ShieldCheck
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TournamentsTab from '../components/admin/TournamentsTab';
import AgendaTab from '../components/admin/AgendaTab';
import LocationsTab from '../components/admin/LocationsTab';
import AlbumsTab from '../components/admin/AlbumsTab';

export default function Admin() {
  const { logout } = useAppContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('tournaments'); // 'tournaments' | 'agenda' | 'locations' | 'albums'
  const [isViewingDeep, setIsViewingDeep] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* ── Page Header con Icono Destacado e Identificador Admin ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)',
            boxShadow: 'var(--accent-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            flexShrink: 0
          }}>
            <SlidersHorizontal size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>
                Panel de Control
              </h1>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.68rem',
                fontWeight: '800',
                letterSpacing: '0.5px',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: 'var(--primary)'
              }}>
                <ShieldCheck size={13} />
                ADMIN
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Gestión Integral y Configuración de La Grada TV
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-glass"
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--rose)', borderColor: 'rgba(244, 63, 94, 0.25)' }}
          title="Cerrar sesión"
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>

      {/* ── Scrollable Navigation Tabs (Neumorphic Style) ── */}
      {!isViewingDeep && (
        <div className="scrollable-tabs-container" style={{ marginBottom: '1.75rem' }}>
          <div className="scrollable-tabs">
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`btn ${activeTab === 'tournaments' ? 'btn-primary' : 'btn-glass'}`}
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
            >
              <Trophy size={16} /> Torneos
            </button>
            <button
              onClick={() => setActiveTab('agenda')}
              className={`btn ${activeTab === 'agenda' ? 'btn-primary' : 'btn-glass'}`}
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
            >
              <CalendarIcon size={16} /> Agenda Global
            </button>
            <button
              onClick={() => setActiveTab('locations')}
              className={`btn ${activeTab === 'locations' ? 'btn-primary' : 'btn-glass'}`}
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
            >
              <MapPin size={16} /> Canchas
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`btn ${activeTab === 'albums' ? 'btn-primary' : 'btn-glass'}`}
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
            >
              <Folder size={16} /> Álbumes y Videos
            </button>
          </div>
        </div>
      )}

      {/* ── Tab Content Submodules ── */}
      <div>
        {activeTab === 'tournaments' && <TournamentsTab setViewingState={setIsViewingDeep} />}
        {activeTab === 'agenda' && <AgendaTab />}
        {activeTab === 'locations' && <LocationsTab />}
        {activeTab === 'albums' && <AlbumsTab setViewingState={setIsViewingDeep} />}
      </div>
    </div>
  );
}
