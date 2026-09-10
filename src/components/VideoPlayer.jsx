import { useState } from 'react';
import { Play, Video, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './VideoPlayer.css';

export default function VideoPlayer({ video }) {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="video-card glass-panel animate-fade-in" onClick={() => navigate(`/video/${video.id}`)} style={{ cursor: 'pointer' }}>
      <div className="video-thumbnail-container">
        {video.thumbnail && !imgError ? (
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="video-thumbnail" 
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="video-thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-darker)' }}>
            <Video size={48} color="var(--text-muted)" />
          </div>
        )}
        <div className="play-overlay">
          <div className="play-button">
            <Play size={32} fill="currentColor" />
          </div>
        </div>
        {video.type === 'live' && (
          <div className="live-badge">EN VIVO</div>
        )}
      </div>
      
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
          <p className="video-date" style={{ margin: 0, fontSize: '0.78rem' }}>{video.date}</p>
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: '700', 
            padding: '0.15rem 0.5rem', 
            borderRadius: '4px', 
            background: 'rgba(255,255,255,0.06)', 
            border: '1px solid var(--nm-border)',
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Tv size={11} color="var(--primary-light)" /> HD
          </span>
        </div>
      </div>
    </div>
  );
}
