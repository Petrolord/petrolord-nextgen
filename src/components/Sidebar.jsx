import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  Briefcase,
  Settings,
  GraduationCap,
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  PieChart,
  Activity,
  Award,
  KeyRound,
  MonitorSmartphone,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useRole } from '@/contexts/RoleContext';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';
import CourseModuleNav from '@/components/sidebar/CourseModuleNav';
import useIsSponsorLead from '@/hooks/useIsSponsorLead';
import { FixedTheme } from '@/design/ThemeProvider';
import { RAIL_ITEM, RAIL_ITEM_ACTIVE, RAIL_ITEM_IDLE } from '@/components/sidebar/railClasses';

// Design system (docs/scope/DesignSystem-Rollout.md section 5.2, batch 1A):
// the rail is the family's dark ink rail in both themes, on every signed-in
// route. It sits outside the page scope; its root carries
// data-pl-theme="dark" inside a FixedTheme (no storage, no toggle), so the
// pl-* roles below resolve to the dark ink palette whatever the page next
// to it uses. Lime is retired: the active item is a raised fill with a gold
// edge, group titles are gold eyebrows.
//
// Phone (wave 7): below md the rail is hidden, and the header menu button
// opens the same rail in a drawer (SIDEBAR_DRAWER_ID). The drawer is a modal
// dialog: focus is trapped inside it, Escape and the scrim close it, and it
// closes when the route changes. It starts closed.

export const SIDEBAR_DRAWER_ID = 'sidebar-drawer';

const SidebarItem = ({ to, icon: Icon, label, exact = false }) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive: linkActive }) => cn(
        RAIL_ITEM,
        'font-medium',
        (exact ? linkActive : isActive) ? RAIL_ITEM_ACTIVE : RAIL_ITEM_IDLE
      )}
    >
      <Icon className={cn("w-5 h-5", isActive ? "text-pl-accent-text" : "group-hover:text-pl-accent-text")} aria-hidden="true" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

const SidebarGroup = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="px-3 text-[11px] font-semibold text-pl-accent-text uppercase tracking-[0.14em] mb-2">
      {title}
    </h3>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const RailContent = () => {
  const {
    isViewAsSuperAdmin,
    isViewAsAdmin,
    isViewAsLecturer,
    isViewAsStudent
  } = useRole();
  const isSponsorLead = useIsSponsorLead();

  return (
    <>
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <img src="/favicon.png" alt="" aria-hidden="true" className="w-8 h-8 rounded-lg object-contain shrink-0" />
        <div>
          <h1 className="text-lg font-bold text-pl-text tracking-tight">Petrolord</h1>
          <p className="text-[10px] text-pl-accent-text font-pl-mono tracking-widest">NEXTGEN</p>
        </div>
      </div>

      <div className="flex-1 px-3 py-2 space-y-1">
        {/* === SHARED / COMMON === */}
        <SidebarGroup title="Overview">
          <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" exact />
        </SidebarGroup>

        {/* === LEARNER VIEW === */}
        {isViewAsStudent && (
          <>
            <SidebarGroup title="My Learning">
              <SidebarItem to="/dashboard/enroll" icon={GraduationCap} label="Enroll" />
              <SidebarItem to="/dashboard/certificates" icon={Award} label="Certificates" />
              <SidebarItem to="/dashboard/devices" icon={MonitorSmartphone} label="Devices & Sessions" />
              {isSponsorLead && <SidebarItem to="/dashboard/sponsor" icon={Briefcase} label="Sponsor console" />}
            </SidebarGroup>

            <CourseModuleNav />
          </>
        )}

        {/* === LECTURER VIEW === */}
        {isViewAsLecturer && (
          <>
            <SidebarGroup title="Academy">
              <SidebarItem to="/dashboard/admin/certifications" icon={Award} label="Certifications" />
              <SidebarItem to="/dashboard/certificates" icon={GraduationCap} label="My Certificates" />
            </SidebarGroup>

            <CourseModuleNav />
          </>
        )}

        {/* === PETROLORD ADMIN VIEW === */}
        {isViewAsAdmin && (
          <>
            <SidebarGroup title="Platform Mgmt">
              <SidebarItem to="/dashboard/admin/academy-doors" icon={KeyRound} label="Academy Doors" />
              <SidebarItem to="/dashboard/sponsor" icon={Briefcase} label="Sponsor console" />
              <SidebarItem to="/dashboard/admin/certifications" icon={Award} label="Certifications" />
              <SidebarItem to="/dashboard/admin/users" icon={Users} label="User Directory" />
            </SidebarGroup>

            <SidebarGroup title="System">
              <SidebarItem to="/dashboard/admin/audit-logs" icon={FileText} label="Audit Logs" />
              <SidebarItem to="/dashboard/admin/analytics" icon={PieChart} label="System Analytics" />
              <SidebarItem to="/dashboard/admin/monitoring" icon={Activity} label="Live Monitoring" />
            </SidebarGroup>
          </>
        )}

        {/* === SUPER ADMIN VIEW === */}
        {isViewAsSuperAdmin && (
          <>
            <SidebarGroup title="Platform Superuser">
              <SidebarItem to="/dashboard/admin/academy-doors" icon={KeyRound} label="Academy Doors" />
              <SidebarItem to="/dashboard/sponsor" icon={Briefcase} label="Sponsor console" />
              <SidebarItem to="/dashboard/admin/certifications" icon={Award} label="Certifications" />
              <SidebarItem to="/dashboard/admin/users" icon={Users} label="User Management" />
              <SidebarItem to="/dashboard/admin/admin-mgmt" icon={Shield} label="Admin Roles" />
              <SidebarItem to="/dashboard/admin/super-admins" icon={Shield} label="Super Admins" />
              <SidebarItem to="/dashboard/admin/settings" icon={SlidersHorizontal} label="System Settings" />
            </SidebarGroup>

            <SidebarGroup title="Monitoring">
              <SidebarItem to="/dashboard/admin/analytics" icon={PieChart} label="Analytics" />
              <SidebarItem to="/dashboard/admin/audit-logs" icon={FileText} label="Audit Logs" />
              <SidebarItem to="/dashboard/admin/monitoring" icon={Activity} label="Live Monitoring" />
            </SidebarGroup>
          </>
        )}
      </div>

      <div className="p-4 border-t border-pl-border">
        <SidebarItem to="/dashboard/settings" icon={Settings} label="Settings" />
      </div>
    </>
  );
};

