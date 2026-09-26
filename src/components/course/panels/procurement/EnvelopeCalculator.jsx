import React, { useState } from 'react';
import {
  parseNumber, parseJson, pretty, WS_BIDS, WS_TECH_BIDS, WS_CRITERIA, WS_TENDER, WELL_SERVICES_SETTINGS, commercialBidOf,
  technicalOf, arithmeticOf, evaluatedOf, rankOf, tenderOf, DEFAULTS,
} from './tenderLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, list, Tbl, TextField, Refusal, Declared, Source,
} from './panelBits';

// The envelope calculator (Associate): the two-envelope evaluation by hand.
// Score the technical envelope against a pass mark, correct a priced bill,
// build each passing bid's evaluated cost, weigh the technical and commercial
// scores, and run a whole tender in one call. Every figure is a return value
// of the vendored tender engine through tenderLab, on the Ekene well services
// tender as it starts or on the bids, criteria and settings you paste. This is
// the course's own calculator: there is no Suite app for this course.

export const MODES = [
  ['technical', 'The technical envelope'],
  ['arithmetic', 'Arithmetic correction of a bill'],
  ['evaluated', 'Evaluated cost of the passing bids'],
  ['combined', 'The combined score'],
  ['tender', 'The whole tender in one call'],
];

const scoresOnly = (bids) => bids.map((b) => ({ id: b.id, mandatory: b.mandatory, scores: b.scores }));
const commercialOnly = (bids) => bids.map(commercialBidOf);

export const TechnicalMode = () => {
  const [crit, setCrit] = useState(pretty(WS_CRITERIA));
  const [bids, setBids] = useState(pretty(scoresOnly(WS_BIDS)));
  const [pass, setPass] = useState(String(WELL_SERVICES_SETTINGS.passMark));
  const c = parseJson(crit); const b = parseJson(bids);
  const r = c.error || b.error ? null : technicalOf({ criteria: c.value, bids: b.value, passMark: parseNumber(pass) });
  return (
    <>
      <FieldGrid>
        <TextField label="Criteria (JSON array of { id, weight, maxScore }; the weights sum to 100)" value={crit} onChange={setCrit} rows={5} />
        <TextField label="Bids (JSON array of { id, mandatory, scores })" value={bids} onChange={setBids} rows={8} />
        <NumField label="Pass mark (percent)" value={pass} onChange={setPass} />
      </FieldGrid>
      {c.error && <Note>{c.error}</Note>}
      {b.error && <Note>{b.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl head={['bid', 'status', 'technicalPercent', 'weightedPoints', 'reason']} rows={r.bids.map((x) => [x.id, x.status, six(x.technicalPercent), six(x.weightedPoints), x.reason || ''])} />
          <TileGrid>
            <Tile label="Passed" value={list(r.passed)} />
            <Tile label="Excluded" value={String(r.excluded.length)} />
          </TileGrid>
          <Declared title="THE SCORE, in the engine's words">{r.basis.score}</Declared>
          <Declared title="THE PASS MARK, in the engine's words">{r.basis.passMark}</Declared>
          <Source basis={r.basis} />
        </>
      )}
      <Note>A bid that fails a mandatory requirement is not scored. A bid below the pass mark is scored and its commercial envelope is never opened.</Note>
    </>
  );
};

