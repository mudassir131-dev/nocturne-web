import { handleMusicApiRequest } from '../server/handler.js';

export default async function handler(req: any, res: any) {
  try {
    const handled = await handleMusicApiRequest(req, res);
    if (!handled) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Endpoint not found', path: req.url }));
    }
  } catch (err: any) {
    console.error('Vercel Serverless Function Error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
  }
}
