import { useState } from 'react';
import { Play, Video } from 'lucide-react';
import './VideoPlayer.css';

export default function VideoPlayer({ video }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);

  const renderVideo = (url) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return <iframe className="video-element" src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} allow="autoplay; encrypted-media; fullscreen" allowFullScreen></iframe>;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return <iframe className="video-element" src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} allow="autoplay; encrypted-media; fullscreen" allowFullScreen></iframe>;
      }
      if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1].split('?')[0];
        return <iframe className="video-element" src={`https://player.vimeo.com/video/${videoId}?autoplay=1`} allow="autoplay; fullscreen" allowFullScreen></iframe>;
      }
    } catch (e) {
      console.error("Error parsing video URL:", e);
    }
    
    return <video src={url} controls autoPlay className="video-element" />;
  };

  return (
    <div className="video-card glass-panel animate-fade-in">
      {!isPlaying ? (
        <div className="video-thumbnail-container" onClick={() => setIsPlaying(true)}>
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
      ) : (
        <div className="video-player-container">
          {renderVideo(video.url)}
        </div>
      )}
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-date">{video.date}</p>
      </div>
    </div>
  );
}
