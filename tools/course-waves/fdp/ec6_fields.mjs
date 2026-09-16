// THE EC6 TEACHING FIELDS. One development plan (EGINA) and one project
// schedule (ODUDU-2), designed for this wave. The CAPSTONE runs different
// conditions entirely: nothing here is imported by the capstone generator and
// no name, capex, rate, date, cost line or task is shared with it.
//
// Money: $MM for the plan, whole USD for well costs and task costs.

export const EGINA_RESERVOIRS = [
  { id: 'eg-1', name: 'Egina Main', fluid: 'Oil', p90: 60, p50: 95, p10: 145, rf: 0.34 },
  { id: 'eg-2', name: 'Egina Deep', fluid: 'Oil', p90: 20, p50: 35, p10: 60, rf: 0.28 },
  { id: 'eg-3', name: 'Egina Gas Cap', fluid: 'Gas', p90: 40, p50: 70, p10: 110, rf: 0.65 },
];

export const EGINA_CONCEPTS = [
  {
    id: 101,
    name: 'FPSO development',
    facilityType: 'FPSO',
    drillingCapex: 520,
    facilitiesCapex: 1350,
    subseaCapex: 380,
    opex: 95,
    lifeOfField: 20,
    peakProduction: 60,
    startDate: '2027-04-01',
    driveMechanism: 'Water Injection',
  },
  {
    id: 102,
    name: 'Subsea tie-back',
    facilityType: 'Subsea Tie-back',
    drillingCapex: 240,
    facilitiesCapex: 180,
    subseaCapex: 310,
    opex: 40,
    lifeOfField: 15,
    peakProduction: 25,
    startDate: '2027-04-01',
    driveMechanism: 'Natural Depletion',
  },
];

export const EGINA_SCENARIOS = [
  { id: 201, name: 'Base', type: 'Base', conceptId: 101, oilPrice: 70, discountRate: 10 },
  { id: 202, name: 'Low price', type: 'Low', conceptId: 101, oilPrice: 48, discountRate: 10 },
  { id: 203, name: 'High price', type: 'High', conceptId: 101, oilPrice: 92, discountRate: 10 },
  { id: 204, name: 'Stress', type: 'Stress', conceptId: 101, oilPrice: 18, discountRate: 10 },
  { id: 205, name: 'Tie-back base', type: 'Base', conceptId: 102, oilPrice: 70, discountRate: 10 },
];

// The plan's own cost items. CAPEX sums to 2250 (the FPSO concept's capex),
// OPEX to 95 a year; the ABEX line is not in the screening case.
export const EGINA_COSTS = [
  { id: 'c1', name: 'Development drilling', category: 'Drilling', type: 'CAPEX', amount: 520, phase: 'Execution' },
  { id: 'c2', name: 'FPSO hull and topsides', category: 'Fabrication', type: 'CAPEX', amount: 1180, phase: 'Construction' },
  { id: 'c3', name: 'Mooring and installation', category: 'Installation', type: 'CAPEX', amount: 170, phase: 'Installation' },
  { id: 'c4', name: 'Subsea system', category: 'Installation', type: 'CAPEX', amount: 380, phase: 'Installation' },
  { id: 'c5', name: 'Operations and logistics', category: 'Operations', type: 'OPEX', amount: 72, phase: 'Operate' },
  { id: 'c6', name: 'Maintenance and integrity', category: 'Operations', type: 'OPEX', amount: 23, phase: 'Operate' },
  { id: 'c7', name: 'Decommissioning provision', category: 'Abandonment', type: 'ABEX', amount: 260, phase: 'Operate' },
];

