import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  OKORDIA, CONFIGURATION_IDS, PRODUCT_IDS, SUPPLY_SCENARIOS, LICENSING_STAGES, SCALING_EXPONENT,
  scaleAt, slateOf, configurationOf, okordiaInputs, screenOf, scenarioTable, screenTable, screenRefusals,
  licensingOf, usd, bbl, pbl, frac,
} from './refineryLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, txt, yes, Tbl, Refused, Note, Lead, Empty, safe, usable, Slider, BoxField, Button, Check,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Screen explorer, the Associate tier throughout.
//
// THE SCREEN PRICES A BARREL OF CRUDE BEFORE ANY CAPITAL IS SPENT. The OKORDIA
// quotation scaled by both laws, the product slate valued per barrel of crude,
// the throughput and gross margin under a supply scenario, the annual streams and
// the licensing sequence. Every figure is a return value of the vendored
// modularRefinery engine through the teaching lab; every refusal is the engine's
// own sentence, shown when a box is blanked or a utilisation is typed out of its
// range.
//
// NO VALUATION HERE. The screen stops at the streams, as the engine does; the
// Expert tier hands streams to the screening engine.

export const MODES = [
  ['scale', 'The scaling laws: capital and capital per bpd from the quotation'],
  ['slate', 'The configuration and the product slate at a price table'],
  ['streams', 'Throughput, the gross margin and the annual streams'],
  ['screen', 'Every configuration under every supply scenario'],
  ['licensing', 'The licensing sequence'],
];

const CONFIG_OPTIONS = CONFIGURATION_IDS.map((id) => [id, safe(() => configurationOf(id).name) || id]);
const SCENARIO_OPTIONS = SUPPLY_SCENARIOS.map((s) => [s.id, s.name]);

// ---------------------------------------------------------------------------

export const ScaleMode = ({
  scale, capacity, onCapacity, modular, onModular, stick, onStick,
}) => {
  if (!usable(scale) || !scale.point || !Array.isArray(scale.curve)) return <Empty>The scaling reader has returned nothing, so there is no curve to draw.</Empty>;
  const p = scale.point;
  const data = scale.curve.map((r) => ({ capacity: r.capacity, modular: r.modularPerBpd, stick: r.stickBuiltPerBpd }));
  return (
    <>
      <FieldGrid>
        <Slider label="Plant capacity (bpd)" value={capacity} min={500} max={30000} step={500} onChange={onCapacity} />
        <Slider
          label={`Modular exponent, default ${SCALING_EXPONENT.MODULAR}, a default a vendor's figures replace`}
          value={modular}
          min={0.5}
          max={1}
          step={0.05}
          onChange={onModular}
          shown={frac(modular)}
        />
        <Slider
          label={`Stick-built exponent, default ${SCALING_EXPONENT.STICK_BUILT}, a default a vendor's figures replace`}
          value={stick}
          min={0.4}
          max={1}
          step={0.05}
          onChange={onStick}
          shown={frac(stick)}
        />
      </FieldGrid>
      <TileGrid>
        <Tile label="Modular capital" value={usd(p.modularCost)} unit="USD" />
        <Tile label="Modular capital per bpd" value={usd(p.modularPerBpd)} unit="USD" />
        <Tile label="Stick-built capital" value={usd(p.stickBuiltCost)} unit="USD" />
        <Tile label="Stick-built capital per bpd" value={usd(p.stickBuiltPerBpd)} unit="USD" />
      </TileGrid>
      <Note>
        Ratio of the modular cost to the stick-built cost {p.ratio === null ? 'none' : frac(p.ratio)}; modular
        cheaper {yes(p.modularCheaper)}; the two laws equal {yes(p.lawsEqual)}. Both start from the quotation of
        {' '}{usd(scale.reference.cost)} US dollars for {scale.reference.capacity} bpd, so they cross at that size.
      </Note>
      <div className="mt-3">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="capacity" type="number" domain={[0, 30000]} tick={AXIS} label={{ value: 'capacity (bpd)', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -4 }} />
            <YAxis tick={AXIS} width={70} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={scale.reference.capacity} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'the reference size', fill: '#94a3b8', fontSize: 10 }} />
            <ReferenceLine x={capacity} stroke="#BFFF00" />
            <Line type="monotone" dataKey="modular" name={`modular per bpd (${frac(modular)})`} stroke={SERIES[0]} dot={false} />
            <Line type="monotone" dataKey="stick" name={`stick-built per bpd (${frac(stick)})`} stroke={SERIES[1]} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['capacity (bpd)', 'modular cost', 'modular per bpd', 'stick-built cost', 'stick-built per bpd', 'ratio', 'modular cheaper', 'the two laws equal']}
        rows={scale.table.map((r) => [r.capacity, usd(r.modularCost), usd(r.modularPerBpd), usd(r.stickBuiltCost), usd(r.stickBuiltPerBpd), r.ratio === null ? 'none' : frac(r.ratio), yes(r.modularCheaper), yes(r.lawsEqual)])}
      />
      <Note>
        scaleCapex with no exponent passed at this capacity uses the exponent {txt(scale.noExponentPassed.exponent)}, and returns
        {' '}{usd(scale.noExponentPassed.cost)}. The same quotation scaled with an exponent of 1 at 10000 bpd returns
        {' '}{usd(scale.linearAt10000.cost)}, {usd(scale.linearAt10000.perBpd)} per bpd.
      </Note>
    </>
  );
};

