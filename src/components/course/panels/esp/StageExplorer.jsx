import React, { useMemo, useState } from 'react';
import {
  ComposedChart, LineChart, BarChart, Line, Bar, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceArea, ReferenceDot,
} from 'recharts';
import ChartFrame from '@/components/charts/ChartFrame';
import { GRID_STYLE, TOOLTIP_STYLE, LEGEND_PROPS, XAXIS_LABEL_HEIGHT } from '@/utils/chartTheme';
import { seriesColor, AXIS_TICK, SVG_CHART } from '@/utils/chartSvg';
import {
  ESP_THRESHOLDS, BEP_SCAN_STEPS, BRASS_LABEL, REFERENCE_CURVE_IDS,
  VENDOR_DUTY_RATES,
  vendorPublishedPoints, vendorCurveFit, vendorFitResidualRows, vendorBep, vendorDutyRows,
  brassTranscriptionRows, referenceCurveSummary,
  vendorExtrapolationRows, referenceExtrapolationRows, efficiencyTailRows, fitExhaustion,
  goldenExtrapolatedRow,
} from './espLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Stage explorer, the Associate tier. What one stage of an ESP does: the cubic
// fitted through the published vendor points and how good it is, the best
// efficiency point and the fact that it was scanned rather than solved, head,
// efficiency and power read at one duty rate, and what the same fit returns
// past the end of the data it was built on.
//
// Every figure on this page is a return value from espLab, which is a return
// value from the vendored ESP engine. Nothing here computes a head, an
// efficiency, a power or a residual.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : 'n/a');

const pct = (v, d = 2) => (Number.isFinite(v) ? `${fmt(v * 100, d)} %` : 'n/a');

const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['fit', 'The cubic through five points, and how good it is'],
  ['bep', 'The best efficiency point, scanned and not solved'],
  ['duty', 'One rate read three ways'],
  ['edge', 'Past the end of the data, where nothing snaps'],
];

const AXIS = AXIS_TICK;
const TOOLTIP = TOOLTIP_STYLE;
const GRID = <CartesianGrid {...GRID_STYLE} />;

const REGION_COLOUR = {
  downthrust: seriesColor(4),
  recommended: seriesColor(1),
  upthrust: seriesColor(2),
};

