import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  RESERVOIR, fixture, fixtureTruth, buildupWindow, windowWalk, WINDOW_CUTS, timeTransforms,
} from './welltestLab';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Buildup explorer: the learner chooses which shut-in points are in the
// semilog line and watches the answer move. Nothing else about the test
// changes. A wrong window gives a wrong permeability and a skin of the wrong
// sign, and that is the point.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const CUT_OPTIONS = WINDOW_CUTS.map((c) => ({
  value: String(c),
  label: c === 0 ? 'every point (40)' : `shut-in at or after ${c} h`,
}));

const BuildupExplorer = () => {
  const [cut, setCut] = useState('5');

  const view = useMemo(() => {
    const minDt = Number(cut);
    const bu = fixture('buildup');
    const fit = buildupWindow(minDt);
    const points = bu.points.map((p) => ({
      horner: timeTransforms(p.dt).horner,
      pws: p.pws,
      inFit: p.dt >= minDt,
      dt: p.dt,
    }));
    // the fitted line, drawn only across the points it was fitted over
    const used = points.filter((p) => p.inFit);
    const line = used.map((p) => ({
      horner: p.horner,
      fitted: fit.pStar - fit.m * Math.log10(p.horner),
    }));
    return { fit, points, line, truth: fixtureTruth('buildup'), used: used.length };
  }, [cut]);

  const { fit, points, line, truth, used } = view;
  const walk = windowWalk();

  return (
    <PanelShell
      title="Buildup explorer"
      subtitle="One buildup, 40 points, and the only thing you change is which of them are in the line"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <SelectField label="Points in the semilog fit" value={cut} onChange={setCut} options={CUT_OPTIONS} />
        <div className="text-xs text-gray-400 self-end pb-2">
          Producing time 36 h, flowing pressure at shut-in 4530.77 psi, rate 450 stb/d.
        </div>
      </div>

      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="horner" type="number" scale="log" reversed
              domain={[1, 4000]} allowDataOverflow
              ticks={[1, 10, 100, 1000]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis dataKey="pws" type="number" domain={['dataMin - 20', 'dataMax + 20']}
              tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 2)} />
            <Scatter data={points.filter((p) => !p.inFit)} dataKey="pws" fill="#64748b" />
            <Scatter data={points.filter((p) => p.inFit)} dataKey="pws" fill="#BFFF00" />
            <Line data={line} dataKey="fitted" stroke="#38bdf8" dot={false} strokeWidth={2}
              isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-gray-500 mt-1">
        Horner ratio on a reversed log axis: shut-in runs left to right, and the extrapolation to
        a ratio of 1 at the right-hand edge is p star.
      </p>

      <TileGrid>
        <Tile label="Points in the fit" value={String(used)} unit="of 40" />
        <Tile label="Permeability" value={fmt(fit.k, 3)} unit={`mD, planted ${truth.k}`} />
        <Tile label="Skin" value={fmt(fit.skin, 3)} unit={`planted +${truth.skin}`} />
        <Tile label="Semilog slope" value={fmt(fit.m, 3)} unit="psi per cycle" />
        <Tile label="p star" value={fmt(fit.pStar, 3)} unit="psia" />
        <Tile label="p at 1 hour on the line" value={fmt(fit.p1hr, 3)} unit="psia" />
        <Tile label="Skin pressure drop" value={fmt(fit.dpSkin, 2)} unit="psi" />
        <Tile label="Radius of investigation" value={fmt(fit.riAtTp, 1)} unit="ft at 36 h" />
        <Tile label="Flow efficiency" value={fmt(fit.flowEfficiency, 4)} unit="of ideal" />
        <Tile label="r squared" value={fmt(fit.r2, 7)} />
        <Tile label="Permeability error" value={fmt(fit.kErrorPct, 3)} unit="percent" />
        <Tile label="Skin error" value={fmt(fit.skinError, 3)} />
      </TileGrid>

      <div className="mt-4 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="text-left p-2">Window</th>
              <th className="text-right p-2">n</th>
              <th className="text-right p-2">k (mD)</th>
              <th className="text-right p-2">Skin</th>
              <th className="text-right p-2">r squared</th>
            </tr>
          </thead>
          <tbody>
            {walk.map((w) => (
              <tr key={w.minDt} className={`border-t border-gray-800 ${String(w.minDt) === cut ? 'bg-white/5' : ''}`}>
                <td className="p-2 text-white">
                  {w.minDt === 0 ? 'every point' : `shut-in at or after ${w.minDt} h`}
                </td>
                <td className="p-2 text-right text-gray-200">{w.n}</td>
                <td className="p-2 text-right text-gray-200">{fmt(w.k, 3)}</td>
                <td className={`p-2 text-right ${w.skin < 0 ? 'text-amber-400' : 'text-gray-200'}`}>
                  {fmt(w.skin, 3)}
                </td>
                <td className="p-2 text-right text-gray-400">{fmt(w.r2, 7)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {fit.skin < 0 ? (
        <div className="mt-3 rounded border border-amber-700/60 bg-amber-950/30 p-3">
          <p className="text-amber-300 text-xs font-medium mb-1">This window says the well is stimulated</p>
          <p className="text-[11px] text-amber-200/90">
            The skin has come out negative on a well whose planted skin is plus 6.5. Nothing about
            the well changed. The storage-affected early points are in the line, they are steeper
            than radial flow, and a steeper line is a lower permeability and a smaller skin.
          </p>
        </div>
      ) : (
        <Note>
          The fit converges towards the planted values from below and does not reach them: even the
          last thirteen points carry a little of the transition out of wellbore storage. Converging
          towards the truth is not landing on it, and a course that showed an exact recovery would
          be teaching a fiction.
        </Note>
      )}
    </PanelShell>
  );
};

export default BuildupExplorer;
