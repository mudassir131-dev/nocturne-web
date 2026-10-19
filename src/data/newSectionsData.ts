export interface SectionItem {
  id: string;
  title: string;
  subtitle: string;
  artworkUrl: string;
  explicit?: boolean;
  badge?: string;
  tag?: string;
  type?: 'album' | 'playlist' | 'track';
  searchQuery: string;
}

// 1. NEW THIS WEEK
export const NEW_THIS_WEEK_ITEMS: SectionItem[] = [
  {
    id: 'alb-udta-teer',
    title: 'Udta Teer - EP',
    subtitle: 'Sachin-Jigar',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/28/55/59/285559d4-2dfb-7655-000c-c571e9a8c251/196874850442.jpg/600x600bb.jpg',
    type: 'album',
    searchQuery: 'Udta Teer Sachin Jigar EP'
  },
  {
    id: 'alb-dopamine-chamber',
    title: 'Dopamine Chamber',
    subtitle: 'Fontaines D.C.',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/24/10/8c/24108c9c-845b-40f3-6175-9effb95e1d5c/191404167373.png/600x600bb.jpg',
    type: 'album',
    explicit: true,
    searchQuery: 'Fontaines DC Dopamine Chamber'
  },
  {
    id: 'alb-known-unknowns',
    title: 'Known Unknowns',
    subtitle: 'Gur Sidhu & Kaptaan',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/56/ab/3b/56ab3b25-37c6-3da4-6547-4dd19b71657c/885288654424.jpg/600x600bb.jpg',
    type: 'album',
    searchQuery: 'Gur Sidhu Kaptaan Known Unknowns'
  },
  {
    id: 'alb-short-n-sweet',
    title: "Short n' Sweet",
    subtitle: 'Sabrina Carpenter',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f6/15/d0/f615d0ab-e0c4-575d-907e-1cc084642357/24UMGIM61704.rgb.jpg/600x600bb.jpg',
    type: 'album',
    explicit: true,
    searchQuery: 'Sabrina Carpenter Short n Sweet'
  },
  {
    id: 'alb-aura',
    title: 'Aura',
    subtitle: 'Guru Randhawa',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/ac/3b/26ac3b10-0237-e46c-14af-b28abf60f0e1/5021732749444.jpg/600x600bb.jpg',
    type: 'album',
    searchQuery: 'Guru Randhawa Aura Album'
  },
  {
    id: 'alb-glory',
    title: 'GLORY',
    subtitle: 'Yo Yo Honey Singh',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/11/e3/9c/11e39c6d-0ac9-8728-cb9e-94197f645bfd/8903431012173_cover.jpg/600x600bb.jpg',
    type: 'album',
    searchQuery: 'Yo Yo Honey Singh GLORY full album'
  }
];

// 2. UPDATED PLAYLIST
export const UPDATED_PLAYLIST_ITEMS: SectionItem[] = [
  {
    id: 'pl-todays-hits',
    title: "Today's Hits",
    subtitle: 'Apple Music Pop',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/88/4e/63/884e6321-ad41-aab1-f6f0-20efcafcfd55/075679666130.jpg/600x600bb.jpg',
    badge: 'UPDATED',
    type: 'playlist',
    searchQuery: 'Top Global Pop Hits 2024'
  },
  {
    id: 'pl-a-list-pop',
    title: 'A-List Pop',
    subtitle: 'Apple Music Pop',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/dd/af/ea/ddafeab5-797a-5b6f-7735-f96c537b45e0/5054197894091.jpg/600x600bb.jpg',
    badge: 'UPDATED',
    type: 'playlist',
    searchQuery: 'A List Pop Playlist'
  },
  {
    id: 'pl-nmd-india',
    title: 'New Music Daily India',
    subtitle: 'Apple Music India',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9e/fb/28/9efb2892-c3b1-0c1c-f7a3-3bcccce6346e/8903431975058_cover.jpg/600x600bb.jpg',
    badge: 'UPDATED TODAY',
    type: 'playlist',
    searchQuery: 'New Music Daily India'
  },
  {
    id: 'pl-bollywood-replay',
    title: 'Bollywood Replay',
    subtitle: 'Apple Music Bollywood',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/db/ad/5e/dbad5e8b-0bee-d962-92d4-021c90e375ac/8902894362092_cover.jpg/600x600bb.jpg',
    badge: 'UPDATED',
    type: 'playlist',
    searchQuery: 'Bollywood Replay Hits'
  },
  {
    id: 'pl-punjabi-wave',
    title: 'A-List: Punjabi',
    subtitle: 'Apple Music Punjabi',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d2/89/ac/d289ac98-749e-3822-6b6e-b06aa4815715/859740651597_cover.jpg/600x600bb.jpg',
    badge: 'UPDATED',
    type: 'playlist',
    searchQuery: 'A List Punjabi Wave'
  },
  {
    id: 'pl-friday-feeling',
    title: 'Friday Feeling',
    subtitle: 'Apple Music Pop',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3d/ab/493dab54-f920-9043-6181-80993b8116c9/19UMGIM53909.rgb.jpg/600x600bb.jpg',
    badge: 'WEEKLY',
    type: 'playlist',
    searchQuery: 'Friday Feeling Upbeat'
  }
];

