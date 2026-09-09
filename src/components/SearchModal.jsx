import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Trophy, Swords, Video, Folder, MapPin, ChevronRight, Star, Clock, Radio, SearchX } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function SearchModal() {
  const { 
    searchModalOpen, closeSearchModal,
    tournaments, matches, videos, albums, locations,
    openMatchModal, isFavoriteTeam, toggleFavoriteTeam
  } = useAppContext();

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchModalOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [searchModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchModalOpen) closeSearchModal();
      }
      if (e.key === 'Escape' && searchModalOpen) {
        closeSearchModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, closeSearchModal]);

  if (!searchModalOpen) return null;

  const q = query.trim().toLowerCase();

  // Search Results
  const matchingTournaments = q 
    ? tournaments.filter(t => t.name.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))).slice(0, 4)
    : [];

  // Find teams across all tournaments
  const matchingTeams = [];
  if (q) {
    const teamSet = new Set();
    tournaments.forEach(t => {
      (t.standings || []).forEach(team => {
        if (team.name.toLowerCase().includes(q) && !teamSet.has(team.name)) {
          teamSet.add(team.name);
          matchingTeams.push({ team, tournament: t });
        }
      });
    });
  }

  // Matches matching team names or date
  const matchingMatches = q
    ? matches.filter(m => {
        const tour = tournaments.find(t => t.id === m.tournament_id);
        const ht = tour?.standings?.find(s => s.id === m.home_team_id);
        const at = tour?.standings?.find(s => s.id === m.away_team_id);
        return (
          ht?.name.toLowerCase().includes(q) ||
          at?.name.toLowerCase().includes(q) ||
          m.date.includes(q)
        );
      }).slice(0, 4)
    : [];

  // Videos and Albums
  const matchingAlbums = q
    ? albums.filter(a => a.title.toLowerCase().includes(q)).slice(0, 3)
    : [];
  const matchingVideos = q
    ? videos.filter(v => v.title.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const totalResults = matchingTournaments.length + matchingTeams.slice(0, 4).length + matchingMatches.length + matchingAlbums.length + matchingVideos.length;

  const handleSelectTournament = (id) => {
    closeSearchModal();
    navigate(`/torneo/${id}`);
  };

  const handleSelectMatch = (match) => {
    closeSearchModal();
    openMatchModal(match);
  };

  const handleSelectAlbum = (id) => {
    closeSearchModal();
    navigate(`/album/${id}`);
  };

  const handleSelectVideo = (id) => {
    closeSearchModal();
    navigate(`/video/${id}`);
  };

  return (
    <div className="modal-overlay" onClick={closeSearchModal} style={{ zIndex: 10001, alignItems: 'flex-start', paddingTop: '4.5rem' }}>
      <div 
        className="modal-content animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', width: '100%', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}
      >
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--nm-border)' }}>
          <Search size={20} color="var(--primary)" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Buscar torneos, equipos, partidos, videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.05rem',
              fontFamily: 'inherit'
            }}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <X size={18} />
            </button>
          )}
          <button 
            onClick={closeSearchModal}
            className="btn btn-glass"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
          >
            Esc
          </button>
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0.85rem 1rem' }}>
          {!q && (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Escribe el nombre de un equipo, torneo o fecha.</p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                <span className="search-hint-chip" onClick={() => setQuery('Liga')}>Liga</span>
                <span className="search-hint-chip" onClick={() => setQuery('Final')}>Final</span>
                <span className="search-hint-chip" onClick={() => setQuery('En Vivo')}>En Vivo</span>
              </div>
            </div>
          )}

          {q && totalResults === 0 && (
            <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                <SearchX size={36} />
              </div>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No se encontraron resultados</p>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Prueba con otro término de búsqueda.</p>
            </div>
          )}

          {/* Torneos */}
          {matchingTournaments.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="search-cat-title"><Trophy size={13} /> Torneos</div>
              {matchingTournaments.map(t => (
                <div key={t.id} className="search-result-item" onClick={() => handleSelectTournament(t.id)}>
                  <div className="search-res-icon"><Trophy size={16} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {t.type === 'knockout' ? 'Eliminatoria' : 'Liga'} · {t.standings?.length || 0} equipos
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}

          {/* Equipos */}
          {matchingTeams.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="search-cat-title"><Star size={13} /> Equipos</div>
              {matchingTeams.slice(0, 4).map(({ team, tournament }) => {
                const isFav = isFavoriteTeam(team.name);
                return (
                  <div key={team.name} className="search-result-item" onClick={() => handleSelectTournament(tournament.id)}>
                    <div className="search-res-icon" style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                      {team.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>{team.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Participa en {tournament.name} · {team.points ?? 0} pts
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteTeam(team.name);
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem', color: isFav ? 'var(--amber)' : 'var(--text-muted)' }}
                      title={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    >
                      <Star size={16} fill={isFav ? 'var(--amber)' : 'none'} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Partidos */}
          {matchingMatches.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="search-cat-title"><Swords size={13} /> Partidos</div>
              {matchingMatches.map(m => {
                const tour = tournaments.find(t => t.id === m.tournament_id);
                const ht = tour?.standings?.find(s => s.id === m.home_team_id);
                const at = tour?.standings?.find(s => s.id === m.away_team_id);
                return (
                  <div key={m.id} className="search-result-item" onClick={() => handleSelectMatch(m)}>
                    <div className="search-res-icon"><Swords size={16} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {ht?.name || 'Por definir'} <span style={{ color: 'var(--primary)', fontWeight: 400 }}>vs</span> {at?.name || 'Por definir'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={12} /> {m.date} · {m.time} {m.status === 'played' ? `(${m.home_score} - ${m.away_score})` : ''}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--bg-sunken)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                      {m.status === 'played' ? 'FINAL' : 'PROGRAMADO'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Videos & Álbumes */}
          {(matchingVideos.length > 0 || matchingAlbums.length > 0) && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div className="search-cat-title"><Video size={13} /> Multimedia & Álbumes</div>
              {matchingAlbums.map(a => (
                <div key={a.id} className="search-result-item" onClick={() => handleSelectAlbum(a.id)}>
                  <div className="search-res-icon"><Folder size={16} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{a.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Álbum · {a.date}</div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              ))}
              {matchingVideos.map(v => (
                <div key={v.id} className="search-result-item" onClick={() => handleSelectVideo(v.id)}>
                  <div className="search-res-icon"><Video size={16} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{v.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {v.type === 'live' ? (
                        <span style={{ color: 'var(--rose)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                          <Radio size={12} /> Transmisión En Vivo
                        </span>
                      ) : 'Video grabado'}
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .search-cat-title {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text-muted);
          margin-bottom: 0.45rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding-left: 0.35rem;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          background: var(--bg-card);
          border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-raised-sm);
          margin-bottom: 0.45rem;
          cursor: pointer;
          transition: transform 0.16s ease, box-shadow 0.16s ease;
          -webkit-tap-highlight-color: transparent !important;
        }
        .search-result-item:hover {
          transform: translateY(-1px);
          box-shadow: var(--nm-shadow-raised);
        }
        .search-result-item:active {
          transform: scale(0.98);
        }
        .search-res-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: var(--bg-sunken);
          box-shadow: var(--nm-shadow-inset-sm);
          border: 1px solid var(--nm-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }
        .search-hint-chip {
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          background: var(--bg-card);
          box-shadow: var(--nm-shadow-raised-sm);
          border: 1px solid var(--nm-border);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .search-hint-chip:hover {
          color: var(--primary);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
