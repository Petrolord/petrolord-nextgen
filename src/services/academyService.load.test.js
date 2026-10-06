// Dashboard load (2026-10-05): one /dashboard visit read the course catalog
// three times (the home, the sidebar, and again after the certificates
// came back, to name them) and the activation status twice (the banner and
// the home). Over a slow link every extra read is a preflight plus a round
// trip. Concurrent asks now share one read, the catalog is kept for a
// minute, and certificate names come from that same catalog.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const counts = { academy_apps: 0, academy_certifications: 0, rpc: {} };
const APPS = [
  { slug: 'petrophysics', name: 'Petrophysics', course_type: 'deep', status: 'available', path_order: 1 },
  { slug: 'dca', name: 'Decline Curve Analysis', course_type: 'deep', status: 'available', path_order: 2 },
];

vi.mock('@/lib/customSupabaseClient', () => {
  const query = (table) => {
    const q = {
      select: () => q, order: () => q, in: () => q, eq: () => q,
      then: (resolve, reject) => {
        counts[table] = (counts[table] || 0) + 1;
        const data = table === 'academy_apps' ? APPS
          : table === 'academy_certifications' ? [{ id: 'c1', app_slug: 'dca', tier: 'beginner' }] : [];
        return new Promise((r) => setTimeout(r, 5)).then(() => ({ data, error: null })).then(resolve, reject);
      },
    };
    return q;
  };
  return {
    supabase: {
      from: query,
      rpc: async (name) => {
        counts.rpc[name] = (counts.rpc[name] || 0) + 1;
        await new Promise((r) => setTimeout(r, 5));
        return { data: { activated: true }, error: null };
      },
    },
  };
});

const svc = await import('@/services/academyService');

beforeEach(() => {
  counts.academy_apps = 0; counts.academy_certifications = 0; counts.rpc = {};
  svc.__resetAcademyCaches();
});

describe('academy reads on the dashboard', () => {
  it('concurrent and repeat catalog reads share one request', async () => {
    const [a, b] = await Promise.all([svc.listAcademyApps(), svc.listAcademyApps()]);
    await svc.listAcademyApps();
    expect(a).toEqual(APPS);
    expect(b).toEqual(APPS);
    expect(counts.academy_apps).toBe(1);
  });

  it('certificate names come from the shared catalog, not a second read', async () => {
    const [, certs] = await Promise.all([svc.listAcademyApps(), svc.listMyCertifications()]);
    expect(certs[0].course_name).toBe('Decline Curve Analysis');
    expect(certs[0].course_type).toBe('deep');
    expect(counts.academy_apps).toBe(1);
  });

  it('concurrent activation checks share one call; a later check reads fresh', async () => {
    await Promise.all([svc.getActivationStatus(), svc.getActivationStatus()]);
    expect(counts.rpc.academy_activation_status).toBe(1);
    await svc.getActivationStatus();
    expect(counts.rpc.academy_activation_status).toBe(2);
  });

  it('a failed catalog read is not kept', async () => {
    const { supabase } = await import('@/lib/customSupabaseClient');
    const orig = supabase.from;
    supabase.from = () => ({ select() { return this; }, order() { return this; },
      then: (res) => Promise.resolve({ data: null, error: new Error('offline') }).then(res) });
    await expect(svc.listAcademyApps()).rejects.toThrow('offline');
    supabase.from = orig;
    await expect(svc.listAcademyApps()).resolves.toEqual(APPS);
  });
});
