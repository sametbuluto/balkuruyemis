import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import ts from 'typescript';
import { createPagesConfig, samePagesConfig } from './pages-config.mjs';
const upstream = await readFile('tests/fixtures/pagescms/config-schema.ts.txt', 'utf8');
const hash = createHash('sha256').update(upstream).digest('hex');
const manifest = JSON.parse(
  await readFile('tests/fixtures/pagescms/provenance.json', 'utf8'),
);
if (hash !== manifest.sha256) throw new Error('Resmî şema fixture hash uyuşmazlığı.');
// Yalnız güvenilir/pinlenmiş upstream şema: iki import yerel karşılıklarına bağlanır.
const source = upstream
  .replace(
    'from "zod"',
    `from ${JSON.stringify(pathToFileURL(path.resolve('node_modules/zod/v3/index.js')).href)}`,
  )
  .replace(
    'import { fieldTypes } from "@/fields/registry";',
    `const fieldTypes = new Set(${JSON.stringify(manifest.fieldTypes)});`,
  );
await mkdir('.generated/pagescms', { recursive: true });
await writeFile(
  '.generated/pagescms/schema.mjs',
  ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText,
);
const { ConfigSchema } = await import(
  pathToFileURL(path.resolve('.generated/pagescms/schema.mjs')).href
);
const config = yaml.load(await readFile('.pages.yml', 'utf8'));
ConfigSchema.parse(config);
if (!samePagesConfig(config, createPagesConfig()))
  throw new Error('.pages.yml alan eşleme kaynağıyla eşleşmiyor.');
// Resmî options şeması iç seçenekleri doğrulamaz; bu sınırın testleri proje eşlemesindedir.
for (const change of [
  { ...config, maxSize: 1 },
  {
    ...config,
    content: [
      {
        name: 'bad',
        type: 'file',
        path: 'x',
        fields: [{ name: 'x', type: 'unsupported' }],
      },
    ],
  },
])
  if (ConfigSchema.safeParse(change).success)
    throw new Error('Resmî şema negatif kontrolü başarısız.');
console.log(
  `Pages CMS yapılandırması resmî ${manifest.commit} şemasıyla ve alan eşlemesiyle doğrulandı.`,
);
