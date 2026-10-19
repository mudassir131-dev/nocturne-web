import { searchTracks, searchTracksDeep, searchCatalog, getStreamUrl, fetchPlaylistTracks, fetchArtistDetails } from './innertube-service.js';
import { fetchMultiProviderLyrics } from './lyrics/index.js';
import url from 'url';
import fs from 'fs';
import path from 'path';

export async function handleMusicApiRequest(req: any, res: any): Promise<boolean> {
  const reqUrl = req.url || '';
  const parsedUrl = url.parse(reqUrl, true);
  const pathname = parsedUrl.pathname || '';

  // Only handle /api paths
  if (!pathname.startsWith('/api')) {
    return false;
  }

  // Common CORS and security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Location');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  // 0. Desktop Wallpaper endpoint: /api/system/wallpaper
  if (pathname === '/api/system/wallpaper') {
    try {
      const appData = process.env.APPDATA || '';
      const wallpaperPath = path.join(appData, 'Microsoft', 'Windows', 'Themes', 'TranscodedWallpaper');
      if (fs.existsSync(wallpaperPath)) {
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=120');
        const stream = fs.createReadStream(wallpaperPath);
        stream.pipe(res);
        return true;
      }
    } catch (e: any) {
      console.error('Failed to read desktop wallpaper:', e);
    }
    res.statusCode = 404;
    res.end('Wallpaper not found');
    return true;
  }

  // 1. Suggestions autocomplete endpoint: /api/music/suggestions?q=query
  if (pathname === '/api/music/suggestions') {
    const q = (parsedUrl.query.q as string) || '';
    if (!q.trim()) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ textSuggestions: [], tracks: [] }));
      return true;
    }
    try {
      const [suggestRes, tracks] = await Promise.all([
        fetch(`https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(q)}`)
          .then(r => r.json())
          .catch(() => [q, []]),
        searchTracks(q).catch(() => [])
      ]);

      const rawSuggestions: string[] = Array.isArray((suggestRes as any)?.[1]) ? (suggestRes as any)[1] : [];
      const textSuggestions = rawSuggestions
        .slice(0, 4)
        .map(s => String(s).toLowerCase());

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        textSuggestions,
        tracks: tracks.slice(0, 8)
      }));
    } catch (err: any) {
      console.error('API Suggestions Error:', err);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ textSuggestions: [], tracks: [] }));
    }
    return true;
  }

  // 1b. Real Artwork fetcher endpoint: /api/music/artwork?q=query
  if (pathname === '/api/music/artwork') {
    const q = (parsedUrl.query.q as string) || '';
    if (!q.trim()) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ artworkUrl: null }));
      return true;
    }

    try {
      // First try iTunes Search API for official 600x600 Apple Music artwork
      const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=1`);
      if (itunesRes.ok) {
        const data = (await itunesRes.json()) as any;
        if (data.results && data.results[0] && data.results[0].artworkUrl100) {
          const highRes = data.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.end(JSON.stringify({ artworkUrl: highRes }));
          return true;
        }
      }

      // Secondary fallback: search InnerTube
      const tracks = await searchTracks(q).catch(() => []);
      if (tracks.length > 0 && tracks[0].artworkUrl) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.end(JSON.stringify({ artworkUrl: tracks[0].artworkUrl }));
        return true;
      }
    } catch (err: any) {
      console.error('Artwork fetch error:', err);
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ artworkUrl: null }));
    return true;
  }

  // 2. Search endpoint: /api/music/search?q=query&type=all|song|album|playlist|artist&deep=true
  if (pathname === '/api/music/search') {
    const q = (parsedUrl.query.q as string) || '';
    const type = (parsedUrl.query.type as string) || 'all';
    const deep = parsedUrl.query.deep === 'true' || parsedUrl.query.deep === '1' || type === 'song';

    if (!q.trim()) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ tracks: [], albums: [], playlists: [], artists: [], relatedKeywords: [] }));
      return true;
    }
    try {
      const data = await searchCatalog(q, type, deep);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    } catch (err: any) {
      console.error('API Search Error:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message || 'Search failed', tracks: [], albums: [], playlists: [], artists: [], relatedKeywords: [] }));
    }
    return true;
  }

  // 2a. Similar Songs endpoint: /api/music/similar?q=query&keyword=kw
  if (pathname === '/api/music/similar') {
    const q = (parsedUrl.query.q as string) || '';
    const keyword = (parsedUrl.query.keyword as string) || '';
    const target = (keyword || q).trim();

    if (!target) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ tracks: [], relatedKeywords: [] }));
      return true;
    }
    try {
      const data = await searchTracksDeep(target);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    } catch (err: any) {
      console.error('API Similar Error:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message || 'Similar songs fetch failed', tracks: [], relatedKeywords: [] }));
    }
    return true;
  }

  // 2b. Playlist endpoint: /api/music/playlist?q=... or ?id=...
  if (pathname === '/api/music/playlist') {
    const q = (parsedUrl.query.q as string) || (parsedUrl.query.id as string) || '';
    if (!q.trim()) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ title: '', tracks: [] }));
      return true;
    }
    try {
      const playlistData = await fetchPlaylistTracks(q);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(playlistData));
    } catch (err: any) {
      console.error('API Playlist Error:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message || 'Playlist fetch failed', tracks: [] }));
    }
    return true;
  }

  // 2c. Artist details endpoint: /api/music/artist?name=...
  if (pathname === '/api/music/artist') {
    const name = (parsedUrl.query.name as string) || '';
    if (!name.trim()) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ name: '', topSongs: [], albums: [] }));
      return true;
    }
    try {
      const artistData = await fetchArtistDetails(name);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(artistData));
    } catch (err: any) {
      console.error('API Artist Error:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message || 'Artist fetch failed', topSongs: [], albums: [] }));
    }
    return true;
  }

  // 2d. Lyrics endpoint: /api/music/lyrics?track=...&artist=...&duration=...&videoId=...
  if (pathname === '/api/music/lyrics') {
    const track = (parsedUrl.query.track as string) || (parsedUrl.query.title as string) || '';
    const artist = (parsedUrl.query.artist as string) || '';
    const duration = parsedUrl.query.duration ? Number(parsedUrl.query.duration) : undefined;
    const videoId = (parsedUrl.query.videoId as string) || (parsedUrl.query.id as string) || '';
    const album = (parsedUrl.query.album as string) || undefined;
    
    try {
      const result = await fetchMultiProviderLyrics({
        title: track,
        artist,
        duration,
        album,
        videoId
      });
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    } catch (err: any) {
      console.error('API Lyrics Error:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ found: false, error: err.message }));
    }
    return true;
  }

  // 3. Audio stream endpoint: /api/music/stream/:id or /api/music/stream?id=...
  if (pathname.startsWith('/api/music/stream')) {
    let videoId = '';
    if (pathname.includes('/api/music/stream/')) {
      videoId = decodeURIComponent(pathname.replace('/api/music/stream/', '').split('?')[0]);
    } else {
      videoId = (parsedUrl.query.id as string) || '';
    }

    const titleHint = (parsedUrl.query.title as string) || '';
    const artistHint = (parsedUrl.query.artist as string) || '';

    if (!videoId && !titleHint) {
      res.statusCode = 400;
      res.end('Missing track identifier');
      return true;
    }

    try {
      const directUrl = await getStreamUrl(videoId, titleHint, artistHint);
      if (!directUrl) {
        res.statusCode = 404;
        res.end('No playable audio stream found');
        return true;
      }

      // If json response requested
      if (req.headers.accept?.includes('application/json') || parsedUrl.query.format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ streamUrl: directUrl }));
        return true;
      }

      // If client requests proxy explicitly
      if (parsedUrl.query.proxy === 'true') {
        const rangeHeader = req.headers.range || 'bytes=0-';
        const fetchHeaders: Record<string, string> = {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
          'Range': rangeHeader
        };

        let streamRes = await fetch(directUrl, { headers: fetchHeaders });
        if (streamRes.status >= 400) {
          const freshUrl = await getStreamUrl(videoId, titleHint, artistHint, true);
          if (freshUrl && freshUrl !== directUrl) {
            streamRes = await fetch(freshUrl, { headers: fetchHeaders });
          }
        }
        res.statusCode = streamRes.status;

        const contentType = streamRes.headers.get('content-type') || 'audio/mp4';
        const contentRange = streamRes.headers.get('content-range');
        const contentLength = streamRes.headers.get('content-length');
        const acceptRanges = streamRes.headers.get('accept-ranges') || 'bytes';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Accept-Ranges', acceptRanges);
        if (contentRange) res.setHeader('Content-Range', contentRange);
        if (contentLength) res.setHeader('Content-Length', contentLength);

        if (req.method === 'HEAD' || !streamRes.body) {
          res.end();
          return true;
        }

        const reader = streamRes.body.getReader();
        const pump = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (res.writableEnded || req.destroyed) break;
              res.write(value);
            }
            if (!res.writableEnded) res.end();
          } catch {
            if (!res.writableEnded) res.end();
          }
        };
        pump();
        return true;
      }

      // Default: Clean 302 Redirect directly to Google CDN!
      // This enables instantaneous playback, hardware scrubbing, and zero Vercel timeout!
      res.writeHead(302, {
        'Location': directUrl,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Location',
        'Cache-Control': 'public, max-age=7200'
      });
      res.end();
      return true;
    } catch (err: any) {
      console.error('Streaming error:', err);
      res.statusCode = 502;
      res.end('Streaming proxy failed: ' + err.message);
      return true;
    }
  }

  // Not handled
  return false;
}
