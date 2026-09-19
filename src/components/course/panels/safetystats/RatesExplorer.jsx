import React, { useMemo, useState } from 'react';
import {
  rateOn, farOf, severityOn, pseOn, pooled, rolling, parseSeries, parseNumber,
  ratesAndBases, pooling, rollingWindows, STREAMS,
} from './safetystatsLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, SeriesField, Refusal, Declared, BASE_OPTIONS, safe,
} from './panelBits';

// The rates explorer (Associate): a rate on a NAMED base, the four rate
// functions, sum then divide, and the rolling window. Every figure is a return
// value of the vendored engine through safetystatsLab, on the teaching streams
// or on the counts and hours the learner types. The engine takes no default
// base, so neither does this panel: leave the base empty and the engine's own
// refusal is what appears.

export const MODES = [
  ['rate', 'A count over exposure hours, on a base you name'],
  ['kinds', 'FAR, the severity rate and the process safety event rate'],
  ['pool', 'Sum, then divide: pooling sites or periods'],
  ['rolling', 'The rolling rate over a trailing window'],
];

const baseOf = (s) => (s === '' ? undefined : Number(s));

export const RateMode = ({ t }) => {
  const U = STREAMS.UGHELLI;
  const [count, setCount] = useState(String(U.recordables));
  const [hours, setHours] = useState(String(U.hours));
  const [base, setBase] = useState('200000');
  const r = useMemo(() => rateOn({ count: parseNumber(count), exposureHours: parseNumber(hours), base: baseOf(base) }),
    [count, hours, base]);
  return (
    <>
      <FieldGrid>
        <NumField label="Event count" value={count} onChange={setCount} />
        <NumField label="Exposure hours" value={hours} onChange={setHours} />
        <SelectField label="Base" value={base} onChange={setBase} options={BASE_OPTIONS} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <TileGrid>
          <Tile label="Rate" value={six(r.rate)} unit={r.basis.baseLabel} />
          <Tile label="Formula the engine reports" value={r.basis.formula} />
        </TileGrid>
      )}
      {t && (
        <>
          <Note>The UGHELLI teaching stream on every base: the count and the hours never change, only the base.</Note>
          <Tbl head={['base, hours', 'recordable rate', 'the engine baseLabel']} rows={t.onBases.map((b) => [String(b.base), six(b.rate), b.baseLabel])} />
          <Tbl head={['case class', 'count', 'per 200,000 hours', 'per 1,000,000 hours']} rows={t.classes.map((c) => [c.name, String(c.count), six(c.per200k), six(c.per1m)])} />
          <Note>Two crews of the same headcount, one recordable each. The engine takes hours and has no headcount input.</Note>
          <Tbl head={['crew', 'hours', 'recordables', 'rate per 200,000 hours']} rows={t.crews.map((c) => [c.name, String(c.hours), String(c.recordables), six(c.rate)])} />
          <Declared title="THE BASE IS REQUIRED">
            OSHA TRIR and IOGP TRIR share three letters and differ by a factor of five, so the engine refuses a
            missing base rather than guessing one. Its own words: {t.noBase.error}
          </Declared>
        </>
      )}
    </>
  );
};

export const KindsMode = ({ t }) => {
  const U = STREAMS.UGHELLI;
  const [hours, setHours] = useState(String(U.hours));
  const [fatalities, setFatalities] = useState(String(U.fatalities));
  const [days, setDays] = useState(String(U.daysLost));
  const [sevBase, setSevBase] = useState('200000');
  const [tier, setTier] = useState('1');
  const [pse, setPse] = useState(String(U.tier1Pse));
  const [pseBase, setPseBase] = useState('200000');
  const h = parseNumber(hours);
  const far = farOf({ fatalities: parseNumber(fatalities), exposureHours: h });
  const sev = severityOn({ daysLost: parseNumber(days), exposureHours: h, base: baseOf(sevBase) });
  const ps = pseOn({ tier: tier === '' ? undefined : Number(tier), pseCount: parseNumber(pse), exposureHours: h, base: baseOf(pseBase) });
  return (
    <>
      <FieldGrid>
        <NumField label="Exposure hours" value={hours} onChange={setHours} />
        <NumField label="Fatalities" value={fatalities} onChange={setFatalities} />
        <NumField label="Days lost" value={days} onChange={setDays} />
        <SelectField label="Severity rate base" value={sevBase} onChange={setSevBase} options={BASE_OPTIONS} />
        <SelectField label="PSE tier (an input)" value={tier} onChange={setTier} options={[['1', 'Tier 1'], ['2', 'Tier 2'], ['3', 'Tier 3 (see the refusal)'], ['', 'no tier']]} />
        <NumField label="PSE count" value={pse} onChange={setPse} />
        <SelectField label="PSE base" value={pseBase} onChange={setPseBase} options={BASE_OPTIONS} />
      </FieldGrid>
      <TileGrid>
        <Tile label="Observed FAR, fixed base" value={far.error ? 'refused' : six(far.rate)} unit={far.error ? '' : far.basis.baseLabel} />
        <Tile label="Severity rate" value={sev.error ? 'refused' : six(sev.rate)} unit={sev.error ? '' : sev.basis.baseLabel} />
        <Tile label="PSE rate" value={ps.error ? 'refused' : six(ps.rate)} unit={ps.error ? '' : ps.basis.baseLabel} />
      </TileGrid>
      {far.error && <Refusal r={far} />}
      {sev.error && <Refusal r={sev} />}
      {ps.error && <Refusal r={ps} />}
      {!sev.error && <Declared title="THE SEVERITY RATE HAS NO SINGLE STANDARD">{sev.basis.note}</Declared>}
      {t && (
        <>
          <Tbl head={['severity rate base', 'rate']} rows={t.severityRates.map((s) => [String(s.base), six(s.rate)])} />
          <Tbl head={['tier', 'count', 'base', 'PSE rate']} rows={t.pse.map((p) => [String(p.tier), String(p.count), String(p.base), six(p.rate)])} />
        </>
      )}
      <Declared title="THE TIER IS AN INPUT">
        The engine rates Tier 1 and Tier 2 process safety events and does not classify them. Classification needs the
        API RP 754 threshold quantity tables, which are licensed and are not in the engine or this course.
      </Declared>
    </>
  );
};

