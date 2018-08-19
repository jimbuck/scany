import * as scrapeIt from 'scrape-it';
//import * as Nightmare from 'nightmare';
const Nightmare = require('nightmare');

import { PlaylistResult, VideoResult } from './models';
import { extractChannelId, extractVideoId } from './parser';
import { AsyncResource } from 'async_hooks';

const EMPTY_STRING = '';

export class Scraper {

    public constructor() {

    }

    public async scrapeVideo(videoId: string): Promise<VideoResult> {

        let browser = new Nightmare({
            show: false,
            openDevTools: {
                mode: 'detach'
            }
        });

        let result = await _scrapeVideo(browser, videoId);

        browser.end();

        return result;
    }

    public async scrapePlaylist(playlistId: string): Promise<PlaylistResult> {
        console.log(`Starting playlist scrape...`);
        let browser = new Nightmare({ show: true });
        
        await browser.goto(`https://www.youtube.com/playlist?list=${playlistId}`);

        /* istanbul ignore next */
        await browser.wait(() => {
            let title = document.querySelector('#title');
            return title && title.textContent && title.textContent.length > 0;
        });

        const isV1 = await browser.exists('ytd-app').then((exists: boolean) => !exists);

        let result: PlaylistResult;

        if (isV1) {
            /* istanbul ignore next */
            const html = await browser.evaluate((moreButton: string) => {
                let btn = document.querySelector(moreButton) as HTMLElement;
                while (btn) {
                    btn.click();
                    btn = document.querySelector(moreButton) as HTMLElement;
                }

                return document.body.innerHTML;
            }, 'MORE BUTTON SELECTOR').end();

            result = await scrapeIt.scrapeHTML<PlaylistResult>(html, {
                playlist: '',
                playlistId: '',
            });
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
                    listItem: '#contents > ytd-playlist-video-renderer', data: {
                        videoId: {
                            selector: '#content > a',
                            attr: 'href',
                            convert: url => extractVideoId(url)
                        }
                    }
                }
            });
        }      

        result.playlistId = playlistId;
        result.playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
        result.channelId = extractChannelId(result.channelUrl);

        result.videos = await Promise.all(result.videos.map(videoResult => _scrapeVideo(browser, videoResult.videoId)));

        await browser.end();

        console.log(`Finishing playlist scrape...`);

        return result;
    }
}

async function _scrapeVideo(browser: any, videoId: string): Promise <VideoResult> {

    console.log(`Starting video scrape...`);

    await browser.goto(`http://youtube.com/watch?v=${videoId}`);

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
        result = await scrapeIt.scrapeHTML<VideoResult>(html, {
            video: { selector: 'meta[itemprop=name]', attr: 'content' },
            channel: '',
            description: '',
            published: {},
            views: {}

        });
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
    result.videoUrl = `https://youtube.com/watch?v=${videoId}`;
    result.channelId = extractChannelId(result.channelUrl);

    console.log(`Finishing playlist scrape...`);

    return result;
}

function makeAbsolute(path: string): string {
    return path.startsWith('/') ? `https://youtube.com${path}` : path;
}