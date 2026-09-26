import React, { useState } from 'react';
import {
  STARTS, pick, viewCashCalls, viewCarry, viewBackIn, viewDefault, viewPsc,
} from './joaLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, orNone, Tbl, Refusal, EngineNote, Reasons, Source, useJsonBox, StatedControl, MissingStated, statedIn,
} from './panelBits';
import {
  Box, Starts, CashCallTable, CashCallControls,
} from './AccountCalculator';

// The recovery calculator (Professional): the cash call ledger with its
// reconciliation, a carry and its recovery with uplift and caps, a back-in
// under PIA 2021 s.85(4), a default with its cover, interest and
// consequences, and PSC cost recovery through the canonical applyPSC. Every
// figure is a return value of the vendored engine
// (engines/economics/jointVenture.js) through joaLab. This is the course's own
// calculator: there is no Suite app for this course.

export const MODES = [
  ['ledger', 'The cash call ledger'],
  ['carry', 'A carry and its recovery'],
  ['backIn', 'A back-in under the Act'],
  ['default', 'A default: cover, interest and consequences'],
  ['psc', 'PSC cost recovery'],
];

export const LedgerMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'cashCalls') : STARTS.cashCalls, initialText);
  const r = box.parsed.error ? null : viewCashCalls(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={[['cashCalls', 'The Ekene 2027 ledger, a credit carried'], ['cashCallsRefund', 'The same ledger, a negative call refunded'], ['cashCallsLag1', 'The same ledger, a lag of one month']]} />
      <CashCallControls box={box} />
      <Box box={box} label="cashCalls inputs (JSON: parties, carries, months, reconciliationLagMonths, negativeCall, noCallBelow), or a whole case file" rows={12} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <CashCallTable r={r} />
          <Tbl head={['closing party', 'balance', 'differences not yet adjusted', 'carried', 'arrears due']}
            rows={r.closing.map((c) => [c.id, six(c.balance), six(c.unadjustedDifferences), six(c.carried), six(c.arrearsDue)])} />
          <TileGrid>
            <Tile label="Calls over the ledger" value={six(r.totals.called)} />
            <Tile label="Arrears billed" value={six(r.totals.arrearsBilled)} />
            <Tile label="Actual" value={six(r.totals.actual)} />
          </TileGrid>
          <Reasons items={r.months.flatMap((m) => m.reasons)} />
          <EngineNote text={r.basis.lag} />
          <EngineNote text={r.basis.negativeCall} />
          <EngineNote text={r.basis.identity} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

const UPLIFT = [['none', 'no uplift (none)'], ['compound', 'compound on the opening balance (compound)'], ['multiple', 'a multiple of the carried cost (multiple)']];
const BASIS = [['contract', 'the contract\'s stated terms (contract)'], ['pia-s85-4', 'PIA 2021 s.85(4) (pia-s85-4)']];

export const CarryMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'carry') : STARTS.carry, initialText);
  const r = box.parsed.error ? null : viewCarry(box.parsed.value);
  const type = statedIn(box, 'carry', 'uplift.type');
  return (
    <>
      <Starts box={box} starts={[['carry', 'The Ekene carry, compound uplift'], ['carryPia', 'The Ekene carry under PIA s.85(4)'], ['carryMultiple', 'The Ekene carry, multiple uplift'], ['carryCapped', 'The Ekene carry with a cap']]} />
      <FieldGrid>
        <StatedControl box={box} viewKey="carry" path="uplift.type" label="Uplift (stated)" options={UPLIFT} />
        {type === 'compound' && <StatedControl box={box} viewKey="carry" path="uplift.ratePctPerYear" label="Uplift, percent a year (stated)" />}
        {type === 'multiple' && <StatedControl box={box} viewKey="carry" path="uplift.multiplePct" label="Uplift multiple, percent (stated)" />}
        <StatedControl box={box} viewKey="carry" path="recoverFromPct" label="Recovered from, percent of the share (stated)" />
        <StatedControl box={box} viewKey="carry" path="basis" label="Basis (stated)" options={BASIS} />
        <StatedControl box={box} viewKey="carry" path="cap" label="Cap (optional)" />
      </FieldGrid>
      <MissingStated box={box} viewKey="carry" required={[['uplift.type', 'uplift.type'], ['recoverFromPct', 'recoverFromPct'], ['basis', 'basis']]} />
      <Box box={box} label="carryRecovery inputs (JSON: parties, carries, carried, years, uplift, recoverFromPct, cap, basis, discountRate, baseYear), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['year', 'opening', 'uplift', 'carried cost', 'due', 'share', 'available', 'recovered', 'closing', 'written off', 'carried party receives']}
            rows={r.ledger.map((l) => [String(l.year), six(l.opening), six(l.uplift), six(l.added), six(l.due), six(l.share), six(l.available), six(l.recovered), six(l.closing), six(l.writtenOff), six(l.debtorReceives)])} />
          <TileGrid>
            <Tile label="Carried cost" value={six(r.totals.carriedCost)} />
            <Tile label="Uplift" value={six(r.totals.uplift)} />
            <Tile label="Recovered" value={six(r.totals.recovered)} />
            <Tile label="Written off" value={six(r.totals.writtenOff)} />
            <Tile label="Outstanding" value={six(r.totals.outstanding)} />
            <Tile label="Recovered in year" value={orNone(r.recoveredInYear)} />
          </TileGrid>
          {r.npv && <Tbl head={['party', 'NPV']} rows={r.npv.map((p) => [p.id, six(p.npv)])} />}
          <Tbl head={['year party', 'cost paid', 'entitlement share', 'recovery', 'net']}
            rows={r.parties.flatMap((y) => y.parties.map((p) => [`${y.year} ${p.id}`, six(p.costPaid), six(p.entitlementShare), six(p.recovery), six(p.net)]))} />
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.uplift} />
          <EngineNote text={r.basis.timing} />
          <EngineNote text={r.basis.basis} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

