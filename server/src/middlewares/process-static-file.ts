import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs from 'fs/promises';
import mime from 'mime';
import { lookup as mimeLookup } from 'mime-types';

/**
 * handleStaticFiles: serve static files from /uploads folder.
 * - Stream read
 * - Range support (video)
 * - Cache-Control
 * - Basic path traversal protection
*/
export async function processStaticFiles(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
      if (!req.url?.startsWith('/uploads')) {
        return false;
    }

    try {
        // Xác định root uploads dir tuyệt đối
        const uploadsRoot = path.resolve(process.cwd(), '..', '..', 'uploads');

        // Resolve path an toàn (chống traversal)
        const relativePath = req.url.replace('/uploads', '');
        const requestedPath = path.normalize(path.join(uploadsRoot, relativePath));

        // Ensure requestedPath nằm trong uploadsRoot
        if (!requestedPath.startsWith(uploadsRoot)) {
            res.statusCode = 403;
            res.end('Forbidden');
            return true;
        }

        const stats = await fs.stat(requestedPath);
        if (!stats.isFile) {
            res.statusCode = 404;
            res.end('File not found');
            return true;
        }

        const data = await fs.readFile(requestedPath);

        const mimeType = mimeLookup(requestedPath) || 'application/octet-stream';
        res.setHeader('Content-Type', mimeType);

        // Optional: set caching policy
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

        res.statusCode = 200;
        res.end(data);
        return true;

    } catch (err) {
        if ((err as any).code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File not found');
        } else {
            console.error('[ERROR] Static file error:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
        return true;
    }
}
