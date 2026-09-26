import React, { useState } from 'react';
import {
  STARTS, pick, ledgerOf, priceOf, domesticOf, dgdoOf,
} from './gsaLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, orNone, list, Tbl, TextField, Refusal, EngineNote, Reasons, useJsonBox,
} from './panelBits';

// The ledger calculator (Professional): the take-or-pay ledger with make-up and
// carry-forward, contract price formulas with averaging, lag and reset, the
// Nigerian domestic gas prices and the Domestic Gas Delivery Obligation. Every
// figure is a return value of the vendored engine
// (engines/economics/gasContract.js) through gsaLab. This is the course's own
// calculator: there is no Suite app for this course.

export const MODES = [
  ['ledger', 'The take-or-pay ledger'],
  ['price', 'Contract prices month by month'],
  ['domestic', 'Domestic gas prices'],
  ['dgdo', 'The Domestic Gas Delivery Obligation'],
];

const Box = ({ box, label, rows = 12 }) => (
  <FieldGrid>
    <TextField label={label} value={box.text} onChange={box.setText} rows={rows} />
  </FieldGrid>
);

const ledgerStart = (c) => {
  if (!c) return STARTS.ledger;
  if (c.price && c.pricing && c.contract) return { price: c.price, pricing: c.pricing, contract: c.contract };
  return pick(c, 'contract');
};

export const LedgerMode = ({ initialCase = null }) => {
  const box = useJsonBox(ledgerStart(initialCase));
  const r = box.parsed.error ? null : ledgerOf(box.parsed.value);
  return (
    <>
      <Box box={box} label="takeOrPay inputs (JSON: years, topPct, makeUp, carryForward), or a priced case (price, pricing, contract)" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          {r.priced && (
            <Tbl head={['year', 'contract price', 'take-or-pay price', 'make-up price']}
              rows={r.priced.contract.years.map((y) => [String(y.year), six(y.contractPrice), six(y.topPrice), six(y.makeUpPrice)])} />
          )}
          <Tbl head={['year', 'Adjusted ACQ', 'take-or-pay quantity', 'taken', 'make-up available', 'make-up taken', 'counted', 'deficiency', 'carry-forward applied', 'deficiency paid', 'deficiency payment', 'make-up expired', 'make-up outstanding', 'carry-forward outstanding', 'shortfall damages', 'refund', 'net to seller']}
            rows={r.years.map((y) => [String(y.year), six(y.adjustedAcq), six(y.topQuantity), six(y.taken), six(y.makeUpAvailable), six(y.makeUpTaken), six(y.counted), six(y.deficiency), six(y.carryForwardApplied), six(y.deficiencyPaid), six(y.deficiencyPayment), six(y.makeUpExpired.reduce((s, x) => s + x.quantity, 0)), six(y.makeUpOutstanding), six(y.carryForwardOutstanding), six(y.shortfallPayment), six(y.refund), six(y.netToSeller)])} />
          <TileGrid>
            <Tile label="Total deficiency payment" value={six(r.totals.deficiencyPayment)} />
            <Tile label="Total make-up taken" value={six(r.totals.makeUpTaken)} />
            <Tile label="Total make-up expired" value={six(r.totals.makeUpExpired)} />
            <Tile label="Total net to the seller" value={six(r.totals.netToSeller)} />
          </TileGrid>
          <Reasons items={r.years.flatMap((y) => y.reasons)} />
          <EngineNote text={r.basis.order} />
          <EngineNote text={r.basis.makeUp} />
          <EngineNote text={r.basis.carryForward} />
          <EngineNote text={r.basis.reading} />
        </>
      )}
    </>
  );
};

