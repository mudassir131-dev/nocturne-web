import type { Track, Playlist } from '../types/music';

const STORAGE_KEY = 'nocturne_custom_playlists';

// Apple Music style default playlist artwork
const DEFAULT_PLAYLIST_ART = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';

export function getCustomPlaylists(): Playlist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to get custom playlists:', e);
  }
  return [];
}

export function saveCustomPlaylists(playlists: Playlist[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    window.dispatchEvent(new Event('nocturne_playlists_updated'));
  } catch (e) {
    console.error('Failed to save custom playlists:', e);
  }
}

export function createCustomPlaylist(title: string): Playlist {
  const playlists = getCustomPlaylists();
  const id = `user-pl-${Date.now()}`;
  
  const newPlaylist: Playlist = {
    id,
    title: title.trim() || 'New Playlist',
    curator: 'You',
    description: 'Custom playlist created by you.',
    artworkUrl: DEFAULT_PLAYLIST_ART,
    trackCount: 0,
    tracks: []
  };

  playlists.unshift(newPlaylist);
  saveCustomPlaylists(playlists);
  return newPlaylist;
}

export function getPlaylistById(id: string, curatedPlaylists: Playlist[]): Playlist | undefined {
  const custom = getCustomPlaylists().find((p) => p.id === id);
  if (custom) return custom;
  return curatedPlaylists.find((p) => p.id === id);
}

export function addTrackToPlaylist(playlistId: string, track: Track): boolean {
  const playlists = getCustomPlaylists();
  const pl = playlists.find((p) => p.id === playlistId);
  if (!pl) return false;
  if (!pl.tracks.some((t) => t.id === track.id)) {
    pl.tracks.push(track);
    pl.trackCount = pl.tracks.length;
    saveCustomPlaylists(playlists);
    return true;
  }
  return false;
}

export function deleteCustomPlaylist(playlistId: string): boolean {
  const playlists = getCustomPlaylists();
  const filtered = playlists.filter((p) => p.id !== playlistId);
  if (filtered.length !== playlists.length) {
    saveCustomPlaylists(filtered);
    return true;
  }
  return false;
}

