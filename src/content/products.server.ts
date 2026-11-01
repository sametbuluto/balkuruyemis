// Yalnız Node/RSC build katmanı; istemciye yalnız yayımlanmış ürün props'ları gider.
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { getCategories } from './categories';
import { parseProductDocuments } from './product-schema';

export function loadProducts(
  directory = path.join(process.cwd(), 'content', 'products'),
  categories = getCategories(),
) {
  if (!lstatSync(directory).isDirectory())
    throw new Error('Ürün kaynağı normal bir dizin olmalı.');
  const documents = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => !['.DS_Store', '.gitkeep'].includes(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
    .map((entry) => {
      const label = JSON.stringify(entry.name);
      if (!entry.isFile() || !entry.name.endsWith('.json'))
        throw new Error(
          `Ürün kaynağı: ${label}: yalnız normal JSON dosyası kabul edilir.`,
        );
      const file = path.join(directory, entry.name);
      if (lstatSync(file).size > 256 * 1024)
        throw new Error(`Ürün kaynağı: ${label}: 256 KiB sınırı aşıldı.`);
      const bytes = readFileSync(file);
      if (bytes.length > 256 * 1024)
        throw new Error(`Ürün kaynağı: ${label}: 256 KiB sınırı aşıldı.`);
      let source: string;
      try {
        source = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      } catch {
        throw new Error(`Ürün kaynağı: ${label}: geçersiz UTF-8.`);
      }
      return { filename: entry.name, source };
    });
  return parseProductDocuments(documents, categories);
}