export const SlateMode = ({
  slate, configId, onConfig, prices, onPrice, yields, onYield, onReset, onTypedYields,
}) => {
  const priceBoxes = PRODUCT_IDS.map((k) => (
    <BoxField key={k} label={`${k} ($/bbl)`} value={prices ? prices[k] : ''} onChange={(v) => onPrice(k, v)} />
  ));
  if (!usable(slate) || !Array.isArray(slate.rows)) {
    return (
      <>
        <FieldGrid>{priceBoxes}</FieldGrid>
        <Empty>The slate reader has returned nothing, so there is no slate to value.</Empty>
      </>
    );
  }
  const keys = Object.keys(slate.productYields || {});
  return (
    <>
      <FieldGrid>
        <SelectField label="Configuration" value={configId} onChange={onConfig} options={CONFIG_OPTIONS} />
      </FieldGrid>
      <Note>{slate.configuration.name}: {slate.configuration.units.join(', ')}. {slate.configuration.description}</Note>
      <Lead>Prices, US dollars a barrel. Blank a box and the engine names that product as unpriced.</Lead>
      <FieldGrid>{priceBoxes}</FieldGrid>
      <Lead>Yields, fractions of a barrel of crude, loss included.</Lead>
      <FieldGrid>
        {keys.map((k) => (
          <BoxField key={k} label={k} value={yields ? yields[k] : slate.productYields[k]} onChange={(v) => onYield(k, v)} />
        ))}
      </FieldGrid>
      <div className="flex flex-wrap gap-2 mt-2">
        <Button onClick={onReset}>Put back OKORDIA&apos;s prices and the screening yields</Button>
        <Button onClick={onTypedYields}>Load the hydroskimming yields a user typed</Button>
      </div>
      <Tbl
        head={['product', 'yield fraction', 'price', 'value per barrel of crude']}
        rows={slate.rows.map((r) => [r.id, frac(r.yieldFraction), r.pricePerBbl === null ? 'unpriced' : pbl(r.pricePerBbl), r.valuePerBblCrude === null ? 'no value' : pbl(r.valuePerBblCrude)])
          .concat([['loss', slate.loss === null ? 'none' : frac(slate.loss), 'none', 'a yield with no value']])}
      />
      <TileGrid>
        <Tile label="Gross value per barrel of crude" value={pbl(slate.grossValuePerBbl)} unit="$/bbl" />
        <Tile label="Yields total" value={frac(slate.yieldTotal)} />
        <Tile label="Yields close" value={yes(slate.yieldsClose)} />
        <Tile label="Unpriced" value={txt(slate.unpriced)} />
      </TileGrid>
      {!slate.yieldsClose && (
        <Note>The yields do not account for the whole barrel. The engine reports the gap and leaves the yields as typed.</Note>
      )}
    </>
  );
};

const INPUT_BOXES = [
  ['capacityBpd', 'Capacity (bpd)'],
  ['onstreamDays', 'On-stream days a year'],
  ['crudeCostPerBbl', 'Crude cost before the premium ($/bbl)'],
  ['fixedOpexPerYear', 'Fixed operating cost (USD a year)'],
  ['variableOpexPerBbl', 'Variable operating cost ($/bbl)'],
  ['projectLife', 'Operating years'],
  ['constructionYears', 'Construction years'],
];

