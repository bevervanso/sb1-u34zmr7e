import axios from 'axios';
import cheerio from 'cheerio';
import { getRandomUserAgent } from './user-agent.js';
import { getRandomProxy } from './proxy.js';

export async function getVideoInfo(url) {
  try {
    const userAgent = getRandomUserAgent();
    const proxy = getRandomProxy();
    
    // First request to get the page HTML
    const response = await axios.get(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0'
      },
      httpsAgent: proxy,
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    
    // Look for video metadata in the page
    const videoUrl = $('meta[property="og:video"]').attr('content') ||
                    $('meta[property="og:video:secure_url"]').attr('content');
    
    const thumbnailUrl = $('meta[property="og:image"]').attr('content');
    const title = $('meta[property="og:title"]').attr('content');
    
    if (!videoUrl) {
      throw new Error('Video URL not found. The post might be private or deleted.');
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