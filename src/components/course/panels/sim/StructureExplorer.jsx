import React, { useMemo, useState } from 'react';
import {
  wellTops, gridSummary, structureAt, correlatedOil, M_TO_FT,
  TEACHING_MEAN_M, TEACHING_OWC_M, BOOKED_STOIIP_STB, GOLDEN,
} from './simLab';
import { PanelShell, Tile, TileGrid, Note, SelectField, NumField } from '@/components/course/panels/petrophysics/panelKit';

// The teaching fluid the correlation check opens on (the RC2 tank design).
const TEACHING_FLUID = { api: 32, gasSg: 0.75, tempF: 180, pbPsia: 2000, piPsia: 3200, rsiScfStb: 400 };

// Structure explorer: the kriged TOP_SAND surface the deck carries, the six
// wells posted on it, and the volumetric reconciliation against the NG5
// booking under either clipping convention. The convention toggle is the
// lesson: you can match the booked volume or the booked area, not both.

const CELL = 11;
const fmt = (v, d = 4) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d }) : '-');

const StructureExplorer = () => {
  const [convention, setConvention] = useState('centre');
  const [showWells, setShowWells] = useState(true);
  // The setting opens on the teaching deck; a capstone brief states its own
  // regional mean and contact, and the learner types them in.
  const [mean, setMean] = useState(String(TEACHING_MEAN_M));
  const [owc, setOwc] = useState(String(TEACHING_OWC_M));
  const [colI, setColI] = useState('15');
  const [colJ, setColJ] = useState('15');
  const [fluid, setFluid] = useState(() => Object.fromEntries(Object.entries(TEACHING_FLUID).map(([k, v]) => [k, String(v)])));

  const out = useMemo(() => {
    try {
      const m = Number(mean);
      const c = Number(owc);
      if (!(m > 1400 && m < 1700) || !(c > 1400 && c < 1700)) throw new Error('Type a regional mean and a contact in metres TVD, both between 1400 and 1700.');
      const grid = gridSummary();
      const st = structureAt({ regionalMean: m, owcM: c });
      const tops = st.topsFt;
      const lo = Math.min(...tops);
      const hi = Math.max(...tops);
      const byWell = Object.fromEntries(st.wellTops.map((w) => [w.well, w.deck_top_m]));
      const wells = wellTops().map((w) => ({ ...w, deck_top_m: byWell[w.well], delta_m: byWell[w.well] - w.mapped_top_m }));
      const vol = convention === 'tapered'
        ? { stoiip_stb: st.tapered.stoiipStb, gapPct: st.tapered.gapPct, oilCells: st.tapered.oilCells }
        : { stoiip_stb: st.stoiipStb, gapPct: st.gapPct, oilCells: st.oilCells };
      return { grid, st, tops, lo, hi, wells, vol };
    } catch (e) {
      return { error: e.message };
    }
  }, [convention, mean, owc]);

  const col = useMemo(() => {
    const i = Number(colI);
    const j = Number(colJ);
    if (!out.st || !Number.isInteger(i) || !Number.isInteger(j) || i < 1 || i > 30 || j < 1 || j > 30) return null;
    return out.st.topAt(i, j);
  }, [out, colI, colJ]);

  const oil = useMemo(() => {
    const f = Object.fromEntries(Object.entries(fluid).map(([k, v]) => [k, Number(v)]));
    if (!(f.api > 0 && f.gasSg > 0 && f.tempF > 0 && f.pbPsia > 0 && f.piPsia >= f.pbPsia && f.rsiScfStb > 0)) return null;
    try { return correlatedOil(f); } catch { return null; }
  }, [fluid]);

  const inputs = (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
      <NumField label="Regional mean (m TVD)" value={mean} onChange={setMean} />
      <NumField label="Oil water contact (m TVD)" value={owc} onChange={setOwc} />
      <NumField label="Read column i" value={colI} onChange={setColI} />
      <NumField label="Read column j" value={colJ} onChange={setColJ} />
    </div>
  );

  if (out.error) {
    return <PanelShell title="Structure explorer">{inputs}<Note>{out.error}</Note></PanelShell>;
  }

  const {
    grid, st, tops, lo, hi, wells, vol,
  } = out;
  const owcFt = st.owcM * M_TO_FT;
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
      {inputs}
      <div className="text-xs text-gray-500">
        The panel opens on the teaching deck: regional mean {TEACHING_MEAN_M} m and the contact at {TEACHING_OWC_M} m.
        A capstone brief states a setting of its own; type it in, and the surface is kriged again at that mean.
      </div>
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
        <Tile label="Booked STOIIP" value={fmt(BOOKED_STOIIP_STB, 0)} unit="stb" />
        <Tile label="Gap" value={fmt(vol.gapPct, 4)} unit="%" />
        <Tile label="Oil cells" value={fmt(vol.oilCells, 0)} unit={`booked ${GOLDEN.volumetrics.booked_oil_cells}`} />
        <Tile label="Crest" value={fmt(st.crestFt, 4)} unit="ft" />
        <Tile label="Deepest top" value={fmt(st.deepestFt, 4)} unit="ft" />
        <Tile label="Datum" value={fmt(st.datumFt, 4)} unit="ft" />
        <Tile label="Columns with top above the contact" value={fmt(st.columnsAboveOwc, 0)} unit={`of ${grid.nx * grid.ny}`} />
        <Tile label={`Top at column (${colI}, ${colJ})`} value={col === null ? '-' : fmt(col, 4)} unit="ft" />
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

      <div className="mt-4">
        <p className="text-gray-400 text-xs mb-2">Correlation check: what Standing's correlation says of a stated oil (it opens on the teaching fluid)</p>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-6 items-end">
          {[['api', 'API'], ['gasSg', 'Gas gravity'], ['tempF', 'Temperature (degF)'], ['pbPsia', 'Bubble point (psia)'], ['piPsia', 'Initial pressure (psia)'], ['rsiScfStb', 'Designed Rs (scf/stb)']].map(([k, label]) => (
            <NumField key={k} label={label} value={fluid[k]} onChange={(v) => setFluid((f) => ({ ...f, [k]: v }))} />
          ))}
        </div>
        <TileGrid>
          <Tile label="Correlated Bo at initial pressure" value={oil ? fmt(oil.boAtPi, 6) : '-'} unit="rb/stb" />
          <Tile label="Correlated Rs at the bubble point" value={oil ? fmt(oil.rsAtPb, 4) : '-'} unit="scf/stb" />
          <Tile label="Rs gap to the designed Rs" value={oil ? fmt(oil.rsGapPct, 4) : '-'} unit="%" />
        </TileGrid>
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
