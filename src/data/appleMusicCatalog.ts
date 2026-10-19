export interface Track {
  id: string;
  title: string;
  artists: string[];
  album: string;
  artworkUrl: string;
  duration: number; // in seconds
  durationFormatted: string;
  source: 'innertube';
  streamAvailability: boolean;
  explicit?: boolean;
  releaseDate?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  artworkUrl: string;
  year: string;
  genre: string;
  editorialNotes?: string;
  explicit?: boolean;
  tracks: Track[];
}

export interface Playlist {
  id: string;
  title: string;
  curator: string;
  description: string;
  artworkUrl: string;
  bannerColor?: string;
  trackCount: number;
  tracks: Track[];
}

export interface EditorialHero {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  artworkUrl: string;
  coverArtworkUrl?: string;
  type: 'playlist' | 'album' | 'station';
  targetId: string;
  accentColor: string;
}

// 1. EXACT EDITORIAL HERO CAROUSEL FROM APPLE MUSIC INDIA
export const EDITORIAL_HEROES: EditorialHero[] = [
  {
    id: 'hero-friday-feeling',
    eyebrow: 'HOT PLAYLIST',
    title: 'Friday Feeling',
    subtitle: 'Apple Music Pop',
    description: 'Songs for that upbeat weekend vibe—no matter what day it is.',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Features113/v4/5b/2e/1f/5b2e1fc7-4d05-3bfe-0379-a08ff73d4391/pr_source.png/1060x608sr.webp',
    coverArtworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Features113/v4/5b/2e/1f/5b2e1fc7-4d05-3bfe-0379-a08ff73d4391/pr_source.png/120x120cc.webp',
    type: 'playlist',
    targetId: 'pl-friday-feeling',
    accentColor: '#ff4ad9'
  },
  {
    id: 'hero-dopamine-chamber',
    eyebrow: 'NEW ALBUM',
    title: 'Dopamine Chamber',
    subtitle: 'Fontaines D.C.',
    description: 'Fontaines examine our imperilled world—and reveal there’s beauty in it.',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Features/v4/54/de/79/54de7970-6ccc-4707-cfd9-622f2ff11a4f/9346a485-7ff1-448c-8c5f-d6df5ce7b8cf.png/1060x608sr.webp',
    coverArtworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/24/10/8c/24108c9c-845b-40f3-6175-9effb95e1d5c/191404167373.png/120x120cc.webp',
    type: 'album',
    targetId: 'alb-dopamine-chamber',
    accentColor: '#943959'
  },
  {
    id: 'hero-known-unknowns',
    eyebrow: 'NEW ALBUM',
    title: 'Known Unknowns',
    subtitle: 'Gur Sidhu & Kaptaan',
    description: 'The chart-topping Punjabi pop-rap star is confidence personified.',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Features/v4/f0/6a/1f/f06a1f63-74af-0c12-8141-b7a70f021ac6/3b87bd6e-7e0c-407e-99a6-a5939028828b.png/1060x608sr.webp',
    coverArtworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/56/ab/3b/56ab3b25-37c6-3da4-6547-4dd19b71657c/885288654424.jpg/120x120cc.webp',
    type: 'album',
    targetId: 'alb-known-unknowns',
    accentColor: '#315161'
  },
  {
    id: 'hero-shreya-ghoshal',
    eyebrow: 'NEW RADIO EPISODE',
    title: 'Shreya Ghoshal',
    subtitle: 'Radio Takeover',
    description: 'The singer plays songs that make her feel “unstoppable”.',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Features211/v4/58/5a/8c/585a8c48-b60f-ffac-55aa-d15f35aa235b/fb6e5290-4635-47e1-a1ed-a17385c4e052.png/1060x608sr.webp',
    type: 'station',
    targetId: 'apple-music-1',
    accentColor: 'var(--accent-red)'
  }
];

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'BddP6PYo2gs',
    title: 'Chann (From "Udta Teer")',
    artists: ['Sachin-Jigar', 'Arijit Singh', 'Amitabh Bhattacharya'],
    album: 'Udta Teer - EP',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/83/58/9b/83589b60-dad7-a545-592a-2c2f9f8ccebf/196874851845.jpg/300x300bb.webp',
    duration: 194,
    durationFormatted: '3:14',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'pwyS_QYxK8A',
    title: 'Bhootni Ka (From "Udta Teer")',
    artists: ['Sachin-Jigar', 'Kaka', 'Twinkle Aggrwal', 'Amitabh Bhattacharya'],
    album: 'Udta Teer - EP',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/83/58/9b/83589b60-dad7-a545-592a-2c2f9f8ccebf/196874851845.jpg/300x300bb.webp',
    duration: 202,
    durationFormatted: '3:22',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'VUjhT0G6x0A',
    title: 'Mumbai Sapno Ka Samandar (From "Prahaar: The Untold Story Of Ujjwal Nikam")',
    artists: ['Emiway Bantai', 'Sunidhi Chauhan', 'Swaalina'],
    album: 'Prahaar: The Untold Story Of Ujjwal Nikam',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/01/c4/6f/01c46f7b-f8bc-d51f-9be3-5b241683b9c1/8903431220424_cover.jpg/300x300bb.webp',
    duration: 218,
    durationFormatted: '3:38',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'mCdA4bJOXGM',
    title: 'Zukhaam',
    artists: ['Dorwin John'],
    album: 'Zukhaam - Single',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a3/f9/18/a3f91891-3e71-1e9d-d2ea-06c056c06ac0/859747047058_cover.jpg/300x300bb.webp',
    duration: 185,
    durationFormatted: '3:05',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'Kup_U85_oY8',
    title: 'Nazar',
    artists: ['dox', 'Niyam'],
    album: 'Nazar - Single',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2c/56/aa/2c56aa03-2222-dddd-bfaa-c3b34d6ed1ec/885288666717.jpg/300x300bb.webp',
    duration: 167,
    durationFormatted: '2:47',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'CLn_uY_Zz60',
    title: 'Faith',
    artists: ['dox', 'Viepsa Arora', 'Sahej'],
    album: 'Faith - Single',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2c/56/aa/2c56aa03-2222-dddd-bfaa-c3b34d6ed1ec/885288666717.jpg/300x300bb.webp',
    duration: 172,
    durationFormatted: '2:52',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: '1F3hm6MfR1k',
    title: 'Anjaana',
    artists: ['dox', 'Jaskaran'],
    album: 'Anjaana - Single',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2c/56/aa/2c56aa03-2222-dddd-bfaa-c3b34d6ed1ec/885288666717.jpg/300x300bb.webp',
    duration: 191,
    durationFormatted: '3:11',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'RLzC55ai0eo',
    title: 'Kasoor',
    artists: ['W.i.S.H.'],
    album: 'Kasoor - Single',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b8/ec/18/b8ec18bb-bf14-65a4-b624-91e7d721df4f/196874837542.jpg/300x300bb.webp',
    duration: 184,
    durationFormatted: '3:04',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'gVYrP8wVn8o',
    title: 'Doori',
    artists: ['W.i.S.H.', 'Sanjoy'],
    album: 'Doori - Single',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b8/ec/18/b8ec18bb-bf14-65a4-b624-91e7d721df4f/196874837542.jpg/300x300bb.webp',
    duration: 178,
    durationFormatted: '2:58',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'K4DyBUG242c',
    title: 'Tum Se',
    artists: ['AUR'],
    album: 'Tum Se - Single',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8b/69/d8/8b69d8d4-a512-9460-3b21-d76941fdd2b6/196874853788.jpg/300x300bb.webp',
    duration: 215,
    durationFormatted: '3:35',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'Hq0t_n8X-n0',
    title: 'Suni Suni',
    artists: ['Shubham Roy'],
    album: 'Suni Suni - Single',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e5/12/5c/e5125c35-fdd8-bfa4-c209-876125efee70/859743955975_cover.jpg/300x300bb.webp',
    duration: 201,
    durationFormatted: '3:21',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'aaj-ki-raat-stree2',
    title: 'Aaj Ki Raat (From "Stree 2")',
    artists: ['Madhubanti Bagchi', 'Divya Kumar', 'Sachin-Jigar', 'Amitabh Bhattacharya'],
    album: 'Aaj Ki Raat (From "Stree 2") - Single',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4e/d8/d5/4ed8d575-b384-884d-cb7f-0bc51a0b5df6/8902894363990.jpg/300x300bb.webp',
    duration: 228,
    durationFormatted: '3:48',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'Ax0G_P2dSBw',
    title: 'Ishaare',
    artists: ['Anubha Bajaj'],
    album: 'Ishaare - Single',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/71/e1/ca/71e1ca5c-61f4-5a60-5628-c4e6eb9c1196/8902358521539_cover.jpg/300x300bb.webp',
    duration: 177,
    durationFormatted: '2:57',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'RLzC55ai0ey',
    title: 'Tauba Tauba',
    artists: ['Karan Aujla'],
    album: 'Bad Newz (Soundtrack)',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f4/0c/36/f40c36b8-c30c-ea17-5e8d-862d665f8c2e/8902894364027.jpg/300x300bb.webp',
    duration: 206,
    durationFormatted: '3:26',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'Ax0G_P2dSBz',
    title: 'Ishq',
    artists: ['Faheem Abdullah', 'Rauhan Malik'],
    album: 'Ishq - Single',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7c/49/a7/7c49a712-4cf3-7221-5a5d-4f0147ae5bdf/8905753018260.jpg/300x300bb.webp',
    duration: 182,
    durationFormatted: '3:02',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'BddP6PYo2gt',
    title: 'Akhiyaan Gulaab',
    artists: ['Mitraz'],
    album: 'Teri Baaton Mein Aisa Uljha Jiya',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/4a/c3/8b/4ac38b55-d14f-8367-15ae-2c5e53e449a0/8902894361088.jpg/300x300bb.webp',
    duration: 171,
    durationFormatted: '2:51',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  },
  {
    id: 'pwyS_QYxK8B',
    title: 'O Sajna',
    artists: ['Badshah', 'DIVINE'],
    album: 'Ek Tha Raja',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/64/07/28/640728c0-bc61-8aa2-0e3f-676b15e45a27/8902894362146.jpg/300x300bb.webp',
    duration: 198,
    durationFormatted: '3:18',
    source: 'innertube',
    streamAvailability: true,
    explicit: false,
    releaseDate: '2024'
  }
];

