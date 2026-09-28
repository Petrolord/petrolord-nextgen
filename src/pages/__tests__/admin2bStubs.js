// TEST-ONLY. Stubs for the batch 2B (admin I) theme tests, kept free of app
// imports so the vi.mock factories that load them never import a mocked
// module. Nothing here reaches Supabase: the client is a local fake that
// answers the two table reads these screens make and throws on anything else.

export const USER_ID = 'admin-2b-user';
export const OTHER_ID = 'admin-2b-other';

const CATALOG = [
  { slug: 'petrophysics', name: 'Petrophysics', module: 'geoscience', status: 'available', path_order: 1 },
  { slug: 'dca', name: 'Decline Curve Analysis', module: 'reservoir', status: 'available', path_order: 11 },
];

const SPONSOR_GROUPS = [{
  sponsor: { id: 'sp1', name: 'Breeze Energy' },
  leads: [{ user_id: 'l1', display_name: 'Tolu Ade', email: 'tolu@breeze.example' }],
  pools: [
    { id: 'p1', name: 'Starter block', seats: 20, seats_used: 4, status: 'active', seat_scope: 'tier', valid_until: '2099-01-01T00:00:00Z', price_minor: 240000000, currency: 'NGN' },
    { id: 'p2', name: 'Pilot block', seats: 5, seats_used: 5, status: 'closed', seat_scope: 'course', valid_until: '2026-01-01T00:00:00Z' },
  ],
}];

/** academyService: the frame's calls plus every admin call the 2B screens make. */
export function academyServiceStub({ sponsorGroups = SPONSOR_GROUPS } = {}) {
  return {
    listAcademyApps: async () => CATALOG,
    listMyEnrollments: async () => [],
    listMyCertifications: async () => [],
    getActivationStatus: async () => ({ activated: true, orientation_completed: true }),
    mySponsorPools: async () => sponsorGroups,
    getDeviceId: () => 'device-this',
    registerDevice: async () => ({ status: 'ok' }),
    revokeDevice: async () => ({}),
    // academy doors
    adminListCodes: async () => [
      { id: 'k1', code: 'COHORT-UNILAG-26', kind: 'cohort', organization: 'University of Lagos', redeemed_count: 12, max_redemptions: 40, valid_until: '2099-01-01T00:00:00Z' },
      { id: 'k2', code: 'SPONSOR-BREEZE', kind: 'sponsorship', organization: null, redeemed_count: 3, max_redemptions: null, valid_until: null },
    ],
    adminIssueCode: async () => ({ code: 'COHORT-NEW' }),
    adminListResidencyApplications: async () => [
      { id: 'r1', status: 'pending', app_slug: 'dca', course_name: null, created_at: '2026-09-20T10:00:00Z', motivation: 'I run the decline work for our asset team.', applicant: { display_name: 'Ngozi Eze', email: 'ngozi@example.com' } },
      { id: 'r2', status: 'accepted', app_slug: 'petrophysics', course_name: null, created_at: '2026-09-18T10:00:00Z', motivation: 'Log analysis.', applicant: { display_name: 'Musa Bello', email: 'musa@example.com' } },
      { id: 'r3', status: 'rejected', app_slug: 'petrophysics', course_name: null, created_at: '2026-09-17T10:00:00Z', motivation: 'n/a', applicant: { email: 'anon@example.com' } },
    ],
    adminDecideResidency: async () => ({}),
    adminListSessions: async () => [
      { id: 's1', event: 'register', created_at: '2026-09-27T10:00:00Z', actor: { display_name: 'Ngozi Eze' }, device_id: 'abcdef123456' },
      { id: 's2', event: 'resume', created_at: '2026-09-27T09:00:00Z', actor: { email: 'musa@example.com' }, device_id: 'bcdef1234567' },
      { id: 's3', event: 'revoke', created_at: '2026-09-27T08:00:00Z', actor: null, device_id: null },
      { id: 's4', event: 'denied', created_at: '2026-09-27T07:00:00Z', actor: { display_name: 'Ada Obi' }, device_id: 'cdef12345678' },
    ],
    grantReviewAccess: async () => ({ apps_covered: 2, valid_days: 90, enrollments_created: 1, skipped: [{ app: 'dca', tier: 'expert', reason: 'intermediate not passed' }] }),
    revokeReviewAccess: async () => ({ entitlements_expired: 2, enrollments_cancelled: 1 }),
    adminUpsertSponsor: async ({ name }) => ({ id: 'sp2', name }),
    adminAddSponsorLead: async () => ({ email: 'lead@example.com' }),
    adminRemoveSponsorLead: async () => ({}),
    adminCreatePool: async () => ({ name: 'x', seats: 1, valid_until: '2099-01-01T00:00:00Z' }),
    adminClosePool: async () => ({}),
    // certifications
    findProfileByEmail: async (email) => (email === 'nobody@example.com' ? null : { id: 'u9', display_name: 'Ngozi Eze', email, role: 'learner' }),
    issueCertification: async () => ({ certificate_number: 'PL-NG-0001' }),
    revokeCertification: async () => ({}),
    adminListCertifications: async () => [
      { id: 'c1', certificate_number: 'PL-NG-0001', verify_code: 'v1', app_slug: 'dca', tier: 'associate', valid_until: '2099-01-01T00:00:00Z', revoked_at: null, holder: { display_name: 'Ngozi Eze' } },
      { id: 'c2', certificate_number: 'PL-NG-0002', verify_code: 'v2', app_slug: 'petrophysics', tier: 'professional', valid_until: '2020-01-01T00:00:00Z', revoked_at: null, holder: { email: 'musa@example.com' } },
      { id: 'c3', certificate_number: 'PL-NG-0003', verify_code: 'v3', app_slug: 'petrophysics', tier: 'expert', valid_until: '2099-01-01T00:00:00Z', revoked_at: '2026-09-01T00:00:00Z', holder: null },
    ],
    certificateStatus: (cert) => {
      if (cert.revoked_at) return 'revoked';
      if (new Date(cert.valid_until) <= new Date()) return 'expired';
      return 'valid';
    },
    verificationUrl: (code) => `http://localhost/verify/${code}`,
  };
}

