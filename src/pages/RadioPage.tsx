import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { INITIAL_TRACKS, CURATED_PLAYLISTS } from '../data/appleMusicCatalog';
import type { Track } from '../types/music';

interface IconicStation {
  id: string;
  name: string;
  radioColor: string;
  searchQuery: string;
  renderGraphic: () => React.ReactNode;
}

interface NeonStation {
  id: string;
  name: string;
  neonColor: string;
  glowColor: string;
  searchQuery: string;
}

interface RadioEpisode {
  id: string;
  showTitle: string;
  episodeTitle: string;
  description: string;
  artworkUrl: string;
  searchQuery: string;
}

// 1. TOP ICONIC RADIO STATIONS (White Squircle Cards matching screenshot)
const ICONIC_STATIONS: IconicStation[] = [
  {
    id: 'apple-music-1',
    name: 'Apple Music 1',
    radioColor: 'var(--accent-red)',
    searchQuery: 'Apple Music 1 Zane Lowe hits',
    renderGraphic: () => (
      <div className="iconic-graphic-wrap">
        <span className="am1-numeral">1</span>
      </div>
    )
  },
  {
    id: 'apple-music-hits',
    name: 'Apple Music Hits',
    radioColor: '#00c7ff',
    searchQuery: 'Top Billboard Hits 2024',
    renderGraphic: () => (
      <div className="iconic-graphic-wrap hits-graphic">
        <span className="hits-row">HITS</span>
        <span className="hits-row">HITS</span>
        <span className="hits-row">HITS</span>
      </div>
    )
  },
  {
    id: 'apple-music-country',
    name: 'Apple Music Country',
    radioColor: '#eab308',
    searchQuery: 'Top Country Music Hits',
    renderGraphic: () => (
      <div className="iconic-graphic-wrap country-graphic">
        <svg viewBox="0 0 100 100" className="country-star-svg">
          <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="#facc15" />
        </svg>
        <span className="country-text">COUNTRY</span>
      </div>
    )
  },
  {
    id: 'apple-music-musica-uno',
    name: 'Apple Music Música Uno',
    radioColor: '#ec4899',
    searchQuery: 'Musica Latina Top Hits',
    renderGraphic: () => (
      <div className="iconic-graphic-wrap musica-graphic">
        <span className="musica-line1">MÚSICA</span>
        <span className="musica-line2">UNO</span>
      </div>
    )
  },
  {
    id: 'apple-music-club',
    name: 'Apple Music Club',
    radioColor: '#18181b',
    searchQuery: 'EDM Club Dance Party Hits',
    renderGraphic: () => (
      <div className="iconic-graphic-wrap club-graphic">
        <span className="club-text">club</span>
      </div>
    )
  },
  {
    id: 'apple-music-chill',
    name: 'Apple Music Chill',
    radioColor: '#38bdf8',
    searchQuery: 'Chill Lofi Beats Ambient',
    renderGraphic: () => (
      <div className="iconic-graphic-wrap chill-graphic">
        <span className="chill-text">Chill</span>
      </div>
    )
  }
];

