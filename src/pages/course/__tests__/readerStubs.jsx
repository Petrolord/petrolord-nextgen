// TEST-ONLY stand-ins for the course reader and handbook theme tests
// (batch 1C), used from vi.mock factories (so this file imports nothing
// from the app).
//
// Batch 1B is making the course kit (LockedCard, QuizRunner, the practice
// course pieces and panelKit) scope-aware in parallel. Until it lands those
// pieces still render their legacy classes, so the reader tests replace
// them with the role-only stand-ins below and test the reader's own
// classes; 1B's tests cover the kit. Once 1B is merged the stand-ins can go.
import React from 'react';

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

// Role-only stand-ins for the 1B course kit.
export const StubLockedCard = ({ title, note }) => (
  <div data-testid="locked-card" className="rounded-lg border border-pl-border bg-pl-surface p-6 text-pl-text">
    <p>{title}</p>{note && <p className="text-pl-muted">{note}</p>}
  </div>
);
export const StubQuizRunner = ({ title, description }) => (
  <div data-testid="quiz-runner" className="rounded-lg border border-pl-border bg-pl-surface p-6">
    <h2 className="text-pl-text">{title}</h2><p className="text-pl-muted">{description}</p>
  </div>
);
export const StubNothing = () => null;
export const StubPanelShell = ({ title, subtitle, children }) => (
  <div className="rounded-lg border border-pl-border bg-pl-surface p-4 space-y-4">
    <p className="text-pl-text font-semibold">{title}</p>
    {subtitle && <p className="text-xs text-pl-muted">{subtitle}</p>}
    {children}
  </div>
);
export const stubPanelKit = () => {
  const Field = ({ label, value, onChange, options }) => (
    <label className="text-pl-muted text-xs">
      {label}
      {options ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-pl-surface text-pl-text border border-pl-border-strong">
          {options.map((o) => {
            const [v, l] = Array.isArray(o) ? o : [o.value, o.label];
            return <option key={v} value={v}>{l ?? v}</option>;
          })}
        </select>
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="bg-pl-surface text-pl-text border border-pl-border-strong" />
      )}
    </label>
  );
  const Box = ({ children }) => <div className="grid gap-3">{children}</div>;
  return {
    PanelShell: StubPanelShell,
    NumField: Field,
    SelectField: Field,
    Tile: ({ label, value, unit }) => <div className="rounded-md border border-pl-border bg-pl-raised p-3"><p className="text-pl-muted">{label}</p><p className="text-pl-text">{value} {unit}</p></div>,
    TileGrid: Box,
    FieldGrid: Box,
    Note: ({ children }) => <p className="text-xs text-pl-muted">{children}</p>,
  };
};
