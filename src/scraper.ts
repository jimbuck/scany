const Nightmare = require('nightmare');
import * as scrapeIt from 'scrape-it';

import { PlaylistResult, VideoResult } from './models';
import { extractChannelId, extractVideoId, createPlaylistUrl, createVideoUrl } from './parser';

const EMPTY_STRING = '';

export class Scraper {

    private _show: boolean;

    public constructor({ show }: { show?: boolean } = {}) {
        this._show = !!show;
    }

    public async video(videoId: string): Promise<VideoResult> {

        let now = new Date();
        
        let browser = new Nightmare({
            show: this._show,
            // openDevTools: { mode: 'detach' }
        });

        let result = await _scrapeVideo(browser, videoId, now);

        browser.end();

        return result;
    }

    public async videos(videoIds: Array<string>): Promise<Array<VideoResult>> {
        let now = new Date();
        
        let browser = new Nightmare({
            show: this._show,
            // openDevTools: { mode: 'detach' }
        });

        let videoResults = await _scrapeVideos(browser, videoIds, now);

        browser.end();

        return videoResults;
    }

    public async playlist(playlistId: string, videoIdsOnly: boolean = false): Promise<PlaylistResult> {
        let now = new Date();

        let browser = new Nightmare({
            show: this._show,
            // openDevTools: { mode: 'detach' }
        });
        
        const playlistUrl = createPlaylistUrl(playlistId);

        await browser.goto(playlistUrl);

        /* istanbul ignore next */
        await browser.wait(() => {
            let title = document.querySelector('#title');
            return title && title.textContent && title.textContent.length > 0;
        });

        const isV1 = await browser.exists('ytd-app').then((exists: boolean) => !exists);

        let result: PlaylistResult;

        if (isV1) {
            throw new Error('Older YouTube page format not supported (yet)!');
        } else {
            let expectedVideos: number
            let visibleVideos: number;

            /* istanbul ignore next */
            expectedVideos = await browser.evaluate(() => parseInt(document.querySelector('#stats > yt-formatted-string:nth-child(1)').textContent, 10));
            /* istanbul ignore next */
            visibleVideos = await browser.evaluate(() => document.querySelectorAll('#contents > ytd-playlist-video-renderer').length);

            // infinite scroll
            while (visibleVideos < expectedVideos) {
                /* istanbul ignore next */
                await browser.scrollTo(999999999, 0).wait(200);

                /* istanbul ignore next */
                expectedVideos = await browser.evaluate(() => parseInt(document.querySelector('#stats > yt-formatted-string:nth-child(1)').textContent, 10));
                /* istanbul ignore next */
                visibleVideos = await browser.evaluate(() => document.querySelectorAll('#contents > ytd-playlist-video-renderer').length);
            }

            /* istanbul ignore next */
            const html = await browser.evaluate(() => document.body.innerHTML);

            result = await scrapeIt.scrapeHTML<PlaylistResult>(html, {
                playlist: '#title',
                playlistId: '#stats > yt-formatted-string:nth-child(1)',
                channel: '#owner-name a',
                channelUrl: { selector: '#owner-name a', attr: 'href', convert: makeAbsolute },
                videos: {
                    listItem: '#contents > ytd-playlist-video-renderer',
                    data: {
                        videoId: {
                            selector: '#content > a',
                            attr: 'href',
                            convert: url => extractVideoId(url)
                        }
                    }
                }
            });
        }

        result.lastScanned = now;
        result.playlistId = playlistId;
        result.playlistUrl = playlistUrl;
        result.channelId = extractChannelId(result.channelUrl);

        if (!videoIdsOnly) {
            result.videos = await _scrapeVideos(browser, result.videos, now);
        }

        await browser.end();

        return result;
    }
}

async function _scrapeVideos(browser: any, videos: Array<string>|Array<VideoResult>, lastScanned: Date): Promise<Array<VideoResult>> {
    let fullVideos: Array<VideoResult> = [];
    for (let videoId of videos) {
        if (typeof videoId !== 'string') {
            videoId = videoId.videoId;
        }
        let videoResult = await _scrapeVideo(browser, videoId, lastScanned);
        fullVideos.push(videoResult);
    }

    return fullVideos;
}

async function _scrapeVideo(browser: any, videoId: string, lastScanned: Date): Promise <VideoResult> {

    const videoUrl = createVideoUrl(videoId);

    await browser.goto(videoUrl);

    //await browser.type('body', 'k');

    /* istanbul ignore next */
    await browser.wait(() => {
        let title = document.querySelector('h1.title');
        return title && title.textContent && title.textContent.length > 0;
    });

    const isV1 = await browser.exists('ytd-app').then((exists: boolean) => !exists);

    /* istanbul ignore next */
    const html = await browser.evaluate(() => document.body.innerHTML);

    let result: VideoResult;

    if(isV1) {
        throw new Error('Older YouTube page format not supported (yet)!');
    } else {
        result = await scrapeIt.scrapeHTML<VideoResult>(html, {
            video: 'h1.title',
            channel: '#owner-name a',
            channelUrl: { selector: '#owner-name a', attr: 'href', convert: makeAbsolute },
            description: '#description',
            published: {
                selector: '#upload-info [slot=date]',
                convert: dateStr => new Date(dateStr.replace('Published on ', EMPTY_STRING))
            },
            views: {
                selector: '.view-count',
                convert: countStr => parseInt(countStr.replace(',', EMPTY_STRING), 10)
            }
        });
    }

    result.videoId = videoId;
    result.videoUrl = videoUrl;
    result.channelId = extractChannelId(result.channelUrl);
    result.lastScanned = lastScanned;

    return result;
}

function makeAbsolute(path: string): string {
    return path.startsWith('/') ? `https://youtube.com${path}` : path;
}