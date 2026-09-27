import React, { useState } from 'react';
import {
  STARTS, pick, viewInformation, viewRisk, viewPrice, viewDevCarry, viewBackIn, dealOf, feeOf, devCarryOf, READING_CASES,
} from './farmoutLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, orNone, Tbl, Refusal, EngineNote, Reasons, Source, useJsonBox, StatedControl, MissingStated, Declared,
  statedIn, UpliftControl, WordStated,
} from './panelBits';
import { Box, Starts } from './EarningCalculator';
import { DealMode, DealControls } from './DealCalculator';

// The valuation calculator (Expert): the value of information to each side, the
// risk each side carries through the canonical portfolio Monte Carlo, the price
// of an interest per percent with transaction ratios of stated inputs, a
// development carry and a back-in after the farm-in through the joint venture
// engine, the deal itself, and the readings the engine states, each printed
// from the engine's own basis where it acts. Every figure is a return value of
// the vendored engine (engines/economics/farmout.js) through farmoutLab. This is
// the course's own calculator: there is no Suite app for this course.

export const MODES = [
  ['information', 'The value of information to one side'],
  ['risk', 'Risk sharing: spread, the chance of a loss, the low and high cases'],
  ['price', 'A price for a working interest'],
  ['devCarry', 'A development carry after the farm-in'],
  ['backIn', 'A back-in after the farm-in'],
  ['deal', 'The value of the deal to each side'],
  ['readings', 'The readings the engine states'],
];

const SIDE = [['farminee', 'the farminee (farminee)'], ['farmor', 'the farmor (farmor)']];

export const InformationMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'information') : STARTS.information, initialText);
  const r = box.parsed.error ? null : viewInformation(box.parsed.value);
  const signals = statedIn(box, 'information', 'information.signals');
  return (
    <>
      <Starts box={box} starts={[['information', 'The Ekene survey to the farminee'], ['infoFarmor', 'The same survey to the farmor'], ['infoTooDear', 'The survey at a cost above its worth'], ['infoUninformative', 'An uninformative signal']]} />
      <FieldGrid>
        <StatedControl box={box} viewKey="information" path="side" label="Side valued (stated)" options={SIDE} />
        <StatedControl box={box} viewKey="information" path="information.cost" label="Cost of the information (stated)" />
        {(Array.isArray(signals) ? signals : []).map((s, i) => (
          <React.Fragment key={i}>
            <StatedControl box={box} viewKey="information" path={`information.signals.${i}.likelihoodsPct.0`} label={`signal ${i + 1}: chance given success, percent (stated)`} />
            <StatedControl box={box} viewKey="information" path={`information.signals.${i}.likelihoodsPct.1`} label={`signal ${i + 1}: chance given a dry hole, percent (stated)`} />
          </React.Fragment>
        ))}
      </FieldGrid>
      <MissingStated box={box} viewKey="information" required={[['side', 'side'], ['information.cost', 'the cost of the information'], ['information.signals', 'the signals']]} />
      <DealControls box={box} viewKey="information" />
      <Box box={box} label="informationValue inputs (JSON: parties, farmor, farminee, project, deal, side, information), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['action', 'success', 'dry hole']} rows={r.actions.map((a) => [a.label, six(a.success), six(a.dry)])} />
          <TileGrid>
            <Tile label="EMV without information" value={six(r.emvPrior)} />
            <Tile label="EMV with perfect information" value={six(r.evWithPerfectInformation)} />
            <Tile label="EVPI" value={six(r.evpi)} />
            <Tile label="EMV with the signal" value={six(r.evWithInformation)} />
            <Tile label="EVII" value={six(r.evii)} />
            <Tile label="Information cost" value={six(r.informationCost)} />
            <Tile label="EVII less the cost" value={six(r.netEvii)} />
          </TileGrid>
          <Tbl head={['signal', 'label', 'chance of the signal', 'chance of success after it', 'best action', 'EMV']}
            rows={r.perSignal.map((s, i) => [`signal ${i + 1}`, s.label, six(s.probability), six(s.posteriorSuccessPct), s.tiedActions.length > 1 ? `a tie: ${s.tiedActions.join(', ')}` : s.bestAction, six(s.emv)])} />
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.engine} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

