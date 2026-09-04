import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, ReferenceLine, ReferenceArea,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { candidateExplorer } from './interventionLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Candidate explorer, the Expert tier. WHAT THE FIT LEFT OUT.
//
// Four modes. The samples the classifier discarded, fitted on their own,
// against the fit that kept the rest; the window dial swept with the setting
// where the verdict flips marked and the margin against the boundary stated; a
// missing column read as a zero, with the flat branch and its unearned
// assertion side by side; and the guards, including the one that decides
// nothing and the zero-variance guard that fires by accident depending on the
// sample count and the value together.
//
// Every figure on this page is a return value from interventionLab, which is a
// return value from the vendored intervention diagnostics engine. Nothing here
// fits, classifies or screens anything.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const tiny = (v) => {
  if (!Number.isFinite(v)) return '-';
  if (v === 0) return '0';
  return Math.abs(v) < 0.0005 ? v.toExponential(3) : fmt(v, 8);
};

const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['discarded', 'The evidence that argues the other way, and where it goes'],
  ['dial', 'The dial swept, and the setting where the verdict flips'],
  ['missing', 'A missing column read as a zero'],
  ['guards', 'The guards: one decides nothing, one fires by accident'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

// --------------------------------------------------------------------------

const Discarded = () => {
  const data = useMemo(() => {
    try {
      return {
        dropped: candidateExplorer.discarded(),
        fit: candidateExplorer.discardedFit(0.5),
        samples: candidateExplorer.samples(),
        spanLoss: candidateExplorer.spanLoss(),
        falling: candidateExplorer.fallingOnly(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.fit.ok) {
    return (
      <Note>
        Fewer than three of the discarded samples are strictly positive in both time and ratio, so
        the stretch cannot be fitted on its own either. When neither the kept samples nor the
        dropped ones carry a slope, the honest answer is that the history does not settle the
        question.
      </Note>
    );
  }
  const f = data.fit;
  const chart = data.samples.map((s) => ({
    tDays: s.tDays,
    kept: s.derivativeIsPositive ? s.ratio : null,
    dropped: s.derivativeIsPositive ? null : s.ratio,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Samples the derivative fit discarded" value={fmt(f.droppedCount, 0)} />
        <Tile label="Slope through the discarded stretch" value={fmt(f.droppedRatioSlope, 9)} />
        <Tile label="Its fit quality, as a fraction" value={fmt(f.droppedRatioR2Fraction, 9)} />
        <Tile label="The fit quality behind the verdict" value={fmt(f.reportedDerivativeR2Fraction, 9)} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="tDays" type="number" scale="log" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'producing time, days', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis type="number" scale="log" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'water-oil ratio', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={f.chokedOnDay} stroke="#f97316" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="kept" name="samples the derivative fit kept" stroke="#BFFF00" dot connectNulls={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="dropped" name="samples it discarded" stroke="#f97316" dot connectNulls={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE CLASSIFIER BUILDS ITS DERIVATIVE FIT FROM THE SAMPLES WHOSE DERIVATIVE IS POSITIVE, AND
        THE MEASUREMENT THEN FILTERS AGAIN ON THE SAME TEST. A late window whose ratio has TURNED
        BACK DOWN is therefore read entirely on the samples from before the turn. The well was
        beaned back on day {fmt(f.chokedOnDay, 0)} and the ratio falls from
        {' '}{fmt(f.firstDroppedDay, 6)} days onward. At a window of {fmt(f.lateFraction, 2)},
        starting day {fmt(f.lateFromT, 6)}, the derivative fit used {fmt(f.samplesUsed, 0)} samples
        and dropped {fmt(f.samplesDroppedInsideTheWindow, 0)}, and reported a derivative slope of
        {' '}{fmt(f.reportedDerivativeSlope, 9)}, which clears the channelling threshold, and
        mechanism {f.reportedMechanismLabel}, which is the treatable one.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">discarded sample</th>
              <th className="text-left pr-3">time, days</th>
              <th className="text-left pr-3">water-oil ratio</th>
              <th className="text-left">derivative</th>
            </tr>
          </thead>
          <tbody>
            {data.dropped.map((r) => (
              <tr key={r.index}>
                <td className="pr-3">{fmt(r.index, 0)}</td>
                <td className="pr-3">{fmt(r.tDays, 6)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.ratio, 9)}</td>
                <td>{fmt(r.derivative, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">two fits on one history</th>
              <th className="text-left pr-3">samples</th>
              <th className="text-left pr-3">slope</th>
              <th className="text-left pr-3">fit quality, as a fraction</th>
              <th className="text-left">what it argues</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-3">the discarded stretch, fitted on its own</td>
              <td className="pr-3">{fmt(f.droppedRatioN, 0)}</td>
              <td className="pr-3 text-[#f97316]">{fmt(f.droppedRatioSlope, 9)}</td>
              <td className="pr-3">{fmt(f.droppedRatioR2Fraction, 9)}</td>
              <td>a rate cut followed by a falling ratio, which is the coning field test</td>
            </tr>
            <tr>
              <td className="pr-3">the samples the engine kept</td>
              <td className="pr-3">{fmt(f.samplesUsed, 0)}</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(f.reportedDerivativeSlope, 9)}</td>
              <td className="pr-3">{fmt(f.reportedDerivativeR2Fraction, 9)}</td>
              <td>a derivative climbing faster than proportionally, which is channelling</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE DISCARDED FIT IS THE CLEANER OF THE TWO: {yn(f.theDiscardedFitIsCleaner)}, by
        {' '}{tiny(f.r2AdvantageOfTheDiscardedFit)} of fit quality. Channelling and coning need
        OPPOSITE treatments and recommending the wrong one is money down a hole, and this one
        history argues both. The engine reports only the treatable one. AND IT KNOWS. Two lines
        after building that fit it counts the samples whose derivative is negative, and it reads
        that count only where the derivative fit FAILED. Whenever three positive samples survive
        the count is discarded, and so is the note it carries: {f.theUnreachableNote}
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the dial</th>
              <th className="text-left pr-3">the window actually runs, log cycles</th>
              <th className="text-left pr-3">the span the fit reports</th>
              <th className="text-left pr-3">lost to the drop</th>
              <th className="text-left pr-3">the minimum span allowed</th>
              <th className="text-left pr-3">clears it by</th>
              <th className="text-left">mechanism</th>
            </tr>
          </thead>
          <tbody>
            {data.spanLoss.map((r) => (
              <tr key={r.lateFraction}>
                <td className="pr-3">{fmt(r.lateFraction, 2)}</td>
                <td className="pr-3">{fmt(r.windowRunsDecades, 9)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.reportedSpanDecades, 9)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.lossDecades, 9)}</td>
                <td className="pr-3">{fmt(r.minSpanDecades, 2)}</td>
                <td className="pr-3">{fmt(r.clearsTheGateBy, 9)}</td>
                <td>{r.mechanismId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        AND IT COMPOUNDS. Dropping the contrary samples also SHORTENS the stretch of log time the
        fit sits on, and the span has a gate of its own. At the shorter windows the loss is the
        difference between a reading and a refusal, and where the span is not reported at all the
        engine returned an indeterminate mechanism instead: that is the gate firing.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE PATH THAT DOES READ THE COUNT, so you can see what the engine would have said. Take the
        last {fmt(data.falling.sampleCount, 0)} samples with every derivative negative, so no
        positive sample survives and the derivative fit fails outright. The mechanism comes back
        {' '}{data.falling.mechanismLabel} at {data.falling.confidence} confidence, treatable
        {' '}{yn(data.falling.treatable)}, on a window starting day {fmt(data.falling.lateFromT, 6)}
        {' '}with a ratio slope of {fmt(data.falling.worSlope, 9)} at a fit quality of
        {' '}{fmt(data.falling.worR2Fraction, 9)}. The note it carries is the one that is otherwise
        unreachable:
      </div>
      <ul className="mt-1 text-xs text-slate-400 list-disc pl-5 space-y-1">
        {data.falling.notes.map((n) => (<li key={n.slice(0, 40)}>{n}</li>))}
      </ul>
      <Note>
        What to do with this in practice is not to distrust the classifier, it is to look at the
        point count. Whenever the derivative fit used fewer samples than the window holds, ask what
        the missing ones were doing, because on a water history the answer is almost always that
        the ratio turned back down and the reading that survives is the one that recommends
        spending money.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Dial = () => {
  const data = useMemo(() => {
    try {
      return {
        sweep: candidateExplorer.windowSweep(),
        flip: candidateExplorer.flip(),
        clamp: candidateExplorer.clamp(),
        thresholds: candidateExplorer.thresholds(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return (
      <Note>
        The dial is clamped rather than validated, so a value outside the range it accepts is
        silently replaced instead of refused. With no history behind it there is nothing to sweep
        and nothing to clamp.
      </Note>
    );
  }
  const flip = data.flip;
  const chart = data.sweep.map((r) => ({
    lateFraction: r.lateFraction, derivativeSlope: r.derivativeSlope, margin: r.marginToThreshold,
  }));
  const band = data.thresholds.find((t) => t.key === 'ambiguousBand');
  const channelling = data.thresholds.find((t) => t.key === 'channellingSlope');
  return (
    <>
      <TileGrid>
        <Tile label="Settings swept" value={fmt(flip.settingsSwept, 0)} />
        <Tile label="Settings that recommend a squeeze" value={fmt(flip.treatableSettings, 0)} />
        <Tile label="The verdict flips between" value={`${fmt(flip.flipFromFraction, 2)} and ${fmt(flip.flipToFraction, 2)}`} />
        <Tile label="Margin at the default setting" value={fmt(flip.defaultMargin, 9)} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="lateFraction" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'how much of the history counts as late', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'derivative slope', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceArea
              y1={(channelling ? channelling.value : 1.3) - (band ? band.value : 0.25)}
              y2={(channelling ? channelling.value : 1.3) + (band ? band.value : 0.25)}
              fill="#f97316" fillOpacity={0.1} />
            <ReferenceLine y={channelling ? channelling.value : 1.3} stroke="#f97316" strokeDasharray="4 4" />
            {flip.flipToFraction !== null && (
              <ReferenceLine x={flip.flipToFraction} stroke="#38bdf8" strokeDasharray="2 4" />
            )}
            <Line type="monotone" dataKey="derivativeSlope" name="derivative slope" stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE SPEND IS DECIDED ON A DIAL, NOT ON THE DATA. Not one datum changes across the table
        below. The dial has a default of {fmt(flip.defaultFraction, 2)}, no guidance anywhere in
        the module, no sweep helper, and nothing in the return object that names its effect. Across
        its range the derivative slope moves by {fmt(flip.slopeRange, 9)}, from
        {' '}{fmt(flip.lowestSlope, 9)} to {fmt(flip.highestSlope, 9)}, while the margin to the
        channelling THRESHOLD at the default setting is only {fmt(flip.defaultMargin, 9)}. The dial
        moves the answer further than the margin the answer sits on:
        {' '}{yn(flip.theDialMovesTheSlopeFurtherThanTheDefaultMarginToTheThreshold)}. The verdict
        flips between {fmt(flip.flipFromFraction, 2)}, where the slope is
        {' '}{fmt(flip.flipFromSlope, 9)} and the margin {fmt(flip.flipFromMargin, 9)}, and
        {' '}{fmt(flip.flipToFraction, 2)}, where the slope is {fmt(flip.flipToSlope, 9)} and the
        margin {fmt(flip.flipToMargin, 9)}. Between those two settings a shutoff squeeze stops
        being a candidate and becomes a block.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the dial</th>
              <th className="text-left pr-3">window starts, days</th>
              <th className="text-left pr-3">samples used of samples in the window</th>
              <th className="text-left pr-3">derivative slope</th>
              <th className="text-left pr-3">margin to the threshold</th>
              <th className="text-left pr-3">fit quality, fraction</th>
              <th className="text-left pr-3">mechanism</th>
              <th className="text-left pr-3">close to the boundary</th>
              <th className="text-left">water shutoff</th>
            </tr>
          </thead>
          <tbody>
            {data.sweep.map((r) => (
              <tr key={r.lateFraction}>
                <td className="pr-3">{fmt(r.lateFraction, 2)}{r.isDefault ? ' (default)' : ''}</td>
                <td className="pr-3">{fmt(r.lateFromT, 6)}</td>
                <td className="pr-3">{fmt(r.latePositiveDerivatives, 0)} of {fmt(r.lateSamples, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.derivativeSlope, 9)}</td>
                <td className="pr-3">{fmt(r.marginToThreshold, 9)}</td>
                <td className="pr-3">{fmt(r.derivativeR2Fraction, 9)}</td>
                <td className="pr-3">{r.mechanismLabel}</td>
                <td className="pr-3">{yn(r.ambiguous)}</td>
                <td className={r.waterShutoffBlocked ? 'text-[#f97316]' : 'text-[#BFFF00]'}>{r.waterShutoffVerdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the dial as handed in</th>
              <th className="text-left pr-3">what it was clamped to</th>
              <th className="text-left pr-3">clamped</th>
              <th className="text-left pr-3">refused</th>
              <th className="text-left pr-3">window starts, days</th>
              <th className="text-left">mechanism</th>
            </tr>
          </thead>
          <tbody>
            {data.clamp.map((r) => (
              <tr key={r.handedIn}>
                <td className="pr-3">{fmt(r.handedIn, 2)}</td>
                <td className="pr-3">{fmt(r.clampedTo, 2)}</td>
                <td className={r.wasClamped ? 'pr-3 text-[#f97316]' : 'pr-3'}>{yn(r.wasClamped)}</td>
                <td className="pr-3">{yn(r.refused)}</td>
                <td className="pr-3">{fmt(r.lateFromT, 6)}</td>
                <td>{r.mechanismLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        THE CLAMP IS THE ONE THING ABOUT THIS DIAL DOCUMENTED NOWHERE. A value outside the range is
        silently replaced and never refused, so a caller who passes zero, or a negative number, or
        a percentage where a fraction was wanted, gets an answer rather than an error, and the
        answer is a real mechanism on a real window. Nothing in the return says the value it used
        is not the value it was given.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Missing = () => {
  const [which, setWhich] = useState('water');
  const data = useMemo(() => {
    try {
      return {
        water: candidateExplorer.waterSpellings(),
        gas: candidateExplorer.gasSpellings(),
        gasHead: candidateExplorer.gasHeadline(),
        gasSamples: candidateExplorer.gasSamples(),
        coercion: candidateExplorer.coercion(),
        flat: candidateExplorer.flatBranch(),
        fluid: candidateExplorer.fluidBlindness(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return (
      <Note>
        A history whose derivative column was never computed is still a history the classifier will
        read. It requires the time and the ratio to be finite and never the derivative, so what
        happens next depends entirely on how the missing value was spelled.
      </Note>
    );
  }
  const rows = which === 'water' ? data.water : data.gas;
  return (
    <>
      <FieldGrid>
        <SelectField label="Which history was exported without its derivative" value={which} onChange={setWhich}
          options={[
            ['water', 'The teaching water-oil ratio history'],
            ['gas', 'The teaching gas-oil ratio history'],
          ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Samples in the history" value={fmt(rows[0].sampleCount, 0)} />
          <Tile label="What one spelling returns" value={rows[0].mechanismLabel || 'nothing'} />
          <Tile label="What the other returns" value={rows[1].mechanismLabel || 'nothing'} />
          <Tile label="The ratio slope both of them carry" value={fmt(rows[0].worSlope, 9)} />
        </TileGrid>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE SPELLING DECIDES THE ANSWER, AND THE REASSURING SPELLING IS THE ONE EVERY EXPORT
        PRODUCES. The classifier filters its input on the time and the ratio being finite and does
        NOT require the derivative to be finite. A column that coerces to zero therefore passes the
        test for a flat derivative at every late sample, takes the flat branch, and returns a
        reassuring verdict. A column that coerces to a not-a-number does not, and the reading comes
        back indeterminate instead. Same missing data, opposite answers.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">how the empty column was written</th>
              <th className="text-left pr-3">mechanism</th>
              <th className="text-left pr-3">treatable</th>
              <th className="text-left pr-3">confidence</th>
              <th className="text-left pr-3">window starts, days</th>
              <th className="text-left">the ratio slope in the same object</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.spelling}>
                <td className="pr-3">{r.spellingLabel}</td>
                <td className={r.mechanismId === 'displacement' ? 'pr-3 text-[#f97316]' : 'pr-3'}>{r.mechanismLabel}</td>
                <td className="pr-3">{yn(r.treatable)}</td>
                <td className="pr-3">{r.confidence}</td>
                <td className="pr-3">{fmt(r.lateFromT, 6)}</td>
                <td className="text-[#BFFF00]">{fmt(r.worSlope, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 space-y-2">
        {rows.map((r) => (
          <div key={`note-${r.spelling}`} className="rounded-md border border-slate-700 bg-[#0F172A] p-3">
            <p className="text-xs text-white font-medium mb-1">{r.spellingLabel}</p>
            <ul className="text-[11px] text-slate-300 list-disc pl-5 space-y-1">
              {r.notes.map((n) => (<li key={n.slice(0, 40)}>{n}</li>))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">what the empty cell held</th>
              <th className="text-left pr-3">it coerces to a finite number</th>
              <th className="text-left pr-3">it coerces to zero</th>
              <th className="text-left">it passes the test for a flat derivative</th>
            </tr>
          </thead>
          <tbody>
            {data.coercion.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{yn(r.coercedIsFinite)}</td>
                <td className="pr-3">{yn(r.coercedToZero)}</td>
                <td className={r.passesTheFlatTest ? 'text-[#f97316]' : ''}>{yn(r.passesTheFlatTest)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        AND THE FLAT BRANCH ASSERTS SOMETHING IT NEVER CHECKED. Its sentence opens by saying the
        ratio is sitting flat. Nothing in that branch looks at the ratio: the condition is entirely
        about the derivative, and the SAME return object carries a ratio slope and a ratio fit
        quality that say the opposite. Read the two columns below together, because the engine
        contradicts itself inside one object.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">history</th>
              <th className="text-left pr-3">the ratio slope in the same object</th>
              <th className="text-left pr-3">its fit quality, as a fraction</th>
              <th className="text-left pr-3">the sentence is actually true here</th>
              <th className="text-left">what the branch said</th>
            </tr>
          </thead>
          <tbody>
            {data.flat.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.worSlope, 9)}</td>
                <td className="pr-3">{fmt(r.worR2Fraction, 9)}</td>
                <td className={r.theSentenceIsTrueHere ? 'pr-3' : 'pr-3 text-[#f97316]'}>{yn(r.theSentenceIsTrueHere)}</td>
                <td>{r.sentence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE PUBLISHED FLAT HISTORY IS THE ONE CASE WHERE THAT SENTENCE IS TRUE, which is exactly
        why nobody noticed: the only series anybody tested the branch on really was flat. The
        teaching gas history runs from {fmt(data.gasHead.firstGorScfStb, 6)} to
        {' '}{fmt(data.gasHead.lastGorScfStb, 6)} scf/stb, a factor of
        {' '}{fmt(data.gasHead.foldChangeAcrossTheWindow, 9)} across
        {' '}{fmt(data.gasHead.sampleCount, 0)} clean samples, and the branch calls it flat. Note
        also that the ratio gate below which there is no problem to diagnose is
        {' '}{fmt(data.gasHead.minWor, 2)}, named for a water-oil ratio and applied unchanged to
        whatever column arrives: on a gas history in scf/stb it is cleared by a factor of
        {' '}{tiny(data.gasHead.theGateIsClearedByAFactorOf)}, so it is inert.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the screening is handed</th>
              <th className="text-left pr-3">mechanism it reads</th>
              <th className="text-left pr-3">window starts, days</th>
              <th className="text-left pr-3">water shutoff verdict</th>
              <th className="text-left">the reason it gives</th>
            </tr>
          </thead>
          <tbody>
            {data.fluid.map((r) => (
              <tr key={r.source}>
                <td className="pr-3">{r.sourceLabel}</td>
                <td className="pr-3">{r.mechanismId || 'none'}</td>
                <td className="pr-3">{fmt(r.lateFromT, 6)}</td>
                <td className={r.blocked ? 'pr-3 text-[#f97316]' : 'pr-3 text-[#BFFF00]'}>{r.waterShutoffVerdict}</td>
                <td>{r.firstReason || r.blockReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The screening reads the mechanism and never asks which fluid the classifier was looking at,
        and the module own gas reasoning ends by telling the user to run the diagnostic on the
        gas-oil ratio. Do that, hand the result to the screening, and the WATER shutoff comes back
        blocked with its reasons quoting the water cut. That block is issued on gas evidence, and
        the well row handed in is identical in every one of those rows.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Guards = () => {
  const data = useMemo(() => {
    try {
      return {
        ternary: candidateExplorer.fractureTernary(),
        ternaryHead: candidateExplorer.fractureTernaryHeadline(),
        zero: candidateExplorer.zeroVariance(),
        zeroHead: candidateExplorer.zeroVarianceHeadline(),
        constant: candidateExplorer.constantDerivative(),
        skinGuard: candidateExplorer.skinGuard(),
        skinHead: candidateExplorer.skinGuardHeadline(),
        skinRefusals: candidateExplorer.skinRefusals(),
        claims: candidateExplorer.claimAudit(),
        low: candidateExplorer.lowLastSample(),
        short: candidateExplorer.shortHistory(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return (
      <Note>
        A guard that cannot be reached is not a guard. With the engine absent there is nothing to
        walk up to a boundary and nothing to watch not fire, so this view has nothing to show.
      </Note>
    );
  }
  const zh = data.zeroHead;
  const sh = data.skinHead;
  return (
    <>
      <TileGrid>
        <Tile label="Skins tried on the fracture verdict" value={fmt(data.ternaryHead.settingsSwept, 0)} />
        <Tile label="Distinct fracture verdicts it produced" value={fmt(data.ternaryHead.distinctFractureVerdicts, 0)} />
        <Tile label="Zero-variance cells swept" value={fmt(zh.cellsSwept, 0)} />
        <Tile label="Of those, the guard fired on" value={fmt(zh.guardFired, 0)} />
      </TileGrid>
      <div className="mt-3 text-xs text-slate-300">
        A TEST THAT DECIDES NOTHING, AND IT IS ONE WORD WIDE. The fracture verdict tests whether a
        skin was entered and whether it is above zero, and then returns the same string on both
        arms of that test. The sweep below is the same well row at every skin from
        {' '}{fmt(data.ternary[0].skin, 2)} to {fmt(data.ternary[data.ternary.length - 2].skin, 2)}
        {' '}and with no skin at all, and the fracture verdict never moves:
        {' '}{yn(data.ternaryHead.theFractureVerdictNeverMoves)}, always
        {' '}{data.ternaryHead.theOnlyFractureVerdict}. Beside it the acid verdict, which is gated
        on the same number, takes {fmt(data.ternaryHead.distinctMatrixAcidVerdicts, 0)} distinct
        values. The module knows how to write this branch and wrote it correctly three other times.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">skin</th>
              <th className="text-left pr-3">a skin was entered</th>
              <th className="text-left pr-3">fracture verdict</th>
              <th className="text-left pr-3">reasons it gave</th>
              <th className="text-left pr-3">matrix acid verdict</th>
              <th className="text-left">recompletion verdict</th>
            </tr>
          </thead>
          <tbody>
            {data.ternary.map((r, i) => (
              <tr key={`ternary-${i}`}>
                <td className="pr-3">{r.skinWasEntered ? fmt(r.skin, 2) : 'not entered'}</td>
                <td className="pr-3">{yn(r.skinWasEntered)}</td>
                <td className="pr-3 text-[#f97316]">{r.fractureVerdict}</td>
                <td className="pr-3">{fmt(r.fractureReasonCount, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{r.matrixAcidVerdict}</td>
                <td>{r.recompletionVerdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        AND A GUARD THAT FIRES BY ACCIDENT, WHICH IS WORSE THAN ONE THAT NEVER FIRES. The
        measurement hands back a perfect fit quality when every value is identical, by testing
        whether the accumulated variance is EXACTLY zero. Whether it is depends on the sample count
        and the value TOGETHER, and neither one alone predicts it. Across
        {' '}{fmt(zh.cellsSwept, 0)} cells the guard fired on {fmt(zh.guardFired, 0)} and did not
        fire on {fmt(zh.guardDidNotFire, 0)}. It fires on every small tidy case and starts
        splitting at a count of {fmt(zh.theSplitStartsAtCount, 0)}. There is no rule here a caller
        could hold in their head: {yn(zh.thereIsNoRuleACallerCouldHold)}. A guard that never fires
        is dead code and dead code is harmless once you know it is dead. This one fires on the
        cases a test suite contains and stops firing on the cases production contains.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">samples</th>
              {data.zero[0].cells.map((c) => (
                <th key={`h-${c.y}`} className="text-left pr-3">every value {fmt(c.y, 4)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.zero.map((r) => (
              <tr key={r.n}>
                <td className="pr-3">{fmt(r.n, 0)}</td>
                {r.cells.map((c) => (
                  <td key={`${r.n}-${c.y}`} className={c.guardFired ? 'pr-3 text-[#BFFF00]' : 'pr-3 text-[#f97316]'}>
                    fit quality {tiny(c.r2Fraction)}, fired {yn(c.guardFired)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE REAL SIGNATURE THAT LANDS ON IT. A ratio rising exactly logarithmically has a
        derivative that is exactly constant, which is a real shape and not a contrived one. On
        {' '}{fmt(data.constant.sampleCount, 0)} such samples the guard does NOT fire:
        {' '}{yn(data.constant.theGuardDidNotFire)}. The derivative fit comes back at a fit quality
        of {tiny(data.constant.standaloneDerivativeR2Fraction)} as a fraction against a minimum of
        {' '}{fmt(data.constant.minR2, 2)}, so the classifier refuses it as noise:
        {' '}{yn(data.constant.cleanDataRefusedAsNoise)}. The mechanism returned is
        {' '}{data.constant.mechanismLabel} at {data.constant.confidence} confidence on a window
        starting day {fmt(data.constant.lateFromT, 6)}, and the ratio fit on the same samples has a
        quality of {fmt(data.constant.standaloneRatioR2Fraction, 9)}. Data with no scatter whatever,
        refused for scattering.
      </div>
      <ul className="mt-1 text-xs text-slate-400 list-disc pl-5 space-y-1">
        {data.constant.notes.map((n) => (<li key={n.slice(0, 40)}>{n}</li>))}
      </ul>
      <div className="mt-4 text-xs text-slate-300">
        THE SKIN GUARD SITS AT THE SINGULARITY AND ITS MESSAGE ADVERTISES A DIFFERENT LIMIT. The
        productivity multiplier refuses only where the denominator reaches zero, which on this
        geometry is a skin of {fmt(sh.minimumSkin, 9)}. Its refusal text then says real treatments
        reach about -3 to -5 on an acid job and -5 to -6 on a fracture. Everything between those and
        the pole is accepted in silence: of {fmt(sh.settingsSwept, 0)} settings tried,
        {' '}{fmt(sh.acceptedInSilence, 0)} were accepted and {fmt(sh.refused, 0)} refused, and
        {' '}{fmt(sh.acceptedPastTheAdvertisedFractureLimit, 0)} of the accepted ones are past the
        deepest skin that text calls real. That gap is {fmt(sh.theGapInSkinUnits, 9)} skin units
        wide. At an after-skin of {fmt(sh.honestSkinAfter, 2)} the multiplier is
        {' '}{fmt(sh.honestMultiplier, 9)}; at {fmt(sh.overreachSkinAfter, 2)} it is
        {' '}{fmt(sh.overreachMultiplier, 9)}, a factor of {fmt(sh.overreachOverHonest, 9)} handed
        back with the same confidence as the honest one and
        {' '}{fmt(sh.overreachOverTheDesignedJob, 9)} times the designed acid job. The floor is
        computed on every call and returned inside every successful result, and it is compared
        against nothing but zero.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">skin after</th>
              <th className="text-left pr-3">accepted</th>
              <th className="text-left pr-3">multiplier</th>
              <th className="text-left pr-3">denominator after</th>
              <th className="text-left pr-3">distance above the floor</th>
              <th className="text-left pr-3">past the fracture limit the text advertises</th>
              <th className="text-left">warnings the engine raised</th>
            </tr>
          </thead>
          <tbody>
            {data.skinGuard.map((r) => (
              <tr key={r.skinAfter}>
                <td className="pr-3">{fmt(r.skinAfter, 3)}</td>
                <td className={r.ok ? 'pr-3' : 'pr-3 text-[#f97316]'}>{yn(r.ok)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.multiplier, 9)}</td>
                <td className="pr-3">{fmt(r.denominatorAfter, 9)}</td>
                <td className="pr-3">{fmt(r.distanceAboveTheFloor, 9)}</td>
                <td className={r.pastTheFractureLimitTheTextAdvertises ? 'pr-3 text-[#f97316]' : 'pr-3'}>{yn(r.pastTheFractureLimitTheTextAdvertises)}</td>
                <td>{r.error ? 'refused' : fmt(r.warnings, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">a vendor claims</th>
              <th className="text-left pr-3">the skin that implies</th>
              <th className="text-left pr-3">distance above the floor</th>
              <th className="text-left pr-3">past the fracture limit the module advertises</th>
              <th className="text-left">flagged by the engine</th>
            </tr>
          </thead>
          <tbody>
            {data.claims.map((r) => (
              <tr key={r.claimedUplift}>
                <td className="pr-3">{fmt(r.claimedUplift, 3)} times</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.impliedSkin, 9)}</td>
                <td className="pr-3">{fmt(r.distanceAboveTheFloor, 9)}</td>
                <td className={r.pastTheFractureLimitTheModuleAdvertises ? 'pr-3 text-[#f97316]' : 'pr-3'}>{yn(r.pastTheFractureLimitTheModuleAdvertises)}</td>
                <td>{yn(r.flaggedByTheEngine)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">what was handed in</th>
              <th className="text-left pr-3">refused</th>
              <th className="text-left pr-3">how it refused</th>
              <th className="text-left">what it said</th>
            </tr>
          </thead>
          <tbody>
            {data.skinRefusals.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3 text-[#f97316]">{yn(r.refused)}</td>
                <td className="pr-3">{r.contract}</td>
                <td>{r.error || 'accepted'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        TWO MORE DOORS, BOTH OF THEM ONE SAMPLE WIDE. The ratio gate is compared against the LAST
        sample alone, so one low final reading short-circuits the whole diagnosis. On a climbing
        history reaching {fmt(data.low.secondToLastRatio, 9)} at the second to last sample, replace
        the final reading with a post shut-in test of {fmt(data.low.postShutInTest, 3)} and the
        classifier returns {data.low.spoiled.mechanismLabel} at {data.low.spoiled.confidence}
        {' '}confidence with no slope computed at all. Restore that one sample and the same history
        returns {data.low.restored.mechanismLabel} at {data.low.restored.confidence} confidence on
        a derivative slope of {fmt(data.low.restored.derivativeSlope, 9)}, a margin of
        {' '}{fmt(data.low.restored.marginToThreshold, 9)} from the channelling threshold, flagged
        close to the boundary {yn(data.low.restored.ambiguous)}. And a history of fewer than
        {' '}{fmt(data.short.minimumSamples, 0)} samples is refused outright:
        {' '}{fmt(data.short.sampleCount, 0)} samples returns refused
        {' '}{yn(data.short.refused)} with the message {data.short.error}
      </div>
      <Note>
        Read those four together and the pattern is one thing. Every guard in this module is placed
        where the ARITHMETIC breaks rather than where the ANSWER stops being believable, and the
        advice about believability is in prose in an error string that only prints once the
        arithmetic has already broken. That is why the gap between the two is where every one of
        these lives.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const CandidateExplorer = ({ initialMode = 'discarded' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Candidate explorer"
      subtitle="What the fit left out: the samples the classifier discarded fitted on their own against the fit that kept them, the window dial swept with the setting where the verdict flips, a missing column read as a zero with the flat branch beside the slope that contradicts it, and the guards that decide nothing or fire by accident"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'discarded' && <Discarded />}
        {mode === 'dial' && <Dial />}
        {mode === 'missing' && <Missing />}
        {mode === 'guards' && <Guards />}
      </div>
    </PanelShell>
  );
};

export default CandidateExplorer;