const USERS = [
  { id: USER_ID, display_name: 'Ada Obi', email: 'ada@example.com', role: 'super_admin', status: 'active', created_at: '2026-01-10T10:00:00Z' },
  { id: 'u2', display_name: 'Ngozi Eze', email: 'ngozi@example.com', role: 'student', status: 'active', created_at: '2026-02-10T10:00:00Z' },
  { id: 'u3', display_name: 'Musa Bello', email: 'musa@example.com', role: 'university_admin', status: 'inactive', created_at: '2026-03-10T10:00:00Z' },
  { id: 'u4', display_name: 'Kemi Ade', email: 'kemi@example.com', role: 'admin', status: 'active', created_at: '2026-04-10T10:00:00Z' },
  { id: 'u5', display_name: null, email: 'lect@example.com', role: 'lecturer', status: null, created_at: '2026-05-10T10:00:00Z' },
];

export function userUtilsStub() {
  return {
    fetchUsers: async () => ({ users: USERS, count: USERS.length }),
    permanentlyDeleteUser: async () => ({}),
    getUserStats: async () => ({ enrolled: 3, certified: 1 }),
    updateUser: async (id, updates) => ({ ...USERS.find((u) => u.id === id), ...updates }),
  };
}

export function auditLoggerStub() {
  return {
    getAuditLogs: async () => ({
      count: 3,
      logs: [
        { id: 'a1', user_email: 'ada@example.com', action: 'ROLE_CHANGE', resource_type: 'USER', description: 'Role changed to lecturer', status: 'success', timestamp: '2026-09-27T10:00:00Z', old_value: { role: 'learner' }, new_value: { role: 'lecturer' }, resource_id: 'u5' },
        { id: 'a2', user_email: 'kemi@example.com', action: 'DELETE', resource_type: 'COURSE', description: 'Draft removed', status: 'failure', error_message: 'permission denied', timestamp: '2026-09-26T10:00:00Z' },
        { id: 'a3', user_id: 'u2', action: 'LOGIN', resource_type: 'SYSTEM', description: 'Signed in', status: 'success', timestamp: '2026-09-25T10:00:00Z' },
      ],
    }),
  };
}

export function systemSettingsServiceStub() {
  const settings = [
    { id: 1, group_name: 'general', setting_key: 'site_name', setting_type: 'string', setting_value: 'Petrolord NextGen', description: 'Shown in the title bar.' },
    { id: 2, group_name: 'general', setting_key: 'maintenance_mode', setting_type: 'boolean', setting_value: 'false', description: 'Blocks learner sign in.' },
    { id: 3, group_name: 'license', setting_key: 'grace_period_days', setting_type: 'number', setting_value: '14', description: 'Days after expiry.' },
    { id: 4, group_name: 'email', setting_key: 'smtp_host', setting_type: 'string', setting_value: 'smtp.example.com', description: 'Mail relay.' },
    { id: 5, group_name: 'security', setting_key: 'session_timeout_minutes', setting_type: 'number', setting_value: '60', description: 'Idle timeout.' },
  ];
  const features = [
    { id: 1, feature_key: 'residency_door', is_enabled: true, description: 'Residency applications.' },
    { id: 2, feature_key: 'ai_tutor', is_enabled: false, description: 'Tutor preview.' },
  ];
  return {
    SystemSettingsService: {
      getAllSettings: async () => settings,
      getAllFeatures: async () => features,
      updateSetting: async () => ({}),
      toggleFeature: async () => ({}),
      triggerBackup: async () => ({}),
      clearCache: async () => ({}),
    },
  };
}

export const useSystemSettingsStub = () => ({ useSystemSettings: () => ({ refresh: () => {} }) });

/**
 * A local fake of the Supabase client. It answers the super admin list
 * (profiles, role = super_admin) and the user detail module read, and throws
 * on anything else, so a screen that starts a new request fails the test.
 */
export function supabaseFake() {
  const superAdmins = [
    { id: USER_ID, display_name: 'Ada Obi', email: 'ada@example.com', status: 'active' },
    { id: OTHER_ID, display_name: null, email: 'kemi@example.com', status: 'active' },
  ];
  const query = (table) => {
    if (table !== 'profiles') throw new Error(`Supabase is faked in the 2B theme tests: no table ${table}`);
    const q = { single: false, filters: {} };
    const builder = {
      select: () => builder,
      eq: (col, val) => { q.filters[col] = val; return builder; },
      neq: () => builder,
      single: () => { q.single = true; return builder; },
      then: (resolve) => resolve(q.single
        ? { data: { modules: { name: 'Geoscience' } }, error: null }
        : { data: q.filters.role === 'super_admin' ? superAdmins : [], error: null }),
    };
    return builder;
  };
  const blocked = (what) => () => { throw new Error(`Supabase is faked in the 2B theme tests: ${what}`); };
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
