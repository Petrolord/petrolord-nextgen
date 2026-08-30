import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  ROWS, CASING_GRADES, CONNECTION_EFFICIENCIES, rating, gradeSweep, tensionSweep,
  ratingTable, regimeCensus, boundariesOf,
} from './casingTubingLab';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Rating explorer: one catalog row at one grade, its four ratings, the collapse
// regime it lands in, and what axial tension does to that.

const fmt = (v, d = 3) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const MPa = (v) => fmt(v / 1e6, 3);
const kN = (v) => fmt(v / 1e3, 1);

const ROW_OPTIONS = ROWS.map((r) => ({ value: `${r.odIn}|${r.weightLbFt}`, label: `${r.designation} (${r.kind})` }));
const GRADE_OPTIONS = CASING_GRADES.map((g) => ({ value: g.name, label: g.name }));
const CONN_OPTIONS = CONNECTION_EFFICIENCIES.map((c) => ({ value: c.name, label: `${c.name} (${c.efficiency})` }));
const FRACTIONS = ['0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8'].map((v) => ({ value: v, label: v }));
const MODES = [
  { value: 'one', label: 'One pipe' },
  { value: 'grades', label: 'Across the grades' },
  { value: 'census', label: 'Regime census' },
];

const One = () => {
  const [row, setRow] = useState('9.625|47');
  const [grade, setGrade] = useState('P-110');
  const [conn, setConn] = useState('BTC');
  const [frac, setFrac] = useState('0.4');
  const [odIn, weightLbFt] = row.split('|').map(Number);
  const r = useMemo(() => {
    try {
      return rating(odIn, weightLbFt, grade, { connection: conn, axialFraction: Number(frac) });
    } catch { return null; }
  }, [odIn, weightLbFt, grade, conn, frac]);
  const sweep = useMemo(() => {
    try {
      return tensionSweep(odIn, weightLbFt, grade).map((x) => ({
        fraction: x.fraction,
        collapseMPa: x.collapsePa / 1e6,
        adjustedKsi: x.adjustedYieldPa / 6.894757e6,
      }));
    } catch { return []; }
  }, [odIn, weightLbFt, grade]);
  if (!r) return <Note>That combination is not in the catalog.</Note>;
  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <SelectField label="Catalog row" value={row} onChange={setRow} options={ROW_OPTIONS} />
        <SelectField label="Grade" value={grade} onChange={setGrade} options={GRADE_OPTIONS} />
        <SelectField label="Connection" value={conn} onChange={setConn} options={CONN_OPTIONS} />
        <SelectField label="Axial, as a fraction of yield" value={frac} onChange={setFrac} options={FRACTIONS} />
      </div>
      <TileGrid>
        <Tile label="D over t" value={fmt(r.dt, 4)} />
        <Tile label="Wall" value={fmt(r.wallM * 1000, 3)} unit="mm" />
        <Tile label="Burst" value={MPa(r.burstPa)} unit="MPa" />
        <Tile label="Body yield" value={kN(r.bodyYieldN)} unit="kN" />
        <Tile label="Joint strength" value={kN(r.jointStrengthN)} unit="kN" />
        <Tile label="Collapse" value={MPa(r.collapsePa)} unit="MPa" />
        <Tile label="Regime" value={r.regime} />
        <Tile label="Collapse under tension" value={MPa(r.collapseDeratedPa)} unit="MPa" />
        <Tile label="Regime under tension" value={r.regimeDerated} />
        <Tile label="Derated by" value={fmt(100 * r.deratedFraction, 3)} unit="pct" />
        <Tile label="Adjusted yield" value={MPa(r.adjustedYieldPa)} unit="MPa" />
        <Tile label="Area" value={fmt(r.areaM2 * 1e4, 3)} unit="cm2" />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sweep} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="fraction" type="number" domain={[0, 0.9]} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'axial stress / yield', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'MPa or ksi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={Number(frac)} stroke="#f59e0b" strokeDasharray="4 4" />
            <Line dataKey="collapseMPa" name="collapse (MPa)" stroke="#BFFF00" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line dataKey="adjustedKsi" name="adjusted yield (ksi)" stroke="#38bdf8" strokeWidth={1} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The three D over t boundaries at this grade are
        {' '}{fmt(r.boundaries.dtYp, 4)}, {fmt(r.boundaries.dtPt, 4)} and {fmt(r.boundaries.dtTe, 4)},
        and this pipe sits at {fmt(r.dt, 4)}, which is why it collapses in the
        {' '}<span className="text-[#BFFF00]">{r.regime}</span> regime. Those three numbers belong to the
        GRADE and not to the pipe: change the grade and they all move, change the weight and they do not.
      </div>
      <Note>
        Four ratings, four different formulas. Burst is Barlow on the minimum wall. Body yield is
        the steel area times the yield. Joint strength is that times a connection efficiency.
        Collapse is whichever of four published formulas your D over t lands in, and tension
        reaches it only by lowering the yield the formulas are handed.
      </Note>
    </>
  );
};

