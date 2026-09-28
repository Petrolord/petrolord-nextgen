import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';
import { SignedInScope } from '@/design/SignedInScope';
import { isThemedPath } from '@/design/scopePaths';

// Design system (docs/scope/DesignSystem-Rollout.md section 5): on the
// routes the rollout has migrated, the header and the page render inside
// the one signed-in scope (grey panel light by default, dark from the
// header toggle). Every other route renders exactly what it did before. The
// sidebar rail stays outside the scope.
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { showMainSidebar, showMainHeader, isFullscreenApp } = useApplicationLayout();
  const { pathname } = useLocation();
  const themed = isThemedPath(pathname);

  // If it's a fullscreen app, we render just the children without the standard wrapper elements
  if (isFullscreenApp) {
    if (themed) {
      return <SignedInScope className="min-h-screen">{children}</SignedInScope>;
    }
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100">
        {children}
      </div>
    );
  }

  const column = (
    <>
      {/* Header */}
      {showMainHeader && (
         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      {/* Main Content */}
      <main className="w-full grow">
        <div className="mx-auto w-full max-w-9xl">
          {children}
        </div>
      </main>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F172A]">
      {/* Sidebar */}
      {showMainSidebar && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      {/* Content Area */}
      {themed ? (
        <SignedInScope className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {column}
        </SignedInScope>
      ) : (
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {column}
        </div>
      )}
    </div>
  );
};

export default Layout;