export const StreamsMode = ({
  screen, inputs, onInput, typeUtil, onTypeUtil, typeCapex, onTypeCapex, refusals, scenarios, allYears, onAllYears, onReset,
}) => {
  const i = inputs || {};
  const controls = (
    <>
      <FieldGrid>
        <SelectField label="Configuration" value={i.configurationId} onChange={(v) => onInput('configurationId', v)} options={CONFIG_OPTIONS} />
        <SelectField label="Supply scenario" value={i.scenarioId} onChange={(v) => onInput('scenarioId', v)} options={SCENARIO_OPTIONS} />
        {INPUT_BOXES.map(([k, label]) => (
          <BoxField key={k} label={label} value={i[k]} onChange={(v) => onInput(k, v)} />
        ))}
      </FieldGrid>
      <div className="flex flex-wrap gap-4 mt-2">
        <Check label="Type a utilisation instead of the scenario's" checked={typeUtil} onChange={onTypeUtil} />
        {typeUtil && <BoxField label="Utilisation as typed" value={i.utilisation} onChange={(v) => onInput('utilisation', v)} width="w-28" />}
        <Check label="Type the capital instead of the modular law" checked={typeCapex} onChange={onTypeCapex} />
        {typeCapex && <BoxField label="Capital as typed (USD)" value={i.capexTyped} onChange={(v) => onInput('capexTyped', v)} width="w-40" />}
        <Button onClick={onReset}>Put back the OKORDIA plant</Button>
      </div>
    </>
  );
  let body;
  if (!screen || typeof screen !== 'object') {
    body = <Empty>The screen reader has returned nothing, so there are no streams to show.</Empty>;
  } else if (screen.error) {
    body = <Refused label="feasibilityStreams" sentence={screen.error} />;
  } else if (!Array.isArray(screen.years)) {
    body = <Empty>The screen reader has returned no years.</Empty>;
  } else {
    const shown = allYears ? screen.years : screen.years.filter((y) => y.year <= 3 || y.year === screen.years.length - 1);
    body = (
      <>
        <TileGrid>
          <Tile label="Capital" value={usd(screen.capex)} unit="USD" />
          <Tile label="Capital per bpd" value={usd(screen.capexPerBpd)} unit="USD" />
          <Tile label="Annual throughput" value={bbl(screen.annualBbl)} unit="bbl" />
          <Tile label="Gross margin per barrel of crude" value={pbl(screen.grossMarginPerBbl)} unit="$/bbl" />
        </TileGrid>
        <Note>
          {screen.scenario.name}: utilisation {frac(screen.scenario.utilisation)}, crude premium {pbl(screen.scenario.crudePremium)} a barrel,
          so the crude reaches the engine at {pbl(screen.crudeCostWithPremium)}. Gross value per barrel of crude
          {' '}{pbl(screen.grossValuePerBbl)}. The gross margin per barrel leaves the fixed operating cost out.
          {' '}{screen.yearsInStreams} years in the streams; the first producing year is year {screen.firstProducingYear}.
        </Note>
        <div className="mt-2"><Check label="Show every year" checked={allYears} onChange={onAllYears} /></div>
        <Tbl
          head={['year', 'producing', 'crude run (bbl)', 'revenue', 'crude cost', 'fixed opex', 'variable opex', 'capex']}
          rows={shown.map((y) => [y.year, yes(y.producing), bbl(y.crudeBbl), usd(y.revenue), usd(y.crudeCost), usd(y.fixedOpex), usd(y.variableOpex), usd(y.capex)])}
        />
      </>
    );
  }
  return (
    <>
      {controls}
      <div className="mt-3">{body}</div>
      {Array.isArray(scenarios) && (
        <>
          <Lead>The same plant under each supply scenario. The scenarios are named futures and carry no probability.</Lead>
          <Tbl
            head={['scenario', 'utilisation', 'premium', 'crude cost with premium', 'annual throughput (bbl)', 'gross margin per bbl', 'first operating year revenue']}
            rows={scenarios.map((s) => [s.name, frac(s.utilisation), pbl(s.crudePremium), s.crudeCostWithPremium === null ? 'none' : pbl(s.crudeCostWithPremium),
              s.error ? 'refused' : bbl(s.annualBbl), s.error ? 'refused' : pbl(s.grossMarginPerBbl), s.error ? 'refused' : usd(s.firstRevenue)])}
          />
          {scenarios.map((s) => <Note key={s.id}>{s.name}: {s.note}</Note>)}
        </>
      )}
      {usable(refusals) && Array.isArray(refusals.streams) && (
        <>
          <Lead>The OKORDIA plant with one box changed at a time, and what the engine returned:</Lead>
          <Tbl
            head={['input changed', 'what the engine returns']}
            rows={refusals.streams.map((r) => [r.label, r.error ? r.error : `annual throughput ${bbl(r.annualBbl)} bbl`])
              .concat(refusals.economics.map((r) => [`valuing the streams: ${r.label}`, txt(r.error)]))
              .concat(refusals.scale.map((r) => [`scaleCapex: ${r.label}`, `cost ${txt(r.cost)}, per bpd ${txt(r.perBpd)}`]))}
          />
        </>
      )}
    </>
  );
};

