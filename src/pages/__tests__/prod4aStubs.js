// TEST-ONLY. Batch 4A: the academyService calls the production I learning
// pages (nodal, gas lift, ESP) make, on top of the 1A frame stubs. Plain data,
// no app imports, so a vi.mock factory may load it. globalThis.__prod4a steers
// the scenes (the Learning Mode gate, the capstone result).
export const PROD4A_APPS = [
  { slug: 'nodal', title: 'Nodal Analysis and Well Performance' },
  { slug: 'gaslift', title: 'Gas Lift Design' },
  { slug: 'esp', title: 'ESP Design' },
];

const state = () => globalThis.__prod4a || {};

export function prod4aServiceExtras() {
  return {
    hasScope: async () => state().allowed !== false,
    getQuota: async () => ({ export_watermark: true, own_data_upload: false }),
    getCapstone: async (app, tier) => ({
      title: `${app} ${tier} capstone`,
      prompt: 'Work the brief in the panels and type each figure.',
      fields: [
        { key: 'a', label: 'First figure', unit: 'stb/d' },
        { key: 'b', label: 'Second figure', unit: 'psia' },
      ],
    }),
    getCourseProgress: async () => ({ capstone: { unlocked: true, passed: false } }),
    submitCapstone: async (app, tier) => (state().pass === false
      ? { passed: false, score: 1, max_score: 2, tier: 'associate' }
      : { passed: true, score: 2, max_score: 2, tier: tier === 'advanced' ? 'expert' : 'associate', certificate_number: 'NG-4A-0001', verify_code: 'v4a' }),
    verificationUrl: (code) => `https://example.test/verify/${code}`,
  };
}
