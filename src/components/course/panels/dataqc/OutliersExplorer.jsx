import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  zOf, modifiedZOf, fencesOf, hampelOf, grubbsOf, mahalanobisOf, quantileOf, pairRows,
  parseSeries, parseNumber, outliersOnSmallSets, gammaRayOutliers, densityNeutron, DATASET,
} from './dataqcLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, list, Tbl, SeriesField, Refusal, Declared, Flags, Series, safe,
} from './panelBits';

// The outliers explorer (Professional): which values stand apart, and by which
// measure. The z-score and its ceiling, the median and MAD with the modified
// z-score, R6 R7 R8 quartiles and Tukey fences, the Hampel window, Grubbs for
// one outlier and the Mahalanobis distance. Every figure is a return value of
// the vendored engine through dataqcLab. A flag is a question about a value;
// nothing on this panel deletes one.

export const MODES = [
  ['z', 'The z-score and its ceiling'],
  ['modz', 'The median, the MAD and the modified z-score'],
  ['fences', 'Quartile rules and Tukey fences'],
  ['hampel', 'The Hampel window'],
  ['grubbs', 'Grubbs for one outlier'],
  ['mahalanobis', 'The Mahalanobis distance on two variables'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GAUGE = Series(DATASET.EKENE_GAUGE.readings);
const CORE = Series(DATASET.EKENE_CORE.porosity);

const useValues = (initial) => {
  const [text, setText] = useState(initial);
  const p = parseSeries(text);
  return { text, setText, values: p.values, bad: p.error };
};

export const ZMode = ({ t }) => {
  const s = useValues(GAUGE);
  const [sd, setSd] = useState('sample');
  const [thr, setThr] = useState('3');
  const r = s.bad ? null : zOf({ values: s.values, sd, threshold: parseNumber(thr) });
  return (
    <>
      <FieldGrid>
        <SeriesField label="Values" value={s.text} onChange={s.setText} />
        <SelectField label="Standard deviation" value={sd} onChange={setSd} options={[['sample', 'sample, n - 1 (the default)'], ['population', 'population, n']]} />
        <NumField label="Threshold on |z|" value={thr} onChange={setThr} />
      </FieldGrid>
      {s.bad && <Note>{s.bad}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Mean" value={six(r.mean)} />
            <Tile label="Standard deviation" value={six(r.sd)} />
            <Tile label="Largest |z|" value={six(r.maxAbsZ)} />
            <Tile label="Largest possible |z|, (n - 1) / sqrt(n)" value={six(r.maxPossibleAbsZ)} />
            <Tile label="Threshold reachable" value={String(r.thresholdReachable)} />
          </TileGrid>
          <Flags flags={r.flags} />
        </>
      )}
      <Note>With ten values no z-score can pass 3 with the sample standard deviation, however wild one of them is.</Note>
      {t && <Note>EKENE-3 gauge: largest |z| {six(t.gauge.maxAbsZ)} against a ceiling of {six(t.gauge.maxPossibleAbsZ)}.</Note>}
    </>
  );
};

export const ModZMode = ({ t }) => {
  const s = useValues(GAUGE);
  const [thr, setThr] = useState('3.5');
  const r = s.bad ? null : modifiedZOf({ values: s.values, threshold: parseNumber(thr) });
  return (
    <>
      <FieldGrid>
        <SeriesField label="Values" value={s.text} onChange={s.setText} />
        <NumField label="Threshold on |M|" value={thr} onChange={setThr} />
      </FieldGrid>
      {s.bad && <Note>{s.bad}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Median" value={six(r.median)} />
            <Tile label="MAD, raw" value={six(r.mad)} />
          </TileGrid>
          <Tbl head={['entry', 'value', 'modified z']} rows={s.values.map((v, i) => [String(i), v === null ? 'null' : String(v), six(r.scores[i])])} />
          <Declared title="THE FORMULA THE ENGINE REPORTS">{r.basis.formula}</Declared>
          <Flags flags={r.flags} />
        </>
      )}
      {t && <Note>EKENE-3 gauge: median {six(t.gauge.median)}, MAD {six(t.gauge.mad)}, modified z of the glitch {six(t.gauge.modifiedZ)}.</Note>}
    </>
  );
};

