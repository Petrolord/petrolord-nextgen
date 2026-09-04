import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, Line, Bar, ReferenceLine,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { readingExplorer } from './surveillanceLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Reading explorer, the Expert tier. WHAT A NUMBER IS WORTH ONCE YOU KNOW
// WHICH COLUMN IT CAME FROM.
//
// Four modes. One ratio read two ways, the mean of daily ratios against the
// volumetric reading, with the published gap and the larger teaching one; the
// decline exponent guard, where three spellings of a missing value all return
// the exponential answer; the guards in the wrong place, including a decimator
// whose cap is not a cap; and the lift handoff, where the same well screened
// on an oil rate and on a liquid rate scores differently with not one datum
// about the well changing.
//
// Every figure on this page is a return value from surveillanceLab, which is a
// return value from one of the four vendored engines. Nothing here forms a
// ratio, evaluates a rate law, strides a series or scores a lift method. And
// every reading on this page is shown beside the OTHER reading of the same
// rows, because a number with no second reading beside it is exactly the
// object this tier exists to distrust.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const yn = (b) => (b ? 'yes' : 'no');

const scoreList = (o) => Object.entries(o || {})
  .map(([k, v]) => `${k} ${fmt(v, 0)}`).join(', ');

const MODES = [
  ['seam', 'One ratio read two ways, and the printed verdict that moves with it'],
  ['decline', 'The decline exponent guard, and the spellings that are falsy'],
  ['guards', 'Guards in the wrong place, and a cap that is not a cap'],
  ['lift', 'The lift handoff, and one rate read as two phases'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

// --------------------------------------------------------------------------

const Seam = () => {
  const data = useMemo(() => {
    try {
      return {
        published: readingExplorer.publishedSeam(),
        readers: readingExplorer.seamReaders(),
        teaching: readingExplorer.teachingSeam(),
        shapes: readingExplorer.dayShapes(),
        collapse: readingExplorer.collapse(),
        sweep: readingExplorer.seamSweep(),
        sweepHead: readingExplorer.seamSweepHeadline(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.sweep.length) {
    return (
      <Note>
        Both readings are formed from the same window of derived points. With no series in front of
        them there is no window to read twice and no disagreement to measure.
      </Note>
    );
  }
  const chart = data.sweep.map((r) => ({
    collapsed: r.collapsedDays,
    meanOfRatios: r.gorMeanOfRatios,
    volumetric: r.gorVolumetric,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Published overstatement, gas-oil ratio" value={fmt(data.published.gorOverstatementPct, 9)} unit="%" />
        <Tile label="Teaching rise, mean of daily ratios" value={fmt(data.teaching.gorRiseByMeanOfRatiosPct, 9)} unit="%" />
        <Tile label="Teaching rise, volumetric" value={fmt(data.teaching.gorRiseByVolumetricPct, 9)} unit="%" />
        <Tile label="Severity by each reading" value={`${data.teaching.gorSeverityByMeanOfRatios} against ${data.teaching.gorSeverityByVolumetric}`} />
      </TileGrid>
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="collapsed" tick={AXIS} interval={0} height={40}
              label={{ value: 'collapsed days inside a seven day window', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'gas-oil ratio, scf/stb', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 9)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="meanOfRatios" name="the MEAN OF THE DAILY RATIOS" stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="volumetric" name="the VOLUMETRIC reading" stroke="#38bdf8" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        TWO FUNCTIONS IN ONE FILE FORM THE SAME TWO RATIOS TWO DIFFERENT WAYS, and the engine's own
        header states it rather than hiding it. On the published well the golden publishes the
        DISAGREEMENT rather than an expected value, which is the right thing to have done: the
        gas-oil ratio rises {fmt(data.published.gorRiseByMeanOfRatiosPct, 12)} per cent read as a
        mean of daily ratios and {fmt(data.published.gorRiseByVolumetricPct, 12)} per cent read
        volumetrically, an overstatement of {fmt(data.published.gorOverstatementPct, 12)} per cent,
        which is the difference between a printed {data.published.gorSeverityByMeanOfRatios} and a
        printed {data.published.gorSeverityByVolumetric}. The rise read one way is
        {' '}{fmt(data.published.gorRiseRatio, 12)} times the rise read the other, and the trigger
        it is measured against is {fmt(data.published.gorTrigger, 0)} per cent with a doubling to
        high at {fmt(data.published.gorDoublingToHigh, 0)}. The watercut on the same rows rises
        {' '}{fmt(data.published.watercutRiseByMeanOfRatiosPts, 12)} points one way and
        {' '}{fmt(data.published.watercutRiseByVolumetricPts, 12)} the other, a gap of
        {' '}{fmt(data.published.watercutRiseDifferenceInPoints, 12)} points, and the severity moves
        on BOTH ratios at once: {yn(data.published.theSeverityMovesOnBothRatiosAtOnce)}. The engine
        prints the higher one.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">function</th>
              <th className="text-left pr-3">which reading it forms</th>
              <th className="text-left pr-3">how</th>
              <th className="text-left">the question it answers</th>
            </tr>
          </thead>
          <tbody>
            {data.readers.map((r) => (
              <tr key={r.fn}>
                <td className="pr-3">{r.fn}</td>
                <td className={r.reading.includes('MEAN') ? 'pr-3 text-[#BFFF00]' : 'pr-3 text-[#38bdf8]'}>{r.reading}</td>
                <td className="pr-3">{r.how}</td>
                <td>{r.answers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        ON THE TEACHING WELL THE SAME SEAM IS BIGGER, AND IT CHANGES THE VERDICT RATHER THAN THE
        SEVERITY. {data.teaching.name} is built to show it: over the baseline its daily watercut
        and its daily gas-oil ratio are exactly constant, so the two readings agree exactly
        ({yn(data.teaching.theTwoReadingsAgreeExactlyOverTheBaseline)}) at
        {' '}{fmt(data.teaching.baselineGorMeanOfRatios, 9)} scf/stb against
        {' '}{fmt(data.teaching.baselineGorVolumetric, 9)}. Inside the recent window three days
        collapse, and the mean of daily ratios reads
        {' '}{fmt(data.teaching.recentGorMeanOfRatios, 12)} scf/stb against a volumetric
        {' '}{fmt(data.teaching.recentGorVolumetric, 12)}, the first being
        {' '}{fmt(data.teaching.recentGorTimes, 12)} times the second. That is a rise of
        {' '}{fmt(data.teaching.gorRiseByMeanOfRatiosPct, 12)} per cent against
        {' '}{fmt(data.teaching.gorRiseByVolumetricPct, 12)} per cent, which is a
        {' '}{data.teaching.gorSeverityByMeanOfRatios} exception against
        {' '}{data.teaching.gorSeverityByVolumetric === 'none' ? 'no exception at all' : data.teaching.gorSeverityByVolumetric}.
        The watercut rises {fmt(data.teaching.watercutRiseByMeanOfRatiosPts, 12)} points against
        {' '}{fmt(data.teaching.watercutRiseByVolumetricPts, 12)}. NEITHER READING IS WRONG. A mean
        of daily ratios answers what a typical day of this well looked like; a ratio of sums
        answers what the period produced. A surveillance tool needs the first to spot a well that
        has changed and the second to book a barrel, and the defect is that it uses both and says
        so only in a source comment.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">day shape</th>
              <th className="text-left pr-3">oil, stb</th>
              <th className="text-left pr-3">water, stb</th>
              <th className="text-left pr-3">gas, Mscf</th>
              <th className="text-left pr-3">watercut, fraction</th>
              <th className="text-left">gas-oil ratio, scf/stb</th>
            </tr>
          </thead>
          <tbody>
            {data.shapes.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.oilStb, 4)}</td>
                <td className="pr-3">{fmt(r.waterStb, 4)}</td>
                <td className="pr-3">{fmt(r.gasMscf, 4)}</td>
                <td className="pr-3">{fmt(r.watercutFraction, 12)}</td>
                <td>{fmt(r.gorScfStb, 12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        WHY THE COLLAPSED DAY DRIVES THE DAILY RATIO UP. The oil falls by a factor of
        {' '}{fmt(data.collapse.oilFallsByAFactorOf, 12)}, the water by
        {' '}{fmt(data.collapse.waterFallsByAFactorOf, 12)} and the gas by only
        {' '}{fmt(data.collapse.gasFallsByAFactorOf, 12)}, so the gas-oil ratio on that one day
        rises by a factor of {fmt(data.collapse.soTheGorRisesByAFactorOf, 12)}. An unweighted mean
        gives that day the same vote as a full one; a ratio of sums gives it the vote its barrels
        earned.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">collapsed days of seven</th>
              <th className="text-left pr-3">gas-oil ratio, mean of daily ratios</th>
              <th className="text-left pr-3">gas-oil ratio, volumetric</th>
              <th className="text-left pr-3">the first over the second</th>
              <th className="text-left pr-3">watercut difference</th>
              <th className="text-left">the two readings are identical</th>
            </tr>
          </thead>
          <tbody>
            {data.sweep.map((r) => (
              <tr key={r.collapsedDays}>
                <td className="pr-3">{fmt(r.collapsedDays, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.gorMeanOfRatios, 12)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.gorVolumetric, 12)}</td>
                <td className="pr-3">{fmt(r.gorRatio, 12)}</td>
                <td className="pr-3">{fmt(r.watercutDifference, 12)}</td>
                <td>{yn(r.theTwoReadingsAreIdentical)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        THE SWEEP IS THE SHAPE OF THE WHOLE FINDING. The two readings are IDENTICAL at both ends,
        on {fmt(data.sweepHead.pointsWhereTheTwoReadingsAgree, 0)} of
        {' '}{fmt(data.sweepHead.pointsSwept, 0)} points, and they disagree most in the middle, at
        {' '}{fmt(data.sweepHead.widestDisagreementAtCollapsedDays, 0)} collapsed days where the
        first is {fmt(data.sweepHead.widestGorRatio, 12)} times the second. A window of uniform
        days cannot show it and a window with a mixture of rates shows it at its worst, which is
        why nobody caught it. That sweep is a DEMONSTRATION built from two day shapes only, not the
        teaching well's own recent window, whose ordinary days differ slightly from each other. Do
        not quote one for the other.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Decline = () => {
  const data = useMemo(() => {
    try {
      return {
        published: readingExplorer.publishedDecline(),
        guard: readingExplorer.bGuard(),
        head: readingExplorer.bGuardHeadline(),
        negative: readingExplorer.negativeB(),
        di: readingExplorer.diGuard(),
        series: readingExplorer.fitSeries(),
        teaching: readingExplorer.teachingDecline(),
        refusals: readingExplorer.fitRefusals(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.guard.length) {
    return (
      <Note>
        The decline overlay calls the canonical Arps engine and does not re-derive decline. With
        that engine absent there is no rate law to evaluate and no exponent to guard.
      </Note>
    );
  }
  const chart = data.guard
    .filter((r) => Number.isFinite(r.effectivePct))
    .map((r) => ({ label: r.label, effective: r.effectivePct }));
  return (
    <>
      <TileGrid>
        <Tile label="The exponential answer at this nominal decline" value={fmt(data.head.exponentialAnswerPct, 12)} unit="%" />
        <Tile label="The hyperbolic answer at an exponent of one half" value={fmt(data.head.hyperbolicAnswerAtHalfPct, 12)} unit="%" />
        <Tile label="Spellings that silently take the exponential branch" value={fmt(data.head.spellingsThatSilentlyTakeTheExponentialBranch, 0)} />
        <Tile label="It is case one of the published golden" value={yn(data.head.itIsCaseOneOfThePublishedGolden)} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 78, left: 0 }}>
            {GRID}
            <XAxis dataKey="label" tick={{ ...AXIS, fontSize: 9 }} interval={0} angle={-35} textAnchor="end" height={90} />
            <YAxis tick={AXIS}
              label={{ value: 'effective decline over the first year, %', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 12)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={data.head.exponentialAnswerPct} stroke="#f97316" strokeDasharray="4 4" />
            <Bar dataKey="effective" name="effective decline, %" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THREE BRANCHES AND ONE CLAUSE THAT DECIDES THEM. The first branch is taken when the model
        is named exponential OR when the exponent is FALSY, and a falsy test is true for a
        not-a-number, for a null and for a missing value alike. So a hyperbolic fit whose exponent
        came back unusable silently returns the EXPONENTIAL answer rather than a refusal or a
        not-a-number, and the exponential answer at the same nominal decline is a real number a
        reader has no way to distrust. Here it is {fmt(data.head.exponentialAnswerPct, 12)} per
        cent, which is case one of the published golden ({yn(data.head.itIsCaseOneOfThePublishedGolden)}),
        against {fmt(data.head.hyperbolicAnswerAtHalfPct, 12)} per cent for an ordinary hyperbolic
        at the same nominal decline, a difference of {fmt(data.head.theTwoDifferBy, 12)} points. A
        numeric STRING is coerced and answers as a hyperbolic
        ({yn(data.head.theStringIsCoercedAndAnswersAsAHyperbolic)}), which is a fourth behaviour
        from a fourth spelling of the same field.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the exponent as handed in</th>
              <th className="text-left pr-3">model asked for</th>
              <th className="text-left pr-3">the exponent is falsy</th>
              <th className="text-left pr-3">effective decline, %</th>
              <th className="text-left">it returned the exponential answer</th>
            </tr>
          </thead>
          <tbody>
            {data.guard.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{r.modelTypeAsked}</td>
                <td className="pr-3">{yn(r.bIsFalsy)}</td>
                <td className="pr-3 text-[#BFFF00]">{r.effectivePct === null ? 'null, refused' : fmt(r.effectivePct, 12)}</td>
                <td className={r.itReturnedTheExponentialAnswer ? 'text-[#f97316]' : ''}>{yn(r.itReturnedTheExponentialAnswer)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        A NEGATIVE EXPONENT IS NOT REFUSED EITHER. The hyperbolic form raises the bracket to the
        power of minus one over the exponent, and at an exponent of minus a half that is a NEGATIVE
        base raised to the power two, which is a perfectly ordinary positive number. An impossible
        exponent therefore returns a plausible percentage, and nothing in the return says the
        bracket went negative on the way.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">nominal decline, per day</th>
              <th className="text-left pr-3">exponent</th>
              <th className="text-left pr-3">the bracket</th>
              <th className="text-left pr-3">the power it is raised to</th>
              <th className="text-left">effective decline, %</th>
            </tr>
          </thead>
          <tbody>
            {data.negative.map((r) => (
              <tr key={`${r.diPerDay}-${r.b}`}>
                <td className="pr-3">{fmt(r.diPerDay, 6)}</td>
                <td className="pr-3">{fmt(r.b, 4)}</td>
                <td className={r.bracket < 0 ? 'pr-3 text-[#f97316]' : 'pr-3'}>{fmt(r.bracket, 12)}</td>
                <td className="pr-3">{fmt(r.exponent, 6)}</td>
                <td>{r.effectivePct === null ? 'null, refused' : fmt(r.effectivePct, 12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        WHAT IS GUARDED, AND IT IS GUARDED PROPERLY: the nominal decline itself. A zero, a negative
        value, a not-a-number and a null all come back as a null rather than as a number nobody can
        distrust, which is the contract the exponent should have had.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the nominal decline as handed in</th>
              <th className="text-left pr-3">effective decline, %</th>
              <th className="text-left pr-3">refused</th>
              <th className="text-left">the contract</th>
            </tr>
          </thead>
          <tbody>
            {data.di.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{r.effectivePct === null ? 'null' : fmt(r.effectivePct, 12)}</td>
                <td className={r.refused ? 'pr-3 text-[#f97316]' : 'pr-3'}>{yn(r.refused)}</td>
                <td>{r.contract}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        AND THE SERIES THE FITTER IS HANDED, WHICH IS WHAT SURVEILLANCE ACTUALLY OWNS. Decline is
        NOT re-derived here: the overlay calls the canonical Arps engine, and a second decline
        implementation would be a second thing to be wrong. What this module owns is the series it
        hands over and the effective decline it reads back. It drops every point whose rate is not
        finite and above zero, which on the producing-day basis means it drops every shut-in day
        INCLUDING a day that produced volume with its hours recorded as zero. That day is a
        contradiction in the ledger and the function resolves it by deleting the day.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">basis</th>
              <th className="text-left pr-3">points handed in</th>
              <th className="text-left pr-3">points kept</th>
              <th className="text-left pr-3">points dropped</th>
              <th className="text-left">the dates that survived</th>
            </tr>
          </thead>
          <tbody>
            {data.series.map((r) => (
              <tr key={r.basis}>
                <td className="pr-3">{r.basis}</td>
                <td className="pr-3">{fmt(r.pointsHandedIn, 0)}</td>
                <td className="pr-3">{fmt(r.pointsKept, 0)}</td>
                <td className={r.pointsDropped > 0 ? 'pr-3 text-[#f97316]' : 'pr-3'}>{fmt(r.pointsDropped, 0)}</td>
                <td>{r.dates}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">teaching well</th>
              <th className="text-left pr-3">stream and basis</th>
              <th className="text-left pr-3">points fitted</th>
              <th className="text-left pr-3">model</th>
              <th className="text-left pr-3">first rate</th>
              <th className="text-left pr-3">nominal decline, per day</th>
              <th className="text-left">effective decline, %</th>
            </tr>
          </thead>
          <tbody>
            {data.teaching.map((r) => (
              <tr key={`${r.name}-${r.stream}-${r.basis}`}>
                <td className="pr-3">{r.name}</td>
                <td className="pr-3">{r.stream} on the {r.basis} basis</td>
                <td className="pr-3">{fmt(r.pointsFitted, 0)}</td>
                <td className="pr-3">{r.modelType || 'none'}</td>
                <td className="pr-3">{fmt(r.qi, 6)}</td>
                <td className="pr-3">{fmt(r.diPerDay, 12)}</td>
                <td className="text-[#BFFF00]">{fmt(r.annualEffectivePct, 12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">what the fitter was handed</th>
              <th className="text-left pr-3">usable points</th>
              <th className="text-left">it came back insufficient rather than as a decline of zero</th>
            </tr>
          </thead>
          <tbody>
            {data.refusals.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.usablePoints, 0)}</td>
                <td className="text-[#BFFF00]">{yn(r.itCameBackInsufficientRatherThanAsADeclineOfZero)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The five published decline cases are committed in the surveillance golden by an oracle that
        measures effective decline through the Arps rate law where the module evaluates a closed
        form, and the engine reproduces every one of them:
        {' '}{fmt(data.published.filter((r) => r.engineReproducesThePublishedCase).length, 0)} of
        {' '}{fmt(data.published.length, 0)}. The teaching decliners were built at a known first
        rate and a known nominal decline, so the fit recovering those is a gate on the assembly and
        not an independent result. The refusals in the last table are honest: too few points, a
        flat series and a RISING series all come back insufficient rather than as a fitted decline
        of zero or of a negative number.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Guards = () => {
  const data = useMemo(() => {
    try {
      return {
        decimate: readingExplorer.decimate(),
        decimateHead: readingExplorer.decimateHeadline(),
        minOil: readingExplorer.minOilRateSweep(),
        minOilHead: readingExplorer.minOilRateHeadline(),
        stopped: readingExplorer.stoppedWell(),
        downtime: readingExplorer.downtimeBoundary(),
        stale: readingExplorer.staleSeverity(),
        unreachable: readingExplorer.unreachable(),
        unreachableHead: readingExplorer.unreachableHeadline(),
        hours: readingExplorer.hoursAcrossModules(),
        coercion: readingExplorer.coercion(),
        ladder: readingExplorer.ladder(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.decimate.length) {
    return (
      <Note>
        Each of these guards is a single clause inside a shipped engine. With the engine package
        absent there is no branch to fire and no boundary to walk.
      </Note>
    );
  }
  const chart = data.decimate.map((r) => ({
    n: r.n,
    out: r.outLength,
    cap: r.maxPoints,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Points off a 1501 point series, cap 1500" value={fmt(data.decimate[1].outLength, 0)} />
        <Tile label="Points off a 3000 point series, same cap" value={fmt(data.decimate[5].outLength, 0)} />
        <Tile label="Sweep points that come back OVER the cap" value={fmt(data.decimateHead.pointsOverTheCap, 0)} />
        <Tile label="Sweep points at half the budget or less" value={fmt(data.decimateHead.pointsAtHalfTheBudgetOrLess, 0)} />
      </TileGrid>
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="n" tick={AXIS} type="number" scale="log" domain={['dataMin', 'dataMax']}
              label={{ value: 'points handed in', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'points returned', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 0)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1500} stroke="#f97316" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="out" name="points returned" stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="cap" name="the maximum the argument names" stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A NUMBER THAT NAMES A MAXIMUM AND DOES NOT ENFORCE ONE. The decimator takes a maximum point
        count and strides by a CEILING, and the stride is an integer, so the returned count lands
        wherever the rounding puts it. Ask for at most {fmt(data.decimateHead.publishedMaxPoints, 0)}
        {' '}points off a {fmt(data.decimate[1].n, 0)} point series and it returns
        {' '}{fmt(data.decimate[1].outLength, 0)}, half the budget. Ask off a
        {' '}{fmt(data.decimate[5].n, 0)} point series and it returns
        {' '}{fmt(data.decimate[5].outLength, 0)}, which is ONE MORE than the maximum the argument
        names, and the always-keep-the-last rule is what puts it over. It is neither a ceiling nor
        a floor. The published case, which the golden commits, hands it
        {' '}{fmt(data.decimateHead.publishedN, 0)} points and gets
        {' '}{fmt(data.decimateHead.publishedOutLength, 0)} back at a stride of
        {' '}{fmt(data.decimateHead.publishedStride, 0)}, and the engine reproduces it:
        {' '}{yn(data.decimateHead.engineReproducesThePublishedCase)}. Read the column before
        quoting it.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">points in</th>
              <th className="text-left pr-3">maximum asked for</th>
              <th className="text-left pr-3">stride</th>
              <th className="text-left pr-3">points out</th>
              <th className="text-left pr-3">out over the maximum</th>
              <th className="text-left">over the cap its own argument names</th>
            </tr>
          </thead>
          <tbody>
            {data.decimate.map((r) => (
              <tr key={r.n}>
                <td className="pr-3">{fmt(r.n, 0)}</td>
                <td className="pr-3">{fmt(r.maxPoints, 0)}</td>
                <td className="pr-3">{fmt(r.stride, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.outLength, 0)}</td>
                <td className="pr-3">{fmt(r.outOverMaxPoints, 9)}</td>
                <td className={r.overTheCapItsOwnArgumentNames ? 'text-[#f97316]' : ''}>{yn(r.overTheCapItsOwnArgumentNames)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        THE MINIMUM RATE GATE COVERS THE RATE CHECK AND THE RATIO CHECK AND NOT THE WATERCUT CHECK.
        On a constructed well whose baseline oil is {fmt(data.minOilHead.baselineOil, 6)} stb/d and
        whose recent oil is {fmt(data.minOilHead.recentOil, 6)} stb/d, the oil actually fell
        {' '}{fmt(data.minOilHead.theOilActuallyFellByPct, 9)} per cent, well past the trigger of
        {' '}{fmt(data.minOilHead.rateDropTrigger, 0)} per cent, and at the default minimum rate of
        {' '}{fmt(data.minOilHead.minOilRate, 0)} stb/d no rate drop is raised at all. What IS
        raised, on the same rows, is a high watercut exception:
        {' '}{data.minOilHead.theWatercutMessage} A well too small to have its rate collapse
        reported still raises the loudest severity in the module on a different column:
        {' '}{yn(data.minOilHead.theWellIsTooSmallToHaveItsRateCollapseReportedAndStillRaisesAHighWatercut)}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">minimum rate, stb/d</th>
              <th className="text-left pr-3">the default</th>
              <th className="text-left pr-3">rate drop raised</th>
              <th className="text-left pr-3">gas-oil ratio rise raised</th>
              <th className="text-left pr-3">watercut rise raised</th>
              <th className="text-left">what it raised</th>
            </tr>
          </thead>
          <tbody>
            {data.minOil.map((r) => (
              <tr key={r.minOilRate}>
                <td className="pr-3">{fmt(r.minOilRate, 0)}</td>
                <td className="pr-3">{yn(r.isTheDefault)}</td>
                <td className="pr-3">{yn(r.rateDropRaised)}</td>
                <td className="pr-3">{yn(r.gorRiseRaised)}</td>
                <td className={r.watercutRiseRaised ? 'pr-3 text-[#f97316]' : 'pr-3'}>{yn(r.watercutRiseRaised)}</td>
                <td>{r.raised}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">a well that stops altogether</th>
              <th className="text-left pr-3">baseline oil, stb/d</th>
              <th className="text-left pr-3">above the minimum rate gate</th>
              <th className="text-left pr-3">shut-in raised</th>
              <th className="text-left">what it raised</th>
            </tr>
          </thead>
          <tbody>
            {data.stopped.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.baselineOil, 4)}</td>
                <td className="pr-3">{yn(r.aboveTheMinimumRateGate)}</td>
                <td className="pr-3">{yn(r.shutInRaised)}</td>
                <td className={r.exceptionsRaised === 0 ? 'text-[#f97316]' : ''}>{r.raised}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        THE DOWNTIME TEST REFUSES AT EXACTLY ZERO HOURS. The condition is that the mean hours are
        below the threshold AND above zero, so a mean of exactly zero, which is a well that
        recorded itself shut for the whole window, is the one value the check refuses to report.
        Walk the boundary: at {fmt(data.downtime[2].recentHours, 2)} h it does not fire because it
        is not below the threshold, from {fmt(data.downtime[3].recentHours, 2)} h down it fires at
        medium, and at exactly zero it stops firing again. Note the severity column while you do
        it: every one of those is medium, because the downtime type is always medium and has no
        doubling point at all.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">mean recent hours</th>
              <th className="text-left pr-3">below the threshold</th>
              <th className="text-left pr-3">above zero</th>
              <th className="text-left pr-3">downtime raised</th>
              <th className="text-left pr-3">its severity</th>
              <th className="text-left">everything raised on that well</th>
            </tr>
          </thead>
          <tbody>
            {data.downtime.map((r) => (
              <tr key={r.recentHours}>
                <td className="pr-3">{fmt(r.recentHours, 4)}</td>
                <td className="pr-3">{yn(r.belowTheThreshold)}</td>
                <td className="pr-3">{yn(r.aboveZero)}</td>
                <td className={r.downtimeRaised ? 'pr-3' : 'pr-3 text-[#f97316]'}>{yn(r.downtimeRaised)}</td>
                <td className="pr-3">{r.downtimeSeverity}</td>
                <td>{r.raised}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        AND THE STALE CHECK RETURNS EARLY AND CANNOT EXCEED MEDIUM. A well that has not reported for
        months raises exactly one exception, at medium, and every other comparison on that well is
        skipped because the windows would be empty. It therefore ranks below every high-severity
        rate drop on the field and is ordered among the mediums alphabetically. Doubling the gap
        takes it only from info to medium, and doubling it again does nothing at all.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">gap, days</th>
              <th className="text-left pr-3">threshold, days</th>
              <th className="text-left pr-3">doubling at</th>
              <th className="text-left pr-3">severity</th>
              <th className="text-left pr-3">exceptions on that well</th>
              <th className="text-left">every other comparison was skipped</th>
            </tr>
          </thead>
          <tbody>
            {data.stale.map((r) => (
              <tr key={r.gapDays}>
                <td className="pr-3">{fmt(r.gapDays, 0)}</td>
                <td className="pr-3">{fmt(r.staleDays, 0)}</td>
                <td className="pr-3">{fmt(r.doublingAt, 0)}</td>
                <td className="pr-3">{r.severity}</td>
                <td className="pr-3">{fmt(r.exceptionsOnThatWell, 0)}</td>
                <td>{yn(r.everyOtherComparisonOnThatWellWasSkipped)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        A CLAUSE THAT CAN NEVER BE TRUE, PROVED BY CONSTRUCTION RATHER THAN BY ARGUMENT. The
        gas-oil ratio gate carries an escape hatch for a null baseline, and the baseline is null
        only when the window holds no points at all, in which case the gate has already shut two
        clauses earlier. {data.unreachableHead.whyItIsUnreachable} Over
        {' '}{fmt(data.unreachableHead.constructionsTried, 0)} constructions the number in which the
        escape hatch could fire is
        {' '}{fmt(data.unreachableHead.constructionsInWhichTheEscapeHatchCouldFire, 0)}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">oil per row, stb</th>
              <th className="text-left pr-3">gas per row, Mscf</th>
              <th className="text-left pr-3">points with a gas-oil ratio</th>
              <th className="text-left pr-3">points with a finite oil</th>
              <th className="text-left">the escape hatch could fire</th>
            </tr>
          </thead>
          <tbody>
            {data.unreachable.map((r) => (
              <tr key={`${r.oilStb}-${r.gasMscf}`}>
                <td className="pr-3">{fmt(r.oilStb, 4)}</td>
                <td className="pr-3">{fmt(r.gasMscf, 4)}</td>
                <td className="pr-3">{fmt(r.pointsWithAFiniteGor, 0)}</td>
                <td className="pr-3">{fmt(r.pointsWithAFiniteOil, 0)}</td>
                <td>{yn(r.theEscapeHatchCouldFire)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        AND THE SAME ABSENT COLUMN, READ BY TWO MODULES THAT DISAGREE ABOUT IT. Surveillance reads a
        missing hours column as UPTIME UNKNOWN and leaves the volume unscaled; allocation reads the
        identical column as TWENTY-FOUR HOURS ON and gives the well a full share. The unscaled
        volume and a full day happen to be the same NUMBER, and they are not the same CLAIM, and
        only one of the two modules is entitled to the one it makes. They are called on the same
        ledger by the same studio. Note also that a numeric STRING reaches neither reading, because
        both call the same finite test.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the hours column spelled</th>
              <th className="text-left pr-3">surveillance reading</th>
              <th className="text-left pr-3">producing-day oil, stb/d</th>
              <th className="text-left pr-3">allocation uptime</th>
              <th className="text-left pr-3">allocation theoretical oil, stb</th>
              <th className="text-left">the same number, not the same claim</th>
            </tr>
          </thead>
          <tbody>
            {data.hours.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{r.surveillanceReading}</td>
                <td className="pr-3">{r.surveillanceOilPd === null ? 'null' : fmt(r.surveillanceOilPd, 9)}</td>
                <td className="pr-3">{r.allocationUptime === null ? 'took no share' : fmt(r.allocationUptime, 9)}</td>
                <td className="pr-3">{r.allocationTheoreticalOil === null ? 'none' : fmt(r.allocationTheoreticalOil, 6)}</td>
                <td className={r.theSameNumberIsNotTheSameClaim ? 'text-[#f97316]' : ''}>{yn(r.theSameNumberIsNotTheSameClaim)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">function</th>
              <th className="text-left pr-3">the clause</th>
              <th className="text-left">what a missing value means to it</th>
            </tr>
          </thead>
          <tbody>
            {data.coercion.map((r, i) => (
              <tr key={`${r.fn}-${i}`}>
                <td className="pr-3">{r.fn}</td>
                <td className="pr-3">{r.source}</td>
                <td>{r.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Every case on this page is a DERIVED demonstration constructed by the teaching lab and
        handed to the shipped engines, except the decimator's published row, which the surveillance
        golden commits. A guard that sits where the arithmetic breaks rather than where the answer
        stops being believable is the pattern all of these share, and the severity ladder beside
        them has {fmt(data.ladder.filter((r) => r.cannotExceedMedium).length, 0)} of its
        {' '}{fmt(data.ladder.length, 0)} types unable to reach the top rung at all.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Lift = () => {
  const data = useMemo(() => {
    try {
      return {
        published: readingExplorer.publishedScreeningSeam(),
        conditions: readingExplorer.liftConditions(),
        handoff: readingExplorer.handoff(),
        screening: readingExplorer.teachingScreening(),
        sweep: readingExplorer.ratePhaseSweep(),
        head: readingExplorer.ratePhaseHeadline(),
        api: readingExplorer.apiCoercion(),
        empty: readingExplorer.emptyScreening(),
        band: readingExplorer.emptyBand(),
        model: readingExplorer.modelScreening(),
        pass: readingExplorer.designPass(),
        reconcile: readingExplorer.reconcileHeadline(),
        stages: readingExplorer.referenceStages(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.sweep.length) {
    return (
      <Note>
        The screening matrix and the design pass are shipped inside the engine package. With that
        package absent there is no rate to hand over and no method to score.
      </Note>
    );
  }
  const chart = data.sweep.map((r) => ({
    oil: r.oilRateBpd,
    plunger: r.deltas.plunger,
    rodPump: r.deltas.rodPump,
    esp: r.deltas.esp,
    gasLift: r.deltas.gasLift,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="The rate handed over, as oil" value={fmt(data.handoff.targetRateBpd, 9)} unit="bbl/d" />
        <Tile label="The liquid the method must move" value={fmt(data.handoff.liquidRateBpd, 9)} unit="bbl/d" />
        <Tile label="The largest single move in the sweep" value={fmt(data.head.largestSingleMovePoints, 0)} unit="points" />
        <Tile label="Where it happens" value={`${data.head.largestSingleMoveMethod} at ${fmt(data.head.largestSingleMoveAtOilRateBpd, 0)} bbl/d`} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="oil" tick={AXIS} interval={0} height={40}
              label={{ value: 'the rate handed over, read as oil, bbl/d', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'score read as liquid less score read as oil', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 0)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Bar dataKey="plunger" name="plunger lift" fill="#f97316" isAnimationActive={false} />
            <Bar dataKey="rodPump" name="rod pump" fill="#BFFF00" isAnimationActive={false} />
            <Bar dataKey="esp" name="ESP" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="gasLift" name="gas lift" fill="#f472b6" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE SURVEILLANCE HALF OF THIS DOMAIN ENDS AT A RATE AND THE LIFT HALF BEGINS AT ONE, AND
        THE TWO MODULES THAT RECEIVE IT DISAGREE ABOUT WHICH PHASE IT IS. The screening matrix
        documents its target rate as bbl/d of LIQUID; the design advisor compares the identical
        input against the inflow OIL absolute open flow and hands it to each chain as the oil
        design rate with the water cut supplied separately. The shipped studio passes ONE number to
        both. On the published case the golden publishes the disagreement rather than resolving it:
        an oil rate of {fmt(data.published.oilRateBpd, 4)} bbl/d at a water cut of
        {' '}{fmt(data.published.wctPct, 4)} per cent is a liquid rate of
        {' '}{fmt(data.published.liquidRateBpd, 9)} bbl/d, and the recommendation set is the same
        while the order is not ({yn(data.published.theRecommendationSetIsTheSameAndTheOrderIsNot)}):
        read as oil the order is {data.published.asOilOrder.join(', ')} and read as liquid it is
        {' '}{data.published.asLiquidOrder.join(', ')}, with the rod pump moving
        {' '}{fmt(data.published.deltas.rodPump, 0)} points.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        ON THE TEACHING WELL THE HANDOFF IS A REAL CHAIN. The rate comes off the last allocated day
        for the uptime well, {fmt(data.handoff.targetRateBpd, 12)} bbl/d on
        {' '}{data.handoff.date}, and the water cut of {fmt(data.handoff.wctPct, 9)} per cent and
        the gas-oil ratio of {fmt(data.handoff.gorScfStb, 9)} scf/stb both come off the seven-day
        field roll-up. Read as OIL, the liquid the method must actually move is
        {' '}{fmt(data.handoff.liquidRateBpd, 12)} bbl/d, which is
        {' '}{fmt(data.handoff.liquidOverTheNumberHandedOver, 12)} times the number handed over, and
        the gas-liquid ratio a plunger cycle would see is {fmt(data.handoff.glrScfBbl, 12)} scf/bbl.
        The rod pump duty index at {fmt(data.conditions.trueVerticalDepthFt, 0)} ft is
        {' '}{fmt(data.handoff.dutyIndexOnTheOilRate, 12)} on the oil rate and
        {' '}{fmt(data.handoff.dutyIndexOnTheLiquidRate, 12)} on the liquid rate, and the two bands
        the rule uses are 3 and 6, so the reading decides which side of a band the well sits on.
        Those bands are a rate only once a depth is fixed: at this depth the index reaches 3 at
        {' '}{fmt(data.head.dutyIndexReachesThreeAtBpd, 9)} bbl/d and 6 at
        {' '}{fmt(data.head.dutyIndexReachesSixAtBpd, 9)} bbl/d.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the same well screened</th>
              <th className="text-left pr-3">scores</th>
              <th className="text-left pr-3">order</th>
              <th className="text-left">recommended</th>
            </tr>
          </thead>
          <tbody>
            {data.screening.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{scoreList(r.scores)}</td>
                <td className="pr-3">{r.order.join(', ')}</td>
                <td>{r.recommended.join(', ') || 'nothing at all'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        THE DELTAS COLUMN IS THE FINDING. Wherever it is not all zeroes, one number read two ways
        has moved a screening score without one datum about the well changing. Over
        {' '}{fmt(data.head.ratesSwept, 0)} rates, {fmt(data.head.methodsThatMoveSomewhere, 0)} of
        the {fmt(data.head.methodsInTheMatrix, 0)} methods move somewhere, and
        {' '}{fmt(data.head.rowsWhereNothingMoved, 0)} rates move nothing at all. The largest single
        move belongs to {data.head.largestSingleMoveMethod}, which loses
        {' '}{fmt(Math.abs(data.head.largestSingleMovePoints), 0)} points at an oil rate of
        {' '}{fmt(data.head.largestSingleMoveAtOilRateBpd, 0)} bbl/d because the liquid rate crosses
        the ceiling that rule is written against, and that removes it from consideration entirely.
        A screening score is unitless and is a RANKING DEVICE, not a probability, and it is clamped
        to zero, so a printed zero means at or below zero and several wells that are differently
        impossible print the same zero.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">oil rate, bbl/d</th>
              <th className="text-left pr-3">liquid rate, bbl/d</th>
              <th className="text-left pr-3">read as oil</th>
              <th className="text-left pr-3">read as liquid</th>
              <th className="text-left pr-3">methods that moved</th>
              <th className="text-left">recommended, oil then liquid</th>
            </tr>
          </thead>
          <tbody>
            {data.sweep.map((r) => (
              <tr key={r.oilRateBpd}>
                <td className="pr-3">{fmt(r.oilRateBpd, 4)}</td>
                <td className="pr-3">{fmt(r.liquidRateBpd, 9)}</td>
                <td className="pr-3">{scoreList(r.asOilScores)}</td>
                <td className="pr-3">{scoreList(r.asLiquidScores)}</td>
                <td className={r.methodsThatMoved.length ? 'pr-3 text-[#f97316]' : 'pr-3'}>{r.methodsThatMoved.join(', ') || 'none'}</td>
                <td>{r.recommendedAsOil.join(' ')} then {r.recommendedAsLiquid.join(' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        AND THE COERCION CONVENTIONS FOR ONE QUANTITY CONTRADICT EACH OTHER TWO FILES APART. The
        screening matrix coerces an absent API to ZERO, and zero reads as heavier than any real
        crude; the design advisor coerces the same absent API to a thirty-two degree oil, and a
        STATED zero there is taken literally and gives a specific gravity denser than water. On no
        information at all the matrix is confident either way: an empty input object scores
        {' '}{scoreList(data.empty.scores)} and recommends {data.empty.recommended.join(', ')},
        because the missing NUMBERS read as the worst possible well and the missing BOOLEANS read
        as the best possible facility, and the two dominant deductions in the matrix are the two
        that silence can never trigger. State the facility as absent instead and the same call
        gives {scoreList(data.empty.scoresWithPowerAndGasStatedAbsent)}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the API as handed in</th>
              <th className="text-left pr-3">liquid gravity at zero water cut</th>
              <th className="text-left pr-3">denser than water</th>
              <th className="text-left pr-3">ESP score</th>
              <th className="text-left pr-3">progressing cavity score</th>
              <th className="text-left">rod pump score</th>
            </tr>
          </thead>
          <tbody>
            {data.api.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.liquidGravityAtZeroWatercut, 12)}</td>
                <td className={r.denserThanWater ? 'pr-3 text-[#f97316]' : 'pr-3'}>{yn(r.denserThanWater)}</td>
                <td className="pr-3">{fmt(r.espScore, 0)}</td>
                <td className="pr-3">{fmt(r.pcpScore, 0)}</td>
                <td>{fmt(r.rodPumpScore, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">a model-driven screening</th>
              <th className="text-left pr-3">API stated</th>
              <th className="text-left pr-3">gas-oil ratio stated</th>
              <th className="text-left pr-3">scores</th>
              <th className="text-left">recommended</th>
            </tr>
          </thead>
          <tbody>
            {data.model.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{yn(r.apiStated)}</td>
                <td className="pr-3">{yn(r.gorStated)}</td>
                <td className="pr-3">{scoreList(r.scores)}</td>
                <td>{r.recommended.join(', ') || 'nothing at all'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        THE RECOMMENDATION BAND CAN BE EMPTY AND NOTHING IN THE RETURN SAYS SO. The band is any
        score within fifteen of the leader that also clears fifty, so on a well where the leader
        itself fails to clear fifty every method comes back not recommended and the caller gets a
        ranked list with no answer in it. On a constructed well that suits nothing the leader
        scores {fmt(data.band.topScore, 0)} and
        {' '}{fmt(data.band.recommendedCount, 0)} of {fmt(data.band.methods, 0)} methods are
        recommended: {scoreList(data.band.scores)}.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        AND THE DESIGN PASS ON THE SAME WELL REPORTS ITS OWN CALL AND NOT THE WELL. Run with no
        chains injected it comes back with {fmt(data.pass.methods, 0)} methods, of which
        {' '}{fmt(data.pass.threeRefusalsAreTheSameSentenceAndMeanOnlyThatNoChainWasInjected, 0)}
        {' '}refuse with the SAME sentence, which says nothing whatever about the well and means
        only that no chain was supplied. The one whose whole chain lives in the package runs for
        real and refuses for a real reason with two real numbers in it. The reconciliation then
        reports {fmt(data.pass.disagreements, 0)} disagreements and
        {' '}{fmt(data.pass.workable, 0)} workable methods, and every one of those verdicts is a
        statement about the ADVISOR CALL and not about the well:
        {' '}{yn(data.pass.everyVerdictHereIsAStatementAboutTheAdvisorCallAndNotAboutTheWell)}. The
        reconciliation itself reaches {fmt(data.reconcile.distinctVerdicts, 0)} distinct verdicts
        over the published truth table, {data.reconcile.verdicts.join(', ')}, and it initialises
        its verdict to a sixth name that no input can produce.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">method</th>
              <th className="text-left pr-3">the design succeeded</th>
              <th className="text-left pr-3">the verdict</th>
              <th className="text-left pr-3">the refusal says nothing about the well</th>
              <th className="text-left">what it said</th>
            </tr>
          </thead>
          <tbody>
            {data.pass.results.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.id}</td>
                <td className="pr-3">{yn(r.ok)}</td>
                <td className="pr-3">{data.pass.verdicts[r.id]}</td>
                <td className={r.itSaysNothingAboutTheWell ? 'pr-3 text-[#f97316]' : 'pr-3'}>{yn(r.itSaysNothingAboutTheWell)}</td>
                <td>{r.reason || 'it ran'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">duty, bbl/d</th>
              <th className="text-left pr-3">stage picked</th>
              <th className="text-left pr-3">its best-efficiency point, bbl/d</th>
              <th className="text-left pr-3">distance</th>
              <th className="text-left pr-3">nearest best-efficiency point</th>
              <th className="text-left">they agree</th>
            </tr>
          </thead>
          <tbody>
            {data.stages.map((r) => (
              <tr key={r.dutyBpd}>
                <td className="pr-3">{fmt(r.dutyBpd, 0)}</td>
                <td className="pr-3">{r.pickedId || 'none'}</td>
                <td className="pr-3">{fmt(r.pickedBepBpd, 0)}</td>
                <td className="pr-3">{fmt(r.pickedDistance, 4)}</td>
                <td className="pr-3">{r.nearestBepId}</td>
                <td className={r.theyAgree ? '' : 'text-[#f97316]'}>{yn(r.theyAgree)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The teaching lift well is at {fmt(data.conditions.trueVerticalDepthFt, 0)} ft with a tubing
        inside diameter of {fmt(data.conditions.tubingIdIn, 4)} in, an API of
        {' '}{fmt(data.conditions.api, 2)}, a bottomhole temperature of
        {' '}{fmt(data.conditions.bottomholeTemperatureF, 4)} degF, a wellhead pressure of
        {' '}{fmt(data.conditions.wellheadPressurePsia, 0)} psia and an inflow absolute open flow of
        {' '}{fmt(data.conditions.absoluteOpenFlowStbd, 0)} stb/d. It is a TEACHING case invented by
        this course, fed by the surveillance and allocation layers above it, and no oracle has
        checked any of it. The published screening seam, the published truth table and the
        reference stage ranges ARE published, and a watercut is a FRACTION in the two surveillance
        modules and a PER CENT in these two, so say which you mean every time.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const ReadingExplorer = ({ initialMode = 'seam' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Reading explorer"
      subtitle="What a number is worth once you know which column it came from: one ratio read two ways, the decline exponent guard and the spellings that are falsy, the guards in the wrong place, and the lift handoff where one rate is read as two different phases"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'seam' && <Seam />}
        {mode === 'decline' && <Decline />}
        {mode === 'guards' && <Guards />}
        {mode === 'lift' && <Lift />}
      </div>
    </PanelShell>
  );
};

export default ReadingExplorer;
