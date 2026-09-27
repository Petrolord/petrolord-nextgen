import React, { useState } from 'react';
import { STARTS, viewRun } from './prmsLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, Refusal, EngineNote, Reasons, Source, StatedControl, MissingStated, BlockSelector, BOOL, castBool,
} from './panelBits';
import {
  Box, Starts, useViewBox, ClassifyMode, CategorizeMode,
} from './ClassificationCalculator';

// The reserves calculator (Professional): the project maturity sub-classes and
// the commerciality criteria (the classification view), incremental and
// cumulative categories (the categories view), and the economic limit of three
// technical forecasts through the canonical cash flow of cashflow.ts, with the
// Reserves categories on a stated reporting basis, the licence cut and the
// entitlement. Every figure is a return value of the vendored engine
// (engines/economics/prms.js) through prmsLab. This is the course's own
// calculator: there is no Suite app for this course.

const ROYALTY_FORMS = [['royalty-interest', 'a royalty interest: deducted from the volumes (royalty-interest)'], ['production-tax', 'a production tax: no volume deducted (production-tax)']];
const BASES = [['gross', 'gross, at 100 percent (gross)'], ['working-interest', 'at the working interest (working-interest)'], ['net-entitlement', 'net entitlement, less a royalty interest (net-entitlement)']];

/**
 * Every scalar input of an economic limit, each a visible control that writes
 * the stated input into the block. The three technical forecasts, the prices
 * and the opex and capex rows are one row a year, and they are stated in the
 * box beside the controls: each row is visible there and read as it stands.
 */
