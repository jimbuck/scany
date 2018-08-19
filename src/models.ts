
export interface ScanOptions {
  baseFeedUrl?: string;
}

export interface ChannelResult {
  channelId: string;
  channel: string;
  channelUrl: string;
  videos: Array<VideoResult>;
}

export interface PlaylistResult extends ChannelResult {
  playlistId: string;
  playlist: string;
  playlistUrl: string;
}

export interface VideoResult {
  videoId: string;
  video: string;
  videoUrl: string;
  channel: string;
  channelId: string;
  channelUrl: string;
  description: string;
  published: Date;
  thumbnails: Thumbnails;
  views: number;
}

export interface Thumbnails {
  
  /**
   * Player background thumbnail (480x360).
   * 
   * @type {string}
   * @memberOf Thumbnails
   */
  background: string;

  /**
   * Start thumbnail (120x90).
   * 
   * @type {string}
   * @memberOf Thumbnails
   */
  start: string;

  /**
   * Middle thumbnail (120x90).
   * 
   * @type {string}
   * @memberOf Thumbnails
   */
  middle: string;

  /**
   * End thumbnail (120x90).
   * 
   * @type {string}
   * @memberOf Thumbnails
   */
  end: string;
  
  /**
   * High thumbnail (480x360).
   * 
   * @type {string}
   * @memberOf Thumbnails
   */
  high: string;

  /**
   * Medium thumbnail (320x180).
   * 
   * @type {string}
   * @memberOf Thumbnails
   */
  medium: string;

  /**
   * Normal thumbnail (120x90).
   * 
   * @type {string}
   * @memberOf Thumbnails
   */
  normal: string;

  /**
   * HD-only maximum resolution thumbnail (1280x720 or 1920x1080).
   * 
   * @type {string}
   * @memberOf Thumbnails
   */  
  hd?: string;
  
  /**
   * HD-only standard resolution thumbnail (640x480).
   * 
   * @type {string}
   * @memberOf Thumbnails
   */
  sd?: string;
}

export function parseThumbnails(videoId: string): Thumbnails {
  return {
    background: imageUrl(videoId, '0'),
    start: imageUrl(videoId, '1'),
    middle: imageUrl(videoId, '2'),
    end: imageUrl(videoId, '3'),

    high: imageUrl(videoId, 'hqdefault'),
    medium: imageUrl(videoId, 'mqdefault'),
    normal: imageUrl(videoId, 'default'),

    hd: imageUrl(videoId, 'maxresdefault'),
    sd: imageUrl(videoId, 'sddefault')
  }
};  

function imageUrl(videoId: string, image: string): string {
  return `https://i1.ytimg.com/vi/${videoId}/${image}.jpg`;
}
