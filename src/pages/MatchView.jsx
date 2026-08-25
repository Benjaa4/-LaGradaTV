import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MapPin, Calendar, Clock, Trophy, ChevronLeft, Video } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import { parseVideoUrl } from '../utils/videoUtils';

export default function MatchView() {
  const { id } = useParams();
  const { matches, tournaments, locations } = useAppContext();
  
  const match = matches.find(m => m.id === id);
  if (!match) return <div className="animate-fade-in"><h2 className="page-title text-center" style={{marginTop: '4rem'}}>Partido no encontrado</h2></div>;

  const tournament = tournaments.find(t => t.id === match.tournament_id);
  const homeTeam = tournament?.standings.find(s => s.id === match.home_team_id);
  const awayTeam = tournament?.standings.find(s => s.id === match.away_team_id);
  const location = locations.find(l => l.id === match.location_id);

  const embedUrl = match.stream_url ? parseVideoUrl(match.stream_url).embedUrl : null;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" className="btn btn-glass" style={{ marginBottom: '2rem' }}>
        <ChevronLeft size={16} /> Volver
      </Link>
      
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Trophy size={16} /> {tournament?.name}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {match.date}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {match.time}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-darker)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border-glass)', fontSize: '2rem', fontWeight: 'bold' }}>
              {homeTeam?.name.substring(0, 1)}
            </div>
            <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>{homeTeam?.name}</span>
          </div>

          <div style={{ padding: '0 2rem', textAlign: 'center', minWidth: '120px' }}>
            {match.status === 'played' ? (
              <div style={{ fontSize: '3rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif', letterSpacing: '2px', color: 'var(--text-primary)' }}>
                {match.home_score} - {match.away_score}
              </div>
            ) : (
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>VS</div>
            )}
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textTransform: 'uppercase', fontWeight: '600' }}>
              {match.status === 'played' ? 'FINAL' : 'PROGRAMADO'}
            </div>
          </div>

          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-darker)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border-glass)', fontSize: '2rem', fontWeight: 'bold' }}>
              {awayTeam?.name.substring(0, 1)}
            </div>
            <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>{awayTeam?.name}</span>
          </div>
        </div>

        {location && (
          <div style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--accent)" /> Cancha: {location.name}
            </h3>
            {location.map_url ? (
              <a href={location.map_url} target="_blank" rel="noreferrer" className="btn btn-primary">Ver mapa en Google Maps</a>
            ) : (
              <p className="text-muted">No hay mapa disponible para esta cancha.</p>
            )}
          </div>
        )}
      </div>

      {embedUrl ? (
        <div className="glass-panel" style={{ padding: '1rem', overflow: 'hidden' }}>
          <h3 className="section-title" style={{ padding: '1rem' }}><Video size={18} /> Transmisión del Partido</h3>
          <VideoPlayer embedUrl={embedUrl} title="Transmisión" />
        </div>
      ) : (
        <div className="glass-panel text-center" style={{ padding: '3rem 2rem' }}>
          <Video size={48} color="var(--border-glass)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Sin transmisión disponible</h3>
          <p className="text-muted">Este partido no cuenta con un video o transmisión en vivo vinculada.</p>
        </div>
      )}
    </div>
  );
}
