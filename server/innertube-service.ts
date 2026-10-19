import { Innertube } from 'youtubei.js';

let innertubeInstance: Innertube | null = null;

export async function getInnertube(): Promise<Innertube> {
  if (!innertubeInstance) {
    innertubeInstance = await Innertube.create({
      retrieve_player: true
    });
  }
  return innertubeInstance;
}

export interface NormalizedTrack {
  id: string;
  title: string;
  artists: string[];
  album?: string;
  artworkUrl: string;
  duration: number; // seconds
  durationFormatted: string;
  source: 'innertube';
  streamAvailability: boolean;
  explicit?: boolean;
}

export interface NormalizedAlbum {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  year?: string;
  trackCount?: number;
  tracks: NormalizedTrack[];
}

export interface NormalizedPlaylist {
  id: string;
  title: string;
  description?: string;
  curator: string;
  artworkUrl: string;
  trackCount: number;
  tracks: NormalizedTrack[];
}

export interface NormalizedArtist {
  id: string;
  name: string;
  artworkUrl: string;
  subscribers?: string;
  topSongs: NormalizedTrack[];
  albums: NormalizedAlbum[];
}

// Convert "3:45" or "1:02:30" to seconds
export function parseDurationToSeconds(durationStr: string): number {
  if (!durationStr) return 0;
  const parts = durationStr.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

export function formatSecondsToTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function cleanYouTubeMusicTitle(title: string): string {
  if (!title) return 'Unknown Title';
  return title
    .replace(/\s*\(Official\s*(?:Music\s*)?(?:Video|Audio|Lyrical|Lyric\s*Video|Music\s*Film|Visualizer|Teaser)?\)/gi, '')
    .replace(/\s*\[Official\s*(?:Music\s*)?(?:Video|Audio|Lyrical|Lyric\s*Video|Music\s*Film|Visualizer|Teaser)?\]/gi, '')
    .replace(/\s*\(4K\s*(?:60fps|Ultra\s*HD|HD)?\)/gi, '')
    .replace(/\s*\[4K\s*(?:60fps|Ultra\s*HD|HD)?\]/gi, '')
    .replace(/\s*\(Full\s*(?:Song|Video|Audio)\)/gi, '')
    .replace(/\s*\[Full\s*(?:Song|Video|Audio)\]/gi, '')
    .replace(/\s*\(Audio\)/gi, '')
    .replace(/\s*\[Audio\]/gi, '')
    .replace(/\s*\(Video\)/gi, '')
    .replace(/\s*\[Video\]/gi, '')
    .replace(/\s*\(Lyrics\)/gi, '')
    .replace(/\s*\[Lyrics\]/gi, '')
    .replace(/\s*\|\s*(?:Official|Lyrical|Full Song|T-Series|Zee Music|Sony Music|Speed Records|YRF).*$/gi, '')
    .replace(/\s*-\s*Official.*$/gi, '')
    .trim();
}

function upgradeArtworkUrl(url?: string): string {
  if (!url) return '';
  // Upgrade YouTube Music thumbnails to crisp high resolution 544x544
  if (url.includes('=w') && url.includes('-h')) {
    return url.replace(/=w\d+-h\d+[^?]*/, '=w544-h544-l90-rj');
  }
  return url;
}

function parseMusicItemToTrack(item: any, seenIds: Set<string>): NormalizedTrack | null {
  if (!item || !item.id || seenIds.has(item.id)) return null;

  const durationSec = item.duration?.seconds || parseDurationToSeconds(item.duration?.text || '3:30');
  // Filter out non-song noise (podcasts > 15m or fragments < 30s)
  if (durationSec > 900 || durationSec < 30) return null;

  seenIds.add(item.id);
  const rawTitle = item.title?.text || item.title || 'Unknown Title';
  const cleanTitle = cleanYouTubeMusicTitle(rawTitle);

  // Extract artists list
  let artistNames: string[] = [];
  if (Array.isArray(item.artists)) {
    artistNames = item.artists.map((a: any) => a.name || a.text).filter(Boolean);
  } else if (item.author?.name) {
    artistNames = [item.author.name];
  }
  if (artistNames.length === 0) artistNames = ['Various Artists'];

  const rawThumb = item.thumbnails?.[item.thumbnails.length - 1]?.url ||
                   item.thumbnails?.[0]?.url ||
                   `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;
  const artworkUrl = upgradeArtworkUrl(rawThumb);

  return {
    id: item.id,
    title: cleanTitle,
    artists: artistNames,
    album: item.album?.name || 'Single',
    artworkUrl,
    duration: durationSec,
    durationFormatted: item.duration?.text || formatSecondsToTime(durationSec),
    source: 'innertube',
    streamAvailability: true,
    explicit: false
  };
}

export async function searchTracks(query: string, deep: boolean = false): Promise<NormalizedTrack[]> {
  if (deep) {
    const result = await searchTracksDeep(query);
    return result.tracks;
  }

  try {
    const yt = await getInnertube();
    const tracks: NormalizedTrack[] = [];
    const seenIds = new Set<string>();

    // 1. Primary: YouTube Music official songs search
    try {
      const musicRes: any = await yt.music.search(query, { type: 'song' });
      const songItems: any[] = musicRes.songs?.contents || musicRes.contents || [];

      for (const item of songItems) {
        const parsed = parseMusicItemToTrack(item, seenIds);
        if (parsed) tracks.push(parsed);
      }
    } catch (e: any) {
      console.warn('YouTube Music song search fallback:', e.message);
    }

    // 2. Secondary fallback if YouTube Music returned fewer than 6 tracks
    if (tracks.length < 6) {
      try {
        const vidRes = await yt.search(`${query} audio`, { type: 'video' });
        if (vidRes.videos) {
          for (const item of vidRes.videos.slice(0, 15)) {
            const v: any = item;
            if (!v || !v.id || seenIds.has(v.id)) continue;

            const durationSec = parseDurationToSeconds(v.duration?.text || '3:30');
            if (durationSec > 900 || durationSec < 30) continue;

            seenIds.add(v.id);
            const cleanTitle = cleanYouTubeMusicTitle(v.title?.text || 'Unknown Title');
            const thumb = v.thumbnails?.[v.thumbnails.length - 1]?.url ||
                          v.thumbnails?.[0]?.url ||
                          `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;

            tracks.push({
              id: v.id,
              title: cleanTitle,
              artists: [v.author?.name || 'Various Artists'],
              album: 'Single',
              artworkUrl: upgradeArtworkUrl(thumb),
              duration: durationSec,
              durationFormatted: v.duration?.text || formatSecondsToTime(durationSec),
              source: 'innertube',
              streamAvailability: true,
              explicit: false
            });
          }
        }
      } catch (err: any) {
        console.error('Video fallback search error:', err.message);
      }
    }

    return tracks;
  } catch (err: any) {
    console.error('Search error in InnerTube:', err);
    return [];
  }
}