export const PoolMode = ({ t }) => {
  const K = STREAMS.KWALE;
  const [counts, setCounts] = useState(K.counts.join(', '));
  const [hours, setHours] = useState(K.hours.join(', '));
  const [base, setBase] = useState('200000');
  const c = parseSeries(counts);
  const h = parseSeries(hours);
  const r = c.error || h.error ? null : pooled({ counts: c.values, exposureHours: h.values, base: baseOf(base) });
  return (
    <>
      <FieldGrid>
        <SeriesField label="Counts, one per site or period" value={counts} onChange={setCounts} />
        <SeriesField label="Exposure hours, in the same order" value={hours} onChange={setHours} />
        <SelectField label="Base" value={base} onChange={setBase} options={BASE_OPTIONS} />
      </FieldGrid>
      {(c.error || h.error) && <Note>{c.error || h.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Pooled rate, sum then divide" value={six(r.rate)} unit={r.basis.baseLabel} />
            <Tile label="Mean of the period rates, shown beside it" value={six(r.meanOfPeriodRates)} />
            <Tile label="Pooled count and hours" value={`${r.count} in ${r.exposureHours}`} />
            <Tile label="Periods with no hours" value={String(r.periodsWithoutHours)} />
          </TileGrid>
          <Tbl head={['period', 'count', 'hours', 'rate']} rows={r.periodRates.map((p, i) => [String(i + 1), String(c.values[i]), String(h.values[i]), p === null ? 'none: no hours' : six(p)])} />
          <Declared title="THE ENGINE NOTE, VERBATIM">{r.basis.note}</Declared>
        </>
      )}
      {t && <Note>KWALE, the teaching stream: pooled {six(t.rate)} against a mean of the site rates of {six(t.meanOfPeriodRates)}.</Note>}
    </>
  );
};

export const RollingMode = ({ t }) => {
  const A = STREAMS.AKASO;
  const [counts, setCounts] = useState(A.counts.join(', '));
  const [hours, setHours] = useState(A.hours.join(', '));
  const [win, setWin] = useState('12');
  const c = parseSeries(counts);
  const h = parseSeries(hours);
  const r = c.error || h.error ? null : rolling({ counts: c.values, exposureHours: h.values, base: 200000, windowPeriods: parseNumber(win) });
  return (
    <>
      <FieldGrid>
        <SeriesField label="Monthly counts" value={counts} onChange={setCounts} />
        <SeriesField label="Monthly exposure hours" value={hours} onChange={setHours} />
        <NumField label="Window, periods" value={win} onChange={setWin} />
      </FieldGrid>
      {(c.error || h.error) && <Note>{c.error || h.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <Tbl
          head={['window', 'periods', 'count', 'hours', 'rolling rate per 200,000', 'mean of the period rates', 'periods without hours']}
          rows={r.windows.map((w, i) => [String(i + 1), `${w.startIndex + 1} to ${w.endIndex + 1}`, String(w.count), String(w.exposureHours), w.rate === null ? 'none' : six(w.rate), w.meanOfPeriodRates === null ? 'none' : six(w.meanOfPeriodRates), String(w.periodsWithoutHours)])}
        />
      )}
      {t && <Note>AKASO, the teaching stream: {t.windows.length} complete twelve-month windows from fifteen months. {t.note}</Note>}
    </>
  );
};

const RatesExplorer = ({ initialMode = 'rate' }) => {
  const [mode, setMode] = useState(initialMode);
  const t1 = useMemo(() => (mode === 'rate' || mode === 'kinds' ? safe(ratesAndBases) : null), [mode]);
  const t2 = useMemo(() => (mode === 'pool' ? safe(pooling) : null), [mode]);
  const t3 = useMemo(() => (mode === 'rolling' ? safe(rollingWindows) : null), [mode]);
  return (
    <PanelShell
      title="Rates explorer"
      subtitle="A safety rate is a count times a base over exposure hours. Name the base, and see what the engine returns, or what it refuses and why."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'rate' && <RateMode t={t1} />}
        {mode === 'kinds' && <KindsMode t={t1} />}
        {mode === 'pool' && <PoolMode t={t2} />}
        {mode === 'rolling' && <RollingMode t={t3} />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored safety statistics engine. The engine does not
        classify a case as recordable or lost time: the count arrives classified.
      </Note>
    </PanelShell>
  );
};

export default RatesExplorer;
