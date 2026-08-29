import { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [locations, setLocations] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from backend
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

  useEffect(() => {
    fetchData();
    // Check if there is a token in localstorage
    if (localStorage.getItem('adminToken')) {
      setIsAdmin(true);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
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

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminToken');
  };

  const updateTeamStats = async (tournamentId, teamId, newStats) => {
    try {
      const res = await fetch(`${API_URL}/tournaments/${tournamentId}/standings/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStats)
      });
      if (res.ok) {
        // Update local state to avoid refetching everything
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

  const addTeam = async (tournamentId, name) => {
    try {
      const res = await fetch(`${API_URL}/tournaments/${tournamentId}/standings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
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
      const res = await fetch(`${API_URL}/tournaments/${tournamentId}/standings/${teamId}`, {
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addVideo = async (video) => {
    try {
      const res = await fetch(`${API_URL}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${API_URL}/videos/${id}`, {
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
      const res = await fetch(`${API_URL}/albums`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${API_URL}/albums/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setAlbums(prev => prev.filter(a => a.id !== id));
        // Note: In a real app we might want to update the videos that belonged to this album too
      }
    } catch (e) {
      console.error(e);
    }
  };
  const addTournament = async (tournament) => {
    try {
      const res = await fetch(`${API_URL}/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${API_URL}/tournaments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setTournaments(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTournament = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tournaments/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTournaments(prev => prev.filter(t => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const editVideo = async (id, data) => {
    try {
      const res = await fetch(`${API_URL}/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${API_URL}/albums/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${API_URL}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${API_URL}/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${API_URL}/locations/${id}`, {
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
      const res = await fetch(`${API_URL}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${API_URL}/matches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setMatches(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMatch = async (id) => {
    try {
      const res = await fetch(`${API_URL}/matches/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMatches(prev => prev.filter(m => m.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppContext.Provider value={{
      isAdmin, login, logout,
      tournaments, addTournament, editTournament, deleteTournament, updateTeamStats, addTeam, deleteTeam,
      videos, addVideo, editVideo, deleteVideo,
      albums, addAlbum, editAlbum, deleteAlbum,
      locations, addLocation, editLocation, deleteLocation,
      matches, addMatch, editMatch, deleteMatch,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};
