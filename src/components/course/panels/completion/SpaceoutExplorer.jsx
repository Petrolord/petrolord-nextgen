import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea,
} from 'recharts';
import {
  spaceOutAt, spaceOutSweep, spaceOutBand, minPbrLength, dr6LengthChanges, dr6SpaceOut, GOLDEN,
} from './completionLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Space-out explorer: where to land the seal assembly in the polished bore,
// the band of landings that carries both extremes, and the shortest bore that
// leaves a band at all.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const MODES = [
  { value: 'sweep', label: 'Landing sweep' },
  { value: 'sizing', label: 'PBR sizing' },
  { value: 'dr6', label: 'The tubing cases' },
];

const DEFAULTS = { pbr: 6.1, up: 1.2, down: -2.8, margin: 0.5 };

const useInputs = () => {
  const [pbr, setPbr] = useState('');
  const [up, setUp] = useState('');
  const [down, setDown] = useState('');
  const [margin, setMargin] = useState('');
  const v = {
    pbr: pbr === '' ? DEFAULTS.pbr : Number(pbr),
    up: up === '' ? DEFAULTS.up : Number(up),
    down: down === '' ? DEFAULTS.down : Number(down),
    margin: margin === '' ? DEFAULTS.margin : Number(margin),
  };
  const fields = (
    <div className="grid grid-cols-4 gap-2">
      <NumField label={`PBR length (m, default ${DEFAULTS.pbr})`} value={pbr} onChange={setPbr} placeholder={String(DEFAULTS.pbr)} />
      <NumField label={`Elongation (m, default ${DEFAULTS.up})`} value={up} onChange={setUp} placeholder={String(DEFAULTS.up)} />
      <NumField label={`Contraction (m, default ${DEFAULTS.down})`} value={down} onChange={setDown} placeholder={String(DEFAULTS.down)} />
      <NumField label={`Margin (m, default ${DEFAULTS.margin})`} value={margin} onChange={setMargin} placeholder={String(DEFAULTS.margin)} />
    </div>
  );
  return [v, fields];
};

const Sweep = () => {
  const [v, fields] = useInputs();
  const sweep = useMemo(() => {
    try { return spaceOutSweep(v.pbr, v.up, v.down, v.margin); } catch { return null; }
  }, [v.pbr, v.up, v.down, v.margin]);
  const band = useMemo(() => {
    try { return spaceOutBand(v.pbr, v.up, v.down, v.margin); } catch { return null; }
  }, [v.pbr, v.up, v.down, v.margin]);
  if (!sweep || !band) return <Note>Those numbers do not describe a landing that can be made.</Note>;
  const data = sweep.map((r) => ({
    insert: r.insertLengthM,
    up: r.up.remainingM,
    down: r.down.remainingM,
  }));
  return (
    <>
      {fields}
      <TileGrid>
        <Tile label="Budget" value={fmt(v.pbr, 3)} unit="m" />
        <Tile label="Band open" value={band.open ? 'yes' : 'no'} />
        <Tile label="Shallowest landing" value={band.open ? fmt(band.loM, 4) : '-'} unit="m" />
        <Tile label="Deepest landing" value={band.open ? fmt(band.hiM, 4) : '-'} unit="m" />
        <Tile label="Band width" value={band.open ? fmt(band.widthM, 4) : '-'} unit="m" />
        <Tile label="Middle of the band" value={band.open ? fmt(band.midM, 4) : '-'} unit="m" />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="insert" type="number" domain={['dataMin', 'dataMax']}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'insertion (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'remaining after the move (m)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {band.open && <ReferenceArea x1={band.loM} x2={band.hiM} fill="#BFFF00" fillOpacity={0.12} />}
            <Line type="monotone" dataKey="up" name="after elongation" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="down" name="after contraction" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The two lines cross because the insertion depth splits a FIXED budget. Every metre you gain
        against elongation you lose against contraction, and the shaded band is where both are
        still above the margin. Landing in the middle of it is not a preference, it is the only
        choice that is equally far from both failures.
      </Note>
    </>
  );
};

