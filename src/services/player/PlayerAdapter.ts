import type { Track } from '../../types/music';

export interface PlayerEvents {
  onTimeUpdate: (currentTime: number) => void;
  onDurationChange: (duration: number) => void;
  onProgress: (bufferedPercent: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  onBuffering: (isBuffering: boolean) => void;
  onError: (errorMessage: string) => void;
}

export interface PlayerAdapter {
  loadTrack(track: Track): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  seek(timeInSeconds: number): void;
  setVolume(volume: number): void; // 0 to 1
  setMuted(muted: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}
