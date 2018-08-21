import * as debug from 'debug';
const log = debug('scany');

import { ChannelResult, PlaylistResult, VideoResult, Thumbnails, parseThumbnails } from './models';
import { Scraper } from './scraper';
import { Reader } from './reader';
import { extractChannelId, extractPlaylistId, extractVideoId } from './parser';

export { ChannelResult, PlaylistResult, VideoResult, Thumbnails };

  
/**
 * Youtube scraper and feed reader that provides access to channel, playlist, and video data.
 *
 * @export
 * @class Scany
 */
export class Scany {

  private _scraper: Scraper;
  private _reader: Reader;

  /**
   * Creates an instance of Scany.
   * @param {{ show?: boolean, concurrency?: number }} [{ show, concurrency }={}]
   * @memberof Scany
   */
  constructor({ show, concurrency }: { show?: boolean, concurrency?: number } = {}) {
    this._scraper = new Scraper({ show, concurrency });
    this._reader = new Reader();
  }

  /**
   * Retrieves channel data including recent videos.
   *
   * @param {string} urlOrId The channel id or the full URL to the channel.
   * @returns {Promise<ChannelResult>}
   * @memberof Scany
   */
  public async channel(urlOrId: string): Promise<ChannelResult> {
    let channelId = extractChannelId(urlOrId) || urlOrId;

    if (channelId === null) {
      return Promise.reject(`URL '${urlOrId}' does not reference a valid channel!`);
    }

    return this._reader.channel(channelId);
  }


  /**
   * Retrieves playlist data including recent videos.
   *
   * @param {string} urlOrId The playlist id or the full URL to the playlist.
   * @param {boolean} [videoIdsOnly=false] Skips the retrieval of each video and simply populates the videoId field of {@link VideoResult}. Typically used to quickly get a playlist, filter out known videos, then retrieve new vidoes via {@link Scany#videos}.
   * @returns {Promise<PlaylistResult>}
   * @memberof Scany
   */
  public async playlist(urlOrId: string, videoIdsOnly: boolean = false): Promise<PlaylistResult> {
    const playlistId = extractPlaylistId(urlOrId) || urlOrId;

    if (!playlistId) {
      return Promise.reject(`URL ${urlOrId} does not reference a playlist!`);
    }

    return this._scraper.playlist(playlistId, videoIdsOnly);
  }


  /**
   * Retrieves video data.
   *
   * @param {string} urlOrId The video id or the full URL to the video.
   * @returns {Promise<VideoResult>}
   * @memberof Scany
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
   * @returns {Promise<Array<VideoResult>>}
   * @memberof Scany
   */
  public async videos(urlsOrIds: Array<string>): Promise<Array<VideoResult>>;
  
  /**
   * Retrieves video data for multiple videos.
   *
   * @param {Array<VideoResult>} videosWithIds List of {@link VideoResult} with {@link VideoResult#videoId} (typically this is used after retrieving playlists with the videoIdsOnly flag set to true and filtering out unwanted videos)
   * @returns {Promise<Array<VideoResult>>}
   * @memberof Scany
   */
  public async videos(videosWithIds: Array<VideoResult>): Promise<Array<VideoResult>>;
  public async videos(arg: Array<string | VideoResult>): Promise<Array<VideoResult>> {
    arg = arg.filter(x => !!x);

    if (arg.length === 0) {
      return Promise.reject(`No valid video URLs were found!`);
    }

    let videoIds: Array<string> = [];
    if (typeof arg[0] === 'string') {
      log(`Converting ${arg.length} video URLs to video Ids...`);
      let videoUrls = arg as Array<string>;
      videoIds = videoUrls.map(id => extractVideoId(id) || id).filter(id => !!id);
    } else {
      log(`Converting ${arg.length} VideoResults to video Ids...`);
      let videoResults = arg as Array<VideoResult>;
      videoIds = videoResults.map(videoResult => videoResult.videoId);
    }
    
    if (videoIds.length === 0) {
      return Promise.reject(`No valid videoIds were found!`);
    }

    return this._scraper.videos(videoIds);
  }
}