export interface HomeAlbumItem {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  year?: string;
  genre?: string;
  searchQuery: string;
}

// 1. TRENDING ALBUMS
export const TRENDING_ALBUMS: HomeAlbumItem[] = [
  {
    id: 'alb-stree2',
    title: 'Stree 2 (Soundtrack)',
    artist: 'Sachin-Jigar',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4e/d8/d5/4ed8d575-b384-884d-cb7f-0bc51a0b5df6/8902894363990.jpg/600x600bb.jpg',
    year: '2024',
    genre: 'Bollywood',
    searchQuery: 'Stree 2 full album songs Sachin Jigar'
  },
  {
    id: 'alb-animal',
    title: 'ANIMAL',
    artist: 'Pritam & Vishal Mishra',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/db/ad/5e/dbad5e8b-0bee-d962-92d4-021c90e375ac/8902894362092_cover.jpg/600x600bb.jpg',
    year: '2023',
    genre: 'Bollywood Rock',
    searchQuery: 'Animal full album Pritam'
  },
  {
    id: 'alb-aavesham',
    title: 'Aavesham (Original Soundtrack)',
    artist: 'Sushin Shyam',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ce/d3/f8/ced3f858-a53b-e9c5-23ba-cb9bb859a8c7/198500201010_cover.jpg/600x600bb.jpg',
    year: '2024',
    genre: 'Malayalam Electronic',
    searchQuery: 'Aavesham full album Sushin Shyam'
  },
  {
    id: 'alb-rockstar',
    title: 'Rockstar',
    artist: 'A.R. Rahman',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/f4/bf/b3/f4bfb332-6804-0cba-2ba1-7be1a8043644/886443216846.jpg/600x600bb.jpg',
    year: '2011',
    genre: 'Sufi Rock',
    searchQuery: 'Rockstar full album AR Rahman Mohit Chauhan'
  },
  {
    id: 'alb-glory-honey',
    title: 'GLORY',
    artist: 'Yo Yo Honey Singh',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/11/e3/9c/11e39c6d-0ac9-8728-cb9e-94197f645bfd/8903431012173_cover.jpg/600x600bb.jpg',
    year: '2024',
    genre: 'Hip-Hop/Desi',
    searchQuery: 'Yo Yo Honey Singh Glory full album'
  },
  {
    id: 'alb-short-sweet-sab',
    title: "Short n' Sweet",
    artist: 'Sabrina Carpenter',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f6/15/d0/f615d0ab-e0c4-575d-907e-1cc084642357/24UMGIM61704.rgb.jpg/600x600bb.jpg',
    year: '2024',
    genre: 'Pop',
    searchQuery: 'Sabrina Carpenter Short n Sweet full album'
  },
  {
    id: 'alb-hit-me-hard',
    title: 'HIT ME HARD AND SOFT',
    artist: 'Billie Eilish',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/600x600bb.jpg',
    year: '2024',
    genre: 'Alternative Pop',
    searchQuery: 'Billie Eilish HIT ME HARD AND SOFT full album'
  }
];

