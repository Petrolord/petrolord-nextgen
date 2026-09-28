// @vitest-environment jsdom
//
// Batch 1A: /search (the advanced search page and its kit) renders inside
// the signed-in scope, mounted as its route mounts it (Layout, header,
// SearchPage, with the app root pieces around it).
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent, within } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome, getScopeRoot } from '@/design/testing/themeAssertions';
import { renderApp, USER_ID } from './frameHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./frameStubs')).supabaseStub());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./frameStubs')).academyServiceStub());

describeScreenTheme({
  name: 'Advanced search',
  route: '/search',
  renderScreen: () => renderApp('/search'),
  ready: () => screen.findByText('Advanced Search'),
  userId: USER_ID,
});

describe('Advanced search, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  const search = async (term) => {
    fireEvent.change(screen.getByPlaceholderText(/Search for applications/), { target: { value: term } });
    await new Promise((r) => { setTimeout(r, 350); });
  };

  it('results, a filter chip, history and the no-result state stay on roles in light and dark', async () => {
    window.localStorage.setItem('petrolord_search_history', JSON.stringify(['petrophysics']));
    window.localStorage.setItem('petrolord_saved_searches', JSON.stringify([{ id: 's1', name: 'Mine', query: 'well', filters: { module: 'All' } }]));
    renderApp('/search');
    await screen.findByText('Advanced Search');
    expectNoLegacyChrome();
    await search('a');
    await screen.findByText(/^Results \(/);
    fireEvent.click(screen.getAllByRole('button', { name: 'Coming Soon' })[0]);
    expectNoLegacyChrome();
    await search('zzzz-no-match');
    await screen.findByText(/No results found/);
    expectNoLegacyChrome();
    fireEvent.click(screen.getByTestId('theme-toggle'));
    expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('dark');
    expectNoLegacyChrome();
  });

  it('the save dialog opens in a scoped portal on roles', async () => {
    renderApp('/search');
    await screen.findByText('Advanced Search');
    await search('well');
    fireEvent.click(screen.getByRole('button', { name: /Save Current/ }));
    const dlg = await screen.findByRole('dialog');
    expect(within(dlg).getByText('Save Search Configuration')).toBeTruthy();
    expect(dlg.getAttribute('data-pl-theme')).toBe('light');
    expectNoLegacyChrome();
  });
});
