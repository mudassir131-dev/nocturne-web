import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { X, Trash2, Music } from 'lucide-react';

export const QueueDrawer: React.FC = () => {
  const {
    queue,
    queueIndex,
    currentTrack,
    playTrack,
    removeFromQueue,
    clearQueue,
    queueDrawerOpen,
    setQueueDrawerOpen
  } = usePlayer();

  if (!queueDrawerOpen) return null;

  const upcomingTracks = queue.slice(queueIndex + 1);

  return (
    <div className="queue-drawer-overlay" onClick={() => setQueueDrawerOpen(false)}>
      <aside className="queue-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="queue-header">
          <div className="queue-title-wrap">
            <h2>Playing Next</h2>
            <span className="queue-count">{queue.length} songs</span>
          </div>

          <div className="queue-header-actions">
            <button
              className="queue-clear-btn"
              onClick={clearQueue}
              title="Clear queue"
            >
              <Trash2 size={16} />
              <span>Clear</span>
            </button>
            <button
              className="queue-close-btn"
              onClick={() => setQueueDrawerOpen(false)}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="queue-body">
          {/* Now Playing */}
          {currentTrack && (
            <div className="queue-section">
              <div className="queue-section-label">Now Playing</div>
              <div className="queue-item current">
                <img
                  src={currentTrack.artworkUrl}
                  alt={currentTrack.title}
                  className="queue-thumb"
                />
                <div className="queue-item-meta">
                  <div className="queue-item-title">{currentTrack.title}</div>
                  <div className="queue-item-artist">{currentTrack.artists.join(', ')}</div>
                </div>
                <div className="queue-status-now">
                  <span className="now-dot"></span>
                </div>
              </div>
            </div>
          )}

          {/* Up Next */}
          <div className="queue-section">
            <div className="queue-section-label">Next Up</div>
            {upcomingTracks.length === 0 ? (
              <div className="queue-empty">
                <Music size={28} className="queue-empty-icon" />
                <p>No more songs in queue</p>
                <span>Add songs using the "..." menu on any track</span>
              </div>
            ) : (
              <div className="queue-list">
                {upcomingTracks.map((track, i) => {
                  const absoluteIdx = queueIndex + 1 + i;
                  return (
                    <div
                      key={`${track.id}-${i}`}
                      className="queue-item"
                      onClick={() => playTrack(track)}
                    >
                      <img
                        src={track.artworkUrl}
                        alt={track.title}
                        className="queue-thumb"
                      />
                      <div className="queue-item-meta">
                        <div className="queue-item-title">{track.title}</div>
                        <div className="queue-item-artist">{track.artists.join(', ')}</div>
                      </div>
                      <div className="queue-item-duration">{track.durationFormatted}</div>
                      <button
                        className="queue-item-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(absoluteIdx);
                        }}
                        title="Remove from queue"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <style>{`
          .queue-drawer-overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
            z-index: 120;
            display: flex;
            justify-content: flex-end;
          }

          .queue-drawer {
            width: 380px;
            max-width: 90vw;
            height: 100%;
            background-color: #1a1a1c;
            border-left: none !important;
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }

          .queue-header {
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--border-subtle);
          }

          .queue-title-wrap h2 {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
          }

          .queue-count {
            font-size: 12px;
            color: var(--text-secondary);
          }

          .queue-header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .queue-clear-btn {
            font-size: 12px;
            color: var(--text-secondary);
            gap: 4px;
            padding: 6px 10px;
            border-radius: var(--radius-sm);
            background-color: rgba(255, 255, 255, 0.08);
          }

          .queue-clear-btn:hover {
            color: var(--accent-red);
            background-color: var(--accent-red-dim);
          }

          .queue-close-btn {
            color: var(--text-secondary);
            padding: 6px;
            border-radius: var(--radius-full);
          }

          .queue-close-btn:hover {
            color: var(--text-primary);
            background-color: var(--bg-hover);
          }

          .queue-body {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .queue-section-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-tertiary);
            margin-bottom: 10px;
          }

          .queue-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 10px;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: background-color var(--transition-fast);
          }

          .queue-item:hover {
            background-color: var(--bg-hover);
          }

          .queue-item.current {
            background-color: var(--accent-red-dim);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .queue-thumb {
            width: 40px;
            height: 40px;
            border-radius: 4px;
            object-fit: cover;
            flex-shrink: 0;
          }

          .queue-item-meta {
            flex: 1;
            min-width: 0;
          }

          .queue-item-title {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .queue-item.current .queue-item-title {
            color: var(--accent-red);
          }

          .queue-item-artist {
            font-size: 11px;
            color: var(--text-secondary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .queue-item-duration {
            font-size: 12px;
            color: var(--text-tertiary);
            font-variant-numeric: tabular-nums;
          }

          .queue-item-remove {
            color: var(--text-tertiary);
            padding: 4px;
            border-radius: var(--radius-full);
            opacity: 0;
            transition: opacity var(--transition-fast), color var(--transition-fast);
          }

          .queue-item:hover .queue-item-remove {
            opacity: 1;
          }

          .queue-item-remove:hover {
            color: var(--accent-red);
          }

          .now-dot {
            width: 8px;
            height: 8px;
            border-radius: var(--radius-full);
            background-color: var(--accent-red);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
          }

          .queue-empty {
            text-align: center;
            padding: 40px 10px;
            color: var(--text-secondary);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }

          .queue-empty-icon {
            color: var(--text-tertiary);
            margin-bottom: 4px;
          }

          .queue-empty p {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
          }

          .queue-empty span {
            font-size: 12px;
            color: var(--text-secondary);
          }
        `}</style>
      </aside>
    </div>
  );
};
