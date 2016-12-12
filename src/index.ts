import { IncomingMessage } from 'http';
import { parse } from 'url';

import * as cheerio from 'cheerio';
import * as UrlPattern from 'url-pattern';
const got = require('got');
const FeedParser = require('feedparser');
const get: (<T>(item: any, path: string) => any) = require('lodash.get');

import { Options, ScanResult, VideoData, Thumbnails, parseThumbnails } from './models';

const userPattern = new UrlPattern('/user/:username');
const channelPattern = new UrlPattern('/channel/:channelId');
const playlistPattern = new UrlPattern('/playlist');
const feedPattern = new UrlPattern('/feeds/videos.xml');

export { Options, ScanResult, VideoData, Thumbnails };

export class Scany {

  private _options: Options;

  constructor(options?: Options) {
    this._options = Object.assign<Options, Options>({
      baseFeedUrl: 'https://www.youtube.com/feeds/videos.xml'
    }, options);
  }

  public fetch(url: string): Promise<ScanResult> {
      return this
          ._convertToFeedUrl(url)
          .then(this._downloadFeedData);
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
    return new Promise((resolve, reject) => {
      let result: ScanResult = { videos: [] };
      got.stream(url)
        .on('error', reject)
        .pipe(new FeedParser())
        .on('error', reject)
        .on('meta', function (meta: any) {
          result.title = meta.title;
          result.link = meta.xmlUrl;
          result.author = meta.author;
        })
        .on('readable', function () {
          let item: any;
          while (item = this.read()) {
            const videoId = get(item, 'yt:videoid.#');
            result.videos.push({
              title: item.title,
              description: get(item, 'media:group.media:description.#'),
              id: videoId,
              url: item.link,
              published: item.pubDate,
              thumbnails: parseThumbnails(videoId),
              views: parseInt(get(item, 'media:group.media:community.media:statistics.@.views'), 10),
              rating: parseFloat(get(item, 'media:group.media:community.media:starrating.@.average'))
            });
          }
        })
        .on('end', function () {
          resolve(result);
        });
    });
  }
}