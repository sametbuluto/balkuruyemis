const countWords = [
  'sıfır',
  'bir',
  'iki',
  'üç',
  'dört',
  'beş',
  'altı',
  'yedi',
  'sekiz',
  'dokuz',
  'on',
];

export function countLabel(count: number): string {
  return countWords[count] ?? new Intl.NumberFormat('tr-TR').format(count);
}

export function capitalize(text: string): string {
  return text.slice(0, 1).toLocaleUpperCase('tr-TR') + text.slice(1);
}