// 2. NON-STOP MUSIC GLOWING NEON STATIONS (Matching screenshot row 2)
const NEON_STATIONS: NeonStation[] = [
  {
    id: 'radio-bollywood',
    name: 'Bollywood',
    neonColor: '#e9d5ff',
    glowColor: 'rgba(192, 132, 252, 0.85)',
    searchQuery: 'Latest Bollywood Hits 2024 Arijit Singh'
  },
  {
    id: 'radio-tamil',
    name: 'Tamil',
    neonColor: '#fbcfe8',
    glowColor: 'rgba(244, 114, 182, 0.85)',
    searchQuery: 'Tamil Latest Viral Hits Anirudh'
  },
  {
    id: 'radio-punjabi',
    name: 'Punjabi',
    neonColor: '#f5d0fe',
    glowColor: 'rgba(232, 121, 249, 0.85)',
    searchQuery: 'Punjabi Hits Karan Aujla Diljit Dosanjh'
  },
  {
    id: 'radio-hip-hop',
    name: 'Hip-Hop',
    neonColor: '#bae6fd',
    glowColor: 'rgba(96, 165, 250, 0.85)',
    searchQuery: 'Global Hip-Hop Rap Top Hits'
  },
  {
    id: 'radio-pop',
    name: 'Pop',
    neonColor: '#fecdd3',
    glowColor: 'rgba(251, 113, 133, 0.85)',
    searchQuery: 'Today Top Pop Hits Dua Lipa The Weeknd'
  },
  {
    id: 'radio-rnb',
    name: 'R&B / Soul',
    neonColor: '#fef08a',
    glowColor: 'rgba(250, 204, 21, 0.85)',
    searchQuery: 'Modern RnB Soul Hits SZA'
  },
  {
    id: 'radio-dance',
    name: 'Dance',
    neonColor: '#a7f3d0',
    glowColor: 'rgba(52, 211, 153, 0.85)',
    searchQuery: 'Electronic Dance Floor Anthems'
  }
];

// 3. EPISODES ROW (Matching screenshot row 3)
const RADIO_EPISODES: RadioEpisode[] = [
  {
    id: 'ep-vince-1',
    showTitle: '5 ON FRIDAYS WITH VINCE STAPLES',
    episodeTitle: 'This Is the Big Stage',
    description: "Make sure it's mixed and mastered before sending.",
    artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    searchQuery: 'Vince Staples Hip Hop Radio'
  },
  {
    id: 'ep-rap-life',
    showTitle: 'RAP LIFE RADIO',
    episodeTitle: 'Episode 312: Global Rap Radar with Ebro Darden',
    description: 'The defining sounds and voices of global hip-hop today.',
    artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    searchQuery: 'Rap Life Radio Ebro Darden'
  },
  {
    id: 'ep-vince-2',
    showTitle: '5 ON FRIDAYS WITH VINCE STAPLES',
    episodeTitle: 'Cameras Everywhere',
    description: 'Do not commit that crime. They are watching you.',
    artworkUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    searchQuery: 'Vince Staples Best Tracks'
  }
];

