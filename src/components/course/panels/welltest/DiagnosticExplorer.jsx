import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  TRANSIENT_FIXTURES, fixtureTruth, derivative, plateauMean, theoreticalPlateau,
  faultLines, fractureLinearFit, fractureAsRadial, rectanglePss, dualPorosityDip, dataPrep,
} from './welltestLab';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Diagnostic explorer: the log-log plot every modern interpretation starts
// from. Pressure change and its Bourdet derivative on the same axes, the
// engine's own regime labels underneath, and a standing reminder that a
// label is a slope band rather than a diagnosis.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const FIXTURE_OPTIONS = TRANSIENT_FIXTURES.map((f) => ({ value: f.id, label: f.label }));
const L_OPTIONS = [0, 0.1, 0.2, 0.3, 0.5].map((v) => ({ value: String(v), label: `L = ${v} cycles` }));

// The engine now names a transition rather than mislabelling it. What it
// cannot name is a FIRST segment that could be near-well geometry or could be
// the roll-off of a storage unit slope, because separating those needs the
// pressure curve and detectFlowRegimes is given only the derivative.
const TRANSITION_REGIMES = new Set(['transition']);
const AMBIGUOUS_FIRST = new Set(['linear', 'bilinear']);

const extras = (id) => {
  if (id === 'faultDrawdown') {
    const f = faultLines();
    return [
      ['Early line permeability', fmt(f.early.k, 3), 'mD over 1 to 20 h'],
      ['Late line permeability', fmt(f.late.k, 3), 'mD over 200 to 1000 h'],
      ['Late slope over early slope', fmt(f.slopeRatio, 5), 'doubling in progress'],
      ['Late line skin', fmt(f.late.skin, 3), 'the sign inverts again'],
    ];
  }
  if (id === 'icFractureDrawdown') {
    const l = fractureLinearFit();
    const bad = fractureAsRadial();
    return [
      ['sqrt-time slope', fmt(l.slope, 4), 'psi per sqrt hour, 0.1 to 10 h'],
      ['Half-length from that slope', fmt(l.xf, 2), `ft, planted ${l.truth.xf}`],
      ['Half-length error', fmt(l.xfErrorPct, 3), 'percent'],
      ['k if you fit a semilog line', fmt(bad.k, 3), `mD, planted ${l.truth.k}`],
    ];
  }
  if (id === 'rectangleDrawdown') {
    const r = rectanglePss();
    return [
      ['Cartesian late slope', fmt(r.mStar, 6), 'psi per hour'],
      ['Pore volume', fmt(r.poreVolumeMMbbl, 5), 'MMbbl'],
      ['Drainage area', fmt(r.areaAcres, 4), 'acres'],
      ['Area error', fmt(r.areaErrorPct, 5), 'percent'],
    ];
  }
  if (id === 'dualPorosityDrawdown') {
    const d = dualPorosityDip();
    return [
      ['Derivative minimum', fmt(d.dipDerivative, 4), `psi at ${fmt(d.dipX, 3)} h`],
      ['Late plateau', fmt(d.latePlateau, 4), 'psi'],
      ['Dip ratio', fmt(d.dipRatio, 5), `omega is ${d.truth.omega}`],
      ['Interporosity coefficient', String(d.truth.lambda), 'planted'],
    ];
  }
  if (id === 'drawdown') {
    const p = dataPrep();
    return [
      ['Points', String(p.denseN), 'over four decades'],
      ['After decimation', String(p.decimatedN), `at ${p.pointsPerDecade} per decade`],
      ['Spikes removed', String(p.removedN), `at ${fmt(p.removedAt[0], 4)} h`],
      ['What one spike does', fmt(p.maxDerivativeShiftPct, 1), 'percent on the derivative'],
    ];
  }
  return [];
};

