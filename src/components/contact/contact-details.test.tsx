import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as source from '@/content/editorial.server';
import { ContactDetails } from './contact-details';
import { getContactChannels } from '@/content/social';
import { ContactChannels } from './contact-channels';
afterEach(() => vi.restoreAllMocks());
describe('Merkezi iletişim doğrulama işareti', () => {
  it('bilinmeyen veya doğrulanmamış telefon/e-posta link üretmez', () => {
    const original = source.getSiteSettings();
    const spy = vi.spyOn(source, 'getSiteSettings').mockReturnValue({
      ...original,
      phone: '+90 555 000 00 00',
      email: 'fixture@example.invalid',
      phoneVerified: false,
      emailVerified: false,
    });
    const { container } = render(<ContactDetails />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    spy.mockRestore();
  });
  it('doğrulanmış değerlerden yalnız tel/mailto link üretir', () => {
    vi.spyOn(source, 'getSiteSettings').mockReturnValue({
      ...source.getSiteSettings(),
      phone: '+90 555 000 00 00',
      email: 'fixture@example.invalid',
      phoneVerified: true,
      emailVerified: true,
    });
    render(<ContactDetails />);
    expect(screen.getByRole('link', { name: '+90 555 000 00 00' })).toHaveAttribute(
      'href',
      'tel:+905550000000',
    );
    expect(screen.getByRole('link', { name: 'fixture@example.invalid' })).toHaveAttribute(
      'href',
      'mailto:fixture%40example.invalid',
    );
  });
  it('geçerli ama doğrulanmamış sosyal URLyi render etmez', () => {
    const original = source.getSocialSettings();
    vi.spyOn(source, 'getSocialSettings').mockReturnValue({
      ...original,
      instagram: {
        ...original.instagram,
        url: 'https://www.instagram.com/test_only_profile',
        verified: false,
      },
    });
    render(<ContactChannels channels={getContactChannels()} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