const Fit = () => {
  const fit = useMemo(() => {
    try { return vendorCurveFit(); } catch { return null; }
  }, []);
  const points = useMemo(() => {
    try { return vendorPublishedPoints(); } catch { return null; }
  }, []);
  const residuals = useMemo(() => {
    try { return vendorFitResidualRows(); } catch { return null; }
  }, []);
  const brass = useMemo(() => {
    try { return brassTranscriptionRows(); } catch { return null; }
  }, []);
  const [variant, setVariant] = useState('');
  if (!fit || !points || !points.length || !residuals || !residuals.length || !brass || !brass.length) {
    return <Note>A stage curve needs at least three published points before the engine will fit anything to it. Handed two, it returns a curve that is not ok and carries a warning instead of a head fit, so there is no residual to measure and no fit to judge.</Note>;
  }
  const row = brass.find((b) => b.variant === variant) || brass[1] || brass[0];
  const bad = row.points.find((p) => p.typedLessPublishedFt !== 0);
  const passes = row.headRmse <= row.transcriptionThresholdFt;
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Published points the fit was given" value={fmt(points.length, 0)} />
          <Tile label="Coefficients the head fit carries" value={fmt(fit.headCoeffs.length, 0)} />
          <Tile label="Root mean square miss" value={fmt(fit.headRmse, 8)} unit="ft" />
          <Tile label="The golden's own figure" value={fmt(fit.goldenHeadRmse, 8)} unit="ft" />
          <Tile label="Tallest published point" value={fmt(fit.tallestHeadFt, 3)} unit="ft" />
          <Tile label="The bar, two percent of that" value={fmt(fit.transcriptionThresholdFt, 4)} unit="ft" />
          <Tile label="Root mean square as a share of the tallest point" value={pct(fit.rmseFractionOfTallest, 4)} />
          <Tile label="Warnings raised" value={fmt(fit.warningCount, 0)} />
        </TileGrid>
      </div>
      <ChartFrame height={288} className="mt-3">
        <ComposedChart data={residuals} margin={{ top: 20, right: 20, bottom: 18, left: 0 }}>
          {GRID}
          <XAxis height={XAXIS_LABEL_HEIGHT} dataKey="qBpd" type="number" domain={[fit.qMin, fit.qMax]} tick={AXIS}
            label={{ value: 'rate, bbl/d', position: 'insideBottom', offset: 0, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis tick={AXIS}
            label={{ value: 'head per stage, ft', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
          <Legend {...LEGEND_PROPS} />
          <Line type="monotone" dataKey="fitHeadFt" name="the cubic the engine fitted"
            stroke={seriesColor(1)} dot={false} isAnimationActive={false} />
          <Scatter dataKey="publishedHeadFt" name="the five published points" fill={seriesColor(0)} isAnimationActive={false} />
        </ComposedChart>
      </ChartFrame>
      <ChartFrame height={224} className="mt-3">
        <BarChart data={residuals} margin={{ top: 20, right: 20, bottom: 18, left: 0 }}>
          {GRID}
          <XAxis dataKey="qBpd" tick={AXIS}
            label={{ value: 'rate, bbl/d', position: 'insideBottom', offset: -8, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis tick={AXIS}
            label={{ value: 'fit less published, ft', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
          <ReferenceLine y={0} stroke={SVG_CHART.reference} />
          <ReferenceLine y={fit.headRmse} stroke={seriesColor(1)} strokeDasharray="5 3"
            label={{ value: 'root mean square', fill: seriesColor(1), fontSize: 10, position: 'insideTopRight' }} />
          <Bar dataKey="headResidualFt" name="miss at this point" fill={seriesColor(0)} isAnimationActive={false} />
        </BarChart>
      </ChartFrame>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">rate, bbl/d</th>
              <th className="text-left pr-3">published head, ft</th>
              <th className="text-left pr-3">the fit reads, ft</th>
              <th className="text-left pr-3">miss, ft</th>
              <th className="text-left pr-3">published efficiency</th>
              <th className="text-left pr-3">the fit reads</th>
              <th className="text-left">miss</th>
            </tr>
          </thead>
          <tbody>
            {residuals.map((r) => (
              <tr key={r.qBpd}>
                <td className="pr-3">{fmt(r.qBpd, 0)}</td>
                <td className="pr-3">{fmt(r.publishedHeadFt, 4)}</td>
                <td className="pr-3 text-pl-primary-text">{fmt(r.fitHeadFt, 6)}</td>
                <td className="pr-3">{fmt(r.headResidualFt, 6)}</td>
                <td className="pr-3">{fmt(r.publishedEfficiency, 6)}</td>
                <td className="pr-3 text-pl-primary-text">{fmt(r.fitEfficiency, 6)}</td>
                <td>{fmt(r.efficiencyResidual, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 rounded-md border border-pl-border bg-pl-sunken p-3">
        <p className="text-xs text-pl-muted mb-2">
          {BRASS_LABEL}, the teaching curve: the same five points as somebody else typed them. A fit
          that PASSES the check and a fit that FAILS it, on one test.
        </p>
        <FieldGrid>
          <SelectField label="Transcription" value={variant || row.variant} onChange={setVariant}
            options={brass.map((b) => [b.variant, b.variant])} />
        </FieldGrid>
        <div className="mt-3">
          <TileGrid>
            <Tile label="Root mean square miss" value={fmt(row.headRmse, 8)} unit="ft" />
            <Tile label="The bar it is judged against" value={fmt(row.transcriptionThresholdFt, 4)} unit="ft" />
            <Tile label="Warning raised" value={yn(row.warningCount > 0)} />
            <Tile label="Worst single miss" value={fmt(row.worstResidualFt, 6)} unit="ft" />
            <Tile label="At this rate" value={fmt(row.worstResidualQBpd, 0)} unit="bbl/d" />
            <Tile label="Worst miss over the root mean square" value={fmt(row.worstResidualOverRmse, 4)} />
            <Tile label="Best efficiency rate this fit reports" value={fmt(row.bepQBpd, 0)} unit="bbl/d" />
            <Tile label="Best efficiency head this fit reports" value={fmt(row.bepHeadFt, 6)} unit="ft" />
          </TileGrid>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-pl-text w-full">
            <thead className="text-pl-muted">
              <tr>
                <th className="text-left pr-3">rate, bbl/d</th>
                <th className="text-left pr-3">published, ft</th>
                <th className="text-left pr-3">as typed, ft</th>
                <th className="text-left pr-3">typed less published, ft</th>
                <th className="text-left pr-3">the fit reads, ft</th>
                <th className="text-left">miss, ft</th>
              </tr>
            </thead>
            <tbody>
              {row.points.map((p) => (
                <tr key={p.qBpd} className={p.typedLessPublishedFt !== 0 ? 'text-pl-text' : ''}>
                  <td className="pr-3">{fmt(p.qBpd, 0)}</td>
                  <td className="pr-3">{fmt(p.publishedHeadFt, 4)}</td>
                  <td className={`pr-3 ${p.typedLessPublishedFt !== 0 ? 'text-pl-warning-text' : ''}`}>{fmt(p.typedHeadFt, 4)}</td>
                  <td className="pr-3">{fmt(p.typedLessPublishedFt, 4)}</td>
                  <td className="pr-3 text-pl-primary-text">{fmt(p.fitHeadFt, 6)}</td>
                  <td>{fmt(p.residualFt, 6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        THE QUALITY CHECK IS THE ROOT MEAN SQUARE AND NOTHING ELSE. The engine fits the head, takes
        the root mean square of the misses, compares it against
        {' '}{pct(ESP_THRESHOLDS.transcriptionRmseFraction, 0)} of the tallest published point, and
        raises a warning or does not. It never looks at a single point, it never looks at the shape,
        and it never asks whether the curve still falls with rate.
        {bad
          ? ` On this transcription one point at ${fmt(bad.qBpd, 0)} bbl/d was typed ${fmt(bad.typedLessPublishedFt, 4)} ft away from the published value. The fit misses that one point by ${fmt(row.worstResidualFt, 6)} ft, which is ${fmt(row.worstResidualOverRmse, 3)} times the root mean square of all ${fmt(row.points.length, 0)} of them, because the other four pull the average back down.`
          : ' This transcription is the published one, so every miss on it is the ordinary residual of four coefficients pushed through five points.'}
        {' '}The number the check actually sees is {fmt(row.headRmse, 6)} ft against a bar of
        {' '}{fmt(row.transcriptionThresholdFt, 4)} ft, so the check
        {passes ? ' PASSES it' : ' FAILS it'} and the curve is
        {passes ? ' accepted' : ' flagged'}.
      </div>
      <Note>
        The mild transcription is the one worth sitting with. The curve still looks like a pump
        curve, the fit still answers at every rate, the best efficiency point still lands somewhere
        plausible, and the only thing that says anything is wrong is a residual that a root mean
        square over five points has already pulled well down. A check that averages will always be blindest
        at exactly one bad number, which is the shape of most transcription errors.
      </Note>
    </>
  );
};

const Bep = () => {
  const bep = useMemo(() => {
    try { return vendorBep(); } catch { return null; }
  }, []);
  const rows = useMemo(() => {
    try { return vendorDutyRows(); } catch { return null; }
  }, []);
  const refs = useMemo(() => {
    try { return REFERENCE_CURVE_IDS.map(referenceCurveSummary); } catch { return null; }
  }, []);
  if (!bep || !rows || !rows.length || !refs || !refs.length) {
    return <Note>A best efficiency point needs an efficiency fit. Handed points with no efficiency column the engine still fits the head and still answers for head and rate, but the best efficiency point it returns is read off the head alone, and there is no efficiency to scan.</Note>;
  }
  const worst = refs.reduce((a, b) => (Math.abs(b.bepScanMissBpd) > Math.abs(a.bepScanMissBpd) ? b : a));
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Best efficiency rate the scan returns" value={fmt(bep.qBpd, 0)} unit="bbl/d" />
          <Tile label="Head there" value={fmt(bep.headFt, 6)} unit="ft" />
          <Tile label="Efficiency there" value={pct(bep.efficiency, 4)} />
          <Tile label="Steps the scan takes" value={fmt(BEP_SCAN_STEPS, 0)} />
          <Tile label="Spacing those steps leave" value={fmt(bep.scanSpacingBpd, 4)} unit="bbl/d" />
          <Tile label="The golden's own rate" value={fmt(bep.goldenQBpd, 0)} unit="bbl/d" />
          <Tile label="Recommended band, low" value={fmt(bep.recommendedLowBpd, 3)} unit="bbl/d" />
          <Tile label="Recommended band, high" value={fmt(bep.recommendedHighBpd, 3)} unit="bbl/d" />
        </TileGrid>
      </div>
      <ChartFrame height={288} className="mt-3">
        <LineChart data={rows} margin={{ top: 20, right: 20, bottom: 18, left: 0 }}>
          {GRID}
          <XAxis height={XAXIS_LABEL_HEIGHT} dataKey="qBpd" type="number" domain={['dataMin', 'dataMax']} tick={AXIS}
            label={{ value: 'rate, bbl/d', position: 'insideBottom', offset: 0, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis tick={AXIS} domain={[0, 1]}
            label={{ value: 'efficiency, fraction', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
          <Legend {...LEGEND_PROPS} />
          <ReferenceArea x1={bep.recommendedLowBpd} x2={bep.recommendedHighBpd} fill={seriesColor(1)} fillOpacity={0.07} />
          <ReferenceLine x={bep.qBpd} stroke={seriesColor(1)} strokeDasharray="5 3"
            label={{ value: 'the scan winner', fill: seriesColor(1), fontSize: 10, position: 'top' }} />
          <Line type="monotone" dataKey="efficiency" name="efficiency the fit reads"
            stroke={seriesColor(0)} dot={false} isAnimationActive={false} />
          <ReferenceDot x={bep.qBpd} y={bep.efficiency} r={4} fill={seriesColor(1)} stroke="none" />
        </LineChart>
      </ChartFrame>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">reference stage</th>
              <th className="text-left pr-3">generated at, bbl/d</th>
              <th className="text-left pr-3">the scan returns, bbl/d</th>
              <th className="text-left pr-3">miss, bbl/d</th>
              <th className="text-left pr-3">scan spacing, bbl/d</th>
              <th className="text-left pr-3">published range, bbl/d</th>
              <th className="text-left">head fit residual, ft</th>
            </tr>
          </thead>
          <tbody>
            {refs.map((r) => (
              <tr key={r.id} className={r.id === worst.id ? 'text-pl-text' : ''}>
                <td className="pr-3">{r.id}</td>
                <td className="pr-3">{fmt(r.bepBpd, 0)}</td>
                <td className="pr-3 text-pl-primary-text">{fmt(r.bepQBpd, 4)}</td>
                <td className="pr-3 text-pl-warning-text">{fmt(r.bepScanMissBpd, 4)}</td>
                <td className="pr-3">{fmt(r.bepScanSpacingBpd, 4)}</td>
                <td className="pr-3">{fmt(r.qMin, 0)} to {fmt(r.qMax, 0)}</td>
                <td>{fmt(r.headRmse, 12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        THE BEST EFFICIENCY POINT IS SCANNED, NOT SOLVED. The engine walks
        {' '}{fmt(BEP_SCAN_STEPS, 0)} steps across the published range and keeps the best sample it
        saw. On this vendor curve that leaves the samples {fmt(bep.scanSpacingBpd, 4)} bbl/d apart,
        and the rate it reports, {fmt(bep.qBpd, 0)} bbl/d, is a grid point rather than the place
        where the derivative of the efficiency fit is nought.
      </div>
      <div className="mt-2 text-xs text-pl-text">
        The four reference stages are where that is measurable, because each one was GENERATED from
        a named best efficiency rate, so the right answer is known before the scan runs. Read the
        miss column: every one of them comes back beside its own generating rate rather than on it,
        by up to {fmt(Math.abs(worst.bepScanMissBpd), 4)} bbl/d on {worst.id}. That is not an error
        in the model and not an error in the arithmetic. It is the resolution of a grid, and it is
        bounded by the spacing in the column next to it.
      </div>
      <Note>
        This matters the moment a number is compared. Two stages whose best efficiency rates differ
        by a bbl/d or two are not distinguishable by this scan, and a duty placed as a fraction of
        the best efficiency rate inherits the same grid. Quote the rate to the nearest few bbl/d and
        it is honest; quote it to the decimal and you are quoting the step size.
      </Note>
    </>
  );
};

const Duty = () => {
  const bep = useMemo(() => {
    try { return vendorBep(); } catch { return null; }
  }, []);
  const rows = useMemo(() => {
    try { return vendorDutyRows(); } catch { return null; }
  }, []);
  const [rate, setRate] = useState('');
  if (!bep || !rows || !rows.length) {
    return <Note>Head, efficiency and power at a duty are three readings of one point on one curve, so all three need a curve. With no fit there is no point to read and the engine returns nothing rather than a straight line through the origin.</Note>;
  }
  const row = rows.find((r) => String(r.qBpd) === rate) || rows[Math.floor(rows.length / 2)];
  return (
    <>
      <FieldGrid>
        <SelectField label="Duty rate to read the stage at" value={rate || String(row.qBpd)}
          onChange={setRate} options={rows.map((r) => [String(r.qBpd), `${fmt(r.qBpd, 0)} bbl/d`])} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Rate asked for" value={fmt(row.qBpd, 0)} unit="bbl/d" />
          <Tile label="Head this stage makes" value={fmt(row.headFt, 6)} unit="ft" />
          <Tile label="Efficiency there" value={pct(row.efficiency, 4)} />
          <Tile label="Brake power on water" value={fmt(row.bhpPerStageSg100, 6)} unit="hp" />
          <Tile label="Brake power on the lighter fluid" value={fmt(row.bhpPerStageSg090, 6)} unit="hp" />
          <Tile label="Region the engine labels it" value={row.region} />
          <Tile label="Inside the published data" value={yn(row.inRange)} />
          <Tile label="Best efficiency rate" value={fmt(bep.qBpd, 0)} unit="bbl/d" />
        </TileGrid>
      </div>
      <ChartFrame height={288} className="mt-3">
        <ComposedChart data={rows} margin={{ top: 20, right: 20, bottom: 18, left: 0 }}>
          {GRID}
          <XAxis height={XAXIS_LABEL_HEIGHT} dataKey="qBpd" type="number" domain={['dataMin', 'dataMax']} tick={AXIS}
            label={{ value: 'rate, bbl/d', position: 'insideBottom', offset: 0, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis yAxisId="head" tick={AXIS}
            label={{ value: 'head, ft', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis yAxisId="power" orientation="right" tick={AXIS}
            label={{ value: 'efficiency and brake power', angle: 90, position: 'insideRight', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
          <Legend {...LEGEND_PROPS} />
          <ReferenceArea yAxisId="head" x1={bep.recommendedLowBpd} x2={bep.recommendedHighBpd}
            fill={seriesColor(1)} fillOpacity={0.07} />
          <ReferenceLine yAxisId="head" x={bep.recommendedLowBpd} stroke={seriesColor(4)} strokeDasharray="5 3"
            label={{ value: 'downthrust below here', fill: seriesColor(4), fontSize: 10, position: 'top' }} />
          <ReferenceLine yAxisId="head" x={bep.recommendedHighBpd} stroke={seriesColor(2)} strokeDasharray="5 3"
            label={{ value: 'upthrust above here', fill: seriesColor(2), fontSize: 10, position: 'top' }} />
          <ReferenceLine yAxisId="head" x={row.qBpd} stroke={SVG_CHART.label}
            label={{ value: 'the duty', fill: SVG_CHART.label, fontSize: 10, position: 'insideTopRight' }} />
          <Line yAxisId="head" type="monotone" dataKey="headFt" name="head per stage, ft"
            stroke={seriesColor(1)} dot={false} isAnimationActive={false} />
          <Line yAxisId="power" type="monotone" dataKey="efficiency" name="efficiency, fraction"
            stroke={seriesColor(0)} dot={false} isAnimationActive={false} />
          <Line yAxisId="power" type="monotone" dataKey="bhpPerStageSg100" name="brake power on water, hp"
            stroke={seriesColor(2)} dot={false} isAnimationActive={false} />
          <Line yAxisId="power" type="monotone" dataKey="bhpPerStageSg090" name="brake power on the lighter fluid, hp"
            stroke={seriesColor(4)} dot={false} strokeDasharray="4 3" isAnimationActive={false} />
        </ComposedChart>
      </ChartFrame>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">rate, bbl/d</th>
              <th className="text-left pr-3">head, ft</th>
              <th className="text-left pr-3">efficiency</th>
              <th className="text-left pr-3">brake power on water, hp</th>
              <th className="text-left pr-3">brake power on the lighter fluid, hp</th>
              <th className="text-left pr-3">region</th>
              <th className="text-left">in range</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.qBpd} className={r.qBpd === row.qBpd ? 'text-pl-text' : ''}>
                <td className="pr-3">{fmt(r.qBpd, 0)}</td>
                <td className="pr-3 text-pl-primary-text">{fmt(r.headFt, 6)}</td>
                <td className="pr-3 text-pl-info-text">{fmt(r.efficiency, 6)}</td>
                <td className="pr-3 text-pl-warning-text">{fmt(r.bhpPerStageSg100, 6)}</td>
                <td className="pr-3 text-pl-accent-text">{fmt(r.bhpPerStageSg090, 6)}</td>
                <td className="pr-3" style={{ color: REGION_COLOUR[r.region] }}>{r.region}</td>
                <td>{yn(r.inRange)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        THREE READINGS OF ONE POINT. At {fmt(row.qBpd, 0)} bbl/d this stage makes
        {' '}{fmt(row.headFt, 6)} ft of head at {pct(row.efficiency, 4)} efficiency and asks for
        {' '}{fmt(row.bhpPerStageSg100, 6)} hp on water. Head and efficiency are read off the two
        fits and know nothing about the fluid. Power is the only one of the three that moves when
        the fluid does: the same duty on the lighter fluid asks
        {' '}{fmt(row.bhpPerStageSg090, 6)} hp, because brake power carries the specific gravity and
        head does not.
      </div>
      <div className="mt-2 text-xs text-pl-text">
        The band on the chart is the recommended duty range, {fmt(bep.recommendedLowBpd, 3)} to
        {' '}{fmt(bep.recommendedHighBpd, 3)} bbl/d, which is
        {' '}{pct(ESP_THRESHOLDS.downthrustBepFraction, 0)} to
        {' '}{pct(ESP_THRESHOLDS.upthrustBepFraction, 0)} of the best efficiency rate. Left of it the
        engine labels the region downthrust, right of it upthrust, and it is that LABEL that turns
        into a warning when a design lands there. The label is a statement about thrust washers, not
        about whether the head number is any good.
      </div>
      <Note>
        Nothing on this ladder is outside the published data, so every reading here is
        interpolation. The rate column runs from {fmt(VENDOR_DUTY_RATES[0], 0)} to
        {' '}{fmt(VENDOR_DUTY_RATES[VENDOR_DUTY_RATES.length - 1], 0)} bbl/d and the fit was built on
        the same span. What happens on the other side of that boundary is the last view.
      </Note>
    </>
  );
};

const Edge = () => {
  const rows = useMemo(() => {
    try { return vendorExtrapolationRows(); } catch { return null; }
  }, []);
  const refRows = useMemo(() => {
    try { return referenceExtrapolationRows(); } catch { return null; }
  }, []);
  const tail = useMemo(() => {
    try { return efficiencyTailRows(); } catch { return null; }
  }, []);
  const ex = useMemo(() => {
    try { return fitExhaustion(); } catch { return null; }
  }, []);
  const fit = useMemo(() => {
    try { return vendorCurveFit(); } catch { return null; }
  }, []);
  const golden = useMemo(() => {
    try { return goldenExtrapolatedRow(); } catch { return null; }
  }, []);
  if (!rows || !rows.length || !refRows || !tail || !ex || !fit || !golden) {
    return <Note>There is no edge to walk over without a fit and a published range to leave. The engine reports the range it was given on every curve it builds, and with no curve there is neither a boundary nor an answer on the far side of one.</Note>;
  }
  const lastInside = rows.filter((r) => r.inRange).slice(-1)[0];
  const firstOutside = rows.find((r) => !r.inRange);
  const refused = rows.filter((r) => !Number.isFinite(r.bhpPerStage));
  const negativeHead = rows.filter((r) => r.headFt < 0 && r.efficiency > 0);
  const lastPositiveEfficiency = tail.filter((r) => r.vendorEfficiency > 0).slice(-1)[0] || null;
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Last published rate" value={fmt(fit.qMax, 0)} unit="bbl/d" />
          <Tile label="Head crosses zero at" value={fmt(ex.vendorZeroHeadBpd, 4)} unit="bbl/d" />
          <Tile label="Which is past the data by" value={fmt(ex.vendorZeroHeadPastDataBpd, 4)} unit="bbl/d" />
          <Tile label="Efficiency crosses zero at" value={fmt(ex.vendorZeroEfficiencyBpd, 4)} unit="bbl/d" />
          <Tile label="Efficiency outlives head by" value={fmt(ex.vendorEfficiencyOutlivesHeadBpd, 4)} unit="bbl/d" />
          <Tile label="Rows on this sweep" value={fmt(rows.length, 0)} />
          <Tile label="Rows the engine refused" value={fmt(refused.length, 0)} />
          <Tile label="Rows with negative head and a finite power" value={fmt(negativeHead.length, 0)} />
        </TileGrid>
      </div>
      <ChartFrame height={320} className="mt-3">
        <ComposedChart data={rows} margin={{ top: 20, right: 20, bottom: 18, left: 0 }}>
          {GRID}
          <XAxis height={XAXIS_LABEL_HEIGHT} dataKey="qBpd" type="number" domain={['dataMin', 'dataMax']} tick={AXIS}
            label={{ value: 'rate, bbl/d', position: 'insideBottom', offset: 0, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis yAxisId="head" tick={AXIS}
            label={{ value: 'head per stage, ft', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis yAxisId="eff" orientation="right" tick={AXIS}
            label={{ value: 'efficiency and brake power', angle: 90, position: 'insideRight', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
          <Legend {...LEGEND_PROPS} />
          {/* The region the whole view exists for: everything the fit says
              between the last point it was given and the rate its own head
              reaches nought. Both bounds are engine values. */}
          <ReferenceArea yAxisId="head" x1={fit.qMax} x2={ex.vendorZeroHeadBpd}
            fill={seriesColor(2)} fillOpacity={0.16} stroke={seriesColor(2)} strokeOpacity={0.5} />
          <ReferenceLine yAxisId="head" x={fit.qMax} stroke={seriesColor(0)} strokeWidth={2}
            label={{ value: 'last published rate', fill: seriesColor(0), fontSize: 10, position: 'top' }} />
          <ReferenceLine yAxisId="head" x={ex.vendorZeroHeadBpd} stroke={seriesColor(2)} strokeWidth={2}
            label={{ value: 'head reaches nought', fill: seriesColor(2), fontSize: 10, position: 'top' }} />
          <ReferenceLine yAxisId="head" y={0} stroke={SVG_CHART.reference} />
          <Line yAxisId="head" type="monotone" dataKey="headFt" name="head per stage, ft"
            stroke={seriesColor(1)} strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line yAxisId="eff" type="monotone" dataKey="efficiency" name="efficiency, fraction"
            stroke={seriesColor(0)} dot={false} isAnimationActive={false} />
          <Line yAxisId="eff" type="monotone" dataKey="bhpPerStage" name="brake power per stage, hp"
            stroke={seriesColor(4)} dot={false} isAnimationActive={false} />
        </ComposedChart>
      </ChartFrame>
      <div className="mt-2 text-xs text-pl-muted">
        The shaded strip is {fmt(ex.vendorZeroHeadPastDataBpd, 4)} bbl/d wide. Every answer inside it
        is finite, smooth and about nothing.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">rate, bbl/d</th>
              <th className="text-left pr-3">past the data, bbl/d</th>
              <th className="text-left pr-3">head, ft</th>
              <th className="text-left pr-3">efficiency</th>
              <th className="text-left pr-3">brake power, hp</th>
              <th className="text-left pr-3">region</th>
              <th className="text-left">in range</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.qBpd}
                className={r.qBpd > fit.qMax && r.qBpd < ex.vendorZeroHeadBpd ? 'bg-pl-warning-bg text-pl-text' : ''}>
                <td className="pr-3">{fmt(r.qBpd, 0)}</td>
                <td className="pr-3 text-pl-muted">{fmt(r.pastDataBpd, 0)}</td>
                <td className="pr-3 text-pl-primary-text">{fmt(r.headFt, 6)}</td>
                <td className="pr-3 text-pl-info-text">{fmt(r.efficiency, 6)}</td>
                <td className="pr-3 text-pl-accent-text">{Number.isFinite(r.bhpPerStage) ? fmt(r.bhpPerStage, 6) : 'the engine refuses'}</td>
                <td className="pr-3" style={{ color: REGION_COLOUR[r.region] }}>{r.region}</td>
                <td className={r.inRange ? '' : 'text-pl-warning-text font-semibold'}>{yn(r.inRange)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        NOTHING SNAPS. Read the head column straight down through the boundary: it falls, it
        flattens, it crosses nought and it keeps going, and no row differs IN KIND from the row
        above it. The last row inside the published data reads {fmt(lastInside.headFt, 6)} ft and
        the first row outside it reads {fmt(firstOutside.headFt, 6)} ft, which is the same step the
        rows before it were taking. The efficiency column does the same. The brake power column does
        the same. The ONLY field that changes at {fmt(fit.qMax, 0)} bbl/d is the last one, and it is
        a boolean.
      </div>
      <div className="mt-2 text-xs text-pl-text">
        The strip on the chart runs from the last published rate to
        {' '}{fmt(ex.vendorZeroHeadBpd, 4)} bbl/d, where this fit's head reaches nought. That is
        {' '}{fmt(ex.vendorZeroHeadPastDataBpd, 4)} bbl/d of answers that are finite, smooth,
        monotone and entirely invented, because the cubic is doing what a cubic does outside the
        span it was fitted on. Past it the head is NEGATIVE and the brake power goes negative with
        it, on {fmt(negativeHead.length, 0)} rows of this sweep, and the engine still answers,
        because the hydraulic power went negative while the efficiency was still positive.
      </div>
      <div className="mt-2 text-xs text-pl-text">
        THE ONLY HARD STOP IN THE CHAIN is brakeHp's own guard, and it does not fire until the
        EFFICIENCY fit has gone negative too, at {fmt(ex.vendorZeroEfficiencyBpd, 4)} bbl/d. That is
        {' '}{fmt(ex.vendorEfficiencyOutlivesHeadBpd, 4)} bbl/d further on again, long after the
        answers stopped meaning anything. A refusal that arrives that late is not a guard on the
        physics, it is a guard on the arithmetic.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">the same sweep on a QUADRATIC head fit, bbl/d</th>
              <th className="text-left pr-3">head, ft</th>
              <th className="text-left pr-3">efficiency</th>
              <th className="text-left pr-3">region</th>
              <th className="text-left">in range</th>
            </tr>
          </thead>
          <tbody>
            {refRows.map((r) => (
              <tr key={r.qBpd}>
                <td className="pr-3">{fmt(r.qBpd, 0)}</td>
                <td className="pr-3 text-pl-primary-text">{fmt(r.headFt, 6)}</td>
                <td className="pr-3 text-pl-info-text">{fmt(r.efficiency, 6)}</td>
                <td className="pr-3" style={{ color: REGION_COLOUR[r.region] }}>{r.region}</td>
                <td className={r.inRange ? '' : 'text-pl-warning-text'}>{yn(r.inRange)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-pl-text">
        That second table is the control. It is a QUADRATIC head fit on a reference stage, swept the
        same way, and it does the same thing: falls smoothly through its own boundary, crosses nought
        at {fmt(ex.referenceZeroHeadBpd, 4)} bbl/d, {fmt(ex.referenceZeroHeadPastDataBpd, 4)} bbl/d
        past its data, and flips one boolean on the way. So this is a property of EXTRAPOLATION and
        not of the cubic. The golden's own extrapolated row says the same thing from the other
        direction: {fmt(golden.qBpd, 0)} bbl/d at {fmt(golden.hz, 0)} Hz maps back to
        {' '}{fmt(golden.qRefBpd, 0)} bbl/d on the reference curve,
        {' '}{fmt(golden.pastDataBpd, 0)} bbl/d past the end of the data, and comes back with a
        number and inRange {yn(golden.inRange)}.
      </div>
      <div className="mt-2 text-xs text-pl-text">
        The efficiency fit outliving the head fit is why the brake power goes negative rather than
        undefined. On the tail sweep the last rate at which this vendor curve still returns a
        POSITIVE efficiency is {lastPositiveEfficiency ? fmt(lastPositiveEfficiency.qBpd, 0) : 'n/a'}
        {' '}bbl/d, reading
        {' '}{lastPositiveEfficiency ? fmt(lastPositiveEfficiency.vendorEfficiency, 6) : 'n/a'}, and the
        head there went long ago. A positive efficiency dividing a negative hydraulic power is a
        negative brake power, and that is a number rather than a refusal.
      </div>
      <Note>
        There is nothing to fix here and that is the lesson. A polynomial has no way to know where
        its data ended, so a package that answers everywhere has to hand the caller a flag and trust
        it to be read. inRange false is that flag. It is not a warning, it is not a refusal, and it
        does not change a single number in the row it sits on, which is exactly why it gets ignored.
      </Note>
    </>
  );
};

const StageExplorer = () => {
  const [mode, setMode] = useState('fit');
  return (
    <PanelShell
      title="Stage explorer"
      subtitle="The cubic through the published vendor points and what the quality check does and does not see, the best efficiency point as a scan result, one duty rate read for head, efficiency and power, and what the same fit returns past the end of its own data"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'fit' && <Fit />}
        {mode === 'bep' && <Bep />}
        {mode === 'duty' && <Duty />}
        {mode === 'edge' && <Edge />}
      </div>
    </PanelShell>
  );
};

export default StageExplorer;
