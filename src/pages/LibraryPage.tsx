import React, { useState } from 'react';
import { INITIAL_TRACKS, CURATED_ALBUMS, CURATED_PLAYLISTS } from '../data/appleMusicCatalog';
import { ContentCard } from '../components/artwork/ContentCard';
import { TrackRow } from '../components/track-list/TrackRow';
import { usePlayer } from '../context/PlayerContext';
import { Clock, Disc3, Music2, ListMusic } from 'lucide-react';

interface LibraryPageProps {
  section?: 'recent' | 'artists' | 'albums' | 'songs';
  onNavigate: (route: string, param?: string) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ section = 'recent', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'albums' | 'songs' | 'playlists'>(
    section === 'albums' ? 'albums' : section === 'songs' ? 'songs' : 'recent'
  );
  const { playTrack } = usePlayer();

  return (
    <div className="apple-library-page">
      <h1 className="page-title">Library</h1>

      {/* Filter Tabs */}
      <div className="library-tabs">
        <button
          className={`lib-tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          <Clock size={16} />
          <span>Recently Added</span>
        </button>
        <button
          className={`lib-tab-btn ${activeTab === 'albums' ? 'active' : ''}`}
          onClick={() => setActiveTab('albums')}
        >
          <Disc3 size={16} />
          <span>Albums</span>
        </button>
        <button
          className={`lib-tab-btn ${activeTab === 'songs' ? 'active' : ''}`}
          onClick={() => setActiveTab('songs')}
        >
          <Music2 size={16} />
          <span>Songs</span>
        </button>
        <button
          className={`lib-tab-btn ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('playlists')}
        >
          <ListMusic size={16} />
          <span>Playlists</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="library-content-area">
        {activeTab === 'recent' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Recently Added to Library</h2>
            </div>
            <div className="grid-cards">
              {CURATED_ALBUMS.map((album) => (
                <ContentCard
                  key={album.id}
                  id={album.id}
                  title={album.title}
                  subtitle={album.artist}
                  artworkUrl={album.artworkUrl}
                  type="album"
                  onClick={() => onNavigate('album', album.id)}
                  onPlayClick={() => playTrack(album.tracks[0], album.tracks)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'albums' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Saved Albums</h2>
            </div>
            <div className="grid-cards">
              {CURATED_ALBUMS.map((album) => (
                <ContentCard
                  key={album.id}
                  id={album.id}
                  title={album.title}
                  subtitle={album.artist}
                  artworkUrl={album.artworkUrl}
                  type="album"
                  onClick={() => onNavigate('album', album.id)}
                  onPlayClick={() => playTrack(album.tracks[0], album.tracks)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'songs' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Liked Songs ({INITIAL_TRACKS.length})</h2>
            </div>
            <div className="library-songs-container">
              {INITIAL_TRACKS.map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  showAlbum={true}
                  showArtwork={true}
                  onPlayList={() => playTrack(track, INITIAL_TRACKS)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'playlists' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">My Playlists</h2>
            </div>
            <div className="grid-cards">
              {CURATED_PLAYLISTS.map((pl) => (
                <ContentCard
                  key={pl.id}
                  id={pl.id}
                  title={pl.title}
                  subtitle={pl.curator}
                  artworkUrl={pl.artworkUrl}
                  type="playlist"
                  onClick={() => onNavigate('playlist', pl.id)}
                  onPlayClick={() => playTrack(pl.tracks[0], pl.tracks)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .apple-library-page {
          padding: 24px 32px;
          max-width: 1300px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .apple-library-page {
            padding: 16px 14px 40px;
          }
          .library-tabs {
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            scrollbar-width: none !important;
            -webkit-overflow-scrolling: touch !important;
            padding: 2px 2px 8px !important;
            margin-bottom: 20px !important;
          }
          .library-tabs::-webkit-scrollbar {
            display: none !important;
          }
          .lib-tab-btn {
            flex-shrink: 0;
            padding: 7px 14px;
            font-size: 12.5px;
          }
        }

        .library-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .lib-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          background-color: rgba(255, 255, 255, 0.08);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }

        .lib-tab-btn:hover {
          background-color: rgba(255, 255, 255, 0.14);
          color: var(--text-primary);
        }

        .lib-tab-btn.active {
          background-color: var(--accent-red);
          color: var(--accent-contrast, #000000);
          font-weight: 600;
        }

        .library-songs-container {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 8px 0;
        }
      `}</style>
    </div>
  );
};
