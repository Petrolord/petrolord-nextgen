import React, { useMemo, useState } from 'react';
import {
  SURFACE_KEYS, TEACHING_CELL_M, MAX_EXTRAP_M, TARGET, TOP_NAME, computeIsochoreMap,
} from '@/lib/mappingTeaching';
import { PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import { GridMap } from '@/components/course/panels/mapping/gridPlot';
import { useMappingCase } from '@/components/course/panels/mapping/caseInputs';

// Isochore explorer: grid both Ekene surfaces on one frame, subtract
// them, and read whichever of the three the learner selects. The three
// share a frame and a mask by construction, which is the point: the
// isochore inherits both from the surfaces it was made from.
const LABELS = {
  TOP_SAND: 'TOP_SAND (depth)',
  BASE_SAND: 'BASE_SAND (depth)',
  ISOCHORE: 'Isochore (thickness)',
};
const UNIT = 'm';

const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const IsochoreExplorer = () => {
  const [surface, setSurface] = useState('ISOCHORE');
  const [cell, setCell] = useState(String(TEACHING_CELL_M));
  const c = useMappingCase();

  const map = useMemo(() => {
    const cellM = Number(cell);
    if (!c.ok || !(cellM >= 25 && cellM <= 500)) return null;
    try {
      return computeIsochoreMap(cellM, surface, c.kase);
    } catch {
      return null;
    }
  }, [cell, surface, c.ok, c.kase]);

  const controls = (
    <>
      {c.ui}
      <FieldGrid>
        <SelectField label="Surface" value={surface} onChange={setSurface}
          options={SURFACE_KEYS.map((k) => [k, LABELS[k]])} />
        <NumField label="Cell size (m)" value={cell} onChange={setCell} />
      </FieldGrid>
    </>
  );

  if (!map) {
    return (
      <PanelShell title="Isochore explorer" subtitle="Select a surface, a cell size and a well set.">
        {controls}
        <Note>The grid could not be computed for those settings: the cell must be 25 to 500 m and every typed well line must read name, x, y, top, base.</Note>
      </PanelShell>
    );
  }
  const T = c.kase ? c.kase.target : TARGET;

  const s = map.summary;
  const isIso = surface === 'ISOCHORE';
  const markers = [
    ...map.posted.map((p) => ({
      key: p.name, x: p.x, y: p.y, kind: 'control',
      text: `${p.name} ${p.value}`,
    })),
    { key: 'target', x: T.x, y: T.y, kind: 'target', text: T.label },
  ];

  return (
    <PanelShell title="Isochore explorer"
      subtitle={`Both ${c.typed ? 'typed' : 'Ekene'} surfaces gridded on one ${s.nx} by ${s.ny} frame at a ${s.cellM} m cell, then subtracted. Wells are posted with their own measured values, and the blank margin is beyond the ${MAX_EXTRAP_M} m extrapolation limit on every surface.`}>
      {controls}

      <GridMap spec={map.spec} z={map.z} contours={map.contours}
        zMin={s.min} zMax={s.max} ramp={isIso ? 'thickness' : 'depth'}
        markers={markers}
        label={`Map of the ${isIso ? 'sand isochore' : surface}`} />

      <TileGrid>
        <Tile label="Surface" value={LABELS[s.surface]} />
        <Tile label="Cell size" value={String(s.cellM)} unit="m" />
        <Tile label="Frame" value={`${s.nx} x ${s.ny}`} unit={`${s.nNodes} nodes`} />
        <Tile label="Live nodes" value={`${s.liveNodes} of ${s.nNodes}`} />
        <Tile label="Minimum" value={fmt(s.min)} unit={UNIT} />
        <Tile label="Maximum" value={fmt(s.max)} unit={UNIT} />
        <Tile label="Map mean" value={fmt(s.mapMean)} unit={UNIT} />
        <Tile label={`Value at ${T.label}`} value={fmt(s.atTarget)} unit={UNIT} />
        <Tile label="Contour interval" value={fmt(s.contourStep, 0)} unit={UNIT} />
        <Tile label={`Mean of the ${map.posted.length} well values`} value={fmt(s.wellMean)} unit={UNIT} />
        <Tile label="Map mean minus well mean" value={fmt(s.mapMinusWell)} unit={UNIT} />
        <Tile label="Live nodes above the well mean" value={`${s.nodesAboveWellMean} of ${s.liveNodes}`} />
      </TileGrid>

      <Note>
        On the depth surfaces the posted number is the well's pick. On the isochore it is
        base minus top, computed from that well's own two picks with no gridding involved,
        so comparing a posting against the shading around it is a direct quality check.
        {' '}{isIso && !c.typed
          ? 'Ekene-2 posts 36 m and the map reports nothing there, because at a 100 m cell no node lands on it and three of its four bilinear corners are dead.'
          : `Switch to the isochore to see the same frame carrying a thickness rather than a depth. ${surface === TOP_NAME ? 'This is the Associate tier map, unchanged.' : ''}`}
        {' '}The last three tiles are the whole of the two-honest-means module: the well mean
        weights every well equally, the map mean weights every live node equally and therefore
        weights by area, and the count above the well mean need not be close to half.
      </Note>
    </PanelShell>
  );
};

export default IsochoreExplorer;
