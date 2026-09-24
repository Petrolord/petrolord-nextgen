import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  individualsOf, ewmaOf, cusumOf, scorecardOf, parseSeries, parseNumber, pressureCharts, ekeneScorecard,
  ekeneDimensions, EKENE_WEIGHTS, DATASET,
} from './dataqcLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, SeriesField, Refusal, Declared, Flags, Series, safe,
} from './panelBits';

// The monitor explorer (Expert): has the process that makes the data changed.
// The individuals and moving range chart, EWMA with limits from historical
// in-control data, the tabular CUSUM with k and h in stated units, and the
// scorecard. Every figure is a return value of the vendored engine through
// dataqcLab. A chart refuses a series with a gap: run the Associate checks first.

export const MODES = [
  ['individuals', 'The individuals and moving range chart'],
  ['ewma', 'The EWMA chart, target and sigma from history'],
  ['cusum', 'The tabular CUSUM'],
  ['scorecard', 'The scorecard: a score per dimension and weights'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const W = DATASET.EKENE_WHP;

const ChartBox = ({ data, lines, flaggedKey }) => (
  <div className="h-56 mt-3">
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
        <XAxis dataKey="day" tick={AXIS} />
        <YAxis tick={AXIS} domain={['auto', 'auto']} />
        <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {lines.map(([key, name, stroke, dashed]) => (
          <Line key={key} dataKey={key} name={name} stroke={stroke} dot={key === lines[0][0]} strokeDasharray={dashed ? '4 3' : undefined} isAnimationActive={false} />
        ))}
        {flaggedKey && <Scatter dataKey={flaggedKey} name="signal" fill="#fbbf24" isAnimationActive={false} />}
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

export const IndividualsMode = ({ t }) => {
  const [hist, setHist] = useState(Series(W.history));
  const [mon, setMon] = useState(Series(W.monitored));
  const h = parseSeries(hist);
  const m = parseSeries(mon);
  const p1 = h.error ? null : individualsOf({ values: h.values });
  const p2 = m.error || !p1 || p1.error ? null : individualsOf({ values: m.values, centre: p1.centre, mrBar: p1.mrBar });
  const data = p2 && !p2.error ? m.values.map((v, i) => ({
    day: i + 1, value: v, ucl: p2.ucl, lcl: p2.lcl, centre: p2.centre,
    flagged: p2.outOfControl.includes(i) ? v : null,
  })) : [];
  return (
    <>
      <FieldGrid>
        <SeriesField label="Phase one, in-control history" value={hist} onChange={setHist} />
        <SeriesField label="Phase two, the days to monitor" value={mon} onChange={setMon} />
      </FieldGrid>
      {(h.error || m.error) && <Note>{h.error || m.error}</Note>}
      {p1 && p1.error && <Refusal r={p1} />}
      {p1 && !p1.error && (
        <TileGrid>
          <Tile label="Phase one centre" value={six(p1.centre)} />
          <Tile label="MRbar" value={six(p1.mrBar)} />
          <Tile label="sigma = MRbar / 1.128" value={six(p1.sigma)} />
          <Tile label="Upper limit" value={six(p1.ucl)} />
          <Tile label="Lower limit" value={six(p1.lcl)} />
          <Tile label="Moving range upper limit" value={six(p1.mrUcl)} />
        </TileGrid>
      )}
      {p2 && p2.error && <Refusal r={p2} />}
      {p2 && !p2.error && (
        <>
          <ChartBox data={data} lines={[['value', 'value', '#38bdf8'], ['ucl', 'upper limit', '#f472b6', true], ['lcl', 'lower limit', '#f472b6', true], ['centre', 'centre', '#BFFF00']]} flaggedKey="flagged" />
          <Flags flags={p2.flags} label="entry (day less one)" />
        </>
      )}
      <Note>Phase two is charted against phase one&apos;s centre and MRbar as the standard. A point strictly outside its limits signals.</Note>
      {t && <Note>EKENE-3 phase one: centre {six(t.phaseOne.centre)}, sigma {six(t.phaseOne.sigma)}.</Note>}
    </>
  );
};

export const EwmaMode = ({ t }) => {
  const [mon, setMon] = useState(Series(W.monitored));
  const [lambda, setLambda] = useState('0.2');
  const [target, setTarget] = useState(t ? String(t.phaseOne.centre) : '');
  const [sigma, setSigma] = useState(t ? String(t.phaseOne.sigma) : '');
  const [L, setL] = useState('3');
  const [limits, setLimits] = useState('asymptotic');
  const m = parseSeries(mon);
  const r = m.error ? null : ewmaOf({
    values: m.values, lambda: parseNumber(lambda), target: parseNumber(target), sigma: parseNumber(sigma), L: parseNumber(L), limits,
  });
  const data = r && !r.error ? r.points.map((p) => ({
    day: p.index + 1, ewma: p.ewma, value: p.value, ucl: p.ucl, lcl: p.lcl,
    flagged: r.flags.some((f) => f.index === p.index) ? p.ewma : null,
  })) : [];
  return (
    <>
      <FieldGrid>
        <SeriesField label="The days to monitor" value={mon} onChange={setMon} />
        <NumField label="lambda" value={lambda} onChange={setLambda} />
        <NumField label="Target, from history" value={target} onChange={setTarget} />
        <NumField label="Sigma, from history" value={sigma} onChange={setSigma} />
        <NumField label="L" value={L} onChange={setL} />
        <SelectField label="Limits" value={limits} onChange={setLimits} options={[['asymptotic', 'asymptotic (the default)'], ['exact', 'exact, time-varying']]} />
      </FieldGrid>
      {m.error && <Note>{m.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <ChartBox data={data} lines={[['ewma', 'EWMA', '#38bdf8'], ['ucl', 'upper limit', '#f472b6', true], ['lcl', 'lower limit', '#f472b6', true], ['value', 'observation', '#64748b']]} flaggedKey="flagged" />
          <Flags flags={r.flags} label="entry (day less one)" />
          <Declared title="WHERE THE CHART STARTS">{r.basis.start}</Declared>
        </>
      )}
      <Note>Target and sigma are required and come from in-control history; the chart never estimates them from the data it monitors.</Note>
      {t && <Note>EKENE-3 phase two at lambda 0.2: the first low signal is day {t.ewma.firstLowDay}.</Note>}
    </>
  );
};

export const CusumMode = ({ t }) => {
  const [mon, setMon] = useState(Series(W.monitored));
  const [target, setTarget] = useState(t ? String(t.phaseOne.centre) : '');
  const [k, setK] = useState('0.5');
  const [h, setH] = useState('4');
  const [units, setUnits] = useState('sigma');
  const [sigma, setSigma] = useState(t ? String(t.phaseOne.sigma) : '');
  const m = parseSeries(mon);
  const r = m.error ? null : cusumOf({
    values: m.values, target: parseNumber(target), k: parseNumber(k), h: parseNumber(h), units: units || undefined, sigma: parseNumber(sigma),
  });
  const data = r && !r.error ? r.points.map((p) => ({
    day: p.index + 1, sHigh: p.sHigh, sLow: p.sLow, h: r.hData,
  })) : [];
  return (
    <>
      <FieldGrid>
        <SeriesField label="The days to monitor" value={mon} onChange={setMon} />
        <NumField label="Target" value={target} onChange={setTarget} />
        <NumField label="k" value={k} onChange={setK} />
        <NumField label="h" value={h} onChange={setH} />
        <SelectField label="Units of k and h" value={units} onChange={setUnits} options={[['sigma', 'multiples of sigma'], ['data', 'the data\'s own units'], ['', 'not stated (see the refusal)']]} />
        <NumField label="Sigma (for sigma units)" value={sigma} onChange={setSigma} />
      </FieldGrid>
      {m.error && <Note>{m.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="k in data units" value={six(r.kData)} />
            <Tile label="h in data units" value={six(r.hData)} />
            <Tile label="First upper signal, day" value={r.firstSignalHigh === null ? 'none' : String(r.firstSignalHigh + 1)} />
            <Tile label="First lower signal, day" value={r.firstSignalLow === null ? 'none' : String(r.firstSignalLow + 1)} />
          </TileGrid>
          <ChartBox data={data} lines={[['sHigh', 'upper CUSUM', '#38bdf8'], ['sLow', 'lower CUSUM', '#a78bfa'], ['h', 'h', '#f472b6', true]]} />
        </>
      )}
      <Note>No reset after a signal. A signal is a CUSUM strictly above h.</Note>
      {t && <Note>EKENE-3 phase two, k 0.5 and h 4 in sigma units: first upper signal day {t.cusum.firstHighDay}, first lower signal day {t.cusum.firstLowDay}.</Note>}
    </>
  );
};

export const ScorecardMode = ({ t }) => {
  const dims = useMemo(() => safe(ekeneDimensions) || [], []);
  const [rows, setRows] = useState(dims.map((d) => ({ name: d.name, checked: String(d.checked), failed: String(d.failed), weight: String(EKENE_WEIGHTS[d.name]) })));
  const [useWeights, setUseWeights] = useState('stated');
  const parsed = rows.map((r) => ({ name: r.name, checked: parseNumber(r.checked), failed: parseNumber(r.failed) }));
  const weights = useWeights === 'stated' ? Object.fromEntries(rows.map((r) => [r.name, parseNumber(r.weight)])) : undefined;
  const r = scorecardOf({ dimensions: parsed, weights });
  const set = (i, key, v) => setRows((rs) => rs.map((x, j) => (j === i ? { ...x, [key]: v } : x)));
  return (
    <>
      <FieldGrid>
        <SelectField label="Weights" value={useWeights} onChange={setUseWeights} options={[['stated', 'the weights below'], ['equal', 'equal weights']]} />
      </FieldGrid>
      {rows.map((row, i) => (
        <FieldGrid key={row.name}>
          <Tile label="Dimension" value={row.name} />
          <NumField label="Checked" value={row.checked} onChange={(v) => set(i, 'checked', v)} />
          <NumField label="Failed" value={row.failed} onChange={(v) => set(i, 'failed', v)} />
          <NumField label="Weight" value={row.weight} onChange={(v) => set(i, 'weight', v)} />
        </FieldGrid>
      ))}
      {r.error ? <Refusal r={r} /> : (
        <>
          <TileGrid>
            <Tile label="Total" value={six(r.total)} />
            <Tile label="Weakest" value={r.weakest} />
          </TileGrid>
          <Tbl head={['dimension', 'score', 'normalised weight', 'contribution']} rows={r.dimensions.map((d) => [d.name, six(d.score), six(d.weight), six(d.contribution)])} />
          <Declared title="THE BASIS">{`${r.basis.weights}; ${r.basis.score}; ${r.basis.tieBreak}.`}</Declared>
        </>
      )}
      <Note>There are no grade bands: the engine reports a total and the weakest dimension, and what counts as good enough is a policy you write.</Note>
      {t && <Note>EKENE-3: {six(t.equalTotal)} with equal weights, {six(t.weightedTotal)} with the stated weights, weakest {t.weakest}.</Note>}
    </>
  );
};

const MonitorExplorer = ({ initialMode = 'individuals' }) => {
  const [mode, setMode] = useState(initialMode);
  const charts = useMemo(() => safe(pressureCharts), []);
  const card = useMemo(() => safe(ekeneScorecard), []);
  return (
    <PanelShell
      title="Monitor explorer"
      subtitle="Whether the process that makes the data has changed, and one score per quality dimension."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'individuals' && <IndividualsMode t={charts} />}
        {mode === 'ewma' && <EwmaMode t={charts} />}
        {mode === 'cusum' && <CusumMode t={charts} />}
        {mode === 'scorecard' && <ScorecardMode t={card} />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored data quality engine. A control limit comes from
        in-control data; it is never a specification.
      </Note>
    </PanelShell>
  );
};

export default MonitorExplorer;
