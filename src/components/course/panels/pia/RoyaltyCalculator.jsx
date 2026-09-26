import React, { useState } from 'react';
import {
  PIA_TERRAINS, TRANCHE_EDGES, DATASET, CASE_NAMES, parseNumber, parseJson, pretty,
  oilRateOf, gasRateOf, benchmarksOf, priceRateOf, ledgerOf, refusalSamples, daysOf,
} from './piaLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, TextField, Refusal, EngineNote,
} from './panelBits';

// The royalty calculator (Associate): the map of the Act on numbers. Royalty by
// terrain and daily rate, the gas royalty and gas used in-country, the royalty
// by price on either base year, and the instruments stacked on a ledger. Every
// figure is a return value of the vendored engine
// (engines/economics/cashflow.ts) through piaLab, on the Ekene teaching cases
// or on the terms and rows you paste. This is the course's own calculator:
// there is no Suite app for this course.

export const MODES = [
  ['tranches', 'Royalty by terrain and daily rate'],
  ['gas', 'Gas royalty and gas used in-country'],
  ['price', 'Royalty by price and its benchmarks'],
  ['stack', 'The instruments stacked on a ledger'],
  ['refusals', 'What a refusal looks like'],
];

const TERRAIN_OPTIONS = PIA_TERRAINS.map((t) => [t, t]);
const BASES = [['regulations_2021', 'Regulations base (2021, the engine default)'], ['act_2020', 'Act base (2020)']];

export const TranchesMode = () => {
  const [terrain, setTerrain] = useState('onshore');
  const [bopd, setBopd] = useState('7500');
  const [year, setYear] = useState('2026');
  const r = oilRateOf(terrain, parseNumber(bopd));
  return (
    <>
      <FieldGrid>
        <SelectField label="Terrain" value={terrain} onChange={setTerrain} options={TERRAIN_OPTIONS} />
        <NumField label="Crude plus condensate, bopd" value={bopd} onChange={setBopd} />
        <NumField label="Year (for its calendar days)" value={year} onChange={setYear} />
      </FieldGrid>
      {r.error && <Refusal text={r.error} />}
      {!r.error && (
        <TileGrid>
          <Tile label="Weighted royalty rate" value={six(r.value)} />
          <Tile label="Calendar days in the year" value={String(daysOf(parseNumber(year) || 0))} />
        </TileGrid>
      )}
      <Tbl head={['bopd', ...PIA_TERRAINS]} rows={TRANCHE_EDGES.map((b) => [String(b), ...PIA_TERRAINS.map((t) => six(oilRateOf(t, b).value))])} />
      <Note>The daily rate is the year&apos;s crude oil plus condensate over the calendar days of the year. The rate applies to the value of crude oil and condensate together.</Note>
    </>
  );
};

export const GasMode = () => {
  const [terrain, setTerrain] = useState('shallow_water');
  const [share, setShare] = useState('50');
  const r = gasRateOf(terrain, parseNumber(share));
  return (
    <>
      <FieldGrid>
        <SelectField label="Terrain" value={terrain} onChange={setTerrain} options={TERRAIN_OPTIONS} />
        <NumField label="Gas used in-country, percent" value={share} onChange={setShare} />
      </FieldGrid>
      {r.error ? <Refusal text={r.error} /> : <TileGrid><Tile label="Gas royalty rate" value={six(r.value)} /></TileGrid>}
      <Note>Gas and natural gas liquids pay 5 percent; gas used in-country pays 2.5 percent. Every terrain pays the same gas rate.</Note>
    </>
  );
};

