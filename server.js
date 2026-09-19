// Minimal static server for the mirrored site in ./site
// Usage: node server.js [port]
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'site');
const PORT = Number(process.argv[2] || process.env.PORT || 3002);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  // Block traversal outside ROOT.
  const target = path.normalize(path.join(ROOT, clean));
  if (!target.startsWith(ROOT)) return null;
  try {
    if (fs.statSync(target).isDirectory()) {
      const idx = path.join(target, 'index.html');
      return fs.existsSync(idx) ? idx : null;
    }
    return target;
  } catch {
    return null;
  }
}

// The live site backs its visitor/like counter with a serverless route.
// A static mirror has no backend, so stub it with the snapshot values.
const stats = { uniqueVisitors: 290, likes: 52, hasLiked: false, visitorNumber: 290 };

http.createServer((req, res) => {
  if (req.url.split('?')[0] === '/api/visitors') {
    if (req.method === 'POST') {
      stats.likes += stats.hasLiked ? -1 : 1;
      stats.hasLiked = !stats.hasLiked;
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify(stats));
  }

  let file = resolve(req.url);
  if (!file) file = path.join(ROOT, 'index.html'); // SPA-style fallback
  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      return res.end('404 Not Found');
    }
    res.writeHead(200, {
      'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-cache',
    });
    res.end(buf);
  });
}).listen(PORT, () => {
  console.log(`Mirrored site running at http://localhost:${PORT}`);
});
