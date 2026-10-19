import React from 'react';
import {
  INITIAL_TRACKS,
  CURATED_ALBUMS,
  CURATED_PLAYLISTS
} from '../data/appleMusicCatalog';
import {
  NEW_THIS_WEEK_ITEMS,
  UPDATED_PLAYLIST_ITEMS,
  RECENT_RELEASE_ITEMS,
  EVERYONES_LISTENING_ITEMS,
  SPATIAL_AUDIO_ITEMS,
  DAILY_TOP_100_ITEMS,
  CITY_CHARTS_ITEMS,
  ONLY_ON_YT_ITEMS,
  LATEST_DJ_REMIXES_ITEMS,
  NOW_ON_TOUR_ITEMS,
  RADIO_EPISODES_NEW_ITEMS,
  COMING_SOON_ITEMS,
  type SectionItem
} from '../data/newSectionsData';
import { TrackLockupShelf } from '../components/track-list/TrackLockupShelf';
import { CarouselCardShelf, type CarouselCardItem } from '../components/artwork/CarouselCardShelf';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types/music';

interface NewPageProps {
  title?: string;
  onNavigate: (route: string, param?: string) => void;
}

export const NewPage: React.FC<NewPageProps> = ({ title = 'New', onNavigate }) => {
  const { playTrack } = usePlayer();

  // Helper to play section items dynamically
  const handlePlaySectionItem = async (item: SectionItem | CarouselCardItem) => {
    // Check if matching track exists in INITIAL_TRACKS
    const matchedTrack = INITIAL_TRACKS.find(
      t => t.id === item.id || t.title.toLowerCase().includes(item.title.toLowerCase())
    );

    if (matchedTrack) {
      playTrack(matchedTrack, INITIAL_TRACKS);
      return;
    }

    // Check if album exists in CURATED_ALBUMS
    const matchedAlbum = CURATED_ALBUMS.find(a => a.id === item.id);
    if (matchedAlbum && matchedAlbum.tracks.length > 0) {
      playTrack(matchedAlbum.tracks[0], matchedAlbum.tracks);
      return;
    }

    // Check if playlist exists in CURATED_PLAYLISTS
    const matchedPlaylist = CURATED_PLAYLISTS.find(p => p.id === item.id);
    if (matchedPlaylist && matchedPlaylist.tracks.length > 0) {
      playTrack(matchedPlaylist.tracks[0], matchedPlaylist.tracks);
      return;
    }

    // Try dynamic search or fallback to immediate playable track
    const fallbackTrack: Track = {
      id: item.id,
      title: item.title,
      artists: [item.subtitle || 'Apple Music'],
      album: item.title,
      artworkUrl: item.artworkUrl,
      duration: 210,
      durationFormatted: '3:30',
      source: 'innertube',
      streamAvailability: true
    };

    // Instant start with fallback
    playTrack(fallbackTrack, [fallbackTrack, ...INITIAL_TRACKS]);

    // Asynchronously try to fetch real stream
    const query = (item as SectionItem).searchQuery || `${item.title} ${item.subtitle}`;
    try {
      const res = await fetch(`/api/music/suggestions?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.tracks && data.tracks.length > 0) {
          const fetchedTrack: Track = {
            id: data.tracks[0].id,
            title: data.tracks[0].title || item.title,
            artists: [data.tracks[0].artist || item.subtitle],
            album: item.title,
            artworkUrl: data.tracks[0].artworkUrl || item.artworkUrl,
            duration: data.tracks[0].duration || 210,
            durationFormatted: data.tracks[0].durationFormatted || '3:30',
            source: 'innertube',
            streamAvailability: true
          };
          playTrack(fetchedTrack, [fetchedTrack, ...INITIAL_TRACKS]);
        }
      }
    } catch {
      // Keep playing fallback seamlessly
    }
  };

  const mapToCarouselItems = (items: SectionItem[]): CarouselCardItem[] => {
    return items.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      artworkUrl: item.artworkUrl,
      explicit: item.explicit,
      badge: item.badge,
      type: item.type
    }));
  };

  return (
    <div className="apple-new-page">
      {/* 0. Page Heading: "New" */}
      <div className="header-nav-model">
        <h1 className="header-nav-heading">{title}</h1>
      </div>


      {/* 1. NEW THIS WEEK */}
      <CarouselCardShelf
        title="New This Week"
        items={mapToCarouselItems(NEW_THIS_WEEK_ITEMS)}
        onTitleClick={() => onNavigate('library-albums')}
        onItemClick={(item) => onNavigate('album', item.id)}
        onPlayClick={handlePlaySectionItem}
      />

      {/* 2. UPDATED PLAYLIST */}
      <CarouselCardShelf
        title="Updated Playlist"
        items={mapToCarouselItems(UPDATED_PLAYLIST_ITEMS)}
        onTitleClick={() => onNavigate('library-recent')}
        onItemClick={(item) => onNavigate('playlist', item.id)}
        onPlayClick={handlePlaySectionItem}
      />

      {/* 3. RECENT RELEASE */}
      <CarouselCardShelf
        title="Recent Release"
        items={mapToCarouselItems(RECENT_RELEASE_ITEMS)}
        onTitleClick={() => onNavigate('library-songs')}
        onItemClick={handlePlaySectionItem}
        onPlayClick={handlePlaySectionItem}
      />

      {/* 4. TRENDING SONGS (4-column track lockup shelf) */}
      <TrackLockupShelf
        title="Trending Songs"
        tracks={INITIAL_TRACKS}
        onTitleClick={() => onNavigate('playlist', 'pl-nmd-india')}
      />

      {/* 5. EVERYONE'S LISTENING TO */}
      <CarouselCardShelf
        title="Everyone's Listening To"
        items={mapToCarouselItems(EVERYONES_LISTENING_ITEMS)}
        onTitleClick={() => onNavigate('playlist', 'pl-top-100-india')}
        onItemClick={handlePlaySectionItem}
        onPlayClick={handlePlaySectionItem}
      />

      {/* 6. BEST OF SPATIAL AUDIO */}
      <CarouselCardShelf
        title="Best of Spatial Audio"
        items={mapToCarouselItems(SPATIAL_AUDIO_ITEMS)}
        onTitleClick={() => onNavigate('playlist', 'pl-south-sensations')}
        onItemClick={handlePlaySectionItem}
        onPlayClick={handlePlaySectionItem}
      />

      {/* 7. DAILY TOP 100 */}
      <CarouselCardShelf
        title="Daily Top 100"
        items={mapToCarouselItems(DAILY_TOP_100_ITEMS)}
        onTitleClick={() => onNavigate('playlist', 'pl-top-100-india')}
        onItemClick={handlePlaySectionItem}
        onPlayClick={handlePlaySectionItem}
      />

      {/* 8. CITY CHARTS */}
      <CarouselCardShelf
        title="City Charts"
        items={mapToCarouselItems(CITY_CHARTS_ITEMS)}
        onTitleClick={() => onNavigate('playlist', 'pl-nmd-india')}
        onItemClick={handlePlaySectionItem}
        onPlayClick={handlePlaySectionItem}
      />

      {/* 9. ONLY ON YOUTUBE MUSIC */}
      <CarouselCardShelf
        title="Only on YouTube Music"
        items={mapToCarouselItems(ONLY_ON_YT_ITEMS)}
        onTitleClick={() => onNavigate('playlist', 'pl-friday-feeling')}
        onItemClick={handlePlaySectionItem}
        onPlayClick={handlePlaySectionItem}
      />

      {/* 10. LATEST DJ REMIXES */}
      <CarouselCardShelf
        title="Latest DJ Remixes"
        items={mapToCarouselItems(LATEST_DJ_REMIXES_ITEMS)}
        onTitleClick={() => onNavigate('playlist', 'pl-punjabi-wave')}
        onItemClick={handlePlaySectionItem}
        onPlayClick={handlePlaySectionItem}
      />

      {/* 11. NOW ON TOUR */}
      <CarouselCardShelf
        title="Now on Tour"
        items={mapToCarouselItems(NOW_ON_TOUR_ITEMS)}
        onTitleClick={() => onNavigate('playlist', 'pl-friday-feeling')}
        onItemClick={handlePlaySectionItem}
        onPlayClick={handlePlaySectionItem}
      />

      {/* 12. RADIO EPISODES */}
      <CarouselCardShelf
        title="Radio Episodes"
        items={mapToCarouselItems(RADIO_EPISODES_NEW_ITEMS)}
        onTitleClick={() => onNavigate('radio')}
        onItemClick={handlePlaySectionItem}
        onPlayClick={handlePlaySectionItem}
      />

      {/* 13. COMING SOON */}
      <CarouselCardShelf
        title="Coming Soon"
        items={mapToCarouselItems(COMING_SOON_ITEMS)}
        onTitleClick={() => onNavigate('library-albums')}
        onItemClick={handlePlaySectionItem}
        onPlayClick={handlePlaySectionItem}
      />

      <style>{`
        .apple-new-page {
          padding: 28px 36px 96px;
          max-width: 1540px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .apple-new-page {
            padding: 16px 14px 40px;
          }
          .header-nav-heading {
            font-size: 26px;
          }
          .header-nav-model {
            margin-bottom: 16px;
          }
        }

        .header-nav-model {
          margin-bottom: 22px;
        }

        .header-nav-heading {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 34px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          line-height: 1.15;
        }
      `}</style>
    </div>
  );
};

export default NewPage;
