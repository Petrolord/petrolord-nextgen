import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  SlidersHorizontal
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

const SidebarItem = ({ to, icon: Icon, label, exact = false }) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
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

const Sidebar = () => {
  const { isFullScreen } = useApplicationLayout();
  const {
    isViewAsSuperAdmin,
    isViewAsAdmin,
    isViewAsLecturer,
    isViewAsStudent
  } = useRole();
  const isSponsorLead = useIsSponsorLead();

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
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <img src="/favicon.png" alt="" aria-hidden="true" className="w-8 h-8 rounded-lg object-contain shrink-0" />
        <div>
          <h1 className="text-lg font-bold text-pl-text tracking-tight">Petrolord</h1>
          <p className="text-[10px] text-pl-accent-text font-pl-mono tracking-widest">NEXTGEN SUITE</p>
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
    </aside>
    </FixedTheme>
  );
};

export default Sidebar;
