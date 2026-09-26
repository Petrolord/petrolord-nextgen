import React, { useState } from 'react';
import {
  PIA_TERRAINS, DATASET, CASE_NAMES, parseNumber, parseJson, pretty,
  hctRateOf, allowanceOf, capitalFractionOf, ledgerOf,
} from './piaLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, TextField, Refusal, EngineNote,
} from './panelBits';

// The hydrocarbon tax calculator (Professional): the hydrocarbon tax as a
// system. The rate by terrain, licence and lease; the Sixth Schedule
// production allowance with the new-lease cap; the capital allowance by the law
// of the year; and the tax base, the cost price ratio and companies income tax
// on a ledger. Every figure is a return value of the vendored engine
// (engines/economics/cashflow.ts) through piaLab. This is the course's own
// calculator: there is no Suite app for this course.

export const MODES = [
  ['rate', 'The hydrocarbon tax rate'],
  ['allowance', 'The production allowance'],
  ['capital', 'The capital allowance by year of life'],
  ['base', 'The tax base and the cost price ratio on a ledger'],
  ['cit', 'Companies income tax on a ledger'],
];

const TERRAIN_OPTIONS = PIA_TERRAINS.map((t) => [t, t]);
const FRAMEWORKS = [['pia_only', 'a year under the Act alone'], ['nta_2025', 'a year under the Nigeria Tax Act 2025']];

export const RateMode = () => {
  const [terrain, setTerrain] = useState('onshore');
  const [licenseType, setLicense] = useState('PML');
  const [leaseStatus, setLease] = useState('converted');
  const [marginal, setMarginal] = useState('false');
  const [framework, setFramework] = useState('pia_only');
  const [interpretation, setInterp] = useState('');
  const [custom, setCustom] = useState('');
  const [newRate, setNewRate] = useState('');
  const r = hctRateOf({
    terrain, licenseType, leaseStatus, marginal: marginal === 'true', framework,
    interpretation: interpretation || null, customRatePct: parseNumber(custom) ?? null, newPmlRatePct: parseNumber(newRate) ?? null,
  });
  return (
    <>
      <FieldGrid>
        <SelectField label="Terrain" value={terrain} onChange={setTerrain} options={TERRAIN_OPTIONS} />
        <SelectField label="Licence" value={licenseType} onChange={setLicense} options={[['PML', 'PML'], ['PPL', 'PPL']]} />
        <SelectField label="Lease status" value={leaseStatus} onChange={setLease} options={[['converted', 'converted'], ['new', 'new']]} />
        <SelectField label="Producing marginal field converted under s.94(1)" value={marginal} onChange={setMarginal} options={[['false', 'no'], ['true', 'yes']]} />
        <SelectField label="Framework of the year" value={framework} onChange={setFramework} options={FRAMEWORKS} />
        <SelectField label="Deep offshore reading (NTA years)" value={interpretation} onChange={setInterp} options={[['', 'none stated'], ['conservative_zero', 'conservative_zero'], ['aggressive_pml_30', 'aggressive_pml_30'], ['custom', 'custom']]} />
        <NumField label="Custom deep offshore rate, percent" value={custom} onChange={setCustom} />
        <NumField label="Stated new-lease rate (15 or 30)" value={newRate} onChange={setNewRate} />
      </FieldGrid>
      {r.error ? <Refusal text={r.error} /> : <TileGrid><Tile label="Hydrocarbon tax rate" value={six(r.value)} /></TileGrid>}
      <Note>Two of these inputs answer open questions of the texts: the new-lease rate onshore or in shallow water, and the deep offshore reading under the Nigeria Tax Act 2025. The engine refuses to guess either one.</Note>
    </>
  );
};

export const AllowanceMode = () => {
  const [leaseStatus, setLease] = useState('new');
  const [terrain, setTerrain] = useState('onshore');
  const [barrels, setBarrels] = useState('1000000');
  const [price, setPrice] = useState('75');
  const [prior, setPrior] = useState('49500000');
  const [framework, setFramework] = useState('nta_2025');
  const r = allowanceOf({ leaseStatus, terrain, barrels: parseNumber(barrels), price: parseNumber(price), prior: parseNumber(prior), framework });
  return (
    <>
      <FieldGrid>
        <SelectField label="Lease status" value={leaseStatus} onChange={setLease} options={[['converted', 'converted'], ['new', 'new']]} />
        <SelectField label="Terrain" value={terrain} onChange={setTerrain} options={TERRAIN_OPTIONS} />
        <NumField label="Crude plus condensate this year, bbl" value={barrels} onChange={setBarrels} />
        <NumField label="Oil price, USD/bbl" value={price} onChange={setPrice} />
        <NumField label="Produced before this year, bbl" value={prior} onChange={setPrior} />
        <SelectField label="Framework of the year" value={framework} onChange={setFramework} options={FRAMEWORKS} />
      </FieldGrid>
      {r.error && <Refusal text={r.error} />}
      {!r.error && (
        <TileGrid>
          <Tile label="Production allowance" value={six(r.value.allowance)} />
          <Tile label="Barrels below the cap" value={String(r.value.below_cap_bbl)} />
          <Tile label="Barrels after the cap" value={String(r.value.after_cap_bbl)} />
        </TileGrid>
      )}
    </>
  );
};

