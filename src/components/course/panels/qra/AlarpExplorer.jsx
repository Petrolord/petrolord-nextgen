import React, { useMemo, useState } from 'react';
import {
  alarp, costBenefit, parseNumber, parseRows, alarpLadder, snap, firewall, checklist, PRESETS, STREAMS,
} from './qraLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  two, six, ex, word, Tbl, TextRows, Refusal, Declared, safe,
} from './panelBits';

// The ALARP and cost-benefit explorer (Expert): the tolerability region of an
// individual risk, and the gross disproportion test of a risk reduction
// measure with its implied cost of averting a fatality. Every figure is a
// return value of the vendored engine through qraLab, on the teaching streams
// or on what the learner types. The value of preventing a fatality, the
// disproportion factor and every rate are the analyst's inputs; the engine
// invents none of them and has no default for any.

export const MODES = [
  ['band', 'The ALARP region of an individual risk'],
  ['cba', 'A measure through the gross disproportion test'],
  ['conventions', 'One measure under three discounting conventions'],
];

const THRESHOLDS = [
  ...PRESETS.tolerability.map((k) => [k, `the preset ${k}`]),
  ['own', 'thresholds of my own'],
];

export const BandMode = ({ t }) => {
  const [ir, setIr] = useState('0.00002');
  const [preset, setPreset] = useState(PRESETS.tolerability[0]);
  const [upper, setUpper] = useState('');
  const [lower, setLower] = useState('');
  const r = useMemo(() => alarp({
    individualRiskPerYr: parseNumber(ir),
    thresholds: preset === 'own' ? { unacceptableAbovePerYr: parseNumber(upper), broadlyAcceptableAtOrBelowPerYr: parseNumber(lower) } : preset,
  }), [ir, preset, upper, lower]);
  return (
    <>
      <FieldGrid>
        <NumField label="Individual risk, per year" value={ir} onChange={setIr} />
        <SelectField label="Thresholds" value={preset} onChange={setPreset} options={THRESHOLDS} />
        {preset === 'own' && <NumField label="Unacceptable above, per year" value={upper} onChange={setUpper} />}
        {preset === 'own' && <NumField label="Broadly acceptable at or below, per year" value={lower} onChange={setLower} />}
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <>
          <TileGrid>
            <Tile label="Region" value={r.band} />
            <Tile label="Boundary touched" value={word(r.atBoundary)} />
            <Tile label="ALARP demonstration required" value={String(r.alarpDemonstrationRequired)} />
            <Tile label="Over the upper limit" value={six(r.ratioToUnacceptable)} />
            <Tile label="Over the lower limit" value={six(r.ratioToBroadlyAcceptable)} />
          </TileGrid>
          <Declared title="THE BOUNDARY, IN THE ENGINE'S WORDS">{r.basis.boundary}</Declared>
        </>
      )}
      {t && (
        <>
          <Note>Individual risks against both presets, the exact thresholds included.</Note>
          <Tbl
            head={['individual risk per year', 'workers', 'boundary', 'the public', 'boundary']}
            rows={t.l.map((x) => [x.individualRiskPerYr === 0 ? '0' : ex(x.individualRiskPerYr), x.workers.band, word(x.workers.atBoundary), x.publicBand.band, word(x.publicBand.atBoundary)])}
          />
          <Note>Products that are a threshold on paper and land a hair above it in double precision. The snap keeps each on its threshold.</Note>
          <Tbl head={['product', 'in double', 'preset', 'region', 'boundary']} rows={t.s.map((x) => [x.factors, x.double, x.preset, x.band, word(x.atBoundary)])} />
        </>
      )}
    </>
  );
};

const HARM_KEYS = ['expectedCasesPerYr', 'valuePerCase'];

