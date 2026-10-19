import React, { useRef, useState, useEffect, useMemo } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useTheme } from '../../context/ThemeContext';
import {
  X,
  ChevronDown,
  Volume1,
  Volume2,
  VolumeX,
  Star,
  MoreHorizontal,
  Mic2,
  Sparkles,
  MessageSquareQuote,
  ListMusic,
  Cast,
  ListPlus,
  Plus,
  Loader2,
  Music2
} from 'lucide-react';
import type { Track, LyricsData } from '../../types/music';
import { getTrackLyrics } from '../../services/lyrics/lyricsService';
import Lenis from 'lenis';
import {
  AppleRewindIcon,
  AppleForwardIcon,
  ApplePlayIcon,
  ApplePauseIcon,
  AppleShuffleIcon,
  AppleRepeatIcon
} from '../common/AppleIcons';

// Fallback track when player opens with no active track
const DEFAULT_FALLBACK_TRACK: Track = {
  id: '',
  title: 'Nothing Playing',
  artists: ['Select a song to start listening'],
  album: '',
  artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  duration: 0,
  durationFormatted: '0:00',
  source: 'innertube',
  streamAvailability: false
};

interface FluidColors {
  c1: string;
  c2: string;
  c3: string;
  c4: string;
}

const DEFAULT_DARK_PALETTE: FluidColors = {
  c1: 'rgb(88, 72, 60)',
  c2: 'rgb(48, 38, 32)',
  c3: 'rgb(125, 98, 80)',
  c4: 'rgb(24, 18, 16)'
};

interface DedicatedPlayerProps {
  onClose?: () => void;
  onNavigate?: (route: string, param?: string) => void;
  isClosing?: boolean;
}

