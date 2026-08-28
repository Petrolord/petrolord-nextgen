import React, { useMemo, useState } from 'react';
import {
  topsFt, wellTops, volumetrics, reconciliation, gridSummary, M_TO_FT,
} from './simLab';
import { PanelShell, Tile, TileGrid, Note, SelectField } from '@/components/course/panels/petrophysics/panelKit';

// Structure explorer: the kriged TOP_SAND surface the deck carries, the six
// wells posted on it, and the volumetric reconciliation against the NG5
// booking under either clipping convention. The convention toggle is the
// lesson: you can match the booked volume or the booked area, not both.

const CELL = 11;
const fmt = (v, d = 4) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d }) : '-');

const StructureExplorer = () => {
  const [convention, setConvention] = useState('centre');
  const [showWells, setShowWells] = useState(true);

  const out = useMemo(() => {
    try {
      const grid = gridSummary();
      const tops = topsFt();
      const lo = Math.min(...tops);
      const hi = Math.max(...tops);
      return {
        grid, tops, lo, hi, wells: wellTops(), vol: volumetrics(convention), recon: reconciliation(),
      };
    } catch (e) {
      return { error: e.message };
    }
  }, [convention]);

  if (out.error) {
    return <PanelShell title="Structure explorer"><Note>{out.error}</Note></PanelShell>;
  }

  const {
    grid, tops, lo, hi, wells, vol, recon,
  } = out;
  const owcFt = 1560 * M_TO_FT;
  const shade = (t) => {
    const f = Math.max(0, Math.min(1, (t - lo) / Math.max(1e-9, hi - lo)));
    const r = Math.round(40 + 150 * f);
    const g = Math.round(210 - 150 * f);
    return `rgb(${r},${g},110)`;
  };

  return (
    <PanelShell
      title="Structure explorer"
      subtitle="The TOP_SAND surface the deck carries, kriged from the six mapped well tops, and what it books against the NG5 volumetric."
    >
      <div className="grid gap-4 sm:grid-cols-3 items-end">
        <SelectField
          label="Contact convention"
          value={convention}
          onChange={setConvention}
          options={[['centre', 'Eclipse cell centre'], ['tapered', 'Column clipped at contact']]}
        />
        <div>
          <p className="text-gray-400 text-xs mb-1">Wells</p>
          <button
            type="button"
            onClick={() => setShowWells((v) => !v)}
            className="px-2 py-1 text-xs rounded border border-gray-600 text-gray-300 hover:border-gray-400"
          >
            {showWells ? 'Hide' : 'Show'} well posts
          </button>
        </div>
        <Note>Deeper is redder. The contact sits at {fmt(owcFt, 1)} ft.</Note>
      </div>

      <div className="overflow-x-auto">
        <svg width={grid.nx * CELL + 2} height={grid.ny * CELL + 2} role="img" aria-label="Kriged top sand surface">
          {tops.map((t, idx) => {
            const i = idx % grid.nx;
            const j = Math.floor(idx / grid.nx);
            return (
              <rect
                key={idx}
                x={i * CELL + 1}
                y={(grid.ny - 1 - j) * CELL + 1}
                width={CELL}
                height={CELL}
                fill={shade(t)}
                opacity={t < owcFt ? 1 : 0.35}
              />
            );
          })}
          {showWells && wells.map((w) => (
            <g key={w.well}>
              <circle
                cx={(w.i - 1) * CELL + 1 + CELL / 2}
                cy={(grid.ny - w.j) * CELL + 1 + CELL / 2}
                r={4}
                fill={w.onLattice ? '#0F172A' : '#BFFF00'}
                stroke="#fff"
                strokeWidth={1.2}
              />
            </g>
          ))}
        </svg>
      </div>

      <TileGrid>
        <Tile label="Deck STOIIP" value={fmt(vol.stoiip_stb, 0)} unit="stb" />
        <Tile label="Booked STOIIP" value={fmt(recon.bookedStoiipStb, 0)} unit="stb" />
        <Tile label="Gap" value={fmt(vol.gapPct, 4)} unit="%" />
        <Tile label="Oil cells" value={fmt(vol.oilCells, 0)} unit={`booked ${recon.bookedOilCells}`} />
        <Tile label="Crest" value={fmt(grid.topMin, 2)} unit="ft" />
        <Tile label="Datum" value={fmt(grid.topMean, 2)} unit="ft" />
      </TileGrid>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-gray-300">
          <thead className="text-gray-500">
            <tr><th className="text-left py-1">Well</th><th className="text-left">Cell</th><th className="text-right">Mapped (m)</th><th className="text-right">Deck (m)</th><th className="text-right">Delta (m)</th></tr>
          </thead>
          <tbody>
            {wells.map((w) => (
              <tr key={w.well} className={w.onLattice ? '' : 'text-[#BFFF00]'}>
                <td className="py-1">{w.well}</td>
                <td>({w.i}, {w.j})</td>
                <td className="text-right">{fmt(w.mapped_top_m, 2)}</td>
                <td className="text-right">{fmt(w.deck_top_m, 4)}</td>
                <td className="text-right">{fmt(w.delta_m, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Note>
        Kriging with a zero nugget is an exact interpolator AT THE DATA POINT, so five of the six wells
        come back to the last figure. Ekene-2 sits at y = 1150, half a cell off the 100 m lattice, so the
        deck gives it the depth of the nearest cell centre instead.
      </Note>
    </PanelShell>
  );
};

export default StructureExplorer;
