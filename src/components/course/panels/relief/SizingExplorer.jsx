import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceArea,
} from 'recharts';
import {
  associateReading, gasBranch, liquidLoop, steamNapier, orificeLadder, TYPED_MARKER,
} from './reliefLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Sizing explorer. The device and the three fluids it passes, for the Associate
// tier throughout and for the Expert audit module.
//
// THE POINT OF THIS PANEL IS WHICH CORRECTION THE ENGINE WORKED OUT AND WHICH
// ONE SOMEBODY COPIED OFF A CHART. Each of the four API 520 routes has exactly
// one computed correction and exactly one typed one, and the first view puts all
// four side by side so that shape is visible before any curve is drawn.
//
// Every figure on this page is a return value from reliefLab, which is a return
// value from the vendored pressure relief engine on the teaching streams
// ORUBIRI, AKASO and TEBIDABA. Nothing here computes a required area, a
// correction or an orifice letter, nothing imports an engine, and nothing reads
// a clock. Every refusal shown is the engine's own returned message.
//
// EVERY VIEW RENDERS ITS EMPTY STATE FIRST. The readers run in an effect, so the
// first paint of any view carries no engine number at all and says so. A panel
// that computed during render would print numbers into markup that a server
// render, a snapshot and a thumbnail all capture.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no percentile
// label appears anywhere on this page.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');

