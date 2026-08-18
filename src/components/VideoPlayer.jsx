import { useState } from 'react';
import { Play, Video } from 'lucide-react';
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <p className="video-date" style={{ margin: 0 }}>{video.date}</p>
          {video.views !== undefined && (
            <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0, fontWeight: '500' }}>
              {video.views} vistas
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
