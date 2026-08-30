import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import {
  OFFSET_WELLS, CLEARANCE_PARAMS, clearanceCase, clearanceSensitivity,
  wmmCheck, magneticFieldAt, azimuthConversion,
} from './welldesignLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Clearance explorer: the ISCWSA standard example wells, what the separation
// factor moves with, and the geomagnetic reference every azimuth depends on.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const MODES = [
  { value: 'ladder', label: 'Separation factor' },
  { value: 'sensitivity', label: 'What it moves with' },
  { value: 'magnetics', label: 'The reference frame' },
];
const WELL_OPTIONS = OFFSET_WELLS.map((w) => ({ value: w, label: w }));

const STATUS_COLOUR = { 'no-go': 'text-red-400', review: 'text-amber-400', clear: 'text-emerald-400' };

const Ladder = () => {
  const [well, setWell] = useState('10 - well');
  const c = useMemo(() => clearanceCase(well), [well]);
  const series = c.md.map((md, i) => ({ md, sf: c.sf[i], dist: c.distanceCC[i] }));
  return (
    <>
      <SelectField label="Offset well" value={well} onChange={setWell} options={WELL_OPTIONS} />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="md" type="number" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'reference MD (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 4)} />
            <ReferenceLine y={1.5} stroke="#f59e0b" strokeDasharray="4 4" />
            <ReferenceLine y={1.0} stroke="#ef4444" strokeDasharray="4 4" />
            <ReferenceLine y={0} stroke="#64748b" />
            <Line dataKey="sf" stroke="#BFFF00" dot={false} strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <TileGrid>
        <Tile label="Minimum separation factor" value={fmt(c.minSf, 6)} />
        <Tile label="Published minimum" value={fmt(c.publishedMinSf, 6)} />
        <Tile label="Worst relative error" value={c.worstRelError.toExponential(2)} />
        <Tile label="Kickoff depth" value={c.kopDepth == null ? 'none' : fmt(c.kopDepth, 0)} unit={c.kopDepth == null ? '' : 'm'} />
        <Tile label="Stations" value={String(c.md.length)} />
        <Tile label="Classification" value={c.classification.status} />
      </TileGrid>
      <div className={`mt-3 text-xs ${STATUS_COLOUR[c.classification.status] || 'text-gray-300'}`}>
        {c.classification.violations.length} station
        {c.classification.violations.length === 1 ? '' : 's'} below the review threshold of
        {' '}{c.classification.thresholds.review}, of which
        {' '}{c.classification.violations.filter((v) => v.level === 'no-go').length} below the no-go
        threshold of {c.classification.thresholds.noGo}.
      </div>
      {c.minSf < 0 && (
        <div className="mt-3 rounded border border-amber-700/60 bg-amber-950/30 p-3">
          <p className="text-amber-300 text-xs font-medium mb-1">This separation factor is negative</p>
          <p className="text-[11px] text-amber-200/90">
            The two uncertainty envelopes overlap. A negative separation factor and a positive one
            are not two points on the same scale: the numerator has gone below zero, so anything
            that enlarges the denominator moves the number towards zero and makes it look better.
            Switch to the sensitivity view and watch it happen.
          </p>
        </div>
      )}
    </>
  );
};

