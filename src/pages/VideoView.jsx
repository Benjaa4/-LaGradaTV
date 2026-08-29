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

      {/* Cinematic Ambient Glow and Bezel */}
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        {/* Glow background */}
        <div style={{ 
          position: 'absolute', 
          top: '5%', left: '5%', right: '5%', bottom: '5%', 
          background: 'var(--primary)', 
          filter: 'blur(60px)', 
          opacity: 0.25, 
          zIndex: 0,
          borderRadius: '50%'
        }}></div>

        {/* Video Bezel */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          padding: '0.4rem', 
          background: 'rgba(20, 20, 25, 0.6)', 
          backdropFilter: 'blur(16px)', 
          WebkitBackdropFilter: 'blur(16px)', 
          border: '1px solid rgba(255, 255, 255, 0.05)', 
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div className="video-container" style={{ 
            width: '100%', 
            aspectRatio: '16/9', 
            background: '#000', 
            borderRadius: '12px', 
            overflow: 'hidden',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
          }}>
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
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle decorative gradient inside panel */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--primary), var(--blue))' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', paddingLeft: '1rem' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              {video.type === 'live' ? (
                <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(225, 29, 72, 0.15)', color: '#e11d48', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.3rem', letterSpacing: '0.5px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#e11d48', borderRadius: '50%', display: 'inline-block', animation: 'pulseGlow 2s infinite' }}></span>
                  EN VIVO
                </span>
              ) : (
                <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px' }}>
                  GRABACIÓN
                </span>
              )}
              <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '600' }}>{video.date}</span>
            </div>
            
            <h1 className="page-title" style={{ margin: 0, fontSize: '2.2rem', lineHeight: 1.2 }}>{video.title}</h1>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'Outfit, sans-serif' }}>
              {video.views || 0}
            </span>
            <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', marginTop: '0.2rem' }}>
              Vistas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
