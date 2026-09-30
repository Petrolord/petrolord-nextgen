// TEST-ONLY. The signed-in harness the batch 1A theme tests share: the app
// root pieces (search provider, device guard, search modal) around Layout,
// mounted as App.jsx mounts them, with a signed-in user and mocked services.
// No request reaches Supabase: the tests stub the client module
// (customSupabaseClient) and every academyService call they use.
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '@/contexts/SupabaseAuthContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { ApplicationLayoutProvider } from '@/contexts/ApplicationLayoutContext';
import { SearchProvider } from '@/contexts/SearchContext';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import SearchPage from '@/pages/SearchPage';
import GlobalSearchModal from '@/components/search/GlobalSearchModal';
import DeviceGuard from '@/components/academy/DeviceGuard';

import { USER_ID } from './frameStubs';

export { USER_ID, CATALOG, academyServiceStub, supabaseStub, notificationStub } from './frameStubs';

const auth = {
  user: { id: USER_ID, email: 'ada@example.com', user_metadata: {} },
  session: {},
  loading: false,
  isAdmin: false,
  isSuperAdmin: false,
  profile: { display_name: 'Ada Obi', role: 'learner' },
  signOut: async () => {},
};

/** Mount the app at `path` the way App.jsx does (root pieces, Layout, the page). */
export function renderApp(path) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[path]}>
        <RoleProvider>
          <SearchProvider>
            <DeviceGuard>
              <GlobalSearchModal />
              <Routes>
                <Route path="/dashboard/*" element={<ApplicationLayoutProvider><Layout><DashboardPage /></Layout></ApplicationLayoutProvider>} />
                <Route path="/search" element={<ApplicationLayoutProvider><Layout><SearchPage /></Layout></ApplicationLayoutProvider>} />
                {/* a signed-in route no batch ever listed: scoped like every other (wave 7) */}
                <Route path="/legacy-probe" element={<ApplicationLayoutProvider><Layout><h1>Legacy probe</h1></Layout></ApplicationLayoutProvider>} />
                <Route path="/outside" element={<p>No layout here</p>} />
              </Routes>
            </DeviceGuard>
          </SearchProvider>
        </RoleProvider>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}