const Grades = () => {
  const [row, setRow] = useState('20|94');
  const [frac, setFrac] = useState('0.4');
  const [odIn, weightLbFt] = row.split('|').map(Number);
  const data = useMemo(() => {
    try {
      return gradeSweep(odIn, weightLbFt, { axialFraction: Number(frac) }).map((r) => ({
        grade: r.grade,
        ksi: r.yieldPa / 6.894757e6,
        burstMPa: r.burstPa / 1e6,
        collapseMPa: r.collapsePa / 1e6,
        deratedMPa: r.collapseDeratedPa / 1e6,
        regime: r.regime,
      }));
    } catch { return []; }
  }, [odIn, weightLbFt, frac]);
  const flat = data.length > 0 && data.every((d) => Math.abs(d.collapseMPa - data[0].collapseMPa) < 1e-9);
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Catalog row" value={row} onChange={setRow} options={ROW_OPTIONS} />
        <SelectField label="Axial, as a fraction of yield" value={frac} onChange={setFrac} options={FRACTIONS} />
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="ksi" type="number" domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'yield strength (ksi)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'MPa', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="burstMPa" name="burst" stroke="#fb7185" strokeWidth={2} dot isAnimationActive={false} />
            <Line dataKey="collapseMPa" name="collapse" stroke="#BFFF00" strokeWidth={2} dot isAnimationActive={false} />
            <Line dataKey="deratedMPa" name="collapse under tension" stroke="#38bdf8" strokeWidth={1} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        {flat
          ? 'Collapse is FLAT across all ten grades on this row, because every one of them is in the elastic regime and the elastic formula does not contain the yield strength. Burst rises by a factor of more than three over the same span.'
          : 'Collapse rises with grade on this row, because at least one grade is out of the elastic regime and the other three formulas all contain the yield strength.'}
      </div>
      <Note>
        The elastic collapse formula is geometry alone. Anywhere a pipe sits in that regime, paying
        for a stronger steel buys burst and tension and nothing else, and the only way to buy
        collapse is a thicker wall. Turn the tension up and watch the weakest grade leave the
        regime first.
      </Note>
    </>
  );
};

const Census = () => {
  const [frac, setFrac] = useState('0.4');
  const base = useMemo(() => regimeCensus(ratingTable()), []);
  const hot = useMemo(
    () => regimeCensus(ratingTable({ axialFraction: Number(frac) }), 'regimeDerated'),
    [frac],
  );
  const grades = useMemo(() => CASING_GRADES.map((g) => ({ name: g.name, ...boundariesOf(g.name) })), []);
  return (
    <>
      <SelectField label="Axial, as a fraction of yield" value={frac} onChange={setFrac} options={FRACTIONS} />
      <TileGrid>
        {['yield', 'plastic', 'transition', 'elastic'].map((k) => (
          <Tile key={k} label={k} value={`${base[k] || 0} -> ${hot[k] || 0}`} unit="of 280" />
        ))}
      </TileGrid>
      <div className="mt-3 text-xs text-slate-300">
        Two hundred and eighty pipes, twenty eight catalog rows at ten grades. Tension moves the
        census DOWNWARD, toward the yield regime, because it lowers the yield the boundaries are
        computed from and every boundary rises when the yield falls.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr><th className="text-left pr-3">grade</th><th className="text-right pr-3">yield/plastic</th><th className="text-right pr-3">plastic/transition</th><th className="text-right">transition/elastic</th></tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.name}>
                <td className="pr-3">{g.name}</td>
                <td className="text-right pr-3">{fmt(g.dtYp, 4)}</td>
                <td className="text-right pr-3">{fmt(g.dtPt, 4)}</td>
                <td className="text-right">{fmt(g.dtTe, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Every boundary falls as the grade rises. A strong pipe reaches elastic collapse at a lower
        D over t than a weak one, which is why the highest grades spend most of the catalog in the
        plastic and transition regimes while the lowest ones reach elastic sooner.
      </Note>
    </>
  );
};

const RatingExplorer = () => {
  const [mode, setMode] = useState('one');
  return (
    <PanelShell
      title="Tubular rating explorer"
      subtitle="Four ratings on one pipe, the collapse regime it lands in, and what tension does to it"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'one' && <One />}
        {mode === 'grades' && <Grades />}
        {mode === 'census' && <Census />}
      </div>
    </PanelShell>
  );
};

export default RatingExplorer;