// 2. HINDI ALBUMS
export const HINDI_ALBUMS: HomeAlbumItem[] = [
  {
    id: 'alb-kabir-singh',
    title: 'Kabir Singh',
    artist: 'Sachet-Parampara & Vishal Mishra',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/cb/ad/7f/cbad7ff9-ff7e-b747-975d-e087198bb6bf/8902894356497_cover.jpg/600x600bb.jpg',
    year: '2019',
    genre: 'Romantic Bollywood',
    searchQuery: 'Kabir Singh full album songs'
  },
  {
    id: 'alb-yjhd',
    title: 'Yeh Jawaani Hai Deewani',
    artist: 'Pritam',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/d1/2f/cb/d12fcb81-a836-81c8-e395-fc71261a9bc2/886443963498.jpg/600x600bb.jpg',
    year: '2013',
    genre: 'Bollywood Pop',
    searchQuery: 'Yeh Jawaani Hai Deewani full album'
  },
  {
    id: 'alb-brahmastra',
    title: 'Brahmāstra (Part One: Shiva)',
    artist: 'Pritam',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/600x600bb.jpg',
    year: '2022',
    genre: 'Bollywood',
    searchQuery: 'Brahmastra full album songs Pritam'
  },
  {
    id: 'alb-jawan',
    title: 'Jawan (Original Soundtrack)',
    artist: 'Anirudh Ravichander',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/4a/71/8d/4a718d7b-9524-71bc-40d3-356f93798935/8903431958051_cover.jpg/600x600bb.jpg',
    year: '2023',
    genre: 'High-Energy Bollywood',
    searchQuery: 'Jawan Hindi full album Anirudh'
  },
  {
    id: 'alb-aashiqui2',
    title: 'Aashiqui 2',
    artist: 'Mithoon, Ankit Tiwari & Jeet Gannguli',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/55/e2/a6/55e2a6d7-ea76-3571-08ec-1d9046c8e317/886443919495.jpg/600x600bb.jpg',
    year: '2013',
    genre: 'Romantic',
    searchQuery: 'Aashiqui 2 full album songs Arijit Singh'
  },
  {
    id: 'alb-adhm',
    title: 'Ae Dil Hai Mushkil',
    artist: 'Pritam',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b9/7a/ff/b97afffb-2e5f-141a-a53b-f4e9185a539e/886446174822.jpg/600x600bb.jpg',
    year: '2016',
    genre: 'Bollywood Romantic',
    searchQuery: 'Ae Dil Hai Mushkil full album Pritam'
  }
];

// 3. ENGLISH ALBUMS
export const ENGLISH_ALBUMS: HomeAlbumItem[] = [
  {
    id: 'alb-after-hours',
    title: 'After Hours',
    artist: 'The Weeknd',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg',
    year: '2020',
    genre: 'Synth Pop / R&B',
    searchQuery: 'The Weeknd After Hours full album'
  },
  {
    id: 'alb-midnights',
    title: 'Midnights',
    artist: 'Taylor Swift',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/71/e6/29/71e62939-2a93-5d51-9efd-a99f36f32e29/22UMGIM98305.rgb.jpg/600x600bb.jpg',
    year: '2022',
    genre: 'Pop',
    searchQuery: 'Taylor Swift Midnights full album'
  },
  {
    id: 'alb-future-nostalgia',
    title: 'Future Nostalgia',
    artist: 'Dua Lipa',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a4/0a/85/a40a8559-9943-4b68-07aa-608b89e7e72b/190295286101.jpg/600x600bb.jpg',
    year: '2020',
    genre: 'Nu-Disco Pop',
    searchQuery: 'Dua Lipa Future Nostalgia full album'
  },
  {
    id: 'alb-starboy',
    title: 'Starboy',
    artist: 'The Weeknd',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/05/cf/12/05cf1251-2c67-6e9f-8618-ff3db696ff6f/16UMGIM53723.rgb.jpg/600x600bb.jpg',
    year: '2016',
    genre: 'Pop / R&B',
    searchQuery: 'The Weeknd Starboy full album'
  },
  {
    id: 'alb-divide',
    title: '÷ (Divide)',
    artist: 'Ed Sheeran',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/600x600bb.jpg',
    year: '2017',
    genre: 'Pop / Acoustic',
    searchQuery: 'Ed Sheeran Divide full album'
  },
  {
    id: 'alb-sos-sza',
    title: 'SOS',
    artist: 'SZA',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/d3/18/d5/d318d5b4-d757-0db7-6be0-0df17ebc5ec0/196587784348.jpg/600x600bb.jpg',
    year: '2022',
    genre: 'Contemporary R&B',
    searchQuery: 'SZA SOS full album'
  }
];

