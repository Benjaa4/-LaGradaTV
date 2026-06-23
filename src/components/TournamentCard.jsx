import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import './TournamentCard.css';

export default function TournamentCard({ tournament }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/torneo/${tournament.id}`} className="tournament-card glass-panel animate-fade-in">
      <div className="card-image-container">
        {tournament.image && !imgError ? (
          <img 
            src={tournament.image} 
            alt={tournament.name} 
            className="card-image" 
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-darker)' }}>
            <Trophy size={48} color="var(--text-muted)" />
          </div>
        )}
        <div className="card-overlay"></div>
      </div>
      <div className="card-content">
        <span className="card-season">{tournament.season}</span>
        <h3 className="card-title">{tournament.name}</h3>
        <p className="card-description">{tournament.description}</p>
        <div className="card-footer">
          <span className="teams-count">{tournament.standings?.length || 0} Equipos</span>
          <span className="view-details">Ver detalles →</span>
        </div>
      </div>
    </Link>
  );
}