const REFUND_FORM = [['from-future-entitlement', 'from future entitlement (from-future-entitlement)'], ['upfront', 'paid at once (upfront)']];

export const BackInMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'backIn') : STARTS.backIn, initialText);
  const r = box.parsed.error ? null : viewBackIn(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={[['backIn', 'The Ekene back-in under PIA s.85(4)'], ['backInUpfront', 'The same back-in under contract terms, paid at once']]} />
      <FieldGrid>
        <StatedControl box={box} viewKey="backIn" path="basis" label="Basis (stated)" options={BASIS} />
        <StatedControl box={box} viewKey="backIn" path="refundForm" label="Refund form (stated)" options={REFUND_FORM} />
        <StatedControl box={box} viewKey="backIn" path="targetPct" label="Target interest, percent (stated)" />
        <StatedControl box={box} viewKey="backIn" path="recoverFromPct" label="Recovered from, percent of the new share" />
      </FieldGrid>
      <MissingStated box={box} viewKey="backIn" required={[['basis', 'basis'], ['refundForm', 'refundForm'], ['targetPct', 'targetPct']]} />
      <Box box={box} label="backIn inputs (JSON: parties, backInParty, targetPct, costs, basis, refundableKinds, refundForm, recoverFromPct, years), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['party', 'before', 'after', 'interest given up', 'refund received', 'refund paid']}
            rows={r.parties.map((p) => [p.id, six(p.before), six(p.after), six(p.ceded), six(p.refundReceived), six(p.refundPaid)])} />
          <Tbl head={['cost line', 'kind', 'amount', 'refundable']}
            rows={r.costs.map((c) => [c.item, c.kind, six(c.amount), String(c.refundable)])} />
          <TileGrid>
            <Tile label="Refundable" value={six(r.refundable)} />
            <Tile label="Excluded" value={six(r.excluded)} />
            <Tile label="Refund" value={six(r.refund)} />
            <Tile label="Recovered in year" value={r.recovery ? orNone(r.recovery.recoveredInYear) : 'none'} />
          </TileGrid>
          {r.recovery && (
            <Tbl head={['year', 'due', 'share', 'available', 'recovered', 'closing', 'back-in party receives']}
              rows={r.recovery.ledger.map((l) => [String(l.year), six(l.due), six(l.share), six(l.available), six(l.recovered), six(l.closing), six(l.debtorReceives)])} />
          )}
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.refundable} />
          <EngineNote text={r.basis.form} />
          <EngineNote text={r.basis.notComputed} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

const METHOD = [['simple', 'simple (simple)'], ['monthly-compound', 'compounded monthly (monthly-compound)']];
const DAY_BASIS = [['365', '365 days'], ['360', '360 days']];

export const DefaultMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'default') : STARTS.default, initialText);
  const r = box.parsed.error ? null : viewDefault(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={[['default', 'The Ekene March default, simple interest'], ['defaultKenya', 'The same default, compounded monthly with a grace'], ['defaultUncured', 'The same default left open']]} />
      <FieldGrid>
        <StatedControl box={box} viewKey="default" path="interest.annualRatePct" label="Default interest, percent a year (stated)" />
        <StatedControl box={box} viewKey="default" path="interest.dayBasis" label="Day basis (stated)" options={DAY_BASIS} cast={Number} />
        <StatedControl box={box} viewKey="default" path="interest.interestMethod" label="Interest method (stated)" options={METHOD} />
        <StatedControl box={box} viewKey="default" path="interest.graceHours" label="Grace, hours (stated, 0 for none)" />
      </FieldGrid>
      <MissingStated box={box} viewKey="default" required={[['interest.annualRatePct', 'interest.annualRatePct'], ['interest.dayBasis', 'interest.dayBasis'], ['interest.interestMethod', 'interest.interestMethod'], ['interest.graceHours', 'interest.graceHours']]} />
      <Box box={box} label="defaultCover inputs (JSON: parties, carries, callTotal, dueDate, asOf, defaulters, interest, suspension, forfeiture, holidays), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['defaulter', 'share of the call', 'paid', 'unpaid', 'days', 'whole months', 'remaining days', 'within the grace', 'default interest', 'suspension', 'forfeiture']}
            rows={r.defaulters.map((d) => [d.id, six(d.share), six(d.paid), six(d.unpaid), String(d.days), orNone(d.wholeMonths), orNone(d.remainingDays), String(d.withinGrace), six(d.interest),
              d.suspension ? `${d.suspension.triggerDate}, ${d.suspension.applies ? 'triggered' : 'not triggered'}` : 'none',
              d.forfeiture ? `${d.forfeiture.triggerDate}, ${d.forfeiture.applies ? 'triggered' : 'not triggered'}` : 'none'])} />
          <Tbl head={['party', 'paying interest', 'cover percent', 'cover', 'interest received']}
            rows={r.cover.map((c) => [c.id, six(c.payingPct), six(c.coverPct), six(c.cover), six(c.interestReceived)])} />
          {r.interestsAfterForfeiture && (
            <Tbl head={['party', 'interest after forfeiture']} rows={r.interestsAfterForfeiture.map((p) => [p.id, six(p.participatingPct)])} />
          )}
          <TileGrid>
            <Tile label="Unpaid" value={six(r.unpaidTotal)} />
            <Tile label="Total default interest" value={six(r.interestTotal)} />
          </TileGrid>
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.cover} />
          <EngineNote text={r.basis.interest} />
          <EngineNote text={r.basis.grace} />
          <EngineNote text={r.basis.consequences} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

const LIMIT_BASE = [['after-royalty', 'revenue after royalty (after-royalty)'], ['gross', 'gross revenue (gross)']];

