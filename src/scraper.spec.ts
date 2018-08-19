import { test } from 'ava';

import { Scraper } from './scraper';

test('Scraper#scrapeVideo gets video info', async (t) => {
    let scraper = new Scraper();
    const result = await scraper.scrapeVideo('DEVi0mEaJJQ');

    t.truthy(result.video);
    t.truthy(result.videoId);
    t.truthy(result.videoUrl);
    t.truthy(result.channel);
    t.truthy(result.channelId);
    t.truthy(result.channelUrl);
    t.truthy(result.description);
    t.true(result.published instanceof Date);
    t.is(typeof result.views, 'number');
});

test.failing('Scraper#scrapePlaylist gets playlist info', async (t) => {
    let scraper = new Scraper();
    const result = await scraper.scrapePlaylist('PLRJGGcGGYxmqzFSXP7gAdJVrG7uBfwxMX');

    t.truthy(result.channel);
    t.truthy(result.channelId);
    t.truthy(result.channelUrl);
    t.truthy(result.playlist);
    t.truthy(result.playlistId);
    t.truthy(result.playlistUrl);
    t.true(result.videos.length > 0);

    t.truthy(result.videos[0].video);
    t.truthy(result.videos[0].videoId);
    t.truthy(result.videos[0].videoUrl);
    t.truthy(result.videos[0].channel);
    t.truthy(result.videos[0].channelId);
    t.truthy(result.videos[0].channelUrl);
    t.truthy(result.videos[0].description);
    t.true(result.videos[0].published instanceof Date);
    t.is(typeof result.videos[0].views, 'number');

    console.log(result);
});