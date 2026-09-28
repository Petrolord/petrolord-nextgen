// TEST-ONLY harness for the batch 2A theme tests (learner and account
// pages). Mounts a route as the app does: Layout with the header and the
// signed-in scope around DashboardPage's routes, or around a page App.jsx
// mounts on its own (/dashboard/certificates), with a signed-in user.
// Network is blocked: the tests mock the Supabase client with the 1A
// frame stub (frameStubs.js, it throws on any use), and
// installNetworkGuard() makes fetch reject and counts the calls so a test
// can assert that none happened.
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthContext } from '@/contexts/SupabaseAuthContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { ApplicationLayoutProvider } from '@/contexts/ApplicationLayoutContext';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';

export const USER_ID = 'learner-2a';

export const authFor = ({ role = 'learner', displayName = 'Ada Obi' } = {}) => ({
  user: { id: USER_ID, email: 'ada@example.com', user_metadata: {} },
  session: {},
  loading: false,
  isAdmin: role === 'admin' || role === 'super_admin',
  isSuperAdmin: role === 'super_admin',
  profile: { display_name: displayName, role },
  signOut: async () => {},
});

/**
 * Render `path`. With `page`, the page is mounted inside Layout on its own
 * route (as App.jsx mounts /dashboard/certificates); without it,
 * DashboardPage resolves the route under /dashboard/*.
 */
export function renderRoute(path, { page = null, ...who } = {}) {
  const element = page
    ? <Route path={path} element={<ApplicationLayoutProvider><Layout>{page}</Layout></ApplicationLayoutProvider>} />
    : <Route path="/dashboard/*" element={<ApplicationLayoutProvider><Layout><DashboardPage /></Layout></ApplicationLayoutProvider>} />;
  return render(
    <HelmetProvider>
      <AuthContext.Provider value={authFor(who)}>
        <MemoryRouter initialEntries={[path]}>
          <RoleProvider>
            <Routes>{element}</Routes>
          </RoleProvider>
        </MemoryRouter>
      </AuthContext.Provider>
    </HelmetProvider>,
  );
}

/** fetch rejects and is counted; returns the call list. */
export function installNetworkGuard() {
  const calls = [];
  globalThis.fetch = (...args) => {
    calls.push(String(args[0]));
    return Promise.reject(new Error('network is blocked in this test'));
  };
  return calls;
}

/** Open a Radix tab (they activate on mouse down). */
export function openTab(fireEvent, trigger) {
  fireEvent.mouseDown(trigger, { button: 0, ctrlKey: false });
  fireEvent.click(trigger);
}
