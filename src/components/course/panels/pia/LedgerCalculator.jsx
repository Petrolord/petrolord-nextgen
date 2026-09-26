import React, { useState } from 'react';
import {
  DATASET, CASE_NAMES, parseJson, pretty, ledgerOf, compareOf, frameworkOf, readingsOf,
  PIA_NOTES, FISCAL_METRICS, GOVERNMENT_CASH_FLOW,
} from './piaLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, TextField, Refusal, EngineNote, Declared,
} from './panelBits';

// The ledger calculator (Expert): transitions and reading an outcome. The whole
// ledger with the framework read year by year; the framework table under each
// override; one case under every stated reading side by side; one change of
// terms at a time with the totals by provision; and every note the engine can
// print. Every figure is a return value of the vendored engine
// (engines/economics/cashflow.ts) through piaLab. This is the course's own
// calculator: there is no Suite app for this course.

export const MODES = [
  ['ledger', 'The whole ledger, year by year'],
  ['framework', 'The framework of each year'],
  ['readings', 'One case under every stated reading'],
  ['moved', 'Which provision moved'],
  ['notes', 'The engine notes'],
];

const useCase = (start, initialCase) => {
  const [name, setName] = useState(start);
  const [text, setText] = useState(pretty(initialCase || DATASET[start]));
  const choose = (n) => { setName(n); setText(pretty(DATASET[n])); };
  const p = parseJson(text);
  return { name, choose, text, setText, p };
};

const CaseFields = ({ c }) => (
  <FieldGrid>
    <SelectField label="Start from an Ekene teaching case" value={c.name} onChange={c.choose} options={CASE_NAMES.map((n) => [n, n])} />
    <TextField label="The case (JSON: cfg, prodRows, capexRows, opexRows)" value={c.text} onChange={c.setText} rows={10} />
  </FieldGrid>
);

export const LedgerMode = ({ initialCase = null }) => {
  const c = useCase('ekene_onshore_across_2026', initialCase);
  const r = c.p.error ? null : ledgerOf(c.p.value);
  return (
    <>
      <CaseFields c={c} />
      {c.p.error && <Note>{c.p.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['year', 'framework', 'liquids royalty rate', 'total royalty', 'production allowance', 'HCT chargeable profit', 'HCT', 'CIT', 'TET', 'levy', 'minimum ETR top-up', 'decommissioning deduction', 'net cash flow']}
            rows={r.value.cashFlowData.map((d) => [String(d.year), d.fiscal_framework || '', six(d.royalty_rate_liquids), six(d.royalty), six(d.production_allowance), six(d.hct_chargeable_profit), six(d.hct_tax), six(d.cit_tax), six(d.tet_tax), six(d.dev_levy_tax), six(d.min_etr_topup ?? 0), six(d.decom_fund_deduction ?? 0), six(d.net_cash_flow)])} />
          <TileGrid>
            <Tile label="Total companies income tax" value={six(r.value.kpis.total_cit)} />
            <Tile label="Framework of the ledger" value={String(r.value.kpis.fiscal_framework)} />
            <Tile label="First NTA year" value={String(r.value.kpis.nta_first_year ?? 'none')} />
            <Tile label="Government take, percent" value={six(r.value.kpis.government_take_pct)} />
          </TileGrid>
          {(r.value.kpis.pia_notes || []).map((n) => <EngineNote key={n} text={n} />)}
        </>
      )}
    </>
  );
};

export const FrameworkMode = () => (
  <>
    <Tbl head={['year', 'auto', 'force_pia', 'force_nta']}
      rows={[2023, 2024, 2025, 2026, 2027, 2030].map((y) => [String(y), ...['auto', 'force_pia', 'force_nta'].map((o) => frameworkOf(o, y).value)])} />
    <Note>Under auto a year before 2026 is a year under the Act alone and 2026 onward a year under the Nigeria Tax Act 2025, read row by row.</Note>
  </>
);

export const ReadingsMode = ({ initialCase = null }) => {
  const c = useCase('ekene_deep_new_60k_conservative', initialCase);
  const rows = c.p.error ? [] : readingsOf(c.p.value).map((x) => (x.run.error
    ? [x.label, x.status, '', '', '', '']
    : [x.label, x.status, six(x.run.value.kpis.total_royalties), six(x.run.value.kpis.total_hct), six(x.run.value.kpis.total_cit), six(x.run.value.kpis.government_take_pct)]));
  const refused = c.p.error ? [] : readingsOf(c.p.value).filter((x) => x.run.error);
  return (
    <>
      <CaseFields c={c} />
      {c.p.error && <Note>{c.p.error}</Note>}
      <Tbl head={['reading', 'what the engine does with it for this case', 'total royalties', 'total HCT', 'total CIT', 'take percent']} rows={rows} />
      {refused.map((x) => (
        <div key={x.label}>
          <Note>{`The ${x.label} row is refused, in the engine's words:`}</Note>
          <Refusal text={x.run.error} />
        </div>
      ))}
      <Note>Each row states one reading of an open question of the texts. The course shows the readings side by side and grades none of them. A row the engine does not read for this case is ignored and leaves every figure where the case as stated puts it.</Note>
    </>
  );
};

export const MovedMode = () => {
  const c = useCase('ekene_alpha_shallow_converted_nta');
  const [patchText, setPatch] = useState(pretty({ pia_license_type: 'PPL' }));
  const patch = parseJson(patchText);
  const r = c.p.error || patch.error ? null : compareOf(c.p.value, patch.value);
  return (
    <>
      <CaseFields c={c} />
      <FieldGrid>
        <TextField label="One change of terms (JSON of cfg keys)" value={patchText} onChange={setPatch} rows={3} />
      </FieldGrid>
      {(c.p.error || patch.error) && <Note>{c.p.error || patch.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['provision total', 'base', 'changed', 'changed less base']} rows={r.value.lines.map((l) => [l.key, six(l.base), six(l.changed), six(l.changed - l.base)])} />
          <TileGrid>
            <Tile label="Take, base" value={six(r.value.baseTake)} />
            <Tile label="Take, changed" value={six(r.value.changedTake)} />
          </TileGrid>
          <Declared title={`${FISCAL_METRICS.governmentTake.title}, in the shared wording`}>{FISCAL_METRICS.governmentTake.definition}</Declared>
          <Declared title={`${GOVERNMENT_CASH_FLOW.title}, in the shared wording`}>{GOVERNMENT_CASH_FLOW.definition}</Declared>
        </>
      )}
    </>
  );
};

export const NotesMode = () => (
  <>
    {Object.entries(PIA_NOTES).map(([k, v]) => (
      <div key={k}>
        <Note>{k}</Note>
        <EngineNote text={v} />
      </div>
    ))}
  </>
);

const LedgerCalculator = ({ initialMode = 'ledger', initialCase = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Ledger calculator"
      subtitle="The framework year by year, the stated readings side by side, and which provision moved when the terms change."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'ledger' && <LedgerMode initialCase={initialCase} />}
        {mode === 'framework' && <FrameworkMode />}
        {mode === 'readings' && <ReadingsMode initialCase={initialCase} />}
        {mode === 'moved' && <MovedMode />}
        {mode === 'notes' && <NotesMode />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Ekene cases are synthetic; paste your own terms and rows to replace them.</Note>
    </PanelShell>
  );
};

export default LedgerCalculator;
