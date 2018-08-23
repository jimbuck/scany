import * as debug from 'debug';
const log = debug('scany:debug');

import { Scany } from './';

(async function () {
  log('Starting debug script...');
  const scany = new Scany({ concurrency: 2, show: true });

  let start = Date.now();
  const channelResult = await scany.feed('https://www.youtube.com/channel/UCH-_hzb2ILSCo9ftVSnrCIQ');
  //const playlistResult = await scany.feed('https://www.youtube.com/playlist?list=PLRJGGcGGYxmqzFSXP7gAdJVrG7uBfwxMX');

  channelResult.videos = await scany.video(channelResult.videos.map(v => v.videoId));

  let duration = Math.round((Date.now() - start) / 1000);

  log(`Total Time: ${duration} seconds.`);
  log('Done!');
})().catch(err => {
  console.error(err);
  throw err;
});