// TEST-ONLY. The signed-in harness the batch 2C (admin II) theme tests share.
// The same frame as the 2B harness (admin2bHarness.jsx: Layout, the header,
// a signed-in super admin, the root toaster, HelmetProvider), plus the three
// top-level admin routes App.jsx mounts outside DashboardPage
// (/dashboard/analytics, /dashboard/compliance, /dashboard/reports). Each
// test file mocks the Supabase client (admin2cStubs.js supabaseFake) and
// every service its screen calls, so nothing reaches the real project.
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '@/contexts/SupabaseAuthContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { ApplicationLayoutProvider } from '@/contexts/ApplicationLayoutContext';
import Layout from '@/components/Layout';
import { Toaster } from '@/components/ui/toaster';

import { USER_ID } from './admin2cStubs';

export { USER_ID } from './admin2cStubs';

const auth = {
  user: { id: USER_ID, email: 'ada@example.com', user_metadata: {} },
  session: {},
  loading: false,
  isAdmin: false,
  isSuperAdmin: true,
  profile: { id: USER_ID, email: 'ada@example.com', display_name: 'Ada Obi', role: 'super_admin' },
  signOut: async () => {},
};

/**
 * Mount `element` at `path` inside Layout, as App.jsx mounts a signed-in
 * route. The three admin pages DashboardPage routes (monitoring, admin
 * roles, system analytics) are mounted straight in Layout too: DashboardPage
 * is only a <Routes> table for them, and importing it costs about 85 s of
 * collection per file.
 */
export function renderAdminRoute(path, element, { pattern = path } = {}) {
  return render(
    <HelmetProvider>
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[path]}>
        <RoleProvider>
          <Routes>
            <Route path={pattern} element={<ApplicationLayoutProvider><Layout>{element}</Layout></ApplicationLayoutProvider>} />
          </Routes>
          <Toaster />
        </RoleProvider>
      </MemoryRouter>
    </AuthContext.Provider>
    </HelmetProvider>,
  );
}

/** Open a Radix tab (Radix activates on mouse down, not click). As 2B's. */
export function openTab(trigger) {
  fireEvent.mouseDown(trigger, { button: 0, ctrlKey: false });
}

/** Click the header toggle to the other theme. As 2B's. */
export function toggleTheme(screen) {
  fireEvent.click(screen.getByTestId('theme-toggle'));
}