export const ArithmeticMode = () => {
  const [lines, setLines] = useState(pretty(WS_BIDS[1].lines));
  const [total, setTotal] = useState('');
  const [tol, setTol] = useState(String(DEFAULTS.ARITHMETIC_TOLERANCE));
  const l = parseJson(lines);
  const qt = parseNumber(total);
  const r = l.error ? null : arithmeticOf({ lines: l.value, tolerance: parseNumber(tol), ...(qt === undefined ? {} : { quotedTotal: qt }) });
  return (
    <>
      <FieldGrid>
        <TextField label="Bill lines (JSON array of { id, quantity, unitRate, quotedAmount, decimalMisplaced })" value={lines} onChange={setLines} rows={8} />
        <NumField label="Quoted total (blank: the sum of the lines)" value={total} onChange={setTotal} />
        <NumField label="Tolerance" value={tol} onChange={setTol} />
      </FieldGrid>
      {l.error && <Note>{l.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl head={['line', 'quantity', 'unit rate', 'quoted', 'corrected unit rate', 'corrected amount', 'rule']} rows={r.lines.map((x) => [x.id, six(x.quantity), six(x.unitRate), six(x.quotedAmount), six(x.correctedUnitRate), six(x.correctedAmount), x.rule || 'none'])} />
          <TileGrid>
            <Tile label="Quoted total" value={six(r.quotedTotal)} />
            <Tile label="Corrected total" value={six(r.correctedTotal)} />
            <Tile label="Correction" value={six(r.correction)} />
            <Tile label="Lines corrected" value={String(r.linesCorrected)} />
          </TileGrid>
          {r.reasons.map((x) => <Note key={x}>{x}</Note>)}
          <Declared title="THE RULE, in the engine's words">{r.basis.rule}</Declared>
          <Source basis={r.basis} />
        </>
      )}
    </>
  );
};

export const EvaluatedMode = () => {
  const passed = technicalOf({ criteria: WS_CRITERIA, bids: WS_TECH_BIDS, passMark: WELL_SERVICES_SETTINGS.passMark }).passed;
  const [bids, setBids] = useState(pretty(commercialOnly(WS_BIDS.filter((b) => passed.includes(b.id)))));
  const [rule, setRule] = useState('average');
  const [minW, setMinW] = useState(String(WELL_SERVICES_SETTINGS.schedule.minWeeks));
  const [maxW, setMaxW] = useState(String(WELL_SERVICES_SETTINGS.schedule.maxWeeks));
  const [rate, setRate] = useState(String(WELL_SERVICES_SETTINGS.schedule.ratePerWeek));
  const b = parseJson(bids);
  const r = b.error ? null : evaluatedOf({ bids: b.value, omissionRule: rule, schedule: { minWeeks: parseNumber(minW), maxWeeks: parseNumber(maxW), ratePerWeek: parseNumber(rate) } });
  return (
    <>
      <FieldGrid>
        <TextField label="Passing bids (JSON array of { id, receivedAt, lines, discount, deviations, omitted, completionWeeks })" value={bids} onChange={setBids} rows={8} />
        <SelectField label="Omission rule" value={rule} onChange={setRule} options={[['average', 'average (cited)'], ['highest', 'highest (not from the cited texts)']]} />
        <NumField label="minWeeks" value={minW} onChange={setMinW} />
        <NumField label="maxWeeks" value={maxW} onChange={setMaxW} />
        <NumField label="ratePerWeek" value={rate} onChange={setRate} />
      </FieldGrid>
      {b.error && <Note>{b.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl head={['rank', 'bid', 'corrected price', 'discount', 'deviations', 'omissions', 'schedule', 'evaluated cost']} rows={r.bids.map((x) => [String(x.rank), x.id, six(x.correctedPrice), six(x.discount), six(x.deviationTotal), six(x.omissionTotal), six(x.scheduleAdjustment), six(x.evaluatedCost)])} />
          <TileGrid>
            <Tile label="Lowest evaluated cost" value={String(r.lowestEvaluatedCost)} />
            <Tile label="Excluded" value={String(r.excluded.length)} />
          </TileGrid>
          {r.bids.flatMap((x) => x.reasons.map((t) => <Note key={`${x.id}${t}`}>{`${x.id}: ${t}`}</Note>))}
          {r.excluded.map((x) => <Note key={x.id}>{`${x.id} excluded: ${x.reason}`}</Note>)}
          <Declared title="THE EVALUATED COST, in the engine's words">{r.basis.evaluatedCost}</Declared>
          <Declared title="THE OMISSION RULE, in the engine's words">{r.basis.omission}</Declared>
          <Source basis={r.basis} />
        </>
      )}
    </>
  );
};