// 3. RECENT RELEASE
export const RECENT_RELEASE_ITEMS: SectionItem[] = [
  {
    id: 'rec-aaj-ki-raat',
    title: 'Aaj Ki Raat (From "Stree 2")',
    subtitle: 'Madhubanti Bagchi & Divya Kumar',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3a/7f/47/3a7f47da-2330-c758-4460-ce12f9385a82/198588793954.jpg/600x600bb.jpg',
    type: 'track',
    searchQuery: 'Aaj Ki Raat Stree 2 Madhubanti Bagchi'
  },
  {
    id: 'rec-tauba-tauba',
    title: 'Tauba Tauba (From "Bad Newz")',
    subtitle: 'Karan Aujla',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/d2/01/79d201d2-e54d-5604-81fb-313f30db7219/198588533581.jpg/600x600bb.jpg',
    type: 'track',
    searchQuery: 'Tauba Tauba Karan Aujla Bad Newz'
  },
  {
    id: 'rec-big-dawgs',
    title: 'Big Dawgs',
    subtitle: 'Hanumankind & Kalmi',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/42/d2/6c/42d26c01-619f-fa0a-2e83-7f4a28b5d3b2/24UMGIM70977.rgb.jpg/600x600bb.jpg',
    type: 'track',
    explicit: true,
    searchQuery: 'Hanumankind Big Dawgs Kalmi'
  },
  {
    id: 'rec-nazar',
    title: 'Nazar - Single',
    subtitle: 'dox & Niyam',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2c/56/aa/2c56aa03-2222-dddd-bfaa-c3b34d6ed1ec/885288666717.jpg/600x600bb.jpg',
    type: 'track',
    searchQuery: 'Nazar dox Niyam'
  },
  {
    id: 'rec-doori',
    title: 'Doori - Single',
    subtitle: 'W.i.S.H. & Sanjoy',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b8/ec/18/b8ec18bb-bf14-65a4-b624-91e7d721df4f/196874837542.jpg/600x600bb.jpg',
    type: 'track',
    searchQuery: 'Doori WISH Sanjoy'
  },
  {
    id: 'rec-tum-se',
    title: 'Tum Se - Single',
    subtitle: 'AUR',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/eb/25/68/eb256897-d444-504e-b64f-977206d3bf40/8903431982186_cover.jpg/600x600bb.jpg',
    type: 'track',
    searchQuery: 'Tum Se AUR song'
  }
];

