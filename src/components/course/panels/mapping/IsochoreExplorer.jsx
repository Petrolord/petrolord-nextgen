import React, { useMemo, useState } from 'react';
import {
  ISO_CELLS, SURFACE_KEYS, CAPSTONE_CELL_M, MAX_EXTRAP_M, TARGET, TOP_NAME, computeIsochoreMap,
} from '@/lib/mappingTeaching';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import { GridMap } from '@/components/course/panels/mapping/gridPlot';

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
  const [cell, setCell] = useState(String(CAPSTONE_CELL_M));

  const map = useMemo(() => {
    try {
      return computeIsochoreMap(Number(cell), surface);
    } catch {
      return null;
    }
  }, [cell, surface]);

  if (!map) {
    return (
      <PanelShell title="Isochore explorer" subtitle="Select a surface and a cell size.">
        <Note>The grid could not be computed for those settings.</Note>
      </PanelShell>
    );
  }

  const s = map.summary;
  const isIso = surface === 'ISOCHORE';
  const markers = [
    ...map.posted.map((p) => ({
      key: p.name, x: p.x, y: p.y, kind: 'control',
      text: `${p.name} ${p.value}`,
    })),
    { key: 'target', x: TARGET.x, y: TARGET.y, kind: 'target', text: TARGET.label },
  ];

  return (
    <PanelShell title="Isochore explorer"
      subtitle={`Both Ekene surfaces gridded on one ${s.nx} by ${s.ny} frame at a ${s.cellM} m cell, then subtracted. Wells are posted with their own measured values, and the blank margin is beyond the ${MAX_EXTRAP_M} m extrapolation limit on every surface.`}>
      <FieldGrid>
        <SelectField label="Surface" value={surface} onChange={setSurface}
          options={SURFACE_KEYS.map((k) => [k, LABELS[k]])} />
        <SelectField label="Cell size (m)" value={cell} onChange={setCell}
          options={ISO_CELLS.map((c) => [String(c), `${c} m`])} />
      </FieldGrid>

      <GridMap spec={map.spec} z={map.z} contours={map.contours}
        zMin={s.min} zMax={s.max} ramp={isIso ? 'thickness' : 'depth'}
        markers={markers}
        label={`Map of the Ekene ${isIso ? 'sand isochore' : surface}`} />

      <TileGrid>
        <Tile label="Surface" value={LABELS[s.surface]} />
        <Tile label="Cell size" value={String(s.cellM)} unit="m" />
        <Tile label="Frame" value={`${s.nx} x ${s.ny}`} unit={`${s.nNodes} nodes`} />
        <Tile label="Live nodes" value={`${s.liveNodes} of ${s.nNodes}`} />
        <Tile label="Minimum" value={fmt(s.min)} unit={UNIT} />
        <Tile label="Maximum" value={fmt(s.max)} unit={UNIT} />
        <Tile label="Map mean" value={fmt(s.mapMean)} unit={UNIT} />
        <Tile label={`Value at ${TARGET.label}`} value={fmt(s.atTarget)} unit={UNIT} />
        <Tile label="Contour interval" value={fmt(s.contourStep, 0)} unit={UNIT} />
        <Tile label="Mean of the six well values" value={fmt(s.wellMean)} unit={UNIT} />
        <Tile label="Map mean minus well mean" value={fmt(s.mapMinusWell)} unit={UNIT} />
        <Tile label="Live nodes above the well mean" value={`${s.nodesAboveWellMean} of ${s.liveNodes}`} />
      </TileGrid>

      <Note>
        On the depth surfaces the posted number is the well's pick. On the isochore it is
        base minus top, computed from that well's own two picks with no gridding involved,
        so comparing a posting against the shading around it is a direct quality check.
        {' '}{isIso
          ? 'Ekene-2 posts 36 m and the map reports nothing there, because at a 100 m cell no node lands on it and three of its four bilinear corners are dead.'
          : `Switch to the isochore to see the same frame carrying a thickness rather than a depth. ${surface === TOP_NAME ? 'This is the Associate tier map, unchanged.' : ''}`}
        {' '}The last three tiles are the whole of the two-honest-means module: the well mean
        weights six wells equally, the map mean weights 201 nodes equally and therefore weights
        by area, and the count above the well mean is not close to half.
      </Note>
    </PanelShell>
  );
};

export default IsochoreExplorer;
