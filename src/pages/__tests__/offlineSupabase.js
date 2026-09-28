// TEST-ONLY stand-in for the batch 2A theme tests (learner and account
// pages), used from vi.mock factories, so this file imports nothing from
// the app. An offline Supabase client: every query resolves empty and
// nothing leaves the test process. The tests also replace fetch with a
// counter that rejects, and assert it was never called.
export function offlineSupabase() {
  const result = { data: [], error: null, count: 0 };
  const chain = new Proxy(function chainFn() {}, {
    get: (_t, prop) => (prop === 'then' ? (res, rej) => Promise.resolve(result).then(res, rej) : chain),
    apply: () => chain,
  });
  const auth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signOut: async () => ({ error: null }),
    updateUser: async () => ({ data: {}, error: null }),
  };
  const channel = () => {
    const ch = { on() { return ch; }, subscribe() { return ch; }, unsubscribe() {} };
    return ch;
  };
  return new Proxy({}, {
    get: (_t, prop) => {
      if (prop === 'auth') return auth;
      if (prop === 'channel') return channel;
      if (prop === 'removeChannel' || prop === 'removeAllChannels') return () => {};
      if (prop === 'then') return undefined;
      return chain;
    },
  });
}

export const offlineSupabaseModule = () => {
  const client = offlineSupabase();
  return { default: client, customSupabaseClient: client, supabase: client };
};
