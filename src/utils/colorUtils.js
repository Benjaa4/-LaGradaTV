/**
 * Rich Matte Color System
 * Provides deterministic, vibrant, matte colors for teams, stages, and badges.
 * Ensures zero blinding neon while delivering high visual variety and engagement.
 */

export const MATTE_TEAM_PALETTES = [
  { bg: 'rgba(59, 130, 246, 0.16)', border: 'rgba(59, 130, 246, 0.4)', color: '#60a5fa' }, // Matte Cobalt
  { bg: 'rgba(225, 95, 65, 0.16)',  border: 'rgba(225, 95, 65, 0.4)',  color: '#f87171' }, // Matte Terracotta/Coral
  { bg: 'rgba(46, 157, 116, 0.16)', border: 'rgba(46, 157, 116, 0.4)', color: '#4ade80' }, // Matte Emerald
  { bg: 'rgba(136, 84, 208, 0.16)', border: 'rgba(136, 84, 208, 0.4)', color: '#c084fc' }, // Matte Violet
  { bg: 'rgba(217, 119, 6, 0.16)',  border: 'rgba(217, 119, 6, 0.4)',  color: '#fbbf24' }, // Matte Amber
  { bg: 'rgba(20, 184, 166, 0.16)', border: 'rgba(20, 184, 166, 0.4)', color: '#2dd4bf' }, // Matte Teal
  { bg: 'rgba(235, 77, 75, 0.16)',  border: 'rgba(235, 77, 75, 0.4)',  color: '#fca5a5' }, // Matte Crimson
  { bg: 'rgba(14, 165, 233, 0.16)', border: 'rgba(14, 165, 233, 0.4)', color: '#38bdf8' }, // Matte Cerulean
  { bg: 'rgba(168, 85, 247, 0.16)', border: 'rgba(168, 85, 247, 0.4)', color: '#d8b4fe' }, // Matte Purple
  { bg: 'rgba(234, 88, 12, 0.16)',  border: 'rgba(234, 88, 12, 0.4)',  color: '#fdba74' }, // Matte Tangerine
];

export function getMatteTeamStyle(name) {
  if (!name) return MATTE_TEAM_PALETTES[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 37 + name.charCodeAt(i)) % MATTE_TEAM_PALETTES.length;
  }
  return MATTE_TEAM_PALETTES[Math.abs(h)];
}
