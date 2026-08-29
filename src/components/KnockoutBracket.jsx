import { Link } from 'react-router-dom';
import { Trophy, ChevronRight } from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const ROUNDS = [
  { key: 'round_of_16',  label: 'Octavos',    short: '1/8' },
  { key: 'quarterfinal', label: 'Cuartos',     short: '1/4' },
  { key: 'semifinal',    label: 'Semifinal',   short: 'SF'  },
  { key: 'final',        label: 'Final',       short: 'F'   },
];

// ── Helper: who won the match ─────────────────────────────────────────────────
function getWinnerId(match, teams) {
  if (!match || match.status !== 'played') return null;
  
  const homeTeam = teams?.find(t => t.id === match.home_team_id);
  const awayTeam = teams?.find(t => t.id === match.away_team_id);
  
  if (homeTeam?.disqualified && !awayTeam?.disqualified) return match.away_team_id;
  if (awayTeam?.disqualified && !homeTeam?.disqualified) return match.home_team_id;

  if (match.home_score > match.away_score) return match.home_team_id;
  if (match.away_score > match.home_score) return match.away_team_id;
  
  const hp = match.home_penalties || 0;
  const ap = match.away_penalties || 0;
  if (hp > ap) return match.home_team_id;
  if (ap > hp) return match.away_team_id;

  return null;
}

// ── Match card inside bracket ─────────────────────────────────────────────────
function BracketMatch({ match, teams, isFinal }) {
  const homeTeam = teams.find(t => t.id === match?.home_team_id);
  const awayTeam = teams.find(t => t.id === match?.away_team_id);
  const winnerId = match ? getWinnerId(match, teams) : null;

  // Empty slot (placeholder for upcoming bracket slots)
  if (!match) {
    return (
      <div className="bm-card bm-card-empty">
        <div className="bm-team bm-team-placeholder">Por definir</div>
        <div className="bm-divider" />
        <div className="bm-team bm-team-placeholder">Por definir</div>
      </div>
    );
  }

  return (
    <Link to={`/partido/${match.id}`} className={`bm-card ${isFinal ? 'bm-card-final' : ''}`}>
      {isFinal && <div className="bm-final-crown">🏆 GRAN FINAL</div>}

      {/* Home team */}
      <div className={`bm-team ${winnerId === match.home_team_id ? 'bm-team-winner' : ''} ${winnerId && winnerId !== match.home_team_id ? 'bm-team-loser' : ''}`}>
        <div className="bm-avatar">{homeTeam ? homeTeam.name.substring(0, 2).toUpperCase() : '?'}</div>
        <span className="bm-team-name" style={{ textDecoration: homeTeam?.disqualified ? 'line-through' : 'none', color: homeTeam?.disqualified ? '#ef4444' : 'inherit' }}>
          {homeTeam?.name ?? 'Por definir'}
        </span>
        {match.status === 'played' && (
          <span className={`bm-score ${winnerId === match.home_team_id ? 'bm-score-winner' : ''}`}>
            {match.home_score}
            {(match.home_penalties != null && match.away_penalties != null) && <span style={{ fontSize: '0.65rem', color: 'var(--blue)', marginLeft: '0.2rem' }}>({match.home_penalties})</span>}
          </span>
        )}
        {winnerId === match.home_team_id && <span className="bm-winner-badge">✓</span>}
      </div>

      <div className="bm-divider" />

      {/* Away team */}
      <div className={`bm-team ${winnerId === match.away_team_id ? 'bm-team-winner' : ''} ${winnerId && winnerId !== match.away_team_id ? 'bm-team-loser' : ''}`}>
        <div className="bm-avatar">{awayTeam ? awayTeam.name.substring(0, 2).toUpperCase() : '?'}</div>
        <span className="bm-team-name" style={{ textDecoration: awayTeam?.disqualified ? 'line-through' : 'none', color: awayTeam?.disqualified ? '#ef4444' : 'inherit' }}>
          {awayTeam?.name ?? 'Por definir'}
        </span>
        {match.status === 'played' && (
          <span className={`bm-score ${winnerId === match.away_team_id ? 'bm-score-winner' : ''}`}>
            {match.away_score}
            {(match.home_penalties != null && match.away_penalties != null) && <span style={{ fontSize: '0.65rem', color: 'var(--blue)', marginLeft: '0.2rem' }}>({match.away_penalties})</span>}
          </span>
        )}
        {winnerId === match.away_team_id && <span className="bm-winner-badge">✓</span>}
      </div>

      {/* Date footer */}
      {match.date && (
        <div className="bm-footer">
          {match.status === 'played' ? (
            <span className="bm-status-played">Finalizado</span>
          ) : (
            <span className="bm-status-sched">{match.date} {match.time}</span>
          )}
          <ChevronRight size={13} />
        </div>
      )}
    </Link>
  );
}