export const PriceMode = () => {
  const [year, setYear] = useState('2025');
  const [price, setPrice] = useState('80');
  const [terrain, setTerrain] = useState('onshore');
  const [base, setBase] = useState('regulations_2021');
  const y = parseNumber(year);
  const b = benchmarksOf(y, base);
  const other = benchmarksOf(y, base === 'act_2020' ? 'regulations_2021' : 'act_2020');
  const r = priceRateOf(parseNumber(price), y, terrain, base);
  return (
    <>
      <FieldGrid>
        <NumField label="Year" value={year} onChange={setYear} />
        <NumField label="Price, USD/bbl" value={price} onChange={setPrice} />
        <SelectField label="Terrain" value={terrain} onChange={setTerrain} options={TERRAIN_OPTIONS} />
        <SelectField label="Base year" value={base} onChange={setBase} options={BASES} />
      </FieldGrid>
      {(b.error || r.error) && <Refusal text={b.error || r.error} />}
      {!b.error && !r.error && (
        <>
          <TileGrid>
            <Tile label="Low benchmark" value={six(b.value.low)} />
            <Tile label="Middle benchmark" value={six(b.value.mid)} />
            <Tile label="High benchmark" value={six(b.value.high)} />
            <Tile label="Royalty by price rate" value={six(r.value)} />
          </TileGrid>
          {!other.error && (
            <Note>{`The other base year puts the benchmarks at ${six(other.value.low)}, ${six(other.value.mid)} and ${six(other.value.high)} in the same year. The base year is an open question of the texts; the course grades neither reading.`}</Note>
          )}
        </>
      )}
    </>
  );
};

export const StackMode = ({ initialCase = null }) => {
  const [name, setName] = useState('ekene_alpha_shallow_converted_nta');
  const [text, setText] = useState(pretty(initialCase || DATASET.ekene_alpha_shallow_converted_nta));
  const choose = (n) => { setName(n); setText(pretty(DATASET[n])); };
  const p = parseJson(text);
  const r = p.error ? null : ledgerOf(p.value);
  return (
    <>
      <FieldGrid>
        <SelectField label="Start from an Ekene teaching case" value={name} onChange={choose} options={CASE_NAMES.map((n) => [n, n])} />
        <TextField label="The case (JSON: cfg, prodRows, capexRows, opexRows)" value={text} onChange={setText} rows={10} />
      </FieldGrid>
      {p.error && <Note>{p.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['year', 'framework', 'liquids bopd', 'liquids royalty rate', 'liquids production royalty', 'gas royalty', 'production royalty', 'royalty by price', 'total royalty']}
            rows={r.value.cashFlowData.map((d) => [String(d.year), d.fiscal_framework || '', six(d.royalty_liquids_bopd), six(d.royalty_rate_liquids), six(d.liquids_production_royalty), six(d.gas_royalty), six(d.production_royalty), six(d.price_royalty), six(d.royalty)])} />
          <Tbl head={['year', 'HCDT', 'NDDC', 'HCT', 'CIT', 'TET', 'development levy', 'net cash flow']}
            rows={r.value.cashFlowData.map((d) => [String(d.year), six(d.hcdt), six(d.nddc), six(d.hct_tax), six(d.cit_tax), six(d.tet_tax), six(d.dev_levy_tax), six(d.net_cash_flow)])} />
          <TileGrid>
            <Tile label="Total royalties" value={six(r.value.kpis.total_royalties)} />
            <Tile label="Total companies income tax" value={six(r.value.kpis.total_cit)} />
            <Tile label="Government take, percent" value={six(r.value.kpis.government_take_pct)} />
          </TileGrid>
          {(r.value.kpis.pia_notes || []).map((n) => <EngineNote key={n} text={n} />)}
        </>
      )}
    </>
  );
};

export const RefusalsMode = () => (
  <>
    {refusalSamples().map((s) => (
      <div key={s.what}>
        <Note>{`Stated bad input: ${s.what}`}</Note>
        <Refusal text={s.error} />
      </div>
    ))}
  </>
);

const RoyaltyCalculator = ({ initialMode = 'tranches', initialCase = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Royalty calculator"
      subtitle="Royalty by terrain, volume and price, the gas royalty, and the instruments stacked on one ledger."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'tranches' && <TranchesMode />}
        {mode === 'gas' && <GasMode />}
        {mode === 'price' && <PriceMode />}
        {mode === 'stack' && <StackMode initialCase={initialCase} />}
        {mode === 'refusals' && <RefusalsMode />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Ekene cases are synthetic; paste your own terms and rows to replace them.</Note>
    </PanelShell>
  );
};

export default RoyaltyCalculator;
