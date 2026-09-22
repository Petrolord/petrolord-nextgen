import React, { useMemo, useState } from 'react';
import {
  ALL_SIX, PLUS_SEVEN, TARGET, TOP_NAME, computeValidationMap, controlSetsFor,
} from '@/lib/mappingTeaching';
import { useMappingCase } from '@/components/course/panels/mapping/caseInputs';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import { GridMap } from '@/components/course/panels/mapping/gridPlot';

// Validation explorer: regrid the Ekene TOP_SAND surface for any control
// set, on the frame the six-well map used, so that a change in the live
// node count is a change in what the control supports. The withheld well
// is drawn open and posted with its actual pick, beside a prediction tile
// that is blank five times out of six.
const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const ValidationExplorer = () => {
  const [setKey, setSetKey] = useState(ALL_SIX);
  const c = useMappingCase({ appraisal: true });
  const sets = useMemo(() => (c.ok ? controlSetsFor(c.kase) : []), [c.ok, c.kase]);
  const key = sets.some((x) => x.key === setKey) ? setKey : ALL_SIX;

  const map = useMemo(() => {
    if (!c.ok) return null;
    try {
      return computeValidationMap(key, c.kase);
    } catch {
      return null;
    }
  }, [key, c.ok, c.kase]);

  const controls = (
    <>
      {c.ui}
      <FieldGrid>
        <SelectField label="Control set" value={key} onChange={setSetKey}
          options={sets.map((x) => [x.key, x.label])} />
      </FieldGrid>
    </>
  );

  if (!map) {
    return (
      <PanelShell title="Validation explorer" subtitle="Select a control set.">
        {controls}
        <Note>The grid could not be computed: every typed well line must read name, x, y, top, base.</Note>
      </PanelShell>
    );
  }
  const T = c.kase ? c.kase.target : TARGET;

  const s = map.summary;
  const markers = [
    ...map.control.map((p) => ({
      key: p.name, x: p.x, y: p.y, kind: 'control', text: `${p.name} ${p.z}`,
    })),
    ...(map.withheld ? [{
      key: 'withheld', x: map.withheld.x, y: map.withheld.y, kind: 'withheld',
      text: `${map.withheld.name} ${map.withheld.z} (withheld)`,
    }] : []),
    { key: 'target', x: T.x, y: T.y, kind: 'target', text: T.label },
  ];

  const blind = key === PLUS_SEVEN;

  return (
    <PanelShell title="Validation explorer"
      subtitle={`The ${c.typed ? 'typed' : 'Ekene'} ${TOP_NAME} surface regridded for a control set you choose, always on the frame the full well set's map used. Filled symbols are control, the open amber symbol is the withheld well posted with its actual pick.`}>
      {controls}

      <GridMap spec={map.spec} z={map.z} contours={map.contours}
        zMin={s.crest} zMax={s.deepest} ramp="depth" markers={markers}
        label={`Depth map of the ${TOP_NAME} surface for the selected control set`} />

      <TileGrid>
        <Tile label="Control points used" value={String(s.nControl)} unit="wells" />
        <Tile label="Live nodes" value={String(s.liveNodes)} unit={`of ${map.spec.nx * map.spec.ny}`} />
        <Tile label="Cross-validatable wells" value={String(s.crossValidatable)} />
        <Tile label="Crest (shallowest mapped)" value={fmt(s.crest)} unit="m" />
        <Tile label="Deepest mapped" value={fmt(s.deepest, 2)} unit="m" />
        <Tile label="Map mean" value={fmt(s.mapMean)} unit="m" />
        <Tile label={`Depth at ${T.label}`} value={fmt(s.atTarget)} unit="m" />
        <Tile label={blind ? 'New well' : 'Withheld well'} value={s.testedName || '-'} />
        <Tile label="Actual pick" value={s.actual === null ? '-' : fmt(s.actual, 0)} unit="m" />
        <Tile label={blind ? 'Prediction there before it was drilled' : 'Prediction at that well'}
          value={s.pred === null ? '-' : fmt(s.pred)} unit="m" />
        <Tile label="Residual (predicted minus actual)"
          value={s.resid === null ? '-' : fmt(s.resid)} unit="m" />
        <Tile label="Nearest control distance"
          value={s.nearestControlM === null ? '-' : fmt(s.nearestControlM, 1)} unit="m" />
      </TileGrid>

      <Note>
        A blank prediction tile is the result rather than a missing feature: the withheld well
        sits outside the area the remaining wells constrain, so the map has no value at its own
        location to compare the pick against. On the Ekene wells only Ekene-6, the one well inside
        the hull of the others, can be cross-validated.
        {' '}{blind
          ? 'With the appraisal well in the control set the map honours the new pick exactly, which is why the largest change anywhere equals the blind residual.'
          : 'Step through the leave-one-out settings and watch the live node count fall, then read the depth at the prospect on each: that spread is a jackknife uncertainty available before any new well is drilled.'}
      </Note>
    </PanelShell>
  );
};

export default ValidationExplorer;
