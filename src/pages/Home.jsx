import { useAppContext } from '../context/AppContext';
import TournamentCard from '../components/TournamentCard';
import VideoPlayer from '../components/VideoPlayer';
import MatchCard from '../components/MatchCard';
import KnockoutBracket from '../components/KnockoutBracket';
import { 
  Trophy, PlayCircle, Radio, Calendar, Zap, MapPin, 
  ChevronRight, ChevronLeft, Users, Tv, Star, Swords, 
  Clock, Inbox, Video, FileText, Share2, ExternalLink, Check
} from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMatteTeamStyle } from '../utils/colorUtils';

/* ── Helper: Form calculation (last 3 matches: W/D/L) ────────────── */
function getTeamForm(teamId, allMatches) {
  if (!teamId || !allMatches) return [];
  return allMatches
    .filter(m => m.status === 'played' && (m.home_team_id === teamId || m.away_team_id === teamId))
    .sort((a, b) => new Date(`${b.date}T${b.time || '00:00'}`) - new Date(`${a.date}T${a.time || '00:00'}`))
    .slice(0, 3)
    .map(m => {
      const isHome = m.home_team_id === teamId;
      const tScore = isHome ? m.home_score : m.away_score;
      const oScore = isHome ? m.away_score : m.home_score;
      if (tScore > oScore) return 'W';
      if (tScore < oScore) return 'L';
      return 'D';
    });
}

/* ── Section header with thematic matte colors ─────────────────── */
function SectionHeader({ 
  icon, 
  label, 
  sub, 
  href, 
  id, 
  color = 'var(--primary-light)', 
  bg = 'rgba(79, 109, 245, 0.14)', 
  border = 'rgba(79, 109, 245, 0.35)' 
}) {
  return (
    <div className="sec-header" id={id}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <div className="sec-icon-box" style={{ background: bg, borderColor: border, color: color }}>
            {icon}
          </div>
          <h2 className="section-title" style={{ margin: 0 }}>{label}</h2>
          {href && (
            <Link to={href} className="see-all-link" style={{ color: color }}>
              Ver todo <ChevronRight size={14} />
            </Link>
          )}
        </div>
        {sub && <p className="sec-sub">{sub}</p>}
      </div>
      <div className="sec-line" style={{ background: `linear-gradient(90deg, ${border} 0%, transparent 65%)` }} />
    </div>
  );
}

