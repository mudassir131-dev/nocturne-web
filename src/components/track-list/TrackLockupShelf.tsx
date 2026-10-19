import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, MoreHorizontal, Plus, ListPlus, Heart, Check } from 'lucide-react';
import type { Track } from '../../types/music';
import { usePlayer } from '../../context/PlayerContext';

interface TrackLockupShelfProps {
  title: string;
  tracks: Track[];
  onTitleClick?: () => void;
  onNavigate?: (route: string, param?: string) => void;
}

export const TrackLockupShelf: React.FC<TrackLockupShelfProps> = ({ title, tracks, onTitleClick, onNavigate }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue, playNext } = usePlayer();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Group tracks into columns of 4
  const columns: Track[][] = [];
  for (let i = 0; i < tracks.length; i += 4) {
    columns.push(tracks.slice(i, i + 4));
  }

  const checkScrollState = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollState();
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);

    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [tracks]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.lockup-menu-wrap')) {
        setActiveMenuId(null);
      }
    };
    if (activeMenuId) {
      window.addEventListener('click', handleOutsideClick);
      return () => window.removeEventListener('click', handleOutsideClick);
    }
  }, [activeMenuId]);

  const handleScrollNext = () => {
    if (!scrollContainerRef.current) return;
    const containerWidth = scrollContainerRef.current.clientWidth;
    // Scroll by ~2 columns or ~80% of visible container
    scrollContainerRef.current.scrollBy({ left: containerWidth * 0.75, behavior: 'smooth' });
  };

  const handleScrollPrev = () => {
    if (!scrollContainerRef.current) return;
    const containerWidth = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollBy({ left: -containerWidth * 0.75, behavior: 'smooth' });
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap(prev => {
      const next = !prev[id];
      showToast(next ? 'Added to Favorite Songs' : 'Removed from Favorites');
      return { ...prev, [id]: next };
    });
    setActiveMenuId(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  return (
    <div className="track-lockups-shelf">
      {/* Shelf Header: "Best New Songs >" */}
      <div className="shelf-header">
        <div className="shelf-title-wrap" onClick={onTitleClick}>
          <h2 className="shelf-title">{title}</h2>
          <ChevronRight size={18} className="shelf-title-chevron" />
        </div>
      </div>

      {/* Shelf Body with Horizontal Scroll Columns & Floating Chevrons */}
      <div className="shelf-track-container-relative">
        {/* Floating Left Arrow */}
        {canScrollLeft && (
          <button
            className="shelf-floating-nav shelf-floating-prev"
            onClick={handleScrollPrev}
            aria-label="Previous songs"
          >
            <ChevronLeft size={20} strokeWidth={2.4} />
          </button>
        )}

        {/* Floating Right Arrow */}
        {canScrollRight && (
          <button
            className="shelf-floating-nav shelf-floating-next"
            onClick={handleScrollNext}
            aria-label="Next songs"
          >
            <ChevronRight size={20} strokeWidth={2.4} />
          </button>
        )}

        {/* Scrollable Columns Row */}
        <div className="shelf-columns-scrollable" ref={scrollContainerRef}>
          {columns.map((colTracks, colIndex) => (
            <div key={`col-${colIndex}`} className="track-lockup-column">
              {colTracks.map((track, rowIndex) => {
                const isCurrent = currentTrack?.id === track.id;
                const isCurrentPlaying = isCurrent && isPlaying;
                const isLiked = !!likedMap[track.id];
                const isLastInCol = rowIndex === colTracks.length - 1;

                return (
                  <div
                    key={track.id}
                    className={`track-lockup-row ${isCurrent ? 'active' : ''} ${isLastInCol ? 'no-border' : ''}`}
                    onClick={() => {
                      if (isCurrent) {
                        togglePlay();
                      } else {
                        playTrack(track, tracks);
                      }
                    }}
                  >
                    {/* Square Artwork with Hover/Playing Play Icon Overlay */}
                    <div className="lockup-art-wrap">
                      <img
                        src={track.artworkUrl}
                        alt={track.title}
                        className="lockup-art-img"
                        loading="lazy"
                      />
                      <div
                        className={`lockup-play-overlay ${isCurrentPlaying ? 'is-playing' : ''}`}
                        aria-label={`Play ${track.title}`}
                      >
                        {isCurrentPlaying ? (
                          <Pause size={16} fill="#ffffff" color="#ffffff" />
                        ) : (
                          <Play size={16} fill="#ffffff" color="#ffffff" style={{ marginLeft: 2 }} />
                        )}
                      </div>

                      {isCurrentPlaying && (
                        <div className="lockup-mini-eq">
                          <span className="eq-bar bar-1"></span>
                          <span className="eq-bar bar-2"></span>
                          <span className="eq-bar bar-3"></span>
                        </div>
                      )}
                    </div>

                    {/* Metadata: Title & Artists */}
                    <div className="lockup-info">
                      <div className="lockup-title-text" title={track.title}>
                        {track.title}
                      </div>
                      <div className="lockup-artists-text" title={track.artists.join(', ')}>
                        {track.artists.map((artist, aIdx) => (
                          <span
                            key={artist}
                            className={onNavigate ? "lockup-clickable-artist" : ""}
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

                    {/* Action 3-dots Horizontal Ellipsis Menu */}
                    <div className="lockup-menu-wrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="lockup-ellipsis-btn"
                        onClick={() => setActiveMenuId(activeMenuId === track.id ? null : track.id)}
                        aria-label={`More options for ${track.title}`}
                        title="More"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {activeMenuId === track.id && (
                        <div className="lockup-menu-popover">
                          <button
                            className="menu-option"
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
                            className="menu-option"
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
                            className="menu-option"
                            onClick={(e) => toggleFavorite(track.id, e)}
                          >
                            <Heart
                              size={15}
                              fill={isLiked ? 'var(--accent-red)' : 'none'}
                              color={isLiked ? 'var(--accent-red)' : 'currentColor'}
                            />
                            <span>{isLiked ? 'Favorite' : 'Favorite'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Mini Toast Notification */}
      {toastMessage && (
        <div className="shelf-toast">
          <Check size={14} color="var(--accent-red)" />
          <span>{toastMessage}</span>
        </div>
      )}

      <style>{`
        .track-lockups-shelf {
          margin-bottom: 44px;
          position: relative;
        }

        .shelf-header {
          display: flex;
          align-items: center;
          margin-bottom: 14px;
        }

        .shelf-title-wrap {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          user-select: none;
        }

        .shelf-title {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.015em;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .shelf-title-chevron {
          color: var(--text-tertiary);
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .shelf-title-wrap:hover .shelf-title-chevron {
          transform: translateX(3px);
          color: var(--text-primary);
        }

        /* Container with relative anchor for floating next/prev arrows */
        .shelf-track-container-relative {
          position: relative;
          width: 100%;
        }

        /* Horizontal scroll columns */
        .shelf-columns-scrollable {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 2px 0 6px;
        }

        .shelf-columns-scrollable::-webkit-scrollbar {
          display: none;
        }

        /* Each column holds 4 stacked track rows */
        .track-lockup-column {
          flex: 0 0 calc(33.333% - 16px);
          min-width: 330px;
          max-width: 400px;
          scroll-snap-align: start;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 1100px) {
          .track-lockup-column {
            flex: 0 0 calc(50% - 12px);
            min-width: 300px;
          }
        }

        @media (max-width: 680px) {
          .track-lockup-column {
            flex: 0 0 88%;
            min-width: 270px;
          }
        }

        /* Individual song row */
        .track-lockup-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 10px;
          border-radius: 6px;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.15s ease;
          border-bottom: 1px solid var(--border-subtle);
          position: relative;
        }

        .track-lockup-row.no-border {
          border-bottom: 1px solid transparent;
        }

        .track-lockup-row:hover {
          background-color: var(--bg-hover);
        }

        .track-lockup-row.active {
          background-color: var(--accent-red-dim);
        }

        .track-lockup-row.active .lockup-title-text {
          color: var(--accent-red);
        }

        /* Artwork thumbnail */
        .lockup-art-wrap {
          position: relative;
          width: 46px;
          height: 46px;
          border-radius: 4px;
          overflow: hidden;
          background-color: #262629;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
        }

        .lockup-art-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* White play triangle icon overlay on artwork hover */
        .lockup-play-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.38);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .track-lockup-row:hover .lockup-play-overlay,
        .lockup-play-overlay.is-playing {
          opacity: 1;
        }

        .lockup-mini-eq {
          position: absolute;
          bottom: 3px;
          right: 3px;
          display: flex;
          align-items: flex-end;
          gap: 2px;
          background-color: rgba(0, 0, 0, 0.75);
          padding: 2px 3px;
          border-radius: 2px;
        }

        .eq-bar {
          width: 2px;
          background-color: #ffffff;
          border-radius: 1px;
          animation: eqPulse 0.7s ease-in-out infinite alternate;
        }

        .bar-1 { height: 7px; animation-delay: 0.1s; }
        .bar-2 { height: 4px; animation-delay: 0.25s; }
        .bar-3 { height: 9px; animation-delay: 0.15s; }

        @keyframes eqPulse {
          0% { height: 2px; }
          100% { height: 9px; }
        }

        /* Song Metadata (Title + Artist) */
        .lockup-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .lockup-title-text {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.25;
        }

        .lockup-artists-text {
          font-size: 12.5px;
          font-weight: 400;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }

        /* 3-dots Menu button */
        .lockup-menu-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .lockup-ellipsis-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.15s ease, background-color 0.15s ease;
        }

        .track-lockup-row:hover .lockup-ellipsis-btn,
        .lockup-ellipsis-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-hover);
        }

        /* Context menu popover */
        .lockup-menu-popover {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: var(--glass-bg-elevated);
          border: 1px solid var(--border-subtle);
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

        .menu-option {
          width: 100%;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          background: transparent;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.15s ease;
          text-align: left;
        }

        .menu-option:hover {
          background-color: var(--bg-hover);
        }

        /* Floating Nav Chevrons (Apple Music Right-edge Chevron) */
        .shelf-floating-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          width: 32px;
          height: 56px;
          border-radius: 8px;
          background-color: rgba(30, 30, 32, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
          transition: background-color 0.18s ease, transform 0.18s ease, opacity 0.18s ease;
        }

        .shelf-floating-prev {
          left: -4px;
        }

        .shelf-floating-next {
          right: -4px;
        }

        .shelf-floating-nav:hover {
          background-color: rgba(48, 48, 52, 0.98);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-50%) scale(1.04);
        }

        .shelf-floating-nav:active {
          transform: translateY(-50%) scale(0.96);
        }

        @media (max-width: 768px) {
          .shelf-floating-nav {
            display: none !important;
          }
          .track-lockup-column {
            flex: 0 0 86%;
            min-width: 250px;
          }
          .track-lockups-shelf {
            margin-bottom: 28px;
          }
        }

        /* Toast feedback */
        .shelf-toast {
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
          animation: toastFade 0.25s ease;
        }

        @keyframes toastFade {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        .lockup-clickable-artist {
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .lockup-clickable-artist:hover {
          color: var(--accent-red);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
