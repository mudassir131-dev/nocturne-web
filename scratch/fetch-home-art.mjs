import fs from 'fs';

const albums = [
  // Trending Albums
  { id: 'alb-stree2', term: 'Stree 2 Sachin Jigar' },
  { id: 'alb-animal', term: 'Animal Pritam' },
  { id: 'alb-aavesham', term: 'Aavesham Sushin Shyam' },
  { id: 'alb-rockstar', term: 'Rockstar AR Rahman' },
  { id: 'alb-glory-honey', term: 'Yo Yo Honey Singh Glory' },
  { id: 'alb-short-sweet-sab', term: 'Sabrina Carpenter Short n Sweet' },
  { id: 'alb-hit-me-hard', term: 'Billie Eilish Hit Me Hard and Soft' },

  // Hindi Albums
  { id: 'alb-kabir-singh', term: 'Kabir Singh Mithoon' },
  { id: 'alb-yjhd', term: 'Yeh Jawaani Hai Deewani Pritam' },
  { id: 'alb-brahmastra', term: 'Brahmastra Pritam' },
  { id: 'alb-jawan', term: 'Jawan Anirudh' },
  { id: 'alb-aashiqui2', term: 'Aashiqui 2 Mithoon' },
  { id: 'alb-adhm', term: 'Ae Dil Hai Mushkil Pritam' },

  // English Albums
  { id: 'alb-after-hours', term: 'The Weeknd After Hours' },
  { id: 'alb-midnights', term: 'Taylor Swift Midnights' },
  { id: 'alb-future-nostalgia', term: 'Dua Lipa Future Nostalgia' },
  { id: 'alb-starboy', term: 'The Weeknd Starboy' },
  { id: 'alb-divide', term: 'Ed Sheeran Divide' },
  { id: 'alb-sos-sza', term: 'SZA SOS' },

  // Punjabi Albums
  { id: 'alb-ghost-diljit', term: 'Diljit Dosanjh Ghost' },
  { id: 'alb-making-memories', term: 'Karan Aujla Making Memories' },
  { id: 'alb-moosetape', term: 'Sidhu Moose Wala Moosetape' },
  { id: 'alb-four-you', term: 'Karan Aujla Four You' },
  { id: 'alb-moonchild-era', term: 'Diljit Dosanjh MoonChild Era' },
  { id: 'alb-way-ahead', term: 'Shubh Way Ahead' },

  // Tamil Albums
  { id: 'alb-leo-tamil', term: 'Leo Anirudh Ravichander' },
  { id: 'alb-jailer-tamil', term: 'Jailer Anirudh Ravichander' },
  { id: 'alb-vikram-tamil', term: 'Vikram Anirudh Ravichander' },
  { id: 'alb-master-tamil', term: 'Master Anirudh Ravichander' },
  { id: 'alb-ps1-tamil', term: 'Ponniyin Selvan AR Rahman' },
  { id: 'alb-kaithi-tamil', term: 'Kaithi Sam CS' },

  // Telugu Albums
  { id: 'alb-pushpa2', term: 'Pushpa 2 Devi Sri Prasad' },
  { id: 'alb-rrr-telugu', term: 'RRR MM Keeravaani' },
  { id: 'alb-devara-telugu', term: 'Devara Anirudh' },
  { id: 'alb-kalki-telugu', term: 'Kalki 2898 AD Santhosh Narayanan' },
  { id: 'alb-ala-vaikuntha', term: 'Ala Vaikunthapurramuloo Thaman S' },
  { id: 'alb-guntur-kaaram', term: 'Guntur Kaaram Thaman S' },

  // Malayalam Albums
  { id: 'alb-premalu', term: 'Premalu Vishnu Vijay' },
  { id: 'alb-manjummel', term: 'Manjummel Boys Sushin Shyam' },
  { id: 'alb-hridayam', term: 'Hridayam Hesham Abdul Wahab' },
  { id: 'alb-minnal-murali', term: 'Minnal Murali Shaan Rahman' },
  { id: 'alb-kumbalangi', term: 'Kumbalangi Nights Sushin Shyam' }
];

async function run() {
  const map = {};
  for (const a of albums) {
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(a.term)}&media=music&entity=album&limit=1`);
      const data = await res.json();
      if (data.results && data.results[0] && data.results[0].artworkUrl100) {
        map[a.id] = data.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
        console.log(`[ALBUM OK] ${a.id}`);
      } else {
        // Fallback to song search
        const sRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(a.term)}&media=music&limit=1`);
        const sData = await sRes.json();
        if (sData.results && sData.results[0] && sData.results[0].artworkUrl100) {
          map[a.id] = sData.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
          console.log(`[SONG OK] ${a.id}`);
        } else {
          console.log(`[MISSING] ${a.id}`);
        }
      }
    } catch (e) {
      console.log(`[ERR] ${a.id}:`, e.message);
    }
  }

  fs.writeFileSync('scratch/home-art-map.json', JSON.stringify(map, null, 2));
  console.log('Saved to scratch/home-art-map.json with count:', Object.keys(map).length);
}

run();
