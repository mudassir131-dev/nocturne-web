import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Play, Music, Mic2, MoreHorizontal, ChevronRight } from 'lucide-react';
import type { Track } from '../types/music';
import { TrackRow } from '../components/track-list/TrackRow';
import { usePlayer } from '../context/PlayerContext';

interface BrowseCategory {
  id: string;
  name: string;
  query: string;
  bgColor: string;
  imageUrl?: string;
  isSing?: boolean;
  isCharts?: boolean;
}

const BROWSE_CATEGORIES: BrowseCategory[] = [
  {
    id: 'apple-music-live',
    name: 'Apple Music Live',
    query: 'Apple Music Live',
    bgColor: '#14161a',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'concerts',
    name: 'Concerts',
    query: 'Live Concerts',
    bgColor: '#521422',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bollywood',
    name: 'Bollywood',
    query: 'Bollywood Hits',
    bgColor: '#9c71d2',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'pop',
    name: 'Pop',
    query: 'Pop hits',
    bgColor: '#e5688b',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'charts',
    name: 'Charts',
    query: 'Top Charts India',
    bgColor: '#7a7e1f',
    isCharts: true
  },
  {
    id: 'sing',
    name: 'Sing',
    query: 'Apple Music Sing',
    bgColor: '#df5267',
    isSing: true
  },
  {
    id: 'punjabi',
    name: 'Punjabi',
    query: 'Punjabi Hits',
    bgColor: '#8b56b8',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'radio',
    name: 'Apple Music Radio',
    query: 'Apple Music Radio',
    bgColor: '#2c2c2e',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'halloween',
    name: 'Halloween',
    query: 'Halloween',
    bgColor: '#1b140f',
    imageUrl: 'https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'hiphop',
    name: 'Hip-Hop/Rap',
    query: 'Hip-Hop',
    bgColor: '#4169e1',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'live-music',
    name: 'Live Music',
    query: 'Live Music Unplugged',
    bgColor: '#b8860b',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tamil',
    name: 'Tamil',
    query: 'Tamil Hits',
    bgColor: '#704e90',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'indie',
    name: 'Indie',
    query: 'Indie India',
    bgColor: '#2e7d32',
    imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'rock',
    name: 'Rock',
    query: 'Rock Classics',
    bgColor: '#1e3a5f',
    imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'dance',
    name: 'Dance',
    query: 'Dance Electronic EDM',
    bgColor: '#008b8b',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'chill',
    name: 'Chill',
    query: 'Acoustic Chill Lofi',
    bgColor: '#4a5568',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop&q=80'
  }
];