export const PriceMode = ({ initialCase = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'price') : STARTS.price);
  const r = box.parsed.error ? null : priceOf(box.parsed.value);
  return (
    <>
      <Box box={box} label="priceSeries inputs (JSON: months, formula, from, to, averagingMonths, lagMonths, resetMonths, rounding, reopeners)" rows={12} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['month', 'priced as', 'window', 'index averages', 'segment', 'clamped', 'unrounded', 'price', 'reopener']}
            rows={r.months.map((m) => [m.month, m.priceMonth, m.window ? m.window.join(' to ') : 'none', m.indexAverages ? Object.entries(m.indexAverages).map(([k, v]) => `${k} ${six(v)}`).join(', ') : 'none', orNone(m.segment), orNone(m.clamped), six(m.unroundedPrice), six(m.price), m.reopener ? 'yes' : 'no'])} />
          <Tbl head={['year', 'months priced', 'annual average price', 'last month price']}
            rows={r.annual.map((a) => [String(a.year), String(a.months), six(a.averagePrice), six(a.lastMonthPrice)])} />
          <Reasons items={r.reopeners.map((x) => x.note)} />
          <EngineNote text={r.basis.averaging} />
          <EngineNote text={r.basis.rounding} />
          <EngineNote text={r.basis.annual} />
        </>
      )}
    </>
  );
};

export const DomesticMode = () => {
  const box = useJsonBox(STARTS.domestic);
  const r = box.parsed.error ? null : domesticOf(box.parsed.value);
  return (
    <>
      <Box box={box} label="domesticPrice inputs (JSON: sector, domesticBasePrice, negotiatedPrice, product, cmpp, transportTariff, schedule)" rows={8} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Sector" value={r.sector} />
            <Tile label="Price, US$ per MMBtu" value={six(r.price)} />
            <Tile label="Delivered price" value={six(r.deliveredPrice)} />
            <Tile label="Held at" value={orNone(r.heldAt)} />
            <Tile label="EPF" value={six(r.epf)} />
            <Tile label="Formula price" value={six(r.formulaPrice)} />
            <Tile label="Ceiling" value={six(r.ceiling)} />
          </TileGrid>
          {r.reason && <EngineNote text={r.reason} />}
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.domesticBasePrice} />
        </>
      )}
      <Note>The domestic base price is a stated input with no default. The figures the course names are reported figures, quoted with their reports, and none is graded.</Note>
    </>
  );
};

export const DgdoMode = ({ initialCase = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'dgdo') : STARTS.dgdo);
  const r = box.parsed.error ? null : dgdoOf(box.parsed.value);
  return (
    <>
      <Box box={box} label="domesticGasObligation inputs (JSON: obligation, delivered, voluntaryContracts, excused, agreementPenaltyRate, penaltyRate)" rows={8} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Deemed fulfilled" value={r.deemedFulfilled ? 'yes' : 'no'} />
            <Tile label="Undelivered" value={six(r.undelivered)} />
            <Tile label="Excused" value={six(r.excusedApplied)} />
            <Tile label="Penalised" value={six(r.penalised)} />
            <Tile label="Rate, US$ per MMBtu" value={six(r.rate)} />
            <Tile label="Penalty" value={six(r.penalty)} />
            <Tile label="Export restriction" value={r.exportRestriction ? 'yes' : 'no'} />
            <Tile label="Excuses applied" value={list(r.excused.map((x) => x.ground))} />
          </TileGrid>
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.rate} />
          <EngineNote text={r.basis.notReported} />
        </>
      )}
    </>
  );
};

const LedgerCalculator = ({ initialMode = 'ledger', initialCase = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Ledger calculator"
      subtitle="The take-or-pay ledger with make-up and carry-forward, contract prices month by month, the domestic gas prices and the delivery obligation."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'ledger' && <LedgerMode initialCase={initialCase} />}
        {mode === 'price' && <PriceMode initialCase={initialCase} />}
        {mode === 'domestic' && <DomesticMode />}
        {mode === 'dgdo' && <DgdoMode initialCase={initialCase} />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Ekene agreements are synthetic; paste your own terms, or a whole case file, to replace them.</Note>
    </PanelShell>
  );
};

export default LedgerCalculator;
