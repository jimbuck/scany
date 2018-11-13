import { test, TestContext } from 'ava';

import { scanFeed, scanVideo, VideoResult } from './';

async function asProperFeedVia(t: TestContext, url: string) {
    const result = await scanFeed(url);

    t.truthy(result.channelName);
    t.truthy(result.channelId);
    t.truthy(result.channelUrl);
    t.truthy(result.playlistTitle);
    t.truthy(result.playlistId);
    t.truthy(result.playlistUrl);
    t.true(result.lastScanned instanceof Date);
    t.true(result.videos.length > 0);

    validateVideo(t, result.videos);
}
asProperFeedVia.title = (providedTitle: string) => `queryFeed gets feed by ${providedTitle}`;

function validateVideo(t: TestContext, videos: VideoResult[]) {
    for(let video of videos) {
        t.truthy(video.videoTitle);
        t.truthy(video.videoId);
        t.truthy(video.videoUrl);
        t.truthy(video.channelName);
        t.truthy(video.channelId);
        t.truthy(video.channelUrl);
        t.truthy(video.thumbnails.high);
        t.is(typeof video.views, 'number');
        t.true(video.views > 0);
        t.true(video.lastScanned instanceof Date);
    }
}

async function asProperVideoVia(t: TestContext, url: string|string[]) {
    if(typeof url === 'string') {
        let video = await scanVideo(url);
        validateVideo(t, [video]);
    } else {
        let videos = await scanVideo(url);
        validateVideo(t, videos);
    }
}
asProperVideoVia.title = (providedTitle: string) => `queryVideo gets video by ${providedTitle}`;

test('playlist URL', asProperFeedVia, 'https://youtube.com/playlist?list=PLRJGGcGGYxmqzFSXP7gAdJVrG7uBfwxMX');
test('channel url', asProperFeedVia, 'https://youtube.com/channel/UC6107grRI4m0o2-emgoDnAA');
test('single video', asProperVideoVia, 'DEVi0mEaJJQ');
test('video array', asProperVideoVia, ['https://youtube.com/watch?v=OFbBs9M0cqw', 'beaHxW5o-uw']);

test(`Watch Later playlists not supported`, t => t.throws(scanFeed('https://www.youtube.com/playlist?list=WL')));
test(`invalid video list not supported`, t => t.throws(scanVideo([])));
test(`recommends video`, t => t.throws(scanFeed('https://youtube.com/watch?v=OFbBs9M0cqw')));