// 5. EVERYONE'S LISTENING TO
export const EVERYONES_LISTENING_ITEMS: SectionItem[] = [
  {
    id: 'ev-espresso',
    title: 'Espresso',
    subtitle: 'Sabrina Carpenter',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a1/1c/ca/a11ccab6-7d4c-e041-d028-998bcebeb709/24UMGIM61704.rgb.jpg/600x600bb.jpg',
    type: 'track',
    searchQuery: 'Sabrina Carpenter Espresso'
  },
  {
    id: 'ev-die-with-smile',
    title: 'Die With A Smile',
    subtitle: 'Lady Gaga & Bruno Mars',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/11/ae/f2/11aef294-f57c-bab9-c9fc-529162984e62/24UMGIM85348.rgb.jpg/600x600bb.jpg',
    type: 'track',
    searchQuery: 'Lady Gaga Bruno Mars Die With A Smile'
  },
  {
    id: 'ev-birds-feather',
    title: 'BIRDS OF A FEATHER',
    subtitle: 'Billie Eilish',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/600x600bb.jpg',
    type: 'track',
    searchQuery: 'Billie Eilish BIRDS OF A FEATHER'
  },
  {
    id: 'ev-not-like-us',
    title: 'Not Like Us',
    subtitle: 'Kendrick Lamar',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/31/3a/3f/313a3fbc-bb8f-80c7-b5a2-e226869a38cd/24UMGIM51924.rgb.jpg/600x600bb.jpg',
    type: 'track',
    explicit: true,
    searchQuery: 'Kendrick Lamar Not Like Us'
  },
  {
    id: 'ev-million-dollar',
    title: 'MILLION DOLLAR BABY',
    subtitle: 'Tommy Richman',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/5c/e7/39/5ce73933-8f42-1095-e84b-0caec311f54b/24CRGIM43010.rgb.jpg/600x600bb.jpg',
    type: 'track',
    searchQuery: 'Tommy Richman MILLION DOLLAR BABY'
  },
  {
    id: 'ev-tipsy',
    title: 'A Bar Song (Tipsy)',
    subtitle: 'Shaboozey',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/be/db/81/bedb81c3-ca23-a1b9-f275-59e46ae4fdb1/197342625517_cover.jpg/600x600bb.jpg',
    type: 'track',
    searchQuery: 'Shaboozey A Bar Song Tipsy'
  }
];

// 6. BEST OF SPATIAL AUDIO
export const SPATIAL_AUDIO_ITEMS: SectionItem[] = [
  {
    id: 'spat-bollywood',
    title: 'Spatial Audio: Bollywood',
    subtitle: 'Mastered in Dolby Atmos',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/600x600bb.jpg',
    badge: 'DOLBY ATMOS',
    type: 'playlist',
    searchQuery: 'Bollywood Dolby Atmos Hits'
  },
  {
    id: 'spat-pop',
    title: 'Spatial Audio: Pop',
    subtitle: 'Surround Soundstage Experience',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg',
    badge: 'DOLBY ATMOS',
    type: 'playlist',
    searchQuery: 'Spatial Audio Pop Anthems'
  },
  {
    id: 'spat-punjabi',
    title: 'Spatial Audio: Punjabi',
    subtitle: 'Deep Bass & Spatial Clarity',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/08/bc/d308bc6a-20e1-6532-d933-35d1b429210e/5054197755538.jpg/600x600bb.jpg',
    badge: 'DOLBY ATMOS',
    type: 'playlist',
    searchQuery: 'Punjabi Spatial Audio'
  },
  {
    id: 'spat-hiphop',
    title: 'Spatial Audio: Hip-Hop',
    subtitle: 'Immersive Beats & Vocal Separation',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7d/4f/94/7d4f9468-56e1-3a2d-7186-c8088170ef58/196871341899.jpg/600x600bb.jpg',
    badge: 'DOLBY ATMOS',
    type: 'playlist',
    searchQuery: 'Hip Hop Dolby Atmos'
  },
  {
    id: 'spat-acoustic',
    title: 'Spatial Audio: Acoustic',
    subtitle: 'Intimate Strings & Vocals',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/600x600bb.jpg',
    badge: 'DOLBY ATMOS',
    type: 'playlist',
    searchQuery: 'Acoustic Spatial Audio'
  },
  {
    id: 'spat-rock',
    title: 'Spatial Audio: Rock',
    subtitle: 'Legendary Remasters',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8b/0a/ea/8b0aea60-6f4a-195b-5958-cdf459c2333b/602527644271.jpg/600x600bb.jpg',
    badge: 'DOLBY ATMOS',
    type: 'playlist',
    searchQuery: 'Rock Legends Dolby Atmos'
  }
];

