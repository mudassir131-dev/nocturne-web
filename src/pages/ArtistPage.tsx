import React, { useState, useEffect } from 'react';
import { Play, Pause, Star, Info, Share2, MoreHorizontal, ChevronLeft } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { CarouselCardShelf } from '../components/artwork/CarouselCardShelf';
import type { Track } from '../types/music';

interface ArtistPageProps {
  artistName: string;
  onNavigate: (route: string, param?: string) => void;
  onBack?: () => void;
}

interface ArtistData {
  name: string;
  avatarUrl: string;
  subscribers?: string;
  topSongs: Track[];
  albums: {
    id: string;
    title: string;
    artist: string;
    artworkUrl: string;
    year: string;
    type: string;
  }[];
  playlists?: {
    id: string;
    title: string;
    artist: string;
    artworkUrl: string;
    year: string;
    type: string;
  }[];
  latestRelease: {
    id: string;
    title: string;
    artist: string;
    artworkUrl: string;
    year: string;
    trackCount?: number;
    type: string;
  } | null;
}

export const ArtistPage: React.FC<ArtistPageProps> = ({ artistName, onNavigate, onBack }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [data, setData] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showBioModal, setShowBioModal] = useState<boolean>(false);
  const [showAllSongs, setShowAllSongs] = useState<boolean>(false);
  const [ambientBg, setAmbientBg] = useState<string>(
    'linear-gradient(180deg, rgba(62, 92, 38, 0.88) 0%, rgba(35, 52, 22, 0.45) 45%, rgba(11, 12, 16, 0.95) 100%)'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // Fetch full artist details dynamically
  useEffect(() => {
    setLoading(true);
    fetch(`/api/music/artist?name=${encodeURIComponent(artistName)}`)
      .then((res) => res.json())
      .then((resData: ArtistData) => {
        setData(resData);
        if (resData.avatarUrl) {
          extractAmbientColor(resData.avatarUrl);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch artist details:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [artistName]);

  // Extract dynamic dominant color from artist profile image
  const extractAmbientColor = (imageUrl: string) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 16;
          canvas.height = 16;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, 16, 16);
          const pixelData = ctx.getImageData(0, 0, 16, 16).data;

          let rSum = 0, gSum = 0, bSum = 0, count = 0;
          for (let i = 0; i < pixelData.length; i += 4) {
            const r = pixelData[i];
            const g = pixelData[i + 1];
            const b = pixelData[i + 2];
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            // Filter extremes
            if (brightness > 20 && brightness < 240) {
              rSum += r;
              gSum += g;
              bSum += b;
              count++;
            }
          }

          if (count > 0) {
            const r = Math.round(rSum / count);
            const g = Math.round(gSum / count);
            const b = Math.round(bSum / count);
            setAmbientBg(
              `linear-gradient(180deg, rgba(${r}, ${g}, ${b}, 0.9) 0%, rgba(${Math.round(r * 0.55)}, ${Math.round(g * 0.55)}, ${Math.round(b * 0.55)}, 0.45) 45%, rgba(11, 12, 16, 0.98) 100%)`
            );
          }
        } catch {
          // Keep default ambient
        }
      };
    } catch {
      // Keep default ambient
    }
  };

  const handlePlayArtist = () => {
    if (data && data.topSongs.length > 0) {
      if (currentTrack && data.topSongs.some((t) => t.id === currentTrack.id)) {
        togglePlay();
      } else {
        playTrack(data.topSongs[0], data.topSongs);
      }
    }
  };

  const isArtistPlaying =
    currentTrack &&
    data?.topSongs.some((t) => t.id === currentTrack.id) &&
    isPlaying;

  const topSongs = data?.topSongs || [];
  const albums = data?.albums || [];
  const playlists = data?.playlists || [];
  const latestRelease = data?.latestRelease || (albums[0] ? {
    id: albums[0].id,
    title: albums[0].title,
    artist: artistName,
    artworkUrl: albums[0].artworkUrl,
    year: albums[0].year,
    trackCount: 5,
    type: 'Album'
  } : null);

  return (
    <div className="apple-artist-page" style={{ background: ambientBg }}>
      {/* Toast Notification */}
      {toastMessage && <div className="artist-toast">{toastMessage}</div>}

      {/* Top Header Actions (Back Button on left + Share/More on right) */}
      <div className="artist-top-bar">
        {onBack ? (
          <button
            className="artist-page-back-btn"
            onClick={onBack}
            aria-label="Back"
            title="Go Back"
          >
            <ChevronLeft size={20} strokeWidth={2.4} />
            <span>Back</span>
          </button>
        ) : <div />}

        <div className="artist-top-right-group">
          <button
            className="top-bar-btn"
            title="Share Artist"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('Artist link copied to clipboard');
            }}
          >
            <Share2 size={16} />
          </button>
          <button
            className="top-bar-btn"
            title="More Options"
            onClick={() => showToast('Artist options')}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Artist Hero: Centered circular photo, artist name, controls */}
      <div className="artist-hero-section">
        <div className="artist-avatar-container">
          {data?.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt={artistName}
              className="artist-avatar-img"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
              }}
            />
          ) : (
            <div className="artist-avatar-placeholder">
              <span>{artistName.slice(0, 1)}</span>
            </div>
          )}
        </div>

        <h1 className="artist-name-heading">{artistName}</h1>

        {/* Action Buttons Row matching reference image */}
        <div className="artist-action-row">
          <button
            className="artist-icon-btn"
            title="Artist Info"
            onClick={() => setShowBioModal(!showBioModal)}
          >
            <Info size={17} />
          </button>

          <button
            className="artist-big-play-btn"
            title={isArtistPlaying ? 'Pause' : 'Play'}
            onClick={handlePlayArtist}
          >
            {isArtistPlaying ? (
              <Pause size={22} fill="#000000" color="#000000" />
            ) : (
              <Play size={22} fill="#000000" color="#000000" style={{ marginLeft: 3 }} />
            )}
          </button>

          <button
            className={`artist-icon-btn ${isFavorite ? 'active-star' : ''}`}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorite Artists'}
            onClick={() => {
              const next = !isFavorite;
              setIsFavorite(next);
              showToast(next ? 'Added to Favorite Artists' : 'Removed from Favorites');
            }}
          >
            <Star size={17} fill={isFavorite ? 'var(--accent-red)' : 'none'} color={isFavorite ? 'var(--accent-red)' : '#ffffff'} />
          </button>
        </div>

        {/* Info Modal / Bio Popover */}
        {showBioModal && (
          <div className="artist-bio-card">
            <h3>About {artistName}</h3>
            <p>
              Renowned artist and creator with millions of listeners worldwide. Verified artist on Nocturne Music with authentic lossless audio playback.
            </p>
            {data?.subscribers && <span className="sub-badge">{data.subscribers} Subscribers</span>}
          </div>
        )}
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="artist-loading-indicator">
          <div className="artist-spinner" />
          <span>Fetching songs and discography...</span>
        </div>
      )}

      {/* Main Two-Column Content: Latest Release (Left) & Top Songs (Right) */}
      {!loading && (
        <div className="artist-body-grid">
          {/* Left Column: Latest Release */}
          {latestRelease && (
            <div className="latest-release-column">
              <h2 className="section-title">Latest Release</h2>
              <div
                className="latest-release-card"
                onClick={() => {
                  if (latestRelease.id.startsWith('latest-')) {
                    if (topSongs[0]) playTrack(topSongs[0], topSongs);
                  } else {
                    onNavigate('album', latestRelease.id);
                  }
                }}
              >
                <div className="release-artwork-wrap">
                  <img
                    src={latestRelease.artworkUrl}
                    alt={latestRelease.title}
                    className="release-artwork-img"
                  />
                  <button
                    className="release-hover-play"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (topSongs.length > 0) playTrack(topSongs[0], topSongs);
                    }}
                  >
                    <Play size={20} fill="#ffffff" color="#ffffff" style={{ marginLeft: 2 }} />
                  </button>
                </div>
                <div className="release-info">
                  <span className="release-date">{latestRelease.year}</span>
                  <h3 className="release-title">{latestRelease.title}</h3>
                  <span className="release-sub">
                    {latestRelease.type} · {latestRelease.trackCount || 5} songs
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Top Songs */}
          <div className="top-songs-column">
            <div className="top-songs-header">
              <h2
                className="section-title clickable-title"
                onClick={() => setShowAllSongs(!showAllSongs)}
                title="Click to view all songs"
              >
                Top Songs &gt;
              </h2>
            </div>

            <div className="top-songs-list">
              {(showAllSongs ? topSongs : topSongs.slice(0, 5)).map((track, idx) => {
                const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;
                const isThisCurrent = currentTrack?.id === track.id;

                return (
                  <div
                    key={track.id || idx}
                    className={`artist-track-row ${isThisCurrent ? 'is-active' : ''}`}
                    onClick={() => {
                      if (isThisCurrent) {
                        togglePlay();
                      } else {
                        playTrack(track, topSongs);
                      }
                    }}
                  >
                    <div className="track-row-art-box">
                      <img
                        src={track.artworkUrl}
                        alt={track.title}
                        className="track-row-thumb"
                      />
                      {isThisTrackPlaying ? (
                        <div className="track-row-overlay-icon">
                          <Pause size={14} fill="#ffffff" />
                        </div>
                      ) : (
                        <div className="track-row-overlay-icon">
                          <Play size={14} fill="#ffffff" style={{ marginLeft: 1 }} />
                        </div>
                      )}
                    </div>

                    <div className="track-row-meta">
                      <span className="track-row-title" title={track.title}>
                        {track.title}
                      </span>
                      <span className="track-row-album" title={track.album || artistName}>
                        {track.album || artistName}
                      </span>
                    </div>

                    <div className="track-row-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="track-row-more-btn"
                        title="More"
                        onClick={() => showToast('Song options')}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Discography Shelves: Albums */}
      {!loading && albums.length > 0 && (
        <div className="artist-shelf-wrap">
          <CarouselCardShelf
            title="Albums & Singles"
            items={albums.map((alb) => ({
              id: alb.id,
              title: alb.title,
              subtitle: alb.artist,
              artworkUrl: alb.artworkUrl,
              badge: alb.year,
              type: 'album'
            }))}
            onItemClick={(item) => onNavigate('album', item.id)}
            onPlayClick={(item) => {
              fetch(`/api/music/playlist?q=${encodeURIComponent(item.title + ' ' + artistName)}`)
                .then((r) => r.json())
                .then((d) => {
                  if (d.tracks && d.tracks.length > 0) {
                    playTrack(d.tracks[0], d.tracks);
                  } else if (topSongs.length > 0) {
                    playTrack(topSongs[0], topSongs);
                  }
                })
                .catch(() => {
                  if (topSongs.length > 0) playTrack(topSongs[0], topSongs);
                });
            }}
          />
        </div>
      )}

      {/* Playlists Shelves */}
      {!loading && playlists.length > 0 && (
        <div className="artist-shelf-wrap" style={{ marginTop: 32 }}>
          <CarouselCardShelf
            title="Featured Playlists"
            items={playlists.map((pl) => ({
              id: pl.id,
              title: pl.title,
              subtitle: `${artistName} Essentials`,
              artworkUrl: pl.artworkUrl,
              badge: 'Playlist',
              type: 'playlist'
            }))}
            onItemClick={(item) => onNavigate('playlist', item.id)}
            onPlayClick={(item) => {
              fetch(`/api/music/playlist?q=${encodeURIComponent(item.title)}`)
                .then((r) => r.json())
                .then((d) => {
                  if (d.tracks && d.tracks.length > 0) {
                    playTrack(d.tracks[0], d.tracks);
                  } else if (topSongs.length > 0) {
                    playTrack(topSongs[0], topSongs);
                  }
                })
                .catch(() => {
                  if (topSongs.length > 0) playTrack(topSongs[0], topSongs);
                });
            }}
          />
        </div>
      )}

      <style>{`
        .apple-artist-page {
          min-height: 100vh;
          padding: 24px 44px 120px;
          color: #ffffff;
          transition: background 0.8s ease;
          position: relative;
        }

        @media (max-width: 800px) {
          .apple-artist-page {
            padding: 16px 14px 40px;
          }
          .artist-hero-section {
            padding: 10px 0 20px;
          }
          .artist-avatar-container {
            width: 135px;
            height: 135px;
            margin-bottom: 14px;
          }
          .artist-name-heading {
            font-size: 28px;
            margin-bottom: 14px;
          }
        }

        .artist-toast {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(20, 20, 25, 0.92);
          backdrop-filter: blur(24px);
          color: #ffffff;
          padding: 9px 20px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 500;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          z-index: 1000;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .artist-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .artist-top-right-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .artist-page-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          height: 32px;
          padding: 0 12px 0 6px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.14);
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

        .artist-page-back-btn:hover {
          background: rgba(255, 255, 255, 0.24);
          transform: scale(1.04);
        }

        .top-bar-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .top-bar-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .artist-hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px 0 36px;
          position: relative;
        }

        .artist-avatar-container {
          width: 175px;
          height: 175px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .artist-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .artist-avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          font-weight: 700;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.08) 100%);
        }

        .artist-name-heading {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 38px;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: #ffffff;
          margin: 0 0 20px;
          line-height: 1.15;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .artist-action-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .artist-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s ease, background-color 0.15s ease;
        }

        .artist-icon-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.05);
        }

        .artist-icon-btn.active-star {
          background: var(--accent-red-dim);
          border-color: var(--accent-red);
        }

        .artist-big-play-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .artist-big-play-btn:hover {
          transform: scale(1.06);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
        }

        .artist-bio-card {
          margin-top: 18px;
          max-width: 480px;
          background: rgba(15, 18, 24, 0.85);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          padding: 16px 20px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          text-align: left;
        }

        .artist-bio-card h3 {
          margin: 0 0 8px;
          font-size: 15px;
          font-weight: 600;
        }

        .artist-bio-card p {
          margin: 0 0 10px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.5;
        }

        .sub-badge {
          font-size: 11px;
          font-weight: 600;
          color: var(--accent-red);
          text-transform: uppercase;
        }

        .artist-loading-indicator {
          padding: 60px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          color: rgba(255, 255, 255, 0.75);
          font-size: 14px;
        }

        .artist-spinner {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: var(--accent-red);
          animation: spin 0.8s linear infinite;
        }

        .artist-body-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 36px;
          margin-top: 16px;
          margin-bottom: 48px;
        }

        @media (max-width: 900px) {
          .artist-body-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }

        .section-title {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 16px;
          letter-spacing: -0.015em;
        }

        .clickable-title {
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .clickable-title:hover {
          opacity: 0.8;
        }

        .latest-release-card {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .latest-release-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .release-artwork-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          margin-bottom: 14px;
        }

        .release-artwork-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .release-hover-play {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
          cursor: pointer;
        }

        .latest-release-card:hover .release-hover-play {
          opacity: 1;
        }

        .release-date {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
          display: block;
          margin-bottom: 4px;
        }

        .release-title {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .release-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .top-songs-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .artist-track-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .artist-track-row:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .artist-track-row.is-active {
          background: rgba(255, 255, 255, 0.12);
        }

        .track-row-art-box {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.1);
        }

        .track-row-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .track-row-overlay-icon {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .artist-track-row:hover .track-row-overlay-icon,
        .artist-track-row.is-active .track-row-overlay-icon {
          opacity: 1;
        }

        .track-row-meta {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .track-row-title {
          font-size: 14.5px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .track-row-album {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.55);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .track-row-actions {
          display: flex;
          align-items: center;
        }

        .track-row-more-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          padding: 6px;
          cursor: pointer;
          border-radius: 4px;
          transition: color 0.15s ease;
        }

        .track-row-more-btn:hover {
          color: #ffffff;
        }

        .artist-shelf-wrap {
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
};
export default ArtistPage;