const Sensitivity = () => {
  const [well, setWell] = useState('10 - well');
  const s = useMemo(() => clearanceSensitivity(well), [well]);
  return (
    <>
      <SelectField label="Offset well" value={well} onChange={setWell} options={WELL_OPTIONS} />
      <div className="mt-3 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="text-left p-2">Assumption</th>
              <th className="text-right p-2">Minimum separation factor</th>
              <th className="text-right p-2">Change</th>
            </tr>
          </thead>
          <tbody>
            {s.sweep.map((r, i) => (
              <tr key={r.label} className="border-t border-gray-800">
                <td className="p-2 text-white">{r.label}</td>
                <td className="p-2 text-right text-gray-200">{fmt(r.minSf, 6)}</td>
                <td className={`p-2 text-right ${i === 0 ? 'text-gray-600' : r.minSf > s.sweep[0].minSf ? 'text-emerald-400' : 'text-red-400'}`}>
                  {i === 0 ? 'baseline' : fmt(r.minSf - s.sweep[0].minSf, 6)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TileGrid>
        <Tile label="Published k" value={String(s.base.k)} />
        <Tile label="Surface position sigma" value={String(s.base.sigmaPa)} unit="m" />
        <Tile label="Tool projection allowance" value={String(s.base.Sm)} unit="m" />
        <Tile label="k 5 over k 2 ratio" value={fmt(s.kRatio, 6)} />
      </TileGrid>
      <Note>
        Read the ratio. When the envelopes overlap and the separation factor is negative, it is
        inversely proportional to the confidence factor, so the ratio of the k 5 case to the k 2
        case is exactly two fifths. Choosing a larger k, or admitting a larger surface position
        error, improves the number without moving either well.
      </Note>
    </>
  );
};

const Magnetics = () => {
  const [lat, setLat] = useState('60');
  const [lon, setLon] = useState('2');
  const [conv, setConv] = useState('1.5');
  const check = useMemo(() => wmmCheck(), []);
  const f = useMemo(() => {
    const la = Number(lat); const lo = Number(lon);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
    return magneticFieldAt({ latDeg: la, lonDeg: lo });
  }, [lat, lon]);
  const conversion = f ? azimuthConversion({
    magneticAzi: 90, declinationDeg: f.declinationDeg, convergenceDeg: Number(conv) || 0,
  }) : null;
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <NumField label="Latitude (deg)" value={lat} onChange={setLat} />
        <NumField label="Longitude (deg)" value={lon} onChange={setLon} />
        <NumField label="Grid convergence (deg)" value={conv} onChange={setConv} />
      </div>
      {f && (
        <TileGrid>
          <Tile label="Declination" value={fmt(f.declinationDeg, 5)} unit="deg" />
          <Tile label="Inclination (dip)" value={fmt(f.inclinationDeg, 5)} unit="deg" />
          <Tile label="Total field" value={fmt(f.f, 2)} unit="nT" />
          <Tile label="Declination drift" value={fmt(f.declinationDotDeg, 5)} unit="deg/yr" />
          <Tile label="A magnetic azimuth of 90" value={fmt(conversion.true, 5)} unit="deg true" />
          <Tile label="The same, on grid north" value={fmt(conversion.grid, 5)} unit="deg grid" />
        </TileGrid>
      )}
      <div className="mt-4 rounded border border-gray-700 overflow-x-auto max-h-56">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400 sticky top-0">
            <tr>
              <th className="text-right p-1.5">Lat</th><th className="text-right p-1.5">Lon</th>
              <th className="text-right p-1.5">Published D</th><th className="text-right p-1.5">Engine D</th>
              <th className="text-right p-1.5">Error</th>
            </tr>
          </thead>
          <tbody>
            {check.rows.map((r) => (
              <tr key={`${r.latDeg}-${r.lonDeg}-${r.date}-${r.heightKm}`} className="border-t border-gray-800">
                <td className="p-1.5 text-right text-gray-200">{fmt(r.latDeg, 0)}</td>
                <td className="p-1.5 text-right text-gray-200">{fmt(r.lonDeg, 0)}</td>
                <td className="p-1.5 text-right text-gray-400">{fmt(r.publishedD, 2)}</td>
                <td className="p-1.5 text-right text-white">{fmt(r.declinationDeg, 5)}</td>
                <td className="p-1.5 text-right text-gray-500">{fmt(r.dError, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Worst declination error against NOAA's own test values: {fmt(check.maxDeclinationError, 8)}
        {' '}degrees, which is the precision the published table is printed to. Every azimuth in a
        magnetic survey rests on this model, and the error model needs its total field and dip as
        inputs before it will compute anything at all.
      </Note>
    </>
  );
};

const ClearanceExplorer = () => {
  const [mode, setMode] = useState('ladder');
  return (
    <PanelShell
      title="Clearance explorer"
      subtitle="The ISCWSA standard example wells, the assumptions behind a separation factor, and the north it is all measured from"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <p className="text-[11px] text-gray-500 mt-2">
        Pedal-curve method at k {CLEARANCE_PARAMS.k}, surface position sigma
        {' '}{CLEARANCE_PARAMS.sigmaPa} m, tool projection allowance {CLEARANCE_PARAMS.Sm} m,
        reference radius {CLEARANCE_PARAMS.refRadius} m, offset radius {CLEARANCE_PARAMS.offRadius} m.
      </p>
      <div className="mt-3">
        {mode === 'ladder' && <Ladder />}
        {mode === 'sensitivity' && <Sensitivity />}
        {mode === 'magnetics' && <Magnetics />}
      </div>
    </PanelShell>
  );
};

export default ClearanceExplorer;
