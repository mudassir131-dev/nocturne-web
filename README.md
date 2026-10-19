# Apple Music India — Web Player

A production-quality web music player inspired by the [Apple Music India](https://music.apple.com/in/new) experience, featuring a pixel-accurate visual design system, full media playback engine, synchronized lyrics with auto-scrolling karaoke highlighting, and a robust InnerTube data and stream resolution layer.

---

## 🎧 Features Overview

### 1. Apple Music India Visual Design System
- **Dark Mode Surface & Typography**: Authentic Apple typography stack (`SF Pro`, `-apple-system`, `BlinkMacSystemFont`), `#000000` deep base, and Apple Music signature brand red (`#fa233b`).
- **Sidebar Navigation**:
  - Apple Music brand lockup & live search input.
  - Core navigation: **Home**, **New** (default India landing view), **Radio**.
  - **Library**: Recently Added, Artists, Albums, Songs.
  - **Curated Indian Playlists**: Top 100: India, New Music Daily, A-List: Punjabi, Bollywood Romance, South Indian Sensations.
- **Top Header**: History back/forward buttons, active section indicator, Apple Lossless audio badge, and India account pill.
- **Editorial Hero Shelf**: Large interactive carousel mirroring the Apple Music India hero section with instant play and detail navigation.
- **Artwork Cards & Content Shelves**: Rounded artwork cards with hover quick-play buttons, title, subtitle, and explicit badges.
- **Interactive Track Rows**: Track number, live animated 3-bar equalizer when active, title, artists, album, duration, and context menus (`Play Next`, `Add to Queue`, `Favorite`).

---

### 2. Audio Playback Engine (`BrowserAudioAdapter`)
- Built upon browser media standards (`HTMLAudioElement`) wrapped in a clean, decoupled `PlayerAdapter` contract.
- Single source of truth managed via `PlayerContext`.
- **Playback Capabilities**:
  - Play, pause, instant seek with real-time scrub bar.
  - Previous track, Next track, Auto-advance on track end.
  - Shuffle mode & Repeat modes (`Off`, `All`, `One`).
  - Volume control with mute toggle and smooth range slider.
  - Buffering indicators, stream error recovery, and System Media Session integration.

---

### 3. Persistent Mini-Player & Expanded Player
- **Persistent Mini-Player**:
  - Attached to bottom with frosted acrylic blur (`rgba(24, 24, 27, 0.88)` with `backdrop-filter: blur(28px)`).
  - Center-mounted track info, artwork thumbnail, elapsed time, and negative remaining time (`-02:45`).
  - Right-side controls for Lyrics toggle, Queue drawer toggle, Volume slider, and Expand button.
- **Expanded Now-Playing Screen**:
  - Immersive modal with dynamic ambient backdrop reflecting artwork colors.
  - High-resolution artwork stage, Lossless badge, and transport controls.
  - Dual-panel layout on desktop: transport controls on the left, live synchronized lyrics or up-next queue on the right.

---

### 4. Dedicated Synchronized Lyrics Experience (`LyricsView`)
- Real-time synchronized lyrics parsed from timestamped LRC data.
- **Active Line Highlighting**: The currently sung line is illuminated with bold white text, large font, and glowing drop-shadow. Past and future lines are softly dimmed.
- **Auto-Scrolling**: Automatically scrolls the lyrics viewport to keep the active line centered.
- **Click-to-Seek**: Clicking any lyric line immediately jumps playback to that exact timestamp.
- **Graceful Fallbacks**: Displays plain text lyrics when synced timestamps are unavailable, or a friendly instrumental/unavailable state.

---

### 5. InnerTube Search & Audio Stream Layer
- Implemented via a separate service layer (`server/innertube-service.ts`) and Vite middleware (`server/apiPlugin.ts`):
  - `GET /api/music/search?q=...`: Real-time music search with debouncing.
  - `GET /api/music/stream/:id`: Stream resolver and audio proxy with **HTTP 206 Partial Content Range** support for smooth browser streaming and scrubbing.
  - `GET /api/music/lyrics?track=...&artist=...`: Synchronized lyrics retrieval via LRCLIB with search fallback.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Play / Pause toggle |
| <kbd>←</kbd> / <kbd>→</kbd> | Seek backward / forward 5 seconds |
| <kbd>[</kbd> / <kbd>]</kbd> | Previous / Next track |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Increase / Decrease volume |
| <kbd>M</kbd> | Mute / Unmute audio |
| <kbd>L</kbd> | Toggle Lyrics screen |
| <kbd>Esc</kbd> | Close Expanded Player or Queue Drawer |

---

## 🚀 Running the Project

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` (or the port indicated in terminal) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```
