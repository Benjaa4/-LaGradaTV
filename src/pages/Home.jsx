import { useAppContext } from '../context/AppContext';
import TournamentCard from '../components/TournamentCard';
import VideoPlayer from '../components/VideoPlayer';
import MatchCard from '../components/MatchCard';
import { Mail, Trophy, PlayCircle, Radio, Calendar, Zap, MapPin, ChevronRight, ChevronLeft, Users, Tv } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/* ── Animated counter ───────────────────────────────────────────── */
function Counter({ to }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let n = 0;
      const step = Math.max(1, Math.ceil(to / 35));
      const t = setInterval(() => { n = Math.min(n + step, to); setVal(n); if (n >= to) clearInterval(t); }, 28);
      obs.disconnect();
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}</span>;
}

/* ── Horizontal carousel ────────────────────────────────────────── */
function HScroll({ children, id }) {
  const rail = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const check = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    check();
    const el = rail.current;
    if (!el) return;
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, [check, children]);

  const scroll = (dir) => {
    rail.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div className="hscroll-wrap" id={id}>
      {canLeft  && <button className="hscroll-btn hscroll-btn-l" onClick={() => scroll(-1)}><ChevronLeft  size={20} /></button>}
      {canRight && <button className="hscroll-btn hscroll-btn-r" onClick={() => scroll(1)}><ChevronRight size={20} /></button>}
      <div className="hscroll-rail" ref={rail}>
        {children}
      </div>
    </div>
  );
}

/* ── Section header ─────────────────────────────────────────────── */
function SectionHeader({ icon, label, sub, href, id }) {
  return (
    <div className="sec-header" id={id}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <div className="sec-icon-box">{icon}</div>
          <h2 className="section-title" style={{ margin: 0 }}>{label}</h2>
          {href && <Link to={href} className="see-all-link">Ver todo <ChevronRight size={14} /></Link>}
        </div>
        {sub && <p className="sec-sub">{sub}</p>}
      </div>
      <div className="sec-line" />
    </div>
  );
}

