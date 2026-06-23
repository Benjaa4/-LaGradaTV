import { useAppContext } from '../context/AppContext';
import VideoPlayer from '../components/VideoPlayer';

export default function Matches() {
  const { videos } = useAppContext();

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Videos y Transmisiones</h1>
      <p className="text-secondary mb-4" style={{ fontSize: '1.1rem' }}>
        Revive los mejores momentos de los partidos y disfruta de las transmisiones en vivo.
      </p>

      {videos.length === 0 ? (
        <p className="text-muted" style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
          No hay videos disponibles en este momento.
        </p>
      ) : (
        <div className="grid-container">
          {videos.map(video => (
            <VideoPlayer key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
