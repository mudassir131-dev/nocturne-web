import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Liquid Glass Desktop Background
 * Replaces the song-adaptive wallpaper with a fixed, ultra-premium Liquid Glass aesthetic:
 * - Dark Mode: Deep dark obsidian liquid glass with subtle ambient caustic reflections
 * - Light Mode: Clean luminous frosted ice liquid glass
 * - Non-adaptive to songs on the Home & Browsing views (as requested)
 * - The Full Player (DedicatedPlayer) maintains its own independent fluid dynamic background
 */
export const AdaptiveDesktopWallpaper: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`liquid-glass-background-container ${theme}`}>
      {/* 1. Ambient Glass Caustic Aura (Dark or Light) */}
      <div className="glass-ambient-aura" />

      {/* 2. Frosted Surface Refraction Lens */}
      <div className="glass-refraction-lens" />

      {/* 3. Subtle Gloss Specular Gradient */}
      <div className="glass-specular-sheen" />

      <style>{`
        .liquid-glass-background-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
          contain: strict;
          transform: translateZ(0);
          transition: background 0.4s ease;
        }

        /* Dark Mode: Deep Dark Obsidian Liquid Glass */
        .liquid-glass-background-container.dark {
          background-color: #0a0b0e;
          background-image: 
            radial-gradient(circle at 50% -5%, rgba(36, 42, 60, 0.45) 0%, rgba(10, 11, 14, 0.98) 72%),
            radial-gradient(circle at 15% 30%, rgba(25, 28, 40, 0.25) 0%, transparent 60%),
            radial-gradient(circle at 85% 70%, rgba(20, 22, 34, 0.25) 0%, transparent 60%);
        }

        /* Light Mode: Clean Luminous Frosted Ice Liquid Glass */
        .liquid-glass-background-container.light {
          background-color: #f5f6fa;
          background-image: 
            radial-gradient(circle at 50% -5%, rgba(224, 232, 250, 0.85) 0%, rgba(245, 246, 250, 1) 75%),
            radial-gradient(circle at 15% 25%, rgba(235, 240, 255, 0.6) 0%, transparent 55%),
            radial-gradient(circle at 85% 65%, rgba(230, 238, 252, 0.5) 0%, transparent 55%);
        }

        /* 1. Ambient Caustic Aura */
        .glass-ambient-aura {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.85;
          mix-blend-mode: normal;
          transition: opacity 0.4s ease;
        }

        .dark .glass-ambient-aura {
          background: radial-gradient(
            circle at 50% 15%,
            rgba(255, 255, 255, 0.03) 0%,
            transparent 60%
          );
        }

        .light .glass-ambient-aura {
          background: radial-gradient(
            circle at 50% 15%,
            rgba(255, 255, 255, 0.8) 0%,
            transparent 65%
          );
        }

        /* 2. Frosted Surface Refraction Lens */
        .glass-refraction-lens {
          position: absolute;
          inset: 0;
          backdrop-filter: blur(60px);
          -webkit-backdrop-filter: blur(60px);
          pointer-events: none;
        }

        /* 3. Subtle Gloss Specular Gradient */
        .glass-specular-sheen {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .dark .glass-specular-sheen {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.02) 0%,
            rgba(255, 255, 255, 0.005) 45%,
            rgba(0, 0, 0, 0.25) 100%
          );
        }

        .light .glass-specular-sheen {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(0, 0, 0, 0.03) 100%
          );
        }
      `}</style>
    </div>
  );
};

export default AdaptiveDesktopWallpaper;
