import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

function parseHeaders(source) {
  const rules = [];
  for (const line of source.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) rules.push({ pattern: line.trim(), headers: {} });
    else {
      const colon = line.indexOf(':');
      if (colon > 0 && rules.length)
        rules.at(-1).headers[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
    }
  }
  return rules;
}

function matches(pattern, pathname, hostname) {
  const absolute = pattern.startsWith('https://');
  const tokens = pattern.split(/(\*|:[A-Za-z]\w*)/);
  const expression = tokens
    .map((token) =>
      token === '*'
        ? '.*'
        : token.startsWith(':')
          ? '[^/.]+'
          : token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    )
    .join('');
  return new RegExp(`^${expression}$`).test(
    absolute ? `https://${hostname}${pathname}` : pathname,
  );
}

/** Yerel QA aracı: yalnızca out/ dosyalarını okur; API veya uygulama runtime'ı değildir. */
export function createStaticServer(directory) {
  const root = path.resolve(directory);
  const headerRules = readFile(path.join(root, '_headers'), 'utf8')
    .then(parseHeaders)
    .catch(() => []);
  return http.createServer(async (request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' });
        response.end();
        return;
      }
      const pathname = decodeURIComponent(
        new URL(request.url, 'http://localhost').pathname,
      );
      const forbidden =
        pathname.split('/').some((part) => part === '..' || part.startsWith('.')) ||
        ['/_headers', '/_redirects', '/_worker.js'].includes(pathname) ||
        pathname.includes('\\') ||
        pathname.includes('\0');
      let file;
      if (!forbidden) {
        const requested = path.join(root, pathname.replace(/^\/+/, ''));
        for (const candidate of [
          requested,
          `${requested}.html`,
          path.join(requested, 'index.html'),
        ]) {
          try {
            const actual = await realpath(candidate);
            if (
              actual.startsWith(`${root}${path.sep}`) &&
              (await stat(actual)).isFile()
            ) {
              file = actual;
              break;
            }
          } catch {
            /* Sıradaki statik yol denenir. */
          }
        }
      }
      const status = file ? 200 : 404;
      const bytes = await readFile(file ?? path.join(root, '404.html'));
      const extension = path.extname(file ?? '404.html');
      const contentType =
        mime[extension] ??
        (bytes.subarray(1, 4).toString() === 'PNG'
          ? 'image/png'
          : 'application/octet-stream');
      const headers = {
        'Content-Type': contentType,
        'Content-Length': bytes.length,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      };
      const hostname = new URL(`http://${request.headers.host ?? 'localhost'}`).hostname;
      for (const rule of await headerRules)
        if (matches(rule.pattern, pathname, hostname))
          Object.assign(headers, rule.headers);
      response.writeHead(status, headers);
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch {
      response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('İstek işlenemedi.');
    }
  });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const args = process.argv.slice(2);
  const value = (flag, fallback) => {
    const index = args.indexOf(flag);
    return index < 0 ? fallback : args[index + 1];
  };
  const port = Number(value('--port', '4173'));
  const hostname = value('--hostname', '127.0.0.1');
  const directory = value('--directory', 'out');
  const server = createStaticServer(directory);
  server.on('error', (error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
  server.listen(port, hostname, () =>
    process.stdout.write(
      `Statik önizleme: http://${hostname}:${port} (${path.resolve(directory)})\n`,
    ),
  );
}