export const CbaMode = ({ t }) => {
  const F = STREAMS.EDIKAN_FIREWALL;
  const [dpll, setDpll] = useState(String(F.deltaPllPerYr));
  const [vpf, setVpf] = useState(String(F.vpf));
  const [harms, setHarms] = useState('');
  const [life, setLife] = useState(String(F.lifetimeYears));
  const [capital, setCapital] = useState(String(F.capitalCost));
  const [annual, setAnnual] = useState(String(F.annualCost));
  const [df, setDf] = useState(String(F.disproportionFactor));
  const [rb, setRb] = useState('0');
  const [rc, setRc] = useState('0');
  const [g, setG] = useState('0');
  const r = useMemo(() => costBenefit({
    deltaPllPerYr: parseNumber(dpll),
    vpf: parseNumber(vpf),
    otherHarms: parseRows(harms, HARM_KEYS).rows,
    lifetimeYears: parseNumber(life),
    capitalCost: parseNumber(capital),
    annualCost: parseNumber(annual),
    disproportionFactor: parseNumber(df),
    benefitDiscountRate: parseNumber(rb),
    costDiscountRate: parseNumber(rc),
    benefitGrowthRate: parseNumber(g),
  }), [dpll, vpf, harms, life, capital, annual, df, rb, rc, g]);
  return (
    <>
      <FieldGrid>
        <NumField label="PLL reduction, fatalities per year" value={dpll} onChange={setDpll} />
        <NumField label="VPF, value of preventing a fatality" value={vpf} onChange={setVpf} />
        <NumField label="Life, whole years" value={life} onChange={setLife} />
        <NumField label="Capital cost at year 0" value={capital} onChange={setCapital} />
        <NumField label="Cost each year" value={annual} onChange={setAnnual} />
        <NumField label="Disproportion factor" value={df} onChange={setDf} />
        <NumField label="Benefit discount rate (0.015 for 1.5 percent)" value={rb} onChange={setRb} />
        <NumField label="Cost discount rate" value={rc} onChange={setRc} />
        <NumField label="Benefit growth rate" value={g} onChange={setG} />
        <TextRows label="Other harms prevented, one per line: name, cases a year, value per case (blank for none)" value={harms} onChange={setHarms} rows={3} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <>
          <TileGrid>
            <Tile label="Present value of the benefit" value={two(r.presentValueBenefit)} />
            <Tile label="Present value of the cost" value={two(r.presentValueCost)} />
            <Tile label="Cost over benefit" value={six(r.costToBenefitRatio)} />
            <Tile label="ICAF, cost per fatality prevented" value={two(r.costPerFatalityPrevented)} />
            <Tile label="Largest reasonably practicable cost" value={two(r.maximumReasonablyPracticableCost)} />
            <Tile label="Verdict" value={r.verdict} />
            <Tile label="At the boundary" value={String(r.atBoundary)} />
          </TileGrid>
          <Declared title="THE TEST, IN THE ENGINE'S WORDS">{r.basis.model}</Declared>
          <Declared title="THE DISCOUNTING, IN THE ENGINE'S WORDS">{r.basis.discounting}</Declared>
        </>
      )}
      {t && (
        <>
          <Note>The published CBA checklist example, from the vendored golden: printed against computed, and the verdict its rounded limit gives.</Note>
          <Tbl
            head={['figure', 'printed', 'engine']}
            rows={[
              ['total benefit', String(t.k.printed.total), two(t.k.presentValueBenefit)],
              ['largest reasonable cost at DF 10', String(t.k.printed.maxCost), two(t.k.maximumReasonablyPracticableCost)],
              ['verdict at the printed limit', '', t.k.verdict],
            ]}
          />
        </>
      )}
    </>
  );
};

export const ConventionsMode = ({ t }) => (
  <>
    <Declared title="TWO HSE CONVENTIONS">
      R2P2 discounts at 6 percent and uprates benefits by 4 percent a year; the 2003 CBA checklist discounts benefits at
      no more than 1.5 percent and costs at no less than 3.5 percent. Every rate is an input, and each defaults to zero.
    </Declared>
    {t && (
      <>
        <Tbl
          head={['convention', 'benefit', 'cost', 'cost over benefit', 'ICAF', 'verdict']}
          rows={t.f.conventions.map((x) => [x.label, two(x.presentValueBenefit), two(x.presentValueCost), six(x.costToBenefitRatio), two(x.icaf), x.verdict])}
        />
        <Note>The same measure, undiscounted, at five disproportion factors.</Note>
        <Tbl head={['DF', 'cost over benefit', 'largest reasonable cost', 'verdict']} rows={t.f.sweep.map((x) => [String(x.disproportionFactor), six(x.costToBenefitRatio), two(x.maximumReasonablyPracticableCost), x.verdict])} />
      </>
    )}
  </>
);

const AlarpExplorer = ({ initialMode = 'band' }) => {
  const [mode, setMode] = useState(initialMode);
  const tBand = useMemo(() => (mode === 'band' ? safe(() => ({ l: alarpLadder(), s: snap() })) : null), [mode]);
  const tCba = useMemo(() => (mode === 'cba' ? safe(() => ({ k: checklist() })) : null), [mode]);
  const tConv = useMemo(() => (mode === 'conventions' ? safe(() => ({ f: firewall() })) : null), [mode]);
  return (
    <PanelShell
      title="ALARP and cost-benefit explorer"
      subtitle="The region an individual risk falls in, and whether a further measure costs grossly more than it prevents. Every value, rate and factor is typed: the engine has no default for any of them."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'band' && <BandMode t={tBand} />}
        {mode === 'cba' && <CbaMode t={tCba} />}
        {mode === 'conventions' && <ConventionsMode t={tConv} />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored QRA engine. The HSE values of preventing a fatality are
        published for illustration only.
      </Note>
    </PanelShell>
  );
};

export default AlarpExplorer;
