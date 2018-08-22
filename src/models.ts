
export interface ScanResult {
  /**
   * The date and time the info was retrieved.
   *
   * @type {Date}
   * @memberof VideoResult
   */
  lastScanned: Date;
}

/**
 * Basic channel or playlist data.
 *
 * @export
 * @interface FeedResult
 * @extends {ScanResult}
 */
export interface FeedResult extends ScanResult {

  /**
   * The unique identifier of the channel.
   *
   * @type {string}
   * @memberof FeedResult
   */
  channelId: string;

  /**
   * The display name of the channel.
   *
   * @type {string}
   * @memberof FeedResult
   */
  channel: string;

  /**
   * The URL to the channel.
   *
   * @type {string}
   * @memberof FeedResult
   */
  channelUrl: string;

  /**
   * The unique identifier of the playlist. Only popualted if result is a playlist.
   *
   * @type {string}
   * @memberof PlaylistResult
   */
  playlistId?: string;

  /**
   * The display name of the playlist. Only popualted if result is a playlist.
   *
   * @type {string}
   * @memberof PlaylistResult
   */
  playlist?: string;

  /**
   * The URL to the playlist. Only popualted if result is a playlist.
   *
   * @type {string}
   * @memberof PlaylistResult
   */
  playlistUrl?: string;

  /**
   * List of recent videos uploaded by this channel.
   *
   * @type {Array<VideoResult>}
   * @memberof FeedResult
   */
  videos: Array<VideoResult>;
}

/**
 * Basic video data.
 *
 * @export
 * @interface VideoResult
 * @extends {ScanResult}
 */
export interface VideoResult extends ScanResult {

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