/**
 * lineupUtils.js
 * Generador, editor y parser de alineaciones tácticas para Fútbol 5 (F5), Fútbol 7 (F7) y Fútbol 11 (F11).
 */

export const MODALITIES = {
  f5: { key: 'f5', label: 'Fútbol 5', players: 5, defaultFormation: '1-2-1', tag: 'F5' },
  f7: { key: 'f7', label: 'Fútbol 7', players: 7, defaultFormation: '2-3-1', tag: 'F7' },
  f11: { key: 'f11', label: 'Fútbol 11', players: 11, defaultFormation: '4-3-3', tag: 'F11' },
};

// Formaciones tácticas normalizadas con coordenadas en cancha (%)
export const FORMATIONS = {
  // ── FÚTBOL 5 (5 Jugadores) ──
  '1-2-1': {
    name: '1-2-1 Rombo (F5)',
    modality: 'f5',
    slots: [
      { role: 'Arquero', pos: 'PO', x: 50, y: 88 },
      { role: 'Cierre / Líbero', pos: 'DEF', x: 50, y: 68 },
      { role: 'Ala Izquierda', pos: 'MED', x: 22, y: 46 },
      { role: 'Ala Derecha', pos: 'MED', x: 78, y: 46 },
      { role: 'Pívot / Delantero', pos: 'DEL', x: 50, y: 20 },
    ]
  },
  '2-2': {
    name: '2-2 Cuadrado (F5)',
    modality: 'f5',
    slots: [
      { role: 'Arquero', pos: 'PO', x: 50, y: 88 },
      { role: 'Defensa Izquierdo', pos: 'DEF', x: 30, y: 66 },
      { role: 'Defensa Derecho', pos: 'DEF', x: 70, y: 66 },
      { role: 'Delantero Izquierdo', pos: 'DEL', x: 32, y: 24 },
      { role: 'Delantero Derecho', pos: 'DEL', x: 68, y: 24 },
    ]
  },
  '2-1-1': {
    name: '2-1-1 Pirámide (F5)',
    modality: 'f5',
    slots: [
      { role: 'Arquero', pos: 'PO', x: 50, y: 88 },
      { role: 'Defensa Izquierdo', pos: 'DEF', x: 28, y: 68 },
      { role: 'Defensa Derecho', pos: 'DEF', x: 72, y: 68 },
      { role: 'Mediocampista', pos: 'MED', x: 50, y: 46 },
      { role: 'Pívot Goleador', pos: 'DEL', x: 50, y: 18 },
    ]
  },
  '1-1-2': {
    name: '1-1-2 Ofensivo (F5)',
    modality: 'f5',
    slots: [
      { role: 'Arquero', pos: 'PO', x: 50, y: 88 },
      { role: 'Cierre', pos: 'DEF', x: 50, y: 72 },
      { role: 'Mediapunta', pos: 'MED', x: 50, y: 48 },
      { role: 'Extremo Izquierdo', pos: 'DEL', x: 30, y: 20 },
      { role: 'Extremo Derecho', pos: 'DEL', x: 70, y: 20 },
    ]
  },

  // ── FÚTBOL 7 (7 Jugadores) ──
  '2-3-1': {
    name: '2-3-1 Clásico (F7)',
    modality: 'f7',
    slots: [
      { role: 'Arquero', pos: 'PO', x: 50, y: 88 },
      { role: 'Defensa Izquierdo', pos: 'DEF', x: 30, y: 72 },
      { role: 'Defensa Derecho', pos: 'DEF', x: 70, y: 72 },
      { role: 'Volante Izquierdo', pos: 'MED', x: 20, y: 46 },
      { role: 'Mediocentro', pos: 'MED', x: 50, y: 48 },
      { role: 'Volante Derecho', pos: 'MED', x: 80, y: 46 },
      { role: 'Delantero Centro', pos: 'DEL', x: 50, y: 18 },
    ]
  },
  '3-2-1': {
    name: '3-2-1 Equilibrado (F7)',
    modality: 'f7',
    slots: [
      { role: 'Arquero', pos: 'PO', x: 50, y: 88 },
      { role: 'Lateral Izquierdo', pos: 'DEF', x: 20, y: 72 },
      { role: 'Defensa Central', pos: 'DEF', x: 50, y: 75 },
      { role: 'Lateral Derecho', pos: 'DEF', x: 80, y: 72 },
      { role: 'Mediocentro', pos: 'MED', x: 35, y: 46 },
      { role: 'Mediocentro', pos: 'MED', x: 65, y: 46 },
      { role: 'Delantero Centro', pos: 'DEL', x: 50, y: 18 },
    ]
  },
  '2-2-2': {
    name: '2-2-2 Tándem (F7)',
    modality: 'f7',
    slots: [
      { role: 'Arquero', pos: 'PO', x: 50, y: 88 },
      { role: 'Defensa Izquierdo', pos: 'DEF', x: 30, y: 72 },
      { role: 'Defensa Derecho', pos: 'DEF', x: 70, y: 72 },
      { role: 'Mediocampista', pos: 'MED', x: 30, y: 48 },
      { role: 'Mediocampista', pos: 'MED', x: 70, y: 48 },
      { role: 'Delantero Izquierdo', pos: 'DEL', x: 34, y: 20 },
      { role: 'Delantero Derecho', pos: 'DEL', x: 66, y: 20 },
    ]
  },
  '3-1-2': {
    name: '3-1-2 Con Doble Punta (F7)',
    modality: 'f7',
    slots: [
      { role: 'Arquero', pos: 'PO', x: 50, y: 88 },
      { role: 'Stopper Izquierdo', pos: 'DEF', x: 20, y: 72 },
      { role: 'Líbero', pos: 'DEF', x: 50, y: 75 },
      { role: 'Stopper Derecho', pos: 'DEF', x: 80, y: 72 },
      { role: 'Pivote Central', pos: 'MED', x: 50, y: 46 },
      { role: 'Delantero Izquierdo', pos: 'DEL', x: 34, y: 20 },
      { role: 'Delantero Derecho', pos: 'DEL', x: 66, y: 20 },
    ]
  },
  '1-4-1': {
    name: '1-4-1 Línea Media (F7)',
    modality: 'f7',
    slots: [
      { role: 'Arquero', pos: 'PO', x: 50, y: 88 },
      { role: 'Defensa Central', pos: 'DEF', x: 50, y: 74 },
      { role: 'Carrilero Izquierdo', pos: 'MED', x: 16, y: 48 },
      { role: 'Medio Defensivo', pos: 'MED', x: 38, y: 48 },
      { role: 'Medio Ofensivo', pos: 'MED', x: 62, y: 48 },
      { role: 'Carrilero Derecho', pos: 'MED', x: 84, y: 48 },
      { role: 'Delantero', pos: 'DEL', x: 50, y: 18 },
    ]
  },

  // ── FÚTBOL 11 (11 Jugadores) ──
  '4-3-3': {
    name: '4-3-3 Ofensivo (F11)',
    modality: 'f11',
    slots: [
      { role: 'Arquero', pos: 'PO', x: 50, y: 88 },
      { role: 'Lateral Izq.', pos: 'DEF', x: 16, y: 70 },
      { role: 'Defensa Central', pos: 'DEF', x: 38, y: 73 },
      { role: 'Defensa Central', pos: 'DEF', x: 62, y: 73 },
      { role: 'Lateral Der.', pos: 'DEF', x: 84, y: 70 },
      { role: 'Mediocampista', pos: 'MED', x: 28, y: 48 },
      { role: 'Pivote Defensivo', pos: 'MED', x: 50, y: 53 },
      { role: 'Mediocampista', pos: 'MED', x: 72, y: 48 },
      { role: 'Extremo Izq.', pos: 'DEL', x: 20, y: 22 },
      { role: 'Delantero Centro', pos: 'DEL', x: 50, y: 15 },
      { role: 'Extremo Der.', pos: 'DEL', x: 80, y: 22 },
    ]
  },
  '4-4-2': {
    name: '4-4-2 Clásico (F11)',
    modality: 'f11',
    slots: [
      { role: 'Arquero', pos: 'PO', x: 50, y: 88 },
      { role: 'Lateral Izq.', pos: 'DEF', x: 16, y: 70 },
      { role: 'Defensa Central', pos: 'DEF', x: 38, y: 73 },
      { role: 'Defensa Central', pos: 'DEF', x: 62, y: 73 },
      { role: 'Lateral Der.', pos: 'DEF', x: 84, y: 70 },
      { role: 'Volante Izq.', pos: 'MED', x: 18, y: 45 },
      { role: 'Mediocampista', pos: 'MED', x: 40, y: 48 },
      { role: 'Mediocampista', pos: 'MED', x: 60, y: 48 },
      { role: 'Volante Der.', pos: 'MED', x: 82, y: 45 },
      { role: 'Segundo Delantero', pos: 'DEL', x: 38, y: 18 },
      { role: 'Centro Delantero', pos: 'DEL', x: 62, y: 18 },
    ]
  },
  '4-2-3-1': {
    name: '4-2-3-1 Moderno (F11)',
    modality: 'f11',
    slots: [
      { role: 'Arquero', pos: 'PO', x: 50, y: 88 },
      { role: 'Lateral Izq.', pos: 'DEF', x: 16, y: 71 },
      { role: 'Defensa Central', pos: 'DEF', x: 38, y: 74 },
      { role: 'Defensa Central', pos: 'DEF', x: 62, y: 74 },
      { role: 'Lateral Der.', pos: 'DEF', x: 84, y: 71 },
      { role: 'Doble Cinco', pos: 'MED', x: 36, y: 55 },
      { role: 'Doble Cinco', pos: 'MED', x: 64, y: 55 },
      { role: 'Extremo Izq.', pos: 'MED', x: 20, y: 35 },
      { role: 'Enganche / Mediapunta', pos: 'MED', x: 50, y: 32 },
      { role: 'Extremo Der.', pos: 'MED', x: 80, y: 35 },
      { role: 'Centrodelantero', pos: 'DEL', x: 50, y: 15 },
    ]
  },
  '3-5-2': {
    name: '3-5-2 Dinámico (F11)',
    modality: 'f11',
    slots: [
      { role: 'Arquero', pos: 'PO', x: 50, y: 88 },
      { role: 'Stopper Izq.', pos: 'DEF', x: 26, y: 72 },
      { role: 'Líbero Central', pos: 'DEF', x: 50, y: 74 },
      { role: 'Stopper Der.', pos: 'DEF', x: 74, y: 72 },
      { role: 'Carrilero Izq.', pos: 'MED', x: 14, y: 48 },
      { role: 'Mediocentro', pos: 'MED', x: 36, y: 50 },
      { role: 'Volante Central', pos: 'MED', x: 50, y: 44 },
      { role: 'Mediocentro', pos: 'MED', x: 64, y: 50 },
      { role: 'Carrilero Der.', pos: 'MED', x: 86, y: 48 },
      { role: 'Delantero', pos: 'DEL', x: 38, y: 18 },
      { role: 'Delantero', pos: 'DEL', x: 62, y: 18 },
    ]
  }
};

