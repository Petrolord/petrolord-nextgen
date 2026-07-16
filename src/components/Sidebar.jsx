import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
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
  FlaskConical,
  HardDrive,
  GitCompareArrows,
  Waves,
  Map,
  Calculator,
  BookOpen,
  SlidersHorizontal,
  Atom,
  Gauge,
  Layers,
  Flame
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useRole } from '@/contexts/RoleContext';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';
import { listAcademyApps } from '@/services/academyService';
import { moduleLabel } from '@/lib/academyModules';

// Course links are grouped per module (Geoscience is one of many);
// icons are per-course with a BookOpen fallback for future courses.
const COURSE_ICONS = {
  welldata: HardDrive,
  petrophysics: FlaskConical,
  wellcorrelation: GitCompareArrows,
  seismolord: Waves,
  mapping: Map,
  reservoircalc: Calculator,
  rockphysics: Atom,
  porepressure: Gauge,
  earthmodel: Layers,
  basin: Flame,
};

const SidebarItem = ({ to, icon: Icon, label, exact = false }) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      className={({ isActive: linkActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm font-medium",
        (exact ? linkActive : isActive)
          ? "bg-[#BFFF00] text-black shadow-[0_0_15px_rgba(191,255,0,0.3)]"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className={cn("w-5 h-5", isActive ? "text-black" : "group-hover:text-[#BFFF00]")} />
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

const SidebarGroup = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
      {title}
    </h3>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

// One sidebar group per module that has courses live in the catalog.
const CourseModuleGroups = () => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    let cancelled = false;
    listAcademyApps()
      .then((data) => { if (!cancelled) setApps(data || []); })
      .catch((err) => console.error('Sidebar catalog load failed:', err));
    return () => { cancelled = true; };
  }, []);

  const modules = [];
  const byModule = {};
  apps.filter((a) => a.status === 'available').forEach((a) => {
    if (!byModule[a.module]) {
      byModule[a.module] = [];
      modules.push(a.module);
    }
    byModule[a.module].push(a);
  });

  return modules.map((mod) => (
    <SidebarGroup key={mod} title={`${moduleLabel(mod)} Courses`}>
      {byModule[mod].map((app) => (
        <SidebarItem
          key={app.slug}
          to={`/dashboard/apps/${app.slug}`}
          icon={COURSE_ICONS[app.slug] || BookOpen}
          label={app.name}
        />
      ))}
    </SidebarGroup>
  ));
};

const Sidebar = () => {
  const { isFullScreen } = useApplicationLayout();
  const {
    isViewAsSuperAdmin,
    isViewAsAdmin,
    isViewAsLecturer,
    isViewAsStudent
  } = useRole();

  return (
    <aside className={cn(
        "hidden md:flex flex-col bg-[#0F172A] border-r border-slate-800 h-screen overflow-y-auto whitespace-nowrap",
        isFullScreen ? "invisible" : "visible w-64"
    )}>
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#BFFF00] flex items-center justify-center shadow-[0_0_15px_rgba(191,255,0,0.4)]">
          <Activity className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Petrolord</h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-widest">NEXTGEN SUITE</p>
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
            </SidebarGroup>

            <CourseModuleGroups />
          </>
        )}

        {/* === LECTURER VIEW === */}
        {isViewAsLecturer && (
          <>
            <SidebarGroup title="Academy">
              <SidebarItem to="/dashboard/admin/certifications" icon={Award} label="Certifications" />
              <SidebarItem to="/dashboard/certificates" icon={GraduationCap} label="My Certificates" />
            </SidebarGroup>

            <CourseModuleGroups />
          </>
        )}

        {/* === PETROLORD ADMIN VIEW === */}
        {isViewAsAdmin && (
          <>
            <SidebarGroup title="Platform Mgmt">
              <SidebarItem to="/dashboard/admin/academy-doors" icon={KeyRound} label="Academy Doors" />
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

      <div className="p-4 border-t border-slate-800">
        <SidebarItem to="/dashboard/settings" icon={Settings} label="Settings" />
      </div>
    </aside>
  );
};

export default Sidebar;
