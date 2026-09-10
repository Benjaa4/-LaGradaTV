import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Check, RefreshCw, UserPlus, Trash2, Award, Shield, AlertTriangle, 
  Sliders, Users, Layers, Trophy 
} from 'lucide-react';
import { 
  MODALITIES, FORMATIONS, FORMATIONS_BY_MODALITY, 
  getMatchLineup, FIRST_NAMES, LAST_NAMES 
} from '../../utils/lineupUtils';
import CustomSelect from '../CustomSelect';

/**
 * AutoReplaceNumInput
 * Reemplaza automáticamente el cero inicial cuando el usuario teclea un nuevo número,
 * e interactúa con onFocus para seleccionar todo el contenido de inmediato.
 */
function AutoReplaceNumInput({ value, onChange, min = 0, max = 99, placeholder = '0', className = 'lineup-modal-input', style = {}, ...props }) {
  const displayVal = (value === '' || value === null || value === undefined) ? '' : value;

  const handleChange = (e) => {
    let raw = e.target.value;
    if (raw === '') {
      onChange('');
      return;
    }
    if (raw.length > 1 && raw.startsWith('0')) {
      raw = raw.replace(/^0+/, '');
      if (raw === '') raw = '0';
    }
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      let val = parsed;
      if (max !== undefined && val > max) val = max;
      if (min !== undefined && val < min) val = min;
      onChange(val);
    }
  };

  const handleBlur = () => {
    if (value === '' || value === null || value === undefined || isNaN(value)) {
      onChange(min !== undefined ? min : 0);
    }
  };

  return (
    <input
      type="number"
      min={min}
      max={max}
      className={className}
      value={displayVal}
      placeholder={placeholder}
      onChange={handleChange}
      onFocus={(e) => e.target.select()}
      onBlur={handleBlur}
      style={style}
      {...props}
    />
  );
}

