import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { parseVideoUrl } from '../utils/videoUtils';
import { ArrowLeft } from 'lucide-react';

export default function VideoView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { videos } = useAppContext();
  const [video, setVideo] = useState(null);
  const [parsed, setParsed] = useState(null);

  useEffect(() => {
    const found = videos.find(v => v.id === id);
    if (found) {
      setVideo(found);
      setParsed(parseVideoUrl(found.url));
    }
  }, [id, videos]);

  if (!video || !parsed) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 className="page-title">Video no encontrado</h2>
        <button className="btn btn-glass mt-4" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        className="btn btn-glass" 
        style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} /> Volver
      </button>

      <div className="video-container" style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem' }}>
        {parsed.embedUrl ? (
          <iframe 
            src={parsed.embedUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; encrypted-media; fullscreen" 
            allowFullScreen
            title={video.title}
          ></iframe>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            El reproductor no soporta esta URL: {video.url}
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title" style={{ margin: 0, fontSize: '2rem' }}>{video.title}</h1>
            <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
              Publicado el {video.date} • {video.type === 'live' ? <span style={{ color: '#e11d48', fontWeight: 'bold' }}>EN VIVO</span> : 'Grabación'}
            </p>
          </div>
          <div style={{ background: 'var(--bg-dark)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{video.views || 0}</span>
            <span className="text-muted" style={{ marginLeft: '0.5rem' }}>vistas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
