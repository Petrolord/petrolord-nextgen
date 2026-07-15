// Module taxonomy for the academy catalog (academy_apps.module).
// Keys are the slugs stored in academy_apps.module; labels match the
// homepage Modules grid. Courses appear under their module as they come
// online; unknown slugs fall back to a capitalised form so a new module
// never renders blank.
export const MODULE_LABELS = {
  geoscience: 'Geoscience',
  reservoir: 'Reservoir',
  drilling: 'Drilling',
  production: 'Production',
  economics: 'Economics',
  facilities: 'Facilities',
  assurance: 'Assurance',
  hse: 'HSE',
  energy_transition: 'Energy Transition',
  commercial_trading: 'Commercial & Trading',
  supply_chain: 'Supply Chain & Logistics',
  data_ai: 'Data & AI',
};

export function moduleLabel(slug) {
  if (!slug) return 'General';
  return (
    MODULE_LABELS[slug] ||
    slug.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
