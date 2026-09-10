import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { parseVideoUrl } from '../utils/videoUtils';
import { 
  ArrowLeft, 
  Tv, 
  Radio, 
  Calendar, 
  Share2, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Check, 
  Play, 
  Film,
  Layers
} from 'lucide-react';

export default function VideoView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { videos, albums, matches, tournaments } = useAppContext();
  const [video, setVideo] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [theaterMode, setTheaterMode] = useState(false);
  const [ambientGlow, setAmbientGlow] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const found = videos.find(v => v.id === id);
    if (found) {
      setVideo(found);
      setParsed(parseVideoUrl(found.url));
      return;
    }

    // Support match video playback directly on page
    const matchId = id.startsWith('match-') ? id.replace('match-', '') : id;
    const matchFound = matches.find(m => m.id === matchId);
    if (matchFound && matchFound.stream_url) {
      const tour = tournaments.find(t => t.id === matchFound.tournament_id);
      const homeTeam = tour?.standings?.find(s => s.id === matchFound.home_team_id);
      const awayTeam = tour?.standings?.find(s => s.id === matchFound.away_team_id);
      const hName = homeTeam?.name || 'Local';
      const aName = awayTeam?.name || 'Visitante';
      const tourName = tour?.name || 'Torneo';

      const syntheticVideo = {
        id: `match-${matchFound.id}`,
        title: `${hName} vs ${aName} · ${tourName}`,
        url: matchFound.stream_url,
        date: matchFound.date || 'Reciente',
        type: matchFound.status === 'live' ? 'live' : 'recording',
        match_id: matchFound.id,
        isMatchStream: true
      };
      setVideo(syntheticVideo);
      setParsed(parseVideoUrl(matchFound.stream_url));
    }
  }, [id, videos, matches, tournaments]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: video?.title ? `${video.title} - La Grada TV` : 'La Grada TV',
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const url = window.location.href;
    const text = `Mirá el partido "${video?.title || ''}" en La Grada TV:\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Other related videos
  const otherVideos = videos.filter(v => v.id !== id).slice(0, 4);
  const parentAlbum = albums.find(a => a.id === video?.album_id);

  if (!video || !parsed) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-sunken)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '1rem', border: '1px solid var(--nm-border)' }}>
          <Film size={28} />
        </div>
        <h2 className="page-title" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Video no encontrado</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>El video que buscas fue retirado o no está disponible.</p>
        <button className="btn btn-glass mt-4" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div 
      className="video-view-page animate-fade-in" 
      style={{ 
        maxWidth: theaterMode ? '1480px' : '1140px', 
        margin: '0 auto', 
        padding: '1.25rem 1rem 4rem',
        transition: 'max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* ── Top Navigation & Cinema Controls Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button 
          className="btn btn-glass" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.5rem 0.95rem' }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Ambient Glow Toggle */}
          <button
            type="button"
            className="btn btn-glass"
            style={{ 
              fontSize: '0.8rem', 
              padding: '0.45rem 0.8rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem',
              color: ambientGlow ? 'var(--primary-light)' : 'var(--text-muted)',
              borderColor: ambientGlow ? 'rgba(79, 109, 245, 0.35)' : 'var(--nm-border)'
            }}
            onClick={() => setAmbientGlow(!ambientGlow)}
            title="Activar/Desactivar iluminación ambiental"
          >
            <Sparkles size={14} /> 
            <span className="hide-mobile">Luz Ambiental</span>
          </button>

          {/* Theater Mode Toggle */}
          <button
            type="button"
            className="btn btn-glass"
            style={{ 
              fontSize: '0.8rem', 
              padding: '0.45rem 0.8rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem',
              color: theaterMode ? 'var(--primary-light)' : 'var(--text-secondary)'
            }}
            onClick={() => setTheaterMode(!theaterMode)}
            title={theaterMode ? 'Vista estándar' : 'Modo Teatro'}
          >
            {theaterMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span className="hide-mobile">{theaterMode ? 'Normal' : 'Teatro'}</span>
          </button>
        </div>
      </div>

      {/* ── Main Cinema Video Player Bezel ── */}
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        
        {/* Dynamic Stadium Ambient Glow Halo */}
        {ambientGlow && (
          <div 
            style={{ 
              position: 'absolute', 
              top: '-3%', 
              left: '-2%', 
              right: '-2%', 
              bottom: '-3%', 
              background: video.type === 'live'
                ? 'radial-gradient(ellipse at center, rgba(225, 29, 72, 0.28) 0%, rgba(79, 109, 245, 0.15) 50%, transparent 75%)'
                : 'radial-gradient(ellipse at center, rgba(79, 109, 245, 0.26) 0%, rgba(136, 84, 208, 0.18) 45%, transparent 75%)', 
              filter: 'blur(55px)', 
              opacity: 0.85, 
              zIndex: 0,
              pointerEvents: 'none',
              borderRadius: '24px',
              transition: 'all 0.5s ease'
            }}
          />
        )}

        {/* Outer Frame with Neumorphic Chamfer */}
        <div 
          style={{ 
            position: 'relative', 
            zIndex: 1, 
            padding: '8px', 
            background: 'linear-gradient(145deg, rgba(25, 27, 37, 0.95), rgba(12, 13, 18, 0.98))', 
            backdropFilter: 'blur(20px)', 
            WebkitBackdropFilter: 'blur(20px)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75), var(--nm-shadow-raised)'
          }}
        >
          {/* Top Status Bar inside Player Bezel */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0.4rem 0.85rem 0.6rem',
            fontSize: '0.74rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: video.type === 'live' ? '#e11d48' : '#34d399', display: 'inline-block' }}></span>
              <span style={{ fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                {video.type === 'live' ? 'Transmisión en directo' : 'Partido grabado'}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                <Tv size={13} /> 1080p HD
              </span>
              <span style={{ background: 'rgba(255, 255, 255, 0.07)', padding: '0.1rem 0.45rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                60 FPS
              </span>
            </div>
          </div>

          {/* Video 16:9 Stage */}
          <div 
            className="video-container" 
            style={{ 
              width: '100%', 
              aspectRatio: '16/9', 
              background: '#040507', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden',
              boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.95)',
              position: 'relative'
            }}
          >
            {parsed.embedUrl ? (
              <iframe 
                src={parsed.embedUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                title={video.title}
              ></iframe>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
                <Film size={40} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Enlace de transmisión externo</p>
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-primary mt-3"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <ExternalLink size={15} /> Abrir reproductor oficial
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Broadcast Metadata & Interactive Bar ── */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.75rem 2rem', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px solid var(--nm-border-strong)',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle accent bar on the left edge */}
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '4px', 
            height: '100%', 
            background: video.type === 'live' 
              ? 'linear-gradient(to bottom, #e11d48, #fb7185)' 
              : 'linear-gradient(to bottom, var(--primary), var(--purple))' 
          }} 
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          {/* Main Title & Tags */}
          <div style={{ flex: '1 1 500px' }}>
            
            {/* Tag Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              {video.type === 'live' ? (
                <span 
                  style={{ 
                    padding: '0.25rem 0.75rem', 
                    background: 'rgba(225, 29, 72, 0.16)', 
                    border: '1px solid rgba(225, 29, 72, 0.35)', 
                    color: '#f43f5e', 
                    borderRadius: '99px', 
                    fontSize: '0.74rem', 
                    fontWeight: 800, 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    letterSpacing: '0.8px' 
                  }}
                >
                  <span style={{ width: '7px', height: '7px', background: '#e11d48', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #e11d48' }}></span>
                  EN VIVO
                </span>
              ) : (
                <span 
                  style={{ 
                    padding: '0.25rem 0.75rem', 
                    background: 'rgba(79, 109, 245, 0.14)', 
                    border: '1px solid rgba(79, 109, 245, 0.3)', 
                    color: 'var(--primary-light)', 
                    borderRadius: '99px', 
                    fontSize: '0.74rem', 
                    fontWeight: 800, 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.4rem' 
                  }}
                >
                  <Radio size={13} /> TRANSMISIÓN GRABADA
                </span>
              )}

              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-sunken)', padding: '0.25rem 0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--nm-border)' }}>
                <Calendar size={13} color="var(--blue-light)" /> {video.date || 'Fecha no especificada'}
              </span>

              {parentAlbum && (
                <Link 
                  to={`/album/${parentAlbum.id}`}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.35rem', 
                    fontSize: '0.8rem', 
                    color: 'var(--teal-light)', 
                    background: 'rgba(20, 184, 166, 0.12)', 
                    padding: '0.25rem 0.7rem', 
                    borderRadius: 'var(--radius-sm)', 
                    border: '1px solid rgba(20, 184, 166, 0.25)',
                    fontWeight: 700
                  }}
                >
                  <Layers size={13} /> {parentAlbum.title}
                </Link>
              )}
            </div>

            {/* Video Headline */}
            <h1 
              style={{ 
                margin: 0, 
                fontSize: '2rem', 
                fontWeight: 900, 
                lineHeight: 1.25, 
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em'
              }}
            >
              {video.title}
            </h1>
          </div>

          {/* Actions: WhatsApp & Share & External Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            
            <button
              type="button"
              className="btn btn-whatsapp"
              onClick={handleShareWhatsApp}
              style={{ padding: '0.65rem 1.15rem', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <Share2 size={15} /> Compartir
            </button>

            <button
              type="button"
              className="btn btn-glass"
              onClick={handleShare}
              style={{ padding: '0.65rem 1rem', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              title="Copiar enlace"
            >
              {copied ? <Check size={15} color="#34d399" /> : <Share2 size={15} />}
              <span>{copied ? '¡Copiado!' : 'Copiar link'}</span>
            </button>

          </div>
        </div>
      </div>

      {/* ── More Broadcasts / Related Videos Section ── */}
      {otherVideos.length > 0 && (
        <section className="related-videos-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(79, 109, 245, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
                <Film size={16} />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Más Transmisiones y Partidos
              </h2>
            </div>
            
            <Link 
              to="/albumes" 
              style={{ fontSize: '0.82rem', color: 'var(--primary-light)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              Ver todas <ExternalLink size={13} />
            </Link>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
            gap: '1.25rem' 
          }}>
            {otherVideos.map((item) => (
              <Link
                key={item.id}
                to={`/video/${item.id}`}
                className="glass-panel"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.22s ease',
                  border: '1px solid var(--nm-border)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--nm-shadow-raised-hover)';
                  e.currentTarget.style.borderColor = 'rgba(79, 109, 245, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--nm-shadow-raised-sm)';
                  e.currentTarget.style.borderColor = 'var(--nm-border)';
                }}
              >
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: 'var(--bg-darker)', overflow: 'hidden' }}>
                  {item.thumbnail ? (
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <Tv size={32} />
                    </div>
                  )}

                  {/* Play badge overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(79, 109, 245, 0.88)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={18} fill="currentColor" />
                    </div>
                  </div>

                  {item.type === 'live' && (
                    <span style={{ position: 'absolute', top: '0.6rem', left: '0.6rem', background: '#e11d48', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 800 }}>
                      EN VIVO
                    </span>
                  )}
                </div>

                <div style={{ padding: '0.9rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.title}
                  </h4>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{item.date}</span>
                    <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>Ver partido</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Responsive mobile helper styles */}
      <style>{`
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
