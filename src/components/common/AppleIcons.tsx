import React from 'react';

/**
 * Exact Apple Music Transport SVGs matching native Apple Music UI:
 * - Rewind: Solid double triangles (no vertical bar)
 * - Forward: Solid double triangles (no vertical bar)
 * - Play: Solid rounded triangle
 * - Pause: Two solid rounded vertical bars
 * - Shuffle: Crossing arrows
 * - Repeat: Looping rounded arrows
 * - Queue: 3 lines with bullet dots
 * - Speaker: Speaker cone with sound arcs
 */

export const AppleRewindIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ display: 'block' }}>
    {/* Right triangle */}
    <path d="M20 6.24v11.52c0 .83-.9 1.34-1.62.92l-9-5.76c-.71-.41-.71-1.43 0-1.84l9-5.76c.72-.42 1.62.09 1.62.92z" />
    {/* Left triangle */}
    <path d="M11.8 6.24v11.52c0 .83-.9 1.34-1.62.92l-9-5.76c-.71-.41-.71-1.43 0-1.84l9-5.76c.72-.42 1.62.09 1.62.92z" />
  </svg>
);

export const AppleForwardIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ display: 'block' }}>
    {/* Left triangle */}
    <path d="M4 6.24v11.52c0 .83.9 1.34 1.62.92l9-5.76c.71-.41.71-1.43 0-1.84l-9-5.76c-.72-.42-1.62.09-1.62.92z" />
    {/* Right triangle */}
    <path d="M12.2 6.24v11.52c0 .83.9 1.34 1.62.92l9-5.76c.71-.41.71-1.43 0-1.84l-9-5.76c-.72-.42-1.62.09-1.62.92z" />
  </svg>
);

export const ApplePlayIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ display: 'block' }}>
    <path d="M7 5.24v13.52c0 .87.95 1.41 1.7.97l11.5-6.76c.74-.44.74-1.5 0-1.94L8.7 4.27c-.75-.44-1.7.1-1.7.97z" />
  </svg>
);

export const ApplePauseIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ display: 'block' }}>
    <rect x="6" y="4" width="3.8" height="16" rx="1.9" />
    <rect x="14.2" y="4" width="3.8" height="16" rx="1.9" />
  </svg>
);

export const AppleShuffleIcon: React.FC<{ size?: number; className?: string; active?: boolean }> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'block' }}>
    <path d="M16 3h5v5" />
    <path d="M4 20L21 3" />
    <path d="M21 16v5h-5" />
    <path d="M15 15l6 6" />
    <path d="M4 4l5 5" />
  </svg>
);

export const AppleRepeatIcon: React.FC<{ size?: number; mode?: 'off' | 'all' | 'one'; className?: string }> = ({ size = 16, mode = 'off', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'block' }}>
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    {mode === 'one' && (
      <text x="12" y="15" fontSize="8" fontWeight="bold" fill="currentColor" textAnchor="middle" stroke="none">1</text>
    )}
  </svg>
);

export const AppleQueueIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'block' }}>
    <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
    <line x1="9" y1="6" x2="21" y2="6" />
    <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <line x1="9" y1="12" x2="21" y2="12" />
    <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
    <line x1="9" y1="18" x2="21" y2="18" />
  </svg>
);

export const AppleSpeakerIcon: React.FC<{ size?: number; isMuted?: boolean; volume?: number; className?: string }> = ({ size = 18, isMuted = false, volume = 1, className }) => {
  if (isMuted || volume === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'block' }}>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'block' }}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
};

/**
 * Mobile Navigation Bar Apple Icons
 */

// Solid Red / Symmetrical House Icon
export const AppleHomeIcon: React.FC<{ size?: number; filled?: boolean; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ display: 'block' }}>
    <path d="M12 2.5l9 7.2v10.8a1.5 1.5 0 0 1-1.5 1.5h-4.5a1 1 0 0 1-1-1v-4.5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4.5a1 1 0 0 1-1 1H4.5A1.5 1.5 0 0 1 3 20.5V9.7l9-7.2z" />
  </svg>
);

// 4-Squares Grid Icon ("New")
export const AppleGridIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ display: 'block' }}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
  </svg>
);

// Radio Broadcast Waves Icon ("Radio")
export const AppleRadioWavesIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    <path d="M16.2 7.8a6 6 0 0 1 0 8.4" />
    <path d="M7.8 16.2a6 6 0 0 1 0-8.4" />
    <path d="M19.5 4.5a11 11 0 0 1 0 15" />
    <path d="M4.5 19.5a11 11 0 0 1 0-15" />
  </svg>
);

// Music Library Folder / Box Icon ("Library")
export const AppleLibraryFolderIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ display: 'block' }}>
    <path opacity="0.6" d="M6 3.5h12a1.5 1.5 0 0 1 1.5 1.5v1.2H4.5V5A1.5 1.5 0 0 1 6 3.5z" />
    <path opacity="0.8" d="M4.5 7.2h15a1 1 0 0 1 1 1v1.2H3.5V8.2a1 1 0 0 1 1-1z" />
    <rect x="2.5" y="10.2" width="19" height="10.8" rx="2.5" />
    <path d="M11 17.2a1.4 1.4 0 1 1-1.4-1.4c.25 0 .5.08.7.22V13h3.4v2.4a1.4 1.4 0 1 1-1.4-1.4c.25 0 .5.08.7.22v-2.02H11v5z" fill="var(--bg-primary, #0a0b0f)" />
  </svg>
);

// Search Magnifying Glass Icon
export const AppleSearchLensIcon: React.FC<{ size?: number; className?: string }> = ({ size = 21, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'block' }}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="21" y1="21" x2="15.2" y2="15.2" />
  </svg>
);
