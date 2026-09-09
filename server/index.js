require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'lagradatv_fallback_jwt_secret_please_change_in_production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'ariza';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'La1/2gRada1/2tbeE';

app.use(cors());
app.use(express.json());

// --- Middleware de Autenticación y Autorización ---
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado: Token requerido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// --- Utilities ---
// Generador de IDs seguro contra colisiones concurrentes
const generateId = (prefix) => `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;

// --- Endpoints de Autenticación ---

// Login de Administrador
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Usuario y contraseña requeridos' });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  }
});

// Verificación de validez de token para hidratación de sesión en cliente
app.get('/api/auth/verify', requireAdmin, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// --- Endpoints: Torneos ---

// Add a new tournament (Admin only)
app.post('/api/tournaments', requireAdmin, async (req, res) => {
  const { name, type, season, description, image } = req.body;
  const id = generateId('t');

  try {
    await db.execute({
      sql: 'INSERT INTO tournaments (id, name, type, season, description, image) VALUES (?, ?, ?, ?, ?, ?)',
      args: [id, name, type || 'league', season || null, description || null, image || null]
    });
    res.status(201).json({ id, name, type: type || 'league', season: season || null, description: description || null, image: image || null, standings: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a tournament (Admin only)
app.put('/api/tournaments/:id', requireAdmin, async (req, res) => {
  const { name, type, season, description, image } = req.body;

  try {
    const result = await db.execute({
      sql: 'UPDATE tournaments SET name = ?, type = ?, season = ?, description = ?, image = ? WHERE id = ?',
      args: [name, type || 'league', season || null, description || null, image || null, req.params.id]
    });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Tournament not found' });
    res.json({ message: 'Tournament updated successfully', id: req.params.id, name, type: type || 'league', season, description, image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a tournament (Admin only)
app.delete('/api/tournaments/:id', requireAdmin, async (req, res) => {
  try {
    // First, delete matches for this tournament
    await db.execute({
      sql: 'DELETE FROM matches WHERE tournament_id = ?',
      args: [req.params.id]
    });

    // Then delete standings for this tournament
    await db.execute({
      sql: 'DELETE FROM standings WHERE tournament_id = ?',
      args: [req.params.id]
    });

    // Finally delete the tournament
    await db.execute({
      sql: 'DELETE FROM tournaments WHERE id = ?',
      args: [req.params.id]
    });
    res.json({ message: 'Tournament deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tournaments with standings (Public)
app.get('/api/tournaments', async (req, res) => {
  try {
    const tournamentsResult = await db.execute('SELECT * FROM tournaments');
    const standingsResult = await db.execute('SELECT * FROM standings ORDER BY points DESC');

    const tournaments = tournamentsResult.rows;
    const standings = standingsResult.rows;

    const tournamentsWithStandings = tournaments.map(t => {
      return {
        ...t,
        standings: standings.filter(s => s.tournament_id === t.id)
      };
    });

    res.json(tournamentsWithStandings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a team's stats in a tournament (Admin only)
app.put('/api/tournaments/:tournamentId/standings/:teamId', requireAdmin, async (req, res) => {
  const { tournamentId, teamId } = req.params;
  const stats = req.body;

  const query = `
    UPDATE standings 
    SET played = ?, won = ?, drawn = ?, lost = ?, goalsFor = ?, goalsAgainst = ?, points = ?, fouls = ?, name = ?, disqualified = ?, logo = ?
    WHERE id = ? AND tournament_id = ?
  `;

  const params = [
    stats.played || 0,
    stats.won || 0,
    stats.drawn || 0,
    stats.lost || 0,
    stats.goalsFor || 0,
    stats.goalsAgainst || 0,
    stats.points || 0,
    stats.fouls || 0,
    stats.name,
    stats.disqualified ? 1 : 0,
    stats.logo || null,
    teamId,
    tournamentId
  ];

  try {
    const result = await db.execute({ sql: query, args: params });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Team not found' });
    res.json({ message: 'Stats updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a team to a tournament (Admin only)
app.post('/api/tournaments/:tournamentId/standings', requireAdmin, async (req, res) => {
  const { tournamentId } = req.params;
  const { name, logo } = req.body;
  const id = generateId('eq');

  try {
    await db.execute({
      sql: 'INSERT INTO standings (id, tournament_id, name, played, won, drawn, lost, goalsFor, goalsAgainst, points, fouls, disqualified, logo) VALUES (?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, ?)',
      args: [id, tournamentId, name, logo || null]
    });
    res.status(201).json({ id, tournament_id: tournamentId, name, logo: logo || null, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, fouls: 0, disqualified: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a team from a tournament (Admin only)
app.delete('/api/tournaments/:tournamentId/standings/:teamId', requireAdmin, async (req, res) => {
  const { tournamentId, teamId } = req.params;

  try {
    // Delete matches associated with this team first to avoid foreign key constraint errors
    await db.execute({
      sql: 'DELETE FROM matches WHERE home_team_id = ? OR away_team_id = ?',
      args: [teamId, teamId]
    });

    const result = await db.execute({
      sql: 'DELETE FROM standings WHERE id = ? AND tournament_id = ?',
      args: [teamId, tournamentId]
    });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Team not found' });
    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Endpoints: Videos y Álbumes ---

// Get all videos (Public)
app.get('/api/videos', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM videos ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all albums (Public)
app.get('/api/albums', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM albums ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new album (Admin only)
app.post('/api/albums', requireAdmin, async (req, res) => {
  const { title, thumbnail, date } = req.body;
  const id = generateId('a');

  try {
    await db.execute({
      sql: `INSERT INTO albums (id, title, thumbnail, date) VALUES (?, ?, ?, ?)`,
      args: [id, title, thumbnail, date]
    });
    res.status(201).json({ id, title, thumbnail, date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an album (Admin only)
app.delete('/api/albums/:id', requireAdmin, async (req, res) => {
  try {
    // First delete all videos in this album
    await db.execute({
      sql: 'DELETE FROM videos WHERE album_id = ?',
      args: [req.params.id]
    });

    // Then delete the album
    await db.execute({
      sql: 'DELETE FROM albums WHERE id = ?',
      args: [req.params.id]
    });
    res.json({ message: 'Album deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit an album (Admin only)
app.put('/api/albums/:id', requireAdmin, async (req, res) => {
  const { title, thumbnail } = req.body;

  try {
    const result = await db.execute({
      sql: 'UPDATE albums SET title = ?, thumbnail = ? WHERE id = ?',
      args: [title, thumbnail, req.params.id]
    });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Album not found' });
    res.json({ message: 'Album updated', id: req.params.id, title, thumbnail });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new video (Admin only)
app.post('/api/videos', requireAdmin, async (req, res) => {
  const { title, url, thumbnail, type, date, album_id } = req.body;
  const id = generateId('v');

  try {
    await db.execute({
      sql: `INSERT INTO videos (id, title, url, thumbnail, type, date, views, album_id) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
      args: [id, title, url, thumbnail, type, date, album_id || null]
    });
    res.status(201).json({ id, title, url, thumbnail, type, date, views: 0, album_id: album_id || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a video (Admin only)
app.delete('/api/videos/:id', requireAdmin, async (req, res) => {
  try {
    await db.execute({
      sql: 'DELETE FROM videos WHERE id = ?',
      args: [req.params.id]
    });
    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a video (Admin only)
app.put('/api/videos/:id', requireAdmin, async (req, res) => {
  const { title, url, thumbnail, type, album_id } = req.body;

  try {
    const result = await db.execute({
      sql: 'UPDATE videos SET title = ?, url = ?, thumbnail = ?, type = ?, album_id = ? WHERE id = ?',
      args: [title, url, thumbnail, type, album_id || null, req.params.id]
    });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Video not found' });
    res.json({ message: 'Video updated', id: req.params.id, title, url, thumbnail, type, album_id: album_id || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Endpoints: Ubicaciones / Canchas ---

// Get all locations (Public)
app.get('/api/locations', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM locations ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a location (Admin only)
app.post('/api/locations', requireAdmin, async (req, res) => {
  const { name, map_url } = req.body;
  const id = generateId('loc');
  try {
    await db.execute({
      sql: 'INSERT INTO locations (id, name, map_url) VALUES (?, ?, ?)',
      args: [id, name, map_url || null]
    });
    res.status(201).json({ id, name, map_url: map_url || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a location (Admin only)
app.put('/api/locations/:id', requireAdmin, async (req, res) => {
  const { name, map_url } = req.body;
  try {
    const result = await db.execute({
      sql: 'UPDATE locations SET name = ?, map_url = ? WHERE id = ?',
      args: [name, map_url || null, req.params.id]
    });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Location not found' });
    res.json({ message: 'Location updated', id: req.params.id, name, map_url: map_url || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a location (Admin only)
app.delete('/api/locations/:id', requireAdmin, async (req, res) => {
  try {
    await db.execute({
      sql: 'DELETE FROM locations WHERE id = ?',
      args: [req.params.id]
    });
    res.json({ message: 'Location deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Endpoints: Partidos ---

// Get all matches (Public)
app.get('/api/matches', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM matches ORDER BY date DESC, time DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a match (Admin only)
app.post('/api/matches', requireAdmin, async (req, res) => {
  const { tournament_id, home_team_id, away_team_id, date, time, location_id, status, home_score, away_score, stream_url, round, match_order, home_penalties, away_penalties, description } = req.body;
  const id = generateId('m');
  try {
    await db.execute({
      sql: 'INSERT INTO matches (id, tournament_id, home_team_id, away_team_id, date, time, location_id, status, home_score, away_score, stream_url, round, match_order, home_penalties, away_penalties, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [id, tournament_id, home_team_id, away_team_id, date, time, location_id || null, status || 'scheduled', home_score || 0, away_score || 0, stream_url || null, round || null, match_order || 0, home_penalties ?? null, away_penalties ?? null, description || null]
    });
    res.status(201).json({ id, tournament_id, home_team_id, away_team_id, date, time, location_id: location_id || null, status: status || 'scheduled', home_score: home_score || 0, away_score: away_score || 0, stream_url: stream_url || null, round: round || null, match_order: match_order || 0, home_penalties: home_penalties ?? null, away_penalties: away_penalties ?? null, description: description || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a match (Admin only)
app.put('/api/matches/:id', requireAdmin, async (req, res) => {
  const { tournament_id, home_team_id, away_team_id, date, time, location_id, status, home_score, away_score, stream_url, round, match_order, home_penalties, away_penalties, description } = req.body;
  try {
    const result = await db.execute({
      sql: 'UPDATE matches SET tournament_id = ?, home_team_id = ?, away_team_id = ?, date = ?, time = ?, location_id = ?, status = ?, home_score = ?, away_score = ?, stream_url = ?, round = ?, match_order = ?, home_penalties = ?, away_penalties = ?, description = ? WHERE id = ?',
      args: [tournament_id, home_team_id, away_team_id, date, time, location_id || null, status || 'scheduled', home_score || 0, away_score || 0, stream_url || null, round || null, match_order || 0, home_penalties ?? null, away_penalties ?? null, description || null, req.params.id]
    });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Match not found' });
    res.json({ message: 'Match updated', id: req.params.id, tournament_id, home_team_id, away_team_id, date, time, location_id: location_id || null, status: status || 'scheduled', home_score: home_score || 0, away_score: away_score || 0, stream_url: stream_url || null, round: round || null, match_order: match_order || 0, home_penalties: home_penalties ?? null, away_penalties: away_penalties ?? null, description: description || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a match (Admin only)
app.delete('/api/matches/:id', requireAdmin, async (req, res) => {
  try {
    await db.execute({
      sql: 'DELETE FROM matches WHERE id = ?',
      args: [req.params.id]
    });
    res.json({ message: 'Match deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate all empty bracket matches for a knockout tournament (Admin only)
app.post('/api/tournaments/:id/generate-bracket', requireAdmin, async (req, res) => {
  const { id: tournamentId } = req.params;
  try {
    // Check if matches already exist for this tournament
    const existing = await db.execute({ sql: 'SELECT COUNT(*) as count FROM matches WHERE tournament_id = ?', args: [tournamentId] });
    if (existing.rows[0].count > 0) {
      return res.status(400).json({ error: 'Este torneo ya tiene partidos generados.' });
    }

    const rounds = [
      { key: 'round_of_16', count: 8 },
      { key: 'quarterfinal', count: 4 },
      { key: 'semifinal', count: 2 },
      { key: 'final', count: 1 },
    ];

    const PLACEHOLDER = 'tbd';
    const created = [];

    for (const round of rounds) {
      for (let i = 0; i < round.count; i++) {
        const matchId = generateId('m');
        await db.execute({
          sql: 'INSERT INTO matches (id, tournament_id, home_team_id, away_team_id, date, time, status, home_score, away_score, round, match_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          args: [matchId, tournamentId, PLACEHOLDER, PLACEHOLDER, 'TBD', '00:00', 'scheduled', 0, 0, round.key, i]
        });
        created.push({ id: matchId, round: round.key, match_order: i, home_team_id: PLACEHOLDER, away_team_id: PLACEHOLDER, tournament_id: tournamentId, date: 'TBD', time: '00:00', status: 'scheduled', home_score: 0, away_score: 0, home_penalties: null, away_penalties: null, description: null, stream_url: null, location_id: null });
      }
    }

    res.status(201).json({ message: 'Bracket generated', matches: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Init with mock data if empty (Admin only)
app.get('/api/init-mock', requireAdmin, async (req, res) => {
  try {
    const result = await db.execute('SELECT COUNT(*) as count FROM tournaments');
    if (result.rows[0].count === 0) {
      const t1 = generateId('t');
      await db.execute({
        sql: 'INSERT INTO tournaments (id, name) VALUES (?, ?)',
        args: [t1, 'Liga de Verano - 1ra División']
      });

      await db.execute({
        sql: 'INSERT INTO standings (id, tournament_id, name, played, won, drawn, lost, goalsFor, goalsAgainst, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [generateId('eq'), t1, 'Atlético Central', 5, 4, 1, 0, 12, 3, 13]
      });

      await db.execute({
        sql: 'INSERT INTO standings (id, tournament_id, name, played, won, drawn, lost, goalsFor, goalsAgainst, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [generateId('eq'), t1, 'Deportivo Sur', 5, 3, 1, 1, 9, 5, 10]
      });

      res.json({ message: 'Mock data injected' });
    } else {
      res.json({ message: 'Database already has data' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