// 7. DAILY TOP 100
export const DAILY_TOP_100_ITEMS: SectionItem[] = [
  {
    id: 'top100-global',
    title: 'Top 100: Global',
    subtitle: 'Daily Streaming Chart',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/cd/d0/44/cdd04422-75ca-414c-01d3-29609d22feb5/00738597214059.rgb.jpg/600x600bb.jpg',
    badge: 'TOP 100',
    type: 'playlist',
    searchQuery: 'Top 100 Global Songs'
  },
  {
    id: 'top100-india',
    title: 'Top 100: India',
    subtitle: 'Official Daily Chart',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1e/ff/32/1eff3216-190d-6fd9-8f68-acbba846e6ee/8903431956026_cover.jpg/600x600bb.jpg',
    badge: 'TOP 100',
    type: 'playlist',
    searchQuery: 'Top 100 India Songs'
  },
  {
    id: 'top100-usa',
    title: 'Top 100: USA',
    subtitle: 'Billboard & Streaming Hits',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/84/df/b9/84dfb96b-27c8-4d40-4780-b65ff22790e4/24UMGIM50612.rgb.jpg/600x600bb.jpg',
    badge: 'TOP 100',
    type: 'playlist',
    searchQuery: 'Top 100 USA Songs'
  },
  {
    id: 'top100-uk',
    title: 'Top 100: UK',
    subtitle: 'Official UK Chart',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/af/3c/0f/af3c0fe2-1c4f-8499-67a8-14a8e41fdbf8/5021732410535.jpg/600x600bb.jpg',
    badge: 'TOP 100',
    type: 'playlist',
    searchQuery: 'Top 100 UK Songs'
  },
  {
    id: 'top100-canada',
    title: 'Top 100: Canada',
    subtitle: 'Daily Hot Tracks',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/fa/9e/e6/fa9ee672-0880-2b5b-a69d-981e8fcb807e/23UM1IM09863.rgb.jpg/600x600bb.jpg',
    badge: 'TOP 100',
    type: 'playlist',
    searchQuery: 'Top 100 Canada'
  },
  {
    id: 'top100-australia',
    title: 'Top 100: Australia',
    subtitle: 'ARIA & Streaming Hits',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/66/22/a5/6622a56c-2585-3118-6767-e7742f101185/23UMGIM98727.rgb.jpg/600x600bb.jpg',
    badge: 'TOP 100',
    type: 'playlist',
    searchQuery: 'Top 100 Australia'
  }
];

// 8. CITY CHARTS
export const CITY_CHARTS_ITEMS: SectionItem[] = [
  {
    id: 'city-delhi',
    title: 'Top 25: Delhi',
    subtitle: 'National Capital Territory',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b3/b5/d9/b3b5d986-7f6d-a860-b8aa-769e1eef1a92/8902894356299_cover.jpg/600x600bb.jpg',
    badge: 'CITY CHART',
    type: 'playlist',
    searchQuery: 'Top Songs Delhi India'
  },
  {
    id: 'city-mumbai',
    title: 'Top 25: Mumbai',
    subtitle: 'City of Dreams',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/f9/81/d9/f981d94a-6ddd-c80a-48a1-1e9f557d63a9/8903431925367_cover.jpg/600x600bb.jpg',
    badge: 'CITY CHART',
    type: 'playlist',
    searchQuery: 'Top Songs Mumbai India'
  },
  {
    id: 'city-bengaluru',
    title: 'Top 25: Bengaluru',
    subtitle: 'Silicon Plateau',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3a/3f/06/3a3f06a5-2feb-0a30-3165-7aaa08185cb4/1200214402976.jpg/600x600bb.jpg',
    badge: 'CITY CHART',
    type: 'playlist',
    searchQuery: 'Top Songs Bengaluru'
  },
  {
    id: 'city-london',
    title: 'Top 25: London',
    subtitle: 'United Kingdom',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/d7/a6/40/d7a64014-8712-7ede-12d4-6fa4d87e7ce9/198001869457.png/600x600bb.jpg',
    badge: 'CITY CHART',
    type: 'playlist',
    searchQuery: 'Top Songs London'
  },
  {
    id: 'city-newyork',
    title: 'Top 25: New York',
    subtitle: 'United States',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/b7/77/66/b77766d8-c73f-8a5d-376d-926db33475f7/884977002508.jpg/600x600bb.jpg',
    badge: 'CITY CHART',
    type: 'playlist',
    searchQuery: 'Top Songs New York'
  },
  {
    id: 'city-tokyo',
    title: 'Top 25: Tokyo',
    subtitle: 'Japan',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3a/17/eb/3a17eb30-eacb-82eb-51df-d1321dbb55bc/197188492205.jpg/600x600bb.jpg',
    badge: 'CITY CHART',
    type: 'playlist',
    searchQuery: 'Top Songs Tokyo Japan'
  }
];

