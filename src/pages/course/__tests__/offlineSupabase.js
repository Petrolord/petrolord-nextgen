// TEST-ONLY stand-in for the course reader and handbook theme tests (batch
// 1C), used from vi.mock factories (so this file imports nothing from the
// app).

// An offline Supabase client: every call resolves empty and nothing leaves
// the test process.
export function offlineSupabase() {
  const result = { data: null, error: null, count: 0 };
  const chain = new Proxy(function chainFn() {}, {
    get: (_t, prop) => (prop === 'then' ? (res) => Promise.resolve(result).then(res) : chain),
    apply: () => chain,
  });
  const auth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signOut: async () => ({ error: null }),
  };
  return new Proxy({}, {
    get: (_t, prop) => {
      if (prop === 'auth') return auth;
      if (prop === 'channel') return () => ({ on() { return this; }, subscribe() { return this; }, unsubscribe() {} });
      if (prop === 'removeChannel') return () => {};
      return chain;
    },
  });
}
