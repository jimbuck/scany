import * as debug from 'debug';
const log = debug('scany');

import { ChannelResult, PlaylistResult, VideoResult, Thumbnails, parseThumbnails } from './models';
import { Scraper } from './scraper';
import { Reader } from './reader';
import { extractChannelId, extractPlaylistId, extractVideoId } from './parser';

export { ChannelResult, PlaylistResult, VideoResult, Thumbnails };

export class Scany {

  private _scraper: Scraper;
  private _reader: Reader;

  constructor({ show, concurrency }: { show?: boolean, concurrency?: number } = {}) {
    this._scraper = new Scraper({ show: true, concurrency });
    this._reader = new Reader();
  }

  public async channel(url: string): Promise<ChannelResult> {
    let channelId = extractChannelId(url) || url;

    if (channelId === null) {
      return Promise.reject(`URL '${url}' does not reference a valid channel!`);
    }

    return this._reader.channel(channelId);
  }

  public async playlist(url: string, videoIdsOnly: boolean = false): Promise<PlaylistResult> {
    const playlistId = extractPlaylistId(url) || url;

    if (!playlistId) {
      return Promise.reject(`URL ${url} does not reference a playlist!`);
    }

    return this._scraper.playlist(playlistId, videoIdsOnly);
  }

  public async video(url: string): Promise<VideoResult> {
    const videoId = extractVideoId(url) || url;

    if (!videoId) {
      return Promise.reject(`URL ${url} does not reference a video!`);
    }

    return this._scraper.video(videoId);
  }

  public async videos(urls: Array<string>): Promise<Array<VideoResult>>
  public async videos(videoIds: Array<VideoResult>): Promise<Array<VideoResult>>;
  public async videos(arg: Array<string | VideoResult>): Promise<Array<VideoResult>> {
    arg = arg.filter(x => !!x);

    if (arg.length === 0) {
      return Promise.reject(`No valid video URLs were found!`);
    }

    let videoIds: Array<string> = [];
    if (typeof arg[0] === 'string') {
      let videoUrls = arg as Array<string>;
      videoIds = videoUrls.map(id => extractVideoId(id) || id).filter(id => !!id);
    } else {
      let videoResults = arg as Array<VideoResult>;
      videoIds = videoResults.map(videoResult => videoResult.videoId);
    }
    
    if (videoIds.length === 0) {
      return Promise.reject(`No valid videoIds were found!`);
    }

    return this._scraper.videos(videoIds);
  }
}