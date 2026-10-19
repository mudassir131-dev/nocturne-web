import { Innertube } from 'youtubei.js';

export async function fetchArtistDetails(artistName) {
  const yt = await Innertube.create({ retrieve_player: true });

  // 1. Fetch official avatar
  let avatarUrl = '';
  let subscribers = '';
  try {
    const channelSearch = await yt.search(artistName, { type: 'channel' });
    const ch = channelSearch.channels?.[0];
    if (ch && ch.author?.thumbnails?.[0]?.url) {
      avatarUrl = ch.author.thumbnails[0].url.replace(/=s\d+-/, '=s600-');
      subscribers = ch.subscriber_count?.text || '';
    }
  } catch (e) {
    console.error('Channel search error:', e);
  }

  // 2. Fetch Top Songs
  const songSearch = await yt.search(`${artistName} top songs`, { type: 'video' });
  const topSongs = [];
  if (songSearch.videos) {
    for (const v of songSearch.videos.slice(0, 10)) {
      if (!v || !v.id) continue;
      const thumb = v.thumbnails?.[v.thumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
      const cleanTitle = (v.title?.text || 'Unknown')
        .replace(/\s*\(Official\s*(?:Music\s*)?(?:Video|Audio|Lyrical|Lyric\s*Video)?\)/gi, '')
        .replace(/\s*\[Official\s*(?:Music\s*)?(?:Video|Audio|Lyrical|Lyric\s*Video)?\]/gi, '')
        .replace(/\s*\|\s*.*$/gi, '')
        .replace(/\s*-\s*Official.*$/gi, '')
        .trim();

      topSongs.push({
        id: v.id,
        title: cleanTitle,
        artists: [v.author?.name || artistName],
        album: 'Single / Soundtrack',
        artworkUrl: thumb,
        duration: 210,
        durationFormatted: v.duration?.text || '3:30',
        source: 'innertube',
        streamAvailability: true,
        explicit: false
      });
    }
  }

  // 3. Fetch Albums / Playlists
  const albumSearch = await yt.search(`${artistName} album`, { type: 'playlist' });
  const albums = [];
  if (albumSearch.playlists) {
    for (const pl of albumSearch.playlists.slice(0, 8)) {
      const pid = pl.content_id || pl.id || pl.endpoint?.payload?.playlistId;
      if (!pid) continue;
      const title = pl.metadata?.title?.text || pl.title?.text || 'Unknown Album';
      const thumb = pl.content_image?.image?.[0]?.url || `https://i.ytimg.com/vi/${pid}/hqdefault.jpg`;

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

  // Latest Release
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
    avatarUrl: avatarUrl || topSongs[0]?.artworkUrl || '',
    subscribers,
    topSongs,
    albums,
    latestRelease
  };
}

fetchArtistDetails('Amitabh Bhattacharya')
  .then(res => {
    console.log('Artist Name:', res.name);
    console.log('Avatar URL:', res.avatarUrl);
    console.log('Top songs count:', res.topSongs.length);
    console.log('Albums count:', res.albums.length);
    console.log('Latest Release:', res.latestRelease?.title);
  })
  .catch(console.error);
