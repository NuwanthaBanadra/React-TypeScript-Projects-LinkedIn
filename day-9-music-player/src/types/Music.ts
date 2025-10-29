export interface Song {
    id: string;
    title: string;
    artist: string;
    duration: number;
    cover: string;
    audioUrl: string;
    genre: string;
}

export interface Playlist {
    id: string;
    name: string;
    songs: Song[];
    cover: string;
}

export interface PlayerState {
    currentSong: Song | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    isShuffled: boolean;
    repeatMode: 'off' | 'one' | 'all';
    playlist: Song[];
    currentPlaylist: Playlist | null;
}

export interface AudioVisualizer {
    analyser: AnalyserNode | null;
    dataArray: Uint8Array | null;
    bufferLength: number;
}

export interface EqualizerBand {
    frequency: number;
    gain: number;
    label: string;
}