export const RadioPage: React.FC = () => {
  const { playTrack, isPlaying } = usePlayer();
  const [activeStationId, setActiveStationId] = useState<string | null>(null);
  const [liveToast, setLiveToast] = useState<string | null>(null);

  // Horizontal scroll container references
  const iconicScrollRef = useRef<HTMLDivElement>(null);
  const neonScrollRef = useRef<HTMLDivElement>(null);

  const [canScrollIconicLeft, setCanScrollIconicLeft] = useState(false);
  const [canScrollIconicRight, setCanScrollIconicRight] = useState(true);
  const [canScrollNeonLeft, setCanScrollNeonLeft] = useState(false);
  const [canScrollNeonRight, setCanScrollNeonRight] = useState(true);

  const checkScroll = (el: HTMLDivElement | null, setLeft: (v: boolean) => void, setRight: (v: boolean) => void) => {
    if (!el) return;
    setLeft(el.scrollLeft > 15);
    setRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 15);
  };

  useEffect(() => {
    const el1 = iconicScrollRef.current;
    const el2 = neonScrollRef.current;
    const handler = () => {
      checkScroll(el1, setCanScrollIconicLeft, setCanScrollIconicRight);
      checkScroll(el2, setCanScrollNeonLeft, setCanScrollNeonRight);
    };
    handler();
    el1?.addEventListener('scroll', handler, { passive: true });
    el2?.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      el1?.removeEventListener('scroll', handler);
      el2?.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  // TRUE LIVE RADIO STREAMING LOGIC
  const tuneIntoRadio = async (stationId: string, stationName: string, query: string) => {
    setActiveStationId(stationId);
    setLiveToast(`🔴 LIVE • Tuning into ${stationName}...`);
    setTimeout(() => setLiveToast(null), 3000);

    // 1. Curate instant fallback queue from catalog
    let baseQueue: Track[] = [...INITIAL_TRACKS];
    if (stationId.includes('punjabi')) {
      const pl = CURATED_PLAYLISTS.find(p => p.id === 'pl-punjabi-wave');
      if (pl && pl.tracks.length > 0) baseQueue = pl.tracks;
    } else if (stationId.includes('bollywood')) {
      baseQueue = INITIAL_TRACKS.filter(t => t.album.includes('Udta') || t.title.includes('Chann') || t.title.includes('Bhootni'));
      if (baseQueue.length === 0) baseQueue = INITIAL_TRACKS;
    } else if (stationId.includes('chill')) {
      const pl = CURATED_PLAYLISTS.find(p => p.id === 'pl-chill-station');
      if (pl && pl.tracks.length > 0) baseQueue = pl.tracks;
    }

    // Shuffle base queue for spontaneous live radio feel
    const liveQueue = [...baseQueue].sort(() => Math.random() - 0.5);

    // 2. Play first track immediately
    if (liveQueue.length > 0) {
      playTrack(liveQueue[0], liveQueue);
    }

    // 3. Asynchronously fetch live radio tracks via API to enrich queue
    try {
      const res = await fetch(`/api/music/suggestions?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.tracks && data.tracks.length > 0) {
          const fetchedTracks: Track[] = data.tracks.map((item: any) => ({
            id: item.id,
            title: item.title,
            artists: [item.artist || stationName],
            album: `${stationName} Radio Live`,
            artworkUrl: item.artworkUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
            duration: item.duration || 195,
            durationFormatted: item.durationFormatted || '3:15',
            source: 'innertube',
            streamAvailability: true
          }));

          // Replace with live-fetched stream queue
          playTrack(fetchedTracks[0], fetchedTracks);
        }
      }
    } catch (e) {
      console.warn('Radio stream fetch fallback engaged:', e);
    }
  };

  return (
    <div className="apple-radio-page">
      {/* Live Tune-in Toast notification */}
      {liveToast && (
        <div className="radio-live-toast">
          <span className="live-toast-dot" />
          <span>{liveToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="radio-header-model">
        <h1 className="radio-main-heading">Radio</h1>
      </div>

      {/* 1. TOP ICONIC STATIONS CAROUSEL (White Squircle Cards) */}
      <section className="radio-section iconic-section">
        <div className="carousel-relative-box">
          {canScrollIconicLeft && (
            <button
              className="radio-nav-btn radio-nav-prev"
              onClick={() => iconicScrollRef.current?.scrollBy({ left: -420, behavior: 'smooth' })}
              aria-label="Previous stations"
            >
              <ChevronLeft size={22} strokeWidth={2.4} />
            </button>
          )}

          {canScrollIconicRight && (
            <button
              className="radio-nav-btn radio-nav-next"
              onClick={() => iconicScrollRef.current?.scrollBy({ left: 420, behavior: 'smooth' })}
              aria-label="Next stations"
            >
              <ChevronRight size={22} strokeWidth={2.4} />
            </button>
          )}

          <div className="iconic-stations-row" ref={iconicScrollRef}>
            {ICONIC_STATIONS.map((station) => {
              const isCurrent = activeStationId === station.id && isPlaying;
              return (
                <div
                  key={station.id}
                  className="iconic-card"
                  onClick={() => tuneIntoRadio(station.id, station.name, station.searchQuery)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="iconic-card-artwork">
                    {station.renderGraphic()}

                    {/* Bottom Apple Music Radio watermark */}
                    <div className="iconic-card-bottom-label">
                      <span className="iconic-apple-logo">Music</span>
                      <span className="iconic-radio-text" style={{ color: station.radioColor }}>
                        Radio
                      </span>
                    </div>

                    {/* Hover Play Button */}
                    <div className={`iconic-play-overlay ${isCurrent ? 'is-playing' : ''}`}>
                      <div className="iconic-play-pill">
                        {isCurrent ? (
                          <Pause size={18} fill="#ffffff" color="#ffffff" />
                        ) : (
                          <Play size={18} fill="#ffffff" color="#ffffff" style={{ marginLeft: 2 }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. NON-STOP MUSIC SECTION (Glowing Neon Cards) */}
      <section className="radio-section neon-section">
        <div className="radio-section-header">
          <div className="radio-section-title-wrap">
            <h2 className="radio-section-title">Non-Stop Music</h2>
            <ChevronRight size={18} className="radio-chevron" />
          </div>
        </div>

        <div className="carousel-relative-box">
          {canScrollNeonLeft && (
            <button
              className="radio-nav-btn radio-nav-prev"
              onClick={() => neonScrollRef.current?.scrollBy({ left: -420, behavior: 'smooth' })}
              aria-label="Previous non-stop stations"
            >
              <ChevronLeft size={22} strokeWidth={2.4} />
            </button>
          )}

          {canScrollNeonRight && (
            <button
              className="radio-nav-btn radio-nav-next"
              onClick={() => neonScrollRef.current?.scrollBy({ left: 420, behavior: 'smooth' })}
              aria-label="Next non-stop stations"
            >
              <ChevronRight size={22} strokeWidth={2.4} />
            </button>
          )}

          <div className="neon-stations-row" ref={neonScrollRef}>
            {NEON_STATIONS.map((station) => {
              const isCurrent = activeStationId === station.id && isPlaying;
              return (
                <div
                  key={station.id}
                  className="neon-card-item"
                  onClick={() => tuneIntoRadio(station.id, `${station.name} Non-Stop`, station.searchQuery)}
                >
                  <div className="neon-card-artwork">
                    {/* Top right Apple Music mark */}
                    <div className="neon-top-logo">Music</div>

                    {/* Center glowing neon text */}
                    <div
                      className="neon-center-text"
                      style={{
                        color: station.neonColor,
                        textShadow: `0 0 16px ${station.glowColor}, 0 0 36px ${station.glowColor}`
                      }}
                    >
                      {station.name}
                    </div>

                    {/* Hover Action Overlay with Round Pink/Red Play Circle matching screenshot */}
                    <div className={`neon-hover-overlay ${isCurrent ? 'is-playing' : ''}`}>
                      <div className="neon-play-circle">
                        {isCurrent ? (
                          <Pause size={20} fill="#ffffff" color="#ffffff" />
                        ) : (
                          <Play size={20} fill="#ffffff" color="#ffffff" style={{ marginLeft: 2 }} />
                        )}
                      </div>

                      <button
                        className="neon-ellipsis-btn"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="More"
                      >
                        <MoreHorizontal size={18} color="#ffffff" />
                      </button>
                    </div>
                  </div>

                  {/* Below Caption */}
                  <span className="neon-caption">{station.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SUBSCRIBE TO PLAY EPISODES SECTION */}
      <section className="radio-section episodes-section">
        <div className="radio-section-header">
          <div className="radio-section-title-wrap">
            <h2 className="radio-section-title">Subscribe to Play Episodes</h2>
            <ChevronRight size={18} className="radio-chevron" />
          </div>
        </div>

        <div className="episodes-grid">
          {RADIO_EPISODES.map((ep) => (
            <div
              key={ep.id}
              className="episode-item-card"
              onClick={() => tuneIntoRadio(ep.id, ep.episodeTitle, ep.searchQuery)}
            >
              <div className="episode-artwork-box">
                <img src={ep.artworkUrl} alt={ep.episodeTitle} className="episode-art-img" />
                <div className="episode-play-overlay">
                  <Play size={16} fill="#ffffff" color="#ffffff" style={{ marginLeft: 2 }} />
                </div>
              </div>

              <div className="episode-meta">
                <span className="episode-show-eyebrow">{ep.showTitle}</span>
                <h4 className="episode-name">{ep.episodeTitle}</h4>
                <p className="episode-description">{ep.description}</p>
              </div>

              <button className="episode-more-btn" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .apple-radio-page {
          padding: 28px 36px 96px;
          max-width: 1540px;
          margin: 0 auto;
          user-select: none;
        }

        @media (max-width: 768px) {
          .apple-radio-page {
            padding: 16px 14px 40px;
          }
          .radio-main-heading {
            font-size: 26px;
          }
          .radio-header-model {
            margin-bottom: 16px;
          }
          .radio-section {
            margin-bottom: 28px;
          }
          .radio-section-title {
            font-size: 19px;
          }
          .radio-nav-btn {
            display: none !important;
          }
          .iconic-card {
            flex: 0 0 146px;
          }
          .iconic-card-artwork {
            width: 146px;
            height: 146px;
            border-radius: 16px;
          }
          .am1-numeral {
            font-size: 62px;
          }
          .hits-row {
            font-size: 21px;
          }
          .club-graphic .club-text {
            font-size: 38px;
          }
        }

        /* Live Toast Notification */
        .radio-live-toast {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(20, 22, 30, 0.9);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
          border-radius: 9999px;
          padding: 8px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          font-weight: 600;
          color: #ffffff;
          z-index: 2000;
          animation: slideDownFade 0.25s ease;
        }

        .live-toast-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent-red);
          animation: pulseGlow 1.2s infinite;
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }

        @keyframes slideDownFade {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        .radio-header-model {
          margin-bottom: 24px;
        }

        .radio-main-heading {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 34px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #ffffff;
          line-height: 1.15;
        }

        .radio-section {
          margin-bottom: 40px;
        }

        .radio-section-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .radio-section-title-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .radio-section-title {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.015em;
          color: #ffffff;
        }

        .radio-chevron {
          color: rgba(255, 255, 255, 0.45);
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .radio-section-title-wrap:hover .radio-chevron {
          transform: translateX(4px);
          color: #ffffff;
        }

        /* Carousel Relative Box & Floating Nav Buttons */
        .carousel-relative-box {
          position: relative;
          width: 100%;
        }

        .radio-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 34px;
          height: 60px;
          border-radius: 8px;
          background: rgba(24, 24, 28, 0.88);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
          transition: background-color 0.15s ease, transform 0.15s ease;
        }

        .radio-nav-btn:hover {
          background: rgba(45, 45, 54, 0.95);
          transform: translateY(-50%) scale(1.05);
        }

        .radio-nav-prev {
          left: -14px;
        }

        .radio-nav-next {
          right: -14px;
        }

        /* 1. TOP ICONIC STATIONS ROW */
        .iconic-stations-row {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          padding: 4px 0 8px;
        }

        .iconic-stations-row::-webkit-scrollbar {
          display: none;
        }

        .iconic-card {
          flex: 0 0 178px;
          scroll-snap-align: start;
          cursor: pointer;
        }

        .iconic-card-artwork {
          position: relative;
          width: 178px;
          height: 178px;
          border-radius: 20px;
          background-color: #ffffff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 16px 12px 14px;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .iconic-card:hover .iconic-card-artwork {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.65);
        }

        .iconic-graphic-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        /* Station Graphics */
        .am1-numeral {
          font-family: Arial, "Helvetica Neue", sans-serif;
          font-size: 78px;
          font-weight: 900;
          color: var(--accent-red);
          line-height: 1;
          letter-spacing: -2px;
        }

        .hits-graphic {
          flex-direction: column;
          gap: 2px;
        }

        .hits-row {
          font-family: -apple-system, BlinkMacSystemFont, "Arial Black", sans-serif;
          font-size: 26px;
          font-weight: 900;
          font-style: italic;
          color: #00c7ff;
          line-height: 0.95;
          letter-spacing: -0.5px;
          transform: skewX(-8deg);
        }

        .country-graphic {
          position: relative;
          width: 100%;
          height: 80px;
        }

        .country-star-svg {
          width: 90px;
          height: 90px;
        }

        .country-text {
          position: absolute;
          font-family: -apple-system, BlinkMacSystemFont, "Arial Black", sans-serif;
          font-size: 19px;
          font-weight: 900;
          color: #1e3a8a;
          letter-spacing: 0.5px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .musica-graphic {
          flex-direction: column;
          align-items: center;
          gap: 0px;
        }

        .musica-line1 {
          font-family: -apple-system, BlinkMacSystemFont, "Arial Black", sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: #ec4899;
          letter-spacing: 0.5px;
        }

        .musica-line2 {
          font-family: -apple-system, BlinkMacSystemFont, "Arial Black", sans-serif;
          font-size: 26px;
          font-weight: 900;
          color: #ec4899;
          letter-spacing: 1px;
        }

        .club-graphic .club-text {
          font-family: "Arial Black", "Helvetica Neue", sans-serif;
          font-size: 48px;
          font-weight: 900;
          color: #18181b;
          letter-spacing: -2px;
        }

        .chill-graphic .chill-text {
          font-family: "Brush Script MT", "Segoe Script", cursive, sans-serif;
          font-size: 52px;
          font-weight: 700;
          color: #38bdf8;
          line-height: 1;
        }

        .iconic-card-bottom-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
          font-size: 12.5px;
          font-weight: 700;
        }

        .iconic-apple-logo {
          color: #18181b;
        }

        .iconic-play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .iconic-card:hover .iconic-play-overlay,
        .iconic-play-overlay.is-playing {
          opacity: 1;
        }

        .iconic-play-pill {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: var(--accent-red);
          color: var(--accent-contrast, #000000);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }

        /* 2. NON-STOP MUSIC SECTION */
        .neon-stations-row {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          padding: 4px 0 8px;
        }

        .neon-stations-row::-webkit-scrollbar {
          display: none;
        }

        .neon-card-item {
          flex: 0 0 178px;
          scroll-snap-align: start;
          display: flex;
          flex-direction: column;
          gap: 8px;
          cursor: pointer;
        }

        .neon-card-artwork {
          position: relative;
          width: 178px;
          height: 178px;
          border-radius: 12px;
          background: radial-gradient(circle at center, #181822 0%, #09090c 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .neon-card-item:hover .neon-card-artwork {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.65);
        }

        .neon-top-logo {
          position: absolute;
          top: 10px;
          right: 12px;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.85);
        }

        .neon-center-text {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.3px;
        }

        .neon-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .neon-card-item:hover .neon-hover-overlay,
        .neon-hover-overlay.is-playing {
          opacity: 1;
        }

        .neon-play-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--accent-red);
          color: var(--accent-contrast, #000000);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .neon-ellipsis-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }

        .neon-caption {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: #ffffff;
        }

        /* 3. EPISODES GRID */
        .episodes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 900px) {
          .episodes-grid {
            grid-template-columns: 1fr;
          }
        }

        .episode-item-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 8px 10px;
          border-radius: 8px;
          background: transparent;
          cursor: pointer;
          transition: background-color 0.15s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .episode-item-card:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .episode-artwork-box {
          position: relative;
          width: 54px;
          height: 54px;
          border-radius: 6px;
          overflow: hidden;
          background: #1c1c1e;
          flex-shrink: 0;
        }

        .episode-art-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .episode-play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .episode-item-card:hover .episode-play-overlay {
          opacity: 1;
        }

        .episode-meta {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .episode-show-eyebrow {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.5);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .episode-name {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .episode-description {
          font-size: 12.5px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .episode-more-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .episode-more-btn:hover {
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default RadioPage;
