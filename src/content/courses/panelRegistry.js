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
  'em-tie-explorer': React.lazy(() => import('@/components/course/panels/earthmodel/TieExplorer')),
  'em-population-explorer': React.lazy(() => import('@/components/course/panels/earthmodel/PopulationExplorer')),
  'bs-burial-heat-explorer': React.lazy(() => import('@/components/course/panels/basin/BurialHeatExplorer')),
  'bs-kinetics-explorer': React.lazy(() => import('@/components/course/panels/basin/KineticsExplorer')),
  'bs-charge-explorer': React.lazy(() => import('@/components/course/panels/basin/ChargeExplorer')),
  'mp-map-explorer': React.lazy(() => import('@/components/course/panels/mapping/MapExplorer')),
  'mp-isochore-explorer': React.lazy(() => import('@/components/course/panels/mapping/IsochoreExplorer')),
  'mp-validation-explorer': React.lazy(() => import('@/components/course/panels/mapping/ValidationExplorer')),
  'dca-fit-explorer': React.lazy(() => import('@/components/course/panels/dca/FitExplorer')),
  'dca-typecurve-explorer': React.lazy(() => import('@/components/course/panels/dca/TypeCurveExplorer')),
  'dca-uncertainty-explorer': React.lazy(() => import('@/components/course/panels/dca/UncertaintyExplorer')),
  'mb-tank-explorer': React.lazy(() => import('@/components/course/panels/mbal/TankExplorer')),
  'mb-aquifer-explorer': React.lazy(() => import('@/components/course/panels/mbal/AquiferExplorer')),
  'mb-pd-explorer': React.lazy(() => import('@/components/course/panels/mbal/PdExplorer')),
  'sc-displacement-explorer': React.lazy(() => import('@/components/course/panels/scal/DisplacementExplorer')),
  'sc-jfunction-explorer': React.lazy(() => import('@/components/course/panels/scal/JFunctionExplorer')),
  'sc-design-explorer': React.lazy(() => import('@/components/course/panels/scal/DesignExplorer')),

  // RC4 Waterflood Management
  'wf-ledger-explorer': React.lazy(() => import('@/components/course/panels/waterflood/LedgerExplorer')),
  'wf-pattern-explorer': React.lazy(() => import('@/components/course/panels/waterflood/PatternExplorer')),
  'wf-design-explorer': React.lazy(() => import('@/components/course/panels/waterflood/DesignExplorer')),
  'sim-deck-explorer': React.lazy(() => import('@/components/course/panels/sim/DeckExplorer')),
  'sim-structure-explorer': React.lazy(() => import('@/components/course/panels/sim/StructureExplorer')),
  'sim-build-explorer': React.lazy(() => import('@/components/course/panels/sim/BuildExplorer')),
  'fluid-correlation-explorer': React.lazy(() => import('@/components/course/panels/fluid/CorrelationExplorer')),
  'fluid-study-explorer': React.lazy(() => import('@/components/course/panels/fluid/StudyExplorer')),
  'fluid-tuning-explorer': React.lazy(() => import('@/components/course/panels/fluid/TuningExplorer')),

  // RC7 Well Test Analysis
  'wt-buildup-explorer': React.lazy(() => import('@/components/course/panels/welltest/BuildupExplorer')),
  'wt-diagnostic-explorer': React.lazy(() => import('@/components/course/panels/welltest/DiagnosticExplorer')),
  'wt-regression-explorer': React.lazy(() => import('@/components/course/panels/welltest/RegressionExplorer')),

  // DR1 Well Design & Surveys
  'wd-survey-explorer': React.lazy(() => import('@/components/course/panels/welldesign/SurveyExplorer')),
  'wd-uncertainty-explorer': React.lazy(() => import('@/components/course/panels/welldesign/UncertaintyExplorer')),
  'wd-clearance-explorer': React.lazy(() => import('@/components/course/panels/welldesign/ClearanceExplorer')),
  'td-string-explorer': React.lazy(() => import('@/components/course/panels/torquedrag/StringExplorer')),
  'td-friction-explorer': React.lazy(() => import('@/components/course/panels/torquedrag/FrictionExplorer')),
  'td-buckling-explorer': React.lazy(() => import('@/components/course/panels/torquedrag/BucklingExplorer')),
  'hy-rheology-explorer': React.lazy(() => import('@/components/course/panels/hydraulics/RheologyExplorer')),
  'hy-cleaning-explorer': React.lazy(() => import('@/components/course/panels/hydraulics/CleaningExplorer')),
  'hy-surge-explorer': React.lazy(() => import('@/components/course/panels/hydraulics/SurgeExplorer')),
  'wc-volume-explorer': React.lazy(() => import('@/components/course/panels/wellcontrol/VolumeExplorer')),
  'wc-killsheet-explorer': React.lazy(() => import('@/components/course/panels/wellcontrol/KillSheetExplorer')),
  'wc-tolerance-explorer': React.lazy(() => import('@/components/course/panels/wellcontrol/ToleranceExplorer')),
  'gm-stress-explorer': React.lazy(() => import('@/components/course/panels/geomech/StressExplorer')),
  'gm-stability-explorer': React.lazy(() => import('@/components/course/panels/geomech/StabilityExplorer')),
  'gm-window-explorer': React.lazy(() => import('@/components/course/panels/geomech/WindowExplorer')),
  'ct-rating-explorer': React.lazy(() => import('@/components/course/panels/casingtubing/RatingExplorer')),
  'ct-loadcase-explorer': React.lazy(() => import('@/components/course/panels/casingtubing/LoadCaseExplorer')),
  'ct-tubing-explorer': React.lazy(() => import('@/components/course/panels/casingtubing/TubingExplorer')),
  'cm-volume-explorer': React.lazy(() => import('@/components/course/panels/cementing/VolumeExplorer')),
  'cm-placement-explorer': React.lazy(() => import('@/components/course/panels/cementing/PlacementExplorer')),
  'cm-standoff-explorer': React.lazy(() => import('@/components/course/panels/cementing/StandoffExplorer')),
  'cd-string-explorer': React.lazy(() => import('@/components/course/panels/completion/StringExplorer')),
  'cd-clearance-explorer': React.lazy(() => import('@/components/course/panels/completion/ClearanceExplorer')),
  'cd-spaceout-explorer': React.lazy(() => import('@/components/course/panels/completion/SpaceoutExplorer')),
};

export function resolvePanel(id) {
  return PANELS[id] || null;
}

export function panelIds() {
  return Object.keys(PANELS);
}
