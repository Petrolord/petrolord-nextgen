/**
 * Utility functions for handling Vimeo video URLs and fetching thumbnails.
 */

// Simple in-memory cache for thumbnails
const thumbnailCache = new Map();

/**
 * Extracts the Vimeo Video ID from various URL formats.
 * @param {string} url - The Vimeo URL or raw ID
 * @returns {string|null} The extracted Video ID or null if invalid
 */
export const parseVimeoUrl = (url) => {
  if (!url) return null;
  const strUrl = String(url).trim();

  // If it's already just a number, return it
  if (/^\d+$/.test(strUrl)) {
    return strUrl;
  }

  // Regex to match vimeo.com/ID, player.vimeo.com/video/ID, and optional hash
  const match = strUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)(?:\/[a-zA-Z0-9]+)?/i);
  
  if (match && match[1]) {
    return match[1];
  }

  console.warn(`[vimeoUtils] Could not parse Vimeo ID from: ${url}`);
  return null;
};

/**
 * Generates the iframe src URL for a Vimeo video.
 * @param {string} videoId - The Vimeo Video ID
 * @returns {string} The iframe src URL
 */
export const getVimeoIframeUrl = (videoId) => {
  if (!videoId) return '';
  // Add autoplay and dnt (do not track) parameters
  return `https://player.vimeo.com/video/${videoId}?autoplay=1&dnt=1`;
};

/**
 * Fetches the thumbnail and metadata for a Vimeo video using the oEmbed API.
 * Uses an in-memory cache to prevent redundant API calls.
 * @param {string} url - The Vimeo URL or Video ID
 * @returns {Promise<{thumbnailUrl: string, videoTitle: string, videoId: string}|null>}
 */
export const fetchVimeoThumbnail = async (url) => {
  const videoId = parseVimeoUrl(url);
  
  if (!videoId) {
    throw new Error('Invalid Vimeo URL or ID provided.');
  }

  // Check cache first
  if (thumbnailCache.has(videoId)) {
    console.log(`[vimeoUtils] Cache hit for video ID: ${videoId}`);
    return thumbnailCache.get(videoId);
  }

  console.log(`[vimeoUtils] Fetching thumbnail for video ID: ${videoId}`);
  const oEmbedUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`;

  try {
    const response = await fetch(oEmbedUrl);
    
    if (!response.ok) {
      if (response.status === 403) throw new Error('This video is private or restricted.');
      if (response.status === 404) throw new Error('Video not found.');
      throw new Error(`Failed to fetch video details (${response.status}).`);
    }

    const data = await response.json();
    
    // Prefer higher resolution thumbnails if available, or fallbacks
    const thumbnailUrl = data.thumbnail_url_with_play_button || data.thumbnail_url || data.thumbnail_large;
    const videoTitle = data.title || 'Vimeo Video';

    if (!thumbnailUrl) {
      throw new Error('No thumbnail found in Vimeo response.');
    }

    const result = {
      thumbnailUrl,
      videoTitle,
      videoId
    };

    // Store in cache
    thumbnailCache.set(videoId, result);
    return result;

  } catch (error) {
    console.error(`[vimeoUtils] Error fetching thumbnail:`, error.message);
    throw error;
  }
};