export const DedicatedPlayer: React.FC<DedicatedPlayerProps> = ({ onClose, onNavigate, isClosing }) => {
  const {
    currentTrack: activeTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isBuffering,
    togglePlay,
    seek,
    prevTrack,
    nextTrack,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    setExpandedPlayerOpen,
    addToQueue,
    playNext,
    playTrack,
    queue,
    queueIndex
  } = usePlayer();

  const track = activeTrack || DEFAULT_FALLBACK_TRACK;
  const { setAdaptiveColor } = useTheme();

  const [rightPanelMode, setRightPanelMode] = useState<'lyrics' | 'queue'>('lyrics');
  const [mobileStageMode, setMobileStageMode] = useState<'artwork' | 'lyrics' | 'queue'>('artwork');
  const [isSingModeActive, setIsSingModeActive] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [palette, setPalette] = useState<FluidColors>(DEFAULT_DARK_PALETTE);

  // Slide-up entrance & Drag-down dismiss gestures
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [dragY, setDragY] = useState<number>(0);
  const [isDraggingSheet, setIsDraggingSheet] = useState<boolean>(false);
  const dragStartYRef = useRef<number>(0);
  const dragStartXRef = useRef<number>(0);
  const dragStartTimeRef = useRef<number>(0);
  const isEligibleDragRef = useRef<boolean>(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => {
      cancelAnimationFrame(raf);
      setAdaptiveColor(null);
    };
  }, [setAdaptiveColor]);

  // Lyrics state
  const [lyricsData, setLyricsData] = useState<LyricsData>({
    found: false,
    isSynced: false,
    lines: []
  });
  const [lyricsLoading, setLyricsLoading] = useState<boolean>(false);

  const scrubberRailRef = useRef<HTMLDivElement>(null);
  const volumeRailRef = useRef<HTMLDivElement>(null);
  const lyricsScrollRef = useRef<HTMLDivElement>(null);

  const [isDraggingScrubber, setIsDraggingScrubber] = useState<boolean>(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.apple-more-anchor')) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) {
      window.addEventListener('click', handleOutsideClick);
      return () => window.removeEventListener('click', handleOutsideClick);
    }
  }, [showMoreMenu]);

  // Color extraction from album artwork
  useEffect(() => {
    if (!track?.artworkUrl) {
      setPalette(DEFAULT_DARK_PALETTE);
      return;
    }

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = track.artworkUrl;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 16;
          canvas.height = 16;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, 16, 16);
          const data = ctx.getImageData(0, 0, 16, 16).data;

          let rSum = 0, gSum = 0, bSum = 0, count = 0;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const lum = (r * 299 + g * 587 + b * 114) / 1000;
            if (lum > 20 && lum < 235) {
              rSum += r;
              gSum += g;
              bSum += b;
              count++;
            }
          }

          if (count > 0) {
            const avgR = Math.round(rSum / count);
            const avgG = Math.round(gSum / count);
            const avgB = Math.round(bSum / count);
            const ambientColor = `rgb(${Math.round(avgR * 0.35)}, ${Math.round(avgG * 0.32)}, ${Math.round(avgB * 0.35)})`;
            setPalette({
              c1: `rgb(${avgR}, ${avgG}, ${avgB})`,
              c2: `rgb(${Math.round(avgR * 0.65)}, ${Math.round(avgG * 0.6)}, ${Math.round(avgB * 0.65)})`,
              c3: `rgb(${Math.min(255, Math.round(avgR * 1.35))}, ${Math.min(255, Math.round(avgG * 1.25))}, ${Math.min(255, Math.round(avgB * 1.3))})`,
              c4: `rgb(${Math.round(avgR * 0.22)}, ${Math.round(avgG * 0.18)}, ${Math.round(avgB * 0.2)})`
            });
            setAdaptiveColor(ambientColor);
          }
        } catch {
          setPalette(DEFAULT_DARK_PALETTE);
          setAdaptiveColor(null);
        }
      };
      img.onerror = () => {
        setPalette(DEFAULT_DARK_PALETTE);
        setAdaptiveColor(null);
      };
    } catch {
      setPalette(DEFAULT_DARK_PALETTE);
    }
  }, [track]);

  // Fetch or populate Live Synced Lyrics
  useEffect(() => {
    if (!track) return;

    let isMounted = true;
    setLyricsLoading(true);

    getTrackLyrics(track.title, track.artists[0], track.duration, track.id, track.album)
      .then((data) => {
        if (isMounted) {
          if (data && data.found && data.lines.length > 0) {
            setLyricsData(data);
          } else {
            setLyricsData({
              found: true,
              isSynced: true,
              lines: [
                { time: 0, text: `♪ Now playing ${track.title} ♪` },
                { time: 10, text: track.artists.join(', ') },
                { time: 24, text: "Lossless Audio Stream from Nocturne Music" },
                { time: 42, text: `Album: ${track.album || 'Single'}` },
                { time: 65, text: "♪ Instrumentals ♪" }
              ]
            });
          }
          setLyricsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLyricsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [track?.id]);

  // Current active lyric line index based on playback currentTime
  const currentLineIndex = useMemo(() => {
    if (!lyricsData.lines || lyricsData.lines.length === 0) return -1;
    let idx = -1;
    for (let i = 0; i < lyricsData.lines.length; i++) {
      if (currentTime >= lyricsData.lines[i].time) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [currentTime, lyricsData]);

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroller ONLY for desktop lyrics (never on mobile to prevent touch jitter)
  useEffect(() => {
    const container = lyricsScrollRef.current;
    if (!container || rightPanelMode !== 'lyrics' || window.innerWidth <= 900) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      wrapper: container,
      content: (container.firstElementChild as HTMLElement) || container,
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    lenisRef.current = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [rightPanelMode, lyricsData.lines.length]);

  // Lenis Auto-scroll to center active line with Apple Music spring physics
  useEffect(() => {
    if (lyricsScrollRef.current && currentLineIndex >= 0) {
      const container = lyricsScrollRef.current;
      const activeEl = container.querySelector(`[data-line-index="${currentLineIndex}"]`) as HTMLElement;
      if (activeEl) {
        const targetTop = activeEl.offsetTop - (container.clientHeight / 2) + (activeEl.clientHeight / 2);
        const clampedTop = Math.max(0, targetTop);

        if (lenisRef.current) {
          lenisRef.current.scrollTo(clampedTop, {
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          container.scrollTo({
            top: clampedTop,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [currentLineIndex, mobileStageMode]);

  // Format time mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const trackDuration = duration > 0 ? duration : (track.duration || 217);
  const remainingTime = trackDuration > currentTime ? trackDuration - currentTime : 0;
  const progressPercent = trackDuration > 0 ? Math.min(100, (currentTime / trackDuration) * 100) : 0;
  const volumePercent = isMuted ? 0 : Math.min(100, Math.max(0, volume * 100));

  // Scrubber drag / click
  const updateScrub = (clientX: number) => {
    if (!scrubberRailRef.current || trackDuration <= 0) return;
    const rect = scrubberRailRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    seek(fraction * trackDuration);
  };

  const handleScrubberMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingScrubber(true);
    updateScrub(e.clientX);

    const onMouseMove = (moveEvt: MouseEvent) => updateScrub(moveEvt.clientX);
    const onMouseUp = () => {
      setIsDraggingScrubber(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Volume slider drag / click
  const updateVolume = (clientX: number) => {
    if (!volumeRailRef.current) return;
    const rect = volumeRailRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    setVolume(fraction);
  };

  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingVolume(true);
    updateVolume(e.clientX);

    const onMouseMove = (moveEvt: MouseEvent) => updateVolume(moveEvt.clientX);
    const onMouseUp = () => {
      setIsDraggingVolume(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setExpandedPlayerOpen(false);
      if (onNavigate) onNavigate('home');
    }
  };

  // Touch Drag-to-Dismiss Handler (anywhere on the player sheet)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isClosing) return;
    const touch = e.touches[0];
    dragStartYRef.current = touch.clientY;
    dragStartXRef.current = touch.clientX;
    dragStartTimeRef.current = Date.now();

    // Check if target is inside an element that is scrolled down
    let target = e.target as HTMLElement | null;
    let canScrollUp = false;
    while (target && target !== e.currentTarget) {
      if (target.scrollHeight > target.clientHeight && target.scrollTop > 0) {
        canScrollUp = true;
        break;
      }
      target = target.parentElement;
    }
    isEligibleDragRef.current = !canScrollUp;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isEligibleDragRef.current || isClosing) return;
    const touch = e.touches[0];
    const deltaY = touch.clientY - dragStartYRef.current;
    const deltaX = touch.clientX - dragStartXRef.current;

    // Only initiate drag if predominantly downward movement
    if (deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX) * 1.1) {
      setIsDraggingSheet(true);
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingSheet) {
      isEligibleDragRef.current = false;
      return;
    }
    const elapsed = Math.max(1, Date.now() - dragStartTimeRef.current);
    const velocity = dragY / elapsed;

    if (dragY > 110 || velocity > 0.4) {
      // Trigger smooth slide down and close
      handleClose();
    } else {
      // Smooth spring back to top
      setDragY(0);
      setIsDraggingSheet(false);
    }
    isEligibleDragRef.current = false;
  };

  // Mouse Drag Handle for Desktop users on Header
  const handleMouseDownHeader = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || isClosing) return;
    const startY = e.clientY;
    const startTime = Date.now();
    setIsDraggingSheet(true);

    const onMouseMove = (moveEvt: MouseEvent) => {
      const deltaY = moveEvt.clientY - startY;
      if (deltaY > 0) {
        setDragY(deltaY);
      }
    };

    const onMouseUp = (upEvt: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      const finalDelta = upEvt.clientY - startY;
      const elapsed = Math.max(1, Date.now() - startTime);
      const velocity = finalDelta / elapsed;

      if (finalDelta > 110 || velocity > 0.4) {
        handleClose();
      } else {
        setDragY(0);
        setIsDraggingSheet(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handlePlayToggle = () => {
    if (!activeTrack) {
      playTrack(DEFAULT_FALLBACK_TRACK);
    } else {
      togglePlay();
    }
  };

  return (
    <div
      className="apple-split-player-locked"
      data-theme="dark"
      role="dialog"
      aria-modal="true"
      aria-label="Apple Music Now Playing"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: isClosing
          ? 'translateY(100%)'
          : isDraggingSheet
          ? `translateY(${dragY}px) scale(${Math.max(0.92, 1 - (dragY / (typeof window !== 'undefined' ? window.innerHeight : 800)) * 0.08)})`
          : isMounted
          ? 'translateY(0%)'
          : 'translateY(100%)',
        transition: isDraggingSheet
          ? 'none'
          : 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.38s ease, scale 0.38s ease',
        borderTopLeftRadius: dragY > 0 ? `${Math.min(32, 16 + dragY * 0.1)}px` : undefined,
        borderTopRightRadius: dragY > 0 ? `${Math.min(32, 16 + dragY * 0.1)}px` : undefined,
        overflow: 'hidden',
        willChange: 'transform'
      }}
    >
      {/* ========================================================
          1. FLUID ANIMATED GLOW BLUR BACKGROUND
         ======================================================== */}
      <div className="glow-mesh-backdrop" aria-hidden="true">
        <div
          className="glow-base-gradient"
          style={{
            background: `radial-gradient(ellipse at 35% 45%, ${palette.c1} 0%, ${palette.c2} 48%, ${palette.c4} 85%, #050507 100%)`
          }}
        />

        <div
          className="fluid-glow-orb orb-pos-1"
          style={{
            backgroundColor: palette.c1,
            boxShadow: `0 0 180px 120px ${palette.c1}`
          }}
        />
        <div
          className="fluid-glow-orb orb-pos-2"
          style={{
            backgroundColor: palette.c3,
            boxShadow: `0 0 200px 140px ${palette.c3}`
          }}
        />
        <div
          className="fluid-glow-orb orb-pos-3"
          style={{
            backgroundColor: palette.c2,
            boxShadow: `0 0 220px 160px ${palette.c2}`
          }}
        />
        <div
          className="fluid-glow-orb orb-pos-4"
          style={{
            backgroundColor: palette.c1,
            boxShadow: `0 0 160px 100px ${palette.c1}`
          }}
        />

        <div className="glow-vignette-film" />
      </div>

      {/* Toast Feedback */}
      {toastMessage && <div className="apple-player-toast">{toastMessage}</div>}

      {/* ========================================================
          2. TOP HEADER (✕ Close Button & Centered Mobile Chevron)
         ======================================================== */}
      <div className="apple-top-nav-bar" onMouseDown={handleMouseDownHeader}>
        <button
          className="apple-close-btn"
          onClick={handleClose}
          title="Close Player (Esc)"
          aria-label="Close"
        >
          <X size={24} strokeWidth={2.4} />
        </button>

        <button
          className="apple-mobile-chevron-btn"
          onClick={handleClose}
          title="Collapse Player"
          aria-label="Collapse"
        >
          <ChevronDown size={28} color="rgba(255, 255, 255, 0.75)" />
        </button>

        <div className="apple-drag-indicator">
          <div className="dots-row">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
          <div className="pill-bar" />
        </div>

        <div className="top-right-placeholder" style={{ width: 40 }} />
      </div>

      {/* ========================================================
          3. RIGID LOCKED TWO-COLUMN SPLIT GRID (No shifting!)
         ======================================================== */}
      <div className="apple-locked-grid">
        {/* ========================================================
            LEFT COLUMN: FULLY LOCKED ARTWORK & CONTROLS
           ======================================================== */}
        <div className="apple-locked-left-section">
          <div className="apple-player-control-box">
            {/* Stage: 1:1 Large Artwork OR In-place Synchronized Lyrics OR In-place Queue List on mobile */}
            <div className="apple-stage-wrapper">
              {/* 1. Artwork */}
              <div
                className={`artwork-stage-locked ${isPlaying ? 'is-playing' : 'is-paused'} ${mobileStageMode !== 'artwork' ? 'mobile-hidden' : ''}`}
                onClick={() => setMobileStageMode('lyrics')}
                title="Tap for Live Lyrics"
              >
                <img
                  src={track.artworkUrl}
                  alt={track.title}
                  className="artwork-image-locked"
                  loading="eager"
                />
              </div>

              {/* 2. Realtime Synchronized Lyrics in-place */}
              {mobileStageMode === 'lyrics' && (
                <div className="mobile-lyrics-stage" ref={lyricsScrollRef}>
                  {lyricsLoading ? (
                    <div className="lyrics-loading-box">
                      <Loader2 size={32} className="apple-spin" />
                      <span>Connecting to realtime lyrics stream...</span>
                    </div>
                  ) : lyricsData.lines.length === 0 ? (
                    <div className="lyrics-empty-box" onClick={() => setMobileStageMode('artwork')}>
                      <Music2 size={36} opacity={0.4} />
                      <span>Lyrics not available for this track</span>
                      <span className="tap-back-hint">Tap to view artwork</span>
                    </div>
                  ) : (
                    <div className="mobile-lyrics-stack">
                      {lyricsData.lines.map((line, idx) => {
                        const isActive = idx === currentLineIndex;
                        const isPast = idx < currentLineIndex;

                        return (
                          <div
                            key={`${idx}-${line.time}`}
                            data-line-index={idx}
                            className={`mobile-lyric-line ${isActive ? 'line-active' : isPast ? 'line-past' : 'line-future'}`}
                            onClick={() => seek(line.time)}
                          >
                            <span>{line.text || '♪ ♪ ♪'}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Playing Next Queue in-place (Desktop-style cards inside mobile stage) */}
              {mobileStageMode === 'queue' && (
                <div className="mobile-queue-stage">
                  <div className="mobile-queue-header-row">
                    <span className="mobile-queue-title-heading">Playing Next</span>
                    <span className="mobile-queue-count">{queue.slice(queueIndex + 1).length} tracks</span>
                  </div>
                  <div className="mobile-queue-items-list">
                    {queue.slice(queueIndex + 1).length === 0 ? (
                      <div className="mobile-queue-empty" onClick={() => setMobileStageMode('artwork')}>
                        <ListMusic size={36} opacity={0.4} />
                        <span>No upcoming songs in queue</span>
                        <span className="tap-back-hint">Tap to view artwork</span>
                      </div>
                    ) : (
                      queue.slice(queueIndex + 1).map((qTrack, qIdx) => (
                        <div
                          key={`${qTrack.id}-${qIdx}`}
                          className="mobile-queue-card"
                          onClick={() => {
                            playTrack(qTrack);
                            showToast(`Playing: ${qTrack.title}`);
                          }}
                        >
                          <img src={qTrack.artworkUrl} alt={qTrack.title} className="mobile-q-thumb" loading="lazy" />
                          <div className="mobile-q-meta">
                            <span className="mobile-q-title">{qTrack.title}</span>
                            <span className="mobile-q-artist">{qTrack.artists.join(', ')}</span>
                          </div>
                          {qTrack.durationFormatted && (
                            <span className="mobile-q-dur">{qTrack.durationFormatted}</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Song Title, Artist Subtitle, Star & 3-dots */}
            <div className="metadata-row-locked">
              <div className="titles-block-locked">
                <h1 className="song-title-locked" title={track.title}>
                  {track.title}
                </h1>
                <div
                  className="song-artist-locked"
                  title={`${track.artists.join(', ')} — ${track.album || track.title}`}
                  onClick={() => {
                    if (onNavigate && track.artists[0]) {
                      handleClose();
                      onNavigate('artist', track.artists[0]);
                    }
                  }}
                >
                  {track.artists.join(', ')}
                </div>
              </div>

              {/* Action Buttons: Star + 3-dots */}
              <div className="action-buttons-locked">
                <button
                  className={`star-round-btn ${isLiked ? 'is-liked' : ''}`}
                  onClick={() => {
                    const next = !isLiked;
                    setIsLiked(next);
                    showToast(next ? 'Added to Favorite Songs' : 'Removed from Favorites');
                  }}
                  title={isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
                  aria-label="Favorite"
                >
                  <Star
                    size={19}
                    fill={isLiked ? '#ffffff' : 'none'}
                    color="#ffffff"
                    strokeWidth={1.8}
                  />
                </button>

                <div className="apple-more-anchor" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="more-round-btn"
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    title="More Options"
                    aria-label="More options"
                  >
                    <MoreHorizontal size={20} color="#ffffff" />
                  </button>

                  {showMoreMenu && (
                    <div className="apple-more-popover">
                      <button
                        className="popover-btn"
                        onClick={() => {
                          playNext(track);
                          setShowMoreMenu(false);
                          showToast('Playing next');
                        }}
                      >
                        <ListPlus size={15} />
                        <span>Play Next</span>
                      </button>
                      <button
                        className="popover-btn"
                        onClick={() => {
                          addToQueue(track);
                          setShowMoreMenu(false);
                          showToast('Added to queue');
                        }}
                      >
                        <Plus size={15} />
                        <span>Add to Queue</span>
                      </button>
                      {track.artists[0] && onNavigate && (
                        <button
                          className="popover-btn"
                          onClick={() => {
                            handleClose();
                            onNavigate('artist', track.artists[0]);
                          }}
                        >
                          <Star size={15} />
                          <span>Go to {track.artists[0]}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scrubber Rail (Apple Music continuous capsule, NO dots/thumbs) */}
            <div className="scrubber-block-locked">
              <div
                className={`scrubber-rail-locked ${isDraggingScrubber ? 'active-drag' : ''}`}
                ref={scrubberRailRef}
                onMouseDown={handleScrubberMouseDown}
                title="Seek"
              >
                <div
                  className="scrubber-fill-locked"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="time-row-locked">
                <span className="time-label">{formatTime(currentTime)}</span>
                <span className="time-label">-{formatTime(remainingTime)}</span>
              </div>
            </div>

            {/* Transport Playback Buttons (Larger Authentic Apple Music Icons) */}
            <div className="transport-row-locked">
              <button
                className={`shuffle-box-btn ${isShuffle ? 'active-shuffle' : ''}`}
                onClick={toggleShuffle}
                title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
                aria-label="Shuffle"
              >
                <AppleShuffleIcon size={20} active={isShuffle} />
              </button>

              <button
                className="apple-music-skip-btn"
                onClick={prevTrack}
                title="Previous Track"
                aria-label="Previous"
              >
                <AppleRewindIcon size={34} />
              </button>

              <button
                className="apple-music-playpause-btn"
                onClick={handlePlayToggle}
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isBuffering && !isPlaying ? (
                  <Loader2 size={40} className="apple-spin" color="#ffffff" />
                ) : isPlaying ? (
                  <ApplePauseIcon size={40} />
                ) : (
                  <ApplePlayIcon size={40} />
                )}
              </button>

              <button
                className="apple-music-skip-btn"
                onClick={nextTrack}
                title="Next Track"
                aria-label="Next"
              >
                <AppleForwardIcon size={34} />
              </button>

              <button
                className={`repeat-box-btn ${repeatMode !== 'off' ? 'active-repeat' : ''}`}
                onClick={cycleRepeat}
                title={`Repeat: ${repeatMode}`}
                aria-label="Repeat"
              >
                <AppleRepeatIcon size={20} mode={repeatMode} />
              </button>
            </div>

            {/* Volume Slider Row (Continuous capsule, NO dots/thumbs) */}
            <div className="volume-row-locked">
              <button
                className="volume-icon-btn"
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={17} color="rgba(255, 255, 255, 0.65)" />
                ) : (
                  <Volume1 size={17} color="rgba(255, 255, 255, 0.65)" />
                )}
              </button>

              <div
                className={`volume-rail-locked ${isDraggingVolume ? 'active-drag' : ''}`}
                ref={volumeRailRef}
                onMouseDown={handleVolumeMouseDown}
                title="Volume"
              >
                <div
                  className="volume-fill-locked"
                  style={{ width: `${volumePercent}%` }}
                />
              </div>

              <button
                className="volume-icon-btn"
                onClick={() => setVolume(1)}
                title="Max Volume"
              >
                <Volume2 size={17} color="rgba(255, 255, 255, 0.65)" />
              </button>
            </div>

            {/* Bottom Row: AirPlay icon matching reference (Desktop) */}
            <div className="bottom-airplay-row">
              <button
                className="airplay-btn"
                onClick={() => showToast('AirPlay Output: Nocturne Hi-Res Lossless')}
                title="AirPlay & Audio Output"
              >
                <Cast size={18} />
              </button>
            </div>

            {/* Mobile Bottom Toolbar: Lyrics on left, AirPlay center, Queue on right (Exact screenshot layout) */}
            <div className="mobile-bottom-bar">
              <button
                className={`mobile-bar-btn ${mobileStageMode === 'lyrics' ? 'active-btn' : ''}`}
                onClick={() => setMobileStageMode(mobileStageMode === 'lyrics' ? 'artwork' : 'lyrics')}
                title={mobileStageMode === 'lyrics' ? 'View Artwork' : 'View Lyrics'}
                aria-label="Toggle Lyrics"
              >
                <MessageSquareQuote size={22} />
              </button>

              <button
                className="mobile-bar-btn"
                onClick={() => showToast('Audio Output: Nocturne Hi-Res Lossless')}
                title="AirPlay"
                aria-label="AirPlay"
              >
                <Cast size={20} />
              </button>

              <button
                className={`mobile-bar-btn ${mobileStageMode === 'queue' ? 'active-btn' : ''}`}
                onClick={() => setMobileStageMode(mobileStageMode === 'queue' ? 'artwork' : 'queue')}
                title={mobileStageMode === 'queue' ? 'View Artwork' : 'View Queue'}
                aria-label="Toggle Queue"
              >
                <ListMusic size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: LIVE SYNCHRONIZED LYRICS (Isolated scroll)
           ======================================================== */}
        <div className="apple-locked-right-section">
          {/* Top Right Apple Music Sing Karaoke Button */}
          <div className="right-top-controls">
            <button
              className={`apple-sing-btn ${isSingModeActive ? 'sing-on' : ''}`}
              onClick={() => {
                const next = !isSingModeActive;
                setIsSingModeActive(next);
                showToast(next ? 'Apple Music Sing Activated' : 'Apple Music Sing Off');
              }}
              title="Apple Music Sing"
              aria-label="Sing Karaoke"
            >
              <Mic2 size={18} />
              <Sparkles size={12} className="sing-star" />
            </button>
          </div>

          {/* Independent Scrolling Lyrics Container */}
          {rightPanelMode === 'lyrics' ? (
            <div className="lyrics-scroll-container" ref={lyricsScrollRef}>
              {lyricsLoading ? (
                <div className="lyrics-loading-box">
                  <Loader2 size={36} className="apple-spin" />
                  <span>Connecting to realtime lyrics stream...</span>
                </div>
              ) : lyricsData.lines.length === 0 ? (
                <div className="lyrics-empty-box">
                  <Music2 size={40} opacity={0.4} />
                  <span>Realtime lyrics not available for this track</span>
                </div>
              ) : (
                <div className="lyrics-lines-stack">
                  {lyricsData.lines.map((line, idx) => {
                    const isActive = idx === currentLineIndex;
                    const isPast = idx < currentLineIndex;

                    return (
                      <div
                        key={`${idx}-${line.time}`}
                        data-line-index={idx}
                        className={`lyric-line-box ${isActive ? 'line-active' : isPast ? 'line-past' : 'line-future'}`}
                        onClick={() => seek(line.time)}
                      >
                        <span className="lyric-text">{line.text || '♪ ♪ ♪'}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Queue List Panel */
            <div className="queue-scroll-container">
              <h2 className="queue-title-heading">Playing Next</h2>
              <div className="queue-items-list">
                {queue.slice(queueIndex + 1).map((qTrack, qIdx) => (
                  <div
                    key={`${qTrack.id}-${qIdx}`}
                    className="queue-track-card"
                    onClick={() => playTrack(qTrack)}
                  >
                    <img src={qTrack.artworkUrl} alt={qTrack.title} className="q-thumb" />
                    <div className="q-meta">
                      <span className="q-title">{qTrack.title}</span>
                      <span className="q-artist">{qTrack.artists.join(', ')}</span>
                    </div>
                    <span className="q-dur">{qTrack.durationFormatted}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Right Toolbar */}
          <div className="right-bottom-toolbar">
            <button
              className={`toolbar-btn ${rightPanelMode === 'lyrics' ? 'active-view' : ''}`}
              onClick={() => setRightPanelMode('lyrics')}
              title="Lyrics View"
              aria-label="Lyrics"
            >
              <MessageSquareQuote size={20} />
            </button>

            <button
              className={`toolbar-btn ${rightPanelMode === 'queue' ? 'active-view' : ''}`}
              onClick={() => setRightPanelMode('queue')}
              title="Playing Next Queue"
              aria-label="Queue"
            >
              <ListMusic size={21} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* ========================================================
           FULL-SCREEN LOCKED WRAPPER
           ======================================================== */
        .apple-split-player-locked {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-color: #0b0a0c;
          user-select: none;
        }

        /* Fluid Animated Ambient Background */
        .glow-mesh-backdrop {
          position: absolute;
          inset: -15%;
          width: 130%;
          height: 130%;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        .glow-base-gradient {
          position: absolute;
          inset: 0;
          opacity: 0.94;
          transition: background 1.5s ease;
        }

        .fluid-glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(95px);
          opacity: 0.84;
          mix-blend-mode: screen;
          will-change: transform;
          pointer-events: none;
        }

        .orb-pos-1 {
          width: 500px;
          height: 500px;
          top: 15%;
          left: 15%;
          animation: orbDrift1 18s ease-in-out infinite alternate;
        }

        .orb-pos-2 {
          width: 560px;
          height: 560px;
          top: 25%;
          right: 15%;
          animation: orbDrift2 22s ease-in-out infinite alternate;
        }

        .orb-pos-3 {
          width: 520px;
          height: 520px;
          bottom: 12%;
          left: 30%;
          animation: orbDrift3 16s ease-in-out infinite alternate;
        }

        .orb-pos-4 {
          width: 400px;
          height: 400px;
          top: 48%;
          right: 32%;
          animation: orbDrift4 20s ease-in-out infinite alternate;
        }

        @keyframes orbDrift1 {
          0% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
          50% { transform: translate3d(80px, -60px, 0) scale(1.2) rotate(140deg); }
          100% { transform: translate3d(-50px, 70px, 0) scale(0.92) rotate(320deg); }
        }

        @keyframes orbDrift2 {
          0% { transform: translate3d(0, 0, 0) scale(1.1) rotate(0deg); }
          50% { transform: translate3d(-90px, 80px, 0) scale(0.85) rotate(-150deg); }
          100% { transform: translate3d(70px, -60px, 0) scale(1.25) rotate(-300deg); }
        }

        @keyframes orbDrift3 {
          0% { transform: translate3d(0, 0, 0) scale(0.95); }
          50% { transform: translate3d(80px, 50px, 0) scale(1.3); }
          100% { transform: translate3d(-60px, -50px, 0) scale(1.05); }
        }

        @keyframes orbDrift4 {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-70px, -80px, 0) scale(1.18); }
          100% { transform: translate3d(60px, 60px, 0) scale(0.88); }
        }

        .glow-vignette-film {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(0, 0, 0, 0.05) 0%,
            rgba(0, 0, 0, 0.35) 75%,
            rgba(0, 0, 0, 0.8) 100%
          );
        }

        /* Top Header */
        .apple-top-nav-bar {
          position: relative;
          z-index: 10;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          flex-shrink: 0;
        }

        .apple-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.78);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s ease, transform 0.15s ease;
        }

        .apple-close-btn:hover {
          color: #ffffff;
          transform: scale(1.1);
        }

        .apple-drag-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .dots-row {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dots-row .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
        }

        .pill-bar {
          width: 36px;
          height: 4px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.25);
        }

        /* Toast */
        .apple-player-toast {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(24, 24, 28, 0.95);
          backdrop-filter: blur(24px);
          color: #ffffff;
          padding: 8px 20px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          z-index: 10000;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        /* ========================================================
           LOCKED TWO-COLUMN GRID
           ======================================================== */
        .apple-locked-grid {
          position: relative;
          z-index: 10;
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          padding: 8px 64px 32px;
          height: calc(100vh - 52px);
          min-height: 0;
          overflow: hidden;
        }

        .apple-stage-wrapper {
          width: 100%;
          position: relative;
          margin-bottom: 22px;
          flex-shrink: 0;
        }

        .mobile-lyrics-stage {
          display: none;
        }

        .mobile-queue-stage {
          display: none;
        }

        .apple-mobile-chevron-btn {
          display: none;
        }

        .mobile-bottom-bar {
          display: none;
        }

        @media (max-width: 900px) {
          .apple-top-nav-bar {
            height: 44px;
            padding: 8px 16px 0;
            justify-content: center;
          }

          .apple-close-btn,
          .apple-drag-indicator,
          .top-right-placeholder,
          .apple-locked-right-section,
          .bottom-airplay-row {
            display: none !important;
          }

          .apple-mobile-chevron-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            cursor: pointer;
            width: 44px;
            height: 36px;
            color: rgba(255, 255, 255, 0.7);
            transition: transform 0.15s ease, color 0.15s ease;
          }

          .apple-mobile-chevron-btn:hover {
            color: #ffffff;
            transform: translateY(2px);
          }

          /* Stationary background orbs on mobile for 60fps buttery smooth performance */
          .fluid-glow-orb {
            animation: none !important;
            filter: blur(50px) !important;
            opacity: 0.45 !important;
          }

          .apple-locked-grid {
            display: flex !important;
            flex-direction: column !important;
            height: calc(100vh - 48px - env(safe-area-inset-top, 0px)) !important;
            padding: 0 24px calc(16px + env(safe-area-inset-bottom, 0px)) !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
            gap: 0 !important;
          }

          .apple-locked-grid::-webkit-scrollbar {
            display: none !important;
          }

          .apple-locked-left-section {
            width: 100% !important;
            height: auto !important;
            min-height: 100% !important;
            max-width: 420px !important;
            margin: 0 auto !important;
            justify-content: space-between !important;
            overflow: visible !important;
          }

          .apple-player-control-box {
            width: 100% !important;
            height: auto !important;
            min-height: 100% !important;
            max-width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }

          /* Stage: Fixed Stable Deterministic Square (Zero Layout Thrashing) */
          .apple-stage-wrapper {
            width: min(320px, 76vw, 36vh) !important;
            height: min(320px, 76vw, 36vh) !important;
            aspect-ratio: 1 / 1 !important;
            margin: 6px auto 14px !important;
            position: relative !important;
            flex-shrink: 0 !important;
          }

          .artwork-stage-locked {
            width: 100% !important;
            height: 100% !important;
            margin-bottom: 0 !important;
            border-radius: 14px !important;
            cursor: pointer;
            will-change: transform;
            transform: translateZ(0);
          }

          .artwork-stage-locked.is-playing {
            transform: scale(1) translateZ(0) !important;
            box-shadow: 0 24px 50px -10px rgba(0, 0, 0, 0.70) !important;
          }

          .artwork-stage-locked.is-paused {
            transform: scale(0.88) translateZ(0) !important;
            box-shadow: 0 10px 24px -6px rgba(0, 0, 0, 0.45) !important;
          }

          .artwork-stage-locked.mobile-hidden {
            display: none !important;
          }

          /* Realtime Lyrics swapping directly into the thumbnail area */
          .mobile-lyrics-stage {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            border-radius: 14px;
            overflow-y: auto;
            scrollbar-width: none;
            padding: 16px 12px;
            mask-image: linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%);
            -webkit-mask-image: linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%);
            cursor: default;
          }

          .mobile-lyrics-stage::-webkit-scrollbar {
            display: none;
          }

          .mobile-lyrics-stack {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 30px 0;
          }

          .mobile-lyric-line {
            font-size: 20px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.35);
            filter: blur(0.6px);
            line-height: 1.35;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
            text-align: left;
            user-select: none;
          }

          .mobile-lyric-line.line-active {
            font-size: 24px;
            color: #ffffff !important;
            filter: none !important;
            transform: scale(1.05) translate3d(4px, 0, 0);
            text-shadow: 0 0 24px rgba(255, 255, 255, 0.65), 0 2px 8px rgba(0, 0, 0, 0.4);
          }

          .tap-back-hint {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 8px;
            text-decoration: underline;
            cursor: pointer;
          }

          /* Mobile In-Place Queue Stage (Desktop-Style Cards inside mobile stage) */
          .mobile-queue-stage {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            border-radius: 14px;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            overflow-y: auto;
            scrollbar-width: none;
            padding: 8px 4px 16px;
            mask-image: linear-gradient(180deg, transparent 0%, black 8%, black 92%, transparent 100%);
            -webkit-mask-image: linear-gradient(180deg, transparent 0%, black 8%, black 92%, transparent 100%);
            cursor: default;
            user-select: none;
            -webkit-overflow-scrolling: touch;
          }

          .mobile-queue-stage::-webkit-scrollbar {
            display: none;
          }

          .mobile-queue-header-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 8px 12px;
            flex-shrink: 0;
          }

          .mobile-queue-title-heading {
            font-size: 16px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.01em;
          }

          .mobile-queue-count {
            font-size: 12px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.45);
          }

          .mobile-queue-items-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-bottom: 20px;
          }

          .mobile-queue-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 10px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            cursor: pointer;
            transition: background-color 0.15s ease, transform 0.15s ease;
          }

          .mobile-queue-card:active {
            background: rgba(255, 255, 255, 0.18);
            transform: scale(0.98);
          }

          .mobile-q-thumb {
            width: 42px;
            height: 42px;
            border-radius: 6px;
            object-fit: cover;
            flex-shrink: 0;
            background: rgba(255, 255, 255, 0.1);
          }

          .mobile-q-meta {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
            text-align: left;
          }

          .mobile-q-title {
            font-size: 13.5px;
            font-weight: 600;
            color: #ffffff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.25;
          }

          .mobile-q-artist {
            font-size: 11.5px;
            color: rgba(255, 255, 255, 0.6);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;
          }

          .mobile-q-dur {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.45);
            font-variant-numeric: tabular-nums;
            flex-shrink: 0;
          }

          .mobile-queue-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 180px;
            gap: 10px;
            color: rgba(255, 255, 255, 0.45);
            font-size: 14px;
            font-weight: 500;
            padding: 24px 0;
            text-align: center;
          }

          /* Metadata */
          .metadata-row-locked {
            margin-bottom: 12px;
            gap: 12px;
          }

          .song-title-locked {
            font-size: 19px !important;
            font-weight: 700 !important;
          }

          .song-artist-locked {
            font-size: 14px !important;
          }

          .star-round-btn,
          .more-round-btn {
            width: 36px !important;
            height: 36px !important;
            background: rgba(255, 255, 255, 0.12) !important;
            border-radius: 50% !important;
          }

          /* Scrubber */
          .scrubber-block-locked {
            margin-bottom: 12px;
          }

          .scrubber-rail-locked {
            height: 4.5px !important;
          }

          /* Transport Controls: 3 buttons centered */
          .transport-row-locked {
            margin-bottom: 16px;
            gap: 40px !important;
            justify-content: center !important;
          }

          .shuffle-box-btn,
          .repeat-box-btn {
            display: none !important;
          }

          .apple-music-skip-btn {
            width: 48px !important;
            height: 48px !important;
          }

          .apple-music-playpause-btn {
            width: 60px !important;
            height: 60px !important;
          }

          /* Volume Row */
          .volume-row-locked {
            margin-bottom: 14px;
            gap: 12px !important;
          }

          .volume-rail-locked {
            height: 4.5px !important;
          }

          /* Mobile Bottom Toolbar */
          .mobile-bottom-bar {
            display: flex !important;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 2px 0 0;
            flex-shrink: 0;
          }

          .mobile-bar-btn {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.65);
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            -webkit-tap-highlight-color: transparent !important;
            outline: none !important;
            user-select: none;
          }

          .mobile-bar-btn:hover {
            color: #ffffff;
            transform: scale(1.06);
          }

          .mobile-bar-btn.active-btn {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.24);
            border-radius: 12px;
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.35);
          }
        }

        /* ========================================================
           LEFT COLUMN: FULLY LOCKED (NO MOVEMENT)
           ======================================================== */
        .apple-locked-left-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 0;
          height: 100%;
          overflow: hidden;
        }

        .apple-player-control-box {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
        }

        @media (max-height: 800px) {
          .apple-player-control-box {
            max-width: 360px;
          }
        }

        /* 1:1 Large Square Album Artwork with Apple Music receding pause animation */
        .artwork-stage-locked {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 22px;
          background-color: rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
          transform-origin: center center;
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease;
        }

        .artwork-stage-locked.is-playing {
          transform: scale(1);
          box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.72), 0 12px 28px -6px rgba(0, 0, 0, 0.45);
          opacity: 1;
        }

        .artwork-stage-locked.is-paused {
          transform: scale(0.84);
          box-shadow: 0 12px 26px -6px rgba(0, 0, 0, 0.45);
          opacity: 0.86;
        }

        .artwork-image-locked {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Song Metadata Row */
        .metadata-row-locked {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 16px;
          flex-shrink: 0;
        }

        .titles-block-locked {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .song-title-locked {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 18.5px;
          font-weight: 700;
          color: #ffffff !important;
          line-height: 1.25;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-artist-locked {
          font-size: 14.5px;
          color: rgba(255, 255, 255, 0.72) !important;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.15s ease;
        }

        .song-artist-locked:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        .action-buttons-locked {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .star-round-btn,
        .more-round-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.15s ease;
        }

        .star-round-btn:hover,
        .more-round-btn:hover {
          background: rgba(255, 255, 255, 0.18);
          transform: scale(1.08);
        }

        .apple-more-anchor {
          position: relative;
        }

        .apple-more-popover {
          position: absolute;
          bottom: calc(100% + 10px);
          right: 0;
          background: rgba(28, 28, 34, 0.94);
          backdrop-filter: blur(28px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 10px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.65);
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 180px;
          z-index: 100;
        }

        .popover-btn {
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
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.15s ease;
          text-align: left;
        }

        .popover-btn:hover {
          background-color: rgba(255, 255, 255, 0.12);
        }

        /* Scrubber Unit (Apple Music continuous capsule, NO dots/thumbs) */
        .scrubber-block-locked {
          width: 100%;
          margin-bottom: 22px;
          flex-shrink: 0;
        }

        .scrubber-rail-locked {
          position: relative;
          width: 100%;
          height: 5.5px;
          background: rgba(255, 255, 255, 0.20);
          border-radius: 9999px;
          cursor: pointer;
          transition: height 0.15s ease, background-color 0.15s ease;
          overflow: hidden;
        }

        .scrubber-rail-locked:hover,
        .scrubber-rail-locked.active-drag {
          height: 7px;
          background: rgba(255, 255, 255, 0.26);
        }

        .scrubber-fill-locked {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: #ffffff;
          border-radius: 9999px;
        }

        .scrubber-thumb-locked {
          display: none;
        }

        .time-row-locked {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }

        .time-label {
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.55);
          font-variant-numeric: tabular-nums;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        /* Transport Controls Row with Larger Authentic Apple Music Icons */
        .transport-row-locked {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          margin-bottom: 24px;
          flex-shrink: 0;
        }

        .shuffle-box-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.65);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s ease, transform 0.15s ease;
        }

        .shuffle-box-btn:hover {
          color: #ffffff;
          transform: scale(1.1);
        }

        .shuffle-box-btn.active-shuffle {
          color: #ffffff;
        }

        .apple-music-skip-btn {
          width: 50px;
          height: 50px;
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .apple-music-skip-btn:hover {
          transform: scale(1.12);
          opacity: 0.9;
        }

        .apple-music-playpause-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease;
        }

        .apple-music-playpause-btn:hover {
          transform: scale(1.08);
        }

        .repeat-box-btn {
          width: 38px;
          height: 38px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.65);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: color 0.15s ease, transform 0.15s ease;
        }

        .repeat-box-btn:hover {
          color: #ffffff;
          transform: scale(1.1);
        }

        .repeat-box-btn.active-repeat {
          color: #ffffff;
        }

        /* Volume Slider Row (Continuous capsule, NO dots/thumbs) */
        .volume-row-locked {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
          flex-shrink: 0;
        }

        .volume-icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          color: rgba(255, 255, 255, 0.65);
          transition: color 0.15s ease;
        }

        .volume-icon-btn:hover {
          color: #ffffff;
        }

        .volume-rail-locked {
          position: relative;
          flex: 1;
          height: 5.5px;
          background: rgba(255, 255, 255, 0.20);
          border-radius: 9999px;
          cursor: pointer;
          transition: height 0.15s ease, background-color 0.15s ease;
          overflow: hidden;
        }

        .volume-rail-locked:hover,
        .volume-rail-locked.active-drag {
          height: 7px;
          background: rgba(255, 255, 255, 0.26);
        }

        .volume-fill-locked {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.88);
          border-radius: 9999px;
        }

        .volume-thumb-locked {
          display: none;
        }

        .bottom-airplay-row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-shrink: 0;
        }

        .airplay-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.65);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: 50%;
          transition: color 0.15s ease;
        }

        .airplay-btn:hover {
          color: #ffffff;
        }

        /* ========================================================
           RIGHT COLUMN: LIVE SYNCHRONIZED LYRICS (LOCKED SCROLL)
           ======================================================== */
        .apple-locked-right-section {
          display: flex;
          flex-direction: column;
          position: relative;
          min-width: 0;
          height: 100%;
          overflow: hidden;
        }

        .right-top-controls {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 8px;
          flex-shrink: 0;
        }

        .apple-sing-btn {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(20px);
          transition: background-color 0.15s ease, transform 0.15s ease;
        }

        .apple-sing-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.08);
        }

        .apple-sing-btn.sing-on {
          background: #ffffff;
          color: #000000;
        }

        .sing-star {
          position: absolute;
          top: 6px;
          right: 6px;
          color: #ffd700;
        }

        /* Lyrics Scroll Container (Lenis smooth scroll + Apple Music vertical fade mask) */
        .lyrics-scroll-container {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 180px 28px 240px;
          overscroll-behavior: contain;
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 14%,
            black 86%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 14%,
            black 86%,
            transparent 100%
          );
        }

        .lyrics-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .lyrics-loading-box,
        .lyrics-empty-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 280px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 15px;
          gap: 14px;
          text-align: center;
        }

        .apple-spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .lyrics-lines-stack {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* Authentic Apple Music Kinetic Lyrics Line */
        .lyric-line-box {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 30px;
          font-weight: 700;
          line-height: 1.34;
          letter-spacing: -0.015em;
          color: rgba(255, 255, 255, 0.35);
          filter: blur(1.5px);
          cursor: pointer;
          transform-origin: left center;
          transform: scale(0.96) translate3d(0, 0, 0);
          transition: transform 0.6s cubic-bezier(0.2, 0.9, 0.3, 1),
                      color 0.5s ease,
                      filter 0.5s ease,
                      opacity 0.5s ease;
          border-radius: 10px;
          padding: 4px 6px;
          will-change: transform, filter, opacity;
          user-select: none;
        }

        @media (max-width: 1100px) {
          .lyric-line-box {
            font-size: 24px;
          }
        }

        .lyric-line-box:hover {
          color: rgba(255, 255, 255, 0.88);
          filter: blur(0px);
          transform: scale(1.02) translate3d(4px, 0, 0);
        }

        /* Active Line: Bold, pure white, glowing, scale expansion */
        .lyric-line-box.line-active {
          font-size: 34px;
          font-weight: 800;
          color: #ffffff;
          filter: blur(0px);
          opacity: 1;
          transform: scale(1.06) translate3d(8px, 0, 0);
          text-shadow: 0 0 25px rgba(255, 255, 255, 0.5), 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 1100px) {
          .lyric-line-box.line-active {
            font-size: 28px;
          }
        }

        .lyric-line-box.line-past {
          color: rgba(255, 255, 255, 0.38);
          filter: blur(1.2px);
          transform: scale(0.96) translate3d(0, 0, 0);
        }

        .lyric-text {
          display: inline-block;
        }

        /* Queue View */
        .queue-scroll-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px 8px 60px;
        }

        .queue-title-heading {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 16px;
        }

        .queue-items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .queue-track-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .queue-track-card:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .q-thumb {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          object-fit: cover;
        }

        .q-meta {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .q-title {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .q-artist {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .q-dur {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          font-variant-numeric: tabular-nums;
        }

        /* Bottom-Right Toolbar */
        .right-bottom-toolbar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
          padding-top: 10px;
          flex-shrink: 0;
        }

        .toolbar-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color 0.15s ease, transform 0.15s ease;
        }

        .toolbar-btn:hover {
          color: #ffffff;
          transform: scale(1.1);
        }

        .toolbar-btn.active-view {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
};
export default DedicatedPlayer;
