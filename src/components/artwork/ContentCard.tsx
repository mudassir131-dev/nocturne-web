import React, { useState } from 'react';
import { Play, MoreHorizontal, ListPlus, Plus, Heart } from 'lucide-react';

interface ContentCardProps {
  id: string;
  title: string;
  subtitle: string;
  artworkUrl: string;
  type?: 'album' | 'playlist' | 'track' | 'artist';
  explicit?: boolean;
  badge?: string;
  onClick: () => void;
  onPlayClick?: (e: React.MouseEvent) => void;
  onAddToQueue?: () => void;
  onPlayNext?: () => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  artworkUrl,
  type = 'album',
  explicit,
  badge,
  onClick,
  onPlayClick,
  onAddToQueue,
  onPlayNext
}) => {
  const isArtist = type === 'artist';
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [currentImg, setCurrentImg] = useState<string>(artworkUrl);

  React.useEffect(() => {
    setCurrentImg(artworkUrl);
  }, [artworkUrl]);

  const handleImageError = async () => {
    try {
      const res = await fetch(`/api/music/artwork?q=${encodeURIComponent(`${title} ${subtitle}`)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.artworkUrl && data.artworkUrl !== currentImg) {
          setCurrentImg(data.artworkUrl);
        }
      }
    } catch {
      // Keep existing
    }
  };

  return (
    <div
      className={`apple-content-card ${isArtist ? 'card-artist' : ''}`}
      onClick={onClick}
    >
      {/* 1:1 Square Artwork Container with Hover Overlays */}
      <div className="card-artwork-wrapper">
        <img
          src={currentImg}
          alt={title}
          className="card-artwork-img"
          loading="lazy"
          onError={handleImageError}
        />

        {/* Hover Action Buttons: Play on bottom-left, ... on bottom-right */}
        {!isArtist && (
          <div className="card-hover-actions">
            {onPlayClick && (
              <button
                className="card-btn-play-left"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayClick(e);
                }}
                aria-label={`Play ${title}`}
                title="Play"
              >
                <Play size={16} fill="#ffffff" color="#ffffff" style={{ marginLeft: 2 }} />
              </button>
            )}

            <div className="card-more-anchor" onClick={(e) => e.stopPropagation()}>
              <button
                className="card-btn-more-right"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={`More options for ${title}`}
                title="More"
              >
                <MoreHorizontal size={16} color="#ffffff" />
              </button>

              {menuOpen && (
                <div className="card-popover-menu" onClick={(e) => e.stopPropagation()}>
                  {onPlayNext && (
                    <button
                      className="popover-item"
                      onClick={() => {
                        onPlayNext();
                        setMenuOpen(false);
                      }}
                    >
                      <ListPlus size={14} />
                      <span>Play Next</span>
                    </button>
                  )}
                  {onAddToQueue && (
                    <button
                      className="popover-item"
                      onClick={() => {
                        onAddToQueue();
                        setMenuOpen(false);
                      }}
                    >
                      <Plus size={14} />
                      <span>Add to Queue</span>
                    </button>
                  )}
                  <button
                    className="popover-item"
                    onClick={() => {
                      setIsLiked(!isLiked);
                      setMenuOpen(false);
                    }}
                  >
                    <Heart
                      size={14}
                      fill={isLiked ? 'var(--accent-red)' : 'none'}
                      color={isLiked ? 'var(--accent-red)' : 'currentColor'}
                    />
                    <span>{isLiked ? 'Loved' : 'Love'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Metadata Text: Title (with [E] and [badge]) + Subtitle */}
      <div className="card-meta">
        <div className="card-title-row">
          <span className="card-title" title={title}>
            {title}
          </span>
          {explicit && <span className="badge-explicit">E</span>}
          {badge && <span className="badge-custom-pill">{badge}</span>}
        </div>
        <div className="card-subtitle" title={subtitle}>
          {subtitle}
        </div>
      </div>

      <style>{`
        .apple-content-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          cursor: pointer;
          user-select: none;
          min-width: 0;
          position: relative;
        }

        /* 1:1 Aspect Ratio Artwork Container */
        .card-artwork-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 8px;
          overflow: hidden;
          background-color: transparent !important;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
          border: none !important;
          outline: none !important;
        }

        .card-artist .card-artwork-wrapper {
          border-radius: 50%;
        }

        .card-artwork-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border: none !important;
          outline: none !important;
        }

        /* Active focus state when hovered */
        .apple-content-card:hover .card-artwork-wrapper {
          border: none !important;
          outline: none !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.24);
        }

        /* Hover Overlay Buttons */
        .card-hover-actions {
          position: absolute;
          inset: 0;
          padding: 8px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease;
          background: linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.45) 100%);
        }

        .apple-content-card:hover .card-hover-actions {
          opacity: 1;
          pointer-events: auto;
        }

        /* Bottom-left play button */
        .card-btn-play-left {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          transition: transform 0.15s ease, background-color 0.15s ease;
        }

        .card-btn-play-left:hover {
          transform: scale(1.08);
          background-color: rgba(0, 0, 0, 0.9);
        }

        /* Bottom-right ... button */
        .card-more-anchor {
          position: relative;
        }

        .card-btn-more-right {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          transition: transform 0.15s ease, background-color 0.15s ease;
        }

        .card-btn-more-right:hover {
          transform: scale(1.08);
          background-color: rgba(0, 0, 0, 0.9);
        }

        /* Popover Menu */
        .card-popover-menu {
          position: absolute;
          bottom: calc(100% + 8px);
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
          min-width: 150px;
          backdrop-filter: blur(20px);
        }

        .popover-item {
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

        .popover-item:hover {
          background-color: var(--bg-hover);
        }

        /* Card Text Metadata */
        .card-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .card-title-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 6px;
        }

        .card-title {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .apple-content-card:hover .card-title {
          text-decoration: underline;
        }

        .badge-explicit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 700;
          color: var(--text-secondary);
          background-color: var(--bg-hover);
          border-radius: 2px;
          padding: 1px 4px;
          line-height: 1.1;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .badge-custom-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--text-primary);
          background: var(--bg-hover);
          border: 1px solid var(--border-subtle);
          border-radius: 3px;
          padding: 1px 5px;
          line-height: 1.1;
          flex-shrink: 0;
          text-transform: uppercase;
        }

        .card-subtitle {
          font-size: 12.5px;
          font-weight: 400;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }

        .card-artist .card-meta {
          align-items: center;
          text-align: center;
        }
      `}</style>
    </div>
  );
};
