import React, { useState, useEffect } from 'react';
import { CURATED_PLAYLISTS } from '../data/appleMusicCatalog';
import { TRENDING_PLAYLISTS } from '../data/homeSectionsData';
import { getPlaylistById, deleteCustomPlaylist } from '../services/playlistStorage';
import { TrackRow } from '../components/track-list/TrackRow';
import { usePlayer } from '../context/PlayerContext';
import { Play, Shuffle, Clock, Music, Trash2, ChevronLeft } from 'lucide-react';
import type { Track } from '../types/music';

interface PlaylistPageProps {
  playlistId: string;
  onNavigate: (route: string, param?: string) => void;
  onBack?: () => void;
}

export const PlaylistPage: React.FC<PlaylistPageProps> = ({ playlistId, onNavigate, onBack }) => {
  const { playTrack, toggleShuffle } = usePlayer();
  const [dynamicTracks, setDynamicTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const trendingPl = TRENDING_PLAYLISTS.find((p) => p.id === playlistId);
  const basePlaylist = getPlaylistById(playlistId, CURATED_PLAYLISTS) || CURATED_PLAYLISTS[0];

  useEffect(() => {
    if (trendingPl) {
      setLoading(true);
      fetch(`/api/music/playlist?q=${encodeURIComponent(trendingPl.searchQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.tracks && Array.isArray(data.tracks) && data.tracks.length > 0) {
            setDynamicTracks(data.tracks);
          }
        })
        .catch((err) => console.error('Failed to fetch trending playlist songs:', err))
        .finally(() => setLoading(false));
    }
  }, [playlistId, trendingPl]);

  const playlist = trendingPl
    ? {
        id: trendingPl.id,
        title: trendingPl.title,
        curator: trendingPl.curator,
        description: `Official trending playlist featuring all genuine tracks from YouTube Music.`,
        artworkUrl: trendingPl.artworkUrl,
        trackCount: dynamicTracks.length,
        tracks: dynamicTracks
      }
    : basePlaylist;

  const totalDurationSecs = playlist.tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalMins = Math.floor(totalDurationSecs / 60);

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  const handleShufflePlay = () => {
    if (playlist.tracks.length > 0) {
      toggleShuffle();
      const randomIndex = Math.floor(Math.random() * playlist.tracks.length);
      playTrack(playlist.tracks[randomIndex], playlist.tracks);
    }
  };

  return (
    <div className="apple-playlist-page">
      {onBack && (
        <div className="playlist-top-bar">
          <button
            className="playlist-back-btn"
            onClick={onBack}
            aria-label="Back"
            title="Go Back"
          >
            <ChevronLeft size={20} strokeWidth={2.4} />
            <span>Back</span>
          </button>
        </div>
      )}
      <div className="playlist-hero">
        <div className="playlist-artwork-box">
          <img
            src={playlist.artworkUrl}
            alt={playlist.title}
            className="playlist-artwork-img"
          />
        </div>

        <div className="playlist-metadata">
          <span className="metadata-eyebrow">PLAYLIST</span>
          <h1 className="playlist-hero-title">{playlist.title}</h1>
          <div className="playlist-curator">{playlist.curator}</div>
          <p className="playlist-description">{playlist.description}</p>

          <div className="playlist-subtext">
            <span>Updated Daily</span>
            <span className="bullet-sep">•</span>
            <span>{playlist.tracks.length} Songs, {totalMins} min</span>
            <span className="bullet-sep">•</span>
            <span>Lossless Audio</span>
          </div>

          <div className="playlist-btn-row">
            <button className="btn-play-red" onClick={handlePlayAll}>
              <Play size={18} fill="#ffffff" />
              <span>Play</span>
            </button>
            <button className="btn-secondary" onClick={handleShufflePlay}>
              <Shuffle size={18} />
              <span>Shuffle</span>
            </button>
            {playlist.curator === 'You' && (
              <button
                className="btn-secondary"
                style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red-dim)' }}
                onClick={() => {
                  deleteCustomPlaylist(playlist.id);
                  onNavigate('home');
                }}
                title="Delete this playlist"
              >
                <Trash2 size={16} color="currentColor" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="playlist-track-section">
        <div className="track-list-header">
          <span className="th-num">#</span>
          <span className="th-title">TITLE</span>
          <span className="th-album">ALBUM</span>
          <span className="th-time"><Clock size={14} /></span>
        </div>

        <div className="playlist-tracks-container">
          {loading && playlist.tracks.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              color: 'rgba(255, 255, 255, 0.75)'
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '3px solid rgba(255, 255, 255, 0.2)',
                borderTopColor: 'var(--accent-red)',
                animation: 'spin 0.8s linear infinite'
              }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>Fetching all playlist songs from YouTube...</span>
            </div>
          ) : playlist.tracks.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8
              }}>
                <Music size={22} color="rgba(255, 255, 255, 0.6)" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#ffffff', margin: 0 }}>This playlist is empty</h3>
              <p style={{ fontSize: 14, margin: 0, maxWidth: 360, lineHeight: 1.5 }}>
                Add your favorite tracks by exploring songs on Home, New releases, or Searching for artists.
              </p>
              <button
                onClick={() => onNavigate('home')}
                style={{
                  marginTop: 8,
                  padding: '8px 20px',
                  borderRadius: 20,
                  backgroundColor: 'var(--accent-red)',
                  color: 'var(--accent-contrast, #000000)',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Explore Home
              </button>
            </div>
          ) : (
            playlist.tracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                showAlbum={true}
                showArtwork={true}
                onPlayList={() => playTrack(track, playlist.tracks)}
              />
            ))
          )}
        </div>
      </div>

      <style>{`
        .apple-playlist-page {
          padding: 24px 40px 60px;
          max-width: 1300px;
          margin: 0 auto;
        }

        .playlist-top-bar {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .playlist-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          height: 32px;
          padding: 0 12px 0 6px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          color: var(--text-primary);
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          outline: none !important;
          -webkit-tap-highlight-color: transparent !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        [data-theme="light"] .playlist-back-btn {
          background: rgba(0, 0, 0, 0.06);
        }

        .playlist-back-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          transform: scale(1.04);
        }

        [data-theme="light"] .playlist-back-btn:hover {
          background: rgba(0, 0, 0, 0.12);
        }

        @media (max-width: 768px) {
          .apple-playlist-page {
            padding: 16px 14px 40px;
          }
          .playlist-hero {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 16px;
            margin-bottom: 24px;
          }
          .playlist-artwork-box {
            width: min(220px, 62vw);
            min-width: min(220px, 62vw);
            height: min(220px, 62vw);
          }
          .playlist-btn-row {
            justify-content: center;
          }
        }

        .playlist-artwork-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .playlist-metadata {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        @media (max-width: 768px) {
          .playlist-metadata {
            align-items: center;
          }
        }

        .metadata-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-tertiary);
        }

        .playlist-hero-title {
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          line-height: 1.15;
        }

        @media (max-width: 768px) {
          .playlist-hero-title {
            font-size: 24px;
          }
        }

        .playlist-curator {
          font-size: 15px;
          font-weight: 600;
          color: var(--accent-red);
        }

        .playlist-description {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          max-width: 650px;
          margin: 4px 0 8px;
        }

        .playlist-subtext {
          font-size: 13px;
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }

        .bullet-sep {
          opacity: 0.5;
        }

        .playlist-btn-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .track-list-header {
          display: flex;
          align-items: center;
          padding: 0 16px 8px;
          border-bottom: 1px solid var(--border-subtle);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-tertiary);
          letter-spacing: 0.05em;
        }

        .th-num { width: 32px; }
        .th-title { flex: 1; }
        .th-album { flex: 0.8; }
        .th-time { width: 50px; text-align: right; }

        @media (max-width: 768px) {
          .th-album { display: none; }
        }

        .playlist-tracks-container {
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
};
