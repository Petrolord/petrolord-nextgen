// TEST-ONLY. Stubs for the batch 2C (admin II) theme tests, kept free of app
// imports so the vi.mock factories that load them never import a mocked
// module. Nothing here reaches Supabase: the client is a local fake that
// answers the reads these screens make (the admin list and the audit feed)
// and throws on anything else.

export { USER_ID } from './admin2bStubs';

const AUDIT_ROWS = [
  { id: 'e1', timestamp: '2026-09-27T10:00:00Z', action: 'LOGIN', user_email: 'ngozi@example.com', actor_role: 'student', resource_name: null, resource_id: null, resource_type: null, status: 'success', actor_id: 'u2' },
  { id: 'e2', timestamp: '2026-09-27T09:58:00Z', action: 'SYSTEM_ERROR', user_email: null, actor_role: null, resource_name: 'certificate-pdf', resource_id: 'r9', resource_type: 'SYSTEM', status: 'failure', actor_id: null },
  { id: 'e3', timestamp: '2026-09-27T09:50:00Z', action: 'COURSE_COMPLETE', user_email: 'musa@example.com', actor_role: 'student', resource_name: 'Decline Curve Analysis', resource_id: 'dca', resource_type: 'COURSE', status: 'success', actor_id: 'u3' },
  { id: 'e4', timestamp: '2026-09-27T09:40:00Z', action: 'GRADE_CHANGE', user_email: 'kemi@example.com', actor_role: 'admin', resource_name: 'Final exam', resource_id: 'q1', resource_type: 'QUIZ', status: 'success', actor_id: 'u4' },
];

const ADMINS = [
  { id: 'u4', display_name: 'Kemi Ade', email: 'kemi@example.com', role: 'admin', created_at: '2026-04-10T10:00:00Z' },
  { id: 'u6', display_name: null, email: 'ops@example.com', role: 'admin', created_at: '2026-05-10T10:00:00Z' },
];

/** A local fake of the Supabase client for the 2C screens. */
export function supabaseFake() {
  const query = (table) => {
    if (table !== 'profiles' && table !== 'audit_logs') {
      throw new Error(`Supabase is faked in the 2C theme tests: no table ${table}`);
    }
    const q = { head: false, filters: {} };
    const builder = {
      select: (_cols, opts) => { q.head = Boolean(opts && opts.head); return builder; },
      eq: (col, val) => { q.filters[col] = val; return builder; },
      gte: () => builder,
      order: () => builder,
      limit: () => builder,
      then: (resolve, reject) => {
        try {
          if (table === 'profiles') return resolve({ data: q.filters.role === 'admin' ? ADMINS : [], error: null });
          if (q.head) return resolve({ count: q.filters.status === 'failure' ? 1 : 12, data: null, error: null });
          return resolve({ data: AUDIT_ROWS, error: null });
        } catch (e) { return reject(e); }
      },
    };
    return builder;
  };
  const blocked = (what) => () => { throw new Error(`Supabase is faked in the 2C theme tests: ${what}`); };
  const client = {
    from: query,
    auth: { getSession: async () => ({ data: { session: { access_token: 'test' } }, error: null }) },
    functions: { invoke: blocked('functions.invoke') },
    rpc: blocked('rpc'),
    channel: blocked('channel'),
    storage: { from: blocked('storage') },
  };
  return { supabase: client, default: client };
}

/** analyticsService: the admin console, /dashboard/analytics and its reports tab. */
export function analyticsServiceStub() {
  return {
    analyticsService: {
      logEvent: async () => {},
      getSystemMetrics: async () => ({ userCount: 120, learnerCount: 96, activeUsers: 14, enrollmentCount: 210, certificateCount: 37 }),
      getDashboardMetrics: async () => ({ totalUsers: 120, totalEnrollments: 210, activeEnrollments: 150, certificatesIssued: 37, activeUsers: 44 }),
      getChartsData: async () => ({
        userGrowth: [{ name: 'Apr', value: 40 }, { name: 'May', value: 62 }, { name: 'Jun', value: 80 }, { name: 'Jul', value: 120 }],
        enrollmentStatus: [{ name: 'Active', value: 150 }, { name: 'Completed', value: 45 }, { name: 'Cancelled', value: 15 }],
        activeUsersTrend: [{ name: '09-25', value: 12 }, { name: '09-26', value: 18 }, { name: '09-27', value: 9 }],
        enrollmentsByDoor: [{ name: 'Individual', value: 90 }, { name: 'Cohort', value: 70 }, { name: 'Sponsor', value: 50 }],
      }),
      getUserActivityReport: async () => [
        { user: 'ngozi@example.com', lastActive: '2026-09-27', sessions: 12 },
        { user: 'musa@example.com', lastActive: null, sessions: 0 },
      ],
      getEnrollmentReport: async () => [],
      getCertificationReport: async () => [],
      getPaymentReport: async () => [],
    },
  };
}

