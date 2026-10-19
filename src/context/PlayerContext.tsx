import React, { createContext, useContext, useEffect, useRef, useState, useMemo } from 'react';
import type { Track, RepeatMode } from '../types/music';
import { BrowserAudioAdapter } from '../services/player/BrowserAudioAdapter';
import type { PlayerAdapter } from '../services/player/PlayerAdapter';
import { INITIAL_TRACKS } from '../data/appleMusicCatalog';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  queueIndex: number;
  isBuffering: boolean;
  error: string | null;
  expandedPlayerOpen: boolean;
  lyricsViewActive: boolean;
  queueDrawerOpen: boolean;
  recentlyPlayed: Track[];
  
  // Actions
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  seek: (timeInSeconds: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (track: Track) => void;
  playNext: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  setExpandedPlayerOpen: (open: boolean) => void;
  setLyricsViewActive: (active: boolean) => void;
  setQueueDrawerOpen: (open: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [buffered, setBuffered] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<Track[]>(INITIAL_TRACKS);
  const [queueIndex, setQueueIndex] = useState<number>(-1);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Overlay states
  const [expandedPlayerOpen, setExpandedPlayerOpen] = useState<boolean>(false);
  const [lyricsViewActive, setLyricsViewActive] = useState<boolean>(false);
  const [queueDrawerOpen, setQueueDrawerOpen] = useState<boolean>(false);

  // Recently played tracks
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('nocturne_recently_played');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load recently played:', e);
    }
    return INITIAL_TRACKS.slice(0, 10);
  });

  const adapterRef = useRef<PlayerAdapter | null>(null);
  const repeatModeRef = useRef(repeatMode);
  const queueRef = useRef(queue);
  const queueIndexRef = useRef(queueIndex);
  const isShuffleRef = useRef(isShuffle);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    queueIndexRef.current = queueIndex;
  }, [queueIndex]);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  // Initialize PlayerAdapter once
  useEffect(() => {
    const adapter = new BrowserAudioAdapter({
      onTimeUpdate: (time) => {
        setCurrentTime(time);
        if (time > 0) setIsBuffering(false);
      },
      onDurationChange: (dur) => setDuration(dur),
      onProgress: (percent) => setBuffered(percent),
      onPlay: () => {
        setIsPlaying(true);
        setIsBuffering(false);
      },
      onPause: () => setIsPlaying(false),
      onBuffering: (buffering) => setIsBuffering(buffering),
      onError: (msg) => {
        setIsBuffering(false);
        setError(msg);
      },
      onEnded: () => {
        handleTrackEnded();
      }
    });

    adapterRef.current = adapter;
    adapter.setVolume(volume);

    return () => {
      adapter.destroy();
    };
  }, []);

  const handleTrackEnded = () => {
    const mode = repeatModeRef.current;
    if (mode === 'one') {
      adapterRef.current?.seek(0);
      adapterRef.current?.play();
      return;
    }

    const currentQueue = queueRef.current;
    const currentIndex = queueIndexRef.current;

    if (isShuffleRef.current && currentQueue.length > 1) {
      const randomIndex = Math.floor(Math.random() * currentQueue.length);
      const nextSong = currentQueue[randomIndex];
      setQueueIndex(randomIndex);
      playTrack(nextSong);
      return;
    }

    if (currentIndex < currentQueue.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextSong = currentQueue[nextIndex];
      setQueueIndex(nextIndex);
      playTrack(nextSong);
    } else if (mode === 'all' && currentQueue.length > 0) {
      setQueueIndex(0);
      playTrack(currentQueue[0]);
    } else {
      setIsPlaying(false);
    }
  };

  const playTrack = (track: Track, newQueue?: Track[]) => {
    setError(null);
    setCurrentTrack(track);

    if (newQueue) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else {
      // If track is in current queue, update index
      const idx = queueRef.current.findIndex(t => t.id === track.id);
      if (idx >= 0) {
        setQueueIndex(idx);
      } else {
        // Append to queue
        setQueue(prev => [...prev, track]);
        setQueueIndex(queueRef.current.length);
      }
    }

    if (track.duration) {
      setDuration(track.duration);
    }

    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id && t.title !== track.title);
      const updated = [track, ...filtered].slice(0, 25);
      try {
        localStorage.setItem('nocturne_recently_played', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recently played:', e);
      }
      return updated;
    });

    adapterRef.current?.loadTrack(track);
  };

  const togglePlay = () => {
    if (!currentTrack) {
      if (queue.length > 0) {
        playTrack(queue[0]);
      }
      return;
    }

    if (isPlaying) {
      adapterRef.current?.pause();
    } else {
      adapterRef.current?.play();
    }
  };

  const seek = (timeInSeconds: number) => {
    adapterRef.current?.seek(timeInSeconds);
    setCurrentTime(timeInSeconds);
  };

  const nextTrack = () => {
    const currentQueue = queueRef.current;
    const currentIndex = queueIndexRef.current;

    if (currentQueue.length === 0) return;

    if (isShuffleRef.current && currentQueue.length > 1) {
      const randomIndex = Math.floor(Math.random() * currentQueue.length);
      const nextSong = currentQueue[randomIndex];
      setQueueIndex(randomIndex);
      playTrack(nextSong);
      return;
    }

    if (currentIndex < currentQueue.length - 1) {
      const nextIndex = currentIndex + 1;
      setQueueIndex(nextIndex);
      playTrack(currentQueue[nextIndex]);
    } else if (repeatMode === 'all') {
      setQueueIndex(0);
      playTrack(currentQueue[0]);
    }
  };

  const prevTrack = () => {
    // If song played for more than 3 seconds, restart it
    if (currentTime > 3) {
      seek(0);
      return;
    }

    const currentQueue = queueRef.current;
    const currentIndex = queueIndexRef.current;

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setQueueIndex(prevIndex);
      playTrack(currentQueue[prevIndex]);
    } else {
      seek(0);
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (isMuted && clamped > 0) {
      setIsMuted(false);
      adapterRef.current?.setMuted(false);
    }
    adapterRef.current?.setVolume(clamped);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    adapterRef.current?.setMuted(newMuted);
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
  };

  const cycleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  const playNext = (track: Track) => {
    setQueue(prev => {
      const copy = [...prev];
      copy.splice(queueIndex + 1, 0, track);
      return copy;
    });
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    if (index < queueIndex) {
      setQueueIndex(prev => prev - 1);
    }
  };

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(-1);
    }
  };

  const value = useMemo(() => ({
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    queueIndex,
    isBuffering,
    error,
    expandedPlayerOpen,
    lyricsViewActive,
    queueDrawerOpen,
    recentlyPlayed,
    playTrack,
    togglePlay,
    seek,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    addToQueue,
    playNext,
    removeFromQueue,
    clearQueue,
    setExpandedPlayerOpen,
    setLyricsViewActive,
    setQueueDrawerOpen
  }), [
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    queueIndex,
    isBuffering,
    error,
    expandedPlayerOpen,
    lyricsViewActive,
    queueDrawerOpen,
    recentlyPlayed
  ]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
