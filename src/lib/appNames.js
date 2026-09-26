// Course titles for every academy course, keyed by academy_apps.slug.
//
// academy_apps.name is the single source of a course's title. Pages that
// have the live row (or a certificate/RPC that returns course_name) show
// that value; this map is the complete static fallback for pages that
// render before, or without, a catalog read (the anon verification page,
// printable certificates, admin tools). appNames.test.js fails when any
// slug seeded in migrations/ is missing here or carries a different
// latest name, so add a row alongside any new academy_apps row.
//
// A raw slug is never shown to a user: courseName() falls back to the
// slug's words in title case as a last resort.
export const APP_NAMES = {
  welldata: 'Well Data Management',
  petrophysics: 'Petrophysics',
  wellcorrelation: 'Well Correlation',
  seismolord: 'Seismic Interpretation',
  mapping: 'Subsurface Mapping',
  reservoircalc: 'Reservoir Volumetrics',
  earthmodel: 'Earth Modeling',
  basin: 'Basin & Charge',
  rockphysics: 'Rock Physics',
  porepressure: 'Pore Pressure',
  dca: 'Decline Curve Analysis',
  mbal: 'Material Balance',
  scal: 'SCAL & Displacement',
  waterflood: 'Waterflood Management',
  sim: 'Reservoir Simulation Essentials',
  fluid: 'Fluid Properties & PVT',
  welldesign: 'Well Design & Surveys',
  torquedrag: 'Torque, Drag & Casing Wear',
  hydraulics: 'Drilling Hydraulics',
  wellcontrol: 'Well Control',
  geomech: 'Geomechanics and Wellbore Stability',
  casingtubing: 'Casing and Tubing Design',
  cementing: 'Cementing',
  completion: 'Completion Design',
  welltest: 'Well Test Analysis',
  stimulation: 'Stimulation Design',
  perfsand: 'Perforation & Sand Control',
  integrity: 'Well Integrity & P&A',
  wellcost: 'Well Cost & Time',
  nodal: 'Nodal Analysis & Well Performance',
  gaslift: 'Gas Lift Design',
  esp: 'ESP Design',
  rodpump: 'Rod Pump Design',
  gaswell: 'Gas Well Performance',
  flowassurance: 'Flow Assurance',
  network: 'Production Networks',
  intervention: 'Well Intervention',
  surveillance: 'Production Surveillance',
  cashflow: 'Cash Flow & NPV',
  fiscal: 'Fiscal Regime Design',
  uncertainty: 'Probabilistic Economics',
  decision: 'Decision Analysis & Value of Information',
  portfolio: 'Capital Portfolio & Cost Control',
  fdp: 'Field Development Planning',
  pia: 'Petroleum Industry Act 2021 & Nigerian Fiscal Terms',
  gsa: 'Gas Commercialisation & Gas Sales Agreements',
  separation: 'Separation & Slug Catching',
  linesizing: 'Pipeline & Line Sizing',
  rotating: 'Rotating Equipment',
  gasprocessing: 'Gas Processing',
  relief: 'Relief & Flare Systems',
  heattransfer: 'Heat Exchange & Cooling',
  producedwater: 'Produced Water Treatment',
  metering: 'Metering, Control Valves & Storage',
  corrosion: 'Corrosion & Integrity',
  riskchange: 'Risk, Change & Learning',
  compliance: 'Compliance, Audit & Quality',
  safetystats: 'Safety Performance Statistics & KPIs',
  hygiene: 'Occupational Hygiene: Noise, Chemical & Heat Exposure',
  lopa: 'Process Safety: LOPA & SIL Determination',
  consequence: 'Consequence Modelling',
  qra: 'Quantitative Risk Assessment',
  crude: 'Crude Assay & Blending',
  refinery: 'Refinery Feasibility & Planning',
  supply: 'Terminals, Depots & Fuel Supply',
  procurement: 'Procurement, Tendering & Contracting',
  gasvalue: 'Flare Gas to Value & LPG/CNG',
  carbon: 'Carbon & Energy Efficiency',
  dataqc: 'Oilfield Data Quality',
  mlcore: 'Machine Learning on Well Data',
  facies: 'Electrofacies Classification',
  forecastml: 'Data-Driven Production Forecasting',
  appliedai: 'Applied AI and Language Models',
};

export const CERT_TIER_LABELS = {
  associate: 'Associate',
  professional: 'Professional',
  expert: 'Expert',
};

// Last-resort display form of an unknown slug: words split on '_' / '-'
// and title-cased, so a catalog gap never prints a bare slug.
export function titleCaseSlug(slug) {
  const s = String(slug ?? '').trim();
  if (!s) return 'Course';
  return s
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// The course title for a slug. `liveName` (academy_apps.name read from the
// database, or course_name returned by an RPC) wins when present.
export function courseName(slug, liveName) {
  if (typeof liveName === 'string' && liveName.trim()) return liveName.trim();
  return APP_NAMES[slug] || titleCaseSlug(slug);
}

// Kept for existing callers: the static title for a slug.
export function appName(slug) {
  return courseName(slug);
}

// Title lookup over a loaded academy_apps list, falling back to the map.
export function courseNameFrom(apps, slug) {
  const row = Array.isArray(apps) ? apps.find((a) => a?.slug === slug) : null;
  return courseName(slug, row?.name);
}

// Formal, unambiguous certificate date: "26 September 2026", in UTC so a
// certificate reads the same wherever it is opened or printed.
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
export function formalDate(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// The name printed on a certificate: the learner's display name, trimmed.
// A certificate never falls back to an email address, so an empty name, or
// one that is itself an email address, returns null and the page asks the
// learner to set a display name in their profile.
export function certificateHolder(displayName) {
  const n = typeof displayName === 'string' ? displayName.trim() : '';
  if (!n || n.includes('@')) return null;
  return n;
}
