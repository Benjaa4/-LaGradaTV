import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  ArrowLeft, Trophy, Calendar, Clock, MapPin, 
  Share2, Shield, Users, AlertTriangle, CheckCircle, 
  FileText, ExternalLink, Video, ChevronRight, Award
} from 'lucide-react';
import { getMatteTeamStyle } from '../utils/colorUtils';
import { getMatchLineup } from '../utils/lineupUtils';
import { parseVideoUrl } from '../utils/videoUtils';
import TacticalPitch from '../components/lineup/TacticalPitch';
import StackedCards from '../components/lineup/StackedCards';

export default function MatchView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { matches, tournaments, locations } = useAppContext();

  // Tab activo de vista táctica: 'home' | 'away' | 'both'
  const [activePitchView, setActivePitchView] = useState('home');
  // Tab de lista: 'starters' | 'subs' | 'discipline'
  const [activeRosterTab, setActiveRosterTab] = useState('starters');

  const match = matches.find(m => m.id === id);

  const tournament = tournaments.find(t => t.id === match?.tournament_id);
  const homeTeam = tournament?.standings?.find(s => s.id === match?.home_team_id) || { name: 'Equipo Local', id: match?.home_team_id };
  const awayTeam = tournament?.standings?.find(s => s.id === match?.away_team_id) || { name: 'Equipo Visitante', id: match?.away_team_id };
  const location = locations.find(l => l.id === match?.location_id);
  const isPlayed = match?.status === 'played';
  const embedUrl = match?.stream_url ? parseVideoUrl(match.stream_url).embedUrl : null;

  // Alineaciones y colores de equipo
  const homeStyle = useMemo(() => getMatteTeamStyle(homeTeam?.name || 'Local'), [homeTeam?.name]);
  const awayStyle = useMemo(() => getMatteTeamStyle(awayTeam?.name || 'Visitante'), [awayTeam?.name]);

  const homeLineup = useMemo(() => {
    return match && homeTeam ? getMatchLineup(match, homeTeam, true) : null;
  }, [match, homeTeam]);

  const awayLineup = useMemo(() => {
    return match && awayTeam ? getMatchLineup(match, awayTeam, false) : null;
  }, [match, awayTeam]);

  if (!match) {
    return (
      <div className="animate-fade-in" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h2 className="page-title">Partido no encontrado</h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>El encuentro solicitado no existe o fue eliminado.</p>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
    );
  }

  const handleShare = () => {
    const tourName = tournament?.name || 'Torneo';
    const hName = homeTeam?.name || 'Local';
    const aName = awayTeam?.name || 'Visitante';
    const url = window.location.href;
    const text = `*Alineaciones Tácticas*\n${hName} (${homeLineup?.formation || ''}) vs ${aName} (${awayLineup?.formation || ''})\n*Torneo:* ${tourName}\n\n*Ver alineaciones en La Grada TV:*\n${url}`;

    if (navigator.share) {
      navigator.share({ title: `Alineaciones: ${hName} vs ${aName}`, text, url }).catch(() => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // Recuento de tarjetas en el partido
  const allCards = [
    ...(homeLineup?.starting || []).map(p => ({ ...p, team: homeTeam.name, teamType: 'home' })),
    ...(homeLineup?.substitutes || []).map(p => ({ ...p, team: homeTeam.name, teamType: 'home' })),
    ...(awayLineup?.starting || []).map(p => ({ ...p, team: awayTeam.name, teamType: 'away' })),
    ...(awayLineup?.substitutes || []).map(p => ({ ...p, team: awayTeam.name, teamType: 'away' })),
  ].filter(p => p.yellowCards > 0 || p.redCards > 0 || p.priorYellowCount >= 4);

  return (
    <div className="match-lineups-page animate-fade-in">
      {/* ── Barra Superior de Navegación ── */}
      <div className="lineups-top-bar">
        <button 
          type="button" 
          onClick={() => navigate(-1)} 
          className="btn btn-glass"
          style={{ padding: '0.45rem 0.9rem', gap: '0.4rem', fontSize: '0.82rem' }}
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="lineups-meta-chips">
          {tournament?.name && (
            <span className="meta-chip">
              <Trophy size={13} color="var(--gold-light)" /> {tournament.name}
            </span>
          )}
          {match.round && (
            <span className="meta-chip meta-chip-round">
              {match.round === 'final' ? 'Gran Final' : match.round === 'semifinal' ? 'Semifinal' : match.round === 'quarterfinal' ? 'Cuartos' : match.round}
            </span>
          )}
        </div>

        <button 
          type="button" 
          onClick={handleShare} 
          className="btn btn-glass"
          style={{ padding: '0.45rem 0.85rem' }}
          title="Compartir alineaciones"
        >
          <Share2 size={16} color="var(--teal-light)" />
        </button>
      </div>

      {/* ── Marcador / Header del Encuentro ── */}
      <div className="lineups-scoreboard-card glass-panel">
        <div className="scoreboard-layout">
          {/* Equipo Local */}
          <div className="scoreboard-team-box home-box">
            <div 
              className="scoreboard-team-avatar"
              style={{ background: homeStyle.bg, borderColor: homeStyle.border, color: homeStyle.color }}
            >
              {homeTeam.name?.slice(0, 2).toUpperCase() || 'L'}
            </div>
            <div className="scoreboard-team-info home-info">
              <h3 className="scoreboard-team-name">{homeTeam.name}</h3>
              {homeLineup?.formation && (
                <span className="formation-badge" style={{ borderColor: homeStyle.border, color: homeStyle.color }}>
                  {homeLineup.formation}
                </span>
              )}
            </div>
          </div>

          {/* Resultado o Horario */}
          <div className="scoreboard-center-box">
            {isPlayed ? (
              <div className="scoreboard-score-wrap">
                <span className="scoreboard-score-val">{match.home_score}</span>
                <span className="scoreboard-score-sep">-</span>
                <span className="scoreboard-score-val">{match.away_score}</span>
              </div>
            ) : (
              <div className="scoreboard-vs-badge">VS</div>
            )}

            {match.home_penalties != null && match.away_penalties != null && (
              <span className="scoreboard-pens-val">
                ({match.home_penalties} - {match.away_penalties} pen.)
              </span>
            )}

            <span className={`scoreboard-status-chip ${isPlayed ? 'status-played' : 'status-scheduled'}`}>
              {isPlayed ? 'FINALIZADO' : 'PROGRAMADO'}
            </span>
          </div>

          {/* Equipo Visitante */}
          <div className="scoreboard-team-box away-box">
            <div className="scoreboard-team-info away-info">
              <h3 className="scoreboard-team-name">{awayTeam.name}</h3>
              {awayLineup?.formation && (
                <span className="formation-badge" style={{ borderColor: awayStyle.border, color: awayStyle.color }}>
                  {awayLineup.formation}
                </span>
              )}
            </div>
            <div 
              className="scoreboard-team-avatar"
              style={{ background: awayStyle.bg, borderColor: awayStyle.border, color: awayStyle.color }}
            >
              {awayTeam.name?.slice(0, 2).toUpperCase() || 'V'}
            </div>
          </div>
        </div>

        {/* Cancha y Horario */}
        <div className="scoreboard-footer-meta">
          <span><Calendar size={13} color="var(--blue-light)" /> {match.date || 'A confirmar'}</span>
          <span><Clock size={13} color="var(--amber-light)" /> {match.time || 'A confirmar'}</span>
          {location?.name && (
            <span>
              <MapPin size={13} color="var(--emerald-light)" /> {location.name}
              {location.map_url && (
                <a href={location.map_url} target="_blank" rel="noreferrer" className="loc-map-btn" onClick={e => e.stopPropagation()}>
                  <ExternalLink size={10} />
                </a>
              )}
            </span>
          )}
        </div>

        {/* Resumen / Descripción si existe */}
        {match.description && (
          <div className="scoreboard-desc-callout">
            <FileText size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              {match.description}
            </p>
          </div>
        )}
      </div>

      {/* ── Transmisión de Video si existe ── */}
      {embedUrl && (
        <div className="glass-panel" style={{ padding: '1rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.9rem', color: '#fb7185' }}>
            <Video size={16} />
            <span>Transmisión en Video</span>
          </div>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000000' }}>
            <iframe 
              src={embedUrl}
              title="Transmisión del Partido"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>
      )}

      {/* ── Selector de Vista Táctica de Cancha ── */}
      <div className="pitch-view-tabs">
        <button
          type="button"
          className={`pitch-tab-btn ${activePitchView === 'home' ? 'active' : ''}`}
          onClick={() => setActivePitchView('home')}
        >
          <span className="team-dot" style={{ background: homeStyle.border }} />
          <span>{homeTeam.name}</span>
          <span className="formation-tag">{homeLineup?.formation || '4-3-3'}</span>
        </button>

        <button
          type="button"
          className={`pitch-tab-btn ${activePitchView === 'away' ? 'active' : ''}`}
          onClick={() => setActivePitchView('away')}
        >
          <span className="team-dot" style={{ background: awayStyle.border }} />
          <span>{awayTeam.name}</span>
          <span className="formation-tag">{awayLineup?.formation || '4-4-2'}</span>
        </button>

        <button
          type="button"
          className={`pitch-tab-btn pitch-tab-both ${activePitchView === 'both' ? 'active' : ''}`}
          onClick={() => setActivePitchView('both')}
        >
          <Users size={14} />
          <span>Ambos en Cancha</span>
        </button>
      </div>

      {/* ── Cancha Táctica Interactiva ── */}
      <div className="pitch-section-container">
        <div className="pitch-header-legend">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Haz clic o toca a cualquier jugador para ver su ficha y sanciones
          </span>
          <div className="legend-cards-guide">
            <span className="legend-item"><span className="legend-card y-card" /> Amarilla</span>
            <span className="legend-item"><span className="legend-card r-card" /> Roja</span>
            <span className="legend-item"><span className="legend-stacked-demo"><span className="demo-y" /><span className="demo-r" /></span> Superpuestas</span>
          </div>
        </div>

        <TacticalPitch 
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeLineup={homeLineup}
          awayLineup={awayLineup}
          activeView={activePitchView}
          homeColor={homeStyle}
          awayColor={awayStyle}
        />
      </div>

      {/* ── Fichas de Plantel y Suplentes ── */}
      <div className="roster-section-wrap">
        <div className="roster-tabs-header">
          <div className="roster-switch">
            <button
              type="button"
              className={`roster-tab-btn ${activeRosterTab === 'starters' ? 'active' : ''}`}
              onClick={() => setActiveRosterTab('starters')}
            >
              Titulares (11)
            </button>
            <button
              type="button"
              className={`roster-tab-btn ${activeRosterTab === 'subs' ? 'active' : ''}`}
              onClick={() => setActiveRosterTab('subs')}
            >
              Suplentes en Banca
            </button>
            <button
              type="button"
              className={`roster-tab-btn ${activeRosterTab === 'discipline' ? 'active' : ''}`}
              onClick={() => setActiveRosterTab('discipline')}
            >
              Sanciones & Tarjetas ({allCards.length})
            </button>
          </div>
        </div>

        {/* 1. Titulares List */}
        {activeRosterTab === 'starters' && (
          <div className="roster-dual-grid animate-fade-in">
            {/* Columna Local */}
            <div className="roster-team-col glass-panel">
              <div className="roster-col-title">
                <span className="team-dot" style={{ background: homeStyle.border }} />
                <h4>{homeTeam.name}</h4>
                <span className="formation-label">{homeLineup?.formationName}</span>
              </div>
              <div className="roster-players-list">
                {homeLineup?.starting.map(p => (
                  <div key={p.id} className="roster-row">
                    <span className="roster-num" style={{ background: homeStyle.border }}>{p.number}</span>
                    <div className="roster-info">
                      <span className="roster-name">
                        {p.fullName || p.name}
                        {p.isCaptain && <span className="roster-c-badge">C</span>}
                      </span>
                      <span className="roster-role">{p.role}</span>
                    </div>
                    <div className="roster-cards">
                      <StackedCards 
                        yellowCards={p.yellowCards} 
                        redCards={p.redCards} 
                        priorYellowCount={p.priorYellowCount} 
                        size="md" 
                      />
                    </div>
                  </div>
                ))}
              </div>
              {homeLineup?.coach && (
                <div className="roster-dt-row">
                  <Award size={14} color="var(--amber-light)" />
                  <span>{homeLineup.coach}</span>
                </div>
              )}
            </div>

            {/* Columna Visitante */}
            <div className="roster-team-col glass-panel">
              <div className="roster-col-title">
                <span className="team-dot" style={{ background: awayStyle.border }} />
                <h4>{awayTeam.name}</h4>
                <span className="formation-label">{awayLineup?.formationName}</span>
              </div>
              <div className="roster-players-list">
                {awayLineup?.starting.map(p => (
                  <div key={p.id} className="roster-row">
                    <span className="roster-num" style={{ background: awayStyle.border }}>{p.number}</span>
                    <div className="roster-info">
                      <span className="roster-name">
                        {p.fullName || p.name}
                        {p.isCaptain && <span className="roster-c-badge">C</span>}
                      </span>
                      <span className="roster-role">{p.role}</span>
                    </div>
                    <div className="roster-cards">
                      <StackedCards 
                        yellowCards={p.yellowCards} 
                        redCards={p.redCards} 
                        priorYellowCount={p.priorYellowCount} 
                        size="md" 
                      />
                    </div>
                  </div>
                ))}
              </div>
              {awayLineup?.coach && (
                <div className="roster-dt-row">
                  <Award size={14} color="var(--amber-light)" />
                  <span>{awayLineup.coach}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Suplentes List */}
        {activeRosterTab === 'subs' && (
          <div className="roster-dual-grid animate-fade-in">
            {/* Suplentes Local */}
            <div className="roster-team-col glass-panel">
              <div className="roster-col-title">
                <span className="team-dot" style={{ background: homeStyle.border }} />
                <h4>Banca: {homeTeam.name}</h4>
                <span className="sub-count">{homeLineup?.substitutes.length} suplentes</span>
              </div>
              <div className="roster-players-list">
                {homeLineup?.substitutes.map(p => (
                  <div key={p.id} className="roster-row">
                    <span className="roster-num roster-num-sub">{p.number}</span>
                    <div className="roster-info">
                      <span className="roster-name">{p.fullName || p.name}</span>
                      <span className="roster-role">{p.role}</span>
                    </div>
                    <div className="roster-cards">
                      <StackedCards 
                        yellowCards={p.yellowCards} 
                        redCards={p.redCards} 
                        priorYellowCount={p.priorYellowCount} 
                        size="md" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suplentes Visitante */}
            <div className="roster-team-col glass-panel">
              <div className="roster-col-title">
                <span className="team-dot" style={{ background: awayStyle.border }} />
                <h4>Banca: {awayTeam.name}</h4>
                <span className="sub-count">{awayLineup?.substitutes.length} suplentes</span>
              </div>
              <div className="roster-players-list">
                {awayLineup?.substitutes.map(p => (
                  <div key={p.id} className="roster-row">
                    <span className="roster-num roster-num-sub">{p.number}</span>
                    <div className="roster-info">
                      <span className="roster-name">{p.fullName || p.name}</span>
                      <span className="roster-role">{p.role}</span>
                    </div>
                    <div className="roster-cards">
                      <StackedCards 
                        yellowCards={p.yellowCards} 
                        redCards={p.redCards} 
                        priorYellowCount={p.priorYellowCount} 
                        size="md" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Panel Disciplinario & Sanciones */}
        {activeRosterTab === 'discipline' && (
          <div className="discipline-panel glass-panel animate-fade-in">
            <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="var(--amber-light)" />
              Informe de Sanciones y Amonestaciones del Partido
            </h4>

            {allCards.length > 0 ? (
              <div className="discipline-cards-grid">
                {allCards.map((p, i) => (
                  <div key={i} className="discipline-item-card">
                    <div className="disc-team-indicator">
                      <span 
                        className="team-dot" 
                        style={{ background: p.teamType === 'home' ? homeStyle.border : awayStyle.border }} 
                      />
                      <span className="disc-team-label">{p.team}</span>
                    </div>

                    <div className="disc-player-info">
                      <span className="disc-num">#{p.number}</span>
                      <div>
                        <p className="disc-name">{p.fullName || p.name}</p>
                        <p className="disc-pos">{p.role}</p>
                      </div>
                    </div>

                    <div className="disc-cards-display">
                      <StackedCards 
                        yellowCards={p.yellowCards} 
                        redCards={p.redCards} 
                        priorYellowCount={p.priorYellowCount} 
                        size="md" 
                      />
                      <span className="disc-status-text">
                        {p.redCards > 0 
                          ? 'Expulsión' 
                          : p.yellowCards > 0 
                            ? `${p.yellowCards} Amarilla${p.yellowCards > 1 ? 's' : ''}` 
                            : 'Acumulación previa'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={32} color="#34d399" style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontWeight: 700, margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>Juego Limpio</p>
                <p style={{ fontSize: '0.84rem', margin: 0 }}>No se registraron amonestaciones ni sanciones en este partido.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Estilos de la página de Alineaciones ── */}
      <style>{`
        .match-lineups-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 0.5rem 0 3rem 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .lineups-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .lineups-meta-chips {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .meta-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          background: var(--bg-card);
          border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-raised-sm);
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .meta-chip-round {
          background: rgba(225, 95, 65, 0.14);
          border-color: rgba(225, 95, 65, 0.32);
          color: #f87171;
        }

        /* Scoreboard Card */
        .lineups-scoreboard-card {
          padding: 1.5rem 1.75rem;
          border-radius: var(--radius-xl);
          background: var(--bg-card);
          border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-raised);
        }

        .scoreboard-layout {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.25rem;
        }

        .scoreboard-team-box {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .scoreboard-team-box.away-box {
          justify-content: flex-end;
          text-align: right;
        }

        .scoreboard-team-avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 900;
          box-shadow: var(--nm-shadow-raised-sm);
          flex-shrink: 0;
        }

        .scoreboard-team-name {
          margin: 0 0 0.3rem 0;
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .formation-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          border: 1px solid;
          background: var(--bg-sunken);
        }

        .scoreboard-center-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
        }

        .scoreboard-score-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 2.4rem;
          font-weight: 900;
          color: var(--text-primary);
          font-family: 'Nunito', sans-serif;
          line-height: 1;
        }
        .scoreboard-score-sep {
          color: var(--text-muted);
          font-weight: 300;
        }
        .scoreboard-vs-badge {
          font-size: 1.2rem;
          font-weight: 900;
          color: var(--text-muted);
          letter-spacing: 1px;
        }
        .scoreboard-pens-val {
          font-size: 0.8rem;
          font-weight: 700;
          color: #60a5fa;
        }
        .scoreboard-status-chip {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.7px;
          padding: 0.2rem 0.65rem;
          border-radius: var(--radius-full);
        }
        .status-played {
          background: rgba(46, 157, 116, 0.2);
          color: #6ee7b7;
          border: 1px solid rgba(46, 157, 116, 0.4);
        }
        .status-scheduled {
          background: rgba(59, 130, 246, 0.15);
          color: #93c5fd;
          border: 1px solid rgba(59, 130, 246, 0.35);
        }

        .scoreboard-footer-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--nm-border);
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
          flex-wrap: wrap;
        }
        .loc-map-btn {
          margin-left: 0.3rem;
          color: var(--teal-light);
          display: inline-flex;
          align-items: center;
        }

        .scoreboard-desc-callout {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          background: var(--bg-sunken);
          border: 1px solid var(--nm-border);
          border-radius: var(--radius-md);
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
        }

        /* Pitch View Selector Tabs */
        .pitch-view-tabs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .pitch-view-tabs::-webkit-scrollbar { display: none; }

        .pitch-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1.15rem;
          border-radius: var(--radius-full);
          background: var(--bg-card);
          border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-raised-sm);
          color: var(--text-secondary);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s ease;
          -webkit-tap-highlight-color: transparent !important;
        }
        .pitch-tab-btn:hover {
          color: var(--text-primary);
        }
        .pitch-tab-btn.active {
          background: var(--bg-sunken);
          box-shadow: var(--nm-shadow-inset-sm);
          color: var(--text-primary);
          border-color: var(--primary);
        }
        .pitch-tab-both.active {
          border-color: var(--teal-light);
        }
        .formation-tag {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.1rem 0.45rem;
          border-radius: var(--radius-full);
          background: var(--bg-sunken);
          color: var(--text-muted);
        }
        .team-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        /* Pitch Section Container */
        .pitch-section-container {
          background: var(--bg-card);
          padding: 1.25rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-raised);
        }
        .pitch-header-legend {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .legend-cards-guide {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          font-size: 0.72rem;
          color: var(--text-secondary);
          font-weight: 600;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .legend-card {
          display: inline-block;
          width: 9px;
          height: 12px;
          border-radius: 2px;
        }
        .legend-card.y-card { background: #facc15; }
        .legend-card.r-card { background: #ef4444; }
        .legend-stacked-demo {
          position: relative;
          width: 14px;
          height: 12px;
          display: inline-block;
        }
        .demo-y {
          position: absolute;
          left: 0;
          top: 0;
          width: 8px;
          height: 12px;
          background: #facc15;
          border-radius: 2px;
          transform: rotate(-10deg);
        }
        .demo-r {
          position: absolute;
          left: 4px;
          top: 0;
          width: 8px;
          height: 12px;
          background: #ef4444;
          border-radius: 2px;
          transform: rotate(8deg);
        }

        /* Rosters and Substitutes */
        .roster-section-wrap {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .roster-tabs-header {
          display: flex;
          justify-content: center;
        }
        .roster-switch {
          display: inline-flex;
          background: var(--bg-sunken);
          border: 1px solid var(--nm-border);
          border-radius: var(--radius-full);
          padding: 0.25rem;
          gap: 0.25rem;
          box-shadow: var(--nm-shadow-inset-sm);
        }
        .roster-tab-btn {
          padding: 0.45rem 1rem;
          border-radius: var(--radius-full);
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.16s ease;
        }
        .roster-tab-btn:hover {
          color: var(--text-primary);
        }
        .roster-tab-btn.active {
          background: var(--bg-card);
          color: var(--text-primary);
          box-shadow: var(--nm-shadow-raised-sm);
        }

        .roster-dual-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .roster-team-col {
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          background: var(--bg-card);
          border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-raised);
          display: flex;
          flex-direction: column;
        }
        .roster-col-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--nm-border);
        }
        .roster-col-title h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          flex: 1;
        }
        .formation-label, .sub-count {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .roster-players-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .roster-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.45rem 0.65rem;
          border-radius: var(--radius-sm);
          background: var(--bg-sunken);
          border: 1px solid transparent;
          transition: all 0.15s ease;
        }
        .roster-row:hover {
          border-color: var(--nm-border);
          background: rgba(255, 255, 255, 0.03);
        }
        .roster-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .roster-num-sub {
          background: var(--bg-card);
          border: 1px solid var(--nm-border);
          color: var(--text-secondary);
        }
        .roster-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .roster-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .roster-c-badge {
          background: #fbbf24;
          color: #000000;
          font-size: 0.55rem;
          font-weight: 900;
          padding: 1px 3px;
          border-radius: 2px;
          line-height: 1;
        }
        .roster-role {
          font-size: 0.68rem;
          color: var(--text-muted);
        }
        .roster-dt-row {
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--nm-border);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        /* Discipline Panel */
        .discipline-panel {
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-lg);
          background: var(--bg-card);
          border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-raised);
        }
        .discipline-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 0.75rem;
        }
        .discipline-item-card {
          padding: 0.75rem 1rem;
          background: var(--bg-sunken);
          border: 1px solid var(--nm-border);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .disc-team-indicator {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .disc-team-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .disc-player-info {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .disc-num {
          font-size: 0.95rem;
          font-weight: 900;
          color: var(--text-primary);
          font-family: 'Nunito', sans-serif;
        }
        .disc-name {
          margin: 0;
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .disc-pos {
          margin: 0;
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .disc-cards-display {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding-top: 0.4rem;
          border-top: 1px dashed rgba(255,255,255,0.08);
        }
        .disc-status-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        @media (max-width: 720px) {
          .scoreboard-layout {
            grid-template-columns: 1fr;
            gap: 1rem;
            text-align: center;
          }
          .scoreboard-team-box {
            justify-content: center !important;
          }
          .scoreboard-team-box.away-box {
            flex-direction: row-reverse;
          }
          .roster-dual-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
