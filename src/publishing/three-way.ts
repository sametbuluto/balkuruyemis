const missing = Symbol('missing');
type Value = unknown;
const object = (v: Value): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v) && !Buffer.isBuffer(v);
function equal(a: Value, b: Value): boolean {
  if (a === b) return true;
  if (Buffer.isBuffer(a) && Buffer.isBuffer(b)) return a.equals(b);
  if (Array.isArray(a) && Array.isArray(b))
    return a.length === b.length && a.every((v, i) => equal(v, b[i]));
  if (object(a) && object(b)) {
    const keys = Object.keys(a);
    return (
      keys.length === Object.keys(b).length &&
      keys.every((k) => Object.hasOwn(b, k) && equal(a[k], b[k]))
    );
  }
  return false;
}
function merge(base: Value, main: Value, source: Value, location: string): Value {
  if (equal(source, base)) return main;
  if (equal(main, base) || equal(main, source)) return source;
  const media = (value: unknown) =>
    object(value) &&
    ['url', 'alt', 'width', 'height'].every((key) => Object.hasOwn(value, key));
  if (
    object(base) &&
    object(main) &&
    object(source) &&
    ![base, main, source].some(media)
  ) {
    const entries: [string, unknown][] = [];
    for (const key of new Set([
      ...Object.keys(base),
      ...Object.keys(main),
      ...Object.keys(source),
    ])) {
      const value = merge(
        Object.hasOwn(base, key) ? base[key] : missing,
        Object.hasOwn(main, key) ? main[key] : missing,
        Object.hasOwn(source, key) ? source[key] : missing,
        `${location}.${key}`,
      );
      if (value !== missing) entries.push([key, value]);
    }
    return Object.fromEntries(entries);
  }
  throw new Error(
    `İçerik merge çatışması: ${JSON.stringify(location)}. Otomatik aktarım durdu.`,
  );
}
/** Nesneler alan düzeyinde, diziler ve binary dosyalar atomik birleştirilir. */
export function mergeCanonicalData(
  base: ReadonlyMap<string, Buffer>,
  main: ReadonlyMap<string, Buffer>,
  source: ReadonlyMap<string, Buffer>,
) {
  const result = new Map<string, Buffer>();
  const decode = (v: Buffer | undefined, json: boolean): Value =>
    v === undefined
      ? missing
      : json
        ? (JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(v)) as unknown)
        : v;
  for (const file of [
    ...new Set([...base.keys(), ...main.keys(), ...source.keys()]),
  ].sort()) {
    const json = file.endsWith('.json');
    const value = merge(
      decode(base.get(file), json),
      decode(main.get(file), json),
      decode(source.get(file), json),
      file,
    );
    if (value !== missing)
      result.set(
        file,
        json ? Buffer.from(JSON.stringify(value, null, 2) + '\n') : (value as Buffer),
      );
  }
  return result;
}