// 9. ONLY ON YOUTUBE MUSIC
export const ONLY_ON_YT_ITEMS: SectionItem[] = [
  {
    id: 'yt-coke-studio',
    title: 'Coke Studio Season 15',
    subtitle: 'Live Acoustic & Fusion',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f3/f9/06/f3f906c3-79d5-ac9a-5fdd-262048f955f9/cover.jpg/600x600bb.jpg',
    badge: 'EXCLUSIVE',
    type: 'playlist',
    searchQuery: 'Coke Studio Season 15 Live'
  },
  {
    id: 'yt-colors-show',
    title: 'A Colors Show: Live Sessions',
    subtitle: 'Minimalist Vocal Performances',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1e/81/b7/1e81b7bd-34ef-8e32-00c0-0d931bc5bfb0/196874039458.jpg/600x600bb.jpg',
    badge: 'EXCLUSIVE',
    type: 'playlist',
    searchQuery: 'A COLORS SHOW best performances'
  },
  {
    id: 'yt-tiny-desk',
    title: 'NPR Tiny Desk Concerts',
    subtitle: 'Intimate Unplugged Sets',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/6c/11/d6/6c11d681-aa3a-d59e-4c2e-f77e181026ab/190295092665.jpg/600x600bb.jpg',
    badge: 'LIVE SESSIONS',
    type: 'playlist',
    searchQuery: 'NPR Tiny Desk Concert best'
  },
  {
    id: 'yt-mtv-unplugged',
    title: 'MTV Unplugged India',
    subtitle: 'Arijit Singh & Pritam Raw',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/ca/b2/4b/cab24b5b-e15f-62ba-d4c7-ddc19ee17e7a/00602557961836.rgb.jpg/600x600bb.jpg',
    badge: 'ACOUSTIC',
    type: 'playlist',
    searchQuery: 'MTV Unplugged India Arijit Singh'
  },
  {
    id: 'yt-coachella-live',
    title: 'Coachella Headliners Live',
    subtitle: 'Historic Festival Soundboards',
    artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    badge: 'LIVE STAGE',
    type: 'playlist',
    searchQuery: 'Coachella Live Soundboard Audio'
  },
  {
    id: 'yt-lollapalooza',
    title: 'Lollapalooza India Live',
    subtitle: 'Mumbai Festival Audio',
    artworkUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    badge: 'FESTIVAL',
    type: 'playlist',
    searchQuery: 'Lollapalooza India Live Set'
  }
];