// The schedule network. Finish to start; every activity carries its own id,
// duration in days and the ids that must finish first.
export const EGINA_SCHEDULE = [
  { id: 'a1', name: 'Project sanction', type: 'Milestone', duration: 0, dependencies: [], start: '2027-04-01', end: '2027-04-01' },
  { id: 'a2', name: 'Detailed engineering', type: 'Engineering', duration: 210, dependencies: ['a1'], start: '2027-04-02', end: '2027-10-28' },
  { id: 'a3', name: 'Long lead procurement', type: 'Procurement', duration: 300, dependencies: ['a1'], start: '2027-04-02', end: '2028-01-26' },
  { id: 'a4', name: 'Hull conversion', type: 'Fabrication', duration: 420, dependencies: ['a3'], start: '2028-01-27', end: '2029-03-22' },
  { id: 'a5', name: 'Topsides fabrication', type: 'Fabrication', duration: 330, dependencies: ['a2'], start: '2027-10-29', end: '2028-09-23' },
  { id: 'a6', name: 'Subsea installation', type: 'Installation', duration: 180, dependencies: ['a2'], start: '2027-10-29', end: '2028-04-26' },
  { id: 'a7', name: 'Integration and commissioning', type: 'Commissioning', duration: 150, dependencies: ['a4', 'a5'], start: '2029-03-23', end: '2029-08-20' },
  // First oil is dated two months later than the network needs, which is the
  // calendar float the plan is carrying.
  { id: 'a8', name: 'First oil', type: 'Milestone', duration: 0, dependencies: ['a6', 'a7'], start: '2029-10-20', end: '2029-10-20' },
];

export const EGINA_WELLS = [
  { id: 'w1', name: 'EG-01', type: 'Producer', trajectory: 'Horizontal', md: 14200, tvd: 9800 },
  { id: 'w2', name: 'EG-02', type: 'Producer', trajectory: 'Deviated', md: 11600, tvd: 9400 },
  { id: 'w3', name: 'EG-03', type: 'Water Injector', trajectory: 'Deviated', md: 10800, tvd: 9200 },
  { id: 'w4', name: 'EG-04', type: 'Producer', trajectory: 'Vertical', md: 9400, tvd: 9400 },
];
export const EGINA_RIG_RATE = 310000;
export const EGINA_RIG_COUNTS = [1, 2, 3];

export const EGINA_FACILITIES = [
  { id: 'f1', name: 'Egina FPSO', type: 'FPSO', nameplateCapacity: 60000, designLife: 20 },
  { id: 'f2', name: 'Egina FPSO, debottlenecked', type: 'FPSO', nameplateCapacity: 150000, designLife: 20 },
  { id: 'f3', name: 'Deep tie-back', type: 'Subsea Tie-back', nameplateCapacity: 25000, designLife: 15 },
];
export const EGINA_FLUID = { type: 'oil', api: 31, gor: 640, viscosity: 1.4 };

// The risk register. One risk in each band, and one nobody has scored.
export const EGINA_RISKS = [
  { id: 'r1', name: 'Subsea tie-in slips', probability: 4, impact: 5, costImpact: 180, source: 'Schedule', mitigation: 'Early order of the tie-in spools' },
  { id: 'r2', name: 'Hull yard delay', probability: 3, impact: 4, costImpact: 240, source: 'Fabrication', mitigation: 'Second yard qualified' },
  { id: 'r3', name: 'Reservoir underperformance', probability: 2, impact: 4, costImpact: 300, source: 'Subsurface', mitigation: 'Appraisal well before sanction' },
  { id: 'r4', name: 'Logistics congestion', probability: 2, impact: 2, costImpact: 25, source: 'Operations', mitigation: 'Second supply base' },
  { id: 'r5', name: 'Host government approval', impact: 5, costImpact: 400, source: 'Regulatory', mitigation: 'Early engagement' },
];

// ODUDU-2, the project schedule the earned value is measured on. Costs in
// whole USD, windows on the calendar, read at stated as-of dates.
export const ODUDU_TASKS = [
  { name: 'Front end engineering', planned_cost: 2400000, actual_cost: 2510000, percent_complete: 100, planned_start_date: '2028-01-10', planned_end_date: '2028-06-30' },
  { name: 'Detailed design', planned_cost: 5200000, actual_cost: 3180000, percent_complete: 65, planned_start_date: '2028-05-01', planned_end_date: '2029-02-28' },
  { name: 'Procurement', planned_cost: 8600000, actual_cost: 2450000, percent_complete: 30, planned_start_date: '2028-08-01', planned_end_date: '2029-07-31' },
  { name: 'Fabrication', planned_cost: 12500000, actual_cost: 0, percent_complete: 0, planned_start_date: '2029-03-01', planned_end_date: '2030-04-30' },
  { name: 'Commissioning', planned_cost: 3300000, actual_cost: 0, percent_complete: 0, planned_start_date: '2030-05-01', planned_end_date: '2030-10-31' },
];
export const ODUDU_AS_OF = ['2028-01-01', '2028-06-30', '2028-12-31', '2029-06-30', '2031-01-01'];
