import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, ComposedChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ReferenceDot, ReferenceArea, Legend,
} from 'recharts';
import {
  akodoTablesAt, partialTable, dipAt, dipSweepAt, partialDipsAt, aboveLastAt, curveAt, waterAt, waterSweepAt, morningAt,
  vcfAt, vcfCurveAt, vcfRefusalsAt, SYNTHETIC_COEFFICIENTS, AKODO_DAY, dayAt, openingFromClosingDerived,
  cannotFailAt, toleranceSweepAt, trendAt, fmt, plain,
} from './supplyLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, txt, usable, Tbl, Refusal, EngineNote, Note, Lead, Labelled, Empty, safe, NumBox,
  Slider, Button,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Tank explorer, the Associate tier throughout.
//
// EVERYTHING STARTS FROM A DIP. The AKODO terminal's three tanks, their
// strapping tables, a dip and a water cut per tank, a VCF typed off the
// terminal's own tables, and the day closed on the result. Every volume, VCF,
// reconciliation and trend figure here is a return value of the vendored
// terminalDepot module through the teaching lab.
//
// THE OPENING STOCK IS TYPED. It is yesterday's closing dip, a record. The one
// button that takes it from today's closing dip is labelled as SECTION 7's
// demonstration, and the day it closes reads unaccounted zero whatever the dip.
//
// THE COEFFICIENTS ARE SYNTHETIC. The engine ships none, and the one row the
// course uses to show the ASTM D1250 form sits in its own box, labelled.

export const MODES = [
  ['table', 'The strapping table: a dip, the entries either side and where a table stops'],
  ['water', 'Free water: the water cut read through the same table'],
  ['vcf', 'The volume correction factor: typed per tank, and the SYNTHETIC form'],
  ['day', 'Closing the day, the tolerance band and the nine-day trend'],
];

const TANK_OPTIONS = () => (safe(akodoTablesAt) || []).map((t) => [t.id, `${t.id}, ${t.product}, ${t.shape}`]);

// ---------------------------------------------------------------------------

