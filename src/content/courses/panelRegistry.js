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
  'wd-import-explorer': React.lazy(() => import('@/components/course/panels/welldata/ImportExplorer')),
  'wd-campaign-explorer': React.lazy(() => import('@/components/course/panels/welldata/CampaignExplorer')),
  'wc-section-explorer': React.lazy(() => import('@/components/course/panels/wellcorrelation/SectionExplorer')),
  'wc-flatten-explorer': React.lazy(() => import('@/components/course/panels/wellcorrelation/FlattenExplorer')),
  'wc-prediction-explorer': React.lazy(() => import('@/components/course/panels/wellcorrelation/PredictionExplorer')),
  'sl-synthetic-explorer': React.lazy(() => import('@/components/course/panels/seismolord/SyntheticExplorer')),
  'sl-shift-explorer': React.lazy(() => import('@/components/course/panels/seismolord/ShiftExplorer')),
  'sl-wedge-explorer': React.lazy(() => import('@/components/course/panels/seismolord/WedgeExplorer')),
  'rc-volume-explorer': React.lazy(() => import('@/components/course/panels/reservoircalc/VolumeExplorer')),
  'rc-block-explorer': React.lazy(() => import('@/components/course/panels/reservoircalc/BlockExplorer')),
  'rc-property-explorer': React.lazy(() => import('@/components/course/panels/reservoircalc/PropertyExplorer')),
  'rp-fluid-explorer': React.lazy(() => import('@/components/course/panels/rockphysics/FluidExplorer')),
  'rp-substitution-explorer': React.lazy(() => import('@/components/course/panels/rockphysics/SubstitutionExplorer')),
  'rp-avo-explorer': React.lazy(() => import('@/components/course/panels/rockphysics/AvoExplorer')),
  'pp-frame-explorer': React.lazy(() => import('@/components/course/panels/porepressure/FrameExplorer')),
  'pp-eaton-explorer': React.lazy(() => import('@/components/course/panels/porepressure/EatonExplorer')),
  'pp-window-explorer': React.lazy(() => import('@/components/course/panels/porepressure/WindowExplorer')),
  'em-framework-explorer': React.lazy(() => import('@/components/course/panels/earthmodel/FrameworkExplorer')),
  'bs-burial-heat-explorer': React.lazy(() => import('@/components/course/panels/basin/BurialHeatExplorer')),
  'mp-map-explorer': React.lazy(() => import('@/components/course/panels/mapping/MapExplorer')),
  'mp-isochore-explorer': React.lazy(() => import('@/components/course/panels/mapping/IsochoreExplorer')),
  'mp-validation-explorer': React.lazy(() => import('@/components/course/panels/mapping/ValidationExplorer')),
};

export function resolvePanel(id) {
  return PANELS[id] || null;
}

export function panelIds() {
  return Object.keys(PANELS);
}