export const RiskMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'risk') : STARTS.risk, initialText);
  const r = box.parsed.error ? null : viewRisk(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={[['risk', 'The Ekene farmor alone and after the farm-out'], ['riskPsu', 'The Penn State figures'], ['riskSpread', 'One bet or four'], ['riskCorrelated', 'Four correlated bets']]} />
      <FieldGrid>
        <StatedControl box={box} viewKey="risk" path="correlation" label="Correlation, 0 to 1 (stated)" />
        <StatedControl box={box} viewKey="risk" path="seed" label="Seed (stated)" />
        <StatedControl box={box} viewKey="risk" path="iterations" label="Draws (stated)" />
      </FieldGrid>
      <MissingStated box={box} viewKey="risk" required={[['correlation', 'correlation'], ['seed', 'seed'], ['iterations', 'iterations']]} />
      <Box box={box} label="riskSharing inputs (JSON: positions of holdings, correlation, seed, iterations), or a whole case file" rows={12} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['position', 'EMV', 'standard deviation', 'chance of a loss (draws)', 'low case (P90)', 'high case (P10)']}
            rows={r.positions.map((p) => [p.name, six(p.emv), six(p.stdDev), six(p.probLoss), six(p.p90), six(p.p10)])} />
          <Declared title="A DRAW IS AN ESTIMATE">
            The EMV and the standard deviation are closed form. The chance of a loss and the low and high cases are estimates
            from the stated number of seeded draws: the same seed returns the same estimates, and another seed returns others.
            No capstone grades them.
          </Declared>
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.engine} />
          <EngineNote text={r.basis.labels} />
          <EngineNote text={r.basis.holding} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

const BASES = [['risked', 'the risked EMV (risked)'], ['success-case', 'the success case (success-case)']];

export const PriceMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'price') : STARTS.price, initialText);
  const r = box.parsed.error ? null : viewPrice(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={[['price', 'The Ekene Deep price, risked'], ['priceSuccess', 'The same, success case'], ['pricePsu', 'The Penn State figures'], ['priceProduction', 'A producing interest priced per flowing unit'], ['priceNegative', 'A risked value below 0']]} />
      <FieldGrid>
        <StatedControl box={box} viewKey="price" path="interestPct" label="Working interest priced, percent (stated)" />
        <StatedControl box={box} viewKey="price" path="valueBasis" label="Value basis (stated)" options={BASES} />
        <StatedControl box={box} viewKey="price" path="transaction.price" label="Stated price (optional)" />
        <StatedControl box={box} viewKey="price" path="project.chanceOfSuccessPct" label="Chance of success, percent (stated)" />
        <StatedControl box={box} viewKey="price" path="project.wellCost.success" label="Well cost on a success (stated)" />
        <StatedControl box={box} viewKey="price" path="project.wellCost.dry" label="Well cost as a dry hole (stated)" />
      </FieldGrid>
      <MissingStated box={box} viewKey="price" required={[['interestPct', 'interestPct'], ['valueBasis', 'valueBasis'], ['project.chanceOfSuccessPct', 'the chance of success'], ['project.wellCost.success', 'the well cost on a success'], ['project.wellCost.dry', 'the dry-hole cost'], ['project.successValue', 'the success-case value']]} />
      <Box box={box} label="interestValue inputs (JSON: project, interestPct, valueBasis, transaction), or a whole case file" rows={12} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="100 percent: success" value={six(r.position100.success)} />
            <Tile label="100 percent: dry hole" value={six(r.position100.dry)} />
            <Tile label="100 percent: risked EMV" value={six(r.position100.emv)} />
            <Tile label="Risked value per percent" value={six(r.perPct.risked)} />
            <Tile label="Success-case value per percent" value={six(r.perPct.successCase)} />
            <Tile label="Value of the working interest" value={six(r.interestValue)} />
          </TileGrid>
          {r.transaction && (
            <TileGrid>
              <Tile label="Price per percent" value={six(r.transaction.impliedPerPct)} />
              <Tile label="Price for 100 percent" value={six(r.transaction.implied100)} />
              <Tile label="Price over value per percent" value={six(r.transaction.priceToValue)} />
            </TileGrid>
          )}
          {r.transaction && r.transaction.reserves.length > 0 && (
            <Tbl head={['reserve category', 'gross volume', 'net to the interest', 'price per unit']}
              rows={r.transaction.reserves.map((x) => [x.category, six(x.grossVolume), six(x.netVolume), six(x.pricePerUnit)])} />
          )}
          {r.transaction && r.transaction.production && (
            <TileGrid>
              <Tile label="Net rate to the interest" value={six(r.transaction.production.netRate)} unit={r.transaction.production.rateUnit} />
              <Tile label="Price per flowing unit" value={six(r.transaction.production.pricePerFlowingUnit)} />
            </TileGrid>
          )}
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.scaling} />
          <EngineNote text={r.basis.metrics} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