function EmptyState({ icon: Icon = Inbox, title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrap"><Icon size={28} /></div>
      {title && <p className="empty-title">{title}</p>}
      <p className="empty-text">{text}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const { tournaments, videos, albums, matches, locations, openSearchModal, openMatchModal, favorites } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [tourFormatFilter, setTourFormatFilter] = useState('all'); // 'all' | 'league' | 'knockout'
  const tickerRailRef = useRef(null);
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { setMounted(true); }, []);

  // Set default tournament for mini-standings/bracket
  useEffect(() => {
    if (!selectedTourId && tournaments.length > 0) {
      setSelectedTourId(tournaments[0].id);
    }
  }, [tournaments, selectedTourId]);

  // Derived match & video data
  const liveVideos      = videos.filter(v => v.type === 'live');
  const topAlbums       = albums.slice(0, 8);
  const leagueCount     = tournaments.filter(t => t.type !== 'knockout').length;
  const knockoutCount   = tournaments.filter(t => t.type === 'knockout').length;
  const filteredFeaturedTours = tournaments
    .filter(t => {
      if (tourFormatFilter === 'league') return t.type !== 'knockout';
      if (tourFormatFilter === 'knockout') return t.type === 'knockout';
      return true;
    })
    .slice(0, 6);
  const featuredTours   = tournaments.slice(0, 6);
  const todayMatches    = matches.filter(m => m.date === today);
  const upcomingMatches = matches
    .filter(m => m.date >= today && m.status !== 'played')
    .sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`))
    .slice(0, 8);
  const locationRanking = locations
    .map(loc => ({ ...loc, count: matches.filter(m => m.location_id === loc.id).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Ticker matches (today or upcoming or recent played)
  const tickerMatches = todayMatches.length > 0 
    ? todayMatches 
    : (upcomingMatches.length > 0 ? upcomingMatches : matches.slice(0, 6));

  // 1. MATCH CENTER: Find the top featured match
  const featuredMatch = (() => {
    if (!matches || matches.length === 0) return null;
    // Priority 1: Match today
    const todayMatch = matches.find(m => m.date === today);
    if (todayMatch) return todayMatch;

    // Priority 2: Upcoming Final or Semifinal
    const upcoming = matches
      .filter(m => m.date >= today && m.status !== 'played')
      .sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`));
    const finalUpcoming = upcoming.find(m => m.round === 'final');
    if (finalUpcoming) return finalUpcoming;
    if (upcoming.length > 0) return upcoming[0];

    // Priority 3: Most recently played match (especially if final)
    const played = matches
      .filter(m => m.status === 'played')
      .sort((a, b) => new Date(`${b.date}T${b.time || '00:00'}`) - new Date(`${a.date}T${a.time || '00:00'}`));
    const playedFinal = played.find(m => m.round === 'final');
    return playedFinal || played[0] || null;
  })();

  const featTournament = featuredMatch ? tournaments.find(t => t.id === featuredMatch.tournament_id) : null;
  const featHomeTeam   = featTournament?.standings?.find(s => s.id === featuredMatch?.home_team_id);
  const featAwayTeam   = featTournament?.standings?.find(s => s.id === featuredMatch?.away_team_id);
  const featLocation   = featuredMatch ? locations.find(l => l.id === featuredMatch.location_id) : null;
  const featIsPlayed   = featuredMatch?.status === 'played';
  const featIsFinal    = featuredMatch?.round === 'final';
  const featHomeForm   = featHomeTeam ? getTeamForm(featHomeTeam.id, matches) : [];
  const featAwayForm   = featAwayTeam ? getTeamForm(featAwayTeam.id, matches) : [];

  const featHomeStyle  = getMatteTeamStyle(featHomeTeam?.name);
  const featAwayStyle  = getMatteTeamStyle(featAwayTeam?.name);

  const handleShareFeatured = (e) => {
    e.stopPropagation();
    if (!featuredMatch) return;
    const tourName = featTournament?.name || 'Torneo';
    const hName = featHomeTeam?.name || 'Por definir';
    const aName = featAwayTeam?.name || 'Por definir';
    const matchUrl = `${window.location.origin}/partido/${featuredMatch.id}`;
    const text = `*${tourName}*\n*${hName}* vs *${aName}*\n*Fecha:* ${featuredMatch.date || 'A confirmar'} - ${featuredMatch.time || 'A confirmar'}\n\n*Seguilo en La Grada TV:*\n${matchUrl}`;

    if (navigator.share) {
      navigator.share({ title: `${hName} vs ${aName} - La Grada TV`, text, url: matchUrl }).catch(() => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // 4. MINI-STANDINGS & BRACKETS: Active tournament selection
  const activeStandingsTour = tournaments.find(t => t.id === selectedTourId) || tournaments[0];
  const isKnockoutActive = activeStandingsTour?.type === 'knockout';
  const activeTourMatches = matches.filter(m => m.tournament_id === activeStandingsTour?.id);
  const sortedStandings = (activeStandingsTour?.standings || [])
    .slice()
    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0) || ((b.goalsFor ?? 0) - (b.goalsAgainst ?? 0)) - ((a.goalsFor ?? 0) - (a.goalsAgainst ?? 0)))
    .slice(0, 5);

  const scrollTicker = (direction) => {
    if (tickerRailRef.current) {
      tickerRailRef.current.scrollBy({ left: direction * 280, behavior: 'smooth' });
    }
  };

  return (
    <div className={`home-page ${mounted ? 'home-mounted' : ''}`}>

      {/* ══════ 1. HORIZONTAL MATCH TICKER (SUGERENCIA 2) ══════ */}
      {tickerMatches.length > 0 && (
        <section className="scores-ticker-wrap animate-fade-in">
          <div className="ticker-top-bar">
            <div className="ticker-badge">
              <span className="ticker-live-dot" />
              <Zap size={13} color="var(--amber-light)" />
              <span>{todayMatches.length > 0 ? 'PARTIDOS DE HOY' : 'MARCADOR EN VIVO & FIXTURE'}</span>
            </div>
            <div className="ticker-controls">
              <button 
                type="button" 
                className="ticker-nav-btn" 
                onClick={() => scrollTicker(-1)}
                aria-label="Desplazar a la izquierda"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                type="button" 
                className="ticker-nav-btn" 
                onClick={() => scrollTicker(1)}
                aria-label="Desplazar a la derecha"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="scores-ticker-rail" ref={tickerRailRef}>
            {tickerMatches.map(m => {
              const tour = tournaments.find(t => t.id === m.tournament_id);
              const ht = tour?.standings?.find(s => s.id === m.home_team_id);
              const at = tour?.standings?.find(s => s.id === m.away_team_id);
              const isPlayed = m.status === 'played';
              const isFinalRound = m.round === 'final';
              const htStyle = getMatteTeamStyle(ht?.name);
              const atStyle = getMatteTeamStyle(at?.name);

              return (
                <div 
                  key={m.id} 
                  className={`ticker-match-card ${isFinalRound ? 'ticker-card-final gold-glow' : ''}`}
                  onClick={() => openMatchModal(m)}
                >
                  <div className="ticker-card-top">
                    <span className="ticker-tour-name">
                      <Trophy size={11} color={isFinalRound ? 'var(--gold-light)' : 'var(--primary-light)'} />
                      {tour?.name || 'Torneo'}
                    </span>
                    <span className={`ticker-status-tag ${isPlayed ? 'tag-played' : (m.date === today ? 'tag-today' : 'tag-sched')}`}>
                      {isPlayed ? 'FINAL' : (m.date === today ? `HOY ${m.time}` : `${m.date}`)}
                    </span>
                  </div>

                  <div className="ticker-teams-row">
                    <div className="ticker-team-item">
                      <span 
                        className="ticker-team-avatar"
                        style={{ background: htStyle.bg, borderColor: htStyle.border, color: htStyle.color }}
                      >
                        {ht?.name ? ht.name.slice(0, 2).toUpperCase() : '?'}
                      </span>
                      <span className="ticker-team-title" title={ht?.name}>{ht?.name || 'Local'}</span>
                    </div>
                    
                    <div className="ticker-score-bubble">
                      {isPlayed ? `${m.home_score} - ${m.away_score}` : 'VS'}
                    </div>

                    <div className="ticker-team-item ticker-team-right">
                      <span className="ticker-team-title" title={at?.name}>{at?.name || 'Visitante'}</span>
                      <span 
                        className="ticker-team-avatar"
                        style={{ background: atStyle.bg, borderColor: atStyle.border, color: atStyle.color }}
                      >
                        {at?.name ? at.name.slice(0, 2).toUpperCase() : '?'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ══════ 2. MATCH CENTER: PARTIDO DESTACADO (SUGERENCIA 1) ══════ */}
      {featuredMatch && (
        <section className="featured-match-section animate-slide-up">
          <div className={`featured-match-card ${featIsFinal ? 'feat-card-final' : ''}`}>
            
            {/* Top Tagline */}
            <div className="feat-header">
              <div className="feat-badges">
                {featIsFinal ? (
                  <span className="feat-pill feat-pill-final gold-badge">
                    <Trophy size={13} className="gold-text" /> GRAN FINAL
                  </span>
                ) : featuredMatch.date === today ? (
                  <span className="feat-pill feat-pill-live">
                    <Radio size={13} /> PARTIDO DE HOY
                  </span>
                ) : (
                  <span className="feat-pill feat-pill-highlight">
                    <Zap size={13} /> PARTIDO DESTACADO
                  </span>
                )}

                {featTournament && (
                  <span className="feat-tour-pill">
                    <Trophy size={12} color="var(--primary-light)" /> {featTournament.name}
                  </span>
                )}
              </div>

              {featLocation && (
                <div className="feat-location-pill">
                  <MapPin size={12} color="var(--emerald-light)" />
                  <span>{featLocation.name}</span>
                </div>
              )}
            </div>

            {/* Duel Presentation */}
            <div className="feat-duel" onClick={() => openMatchModal(featuredMatch)}>
              
              {/* Home Team */}
              <div className="feat-team feat-team-home">
                <div 
                  className="feat-avatar"
                  style={{ background: featHomeStyle.bg, borderColor: featHomeStyle.border, color: featHomeStyle.color }}
                >
                  {featHomeTeam?.name ? featHomeTeam.name.slice(0, 2).toUpperCase() : '?'}
                </div>
                <div className="feat-team-meta">
                  <h3 className="feat-team-name">{featHomeTeam?.name || 'Por definir'}</h3>
                  {featHomeForm.length > 0 && (
                    <div className="feat-form-row">
                      <span className="feat-form-label">Forma:</span>
                      {featHomeForm.map((f, i) => (
                        <span key={i} className={`form-dot form-dot-${f}`}>
                          {f === 'W' ? 'G' : f === 'D' ? 'E' : 'P'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Center Match Status / Score */}
              <div className="feat-center">
                {featIsPlayed ? (
                  <div className="feat-score-box">
                    <div className="feat-score-numbers">
                      <span>{featuredMatch.home_score}</span>
                      <span className="feat-score-sep">-</span>
                      <span>{featuredMatch.away_score}</span>
                    </div>
                    <span className="feat-status-badge badge-played">FINALIZADO</span>
                  </div>
                ) : (
                  <div className="feat-timing-box">
                    <div className="feat-time">{featuredMatch.time || 'A confirmar'}</div>
                    <div className="feat-date">
                      <Calendar size={12} color="var(--blue-light)" />
                      <span>{featuredMatch.date === today ? 'HOY' : featuredMatch.date}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="feat-team feat-team-away">
                <div 
                  className="feat-avatar"
                  style={{ background: featAwayStyle.bg, borderColor: featAwayStyle.border, color: featAwayStyle.color }}
                >
                  {featAwayTeam?.name ? featAwayTeam.name.slice(0, 2).toUpperCase() : '?'}
                </div>
                <div className="feat-team-meta">
                  <h3 className="feat-team-name">{featAwayTeam?.name || 'Por definir'}</h3>
                  {featAwayForm.length > 0 && (
                    <div className="feat-form-row">
                      <span className="feat-form-label">Forma:</span>
                      {featAwayForm.map((f, i) => (
                        <span key={i} className={`form-dot form-dot-${f}`}>
                          {f === 'W' ? 'G' : f === 'D' ? 'E' : 'P'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="feat-footer">
              <button 
                type="button" 
                className="btn btn-primary feat-action-btn"
                onClick={() => openMatchModal(featuredMatch)}
              >
                <FileText size={15} /> Ver Ficha & Alineaciones
              </button>

              <button 
                type="button" 
                className="btn btn-glass feat-action-btn"
                onClick={handleShareFeatured}
                title="Compartir partido en WhatsApp"
              >
                <Share2 size={15} color="var(--teal-light)" /> Compartir
              </button>

              {featuredMatch.stream_url && (
                <Link to={`/partido/${featuredMatch.id}`} className="btn btn-glass feat-action-btn feat-stream-btn">
                  <PlayCircle size={15} /> Transmisión
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════ FAVORITE TEAMS QUICK ACCESS (IF ANY) ══════ */}
      {favorites?.teams?.length > 0 && (
        <section className="favorites-quick-bar">
          <div className="favorites-bar-inner">
            <div className="fav-bar-title">
              <Star size={15} fill="var(--gold-light)" color="var(--gold-light)" />
              <span>Equipos en Favoritos ({favorites.teams.length}):</span>
            </div>
            <div className="fav-teams-pills">
              {favorites.teams.map(teamName => (
                <span 
                  key={teamName} 
                  className="fav-team-chip"
                  onClick={openSearchModal}
                  title={`Buscar partidos de ${teamName}`}
                >
                  {teamName}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ 3. MINI-TABLA DE POSICIONES & CUADROS DE PLAYOFFS ══════ */}
      {tournaments.length > 0 && (
        <section className="home-section">
          <SectionHeader
            icon={isKnockoutActive ? <Swords size={16} /> : <Trophy size={16} />}
            label={isKnockoutActive ? "Cuadro de Eliminatorias & Playoffs" : "Tabla de Posiciones & Rendimiento"}
            sub={isKnockoutActive ? "Seguí los cruces directos, fases finales y al campeón del certamen" : "Consulta quién lidera la liga y la forma reciente de cada club"}
            href={activeStandingsTour ? `/torneo/${activeStandingsTour.id}` : '/torneos'}
            color={isKnockoutActive ? "var(--rose-light)" : "var(--emerald-light)"}
            bg={isKnockoutActive ? "rgba(225, 95, 65, 0.16)" : "rgba(46, 157, 116, 0.16)"}
            border={isKnockoutActive ? "rgba(225, 95, 65, 0.38)" : "rgba(46, 157, 116, 0.38)"}
          />

          <div className={`mini-standings-card glass-panel ${isKnockoutActive ? 'is-knockout' : ''}`}>
            {/* Tournament Selector Pills */}
            <div className="mini-standings-tabs">
              {tournaments.map(t => {
                const isKo = t.type === 'knockout';
                const isSelected = selectedTourId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`mini-tour-tab ${isSelected ? 'active' : ''} ${isKo ? 'tab-ko' : 'tab-league'}`}
                    onClick={() => setSelectedTourId(t.id)}
                  >
                    {isKo ? (
                      <Swords size={13} color={isSelected ? 'var(--rose-light)' : 'var(--text-muted)'} />
                    ) : (
                      <Trophy size={13} color={isSelected ? 'var(--amber-light)' : 'var(--text-muted)'} />
                    )}
                    <span>{t.name}</span>
                    <span className={`format-pill ${isKo ? 'pill-ko' : 'pill-league'}`}>
                      {isKo ? 'Playoffs' : 'Liga'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Standings Table or Interactive Knockout Bracket */}
            {isKnockoutActive ? (
              <div className="mini-knockout-container animate-fade-in">
                <div className="mini-knockout-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div className="ko-banner-icon">
                      <Swords size={18} color="#f87171" />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {activeStandingsTour.name}
                      </h3>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Cuadro de Eliminación Directa · {activeStandingsTour.standings?.length || 0} Equipos
                      </span>
                    </div>
                  </div>
                  <Link to={`/torneo/${activeStandingsTour.id}`} className="btn btn-glass btn-sm mini-ko-full-btn">
                    Ver Torneo Completo <ExternalLink size={13} />
                  </Link>
                </div>

                {activeTourMatches.length > 0 ? (
                  <div style={{ marginTop: '0.75rem' }}>
                    <KnockoutBracket
                      matches={activeTourMatches}
                      teams={activeStandingsTour.standings || []}
                    />
                  </div>
                ) : (
                  <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Swords size={36} color="var(--rose-light)" style={{ marginBottom: '0.75rem', opacity: 0.8 }} />
                    <p style={{ fontWeight: 700, margin: '0 0 0.35rem', color: 'var(--text-primary)', fontSize: '1rem' }}>
                      Llaves de eliminatoria en preparación
                    </p>
                    <p style={{ fontSize: '0.84rem', margin: '0 0 1.25rem', color: 'var(--text-secondary)' }}>
                      Los cruces aún no han sido definidos por la organización.
                    </p>
                    {activeStandingsTour.standings?.length > 0 && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--nm-border)' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.65rem' }}>
                          Equipos registrados para la fase final ({activeStandingsTour.standings.length}):
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                          {activeStandingsTour.standings.map(t => {
                            const tStyle = getMatteTeamStyle(t.name);
                            return (
                              <span 
                                key={t.id} 
                                style={{ 
                                  padding: '0.35rem 0.75rem', 
                                  borderRadius: 'var(--radius-full)', 
                                  background: tStyle.bg, 
                                  borderColor: tStyle.border,
                                  color: tStyle.color,
                                  border: '1px solid',
                                  fontSize: '0.8rem', 
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem'
                                }}
                              >
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: tStyle.color }} />
                                {t.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : sortedStandings.length > 0 ? (
              <div className="mini-table-wrap">
                <table className="mini-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45px' }}>Pos</th>
                      <th>Club</th>
                      <th className="text-center" style={{ width: '45px' }}>PJ</th>
                      <th className="text-center" style={{ width: '50px' }}>PTS</th>
                      <th className="text-center" style={{ width: '90px' }}>Forma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStandings.map((team, idx) => {
                      const form = getTeamForm(team.id, matches);
                      const isLeader = idx === 0;
                      const isTop3 = idx > 0 && idx < 3;
                      const teamStyle = getMatteTeamStyle(team.name);
                      return (
                        <tr key={team.id || idx} className={isLeader ? 'row-leader' : ''}>
                          <td className="pos-cell">
                            <span className={`pos-number ${isLeader ? 'pos-leader' : (isTop3 ? 'pos-top3' : '')}`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="team-cell">
                            <div className="team-cell-wrap">
                              <span 
                                className="mini-team-avatar"
                                style={{ background: teamStyle.bg, borderColor: teamStyle.border, color: teamStyle.color }}
                              >
                                {team.name.slice(0, 2).toUpperCase()}
                              </span>
                              <span className="mini-team-name">{team.name}</span>
                            </div>
                          </td>
                          <td className="text-center num-cell">{team.played ?? 0}</td>
                          <td className="text-center points-cell">{team.points ?? 0}</td>
                          <td className="text-center form-cell">
                            <div className="form-dots-wrap">
                              {form.length > 0 ? (
                                form.map((res, i) => (
                                  <span key={i} className={`form-dot form-dot-${res}`} title={res === 'W' ? 'Victoria' : res === 'D' ? 'Empate' : 'Derrota'}>
                                    {res === 'W' ? 'G' : res === 'D' ? 'E' : 'P'}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted" style={{ fontSize: '0.72rem' }}>—</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="mini-table-footer">
                  <Link to={`/torneo/${activeStandingsTour.id}`} className="mini-full-link">
                    Ver tabla de posiciones completa y estadísticas <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '0.88rem' }}>Sin equipos registrados en este torneo aún.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════ EN VIVO AHORA (SI HAY TRANSMISIÓN) ══════ */}
      {liveVideos.length > 0 && (
        <section className="home-section" id="sec-live">
          <SectionHeader
            icon={<Radio size={16} />}
            label="En Vivo Ahora"
            sub="Transmisiones activas en este momento"
            href="/albumes"
            color="var(--rose-light)"
            bg="rgba(225, 95, 65, 0.16)"
            border="rgba(225, 95, 65, 0.38)"
          />
          <div className="grid-container">
            {liveVideos.map(v => (
              <div key={v.id}><VideoPlayer video={v} /></div>
            ))}
          </div>
        </section>
      )}

      {/* ══════ PRÓXIMOS ENCUENTROS ══════ */}
      <section className="home-section" id="sec-proximos">
        <SectionHeader
          icon={<Calendar size={16} />}
          label="Próximos Partidos"
          sub="Calendario de encuentros con liga, hora y sede deportiva"
          color="var(--blue-light)"
          bg="rgba(59, 130, 246, 0.16)"
          border="rgba(59, 130, 246, 0.38)"
        />
        {upcomingMatches.length > 0 ? (
          <div className="match-list">
            {upcomingMatches.map(match => {
              const tournament = tournaments.find(t => t.id === match.tournament_id);
              const homeTeam   = tournament?.standings?.find(s => s.id === match.home_team_id);
              const awayTeam   = tournament?.standings?.find(s => s.id === match.away_team_id);
              const location   = locations.find(l => l.id === match.location_id);
              if (!homeTeam || !awayTeam) return null;
              const isToday = match.date === today;
              const htStyle = getMatteTeamStyle(homeTeam.name);
              const atStyle = getMatteTeamStyle(awayTeam.name);

              return (
                <div 
                  key={match.id} 
                  className="match-row glass-panel"
                  onClick={() => openMatchModal(match)}
                >
                  {isToday && <span className="match-today-tag">HOY</span>}
                  <div className="match-league"><Trophy size={12} color="var(--primary-light)" />{tournament?.name}</div>
                  <div className="match-teams">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="row-team-dot" style={{ background: htStyle.color }} />
                      {homeTeam.name}
                    </span>
                    <span className="match-vs">VS</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="row-team-dot" style={{ background: atStyle.color }} />
                      {awayTeam.name}
                    </span>
                  </div>
                  <div className="match-meta">
                    <span><Calendar size={12} color="var(--blue-light)" /> {match.date}</span>
                    <span><Clock size={12} color="var(--amber-light)" /> {match.time}</span>
                    {location && <span><MapPin size={12} color="var(--emerald-light)" /> {location.name}</span>}
                  </div>
                  <ChevronRight size={15} className="match-arrow" />
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={Calendar} title="Sin partidos próximos" text="No hay encuentros agendados en los próximos días." />
        )}
      </section>

      {/* ══════ ÁLBUMES & JUGADAS ══════ */}
      <section className="home-section" id="sec-albums">
        <SectionHeader
          icon={<PlayCircle size={16} />}
          label="Momentos & Álbumes de Video"
          sub="Partidos completos, resúmenes y jugadas destacadas"
          href="/albumes"
          color="var(--purple-light)"
          bg="rgba(136, 84, 208, 0.16)"
          border="rgba(136, 84, 208, 0.38)"
        />
        {topAlbums.length > 0 ? (
          <div className="grid-container">
            {topAlbums.map(album => (
              <div key={album.id} className="album-card" onClick={() => navigate(`/album/${album.id}`)}>
                <div className="album-thumb">
                  <img
                    src={album.thumbnail || 'https://images.unsplash.com/photo-1518605368461-1ee125b29b46?q=80&w=600&auto=format&fit=crop'}
                    alt={album.title}
                  />
                  <div className="album-overlay" />
                  <div className="album-play-icon"><PlayCircle size={32} color="#ffffff" /></div>
                </div>
                <div className="album-info">
                  <p className="album-title">{album.title}</p>
                  <p className="album-date">{album.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Video} title="Sin álbumes aún" text="Los resúmenes y transmisiones aparecerán aquí." />
        )}
      </section>

      {/* ══════ TORNEOS ACTIVOS ══════ */}
      <section className="home-section" id="sec-torneos">
        <SectionHeader
          icon={<Trophy size={16} />}
          label="Torneos en Disputa"
          sub="Seguí tablas de posiciones y fases finales de cada campeonato"
          href="/torneos"
          color="var(--amber-light)"
          bg="rgba(217, 119, 6, 0.16)"
          border="rgba(217, 119, 6, 0.38)"
        />

        {/* Filter Chips: Todos | Ligas | Eliminatorias */}
        {tournaments.length > 1 && (
          <div className="tour-format-filters">
            <button
              type="button"
              className={`tour-filter-chip ${tourFormatFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTourFormatFilter('all')}
            >
              Todos ({tournaments.length})
            </button>
            {leagueCount > 0 && (
              <button
                type="button"
                className={`tour-filter-chip ${tourFormatFilter === 'league' ? 'active' : ''}`}
                onClick={() => setTourFormatFilter('league')}
              >
                <Trophy size={12} /> Ligas ({leagueCount})
              </button>
            )}
            {knockoutCount > 0 && (
              <button
                type="button"
                className={`tour-filter-chip chip-ko ${tourFormatFilter === 'knockout' ? 'active' : ''}`}
                onClick={() => setTourFormatFilter('knockout')}
              >
                <Swords size={12} /> Eliminatorias ({knockoutCount})
              </button>
            )}
          </div>
        )}

        {filteredFeaturedTours.length > 0 ? (
          <div className="grid-container">
            {filteredFeaturedTours.map(t => (
              <div key={t.id} className="hover-lift transition-all">
                <TournamentCard tournament={t} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={tourFormatFilter === 'knockout' ? Swords : Trophy} 
            title={tourFormatFilter === 'knockout' ? "Sin torneos eliminatorios" : "Sin torneos"} 
            text={tourFormatFilter === 'knockout' ? "No hay torneos de eliminación directa en esta categoría." : "Cuando se creen torneos aparecerán aquí."} 
          />
        )}
      </section>

      {/* ══════ SEDES / CANCHAS ══════ */}
      {locationRanking.length > 0 && (
        <section className="home-section" id="sec-canchas">
          <SectionHeader
            icon={<MapPin size={16} />}
            label="Sedes Deportivas & Canchas"
            sub="Las canchas donde se disputan los torneos"
            color="var(--teal-light)"
            bg="rgba(20, 184, 166, 0.16)"
            border="rgba(20, 184, 166, 0.38)"
          />
          <div className="canchas-grid">
            {locationRanking.map((loc, idx) => (
              <div key={loc.id} className="cancha-card glass-panel">
                <div className="cancha-rank" style={{ color: idx === 0 ? 'var(--gold-light)' : (idx === 1 ? 'var(--teal-light)' : 'var(--text-muted)') }}>
                  #{idx + 1}
                </div>
                <div className="cancha-info">
                  <p className="cancha-name">{loc.name}</p>
                  <p className="cancha-count">{loc.count} partido{loc.count !== 1 ? 's' : ''}</p>
                  {loc.map_url && (
                    <a href={loc.map_url} target="_blank" rel="noreferrer" className="cancha-map-link"
                       onClick={e => e.stopPropagation()}>
                      <MapPin size={11} color="var(--teal-light)" /> Ver ubicación
                    </a>
                  )}
                </div>
                <div className="cancha-bar-wrap">
                  <div className="cancha-bar"
                    style={{ 
                      width: `${locationRanking[0].count > 0 ? (loc.count / locationRanking[0].count) * 100 : 0}%`,
                      background: 'linear-gradient(90deg, #14b8a6, #2dd4bf)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}



      {/* ══════ STYLES ══════ */}
      <style>{`
        /* Page Base */
        .home-page { opacity: 0; transition: opacity 0.4s ease; padding-top: 0.25rem; }
        .home-mounted { opacity: 1; }
        .home-section { padding-bottom: 2.75rem; }

        /* ── 1. Scores Ticker Ribbon ── */
        .scores-ticker-wrap {
          background: var(--bg-card);
          border: 1px solid var(--nm-border);
          padding: 0.75rem 1rem 0.85rem 1rem;
          margin-bottom: 1.5rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--nm-shadow-raised-sm);
        }
        .ticker-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.65rem;
          padding: 0 0.15rem;
        }
        .ticker-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: var(--text-secondary);
        }
        .ticker-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--rose);
          animation: pulse 1.5s infinite;
        }
        .ticker-controls {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .ticker-nav-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1px solid var(--nm-border);
          background: var(--bg-sunken);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.16s ease;
        }
        .ticker-nav-btn:hover {
          color: var(--text-primary);
          background: var(--bg-card);
        }
        .scores-ticker-rail {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 0.2rem;
          scroll-snap-type: x mandatory;
        }
        .scores-ticker-rail::-webkit-scrollbar { display: none; }
        .ticker-match-card {
          flex-shrink: 0;
          min-width: 230px;
          padding: 0.7rem 0.85rem;
          background: var(--bg-sunken);
          border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-inset-sm);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: transform 0.16s ease, border-color 0.16s ease;
          scroll-snap-align: start;
        }
        .ticker-match-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.14);
        }
        .ticker-card-final {
          border-color: rgba(245, 158, 11, 0.35);
        }
        .ticker-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.45rem;
        }
        .ticker-tour-name {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }
        .ticker-status-tag {
          font-size: 0.64rem;
          font-weight: 800;
          padding: 0.12rem 0.45rem;
          border-radius: 4px;
        }
        .ticker-status-tag.tag-played {
          background: rgba(46, 157, 116, 0.18);
          color: #4ade80;
          border: 1px solid rgba(46, 157, 116, 0.35);
        }
        .ticker-status-tag.tag-today {
          background: rgba(225, 95, 65, 0.18);
          color: #f87171;
          border: 1px solid rgba(225, 95, 65, 0.35);
        }
        .ticker-status-tag.tag-sched {
          background: rgba(59, 130, 246, 0.16);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.35);
        }
        .ticker-teams-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.45rem;
        }
        .ticker-team-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex: 1;
          min-width: 0;
        }
        .ticker-team-right {
          justify-content: flex-end;
        }
        .ticker-team-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.68rem;
          font-weight: 800;
          flex-shrink: 0;
          border: 1px solid;
        }
        .ticker-team-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ticker-score-bubble {
          font-size: 0.84rem;
          font-weight: 900;
          color: var(--text-primary);
          padding: 0.15rem 0.45rem;
          background: var(--bg-card);
          border-radius: 4px;
          border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-raised-sm);
          flex-shrink: 0;
        }

        /* ── 2. Match Center: Featured Match Card ── */
        .featured-match-section {
          margin-bottom: 2rem;
        }
        .featured-match-card {
          background: linear-gradient(135deg, rgba(20, 24, 38, 0.95) 0%, rgba(15, 17, 26, 0.98) 100%);
          border: 1px solid rgba(79, 109, 245, 0.22);
          box-shadow: var(--nm-shadow-raised);
          border-radius: var(--radius-xl);
          padding: 1.35rem 1.65rem;
          position: relative;
          overflow: hidden;
        }
        .feat-card-final {
          border-color: rgba(245, 158, 11, 0.45);
          box-shadow: 0 0 35px rgba(245, 158, 11, 0.14), var(--nm-shadow-raised);
        }
        .feat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .feat-badges {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .feat-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.7rem;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.6px;
        }
        .feat-pill-live {
          background: rgba(225, 95, 65, 0.18);
          color: #f87171;
          border: 1px solid rgba(225, 95, 65, 0.35);
        }
        .feat-pill-highlight {
          background: rgba(59, 130, 246, 0.16);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.35);
        }
        .feat-tour-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          background: var(--bg-sunken);
          border: 1px solid var(--nm-border);
          color: var(--text-secondary);
          font-size: 0.74rem;
          font-weight: 700;
        }
        .feat-location-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.76rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .feat-duel {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem 0 1.5rem 0;
          cursor: pointer;
        }
        .feat-team {
          display: flex;
          align-items: center;
          gap: 1.15rem;
        }
        .feat-team-home {
          justify-content: flex-start;
        }
        .feat-team-away {
          justify-content: flex-end;
          flex-direction: row-reverse;
          text-align: right;
        }
        .feat-avatar {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          border: 2px solid;
          box-shadow: var(--nm-shadow-raised-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.35rem;
          font-weight: 900;
          flex-shrink: 0;
        }
        .feat-team-meta {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          min-width: 0;
        }
        .feat-team-name {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .feat-form-row {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .feat-team-away .feat-form-row {
          justify-content: flex-end;
        }
        .feat-form-label {
          font-size: 0.68rem;
          color: var(--text-muted);
          margin-right: 0.15rem;
        }
        .form-dot {
          width: 17px;
          height: 17px;
          border-radius: 4px;
          font-size: 0.62rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .form-dot-W { background: rgba(46, 157, 116, 0.28); color: #6ee7b7; border: 1px solid rgba(46, 157, 116, 0.48); }
        .form-dot-D { background: rgba(90, 100, 128, 0.24); color: #cbd5e1; border: 1px solid rgba(90, 100, 128, 0.4); }
        .form-dot-L { background: rgba(225, 95, 65, 0.25); color: #fca5a5; border: 1px solid rgba(225, 95, 65, 0.45); }

        .feat-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 130px;
        }
        .feat-score-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.45rem;
        }
        .feat-score-numbers {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--text-primary);
          font-family: 'Nunito', sans-serif;
          line-height: 1;
        }
        .feat-score-sep {
          color: var(--text-muted);
          font-weight: 400;
        }
        .feat-status-badge {
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.8px;
          padding: 0.2rem 0.65rem;
          border-radius: var(--radius-full);
        }
        .badge-played {
          background: rgba(46, 157, 116, 0.22);
          color: #6ee7b7;
          border: 1px solid rgba(46, 157, 116, 0.4);
        }
        .feat-timing-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.55rem 1.15rem;
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.24);
          border-radius: var(--radius-md);
          box-shadow: var(--nm-shadow-inset-sm);
        }
        .feat-time {
          font-size: 1.55rem;
          font-weight: 900;
          color: var(--text-primary);
          font-family: 'Nunito', sans-serif;
          line-height: 1.1;
        }
        .feat-date {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        .feat-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding-top: 1.15rem;
          border-top: 1px solid var(--nm-border);
          flex-wrap: wrap;
        }
        .feat-action-btn {
          font-size: 0.82rem;
          padding: 0.55rem 1.1rem;
          border-radius: var(--radius-full);
        }
        .feat-stream-btn {
          color: #f87171;
          border-color: rgba(225, 95, 65, 0.3);
          background: rgba(225, 95, 65, 0.1);
        }

        /* ── Favorites Quick Bar ── */
        .favorites-quick-bar {
          background: var(--bg-card);
          border: 1px solid rgba(245, 158, 11, 0.25);
          box-shadow: var(--nm-shadow-raised-sm);
          border-radius: var(--radius-lg);
          padding: 0.7rem 1.15rem;
          margin-bottom: 2rem;
        }
        .favorites-bar-inner {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }
        .fav-bar-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--gold-light);
          white-space: nowrap;
        }
        .fav-teams-pills {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }
        .fav-team-chip {
          padding: 0.22rem 0.65rem;
          border-radius: var(--radius-full);
          background: var(--bg-sunken);
          border: 1px solid var(--nm-border);
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.16s ease;
        }
        .fav-team-chip:hover {
          color: var(--gold-light);
          border-color: rgba(245, 158, 11, 0.4);
        }

        /* ── 3. Mini-Tabla de Posiciones & Cuadro de Playoffs ── */
        .mini-standings-card {
          padding: 1.15rem 1.25rem;
          border-radius: var(--radius-xl);
          margin-bottom: 2rem;
          border: 1px solid rgba(46, 157, 116, 0.22);
          transition: border-color 0.25s ease;
        }
        .mini-standings-card.is-knockout {
          border-color: rgba(225, 95, 65, 0.26);
        }
        .mini-standings-tabs {
          display: flex;
          gap: 0.45rem;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid var(--nm-border);
        }
        .mini-standings-tabs::-webkit-scrollbar { display: none; }
        .mini-tour-tab {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          background: var(--bg-sunken);
          border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-inset-sm);
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.16s ease;
        }
        .mini-tour-tab:hover {
          color: var(--text-primary);
        }
        .mini-tour-tab.active {
          background: var(--bg-card);
          color: var(--text-primary);
          border-color: rgba(46, 157, 116, 0.4);
          box-shadow: var(--nm-shadow-raised-sm);
        }
        .mini-tour-tab.tab-ko.active {
          border-color: rgba(225, 95, 65, 0.45);
        }

        .format-pill {
          font-size: 0.64rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          padding: 0.12rem 0.45rem;
          border-radius: var(--radius-full);
          margin-left: 0.15rem;
        }
        .format-pill.pill-ko {
          background: rgba(225, 95, 65, 0.16);
          color: #f87171;
          border: 1px solid rgba(225, 95, 65, 0.32);
        }
        .format-pill.pill-league {
          background: rgba(46, 157, 116, 0.14);
          color: #4ade80;
          border: 1px solid rgba(46, 157, 116, 0.28);
        }

        /* Knockout embedded on Home */
        .mini-knockout-container {
          padding: 0.35rem 0;
        }
        .mini-knockout-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(225, 95, 65, 0.08);
          border: 1px solid rgba(225, 95, 65, 0.22);
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .ko-banner-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(225, 95, 65, 0.16);
          border: 1px solid rgba(225, 95, 65, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .mini-ko-full-btn {
          font-size: 0.75rem;
          padding: 0.35rem 0.8rem;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
        }
        .mini-ko-full-btn:hover {
          color: #f87171;
          border-color: rgba(225, 95, 65, 0.35);
        }

        /* Tournaments format filters */
        .tour-format-filters {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tour-format-filters::-webkit-scrollbar { display: none; }
        .tour-filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.42rem 0.95rem;
          border-radius: var(--radius-full);
          background: var(--bg-card);
          border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-raised-sm);
          color: var(--text-secondary);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.16s ease;
          -webkit-tap-highlight-color: transparent !important;
        }
        .tour-filter-chip:hover {
          color: var(--text-primary);
          border-color: rgba(255, 255, 255, 0.12);
        }
        .tour-filter-chip.active {
          background: var(--bg-sunken);
          box-shadow: var(--nm-shadow-inset-sm);
          color: var(--text-primary);
          border-color: var(--amber-light);
        }
        .tour-filter-chip.chip-ko.active {
          border-color: var(--rose-light);
          color: #f87171;
        }
        .mini-table-wrap {
          overflow-x: auto;
        }
        .mini-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .mini-table th {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0.45rem 0.6rem;
          border-bottom: 1px solid var(--nm-border);
        }
        .mini-table td {
          padding: 0.65rem 0.6rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          vertical-align: middle;
        }
        .mini-table tr.row-leader {
          background: rgba(217, 119, 6, 0.06);
        }
        .pos-cell {
          text-align: center;
        }
        .pos-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 4px;
          font-size: 0.74rem;
          font-weight: 800;
          color: var(--text-muted);
        }
        .pos-leader {
          color: var(--gold-light);
          background: rgba(217, 119, 6, 0.2);
          border: 1px solid rgba(217, 119, 6, 0.45);
        }
        .pos-top3 {
          color: #60a5fa;
          background: rgba(59, 130, 246, 0.16);
          border: 1px solid rgba(59, 130, 246, 0.35);
        }
        .team-cell-wrap {
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }
        .mini-team-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1px solid;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.66rem;
          font-weight: 800;
          flex-shrink: 0;
        }
        .mini-team-name {
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }
        .num-cell {
          color: var(--text-secondary);
          font-weight: 600;
        }
        .points-cell {
          font-weight: 900;
          color: var(--text-primary);
          font-size: 0.95rem;
        }
        .form-dots-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
        }
        .mini-table-footer {
          padding: 0.85rem 0.25rem 0.25rem 0.25rem;
          display: flex;
          justify-content: flex-end;
        }
        .mini-full-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--emerald-light);
          text-decoration: none;
          transition: gap 0.16s ease, color 0.16s ease;
        }
        .mini-full-link:hover {
          color: #a7f3d0;
          gap: 0.55rem;
        }

        /* ── Section Header ── */
        .sec-header { margin-bottom: 1.25rem; }
        .sec-icon-box {
          width: 36px; height: 36px; border-radius: var(--radius-md);
          border: 1px solid;
          box-shadow: var(--nm-shadow-raised-sm);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sec-sub { margin-top: 0.25rem; font-size: 0.8rem; color: var(--text-muted); padding-left: 3.2rem; }
        .sec-line { height: 1px; margin-top: 0.75rem; }
        .see-all-link {
          display: inline-flex; align-items: center; gap: 0.25rem;
          font-size: 0.82rem; font-weight: 700;
          margin-left: 0.75rem; transition: opacity 0.2s, gap 0.2s;
        }
        .see-all-link:hover { opacity: 0.8; gap: 0.45rem; }

        /* ── Match Row (Fixture List) ── */
        .match-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .match-row {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.95rem 1.25rem; border-radius: var(--radius-lg);
          background: var(--bg-card); border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-raised-sm);
          color: inherit; position: relative; overflow: hidden;
          flex-wrap: wrap; transition: all 0.2s; cursor: pointer;
        }
        .match-row:hover { box-shadow: var(--nm-shadow-raised); transform: translateX(2px); border-color: rgba(255, 255, 255, 0.08); }
        .match-today-tag {
          position: absolute; top: 0; right: 0;
          background: var(--rose); color: #fff; font-size: 0.6rem; font-weight: 800;
          letter-spacing: 1px; padding: 0.2rem 0.6rem; border-bottom-left-radius: var(--radius-sm);
        }
        .match-league { display: flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.8px; min-width: 120px; flex-shrink: 0; }
        .match-teams  { display: flex; align-items: center; gap: 0.7rem; flex: 1; font-weight: 700; font-size: 0.93rem; flex-wrap: wrap; }
        .row-team-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
        .match-vs     { color: var(--text-muted); font-size: 0.72rem; flex-shrink: 0; }
        .match-meta   { display: flex; gap: 0.9rem; font-size: 0.76rem; color: var(--text-muted); flex-wrap: wrap; align-items: center; }
        .match-meta span { display: flex; align-items: center; gap: 0.3rem; }
        .match-arrow  { color: var(--text-muted); flex-shrink: 0; transition: color 0.2s; }
        .match-row:hover .match-arrow { color: var(--text-primary); }

        /* ── Albums ── */
        .album-card { cursor: pointer; overflow: hidden; border-radius: var(--radius-lg); background: var(--bg-card); border: 1px solid var(--nm-border); box-shadow: var(--nm-shadow-raised-sm); transition: all 0.2s; }
        .album-card:hover { box-shadow: var(--nm-shadow-raised); transform: translateY(-2px); border-color: rgba(136, 84, 208, 0.3); }
        .album-thumb { position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden; }
        .album-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .album-card:hover .album-thumb img { transform: scale(1.04); }
        .album-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%); }
        .album-play-icon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
        .album-card:hover .album-play-icon { opacity: 1; }
        .album-info { padding: 0.85rem 1rem; }
        .album-title { font-size: 0.92rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .album-date  { font-size: 0.74rem; color: var(--text-muted); }

        /* ── Canchas ── */
        .canchas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
        .cancha-card { display: flex; align-items: center; gap: 1rem; padding: 1.15rem; position: relative; overflow: hidden; background: var(--bg-card); border: 1px solid var(--nm-border); border-radius: var(--radius-lg); box-shadow: var(--nm-shadow-raised-sm); transition: all 0.2s; }
        .cancha-card:hover { box-shadow: var(--nm-shadow-raised); transform: translateY(-2px); border-color: rgba(20, 184, 166, 0.3); }
        .cancha-rank { font-size: 1.8rem; font-weight: 900; font-family: 'Nunito', sans-serif; line-height: 1; flex-shrink: 0; }
        .cancha-name { font-weight: 800; font-size: 0.95rem; margin-bottom: 0.15rem; }
        .cancha-count { font-size: 0.78rem; color: var(--text-muted); }
        .cancha-map-link { display: inline-flex; align-items: center; gap: 0.25rem; margin-top: 0.4rem; font-size: 0.75rem; color: var(--teal-light); font-weight: 700; }
        .cancha-bar-wrap { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--nm-border); }
        .cancha-bar { height: 100%; border-radius: 0 2px 2px 0; transition: width 0.8s ease; }

        /* ── Empty State ── */
        .empty-state { padding: 2.25rem 1.5rem; text-align: center; background: var(--bg-sunken); border-radius: var(--radius-lg); border: 1px dashed var(--nm-border-strong); box-shadow: var(--nm-shadow-inset-sm); }
        .empty-icon-wrap { width: 48px; height: 48px; border-radius: 50%; background: var(--bg-card); border: 1px solid var(--nm-border); margin: 0 auto 0.75rem; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
        .empty-title { font-weight: 700; font-size: 0.92rem; margin-bottom: 0.25rem; color: var(--text-primary); }
        .empty-text  { font-size: 0.82rem; color: var(--text-muted); }

        /* ── Footer ── */
        .home-footer { padding: 3rem 1rem 2rem; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; border-top: 1px solid var(--nm-border); margin-top: 2rem; }
        .footer-brand { font-family: 'Nunito', sans-serif; font-size: 1.25rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; display: flex; align-items: center; gap: 0.5rem; }
        .footer-sub { color: var(--text-muted); font-size: 0.82rem; text-align: center; max-width: 340px; }
        .footer-socials { display: flex; gap: 0.85rem; }
        .footer-copy { font-size: 0.76rem; color: var(--text-muted); }
        .social-icon { display: flex; padding: 0.7rem; border-radius: 50%; background: var(--bg-card); border: 1px solid var(--nm-border); box-shadow: var(--nm-shadow-raised-sm); color: var(--text-secondary); transition: all 0.2s; }
        .social-icon:hover { color: var(--text-primary); border-color: rgba(255, 255, 255, 0.12); transform: translateY(-2px); }

        /* ── Responsive Mobile Optimizations ── */
        @media (max-width: 768px) {
          .feat-duel {
            grid-template-columns: 1fr;
            gap: 1.25rem;
            text-align: center;
          }
          .feat-team-home, .feat-team-away {
            flex-direction: column !important;
            justify-content: center !important;
            text-align: center !important;
            gap: 0.5rem;
          }
          .feat-form-row {
            justify-content: center !important;
          }
          .feat-avatar {
            width: 54px;
            height: 54px;
            font-size: 1.15rem;
          }
          .featured-match-card {
            padding: 1.15rem 1rem;
          }
          .feat-action-btn {
            width: 100%;
            justify-content: center;
          }
          .mini-standings-card {
            padding: 1rem 0.75rem;
          }
          .mini-team-name {
            max-width: 110px;
          }
          .match-league { min-width: unset; }
          .canchas-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
