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
  scany.fetch('https://www.youtube.com/user/freddiew'),
  scany.fetch('https://www.youtube.com/channel/UCG08EqOAXJk_YXPDsAvReSg'),
  scany.fetchFlat('https://www.youtube.com/playlist?list=PLjHf9jaFs8XUXBnlkBAuRkOpUJosxJ0Vx')
]).then((results) => {
  console.log(results); // Last one is just an array of videos with embedded author info.
});
```

See `src/models.ts` and `src/debug.ts` for model details and further examples.

## Features:
 - No configuration necessary!
 - Automatically converts YouTube URLs into their feed equivalents.
 - Lightweight API, no OAuth key needed!
 - Automatically creates all available thumbnail URLs for easy use!
 - Methods for tiered data (author object with array of videos) or flat data (array of videos with author properties).

## Example Data:

### Fetch:
```json
{
    "author": "RocketJump",
    "playlist": "RocketJump",
    "feed": "http://www.youtube.com/feeds/videos.xml?user=freddiew",
    "videos": [
        {
            "title": "November Update (VGHS, Dimension 404, and more!)",
            "description": "Read about what's happening! ➤ https://www.rocketjump.com/blog/november-2016-update\n\nAn update video! Learn about what's going on here at RocketJump!\n\nMore awesome videos at RocketJump.com!\n\nHelp Daniel get out of the forums ➤ https://discuss.rocketjump.com/t/heeeeelp-im-stuck-in-here/\n\nRJ Store ➤ http://shop.rocketjump.com\nFollow RocketJump on Twitter ➤ http://bit.ly/RJtweet\nFollow RJFS on Twitter ➤ https://twitter.com/rjfilmschool\n\nFor licensing and usage inquiries please email licensing@rocketjump.com",
            "id": "0C6Gyp-Fpkc",
            "url": "http://www.youtube.com/watch?v=0C6Gyp-Fpkc",
            "published": "2016-11-01T19:00:30.000Z",
            "thumbnails": {
                "background": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/0.jpg",
                "start": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/1.jpg",
                "middle": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/2.jpg",
                "end": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/3.jpg",
                "high": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/hqdefault.jpg",
                "medium": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/mqdefault.jpg",
                "normal": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/default.jpg",
                "hd": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/maxresdefault.jpg",
                "sd": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/sddefault.jpg"
            },
            "views": 184013,
            "rating": 4.93
        },
        ...
        {
            "title": "HAROLD - Horror Short",
            "description": "Thanks to Shudder for sponsoring this video! Use promo code ROCKETJUMP to get a free 7 day trial AND your first month free at  https://www.shudder.com/\n\nA con-artist psychic gets a visit from an unexpected guest.\n\nStarring: Catherine Farrington Garcia, Christopher Wood\nFeaturing: Bagheera the Cat\n\nWriters/Directors: Jon Salmon and Joey Scoma\nStory: Jon Salmon\nDP: Jon Salmon\nProducer: Cherish Chen\n2nd Unit DP: Shaun Dixon\nGaffer: Dominic D'Astice\nProduction Designer: Eliah Prichard\nProp Master: Akiko Thomas\nOn Set Dresser: Kennedy Lynn\nEditor: Joey Scoma\nSound Designer: Kevin Senzaki\nVFX: Clinton Jones, Freddie Wong\nCat Wrangler: Lauren Haroutunian\n\nSpecial thanks to Alicia Martinez!\n\nCheck out the RocketJump Film School at http://youtube.com/rjfilmschool!\n\nMore awesome videos at RocketJump.com!\n\nRJ Store ➤ http://shop.rocketjump.com\nFollow RocketJump on Twitter ➤ http://bit.ly/RJtweet\nFollow RJFS on Twitter ➤ https://twitter.com/rjfilmschool\nJoin the discussion ➤ https://discuss.rocketjump.com/\n\nFor licensing and usage inquiries please email licensing@rocketjump.com",
            "id": "mLXaSHDeTXM",
            "url": "http://www.youtube.com/watch?v=mLXaSHDeTXM",
            "published": "2016-10-27T16:00:03.000Z",
            "thumbnails": {
                "background": "https://i1.ytimg.com/vi/mLXaSHDeTXM/0.jpg",
                "start": "https://i1.ytimg.com/vi/mLXaSHDeTXM/1.jpg",
                "middle": "https://i1.ytimg.com/vi/mLXaSHDeTXM/2.jpg",
                "end": "https://i1.ytimg.com/vi/mLXaSHDeTXM/3.jpg",
                "high": "https://i1.ytimg.com/vi/mLXaSHDeTXM/hqdefault.jpg",
                "medium": "https://i1.ytimg.com/vi/mLXaSHDeTXM/mqdefault.jpg",
                "normal": "https://i1.ytimg.com/vi/mLXaSHDeTXM/default.jpg",
                "hd": "https://i1.ytimg.com/vi/mLXaSHDeTXM/maxresdefault.jpg",
                "sd": "https://i1.ytimg.com/vi/mLXaSHDeTXM/sddefault.jpg"
            },
            "views": 186684,
            "rating": 4.85
        }
    ]
}
```

### fetchFlat (author, playlist, and feed are in every video):

```json
[
    {
        "title": "November Update (VGHS, Dimension 404, and more!)",
        "description": "Read about what's happening! ➤ https://www.rocketjump.com/blog/november-2016-update\n\nAn update video! Learn about what's going on here at RocketJump!\n\nMore awesome videos at RocketJump.com!\n\nHelp Daniel get out of the forums ➤ https://discuss.rocketjump.com/t/heeeeelp-im-stuck-in-here/\n\nRJ Store ➤ http://shop.rocketjump.com\nFollow RocketJump on Twitter ➤ http://bit.ly/RJtweet\nFollow RJFS on Twitter ➤ https://twitter.com/rjfilmschool\n\nFor licensing and usage inquiries please email licensing@rocketjump.com",
        "id": "0C6Gyp-Fpkc",
        "url": "http://www.youtube.com/watch?v=0C6Gyp-Fpkc",
        "published": "2016-11-01T19:00:30.000Z",
        "thumbnails": {
            "background": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/0.jpg",
            "start": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/1.jpg",
            "middle": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/2.jpg",
            "end": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/3.jpg",
            "high": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/hqdefault.jpg",
            "medium": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/mqdefault.jpg",
            "normal": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/default.jpg",
            "hd": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/maxresdefault.jpg",
            "sd": "https://i1.ytimg.com/vi/0C6Gyp-Fpkc/sddefault.jpg"
        },
        "views": 184013,
        "rating": 4.93,
        "author": "RocketJump",
        "playlist": "RocketJump",
        "feed": "http://www.youtube.com/feeds/videos.xml?user=freddiew"
    },
    ...
    {
        "title": "HAROLD - Horror Short",
        "description": "Thanks to Shudder for sponsoring this video! Use promo code ROCKETJUMP to get a free 7 day trial AND your first month free at  https://www.shudder.com/\n\nA con-artist psychic gets a visit from an unexpected guest.\n\nStarring: Catherine Farrington Garcia, Christopher Wood\nFeaturing: Bagheera the Cat\n\nWriters/Directors: Jon Salmon and Joey Scoma\nStory: Jon Salmon\nDP: Jon Salmon\nProducer: Cherish Chen\n2nd Unit DP: Shaun Dixon\nGaffer: Dominic D'Astice\nProduction Designer: Eliah Prichard\nProp Master: Akiko Thomas\nOn Set Dresser: Kennedy Lynn\nEditor: Joey Scoma\nSound Designer: Kevin Senzaki\nVFX: Clinton Jones, Freddie Wong\nCat Wrangler: Lauren Haroutunian\n\nSpecial thanks to Alicia Martinez!\n\nCheck out the RocketJump Film School at http://youtube.com/rjfilmschool!\n\nMore awesome videos at RocketJump.com!\n\nRJ Store ➤ http://shop.rocketjump.com\nFollow RocketJump on Twitter ➤ http://bit.ly/RJtweet\nFollow RJFS on Twitter ➤ https://twitter.com/rjfilmschool\nJoin the discussion ➤ https://discuss.rocketjump.com/\n\nFor licensing and usage inquiries please email licensing@rocketjump.com",
        "id": "mLXaSHDeTXM",
        "url": "http://www.youtube.com/watch?v=mLXaSHDeTXM",
        "published": "2016-10-27T16:00:03.000Z",
        "thumbnails": {
            "background": "https://i1.ytimg.com/vi/mLXaSHDeTXM/0.jpg",
            "start": "https://i1.ytimg.com/vi/mLXaSHDeTXM/1.jpg",
            "middle": "https://i1.ytimg.com/vi/mLXaSHDeTXM/2.jpg",
            "end": "https://i1.ytimg.com/vi/mLXaSHDeTXM/3.jpg",
            "high": "https://i1.ytimg.com/vi/mLXaSHDeTXM/hqdefault.jpg",
            "medium": "https://i1.ytimg.com/vi/mLXaSHDeTXM/mqdefault.jpg",
            "normal": "https://i1.ytimg.com/vi/mLXaSHDeTXM/default.jpg",
            "hd": "https://i1.ytimg.com/vi/mLXaSHDeTXM/maxresdefault.jpg",
            "sd": "https://i1.ytimg.com/vi/mLXaSHDeTXM/sddefault.jpg"
        },
        "views": 186684,
        "rating": 4.85,
        "author": "RocketJump",
        "playlist": "RocketJump",
        "feed": "http://www.youtube.com/feeds/videos.xml?user=freddiew"
    }
]
```

## Caveats/Warnings:
 - Only loads a maximum of 15 videos at a time. This is a "recent videos" API not a "list videos" API.
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