const UPLIFT = [['none', 'no uplift (none)'], ['simple', 'simple interest on the principal (simple)'], ['compound', 'compound on the opening balance (compound)'], ['multiple', 'a multiple of the carried cost (multiple)']];
const DAY_BASIS = [['annual-period', 'one year per ledger period (annual-period)'], ['actual/365', 'days of the year over 365 (actual/365)'], ['actual/360', 'days of the year over 360 (actual/360)']];

export const DevCarryMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'devCarry') : STARTS.devCarry, initialText);
  const r = box.parsed.error ? null : viewDevCarry(box.parsed.value);
  const type = statedIn(box, 'devCarry', 'uplift.type');
  const simple = r && !r.error && r.ledger.some((l) => l.openingPrincipal !== undefined);
  return (
    <>
      <Starts box={box} starts={[['devCarry', 'The Ekene carry, compound uplift'], ['devCarrySimple', 'The Ekene carry, simple interest (HMRC OT18360)'], ['devCarryCapped', 'No uplift, a cap']]} />
      <FieldGrid>
        <StatedControl box={box} viewKey="devCarry" path="earnedPct" label="Participating interest earned in the farm-in, percent (stated)" />
        <StatedControl box={box} viewKey="devCarry" path="carriedPct" label="Carried, percent of the farmor's cost share (stated)" />
        <StatedControl box={box} viewKey="devCarry" path="recoverFromPct" label="Recovered from, percent of the farmor's share (stated)" />
        <UpliftControl box={box} viewKey="devCarry" label="Uplift (stated)" options={UPLIFT} />
        {(type === 'simple' || type === 'compound') && <StatedControl box={box} viewKey="devCarry" path="uplift.ratePctPerYear" label="Uplift, percent a year (stated)" />}
        {type === 'simple' && <StatedControl box={box} viewKey="devCarry" path="uplift.dayBasis" label="Simple interest day basis (stated)" options={DAY_BASIS} />}
        {type === 'multiple' && <StatedControl box={box} viewKey="devCarry" path="uplift.multiplePct" label="Uplift multiple, percent (stated)" />}
        <StatedControl box={box} viewKey="devCarry" path="cap" label="Cap on the recovery (optional)" />
        <StatedControl box={box} viewKey="devCarry" path="discountRate" label="Discount rate, a fraction (optional)" />
        <StatedControl box={box} viewKey="devCarry" path="baseYear" label="Base year (optional)" />
      </FieldGrid>
      <MissingStated box={box} viewKey="devCarry" required={[['earnedPct', 'earnedPct'], ['carriedPct', 'carriedPct'], ['recoverFromPct', 'recoverFromPct'], ['uplift.type', 'uplift.type'],
        ...(type === 'simple' ? [['uplift.ratePctPerYear', 'uplift.ratePctPerYear'], ['uplift.dayBasis', 'uplift.dayBasis']] : []),
        ...(type === 'compound' ? [['uplift.ratePctPerYear', 'uplift.ratePctPerYear']] : []),
        ...(type === 'multiple' ? [['uplift.multiplePct', 'uplift.multiplePct']] : [])]} />
      <Box box={box} label="developmentCarry inputs (JSON: parties, farmor, farminee, earnedPct, carriedPct, years, uplift, recoverFromPct, cap, discountRate, baseYear), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['party', 'participating interest after the farm-in']} rows={r.interestsAfter.map((p) => [p.id, six(p.participatingPct)])} />
          <Tbl head={['year', 'opening', 'uplift', 'carried cost added', 'due', 'available for recovery', 'recovered', 'closing', 'written off', 'the farmor receives', ...(simple ? ['opening principal', 'interest paid', 'principal paid'] : [])]}
            rows={r.ledger.map((l) => [String(l.year), six(l.opening), six(l.uplift), six(l.added), six(l.due), six(l.available), six(l.recovered), six(l.closing), six(l.writtenOff), six(l.debtorReceives),
              ...(simple ? [six(l.openingPrincipal), six(l.interestPaid), six(l.principalPaid)] : [])])} />
          <TileGrid>
            <Tile label="Recovered in" value={orNone(r.recoveredInYear)} />
            <Tile label="Carried cost" value={six(r.totals.carriedCost)} />
            <Tile label="Uplift in all" value={six(r.totals.uplift)} />
            <Tile label="Recovered in all" value={six(r.totals.recovered)} />
            <Tile label="Written off" value={six(r.totals.writtenOff)} />
          </TileGrid>
          {Array.isArray(r.npv) && <Tbl head={['NPV party', 'NPV']} rows={r.npv.map((p) => [p.id, six(p.npv)])} />}
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.engine} />
          <EngineNote text={r.basis.carry} />
          <EngineNote text={r.basis.uplift} />
          <EngineNote text={r.basis.note} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

