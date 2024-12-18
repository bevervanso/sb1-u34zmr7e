export function validateInstagramUrl(req, res, next) {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const regex = /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/([A-Za-z0-9-_]+)/;
  if (!regex.test(url)) {
    return res.status(400).json({ error: 'Invalid Instagram URL' });
  }

  next();
}