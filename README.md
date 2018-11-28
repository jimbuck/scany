# scany

[![Build Status](https://img.shields.io/travis/JimmyBoh/scany/master.svg?style=flat-square)](https://travis-ci.org/JimmyBoh/scany)
[![Code Coverage](https://img.shields.io/coveralls/JimmyBoh/scany/master.svg?style=flat-square)](https://coveralls.io/github/JimmyBoh/scany?branch=master)
[![Dependencies](https://img.shields.io/david/JimmyBoh/scany.svg?style=flat-square)](https://david-dm.org/JimmyBoh/scany)
[![DevDependencies](https://img.shields.io/david/dev/JimmyBoh/scany.svg?style=flat-square)](https://david-dm.org/JimmyBoh/scany?type=dev)
[![npm](https://img.shields.io/npm/v/scany.svg?style=flat-square)](https://www.npmjs.com/package/scany)
[![Monthly Downloads](https://img.shields.io/npm/dm/scany.svg?style=flat-square)](https://www.npmjs.com/package/scany)
[![Total Downloads](https://img.shields.io/npm/dt/scany.svg?style=flat-square)](https://www.npmjs.com/package/scany)

YouTube provides basic information on users, channels, and playlists via RSS feeds. This module makes it incredibly easy to access that data without requiring an API key! Not having to sign up for something new is great for hackathons and small projects.

## Features

- No configuration necessary!
- Scrapes the web for channels/users/playlists and reads metadata directly from the video feeds.
- Anonymous API, no OAuth key needed!
- Automatically creates all available thumbnail URLs for easy use!
- Complete, built-in typescript typings!

## Installation

```bash
npm i scany
```

### Example

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

## API

### Methods

#### scanFeed(url, [options])

Returns a Promise for a [`FeedResult` object](#FeedResult).

##### url

Type: `String`

The URL to a Youtube channel or playlist. If the URL is a channel it will return the feed of the default "Uploads" playlist.

##### options

Type: `Object`

 - `limit`: `Number` - Limit the number of videos retrieved from the feed URL. Defaults to all (`MAX_SAFE_INTEGER`) for playlists and `10` for channel urls (recent uploads).
 - `scanVideos`: `Boolean` - Toggles the retrieval of extra metadata for each video. Defaults to `true`.
 - `concurrency`: `Number` - Maximum number of videos to query at once. Defaults to `8`. Ignored if `scanVideos` is false.

#### scanVideo(url, [concurrency])

Returns a Promise for one or more [`VideoResult` objects](#VideoResult).

##### url

Type: `String` `String[]`

The URL or array of URLs to a Youtube video.

##### concurrency

Type: `Number`

Maximum number of videos to query at once. Defaults to `8`.

#### findFeed(video, [options])

Finds a playlist based on the provided video title/channel.

 - _TODO_

### Models

#### FeedResult

Type: `Object`

 - _TODO_

#### VideoResult

Type: `Object`

 - _TODO_

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
