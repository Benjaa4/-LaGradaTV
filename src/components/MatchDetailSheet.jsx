import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MapPin, Calendar, Clock, Trophy, X, ExternalLink, Video, Share2, Star, Check, FileText, Users } from 'lucide-react';
import { parseVideoUrl } from '../utils/videoUtils';
import './MatchDetailSheet.css';

const getRoundTheme = (round) => {
  switch (round) {
    case 'round_of_16':
      return { name: 'Octavos de Final', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.35)', text: '#60a5fa', isFinal: false };
    case 'quarterfinal':
      return { name: 'Cuartos de Final', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.35)', text: '#c084fc', isFinal: false };
    case 'semifinal':
      return { name: 'Semifinal', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)', text: '#f87171', isFinal: false };
    case 'final':
      return { name: 'Gran Final', bg: 'linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.08) 100%)', border: 'rgba(251,191,36,0.6)', text: '#fbbf24', isFinal: true };
    default:
      return { name: round || 'Fase de Grupos', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#e4e4e7', isFinal: false };
  }
};

export default function MatchDetailSheet() {
  const { activeMatchModal, closeMatchModal, tournaments, locations, isFavoriteTeam, toggleFavoriteTeam } = useAppContext();
  const sheetRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMatchModal();
    };
    if (activeMatchModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMatchModal, closeMatchModal]);

  if (!activeMatchModal) return null;

  const match = activeMatchModal;
  const tournament = tournaments.find(t => t.id === match.tournament_id);
  const homeTeam = tournament?.standings?.find(s => s.id === match.home_team_id);
  const awayTeam = tournament?.standings?.find(s => s.id === match.away_team_id);
  const location = locations.find(l => l.id === match.location_id);
  const isPlayed = match.status === 'played';
  const embedUrl = match.stream_url ? parseVideoUrl(match.stream_url).embedUrl : null;
  const theme = getRoundTheme(match.round);

  const homeFav = homeTeam?.name ? isFavoriteTeam(homeTeam.name) : false;
  const awayFav = awayTeam?.name ? isFavoriteTeam(awayTeam.name) : false;

  const homeWon = isPlayed && (
    (homeTeam?.disqualified ? false : awayTeam?.disqualified ? true : false) ||
    (match.home_score > match.away_score) ||
    (match.home_score === match.away_score && (match.home_penalties ?? 0) > (match.away_penalties ?? 0))
  );

  const awayWon = isPlayed && (
    (awayTeam?.disqualified ? false : homeTeam?.disqualified ? true : false) ||
    (match.away_score > match.home_score) ||
    (match.home_score === match.away_score && (match.away_penalties ?? 0) > (match.home_penalties ?? 0))
  );

  const handleShareWhatsApp = () => {
    const tourName = tournament?.name || 'Torneo';
    const hName = homeTeam?.name || 'Por definir';
    const aName = awayTeam?.name || 'Por definir';
    const matchUrl = `${window.location.origin}/partido/${match.id}`;
    
    let text = `*${tourName}*\n*${hName}* vs *${aName}*\n*Fecha:* ${match.date || 'A confirmar'} - ${match.time || 'A confirmar'}`;
    if (location?.name) {
      text += `\n*Cancha:* ${location.name}`;
    }
    if (isPlayed) {
      text += `\n*Resultado:* ${match.home_score} - ${match.away_score}`;
      if (match.home_penalties != null && match.away_penalties != null) {
        text += ` (Penales: ${match.home_penalties} - ${match.away_penalties})`;
      }
    }
    text += `\n\n*Seguilo en La Grada TV:*\n${matchUrl}`;

    if (navigator.share) {
      navigator.share({
        title: `${hName} vs ${aName} - La Grada TV`,
        text: text,
        url: matchUrl
      }).catch(() => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="match-sheet-backdrop" onClick={closeMatchModal}>
      <div 
        className={`match-sheet-panel ${theme.isFinal ? 'match-sheet-final' : ''}`}
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle bar */}
        <div className="sheet-handle-bar">
          <div className="sheet-handle-pill" />
        </div>

        {/* Header */}
        <div className="sheet-header">
          <div className="sheet-badges">
            <span className={`sheet-round-tag ${theme.isFinal ? 'gold-glow' : ''}`} style={{ background: theme.bg, color: theme.text, borderColor: theme.border, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              {theme.isFinal && <Trophy size={13} className="gold-text" />}
              {theme.name}
            </span>
            {tournament && (
              <span className="sheet-tour-tag">
                <Trophy size={12} /> {tournament.name}
              </span>
            )}
            {isPlayed ? (
              <span className="sheet-status-tag tag-final">FINAL</span>
            ) : match.date === new Date().toISOString().split('T')[0] ? (
              <span className="sheet-status-tag tag-today">HOY</span>
            ) : (
              <span className="sheet-status-tag tag-sched">PROGRAMADO</span>
            )}
          </div>
          <button 
            className="sheet-close-btn" 
            onClick={closeMatchModal}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sheet Body */}
        <div className="sheet-body">
          {/* Match Teams Faceoff */}
          <div className="sheet-faceoff">
            {/* Home Team */}
            <div className={`sheet-team ${homeWon ? 'team-winner' : ''}`}>
              <div className="sheet-team-avatar" style={{ position: 'relative' }}>
                {homeTeam?.name ? homeTeam.name.substring(0, 2).toUpperCase() : '?'}
                {homeTeam?.name && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteTeam(homeTeam.name);
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--nm-border)',
                      boxShadow: 'var(--nm-shadow-raised-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: homeFav ? 'var(--amber)' : 'var(--text-muted)'
                    }}
                    title={homeFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                  >
                    <Star size={13} fill={homeFav ? 'var(--amber)' : 'none'} />
                  </button>
                )}
              </div>
              <span 
                className="sheet-team-title" 
                style={{ 
                  textDecoration: homeTeam?.disqualified ? 'line-through' : 'none',
                  color: homeTeam?.disqualified ? '#ef4444' : 'inherit'
                }}
              >
                {homeTeam?.name || 'Por definir'}
              </span>
              {homeWon && (
                <span className="sheet-winner-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  GANADOR <Check size={11} strokeWidth={3} />
                </span>
              )}
            </div>

            {/* Score / VS Block */}
            <div className="sheet-score-box">
              {isPlayed ? (
                <>
                  <div className="sheet-main-score">
                    <span>{match.home_score}</span>
                    <span className="score-sep">-</span>
                    <span>{match.away_score}</span>
                  </div>
                  {match.home_penalties != null && match.away_penalties != null && (
                    <div className="sheet-pens-badge">
                      Penales: {match.home_penalties} - {match.away_penalties}
                    </div>
                  )}
                </>
              ) : (
                <div className="sheet-vs-badge">VS</div>
              )}
            </div>

            {/* Away Team */}
            <div className={`sheet-team ${awayWon ? 'team-winner' : ''}`}>
              <div className="sheet-team-avatar" style={{ position: 'relative' }}>
                {awayTeam?.name ? awayTeam.name.substring(0, 2).toUpperCase() : '?'}
                {awayTeam?.name && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteTeam(awayTeam.name);
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--nm-border)',
                      boxShadow: 'var(--nm-shadow-raised-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: awayFav ? 'var(--amber)' : 'var(--text-muted)'
                    }}
                    title={awayFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                  >
                    <Star size={13} fill={awayFav ? 'var(--amber)' : 'none'} />
                  </button>
                )}
              </div>
              <span 
                className="sheet-team-title" 
                style={{ 
                  textDecoration: awayTeam?.disqualified ? 'line-through' : 'none',
                  color: awayTeam?.disqualified ? '#ef4444' : 'inherit'
                }}
              >
                {awayTeam?.name || 'Por definir'}
              </span>
              {awayWon && (
                <span className="sheet-winner-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  GANADOR <Check size={11} strokeWidth={3} />
                </span>
              )}
            </div>
          </div>

          {/* Schedule / Time bar */}
          <div className="sheet-meta-bar">
            <div className="sheet-meta-chip">
              <Calendar size={15} color="var(--blue-light)" />
              <span>{match.date || 'Fecha a confirmar'}</span>
            </div>
            <div className="sheet-meta-chip">
              <Clock size={15} color="var(--amber-light)" />
              <span>{match.time || 'Horario a confirmar'}</span>
            </div>
          </div>

          {/* Location details */}
          {location && (
            <div className="sheet-section-card">
              <div className="sheet-section-title">
                <MapPin size={16} color="#34d399" />
                <span>Cancha: {location.name}</span>
              </div>
              {location.map_url && (
                <a 
                  href={location.map_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="sheet-map-link"
                >
                  <MapPin size={14} /> Abrir en Google Maps <ExternalLink size={13} />
                </a>
              )}
            </div>
          )}

          {/* Summary / Notes */}
          {match.description && (
            <div className="sheet-section-card">
              <div className="sheet-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <FileText size={15} color="var(--primary)" />
                <span>Resumen del Partido</span>
              </div>
              <p className="sheet-desc-text">{match.description}</p>
            </div>
          )}

          {/* Enlace para abrir/reenviar al Video de Transmisión */}
          {match.stream_url && (
            <div className="sheet-section-card" style={{ background: 'rgba(225, 95, 65, 0.08)', borderColor: 'rgba(225, 95, 65, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(225, 95, 65, 0.18)', border: '1px solid rgba(225, 95, 65, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171' }}>
                    <Video size={18} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>Transmisión en Video Disponible</p>
                    <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>Partido grabado / Transmisión oficial</p>
                  </div>
                </div>

                <a 
                  href={match.stream_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
                >
                  <ExternalLink size={14} /> Abrir Video
                </a>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="sheet-footer" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleShareWhatsApp}
              className="btn btn-whatsapp"
              style={{ flex: 1, minWidth: '150px', padding: '0.75rem 1rem' }}
              type="button"
            >
              <Share2 size={16} /> Compartir por WhatsApp
            </button>
            <Link 
              to={`/partido/${match.id}/alineaciones`} 
              onClick={closeMatchModal}
              className="btn btn-primary"
              style={{ flex: 1, minWidth: '160px', padding: '0.75rem 1rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Users size={16} /> Ver Alineaciones
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
