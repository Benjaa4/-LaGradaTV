import { MapPin, Video, Calendar, Clock, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function TeamAvatar({ name }) {
  return (
    <div style={{
      width: '52px', height: '52px', borderRadius: '50%',
      background: 'var(--bg-darker)',
      border: '2px solid var(--border-strong)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.35rem', fontWeight: '800',
      fontFamily: "'Outfit', sans-serif",
      color: 'var(--text-primary)',
      flexShrink: 0,
    }}>
      {name.substring(0, 1).toUpperCase()}
    </div>
  );
}

export default function MatchCard({ match }) {
  const { tournaments, locations } = useAppContext();

  const tournament = tournaments.find(t => t.id === match.tournament_id);
  const homeTeam   = tournament?.standings.find(s => s.id === match.home_team_id);
  const awayTeam   = tournament?.standings.find(s => s.id === match.away_team_id);
  const location   = locations.find(l => l.id === match.location_id);

  if (!tournament || !homeTeam || !awayTeam) return null;

  const isPlayed = match.status === 'played';

  return (
    <div className="match-card glass-panel animate-fade-in">
      {/* Top bar */}
      <div className="mc-top">
        <span className="mc-league"><Trophy size={11} /> {tournament.name}</span>
        {isPlayed && <span className="mc-tag mc-tag-final">FINAL</span>}
        {!isPlayed && match.date === new Date().toISOString().split('T')[0] && (
          <span className="mc-tag mc-tag-today">HOY</span>
        )}
      </div>

      {/* Teams row */}
      <div className="mc-teams">
        {/* Home */}
        <div className="mc-team">
          <TeamAvatar name={homeTeam.name} />
          <span className="mc-team-name">{homeTeam.name}</span>
        </div>

        {/* Score / VS */}
        <div className="mc-score-block">
          {isPlayed ? (
            <div className="mc-score">{match.home_score} <span className="mc-score-dash">-</span> {match.away_score}</div>
          ) : (
            <div className="mc-vs">VS</div>
          )}
        </div>

        {/* Away */}
        <div className="mc-team mc-team-away">
          <TeamAvatar name={awayTeam.name} />
          <span className="mc-team-name">{awayTeam.name}</span>
        </div>
      </div>

      {/* Meta */}
      <div className="mc-meta">
        <span className="mc-meta-item"><Calendar size={13} /> {match.date}</span>
        <span className="mc-meta-item"><Clock size={13} /> {match.time}</span>
        {location && <span className="mc-meta-item"><MapPin size={13} /> {location.name}</span>}
      </div>

      {/* CTA */}
      <Link to={`/partido/${match.id}`} className="btn btn-primary mc-btn">
        {match.stream_url ? <><Video size={15} /> Ver Transmisión</> : 'Ver Detalles'}
      </Link>

      <style>{`
        .match-card {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
          overflow: visible;
          padding: 0;
          border-radius: var(--radius-md);
        }

        /* Top bar */
        .mc-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem 0.6rem;
          border-bottom: 1px solid var(--border-glass);
          gap: 0.5rem;
        }
        .mc-league {
          display: flex; align-items: center; gap: 0.3rem;
          font-size: 0.7rem; font-weight: 700;
          color: var(--accent); text-transform: uppercase;
          letter-spacing: 0.7px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          flex: 1; min-width: 0;
        }
        .mc-tag {
          flex-shrink: 0;
          font-size: 0.62rem; font-weight: 800;
          letter-spacing: 1px; padding: 0.18rem 0.55rem;
          border-radius: var(--radius-full);
        }
        .mc-tag-final { background: rgba(161,161,170,0.12); color: #a1a1aa; border: 1px solid rgba(161,161,170,0.2); }
        .mc-tag-today  { background: rgba(225,29,72,0.15);   color: #fb7185; border: 1px solid rgba(225,29,72,0.3); }

        /* Teams */
        .mc-teams {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1rem;
          gap: 0.5rem;
        }
        .mc-team {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          min-width: 0;
        }
        .mc-team-away { align-items: center; }
        .mc-team-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
          text-align: center;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.3;
        }

        /* Score / VS */
        .mc-score-block {
          flex-shrink: 0;
          width: 70px;
          text-align: center;
        }
        .mc-score {
          font-size: 1.75rem; font-weight: 900;
          font-family: 'Outfit', sans-serif;
          color: var(--text-primary); line-height: 1;
          display: flex; align-items: center; justify-content: center; gap: 0.25rem;
        }
        .mc-score-dash { color: var(--text-muted); font-size: 1.25rem; }
        .mc-vs {
          font-size: 0.9rem; font-weight: 800;
          color: var(--text-muted); letter-spacing: 1px;
        }

        /* Meta */
        .mc-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem 1rem;
          padding: 0.6rem 1rem 0.75rem;
          border-top: 1px solid var(--border-glass);
          border-bottom: 1px solid var(--border-glass);
        }
        .mc-meta-item {
          display: flex; align-items: center; gap: 0.3rem;
          font-size: 0.77rem; color: var(--text-muted);
          white-space: nowrap;
        }

        /* CTA */
        .mc-btn {
          margin: 0.75rem 1rem 1rem;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
}