const BACKIN_BASIS = [['contract', 'the contract\'s stated terms (contract)'], ['pia-s85-4', 'PIA 2021 s.85(4) (pia-s85-4)']];
const REFUND_FORM = [['upfront', 'paid at once (upfront)'], ['from-future-entitlement', 'from future entitlement (from-future-entitlement)']];
const KINDS = [['development', 'development'], ['development,production', 'development and production'], ['development,production,exploration', 'development, production and exploration']];
const castKinds = (v) => v.split(',');

export const BackInMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'backIn') : STARTS.backIn, initialText);
  const r = box.parsed.error ? null : viewBackIn(box.parsed.value);
  const basis = statedIn(box, 'backIn', 'backIn.basis');
  const form = statedIn(box, 'backIn', 'backIn.refundForm');
  return (
    <>
      <Starts box={box} starts={[['backIn', 'The Ekene back-in, contract, upfront'], ['backInPia', 'A back-in under PIA 2021 s.85(4)']]} />
      <FieldGrid>
        <StatedControl box={box} viewKey="backIn" path="earnedPct" label="Participating interest earned in the farm-in, percent (stated)" />
        <WordStated box={box} viewKey="backIn" path="backIn.party" label="Back-in party (stated)" />
        <StatedControl box={box} viewKey="backIn" path="backIn.targetPct" label="Back-in to, percent (stated)" />
        <StatedControl box={box} viewKey="backIn" path="backIn.basis" label="Basis (stated)" options={BACKIN_BASIS} />
        {basis !== 'pia-s85-4' && <StatedControl box={box} viewKey="backIn" path="backIn.refundableKinds" label="Refundable cost kinds (stated)" options={KINDS} cast={castKinds} />}
        <StatedControl box={box} viewKey="backIn" path="backIn.refundForm" label="Refund form (stated)" options={REFUND_FORM} />
        {form === 'from-future-entitlement' && <StatedControl box={box} viewKey="backIn" path="backIn.recoverFromPct" label="Recovered from, percent of the new share (stated)" />}
      </FieldGrid>
      <MissingStated box={box} viewKey="backIn" required={[['earnedPct', 'earnedPct'], ['backIn.party', 'the back-in party'], ['backIn.targetPct', 'the target'], ['backIn.basis', 'the basis'], ['backIn.refundForm', 'the refund form'],
        ...(basis === 'contract' ? [['backIn.refundableKinds', 'the refundable kinds']] : [])]} />
      <Box box={box} label="backInRight inputs (JSON: parties, farmor, farminee, earnedPct, backIn), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['party', 'before (after the farm-in)', 'after the back-in', 'ceded', 'refund received', 'refund paid']}
            rows={r.parties.map((p) => [p.id, six(p.before), six(p.after), six(p.ceded), six(p.refundReceived), six(p.refundPaid)])} />
          <Tbl head={['cost item', 'amount', 'kind', 'refundable']} rows={r.costs.map((c) => [c.item, six(c.amount), c.kind, String(c.refundable)])} />
          <TileGrid>
            <Tile label="Refundable costs" value={six(r.refundable)} />
            <Tile label="Excluded costs" value={six(r.excluded)} />
            <Tile label="Refund" value={six(r.refund)} />
            <Tile label="Refund form" value={r.refundForm} />
            <Tile label="Recovered in" value={orNone(r.recovery ? r.recovery.recoveredInYear : null)} />
          </TileGrid>
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.engine} />
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.refundable} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

