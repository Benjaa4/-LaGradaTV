import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Settings, Plus, Trash2, Edit2, X, Check, Video, List,
  Folder, Trophy, MapPin, Calendar as CalendarIcon, Shield,
  ChevronLeft, ArrowLeft
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { parseVideoUrl } from '../utils/videoUtils';
import CustomSelect from '../components/CustomSelect';
import CustomDatePicker from '../components/CustomDatePicker';
import CustomTimePicker from '../components/CustomTimePicker';

// ── Reusable Modal Component ────────────────────────────────────────────────
function Modal({ title, onClose, children, icon }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {icon && <span style={{ color: 'var(--primary)' }}>{icon}</span>}
            <h2 className="modal-title">{title}</h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Confirm Dialog Component ────────────────────────────────────────────────
function ConfirmDialog({ title, message, onConfirm, onCancel, confirmLabel = 'Eliminar', icon }) {
  return createPortal(
    <div className="modal-overlay" onClick={onCancel} style={{ zIndex: 10000 }}>
      <div
        className="modal-content animate-scale-in"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '380px', padding: '1.5rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {icon || <Trash2 size={24} color="#ef4444" />}
          </div>
        </div>
        <h3 style={{ margin: '0 0 0.5rem', textAlign: 'center', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 1.75rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-glass"
            style={{ flex: 1 }}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="btn"
            style={{
              flex: 1, fontWeight: '700',
              background: 'linear-gradient(135deg,#ef4444,#b91c1c)',
              color: 'white', border: 'none',
              boxShadow: '0 4px 16px rgba(239,68,68,0.35)'
            }}
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            <Trash2 size={15} /> {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}


// ── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ title, onAdd, addLabel = 'Añadir', count }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>{title}</h2>
        {count !== undefined && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{count} elemento{count !== 1 ? 's' : ''}</span>
        )}
      </div>
      {onAdd && (
        <button className="btn btn-primary desktop-add-btn" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', padding: '0.6rem 1rem', fontSize: '0.85rem' }} onClick={onAdd}>
          <Plus size={16} /> {addLabel}
        </button>
      )}
    </div>
  );
}

// ── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ message, onAdd, addLabel }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{message}</p>
      {onAdd && (
        <button className="btn btn-primary" onClick={onAdd}>
          <Plus size={16} /> {addLabel}
        </button>
      )}
    </div>
  );
}

