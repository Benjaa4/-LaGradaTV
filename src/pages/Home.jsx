import { useAppContext } from '../context/AppContext';
import TournamentCard from '../components/TournamentCard';
import VideoPlayer from '../components/VideoPlayer';
import { Mail, Info, Trophy, PlayCircle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { tournaments, videos, albums } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter and sort data
  const liveVideos = videos.filter(v => v.type === 'live');
  const popularVideos = [...videos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);
  const featuredTournaments = tournaments.slice(0, 3); // top 3 for featured
  const topAlbums = albums.slice(0, 6); // show up to 6 albums

  return (
    <div className={`transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

      {/* Videos en Vivo (Top priority if there are any) */}
      {liveVideos.length > 0 && (
        <section className="animate-slide-up" style={{ padding: '4rem 2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#e11d48', animation: 'pulse 2s infinite' }}></div>
            <h2 className="section-title" style={{ margin: 0, color: 'var(--text-primary)' }}>Transmisiones en Vivo</h2>
          </div>
          <div className="grid-container">
            {liveVideos.map(video => (
              <div key={video.id} className="hover-lift transition-all">
                <VideoPlayer video={video} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Álbumes / Categorías de Videos */}
      <section className="animate-slide-up" style={{ padding: liveVideos.length > 0 ? '1rem 2rem' : '4rem 2rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <PlayCircle size={32} color="var(--primary)" />
          <h1 className="page-title" style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-primary)' }}>Álbumes Destacados</h1>
        </div>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          Revive los mejores momentos, partidos completos y resúmenes de todas nuestras ligas.
        </p>
        
        {topAlbums.length > 0 ? (
          <div className="grid-container">
            {topAlbums.map(album => (
              <div 
                key={album.id} 
                className="hover-lift transition-all"
                style={{ 
                  background: 'var(--bg-dark)', 
                  borderRadius: 'var(--radius-lg)', 
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid var(--border-glass)'
                }}
                onClick={() => navigate(`/album/${album.id}`)}
              >
                <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img 
                    src={album.thumbnail || 'https://images.unsplash.com/photo-1518605368461-1ee125b29b46?q=80&w=600&auto=format&fit=crop'} 
                    alt={album.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{album.title}</h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>Creado el {album.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-dark)', borderRadius: 'var(--radius-md)' }}>
            <p className="text-muted">Aún no hay álbumes disponibles.</p>
          </div>
        )}
      </section>

      {/* Torneos Destacados (Moved Down) */}
      <section className="animate-slide-up" style={{ animationDelay: '0.2s', padding: '2rem 2rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Trophy size={28} color="var(--primary)" />
          <h2 className="section-title" style={{ margin: 0, color: 'var(--text-primary)' }}>Tablas y Estadísticas</h2>
        </div>
        <div className="grid-container">
          {featuredTournaments.map(tournament => (
            <div key={tournament.id} className="hover-lift transition-all">
              <TournamentCard tournament={tournament} />
            </div>
          ))}
        </div>
      </section>

      {/* Videos Más Vistos */}
      {popularVideos.length > 0 && (
        <section className="animate-slide-up" style={{ animationDelay: '0.2s', padding: '3rem 2rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <PlayCircle size={28} color="var(--primary)" />
            <h2 className="section-title" style={{ margin: 0, color: 'var(--text-primary)' }}>Videos Más Vistos</h2>
          </div>
          <div className="grid-container">
            {popularVideos.map(video => (
              <div key={video.id} className="hover-lift transition-all">
                <VideoPlayer video={video} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quiénes Somos / Info */}
      <section className="animate-slide-up" style={{ animationDelay: '0.3s', padding: '4rem 2rem', marginBottom: '4rem', textAlign: 'center' }}>
        <Star size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem', animation: 'spin-slow 10s linear infinite' }} />
        <h2 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Sobre Nosotros</h2>
        <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          Somos la plataforma líder en gestión y difusión de torneos locales. Nuestro objetivo es conectar a los jugadores, equipos y aficionados, brindando una experiencia profesional y unificada para seguir de cerca cada partido, estadística y emoción de las ligas de nuestra comunidad.
        </p>
      </section>

      {/* Footer / Redes Sociales */}
      <footer className="animate-fade-in" style={{ animationDelay: '0.5s', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="https://www.instagram.com/ariza.benja/" className="social-icon" aria-label="Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
          </a>
          <a href="#" className="social-icon" aria-label="Twitter">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
          </a>
          <a href="#" className="social-icon" aria-label="Facebook">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
          </a>
          <a href="#" className="social-icon" aria-label="Email">
            <Mail size={24} />
          </a>
        </div>
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>
          © {new Date().getFullYear()} Torneos Locales. Todos los derechos reservados.
        </p>
      </footer>

      <style>{`
        .opacity-0 { opacity: 0; }
        .opacity-100 { opacity: 1; }
        .transition-opacity { transition-property: opacity; }
        .duration-1000 { transition-duration: 1s; }
        
        .hover-lift {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
        }
        
        .social-icon {
          display: flex;
          padding: 1rem;
          border-radius: 50%;
          background: var(--bg-darker);
          color: var(--text-secondary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .social-icon:hover {
          background: var(--primary);
          color: #f8fafc;
          transform: translateY(-5px) rotate(8deg);
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.7); }
          70% { box-shadow: 0 0 0 12px rgba(225, 29, 72, 0); }
          100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
