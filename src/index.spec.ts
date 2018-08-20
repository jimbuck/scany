import { test } from 'ava';

import { Scany } from './';

test.serial('e2e - Scany#video gets video info', async (t) => {
    let scany = new Scany();
    const result = await scany.video('DEVi0mEaJJQ');

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

test.serial('e2e - Scany#videos gets multiple videos info', async (t) => {
    let scany = new Scany();
    const results = await scany.videos(['OFbBs9M0cqw', 'beaHxW5o-uw']);

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

test.serial('e2e - Scany#playlist gets playlist info', async (t) => {
    let scany = new Scany();
    const result = await scany.playlist('PLRJGGcGGYxmqzFSXP7gAdJVrG7uBfwxMX');

    t.truthy(result.channel);
    t.truthy(result.channelId);
    t.truthy(result.channelUrl);
    t.truthy(result.playlist);
    t.truthy(result.playlistId);
    t.truthy(result.playlistUrl);
    t.true(result.lastScanned instanceof Date);
    t.true(result.videos.length > 0);

    result.videos.forEach(video => t.truthy(video.videoId));
});

test.serial('e2e - Scany#channel gets channel info', async (t) => {
    let scany = new Scany();
    const result = await scany.channel('UC6107grRI4m0o2-emgoDnAA');

    t.truthy(result.channel);
    t.truthy(result.channelId);
    t.truthy(result.channelUrl);
    t.true(result.lastScanned instanceof Date);
    t.true(result.videos.length > 0);

    result.videos.forEach(video => t.truthy(video.videoId));
});