// @vitest-environment jsdom
//
// Dashboard load (2026-10-05): on every signed-in page load the profile was
// read twice in parallel, once by the session restore and once by the
// INITIAL_SESSION event, and the whole app waited on both. One read now
// serves both; a profile refresh still reads again.
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';

const calls = { profiles: 0 };
const session = { user: { id: 'u1', email: 'a@example.com', user_metadata: {} } };

vi.mock('@/components/ui/use-toast', () => ({ useToast: () => ({ toast: () => {} }) }));
vi.mock('@/lib/customSupabaseClient', () => {
  const profileQuery = () => {
    const q = {
      select: () => q,
      eq: () => q,
      single: async () => {
        calls.profiles += 1;
        await new Promise((r) => setTimeout(r, 20));
        return { data: { id: 'u1', role: 'learner', display_name: 'Ada' }, error: null };
      },
    };
    return q;
  };
  return {
    supabase: {
      from: (table) => {
        if (table !== 'profiles') throw new Error(`unexpected table ${table}`);
        return profileQuery();
      },
      auth: {
        getSession: async () => ({ data: { session }, error: null }),
        onAuthStateChange: (cb) => {
          // gotrue-js emits INITIAL_SESSION right after subscribing.
          setTimeout(() => cb('INITIAL_SESSION', session), 0);
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
      },
    },
  };
});

import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';

const Probe = () => {
  const { loading, profile, refreshProfile } = useAuth();
  return (
    <div>
      <span data-testid="state">{loading ? 'loading' : `ready:${profile?.display_name || ''}`}</span>
      <button type="button" onClick={() => refreshProfile()}>refresh</button>
    </div>
  );
};

afterEach(() => { cleanup(); calls.profiles = 0; });

describe('AuthProvider on a signed-in load', () => {
  it('reads the profile once, not once per auth path', async () => {
    render(<AuthProvider><Probe /></AuthProvider>);
    await screen.findByText('ready:Ada', {}, { timeout: 10000 });
    await act(async () => { await new Promise((r) => setTimeout(r, 80)); });
    expect(calls.profiles).toBe(1);
  }, 30000);

  it('an explicit refresh still reads again', async () => {
    render(<AuthProvider><Probe /></AuthProvider>);
    await screen.findByText('ready:Ada', {}, { timeout: 10000 });
    await act(async () => { await new Promise((r) => setTimeout(r, 80)); });
    await act(async () => { screen.getByText('refresh').click(); await new Promise((r) => setTimeout(r, 60)); });
    expect(calls.profiles).toBe(2);
  }, 30000);
});
