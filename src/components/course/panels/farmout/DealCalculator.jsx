import React, { useState } from 'react';
import {
  STARTS, pick, viewDeal, viewFee,
} from './farmoutLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, orNone, Tbl, Refusal, EngineNote, Reasons, Source, useJsonBox, StatedControl, MissingStated,
  statedIn, CapControl, CapTermControls, WordStated, BOOL, castBool,
} from './panelBits';
import { Box, Starts, EarningMode } from './EarningCalculator';

// The deal calculator (Professional): caps and overrun rules and drill-to-earn
// vesting on the earning obligation, the value of the deal to each side by EMV
// through the canonical decision tree, the break-even promote and the
// break-even chance of success, and the consent fee of the Assignment of
// Interests Regulations 2024 with its day rules. Every figure is a return value
// of the vendored engine (engines/economics/farmout.js) through farmoutLab. This
// is the course's own calculator: there is no Suite app for this course.

export const MODES = [
  ['earning', 'Caps, overrun rules and drill-to-earn'],
  ['deal', 'The value of the deal to each side'],
  ['fee', 'The consent fee and its day rules'],
];

export const CAP_STARTS = [
  ['capGrossPost', 'A gross-cost cap exceeded, the excess by the post-deal interests'], ['capGrossFarmor', 'The same, the excess by the farmor side'],
  ['capGrossBelow', 'A gross-cost cap not reached'], ['capGrossExactly', 'A gross-cost cap reached exactly'],
  ['capCarryBelow', 'A carry-amount cap not reached'], ['capCarryExactly', 'A carry-amount cap reached exactly'],
  ['capCarryExceeded', 'A carry-amount cap exceeded'], ['capCarryZero', 'A carry-amount cap of 0'],
  ['dte', 'Ekene drill-to-earn, one of two events, all-events'], ['dteDone', 'Ekene drill-to-earn, both events'],
  ['dtePerEvent', 'Ekene drill-to-earn, one event, per-event'], ['dteNoneDone', 'Ekene drill-to-earn, no event completed'],
];

export const DEAL_STARTS = [
  ['deal', 'The Ekene Deep deal, cash flows stated'], ['dealNpv', 'The same, the success-case value stated'], ['dealNoCap', 'No cap'],
  ['dealCarryCap', 'A carry-amount cap'], ['dealFarmorSide', 'The excess by the farmor side'], ['dealBonusZero', 'No bonus and no assignor fees'],
  ['dealDry', 'A chance of success of 0'], ['dealCertain', 'A chance of success of 100'], ['dealPsu', 'The Penn State figures'],
  ['dealKinks', 'Breakpoints under a carry cap'], ['dealBreakEven', 'A promote at the break-even exactly'],
];

