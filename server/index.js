const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Utilities ---
const generateId = (prefix) => prefix + Date.now();

// --- Endpoints ---

// Add a new tournament
app.post('/api/tournaments', async (req, res) => {
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

// Edit a tournament
app.put('/api/tournaments/:id', async (req, res) => {
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

// Delete a tournament
app.delete('/api/tournaments/:id', async (req, res) => {
  try {
    await db.execute({
      sql: 'DELETE FROM tournaments WHERE id = ?',
      args: [req.params.id]
    });
    // Also delete standings for this tournament
    await db.execute({
      sql: 'DELETE FROM standings WHERE tournament_id = ?',
      args: [req.params.id]
    });
    res.json({ message: 'Tournament deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tournaments with standings
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

// Update a team's stats in a tournament
app.put('/api/tournaments/:tournamentId/standings/:teamId', async (req, res) => {
  const { tournamentId, teamId } = req.params;
  const stats = req.body;
  
  const query = `
    UPDATE standings 
    SET played = ?, won = ?, drawn = ?, lost = ?, goalsFor = ?, goalsAgainst = ?, points = ?, fouls = ?, name = ?
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

// Add a team to a tournament
app.post('/api/tournaments/:tournamentId/standings', async (req, res) => {
  const { tournamentId } = req.params;
  const { name } = req.body;
  const id = generateId('eq');
  
  try {
    await db.execute({
      sql: 'INSERT INTO standings (id, tournament_id, name, played, won, drawn, lost, goalsFor, goalsAgainst, points, fouls) VALUES (?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0)',
      args: [id, tournamentId, name]
    });
    res.status(201).json({ id, tournament_id: tournamentId, name, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, fouls: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all videos
app.get('/api/videos', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM videos ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all albums
app.get('/api/albums', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM albums ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new album
app.post('/api/albums', async (req, res) => {
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

// Delete an album
app.delete('/api/albums/:id', async (req, res) => {
  try {
    await db.execute({
      sql: 'DELETE FROM albums WHERE id = ?',
      args: [req.params.id]
    });
    res.json({ message: 'Album deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit an album
app.put('/api/albums/:id', async (req, res) => {
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

// Add a new video
app.post('/api/videos', async (req, res) => {
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

// Delete a video
app.delete('/api/videos/:id', async (req, res) => {
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

// Edit a video
app.put('/api/videos/:id', async (req, res) => {
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

// --- Locations ---
app.get('/api/locations', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM locations ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/locations', async (req, res) => {
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

app.put('/api/locations/:id', async (req, res) => {
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

app.delete('/api/locations/:id', async (req, res) => {
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

// --- Matches ---
app.get('/api/matches', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM matches ORDER BY date DESC, time DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/matches', async (req, res) => {
  const { tournament_id, home_team_id, away_team_id, date, time, location_id, status, home_score, away_score, stream_url, round, match_order } = req.body;
  const id = generateId('m');
  try {
    await db.execute({
      sql: 'INSERT INTO matches (id, tournament_id, home_team_id, away_team_id, date, time, location_id, status, home_score, away_score, stream_url, round, match_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [id, tournament_id, home_team_id, away_team_id, date, time, location_id || null, status || 'scheduled', home_score || 0, away_score || 0, stream_url || null, round || null, match_order || 0]
    });
    res.status(201).json({ id, tournament_id, home_team_id, away_team_id, date, time, location_id: location_id || null, status: status || 'scheduled', home_score: home_score || 0, away_score: away_score || 0, stream_url: stream_url || null, round: round || null, match_order: match_order || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/matches/:id', async (req, res) => {
  const { tournament_id, home_team_id, away_team_id, date, time, location_id, status, home_score, away_score, stream_url, round, match_order } = req.body;
  try {
    const result = await db.execute({
      sql: 'UPDATE matches SET tournament_id = ?, home_team_id = ?, away_team_id = ?, date = ?, time = ?, location_id = ?, status = ?, home_score = ?, away_score = ?, stream_url = ?, round = ?, match_order = ? WHERE id = ?',
      args: [tournament_id, home_team_id, away_team_id, date, time, location_id || null, status || 'scheduled', home_score || 0, away_score || 0, stream_url || null, round || null, match_order || 0, req.params.id]
    });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Match not found' });
    res.json({ message: 'Match updated', id: req.params.id, tournament_id, home_team_id, away_team_id, date, time, location_id: location_id || null, status: status || 'scheduled', home_score: home_score || 0, away_score: away_score || 0, stream_url: stream_url || null, round: round || null, match_order: match_order || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/matches/:id', async (req, res) => {
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

// Admin login simple
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Init with mock data if empty
app.get('/api/init-mock', async (req, res) => {
  try {
    const result = await db.execute('SELECT COUNT(*) as count FROM tournaments');
    if (result.rows[0].count === 0) {
      const t1 = 't1';
      await db.execute({
        sql: 'INSERT INTO tournaments (id, name) VALUES (?, ?)',
        args: [t1, 'Liga de Verano - 1ra División']
      });
      
      await db.execute({
        sql: 'INSERT INTO standings (id, tournament_id, name, played, won, drawn, lost, goalsFor, goalsAgainst, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: ['eq1', t1, 'Atlético Central', 5, 4, 1, 0, 12, 3, 13]
      });
      
      await db.execute({
        sql: 'INSERT INTO standings (id, tournament_id, name, played, won, drawn, lost, goalsFor, goalsAgainst, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: ['eq2', t1, 'Deportivo Sur', 5, 3, 1, 1, 9, 5, 10]
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
