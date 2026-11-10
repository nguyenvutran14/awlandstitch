import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT || 4321);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

async function resolveFile(pathname) {
  const decoded = decodeURIComponent(pathname.split('?')[0]);
  const safe = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(DIST, safe);

  if (!filePath.startsWith(DIST)) return null;

  try {
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) filePath = path.join(filePath, 'index.html');
  } catch {
    if (!path.extname(filePath)) filePath = path.join(filePath, 'index.html');
  }

  try {
    const stats = await fs.stat(filePath);
    return stats.isFile() ? filePath : null;
  } catch {
    return null;
  }
}

const server = http.createServer(async (request, response) => {
  const pathname = request.url || '/';
  const filePath = await resolveFile(pathname);

  if (!filePath) {
    const notFoundPath = path.join(DIST, '404.html');
    try {
      const body = await fs.readFile(notFoundPath);
      response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      response.end(body);
    } catch {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('404 — dist/404.html not found. Run npm run build first.');
    }
    return;
  }

  try {
    const body = await fs.readFile(filePath);
    const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    response.writeHead(200, {
      'content-type': type,
      'cache-control': 'no-store'
    });
    response.end(body);
  } catch {
    response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('500 — could not read file.');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Preview: http://127.0.0.1:${PORT}/`);
  console.log(`Serving: ${DIST}`);
});
