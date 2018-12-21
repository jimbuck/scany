import { test, TestContext } from 'ava';

import { scanFeed, scanVideo, findFeed, VideoResult } from './';

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

async function findsCorrectPlaylist(t: TestContext, video: VideoResult, expectedPlaylistId: string) {
    const feed = await findFeed(video);
    t.is(feed.playlistId, expectedPlaylistId);
}
findsCorrectPlaylist.title = (providedTitle: string) => `finds correct playlist for ${providedTitle}`;

test('playlist URL', asProperFeedVia, 'https://youtube.com/playlist?list=PLRJGGcGGYxmqzFSXP7gAdJVrG7uBfwxMX');
test('channel url', asProperFeedVia, 'https://youtube.com/channel/UC6107grRI4m0o2-emgoDnAA');
test('single video', asProperVideoVia, 'DEVi0mEaJJQ');
test('video array', asProperVideoVia, ['https://youtube.com/watch?v=OFbBs9M0cqw', 'beaHxW5o-uw']);

test('video 1/3', findsCorrectPlaylist, {
    videoTitle: `Tom's Terrific Trip | Shot in 4K`,
    videoUrl:'https://www.youtube.com/watch?v=NEZ06xitrzI',
    channelName: 'Bradley Friesen'
}, 'PLRJGGcGGYxmqzFSXP7gAdJVrG7uBfwxMX');

test('video 2/3', findsCorrectPlaylist, {
    videoTitle: `How Lawn Mower Blades Cut Grass (at 50,000 FRAMES PER SECOND) - Smarter Every Day 196`,
    videoUrl:'https://www.youtube.com/watch?v=-GlJFVTzEsI',
    channelName: 'SmarterEveryDay'
}, 'PLjHf9jaFs8XUXBnlkBAuRkOpUJosxJ0Vx');

test(`finds playlist throws for video 3/3`, t => t.throws(findFeed({videoTitle:'4K Video Relaxing Ultra HD TV Test 2160p 20 minutes', channelName: '4K Play'} as any)));

test('skips videos', async (t) => {
    const { videos } = await scanFeed('https://youtube.com/channel/UC6107grRI4m0o2-emgoDnAA', { scanVideos: false });

    for(let video of videos) {
        t.truthy(video.videoTitle);
        t.truthy(video.videoId);
        t.truthy(video.videoUrl);
        t.falsy(video.channelName);
        t.falsy(video.channelId);
        t.falsy(video.channelUrl);

        t.falsy(video.thumbnails);
        t.is(typeof video.views, 'undefined');
        t.falsy(video.lastScanned);
    }
});

test(`Uses channel name for playlistTitle when given channel url`, async (t) => {
    const feed = await scanFeed('https://youtube.com/channel/UC6107grRI4m0o2-emgoDnAA', { scanVideos: false });

    t.is(feed.playlistTitle, feed.channelName);
});

test(`Watch Later playlists not supported`, t => t.throws(scanFeed('https://www.youtube.com/playlist?list=WL')));
test(`invalid video list not supported`, t => t.throws(scanVideo([])));
test(`recommends proper method if given wrong URL`, t => t.throws(scanFeed('https://youtube.com/watch?v=OFbBs9M0cqw')));

