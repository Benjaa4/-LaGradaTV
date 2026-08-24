const { createClient } = require('@libsql/client');
const path = require('path');
require('dotenv').config();

// Se conecta a Turso si se proveen credenciales, si no usa SQLite local
const url = process.env.TURSO_DATABASE_URL || 'file:database.sqlite';

const db = createClient({
  url: url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDb() {
  try {
    // Create Tournaments table
    await db.execute(`CREATE TABLE IF NOT EXISTS tournaments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    )`);

    // Create Standings (Teams) table
    await db.execute(`CREATE TABLE IF NOT EXISTS standings (
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
    await db.execute(`CREATE TABLE IF NOT EXISTS albums (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      thumbnail TEXT,
      date TEXT
    )`);

    // Create Videos table
    await db.execute(`CREATE TABLE IF NOT EXISTS videos (
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
    try {
      await db.execute(`ALTER TABLE videos ADD COLUMN album_id TEXT`);
    } catch (e) {
      // Ignoramos el error si la columna ya existe
    }

    console.log('Database initialized.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDb();

module.exports = db;
