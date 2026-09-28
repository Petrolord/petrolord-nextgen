// @vitest-environment jsdom
//
// Batch 2B: the certifications console (issue and revoke) renders inside
// the signed-in scope, mounted as its route mounts it.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome, getScopeRoot } from '@/design/testing/themeAssertions';
import { renderAdmin, toggleTheme, USER_ID } from './admin2bHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./admin2bStubs')).supabaseFake());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./admin2bStubs')).academyServiceStub());

const ROUTE = '/dashboard/admin/certifications';

describeScreenTheme({
  name: 'Certifications (admin)',
  route: ROUTE,
  renderScreen: () => renderAdmin(ROUTE),
  ready: () => screen.findByText('PL-NG-0001'),
  userId: USER_ID,
});

describe('Certifications, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('valid, expired and revoked read as words on the status roles', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('PL-NG-0001');
    expect(screen.getByText('valid').className).toContain('text-pl-success-text');
    expect(screen.getByText('expired').className).toContain('text-pl-warning-text');
    expect(screen.getByText('revoked').className).toContain('text-pl-danger-text');
    expect(screen.getByText('n/a')).toBeTruthy(); // the holder with no name or email
    expect(screen.getAllByRole('button', { name: /Revoke/ })).toHaveLength(2);
  });

  it('a found learner and the issue form stay on roles in light and dark', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('PL-NG-0001');
    fireEvent.change(screen.getByPlaceholderText('learner@example.com'), { target: { value: 'ngozi@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Find learner' }));
    await screen.findByText('ngozi@example.com · learner');
    expectNoLegacyChrome();
    toggleTheme(screen);
    expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('dark');
    expectNoLegacyChrome();
  });
});