export const FencesMode = ({ t }) => {
  const s = useValues(Series(DATASET.EKENE_LOG.channels.GR.values.slice(130, 200)));
  const [k, setK] = useState('1.5');
  const [method, setMethod] = useState('R7');
  const r = s.bad ? null : fencesOf({ values: s.values, k: parseNumber(k), method });
  const qs = s.bad ? null : ['R6', 'R7', 'R8'].map((m) => [m, quantileOf(s.values, 0.25, m), quantileOf(s.values, 0.75, m)]);
  return (
    <>
      <FieldGrid>
        <SeriesField label="Values" value={s.text} onChange={s.setText} />
        <NumField label="k (1.5 inner, 3 far out)" value={k} onChange={setK} />
        <SelectField label="Quartile rule" value={method} onChange={setMethod} options={[['R7', 'R7 (Excel, R, numpy; the default)'], ['R6', 'R6 (NIST)'], ['R8', 'R8']]} />
      </FieldGrid>
      {s.bad && <Note>{s.bad}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Q1" value={six(r.q1)} />
            <Tile label="Q3" value={six(r.q3)} />
            <Tile label="Lower fence" value={six(r.lower)} />
            <Tile label="Upper fence" value={six(r.upper)} />
          </TileGrid>
          <Flags flags={r.flags} />
          {qs && !qs.some(([, a]) => a && a.error) && <Tbl head={['rule', 'first quartile', 'third quartile']} rows={qs.map(([m, a, b]) => [m, six(a), six(b)])} />}
        </>
      )}
      <Note>A value exactly on a fence is inside it.</Note>
      {t && <Note>EKENE-7 water sand gamma ray at the defaults: fences {six(t.waterSandFences.lower)} and {six(t.waterSandFences.upper)}, entry {list(t.waterSandFences.flagged)} flagged.</Note>}
    </>
  );
};

export const HampelMode = ({ t }) => {
  const s = useValues(Series(DATASET.EKENE_LOG.channels.GR.values.slice(60, 80)));
  const [hw, setHw] = useState('3');
  const [ns, setNs] = useState('3');
  const r = s.bad ? null : hampelOf({ values: s.values, halfWindow: parseNumber(hw), nSigma: parseNumber(ns) });
  const data = r && !r.error ? r.points.map((p) => ({
    entry: p.index, value: p.value, median: p.median,
    upper: p.judged ? p.median + p.threshold : null,
    lower: p.judged ? p.median - p.threshold : null,
    flagged: r.flags.some((f) => f.index === p.index) ? p.value : null,
  })) : [];
  return (
    <>
      <FieldGrid>
        <SeriesField label="Values (null or a dash is missing)" value={s.text} onChange={s.setText} />
        <NumField label="halfWindow" value={hw} onChange={setHw} />
        <NumField label="nSigma" value={ns} onChange={setNs} />
      </FieldGrid>
      {s.bad && <Note>{s.bad}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="entry" tick={AXIS} />
                <YAxis tick={AXIS} />
                <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line dataKey="value" name="value" stroke="#38bdf8" dot isAnimationActive={false} connectNulls={false} />
                <Line dataKey="median" name="window median" stroke="#BFFF00" dot={false} isAnimationActive={false} />
                <Line dataKey="upper" name="median + threshold" stroke="#f472b6" dot={false} strokeDasharray="4 3" isAnimationActive={false} />
                <Line dataKey="lower" name="median - threshold" stroke="#f472b6" dot={false} strokeDasharray="4 3" isAnimationActive={false} />
                <Scatter dataKey="flagged" name="flagged" fill="#fbbf24" isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <Tbl head={['entry', 'value', 'window median', 'MAD', 'threshold', 'present in window', 'judged']} rows={r.points.map((p) => [String(p.index), six(p.value), six(p.median), six(p.mad), six(p.threshold), p.windowCount === null ? 'none' : String(p.windowCount), String(p.judged)])} />
          <Flags flags={r.flags} />
        </>
      )}
      <Note>The window is 2 x halfWindow + 1 samples, truncated at the ends; a missing value never enters a window, and a window with fewer than three present samples is not judged.</Note>
      {t && <Note>EKENE-7 gamma ray, halfWindow 3: {t.hampel.length} flags, among them entries 70 and 170.</Note>}
    </>
  );
};

