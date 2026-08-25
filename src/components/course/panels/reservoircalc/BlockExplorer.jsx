import React, { useMemo, useState } from 'react';
import {
  FAULT_X_M, FAULT_SWEEP_M, BLOCK_OWC_OPTIONS, CAPSTONE_OWC_M,
  computeBlockModel,
} from '@/lib/reservoircalcTeaching';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Block explorer: partition the Ekene accumulation with a sealing fault the
// learner can move, and give each block its own contact. The map colours
// every oil-bearing cell by the block that owns it, so the tie break on the
// fault column is visible rather than buried in a convention.
const W = 560;
const H = 460;
const PAD = { left: 48, top: 16, right: 16, bottom: 40 };
const WEST_FILL = '#38bdf8';
const EAST_FILL = '#fbbf24';

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : '-');
const pct = (v) => `${fmt(v * 100, 1)} pct`;

const BlockExplorer = () => {
  const [faultX, setFaultX] = useState(String(FAULT_X_M));
  const [owcWest, setOwcWest] = useState(String(CAPSTONE_OWC_M));
  const [owcEast, setOwcEast] = useState(String(CAPSTONE_OWC_M));

  const model = useMemo(() => {
    try {
      return computeBlockModel(Number(faultX), Number(owcWest), Number(owcEast));
    } catch {
      return null;
    }
  }, [faultX, owcWest, owcEast]);

  if (!model) {
    return (
      <PanelShell title="Block explorer" subtitle="Choose a fault easting and a contact for each block.">
        <Note>The fault easting and both contacts must be numbers.</Note>
      </PanelShell>
    );
  }

  const { spec, blockNodes, west, east, total } = model;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const xMin = spec.x0;
  const xMax = spec.x0 + (spec.nx - 1) * spec.dx;
  const yMin = spec.y0;
  const yMax = spec.y0 + (spec.ny - 1) * spec.dy;
  const sx = (x) => PAD.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y) => PAD.top + (1 - (y - yMin) / (yMax - yMin)) * plotH;
  const cw = plotW / Math.max(1, spec.nx - 1);
  const ch = plotH / Math.max(1, spec.ny - 1);
  const maxCol = Math.max(west.maxCol, east.maxCol, 1e-9);

  const cells = blockNodes.map(({ j, t, west: isWest }) => {
    const c = j % spec.nx;
    const r = Math.floor(j / spec.nx);
    return (
      <rect key={j}
        x={sx(spec.x0 + c * spec.dx) - cw / 2}
        y={sy(spec.y0 + r * spec.dy) - ch / 2}
        width={cw} height={ch}
        fill={isWest ? WEST_FILL : EAST_FILL}
        fillOpacity={0.25 + 0.7 * Math.min(1, t / maxCol)} />
    );
  });

  const split = total.stoiipMmstb > 0 ? west.stoiipMmstb / total.stoiipMmstb : 0;
  const cellSplit = total.cells > 0 ? west.cells / total.cells : 0;

  return (
    <PanelShell title="Block explorer"
      subtitle={`A sealing fault at x = ${fmt(model.faultX, 0)} m splits the Ekene SAND. Cell shade is oil column; blue cells belong to the west block, amber to the east. Each block is booked against its own contact.`}>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 items-end">
        <SelectField label="Fault easting (m)" value={faultX} onChange={setFaultX}
          options={FAULT_SWEEP_M.map((v) => [String(v), `${v} m`])} />
        <SelectField label="West block contact (m)" value={owcWest} onChange={setOwcWest}
          options={BLOCK_OWC_OPTIONS.map((v) => [String(v), `${v} m`])} />
        <SelectField label="East block contact (m)" value={owcEast} onChange={setOwcEast}
          options={BLOCK_OWC_OPTIONS.map((v) => [String(v), `${v} m`])} />
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 420 }} role="img"
          aria-label={`Fault block map of the Ekene SAND with the fault at ${fmt(model.faultX, 0)} m`}>
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          {cells}

          {/* the fault trace, drawn on the boundary the label test uses */}
          <line x1={sx(model.faultX)} y1={PAD.top} x2={sx(model.faultX)} y2={H - PAD.bottom}
            stroke="#f87171" strokeWidth="2" strokeDasharray="6 3" />
          <text x={sx(model.faultX) + 4} y={PAD.top + 10} fill="#f87171" fontSize="9">
            fault {fmt(model.faultX, 0)} m
          </text>

          {model.wells.map((w) => {
            const dry = w.top >= (w.west ? Number(owcWest) : Number(owcEast));
            return (
              <g key={w.name}>
                <circle cx={sx(w.x)} cy={sy(w.y)} r="4"
                  fill={dry ? '#0F172A' : '#fff'} stroke={dry ? '#f87171' : '#fff'} strokeWidth="1.5" />
                <text x={sx(w.x) + 7} y={sy(w.y) - 4} fontSize="9"
                  fill={dry ? '#f87171' : (w.west ? WEST_FILL : EAST_FILL)}>
                  {w.name} {w.west ? 'W' : 'E'}{dry ? ' dry' : ''}
                </text>
              </g>
            );
          })}

          <text x={PAD.left} y={H - 14} fill="#64748b" fontSize="9">x {xMin} to {xMax} m</text>
          <text x={PAD.left} y={12} fill="#64748b" fontSize="9">y {yMin} to {yMax} m (north up)</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="West block: cells" value={String(west.cells)} unit={`of ${total.cells}`} />
        <Tile label="East block: cells" value={String(east.cells)} unit={`of ${total.cells}`} />
        <Tile label="West block: GRV" value={fmt(west.grvMm3, 4)} unit="10^6 m3" />
        <Tile label="East block: GRV" value={fmt(east.grvMm3, 4)} unit="10^6 m3" />
        <Tile label="West block: STOIIP" value={fmt(west.stoiipMmstb, 4)} unit="MMstb" />
        <Tile label="East block: STOIIP" value={fmt(east.stoiipMmstb, 4)} unit="MMstb" />
        <Tile label="West mean column" value={fmt(west.meanCol, 4)} unit="m" />
        <Tile label="East mean column" value={fmt(east.meanCol, 4)} unit="m" />
        <Tile label="Blocks added" value={fmt(model.sumStoiipMmstb, 6)} unit="MMstb" />
        <Tile label="Field total" value={fmt(total.stoiipMmstb, 6)} unit="MMstb" />
        <Tile label="Share of cells, west" value={pct(cellSplit)} />
        <Tile label="Share of barrels, west" value={pct(split)} />
      </TileGrid>

      <Note>
        The two blocks always cover the same 169 cells the Associate tier booked when both
        contacts are 1560 m, and the barrels still add up. What changes is who owns them.
        Move the fault one column and watch how many barrels change hands on a tie break;
        give the east block its own contact and watch the field total stop being a single
        number you can quote.
      </Note>
    </PanelShell>
  );
};

export default BlockExplorer;
