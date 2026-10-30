import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContactChannels } from '@/components/contact/contact-channels';

describe('ContactChannels', () => {
  it('bilinmeyen hesaplar için aktif link veya çalışmayan düğme göstermez', () => {
    render(<ContactChannels />);
    expect(screen.getByRole('heading', { name: 'Instagram' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'WhatsApp' })).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getAllByText('Resmî bağlantı yakında paylaşılacak.')).toHaveLength(2);
  });

  it('yapılandırılmış kanalı güvenli bir yeni sekme bağlantısıyla gösterir', () => {
    render(
      <ContactChannels
        channels={[
          {
            id: 'instagram',
            name: 'Instagram',
            description: 'Test kanalı',
            url: 'https://www.instagram.com/',
          },
        ]}
      />,
    );
    const link = screen.getByRole('link', { name: /Instagram’a gidin/ });
    expect(link).toHaveAttribute('href', 'https://www.instagram.com/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