// 10. LATEST DJ REMIXES
export const LATEST_DJ_REMIXES_ITEMS: SectionItem[] = [
  {
    id: 'dj-bollywood-club',
    title: 'Bollywood Club Mashup 2024',
    subtitle: 'DJ Chetas & DJ Shadow Dubai',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/d2/1c/bd/d21cbda3-8080-ba8a-37cb-14adc9682a6f/886447288764.jpg/600x600bb.jpg',
    badge: 'CLUB REMIX',
    type: 'playlist',
    searchQuery: 'Bollywood Club Mashup 2024 DJ Chetas'
  },
  {
    id: 'dj-punjabi-bass',
    title: 'Punjabi Dhol Bass Boosted',
    subtitle: 'High Voltage Festival Edits',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ca/87/d4/ca87d416-2021-0eb1-f36a-fe01998c738d/5059950896060_cover.jpg/600x600bb.jpg',
    badge: 'BASS BOOST',
    type: 'playlist',
    searchQuery: 'Punjabi Dhol Bass Remix 2024'
  },
  {
    id: 'dj-edm-mainstage',
    title: 'EDM Mainstage Bootlegs',
    subtitle: 'Tomorrowland & Ultra VIP Edits',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/6e/1e/f0/6e1ef055-195a-bb73-d5a8-5926058366a5/8712944577525.png/600x600bb.jpg',
    badge: 'VIP EDIT',
    type: 'playlist',
    searchQuery: 'Tomorrowland Mainstage Bootlegs 2024'
  },
  {
    id: 'dj-afro-desi',
    title: 'Afro-Desi House Flips',
    subtitle: 'Amapiano & Afro House Grooves',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/ee/f1/dc/eef1dc82-f516-fd0f-581c-3f952a0e2243/22UMGIM92113.rgb.jpg/600x600bb.jpg',
    badge: 'HOUSE FLIP',
    type: 'playlist',
    searchQuery: 'Afro Desi Amapiano Remix 2024'
  },
  {
    id: 'dj-deep-sunset',
    title: 'Deep House Sunset Session',
    subtitle: 'Goa & Ibiza Beach Flips',
    artworkUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    badge: 'SUNSET CHILL',
    type: 'playlist',
    searchQuery: 'Deep House Sunset Session Chillout'
  },
  {
    id: 'dj-slap-house',
    title: 'Slap House Hits 2024',
    subtitle: 'Heavy Punchy Basslines',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5e/5c/ea/5e5cead2-a482-48ef-8134-f725c2b49202/mzm.lydeceiv.jpg/600x600bb.jpg',
    badge: 'SLAP HOUSE',
    type: 'playlist',
    searchQuery: 'Slap House Chart Hits 2024'
  }
];

// 11. NOW ON TOUR
export const NOW_ON_TOUR_ITEMS: SectionItem[] = [
  {
    id: 'tour-dil-luminati',
    title: 'Dil-Luminati Tour: Live Setlist',
    subtitle: 'Diljit Dosanjh',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/97/86/86/97868694-9413-a543-514a-a6374469ff97/859736427250_cover.jpg/600x600bb.jpg',
    badge: 'ON TOUR',
    type: 'playlist',
    searchQuery: 'Diljit Dosanjh Dil Luminati Tour Live'
  },
  {
    id: 'tour-coldplay',
    title: 'Music of the Spheres Tour',
    subtitle: 'Coldplay',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/93/8c/f5938c49-964c-31d1-4b33-78b634f71fb7/190295978075.jpg/600x600bb.jpg',
    badge: 'WORLD TOUR',
    type: 'playlist',
    searchQuery: 'Coldplay Music of the Spheres Setlist'
  },
  {
    id: 'tour-eras',
    title: 'The Eras Tour: Setlist',
    subtitle: 'Taylor Swift',
    artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    badge: 'STADIUM TOUR',
    type: 'playlist',
    searchQuery: 'Taylor Swift Eras Tour Live Setlist'
  },
  {
    id: 'tour-karan-aujla',
    title: 'It Was All A Dream Tour',
    subtitle: 'Karan Aujla',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/48/7c/36/487c3668-f7a4-4b1a-e09e-c74dae124dd9/5063483578089_cover.jpg/600x600bb.jpg',
    badge: 'ARENA TOUR',
    type: 'playlist',
    searchQuery: 'Karan Aujla It Was All A Dream Tour'
  },
  {
    id: 'tour-dua-lipa',
    title: 'Radical Optimism Tour',
    subtitle: 'Dua Lipa',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/82/89/15/828915ea-d716-61c4-3de7-ef00c1f800fb/5054197853630.jpg/600x600bb.jpg',
    badge: 'LIVE TOUR',
    type: 'playlist',
    searchQuery: 'Dua Lipa Radical Optimism Tour'
  },
  {
    id: 'tour-oasis',
    title: 'Oasis Live 2025: Setlist',
    subtitle: 'Oasis',
    artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    badge: 'REUNION TOUR',
    type: 'playlist',
    searchQuery: 'Oasis Greatest Hits Live'
  }
];

