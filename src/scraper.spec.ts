import { test } from 'ava';

import { Scraper } from './scraper';

test('Scraper#video gets video info', async (t) => {
    let scraper = new Scraper();
    const result = await scraper.video('DEVi0mEaJJQ');

    t.truthy(result.video);
    t.truthy(result.videoId);
    t.truthy(result.videoUrl);
    t.truthy(result.channel);
    t.truthy(result.channelId);
    t.truthy(result.channelUrl);
    t.truthy(result.description);
    t.true(result.published instanceof Date);
    t.true(result.lastScanned instanceof Date);
    t.is(typeof result.views, 'number');
});

test('Scraper#videos gets multiple videos info', async (t) => {
    let scraper = new Scraper();

    const results = await scraper.videos(['OFbBs9M0cqw', 'beaHxW5o-uw']);

    results.forEach(result => {
        t.truthy(result.video);
        t.truthy(result.videoId);
        t.truthy(result.videoUrl);
        t.truthy(result.channel);
        t.truthy(result.channelId);
        t.truthy(result.channelUrl);
        t.truthy(result.description);
        t.true(result.published instanceof Date);
        t.true(result.lastScanned instanceof Date);
        t.is(typeof result.views, 'number');
    });
});

test('Scraper#playlist gets playlist info', async (t) => {
    let scraper = new Scraper();

    const result = await scraper.playlist('PLRJGGcGGYxmqzFSXP7gAdJVrG7uBfwxMX');

    t.truthy(result.channel);
    t.truthy(result.channelId);
    t.truthy(result.channelUrl);
    t.truthy(result.playlist);
    t.truthy(result.playlistId);
    t.truthy(result.playlistUrl);
    t.true(result.lastScanned instanceof Date);
    t.true(result.videos.length > 0);

    result.videos.forEach(v => {
        t.truthy(v.video);
        t.truthy(v.videoId);
        t.truthy(v.videoUrl);
        t.truthy(v.channel);
        t.truthy(v.channelId);
        t.truthy(v.channelUrl);
        t.truthy(v.thumbnails.high);
        t.true(v.lastScanned instanceof Date);
    });
});