export const ScreenMode = ({ table }) => {
  if (!Array.isArray(table) || !table.length) return <Empty>The screen table has returned nothing.</Empty>;
  return (
    <>
      <Lead>
        OKORDIA at {OKORDIA.capacityBpd} bpd with its capital by the modular law, every configuration under every supply
        scenario, at OKORDIA&apos;s prices and costs.
      </Lead>
      <Tbl
        head={['configuration', 'scenario', 'gross value per bbl', 'annual throughput (bbl)', 'gross margin per bbl', 'first operating year revenue']}
        rows={table.map((r) => [r.configurationId, r.scenarioId, pbl(r.grossValuePerBbl), bbl(r.annualBbl), pbl(r.grossMarginPerBbl), usd(r.firstRevenue)])}
        tone={(k) => (table[k].grossMarginPerBbl < 0 ? 'text-red-300' : '')}
      />
      <Note>A row in red has a gross margin per barrel below zero.</Note>
    </>
  );
};

export const LicensingMode = ({ lic, done, onToggle }) => {
  if (!usable(lic) || !Array.isArray(lic.stages)) return <Empty>The licensing reader has returned nothing.</Empty>;
  return (
    <>
      <Lead>Tick the stages a project holds, in any order.</Lead>
      <div className="flex flex-wrap gap-4 mt-2">
        {LICENSING_STAGES.map((s) => (
          <Check key={s.id} label={`${s.stage}. ${s.name}`} checked={Array.isArray(done) && done.includes(s.id)} onChange={() => onToggle(s.id)} />
        ))}
      </div>
      <TileGrid>
        <Tile label="Stages complete" value={txt(lic.completeCount)} />
        <Tile label="Next stage" value={lic.nextStage === null ? 'none, all three held' : lic.nextStage} />
        <Tile label="Out of order" value={yes(lic.outOfOrder)} />
      </TileGrid>
      {lic.outOfOrder && <Note>A later licence is ticked while an earlier one is not, which the app surfaces as a data-entry error.</Note>}
      <div className="grid gap-2 sm:grid-cols-3 mt-3">
        {lic.stages.map((s) => (
          <div key={s.id} className={`rounded-md border p-2 bg-[#0F172A] ${s.complete ? 'border-emerald-700/60' : 'border-slate-700'}`}>
            <p className="text-xs text-slate-500 mb-0">stage {s.stage}, {s.id}{s.complete ? ', held' : ''}</p>
            <p className="text-sm text-white mb-0">{s.name}</p>
            <p className="text-xs text-slate-400 mt-1 mb-0">{s.summary}</p>
            <p className="text-[11px] text-slate-500 mt-1 mb-0">Typical evidence: {s.typicalEvidence.join('; ')}</p>
          </div>
        ))}
      </div>
      <Note>The app tracks where a project has got to. It is a process aid, and the regulator&apos;s current requirements govern.</Note>
    </>
  );
};

// ---------------------------------------------------------------------------

const asBoxes = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v === undefined || v === null || typeof v === 'object' ? v : String(v)]));

