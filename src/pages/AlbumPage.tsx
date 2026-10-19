import React, { useState, useEffect } from 'react';
import { CURATED_ALBUMS } from '../data/appleMusicCatalog';
import { findHomeAlbumById } from '../data/homeSectionsData';
import type { Track } from '../types/music';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import {
  Play,
  Pause,
  MoreHorizontal,
  Share2,
  ListPlus,
  Plus,
  Heart,
  Check,
  ChevronLeft
} from 'lucide-react';

interface AlbumPageProps {
  albumId: string;
  onNavigate: (route: string, param?: string) => void;
  onBack?: () => void;
}

export const AlbumPage: React.FC<AlbumPageProps> = ({ albumId, onNavigate, onBack }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue, playNext } = usePlayer();
  const { setAdaptiveColor } = useTheme();
  const [hoveredTrackId, setHoveredTrackId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dynamicTracks, setDynamicTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState<boolean>(false);

  const curatedAlbum = CURATED_ALBUMS.find((a) => a.id === albumId);
  const homeAlbum = findHomeAlbumById(albumId);

  useEffect(() => {
    if (homeAlbum && (!curatedAlbum || curatedAlbum.tracks.length === 0)) {
      setLoadingTracks(true);
      fetch(`/api/music/search?q=${encodeURIComponent(homeAlbum.searchQuery || `${homeAlbum.title} ${homeAlbum.artist}`)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.tracks && Array.isArray(data.tracks) && data.tracks.length > 0) {
            setDynamicTracks(data.tracks);
          }
        })
        .catch((err) => console.error('Failed to fetch album tracks:', err))
        .finally(() => setLoadingTracks(false));
    }
  }, [albumId, homeAlbum, curatedAlbum]);

  const album = curatedAlbum || (homeAlbum ? {
    id: homeAlbum.id,
    title: homeAlbum.title,
    artist: homeAlbum.artist,
    artworkUrl: homeAlbum.artworkUrl,
    genre: homeAlbum.genre || 'Soundtrack',
    year: homeAlbum.year || '2024',
    tracks: dynamicTracks,
    description: `Official album soundtrack by ${homeAlbum.artist}`
  } : CURATED_ALBUMS[0]);

  // Adapt mobile status bar and navigation bar to album ambient background
  useEffect(() => {
    const colorMap: Record<string, string> = {
      'alb-udta-teer': '#3d341c',
      'alb-dilfek': '#442a1e',
      'alb-blue-hour': '#1b2f42',
      'alb-homecoming': '#2a2c35'
    };
    const target = colorMap[album.id] || '#2a2c35';
    setAdaptiveColor(target);
    return () => setAdaptiveColor(null);
  }, [album.id, setAdaptiveColor]);

  const totalDurationSecs = album.tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalMins = Math.floor(totalDurationSecs / 60);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handlePlayAlbum = () => {
    if (album.tracks.length > 0) {
      if (currentTrack && album.tracks.some(t => t.id === currentTrack.id)) {
        togglePlay();
      } else {
        playTrack(album.tracks[0], album.tracks);
      }
    }
  };

  const isAlbumPlaying = currentTrack && album.tracks.some(t => t.id === currentTrack.id) && isPlaying;

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap(prev => {
      const next = !prev[id];
      showToast(next ? 'Added to Favorite Songs' : 'Removed from Favorites');
      return { ...prev, [id]: next };
    });
    setActiveMenuId(null);
  };

  // Dynamic ambient background color tailored to the album
  const getAmbientBackground = (id: string) => {
    switch (id) {
      case 'alb-udta-teer':
        return 'linear-gradient(180deg, rgba(61, 52, 28, 0.8) 0%, rgba(41, 35, 20, 0.45) 40%, rgba(10, 11, 16, 0.1) 100%)';
      case 'alb-dilfek':
        return 'linear-gradient(180deg, rgba(68, 42, 30, 0.8) 0%, rgba(42, 27, 20, 0.45) 40%, rgba(10, 11, 16, 0.1) 100%)';
      case 'alb-blue-hour':
        return 'linear-gradient(180deg, rgba(27, 47, 66, 0.8) 0%, rgba(18, 30, 43, 0.45) 40%, rgba(10, 11, 16, 0.1) 100%)';
      case 'alb-homecoming':
        return 'linear-gradient(180deg, rgba(42, 44, 53, 0.8) 0%, rgba(25, 27, 34, 0.45) 40%, rgba(10, 11, 16, 0.1) 100%)';
      default:
        return 'linear-gradient(180deg, rgba(61, 52, 28, 0.8) 0%, rgba(41, 35, 20, 0.45) 40%, rgba(10, 11, 16, 0.1) 100%)';
    }
  };

  return (
    <div
      className="apple-album-container"
      style={{ background: getAmbientBackground(album.id) }}
      onClick={() => setActiveMenuId(null)}
    >
      {/* Top Action Header (Back Button on left + Share/More on right) */}
      <div className="album-top-actions">
        {onBack ? (
          <button
            className="album-page-back-btn"
            onClick={onBack}
            aria-label="Back"
            title="Go Back"
          >
            <ChevronLeft size={20} strokeWidth={2.4} />
            <span>Back</span>
          </button>
        ) : <div />}

        <div className="album-top-right-group">
          <button
            className="top-action-btn"
            title="Share"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('Link copied to clipboard');
            }}
          >
            <Share2 size={18} />
          </button>
          <button
            className="top-action-btn"
            title="More options"
            onClick={() => showToast('Album options')}
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="album-content-inner">
        {/* Album Hero Section: Artwork left, Metadata right */}
        <div className="album-hero">
          <div className="album-art-wrap">
            <img
              src={album.artworkUrl}
              alt={album.title}
              className="album-art-img"
            />
          </div>

          <div className="album-hero-details">
            <h1 className="album-hero-title">{album.title}</h1>
            <div
              className="album-hero-artists"
              onClick={() => onNavigate('search', album.artist)}
            >
              {album.artist}
            </div>
            <div className="album-hero-meta">
              <span>{album.genre}</span>
              <span className="dot-sep">·</span>
              <span>{album.year}</span>
            </div>

            {/* White Pill Preview/Play Button */}
            <button className="album-preview-pill" onClick={handlePlayAlbum}>
              {isAlbumPlaying ? (
                <>
                  <Pause size={15} fill="#000000" color="#000000" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={15} fill="#000000" color="#000000" style={{ marginLeft: 2 }} />
                  <span>Preview</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Clean Apple Music Tracklist (No table headers) */}
        <div className="album-tracklist">
          {loadingTracks && album.tracks.length === 0 && (
            <div style={{ padding: '40px 20px', display: 'flex', alignItems: 'center', gap: '14px', color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.2)', borderTopColor: 'var(--accent-red)', animation: 'spin 0.8s linear infinite' }} />
              <span>Fetching songs from music catalog...</span>
            </div>
          )}
          {album.tracks.map((track: Track, index: number) => {
            const isCurrent = currentTrack?.id === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;
            const isHovered = hoveredTrackId === track.id;
            const isLiked = !!likedMap[track.id];

            return (
              <div
                key={track.id}
                className={`album-track-row ${isCurrent ? 'is-selected' : ''}`}
                onMouseEnter={() => setHoveredTrackId(track.id)}
                onMouseLeave={() => setHoveredTrackId(null)}
                onClick={() => {
                  if (isCurrent) {
                    togglePlay();
                  } else {
                    playTrack(track, album.tracks);
                  }
                }}
              >
                {/* Left Number / Play Indicator */}
                <div className="row-left-indicator">
                  {isCurrent && <span className="active-dot">•</span>}

                  {isCurrentPlaying ? (
                    <Pause size={14} fill="#ffffff" color="#ffffff" className="row-icon-btn" />
                  ) : isHovered ? (
                    <Play size={14} fill="#ffffff" color="#ffffff" className="row-icon-btn" style={{ marginLeft: 1 }} />
                  ) : isCurrent ? (
                    <Play size={14} fill="#ffffff" color="#ffffff" className="row-icon-btn" style={{ marginLeft: 1 }} />
                  ) : (
                    <span className="row-number">{index + 1}</span>
                  )}
                </div>

                {/* Track Title and Artists */}
                <div className="row-center-text">
                  <div className="row-title" title={track.title}>
                    {track.title}
                  </div>
                  <div className="row-artists" title={track.artists.join(', ')}>
                    {track.artists.join(', ')}
                  </div>
                </div>

                {/* Right: Duration / Preview Badge + 3-dots Menu */}
                <div className="row-right-actions" onClick={(e) => e.stopPropagation()}>
                  {isCurrent ? (
                    <span className="badge-preview">PREVIEW</span>
                  ) : (
                    <span className="row-duration">{track.durationFormatted}</span>
                  )}

                  <div className="row-menu-anchor">
                    <button
                      className="row-dots-btn"
                      onClick={() => setActiveMenuId(activeMenuId === track.id ? null : track.id)}
                      title="More"
                      aria-label="More options"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {activeMenuId === track.id && (
                      <div className="row-menu-popover">
                        <button
                          className="popover-option"
                          onClick={() => {
                            playNext(track);
                            showToast(`Playing next: ${track.title}`);
                            setActiveMenuId(null);
                          }}
                        >
                          <ListPlus size={15} />
                          <span>Play Next</span>
                        </button>
                        <button
                          className="popover-option"
                          onClick={() => {
                            addToQueue(track);
                            showToast(`Added to queue: ${track.title}`);
                            setActiveMenuId(null);
                          }}
                        >
                          <Plus size={15} />
                          <span>Add to Queue</span>
                        </button>
                        <button
                          className="popover-option"
                          onClick={(e) => toggleFavorite(track.id, e)}
                        >
                          <Heart
                            size={15}
                            fill={isLiked ? 'var(--accent-red)' : 'none'}
                            color={isLiked ? 'var(--accent-red)' : 'currentColor'}
                          />
                          <span>{isLiked ? 'Favorited' : 'Favorite'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Album Footer Metadata */}
        <div className="album-footer-meta">
          <p className="footer-date">16 October {album.year}</p>
          <p className="footer-count">{album.tracks.length} songs, {totalMins} minutes</p>
          <p className="footer-copyright">℗ {album.year} Sony Music Entertainment India Pvt. Ltd.</p>
          <p className="footer-itunes">
            <a
              href="#itunes"
              onClick={(e) => {
                e.preventDefault();
                showToast('Opening iTunes Store');
              }}
              className="itunes-link"
            >
              Also available in the iTunes Store ↗
            </a>
          </p>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="album-toast">
          <Check size={14} color="var(--accent-red)" />
          <span>{toastMessage}</span>
        </div>
      )}

      <style>{`
        .apple-album-container {
          min-height: 100%;
          padding: 24px 44px 80px;
          position: relative;
          color: #ffffff;
          transition: background 0.4s ease;
        }

        @media (max-width: 768px) {
          .apple-album-container {
            padding: 16px 14px 40px;
          }
          .album-top-actions {
            margin-bottom: 12px;
          }
          .album-hero {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 16px;
            margin-bottom: 24px;
          }
          .album-art-wrap {
            width: min(220px, 62vw);
            min-width: min(220px, 62vw);
            height: min(220px, 62vw);
          }
          .album-hero-details {
            align-items: center;
          }
          .album-hero-title {
            font-size: 22px;
            text-align: center;
          }
          .album-hero-artists {
            font-size: 16px;
            text-align: center;
          }
          .album-hero-meta {
            justify-content: center;
            margin-bottom: 16px;
          }
          .album-track-row {
            padding: 8px 8px;
            min-height: 48px;
          }
          .badge-preview {
            display: none;
          }
          .row-right-actions {
            gap: 10px;
            padding-left: 8px;
          }
        }

        .album-content-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Top Action Header */
        .album-top-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .album-top-right-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .album-page-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          height: 32px;
          padding: 0 12px 0 6px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          outline: none !important;
          -webkit-tap-highlight-color: transparent !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .album-page-back-btn:hover {
          background: rgba(255, 255, 255, 0.22);
          transform: scale(1.04);
        }

        .top-action-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.75);
          cursor: pointer;
          transition: color 0.15s ease, background-color 0.15s ease;
        }

        .top-action-btn:hover {
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.12);
        }

        /* Hero Header */
        .album-hero {
          display: flex;
          align-items: center;
          gap: 32px;
          margin-bottom: 36px;
        }

        .album-art-wrap {
          width: 260px;
          min-width: 260px;
          height: 260px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
          background-color: #1e1e22;
        }

        .album-art-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .album-hero-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }

        .album-hero-title {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.015em;
          color: #ffffff;
          line-height: 1.25;
          margin-bottom: 8px;
        }

        .album-hero-artists {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.3;
          margin-bottom: 8px;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .album-hero-artists:hover {
          opacity: 0.85;
        }

        .album-hero-meta {
          font-size: 13px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dot-sep {
          font-weight: 700;
        }

        /* White Pill Preview Button */
        .album-preview-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 24px;
          background-color: #ffffff;
          color: #000000;
          border-radius: 9999px;
          border: none;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          transition: opacity 0.15s ease, transform 0.15s ease;
        }

        .album-preview-pill:hover {
          opacity: 0.92;
          transform: scale(1.02);
        }

        .album-preview-pill:active {
          transform: scale(0.98);
        }

        /* Tracklist Section */
        .album-tracklist {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 28px;
        }

        .album-track-row {
          display: flex;
          align-items: center;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.15s ease;
          min-height: 52px;
        }

        .album-track-row:hover {
          background-color: rgba(255, 255, 255, 0.08);
        }

        .album-track-row.is-selected {
          background-color: rgba(255, 255, 255, 0.14);
        }

        /* Left Indicator: dot + number or play icon */
        .row-left-indicator {
          width: 32px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 6px;
          flex-shrink: 0;
        }

        .active-dot {
          font-size: 16px;
          color: #ffffff;
          margin-left: -12px;
          margin-right: 4px;
          line-height: 1;
        }

        .row-number {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
        }

        .row-icon-btn {
          color: #ffffff;
        }

        /* Center: Title & Artists */
        .row-center-text {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding-left: 8px;
        }

        .row-title {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.25;
        }

        .row-artists {
          font-size: 12.5px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.55);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }

        /* Right: Duration + dots */
        .row-right-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
          padding-left: 16px;
        }

        .badge-preview {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.58);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .row-duration {
          font-size: 13px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.55);
          min-width: 34px;
          text-align: right;
        }

        .row-menu-anchor {
          position: relative;
        }

        .row-dots-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.55);
          cursor: pointer;
          transition: color 0.15s ease, background-color 0.15s ease;
        }

        .album-track-row:hover .row-dots-btn,
        .row-dots-btn:hover {
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.1);
        }

        /* Popover Context Menu */
        .row-menu-popover {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: #242428;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.65);
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 60;
          min-width: 155px;
          backdrop-filter: blur(20px);
        }

        .popover-option {
          width: 100%;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #ffffff;
          background: transparent;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.15s ease;
          text-align: left;
        }

        .popover-option:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        /* Footer Metadata */
        .album-footer-meta {
          padding: 16px 14px 40px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.6;
        }

        .footer-date {
          margin-bottom: 2px;
        }

        .footer-count {
          margin-bottom: 2px;
        }

        .footer-copyright {
          margin-bottom: 12px;
        }

        .itunes-link {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .itunes-link:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        /* Toast Feedback */
        .album-toast {
          position: fixed;
          bottom: 96px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(28, 28, 30, 0.94);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 8px 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #ffffff;
          z-index: 100;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          animation: albumToastFade 0.25s ease;
        }

        @keyframes albumToastFade {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};
