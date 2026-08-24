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
  'sl-synthetic-explorer': React.lazy(() => import('@/components/course/panels/seismolord/SyntheticExplorer')),
  'rc-volume-explorer': React.lazy(() => import('@/components/course/panels/reservoircalc/VolumeExplorer')),
  'rp-fluid-explorer': React.lazy(() => import('@/components/course/panels/rockphysics/FluidExplorer')),
  'pp-frame-explorer': React.lazy(() => import('@/components/course/panels/porepressure/FrameExplorer')),
  'em-framework-explorer': React.lazy(() => import('@/components/course/panels/earthmodel/FrameworkExplorer')),
  'bs-burial-heat-explorer': React.lazy(() => import('@/components/course/panels/basin/BurialHeatExplorer')),
  'mp-map-explorer': React.lazy(() => import('@/components/course/panels/mapping/MapExplorer')),
};

export function resolvePanel(id) {
  return PANELS[id] || null;
}

export function panelIds() {
  return Object.keys(PANELS);
}
