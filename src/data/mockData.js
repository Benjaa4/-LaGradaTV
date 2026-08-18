export const initialTournaments = [
  {
    id: '1',
    name: 'Liga de Campeones Local',
    season: '2026',
    description: 'El torneo más prestigioso de la ciudad.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbc5c51086?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    standings: [
      { id: 't1', name: 'Los Galácticos', played: 10, won: 8, drawn: 1, lost: 1, points: 25, goalsFor: 20, goalsAgainst: 5, fouls: 12 },
      { id: 't2', name: 'Deportivo City', played: 10, won: 7, drawn: 2, lost: 1, points: 23, goalsFor: 18, goalsAgainst: 8, fouls: 15 },
      { id: 't3', name: 'Atlético FC', played: 10, won: 5, drawn: 3, lost: 2, points: 18, goalsFor: 15, goalsAgainst: 10, fouls: 9 },
      { id: 't4', name: 'Rayo Valle', played: 10, won: 3, drawn: 2, lost: 5, points: 11, goalsFor: 10, goalsAgainst: 15, fouls: 20 },
    ]
  },
  {
    id: '2',
    name: 'Copa de Verano',
    season: '2026',
    description: 'Torneo corto de pretemporada.',
    image: 'https://images.unsplash.com/photo-1518605368461-1ee7c683b544?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    standings: [
      { id: 't5', name: 'Sporting', played: 5, won: 4, drawn: 1, lost: 0, points: 13, goalsFor: 12, goalsAgainst: 3, fouls: 4 },
      { id: 't6', name: 'Real Madrid Sur', played: 5, won: 3, drawn: 1, lost: 1, points: 10, goalsFor: 9, goalsAgainst: 6, fouls: 8 },
    ]
  },
  {
    id: '3',
    name: 'Torneo Relámpago',
    season: '2026',
    description: 'Fin de semana de puro fútbol y adrenalina.',
    image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    standings: [
      { id: 't7', name: 'Tigres', played: 3, won: 3, drawn: 0, lost: 0, points: 9, goalsFor: 8, goalsAgainst: 2, fouls: 5 },
      { id: 't8', name: 'Leones', played: 3, won: 2, drawn: 0, lost: 1, points: 6, goalsFor: 5, goalsAgainst: 4, fouls: 7 },
    ]
  },
  {
    id: '4',
    name: 'Liga Femenina',
    season: '2026',
    description: 'La liga femenina más competitiva del año.',
    image: 'https://images.unsplash.com/photo-1525010620023-e186641e7fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    standings: [
      { id: 't9', name: 'Las Leonas', played: 6, won: 5, drawn: 1, lost: 0, points: 16, goalsFor: 14, goalsAgainst: 2, fouls: 3 },
      { id: 't10', name: 'Guerreras FC', played: 6, won: 4, drawn: 1, lost: 1, points: 13, goalsFor: 10, goalsAgainst: 5, fouls: 6 },
    ]
  },
  {
    id: '5',
    name: 'Copa de Invierno',
    season: '2025',
    description: 'El torneo más frío pero más apasionante.',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6bbe230880?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    standings: [
      { id: 't11', name: 'Hielo FC', played: 4, won: 2, drawn: 2, lost: 0, points: 8, goalsFor: 6, goalsAgainst: 4, fouls: 4 },
      { id: 't12', name: 'Pinguinos', played: 4, won: 1, drawn: 2, lost: 1, points: 5, goalsFor: 4, goalsAgainst: 4, fouls: 2 },
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
    type: 'recording',
    views: 1250
  },
  {
    id: 'v2',
    title: 'Semifinal: Atlético FC vs Rayo Valle',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1508344928928-7137b29de218?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2026-05-15',
    type: 'recording',
    views: 850
  },
  {
    id: 'v3',
    title: 'Amistoso en Vivo: Sporting vs Real Madrid Sur',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbc5c51086?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: new Date().toISOString().split('T')[0],
    type: 'live',
    views: 320
  },
  {
    id: 'v4',
    title: 'Mejores jugadas de la Liga Femenina - Fecha 4',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1525010620023-e186641e7fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2026-06-10',
    type: 'recording',
    views: 450
  },
  {
    id: 'v5',
    title: 'Resumen Torneo Relámpago: Tigres vs Leones',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2026-06-12',
    type: 'recording',
    views: 670
  },
  {
    id: 'v6',
    title: 'Final de Penales Copa de Verano',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6bbe230880?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2026-02-28',
    type: 'recording',
    views: 2100
  },
  {
    id: 'v7',
    title: 'Entrevista al Goleador de la Liga',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbc5c51086?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2026-04-10',
    type: 'recording',
    views: 310
  }
];