export const FORMATIONS_BY_MODALITY = {
  f5: ['1-2-1', '2-2', '2-1-1', '1-1-2'],
  f7: ['2-3-1', '3-2-1', '2-2-2', '3-1-2', '1-4-1'],
  f11: ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2']
};

export const FIRST_NAMES = ['Matías', 'Lucas', 'Joaquín', 'Nicolás', 'Agustín', 'Tomás', 'Santiago', 'Mateo', 'Franco', 'Gonzalo', 'Julián', 'Rodrigo', 'Facundo', 'Lautaro', 'Ignacio', 'Enzo', 'Bautista', 'Cristian', 'Nahuel', 'Gabriel', 'Maximiliano', 'Emanuel', 'Diego', 'Federico', 'Leandro'];
export const LAST_NAMES = ['Martínez', 'Gómez', 'Rodríguez', 'Fernández', 'López', 'Díaz', 'Pérez', 'Sánchez', 'Romero', 'Álvarez', 'Torres', 'Ruiz', 'Ramírez', 'Flores', 'Benítez', 'Acosta', 'Medina', 'Herrera', 'Aguirre', 'Pereyra', 'Gutiérrez', 'Giménez', 'Molina', 'Castro', 'Suárez', 'Silva'];

function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = Math.imul(31, hash) + seed.charCodeAt(i) | 0;
  }
  return function() {
    hash = Math.imul(16807, hash) | 0;
    return (hash & 0x7fffffff) / 0x7fffffff;
  };
}

