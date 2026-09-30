// TEST-ONLY. Mounts a public or auth page the way App.jsx does: inside the
// real AuthProvider (so the pages' sign-in and sign-up calls go through the
// context to the stubbed client), a HelmetProvider and a router. Any other
// path renders a probe that prints where the page navigated to.
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';

function Elsewhere() {
  const { pathname } = useLocation();
  return <div data-testid="elsewhere">{pathname}</div>;
}

export function mountPublic(Page, route, pattern = route.split('?')[0]) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>
          <Routes>
            <Route path={pattern} element={<Page />} />
            <Route path="*" element={<Elsewhere />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );
}