// ── Main Bracket Component ────────────────────────────────────────────────────
export default function KnockoutBracket({ matches, teams }) {
  // Determine which rounds actually have matches or are implied
  const presentRoundKeys = new Set(matches.map(m => m.round).filter(Boolean));

  // Find the first round present to decide which rounds to show
  const roundsToShow = ROUNDS.filter(r => {
    // Always show rounds that have matches
    if (presentRoundKeys.has(r.key)) return true;
    // Show rounds that are "after" the latest defined round (for future slots)
    const latestIdx = Math.max(...[...presentRoundKeys].map(k => ROUNDS.findIndex(r2 => r2.key === k)));
    const thisIdx = ROUNDS.findIndex(r2 => r2.key === r.key);
    return thisIdx > latestIdx;
  });

  // If nothing at all, show all rounds
  const displayRounds = roundsToShow.length > 0 ? roundsToShow : ROUNDS;

  // Determine the max matches in any round to figure out required height
  const maxMatchCount = Math.max(...displayRounds.map(r => {
    return matches.filter(m => m.round === r.key).length || 1;
  }));

  // Build match slots per round
  const getRoundMatches = (roundKey) => {
    const roundMatches = matches
      .filter(m => m.round === roundKey)
      .sort((a, b) => (a.match_order || 0) - (b.match_order || 0));
    return roundMatches;
  };

  // Identify champion
  const finalMatch = matches.find(m => m.round === 'final');
  const championId = finalMatch ? getWinnerId(finalMatch, teams) : null;
  const champion = championId ? teams.find(t => t.id === championId) : null;

  return (
    <div className="bracket-wrap">
      {/* Champion banner */}
      {champion && (
        <div className="bracket-champion">
          <span className="bracket-champion-trophy">🏆</span>
          <div>
            <p className="bracket-champion-label">Campeón</p>
            <p className="bracket-champion-name">{champion.name}</p>
          </div>
        </div>
      )}

      {/* Bracket scroll container */}
      <div className="bracket-scroll">
        <div className="bracket-inner" style={{ '--rounds': displayRounds.length }}>
          {displayRounds.map((round, roundIdx) => {
            const roundMatches = getRoundMatches(round.key);
            const isFinalRound = round.key === 'final';

            return (
              <div key={round.key} className="bracket-round">
                {/* Round header */}
                <div className="bracket-round-header">
                  <span className="bracket-round-label">{round.label}</span>
                  {roundMatches.length > 0 && (
                    <span className="bracket-round-count">{roundMatches.length} partido{roundMatches.length > 1 ? 's' : ''}</span>
                  )}
                </div>

                {/* Match slots */}
                <div className="bracket-round-matches">
                  {roundMatches.length > 0 ? (
                    roundMatches.map((match, idx) => (
                      <div key={match.id} className="bracket-match-wrap">
                        <BracketMatch match={match} teams={teams} isFinal={isFinalRound} />
                        {/* Connector line to next round (not for last round) */}
                        {roundIdx < displayRounds.length - 1 && (
                          <div className="bracket-connector" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bracket-match-wrap">
                      <BracketMatch match={null} teams={teams} isFinal={isFinalRound} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        /* ── Wrapper ── */
        .bracket-wrap { display: flex; flex-direction: column; gap: 1.5rem; }

        /* ── Champion ── */
        .bracket-champion {
          display: flex; align-items: center; gap: 1rem;
          padding: 1.25rem 1.75rem;
          background: linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.06) 100%);
          border: 1px solid rgba(251,191,36,0.3);
          border-radius: var(--radius-md);
          animation: fadeIn 0.5s ease;
        }
        .bracket-champion-trophy { font-size: 2.5rem; line-height: 1; }
        .bracket-champion-label { font-size: 0.72rem; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.15rem; }
        .bracket-champion-name  { font-size: 1.4rem; font-weight: 900; color: var(--text-primary); font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }

        /* ── Bracket scroll ── */
        .bracket-scroll { overflow-x: auto; padding-bottom: 1rem; }
        .bracket-inner {
          display: flex; gap: 0; align-items: flex-start;
          min-width: max-content;
        }

        /* ── Round column ── */
        .bracket-round { display: flex; flex-direction: column; min-width: 220px; }
        .bracket-round-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.6rem 1rem; margin-bottom: 1rem;
          background: var(--bg-darker); border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm); margin-right: 40px;
        }
        .bracket-round-label { font-size: 0.78rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.8px; }
        .bracket-round-count { font-size: 0.68rem; color: var(--text-muted); }

        .bracket-round-matches {
          display: flex; flex-direction: column;
          gap: 1.5rem; position: relative;
        }

        /* ── Match wrap + connector ── */
        .bracket-match-wrap {
          display: flex; align-items: center; position: relative;
        }
        .bracket-connector {
          width: 40px; height: 2px;
          background: linear-gradient(90deg, var(--border-glass), transparent);
          flex-shrink: 0;
        }

        /* ── Match card ── */
        .bm-card {
          display: flex; flex-direction: column;
          width: 200px; border-radius: var(--radius-md);
          background: var(--bg-card); border: 1px solid var(--border-glass);
          overflow: hidden; text-decoration: none; color: inherit;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          flex-shrink: 0;
        }
        .bm-card:hover {
          border-color: rgba(59,130,246,0.4);
          box-shadow: 0 4px 20px rgba(59,130,246,0.15);
          transform: translateY(-2px);
        }
        .bm-card-final {
          width: 210px;
          border-color: rgba(251,191,36,0.3);
          box-shadow: 0 0 20px rgba(251,191,36,0.1);
        }
        .bm-card-final:hover { border-color: rgba(251,191,36,0.6); box-shadow: 0 4px 24px rgba(251,191,36,0.2); }

        .bm-card-empty { opacity: 0.4; cursor: default; pointer-events: none; }

        .bm-final-crown {
          padding: 0.35rem 0.75rem; text-align: center;
          font-size: 0.65rem; font-weight: 800; letter-spacing: 1px;
          background: linear-gradient(90deg, rgba(251,191,36,0.2), rgba(245,158,11,0.1));
          color: #fbbf24; border-bottom: 1px solid rgba(251,191,36,0.2);
        }

        /* ── Team row ── */
        .bm-team {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.55rem 0.75rem;
          transition: background 0.15s;
        }
        .bm-team-winner { background: rgba(52,211,153,0.08); }
        .bm-team-loser  { opacity: 0.45; }
        .bm-team-placeholder { color: var(--text-muted); font-size: 0.8rem; font-style: italic; }

        .bm-avatar {
          width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
          background: var(--bg-darker); border: 1px solid var(--border-glass);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.6rem; font-weight: 800; color: var(--text-secondary);
          letter-spacing: 0.5px;
        }
        .bm-team-winner .bm-avatar { border-color: rgba(52,211,153,0.5); color: #34d399; }

        .bm-team-name {
          flex: 1; min-width: 0; font-size: 0.82rem; font-weight: 700;
          color: var(--text-primary);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .bm-score {
          font-size: 1rem; font-weight: 800; color: var(--text-muted);
          font-family: 'Outfit', sans-serif; flex-shrink: 0;
        }
        .bm-score-winner { color: #34d399; }

        .bm-winner-badge {
          font-size: 0.65rem; color: #34d399; flex-shrink: 0;
          font-weight: 800;
        }

        .bm-divider { height: 1px; background: var(--border-glass); margin: 0; }

        /* ── Footer ── */
        .bm-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.35rem 0.75rem; font-size: 0.68rem;
          background: var(--bg-darker); border-top: 1px solid var(--border-glass);
          color: var(--text-muted);
        }
        .bm-status-played { color: #34d399; font-weight: 700; }
        .bm-status-sched  { color: var(--text-muted); }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .bracket-round { min-width: 180px; }
          .bm-card, .bm-card-final { width: 170px; }
          .bracket-round-header { margin-right: 28px; }
          .bracket-connector { width: 28px; }
        }
      `}</style>
    </div>
  );
}
