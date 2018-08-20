# scany

[![Build Status](https://img.shields.io/travis/JimmyBoh/scany/master.svg?style=flat-square)](https://travis-ci.org/JimmyBoh/scany)
[![Code Coverage](https://img.shields.io/coveralls/JimmyBoh/scany/master.svg?style=flat-square)](https://coveralls.io/github/JimmyBoh/scany?branch=master)
[![Dependencies](https://img.shields.io/david/JimmyBoh/scany.svg?style=flat-square)](https://david-dm.org/JimmyBoh/scany)
[![DevDependencies](https://img.shields.io/david/dev/JimmyBoh/scany.svg?style=flat-square)](https://david-dm.org/JimmyBoh/scany?type=dev)
[![npm](https://img.shields.io/npm/v/scany.svg?style=flat-square)](https://www.npmjs.com/package/scany)
[![Monthly Downloads](https://img.shields.io/npm/dm/scany.svg?style=flat-square)](https://www.npmjs.com/package/scany)
[![Total Downloads](https://img.shields.io/npm/dt/scany.svg?style=flat-square)](https://www.npmjs.com/package/scany)

YouTube provides basic information on users, channels, and playlists via RSS feeds. This module makes it incredibly easy to access that data without requiring an API key! Not having to sign up for something new is great for hackathons and small projects. If more information is required, then the official YouTube API is recommended.


## Installation:

```bash
npm i --save scany
```

## Example:

```ts
import { Scany } from 'scany';

const scany = new Scany();

Promise.all([
  scany.channel('https://www.youtube.com/user/freddiew'),
  scany.channel('https://www.youtube.com/channel/UCG08EqOAXJk_YXPDsAvReSg'),
  scany.playlist('https://www.youtube.com/playlist?list=PLjHf9jaFs8XUXBnlkBAuRkOpUJosxJ0Vx'),
  scany.videos(['OFbBs9M0cqw', 'beaHxW5o-uw'])
]).then(([channel1, channel2, playlist1, videoList1]) => {
  // Do fun things withe the info!
});
```

See `src/models.ts` and `src/debug.ts` for model details and further examples.

## Features:
 - No configuration necessary!
 - Infers URL type for retrieving .
 - Lightweight API, no OAuth key needed!
 - Automatically creates all available thumbnail URLs for easy use!
 - .

## Caveats/Warnings:
 - Channels only load a maximum of 15 videos at a time. This is a "recent videos" API not a "list videos" API.
 - Video duration is not present in the YouTube RSS feeds at this time.
 - Don't spam these commands, one endpoint only needs to be fetched every few hours at most (24 hours should be sufficient for most applications).

## Related

 - Use [`pully`](https://github.com/jimmyboh/pully) to easily download a retrieved videos.
 - Check out [`pully-server`](https://github.com/jimmyboh/pully-server) for a complete solution to set up an auto-download system.

## Contribute
 
 0. Fork it
 1. `npm i`
 2. `npm run watch`
 3. Make changes and **write tests**.
 4. Send pull request! :sunglasses:
 
## License:
 
MIT