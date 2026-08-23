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
app.post('/api/tournaments', (req, res) => {
  const { name } = req.body;
  const id = generateId('t');
  
  db.run('INSERT INTO tournaments (id, name) VALUES (?, ?)', [id, name], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, name, standings: [] });
  });
});

// Edit a tournament
app.put('/api/tournaments/:id', (req, res) => {
  const { name } = req.body;
  
  db.run('UPDATE tournaments SET name = ? WHERE id = ?', [name, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Tournament not found' });
    res.json({ message: 'Tournament updated successfully', id: req.params.id, name });
  });
});

// Delete a tournament
app.delete('/api/tournaments/:id', (req, res) => {
  db.run('DELETE FROM tournaments WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    // Also delete standings for this tournament
    db.run('DELETE FROM standings WHERE tournament_id = ?', [req.params.id], (err2) => {
      if (err2) console.error("Error deleting standings:", err2);
    });
    res.json({ message: 'Tournament deleted' });
  });
});

// Get all tournaments with standings
app.get('/api/tournaments', (req, res) => {
  db.all('SELECT * FROM tournaments', [], (err, tournaments) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all('SELECT * FROM standings ORDER BY points DESC', [], (err, standings) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const tournamentsWithStandings = tournaments.map(t => {
        return {
          ...t,
          standings: standings.filter(s => s.tournament_id === t.id)
        };
      });
      
      res.json(tournamentsWithStandings);
    });
  });
});

// Update a team's stats in a tournament
app.put('/api/tournaments/:tournamentId/standings/:teamId', (req, res) => {
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
  
  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Team not found' });
    res.json({ message: 'Stats updated successfully' });
  });
});

// Get all videos
app.get('/api/videos', (req, res) => {
  db.all('SELECT * FROM videos ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get all albums
app.get('/api/albums', (req, res) => {
  db.all('SELECT * FROM albums ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add a new album
app.post('/api/albums', (req, res) => {
  const { title, thumbnail, date } = req.body;
  const id = generateId('a');
  
  const query = `INSERT INTO albums (id, title, thumbnail, date) VALUES (?, ?, ?, ?)`;
  db.run(query, [id, title, thumbnail, date], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, title, thumbnail, date });
  });
});

// Delete an album
app.delete('/api/albums/:id', (req, res) => {
  db.run('DELETE FROM albums WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Album deleted' });
  });
});

// Edit an album
app.put('/api/albums/:id', (req, res) => {
  const { title, thumbnail } = req.body;
  
  db.run('UPDATE albums SET title = ?, thumbnail = ? WHERE id = ?', [title, thumbnail, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Album not found' });
    res.json({ message: 'Album updated', id: req.params.id, title, thumbnail });
  });
});

// Add a new video
app.post('/api/videos', (req, res) => {
  const { title, url, thumbnail, type, date, album_id } = req.body;
  const id = generateId('v');
  
  const query = `INSERT INTO videos (id, title, url, thumbnail, type, date, views, album_id) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`;
  db.run(query, [id, title, url, thumbnail, type, date, album_id || null], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, title, url, thumbnail, type, date, views: 0, album_id: album_id || null });
  });
});

// Delete a video
app.delete('/api/videos/:id', (req, res) => {
  db.run('DELETE FROM videos WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Video deleted' });
  });
});

// Edit a video
app.put('/api/videos/:id', (req, res) => {
  const { title, url, thumbnail, type, album_id } = req.body;
  
  db.run('UPDATE videos SET title = ?, url = ?, thumbnail = ?, type = ?, album_id = ? WHERE id = ?', 
    [title, url, thumbnail, type, album_id || null, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Video not found' });
    res.json({ message: 'Video updated', id: req.params.id, title, url, thumbnail, type, album_id: album_id || null });
  });
});

// Admin login simple
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // In a real app, use environment variables and hashing
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Init with mock data if empty
app.get('/api/init-mock', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM tournaments', [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row.count === 0) {
      // Basic mock data
      const t1 = 't1';
      db.run('INSERT INTO tournaments (id, name) VALUES (?, ?)', [t1, 'Liga de Verano - 1ra División']);
      
      db.run('INSERT INTO standings (id, tournament_id, name, played, won, drawn, lost, goalsFor, goalsAgainst, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        ['eq1', t1, 'Atlético Central', 5, 4, 1, 0, 12, 3, 13]);
      db.run('INSERT INTO standings (id, tournament_id, name, played, won, drawn, lost, goalsFor, goalsAgainst, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        ['eq2', t1, 'Deportivo Sur', 5, 3, 1, 1, 9, 5, 10]);
        
      res.json({ message: 'Mock data injected' });
    } else {
      res.json({ message: 'Database already has data' });
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