export const CapitalMode = () => (
  <>
    <Tbl head={['year of life (0 is the year of spend)', 'a year under the Act alone', 'a year under the Nigeria Tax Act 2025']}
      rows={[0, 1, 2, 3, 4, 5].map((i) => [String(i), six(capitalFractionOf(i, 'pia_only')), six(capitalFractionOf(i, 'nta_2025'))])} />
    <Note>The fraction is read by the law of the year of assessment, so a spend part way through its life on 1 January 2026 takes each later year&apos;s rate.</Note>
  </>
);

const useCase = (start) => {
  const [name, setName] = useState(start);
  const [text, setText] = useState(pretty(DATASET[start]));
  const choose = (n) => { setName(n); setText(pretty(DATASET[n])); };
  const p = parseJson(text);
  return { name, choose, text, setText, p, r: p.error ? null : ledgerOf(p.value) };
};

const CaseFields = ({ c }) => (
  <FieldGrid>
    <SelectField label="Start from an Ekene teaching case" value={c.name} onChange={c.choose} options={CASE_NAMES.map((n) => [n, n])} />
    <TextField label="The case (JSON: cfg, prodRows, capexRows, opexRows)" value={c.text} onChange={c.setText} rows={10} />
  </FieldGrid>
);

export const BaseMode = () => {
  const c = useCase('ekene_cpr_binding_forfeiture');
  return (
    <>
      <CaseFields c={c} />
      {c.p.error && <Note>{c.p.error}</Note>}
      {c.r && c.r.error && <Refusal text={c.r.error} />}
      {c.r && !c.r.error && (
        <>
          <Tbl head={['year', 'CPR cap', 'CPR claimed', 'CPR carried out', 'HCT assessable profit', 'production allowance', 'HCT chargeable profit', 'HCT rate', 'HCT']}
            rows={c.r.value.cashFlowData.map((d) => [String(d.year), six(d.cpr_cap), six(d.cpr_costs_claimed), six(d.cpr_deferred_to_next), six(d.hct_assessable_profit), six(d.production_allowance), six(d.hct_chargeable_profit), six(d.hct_rate), six(d.hct_tax)])} />
          <TileGrid>
            <Tile label="Forfeited at cessation" value={six(c.r.value.kpis.cpr_forfeited_at_cessation ?? 0)} />
            <Tile label="Total hydrocarbon tax" value={six(c.r.value.kpis.total_hct)} />
          </TileGrid>
          {(c.r.value.kpis.pia_notes || []).map((n) => <EngineNote key={n} text={n} />)}
        </>
      )}
    </>
  );
};

export const CitMode = () => {
  const c = useCase('ekene_onshore_across_2026');
  return (
    <>
      <CaseFields c={c} />
      {c.p.error && <Note>{c.p.error}</Note>}
      {c.r && c.r.error && <Refusal text={c.r.error} />}
      {c.r && !c.r.error && (
        <Tbl head={['year', 'framework', 'CIT assessable profit', 'capital allowance', 'CIT allowance claimed', 'CIT allowance carried', 'CIT', 'CIT loss carried']}
          rows={c.r.value.cashFlowData.map((d) => [String(d.year), d.fiscal_framework || '', six(d.cit_assessable_profit), six(d.depreciation), six(d.cit_allowance_claimed), six(d.cit_allowance_carryforward), six(d.cit_tax), six(d.cit_loss_carryforward)])} />
      )}
      <Note>Companies income tax does not deduct the hydrocarbon tax, and the cost price ratio does not reach it. In a year under the Act alone its capital allowance claim is limited to two thirds of the assessable profit.</Note>
    </>
  );
};

const HctCalculator = ({ initialMode = 'rate' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Hydrocarbon tax calculator"
      subtitle="The rate, the production allowance, the capital allowance, the tax base with the cost price ratio, and companies income tax beside it."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'rate' && <RateMode />}
        {mode === 'allowance' && <AllowanceMode />}
        {mode === 'capital' && <CapitalMode />}
        {mode === 'base' && <BaseMode />}
        {mode === 'cit' && <CitMode />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Ekene cases are synthetic; paste your own terms and rows to replace them.</Note>
    </PanelShell>
  );
};

export default HctCalculator;
