import React, { useMemo, useState } from 'react';
import {
  CONTROL_SETS, ALL_SIX, PLUS_SEVEN, TARGET, TOP_NAME, computeValidationMap,
} from '@/lib/mappingTeaching';
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

  const map = useMemo(() => {
    try {
      return computeValidationMap(setKey);
    } catch {
      return null;
    }
  }, [setKey]);

  if (!map) {
    return (
      <PanelShell title="Validation explorer" subtitle="Select a control set.">
        <Note>The grid could not be computed for that control set.</Note>
      </PanelShell>
    );
  }

  const s = map.summary;
  const markers = [
    ...map.control.map((p) => ({
      key: p.name, x: p.x, y: p.y, kind: 'control', text: `${p.name} ${p.z}`,
    })),
    ...(map.withheld ? [{
      key: 'withheld', x: map.withheld.x, y: map.withheld.y, kind: 'withheld',
      text: `${map.withheld.name} ${map.withheld.z} (withheld)`,
    }] : []),
    { key: 'target', x: TARGET.x, y: TARGET.y, kind: 'target', text: TARGET.label },
  ];

  const blind = setKey === PLUS_SEVEN;

  return (
    <PanelShell title="Validation explorer"
      subtitle={`The Ekene ${TOP_NAME} surface regridded for a control set you choose, always on the frame the six-well map used. Filled symbols are control, the open amber symbol is the withheld well posted with its actual pick.`}>
      <FieldGrid>
        <SelectField label="Control set" value={setKey} onChange={setSetKey}
          options={CONTROL_SETS.map((c) => [c.key, c.label])} />
      </FieldGrid>

      <GridMap spec={map.spec} z={map.z} contours={map.contours}
        zMin={s.crest} zMax={s.deepest} ramp="depth" markers={markers}
        label={`Depth map of the Ekene ${TOP_NAME} surface for the selected control set`} />

      <TileGrid>
        <Tile label="Control points used" value={String(s.nControl)} unit="wells" />
        <Tile label="Live nodes" value={String(s.liveNodes)} unit="of 500" />
        <Tile label="Cross-validatable wells" value={String(s.crossValidatable)} />
        <Tile label="Crest (shallowest mapped)" value={fmt(s.crest)} unit="m" />
        <Tile label="Deepest mapped" value={fmt(s.deepest, 2)} unit="m" />
        <Tile label="Map mean" value={fmt(s.mapMean)} unit="m" />
        <Tile label={`Depth at ${TARGET.label}`} value={fmt(s.atTarget)} unit="m" />
        <Tile label={blind ? 'New well' : 'Withheld well'} value={s.testedName || '-'} />
        <Tile label="Actual pick" value={s.actual === null ? '-' : fmt(s.actual, 0)} unit="m" />
        <Tile label={blind ? 'Six-well prediction there' : 'Prediction at that well'}
          value={s.pred === null ? '-' : fmt(s.pred)} unit="m" />
        <Tile label="Residual (predicted minus actual)"
          value={s.resid === null ? '-' : fmt(s.resid)} unit="m" />
        <Tile label="Nearest control distance"
          value={s.nearestControlM === null ? '-' : fmt(s.nearestControlM, 1)} unit="m" />
      </TileGrid>

      <Note>
        A blank prediction tile is the result rather than a missing feature: the withheld well
        sits outside the area the remaining wells constrain, so the map has no value at its own
        location to compare the pick against. Only Ekene-6, the one well inside the hull of the
        others, can be cross-validated on this geometry.
        {' '}{blind
          ? 'With Ekene-7 in the control set the map honours the new pick exactly, which is why the largest change anywhere equals the blind residual.'
          : 'Step through the six leave-one-out settings and watch the live node count fall, then read the depth at P-1 on each: that spread is a jackknife uncertainty available before any new well is drilled.'}
      </Note>
    </PanelShell>
  );
};

export default ValidationExplorer;
