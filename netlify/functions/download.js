import { getVideoInfo } from '../../api/utils/instagram.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { url } = JSON.parse(event.body);
    
    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    const regex = /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/([A-Za-z0-9-_]+)/;
    if (!regex.test(url)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid Instagram URL' })
      };
    }

    const videoInfo = await getVideoInfo(url);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        ...videoInfo,
        success: true
      })
    };
  } catch (error) {
    const statusCode = error.response?.status || 500;
    return {
      statusCode,
      body: JSON.stringify({ 
        error: error.message,
        success: false
      })
    };
  }
}