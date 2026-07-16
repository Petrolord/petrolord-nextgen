import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRole } from '@/contexts/RoleContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Users, Settings, Construction, Award, KeyRound, GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

import EnrollPage from '@/pages/EnrollPage';
import AdminAcademyDoorsPage from '@/pages/AdminAcademyDoorsPage';
import GetStartedPage from '@/pages/GetStartedPage';
import DevicesPage from '@/pages/DevicesPage';
import AdminCertificationsPage from '@/pages/AdminCertificationsPage';
import PetrophysicsLearningPage from '@/pages/apps/PetrophysicsLearningPage';
import WellDataLearningPage from '@/pages/apps/WellDataLearningPage';
import WellCorrelationLearningPage from '@/pages/apps/WellCorrelationLearningPage';
import SeismolordLearningPage from '@/pages/apps/SeismolordLearningPage';
import MappingLearningPage from '@/pages/apps/MappingLearningPage';
import ReservoirCalcLearningPage from '@/pages/apps/ReservoirCalcLearningPage';
import RockPhysicsLearningPage from '@/pages/apps/RockPhysicsLearningPage';
import PorePressureLearningPage from '@/pages/apps/PorePressureLearningPage';
import EarthModelLearningPage from '@/pages/apps/EarthModelLearningPage';
import ActivationBanner from '@/components/academy/ActivationBanner';
import SettingsPage from '@/pages/SettingsPage';
import AdminUsersPage from '@/pages/AdminUsersPage';
import AdminReportAnalyticsPage from '@/pages/AdminReportAnalyticsPage';
import AdminAuditLogsPage from '@/pages/AdminAuditLogsPage';
import AdminManagementPage from '@/pages/AdminManagementPage';
import AdminSystemSettingsPage from '@/pages/AdminSystemSettingsPage';
import SuperAdminToolPage from '@/pages/SuperAdminToolPage';
import RealTimeMonitoringPage from '@/pages/RealTimeMonitoringPage';
import NotificationCenterPage from '@/pages/NotificationCenterPage';
import { listAcademyApps, listMyEnrollments, listMyCertifications } from '@/services/academyService';
import { MODULE_LABELS, moduleLabel } from '@/lib/academyModules';

// --- Role Specific Home Components ---

const AdminHomeCard = ({ to, title, description, cta }) => (
    <Card className="bg-[#1E293B] border-slate-800 hover:border-slate-600 transition-colors">
        <CardHeader><CardTitle className="text-white">{title}</CardTitle></CardHeader>
        <CardContent>
            <p className="text-slate-400 mb-4">{description}</p>
            <Link to={to}>
                <Button variant="outline" className="w-full border-slate-700 text-slate-200">{cta}</Button>
            </Link>
        </CardContent>
    </Card>
);

const SuperAdminHome = () => (
    <div className="space-y-6 animate-in fade-in duration-500 py-16">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Super Admin Control Center</h1>
        <p className="text-slate-400">Full system oversight and administration.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminHomeCard to="/dashboard/admin/academy-doors" title="Academy Doors" description="Issue cohort and sponsorship codes, decide residency applications." cta="Open Doors Console" />
        <AdminHomeCard to="/dashboard/admin/certifications" title="Certifications" description="Issue and revoke academy certificates." cta="Open Certifications" />
        <AdminHomeCard to="/dashboard/admin/monitoring" title="Live Monitoring" description="View real-time logs and system health." cta="Open Monitoring" />
        <AdminHomeCard to="/dashboard/admin/settings" title="System Configuration" description="Manage global configuration." cta="Open Settings" />
      </div>
    </div>
);

const PetrolordAdminHome = () => (
    <div className="space-y-6 animate-in fade-in duration-500 py-16">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
        <p className="text-slate-400">Manage academy learners, doors and certificates.</p>
      </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AdminHomeCard to="/dashboard/admin/academy-doors" title="Academy Doors" description="Issue cohort and sponsorship codes, decide residency applications." cta="Open Doors Console" />
        <AdminHomeCard to="/dashboard/admin/certifications" title="Certifications" description="Issue and revoke academy certificates." cta="Open Certifications" />
        <AdminHomeCard to="/dashboard/admin/monitoring" title="System Monitoring" description="View real-time logs and system health status." cta="Open Dashboard" />
      </div>
    </div>
);

