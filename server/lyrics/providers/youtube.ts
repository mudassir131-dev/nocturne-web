import type { LyricsResult, LyricsSearchQuery } from '../types.js';
import { getInnertube } from '../../innertube-service.js';

export async function fetchFromYouTube(query: LyricsSearchQuery): Promise<LyricsResult | null> {
  const { videoId, title, artist } = query;
  if (!videoId) return null;

  try {
    const yt = await getInnertube();

    // 1. Try to get watch next / lyrics from YouTube Music
    try {
      const nextInfo = await yt.music.getInfo(videoId);
      const lyricsBrowseId = (nextInfo as any)?.lyrics_browse_id || (nextInfo as any)?.track_info?.lyrics?.browse_id;
      if (lyricsBrowseId) {
        const lyricsPage = await yt.music.getLyrics(lyricsBrowseId);
        if (lyricsPage && lyricsPage.description?.text) {
          return {
            found: true,
            provider: 'youtube',
            syncedLyrics: null,
            plainLyrics: lyricsPage.description.text,
            trackName: title,
            artistName: artist
          };
        }
      }
    } catch (e) {
      // Continue to captions
    }

    // 2. Try caption tracks from video info (which are timestamped!)
    try {
      const info = await yt.getInfo(videoId);
      const captionTracks = info.captions?.caption_tracks;
      if (captionTracks && captionTracks.length > 0) {
        // Find English or auto-generated caption track
        const track = captionTracks.find((c: any) => c.language_code === 'en' || c.kind !== 'asr') || captionTracks[0];
        if (track && track.base_url) {
          const capRes = await fetch(track.base_url);
          if (capRes.ok) {
            const xml = await capRes.text();
            // Parse XML <text start="12.34" dur="2.5">words</text>
            const textRegex = /<text\s+start="([\d\.]+)"(?:\s+dur="([\d\.]+)")?[^>]*>([\s\S]*?)<\/text>/gi;
            let match;
            const lines: string[] = [];
            while ((match = textRegex.exec(xml)) !== null) {
              const startSec = parseFloat(match[1]);
              const mins = Math.floor(startSec / 60);
              const secs = Math.floor(startSec % 60);
              const ms = Math.floor((startSec % 1) * 100);
              const rawWord = match[3]
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .trim();
              if (rawWord) {
                const stamp = `[${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}]`;
                lines.push(`${stamp} ${rawWord}`);
              }
            }

            if (lines.length > 0) {
              return {
                found: true,
                provider: 'youtube',
                syncedLyrics: lines.join('\n'),
                plainLyrics: null,
                trackName: title,
                artistName: artist
              };
            }
          }
        }
      }
    } catch (e) {
      // Caption track failed
    }

    return null;
  } catch (err: any) {
    return null;
  }
}
