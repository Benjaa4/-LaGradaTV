/**
 * lineupUtils.js
 * Generador y parser de alineaciones tácticas, formaciones, suplentes y sanciones disciplinarias.
 */

// Formaciones tácticas estándar con coordenadas normalizadas en cancha (%)
export const FORMATIONS = {
  '4-3-3': {
    name: '4-3-3 Ofensivo',
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
    name: '4-4-2 Clásico',
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
    name: '4-2-3-1 Moderno',
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
    name: '3-5-2 Dinámico',
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

// Nombres y apellidos creíbles para fútbol
const FIRST_NAMES = ['Matías', 'Lucas', 'Joaquín', 'Nicolás', 'Agustín', 'Tomás', 'Santiago', 'Mateo', 'Franco', 'Gonzalo', 'Julián', 'Rodrigo', 'Facundo', 'Lautaro', 'Ignacio', 'Enzo', 'Bautista', 'Cristian', 'Nahuel', 'Gabriel', 'Maximiliano', 'Emanuel'];
const LAST_NAMES = ['Martínez', 'Gómez', 'Rodríguez', 'Fernández', 'López', 'Díaz', 'Pérez', 'Sánchez', 'Romero', 'Álvarez', 'Torres', 'Ruiz', 'Ramírez', 'Flores', 'Benítez', 'Acosta', 'Medina', 'Herrera', 'Aguirre', 'Pereyra', 'Gutiérrez', 'Giménez', 'Molina', 'Castro', 'Suárez', 'Silva'];

// Seeded random determinístico basado en cadena de texto
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
 * Obtiene o genera la alineación completa para un partido y equipo
 */
export function getMatchLineup(match, team, isHome = true) {
  if (!match || !team) return null;

  // Si el partido ya tiene alineaciones guardadas en DB
  if (match.lineups) {
    try {
      const parsed = typeof match.lineups === 'string' ? JSON.parse(match.lineups) : match.lineups;
      const key = isHome ? 'home' : 'away';
      if (parsed[key] && parsed[key].starting?.length > 0) {
        return parsed[key];
      }
    } catch (e) {
      console.error('Error parseando alineaciones de partido:', e);
    }
  }

  // Generación determinística realista basada en ID del partido + ID de equipo
  const seedKey = `${match.id}_${team.id || team.name}_${isHome ? 'H' : 'A'}`;
  const rand = seededRandom(seedKey);

  const formationKeys = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2'];
  const formationKey = formationKeys[Math.floor(rand() * formationKeys.length)];
  const formationMeta = FORMATIONS[formationKey];

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

    // Sanciones simuladas (tarjetas amarillas y rojas)
    // ~20% de probabilidad de tener 1 amarilla, ~3% de tener 2 amarillas (o roja)
    const cardRoll = rand();
    let yellowCards = 0;
    let redCards = 0;
    let priorYellowCount = 0; // Tarjetas con las que llega al partido

    if (cardRoll < 0.03) {
      redCards = 1;
      yellowCards = rand() > 0.5 ? 1 : 0;
    } else if (cardRoll < 0.22) {
      yellowCards = 1;
    }

    // Sanciones con las que llega al partido
    const priorRoll = rand();
    if (priorRoll < 0.15) {
      priorYellowCount = 4; // Al borde de suspensión
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
      isCaptain: index === 3 || index === 6
    };
  });

  // Generar suplentes (6-7 jugadores en banca)
  const subRoles = [
    { role: 'Arquero Suplente', pos: 'PO', prefNum: 12 },
    { role: 'Defensor Central', pos: 'DEF', prefNum: 13 },
    { role: 'Lateral Polifuncional', pos: 'DEF', prefNum: 14 },
    { role: 'Mediocentro de Contención', pos: 'MED', prefNum: 15 },
    { role: 'Volante Mixto', pos: 'MED', prefNum: 16 },
    { role: 'Extremo / Delantero', pos: 'DEL', prefNum: 18 },
    { role: 'Centrodelantero', pos: 'DEL', prefNum: 20 },
  ];

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
      priorYellowCount: rand() < 0.12 ? 3 : 0
    };
  });

  // Director Técnico
  const dtFirst = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
  const dtLast = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];

  return {
    teamId: team.id,
    teamName: team.name,
    formation: formationKey,
    formationName: formationMeta.name,
    coach: `DT. ${dtFirst} ${dtLast}`,
    starting: starters,
    substitutes: substitutes
  };
}