const ScreenExplorer = ({ initialMode = 'scale' }) => {
  const [mode, setMode] = useState(initialMode);
  const [capacity, setCapacity] = useState(OKORDIA.capacityBpd);
  const [modular, setModular] = useState(SCALING_EXPONENT.MODULAR);
  const [stick, setStick] = useState(SCALING_EXPONENT.STICK_BUILT);
  const [configId, setConfigId] = useState(OKORDIA.configurationId);
  const [prices, setPrices] = useState(() => asBoxes(OKORDIA.prices));
  const [yields, setYields] = useState(null);
  const [inputs, setInputs] = useState(() => asBoxes(okordiaInputs()));
  const [typeUtil, setTypeUtil] = useState(false);
  const [typeCapex, setTypeCapex] = useState(false);
  const [allYears, setAllYears] = useState(false);
  const [done, setDone] = useState(OKORDIA.licensingDone);

  const scale = useMemo(() => (mode === 'scale' ? safe(() => scaleAt({ capacity, modularExponent: modular, stickBuiltExponent: stick })) : null), [mode, capacity, modular, stick]);
  const slate = useMemo(() => (mode === 'slate' ? safe(() => slateOf({ configurationId: configId, prices, yields })) : null), [mode, configId, prices, yields]);
  const screenArgs = {
    ...inputs,
    utilisation: typeUtil ? (inputs.utilisation ?? '') : undefined,
    capexTyped: typeCapex ? (inputs.capexTyped ?? '') : undefined,
    prices: OKORDIA.prices,
    yields: null,
    modularExponent: SCALING_EXPONENT.MODULAR,
  };
  const screen = mode === 'streams' ? safe(() => screenOf(screenArgs)) : null;
  const scenarios = mode === 'streams' ? safe(() => scenarioTable({ ...screenArgs, utilisation: undefined })) : null;
  const refusals = useMemo(() => (mode === 'streams' ? safe(screenRefusals) : null), [mode]);
  const table = useMemo(() => (mode === 'screen' ? safe(screenTable) : null), [mode]);
  const lic = useMemo(() => (mode === 'licensing' ? safe(() => licensingOf(done)) : null), [mode, done]);

  const onConfig = (id) => { setConfigId(id); setYields(null); };
  const onYield = (k, v) => setYields((y) => ({ ...(y || asBoxes(configurationOf(configId).productYields)), [k]: v }));
  const onToggle = (id) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  return (
    <PanelShell
      title="Screen explorer"
      subtitle="OKORDIA, a modular refinery screened before any capital is spent: the vendor quotation scaled by both laws, the product slate valued per barrel of crude, the throughput and gross margin under a supply scenario, and the licensing sequence."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'scale' && (
          <ScaleMode scale={scale} capacity={capacity} onCapacity={setCapacity} modular={modular} onModular={setModular} stick={stick} onStick={setStick} />
        )}
        {mode === 'slate' && (
          <SlateMode
            slate={slate}
            configId={configId}
            onConfig={onConfig}
            prices={prices}
            onPrice={(k, v) => setPrices((p) => ({ ...p, [k]: v }))}
            yields={yields}
            onYield={onYield}
            onReset={() => { setPrices(asBoxes(OKORDIA.prices)); setYields(null); }}
            onTypedYields={() => { setConfigId('hydroskimming'); setYields(asBoxes(OKORDIA.yieldsTyped)); }}
          />
        )}
        {mode === 'streams' && (
          <StreamsMode
            screen={screen}
            inputs={inputs}
            onInput={(k, v) => setInputs((x) => ({ ...x, [k]: v }))}
            typeUtil={typeUtil}
            onTypeUtil={setTypeUtil}
            typeCapex={typeCapex}
            onTypeCapex={setTypeCapex}
            refusals={refusals}
            scenarios={scenarios}
            allYears={allYears}
            onAllYears={setAllYears}
            onReset={() => { setInputs(asBoxes(okordiaInputs())); setTypeUtil(false); setTypeCapex(false); }}
          />
        )}
        {mode === 'screen' && <ScreenMode table={table} />}
        {mode === 'licensing' && <LicensingMode lic={lic} done={done} onToggle={onToggle} />}
      </div>
      <Note>
        Every capital cost, slate value, throughput and margin on this page is a return value of the vendored
        modularRefinery engine through the teaching lab. Every refusal is the engine&apos;s own sentence. Every price is
        illustrative, in US dollars.
      </Note>
    </PanelShell>
  );
};

export default ScreenExplorer;
