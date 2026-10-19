import type { Plugin, ViteDevServer } from 'vite';
import { handleMusicApiRequest } from './handler.js';

export function musicApiPlugin(): Plugin {
  return {
    name: 'apple-music-api-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const handled = await handleMusicApiRequest(req, res);
          if (!handled) {
            next();
          }
        } catch (err: any) {
          console.error('API Middleware Uncaught Error:', err);
          next();
        }
      });
    }
  };
}
