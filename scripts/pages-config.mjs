import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';

// Canonical JSON may reorder object keys. Field order controls CMS presentation,
// not its data contract; keep every name/type/label/option in the comparison.
export function samePagesConfig(left, right) {
  const normalize = (value, key = '') => {
    if (Array.isArray(value)) {
      const items = value.map((item) => normalize(item));
      return key === 'fields'
        ? items.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
        : items;
    }
    if (value && typeof value === 'object')
      return Object.fromEntries(
        Object.entries(value).map(([name, item]) => [name, normalize(item, name)]),
      );
    return value;
  };
  return isDeepStrictEqual(normalize(left), normalize(right));
}

const labels = {
  seo: 'Arama ve paylaşım metinleri',
  title: 'Başlık',
  description: 'Açıklama',
  hero: 'Ana karşılama alanı',
  eyebrow: 'Üst başlık',
  titleLead: 'Başlığın ilk kısmı',
  titleAccent: 'Kırmızı vurgulu başlık',
  descriptionLead: 'Açıklamanın ilk satırı',
  descriptionBody: 'Açıklamanın devamı',
  catalogAction: 'Ürün butonu yazısı',
  branchesAction: 'Şube butonu yazısı',
  countDescription: 'Şube sayısı açıklaması',
  heroVisual: 'Ana görsel açıklamaları',
  photoDescription: 'Fotoğraf açıklaması',
  pendingDescription: 'Fotoğraf bekleme açıklaması',
  countLabel: 'Şube sayısı etiketi',
  categories: 'Kategoriler bölümü',
  action: 'Buton yazısı',
  story: 'Marka hikâyesi',
  titleTail: 'Başlığın devamı',
  signature: 'İmza / slogan',
  branches: 'Şubeler bölümü',
  notice: 'Bilgilendirme metni',
  gallery: 'Fotoğraf galerisi',
  social: 'Sosyal iletişim',
  announcements: 'Duyurular bölümü',
  intro: 'Sayfa girişi',
  continuation: 'Devam metni',
  visit: 'Mağaza ziyareti',
  placeTitle: 'Konum başlığı',
  placeDescription: 'Konum açıklaması',
  digital: 'Dijital iletişim',
  content: 'Katalog açıklamaları',
  heading: 'Bölüm başlığı',
  emptyTitle: 'Ürün bekleme başlığı',
  emptyDescription: 'Ürün bekleme açıklaması',
  visitDescription: 'Mağazaya davet',
  list: 'Şube listesi açıklamaları',
  noticeTitle: 'Bilgilendirme başlığı',
  name: 'Marka adı',
  slogan: 'Slogan',
  location: 'Genel konum',
  shareLocation: 'Paylaşım konumu',
  shareDescription: 'Paylaşım görseli açıklaması',
  phone: 'Merkezi telefon',
  email: 'İletişim e-postası',
  footer: 'Alt bilgi alanı',
  visitTitle: 'Ziyaret başlığı',
  visitAction: 'Ziyaret butonu yazısı',
  socialDescription: 'Sosyal hesap açıklaması',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  url: 'Resmî bağlantı',
  actionLabel: 'Bağlantı butonu yazısı',
};
const textField = (name, label, max = 1200, required = true) => ({
  name,
  label,
  type: max > 320 ? 'text' : 'string',
  required,
  ...(required ? { pattern: { regex: '\\S', message: 'Boş bırakmayın.' } } : {}),
  options: { maxlength: max },
});
const status = {
  name: 'status',
  label: 'Yayın durumu',
  type: 'select',
  required: true,
  default: 'draft',
  options: {
    values: [
      { value: 'draft', label: 'Taslak' },
      { value: 'published', label: 'Yayında' },
    ],
  },
};
const sortOrder = {
  name: 'sortOrder',
  label: 'Sıra',
  type: 'number',
  required: true,
  default: 0,
  options: { min: 0, step: 1 },
};
const editorKey = {
  name: 'editorKey',
  label: 'Otomatik kayıt anahtarı',
  type: 'uuid',
  hidden: true,
  required: true,
  options: { editable: false, generate: false },
};
function photoFields(media) {
  return [
    {
      name: 'url',
      label: 'Fotoğraf seçin',
      type: 'image',
      required: true,
      options: {
        media,
        extensions: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        rename: 'random',
      },
    },
    textField('alt', 'Fotoğrafta ne var? Türkçe açıklama', 320),
  ];
}
function image(media, name = 'image', multiple = false) {
  return {
    name,
    label: multiple ? 'Fotoğraflar' : 'Kapak fotoğrafı (isteğe bağlı)',
    type: 'object',
    ...(multiple ? { list: true, default: [] } : {}),
    fields: [
      ...photoFields(media),
      ...(multiple ? [{ ...status, default: 'published' }, sortOrder] : []),
    ],
  };
}
export function copyFields(value, parent = '') {
  return Object.entries(value)
    .filter(([name]) => !['verified', 'phoneVerified', 'emailVerified'].includes(name))
    .map(([name, entry]) => {
      const label = labels[name];
      if (!label) throw new Error(`Türkçe alan etiketi eksik: ${name}`);
      if (entry && typeof entry === 'object')
        return {
          name,
          label,
          type: 'object',
          required: true,
          fields: copyFields(entry, name),
        };
      // Optionality belongs to the contract, not the currently stored value.
      const optional = ['phone', 'email', 'url'].includes(name);
      const max =
        parent === 'seo'
          ? name === 'description'
            ? 320
            : 120
          : name === 'titleLead' || name === 'titleAccent'
            ? parent === 'hero'
              ? 60
              : 120
            : /title|signature/i.test(name)
              ? 120
              : /action|eyebrow|countLabel/i.test(name)
                ? 64
                : name === 'name' || name === 'location' || name === 'shareLocation'
                  ? 80
                  : name === 'slogan'
                    ? 100
                    : name === 'shareDescription'
                      ? 120
                      : name === 'phone'
                        ? 30
                        : name === 'email'
                          ? 254
                          : name === 'url'
                            ? 500
                            : parent === '' && name === 'description'
                              ? 320
                              : 1200;
      return {
        ...textField(name, label, max, !optional),
        ...(optional
          ? {
              default: '',
              description:
                'Bilinmiyorsa boş bırakın. Yeni iletişim bilgisi teknik doğrulama bekler.',
            }
          : {
              description:
                'Düz metin. HTML/CSS girmeyin; mevcut otomatik sayım değişkenlerini koruyabilirsiniz.',
            }),
      };
    });
}
const operations = { create: false, rename: false, delete: false };
function collection(name, label, fields, create = false, prefix) {
  return {
    name,
    label,
    type: 'collection',
    path: `content/${name}`,
    format: 'json',
    subfolders: false,
    exclude: ['.gitkeep', '.DS_Store'],
    operations: { ...operations, create },
    ...(create
      ? { filename: { template: `${prefix}-{fields.editorKey}.json`, field: false } }
      : {}),
    view: {
      primary: name === 'announcements' ? 'title' : name === 'gallery' ? 'alt' : 'name',
      sort: ['sortOrder'],
      default: { sort: 'sortOrder', order: 'asc' },
    },
    fields,
  };
}
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
export function createPagesConfig() {
  return {
    media: ['products', 'categories', 'branches', 'gallery'].map((name) => ({
      name,
      label: {
        products: 'Ürün fotoğrafları',
        categories: 'Kategori fotoğrafları',
        branches: 'Şube fotoğrafları',
        gallery: 'Ana sayfa ve galeri',
      }[name],
      input: `public/images/${name}`,
      output: `/images/${name}`,
      extensions: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
      rename: 'random',
    })),
    content: [
      collection(
        'products',
        'Ürünler',
        [
          editorKey,
          textField('name', 'Ürün adı', 120),
          {
            name: 'categoryId',
            label: 'Kategori seçin',
            type: 'reference',
            required: true,
            options: {
              collection: 'categories',
              value: '{fields.id}',
              label: '{fields.name}',
              search: 'name',
            },
          },
          textField('description', 'Ürün açıklaması'),
          image('products', 'images', true),
          sortOrder,
          status,
        ],
        true,
        'product',
      ),
      collection('categories', 'Kategoriler', [
        textField('name', 'Kategori adı', 120),
        textField('description', 'Kategori açıklaması'),
        image('categories'),
        sortOrder,
        status,
      ]),
      collection('branches', 'Şubeler / Konumlar', [
        textField('name', 'Şube / konum adı', 120),
        textField('description', 'Şube açıklaması'),
        ...['address', 'phone', 'openingHours', 'whatsappUrl'].map((name) => ({
          ...textField(
            name,
            {
              address: 'Açık adres',
              phone: 'Telefon',
              openingHours: 'Çalışma saatleri',
              whatsappUrl: 'WhatsApp bağlantısı',
            }[name],
            500,
            false,
          ),
          default: '',
          description:
            'Yalnız doğrulanmış bilgi girin; bilinmiyorsa boş bırakın. Kimlik değişikliği teknik onay bekleyebilir.',
        })),
        image('branches', 'images', true),
        sortOrder,
        status,
      ]),
      collection(
        'gallery',
        'Ana sayfa ve galeri fotoğrafları',
        [
          editorKey,
          ...photoFields('gallery'),
          sortOrder,
          status,
          {
            name: 'usages',
            label: 'Nerede gösterilsin?',
            type: 'select',
            required: true,
            options: {
              multiple: true,
              values: [
                { value: 'home-hero', label: 'Ana sayfa büyük görseli' },
                { value: 'brand-gallery', label: 'Marka galerisi' },
                { value: 'branches-gallery', label: 'Şubeler galerisi' },
              ],
            },
          },
        ],
        true,
        'gallery',
      ),
      collection(
        'announcements',
        'Duyurular',
        [
          editorKey,
          textField('title', 'Duyuru başlığı', 120),
          textField('description', 'Duyuru açıklaması'),
          sortOrder,
          status,
          image('gallery'),
          ...['startsAt', 'endsAt'].map((name) => ({
            name,
            label:
              name === 'startsAt'
                ? 'Başlangıç zamanı (isteğe bağlı)'
                : 'Bitiş zamanı (isteğe bağlı)',
            type: 'date',
            default: '',
            options: { time: true, format: "yyyy-MM-dd'T'HH:mm:ssxxx" },
            description:
              'Tarayıcının yerel saat dilimi kaydedilir. Tarihin yayına yansıması yeni build gerektirir.',
          })),
        ],
        true,
        'announcement',
      ),
      {
        name: 'pages',
        label: 'Sayfa yazıları',
        type: 'group',
        items: Object.entries({
          home: 'Ana Sayfa',
          about: 'Hakkımızda',
          contact: 'İletişim',
          catalog: 'Ürünlerimiz',
          branches: 'Şubelerimiz',
        }).map(([id, label]) => ({
          name: `page-${id}`,
          label,
          type: 'file',
          path: `content/pages/${id}.json`,
          format: 'json',
          operations,
          fields: copyFields(read(`content/pages/${id}.json`)),
        })),
      },
      {
        name: 'settings',
        label: 'İşletme ve sosyal bilgiler',
        type: 'group',
        items: ['site', 'social'].map((id) => ({
          name: `settings-${id}`,
          label: id === 'site' ? 'Marka ve iletişim' : 'Sosyal bağlantılar',
          type: 'file',
          path: `content/settings/${id}.json`,
          format: 'json',
          operations,
          fields: copyFields(read(`content/settings/${id}.json`)),
        })),
      },
    ],
    settings: { hide: true, content: { merge: true } },
  };
}
