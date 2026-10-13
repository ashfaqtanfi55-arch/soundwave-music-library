
const express = require('express');
const cors = require('cors');
const initializeDatabase = require('./database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let db;
let saveDatabase;

app.get('/', (req, res) => {
  res.json({ message: 'SoundWave API is running!' });
});

app.get('/api/songs', (req, res) => {
  const result = db.exec('SELECT * FROM songs ORDER BY id DESC');

  const songs = result.length
    ? result[0].values.map((row) => {
        const song = {};

        result[0].columns.forEach((column, index) => {
          song[column] = row[index];
        });

        return song;
      })
    : [];

  res.json(songs);
});

app.post('/api/songs', (req, res) => {
  const { title, artist, album, genre } = req.body;

  if (
    typeof title !== 'string' || !title.trim() ||
    typeof artist !== 'string' || !artist.trim() ||
    typeof album !== 'string' || !album.trim() ||
    typeof genre !== 'string' || !genre.trim()
  ) {
    return res.status(400).json({
      error: 'Title, artist, album and genre are required.'
    });
  }

  const statement = db.prepare(
    'INSERT INTO songs (title, artist, album, genre) VALUES (?, ?, ?, ?)'
  );

  try {
    statement.run([
      title.trim(),
      artist.trim(),
      album.trim(),
      genre.trim()
    ]);

    statement.free();
    saveDatabase();

    const result = db.exec('SELECT * FROM songs WHERE id = last_insert_rowid()');

    res.status(201).json({
      message: 'Song added successfully!',
      song: {
        id: result[0].values[0][0],
        title: result[0].values[0][1],
        artist: result[0].values[0][2],
        album: result[0].values[0][3],
        genre: result[0].values[0][4]
      }
    });
  } catch (error) {
    statement.free();
    res.status(500).json({ error: 'Could not save song.' });
  }
});

app.delete('/api/songs/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid song ID.' });
  }

  const existing = db.exec(
    'SELECT id FROM songs WHERE id = ?',
    [id]
  );

  if (!existing.length || !existing[0].values.length) {
    return res.status(404).json({ error: 'Song not found.' });
  }

  db.run('DELETE FROM songs WHERE id = ?', [id]);
  saveDatabase();

  res.json({ message: 'Song deleted successfully!' });
});

async function startServer() {
  const database = await initializeDatabase();

  db = database.db;
  saveDatabase = database.saveDatabase;

  app.listen(PORT, () => {
    console.log(`SoundWave API running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start SoundWave API:', error);
  process.exit(1);
});