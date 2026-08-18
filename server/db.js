const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Create Tournaments table
    db.run(`CREATE TABLE IF NOT EXISTS tournaments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    )`);

    // Create Standings (Teams) table
    db.run(`CREATE TABLE IF NOT EXISTS standings (
      id TEXT PRIMARY KEY,
      tournament_id TEXT NOT NULL,
      name TEXT NOT NULL,
      played INTEGER DEFAULT 0,
      won INTEGER DEFAULT 0,
      drawn INTEGER DEFAULT 0,
      lost INTEGER DEFAULT 0,
      goalsFor INTEGER DEFAULT 0,
      goalsAgainst INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      fouls INTEGER DEFAULT 0,
      FOREIGN KEY (tournament_id) REFERENCES tournaments (id)
    )`);

    // Create Albums table
    db.run(`CREATE TABLE IF NOT EXISTS albums (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      thumbnail TEXT,
      date TEXT
    )`);

    // Create Videos table
    db.run(`CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      thumbnail TEXT,
      type TEXT,
      date TEXT,
      views INTEGER DEFAULT 0,
      album_id TEXT,
      FOREIGN KEY (album_id) REFERENCES albums (id)
    )`);

    // Add album_id column to existing videos table (ignore error if it already exists)
    db.run(`ALTER TABLE videos ADD COLUMN album_id TEXT`, (err) => {
      // Ignoramos el error si la columna ya existe
    });

    console.log('Database initialized.');
  });
}

module.exports = db;
