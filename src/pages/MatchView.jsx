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
  const theme = getRoundTheme(match.round);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" className="btn btn-glass" style={{ marginBottom: '2rem' }}>
        <ChevronLeft size={16} /> Volver
      </Link>
      
      <div 
        className={`glass-panel match-panel ${match.round === 'final' ? 'match-panel-final' : ''}`} 
        style={{ 
          padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem',
          '--theme-bg': theme.bg,
          '--theme-border': theme.border,
          '--theme-text': theme.text,
          '--theme-glow': theme.glow,
          background: theme.bg,
          borderColor: theme.border,
          boxShadow: theme.glow,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {theme.isFinal && (
          <div className="final-rays" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(251,191,36,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
        )}

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ color: theme.text, fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.25rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textShadow: theme.isFinal ? '0 0 10px rgba(251,191,36,0.5)' : 'none' }}>
            {theme.name}
          </p>
          <p style={{ color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <Trophy size={14} /> {tournament?.name}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', fontSize: '0.95rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1.5rem', borderRadius: '20px', display: 'inline-flex' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {match.date}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {match.time}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--bg-darker)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${theme.border}`, fontSize: '2.5rem', fontWeight: 'bold', color: theme.text, boxShadow: theme.glow }}>
              {homeTeam?.name.substring(0, 1)}
            </div>
            <span style={{ fontWeight: '700', fontSize: '1.25rem', textDecoration: homeTeam?.disqualified ? 'line-through' : 'none', color: homeTeam?.disqualified ? '#ef4444' : 'inherit' }}>
              {homeTeam?.name}
            </span>
          </div>

          <div style={{ padding: '0 2rem', textAlign: 'center', minWidth: '120px' }}>
            {match.status === 'played' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: '900', fontFamily: 'Outfit, sans-serif', letterSpacing: '2px', color: 'var(--text-primary)', lineHeight: 1, textShadow: theme.isFinal ? '0 0 20px rgba(251,191,36,0.3)' : 'none' }}>
                  {match.home_score} - {match.away_score}
                </div>
                {(match.home_penalties != null && match.away_penalties != null) && (
                  <div style={{ fontSize: '1.2rem', color: 'var(--blue)', fontWeight: 'bold', marginTop: '0.5rem' }}>
                    ({match.home_penalties} - {match.away_penalties} p.)
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>VS</div>
            )}
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textTransform: 'uppercase', fontWeight: '600' }}>
              {match.status === 'played' ? 'FINAL' : 'PROGRAMADO'}
            </div>
          </div>

          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--bg-darker)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${theme.border}`, fontSize: '2.5rem', fontWeight: 'bold', color: theme.text, boxShadow: theme.glow }}>
              {awayTeam?.name.substring(0, 1)}
            </div>
            <span style={{ fontWeight: '700', fontSize: '1.25rem', textDecoration: awayTeam?.disqualified ? 'line-through' : 'none', color: awayTeam?.disqualified ? '#ef4444' : 'inherit' }}>
              {awayTeam?.name}
            </span>
          </div>
        </div>

        {location && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${theme.border}`, position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.text }}>
              <MapPin size={18} color="var(--accent)" /> Cancha: {location.name}
            </h3>
            {location.map_url ? (
              <a href={location.map_url} target="_blank" rel="noreferrer" className="btn btn-primary">Ver mapa en Google Maps</a>
            ) : (
              <p className="text-muted">No hay mapa disponible para esta cancha.</p>
            )}
          </div>
        )}

        {match.description && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${theme.border}`, position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.text }}>
              📝 Resumen del Partido
            </h3>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              {match.description}
            </p>
          </div>
        )}
      </div>

      {embedUrl ? (
        <div className="glass-panel" style={{ padding: '1rem', overflow: 'hidden' }}>
          <h3 className="section-title" style={{ padding: '1rem' }}><Video size={18} /> Transmisión del Partido</h3>
          <div className="video-container" style={{ 
            width: '100%', 
            aspectRatio: '16/9', 
            background: '#000', 
            borderRadius: '12px', 
            overflow: 'hidden'
          }}>
            <iframe 
              src={embedUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; encrypted-media; fullscreen" 
              allowFullScreen
              title="Transmisión"
            ></iframe>
          </div>
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

const getRoundTheme = (round) => {
  switch (round) {
    case 'round_of_16':
      return { name: 'Octavos de Final', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.4)', text: '#60a5fa', glow: '0 0 20px rgba(59,130,246,0.15)' };
    case 'quarterfinal':
      return { name: 'Cuartos de Final', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.4)', text: '#c084fc', glow: '0 0 20px rgba(168,85,247,0.15)' };
    case 'semifinal':
      return { name: 'Semifinal', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.4)', text: '#f87171', glow: '0 0 20px rgba(239,68,68,0.15)' };
    case 'final':
      return { name: '🏆 Gran Final', bg: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.05) 100%)', border: 'rgba(251,191,36,0.6)', text: '#fbbf24', glow: '0 0 30px rgba(251,191,36,0.25)', isFinal: true };
    default:
      return { name: round || 'Fase de Grupos', bg: 'var(--bg-card)', border: 'var(--border-glass)', text: 'var(--primary)', glow: 'none' };
  }
};
