import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import StandingsTable from '../components/StandingsTable';

export default function TournamentDetails() {
  const { id } = useParams();
  const { tournaments } = useAppContext();
  
  const tournament = tournaments.find(t => t.id === id);

  if (!tournament) {
    return <div className="animate-fade-in"><h2 className="page-title">Torneo no encontrado</h2></div>;
  }

  return (
    <div className="animate-fade-in">
      <div style={{
        height: '300px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '3rem'
      }}>
        <img 
          src={tournament.image} 
          alt={tournament.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(to top, var(--bg-dark), transparent)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '2rem'
        }}>
          <span style={{ color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '1px' }}>
            TEMPORADA {tournament.season}
          </span>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>{tournament.name}</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>{tournament.description}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section>
          <h2 className="section-title">Tabla de Posiciones</h2>
          <StandingsTable standings={tournament.standings} />
        </section>
      </div>
    </div>
  );
}
