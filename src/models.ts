
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
  channelName: string;

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
  playlistTitle?: string;

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
  videoTitle: string;

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
  channelName: string;

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
  description?: string;

  /**
   * The date the video was published (time is not always available).
   *
   * @type {Date}
   * @memberof VideoResult
   */
  published?: Date;

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
  views?: number;
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
   * @memberof Thumbnails
   */
  background: string;

  /**
   * Normal quality thumbnail from start of video (120x90).
   * 
   * @type {string}
   * @memberof Thumbnails
   */
  start: string;

  /**
   * Middle of video thumbnail (120x90).
   * 
   * @type {string}
   * @memberof Thumbnails
   */
  middle: string;

  /**
   * Normal quality thumbnail from end of video. (120x90).
   * 
   * @type {string}
   * @memberof Thumbnails
   */
  end: string;
  
  /**
   * High quality thumbnail (480x360).
   * 
   * @type {string}
   * @memberof Thumbnails
   */
  high: string;

  /**
   * Medium quality thumbnail (320x180).
   * 
   * @type {string}
   * @memberof Thumbnails
   */
  medium: string;

  /**
   * Normal quality thumbnail (120x90).
   * 
   * @type {string}
   * @memberof Thumbnails
   */
  normal: string;

  /**
   * HD quality thumbnail (maximum resolution). Only present on 720p+ videos.
   * 
   * @type {string}
   * @memberof Thumbnails
   */  
  hd?: string;
  
  /**
   * SD quality thumbnail (640x480).  Only present on 480p+ videos.
   *
   * @type {string}
   * @memberof Thumbnails
   */
  sd?: string;
}