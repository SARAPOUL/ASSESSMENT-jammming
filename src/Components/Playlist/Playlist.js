import './Playlist.css'
import TrackList from '../TrackList/TrackList'
function Playlist(props) {
    const handleNameChange = (e) => {
        const name = e.target.value;
        props.onNameChange(name)
    }
    return (
        <div className="Playlist">
            <input 
            type="text"
            defaultValue={'New Playlist'}
                value={props.playlistName}
                onChange={handleNameChange}
                 />
            <TrackList tracks={props.playlistTracks}
                onRemove={props.onRemove}
                isRemoval={true} />
            <button className="Playlist-save" onClick={props.onSave}>SAVE TO SPOTIFY</button>
        </div>
    )
}

export default Playlist