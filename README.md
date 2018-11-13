# scany

[![Build Status](https://img.shields.io/travis/JimmyBoh/scany/master.svg?style=flat-square)](https://travis-ci.org/JimmyBoh/scany)
[![Code Coverage](https://img.shields.io/coveralls/JimmyBoh/scany/master.svg?style=flat-square)](https://coveralls.io/github/JimmyBoh/scany?branch=master)
[![Dependencies](https://img.shields.io/david/JimmyBoh/scany.svg?style=flat-square)](https://david-dm.org/JimmyBoh/scany)
[![DevDependencies](https://img.shields.io/david/dev/JimmyBoh/scany.svg?style=flat-square)](https://david-dm.org/JimmyBoh/scany?type=dev)
[![npm](https://img.shields.io/npm/v/scany.svg?style=flat-square)](https://www.npmjs.com/package/scany)
[![Monthly Downloads](https://img.shields.io/npm/dm/scany.svg?style=flat-square)](https://www.npmjs.com/package/scany)
[![Total Downloads](https://img.shields.io/npm/dt/scany.svg?style=flat-square)](https://www.npmjs.com/package/scany)

YouTube provides basic information on users, channels, and playlists via RSS feeds. This module makes it incredibly easy to access that data without requiring an API key! Not having to sign up for something new is great for hackathons and small projects.

## Installation

```bash
npm i scany
```

## Example

```ts
import { scanFeed, scanVideo } from 'scany';

let singleVideo = await scanVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
let multipleVideos = await scanVideo(['OFbBs9M0cqw', 'https://www.youtube.com/watch?v=beaHxW5o-uw']);

let channelViaUser = await scanFeed('https://www.youtube.com/user/freddiew');
let channelViaChannelId = await scanFeed('https://www.youtube.com/channel/UCG08EqOAXJk_YXPDsAvReSg');
let playlist = await scanFeed('https://www.youtube.com/playlist?list=PLjHf9jaFs8XUXBnlkBAuRkOpUJosxJ0Vx');

console.log(`${playlist.playlistTitle} by ${playlist.channelName}:`);
playlist.videos.forEach((video, i) => {
  console.log(`[${i}] ${video.videoTitle} (${video.channelName})`);
});

```

## Features

- No configuration necessary!
- Scrapes the web for channels/users/playlists and reads meta data directly from the video feeds.
- Anonymous API, no OAuth key needed!
- Automatically creates all available thumbnail URLs for easy use!
- Complete, built-in typescript typings!

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
