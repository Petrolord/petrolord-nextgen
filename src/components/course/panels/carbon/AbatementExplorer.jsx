import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend,
} from 'recharts';
import {
  AGBOR_MEASURES, AGBOR_DISCOUNT_RATE, AGBOR_SAVING, AGBOR_ENERGY, CURVE_PRESETS, PATH_PRESETS, BASES,
  costTable, costRefusals, curve, curveSteps, path, pathRefusals, saving, savingCalls, energy, yn,
} from './carbonLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, F, usable, Tbl, Refused, Verbatim, Here, Status, Note, Lead, Empty, safe, Box, Button, Verdict,
} from './panelBits';
import { PanelShell, SelectField, FieldGrid } from '@/components/course/panels/petrophysics/panelKit';

// Abatement explorer, the Expert tier throughout.
//
// THE COST OF A TONNE. The six Agbor measures are editable: capital, savings,
// running cost, tonnes, life and start year, with the discount rate as a
// fraction. A blank capital, a blank rate and a rate typed as a percentage each
// come back as the engine's own refusal, with the measure named.
//
// THE CURVE is a step chart, cheapest first, widths in tonnes, with the
// weighted average drawn and the interacting measures listed. The target view
// shows the verdict and targetBasis exactly as the engine returns them, with
// the over-claim preset, and every source a measure acts on is listed as
// checked against its emission or unchecked. A refused measure is listed by the
// lab and by the engine whenever the engine names one.
//
// THE PATH is years against emissions and the straight-line target, the
// unabated gap shaded and named by the engine's own note, with the partial
// inventory and the unscheduled measure as presets. One saving is priced in
// money and carbon with its three bases declared, and the plant's energy
// intensity is compared with the peer until a stream is blanked.

export const MODES = [
  ['cost', 'The cost of a tonne abated'],
  ['curve', 'The marginal abatement cost curve'],
  ['target', 'The target, its verdict and the over-claim'],
  ['path', 'The path and its unabated gap'],
  ['saving', 'One saving in money and carbon, and energy intensity'],
];

const S = (v) => (v === null || v === undefined ? '' : String(v));
const FIELDS = [
  ['capitalCost', 'capital USD'], ['annualSavings', 'savings USD a year'], ['annualCost', 'running cost USD a year'],
  ['tonnesAbatedPerYear', 'tonnes a year'], ['lifeYears', 'life years'], ['startYear', 'start year'],
];

// ---------------------------------------------------------------------------

