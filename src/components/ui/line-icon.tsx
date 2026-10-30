export type LineIconName =
  | 'kuruyemis'
  | 'kahve'
  | 'lokum'
  | 'baharat'
  | 'aktar'
  | 'kozmetik'
  | 'location'
  | 'photo'
  | 'instagram'
  | 'whatsapp';

const paths: Record<LineIconName, string> = {
  kuruyemis:
    'M7 24h34c-1 10-6 15-17 15S8 34 7 24ZM13 18c-4-5 0-10 4-10 3 0 6 4 4 9M26 17c-1-6 3-10 7-8 4 1 5 6 2 10M11 24v-3M38 24v-3',
  kahve:
    'M10 14h25v13c0 8-5 12-12 12S10 35 10 27V14ZM35 17h3a6 6 0 0 1 0 12h-3M8 42h30M17 5v4M24 4v5M31 5v4',
  lokum:
    'm7 18 10-6 10 6-10 6-10-6Zm0 0v12l10 6 10-6V18M17 24v12M27 18l7-4 9 5-9 5-7-4M34 24v12l9-6V19M27 32l7 4',
  baharat:
    'M19 6h10v6H19V6ZM17 12h14l-3 8H20l-3-8ZM20 20h8c0 8 7 12 7 21H13c0-9 7-13 7-21ZM15 34h18M19 6V3h10v3',
  aktar: 'M38 7C18 6 7 17 12 30c13 7 27-5 26-23ZM9 41l21-23M17 33l-1-11M24 26l10 1',
  kozmetik: 'M17 15h14l3 6v21H14V21l3-6ZM19 15V9h10v6M21 9V4h14v4H25M14 26h20M20 31h8',
  location:
    'M38 20c0 11-14 23-14 23S10 31 10 20a14 14 0 1 1 28 0ZM29 20a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
  photo: 'M7 11h34v28H7V11ZM7 33l11-11 10 10 5-5 8 8M33 19h.01',
  instagram:
    'M16 7h16a9 9 0 0 1 9 9v16a9 9 0 0 1-9 9H16a9 9 0 0 1-9-9V16a9 9 0 0 1 9-9ZM32 24a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM34 14h.01',
  whatsapp:
    'M41 23a17 17 0 0 1-25 15L7 41l3-9a17 17 0 1 1 31-9ZM18 15c-4 6 6 16 12 15l3-4-6-3-2 2-4-4 2-2-3-5-2 1Z',
};

export function LineIcon({
  name,
  className = '',
}: {
  name: LineIconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      width="48"
      height="48"
      fill="none"
      className={className}
    >
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