export async function searchTracksDeep(query: string, options?: { maxKeywords?: number }): Promise<{
  tracks: NormalizedTrack[];
  relatedKeywords: string[];
}> {
  try {
    const yt = await getInnertube();
    const tracks: NormalizedTrack[] = [];
    const seenIds = new Set<string>();

    // 1. Parallel fetch of primary song search and YouTube algorithm search suggestions
    const [primaryRes, rawSuggestions] = await Promise.all([
      yt.music.search(query, { type: 'song' }).catch(() => null),
      yt.getSearchSuggestions(query).catch(() => [] as string[])
    ]);

    // Extract related keywords from YouTube search algorithm
    const cleanQuery = query.trim().toLowerCase();
    const relatedKeywords = (rawSuggestions as string[])
      .filter(s => s && s.toLowerCase().trim() !== cleanQuery)
      .slice(0, 10);

    // Collect tracks from primary result
    if (primaryRes) {
      const primaryItems: any[] = primaryRes.songs?.contents || primaryRes.contents || [];
      for (const item of primaryItems) {
        const parsed = parseMusicItemToTrack(item, seenIds);
        if (parsed) tracks.push(parsed);
      }

      // Continuation from primary search (loads 2nd batch from YouTube)
      if (primaryRes.has_continuation) {
        try {
          const next: any = await primaryRes.getContinuation();
          const nextItems: any[] = (next.contents?.contents || next.contents || []) as any[];
          for (const item of nextItems) {
            const parsed = parseMusicItemToTrack(item, seenIds);
            if (parsed) tracks.push(parsed);
          }
        } catch (e) {
          // ignore continuation error
        }
      }
    }

    // 2. Expand with top YouTube search algorithm keywords
    const topKeywords = relatedKeywords.slice(0, options?.maxKeywords || 4);
    if (topKeywords.length > 0) {
      const keywordResults = await Promise.allSettled(
        topKeywords.map(kw => yt.music.search(kw, { type: 'song' }))
      );

      for (const res of keywordResults) {
        if (res.status === 'fulfilled' && res.value) {
          const kwItems: any[] = ((res.value as any).songs?.contents || (res.value as any).contents || []) as any[];
          for (const item of kwItems) {
            const parsed = parseMusicItemToTrack(item, seenIds);
            if (parsed) tracks.push(parsed);
          }
        }
      }
    }

    // Fallback if still low track count
    if (tracks.length < 10) {
      try {
        const vidRes: any = await yt.search(`${query} audio`, { type: 'video' });
        const videoList: any[] = (vidRes.videos ? vidRes.videos.slice(0, 15) : []) as any[];
        for (const v of videoList) {
          if (!v || !v.id || seenIds.has(v.id)) continue;
          const durationSec = parseDurationToSeconds(v.duration?.text || '3:30');
          if (durationSec > 900 || durationSec < 30) continue;
          seenIds.add(v.id);
          const thumb = v.thumbnails?.[v.thumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
          tracks.push({
            id: v.id,
              title: cleanYouTubeMusicTitle(v.title?.text || 'Unknown Title'),
              artists: [v.author?.name || 'Various Artists'],
              album: 'Single',
              artworkUrl: upgradeArtworkUrl(thumb),
              duration: durationSec,
              durationFormatted: v.duration?.text || formatSecondsToTime(durationSec),
              source: 'innertube',
              streamAvailability: true,
              explicit: false
            });
          }
      } catch (e) {}
    }

    return { tracks, relatedKeywords };
  } catch (err: any) {
    console.error('Deep search error:', err);
    return { tracks: [], relatedKeywords: [] };
  }
}

export async function searchAlbums(query: string): Promise<any[]> {
  try {
    const yt = await getInnertube();
    const res: any = await yt.music.search(query, { type: 'album' });
    const items: any[] = res.albums?.contents || res.contents || [];
    return items.map((a: any) => ({
      id: a.id || a.browse_id,
      title: a.title?.text || a.title || 'Album',
      artist: a.artists?.[0]?.name || a.author?.name || 'Artist',
      year: a.year || 'Album',
      artworkUrl: upgradeArtworkUrl(a.thumbnails?.[a.thumbnails.length - 1]?.url || a.thumbnails?.[0]?.url)
    })).filter(a => a.id && a.title);
  } catch (e) {
    return [];
  }
}

export async function searchPlaylists(query: string): Promise<any[]> {
  try {
    const yt = await getInnertube();
    const res: any = await yt.music.search(query, { type: 'playlist' });
    const items: any[] = res.playlists?.contents || res.contents || [];
    return items.map((p: any) => ({
      id: p.id || p.browse_id,
      title: p.title?.text || p.title || 'Playlist',
      curator: p.author?.name || p.curator || 'YouTube Music',
      itemCount: p.item_count || 'Playlist',
      artworkUrl: upgradeArtworkUrl(p.thumbnails?.[p.thumbnails.length - 1]?.url || p.thumbnails?.[0]?.url)
    })).filter(p => p.id && p.title);
  } catch (e) {
    return [];
  }
}

export async function searchArtists(query: string): Promise<any[]> {
  try {
    const yt = await getInnertube();
    const res: any = await yt.music.search(query, { type: 'artist' });
    const items: any[] = res.artists?.contents || res.contents || [];
    return items.map((ar: any) => ({
      id: ar.id || ar.browse_id,
      name: ar.name?.text || ar.name || 'Artist',
      subscribers: ar.subscribers || '',
      avatarUrl: upgradeArtworkUrl(ar.thumbnails?.[ar.thumbnails.length - 1]?.url || ar.thumbnails?.[0]?.url)
    })).filter(ar => ar.name);
  } catch (e) {
    return [];
  }
}

export async function searchCatalog(query: string, type: string = 'all', deep: boolean = false) {
  if (type === 'song' || deep) {
    const { tracks, relatedKeywords } = await searchTracksDeep(query);
    return { tracks, albums: [], playlists: [], artists: [], relatedKeywords };
  }
  if (type === 'album') {
    const albums = await searchAlbums(query);
    return { tracks: [], albums, playlists: [], artists: [], relatedKeywords: [] };
  }
  if (type === 'playlist') {
    const playlists = await searchPlaylists(query);
    return { tracks: [], albums: [], playlists, artists: [], relatedKeywords: [] };
  }
  if (type === 'artist') {
    const artists = await searchArtists(query);
    return { tracks: [], albums: [], playlists: [], artists, relatedKeywords: [] };
  }

  // Type === 'all': fetch standard catalog plus YouTube algorithm suggestions
  const [tracksRes, albums, playlists, artists, rawSuggestions] = await Promise.all([
    searchTracks(query).catch(() => []),
    searchAlbums(query).catch(() => []),
    searchPlaylists(query).catch(() => []),
    searchArtists(query).catch(() => []),
    (async () => {
      try {
        const yt = await getInnertube();
        return await yt.getSearchSuggestions(query);
      } catch {
        return [];
      }
    })()
  ]);

  const cleanQuery = query.trim().toLowerCase();
  const relatedKeywords = (rawSuggestions as string[])
    .filter(s => s && s.toLowerCase().trim() !== cleanQuery)
    .slice(0, 10);

  return { tracks: tracksRes, albums, playlists, artists, relatedKeywords };
}

// In-memory cache for resolved stream URLs
const streamUrlCache = new Map<string, { url: string; expiresAt: number }>();

export async function getStreamUrl(
  videoId: string,
  titleHint?: string,
  artistHint?: string,
  forceFresh: boolean = false
): Promise<string | null> {
  const cacheKey = videoId || `${titleHint}-${artistHint}`;
  if (!forceFresh) {
    const cached = streamUrlCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.url;
    }
  }

  const yt = await getInnertube();

  const resolveFromVideoId = async (id: string): Promise<string | null> => {
    try {
      // 1. Try VISIONOS client (Unthrottled, direct audio format URL, supports full continuous playback)
      let res = await yt.actions.execute('/player', {
        videoId: id,
        client: 'VISIONOS'
      });

      let audioFormats = res.data?.streamingData?.adaptiveFormats?.filter(
        (f: any) => f.mimeType?.startsWith('audio/') && f.url
      );

      // 2. Fallback to ANDROID_VR if needed
      if (!audioFormats || audioFormats.length === 0) {
        res = await yt.actions.execute('/player', {
          videoId: id,
          client: 'ANDROID_VR'
        });
        audioFormats = res.data?.streamingData?.adaptiveFormats?.filter(
          (f: any) => f.mimeType?.startsWith('audio/') && f.url
        );
      }

      // 3. Fallback to IOS if needed
      if (!audioFormats || audioFormats.length === 0) {
        res = await yt.actions.execute('/player', {
          videoId: id,
          client: 'IOS'
        });
        audioFormats = res.data?.streamingData?.adaptiveFormats?.filter(
          (f: any) => f.mimeType?.startsWith('audio/') && f.url
        );
      }

      if (audioFormats && audioFormats.length > 0) {
        audioFormats.sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0));
        return audioFormats[0].url;
      }
    } catch (e: any) {
      console.warn(`Direct player resolution failed for ${id}:`, e.message);
    }
    return null;
  };

  // Step 1: If videoId looks like a valid 11-char YouTube ID, try direct
  const isLikelyYoutubeId = /^[a-zA-Z0-9_-]{11}$/.test(videoId);
  if (isLikelyYoutubeId) {
    const directUrl = await resolveFromVideoId(videoId);
    if (directUrl) {
      streamUrlCache.set(cacheKey, { url: directUrl, expiresAt: Date.now() + 3 * 3600 * 1000 });
      return directUrl;
    }
  }

  // Step 2: Search fallback using title and artist
  let searchQuery = '';
  if (titleHint && artistHint) {
    searchQuery = `${titleHint} ${artistHint}`;
  } else if (titleHint) {
    searchQuery = titleHint;
  } else if (artistHint) {
    searchQuery = artistHint;
  } else if (!isLikelyYoutubeId && videoId) {
    searchQuery = videoId.replace(/[-_]/g, ' ');
  }

  if (searchQuery) {
    try {
      console.log(`Searching YouTube fallback for stream: "${searchQuery}"`);
      const searchRes = await yt.search(`${searchQuery} audio`, { type: 'video' });
      const foundVideo: any = searchRes.videos?.[0];

      if (foundVideo && foundVideo.id) {
        const searchStreamUrl = await resolveFromVideoId(foundVideo.id);
        if (searchStreamUrl) {
          const entry = {
            url: searchStreamUrl,
            expiresAt: Date.now() + 4 * 3600 * 1000
          };
          streamUrlCache.set(cacheKey, entry);
          if (videoId) streamUrlCache.set(videoId, entry);
          if (foundVideo.id) streamUrlCache.set(foundVideo.id, entry);
          return searchStreamUrl;
        }
      }
    } catch (searchErr: any) {
      console.error('Search fallback error:', searchErr);
    }
  }

  return null;
}

