import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import {
  ABUA, CARGO_SIZES, ZONES, PERIOD_START, PERIOD_DAYS, abuaInput, planOf, crudeUnitGivenAFeed, variantPlans,
  planRefusals, hydrotreaterThreeWays, reformerAt, reformerSweep, scheduleOf, zoneSchedules,
  usd, bbl, pbl, pct, frac,
} from './refineryLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, txt, yes, Tbl, Refused, EngineSays, Note, Lead, Empty, safe, usable, Slider, BoxField, Button, Check,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Plan explorer, the Professional tier throughout.
//
// THE PLAN FINDS THE MARGIN WITH EVERY BARREL RUN THROUGH THE CRUDE UNIT. The
// ABUA configuration is on screen as editable tables, and the plan is solved
// again by the vendored refineryPlanning engine every time a box changes. A limit
// can be typed as a number, typed as 0 or left blank, and the engine reads the
// three differently: a blank is no limit, a 0 is a limit of zero. A plan the
// engine cannot make is shown as its status and the engine's own sentence, and
// no chart is drawn from it.
//
// THE SCHEDULE DATES THE PLAN from the period start the course passes as a
// YYYY-MM-DD string, and the zone picker shows the dates the engine returns for
// that string beside the dates it returns for a Date built at local midnight.
// Nothing here constructs a date or reads the time.

export const MODES = [
  ['config', 'The ABUA configuration as editable tables, and the plan'],
  ['crudeunit', 'The crude unit carries every barrel'],
  ['streams', 'The stream balance, what another barrel is worth, and the debottleneck'],
  ['changes', 'The plan under five changes, and the plans the engine refuses'],
  ['schedule', 'The schedule for March 2027, the cargo size and the time zones'],
];

const hi = 'text-[#BFFF00]';

export const PlanStatus = ({ plan }) => {
  if (!plan || typeof plan !== 'object') return <Empty>The plan reader has returned nothing.</Empty>;
  if (plan.status !== 'optimal') {
    return <Refused label={`planRefinery, status ${txt(plan.status)}`} sentence={plan.error} />;
  }
  return null;
};

const planReady = (plan) => usable(plan) && plan.status === 'optimal' && Array.isArray(plan.units);

// ---------------------------------------------------------------------------

