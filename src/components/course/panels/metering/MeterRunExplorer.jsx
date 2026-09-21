import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot,
} from 'recharts';
import {
  ABOH, meterRun, inchOfWater, coefficientSurface, smallBoreBoundary, publishedBetaRange, downTheSpan,
} from './meteringLab';
import {
  PanelShell, NumField, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// THE METER RUN, the Associate tier. A meter run is the first of three places
// in this course where a number that looks like a measurement is a design
// judgement with a standard behind it. The orifice equation is simple. Its
// UNCERTAINTY is the subject, and the uncertainty budget on this page moves
// when the learner moves the plate.
//
// MOVE THE BORE AND WATCH THE BOUNDARY GET CROSSED. The beta is a returned
// value and so is the flag that says whether it is inside the range the
// flange-tap correlation is published for. Take the bore past the top of that
// range and the flag turns over and the engine's own warning appears. Take the
// differential down the span and the transmitter's contribution climbs until it
// takes the budget over from the discharge coefficient.
//
// EVERY NUMBER ON THIS PAGE IS A RETURN VALUE from meteringLab, which is a
// return value from the vendored metering engine. This panel computes no
// metering quantity, imports no engine, reads no clock and draws no random
// number. Every comparison it shows is a RELATION the lab computed: both
// values, their difference and their ratio.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no percentile
// label appears anywhere on this page.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const raw = (v) => (v === null || v === undefined ? 'none' : String(v));
const num = (v, fallback) => (Number.isFinite(Number(v)) && String(v).trim() !== '' ? Number(v) : fallback);

export const MODES = [
  ['run', 'One run, end to end: what the engine returns and the budget that belongs to it'],
  ['surface', 'The coefficient is computed: across beta, across four decades of Reynolds number'],
  ['span', 'Down the span: where the transmitter takes the budget over'],
  ['measured', 'Measured rather than typed: the inch of water, the small bore, the published edges'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const LINES = ['#38bdf8', '#BFFF00', '#f472b6', '#fbbf24', '#a78bfa'];

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

/** A RELATION, printed the only way this course allows two numbers to be
 *  compared: both values, their difference and their ratio, all computed. */
export const Relation = ({ r }) => (r ? (
  <div className="mt-3 rounded-md border border-slate-700 bg-[#0F172A] p-3">
    <p className="text-slate-400 text-xs mb-2">RELATION: {r.label}</p>
    <Tbl
      head={['', 'value', 'difference (first less second)', 'ratio (first over second)']}
      rows={[
        [r.firstLabel, six(r.first), six(r.differenceDerived), six(r.ratioDerived)],
        [r.secondLabel, six(r.second), '', ''],
      ]}
    />
  </div>
) : null);

/** A refusal shown as a refusal. The message is the engine's, through the lab.
 *  Never a blank, a zero, a dash or a placeholder, because all four read as a
 *  number the tool failed to compute rather than as an answer being refused. */
export const Refusal = ({ label, message }) => (message ? (
  <div className="mt-2 rounded-md border border-red-800/60 bg-red-950/20 p-2">
    <p className="text-red-300 text-xs font-medium mb-1">{label}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{message}</p>
  </div>
) : null);

/** A quantity the engine says is its own stated data. A panel that shows one
 *  says on the screen whose figure it is. */
export const Provenance = ({ children }) => (
  <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">THE ENGINE&apos;S OWN STATED DATA</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{children}</p>
  </div>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const RunMode = ({ r }) => {
  if (!r) return <Note>The run reader did not answer.</Note>;
  if (r.refused) return <Refusal label="The engine will not compute this run" message={r.error} />;
  const b = r.budget;
  const chart = b ? b.contributions.map((c) => ({ term: c.name, share: c.shareOfVariancePct })) : [];
  return (
    <>
      <TileGrid>
        <Tile label="Beta" value={six(r.beta)} />
        <Tile label="Inside the published range" value={String(r.betaInPublishedRange)} />
        <Tile label="Discharge coefficient" value={six(r.cd)} />
        <Tile label="Expansibility" value={six(r.expansibility)} />
        <Tile label="Pipe Reynolds number" value={four(r.reynolds)} />
        <Tile label="Mass flow" value={four(r.massLbHr)} unit="lb/hr" />
        <Tile label="Volume at the flowing density" value={four(r.volumetricFt3HrAtFlowing)} unit="ft3/hr" />
        <Tile label="Differential" value={six(r.dpPsi)} unit="psi" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The beta is a returned value and so is the flag beside it. Drive the orifice bore above the top of the
        published range and the flag turns over and the engine writes a warning. That is the boundary this whole
        module lives at. The volume is at the FLOWING density the run was given: there is no base pressure and no base
        temperature anywhere in the function, so nothing on that line is a standard volume.
      </p>
      <Refusal label="The engine's warning on this beta" message={r.warning} />
      <Provenance>{r.reynoldsBasis}</Provenance>
      {b ? (
        <>
          <p className="text-xs text-slate-400 mt-3 mb-0">
            THE UNCERTAINTY IS THE SUBJECT. Each input&apos;s uncertainty is multiplied by the sensitivity of the flow
            to that input, read off the orifice equation itself, and the six are combined as a root sum of squares.
            The total is {six(b.totalUncertaintyPct)} percent of flow.
          </p>
          <Tbl
            head={['term', 'sensitivity', 'uncertainty, pct', 'contribution, pct', 'share of variance, pct']}
            rows={b.contributions.map((c) => [c.name, six(c.sensitivity), six(c.uncertaintyPct), six(c.contributionPct), six(c.shareOfVariancePct)])}
          />
          <TileGrid>
            <Tile label="Total uncertainty" value={six(b.totalUncertaintyPct)} unit="percent of flow" />
            <Tile label="Dominant term" value={b.dominant} />
            <Tile label="Runner up" value={b.runnerUp} />
            <Tile label="The dominance is clear" value={String(b.dominanceIsClear)} />
          </TileGrid>
          <Relation r={b.leadRelation} />
          <p className="text-xs text-slate-400 mt-3 mb-0">
            WHERE THE DIFFERENTIAL TERM COMES FROM. The engine derives it from the transmitter whenever a reading and a
            span are both given, and it says which of the two routes it took. That is what stops a screen showing a
            transmitter figure beside a budget that disagrees with it.
          </p>
          <div className="mt-2 rounded-md border border-slate-700 bg-[#0F172A] p-2">
            <p className="text-xs text-slate-300 font-mono mb-0">{b.differentialUncertaintySource}</p>
          </div>
          <Relation r={r.routeRelation} />
          <div className="h-44 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="term" tick={{ ...AXIS, fontSize: 9 }} interval={0} />
                <YAxis tick={AXIS} />
                <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="share" name="share of variance, percent" fill="#38bdf8" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 rounded-md border border-slate-700 bg-[#0F172A] p-2">
            <p className="text-xs text-slate-300 font-mono mb-0">{b.note}</p>
          </div>
        </>
      ) : <Refusal label="The budget was refused" message={r.budgetError} />}
      {r.transmitter ? (
        <>
          <TileGrid>
            <Tile label="Transmitter, percent of reading" value={six(r.transmitter.uncertaintyPctOfReading)} />
            <Tile label="Differential turndown" value={six(r.transmitter.differentialTurndown)} />
            <Tile label="Flow turndown" value={six(r.transmitter.flowTurndown)} />
            <Tile label="Permanent loss" value={r.permanentLoss ? six(r.permanentLoss.lossInH2O) : 'none'} unit="in H2O" />
          </TileGrid>
          <div className="mt-2 rounded-md border border-slate-700 bg-[#0F172A] p-2">
            <p className="text-xs text-slate-300 font-mono mb-0">{r.transmitter.turndownNote}</p>
          </div>
          <Refusal label="The engine's turndown warning" message={r.transmitter.warning} />
        </>
      ) : <Refusal label="The transmitter was refused" message={r.transmitterError} />}
    </>
  );
};

export const SurfaceMode = ({ s }) => {
  if (!s) return <Note>The coefficient reader did not answer.</Note>;
  const chart = s.rows.map((row) => {
    const o = { beta: row.beta };
    row.cells.forEach((c, i) => { o[`re${i}`] = c.cd; });
    return o;
  });
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        A course that used a constant coefficient would be wrong by more than the uncertainty anybody is arguing about.
        The engine computes the published correlation instead, and the span of this table is the measurement of that.
        {' '}{s.inPublishedRangeCount} of these cells sit inside the published beta range. Tree: {s.countTree}.
        Rule: {s.countRule}.
      </p>
      <Tbl
        head={['beta', ...s.reynolds.map((re) => `Re ${re.toExponential(0)}`)]}
        rows={s.rows.map((row) => [six(row.beta), ...row.cells.map((c) => six(c.cd))])}
      />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="beta" tick={AXIS} label={{ value: 'beta', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {s.reynolds.map((re, i) => (
              <Line key={re} dataKey={`re${i}`} name={`Re ${re.toExponential(0)}`} stroke={LINES[i % LINES.length]} dot={false} isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Relation r={s.spanRelation} />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The engine refuses to assume a coefficient anywhere it needs one. The permanent loss relation takes the
        coefficient of the run as a required argument and says why when it is missing:
      </p>
      <Refusal label="A permanent loss asked for with no coefficient" message={s.assumedCoefficientRefusal} />
    </>
  );
};

export const SpanMode = ({ d }) => {
  if (!d) return <Note>The span reader did not answer.</Note>;
  const chart = d.rows.map((r) => ({
    reading: r.dpInH2O, transmitter: r.uncertaintyPctOfReading, total: r.totalUncertaintyPct,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Span" value={six(d.spanInH2O)} unit="in H2O" />
        <Tile label="The turndown warning starts below" value={six(d.warningEdge.at)} unit="in H2O" />
        <Tile label="The dominant term changes name at" value={six(d.dominanceEdge.at)} unit="in H2O" />
        <Tile label="The lead stops being clear at" value={six(d.clearEdge.at)} unit="in H2O" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        All three readings above are found by bisecting what the engine returns rather than by argument: the warning
        going from empty to a sentence, the NAME of the dominant term, and the flag that says whether the lead is
        clear. Above {six(d.dominanceEdge.at)} in H2O the engine names {raw(d.dominantAbove)}; below it the engine
        names {raw(d.dominantBelow)}. At that reading the total is {six(d.totalAtChangePct)} percent and the flow
        turndown is {six(d.flowTurndownAtChange)}.
      </p>
      <Tbl
        head={['reading, in H2O', 'transmitter, pct of reading', 'dP turndown', 'flow turndown', 'warning', 'total, pct', 'dominant term', 'its share, pct', 'clear']}
        rows={d.rows.map((r) => [
          six(r.dpInH2O), six(r.uncertaintyPctOfReading), six(r.differentialTurndown), six(r.flowTurndown),
          r.warningFires ? 'fires' : 'silent', six(r.totalUncertaintyPct), r.dominant, six(r.dominantShareOfVariancePct), String(r.dominanceIsClear),
        ])}
      />
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="reading" tick={AXIS} reversed label={{ value: 'reading, in H2O', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={d.dominanceEdge.at} stroke="#f472b6" strokeDasharray="3 3" label={{ value: 'the dominant term changes name', fill: '#f472b6', fontSize: 9 }} />
            <Line dataKey="transmitter" name="transmitter, percent of reading" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="total" name="total uncertainty, percent" stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Relation r={d.spanRelation} />
      <Relation r={d.limitRelation} />
      <div className="mt-3 rounded-md border border-slate-700 bg-[#0F172A] p-2">
        <p className="text-xs text-slate-300 font-mono mb-0">{d.turndownNote}</p>
      </div>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        THE MARGIN IS PART OF THE RESULT. A ranking of six numbers with no margin will name a winner on a photo finish.
        The engine returns whether the lead is clear and writes a different note in the two cases:
      </p>
      <div className="mt-2 rounded-md border border-slate-700 bg-[#0F172A] p-2">
        <p className="text-xs text-slate-300 font-mono mb-2">{d.clearNote}</p>
        <p className="text-xs text-slate-300 font-mono mb-0">{d.closeNote}</p>
      </div>
      <Refusal label="A reading above the transmitter span" message={d.aboveTheSpanRefusal} />
    </>
  );
};

export const MeasuredMode = ({ w, sb, br }) => {
  if (!w || !sb || !br) return <Note>The measured readers did not answer.</Note>;
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        Every constant on this page is MEASURED out of the engine rather than typed into this panel. A constant written
        as a literal here would be a claim about the engine rather than a reading of it.
      </p>
      <TileGrid>
        <Tile label="The inch of water, measured" value={String(w.factorDerived)} unit="psi per in H2O" />
        <Tile label="The two runs agree to the last bit" value={String(w.agreeToTheLastBit)} />
        <Tile label="Inputs the two runs share" value={w.sharedInputs.length === 0 ? 'none' : w.sharedInputs.join(', ')} />
        <Tile label="The small bore correction applies below" value={six(sb.edge.at)} unit="in" />
      </TileGrid>
      <Tbl
        head={['', 'differential given, in H2O', 'differential returned, psi', 'the factor that implies']}
        rows={w.runs.map((r) => [r.label, six(r.dpInH2O), six(r.dpPsi), String(r.factorDerived)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Two runs sharing no other input return differentials in psi whose quotients with the inches of water they were
        given are the same double. That is what makes this a constant rather than a coincidence.
      </p>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        THE SMALL BORE CORRECTION, and the bore it turns on at, found by bisecting the engine&apos;s own flag. The
        search ran {raw(sb.edge.halvings)} halvings and the flag reads {raw(sb.edge.readingFrom)} at
        {' '}{six(sb.edge.from)} in and {raw(sb.edge.readingTo)} at {six(sb.edge.to)} in, so the edge discriminates.
      </p>
      <Tbl
        head={['pipe bore, in', 'coefficient', 'correction applied']}
        rows={sb.rows.map((r) => [six(r.pipeIdIn), six(r.cd), String(r.correctionApplied)])}
      />
      <Relation r={sb.eitherSide} />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        THE PUBLISHED BETA RANGE. Both edges are found by bisecting the engine&apos;s own flag, and the beta the trade
        warning starts above is found by bisecting the warning going from empty to a sentence.
      </p>
      <TileGrid>
        <Tile label="Lower edge of the published range" value={six(br.lower.at)} unit="beta" />
        <Tile label="Upper edge of the published range" value={six(br.upper.at)} unit="beta" />
        <Tile label="The trade warning starts above" value={six(br.trade.at)} unit="beta" />
        <Tile label="Each edge discriminates" value={String(br.lower.discriminates && br.upper.discriminates && br.trade.discriminates)} />
      </TileGrid>
      <Refusal label="Above the upper edge, in the engine's own words" message={br.aboveTheRange} />
      <Refusal label="The trade warning, in the engine's own words" message={br.tradeWarning} />
    </>
  );
};

const MeterRunExplorer = ({ initialMode = 'run' }) => {
  const [mode, setMode] = useState(initialMode);
  const [orificeIdIn, setOrificeIdIn] = useState(String(ABOH.orificeIdIn));
  const [dpInH2O, setDpInH2O] = useState(String(ABOH.dpInH2O));
  const [spanInH2O, setSpanInH2O] = useState(String(ABOH.spanInH2O));

  const input = useMemo(() => ({
    ...ABOH,
    orificeIdIn: num(orificeIdIn, ABOH.orificeIdIn),
    dpInH2O: num(dpInH2O, ABOH.dpInH2O),
    spanInH2O: num(spanInH2O, ABOH.spanInH2O),
  }), [orificeIdIn, dpInH2O, spanInH2O]);

  const r = useMemo(() => (mode === 'run' ? safe(() => meterRun(input)) : null), [mode, input]);
  const s = useMemo(() => (mode === 'surface' ? safe(() => coefficientSurface(input.pipeIdIn)) : null), [mode, input]);
  const d = useMemo(() => (mode === 'span' ? safe(() => downTheSpan(input)) : null), [mode, input]);
  const w = useMemo(() => (mode === 'measured' ? safe(inchOfWater) : null), [mode]);
  const sb = useMemo(() => (mode === 'measured' ? safe(() => smallBoreBoundary()) : null), [mode]);
  const br = useMemo(() => (mode === 'measured' ? safe(() => publishedBetaRange()) : null), [mode]);

  return (
    <PanelShell
      title="Meter run explorer"
      subtitle="An orifice run in field units: the two bores, the differential, the static pressure and the fluid going in, and the coefficient, the expansibility, the Reynolds number, the mass flow and a six term uncertainty budget coming back. Move the bore past the top of the published beta range and watch the engine's own flag turn over."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <NumField label="Orifice bore, in" value={orificeIdIn} onChange={setOrificeIdIn} />
        <NumField label="Differential, in H2O" value={dpInH2O} onChange={setDpInH2O} />
        <NumField label="Transmitter span, in H2O" value={spanInH2O} onChange={setSpanInH2O} />
      </FieldGrid>
      <Note>
        The pipe bore, the static pressure, the flowing density, the viscosity and the specific heat ratio are held at
        the teaching run&apos;s stated values. The three boxes above are the ones that cross a boundary.
      </Note>
      <div className="mt-3">
        {mode === 'run' && <RunMode r={r} />}
        {mode === 'surface' && <SurfaceMode s={s} />}
        {mode === 'span' && <SpanMode d={d} />}
        {mode === 'measured' && <MeasuredMode w={w} sb={sb} br={br} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored metering engine, reached through the teaching lab,
        printed to the precision the lessons use for its class. Beta ratios, differentials in psi and
        percentages to six decimals; Reynolds numbers, mass flows and volumes to four.
      </Note>
    </PanelShell>
  );
};

export default MeterRunExplorer;
