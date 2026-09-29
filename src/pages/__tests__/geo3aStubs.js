// TEST-ONLY. Batch 3A: the academyService calls the geoscience I learning
// pages make, on top of the 1A frame stubs. Plain data, no app imports, so a
// vi.mock factory may load it. globalThis.__geo3a steers the scenes (the
// Learning Mode gate, the capstone result).
export const GEO3A_APPS = [
  { slug: 'petrophysics', title: 'Petrophysics' },
  { slug: 'welldata', title: 'Well Data Management' },
  { slug: 'wellcorrelation', title: 'Well Correlation' },
  { slug: 'seismolord', title: 'Seismic Interpretation' },
  { slug: 'mapping', title: 'Subsurface Mapping' },
];

const state = () => globalThis.__geo3a || {};

export function geo3aServiceExtras() {
  return {
    hasScope: async () => state().allowed !== false,
    getQuota: async () => ({ export_watermark: true, own_data_upload: false }),
    getCapstone: async (app, tier) => ({
      title: `${app} ${tier} capstone`,
      prompt: 'Work the brief in the panels and type each figure.',
      fields: [
        { key: 'a', label: 'First figure', unit: 'm' },
        { key: 'b', label: 'Second figure', unit: 'v/v' },
      ],
    }),
    getCourseProgress: async () => ({ capstone: { unlocked: true, passed: false } }),
    submitCapstone: async (app, tier) => (state().pass === false
      ? { passed: false, score: 1, max_score: 2, tier: 'associate' }
      : { passed: true, score: 2, max_score: 2, tier: tier === 'advanced' ? 'expert' : 'associate', certificate_number: 'NG-3A-0001', verify_code: 'v3a' }),
    verificationUrl: (code) => `https://example.test/verify/${code}`,
  };
}
