import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';
import * as scrapeIt from 'scrape-it';
import * as debug from 'debug';
let log = debug('scany:scraper');

import { FeedResult, VideoResult, createThumbnails, extractChannelId, extractVideoId, createPlaylistUrl, createVideoUrl, extractUsername } from 'pully-core';
import { queueUp, pTimes, pSeries, pParallel } from './utils';

const EMPTY_STRING = '';

export class Scraper {

    private _show: boolean;
    private _concurrency: number;

    public constructor({ show, concurrency }: { show?: boolean, concurrency?: number } = {}) {
        this._show = !!show;
        this._concurrency = concurrency || 2;
    }

    public async video(videoId: string): Promise<VideoResult> {
        log(`Scraping a single video (${videoId})...`);
        let now = new Date();

        const browser = await createBrowser({ show: this._show });
        
        const page = await browser.newPage();

        let result = await _scrapeVideo(page, videoId, now);

        await page.close();

        await browser.close();

        return result;
    }

    public async videos(videoIds: Array<string>): Promise<Array<VideoResult>> {
        log(`Scraping ${videoIds.length} videos...`);
        let now = new Date();
        let videos = videoIds.map(videoId => ({ videoId })) as Array<VideoResult>;

        const browser = await createBrowser({show: this._show});

        let videoResults = await _scrapeVideos(browser, videos, now, this._concurrency);

        await browser.close();

        return videoResults;
    }

    public async playlist(playlistId: string): Promise<FeedResult> {
        let now = new Date();
        log(`Scraping playlist '${playlistId}'...`);

        const browser = await createBrowser({ show: this._show});
        
        const page = await browser.newPage();
        
        const playlistUrl = createPlaylistUrl(playlistId);

        await page.goto(playlistUrl);

        /* istanbul ignore next */
        await page.waitFor(() => {
            let title = document.querySelector('#title');
            return title && title.textContent && title.textContent.length > 0;
        });

        /* istanbul ignore next */
        const isV1 = (await page.$('ytd-app')) === null;

        let result: FeedResult;

        if (isV1) {
            throw new Error('Older YouTube page format not supported (yet)!');
        } else {
            let expectedVideos: number
            let visibleVideos: number;

            /* istanbul ignore next */
            expectedVideos = await page.evaluate(() => parseInt(document.querySelector('#stats > yt-formatted-string:nth-child(1)').textContent, 10));
            /* istanbul ignore next */
            visibleVideos = await page.evaluate(() => document.querySelectorAll('#contents > ytd-playlist-video-renderer').length);

            // infinite scroll
            while (visibleVideos < expectedVideos) {
                /* istanbul ignore next */
                await page.evaluate(() => window.scrollBy(0, window.innerHeight));
                await page.waitFor(200);

                /* istanbul ignore next */
                expectedVideos = await page.evaluate(() => parseInt(document.querySelector('#stats > yt-formatted-string:nth-child(1)').textContent, 10));
                /* istanbul ignore next */
                visibleVideos = await page.evaluate(() => document.querySelectorAll('#contents > ytd-playlist-video-renderer').length);
            }

            /* istanbul ignore next */
            const html = await page.content();

            result = await scrapeIt.scrapeHTML<FeedResult>(html, {
                playlistTitle: '#title',
                playlistId: '#stats > yt-formatted-string:nth-child(1)',
                channelName: '#owner-name a',
                channelUrl: { selector: '#owner-name a', attr: 'href', convert: makeAbsolute },
                videos: {
                    listItem: '#contents > ytd-playlist-video-renderer',
                    data: {
                        videoId: {
                            selector: '#content > a',
                            attr: 'href',
                            convert: extractVideoId
                        },
                        videoTitle: '#video-title',
                        videoUrl: {
                            selector: '#content > a',
                            attr: 'href'
                        },
                        channelName: '#byline > a',
                        channelUrl: {
                            selector: '#byline > a',
                            attr: 'href',
                            convert: makeAbsolute
                        },
                        channelId: {
                            selector: '#byline > a',
                            attr: 'href',
                            convert: url => extractChannelId(url) || extractUsername(url)
                        }
                    }
                }
            });
        }

        result.lastScanned = now;
        result.playlistId = playlistId;
        result.playlistUrl = playlistUrl;
        result.channelId = extractChannelId(result.channelUrl);
        result.videos.forEach(v => {
            v.thumbnails = createThumbnails(v.videoId);
            v.lastScanned = now;
        });

        await page.close();

        await browser.close();

        return result;
    }
}

async function _scrapeVideos(browser: Browser, videos: Array<VideoResult>, lastScanned: Date, concurrency: number = 1): Promise<Array<VideoResult>> {
    log(`Starting processing of ${videos.length} videos...`);
    let queue = queueUp(videos, concurrency);
    let pages = await pTimes(queue.length, () => browser.newPage());

    let batches = await pParallel(pages, (page, pageIndex) => {
        log(`Starting batch ${pageIndex}...`);
        let videos = queue[pageIndex];
        return pSeries(videos, video => {
            log(`Startup page ${pageIndex}...`);
            return _scrapeVideo(page, video.videoId, lastScanned);
        })
    });

    await pParallel(pages, page => page.close());

    return batches.reduce((a, b) => a.concat(b), []);
}

async function _scrapeVideo(page: Page, videoId: string, lastScanned: Date): Promise <VideoResult> {

    log(`Scraping video ${videoId}...`);

    const videoUrl = createVideoUrl(videoId);

    await page.goto(videoUrl);

    /* istanbul ignore next */
    await page.$eval('video', (player: HTMLVideoElement) => player.pause());

    /* istanbul ignore next */
    await page.waitFor(() => {
        let title = document.querySelector('h1.title');
        return title && title.textContent && title.textContent.length > 0;
    }, { polling: 50 });

    const isV1 = (await page.$('ytd-app')) === null;

    const html = await page.content();

    let result: VideoResult;

    if(isV1) {
        throw new Error('Older YouTube page format not supported (yet)!');
    } else {
        result = await scrapeIt.scrapeHTML<VideoResult>(html, {
            videoTitle: 'h1.title',
            channelName: '#owner-name a',
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
    result.thumbnails = createThumbnails(videoId);
    result.lastScanned = lastScanned;

    return result;
}

async function createBrowser({ show }: { show: boolean}): Promise<Browser> {
    let isTravisCI = 'TRAVIS' in process.env && 'CI' in process.env;
    let args = isTravisCI ? ['--no-sandbox'] : [];
    
    return await puppeteer.launch({
        args,
        headless: !show,
        ignoreHTTPSErrors: true,
        timeout: 0,
        //devtools: true
    });
}

function makeAbsolute(path: string): string {
    return path.startsWith('/') ? `https://youtube.com${path}` : path;
}