export async function fetchLyrics(track: string, artist: string, duration?: number) {
  try {
    // Strip parentheticals and featured artists for cleaner search
    const cleanTrack = track.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim();
    const cleanArtist = artist.split(/,|&|feat|ft\./i)[0].trim();

    let url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTrack)}&artist_name=${encodeURIComponent(cleanArtist)}`;
    if (duration) {
      url += `&duration=${Math.round(duration)}`;
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'AppleMusicWebPlayer/1.0 (https://music.apple.com)'
      }
    });

    if (res.ok) {
      const data: any = await res.json();
      return {
        found: true,
        syncedLyrics: data.syncedLyrics || null,
        plainLyrics: data.plainLyrics || null,
        trackName: data.trackName,
        artistName: data.artistName,
      };
    }

    // Try fallback search on lrclib
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${cleanTrack} ${cleanArtist}`)}`;
    const searchRes = await fetch(searchUrl);
    if (searchRes.ok) {
      const results: any = await searchRes.json();
      if (Array.isArray(results) && results.length > 0) {
        const best = results[0];
        return {
          found: true,
          syncedLyrics: best.syncedLyrics || null,
          plainLyrics: best.plainLyrics || null,
          trackName: best.trackName,
          artistName: best.artistName,
        };
      }
    }

    return { found: false, syncedLyrics: null, plainLyrics: null };
  } catch (err) {
    console.error('Error fetching lyrics:', err);
    return { found: false, syncedLyrics: null, plainLyrics: null };
  }
}

export async function fetchPlaylistTracks(
  playlistIdOrQuery: string
): Promise<{ title: string; playlistId: string; tracks: NormalizedTrack[] }> {
  try {
    const yt = await getInnertube();
    let pid = playlistIdOrQuery;

    if (!playlistIdOrQuery.startsWith('PL') && !playlistIdOrQuery.startsWith('RD') && !playlistIdOrQuery.startsWith('OLAK')) {
      const searchRes: any = await yt.search(playlistIdOrQuery, { type: 'playlist' });
      const pl: any = searchRes.playlists?.[0];
      pid = pl?.content_id || pl?.id || pl?.endpoint?.payload?.playlistId || '';
    }

    if (!pid) return { title: playlistIdOrQuery, playlistId: '', tracks: [] };

    const full: any = await yt.getPlaylist(pid);
    const title = full.info?.title || full.header?.title?.text || playlistIdOrQuery;
    const tracks: NormalizedTrack[] = [];

    const videos: any[] = full.videos || [];
    for (const v of videos) {
      const vid = v.content_id || v.id;
      if (!vid) continue;
      const vTitle = v.metadata?.title?.text || v.title?.text || 'Unknown Title';
      const thumb = v.content_image?.image?.[0]?.url || `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;

      const cleanTitle = vTitle
        .replace(/\s*\(Official\s*(?:Music\s*)?(?:Video|Audio|Lyrical|Lyric\s*Video)?\)/gi, '')
        .replace(/\s*\[Official\s*(?:Music\s*)?(?:Video|Audio|Lyrical|Lyric\s*Video)?\]/gi, '')
        .replace(/\s*\|\s*.*$/gi, '')
        .replace(/\s*-\s*Official.*$/gi, '')
        .trim();

      tracks.push({
        id: vid,
        title: cleanTitle,
        artists: [v.metadata?.metadata?.metadata_rows?.[0]?.metadata_parts?.[0]?.text?.text || 'Various Artists'],
        album: title,
        artworkUrl: thumb,
        duration: 210,
        durationFormatted: '3:30',
        source: 'innertube',
        streamAvailability: true,
        explicit: false
      });
    }

    return { title, playlistId: pid, tracks };
  } catch (err) {
    console.error('Error fetching playlist tracks in Innertube:', err);
    return { title: playlistIdOrQuery, playlistId: '', tracks: [] };
  }
}