export const CostMode = ({
  table, refusals, measures, onMeasure, rate, onRate,
}) => {
  const ms = Array.isArray(measures) ? measures : [];
  const editor = (
    <>
      <div className="max-w-xs"><Box label="discount rate, a fraction (0.1 for ten percent)" tag value={rate} onChange={onRate} /></div>
      <div className="mt-2 overflow-x-auto">
        <table className="text-xs text-slate-300">
          <thead className="text-slate-500">
            <tr><th className="text-left pr-2">measure (acts on)</th>{FIELDS.map(([k, l]) => <th key={k} className="text-left pr-2 whitespace-nowrap">{l}</th>)}</tr>
          </thead>
          <tbody>
            {ms.map((m, i) => (
              <tr key={m.label}>
                <td className="pr-2 whitespace-nowrap">{m.label} ({(m.actsOn || []).join(', ')})</td>
                {FIELDS.map(([k]) => (
                  <td key={k} className="pr-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={S(m[k])}
                      onChange={(e) => onMeasure && onMeasure(i, k, e.target.value)}
                      className="w-24 bg-gray-700 text-white border border-gray-600 rounded h-7 text-xs px-1"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>Every capital, saving, cost and tonnage is invented for the course, in US dollars.</Note>
    </>
  );
  if (!usable(table) || !Array.isArray(table.rows)) return <>{editor}<Empty>The cost reader has returned nothing.</Empty></>;
  return (
    <>
      {editor}
      <Lead>abatementCost annualises the capital with a capital recovery factor at the rate. A negative cost per tonne means the measure pays for itself.</Lead>
      <Tbl
        head={['measure', 'capital recovery factor', 'annualised capital USD', 'net annual cost USD', 'cost per tonne USD', 'pays for itself', 'taken as 0 and named', 'cost per tonne at rate 0 USD', 'capital against one year (computed here)']}
        rows={table.rows.map((x) => (usable(x.r)
          ? [x.m.label, F.crf(x.r.capitalRecoveryFactor), F.usd(x.r.annualisedCapital), F.usd(x.r.netAnnualCost), F.usdt(x.r.costPerTonne), yn(x.r.paysForItself),
            x.r.assumedZero && x.r.assumedZero.length ? x.r.assumedZero.join(', ') : 'nothing',
            usable(x.atZero) ? F.usdt(x.atZero.costPerTonne) : 'refused', F.usdt(x.computedHere.oneYear)]
          : [x.m.label, `REFUSED: ${x.r && x.r.error}`, '', '', '', '', '', usable(x.atZero) ? F.usdt(x.atZero.costPerTonne) : 'refused', F.usdt(x.computedHere.oneYear)]))}
      />
      <Note>The capital set against one year is the course&apos;s contrast figure, computed here from the inputs; the engine refuses to compare a one-off cost with a recurring saving.</Note>
      {usable(refusals) && Array.isArray(refusals.rows) && (
        <>
          <Lead>What the cost of a tonne refuses and names, on {refusals.label}:</Lead>
          <Tbl head={['the call', 'the engine says']} rows={refusals.rows.map((r) => [r.call, r.error || 'answered'])} />
          <Tbl
            head={['the call', 'costPerTonne USD', 'capitalRecoveryFactor', 'assumedZero', 'paysForItself']}
            rows={[
              ['savings and running cost blank', F.usdt(refusals.named.costPerTonne), F.crf(refusals.named.capitalRecoveryFactor), (refusals.named.assumedZero || []).join(', '), yn(refusals.named.paysForItself)],
              ['capital 0 typed, no life and no rate', F.usdt(refusals.capitalZero.costPerTonne), F.crf(refusals.capitalZero.capitalRecoveryFactor), (refusals.capitalZero.assumedZero || []).join(', ') || 'nothing', yn(refusals.capitalZero.paysForItself)],
              ['an abatement of 0', F.usdt(refusals.abatementZero.costPerTonne), F.crf(refusals.abatementZero.capitalRecoveryFactor), (refusals.abatementZero.assumedZero || []).join(', ') || 'nothing', yn(refusals.abatementZero.paysForItself)],
            ]}
          />
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const RefusedMeasures = ({ cv }) => (
  <>
    {(cv.refusedHere || []).map((r) => <Refused key={`h${r.label}`} label={`${r.label}, left off the curve`} reason={r.reason} />)}
    {(cv.refusedByEngine || []).length > 0 && (
      <Tbl head={['refused measure the curve names', 'reason']} rows={cv.refusedByEngine.map((r) => [r.label || 'unnamed', r.reason || 'none given'])} />
    )}
  </>
);

export const CurveMode = ({ cv }) => {
  if (!usable(cv) || !usable(cv.curve)) return <Empty>The curve reader has returned nothing.</Empty>;
  const c = cv.curve;
  const pts = curveSteps(c);
  return (
    <>
      <Lead>abatementCurve: the measures cheapest first, each step as wide as its tonnes a year and as high as its cost per tonne.</Lead>
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={pts} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="tonnes" type="number" domain={[0, 'dataMax']} tick={AXIS} label={{ value: 'tonnes abated a year', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -4 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} />
            <ReferenceLine y={0} stroke="#64748b" />
            {Number.isFinite(c.weightedAverageCostPerTonne) && <ReferenceLine y={c.weightedAverageCostPerTonne} stroke={SERIES[3]} strokeDasharray="4 2" label={{ value: 'weighted average', fill: '#fbbf24', fontSize: 10, position: 'insideTopRight' }} />}
            <Area type="stepAfter" dataKey="cost" name="cost per tonne USD" stroke={SERIES[0]} fill={SERIES[0]} fillOpacity={0.25} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['order', 'measure', 'cost per tonne USD', 'tonnes a year', 'cumulative start t', 'cumulative end t', 'pays for itself', 'interacts']}
        rows={c.steps.map((s, i) => [String(i + 1), s.label, F.usdt(s.costPerTonne), F.t(s.tonnesAbatedPerYear), F.t(s.cumulativeStartTonnes), F.t(s.cumulativeEndTonnes), yn(s.paysForItself),
          (c.interactions || []).some((x) => x.measures.includes(s.label)) ? 'yes' : ''])}
      />
      <Tbl
        head={['output', 'value']}
        rows={[
          ['totalAbatementTonnes', F.t(c.totalAbatementTonnes)],
          ['paysForItselfTonnes', F.t(c.paysForItselfTonnes)],
          ['paysForItselfMeasures', (c.paysForItselfMeasures || []).join('; ') || 'none'],
          ['netAnnualCostOfAll USD', F.usd(c.netAnnualCostOfAll)],
          ['weightedAverageCostPerTonne USD', F.usdt(c.weightedAverageCostPerTonne)],
          ['additive', yn(c.additive)],
          ['the plain mean of the costs per tonne', <Here key="h">{F.usdt(cv.computedHere.plainMean)}</Here>],
        ]}
      />
      {(c.interactions || []).length > 0 && <Tbl head={['source', 'measures that interact on it']} rows={c.interactions.map((x) => [x.sourceId, x.measures.join('; ')])} />}
      {c.interactionNote && <Verbatim label="The interaction note">{c.interactionNote}</Verbatim>}
      <RefusedMeasures cv={cv} />
    </>
  );
};

// ---------------------------------------------------------------------------

export const TargetMode = ({ cv, preset, onPreset }) => {
  const buttons = (
    <div className="flex flex-wrap gap-2">
      {CURVE_PRESETS.map(([k, label]) => <Button key={k} active={preset === k} onClick={() => onPreset && onPreset(k)}>{label}</Button>)}
    </div>
  );
  if (!usable(cv) || !usable(cv.curve)) return <>{buttons}<Empty>The target reader has returned nothing.</Empty></>;
  const c = cv.curve;
  return (
    <>
      {buttons}
      <Lead>
        The target is 30 percent of the Agbor inventory total, computed here as the Carbon Studio computes it. The verdict
        and its basis are the engine&apos;s, shown as returned.
      </Lead>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <Verdict value={c.meetsTarget} />
        <span className="text-xs text-slate-300">targetBasis: <span className="font-mono">{c.targetBasis === null || c.targetBasis === undefined ? 'none' : `"${c.targetBasis}"`}</span></span>
      </div>
      <Tbl
        head={['total abatement t', 'target t', 'meetsTarget', 'targetBasis', 'residual to target t']}
        rows={[[F.t(c.totalAbatementTonnes), F.t(c.targetTonnes), yn(c.meetsTarget), c.targetBasis || 'none', F.t(c.residualToTargetTonnes)]]}
      />
      <Tbl
        head={['source a measure acts on', 'emission passed to the curve tCO2e', 'checked', 'measures']}
        rows={(cv.sources || []).map((s) => [s.id, s.checked ? F.t(s.emitted) : 'none', s.checked ? 'checked against its emission' : 'unchecked: no emission passed', s.measures.join('; ')])}
      />
      <Tbl
        head={['over-claim', 'claimed t', 'emitted t', 'measures']}
        rows={(c.overClaims || []).length ? c.overClaims.map((o) => [o.sourceId, F.t(o.claimedTonnes), F.t(o.emittedTonnes), (o.measures || []).join('; ')]) : [['none', '', '', '']]}
      />
      {c.interactionNote && <Verbatim label="The interaction note">{c.interactionNote}</Verbatim>}
      <RefusedMeasures cv={cv} />
    </>
  );
};

// ---------------------------------------------------------------------------

export const PathMode = ({ p, refusals, preset, onPreset }) => {
  const buttons = (
    <div className="flex flex-wrap gap-2">
      {PATH_PRESETS.map(([k, label]) => <Button key={k} active={preset === k} onClick={() => onPreset && onPreset(k)}>{label}</Button>)}
    </div>
  );
  if (!usable(p) || !usable(p.path) || !Array.isArray(p.path.rows)) return <>{buttons}<Refused label="the path" reason={p && p.path && p.path.error} /></>;
  const data = p.path.rows.map((r) => ({
    year: r.year, emissions: r.emissionsTonnes, target: r.targetTonnes, base: r.targetTonnes, gap: r.unabatedGapTonnes,
  }));
  return (
    <>
      {buttons}
      <Lead>
        decarbonisationPath on {p.presetLabel}: baseline {F.t(p.baseline)} tCO2e, <Status reportable={p.reportable} because={p.notReportableBecause} />. The
        target line falls straight from the baseline to 30 percent below it, as the Carbon Studio draws it (computed here); each
        measure counts in full from its start year.
      </Lead>
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis tick={AXIS} domain={['auto', 'auto']} />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="linear" dataKey="base" stackId="g" stroke="none" fill="transparent" legendType="none" isAnimationActive={false} />
            <Area type="linear" dataKey="gap" name="unabated gap, no measure identified" stackId="g" stroke={SERIES[5]} fill={SERIES[5]} fillOpacity={0.35} isAnimationActive={false} />
            <Line type="linear" dataKey="emissions" name="emissions t" stroke={SERIES[0]} isAnimationActive={false} />
            <Line type="linear" dataKey="target" name="target t" stroke={SERIES[2]} strokeDasharray="5 3" isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['year', 'abated t', 'emissions t', 'target t', 'unabated gap t', 'measures live']}
        rows={p.path.rows.map((r) => [String(r.year), F.t(r.abatedTonnes), F.t(r.emissionsTonnes), F.t(r.targetTonnes), F.t(r.unabatedGapTonnes), r.measuresLive.length ? r.measuresLive.join('; ') : 'none'])}
        highlight={(i) => p.path.rows[i].unabatedGapTonnes > 0}
      />
      <Note>
        firstShortfallYear: {p.path.firstShortfallYear ?? 'none'}. finalGapTonnes: {F.t(p.path.finalGapTonnes)}. unscheduledMeasures:{' '}
        {(p.path.unscheduledMeasures || []).length ? p.path.unscheduledMeasures.map((u) => `${u.label} (${u.reason})`).join('; ') : 'none'}.
      </Note>
      {p.path.gapNote && <Verbatim label="The gap note">{p.path.gapNote}</Verbatim>}
      {usable(refusals) && (
        <>
          <Refused label="a baseline of 0" reason={refusals.zeroBaseline} />
          <Refused label="an end year before the start year" reason={refusals.reversedYears} />
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const SAVING_BOXES = [
  ['energySavedGJ', 'energy saved, GJ a year'], ['fuelCostPerGJ', 'fuel, USD a GJ'], ['emissionFactorKgCo2ePerGJ', 'fuel factor, kg CO2e per GJ'],
  ['implementationCost', 'implementation cost USD'], ['lifeYears', 'life years'], ['discountRate', 'discount rate, a fraction'],
];
const BASIS_KEYS = [['energyBasis', 'the saving'], ['fuelCostBasis', 'the fuel price'], ['emissionFactorBasis', 'the emission factor']];

export const SavingMode = ({
  sv, calls, inputs, onInput, en, blank, onBlank,
}) => {
  const i = inputs && typeof inputs === 'object' && !inputs.error ? inputs : {};
  const controls = (
    <>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-6">
        {SAVING_BOXES.map(([k, label]) => <Box key={k} label={label} tag synthetic={k === 'emissionFactorKgCo2ePerGJ'} value={i[k]} onChange={(v) => onInput && onInput(k, v)} />)}
      </div>
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-3 mt-2">
        {BASIS_KEYS.map(([k, label]) => (
          <SelectField key={k} label={`basis of ${label}`} value={S(i[k])} onChange={(v) => onInput && onInput(k, v)} options={[...BASES.map((b) => [b, b]), ['', 'not declared']]} />
        ))}
      </div>
    </>
  );
  return (
    <>
      {controls}
      {usable(sv) && usable(sv.ps) ? (
        <>
          <Tbl
            head={['output', 'value']}
            rows={[
              ['annualValue USD', F.usd(sv.ps.annualValue)],
              ['annualTonnesCo2e', F.t(sv.ps.annualTonnesCo2e)],
              ['simplePaybackYears', F.frac(sv.ps.simplePaybackYears)],
              ['costPerTonneCo2e USD', F.usdt(sv.ps.costPerTonneCo2e)],
              ['basis', sv.ps.basis || 'none'],
              ['the whole cost against one year', <Here key="h">{F.usdt(sv.computedHere.oneYear)}</Here>],
            ]}
          />
          <Note>The cost per tonne is carbonAbatement.abatementCost, with the implementation cost as capital, the annual value as the saving and the annual tonnes as the abatement.</Note>
          {sv.ps.costPerTonneNote && <Verbatim label="costPerTonneNote">{sv.ps.costPerTonneNote}</Verbatim>}
          {sv.ps.carbonNote && <Verbatim label="carbonNote">{sv.ps.carbonNote}</Verbatim>}
          {sv.ps.basisNote && <Verbatim label="basisNote">{sv.ps.basisNote}</Verbatim>}
          {sv.ps.valueNote && <Verbatim label="valueNote">{sv.ps.valueNote}</Verbatim>}
        </>
      ) : <Refused label="the priced saving" reason={sv && sv.ps && sv.ps.error} />}
      {usable(calls) && (
        <Tbl
          head={['the call', 'what comes back']}
          rows={[
            ['no life and no rate', `costPerTonneCo2e ${F.usdt(calls.noLife.costPerTonneCo2e)}; ${calls.noLife.note}`],
            ['no emission factor', `annualTonnesCo2e ${F.t(calls.noFactor.annualTonnesCo2e)}; ${calls.noFactor.note}`],
            ['no basis declared', calls.noBasis.note || 'none'],
            ['saving on LHV, factor on HHV', `REFUSED: ${calls.mixed}`],
            ['saving blank', `REFUSED: ${calls.blank}`],
          ]}
        />
      )}
      <Lead>
        Agbor&apos;s energy intensity against a peer figure of {AGBOR_ENERGY.peerIntensityMJPerTonne} MJ a tonne that Agbor has the right to
        use (invented). Blank a stream and the engine stops comparing.
      </Lead>
      <div className="max-w-xs">
        <SelectField label="stream left blank" value={blank || ''} onChange={onBlank || (() => {})} options={[['', 'none, all three given'], ...AGBOR_ENERGY.streams.map((s) => [s.label, s.label])]} />
      </div>
      {usable(en) ? (
        <>
          <Tbl head={['stream', 'GJ', 'share']} rows={en.streams.map((s) => [s.label, F.gj(s.energyGJ), F.share(s.share)])} />
          <Tbl
            head={['complete', 'total GJ', 'intensity MJ per tonne', 'versus peer', 'gap MJ per tonne']}
            rows={[[yn(en.complete), F.gj(en.totalEnergyGJ), F.mjt(en.intensityMJPerTonne), F.frac(en.versusPeer), F.mjt(en.gapMJPerTonne)]]}
          />
          {en.peerNote && <Verbatim label="peerNote">{en.peerNote}</Verbatim>}
          {en.disclaimer && <Verbatim label="The disclaimer">{en.disclaimer}</Verbatim>}
        </>
      ) : <Refused label="the energy intensity" reason={en && en.error} />}
    </>
  );
};

// ---------------------------------------------------------------------------

const startMeasures = () => AGBOR_MEASURES.map((m) => ({ ...m, ...Object.fromEntries(FIELDS.map(([k]) => [k, S(m[k])])) }));
const startSaving = () => ({
  ...Object.fromEntries(SAVING_BOXES.map(([k]) => [k, S(AGBOR_SAVING[k])])), energyBasis: 'LHV', fuelCostBasis: 'LHV', emissionFactorBasis: 'LHV',
});

const AbatementExplorer = ({ initialMode = 'curve' }) => {
  const [mode, setMode] = useState(initialMode);
  const [measures, setMeasures] = useState(startMeasures);
  const [rate, setRate] = useState(S(AGBOR_DISCOUNT_RATE));
  const [preset, setPreset] = useState('costed');
  const [pathPreset, setPathPreset] = useState('full');
  const [savIn, setSavIn] = useState(startSaving);
  const [blank, setBlank] = useState('');

  const table = useMemo(() => (mode === 'cost' ? safe(() => costTable(measures, rate)) : null), [mode, measures, rate]);
  const refusals = useMemo(() => (mode === 'cost' ? safe(costRefusals) : null), [mode]);
  const cv = useMemo(() => (mode === 'curve' || mode === 'target' ? safe(() => curve({ measures, rate, preset: mode === 'curve' ? 'costed' : preset })) : null), [mode, measures, rate, preset]);
  const p = useMemo(() => (mode === 'path' ? safe(() => path(pathPreset, measures)) : null), [mode, pathPreset, measures]);
  const pr = useMemo(() => (mode === 'path' ? safe(pathRefusals) : null), [mode]);
  const sv = useMemo(() => (mode === 'saving' ? safe(() => saving(savIn)) : null), [mode, savIn]);
  const calls = useMemo(() => (mode === 'saving' ? safe(savingCalls) : null), [mode]);
  const en = useMemo(() => (mode === 'saving' ? safe(() => energy({ blank: blank || null })) : null), [mode, blank]);

  return (
    <PanelShell
      title="Abatement explorer"
      subtitle="The AGBOR gas processing and distribution complex (an invented record): six abatement measures, a marginal abatement cost curve, a target and a path, one saving priced in money and carbon, and the plant's energy intensity. At the record's own inputs every figure is the one the lessons quote. Money is in US dollars."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'cost' && (
          <CostMode
            table={table}
            refusals={refusals}
            measures={measures}
            onMeasure={(i, k, v) => setMeasures((ms) => ms.map((m, j) => (j === i ? { ...m, [k]: v } : m)))}
            rate={rate}
            onRate={setRate}
          />
        )}
        {mode === 'curve' && <CurveMode cv={cv} />}
        {mode === 'target' && <TargetMode cv={cv} preset={preset} onPreset={setPreset} />}
        {mode === 'path' && <PathMode p={p} refusals={pr} preset={pathPreset} onPreset={setPathPreset} />}
        {mode === 'saving' && <SavingMode sv={sv} calls={calls} inputs={savIn} onInput={(k, v) => setSavIn((x) => ({ ...x, [k]: v }))} en={en} blank={blank} onBlank={setBlank} />}
      </div>
      <Note>
        Every figure, verdict and refusal on this page is a return value of the vendored carbonAbatement and energyEfficiency
        modules through the teaching lab, printed at the lessons&apos; precision. The measures you edit in the first view carry
        into the curve, the target and the path. Every cost, saving and factor is invented; the fuel factor is SYNTHETIC.
      </Note>
    </PanelShell>
  );
};

export default AbatementExplorer;
