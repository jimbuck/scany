import { test, ContextualTestContext } from 'ava';

import { Scany } from './';

const channelIds = [
    'UCG08EqOAXJk_YXPDsAvReSg',
    'UCqFzWxSCi39LnW1JKFR3efg'
];
const usernames = [
    'BlueXephos',
    '1veritasim',
    'freddiew'
];
const playlists = [
    'PL39HkZXO7CwkuAFKNhmlUKFZtrHGrqiZH',
    'PLjHf9jaFs8XUd7V8rqwAeMJIyNxA2gPN1'
];
const feeds = [
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCG08EqOAXJk_YXPDsAvReSg',
    'https://www.youtube.com/feeds/videos.xml?user=freddiew',
    'https://www.youtube.com/feeds/videos.xml?playlist_id=PL39HkZXO7CwkuAFKNhmlUKFZtrHGrqiZH',
];
const invalids = [
    `https://www.youtube.com/user/lkjasdfl${Math.random().toString(36).substring(2, 16)}`,
    `https://www.youtube.com/channel/${Math.random().toString(36).substring(2, 6)}`,
    `https://www.youtube.com/playlist?list=${Math.random().toString(36).substring(2, 16)}`,
    `https://www.youtube.com/playlist`
];

perInput(`_convertToFeedUrl handles feed links`, async (t, input) => {
    const scany = new Scany();

    const url = await scany['_convertToFeedUrl'](input);

    t.is(url, input);
}, feeds);

perInput(`_convertToFeedUrl handles user links`, async (t, input) => {
    const scany = new Scany();

    const url = await scany['_convertToFeedUrl'](`https://www.youtube.com/user/${input}`);

    t.is(url, `${scany['_options'].baseFeedUrl}?user=${input}`);
}, usernames);

perInput(`_convertToFeedUrl handles channel links`, async (t, input) => {
    const scany = new Scany();

    const url = await scany['_convertToFeedUrl'](`https://www.youtube.com/channel/${input}`);

    t.is(url, `${scany['_options'].baseFeedUrl}?channel_id=${input}`);
}, channelIds);

perInput(`_convertToFeedUrl handles playlist links`, async (t, input) => {
    const scany = new Scany();

    const url = await scany['_convertToFeedUrl'](`https://www.youtube.com/playlist?list=${input}`);

    t.is(url, `${scany['_options'].baseFeedUrl}?playlist_id=${input}`);
}, playlists);

perInput(`_convertToFeedUrl handles usernames`, async (t, input) => {
    const scany = new Scany();

    const url = await scany['_convertToFeedUrl'](input);

    t.is(url, `${scany['_options'].baseFeedUrl}?user=${input}`);
}, usernames);

perInput(`fetch creates usable data`, async (t, input) => {
    const scany = new Scany();

    const result = await scany.fetch(input);

    t.is(typeof result.author, 'string');
    t.is(typeof result.playlist, 'string');
    t.is(typeof result.feed, 'string');
    t.true(Array.isArray(result.videos));

    result.videos.forEach(video => {
        t.is(typeof video.title, 'string');
        t.is(typeof video.description, 'string');
        t.is(typeof video.url, 'string');
        t.true(video.published instanceof Date);
        t.is(typeof video.id, 'string');
        t.is(typeof video.rating, 'number');
        t.is(typeof video.views, 'number');

        t.not(typeof video.thumbnails, 'undefined');

        // Just check for one, since all of them are covered by other tests.        
        t.is(typeof video.thumbnails.high, 'string');
    });
}, feeds);

perInput(`fetchFlat creates flat data`, async (t, input) => {
    const scany = new Scany();

    const result = await scany.fetchFlat(input);

    t.true(Array.isArray(result));

    result.forEach(video => {
        t.is(typeof video.author, 'string');
        t.is(typeof video.playlist, 'string');
        t.is(typeof video.feed, 'string');
        t.is(typeof video.title, 'string');
        t.is(typeof video.description, 'string');
        t.is(typeof video.url, 'string');
        t.true(video.published instanceof Date);
        t.is(typeof video.id, 'string');
        t.is(typeof video.rating, 'number');
        t.is(typeof video.views, 'number');

        t.not(typeof video.thumbnails, 'undefined');

        // Just check for one, since all of them are covered by other tests.        
        t.is(typeof video.thumbnails.high, 'string');
    });
}, feeds);

perInput(`fetch rejects on failure`, (t, input) => {
    const scany = new Scany();

    return scany.fetch(input).then(result => t.fail(), err => {
        t.not(typeof err, 'undefined');
    })
}, invalids);

function perInput(prefix: string, cb: (t: ContextualTestContext, input: string) => void | Promise<any>, items: Array<string>) {
    items.forEach(input => {
        test(`Scany#${prefix} ("${input}")`, t => {
            return cb(t, input);
        });
    });
}