export interface ArtistDetails {
  name: string;
  avatarUrl: string;
  subscribers?: string;
  topSongs: NormalizedTrack[];
  albums: {
    id: string;
    title: string;
    artist: string;
    artworkUrl: string;
    year: string;
    type: string;
  }[];
  playlists: {
    id: string;
    title: string;
    artist: string;
    artworkUrl: string;
    year: string;
    type: string;
  }[];
  latestRelease: {
    id: string;
    title: string;
    artist: string;
    artworkUrl: string;
    year: string;
    trackCount?: number;
    type: string;
  } | null;
}

export async function fetchArtistDetails(artistName: string): Promise<ArtistDetails> {
  const yt = await getInnertube();

  // 1. Fetch official avatar from channel search
  let avatarUrl = '';
  let subscribers = '';
  try {
    const channelSearch = await yt.search(artistName, { type: 'channel' });
    const ch = channelSearch.channels?.[0];
    if (ch && (ch as any).author?.thumbnails?.[0]?.url) {
      avatarUrl = (ch as any).author.thumbnails[0].url.replace(/=s\d+-/, '=s800-');
      subscribers = (ch as any).subscriber_count?.text || '';
    }
  } catch (e: any) {
    console.warn('Channel search error for artist:', e.message);
  }

  // 2. Fetch Top Songs
  const songSearch = await yt.search(`${artistName} songs hits`, { type: 'video' });
  const topSongs: NormalizedTrack[] = [];
  if (songSearch.videos) {
    for (const v of songSearch.videos.slice(0, 20)) {
      const vid = (v as any).id;
      if (!vid) continue;
      const thumb = (v as any).thumbnails?.[(v as any).thumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
      const cleanTitle = ((v as any).title?.text || 'Unknown')
        .replace(/\s*\(Official\s*(?:Music\s*)?(?:Video|Audio|Lyrical|Lyric\s*Video)?\)/gi, '')
        .replace(/\s*\[Official\s*(?:Music\s*)?(?:Video|Audio|Lyrical|Lyric\s*Video)?\]/gi, '')
        .replace(/\s*\|\s*.*$/gi, '')
        .replace(/\s*-\s*Official.*$/gi, '')
        .trim();

      topSongs.push({
        id: vid,
        title: cleanTitle,
        artists: [(v as any).author?.name || artistName],
        album: 'Top Hit',
        artworkUrl: thumb,
        duration: 210,
        durationFormatted: (v as any).duration?.text || '3:30',
        source: 'innertube',
        streamAvailability: true,
        explicit: false
      });
    }
  }

  // Fallback avatar if channel didn't return one
  if (!avatarUrl && topSongs.length > 0) {
    avatarUrl = topSongs[0].artworkUrl;
  }

  // 3. Fetch Albums
  const albumSearch = await yt.search(`${artistName} album`, { type: 'playlist' });
  const albums: any[] = [];
  if (albumSearch.playlists) {
    for (const pl of albumSearch.playlists.slice(0, 10)) {
      const pid = (pl as any).content_id || (pl as any).id || (pl as any).endpoint?.payload?.playlistId;
      if (!pid) continue;
      const title = (pl as any).metadata?.title?.text || (pl as any).title?.text || 'Unknown Album';
      const thumb = (pl as any).content_image?.image?.[0]?.url || `https://i.ytimg.com/vi/${pid}/hqdefault.jpg`;

      albums.push({
        id: pid,
        title: title.replace(/full album/gi, '').replace(/[|(\[].*?[|)\]]/g, '').trim(),
        artist: artistName,
        artworkUrl: thumb,
        year: '2024',
        type: 'album'
      });
    }
  }

  // 4. Fetch Playlists (Best of, Essentials, Deep Cuts)
  const playlistSearch = await yt.search(`${artistName} playlist essentials best of`, { type: 'playlist' });
  const playlists: any[] = [];
  if (playlistSearch.playlists) {
    for (const pl of playlistSearch.playlists.slice(0, 10)) {
      const pid = (pl as any).content_id || (pl as any).id || (pl as any).endpoint?.payload?.playlistId;
      if (!pid || albums.some(a => a.id === pid)) continue;
      const title = (pl as any).metadata?.title?.text || (pl as any).title?.text || 'Featured Playlist';
      const thumb = (pl as any).content_image?.image?.[0]?.url || `https://i.ytimg.com/vi/${pid}/hqdefault.jpg`;

      playlists.push({
        id: pid,
        title: title.replace(/[|(\[].*?[|)\]]/g, '').trim(),
        artist: artistName,
        artworkUrl: thumb,
        year: 'Playlist',
        type: 'playlist'
      });
    }
  }

  // Latest Release determination
  const latestRelease = albums[0] || (topSongs[0] ? {
    id: `latest-${topSongs[0].id}`,
    title: topSongs[0].title,
    artist: artistName,
    artworkUrl: topSongs[0].artworkUrl,
    year: '2025',
    trackCount: 5,
    type: 'EP'
  } : null);

  return {
    name: artistName,
    avatarUrl,
    subscribers,
    topSongs,
    albums,
    playlists,
    latestRelease
  };
}


