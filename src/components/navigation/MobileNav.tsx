import React from 'react';
import {
  AppleHomeIcon,
  AppleGridIcon,
  AppleRadioWavesIcon,
  AppleLibraryFolderIcon,
  AppleSearchLensIcon
} from '../common/AppleIcons';

import { usePlayer } from '../../context/PlayerContext';

interface MobileNavProps {
  currentRoute: string;
  onNavigate: (route: string, param?: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentRoute, onNavigate }) => {
  const { expandedPlayerOpen } = usePlayer();

  if (expandedPlayerOpen) return null;

  const isHomeActive = currentRoute === 'home';
  const isNewActive = currentRoute === 'new';
  const isRadioActive = currentRoute === 'radio';
  const isLibraryActive = currentRoute === 'library-recent' || currentRoute.startsWith('library');
  const isSearchActive = currentRoute === 'search';

  return (
    <nav className="apple-mobile-dock-wrapper" aria-label="Mobile Navigation">
      {/* 1. Left Rounded Capsule with 4 Tabs */}
      <div className="mobile-dock-left-capsule">
        <button
          className={`dock-tab-btn ${isHomeActive ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
          title="Home"
          aria-label="Home"
        >
          <AppleHomeIcon size={20} filled={isHomeActive} />
          <span>Home</span>
        </button>

        <button
          className={`dock-tab-btn ${isNewActive ? 'active' : ''}`}
          onClick={() => onNavigate('new')}
          title="New"
          aria-label="New"
        >
          <AppleGridIcon size={19} />
          <span>New</span>
        </button>

        <button
          className={`dock-tab-btn ${isRadioActive ? 'active' : ''}`}
          onClick={() => onNavigate('radio')}
          title="Radio"
          aria-label="Radio"
        >
          <AppleRadioWavesIcon size={20} />
          <span>Radio</span>
        </button>

        <button
          className={`dock-tab-btn ${isLibraryActive ? 'active' : ''}`}
          onClick={() => onNavigate('library-recent')}
          title="Library"
          aria-label="Library"
        >
          <AppleLibraryFolderIcon size={20} />
          <span>Library</span>
        </button>
      </div>

      {/* 2. Right Standalone Circular Search Island */}
      <button
        className={`mobile-dock-search-island ${isSearchActive ? 'active' : ''}`}
        onClick={() => onNavigate('search')}
        title="Search"
        aria-label="Search"
      >
        <AppleSearchLensIcon size={21} />
      </button>

      <style>{`
        .apple-mobile-dock-wrapper {
          display: none;
        }

        @media (max-width: 900px) {
          .apple-mobile-dock-wrapper {
            display: flex;
            position: fixed;
            bottom: calc(14px + env(safe-area-inset-bottom, 0px));
            left: 14px;
            right: 14px;
            max-width: 480px;
            margin: 0 auto;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            user-select: none;
            pointer-events: auto;
          }
        }

        /* 1. Left Split Capsule - Authentic Liquid Glass */
        .mobile-dock-left-capsule {
          flex: 1;
          height: 58px;
          border-radius: 9999px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          padding: 0 6px;
          background: linear-gradient(180deg, rgba(48, 50, 58, 0.74) 0%, rgba(22, 23, 29, 0.84) 100%);
          backdrop-filter: blur(50px) saturate(210%);
          -webkit-backdrop-filter: blur(50px) saturate(210%);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55), inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.38), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.25);
          transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        [data-theme="light"] .mobile-dock-left-capsule {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(242, 244, 250, 0.82) 100%);
          backdrop-filter: blur(50px) saturate(210%);
          -webkit-backdrop-filter: blur(50px) saturate(210%);
          border: 1px solid rgba(255, 255, 255, 0.88);
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.08), inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 1);
        }

        /* Nav Item Tabs */
        .dock-tab-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          height: 48px;
          padding: 0 13px;
          border-radius: 9999px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: -0.01em;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
        }

        .dock-tab-btn svg {
          display: block;
          flex-shrink: 0;
        }

        .dock-tab-btn span {
          display: block;
          line-height: 1;
        }

        [data-theme="light"] .dock-tab-btn {
          color: #6e6e73;
        }

        .dock-tab-btn:hover {
          color: #ffffff;
        }

        [data-theme="light"] .dock-tab-btn:hover {
          color: #1c1c1e;
        }

        /* Active Tab with Pill highlight */
        .dock-tab-btn.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.14);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        }

        [data-theme="light"] .dock-tab-btn.active {
          color: #1c1c1e;
          background: rgba(0, 0, 0, 0.07);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        /* 2. Right Circular Search Island - Authentic Liquid Glass */
        .mobile-dock-search-island {
          width: 58px;
          height: 58px;
          flex-shrink: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: linear-gradient(180deg, rgba(48, 50, 58, 0.74) 0%, rgba(22, 23, 29, 0.84) 100%);
          color: #ffffff;
          backdrop-filter: blur(50px) saturate(210%);
          -webkit-backdrop-filter: blur(50px) saturate(210%);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55), inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.38), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.25);
          transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
        }

        .mobile-dock-search-island svg {
          display: block;
        }

        [data-theme="light"] .mobile-dock-search-island {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(242, 244, 250, 0.82) 100%);
          backdrop-filter: blur(50px) saturate(210%);
          -webkit-backdrop-filter: blur(50px) saturate(210%);
          border: 1px solid rgba(255, 255, 255, 0.88);
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.08), inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 1);
          color: #1c1c1e;
        }

        .mobile-dock-search-island:hover {
          transform: scale(1.05);
        }

        .mobile-dock-search-island.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.14);
        }

        [data-theme="light"] .mobile-dock-search-island.active {
          color: #1c1c1e;
          background: rgba(0, 0, 0, 0.07);
        }
      `}</style>
    </nav>
  );
};
