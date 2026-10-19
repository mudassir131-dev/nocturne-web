import { Innertube } from 'youtubei.js';

async function test() {
  const yt = await Innertube.create({ retrieve_player: true });
  const channelSearch = await yt.search('Amitabh Bhattacharya', { type: 'channel' });
  const ch = channelSearch.channels?.[0];
  console.log('ch.author:', ch?.author);
}

test().catch(console.error);