export const MODES = [
  ['routes', 'The four routes side by side, and which correction each one computes'],
  ['coefficient', 'C and the critical pressure ratio, both functions of the isentropic exponent alone'],
  ['branch', 'The branch the pressure at the valve outlet decides, and the flat stretch that is what choked means'],
  ['kv', 'The viscosity correction, its clamp, and what each of its three terms is worth where'],
  ['napier', 'The Napier correction, its step, and both of its crossings of unity'],
  ['ladder', 'The API 526 ladder, its selection boundaries and the refusal past the largest'],
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

/**
 * A quantity this course teaches as a stated limit and never as an answer. The
 * heading names WHICH kind of not-derived it is, in the lab's own marker words:
 * held for literature, typed as a published input, or a limit the caller applies.
 */
const Held = ({ label = 'HELD FOR LITERATURE', children }) => (
  <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">{label.toUpperCase()}</p>
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

/** The empty state every view carries before its reader has run. */
export const EMPTY_STATE = 'No engine value has been read yet. This view calls the vendored pressure relief engine through the teaching lab and fills in once it answers.';
const Empty = () => <Note>{EMPTY_STATE}</Note>;

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const RoutesMode = ({ a }) => {
  if (!a) return <Empty />;
  return (
    <>
      <Tbl
        head={['route', 'stream', 'load, stated', 'relieving', 'the COMPUTED factor', 'the TYPED factor', 'certified Kd', 'area in2', 'orifice', 'margin']}
        rows={a.routes.map((r) => [
          r.route, r.stream, r.loadStated, r.relieving,
          `${r.computedFactorName} ${six(r.computedFactor)}`,
          `${r.typedFactorName} ${six(r.typedFactor)}`,
          six(r.certifiedKd), six(r.areaIn2), r.orifice, six(r.margin),
        ])}
      />
      <Note>
        Read the two middle columns down. Each route has exactly one correction the engine worked out from a closed form
        it can state, and exactly one it took as an input off a published chart. That is the shape of API 520 Part I as
        this engine implements it, and it is the question to ask of any number on any of these pages.
      </Note>
      <Held label={TYPED_MARKER}>
        Kb for gas, Kw for liquid and KSH for steam are published charts and tables, so they are typed inputs with their
        references named. Nothing in this package derives any of the three and nothing should. Taught as a limit and
        never as an answer.
      </Held>
    </>
  );
};

export const CoefficientMode = ({ g }) => {
  if (!g) return <Empty />;
  const chart = g.kRows.map((r) => ({
    k: r.k, c: r.c, ratio: r.criticalRatio, f2: r.f2AtPointEight,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="C at the ORUBIRI exponent" value={six(g.kRows[3].c)} />
        <Tile label="The ORUBIRI critical pressure ratio" value={six(g.criticalRatio)} />
        <Tile label="Exponents walked" value={g.kRows.length} />
        <Tile label="F2 read at a pressure ratio of" value={six(0.8)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Both of the first two are functions of the isentropic exponent and of nothing else. No rate, no pressure and no
        temperature enters either of them, which is why they can be drawn against one axis at all.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="k" tick={AXIS} label={{ value: 'isentropic exponent k', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="c" tick={AXIS} />
            <YAxis yAxisId="r" orientation="right" tick={AXIS} domain={[0.4, 1]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="c" dataKey="c" name="C" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line yAxisId="r" dataKey="ratio" name="critical pressure ratio" stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line yAxisId="r" dataKey="f2" name="F2 at a ratio of 0.8" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['k, stated', 'C', 'critical pressure ratio', 'F2 at a ratio of 0.8']}
        rows={g.kRows.map((r) => [six(r.k), six(r.c), six(r.criticalRatio), six(r.f2AtPointEight)])}
      />
      <Note>
        The ratio falls as the exponent rises while C climbs, so a stiffer gas chokes at a lower downstream pressure and
        passes more through the same throat. Both curves come out of the same two closed forms the engine states.
      </Note>
    </>
  );
};

export const BranchMode = ({ g }) => {
  if (!g) return <Empty />;
  const chart = g.branchRows.map((r) => ({
    ratio: r.backRatio,
    area: r.areaIn2,
    f2: r.f2,
    critical: r.critical ? r.areaIn2 : null,
    subcritical: r.critical ? null : r.areaIn2,
  }));
  const lastCritical = g.branchRows.filter((r) => r.critical).slice(-1)[0];
  const firstSub = g.branchRows.find((r) => !r.critical);
  const flat = g.branchRows.filter((r) => r.critical).map((r) => r.areaIn2);
  const flatSpread = Math.max(...flat) - Math.min(...flat);
  return (
    <>
      <TileGrid>
        <Tile label="The critical pressure ratio here" value={six(g.criticalRatio)} />
        <Tile label="Required area, every choked row" value={six(flat[0])} unit="in2" />
        <Tile label="Spread across the choked rows" value={twelve(flatSpread)} unit="in2" />
        <Tile label="First subcritical row" value={six(firstSub.areaIn2)} unit="in2" />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="ratio" tick={AXIS} label={{ value: 'pressure at the valve outlet, as a ratio of the relieving pressure', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="a" tick={AXIS} />
            <YAxis yAxisId="f" orientation="right" tick={AXIS} domain={[0.6, 1]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceArea yAxisId="a" x1={g.branchRows[0].backRatio} x2={g.criticalRatio} fill="#38bdf8" fillOpacity={0.07} />
            <ReferenceLine yAxisId="a" x={g.criticalRatio} stroke="#BFFF00" strokeDasharray="4 3" label={{ value: 'the branch', fill: '#BFFF00', fontSize: 10, position: 'top' }} />
            <Line yAxisId="a" dataKey="critical" name="required area, choked, in2" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} connectNulls={false} />
            <Line yAxisId="a" dataKey="subcritical" name="required area, subcritical, in2" stroke="#fbbf24" strokeWidth={2} dot isAnimationActive={false} connectNulls={false} />
            <Line yAxisId="f" dataKey="f2" name="F2 where subcritical" stroke="#f472b6" dot={false} isAnimationActive={false} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The shaded stretch is flat, and that flatness is the whole meaning of choked. Once the downstream pressure is low
        enough the flow through the throat is set by the upstream condition alone, so the required area does not move
        with the pressure at the valve outlet at all. The spread tile above is that statement as a number rather than as
        a claim about the picture.
      </Note>
      <Tbl
        head={['outlet ratio, stated', 'branch', 'required area in2', 'F2 where subcritical', 'warned']}
        rows={g.branchRows.map((r) => [
          six(r.backRatio), r.critical ? 'choked' : 'subcritical', six(r.areaIn2),
          r.f2 === null ? 'n/a' : six(r.f2), r.warned ? 'yes' : 'no',
        ])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The two rows either side of the crossing are the last choked row at {six(lastCritical.backRatio)} and the first
        subcritical one at {six(firstSub.backRatio)}, and the areas are printed either side so the size of the step is
        visible rather than asserted. Below the crossing a typed Kb divides the area; above it the standard uses F2 and
        the typed Kb has no place in the calculation. The engine says the second half rather than leaving it to be
        discovered:
      </p>
      <Tbl
        head={['branch', 'outlet ratio', 'Kb, stated', 'required area in2']}
        rows={g.kbRows.map((r) => [r.critical ? 'choked' : 'subcritical', six(r.backRatio), six(r.kb), twelve(r.areaIn2)])}
      />
      {g.kbRows.filter((r) => r.warning).map((r) => (
        <Refusal key={`${r.backRatio}-${r.kb}`} label={`a typed Kb of ${six(r.kb)} in the subcritical branch`} message={r.warning} />
      ))}
    </>
  );
};

export const KvMode = ({ l }) => {
  if (!l) return <Empty />;
  const chart = l.kvTerms.map((r) => ({
    logRe: Math.log10(r.reynolds),
    clamped: r.kvClamped,
    unclamped: r.kvUnclamped,
    share: r.lastTermShareDerived,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="AKASO inviscid area" value={six(l.inviscid.areaIn2)} unit="in2" />
        <Tile label="AKASO viscous area" value={six(l.viscous.areaIn2)} unit="in2" />
        <Tile label="Kv, converged" value={six(l.viscous.kv)} />
        <Tile label="Passes the loop took" value={l.viscous.iterations} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The liquid route needs the AREA to find the Reynolds number and the Reynolds number to find the correction that
        sets the area, so the engine iterates and reports what it did. The two areas stand in a ratio of
        {' '}{twelve(l.areaRatioDerived)}, and the converged answer stands to what a single pass would have given in a
        ratio of {twelve(l.convergedOverOnePassDerived)}. A loop that runs out of passes and a loop that reaches its
        residual are the same shape on the answer, so the flag, the pass count and the residual are all returned.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="logRe" tick={AXIS} tickFormatter={(v) => `1e${v.toFixed(0)}`} label={{ value: 'Reynolds number', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="kv" tick={AXIS} domain={[0, 1.05]} />
            <YAxis yAxisId="s" orientation="right" tick={AXIS} domain={[0, 1]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="kv" y={1} stroke="#BFFF00" strokeDasharray="4 3" label={{ value: 'the clamp at one', fill: '#BFFF00', fontSize: 10 }} />
            <ReferenceLine yAxisId="kv" x={Math.log10(l.kvClampReynolds)} stroke="#f87171" strokeDasharray="4 3" label={{ value: 'clamp engages', fill: '#f87171', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine yAxisId="kv" y={l.kvWarnValue} stroke="#fbbf24" strokeDasharray="2 3" label={{ value: 'the envelope warning', fill: '#fbbf24', fontSize: 10 }} />
            <Line yAxisId="kv" dataKey="clamped" name="Kv, as the engine applies it" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="kv" dataKey="unclamped" name="Kv, the raw fit" stroke="#f472b6" strokeDasharray="4 3" dot={false} isAnimationActive={false} />
            <Line yAxisId="s" dataKey="share" name="the inverse three halves term, as a share of the sum" stroke="#fbbf24" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The raw fit rises through one and asymptotes to {twelve(l.kvAsymptote)}, which would let a correction for viscous
        drag ADD capacity, so the engine holds it at one above a Reynolds number of {six(l.kvClampReynolds)}. The
        unclamped fit stays exported, which is why the dashed curve can be drawn at all.
      </Note>
      <Tbl
        head={['Reynolds, stated', 'Kv clamped', 'Kv raw', 'intercept term', 'inverse root term', 'inverse three halves term', 'the last term as a share of the sum']}
        rows={l.kvTerms.map((r) => [
          six(r.reynolds), six(r.kvClamped), six(r.kvUnclamped), six(r.interceptTerm),
          six(r.inverseRootTerm), six(r.inverseThreeHalvesTerm), six(r.lastTermShareDerived),
        ])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The three terms are separated on purpose. One over Kv is the sum of them, and the only honest way to say a term
        has a band is to show what each is worth where. The last term carries {six(l.kvTerms[0].lastTermShareDerived)} of
        the sum at the low end of the sweep and {six(l.kvTerms[7].lastTermShareDerived)} at a Reynolds number of
        {' '}{six(l.kvTerms[7].reynolds)}.
      </p>
      <Tbl
        head={['viscosity cp, stated', 'area in2', 'Kv', 'Reynolds', 'passes', 'converged']}
        rows={l.viscositySweep.map((r) => [
          six(r.muCp), six(r.areaIn2), six(r.kv), r.reynolds === null ? 'n/a' : six(r.reynolds),
          r.iterations, r.converged ? 'yes' : 'no',
        ])}
      />
      <Held>
        The three coefficients of this fit. They are an empirical fit no route in this package can derive, and the
        validation oracle SHARES them with the engine on purpose. Moving one of them in both files leaves every
        published case green, so a green run here is evidence about the sharing and not about the fit. Taught as a limit
        and never as an answer, and nothing graded in this course rests on it.
      </Held>
    </>
  );
};

export const NapierMode = ({ s }) => {
  if (!s) return <Empty />;
  // The step at the threshold is drawn rather than smoothed: the two points a
  // millionth of a psi either side of it are put on the curve, so the vertical
  // drop is on the page instead of being interpolated away.
  const chart = [
    ...s.rows.filter((r) => r.relievingPsia <= s.thresholdPsia).map((r) => ({ p: r.relievingPsia, kn: r.kn, area: r.areaIn2 })),
    { p: s.thresholdPsia, kn: s.knJustBelowThreshold, area: null },
    { p: s.thresholdPsia + 1e-6, kn: s.knJustAboveThreshold, area: null },
    ...s.rows.filter((r) => r.relievingPsia > s.thresholdPsia).map((r) => ({ p: r.relievingPsia, kn: r.kn, area: r.areaIn2 })),
  ];
  return (
    <>
      <TileGrid>
        <Tile label="The threshold, bisected" value={twelve(s.thresholdPsia)} unit="psia" />
        <Tile label="KN a millionth below it" value={twelve(s.knJustBelowThreshold)} />
        <Tile label="KN a millionth above it" value={twelve(s.knJustAboveThreshold)} />
        <Tile label="The step across two millionths" value={twelve(s.stepDerived)} />
      </TileGrid>
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="p" type="number" domain={[1000, 3200]} tick={AXIS} label={{ value: 'relieving pressure, psia', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="kn" tick={AXIS} domain={[0.99, 1.2]} />
            <YAxis yAxisId="a" orientation="right" tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceArea yAxisId="kn" x1={s.thresholdPsia} x2={s.unityCrossingPsia} fill="#f87171" fillOpacity={0.12} />
            <ReferenceLine yAxisId="kn" y={1} stroke="#94a3b8" strokeDasharray="2 3" />
            <ReferenceLine yAxisId="kn" x={s.thresholdPsia} stroke="#f87171" strokeDasharray="4 3" label={{ value: 'the step', fill: '#f87171', fontSize: 10, position: 'insideTopLeft' }} />
            <ReferenceLine yAxisId="kn" x={s.unityCrossingPsia} stroke="#BFFF00" strokeDasharray="4 3" label={{ value: 'back through unity', fill: '#BFFF00', fontSize: 10, position: 'top' }} />
            <Line yAxisId="kn" dataKey="kn" name="KN" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="a" dataKey="area" name="required area at the TEBIDABA load, in2" stroke="#fbbf24" dot={false} isAnimationActive={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The correction steps rather than sliding, and the shaded band is where it sits BELOW one, which makes the
        required area LARGER than the uncorrected one. It leaves unity at {twelve(s.thresholdPsia)} psia and returns
        through unity at {twelve(s.unityCrossingPsia)} psia, a figure the engine also derives and exports as
        {' '}{twelve(s.unityExportedPsia)} psia. A smooth curve through the published rows alone would have hidden both
        edges of that band.
      </Note>
      <Tbl
        head={['relieving psia, stated', 'KN', 'required area in2', 'warned']}
        rows={s.rows.map((r) => [six(r.relievingPsia), six(r.kn), six(r.areaIn2), r.warned ? 'yes' : 'no'])}
      />
      {s.rows.filter((r) => r.warning).slice(0, 1).map((r) => (
        <Refusal key={r.relievingPsia} label={`a relieving pressure of ${six(r.relievingPsia)} psia, inside the band`} message={r.warning} />
      ))}
      <TileGrid>
        <Tile label="TEBIDABA relieving pressure" value={six(s.stream.relievingPsiaDerived)} unit="psia" />
        <Tile label="TEBIDABA KN" value={six(s.stream.kn)} />
        <Tile label="TEBIDABA required area" value={six(s.stream.areaIn2)} unit="in2" />
        <Tile label="Orifice and margin" value={`${s.stream.orifice} at ${six(s.stream.margin)}`} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The superheat factor is the other half of this route and it is a published TABLE, so it is typed. The same case
        at a superheated {six(s.superheated.ksh)} needs {six(s.superheated.areaIn2)} in2, a ratio of
        {' '}{twelve(s.superheatRatioDerived)}. An input that always divides and an input that never moves an answer are
        read differently, and which kind an input is is the first question to ask of it.
      </p>
      <Held>
        The threshold and the top of the published range are published BOUNDARIES. This package can derive neither and
        the suite pins both as behaviour. The fit between them is checked against the standard&apos;s own SI statement.
        Taught as a limit and never as an answer.
      </Held>
    </>
  );
};

export const LadderMode = ({ o }) => {
  if (!o) return <Empty />;
  const chart = o.ladder.map((r) => ({
    orifice: r.orifice, area: r.areaIn2, ratio: r.ratioToTheOneBelow,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Standard orifices in the table" value={o.rowCount} />
        <Tile label="Smallest" value={six(o.ladder[0].areaIn2)} unit="in2" />
        <Tile label="Largest" value={six(o.ladder[o.rowCount - 1].areaIn2)} unit="in2" />
        <Tile label="Streams selected here" value={o.streams.length} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="orifice" tick={AXIS} label={{ value: 'API 526 orifice letter', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="a" tick={AXIS} />
            <YAxis yAxisId="r" orientation="right" tick={AXIS} domain={[1, 2]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {o.streams.map((s, i) => (
              <ReferenceLine
                key={s.stream}
                yAxisId="a"
                y={s.areaIn2}
                stroke={['#38bdf8', '#f472b6', '#fbbf24'][i]}
                strokeDasharray="4 3"
                label={{ value: `${s.stream} needs ${six(s.areaIn2)} in2`, fill: ['#38bdf8', '#f472b6', '#fbbf24'][i], fontSize: 10 }}
              />
            ))}
            <Line yAxisId="a" dataKey="area" name="orifice area, in2" stroke="#e2e8f0" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="r" dataKey="ratio" name="ratio to the one below" stroke="#BFFF00" dot isAnimationActive={false} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The green line is the point. The ladder is not geometric: read the ratio of each row to the one below it top to
        bottom rather than assuming a constant step. It runs from {six(o.ladder[1].ratioToTheOneBelow)} down to
        {' '}{six(o.ladder[9].ratioToTheOneBelow)} and back up again, so the headroom a selection buys depends on where
        on the ladder it lands.
      </Note>
      <Tbl
        head={['letter', 'area in2', 'ratio to the one below']}
        rows={o.ladder.map((r) => [r.orifice, six(r.areaIn2), r.ratioToTheOneBelow === null ? 'n/a' : six(r.ratioToTheOneBelow)])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        Selection is walked across and ON the boundaries, because the rows at an exactly listed area are the ones that
        decide whether the comparison is at-or-above or strictly above.
      </p>
      <Tbl
        head={['required area in2, stated', 'orifice', 'orifice area in2', 'margin', 'note']}
        rows={o.selectionRows.map((r) => [six(r.requiredAreaIn2), r.orifice, six(r.orificeAreaIn2), six(r.margin), r.note])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        Past the largest standard orifice the engine refuses, and the refusal carries the figure that made it true along
        with how many valves the area needs:
      </p>
      {o.pastLargest.map((r) => (
        <Refusal key={r.requiredAreaIn2} label={`a required area of ${six(r.requiredAreaIn2)} in2, needing ${r.multipleOfT} valves`} message={r.error} />
      ))}
      <Tbl
        head={['stream', 'fluid', 'required area in2', 'orifice', 'orifice area in2', 'margin']}
        rows={o.streams.map((r) => [r.stream, r.fluid, six(r.areaIn2), r.orifice, six(r.orificeAreaIn2), six(r.margin)])}
      />
      <Held label={TYPED_MARKER}>
        The fourteen areas of this table. It is a published table and this package cannot derive a single one of them, so
        what the suite checks is the SELECTION BEHAVIOUR: the ladder, both boundaries and the refusal past the largest.
        Taught as a limit and never as an answer, and nothing graded in this course is an orifice letter or a margin.
      </Held>
    </>
  );
};

const SizingExplorer = ({ initialMode = 'routes' }) => {
  const [mode, setMode] = useState(initialMode);
  // THE READERS RUN IN AN EFFECT, so the first paint of every view is the empty
  // state above and no engine number reaches the markup before one has been
  // read.
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const a = useMemo(() => (ready && mode === 'routes' ? safe(associateReading) : null), [ready, mode]);
  const g = useMemo(() => (ready && (mode === 'coefficient' || mode === 'branch') ? safe(gasBranch) : null), [ready, mode]);
  const l = useMemo(() => (ready && mode === 'kv' ? safe(liquidLoop) : null), [ready, mode]);
  const s = useMemo(() => (ready && mode === 'napier' ? safe(steamNapier) : null), [ready, mode]);
  const o = useMemo(() => (ready && mode === 'ladder' ? safe(orificeLadder) : null), [ready, mode]);

  return (
    <PanelShell
      title="Sizing explorer"
      subtitle="The pressure relief device and the three fluids it passes, on ORUBIRI, AKASO and TEBIDABA in API 520 USC units. The four routes side by side, the two functions of the isentropic exponent alone, the branch the pressure at the valve outlet decides, the viscosity loop and its clamp, the Napier step and both of its crossings, and the API 526 ladder from an area to a letter."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'routes' && <RoutesMode a={a} />}
        {mode === 'coefficient' && <CoefficientMode g={g} />}
        {mode === 'branch' && <BranchMode g={g} />}
        {mode === 'kv' && <KvMode l={l} />}
        {mode === 'napier' && <NapierMode s={s} />}
        {mode === 'ladder' && <LadderMode o={o} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored pressure relief engine on the teaching streams,
        printed to the precision the teaching digest prints. Flows are in lb/hr for gas and steam and gpm for liquid,
        pressures in psia except where a row says psig, temperatures in degR, and areas in in2. Back pressure here always
        means the pressure at the relief valve OUTLET, which is not what that phrase means anywhere else on this
        platform.
      </Note>
    </PanelShell>
  );
};

export default SizingExplorer;
