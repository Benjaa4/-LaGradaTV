import { MapPin, Video, Calendar, Clock, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getMatteTeamStyle } from '../utils/colorUtils';

function TeamAvatar({ name }) {
  const palette = getMatteTeamStyle(name);
  return (
    <div 
      className="mc-avatar"
      style={{
        background: palette.bg,
        borderColor: palette.border,
        color: palette.color
      }}
    >
      {name?.charAt(0).toUpperCase() || '?'}
    </div>
  );
}

export default function MatchCard({ match }) {
  const { tournaments, locations, openMatchModal } = useAppContext();

  const tournament = tournaments.find(t => t.id === match.tournament_id);
  const homeTeam   = tournament?.standings?.find(s => s.id === match.home_team_id);
  const awayTeam   = tournament?.standings?.find(s => s.id === match.away_team_id);
  const location   = locations.find(l => l.id === match.location_id);

  if (!tournament || !homeTeam || !awayTeam) return null;

  const isPlayed = match.status === 'played';
  const isFinalRound = match.round === 'final';

  return (
    <div className={`match-card glass-panel ${isFinalRound ? 'match-panel-final' : ''} animate-fade-in`}>
      {/* Top bar */}
      <div className="mc-top">
        <span className="mc-league">
          <Trophy size={13} color={isFinalRound ? '#fbbf24' : 'var(--primary-light)'} /> 
          <span style={{ color: isFinalRound ? '#fbbf24' : 'inherit' }}>{tournament.name}</span>
        </span>
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
          <span className="mc-team-name" style={{ textDecoration: homeTeam.disqualified ? 'line-through' : 'none', color: homeTeam.disqualified ? '#9e3540' : 'inherit' }}>
            {homeTeam.name}
          </span>
        </div>

        {/* Score / VS */}
        <div className="mc-score-block">
          {isPlayed ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="mc-score">
                <span>{match.home_score}</span>
                <span className="mc-score-dash">-</span>
                <span>{match.away_score}</span>
              </div>
              {(match.home_penalties != null && match.away_penalties != null) && (
                <div style={{ fontSize: '0.72rem', color: 'var(--primary-light)', fontWeight: 'bold', marginTop: '0.2rem' }}>
                  ({match.home_penalties} - {match.away_penalties} pen.)
                </div>
              )}
            </div>
          ) : (
            <div className="mc-vs">VS</div>
          )}
        </div>

        {/* Away */}
        <div className="mc-team mc-team-away">
          <TeamAvatar name={awayTeam.name} />
          <span className="mc-team-name" style={{ textDecoration: awayTeam.disqualified ? 'line-through' : 'none', color: awayTeam.disqualified ? '#9e3540' : 'inherit' }}>
            {awayTeam.name}
          </span>
        </div>
      </div>

      {/* Meta info strip */}
      <div className="mc-meta">
        <span className="mc-meta-item">
          <Calendar size={13} color="var(--blue-light)" /> {match.date}
        </span>
        <span className="mc-meta-item">
          <Clock size={13} color="var(--amber-light)" /> {match.time}
        </span>
        {location && (
          <span className="mc-meta-item mc-meta-loc">
            <MapPin size={13} color="var(--emerald-light)" /> {location.name}
          </span>
        )}
      </div>

      {/* CTA Button */}
      <div className="mc-btn-wrap">
        <button 
          onClick={() => openMatchModal(match)} 
          className="btn btn-primary mc-btn"
          type="button"
        >
          {match.stream_url ? <><Video size={15} /> Ver Transmisión</> : 'Ver Ficha del Partido'}
        </button>
      </div>

      <style>{`
        .match-card {
          display: flex;
          flex-direction: column;
          position: relative;
          border-radius: var(--radius-lg);
          background: var(--bg-card);
          box-shadow: var(--nm-shadow-raised-sm);
          border: 1px solid var(--nm-border);
          transition: all 0.22s ease;
          overflow: hidden;
        }
        .match-card:hover {
          box-shadow: var(--nm-shadow-raised);
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.08);
        }

        /* Top bar */
        .mc-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem 1.25rem 0.65rem;
          border-bottom: 1px solid var(--nm-border);
          gap: 0.6rem;
        }
        .mc-league {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.74rem; font-weight: 800;
          color: var(--text-secondary); text-transform: uppercase;
          letter-spacing: 0.7px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          flex: 1; min-width: 0;
        }
        .mc-tag {
          flex-shrink: 0;
          font-size: 0.64rem; font-weight: 800;
          letter-spacing: 0.8px; padding: 0.18rem 0.55rem;
          border-radius: var(--radius-full);
        }
        .mc-tag-final { 
          background: var(--bg-sunken); 
          color: var(--text-muted); 
          border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-inset-sm); 
        }
        .mc-tag-today { 
          background: rgba(158, 53, 64, 0.16); 
          color: #d46e78; 
          border: 1px solid rgba(158, 53, 64, 0.35); 
        }

        /* Teams */
        .mc-teams {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem 1.25rem;
          gap: 0.75rem;
        }
        .mc-team {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          min-width: 0;
        }
        .mc-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--bg-sunken);
          box-shadow: var(--nm-shadow-inset);
          border: 1px solid var(--nm-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          color: var(--primary-light);
          flex-shrink: 0;
        }
        .mc-team-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary);
          text-align: center;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Score / VS */
        .mc-score-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 0 0.5rem;
        }
        .mc-score {
          font-family: 'Nunito', sans-serif;
          font-size: 1.55rem;
          font-weight: 900;
          color: var(--text-primary);
          letter-spacing: 2px;
          line-height: 1;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .mc-score-dash {
          color: var(--text-muted);
          font-weight: 400;
          font-size: 1.1rem;
        }
        .mc-vs {
          font-family: 'Nunito', sans-serif;
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--text-muted);
          background: var(--bg-sunken);
          box-shadow: var(--nm-shadow-inset-sm);
          border: 1px solid var(--nm-border);
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-sm);
          letter-spacing: 1px;
        }

        /* Meta strip */
        .mc-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 0.5rem 1rem;
          background: var(--bg-sunken);
          box-shadow: var(--nm-shadow-inset-sm);
          margin: 0 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--nm-border);
          flex-wrap: wrap;
        }
        .mc-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-secondary);
          white-space: nowrap;
        }
        .mc-meta-loc {
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }

        /* CTA */
        .mc-btn-wrap {
          padding: 0.85rem 1rem 1rem;
        }
        .mc-btn {
          width: 100%;
          padding: 0.65rem 1rem;
          font-size: 0.84rem;
          border-radius: var(--radius-md);
          box-sizing: border-box;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
