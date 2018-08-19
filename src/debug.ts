import { Scany, PlaylistResult, VideoResult } from './';

const scany = new Scany();

(async function () {
  console.log('Scanning for video...');
  const videoResult = await scany.video('https://www.youtube.com/watch?v=DEVi0mEaJJQ');
  console.log(`${videoResult.video} - ${videoResult.channel} (${videoResult.views} views)`);

  await delay(500)();


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