/** The readings the engine states, each printed from its basis on the golden case where it acts. */
export const ReadingsMode = () => {
  const timing = dealOf(READING_CASES.timing);
  const d90 = feeOf(READING_CASES.day90);
  const d91 = feeOf(READING_CASES.day91);
  const d210 = feeOf(READING_CASES.day210);
  const d211 = feeOf(READING_CASES.day211);
  const simple = devCarryOf(READING_CASES.simple);
  const value = feeOf(READING_CASES.value);
  return (
    <>
      <Declared title="READING ONE: THE VALUATION TIMING (deal-ekene)">Every cost is placed at the valuation date. The engine&apos;s basis:</Declared>
      <EngineNote text={timing.basis.timing} />
      <Source text={timing.basis.source} />
      <Declared title="READING TWO: THE DAY COUNT OF REG. 19(7) (fee-day-90, fee-day-91)">Days run from the notification to the payment, the notification day uncounted. The engine&apos;s basis:</Declared>
      <EngineNote text={d90.basis.timing} />
      <TileGrid>
        <Tile label="fee-day-90: days, status" value={`${d90.payment.days}, ${d90.payment.status}`} />
        <Tile label="fee-day-91: days, status" value={`${d91.payment.days}, ${d91.payment.status}`} />
      </TileGrid>
      <Declared title="READING THREE: THE NINETIETH SURCHARGE DAY (fee-day-210, fee-day-211)">The ninetieth surcharge day is charged; the consent is deemed withdrawn from the day after.</Declared>
      <TileGrid>
        <Tile label="fee-day-210: surcharge days, status" value={`${d210.payment.surchargeDays}, ${d210.payment.status}`} />
        <Tile label="fee-day-210: surcharge" value={six(d210.payment.surcharge)} />
        <Tile label="fee-day-211: status" value={d211.payment.status} />
      </TileGrid>
      <Source text={d90.basis.source} />
      <Declared title="READING FOUR: HOW A SIMPLE-INTEREST UPLIFT IS PAID (devcarry-ekene-simple-ot18360)">The engine&apos;s basis:</Declared>
      <EngineNote text={simple.basis.uplift} />
      <EngineNote text={simple.basis.note} />
      <Source text={simple.basis.source} />
      <Declared title="A STATED INPUT, NO READING: THE VALUE OF THE TRANSACTION (fee-ekene)">The engine&apos;s basis:</Declared>
      <EngineNote text={value.basis.value} />
      <Source text={value.basis.source} />
      <Note>No graded figure in this course depends on any of these readings.</Note>
    </>
  );
};

const ValuationCalculator = ({ initialMode = 'information', initialCase = null, initialText = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Valuation calculator"
      subtitle="The value of information to each side, risk sharing, a price for a working interest, a development carry and a back-in after the farm-in, and the readings the engine states."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'information' && <InformationMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'risk' && <RiskMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'price' && <PriceMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'devCarry' && <DevCarryMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'backIn' && <BackInMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'deal' && <DealMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'readings' && <ReadingsMode />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Ekene Deep farm-out is synthetic; paste your own terms, or a whole case file, to replace it.</Note>
    </PanelShell>
  );
};

export default ValuationCalculator;
