import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, LineChart, BarChart, Line, Bar, ReferenceLine,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { exceptionExplorer } from './surveillanceLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Exception explorer, the Professional tier. THE WINDOWED READING AND WHAT IT
// FIRES.
//
// Four modes. The two windows and the percentage change the engine computes
// from the CALENDAR column, shown beside the producing-day change it never
// looks at; the seven exception types with the threshold each one crossed, and
// the one that is always medium unconditionally; the well test that carries a
// well, with the age dial swept so the strictest-looking setting can be watched
// turning the check OFF; and the allocation, one meter shared over many wells.
//
// Every figure on this page is a return value from surveillanceLab, which is a
// return value from the vendored surveillance and allocation engines. Nothing
// here forms a window mean, decides a severity, ages out a test or splits a
// metered total. And every severity on this page is shown against the SETTING
// it was measured against, because a severity is not a measurement: it is the
// name of a threshold crossing, and the threshold is a number a caller chose.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['windows', 'The two windows, and the column the change is measured on'],
  ['exceptions', 'The seven types, and the threshold each one crossed'],
  ['tests', 'The test that carries a well, and the dial that ages it out'],
  ['allocation', 'One meter shared over many wells'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

// --------------------------------------------------------------------------

const Windows = () => {
  const data = useMemo(() => {
    try {
      return {
        windows: exceptionExplorer.windows(),
        seam: exceptionExplorer.seamWindow(),
        widening: exceptionExplorer.widening(),
        cadences: exceptionExplorer.cadences(),
        gaps: exceptionExplorer.cadenceGaps(),
        monthly: exceptionExplorer.monthlyRows(),
        monthlyHead: exceptionExplorer.monthlyHeadline(),
        publishedMonthly: exceptionExplorer.publishedMonthly(),
        means: exceptionExplorer.windowMeans(),
        two: exceptionExplorer.twoReadings(),
        uptime: exceptionExplorer.uptimeRows(),
        anchors: exceptionExplorer.defermentAnchors(),
        wallClock: exceptionExplorer.wallClock(),
        deferments: exceptionExplorer.publishedDeferments(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.means.length) {
    return (
      <Note>
        Every window in this module anchors on the field's latest ledger date. With no ledger in
        front of it there is no frontier to measure back from and no window to read.
      </Note>
    );
  }
  const chart = data.uptime.map((r) => ({
    date: r.date.slice(5),
    calendar: r.calendarOilStb,
    producingDay: r.producingDayOilStbd,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Recent window" value={fmt(data.windows[1].recentDays, 0)} unit="days" />
        <Tile label="Baseline window" value={fmt(data.windows[1].baselineDays, 0)} unit="days" />
        <Tile label="Change the engine reports, on the calendar column" value={fmt(data.two.dropPctOnCalendar, 6)} unit="%" />
        <Tile label="Change on the producing-day column" value={fmt(data.two.dropPctOnProducingDay, 6)} unit="%" />
      </TileGrid>
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="date" tick={AXIS}
              label={{ value: 'ledger date inside the recent window', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'stb over the row, and stb/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={data.two.baselineCalendarMean} stroke="#f97316" strokeDasharray="4 4" />
            <Bar dataKey="calendar" name="the CALENDAR volume the engine reads" fill="#38bdf8" isAnimationActive={false} />
            <Line type="monotone" dataKey="producingDay" name="the producing-day rate it never reads" stroke="#BFFF00" dot isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE COMPARISON IS ALWAYS A WELL AGAINST ITSELF, and the rate key is the CALENDAR volume.
        Both windows are half-open and they do not overlap, so the boundary day belongs to the
        earlier window and to exactly one of them. On the teaching field, asOf
        {' '}{data.windows[1].asOf}, the recent window runs {data.windows[1].recentFrom} to
        {' '}{data.windows[1].recentTo} and the baseline runs {data.windows[1].baselineFrom} to
        {' '}{data.windows[1].baselineTo}, and {fmt(data.windows[1].exceptionsRaised, 0)} exceptions
        are raised. On the published field, asOf {data.windows[0].asOf}, the same arithmetic gives
        {' '}{data.windows[0].recentFrom} to {data.windows[0].recentTo} against
        {' '}{data.windows[0].baselineFrom} to {data.windows[0].baselineTo}, which is the window the
        golden itself publishes for the seam well: {data.seam.recentFrom} to {data.seam.recentTo}
        {' '}against {data.seam.baselineFrom} to {data.seam.baselineTo}. Both anchor on the FIELD's
        latest ledger date and never on the wall clock, so a three-year-old dataset surveils
        honestly instead of declaring every well stale.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">well and column</th>
              <th className="text-left pr-3">recent mean</th>
              <th className="text-left pr-3">rows</th>
              <th className="text-left pr-3">baseline mean</th>
              <th className="text-left pr-3">rows</th>
              <th className="text-left pr-3">change</th>
              <th className="text-left">what column that is</th>
            </tr>
          </thead>
          <tbody>
            {data.means.map((r) => (
              <tr key={`${r.name}-${r.key}`}>
                <td className="pr-3">{r.name} {r.key}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.recentMean, 12)}</td>
                <td className="pr-3">{fmt(r.recentRows, 0)}</td>
                <td className="pr-3">{fmt(r.baselineMean, 12)}</td>
                <td className="pr-3">{fmt(r.baselineRows, 0)}</td>
                <td className="pr-3">{r.changePct === null ? `${fmt(r.riseInPoints, 9)} points` : `${fmt(r.changePct, 9)} %`}</td>
                <td>{r.measuredOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        THE COLUMN THAT SETTLES IT IS ON EVERY POINT AND IS NEVER READ. On {data.two.name}, a
        TEACHING well and not a published one, the recent calendar mean is
        {' '}{fmt(data.two.recentCalendarMean, 12)} stb against a baseline of
        {' '}{fmt(data.two.baselineCalendarMean, 12)} stb, a drop of
        {' '}{fmt(data.two.dropPctOnCalendar, 12)} per cent, which is past the trigger of
        {' '}{fmt(data.two.rateDropTrigger, 0)} per cent. The producing-day rate over the same rows
        is {fmt(data.two.recentProducingDayMean, 12)} stb/d against
        {' '}{fmt(data.two.baselineProducingDayMean, 12)} stb/d, a drop of
        {' '}{fmt(data.two.dropPctOnProducingDay, 12)} per cent, which is a rise. The mean recent
        hours are {fmt(data.two.recentHoursMean, 12)} h against a threshold of
        {' '}{fmt(data.two.downtimeThresholdHours, 0)} h, so the exception that would have named
        the real cause does not fire either. The two columns move in opposite directions:
        {' '}{yn(data.two.theTwoColumnsMoveInOppositeDirections)}.
      </div>
      <div className="mt-4 text-xs text-slate-300">
        THE WINDOWS WIDEN FOR A COARSE LEDGER AND THE VOLUMES DO NOT. Each well widens its own
        windows on its OWN cadence, so two wells on one field can be compared over different
        windows and nothing in the return says which window a row used. Nothing in a ledger row
        says how long the row covers, so the widening rescales the WINDOW and never the VOLUME.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">cadence, days</th>
              <th className="text-left pr-3">recent window, days</th>
              <th className="text-left pr-3">baseline window, days</th>
              <th className="text-left">stale threshold, days</th>
            </tr>
          </thead>
          <tbody>
            {data.widening.map((r) => (
              <tr key={r.cadenceDays}>
                <td className="pr-3">{fmt(r.cadenceDays, 4)}</td>
                <td className="pr-3">{fmt(r.recentDays, 0)}</td>
                <td className="pr-3">{fmt(r.baselineDays, 0)}</td>
                <td>{fmt(r.staleDays, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">gaps between consecutive points</th>
              <th className="text-left pr-3">points</th>
              <th className="text-left pr-3">cadence, days</th>
              <th className="text-left">a median over an even count</th>
            </tr>
          </thead>
          <tbody>
            {data.gaps.map((r) => (
              <tr key={r.gaps}>
                <td className="pr-3">{r.gaps}</td>
                <td className="pr-3">{fmt(r.points, 0)}</td>
                <td className="pr-3">{r.cadenceDays === null ? 'null, refused' : fmt(r.cadenceDays, 4)}</td>
                <td>{yn(r.aMedianOverAnEvenCountAveragesTheTwoMiddleGaps)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        A PERIOD VOLUME AND A RATE PER ELAPSED DAY TELL OPPOSITE STORIES, and the module only ever
        reads the first. On {data.monthlyHead.name}, a TEACHING well whose cadence is
        {' '}{fmt(data.monthlyHead.cadenceDays, 0)} days so its windows widen to
        {' '}{fmt(data.monthlyHead.recentDays, 0)} and {fmt(data.monthlyHead.baselineDays, 0)} days,
        the last period volume falls from {fmt(data.monthlyHead.previousPeriodVolume, 0)} stb over
        {' '}{fmt(data.monthlyHead.previousPeriodElapsedDays, 0)} days to
        {' '}{fmt(data.monthlyHead.lastPeriodVolume, 0)} stb over
        {' '}{fmt(data.monthlyHead.lastPeriodElapsedDays, 0)} days, which is
        {' '}{fmt(data.monthlyHead.previousRatePerElapsedDay, 9)} stb/d rising to
        {' '}{fmt(data.monthlyHead.lastRatePerElapsedDay, 9)} stb/d. The engine reports
        {' '}{data.monthlyHead.exceptionMessage} at {data.monthlyHead.exceptionSeverity} severity,
        the top of the ladder, for producing MORE oil per day than it did in the period before. The
        published monthly well shows the same shape with a different size:
        {' '}{data.publishedMonthly.exceptionMessage}
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">period row</th>
              <th className="text-left pr-3">oil over the period, stb</th>
              <th className="text-left pr-3">days since the previous row</th>
              <th className="text-left">oil per elapsed day, stb/d</th>
            </tr>
          </thead>
          <tbody>
            {data.monthly.map((r) => (
              <tr key={r.date}>
                <td className="pr-3">{r.date}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.periodOilStb, 4)}</td>
                <td className="pr-3">{r.daysSinceThePreviousRow === null ? 'not applicable' : fmt(r.daysSinceThePreviousRow, 0)}</td>
                <td className="text-[#BFFF00]">{r.oilPerElapsedDayStbd === null ? 'not applicable' : fmt(r.oilPerElapsedDayStbd, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        AND ONE FUNCTION IN THIS MODULE ANCHORS ON THE WALL CLOCK INSTEAD. The deferment roll-up
        defaults its anchor to today, in a file whose header says every window anchors on the
        field's latest ledger date precisely so an old dataset surveils honestly. This page will
        not print the unanchored number, and neither will any lesson, because a value that changes
        on every render cannot be pinned by a test: {data.wallClock.whyItIsNotReturned} What is
        printed instead is the property, as a boolean, and the same open event recomputed against
        {' '}{fmt(data.anchors.length, 0)} explicit anchors. Unanchored, the day count differs from
        the anchored one: {yn(data.wallClock.theDayCountDiffersFromTheAnchoredOne)}. The open count
        is the same either way: {yn(data.wallClock.theOpenCountIsTheSameEitherWay)}. The deferred
        volumes are the same either way: {yn(data.wallClock.theDeferredVolumesAreTheSameEitherWay)}.
        The published roll-up, handed its own published anchor of {data.deferments.asOf}, carries
        {' '}{fmt(data.deferments.events, 0)} events over {fmt(data.deferments.totalDays, 0)} days
        and {fmt(data.deferments.totalOil, 4)} stb of oil.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">one open event, anchored at</th>
              <th className="text-left pr-3">days accrued</th>
              <th className="text-left pr-3">open events</th>
              <th className="text-left">deferred oil, stb</th>
            </tr>
          </thead>
          <tbody>
            {data.anchors.map((r) => (
              <tr key={r.asOf}>
                <td className="pr-3">{r.asOf}</td>
                <td className="pr-3">{fmt(r.days, 0)}</td>
                <td className="pr-3">{fmt(r.openCount, 0)}</td>
                <td>{fmt(r.oil, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The window means in the first table are formed the way the exception engine forms them, as
        an unweighted arithmetic mean over a half-open interval, and the ratio rows among them are
        therefore a MEAN OF DAILY RATIOS rather than a volumetric period ratio. That distinction is
        the whole of the Expert tier. Every teaching row here belongs to a field this course
        invented, and every published row is committed in a golden by an independent oracle.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Exceptions = () => {
  const [sweepKey, setSweepKey] = useState('rateDropPct');
  const data = useMemo(() => {
    try {
      return {
        ladder: exceptionExplorer.ladder(),
        head: exceptionExplorer.ladderHeadline(),
        published: exceptionExplorer.publishedExceptions(),
        teaching: exceptionExplorer.teachingExceptions(),
        teachingHead: exceptionExplorer.teachingExceptionHeadline(),
        types: exceptionExplorer.wellTypes(),
        keys: exceptionExplorer.settingsSweepKeys(),
      };
    } catch { return null; }
  }, []);
  const sweep = useMemo(() => {
    try { return exceptionExplorer.settingsSweep(sweepKey); } catch { return []; }
  }, [sweepKey]);
  if (!data || !data.ladder.length) {
    return (
      <Note>
        The seven exception types and their thresholds are exported by the vendored surveillance
        engine. With that package absent there is no ladder to read and nothing fires.
      </Note>
    );
  }
  const chart = sweep.map((r) => ({
    setting: r.settingValue,
    high: r.high,
    medium: r.medium,
    info: r.info,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Exception types" value={fmt(data.head.types, 0)} />
        <Tile label="Types that can reach high" value={fmt(data.head.typesThatCanReachHigh, 0)} />
        <Tile label="Always medium, whatever the size" value={data.head.theOneThatIsAlwaysMediumUnconditionally} />
        <Tile label="Always high, whatever the size" value={data.head.theOneThatIsAlwaysHigh} />
      </TileGrid>
      <div className="mt-3 text-xs text-slate-300">
        A SEVERITY IS THE NAME OF A THRESHOLD CROSSED TWICE, and not a measurement. Every severity
        in this module is high when the trigger is exceeded by a factor of two and medium
        otherwise, and three of the {fmt(data.head.types, 0)} types do not work that way at all.
        The shut-in type is ALWAYS high, however small the well, and it sits inside the minimum
        rate gate. The downtime type is ALWAYS MEDIUM, unconditionally, whatever the hours: it has
        no doubling point at all, so a well averaging one hour a day and a well averaging eleven
        rank identically. And the stale-data type doubles only from info to medium, so a well
        silent for four hundred days cannot outrank a forty per cent rate drop and is ordered among
        the mediums alphabetically. The sort is severity then well name and nothing else, so the
        reading order of a surveillance list carries no information about size.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">type</th>
              <th className="text-left pr-3">setting it is measured against</th>
              <th className="text-left pr-3">trigger</th>
              <th className="text-left pr-3">doubling to high</th>
              <th className="text-left pr-3">can reach high</th>
              <th className="text-left pr-3">inside the minimum rate gate</th>
              <th className="text-left">what a reader has to know</th>
            </tr>
          </thead>
          <tbody>
            {data.ladder.map((r) => (
              <tr key={r.type}>
                <td className="pr-3">{r.type}</td>
                <td className="pr-3">{r.settingKey}</td>
                <td className="pr-3">{fmt(r.settingValue, 4)}</td>
                <td className={r.doublingAt === null ? 'pr-3 text-[#f97316]' : 'pr-3'}>{r.doublingAt === null ? 'none, it does not climb' : fmt(r.doublingAt, 4)}</td>
                <td className="pr-3">{yn(r.canReachHigh)}</td>
                <td className="pr-3">{yn(r.gatedByMinOilRate)}</td>
                <td>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        THE PUBLISHED FIELD RAISES {fmt(data.published.length, 0)} EXCEPTIONS, and the golden
        commits every one of them: the type, the severity, the value and the baseline. Read the
        severity column against the setting column beside it.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">well</th>
              <th className="text-left pr-3">type</th>
              <th className="text-left pr-3">severity</th>
              <th className="text-left pr-3">value</th>
              <th className="text-left pr-3">baseline</th>
              <th className="text-left pr-3">setting crossed</th>
              <th className="text-left">the message it printed</th>
            </tr>
          </thead>
          <tbody>
            {data.published.map((r) => (
              <tr key={`${r.wellName}-${r.type}-${r.index}`}>
                <td className="pr-3">{r.wellName}</td>
                <td className="pr-3">{r.type}</td>
                <td className={r.severity === 'high' ? 'pr-3 text-[#f97316]' : 'pr-3'}>{r.severity}</td>
                <td className="pr-3">{fmt(r.value, 12)}</td>
                <td className="pr-3">{fmt(r.baseline, 12)}</td>
                <td className="pr-3">{r.settingKey} {fmt(r.settingValue, 4)}</td>
                <td>{r.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        AND THE TEACHING FIELD RAISES {fmt(data.teachingHead.raised, 0)} ON
        {' '}{fmt(data.teachingHead.wellsSurveilled, 0)} OF {fmt(data.teachingHead.wellsHandedIn, 0)}
        {' '}WELLS. One well is dropped before any comparison runs, because observation wells are
        filtered out and carry no rates of their own to surveil. The wells that raised nothing at
        all are {data.teachingHead.wellsThatRaisedNothing.join(', ')}. The severities break down as
        {' '}{fmt(data.teachingHead.highCount, 0)} high, {fmt(data.teachingHead.mediumCount, 0)}
        {' '}medium and {fmt(data.teachingHead.infoCount, 0)} info. The rate key behind every one
        of the rate rows is the CALENDAR volume: {yn(data.teachingHead.theRateKeyIsTheCalendarVolume)}.
        The producing-day rate is read by exactly one function in the whole file,
        {' '}{data.teachingHead.theProducingDayRateIsReadByExactlyOneFunctionInTheFile}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">well</th>
              <th className="text-left pr-3">type</th>
              <th className="text-left pr-3">severity</th>
              <th className="text-left pr-3">value</th>
              <th className="text-left pr-3">baseline</th>
              <th className="text-left pr-3">setting crossed</th>
              <th className="text-left">the message it printed</th>
            </tr>
          </thead>
          <tbody>
            {data.teaching.map((r) => (
              <tr key={`${r.wellName}-${r.type}`}>
                <td className="pr-3">{r.wellName}</td>
                <td className="pr-3">{r.type}</td>
                <td className={r.severity === 'high' ? 'pr-3 text-[#f97316]' : 'pr-3'}>{r.severity}</td>
                <td className="pr-3">{fmt(r.value, 12)}</td>
                <td className="pr-3">{fmt(r.baseline, 12)}</td>
                <td className="pr-3">{r.settingKey} {fmt(r.settingValue, 4)}{r.alwaysMedium ? ', and no doubling point' : ''}</td>
                <td>{r.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FieldGrid>
        <SelectField label="Sweep one dial" value={sweepKey} onChange={setSweepKey}
          options={data.keys.map((k) => [k, k])} />
      </FieldGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="setting" tick={AXIS} interval={0} height={40}
              label={{ value: `${sweepKey} as set`, position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} allowDecimals={false}
              label={{ value: 'exceptions raised', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 0)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="high" name="high" stackId="s" fill="#f97316" isAnimationActive={false} />
            <Bar dataKey="medium" name="medium" stackId="s" fill="#BFFF00" isAnimationActive={false} />
            <Bar dataKey="info" name="info" stackId="s" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">{sweepKey}</th>
              <th className="text-left pr-3">the default</th>
              <th className="text-left pr-3">exceptions</th>
              <th className="text-left pr-3">high</th>
              <th className="text-left pr-3">medium</th>
              <th className="text-left pr-3">info</th>
              <th className="text-left">types raised</th>
            </tr>
          </thead>
          <tbody>
            {sweep.map((r) => (
              <tr key={r.settingValue}>
                <td className="pr-3">{fmt(r.settingValue, 4)}</td>
                <td className="pr-3">{yn(r.isTheDefault)}</td>
                <td className="pr-3">{fmt(r.exceptions, 0)}</td>
                <td className="pr-3">{fmt(r.high, 0)}</td>
                <td className="pr-3">{fmt(r.medium, 0)}</td>
                <td className="pr-3">{fmt(r.info, 0)}</td>
                <td>{r.types}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">well type as filed</th>
              <th className="text-left pr-3">filtered out entirely</th>
              <th className="text-left pr-3">read as a producer</th>
              <th className="text-left pr-3">read as an injector</th>
              <th className="text-left">what it raised</th>
            </tr>
          </thead>
          <tbody>
            {data.types.map((r) => (
              <tr key={r.wellType}>
                <td className="pr-3">{r.wellType}</td>
                <td className="pr-3">{yn(r.filteredOutEntirely)}</td>
                <td className="pr-3">{yn(r.readAsAProducer)}</td>
                <td className="pr-3">{yn(r.readAsAnInjector)}</td>
                <td>{r.types}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        A SURVEILLANCE LIST IS A FUNCTION OF THE SETTINGS AS MUCH AS OF THE DATA, and no row in the
        return names the setting that put it there. That is what the sweep above is for: one dial
        at a time, everything else left at the default, on the published field. Note the last table
        too. The engine filters observation wells and branches on injectors, so every other spelling
        of a well type, including an injector spelled a different way and a type nobody filled in,
        takes the PRODUCER path and is compared on the oil column it does not have.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Tests = () => {
  const data = useMemo(() => {
    try {
      return {
        published: exceptionExplorer.publishedTestInForce(),
        guard: exceptionExplorer.ageGuard(),
        guardHead: exceptionExplorer.ageGuardHeadline(),
        sweep: exceptionExplorer.maxTestAgeSweep(),
        sweepHead: exceptionExplorer.maxTestAgeHeadline(),
        group: exceptionExplorer.groupTests(),
        tests: exceptionExplorer.teachingTests(),
        inForce: exceptionExplorer.teachingTestInForce(),
        qc: exceptionExplorer.publishedQc(),
        coverage: exceptionExplorer.qcCoverage(),
        teachingQc: exceptionExplorer.teachingQc(),
        outlier: exceptionExplorer.outlierReach(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.sweep.length) {
    return (
      <Note>
        A well with no test in force takes NO share rather than a guessed rate, and says so as a
        diagnostic. With no tests and no ledger in front of it there is nothing in force and
        nothing to show.
      </Note>
    );
  }
  const chart = data.sweep.map((r) => ({
    days: r.maxTestAgeDays,
    theoretical: r.theoreticalOil,
    wells: r.wellsTakingAShare,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Theoretical oil at a 60 day limit" value={fmt(data.sweepHead.theoreticalOilAt60Days, 6)} unit="stb" />
        <Tile label="Theoretical oil at a 0 day limit" value={fmt(data.sweepHead.theoreticalOilAt0Days, 6)} unit="stb" />
        <Tile label="Wells taking a share at 1 day" value={fmt(data.sweepHead.wellsAt1Day, 0)} />
        <Tile label="Wells taking a share at 0 days" value={fmt(data.sweepHead.wellsAt0Days, 0)} />
      </TileGrid>
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="days" tick={AXIS} interval={0} height={40}
              label={{ value: 'maximum test age allowed, days', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'theoretical oil over the window, stb', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="theoretical" name="theoretical oil, stb" stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        ONE DIAL DECIDES WHICH WELLS ARE IN THE SPLIT AT ALL, AND ITS GUARD DECIDES MORE THAN THE
        LIMIT DOES. A well is carried on an allocated day by the most recent test on or before that
        day, within the age limit. The clause is a finite check AND a greater-than-zero check, so
        any setting that is not a finite positive number turns the age check OFF ENTIRELY and the
        oldest test on file carries the well for ever. On the teaching field a limit of 60 days
        gives a theoretical oil of {fmt(data.sweepHead.theoreticalOilAt60Days, 9)} stb over
        {' '}{fmt(data.sweepHead.wellsAt60Days, 0)} wells, a limit of one day gives
        {' '}{fmt(data.sweepHead.theoreticalOilAt1Day, 9)} stb over
        {' '}{fmt(data.sweepHead.wellsAt1Day, 0)} well, and a limit of ZERO days gives
        {' '}{fmt(data.sweepHead.theoreticalOilAt0Days, 9)} stb over
        {' '}{fmt(data.sweepHead.wellsAt0Days, 0)} wells, which is MORE than the default allows.
        Tightening the limit from one day to zero does not tighten it further, it turns the check
        off: {yn(data.sweepHead.tighteningFromOneDayToZeroTurnsTheCheckOff)}. The
        strictest-looking setting on the dial is the loosest behaviour in the module. Note also
        what ageing a test out does NOT do: the metered volume is unchanged and the same barrels
        are spread over fewer wells, so every surviving well is credited with more, and the
        allocated total at 60 days and at 0 days is the same:
        {' '}{yn(data.sweepHead.theAllocatedTotalIsUnchangedByAgeingATestOut)}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the age limit as set</th>
              <th className="text-left pr-3">it is a finite positive number</th>
              <th className="text-left pr-3">the age check ran</th>
              <th className="text-left pr-3">the old test carries the well</th>
              <th className="text-left">the test is this many days old</th>
            </tr>
          </thead>
          <tbody>
            {data.guard.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{yn(r.settingIsAFinitePositiveNumber)}</td>
                <td className={r.theAgeCheckRan ? 'pr-3' : 'pr-3 text-[#f97316]'}>{yn(r.theAgeCheckRan)}</td>
                <td className={r.theOldTestCarriesTheWell ? 'pr-3 text-[#f97316]' : 'pr-3'}>{yn(r.theOldTestCarriesTheWell)}</td>
                <td>{fmt(r.testAgeDays, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">age limit, days</th>
              <th className="text-left pr-3">the check ran</th>
              <th className="text-left pr-3">wells taking a share</th>
              <th className="text-left pr-3">theoretical oil, stb</th>
              <th className="text-left pr-3">allocated oil, stb</th>
              <th className="text-left pr-3">metered oil in no well, stb</th>
              <th className="text-left">diagnostics</th>
            </tr>
          </thead>
          <tbody>
            {data.sweep.map((r) => (
              <tr key={r.maxTestAgeDays}>
                <td className="pr-3">{fmt(r.maxTestAgeDays, 0)}</td>
                <td className={r.theAgeCheckRan ? 'pr-3' : 'pr-3 text-[#f97316]'}>{yn(r.theAgeCheckRan)}</td>
                <td className="pr-3">{fmt(r.wellsTakingAShare, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.theoreticalOil, 9)}</td>
                <td className="pr-3">{fmt(r.allocatedOil, 9)}</td>
                <td className="pr-3">{fmt(r.unallocatedMeteredOil, 6)}</td>
                <td>{r.diagnostics}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        WHICH TESTS ARE EVEN CANDIDATES. The grouping drops a test only when its validity flag is
        STRICTLY false, so a test that was never quality checked, a null, a zero and the STRING
        that spells false are all kept. And the quality check and the grouping live in one file and
        neither asks the other anything: a test the same file's quality check calls a mismatch on
        carries its well regardless, because the grouping reads the validity flag and nothing else.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">test</th>
              <th className="text-left pr-3">validity flag as written</th>
              <th className="text-left pr-3">kept by default</th>
              <th className="text-left pr-3">kept with the invalid ones included</th>
              <th className="text-left">dropped only because it is strictly false</th>
            </tr>
          </thead>
          <tbody>
            {data.group.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.id}</td>
                <td className="pr-3">{r.isValidAsWritten}</td>
                <td className="pr-3">{yn(r.keptByDefault)}</td>
                <td className="pr-3">{yn(r.keptWithIncludeInvalid)}</td>
                <td>{yn(r.droppedOnlyBecauseItIsStrictlyFalse)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">allocated day</th>
              <th className="text-left pr-3">well</th>
              <th className="text-left pr-3">test in force</th>
              <th className="text-left pr-3">test date</th>
              <th className="text-left pr-3">oil rate, stb/d</th>
              <th className="text-left">age, days</th>
            </tr>
          </thead>
          <tbody>
            {data.inForce.map((r) => (
              <tr key={`${r.date}-${r.wellName}`}>
                <td className="pr-3">{r.date}</td>
                <td className="pr-3">{r.wellName}</td>
                <td className={r.noTestInForce ? 'pr-3 text-[#f97316]' : 'pr-3'}>{r.testId || 'no test in force'}</td>
                <td className="pr-3">{r.testDate || 'none'}</td>
                <td className="pr-3">{r.oilRateStbd === null ? 'none' : fmt(r.oilRateStbd, 6)}</td>
                <td>{r.ageDays === null ? 'none' : fmt(r.ageDays, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        AND WHAT THE QUALITY CHECK IS NEVER ASKED. Every check in it is against data the ledger
        already holds, the well's own test history and the daily ledger on the test date, so the
        verdict never depends on a well model that may not exist. It returns only the tests WITH
        issues: {fmt(data.coverage.testsHandedIn, 0)} tests in,
        {' '}{fmt(data.coverage.rowsReturned, 0)} rows out, and
        {' '}{fmt(data.coverage.testsWithNoIssueAndThereforeAbsent, 0)} clean tests simply absent.
        There is no count of tests checked anywhere in the return, so an empty array means either
        every test is clean or nothing ran, and a caller cannot tell which:
        {' '}{yn(data.coverage.anEmptyArrayMeansEitherAllCleanOrNothingRan)}. The outlier check
        also needs three prior tests on the same well, so a well's first bad test is never caught
        and instead becomes part of the median that judges the later ones.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">tests on the well</th>
              <th className="text-left pr-3">prior tests available</th>
              <th className="text-left pr-3">the outlier fired</th>
              <th className="text-left">codes on the last test</th>
            </tr>
          </thead>
          <tbody>
            {data.outlier.map((r) => (
              <tr key={r.testsOnTheWell}>
                <td className="pr-3">{fmt(r.testsOnTheWell, 0)}</td>
                <td className="pr-3">{fmt(r.priorTestsAvailable, 0)}</td>
                <td className={r.theOutlierFired ? 'pr-3 text-[#f97316]' : 'pr-3'}>{yn(r.theOutlierFired)}</td>
                <td>{r.codesOnTheLastTest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">published test</th>
              <th className="text-left pr-3">test date</th>
              <th className="text-left pr-3">severity</th>
              <th className="text-left pr-3">codes</th>
              <th className="text-left">what it said</th>
            </tr>
          </thead>
          <tbody>
            {data.qc.map((r) => (
              <tr key={r.testId}>
                <td className="pr-3">{r.testId}</td>
                <td className="pr-3">{r.testDate}</td>
                <td className={r.severity === 'high' ? 'pr-3 text-[#f97316]' : 'pr-3'}>{r.severity}</td>
                <td className="pr-3">{r.codes}</td>
                <td>{r.messages}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">teaching test</th>
              <th className="text-left pr-3">well</th>
              <th className="text-left pr-3">severity</th>
              <th className="text-left pr-3">codes</th>
              <th className="text-left">what it said</th>
            </tr>
          </thead>
          <tbody>
            {data.teachingQc.map((r) => (
              <tr key={r.testId}>
                <td className="pr-3">{r.testId}</td>
                <td className="pr-3">{r.wellName}</td>
                <td className="pr-3">{r.severity}</td>
                <td className="pr-3">{r.codes}</td>
                <td>{r.messages}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The teaching tests are invented by this course and no oracle has ever checked one of them.
        The published probes and the published quality-check rows are committed in the allocation
        golden by an oracle that bisects into explicit validity intervals where the module scans
        and breaks. Read one of the teaching rows against the allocation view: a test the quality
        check calls a watercut mismatch still carries its well, because the two functions live in
        one file and neither asks the other anything.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Allocation = () => {
  const data = useMemo(() => {
    try {
      return {
        published: exceptionExplorer.publishedAllocation(),
        closure: exceptionExplorer.closure(),
        noBasis: exceptionExplorer.noBasis(),
        days: exceptionExplorer.allocationDays(),
        wells: exceptionExplorer.allocationWells(),
        head: exceptionExplorer.allocationHeadline(),
        missing: exceptionExplorer.missingRow(),
        quiet: exceptionExplorer.quietWell(),
        quietHead: exceptionExplorer.quietWellHeadline(),
        imbalance: exceptionExplorer.teachingImbalance(),
        publishedImbalance: exceptionExplorer.publishedImbalance(),
        monthly: exceptionExplorer.monthlyFactors(),
        nothingToScale: exceptionExplorer.nothingToScale(),
        writeBack: exceptionExplorer.writeBack(),
        band: exceptionExplorer.factorBand(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.days.length) {
    return (
      <Note>
        An allocation splits one metered stream across the wells. With no metered totals and no
        tests in front of it there is no factor to form and nothing to split.
      </Note>
    );
  }
  const chart = data.days.map((d) => ({
    date: d.date.slice(5),
    oil: d.oilFactor,
    water: d.waterFactor,
    gas: d.gasFactor,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Allocated days" value={fmt(data.head.allocatedDays, 0)} />
        <Tile label="Wells taking a share" value={fmt(data.head.wellsTakingAShare, 0)} />
        <Tile label="Measured oil over the window" value={fmt(data.head.measuredOil, 6)} unit="stb" />
        <Tile label="Closure residual on oil" value={fmt(data.head.closureResidualOil, 9)} unit="stb" />
      </TileGrid>
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="date" tick={AXIS} interval={2} height={40}
              label={{ value: 'allocated day', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'allocation factor, dimensionless', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 9)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#64748b" strokeDasharray="4 4" />
            <ReferenceLine y={0.7} stroke="#f97316" strokeDasharray="2 4" />
            <ReferenceLine y={1.3} stroke="#f97316" strokeDasharray="2 4" />
            <Line type="monotone" dataKey="oil" name="oil factor" stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="water" name="water factor" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="gas" name="gas factor" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE FACTOR IS THE OUTPUT AND NOT AN INTERNAL. A theoretical is a test rate times an uptime
        fraction, the factor is the metered total over the sum of the theoreticals, and every share
        is that factor times a theoretical. A factor of one means the wells' tests add up to exactly
        what the facility measured, and nothing normalises it or clamps it into the warning band:
        the band raises a diagnostic and the number is reported as it fell out, which is the design
        decision that makes an allocation defensible. On the teaching field, over
        {' '}{fmt(data.head.allocatedDays, 0)} metered days from {data.head.firstDate} to
        {' '}{data.head.lastDate}, {fmt(data.head.wellsTakingAShare, 0)} wells take a share and
        {' '}{fmt(data.head.diagnostics, 0)} diagnostics are raised: {data.head.diagnosticsByCode}.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        CLOSURE HOLDS PER DAY, EXACTLY, AND FAILS SILENTLY AT THE GRAND TOTAL. Because every share
        is the same factor times a theoretical, an allocated day closes to the last bit. A date
        whose theoretical is zero has NO factor, is not allocated at all, and its metered volume is
        simply not in the grand allocated: on the published no-basis case that is
        {' '}{fmt(data.noBasis.meteredOilInNoWellAndInNoTotal, 4)} stb of oil measured, in no well
        and in no total. There is no closure figure in the return
        ({yn(data.noBasis.thereIsNoClosureFigureInTheReturn)}), so a consumer that wants to know
        whether the field closed has to subtract the two totals itself and nothing prompts it to.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">published day</th>
              <th className="text-left pr-3">oil factor</th>
              <th className="text-left pr-3">measured oil, stb</th>
              <th className="text-left pr-3">theoretical oil, stb</th>
              <th className="text-left pr-3">allocated oil, stb</th>
              <th className="text-left">closure residual</th>
            </tr>
          </thead>
          <tbody>
            {data.closure.map((r) => (
              <tr key={r.date}>
                <td className="pr-3">{r.date}</td>
                <td className="pr-3">{fmt(r.oilFactor, 12)}</td>
                <td className="pr-3">{fmt(r.measuredOil, 6)}</td>
                <td className="pr-3">{fmt(r.theoreticalOil, 6)}</td>
                <td className="pr-3">{fmt(r.allocatedOil, 6)}</td>
                <td className="text-[#BFFF00]">{fmt(r.closureResidual, 12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">published setting</th>
              <th className="text-left pr-3">theoretical oil, stb</th>
              <th className="text-left pr-3">allocated oil, stb</th>
              <th className="text-left pr-3">grand factor</th>
              <th className="text-left pr-3">wells</th>
              <th className="text-left">diagnostics</th>
            </tr>
          </thead>
          <tbody>
            {data.published.map((r) => (
              <tr key={r.key}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.theoreticalOil, 9)}</td>
                <td className="pr-3">{fmt(r.allocatedOil, 6)}</td>
                <td className="pr-3">{fmt(r.grandFactor, 12)}</td>
                <td className="pr-3">{fmt(r.wellsTakingAShare, 0)}</td>
                <td>{r.diagnostics}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        A WELL THAT FILED NO ROW AT ALL TAKES A FULL SHARE. The split looks up a ledger row per
        well per date to find the hours; when there is no row the lookup returns nothing, the
        finite check fails, and the default of twenty-four hours is substituted. Told the truth
        about a shut well, the engine credits the well that made every barrel with all of them.
        Told NOTHING about it, the engine credits it with half, and the only thing that changed is
        which rows exist. The factor moves to exactly
        {' '}{fmt(data.missing[1].oilFactor, 6)} and an out-of-band diagnostic fires, which is the
        module noticing the symptom and not the cause.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">what the second well did</th>
              <th className="text-left pr-3">oil factor</th>
              <th className="text-left pr-3">its uptime</th>
              <th className="text-left pr-3">its theoretical, stb</th>
              <th className="text-left pr-3">its allocated, stb</th>
              <th className="text-left">diagnostics</th>
            </tr>
          </thead>
          <tbody>
            {data.missing.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.oilFactor, 12)}</td>
                <td className="pr-3">{r.shareBUptime === null ? 'took no share' : fmt(r.shareBUptime, 6)}</td>
                <td className="pr-3">{r.shareBTheoreticalOil === null ? 'none' : fmt(r.shareBTheoreticalOil, 6)}</td>
                <td className={r.shareBWasCreditedWithBarrelsItNeverMade ? 'pr-3 text-[#f97316]' : 'pr-3'}>{r.shareBAllocatedOil === null ? 'none' : fmt(r.shareBAllocatedOil, 6)}</td>
                <td>{r.diagnostics}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        ONE WELL, TWO MODULES, TWO OPPOSITE READINGS OF THE SAME SILENCE. On the teaching field
        {' '}{data.quietHead.name} stops filing rows partway through the allocated window and does
        not stop producing. For {fmt(data.quietHead.daysWithNoLedgerRow, 0)} of the
        {' '}{fmt(data.quietHead.allocatedDays, 0)} allocated days it has no ledger row at all, and
        on {fmt(data.quietHead.daysCreditedWithAFullDayOnStream, 0)} of them the allocation credits
        it with a full twenty-four hours on stream and gives it a share, until its test finally
        ages out and it takes none. The surveillance half of the same package reads the identical
        absence as {data.quietHead.surveillanceExceptionType} at
        {' '}{data.quietHead.surveillanceExceptionSeverity} severity:
        {' '}{data.quietHead.surveillanceExceptionMessage}
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">allocated day</th>
              <th className="text-left pr-3">ledger row filed</th>
              <th className="text-left pr-3">uptime credited</th>
              <th className="text-left pr-3">test in force</th>
              <th className="text-left pr-3">theoretical oil, stb</th>
              <th className="text-left">allocated oil, stb</th>
            </tr>
          </thead>
          <tbody>
            {data.quiet.map((r) => (
              <tr key={r.date}>
                <td className="pr-3">{r.date}</td>
                <td className={r.ledgerRowFiled ? 'pr-3' : 'pr-3 text-[#f97316]'}>{yn(r.ledgerRowFiled)}</td>
                <td className="pr-3">{r.uptime === null ? 'took no share at all' : fmt(r.uptime, 9)}</td>
                <td className="pr-3">{r.testId || 'none'}</td>
                <td className="pr-3">{r.theoreticalOil === null ? 'none' : fmt(r.theoreticalOil, 6)}</td>
                <td>{r.allocatedOil === null ? 'none' : fmt(r.allocatedOil, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        THE IMBALANCE IS THE UNACCOUNTED VOLUME AN ALLOCATION ENGINEER CHASES: the metered total
        against what the wells' own meters booked. Positive means the facility meter saw MORE than
        the wells did. The percentage is against what the WELLS BOOKED and not against the meter,
        and it is null when the wells booked nothing at all, so a date on which the meter saw
        volume and the wells booked none has a real imbalance and no percentage. Read the column
        across the day the quiet well goes silent: nothing about the field changed except which
        rows exist, and the unaccounted volume steps.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">day</th>
              <th className="text-left pr-3">measured oil, stb</th>
              <th className="text-left pr-3">booked oil, stb</th>
              <th className="text-left pr-3">imbalance, stb</th>
              <th className="text-left">imbalance, %</th>
            </tr>
          </thead>
          <tbody>
            {data.imbalance.map((r) => (
              <tr key={r.date}>
                <td className="pr-3">{r.date}</td>
                <td className="pr-3">{fmt(r.measuredOil, 6)}</td>
                <td className="pr-3">{fmt(r.bookedOil, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.imbalanceOil, 9)}</td>
                <td>{r.imbalanceOilPct === null ? 'null' : fmt(r.imbalanceOilPct, 12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        A MONTHLY FACTOR OF ONE HAS TWO MEANINGS AND THE RETURN CANNOT TELL THEM APART. A month
        with no theoretical volume for a phase carries a factor of one, documented as nothing to
        scale, which is indistinguishable from a month in which the tests agreed with the meter
        exactly. Hand it one well whose test recorded no gas and the gas factor comes back
        {' '}{fmt(data.nothingToScale.gasFactor, 6)} while {fmt(data.nothingToScale.meteredGas, 4)}
        {' '}Mscf of metered gas is allocated to nobody, and the diagnostic that distinguishes the
        two cases is on a different array: {data.nothingToScale.diagnosticsRaised}. The write-back
        shape carries the uptime through as an hours column, so a ledger written back from an
        allocation stays self-consistent with the split that produced it, and a well that never
        filed a row gets one: {fmt(data.writeBack.rows, 0)} rows over
        {' '}{fmt(data.writeBack.distinctWells, 0)} wells, of which
        {' '}{fmt(data.writeBack.rowsCarryingAnHoursOn, 0)} carry an hours column.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">well</th>
              <th className="text-left pr-3">days</th>
              <th className="text-left pr-3">theoretical oil, stb</th>
              <th className="text-left pr-3">allocated oil, stb</th>
              <th className="text-left pr-3">allocated water, stb</th>
              <th className="text-left">credited over theoretical</th>
            </tr>
          </thead>
          <tbody>
            {data.wells.map((r) => (
              <tr key={r.wellName}>
                <td className="pr-3">{r.wellName}</td>
                <td className="pr-3">{fmt(r.days, 0)}</td>
                <td className="pr-3">{fmt(r.theoreticalOil, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.allocatedOil, 9)}</td>
                <td className="pr-3">{fmt(r.allocatedWater, 9)}</td>
                <td>{fmt(r.creditedOverTheoretical, 12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">metered over theoretical</th>
              <th className="text-left pr-3">reported factor</th>
              <th className="text-left pr-3">allocated oil, stb</th>
              <th className="text-left">out of band</th>
            </tr>
          </thead>
          <tbody>
            {data.band.map((r) => (
              <tr key={r.meteredOverTheoretical}>
                <td className="pr-3">{fmt(r.meteredOverTheoretical, 4)}</td>
                <td className="pr-3">{fmt(r.reportedFactor, 12)}</td>
                <td className="pr-3">{fmt(r.allocatedOil, 6)}</td>
                <td className={r.outOfBand ? 'text-[#f97316]' : ''}>{yn(r.outOfBand)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The teaching field, its wells, its tests and its metered totals are invented by this course
        and are not a published case and not a real field. The published allocation rows, the
        closure days and the no-basis case are committed in the allocation golden by an oracle
        that splits the metered total as a SHARE where the module multiplies by a precomputed
        factor. An allocated barrel is a booking and not a measurement, and the monthly factor
        table beside it carries {fmt(data.monthly.length, 0)} well-months of exactly that.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const ExceptionExplorer = ({ initialMode = 'exceptions' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Exception explorer"
      subtitle="The windowed reading and what it fires: the two windows and the column the change is measured on, the seven exception types with the threshold each one crossed, the well test that carries a well and the dial that ages it out, and one meter shared over many wells"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'windows' && <Windows />}
        {mode === 'exceptions' && <Exceptions />}
        {mode === 'tests' && <Tests />}
        {mode === 'allocation' && <Allocation />}
      </div>
    </PanelShell>
  );
};

export default ExceptionExplorer;
