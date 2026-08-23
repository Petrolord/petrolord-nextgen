import React from 'react';

// Registry of interactive teaching panels that lesson markdown can embed
// with a {{panel:<id>}} marker line. Components are lazy so a panel's
// engine code loads only when a lesson that uses it is opened.
//
// The content lint (courseContent.test.js) enforces that every panel id
// referenced by a manifest or a {{panel:...}} marker resolves here.
export const PANELS = {
  'petro-porosity-lab': React.lazy(() => import('@/components/course/panels/petrophysics/PorosityLab')),
  'petro-pickett-explorer': React.lazy(() => import('@/components/course/panels/petrophysics/PickettExplorer')),
  'petro-shaly-sw-lab': React.lazy(() => import('@/components/course/panels/petrophysics/ShalySwLab')),
  'petro-rw-triangulator': React.lazy(() => import('@/components/course/panels/petrophysics/RwTriangulator')),
  'wd-las-inspector': React.lazy(() => import('@/components/course/panels/welldata/LasInspector')),
  'wc-section-explorer': React.lazy(() => import('@/components/course/panels/wellcorrelation/SectionExplorer')),
};

export function resolvePanel(id) {
  return PANELS[id] || null;
}

export function panelIds() {
  return Object.keys(PANELS);
}
