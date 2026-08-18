import { Trophy, Search } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import TournamentCard from '../components/TournamentCard';

export default function Tournaments() {
  const { tournaments } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTournaments = tournaments.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Trophy size={32} color="var(--primary)" />
        <h1 className="page-title" style={{ margin: 0, fontSize: '2.5rem' }}>Todos los Torneos</h1>
      </div>
      
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '700px', marginBottom: '2rem', lineHeight: '1.6' }}>
        Descubre todos los torneos disponibles, sigue tus ligas favoritas y mantente al tanto de la competencia.
      </p>

      <div className="form-group" style={{ marginBottom: '3rem', maxWidth: '400px', position: 'relative' }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          className="form-input" 
          placeholder="Buscar torneo..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.75rem' }}
        />
      </div>

      <div className="grid-container">
        {filteredTournaments.map(tournament => (
          <div key={tournament.id} className="hover-lift transition-all">
            <TournamentCard tournament={tournament} />
          </div>
        ))}
      </div>

      {filteredTournaments.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <Trophy size={48} color="var(--border-glass)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No se encontraron torneos</h3>
          <p className="text-muted">Prueba con otra búsqueda o filtro.</p>
        </div>
      )}
    </div>
  );
}
