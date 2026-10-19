export interface Track {
  id: string;
  title: string;
  artists: string[];
  album: string;
  artworkUrl: string;
  duration: number; // in seconds
  durationFormatted: string;
  source: 'innertube';
  streamAvailability: boolean;
  explicit?: boolean;
  releaseDate?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  artworkUrl: string;
  year: string;
  genre: string;
  editorialNotes?: string;
  tracks: Track[];
}

export interface Playlist {
  id: string;
  title: string;
  curator: string;
  description: string;
  artworkUrl: string;
  bannerColor?: string;
  trackCount: number;
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  avatarUrl: string;
  headerImageUrl: string;
  bio: string;
  topSongs: Track[];
  albums: Album[];
}

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface LyricsData {
  found: boolean;
  isSynced: boolean;
  lines: LyricLine[];
  plainLyrics?: string;
  trackName?: string;
  artistName?: string;
  provider?: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlaybackState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  queueIndex: number;
  isBuffering: boolean;
  error: string | null;
}
