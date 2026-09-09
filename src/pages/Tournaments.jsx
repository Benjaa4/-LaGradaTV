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
    <div className="animate-fade-in" style={{ padding: '1rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <Trophy size={28} color="var(--primary)" />
        <h1 className="page-title" style={{ margin: 0, fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>Todos los Torneos</h1>
      </div>
      
      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '700px', marginBottom: '1.25rem', lineHeight: '1.5' }}>
        Descubre todos los torneos disponibles, sigue tus ligas favoritas y mantente al tanto de la competencia.
      </p>

      <div className="form-group" style={{ marginBottom: '1.75rem', maxWidth: '400px', position: 'relative' }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
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
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <Trophy size={42} color="var(--nm-border-strong)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>No se encontraron torneos</h3>
          <p className="text-muted">Prueba con otra búsqueda o filtro.</p>
        </div>
      )}
    </div>
  );
}
