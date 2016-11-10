import { test } from 'ava';

import { parseThumbnails, Thumbnails } from './models';

test(`parseThumbnails properly creates all available image URLs`, t => {
  const videoId = 'unIIn_1JOAE';

  const thumbnails = parseThumbnails(videoId);

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