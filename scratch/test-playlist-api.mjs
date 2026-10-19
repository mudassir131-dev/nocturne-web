import { Innertube } from 'youtubei.js';

export async function fetchPlaylistTracks(playlistIdOrQuery) {
  const yt = await Innertube.create({ retrieve_player: true });
  let pid = playlistIdOrQuery;
  
  if (!playlistIdOrQuery.startsWith('PL') && !playlistIdOrQuery.startsWith('RD') && !playlistIdOrQuery.startsWith('OLAK')) {
    const searchRes = await yt.search(playlistIdOrQuery, { type: 'playlist' });
    const pl = searchRes.playlists?.[0];
    pid = pl?.content_id || pl?.id || pl?.endpoint?.payload?.playlistId;
  }
  
  if (!pid) return { title: playlistIdOrQuery, tracks: [] };
  
  const full = await yt.getPlaylist(pid);
  const title = full.info?.title || full.header?.title?.text || playlistIdOrQuery;
  const tracks = [];
  
  const videos = full.videos || [];
  for (const v of videos) {
    const vid = v.content_id || v.id;
    if (!vid) continue;
    const vTitle = v.metadata?.title?.text || v.title?.text || 'Unknown Title';
    const thumb = v.content_image?.image?.[0]?.url || `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
    
    // clean title
    const cleanTitle = vTitle
      .replace(/\s*\(Official\s*(?:Music\s*)?(?:Video|Audio|Lyrical|Lyric\s*Video)?\)/gi, '')
      .replace(/\s*\[Official\s*(?:Music\s*)?(?:Video|Audio|Lyrical|Lyric\s*Video)?\]/gi, '')
      .replace(/\s*\|\s*.*$/gi, '')
      .replace(/\s*-\s*Official.*$/gi, '')
      .trim();
      
    tracks.push({
      id: vid,
      title: cleanTitle,
      artists: ['Various Artists'],
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
}

fetchPlaylistTracks('Bollywood Top 50 Trending Songs')
  .then(res => {
    console.log('Result title:', res.title);
    console.log('Found tracks count:', res.tracks.length);
    if (res.tracks[0]) console.log('Sample track 1:', res.tracks[0]);
  })
  .catch(console.error);
