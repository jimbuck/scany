import * as debug from 'debug';
import * as ytpl from 'ytpl';
import pMap from 'p-map';
import { FeedResult, Thumbnails, extractPlaylistId, extractVideoId, query, VideoResult } from 'pully-core';

const log = debug('scany');
const DEFAULT_CONCURRENCY = 8;
const DEFAULT_CHANNEL_LIMIT = 10;

export { FeedResult, VideoResult, Thumbnails };

export async function scanFeed(url: string, opts?: {limit?: number, concurrency?: number}): Promise<FeedResult> {
  const now = new Date();

  let videoId = extractVideoId(url);
  if (videoId) throw new Error(`A video URL (${url}) was provided, use Scany#fetchVideo instead.`);

  let playlistId = extractPlaylistId(url);
  if (playlistId && playlistId === 'WL') {
    throw new Error('Watch Later playlists are not supported!');
  }

  opts = Object.assign({
    limit: playlistId ? Number.MAX_SAFE_INTEGER : DEFAULT_CHANNEL_LIMIT,
    concurrency: DEFAULT_CONCURRENCY
  }, opts);

  log(`Querying feed '${url}'...`);

  const plResult = await ytpl(url, { limit: opts.limit });
  return {
    lastScanned: now,
    channelId: plResult.author.id,
    channelName: plResult.author.name,
    channelUrl: plResult.author.channel_url,
    playlistId: plResult.id,
    playlistTitle: plResult.title,
    playlistUrl: plResult.url,
    videos: await pMap(plResult.items, async (v) => {

      const vidResult = await query(v.url_simple);
      
      // Hard delete bloated data (just use pully-core if it is needed)
      delete vidResult.formats;
      delete vidResult.raw;

      return Object.assign({
        videoId: v.id,
        videoTitle: v.title,
        videoUrl: v.url_simple,
        channelName: v.author.name,
        channelId: v.author.id,
        channelUrl: v.author.channel_url,
      } as VideoResult, vidResult);
    }, { concurrency: opts.concurrency })
  };
}

/**
 * Retrieves video data.
 *
 * @param {string} urlOrId The video id or the full URL to the video.
 */
export async function scanVideo(urlOrId: string): Promise<VideoResult>;
/**
 * Retrieves video data for multiple videos.
 *
 * @param {Array<string>} urlsOrIds List of video URLs or video ids.
 */
export async function scanVideo(urlsOrIds: Array<string>, concurrency?: number): Promise<Array<VideoResult>>;
export async function scanVideo(urlsOrIds: string | Array<string>, concurrency: number = DEFAULT_CONCURRENCY): Promise<VideoResult | Array<VideoResult>> {
  let videoIds = [];
  if (typeof urlsOrIds === 'string') {
    videoIds = [extractVideoId(urlsOrIds) || urlsOrIds];
  } else {
    videoIds = urlsOrIds.map(id => extractVideoId(id) || id).filter(x => !!x);
  }

  if (videoIds.length === 0) {
    return Promise.reject(`No valid video URLs were found!`);
  }

  log(`Querying for ${videoIds.length} videos...`);

  const results = await pMap(videoIds, id => query(id), { concurrency });

  if (typeof urlsOrIds === 'string') {
    return results[0];
  } else {
    return results;
  }
}