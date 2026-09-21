import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  chart, revisedChart, beforeAfter, parseSeries, parseNumber, egbemaChart, STREAMS,
} from './safetystatsLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, SeriesField, Refusal, Declared, BASE_OPTIONS, CONFIDENCE_OPTIONS, safe,
} from './panelBits';

// The u-chart monitor (Expert): a Shewhart u-chart with varying exposure, the
// same chart redrawn with months set aside, and a before-and-after comparison
// that says which months it used. Every figure is a return value of the
// vendored engine through safetystatsLab. Setting a month aside is the
// learner's decision and needs a found cause; the panel only redraws.

export const MODES = [
  ['chart', 'The chart: centre, limits that move with exposure, and signals'],
  ['revise', 'Redraw the chart with months set aside'],
  ['beforeafter', 'Before and after an intervention, saying which months'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const baseOf = (s) => (s === '' ? undefined : Number(s));

const useSeries = () => {
  const G = STREAMS.EGBEMA;
  const [counts, setCounts] = useState(G.counts.join(', '));
  const [hours, setHours] = useState(G.hours.join(', '));
  const c = parseSeries(counts);
  const h = parseSeries(hours);
  return {
    counts, setCounts, hours, setHours, c, h, bad: c.error || h.error,
  };
};

export const ChartMode = ({ t }) => {
  const s = useSeries();
  const [base, setBase] = useState('200000');
  const r = s.bad ? null : chart({ counts: s.c.values, exposureHours: s.h.values, base: baseOf(base) });
  const data = r && !r.error ? r.points.map((p) => ({
    month: p.index + 1, u: p.u, ucl: p.ucl, lcl: p.lcl, centre: r.centre, flagged: p.signal ? p.u : null,
  })) : [];
  return (
    <>
      <FieldGrid>
        <SeriesField label="Monthly counts" value={s.counts} onChange={s.setCounts} />
        <SeriesField label="Monthly exposure hours" value={s.hours} onChange={s.setHours} />
        <SelectField label="Base" value={base} onChange={setBase} options={BASE_OPTIONS} />
      </FieldGrid>
      {s.bad && <Note>{s.bad}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Centre line, sum of counts over sum of units" value={six(r.centre)} unit={r.basis.baseLabel} />
            <Tile label="Months flagged" value={r.outOfControl.length ? r.outOfControl.map((i) => i + 1).join(', ') : 'none'} />
          </TileGrid>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={AXIS} />
                <YAxis tick={AXIS} />
                <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line dataKey="u" name="u, the month's rate" stroke="#38bdf8" dot isAnimationActive={false} />
                <Line dataKey="ucl" name="upper limit" stroke="#f472b6" dot={false} strokeDasharray="4 3" isAnimationActive={false} />
                <Line dataKey="lcl" name="lower limit" stroke="#f472b6" dot={false} strokeDasharray="4 3" isAnimationActive={false} />
                <Line dataKey="centre" name="centre line" stroke="#BFFF00" dot={false} isAnimationActive={false} />
                <Scatter dataKey="flagged" name="signal" fill="#fbbf24" isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <Tbl
            head={['month', 'count', 'hours', 'units n', 'u', 'LCL', 'UCL', 'lower floored', 'signal']}
            rows={r.points.map((p) => [String(p.index + 1), String(p.count), String(p.exposureHours), six(p.exposureUnits), six(p.u), six(p.lcl), six(p.ucl), String(p.lclFloored), p.signal || 'none'])}
          />
          <Declared title="THE METHOD THE ENGINE REPORTS">{r.basis.method}</Declared>
        </>
      )}
      <Note>
        A point signals only when it lies strictly outside its limits. A month with few hours gets wide limits, so a high
        u there can sit quietly inside them.
      </Note>
      {t && <Note>EGBEMA, the teaching year: centre {six(t.centre)}, flagged month {t.flagged.join(', ')}.</Note>}
    </>
  );
};

const monthsOf = (text) => {
  const p = parseSeries(text);
  return p.error ? [] : p.values;
};

export const ReviseMode = ({ t }) => {
  const s = useSeries();
  const [aside, setAside] = useState('8');
  const r = s.bad ? null : revisedChart({ counts: s.c.values, exposureHours: s.h.values, base: 200000, setAside: monthsOf(aside) });
  return (
    <>
      <FieldGrid>
        <SeriesField label="Monthly counts" value={s.counts} onChange={s.setCounts} />
        <SeriesField label="Monthly exposure hours" value={s.hours} onChange={s.setHours} />
        <SeriesField label="Months set aside for a found cause, one-based" value={aside} onChange={setAside} />
      </FieldGrid>
      {s.bad && <Note>{s.bad}</Note>}
      {r && r.chart.error && <Refusal r={r.chart} />}
      {r && !r.chart.error && (
        <TileGrid>
          <Tile label="Revised centre line, per 200,000 hours" value={six(r.chart.centre)} />
          <Tile label="Months kept" value={r.kept.join(', ')} />
          <Tile label="Months flagged on the redrawn chart" value={r.chart.outOfControl.length ? r.chart.outOfControl.map((i) => r.kept[i]).join(', ') : 'none'} />
        </TileGrid>
      )}
      <Note>
        A signal is a question. Set a month aside only when an investigation found a cause; setting it aside because it
        is high removes the data that disagree.
      </Note>
      {t && <Note>EGBEMA with its flagged month set aside: revised centre {six(t.revisedCentre)} against {six(t.centre)} as drawn.</Note>}
    </>
  );
};

export const BeforeAfterMode = ({ t }) => {
  const s = useSeries();
  const [split, setSplit] = useState(String(STREAMS.EGBEMA.interventionMonth));
  const [aside, setAside] = useState('');
  const [conf, setConf] = useState('0.95');
  const r = s.bad ? null : beforeAfter({
    counts: s.c.values, exposureHours: s.h.values, splitMonth: parseNumber(split), setAside: monthsOf(aside), confidence: Number(conf),
  });
  return (
    <>
      <FieldGrid>
        <SeriesField label="Monthly counts" value={s.counts} onChange={s.setCounts} />
        <SeriesField label="Monthly exposure hours" value={s.hours} onChange={s.setHours} />
        <NumField label="First month after the intervention" value={split} onChange={setSplit} />
        <SeriesField label="Months set aside, one-based (may be empty)" value={aside} onChange={setAside} />
        <SelectField label="Confidence, a fraction" value={conf} onChange={setConf} options={CONFIDENCE_OPTIONS} />
      </FieldGrid>
      {s.bad && <Note>{s.bad}</Note>}
      {r && r.result.error && <Refusal r={r.result} />}
      {r && !r.result.error && (
        <>
          <Tbl
            head={['period', 'months', 'count', 'hours']}
            rows={[['before', r.before.months.join(', '), String(r.before.count), String(r.before.hours)], ['after', r.after.months.join(', '), String(r.after.count), String(r.after.hours)]]}
          />
          <TileGrid>
            <Tile label="Rate ratio, after over before" value={r.result.rateRatio === null ? 'unbounded' : six(r.result.rateRatio)} />
            <Tile label="Interval" value={`${six(r.result.rateRatioLower)} to ${r.result.rateRatioUpper === null ? 'unbounded' : six(r.result.rateRatioUpper)}`} />
            <Tile label="Central two-sided p-value" value={six(r.result.pValue)} />
          </TileGrid>
        </>
      )}
      <Note>
        A before-and-after claim has to say which months it used and why. A programme launched at the worst month takes
        credit for the fall that chance alone would bring.
      </Note>
      {t && (
        <Note>
          EGBEMA: every month in, ratio {six(t.beforeAfterAll.rateRatio)} and p {six(t.beforeAfterAll.pValue)}; the
          flagged month set aside, ratio {six(t.beforeAfterSetAside.rateRatio)} and p {six(t.beforeAfterSetAside.pValue)}.
        </Note>
      )}
    </>
  );
};

const UChartExplorer = ({ initialMode = 'chart' }) => {
  const [mode, setMode] = useState(initialMode);
  const t = useMemo(() => safe(egbemaChart), []);
  return (
    <PanelShell
      title="u-chart monitor"
      subtitle="Monthly event rates on a chart whose limits move with each month's exposure. A signal asks a question; what you do with it is judgement."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'chart' && <ChartMode t={t} />}
        {mode === 'revise' && <ReviseMode t={t} />}
        {mode === 'beforeafter' && <BeforeAfterMode t={t} />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored safety statistics engine. The chart uses three sigma
        limits, the lower limit floored at zero, and the base you name.
      </Note>
    </PanelShell>
  );
};

export default UChartExplorer;
