import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import ChartFrame from '@/components/charts/ChartFrame';
import { GRID_STYLE, TOOLTIP_STYLE } from '@/utils/chartTheme';
import { AXIS_TICK, seriesColor } from '@/utils/chartSvg';
import { uncertaintyAt, workbookCheck, WELL1_HEADER } from './welldesignLab';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Uncertainty explorer: the ISCWSA MWD Rev4 validation well, one station at a
// time. The ellipse, the borehole-frame sigmas, and which error sources are
// actually paying for them.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const STATIONS = [
  { value: '40', label: 'shallow, still vertical' },
  { value: '100', label: 'through the build' },
  { value: '180', label: 'in the tangent' },
  { value: '267', label: 'total depth, horizontal' },
];

const UncertaintyExplorer = () => {
  const [idx, setIdx] = useState('180');
  const u = useMemo(() => uncertaintyAt(Number(idx)), [idx]);
  const check = useMemo(() => workbookCheck(), []);
  const top = u.contributions.slice(0, 8).map((c) => ({
    code: c.code, share: 100 * c.shareOfTrace, propagation: c.propagation,
  }));

  return (
    <PanelShell
      title="Uncertainty explorer"
      subtitle="The ISCWSA MWD Rev4 validation well, and where its position uncertainty comes from"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <SelectField label="Station" value={idx} onChange={setIdx} options={STATIONS} />
        <div className="text-xs text-pl-muted self-end pb-2">
          Total field {WELL1_HEADER.bTotalNT} nT, dip {WELL1_HEADER.dipDeg} deg, declination
          {' '}{WELL1_HEADER.declinationDeg} deg, azimuths referenced to {WELL1_HEADER.aziReference} north.
        </div>
      </div>

      <TileGrid>
        <Tile label="Measured depth" value={fmt(u.md, 1)} unit="m" />
        <Tile label="True vertical depth" value={fmt(u.tvd, 2)} unit="m" />
        <Tile label="Inclination" value={fmt(u.incDeg, 3)} unit="deg" />
        <Tile label="Azimuth" value={fmt(u.aziDeg, 3)} unit="deg true" />
        <Tile label="Highside sigma" value={fmt(u.sigmaH, 4)} unit="m" />
        <Tile label="Lateral sigma" value={fmt(u.sigmaL, 4)} unit="m" />
        <Tile label="Along-hole sigma" value={fmt(u.sigmaA, 4)} unit="m" />
        <Tile label="Lateral over highside" value={fmt(u.sigmaL / u.sigmaH, 3)} unit="times" />
        <Tile label="Ellipse semi-major" value={fmt(u.ellipse1.semiMajor, 4)} unit="m at 1 sigma" />
        <Tile label="Ellipse semi-minor" value={fmt(u.ellipse1.semiMinor, 4)} unit="m at 1 sigma" />
        <Tile label="Ellipse azimuth" value={fmt(u.ellipse1.azimuthDeg, 4)} unit="deg" />
        <Tile label="Semi-major at 95 percent" value={fmt(u.ellipse95.semiMajor, 4)} unit="m, k 2.7955" />
        <Tile label="North-north variance" value={fmt(u.cov[0][0], 4)} unit="m2, total covariance" />
      </TileGrid>

      <p className="text-[11px] text-pl-muted mt-4">
        Share of the total variance by source, at this station. {u.contributions.length} sources
        contribute; the eight largest are shown.
      </p>
      <ChartFrame height={208} className="mt-1">
        <BarChart data={top} margin={{ top: 8, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="code" tick={{ ...AXIS_TICK, fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={50} />
          <YAxis tick={AXIS_TICK} unit="%" />
          <Tooltip contentStyle={TOOLTIP_STYLE}
            formatter={(v) => `${fmt(v, 3)} percent`} />
          <Bar dataKey="share" fill={seriesColor(0)} isAnimationActive={false} />
        </BarChart>
      </ChartFrame>

      <div className="mt-3 rounded border border-pl-border overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-pl-sunken text-pl-muted">
            <tr>
              <th className="text-left p-2">Source</th>
              <th className="text-left p-2">Propagation</th>
              <th className="text-right p-2">Share</th>
              <th className="text-right p-2">Variance (m2)</th>
              <th className="text-left p-2">Depth only</th>
            </tr>
          </thead>
          <tbody>
            {u.contributions.slice(0, 8).map((c) => (
              <tr key={c.code} className="border-t border-pl-border">
                <td className="p-2 text-pl-text">{c.code}</td>
                <td className="p-2 text-pl-muted">{c.propagation}</td>
                <td className="p-2 text-right text-pl-text">{fmt(100 * c.shareOfTrace, 3)} percent</td>
                <td className="p-2 text-right text-pl-muted">{fmt(c.trace, 4)}</td>
                <td className="p-2 text-pl-muted">{c.depthOnly ? 'yes' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Note>
        The engine reproduces {check.rows} published per-source workbook values at four depths to a
        worst relative error of {check.worst.rel.toExponential(2)}, and the totals at total depth to
        {' '}{check.totals.maxRel.toExponential(2)}. That is not a claim about the reservoir; it is a
        claim that this implementation is the published model. Change the station above and watch
        the ranking change: an uncertainty budget quoted without the attitude and depth it was
        computed at is not a budget.
      </Note>
    </PanelShell>
  );
};

export default UncertaintyExplorer;
