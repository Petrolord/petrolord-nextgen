import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  waterCarried, honestBand, waterToTakeOut, circulationChoice, reboilerPaysFor, stillOverhead,
  SATURATION_P, OBIAFU_LINE, OBIAFU, RATIO_AT_LOWER_CUSTOM, RATIO_AT_UPPER_CUSTOM,
} from './gasprocessingLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Water explorer, the Associate tier, and the Expert BTEX chain.
//
// HOW MUCH WATER A GAS CARRIES IS AN INTENSIVE ANSWER: it knows the pressure
// and the temperature and nothing about the rate. Everything after it, the
// pounds a day, the gallons a minute, the MMBtu an hour, is that answer with a
// rate applied to it, and this panel keeps the two halves visibly apart.
//
// The saturation surface is drawn beside the vapour-pressure curve on purpose.
// The whole temperature dependence of the water content lives in that one
// curve and the whole pressure dependence is the division by the total
// pressure, and a learner who sees both sees why.
//
// Every figure on this page is a return value from gasprocessingLab, which is a
// return value from the vendored Gas Processing engine on the teaching stream
// OBIAFU. Nothing here computes a water content, a circulation or a duty, and
// nothing reads a clock.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no percentile
// label appears anywhere on this page.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const nine = (v) => (Number.isFinite(v) ? Number(v).toFixed(9) : 'none');

