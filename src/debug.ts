import { Scany } from './';

(async function () {
  const scany = new Scany();

  console.log('Scanning for video...');
  const channelResult = await scany.channel('https://www.youtube.com/channel/UCH-_hzb2ILSCo9ftVSnrCIQ');
  
  const playlist = await scany.playlist('');

  console.log('Done!');
})().catch(err => { 
  console.error(err);
});


function delay(time: number): (x?: any) => Promise<any> {
  return (x?: any) => {
    return new Promise<any>((resolve, reject) => {
      setTimeout(resolve.bind(null, x), time);
    });
  };
}