/** Every required term of a deal on a risked prospect, each a visible control. */
export const DealControls = ({ box, viewKey = 'deal' }) => (
  <>
    <FieldGrid>
      <StatedControl box={box} viewKey={viewKey} path="project.chanceOfSuccessPct" label="Chance of success, percent (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="project.wellCost.success" label="Well cost on a success (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="project.wellCost.dry" label="Well cost as a dry hole (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="deal.farmineePaysPct" label="Share of the well the farminee pays, percent (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="deal.earnedPct" label="Participating interest earned, percent (stated)" />
      <CapControl box={box} viewKey={viewKey} path="deal.cap" label="Cap (stated)" />
      <CapTermControls box={box} viewKey={viewKey} path="deal.cap" who="the deal" />
      <StatedControl box={box} viewKey={viewKey} path="deal.cashBonus" label="Cash bonus (stated, 0 for none)" />
      <StatedControl box={box} viewKey={viewKey} path="deal.pastCosts.amount" label="Past costs (stated, 0 for none)" />
      <StatedControl box={box} viewKey={viewKey} path="deal.pastCosts.reimbursedPct" label="Past costs reimbursed, percent (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="deal.assignorFees" label="Assignor fees the farmor pays (stated, 0 for none)" />
    </FieldGrid>
    <MissingStated box={box} viewKey={viewKey} required={[
      ['project.chanceOfSuccessPct', 'the chance of success'], ['project.wellCost.success', 'the well cost on a success'], ['project.wellCost.dry', 'the dry-hole cost'],
      ['project.successValue', 'the success-case value'], ['deal.farmineePaysPct', 'the share paid'], ['deal.earnedPct', 'the interest earned'], ['deal.cap', 'the cap'],
      ['deal.cashBonus', 'the cash bonus'], ['deal.pastCosts.amount', 'the past costs'], ['deal.pastCosts.reimbursedPct', 'the share of past costs reimbursed'], ['deal.assignorFees', 'the assignor fees'],
    ]} />
  </>
);

/** What dealValue returns, laid out. */
export const DealResult = ({ r }) => (
  <>
    <Tbl head={['outcome', 'gross cost', 'farminee pays', 'farmor pays', 'carry', 'cap state']}
      rows={[['success', r.wellCostSplit.success], ['dry hole', r.wellCostSplit.dry]].map(([k, s]) => [k, six(s.grossCost), six(s.farmineePays), six(s.farmorPays), six(s.carry), s.capState])} />
    <Tbl head={['position', 'success', 'dry hole', 'EMV']}
      rows={[
        ['farmor alone', six(r.farmor.alone.success), six(r.farmor.alone.dry), six(r.farmor.alone.emv)],
        ['farmor after the farm-out', six(r.farmor.farmOut.success), six(r.farmor.farmOut.dry), six(r.farmor.farmOut.emv)],
        ['farmor walks away', six(0), six(0), six(r.farmor.walkAway)],
        ['farminee farms in', six(r.farmineeSide.farmIn.success), six(r.farmineeSide.farmIn.dry), six(r.farmineeSide.farmIn.emv)],
        ['farminee declines', six(0), six(0), six(r.farmineeSide.decline)],
      ]} />
    <TileGrid>
      <Tile label="Success-case value at 100 percent" value={six(r.successValue100)} />
      <Tile label="Farmor, best action" value={r.farmor.tiedActions.length > 1 ? `a tie: ${r.farmor.tiedActions.join(', ')}` : r.farmor.bestAction} />
      <Tile label="Farminee, best action" value={r.farmineeSide.tiedActions.length > 1 ? `a tie: ${r.farmineeSide.tiedActions.join(', ')}` : r.farmineeSide.bestAction} />
      <Tile label="Promote points" value={six(r.terms.promotePoints)} />
      <Tile label="Promote ratio" value={six(r.terms.promoteRatio)} />
      <Tile label="Break-even status" value={r.breakEvenPromote.status} />
      <Tile label="Break-even share paid" value={six(r.breakEvenPromote.farmineePaysPct)} />
      <Tile label="Break-even promote points" value={six(r.breakEvenPromote.promotePoints)} />
      <Tile label="Break-even promote ratio" value={six(r.breakEvenPromote.promoteRatio)} />
    </TileGrid>
    <Tbl head={['breakpoint share paid', 'farminee EMV']} rows={r.breakEvenPromote.breakpoints.map((b) => [six(b.farmineePaysPct), six(b.emv)])} />
    <Tbl head={['break-even position', 'status', 'break-even chance of success']}
      rows={[['farmor alone', r.breakEvenChance.farmorAlone], ['farmor after the farm-out', r.breakEvenChance.farmorFarmOut], ['farminee', r.breakEvenChance.farminee]]
        .map(([k, b]) => [k, b.status, six(b.chanceOfSuccessPct)])} />
    <TileGrid>
      <Tile label="Transfer: farmor alone EMV" value={six(r.transfer.farmorAloneEmv)} />
      <Tile label="Transfer: farmor after EMV" value={six(r.transfer.farmorFarmOutEmv)} />
      <Tile label="Transfer: farminee EMV" value={six(r.transfer.farmineeEmv)} />
      <Tile label="Transfer: assignor fees" value={six(r.transfer.assignorFees)} />
      <Tile label="Expected carry" value={six(r.consideration.expectedCarry)} />
      <Tile label="Expected consideration" value={six(r.consideration.expectedTotal)} />
      <Tile label="Expected consideration per percent earned" value={six(r.consideration.perPercentEarned)} />
    </TileGrid>
    <Reasons items={r.reasons} />
    <EngineNote text={r.basis.emv} />
    <EngineNote text={r.basis.positions} />
    <EngineNote text={r.basis.timing} />
    <EngineNote text={r.basis.transfer} />
    <EngineNote text={r.basis.breakEvenPromote} />
    <EngineNote text={r.basis.breakEvenChance} />
    <Source text={r.basis.source} />
  </>
);

export const DealMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'deal') : STARTS.deal, initialText);
  const r = box.parsed.error ? null : viewDeal(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={DEAL_STARTS} />
      <DealControls box={box} />
      <Box box={box} label="dealValue inputs (JSON: parties, farmor, farminee, project, deal), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && <DealResult r={r} />}
    </>
  );
};

const FEE_BASIS = [['nuprc-2024-r19', 'the 2024 Regulations, reg. 19 (nuprc-2024-r19)'], ['stated', 'rates stated in the box (stated)']];
const LICENCE = [['PPL', 'a petroleum prospecting licence (PPL)'], ['PML', 'a petroleum mining lease (PML)'], ['PEL', 'a petroleum exploration licence (PEL)']];
const VALUE_SOURCE = [['contract-amount', 'the amount payable to the assignor in the contract (contract-amount)'], ['commission-determined', 'an amount the Commission determines (commission-determined)']];

