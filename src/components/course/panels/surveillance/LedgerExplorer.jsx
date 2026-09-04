import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, LineChart, BarChart, Line, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { ledgerExplorer } from './surveillanceLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Ledger explorer, the Associate tier. THE LEDGER AND WHAT A ROW MEANS.
//
// Four modes. A daily ledger and the producing-day rate it implies, drawn
// together so the two columns can be watched moving in OPPOSITE directions on
// the teaching well; the two ratios one row carries and the different
// conditions they refuse on; rows aggregated into a field, including the four
// row sweep where a text column concatenates instead of adding; and the field
// KPIs, which are the only surveillance return with no baseline in it at all.
//
// Every figure on this page is a return value from surveillanceLab, which is a
// return value from the vendored surveillance engine. Nothing here derives a
// rate, forms a ratio, adds a field total or works out an uptime. And every
// calendar volume on this page is shown beside the PRODUCING-DAY rate off the
// same row, because a volume with no rate beside it is the number this whole
// course exists to warn about.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['ledger', 'A daily ledger, and the producing-day rate it implies'],
  ['ratios', 'The two ratios one row carries, and where each refuses'],
  ['field', 'Rows added into a field, and what a text column does to the sum'],
  ['kpis', 'The field roll-up, which has no baseline in it at all'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

// --------------------------------------------------------------------------

const Ledger = () => {
  const data = useMemo(() => {
    try {
      return {
        rows: ledgerExplorer.publishedRows(),
        members: ledgerExplorer.members(),
        sweep: ledgerExplorer.hoursSweep(),
        spellings: ledgerExplorer.hoursSpellings(),
        outOfRange: ledgerExplorer.hoursOutOfRange(),
        uptime: ledgerExplorer.uptimeRows(),
        head: ledgerExplorer.uptimeHeadline(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.uptime.length) {
    return (
      <Note>
        The published ledger rows and the teaching field are shipped inside the engine package.
        With that package absent there is no row to derive a point from and nothing to draw.
      </Note>
    );
  }
  const chart = data.uptime.map((r) => ({
    date: r.date.slice(5),
    calendar: r.calendarOilStb,
    producingDay: r.producingDayOilStbd,
    hours: r.hoursOn,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Mean calendar oil over the recent window" value={fmt(data.head.recentCalendarMean, 6)} unit="stb" />
        <Tile label="Mean producing-day oil over the same window" value={fmt(data.head.recentProducingDayMean, 6)} unit="stb/d" />
        <Tile label="Drop the engine reports, on the calendar column" value={fmt(data.head.dropPctOnCalendar, 6)} unit="%" />
        <Tile label="Drop on the producing-day column, which nobody computes" value={fmt(data.head.dropPctOnProducingDay, 6)} unit="%" />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="date" tick={AXIS}
              label={{ value: 'ledger date', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'stb over the row, and stb/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="calendar" name="the calendar volume, stb" fill="#38bdf8" isAnimationActive={false} />
            <Line type="monotone" dataKey="producingDay" name="the producing-day rate, stb/d" stroke="#BFFF00" dot isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        TWO COLUMNS OFF THE SAME ROWS, MOVING IN OPPOSITE DIRECTIONS. On
        {' '}{data.head.name}, a TEACHING well this course invented and not a published one, the
        producing-day oil rate takes {fmt(data.head.distinctProducingDayValues, 0)} distinct value
        across all {fmt(data.uptime.length, 0)} recent days while the calendar volume swings from
        {' '}{fmt(data.head.lowestCalendarVolume, 6)} to {fmt(data.head.highestCalendarVolume, 6)}
        {' '}stb, a factor of {fmt(data.head.calendarSwingFactor, 6)}, because only the hours move.
        Over the recent window the calendar mean is {fmt(data.head.recentCalendarMean, 9)} stb
        against a baseline of {fmt(data.head.baselineCalendarMean, 9)} stb, a drop of
        {' '}{fmt(data.head.dropPctOnCalendar, 9)} per cent against a trigger of
        {' '}{fmt(data.head.rateDropTrigger, 0)} per cent. Read the other column and the same well
        is at {fmt(data.head.recentProducingDayMean, 9)} stb/d against
        {' '}{fmt(data.head.baselineProducingDayMean, 9)} stb/d, a drop of
        {' '}{fmt(data.head.dropPctOnProducingDay, 9)} per cent, which is a RISE. The mean recent
        hours are {fmt(data.head.recentHoursMean, 9)} h against a downtime threshold of
        {' '}{fmt(data.head.downtimeThresholdHours, 0)} h, so the one exception that would have
        named the cause fires: {yn(data.head.theDowntimeExceptionFires)}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">teaching row</th>
              <th className="text-left pr-3">hours on, h</th>
              <th className="text-left pr-3">calendar oil, stb</th>
              <th className="text-left pr-3">producing-day oil, stb/d</th>
              <th className="text-left pr-3">watercut, fraction</th>
              <th className="text-left">gas-oil ratio, scf/stb</th>
            </tr>
          </thead>
          <tbody>
            {data.uptime.map((r) => (
              <tr key={r.date}>
                <td className="pr-3">{r.date}</td>
                <td className="pr-3">{fmt(r.hoursOn, 4)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.calendarOilStb, 9)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.producingDayOilStbd, 9)}</td>
                <td className="pr-3">{fmt(r.watercutFraction, 12)}</td>
                <td>{fmt(r.gorScfStb, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        AND THE SAME FUNCTION ON THE FIVE PUBLISHED ROWS, which is where the members come from.
        Nine of the fourteen keys are copied through unchanged and
        {' '}{fmt(data.members.filter((m) => m.kind === 'computed').length, 0)} are computed, of
        which {fmt(data.members.filter((m) => m.canRefuse).length, 0)} can refuse and come back
        null. A producing-day rate is null when the hours are zero, which is the single most
        important refusal in the module: an infinity there would propagate into every mean
        downstream and turn a shut-in day into a fabricated record rate.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">published row</th>
              <th className="text-left pr-3">oil, stb</th>
              <th className="text-left pr-3">hours in</th>
              <th className="text-left pr-3">hours out</th>
              <th className="text-left pr-3">liquid, stb</th>
              <th className="text-left pr-3">watercut</th>
              <th className="text-left pr-3">gas-oil ratio</th>
              <th className="text-left pr-3">oil producing-day</th>
              <th className="text-left">matches the golden</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.index}>
                <td className="pr-3">{r.date}</td>
                <td className="pr-3">{fmt(r.oilStb, 6)}</td>
                <td className="pr-3">{r.hoursOnIn === null ? 'null' : fmt(r.hoursOnIn, 4)}</td>
                <td className="pr-3">{r.hoursOnOut === null ? 'null' : fmt(r.hoursOnOut, 4)}</td>
                <td className="pr-3">{fmt(r.liquid, 9)}</td>
                <td className="pr-3">{r.watercut === null ? 'null' : fmt(r.watercut, 12)}</td>
                <td className="pr-3">{r.gor === null ? 'null' : fmt(r.gor, 9)}</td>
                <td className="pr-3 text-[#BFFF00]">{r.oilPd === null ? 'null' : fmt(r.oilPd, 9)}</td>
                <td>{yn(r.engineReproducesThePublishedPoint)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        THE HOURS COLUMN IS THE WHOLE OF THE DIFFERENCE, and nothing clamps it. Sweep one
        constructed row of {fmt(data.sweep[0].calendarOilStb, 0)} stb of oil and the uplift over
        the calendar volume runs from {fmt(data.sweep[0].upliftOverTheCalendarVolume, 6)} at a full
        day to {fmt(data.sweep[data.sweep.length - 1].upliftOverTheCalendarVolume, 6)} at half an
        hour. Hand it a value above twenty-four and the rate is scaled DOWNWARDS below the calendar
        volume, which is a thing a producing-day rate cannot be, and it is not refused:
        {' '}{fmt(data.outOfRange.filter((r) => r.theRateIsBelowTheCalendarVolume).length, 0)} of
        the {fmt(data.outOfRange.length, 0)} out-of-range values come back as a number. A negative
        value nulls the rate and is returned as itself in the hours member, so the downtime check
        can average a negative number of hours.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">hours handed in</th>
              <th className="text-left pr-3">hours returned</th>
              <th className="text-left pr-3">producing-day oil, stb/d</th>
              <th className="text-left pr-3">ratio to the calendar volume</th>
              <th className="text-left">refused</th>
            </tr>
          </thead>
          <tbody>
            {data.outOfRange.map((r) => (
              <tr key={r.hoursOn}>
                <td className="pr-3">{fmt(r.hoursOn, 4)}</td>
                <td className="pr-3">{fmt(r.hoursOn, 4)}</td>
                <td className="pr-3">{r.oilPd === null ? 'null' : fmt(r.oilPd, 9)}</td>
                <td className="pr-3">{r.ratioToTheCalendarVolume === null ? 'not applicable' : fmt(r.ratioToTheCalendarVolume, 9)}</td>
                <td className={r.refused ? 'text-[#f97316]' : ''}>{yn(r.refused)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the hours column spelled</th>
              <th className="text-left pr-3">uptime is unknown</th>
              <th className="text-left pr-3">producing-day oil, stb/d</th>
              <th className="text-left">it fell back to the calendar volume</th>
            </tr>
          </thead>
          <tbody>
            {data.spellings.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{yn(r.uptimeIsUnknown)}</td>
                <td className="pr-3">{fmt(r.oilPd, 9)}</td>
                <td>{yn(r.theRateFellBackToTheCalendarVolume)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        {data.head.name} is a TEACHING case built by this course, not a real well and not a
        published one. The five rows in the second table above ARE published, committed in the
        surveillance golden by an oracle that does every date arithmetic on the calendar where the
        module counts epoch-millisecond day numbers. Read the provenance before quoting either. And
        note what this function never does: nothing in a ledger row says how long the row covers,
        so a month of production read by it is a calendar day with a daily rate printed after it.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Ratios = () => {
  const data = useMemo(() => {
    try {
      return {
        rows: ledgerExplorer.ratios(),
        members: ledgerExplorer.members(),
        published: ledgerExplorer.publishedRows(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.rows.length) {
    return (
      <Note>
        These rows are constructed by the teaching lab and handed to the vendored engine. With the
        engine package absent there is no point to derive and no refusal to show.
      </Note>
    );
  }
  const chart = data.rows.map((r, i) => ({
    row: `row ${i + 1}`,
    watercut: r.watercutFraction === null ? 0 : r.watercutFraction,
    gor: r.gorScfStb === null ? 0 : r.gorScfStb / 1000,
  }));
  const refusedWatercut = data.rows.filter((r) => r.watercutRefused).length;
  const refusedGor = data.rows.filter((r) => r.gorRefused).length;
  return (
    <>
      <TileGrid>
        <Tile label="Constructed rows swept" value={fmt(data.rows.length, 0)} />
        <Tile label="Rows with no watercut" value={fmt(refusedWatercut, 0)} />
        <Tile label="Rows with no gas-oil ratio" value={fmt(refusedGor, 0)} />
        <Tile label="Correction rows, which are not refused at all" value={fmt(data.rows.filter((r) => r.isACorrectionRow).length, 0)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="row" tick={AXIS} interval={0} height={40} />
            <YAxis tick={AXIS}
              label={{ value: 'watercut fraction, and gas-oil ratio in Mscf/stb', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="watercut" name="watercut, a fraction" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="gor" name="gas-oil ratio, Mscf/stb" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A WATERCUT IS A FRACTION OF LIQUID AND A GAS-OIL RATIO IS PER BARREL OF OIL, so the two
        refuse on DIFFERENT conditions and a bar of zero above is a REFUSAL and not a measurement.
        A row with no liquid has no watercut. A row with no OIL has no gas-oil ratio however much
        gas it made. The thousand in the ratio is scf per Mscf and it is the only unit conversion
        in the file. Read the last two rows in the table: a negative volume is how a ledger books a
        back-out, and it is not refused at all, it is arithmetic. A negative oil volume gives a
        negative liquid and a null watercut because the liquid is not above zero; a negative WATER
        volume against positive oil gives a negative liquid, a null watercut, and a perfectly
        ordinary gas-oil ratio, because the ratio never looks at the water at all.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">oil, stb</th>
              <th className="text-left pr-3">water, stb</th>
              <th className="text-left pr-3">gas, Mscf</th>
              <th className="text-left pr-3">liquid, stb</th>
              <th className="text-left pr-3">watercut, fraction</th>
              <th className="text-left pr-3">gas-oil ratio, scf/stb</th>
              <th className="text-left">what it refused, and why</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, i) => (
              <tr key={`${r.oilStb}-${r.waterStb}-${r.gasMscf}-${i}`}>
                <td className="pr-3">{fmt(r.oilStb, 4)}</td>
                <td className="pr-3">{fmt(r.waterStb, 4)}</td>
                <td className="pr-3">{fmt(r.gasMscf, 4)}</td>
                <td className={r.liquidStb < 0 ? 'pr-3 text-[#f97316]' : 'pr-3'}>{fmt(r.liquidStb, 6)}</td>
                <td className="pr-3">{r.watercutFraction === null ? 'null' : fmt(r.watercutFraction, 12)}</td>
                <td className="pr-3">{r.gorScfStb === null ? 'null' : fmt(r.gorScfStb, 9)}</td>
                <td>{r.whyItRefused}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        THE FOURTEEN KEYS, AND WHICH FIVE CAN REFUSE. Naming which of them is copied and which is
        computed is most of what this tier is for, because a copied key is the ledger's claim and a
        computed one is the engine's.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">key</th>
              <th className="text-left pr-3">copied or computed</th>
              <th className="text-left pr-3">can refuse</th>
              <th className="text-left">what it is</th>
            </tr>
          </thead>
          <tbody>
            {data.members.map((m) => (
              <tr key={m.key}>
                <td className="pr-3">{m.key}</td>
                <td className={m.kind === 'computed' ? 'pr-3 text-[#BFFF00]' : 'pr-3'}>{m.kind}</td>
                <td className="pr-3">{yn(m.canRefuse)}</td>
                <td>{m.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Every row in the first table is a DERIVED demonstration this lab constructed and handed to
        the shipped engine, not a published case. The five published rows live in the ledger view
        and they are the ones an oracle checked. A refusal here is a null and not a zero, and the
        difference matters downstream: a null is dropped from a window mean and a zero is averaged
        into it.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Field = () => {
  const data = useMemo(() => {
    try {
      return {
        days: ledgerExplorer.fieldDays(),
        head: ledgerExplorer.fieldHeadline(),
        onCount: ledgerExplorer.onCount(),
        orphan: ledgerExplorer.orphan(),
        strings: ledgerExplorer.stringAccumulator(),
        stringRow: ledgerExplorer.stringRow(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.days.length) {
    return (
      <Note>
        The published field series is shipped inside the engine package. With that package absent
        there are no field days to add up and nothing to draw.
      </Note>
    );
  }
  const chart = data.strings.map((r) => ({
    rows: `${r.rows} row${r.rows === 1 ? '' : 's'}`,
    asNumbers: r.fieldOilAsNumbers,
    asStrings: r.fieldOilAsStrings,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Published field days reproduced" value={fmt(data.head.publishedDays, 0)} />
        <Tile label="Four identical rows added as numbers" value={fmt(data.strings[3].fieldOilAsNumbers, 0)} unit="stb" />
        <Tile label="The same four rows as text" value={fmt(data.strings[3].fieldOilAsStrings, 0)} unit="stb" />
        <Tile label="Overstatement factor" value={fmt(data.strings[3].overstatementFactor, 4)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="rows" tick={AXIS} interval={0} height={40} />
            <YAxis tick={AXIS} scale="log" domain={[100, 'dataMax']}
              label={{ value: 'field oil on one date, stb', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 0)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="asNumbers" name="the volumes as numbers" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="asStrings" name="the SAME volumes as text" fill="#f97316" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE FIELD ROLL-UP ADDS, AND ADDITION IS THE ONE OPERATION A TEXT COLUMN BREAKS. The
        accumulator starts at a numeric zero and the first string turns the accumulator itself into
        a string, so every later row is CONCATENATED onto it rather than added. One row of text is
        already wrong; by the fourth the field oil total reads
        {' '}{fmt(data.strings[3].fieldOilAsStrings, 0)} stb against
        {' '}{fmt(data.strings[3].fieldOilAsNumbers, 0)} stb, a factor of
        {' '}{fmt(data.strings[3].overstatementFactor, 4)}, which is not a number a reader can
        mistake for a rounding. On a single row the same coercion understates the watercut by a
        factor of {fmt(data.stringRow.theWatercutIsUnderstatedByAFactorOf, 9)} and overstates the
        liquid producing-day rate by the same
        {' '}{fmt(data.stringRow.theLiquidRateIsOverstatedByAFactorOf, 9)}, while the gas-oil ratio
        comes back exactly right ({yn(data.stringRow.theGorIsExactlyRight)}) and so does the oil
        producing-day rate ({yn(data.stringRow.theOilProducingDayRateIsExactlyRight)}), because
        both are formed by multiplication and division only. Nothing anywhere reports that a column
        arrived as text.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">identical rows of 800 stb on one date</th>
              <th className="text-left pr-3">as numbers, stb</th>
              <th className="text-left pr-3">as text, stb</th>
              <th className="text-left pr-3">overstatement factor</th>
              <th className="text-left">it concatenated</th>
            </tr>
          </thead>
          <tbody>
            {data.strings.map((r) => (
              <tr key={r.rows}>
                <td className="pr-3">{fmt(r.rows, 0)}</td>
                <td className="pr-3">{fmt(r.fieldOilAsNumbers, 0)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.fieldOilAsStrings, 0)}</td>
                <td className="pr-3">{fmt(r.overstatementFactor, 4)}</td>
                <td>{yn(r.theAccumulatorConcatenated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        AND THE PUBLISHED FIELD, WHERE THE RATIOS ARE FORMED VOLUMETRICALLY, sum of water over sum
        of liquid, which is what a period ratio means. The engine reproduces every one of the
        {' '}{fmt(data.head.publishedDays, 0)} published days: {yn(data.head.everyPublishedDayReproduced)}.
        The count of wells on stream is a three-phase sum and it adds Mscf to stb: the test a row
        has to pass is {data.head.theOnCountTest}. Two units are added together to make one boolean,
        which is harmless as a boolean and is worth naming because it is the only place in the
        domain where a barrel and a thousand cubic feet are summed.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">published field day</th>
              <th className="text-left pr-3">oil, stb</th>
              <th className="text-left pr-3">water, stb</th>
              <th className="text-left pr-3">gas, Mscf</th>
              <th className="text-left pr-3">injection, stb</th>
              <th className="text-left pr-3">wells on</th>
              <th className="text-left pr-3">watercut, fraction</th>
              <th className="text-left">gas-oil ratio, scf/stb</th>
            </tr>
          </thead>
          <tbody>
            {data.days.map((d) => (
              <tr key={d.date}>
                <td className="pr-3">{d.date}</td>
                <td className="pr-3">{fmt(d.oil, 4)}</td>
                <td className="pr-3">{fmt(d.water, 4)}</td>
                <td className="pr-3">{fmt(d.gas, 4)}</td>
                <td className="pr-3">{fmt(d.winj, 4)}</td>
                <td className="pr-3">{fmt(d.wellsOn, 0)}</td>
                <td className="pr-3">{d.watercutFraction === null ? 'null' : fmt(d.watercutFraction, 12)}</td>
                <td>{d.gorScfStb === null ? 'null' : fmt(d.gorScfStb, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">what filed the row</th>
              <th className="text-left pr-3">counts as producing</th>
              <th className="text-left pr-3">field oil, stb</th>
              <th className="text-left">field injection, stb</th>
            </tr>
          </thead>
          <tbody>
            {data.onCount.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{yn(r.countsAsProducing)}</td>
                <td className="pr-3">{fmt(r.fieldOil, 4)}</td>
                <td>{fmt(r.fieldWinj, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        THE FIELD ROLL-UP FILTERS ON NOTHING and the well roll-up filters on one thing. The field
        function has no idea what a well type is, so an injector row and an observation row both
        land in the field totals; the well function keys on the well identifier and silently DROPS
        every row that carries no well. Hand both of them {fmt(data.orphan.rowsHandedIn, 0)} rows of
        which one carries no well and the field reports {fmt(data.orphan.fieldOil, 4)} stb of oil
        while the wells between them carry {fmt(data.orphan.oilOnTheWellSeries, 4)} stb, a
        difference of {fmt(data.orphan.theDifference, 4)} stb that nothing in either return
        mentions.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Kpis = () => {
  const [windowDays, setWindowDays] = useState('7');
  const data = useMemo(() => {
    try {
      return {
        published: ledgerExplorer.publishedKpis(),
        sweep: ledgerExplorer.kpiWindowSweep(),
        membership: ledgerExplorer.kpiMembership(),
        nullGuard: ledgerExplorer.kpiNullGuard(),
        empty: ledgerExplorer.kpiEmpty(),
        teaching: ledgerExplorer.teachingKpis(),
        uptime: ledgerExplorer.uptimeMembership(),
        uptimeHead: ledgerExplorer.uptimeMembershipHeadline(),
        summary: ledgerExplorer.fieldSummary(),
        wells: ledgerExplorer.teachingWells(),
        purposes: ledgerExplorer.purposes(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.teaching.length) {
    return (
      <Note>
        The field roll-up returns null outright on an empty field series rather than an object of
        nulls, which is the one refusal in that function. With no field series in front of it there
        are no KPIs to show.
      </Note>
    );
  }
  const chosen = data.teaching.find((r) => String(r.windowDays) === windowDays) || data.teaching[0];
  const chart = data.sweep.map((r) => ({
    asked: r.windowDaysAsked,
    averaged: r.fieldDaysActuallyAveraged,
    oil: r.oil,
  }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Teaching window, days" value={windowDays} onChange={setWindowDays}
          options={data.teaching.map((r) => [String(r.windowDays), `${r.windowDays} days`])} />
      </FieldGrid>
      <TileGrid>
        <Tile label="Mean oil over the window" value={fmt(chosen.oil, 6)} unit="stb/d" />
        <Tile label="Watercut, volumetric" value={fmt(chosen.watercutFraction, 9)} unit="fraction" />
        <Tile label="Gas-oil ratio, volumetric" value={fmt(chosen.gorScfStb, 6)} unit="scf/stb" />
        <Tile label="Uptime" value={fmt(chosen.uptimePct, 6)} unit="%" />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="asked" tick={AXIS} type="number" scale="log" domain={['dataMin', 'dataMax']}
              label={{ value: 'window asked for, days', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'field days actually averaged', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="asked" name="days the object reports" stroke="#38bdf8" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="averaged" name="days it actually averaged" stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE ONLY SURVEILLANCE FUNCTION WITH NO BASELINE AND NO COMPARISON IN IT AT ALL, which is
        why it belongs to this tier. It forms mean daily rates over a trailing DATE window and then
        takes the watercut and the gas-oil ratio OF THOSE MEANS, which is volume weighted by
        construction. Four things it does not say. It does not say how many days it actually
        averaged: the window comes back unchanged, and over the published sweep the two agree on
        {' '}{fmt(data.sweep.filter((r) => !r.itAveragedFewerDaysThanItReports).length, 0)} of
        {' '}{fmt(data.sweep.length, 0)} settings and differ on the rest. It does not say which
        wells the uptime came from. It does not say what the well count counts: it is every series
        handed in, {fmt(data.membership.seriesHandedIn, 0)} of them, of which
        {' '}{fmt(data.membership.typedInjector, 0)} typed injector and
        {' '}{fmt(data.membership.typedObservation, 0)} typed observation, and the producer count
        excludes only injectors, so an observation well is counted as a producer by that name:
        {' '}{yn(data.membership.anObservationWellIsCountedAsAProducer)}. And it does not say
        whether any of its numbers is null.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">window asked, days</th>
              <th className="text-left pr-3">days averaged</th>
              <th className="text-left pr-3">oil, stb/d</th>
              <th className="text-left pr-3">watercut, fraction</th>
              <th className="text-left pr-3">gas-oil ratio, scf/stb</th>
              <th className="text-left">uptime, %</th>
            </tr>
          </thead>
          <tbody>
            {data.sweep.map((r) => (
              <tr key={r.windowDaysAsked}>
                <td className="pr-3">{fmt(r.windowDaysAsked, 0)}</td>
                <td className={r.itAveragedFewerDaysThanItReports ? 'pr-3 text-[#f97316]' : 'pr-3'}>{fmt(r.fieldDaysActuallyAveraged, 0)}</td>
                <td className="pr-3">{fmt(r.oil, 9)}</td>
                <td className="pr-3">{fmt(r.watercutFraction, 12)}</td>
                <td className="pr-3">{fmt(r.gorScfStb, 9)}</td>
                <td>{r.uptimePct === null ? 'null' : fmt(r.uptimePct, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        THE GUARD IS ON ONE LINE AND NOT ON THE NEXT. The liquid is guarded with an explicit null
        check on both means; the watercut on the very next line reads the same two means with a
        bare test that they sum above zero. On a field day whose oil mean comes back null and whose
        water mean does not, the object therefore reports NO liquid and a watercut of exactly
        {' '}{fmt(data.nullGuard[0].watercutFraction, 6)}. On an empty field series the function
        refuses outright and returns null: {yn(data.empty.returnedNull)}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">what was handed in</th>
              <th className="text-left pr-3">liquid</th>
              <th className="text-left pr-3">watercut</th>
              <th className="text-left pr-3">gas-oil ratio</th>
              <th className="text-left">uptime</th>
            </tr>
          </thead>
          <tbody>
            {data.nullGuard.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className={r.liquidRefused ? 'pr-3 text-[#f97316]' : 'pr-3'}>{r.liquid === null ? 'null' : fmt(r.liquid, 6)}</td>
                <td className="pr-3">{r.watercutFraction === null ? 'null' : fmt(r.watercutFraction, 12)}</td>
                <td className="pr-3">{r.gorScfStb === null ? 'null' : fmt(r.gorScfStb, 6)}</td>
                <td>{r.uptimePct === null ? 'null' : fmt(r.uptimePct, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        WHO IS IN THE UPTIME. The roll-up skips INJECTORS and reads everything else, so an
        observation well recording a perfect twenty-four hours a day is averaged in with the real
        ones, and a producer that never records hours is not in it at all. Of the
        {' '}{fmt(data.uptimeHead.seriesReadForUptime, 0)} series read for uptime on the teaching
        field, {fmt(data.uptimeHead.ofWhichAtLeastOneRowCarriesAnHoursOn, 0)} carry an hours
        column, so the uptime is the mean of the wells that happened to fill it in.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">window, days</th>
              <th className="text-left pr-3">uptime with the observation well, %</th>
              <th className="text-left pr-3">with it dropped, %</th>
              <th className="text-left pr-3">difference, points</th>
              <th className="text-left">well count, with and without</th>
            </tr>
          </thead>
          <tbody>
            {data.uptime.map((r) => (
              <tr key={r.windowDays}>
                <td className="pr-3">{fmt(r.windowDays, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.uptimePctWithTheObservationWell, 9)}</td>
                <td className="pr-3">{fmt(r.uptimePctWithItDropped, 9)}</td>
                <td className="pr-3">{fmt(r.differenceInPoints, 9)}</td>
                <td>{fmt(r.wellCountWithIt, 0)} against {fmt(r.wellCountWithout, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        THE PUBLISHED FIELD, FOR COMPARISON, at both windows the golden commits.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">window, days</th>
              <th className="text-left pr-3">oil, stb/d</th>
              <th className="text-left pr-3">water, stb/d</th>
              <th className="text-left pr-3">watercut</th>
              <th className="text-left pr-3">gas-oil ratio</th>
              <th className="text-left pr-3">uptime, %</th>
              <th className="text-left">matches the golden</th>
            </tr>
          </thead>
          <tbody>
            {data.published.map((r) => (
              <tr key={r.windowDays}>
                <td className="pr-3">{fmt(r.windowDays, 0)}</td>
                <td className="pr-3">{fmt(r.oil, 9)}</td>
                <td className="pr-3">{fmt(r.water, 9)}</td>
                <td className="pr-3">{fmt(r.watercutFraction, 12)}</td>
                <td className="pr-3">{fmt(r.gorScfStb, 9)}</td>
                <td className="pr-3">{fmt(r.uptimePct, 9)}</td>
                <td>{yn(r.engineReproducesThePublishedKpi)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">teaching well</th>
              <th className="text-left pr-3">type</th>
              <th className="text-left pr-3">points</th>
              <th className="text-left pr-3">cadence, days</th>
              <th className="text-left pr-3">total oil, stb</th>
              <th className="text-left pr-3">rows with an hours column</th>
              <th className="text-left">what it is for</th>
            </tr>
          </thead>
          <tbody>
            {data.wells.map((w) => (
              <tr key={w.name}>
                <td className="pr-3">{w.name}</td>
                <td className="pr-3">{w.wellType}</td>
                <td className="pr-3">{fmt(w.points, 0)}</td>
                <td className="pr-3">{w.cadenceDays === null ? 'null' : fmt(w.cadenceDays, 4)}</td>
                <td className="pr-3">{fmt(w.totalOil, 4)}</td>
                <td className="pr-3">{fmt(w.rowsCarryingAnHoursOn, 0)}</td>
                <td>{(data.purposes.find((p) => p.name === w.name) || {}).purpose || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The teaching field is {data.summary.field}, {fmt(data.summary.wells, 0)} wells and
        {' '}{fmt(data.summary.ledgerRows, 0)} ledger rows running {data.summary.firstDate} to
        {' '}{data.summary.lastDate}, invented by this course so that every result has a case a
        lesson may quote. It is not a real field, none of its wells is a real well, and not one of
        its rows is a published case: {yn(data.summary.itIsInventedByThisWaveAndIsNotAPublishedCase)}.
        The published rows in the last table but one ARE published. Never show one as the other.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const LedgerExplorer = ({ initialMode = 'ledger' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Ledger explorer"
      subtitle="The row and the roll-up, before any baseline is involved: a daily ledger and the producing-day rate it implies, the two ratios one row carries and where each refuses, rows added into a field, and the field roll-up that has no comparison in it at all"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'ledger' && <Ledger />}
        {mode === 'ratios' && <Ratios />}
        {mode === 'field' && <Field />}
        {mode === 'kpis' && <Kpis />}
      </div>
    </PanelShell>
  );
};

export default LedgerExplorer;
