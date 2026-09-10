import { useState } from 'react';
import { Trophy, Shield, Calendar as CalendarIcon, ArrowLeft, Edit2, Trash2, Plus, X, Check, Users, Sliders } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Modal, ConfirmDialog, SectionHeader, EmptyState, StatBadge } from './AdminModal';
import { ScoreInput, PenaltyInput } from './ScoreInput';
import CustomDatePicker from '../CustomDatePicker';
import CustomTimePicker from '../CustomTimePicker';
import CustomSelect from '../CustomSelect';
import EditLineupModal from '../lineup/EditLineupModal';
import { MODALITIES } from '../../utils/lineupUtils';
import { 
  getBracketCode, 
  getBracketLabel, 
  getNextProgressionLabel, 
  getBracketOptionsForRound,
  getSlotFeederPlaceholder,
  BRACKET_ROUNDS 
} from '../../utils/bracketUtils';

export default function TournamentsTab({ setViewingState }) {
  const {
    tournaments, addTournament, editTournament, deleteTournament,
    addTeam, deleteTeam, updateTeamStats,
    matches, addMatch, editMatch, deleteMatch, generateBracket,
    locations, updateMatchLineups
  } = useAppContext();

  // Navigation within tab
  const [viewingTournamentId, setViewingTournamentId] = useState(null);
  const [tournamentSubTab, setTournamentSubTab] = useState('standings'); // 'standings' | 'matches'

  // Modals & confirms
  const [openModal, setOpenModal] = useState(null); // 'tournament' | 'team' | 'match'
  const [confirmAction, setConfirmAction] = useState(null);
  const [lineupEditingMatch, setLineupEditingMatch] = useState(null);
  const askConfirm = (title, message, onConfirm) => setConfirmAction({ title, message, onConfirm });

  // Forms: Tournament
  const [newTournamentName, setNewTournamentName] = useState('');
  const [newTournamentType, setNewTournamentType] = useState('league');
  const [newTournamentImage, setNewTournamentImage] = useState('');
  const [newTournamentMatchType, setNewTournamentMatchType] = useState('f7');
  const [editingTournamentId, setEditingTournamentId] = useState(null);
  const [editTournamentData, setEditTournamentData] = useState({});

  // Forms: Team
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamLogo, setNewTeamLogo] = useState('');
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editData, setEditData] = useState({});

  // Forms: Match
  const [newMatch, setNewMatch] = useState({
    home_team_id: '', away_team_id: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00', location_id: '', stream_url: '',
    round: '', match_order: 0, description: '',
    status: 'scheduled',
    match_type: 'f7',
    home_score: 0,
    away_score: 0,
    has_penalties: false,
    home_penalties: null,
    away_penalties: null,
    bracket_code: ''
  });
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editMatchData, setEditMatchData] = useState({});
  const [bracketStartRound, setBracketStartRound] = useState('quarterfinal');

  const currentTournament = tournaments.find(t => t.id === viewingTournamentId);

  // Notify parent if deep view is open (for tab visibility)
  const handleSetViewing = (id) => {
    setViewingTournamentId(id);
    if (setViewingState) setViewingState(!!id);
  };

  // Handlers: Tournament
  const handleAddTournament = (e) => {
    e.preventDefault();
    if (newTournamentName.trim()) {
      addTournament({ 
        name: newTournamentName.trim(), 
        type: newTournamentType, 
        image: newTournamentImage.trim(),
        match_type: newTournamentMatchType || 'f7'
      });
      setNewTournamentName('');
      setNewTournamentType('league');
      setNewTournamentImage('');
      setNewTournamentMatchType('f7');
      setOpenModal(null);
    }
  };

  const handleUpdateTournament = (id) => {
    editTournament(id, editTournamentData);
    setEditingTournamentId(null);
  };

  const handleEditTournament = (e) => {
    e.preventDefault();
    if (editTournamentData.name?.trim()) {
      editTournament(editingTournamentId, {
        ...editTournamentData,
        match_type: editTournamentData.match_type || 'f7'
      });
      setEditingTournamentId(null);
    }
  };

  // Handlers: Team
  const handleAddTeamSubmit = (e) => {
    e.preventDefault();
    if (viewingTournamentId && newTeamName.trim()) {
      addTeam(viewingTournamentId, { 
        name: newTeamName.trim(),
        logo: newTeamLogo.trim() || null
      });
      setNewTeamName('');
      setNewTeamLogo('');
      setOpenModal(null);
    }
  };

  const handleEditClick = (team) => {
    setEditingTeamId(team.id);
    setEditData({ ...team });
  };

  const handleUpdateStats = (teamId) => {
    updateTeamStats(viewingTournamentId, teamId, editData);
    setEditingTeamId(null);
  };

  // Handlers: Match
  const handleAddMatch = (e) => {
    e.preventDefault();
    if (viewingTournamentId && newMatch.home_team_id && newMatch.away_team_id) {
      let matchOrder = newMatch.match_order;
      let bracketCode = newMatch.bracket_code;
      if (currentTournament?.type === 'knockout' && newMatch.round) {
        if (!bracketCode) {
          const existingOrders = matches
            .filter(m => m.tournament_id === viewingTournamentId && m.round === newMatch.round)
            .map(m => m.match_order ?? 0);
          matchOrder = existingOrders.length > 0 ? Math.max(...existingOrders) + 1 : 0;
          bracketCode = getBracketCode(newMatch.round, matchOrder);
        }
      }
      const matchDataToAdd = {
        ...newMatch,
        bracket_code: bracketCode || null,
        match_order: matchOrder,
        tournament_id: viewingTournamentId,
        match_type: newMatch.match_type || currentTournament?.match_type || 'f7',
        home_score: newMatch.status === 'played' ? (parseInt(newMatch.home_score) || 0) : 0,
        away_score: newMatch.status === 'played' ? (parseInt(newMatch.away_score) || 0) : 0,
        home_penalties: (newMatch.status === 'played' && newMatch.has_penalties)
          ? (newMatch.home_penalties !== null && newMatch.home_penalties !== '' ? parseInt(newMatch.home_penalties) : null)
          : null,
        away_penalties: (newMatch.status === 'played' && newMatch.has_penalties)
          ? (newMatch.away_penalties !== null && newMatch.away_penalties !== '' ? parseInt(newMatch.away_penalties) : null)
          : null
      };
      delete matchDataToAdd.has_penalties;

      addMatch(matchDataToAdd);
      setNewMatch({
        home_team_id: '', away_team_id: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00', location_id: '', stream_url: '',
        round: '', match_order: 0, description: '',
        status: 'scheduled',
        match_type: currentTournament?.match_type || 'f7',
        home_score: 0,
        away_score: 0,
        has_penalties: false,
        home_penalties: null,
        away_penalties: null,
        bracket_code: ''
      });
      setOpenModal(null);
    }
  };

  const handleSaveMatch = (originalMatch) => {
    const updatedData = {
      ...editMatchData,
      bracket_code: editMatchData.bracket_code || (editMatchData.round ? getBracketCode(editMatchData.round, editMatchData.match_order) : null)
    };
    editMatch(originalMatch.id, updatedData);
    setEditingMatchId(null);
  };

  return (
    <section className="animate-fade-in">
      {/* ── View: Torneo Details ── */}
      {viewingTournamentId && currentTournament ? (
        <div className="animate-fade-in">
          {/* Header con botón Volver */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button onClick={() => handleSetViewing(null)} className="btn btn-glass" style={{ padding: '0.5rem', borderRadius: '50%' }}>
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>{currentTournament.name}</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {currentTournament.type === 'knockout' ? 'Eliminatoria' : 'Liga'}
              </p>
            </div>
          </div>

          {/* Sub-tabs para Torneo */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)' }}>
            <button
              onClick={() => setTournamentSubTab('standings')}
              className={`btn ${tournamentSubTab === 'standings' ? 'btn-primary' : 'btn-glass'}`}
              style={{ flex: 1, borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0' }}
            >
              <Shield size={16} /> Equipos
            </button>
            <button
              onClick={() => setTournamentSubTab('matches')}
              className={`btn ${tournamentSubTab === 'matches' ? 'btn-primary' : 'btn-glass'}`}
              style={{ flex: 1, borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0' }}
            >
              <CalendarIcon size={16} /> Partidos
            </button>
          </div>

          {/* Sub-tab: Standings / Teams */}
          {tournamentSubTab === 'standings' && (
            <div className="animate-fade-in">
              <SectionHeader
                title="Equipos Participantes"
                count={currentTournament.standings?.length || 0}
                addLabel="Añadir Equipo"
                onAdd={() => setOpenModal('team')}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentTournament.standings?.map((team, index) => (
                  <div key={team.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                    {editingTeamId === team.id ? (
                      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.78rem' }}>Nombre del Equipo</label>
                          <input
                            type="text"
                            className="form-input"
                            value={editData.name || ''}
                            onChange={e => setEditData({ ...editData, name: e.target.value })}
                            autoFocus
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.78rem' }}>URL del Logo (Opcional)</label>
                          <input
                            type="url"
                            className="form-input"
                            value={editData.logo || ''}
                            onChange={e => setEditData({ ...editData, logo: e.target.value })}
                          />
                        </div>

                        {/* Stats grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                          {[
                            { label: 'PJ', key: 'played' }, { label: 'G', key: 'won' },
                            { label: 'E', key: 'drawn' }, { label: 'P', key: 'lost' },
                            { label: 'GF', key: 'goalsFor' }, { label: 'GC', key: 'goalsAgainst' },
                            { label: 'Faltas', key: 'fouls' }, { label: 'PTS', key: 'points' }
                          ].map(stat => (
                            <div key={stat.key}>
                              <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                                {stat.label}
                              </label>
                              <input
                                type="number"
                                className="form-input"
                                style={{ textAlign: 'center', padding: '0.5rem 0.25rem', fontSize: '0.9rem' }}
                                value={editData[stat.key] || 0}
                                onChange={e => setEditData({ ...editData, [stat.key]: e.target.value })}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Disqualified checkbox */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', background: 'rgba(239,68,68,0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.2)' }}>
                          <input
                            type="checkbox"
                            checked={!!editData.disqualified}
                            onChange={e => setEditData({ ...editData, disqualified: e.target.checked })}
                            style={{ width: '1.2rem', height: '1.2rem', accentColor: '#ef4444' }}
                          />
                          <div>
                            <span style={{ color: '#ef4444', fontWeight: '700', display: 'block', fontSize: '0.88rem' }}>Equipo Descalificado</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>El rival avanzará automáticamente en llaves</span>
                          </div>
                        </label>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button className="btn btn-glass" style={{ flex: 1 }} onClick={() => setEditingTeamId(null)}>
                            <X size={16} /> Cancelar
                          </button>
                          <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => handleUpdateStats(team.id)}>
                            <Check size={16} /> Guardar Cambios
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: index < 3 ? 'var(--primary)' : 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', color: index < 3 ? 'white' : 'var(--text-muted)', flexShrink: 0 }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: '700', color: team.disqualified ? '#ef4444' : 'var(--text-primary)', textDecoration: team.disqualified ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {team.name}
                            {!!team.disqualified && <span style={{ fontSize: '0.6rem', background: '#ef4444', color: 'white', padding: '0.1rem 0.3rem', borderRadius: '3px', textDecoration: 'none', fontWeight: '800' }}>DESC</span>}
                          </p>
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                            <StatBadge label="PJ" value={team.played} />
                            <StatBadge label="G" value={team.won} />
                            <StatBadge label="GF" value={team.goalsFor} />
                            <StatBadge label="GC" value={team.goalsAgainst} />
                            <StatBadge label="Pts" value={team.points} highlight />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button className="btn btn-glass" style={{ padding: '0.6rem' }} onClick={() => handleEditClick(team)}>
                            <Edit2 size={15} />
                          </button>
                          <button className="btn btn-danger" style={{ padding: '0.6rem' }} onClick={() => {
                            askConfirm(
                              'Eliminar Equipo',
                              `¿Seguro que deseas eliminar el equipo "${team.name}"?`,
                              () => deleteTeam(viewingTournamentId, team.id)
                            );
                          }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {(!currentTournament?.standings || currentTournament.standings.length === 0) && (
                  <EmptyState message="No hay equipos en este torneo" onAdd={() => setOpenModal('team')} addLabel="Añadir Equipo" />
                )}
              </div>
            </div>
          )}

          {/* Sub-tab: Matches */}
          {tournamentSubTab === 'matches' && (
            <div className="animate-fade-in">
              <SectionHeader
                title="Partidos del Torneo"
                count={matches.filter(m => m.tournament_id === viewingTournamentId).length}
                addLabel="Añadir Partido"
                onAdd={() => setOpenModal('match')}
              />

              {currentTournament.type === 'knockout' && matches.filter(m => m.tournament_id === viewingTournamentId).length === 0 && (
                <div style={{
                  background: 'rgba(59, 130, 246, 0.08)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed rgba(59, 130, 246, 0.35)',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem', color: 'var(--primary-light)', fontSize: '1.1rem', fontWeight: 800 }}>
                      Fase Eliminatoria Vacía
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: '520px' }}>
                      Elige desde qué instancia comenzará el torneo para generar las llaves con partidos por confirmar (TBD):
                    </p>
                  </div>

                  {/* Selector de Instancia Inicial */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '0.65rem',
                    width: '100%',
                    maxWidth: '580px'
                  }}>
                    {[
                      { key: 'round_of_16', label: 'Octavos', desc: '16 eq. · 15 partidos' },
                      { key: 'quarterfinal', label: 'Cuartos', desc: '8 eq. · 7 partidos' },
                      { key: 'semifinal', label: 'Semifinales', desc: '4 eq. · 3 partidos' },
                      { key: 'final', label: 'Final Directa', desc: '2 eq. · 1 partido' }
                    ].map(r => {
                      const isSelected = bracketStartRound === r.key;
                      return (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => setBracketStartRound(r.key)}
                          className="btn"
                          style={{
                            padding: '0.65rem 0.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.2rem',
                            background: isSelected ? 'rgba(79, 109, 245, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                            borderColor: isSelected ? 'var(--primary)' : 'var(--border-glass)',
                            boxShadow: isSelected ? '0 0 14px rgba(79, 109, 245, 0.3)' : 'none',
                            color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease'
                          }}
                        >
                          <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>{r.label}</span>
                          <span style={{ fontSize: '0.68rem', color: isSelected ? 'var(--primary-light)' : 'var(--text-muted)' }}>{r.desc}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button 
                    type="button"
                    className="btn btn-primary" 
                    style={{ padding: '0.65rem 1.4rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={async () => {
                      const success = await generateBracket(viewingTournamentId, bracketStartRound);
                      if (success) alert('¡Llaves generadas correctamente!');
                    }}
                  >
                    <Trophy size={16} />
                    Generar Llaves desde {
                      bracketStartRound === 'round_of_16' ? 'Octavos' :
                      bracketStartRound === 'quarterfinal' ? 'Cuartos' :
                      bracketStartRound === 'semifinal' ? 'Semifinales' : 'la Final'
                    }
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(() => {
                  const tournamentMatches = matches.filter(m => m.tournament_id === viewingTournamentId);
                  const presentRounds = Array.from(new Set(tournamentMatches.map(m => m.round).filter(Boolean)));
                  return tournamentMatches.map(match => {
                    const homeTeam = currentTournament.standings?.find(s => s.id === match.home_team_id);
                    const awayTeam = currentTournament.standings?.find(s => s.id === match.away_team_id);
                    const isEditing = editingMatchId === match.id;
                    const bCode = match.bracket_code || (match.round ? getBracketCode(match.round, match.match_order) : null);
                    const nextProgression = match.round ? getNextProgressionLabel(match.round, match.match_order, bCode) : null;

                  return (
                    <div key={match.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                      {isEditing ? (
                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.72rem' }}>URL Video / Transmisión</label>
                              <input
                                type="url"
                                className="form-input"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={editMatchData.stream_url || ''}
                                onChange={e => setEditMatchData({ ...editMatchData, stream_url: e.target.value })}
                              />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.72rem' }}>Modalidad de Fútbol</label>
                              <CustomSelect
                                value={editMatchData.match_type || currentTournament?.match_type || 'f7'}
                                onChange={val => setEditMatchData({ ...editMatchData, match_type: val })}
                                options={Object.values(MODALITIES).map(m => ({
                                  value: m.key,
                                  label: `${m.label} (${m.players} vs ${m.players})`
                                }))}
                                placeholder="Modalidad de fútbol"
                              />
                            </div>
                          </div>

                          {currentTournament?.type === 'knockout' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label" style={{ fontSize: '0.72rem' }}>Fase / Instancia</label>
                                <CustomSelect
                                  value={editMatchData.round || ''}
                                  onChange={val => {
                                    const opts = getBracketOptionsForRound(val);
                                    const defaultOpt = opts[0];
                                    setEditMatchData({
                                      ...editMatchData,
                                      round: val,
                                      bracket_code: defaultOpt?.value || '',
                                      match_order: defaultOpt?.match_order ?? 0
                                    });
                                  }}
                                  options={[
                                    { value: '', label: '— Sin fase —' },
                                    ...Object.values(BRACKET_ROUNDS).map(r => ({ value: r.key, label: r.label }))
                                  ]}
                                  placeholder="Seleccionar fase"
                                />
                              </div>
                              <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label" style={{ fontSize: '0.72rem' }}>Llave Semántica</label>
                                <CustomSelect
                                  value={editMatchData.bracket_code || ''}
                                  onChange={val => {
                                    const opts = getBracketOptionsForRound(editMatchData.round);
                                    const selected = opts.find(o => o.value === val);
                                    setEditMatchData({
                                      ...editMatchData,
                                      bracket_code: val,
                                      match_order: selected?.match_order ?? editMatchData.match_order
                                    });
                                  }}
                                  options={getBracketOptionsForRound(editMatchData.round).map(o => ({
                                    value: o.value,
                                    label: o.label
                                  }))}
                                  placeholder="Seleccionar llave"
                                  disabled={!editMatchData.round}
                                />
                              </div>
                            </div>
                          )}

                          <button
                            type="button"
                            className="btn btn-glass"
                            style={{ width: '100%', fontSize: '0.8rem', gap: '0.45rem', justifyContent: 'center', padding: '0.55rem' }}
                            onClick={() => setLineupEditingMatch(match)}
                          >
                            <Users size={15} color="var(--primary-light)" />
                            <span>Configurar Alineaciones del Encuentro</span>
                          </button>

                          <div style={{ background: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--border-glass)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: '700', textAlign: 'center', color: homeTeam?.disqualified ? '#ef4444' : 'var(--text-primary)', textDecoration: homeTeam?.disqualified ? 'line-through' : 'none' }}>
                                  {homeTeam?.name || (match.round ? getSlotFeederPlaceholder(match.round, match.match_order, 'home', presentRounds) : 'Por definir')}
                                </span>
                                <ScoreInput
                                  value={editMatchData.home_score}
                                  onChange={val => setEditMatchData({ ...editMatchData, home_score: val })}
                                  style={{ width: '65px', textAlign: 'center', fontSize: '1.75rem', fontWeight: '800', padding: '0.5rem 0.25rem' }}
                                />
                              </div>
                              <div style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.9rem' }}>VS</div>
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: '700', textAlign: 'center', color: awayTeam?.disqualified ? '#ef4444' : 'var(--text-primary)', textDecoration: awayTeam?.disqualified ? 'line-through' : 'none' }}>
                                  {awayTeam?.name || (match.round ? getSlotFeederPlaceholder(match.round, match.match_order, 'away', presentRounds) : 'Por definir')}
                                </span>
                                <ScoreInput
                                  value={editMatchData.away_score}
                                  onChange={val => setEditMatchData({ ...editMatchData, away_score: val })}
                                  style={{ width: '65px', textAlign: 'center', fontSize: '1.75rem', fontWeight: '800', padding: '0.5rem 0.25rem' }}
                                />
                              </div>
                            </div>

                            {/* Penales si están empatados o si ya tiene penales */}
                            {(editMatchData.home_score === editMatchData.away_score || editMatchData.home_penalties != null) && (
                              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Penales:</span>
                                <PenaltyInput
                                  value={editMatchData.home_penalties}
                                  onChange={val => setEditMatchData({ ...editMatchData, home_penalties: val })}
                                  style={{ width: '50px', textAlign: 'center', padding: '0.25rem' }}
                                />
                                <span style={{ color: 'var(--text-muted)' }}>-</span>
                                <PenaltyInput
                                  value={editMatchData.away_penalties}
                                  onChange={val => setEditMatchData({ ...editMatchData, away_penalties: val })}
                                  style={{ width: '50px', textAlign: 'center', padding: '0.25rem' }}
                                />
                              </div>
                            )}
                          </div>

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
                        <div style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{match.date} {match.time}</span>
                              {match.round && (
                                <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                  {BRACKET_ROUNDS[match.round]?.label || match.round}
                                </span>
                              )}
                              {bCode && (
                                <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.1rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: '700' }}>
                                  Llave {bCode}
                                </span>
                              )}
                              <span style={{ fontSize: '0.65rem', background: 'rgba(59, 130, 246, 0.12)', color: 'var(--primary-light)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                                {MODALITIES[match.match_type || currentTournament?.match_type || 'f7']?.tag || 'F7'}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontWeight: '700', fontSize: '0.92rem' }}>
                              {homeTeam?.name || (match.round ? getSlotFeederPlaceholder(match.round, match.match_order, 'home', presentRounds) : 'Por definir')} 
                              <span style={{ color: 'var(--text-muted)', fontWeight: '400', margin: '0 0.35rem' }}>vs</span> 
                              {awayTeam?.name || (match.round ? getSlotFeederPlaceholder(match.round, match.match_order, 'away', presentRounds) : 'Por definir')}
                            </p>
                            {nextProgression && (
                              <p style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <span>{nextProgression}</span>
                              </p>
                            )}
                            {match.status === 'played' && (
                              <p style={{ margin: '0.2rem 0 0', fontWeight: '800', color: 'var(--primary)', fontSize: '0.9rem' }}>
                                Resultado: {match.home_score} - {match.away_score}
                                {(match.home_penalties != null && match.away_penalties != null) && ` (${match.home_penalties}-${match.away_penalties} pen.)`}
                              </p>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                            <button
                              className="btn btn-glass"
                              style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem', gap: '0.35rem', display: 'inline-flex', alignItems: 'center' }}
                              onClick={() => setLineupEditingMatch(match)}
                              title="Editar Alineaciones del Partido"
                            >
                              <Users size={14} color="var(--primary-light)" />
                              <span>Alineaciones</span>
                            </button>
                            <button className="btn btn-glass" style={{ padding: '0.6rem' }} onClick={() => {
                              setEditingMatchId(match.id);
                              setEditMatchData({ 
                                ...match, 
                                match_type: match.match_type || currentTournament?.match_type || 'f7',
                                bracket_code: match.bracket_code || (match.round ? getBracketCode(match.round, match.match_order) : '')
                              });
                            }}>
                              <Edit2 size={15} />
                            </button>
                            <button className="btn btn-danger" style={{ padding: '0.6rem' }} onClick={() => {
                              askConfirm(
                                'Eliminar Partido',
                                '¿Estás seguro de eliminar este partido?',
                                () => deleteMatch(match.id)
                              );
                            }}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
                })()}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── Lista de Torneos ── */
        <div>
          <SectionHeader
            title="Torneos Activos"
            count={tournaments.length}
            addLabel="Crear Torneo"
            onAdd={() => setOpenModal('tournament')}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tournaments.map(tournament => (
              <div key={tournament.id} className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
                {editingTournamentId === tournament.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={editTournamentData.name || ''}
                      onChange={e => setEditTournamentData({ ...editTournamentData, name: e.target.value })}
                      autoFocus
                      placeholder="Nombre del Torneo"
                    />
                    <input
                      type="url"
                      className="form-input"
                      value={editTournamentData.image || ''}
                      onChange={e => setEditTournamentData({ ...editTournamentData, image: e.target.value })}
                      placeholder="URL de Portada (Opcional)"
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>Formato:</span>
                      <div style={{ display: 'flex', gap: '0.35rem', flex: 1 }}>
                        {Object.values(MODALITIES).map(m => {
                          const isSel = (editTournamentData.match_type || tournament.match_type || 'f7') === m.key;
                          return (
                            <button
                              key={m.key}
                              type="button"
                              className="btn"
                              onClick={() => setEditTournamentData({ ...editTournamentData, match_type: m.key })}
                              style={{
                                flex: 1,
                                padding: '0.35rem 0.5rem',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                background: isSel ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                borderColor: isSel ? 'var(--primary)' : 'var(--border-glass)',
                                color: isSel ? 'var(--primary-light)' : 'var(--text-secondary)'
                              }}
                            >
                              {m.tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleUpdateTournament(tournament.id)}>
                        <Check size={16} /> Guardar
                      </button>
                      <button className="btn btn-glass" onClick={() => setEditingTournamentId(null)}>
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Trophy size={20} color="var(--primary)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: '700', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                        {tournament.name}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--primary-light)', fontWeight: 800 }}>
                          {MODALITIES[tournament.match_type || 'f7']?.label || 'Fútbol 7'}
                        </span>
                        <span>·</span>
                        <span style={{ color: tournament.type === 'knockout' ? '#f87171' : '#34d399' }}>
                          {tournament.type === 'knockout' ? 'Eliminatoria' : 'Liga'}
                        </span>
                        <span>·</span>
                        <span>{tournament.standings?.length || 0} equipos</span>
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-primary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleSetViewing(tournament.id)}>
                        Administrar
                      </button>
                      <button className="btn btn-glass" style={{ padding: '0.6rem' }} onClick={() => {
                        setEditingTournamentId(tournament.id);
                        setEditTournamentData({ ...tournament, match_type: tournament.match_type || 'f7' });
                      }}>
                        <Edit2 size={15} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '0.6rem' }} onClick={() => {
                        askConfirm(
                          'Eliminar Torneo',
                          `¿Estás seguro de eliminar el torneo "${tournament.name}" y todos sus partidos asociados?`,
                          () => deleteTournament(tournament.id)
                        );
                      }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {tournaments.length === 0 && (
              <EmptyState message="No hay torneos creados" onAdd={() => setOpenModal('tournament')} addLabel="Crear Torneo" />
            )}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {openModal === 'tournament' && (
        <Modal title="Nuevo Torneo" icon={<Trophy size={20} />} onClose={() => setOpenModal(null)}>
          <form onSubmit={handleAddTournament} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Nombre del Torneo</label>
              <input required autoFocus type="text" className="form-input" value={newTournamentName} onChange={e => setNewTournamentName(e.target.value)} placeholder="Ej: Torneo Apertura 2026" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">URL de Portada (Opcional)</label>
              <input type="url" className="form-input" value={newTournamentImage} onChange={e => setNewTournamentImage(e.target.value)} placeholder="https://..." />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Tipo de Torneo</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', cursor: 'pointer', background: newTournamentType === 'league' ? 'rgba(59,130,246,0.1)' : 'transparent' }}>
                  <input type="radio" name="ttype" value="league" checked={newTournamentType === 'league'} onChange={() => setNewTournamentType('league')} />
                  Liga
                </label>
                <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', cursor: 'pointer', background: newTournamentType === 'knockout' ? 'rgba(59,130,246,0.1)' : 'transparent' }}>
                  <input type="radio" name="ttype" value="knockout" checked={newTournamentType === 'knockout'} onChange={() => setNewTournamentType('knockout')} />
                  Eliminatoria
                </label>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Modalidad / Formato de Fútbol</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {Object.values(MODALITIES).map(m => {
                  const isSel = newTournamentMatchType === m.key;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      className="btn"
                      onClick={() => setNewTournamentMatchType(m.key)}
                      style={{
                        padding: '0.65rem 0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem',
                        background: isSel ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
                        borderColor: isSel ? 'var(--primary)' : 'var(--border-glass)',
                        color: isSel ? 'var(--primary-light)' : 'var(--text-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{m.tag}</span>
                      <span style={{ fontSize: '0.74rem' }}>{m.label}</span>
                    </button>
                  );
                })}
              </div>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.35rem', display: 'block' }}>
                Todos los partidos que programes en este torneo adoptarán automáticamente este formato.
              </small>
            </div>

            <button type="submit" className="btn btn-primary">
              <Plus size={17} /> Crear Torneo
            </button>
          </form>
        </Modal>
      )}

      {openModal === 'team' && (
        <Modal title="Añadir Equipo" icon={<Shield size={20} />} onClose={() => setOpenModal(null)}>
          <form onSubmit={handleAddTeamSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Nombre del Equipo</label>
              <input required autoFocus type="text" className="form-input" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="Ej: Real Central" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">URL del Logo (Opcional)</label>
              <input type="url" className="form-input" value={newTeamLogo} onChange={e => setNewTeamLogo(e.target.value)} placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-primary">
              <Plus size={17} /> Añadir Equipo
            </button>
          </form>
        </Modal>
      )}

      {openModal === 'match' && currentTournament && (
        <Modal title="Añadir Partido" icon={<CalendarIcon size={20} />} onClose={() => setOpenModal(null)}>
          <form onSubmit={handleAddMatch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Equipo Local</label>
                <CustomSelect
                  value={newMatch.home_team_id}
                  onChange={val => setNewMatch({ ...newMatch, home_team_id: val })}
                  options={(currentTournament.standings || []).map(t => ({ value: t.id, label: t.name }))}
                  placeholder="Seleccionar local"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Equipo Visitante</label>
                <CustomSelect
                  value={newMatch.away_team_id}
                  onChange={val => setNewMatch({ ...newMatch, away_team_id: val })}
                  options={(currentTournament.standings || []).map(t => ({ value: t.id, label: t.name }))}
                  placeholder="Seleccionar visitante"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Fecha</label>
                <CustomDatePicker value={newMatch.date} onChange={date => setNewMatch({ ...newMatch, date })} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Hora</label>
                <CustomTimePicker value={newMatch.time} onChange={time => setNewMatch({ ...newMatch, time })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Estado</label>
                <CustomSelect
                  value={newMatch.status}
                  onChange={val => setNewMatch({ ...newMatch, status: val })}
                  options={[
                    { value: 'scheduled', label: 'Programado' },
                    { value: 'played',    label: 'Finalizado'  },
                  ]}
                  placeholder="Estado del partido"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Cancha (Opcional)</label>
                <CustomSelect
                  value={newMatch.location_id}
                  onChange={val => setNewMatch({ ...newMatch, location_id: val })}
                  options={[
                    { value: '', label: '— Sin cancha —' },
                    ...locations.map(loc => ({ value: loc.id, label: loc.name }))
                  ]}
                  placeholder="Sin cancha asignada"
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">URL de Video / Transmisión (YouTube, Twitch, etc.)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://www.youtube.com/watch?v=..."
                value={newMatch.stream_url || ''}
                onChange={e => setNewMatch({ ...newMatch, stream_url: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Modalidad / Formato</label>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  (Predefinido por torneo: {MODALITIES[currentTournament?.match_type || 'f7']?.tag})
                </span>
              </div>
              <CustomSelect
                value={newMatch.match_type || currentTournament?.match_type || 'f7'}
                onChange={val => setNewMatch({ ...newMatch, match_type: val })}
                options={Object.values(MODALITIES).map(m => ({
                  value: m.key,
                  label: `${m.label} (${m.players} vs ${m.players})`
                }))}
                placeholder="Modalidad de fútbol"
              />
            </div>

            {currentTournament?.type === 'knockout' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Fase / Instancia</label>
                  <CustomSelect
                    value={newMatch.round || ''}
                    onChange={val => {
                      const opts = getBracketOptionsForRound(val);
                      const defaultOpt = opts[0];
                      setNewMatch({
                        ...newMatch,
                        round: val,
                        bracket_code: defaultOpt?.value || '',
                        match_order: defaultOpt?.match_order ?? 0
                      });
                    }}
                    options={[
                      { value: '', label: '— Sin fase —' },
                      ...Object.values(BRACKET_ROUNDS).map(r => ({ value: r.key, label: r.label }))
                    ]}
                    placeholder="Seleccionar fase"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Llave Semántica</label>
                  <CustomSelect
                    value={newMatch.bracket_code || ''}
                    onChange={val => {
                      const opts = getBracketOptionsForRound(newMatch.round);
                      const selected = opts.find(o => o.value === val);
                      setNewMatch({
                        ...newMatch,
                        bracket_code: val,
                        match_order: selected?.match_order ?? 0
                      });
                    }}
                    options={getBracketOptionsForRound(newMatch.round).map(o => ({
                      value: o.value,
                      label: o.label
                    }))}
                    placeholder="Seleccionar llave"
                    disabled={!newMatch.round}
                  />
                </div>
              </div>
            )}

            {/* Marcador y penales si el partido se añade como Finalizado */}
            {newMatch.status === 'played' && (
              <div style={{ background: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label className="form-label" style={{ margin: 0, textAlign: 'center', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  Resultado Final
                </label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                      {currentTournament.standings?.find(t => t.id === newMatch.home_team_id)?.name || 'Local'}
                    </span>
                    <ScoreInput
                      value={newMatch.home_score}
                      onChange={val => setNewMatch({ ...newMatch, home_score: val })}
                      style={{ width: '65px', textAlign: 'center', fontSize: '1.75rem', fontWeight: '800', padding: '0.4rem 0.25rem' }}
                    />
                  </div>
                  <span style={{ fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.9rem' }}>VS</span>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                      {currentTournament.standings?.find(t => t.id === newMatch.away_team_id)?.name || 'Visitante'}
                    </span>
                    <ScoreInput
                      value={newMatch.away_score}
                      onChange={val => setNewMatch({ ...newMatch, away_score: val })}
                      style={{ width: '65px', textAlign: 'center', fontSize: '1.75rem', fontWeight: '800', padding: '0.4rem 0.25rem' }}
                    />
                  </div>
                </div>

                {/* Opción de penales */}
                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: newMatch.has_penalties ? '0.75rem' : 0 }}>
                    <input
                      type="checkbox"
                      checked={!!newMatch.has_penalties}
                      onChange={e => setNewMatch({ ...newMatch, has_penalties: e.target.checked })}
                      style={{ cursor: 'pointer' }}
                    />
                    ¿Se definió por penales?
                  </label>

                  {newMatch.has_penalties && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Penales:</span>
                      <PenaltyInput
                        value={newMatch.home_penalties}
                        onChange={val => setNewMatch({ ...newMatch, home_penalties: val })}
                        style={{ width: '50px', textAlign: 'center', padding: '0.25rem' }}
                      />
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                      <PenaltyInput
                        value={newMatch.away_penalties}
                        onChange={val => setNewMatch({ ...newMatch, away_penalties: val })}
                        style={{ width: '50px', textAlign: 'center', padding: '0.25rem' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary">
              <Plus size={17} /> Añadir Partido
            </button>
          </form>
        </Modal>
      )}

      {/* Confirm Dialog */}
      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.title}
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {/* Modal de Alineaciones de Partido */}
      {lineupEditingMatch && (
        <EditLineupModal
          isOpen={!!lineupEditingMatch}
          onClose={() => setLineupEditingMatch(null)}
          match={lineupEditingMatch}
          homeTeam={currentTournament?.standings?.find(s => s.id === lineupEditingMatch.home_team_id) || { name: 'Equipo Local', id: lineupEditingMatch.home_team_id }}
          awayTeam={currentTournament?.standings?.find(s => s.id === lineupEditingMatch.away_team_id) || { name: 'Equipo Visitante', id: lineupEditingMatch.away_team_id }}
          currentModality={lineupEditingMatch.match_type || currentTournament?.match_type || 'f7'}
          onSave={async ({ modality, lineups }) => {
            if (updateMatchLineups) {
              await updateMatchLineups(lineupEditingMatch.id, {
                match_type: modality,
                lineups
              });
            }
            setLineupEditingMatch(null);
          }}
        />
      )}
    </section>
  );
}
