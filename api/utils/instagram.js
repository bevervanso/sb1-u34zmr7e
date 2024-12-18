import axios from 'axios';
import * as cheerio from 'cheerio';
import { getRandomUserAgent } from './user-agent.js';
import { load } from 'cheerio';

export async function getVideoInfo(url) {
  try {
    const userAgent = getRandomUserAgent();

    const response = await axios.get(url, { 
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cookie': 'ig_pr=1'  // Required cookie for public content
      },
      timeout: 15000,
      maxRedirects: 5
    });

    const $ = load(response.data);
    
    // Look for video URL in all script tags
    let videoUrl = '';
    $('script').each((_, script) => {
      const content = $(script).html() || '';
      
      // Look for video URL in different formats
      const patterns = [
        /"video_url":"([^"]+)"/,
        /video_url\\?":"([^"]+)"/,
        /"contentUrl":"([^"]+)"/,
        /contentUrl\\?":"([^"]+)"/
      ];
      
      for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match && match[1]) {
          videoUrl = match[1]
            .replace(/\\u0026/g, '&')
            .replace(/\\/g, '');
          return false; // Break the loop
        }
      }
      
      // Look for video data in shared data
      if (content.includes('sharedData')) {
        try {
          const sharedDataMatch = content.match(/window\._sharedData = (.+);/);
          if (sharedDataMatch) {
            const data = JSON.parse(sharedDataMatch[1]);
            const media = data?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media;
            if (media?.video_url) {
              videoUrl = media.video_url;
              return false; // Break the loop
            }
          }
        } catch (err) {
          console.error('Failed to parse shared data');
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
        throw new Error('Could not extract video URL. Please make sure this is a public video post.');
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