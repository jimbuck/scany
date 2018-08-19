import { parse } from 'url';

import * as UrlPattern from 'url-pattern';
const got = require('got');
const FeedParser = require('feedparser');
const get: (<T>(item: any, path: string, defaultValue?: any) => any) = require('lodash.get');

import { ScanOptions, ChannelResult, PlaylistResult, VideoResult, Thumbnails, parseThumbnails } from './models';
import { Scraper } from './scraper';
import { extractChannelId, extractPlaylistId, extractUsername, extractVideoId } from './parser';

const userPattern = new UrlPattern('/user/:username');
const channelPattern = new UrlPattern('/channel/:channelId');
const playlistPattern = new UrlPattern('/playlist');
const feedPattern = new UrlPattern('/feeds/videos.xml');
const videoPattern = new UrlPattern('/watch');

const EMPTY_STRING = '';

export { ScanOptions, ChannelResult, PlaylistResult, VideoResult, Thumbnails };

export class Scany {

  private _options: ScanOptions;
  private _scraper: Scraper;

  constructor(options?: ScanOptions) {
    this._options = Object.assign<ScanOptions, ScanOptions>({
      baseFeedUrl: 'https://www.youtube.com/feeds/videos.xml'
    }, options);

    this._scraper = new Scraper();
  }

  public channel(url: string): Promise<ChannelResult> {
    return null;
  }

  public playlist(url: string): Promise<PlaylistResult> {
    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      return Promise.reject(`URL ${url} does not reference a playlist!`);
    }

    return this._scraper.scrapePlaylist(playlistId);
  }

  public video(url: string): Promise<VideoResult> {
    const videoId = extractVideoId(url);

    if (!videoId) {
      return Promise.reject(`URL ${url} does not reference a video!`);
    }

    return this._scraper.scrapeVideo(videoId);
  }



  // private _fetch<T = ChannelResult | PlaylistResult | VideoResult>(url: string): Promise<T> {
  //   const urlData = parse(url, true, true);

  //   // Check if it already is a feed address...    
  //   const feedData = feedPattern.match(urlData.pathname);
  //   if (feedData !== null) {
  //     return Promise.resolve(url);
  //   }

  //   // Check if it is a user address...
  //   const userData = userPattern.match(urlData.pathname);
  //   if (userData !== null && userData.username) {
  //     return Promise.resolve(this._options.baseFeedUrl + `?user=${userData.username}`);
  //   }

  //   // Check if it is a channel address...
  //   const channelData = channelPattern.match(urlData.pathname);
  //   if (channelData !== null && channelData.channelId) {
  //     return Promise.resolve(this._options.baseFeedUrl + `?channel_id=${channelData.channelId}`);
  //   }

  //   // Check if it is a playlist address...
  //   const playlistData = playlistPattern.match(urlData.pathname);
  //   if (playlistData !== null && urlData.query.list) {
  //     const playlistId = urlData.query.list as string;
  //     return this._scraper.scrapePlaylist(playlistId);
  //   }

  //   const videoData = videoPattern.match(urlData.pathname);
  //   if (videoData !== null && urlData.query.v) {
      
  //   }

  //   // Otherwise assume they just specified a username...    
  //   return Promise.resolve(this._options.baseFeedUrl + `?user=${url}`);
  // }

  // private _downloadFeedData(url: string): Promise<ChannelResult> {
  //   let result: ChannelResult = {
  //     channel: null,
  //     channelId: null,
  //     channelUrl: null,
  //     videos: []
  //   };

  //   return this._downloadData(url, (meta) => {
  //     result.channel = meta.author;
  //   }, (video) => {
  //     video.channel = result.channel;
  //     video.channelId = result.channelId;
  //     video.channelUrl = result.channelUrl;
  //     result.videos.push(video);
  //   }).then(() => result);
  // }

  // private _downloadData(url: string, onMeta: (meta: any) => void, onVideo: (data: VideoResult) => void): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     got.stream(url)
  //       .on('error', reject)
  //       .pipe(new FeedParser())
  //       .on('error', reject)
  //       .on('meta', onMeta)
  //       .on('readable', function () {
  //         let item: any;
  //         while (item = this.read()) {
  //           const videoId = get(item, 'yt:videoid.#');
  //           const video = {
  //             video: item.title,
  //             videoId,
  //             videoUrl: item.link,
  //             description: get(item, 'media:group.media:description.#', EMPTY_STRING),
  //             published: item.pubDate,
  //             thumbnails: parseThumbnails(videoId),
  //             views: parseInt(get(item, 'media:group.media:community.media:statistics.@.views'), 10),
  //             rating: parseFloat(get(item, 'media:group.media:community.media:starrating.@.average'))
  //           };

  //           onVideo(video);
  //         }
  //       })
  //       .on('end', function () {
  //         resolve();
  //       });
  //   });
  // }
}