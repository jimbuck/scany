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