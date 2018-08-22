import { parse } from 'url';
import * as UrlPattern from 'url-pattern';

import { Thumbnails } from './models';

const userPattern = new UrlPattern('/user/:username');
const channelPattern = new UrlPattern('/channel/:channelId');

export function extractPlaylistId(url: string): string {
    const urlData = parse(url, true, true);
    let playlistId = null;

    if (urlData.query.list) {
        playlistId = urlData.query.list as string;
    }

    return playlistId;
}

export function extractVideoId(url: string): string {
    const urlData = parse(url, true, true);
    let videoId = null;

    if (urlData.query.v) {
        videoId = urlData.query.v as string;
    }

    return videoId;
}

export function extractChannelId(url: string): string {
    const urlData = parse(url, true, true);
    let channelId = null;

    const channelData = channelPattern.match(urlData.pathname);
    if (channelData !== null && channelData.channelId) {
        channelId = channelData.channelId as string;
    }

    return channelId;
}

export function extractUsername(url: string): string {
    const urlData = parse(url, true, true);
    let username = null;

    const userData = userPattern.match(urlData.pathname);
    if (userData !== null && userData.username) {
        username = userData.username as string;
    }

    return username;
}

export function createPlaylistUrl(playlistId: string): string {
    return `https://www.youtube.com/playlist?list=${playlistId}`;
}

export function createVideoUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
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

function padZeros(numStr: string): string {
    return `00${numStr || ''}`.slice(-2);
}