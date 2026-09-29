// TEST-ONLY. The signed-in harness the batch 4A (production I course apps)
// theme test uses: Layout, the header and DashboardPage mounted as the
// /dashboard/* route mounts them (inside HelmetProvider, as App.jsx), with a
// signed-in learner, the root toaster and mocked services. The test file stubs
// the Supabase client (frameStubs.js supabaseStub, which throws on any use)
// and every academyService call the pages make, so nothing reaches the real
// project.
import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '@/contexts/SupabaseAuthContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { ApplicationLayoutProvider } from '@/contexts/ApplicationLayoutContext';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import { Toaster } from '@/components/ui/toaster';

import { USER_ID } from './frameStubs';

export { USER_ID } from './frameStubs';

const auth = {
  user: { id: USER_ID, email: 'ada@example.com', user_metadata: {} },
  session: {},
  loading: false,
  isAdmin: false,
  isSuperAdmin: false,
  profile: { display_name: 'Ada Obi', role: 'learner' },
  signOut: async () => {},
};

/** Mount a course app at `path` the way App.jsx does for a signed-in learner. */
export function renderCourseApp(path) {
  return render(
    <HelmetProvider>
      <AuthContext.Provider value={auth}>
        <MemoryRouter initialEntries={[path]}>
          <RoleProvider>
            <Routes>
              <Route path="/dashboard/*" element={<ApplicationLayoutProvider><Layout><DashboardPage /></Layout></ApplicationLayoutProvider>} />
            </Routes>
            <Toaster />
          </RoleProvider>
        </MemoryRouter>
      </AuthContext.Provider>
    </HelmetProvider>,
  );
}
