export const initialTournaments = [
  {
    id: '1',
    name: 'Liga de Campeones Local',
    season: '2026',
    description: 'El torneo más prestigioso de la ciudad.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbc5c51086?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    standings: [
      { id: 't1', name: 'Los Galácticos', played: 10, won: 8, drawn: 1, lost: 1, points: 25, goalsFor: 20, goalsAgainst: 5 },
      { id: 't2', name: 'Deportivo City', played: 10, won: 7, drawn: 2, lost: 1, points: 23, goalsFor: 18, goalsAgainst: 8 },
      { id: 't3', name: 'Atlético FC', played: 10, won: 5, drawn: 3, lost: 2, points: 18, goalsFor: 15, goalsAgainst: 10 },
      { id: 't4', name: 'Rayo Valle', played: 10, won: 3, drawn: 2, lost: 5, points: 11, goalsFor: 10, goalsAgainst: 15 },
    ]
  },
  {
    id: '2',
    name: 'Copa de Verano',
    season: '2026',
    description: 'Torneo corto de pretemporada.',
    image: 'https://images.unsplash.com/photo-1518605368461-1ee7c683b544?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    standings: [
      { id: 't5', name: 'Sporting', played: 5, won: 4, drawn: 1, lost: 0, points: 13, goalsFor: 12, goalsAgainst: 3 },
      { id: 't6', name: 'Real Madrid Sur', played: 5, won: 3, drawn: 1, lost: 1, points: 10, goalsFor: 9, goalsAgainst: 6 },
    ]
  }
];

export const initialVideos = [
  {
    id: 'v1',
    title: 'Gran Final: Los Galácticos vs Deportivo City',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518091043644-c1d44570a2c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2026-05-20',
    type: 'recording'
  },
  {
    id: 'v2',
    title: 'Semifinal: Atlético FC vs Rayo Valle',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1508344928928-7137b29de218?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2026-05-15',
    type: 'recording'
  }
];
