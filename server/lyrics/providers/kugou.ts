import type { LyricsResult, LyricsSearchQuery } from '../types.js';

export async function fetchFromKuGou(query: LyricsSearchQuery): Promise<LyricsResult | null> {
  try {
    const { title, artist, duration } = query;
    if (!title) return null;

    // Clean track title & artist (stripping audio/video/feat tags)
    const cleanTitle = title
      .replace(/\s*\(.*?(official|video|audio|lyrics|lyric|hd|hq|remix|version).*?\)/gi, '')
      .replace(/\s*\[.*?(official|video|audio|lyrics|lyric|hd|hq|remix|version).*?\]/gi, '')
      .replace(/\|.*$/g, '')
      .replace(/\s*-\s*(official|video|audio|lyrics).*$/gi, '')
      .trim();
    const cleanArtist = artist.split(/,|&|feat|ft\./i)[0].trim();

    const searchKeyword = `${cleanTitle} ${cleanArtist}`.trim();
    const searchUrl = `https://mobileservice.kugou.com/api/v3/search/song?version=9108&plat=0&pagesize=8&showtype=0&keyword=${encodeURIComponent(searchKeyword)}`;

    const searchRes = await fetch(searchUrl, {
      signal: AbortSignal.timeout(4500),
      headers: { 'User-Agent': 'KuGou-Mobile/9108 (Android)' }
    });

    if (!searchRes.ok) return null;
    const searchData: any = await searchRes.json();
    const songList: any[] = searchData?.data?.info || [];
    if (songList.length === 0) return null;

    // Pick best match (closest duration if provided, otherwise first result)
    let bestSong = songList[0];
    if (duration && duration > 0 && songList.length > 1) {
      bestSong = songList.reduce((prev, curr) => {
        const prevDiff = Math.abs((prev.duration || 0) - duration);
        const currDiff = Math.abs((curr.duration || 0) - duration);
        return currDiff < prevDiff ? curr : prev;
      }, songList[0]);
    }

    const hash = bestSong.hash || bestSong['320hash'] || bestSong.sqhash;
    if (!hash) return null;

    // Query lyrics candidates for this hash
    const candidatesUrl = `https://lyrics.kugou.com/search?ver=1&man=yes&client=pc&hash=${hash}`;
    const candRes = await fetch(candidatesUrl, {
      signal: AbortSignal.timeout(4000),
      headers: { 'User-Agent': 'KuGou-PC/1.0' }
    });

    if (!candRes.ok) return null;
    const candData: any = await candRes.json();
    const candidates: any[] = candData?.candidates || [];
    if (candidates.length === 0) return null;

    // Select candidate with highest score
    const bestCand = candidates.reduce((prev, curr) => {
      return (curr.score || 0) > (prev.score || 0) ? curr : prev;
    }, candidates[0]);

    if (!bestCand.id || !bestCand.accesskey) return null;

    // Download lyrics
    const downloadUrl = `https://lyrics.kugou.com/download?ver=1&client=pc&id=${bestCand.id}&accesskey=${bestCand.accesskey}&fmt=lrc&charset=utf8`;
    const dlRes = await fetch(downloadUrl, {
      signal: AbortSignal.timeout(4000),
      headers: { 'User-Agent': 'KuGou-PC/1.0' }
    });

    if (!dlRes.ok) return null;
    const dlData: any = await dlRes.json();
    if (!dlData.content) return null;

    const rawLrc = Buffer.from(dlData.content, 'base64').toString('utf8');
    if (!rawLrc || rawLrc.trim().length === 0) return null;

    const hasTimestamp = /\[\d{2}:\d{2}/.test(rawLrc);

    return {
      found: true,
      provider: 'kugou',
      syncedLyrics: hasTimestamp ? rawLrc : null,
      plainLyrics: hasTimestamp ? null : rawLrc,
      trackName: bestCand.song || cleanTitle,
      artistName: bestCand.singer || cleanArtist
    };
  } catch (err: any) {
    return null;
  }
}
