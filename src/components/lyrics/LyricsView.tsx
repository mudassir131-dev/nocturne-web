import React, { useEffect, useRef, useState } from 'react';
import { getTrackLyrics } from '../../services/lyrics/lyricsService';
import type { LyricsData } from '../../types/music';
import { usePlayer } from '../../context/PlayerContext';
import { Loader2, Music2 } from 'lucide-react';
import Lenis from 'lenis';

export const LyricsView: React.FC = () => {
  const { currentTrack, currentTime, seek } = usePlayer();
  const [lyricsData, setLyricsData] = useState<LyricsData>({
    found: false,
    isSynced: false,
    lines: []
  });
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Fetch lyrics whenever current track changes
  useEffect(() => {
    if (!currentTrack) return;

    let isMounted = true;
    setLoading(true);

    getTrackLyrics(currentTrack.title, currentTrack.artists[0], currentTrack.duration, currentTrack.id, currentTrack.album)
      .then(data => {
        if (isMounted) {
          setLyricsData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLyricsData({ found: false, isSynced: false, lines: [] });
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentTrack?.id]);

  // Find currently active lyric line index based on currentTime
  const currentLineIndex = React.useMemo(() => {
    if (!lyricsData.isSynced || lyricsData.lines.length === 0) return -1;
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

  // Initialize Lenis smooth scroller
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const lenis = new Lenis({
      wrapper: container,
      content: (container.firstElementChild as HTMLElement) || container,
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true
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
  }, [lyricsData.lines.length]);

  // Lenis auto-scroll to keep active line centered with Apple cubic easing
  useEffect(() => {
    if (activeLineRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeEl = activeLineRef.current;
      const targetTop = activeEl.offsetTop - (container.clientHeight / 2) + (activeEl.clientHeight / 2);
      const clampedTop = Math.max(0, targetTop);

      if (lenisRef.current) {
        lenisRef.current.scrollTo(clampedTop, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        container.scrollTo({ top: clampedTop, behavior: 'smooth' });
      }
    }
  }, [currentLineIndex]);

  const handleLineClick = (time: number) => {
    seek(time);
  };

  return (
    <div className="apple-lyrics-view" ref={scrollContainerRef}>
      {loading ? (
        <div className="lyrics-loading-state">
          <Loader2 size={32} className="spin-icon" />
          <p>Connecting to lyrics stream...</p>
        </div>
      ) : !lyricsData.found || lyricsData.lines.length === 0 ? (
        <div className="lyrics-empty-state">
          <div className="empty-icon-wrap">
            <Music2 size={36} />
          </div>
          <h3>No lyrics available</h3>
          <p>Lyrics haven't been provided for this track yet.</p>
        </div>
      ) : (
        <div className="lyrics-lines-wrapper">
          {lyricsData.lines.map((line, idx) => {
            const isActive = idx === currentLineIndex;
            const isPast = idx < currentLineIndex;

            return (
              <div
                key={`${idx}-${line.time}`}
                ref={isActive ? activeLineRef : null}
                className={`lyric-line ${isActive ? 'active' : ''} ${isPast ? 'past' : 'future'}`}
                onClick={() => handleLineClick(line.time)}
              >
                <span className="line-text">{line.text || '♪ ♪ ♪'}</span>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .apple-lyrics-view {
          height: 100%;
          width: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 80px 24px 120px;
          display: flex;
          flex-direction: column;
          user-select: none;
          scroll-behavior: smooth;
        }

        .lyrics-loading-state,
        .lyrics-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 300px;
          color: var(--text-secondary);
          text-align: center;
          gap: 12px;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
          color: var(--accent-red);
        }

        .empty-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-full);
          background-color: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          margin-bottom: 8px;
        }

        .lyrics-empty-state h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .lyrics-empty-state p {
          font-size: 14px;
          color: var(--text-secondary);
          max-width: 260px;
        }

        .lyrics-lines-wrapper {
          display: flex;
          flex-direction: column;
          gap: 28px;
          max-width: 700px;
          margin: 0 auto;
          width: 100%;
        }

        .lyric-line {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.35;
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
          padding: 6px 12px;
          will-change: transform, filter, opacity;
          user-select: none;
        }

        @media (max-width: 768px) {
          .lyric-line {
            font-size: 22px;
            gap: 20px;
          }
        }

        .lyric-line:hover {
          color: rgba(255, 255, 255, 0.88);
          filter: blur(0px);
          transform: scale(1.02) translate3d(4px, 0, 0);
        }

        .lyric-line.active {
          font-size: 32px;
          font-weight: 800;
          color: #ffffff;
          filter: blur(0px);
          transform: scale(1.06) translate3d(8px, 0, 0);
          text-shadow: 0 0 25px rgba(255, 255, 255, 0.5), 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .lyric-line.past {
          color: rgba(255, 255, 255, 0.38);
          filter: blur(1.2px);
          transform: scale(0.96) translate3d(0, 0, 0);
        }

        .line-text {
          display: inline-block;
        }
      `}</style>
    </div>
  );
};
