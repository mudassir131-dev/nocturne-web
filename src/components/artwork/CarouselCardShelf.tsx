import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentCard } from './ContentCard';

export interface CarouselCardItem {
  id: string;
  title: string;
  subtitle: string;
  artworkUrl: string;
  explicit?: boolean;
  badge?: string;
  type?: 'album' | 'playlist' | 'track' | 'artist';
}

interface CarouselCardShelfProps {
  title: string;
  items: CarouselCardItem[];
  onTitleClick?: () => void;
  onItemClick: (item: CarouselCardItem) => void;
  onPlayClick?: (item: CarouselCardItem) => void;
  onPlayNext?: (item: CarouselCardItem) => void;
  onAddToQueue?: (item: CarouselCardItem) => void;
}

export const CarouselCardShelf: React.FC<CarouselCardShelfProps> = ({
  title,
  items,
  onTitleClick,
  onItemClick,
  onPlayClick,
  onPlayNext,
  onAddToQueue
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScrollState();
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);

    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [items]);

  const handleScrollNext = () => {
    if (!scrollRef.current) return;
    const containerWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: containerWidth * 0.75, behavior: 'smooth' });
  };

  const handleScrollPrev = () => {
    if (!scrollRef.current) return;
    const containerWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: -containerWidth * 0.75, behavior: 'smooth' });
  };

  return (
    <section className="apple-carousel-shelf">
      {/* Header: "New This Week >" */}
      <div className="shelf-header">
        <div className="shelf-title-wrap" onClick={onTitleClick}>
          <h2 className="shelf-title">{title}</h2>
          <ChevronRight size={18} className="shelf-title-chevron" />
        </div>
      </div>

      {/* Relative wrapper for floating chevrons */}
      <div className="shelf-relative-container">
        {/* Floating Left Chevron */}
        {canScrollLeft && (
          <button
            className="shelf-floating-nav shelf-floating-prev"
            onClick={handleScrollPrev}
            aria-label="Previous items"
          >
            <ChevronLeft size={20} strokeWidth={2.4} />
          </button>
        )}

        {/* Floating Right Chevron (matches user screenshot) */}
        {canScrollRight && (
          <button
            className="shelf-floating-nav shelf-floating-next"
            onClick={handleScrollNext}
            aria-label="Next items"
          >
            <ChevronRight size={20} strokeWidth={2.4} />
          </button>
        )}

        {/* Horizontal Scrollable Row of 1:1 Cards */}
        <div className="shelf-cards-row" ref={scrollRef}>
          {items.map((item) => (
            <div key={item.id} className="shelf-card-col">
              <ContentCard
                id={item.id}
                title={item.title}
                subtitle={item.subtitle}
                artworkUrl={item.artworkUrl}
                type={item.type || 'album'}
                explicit={item.explicit}
                badge={item.badge}
                onClick={() => onItemClick(item)}
                onPlayClick={onPlayClick ? () => onPlayClick(item) : undefined}
                onPlayNext={onPlayNext ? () => onPlayNext(item) : undefined}
                onAddToQueue={onAddToQueue ? () => onAddToQueue(item) : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .apple-carousel-shelf {
          margin-bottom: 48px;
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

        .shelf-relative-container {
          position: relative;
          width: 100%;
        }

        /* Horizontal scrolling row */
        .shelf-cards-row {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 4px 2px 8px;
        }

        .shelf-cards-row::-webkit-scrollbar {
          display: none;
        }

        /* Each column card */
        .shelf-card-col {
          flex: 0 0 calc(18% - 10px);
          min-width: 190px;
          max-width: 220px;
          scroll-snap-align: start;
        }

        @media (max-width: 1280px) {
          .shelf-card-col {
            flex: 0 0 calc(25% - 15px);
            min-width: 180px;
          }
        }

        @media (max-width: 900px) {
          .apple-carousel-shelf {
            margin-bottom: 36px;
          }
          .shelf-card-col {
            flex: 0 0 calc(33.333% - 14px);
            min-width: 160px;
          }
        }

        @media (max-width: 768px) {
          .apple-carousel-shelf {
            margin-bottom: 28px;
          }
          .shelf-relative-container {
            margin-left: -14px;
            margin-right: -14px;
            width: calc(100% + 28px);
          }
          .shelf-cards-row {
            padding: 2px 14px 6px;
            gap: 12px;
          }
          .shelf-card-col {
            flex: 0 0 calc(42% - 6px);
            min-width: 135px;
            max-width: 170px;
          }
          .shelf-floating-nav {
            display: none !important;
          }
        }

        @media (max-width: 420px) {
          .shelf-card-col {
            flex: 0 0 calc(46% - 6px);
            min-width: 125px;
          }
        }

        /* Floating Nav Chevrons (Centered relative to the artwork) */
        .shelf-floating-nav {
          position: absolute;
          top: 95px;
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
          transition: background-color 0.18s ease, transform 0.18s ease;
        }

        @media (max-width: 768px) {
          .shelf-floating-nav {
            display: none !important;
          }
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
      `}</style>
    </section>
  );
};
