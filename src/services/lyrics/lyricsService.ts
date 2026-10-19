import type { LyricsData, LyricLine } from '../../types/music';

// Parse LRC string: [mm:ss.xx] or [mm:ss.xxx] line, stripping tags and syllables
export function parseLrc(lrcText: string): LyricLine[] {
  const lines = lrcText.split(/\r?\n/);
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;

  // Metadata tags to ignore
  const tagRegex = /^\[(ti|ar|al|by|offset|re|ve|length|id|hash):.*\]$/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (tagRegex.test(trimmed)) continue;

    // Reset regex index
    timeRegex.lastIndex = 0;
    const matches = [...trimmed.matchAll(timeRegex)];
    if (matches.length > 0) {
      // Strip timestamps and syllable markers like <00:12.34> or <word:1:2> or {bg}
      let text = trimmed
        .replace(timeRegex, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\{[^}]*\}/g, '')
        .trim();

      // Skip lines that became empty after removing tags, or pure instrumental indicators
      if (!text) continue;

      for (const match of matches) {
        const mins = parseInt(match[1], 10);
        const secs = parseInt(match[2], 10);
        const msFraction = match[3]
          ? match[3].length === 2
            ? parseInt(match[3], 10) / 100
            : parseInt(match[3], 10) / 1000
          : 0;
        const totalSeconds = mins * 60 + secs + msFraction;
        result.push({
          time: totalSeconds,
          text: text
        });
      }
    }
  }

  // Sort chronologically and deduplicate identical consecutive times
  result.sort((a, b) => a.time - b.time);
  return result;
}

export async function getTrackLyrics(
  trackTitle: string,
  artistName: string,
  duration?: number,
  videoId?: string,
  album?: string
): Promise<LyricsData> {
  try {
    const cleanTrack = trackTitle.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim();
    const cleanArtist = artistName.split(/,|&|feat|ft\./i)[0].trim();

    let query = `/api/music/lyrics?track=${encodeURIComponent(cleanTrack)}&artist=${encodeURIComponent(cleanArtist)}`;
    if (duration && duration > 0) {
      query += `&duration=${Math.round(duration)}`;
    }
    if (videoId) {
      query += `&videoId=${encodeURIComponent(videoId)}`;
    }
    if (album) {
      query += `&album=${encodeURIComponent(album)}`;
    }

    const res = await fetch(query);
    if (!res.ok) {
      return { found: false, isSynced: false, lines: [] };
    }

    const data = await res.json();
    if (data.syncedLyrics) {
      const parsed = parseLrc(data.syncedLyrics);
      if (parsed.length > 0) {
        return {
          found: true,
          isSynced: true,
          lines: parsed,
          trackName: data.trackName || trackTitle,
          artistName: data.artistName || artistName,
          provider: data.provider
        };
      }
    }

    if (data.plainLyrics) {
      const plainLines: LyricLine[] = data.plainLyrics
        .split(/\r?\n/)
        .map((line: string, i: number) => ({ time: i * 5, text: line.trim() }))
        .filter((l: LyricLine) => l.text.length > 0);

      return {
        found: true,
        isSynced: false,
        lines: plainLines,
        plainLyrics: data.plainLyrics,
        trackName: data.trackName || trackTitle,
        artistName: data.artistName || artistName,
        provider: data.provider
      };
    }

    return { found: false, isSynced: false, lines: [] };
  } catch (err) {
    console.error('Error fetching track lyrics:', err);
    return { found: false, isSynced: false, lines: [] };
  }
}