// 3. EXACT "NEW THIS WEEK" ALBUMS FROM APPLE MUSIC INDIA
export const CURATED_ALBUMS: Album[] = [
  {
    id: 'alb-dilfek',
    title: 'Dilfek - EP',
    artist: 'Rito Riba',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a5/61/9c/a5619ce1-804e-f099-26d0-43df477ff378/823375513346_Cover.jpg/600x600bf.webp',
    year: '2024',
    genre: 'Pop in Hindi',
    editorialNotes: 'Arunachal Pradesh star Rito Riba delivers heartfelt folk-pop melodies and acoustic confessions across this signature EP.',
    tracks: [
      INITIAL_TRACKS[3], // Zukhaam
      INITIAL_TRACKS[0], // Chann
      INITIAL_TRACKS[4]  // Nazar
    ]
  },
  {
    id: 'alb-udta-teer',
    title: 'Udta Teer (Original Motion Picture Soundtrack) - EP',
    artist: 'Sachin-Jigar, Emiway Bantai, Amitabh Bhattacharya',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/83/58/9b/83589b60-dad7-a545-592a-2c2f9f8ccebf/196874851845.jpg/600x600bf.webp',
    year: '2026',
    genre: 'Bollywood',
    editorialNotes: 'High voltage grooves and romantic melodies scored by hitmakers Sachin-Jigar with lyricist Amitabh Bhattacharya.',
    tracks: [
      {
        id: 'choozay-udta-teer',
        title: 'Choozay (From "Udta Teer")',
        artists: ['Sachin-Jigar', 'Emiway Bantai', 'Jigar Saraiya', 'Amitabh Bhattacharya'],
        album: 'Udta Teer (Original Motion Picture Soundtrack) - EP',
        artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/83/58/9b/83589b60-dad7-a545-592a-2c2f9f8ccebf/196874851845.jpg/300x300bb.webp',
        duration: 205,
        durationFormatted: '3:25',
        source: 'innertube',
        streamAvailability: true,
        explicit: false,
        releaseDate: '2026'
      },
      {
        id: 'BddP6PYo2gs',
        title: 'Chann (From "Udta Teer")',
        artists: ['Sachin-Jigar', 'Arijit Singh', 'Amitabh Bhattacharya'],
        album: 'Udta Teer (Original Motion Picture Soundtrack) - EP',
        artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/83/58/9b/83589b60-dad7-a545-592a-2c2f9f8ccebf/196874851845.jpg/300x300bb.webp',
        duration: 194,
        durationFormatted: '3:14',
        source: 'innertube',
        streamAvailability: true,
        explicit: false,
        releaseDate: '2026'
      },
      {
        id: 'udta-teer-title',
        title: 'Udta Teer - Title Track (From "Udta Teer")',
        artists: ['Sachin-Jigar', 'Raghav Chaitanya', 'Simran Choudhary', 'Amitabh Bhattacharya'],
        album: 'Udta Teer (Original Motion Picture Soundtrack) - EP',
        artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/83/58/9b/83589b60-dad7-a545-592a-2c2f9f8ccebf/196874851845.jpg/300x300bb.webp',
        duration: 156,
        durationFormatted: '2:36',
        source: 'innertube',
        streamAvailability: true,
        explicit: false,
        releaseDate: '2026'
      },
      {
        id: 'pwyS_QYxK8A',
        title: 'Bhootni Ka (From "Udta Teer")',
        artists: ['Sachin-Jigar', 'Kaka', 'Twinkle Aggrwal', 'Amitabh Bhattacharya'],
        album: 'Udta Teer (Original Motion Picture Soundtrack) - EP',
        artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/83/58/9b/83589b60-dad7-a545-592a-2c2f9f8ccebf/196874851845.jpg/300x300bb.webp',
        duration: 213,
        durationFormatted: '3:33',
        source: 'innertube',
        streamAvailability: true,
        explicit: false,
        releaseDate: '2026'
      },
      {
        id: 'jai-hind-udta-teer',
        title: 'Jai Hind (From "Udta Teer")',
        artists: ['Sachin-Jigar', 'Siddharth Mahadevan', 'Shivam Mahadevan', 'Sumonto Mukherjee', 'Amitabh Bhattacharya'],
        album: 'Udta Teer (Original Motion Picture Soundtrack) - EP',
        artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/83/58/9b/83589b60-dad7-a545-592a-2c2f9f8ccebf/196874851845.jpg/300x300bb.webp',
        duration: 192,
        durationFormatted: '3:12',
        source: 'innertube',
        streamAvailability: true,
        explicit: false,
        releaseDate: '2026'
      }
    ]
  },
  {
    id: 'alb-blue-hour',
    title: 'Blue Hour',
    artist: 'JAI DHIR & Yoki',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e0/82/3a/e0823a42-ac6c-9e84-18e3-73b8dcca3031/26UM1IM31807.rgb.jpg/600x600bf.webp',
    year: '2024',
    genre: 'Punjabi Pop',
    editorialNotes: 'Soulful synthwave and nocturnal R&B infused with Punjabi vocals by breakout star Jai Dhir.',
    tracks: [
      INITIAL_TRACKS[4], // Nazar
      INITIAL_TRACKS[5], // Faith
      INITIAL_TRACKS[6]  // Anjaana
    ]
  },
  {
    id: 'alb-homecoming',
    title: 'THE HOMECOMING - EP',
    artist: 'SAHIL CHEEMA',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/5c/3d/db/5c3ddb5c-3803-a3e6-bbae-1fa9d4e747df/885288750003.jpg/600x600bf.webp',
    year: '2024',
    genre: 'Punjabi Hip-Hop',
    editorialNotes: 'Raw desi rap storytelling and hard-hitting 808s straight out of Punjab.',
    explicit: true,
    tracks: [
      INITIAL_TRACKS[7], // Kasoor
      INITIAL_TRACKS[8], // Doori
      INITIAL_TRACKS[9]  // Tum Se
    ]
  },
  {
    id: 'alb-zach-bryan',
    title: 'Young Manhood and Other Donatable Organs',
    artist: 'Zach Bryan',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bf/a4/0c/bfa40ce2-3bdf-e9bf-b40b-741be20aaec2/093624838630.jpg/600x600bf.webp',
    year: '2024',
    genre: 'Country',
    editorialNotes: 'Evocative storytelling, rustic strings and intimate acoustic folk from Zach Bryan.',
    explicit: true,
    tracks: [
      INITIAL_TRACKS[10], // Suni Suni
      INITIAL_TRACKS[11]  // Ishaare
    ]
  },
  {
    id: 'alb-aura',
    title: 'Aura',
    artist: 'Guru Randhawa',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/be/89/3b/be893b86-7788-b220-410a-8bf8c919a797/196874844359.jpg/600x600bf.webp',
    year: '2024',
    genre: 'Punjabi Pop',
    editorialNotes: 'Global beats and contagious pop anthems by Guru Randhawa.',
    explicit: false,
    tracks: [
      INITIAL_TRACKS[12] || INITIAL_TRACKS[0]
    ]
  }
];

