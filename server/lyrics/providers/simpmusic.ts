import type { LyricsResult, LyricsSearchQuery } from '../types.js';

export async function fetchFromSimpMusic(query: LyricsSearchQuery): Promise<LyricsResult | null> {
  try {
    const { videoId, duration } = query;
    if (!videoId) return null;

    const url = `https://api-lyrics.simpmusic.org/v1/${videoId}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3500),
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SimpMusicLyrics/1.0',
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) return null;
    const apiResponse: any = await res.json();
    if (!apiResponse.success || !Array.isArray(apiResponse.data) || apiResponse.data.length === 0) {
      return null;
    }

    const tracks: any[] = apiResponse.data;
    let best = tracks[0];
    if (duration && duration > 0 && tracks.length > 1) {
      best = tracks.reduce((prev, curr) => {
        const prevDiff = Math.abs((prev.duration || 0) - duration);
        const currDiff = Math.abs((curr.duration || 0) - duration);
        return currDiff < prevDiff ? curr : prev;
      }, tracks[0]);
    }

    const synced = best.syncedLyrics || null;
    const plain = best.plainLyrics || null;
    if (!synced && !plain) return null;

    return {
      found: true,
      provider: 'simpmusic',
      syncedLyrics: synced,
      plainLyrics: plain,
      trackName: query.title,
      artistName: query.artist
    };
  } catch (err: any) {
    return null;
  }
}
