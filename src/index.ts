import * as debug from 'debug';
const log = debug('scany');

import { FeedResult, VideoResult, Thumbnails, extractChannelId, extractPlaylistId, extractUsername, extractVideoId } from 'pully-core';
import { Scraper } from './scraper';
import { Reader } from './reader';

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

  public async feed(url: string): Promise<FeedResult> {
    let videoId = extractVideoId(url);
    if (videoId) return Promise.reject(`A video URL (${url}) was provided, use Scany#fetchVideo instead.`)
    
    let username = extractUsername(url);
    if (username) {
      const result = await this._reader.user(username);
      return result;
    }

    let playlistId = extractPlaylistId(url);
    if (playlistId) {
      if (playlistId === 'WL') return Promise.reject('Watch Later playlists are not supported!');
      return this._scraper.playlist(playlistId);
    }

    let channelId = extractChannelId(url);
    if (channelId) {
      const result = await this._reader.channel(channelId);
      return result;
    }
    
    return Promise.reject(`The provided URL (${url}) is not a supported YouTube link (channel, user, or playlist)!`);
  }

  /**
   * Retrieves video data.
   *
   * @param {string} urlOrId The video id or the full URL to the video.
   */
  public async video(urlOrId: string): Promise<VideoResult>;
  /**
   * Retrieves video data for multiple videos.
   *
   * @param {Array<string>} urlsOrIds List of video URLs or video ids.
   */
  public async video(urlsOrIds: Array<string>): Promise<Array<VideoResult>>;
  public async video(urlsOrIds: string | Array<string>): Promise<VideoResult | Array<VideoResult>> {
    let videoIds = [];
    if (typeof urlsOrIds === 'string') {
      videoIds = [extractVideoId(urlsOrIds) || urlsOrIds];
    } else {
      videoIds = urlsOrIds.map(id => extractVideoId(id) || id).filter(x => !!x);
    }

    if (videoIds.length === 0) {
      return Promise.reject(`No valid video URLs were found!`);
    }

    log(`Converting ${videoIds.length} video URLs to video Ids...`);

    const results = await this._scraper.videos(videoIds);

    if (typeof urlsOrIds === 'string') {
      return results[0];
    } else {
      return results;
    }
  }
}