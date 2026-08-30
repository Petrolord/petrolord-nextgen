import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
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
  const [idx, setIdx] = useState('267');
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
        <div className="text-xs text-gray-400 self-end pb-2">
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
      </TileGrid>

      <p className="text-[11px] text-gray-400 mt-4">
        Share of the total variance by source, at this station. {u.contributions.length} sources
        contribute; the eight largest are shown.
      </p>
      <div className="h-52 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top} margin={{ top: 8, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="code" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={50} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => `${fmt(v, 3)} percent`} />
            <Bar dataKey="share" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400">
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
              <tr key={c.code} className="border-t border-gray-800">
                <td className="p-2 text-white">{c.code}</td>
                <td className="p-2 text-gray-400">{c.propagation}</td>
                <td className="p-2 text-right text-gray-200">{fmt(100 * c.shareOfTrace, 3)} percent</td>
                <td className="p-2 text-right text-gray-400">{fmt(c.trace, 4)}</td>
                <td className="p-2 text-gray-500">{c.depthOnly ? 'yes' : ''}</td>
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
