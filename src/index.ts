import { IncomingMessage } from 'http';
import { parse } from 'url';

import * as cheerio from 'cheerio';
import * as UrlPattern from 'url-pattern';
const got = require('got');
const FeedParser = require('feedparser');
const get: (<T>(item: any, path: string, defaultValue?: any) => any) = require('lodash.get');

import { ScanyOptions, ScanResult, VideoData, FlatVideoData, Thumbnails, parseThumbnails } from './models';

const userPattern = new UrlPattern('/user/:username');
const channelPattern = new UrlPattern('/channel/:channelId');
const playlistPattern = new UrlPattern('/playlist');
const feedPattern = new UrlPattern('/feeds/videos.xml');

const EMPTY_STRING = '';

export { ScanyOptions, ScanResult, VideoData, FlatVideoData, Thumbnails };

export class Scany {

  private _options: ScanyOptions;

  constructor(options?: ScanyOptions) {
    this._options = Object.assign<ScanyOptions, ScanyOptions>({
      baseFeedUrl: 'https://www.youtube.com/feeds/videos.xml'
    }, options);
  }

  public fetch(url: string): Promise<ScanResult> {
    return this
      ._convertToFeedUrl(url)
      .then(feed => this._downloadFeedData(feed));
  }

  public fetchFlat(url: string): Promise<Array<FlatVideoData>> {
    return this
      ._convertToFeedUrl(url)
      .then(feed => this._downloadFlatData(feed));
  }

  private _convertToFeedUrl(url: string): Promise<string> {
    const urlData = parse(url, true, true);

    // Check if it already is a feed address...    
    const feedData = feedPattern.match(urlData.pathname);
    if (feedData !== null) {
      return Promise.resolve(url);
    }

    // Check if it is a user address...    
    const userData = userPattern.match(urlData.pathname);
    if (userData !== null && userData.username) {
      return Promise.resolve(this._options.baseFeedUrl + `?user=${userData.username}`);
    }

    // Check if it is a channel address...    
    const channelData = channelPattern.match(urlData.pathname);
    if (channelData !== null && channelData.channelId) {
      return Promise.resolve(this._options.baseFeedUrl + `?channel_id=${channelData.channelId}`);
    }

    // Check if it is a playlist address...    
    const playlistData = playlistPattern.match(urlData.pathname);
    if (playlistData !== null && urlData.query.list) {
      return Promise.resolve(this._options.baseFeedUrl + `?playlist_id=${urlData.query.list}`);
    }

    // Otherwise assume they just specified a username...    
    return Promise.resolve(this._options.baseFeedUrl + `?user=${url}`);
  }

  private _downloadFeedData(url: string): Promise<ScanResult> {
    let result: ScanResult = {
      videos: []
    };

    return this._downloadData(url, (meta) => {
      result.author = meta.author;
      result.playlist = meta.title || meta.author;
      result.feed = meta.xmlUrl;
    }, (video) => {
      result.videos.push(video);
    }).then(() => result);
  }

  private _downloadFlatData(url: string): Promise<Array<FlatVideoData>> {
    const result: Array<FlatVideoData> = [];
    let author: string;
    let playlist: string;
    let feed: string;

    return this._downloadData(url, (meta) => {
      author = meta.author;
      playlist = meta.title || meta.author;
      feed = meta.xmlUrl;
    }, (video: FlatVideoData) => {
      video.author = author;
      video.playlist = playlist;
      video.feed = feed;
      result.push(video);
    }).then(() => result);
  }

  private _downloadData(url: string, onMeta: (meta: any) => void, onVideo: (data: VideoData) => void): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      got.stream(url)
        .on('error', reject)
        .pipe(new FeedParser())
        .on('error', reject)
        .on('meta', onMeta)
        .on('readable', function () {
          let item: any;
          while (item = this.read()) {
            const videoId = get(item, 'yt:videoid.#');
            const video = {
              title: item.title,
              description: get(item, 'media:group.media:description.#', EMPTY_STRING),
              id: videoId,
              url: item.link,
              published: item.pubDate,
              thumbnails: parseThumbnails(videoId),
              views: parseInt(get(item, 'media:group.media:community.media:statistics.@.views'), 10),
              rating: parseFloat(get(item, 'media:group.media:community.media:starrating.@.average'))
            };
            onVideo(video);
          }
        })
        .on('end', function () {
          resolve();
        });
    });
  }
}