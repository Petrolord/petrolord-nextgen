import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  COURSE_SET, IGBOGENE_HEATERS, IGBOGENE_FLARE, IGBOGENE_FLARE_DE, REPORTABLE_STEPS,
  gwpSets, heaters, flare, flareSweep, inventory, inventoryOnSets, reportableSteps, atomUnit, carbonRefusals, yn,
} from './carbonLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, F, usable, Tbl, Refused, Verbatim, Here, Status, Note, Lead, Empty, safe, Box, Button,
} from './panelBits';
import { PanelShell, SelectField, FieldGrid } from '@/components/course/panels/petrophysics/panelKit';

// Inventory explorer, the Associate tier throughout.
//
// CARBON IN, CO2 OUT. The Igbogene heaters and flare are atom balances: the
// fuel, the carbon per kilomole and the destruction efficiency are boxes, and
// each result becomes inventory lines through a factor of one, as the Carbon
// Studio builds them. The flare's efficiency box opens at the operator's
// invented 0.98; empty it and the engine refuses, and the flare contributes no
// line at all.
//
// A SET CARRIES ITS REPORT. The four GWP sets the digest prints are the only
// ones offered, each with its report, horizon and source line, and the course
// set is the one selected at load. Nothing here recommends a set (held item H1).
//
// COMPUTED AND REPORTABLE ARE TWO QUESTIONS. Every total carries the engine's
// reportable flag and its reasons, and an intensity carries its inventory's.

export const MODES = [
  ['atoms', 'The heaters and the flare as atom balances'],
  ['flare', 'The flare at five destruction efficiencies'],
  ['sets', 'One inventory on four GWP sets'],
  ['inventory', 'The inventory: provenance, reportable, intensity'],
];

const S = (v) => (v === null || v === undefined ? '' : String(v));

// ---------------------------------------------------------------------------

