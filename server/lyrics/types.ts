export interface LyricsResult {
  found: boolean;
  provider: 'kugou' | 'lrclib' | 'youlyplus' | 'youtube' | 'simpmusic' | 'paxsenix' | 'betterlyrics' | 'unison' | 'none';
  syncedLyrics: string | null;
  plainLyrics: string | null;
  trackName?: string;
  artistName?: string;
  hasWordLevel?: boolean;
}

export interface LyricsSearchQuery {
  title: string;
  artist: string;
  duration?: number;
  album?: string;
  videoId?: string;
}
