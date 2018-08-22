import * as debug from 'debug';
const got = require('got');
const FeedParser = require('feedparser');
const get: (<T>(item: any, path: string, defaultValue?: any) => any) = require('lodash.get');

import { FeedResult, VideoResult } from './models';
import { extractChannelId, parseThumbnails } from './parser';

const log = debug('scany:reader');
const EMPTY_STRING = '';

export class Reader {

    private _baseFeedUrl: string;

    public constructor({ baseFeedUrl }: { baseFeedUrl?: string } = {}) {
        this._baseFeedUrl = baseFeedUrl || 'https://www.youtube.com/feeds/videos.xml';
    }

    public async channel(channelId: string): Promise<FeedResult> {
        log(`Reading feed for channel ${channelId}...`);
        return _read(`${this._baseFeedUrl}?channel_id=${channelId}`);
    }

    public async user(username: string): Promise<FeedResult> {
        log(`Reading feed for user ${username}...`);
        return _read(`${this._baseFeedUrl}?user=${username}`);
    }
}

async function _read(url: string): Promise<FeedResult> {
    let channelResult: FeedResult = {
        channelId: null,
        channel: null,
        channelUrl: null,
        videos: [],
        lastScanned: new Date()
    };

    await _downloadData(url, (meta) => {
        channelResult.channel = meta.author;
        channelResult.channelUrl = meta.link;
        channelResult.channelId = extractChannelId(channelResult.channelUrl);
    }, (video) => {
        video.channel = channelResult.channel;
        video.channelId = channelResult.channelId;
        video.channelUrl = channelResult.channelUrl;
        channelResult.videos.push(video);
    });

    return channelResult;
}

function _downloadData(url: string, onMeta: (meta: any) => void, onVideo: (data: VideoResult) => void): Promise<void> {
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
                    const video: VideoResult = {
                        videoId,
                        video: item.title,
                        videoUrl: item.link,
                        channel: null,
                        channelId: null,
                        channelUrl: null,
                        description: get(item, 'media:group.media:description.#', EMPTY_STRING),
                        published: item.pubDate,
                        thumbnails: parseThumbnails(videoId),
                        views: parseInt(get(item, 'media:group.media:community.media:statistics.@.views'), 10),
                        lastScanned: new Date()
                    };

                    onVideo(video);
                }
            })
            .on('end', function () {
                resolve();
            });
    });
}