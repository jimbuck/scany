# scany

[![Build Status](https://img.shields.io/travis/JimmyBoh/scany/master.svg?style=flat-square)](https://travis-ci.org/JimmyBoh/scany)
[![Code Coverage](https://img.shields.io/coveralls/JimmyBoh/scany/master.svg?style=flat-square)](https://coveralls.io/github/JimmyBoh/scany?branch=master)
[![Dependencies](https://img.shields.io/david/JimmyBoh/scany.svg?style=flat-square)](https://david-dm.org/JimmyBoh/scany)
[![DevDependencies](https://img.shields.io/david/dev/JimmyBoh/scany.svg?style=flat-square)](https://david-dm.org/JimmyBoh/scany?type=dev)
[![npm](https://img.shields.io/npm/v/scany.svg?style=flat-square)](https://www.npmjs.com/package/scany)
[![Monthly Downloads](https://img.shields.io/npm/dm/scany.svg?style=flat-square)](https://www.npmjs.com/package/scany)
[![Total Downloads](https://img.shields.io/npm/dt/scany.svg?style=flat-square)](https://www.npmjs.com/package/scany)

YouTube provides basic information on users, channels, and playlists via RSS feeds. This module makes it incredibly easy to access that data without requiring an API key! Not having to sign up for something new is great for hackathons and small projects. If more information is required, then the official YouTube API is recommended.

## Installation

```bash
npm i scany
```

## Example

```ts
import { Scany } from 'scany';

const scany = new Scany();

let channelViaUser = await scany.feed('https://www.youtube.com/user/freddiew');

let channelViaChannelId = await scany.feed('https://www.youtube.com/channel/UCG08EqOAXJk_YXPDsAvReSg');

let singleVideo = await scany.video('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

let multipleVideos = await scany.video(['OFbBs9M0cqw', 'https://www.youtube.com/watch?v=beaHxW5o-uw']);

let playlist = await scany.feed('https://www.youtube.com/playlist?list=PLjHf9jaFs8XUXBnlkBAuRkOpUJosxJ0Vx');
// Optionally retrieve more data (description, views, publish date, etc.) for each video:
playlist.videos = await scany.video(playlist.videos.map(v => v.videoId));

console.log(`${playlist.playlist} by ${playlist.channel}:`);
playlist.videos.forEach((v, i) => {
  console.log(`${i}. ${v.video} (${v.channel})`);
});

```

See `src/models.ts` and `src/debug.ts` for model details and further examples.

## Features

- No configuration necessary!
- Uses RSS feed for channels/users and custom screen scraper for videos and playlists.
- Lightweight API, no OAuth key needed!
- Automatically creates all available thumbnail URLs for easy use!
- Complete, built-in typescript typings!

## Caveats/Warnings

- Channels only load a maximum of 15 videos at a time. This is a "recent videos" API not a "list videos" API.
- Playlist data will only include basic data for each video. See optional properties on `VideoResult` for details.
- Don't spam these commands, one endpoint only needs to be fetched every few hours at most (24 hours should be sufficient for most applications).

## Related

- Use [`pully`](https://github.com/jimmyboh/pully) to easily download a retrieved videos.
- Check out [`pully-server`](https://github.com/jimmyboh/pully-server) for a complete solution to set up an auto-download system.

## Contribute

1. Fork it
1. `npm i`
1. `npm run watch`
1. Make changes and **write tests**.
1. Send pull request! :sunglasses:

## License

MIT
