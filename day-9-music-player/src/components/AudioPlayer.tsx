import React, { useRef, useEffect } from 'react';
import { Song } from '../types/Music';
import './AudioPlayer.css';

interface AudioPlayerProps {
    currentSong: Song | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    onPlayPause: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
    onMuteToggle: () => void;
    onNext: () => void;
    onPrevious: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    onPlayPause,
    onSeek,
    onVolumeChange,
    onMuteToggle,
    onNext,
    onPrevious
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(console.error);
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSong]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const handleTimeUpdate = (): void => {
        if (audioRef.current) {
            onSeek(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = (): void => {
        if (audioRef.current) {
            onSeek(0);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        const progressBar = e.currentTarget;
        const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
        const progressBarWidth = progressBar.clientWidth;
        const seekTime = (clickPosition / progressBarWidth) * duration;
        onSeek(seekTime);

        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="audio-player">
            <audio
                ref={audioRef}
                src={currentSong?.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={onNext}
            />

            <div className="player-controls">
                <button onClick={onPrevious} className="control-btn previous-btn" title="Previous">
                    ⏮
                </button>

                <button onClick={onPlayPause} className="control-btn play-pause-btn" title={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? '⏸️' : '▶️'}
                </button>

                <button onClick={onNext} className="control-btn next-btn" title="Next">
                    ⏭
                </button>
            </div>

            <div className="progress-section">
                <span className="time-current">{formatTime(currentTime)}</span>

                <div className="progress-bar" onClick={handleProgressClick}>
                    <div
                        className="progress-fill"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <div
                        className="progress-handle"
                        style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                </div>

                <span className="time-duration">{formatTime(duration)}</span>
            </div>

            <div className="volume-section">
                <button onClick={onMuteToggle} className="volume-btn" title={isMuted ? 'Unmute' : 'Mute'}>
                    {isMuted ? '🔇' : volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔈'}
                </button>

                <div className="volume-bar" onClick={(e) => {
                    const volumeBar = e.currentTarget;
                    const clickPosition = e.clientX - volumeBar.getBoundingClientRect().left;
                    const volumeBarWidth = volumeBar.clientWidth;
                    const newVolume = clickPosition / volumeBarWidth;
                    onVolumeChange(newVolume);
                }}>
                    <div
                        className="volume-fill"
                        style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                    />
                </div>
            </div>

            {currentSong && (
                <div className="now-playing">
                    <div className="song-cover">
                        <img src={currentSong.cover} alt={currentSong.title} />
                    </div>
                    <div className="song-info">
                        <div className="song-title">{currentSong.title}</div>
                        <div className="song-artist">{currentSong.artist}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioPlayer;