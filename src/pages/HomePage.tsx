import React, { useRef } from 'react';
import {
  EDITORIAL_HEROES,
  MOODS_CATEGORIES
} from '../data/appleMusicCatalog';
import {
  TRENDING_ALBUMS,
  HINDI_ALBUMS,
  ENGLISH_ALBUMS,
  PUNJABI_ALBUMS,
  TAMIL_ALBUMS,
  TELUGU_ALBUMS,
  MALAYALAM_ALBUMS,
  TRENDING_PLAYLISTS,
  type HomeAlbumItem,
  type TrendingPlaylistItem
} from '../data/homeSectionsData';
import { EditorialShelf } from '../components/artwork/EditorialShelf';
import { CarouselCardShelf } from '../components/artwork/CarouselCardShelf';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types/music';

interface HomePageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { playTrack, playNext, addToQueue, recentlyPlayed } = usePlayer();
  const tracksCache = useRef<Map<string, Track[]>>(new Map());

  const fetchAlbumTracks = async (albumItem: HomeAlbumItem): Promise<Track[]> => {
    if (tracksCache.current.has(albumItem.id)) {
      return tracksCache.current.get(albumItem.id)!;
    }
    try {
      const query = albumItem.searchQuery || `${albumItem.title} ${albumItem.artist}`;
      const res = await fetch(`/api/music/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.tracks && Array.isArray(data.tracks) && data.tracks.length > 0) {
        tracksCache.current.set(albumItem.id, data.tracks);
        return data.tracks;
      }
    } catch (err) {
      console.error('Failed to fetch album tracks:', err);
    }
    return [];
  };

  const handlePlayAlbumItem = async (albumItem: HomeAlbumItem) => {
    const cached = tracksCache.current.get(albumItem.id);
    if (cached && cached.length > 0) {
      playTrack(cached[0], cached);
      return;
    }

    // Optimistic fallback track to provide immediate responsive feedback
    const optimisticTrack: Track = {
      id: `temp-${albumItem.id}`,
      title: albumItem.title,
      artists: [albumItem.artist],
      album: albumItem.title,
      artworkUrl: albumItem.artworkUrl,
      duration: 210,
      durationFormatted: '3:30',
      source: 'innertube',
      streamAvailability: false
    };
    playTrack(optimisticTrack);

    const tracks = await fetchAlbumTracks(albumItem);
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const handlePlayNextAlbumItem = async (albumItem: HomeAlbumItem) => {
    const tracks = await fetchAlbumTracks(albumItem);
    if (tracks.length > 0) {
      playNext(tracks[0]);
    }
  };

  const handleAddToQueueAlbumItem = async (albumItem: HomeAlbumItem) => {
    const tracks = await fetchAlbumTracks(albumItem);
    if (tracks.length > 0) {
      addToQueue(tracks[0]);
    }
  };

  const playlistTracksCache = useRef<Map<string, Track[]>>(new Map());

  const fetchTrendingPlaylistSongs = async (item: TrendingPlaylistItem): Promise<Track[]> => {
    if (playlistTracksCache.current.has(item.id)) {
      return playlistTracksCache.current.get(item.id)!;
    }
    try {
      const res = await fetch(`/api/music/playlist?q=${encodeURIComponent(item.searchQuery)}`);
      const data = await res.json();
      if (data.tracks && Array.isArray(data.tracks) && data.tracks.length > 0) {
        playlistTracksCache.current.set(item.id, data.tracks);
        return data.tracks;
      }
    } catch (err) {
      console.error('Failed to fetch trending playlist tracks:', err);
    }
    return [];
  };

  const handlePlayTrendingPlaylist = async (item: TrendingPlaylistItem) => {
    const cached = playlistTracksCache.current.get(item.id);
    if (cached && cached.length > 0) {
      playTrack(cached[0], cached);
      return;
    }

    // Optimistic fallback track
    const optimisticTrack: Track = {
      id: `temp-${item.id}`,
      title: item.title,
      artists: [item.curator],
      album: item.title,
      artworkUrl: item.artworkUrl,
      duration: 210,
      durationFormatted: '3:30',
      source: 'innertube',
      streamAvailability: false
    };
    playTrack(optimisticTrack);

    const tracks = await fetchTrendingPlaylistSongs(item);
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const handlePlayNextTrendingPlaylist = async (item: TrendingPlaylistItem) => {
    const tracks = await fetchTrendingPlaylistSongs(item);
    if (tracks.length > 0) {
      playNext(tracks[0]);
    }
  };

  const handleAddToQueueTrendingPlaylist = async (item: TrendingPlaylistItem) => {
    const tracks = await fetchTrendingPlaylistSongs(item);
    if (tracks.length > 0) {
      addToQueue(tracks[0]);
    }
  };

  const renderAlbumShelf = (title: string, albums: HomeAlbumItem[]) => {
    return (
      <CarouselCardShelf
        key={title}
        title={title}
        items={albums.map((album) => ({
          id: album.id,
          title: album.title,
          subtitle: album.artist,
          artworkUrl: album.artworkUrl,
          badge: album.year,
          type: 'album'
        }))}
        onTitleClick={() => onNavigate('search', title)}
        onItemClick={(item) => onNavigate('album', item.id)}
        onPlayClick={(item) => {
          const found = albums.find((a) => a.id === item.id);
          if (found) handlePlayAlbumItem(found);
        }}
        onPlayNext={(item) => {
          const found = albums.find((a) => a.id === item.id);
          if (found) handlePlayNextAlbumItem(found);
        }}
        onAddToQueue={(item) => {
          const found = albums.find((a) => a.id === item.id);
          if (found) handleAddToQueueAlbumItem(found);
        }}
      />
    );
  };

  return (
    <div className="apple-home-page">
      {/* 0. Home Header */}
      <div className="header-nav-model">
        <h1 className="header-nav-heading">Home</h1>
      </div>

      {/* 1. Signature Editorial Hero Carousel (Friday Feeling, Dopamine Chamber) */}
      <EditorialShelf
        heroes={EDITORIAL_HEROES}
        onSelect={(type, id) => onNavigate(type, id)}
      />

      {/* 2. Recently Played (Right below Carousel) */}
      {recentlyPlayed && recentlyPlayed.length > 0 && (
        <CarouselCardShelf
          title="Recently Played"
          items={recentlyPlayed.slice(0, 15).map((track) => ({
            id: track.id,
            title: track.title,
            subtitle: track.artists ? track.artists.join(', ') : '',
            artworkUrl: track.artworkUrl,
            type: 'track'
          }))}
          onTitleClick={() => onNavigate('library-recent')}
          onItemClick={(item) => {
            const track = recentlyPlayed.find((t) => t.id === item.id);
            if (track) playTrack(track, recentlyPlayed);
          }}
          onPlayClick={(item) => {
            const track = recentlyPlayed.find((t) => t.id === item.id);
            if (track) playTrack(track, recentlyPlayed);
          }}
          onPlayNext={(item) => {
            const track = recentlyPlayed.find((t) => t.id === item.id);
            if (track) playNext(track);
          }}
          onAddToQueue={(item) => {
            const track = recentlyPlayed.find((t) => t.id === item.id);
            if (track) addToQueue(track);
          }}
        />
      )}

      {/* 2b. Trending Playlists (All real tracks fetched from YouTube) */}
      <CarouselCardShelf
        title="Trending Playlists"
        items={TRENDING_PLAYLISTS.map((pl) => ({
          id: pl.id,
          title: pl.title,
          subtitle: pl.curator,
          artworkUrl: pl.artworkUrl,
          type: 'playlist'
        }))}
        onTitleClick={() => onNavigate('search', 'Trending Playlists')}
        onItemClick={(item) => onNavigate('playlist', item.id)}
        onPlayClick={(item) => {
          const found = TRENDING_PLAYLISTS.find((p) => p.id === item.id);
          if (found) handlePlayTrendingPlaylist(found);
        }}
        onPlayNext={(item) => {
          const found = TRENDING_PLAYLISTS.find((p) => p.id === item.id);
          if (found) handlePlayNextTrendingPlaylist(found);
        }}
        onAddToQueue={(item) => {
          const found = TRENDING_PLAYLISTS.find((p) => p.id === item.id);
          if (found) handleAddToQueueTrendingPlaylist(found);
        }}
      />

      {/* 3. Trending Albums */}
      {renderAlbumShelf('Trending Albums', TRENDING_ALBUMS)}

      {/* 4. Hindi Songs & Albums */}
      {renderAlbumShelf('Hindi Songs & Albums', HINDI_ALBUMS)}

      {/* 5. English Songs & Albums */}
      {renderAlbumShelf('English Songs & Albums', ENGLISH_ALBUMS)}

      {/* 6. Punjabi Songs & Albums */}
      {renderAlbumShelf('Punjabi Songs & Albums', PUNJABI_ALBUMS)}

      {/* 7. Tamil Songs & Albums */}
      {renderAlbumShelf('Tamil Songs & Albums', TAMIL_ALBUMS)}

      {/* 8. Telugu Songs & Albums */}
      {renderAlbumShelf('Telugu Songs & Albums', TELUGU_ALBUMS)}

      {/* 9. Malayalam Songs & Albums */}
      {renderAlbumShelf('Malayalam Songs & Albums', MALAYALAM_ALBUMS)}

      {/* 10. Browse by Category */}
      <section className="shelf-section">
        <div className="shelf-section-header">
          <h2 className="shelf-title">Browse by Category</h2>
        </div>

        <div className="category-tiles-grid">
          {MOODS_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="category-tile"
              style={{ background: cat.color }}
              onClick={() => onNavigate('search', cat.name)}
            >
              <span className="category-tile-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .apple-home-page {
          padding: 28px 36px 96px;
          max-width: 1540px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .apple-home-page {
            padding: 16px 14px 40px;
          }
          .header-nav-heading {
            font-size: 26px;
          }
          .header-nav-model {
            margin-bottom: 16px;
          }
          .shelf-section {
            margin-bottom: 28px;
          }
          .shelf-title {
            font-size: 19px;
          }
          .category-tile {
            height: 78px;
            padding: 10px 12px;
          }
          .category-tile-name {
            font-size: 13.5px;
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

        .shelf-section {
          margin-bottom: 40px;
        }

        .shelf-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .shelf-title {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.015em;
          color: var(--text-primary);
        }

        .category-tiles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
        }

        @media (max-width: 640px) {
          .category-tiles-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        .category-tile {
          height: 90px;
          border-radius: 10px;
          padding: 14px;
          cursor: pointer;
          display: flex;
          align-items: flex-end;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }

        .category-tile:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
        }

        .category-tile-name {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
