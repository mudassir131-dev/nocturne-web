import { Innertube } from 'youtubei.js';

async function test() {
  const yt = await Innertube.create({ retrieve_player: true });
  console.log('Innertube ready');

  const artistName = 'Amitabh Bhattacharya';

  // 1. Test iTunes search API for artist artwork & high-res profile photo
  const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=musicArtist&limit=1`);
  const itunesData = await itunesRes.json();
  console.log('iTunes Artist data:', itunesData.results?.[0]);

  // 2. Search songs for this artist on YouTube
  const songSearch = await yt.search(`${artistName} songs hits`, { type: 'video' });
  console.log('Songs found:', songSearch.videos?.length);
  if (songSearch.videos?.[0]) {
    console.log('Sample song:', songSearch.videos[0].title?.text, songSearch.videos[0].id);
  }

  // 3. Search albums for this artist
  const albumSearch = await yt.search(`${artistName} album`, { type: 'playlist' });
  console.log('Albums/Playlists found:', albumSearch.playlists?.length);
  if (albumSearch.playlists?.[0]) {
    console.log('Sample album/playlist:', albumSearch.playlists[0].title?.text || albumSearch.playlists[0].metadata?.title?.text);
  }
}

test().catch(console.error);
