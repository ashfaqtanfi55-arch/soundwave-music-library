
import { useState } from 'react'
import './App.css'

const initialSongs = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', genre: 'Pop', album: 'After Hours' },
  { id: 2, title: 'Perfect', artist: 'Ed Sheeran', genre: 'Romantic', album: 'Divide' },
  { id: 3, title: 'Starboy', artist: 'The Weeknd', genre: 'Pop', album: 'Starboy' },
  { id: 4, title: 'Shape of You', artist: 'Ed Sheeran', genre: 'Pop', album: 'Divide' },
  { id: 5, title: 'Stay', artist: 'Justin Bieber', genre: 'Pop', album: 'Justice' },
  { id: 6, title: 'Someone Like You', artist: 'Adele', genre: 'Romantic', album: '21' },
  { id: 7, title: 'Heat Waves', artist: 'Glass Animals', genre: 'Indie', album: 'Dreamland' },
]

function App() {
  const [songs, setSongs] = useState(initialSongs)
  const [search, setSearch] = useState('')
  const [artist, setArtist] = useState('All')
  const [genre, setGenre] = useState('All')
  const [title, setTitle] = useState('')
  const [newArtist, setNewArtist] = useState('')
  const [album, setAlbum] = useState('')
  const [newGenre, setNewGenre] = useState('Pop')
  const [page, setPage] = useState(1)

  const perPage = 5

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase())

    return (
      matchesSearch &&
      (artist === 'All' || song.artist === artist) &&
      (genre === 'All' || song.genre === genre)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filteredSongs.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const visibleSongs = filteredSongs.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  function addSong(event) {
    event.preventDefault()

    if (!title.trim() || !newArtist.trim() || !album.trim()) {
      return
    }

    setSongs([
      ...songs,
      {
        id: Date.now(),
        title: title.trim(),
        artist: newArtist.trim(),
        album: album.trim(),
        genre: newGenre,
      },
    ])

    setTitle('')
    setNewArtist('')
    setAlbum('')
    setNewGenre('Pop')
    setPage(1)
  }

  function deleteSong(id) {
    setSongs(songs.filter((song) => song.id !== id))
    setPage(1)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><span>♫</span> SoundWave</div>
        <p className="nav-label">MENU</p>
        <div className="nav-item active">▦ &nbsp; Music Library</div>
        <div className="nav-item">♡ &nbsp; Favorites</div>
        <div className="nav-item">♫ &nbsp; Playlists</div>
        <div className="sidebar-bottom">Your music, your world.</div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR PERSONAL MUSIC SPACE</p>
            <h1>Music Library <span>♫</span></h1>
            <p className="subtitle">Discover and organize your favorite tracks.</p>
          </div>
          <div className="profile">♫</div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">WELCOME TO SOUNDWAVE</p>
            <h2>Music for every mood.</h2>
            <p>Your favorite tracks, all in one place.</p>
          </div>
          <div className="welcome-note">♫</div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span>Total Songs</span>
            <strong>{songs.length}</strong>
            <small>Tracks in your library</small>
          </div>
          <div className="stat-card">
            <span>Artists</span>
            <strong>{new Set(songs.map((s) => s.artist)).size}</strong>
            <small>Unique artists</small>
          </div>
          <div className="stat-card">
            <span>Genres</span>
            <strong>{new Set(songs.map((s) => s.genre)).size}</strong>
            <small>Music categories</small>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Find your sound</h2>
              <p>Search and filter your music library.</p>
            </div>
          </div>

          <div className="filters">
            <input
              type="text"
              placeholder="Search song or artist..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />

            <select value={artist} onChange={(e) => { setArtist(e.target.value); setPage(1) }}>
              <option value="All">All Artists</option>
              {[...new Set(songs.map((s) => s.artist))].sort().map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1) }}>
              <option value="All">All Genres</option>
              {[...new Set(songs.map((s) => s.genre))].sort().map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>SONG</th>
                  <th>ARTIST</th>
                  <th>ALBUM</th>
                  <th>GENRE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {visibleSongs.map((song, index) => (
                  <tr key={song.id}>
                    <td>{(currentPage - 1) * perPage + index + 1}</td>
                    <td><div className="song-name"><span className="song-icon">♫</span>{song.title}</div></td>
                    <td>{song.artist}</td>
                    <td>{song.album}</td>
                    <td><span className="genre-tag">{song.genre}</span></td>
                    <td><button className="delete-btn" onClick={() => deleteSong(song.id)}>Delete</button></td>
                  </tr>
                ))}
                {visibleSongs.length === 0 && (
                  <tr><td colSpan="6" className="empty">No songs found. Try another search.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span>Page {currentPage} of {totalPages} · {filteredSongs.length} songs</span>
            <div>
              <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>← Previous</button>
              <button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Next →</button>
            </div>
          </div>
        </section>

        <section className="panel add-panel">
          <div className="section-heading">
            <div>
              <h2>＋ Add a new song</h2>
              <p>Add a track to your library using the form below.</p>
            </div>
          </div>

          <form onSubmit={addSong} className="song-form">
            <label>
              Song title
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Photograph" required />
            </label>
            <label>
              Artist name
              <input value={newArtist} onChange={(e) => setNewArtist(e.target.value)} placeholder="e.g. Ed Sheeran" required />
            </label>
            <label>
              Album
              <input value={album} onChange={(e) => setAlbum(e.target.value)} placeholder="e.g. Multiply" required />
            </label>
            <label>
              Genre
              <select value={newGenre} onChange={(e) => setNewGenre(e.target.value)}>
                <option>Pop</option>
                <option>Romantic</option>
                <option>Rock</option>
                <option>Hip-Hop</option>
                <option>Indie</option>
                <option>Classical</option>
              </select>
            </label>
            <button className="add-btn" type="submit">＋ Add Song</button>
          </form>
          <p className="form-note">Demo version: changes are currently stored in browser memory only.</p>
        </section>

        <footer>SoundWave © 2026 · Made with ♫ and React</footer>
      </main>
    </div>
  )
}

export default App
