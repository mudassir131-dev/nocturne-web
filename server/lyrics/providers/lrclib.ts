import type { LyricsResult, LyricsSearchQuery } from '../types.js';

export async function fetchFromLrcLib(query: LyricsSearchQuery): Promise<LyricsResult | null> {
  try {
    const { title, artist, duration } = query;
    if (!title) return null;

    const cleanTitle = title
      .replace(/\s*\(.*?(official|video|audio|lyrics|lyric|hd|hq|remix|version).*?\)/gi, '')
      .replace(/\s*\[.*?(official|video|audio|lyrics|lyric|hd|hq|remix|version).*?\]/gi, '')
      .replace(/\|.*$/g, '')
      .trim();
    const cleanArtist = artist.split(/,|&|feat|ft\./i)[0].trim();

    // 1. Direct get endpoint
    let getUrl = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTitle)}&artist_name=${encodeURIComponent(cleanArtist)}`;
    if (duration && duration > 0) {
      getUrl += `&duration=${Math.round(duration)}`;
    }

    try {
      const res = await fetch(getUrl, {
        signal: AbortSignal.timeout(4000),
        headers: {
          'User-Agent': 'NocturneWeb/1.0 (https://github.com/mudassir131-dev/nocturne)'
        }
      });
      if (res.ok) {
        const data: any = await res.json();
        if (data.syncedLyrics || data.plainLyrics) {
          return {
            found: true,
            provider: 'lrclib',
            syncedLyrics: data.syncedLyrics || null,
            plainLyrics: data.plainLyrics || null,
            trackName: data.trackName || cleanTitle,
            artistName: data.artistName || cleanArtist
          };
        }
      }
    } catch (e) {
      // Continue to search fallback
    }

    // 2. Search fallback
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${cleanTitle} ${cleanArtist}`)}`;
    const searchRes = await fetch(searchUrl, {
      signal: AbortSignal.timeout(4000),
      headers: {
        'User-Agent': 'NocturneWeb/1.0 (https://github.com/mudassir131-dev/nocturne)'
      }
    });

    if (searchRes.ok) {
      const results = (await searchRes.json()) as any[];
      if (Array.isArray(results) && results.length > 0) {
        // Pick best matching candidate (duration match prioritized)
        let best = results[0];
        if (duration && duration > 0) {
          const withSynced = results.filter(r => r.syncedLyrics);
          const pool = withSynced.length > 0 ? withSynced : results;
          best = pool.reduce((prev, curr) => {
            const prevDiff = Math.abs((prev.duration || 0) - duration);
            const currDiff = Math.abs((curr.duration || 0) - duration);
            return currDiff < prevDiff ? curr : prev;
          }, pool[0]);
        }

        if (best.syncedLyrics || best.plainLyrics) {
          return {
            found: true,
            provider: 'lrclib',
            syncedLyrics: best.syncedLyrics || null,
            plainLyrics: best.plainLyrics || null,
            trackName: best.trackName || cleanTitle,
            artistName: best.artistName || cleanArtist
          };
        }
      }
    }

    return null;
  } catch (err: any) {
    return null;
  }
}
