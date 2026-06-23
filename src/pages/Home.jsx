import { useAppContext } from '../context/AppContext';
import TournamentCard from '../components/TournamentCard';

export default function Home() {
  const { tournaments } = useAppContext();

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Torneos Activos</h1>
      <p className="text-secondary mb-4" style={{ fontSize: '1.1rem' }}>
        Explora las ligas locales, sigue a tus equipos favoritos y mantente al tanto de los últimos resultados.
      </p>
      
      <div className="grid-container">
        {tournaments.map(tournament => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
    </div>
  );
}
