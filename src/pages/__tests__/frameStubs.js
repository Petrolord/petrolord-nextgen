// TEST-ONLY. Stubs for the batch 1A theme tests, kept free of app imports
// so the vi.mock factories that load them never import a mocked module
// (which would deadlock the factory).

export const USER_ID = 'frame-1a-user';

export const CATALOG = [
  { slug: 'petrophysics', name: 'Petrophysics', module: 'geoscience', status: 'available', path_order: 1 },
  { slug: 'welldata', name: 'Well Data', module: 'geoscience', status: 'coming_soon', path_order: 2 },
  { slug: 'dca', name: 'Decline Curve Analysis', module: 'reservoir', status: 'available', path_order: 11 },
];

/** Every service the frame and the screens call, as plain async stubs. */
export function academyServiceStub({ limitReached = false } = {}) {
  return {
    listAcademyApps: async () => CATALOG,
    listMyEnrollments: async () => [],
    listMyCertifications: async () => [],
    getActivationStatus: async () => ({ activated: true, orientation_completed: true }),
    mySponsorPools: async () => [],
    getDeviceId: () => 'device-this',
    revokeDevice: async () => ({}),
    registerDevice: async () => (limitReached
      ? {
        status: 'limit_reached',
        limit: 2,
        devices: [
          { device_id: 'd1', label: 'Office laptop', last_seen: '2026-09-20T10:00:00Z' },
          { device_id: 'd2', label: null, last_seen: '2026-09-21T10:00:00Z' },
        ],
      }
      : { status: 'ok' }),
  };
}

/** A client that fails loudly: nothing in these tests may touch Supabase. */
export function supabaseStub() {
  const blocked = () => { throw new Error('Supabase is stubbed in the 1A theme tests'); };
  const handler = { get: (_t, key) => (key === 'then' ? undefined : new Proxy(blocked, handler)), apply: blocked };
  return { supabase: new Proxy(blocked, handler), default: new Proxy(blocked, handler) };
}

export const notificationStub = () => ({
  NotificationProvider: ({ children }) => children,
  useNotifications: () => ({ notifications: [], unreadCount: 0, markAllAsRead: () => {}, markAsRead: () => {} }),
});