export const PscMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'psc') : STARTS.psc, initialText);
  const r = box.parsed.error ? null : viewPsc(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={[['psc', 'The Ekene PSC variant'], ['pscWorldBank', 'World Bank Briefing Note 8, the two-barrel example'], ['pscFari', 'IMF FARI Tables 12 and 13']]} />
      <FieldGrid>
        <StatedControl box={box} viewKey="psc" path="royaltyPct" label="Royalty, percent (stated)" />
        <StatedControl box={box} viewKey="psc" path="costOilLimitPct" label="Cost oil limit, percent (stated)" />
        <StatedControl box={box} viewKey="psc" path="costOilLimitBase" label="Cost oil limit base (stated)" options={LIMIT_BASE} />
        <StatedControl box={box} viewKey="psc" path="contractorProfitSharePct" label="Contractor profit share, percent (stated)" />
        <StatedControl box={box} viewKey="psc" path="taxRatePct" label="Tax, percent (stated)" />
        <StatedControl box={box} viewKey="psc" path="openingCostPool" label="Opening cost pool (stated)" />
      </FieldGrid>
      <MissingStated box={box} viewKey="psc" required={[['royaltyPct', 'royaltyPct'], ['costOilLimitPct', 'costOilLimitPct'], ['costOilLimitBase', 'costOilLimitBase'], ['contractorProfitSharePct', 'contractorProfitSharePct'], ['taxRatePct', 'taxRatePct'], ['openingCostPool', 'openingCostPool']]} />
      <Box box={box} label="pscCostRecovery inputs (JSON: years, royaltyPct, costOilLimitPct, costOilLimitBase, contractorProfitSharePct, taxRatePct, openingCostPool, parties, discountRate, baseYear), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['year', 'gross revenue', 'royalty', 'pool in', 'cost oil limit', 'cost recovered', 'pool out', 'profit oil', 'contractor share', 'contractor profit oil', 'government profit oil', 'tax', 'contractor entitlement', 'government take']}
            rows={r.years.map((y) => [String(y.year), six(y.grossRevenue), six(y.royalty), six(y.poolIn), six(y.costOilLimit), six(y.costRecovered), six(y.poolOut), six(y.profitOil), six(y.contractorProfitSharePct), six(y.contractorProfitOil), six(y.governmentProfitOil), six(y.tax), six(y.contractorEntitlement), six(y.governmentTake)])} />
          <TileGrid>
            <Tile label="Cost recovered, total" value={six(r.totals.costRecovered)} />
            <Tile label="Government take, total" value={six(r.totals.governmentTake)} />
            <Tile label="Unrecovered at the end" value={six(r.unrecoveredAtEnd)} />
          </TileGrid>
          {r.parties && (
            <Tbl head={['year partner', 'entitlement', 'cost', 'net']}
              rows={r.parties.flatMap((y) => y.parties.map((p) => [`${y.year} ${p.id}`, six(p.entitlement), six(p.cost), six(p.net)]))} />
          )}
          {r.npv && <Tbl head={['partner', 'NPV']} rows={r.npv.map((p) => [p.id, six(p.npv)])} />}
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.order} />
          <EngineNote text={r.basis.limitBase} />
          <EngineNote text={r.basis.tax} />
          <EngineNote text={r.basis.engine} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

const RecoveryCalculator = ({ initialMode = 'ledger', initialCase = null, initialText = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Recovery calculator"
      subtitle="The cash call ledger, a carry and its recovery, a back-in under PIA 2021 s.85(4), a default with its cover and interest, and PSC cost recovery."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'ledger' && <LedgerMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'carry' && <CarryMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'backIn' && <BackInMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'default' && <DefaultMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'psc' && <PscMode initialCase={initialCase} initialText={initialText} />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Ekene joint venture is synthetic; paste your own terms, or a whole case file, to replace it.</Note>
    </PanelShell>
  );
};

export default RecoveryCalculator;