interface SearchPageProps {
  initialQuery?: string;
  onNavigate: (route: string, param?: string) => void;
  onBack?: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '', onNavigate, onBack: _onBack }) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Track[]>([]);
  const [catalog, setCatalog] = useState<{
    tracks: Track[];
    albums: any[];
    playlists: any[];
    artists: any[];
  }>({ tracks: [], albums: [], playlists: [], artists: [] });
  const [activeCapsule, setActiveCapsule] = useState<'results' | 'songs' | 'albums' | 'playlists' | 'artists'>('results');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Similar songs & YouTube algorithm keywords state
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [, setActiveKeyword] = useState<string | null>(null);
  const [isDeepLoading, setIsDeepLoading] = useState(false);
  const [hasLoadedDeep, setHasLoadedDeep] = useState(false);

  // Suggestions state (typing dropdown)
  const [showDropdown, setShowDropdown] = useState(false);
  const [textSuggestions, setTextSuggestions] = useState<string[]>([]);
  const [songSuggestions, setSongSuggestions] = useState<Track[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const { playTrack } = usePlayer();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const infiniteScrollSentinelRef = useRef<HTMLDivElement>(null);
  const nextKeywordIndexRef = useRef<number>(0);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  // Click outside listener to dismiss suggestions dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Fetch live autocomplete suggestions while typing
  const fetchSuggestions = async (val: string) => {
    if (!val.trim()) {
      setTextSuggestions([]);
      setSongSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsSuggesting(true);
    try {
      const res = await fetch(`/api/music/suggestions?q=${encodeURIComponent(val)}`);
      if (res.ok) {
        const data = await res.json();
        setTextSuggestions(data.textSuggestions || []);
        setSongSuggestions(data.tracks || []);
        setShowDropdown(true);
      }
    } catch (e) {
      console.warn('Suggestions error:', e);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (val.trim()) {
      debounceTimerRef.current = window.setTimeout(() => {
        fetchSuggestions(val);
      }, 150);
    } else {
      setShowDropdown(false);
      setHasSearched(false);
      setResults([]);
    }
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setShowDropdown(false);
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setHasLoadedDeep(false);
    setActiveKeyword(null);

    try {
      const res = await fetch(`/api/music/search?q=${encodeURIComponent(searchQuery)}&type=all`);
      if (!res.ok) {
        throw new Error('Search failed with status: ' + res.status);
      }
      const data = await res.json();
      const tracks = data.tracks || [];
      setCatalog({
        tracks,
        albums: data.albums || [],
        playlists: data.playlists || [],
        artists: data.artists || []
      });
      setResults(tracks);
      setRelatedKeywords(data.relatedKeywords || []);
      setActiveCapsule('results');
    } catch (err: any) {
      console.error('Search request error:', err);
      setError('Unable to fetch results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Deep load similar songs using YouTube search algorithm & suggestions
  const loadDeepSimilarSongs = async (searchTarget: string, append: boolean = false, keywordFilter?: string) => {
    if (!searchTarget.trim() || isDeepLoading) return;

    setIsDeepLoading(true);
    try {
      const targetQuery = keywordFilter || searchTarget;
      const res = await fetch(`/api/music/search?q=${encodeURIComponent(targetQuery)}&type=song&deep=true`);
      if (!res.ok) throw new Error('Deep song search failed');
      const data = await res.json();
      const incomingTracks: Track[] = data.tracks || [];
      const incomingKeywords: string[] = data.relatedKeywords || [];

      if (incomingKeywords.length > 0) {
        setRelatedKeywords((prev) => {
          const combined = Array.from(new Set([...prev, ...incomingKeywords]));
          return combined.slice(0, 15);
        });
      }

      setResults((prevResults) => {
        if (!append) {
          // If not appending, prioritize incoming tracks but keep existing unique tracks
          const seen = new Set(incomingTracks.map(t => t.id));
          const rest = prevResults.filter(t => !seen.has(t.id));
          const merged = [...incomingTracks, ...rest];
          setCatalog((prev) => ({ ...prev, tracks: merged }));
          return merged;
        } else {
          // Appending more tracks
          const seen = new Set(prevResults.map(t => t.id));
          const fresh = incomingTracks.filter(t => !seen.has(t.id));
          const merged = [...prevResults, ...fresh];
          setCatalog((prev) => ({ ...prev, tracks: merged }));
          return merged;
        }
      });
      setHasLoadedDeep(true);
    } catch (err) {
      console.warn('Failed loading deep similar songs:', err);
    } finally {
      setIsDeepLoading(false);
    }
  };

  // Apple-inspired automatic infinite scroll for songs section
  useEffect(() => {
    if (activeCapsule !== 'songs' || !hasSearched || isDeepLoading || !query.trim() || results.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting && !isDeepLoading) {
          const availableKeywords = relatedKeywords.filter(k => k.toLowerCase() !== query.toLowerCase());
          const nextKw = availableKeywords.length > 0
            ? availableKeywords[nextKeywordIndexRef.current % availableKeywords.length]
            : undefined;
          nextKeywordIndexRef.current += 1;
          loadDeepSimilarSongs(query, true, nextKw);
        }
      },
      {
        root: null,
        rootMargin: '350px',
        threshold: 0.1
      }
    );

    const target = infiniteScrollSentinelRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [activeCapsule, hasSearched, isDeepLoading, query, results.length, relatedKeywords]);

  const handleCapsuleSelect = (capsuleId: 'results' | 'songs' | 'albums' | 'playlists' | 'artists') => {
    setActiveCapsule(capsuleId);
    if (capsuleId === 'songs' && !hasLoadedDeep && !isDeepLoading && query.trim()) {
      loadDeepSimilarSongs(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(query);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setCatalog({ tracks: [], albums: [], playlists: [], artists: [] });
    setActiveCapsule('results');
    setRelatedKeywords([]);
    setActiveKeyword(null);
    setHasLoadedDeep(false);
    setIsDeepLoading(false);
    setTextSuggestions([]);
    setSongSuggestions([]);
    setShowDropdown(false);
    setHasSearched(false);
    setError(null);
  };

  const handleCategoryClick = (cat: BrowseCategory) => {
    setQuery(cat.name);
    performSearch(cat.query);
  };

  const handleSelectTextSuggestion = (text: string) => {
    setQuery(text);
    performSearch(text);
  };

  const handleSelectSongSuggestion = (track: Track) => {
    setShowDropdown(false);
    playTrack(track, songSuggestions.length > 0 ? songSuggestions : [track]);
  };

  // Derive unique artists and albums for Screenshot 2 layout
  const topSixResults = results.slice(0, 6);
  const uniqueArtists = Array.from(
    new Set(results.flatMap(t => t.artists || []))
  ).slice(0, 8);

  const uniqueAlbums = Array.from(
    new Map(results.map(t => [t.album, t])).values()
  ).slice(0, 6);

  return (
    <div className="apple-search-page">
      {/* 1. Signature Centered Red-Pill Search Box & Live Dropdown */}
      <div className="search-top-header" ref={searchContainerRef}>
        <div className="search-red-capsule">
          <Search size={15} className="capsule-search-icon" />
          <input
            type="text"
            className="capsule-search-input"
            placeholder="Search"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim() && (textSuggestions.length > 0 || songSuggestions.length > 0)) {
                setShowDropdown(true);
              }
            }}
            autoFocus
          />
          {query && (
            <button className="capsule-clear-btn" onClick={handleClear} title="Clear">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Live Typing Suggestions Dropdown (Screenshot 1) */}
        {showDropdown && query.trim() !== '' && (
          <div className="search-autocomplete-popover">
            {/* Top Text Query Suggestions */}
            {textSuggestions.length > 0 && (
              <div className="popover-text-section">
                {textSuggestions.map((text, idx) => (
                  <div
                    key={idx}
                    className="popover-text-row"
                    onClick={() => handleSelectTextSuggestion(text)}
                  >
                    <Search size={14} className="popover-search-icon" />
                    <span className="popover-query-text">
                      <strong className="query-prefix">{query.toLowerCase()}</strong>
                      {text.startsWith(query.toLowerCase())
                        ? text.slice(query.length)
                        : ` ${text}`}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Divider */}
            {textSuggestions.length > 0 && songSuggestions.length > 0 && (
              <div className="popover-divider" />
            )}

            {/* Live Instant Song Match Rows */}
            {songSuggestions.length > 0 && (
              <div className="popover-songs-section">
                {songSuggestions.map((track) => (
                  <div
                    key={track.id}
                    className="popover-song-row"
                    onClick={() => handleSelectSongSuggestion(track)}
                  >
                    <img
                      src={track.artworkUrl}
                      alt={track.title}
                      className="popover-song-thumb"
                    />
                    <div className="popover-song-details">
                      <div className="popover-song-title">{track.title}</div>
                      <div className="popover-song-subtitle">
                        Song · {track.artists.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isSuggesting && textSuggestions.length === 0 && songSuggestions.length === 0 && (
              <div className="popover-loading">
                <Loader2 size={18} className="search-spinner" />
                <span>Searching suggestions...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Signature Apple Music Capsule Filter Bar */}
      {hasSearched && !isLoading && !error && (results.length > 0 || catalog.albums.length > 0) && (
        <div className="search-capsules-bar">
          {[
            { id: 'results', label: 'Top Results' },
            { id: 'songs', label: 'Songs' },
            { id: 'albums', label: 'Albums' },
            { id: 'playlists', label: 'Playlists' },
            { id: 'artists', label: 'Artists' },
          ].map((capsule) => (
            <button
              key={capsule.id}
              className={`search-capsule-item ${activeCapsule === capsule.id ? 'active' : ''}`}
              onClick={() => handleCapsuleSelect(capsule.id as any)}
            >
              {capsule.label}
            </button>
          ))}
        </div>
      )}

      {/* 2. Before Search: "Browse Categories" Grid from Reference Screenshot */}
      {(!hasSearched || !query.trim()) && (
        <section className="browse-categories-section">
          <h2 className="browse-section-title">Browse Categories</h2>

          <div className="browse-categories-grid">
            {BROWSE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="category-card-item"
                style={{ backgroundColor: cat.bgColor }}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat.imageUrl && (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="category-card-bg-img"
                    loading="lazy"
                  />
                )}

                {cat.isSing && (
                  <div className="sing-card-illustration">
                    <div className="sing-sparkle-top">✦</div>
                    <div className="sing-mic-graphic">
                      <Mic2 size={46} color="rgba(255, 255, 255, 0.9)" />
                    </div>
                    <div className="sing-sparkle-bottom">✦</div>
                  </div>
                )}

                {cat.isCharts && (
                  <div className="charts-card-illustration">
                    <div className="waveform-bar bar-1" />
                    <div className="waveform-bar bar-2" />
                    <div className="waveform-bar bar-3" />
                    <div className="waveform-bar bar-4" />
                    <div className="waveform-bar bar-5" />
                    <div className="waveform-bar bar-6" />
                    <div className="waveform-bar bar-7" />
                    <div className="waveform-bar bar-8" />
                  </div>
                )}

                <div className="category-card-gradient" />
                <span className="category-card-title">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Loading State */}
      {isLoading && (
        <div className="search-loading-state">
          <Loader2 size={36} className="search-spinner" />
          <p>Searching Apple Music catalog...</p>
        </div>
      )}

      {/* 4. Error State */}
      {error && !isLoading && (
        <div className="search-error-state">
          <p>{error}</p>
        </div>
      )}

      {/* 5. Empty Results State */}
      {hasSearched && !isLoading && !error && results.length === 0 && (
        <div className="search-empty-state">
          <Music size={40} className="empty-search-icon" />
          <h3>No Results Found</h3>
          <p>We couldn't find anything matching "{query}". Check spelling or try another search.</p>
        </div>
      )}

      {/* 6. Post-Search Full Results Layout */}
      {!isLoading && (results.length > 0 || catalog.albums.length > 0) && query.trim() !== '' && (
        <div className="search-full-results-layout">
          {/* TAB 1: ALL / TOP RESULTS OVERVIEW */}
          {activeCapsule === 'results' && (
            <>
              {/* Section 1: Top Results (2 rows × 3 columns grid) */}
              <section className="search-section-block">
                <div className="search-section-heading" onClick={() => handleCapsuleSelect('songs')}>
                  <h2>Top Results</h2>
                  <ChevronRight size={18} className="heading-chevron" />
                </div>

                <div className="top-results-2x3-grid">
                  {topSixResults.map((item, idx) => (
                    <div
                      key={item.id}
                      className="top-result-lockup-card"
                      onClick={() => playTrack(item, results)}
                    >
                      <div className="lockup-thumb-wrap">
                        <img
                          src={item.artworkUrl}
                          alt={item.title}
                          className="lockup-art-img"
                        />
                        <div className="lockup-play-overlay">
                          <Play size={18} fill="#ffffff" color="#ffffff" style={{ marginLeft: 2 }} />
                        </div>
                      </div>

                      <div className="lockup-text-info">
                        <div className="lockup-title-line" title={item.title}>
                          {item.title}
                        </div>
                        <div className="lockup-subtitle-line">
                          {idx % 3 === 0 ? 'Album' : 'Song'} · {item.artists.join(', ')}
                        </div>
                      </div>

                      <button
                        className="lockup-more-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        title="More Options"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 2: Artists Shelf */}
              {(catalog.artists.length > 0 || uniqueArtists.length > 0) && (
                <section className="search-section-block">
                  <div className="search-section-heading" onClick={() => setActiveCapsule('artists')}>
                    <h2>Artists</h2>
                    <ChevronRight size={18} className="heading-chevron" />
                  </div>

                  <div className="artists-horizontal-shelf">
                    {(catalog.artists.length > 0 ? catalog.artists : uniqueArtists.map(name => ({ name, avatarUrl: '' }))).slice(0, 10).map((art: any, idx: number) => {
                      const artistName = art.name;
                      const avatar = art.avatarUrl || results.find(t => t.artists?.includes(artistName))?.artworkUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
                      return (
                        <div
                          key={idx}
                          className="artist-circle-card"
                          onClick={() => {
                            if (onNavigate) {
                              onNavigate('artist', artistName);
                            } else {
                              setQuery(artistName);
                              performSearch(artistName);
                            }
                          }}
                        >
                          <div className="artist-avatar-wrap">
                            <img
                              src={avatar}
                              alt={artistName}
                              className="artist-avatar-img"
                            />
                          </div>
                          <span className="artist-name-label">{artistName}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Section 3: Albums Shelf */}
              {(catalog.albums.length > 0 || uniqueAlbums.length > 0) && (
                <section className="search-section-block">
                  <div className="search-section-heading" onClick={() => setActiveCapsule('albums')}>
                    <h2>Albums</h2>
                    <ChevronRight size={18} className="heading-chevron" />
                  </div>

                  <div className="albums-results-grid">
                    {(catalog.albums.length > 0 ? catalog.albums : uniqueAlbums).slice(0, 6).map((item: any) => (
                      <div
                        key={item.id}
                        className="album-card-item"
                        onClick={() => {
                          if (item.tracks && item.tracks.length > 0) {
                            playTrack(item.tracks[0], item.tracks);
                          } else {
                            performSearch(`${item.title} ${item.artist || ''}`);
                          }
                        }}
                      >
                        <div className="album-card-artwork-box">
                          <img
                            src={item.artworkUrl}
                            alt={item.title || item.album}
                            className="album-card-art-img"
                          />
                          <button className="album-card-hover-play">
                            <Play size={20} fill="#ffffff" color="#ffffff" style={{ marginLeft: 2 }} />
                          </button>
                        </div>
                        <div className="album-card-title">{item.title || item.album}</div>
                        <div className="album-card-artist">{item.artist || item.artists?.join(', ')}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Section 4: Songs List */}
              <section className="search-section-block">
                <div className="search-section-heading" onClick={() => handleCapsuleSelect('songs')}>
                  <h2>Songs</h2>
                  <ChevronRight size={18} className="heading-chevron" />
                </div>

                <div className="songs-results-list">
                  {results.slice(6, 18).map((track, idx) => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={idx}
                      showAlbum={false}
                      showArtwork={true}
                      onPlayList={() => playTrack(track, results)}
                    />
                  ))}
                </div>
              </section>

              {/* Section 5: Playlists Shelf */}
              {catalog.playlists.length > 0 && (
                <section className="search-section-block">
                  <div className="search-section-heading" onClick={() => setActiveCapsule('playlists')}>
                    <h2>Playlists</h2>
                    <ChevronRight size={18} className="heading-chevron" />
                  </div>

                  <div className="albums-results-grid">
                    {catalog.playlists.slice(0, 6).map((item: any) => (
                      <div
                        key={item.id}
                        className="album-card-item"
                        onClick={() => {
                          if (onNavigate) {
                            onNavigate('playlist', item.id);
                          } else {
                            performSearch(item.title);
                          }
                        }}
                      >
                        <div className="album-card-artwork-box">
                          <img
                            src={item.artworkUrl}
                            alt={item.title}
                            className="album-card-art-img"
                          />
                          <button className="album-card-hover-play">
                            <Play size={20} fill="#ffffff" color="#ffffff" style={{ marginLeft: 2 }} />
                          </button>
                        </div>
                        <div className="album-card-title">{item.title}</div>
                        <div className="album-card-artist">{item.curator || 'Playlist'}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* TAB 2: SONGS VIEW */}
          {activeCapsule === 'songs' && (
            <section className="search-section-block">
              <div className="songs-tab-header">
                <div className="search-section-heading">
                  <h2>Songs</h2>
                </div>
              </div>

              <div className="songs-results-list">
                {results.map((track, idx) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={idx}
                    showAlbum={true}
                    showArtwork={true}
                    onPlayList={() => playTrack(track, results)}
                  />
                ))}
              </div>

              {/* Automatic Infinite Scroll Sentinel & Pure Loading Spinner (No cards/boxes) */}
              <div ref={infiniteScrollSentinelRef} className="apple-infinite-scroll-container">
                {isDeepLoading && (
                  <Loader2 size={26} className="search-spinner" />
                )}
              </div>
            </section>
          )}

          {/* TAB 3: ALBUMS VIEW */}
          {activeCapsule === 'albums' && (
            <section className="search-section-block">
              <div className="search-section-heading">
                <h2>Albums</h2>
              </div>
              <div className="albums-results-grid">
                {catalog.albums.map((item: any) => (
                  <div
                    key={item.id}
                    className="album-card-item"
                    onClick={() => {
                      performSearch(`${item.title} ${item.artist}`);
                    }}
                  >
                    <div className="album-card-artwork-box">
                      <img
                        src={item.artworkUrl}
                        alt={item.title}
                        className="album-card-art-img"
                      />
                      <button className="album-card-hover-play">
                        <Play size={20} fill="#ffffff" color="#ffffff" style={{ marginLeft: 2 }} />
                      </button>
                    </div>
                    <div className="album-card-title">{item.title}</div>
                    <div className="album-card-artist">{item.artist} · {item.year || 'Album'}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 4: PLAYLISTS VIEW */}
          {activeCapsule === 'playlists' && (
            <section className="search-section-block">
              <div className="search-section-heading">
                <h2>Playlists</h2>
              </div>
              <div className="albums-results-grid">
                {catalog.playlists.map((item: any) => (
                  <div
                    key={item.id}
                    className="album-card-item"
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('playlist', item.id);
                      } else {
                        performSearch(item.title);
                      }
                    }}
                  >
                    <div className="album-card-artwork-box">
                      <img
                        src={item.artworkUrl}
                        alt={item.title}
                        className="album-card-art-img"
                      />
                      <button className="album-card-hover-play">
                        <Play size={20} fill="#ffffff" color="#ffffff" style={{ marginLeft: 2 }} />
                      </button>
                    </div>
                    <div className="album-card-title">{item.title}</div>
                    <div className="album-card-artist">{item.curator || 'Playlist'}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 5: ARTISTS VIEW */}
          {activeCapsule === 'artists' && (
            <section className="search-section-block">
              <div className="search-section-heading">
                <h2>Artists</h2>
              </div>
              <div className="artists-results-grid">
                {catalog.artists.map((artist: any, idx: number) => (
                  <div
                    key={idx}
                    className="artist-large-card"
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('artist', artist.name);
                      } else {
                        setQuery(artist.name);
                        performSearch(artist.name);
                      }
                    }}
                  >
                    <div className="artist-avatar-wrap large">
                      <img
                        src={artist.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                        alt={artist.name}
                        className="artist-avatar-img"
                      />
                    </div>
                    <div className="artist-card-name">{artist.name}</div>
                    {artist.subscribers && (
                      <div className="artist-card-subs">{artist.subscribers}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <style>{`
        .apple-search-page {
          padding: 24px 32px 90px;
          max-width: 1360px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .apple-search-page {
            padding: 16px 14px 40px;
          }
          .search-top-header {
            margin-bottom: 20px;
          }
          .search-red-capsule {
            max-width: 100%;
          }
          .search-capsules-bar {
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            justify-content: flex-start !important;
            scrollbar-width: none !important;
            -webkit-overflow-scrolling: touch !important;
            padding: 2px 2px 8px !important;
            margin-top: 10px !important;
            margin-bottom: 16px !important;
            width: 100% !important;
          }
          .search-capsules-bar::-webkit-scrollbar {
            display: none !important;
          }
          .search-capsule-item {
            flex-shrink: 0;
            padding: 6px 14px;
            font-size: 13px;
          }
          .browse-section-title {
            font-size: 19px;
            margin-bottom: 14px;
          }
          .search-autocomplete-popover {
            width: 100%;
            max-width: 100%;
            left: 0;
            right: 0;
          }
        }

        /* 1. Centered Red-Pill Search Box */
        .search-top-header {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 36px;
          z-index: 50;
        }

        .search-red-capsule {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          max-width: 480px;
          height: 38px;
          background-color: rgba(30, 32, 38, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1.5px solid rgba(255, 255, 255, 0.24);
          border-radius: 9999px;
          padding: 0 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
          transition: box-shadow 0.15s ease, border-color 0.15s ease;
        }

        .search-red-capsule:focus-within {
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.18), 0 4px 20px rgba(0, 0, 0, 0.45);
          border-color: #ffffff;
        }

        .capsule-search-icon {
          color: rgba(255, 255, 255, 0.55);
          flex-shrink: 0;
        }

        .capsule-search-input {
          flex: 1;
          background: none;
          border: none;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          outline: none;
          min-width: 0;
        }

        .capsule-search-input::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }

        .capsule-clear-btn {
          color: rgba(255, 255, 255, 0.55);
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: color 0.15s ease;
        }

        .capsule-clear-btn:hover {
          color: #ffffff;
        }

        /* 1b. Signature Apple Music Capsule Filter Bar */
        .search-capsules-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 14px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .search-capsule-item {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          padding: 7px 18px;
          cursor: pointer;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .search-capsule-item:hover {
          background: rgba(255, 255, 255, 0.16);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .search-capsule-item.active {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(255, 255, 255, 0.25);
        }

        /* Algorithmic Keywords Pills & Songs Header */
        .songs-tab-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .songs-loading-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-left: 14px;
          font-size: 12px;
          font-weight: 500;
          color: var(--accent-red);
          background: var(--accent-red-dim);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          padding: 3px 12px;
          animation: pulseGlow 1.8s infinite ease-in-out;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }

        .search-keywords-pills-row {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          padding: 8px 0 16px;
          margin-bottom: 8px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .search-keywords-pills-row::-webkit-scrollbar {
          display: none;
        }

        .keywords-pills-label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.55);
          white-space: nowrap;
          padding-right: 4px;
        }

        .sparkle-icon {
          color: var(--accent-red);
        }

        .keyword-pill-chip {
          display: inline-flex;
          align-items: center;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          padding: 5px 14px;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.18s ease;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          user-select: none;
        }

        .keyword-pill-chip:hover {
          background: rgba(255, 255, 255, 0.14);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .keyword-pill-chip.active {
          background: var(--accent-red);
          color: var(--accent-contrast, #000000);
          border-color: var(--accent-red);
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
        }

        /* Apple-inspired Automatic Infinite Scroll Container & Spinner */
        .apple-infinite-scroll-container {
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 0 36px;
        }

        .apple-loading-spinner-wrap {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 10px 22px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
          animation: applePillFadeIn 0.25s ease-out;
        }

        @keyframes applePillFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .apple-ios-spinner {
          position: relative;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .ios-blade {
          position: absolute;
          left: 44%;
          top: 36%;
          width: 12%;
          height: 28%;
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 9999px;
          animation: iosBladePulse 0.9s linear infinite;
        }

        .blade-1 { transform: rotate(0deg) translate(0, -145%); animation-delay: 0s; }
        .blade-2 { transform: rotate(45deg) translate(0, -145%); animation-delay: -0.7875s; }
        .blade-3 { transform: rotate(90deg) translate(0, -145%); animation-delay: -0.675s; }
        .blade-4 { transform: rotate(135deg) translate(0, -145%); animation-delay: -0.5625s; }
        .blade-5 { transform: rotate(180deg) translate(0, -145%); animation-delay: -0.45s; }
        .blade-6 { transform: rotate(225deg) translate(0, -145%); animation-delay: -0.3375s; }
        .blade-7 { transform: rotate(270deg) translate(0, -145%); animation-delay: -0.225s; }
        .blade-8 { transform: rotate(315deg) translate(0, -145%); animation-delay: -0.1125s; }

        @keyframes iosBladePulse {
          0% { opacity: 1; }
          100% { opacity: 0.2; }
        }

        .apple-loading-text {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.75);
          letter-spacing: -0.01em;
        }

        /* Artists Grid for Tab 5 */
        .artists-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 24px;
        }

        .artist-large-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          padding: 12px;
          border-radius: 14px;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .artist-large-card:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-3px);
        }

        .artist-avatar-wrap.large {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .artist-card-name {
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          text-align: center;
        }

        .artist-card-subs {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 4px;
          text-align: center;
        }

        /* Autocomplete Popover Dropdown (Screenshot 1) */
        .search-autocomplete-popover {
          position: absolute;
          top: calc(100% + 8px);
          width: 100%;
          max-width: 480px;
          background: rgba(26, 28, 36, 0.94);
          backdrop-filter: blur(40px) saturate(190%);
          -webkit-backdrop-filter: blur(40px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.15);
          overflow: hidden;
          max-height: 480px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          z-index: 100;
          animation: popoverFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .popover-text-section {
          padding: 6px 0;
        }

        .popover-text-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 18px;
          cursor: pointer;
          transition: background-color 0.12s ease;
        }

        .popover-text-row:hover {
          background-color: rgba(255, 255, 255, 0.08);
        }

        .popover-search-icon {
          color: rgba(255, 255, 255, 0.45);
          flex-shrink: 0;
        }

        .popover-query-text {
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.85);
        }

        .query-prefix {
          font-weight: 700;
          color: #ffffff;
        }

        .popover-divider {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.08);
          margin: 4px 0;
        }

        .popover-songs-section {
          padding: 6px 0;
        }

        .popover-song-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 18px;
          cursor: pointer;
          transition: background-color 0.12s ease;
        }

        .popover-song-row:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .popover-song-thumb {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .popover-song-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .popover-song-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .popover-song-subtitle {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .popover-loading {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 18px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        /* 2. Browse Categories Section */
        .browse-categories-section {
          margin-top: 10px;
        }

        .browse-section-title {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.015em;
          color: #ffffff;
          margin-bottom: 20px;
        }

        .browse-categories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 1100px) {
          .browse-categories-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 768px) {
          .browse-categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
        }

        .category-card-item {
          position: relative;
          aspect-ratio: 16 / 9.5;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.22s ease,
                      filter 0.22s ease;
          user-select: none;
        }

        .category-card-item:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.6);
          filter: brightness(1.05);
        }

        .category-card-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .category-card-item:hover .category-card-bg-img {
          transform: scale(1.04);
        }

        .sing-card-illustration {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .sing-mic-graphic {
          transform: rotate(-35deg);
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
        }

        .sing-sparkle-top {
          position: absolute;
          top: 24%;
          right: 32%;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.85);
        }

        .sing-sparkle-bottom {
          position: absolute;
          bottom: 28%;
          left: 36%;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .charts-card-illustration {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 18px 24px;
          opacity: 0.85;
          pointer-events: none;
        }

        .waveform-bar {
          flex: 1;
          background: linear-gradient(180deg, rgba(230, 240, 90, 0.85) 0%, rgba(140, 150, 20, 0.65) 100%);
          border-radius: 4px;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4);
        }

        .bar-1 { height: 40%; }
        .bar-2 { height: 75%; }
        .bar-3 { height: 95%; }
        .bar-4 { height: 60%; }
        .bar-5 { height: 85%; }
        .bar-6 { height: 100%; }
        .bar-7 { height: 70%; }
        .bar-8 { height: 45%; }

        .category-card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, 0.3) 65%,
            rgba(0, 0, 0, 0.72) 100%
          );
          pointer-events: none;
        }

        .category-card-title {
          position: absolute;
          bottom: 14px;
          left: 16px;
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.015em;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
          z-index: 2;
        }

        /* 3. Post-Search Full Layout (Screenshot 2) */
        .search-full-results-layout {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .search-section-block {
          display: flex;
          flex-direction: column;
        }

        .search-section-heading {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 18px;
          cursor: pointer;
        }

        .search-section-heading h2 {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.015em;
          color: #ffffff;
        }

        .heading-chevron {
          color: rgba(255, 255, 255, 0.45);
          transition: transform 0.15s ease, color 0.15s ease;
        }

        .search-section-heading:hover .heading-chevron {
          color: #ffffff;
          transform: translateX(2px);
        }

        /* Top Results 2x3 Grid (Screenshot 2) */
        .top-results-2x3-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 990px) {
          .top-results-2x3-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .top-results-2x3-grid {
            grid-template-columns: 1fr;
          }
        }

        .top-result-lockup-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          background: rgba(36, 38, 46, 0.65);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          cursor: pointer;
          position: relative;
          transition: background-color 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
        }

        .top-result-lockup-card:hover {
          background-color: rgba(48, 50, 60, 0.85);
          border-color: rgba(255, 255, 255, 0.14);
          transform: translateY(-2px);
        }

        .lockup-thumb-wrap {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .lockup-art-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .lockup-play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .top-result-lockup-card:hover .lockup-play-overlay {
          opacity: 1;
        }

        .lockup-text-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .lockup-title-line {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.25;
        }

        .lockup-subtitle-line {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }

        .lockup-more-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.45);
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.15s ease, color 0.15s ease;
        }

        .top-result-lockup-card:hover .lockup-more-btn {
          opacity: 1;
        }

        .lockup-more-btn:hover {
          color: #ffffff;
        }

        /* Artists Circular Shelf (Screenshot 2) */
        .artists-horizontal-shelf {
          display: flex;
          align-items: flex-start;
          gap: 22px;
          overflow-x: auto;
          padding-bottom: 12px;
          scrollbar-width: none;
        }

        .artists-horizontal-shelf::-webkit-scrollbar {
          display: none;
        }

        .artist-circle-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 96px;
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .artist-circle-card:hover {
          transform: translateY(-4px);
        }

        .artist-avatar-wrap {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 8px;
        }

        .artist-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .artist-name-label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        /* Albums Grid */
        .albums-results-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 18px;
        }

        @media (max-width: 1100px) {
          .albums-results-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .albums-results-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .album-card-item {
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .album-card-artwork-box {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 8px;
          border: none !important;
          outline: none !important;
          background-color: transparent !important;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        }

        .album-card-art-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.25s ease;
        }

        .album-card-item:hover .album-card-art-img {
          transform: scale(1.04);
        }

        .album-card-hover-play {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          opacity: 0;
          transition: opacity 0.15s ease;
          cursor: pointer;
        }

        .album-card-item:hover .album-card-hover-play {
          opacity: 1;
        }

        .album-card-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .album-card-artist {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Loading & Error States */
        .search-loading-state,
        .search-empty-state,
        .search-error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          color: var(--text-secondary);
          text-align: center;
          gap: 12px;
        }

        .search-spinner {
          animation: spin 1s linear infinite;
          color: #ffffff;
        }

        .empty-search-icon {
          color: var(--text-tertiary);
          margin-bottom: 8px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
