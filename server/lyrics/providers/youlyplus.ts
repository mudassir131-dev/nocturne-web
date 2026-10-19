import type { LyricsResult, LyricsSearchQuery } from '../types.js';

const BASE_SERVERS = [
  'https://lyricsplus.binimum.org',
  'https://lyricsplus.prjktla.workers.dev',
  'https://lyricsplus-seven.vercel.app',
  'https://lyrics-plus-backend.vercel.app',
  'https://lyricsplus.prjktla.my.id',
  'https://lyricsplus.atomix.one'
];

let lastWorkingServer: string | null = null;

function formatLrcTimestamp(timeMs: number): string {
  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);
  const millis = Math.floor(timeMs % 1000);
  return `[${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}]`;
}

function convertItemsToLrc(items: any[]): string {
  return items
    .map(item => {
      const timeMs = item.time || 0;
      const stamp = formatLrcTimestamp(timeMs);
      const text = item.text || '';
      return `${stamp} ${text}`.trim();
    })
    .filter(line => line.length > 0)
    .join('\n');
}

async function fetchFromSingleServer(server: string, query: LyricsSearchQuery): Promise<LyricsResult | null> {
  const { title, artist, duration, album, videoId } = query;
  const cleanTitle = title
    .replace(/\s*\(.*?(official|video|audio|lyrics|lyric|hd|hq|remix|version).*?\)/gi, '')
    .replace(/\s*\[.*?(official|video|audio|lyrics|lyric|hd|hq|remix|version).*?\]/gi, '')
    .replace(/\|.*$/g, '')
    .trim();
  const cleanArtist = artist.split(/,|&|feat|ft\./i)[0].trim();

  let url = `${server.replace(/\/$/, '')}/v2/lyrics/get?title=${encodeURIComponent(cleanTitle)}&artist=${encodeURIComponent(cleanArtist)}`;
  if (duration && duration > 0) url += `&duration=${Math.round(duration)}`;
  if (album) url += `&album=${encodeURIComponent(album)}`;
  if (videoId) url += `&id=${encodeURIComponent(videoId)}`;

  const res = await fetch(url, {
    signal: AbortSignal.timeout(3500),
    headers: { 'User-Agent': 'NocturneWeb/1.0' }
  });

  if (!res.ok) return null;
  const data: any = await res.json();

  let syncedLyrics: string | null = null;
  let plainLyrics: string | null = null;

  if (typeof data.syncedLyrics === 'string' && data.syncedLyrics.trim().length > 0) {
    syncedLyrics = data.syncedLyrics;
  } else if (Array.isArray(data.lyrics) && data.lyrics.length > 0) {
    syncedLyrics = convertItemsToLrc(data.lyrics);
  }

  if (typeof data.plainLyrics === 'string' && data.plainLyrics.trim().length > 0) {
    plainLyrics = data.plainLyrics;
  }

  if (!syncedLyrics && !plainLyrics) return null;

  return {
    found: true,
    provider: 'youlyplus',
    syncedLyrics,
    plainLyrics,
    trackName: cleanTitle,
    artistName: cleanArtist
  };
}

export async function fetchFromYouLyPlus(query: LyricsSearchQuery): Promise<LyricsResult | null> {
  try {
    const servers = lastWorkingServer
      ? [lastWorkingServer, ...BASE_SERVERS.filter(s => s !== lastWorkingServer)]
      : BASE_SERVERS;

    // Race servers in parallel with Promise.any
    const promises = servers.map(async server => {
      const result = await fetchFromSingleServer(server, query);
      if (!result || (!result.syncedLyrics && !result.plainLyrics)) {
        throw new Error(`No lyrics on ${server}`);
      }
      lastWorkingServer = server;
      return result;
    });

    return await Promise.any(promises);
  } catch (err: any) {
    return null;
  }
}
