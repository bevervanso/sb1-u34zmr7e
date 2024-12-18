import axios from 'axios';
import * as cheerio from 'cheerio';
import { getRandomUserAgent } from './user-agent.js';

export async function getVideoInfo(url) {
  try {
    const userAgent = getRandomUserAgent();
    
    const response = await axios.get(url, { 
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 10000
    });

    const $ = load(response.data);
    
    // Extract video URL from script tags
    let videoUrl = '';
    $('script[type="text/javascript"]').each((_, script) => {
      const content = $(script).html();
      if (content && content.includes('video_url')) {
        const match = content.match(/"video_url":\s*"([^"]+)"/);
        if (match && match[1]) {
          videoUrl = match[1].replace(/\\u0026/g, '&');
        }
      }
    });
    
    // Extract thumbnail and title
    const thumbnailUrl = $('meta[property="og:image"]').attr('content') || '';
    const title = $('meta[property="og:title"]').attr('content') || 'Instagram Video';
    
    if (!videoUrl) {
      // Fallback to og:video if available
      videoUrl = $('meta[property="og:video"]').attr('content') ||
                 $('meta[property="og:video:secure_url"]').attr('content');
                 
      if (!videoUrl) {
        throw new Error('Video URL not found. The post might be private or deleted.');
      }
    }

    return {
      downloadUrl: videoUrl,
      thumbnailUrl,
      title
    };
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          throw new Error('Reel not found. The link might be invalid or the post was deleted.');
        case 403:
          throw new Error('Access denied. The reel might be private.');
        case 429:
          throw new Error('Too many requests. Please try again later.');
        default:
          throw new Error(`Failed to fetch video: ${error.message}`);
      }
    }
    throw new Error(`Network error: ${error.message}`);
  }
}