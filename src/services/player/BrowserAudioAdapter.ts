import type { PlayerAdapter, PlayerEvents } from './PlayerAdapter';
import type { Track } from '../../types/music';

export class BrowserAudioAdapter implements PlayerAdapter {
  private audio: HTMLAudioElement;
  private events: PlayerEvents;
  private currentTrack: Track | null = null;
  private isDestroyed = false;

  constructor(events: PlayerEvents) {
    this.events = events;
    this.audio = new Audio();
    this.audio.preload = 'auto';

    this.setupListeners();
  }

  private setupListeners() {
    this.audio.addEventListener('timeupdate', () => {
      if (!this.isDestroyed) {
        this.events.onTimeUpdate(this.audio.currentTime);
      }
    });

    this.audio.addEventListener('durationchange', () => {
      if (!this.isDestroyed && this.audio.duration && !isNaN(this.audio.duration)) {
        this.events.onDurationChange(this.audio.duration);
      }
    });

    this.audio.addEventListener('progress', () => {
      if (!this.isDestroyed && this.audio.buffered.length > 0 && this.audio.duration) {
        const bufferedEnd = this.audio.buffered.end(this.audio.buffered.length - 1);
        const percent = (bufferedEnd / this.audio.duration) * 100;
        this.events.onProgress(percent);
      }
    });

    this.audio.addEventListener('play', () => {
      if (!this.isDestroyed) {
        this.events.onPlay();
        if (this.audio.readyState >= 2) {
          this.events.onBuffering(false);
        }
      }
    });

    this.audio.addEventListener('playing', () => {
      if (!this.isDestroyed) {
        this.events.onBuffering(false);
        this.events.onPlay();
      }
    });

    this.audio.addEventListener('loadeddata', () => {
      if (!this.isDestroyed) {
        this.events.onBuffering(false);
      }
    });

    this.audio.addEventListener('canplaythrough', () => {
      if (!this.isDestroyed) {
        this.events.onBuffering(false);
      }
    });

    this.audio.addEventListener('pause', () => {
      if (!this.isDestroyed) {
        this.events.onPause();
      }
    });

    this.audio.addEventListener('ended', () => {
      if (!this.isDestroyed) {
        this.events.onEnded();
      }
    });

    this.audio.addEventListener('waiting', () => {
      if (!this.isDestroyed) {
        this.events.onBuffering(true);
      }
    });

    this.audio.addEventListener('canplay', () => {
      if (!this.isDestroyed) {
        this.events.onBuffering(false);
      }
    });

    this.audio.addEventListener('error', () => {
      if (!this.isDestroyed) {
        this.events.onBuffering(false);
        const err = this.audio.error;
        let message = 'Audio playback error';
        if (err) {
          switch (err.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              message = 'Playback aborted by user';
              break;
            case MediaError.MEDIA_ERR_NETWORK:
              message = 'Network error while loading stream';
              break;
            case MediaError.MEDIA_ERR_DECODE:
              message = 'Audio stream decoding error';
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              message = 'Audio stream format or source not supported';
              break;
            default:
              message = err.message || 'Unknown media error';
          }
        }
        this.events.onError(message);
      }
    });
  }

  private bufferingWatchdog: any = null;

  public async loadTrack(track: Track): Promise<void> {
    this.currentTrack = track;
    this.events.onBuffering(true);

    if (this.bufferingWatchdog) {
      clearTimeout(this.bufferingWatchdog);
    }
    // Safety watchdog: never let buffering spinner get permanently stuck
    this.bufferingWatchdog = setTimeout(() => {
      if (!this.isDestroyed && (this.audio.currentTime > 0 || this.audio.readyState >= 2)) {
        this.events.onBuffering(false);
      }
    }, 2000);

    // Audio stream endpoint resolved through InnerTube backend proxy with title/artist fallback
    const artistsStr = Array.isArray(track.artists) ? track.artists.join(' ') : (track.artists || '');
    const streamUrl = `/api/music/stream/${encodeURIComponent(track.id)}?title=${encodeURIComponent(track.title || '')}&artist=${encodeURIComponent(artistsStr)}`;

    this.audio.src = streamUrl;
    this.audio.load();

    // If media session is supported, set system metadata
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: Array.isArray(track.artists) ? track.artists.join(', ') : track.artists,
        album: track.album || 'Apple Music',
        artwork: [
          { src: track.artworkUrl, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => this.play());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          this.seek(details.seekTime);
        }
      });
    }

    try {
      await this.play();
      this.events.onBuffering(false);
    } catch (err: any) {
      // Autoplay restriction or network pause
      if (err.name === 'NotAllowedError') {
        console.warn('Autoplay prevented by browser: User interaction required.');
      } else {
        console.error('Play error after loading track:', err);
      }
      this.events.onBuffering(false);
    }
  }

  public getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  public async play(): Promise<void> {
    if (this.audio.src) {
      await this.audio.play();
      if (this.audio.readyState >= 2) {
        this.events.onBuffering(false);
      }
    }
  }

  public pause(): void {
    this.audio.pause();
    this.events.onBuffering(false);
  }

  public seek(timeInSeconds: number): void {
    if (this.audio.duration && !isNaN(this.audio.duration)) {
      const clamped = Math.max(0, Math.min(timeInSeconds, this.audio.duration));
      this.audio.currentTime = clamped;
    }
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(volume, 1));
    this.audio.volume = clamped;
  }

  public setMuted(muted: boolean): void {
    this.audio.muted = muted;
  }

  public getCurrentTime(): number {
    return this.audio.currentTime || 0;
  }

  public getDuration(): number {
    return this.audio.duration || 0;
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (this.bufferingWatchdog) {
      clearTimeout(this.bufferingWatchdog);
    }
    this.audio.pause();
    this.audio.src = '';
  }
}
