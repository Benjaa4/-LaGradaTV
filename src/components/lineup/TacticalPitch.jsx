import { useState } from 'react';
import StackedCards from './StackedCards';
import { Shield, AlertCircle, Award } from 'lucide-react';

export default function TacticalPitch({ 
  homeTeam, 
  awayTeam, 
  homeLineup, 
  awayLineup, 
  activeView = 'home', // 'home' | 'away' | 'both'
  modality = 'f7',     // 'f5' | 'f7' | 'f11'
  homeColor = { bg: 'rgba(79, 109, 245, 0.35)', border: '#4f6df5', color: '#818cf8' },
  awayColor = { bg: 'rgba(225, 95, 65, 0.35)', border: '#e15f41', color: '#f87171' }
}) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Determinar qué jugadores renderizar según el modo de vista
  let playersToRender = [];

  if (activeView === 'home' && homeLineup) {
    playersToRender = homeLineup.starting.map(p => ({
      ...p,
      teamType: 'home',
      kitColor: homeColor,
      teamName: homeTeam?.name || 'Local'
    }));
  } else if (activeView === 'away' && awayLineup) {
    playersToRender = awayLineup.starting.map(p => ({
      ...p,
      teamType: 'away',
      kitColor: awayColor,
      teamName: awayTeam?.name || 'Visitante'
    }));
  } else if (activeView === 'both' && homeLineup && awayLineup) {
    // Vista completa frente a frente
    const homeAdjusted = homeLineup.starting.map(p => ({
      ...p,
      x: p.x,
      y: 52 + (p.y / 100) * 42, // Escala entre 52% y 94%
      teamType: 'home',
      kitColor: homeColor,
      teamName: homeTeam?.name || 'Local'
    }));

    const awayAdjusted = awayLineup.starting.map(p => ({
      ...p,
      x: 100 - p.x, // Espejo horizontal para perspectiva táctica
      y: 48 - (p.y / 100) * 42, // Escala entre 6% y 48%
      teamType: 'away',
      kitColor: awayColor,
      teamName: awayTeam?.name || 'Visitante'
    }));

    playersToRender = [...homeAdjusted, ...awayAdjusted];
  }

  return (
    <div className="tactical-pitch-wrapper">
      {/* Campo de Juego Táctico Adaptativo */}
      <div className={`soccer-pitch pitch-${modality}`}>
        {/* Marcaciones de Cancha en SVG */}
        <svg className="pitch-markings" viewBox="0 0 100 135" preserveAspectRatio="none">
          {/* Borde exterior */}
          <rect x="4" y="4" width="92" height="127" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          
          {/* Línea de medio campo */}
          <line x1="4" y1="67.5" x2="96" y2="67.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          
          {/* Círculo central */}
          <circle cx="50" cy="67.5" r={modality === 'f5' ? 10 : 13} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <circle cx="50" cy="67.5" r="1" fill="rgba(255,255,255,0.5)" />

          {/* Marcaciones específicas según F5, F7, F11 */}
          {modality === 'f5' ? (
            <>
              {/* Área F5 Arriba (Semicírculo 6m / Futsal D-box) */}
              <path d="M 28 4 A 22 17 0 0 0 72 4" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="0.8" />
              <circle cx="50" cy="18" r="0.9" fill="rgba(255,255,255,0.6)" />
              <rect x="42" y="1.2" width="16" height="2.8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />

              {/* Área F5 Abajo */}
              <path d="M 28 131 A 22 17 0 0 1 72 131" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="0.8" />
              <circle cx="50" cy="117" r="0.9" fill="rgba(255,255,255,0.6)" />
              <rect x="42" y="131" width="16" height="2.8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
            </>
          ) : modality === 'f7' ? (
            <>
              {/* Área F7 Arriba */}
              <rect x="24" y="4" width="52" height="19" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="50" cy="17" r="0.9" fill="rgba(255,255,255,0.6)" />
              <path d="M 40 23 A 10 10 0 0 0 60 23" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <rect x="42" y="1.2" width="16" height="2.8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />

              {/* Área F7 Abajo */}
              <rect x="24" y="112" width="52" height="19" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="50" cy="118" r="0.9" fill="rgba(255,255,255,0.6)" />
              <path d="M 40 112 A 10 10 0 0 1 60 112" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <rect x="42" y="131" width="16" height="2.8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
            </>
          ) : (
            <>
              {/* Área F11 Arriba */}
              <rect x="23" y="4" width="54" height="22" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <rect x="36" y="4" width="28" height="8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="50" cy="18" r="0.9" fill="rgba(255,255,255,0.6)" />
              <path d="M 39 26 A 11 11 0 0 0 61 26" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <rect x="42" y="1.2" width="16" height="2.8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />

              {/* Área F11 Abajo */}
              <rect x="23" y="109" width="54" height="22" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <rect x="36" y="123" width="28" height="8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="50" cy="117" r="0.9" fill="rgba(255,255,255,0.6)" />
              <path d="M 39 109 A 11 11 0 0 1 61 109" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <rect x="42" y="131" width="16" height="2.8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
            </>
          )}

          {/* Córners */}
          <path d="M 4 7 A 3 3 0 0 0 7 4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <path d="M 93 4 A 3 3 0 0 0 96 7" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <path d="M 4 128 A 3 3 0 0 1 7 131" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <path d="M 93 131 A 3 3 0 0 1 96 128" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        </svg>

        {/* Jugadores en Cancha */}
        <div className="pitch-players-layer">
          {playersToRender.map((p) => {
            const hasCards = p.yellowCards > 0 || p.redCards > 0 || p.priorYellowCount >= 4;

            return (
              <div 
                key={p.id}
                className={`pitch-player-node ${selectedPlayer?.id === p.id ? 'is-selected' : ''}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                onClick={() => setSelectedPlayer(p)}
                title={`${p.number} - ${p.name} (${p.role})`}
              >
                {/* Avatar / Dorsal circular */}
                <div 
                  className="player-token"
                  style={{
                    background: p.kitColor.border,
                    borderColor: '#ffffff',
                    boxShadow: selectedPlayer?.id === p.id 
                      ? '0 0 14px #ffffff, 0 4px 10px rgba(0,0,0,0.6)' 
                      : '0 3px 8px rgba(0,0,0,0.45)'
                  }}
                >
                  <span className="player-dorsal">{p.number}</span>

                  {/* Brazalete de Capitán */}
                  {p.isCaptain && (
                    <span className="captain-badge" title="Capitán del equipo">C</span>
                  )}

                  {/* Tarjetas superpuestas sobre el token */}
                  {hasCards && (
                    <div className="player-cards-badge">
                      <StackedCards 
                        yellowCards={p.yellowCards} 
                        redCards={p.redCards} 
                        priorYellowCount={p.priorYellowCount} 
                        size="sm" 
                      />
                    </div>
                  )}
                </div>

                {/* Etiqueta de Nombre y Rol */}
                <div className="player-label-wrap">
                  <span className="player-name-tag">{p.name}</span>
                  {activeView !== 'both' && (
                    <span className="player-role-tag">{p.pos}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal / Ficha rápida de jugador seleccionado */}
      {selectedPlayer && (
        <div className="player-quick-card glass-panel animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div 
                style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '50%', 
                  background: selectedPlayer.kitColor.border, 
                  color: '#ffffff',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 900, 
                  fontSize: '1.2rem',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.4)'
                }}
              >
                {selectedPlayer.number}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedPlayer.fullName || selectedPlayer.name}
                  {selectedPlayer.isCaptain && <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', color: '#fbbf24' }}>(Capitán)</span>}
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {selectedPlayer.role} · {selectedPlayer.teamName}
                </p>
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-glass btn-sm"
              onClick={() => setSelectedPlayer(null)}
              style={{ padding: '0.35rem 0.75rem' }}
            >
              Cerrar
            </button>
          </div>

          {/* Sanciones y Estado Disciplinario */}
          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--nm-border)', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sanciones en partido:</span>
              {(selectedPlayer.yellowCards > 0 || selectedPlayer.redCards > 0) ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <StackedCards 
                    yellowCards={selectedPlayer.yellowCards} 
                    redCards={selectedPlayer.redCards} 
                    size="md" 
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedPlayer.redCards > 0 ? '#f87171' : '#facc15' }}>
                    {selectedPlayer.redCards > 0 ? 'Expulsado' : `${selectedPlayer.yellowCards} Amarilla${selectedPlayer.yellowCards > 1 ? 's' : ''}`}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Limpio / Sin tarjetas</span>
              )}
            </div>

            {selectedPlayer.priorYellowCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Acumulación previa:</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedPlayer.priorYellowCount >= 4 ? '#fbbf24' : 'var(--text-secondary)' }}>
                  {selectedPlayer.priorYellowCount} amarillas {selectedPlayer.priorYellowCount >= 4 && '(En capilla)'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Estilos del campo táctico */}
      <style>{`
        .tactical-pitch-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .soccer-pitch {
          position: relative;
          width: 100%;
          max-width: 580px;
          margin: 0 auto;
          aspect-ratio: 100 / 135;
          min-height: 480px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: repeating-linear-gradient(
            to bottom,
            #143525 0px,
            #143525 36px,
            #0f2c1e 36px,
            #0f2c1e 72px
          );
          box-shadow: 
            inset 0 0 45px rgba(0, 0, 0, 0.7),
            0 8px 30px rgba(0, 0, 0, 0.45);
          border: 3px solid rgba(255, 255, 255, 0.12);
        }

        .pitch-markings {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .pitch-players-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .pitch-player-node {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          user-select: none;
          z-index: 10;
          transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), z-index 0.1s;
        }

        .pitch-player-node:hover {
          transform: translate(-50%, -55%) scale(1.08);
          z-index: 30;
        }

        .pitch-player-node.is-selected {
          transform: translate(-50%, -55%) scale(1.12);
          z-index: 35;
        }

        .player-token {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .player-dorsal {
          color: #ffffff;
          font-weight: 900;
          font-size: 0.96rem;
          font-family: 'Nunito', sans-serif;
          line-height: 1;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        }

        .captain-badge {
          position: absolute;
          bottom: -3px;
          left: -4px;
          background: #fbbf24;
          color: #18181b;
          font-weight: 900;
          font-size: 0.55rem;
          padding: 1px 3.5px;
          border-radius: 3px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.5);
          line-height: 1;
        }

        .player-cards-badge {
          position: absolute;
          top: -7px;
          right: -8px;
          z-index: 5;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));
        }

        .player-label-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
          margin-top: 3px;
        }

        .player-name-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          background: rgba(12, 14, 18, 0.88);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
          max-width: 85px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .player-role-tag {
          font-size: 0.58rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.65);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }

        .player-quick-card {
          max-width: 580px;
          margin: 0 auto;
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-lg);
          background: var(--bg-card);
          border: 1px solid var(--nm-border);
          box-shadow: var(--nm-shadow-raised);
        }

        @media (max-width: 600px) {
          .player-token {
            width: 32px;
            height: 32px;
          }
          .player-dorsal {
            font-size: 0.85rem;
          }
          .player-name-tag {
            font-size: 0.64rem;
            padding: 0.1rem 0.35rem;
            max-width: 65px;
          }
        }
      `}</style>
    </div>
  );
}
