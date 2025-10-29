import React, { useState, useEffect, useRef } from 'react';
import { Song, Playlist, PlayerState, EqualizerBand } from '../types/Music';
import AudioPlayer from './AudioPlayer';
import Visualizer from './Visualizer';
import Equalizer from './Equalizer';
import PlaylistComponent from './PlaylistComponent';
import './MusicPlayer.css';

// Sample music data (in a real app, this would come from an API)
const sampleSongs: Song[] = [
    {
        id: '1',
        title: 'Sunset Dreams',
        artist: 'Chill Beats',
        duration: 180,
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150',
        audioUrl: '/songs/sunset-dreams.mp3',
        genre: 'Chill'
    },
    {
        id: '2',
        title: 'Morning Coffee',
        artist: 'Acoustic Vibes',
        duration: 210,
        cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=150',
        audioUrl: '/songs/morning-coffee.mp3',
        genre: 'Acoustic'
    },
    {
        id: '3',
        title: 'Night Drive',
        artist: 'Synth Wave',
        duration: 240,
        cover: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=150',
        audioUrl: '/songs/night-drive.mp3',
        genre: 'Electronic'
    },
    {
        id: '4',
        title: 'Forest Walk',
        artist: 'Nature Sounds',
        duration: 195,
        cover: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=150',
        audioUrl: '/songs/forest-walk.mp3',
        genre: 'Ambient'
    },
    {
        id: '5',
        title: 'City Lights',
        artist: 'Urban Jazz',
        duration: 225,
        cover: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=150',
        audioUrl: '/songs/city-lights.mp3',
        genre: 'Jazz'
    }
];

const samplePlaylists: Playlist[] = [
    {
        id: '1',
        name: 'Chill Vibes',
        songs: [sampleSongs[0], sampleSongs[1]],
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300'
    },
    {
        id: '2',
        name: 'Focus Mode',
        songs: [sampleSongs[2], sampleSongs[3]],
        cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300'
    },
    {
        id: '3',
        name: 'Energy Boost',
        songs: [sampleSongs[4], sampleSongs[0], sampleSongs[2]],
        cover: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=300'
    }
];

const equalizerBands: EqualizerBand[] = [
    { frequency: 60, gain: 0, label: '60Hz' },
    { frequency: 230, gain: 0, label: '230Hz' },
    { frequency: 910, gain: 0, label: '910Hz' },
    { frequency: 3600, gain: 0, label: '3.6kHz' },
    { frequency: 14000, gain: 0, label: '14kHz' }
];

