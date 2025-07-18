import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs from 'fs';

/**
 * handleStaticFiles: serve static files from /uploads folder.
 * - Stream read
 * - Range support (video)
 * - Cache-Control
 * - Basic path traversal protection
*/
export function processStaticFiles(req: IncomingMessage, res: ServerResponse): boolean {
      if(!req.url?.startsWith('/uploads')) return false;

      const safePath = req.url.replace('/uploads', '').replace(/\.\./g, '');
      const filePath = path.join(process.cwd(), 'uploads', safePath);

      try {
            const stats = fs.statSync(filePath);
            if(!stats.isFile()) {
                  res.statusCode = 404;
                  res.end('File not found');
                  return true;
            } 

            const range = req.headers.range;
            const ext = path.extname(filePath).toLocaleLowerCase();
            const mimeTypes: Record<string, string> = {
                  '.jpg': 'image/jpeg',
                  '.jpeg': 'image/jpeg',
                  '.png': 'image/png',
                  '.gif': 'image/gif',
                  '.txt': 'text/plain',
                  '.html': 'text/html',
                  '.css': 'text/css',
                  '.js': 'application/javascript',
                  '.mp4': 'video/mp4'
            };
            const contentType = mimeTypes[ext] || 'application/octet-stream';

            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=31536000');

            if(range) {
                  const positions = range.replace(/bytes=/, '').split('-');
                  const start = parseInt(positions[0], 10);
                  const end = positions[1] ? parseInt(positions[1], 10) : stats.size - 1;

                  if(start >= stats.size) {
                        res.statusCode = 416;
                        res.setHeader('Content-Range', `bytes */${stats.size}`);
                        res.end();
                        return true;
                  }

                  const chunkSize = (end - start) + 1;
                  res.statusCode = 206;
                  res.setHeader('Content-Range', `bytes ${start}-${end}/${stats.size}`);
                  res.setHeader('Accept-Ranges', 'bytes');
                  res.setHeader('Content-Length', chunkSize);

                  const stream = fs.createReadStream(filePath, { start, end });
                  stream.pipe(res);
            } else {
                  res.statusCode = 200;
                  res.setHeader('Content-Length', stats.size);
                  const stream = fs.createReadStream(filePath);
                  stream.pipe(res);
            }
      } catch(err) {
            res.statusCode = 404;
            res.end('File not found');
      }

      return true;
}