export const EconomicLimitControls = ({ box, viewKey }) => (
  <>
    <FieldGrid>
      <StatedControl box={box} viewKey={viewKey} path="effectiveYear" label="Effective year (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="royalty.ratePct" label="Royalty, percent (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="royalty.form" label="Royalty form (stated)" options={ROYALTY_FORMS} />
      <StatedControl box={box} viewKey={viewKey} path="tax.ratePct" label="Tax rate, percent (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="tax.depreciationYears" label="Straight-line allowance life, years (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="tax.lossCarryforward" label="Loss carry forward (stated)" options={BOOL} cast={castBool} />
      <StatedControl box={box} viewKey={viewKey} path="workingInterestPct" label="Working interest, percent (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="licence.expiryYear" label="Licence expiry year (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="licence.renewalExpected" label="Renewal expected (stated)" options={BOOL} cast={castBool} />
      <StatedControl box={box} viewKey={viewKey} path="reportingBasis" label="Reporting basis (stated)" options={BASES} />
      <StatedControl box={box} viewKey={viewKey} path="discountRatePct" label="Discount rate, percent (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="mscfPerBoe" label="Mscf per BOE (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="costs.abandonment" label="Abandonment cost (stated, 0 for none)" />
    </FieldGrid>
    <MissingStated box={box} viewKey={viewKey} required={[
      ['forecasts.low', 'the low forecast'], ['forecasts.best', 'the best forecast'], ['forecasts.high', 'the high forecast'], ['prices', 'the prices'],
      ['costs.opex', 'the opex rows'], ['costs.capex', 'the capex rows (an empty list for none)'], ['royalty.form', 'royalty.form'], ['tax.lossCarryforward', 'tax.lossCarryforward'],
      ['licence.renewalExpected', 'licence.renewalExpected'], ['reportingBasis', 'reportingBasis'], ['mscfPerBoe', 'mscfPerBoe']]} />
    <Note>The three technical forecasts (oil in barrels and gas in Mscf, one row a year from the effective year), the prices (one row a year) and the opex and capex rows are stated in the box below.</Note>
  </>
);

/** What the engine returns for an economic limit. */
export const EconomicLimitResult = ({ r }) => (
  <>
    <Tbl head={['case', 'forecast', 'licence cut', 'economic limit', 'trailing years cut', 'economic', 'undiscounted net cash flow at 100%', 'undiscounted net cash flow at the working interest', 'NPV at 100%', 'NPV at the working interest']}
      rows={['low', 'best', 'high'].map((k) => { const c = r.cases[k]; return [k, `${c.forecastYears[0]} to ${c.forecastYears[1]}`, c.licenceCutYear === null ? 'none' : String(c.licenceCutYear), String(c.economicLimitYear), String(c.yearsTrimmed), String(c.economic), six(c.undiscountedNetCashFlow), six(c.undiscountedNetCashFlowShare), six(c.npv), six(c.npvShare)]; })} />
    <Tbl head={['case', 'technical oil', 'oil beyond the licence', 'oil beyond the limit', 'economic oil, gross', 'reported oil', 'reported gas', 'reported BOE']}
      rows={['low', 'best', 'high'].map((k) => { const c = r.cases[k]; return [k, six(c.technical.oil), six(c.beyondLicence.oil), six(c.beyondEconomicLimit.oil), six(c.economicGross.oil), six(c.reported.oil), six(c.reported.gas), six(c.reported.boe)]; })} />
    {r.reserves && (
      <Tbl head={['category', 'oil', 'gas', 'BOE']}
        rows={[...Object.entries(r.reserves.cumulative), ...Object.entries(r.reserves.incremental)].map(([k, q]) => [k, six(q.oil), six(q.gas), six(q.boe)])} />
    )}
    <TileGrid>
      <Tile label="Reporting basis" value={r.reportingBasis} />
      <Tile label="1P set to 0 (the low case fails)" value={r.reserves ? String(r.reserves.provedZero) : 'no Reserves'} />
    </TileGrid>
    <EngineNote text={r.status} />
    <Reasons items={r.reasons} />
    <EngineNote text={r.basis.economicLimit} />
    <EngineNote text={r.basis.entitlement} />
    <Source text={`${r.basis.economicTest}; ${r.basis.licence}`} />
  </>
);

export const ECON_STARTS = [
  ['econEkene', 'EKN-1 Ekene Main waterflood, net entitlement'], ['econGross', 'EKN-1 reported gross'], ['econWorkingInterest', 'EKN-1 at the working interest'],
  ['econProductionTax', 'EKN-1 with the royalty as a production tax'], ['econRenewal', 'EKN-1 with a renewal expected'], ['econNoLossRelief', 'EKN-1 with no loss carry forward'],
  ['econFaq33', 'Low case fails (FAQ 3.3 example)'], ['econBestFails', 'The best case fails'], ['econExactlyZero', 'An undiscounted net cash flow of exactly 0'],
  ['econTailZeroKept', 'A last year at exactly 0'], ['econTailOneBelow', 'A last year one barrel short'], ['econLimitsDisagree', 'The two economic-limit rules disagree'],
];

export const EconomicLimitMode = ({ initialCase = null, initialText = null, initialBlock = null, starts = ECON_STARTS }) => {
  const { box, blocks, blockKey, setBlock } = useViewBox('economicLimit', STARTS[starts[0][0]], { initialCase, initialText, initialBlock });
  const r = box.parsed.error ? null : viewRun('economicLimit', box.parsed.value, blockKey);
  return (
    <>
      <Starts box={box} starts={starts} />
      <FieldGrid><BlockSelector blocks={blocks} value={blockKey} onChange={setBlock} /></FieldGrid>
      <EconomicLimitControls box={box} viewKey={blockKey} />
      <Box box={box} label="economicLimit inputs (JSON: effectiveYear, forecasts, prices, costs, royalty, tax, workingInterestPct, licence, reportingBasis, discountRatePct, mscfPerBoe), or a whole case file" rows={16} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && <EconomicLimitResult r={r} />}
    </>
  );
};

const PRO_CLASSIFY_STARTS = [
  ['classEkn2', 'EKN-2 Ekene infill wells (approved)'], ['classJustified', 'Justified for development'], ['classEkn1', 'EKN-1 on production'],
  ['classEkn4', 'EKN-4 development pending'], ['classEkn3', 'EKN-3 development on hold'], ['classEkn5', 'EKN-5 development unclarified'],
  ['classTimeFrame5', 'Development starting at five years'], ['classTimeFrame6', 'Development starting at six years'], ['classTimeFrame8', 'Eight years, a longer time-frame justified'],
  ['classEconomicsUndetermined', 'Economics undetermined'], ['classNoFirmIntention', 'No firm intention to proceed'], ['classFdp2', 'A commercial discovery two years on'],
  ['classEkn6', 'EKN-6 Ekene Deep prospect'], ['classEkn7', 'EKN-7 Ekene Shallow lead'], ['classPlay', 'A play'],
];
const PRO_CATEGORIZE_STARTS = [
  ['catFaq33', 'Incremental example (FAQ 3.3)'], ['catReservesCumulative', 'Ekene Main Reserves, stated cumulatively'],
  ['catZeroIncrement', 'A zero increment'], ['catContingentIncremental', 'Ekene North, stated incrementally'],
];

export const MODES = [
  ['classify', 'Sub-classes and the commerciality criteria'],
  ['categorize', 'Incremental and cumulative categories'],
  ['economicLimit', 'The economic limit and the entitlement'],
];

const ReservesCalculator = ({ initialMode = 'economicLimit', initialCase = null, initialText = null, initialBlock = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Reserves calculator"
      subtitle="The project maturity sub-class and the commerciality criteria, incremental and cumulative categories, and the economic limit of three technical forecasts with the Reserves on a stated basis."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'classify' && <ClassifyMode initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} starts={PRO_CLASSIFY_STARTS} />}
        {mode === 'categorize' && <CategorizeMode initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} starts={PRO_CATEGORIZE_STARTS} />}
        {mode === 'economicLimit' && <EconomicLimitMode initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine, and the cash flow underneath is the canonical one of cashflow.ts. The Ekene field is synthetic; paste your own inputs, or a whole case file, to replace it.</Note>
    </PanelShell>
  );
};

export default ReservesCalculator;
