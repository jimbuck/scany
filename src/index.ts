import * as debug from 'debug';
const log = debug('scany');

import { FeedResult, VideoResult, Thumbnails } from './models';
import { Scraper } from './scraper';
import { Reader } from './reader';
import { extractChannelId, extractPlaylistId, extractVideoId, extractUsername } from './parser';

export { FeedResult, VideoResult, Thumbnails };

/**
 * Youtube scraper and feed reader that provides access to channel, playlist, and video data.
 */
export class Scany {

  private _scraper: Scraper;
  private _reader: Reader;

  /**
   * Creates an instance of Scany.
   * @param {{ show?: boolean, concurrency?: number }} [{ show, concurrency }={}]
   */
  constructor({ show, concurrency }: { show?: boolean, concurrency?: number } = {}) {
    this._scraper = new Scraper({ show, concurrency });
    this._reader = new Reader();
  }

  public async feed(url: string, includeVideos: boolean = true): Promise<FeedResult> {
    let videoId = extractVideoId(url);
    if (videoId) return Promise.reject(`A video URL (${url}) was provided, use Scany#fetchVideo instead.`)
    
    let username = extractUsername(url);
    if (username) {
      const result = await this._reader.user(username);
      if (includeVideos) result.videos = await this.videos(result.videos.map(v => v.videoId));
      return result;
    }

    let playlistId = extractPlaylistId(url);
    if (playlistId) {
      if (playlistId === 'WL') return Promise.reject('Watch Later playlists are not supported!');
      return this._scraper.playlist(playlistId, includeVideos);
    }

    let channelId = extractChannelId(url);
    if (channelId) {
      const result = await this._reader.channel(channelId);
      if (includeVideos) result.videos = await this.videos(result.videos.map(v => v.videoId));
      return result;
    }
    
    return Promise.reject(`The provided URL (${url}) is not a supported YouTube link (channel, user, or playlist)!`);
  }

  /**
   * Retrieves video data.
   *
   * @param {string} urlOrId The video id or the full URL to the video.
   */
  public async video(urlOrId: string): Promise<VideoResult> {
    const videoId = extractVideoId(urlOrId) || urlOrId;

    if (!videoId) {
      return Promise.reject(`URL ${urlOrId} does not reference a video!`);
    }

    return this._scraper.video(videoId);
  }

  /**
   * Retrieves video data for multiple videos.
   *
   * @param {Array<string>} urlsOrIds List of video URLs or video ids.
   */
  public async videos(urlsOrIds: Array<string>): Promise<Array<VideoResult>> {
    urlsOrIds = urlsOrIds.filter(x => !!x);

    if (urlsOrIds.length === 0) {
      return Promise.reject(`No valid video URLs were found!`);
    }

    log(`Converting ${urlsOrIds.length} video URLs to video Ids...`);
    let videoUrls = urlsOrIds as Array<string>;
    let videoIds = videoUrls.map(id => extractVideoId(id) || id).filter(id => !!id);
    
    if (videoIds.length === 0) {
      return Promise.reject(`No valid videoIds were found!`);
    }

    return this._scraper.videos(videoIds);
  }

  public async batch(batchFn: (s: any) => Promise<void>): Promise<void> {

  }
}