import React, { useState } from 'react';
import {
  STARTS, pick, priceOf, parityOf, contractCashOf, dailyOf, ledgerOf, cashFlowsOf, GOLDEN_ARGS,
} from './gsaLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, orNone, Tbl, TextField, Refusal, EngineNote, Reasons, useJsonBox,
} from './panelBits';

// The contract calculator (Expert): energy parity and the S-curve, the whole
// contract in money with the imported gas royalty and the canonical NPV, and the
// four readings the engine states, each where it acts. Every figure is a return
// value of the vendored engine (engines/economics/gasContract.js) through gsaLab.
// This is the course's own calculator: there is no Suite app for this course.

export const MODES = [
  ['curve', 'Prices on an S-curve'],
  ['cash', 'The whole contract in money'],
  ['parity', 'Energy parity'],
  ['readings', 'The four stated readings'],
];

const Box = ({ box, label, rows = 12 }) => (
  <FieldGrid>
    <TextField label={label} value={box.text} onChange={box.setText} rows={rows} />
  </FieldGrid>
);

export const CurveMode = ({ initialCase = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'price') : STARTS.sCurve);
  const r = box.parsed.error ? null : priceOf(box.parsed.value);
  return (
    <>
      <Box box={box} label="priceSeries inputs (JSON), an oil-indexed formula with an sCurve { lowKink, highKink, lowSlope, highSlope }" rows={12} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['month', 'priced as', 'window', 'index averages', 'segment', 'clamped', 'unrounded', 'price']}
            rows={r.months.map((m) => [m.month, m.priceMonth, m.window ? m.window.join(' to ') : 'none', m.indexAverages ? Object.entries(m.indexAverages).map(([k, v]) => `${k} ${six(v)}`).join(', ') : 'none', orNone(m.segment), orNone(m.clamped), six(m.unroundedPrice), six(m.price)])} />
          <Tbl head={['year', 'months priced', 'annual average price', 'last month price']}
            rows={r.annual.map((a) => [String(a.year), String(a.months), six(a.averagePrice), six(a.lastMonthPrice)])} />
          <EngineNote text={r.basis.averaging} />
          <EngineNote text={r.basis.source} />
        </>
      )}
    </>
  );
};

const cashStart = (c) => {
  if (!c) return STARTS.cash;
  const { price, pricing, contract, royalty, discountRate, baseYear } = c;
  return price && pricing ? { price, pricing, contract, royalty, discountRate, baseYear } : { contract, royalty, discountRate, baseYear };
};

export const CashMode = ({ initialCase = null }) => {
  const box = useJsonBox(cashStart(initialCase));
  const r = box.parsed.error ? null : contractCashOf(box.parsed.value);
  const t = r && !r.error ? r.takeOrPay : null;
  return (
    <>
      <Box box={box} label="gsaCashFlows inputs (JSON: contract, royalty, discountRate, baseYear), or a priced case (price, pricing, contract, royalty, discountRate, baseYear)" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['year', 'take-or-pay quantity', 'taken', 'make-up taken', 'deficiency', 'carry-forward applied', 'deficiency payment', 'make-up outstanding', 'refund']}
            rows={t.years.map((y) => [String(y.year), six(y.topQuantity), six(y.taken), six(y.makeUpTaken), six(y.deficiency), six(y.carryForwardApplied), six(y.deficiencyPayment), six(y.makeUpOutstanding), six(y.refund)])} />
          <Tbl head={['year', 'regular', 'make-up', 'deficiency payment', 'shortfall damages', 'refund line', 'seller revenue', 'delivered value', 'royalty rate', 'royalty', 'net after royalty']}
            rows={r.years.map((y) => [String(y.year), six(y.lines.regular), six(y.lines.makeUp), six(y.lines.deficiencyPayment), six(y.lines.shortfallPayment), six(y.lines.refund), six(y.sellerRevenue), six(y.deliveredValue), six(y.royaltyRate), six(y.royalty), six(y.netAfterRoyalty)])} />
          <TileGrid>
            <Tile label="NPV of the seller revenue" value={six(r.npvSellerRevenue)} />
            <Tile label="NPV of the net after royalty" value={six(r.npvNetAfterRoyalty)} />
            <Tile label="Gas royalty rate" value={six(r.royaltyRate)} />
          </TileGrid>
          <Reasons items={t.years.flatMap((y) => y.reasons)} />
          <EngineNote text={r.basis.royalty} />
          <EngineNote text={r.basis.npv} />
        </>
      )}
    </>
  );
};

export const ParityMode = () => {
  const box = useJsonBox(STARTS.parity);
  const r = box.parsed.error ? null : parityOf(box.parsed.value);
  return (
    <>
      <Box box={box} label="energyParitySlope inputs (JSON: mmbtuPerBarrel)" rows={3} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="MMBtu per barrel" value={six(r.mmbtuPerBarrel)} />
            <Tile label="Parity slope" value={six(r.slope)} />
          </TileGrid>
          <EngineNote text={r.basis.rule} />
        </>
      )}
    </>
  );
};

// Each reading printed from the engine's own basis on the golden input where it acts.
export const ReadingsMode = () => {
  const day = dailyOf(GOLDEN_ARGS['daily-available-not-taken'].args);
  const top = ledgerOf(GOLDEN_ARGS['top-carry-forward-capped'].args);
  const eot = ledgerOf(GOLDEN_ARGS['top-end-of-term-refund'].args);
  const cf = cashFlowsOf(GOLDEN_ARGS['cf-power'].args);
  return (
    <>
      <Note>The engine states four readings in its own basis. The course shows each where it acts and grades none of them.</Note>
      <EngineNote text={day.basis.reading} />
      <Tbl head={['day', 'nominated', 'available', 'taken', 'seller shortfall', 'buyer shortfall']}
        rows={day.days.map((d) => [d.date, six(d.nominated), six(d.available), six(d.taken), six(d.sellerShortfall), six(d.buyerShortfall)])} />
      <EngineNote text={top.basis.reading} />
      <Tbl head={['year', 'deficiency', 'carry-forward applied', 'deficiency paid', 'make-up available']}
        rows={top.years.map((y) => [String(y.year), six(y.deficiency), six(y.carryForwardApplied), six(y.deficiencyPaid), six(y.makeUpAvailable)])} />
      <Reasons items={eot.years[eot.years.length - 1].reasons} />
      <EngineNote text={cf.basis.royalty} />
      <Tbl head={['year', 'deficiency payment', 'delivered value', 'royalty']}
        rows={cf.years.map((y) => [String(y.year), six(y.lines.deficiencyPayment), six(y.deliveredValue), six(y.royalty)])} />
    </>
  );
};

const ContractCalculator = ({ initialMode = 'curve', initialCase = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Contract calculator"
      subtitle="Energy parity and the S-curve, the whole contract in money with the gas royalty and the NPV, and the four readings the engine states."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'curve' && <CurveMode initialCase={initialCase} />}
        {mode === 'cash' && <CashMode initialCase={initialCase} />}
        {mode === 'parity' && <ParityMode />}
        {mode === 'readings' && <ReadingsMode />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Ekene agreements are synthetic; paste your own terms, or a whole case file, to replace them.</Note>
    </PanelShell>
  );
};

export default ContractCalculator;
