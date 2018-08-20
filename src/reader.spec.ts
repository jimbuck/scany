import { test } from 'ava';

import { Reader } from './reader';

test('Reader#channel gets latest by channelId', async (t) => {
    let reader = new Reader();
    const result = await reader.channel('UC6107grRI4m0o2-emgoDnAA');

    t.truthy(result.channel);
    t.truthy(result.channelId);
    t.truthy(result.channelUrl);
    t.true(result.lastScanned instanceof Date);
    t.true(result.videos.length > 0);

    result.videos.forEach(video => t.truthy(video.videoId));
});

test('Reader#user gets latest by username', async (t) => {
    let reader = new Reader();
    const result = await reader.user('destinws2');

    t.truthy(result.channel);
    t.truthy(result.channelId);
    t.truthy(result.channelUrl);
    t.true(result.lastScanned instanceof Date);
    t.true(result.videos.length > 0);

    result.videos.forEach(video => t.truthy(video.videoId));
});