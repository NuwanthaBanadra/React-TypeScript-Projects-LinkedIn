import React from 'react';
import { Song, Playlist } from '../types/Music';
import './Playlist.css';

interface PlaylistComponentProps {
    playlists: Playlist[];
    currentPlaylist: Playlist | null;
    currentSong: Song | null;
    onPlaylistSelect: (playlist: Playlist) => void;
    onSongSelect: (song: Song) => void;
    onCreatePlaylist: (name: string) => void;
}

const PlaylistComponent: React.FC<PlaylistComponentProps> = ({
    playlists,
    currentPlaylist,
    currentSong,
    onPlaylistSelect,
    onSongSelect,
    onCreatePlaylist
}) => {
    const [newPlaylistName, setNewPlaylistName] = React.useState('');

    const handleCreatePlaylist = (): void => {
        if (newPlaylistName.trim()) {
            onCreatePlaylist(newPlaylistName.trim());
            setNewPlaylistName('');
        }
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="playlist-section">
            <div className="playlist-sidebar">
                <h3>Playlists</h3>
                <div className="playlist-create">
                    <input
                        type="text"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="New playlist name"
                        className="playlist-input"
                    />
                    <button onClick={handleCreatePlaylist} className="create-playlist-btn">
                        +
                    </button>
                </div>
                <div className="playlist-list">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist.id}
                            className={`playlist-item ${currentPlaylist?.id === playlist.id ? 'active' : ''}`}
                            onClick={() => onPlaylistSelect(playlist)}
                        >
                            <img src={playlist.cover} alt={playlist.name} className="playlist-cover" />
                            <div className="playlist-info">
                                <div className="playlist-name">{playlist.name}</div>
                                <div className="playlist-count">{playlist.songs.length} songs</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="playlist-content">
                {currentPlaylist ? (
                    <>
                        <div className="playlist-header">
                            <img src={currentPlaylist.cover} alt={currentPlaylist.name} className="playlist-large-cover" />
                            <div className="playlist-details">
                                <h2>{currentPlaylist.name}</h2>
                                <p>{currentPlaylist.songs.length} songs</p>
                            </div>
                        </div>
                        <div className="songs-list">
                            {currentPlaylist.songs.map((song, index) => (
                                <div
                                    key={song.id}
                                    className={`song-item ${currentSong?.id === song.id ? 'active' : ''}`}
                                    onClick={() => onSongSelect(song)}
                                >
                                    <div className="song-number">{index + 1}</div>
                                    <img src={song.cover} alt={song.title} className="song-cover" />
                                    <div className="song-details">
                                        <div className="song-title">{song.title}</div>
                                        <div className="song-artist">{song.artist}</div>
                                    </div>
                                    <div className="song-duration">{formatDuration(song.duration)}</div>
                                    <div className="song-genre">{song.genre}</div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-playlist">
                        <div className="no-playlist-icon">🎵</div>
                        <h3>Select a Playlist</h3>
                        <p>Choose a playlist from the sidebar to start listening</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistComponent;