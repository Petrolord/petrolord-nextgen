import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend,
} from 'recharts';
import {
  ISIOKPO_FUEL, ISIOKPO_HEATER, ISIOKPO_TRAP, ISIOKPO_CONDENSATE, ISIOKPO_DTMIN, ISIOKPO_DTMIN_CASE, TRAP_EXPONENTS, PROBES,
  combustion, excessAir, excessAirAt, stackLoss, stackLossCases, tuning, tuningCases, trap, trapCases, condensate, condensateCases,
  pinch, pinchCases, f10, yn,
} from './carbonLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, F, usable, Tbl, Refused, Verbatim, Here, Note, Lead, Empty, safe, Box, Slider, Button,
} from './panelBits';
import { PanelShell, SelectField, FieldGrid } from '@/components/course/panels/petrophysics/panelKit';

// Efficiency explorer, the Professional tier throughout.
//
// COMBUSTION FROM THE ANALYSIS. The Isiokpo fuel gas is five editable mole
// fractions; the stoichiometry and the mass balance are the engine's.
//
// THE STACK OXYGEN IS A SLIDER over the sweep, and it runs past the oxygen in
// air so the engine's refusal is one drag away. The stack losses are drawn on
// LHV and on HHV side by side, as two charts on two axes, because the two are
// different numbers for the same heater. The radiation loss is a required box.
//
// THE TUNING SAVING is the engine's ratio. The percentage-point shortcut is
// drawn beside it as the digest's contrast figure, computed here from the
// engine's two efficiencies, and it is never the answer. The floor is a
// required box, and a target below it is refused.
//
// THE TRAP'S EXPONENT is a choice of 1.135 and 1.3, and every required box
// refuses when blank. Condensate return takes the treatment cost as optional and
// shows the engine's floor note when it is left blank. The pinch takes its
// minimum approach from 10, 15 and 20 C, with the threshold case as a preset.

export const MODES = [
  ['fuel', 'The fuel gas: stoichiometry and the mass balance'],
  ['air', 'Excess air from the dry stack oxygen'],
  ['losses', 'Stack losses on LHV and on HHV'],
  ['tuning', 'What tuning the excess air is worth'],
  ['steam', 'The failed trap and condensate return'],
  ['pinch', 'The pinch by the problem table'],
];

const S = (v) => (v === null || v === undefined ? '' : String(v));

// ---------------------------------------------------------------------------

export const FuelMode = ({ comb, fuel, onFuel }) => {
  const rows = Array.isArray(fuel) ? fuel : ISIOKPO_FUEL.map(([c, y]) => [c, S(y)]);
  const boxes = (
    <div className="grid gap-2 grid-cols-2 sm:grid-cols-5">
      {rows.map(([c, y], i) => <Box key={c} label={`${c} mole fraction`} tag value={y} onChange={(v) => onFuel && onFuel(i, v)} />)}
    </div>
  );
  if (!usable(comb)) return <>{boxes}<Empty>The combustion reader has returned nothing.</Empty></>;
  const st = comb.st;
  return (
    <>
      {boxes}
      <Lead>combustionStoichiometry on the analysis, with the engine&apos;s typical heating values for each component. The engine renormalises the fractions.</Lead>
      {usable(st) ? (
        <Tbl
          head={['output', 'value', 'unit']}
          rows={[
            ['o2PerKmolFuel', F.frac(st.o2PerKmolFuel), 'kmol O2 per kmol fuel'],
            ['stoichAirPerKmolFuel', F.frac(st.stoichAirPerKmolFuel), 'kmol air per kmol fuel'],
            ['stoichAirKgPerKgFuel', F.frac(st.stoichAirKgPerKgFuel), 'kg air per kg fuel'],
            ['fuelMolarMassKgKmol', F.kg(st.fuelMolarMassKgKmol), 'kg per kmol'],
            ['products.co2PerKmolFuel', F.frac(st.products.co2PerKmolFuel), 'kmol per kmol fuel'],
            ['products.h2oPerKmolFuel', F.frac(st.products.h2oPerKmolFuel), 'kmol per kmol fuel'],
            ['products.airN2PerKmolFuel', F.frac(st.products.airN2PerKmolFuel), 'kmol per kmol fuel'],
            ['products.fuelN2PerKmolFuel', F.frac(st.products.fuelN2PerKmolFuel), 'kmol per kmol fuel'],
            ['lhvMJPerKmolFuel', F.kg(st.lhvMJPerKmolFuel), 'MJ per kmol fuel'],
            ['hhvMJPerKmolFuel', F.kg(st.hhvMJPerKmolFuel), 'MJ per kmol fuel'],
          ]}
        />
      ) : <Refused label="the stoichiometry" reason={st && st.error} />}
      {usable(comb.noCo2) && (
        <Note>With the CO2 taken out of the analysis and the rest renormalised, o2PerKmolFuel is {F.frac(comb.noCo2.o2PerKmolFuel)} and lhvMJPerKmolFuel {F.kg(comb.noCo2.lhvMJPerKmolFuel)}.</Note>
      )}
      {usable(comb.massBalance) && (
        <>
          <Lead>The mass balance at {comb.massBalance.o2} percent stack oxygen, per kmol of fuel. Air enters at AIR_MOLAR_MASS; the air&apos;s non-oxygen part leaves at ATMOSPHERIC_N2_MOLAR_MASS, which carries air&apos;s argon.</Lead>
          <Tbl
            head={['side', 'kg per kmol of fuel']}
            rows={[
              ['fuel plus air in', F.kg(comb.massBalance.inKg)],
              ['flue gas out (engine dry flue gas plus engine moisture)', F.kg(comb.massBalance.outKg)],
              ['out less in', <Here key="h">{F.frac(comb.massBalance.computedHere.outLessIn)}</Here>],
            ]}
          />
        </>
      )}
      {usable(comb.constants) && (
        <>
          <Note>
            O2_MOLE_FRACTION_DRY_AIR {comb.constants.O2_MOLE_FRACTION_DRY_AIR}, AIR_MOLAR_MASS {comb.constants.AIR_MOLAR_MASS},
            O2_MOLAR_MASS {comb.constants.O2_MOLAR_MASS}, ATMOSPHERIC_N2_MOLAR_MASS {F.kg(comb.constants.ATMOSPHERIC_N2_MOLAR_MASS)}.
          </Note>
          <Verbatim label="The engine's note on its fuel reference">{comb.constants.FUEL_REFERENCE_NOTE}</Verbatim>
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

export const AirMode = ({
  air, at, o2, onO2,
}) => {
  const slider = <Slider label="measured dry stack oxygen, percent" value={o2} min={0} max={21.5} step={0.1} onChange={onO2} />;
  if (!usable(air) || !Array.isArray(air.rows)) return <>{slider}<Empty>The excess air reader has returned nothing.</Empty></>;
  const data = air.rows.filter((r) => usable(r.r)).map((r) => ({ o2: r.o2, excess: r.r.excessAirPercent }));
  return (
    <>
      {slider}
      {usable(at) ? (
        <Tbl
          head={['at your reading', 'excess air percent', 'actual air kmol per kmol fuel', 'dry flue gas kmol per kmol fuel', 'wet flue gas kmol per kmol fuel']}
          rows={[[`${o2} percent`, F.pct(at.excessAirPercent), F.frac(at.actualAirPerKmolFuel), F.frac(at.dryFlueGasPerKmolFuel), F.frac(at.wetFlueGasPerKmolFuel)]]}
        />
      ) : <Refused label={`a dry stack oxygen of ${o2} percent`} reason={at && at.error} />}
      {air.assumption && <Verbatim label="The engine's assumption">{air.assumption}</Verbatim>}
      <div className="h-56 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="o2" type="number" domain={[0, 22]} tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} />
            {Number.isFinite(air.airOxygenPercent) && <ReferenceLine x={air.airOxygenPercent} stroke="#f87171" strokeDasharray="4 2" label={{ value: 'oxygen in air', fill: '#f87171', fontSize: 10, position: 'insideTopRight' }} />}
            {usable(at) && <ReferenceLine x={o2} stroke={SERIES[2]} />}
            <Line type="monotone" dataKey="excess" name="excess air percent" stroke={SERIES[0]} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['dry O2 percent', 'excess air percent', 'actual air', 'dry flue gas', 'wet flue gas']}
        rows={air.rows.map((r) => (usable(r.r)
          ? [String(r.o2), F.pct(r.r.excessAirPercent), F.frac(r.r.actualAirPerKmolFuel), F.frac(r.r.dryFlueGasPerKmolFuel), F.frac(r.r.wetFlueGasPerKmolFuel)]
          : [String(r.o2), r.r && r.r.error, '', '', '']))}
      />
      {Array.isArray(air.refusals) && <Tbl head={['the call', 'the engine says']} rows={air.refusals.map((r) => [r.call, r.error || 'answered'])} />}
    </>
  );
};

// ---------------------------------------------------------------------------

const LOSS_KEYS = [['Dry flue gas', SERIES[0]], ['Moisture from hydrogen', SERIES[1]], ['Radiation and convection', SERIES[3]], ['Unburned and other', SERIES[4]]];

const LossChart = ({ title, r }) => {
  if (!usable(r) || !Array.isArray(r.losses)) return <Refused label={title} reason={r && r.error} />;
  const row = { name: `${r.basis}` };
  r.losses.forEach((l) => { row[l.label] = l.percent; });
  return (
    <div>
      <p className="text-xs text-slate-300 mb-0">{title}: efficiency {F.pct(r.efficiencyPercent)} percent on {r.basis}</p>
      <div className="h-56 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[row]} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            {LOSS_KEYS.map(([k, c]) => <Bar key={k} dataKey={k} stackId="l" fill={c} isAnimationActive={false} />)}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Tbl head={['loss', 'percent']} rows={[...r.losses.map((l) => [l.label, F.pct(l.percent)]), ['total loss', F.pct(r.totalLossPercent)], ['efficiency', F.pct(r.efficiencyPercent)]]} />
      {r.moistureBasisNote && <Verbatim label={`The moisture note on ${r.basis}`}>{r.moistureBasisNote}</Verbatim>}
      {r.comparisonWarning && <Verbatim label="The comparison warning">{r.comparisonWarning}</Verbatim>}
    </div>
  );
};

export const LossMode = ({
  loss, cases, o2, onO2, rad, onRad,
}) => {
  const controls = (
    <div className="grid gap-3 sm:grid-cols-2">
      <Slider label="dry stack oxygen, percent" value={o2} min={0} max={21.5} step={0.1} onChange={onO2} />
      <Box label="radiation and convection loss, percent, off the vendor's chart (required)" tag value={rad} onChange={onRad} />
    </div>
  );
  if (!usable(loss)) return <>{controls}<Empty>The stack loss reader has returned nothing.</Empty></>;
  return (
    <>
      {controls}
      <Lead>
        stackLossEfficiency on the Isiokpo heater: stack {ISIOKPO_HEATER.stackTempC} C, combustion air {ISIOKPO_HEATER.combustionAirTempC} C,
        the engine&apos;s typical flue gas cp, vapour cp and latent heat. The same heater on the two bases, drawn on two axes.
      </Lead>
      <div className="grid gap-3 sm:grid-cols-2">
        <LossChart title="On LHV" r={loss.lhv} />
        <LossChart title="On HHV" r={loss.hhv} />
      </div>
      {usable(loss.computedHere) && Number.isFinite(loss.computedHere.lhvLessHhv) && (
        <Note><Here>The same heater at the same oxygen reads {F.pct(loss.lhv.efficiencyPercent)} percent on LHV and {F.pct(loss.hhv.efficiencyPercent)} percent on HHV, a difference of {F.pct(loss.computedHere.lhvLessHhv)} percentage points</Here></Note>
      )}
      {usable(cases) && Array.isArray(cases.rows) && (
        <>
          <Lead>At the record&apos;s current and target oxygen:</Lead>
          <Tbl
            head={['case', 'basis', 'excess air percent', 'dry flue gas', 'moisture', 'radiation', 'unburned', 'total loss', 'efficiency']}
            rows={cases.rows.map((c) => (usable(c.r)
              ? [c.label, c.r.basis, F.pct(c.r.excessAirPercent), F.pct(c.losses['Dry flue gas']), F.pct(c.losses['Moisture from hydrogen']), F.pct(c.losses['Radiation and convection']), F.pct(c.losses['Unburned and other']), F.pct(c.r.totalLossPercent), F.pct(c.r.efficiencyPercent)]
              : [c.label, c.r && c.r.error, '', '', '', '', '', '', '']))}
          />
          <Tbl head={['the call', 'the engine says']} rows={cases.refusals.map((r) => [r.call, r.error || 'answered'])} />
          <Tbl head={['radiation and convection loss percent', 'efficiency percent, LHV, current']} rows={cases.radiation.map((x) => [x.rad.toFixed(1), F.pct(x.r.efficiencyPercent)])} />
          <Tbl head={['property', 'typical', 'range', 'note']} rows={cases.properties.map((p) => [p.property, String(p.typical), p.range, p.note])} />
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

export const TuningMode = ({
  tune, cases, inputs, onInput,
}) => {
  const i = inputs && typeof inputs === 'object' && !inputs.error ? inputs : {};
  const boxes = (
    <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
      <Box label="current stack oxygen, percent" tag value={i.currentO2} onChange={(v) => onInput && onInput('currentO2', v)} />
      <Box label="target stack oxygen, percent" tag value={i.targetO2} onChange={(v) => onInput && onInput('targetO2', v)} />
      <Box label="minimum safe oxygen, declared after a combustion test (required)" tag value={i.floor} onChange={(v) => onInput && onInput('floor', v)} />
      <Box label="fuel a year, GJ on LHV" tag value={i.annualGJ} onChange={(v) => onInput && onInput('annualGJ', v)} />
    </div>
  );
  if (!usable(tune)) return <>{boxes}<Empty>The tuning reader has returned nothing.</Empty></>;
  const s = tune.save;
  const sc = usable(tune.computedHere) ? tune.computedHere.shortcut : null;
  return (
    <>
      {boxes}
      {usable(s) ? (
        <>
          <Tbl
            head={['output', 'value']}
            rows={[
              ['basis', s.basis],
              ['currentEfficiencyPercent', F.pct(s.currentEfficiencyPercent)],
              ['targetEfficiencyPercent', F.pct(s.targetEfficiencyPercent)],
              ['fuelSavingFraction', f10(s.fuelSavingFraction)],
              ['fuelSavingPercent', F.pct(s.fuelSavingPercent)],
              ['annualEnergySavedGJ', F.gj(s.annualEnergySavedGJ)],
            ]}
          />
          <Verbatim label="The engine's method">{s.method}</Verbatim>
          {sc && (
            <div className="mt-2 rounded-md border border-slate-700 p-2">
              <p className="text-xs text-slate-400 mb-0">
                The percentage-point shortcut, the digest&apos;s contrast figure and never the answer: a saving fraction of {f10(sc.fraction)},
                which is {F.gj(sc.gj)} GJ a year, {F.gj(sc.belowEngine)} GJ below the engine&apos;s saving (computed here from the
                engine&apos;s two efficiencies; the engine does not return it).
              </p>
            </div>
          )}
          {usable(tune.onHhv) && (
            <Note>On HHV the same tuning is a saving fraction of {f10(tune.onHhv.fuelSavingFraction)} (fuelSavingPercent {F.pct(tune.onHhv.fuelSavingPercent)}). The basis of the annual fuel figure is the caller&apos;s to match.</Note>
          )}
        </>
      ) : <Refused label="the tuning saving" reason={s && s.error} />}
      {usable(cases) && Array.isArray(cases.sweep) && (
        <>
          <Lead>The saving at a sweep of target readings, every one at or above the declared floor:</Lead>
          <Tbl
            head={['target O2 percent', 'target efficiency percent LHV', 'fuelSavingPercent', 'annualEnergySavedGJ']}
            rows={cases.sweep.map((x) => [x.o2.toFixed(1), F.pct(x.tgt.efficiencyPercent), F.pct(x.save.fuelSavingPercent), F.gj(x.save.annualEnergySavedGJ)])}
          />
          <Tbl head={['the call', 'the engine says']} rows={cases.refusals.map((r) => [r.call, r.error || 'answered'])} />
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const TRAP_BOXES = [
  ['orificeDiameterMm', 'orifice, mm'], ['upstreamPressureBarA', 'upstream pressure, bar a'], ['dischargeCoefficient', 'discharge coefficient (required)'],
  ['steamDensityKgM3', 'steam density, kg/m3'], ['hoursPerYear', 'hours in service a year (required)'], ['steamCostPerTonne', 'steam cost, USD a tonne'],
  ['steamEnergyMJPerTonne', 'steam energy, MJ a tonne'], ['boilerEfficiencyFraction', 'boiler efficiency, a fraction (required for fuel)'], ['emissionFactorKgCo2ePerGJ', 'fuel factor, kg CO2e per GJ'],
];
const COND_BOXES = [
  ['steamTonnesPerHour', 'steam, t an hour'], ['currentReturnFraction', 'current return'], ['targetReturnFraction', 'target return'],
  ['condensateTempC', 'condensate, C'], ['makeupTempC', 'makeup, C'], ['boilerEfficiencyFraction', 'boiler efficiency (required)'],
  ['fuelCostPerGJ', 'fuel, USD a GJ'], ['waterCostPerTonne', 'raw water, USD a tonne'], ['treatmentCostPerTonne', 'treatment, USD a tonne (optional)'],
  ['emissionFactorKgCo2ePerGJ', 'fuel factor, kg CO2e per GJ'], ['hoursPerYear', 'hours a year (required)'],
];

export const SteamMode = ({
  tr, cases, trapIn, onTrap, cond, condCases, condIn, onCond,
}) => {
  const ti = trapIn && typeof trapIn === 'object' && !trapIn.error ? trapIn : {};
  const ci = condIn && typeof condIn === 'object' && !condIn.error ? condIn : {};
  return (
    <>
      <Lead>One Isiokpo trap failed open. The isentropic exponent is a choice; every required box is refused when blank.</Lead>
      <div className="flex flex-wrap gap-2 mt-2">
        {[...TRAP_EXPONENTS.map(String), ''].map((k) => (
          <Button key={k || 'blank'} active={S(ti.specificHeatRatio) === k} onClick={() => onTrap && onTrap('specificHeatRatio', k)}>
            {k === '' ? 'exponent left blank' : `exponent ${k}${k === String(ISIOKPO_TRAP.specificHeatRatio) ? ' (dry saturated steam)' : ' (superheated)'}`}
          </Button>
        ))}
      </div>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-5 mt-2">
        {TRAP_BOXES.map(([k, label]) => <Box key={k} label={label} tag synthetic={k === 'emissionFactorKgCo2ePerGJ'} value={ti[k]} onChange={(v) => onTrap && onTrap(k, v)} />)}
      </div>
      {usable(tr) ? (
        <>
          <Tbl
            head={['kg an hour', 'tonnes a year', 'annual cost USD', 'annual fuel GJ', 'annual tCO2e', 'choked']}
            rows={[[F.kgh(tr.kgPerHour), F.t(tr.tonnesPerYear), F.usd(tr.annualCost), F.gj(tr.annualFuelGJ), F.t(tr.annualTonnesCo2e), yn(tr.choked)]]}
          />
          {tr.chokedNote && <Verbatim label="The choked-flow note">{tr.chokedNote}</Verbatim>}
          {tr.fuelNote && <Verbatim label="fuelNote">{tr.fuelNote}</Verbatim>}
          {tr.carbonNote && <Verbatim label="carbonNote">{tr.carbonNote}</Verbatim>}
        </>
      ) : <Refused label="the trap" reason={tr && tr.error} />}
      {usable(cases) && Array.isArray(cases.rows) && (
        <>
          <Tbl
            head={['isentropic exponent', 'kg an hour', 'tonnes a year', 'annual cost USD', 'annual fuel GJ', 'annual tCO2e']}
            rows={cases.rows.map((x) => [String(x.k), F.kgh(x.r.kgPerHour), F.t(x.r.tonnesPerYear), F.usd(x.r.annualCost), F.gj(x.r.annualFuelGJ), F.t(x.r.annualTonnesCo2e)])}
          />
          <Note><Here>At the superheated exponent the same trap loses {F.t(cases.computedHere.moreTonnes)} tonnes a year more, a ratio of {F.share(cases.computedHere.ratio)} to the saturated figure</Here></Note>
          <Tbl head={['the call', 'the engine says']} rows={cases.refusals.map((r) => [r.call, r.error || 'answered'])} />
        </>
      )}
      <Lead>Condensate return. The treatment cost is optional; left blank, the value is a floor and the engine says so.</Lead>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-6 mt-2">
        {COND_BOXES.map(([k, label]) => <Box key={k} label={label} tag synthetic={k === 'emissionFactorKgCo2ePerGJ'} value={ci[k]} onChange={(v) => onCond && onCond(k, v)} />)}
      </div>
      {usable(cond) ? (
        <>
          <Tbl
            head={['output', 'value']}
            rows={[
              ['extraCondensateTonnesPerYear', F.t(cond.extraCondensateTonnesPerYear)],
              ['energySavedGJPerYear', F.gj(cond.energySavedGJPerYear)],
              ...cond.components.map((c) => [c.label, F.usd(c.amount)]),
              ['annualValue', F.usd(cond.annualValue)],
              ['complete', yn(cond.complete)],
              ['annualTonnesCo2e', F.t(cond.annualTonnesCo2e)],
            ]}
          />
          {cond.valueNote && <Verbatim label="valueNote">{cond.valueNote}</Verbatim>}
        </>
      ) : <Refused label="condensate return" reason={cond && cond.error} />}
      {usable(condCases) && Array.isArray(condCases.refusals) && <Tbl head={['the call', 'the engine says']} rows={condCases.refusals.map((r) => [r.call, r.error || 'answered'])} />}
    </>
  );
};

// ---------------------------------------------------------------------------

export const PinchMode = ({
  p, cases, dtmin, onDtmin, preset, onPreset,
}) => {
  const controls = (
    <div className="flex flex-wrap gap-2">
      {ISIOKPO_DTMIN.map((d) => <Button key={d} active={preset !== 'threshold' && Number(dtmin) === d} onClick={() => { if (onPreset) onPreset('isiokpo'); if (onDtmin) onDtmin(d); }}>{`minimum approach ${d} C`}</Button>)}
      <Button active={preset === 'threshold'} onClick={() => onPreset && onPreset('threshold')}>the threshold problem</Button>
    </div>
  );
  if (!usable(p) || !Array.isArray(p.intervals)) return <>{controls}<Refused label="the pinch" reason={p && p.error} /></>;
  const gc = (p.grandComposite || []).map((g) => ({ heat: g.heatFlowKW, t: g.shiftedC }));
  return (
    <>
      {controls}
      <Lead>
        {preset === 'threshold'
          ? `One hot stream from 200 C to 50 C at 10 kW/K and one cold stream from 30 C to 60 C at 1 kW/K, at ${PROBES.threshold.minimumApproachC} C.`
          : `The four Isiokpo streams (invented) at a minimum approach of ${dtmin} C.`}
      </Lead>
      <Tbl
        head={['hot utility kW', 'cold utility kW', 'pinch hot C', 'pinch cold C', 'heat recovered kW', 'balance check', 'threshold problem']}
        rows={[[F.kw(p.hotUtilityKW), F.kw(p.coldUtilityKW), F.c(p.pinchHotC), F.c(p.pinchColdC), F.kw(p.heatRecoveredKW), F.kw(p.balanceCheck), yn(p.thresholdProblem)]]}
      />
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={gc} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="heat" type="number" tick={AXIS} label={{ value: 'heat flow kW', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -4 }} />
            <YAxis dataKey="t" type="number" domain={['auto', 'auto']} tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} />
            {p.pinchShiftedC !== null && p.pinchShiftedC !== undefined && <ReferenceLine y={p.pinchShiftedC} stroke={SERIES[2]} label={{ value: 'the pinch', fill: '#BFFF00', fontSize: 10, position: 'insideTopRight' }} />}
            <Line type="linear" dataKey="t" name="grand composite, shifted C" stroke={SERIES[0]} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['top shifted C', 'bottom shifted C', 'CP hot kW/K', 'CP cold kW/K', 'surplus kW', 'heat flow below kW']}
        rows={p.intervals.map((iv) => [F.c(iv.topShiftedC), F.c(iv.bottomShiftedC), F.frac(iv.cpHotKWperK), F.frac(iv.cpColdKWperK), F.kw(iv.surplusKW), F.kw(iv.cascadeKW)])}
      />
      {p.crossPinchNote && <Verbatim label="The engine's note">{p.crossPinchNote}</Verbatim>}
      {usable(cases) && Array.isArray(cases.rows) && (
        <>
          <Tbl
            head={['minimum approach C', 'hot utility kW', 'cold utility kW', 'pinch hot C', 'pinch cold C', 'heat recovered kW', 'hot duty kW', 'cold duty kW']}
            rows={cases.rows.map((x) => [String(x.d), F.kw(x.p.hotUtilityKW), F.kw(x.p.coldUtilityKW), F.c(x.p.pinchHotC), F.c(x.p.pinchColdC), F.kw(x.p.heatRecoveredKW), F.kw(x.p.totalHotStreamDutyKW), F.kw(x.p.totalColdStreamDutyKW)])}
          />
          <Tbl head={['the call', 'the engine says']} rows={cases.refusals.map((r) => [r.call, r.error || 'answered'])} />
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const startTrap = () => Object.fromEntries(Object.entries(ISIOKPO_TRAP).map(([k, v]) => [k, S(v)]));
const startCond = () => Object.fromEntries(Object.entries(ISIOKPO_CONDENSATE).map(([k, v]) => [k, S(v)]));
const startTune = () => ({
  currentO2: S(ISIOKPO_HEATER.currentO2Percent), targetO2: S(ISIOKPO_HEATER.targetO2Percent), floor: S(ISIOKPO_HEATER.minimumSafeO2Percent), annualGJ: S(ISIOKPO_HEATER.annualFuelEnergyGJ),
});

const EfficiencyExplorer = ({ initialMode = 'losses' }) => {
  const [mode, setMode] = useState(initialMode);
  const [fuel, setFuel] = useState(() => ISIOKPO_FUEL.map(([c, y]) => [c, S(y)]));
  const [o2, setO2] = useState(ISIOKPO_HEATER.currentO2Percent);
  const [rad, setRad] = useState(S(ISIOKPO_HEATER.radiationLossPercent));
  const [tuneIn, setTuneIn] = useState(startTune);
  const [trapIn, setTrapIn] = useState(startTrap);
  const [condIn, setCondIn] = useState(startCond);
  const [dtmin, setDtmin] = useState(ISIOKPO_DTMIN_CASE);
  const [preset, setPreset] = useState('isiokpo');

  const comb = useMemo(() => (mode === 'fuel' ? safe(() => combustion(fuel)) : null), [mode, fuel]);
  const air = useMemo(() => (mode === 'air' ? safe(() => excessAir(fuel)) : null), [mode, fuel]);
  const at = useMemo(() => (mode === 'air' ? safe(() => excessAirAt(o2, fuel)) : null), [mode, o2, fuel]);
  const loss = useMemo(() => (mode === 'losses' ? safe(() => stackLoss({ o2, radiationLossPercent: rad, fuel })) : null), [mode, o2, rad, fuel]);
  const lossCases = useMemo(() => (mode === 'losses' ? safe(stackLossCases) : null), [mode]);
  const tune = useMemo(() => (mode === 'tuning' ? safe(() => tuning({ ...tuneIn, radiationLossPercent: rad })) : null), [mode, tuneIn, rad]);
  const tuneCases = useMemo(() => (mode === 'tuning' ? safe(tuningCases) : null), [mode]);
  const tr = useMemo(() => (mode === 'steam' ? safe(() => trap(trapIn)) : null), [mode, trapIn]);
  const trCases = useMemo(() => (mode === 'steam' ? safe(trapCases) : null), [mode]);
  const cond = useMemo(() => (mode === 'steam' ? safe(() => condensate(condIn)) : null), [mode, condIn]);
  const condC = useMemo(() => (mode === 'steam' ? safe(condensateCases) : null), [mode]);
  const pc = useMemo(() => (mode === 'pinch' ? safe(pinchCases) : null), [mode]);
  const p = useMemo(() => {
    if (mode !== 'pinch') return null;
    return safe(() => (preset === 'threshold' ? pinchCases().threshold : pinch(dtmin)));
  }, [mode, dtmin, preset]);

  return (
    <PanelShell
      title="Efficiency explorer"
      subtitle="The ISIOKPO gas plant (an invented record): one fired heater and its fuel gas, a failed steam trap, its condensate system and four process streams. At the record's own inputs every figure is the one the lessons quote."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'fuel' && <FuelMode comb={comb} fuel={fuel} onFuel={(i, v) => setFuel((f) => f.map((x, k) => (k === i ? [x[0], v] : x)))} />}
        {mode === 'air' && <AirMode air={air} at={at} o2={o2} onO2={setO2} />}
        {mode === 'losses' && <LossMode loss={loss} cases={lossCases} o2={o2} onO2={setO2} rad={rad} onRad={setRad} />}
        {mode === 'tuning' && <TuningMode tune={tune} cases={tuneCases} inputs={tuneIn} onInput={(k, v) => setTuneIn((x) => ({ ...x, [k]: v }))} />}
        {mode === 'steam' && (
          <SteamMode
            tr={tr}
            cases={trCases}
            trapIn={trapIn}
            onTrap={(k, v) => setTrapIn((x) => ({ ...x, [k]: v }))}
            cond={cond}
            condCases={condC}
            condIn={condIn}
            onCond={(k, v) => setCondIn((x) => ({ ...x, [k]: v }))}
          />
        )}
        {mode === 'pinch' && <PinchMode p={p} cases={pc} dtmin={dtmin} onDtmin={setDtmin} preset={preset} onPreset={setPreset} />}
      </div>
      <Note>
        Every figure, basis and refusal on this page is a return value of the vendored energyEfficiency module through the
        teaching lab, printed at the digest&apos;s precision. Every flow, temperature, price and cost is invented; the fuel
        emission factor is SYNTHETIC. Money is in US dollars.
      </Note>
    </PanelShell>
  );
};

export default EfficiencyExplorer;
