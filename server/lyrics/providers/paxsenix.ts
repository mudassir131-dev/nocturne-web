import type { LyricsResult, LyricsSearchQuery } from '../types.js';

export async function fetchFromPaxsenix(query: LyricsSearchQuery): Promise<LyricsResult | null> {
  try {
    const { title, artist } = query;
    if (!title) return null;

    const cleanTitle = title
      .replace(/\s*\(.*?(official|video|audio|lyrics|lyric|hd|hq|remix|version).*?\)/gi, '')
      .replace(/\s*\[.*?(official|video|audio|lyrics|lyric|hd|hq|remix|version).*?\]/gi, '')
      .trim();
    const cleanArtist = artist.split(/,|&|feat|ft\./i)[0].trim();

    const searchUrl = `https://lyrics.paxsenix.org/apple-music/search?q=${encodeURIComponent(`${cleanTitle} ${cleanArtist}`)}`;
    const searchRes = await fetch(searchUrl, {
      signal: AbortSignal.timeout(3500),
      headers: {
        'User-Agent': 'echomusic/1.0',
        'Accept': 'application/json'
      }
    });

    if (!searchRes.ok) return null;
    const results = (await searchRes.json()) as any[];
    if (!Array.isArray(results) || results.length === 0 || !results[0].id) {
      return null;
    }

    const trackId = results[0].id;
    const lyricsUrl = `https://lyrics.paxsenix.org/apple-music/lyrics?id=${encodeURIComponent(trackId)}`;
    const lyricsRes = await fetch(lyricsUrl, {
      signal: AbortSignal.timeout(3500),
      headers: {
        'User-Agent': 'echomusic/1.0',
        'Accept': 'application/json'
      }
    });

    if (!lyricsRes.ok) return null;
    const data: any = await lyricsRes.json();

    // Check for TTML or ELRC or plain
    if (data.elrcMultiPerson) {
      return {
        found: true,
        provider: 'paxsenix',
        syncedLyrics: data.elrcMultiPerson,
        plainLyrics: null,
        trackName: cleanTitle,
        artistName: cleanArtist
      };
    }

    if (data.elrc) {
      return {
        found: true,
        provider: 'paxsenix',
        syncedLyrics: data.elrc,
        plainLyrics: null,
        trackName: cleanTitle,
        artistName: cleanArtist
      };
    }

    // Convert syllable content array to LRC if available
    if (Array.isArray(data.content) && data.content.length > 0) {
      const lrcLines = data.content.map((line: any) => {
        const timeMs = line.timestamp || 0;
        const minutes = Math.floor(timeMs / 60000);
        const seconds = Math.floor((timeMs % 60000) / 1000);
        const centiseconds = Math.floor((timeMs % 1000) / 10);
        const stamp = `[${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}]`;
        const text = Array.isArray(line.text) ? line.text.map((w: any) => w.text).join(' ') : (line.text || '');
        return `${stamp} ${text}`.trim();
      }).filter((l: string) => l.length > 0);

      if (lrcLines.length > 0) {
        return {
          found: true,
          provider: 'paxsenix',
          syncedLyrics: lrcLines.join('\n'),
          plainLyrics: null,
          trackName: cleanTitle,
          artistName: cleanArtist
        };
      }
    }

    if (data.plain) {
      return {
        found: true,
        provider: 'paxsenix',
        syncedLyrics: null,
        plainLyrics: data.plain,
        trackName: cleanTitle,
        artistName: cleanArtist
      };
    }

    return null;
  } catch (err: any) {
    return null;
  }
}