const Sizing = () => {
  const [v, fields] = useInputs();
  const rows = useMemo(() => [4.0, 4.5, 5.0, 5.5, 6.1, 7.0, 9.1].map((pbr) => {
    const b = spaceOutBand(pbr, v.up, v.down, v.margin);
    return { pbr, open: b.open, lo: b.loM, hi: b.hiM, width: b.widthM };
  }), [v.up, v.down, v.margin]);
  const need = useMemo(() => minPbrLength(v.up, v.down, v.margin), [v.up, v.down, v.margin]);
  return (
    <>
      {fields}
      <TileGrid>
        <Tile label="Swing" value={fmt(v.up - v.down, 4)} unit="m" />
        <Tile label="Twice the margin" value={fmt(2 * v.margin, 4)} unit="m" />
        <Tile label="Shortest usable PBR" value={fmt(need, 4)} unit="m" />
        <Tile label="Chosen PBR" value={fmt(v.pbr, 3)} unit="m" />
        <Tile label="Spare" value={fmt(v.pbr - need, 4)} unit="m" />
        <Tile label="Band at the chosen PBR" value={fmt(Math.max(0, v.pbr - need), 4)} unit="m" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">PBR (m)</th><th className="text-right pr-3">band open</th>
              <th className="text-right pr-3">shallowest</th><th className="text-right pr-3">deepest</th>
              <th className="text-right">width</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pbr}>
                <td className="pr-3">{fmt(r.pbr, 2)}</td>
                <td className={`text-right pr-3 ${r.open ? 'text-emerald-400' : 'text-rose-400'}`}>{r.open ? 'yes' : 'no'}</td>
                <td className="text-right pr-3">{r.open ? fmt(r.lo, 4) : '-'}</td>
                <td className="text-right pr-3">{r.open ? fmt(r.hi, 4) : '-'}</td>
                <td className="text-right">{r.open ? fmt(r.width, 4) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The shortest usable polished bore is the whole swing plus twice the margin, and the band
        width is whatever is left over. Every metre of bore above that requirement buys exactly one
        metre of tolerance on where the seals actually land, which is the only reason to pay for a
        longer one.
      </Note>
    </>
  );
};

const Dr6 = () => {
  const [pbr, setPbr] = useState('');
  const [margin, setMargin] = useState('');
  const p = pbr === '' ? 6.1 : Number(pbr);
  const m = margin === '' ? 0.5 : Number(margin);
  const d = useMemo(() => {
    try { return dr6SpaceOut(p, m); } catch { return null; }
  }, [p, m]);
  const cases = useMemo(() => dr6LengthChanges(), []);
  if (!d) return <Note>Those numbers do not describe a landing that can be made.</Note>;
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="PBR length (m, default 6.1)" value={pbr} onChange={setPbr} placeholder="6.1" />
        <NumField label="Margin (m, default 0.5)" value={margin} onChange={setMargin} placeholder="0.5" />
      </div>
      <TileGrid>
        <Tile label="Cases" value={d.cases.length} />
        <Tile label="Largest elongation" value={fmt(d.maxUpM, 6)} unit="m" />
        <Tile label="Largest contraction" value={fmt(d.maxDownM, 6)} unit="m" />
        <Tile label="Swing" value={fmt(d.swingM, 6)} unit="m" />
        <Tile label="Shortest usable PBR" value={fmt(d.minPbrM, 6)} unit="m" />
        <Tile label="Band open" value={d.band.open ? 'yes' : 'no'} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">case</th>
              <th className="text-right pr-3">length change (m)</th>
              <th className="text-right pr-3">1.5 m stroke</th>
              <th className="text-right pr-3">remaining here (m)</th>
              <th className="text-right">status here</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c, i) => (
              <tr key={c.name}>
                <td className="pr-3">{c.name}</td>
                <td className="text-right pr-3">{fmt(c.dLM, 6)}</td>
                <td className={`text-right pr-3 ${c.strokeOkAt1p5M ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {c.strokeOkAt1p5M ? 'carried' : 'stroked out'}
                </td>
                <td className="text-right pr-3">{d.atMid ? fmt(d.atMid[i].remainingM, 6) : '-'}</td>
                <td className={`text-right ${d.atMid && d.atMid[i].status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {d.atMid ? d.atMid[i].status : 'no band'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        These are the same three tubing cases the Casing and Tubing Design course ends on, run here
        against a polished bore instead of a 1.5 metre seal stroke. Two of the three stroked out
        there. All three are carried here, landed at {fmt(d.band.midM, 4)} m, and the bore that does
        it is {fmt(d.minPbrM, 4)} m at the shortest.
      </div>
      <Note>
        The golden the other course published held {GOLDEN.results.spaceOut.length} space-out cases
        of its own. This view is the join between the two: a length change is a tubing calculation,
        and a landing depth is a completion decision, and neither course can finish the job alone.
      </Note>
    </>
  );
};

const SpaceoutExplorer = () => {
  const [mode, setMode] = useState('sweep');
  return (
    <PanelShell
      title="Seal space-out explorer"
      subtitle="Where to land the seals, the band that carries both extremes, and the bore that leaves one"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'sweep' && <Sweep />}
        {mode === 'sizing' && <Sizing />}
        {mode === 'dr6' && <Dr6 />}
      </div>
    </PanelShell>
  );
};

export default SpaceoutExplorer;