// 4. PUNJABI ALBUMS
export const PUNJABI_ALBUMS: HomeAlbumItem[] = [
  {
    id: 'alb-ghost-diljit',
    title: 'Ghost',
    artist: 'Diljit Dosanjh',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/01/f9/5d/01f95d10-863a-bbce-1da2-1df681e5b15b/5063413344609_cover.jpg/600x600bb.jpg',
    year: '2023',
    genre: 'Punjabi Pop',
    searchQuery: 'Diljit Dosanjh Ghost full album'
  },
  {
    id: 'alb-making-memories',
    title: 'Making Memories',
    artist: 'Karan Aujla & Ikky',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/08/bc/d308bc6a-20e1-6532-d933-35d1b429210e/5054197755538.jpg/600x600bb.jpg',
    year: '2023',
    genre: 'Punjabi Pop',
    searchQuery: 'Karan Aujla Making Memories full album'
  },
  {
    id: 'alb-moosetape',
    title: 'Moosetape',
    artist: 'Sidhu Moose Wala',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a8/5c/4b/a85c4b8b-e8bb-3a1b-4cf7-79758782a938/5059552174351_cover.jpg/600x600bb.jpg',
    year: '2021',
    genre: 'Punjabi Hip-Hop',
    searchQuery: 'Sidhu Moose Wala Moosetape full album'
  },
  {
    id: 'alb-four-you',
    title: 'Four You - EP',
    artist: 'Karan Aujla',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/58/01/c6/5801c607-4e78-e5a9-467f-4424784a0d8e/5054197548079.jpg/600x600bb.jpg',
    year: '2023',
    genre: 'Punjabi Pop',
    searchQuery: 'Karan Aujla Four You EP'
  },
  {
    id: 'alb-moonchild-era',
    title: 'MoonChild Era',
    artist: 'Diljit Dosanjh',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/5a/2a/85/5a2a859e-cb02-0e96-a9ea-030a08e646aa/196292723652.jpg/600x600bb.jpg',
    year: '2021',
    genre: 'Punjabi Pop',
    searchQuery: 'Diljit Dosanjh MoonChild Era full album'
  },
  {
    id: 'alb-way-ahead',
    title: 'Way Ahead',
    artist: 'Shubh',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/64/ce/22/64ce2289-53e3-a55e-fe04-0373aa496ce0/198000494483.png/600x600bb.jpg',
    year: '2022',
    genre: 'Punjabi Rap',
    searchQuery: 'Shubh Way Ahead EP full songs'
  }
];

// 5. TAMIL ALBUMS
export const TAMIL_ALBUMS: HomeAlbumItem[] = [
  {
    id: 'alb-leo-tamil',
    title: 'Leo',
    artist: 'Anirudh Ravichander',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ad/76/97/ad769747-1f90-1c31-15f2-2bf23d8c1c4f/8903431962157_cover.jpg/600x600bb.jpg',
    year: '2023',
    genre: 'Tamil Cinema',
    searchQuery: 'Leo Tamil full album Anirudh'
  },
  {
    id: 'alb-jailer-tamil',
    title: 'Jailer',
    artist: 'Anirudh Ravichander',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e5/22/35/e5223594-5ee7-160b-80a5-f62808c10fae/8903431952080_cover.jpg/600x600bb.jpg',
    year: '2023',
    genre: 'Tamil Cinema',
    searchQuery: 'Jailer Tamil full album Anirudh'
  },
  {
    id: 'alb-vikram-tamil',
    title: 'Vikram',
    artist: 'Anirudh Ravichander',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/f5/8a/bf/f58abf32-ef20-8041-e940-272e1c7c9ee7/8903431900135_cover.jpg/600x600bb.jpg',
    year: '2022',
    genre: 'Tamil Action',
    searchQuery: 'Vikram Tamil full album Anirudh'
  },
  {
    id: 'alb-master-tamil',
    title: 'Master',
    artist: 'Anirudh Ravichander',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ec/c0/8b/ecc08b7e-9ce8-3b36-7c09-08a8b29ff075/8903431804792_cover.jpg/600x600bb.jpg',
    year: '2020',
    genre: 'Tamil Cinema',
    searchQuery: 'Master Tamil full album Anirudh'
  },
  {
    id: 'alb-ps1-tamil',
    title: 'Ponniyin Selvan: Part 1',
    artist: 'A.R. Rahman',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/71/6a/57/716a575a-5ee7-6745-d225-b0b301764eb8/8903431919106_cover.jpg/600x600bb.jpg',
    year: '2022',
    genre: 'Historical / Classical',
    searchQuery: 'Ponniyin Selvan 1 full album AR Rahman'
  },
  {
    id: 'alb-kaithi-tamil',
    title: 'Kaithi (Original Soundtrack)',
    artist: 'Sam C.S.',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/13/6f/30/136f30f5-9382-7aa7-ee2c-29d911b32bb9/8903431782298_cover.jpg/600x600bb.jpg',
    year: '2019',
    genre: 'Tamil Thriller',
    searchQuery: 'Kaithi original soundtrack Sam CS'
  }
];