export const MODES = [
  ['surface', 'The saturation surface, and the vapour-pressure curve the whole temperature dependence lives in'],
  ['band', 'The band the answer is honest in: one refusal and two warnings'],
  ['load', 'The spec and the load: an intensive answer, then the rate applied to it'],
  ['ratio', 'The circulation ratio, which is a choice the engine refuses to make'],
  ['duty', 'What the reboiler pays for, in its two named parts'],
  ['btex', 'The still overhead nobody sells'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const SERIES = ['#38bdf8', '#f472b6', '#BFFF00', '#fbbf24'];

const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={h} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Held = ({ children }) => (
  <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">HELD FOR LITERATURE</p>
    <p className="text-xs text-slate-300 mb-0">{children}</p>
  </div>
);

/** A refusal shown as a refusal. The message is the engine's, through the lab. */
const Refusal = ({ label, message }) => (
  <div className="mt-2 rounded-md border border-red-800/60 bg-red-950/20 p-2">
    <p className="text-red-300 text-xs font-medium mb-1">{label}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{message}</p>
  </div>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const SurfaceMode = ({ s }) => {
  if (!s) return <Note>The saturation reader did not return a surface.</Note>;
  const chart = s.surface.map((row) => {
    const point = { tF: row.tF };
    SATURATION_P.forEach((p, i) => { point[`p${p}`] = row.lbPerMMscf[i]; });
    return point;
  });
  const curve = s.vapourCurve.map((r) => ({ tF: r.tF, psat: r.psatPsia }));
  return (
    <>
      <TileGrid>
        <Tile label="Mole fraction of water" value={nine(s.yWater)} />
        <Tile label="Water content" value={six(s.lbPerMMscf)} unit="lb/MMscf" />
        <Tile label="Vapour pressure" value={six(s.psatPsia)} unit="psia" />
        <Tile label="Vapour pressure over total" value={nine(s.yWaterDerived)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The last two tiles are one statement read twice. The mole fraction of water in the gas IS the vapour pressure of
        water over the total pressure, so the fourth tile is the third divided by {six(OBIAFU_LINE.pPsia)} psia and it
        comes back as the first. Everything the temperature does is in the vapour pressure; everything the pressure does
        is in the division.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="tF" tick={AXIS} label={{ value: 'degF', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {SATURATION_P.map((p, i) => (
              <Line key={p} dataKey={`p${p}`} name={`${p} psia, lb/MMscf`} stroke={SERIES[i % SERIES.length]} dot={false} isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-44 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curve} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="tF" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="psat" name="vapour pressure, psia" stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The second chart carries no pressure at all. One curve stands behind all four of the curves above it.
      </Note>
      <Tbl
        head={['psia', 'degF', 'engine, lb/MMscf', 'golden, lb/MMscf', 'engine over golden']}
        rows={s.published.map((r) => [six(r.pPsia), six(r.tF), six(r.engineLbPerMMscf), six(r.goldenLbPerMMscf), nine(r.ratioDerived)])}
      />
      <Note>
        The last column is near one rather than one, and that is the value of the check: the golden comes from a
        different published vapour-pressure equation, so two independent fits of one physical curve are meeting inside
        their shared band.
      </Note>
    </>
  );
};

export const BandMode = ({ b }) => {
  if (!b) return <Note>The band reader did not return its limits.</Note>;
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        Three separate limits sit on this answer and they are not the same limit. One REFUSES, one warns that the FIT is
        being extrapolated, and one warns that the METHOD is.
      </p>
      <Tbl
        head={['degF', 'degC', 'the engine']}
        rows={b.fitLimit.map((r) => [six(r.tF), six(r.tCDerived), r.error ? 'refuses' : `answers ${six(r.lbPerMMscf)} lb/MMscf`])}
      />
      <Note>
        Both edges are inclusive: the engine answers at exactly the edge and refuses a millionth of a degree outside it.
      </Note>
      {b.studioRefusal && <Refusal label="A gas temperature an operator would plausibly type" message={b.studioRefusal} />}
      <Tbl
        head={['degF', 'degC', 'the extrapolation note']}
        rows={b.publicationLimit.map((r) => [six(r.tF), six(r.tCDerived), r.refused ? 'refuses' : (r.warning || 'none')])}
      />
      <Tbl
        head={['psia', 'the method note']}
        rows={b.methodLimit.map((r) => [six(r.pPsia), r.warning || 'none'])}
      />
      <Held>
        The real-gas departure of the saturated water content. The engine warns above its own threshold that the
        correction reaches tens of percent, and nothing in this package stands behind a figure for it. It is taught as a
        limit and never as an answer, which is why every graded water content in this course sits below that threshold.
      </Held>
      {b.otherRefusals.map((r) => <Refusal key={r.label} label={r.label} message={r.error} />)}
    </>
  );
};

export const LoadMode = ({ l }) => {
  if (!l) return <Note>The load reader did not return a sweep.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Arrives carrying" value={six(l.inletLbMMscf)} unit="lb/MMscf" />
        <Tile label="Has to leave at" value={six(OBIAFU.outletLbMMscf)} unit="lb/MMscf" />
        <Tile label="Comes out" value={six(l.removedLbMMscfDerived)} unit="lb/MMscf" />
        <Tile label="At the stated rate" value={four(l.waterLbDay)} unit="lb/day" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The third tile is the first two subtracted and it still knows nothing about the rate. The fourth is the first
        moment the rate enters the chain at all.
      </p>
      <Tbl
        head={['outlet spec, lb/MMscf', 'water out, lb/day', 'circulation, gpm', 'reboiler, MMBtu/hr']}
        rows={l.specSweep.map((r) => [six(r.outletLbMMscf), four(r.waterLbDay), six(r.circGpm), six(r.reboilerMMBtuHr)])}
      />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={l.rateSweep.map((r) => ({
            rate: r.gasMMscfd, water: r.waterLbDay, gpm: r.circGpm, perGal: r.dutyBtuPerGal,
          }))} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="rate" tick={AXIS} label={{ value: 'MMscfd', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="water" name="water out, lb/day" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="gpm" name="circulation, gpm" stroke="#f472b6" dot={false} isAnimationActive={false} />
            <Line dataKey="perGal" name="Btu per gallon" stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Two of those three lines rise with the rate and one is flat. The duty per gallon is a property of the glycol
        loop, and the rate only decides how many gallons there are.
      </Note>
    </>
  );
};

export const RatioMode = ({ c }) => {
  if (!c) return <Note>The circulation reader did not return a sweep.</Note>;
  const chart = c.ratioSweep.map((r) => ({
    ratio: r.circulationGalPerLb,
    gpm: r.circGpm,
    perGal: r.dutyBtuPerGal,
    reboiler: r.reboilerMMBtuHr,
  }));
  return (
    <>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="ratio" tick={AXIS} label={{ value: 'gal per lb', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={RATIO_AT_LOWER_CUSTOM} stroke="#BFFF00" strokeDasharray="3 3" label={{ value: 'customary low', fill: '#BFFF00', fontSize: 10 }} />
            <ReferenceLine x={RATIO_AT_UPPER_CUSTOM} stroke="#BFFF00" strokeDasharray="3 3" label={{ value: 'customary high', fill: '#BFFF00', fontSize: 10 }} />
            <Line dataKey="gpm" name="circulation, gpm" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="perGal" name="Btu per gallon" stroke="#f472b6" dot={false} isAnimationActive={false} />
            <Line dataKey="reboiler" name="reboiler, MMBtu/hr" stroke="#fbbf24" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Three things move on that chart and they do not move together. More glycol per pound means more gallons and more
        sensible heat in total, and each gallon carries less water and needs less heat to boil it out, so the Btu a
        gallon falls while the MMBtu an hour rises. The two marked lines are the customary band, which the engine warns
        outside and is silent at exactly.
      </Note>
      <Tbl
        head={['gal per lb', 'gpm', 'Btu/gal', 'sensible', 'overhead', 'MMBtu/hr', 'warned']}
        rows={c.ratioSweep.map((r) => [six(r.circulationGalPerLb), six(r.circGpm), four(r.dutyBtuPerGal), four(r.sensiblePerGal), four(r.vaporPerGal), six(r.reboilerMMBtuHr), r.warned ? 'yes' : 'no'])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The lean strength is a SECOND choice and it answers a different question. A gallon of lean solution is not pure
        glycol: at the stated weight percent it already carries {nine(c.leanWaterLbPerGal)} lb of water before it meets
        the gas, and it comes back rich at {nine(c.richTegWtPct)} weight percent.
      </p>
      <Tbl
        head={['lean, wt %', 'water in a lean gallon, lb', 'rich returns at, wt %', 'warned']}
        rows={c.leanSweep.map((r) => [six(r.leanTegWtPct), nine(r.leanWaterLbPerGal), nine(r.richTegWtPct), r.warned ? 'yes' : 'no'])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        What the lean strength does NOT do is set the outlet spec, and the engine says so on every answer it returns:
      </p>
      <p className="text-xs text-slate-300 font-mono mt-1 mb-0">outletSpecBasis: {c.outletSpecBasis}</p>
      {c.strengthBand.filter((r) => r.error).map((r) => (
        <Refusal key={r.leanTegWtPct} label={`a lean strength of ${nine(r.leanTegWtPct)} weight percent`} message={r.error} />
      ))}
      <Held>
        The glycol density in lb a gallon. It is declared, it is the module&apos;s one glycol density, and both the loop
        balance and the vessel sizing read it. Taught as a limit and never as an answer.
      </Held>
    </>
  );
};

export const DutyMode = ({ d }) => {
  if (!d) return <Note>The duty reader did not return its parts.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Sensible" value={four(d.sensiblePerGal)} unit="Btu/gal" />
        <Tile label="Overhead" value={four(d.vaporPerGal)} unit="Btu/gal" />
        <Tile label="The two summed" value={four(d.dutyBtuPerGal)} unit="Btu/gal" />
        <Tile label="Reboiler" value={six(d.reboilerMMBtuHr)} unit="MMBtu/hr" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The duty arrives in named parts rather than as one number. The sensible half is heating {six(d.tegLbPerGal)} lb
        of glycol a gallon at {six(d.cpTegBtuLbFMeasured)} Btu per lb per degF through {six(d.riseF)} degF of rise; the
        overhead half is boiling the {nine(d.waterPerGalDerived)} lb of water each gallon carries back out at
        {' '}{six(d.overheadBtuPerLb)} Btu a lb, with the reflux adding its fraction again. The sensible half is
        {' '}{six(d.sensibleShareDerived)} of the total.
      </p>
      <Tbl
        head={['reflux ratio', 'overhead, Btu/gal', 'total, Btu/gal', 'reboiler, MMBtu/hr']}
        rows={d.refluxSweep.map((r) => [six(r.refluxRatio), four(r.vaporPerGal), four(r.dutyBtuPerGal), six(r.reboilerMMBtuHr)])}
      />
      <Tbl
        head={['reboiler degF', 'sensible, Btu/gal', 'overhead, Btu/gal', 'total, Btu/gal']}
        rows={d.stillSweep.map((r) => [six(r.reboilerTF), four(r.sensiblePerGal), four(r.vaporPerGal), four(r.dutyBtuPerGal)])}
      />
      <Note>
        The still temperature moves the sensible half and leaves the overhead where it was. The reflux ratio does the
        opposite. Two knobs, two halves, and a single duty figure would have hidden both.
      </Note>
      <Held>
        The water overhead the reboiler pays for, in Btu a lb. It is declared, it is an input with that default, and no
        publication in this repository fixes it. Taught as a limit and never as an answer.
      </Held>
    </>
  );
};

export const BtexMode = ({ b }) => {
  if (!b) return <Note>The overhead reader did not return a table.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Aromatics to the still overhead" value={four(b.btexLbDay)} unit="lb/day" />
        <Tile label="The same figure a year" value={six(b.btexTonsYear)} unit="short tons/yr" />
        <Tile label="Molecular weight used" value={six(b.btexMwDefault)} />
        <Tile label="Tripling the ppmv multiplies by" value={six(b.ppmvTripledDerived)} />
      </TileGrid>
      <Tbl
        head={['ppmv in', 'absorbed fraction', 'lb/day', 'short tons/yr']}
        rows={b.rows.map((r) => [six(r.btexInletPpmv), six(r.btexAbsorbedFrac), four(r.btexLbDay), six(r.btexTonsYear)])}
      />
      <Note>
        Both columns are linear in both inputs and the table says so itself: tripling the ppmv multiplies the pounds a
        day by {six(b.ppmvTripledDerived)} and doubling the absorbed fraction multiplies it by
        {' '}{six(b.fractionDoubledDerived)}. A mole balance with one operating multiplier and no chemistry is exactly
        what those two figures describe.
      </Note>
      <Held>
        The BTEX absorbed fraction and its single molecular weight. The fraction is a chart or operating value the engine
        takes as an input, and the molecular weight is one compound standing for four. Taught as a limit and never as an
        answer.
      </Held>
    </>
  );
};

const WaterExplorer = ({ initialMode = 'surface' }) => {
  const [mode, setMode] = useState(initialMode);
  const s = useMemo(() => (mode === 'surface' ? safe(waterCarried) : null), [mode]);
  const b = useMemo(() => (mode === 'band' ? safe(honestBand) : null), [mode]);
  const l = useMemo(() => (mode === 'load' ? safe(waterToTakeOut) : null), [mode]);
  const c = useMemo(() => (mode === 'ratio' ? safe(circulationChoice) : null), [mode]);
  const d = useMemo(() => (mode === 'duty' ? safe(reboilerPaysFor) : null), [mode]);
  const x = useMemo(() => (mode === 'btex' ? safe(stillOverhead) : null), [mode]);

  return (
    <PanelShell
      title="Water explorer"
      subtitle="OBIAFU in field units: how much water the gas carries, the band that answer is honest in, the load the spec sets, the circulation ratio nobody computes for you, the duty in its two named parts, and the aromatics that leave through the still."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'surface' && <SurfaceMode s={s} />}
        {mode === 'band' && <BandMode b={b} />}
        {mode === 'load' && <LoadMode l={l} />}
        {mode === 'ratio' && <RatioMode c={c} />}
        {mode === 'duty' && <DutyMode d={d} />}
        {mode === 'btex' && <BtexMode b={x} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored Gas Processing engine on the teaching stream OBIAFU,
        printed to the precision the teaching digest prints. Gas is in MMscfd, pressures in psia, temperatures in degF,
        water in lb per MMscf, solvent in gal per lb and gpm, and heat in Btu a gallon and MMBtu an hour.
      </Note>
    </PanelShell>
  );
};

export default WaterExplorer;