export const CombinedMode = () => {
  const start = tenderOf(JSON.parse(JSON.stringify(WS_TENDER)));
  const rows = start.ranking ? start.ranking.bids.map((x) => ({ id: x.id, technicalPercent: x.technicalPercent, evaluatedCost: x.evaluatedCost, receivedAt: x.receivedAt })) : [];
  const [bids, setBids] = useState(pretty(rows));
  const [tw, setTw] = useState(String(WELL_SERVICES_SETTINGS.technicalWeight));
  const [pm, setPm] = useState(WELL_SERVICES_SETTINGS.priceMethod);
  const [tm, setTm] = useState(WELL_SERVICES_SETTINGS.technicalMethod);
  const b = parseJson(bids);
  const r = b.error ? null : rankOf({ bids: b.value, technicalWeight: parseNumber(tw), priceMethod: pm, technicalMethod: tm });
  return (
    <>
      <FieldGrid>
        <TextField label="Bids (JSON array of { id, technicalPercent, evaluatedCost, receivedAt })" value={bids} onChange={setBids} rows={6} />
        <NumField label="Technical weight (0 to 1)" value={tw} onChange={setTw} />
        <SelectField label="Price method" value={pm} onChange={setPm} options={[['lowest-ratio', 'lowest-ratio'], ['linear', 'linear (Professional)']]} />
        <SelectField label="Technical method" value={tm} onChange={setTm} options={[['relative', 'relative'], ['absolute', 'absolute']]} />
      </FieldGrid>
      {b.error && <Note>{b.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl head={['rank', 'bid', 'St', 'Sc', 'B', 'tie broken by']} rows={r.bids.map((x) => [String(x.rank), x.id, six(x.technicalScore), six(x.commercialScore), six(x.combinedScore), x.tieBrokenBy || ''])} />
          <TileGrid>
            <Tile label="Most advantageous" value={String(r.mostAdvantageous)} />
            <Tile label="Cmin" value={six(r.cMin)} />
            <Tile label="Thigh" value={six(r.tHigh)} />
          </TileGrid>
          <Declared title="THE COMBINED SCORE, in the engine's words">{`${r.basis.combined}; ${r.basis.technical}; ${r.basis.commercial}`}</Declared>
          <Declared title="THE RANKING, in the engine's words">{r.basis.ranking}</Declared>
          <Source basis={r.basis} />
        </>
      )}
    </>
  );
};

export const TenderMode = () => {
  const [text, setText] = useState(pretty(WS_TENDER));
  const t = parseJson(text);
  const r = t.error ? null : tenderOf(t.value);
  return (
    <>
      <FieldGrid>
        <TextField label="The tender (JSON: criteria, passMark, bids, omissionRule, schedule, award, technicalWeight, priceMethod, technicalMethod)" value={text} onChange={setText} rows={10} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Award" value={String(r.award)} />
            <Tile label="Lowest evaluated cost" value={String(r.commercial ? r.commercial.lowestEvaluatedCost : 'none')} />
          </TileGrid>
          <Note>{r.reason}</Note>
          {r.commercial && <Tbl head={['rank', 'bid', 'evaluated cost']} rows={r.commercial.bids.map((x) => [String(x.rank), x.id, six(x.evaluatedCost)])} />}
          <Tbl head={['excluded', 'stage', 'reason']} rows={r.excluded.map((x) => [x.id, x.stage, x.reason])} />
          {r.basis.stages && <Declared title="THE STAGES, in the engine's words">{r.basis.stages}</Declared>}
          <Source basis={r.basis} extra={r.basis.award} />
        </>
      )}
    </>
  );
};

const EnvelopeCalculator = ({ initialMode = 'technical' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Envelope calculator"
      subtitle="The technical envelope, arithmetic correction, the evaluated cost, the combined score and the whole tender."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'technical' && <TechnicalMode />}
        {mode === 'arithmetic' && <ArithmeticMode />}
        {mode === 'evaluated' && <EvaluatedMode />}
        {mode === 'combined' && <CombinedMode />}
        {mode === 'tender' && <TenderMode />}
      </div>
      <Note>
        {`This is the course's own calculator: every number on it is a return value of the vendored tender engine. The Ekene well services tender (${WS_BIDS.length} bids) is synthetic; paste your own bids to replace it.`}
      </Note>
    </PanelShell>
  );
};

export default EnvelopeCalculator;
