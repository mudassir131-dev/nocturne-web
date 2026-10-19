import React, { useRef, useState, useEffect } from 'react';
import {
  MoreHorizontal,
  Plus,
  ListPlus,
  Heart,
  Maximize2,
  Music2
} from 'lucide-react';
import {
  AppleRewindIcon,
  AppleForwardIcon,
  ApplePlayIcon,
  ApplePauseIcon,
  AppleShuffleIcon,
  AppleRepeatIcon,
  AppleQueueIcon,
  AppleSpeakerIcon
} from '../common/AppleIcons';
import { usePlayer } from '../../context/PlayerContext';

interface MiniPlayerProps {
  onNavigate?: (route: string, param?: string) => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onNavigate }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    seek,
    prevTrack,
    nextTrack,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    expandedPlayerOpen,
    setExpandedPlayerOpen,
    queueDrawerOpen,
    setQueueDrawerOpen,
    addToQueue,
    playNext
  } = usePlayer();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [activeMenuOpen, setActiveMenuOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mini-more-wrap') && !target.closest('.volume-control-wrap')) {
        setActiveMenuOpen(false);
        setShowVolumeSlider(false);
      }
    };
    if (activeMenuOpen || showVolumeSlider) {
      window.addEventListener('click', handleOutsideClick);
      return () => window.removeEventListener('click', handleOutsideClick);
    }
  }, [activeMenuOpen, showVolumeSlider]);

  if (expandedPlayerOpen) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    seek(fraction * duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="apple-floating-pill-player" role="region" aria-label="Media Player">
      {/* 1. Left Transport Playback Controls (Exact double-triangle Apple Music buttons) */}
      <div className="player-transport-controls">
        <button
          className={`transport-btn btn-shuffle ${isShuffle ? 'active-accent' : ''}`}
          onClick={toggleShuffle}
          title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
          aria-label="Shuffle"
        >
          <AppleShuffleIcon size={16} />
        </button>

        <button
          className="transport-btn btn-rewind"
          onClick={prevTrack}
          title="Previous Track"
          aria-label="Previous"
        >
          <AppleRewindIcon size={18} />
        </button>

        <button
          className="transport-play-btn"
          onClick={togglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <ApplePauseIcon size={22} />
          ) : (
            <ApplePlayIcon size={22} />
          )}
        </button>

        <button
          className="transport-btn btn-forward"
          onClick={nextTrack}
          title="Next Track"
          aria-label="Next"
        >
          <AppleForwardIcon size={18} />
        </button>

        <button
          className={`transport-btn btn-repeat ${repeatMode !== 'off' ? 'active-accent' : ''}`}
          onClick={cycleRepeat}
          title={`Repeat: ${repeatMode}`}
          aria-label="Repeat"
        >
          <AppleRepeatIcon size={16} mode={repeatMode} />
        </button>
      </div>

      {/* 2. Center Track Information + Scrubber directly underneath */}
      <div className="player-track-center">
        <div className="player-meta-top-row">
          <div
            className="player-meta-lockup"
            onClick={() => {
              if (currentTrack) {
                setExpandedPlayerOpen(true);
              } else {
                togglePlay();
              }
            }}
            title={currentTrack ? 'Open Now Playing' : 'Nothing Playing — Tap to play'}
          >
            {currentTrack ? (
              <img
                src={currentTrack.artworkUrl}
                alt={currentTrack.title}
                className="track-art-thumb"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4e/d8/d5/4ed8d575-b384-884d-cb7f-0bc51a0b5df6/8902894363990.jpg/300x300bb.webp';
                }}
              />
            ) : (
              <div className="track-art-thumb track-art-empty" aria-label="Nothing Playing">
                <Music2 size={18} className="empty-music-note" />
              </div>
            )}

            <div className="track-text-column">
              <span className="track-title-text" title={currentTrack ? currentTrack.title : 'Nothing Playing'}>
                {currentTrack ? currentTrack.title : 'Nothing Playing'}
              </span>
              <div className="track-subtitle-text" title={currentTrack ? currentTrack.artists.join(', ') : 'Choose a song to start listening'}>
                {currentTrack ? (
                  <>
                    <span className="sub-artist">
                      {currentTrack.artists.join(', ')}
                    </span>
                    {currentTrack.album && (
                      <span className="sub-album"> &mdash; {currentTrack.album}</span>
                    )}
                  </>
                ) : (
                  <span className="sub-artist sub-idle">Choose a song to start listening</span>
                )}
              </div>
            </div>
          </div>

          {/* 3 dots More button with Popover */}
          {currentTrack && (
            <div className="mini-more-wrap" onClick={(e) => e.stopPropagation()}>
              <button
                className="aux-icon-btn"
                onClick={() => setActiveMenuOpen(!activeMenuOpen)}
                title="More options"
                aria-label="More options"
              >
                <MoreHorizontal size={17} />
              </button>

            {activeMenuOpen && (
              <div className="mini-popover-menu">
                <button
                  className="mini-popover-item"
                  onClick={() => {
                    playNext(currentTrack);
                    setActiveMenuOpen(false);
                  }}
                >
                  <ListPlus size={15} />
                  <span>Play Next</span>
                </button>
                <button
                  className="mini-popover-item"
                  onClick={() => {
                    addToQueue(currentTrack);
                    setActiveMenuOpen(false);
                  }}
                >
                  <Plus size={15} />
                  <span>Add to Queue</span>
                </button>
                <button
                  className="mini-popover-item"
                  onClick={() => {
                    setIsLiked(!isLiked);
                    setActiveMenuOpen(false);
                  }}
                >
                  <Heart size={15} fill={isLiked ? 'var(--accent-red)' : 'none'} color={isLiked ? 'var(--accent-red)' : 'currentColor'} />
                  <span>{isLiked ? 'Loved' : 'Love'}</span>
                </button>
                <button
                  className="mini-popover-item"
                  onClick={() => {
                    setExpandedPlayerOpen(true);
                    setActiveMenuOpen(false);
                  }}
                >
                  <Maximize2 size={15} />
                  <span>Full Player & Lyrics</span>
                </button>
              </div>
            )}
          </div>
        )}
        </div>

        {/* Scrubber Progress Rail underneath the artwork & title with small white pill thumb */}
        <div
          className="player-progress-rail"
          ref={progressBarRef}
          onClick={handleScrubberClick}
          title="Seek"
        >
          <div className="progress-buffered-bar" style={{ width: `${buffered}%` }} />
          <div className="progress-played-bar" style={{ width: `${progressPercent}%` }}>
            <div className="progress-pill-thumb" />
          </div>
        </div>
      </div>

      {/* 3. Right Aux Controls (Queue, Volume) */}
      <div className="player-right-aux">
        {/* Queue Drawer Button */}
        <button
          className={`aux-icon-btn ${queueDrawerOpen ? 'active-icon' : ''}`}
          onClick={() => setQueueDrawerOpen(!queueDrawerOpen)}
          title="Up Next Queue"
          aria-label="Queue"
        >
          <AppleQueueIcon size={19} />
        </button>

        {/* Volume Speaker Control with Slider Popover */}
        <div
          className="volume-control-wrap"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            className="aux-icon-btn"
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label="Volume"
          >
            <AppleSpeakerIcon isMuted={isMuted} volume={volume} size={19} />
          </button>

          {showVolumeSlider && (
            <div className="volume-slider-floating-card">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="floating-volume-input"
                aria-label="Volume control"
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* Floating Rounded Capsule Pill Player - Authentic Liquid Glass */
        .apple-floating-pill-player {
          position: fixed;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          width: min(780px, calc(100vw - 32px));
          height: 56px;
          background: linear-gradient(180deg, rgba(48, 50, 58, 0.74) 0%, rgba(22, 23, 29, 0.84) 100%);
          backdrop-filter: blur(50px) saturate(210%);
          -webkit-backdrop-filter: blur(50px) saturate(210%);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 9999px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55), inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.38), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          z-index: 1000;
          user-select: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .apple-floating-pill-player:hover {
          border-color: rgba(255, 255, 255, 0.28);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.65), inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.45);
        }

        /* Light Mode Liquid Glass for Mini Player */
        [data-theme="light"] .apple-floating-pill-player {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(242, 244, 250, 0.82) 100%);
          backdrop-filter: blur(50px) saturate(210%);
          -webkit-backdrop-filter: blur(50px) saturate(210%);
          border: 1px solid rgba(255, 255, 255, 0.88);
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.08), inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 1);
        }

        [data-theme="light"] .transport-btn,
        [data-theme="light"] .transport-play-btn,
        [data-theme="light"] .aux-icon-btn {
          color: #1c1c1e;
        }

        [data-theme="light"] .transport-btn:hover,
        [data-theme="light"] .aux-icon-btn:hover {
          color: #000000;
        }

        [data-theme="light"] .track-title-text {
          color: #1c1c1e;
        }

        [data-theme="light"] .track-subtitle-text,
        [data-theme="light"] .sub-artist {
          color: #6e6e73;
        }

        [data-theme="light"] .player-progress-rail {
          background-color: rgba(0, 0, 0, 0.10);
        }

        [data-theme="light"] .progress-buffered-bar {
          background-color: rgba(0, 0, 0, 0.16);
        }

        [data-theme="light"] .progress-played-bar {
          background-color: #1c1c1e;
        }

        [data-theme="light"] .progress-pill-thumb {
          background: #1c1c1e;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
        }

        @media (max-width: 900px) {
          .apple-floating-pill-player {
            bottom: calc(14px + 58px + 8px + env(safe-area-inset-bottom, 0px));
            left: 14px;
            right: 14px;
            width: auto;
            max-width: 480px;
            margin: 0 auto;
            transform: none;
            height: 54px;
            padding: 0 14px 0 8px;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          /* Invert Order: Track metadata on left, playback controls on right */
          .player-track-center {
            order: 1 !important;
            flex: 1 !important;
            min-width: 0 !important;
            margin: 0 !important;
            max-width: none !important;
          }

          .player-progress-rail {
            display: none !important;
          }

          .mini-more-wrap {
            display: none !important;
          }

          .player-right-aux {
            display: none !important;
          }

          .player-meta-top-row {
            gap: 10px;
          }

          .player-meta-lockup {
            gap: 10px;
          }

          .track-art-thumb {
            width: 38px !important;
            height: 38px !important;
            border-radius: 7px !important;
            flex-shrink: 0 !important;
          }

          .track-art-empty {
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: rgba(255, 255, 255, 0.6);
          }

          [data-theme="light"] .track-art-empty {
            background: rgba(0, 0, 0, 0.06);
            border-color: rgba(0, 0, 0, 0.08);
            color: #8e8e93;
          }

          .sub-idle {
            font-style: normal;
            opacity: 0.68;
          }

          .track-text-column {
            gap: 1.5px !important;
            min-width: 0 !important;
          }

          .track-title-text {
            font-size: 13px !important;
            font-weight: 600 !important;
          }

          .track-subtitle-text {
            font-size: 11.5px !important;
          }

          .player-transport-controls {
            order: 2 !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-end !important;
            margin-left: 12px !important;
            gap: 14px !important;
            flex-shrink: 0 !important;
          }

          /* Hide shuffle, rewind, repeat on mobile - keep only play & next */
          .btn-shuffle,
          .btn-rewind,
          .btn-repeat {
            display: none !important;
          }

          .transport-play-btn {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 36px !important;
            height: 36px !important;
            padding: 0 !important;
            margin: 0 !important;
            color: #ffffff !important;
          }

          .btn-forward {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 36px !important;
            height: 36px !important;
            padding: 0 !important;
            margin: 0 !important;
            color: #ffffff !important;
          }

          [data-theme="light"] .transport-play-btn,
          [data-theme="light"] .btn-forward {
            color: #1c1c1e !important;
          }
        }

        /* 1. Left Transport Controls */
        .player-transport-controls {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .transport-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.82);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: color 0.15s ease, transform 0.15s ease;
        }

        .transport-btn:hover {
          color: #ffffff;
          transform: scale(1.08);
        }

        .transport-btn.active-accent {
          color: var(--accent-red);
        }

        .transport-play-btn {
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          transition: transform 0.15s ease;
        }

        .transport-play-btn:hover {
          transform: scale(1.1);
        }

        /* 2. Center Track Info & Scrubber */
        .player-track-center {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          max-width: 440px;
          margin: 0 16px;
          min-width: 0;
          position: relative;
        }

        .player-meta-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
          min-width: 0;
        }

        .player-meta-lockup {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          min-width: 0;
          flex: 1;
        }

        .track-art-thumb {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          object-fit: cover;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
          flex-shrink: 0;
        }

        .track-text-column {
          display: flex;
          flex-direction: column;
          gap: 1.5px;
          min-width: 0;
        }

        .track-title-text {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.25;
        }

        .track-subtitle-text {
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.58);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }

        .sub-album {
          color: rgba(255, 255, 255, 0.50);
        }

        .sub-artist-red {
          color: var(--accent-red);
          font-weight: 500;
        }

        .clickable-artist {
          cursor: pointer;
          transition: color 0.15s ease, text-decoration 0.15s ease;
        }

        .clickable-artist:hover {
          color: var(--accent-red) !important;
          text-decoration: underline;
        }

        .sub-rest {
          color: rgba(255, 255, 255, 0.55);
        }

        /* Scrubber progress bar directly underneath track */
        .player-progress-rail {
          position: relative;
          width: 100%;
          height: 3px;
          background-color: rgba(255, 255, 255, 0.16);
          border-radius: 9999px;
          cursor: pointer;
          margin-top: 3.5px;
          transition: height 0.15s ease;
          overflow: visible;
        }

        .player-progress-rail:hover {
          height: 4.5px;
        }

        .progress-buffered-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.24);
          border-radius: 9999px;
        }

        .progress-played-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background-color: #ffffff;
          border-radius: 9999px;
        }

        .progress-pill-thumb {
          position: absolute;
          right: -1px;
          top: 50%;
          transform: translateY(-50%);
          width: 14px;
          height: 3.5px;
          background: #ffffff;
          border-radius: 9999px;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
        }

        /* 3. Right Aux Controls */
        .player-right-aux {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }

        @media (max-width: 600px) {
          .mini-more-wrap {
            display: none;
          }
        }

        .aux-icon-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.80);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: color 0.15s ease, transform 0.15s ease;
        }

        .aux-icon-btn:hover {
          color: #ffffff;
          transform: scale(1.08);
        }

        .aux-icon-btn.active-icon {
          color: var(--accent-red);
        }

        /* 3-dots Menu Popover */
        .mini-more-wrap {
          position: relative;
        }

        .mini-popover-menu {
          position: absolute;
          bottom: calc(100% + 12px);
          right: 0;
          background-color: #242428;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.65);
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 1010;
          min-width: 170px;
          backdrop-filter: blur(20px);
        }

        .mini-popover-item {
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

        .mini-popover-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        /* Volume Slider Floating Card */
        .volume-control-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .volume-slider-floating-card {
          position: absolute;
          bottom: calc(100% + 14px);
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(26, 28, 34, 0.94);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 14px 10px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1010;
        }

        .floating-volume-input {
          -webkit-appearance: none;
          appearance: none;
          width: 90px;
          height: 4px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
        }

        .floating-volume-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
};
