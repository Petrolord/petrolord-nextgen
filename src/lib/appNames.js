// Canonical display names for the academy's course apps (mirrors
// academy_apps.name). Kept static so anon pages (certificate
// verification) need no catalog round-trip; update alongside any new
// academy_apps row.
export const APP_NAMES = {
  welldata: 'Well Data Manager',
  petrophysics: 'Petrophysics',
  wellcorrelation: 'Well Correlation',
  seismolord: 'Seismolord',
  mapping: 'Mapping',
  reservoircalc: 'ReservoirCalc Pro',
  rockphysics: 'Rock Physics',
  porepressure: 'Pore Pressure',
  earthmodel: 'Earth Modeling',
  basin: 'Basin & Charge',
};

export const CERT_TIER_LABELS = {
  associate: 'Associate',
  professional: 'Professional',
  expert: 'Expert',
};

export function appName(slug) {
  return APP_NAMES[slug] || slug;
}
