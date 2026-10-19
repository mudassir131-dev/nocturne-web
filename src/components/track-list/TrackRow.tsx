import React, { useState } from 'react';
import { Play, MoreHorizontal, Plus, ListPlus, Heart } from 'lucide-react';
import type { Track } from '../../types/music';
import { usePlayer } from '../../context/PlayerContext';

interface TrackRowProps {
  track: Track;
  index: number;
  showAlbum?: boolean;
  showArtwork?: boolean;
  onPlayList?: () => void;
  onNavigate?: (route: string, param?: string) => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  showAlbum = true,
  showArtwork = true,
  onPlayList,
  onNavigate
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue, playNext } = usePlayer();
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const isCurrent = currentTrack?.id === track.id;

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      if (onPlayList) {
        onPlayList();
      } else {
        playTrack(track);
      }
    }
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setShowMenu(false);
  };

  return (
    <div
      className={`apple-track-row ${isCurrent ? 'row-active' : ''}`}
      onClick={handleRowClick}
    >
      {/* Index or Play icon */}
      <div className="col-index">
        {isCurrent ? (
          isPlaying ? (
            <div className="equalizer-bars">
              <span className="bar bar-1"></span>
              <span className="bar bar-2"></span>
              <span className="bar bar-3"></span>
            </div>
          ) : (
            <Play size={14} fill="var(--accent-red)" color="var(--accent-red)" className="state-icon" />
          )
        ) : (
          <span className="track-number">{index + 1}</span>
        )}
        <Play size={14} fill="#ffffff" color="#ffffff" className="hover-play-icon" />
      </div>

      {/* Artwork (if shown) */}
      {showArtwork && (
        <div className="col-artwork">
          <img
            src={track.artworkUrl}
            alt={track.title}
            className="thumb-img"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=80';
            }}
          />
        </div>
      )}

      {/* Title & Artist */}
      <div className="col-title-artist">
        <div className="title-line">
          <span className="song-title" title={track.title}>
            {track.title}
          </span>
          {track.explicit && <span className="badge-explicit">E</span>}
        </div>
        <div className="artist-line" title={track.artists.join(', ')}>
          {track.artists.map((artist, aIdx) => (
            <span
              key={artist}
              className={onNavigate ? "trackrow-clickable-artist" : ""}
              onClick={(e) => {
                if (onNavigate) {
                  e.stopPropagation();
                  onNavigate('artist', artist);
                }
              }}
            >
              {artist}{aIdx < track.artists.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Album (desktop only) */}
      {showAlbum && (
        <div className="col-album" title={track.album}>
          {track.album || 'Single'}
        </div>
      )}

      {/* Actions (Like, Menu) */}
      <div className="col-actions">
        <button
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
          onClick={(e) => handleActionClick(e, () => setIsLiked(!isLiked))}
          title={isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <Heart size={16} fill={isLiked ? 'var(--accent-red)' : 'none'} color={isLiked ? 'var(--accent-red)' : 'currentColor'} />
        </button>

        <div className="menu-container">
          <button
            className="action-btn menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            title="More Options"
          >
            <MoreHorizontal size={18} />
          </button>

          {showMenu && (
            <div className="track-context-menu" onClick={(e) => e.stopPropagation()}>
              <button
                className="context-menu-item"
                onClick={(e) => handleActionClick(e, () => playNext(track))}
              >
                <ListPlus size={16} />
                <span>Play Next</span>
              </button>
              <button
                className="context-menu-item"
                onClick={(e) => handleActionClick(e, () => addToQueue(track))}
              >
                <Plus size={16} />
                <span>Add to Queue</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Duration */}
      <div className="col-duration">
        {track.durationFormatted}
      </div>

      <style>{`
        .apple-track-row {
          display: flex;
          align-items: center;
          height: 52px;
          padding: 0 16px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          user-select: none;
          transition: background-color var(--transition-fast);
          font-size: 14px;
        }

        .apple-track-row:hover {
          background-color: var(--bg-hover);
        }

        .apple-track-row.row-active {
          background-color: var(--accent-red-dim);
        }

        .apple-track-row.row-active .song-title {
          color: var(--accent-red);
          font-weight: 600;
        }

        .col-index {
          width: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          font-variant-numeric: tabular-nums;
          font-size: 13px;
          position: relative;
        }

        .hover-play-icon {
          display: none;
          position: absolute;
        }

        .apple-track-row:hover .track-number,
        .apple-track-row:hover .equalizer-bars,
        .apple-track-row:hover .state-icon {
          display: none;
        }

        .apple-track-row:hover .hover-play-icon {
          display: block;
        }

        .col-artwork {
          width: 40px;
          height: 40px;
          margin-right: 14px;
          flex-shrink: 0;
        }

        .thumb-img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          object-fit: cover;
          display: block;
        }

        .col-title-artist {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .title-line {
          display: flex;
          align-items: center;
        }

        .song-title {
          color: var(--text-primary);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .artist-line {
          font-size: 12px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .col-album {
          flex: 0.8;
          min-width: 0;
          color: var(--text-secondary);
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 16px;
        }

        @media (max-width: 768px) {
          .col-album {
            display: none;
          }
        }

        .col-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .apple-track-row:hover .col-actions,
        .col-actions:focus-within {
          opacity: 1;
        }

        .action-btn {
          color: var(--text-secondary);
          padding: 6px;
          border-radius: var(--radius-full);
          transition: color var(--transition-fast), background-color var(--transition-fast);
        }

        .action-btn:hover {
          color: var(--text-primary);
          background-color: rgba(255, 255, 255, 0.1);
        }

        .like-btn.liked {
          opacity: 1;
        }

        .col-duration {
          width: 50px;
          text-align: right;
          color: var(--text-secondary);
          font-size: 13px;
          font-variant-numeric: tabular-nums;
          margin-left: 12px;
        }

        /* Animated mini equalizer */
        .equalizer-bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 14px;
        }

        .bar {
          width: 3px;
          background-color: var(--accent-red);
          border-radius: 1px;
          animation: bounce 0.8s ease-in-out infinite alternate;
        }

        .bar-1 { height: 12px; animation-delay: 0.1s; }
        .bar-2 { height: 7px; animation-delay: 0.3s; }
        .bar-3 { height: 14px; animation-delay: 0.2s; }

        @keyframes bounce {
          0% { height: 4px; }
          100% { height: 14px; }
        }

        .menu-container {
          position: relative;
        }

        .track-context-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: #242428;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.6);
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 50;
          min-width: 150px;
        }

        .context-menu-item {
          width: 100%;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          border-radius: var(--radius-xs);
          transition: background-color var(--transition-fast);
        }

        .context-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .trackrow-clickable-artist {
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .trackrow-clickable-artist:hover {
          color: var(--accent-red) !important;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