function EmptyState({ emoji = '📭', title, text }) {
  return (
    <div className="empty-state">
      <span className="empty-emoji">{emoji}</span>
      {title && <p className="empty-title">{title}</p>}
      <p className="empty-text">{text}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOME
══════════════════════════════════════════════════════════════════ */
const SECTIONS = [
  { id: 'sec-live',     label: '🔴 En Vivo' },
  { id: 'sec-hoy',      label: '⚡ Hoy' },
  { id: 'sec-proximos', label: '📅 Próximos' },
  { id: 'sec-albums',   label: '🎬 Álbumes' },
  { id: 'sec-torneos',  label: '🏆 Torneos' },
  { id: 'sec-canchas',  label: '📍 Canchas' },
];

export default function Home() {
  const { tournaments, videos, albums, matches, locations } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navRef = useRef(null);
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { setMounted(true); }, []);

  // Derived
  const liveVideos      = videos.filter(v => v.type === 'live');
  const topAlbums       = albums.slice(0, 12);
  const featuredTours   = tournaments.slice(0, 8);
  const todayMatches    = matches.filter(m => m.date === today);
  const upcomingMatches = matches
    .filter(m => m.date >= today && m.status !== 'played')
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
    .slice(0, 8);
  const locationRanking = locations
    .map(loc => ({ ...loc, count: matches.filter(m => m.location_id === loc.id).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const totalTeams = tournaments.reduce((s, t) => s + (t.standings?.length || 0), 0);

  // Sticky section nav active state
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [mounted]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Filter only sections that have content
  const visibleSections = SECTIONS.filter(({ id }) => {
    if (id === 'sec-live'     && liveVideos.length === 0) return false;
    if (id === 'sec-hoy'      && todayMatches.length === 0) return false;
    if (id === 'sec-canchas'  && locationRanking.length === 0) return false;
    return true;
  });

  return (
    <div className={`home-page ${mounted ? 'home-mounted' : ''}`}>

      {/* ══════ HERO ══════ */}
      <section className="hero-section">
        <div className="hero-grid-bg" />
        <div className="hero-glow hero-glow-l" />
        <div className="hero-glow hero-glow-r" />

        <div className="hero-inner animate-slide-up">
          {liveVideos.length > 0 && (
            <div className="hero-live-pill">
              <span className="live-dot-sm" />
              <Tv size={13} /> {liveVideos.length} transmisión{liveVideos.length > 1 ? 'es' : ''} activa{liveVideos.length > 1 ? 's' : ''}
            </div>
          )}

          <p className="hero-eyebrow">⚽ La Grada TV</p>
          <h1 className="hero-title">
            El fútbol que amás,<br />
            <span className="hero-shimmer">donde quiera que estés.</span>
          </h1>
          <p className="hero-subtitle">
            Seguí torneos, encontrá partidos y canchas, y revivé los mejores momentos con transmisiones en vivo.
          </p>

          <div className="hero-ctas">
            <Link to="/torneos" className="btn btn-primary hero-cta-main">Ver Torneos</Link>
            <Link to="/albumes" className="btn btn-glass hero-cta-sec">
              <PlayCircle size={16} /> Videos y Streams
            </Link>
          </div>

          <div className="hero-stats-strip">
            {[
              { label: 'Torneos',  val: tournaments.length },
              { label: 'Equipos',  val: totalTeams },
              { label: 'Partidos', val: matches.length },
              { label: 'Videos',   val: videos.length },
            ].map(({ label, val }, i, arr) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                <div className="hero-stat">
                  <span className="hero-stat-n"><Counter to={val} /></span>
                  <span className="hero-stat-l">{label}</span>
                </div>
                {i < arr.length - 1 && <div className="hero-stat-div" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ STICKY SECTION NAV ══════ */}
      {visibleSections.length > 0 && (
        <div className="sec-nav-wrap" ref={navRef}>
          <div className="sec-nav">
            {visibleSections.map(({ id, label }) => (
              <button
                key={id}
                className={`sec-nav-btn ${activeSection === id ? 'sec-nav-btn-active' : ''}`}
                onClick={() => scrollTo(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════ EN VIVO ══════ */}
      {liveVideos.length > 0 && (
        <section className="home-section">
          <SectionHeader
            id="sec-live"
            icon={<div className="live-dot-sm" />}
            label="En Vivo Ahora"
            sub="Transmisiones activas en este momento"
            href="/albumes"
          />
          <HScroll>
            {liveVideos.map(v => (
              <div key={v.id} className="hscroll-item"><VideoPlayer video={v} /></div>
            ))}
          </HScroll>
        </section>
      )}

      {/* ══════ PARTIDOS DE HOY ══════ */}
      {todayMatches.length > 0 && (
        <section className="home-section">
          <SectionHeader
            id="sec-hoy"
            icon={<Radio size={16} color="#fb7185" />}
            label="Partidos de Hoy"
            sub={`${todayMatches.length} encuentro${todayMatches.length > 1 ? 's' : ''} programado${todayMatches.length > 1 ? 's' : ''} hoy`}
          />
          <HScroll>
            {todayMatches.map(m => (
              <div key={m.id} className="hscroll-item hscroll-item-wide"><MatchCard match={m} /></div>
            ))}
          </HScroll>
        </section>
      )}

      {/* ══════ PRÓXIMOS PARTIDOS ══════ */}
      <section className="home-section">
        <SectionHeader
          id="sec-proximos"
          icon={<Calendar size={16} color="#60a5fa" />}
          label="Próximos Partidos"
          sub="Los encuentros que se vienen — con liga, hora y cancha"
        />
        {upcomingMatches.length > 0 ? (
          <div className="match-list">
            {upcomingMatches.map(match => {
              const tournament = tournaments.find(t => t.id === match.tournament_id);
              const homeTeam   = tournament?.standings.find(s => s.id === match.home_team_id);
              const awayTeam   = tournament?.standings.find(s => s.id === match.away_team_id);
              const location   = locations.find(l => l.id === match.location_id);
              if (!homeTeam || !awayTeam) return null;
              const isToday = match.date === today;
              return (
                <Link to={`/partido/${match.id}`} key={match.id} className="match-row glass-panel">
                  {isToday && <span className="match-today-tag">HOY</span>}
                  <div className="match-league"><Trophy size={11} />{tournament?.name}</div>
                  <div className="match-teams">
                    <span>{homeTeam.name}</span>
                    <span className="match-vs">VS</span>
                    <span>{awayTeam.name}</span>
                  </div>
                  <div className="match-meta">
                    <span>📅 {match.date}</span>
                    <span>🕐 {match.time}</span>
                    {location && <span><MapPin size={11} /> {location.name}</span>}
                  </div>
                  <ChevronRight size={15} className="match-arrow" />
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState emoji="📆" title="Sin partidos próximos" text="No hay encuentros agendados. Volvé pronto." />
        )}
      </section>

      {/* ══════ ÁLBUMES ══════ */}
      <section className="home-section">
        <SectionHeader
          id="sec-albums"
          icon={<PlayCircle size={16} color="#a78bfa" />}
          label="Álbumes Destacados"
          sub="Partidos completos, resúmenes y los mejores momentos"
          href="/albumes"
        />
        {topAlbums.length > 0 ? (
          <HScroll>
            {topAlbums.map(album => (
              <div key={album.id} className="hscroll-item album-card" onClick={() => navigate(`/album/${album.id}`)}>
                <div className="album-thumb">
                  <img
                    src={album.thumbnail || 'https://images.unsplash.com/photo-1518605368461-1ee125b29b46?q=80&w=600&auto=format&fit=crop'}
                    alt={album.title}
                  />
                  <div className="album-overlay" />
                  <div className="album-play-icon"><PlayCircle size={36} /></div>
                </div>
                <div className="album-info">
                  <p className="album-title">{album.title}</p>
                  <p className="album-date">{album.date}</p>
                </div>
              </div>
            ))}
          </HScroll>
        ) : (
          <EmptyState emoji="🎬" title="Sin álbumes aún" text="Los videos aparecerán aquí." />
        )}
      </section>

      {/* ══════ TORNEOS ══════ */}
      <section className="home-section">
        <SectionHeader
          id="sec-torneos"
          icon={<Trophy size={16} color="#fbbf24" />}
          label="Torneos Activos"
          sub="Seguí tablas de posiciones y el fixture de cada liga"
          href="/torneos"
        />
        {featuredTours.length > 0 ? (
          <HScroll>
            {featuredTours.map(t => (
              <div key={t.id} className="hscroll-item hscroll-item-wide">
                <TournamentCard tournament={t} />
              </div>
            ))}
          </HScroll>
        ) : (
          <EmptyState emoji="🏆" title="Sin torneos" text="Cuando se creen torneos aparecerán aquí." />
        )}
      </section>

      {/* ══════ CANCHAS ══════ */}
      {locationRanking.length > 0 && (
        <section className="home-section">
          <SectionHeader
            id="sec-canchas"
            icon={<MapPin size={16} color="#34d399" />}
            label="Canchas Más Utilizadas"
            sub="Los estadios y canchas con más partidos en la plataforma"
          />
          <div className="canchas-grid">
            {locationRanking.map((loc, idx) => (
              <div key={loc.id} className="cancha-card glass-panel">
                <div className="cancha-rank">#{idx + 1}</div>
                <div className="cancha-info">
                  <p className="cancha-name">{loc.name}</p>
                  <p className="cancha-count">{loc.count} partido{loc.count !== 1 ? 's' : ''}</p>
                  {loc.map_url && (
                    <a href={loc.map_url} target="_blank" rel="noreferrer" className="cancha-map-link"
                       onClick={e => e.stopPropagation()}>
                      <MapPin size={11} /> Ver en mapa
                    </a>
                  )}
                </div>
                <div className="cancha-bar-wrap">
                  <div className="cancha-bar"
                    style={{ width: `${locationRanking[0].count > 0 ? (loc.count / locationRanking[0].count) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════ FOOTER ══════ */}
      <footer className="home-footer animate-fade-in">
        <div className="footer-brand">⚽ La Grada TV</div>
        <p className="footer-sub">Tu plataforma de torneos locales. Todos los partidos, estadísticas y transmisiones en un solo lugar.</p>
        <div className="footer-socials">
          {[
            { href: 'https://www.instagram.com/ariza.benja/', label: 'Instagram', svg: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg> },
            { href: '#', label: 'Twitter', svg: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg> },
            { href: '#', label: 'Facebook', svg: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
          ].map(({ href, label, svg }) => (
            <a key={label} href={href} className="social-icon" aria-label={label}>{svg}</a>
          ))}
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} La Grada TV · Todos los derechos reservados.</p>
      </footer>

      {/* ══════ STYLES ══════ */}
      <style>{`
        /* Page */
        .home-page { opacity: 0; transition: opacity 0.6s ease; }
        .home-mounted { opacity: 1; }
        .home-section { padding-bottom: 4rem; }

        /* ── Hero ── */
        .hero-section {
          position: relative; text-align: center;
          padding: 7.5rem 1.5rem 4.5rem;
          overflow: hidden; isolation: isolate;
        }
        .hero-grid-bg {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.045) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
        }
        .hero-glow { position:absolute; width:650px; height:650px; border-radius:50%; filter:blur(130px); z-index:0; pointer-events:none; }
        .hero-glow-l { top:-220px; left:-180px;  background:rgba(59,130,246,0.13); }
        .hero-glow-r { top:-120px; right:-200px; background:rgba(99,102,241,0.1); }
        .hero-inner { position:relative; z-index:1; max-width:700px; margin:0 auto; }

        .hero-live-pill {
          display:inline-flex; align-items:center; gap:0.4rem;
          background:rgba(225,29,72,0.1); border:1px solid rgba(225,29,72,0.25);
          color:#fb7185; font-size:0.75rem; font-weight:700;
          padding:0.3rem 0.9rem; border-radius:var(--radius-full); margin-bottom:1.25rem;
        }
        .hero-eyebrow {
          font-size:0.8rem; font-weight:700; letter-spacing:2px;
          text-transform:uppercase; color:var(--accent); margin-bottom:0.9rem;
        }
        .hero-title {
          font-size:clamp(2.2rem,5.5vw,4rem); font-weight:900;
          line-height:1.07; letter-spacing:-0.04em; margin-bottom:1.25rem;
          color:var(--text-primary);
        }
        .hero-shimmer {
          background:linear-gradient(135deg,#60a5fa 0%,#a78bfa 45%,#34d399 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; background-size:200% auto;
          animation:shimmerMove 4s linear infinite;
        }
        @keyframes shimmerMove { 0%{background-position:0% center} 100%{background-position:200% center} }

        .hero-subtitle {
          font-size:1.05rem; color:var(--text-secondary);
          line-height:1.75; max-width:520px; margin:0 auto 2.25rem;
        }
        .hero-ctas { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; margin-bottom:2.75rem; }
        .hero-cta-main { padding:0.85rem 2.25rem; font-size:1rem; }
        .hero-cta-sec  { padding:0.85rem 1.75rem; font-size:1rem; }

        .hero-stats-strip {
          display:inline-flex; align-items:center;
          background:var(--bg-darker); border:1px solid var(--border-glass);
          border-radius:var(--radius-full); padding:0.55rem 1.75rem;
          flex-wrap:wrap; justify-content:center; row-gap:0.4rem;
        }
        .hero-stat { text-align:center; padding:0 1.1rem; }
        .hero-stat-n { display:block; font-size:1.55rem; font-weight:900; font-family:'Outfit',sans-serif; line-height:1; letter-spacing:-0.03em; color:var(--text-primary); }
        .hero-stat-l { font-size:0.68rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
        .hero-stat-div { width:1px; height:32px; background:var(--border-glass); flex-shrink:0; }

        /* ── Live dot ── */
        .live-dot-sm {
          width:8px; height:8px; border-radius:50%; background:#e11d48; flex-shrink:0;
          animation:livePulse 2s ease infinite;
        }
        @keyframes livePulse {
          0%,100%{box-shadow:0 0 0 0 rgba(225,29,72,.6);}
          50%{box-shadow:0 0 0 7px rgba(225,29,72,0);}
        }

        /* ══ STICKY SECTION NAV ══ */
        .sec-nav-wrap {
          position:sticky; top:58px; z-index:500;
          background:rgba(10,10,15,0.82); backdrop-filter:blur(18px);
          -webkit-backdrop-filter:blur(18px);
          border-bottom:1px solid rgba(255,255,255,0.06);
          padding:0 2rem;
        }
        .sec-nav {
          max-width:1200px; margin:0 auto;
          display:flex; gap:0.15rem; overflow-x:auto;
          scrollbar-width:none; padding:0.5rem 0;
        }
        .sec-nav::-webkit-scrollbar { display:none; }
        .sec-nav-btn {
          flex-shrink:0; padding:0.4rem 1rem;
          border-radius:var(--radius-full); font-size:0.82rem; font-weight:600;
          background:none; border:1px solid transparent; color:var(--text-muted);
          cursor:pointer; transition:all 0.2s; white-space:nowrap;
        }
        .sec-nav-btn:hover { color:var(--text-primary); background:rgba(255,255,255,0.05); }
        .sec-nav-btn-active {
          color:#93c5fd !important; background:rgba(59,130,246,0.12) !important;
          border-color:rgba(59,130,246,0.25) !important;
        }

        /* ══ SECTION HEADER ══ */
        .sec-header { margin-bottom:1.5rem; scroll-margin-top:110px; }
        .sec-icon-box {
          width:34px; height:34px; border-radius:var(--radius-sm);
          background:var(--bg-darker); border:1px solid var(--border-glass);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .sec-sub { margin-top:0.3rem; font-size:0.82rem; color:var(--text-muted); padding-left:3.1rem; }
        .sec-line { height:1px; background:linear-gradient(90deg,rgba(59,130,246,0.4) 0%,transparent 55%); margin-top:0.85rem; }

        .see-all-link {
          display:inline-flex; align-items:center; gap:0.25rem;
          color:var(--accent); font-size:0.82rem; font-weight:600;
          margin-left:0.75rem; transition:opacity 0.2s, gap 0.2s;
        }
        .see-all-link:hover { opacity:0.7; gap:0.45rem; }

        /* ══ HORIZONTAL SCROLL ══ */
        .hscroll-wrap {
          position:relative;
        }
        .hscroll-rail {
          display:flex; gap:1.25rem; overflow-x:auto;
          scroll-snap-type:x mandatory; scrollbar-width:none;
          padding-bottom:0.5rem;
        }
        .hscroll-rail::-webkit-scrollbar { display:none; }

        .hscroll-item {
          flex-shrink:0; width:260px; scroll-snap-align:start;
          transition:transform 0.3s;
        }
        .hscroll-item:hover { transform:translateY(-4px); }
        .hscroll-item-wide { width:310px; }

        .hscroll-btn {
          position:absolute; top:50%; transform:translateY(-50%);
          z-index:10; width:38px; height:38px; border-radius:50%;
          background:rgba(10,10,15,0.9); border:1px solid var(--border-strong);
          color:var(--text-primary); cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:all 0.2s; backdrop-filter:blur(8px);
        }
        .hscroll-btn:hover { background:var(--blue); border-color:var(--blue); }
        .hscroll-btn-l { left:-18px; }
        .hscroll-btn-r { right:-18px; }

        /* ══ MATCH LIST ══ */
        .match-list { display:flex; flex-direction:column; gap:0.5rem; }
        .match-row {
          display:flex; align-items:center; gap:1rem;
          padding:0.9rem 1.1rem; border-radius:var(--radius-md);
          text-decoration:none; color:inherit; position:relative; overflow:hidden;
          flex-wrap:wrap; transition:background 0.2s, transform 0.2s, border-color 0.2s;
        }
        .match-row:hover { background:rgba(59,130,246,0.05); border-color:rgba(59,130,246,0.3); transform:translateX(4px); }
        .match-today-tag {
          position:absolute; top:0; right:0;
          background:#e11d48; color:#fff; font-size:0.6rem; font-weight:800;
          letter-spacing:1px; padding:0.18rem 0.55rem; border-bottom-left-radius:6px;
        }
        .match-league { display:flex; align-items:center; gap:0.3rem; font-size:0.7rem; font-weight:700; color:var(--accent); text-transform:uppercase; letter-spacing:0.8px; min-width:120px; flex-shrink:0; }
        .match-teams  { display:flex; align-items:center; gap:0.7rem; flex:1; font-weight:700; font-size:0.93rem; flex-wrap:wrap; }
        .match-vs     { color:var(--text-muted); font-size:0.72rem; flex-shrink:0; }
        .match-meta   { display:flex; gap:0.9rem; font-size:0.76rem; color:var(--text-muted); flex-wrap:wrap; align-items:center; }
        .match-meta span { display:flex; align-items:center; gap:0.25rem; }
        .match-arrow  { color:var(--border-strong); flex-shrink:0; transition:color 0.2s; }
        .match-row:hover .match-arrow { color:var(--accent); }

        /* ══ ALBUMS ══ */
        .album-card { cursor:pointer; overflow:hidden; border-radius:var(--radius-md); background:var(--bg-card); border:1px solid var(--border-glass); }
        .album-thumb { position:relative; width:100%; aspect-ratio:16/9; overflow:hidden; }
        .album-thumb img { width:100%; height:100%; object-fit:cover; transition:transform 0.55s ease; }
        .album-card:hover .album-thumb img { transform:scale(1.07); }
        .album-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 55%); }
        .album-play-icon { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:#fff; opacity:0; transition:opacity 0.3s; }
        .album-card:hover .album-play-icon { opacity:1; }
        .album-info { padding:1rem; }
        .album-title { font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:0.2rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .album-date  { font-size:0.75rem; color:var(--text-muted); }

        /* ══ CANCHAS ══ */
        .canchas-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:1rem; }
        .cancha-card { display:flex; align-items:center; gap:1rem; padding:1.1rem; position:relative; overflow:hidden; }
        .cancha-rank { font-size:2rem; font-weight:900; color:var(--border-glass); font-family:'Outfit',sans-serif; line-height:1; flex-shrink:0; }
        .cancha-name { font-weight:700; font-size:0.95rem; margin-bottom:0.15rem; }
        .cancha-count { font-size:0.78rem; color:var(--text-muted); }
        .cancha-map-link { display:inline-flex; align-items:center; gap:0.25rem; margin-top:0.4rem; font-size:0.75rem; color:var(--accent); }
        .cancha-bar-wrap { position:absolute; bottom:0; left:0; right:0; height:3px; background:var(--border-glass); }
        .cancha-bar { height:100%; background:linear-gradient(90deg,#3b82f6,#34d399); border-radius:0 2px 2px 0; transition:width 0.8s ease; }

        /* ══ EMPTY STATE ══ */
        .empty-state { padding:2.5rem 2rem; text-align:center; background:var(--bg-darker); border-radius:var(--radius-md); border:1px dashed var(--border-glass); }
        .empty-emoji { font-size:2.2rem; display:block; margin-bottom:0.6rem; }
        .empty-title { font-weight:600; font-size:0.95rem; margin-bottom:0.25rem; }
        .empty-text  { font-size:0.85rem; color:var(--text-muted); }

        /* ══ FOOTER ══ */
        .home-footer { padding:3.5rem 1rem 2.5rem; display:flex; flex-direction:column; align-items:center; gap:1.25rem; border-top:1px solid var(--border-glass); margin-top:2rem; }
        .footer-brand { font-family:'Outfit',sans-serif; font-size:1.35rem; font-weight:800; color:var(--text-primary); letter-spacing:-0.02em; }
        .footer-sub { color:var(--text-muted); font-size:0.85rem; text-align:center; max-width:340px; }
        .footer-socials { display:flex; gap:1rem; }
        .footer-copy { font-size:0.78rem; color:var(--text-muted); }

        /* Social */
        .social-icon { display:flex; padding:0.75rem; border-radius:50%; background:var(--bg-darker); border:1px solid var(--border-glass); color:var(--text-secondary); transition:all 0.25s; }
        .social-icon:hover { background:linear-gradient(135deg,var(--blue),var(--indigo)); color:#fff; border-color:transparent; transform:translateY(-3px); }

        /* ══ MOBILE ══ */
        @media (max-width: 640px) {
          .hero-section { padding:5.5rem 1rem 3rem; }
          .hero-stats-strip { padding:0.55rem 1rem; }
          .hero-stat { padding:0 0.7rem; }
          .hero-stat-n { font-size:1.25rem; }
          .hero-stat-div { display:none; }
          .hero-cta-main, .hero-cta-sec { width:100%; justify-content:center; }
          .hscroll-btn { display:none; }
          .sec-nav-wrap { top:52px; padding:0 1rem; }
          .canchas-grid { grid-template-columns:1fr; }
          .match-league { min-width:unset; }
        }
      `}</style>
    </div>
  );
}
