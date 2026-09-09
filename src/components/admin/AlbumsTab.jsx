import { useState } from 'react';
import { Folder, Video, ArrowLeft, Edit2, Trash2, Plus, X, Check, Radio } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Modal, ConfirmDialog, SectionHeader, EmptyState } from './AdminModal';
import { parseVideoUrl } from '../../utils/videoUtils';
import CustomSelect from '../CustomSelect';

export default function AlbumsTab({ setViewingState }) {
  const { albums, addAlbum, editAlbum, deleteAlbum, videos, addVideo, editVideo, deleteVideo } = useAppContext();
  const [viewingAlbumId, setViewingAlbumId] = useState(null);

  // Modals & confirms
  const [openModal, setOpenModal] = useState(null); // 'album' | 'video'
  const [confirmAction, setConfirmAction] = useState(null);
  const askConfirm = (title, message, onConfirm) => setConfirmAction({ title, message, onConfirm });

  // Forms: Album
  const [newAlbum, setNewAlbum] = useState({ title: '', thumbnail: '', date: new Date().toISOString().split('T')[0] });
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [editAlbumData, setEditAlbumData] = useState({});

  // Forms: Video
  const [newVideo, setNewVideo] = useState({ title: '', url: '', type: 'recording', date: new Date().toISOString().split('T')[0] });
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editVideoData, setEditVideoData] = useState({});

  const currentAlbum = albums.find(a => a.id === viewingAlbumId);

  const handleSetViewing = (id) => {
    setViewingAlbumId(id);
    if (setViewingState) setViewingState(!!id);
  };

  // Handlers: Album
  const handleAddAlbum = (e) => {
    e.preventDefault();
    if (newAlbum.title.trim()) {
      addAlbum({
        title: newAlbum.title.trim(),
        thumbnail: newAlbum.thumbnail.trim(),
        date: newAlbum.date
      });
      setNewAlbum({ title: '', thumbnail: '', date: new Date().toISOString().split('T')[0] });
      setOpenModal(null);
    }
  };

  const handleUpdateAlbum = (id) => {
    editAlbum(id, editAlbumData);
    setEditingAlbumId(null);
  };

  // Handlers: Video
  const handleAddVideo = (e) => {
    e.preventDefault();
    if (newVideo.title.trim() && newVideo.url.trim() && viewingAlbumId) {
      const parsed = parseVideoUrl(newVideo.url);
      addVideo({
        ...newVideo,
        title: newVideo.title.trim(),
        url: newVideo.url.trim(),
        thumbnail: parsed.thumbnail || '',
        album_id: viewingAlbumId
      });
      setNewVideo({ title: '', url: '', type: 'recording', date: new Date().toISOString().split('T')[0] });
      setOpenModal(null);
    }
  };

  const handleUpdateVideo = (id) => {
    const parsed = parseVideoUrl(editVideoData.url);
    editVideo(id, {
      ...editVideoData,
      thumbnail: parsed.thumbnail || editVideoData.thumbnail || ''
    });
    setEditingVideoId(null);
  };

  return (
    <section className="animate-fade-in">
      {/* View: Videos del Álbum */}
      {viewingAlbumId && currentAlbum ? (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button onClick={() => handleSetViewing(null)} className="btn btn-glass" style={{ padding: '0.5rem', borderRadius: '50%' }}>
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>{currentAlbum.title}</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Álbum de videos</p>
            </div>
          </div>

          <SectionHeader
            title="Videos del Álbum"
            count={videos.filter(v => v.album_id === viewingAlbumId).length}
            addLabel="Añadir Video"
            onAdd={() => setOpenModal('video')}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {videos.filter(v => v.album_id === viewingAlbumId).map(video => (
              <div key={video.id} className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
                {editingVideoId === video.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={editVideoData.title || ''}
                      onChange={e => setEditVideoData({ ...editVideoData, title: e.target.value })}
                      placeholder="Título"
                      autoFocus
                    />
                    <input
                      type="url"
                      className="form-input"
                      value={editVideoData.url || ''}
                      onChange={e => setEditVideoData({ ...editVideoData, url: e.target.value })}
                      placeholder="URL del video"
                    />
                    <CustomSelect
                      value={editVideoData.type}
                      onChange={val => setEditVideoData({ ...editVideoData, type: val })}
                      options={[
                        { value: 'recording', label: 'Grabación' },
                        { value: 'live',      label: 'En Vivo'   },
                      ]}
                      placeholder="Tipo de video"
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleUpdateVideo(video.id)}>
                        <Check size={15} /> Guardar
                      </button>
                      <button className="btn btn-glass" onClick={() => setEditingVideoId(null)}>
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={video.thumbnail || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=200'}
                      alt=""
                      style={{ width: '70px', height: '42px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {video.title}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {video.type === 'live' ? 'En Vivo' : 'Grabación'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="btn btn-glass" style={{ padding: '0.5rem' }} onClick={() => {
                        setEditingVideoId(video.id);
                        setEditVideoData({ ...video });
                      }}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => {
                        askConfirm(
                          'Eliminar Video',
                          `¿Estás seguro de eliminar el video "${video.title}"?`,
                          () => deleteVideo(video.id)
                        );
                      }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {videos.filter(v => v.album_id === viewingAlbumId).length === 0 && (
              <EmptyState message="No hay videos en este álbum" onAdd={() => setOpenModal('video')} addLabel="Añadir Video" />
            )}
          </div>
        </div>
      ) : (
        /* Lista de Álbumes */
        <div>
          <SectionHeader
            title="Galería y Álbumes de Video"
            count={albums.length}
            addLabel="Crear Álbum"
            onAdd={() => setOpenModal('album')}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {albums.map(album => (
              <div key={album.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                {editingAlbumId === album.id ? (
                  <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={editAlbumData.title || ''}
                      onChange={e => setEditAlbumData({ ...editAlbumData, title: e.target.value })}
                      placeholder="Título del álbum"
                      autoFocus
                    />
                    <input
                      type="url"
                      className="form-input"
                      value={editAlbumData.thumbnail || ''}
                      onChange={e => setEditAlbumData({ ...editAlbumData, thumbnail: e.target.value })}
                      placeholder="URL de Portada"
                    />
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleUpdateAlbum(album.id)}>
                        <Check size={14} /> Guardar
                      </button>
                      <button className="btn btn-glass" onClick={() => setEditingAlbumId(null)}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ height: '110px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => handleSetViewing(album.id)}>
                      <img
                        src={album.thumbnail || 'https://images.unsplash.com/photo-1518605368461-1ee125b29b46?q=80&w=400'}
                        alt={album.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '0.75rem' }}>
                      <p style={{ margin: '0 0 0.5rem', fontWeight: '700', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {album.title}
                      </p>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-primary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }} onClick={() => handleSetViewing(album.id)}>
                          Ver Videos ({videos.filter(v => v.album_id === album.id).length})
                        </button>
                        <button className="btn btn-glass" style={{ padding: '0.4rem' }} onClick={() => {
                          setEditingAlbumId(album.id);
                          setEditAlbumData({ ...album });
                        }}>
                          <Edit2 size={13} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => {
                          askConfirm(
                            'Eliminar Álbum',
                            `¿Estás seguro de eliminar el álbum "${album.title}" y todos sus videos?`,
                            () => deleteAlbum(album.id)
                          );
                        }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {albums.length === 0 && (
              <div style={{ gridColumn: '1/-1' }}>
                <EmptyState message="No hay álbumes creados" onAdd={() => setOpenModal('album')} addLabel="Crear Álbum" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {openModal === 'album' && (
        <Modal title="Crear Álbum" icon={<Folder size={20} />} onClose={() => setOpenModal(null)}>
          <form onSubmit={handleAddAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Título del Álbum</label>
              <input required autoFocus type="text" className="form-input" value={newAlbum.title} onChange={e => setNewAlbum({ ...newAlbum, title: e.target.value })} placeholder="Ej: Torneo Apertura 2026" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">URL de Portada (Opcional)</label>
              <input type="url" className="form-input" value={newAlbum.thumbnail} onChange={e => setNewAlbum({ ...newAlbum, thumbnail: e.target.value })} placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-primary">
              <Plus size={17} /> Crear Álbum
            </button>
          </form>
        </Modal>
      )}

      {openModal === 'video' && viewingAlbumId && (
        <Modal title="Añadir Video" icon={<Video size={20} />} onClose={() => setOpenModal(null)}>
          <form onSubmit={handleAddVideo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">URL del Video (YouTube o Twitch)</label>
              <input required autoFocus type="url" className="form-input" value={newVideo.url} onChange={e => setNewVideo({ ...newVideo, url: e.target.value })} placeholder="https://youtube.com/watch?v=... o /live/..." />
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
                  { value: 'recording', label: 'Grabación' },
                  { value: 'live',      label: 'En Vivo'   },
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

      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.title}
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </section>
  );
}
