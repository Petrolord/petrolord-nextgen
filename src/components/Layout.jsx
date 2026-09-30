import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';
import { SignedInScope } from '@/design/SignedInScope';

// Design system (docs/scope/DesignSystem-Rollout.md section 5): the header
// and the page render inside the one signed-in scope (grey panel light by
// default, dark from the header toggle) on every route Layout serves. The
// sidebar rail sits beside it as the fixed dark ink rail.
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { showMainSidebar, showMainHeader, isFullscreenApp } = useApplicationLayout();

  // If it's a fullscreen app, we render just the children without the standard wrapper elements
  if (isFullscreenApp) {
    return <SignedInScope className="min-h-screen">{children}</SignedInScope>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {showMainSidebar && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      {/* Content Area */}
      <SignedInScope className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
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
      </SignedInScope>
    </div>
  );
};

export default Layout;
