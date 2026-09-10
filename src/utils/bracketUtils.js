/**
 * bracketUtils.js
 * Utilidades para el Sistema 2 de Identificadores Semánticos de Llaves
 * (O1-O8 para Octavos, C1-C4 para Cuartos, S1-S2 para Semifinales, F1 para Final).
 */

export const BRACKET_ROUNDS = {
  round_of_16: {
    key: 'round_of_16',
    label: 'Octavos de Final',
    shortLabel: 'Octavos',
    prefix: 'O',
    slots: 8
  },
  quarterfinal: {
    key: 'quarterfinal',
    label: 'Cuartos de Final',
    shortLabel: 'Cuartos',
    prefix: 'C',
    slots: 4
  },
  semifinal: {
    key: 'semifinal',
    label: 'Semifinales',
    shortLabel: 'Semis',
    prefix: 'S',
    slots: 2
  },
  final: {
    key: 'final',
    label: 'Gran Final',
    shortLabel: 'Final',
    prefix: 'F',
    slots: 1
  }
};

/**
 * Obtener código semántico a partir de la ronda y el orden (0-indexed).
 * Ej: ('quarterfinal', 0) -> 'C1', ('semifinal', 1) -> 'S2'
 */
export function getBracketCode(round, matchOrder = 0) {
  const meta = BRACKET_ROUNDS[round];
  if (!meta) return null;
  return `${meta.prefix}${(matchOrder ?? 0) + 1}`;
}

/**
 * Mapeo explícito y directo de progresión de ganadores en el cuadro.
 * Cero matemáticas confusas: cada código tiene su destino y casillero (home o away).
 */
export const BRACKET_PROGRESSION_MAP = {
  // Octavos avanzan a Cuartos
  'O1': { nextRound: 'quarterfinal', nextOrder: 0, nextCode: 'C1', slot: 'home', nextLabel: 'Cuartos 1 (Local)' },
  'O2': { nextRound: 'quarterfinal', nextOrder: 0, nextCode: 'C1', slot: 'away', nextLabel: 'Cuartos 1 (Visitante)' },
  'O3': { nextRound: 'quarterfinal', nextOrder: 1, nextCode: 'C2', slot: 'home', nextLabel: 'Cuartos 2 (Local)' },
  'O4': { nextRound: 'quarterfinal', nextOrder: 1, nextCode: 'C2', slot: 'away', nextLabel: 'Cuartos 2 (Visitante)' },
  'O5': { nextRound: 'quarterfinal', nextOrder: 2, nextCode: 'C3', slot: 'home', nextLabel: 'Cuartos 3 (Local)' },
  'O6': { nextRound: 'quarterfinal', nextOrder: 2, nextCode: 'C3', slot: 'away', nextLabel: 'Cuartos 3 (Visitante)' },
  'O7': { nextRound: 'quarterfinal', nextOrder: 3, nextCode: 'C4', slot: 'home', nextLabel: 'Cuartos 4 (Local)' },
  'O8': { nextRound: 'quarterfinal', nextOrder: 3, nextCode: 'C4', slot: 'away', nextLabel: 'Cuartos 4 (Visitante)' },

  // Cuartos avanzan a Semifinales
  'C1': { nextRound: 'semifinal', nextOrder: 0, nextCode: 'S1', slot: 'home', nextLabel: 'Semifinal 1 (Local)' },
  'C2': { nextRound: 'semifinal', nextOrder: 0, nextCode: 'S1', slot: 'away', nextLabel: 'Semifinal 1 (Visitante)' },
  'C3': { nextRound: 'semifinal', nextOrder: 1, nextCode: 'S2', slot: 'home', nextLabel: 'Semifinal 2 (Local)' },
  'C4': { nextRound: 'semifinal', nextOrder: 1, nextCode: 'S2', slot: 'away', nextLabel: 'Semifinal 2 (Visitante)' },

  // Semifinales avanzan a la Gran Final
  'S1': { nextRound: 'final', nextOrder: 0, nextCode: 'F1', slot: 'home', nextLabel: 'Gran Final (Local)' },
  'S2': { nextRound: 'final', nextOrder: 0, nextCode: 'F1', slot: 'away', nextLabel: 'Gran Final (Visitante)' }
};

/**
 * Obtener la regla de avance para un partido dado
 */
export function getNextProgression(round, matchOrder, bracketCode) {
  const code = bracketCode || getBracketCode(round, matchOrder);
  return BRACKET_PROGRESSION_MAP[code] || null;
}

/**
 * Obtener etiqueta amigable del cruce siguiente para badges en la UI
 */
export function getNextProgressionLabel(round, matchOrder, bracketCode) {
  const prog = getNextProgression(round, matchOrder, bracketCode);
  if (prog) {
    return `➔ Ganador avanza a ${prog.nextLabel}`;
  }
  if (round === 'final') {
    return '🏆 Ganador se corona Campeón';
  }
  return null;
}

/**
 * Obtener nombre legible de una llave.
 * Ej: 'C1' -> 'Cuartos 1 (C1)'
 */
export function getBracketLabel(code) {
  if (!code) return '';
  const prefix = code[0]?.toUpperCase();
  const num = code.slice(1);
  switch (prefix) {
    case 'O': return `Octavos ${num} (${code})`;
    case 'C': return `Cuartos ${num} (${code})`;
    case 'S': return `Semifinal ${num} (${code})`;
    case 'F': return `Gran Final (${code})`;
    default: return code;
  }
}

/**
 * Obtener texto de reemplazo para casilleros TBD ("Por definir") según
 * la llave previa que alimenta a este partido.
 */
export function getSlotFeederPlaceholder(round, matchOrder = 0, slot = 'home', presentRounds = []) {
  const hasOctavos = presentRounds.includes('round_of_16');
  const hasCuartos = presentRounds.includes('quarterfinal');
  const hasSemis = presentRounds.includes('semifinal');

  if (round === 'quarterfinal' && hasOctavos) {
    const homeCode = `O${matchOrder * 2 + 1}`;
    const awayCode = `O${matchOrder * 2 + 2}`;
    return slot === 'home' ? `Ganador ${homeCode}` : `Ganador ${awayCode}`;
  }

  if (round === 'semifinal' && hasCuartos) {
    const homeCode = `C${matchOrder * 2 + 1}`;
    const awayCode = `C${matchOrder * 2 + 2}`;
    return slot === 'home' ? `Ganador ${homeCode}` : `Ganador ${awayCode}`;
  }

  if (round === 'final' && hasSemis) {
    return slot === 'home' ? 'Ganador S1' : 'Ganador S2';
  }

  return 'Por definir';
}

/**
 * Opciones semánticas para menús desplegables de añadir/editar partido según la fase
 */
export function getBracketOptionsForRound(round) {
  const meta = BRACKET_ROUNDS[round];
  if (!meta) return [];
  const options = [];
  for (let i = 0; i < meta.slots; i++) {
    const code = `${meta.prefix}${i + 1}`;
    const prog = BRACKET_PROGRESSION_MAP[code];
    const desc = prog ? `(avanza a ${prog.nextLabel})` : (round === 'final' ? '(define al campeón)' : '');
    options.push({
      value: code,
      match_order: i,
      label: `Llave ${code} · ${meta.shortLabel} ${i + 1} ${desc}`
    });
  }
  return options;
}
