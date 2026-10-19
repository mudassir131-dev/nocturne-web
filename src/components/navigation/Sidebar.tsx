import React, { useState, useEffect } from 'react';
import {
  Home,
  LayoutGrid,
  Radio,
  Disc3,
  ListMusic,
  Search,
  Plus,
  PlusCircle,
  Trash2,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import {
  getCustomPlaylists,
  createCustomPlaylist,
  deleteCustomPlaylist
} from '../../services/playlistStorage';
import type { Playlist } from '../../types/music';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string, param?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>(() => getCustomPlaylists());
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setUserPlaylists(getCustomPlaylists());
    };
    window.addEventListener('nocturne_playlists_updated', handleUpdate);
    return () => window.removeEventListener('nocturne_playlists_updated', handleUpdate);
  }, []);

  const handleConfirmCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = newPlaylistName.trim();
    const pl = createCustomPlaylist(name || 'New Playlist');
    setNewPlaylistName('');
    setIsCreating(false);
    setUserPlaylists(getCustomPlaylists());
    onNavigate('playlist', pl.id);
  };

  const handleDeletePlaylist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomPlaylist(id);
    setUserPlaylists(getCustomPlaylists());
    if (currentRoute === `playlist-${id}`) {
      onNavigate('home');
    }
  };

  return (
    <aside className="apple-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand" onClick={() => onNavigate('home')} role="button" tabIndex={0} title="Nocturne Music">
        <img src="/app-icon.png" alt="Nocturne" className="sidebar-brand-icon" />
        <span className="nocturne-brand-title">Nocturne</span>
      </div>

      {/* Search Input Box */}
      <div className="sidebar-search-container">
        <button
          className={`sidebar-search-btn ${currentRoute === 'search' ? 'active' : ''}`}
          onClick={() => onNavigate('search')}
        >
          <Search size={16} className="search-icon" />
          <span className="search-placeholder">Search</span>
        </button>
      </div>

      {/* Scrollable Navigation List */}
      <div className="sidebar-scrollable">
        <nav className="nav-group">
          <ul className="nav-list">
            <li>
              <button
                className={`nav-item ${currentRoute === 'home' ? 'active' : ''}`}
                onClick={() => onNavigate('home')}
              >
                <Home size={18} />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${currentRoute === 'new' ? 'active' : ''}`}
                onClick={() => onNavigate('new')}
              >
                <LayoutGrid size={18} />
                <span>New</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${currentRoute === 'radio' ? 'active' : ''}`}
                onClick={() => onNavigate('radio')}
              >
                <Radio size={18} />
                <span>Radio</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${currentRoute === 'player' ? 'active' : ''}`}
                onClick={() => onNavigate('player')}
              >
                <Disc3 size={18} />
                <span>Now Playing</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Playlists Section Header */}
        <div className="nav-section-header-row">
          <span className="nav-section-title">Playlists</span>
          <button
            className="btn-create-playlist-plus"
            title="Create Playlist"
            onClick={() => setIsCreating(true)}
          >
            <Plus size={15} />
          </button>
        </div>

        <nav className="nav-group">
          <ul className="nav-list playlist-list">
            {/* Create Playlist Action Item */}
            <li>
              <button
                className="nav-item create-playlist-btn"
                onClick={() => setIsCreating(true)}
              >
                <PlusCircle size={18} className="create-icon" />
                <span className="create-text">New Playlist</span>
              </button>
            </li>

            {/* Inline Input Box when creating */}
            {isCreating && (
              <li className="inline-create-box">
                <form onSubmit={handleConfirmCreate} className="inline-create-form">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Playlist Name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setIsCreating(false);
                    }}
                    className="inline-create-input"
                  />
                  <div className="inline-create-btn-group">
                    <button type="submit" className="inline-btn-save">Save</button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setNewPlaylistName('');
                      }}
                      className="inline-btn-cancel"
                    >
                      ✕
                    </button>
                  </div>
                </form>
              </li>
            )}

            {/* User Created Playlists with Delete Button */}
            {userPlaylists.map((pl) => (
              <li key={pl.id} className="playlist-row-wrapper">
                <button
                  className={`nav-item playlist-item ${currentRoute === `playlist-${pl.id}` ? 'active' : ''}`}
                  onClick={() => onNavigate('playlist', pl.id)}
                  title={pl.title}
                >
                  <ListMusic size={16} className="playlist-icon" />
                  <span className="sidebar-playlist-title">{pl.title}</span>
                </button>
                <button
                  className="btn-delete-playlist"
                  title={`Delete "${pl.title}"`}
                  onClick={(e) => handleDeletePlaylist(pl.id, e)}
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))}

            {userPlaylists.length === 0 && !isCreating && (
              <li className="no-playlists-hint">
                <span>No playlists yet</span>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Liquid Glass Theme Switcher (Dark / Light Mode) */}
      <div className="sidebar-theme-footer">
        <button
          className="sidebar-theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={15} className="theme-toggle-icon" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={15} className="theme-toggle-icon" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        .apple-sidebar {
          width: var(--sidebar-width);
          min-width: var(--sidebar-width);
          height: 100vh;
          background: var(--sidebar-bg);
          backdrop-filter: blur(50px) saturate(190%);
          -webkit-backdrop-filter: blur(50px) saturate(190%);
          border-right: none !important;
          box-shadow: none !important;
          display: flex;
          flex-direction: column;
          user-select: none;
          z-index: 10;
          transition: background 0.3s ease;
        }

        .sidebar-theme-footer {
          padding: 12px 16px 20px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: auto;
          flex-shrink: 0;
        }

        .sidebar-theme-toggle-btn {
          width: 100%;
          height: 38px;
          border-radius: var(--radius-full);
          background: var(--bg-hover);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-theme-toggle-btn:hover {
          background: var(--bg-active);
          border-color: var(--border-hover);
          transform: translateY(-1px);
        }

        .theme-toggle-icon {
          color: var(--accent-red);
        }

        @media (max-width: 900px) {
          .apple-sidebar {
            display: none;
          }
        }

        .sidebar-brand {
          padding: 22px 20px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }

        .sidebar-brand-icon {
          width: 30px;
          height: 30px;
          object-fit: contain;
          border-radius: 7px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sidebar-brand:hover .sidebar-brand-icon {
          transform: scale(1.08) rotate(-2deg);
        }

        .nocturne-brand-title {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--text-primary);
          line-height: 1;
        }

        .sidebar-search-container {
          padding: 4px 16px 12px;
        }

        .sidebar-search-btn {
          width: 100%;
          background-color: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          padding: 7px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-secondary);
          font-size: 13px;
          border: none;
          cursor: pointer;
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }

        .sidebar-search-btn:hover, .sidebar-search-btn.active {
          background-color: rgba(255, 255, 255, 0.14);
          color: var(--text-primary);
        }

        .sidebar-scrollable {
          flex: 1;
          overflow-y: auto;
          padding: 0 12px 20px;
          scrollbar-width: none;
        }

        .sidebar-scrollable::-webkit-scrollbar {
          display: none;
        }

        .nav-section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 8px 6px;
        }

        .nav-section-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.45);
        }

        .btn-create-playlist-plus {
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: rgba(255, 255, 255, 0.8);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .btn-create-playlist-plus:hover {
          background: var(--accent-red);
          color: var(--accent-contrast, #000000);
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-item {
          width: 100%;
          padding: 8px 12px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.75);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .nav-item.active {
          background-color: rgba(255, 255, 255, 0.16);
          color: #ffffff;
          font-weight: 600;
        }

        .create-playlist-btn {
          color: var(--accent-red);
          font-weight: 500;
        }

        .create-playlist-btn:hover {
          background-color: var(--accent-red-dim);
          color: var(--accent-red-hover);
        }

        .create-icon {
          color: var(--accent-red);
          flex-shrink: 0;
        }

        .create-text {
          font-size: 13.5px;
          font-weight: 600;
        }

        .inline-create-box {
          padding: 4px 6px;
          margin-bottom: 4px;
        }

        .inline-create-form {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          padding: 8px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .inline-create-input {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          padding: 6px 10px;
          color: #ffffff;
          font-size: 13px;
          outline: none;
          font-family: inherit;
        }

        .inline-create-input:focus {
          border-color: var(--accent-red);
        }

        .inline-create-btn-group {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .inline-btn-save {
          background: var(--accent-red);
          color: var(--accent-contrast, #000000);
          border: none;
          border-radius: 4px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .inline-btn-save:hover {
          opacity: 0.9;
        }

        .inline-btn-cancel {
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          border: none;
          padding: 4px 8px;
          font-size: 13px;
          cursor: pointer;
        }

        .inline-btn-cancel:hover {
          color: #ffffff;
        }

        .playlist-row-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .playlist-row-wrapper .playlist-item {
          padding-right: 34px;
        }

        .btn-delete-playlist {
          position: absolute;
          right: 6px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.35);
          width: 24px;
          height: 24px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.15s ease, color 0.15s ease, background-color 0.15s ease;
        }

        .playlist-row-wrapper:hover .btn-delete-playlist {
          opacity: 1;
        }

        .btn-delete-playlist:hover {
          color: var(--accent-red);
          background-color: var(--accent-red-dim);
        }

        .no-playlists-hint {
          padding: 8px 12px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.35);
          font-style: italic;
        }

        .playlist-item {
          font-size: 13px;
          padding: 7px 12px;
        }

        .sidebar-playlist-title {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          color: rgba(255, 255, 255, 0.82);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        .nav-item.active .sidebar-playlist-title {
          color: #ffffff !important;
          font-weight: 600 !important;
        }

        .playlist-icon {
          flex-shrink: 0;
          opacity: 0.7;
        }
      `}</style>
    </aside>
  );
};
