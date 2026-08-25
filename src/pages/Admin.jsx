import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Plus, Trash2, Edit2, X, Check, Video, List, Folder, Trophy, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { parseVideoUrl } from '../utils/videoUtils';

export default function Admin() {
  const { 
    isAdmin, 
    tournaments, updateTeamStats, addTournament, editTournament, deleteTournament, addTeam,
    videos, addVideo, editVideo, deleteVideo, 
    albums, addAlbum, editAlbum, deleteAlbum,
    locations, addLocation, editLocation, deleteLocation,
    matches, addMatch, editMatch, deleteMatch
  } = useAppContext();
  
  const navigate = useNavigate();
  
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]?.id || '');
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newTeamName, setNewTeamName] = useState('');
  
  const [activeTab, setActiveTab] = useState('tournaments'); // 'tournaments' | 'standings' | 'videos' | 'albums' | 'locations' | 'matches'
  
  const [newVideo, setNewVideo] = useState({ title: '', url: '', type: 'recording', date: new Date().toISOString().split('T')[0], album_id: '' });
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

  const [newMatch, setNewMatch] = useState({ tournament_id: '', home_team_id: '', away_team_id: '', date: new Date().toISOString().split('T')[0], time: '12:00', location_id: '', stream_url: '', round: '', match_order: 0 });
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editMatchData, setEditMatchData] = useState({});

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  // --- Team Stats Methods ---
  const handleUpdateStats = (teamId) => {
    if (editData.name) {
      updateTeamStats(selectedTournament, teamId, editData);
    }
    setEditingTeamId(null);
  };
  const handleEditClick = (team) => {
    setEditingTeamId(team.id);
    setEditData({ ...team });
  };

  // --- Video Methods ---
  const handleAddVideo = (e) => {
    e.preventDefault();
    if (newVideo.title && newVideo.url) {
      const parsed = parseVideoUrl(newVideo.url);
      const thumbnail = parsed.thumbnail || 'https://via.placeholder.com/320x180?text=Video';
      addVideo({ ...newVideo, thumbnail });
      setNewVideo({ title: '', url: '', type: 'recording', date: new Date().toISOString().split('T')[0], album_id: '' });
    }
  };
  const handleEditVideo = (video) => {
    setEditingVideoId(video.id);
    setEditVideoData({ ...video });
  };
  const handleUpdateVideo = (id) => {
    editVideo(id, editVideoData);
    setEditingVideoId(null);
  };

  // --- Album Methods ---
  const handleAddAlbum = (e) => {
    e.preventDefault();
    if (newAlbum.title) {
      addAlbum(newAlbum);
      setNewAlbum({ title: '', thumbnail: '', date: new Date().toISOString().split('T')[0] });
    }
  };
  const handleEditAlbum = (album) => {
    setEditingAlbumId(album.id);
    setEditAlbumData({ ...album });
  };
  const handleUpdateAlbum = (id) => {
    editAlbum(id, editAlbumData);
    setEditingAlbumId(null);
  };

  // --- Tournament Methods ---
  const handleAddTournament = (e) => {
    e.preventDefault();
    if (newTournamentName) {
      addTournament({ name: newTournamentName, type: newTournamentType });
      setNewTournamentName('');
      setNewTournamentType('league');
    }
  };
  const handleEditTournament = (tournament) => {
    setEditingTournamentId(tournament.id);
    setEditTournamentData({ ...tournament });
  };
  const handleUpdateTournament = (id) => {
    editTournament(id, editTournamentData);
    setEditingTournamentId(null);
  };

  // --- Location Methods ---
  const handleAddLocation = (e) => {
    e.preventDefault();
    if (newLocation.name) {
      addLocation(newLocation);
      setNewLocation({ name: '', map_url: '' });
    }
  };

  // --- Match Methods ---
  const handleAddMatch = (e) => {
    e.preventDefault();
    if (newMatch.tournament_id && newMatch.home_team_id && newMatch.away_team_id) {
      addMatch(newMatch);
      setNewMatch({ tournament_id: selectedTournament || '', home_team_id: '', away_team_id: '', date: new Date().toISOString().split('T')[0], time: '12:00', location_id: '', stream_url: '', round: '', match_order: 0 });
    }
  };

  const handleAddTeamSubmit = (e) => {
    e.preventDefault();
    if (newTeamName && selectedTournament) {
      addTeam(selectedTournament, newTeamName);
      setNewTeamName('');
    }
  };

  const currentTournament = tournaments.find(t => t.id === selectedTournament) || tournaments[0];

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <Settings size={28} color="var(--primary)" />
        <h1 className="page-title" style={{ marginBottom: 0 }}>Panel de Control</h1>
      </div>

      {/* Pestañas (Tabs) */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', borderBottom: '1px solid var(--border-glass)' }}>
        <button className={`btn ${activeTab === 'tournaments' ? 'btn-primary' : 'btn-glass'}`} style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: activeTab === 'tournaments' ? 'none' : '', flexGrow: 1 }} onClick={() => setActiveTab('tournaments')}>
          <Trophy size={18} /> Torneos
        </button>
        <button className={`btn ${activeTab === 'standings' ? 'btn-primary' : 'btn-glass'}`} style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: activeTab === 'standings' ? 'none' : '', flexGrow: 1 }} onClick={() => setActiveTab('standings')}>
          <List size={18} /> Posiciones
        </button>
        <button className={`btn ${activeTab === 'matches' ? 'btn-primary' : 'btn-glass'}`} style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: activeTab === 'matches' ? 'none' : '', flexGrow: 1 }} onClick={() => { setActiveTab('matches'); setNewMatch(prev => ({...prev, tournament_id: selectedTournament || (tournaments[0] && tournaments[0].id)})) }}>
          <CalendarIcon size={18} /> Partidos
        </button>
        <button className={`btn ${activeTab === 'locations' ? 'btn-primary' : 'btn-glass'}`} style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: activeTab === 'locations' ? 'none' : '', flexGrow: 1 }} onClick={() => setActiveTab('locations')}>
          <MapPin size={18} /> Canchas
        </button>
        <button className={`btn ${activeTab === 'videos' ? 'btn-primary' : 'btn-glass'}`} style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: activeTab === 'videos' ? 'none' : '', flexGrow: 1 }} onClick={() => setActiveTab('videos')}>
          <Video size={18} /> Videos
        </button>
        <button className={`btn ${activeTab === 'albums' ? 'btn-primary' : 'btn-glass'}`} style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: activeTab === 'albums' ? 'none' : '', flexGrow: 1 }} onClick={() => setActiveTab('albums')}>
          <Folder size={18} /> Álbumes
        </button>
      </div>

      <div className="grid-container-large" style={{ display: 'block' }}>
        
        {/* Gestión de Torneos */}
        {activeTab === 'tournaments' && (
        <section className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Crear Torneo</h2>
            <form onSubmit={handleAddTournament}>
              <div className="form-group">
                <label className="form-label">Nombre del Torneo</label>
                <input required type="text" className="form-input" value={newTournamentName} onChange={e => setNewTournamentName(e.target.value)} placeholder="Ej: Torneo Apertura 2024" />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de Torneo</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button"
                    className={`btn ${newTournamentType === 'league' ? 'btn-primary' : 'btn-glass'}`}
                    style={{ flex: 1 }}
                    onClick={() => setNewTournamentType('league')}
                  >
                    <Trophy size={16} /> Liga
                  </button>
                  <button type="button"
                    className={`btn ${newTournamentType === 'knockout' ? 'btn-primary' : 'btn-glass'}`}
                    style={{ flex: 1, background: newTournamentType === 'knockout' ? 'linear-gradient(135deg,#ef4444,#b91c1c)' : '' }}
                    onClick={() => setNewTournamentType('knockout')}
                  >
                    ⚔️ Eliminatoria
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  {newTournamentType === 'league' ? 'Liga: tabla de posiciones con puntos.' : 'Eliminatoria: bracket con octavos, cuartos, semis y final.'}
                </p>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={18} /> Crear Torneo
              </button>
            </form>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Torneos Existentes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tournaments.map(tournament => (
                <div key={tournament.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-glass)', alignItems: 'center', background: 'var(--bg-dark)' }}>
                  {editingTournamentId === tournament.id ? (
                    <>
                      <input type="text" className="form-input" value={editTournamentData.name} onChange={e => setEditTournamentData({...editTournamentData, name: e.target.value})} style={{ flex: 1 }} />
                      <button className="btn btn-primary" onClick={() => handleUpdateTournament(tournament.id)}><Check size={16} /></button>
                      <button className="btn btn-glass" onClick={() => setEditingTournamentId(null)}><X size={16} /></button>
                    </>
                  ) : (
                    <>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: '600', display: 'block' }}>{tournament.name}</span>
                        <span style={{ fontSize: '0.75rem', color: tournament.type === 'knockout' ? '#f87171' : '#34d399', fontWeight: '600' }}>
                          {tournament.type === 'knockout' ? '⚔️ Eliminatoria' : '🏆 Liga'}
                        </span>
                      </div>
                      <button className="btn btn-glass" onClick={() => handleEditTournament(tournament)}><Edit2 size={16} /></button>
                      <button className="btn btn-danger" onClick={() => deleteTournament(tournament.id)}><Trash2 size={16} /></button>
                    </>
                  )}
                </div>
              ))}
              {tournaments.length === 0 && <p className="text-muted text-center" style={{ padding: '2rem' }}>No hay torneos.</p>}
            </div>
          </div>
        </section>
        )}

        {/* Gestión de Tablas de Posiciones */}
        {activeTab === 'standings' && (
        <section className="animate-fade-in">
          <div className="form-group" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <label className="form-label">Seleccionar Torneo</label>
            <select className="form-input" value={selectedTournament || (tournaments[0] && tournaments[0].id)} onChange={(e) => setSelectedTournament(e.target.value)} style={{ background: 'var(--bg-dark)' }}>
              {tournaments.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Agregar Equipo</h3>
            <form onSubmit={handleAddTeamSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input required type="text" className="form-input" style={{ flex: 1, minWidth: '200px' }} value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="Nombre del Equipo" />
              <button type="submit" className="btn btn-primary"><Plus size={18} /> Agregar</button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentTournament?.standings?.map((team, index) => (
              <div key={team.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s`, display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                {editingTeamId === team.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Nombre del Equipo</label>
                      <input type="text" className="form-input" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} autoFocus />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {[{ label: 'PJ', key: 'played' }, { label: 'G', key: 'won' }, { label: 'E', key: 'drawn' }, { label: 'P', key: 'lost' }, { label: 'GF', key: 'goalsFor' }, { label: 'GC', key: 'goalsAgainst' }, { label: 'Faltas', key: 'fouls' }, { label: 'PTS', key: 'points' }].map((stat) => (
                        <div key={stat.key} style={{ flex: '1 1 60px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem', textAlign: 'center' }}>{stat.label}</label>
                          <input type="number" className="form-input" style={{ padding: '0.5rem', textAlign: 'center' }} value={editData[stat.key] || 0} onChange={(e) => setEditData({...editData, [stat.key]: e.target.value})} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button className="btn btn-glass" style={{ padding: '0.5rem 1rem' }} onClick={() => setEditingTeamId(null)}><X size={16} /> Cancelar</button>
                      <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => handleUpdateStats(team.id)}><Check size={16} /> Guardar</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{team.name}</p>
                      <p className="text-muted" style={{ fontSize: '0.85rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span>PJ: {team.played}</span><span>G: {team.won}</span><span>GF: {team.goalsFor}</span><span>GC: {team.goalsAgainst}</span><span>Faltas: {team.fouls || 0}</span><span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Pts: {team.points}</span>
                      </p>
                    </div>
                    <button className="btn btn-glass" style={{ padding: '0.6rem' }} onClick={() => handleEditClick(team)}><Edit2 size={16} /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Gestión de Videos */}
        {activeTab === 'videos' && (
        <section className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Añadir Video</h2>
            <form onSubmit={handleAddVideo}>
              <div className="form-group">
                <label className="form-label">URL del Video</label>
                <input required type="url" className="form-input" value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Título</label>
                <input required type="text" className="form-input" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} placeholder="Título" />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select className="form-input" style={{ background: 'var(--bg-dark)' }} value={newVideo.type} onChange={e => setNewVideo({...newVideo, type: e.target.value})}>
                  <option value="recording">Grabación</option>
                  <option value="live">Transmisión en Vivo</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Álbum (Opcional)</label>
                <select className="form-input" style={{ background: 'var(--bg-dark)' }} value={newVideo.album_id} onChange={e => setNewVideo({...newVideo, album_id: e.target.value})}>
                  <option value="">-- Ninguno --</option>
                  {albums.map(album => (
                    <option key={album.id} value={album.id}>{album.title}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}><Plus size={18} /> Guardar Video</button>
            </form>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Videos Existentes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '500px', overflowY: 'auto' }}>
              {videos.map(video => (
                <div key={video.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border-glass)', alignItems: 'center' }}>
                  {editingVideoId === video.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, paddingRight: '1rem' }}>
                      <input type="text" className="form-input" value={editVideoData.title} onChange={e => setEditVideoData({...editVideoData, title: e.target.value})} placeholder="Título" />
                      <input type="url" className="form-input" value={editVideoData.url} onChange={e => setEditVideoData({...editVideoData, url: e.target.value})} placeholder="URL" />
                      <select className="form-input" value={editVideoData.type} onChange={e => setEditVideoData({...editVideoData, type: e.target.value})} style={{ background: 'var(--bg-dark)' }}>
                        <option value="recording">Grabación</option>
                        <option value="live">Transmisión en Vivo</option>
                      </select>
                      <select className="form-input" value={editVideoData.album_id || ''} onChange={e => setEditVideoData({...editVideoData, album_id: e.target.value})} style={{ background: 'var(--bg-dark)' }}>
                        <option value="">-- Ningún álbum --</option>
                        {albums.map(album => (
                          <option key={album.id} value={album.id}>{album.title}</option>
                        ))}
                      </select>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button className="btn btn-primary" onClick={() => handleUpdateVideo(video.id)}><Check size={16} /> Guardar</button>
                        <button className="btn btn-glass" onClick={() => setEditingVideoId(null)}><X size={16} /> Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img src={video.thumbnail} alt="" style={{ width: '120px', height: '68px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <p style={{ fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: 'var(--text-primary)' }}>{video.title}</p>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>{video.type === 'live' ? 'En vivo' : 'Grabación'}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-glass" style={{ padding: '0.6rem' }} onClick={() => handleEditVideo(video)}><Edit2 size={16} /></button>
                        <button className="btn btn-danger" style={{ padding: '0.6rem' }} onClick={() => deleteVideo(video.id)}><Trash2 size={16} /></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {videos.length === 0 && <p className="text-muted text-center" style={{ padding: '2rem' }}>No hay videos.</p>}
            </div>
          </div>
        </section>
        )}

        {/* Gestión de Álbumes */}
        {activeTab === 'albums' && (
        <section className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Crear Nuevo Álbum</h2>
            <form onSubmit={handleAddAlbum}>
              <div className="form-group">
                <label className="form-label">Título del Álbum</label>
                <input required type="text" className="form-input" value={newAlbum.title} onChange={e => setNewAlbum({...newAlbum, title: e.target.value})} placeholder="Título" />
              </div>
              <div className="form-group">
                <label className="form-label">URL de la Portada (Opcional)</label>
                <input type="url" className="form-input" value={newAlbum.thumbnail} onChange={e => setNewAlbum({...newAlbum, thumbnail: e.target.value})} placeholder="https://..." />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}><Plus size={18} /> Crear Álbum</button>
            </form>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Álbumes Existentes</h2>
            <div className="grid-container">
              {albums.map(album => (
                <div key={album.id} style={{ background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', padding: '1rem', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {editingAlbumId === album.id ? (
                    <>
                      <input type="text" className="form-input" value={editAlbumData.title} onChange={e => setEditAlbumData({...editAlbumData, title: e.target.value})} placeholder="Título" />
                      <input type="url" className="form-input" value={editAlbumData.thumbnail} onChange={e => setEditAlbumData({...editAlbumData, thumbnail: e.target.value})} placeholder="URL Portada" />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleUpdateAlbum(album.id)}><Check size={16} /></button>
                        <button className="btn btn-glass" style={{ flex: 1 }} onClick={() => setEditingAlbumId(null)}><X size={16} /></button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ width: '100%', height: '120px', overflow: 'hidden', borderRadius: '4px' }}>
                        <img src={album.thumbnail || 'https://images.unsplash.com/photo-1518605368461-1ee125b29b46?q=80&w=600&auto=format&fit=crop'} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{album.title}</h3>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-glass" style={{ flex: 1 }} onClick={() => handleEditAlbum(album)}><Edit2 size={16} /></button>
                        <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => deleteAlbum(album.id)}><Trash2 size={16} /></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {albums.length === 0 && <p className="text-muted text-center" style={{ padding: '2rem', gridColumn: '1 / -1' }}>No hay álbumes.</p>}
            </div>
          </div>
        </section>
        )}
        {/* Gestión de Canchas (Locations) */}
        {activeTab === 'locations' && (
        <section className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Añadir Cancha</h2>
            <form onSubmit={handleAddLocation}>
              <div className="form-group">
                <label className="form-label">Nombre de la Cancha</label>
                <input required type="text" className="form-input" value={newLocation.name} onChange={e => setNewLocation({...newLocation, name: e.target.value})} placeholder="Ej: Cancha 1, Estadio Principal..." />
              </div>
              <div className="form-group">
                <label className="form-label">URL del Mapa (Opcional)</label>
                <input type="url" className="form-input" value={newLocation.map_url} onChange={e => setNewLocation({...newLocation, map_url: e.target.value})} placeholder="Enlace a Google Maps..." />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}><Plus size={18} /> Guardar Cancha</button>
            </form>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Canchas Existentes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {locations.map(loc => (
                <div key={loc.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-glass)', alignItems: 'center', background: 'var(--bg-dark)' }}>
                  {editingLocationId === loc.id ? (
                    <>
                      <input type="text" className="form-input" value={editLocationData.name} onChange={e => setEditLocationData({...editLocationData, name: e.target.value})} style={{ flex: 1 }} />
                      <input type="url" className="form-input" value={editLocationData.map_url || ''} onChange={e => setEditLocationData({...editLocationData, map_url: e.target.value})} style={{ flex: 1 }} />
                      <button className="btn btn-primary" onClick={() => { editLocation(loc.id, editLocationData); setEditingLocationId(null); }}><Check size={16} /></button>
                      <button className="btn btn-glass" onClick={() => setEditingLocationId(null)}><X size={16} /></button>
                    </>
                  ) : (
                    <>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: '600', display: 'block' }}>{loc.name}</span>
                        {loc.map_url && <a href={loc.map_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Ver mapa</a>}
                      </div>
                      <button className="btn btn-glass" onClick={() => { setEditingLocationId(loc.id); setEditLocationData({...loc}); }}><Edit2 size={16} /></button>
                      <button className="btn btn-danger" onClick={() => deleteLocation(loc.id)}><Trash2 size={16} /></button>
                    </>
                  )}
                </div>
              ))}
              {locations.length === 0 && <p className="text-muted text-center" style={{ padding: '2rem' }}>No hay canchas.</p>}
            </div>
          </div>
        </section>
        )}

        {/* Gestión de Partidos (Matches) */}
        {activeTab === 'matches' && (
        <section className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Programar Partido</h2>
            <form onSubmit={handleAddMatch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Torneo</label>
                <select required className="form-input" style={{ background: 'var(--bg-dark)' }} value={newMatch.tournament_id} onChange={e => setNewMatch({...newMatch, tournament_id: e.target.value, home_team_id: '', away_team_id: ''})}>
                  <option value="">-- Seleccionar Torneo --</option>
                  {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              
              {newMatch.tournament_id && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                    <label className="form-label">Equipo Local</label>
                    <select required className="form-input" style={{ background: 'var(--bg-dark)' }} value={newMatch.home_team_id} onChange={e => setNewMatch({...newMatch, home_team_id: e.target.value})}>
                      <option value="">-- Seleccionar --</option>
                      {tournaments.find(t => t.id === newMatch.tournament_id)?.standings.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                    <label className="form-label">Equipo Visitante</label>
                    <select required className="form-input" style={{ background: 'var(--bg-dark)' }} value={newMatch.away_team_id} onChange={e => setNewMatch({...newMatch, away_team_id: e.target.value})}>
                      <option value="">-- Seleccionar --</option>
                      {tournaments.find(t => t.id === newMatch.tournament_id)?.standings.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Round selector – only for knockout tournaments */}
              {tournaments.find(t => t.id === newMatch.tournament_id)?.type === 'knockout' && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: 2, minWidth: '200px' }}>
                    <label className="form-label">⚔️ Ronda del Bracket</label>
                    <select required className="form-input" style={{ background: 'var(--bg-dark)' }} value={newMatch.round} onChange={e => setNewMatch({...newMatch, round: e.target.value})}>
                      <option value="">-- Seleccionar Ronda --</option>
                      <option value="round_of_16">Octavos de Final</option>
                      <option value="quarterfinal">Cuartos de Final</option>
                      <option value="semifinal">Semifinal</option>
                      <option value="final">Final</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">N° en la ronda</label>
                    <input type="number" min="0" className="form-input" value={newMatch.match_order} onChange={e => setNewMatch({...newMatch, match_order: parseInt(e.target.value) || 0})} placeholder="0" />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Fecha</label>
                  <input required type="date" className="form-input" value={newMatch.date} onChange={e => setNewMatch({...newMatch, date: e.target.value})} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Hora</label>
                  <input required type="time" className="form-input" value={newMatch.time} onChange={e => setNewMatch({...newMatch, time: e.target.value})} />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                  <label className="form-label">Cancha</label>
                  <select className="form-input" style={{ background: 'var(--bg-dark)' }} value={newMatch.location_id} onChange={e => setNewMatch({...newMatch, location_id: e.target.value})}>
                    <option value="">-- Seleccionar Cancha --</option>
                    {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">URL de Transmisión / Video (Opcional)</label>
                <input type="url" className="form-input" value={newMatch.stream_url} onChange={e => setNewMatch({...newMatch, stream_url: e.target.value})} placeholder="https://..." />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}><Plus size={18} /> Programar Partido</button>
            </form>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Partidos Programados</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {matches.map(match => {
                const tournament = tournaments.find(t => t.id === match.tournament_id);
                const homeTeam = tournament?.standings.find(s => s.id === match.home_team_id);
                const awayTeam = tournament?.standings.find(s => s.id === match.away_team_id);
                const isEditing = editingMatchId === match.id;
                
                return (
                  <div key={match.id} className="glass-panel" style={{ padding: '1rem' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <input type="date" className="form-input" style={{ flex: 1 }} value={editMatchData.date} onChange={e => setEditMatchData({...editMatchData, date: e.target.value})} />
                          <input type="time" className="form-input" style={{ flex: 1 }} value={editMatchData.time} onChange={e => setEditMatchData({...editMatchData, time: e.target.value})} />
                          <select className="form-input" style={{ flex: 1, background: 'var(--bg-dark)' }} value={editMatchData.status} onChange={e => setEditMatchData({...editMatchData, status: e.target.value})}>
                            <option value="scheduled">Programado</option>
                            <option value="played">Finalizado</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontWeight: '600' }}>{homeTeam?.name}</span>
                          <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={editMatchData.home_score} onChange={e => setEditMatchData({...editMatchData, home_score: parseInt(e.target.value) || 0})} />
                          <span>vs</span>
                          <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={editMatchData.away_score} onChange={e => setEditMatchData({...editMatchData, away_score: parseInt(e.target.value) || 0})} />
                          <span style={{ fontWeight: '600' }}>{awayTeam?.name}</span>
                        </div>
                        <input type="url" className="form-input" placeholder="URL del video/stream" value={editMatchData.stream_url || ''} onChange={e => setEditMatchData({...editMatchData, stream_url: e.target.value})} />
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-glass" onClick={() => setEditingMatchId(null)}><X size={16} /> Cancelar</button>
                          <button className="btn btn-primary" onClick={() => { editMatch(match.id, editMatchData); setEditingMatchId(null); }}><Check size={16} /> Guardar</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{tournament?.name} • {match.date} {match.time}</p>
                          <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                            {homeTeam?.name} {match.status === 'played' ? match.home_score : ''} - {match.status === 'played' ? match.away_score : ''} {awayTeam?.name}
                          </p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--accent)', marginTop: '0.25rem' }}>Estado: {match.status === 'played' ? 'Finalizado' : 'Programado'}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-glass" onClick={() => { setEditingMatchId(match.id); setEditMatchData({...match}); }}><Edit2 size={16} /></button>
                          <button className="btn btn-danger" onClick={() => deleteMatch(match.id)}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {matches.length === 0 && <p className="text-muted text-center" style={{ padding: '2rem' }}>No hay partidos programados.</p>}
            </div>
          </div>
        </section>
        )}
      </div>
    </div>
  );
}
