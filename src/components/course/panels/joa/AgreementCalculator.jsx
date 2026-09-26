import React, { useState } from 'react';
import {
  STARTS, pick, viewSoleRisk, viewBuyIn, pscOf, defaultOf, READING_CASES,
} from './joaLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, orNone, Tbl, Refusal, EngineNote, Reasons, Source, useJsonBox, StatedControl, MissingStated, Declared,
} from './panelBits';
import { Box } from './AccountCalculator';
import { CarryMode, PscMode, DefaultMode } from './RecoveryCalculator';

// The agreement calculator (Expert): sole risk and non-consent with the premium
// and its recovery from production, buy-in at a stated multiple, a carry with
// its NPV, PSC cost recovery, a default and forfeiture, and the three readings
// the engine states, each printed from the engine's own basis where it acts.
// Every figure is a return value of the vendored engine
// (engines/economics/jointVenture.js) through joaLab. This is the course's own
// calculator: there is no Suite app for this course.

export const MODES = [
  ['soleRisk', 'Sole risk: the premium recovered from production'],
  ['buyIn', 'Buy-in at a stated multiple'],
  ['carry', 'A carry, its recovery and the NPV'],
  ['psc', 'PSC cost recovery'],
  ['default', 'A default and forfeiture'],
  ['readings', 'The three stated readings'],
];

const MODE_OPTIONS = [['recover-from-production', 'recovered from production (recover-from-production)'], ['buy-in', 'a buy-in payment (buy-in)']];

const NonConsentControls = ({ box, viewKey }) => (
  <>
    <FieldGrid>
      <StatedControl box={box} viewKey={viewKey} path="mode" label="Mode (stated)" options={MODE_OPTIONS} />
      <StatedControl box={box} viewKey={viewKey} path="premiumMultiplePct" label="Premium multiple, percent (stated)" />
    </FieldGrid>
    <MissingStated box={box} viewKey={viewKey} required={[['mode', 'mode'], ['premiumMultiplePct', 'premiumMultiplePct']]} />
  </>
);

export const SoleRiskMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'soleRisk') : STARTS.soleRisk, initialText);
  const r = box.parsed.error ? null : viewSoleRisk(box.parsed.value);
  return (
    <>
      <NonConsentControls box={box} viewKey="soleRisk" />
      <Box box={box} label="nonConsent inputs (JSON: parties, consenting, operation, premiumMultiplePct, mode, years), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['consenting party', 'participating interest', 'share of the project', 'cost paid']}
            rows={r.consenting.map((s) => [s.id, six(s.participatingPct), six(s.projectPct), six(s.cost)])} />
          <Tbl head={['party', 'participating interest', 'proportionate share of the cost', 'premium']}
            rows={r.nonConsenting.map((n) => [n.id, six(n.participatingPct), six(n.costShare), six(n.premium)])} />
          {r.recovery && (
            <>
              <Tbl head={['party year', 'opening', 'due', 'share of net value', 'recovered', 'closing', 'non-consenting party receives']}
                rows={r.recovery.flatMap((x) => x.ledger.map((l) => [`${x.id} ${l.year}`, six(l.opening), six(l.due), six(l.share), six(l.recovered), six(l.closing), six(l.nonConsentingReceives)]))} />
              <TileGrid>
                {r.recovery.map((x) => <Tile key={x.id} label={`${x.id} reverts in`} value={orNone(x.revertsInYear)} />)}
              </TileGrid>
            </>
          )}
          {r.buyIn && (
            <Tbl head={['payer to party', 'amount received']}
              rows={r.buyIn.flatMap((b) => b.toParties.map((t) => [`${b.id} to ${t.id}`, six(t.amount)]))} />
          )}
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.multiple} />
          {r.basis.recovery && <EngineNote text={r.basis.recovery} />}
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

export const BuyInMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'buyIn') : STARTS.buyIn, initialText);
  const r = box.parsed.error ? null : viewBuyIn(box.parsed.value);
  return (
    <>
      <NonConsentControls box={box} viewKey="buyIn" />
      <Box box={box} label="nonConsent inputs for a buy-in (JSON: parties, consenting, operation, premiumMultiplePct, mode), or a whole case file" rows={12} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['consenting party', 'participating interest', 'share of the project', 'cost paid']}
            rows={r.consenting.map((s) => [s.id, six(s.participatingPct), six(s.projectPct), six(s.cost)])} />
          {r.buyIn && (
            <>
              <Tbl head={['payer to party', 'amount received']}
                rows={r.buyIn.flatMap((b) => b.toParties.map((t) => [`${b.id} to ${t.id}`, six(t.amount)]))} />
              <TileGrid>
                {r.buyIn.map((b) => <Tile key={b.id} label={`${b.id} pays to enter`} value={six(b.payment)} />)}
              </TileGrid>
            </>
          )}
          {r.recovery && <Note>This box states recovery from production: the sole risk view prints its ledger.</Note>}
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.multiple} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

/** The three readings the engine states, each read from the engine's own basis on the golden input where it acts. */
export const ReadingsMode = () => {
  const tax = pscOf(READING_CASES.tax);
  const grace = defaultOf(READING_CASES.grace);
  const inside = defaultOf(READING_CASES.graceInside);
  const cover = defaultOf(READING_CASES.cover);
  const limit = pscOf(READING_CASES.limitBase);
  const bound = tax.years.find((y) => y.poolOut > 0 && y.grossRevenue > 0);
  return (
    <>
      <Declared title="Reading one: the PSC income tax, in the engine's words">{tax.basis.tax}</Declared>
      <TileGrid>
        <Tile label={`The Ekene PSC, ${bound.year}: cost recovered`} value={six(bound.costRecovered)} />
        <Tile label={`${bound.year}: contractor profit oil`} value={six(bound.contractorProfitOil)} />
        <Tile label={`${bound.year}: tax`} value={six(bound.tax)} />
      </TileGrid>
      <Declared title="Reading two: the grace, in the engine's words">{grace.basis.grace}</Declared>
      <TileGrid>
        <Tile label={`Cured after ${grace.defaulters[0].days} days: default interest`} value={six(grace.interestTotal)} />
        <Tile label={`Cured after ${inside.defaulters[0].days} days: default interest`} value={six(inside.interestTotal)} />
      </TileGrid>
      <Declared title="Reading three: the cover, in the engine's words">{cover.basis.cover}</Declared>
      <Tbl head={['party', 'paying interest', 'cover percent', 'cover']}
        rows={cover.cover.map((c) => [c.id, six(c.payingPct), six(c.coverPct), six(c.cover)])} />
      <Declared title="The limit base is a stated input, in the engine's words">{limit.basis.limitBase}</Declared>
      <Source text={tax.basis.source} />
      <Note>No graded figure depends on any of these readings: each capstone value is the same number under each reading and under the alternative it names.</Note>
    </>
  );
};

const AgreementCalculator = ({ initialMode = 'soleRisk', initialCase = null, initialText = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Agreement calculator"
      subtitle="Sole risk and non-consent, buy-in, a carry with its NPV, PSC cost recovery, a default and forfeiture, and the three readings the engine states."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'soleRisk' && <SoleRiskMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'buyIn' && <BuyInMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'carry' && <CarryMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'psc' && <PscMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'default' && <DefaultMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'readings' && <ReadingsMode />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Ekene joint venture is synthetic; paste your own terms, or a whole case file, to replace it.</Note>
    </PanelShell>
  );
};

export default AgreementCalculator;
