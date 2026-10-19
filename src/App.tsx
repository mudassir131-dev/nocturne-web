import React, { useState, useEffect } from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/navigation/Sidebar';
import { MobileNav } from './components/navigation/MobileNav';
import { MiniPlayer } from './components/mini-player/MiniPlayer';
import { ExpandedPlayer } from './components/expanded-player/ExpandedPlayer';
import { QueueDrawer } from './components/queue/QueueDrawer';
import { AdaptiveDesktopWallpaper } from './components/common/AdaptiveDesktopWallpaper';
import { AppleFooter } from './components/common/AppleFooter';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { NewPage } from './pages/NewPage';
import { AlbumPage } from './pages/AlbumPage';
import { PlaylistPage } from './pages/PlaylistPage';
import { SearchPage } from './pages/SearchPage';
import { RadioPage } from './pages/RadioPage';
import { LibraryPage } from './pages/LibraryPage';
import { ArtistPage } from './pages/ArtistPage';
import { PlayerPage } from './pages/PlayerPage';

interface NavigationState {
  route: string;
  param?: string;
}

const AppContent: React.FC = () => {
  const {
    togglePlay,
    prevTrack,
    nextTrack,
    seek,
    currentTime,
    volume,
    setVolume,
    toggleMute,
    setExpandedPlayerOpen,
    expandedPlayerOpen,
    setLyricsViewActive,
    lyricsViewActive,
    queueDrawerOpen,
    setQueueDrawerOpen
  } = usePlayer();

  const [navHistory, setNavHistory] = useState<NavigationState[]>([
    { route: 'home' }
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const currentNav = navHistory[historyIndex] || { route: 'home' };
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < navHistory.length - 1;

  const handleGoBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < navHistory.length - 1) {
      setHistoryIndex((prev) => prev + 1);
    }
  };

  const handleNavigate = (route: string, param?: string) => {
    const current = navHistory[historyIndex];
    if (current && current.route === route && current.param === param) {
      return;
    }
    const nextState: NavigationState = { route, param };
    const newHistory = navHistory.slice(0, historyIndex + 1);
    newHistory.push(nextState);
    setNavHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    try {
      window.history.pushState({ historyIndex: newHistory.length - 1 }, '', '');
    } catch {
      // ignore
    }
  };

  // Sync with browser back button & Android system back gesture
  useEffect(() => {
    try {
      window.history.replaceState({ historyIndex: 0 }, '', '');
    } catch {
      // ignore
    }

    const handlePopState = (e: PopStateEvent) => {
      if (e.state && typeof e.state.historyIndex === 'number') {
        setHistoryIndex(Math.max(0, Math.min(e.state.historyIndex, navHistory.length - 1)));
      } else {
        setHistoryIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navHistory.length]);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if focus is inside an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(Math.max(0, currentTime - 5));
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(currentTime + 5);
          break;
        case 'BracketLeft':
          prevTrack();
          break;
        case 'BracketRight':
          nextTrack();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.05));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.05));
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyL':
          setLyricsViewActive(!lyricsViewActive);
          if (!expandedPlayerOpen) setExpandedPlayerOpen(true);
          break;
        case 'Escape':
          if (expandedPlayerOpen) setExpandedPlayerOpen(false);
          if (queueDrawerOpen) setQueueDrawerOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    togglePlay,
    prevTrack,
    nextTrack,
    seek,
    currentTime,
    volume,
    setVolume,
    toggleMute,
    expandedPlayerOpen,
    lyricsViewActive,
    queueDrawerOpen
  ]);

  const renderCurrentPage = () => {
    switch (currentNav.route) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'new':
        return <NewPage title="New" onNavigate={handleNavigate} />;
      case 'search':
        return <SearchPage initialQuery={currentNav.param} onNavigate={handleNavigate} onBack={handleGoBack} />;
      case 'radio':
        return <RadioPage />;
      case 'album':
        return <AlbumPage albumId={currentNav.param || 'alb-udta-teer'} onNavigate={handleNavigate} onBack={handleGoBack} />;
      case 'playlist':
        return <PlaylistPage playlistId={currentNav.param || 'pl-nmd-india'} onNavigate={handleNavigate} onBack={handleGoBack} />;
      case 'artist':
        return <ArtistPage artistName={currentNav.param || 'Amitabh Bhattacharya'} onNavigate={handleNavigate} onBack={handleGoBack} />;
      case 'player':
        return <PlayerPage onNavigate={handleNavigate} />;
      case 'library-recent':
        return <LibraryPage section="recent" onNavigate={handleNavigate} />;
      case 'library-artists':
      case 'library-albums':
        return <LibraryPage section="albums" onNavigate={handleNavigate} />;
      case 'library-songs':
        return <LibraryPage section="songs" onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app-shell">
      {/* 0. Adaptive Liquid Glass Desktop Wallpaper */}
      <AdaptiveDesktopWallpaper />

      {/* Desktop Sidebar */}
      <Sidebar
        currentRoute={currentNav.param ? `${currentNav.route}-${currentNav.param}` : currentNav.route}
        onNavigate={handleNavigate}
      />

      {/* Main Layout Area */}
      <div className="main-layout">
        {/* Apple Music Sticky Top Navigation Bar with Back & Forward Controls + PWA Download Option */}
        <div className="apple-global-top-bar">
          <div className="apple-nav-controls">
            <button
              className={`apple-nav-chevron-btn ${canGoBack ? 'active' : 'disabled'}`}
              onClick={handleGoBack}
              disabled={!canGoBack}
              aria-label="Back"
              title="Go back"
            >
              <ChevronLeft size={19} strokeWidth={2.4} />
              <span className="apple-nav-back-text">Back</span>
            </button>
            <button
              className={`apple-nav-chevron-btn forward-btn ${canGoForward ? 'active' : 'disabled'}`}
              onClick={handleGoForward}
              disabled={!canGoForward}
              aria-label="Forward"
              title="Go forward"
            >
              <ChevronRight size={19} strokeWidth={2.4} />
            </button>
          </div>

          <div className="apple-top-right-actions">
            <PwaInstallPrompt />
          </div>
        </div>

        <main className="content-scrollable">
          <div key={currentNav.param ? `${currentNav.route}-${currentNav.param}` : currentNav.route} className="page-transition-wrapper">
            {renderCurrentPage()}
          </div>
          <AppleFooter onNavigate={handleNavigate} />
        </main>
      </div>

      {/* Persistent Floating Mini-Player */}
      <MiniPlayer onNavigate={handleNavigate} />

      {/* Mobile Bottom Tab Navigation */}
      <MobileNav
        currentRoute={currentNav.route}
        onNavigate={handleNavigate}
      />

      {/* Expanded Now-Playing & Synchronized Lyrics Modal */}
      <ExpandedPlayer onNavigate={handleNavigate} />

      {/* Queue Side Drawer */}
      <QueueDrawer />


    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </ThemeProvider>
  );
};

export default App;
