import { Link } from 'react-router-dom';

// ── Constants ─────────────────────────────────────────────────────────────────
const ALL_ROUNDS = [
  { key: 'round_of_16',  label: 'Octavos',   slots: 8 },
  { key: 'quarterfinal', label: 'Cuartos',    slots: 4 },
  { key: 'semifinal',    label: 'Semifinal',  slots: 2 },
  { key: 'final',        label: 'Final',      slots: 1 },
];

const CARD_H = 105;
const CARD_GAP = 20;

// ── Helper: who won ───────────────────────────────────────────────────────────
function getWinnerId(match, teams) {
  if (!match || match.status !== 'played') return null;
  const ht = teams?.find(t => t.id === match.home_team_id);
  const at = teams?.find(t => t.id === match.away_team_id);
  if (ht?.disqualified && !at?.disqualified) return match.away_team_id;
  if (at?.disqualified && !ht?.disqualified) return match.home_team_id;
  if (match.home_score > match.away_score) return match.home_team_id;
  if (match.away_score > match.home_score) return match.away_team_id;
  const hp = match.home_penalties || 0, ap = match.away_penalties || 0;
  if (hp > ap) return match.home_team_id;
  if (ap > hp) return match.away_team_id;
  return null;
}

// ── Match card ────────────────────────────────────────────────────────────────
function MatchCard({ match, teams, isFinal }) {
  const isTbd = !match || match.home_team_id === 'tbd';
  const homeTeam = !isTbd ? teams.find(t => t.id === match.home_team_id) : null;
  const awayTeam = !isTbd ? teams.find(t => t.id === match.away_team_id) : null;
  const winnerId = match ? getWinnerId(match, teams) : null;
  const isPlayed = match?.status === 'played';
  const hasPens  = match?.home_penalties != null && match?.away_penalties != null;

  const cardClass = [
    'kb-card',
    isFinal ? 'kb-card--final' : '',
    isTbd   ? 'kb-card--tbd'   : '',
  ].filter(Boolean).join(' ');

  const inner = (
    <>
      {isFinal && <div className="kb-crown">🏆 GRAN FINAL</div>}

      {/* Home */}
      <div className={['kb-team', winnerId === match?.home_team_id ? 'kb-team--win' : '', winnerId && winnerId !== match?.home_team_id ? 'kb-team--loss' : ''].filter(Boolean).join(' ')}>
        <span className="kb-avatar">{homeTeam ? homeTeam.name.slice(0,2).toUpperCase() : '?'}</span>
        <span className="kb-name" style={{ textDecoration: homeTeam?.disqualified ? 'line-through' : 'none', color: homeTeam?.disqualified ? '#ef4444' : undefined }}>
          {homeTeam?.name ?? 'Por definir'}
        </span>
        {isPlayed && <span className={`kb-score ${winnerId === match.home_team_id ? 'kb-score--win' : ''}`}>{match.home_score}{hasPens && <sub className="kb-pens">({match.home_penalties})</sub>}</span>}
        {winnerId === match?.home_team_id && <span className="kb-tick">✓</span>}
      </div>

      <div className="kb-divider" />

      {/* Away */}
      <div className={['kb-team', winnerId === match?.away_team_id ? 'kb-team--win' : '', winnerId && winnerId !== match?.away_team_id ? 'kb-team--loss' : ''].filter(Boolean).join(' ')}>
        <span className="kb-avatar">{awayTeam ? awayTeam.name.slice(0,2).toUpperCase() : '?'}</span>
        <span className="kb-name" style={{ textDecoration: awayTeam?.disqualified ? 'line-through' : 'none', color: awayTeam?.disqualified ? '#ef4444' : undefined }}>
          {awayTeam?.name ?? 'Por definir'}
        </span>
        {isPlayed && <span className={`kb-score ${winnerId === match.away_team_id ? 'kb-score--win' : ''}`}>{match.away_score}{hasPens && <sub className="kb-pens">({match.away_penalties})</sub>}</span>}
        {winnerId === match?.away_team_id && <span className="kb-tick">✓</span>}
      </div>

      <div className="kb-footer">
        {isPlayed
          ? <span className="kb-status--played">Finalizado</span>
          : match?.date && match.date !== 'TBD'
            ? <span className="kb-status--sched">{match.date} · {match.time}</span>
            : <span className="kb-status--tbd">Por confirmar</span>}
        {!isTbd && <span className="kb-arrow">→</span>}
      </div>
    </>
  );

  if (isTbd || !match) return <div className={cardClass}>{inner}</div>;
  return <Link to={`/partido/${match.id}`} className={cardClass}>{inner}</Link>;
}