export const ConfigMode = ({
  input, onCell, onReset, onDht, plan,
}) => {
  if (!input || !Array.isArray(input.crudes) || !Array.isArray(input.units) || !Array.isArray(input.products)) {
    return <Empty>The configuration has returned nothing, so there is nothing to edit.</Empty>;
  }
  const box = (kind, id, field, v) => <BoxField value={v} onChange={(x) => onCell(kind, id, field, x)} width="w-24" />;
  return (
    <>
      <Lead>Crudes. A blank availability is no limit; an availability typed as 0 is a cargo that will not come.</Lead>
      <Tbl
        head={['crude', 'cost ($/bbl)', 'available (bbl)', 'yields']}
        rows={input.crudes.map((c) => [c.name, box('crudes', c.id, 'cost', c.cost), box('crudes', c.id, 'available', c.available),
          Object.entries(c.yields).map(([k, v]) => `${k} ${frac(v)}`).join(', ')])}
      />
      <Lead>Units. A blank capacity is no limit; a capacity typed as 0 is a unit shut for a turnaround.</Lead>
      <Tbl
        head={['unit', 'capacity (bbl)', 'operating cost ($/bbl)', 'feed', 'yields']}
        rows={input.units.map((u) => [u.name, box('units', u.id, 'capacity', u.capacity), box('units', u.id, 'opex', u.opex),
          u.feed || 'none, the crude unit', Object.entries(u.yields).map(([k, v]) => `${k} ${frac(v)}`).join(', ') || 'the crude yields'])}
      />
      <Lead>Products. A blank ceiling is no limit.</Lead>
      <Tbl
        head={['product', 'price ($/bbl)', 'floor (bbl)', 'ceiling (bbl)', 'recipe']}
        rows={input.products.map((p) => [p.name, box('products', p.id, 'price', p.price), box('products', p.id, 'minDemand', p.minDemand),
          box('products', p.id, 'maxDemand', p.maxDemand), Object.entries(p.recipe).map(([k, v]) => `${k} ${frac(v)}`).join(', ')])}
      />
      <div className="flex flex-wrap gap-2 mt-2">
        <Button onClick={() => onDht(ABUA.units.find((u) => u.id === 'dht').capacity)}>Hydrotreater as typed</Button>
        <Button onClick={() => onDht(0)}>Hydrotreater typed as 0</Button>
        <Button onClick={() => onDht('')}>Hydrotreater left blank</Button>
        <Button onClick={onReset}>Put back ABUA as typed</Button>
      </div>
      <div className="mt-3">
        <PlanStatus plan={plan} />
        {planReady(plan) && (
          <>
            <TileGrid>
              <Tile label="Total crude" value={bbl(plan.totalCrude)} unit="bbl" />
              <Tile label="Margin" value={usd(plan.margin)} unit="USD" />
              <Tile label="Gross margin per barrel of crude" value={pbl(plan.grossMarginPerBbl)} unit="$/bbl" />
              <Tile label="Crude unit utilisation" value={plan.crudeUnit ? `${pct(plan.crudeUnit.utilisation)} percent` : 'no crude unit'} />
            </TileGrid>
            <Tbl
              head={['crude', 'volume (bbl)', 'available (bbl)', 'at its availability', 'cost']}
              rows={plan.crudes.map((c) => [c.name, bbl(c.volume), c.available === null ? 'no limit' : bbl(c.available), yes(c.atAvailability), usd(c.cost)])}
              tone={(k) => (plan.crudes[k].atAvailability ? hi : '')}
            />
            <Tbl
              head={['unit', 'throughput (bbl)', 'capacity the plan reports', 'utilisation (percent)', 'at capacity', 'operating cost']}
              rows={plan.units.map((u) => [u.name, bbl(u.throughput), u.capacity === null ? `${u.capacityReported}, no limit` : bbl(u.capacity),
                u.utilisation === null ? 'null' : pct(u.utilisation), yes(u.atCapacity), usd(u.cost)])}
              tone={(k) => (plan.units[k].atCapacity ? hi : '')}
            />
            <Tbl
              head={['product', 'volume (bbl)', 'ceiling (bbl)', 'at its ceiling', 'revenue']}
              rows={plan.products.map((p) => [p.name, bbl(p.volume), p.ceiling === null ? 'no limit' : bbl(p.ceiling), yes(p.atCeiling), usd(p.revenue)])}
              tone={(k) => (plan.products[k].atCeiling ? hi : '')}
            />
            <Note>
              Rows in green are at a limit, read from the plan&apos;s own numbers. A utilisation needs a finite capacity above
              zero, so a unit typed as 0 or left blank reports none.
            </Note>
          </>
        )}
      </div>
    </>
  );
};

export const CrudeUnitMode = ({ plan, fed, showFed, onShowFed }) => {
  if (!plan || typeof plan !== 'object') return <Empty>The plan reader has returned nothing.</Empty>;
  const p = showFed ? fed : plan;
  return (
    <>
      <Check label="Give the crude unit a feed stream no crude makes, so no unit is feedless" checked={showFed} onChange={onShowFed} />
      <div className="mt-2"><PlanStatus plan={p} /></div>
      {planReady(p) && (
        <>
          <TileGrid>
            <Tile label="Total crude" value={bbl(p.totalCrude)} unit="bbl" />
            <Tile label="Crude distillation throughput" value={bbl(p.units.find((u) => u.id === 'cdu').throughput)} unit="bbl" />
            <Tile label="Crude distillation operating cost" value={usd(p.units.find((u) => u.id === 'cdu').cost)} unit="USD" />
            <Tile label="The two agree to the barrel" value={yes(p.crudeUnitAgrees)} />
          </TileGrid>
          <Tbl
            head={['unit', 'crude unit', 'throughput (bbl)', 'capacity (bbl)', 'utilisation (percent)', 'operating cost']}
            rows={p.units.map((u) => [u.name, yes(u.crudeUnit), bbl(u.throughput), u.capacity === null ? 'no limit' : bbl(u.capacity), u.utilisation === null ? 'null' : pct(u.utilisation), usd(u.cost)])}
          />
          <Note>
            Margin {usd(p.margin)}. {showFed
              ? 'With no feedless unit the plan has no crude unit, so the crude distillation capacity and operating cost bind nothing.'
              : 'A unit with no feed is the crude unit, and every barrel of crude runs through it.'}
          </Note>
        </>
      )}
    </>
  );
};

