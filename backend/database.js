
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'music.db');

async function initializeDatabase() {
  const SQL = await initSqlJs();
  let db;

  if (fs.existsSync(dbPath)) {
    db = new SQL.Database(fs.readFileSync(dbPath));
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      album TEXT NOT NULL,
      genre TEXT NOT NULL
    )
  `);

  const count = db.exec('SELECT COUNT(*) FROM songs');
  const totalSongs = count[0].values[0][0];

  if (totalSongs === 0) {
    const samples = [
      ['Blinding Lights', 'The Weeknd', 'After Hours', 'Pop'],
      ['Perfect', 'Ed Sheeran', 'Divide', 'Romantic'],
      ['Starboy', 'The Weeknd', 'Starboy', 'Pop'],
      ['Shape of You', 'Ed Sheeran', 'Divide', 'Pop'],
      ['Stay', 'Justin Bieber', 'Justice', 'Pop'],
      ['Someone Like You', 'Adele', '21', 'Romantic'],
      ['Heat Waves', 'Glass Animals', 'Dreamland', 'Indie']
    ];

    const statement = db.prepare(
      'INSERT INTO songs (title, artist, album, genre) VALUES (?, ?, ?, ?)'
    );

    try {
      for (const song of samples) {
        statement.run(song);
      }
    } finally {
      statement.free();
    }
  }

  function saveDatabase() {
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
  }

  saveDatabase();
  console.log('SQLite database initialized successfully!');

  return { db, saveDatabase };
}

module.exports = initializeDatabase;