const LecturerHome = () => (
    <div className="space-y-6 animate-in fade-in duration-500 py-16">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Lecturer Dashboard</h1>
        <p className="text-slate-400">Support learners and manage certifications.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <AdminHomeCard to="/dashboard/admin/certifications" title="Certifications" description="Issue and revoke academy certificates for your learners." cta="Open Certifications" />
        <AdminHomeCard to="/dashboard/certificates" title="My Certificates" description="Certificates issued to your own account." cta="View Certificates" />
      </div>
    </div>
);

const TIER_LABELS = { beginner: 'Associate', intermediate: 'Professional', advanced: 'Expert' };

const StudentHome = () => {
    const { user, profile } = useAuth();
    const [apps, setApps] = React.useState([]);
    const [enrollments, setEnrollments] = React.useState([]);
    const [certs, setCerts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!user) return;
        let cancelled = false;
        (async () => {
            try {
                const [appList, enrollList, certList] = await Promise.all([
                    listAcademyApps(),
                    listMyEnrollments(),
                    listMyCertifications(),
                ]);
                if (cancelled) return;
                setApps(appList || []);
                setEnrollments(enrollList || []);
                setCerts(certList || []);
            } catch (err) {
                console.error('Failed to load academy dashboard:', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [user]);

    const activeEnrollments = enrollments.filter((e) => e.status === 'active');
    const liveCerts = certs.filter((c) => !c.revoked_at && (!c.valid_until || new Date(c.valid_until) > new Date()));
    const enrolledSlugs = new Set(activeEnrollments.map((e) => e.app_slug));

    // Group the available catalog by module; every module the academy
    // teaches gets its own section as courses come online.
    const modules = [];
    const byModule = {};
    apps.filter((a) => a.status === 'available').forEach((a) => {
        if (!byModule[a.module]) {
            byModule[a.module] = [];
            modules.push(a.module);
        }
        byModule[a.module].push(a);
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 py-16">
        {/* N3.3 activation gate prompt (learners who haven't cleared it) */}
        <ActivationBanner />

        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
                Welcome{profile?.display_name ? `, ${profile.display_name}` : ''}
            </h1>
            <p className="text-slate-400">Your NextGen Academy dashboard.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-[#1E293B] border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Active Enrollments</CardTitle>
                    <GraduationCap className="h-4 w-4 text-[#BFFF00]" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{loading ? '—' : activeEnrollments.length}</div>
                    <p className="text-xs text-slate-500">Courses you can work in right now</p>
                </CardContent>
            </Card>
            <Card className="bg-[#1E293B] border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Live Certificates</CardTitle>
                    <Award className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{loading ? '—' : liveCerts.length}</div>
                    <p className="text-xs text-slate-500">Valid certifications on your account</p>
                </CardContent>
            </Card>
            <Card className="bg-[#1E293B] border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Enroll</CardTitle>
                    <BookOpen className="h-4 w-4 text-sky-400" />
                </CardHeader>
                <CardContent>
                    <Link to="/dashboard/enroll">
                        <Button className="w-full bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold">
                            Browse Courses <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>

        {modules.map((mod) => (
            <div key={mod} className="rounded-lg border border-slate-800 bg-[#1E293B] p-6 shadow-lg">
                <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-lg font-medium text-slate-200">{moduleLabel(mod)}</h3>
                    <span className="text-xs text-slate-500">{byModule[mod].length} course{byModule[mod].length === 1 ? '' : 's'}</span>
                </div>
                <p className="text-slate-400 text-sm mb-4">Courses in the {moduleLabel(mod)} module, in learning-path order.</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {byModule[mod].map((app) => {
                        const cert = liveCerts.filter((c) => c.app_slug === app.slug)
                            .sort((a, b) => new Date(b.issued_at) - new Date(a.issued_at))[0];
                        return (
                            <Link key={app.slug} to={`/dashboard/apps/${app.slug}`}
                                className="p-4 bg-slate-800 rounded border border-slate-700 hover:bg-slate-700 transition-all hover:scale-[1.02] block">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-200">{app.name}</span>
                                    {cert ? (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            {TIER_LABELS[cert.tier] || cert.tier}
                                        </span>
                                    ) : enrolledSlugs.has(app.slug) ? (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">Enrolled</span>
                                    ) : null}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        ))}

        <div className="rounded-lg border border-slate-800 bg-[#1E293B] p-6 text-center">
            <h3 className="text-sm font-medium text-slate-300">More modules are on the way</h3>
            <p className="text-slate-500 text-xs mt-1">
                {Object.keys(MODULE_LABELS).filter((m) => !byModule[m]).map((m) => MODULE_LABELS[m]).join(' · ')}
            </p>
        </div>
        </div>
    );
};

const ModulePlaceholder = ({ name, icon: Icon, description }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
    <div className="p-6 rounded-full bg-slate-800 border border-slate-700 shadow-xl shadow-slate-900/50">
      <Icon className="h-16 w-16 text-[#BFFF00]" />
    </div>
    <div className="space-y-2">
      <h2 className="text-3xl font-bold text-white">{name}</h2>
      <p className="text-slate-400 max-w-lg mx-auto text-lg">
        {description || "This module is currently active and ready for data integration."}
      </p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { loading } = useAuth();
  const { viewRole } = useRole();

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-[#0F172A]">
            <div className="text-white animate-pulse">Loading Dashboard...</div>
        </div>
    );
  }

  const renderHome = () => {
    if (viewRole === 'super_admin') return <SuperAdminHome />;
    if (viewRole === 'admin') return <PetrolordAdminHome />;
    if (viewRole === 'lecturer') return <LecturerHome />;
    return <StudentHome />;
  };

  return (
    <Routes>
    {/* The Index Route determines the Dashboard Landing Page */}
    <Route path="/" element={renderHome()} />

    {/* Engineering modules removed at N2 — being rebuilt on the Suite's validated engines (@petrolord/engines; see NextGen-ROADMAP.md in petrolord-suite) */}
    <Route path="modules/*" element={<ModulePlaceholder name="Engineering Modules" icon={Construction} description="The engineering teaching modules are being rebuilt on the Petrolord Suite's validated engines and will return module by module." />} />

    {/* --- ACADEMY ENROLLMENT (N3.2 four doors) --- */}
    <Route path="enroll" element={<EnrollPage />} />

    {/* --- ACTIVATION GATE + INTEGRITY (N3.3) --- */}
    <Route path="get-started" element={<GetStartedPage />} />
    <Route path="devices" element={<DevicesPage />} />

    {/* --- COURSE APPS on the spine (N4) --- */}
    <Route path="apps/petrophysics" element={<PetrophysicsLearningPage />} />
    <Route path="apps/welldata" element={<WellDataLearningPage />} />
    <Route path="apps/wellcorrelation" element={<WellCorrelationLearningPage />} />
    <Route path="apps/seismolord" element={<SeismolordLearningPage />} />
    <Route path="apps/mapping" element={<MappingLearningPage />} />
    <Route path="apps/reservoircalc" element={<ReservoirCalcLearningPage />} />
    <Route path="apps/rockphysics" element={<RockPhysicsLearningPage />} />
    <Route path="apps/porepressure" element={<PorePressureLearningPage />} />
    <Route path="apps/earthmodel" element={<EarthModelLearningPage />} />

    {/* --- SETTINGS --- */}
    <Route path="settings" element={<SettingsPage />} />

    {/* --- NOTIFICATIONS --- */}
    <Route path="notifications" element={<NotificationCenterPage />} />

    <Route path="admin/academy-doors" element={<AdminAcademyDoorsPage />} />
    <Route path="admin/certifications" element={<AdminCertificationsPage />} />
    <Route path="admin/audit-logs" element={<AdminAuditLogsPage />} />
    <Route path="admin/monitoring" element={<RealTimeMonitoringPage />} />
    <Route path="admin/users" element={<AdminUsersPage />} />
    <Route path="admin/admin-mgmt" element={<AdminManagementPage />} />
    <Route path="admin/analytics" element={<AdminReportAnalyticsPage />} />
    <Route path="admin/super-admins" element={<SuperAdminToolPage />} />
    <Route path="admin/settings" element={<AdminSystemSettingsPage />} />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default DashboardPage;
