// TEST-ONLY harness for the course reader and handbook theme tests (batch
// 1C). Mounts a route as the app does (Layout, header, DashboardPage) with a
// signed-in user. The offline Supabase client the tests mock in is in
// offlineSupabase.js.
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthContext } from '@/contexts/SupabaseAuthContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { ApplicationLayoutProvider } from '@/contexts/ApplicationLayoutContext';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';

export const USER_ID = 'reader-user';

export const authFor = (role = 'learner') => ({
  user: { id: USER_ID, email: 'ada@example.com', user_metadata: {} },
  session: {},
  loading: false,
  isAdmin: role === 'admin' || role === 'super_admin',
  isSuperAdmin: role === 'super_admin',
  profile: { display_name: 'Ada Obi', role },
  signOut: async () => {},
});

export function renderRoute(path, { role = 'learner' } = {}) {
  return render(
    <HelmetProvider>
      <AuthContext.Provider value={authFor(role)}>
        <MemoryRouter initialEntries={[path]}>
          <RoleProvider>
            <Routes>
              <Route path="/dashboard/*" element={<ApplicationLayoutProvider><Layout><DashboardPage /></Layout></ApplicationLayoutProvider>} />
              {/* a signed-in route no batch registers (the negative control) */}
              <Route path="/legacy-probe" element={<ApplicationLayoutProvider><Layout><h1>Legacy probe</h1></Layout></ApplicationLayoutProvider>} />
            </Routes>
          </RoleProvider>
        </MemoryRouter>
      </AuthContext.Provider>
    </HelmetProvider>,
  );
}
