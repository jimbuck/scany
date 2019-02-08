import * as debug from 'debug';
import * as ytpl from 'ytpl';
import pMap from 'p-map';
import { FeedResult, Thumbnails, extractPlaylistId, extractVideoId, query, VideoResult } from 'pully-core';
const ytsr = require('ytsr');

const log = debug('scany');
const DEFAULT_CONCURRENCY = 8;
const DEFAULT_CHANNEL_LIMIT = 10;

async function lookupPlaylist(id: string, opts: ytpl.options) {
  try {
    return await ytpl(id, opts);
  } catch (err) {
    log(`'ytpl' failed to find playlist: ${err}
${err.stack}

  ${id} -> ${JSON.stringify(opts)}`);
    return Promise.reject(err);
  }
}

export { FeedResult, VideoResult, Thumbnails };

export interface ScanyOptions {
  limit?: number;
  concurrency?: number;
  scanVideos?: boolean;
}

export async function scanFeed(url: string, opts?: ScanyOptions): Promise<FeedResult> {
  const now = new Date();

  let videoId = extractVideoId(url);
  if (videoId) throw new Error(`A video URL (${url}) was provided, use Scany#fetchVideo instead.`);

  let playlistId = extractPlaylistId(url);
  if (playlistId && playlistId === 'WL') {
    throw new Error('Watch Later playlists are not supported!');
  }

  opts = Object.assign<ScanyOptions, ScanyOptions>({
    limit: playlistId ? Number.MAX_SAFE_INTEGER : DEFAULT_CHANNEL_LIMIT,
    concurrency: DEFAULT_CONCURRENCY,
    scanVideos: true
  }, opts);

  log(`Querying feed '${url}'...`);

  const plResult = await lookupPlaylist(url, { limit: opts.limit });

  const result: FeedResult = {
    lastScanned: now,
    channelId: plResult.author.id,
    channelName: plResult.author.name,
    channelUrl: plResult.author.channel_url,
    playlistId: plResult.id,
    playlistTitle: plResult.title,
    playlistUrl: plResult.url,
    videos: plResult.items.map(v => {
      return {
        videoId: v.id,
        videoTitle: v.title,
        videoUrl: v.url_simple
      } as VideoResult;
    })
  };

  if (isChannelUploadsPlaylist(result)) {
    result.playlistTitle = result.channelName;
  }

  if (opts.scanVideos) {
    result.videos = await pMap(result.videos, async (video) => {

      const videoResult = await query(video.videoUrl);
      
      // Hard delete bloated data (just use pully-core if it is needed)
      delete videoResult.formats;
      delete videoResult.raw;

      return Object.assign(video, videoResult);
    }, { concurrency: opts.concurrency })
  }

  return result;
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

/**
 * Looks up a playlist based on the video name.
 * @param video The video to look up, requires videoTitle and channelName.
 * @param opts Used to configure the request once the feed has been found.
 */
export async function findFeed(video: VideoResult, opts?: ScanyOptions): Promise<FeedResult> {
  const playlistUrl = await _findPlaylist(video.videoTitle, video.channelName);

  return await scanFeed(playlistUrl, Object.assign({scanVideos: false} as ScanyOptions, opts));
}

function _findPlaylist(videoTitle: string, channelName: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    ytsr.getFilters(videoTitle, function(err: any, filters: any) {
      if(err) return reject(err);
      let filter = filters.get('Type').find((o: any) => o.name === 'Playlist');
        ytsr(null, { limit: 50, nextpageRef: filter.ref }, function(err: any, searchResults: any) {
          if(err) return reject(err);
          let matches = searchResults.items;
          if(matches.length === 0) return reject(`No matching playlists for video!`);
          matches = matches.filter((x: any) => x.author.name === channelName);
          if(matches.length === 0) return reject(`No matching playlists by channel '${channelName}'!`);
          resolve(matches[0].link);
        });
    });
  });
}

function isChannelUploadsPlaylist(feed: FeedResult) {
  return feed.channelId.slice(2) === feed.playlistId.slice(2);
}