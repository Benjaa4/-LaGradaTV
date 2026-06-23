import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TournamentDetails from './pages/TournamentDetails';
import Matches from './pages/Matches';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/torneo/:id" element={<TournamentDetails />} />
          <Route path="/partidos" element={<Matches />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
