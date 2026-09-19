import React, { useMemo, useState } from 'react';
import {
  interval, compare, minlikePValue, ruleOfThree, parseNumber, intervalLadder, zeroEvents, twoRates, STREAMS,
} from './safetystatsLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, twelve, Tbl, Refusal, Declared, Derived, BASE_OPTIONS, CONFIDENCE_OPTIONS, safe,
} from './panelBits';

// The intervals explorer (Professional): the Garwood exact interval on any
// count, zero events, and comparing two rates by the conditional exact test.
// Every figure is a return value of the vendored engine through
// safetystatsLab, except the one row labelled DERIVED: the minlike p-value the
// engine declines, shown so the difference between the two conventions can be
// seen. A confidence interval here is an interval on an estimated rate, and no
// percentile label is used for it.

export const MODES = [
  ['interval', 'The Garwood exact interval on a count'],
  ['zero', 'Zero events, and the rule of three'],
  ['compare', 'Comparing two rates, and the p-value convention'],
  ['ladder', 'The same observed rate at growing exposure'],
];

const baseOf = (s) => (s === '' ? undefined : Number(s));
const confOf = (s) => (s === '' ? undefined : Number(s));

export const IntervalMode = () => {
  const [count, setCount] = useState('7');
  const [hours, setHours] = useState('400000');
  const [base, setBase] = useState('200000');
  const [conf, setConf] = useState('0.95');
  const r = useMemo(() => interval({
    count: parseNumber(count), exposureHours: parseNumber(hours), base: baseOf(base), confidence: confOf(conf),
  }), [count, hours, base, conf]);
  return (
    <>
      <FieldGrid>
        <NumField label="Event count" value={count} onChange={setCount} />
        <NumField label="Exposure hours" value={hours} onChange={setHours} />
        <SelectField label="Base" value={base} onChange={setBase} options={BASE_OPTIONS} />
        <SelectField label="Confidence, a fraction" value={conf} onChange={setConf} options={CONFIDENCE_OPTIONS} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <>
          <TileGrid>
            <Tile label="Observed rate" value={six(r.rate)} unit={r.basis.baseLabel} />
            <Tile label="Lower limit" value={six(r.lower)} />
            <Tile label="Upper limit" value={six(r.upper)} />
            <Tile label="Count limits" value={`${twelve(r.countLower)} to ${twelve(r.countUpper)}`} />
          </TileGrid>
          <Declared title="THE METHOD THE ENGINE REPORTS">{r.basis.method}</Declared>
        </>
      )}
      <Note>
        The lower limit uses 2N degrees of freedom and the upper uses 2N + 2, and each tail gets half the miss, so the
        interval never covers less than its nominal level. The defaults here are the BLS worked example.
      </Note>
    </>
  );
};

export const ZeroMode = ({ z }) => {
  const [hours, setHours] = useState(String(STREAMS.ABO.hours));
  const [base, setBase] = useState('200000');
  const rows = useMemo(() => [0.8, 0.9, 0.95, 0.99].map((c) => ({
    c, r: interval({ count: 0, exposureHours: parseNumber(hours), base: baseOf(base), confidence: c }),
  })), [hours, base]);
  const bad = rows.find((x) => x.r.error);
  const h = parseNumber(hours);
  const b = baseOf(base);
  return (
    <>
      <FieldGrid>
        <NumField label="Exposure hours with no events" value={hours} onChange={setHours} />
        <SelectField label="Base" value={base} onChange={setBase} options={BASE_OPTIONS} />
      </FieldGrid>
      {bad ? <Refusal r={bad.r} /> : (
        <>
          <Tbl head={['confidence', 'count upper', 'rate upper', 'rate lower']} rows={rows.map(({ c, r }) => [six(c), twelve(r.countUpper), six(r.upper), six(r.lower)])} />
          <Derived>The rule of three on these hours is 3 times the base over the hours: {six(ruleOfThree({ exposureHours: h, base: b }))}.</Derived>
        </>
      )}
      <Note>
        Zero events is a measurement: it bounds the rate from above. The engine&apos;s central 95 percent interval puts
        2.5 percent in the upper tail, so its limit sits above the rule of three, which is a one-sided 95 percent figure.
      </Note>
      {z && <Note>ABO, the teaching crew: {z.hours} hours with no recordables.</Note>}
    </>
  );
};