export const StreamsMode = ({
  plan, reformer, onReformer, atReformer, sweep,
}) => {
  if (!plan || typeof plan !== 'object') return <Empty>The plan reader has returned nothing.</Empty>;
  if (!planReady(plan)) return <PlanStatus plan={plan} />;
  const data = plan.streams.map((s) => ({ id: s.id, value: s.marginalValue }));
  return (
    <>
      <Tbl
        head={['stream', 'made (bbl)', 'consumed (bbl)', 'placed (bbl)', 'surplus (bbl)', 'marginal value ($/bbl)', 'products it goes into, at their prices', 'unit it feeds']}
        rows={plan.streams.map((s) => [s.id, bbl(s.made), bbl(s.consumed), bbl(s.placed), bbl(s.surplus), pbl(s.marginalValue),
          s.goesInto.length ? s.goesInto.map((g) => `${g.name} ${pbl(g.price)}`).join('; ') : 'no product', s.feeds.length ? s.feeds.join(', ') : 'no unit'])}
      />
      <div className="mt-3">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="id" tick={AXIS} />
            <YAxis tick={AXIS} width={60} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => pbl(v)} />
            <Bar dataKey="value" name="marginal value ($/bbl)">
              {data.map((d, k) => <Cell key={d.id} fill={SERIES[k % SERIES.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Lead>Pricing a debottleneck: the reformer capacity as a control, everything else as it stands in the configuration.</Lead>
      <Slider label="Reformer capacity (bbl for the month)" value={reformer} min={300000} max={560000} step={20000} onChange={onReformer} shown={bbl(reformer)} />
      <div className="mt-2">
        {atReformer && atReformer.status !== 'optimal' && <PlanStatus plan={atReformer} />}
        {planReady(atReformer) && (
          <TileGrid>
            <Tile label="Margin" value={usd(atReformer.margin)} unit="USD" />
            <Tile label="Reformer utilisation" value={`${pct(atReformer.units.find((u) => u.id === 'reformer').utilisation)} percent`} />
            <Tile label="Naphtha, marginal value" value={pbl(atReformer.streams.find((s) => s.id === 'naphtha').marginalValue)} unit="$/bbl" />
          </TileGrid>
        )}
      </div>
      {Array.isArray(sweep) && (
        <Tbl
          head={['reformer capacity (bbl)', 'reformer utilisation (percent)', 'margin', 'change in margin', 'change in capacity (bbl)', 'margin gained per extra barrel of capacity']}
          rows={sweep.map((r) => (r.status === 'optimal'
            ? [bbl(r.capacity), pct(r.utilisation), usd(r.margin), txt(r.marginChange), txt(r.capacityChange), txt(r.perExtraBarrel)]
            : [bbl(r.capacity), txt(r.status), txt(r.error), '', '', '']))}
        />
      )}
    </>
  );
};

export const ChangesMode = ({ variants, refusals, dht }) => {
  if (!Array.isArray(variants) || !variants.length) return <Empty>The plan changes have returned nothing.</Empty>;
  return (
    <>
      <Tbl
        head={['change', 'status', 'total crude (bbl)', 'crude unit utilisation (percent)', 'margin', 'gross margin per bbl', 'margin change', 'gross margin change']}
        rows={variants.map((v) => [v.label, v.status, bbl(v.totalCrude), pct(v.crudeUnitUtilisation), usd(v.margin), pbl(v.grossMarginPerBbl), v.marginChange, v.grossMarginChange])}
      />
      <Lead>The stream values under each change, US dollars a barrel:</Lead>
      <Tbl
        head={['change', ...ABUA.streams]}
        rows={variants.map((v) => [v.label, ...ABUA.streams.map((s) => pbl(v.streamValues[s]))])}
      />
      {Array.isArray(dht) && (
        <>
          <Lead>The diesel hydrotreater three ways:</Lead>
          <Tbl
            head={['hydrotreater capacity', 'throughput (bbl)', 'capacity the plan reports', 'crude run (bbl)', 'margin']}
            rows={dht.map((r) => [r.label, bbl(r.throughput), r.capacityReported, bbl(r.totalCrude), usd(r.margin)])}
          />
        </>
      )}
      {Array.isArray(refusals) && (
        <>
          <Lead>Plans the engine refuses, and plans with no answer, in the engine&apos;s words:</Lead>
          {refusals.map((r) => <Refused key={r.label} label={`${r.label} (${r.status})`} sentence={r.error} />)}
        </>
      )}
    </>
  );
};

export const ScheduleMode = ({
  sch, cargo, onCargo, zone, onZone, zones,
}) => {
  if (!sch || typeof sch !== 'object' || !Array.isArray(sch.calendar)) return <Empty>The schedule reader has returned nothing.</Empty>;
  const z = Array.isArray(zones) ? zones.find((r) => r.zone === zone) : null;
  const weeks = [];
  for (let k = 0; k < sch.calendar.length; k += 7) weeks.push(sch.calendar.slice(k, k + 7));
  const short = { receipt: 'in', unit_run: 'run', delivery: 'lift' };
  return (
    <>
      <FieldGrid>
        <SelectField label="Cargo size (bbl)" value={String(cargo)} onChange={(v) => onCargo(Number(v))} options={CARGO_SIZES.map((c) => [String(c), bbl(c)])} />
        <SelectField label="Time zone to date the schedule in" value={zone} onChange={onZone} options={ZONES.map((x) => [x, x])} />
      </FieldGrid>
      {sch.status !== 'optimal' ? (
        <>
          <Refused label={`planRefinery, status ${txt(sch.status)}`} sentence={sch.error} />
          <EngineSays>{txt(sch.note)}</EngineSays>
          <Note>{sch.events.length} events.</Note>
        </>
      ) : (
        <>
          <TileGrid>
            <Tile label="Events" value={txt(sch.counts.all)} />
            <Tile label="Crude receipts" value={txt(sch.counts.receipts)} />
            <Tile label="Unit runs" value={txt(sch.counts.unitRuns)} />
            <Tile label="Product lifts" value={txt(sch.counts.lifts)} />
          </TileGrid>
          <Note>Period start {sch.periodStart}, passed as that string, over {sch.periodDays} days. The engine&apos;s note:</Note>
          <EngineSays>{txt(sch.note)}</EngineSays>
          <div className="mt-3 overflow-x-auto">
            <table className="text-[11px] text-slate-300 w-full border-collapse">
              <tbody>
                {weeks.map((w, k) => (
                  <tr key={k}>
                    {w.map((d) => (
                      <td key={d.date} className="align-top border border-slate-700 p-1 min-w-[88px]">
                        <p className="text-slate-500 mb-0">{d.date}</p>
                        {d.events.map((e) => (
                          <p key={e.id} className={`mb-0 ${e.type === 'receipt' ? 'text-sky-300' : e.type === 'delivery' ? 'text-pink-300' : 'text-slate-300'}`}>
                            {short[e.type] || e.type} {e.materialId} {bbl(e.quantity)}
                          </p>
                        ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Note>Rows are the period&apos;s weeks from the period start. In blue a crude receipt, in pink a product lift.</Note>
          <Tbl
            head={['crude', 'crude run (bbl)', 'crude run / cargo size', 'cargoes in the schedule', 'receipt dates']}
            rows={sch.cargoes.map((c) => [c.name, bbl(c.crudeRun), frac(c.runOverCargo), c.cargoes, c.dates.join(', ')])}
          />
          <Tbl
            head={['material', 'type', 'events', 'scheduled quantity (bbl)', 'scheduled value']}
            rows={sch.ledger.map((r) => [r.materialId, r.type, r.events, bbl(r.quantity), usd(r.value)])}
          />
        </>
      )}
      {z && (
        <>
          <Lead>ABUA as typed, dated in {z.zone}:</Lead>
          <Tbl
            head={['period start handed to the engine', 'first date', 'last date', 'every date matches UTC']}
            rows={[
              [`the string ${PERIOD_START}`, z.fromString.first, z.fromString.last, yes(z.fromString.matchesUtc)],
              ['a Date built at local midnight', z.fromLocalMidnight.first, z.fromLocalMidnight.last, yes(z.fromLocalMidnight.matchesUtc)],
            ]}
          />
          <Note>
            The engine reads a Date&apos;s UTC calendar day, so a local midnight east of Greenwich is the day before. The string
            is the same calendar day in every zone, which is how the Suite page and this course pass it. The period is
            {' '}{PERIOD_DAYS} days.
          </Note>
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const PlanExplorer = ({ initialMode = 'config' }) => {
  const [mode, setMode] = useState(initialMode);
  const [input, setInput] = useState(() => abuaInput());
  const [showFed, setShowFed] = useState(false);
  const [reformer, setReformer] = useState(ABUA.units.find((u) => u.id === 'reformer').capacity);
  const [cargo, setCargo] = useState(ABUA.cargoSize);
  const [zone, setZone] = useState('Africa/Lagos');

  const plan = useMemo(() => safe(() => planOf(input)), [input]);
  const fed = useMemo(() => (mode === 'crudeunit' ? safe(() => crudeUnitGivenAFeed(input)) : null), [mode, input]);
  const atReformer = useMemo(() => (mode === 'streams' ? safe(() => reformerAt(reformer, input)) : null), [mode, reformer, input]);
  const sweep = useMemo(() => (mode === 'streams' ? safe(() => reformerSweep(ABUA.reformerSweep, input)) : null), [mode, input]);
  const variants = useMemo(() => (mode === 'changes' ? safe(variantPlans) : null), [mode]);
  const refusals = useMemo(() => (mode === 'changes' ? safe(planRefusals) : null), [mode]);
  const dht = useMemo(() => (mode === 'changes' ? safe(hydrotreaterThreeWays) : null), [mode]);
  const sch = useMemo(() => (mode === 'schedule' ? safe(() => scheduleOf({ input, cargoSize: cargo })) : null), [mode, input, cargo]);
  const zones = useMemo(() => (mode === 'schedule' ? safe(zoneSchedules) : null), [mode]);

  const onCell = (kind, id, field, value) => setInput((x) => ({
    ...x,
    [kind]: x[kind].map((r) => (r.id === id ? { ...r, [field]: value } : r)),
  }));

  return (
    <PanelShell
      title="Plan explorer"
      subtitle="ABUA, one month's refinery plan: three crudes, a crude unit, a reformer and a diesel hydrotreater, six products. Change a box and the plan is solved again; the schedule dates it from the period start."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'config' && (
          <ConfigMode input={input} onCell={onCell} onReset={() => setInput(abuaInput())} onDht={(v) => onCell('units', 'dht', 'capacity', v)} plan={plan} />
        )}
        {mode === 'crudeunit' && <CrudeUnitMode plan={plan} fed={fed} showFed={showFed} onShowFed={setShowFed} />}
        {mode === 'streams' && <StreamsMode plan={plan} reformer={reformer} onReformer={setReformer} atReformer={atReformer} sweep={sweep} />}
        {mode === 'changes' && <ChangesMode variants={variants} refusals={refusals} dht={dht} />}
        {mode === 'schedule' && <ScheduleMode sch={sch} cargo={cargo} onCargo={setCargo} zone={zone} onZone={setZone} zones={zones} />}
      </div>
      <Note>
        Every volume, margin, stream value and date on this page is a return value of the vendored refineryPlanning
        engine through the teaching lab. Every refusal is the engine&apos;s own sentence. Every price is illustrative, in
        US dollars.
      </Note>
    </PanelShell>
  );
};

export default PlanExplorer;