/**
 * Genera o recupera la alineación completa para un partido y equipo
 */
export function getMatchLineup(match, team, isHome = true, overrideModality = null) {
  if (!match || !team) return null;

  const modalityKey = overrideModality || match.match_type || 'f7';
  const modalityMeta = MODALITIES[modalityKey] || MODALITIES.f7;

  // 1. Si el partido ya tiene alineaciones guardadas en DB
  if (match.lineups) {
    try {
      const parsed = typeof match.lineups === 'string' ? JSON.parse(match.lineups) : match.lineups;
      const key = isHome ? 'home' : 'away';
      if (parsed[key] && parsed[key].starting && parsed[key].starting.length > 0) {
        // Asegurar que formation tenga slots válidos
        const formationKey = parsed[key].formation || modalityMeta.defaultFormation;
        const formationMeta = FORMATIONS[formationKey] || FORMATIONS[modalityMeta.defaultFormation];
        
        // Asignar coordenadas a los titulares si les faltasen
        const startersWithCoords = parsed[key].starting.map((player, idx) => {
          const slot = formationMeta?.slots?.[idx] || { x: 50, y: 50, role: player.role || 'Jugador', pos: player.pos || 'MED' };
          return {
            ...player,
            role: player.role || slot.role,
            pos: player.pos || slot.pos,
            x: player.x !== undefined ? player.x : slot.x,
            y: player.y !== undefined ? player.y : slot.y,
          };
        });

        return {
          ...parsed[key],
          modality: modalityKey,
          formation: formationKey,
          formationName: formationMeta?.name || formationKey,
          starting: startersWithCoords,
          substitutes: parsed[key].substitutes || []
        };
      }
    } catch (e) {
      console.error('Error parseando alineaciones guardadas:', e);
    }
  }

  // 2. Generación determinística realista según modalidad (F5, F7, F11)
  const seedKey = `${match.id}_${team.id || team.name}_${isHome ? 'H' : 'A'}_${modalityKey}`;
  const rand = seededRandom(seedKey);

  const availableFormations = FORMATIONS_BY_MODALITY[modalityKey] || FORMATIONS_BY_MODALITY.f7;
  const formationKey = availableFormations[Math.floor(rand() * availableFormations.length)];
  const formationMeta = FORMATIONS[formationKey] || FORMATIONS[modalityMeta.defaultFormation];

  // Generar titulares
  const usedNumbers = new Set([1]);
  const starters = formationMeta.slots.map((slot, index) => {
    let dorsal = index === 0 ? 1 : Math.floor(rand() * 25) + 2;
    while (usedNumbers.has(dorsal)) {
      dorsal = Math.floor(rand() * 30) + 2;
    }
    usedNumbers.add(dorsal);

    const fName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const lName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const shortName = `${fName[0]}. ${lName}`;

    // Sanciones simuladas
    const cardRoll = rand();
    let yellowCards = 0;
    let redCards = 0;
    let priorYellowCount = 0;

    if (cardRoll < 0.03) {
      redCards = 1;
      yellowCards = rand() > 0.5 ? 1 : 0;
    } else if (cardRoll < 0.22) {
      yellowCards = 1;
    }

    const priorRoll = rand();
    if (priorRoll < 0.15) {
      priorYellowCount = 4;
    } else if (priorRoll < 0.35) {
      priorYellowCount = 2;
    }

    return {
      id: `${team.id || 't'}_st_${index}`,
      number: dorsal,
      name: shortName,
      fullName: `${fName} ${lName}`,
      role: slot.role,
      pos: slot.pos,
      x: slot.x,
      y: slot.y,
      yellowCards,
      redCards,
      priorYellowCount,
      isCaptain: index === Math.min(2, formationMeta.slots.length - 1)
    };
  });

  // Generar suplentes (3 a 5 jugadores en banca según modalidad)
  const numSubs = modalityKey === 'f5' ? 4 : modalityKey === 'f7' ? 5 : 7;
  const subRoles = [
    { role: 'Arquero Suplente', pos: 'PO', prefNum: 12 },
    { role: 'Defensa Polifuncional', pos: 'DEF', prefNum: 13 },
    { role: 'Mediocampista Mixto', pos: 'MED', prefNum: 14 },
    { role: 'Extremo / Delantero', pos: 'DEL', prefNum: 15 },
    { role: 'Centrodelantero', pos: 'DEL', prefNum: 16 },
    { role: 'Defensa de Recambio', pos: 'DEF', prefNum: 17 },
    { role: 'Volante Creativo', pos: 'MED', prefNum: 18 },
  ].slice(0, numSubs);

  const substitutes = subRoles.map((sub, idx) => {
    let dorsal = sub.prefNum;
    while (usedNumbers.has(dorsal)) {
      dorsal = Math.floor(rand() * 40) + 12;
    }
    usedNumbers.add(dorsal);

    const fName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const lName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];

    const subCardRoll = rand();
    const yellowCards = subCardRoll < 0.08 ? 1 : 0;

    return {
      id: `${team.id || 't'}_sub_${idx}`,
      number: dorsal,
      name: `${fName[0]}. ${lName}`,
      fullName: `${fName} ${lName}`,
      role: sub.role,
      pos: sub.pos,
      yellowCards,
      redCards: 0,
      priorYellowCount: rand() < 0.1 ? 3 : 0
    };
  });

  // Director Técnico
  const dtFirst = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
  const dtLast = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];

  return {
    teamId: team.id,
    teamName: team.name,
    modality: modalityKey,
    formation: formationKey,
    formationName: formationMeta.name,
    coach: `DT. ${dtFirst} ${dtLast}`,
    starting: starters,
    substitutes: substitutes
  };
}
