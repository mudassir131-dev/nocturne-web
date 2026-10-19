import fs from 'fs';

const items = [
  // 1. New this week
  { id: 'alb-udta-teer', term: 'Udta Teer Sachin Jigar' },
  { id: 'alb-dopamine-chamber', term: 'Fontaines DC Romance Dopamine' },
  { id: 'alb-known-unknowns', term: 'Gur Sidhu Known Unknowns' },
  { id: 'alb-short-n-sweet', term: 'Sabrina Carpenter Short n Sweet' },
  { id: 'alb-aura', term: 'Guru Randhawa Aura' },
  { id: 'alb-glory', term: 'Yo Yo Honey Singh Glory' },

  // 2. Updated playlist
  { id: 'pl-todays-hits', term: "Today's Hits Apple Music Pop" },
  { id: 'pl-a-list-pop', term: 'Dua Lipa Houdini' },
  { id: 'pl-nmd-india', term: 'Arijit Singh O Maahi' },
  { id: 'pl-bollywood-replay', term: 'Animal Ranbeer Kapoor Pritam' },
  { id: 'pl-punjabi-wave', term: 'Diljit Dosanjh Born to Shine' },
  { id: 'pl-friday-feeling', term: 'Taylor Swift Cruel Summer' },

  // 3. Recent release
  { id: 'rec-aaj-ki-raat', term: 'Aaj Ki Raat Stree 2' },
  { id: 'rec-tauba-tauba', term: 'Tauba Tauba Karan Aujla' },
  { id: 'rec-big-dawgs', term: 'Hanumankind Big Dawgs' },
  { id: 'rec-nazar', term: 'Nazar dox' },
  { id: 'rec-doori', term: 'Doori WISH Sanjoy' },
  { id: 'rec-tum-se', term: 'Tum Se AUR' },

  // 5. Everyone's listening to
  { id: 'ev-espresso', term: 'Sabrina Carpenter Espresso' },
  { id: 'ev-die-with-smile', term: 'Lady Gaga Bruno Mars Die With A Smile' },
  { id: 'ev-birds-feather', term: 'Billie Eilish Birds of a Feather' },
  { id: 'ev-not-like-us', term: 'Kendrick Lamar Not Like Us' },
  { id: 'ev-million-dollar', term: 'Tommy Richman Million Dollar Baby' },
  { id: 'ev-tipsy', term: 'Shaboozey A Bar Song Tipsy' },

  // 6. Spatial audio
  { id: 'spat-bollywood', term: 'Brahmastra Kesariya' },
  { id: 'spat-pop', term: 'The Weeknd Blinding Lights' },
  { id: 'spat-punjabi', term: 'Karan Aujla Softly' },
  { id: 'spat-hiphop', term: 'Travis Scott FE!N' },
  { id: 'spat-acoustic', term: 'Ed Sheeran Perfect' },
  { id: 'spat-rock', term: 'Queen Bohemian Rhapsody' },

  // 7. Daily top 100
  { id: 'top100-global', term: 'Top 100 Global' },
  { id: 'top100-india', term: 'Arijit Singh Chaleya' },
  { id: 'top100-usa', term: 'Post Malone I Had Some Help' },
  { id: 'top100-uk', term: 'Coldplay feelslikeimfallinginlove' },
  { id: 'top100-canada', term: 'Drake First Person Shooter' },
  { id: 'top100-australia', term: 'Troye Sivan Rush' },

  // 8. City charts
  { id: 'city-delhi', term: 'Honey Singh Desi Kalakaar' },
  { id: 'city-mumbai', term: 'Amitabh Bhattacharya Bombay' },
  { id: 'city-bengaluru', term: 'Raghu Dixit' },
  { id: 'city-london', term: 'Central Cee Doja' },
  { id: 'city-newyork', term: 'Alicia Keys Empire State of Mind' },
  { id: 'city-tokyo', term: 'Yoasobi Idol' },

  // 9. Only on youtube music
  { id: 'yt-coke-studio', term: 'Coke Studio Pasoori' },
  { id: 'yt-colors-show', term: 'A Colors Show' },
  { id: 'yt-tiny-desk', term: 'Dua Lipa Tiny Desk' },
  { id: 'yt-mtv-unplugged', term: 'Pritam MTV Unplugged' },
  { id: 'yt-coachella-live', term: 'Diljit Dosanjh Coachella' },
  { id: 'yt-lollapalooza', term: 'Imagine Dragons Bones' },

  // 10. Latest DJ Remixes
  { id: 'dj-bollywood-club', term: 'DJ Chetas Bollywood Mashup' },
  { id: 'dj-punjabi-bass', term: 'Karan Aujla On Top Remix' },
  { id: 'dj-edm-mainstage', term: 'Martin Garrix Animals' },
  { id: 'dj-afro-desi', term: 'Rema Calm Down' },
  { id: 'dj-deep-sunset', term: 'Lost Frequencies Where Are You Now' },
  { id: 'dj-slap-house', term: 'Imanbek Roses Remix' },

  // 11. Now on tour
  { id: 'tour-dil-luminati', term: 'Diljit Dosanjh Hass Hass' },
  { id: 'tour-coldplay', term: 'Coldplay Yellow' },
  { id: 'tour-eras', term: 'Taylor Swift Anti Hero' },
  { id: 'tour-karan-aujla', term: 'Karan Aujla Winning Speech' },
  { id: 'tour-dua-lipa', term: 'Dua Lipa Training Season' },
  { id: 'tour-oasis', term: 'Oasis Wonderwall' },

  // 12. Radio episodes
  { id: 'rad-zane-billie', term: 'Billie Eilish Lunch' },
  { id: 'rad-rap-life', term: 'Drake God Plan' },
  { id: 'rad-dotty', term: 'Burna Boy City Boys' },
  { id: 'rad-vince-staples', term: 'Vince Staples Norf Norf' },
  { id: 'rad-superbloom', term: 'Hozier Too Sweet' },
  { id: 'rad-travis-scott', term: 'Travis Scott Sicko Mode' },

  // 13. Coming soon
  { id: 'cs-coldplay-moon', term: 'Coldplay We Pray' },
  { id: 'cs-shawn-mendes', term: 'Shawn Mendes Why Why Why' },
  { id: 'cs-weeknd-hurry', term: 'The Weeknd Dancing In The Flames' },
  { id: 'cs-diljit-next', term: 'Diljit Dosanjh Lover' },
  { id: 'cs-ar-rahman', term: 'AR Rahman Jai Ho' },
  { id: 'cs-lady-gaga-lg7', term: 'Lady Gaga Disease' }
];

async function run() {
  const mapping = {};
  for (const item of items) {
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(item.term)}&media=music&limit=1`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results[0] && data.results[0].artworkUrl100) {
          const highRes = data.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
          mapping[item.id] = highRes;
          console.log(`[OK] ${item.id} -> ${highRes}`);
        } else {
          console.log(`[NO_RESULT] ${item.id}`);
        }
      }
    } catch (e) {
      console.log(`[ERR] ${item.id}:`, e.message);
    }
  }

  fs.writeFileSync('scratch/real-art-map.json', JSON.stringify(mapping, null, 2));
  console.log('Saved to scratch/real-art-map.json with count:', Object.keys(mapping).length);
}

run();
