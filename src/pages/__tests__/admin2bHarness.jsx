// TEST-ONLY. The signed-in harness the batch 2B (admin I) theme tests share:
// Layout, the header and DashboardPage mounted as the /dashboard/* route
// mounts them (inside HelmetProvider, as App.jsx), with a signed-in super
// admin, the root toaster and mocked services. Each test file stubs the Supabase client (admin2bStubs.js
// supabaseFake) and every service its screen calls, so nothing reaches
// the real project.
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '@/contexts/SupabaseAuthContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { ApplicationLayoutProvider } from '@/contexts/ApplicationLayoutContext';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import { Toaster } from '@/components/ui/toaster';

import { USER_ID } from './admin2bStubs';

export { USER_ID } from './admin2bStubs';

const auth = {
  user: { id: USER_ID, email: 'ada@example.com', user_metadata: {} },
  session: {},
  loading: false,
  isAdmin: false,
  isSuperAdmin: true,
  profile: { display_name: 'Ada Obi', role: 'super_admin' },
  signOut: async () => {},
};

/** Mount the app at `path` the way App.jsx does for a signed-in super admin. */
export function renderAdmin(path) {
  return render(
    <HelmetProvider>
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[path]}>
        <RoleProvider>
          <Routes>
            <Route path="/dashboard/*" element={<ApplicationLayoutProvider><Layout><DashboardPage /></Layout></ApplicationLayoutProvider>} />
            {/* a signed-in route no batch ever listed: scoped like every other (wave 7) */}
            <Route path="/legacy-probe" element={<ApplicationLayoutProvider><Layout><h1>Legacy probe</h1></Layout></ApplicationLayoutProvider>} />
          </Routes>
          <Toaster />
        </RoleProvider>
      </MemoryRouter>
    </AuthContext.Provider>
    </HelmetProvider>,
  );
}

/** Open a Radix tab (Radix activates on mouse down, not click). */
export function openTab(trigger) {
  fireEvent.mouseDown(trigger, { button: 0, ctrlKey: false });
}

/** Click the header toggle to the other theme. */
export function toggleTheme(screen) {
  fireEvent.click(screen.getByTestId('theme-toggle'));
}
