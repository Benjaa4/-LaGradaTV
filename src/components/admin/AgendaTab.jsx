import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Trophy, MapPin, Edit2, Trash2, X, Check, Video } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { SectionHeader, EmptyState, ConfirmDialog } from './AdminModal';
import { ScoreInput, PenaltyInput } from './ScoreInput';
import CustomDatePicker from '../CustomDatePicker';
import CustomTimePicker from '../CustomTimePicker';
import CustomSelect from '../CustomSelect';

export default function AgendaTab() {
  const { matches, tournaments, locations, editMatch, deleteMatch } = useAppContext();
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editMatchData, setEditMatchData] = useState({});
  const [confirmAction, setConfirmAction] = useState(null);
  const [filterTournamentId, setFilterTournamentId] = useState('all');

  const askConfirm = (title, message, onConfirm) => setConfirmAction({ title, message, onConfirm });

  const scheduledMatches = matches
    .filter(m => m.status === 'scheduled')
    .filter(m => filterTournamentId === 'all' || m.tournament_id === filterTournamentId)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const handleSaveMatch = (originalMatch) => {
    editMatch(originalMatch.id, editMatchData);
    setEditingMatchId(null);
  };

  return (
    <section className="animate-fade-in">
      <SectionHeader
        title="Agenda Global de Encuentros"
        count={scheduledMatches.length}
      />

      {/* Filtro por Torneo */}
      {tournaments.length > 1 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <CustomSelect
            value={filterTournamentId}
            onChange={val => setFilterTournamentId(val)}
            options={[
              { value: 'all', label: 'Todos los torneos' },
              ...tournaments.map(t => ({ value: t.id, label: t.name }))
            ]}
            placeholder="Filtrar por torneo"
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {scheduledMatches.map(match => {
          const tournament = tournaments.find(t => t.id === match.tournament_id);
          const homeTeam = tournament?.standings?.find(s => s.id === match.home_team_id);
          const awayTeam = tournament?.standings?.find(s => s.id === match.away_team_id);
          const location = locations.find(l => l.id === match.location_id);
          const isEditing = editingMatchId === match.id;

          return (
            <div key={match.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
              {isEditing ? (
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Editar Partido</h3>
                    <button className="btn btn-glass" style={{ padding: '0.4rem' }} onClick={() => setEditingMatchId(null)}>
                      <X size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.72rem' }}>Fecha</label>
                      <CustomDatePicker value={editMatchData.date} onChange={date => setEditMatchData({ ...editMatchData, date })} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.72rem' }}>Hora</label>
                      <CustomTimePicker value={editMatchData.time} onChange={time => setEditMatchData({ ...editMatchData, time })} />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.72rem' }}>Estado</label>
                    <CustomSelect
                      value={editMatchData.status}
                      onChange={val => setEditMatchData({ ...editMatchData, status: val })}
                      options={[
                        { value: 'scheduled', label: 'Programado' },
                        { value: 'played',    label: 'Finalizado'  },
                      ]}
                      placeholder="Estado del partido"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.72rem' }}>Cancha</label>
                    <CustomSelect
                      value={editMatchData.location_id || ''}
                      onChange={val => setEditMatchData({ ...editMatchData, location_id: val })}
                      options={[
                        { value: '', label: '— Sin cancha —' },
                        ...locations.map(loc => ({ value: loc.id, label: loc.name }))
                      ]}
                      placeholder="Sin cancha asignada"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.72rem' }}>URL del Video / Transmisión</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://youtube.com/watch?v=... o https://twitch.tv/..."
                      value={editMatchData.stream_url || ''}
                      onChange={e => setEditMatchData({ ...editMatchData, stream_url: e.target.value })}
                      style={{ fontSize: '0.82rem' }}
                    />
                  </div>

                  {editMatchData.status === 'played' && (
                    <div style={{ background: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label className="form-label" style={{ margin: 0, textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                        Marcador Final
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                            {homeTeam?.name || 'Local'}
                          </span>
                          <ScoreInput
                            value={editMatchData.home_score}
                            onChange={val => setEditMatchData({ ...editMatchData, home_score: val })}
                            style={{ width: '60px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', padding: '0.35rem 0.25rem' }}
                          />
                        </div>
                        <span style={{ fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.85rem' }}>VS</span>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                            {awayTeam?.name || 'Visitante'}
                          </span>
                          <ScoreInput
                            value={editMatchData.away_score}
                            onChange={val => setEditMatchData({ ...editMatchData, away_score: val })}
                            style={{ width: '60px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', padding: '0.35rem 0.25rem' }}
                          />
                        </div>
                      </div>

                      {(editMatchData.home_score === editMatchData.away_score || editMatchData.home_penalties != null) && (
                        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Penales:</span>
                          <PenaltyInput
                            value={editMatchData.home_penalties}
                            onChange={val => setEditMatchData({ ...editMatchData, home_penalties: val })}
                            style={{ width: '45px', textAlign: 'center', padding: '0.2rem' }}
                          />
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                          <PenaltyInput
                            value={editMatchData.away_penalties}
                            onChange={val => setEditMatchData({ ...editMatchData, away_penalties: val })}
                            style={{ width: '45px', textAlign: 'center', padding: '0.2rem' }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-glass" style={{ flex: 1 }} onClick={() => setEditingMatchId(null)}>
                      <X size={16} /> Cancelar
                    </button>
                    <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => handleSaveMatch(match)}>
                      <Check size={16} /> Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(59,130,246,0.15)', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Programado
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Trophy size={13} /> {tournament?.name}
                      </span>
                      {match.stream_url && (
                        <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
                          <Video size={11} /> Video
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} /> {match.date} {match.time}
                    </span>
                  </div>

                  <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <span style={{ fontWeight: '700', fontSize: '1rem', color: homeTeam?.disqualified ? '#ef4444' : 'var(--text-primary)', textDecoration: homeTeam?.disqualified ? 'line-through' : 'none' }}>
                        {homeTeam?.name || 'Por definir'}
                      </span>
                    </div>
                    <div style={{ padding: '0 1rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-muted)' }}>VS</span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <span style={{ fontWeight: '700', fontSize: '1rem', color: awayTeam?.disqualified ? '#ef4444' : 'var(--text-primary)', textDecoration: awayTeam?.disqualified ? 'line-through' : 'none' }}>
                        {awayTeam?.name || 'Por definir'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem', marginLeft: '1rem' }}>
                      <button className="btn btn-glass" style={{ padding: '0.5rem' }} onClick={() => {
                        setEditingMatchId(match.id);
                        setEditMatchData({ ...match });
                      }}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => {
                        askConfirm(
                          'Eliminar Partido',
                          '¿Estás seguro de eliminar este partido de la agenda?',
                          () => deleteMatch(match.id)
                        );
                      }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {location && (
                    <div style={{ padding: '0.4rem 1.25rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border-glass)', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={12} color="var(--primary)" /> {location.name}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {scheduledMatches.length === 0 && (
          <EmptyState message="No hay partidos programados pendientes en la agenda" />
        )}
      </div>

      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.title}
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </section>
  );
}
