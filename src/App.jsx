import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TournamentDetails from './pages/TournamentDetails';
import Tournaments from './pages/Tournaments';
import Albums from './pages/Albums';
import Login from './pages/Login';
import Admin from './pages/Admin';
import VideoView from './pages/VideoView';
import AlbumView from './pages/AlbumView';
import MatchView from './pages/MatchView';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/torneos" element={<Tournaments />} />
          <Route path="/torneo/:id" element={<TournamentDetails />} />
          <Route path="/albumes" element={<Albums />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/video/:id" element={<VideoView />} />
          <Route path="/album/:id" element={<AlbumView />} />
          <Route path="/partido/:id" element={<MatchView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
