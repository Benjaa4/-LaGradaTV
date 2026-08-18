import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Plus, Trash2, Edit2, X, Check, Video, List, Folder, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { parseVideoUrl } from '../utils/videoUtils';

export default function Admin() {
  const { 
    isAdmin, 
    tournaments, updateTeamStats, addTournament, editTournament, deleteTournament,
    videos, addVideo, editVideo, deleteVideo, 
    albums, addAlbum, editAlbum, deleteAlbum 
  } = useAppContext();
  
  const navigate = useNavigate();
  
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]?.id || '');
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editData, setEditData] = useState({});
  
  const [activeTab, setActiveTab] = useState('tournaments'); // 'tournaments' | 'standings' | 'videos' | 'albums'
  
  const [newVideo, setNewVideo] = useState({ title: '', url: '', type: 'recording', date: new Date().toISOString().split('T')[0], album_id: '' });
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editVideoData, setEditVideoData] = useState({});

  const [newAlbum, setNewAlbum] = useState({ title: '', thumbnail: '', date: new Date().toISOString().split('T')[0] });
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [editAlbumData, setEditAlbumData] = useState({});

  const [newTournamentName, setNewTournamentName] = useState('');
  const [editingTournamentId, setEditingTournamentId] = useState(null);
  const [editTournamentData, setEditTournamentData] = useState({});

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
      addTournament({ name: newTournamentName });
      setNewTournamentName('');
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

  const currentTournament = tournaments.find(t => t.id === selectedTournament) || tournaments[0];

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <Settings size={28} color="var(--primary)" />
        <h1 className="page-title" style={{ marginBottom: 0 }}>Panel de Control</h1>
      </div>

      {/* Pestañas (Tabs) */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-glass)' }}>
        <button className={`btn ${activeTab === 'tournaments' ? 'btn-primary' : 'btn-glass'}`} style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: activeTab === 'tournaments' ? 'none' : '' }} onClick={() => setActiveTab('tournaments')}>
          <Trophy size={18} /> Torneos
        </button>
        <button className={`btn ${activeTab === 'standings' ? 'btn-primary' : 'btn-glass'}`} style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: activeTab === 'standings' ? 'none' : '' }} onClick={() => setActiveTab('standings')}>
          <List size={18} /> Posiciones
        </button>
        <button className={`btn ${activeTab === 'videos' ? 'btn-primary' : 'btn-glass'}`} style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: activeTab === 'videos' ? 'none' : '' }} onClick={() => setActiveTab('videos')}>
          <Video size={18} /> Videos
        </button>
        <button className={`btn ${activeTab === 'albums' ? 'btn-primary' : 'btn-glass'}`} style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: activeTab === 'albums' ? 'none' : '' }} onClick={() => setActiveTab('albums')}>
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
                      <span style={{ flex: 1, fontWeight: '600' }}>{tournament.name}</span>
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
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Seleccionar Torneo</label>
            <select className="form-input" value={selectedTournament || (tournaments[0] && tournaments[0].id)} onChange={(e) => setSelectedTournament(e.target.value)} style={{ background: 'var(--bg-dark)' }}>
              {tournaments.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
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
      </div>
    </div>
  );
}
