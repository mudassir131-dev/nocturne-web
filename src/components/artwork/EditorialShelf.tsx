import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import type { EditorialHero } from '../../data/appleMusicCatalog';
import { usePlayer } from '../../context/PlayerContext';
import { CURATED_PLAYLISTS, CURATED_ALBUMS } from '../../data/appleMusicCatalog';

interface EditorialShelfProps {
  heroes: EditorialHero[];
  onSelect: (type: 'playlist' | 'album' | 'station', targetId: string) => void;
}

export const EditorialShelf: React.FC<EditorialShelfProps> = ({ heroes, onSelect }) => {
  const [startIndex, setStartIndex] = useState(0);
  const { playTrack } = usePlayer();

  const visibleCount = 2; // Show 2 cards side by side on desktop

  const handlePrev = () => {
    setStartIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(heroes.length - visibleCount, prev + 1));
  };

  const handleQuickPlay = (e: React.MouseEvent, hero: EditorialHero) => {
    e.stopPropagation();
    if (hero.type === 'playlist') {
      const pl = CURATED_PLAYLISTS.find(p => p.id === hero.targetId);
      if (pl && pl.tracks.length > 0) {
        playTrack(pl.tracks[0], pl.tracks);
      }
    } else if (hero.type === 'album') {
      const alb = CURATED_ALBUMS.find(a => a.id === hero.targetId);
      if (alb && alb.tracks.length > 0) {
        playTrack(alb.tracks[0], alb.tracks);
      }
    }
  };

  return (
    <div className="apple-editorial-shelf">
      {/* Floating Left/Right Carousel Arrows on the side of the cards */}
      {startIndex > 0 && (
        <button
          className="shelf-carousel-nav-btn shelf-carousel-prev"
          onClick={handlePrev}
          aria-label="Previous Page"
        >
          <ChevronLeft size={22} strokeWidth={2.2} />
        </button>
      )}

      {startIndex < heroes.length - visibleCount && (
        <button
          className="shelf-carousel-nav-btn shelf-carousel-next"
          onClick={handleNext}
          aria-label="Next Page"
        >
          <ChevronRight size={22} strokeWidth={2.2} />
        </button>
      )}

      <div className="editorial-cards-row">
        {heroes.map((hero, idx) => {
          const isVisibleOnDesktop = idx >= startIndex && idx < startIndex + visibleCount;
          return (
            <div
              key={hero.id}
              className={`editorial-card ${isVisibleOnDesktop ? 'desktop-visible' : 'desktop-hidden'}`}
              onClick={() => onSelect(hero.type, hero.targetId)}
            >
            {/* Header info */}
            <div className="editorial-card-info">
              <span className="editorial-eyebrow">{hero.eyebrow}</span>
              <h2 className="editorial-title">{hero.title}</h2>
              <span className="editorial-subtitle">{hero.subtitle}</span>
            </div>

            {/* Artwork Banner Container */}
            <div className="editorial-artwork-container">
              <img
                src={hero.artworkUrl}
                alt={hero.title}
                className="editorial-banner-img"
                loading="eager"
              />

              {/* Bottom text & play button or album cover badge */}
              <div className="editorial-bottom-overlay">
                <span className="editorial-desc">{hero.description}</span>

                {hero.coverArtworkUrl ? (
                  <div
                    className="editorial-cover-badge-wrap"
                    onClick={(e) => handleQuickPlay(e, hero)}
                    title={`Play ${hero.title}`}
                  >
                    <img
                      src={hero.coverArtworkUrl}
                      alt={hero.title}
                      className="editorial-cover-badge-img"
                    />
                  </div>
                ) : (
                  <button
                    className="editorial-platter-play-btn"
                    onClick={(e) => handleQuickPlay(e, hero)}
                    aria-label={`Play ${hero.title}`}
                  >
                    <Play size={16} fill="currentColor" color="currentColor" style={{ marginLeft: 2 }} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>

      <style>{`
        .apple-editorial-shelf {
          position: relative;
          margin-bottom: 36px;
        }

        .shelf-carousel-nav-btn {
          position: absolute;
          top: 60%;
          transform: translateY(-50%);
          width: 32px;
          height: 56px;
          border-radius: 8px;
          background: rgba(20, 20, 24, 0.85);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
          transition: background-color 0.15s ease, transform 0.15s ease;
        }

        .shelf-carousel-nav-btn:hover {
          background: rgba(45, 45, 54, 0.95);
          transform: translateY(-50%) scale(1.05);
        }

        .shelf-carousel-prev {
          left: -16px;
        }

        .shelf-carousel-next {
          right: -16px;
        }

        .editorial-cards-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .editorial-card.desktop-hidden {
          display: none;
        }

        @media (max-width: 800px) {
          .editorial-card.desktop-hidden {
            display: flex !important;
          }
          .editorial-cards-row {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            gap: 14px;
            margin-left: -14px;
            margin-right: -14px;
            padding: 2px 14px 14px;
          }
          .editorial-cards-row::-webkit-scrollbar {
            display: none !important;
          }
          .editorial-card {
            flex: 0 0 86%;
            min-width: 260px;
            scroll-snap-align: start;
          }
          .shelf-carousel-nav-btn {
            display: none !important;
          }
        }

        .editorial-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          user-select: none;
        }

        .editorial-card-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .editorial-eyebrow {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.48);
        }

        .editorial-title {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #ffffff;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .editorial-subtitle {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.62);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .editorial-artwork-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1.74 / 1;
          border-radius: 10px;
          overflow: hidden;
          background-color: transparent;
          border: none !important;
          outline: none !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
        }

        .editorial-banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .editorial-card:hover .editorial-banner-img {
          transform: scale(1.02);
        }

        .editorial-bottom-overlay {
          position: absolute;
          inset: auto 0 0 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%);
          padding: 16px 18px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }

        .editorial-desc {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.35;
          max-width: 80%;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .editorial-platter-play-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background-color: rgba(255, 255, 255, 0.95);
          color: #000000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: none;
          cursor: pointer;
          transition: transform var(--transition-fast), background-color var(--transition-fast);
        }

        .editorial-platter-play-btn:hover {
          transform: scale(1.08);
          background-color: #ffffff;
        }

        .editorial-cover-badge-wrap {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.28);
          flex-shrink: 0;
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .editorial-cover-badge-wrap:hover {
          transform: scale(1.08);
        }

        .editorial-cover-badge-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>
    </div>
  );
};