const DiagnosticExplorer = () => {
  const [id, setId] = useState('buildup');
  const [L, setL] = useState('0.1');

  const view = useMemo(() => {
    const { points, regimes } = derivative(id, { L: Number(L) });
    const chart = points
      .filter((p) => p.y > 0)
      .map((p) => ({ x: p.x, dp: p.y, deriv: Number.isFinite(p.derivative) && p.derivative > 0 ? p.derivative : null }));
    const truth = fixtureTruth(id) || {};
    const late = plateauMean(id, { from: id === 'buildup' ? 5 : 200, L: Number(L) });
    return { chart, regimes, truth, late, story: TRANSIENT_FIXTURES.find((f) => f.id === id).story };
  }, [id, L]);

  const { chart, regimes, truth, late, story } = view;
  const suspect = regimes.filter((r) => TRANSITION_REGIMES.has(r.regime));
  const ambiguousFirst = regimes.length > 0 && AMBIGUOUS_FIRST.has(regimes[0].regime);

  return (
    <PanelShell
      title="Diagnostic explorer"
      subtitle="Pressure change and its derivative on one log-log plot, with the labels the engine puts on them"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <SelectField label="Test" value={id} onChange={setId} options={FIXTURE_OPTIONS} />
        <SelectField label="Bourdet smoothing" value={L} onChange={setL} options={L_OPTIONS} />
      </div>
      <p className="text-[11px] text-gray-400 mt-2">{story}</p>

      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="x" type="number" scale="log" domain={['auto', 'auto']} allowDataOverflow
              tick={{ fill: '#94a3b8', fontSize: 11 }} name="hours" />
            <YAxis type="number" scale="log" domain={['auto', 'auto']} allowDataOverflow
              tick={{ fill: '#94a3b8', fontSize: 11 }} name="psi" />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            <Scatter name="pressure change" data={chart} dataKey="dp" fill="#BFFF00" />
            <Scatter name="derivative" data={chart} dataKey="deriv" fill="#38bdf8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <TileGrid>
        <Tile label="Late derivative plateau" value={fmt(late, 4)} unit="psi, averaged" />
        {truth.k && (
          <Tile label="Plateau at the planted k" value={fmt(theoreticalPlateau(truth.k), 4)} unit="psi" />
        )}
        {Object.entries(truth).map(([k, v]) => (
          <Tile key={k} label={`Planted ${k}`} value={String(v)} />
        ))}
      </TileGrid>

      <div className="mt-4 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="text-left p-2">Regime the engine reports</th>
              <th className="text-right p-2">from (h)</th>
              <th className="text-right p-2">to (h)</th>
              <th className="text-right p-2">decades</th>
            </tr>
          </thead>
          <tbody>
            {regimes.length === 0 && (
              <tr><td className="p-2 text-gray-500" colSpan={4}>No segment held for a quarter of a decade.</td></tr>
            )}
            {regimes.map((r) => (
              <tr key={`${r.regime}-${r.xStart}`} className="border-t border-gray-800">
                <td className={`p-2 ${TRANSITION_REGIMES.has(r.regime) ? 'text-amber-400' : 'text-white'}`}>
                  {r.label}
                </td>
                <td className="p-2 text-right text-gray-200">{fmt(r.xStart, 4)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(r.xEnd, 4)}</td>
                <td className="p-2 text-right text-gray-400">{fmt(r.spanDecades, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {extras(id).length > 0 && (
        <div className="mt-3 rounded border border-gray-700 overflow-x-auto">
          <table className="w-full text-xs">
            <tbody>
              {extras(id).map(([label, value, unit]) => (
                <tr key={label} className="border-t border-gray-800 first:border-t-0">
                  <td className="p-2 text-gray-400">{label}</td>
                  <td className="p-2 text-right text-white">{value}</td>
                  <td className="p-2 text-gray-500">{unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {ambiguousFirst ? (
        <div className="mt-3 rounded border border-amber-700/60 bg-amber-950/30 p-3">
          <p className="text-amber-300 text-xs font-medium mb-1">
            The first segment is the one the ordering rules cannot check
          </p>
          <p className="text-[11px] text-amber-200/90">
            A fracture's linear flow legitimately comes first in a test, and so does the roll-off of
            a wellbore storage unit slope, so nothing about the ORDER separates them. The pressure
            does: during storage the pressure change and its derivative are the same quantity and
            lie on top of each other. Compare the two series above over that interval before
            accepting the label.
          </p>
        </div>
      ) : (
        <Note>
          {suspect.length > 0
            ? `${suspect.length} of these segments ${suspect.length === 1 ? 'is a transition' : 'are transitions'} rather than a regime: a steep fall between two regimes lands in the constant-pressure band and a slow rise between two plateaus lands in the bilinear band, and the engine's ordering rules relabel both. The extent is still reported, because a transition is part of the response.`
            : 'Every segment here passes the slope check, the span check and the order check. The two the software cannot make are yours: does the level imply a credible number, and do the pressure and derivative curves agree with the regime being claimed?'}
        </Note>
      )}
    </PanelShell>
  );
};

export default DiagnosticExplorer;