// 6. TELUGU ALBUMS
export const TELUGU_ALBUMS: HomeAlbumItem[] = [
  {
    id: 'alb-pushpa2',
    title: 'Pushpa 2: The Rule',
    artist: 'Devi Sri Prasad',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/5a/ec/4c/5aec4c11-0e7e-399c-3543-8f81745db720/8903431006509_cover.jpg/600x600bb.jpg',
    year: '2024',
    genre: 'Telugu Mass',
    searchQuery: 'Pushpa 2 Telugu songs Devi Sri Prasad'
  },
  {
    id: 'alb-rrr-telugu',
    title: 'RRR',
    artist: 'M.M. Keeravaani',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/05/29/31/05293153-6238-d621-081e-efd55734c382/190296384219.jpg/600x600bb.jpg',
    year: '2022',
    genre: 'Telugu Period Epic',
    searchQuery: 'RRR Telugu full album MM Keeravaani'
  },
  {
    id: 'alb-devara-telugu',
    title: 'Devara: Part 1',
    artist: 'Anirudh Ravichander',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/91/9f/fa/919ffa89-498c-ec87-4340-9a2cf14798e9/8903431018861_cover.jpg/600x600bb.jpg',
    year: '2024',
    genre: 'Telugu Action',
    searchQuery: 'Devara Telugu full album Anirudh'
  },
  {
    id: 'alb-ala-vaikuntha',
    title: 'Ala Vaikunthapurramuloo',
    artist: 'Thaman S',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/09/5f/86/095f86ae-7fc4-ad19-fead-e160533036e5/8903431787125_cover.jpg/600x600bb.jpg',
    year: '2020',
    genre: 'Telugu Pop',
    searchQuery: 'Ala Vaikunthapurramuloo full album Thaman S'
  },
  {
    id: 'alb-kalki-telugu',
    title: 'Kalki 2898 AD',
    artist: 'Santhosh Narayanan',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d5/d3/18/d5d3187b-402f-b4bc-ceb6-1db9e54d80d1/8903431008060_cover.jpg/600x600bb.jpg',
    year: '2024',
    genre: 'Sci-Fi Telugu',
    searchQuery: 'Kalki 2898 AD Telugu songs Santhosh Narayanan'
  },
  {
    id: 'alb-guntur-kaaram',
    title: 'Guntur Kaaram',
    artist: 'Thaman S',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c3/a0/0b/c3a00b68-e6b3-6ef3-547e-d306b99818cb/8903431985477_cover.jpg/600x600bb.jpg',
    year: '2024',
    genre: 'Telugu Mass',
    searchQuery: 'Guntur Kaaram Telugu full album Thaman S'
  }
];

// 7. MALAYALAM ALBUMS
export const MALAYALAM_ALBUMS: HomeAlbumItem[] = [
  {
    id: 'alb-aavesham-mal',
    title: 'Aavesham',
    artist: 'Sushin Shyam',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ce/d3/f8/ced3f858-a53b-e9c5-23ba-cb9bb859a8c7/198500201010_cover.jpg/600x600bb.jpg',
    year: '2024',
    genre: 'Malayalam Comedy/Action',
    searchQuery: 'Aavesham songs Sushin Shyam'
  },
  {
    id: 'alb-premalu',
    title: 'Premalu',
    artist: 'Vishnu Vijay',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b9/03/ad/b903ad0e-6f81-79b8-b472-a42e5b8e96bb/198026777621_cover.jpg/600x600bb.jpg',
    year: '2024',
    genre: 'Romantic Malayalam',
    searchQuery: 'Premalu full album Vishnu Vijay'
  },
  {
    id: 'alb-manjummel',
    title: 'Manjummel Boys',
    artist: 'Sushin Shyam',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/05/cf/8c/05cf8c39-8134-8c8d-ae5d-ad4a500e57df/198026857187_cover.jpg/600x600bb.jpg',
    year: '2024',
    genre: 'Survival Drama',
    searchQuery: 'Manjummel Boys full album Sushin Shyam'
  },
  {
    id: 'alb-hridayam',
    title: 'Hridayam',
    artist: 'Hesham Abdul Wahab',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b9/7a/ff/b97afffb-2e5f-141a-a53b-f4e9185a539e/886446174822.jpg/600x600bb.jpg',
    year: '2022',
    genre: 'Coming of Age',
    searchQuery: 'Hridayam full album Hesham Abdul Wahab'
  },
  {
    id: 'alb-minnal-murali',
    title: 'Minnal Murali',
    artist: 'Shaan Rahman & Sushin Shyam',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c2/f7/a2/c2f7a26f-47dc-9f06-49f2-ae9a04a37f59/8903431871053_cover.jpg/600x600bb.jpg',
    year: '2021',
    genre: 'Superhero Malayalam',
    searchQuery: 'Minnal Murali songs Sushin Shyam'
  },
  {
    id: 'alb-kumbalangi',
    title: 'Kumbalangi Nights',
    artist: 'Sushin Shyam',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/ca/b2/4b/cab24b5b-e15f-62ba-d4c7-ddc19ee17e7a/00602557961836.rgb.jpg/600x600bb.jpg',
    year: '2019',
    genre: 'Acoustic Malayalam',
    searchQuery: 'Kumbalangi Nights full album Sushin Shyam'
  }
];

