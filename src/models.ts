

/**
 * Basic channel data.
 *
 * @export
 * @interface ChannelResult
 */
export interface ChannelResult {

  /**
   * The unique identifier of the channel.
   *
   * @type {string}
   * @memberof ChannelResult
   */
  channelId: string;

  /**
   * The display name of the channel.
   *
   * @type {string}
   * @memberof ChannelResult
   */
  channel: string;


  /**
   * The URL to the channel.
   *
   * @type {string}
   * @memberof ChannelResult
   */
  channelUrl: string;


  /**
   * List of recent videos uploaded by this channel.
   *
   * @type {Array<VideoResult>}
   * @memberof ChannelResult
   */
  videos: Array<VideoResult>;


  /**
   * The date and time this channel info was retrieved.
   *
   * @type {Date}
   * @memberof ChannelResult
   */
  lastScanned: Date;
}

/**
 * Basic playlist data.
 *
 * @export
 * @interface PlaylistResult
 */
export interface PlaylistResult {

  /**
   * The unique identifier of the playlist.
   *
   * @type {string}
   * @memberof PlaylistResult
   */
  playlistId: string;


  /**
   * The display name of the playlist.
   *
   * @type {string}
   * @memberof PlaylistResult
   */
  playlist: string;

  /**
   * The URL to the playlist.
   *
   * @type {string}
   * @memberof PlaylistResult
   */
  playlistUrl: string;

  /**
   * The unique identifier of the channel that created the playlist.
   *
   * @type {string}
   * @memberof PlaylistResult
   */
  channelId: string;

  /**
   * The display name of the channel that created the playlist.
   *
   * @type {string}
   * @memberof PlaylistResult
   */
  channel: string;


  /**
   * The URL to the channel that created the playlist.
   *
   * @type {string}
   * @memberof PlaylistResult
   */
  channelUrl: string;


  /**
   * List of videos from this playlist.
   *
   * @type {Array<VideoResult>}
   * @memberof PlaylistResult
   */
  videos: Array<VideoResult>;


  /**
   * The date and time this playlist info was retrieved.
   *
   * @type {Date}
   * @memberof PlaylistResult
   */
  lastScanned: Date;
}


/**
 * Basic video data.
 *
 * @export
 * @interface VideoResult
 */
export interface VideoResult {

  /**
   * The unqiue identifier of the video.
   *
   * @type {string}
   * @memberof VideoResult
   */
  videoId: string;


  /**
   * The title of the video.
   *
   * @type {string}
   * @memberof VideoResult
   */
  video: string;


  /**
   * The URL to the video.
   *
   * @type {string}
   * @memberof VideoResult
   */
  videoUrl: string;


  /**
   * The display name of the channel who published the video.
   *
   * @type {string}
   * @memberof VideoResult
   */
  channel: string;


  /**
   * The unqiue identifier of the channel who published the video.
   *
   * @type {string}
   * @memberof VideoResult
   */
  channelId: string;

  /**
   * The URL of the channel who published the video.
   *
   * @type {string}
   * @memberof VideoResult
   */
  channelUrl: string;

  /**
   * The complete description of the video.
   *
   * @type {string}
   * @memberof VideoResult
   */
  description: string;

  /**
   * The date the video was published (time is not always available).
   *
   * @type {Date}
   * @memberof VideoResult
   */
  published: Date;

  /**
   * The thumbnail URLs for this video.
   *
   * @type {Thumbnails}
   * @memberof VideoResult
   */
  thumbnails: Thumbnails;


  /**
   * The total approximate number of views.
   *
   * @type {number}
   * @memberof VideoResult
   */
  views: number;

  /**
   * The date and time this video info was retrieved.
   *
   * @type {Date}
   * @memberof VideoResult
   */
  lastScanned: Date;
}

/**
 * Collection of various thumbnail URLs.
 *
 * @export
 * @interface Thumbnails
 */
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