export const CompareMode = ({ t }) => {
  const N = STREAMS.UTOROGU;
  const [c1, setC1] = useState(String(N.north.count));
  const [h1, setH1] = useState(String(N.north.hours));
  const [c2, setC2] = useState(String(N.south.count));
  const [h2, setH2] = useState(String(N.south.hours));
  const [conf, setConf] = useState('0.95');
  const args = {
    count1: parseNumber(c1), exposureHours1: parseNumber(h1), count2: parseNumber(c2), exposureHours2: parseNumber(h2),
  };
  const r = compare({ ...args, confidence: confOf(conf) });
  const ml = r.error ? null : minlikePValue(args);
  return (
    <>
      <FieldGrid>
        <NumField label="Group 1 count" value={c1} onChange={setC1} />
        <NumField label="Group 1 hours" value={h1} onChange={setH1} />
        <NumField label="Group 2 count" value={c2} onChange={setC2} />
        <NumField label="Group 2 hours" value={h2} onChange={setH2} />
        <SelectField label="Confidence, a fraction" value={conf} onChange={setConf} options={CONFIDENCE_OPTIONS} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <>
          <TileGrid>
            <Tile label="Rate ratio, group 1 over group 2" value={r.rateRatio === null ? 'unbounded' : six(r.rateRatio)} />
            <Tile label="Rate ratio interval" value={`${six(r.rateRatioLower)} to ${r.rateRatioUpper === null ? 'unbounded' : six(r.rateRatioUpper)}`} />
            <Tile label="Central two-sided p-value" value={six(r.pValue)} />
            <Tile label="Expected proportion, from the hours" value={six(r.expectedProportion)} />
          </TileGrid>
          <Tbl head={['what', 'value']} rows={[['lower tail', six(r.lowerTail)], ['upper tail', six(r.upperTail)], ['upper unbounded', String(r.upperUnbounded)]]} />
          {r.reason && <Note>{r.reason}</Note>}
          <Derived>The minlike p-value of R and scipy on these counts: {six(ml)}.</Derived>
          <Declared title="THE CONVENTION THE ENGINE CHOSE">{r.basis.method}</Declared>
        </>
      )}
      {t && (
        <Note>
          ERHA, the teaching pair: central p-value {six(t.erha.pValue)}, rate ratio {six(t.erha.rateRatio)}. UTOROGU,
          the default above: central {six(t.utorogu.pValue)} against a derived minlike {six(t.utorogu.minlikeDerived)}.
        </Note>
      )}
    </>
  );
};

export const LadderMode = ({ l }) => (
  <>
    {l ? (
      <Tbl
        head={['count', 'hours', 'rate', 'lower 95', 'upper 95']}
        rows={l.map((x) => [String(x.count), String(x.hours), six(x.rate), six(x.lower), six(x.upper)])}
      />
    ) : <Note>The ladder did not return.</Note>}
    <Note>Every row reads the same rate. A rate with no interval beside it hides which row it came from.</Note>
  </>
);

const IntervalsExplorer = ({ initialMode = 'interval' }) => {
  const [mode, setMode] = useState(initialMode);
  const z = useMemo(() => (mode === 'zero' ? safe(zeroEvents) : null), [mode]);
  const t = useMemo(() => (mode === 'compare' ? safe(twoRates) : null), [mode]);
  const l = useMemo(() => (mode === 'ladder' ? safe(intervalLadder) : null), [mode]);
  return (
    <PanelShell
      title="Intervals explorer"
      subtitle="An event count is one draw from the Poisson count model. The exact interval says how far the true rate could be from the observed one, and the conditional test compares two rates without a base."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'interval' && <IntervalMode />}
        {mode === 'zero' && <ZeroMode z={z} />}
        {mode === 'compare' && <CompareMode t={t} />}
        {mode === 'ladder' && <LadderMode l={l} />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored safety statistics engine, apart from the one row
        labelled derived. Confidence is a fraction and has no default.
      </Note>
    </PanelShell>
  );
};

export default IntervalsExplorer;
