import { createContext, useState, useEffect, useContext } from 'react';
import { initialTournaments, initialVideos } from '../data/mockData';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [tournaments, setTournaments] = useState(() => {
    const saved = localStorage.getItem('tournaments');
    return saved ? JSON.parse(saved) : initialTournaments;
  });
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('videos');
    return saved ? JSON.parse(saved) : initialVideos;
  });

  useEffect(() => {
    localStorage.setItem('tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('videos', JSON.stringify(videos));
  }, [videos]);

  const login = (username, password) => {
    // Simulando login
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const updateTeamPoints = (tournamentId, teamId, points) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return {
          ...t,
          standings: t.standings.map(s => s.id === teamId ? { ...s, points: parseInt(points) } : s)
            .sort((a, b) => b.points - a.points)
        };
      }
      return t;
    }));
  };

  const addVideo = (video) => {
    setVideos(prev => [{ ...video, id: 'v' + Date.now() }, ...prev]);
  };

  const deleteVideo = (id) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  return (
    <AppContext.Provider value={{
      isAdmin, login, logout,
      tournaments, updateTeamPoints,
      videos, addVideo, deleteVideo
    }}>
      {children}
    </AppContext.Provider>
  );
};
