import { Innertube } from 'youtubei.js';

async function test() {
  const yt = await Innertube.create({ retrieve_player: true });
  const full = await yt.getPlaylist('PLOcASI4VrVsYQ2JCESwzAjJbjtNZSSrkk');
  const v = full.videos[0];
  console.log('v.content_id:', v.content_id);
  console.log('title text:', v.metadata?.title?.text);
  console.log('image:', JSON.stringify(v.content_image));
  console.log('duration:', v.metadata?.metadata?.metadata_rows?.[0]);
}

test().catch(console.error);