export default function EditLineupModal({
  isOpen,
  onClose,
  match,
  homeTeam,
  awayTeam,
  currentHomeLineup,
  currentAwayLineup,
  currentModality = 'f7',
  onSave
}) {
  // Cierre con tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Modalidad seleccionada: 'f5' | 'f7' | 'f11'
  const [modality, setModality] = useState(match?.match_type || currentModality || 'f7');
  // Pestaña de equipo a editar: 'home' | 'away'
  const [activeTeamTab, setActiveTeamTab] = useState('home');

  // Estado de alineaciones local y visitante
  const [lineupData, setLineupData] = useState(() => {
    const h = currentHomeLineup ? JSON.parse(JSON.stringify(currentHomeLineup)) : getMatchLineup(match, homeTeam, true, modality);
    const a = currentAwayLineup ? JSON.parse(JSON.stringify(currentAwayLineup)) : getMatchLineup(match, awayTeam, false, modality);
    return { home: h, away: a };
  });

  const activeLineup = lineupData[activeTeamTab];
  const activeTeamObj = activeTeamTab === 'home' ? homeTeam : awayTeam;

  // Cambio de modalidad
  const handleModalityChange = (newMod) => {
    setModality(newMod);
    const availableFormations = FORMATIONS_BY_MODALITY[newMod];
    const defaultFormation = MODALITIES[newMod]?.defaultFormation || availableFormations[0];

    const hNew = getMatchLineup(match, homeTeam, true, newMod);
    const aNew = getMatchLineup(match, awayTeam, false, newMod);

    setLineupData({
      home: hNew,
      away: aNew
    });
  };

  // Cambio de táctica para el equipo activo
  const handleFormationChange = (newFormKey) => {
    const formationMeta = FORMATIONS[newFormKey];
    if (!formationMeta) return;

    setLineupData(prev => {
      const currentTeam = prev[activeTeamTab];
      const existingStarters = currentTeam.starting || [];

      // Re-mapear los titulares a las nuevas coordenadas del esquema
      const updatedStarters = formationMeta.slots.map((slot, i) => {
        const existing = existingStarters[i] || {};
        return {
          id: existing.id || `starter-${activeTeamTab}-${i + 1}`,
          number: existing.number || (i === 0 ? 1 : i + 2),
          name: existing.name || `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
          fullName: existing.fullName || existing.name || '',
          role: slot.role,
          x: slot.x,
          y: slot.y,
          yellowCards: existing.yellowCards || 0,
          redCards: existing.redCards || 0,
          priorYellowCount: existing.priorYellowCount || 0,
          isCaptain: existing.isCaptain || (i === 1)
        };
      });

      return {
        ...prev,
        [activeTeamTab]: {
          ...currentTeam,
          formation: newFormKey,
          starting: updatedStarters
        }
      };
    });
  };

  // Modificar titular
  const handleUpdateStarter = (index, field, value) => {
    setLineupData(prev => {
      const currentTeam = prev[activeTeamTab];
      const newStarting = [...currentTeam.starting];
      newStarting[index] = {
        ...newStarting[index],
        [field]: value
      };
      return {
        ...prev,
        [activeTeamTab]: {
          ...currentTeam,
          starting: newStarting
        }
      };
    });
  };

  // Modificar suplente
  const handleUpdateSub = (index, field, value) => {
    setLineupData(prev => {
      const currentTeam = prev[activeTeamTab];
      const newSubs = [...currentTeam.substitutes];
      newSubs[index] = {
        ...newSubs[index],
        [field]: value
      };
      return {
        ...prev,
        [activeTeamTab]: {
          ...currentTeam,
          substitutes: newSubs
        }
      };
    });
  };

  // Añadir suplente
  const handleAddSub = () => {
    setLineupData(prev => {
      const currentTeam = prev[activeTeamTab];
      const newSubIdx = (currentTeam.substitutes?.length || 0) + 1;
      const num = 12 + newSubIdx;
      const randomFirst = FIRST_NAMES[(newSubIdx * 3) % FIRST_NAMES.length];
      const randomLast = LAST_NAMES[(newSubIdx * 7) % LAST_NAMES.length];
      const fullName = `${randomFirst} ${randomLast}`;
      const shortName = `${randomFirst[0]}. ${randomLast}`;

      const newSub = {
        id: `sub-${activeTeamTab}-${Date.now()}`,
        number: num,
        name: shortName,
        fullName,
        role: 'MED',
        yellowCards: 0,
        redCards: 0,
        priorYellowCount: 0
      };

      return {
        ...prev,
        [activeTeamTab]: {
          ...currentTeam,
          substitutes: [...(currentTeam.substitutes || []), newSub]
        }
      };
    });
  };

  // Eliminar suplente
  const handleRemoveSub = (index) => {
    setLineupData(prev => {
      const currentTeam = prev[activeTeamTab];
      const newSubs = currentTeam.substitutes.filter((_, i) => i !== index);
      return {
        ...prev,
        [activeTeamTab]: {
          ...currentTeam,
          substitutes: newSubs
        }
      };
    });
  };

  // Re-generar nombres aleatorios para el equipo activo
  const handleAutoGenerate = () => {
    const h = getMatchLineup(match, activeTeamObj, activeTeamTab === 'home', modality);
    setLineupData(prev => ({
      ...prev,
      [activeTeamTab]: h
    }));
  };

  // Guardar cambios
  const handleSave = () => {
    if (onSave) {
      onSave({
        modality,
        lineups: lineupData
      });
    }
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div 
      className="modal-overlay edit-lineup-modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="modal-content edit-lineup-modal-container animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Accent Line */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--primary), var(--purple), var(--teal))', width: '100%' }} />

        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '1.25rem 1.5rem', flexShrink: 0, background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(79, 109, 245, 0.18)', border: '1px solid rgba(79, 109, 245, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
              <Sliders size={20} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.2rem', fontWeight: 800 }}>Configurar Alineaciones</h2>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Personaliza tipo de fútbol, tácticas, titulares, dorsales y sanciones
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-glass" 
            style={{ padding: '0.45rem', borderRadius: 'var(--radius-full)' }}
            title="Cerrar ventana"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
          
          {/* 1. Selector de Modalidad (F5, F7, F11) */}
          <div style={{ background: 'rgba(255, 255, 255, 0.035)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
              Tipo de Fútbol del Partido
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {Object.values(MODALITIES).map(m => {
                const isSelected = modality === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => handleModalityChange(m.key)}
                    className="btn"
                    style={{
                      padding: '0.75rem 0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem',
                      background: isSelected ? 'rgba(79, 109, 245, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                      borderColor: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected ? '0 0 16px rgba(79, 109, 245, 0.3)' : 'none',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, fontFamily: 'Nunito' }}>{m.tag}</span>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>{m.label}</span>
                    <span style={{ fontSize: '0.67rem', color: isSelected ? 'var(--primary-light)' : 'var(--text-muted)' }}>{m.players} jugadores</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Selector de Equipo a Editar */}
          <div style={{ display: 'flex', gap: '0.65rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setActiveTeamTab('home')}
              className="btn"
              style={{
                flex: 1,
                padding: '0.7rem 1rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                background: activeTeamTab === 'home' ? 'rgba(79, 109, 245, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                borderColor: activeTeamTab === 'home' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                color: activeTeamTab === 'home' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.18s ease'
              }}
            >
              Local: {homeTeam?.name || 'Local'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTeamTab('away')}
              className="btn"
              style={{
                flex: 1,
                padding: '0.7rem 1rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                background: activeTeamTab === 'away' ? 'rgba(225, 95, 65, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                borderColor: activeTeamTab === 'away' ? 'var(--rose)' : 'rgba(255, 255, 255, 0.08)',
                color: activeTeamTab === 'away' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.18s ease'
              }}
            >
              Visitante: {awayTeam?.name || 'Visitante'}
            </button>
          </div>

          {/* 3. Formación Táctica y Director Técnico */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                Esquema Táctico ({MODALITIES[modality]?.tag})
              </label>
              <CustomSelect
                value={activeLineup?.formation || ''}
                onChange={val => handleFormationChange(val)}
                options={(FORMATIONS_BY_MODALITY[modality] || []).map(fKey => ({
                  value: fKey,
                  label: FORMATIONS[fKey]?.name || fKey
                }))}
                placeholder="Seleccionar esquema táctico"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                Director Técnico (DT)
              </label>
              <input 
                type="text" 
                className="lineup-modal-input"
                value={activeLineup?.coach || ''}
                onChange={e => setLineupData(prev => ({
                  ...prev,
                  [activeTeamTab]: { ...prev[activeTeamTab], coach: e.target.value }
                }))}
                onFocus={e => e.target.select()}
                placeholder="Ej: Marcelo Gallardo"
                style={{ fontSize: '0.86rem', padding: '0.65rem 0.9rem', height: '42px', width: '100%' }}
              />
            </div>
          </div>

          {/* 4. Lista de Titulares */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Users size={16} color="var(--primary-light)" /> Titulares ({activeLineup?.starting?.length || 0})
              </h4>
              <button
                type="button"
                onClick={handleAutoGenerate}
                className="btn btn-glass"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <RefreshCw size={12} /> Auto-generar
              </button>
            </div>

            {/* Cabecera de columnas para titulares */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '55px 1fr 110px 75px 75px 45px',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <span style={{ textAlign: 'center' }}>Dorsal</span>
              <span>Nombre y Apellido</span>
              <span>Posición</span>
              <span style={{ textAlign: 'center' }}>🟨 Amarillas</span>
              <span style={{ textAlign: 'center' }}>🟥 Rojas</span>
              <span style={{ textAlign: 'center' }}>Cap.</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {(activeLineup?.starting || []).map((starter, idx) => (
                <div 
                  key={starter.id || idx}
                  className="lineup-player-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '55px 1fr 110px 75px 75px 45px',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.035)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'background 0.15s ease'
                  }}
                >
                  {/* Dorsal con auto-reemplazo de 0 */}
                  <AutoReplaceNumInput
                    min={1}
                    max={99}
                    value={starter.number}
                    onChange={val => handleUpdateStarter(idx, 'number', val || 1)}
                    style={{ textAlign: 'center', fontWeight: 900, padding: '0.35rem 0.2rem', fontSize: '0.86rem', height: '34px' }}
                    title="Número de dorsal (1-99)"
                  />

                  {/* Nombre completo con auto-selección on focus */}
                  <input
                    type="text"
                    value={starter.fullName || starter.name}
                    onChange={e => {
                      const full = e.target.value;
                      const parts = full.trim().split(' ');
                      const short = parts.length > 1 ? `${parts[0][0]}. ${parts.slice(1).join(' ')}` : full;
                      handleUpdateStarter(idx, 'fullName', full);
                      handleUpdateStarter(idx, 'name', short);
                    }}
                    onFocus={e => e.target.select()}
                    className="lineup-modal-input"
                    placeholder="Nombre del jugador"
                    style={{ fontSize: '0.82rem', padding: '0.35rem 0.6rem', height: '34px', width: '100%' }}
                  />

                  {/* Rol / Posición con auto-selección on focus */}
                  <input
                    type="text"
                    value={starter.role}
                    onChange={e => handleUpdateStarter(idx, 'role', e.target.value)}
                    onFocus={e => e.target.select()}
                    className="lineup-modal-input"
                    title="Rol táctico (ej: POR, DEF, MED, DEL)"
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.5rem', height: '34px', width: '100%' }}
                  />

                  {/* Tarjetas Amarillas con auto-reemplazo de 0 */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', background: 'rgba(234, 179, 8, 0.14)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.15rem 0.35rem', height: '34px' }} title="Tarjetas amarillas (0, 1 o 2)">
                    <span style={{ width: '8px', height: '12px', background: '#eab308', borderRadius: '2px', display: 'inline-block', flexShrink: 0 }} />
                    <AutoReplaceNumInput
                      min={0}
                      max={2}
                      value={starter.yellowCards ?? 0}
                      onChange={val => handleUpdateStarter(idx, 'yellowCards', val)}
                      style={{ width: '32px', textAlign: 'center', fontWeight: 800, padding: '0.15rem 0.1rem', fontSize: '0.82rem', height: '26px' }}
                    />
                  </div>

                  {/* Tarjeta Roja con auto-reemplazo de 0 */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', background: 'rgba(239, 68, 68, 0.14)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.15rem 0.35rem', height: '34px' }} title="Tarjeta roja (0 o 1)">
                    <span style={{ width: '8px', height: '12px', background: '#ef4444', borderRadius: '2px', display: 'inline-block', flexShrink: 0 }} />
                    <AutoReplaceNumInput
                      min={0}
                      max={1}
                      value={starter.redCards ?? 0}
                      onChange={val => handleUpdateStarter(idx, 'redCards', val)}
                      style={{ width: '32px', textAlign: 'center', fontWeight: 800, padding: '0.15rem 0.1rem', fontSize: '0.82rem', height: '26px' }}
                    />
                  </div>

                  {/* Capitán Toggle */}
                  <button
                    type="button"
                    onClick={() => handleUpdateStarter(idx, 'isCaptain', !starter.isCaptain)}
                    className="btn btn-glass"
                    style={{
                      height: '34px',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: starter.isCaptain ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      color: starter.isCaptain ? '#fbbf24' : 'var(--text-muted)',
                      border: starter.isCaptain ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
                      fontWeight: 900,
                      fontSize: '0.84rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    title="Capitán del equipo"
                  >
                    C
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Lista de Suplentes */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Layers size={16} color="var(--teal-light)" /> Suplentes ({activeLineup?.substitutes?.length || 0})
              </h4>
              <button
                type="button"
                onClick={handleAddSub}
                className="btn btn-glass"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <UserPlus size={13} /> Agregar Suplente
              </button>
            </div>

            {/* Cabecera de columnas para suplentes */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '55px 1fr 110px 75px 40px',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <span style={{ textAlign: 'center' }}>Dorsal</span>
              <span>Nombre y Apellido</span>
              <span>Posición</span>
              <span style={{ textAlign: 'center' }}>🟨 Amarillas</span>
              <span style={{ textAlign: 'center' }}>Quitar</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {(activeLineup?.substitutes || []).map((sub, sIdx) => (
                <div 
                  key={sub.id || sIdx}
                  className="lineup-player-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '55px 1fr 110px 75px 40px',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.035)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'background 0.15s ease'
                  }}
                >
                  {/* Dorsal con auto-reemplazo de 0 */}
                  <AutoReplaceNumInput
                    min={1}
                    max={99}
                    value={sub.number}
                    onChange={val => handleUpdateSub(sIdx, 'number', val || 1)}
                    style={{ textAlign: 'center', fontWeight: 800, padding: '0.35rem 0.2rem', fontSize: '0.86rem', height: '34px' }}
                    title="Dorsal suplente (1-99)"
                  />

                  {/* Nombre con auto-selección on focus */}
                  <input
                    type="text"
                    value={sub.fullName || sub.name}
                    onChange={e => {
                      const full = e.target.value;
                      const parts = full.trim().split(' ');
                      const short = parts.length > 1 ? `${parts[0][0]}. ${parts.slice(1).join(' ')}` : full;
                      handleUpdateSub(sIdx, 'fullName', full);
                      handleUpdateSub(sIdx, 'name', short);
                    }}
                    onFocus={e => e.target.select()}
                    className="lineup-modal-input"
                    placeholder="Nombre del suplente"
                    style={{ fontSize: '0.82rem', padding: '0.35rem 0.6rem', height: '34px', width: '100%' }}
                  />

                  {/* Rol */}
                  <input
                    type="text"
                    value={sub.role}
                    onChange={e => handleUpdateSub(sIdx, 'role', e.target.value)}
                    onFocus={e => e.target.select()}
                    className="lineup-modal-input"
                    title="Rol"
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.5rem', height: '34px', width: '100%' }}
                  />

                  {/* Tarjetas Amarillas con auto-reemplazo de 0 */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', background: 'rgba(234, 179, 8, 0.14)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.15rem 0.35rem', height: '34px' }} title="Tarjetas amarillas">
                    <span style={{ width: '8px', height: '12px', background: '#eab308', borderRadius: '2px', display: 'inline-block', flexShrink: 0 }} />
                    <AutoReplaceNumInput
                      min={0}
                      max={2}
                      value={sub.yellowCards ?? 0}
                      onChange={val => handleUpdateSub(sIdx, 'yellowCards', val)}
                      style={{ width: '32px', textAlign: 'center', fontWeight: 800, padding: '0.15rem 0.1rem', fontSize: '0.82rem', height: '26px' }}
                    />
                  </div>

                  {/* Eliminar suplente */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSub(sIdx)}
                    className="btn btn-danger"
                    style={{ height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)' }}
                    title="Eliminar suplente"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flexShrink: 0 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Modalidad: <strong style={{ color: 'var(--text-primary)' }}>{MODALITIES[modality]?.label}</strong> ({MODALITIES[modality]?.players} vs {MODALITIES[modality]?.players})
          </div>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              className="btn btn-glass"
              onClick={onClose}
              style={{ fontSize: '0.84rem' }}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              style={{ fontSize: '0.84rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Check size={16} /> Guardar Alineación
            </button>
          </div>
        </div>

      </div>

      {/* Scoped CSS to eliminate any harsh dark / black background */}
      <style>{`
        .edit-lineup-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 14, 24, 0.58) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 99999;
        }

        .edit-lineup-modal-container {
          width: 100%;
          max-width: 880px;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
          background: linear-gradient(180deg, #1b1e2c 0%, #141622 100%) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: var(--radius-xl) !important;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
        }

        .edit-lineup-modal-container .lineup-modal-input,
        .edit-lineup-modal-container .custom-select-trigger {
          background: rgba(255, 255, 255, 0.055) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          border-radius: var(--radius-sm) !important;
          color: #ffffff !important;
          font-family: 'Nunito', sans-serif !important;
          box-shadow: none !important;
          transition: all 0.2s ease !important;
          outline: none !important;
        }

        .edit-lineup-modal-container .lineup-modal-input:focus,
        .edit-lineup-modal-container .custom-select-trigger.open {
          background: rgba(79, 109, 245, 0.12) !important;
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(79, 109, 245, 0.25) !important;
        }

        .edit-lineup-modal-container .lineup-player-row:hover {
          background: rgba(255, 255, 255, 0.065) !important;
        }

        .edit-lineup-modal-container input::placeholder {
          color: var(--text-muted);
        }
      `}</style>
    </div>,
    document.body
  );
}
