import * as debug from 'debug';
const log = debug('scany:debug');

import { scanFeed, scanVideo } from './';

(async function () {
  log('Starting debug script...');
  let start = Date.now();
  const channelResult = await scanFeed('https://www.youtube.com/channel/UCH-_hzb2ILSCo9ftVSnrCIQ');
  //const playlistResult = await scany.feed('https://www.youtube.com/playlist?list=PLRJGGcGGYxmqzFSXP7gAdJVrG7uBfwxMX');

  channelResult.videos = await scanVideo(channelResult.videos.map(v => v.videoId));

  let duration = Math.round((Date.now() - start) / 1000);

  log(`Total Time: ${duration} seconds.`);
  log('Done!');
})().catch(err => {
  console.error(err);
  throw err;
});