// ── Main Admin Component ────────────────────────────────────────────────────
export default function Admin() {
  const {
    isAdmin,
    tournaments, updateTeamStats, addTournament, editTournament, deleteTournament, addTeam, deleteTeam,
    videos, addVideo, editVideo, deleteVideo,
    albums, addAlbum, editAlbum, deleteAlbum,
    locations, addLocation, editLocation, deleteLocation,
    matches, addMatch, editMatch, deleteMatch
  } = useAppContext();

  const navigate = useNavigate();

  // ── Navigation State ─────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('tournaments'); // 'tournaments' | 'agenda' | 'locations' | 'albums'
  const [viewingTournamentId, setViewingTournamentId] = useState(null);
  const [tournamentSubTab, setTournamentSubTab] = useState('standings'); // 'standings' | 'matches'
  const [viewingAlbumId, setViewingAlbumId] = useState(null);
  const [openModal, setOpenModal] = useState(null); // 'tournament' | 'team' | 'match' | 'video' | 'album' | 'location'
  const [confirmAction, setConfirmAction] = useState(null); // { title, message, onConfirm }
  const askConfirm = (title, message, onConfirm) => setConfirmAction({ title, message, onConfirm });

  // ── Form & Edit State ────────────────────────────────────────────────────
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newTeamName, setNewTeamName] = useState('');

  const [newVideo, setNewVideo] = useState({ title: '', url: '', type: 'recording', date: new Date().toISOString().split('T')[0] });
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editVideoData, setEditVideoData] = useState({});

  const [newAlbum, setNewAlbum] = useState({ title: '', thumbnail: '', date: new Date().toISOString().split('T')[0] });
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [editAlbumData, setEditAlbumData] = useState({});

  const [newTournamentName, setNewTournamentName] = useState('');
  const [newTournamentType, setNewTournamentType] = useState('league');
  const [editingTournamentId, setEditingTournamentId] = useState(null);
  const [editTournamentData, setEditTournamentData] = useState({});

  const [newLocation, setNewLocation] = useState({ name: '', map_url: '' });
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [editLocationData, setEditLocationData] = useState({});

  const [newMatch, setNewMatch] = useState({ home_team_id: '', away_team_id: '', date: new Date().toISOString().split('T')[0], time: '12:00', location_id: '', stream_url: '', round: '', match_order: 0, description: '' });
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editMatchData, setEditMatchData] = useState({});

  useEffect(() => {
    if (!isAdmin) navigate('/login');
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const currentTournament = tournaments.find(t => t.id === viewingTournamentId);
  const currentAlbum = albums.find(a => a.id === viewingAlbumId);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleUpdateStats = (teamId) => {
    if (editData.name) updateTeamStats(viewingTournamentId, teamId, editData);
    setEditingTeamId(null);
  };
  const handleEditClick = (team) => { setEditingTeamId(team.id); setEditData({ ...team }); };

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (newVideo.title && newVideo.url && viewingAlbumId) {
      const parsed = parseVideoUrl(newVideo.url);
      addVideo({ ...newVideo, album_id: viewingAlbumId, thumbnail: parsed.thumbnail || 'https://via.placeholder.com/320x180?text=Video' });
      setNewVideo({ title: '', url: '', type: 'recording', date: new Date().toISOString().split('T')[0] });
      setOpenModal(null);
    }
  };
  const handleEditVideo = (video) => { setEditingVideoId(video.id); setEditVideoData({ ...video }); };
  const handleUpdateVideo = (id) => { editVideo(id, editVideoData); setEditingVideoId(null); };

  const handleAddAlbum = (e) => {
    e.preventDefault();
    if (newAlbum.title) {
      addAlbum(newAlbum);
      setNewAlbum({ title: '', thumbnail: '', date: new Date().toISOString().split('T')[0] });
      setOpenModal(null);
    }
  };
  const handleEditAlbum = (album) => { setEditingAlbumId(album.id); setEditAlbumData({ ...album }); };
  const handleUpdateAlbum = (id) => { editAlbum(id, editAlbumData); setEditingAlbumId(null); };

  const handleAddTournament = (e) => {
    e.preventDefault();
    if (newTournamentName) {
      addTournament({ name: newTournamentName, type: newTournamentType });
      setNewTournamentName('');
      setNewTournamentType('league');
      setOpenModal(null);
    }
  };
  const handleEditTournament = (tournament) => { setEditingTournamentId(tournament.id); setEditTournamentData({ ...tournament }); };
  const handleUpdateTournament = (id) => { editTournament(id, editTournamentData); setEditingTournamentId(null); };

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (newLocation.name) {
      addLocation(newLocation);
      setNewLocation({ name: '', map_url: '' });
      setOpenModal(null);
    }
  };

  const handleAddMatch = (e) => {
    e.preventDefault();
    if (viewingTournamentId && newMatch.home_team_id && newMatch.away_team_id) {
      // Auto-assign match_order: next available slot for this round/tournament
      let matchOrder = newMatch.match_order;
      if (currentTournament?.type === 'knockout' && newMatch.round) {
        const existingOrders = matches
          .filter(m => m.tournament_id === viewingTournamentId && m.round === newMatch.round)
          .map(m => m.match_order ?? 0);
        if (existingOrders.length > 0) {
          matchOrder = Math.max(...existingOrders) + 1;
        } else {
          matchOrder = 0;
        }
      }
      addMatch({ ...newMatch, match_order: matchOrder, tournament_id: viewingTournamentId });
      setNewMatch({ home_team_id: '', away_team_id: '', date: new Date().toISOString().split('T')[0], time: '12:00', location_id: '', stream_url: '', round: '', match_order: 0, description: '' });
      setOpenModal(null);
    }
  };

  const handleAddTeamSubmit = (e) => {
    e.preventDefault();
    if (newTeamName && viewingTournamentId) {
      addTeam(viewingTournamentId, newTeamName);
      setNewTeamName('');
      setOpenModal(null);
    }
  };

  const handleSaveMatch = (originalMatch) => {
    editMatch(originalMatch.id, editMatchData);
    const tournament = tournaments.find(t => t.id === originalMatch.tournament_id);

    if (tournament?.type === 'knockout' && editMatchData.status === 'played' && editMatchData.round && editMatchData.round !== 'final') {
      const homeTeam = tournament.standings.find(s => s.id === editMatchData.home_team_id);
      const awayTeam = tournament.standings.find(s => s.id === editMatchData.away_team_id);
      let winnerId = null;

      if (homeTeam?.disqualified && !awayTeam?.disqualified) winnerId = editMatchData.away_team_id;
      else if (awayTeam?.disqualified && !homeTeam?.disqualified) winnerId = editMatchData.home_team_id;
      else {
        if (editMatchData.home_score > editMatchData.away_score) winnerId = editMatchData.home_team_id;
        else if (editMatchData.away_score > editMatchData.home_score) winnerId = editMatchData.away_team_id;
        else {
          const hp = editMatchData.home_penalties || 0;
          const ap = editMatchData.away_penalties || 0;
          if (hp > ap) winnerId = editMatchData.home_team_id;
          else if (ap > hp) winnerId = editMatchData.away_team_id;
        }
      }

      if (winnerId) {
        const rounds = ['round_of_16', 'quarterfinal', 'semifinal', 'final'];
        const currentIdx = rounds.indexOf(editMatchData.round);
        if (currentIdx !== -1 && currentIdx < rounds.length - 1) {
          const nextRound = rounds[currentIdx + 1];
          const nextMatchOrder = Math.floor((editMatchData.match_order || 0) / 2);
          const isHomeForNext = (editMatchData.match_order || 0) % 2 === 0;
          const nextMatch = matches.find(m => m.tournament_id === tournament.id && m.round === nextRound && m.match_order === nextMatchOrder);
          if (nextMatch) {
            editMatch(nextMatch.id, { ...nextMatch, [isHomeForNext ? 'home_team_id' : 'away_team_id']: winnerId });
          } else {
            addMatch({ tournament_id: tournament.id, round: nextRound, match_order: nextMatchOrder, home_team_id: isHomeForNext ? winnerId : '', away_team_id: !isHomeForNext ? winnerId : '', date: editMatchData.date, time: '12:00', status: 'scheduled', home_score: 0, away_score: 0 });
          }
        }
      }
    }

    setEditingMatchId(null);
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  const StatBadge = ({ label, value, highlight }) => (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem', padding: '0.25rem 0.4rem', background: 'var(--bg-dark)', borderRadius: '6px', minWidth: '36px' }}>
      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', fontWeight: highlight ? '800' : '600', color: highlight ? 'var(--primary)' : 'var(--text-primary)' }}>{value}</span>
    </span>
  );

  // Determine FAB action based on current view context
  const getFabAction = () => {
    if (activeTab === 'tournaments' && !viewingTournamentId) return () => setOpenModal('tournament');
    if (activeTab === 'tournaments' && viewingTournamentId && tournamentSubTab === 'standings') return () => setOpenModal('team');
    if (activeTab === 'tournaments' && viewingTournamentId && tournamentSubTab === 'matches') return () => setOpenModal('match');
    if (activeTab === 'locations') return () => setOpenModal('location');
    if (activeTab === 'albums' && !viewingAlbumId) return () => setOpenModal('album');
    if (activeTab === 'albums' && viewingAlbumId) return () => setOpenModal('video');
    return null; // Agenda has no FAB
  };
  const getFabLabel = () => {
    if (activeTab === 'tournaments' && !viewingTournamentId) return 'Crear Torneo';
    if (activeTab === 'tournaments' && viewingTournamentId && tournamentSubTab === 'standings') return 'Añadir Equipo';
    if (activeTab === 'tournaments' && viewingTournamentId && tournamentSubTab === 'matches') return 'Programar Partido';
    if (activeTab === 'locations') return 'Añadir Cancha';
    if (activeTab === 'albums' && !viewingAlbumId) return 'Crear Álbum';
    if (activeTab === 'albums' && viewingAlbumId) return 'Añadir Video';
    return '';
  };
  const fabAction = getFabAction();

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="animate-slide-up" style={{ paddingBottom: '6rem' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={22} color="white" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>Panel de Control</h1>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administración del sistema</p>
        </div>
      </div>

      {/* ── Scrollable Tabs (Only visible when not deep in a view) ── */}
      {(!viewingTournamentId && !viewingAlbumId) && (
        <div className="scrollable-tabs-container">
          <div className="scrollable-tabs">
            <button onClick={() => setActiveTab('tournaments')} className={activeTab === 'tournaments' ? 'btn btn-primary' : 'btn btn-glass'} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', fontSize: '0.82rem', fontWeight: '600', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap' }}>
              <Trophy size={16} /> Torneos
            </button>
            <button onClick={() => setActiveTab('agenda')} className={activeTab === 'agenda' ? 'btn btn-primary' : 'btn btn-glass'} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', fontSize: '0.82rem', fontWeight: '600', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap' }}>
              <CalendarIcon size={16} /> Agenda
            </button>
            <button onClick={() => setActiveTab('locations')} className={activeTab === 'locations' ? 'btn btn-primary' : 'btn btn-glass'} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', fontSize: '0.82rem', fontWeight: '600', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap' }}>
              <MapPin size={16} /> Canchas
            </button>
            <button onClick={() => setActiveTab('albums')} className={activeTab === 'albums' ? 'btn btn-primary' : 'btn btn-glass'} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', fontSize: '0.82rem', fontWeight: '600', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap' }}>
              <Folder size={16} /> Álbumes
            </button>
          </div>
        </div>
      )}

      {/* ── Tab Content ── */}
      <div>

        {/* ════════ TORNEOS ════════ */}
        {activeTab === 'tournaments' && (
          <section className="animate-fade-in">
            
            {/* View: Torneo Details */}
            {viewingTournamentId && currentTournament ? (
              <div className="animate-fade-in">
                {/* Back button & Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button onClick={() => setViewingTournamentId(null)} className="btn btn-glass" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    <ArrowLeft size={18} />
                  </button>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>{currentTournament.name}</h2>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentTournament.type === 'knockout' ? 'Eliminatoria' : 'Liga'}</p>
                  </div>
                </div>

                {/* Sub-tabs para Torneo */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)' }}>
                  <button 
                    onClick={() => setTournamentSubTab('standings')} 
                    className={`btn ${tournamentSubTab === 'standings' ? 'btn-primary' : 'btn-glass'}`} 
                    style={{ flex: 1, borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: tournamentSubTab === 'standings' ? 'none' : '' }}
                  >
                    <Shield size={16} /> Equipos
                  </button>
                  <button 
                    onClick={() => setTournamentSubTab('matches')} 
                    className={`btn ${tournamentSubTab === 'matches' ? 'btn-primary' : 'btn-glass'}`} 
                    style={{ flex: 1, borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: tournamentSubTab === 'matches' ? 'none' : '' }}
                  >
                    <CalendarIcon size={16} /> Partidos
                  </button>
                </div>

                {/* Sub-tab: Standings / Teams */}
                {tournamentSubTab === 'standings' && (
                  <div className="animate-fade-in">
                    <SectionHeader title="Equipos Participantes" count={currentTournament.standings?.length || 0} addLabel="Añadir Equipo" onAdd={() => setOpenModal('team')} />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {currentTournament?.standings?.map((team, index) => (
                        <div key={team.id} className="glass-panel animate-fade-in" style={{ animationDelay: `${index * 0.04}s`, padding: 0, overflow: 'hidden' }}>
                          {editingTeamId === team.id ? (
                            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Nombre del Equipo</label>
                                <input type="text" className="form-input" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} autoFocus />
                              </div>

                              {/* Stats grid - mobile optimized */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                {[
                                  { label: 'PJ', key: 'played' }, { label: 'G', key: 'won' },
                                  { label: 'E', key: 'drawn' }, { label: 'P', key: 'lost' },
                                  { label: 'GF', key: 'goalsFor' }, { label: 'GC', key: 'goalsAgainst' },
                                  { label: 'Faltas', key: 'fouls' }, { label: 'PTS', key: 'points' }
                                ].map(stat => (
                                  <div key={stat.key}>
                                    <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center', marginBottom: '0.25rem', textTransform: 'uppercase' }}>{stat.label}</label>
                                    <input type="number" className="form-input" style={{ textAlign: 'center', padding: '0.5rem 0.25rem', fontSize: '0.9rem' }} value={editData[stat.key] || 0} onChange={e => setEditData({ ...editData, [stat.key]: e.target.value })} />
                                  </div>
                                ))}
                              </div>

                              {/* Disqualified checkbox */}
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', background: 'rgba(239,68,68,0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                <input type="checkbox" id={`disq-${team.id}`} checked={!!editData.disqualified} onChange={e => setEditData({ ...editData, disqualified: e.target.checked })} style={{ width: '1.2rem', height: '1.2rem', accentColor: '#ef4444' }} />
                                <div>
                                  <span style={{ color: '#ef4444', fontWeight: '700', display: 'block', fontSize: '0.88rem' }}>Equipo Descalificado</span>
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>El rival avanzará automáticamente</span>
                                </div>
                              </label>

                              <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button className="btn btn-glass" style={{ flex: 1 }} onClick={() => setEditingTeamId(null)}><X size={16} /> Cancelar</button>
                                <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => handleUpdateStats(team.id)}><Check size={16} /> Guardar Cambios</button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: index < 3 ? 'var(--primary)' : 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', color: index < 3 ? 'white' : 'var(--text-muted)', flexShrink: 0 }}>
                                {index + 1}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ margin: 0, fontWeight: '700', color: team.disqualified ? '#ef4444' : 'var(--text-primary)', textDecoration: team.disqualified ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  {team.name}
                                  {!!team.disqualified && <span style={{ fontSize: '0.6rem', background: '#ef4444', color: 'white', padding: '0.1rem 0.3rem', borderRadius: '3px', textDecoration: 'none', fontWeight: '800' }}>DESC</span>}
                                </p>
                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                  <StatBadge label="PJ" value={team.played} />
                                  <StatBadge label="G" value={team.won} />
                                  <StatBadge label="GF" value={team.goalsFor} />
                                  <StatBadge label="GC" value={team.goalsAgainst} />
                                  <StatBadge label="Pts" value={team.points} highlight />
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button className="btn btn-glass" style={{ padding: '0.6rem', flexShrink: 0 }} onClick={() => handleEditClick(team)}>
                                  <Edit2 size={15} />
                                </button>
                                <button className="btn btn-danger" style={{ padding: '0.6rem', flexShrink: 0 }} onClick={() => {
                                  askConfirm(
                                    `Eliminar Equipo`,
                                    `¿Seguro que deseas eliminar el equipo "${team.name}"?`,
                                    () => deleteTeam(viewingTournamentId, team.id)
                                  );
                                }}>
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {(!currentTournament?.standings || currentTournament.standings.length === 0) && (
                        <EmptyState message="No hay equipos en este torneo" onAdd={() => setOpenModal('team')} addLabel="Añadir Equipo" />
                      )}
                    </div>
                  </div>
                )}

                {/* Sub-tab: Matches */}
                {tournamentSubTab === 'matches' && (
                  <div className="animate-fade-in">
                    <SectionHeader title="Partidos del Torneo" count={matches.filter(m => m.tournament_id === viewingTournamentId).length} addLabel="Programar Partido" onAdd={() => setOpenModal('match')} />
                    
                    {currentTournament?.type === 'knockout' && matches.filter(m => m.tournament_id === viewingTournamentId).length === 0 && (
                      <div style={{ background: 'rgba(59,130,246,0.1)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(59,130,246,0.3)', textAlign: 'center', marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem', color: 'var(--primary)' }}>Fase Eliminatoria Vacía</h4>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Puedes generar automáticamente la llave vacía de 16 equipos (Octavos, Cuartos, Semis, Final) para ir llenándola después.</p>
                        <button className="btn btn-primary" onClick={async () => {
                          const success = await generateBracket(viewingTournamentId);
                          if (success) alert('¡Llaves generadas correctamente!');
                        }}>Generar Llaves de Eliminatoria</button>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {matches.filter(m => m.tournament_id === viewingTournamentId).map(match => {
                        // For empty knockout slots, team might not exist yet
                        const homeTeam = currentTournament.standings.find(s => s.id === match.home_team_id);
                        const awayTeam = currentTournament.standings.find(s => s.id === match.away_team_id);
                        const isEditing = editingMatchId === match.id;

                        return (
                          <div key={match.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                            {isEditing ? (
                              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Editar Partido</h3>
                                  <button className="btn btn-glass" style={{ padding: '0.4rem' }} onClick={() => setEditingMatchId(null)}><X size={16} /></button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                  <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.72rem' }}>Fecha</label>
                                    <CustomDatePicker value={editMatchData.date} onChange={date => setEditMatchData({ ...editMatchData, date })} />
                                  </div>
                                  <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.72rem' }}>Hora</label>
                                    <CustomTimePicker value={editMatchData.time} onChange={time => setEditMatchData({ ...editMatchData, time })} />
                                  </div>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                  <label className="form-label" style={{ fontSize: '0.72rem' }}>Estado</label>
                                  <CustomSelect
                                    value={editMatchData.status}
                                    onChange={val => setEditMatchData({ ...editMatchData, status: val })}
                                    options={[
                                      { value: 'scheduled', label: '📅 Programado' },
                                      { value: 'played',    label: '✅ Finalizado'  },
                                    ]}
                                    placeholder="Estado del partido"
                                  />
                                </div>

                                <div style={{ background: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--border-glass)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                      <span style={{ fontSize: '0.78rem', fontWeight: '700', textAlign: 'center', color: homeTeam?.disqualified ? '#ef4444' : 'var(--text-primary)', textDecoration: homeTeam?.disqualified ? 'line-through' : 'none' }}>{homeTeam?.name || '?'}</span>
                                      <input type="number" min="0" className="form-input" style={{ width: '65px', textAlign: 'center', fontSize: '1.75rem', fontWeight: '800', padding: '0.5rem 0.25rem' }} value={editMatchData.home_score} onChange={e => setEditMatchData({ ...editMatchData, home_score: parseInt(e.target.value) || 0 })} />
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.9rem' }}>VS</div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                      <span style={{ fontSize: '0.78rem', fontWeight: '700', textAlign: 'center', color: awayTeam?.disqualified ? '#ef4444' : 'var(--text-primary)', textDecoration: awayTeam?.disqualified ? 'line-through' : 'none' }}>{awayTeam?.name || '?'}</span>
                                      <input type="number" min="0" className="form-input" style={{ width: '65px', textAlign: 'center', fontSize: '1.75rem', fontWeight: '800', padding: '0.5rem 0.25rem' }} value={editMatchData.away_score} onChange={e => setEditMatchData({ ...editMatchData, away_score: parseInt(e.target.value) || 0 })} />
                                    </div>
                                  </div>
                                </div>

                                {currentTournament?.type === 'knockout' && editMatchData.status === 'played' && (
                                  <div style={{ background: 'rgba(59,130,246,0.08)', borderRadius: 'var(--radius-sm)', padding: '1rem', border: '1px solid rgba(59,130,246,0.2)' }}>
                                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Definición por Penales (Opcional)</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textAlign: 'center' }}>Local</label>
                                        <input type="number" min="0" className="form-input" style={{ textAlign: 'center' }} placeholder="–" value={editMatchData.home_penalties ?? ''} onChange={e => setEditMatchData({ ...editMatchData, home_penalties: e.target.value === '' ? null : parseInt(e.target.value) })} />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textAlign: 'center' }}>Visitante</label>
                                        <input type="number" min="0" className="form-input" style={{ textAlign: 'center' }} placeholder="–" value={editMatchData.away_penalties ?? ''} onChange={e => setEditMatchData({ ...editMatchData, away_penalties: e.target.value === '' ? null : parseInt(e.target.value) })} />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="form-group" style={{ margin: 0 }}>
                                  <label className="form-label" style={{ fontSize: '0.72rem' }}>URL Video/Stream (Opcional)</label>
                                  <input type="url" className="form-input" placeholder="https://..." value={editMatchData.stream_url || ''} onChange={e => setEditMatchData({ ...editMatchData, stream_url: e.target.value })} />
                                </div>
                                
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label className="form-label" style={{ fontSize: '0.72rem' }}>Descripción / Resumen (Opcional)</label>
                                  <textarea className="form-input" placeholder="Escribe aquí los detalles del partido..." value={editMatchData.description || ''} onChange={e => setEditMatchData({ ...editMatchData, description: e.target.value })} rows={3} style={{ resize: 'vertical' }} />
                                </div>

                                {currentTournament?.type === 'knockout' && (
                                  <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.72rem' }}>N° en ronda (match_order) — afecta el orden visual del bracket</label>
                                    <input type="number" min="0" className="form-input" value={editMatchData.match_order ?? 0} onChange={e => setEditMatchData({ ...editMatchData, match_order: parseInt(e.target.value) || 0 })} />
                                  </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                  <button className="btn btn-glass" style={{ flex: 1 }} onClick={() => setEditingMatchId(null)}><X size={16} /> Cancelar</button>
                                  <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => handleSaveMatch(match)}><Check size={16} /> Guardar</button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px', background: match.status === 'played' ? 'rgba(52,211,153,0.15)' : 'rgba(251,191,36,0.12)', color: match.status === 'played' ? '#34d399' : '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                      {match.status === 'played' ? 'Finalizado' : 'Programado'}
                                    </span>
                                    {match.round && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{match.round}</span>}
                                    {match.round && <span style={{ fontSize: '0.65rem', fontWeight: '700', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(99,102,241,0.15)', color: 'var(--primary)' }}>#{match.match_order ?? 0}</span>}
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                                    <button className="btn btn-glass" style={{ padding: '0.4rem' }} onClick={() => { setEditingMatchId(match.id); setEditMatchData({ ...match }); }}><Edit2 size={14} /></button>
                                    <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => askConfirm('Eliminar Partido', '¿Estás seguro de eliminar este partido?', () => deleteMatch(match.id))}><Trash2 size={14} /></button>
                                  </div>
                                </div>
                                <div style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div style={{ flex: 1, textAlign: 'right' }}>
                                    <span style={{ fontWeight: '700', fontSize: '0.95rem', color: homeTeam?.disqualified ? '#ef4444' : 'var(--text-primary)', textDecoration: homeTeam?.disqualified ? 'line-through' : 'none' }}>
                                      {homeTeam?.name || 'Por definir'}
                                    </span>
                                  </div>
                                  <div style={{ padding: '0 0.75rem', textAlign: 'center', minWidth: '80px' }}>
                                    {match.status === 'played' ? (
                                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{match.home_score} - {match.away_score}</span>
                                        {match.home_penalties != null && match.away_penalties != null && (
                                          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700' }}>({match.home_penalties}-{match.away_penalties} p)</span>
                                        )}
                                      </div>
                                    ) : (
                                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>VS</span>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{match.date}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div style={{ flex: 1, textAlign: 'left' }}>
                                    <span style={{ fontWeight: '700', fontSize: '0.95rem', color: awayTeam?.disqualified ? '#ef4444' : 'var(--text-primary)', textDecoration: awayTeam?.disqualified ? 'line-through' : 'none' }}>
                                      {awayTeam?.name || 'Por definir'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {matches.filter(m => m.tournament_id === viewingTournamentId).length === 0 && (
                        <EmptyState message="No hay partidos en este torneo" onAdd={() => setOpenModal('match')} addLabel="Programar Partido" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* View: Torneos List (Default) */
              <div className="animate-fade-in">
                <SectionHeader title="Torneos" count={tournaments.length} addLabel="Nuevo Torneo" onAdd={() => setOpenModal('tournament')} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {tournaments.map(tournament => (
                    <div key={tournament.id} className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
                      {editingTournamentId === tournament.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <input type="text" className="form-input" value={editTournamentData.name} onChange={e => setEditTournamentData({ ...editTournamentData, name: e.target.value })} autoFocus />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleUpdateTournament(tournament.id)}><Check size={16} /> Guardar</button>
                            <button className="btn btn-glass" onClick={() => setEditingTournamentId(null)}><X size={16} /></button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: tournament.type === 'knockout' ? 'rgba(239,68,68,0.15)' : 'rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                            {tournament.type === 'knockout' ? '⚔️' : '🏆'}
                          </div>
                          <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setViewingTournamentId(tournament.id)}>
                            <p style={{ fontWeight: '700', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{tournament.name}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: tournament.type === 'knockout' ? '#f87171' : '#34d399', fontWeight: '600' }}>
                              {tournament.type === 'knockout' ? 'Eliminatoria' : 'Liga'} · {tournament.standings?.length || 0} equipos
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button className="btn btn-primary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setViewingTournamentId(tournament.id)}>
                              Administrar
                            </button>
                            <button className="btn btn-glass" style={{ padding: '0.6rem' }} onClick={() => handleEditTournament(tournament)}><Edit2 size={15} /></button>
                            <button className="btn btn-danger" style={{ padding: '0.6rem' }} onClick={() => askConfirm('Eliminar Torneo', `¿Estás seguro de eliminar el torneo "${tournament.name}"?`, () => deleteTournament(tournament.id))}><Trash2 size={15} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {tournaments.length === 0 && (
                    <EmptyState message="No hay torneos creados" onAdd={() => setOpenModal('tournament')} addLabel="Crear Torneo" />
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ════════ AGENDA (Partidos Programados) ════════ */}
        {activeTab === 'agenda' && (
          <section className="animate-fade-in">
            <SectionHeader title="Agenda Global" count={matches.filter(m => m.status === 'scheduled').length} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {matches.filter(m => m.status === 'scheduled')
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map(match => {
                const tournament = tournaments.find(t => t.id === match.tournament_id);
                const homeTeam = tournament?.standings.find(s => s.id === match.home_team_id);
                const awayTeam = tournament?.standings.find(s => s.id === match.away_team_id);

                return (
                  <div key={match.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(59,130,246,0.15)', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Próximo
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tournament?.name}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{match.date} {match.time}</span>
                    </div>

                    <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, textAlign: 'right' }}>
                        <span style={{ fontWeight: '700', fontSize: '1rem', color: homeTeam?.disqualified ? '#ef4444' : 'var(--text-primary)', textDecoration: homeTeam?.disqualified ? 'line-through' : 'none' }}>
                          {homeTeam?.name || 'Por definir'}
                        </span>
                      </div>
                      <div style={{ padding: '0 1rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-muted)' }}>VS</span>
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <span style={{ fontWeight: '700', fontSize: '1rem', color: awayTeam?.disqualified ? '#ef4444' : 'var(--text-primary)', textDecoration: awayTeam?.disqualified ? 'line-through' : 'none' }}>
                          {awayTeam?.name || 'Por definir'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {matches.filter(m => m.status === 'scheduled').length === 0 && (
                <EmptyState message="No hay partidos programados en ningún torneo" />
              )}
            </div>
          </section>
        )}

        {/* ════════ CANCHAS ════════ */}
        {activeTab === 'locations' && (
          <section className="animate-fade-in">
            <SectionHeader title="Canchas / Estadios" count={locations.length} addLabel="Añadir Cancha" onAdd={() => setOpenModal('location')} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {locations.map(loc => (
                <div key={loc.id} className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
                  {editingLocationId === loc.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <input type="text" className="form-input" value={editLocationData.name} onChange={e => setEditLocationData({ ...editLocationData, name: e.target.value })} placeholder="Nombre" autoFocus />
                      <input type="url" className="form-input" value={editLocationData.map_url || ''} onChange={e => setEditLocationData({ ...editLocationData, map_url: e.target.value })} placeholder="URL Mapa (Opcional)" />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { editLocation(loc.id, editLocationData); setEditingLocationId(null); }}><Check size={15} /> Guardar</button>
                        <button className="btn btn-glass" onClick={() => setEditingLocationId(null)}><X size={15} /></button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MapPin size={18} color="var(--primary)" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.name}</p>
                        {loc.map_url && <a href={loc.map_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Ver en mapa ↗</a>}
                      </div>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-glass" style={{ padding: '0.5rem' }} onClick={() => { setEditingLocationId(loc.id); setEditLocationData({ ...loc }); }}><Edit2 size={14} /></button>
                        <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => askConfirm('Eliminar Cancha', `¿Estás seguro de eliminar la cancha "${loc.name}"?`, () => deleteLocation(loc.id))}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {locations.length === 0 && <EmptyState message="No hay canchas registradas" onAdd={() => setOpenModal('location')} addLabel="Añadir Cancha" />}
            </div>
          </section>
        )}

        {/* ════════ ÁLBUMES & VIDEOS ════════ */}
        {activeTab === 'albums' && (
          <section className="animate-fade-in">
            {viewingAlbumId && currentAlbum ? (
              <div className="animate-fade-in">
                {/* Back button & Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button onClick={() => setViewingAlbumId(null)} className="btn btn-glass" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    <ArrowLeft size={18} />
                  </button>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>{currentAlbum.title}</h2>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Álbum de videos</p>
                  </div>
                </div>

                <SectionHeader title="Videos del Álbum" count={videos.filter(v => v.album_id === viewingAlbumId).length} addLabel="Añadir Video" onAdd={() => setOpenModal('video')} />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {videos.filter(v => v.album_id === viewingAlbumId).map(video => (
                    <div key={video.id} className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
                      {editingVideoId === video.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <input type="text" className="form-input" value={editVideoData.title} onChange={e => setEditVideoData({ ...editVideoData, title: e.target.value })} placeholder="Título" autoFocus />
                          <input type="url" className="form-input" value={editVideoData.url} onChange={e => setEditVideoData({ ...editVideoData, url: e.target.value })} placeholder="URL" />
                          <select className="form-input" style={{ background: 'var(--bg-dark)' }} value={editVideoData.type} onChange={e => setEditVideoData({ ...editVideoData, type: e.target.value })}>
                            <option value="recording">Grabación</option>
                            <option value="live">Transmisión en Vivo</option>
                          </select>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleUpdateVideo(video.id)}><Check size={15} /> Guardar</button>
                            <button className="btn btn-glass" onClick={() => setEditingVideoId(null)}><X size={15} /></button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={video.thumbnail} alt="" style={{ width: '70px', height: '42px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{video.title}</p>
                            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>{video.type === 'live' ? '🔴 En Vivo' : '🎬 Grabación'}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button className="btn btn-glass" style={{ padding: '0.5rem' }} onClick={() => handleEditVideo(video)}><Edit2 size={14} /></button>
                            <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => askConfirm('Eliminar Video', `¿Estás seguro de eliminar el video "${video.title}"?`, () => deleteVideo(video.id))}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {videos.filter(v => v.album_id === viewingAlbumId).length === 0 && <EmptyState message="No hay videos en este álbum" onAdd={() => setOpenModal('video')} addLabel="Añadir Video" />}
                </div>

              </div>
            ) : (
              <div className="animate-fade-in">
                <SectionHeader title="Álbumes" count={albums.length} addLabel="Crear Álbum" onAdd={() => setOpenModal('album')} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
                  {albums.map(album => (
                    <div key={album.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                      {editingAlbumId === album.id ? (
                        <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <input type="text" className="form-input" value={editAlbumData.title} onChange={e => setEditAlbumData({ ...editAlbumData, title: e.target.value })} placeholder="Título" autoFocus />
                          <input type="url" className="form-input" value={editAlbumData.thumbnail} onChange={e => setEditAlbumData({ ...editAlbumData, thumbnail: e.target.value })} placeholder="URL Portada" />
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleUpdateAlbum(album.id)}><Check size={14} /></button>
                            <button className="btn btn-glass" onClick={() => setEditingAlbumId(null)}><X size={14} /></button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ height: '100px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setViewingAlbumId(album.id)}>
                            <img src={album.thumbnail || 'https://images.unsplash.com/photo-1518605368461-1ee125b29b46?q=80&w=400'} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ padding: '0.75rem' }}>
                            <p style={{ margin: '0 0 0.5rem', fontWeight: '700', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{album.title}</p>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <button className="btn btn-primary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }} onClick={() => setViewingAlbumId(album.id)}>Ver Videos</button>
                              <button className="btn btn-glass" style={{ padding: '0.4rem', fontSize: '0.78rem' }} onClick={() => handleEditAlbum(album)}><Edit2 size={13} /></button>
                              <button className="btn btn-danger" style={{ padding: '0.4rem', fontSize: '0.78rem' }} onClick={() => askConfirm('Eliminar Álbum', `¿Estás seguro de eliminar el álbum "${album.title}"?`, () => deleteAlbum(album.id))}><Trash2 size={13} /></button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {albums.length === 0 && <div style={{ gridColumn: '1/-1' }}><EmptyState message="No hay álbumes" onAdd={() => setOpenModal('album')} addLabel="Crear Álbum" /></div>}
                </div>
              </div>
            )}
          </section>
        )}

      </div>

      {/* ── Floating Action Button (Mobile) ── */}
      {fabAction && (
        <button className="fab-button" onClick={fabAction} title={getFabLabel()} style={{ color: 'white', fontSize: '1.5rem', lineHeight: 1 }}>
          <Plus size={26} />
        </button>
      )}

      {/* ══════════════════════════════════════
          MODALS
      ══════════════════════════════════════ */}

      {/* Modal: Crear Torneo */}
      {openModal === 'tournament' && (
        <Modal title="Nuevo Torneo" icon={<Trophy size={20} />} onClose={() => setOpenModal(null)}>
          <form onSubmit={handleAddTournament} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Nombre del Torneo</label>
              <input required autoFocus type="text" className="form-input" value={newTournamentName} onChange={e => setNewTournamentName(e.target.value)} placeholder="Ej: Torneo Apertura 2025" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Tipo de Torneo</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className={`btn ${newTournamentType === 'league' ? 'btn-primary' : 'btn-glass'}`} style={{ flex: 1 }} onClick={() => setNewTournamentType('league')}>
                  🏆 Liga
                </button>
                <button type="button" className={`btn ${newTournamentType === 'knockout' ? 'btn-primary' : 'btn-glass'}`} style={{ flex: 1, background: newTournamentType === 'knockout' ? 'linear-gradient(135deg,#ef4444,#b91c1c)' : '' }} onClick={() => setNewTournamentType('knockout')}>
                  ⚔️ Eliminatoria
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Plus size={17} /> Crear Torneo
            </button>
          </form>
        </Modal>
      )}

      {/* Modal: Añadir Equipo (uses viewingTournamentId) */}
      {openModal === 'team' && (
        <Modal title={`Añadir Equipo a ${currentTournament?.name}`} icon={<Shield size={20} />} onClose={() => setOpenModal(null)}>
          <form onSubmit={handleAddTeamSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Nombre del Equipo</label>
              <input required autoFocus type="text" className="form-input" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="Ej: Real Madrid" />
            </div>
            <button type="submit" className="btn btn-primary">
              <Plus size={17} /> Añadir Equipo
            </button>
          </form>
        </Modal>
      )}

      {/* Modal: Programar Partido (uses viewingTournamentId) */}
      {openModal === 'match' && (
        <Modal title={`Programar en ${currentTournament?.name}`} icon={<CalendarIcon size={20} />} onClose={() => setOpenModal(null)}>
          <form onSubmit={handleAddMatch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Local</label>
                <CustomSelect
                  required
                  value={newMatch.home_team_id}
                  onChange={val => setNewMatch({ ...newMatch, home_team_id: val })}
                  options={currentTournament?.standings.map(s => ({ value: s.id, label: s.name })) || []}
                  placeholder="Equipo local"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Visitante</label>
                <CustomSelect
                  required
                  value={newMatch.away_team_id}
                  onChange={val => setNewMatch({ ...newMatch, away_team_id: val })}
                  options={currentTournament?.standings.map(s => ({ value: s.id, label: s.name })) || []}
                  placeholder="Equipo visitante"
                />
              </div>
            </div>
            {currentTournament?.type === 'knockout' && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Ronda</label>
                  <CustomSelect
                    required
                    value={newMatch.round}
                    onChange={val => setNewMatch({ ...newMatch, round: val })}
                    options={[
                      { value: 'round_of_16',  label: '🔢 Octavos'   },
                      { value: 'quarterfinal', label: '⚔️ Cuartos'   },
                      { value: 'semifinal',    label: '🔥 Semifinal' },
                      { value: 'final',        label: '🏆 Final'     },
                    ]}
                    placeholder="Seleccionar ronda"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">N° en ronda</label>
                  <input type="number" min="0" className="form-input" value={newMatch.match_order} onChange={e => setNewMatch({ ...newMatch, match_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Fecha</label>
                <CustomDatePicker value={newMatch.date} onChange={date => setNewMatch({ ...newMatch, date })} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Hora</label>
                <CustomTimePicker value={newMatch.time} onChange={time => setNewMatch({ ...newMatch, time })} />
              </div>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Cancha (Opcional)</label>
              <CustomSelect
                value={newMatch.location_id}
                onChange={val => setNewMatch({ ...newMatch, location_id: val })}
                options={[
                  { value: '', label: '— Sin cancha —' },
                  ...locations.map(loc => ({ value: loc.id, label: `📍 ${loc.name}` }))
                ]}
                placeholder="Sin cancha asignada"
              />
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Descripción / Resumen (Opcional)</label>
              <textarea className="form-input" placeholder="Escribe aquí los detalles del partido..." value={newMatch.description || ''} onChange={e => setNewMatch({ ...newMatch, description: e.target.value })} rows={3} style={{ resize: 'vertical' }} />
            </div>

            <button type="submit" className="btn btn-primary">
              <Plus size={17} /> Programar Partido
            </button>
          </form>
        </Modal>
      )}

      {/* Modal: Añadir Video (uses viewingAlbumId) */}
      {openModal === 'video' && (
        <Modal title="Añadir Video" icon={<Video size={20} />} onClose={() => setOpenModal(null)}>
          <form onSubmit={handleAddVideo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">URL del Video</label>
              <input required autoFocus type="url" className="form-input" value={newVideo.url} onChange={e => setNewVideo({ ...newVideo, url: e.target.value })} placeholder="https://youtube.com/..." />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Título</label>
              <input required type="text" className="form-input" value={newVideo.title} onChange={e => setNewVideo({ ...newVideo, title: e.target.value })} placeholder="Título del video" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Tipo</label>
              <CustomSelect
                value={newVideo.type}
                onChange={val => setNewVideo({ ...newVideo, type: val })}
                options={[
                  { value: 'recording', label: '🎬 Grabación' },
                  { value: 'live',      label: '🔴 En Vivo'   },
                ]}
                placeholder="Tipo de video"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Plus size={17} /> Guardar Video en Álbum
            </button>
          </form>
        </Modal>
      )}

      {/* Modal: Crear Álbum */}
      {openModal === 'album' && (
        <Modal title="Crear Álbum" icon={<Folder size={20} />} onClose={() => setOpenModal(null)}>
          <form onSubmit={handleAddAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Título del Álbum</label>
              <input required autoFocus type="text" className="form-input" value={newAlbum.title} onChange={e => setNewAlbum({ ...newAlbum, title: e.target.value })} placeholder="Ej: Fotos Torneo 2025" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">URL Portada (Opcional)</label>
              <input type="url" className="form-input" value={newAlbum.thumbnail} onChange={e => setNewAlbum({ ...newAlbum, thumbnail: e.target.value })} placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-primary">
              <Plus size={17} /> Crear Álbum
            </button>
          </form>
        </Modal>
      )}

      {/* Modal: Añadir Cancha */}
      {openModal === 'location' && (
        <Modal title="Añadir Cancha" icon={<MapPin size={20} />} onClose={() => setOpenModal(null)}>
          <form onSubmit={handleAddLocation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Nombre de la Cancha</label>
              <input required autoFocus type="text" className="form-input" value={newLocation.name} onChange={e => setNewLocation({ ...newLocation, name: e.target.value })} placeholder="Ej: Cancha Principal" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">URL de Google Maps (Opcional)</label>
              <input type="url" className="form-input" value={newLocation.map_url} onChange={e => setNewLocation({ ...newLocation, map_url: e.target.value })} placeholder="https://maps.google.com/..." />
            </div>
            <button type="submit" className="btn btn-primary">
              <Plus size={17} /> Guardar Cancha
            </button>
          </form>
        </Modal>
      )}

      {/* Confirm Dialog */}
      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.title}
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

    </div>
  );
}
