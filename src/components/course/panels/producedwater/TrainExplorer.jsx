import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  theTrain, twoMedians, notAnswering, heldForLiterature, heldItems,
  OGBOTOBO_INLET, OGBOTOBO_BWPD,
} from './producedWaterLab';
import { Refusal, Warning } from './WaterExplorer';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// The train explorer, the Expert tier. The coupling stage by stage, the two
// medians on one basis, and the three ways this engine declines to answer.
//
// A TRAIN CARRIES THE OUTLET DISTRIBUTION FORWARD. Each device removes the
// droplets it is good at, so the next device faces finer water than the inlet
// did and performs worse on it than its own cut size suggests. This page shows
// that as a falling removal column across identical devices, which is the
// cleanest way to see it.
//
// A BLANK IS NOT A FAILURE, and this page is careful about it. When a verdict is
// withheld, the reason is printed and nothing is painted red. That is the FC7-0
// Suite lesson: the studio used to paint a missing specification as a failure.
//
// Every figure on this page is a return value from producedWaterLab, which is a
// return value from the vendored engine on the teaching stream OGBOTOBO.
// Nothing here computes a removal or a median, nothing imports an engine, and
// nothing reads a clock.
//
// NO P LABEL. Nothing here is a distribution a percentile would describe.
//
// COPY RULE: no em dash and no en dash anywhere a learner reads.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');
const orNone = (v) => (v === null || v === undefined ? 'none' : String(v));

