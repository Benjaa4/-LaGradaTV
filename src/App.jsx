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
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiesPolicyPage from './pages/CookiesPolicyPage';
import MatchDetailSheet from './components/MatchDetailSheet';
import SearchModal from './components/SearchModal';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';

import ProtectedRoute from './components/ProtectedRoute';

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
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/video/:id" element={<VideoView />} />
          <Route path="/album/:id" element={<AlbumView />} />
          <Route path="/partido/:id" element={<MatchView />} />
          <Route path="/partido/:id/alineaciones" element={<MatchView />} />
          <Route path="/terminos" element={<TermsPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/privacidad" element={<PrivacyPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/cookies" element={<CookiesPolicyPage />} />
          <Route path="/cookies-policy" element={<CookiesPolicyPage />} />
        </Routes>
      </main>
      <Footer />
      <MatchDetailSheet />
      <SearchModal />
      <CookieBanner />
    </div>
  );
}

export default App;
