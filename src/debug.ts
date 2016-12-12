import { ScanResult } from './models';

import { Scany } from './index';

const scany = new Scany();

let p = Promise.resolve();

[
  'https://www.youtube.com/user/freddiew',
  'https://www.youtube.com/channel/UCG08EqOAXJk_YXPDsAvReSg',
  'https://www.youtube.com/playlist?list=PLjHf9jaFs8XUXBnlkBAuRkOpUJosxJ0Vx'
].forEach(url => p = p
  .then(() => scany.fetch(url))
  .then(printResult)
  .then(delay(500)));

p.then(() => console.log('Done!'));

function printResult(result: ScanResult) {
  console.log(`┌ ${result.title} by ${result.author} (${result.videos.length} videos)`);
  result.videos.forEach((video, i) => {
    const blockChar = i === result.videos.length - 1 ? '└' : '├';
    console.log(`${blockChar}── ${video.title} [${getStarRating(video.rating)}]`);
  });
}

function getStarRating(rating: number) {
  let outStr = '';
  rating = Math.floor(rating);
    
  for (let i = 0; i < 5; i++) {
    outStr += ((i < rating) ? '★' : '☆');
  }
    
  return outStr;
}

function delay(time: number): (x?: any) => Promise<any> {
  return (x?: any) => {
    return new Promise<any>((resolve, reject) => {
      setTimeout(resolve.bind(null, x), time);
    });
  };
}