export const GrubbsMode = ({ t }) => {
  const s = useValues(CORE);
  const [alpha, setAlpha] = useState('0.05');
  const [side, setSide] = useState('two-sided');
  const r = s.bad ? null : grubbsOf({ values: s.values, alpha: parseNumber(alpha), side });
  return (
    <>
      <FieldGrid>
        <SeriesField label="Values" value={s.text} onChange={s.setText} />
        <NumField label="alpha, a fraction" value={alpha} onChange={setAlpha} />
        <SelectField label="Side" value={side} onChange={setSide} options={[['two-sided', 'two-sided'], ['max', 'the largest value'], ['min', 'the smallest value']]} />
      </FieldGrid>
      {s.bad && <Note>{s.bad}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <TileGrid>
          <Tile label="G" value={six(r.statistic)} />
          <Tile label="Critical value" value={six(r.critical)} />
          <Tile label="Reject" value={String(r.reject)} />
          <Tile label="Suspect entry" value={String(r.suspectIndex)} />
          <Tile label="t point used" value={six(r.tCritical)} />
          <Tile label="Largest possible G" value={six(r.maxPossible)} />
        </TileGrid>
      )}
      <Note>Grubbs tests for one outlier. Add a second high value and watch G fall: the second value inflates the spread that measures the first.</Note>
      {t && <Note>EKENE-7 core: G {six(t.grubbs[0].statistic)} against {six(t.grubbs[0].critical)}; with a second high plug, G {six(t.grubbs[1].statistic)} and reject {String(t.grubbs[1].reject)}.</Note>}
    </>
  );
};

export const MahalanobisMode = ({ t }) => {
  const rho = DATASET.EKENE_LOG.channels.RHOB.values.slice(40, 100);
  const nphi = DATASET.EKENE_LOG.channels.NPHI.values.slice(40, 100);
  const a = useValues(Series(rho));
  const b = useValues(Series(nphi));
  const [alpha, setAlpha] = useState('0.025');
  const pr = a.bad || b.bad ? null : pairRows(a.values, b.values);
  const r = pr && !pr.error ? mahalanobisOf({ rows: pr.rows, alpha: parseNumber(alpha) }) : null;
  return (
    <>
      <FieldGrid>
        <SeriesField label="First variable (density)" value={a.text} onChange={a.setText} />
        <SeriesField label="Second variable (neutron)" value={b.text} onChange={b.setText} />
        <NumField label="alpha" value={alpha} onChange={setAlpha} />
      </FieldGrid>
      {(a.bad || b.bad) && <Note>{a.bad || b.bad}</Note>}
      {pr && pr.error && <Note>{pr.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Complete rows used" value={String(r.n)} />
            <Tile label="Cutoff, chi-square at 1 - alpha" value={six(r.cutoff)} />
            <Tile label="Rows skipped" value={list(r.skippedRows)} />
          </TileGrid>
          <Flags flags={r.flags} label="row" />
          <Declared title="THE COVARIANCE THE ENGINE USED">{r.basis.covariance}</Declared>
        </>
      )}
      {t && <Note>EKENE-7 oil sand, entries 40 to 99: row 20 is entry 60, flagged at a squared distance of {six(t.d2Entry60)} against {six(t.cutoff)}.</Note>}
    </>
  );
};

const OutliersExplorer = ({ initialMode = 'z' }) => {
  const [mode, setMode] = useState(initialMode);
  const small = useMemo(() => safe(outliersOnSmallSets), []);
  const gr = useMemo(() => safe(gammaRayOutliers), []);
  const dn = useMemo(() => safe(densityNeutron), []);
  return (
    <PanelShell
      title="Outliers explorer"
      subtitle="Which values stand apart from the rest, and by which measure. Each method answers its own question."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'z' && <ZMode t={small} />}
        {mode === 'modz' && <ModZMode t={small} />}
        {mode === 'fences' && <FencesMode t={gr} />}
        {mode === 'hampel' && <HampelMode t={gr} />}
        {mode === 'grubbs' && <GrubbsMode t={small} />}
        {mode === 'mahalanobis' && <MahalanobisMode t={dn} />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored data quality engine. A flag names the rule that
        fired; whether the value is wrong is a question for the person who knows the well.
      </Note>
    </PanelShell>
  );
};

export default OutliersExplorer;