// ── Round column ──────────────────────────────────────────────────────────────
function RoundColumn({ round, matches, teams, slotFactor, isLast }) {
  const roundMatches = [...matches]
    .filter(m => m.round === round.key)
    .sort((a, b) => (a.match_order ?? 0) - (b.match_order ?? 0));

  const BASE_SLOT = CARD_H + CARD_GAP;
  const slotH = slotFactor * BASE_SLOT;
  const topOff = (slotH - CARD_H) / 2;
  // All rounds should have the same total height for the relative container
  const totalH = round.slots * slotH;

  return (
    <div className="kb-round">
      <div className="kb-round-head">
        <span className="kb-round-label">{round.label}</span>
        {roundMatches.length > 0 && (
          <span className="kb-round-cnt">{roundMatches.length} partido{roundMatches.length > 1 ? 's' : ''}</span>
        )}
      </div>

      <div style={{ position: 'relative', height: `${totalH}px` }}>
        {(() => {
          const slotMatches = Array(round.slots).fill(null);
          const unplaced = [];
          
          // First pass: place matches in their exact match_order slot
          roundMatches.forEach(m => {
            const target = m.match_order ?? 0;
            if (target >= 0 && target < round.slots && slotMatches[target] === null) {
              slotMatches[target] = m;
            } else {
              unplaced.push(m);
            }
          });
          
          // Second pass: fill remaining empty slots with unplaced matches
          unplaced.forEach(m => {
            const emptyIdx = slotMatches.findIndex(slot => slot === null);
            if (emptyIdx !== -1) {
              slotMatches[emptyIdx] = m;
            }
          });

          return slotMatches.map((match, i) => {
            const top   = i * slotH + topOff;
            const midY  = i * slotH + topOff + CARD_H / 2;

            // Draw connector between slot i and slot i+1 when they're a pair
            const isPairTop = !isLast && i % 2 === 0;
            const partnerTop = (i + 1) * slotH + topOff + CARD_H / 2;
            const midBridge  = (midY + partnerTop) / 2;

            return (
              <div key={i}>
                {/* Card */}
                <div style={{ position: 'absolute', top: `${top}px`, left: 0, right: 40 }}>
                  <MatchCard match={match} teams={teams} isFinal={round.key === 'final'} />
                </div>

                {/* Connectors */}
                {isPairTop && i + 1 < round.slots && (
                  <>
                    {/* Horizontal from this card */}
                    <div className="kb-conn-h" style={{ top: `${midY}px`, right: 20, width: 20 }} />
                    {/* Horizontal from partner card */}
                    <div className="kb-conn-h" style={{ top: `${partnerTop}px`, right: 20, width: 20 }} />
                    {/* Vertical bridge */}
                    <div className="kb-conn-v" style={{ top: `${midY}px`, right: 20, height: `${partnerTop - midY}px` }} />
                    {/* Horizontal to next column */}
                    <div className="kb-conn-h" style={{ top: `${midBridge}px`, right: 0, width: 21 }} />
                  </>
                )}
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function KnockoutBracket({ matches, teams }) {
  const presentKeys = new Set(matches.map(m => m.round).filter(Boolean));
  const roundsToShow = presentKeys.size > 0
    ? ALL_ROUNDS.filter(r => presentKeys.has(r.key))
    : ALL_ROUNDS;

  const rootSlots = roundsToShow[0]?.slots ?? 8;

  const finalMatch = matches.find(m => m.round === 'final');
  const championId = finalMatch ? getWinnerId(finalMatch, teams) : null;
  const champion   = championId ? teams.find(t => t.id === championId) : null;

  return (
    <div className="kb-wrap">
      {champion && (
        <div className="kb-champ">
          <span className="kb-champ-trophy">🏆</span>
          <div>
            <p className="kb-champ-label">Campeón del Torneo</p>
            <p className="kb-champ-name">{champion.name}</p>
          </div>
        </div>
      )}

      {!champion && matches.length > 0 && (
        <p className="kb-hint">Haz clic en un partido para ver sus detalles</p>
      )}

      <div className="kb-scroll">
        <div className="kb-inner">
          {roundsToShow.map((round, idx) => (
            <RoundColumn
              key={round.key}
              round={round}
              matches={matches}
              teams={teams}
              slotFactor={rootSlots / round.slots}
              isLast={idx === roundsToShow.length - 1}
            />
          ))}
        </div>
      </div>

      <style>{`
        .kb-wrap  { display:flex; flex-direction:column; gap:1.25rem; }

        /* Champion */
        .kb-champ { display:flex; align-items:center; gap:1rem; padding:1rem 1.5rem; background:linear-gradient(135deg,rgba(251,191,36,.14),rgba(245,158,11,.06)); border:1px solid rgba(251,191,36,.35); border-radius:var(--radius-md); animation:fadeIn .4s ease; }
        .kb-champ-trophy { font-size:2.2rem; line-height:1; }
        .kb-champ-label  { font-size:.7rem; font-weight:800; color:#fbbf24; text-transform:uppercase; letter-spacing:1px; margin:0 0 .1rem; }
        .kb-champ-name   { font-size:1.35rem; font-weight:900; color:var(--text-primary); font-family:'Outfit',sans-serif; letter-spacing:-.02em; margin:0; }

        .kb-hint { font-size:.78rem; color:var(--text-muted); margin:0; text-align:right; padding-right:.5rem; }

        /* Scroll */
        .kb-scroll { overflow-x:auto; padding-bottom:1.5rem; }
        .kb-inner  { display:flex; align-items:flex-start; gap:0; min-width:max-content; padding:.5rem 0; }

        /* Round column */
        .kb-round { display:flex; flex-direction:column; width:240px; flex-shrink:0; position:relative; }
        .kb-round-head { display:flex; align-items:center; justify-content:space-between; padding:.5rem .85rem; margin-bottom:.75rem; margin-right:40px; background:rgba(255,255,255,.04); border:1px solid var(--border-glass); border-radius:var(--radius-sm); }
        .kb-round-label { font-size:.75rem; font-weight:800; color:var(--text-primary); text-transform:uppercase; letter-spacing:.8px; }
        .kb-round-cnt   { font-size:.65rem; color:var(--text-muted); }

        /* Connectors */
        .kb-conn-h, .kb-conn-v { position:absolute; background:rgba(255,255,255,.18); }
        .kb-conn-h { height:1px; }
        .kb-conn-v { width:1px; }

        /* Card */
        .kb-card { display:flex; flex-direction:column; justify-content:center; width:200px; height:105px; border-radius:var(--radius-md); background:var(--bg-card); border:1px solid var(--border-glass); overflow:hidden; text-decoration:none; color:inherit; transition:border-color .2s,box-shadow .2s,transform .18s; cursor:pointer; }
        .kb-card:hover { border-color:rgba(99,102,241,.5); box-shadow:0 4px 24px rgba(99,102,241,.18); transform:translateY(-2px); }
        .kb-card--final { height:auto; min-height:105px; border-color:rgba(251,191,36,.35); box-shadow:0 0 22px rgba(251,191,36,.14); }
        .kb-card--final:hover { border-color:rgba(251,191,36,.7); box-shadow:0 4px 28px rgba(251,191,36,.24); }
        .kb-card--tbd   { opacity:.38; pointer-events:none; }

        .kb-crown { padding:.3rem .75rem; text-align:center; font-size:.62rem; font-weight:800; letter-spacing:1.2px; background:linear-gradient(90deg,rgba(251,191,36,.18),rgba(245,158,11,.08)); color:#fbbf24; border-bottom:1px solid rgba(251,191,36,.2); }

        /* Team rows */
        .kb-team { display:flex; align-items:center; gap:.45rem; padding:.48rem .65rem; transition:background .15s; }
        .kb-team--win  { background:rgba(52,211,153,.1); }
        .kb-team--loss { opacity:.35; }

        .kb-avatar { width:26px; height:26px; border-radius:50%; flex-shrink:0; background:var(--bg-darker); border:1px solid var(--border-glass); display:flex; align-items:center; justify-content:center; font-size:.56rem; font-weight:800; color:var(--text-secondary); }
        .kb-team--win .kb-avatar { border-color:rgba(52,211,153,.55); color:#34d399; }

        .kb-name { flex:1; min-width:0; font-size:.8rem; font-weight:700; color:var(--text-primary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        .kb-score { font-size:.95rem; font-weight:800; color:var(--text-muted); font-family:'Outfit',sans-serif; flex-shrink:0; }
        .kb-score--win { color:#34d399; }
        .kb-pens  { font-size:.58rem; color:#60a5fa; margin-left:.12rem; }
        .kb-tick  { font-size:.62rem; color:#34d399; flex-shrink:0; font-weight:800; }

        .kb-divider { height:1px; background:var(--border-glass); }

        .kb-footer { display:flex; align-items:center; justify-content:space-between; padding:.28rem .65rem; background:rgba(0,0,0,.2); border-top:1px solid var(--border-glass); font-size:.64rem; color:var(--text-muted); }
        .kb-status--played { color:#34d399; font-weight:700; }
        .kb-status--sched  { color:#fbbf24; }
        .kb-status--tbd    { font-style:italic; }
        .kb-arrow          { font-size:.7rem; }

        @media (max-width:600px) {
          .kb-round { width:185px; }
          .kb-card  { width:155px; }
          .kb-round-head { margin-right:28px; }
        }
      `}</style>
    </div>
  );
}

