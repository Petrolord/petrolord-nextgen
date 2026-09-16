// THE EC6 CAPSTONE CONDITIONS. UKOT and MEREN-3. Nothing here is imported by
// ec6_dump.mjs, and no name, capex, rate, date, activity, well, risk or task
// is shared with the teaching digest. Only the migration headers and the
// go-live may read the values this prints.
export const UKOT_RESERVOIRS = [
  { id: 'uk-1', name: 'Ukot North', fluid: 'Oil', p90: 48, p50: 82, p10: 130, rf: 0.31 },
  { id: 'uk-2', name: 'Ukot South', fluid: 'Oil', p90: 17, p50: 29, p10: 47, rf: 0.26 },
  { id: 'uk-3', name: 'Ukot Shallow Gas', fluid: 'Gas', p90: 26, p50: 46, p10: 73, rf: 0.61 },
  { id: 'uk-4', name: 'Ukot Deep Gas', fluid: 'Gas', p90: 15, p50: 28, p10: 45, rf: 0.58 },
];
export const UKOT_CONCEPT = {
  id: 301, name: 'Wellhead platform', facilityType: 'Platform',
  drillingCapex: 410, facilitiesCapex: 760, subseaCapex: 150,
  opex: 68, lifeOfField: 18, peakProduction: 44,
  startDate: '2028-06-01', driveMechanism: 'Water Injection',
};
export const UKOT_ALTERNATIVE = {
  id: 302, name: 'Extended tie-back', facilityType: 'Subsea Tie-back',
  drillingCapex: 190, facilitiesCapex: 120, subseaCapex: 260,
  opex: 33, lifeOfField: 14, peakProduction: 19,
  startDate: '2028-06-01', driveMechanism: 'Natural Depletion',
};
export const UKOT_BASE = { id: 401, name: 'Board case', type: 'Base', conceptId: 301, oilPrice: 68, discountRate: 10 };
export const UKOT_STRESS = { id: 402, name: 'Low case', type: 'Low', conceptId: 301, oilPrice: 22, discountRate: 10 };
export const UKOT_COSTS = [
  { id: 'k1', name: 'Development wells', type: 'CAPEX', amount: 410, phase: 'Execution' },
  { id: 'k2', name: 'Platform jacket and topsides', type: 'CAPEX', amount: 760, phase: 'Construction' },
  { id: 'k3', name: 'Flowlines and umbilicals', type: 'CAPEX', amount: 150, phase: 'Installation' },
  { id: 'k4', name: 'Operations', type: 'OPEX', amount: 44, phase: 'Operate' },
  { id: 'k5', name: 'Integrity and inspection', type: 'OPEX', amount: 24, phase: 'Operate' },
  { id: 'k6', name: 'Abandonment provision', type: 'ABEX', amount: 190, phase: 'Operate' },
];
export const UKOT_SCHEDULE = [
  { id: 'u1', name: 'Sanction', type: 'Milestone', duration: 0, dependencies: [], start: '2028-06-01', end: '2028-06-01' },
  { id: 'u2', name: 'Jacket fabrication', type: 'Fabrication', duration: 260, dependencies: ['u1'], start: '2028-06-02', end: '2029-02-16' },
  { id: 'u3', name: 'Topsides fabrication', type: 'Fabrication', duration: 380, dependencies: ['u1'], start: '2028-06-02', end: '2029-06-16' },
  { id: 'u4', name: 'Flowline procurement', type: 'Procurement', duration: 190, dependencies: ['u1'], start: '2028-06-02', end: '2028-12-08' },
  { id: 'u5', name: 'Offshore installation', type: 'Installation', duration: 120, dependencies: ['u2', 'u3'], start: '2029-06-17', end: '2029-10-14' },
  { id: 'u6', name: 'Hook up and commissioning', type: 'Commissioning', duration: 171, dependencies: ['u5'], start: '2029-10-15', end: '2030-04-03' },
  { id: 'u7', name: 'First production', type: 'Milestone', duration: 0, dependencies: ['u4', 'u6'], start: '2030-07-05', end: '2030-07-05' },
];
export const UKOT_WELLS = [
  { id: 'k-w1', name: 'UK-01', type: 'Producer', trajectory: 'Horizontal', md: 13100 },
  { id: 'k-w2', name: 'UK-02', type: 'Producer', trajectory: 'Deviated', md: 10400 },
  { id: 'k-w3', name: 'UK-03', type: 'Water Injector', trajectory: 'Vertical', md: 8700 },
];
export const UKOT_RIG_RATE = 265000;
export const UKOT_FACILITIES = [
  { id: 'k-f1', name: 'Ukot platform', type: 'Platform', nameplateCapacity: 45000, designLife: 18 },
  { id: 'k-f2', name: 'Ukot platform, expanded', type: 'Platform', nameplateCapacity: 110000, designLife: 18 },
];
export const UKOT_RISKS = [
  { id: 'k-r1', name: 'Jacket delivery slips', probability: 3, impact: 5, costImpact: 150, source: 'Fabrication', mitigation: 'Penalty clause and a second slot' },
  { id: 'k-r2', name: 'Weather window missed', probability: 4, impact: 4, costImpact: 210, source: 'Installation', mitigation: 'Early season campaign' },
  { id: 'k-r3', name: 'Injector underperforms', probability: 2, impact: 3, costImpact: 95, source: 'Subsurface', mitigation: 'Pilot injection test' },
  { id: 'k-r4', name: 'Permit renewal', probability: 1, impact: 4, costImpact: 60, source: 'Regulatory', mitigation: 'File twelve months early' },
];
export const MEREN_TASKS = [
  { name: 'Concept select', planned_cost: 1800000, actual_cost: 1950000, percent_complete: 100, planned_start_date: '2029-02-01', planned_end_date: '2029-07-31' },
  { name: 'Define and FEED', planned_cost: 4600000, actual_cost: 2860000, percent_complete: 70, planned_start_date: '2029-06-01', planned_end_date: '2030-05-31' },
  { name: 'Equipment orders', planned_cost: 7300000, actual_cost: 1180000, percent_complete: 20, planned_start_date: '2029-11-01', planned_end_date: '2030-12-31' },
  { name: 'Site construction', planned_cost: 9900000, actual_cost: 0, percent_complete: 0, planned_start_date: '2030-07-01', planned_end_date: '2031-09-30' },
];
export const MEREN_AS_OF = '2030-03-31';
