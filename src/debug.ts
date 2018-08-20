import { Scany } from './';

(async function () {
  console.log('Starting debug script...');  
  const scany = new Scany({ concurrency: 2, show: true });
  
  // const channelResult = await scany.channel('https://www.youtube.com/channel/UCH-_hzb2ILSCo9ftVSnrCIQ');
  let start = Date.now();
  const playlistResult = await scany.playlist('https://www.youtube.com/playlist?list=PLRJGGcGGYxmqzFSXP7gAdJVrG7uBfwxMX');
  let duration = Math.round((Date.now() - start) / 1000);

  console.log(`Total Time: ${duration} seconds.`);
  console.log('Done!');
})().catch(err => { 
  console.error(err);
});