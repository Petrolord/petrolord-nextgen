import React, { useState } from 'react';
import {
  STARTS, pick, viewEnergy, viewQuantities, viewDaily, viewYear,
} from './gsaLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, orNone, Tbl, TextField, Refusal, EngineNote, Reasons, Source, useJsonBox,
  pretty,
} from './panelBits';

// The quantity calculator (Associate): volume to energy, contract quantities,
// the daily balance and one take-or-pay year. Every figure is a return value of
// the vendored engine (engines/economics/gasContract.js) through gsaLab. This is
// the course's own calculator: there is no Suite app for this course.

export const MODES = [
  ['energy', 'Volume to energy'],
  ['quantities', 'Contract quantities and swing'],
  ['daily', 'The daily balance'],
  ['year', 'One take-or-pay year'],
];

const Box = ({ box, label, rows = 10 }) => (
  <FieldGrid>
    <TextField label={label} value={box.text} onChange={box.setText} rows={rows} />
  </FieldGrid>
);

export const EnergyMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'energy') : STARTS.energy, initialText);
  const r = box.parsed.error ? null : viewEnergy(box.parsed.value);
  return (
    <>
      <Box box={box} label="toEnergy inputs (JSON: quantity, quantityUnit, heatingValue, heatingValueUnit, heatingValueBasis, referenceConditions), or a whole case file" rows={8} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Energy, MMBtu" value={six(r.mmbtu)} />
            <Tile label="Energy, GJ" value={six(r.gj)} />
            <Tile label="Heating value basis" value={r.heatingValueBasis} />
            <Tile label="Reference conditions" value={r.referenceConditions} />
          </TileGrid>
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.heatingValue} />
          <EngineNote text={r.basis.units} />
          <Source text={r.basis.units.split('; ')[0]} />
        </>
      )}
    </>
  );
};

export const QuantitiesMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'quantities') : STARTS.quantities, initialText);
  const r = box.parsed.error ? null : viewQuantities(box.parsed.value);
  return (
    <>
      <Box box={box} label="contractQuantities inputs (JSON: dcq; days, year or period; maxDcqPct; topPct), or a whole case file" rows={7} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Days in the contract year" value={String(r.days)} />
            <Tile label="ACQ" value={six(r.acq)} />
            <Tile label="MaxDCQ" value={six(r.maxDcq)} />
            <Tile label="Swing factor" value={six(r.swingFactor)} />
            <Tile label="Take-or-pay quantity on the full ACQ" value={six(r.topQuantity)} />
            <Tile label="Effective swing" value={six(r.effectiveSwing)} />
          </TileGrid>
          <EngineNote text={r.basis.dayCount} />
          <EngineNote text={r.basis.rule} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

export const DailyMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'fortnight') : STARTS.daily, initialText);
  const r = box.parsed.error ? null : viewDaily(box.parsed.value);
  return (
    <>
      <Box box={box} label="dailyBalance inputs (JSON: dcq, maxDcqPct, deliveryTolerance, days), or a whole case file" rows={12} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['day', 'nominated', 'properly nominated', 'available', 'taken', 'force majeure', 'maintenance', 'seller shortfall', 'adjusted DCQ', 'buyer shortfall', 'over-take']}
            rows={r.days.map((d) => [d.date, six(d.nominated), six(d.properlyNominated), six(d.available), six(d.taken), six(d.forceMajeure), six(d.maintenance), six(d.sellerShortfall), six(d.adjustedDcq), six(d.buyerShortfall), six(d.overTake)])} />
          <TileGrid>
            <Tile label="Days" value={String(r.annual.days)} />
            <Tile label="ACQ for the days" value={six(r.annual.acq)} />
            <Tile label="Adjusted ACQ for the days" value={six(r.annual.adjustedAcq)} />
            <Tile label="Total taken" value={six(r.annual.taken)} />
            <Tile label="Total seller shortfall" value={six(r.annual.sellerShortfall)} />
            <Tile label="Total buyer shortfall" value={six(r.annual.buyerShortfall)} />
            <Tile label="Total over-take" value={six(r.annual.overTake)} />
            <Tile label="MaxDCQ" value={six(r.maxDcq)} />
          </TileGrid>
          <Reasons items={r.days.flatMap((d) => d.reasons)} />
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.reading} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

const YEAR_STARTS = [
  ['golden', 'A one-year teaching case'],
  ['power2027', 'The power plant, 2027 alone'],
  ['power2032', 'The power plant, 2032 alone'],
];

export const YearMode = ({ initialCase = null, initialText = null }) => {
  const [start, setStart] = useState('golden');
  const box = useJsonBox(initialCase ? pick(initialCase, 'year') : STARTS.year, initialText);
  const choose = (k) => { setStart(k); box.setText(pretty(k === 'golden' ? STARTS.year : STARTS[k])); };
  const r = box.parsed.error ? null : viewYear(box.parsed.value);
  return (
    <>
      <FieldGrid>
        <SelectField label="Start from" value={start} onChange={choose} options={YEAR_STARTS} />
      </FieldGrid>
      <Box box={box} label="takeOrPay inputs (JSON: years, topPct, makeUp), or a whole case file" rows={12} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['year', 'ACQ', 'Adjusted ACQ', 'take-or-pay quantity', 'taken', 'counted', 'deficiency', 'contract price', 'take-or-pay price', 'deficiency payment', 'regular revenue', 'shortfall damages', 'net to seller']}
            rows={r.years.map((y, i) => { const inp = pick(box.parsed.value, 'year').years[i]; return [String(y.year), six(y.acq), six(y.adjustedAcq), six(y.topQuantity), six(y.taken), six(y.counted), six(y.deficiency), six(inp.contractPrice), six(inp.topPrice), six(y.deficiencyPayment), six(y.regularRevenue), six(y.shortfallPayment), six(y.netToSeller)]; })} />
          <TileGrid>
            <Tile label="Total deficiency payment" value={six(r.totals.deficiencyPayment)} />
            <Tile label="Total net to the seller" value={six(r.totals.netToSeller)} />
            <Tile label="Make-up at the end" value={six(r.totals.endOfTermQuantity)} />
            <Tile label="Recovery order" value={orNone(r.basis.order.split(':')[0])} />
          </TileGrid>
          <Reasons items={r.years.flatMap((y) => y.reasons)} />
          <EngineNote text={r.basis.rule} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

const QuantityCalculator = ({ initialMode = 'energy', initialCase = null, initialText = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Quantity calculator"
      subtitle="Volume to energy, the contract quantities and swing, the daily balance of nominations and takes, and one take-or-pay year."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'energy' && <EnergyMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'quantities' && <QuantitiesMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'daily' && <DailyMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'year' && <YearMode initialCase={initialCase} initialText={initialText} />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Ekene agreements are synthetic; paste your own terms, or a whole case file, to replace them.</Note>
    </PanelShell>
  );
};

export default QuantityCalculator;
