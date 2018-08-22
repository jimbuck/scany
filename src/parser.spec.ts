import { test } from 'ava';

import * as parser from './parser';

test(`extracts videoId from query`, t => {
    const expectedVideoId = 'GEhBPI2QVBI';
    const actualVideoId = parser.extractVideoId(`https://www.youtube.com/watch?v=${expectedVideoId}`);

    t.is(actualVideoId, expectedVideoId);
});

test(`extracts playlistId from query`, t => {
    const expectedPlaylistId = 'PLjHf9jaFs8XUXBnlkBAuRkOpUJosxJ0Vx';
    const urlFormats = [
        `https://www.youtube.com/playlist?list=${expectedPlaylistId}`,
        `https://www.youtube.com/watch?v=-GlJFVTzEsI&index=2&list=${expectedPlaylistId}`
    ];

    urlFormats.forEach(url => {
        const actualPlaylistId = parser.extractPlaylistId(url);
        t.is(actualPlaylistId, expectedPlaylistId);
    });
});

test(`extracts channelId from url`, t => {
    const expectedChannelId = 'UC6107grRI4m0o2-emgoDnAA';
    const actualChannelId = parser.extractChannelId(`https://www.youtube.com/channel/${expectedChannelId}`);

    t.is(actualChannelId, expectedChannelId);
});

test(`extracts username from url`, t => {
    const expectedUsername = 'testedcom';
    const actualUsername = parser.extractUsername(`https://www.youtube.com/user/${expectedUsername}`);

    t.is(actualUsername, expectedUsername);
});

test(`parseThumbnails properly creates all available image URLs`, t => {
    const videoId = 'unIIn_1JOAE';

    const thumbnails = parser.parseThumbnails(videoId);

    t.is(thumbnails.background, `https://i1.ytimg.com/vi/${videoId}/0.jpg`);
    t.is(thumbnails.start, `https://i1.ytimg.com/vi/${videoId}/1.jpg`);
    t.is(thumbnails.middle, `https://i1.ytimg.com/vi/${videoId}/2.jpg`);
    t.is(thumbnails.end, `https://i1.ytimg.com/vi/${videoId}/3.jpg`);

    t.is(thumbnails.high, `https://i1.ytimg.com/vi/${videoId}/hqdefault.jpg`);
    t.is(thumbnails.medium, `https://i1.ytimg.com/vi/${videoId}/mqdefault.jpg`);
    t.is(thumbnails.normal, `https://i1.ytimg.com/vi/${videoId}/default.jpg`);

    t.is(thumbnails.hd, `https://i1.ytimg.com/vi/${videoId}/maxresdefault.jpg`);
    t.is(thumbnails.sd, `https://i1.ytimg.com/vi/${videoId}/sddefault.jpg`);
});