import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, PlayCircle, Calendar } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';

export default function AlbumView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { albums, videos } = useAppContext();
  const [album, setAlbum] = useState(null);
  const [albumVideos, setAlbumVideos] = useState([]);

  useEffect(() => {
    const foundAlbum = albums.find(a => a.id === id);
    if (foundAlbum) {
      setAlbum(foundAlbum);
      const filteredVideos = videos.filter(v => v.album_id === id);
      setAlbumVideos(filteredVideos);
    }
  }, [id, albums, videos]);

  if (!album) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 className="page-title">Álbum no encontrado</h2>
        <button className="btn btn-glass mt-4" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <button 
        className="btn btn-glass" 
        style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={18} /> Volver
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ width: '200px', height: '200px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', flexShrink: 0, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <img 
            src={album.thumbnail || 'https://images.unsplash.com/photo-1518605368461-1ee125b29b46?q=80&w=600&auto=format&fit=crop'} 
            alt={album.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div>
          <h1 className="page-title" style={{ margin: 0, fontSize: '3rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{album.title}</h1>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18} /> {album.date}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PlayCircle size={18} /> {albumVideos.length} videos</span>
          </div>
        </div>
      </div>

      <h2 className="section-title" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Videos del Álbum</h2>
      
      {albumVideos.length > 0 ? (
        <div className="grid-container">
          {albumVideos.map(video => (
            <div key={video.id} className="hover-lift transition-all">
              <VideoPlayer video={video} />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p className="text-muted" style={{ fontSize: '1.2rem' }}>No hay videos en este álbum todavía.</p>
        </div>
      )}
    </div>
  );
}
