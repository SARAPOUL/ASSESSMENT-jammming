import { useState, useEffect } from 'react';

import './App.css';

import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'

import Spotify from '../../utils/Spotify'

function App() {

  const [searchResults, setSearchResults] = useState([])

  const [playlistName, setPlaylistName] = useState('New Playlist')

  const [playlistTracks, setPlaylistTracks] = useState([])

  useEffect(() => {}, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Spotify.getAccessToken()
  ],[])

  const addTrack = (track) =>{
    // console.log(track); 
    if(playlistTracks.find((t) => t.id === track.id)) return;
    
    setPlaylistTracks(prevPlaylistTracks =>[...prevPlaylistTracks, track])
  }

  const removeTrack = (track) =>{
    setPlaylistTracks((prevPlaylistTracks) =>
    prevPlaylistTracks.filter((t) => t.id !== track.id)
    )
  }

  const updatePlaylistName = (playlistName) =>{
        setPlaylistName(playlistName)
  }

  const savePlaylist = () =>{
    Spotify.createPlaylist(playlistName,
      playlistTracks.map((track) => track.id)
      ).then(()=>{
        setPlaylistName('New Playlist')
        setPlaylistTracks([])
      })

  }

  const search = (term) =>{
    // console.log(term);
    Spotify.search(term).then((results) => setSearchResults(results))
  }

  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        {/* Add a SearchBar component */}
        <SearchBar onSearch={search}/>
        <div className="App-playlist">
          {/* Add a SearchResults component */}
          <SearchResults searchResults={searchResults} onAdd={addTrack}/>
          {/* Add a Playlist component */}
          <Playlist 
          playlistTracks ={playlistTracks} 
          playlistName={playlistName} 
          onRemove={removeTrack} 
          onNameChange={updatePlaylistName} 
          onSave={savePlaylist}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