export const MODES = [
  ['stages', 'The train stage by stage: removal, outlet concentration and outlet droplet median'],
  ['coupling', 'The coupling isolated: identical devices in series, and the order identity'],
  ['medians', 'Both medians on one basis, and the median that tracks the cut'],
  ['silence', 'The three ways this engine declines to answer'],
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

/**
 * A WITHHELD VERDICT, WHICH IS NOT A FAILURE. It is drawn in the neutral colour
 * on purpose, with the engine's own reason beside it, because painting a
 * withheld verdict red is how the studio told a user their train had failed
 * when nobody had given it a specification.
 */
export const Withheld = ({ reason }) => (
  <div className="mt-2 rounded-md border border-slate-600 bg-slate-800/40 p-2">
    <p className="text-slate-200 text-xs font-medium mb-1">No verdict is reported, and this is the reason</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{reason}</p>
  </div>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const StagesMode = ({ s }) => {
  if (!s) return <Note>The train reader did not return a train.</Note>;
  const chart = s.train.stages.map((st, i) => ({
    stage: `${i + 1}. ${st.name}`,
    removal: st.removalPct,
    outlet: st.outletOiwPpm,
    median: st.outletMedianMicron,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Outlet concentration" value={six(s.train.outletOiwPpm)} unit="ppm" />
        <Tile label="Overall removal" value={six(s.train.overallRemovalPct)} unit="percent" />
        <Tile label="Droplet median, inlet" value={six(s.train.inletMedianMicron)} unit="micron" />
        <Tile label="Droplet median, outlet" value={six(s.train.outletMedianMicron)} unit="micron" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        OGBOTOBO is {OGBOTOBO_BWPD} bwpd of {OGBOTOBO_INLET.oiwPpm} ppm oil at d50 {OGBOTOBO_INLET.d50Micron} micron and
        sigma {OGBOTOBO_INLET.sigma}, through four stages. {s.train.stagesRun} of {s.train.stages.length} stages ran and
        the train is complete. The grid it is integrated on is reported back: {s.train.nBins} bins over
        {' '}{s.train.spanSigma} sigma, with a truncated tail of {twelve(s.train.truncatedTailFraction)}.
      </p>
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 40, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="stage" tick={{ ...AXIS, fontSize: 9 }} interval={0} angle={-15} textAnchor="end" />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="removal" name="removal this stage, percent" fill={SERIES[0]} isAnimationActive={false} />
            <Line dataKey="median" name="outlet droplet median, micron" stroke={SERIES[2]} dot isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['stage', 'cut micron', 'sharpness', 'removal percent', 'outlet ppm', 'outlet median micron']}
        rows={s.train.stages.map((st) => [st.name, six(st.d50cMicron), String(st.sharpness), six(st.removalPct), six(st.outletOiwPpm), six(st.outletMedianMicron)])}
      />
      <Note>
        The two sharpnesses in that table are not a style choice. Three is declared for the gravity and centrifugal
        devices and two is derived for the two interception devices, because interception captures at a rate that goes
        as the square of the droplet diameter, and the difference is worth real percentage points of removal.
      </Note>
      <Withheld reason={s.train.verdictWithheldReason} />
      <Note>{s.train.concentrationBasis}</Note>
    </>
  );
};

export const CouplingMode = ({ s }) => {
  if (!s) return <Note>The train reader did not return the coupling.</Note>;
  const chart = s.identical.stages.map((st, i) => ({
    stage: i + 1, removal: st.removalPct, ratio: s.identicalRatios[i] * 100,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Identical devices in series" value={String(s.identicalStageCount)} />
        <Tile label="Each cutting at" value={String(s.identicalStageCutMicron)} unit="micron" />
        <Tile label="First stage removes" value={six(s.identical.stages[0].removalPct)} unit="percent" />
        <Tile label="Last stage removes" value={six(s.identical.stages[s.identicalStageCount - 1].removalPct)} unit="percent" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        If a device were a fixed efficiency, every bar below would be the same height. Compounding the first stage
        removal five times over would predict an outlet of {six(s.compounded)} ppm. The train says
        {' '}{six(s.identical.outletOiwPpm)} ppm, because the water reaching the fifth device has had its coarse oil
        taken out four times already. A table of fixed efficiencies throws exactly that away.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="stage" tick={AXIS} label={{ value: 'stage', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="removal" name="removal this stage, percent" fill={SERIES[0]} isAnimationActive={false} />
            <Line dataKey="ratio" name="as a percentage of the first stage" stroke={SERIES[3]} dot isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['position', 'device as designed', 'removal percent', 'device reversed', 'removal percent']}
        rows={s.train.stages.map((st, i) => [String(i + 1), st.name, six(st.removalPct), s.reversed.stages[i].name, six(s.reversed.stages[i].removalPct)])}
      />
      <Note>
        Reordering the stages moves every stage removal, by as much as {six(s.worstStageGap)} percentage points, and
        leaves the train outlet exactly where it was: {six(s.train.outletOiwPpm)} ppm both ways, agreeing to
        {' '}{s.outletGap.toExponential(2)} relative, which is float rounding. A device removes a fixed fraction of each
        droplet size, so the volume surviving in any one size bin is the product of the survivals across the devices,
        and a product does not care what order it is taken in. So a reader comparing two trains must compare their
        outlets, and a reader judging one stage must know what reached it.
      </Note>
      <Note>
        The engineering question that identity does not answer is why a designer still puts the coarse device first.
        Fouling, plugging and how much oil each device can take in its reject are what decide that, and this module
        carries none of them. An invariance in a model is a statement about the model.
      </Note>
    </>
  );
};

export const MediansMode = ({ s }) => {
  if (!s) return <Note>The median reader did not return a grid.</Note>;
  const chart = s.tracking.map((r) => ({ cut: r.d50cMicron, median: r.outletMedianMicron, ppm: r.outletOiwPpm }));
  return (
    <>
      <TileGrid>
        <Tile label="Inlet median off the bins" value={six(s.inletMedianMicron)} unit="micron" />
        <Tile label="Against a typed d50 of" value={String(s.inletD50Micron)} unit="micron" />
        <Tile label="Agreeing to" value={s.inletRelativeGap.toExponential(2)} unit="relative" />
        <Tile label="Published bin grid cases" value={String(s.binGrid.length)} />
      </TileGrid>
      <Note>{s.medianBasis}</Note>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="cut" tick={AXIS} label={{ value: 'device cut micron', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="median" name="outlet droplet median, micron" stroke={SERIES[2]} dot isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['cut micron', 'outlet ppm', 'outlet median micron']}
        rows={s.tracking.map((r) => [String(r.d50cMicron), six(r.outletOiwPpm), six(r.outletMedianMicron)])}
      />
      <Note>
        Both medians are the volume median of the same bin set, interpolated in log diameter across the bin the median
        falls in. That is why they can be compared at all. One step of this grid is a few percent of a diameter, so a
        median read as a bare bin midpoint is quantised to the grid, and a bin wide enough to hold six orders of
        magnitude of outlet concentration would report one value for all of them. Interpolated, the median falls
        monotonically as the cut tightens, which is the property a quantised median cannot have.
      </Note>
      <Tbl
        head={['d50 stated', 'sigma stated', 'bins stated', 'span stated', 'golden median', 'golden truncated tail']}
        rows={s.binGrid.map((c) => [String(c.d50), String(c.sigma), String(c.nBinsStated), String(c.spanStated), six(c.medianMicron), twelve(c.truncatedTailFraction)])}
      />
    </>
  );
};

export const SilenceMode = ({ s, h }) => {
  if (!s || !h) return <Note>The refusal reader did not return a census.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Exports carrying the error contract" value={String(s.censusRows.filter((r) => r.refuses === 'an object with a named error').length)} />
        <Tile label="Leaves answering with a bare NaN" value={String(s.leafCount)} />
        <Tile label="Band refusals shown here" value={String(s.bandRefusals.length)} />
        <Tile label="Doors on one bad fluid" value={String(s.doors.length)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        ONE: A REFUSAL. The input is one this method cannot use, so the return is an object carrying a named error and
        nothing that could pass for an answer. Every message below is the engine&apos;s own words.
      </p>
      <Tbl
        head={['export', 'given a question it can answer', 'given one it cannot']}
        rows={s.censusRows.map((r) => [r.name, r.answers, r.refuses])}
      />
      <Note>
        The {s.leafCount} leaves are {s.leafNames.join(', ')}. They are helpers with nowhere to put an error key, so
        they answer with a bare NaN rather than a number that could pass for an answer, and their callers inside the
        module turn that NaN into a named refusal. That is a documented contract rather than an oversight.
      </Note>
      <Refusal label={`The caller that turns a leaf NaN into a name: ${s.leafCaller.label}`} message={s.leafCaller.error} />
      {s.bandRefusals.map((r) => (
        <Refusal key={r.label} label={`The engine refuses ${r.label}`} message={r.error} />
      ))}
      <Note>
        That rise velocity refusal is the first of five doors on one bad fluid, and four of the five are devices. Given
        an oil heavier than its water, every one of them refuses in its own words rather than through one shared
        sentence.
      </Note>
      {s.doors.map((r) => (
        <Refusal key={r.label} label={`The engine refuses ${r.label}`} message={r.error} />
      ))}
      <p className="text-xs text-slate-400 mt-3 mb-0">
        TWO: A WITHHELD VERDICT. The train ran, the concentrations are real, and the pass or fail is not reported, with
        a reason. A three stage train with the plate area box cleared runs {s.broken.stagesRun} of
        {' '}{s.broken.stages.length} stages and still reports {six(s.broken.outletOiwPpm)} ppm out at
        {' '}{six(s.broken.overallRemovalPct)} percent removed, with meetsSpec {orNone(s.broken.meetsSpec)} and
        marginPpm {orNone(s.broken.marginPpm)}.
      </p>
      <Withheld reason={s.broken.verdictWithheldReason} />
      <Withheld reason={s.noSpec.verdictWithheldReason} />
      <Withheld reason={s.zeroSpec.verdictWithheldReason} />
      <Note>
        A specification of zero is a missing input rather than a failing train, and the module says which of the two it
        is. A stage that did not run carries its name and its cause and nothing else, so a stage that is not there
        cannot show a confident process warning beside its own failure.
      </Note>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        THREE: A WARNING. The answer is reported and the module says something about it. A warning withholds nothing,
        and every one of them names a quantity and a threshold.
      </p>
      <Tbl
        head={['spec ppm', 'outlet ppm', 'meets spec', 'margin ppm']}
        rows={s.verdicts.map((r) => [String(r.specPpm), six(r.outletOiwPpm), r.meetsSpec ? 'yes' : 'no', six(r.marginPpm)])}
      />
      <Warning>
        Neither of those two specification figures is a limit. They are two arbitrary numbers, chosen only to show which
        branch of the comparison fires. This module states no discharge limit and neither does this course: the
        specification is the caller&apos;s own, out of the caller&apos;s own permit or regulation.
      </Warning>
      <Held>
        The dissolved and soluble oil floor. No device here removes dissolved oil, so there is a floor under every
        outlet this train reports, and its value is not in this module. {h.dissolvedOilNote} With no floor given the
        train reports {six(h.train.outletOiwPpm)} ppm and floorApplied {String(h.train.floorApplied)}. Any discharge
        limit at all is held the same way: the engine states none and a test asserts it states none.
      </Held>
    </>
  );
};

const TrainExplorer = ({ initialMode = 'stages' }) => {
  const [mode, setMode] = useState(initialMode);
  const t = useMemo(() => ((mode === 'stages' || mode === 'coupling') ? safe(theTrain) : null), [mode]);
  const m = useMemo(() => (mode === 'medians' ? safe(twoMedians) : null), [mode]);
  const s = useMemo(() => (mode === 'silence' ? safe(notAnswering) : null), [mode]);
  const h = useMemo(() => (mode === 'silence' ? safe(heldForLiterature) : null), [mode]);
  const held = useMemo(() => safe(heldItems) || [], []);

  return (
    <PanelShell
      title="Train explorer"
      subtitle="OGBOTOBO through four stages: what each stage removes, what the water looks like afterwards, both droplet medians on one basis, and the three ways this engine declines to answer."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'stages' && <StagesMode s={t} />}
        {mode === 'coupling' && <CouplingMode s={t} />}
        {mode === 'medians' && <MediansMode s={m} />}
        {mode === 'silence' && <SilenceMode s={s} h={h} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored Produced Water Treatment engine on the teaching
        stream OGBOTOBO. Where the engine refuses, this page shows the refusal and the cause it named. Where a verdict
        is withheld, this page shows the reason and paints nothing as a failure. Six of this module&apos;s quantities are
        HELD FOR LITERATURE and are taught as absences rather than as answers: {held.map((h2) => h2.title).join('; ')}.
      </Note>
    </PanelShell>
  );
};

export default TrainExplorer;
