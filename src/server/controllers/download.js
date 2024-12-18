import { getVideoInfo } from '../utils/instagram.js';

export async function downloadController(req, res) {
  try {
    const { url } = req.body;
    const videoInfo = await getVideoInfo(url);
    res.json({
      ...videoInfo,
      success: true
    });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({ 
      error: error.message,
      success: false
    });
  }
}