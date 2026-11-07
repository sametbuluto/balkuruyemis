// Kaynak tabanlı yerel serialization fixture'ı. Hosted editor/login/upload testi değildir.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
export async function loadNativeWire() {
  const manifest = JSON.parse(
    await readFile('tests/fixtures/pagescms/provenance.json', 'utf8'),
  );
  const source = {};
  for (const [name, entry] of Object.entries(manifest.wireSources)) {
    source[name] = await readFile(`tests/fixtures/pagescms/${name}`, 'utf8');
    if (createHash('sha256').update(source[name]).digest('hex') !== entry.sha256)
      throw new Error('Upstream wire fixture hash uyuşmazlığı.');
  }
  function extract(file, names) {
    const program = ts.createSourceFile(
      file,
      source[file],
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    return names
      .map((name) => {
        for (const stmt of program.statements) {
          if (ts.isFunctionDeclaration(stmt) && stmt.name?.text === name)
            return stmt.getText(program);
          if (ts.isVariableStatement(stmt)) {
            const decl = stmt.declarationList.declarations.find(
              (d) => d.name.getText(program) === name,
            );
            if (decl) return `const ${decl.getText(program)};`;
          }
        }
        throw new Error(`Upstream helper bulunamadı: ${name}`);
      })
      .join('\n');
  }
  const wireSource = [
    extract('uuid.ts.txt', ['defaultValue']),
    'const defaultValues = {uuid: defaultValue, image: () => ""};',
    extract('state.ts.txt', [
      'deepMap',
      'initializeState',
      'getDefaultValue',
      'sanitizeObject',
      'getSchemaByName',
    ]),
    extract('paths.ts.txt', ['normalizePath', 'decodePathSafely', 'normalizeMediaPath']),
    extract('prefix.ts.txt', ['swapPrefix']),
    extract('image.ts.txt', ['write']),
    'export {initializeState, deepMap, sanitizeObject, write as writeImage};',
  ].join('\n');
  await mkdir('.generated/pagescms', { recursive: true });
  await writeFile(
    '.generated/pagescms/wire.mjs',
    ts.transpileModule(wireSource, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText,
  );
  return import(pathToFileURL(path.resolve('.generated/pagescms/wire.mjs')).href);
}

// Upstream save route'u nesneleri recursive merge eder, dizileri değiştirir.
function merge(existing, submitted) {
  const result = { ...existing };
  for (const [key, value] of Object.entries(submitted))
    if (value !== undefined)
      result[key] =
        value && typeof value === 'object' && !Array.isArray(value)
          ? merge(result[key] || {}, value)
          : value;
  return result;
}
export async function cmsWrite(entry, input, config, existing = {}) {
  const native = await loadNativeWire();
  const state = native.initializeState(entry.fields, input);
  const written = native.deepMap(state, entry.fields, (value, field) =>
    field.type === 'image' ? native.writeImage(value, field, { object: config }) : value,
  );
  return native.sanitizeObject(merge(existing, written));
}
