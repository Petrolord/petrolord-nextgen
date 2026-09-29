// @vitest-environment jsdom
//
// Reservoir Volumetrics capstone pass: the certificate line used to read
// "...issued.That completes" and "...certificates page.That completes"
// because JSX drops the line break before "That". Both tiers must have the
// space.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { renderCourseApp } from './geo3bHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./frameStubs')).supabaseStub());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => ({
  ...(await import('./frameStubs')).academyServiceStub(),
  ...(await import('./geo3bStubs')).geo3bServiceExtras(),
}));

const ROUTE = '/dashboard/apps/reservoircalc';

async function passTier(tier) {
  renderCourseApp(ROUTE);
  await screen.findByRole('heading', { level: 1, name: /Reservoir Volumetrics/ }, { timeout: 5000 });
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${tier} tier$`, 'i') }));
  const submit = await screen.findByRole('button', { name: /Submit for grading/ });
  await waitFor(() => expect(submit.disabled).toBe(false));
  fireEvent.click(submit);
  const line = await screen.findByText(/That completes/, undefined, { timeout: 5000 });
  return line.textContent.replace(/\s+/g, ' ');
}

describe('Reservoir Volumetrics certificate line', () => {
  beforeAll(installDomShims);
  beforeEach(() => { window.localStorage.clear(); globalThis.__geo3b = { pass: true }; });
  afterEach(() => { cleanup(); globalThis.__geo3b = undefined; });

  it('an Associate pass reads "issued. That completes"', async () => {
    const text = await passTier('beginner');
    expect(text).toContain('issued. That completes');
    expect(text).not.toMatch(/\.That/);
    expect(text).not.toContain('—');
  }, 30000);

  it('an Expert pass reads "certificates page. That completes"', async () => {
    const text = await passTier('advanced');
    expect(text).toContain('certificates page. That completes');
    expect(text).not.toMatch(/\.That/);
  }, 30000);
});
