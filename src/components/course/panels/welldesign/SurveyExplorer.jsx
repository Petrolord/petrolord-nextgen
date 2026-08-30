import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  GOLDEN_WELLS, surveyListing, surveyMethods, ADE_PUBLISHED, buildHoldCase,
  sProfileCase, S_PROFILE_COUNT, tvdCrossingCases,
} from './welldesignLab';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Survey explorer: the listing a directional driller reads, the four classical
// methods on one published example, and a trajectory design compiled onto its
// own station list.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const MODES = [
  { value: 'listing', label: 'Survey listing' },
  { value: 'methods', label: 'The four methods' },
  { value: 'design', label: 'Trajectory design' },
];
const WELLS = GOLDEN_WELLS.map((w) => ({ value: w.id, label: w.label }));

const Listing = () => {
  const [id, setId] = useState('feet');
  const s = useMemo(() => surveyListing(id), [id]);
  const crossings = useMemo(() => tvdCrossingCases(), []);
  return (
    <>
      <SelectField label="Well" value={id} onChange={setId} options={WELLS} />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={s.rows} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="vs" type="number" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: `vertical section (${s.mdUnit})`, position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis dataKey="tvd" type="number" reversed tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 2)} />
            <Line dataKey="tvd" stroke="#BFFF00" dot={{ r: 2 }} strokeWidth={2} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <TileGrid>
        <Tile label="Stations" value={String(s.rows.length)} />
        <Tile label="Total MD" value={fmt(s.totalMd, 1)} unit={s.mdUnit} />
        <Tile label="TVD at TD" value={fmt(s.tvd, 4)} unit={s.mdUnit} />
        <Tile label="North" value={fmt(s.n, 4)} unit={s.mdUnit} />
        <Tile label="East" value={fmt(s.e, 4)} unit={s.mdUnit} />
        <Tile label="Vertical section" value={fmt(s.vs, 4)} unit={`on ${fmt(s.vsAzimuthDeg, 1)} deg`} />
        <Tile label="Closure distance" value={fmt(s.closureDist, 4)} unit={s.mdUnit} />
        <Tile label="Closure azimuth" value={fmt(s.closureAzi, 4)} unit="deg" />
        <Tile label="Worst dogleg" value={fmt(s.maxDls30m, 4)} unit="deg/30m" />
        <Tile label="The same dogleg" value={fmt(s.maxDls100ft, 4)} unit="deg/100ft" />
      </TileGrid>
      <div className="mt-4 rounded border border-gray-700 overflow-x-auto max-h-64">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400 sticky top-0">
            <tr>
              {['MD', 'Inc', 'Azi', 'TVD', 'N', 'E', 'DLS/30m', 'VS'].map((h) => (
                <th key={h} className="text-right p-1.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {s.rows.map((r) => (
              <tr key={r.md} className="border-t border-gray-800">
                <td className="p-1.5 text-right text-white">{fmt(r.md, 1)}</td>
                <td className="p-1.5 text-right text-gray-200">{fmt(r.inc, 2)}</td>
                <td className="p-1.5 text-right text-gray-200">{fmt(r.azi, 2)}</td>
                <td className="p-1.5 text-right text-gray-200">{fmt(r.tvd, 3)}</td>
                <td className="p-1.5 text-right text-gray-400">{fmt(r.n, 3)}</td>
                <td className="p-1.5 text-right text-gray-400">{fmt(r.e, 3)}</td>
                <td className="p-1.5 text-right text-gray-400">{fmt(r.dls30m, 3)}</td>
                <td className="p-1.5 text-right text-gray-400">{fmt(r.vs, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The closure distance and the vertical section are different quantities. On the feet well
        they agree to thirteen figures, because it ends exactly on its vertical-section azimuth.
        On a well that turns, they do not. The engine also finds every crossing of a TVD plane,
        which is how a target is picked up: on the {crossings.stations}-station well it returns
        {' '}{crossings.cases.length} of them, matching the published values.
      </Note>
    </>
  );
};

const Methods = () => {
  const m = useMemo(() => surveyMethods(), []);
  return (
    <>
      <p className="text-[11px] text-gray-400">
        The Applied Drilling Engineering chapter 8 example: a due-north build at 3 deg per 100 ft
        from vertical to {m.finalInc} deg at {m.finalMd} ft measured depth, over {m.stations}
        {' '}stations. Published minimum-curvature results: TVD {ADE_PUBLISHED.minimumCurvature.tvd} ft,
        north {ADE_PUBLISHED.minimumCurvature.northDisplacement} ft.
      </p>
      <div className="mt-3 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="text-left p-2">Method</th>
              <th className="text-right p-2">TVD (ft)</th>
              <th className="text-right p-2">North (ft)</th>
              <th className="text-right p-2">TVD error</th>
              <th className="text-right p-2">North error</th>
              <th className="text-left p-2">In the engine</th>
            </tr>
          </thead>
          <tbody>
            {m.methods.map((x) => (
              <tr key={x.name} className="border-t border-gray-800">
                <td className="p-2 text-white">{x.name}</td>
                <td className="p-2 text-right text-gray-200">{fmt(x.tvd, 4)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(x.north, 4)}</td>
                <td className={`p-2 text-right ${Math.abs(x.tvdError) > 1 ? 'text-amber-400' : 'text-gray-400'}`}>
                  {fmt(x.tvdError, 4)}
                </td>
                <td className={`p-2 text-right ${Math.abs(x.northError) > 1 ? 'text-amber-400' : 'text-gray-400'}`}>
                  {fmt(x.northError, 4)}
                </td>
                <td className="p-2 text-gray-500">{x.implemented ? 'yes' : 'computed here for comparison'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The tangential method takes each whole interval at the LOWER station's attitude, so on a
        build it over-rotates every leg: 25 ft shallow and 43 ft north at 2000 ft of hole. It was
        the field standard into the 1970s. The balanced tangential method averages the two ends and
        lands within four tenths of a foot, and minimum curvature fits the circular arc that
        actually passes through both attitudes.
      </Note>
    </>
  );
};

const Design = () => {
  const [idx, setIdx] = useState('0');
  const bh = useMemo(() => buildHoldCase(0), []);
  const sp = useMemo(() => sProfileCase(Number(idx)), [idx]);
  const options = Array.from({ length: S_PROFILE_COUNT }, (_, i) => ({
    value: String(i), label: `S profile case ${i + 1}`,
  }));
  return (
    <>
      <p className="text-[11px] text-gray-400">
        A build and hold: {bh.design.kop} {bh.design.mdUnit} vertical, then build at
        {' '}{bh.design.rate} deg per {bh.design.mdUnit === 'ft' ? '100ft' : '30m'} to
        {' '}{bh.design.targetInc} deg, then hold {bh.design.holdLen}. Compiled into a station
        list and run through the same survey mathematics as a real survey.
      </p>
      <TileGrid>
        <Tile label="End MD" value={fmt(bh.end.md, 1)} unit={bh.design.mdUnit} />
        <Tile label="End TVD" value={fmt(bh.end.tvd, 4)} unit={bh.design.mdUnit} />
        <Tile label="End north" value={fmt(bh.end.n, 4)} />
        <Tile label="End east" value={fmt(bh.end.e, 4)} />
        <Tile label="Build length" value={fmt(bh.buildLen, 2)} />
        <Tile label="Worst dogleg" value={fmt(bh.qa.worstDls, 4)} unit={bh.qa.dlsConvention} />
      </TileGrid>
      <div className="mt-4">
        <SelectField label="S profile" value={idx} onChange={setIdx} options={options} />
      </div>
      {sp.feasible ? (
        <div className="mt-3 rounded border border-gray-700 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-black/40 text-gray-400">
              <tr><th className="text-left p-2">Quantity</th><th className="text-right p-2">Solver</th><th className="text-right p-2">Published</th></tr>
            </thead>
            <tbody>
              {[['Hold inclination (deg)', sp.report.holdIncDeg, sp.published.holdIncDeg],
                ['Build length', sp.report.buildLen, sp.published.buildLen],
                ['Hold length', sp.report.holdLen, sp.published.holdLen],
                ['Drop length', sp.report.dropLen, sp.published.dropLen]].map(([k, a, b]) => (
                  <tr key={k} className="border-t border-gray-800">
                    <td className="p-2 text-gray-400">{k}</td>
                    <td className="p-2 text-right text-white">{fmt(a, 6)}</td>
                    <td className="p-2 text-right text-gray-500">{fmt(b, 6)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3 rounded border border-amber-700/60 bg-amber-950/30 p-3">
          <p className="text-[11px] text-amber-200/90">{sp.error}</p>
        </div>
      )}
      <Note>
        A design is not a well path until it is compiled into stations. The compiler emits the
        station list, runs the same minimum-curvature mathematics over it, and reports the worst
        dogleg the design implies rather than the one that was asked for.
      </Note>
    </>
  );
};

const SurveyExplorer = () => {
  const [mode, setMode] = useState('listing');
  return (
    <PanelShell
      title="Survey explorer"
      subtitle="The listing, the methods it could have been computed with, and a design compiled into stations"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'listing' && <Listing />}
        {mode === 'methods' && <Methods />}
        {mode === 'design' && <Design />}
      </div>
    </PanelShell>
  );
};

export default SurveyExplorer;
