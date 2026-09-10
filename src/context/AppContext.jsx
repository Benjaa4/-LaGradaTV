import { createContext, useState, useEffect, useContext, useCallback } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:3001/api` : 'http://localhost:3001/api');

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.removeItem('appTheme');
  }, []);

  const [tournaments, setTournaments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [locations, setLocations] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMatchModal, setActiveMatchModal] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('appFavorites');
      return saved ? JSON.parse(saved) : { teams: [], tournaments: [] };
    } catch {
      return { teams: [], tournaments: [] };
    }
  });

  const toggleFavoriteTeam = (teamName) => {
    if (!teamName) return;
    setFavorites(prev => {
      const exists = prev.teams.includes(teamName);
      const nextTeams = exists ? prev.teams.filter(t => t !== teamName) : [...prev.teams, teamName];
      const next = { ...prev, teams: nextTeams };
      localStorage.setItem('appFavorites', JSON.stringify(next));
      return next;
    });
  };

  const toggleFavoriteTournament = (tournamentId) => {
    if (!tournamentId) return;
    setFavorites(prev => {
      const exists = prev.tournaments.includes(tournamentId);
      const nextTournaments = exists ? prev.tournaments.filter(id => id !== tournamentId) : [...prev.tournaments, tournamentId];
      const next = { ...prev, tournaments: nextTournaments };
      localStorage.setItem('appFavorites', JSON.stringify(next));
      return next;
    });
  };

  const isFavoriteTeam = (teamName) => favorites.teams.includes(teamName);
  const isFavoriteTournament = (tournamentId) => favorites.tournaments.includes(tournamentId);

  const openSearchModal = () => setSearchModalOpen(true);
  const closeSearchModal = () => setSearchModalOpen(false);

  const openMatchModal = (match) => {
    setActiveMatchModal(match);
  };

  const closeMatchModal = () => {
    setActiveMatchModal(null);
  };

  const logout = useCallback(() => {
    setIsAdmin(false);
    localStorage.removeItem('adminToken');
  }, []);

  // Helper autenticado para realizar llamadas a rutas protegidas
  const authFetch = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem('adminToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    const res = await fetch(url, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
      logout();
      throw new Error('Sesión expirada o no autorizada');
    }
    return res;
  }, [logout]);

  // Load public data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [tournamentsRes, videosRes, albumsRes, locationsRes, matchesRes] = await Promise.all([
        fetch(`${API_URL}/tournaments`),
        fetch(`${API_URL}/videos`),
        fetch(`${API_URL}/albums`),
        fetch(`${API_URL}/locations`),
        fetch(`${API_URL}/matches`)
      ]);
      
      const tournamentsData = await tournamentsRes.json();
      const videosData = await videosRes.json();
      const albumsData = await albumsRes.json();
      const locationsData = await locationsRes.json();
      const matchesData = await matchesRes.json();
      
      setTournaments(tournamentsData);
      setVideos(videosData);
      setAlbums(albumsData);
      setLocations(locationsData);
      setMatches(matchesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Verificar validez del token en el backend al inicializar
  useEffect(() => {
    fetchData();

    const verifyExistingToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAdmin(false);
        setAuthChecking(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/verify`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setIsAdmin(true);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setAuthChecking(false);
      }
    };

    verifyExistingToken();
  }, [logout]);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setIsAdmin(true);
        localStorage.setItem('adminToken', data.token);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateTeamStats = async (tournamentId, teamId, newStats) => {
    try {
      const res = await authFetch(`${API_URL}/tournaments/${tournamentId}/standings/${teamId}`, {
        method: 'PUT',
        body: JSON.stringify(newStats)
      });
      if (res.ok) {
        setTournaments(prev => prev.map(t => {
          if (t.id === tournamentId) {
            return {
              ...t,
              standings: t.standings.map(s => s.id === teamId ? { 
                ...s, 
                ...newStats,
                played: parseInt(newStats.played) || 0,
                won: parseInt(newStats.won) || 0,
                drawn: parseInt(newStats.drawn) || 0,
                lost: parseInt(newStats.lost) || 0,
                goalsFor: parseInt(newStats.goalsFor) || 0,
                goalsAgainst: parseInt(newStats.goalsAgainst) || 0,
                points: parseInt(newStats.points) || 0,
                fouls: parseInt(newStats.fouls) || 0,
                disqualified: !!newStats.disqualified
              } : s).sort((a, b) => b.points - a.points)
            };
          }
          return t;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addTeam = async (tournamentId, name, logo = '') => {
    try {
      const res = await authFetch(`${API_URL}/tournaments/${tournamentId}/standings`, {
        method: 'POST',
        body: JSON.stringify({ name, logo })
      });
      if (res.ok) {
        const newTeam = await res.json();
        setTournaments(prev => prev.map(t => {
          if (t.id === tournamentId) {
            return {
              ...t,
              standings: [...t.standings, newTeam]
            };
          }
          return t;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTeam = async (tournamentId, teamId) => {
    try {
      const res = await authFetch(`${API_URL}/tournaments/${tournamentId}/standings/${teamId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTournaments(prev => prev.map(t => {
          if (t.id === tournamentId) {
            return {
              ...t,
              standings: t.standings.filter(s => s.id !== teamId)
            };
          }
          return t;
        }));
        setMatches(prev => prev.filter(m => m.home_team_id !== teamId && m.away_team_id !== teamId));
      } else {
        const err = await res.json();
        alert('Error al eliminar equipo: ' + (err.error || 'Error desconocido'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addVideo = async (video) => {
    try {
      const res = await authFetch(`${API_URL}/videos`, {
        method: 'POST',
        body: JSON.stringify(video)
      });
      if (res.ok) {
        const newVideo = await res.json();
        setVideos(prev => [newVideo, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteVideo = async (id) => {
    try {
      const res = await authFetch(`${API_URL}/videos/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setVideos(prev => prev.filter(v => v.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addAlbum = async (album) => {
    try {
      const res = await authFetch(`${API_URL}/albums`, {
        method: 'POST',
        body: JSON.stringify(album)
      });
      if (res.ok) {
        const newAlbum = await res.json();
        setAlbums(prev => [newAlbum, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteAlbum = async (id) => {
    try {
      const res = await authFetch(`${API_URL}/albums/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setAlbums(prev => prev.filter(a => a.id !== id));
        setVideos(prev => prev.filter(v => v.album_id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addTournament = async (tournament) => {
    try {
      const res = await authFetch(`${API_URL}/tournaments`, {
        method: 'POST',
        body: JSON.stringify(tournament)
      });
      if (res.ok) {
        const newTournament = await res.json();
        setTournaments(prev => [...prev, newTournament]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const editTournament = async (id, data) => {
    try {
      const res = await authFetch(`${API_URL}/tournaments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setTournaments(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
        if (data.match_type) {
          setMatches(prev => prev.map(m => m.tournament_id === id ? { ...m, match_type: data.match_type } : m));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTournament = async (id) => {
    try {
      const res = await authFetch(`${API_URL}/tournaments/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTournaments(prev => prev.filter(t => t.id !== id));
        setMatches(prev => prev.filter(m => m.tournament_id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const editVideo = async (id, data) => {
    try {
      const res = await authFetch(`${API_URL}/videos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updatedVideo = await res.json();
        setVideos(prev => prev.map(v => v.id === id ? { ...v, ...updatedVideo } : v));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const editAlbum = async (id, data) => {
    try {
      const res = await authFetch(`${API_URL}/albums/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updatedAlbum = await res.json();
        setAlbums(prev => prev.map(a => a.id === id ? { ...a, ...updatedAlbum } : a));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addLocation = async (location) => {
    try {
      const res = await authFetch(`${API_URL}/locations`, {
        method: 'POST',
        body: JSON.stringify(location)
      });
      if (res.ok) {
        const newLocation = await res.json();
        setLocations(prev => [...prev, newLocation].sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const editLocation = async (id, data) => {
    try {
      const res = await authFetch(`${API_URL}/locations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setLocations(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteLocation = async (id) => {
    try {
      const res = await authFetch(`${API_URL}/locations/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setLocations(prev => prev.filter(l => l.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addMatch = async (match) => {
    try {
      const res = await authFetch(`${API_URL}/matches`, {
        method: 'POST',
        body: JSON.stringify(match)
      });
      if (res.ok) {
        const newMatch = await res.json();
        setMatches(prev => [newMatch, ...prev].sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const editMatch = async (id, data) => {
    try {
      const res = await authFetch(`${API_URL}/matches/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setMatches(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
        
        // --- Auto Progression Logic ---
        if (data.status === 'played' && data.round && data.round !== 'final') {
          let winnerId = null;
          const tournament = tournaments.find(t => t.id === data.tournament_id);
          const homeTeam = tournament?.standings?.find(s => s.id === data.home_team_id);
          const awayTeam  = tournament?.standings?.find(s => s.id === data.away_team_id);

          if (homeTeam?.disqualified && !awayTeam?.disqualified) {
            winnerId = data.away_team_id;
          } else if (awayTeam?.disqualified && !homeTeam?.disqualified) {
            winnerId = data.home_team_id;
          } else if (data.home_score > data.away_score) {
            winnerId = data.home_team_id;
          } else if (data.away_score > data.home_score) {
            winnerId = data.away_team_id;
          } else {
            const hp = parseInt(data.home_penalties) || 0;
            const ap = parseInt(data.away_penalties) || 0;
            if (hp > ap) winnerId = data.home_team_id;
            else if (ap > hp) winnerId = data.away_team_id;
          }

          if (winnerId) {
            const nextRoundMap = { 'round_of_16': 'quarterfinal', 'quarterfinal': 'semifinal', 'semifinal': 'final' };
            const nextRound = nextRoundMap[data.round];
            const nextOrder = Math.floor((data.match_order || 0) / 2);
            const isHomeSlot = (data.match_order || 0) % 2 === 0;

            const nextMatch = matches.find(m => m.tournament_id === data.tournament_id && m.round === nextRound && m.match_order === nextOrder);
            if (nextMatch) {
              const updatedNextData = { ...nextMatch };
              if (isHomeSlot) updatedNextData.home_team_id = winnerId;
              else updatedNextData.away_team_id = winnerId;

              // Actualización autenticada del siguiente partido
              authFetch(`${API_URL}/matches/${nextMatch.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedNextData)
              }).then(r => {
                if (r.ok) {
                  setMatches(prev => prev.map(m => m.id === nextMatch.id ? updatedNextData : m));
                }
              }).catch(err => console.error("Error en progresión de bracket:", err));
            }
          }
        }
        // ------------------------------
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMatch = async (id) => {
    try {
      const res = await authFetch(`${API_URL}/matches/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMatches(prev => prev.filter(m => m.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateBracket = async (tournamentId) => {
    try {
      const res = await authFetch(`${API_URL}/tournaments/${tournamentId}/generate-bracket`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setMatches(prev => [...data.matches, ...prev]);
        return true;
      } else {
        const err = await res.json();
        alert(err.error || 'Error al generar el bracket');
        return false;
      }
    } catch(e) {
      console.error(e);
      return false;
    }
  };

  const updateMatchLineups = async (matchId, { match_type, lineups }) => {
    const lineupsStr = typeof lineups === 'string' ? lineups : JSON.stringify(lineups);
    try {
      const res = await fetch(`${API_URL}/matches/${matchId}/lineups`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('adminToken') ? { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` } : {})
        },
        body: JSON.stringify({ match_type, lineups: lineupsStr })
      });
      if (res.ok) {
        const data = await res.json();
        setMatches(prev => prev.map(m => m.id === matchId ? { 
          ...m, 
          match_type: data.match_type || match_type, 
          lineups: data.lineups || lineupsStr
        } : m));
        return true;
      }
    } catch (e) {
      console.warn('Backend update failed, saving locally in state:', e);
    }

    // Fallback in-memory update
    setMatches(prev => prev.map(m => m.id === matchId ? { 
      ...m, 
      match_type, 
      lineups: lineupsStr
    } : m));
    return true;
  };

  return (
    <AppContext.Provider value={{
      isAdmin, authChecking, login, logout,
      favorites, toggleFavoriteTeam, toggleFavoriteTournament, isFavoriteTeam, isFavoriteTournament,
      searchModalOpen, openSearchModal, closeSearchModal,
      tournaments, addTournament, editTournament, deleteTournament, updateTeamStats, addTeam, deleteTeam,
      videos, addVideo, editVideo, deleteVideo,
      albums, addAlbum, editAlbum, deleteAlbum,
      locations, addLocation, editLocation, deleteLocation,
      matches, addMatch, editMatch, deleteMatch, generateBracket, updateMatchLineups,
      activeMatchModal, openMatchModal, closeMatchModal,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};