export const FEE_STARTS = [
  ['fee', 'The Ekene consent fee, paid on time'], ['feeIntra', 'An intra group transfer'], ['feePel', 'A PEL under stated rates'],
  ['feeDay90', 'Paid on day 90'], ['feeDay91', 'Paid on day 91'], ['feeDay121', 'Paid on day 121'], ['feeDay210', 'Paid on day 210'], ['feeDay211', 'Paid on day 211'],
];

export const FeeMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'fee') : STARTS.fee, initialText);
  const r = box.parsed.error ? null : viewFee(box.parsed.value);
  const basis = statedIn(box, 'fee', 'basis');
  return (
    <>
      <Starts box={box} starts={FEE_STARTS} />
      <FieldGrid>
        <StatedControl box={box} viewKey="fee" path="basis" label="Fee basis (stated)" options={FEE_BASIS} />
        <StatedControl box={box} viewKey="fee" path="licence" label="Licence (stated)" options={LICENCE} />
        <StatedControl box={box} viewKey="fee" path="transactionValue" label="Value of the transaction (stated)" />
        <StatedControl box={box} viewKey="fee" path="valueSource" label="Value of the transaction is (stated)" options={VALUE_SOURCE} />
        {basis !== 'stated' && <StatedControl box={box} viewKey="fee" path="intraGroup" label="Intra group transfer (stated)" options={BOOL} cast={castBool} />}
        {basis === 'stated' && <StatedControl box={box} viewKey="fee" path="ratesPct.processingPct" label="Processing fee, percent (stated)" />}
        {basis === 'stated' && <StatedControl box={box} viewKey="fee" path="ratesPct.premiumPct" label="Premium, percent (stated)" />}
        {basis !== 'stated' && <WordStated box={box} viewKey="fee" path="payment.notifiedOn" label="Consent notified on, YYYY-MM-DD (optional)" />}
        {basis !== 'stated' && <WordStated box={box} viewKey="fee" path="payment.paidOn" label="Fee paid on, YYYY-MM-DD (optional)" />}
      </FieldGrid>
      <MissingStated box={box} viewKey="fee" required={[['basis', 'basis'], ['licence', 'licence'], ['transactionValue', 'transactionValue'], ['valueSource', 'valueSource'],
        ...(basis === 'stated' ? [['ratesPct.processingPct', 'ratesPct.processingPct'], ['ratesPct.premiumPct', 'ratesPct.premiumPct']] : [['intraGroup', 'intraGroup']])]} />
      <Box box={box} label="consentFee inputs (JSON: licence, transactionValue, valueSource, intraGroup, basis, ratesPct, payment), or a whole case file" rows={10} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Processing percent" value={six(r.processingPct)} />
            <Tile label="Premium percent" value={six(r.premiumPct)} />
            <Tile label="Processing fee" value={six(r.processingFee)} />
            <Tile label="Premium" value={six(r.premium)} />
            <Tile label="Consent fee" value={six(r.fee)} />
            <Tile label="Paid by" value={r.payer} />
            <Tile label="Tax deductible" value={String(r.taxDeductible)} />
          </TileGrid>
          {r.payment && (
            <TileGrid>
              <Tile label="Days from the notification" value={String(r.payment.days)} />
              <Tile label="Payment status" value={r.payment.status} />
              <Tile label="Surcharge days" value={String(r.payment.surchargeDays)} />
              <Tile label="Surcharge" value={six(r.payment.surcharge)} />
              <Tile label="Total paid" value={orNone(r.payment.totalPaid === null ? null : six(r.payment.totalPaid))} />
            </TileGrid>
          )}
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.value} />
          <EngineNote text={r.basis.tax} />
          <EngineNote text={r.basis.timing} />
          <EngineNote text={r.basis.consent} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

const DealCalculator = ({ initialMode = 'earning', initialCase = null, initialText = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Deal calculator"
      subtitle="Caps and overrun rules, drill-to-earn vesting, the value of the deal to each side by EMV, the break-even promote and chance, and the consent fee with its day rules."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'earning' && <EarningMode initialCase={initialCase} initialText={initialText} starts={CAP_STARTS} />}
        {mode === 'deal' && <DealMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'fee' && <FeeMode initialCase={initialCase} initialText={initialText} />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Ekene Deep farm-out is synthetic; paste your own terms, or a whole case file, to replace it.</Note>
    </PanelShell>
  );
};

export default DealCalculator;
