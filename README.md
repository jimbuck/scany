# scany

[![Build Status](https://travis-ci.org/JimmyBoh/scany.svg?branch=master)](https://travis-ci.org/JimmyBoh/scany)
[![Coverage Status](https://coveralls.io/repos/github/JimmyBoh/scany/badge.svg?branch=master)](https://coveralls.io/github/JimmyBoh/scany?branch=master)
[![NPM Dependencies](https://david-dm.org/JimmyBoh/scany.svg)](https://david-dm.org/JimmyBoh/scany)

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
  scany.fetch('https://www.youtube.com/user/freddiew'),
  scany.fetch('https://www.youtube.com/channel/UCG08EqOAXJk_YXPDsAvReSg'),
  scany.fetch('https://www.youtube.com/playlist?list=PLjHf9jaFs8XUXBnlkBAuRkOpUJosxJ0Vx')
]).then(results => {
  console.log(results);
});
```

See `src/models.ts` and `src/debug.ts` for model details and further examples.

## Features:
 - No configuration necessary!
 - Automatically converts YouTube URLs into their feed equivalents.
 - Lightweight API, no OAuth key needed!

## Caveats/Warnings:
 - Only loads a maximum of 15 videos at a time. This is a "recent videos" API not a "list videos" API.
 - Video duration is not present in the YouTube RSS feeds at this time.
 - Don't spam these commands, one endpoint only needs to be fetched every few hours at most (24 hours should be sufficient for most applications).

## Related

Use [`pully`](https://github.com/jimmyboh/pully) to easily download a retrieved videos.
 
## Contribute
 
 0. Fork it
 1. `npm i`
 2. `gulp watch`
 3. Make changes and **write tests**.
 4. Send pull request! :sunglasses:
 
## License:
 
MIT