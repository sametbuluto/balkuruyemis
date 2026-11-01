// Yalnız Node/RSC build katmanı. İstemci kataloğu kategorileri props ile alır.
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { parseCategoryDocuments } from './category-schema';

const maxJsonBytes = 256 * 1024;

export function loadCategories(
  directory = path.join(process.cwd(), 'content', 'categories'),
) {
  if (!lstatSync(directory).isDirectory())
    throw new Error('Kategori kaynağı normal bir dizin olmalı.');
  const documents = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => !['.DS_Store', '.gitkeep'].includes(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
    .map((entry) => {
      const label = JSON.stringify(entry.name);
      if (!entry.isFile() || !entry.name.endsWith('.json'))
        throw new Error(
          `Kategori kaynağı: ${label}: yalnız normal JSON dosyası kabul edilir.`,
        );
      const file = path.join(directory, entry.name);
      if (lstatSync(file).size > maxJsonBytes)
        throw new Error(`Kategori kaynağı: ${label}: 256 KiB sınırı aşıldı.`);
      const bytes = readFileSync(file);
      if (bytes.length > maxJsonBytes)
        throw new Error(`Kategori kaynağı: ${label}: 256 KiB sınırı aşıldı.`);
      let source: string;
      try {
        source = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      } catch {
        throw new Error(`Kategori kaynağı: ${label}: geçersiz UTF-8.`);
      }
      return { filename: entry.name, source };
    });
  return parseCategoryDocuments(documents);
}