// 12. RADIO EPISODES
export const RADIO_EPISODES_NEW_ITEMS: SectionItem[] = [
  {
    id: 'rad-zane-billie',
    title: 'Billie Eilish: The Zane Lowe Interview',
    subtitle: 'Apple Music 1 Special',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1a/37/d1/1a37d1b1-8508-54f2-f541-bf4e437dda76/19UMGIM05028.rgb.jpg/600x600bb.jpg',
    badge: 'APPLE MUSIC 1',
    type: 'playlist',
    searchQuery: 'Zane Lowe Billie Eilish Interview'
  },
  {
    id: 'rad-rap-life',
    title: 'Rap Life Radio with Ebro Darden',
    subtitle: 'Episode 312: Global Rap Radar',
    artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    badge: 'RAP LIFE',
    type: 'playlist',
    searchQuery: 'Rap Life Radio Ebro Darden'
  },
  {
    id: 'rad-dotty',
    title: 'The Dotty Show: Burna Boy Live',
    subtitle: 'Afrobeats to the World',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ca/eb/31/caeb3173-eaf0-0cd5-65ea-585adfe312ba/075679745156.jpg/600x600bb.jpg',
    badge: 'LIVE INTERVIEW',
    type: 'playlist',
    searchQuery: 'The Dotty Show Burna Boy'
  },
  {
    id: 'rad-vince-staples',
    title: '5 on Fridays with Vince Staples',
    subtitle: 'Cameras Everywhere',
    artworkUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    badge: 'EXCLUSIVE',
    type: 'playlist',
    searchQuery: '5 on Fridays Vince Staples'
  },
  {
    id: 'rad-superbloom',
    title: 'Superbloom Radio with Travis Mills',
    subtitle: 'Breakthrough Alternative Voices',
    artworkUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    badge: 'EPISODE',
    type: 'playlist',
    searchQuery: 'Superbloom Radio Travis Mills'
  },
  {
    id: 'rad-travis-scott',
    title: '.WAV Radio with Travis Scott & Chase B',
    subtitle: 'Cactus Jack Global Broadcast',
    artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    badge: 'CACTUS JACK',
    type: 'playlist',
    searchQuery: 'Travis Scott WAV Radio episode'
  }
];

// 13. COMING SOON
export const COMING_SOON_ITEMS: SectionItem[] = [
  {
    id: 'cs-coldplay-moon',
    title: 'Moon Music',
    subtitle: 'Coldplay • Coming Oct 4',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/af/3c/0f/af3c0fe2-1c4f-8499-67a8-14a8e41fdbf8/5021732410535.jpg/600x600bb.jpg',
    badge: 'PRE-ADD',
    tag: 'OCT 4',
    type: 'album',
    searchQuery: 'Coldplay Moon Music'
  },
  {
    id: 'cs-shawn-mendes',
    title: 'Shawn',
    subtitle: 'Shawn Mendes • Coming Nov 15',
    artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    badge: 'PRE-ADD',
    tag: 'NOV 15',
    type: 'album',
    searchQuery: 'Shawn Mendes new album'
  },
  {
    id: 'cs-weeknd-hurry',
    title: 'Hurry Up Tomorrow',
    subtitle: 'The Weeknd • Coming Soon',
    artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    badge: 'PRE-ADD',
    tag: 'ALBUM 3',
    type: 'album',
    searchQuery: 'The Weeknd Hurry Up Tomorrow'
  },
  {
    id: 'cs-diljit-next',
    title: 'The Next Chapter',
    subtitle: 'Diljit Dosanjh • Coming Winter',
    artworkUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    badge: 'PRE-ADD',
    tag: 'WINTER',
    type: 'album',
    searchQuery: 'Diljit Dosanjh new album'
  },
  {
    id: 'cs-ar-rahman',
    title: 'Genesis Symphony',
    subtitle: 'A.R. Rahman • Coming Soon',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/56/ac/41/56ac41f7-99f3-3eae-3b07-443167292c4e/8902894697408_cover.jpg/600x600bb.jpg',
    badge: 'PRE-ADD',
    tag: 'ORCHESTRAL',
    type: 'album',
    searchQuery: 'AR Rahman Genesis Symphony'
  },
  {
    id: 'cs-lady-gaga-lg7',
    title: 'LG7 - Project Disease',
    subtitle: 'Lady Gaga • Coming Soon',
    artworkUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    badge: 'PRE-ADD',
    tag: 'POP',
    type: 'album',
    searchQuery: 'Lady Gaga new album LG7'
  }
];
