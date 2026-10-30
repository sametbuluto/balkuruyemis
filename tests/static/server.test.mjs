import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import http from 'node:http';
import { createStaticServer } from '../../scripts/serve-static.mjs';

let server;
let origin;
before(async () => {
  server = createStaticServer('out');
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((resolve) => server.close(resolve)));

test('statik HTML, query ve RSC dosyaları Next runtime olmadan servis edilir', async () => {
  for (const route of [
    '/',
    '/hakkimizda',
    '/urunlerimiz?kategori=kahve',
    '/subelerimiz',
    '/iletisim',
  ]) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.match(await response.text(), /Bal Kuruyemiş/);
  }
  const flight = await fetch(origin + '/urunlerimiz.txt');
  assert.equal(flight.status, 200);
  assert.match(flight.headers.get('content-type'), /text\/plain/);
  const catalog = await (await fetch(origin + '/urunlerimiz?kategori=kahve')).text();
  assert.match(catalog, /<title>Ürünlerimiz \| Bal Kuruyemiş<\/title>/);
});

test('bilinmeyen/eksik şube ve gizli dosyalar gerçek 404 verir, SPA fallback yoktur', async () => {
  for (const route of [
    '/olmayan',
    '/subelerimiz/konum-1',
    '/subelerimiz/ornek-sube-1',
    '/.env',
    '/_headers',
    '/%5c.env',
  ]) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 404, route);
    assert.match(await response.text(), /Burada bir sayfa bulamadık/);
  }
});

test('statik PNG MIME, HEAD ve robots başlıkları korunur', async () => {
  for (const route of ['/icon', '/apple-touch-icon.png', '/opengraph-image']) {
    const response = await fetch(origin + route, { method: 'HEAD' });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'image/png');
    assert.equal((await response.arrayBuffer()).byteLength, 0);
  }
  for (const host of ['project.pages.dev', 'branch.project.pages.dev']) {
    const headers = await new Promise((resolve, reject) => {
      http
        .get(origin, { headers: { Host: host } }, (response) => {
          response.resume();
          resolve(response.headers);
        })
        .on('error', reject);
    });
    assert.match(headers['x-robots-tag'], /noindex/);
  }
  assert.equal((await fetch(origin, { method: 'POST' })).status, 405);
});
