import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import StandingsTable from '../components/StandingsTable';
import MatchCard from '../components/MatchCard';
import KnockoutBracket from '../components/KnockoutBracket';
import { Trophy, Users, Swords, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

export default function TournamentDetails() {
  const { id } = useParams();
  const { tournaments, matches } = useAppContext();
  const [activeTab, setActiveTab] = useState('bracket'); // 'bracket' | 'matches'

  const tournament = tournaments.find(t => t.id === id);
  const tournamentMatches = matches
    .filter(m => m.tournament_id === id)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  if (!tournament) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 className="page-title">Torneo no encontrado</h2>
        <Link to="/torneos" className="btn btn-glass" style={{ marginTop: '1.5rem' }}>
          <ChevronLeft size={16} /> Ver torneos
        </Link>
      </div>
    );
  }

  const isKnockout = tournament.type === 'knockout';

  return (
    <div className="animate-fade-in">
      {/* ── Hero banner ── */}
      <div style={{
        height: '260px', borderRadius: 'var(--radius-lg)',
        overflow: 'hidden', position: 'relative', marginBottom: '2.5rem',
      }}>
        <img
          src={tournament.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop'}
          alt={tournament.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.4) 60%, transparent 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.2rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem',
              fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase',
              background: isKnockout ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.12)',
              border: `1px solid ${isKnockout ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.25)'}`,
              color: isKnockout ? '#f87171' : '#34d399',
            }}>
              {isKnockout ? <Swords size={11} /> : <Trophy size={11} />}
              {isKnockout ? 'Eliminatoria' : 'Liga'}
            </span>
            {tournament.season && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Temporada {tournament.season}
              </span>
            )}
          </div>
          <h1 className="page-title" style={{ marginBottom: '0.4rem' }}>{tournament.name}</h1>
          {tournament.description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '600px' }}>
              {tournament.description}
            </p>
          )}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Users size={14} /> {tournament.standings?.length || 0} equipos
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Trophy size={14} /> {tournamentMatches.length} partido{tournamentMatches.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tab navigation ── */}
      <div className="td-tabs" style={{ marginBottom: '2rem' }}>
        {isKnockout ? (
          <>
            <button
              className={`td-tab ${activeTab === 'bracket' ? 'td-tab-active' : ''}`}
              onClick={() => setActiveTab('bracket')}
            >
              <Swords size={15} /> Bracket / Fixture
            </button>
            <button
              className={`td-tab ${activeTab === 'matches' ? 'td-tab-active' : ''}`}
              onClick={() => setActiveTab('matches')}
            >
              <Trophy size={15} /> Lista de Partidos
            </button>
          </>
        ) : (
          <>
            <button
              className={`td-tab ${activeTab === 'standings' ? 'td-tab-active' : ''}`}
              onClick={() => setActiveTab('standings')}
            >
              <Trophy size={15} /> Tabla de Posiciones
            </button>
            <button
              className={`td-tab ${activeTab === 'matches' ? 'td-tab-active' : ''}`}
              onClick={() => setActiveTab('matches')}
            >
              <Swords size={15} /> Partidos
            </button>
          </>
        )}
      </div>

      {/* ── Content ── */}
      <div className="animate-slide-up">
        {/* Knockout bracket */}
        {isKnockout && activeTab === 'bracket' && (
          <section>
            <KnockoutBracket
              matches={tournamentMatches}
              teams={tournament.standings || []}
            />
          </section>
        )}

        {/* League standings */}
        {!isKnockout && activeTab === 'standings' && (
          <section>
            <StandingsTable standings={tournament.standings} />
          </section>
        )}

        {/* Matches list (both types) */}
        {activeTab === 'matches' && (
          <section>
            {tournamentMatches.length > 0 ? (
              <div className="grid-container" style={{ marginTop: 0 }}>
                {tournamentMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-darker)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-glass)' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📅</p>
                <p style={{ fontWeight: 600, marginBottom: '0.3rem' }}>Sin partidos aún</p>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                  Los partidos aparecerán aquí cuando sean programados desde el panel de administración.
                </p>
              </div>
            )}
          </section>
        )}
      </div>

      <style>{`
        .td-tabs {
          display: flex; gap: 0.5rem; flex-wrap: wrap;
          border-bottom: 1px solid var(--border-glass); padding-bottom: 0;
        }
        .td-tab {
          display: flex; align-items: center; gap: 0.4rem;
          padding: 0.6rem 1.25rem; background: none; border: none;
          color: var(--text-muted); font-weight: 600; font-size: 0.88rem;
          cursor: pointer; border-bottom: 2px solid transparent;
          margin-bottom: -1px; transition: all 0.2s; border-radius: var(--radius-sm) var(--radius-sm) 0 0;
        }
        .td-tab:hover { color: var(--text-primary); }
        .td-tab-active {
          color: var(--text-primary) !important;
          border-bottom-color: var(--blue) !important;
          background: rgba(59,130,246,0.06);
        }
      `}</style>
    </div>
  );
}
