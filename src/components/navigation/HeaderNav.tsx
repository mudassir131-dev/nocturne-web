import React from 'react';
import { ChevronLeft, ChevronRight, User, ShieldCheck, Search } from 'lucide-react';

interface HeaderNavProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  title?: string;
  onSearchClick?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  title,
  onSearchClick
}) => {
  return (
    <header className="apple-header-nav">
      <div className="header-left">
        <div className="nav-history-buttons">
          <button
            className="history-btn"
            disabled={!canGoBack}
            onClick={onGoBack}
            title="Go Back"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="history-btn"
            disabled={!canGoForward}
            onClick={onGoForward}
            title="Go Forward"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {title && <h2 className="header-page-indicator">{title}</h2>}
      </div>

      <div className="header-right">
        {onSearchClick && (
          <button
            className="header-search-btn"
            onClick={onSearchClick}
            title="Search Music"
          >
            <Search size={16} />
          </button>
        )}

        <div className="audio-badge" title="Apple Lossless Audio (ALAC 24-bit/48kHz)">
          <ShieldCheck size={14} className="badge-icon" />
          <span>Lossless</span>
        </div>

        <button className="user-profile-pill" title="Apple ID Account">
          <div className="avatar-circle">
            <User size={15} />
          </div>
          <span className="profile-name">India</span>
        </button>
      </div>

      <style>{`
        .apple-header-nav {
          height: 60px;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          background: rgba(10, 11, 16, 0.42);
          backdrop-filter: blur(40px) saturate(190%);
          -webkit-backdrop-filter: blur(40px) saturate(190%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          position: sticky;
          top: 0;
          z-index: 20;
        }

        @media (max-width: 768px) {
          .apple-header-nav {
            padding: 0 16px;
            height: 52px;
            min-height: 52px;
          }
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-history-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .history-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background-color: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
          transition: background-color var(--transition-fast), opacity var(--transition-fast);
        }

        .history-btn:hover:not(:disabled) {
          background-color: rgba(255, 255, 255, 0.16);
        }

        .header-page-indicator {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .header-search-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background-color: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
          display: none;
        }

        @media (max-width: 900px) {
          .header-search-btn {
            display: inline-flex;
          }
        }

        .audio-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-subtle);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          letter-spacing: 0.02em;
        }

        .badge-icon {
          color: var(--accent-red);
        }

        .user-profile-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px 4px 4px;
          border-radius: var(--radius-full);
          background-color: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 500;
          transition: background-color var(--transition-fast);
        }

        .user-profile-pill:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }

        .avatar-circle {
          width: 26px;
          height: 26px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.12) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .profile-name {
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </header>
  );
};