// Unified list of all home album items for easy lookup
export const ALL_HOME_ALBUMS: HomeAlbumItem[] = [
  ...TRENDING_ALBUMS,
  ...HINDI_ALBUMS,
  ...ENGLISH_ALBUMS,
  ...PUNJABI_ALBUMS,
  ...TAMIL_ALBUMS,
  ...TELUGU_ALBUMS,
  ...MALAYALAM_ALBUMS
];

export function findHomeAlbumById(id: string): HomeAlbumItem | undefined {
  return ALL_HOME_ALBUMS.find((a) => a.id === id);
}

// 8. TRENDING PLAYLISTS (YouTube-backed playlists with 50-100 real songs)
export interface TrendingPlaylistItem {
  id: string;
  title: string;
  curator: string;
  artworkUrl: string;
  searchQuery: string;
}

export const TRENDING_PLAYLISTS: TrendingPlaylistItem[] = [
  {
    id: 'yt-pl-bollywood-trending',
    title: 'Trending Bollywood Hits',
    curator: 'Apple Music Hindi',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4e/d8/d5/4ed8d575-b384-884d-cb7f-0bc51a0b5df6/8902894363990.jpg/600x600bb.jpg',
    searchQuery: 'Latest Bollywood Songs 2026 Hindi Trending Playlist'
  },
  {
    id: 'yt-pl-punjabi-wave',
    title: 'A-List Punjabi Hits',
    curator: 'Apple Music Punjabi',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/b4/aa/06/b4aa061f-2b02-5353-8386-3532cf24c45a/197188730999.jpg/600x600bb.jpg',
    searchQuery: 'Trending Punjabi Songs 2025 Hits Playlist'
  },
  {
    id: 'yt-pl-todays-hits',
    title: "Today's Top Hits Worldwide",
    curator: 'Apple Music Pop',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f6/15/d0/f615d0ab-e0c4-575d-907e-1cc084642357/24UMGIM61704.rgb.jpg/600x600bb.jpg',
    searchQuery: "Today's Top Hits 2025 Global Playlist"
  },
  {
    id: 'yt-pl-desi-hiphop',
    title: 'Desi Hip-Hop Unleashed',
    curator: 'Apple Music Hip-Hop',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/11/e3/9c/11e39c6d-0ac9-8728-cb9e-94197f645bfd/8903431012173_cover.jpg/600x600bb.jpg',
    searchQuery: 'Desi Hip Hop Hits Rap Playlist'
  },
  {
    id: 'yt-pl-south-sensations',
    title: 'South Indian Blockbusters',
    curator: 'Apple Music South',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c3/8c/ec/c38cec53-f726-282c-4ae0-a29d5b0bfcf3/886444008779.jpg/600x600bb.jpg',
    searchQuery: 'Top South Indian Hits Tamil Telugu Playlist'
  },
  {
    id: 'yt-pl-chill-lofi',
    title: 'Late Night Hindi Lofi',
    curator: 'Apple Music Chill',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/f4/bf/b3/f4bfb332-6804-0cba-2ba1-7be1a8043644/886443216846.jpg/600x600bb.jpg',
    searchQuery: 'Bollywood Hindi Lofi Chill Songs Playlist'
  }
];

