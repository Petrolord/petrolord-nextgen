// TEST-ONLY. The Supabase stand-in for the batch 6B public and auth tests,
// kept free of app imports so the vi.mock factory that loads it never
// imports a mocked module. Only the calls the public and auth pages make are
// answered (through the handlers object the test owns); anything else
// throws, so a new call cannot reach the real project unnoticed.

/** A fresh handlers object: the test replaces the entries it cares about. */
export function freshHandlers() {
  return {
    session: null,
    profile: null,
    signInWithPassword: async () => ({ data: {}, error: null }),
    signUp: async () => ({ data: { user: { id: 'new' }, session: null }, error: null }),
    resetPasswordForEmail: async () => ({ data: {}, error: null }),
    updateUser: async () => ({ data: {}, error: null }),
    rpc: async () => ({ data: null, error: null }),
    invoke: async () => ({ data: null, error: null }),
  };
}

/** The mocked '@/lib/customSupabaseClient' module, reading `h` at call time. */
export function publicAuthSupabase(h) {
  const profiles = {
    select: () => profiles,
    eq: () => profiles,
    single: async () => ({ data: h.profile, error: null }),
  };
  const supabase = {
    auth: {
      getSession: async () => ({ data: { session: h.session }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: (...args) => h.signInWithPassword(...args),
      signUp: (...args) => h.signUp(...args),
      resetPasswordForEmail: (...args) => h.resetPasswordForEmail(...args),
      updateUser: (...args) => h.updateUser(...args),
      signOut: async () => ({ error: null }),
    },
    from: (table) => {
      if (table !== 'profiles') throw new Error(`Supabase table ${table} is not stubbed in the 6B tests`);
      return profiles;
    },
    rpc: (...args) => h.rpc(...args),
    functions: { invoke: (...args) => h.invoke(...args) },
  };
  return { supabase, customSupabaseClient: supabase, default: supabase };
}