const MD_QUERY = '(min-width: 768px)';

const Sidebar = ({ sidebarOpen = false, setSidebarOpen }) => {
  const { isFullScreen } = useApplicationLayout();
  const { pathname } = useLocation();
  const close = () => { if (setSidebarOpen) setSidebarOpen(false); };

  // The drawer closes on navigation.
  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // It is a phone control: at md and wider the rail itself is on show.
  useEffect(() => {
    if (!sidebarOpen || typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(MD_QUERY);
    const onChange = (e) => { if (e.matches) close(); };
    if (mq.matches) close();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarOpen]);

  return (
    <FixedTheme theme="dark">
    <aside
      data-pl-theme="dark"
      data-testid="sidebar-rail"
      aria-label="Main navigation"
      className={cn(
        "hidden md:flex flex-col bg-pl-surface border-r border-pl-border h-screen overflow-y-auto whitespace-nowrap font-pl-sans",
        isFullScreen ? "invisible" : "visible w-64"
    )}>
      <RailContent />
    </aside>

    <DialogPrimitive.Root open={Boolean(sidebarOpen) && !isFullScreen} onOpenChange={(open) => { if (!open) close(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          data-testid="sidebar-drawer-scrim"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
        <DialogPrimitive.Content
          id={SIDEBAR_DRAWER_ID}
          data-pl-theme="dark"
          data-testid="sidebar-drawer"
          aria-describedby={undefined}
          onCloseAutoFocus={(e) => {
            // back to the header menu button (Safari does not focus a button on click)
            const trigger = document.querySelector(`[aria-controls="${SIDEBAR_DRAWER_ID}"]`);
            if (trigger) { e.preventDefault(); trigger.focus(); }
          }}
          className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto whitespace-nowrap border-r border-pl-border bg-pl-surface font-pl-sans shadow-pl-lg focus:outline-none md:hidden"
        >
          <DialogPrimitive.Title className="sr-only">Main navigation</DialogPrimitive.Title>
          <DialogPrimitive.Close
            aria-label="Close navigation"
            className="absolute right-3 top-5 rounded-md p-2 text-pl-muted hover:bg-pl-raised hover:text-pl-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </DialogPrimitive.Close>
          <RailContent />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
    </FixedTheme>
  );
};

export default Sidebar;