/** auditService: the compliance centre's dashboard, audit log and policies. */
export function auditServiceStub() {
  return {
    ACTIONS: { CREATE: 'CREATE', UPDATE: 'UPDATE', DELETE: 'DELETE', LOGIN: 'LOGIN', LOGOUT: 'LOGOUT' },
    LOG_TYPES: { ACTION: 'action', ACCESS: 'access', SYSTEM: 'system', COMPLIANCE: 'compliance', SECURITY: 'security' },
    logAuditEvent: async () => {},
    auditService: {
      getComplianceAlerts: async () => [
        { id: 'al1', alert_type: 'Repeated failed sign in', message: 'Five failed attempts for ops@example.com.', created_at: '2026-09-27T10:00:00Z' },
      ],
      dismissAlert: async () => ({}),
      fetchLogs: async () => ({
        count: 3,
        data: [
          { id: 'l1', timestamp: '2026-09-27T10:00:00Z', severity: 'critical', action: 'ROLE_CHANGE', profiles: { email: 'ada@example.com' }, resource_type: 'PROFILE', resource_id: 'u5-aaaaaaaa', status: 'success', user_agent: 'Firefox', details: { role: 'lecturer' }, old_value: { role: 'learner' }, new_value: { role: 'lecturer' } },
          { id: 'l2', timestamp: '2026-09-27T09:00:00Z', severity: 'high', action: 'LOGIN', profiles: null, resource_type: 'SYSTEM', resource_id: null, status: 'failure', user_agent: 'curl', details: {} },
          { id: 'l3', timestamp: '2026-09-27T08:00:00Z', severity: 'medium', action: 'EXPORT', profiles: { email: 'kemi@example.com' }, resource_type: 'REPORT', resource_id: 'r1', status: 'pending', user_agent: 'Chrome', details: {} },
        ],
      }),
      getRetentionPolicies: async () => [
        { id: 'p1', policy_name: 'Access logs', log_type: 'access', retention_days: 90, auto_delete: true },
        { id: 'p2', policy_name: 'Compliance events', log_type: 'compliance', retention_days: 2555, auto_delete: false },
      ],
      updateRetentionPolicy: async () => ({}),
    },
  };
}

/** reportAnalyticsUtils: system analytics. */
export function reportAnalyticsStub() {
  return {
    logReportAnalytics: async () => {},
    getReportAnalytics: async () => [],
    getReportUsageStats: async () => ({}),
    getDashboardAnalytics: async () => ({
      stats: { totalReports: 18, totalRules: 6, avgRulesPerReport: 1.5 },
      charts: {
        reportsOverTime: [{ date: '09-25', count: 3 }, { date: '09-26', count: 7 }, { date: '09-27', count: 8 }],
        ruleDistribution: [{ name: 'Email', value: 3 }, { name: 'Name', value: 2 }, { name: 'IP', value: 1 }],
      },
      recentReports: [
        { name: 'system_activity', created_by: 'ada@example.com', created_at: '2026-09-27T10:00:00Z', rule_count: 2 },
        { name: 'failure', created_by: null, created_at: '2026-09-26T10:00:00Z', rule_count: 0 },
      ],
    }),
  };
}

const REPORT = {
  summary: { totalActions: 42, successRate: 95, failedActions: 2, uniqueUsers: 7, mostActiveUser: 'ada@example.com', mostCommonAction: 'LOGIN' },
  details: [
    { id: 'd1', user_email: 'ada@example.com', action: 'LOGIN', status: 'success', details: '{"ip":"10.0.0.1"}' },
    { id: 'd2', user_email: null, action: 'EXPORT', status: 'failure', details: null },
    { id: 'd3', user_email: 'kemi@example.com', action: 'SYNC', status: 'completed', details: '' },
  ],
};

/** complianceReportsUtils: every generator returns the same small report. */
export function complianceReportsStub() {
  const gen = async () => REPORT;
  return {
    generateSystemActivityReport: gen,
    getUserActivityReport: gen,
    getDataChangeReport: gen,
    getSecurityEventReport: gen,
    getUserEnrollmentReport: gen,
    getCertificateReport: gen,
    getEmailReport: gen,
    getFailureReport: gen,
    getAllUsers: async () => [{ id: 'u2', display_name: 'Ngozi Eze' }],
    saveReportHistory: async () => ({}),
  };
}

export const reportExportStub = () => ({ exportToCSV: () => {}, exportToPDF: () => {}, exportToExcel: () => {} });
