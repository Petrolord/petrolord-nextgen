import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  BELEMA, liquidAt, chokingMarch, gasMarch,
} from './meteringLab';
import {
  PanelShell, NumField, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import { Relation, Refusal, Provenance } from './MeterRunExplorer';

// THE CHOKING BOUNDARY, the Professional tier. A control valve is the one item
// of process equipment where the ordinary sizing equation stops working exactly
// when the service gets difficult. Past the boundary a larger coefficient buys
// nothing at all, and everything interesting about valve sizing lives there.
//
// THE OUTLET PRESSURE IS THE THING THE LEARNER MOVES. March it down and the
// stated drop climbs past the allowable drop, the drop the valve USES stops
// following it, the coefficient stops moving, the cavitation index stops
// falling, and the regime word turns over rung by rung. Every one of those is a
// returned value. This panel never decides the word.
//
// THE REGIME WORD IS THE ENGINE'S. A panel that classified the regime itself
// could disagree with the engine on the screen the learner is reading, which is
// the exact defect the engine's own repair removed: two expressions of one
// predicate that disagreed at the tie.
//
// Every number on this page is a return value from meteringLab, which is a
// return value from the vendored control valve engine. This panel computes no
// valve quantity, imports no engine, reads no clock and draws no random number.
// Every comparison it shows is a RELATION the lab computed.
//
// NO PERCENTILE. Nothing in this course is a distribution.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const raw = (v) => (v === null || v === undefined ? 'none' : String(v));
const num = (v, fallback) => (Number.isFinite(Number(v)) && String(v).trim() !== '' ? Number(v) : fallback);

export const MODES = [
  ['valve', 'One valve at one outlet pressure: the three drops, the coefficient, the index and the word'],
  ['march', 'The march down the outlet pressure, and the boundary crossed inside the table'],
  ['ladder', 'The regime ladder, rung by rung, each rung found by bisecting the word'],
  ['gas', 'Gas sizing: the pressure drop ratio, its terminal value and the two thirds floor'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

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

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const ValveMode = ({ v }) => {
  if (!v) return <Note>The valve reader did not answer.</Note>;
  if (v.refused) return <Refusal label="The engine will not size this service" message={v.error} />;
  return (
    <>
      <TileGrid>
        <Tile label="Stated drop" value={six(v.dpStatedPsi)} unit="psi" />
        <Tile label="Allowable drop" value={six(v.dpAllowablePsi)} unit="psi" />
        <Tile label="The drop the valve uses" value={six(v.dpUsedPsi)} unit="psi" />
        <Tile label="Coefficient" value={six(v.cv)} />
        <Tile label="Cavitation index" value={six(v.sigma)} />
        <Tile label="Regime" value={v.regime} />
        <Tile label="Choked" value={String(v.choked)} />
        <Tile label="Flashing" value={String(v.flashing)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Three drops, and the third is the one that matters. The allowable drop is the pressure recovery factor squared
        times the difference between the inlet and the vapour pressure that the critical pressure ratio factor lets
        the valve keep. Below it the valve is not choked and the coefficient follows the ordinary equation. At or above
        it the flow is choked, extra drop does nothing, and the engine sizes on the allowable drop instead. Drive the
        outlet pressure down and watch the stated drop pass the allowable one.
      </p>
      <div className="mt-2 rounded-md border border-slate-700 bg-[#0F172A] p-2">
        <p className="text-xs text-slate-300 font-mono mb-0">{v.sigmaBasis}</p>
      </div>
      <Refusal label="The engine's warning on this service" message={v.warning} />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        WHAT SIZING ON THE STATED DROP WOULD COST. A hand calculation that used the full stated drop produces a
        different coefficient, and the size of that difference is computed and printed here rather than described.
        Below the boundary the two agree, because the drop the valve uses IS the stated drop.
      </p>
      <Relation r={v.sizingRelation} />
      <Provenance>{v.limitNote}</Provenance>
      <TileGrid>
        <Tile label="Pressure recovery factor" value={six(v.fl)} />
        <Tile label="Critical pressure ratio factor" value={six(v.ff)} />
        <Tile label="Piping geometry factor" value={six(v.fp)} />
        <Tile label="Reynolds number factor applied" value={String(v.reynoldsFactorApplied)} />
      </TileGrid>
    </>
  );
};

export const MarchMode = ({ m }) => {
  if (!m) return <Note>The march reader did not answer.</Note>;
  const rows = m.rows.filter((r) => !r.refused);
  const chart = rows.map((r) => ({
    outlet: r.p2Psia, stated: r.dpStatedPsi, allowable: r.dpAllowablePsi, used: r.dpUsedPsi, cv: r.cv, sigma: r.sigma,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="The valve begins to choke at" value={six(m.chokeEdge.at)} unit="psia outlet" />
        <Tile label="The allowable drop there" value={six(m.atChoke.dpAllowablePsi)} unit="psi" />
        <Tile label="The coefficient there" value={six(m.atChoke.cv)} />
        <Tile label="Rows of this march that report choked flow" value={raw(m.chokedRowCount)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The onset is found by bisecting the engine&apos;s own choked flag over {raw(m.chokeEdge.halvings)} halvings.
        The flag reads {raw(m.chokeEdge.readingFrom)} at {six(m.chokeEdge.from)} psia and
        {' '}{raw(m.chokeEdge.readingTo)} at {six(m.chokeEdge.to)} psia, so the edge discriminates.
        Tree: {m.countTree}. Rule: {m.countRule}.
      </p>
      <Tbl
        head={['outlet, psia', 'dP stated', 'dP allowable', 'dP used', 'coefficient', 'cavitation index', 'regime']}
        rows={rows.map((r) => [six(r.p2Psia), six(r.dpStatedPsi), six(r.dpAllowablePsi), six(r.dpUsedPsi), six(r.cv), six(r.sigma), r.regime])}
      />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="outlet" tick={AXIS} reversed label={{ value: 'outlet pressure, psia', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={m.chokeEdge.at} stroke="#f472b6" strokeDasharray="3 3" label={{ value: 'the flow chokes', fill: '#f472b6', fontSize: 9 }} />
            <Line dataKey="stated" name="stated drop, psi" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="allowable" name="allowable drop, psi" stroke="#fbbf24" dot={false} isAnimationActive={false} />
            <Line dataKey="used" name="the drop the valve uses, psi" stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The blue line keeps climbing as the outlet falls. The green line stops at the amber one. That is the whole
        subject: past the crossing, more pressure drop is not available to the valve, and a coefficient sized on the
        blue line belongs to a drop the valve cannot take.
      </p>
      <div className="h-44 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="outlet" tick={AXIS} reversed label={{ value: 'outlet pressure, psia', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={m.chokeEdge.at} stroke="#f472b6" strokeDasharray="3 3" />
            <Line dataKey="cv" name="coefficient" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="sigma" name="cavitation index" stroke="#a78bfa" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Relation r={m.rows.find((r) => !r.refused && r.choked) ? m.rows.find((r) => !r.refused && r.choked).sizingRelation : null} />
      <Refusal label="A liquid sizing with no vapour pressure" message={m.noVapourPressureRefusal} />
      <p className="text-xs text-slate-400 mt-1 mb-0">
        That refusal is why the ladder runs at all. With no vapour pressure the index is infinite, the last rung is
        taken, and every liquid service at every drop reads as stable.
      </p>
    </>
  );
};

export const LadderMode = ({ m }) => {
  if (!m) return <Note>The ladder reader did not answer.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="The cavitating threshold the engine exports" value={six(m.cavitatingThreshold)} />
        <Tile label="The incipient threshold the engine exports" value={six(m.incipientThreshold)} />
        <Tile label="Rungs found" value={raw(m.ladder.length)} />
        <Tile label="Every rung discriminates" value={String(m.ladder.every((r) => r.edge.discriminates))} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Damage begins long before the flow chokes, and the cavitation index says how much margin there is before it.
        Each rung below is found by bisecting the WORD the engine returns, starting from just below the rung above, so
        the ladder is read off the engine rather than counted in advance.
      </p>
      <Tbl
        head={['boundary', 'outlet, psia', 'the index there', 'halvings', 'discriminates']}
        rows={m.ladder.map((r) => [`${r.from} gives way to ${r.to}`, six(r.outletPsia), six(r.sigmaThere), raw(r.edge.halvings), String(r.edge.discriminates)])}
      />
      <Provenance>
        Both ladder thresholds above are this engine&apos;s stated screen. Neither is read from a standard, a
        certified vendor figure for the specific trim always replaces the style data behind them, and this course
        grades no regime word anywhere.
      </Provenance>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        FLASHING IS A DIFFERENT PROBLEM WITH A DIFFERENT FIX. When the outlet sits at or below the vapour pressure the
        liquid is flashing and an anti-cavitation trim will not help it. The engine separates the two and says which
        one it has, in its own words:
      </p>
      <TileGrid>
        <Tile label="Outlet pressure" value={six(m.flashing.outletPsia)} unit="psia" />
        <Tile label="Vapour pressure" value={six(m.flashing.vapourPressurePsia)} unit="psia" />
        <Tile label="Flashing" value={String(m.flashing.flashing)} />
        <Tile label="Regime" value={raw(m.flashing.regime)} />
      </TileGrid>
      <Refusal label="The engine's warning on a flashing service" message={m.flashing.warning} />
      <Relation r={m.flashing.onsetRelation} />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The critical pressure ratio factor sets how much of the difference between the inlet and the vapour pressure
        the valve can use. It is a computed function of the vapour and critical pressures, so it moves with the fluid:
      </p>
      <Tbl
        head={['condition', 'the factor']}
        rows={[
          ['at this service', six(m.criticalRatio.atThisService)],
          ['as the vapour pressure approaches zero', six(m.criticalRatio.approachingZero)],
          ['at the critical point', six(m.criticalRatio.atTheCriticalPoint)],
        ]}
      />
    </>
  );
};

export const GasMode = ({ g }) => {
  if (!g) return <Note>The gas reader did not answer.</Note>;
  const rows = g.rows.filter((r) => !r.refused);
  const chart = rows.map((r) => ({
    outlet: r.p2Psia, x: r.x, terminal: r.xChoked, used: r.xUsed, y: r.y,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="The gas valve begins to choke at" value={six(g.edge.at)} unit="psia outlet" />
        <Tile label="The terminal pressure drop ratio there" value={six(g.atEdge.xChoked)} />
        <Tile label="The specific heat ratio factor there" value={six(g.atEdge.fk)} />
        <Tile label="The coefficient there" value={six(g.atEdge.cv)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        On gas the boundary is a pressure drop RATIO. The expansion factor falls linearly with it and is floored at two
        thirds, which is the choked condition. {raw(g.chokedRowCount)} rows of this march report choked flow.
        Tree: {g.countTree}. Rule: {g.countRule}.
      </p>
      <Tbl
        head={['outlet, psia', 'x', 'x terminal', 'x used', 'expansion factor', 'coefficient', 'choked']}
        rows={rows.map((r) => [six(r.p2Psia), six(r.x), six(r.xChoked), six(r.xUsed), six(r.y), six(r.cv), String(r.choked)])}
      />
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="outlet" tick={AXIS} reversed label={{ value: 'outlet pressure, psia', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={g.edge.at} stroke="#f472b6" strokeDasharray="3 3" label={{ value: 'the flow chokes', fill: '#f472b6', fontSize: 9 }} />
            <Line dataKey="x" name="pressure drop ratio" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="terminal" name="terminal ratio" stroke="#fbbf24" dot={false} isAnimationActive={false} />
            <Line dataKey="used" name="the ratio used" stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line dataKey="y" name="expansion factor" stroke="#a78bfa" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        THE FLOOR, MEASURED. The expansion factor is the same double on every choked row:
        {' '}{String(g.floorIsTheSameOnEveryChokedRow)}. How far that double sits from two thirds is measured rather
        than asserted. It is not two thirds exactly ({String(g.floorIsTwoThirdsExactly)}) and it sits one unit in the
        last place above it ({String(g.floorIsOneUlpFromTwoThirds)}), a difference of
        {' '}{String(g.floorLessTwoThirdsDerived)}. The engine forms it as one less a quotient, and one less a third is
        one unit in the last place above two thirds in a double.
      </p>
      <Tbl
        head={['specific heat ratio', 'the factor']}
        rows={g.specificHeatFactors.map((r) => [six(r.k), six(r.fk)])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The pressure recovery factor and the terminal ratio behind every row above come off the engine&apos;s own style
        table:
      </p>
      <Tbl
        head={['style', 'pressure recovery factor', 'terminal pressure drop ratio']}
        rows={g.styles.map((s) => [s.label, six(s.fl), six(s.xt)])}
      />
      <Provenance>{g.styleProvenance}</Provenance>
    </>
  );
};

const ChokingExplorer = ({ initialMode = 'valve' }) => {
  const [mode, setMode] = useState(initialMode);
  const [p2Psia, setP2Psia] = useState(String(BELEMA.p2Psia));
  const [pvPsia, setPvPsia] = useState(String(BELEMA.pvPsia));
  const [qGpm, setQGpm] = useState(String(BELEMA.qGpm));

  const input = useMemo(() => ({
    ...BELEMA,
    pvPsia: num(pvPsia, BELEMA.pvPsia),
    qGpm: num(qGpm, BELEMA.qGpm),
  }), [pvPsia, qGpm]);

  const v = useMemo(
    () => (mode === 'valve' ? safe(() => liquidAt(num(p2Psia, BELEMA.p2Psia), input)) : null),
    [mode, p2Psia, input],
  );
  const m = useMemo(
    () => ((mode === 'march' || mode === 'ladder') ? safe(() => chokingMarch(input)) : null),
    [mode, input],
  );
  const g = useMemo(() => (mode === 'gas' ? safe(() => gasMarch()) : null), [mode]);

  return (
    <PanelShell
      title="Choking explorer"
      subtitle="A control valve in field units, with the outlet pressure as the thing you move. The stated drop, the allowable drop, the drop the valve actually uses, the coefficient, the cavitation index and the regime word all come back from the engine, and the crossing of the boundary is visible in every one of them."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <NumField label="Outlet pressure, psia" value={p2Psia} onChange={setP2Psia} />
        <NumField label="Vapour pressure, psia" value={pvPsia} onChange={setPvPsia} />
        <NumField label="Rate, gpm" value={qGpm} onChange={setQGpm} />
      </FieldGrid>
      <Note>
        Set the vapour pressure to zero and the engine refuses the sizing by name rather than reporting a stable
        service in green. That refusal is the reason the cavitation screen runs at all.
      </Note>
      <div className="mt-3">
        {mode === 'valve' && <ValveMode v={v} />}
        {mode === 'march' && <MarchMode m={m} />}
        {mode === 'ladder' && <LadderMode m={m} />}
        {mode === 'gas' && <GasMode g={g} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored control valve engine, reached through the teaching
        lab. Pressures and pressure drops are in psia and psi, rates in gpm for liquid and scfh for gas, and every
        coefficient, index, ratio and factor prints to six decimals.
      </Note>
    </PanelShell>
  );
};

export default ChokingExplorer;
