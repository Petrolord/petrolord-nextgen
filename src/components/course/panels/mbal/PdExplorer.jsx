import React, { useMemo, useState } from 'react';
import { pdSweep, pssAsymptote } from './tankLab';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// pD explorer: the line-source solution against the bounded-circle van
// Everdingen-Hurst solution, with the pseudo-steady-state asymptote overlaid.
// The point of the picture is that these are two different solution FAMILIES,
// so they disagree most at early time, not least.

const W = 620;
const H = 300;
const PAD = { left: 52, top: 16, right: 16, bottom: 38 };
const TDS = [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 25, 40, 50, 75, 100];

const sci = (v, d = 9) => (Number.isFinite(v) ? Number(v).toPrecision(d) : '-');

const PdExplorer = () => {
  const [reD, setReD] = useState('5');
  const r = Number(reD);

  const rows = useMemo(() => {
    try { return pdSweep(r, TDS); } catch { return null; }
  }, [r]);

  if (!rows) return <PanelShell title="pD explorer"><Note>Could not evaluate the solutions for that reD.</Note></PanelShell>;

  const maxY = Math.max(...rows.map((d) => Math.max(d.finite, d.infinite))) * 1.08;
  const maxX = Math.log10(TDS[TDS.length - 1] / TDS[0]);
  const x = (tD) => PAD.left + (Math.log10(tD / TDS[0]) / maxX) * (W - PAD.left - PAD.right);
  const y = (v) => H - PAD.bottom - (v / maxY) * (H - PAD.top - PAD.bottom);
  const path = (key) => rows.map((d, i) => `${i ? 'L' : 'M'}${x(d.tD).toFixed(1)},${y(d[key]).toFixed(1)}`).join(' ');
  const pssPath = rows
    .filter((d) => pssAsymptote(d.tD, r) > 0)
    .map((d, i) => `${i ? 'L' : 'M'}${x(d.tD).toFixed(1)},${y(pssAsymptote(d.tD, r)).toFixed(1)}`)
    .join(' ');

  const at = (tD) => rows.find((d) => d.tD === tD) || {};

  return (
    <PanelShell
      title="pD explorer"
      subtitle="Line-source pD against the bounded-circle van Everdingen-Hurst solution, with the pseudo-steady-state asymptote."
    >
      <div className="w-52">
        <SelectField label="Aquifer radius ratio reD" value={reD} onChange={setReD}
          options={[['2', 'reD = 2 (tiny)'], ['3', 'reD = 3'], ['5', 'reD = 5 (Dake 9.2)'], ['10', 'reD = 10'], ['20', 'reD = 20 (large)']]} />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#334155" />
        <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#334155" />
        {[0.05, 0.5, 5, 50].map((tD) => (
          <text key={tD} x={x(tD)} y={H - PAD.bottom + 14} fontSize="9" fill="#64748b" textAnchor="middle">tD {tD}</text>
        ))}
        {pssPath && <path d={pssPath} fill="none" stroke="#eab308" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.8" />}
        <path d={path('infinite')} fill="none" stroke="#38bdf8" strokeWidth="1.8" />
        <path d={path('finite')} fill="none" stroke="#f97316" strokeWidth="1.8" />
        <text x={PAD.left + 8} y={PAD.top + 11} fontSize="10" fill="#38bdf8">line source (infinite acting)</text>
        <text x={PAD.left + 8} y={PAD.top + 24} fontSize="10" fill="#f97316">bounded circle, reD {r}</text>
        <text x={PAD.left + 8} y={PAD.top + 37} fontSize="10" fill="#eab308">pseudo steady state asymptote</text>
        <text x={14} y={H / 2} fontSize="10" fill="#64748b" transform={`rotate(-90 14 ${H / 2})`} textAnchor="middle">pD</text>
      </svg>

      <TileGrid>
        <Tile label="tD 0.1, finite / line source" value={sci(at(0.1).ratio, 6)} />
        <Tile label="tD 5, finite / line source" value={sci(at(5).ratio, 6)} />
        <Tile label="tD 100, finite / line source" value={sci(at(100).ratio, 6)} />
        <Tile label="pD finite at tD 100" value={sci(at(100).finite, 9)} />
        <Tile label="PSS asymptote at tD 100" value={sci(pssAsymptote(100, r), 9)} />
        <Tile label="ln(reD) - 0.75" value={sci(Math.log(r) - 0.75, 9)} />
      </TileGrid>

      <Note>
        These are two different solution families, not one family with and without a boundary. The
        line source treats the reservoir as a point, so it is worst at early time. The bounded
        solution converges on the dashed asymptote once the aquifer reaches pseudo steady state,
        and that asymptote carries the same ln(reD) minus 0.75 group as the Fetkovich productivity
        index, for the same physical reason.
      </Note>
    </PanelShell>
  );
};

export default PdExplorer;
