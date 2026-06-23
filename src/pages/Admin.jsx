import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Plus, Trash2, Edit2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Admin() {
  const { isAdmin, tournaments, updateTeamPoints, videos, addVideo, deleteVideo } = useAppContext();
  const navigate = useNavigate();
  
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]?.id || '');
  const [editingPoints, setEditingPoints] = useState({ teamId: null, points: '' });
  
  const [newVideo, setNewVideo] = useState({ title: '', url: '', thumbnail: '', type: 'recording', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const handleUpdatePoints = (teamId) => {
    if (editingPoints.points !== '') {
      updateTeamPoints(selectedTournament, teamId, editingPoints.points);
    }
    setEditingPoints({ teamId: null, points: '' });
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (newVideo.title && newVideo.url && newVideo.thumbnail) {
      addVideo(newVideo);
      setNewVideo({ title: '', url: '', thumbnail: '', type: 'recording', date: new Date().toISOString().split('T')[0] });
    }
  };

  const currentTournament = tournaments.find(t => t.id === selectedTournament);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Settings size={32} color="var(--accent)" />
        <h1 className="page-title" style={{ marginBottom: 0 }}>Panel de Control</h1>
      </div>

      <div className="grid-container-large">
        
        {/* Gestión de Tablas de Posiciones */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <h2 className="section-title">Modificar Puntos</h2>
          
          <div className="form-group">
            <label className="form-label">Seleccionar Torneo</label>
            <select 
              className="form-input" 
              value={selectedTournament} 
              onChange={(e) => setSelectedTournament(e.target.value)}
              style={{ background: 'var(--bg-dark)' }}
            >
              {tournaments.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentTournament?.standings.map(team => (
              <div key={team.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600' }}>{team.name}</p>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>Pts actuales: {team.points}</p>
                </div>
                
                {editingPoints.teamId === team.id ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ width: '80px', padding: '0.5rem' }} 
                      value={editingPoints.points}
                      onChange={(e) => setEditingPoints({...editingPoints, points: e.target.value})}
                      autoFocus
                    />
                    <button className="btn btn-primary" style={{ padding: '0.5rem' }} onClick={() => handleUpdatePoints(team.id)}>
                      OK
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-glass" style={{ padding: '0.5rem' }} onClick={() => setEditingPoints({ teamId: team.id, points: team.points })}>
                    <Edit2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Gestión de Videos */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 className="section-title">Añadir Video / Transmisión</h2>
            <form onSubmit={handleAddVideo}>
              <div className="form-group">
                <label className="form-label">Título</label>
                <input required type="text" className="form-input" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">URL del Video</label>
                  <input required type="url" className="form-input" value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})} placeholder="https://..." />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">URL de Miniatura</label>
                  <input required type="url" className="form-input" value={newVideo.thumbnail} onChange={e => setNewVideo({...newVideo, thumbnail: e.target.value})} placeholder="https://..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select className="form-input" style={{ background: 'var(--bg-dark)' }} value={newVideo.type} onChange={e => setNewVideo({...newVideo, type: e.target.value})}>
                  <option value="recording">Grabación</option>
                  <option value="live">Transmisión en Vivo</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                <Plus size={18} /> Añadir Video
              </button>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 className="section-title">Videos Existentes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {videos.map(video => (
                <div key={video.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', alignItems: 'center' }}>
                  <img src={video.thumbnail} alt="" style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{video.title}</p>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>{video.type === 'live' ? 'En vivo' : 'Grabación'}</p>
                  </div>
                  <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => deleteVideo(video.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {videos.length === 0 && <p className="text-muted text-center">No hay videos.</p>}
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}
