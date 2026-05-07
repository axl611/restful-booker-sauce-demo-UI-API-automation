#!/usr/bin/env node
import http from 'http';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import open from 'open';

const reportDir = path.resolve(process.cwd(), 'allure-report');
const PORT = 5000;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

const server = http.createServer((req, res) => {
  // Parse URL and remove query string
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  
  // Default to index.html for root
  if (pathname === '/') {
    pathname = '/index.html';
  }

  let filePath = path.join(reportDir, pathname);
  
  // Security: prevent directory traversal
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(reportDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  try {
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
      res.end(content);
      return;
    }
  } catch (err) {
    // File not found
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, async () => {
  const url = `http://localhost:${PORT}`;
  console.log(`✅ Allure report server running at ${url}`);
  console.log(`Press Ctrl+C to stop\n`);
  
  try {
    await open(url);
  } catch {
    console.log(`Open this link in your browser: ${url}`);
  }
});

process.on('SIGINT', () => {
  server.close();
  console.log('\nServer stopped.');
  process.exit(0);
});