// 4. CURATED APPLE MUSIC INDIA PLAYLISTS
export const CURATED_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-friday-feeling',
    title: 'Friday Feeling',
    curator: 'Apple Music Pop',
    description: 'Songs for that upbeat weekend vibe—no matter what day it is. Updated weekly by Apple Music editors.',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Features113/v4/5b/2e/1f/5b2e1fc7-4d05-3bfe-0379-a08ff73d4391/pr_source.png/600x344sr.webp',
    trackCount: INITIAL_TRACKS.length,
    tracks: INITIAL_TRACKS
  },
  {
    id: 'pl-nmd-india',
    title: 'New Music Daily India',
    curator: 'Apple Music India',
    description: 'The defining new songs of the week across Hindi, Punjabi, Tamil, Telugu, and international charts.',
    artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    trackCount: INITIAL_TRACKS.length,
    tracks: INITIAL_TRACKS
  },
  {
    id: 'pl-top-100-india',
    title: 'Top 100: India',
    curator: 'Apple Music',
    description: 'The most popular songs across India today. Updated every morning with official streaming counts.',
    artworkUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=80',
    trackCount: INITIAL_TRACKS.length,
    tracks: [...INITIAL_TRACKS].reverse()
  },
  {
    id: 'pl-punjabi-wave',
    title: 'A-List: Punjabi',
    curator: 'Apple Music Punjabi',
    description: 'The biggest anthems from Chandigarh to Toronto and London.',
    artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    trackCount: 4,
    tracks: [INITIAL_TRACKS[0], INITIAL_TRACKS[1], INITIAL_TRACKS[4], INITIAL_TRACKS[5]]
  },
  {
    id: 'pl-south-sensations',
    title: 'South Indian Sensations',
    curator: 'Apple Music South',
    description: 'Electrifying beats and viral melodies taking over Tamil, Malayalam, Telugu, and Kannada music scenes.',
    artworkUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
    trackCount: 4,
    tracks: [INITIAL_TRACKS[2], INITIAL_TRACKS[6], INITIAL_TRACKS[10], INITIAL_TRACKS[11]]
  }
];

export const MOODS_CATEGORIES = [
  { id: 'cat-bollywood', name: 'Bollywood', color: 'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)' },
  { id: 'cat-punjabi', name: 'Punjabi', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  { id: 'cat-south', name: 'South Indian', color: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' },
  { id: 'cat-romance', name: 'Romance', color: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' },
  { id: 'cat-dance', name: 'Party & Dance', color: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
  { id: 'cat-chill', name: 'Chill & Acoustic', color: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)' },
  { id: 'cat-devotional', name: 'Devotional', color: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)' },
  { id: 'cat-indie', name: 'Indie India', color: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' }
];
