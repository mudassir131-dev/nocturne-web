import type { LyricsResult, LyricsSearchQuery } from './types.js';
import { fetchFromKuGou } from './providers/kugou.js';
import { fetchFromLrcLib } from './providers/lrclib.js';
import { fetchFromYouLyPlus } from './providers/youlyplus.js';
import { fetchFromSimpMusic } from './providers/simpmusic.js';
import { fetchFromPaxsenix } from './providers/paxsenix.js';
import { fetchFromBetterLyrics, fetchFromUnison } from './providers/betterlyrics.js';
import { fetchFromYouTube } from './providers/youtube.js';

// Cache to prevent duplicate network calls during repeated playback
const lyricsCache = new Map<string, { result: LyricsResult; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export async function fetchMultiProviderLyrics(query: LyricsSearchQuery): Promise<LyricsResult> {
  const { title, artist, videoId } = query;
  if (!title && !videoId) {
    return {
      found: false,
      provider: 'none',
      syncedLyrics: null,
      plainLyrics: null
    };
  }

  const cacheKey = `${videoId || ''}-${title.toLowerCase()}-${artist.toLowerCase()}`;
  const cached = lyricsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  console.log(`[LyricsEngine] Fetching lyrics for "${title}" - "${artist}" (videoId: ${videoId || 'n/a'})...`);

  // Tier 1: Race primary providers in parallel
  // LRCLib, KuGou, and YouLyPlus have the highest availability and quality
  const tier1Promises = [
    fetchFromLrcLib(query).catch(() => null),
    fetchFromKuGou(query).catch(() => null),
    fetchFromYouLyPlus(query).catch(() => null)
  ];

  const tier1Results = await Promise.allSettled(tier1Promises);
  const validTier1 = tier1Results
    .map(r => (r.status === 'fulfilled' ? r.value : null))
    .filter((r): r is LyricsResult => r !== null && r.found);

  // If any Tier 1 provider returned synchronized lyrics, prioritize it!
  const syncedTier1 = validTier1.find(r => r.syncedLyrics && r.syncedLyrics.length > 0);
  if (syncedTier1) {
    console.log(`[LyricsEngine] Found synchronized lyrics via ${syncedTier1.provider}!`);
    lyricsCache.set(cacheKey, { result: syncedTier1, timestamp: Date.now() });
    return syncedTier1;
  }

  // Tier 2: Check auxiliary providers
  const tier2Promises = [
    fetchFromPaxsenix(query).catch(() => null),
    fetchFromSimpMusic(query).catch(() => null),
    fetchFromUnison(query).catch(() => null),
    fetchFromBetterLyrics(query).catch(() => null)
  ];

  const tier2Results = await Promise.allSettled(tier2Promises);
  const validTier2 = tier2Results
    .map(r => (r.status === 'fulfilled' ? r.value : null))
    .filter((r): r is LyricsResult => r !== null && r.found);

  const syncedTier2 = validTier2.find(r => r.syncedLyrics && r.syncedLyrics.length > 0);
  if (syncedTier2) {
    console.log(`[LyricsEngine] Found synchronized lyrics via ${syncedTier2.provider}!`);
    lyricsCache.set(cacheKey, { result: syncedTier2, timestamp: Date.now() });
    return syncedTier2;
  }

  // Tier 3: YouTube captions & official lyrics
  if (videoId) {
    const ytResult = await fetchFromYouTube(query).catch(() => null);
    if (ytResult && ytResult.found) {
      console.log(`[LyricsEngine] Found lyrics via YouTube Innertube!`);
      lyricsCache.set(cacheKey, { result: ytResult, timestamp: Date.now() });
      return ytResult;
    }
  }

  // Fallback to any plain lyrics found in Tier 1 or Tier 2
  const plainMatch = [...validTier1, ...validTier2].find(r => r.plainLyrics && r.plainLyrics.length > 0);
  if (plainMatch) {
    console.log(`[LyricsEngine] Found plain lyrics via ${plainMatch.provider}!`);
    lyricsCache.set(cacheKey, { result: plainMatch, timestamp: Date.now() });
    return plainMatch;
  }

  console.log(`[LyricsEngine] No lyrics found across all providers for "${title}".`);
  const notFound: LyricsResult = {
    found: false,
    provider: 'none',
    syncedLyrics: null,
    plainLyrics: null
  };
  return notFound;
}

export * from './types.js';
