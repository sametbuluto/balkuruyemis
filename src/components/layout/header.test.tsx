import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from '@/components/layout/header';

const route = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }));

describe('Header', () => {
  it('navbar içinde kaldırılan konum metnini göstermez', () => {
    render(<Header />);
    expect(screen.queryByText('Buca, İzmir')).not.toBeInTheDocument();
  });
  beforeEach(() => {
    route.pathname = '/';
  });

  it('mobil menüyü kapalı başlatır ve düğmeyle açar', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const button = screen.getByRole('button', { name: 'Menüyü aç' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByRole('navigation', { name: 'Mobil navigasyon' }),
    ).not.toBeInTheDocument();

    await user.click(button);

    const menu = screen.getByRole('navigation', { name: 'Mobil navigasyon' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(within(menu).getByRole('link', { name: 'Şubelerimiz' })).toHaveAttribute(
      'href',
      '/subelerimiz',
    );

    await user.click(screen.getByRole('button', { name: 'Menüyü kapat' }));
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('Escape ile menüyü kapatır ve odağı menü düğmesine döndürür', async () => {
    const user = userEvent.setup();
    render(<Header />);
    const button = screen.getByRole('button', { name: 'Menüyü aç' });

    await user.click(button);
    await user.tab();
    expect(
      within(screen.getByRole('navigation', { name: 'Mobil navigasyon' })).getByRole(
        'link',
        { name: 'Ana Sayfa' },
      ),
    ).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByRole('navigation', { name: 'Mobil navigasyon' }),
    ).not.toBeInTheDocument();
  });

  it('şube detayında yalnızca Şubelerimiz bağlantısını aktif gösterir', () => {
    route.pathname = '/subelerimiz/dogrulanmis-sube';
    render(<Header />);
    const navigation = screen.getByRole('navigation', { name: 'Ana navigasyon' });

    expect(within(navigation).getByRole('link', { name: 'Şubelerimiz' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      within(navigation).getByRole('link', { name: 'Ana Sayfa' }),
    ).not.toHaveAttribute('aria-current');
  });

  it('rota değişince kapanır; önceki rotaya dönünce eski açık durumu geri getirmez', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Menüyü aç' }));
    route.pathname = '/hakkimizda';
    rerender(<Header />);
    expect(screen.getByRole('button', { name: 'Menüyü aç' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    route.pathname = '/';
    rerender(<Header />);
    expect(screen.getByRole('button', { name: 'Menüyü aç' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