export const GwpPicker = ({ gwp, setKey, onSet }) => {
  if (!usable(gwp) || !Array.isArray(gwp.sets)) return <Empty>The GWP reader has returned nothing, so there is no set to choose.</Empty>;
  return (
    <div className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
      <p className="text-xs text-slate-300 mb-1">
        The GWP set. The engine ships none; these four are IPCC {gwp.horizon} values as tabulated in {gwp.source}. The set
        selected at load is the one every inventory in this course is computed on. Which report an operator files on is
        held (H1), and no choice here is graded.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {gwp.sets.map((s) => (
          <label key={s.key} className={`flex items-start gap-2 text-xs rounded border p-2 ${s.key === setKey ? 'border-[#BFFF00]' : 'border-slate-700'}`}>
            <input type="radio" name="carbon-gwp-set" checked={s.key === setKey} onChange={() => onSet && onSet(s.key)} className="mt-0.5 accent-[#BFFF00]" />
            <span className="text-slate-300">
              {s.label}
              <span className="block text-slate-500">report {s.report}, horizon {s.horizon}, CH4 {s.CH4}, N2O {s.N2O}{s.key === gwp.courseKey ? '; the course set' : ''}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------

const atomRows = (r) => (usable(r) ? [
  ['carbonKmolPerYear', F.kmol(r.carbonKmolPerYear)],
  ['co2Tonnes', F.t(r.co2Tonnes)],
  ['ch4Tonnes', F.t(r.ch4Tonnes)],
  ['destructionEfficiencyFraction', String(r.destructionEfficiencyFraction)],
] : []);

export const AtomMode = ({
  heat, fl, heatIn, flIn, onHeat, onFlare, unit, refusals,
}) => {
  const hi = heatIn && typeof heatIn === 'object' && !heatIn.error ? heatIn : {};
  const fi = flIn && typeof flIn === 'object' && !flIn.error ? flIn : {};
  const boxes = (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-2">
        <p className="text-xs text-slate-300 mb-0">The Igbogene fired heaters</p>
        <Box label="fuel, kmol a year" tag value={hi.fuelKmolPerYear} onChange={(v) => onHeat && onHeat('fuelKmolPerYear', v)} />
        <Box label="carbon per kmol of fuel" tag value={hi.carbonPerKmolFuel} onChange={(v) => onHeat && onHeat('carbonPerKmolFuel', v)} />
        <Box label="destruction efficiency, a fraction" tag value={hi.destructionEfficiencyFraction} onChange={(v) => onHeat && onHeat('destructionEfficiencyFraction', v)} />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-slate-300 mb-0">The Igbogene flare</p>
        <Box label="gas to the flare, kmol a year" tag value={fi.fuelKmolPerYear} onChange={(v) => onFlare && onFlare('fuelKmolPerYear', v)} />
        <Box label="carbon per kmol" tag value={fi.carbonPerKmolFuel} onChange={(v) => onFlare && onFlare('carbonPerKmolFuel', v)} />
        <Box label="destruction efficiency, from the operator's flare study" tag value={fi.destructionEfficiencyFraction} onChange={(v) => onFlare && onFlare('destructionEfficiencyFraction', v)} />
      </div>
    </div>
  );
  return (
    <>
      {boxes}
      <Lead>
        combustionCo2FromCarbon: every kilomole of carbon that burns leaves as MW_CO2 kilograms of CO2, and every kilomole
        that escapes leaves as MW_CH4 kilograms of methane. A blank box reaches the engine blank.
      </Lead>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          {usable(heat) ? <Tbl head={['heaters', 'value']} rows={atomRows(heat)} /> : <Refused label="the heaters" reason={heat && heat.error} />}
        </div>
        <div>
          {usable(fl) ? <Tbl head={['flare', 'value']} rows={atomRows(fl)} /> : <Refused label="the flare" reason={fl && fl.error} />}
          {usable(fl) && fl.unburnedNote && <Verbatim label="The engine's note on the escaped carbon">{fl.unburnedNote}</Verbatim>}
        </div>
      </div>
      {usable(unit) && (
        <>
          <Verbatim label="The engine's method">{unit.method}</Verbatim>
          <Note>
            MW_C {unit.MW_C}, MW_CO2 {unit.MW_CO2}, MW_CH4 {unit.MW_CH4}. The result carries these gas keys and no
            other: {Array.isArray(unit.gasKeys) ? unit.gasKeys.join(', ') : ''}.
          </Note>
          {Array.isArray(unit.rows) && (
            <Tbl
              head={['1000 kmol of a one-carbon fuel at efficiency', 'carbon kmol', 'co2Tonnes', 'ch4Tonnes']}
              rows={unit.rows.map((r) => [String(r.eta), F.kmol(r.carbonKmol), F.t(r.co2Tonnes), F.t(r.ch4Tonnes)])}
            />
          )}
        </>
      )}
      {usable(refusals) && Array.isArray(refusals.rows) && (
        <>
          <Lead>What the carbon engine refuses, each one call:</Lead>
          <Tbl head={['function', 'the call', 'the engine says']} rows={refusals.rows.map((r) => [r.fn, r.call, r.error || 'answered'])} />
          {usable(refusals.leftOut) && (
            <Note>
              Left out of the call, the destruction efficiency takes its stated default of complete combustion: 1000 kmol of a
              one-carbon fuel answers destructionEfficiencyFraction {String(refusals.leftOut.destructionEfficiencyFraction)},
              co2Tonnes {F.t(refusals.leftOut.co2Tonnes)}. A burner is the case that default is for; a flare is asked every time.
            </Note>
          )}
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

export const FlareMode = ({ sweep }) => {
  if (!usable(sweep) || !Array.isArray(sweep.rows)) return <Empty>The flare reader has returned nothing, so there is no flare to draw.</Empty>;
  const data = sweep.rows.map((r) => ({ eta: String(r.eta), co2: r.co2LineTCo2e, ch4: r.ch4LineTCo2e }));
  return (
    <>
      <Lead>
        The Igbogene flare at the five efficiencies, CO2 and the methane line stacked in tCO2e, the methane converted on the
        set chosen above: {sweep.setLabel || 'no set declared'}{sweep.ch4Gwp !== null ? ` (CH4 ${sweep.ch4Gwp})` : ''}.
      </Lead>
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="eta" tick={AXIS} label={{ value: 'destruction efficiency', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -4 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="co2" name="CO2, tCO2e" stackId="f" fill={SERIES[0]} isAnimationActive={false} />
            <Bar dataKey="ch4" name="methane line, tCO2e" stackId="f" fill={SERIES[1]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['destruction efficiency', 'co2Tonnes', 'ch4Tonnes', 'methane line tCO2e', 'flare tCO2e']}
        rows={sweep.rows.map((r) => [String(r.eta), F.t(r.co2Tonnes), F.t(r.ch4Tonnes), r.ch4LineTCo2e === null ? 'no line (no methane)' : F.t(r.ch4LineTCo2e), F.t(r.flareTCo2e)])}
        highlight={(i) => sweep.rows[i].eta === sweep.stated.eta}
      />
      <Refused label="the destruction efficiency blank" reason={sweep.blank} />
      {usable(sweep.computedHere) && (
        <Note>
          <Here>
            At {String(sweep.stated.eta)} the methane line is {F.t(sweep.stated.ch4LineTCo2e)} tCO2e of the flare&apos;s{' '}
            {F.t(sweep.stated.flareTCo2e)} tCO2e, a share of {F.share(sweep.computedHere.methaneShare)}. Read as 100 percent,
            the same flare is {F.t(sweep.computedHere.completeCombustionTCo2e)} tCO2e with no methane line,{' '}
            {F.t(sweep.computedHere.belowStated)} tCO2e below it
          </Here>
        </Note>
      )}
      {sweep.unburnedNote && <Verbatim label="The engine's note on the escaped carbon">{sweep.unburnedNote}</Verbatim>}
      <Note>
        Every escaped carbon atom is counted as methane (held item H3). The flare as a resource, what its gas is worth and
        how to recover it, is the sibling course Flare Gas to Value &amp; LPG/CNG.
      </Note>
    </>
  );
};

// ---------------------------------------------------------------------------

export const SetsMode = ({ gwp, onSets, setKey }) => {
  if (!usable(gwp) || !Array.isArray(gwp.sets)) return <Empty>The GWP reader has returned nothing, so there is no set to show.</Empty>;
  const course = gwp.sets.find((s) => s.key === gwp.courseKey) || gwp.sets[0];
  return (
    <>
      <Tbl
        head={['set', 'report', 'horizon', 'CH4', 'N2O', 'declared by the engine']}
        rows={gwp.sets.map((s) => [s.label, s.report, s.horizon, String(s.CH4), String(s.N2O), yn(s.declared)])}
        highlight={(i) => gwp.sets[i].key === setKey}
      />
      {course && <Verbatim label="The engine's note on every set">{course.note}</Verbatim>}
      {course && <Verbatim label="The engine's methane note on every set">{course.methaneNote}</Verbatim>}
      {Array.isArray(gwp.declaredChecks) && (
        <Tbl head={['makeGwpSet', 'declared']} rows={gwp.declaredChecks.map((c) => [c.call, yn(c.declared)])} />
      )}
      {Array.isArray(onSets) ? (
        <>
          <Lead>The Igbogene inventory rebuilt on each set. Only the methane lines move; every CO2 line has a GWP of 1 on every set.</Lead>
          <Tbl
            head={['set', 'Scope 1 tCO2e', 'Scope 2 tCO2e', 'total tCO2e', 'total less the course set', 'methane lines tCO2e']}
            rows={onSets.map((r) => [
              r.label, F.t(r.scope1), F.t(r.scope2), F.t(r.total), <Here key="h">{F.t(r.computedHere.lessCourseSet)}</Here>,
              r.methaneLines.map((l) => `${l.label} ${F.t(l.tCo2e)}`).join('; '),
            ])}
            highlight={(i) => onSets[i].key === setKey}
          />
          <Note>An inventory on one set cannot be compared with one on another. The engine states its set on every result, and an intensity carries it too.</Note>
        </>
      ) : <Empty>The four-set reader has returned nothing.</Empty>}
    </>
  );
};

// ---------------------------------------------------------------------------

const lineRow = (l) => [
  l.label, String(l.scope ?? 'none'), l.gas || 'none', F.t(l.activity), l.activityUnit || '', l.factor === undefined ? 'none' : String(l.factor ?? 'none'),
  l.factorUnit || '', l.gwp === undefined ? 'none' : String(l.gwp ?? 'none'), F.t(l.tonnesGas), F.t(l.tCo2e), l.source || 'none', l.version || 'none',
  yn(l.provenanceComplete), l.blockedBy || '',
];

export const InventoryMode = ({
  inv, steps, step, onStep, flareDe, onFlareDe,
}) => {
  const box = (
    <div className="max-w-xs">
      <Box label="the flare's destruction efficiency (empty it and the flare is refused)" tag value={typeof flareDe === 'string' || typeof flareDe === 'number' ? flareDe : ''} onChange={onFlareDe} />
    </div>
  );
  if (!usable(inv) || !usable(inv.inv)) return <>{box}<Empty>The inventory reader has returned nothing, so there is no inventory to show.</Empty></>;
  const I = inv.inv;
  const st = usable(steps) && Array.isArray(steps.steps) ? steps : null;
  const k = Number.isInteger(step) && st && st.steps[step] ? step : null;
  return (
    <>
      {box}
      <Lead>
        The Igbogene inventory on {inv.setLabel || 'no declared set'}, from the heaters and flare as set in the first view. The
        atom-balance lines carry a factor of 1 whose source is conservation of mass; the vented methane and purchased
        electricity lines carry registered factors (invented; the electricity factor is SYNTHETIC).
      </Lead>
      {!usable(inv.flare) && <Refused label="the flare, so it stands in the inventory as one blocked line" reason={inv.flare && inv.flare.error} />}
      <Tbl
        head={['line', 'scope', 'gas', 'activity', 'unit', 'factor', 'factor unit', 'GWP', 'tonnes of gas', 'tCO2e', 'source', 'version', 'provenance complete', 'blocked by']}
        rows={(I.lines || []).map(lineRow)}
      />
      <Tbl
        head={['total', 'tCO2e', 'status']}
        rows={[
          ...(I.byScope || []).map((s) => [s.label, F.t(s.tCo2e), <Status key={s.label} reportable={I.reportable} because={I.notReportableBecause} />]),
          ['Total, Scope 1 and Scope 2', F.t(I.totalTonnes), <Status key="t" reportable={I.reportable} because={I.notReportableBecause} />],
        ]}
      />
      <Note>
        gwpSetLabel: {I.gwpSetLabel || 'none'}. computed: {yn(I.computed)}. reportable: {yn(I.reportable)}. blocked lines:{' '}
        {(I.blockedLines || []).length ? I.blockedLines.map((b) => `${b.label} (${b.reason})`).join('; ') : '0'}. unsourced lines:{' '}
        {(I.unsourcedLines || []).length ? I.unsourcedLines.map((u) => `${u.label} (missing ${u.missing.join(' and ')})`).join('; ') : '0'}.
      </Note>
      {I.disclaimer && <Verbatim label="The engine's disclaimer">{I.disclaimer}</Verbatim>}
      {usable(inv.computedHere) && Array.isArray(inv.computedHere.shares) && (
        <Tbl head={['line', 'share of the total (computed here)']} rows={inv.computedHere.shares.map((s) => [s.label, F.share(s.share)])} />
      )}
      {usable(inv.intensity) && Array.isArray(inv.intensity.boundaries) && (
        <>
          <Lead>Intensity over both boundaries (both invented). Each carries its inventory&apos;s status.</Lead>
          {inv.intensity.boundaries.map((b, i) => (usable(b) ? (
            <div key={b.boundaryLabel}>
              <Tbl
                head={['boundary', 'denominator', 'unit', 'Scope 1', 'Scope 2', 'total', 'status']}
                rows={[[b.boundaryLabel, String(b.denominatorValue), b.unit, F.inten(b.scope1Intensity), F.inten(b.scope2Intensity), F.inten(b.totalIntensity), <Status key="s" reportable={b.reportable} because={b.notReportableBecause} />]]}
              />
              <Verbatim label="The comparability note">{b.comparabilityNote}</Verbatim>
            </div>
          ) : <Refused key={i} label="the intensity" reason={b && b.error} />))}
          <Refused label="an intensity with no boundary named" reason={inv.intensity.noBoundary} />
        </>
      )}
      {st && (
        <>
          <Lead>From a first pass to reportable: each step is a buildInventory call with one more gap closed.</Lead>
          <div className="flex flex-wrap gap-2 mt-2">
            {REPORTABLE_STEPS.map((s, i) => <Button key={s} active={k === i} onClick={() => onStep && onStep(i)}>{`${i + 1}. ${s}`}</Button>)}
          </div>
          <Tbl
            head={['step', 'lines', 'Scope 1 tCO2e', 'Scope 2 tCO2e', 'total tCO2e', 'computed', 'reportable', 'not reportable because']}
            rows={st.steps.map((s) => [s.step, String(s.inv.lines.length), F.t(s.inv.scope1Tonnes), F.t(s.inv.scope2Tonnes), F.t(s.inv.totalTonnes), yn(s.inv.computed), yn(s.inv.reportable), s.inv.notReportableBecause ? s.inv.notReportableBecause.join('; ') : 'none'])}
            highlight={(i) => i === k}
          />
          {k !== null && (
            <>
              {st.steps[k].flareError && <Refused label="the flare at this step" reason={st.steps[k].flareError} />}
              <Tbl
                head={['line at this step', 'blocked by, or missing']}
                rows={[
                  ...st.steps[k].inv.blockedLines.map((b) => [b.label, `blocked: ${b.reason}`]),
                  ...st.steps[k].inv.unsourcedLines.map((u) => [u.label, `unsourced: missing ${u.missing.join(' and ')}`]),
                ]}
              />
            </>
          )}
          {usable(st.withBad) && (
            <>
              <Lead>Two more lines added to the complete inventory, one with no registered factor and one on scope 3:</Lead>
              <Tbl head={['line', 'reason']} rows={st.withBad.blockedLines.map((b) => [b.label, b.reason])} />
              <Note>total tCO2e {F.t(st.withBad.totalTonnes)}; <Status reportable={st.withBad.reportable} because={st.withBad.notReportableBecause} /></Note>
            </>
          )}
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const startHeat = () => ({
  fuelKmolPerYear: S(IGBOGENE_HEATERS.fuelKmolPerYear), carbonPerKmolFuel: S(IGBOGENE_HEATERS.carbonPerKmolFuel), destructionEfficiencyFraction: S(IGBOGENE_HEATERS.destructionEfficiencyFraction),
});
const startFlare = () => ({
  fuelKmolPerYear: S(IGBOGENE_FLARE.fuelKmolPerYear), carbonPerKmolFuel: S(IGBOGENE_FLARE.carbonPerKmolFuel), destructionEfficiencyFraction: S(IGBOGENE_FLARE_DE),
});

const InventoryExplorer = ({ initialMode = 'inventory' }) => {
  const [mode, setMode] = useState(initialMode);
  const [setKey, setSetKey] = useState(COURSE_SET);
  const [heatIn, setHeatIn] = useState(startHeat);
  const [flIn, setFlIn] = useState(startFlare);
  const [step, setStep] = useState(4);

  const gwp = useMemo(() => safe(gwpSets), []);
  const heat = useMemo(() => safe(() => heaters(heatIn)), [heatIn]);
  const fl = useMemo(() => safe(() => flare(flIn)), [flIn]);
  const unit = useMemo(() => (mode === 'atoms' ? safe(atomUnit) : null), [mode]);
  const refusals = useMemo(() => (mode === 'atoms' ? safe(carbonRefusals) : null), [mode]);
  const sweep = useMemo(() => (mode === 'flare' ? safe(() => flareSweep(setKey, { fuelKmolPerYear: flIn.fuelKmolPerYear, carbonPerKmolFuel: flIn.carbonPerKmolFuel })) : null), [mode, setKey, flIn]);
  const onSets = useMemo(() => (mode === 'sets' ? safe(inventoryOnSets) : null), [mode]);
  const inv = useMemo(() => (mode === 'inventory' ? safe(() => inventory({ setKey, heaterInputs: heatIn, flareInputs: flIn })) : null), [mode, setKey, heatIn, flIn]);
  const steps = useMemo(() => (mode === 'inventory' ? safe(reportableSteps) : null), [mode]);

  return (
    <PanelShell
      title="Inventory explorer"
      subtitle="The IGBOGENE flow station and gas plant (an invented record): its fired heaters and flare by atom balance, its vented methane and its purchased power, rolled into one inventory. At the record's own inputs and the course set every figure is the one the lessons quote."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <GwpPicker gwp={gwp} setKey={setKey} onSet={setSetKey} />
      <div className="mt-3">
        {mode === 'atoms' && (
          <AtomMode
            heat={heat}
            fl={fl}
            heatIn={heatIn}
            flIn={flIn}
            onHeat={(key, v) => setHeatIn((x) => ({ ...x, [key]: v }))}
            onFlare={(key, v) => setFlIn((x) => ({ ...x, [key]: v }))}
            unit={unit}
            refusals={refusals}
          />
        )}
        {mode === 'flare' && <FlareMode sweep={sweep} />}
        {mode === 'sets' && <SetsMode gwp={gwp} onSets={onSets} setKey={setKey} />}
        {mode === 'inventory' && <InventoryMode inv={inv} steps={steps} step={step} onStep={setStep} flareDe={flIn.destructionEfficiencyFraction} onFlareDe={(v) => setFlIn((x) => ({ ...x, destructionEfficiencyFraction: v }))} />}
      </div>
      <Note>
        Every figure, flag and refusal on this page is a return value of the vendored carbonAbatement module through the
        teaching lab, printed at the digest&apos;s precision. Every flow, factor and efficiency is invented; the electricity
        factor is SYNTHETIC.
      </Note>
    </PanelShell>
  );
};

export default InventoryExplorer;
