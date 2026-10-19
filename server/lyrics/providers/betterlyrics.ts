import type { LyricsResult, LyricsSearchQuery } from '../types.js';

export async function fetchFromBetterLyrics(query: LyricsSearchQuery): Promise<LyricsResult | null> {
  try {
    const { title, artist, duration, album } = query;
    if (!title) return null;

    const cleanTitle = title.trim();
    const cleanArtist = artist.trim();

    let url = `https://lyrics-api.boidu.dev/getLyrics?s=${encodeURIComponent(cleanTitle)}&a=${encodeURIComponent(cleanArtist)}`;
    if (album) url += `&al=${encodeURIComponent(album)}`;
    if (duration && duration > 0) url += `&d=${Math.round(duration)}`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(3500),
      headers: { 'User-Agent': 'NocturneWeb/1.0' }
    });

    if (!res.ok) return null;
    const data: any = await res.json();
    if (data && data.ttml && typeof data.ttml === 'string' && data.ttml.trim().length > 0) {
      return {
        found: true,
        provider: 'betterlyrics',
        syncedLyrics: data.ttml,
        plainLyrics: null,
        trackName: cleanTitle,
        artistName: cleanArtist
      };
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function fetchFromUnison(query: LyricsSearchQuery): Promise<LyricsResult | null> {
  try {
    const { videoId, title, artist, duration } = query;

    let url = `https://unison.boidu.dev/lyrics?`;
    if (videoId) {
      url += `v=${encodeURIComponent(videoId)}`;
    } else {
      url += `song=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`;
      if (duration && duration > 0) url += `&duration=${Math.round(duration)}`;
    }

    const res = await fetch(url, {
      signal: AbortSignal.timeout(3500),
      headers: { 'User-Agent': 'NocturneWeb/1.0' }
    });

    if (!res.ok) return null;
    const data: any = await res.json();
    if (data && data.success && data.data && data.data.lyrics) {
      const isSynced = data.data.syncType === 'LINE' || data.data.syncType === 'SYLLABLE' || /\[\d{2}:\d{2}/.test(data.data.lyrics);
      return {
        found: true,
        provider: 'unison',
        syncedLyrics: isSynced ? data.data.lyrics : null,
        plainLyrics: isSynced ? null : data.data.lyrics,
        trackName: title,
        artistName: artist
      };
    }
    return null;
  } catch (e) {
    return null;
  }
}
