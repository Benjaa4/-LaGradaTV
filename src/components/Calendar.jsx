import { useAppContext } from '../context/AppContext';
import MatchCard from './MatchCard';

export default function Calendar() {
  const { matches } = useAppContext();

  // Sort matches by date ascending (closest first)
  const sortedMatches = [...matches].sort((a, b) => {
    return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
  });
  
  // Group by date
  const groupedMatches = sortedMatches.reduce((acc, match) => {
    if (!acc[match.date]) acc[match.date] = [];
    acc[match.date].push(match);
    return acc;
  }, {});

  return (
    <div className="calendar-container animate-slide-up">
      <h2 className="section-title">Calendario de Partidos</h2>
      {Object.keys(groupedMatches).length === 0 ? (
        <p className="text-muted text-center" style={{ padding: '2rem' }}>No hay partidos programados próximamente.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {Object.keys(groupedMatches).map(date => (
            <div key={date}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
                {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <div className="grid-container">
                {groupedMatches[date].map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