export const TableMode = ({ tables, reading, sweep, partialRows, above, curve, tank, onTank, dip, onDip, partial, onPartial }) => {
  if (!Array.isArray(tables) || !tables.length) return <Empty>The strapping table reader has returned nothing, so there is no table to draw.</Empty>;
  const t = tables.find((x) => x.id === tank) || tables[0];
  const r = usable(reading) ? reading : null;
  const drawn = partial && t.id === 'AK-01' ? safe(partialTable) : t.table;
  return (
    <>
      <FieldGrid>
        <SelectField label="Tank" value={t.id} onChange={onTank} options={TANK_OPTIONS()} />
        <NumBox label="Dip, mm (type any reading, a blank one too)" value={dip} onChange={onDip} />
      </FieldGrid>
      <Slider label="Dip, mm" value={dip} min={0} max={t.last.heightMm + 250} step={1} onChange={onDip} />
      {t.id === 'AK-01' && (
        <div className="mt-2 flex gap-2 items-center">
          <Button active={!partial} onClick={() => onPartial(false)}>The whole table, from the empty tank</Button>
          <Button active={partial} onClick={() => onPartial(true)}>A partial calibration that starts above the floor</Button>
        </div>
      )}
      <p className="text-xs text-slate-400 mt-2 mb-0">
        {t.id}: {t.product}, {t.shape}, {t.size}. {t.entries} entries every {t.stepMm} mm, from {t.first.heightMm} mm
        {' '}= {fmt.m3(t.first.volumeM3)} m3 to {t.last.heightMm} mm = {fmt.m3(t.last.volumeM3)} m3.
      </p>
      {r && (
        <TileGrid>
          <Tile label="Entry below" value={r.below ? `${r.below.heightMm} mm = ${fmt.m3(r.below.volumeM3)} m3` : 'none'} />
          <Tile label="Entry above" value={r.above ? `${r.above.heightMm} mm = ${fmt.m3(r.above.volumeM3)} m3` : 'none'} />
          <Tile label="volumeAtDip, m3" value={fmt.m3(r.volumeM3)} />
          <Tile label="The table runs" value={`${r.firstMm} mm to ${r.lastMm} mm`} />
        </TileGrid>
      )}
      {r && r.refusal && <Refusal message={r.refusal} />}
      {drawn && (
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={drawn} margin={{ top: 8, right: 16, bottom: 18, left: 8 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="heightMm" type="number" tick={AXIS} label={{ value: 'height, mm', position: 'insideBottom', offset: -8, fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={AXIS} label={{ value: 'volume, m3', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP} />
              <Line type="linear" dataKey="volumeM3" name="strapping entry" stroke={SERIES[0]} dot={{ r: 2 }} isAnimationActive={false} />
              {r && Number.isFinite(Number(dip)) && dip !== '' && <ReferenceLine x={Number(dip)} stroke={SERIES[3]} strokeDasharray="4 4" />}
              {r && r.volumeM3 !== null && <ReferenceDot x={Number(dip)} y={r.volumeM3} r={5} fill={SERIES[2]} stroke="none" />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <Note>
        volumeAtDip draws a straight line between the two entries either side of the dip. Below the first entry it answers
        only when that entry is the empty tank; above the last entry it refuses.
      </Note>

      <Lead>AK-01&apos;s dip swept up its table, as the engine answers each reading:</Lead>
      <Tbl
        head={['dip mm', 'the engine answers']}
        rows={(Array.isArray(sweep) ? sweep : []).map((x) => [plain(x.dipMm), x.refusal ? `REFUSED: ${x.refusal}` : `${fmt.m3(x.volumeM3)} m3`])}
      />
      <Lead>The partial calibration (a table from 300 mm to 800 mm) through dipToStandardVolume:</Lead>
      <Tbl
        head={['dip mm', 'water mm', 'the engine answers']}
        rows={(Array.isArray(partialRows) ? partialRows : []).map((x) => [x.dipMm, x.waterMm, x.refusal ? `REFUSED: ${x.refusal}` : `gross ${fmt.m3(x.grossM3)} m3`])}
      />
      <Lead>The other two tanks dipped just above their own last entries:</Lead>
      <Tbl
        head={['tank', 'last entry mm', 'dip mm', 'the engine answers']}
        rows={(Array.isArray(above) ? above : []).map((x) => [x.tank, x.lastMm, x.dipMm, `REFUSED: ${txt(x.refusal)}`])}
      />
      {usable(curve) && Array.isArray(curve.rows) && (
        <>
          <Lead>
            AK-03 is a bullet, so its volume is a curve in height and a straight line between entries misses it. Its own
            {' '}{curve.stepMm} mm table against the same tank strapped every 10 mm ({curve.fineEntries} entries):
          </Lead>
          <Tbl
            head={['height mm', 'the 100 mm table, m3', 'the 10 mm table, m3', 'the difference, m3']}
            rows={curve.rows.map((x) => [x.heightMm, fmt.m3(x.coarseM3), fmt.m3(x.fineM3), fmt.m3(x.coarseLessFineDerivedM3)])}
          />
          <Note>
            AK-01 is a vertical cylinder, linear in height, so its {curve.ak01.stepMm} mm table and a 10 mm table agree at
            its dip: {fmt.m3(curve.ak01.coarseM3)} m3 and {fmt.m3(curve.ak01.fineM3)} m3.
          </Note>
        </>
      )}
    </>
  );
};

export const WaterMode = ({ water, sweep, tables, tank, onTank, dip, onDip, cut, onCut }) => {
  if (!Array.isArray(tables) || !tables.length) return <Empty>The strapping table reader has returned nothing, so there is no tank to read.</Empty>;
  const t = tables.find((x) => x.id === tank) || tables[0];
  const w = usable(water) ? water : null;
  return (
    <>
      <FieldGrid>
        <SelectField label="Tank" value={t.id} onChange={onTank} options={TANK_OPTIONS()} />
        <NumBox label="Product dip, mm" value={dip} onChange={onDip} />
        <NumBox label="Water cut, mm" value={cut} onChange={onCut} />
      </FieldGrid>
      <Slider label="Water cut, mm" value={cut} min={0} max={Math.max(100, Math.round(Number(dip) || 0) + 100)} step={1} onChange={onCut} />
      {w && !w.refusal && (
        <>
          <TileGrid>
            <Tile label="Volume at the dip, m3" value={fmt.m3(w.volumeAtDipM3)} />
            <Tile label="Water, read through the same table, m3" value={fmt.m3(w.waterM3)} />
            <Tile label="Gross observed volume, m3" value={fmt.m3(w.grossM3)} />
          </TileGrid>
          <Labelled tag="the reading the engine does not use">
            <p className="text-xs text-slate-300 mb-0">
              The volume at the dip less the water HEIGHT, {txt(w.heightLessWaterDerivedMm)} mm, read off the table
              once: {fmt.m3(w.byHeightNotUsedM3)} m3, against the engine&apos;s gross of {fmt.m3(w.grossM3)} m3.
              {t.shape === 'horizontal'
                ? ' On this bullet the two part, because the water fills the narrow bottom of a curved tank.'
                : ' On a vertical tank the two agree to about a litre, because its table is linear in height.'}
            </p>
          </Labelled>
          <div className="mt-3 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'volume at the dip', m3: w.volumeAtDipM3 },
                  { name: 'gross, the engine', m3: w.grossM3 },
                  { name: 'dip less water height, unused by the engine', m3: w.byHeightNotUsedM3 },
                ]}
                margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={AXIS} />
                <YAxis tick={AXIS} />
                <Tooltip contentStyle={TOOLTIP} />
                <Bar dataKey="m3" fill={SERIES[0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      {w && w.refusal && <Refusal message={w.refusal} />}
      <Lead>AK-02 at its dip, the water cut swept:</Lead>
      <Tbl
        head={['water mm', 'the engine answers']}
        rows={(Array.isArray(sweep) ? sweep : []).map((x) => [x.waterMm, x.refusal ? `REFUSED: ${x.refusal}` : `water ${fmt.m3(x.waterM3)} m3, gross ${fmt.m3(x.grossM3)} m3`])}
      />
    </>
  );
};

export const VcfMode = ({ morning, vcfs, onVcf, synth, curve, refusals, rho, onRho, temp, onTemp }) => {
  if (!usable(morning) || !Array.isArray(morning.rows)) return <Empty>The morning reader has returned nothing, so there is no stock to correct.</Empty>;
  const s = usable(synth) ? synth : null;
  return (
    <>
      <Lead>
        AKODO corrects its stock with a VCF read off its own tables for each tank&apos;s density and temperature, typed in.
        The typed figures are invented for the course. Standard volume = gross observed volume x VCF.
      </Lead>
      <FieldGrid>
        {morning.rows.map((r) => (
          <NumBox key={r.tank} label={`${r.tank} VCF, ${r.densityKgM3} kg/m3 at ${r.temperatureC} C`} tag="invented" value={vcfs[r.tank]} onChange={(v) => onVcf(r.tank, v)} />
        ))}
      </FieldGrid>
      <Tbl
        head={['tank', 'gross observed m3', 'VCF typed', 'standard m3', 'the engine notes']}
        rows={morning.rows.map((r) => [r.tank, fmt.m3(r.grossM3), fmt.vcf(r.vcf), fmt.m3(r.standardM3), txt(r.note)])}
      />
      <TileGrid>
        <Tile label="Closing stock at standard, the three tanks summed, m3" value={fmt.m3(morning.closingStandardM3)} />
        <Tile label="Closing stock gross, m3" value={fmt.m3(morning.closingGrossM3)} />
      </TileGrid>
      {(Array.isArray(refusals) ? refusals : []).slice(0, 1).map((x) => (
        <Refusal key={x.label} label={`volumeCorrectionFactor with ${x.label}`} message={x.message} />
      ))}
      <Labelled tag="SYNTHETIC coefficients, invented for this course and no commodity group's published row">
        <p className="text-xs text-slate-300 mb-2">
          The ASTM D1250 form: alpha = K0 / rho^2 + K1 / rho + K2, and VCF = exp( -alpha x dT x (1 + 0.8 x alpha x dT) ).
          Here K0 = {SYNTHETIC_COEFFICIENTS.k0}, K1 = {SYNTHETIC_COEFFICIENTS.k1}, K2 = {SYNTHETIC_COEFFICIENTS.k2}. They show
          the form only, and no stock on this page is corrected with them.
        </p>
        <FieldGrid>
          <Slider label="Density at 15 C, kg/m3" value={rho} min={650} max={1000} step={0.1} onChange={onRho} />
          <Slider label="Observed temperature, C" value={temp} min={-10} max={60} step={0.5} onChange={onTemp} />
        </FieldGrid>
        {s && !s.refusal && (
          <TileGrid>
            <Tile label="alpha (synthetic)" value={fmt.alpha(s.alpha)} />
            <Tile label="VCF (synthetic)" value={fmt.vcf(s.vcf)} />
          </TileGrid>
        )}
        {s && s.refusal && <Refusal message={s.refusal} />}
        {Array.isArray(curve) && curve.length > 0 && (
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curve} margin={{ top: 8, right: 16, bottom: 18, left: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="temperatureC" type="number" tick={AXIS} label={{ value: 'temperature, C', position: 'insideBottom', offset: -8, fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={AXIS} domain={['auto', 'auto']} />
                <Tooltip contentStyle={TOOLTIP} />
                <ReferenceLine x={15} stroke={SERIES[3]} strokeDasharray="4 4" />
                <ReferenceLine y={1} stroke={GRID} />
                <Line type="monotone" dataKey="vcf" name="VCF (synthetic)" stroke={SERIES[1]} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <Note>At 15 C the form gives exactly one, and above it less than one: two invariants that need no coefficient.</Note>
      </Labelled>
    </>
  );
};

export const DayMode = ({ day, inputs, onInput, onDemo, onRecord, cannotFail, tolSweep, trend, daysKept, onDaysKept }) => {
  if (!usable(day) || !inputs) return <Empty>The day reader has returned nothing, so there is no day to close.</Empty>;
  const tol = Number.isFinite(day.toleranceM3) ? day.toleranceM3 : null;
  const u = Number.isFinite(day.unaccountedM3) ? day.unaccountedM3 : null;
  const span = Math.max(1, Math.abs(tol || 0), Math.abs(u || 0)) * 1.4;
  const tr = usable(trend) ? trend : null;
  return (
    <>
      <FieldGrid>
        <NumBox label="Opening stock, yesterday's closing dip, m3" value={inputs.openingM3} onChange={(v) => onInput('openingM3', v)} />
        <NumBox label="Receipts, m3" value={inputs.receiptsM3} onChange={(v) => onInput('receiptsM3', v)} />
        <NumBox label="Deliveries, m3" value={inputs.deliveriesM3} onChange={(v) => onInput('deliveriesM3', v)} />
        <NumBox label="Known losses, m3" value={inputs.knownLossM3} onChange={(v) => onInput('knownLossM3', v)} />
        <NumBox label="Tolerance, a stated percent of throughput" value={inputs.tolerancePercentOfThroughput} onChange={(v) => onInput('tolerancePercentOfThroughput', v)} />
      </FieldGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The closing stock comes from the tanks: the three standard volumes at the VCFs typed on the VCF view,
        {' '}{fmt.m3(inputs.closingDippedM3)} m3.
      </p>
      <div className="mt-2 flex gap-2 flex-wrap">
        <Button onClick={onRecord}>Type yesterday&apos;s closing dip back in ({fmt.m3(AKODO_DAY.openingM3)} m3)</Button>
        <Button onClick={onDemo}>SECTION 7&apos;s demonstration: take the opening stock from today&apos;s closing dip</Button>
      </div>
      {day.refusal ? <Refusal message={day.refusal} /> : (
        <TileGrid>
          <Tile label="Expected closing, m3" value={fmt.m3(day.expectedClosingM3)} />
          <Tile label="Dipped closing, m3" value={fmt.m3(day.dippedClosingM3)} />
          <Tile label="Unaccounted, m3" value={fmt.m3(day.unaccountedM3)} />
          <Tile label="Unaccounted, percent of throughput" value={fmt.pct(day.unaccountedPercentOfThroughput)} />
          <Tile label="Tolerance, m3" value={fmt.m3(day.toleranceM3)} />
          <Tile label="Within tolerance" value={txt(day.withinTolerance)} />
          <Tile label="Direction" value={txt(day.direction)} />
          <Tile label="Throughput, receipts plus deliveries, m3" value={fmt.m3(day.throughputDerivedM3)} />
        </TileGrid>
      )}
      {day.note && <EngineNote>{day.note}</EngineNote>}
      {u !== null && tol !== null && (
        <div className="mt-3 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={[{ name: 'unaccounted', m3: u }]} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis type="number" domain={[-span, span]} tick={AXIS} />
              <YAxis type="category" dataKey="name" tick={AXIS} width={80} />
              <ReferenceArea x1={-tol} x2={tol} fill={SERIES[2]} fillOpacity={0.12} />
              <ReferenceLine x={0} stroke={GRID} />
              <Bar dataKey="m3" fill={u < 0 ? SERIES[5] : SERIES[0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <Note>The shaded band is the tolerance, a stated percent of throughput, either side of zero.</Note>

      <Lead>
        A reconciliation that cannot fail: the opening stock taken from the closing dip, at the day&apos;s own dip and three
        others. Every row balances, so none of them measured anything.
      </Lead>
      <Tbl
        head={['closing dip m3', 'opening taken from it m3', 'expected closing m3', 'unaccounted m3', 'direction']}
        rows={(Array.isArray(cannotFail) ? cannotFail : []).map((x) => [fmt.m3(x.closingM3), fmt.m3(x.openingM3), fmt.m3(x.expectedClosingM3), fmt.m3(x.unaccountedM3), txt(x.direction)])}
      />
      <Lead>The tolerance percent swept on the same day:</Lead>
      <Tbl
        head={['percent of throughput', 'tolerance m3', 'within tolerance']}
        rows={(Array.isArray(tolSweep) ? tolSweep : []).map((x) => [x.percent, fmt.m3(x.toleranceM3), txt(x.withinTolerance)])}
      />

      <Lead>The trend: nine days of unaccounted figures, kept one day at a time.</Lead>
      <Slider label="Days kept" value={daysKept} min={0} max={9} step={1} onChange={onDaysKept} />
      {tr && (
        <>
          <TileGrid>
            <Tile label="Cumulative, m3" value={fmt.m3(tr.cumulativeM3)} />
            <Tile label="Mean, percent of throughput" value={fmt.pct(tr.meanPercent)} />
            <Tile label="Run ending on the last day kept" value={tr.runLength ? `${tr.runLength} days of ${tr.runDirection}` : '0'} />
          </TileGrid>
          {tr.prompt ? <EngineNote>{tr.prompt}</EngineNote> : <Note>The engine prints no prompt at this run.</Note>}
          {tr.rows.length > 0 && (
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={tr.rows} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={AXIS} />
                  <YAxis tick={AXIS} />
                  <Tooltip contentStyle={TOOLTIP} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <ReferenceLine y={0} stroke={GRID} />
                  <Bar dataKey="unaccountedM3" name="unaccounted, m3" fill={SERIES[0]} isAnimationActive={false} />
                  <Line dataKey="cumulativeM3" name="cumulative, m3" stroke={SERIES[3]} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const TankExplorer = ({ initialMode = 'table' }) => {
  const [mode, setMode] = useState(initialMode);
  const tables = useMemo(() => safe(akodoTablesAt) || [], []);
  const [tank, setTank] = useState('AK-01');
  const [dips, setDips] = useState(() => Object.fromEntries(tables.map((t) => [t.id, String(t.dipMm)])));
  const [cuts, setCuts] = useState(() => Object.fromEntries(tables.map((t) => [t.id, String(t.waterMm)])));
  const [partial, setPartial] = useState(false);
  const [vcfs, setVcfs] = useState(() => Object.fromEntries(tables.map((t) => [t.id, String(t.vcfTyped)])));
  const first = tables[0] || {};
  const [rho, setRho] = useState(String(first.densityKgM3 ?? ''));
  const [temp, setTemp] = useState(String(first.temperatureC ?? ''));
  const [day, setDay] = useState({
    openingM3: String(AKODO_DAY.openingM3),
    receiptsM3: String(AKODO_DAY.receiptsM3),
    deliveriesM3: String(AKODO_DAY.deliveriesM3),
    knownLossM3: String(AKODO_DAY.knownLossM3),
    tolerancePercentOfThroughput: String(AKODO_DAY.tolerancePercentOfThroughput),
  });
  const [daysKept, setDaysKept] = useState('9');

  const dip = dips[tank] ?? '';
  const cut = cuts[tank] ?? '';
  const onDip = (v) => setDips((d) => ({ ...d, [tank]: v }));
  const onCut = (v) => setCuts((d) => ({ ...d, [tank]: v }));
  const onTank = (v) => { setTank(v); if (v !== 'AK-01') setPartial(false); };

  const reading = useMemo(() => (mode === 'table' ? safe(() => dipAt(tank, dip, { partial })) : null), [mode, tank, dip, partial]);
  const sweep = useMemo(() => (mode === 'table' ? safe(dipSweepAt) : null), [mode]);
  const partialRows = useMemo(() => (mode === 'table' ? safe(partialDipsAt) : null), [mode]);
  const above = useMemo(() => (mode === 'table' ? safe(aboveLastAt) : null), [mode]);
  const curve = useMemo(() => (mode === 'table' ? safe(curveAt) : null), [mode]);
  const water = useMemo(() => (mode === 'water' ? safe(() => waterAt(tank, dip, cut)) : null), [mode, tank, dip, cut]);
  const wsweep = useMemo(() => (mode === 'water' ? safe(waterSweepAt) : null), [mode]);
  const morning = useMemo(() => safe(() => morningAt(vcfs)), [vcfs]);
  const synth = useMemo(() => (mode === 'vcf' ? safe(() => vcfAt(rho, temp)) : null), [mode, rho, temp]);
  const vcurve = useMemo(() => (mode === 'vcf' ? safe(() => vcfCurveAt(rho)) : null), [mode, rho]);
  const refusals = useMemo(() => (mode === 'vcf' ? safe(vcfRefusalsAt) : null), [mode]);
  const closing = morning ? morning.closingStandardM3 : null;
  const dayInputs = { ...day, closingDippedM3: closing };
  const dayResult = useMemo(() => (mode === 'day' ? safe(() => dayAt({ ...day, closingDippedM3: closing })) : null), [mode, day, closing]);
  const cannotFail = useMemo(() => (mode === 'day' ? safe(cannotFailAt) : null), [mode]);
  const tolSweep = useMemo(() => (mode === 'day' ? safe(toleranceSweepAt) : null), [mode]);
  const trend = useMemo(() => (mode === 'day' ? safe(() => trendAt(daysKept)) : null), [mode, daysKept]);

  const onDemo = () => {
    const o = safe(() => openingFromClosingDerived(closing, day));
    setDay((d) => ({ ...d, openingM3: o === null ? '' : String(o) }));
  };
  const onRecord = () => setDay((d) => ({ ...d, openingM3: String(AKODO_DAY.openingM3) }));

  return (
    <PanelShell
      title="Tank explorer"
      subtitle="The AKODO import terminal: three tanks, their strapping tables, a morning of dips and water cuts, a VCF typed per tank, and the day closed on the result. Every figure is the engine's."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'table' && (
          <TableMode
            tables={tables}
            reading={reading}
            sweep={sweep}
            partialRows={partialRows}
            above={above}
            curve={curve}
            tank={tank}
            onTank={onTank}
            dip={dip}
            onDip={onDip}
            partial={partial}
            onPartial={setPartial}
          />
        )}
        {mode === 'water' && <WaterMode water={water} sweep={wsweep} tables={tables} tank={tank} onTank={onTank} dip={dip} onDip={onDip} cut={cut} onCut={onCut} />}
        {mode === 'vcf' && (
          <VcfMode
            morning={morning}
            vcfs={vcfs}
            onVcf={(id, v) => setVcfs((x) => ({ ...x, [id]: v }))}
            synth={synth}
            curve={vcurve}
            refusals={refusals}
            rho={rho}
            onRho={setRho}
            temp={temp}
            onTemp={setTemp}
          />
        )}
        {mode === 'day' && (
          <DayMode
            day={dayResult}
            inputs={dayInputs}
            onInput={(k, v) => setDay((d) => ({ ...d, [k]: v }))}
            onDemo={onDemo}
            onRecord={onRecord}
            cannotFail={cannotFail}
            tolSweep={tolSweep}
            trend={trend}
            daysKept={daysKept}
            onDaysKept={setDaysKept}
          />
        )}
      </div>
      <Note>
        Every volume, VCF and reconciliation figure on this page is a return value of the vendored terminalDepot module
        through the teaching lab. Every refusal is the engine&apos;s own sentence. A blank box goes to the engine as missing.
      </Note>
    </PanelShell>
  );
};

export default TankExplorer;