const MusicPlayer: React.FC = () => {
    const [playerState, setPlayerState] = useState<PlayerState>({
        currentSong: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 0.7,
        isMuted: false,
        isShuffled: false,
        repeatMode: 'off',
        playlist: [],
        currentPlaylist: null
    });

    const [playlists, setPlaylists] = useState<Playlist[]>(samplePlaylists);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [activeTab, setActiveTab] = useState<'playlist' | 'visualizer' | 'equalizer'>('playlist');

    const audioRef = useRef<HTMLAudioElement>(null);

    // Initialize Audio Context
    useEffect(() => {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);

        return () => {
            context.close();
        };
    }, []);

    // Play/Pause handler
    const handlePlayPause = (): void => {
        setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    };

    // Seek handler
    const handleSeek = (time: number): void => {
        setPlayerState(prev => ({ ...prev, currentTime: time }));
    };

    // Volume handler
    const handleVolumeChange = (volume: number): void => {
        setPlayerState(prev => ({ ...prev, volume, isMuted: volume === 0 }));
    };

    // Mute handler
    const handleMuteToggle = (): void => {
        setPlayerState(prev => ({ ...prev, isMuted: !prev.isMuted }));
    };

    // Next song handler
    const handleNext = (): void => {
        if (!playerState.currentSong || !playerState.playlist.length) return;

        const currentIndex = playerState.playlist.findIndex(
            song => song.id === playerState.currentSong?.id
        );

        let nextIndex;
        if (playerState.isShuffled) {
            nextIndex = Math.floor(Math.random() * playerState.playlist.length);
        } else {
            nextIndex = (currentIndex + 1) % playerState.playlist.length;
        }

        const nextSong = playerState.playlist[nextIndex];
        setPlayerState(prev => ({
            ...prev,
            currentSong: nextSong,
            currentTime: 0,
            isPlaying: true
        }));
    };

    // Previous song handler
    const handlePrevious = (): void => {
        if (!playerState.currentSong || !playerState.playlist.length) return;

        const currentIndex = playerState.playlist.findIndex(
            song => song.id === playerState.currentSong?.id
        );

        const prevIndex = currentIndex <= 0 ? playerState.playlist.length - 1 : currentIndex - 1;
        const prevSong = playerState.playlist[prevIndex];

        setPlayerState(prev => ({
            ...prev,
            currentSong: prevSong,
            currentTime: 0,
            isPlaying: true
        }));
    };

    // Song selection handler
    const handleSongSelect = (song: Song): void => {
        setPlayerState(prev => ({
            ...prev,
            currentSong: song,
            currentTime: 0,
            isPlaying: true
        }));
    };

    // Playlist selection handler
    const handlePlaylistSelect = (playlist: Playlist): void => {
        setPlayerState(prev => ({
            ...prev,
            currentPlaylist: playlist,
            playlist: playlist.songs,
            currentSong: playlist.songs[0] || null,
            currentTime: 0,
            isPlaying: playlist.songs.length > 0
        }));
    };

    // Create new playlist
    const handleCreatePlaylist = (name: string): void => {
        const newPlaylist: Playlist = {
            id: Date.now().toString(),
            name,
            songs: [],
            cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300'
        };

        setPlaylists(prev => [...prev, newPlaylist]);
    };

    // Equalizer band change handler
    const handleEqualizerChange = (frequency: number, gain: number): void => {
        // In a real app, this would apply the EQ to the audio
        console.log(`EQ Change: ${frequency}Hz -> ${gain}dB`);
    };

    // Repeat mode handler
    const handleRepeatToggle = (): void => {
        const modes: ('off' | 'one' | 'all')[] = ['off', 'one', 'all'];
        const currentIndex = modes.indexOf(playerState.repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;

        setPlayerState(prev => ({ ...prev, repeatMode: modes[nextIndex] }));
    };

    // Shuffle handler
    const handleShuffleToggle = (): void => {
        setPlayerState(prev => ({ ...prev, isShuffled: !prev.isShuffled }));
    };

    return (
        <div className="music-player">
            <div className="player-header">
                <h1>🎵 Music Player</h1>
                <p>Enjoy your favorite tunes with advanced features</p>
            </div>

            <div className="player-main">
                <div className="player-controls-section">
                    <AudioPlayer
                        currentSong={playerState.currentSong}
                        isPlaying={playerState.isPlaying}
                        currentTime={playerState.currentTime}
                        duration={playerState.duration}
                        volume={playerState.volume}
                        isMuted={playerState.isMuted}
                        onPlayPause={handlePlayPause}
                        onSeek={handleSeek}
                        onVolumeChange={handleVolumeChange}
                        onMuteToggle={handleMuteToggle}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />

                    <div className="player-extra-controls">
                        <button
                            onClick={handleShuffleToggle}
                            className={`control-btn ${playerState.isShuffled ? 'active' : ''}`}
                            title="Shuffle"
                        >
                            🔀
                        </button>
                        <button
                            onClick={handleRepeatToggle}
                            className={`control-btn ${playerState.repeatMode !== 'off' ? 'active' : ''}`}
                            title={`Repeat: ${playerState.repeatMode}`}
                        >
                            {playerState.repeatMode === 'one' ? '🔂' : '🔁'}
                        </button>
                    </div>
                </div>

                <div className="player-tabs">
                    <button
                        onClick={() => setActiveTab('playlist')}
                        className={`tab-btn ${activeTab === 'playlist' ? 'active' : ''}`}
                    >
                        📋 Playlist
                    </button>
                    <button
                        onClick={() => setActiveTab('visualizer')}
                        className={`tab-btn ${activeTab === 'visualizer' ? 'active' : ''}`}
                    >
                        🌊 Visualizer
                    </button>
                    <button
                        onClick={() => setActiveTab('equalizer')}
                        className={`tab-btn ${activeTab === 'equalizer' ? 'active' : ''}`}
                    >
                        🎛️ Equalizer
                    </button>
                </div>

                <div className="player-content">
                    {activeTab === 'playlist' && (
                        <PlaylistComponent
                            playlists={playlists}
                            currentPlaylist={playerState.currentPlaylist}
                            currentSong={playerState.currentSong}
                            onPlaylistSelect={handlePlaylistSelect}
                            onSongSelect={handleSongSelect}
                            onCreatePlaylist={handleCreatePlaylist}
                        />
                    )}

                    {activeTab === 'visualizer' && (
                        <Visualizer
                            audioContext={audioContext}
                            audioElement={audioRef.current}
                            isPlaying={playerState.isPlaying}
                        />
                    )}

                    {activeTab === 'equalizer' && (
                        <Equalizer
                            bands={equalizerBands}
                            onBandChange={handleEqualizerChange}
                        />
                    )}
                </div>
            </div>

            {/* Hidden audio element for Visualizer */}
            <audio
                ref={audioRef}
                src={playerState.currentSong?.audioUrl}
                onTimeUpdate={() => audioRef.current && handleSeek(audioRef.current.currentTime)}
                onLoadedMetadata={() => audioRef.current && handleSeek(0)}
            />
        </div>
    );
};

export default MusicPlayer;