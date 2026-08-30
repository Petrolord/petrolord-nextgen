import React, { useMemo, useState } from 'react';
import {
  FIT_MODELS, TRANSIENT_FIXTURES, fitModel, phantomFault, multiRateCase,
  pseudoPressureGap, deliverabilityCase, rtaOil, rtaGas, rtaLinear,
} from './welltestLab';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Regression explorer: the automatic match, and the production-data analyses
// that use no shut-in at all. Two modes because they answer two different
// questions, and because a learner should see that the same engine is behind
// both.

const fmt = (v, d = 5) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumSignificantDigits: 10, maximumFractionDigits: d })
  : '-');

const MODEL_LABELS = {
  homogeneous: 'Homogeneous',
  'homogeneous-sealing-fault': 'Homogeneous + sealing fault',
  'dual-porosity-pss': 'Dual porosity (Warren-Root)',
  'fracture-infinite-conductivity': 'Vertical fracture, infinite conductivity',
  'horizontal-well': 'Horizontal well',
};

const MODE_OPTIONS = [
  { value: 'fit', label: 'Model fit' },
  { value: 'production', label: 'Production data' },
];
const MODEL_OPTIONS = FIT_MODELS.map((m) => ({ value: m, label: MODEL_LABELS[m] }));
const FIXTURE_OPTIONS = TRANSIENT_FIXTURES.map((f) => ({ value: f.id, label: f.label }));
const WEIGHT_OPTIONS = [
  { value: '1', label: 'pressure and derivative' },
  { value: '0', label: 'pressure only' },
];

const FitMode = () => {
  const [modelId, setModelId] = useState('homogeneous');
  const [fixtureId, setFixtureId] = useState('buildup');
  const [weight, setWeight] = useState('1');

  const fit = useMemo(
    () => fitModel(modelId, fixtureId, { derivativeWeight: Number(weight) }),
    [modelId, fixtureId, weight],
  );
  const phantom = useMemo(
    () => (modelId === 'homogeneous-sealing-fault' && fixtureId === 'buildup' ? phantomFault() : null),
    [modelId, fixtureId],
  );

  if (!fit) return <Note>That model could not be fitted to that test.</Note>;

  const truthOf = (key) => (fit.truth && key in fit.truth ? fit.truth[key] : null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <SelectField label="Model" value={modelId} onChange={setModelId} options={MODEL_OPTIONS} />
        <SelectField label="Test" value={fixtureId} onChange={setFixtureId} options={FIXTURE_OPTIONS} />
        <SelectField label="Residuals" value={weight} onChange={setWeight} options={WEIGHT_OPTIONS} />
      </div>

      <div className="mt-3 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="text-left p-2">Parameter</th>
              <th className="text-right p-2">Fitted</th>
              <th className="text-right p-2">95 percent interval</th>
              <th className="text-right p-2">Width</th>
              <th className="text-right p-2">Planted</th>
            </tr>
          </thead>
          <tbody>
            {fit.parameterMeta.map((meta) => {
              const t = truthOf(meta.key);
              const v = fit.params[meta.key];
              const off = t !== null && Math.abs(v - t) > Math.max(Math.abs(t) * 0.02, 1e-9);
              return (
                <tr key={meta.key} className="border-t border-gray-800">
                  <td className="p-2 text-white">
                    {meta.label} <span className="text-gray-500">({meta.unit})</span>
                  </td>
                  <td className={`p-2 text-right ${off ? 'text-amber-400' : 'text-gray-200'}`}>{fmt(v)}</td>
                  <td className="p-2 text-right text-gray-400">
                    {fmt(fit.confidence95[meta.key][0])} to {fmt(fit.confidence95[meta.key][1])}
                  </td>
                  <td className="p-2 text-right text-gray-400">{fmt(fit.intervalWidth[meta.key])}</td>
                  <td className="p-2 text-right text-gray-500">{t === null ? 'not in this test' : String(t)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <TileGrid>
        <Tile label="Sum of squared residuals" value={fit.ssr.toExponential(4)} unit="log space" />
        <Tile label="Iterations" value={String(fit.iterations)} />
        <Tile label="Converged" value={fit.converged ? 'yes' : 'no'} />
        <Tile label="Parameters" value={String(fit.parameterMeta.length)} unit="being fitted" />
      </TileGrid>

      {phantom && (
        <div className="mt-3 rounded border border-amber-700/60 bg-amber-950/30 p-3">
          <p className="text-amber-300 text-xs font-medium mb-1">
            There is no fault in this test, and the fit has found one anyway
          </p>
          <p className="text-[11px] text-amber-200/90">
            Write the same pressure change two arithmetically equivalent ways, differing by
            {' '}{phantom.dataGap.toExponential(3)} psi, and the boundary moves
            {' '}{fmt(phantom.distanceGapFt, 2)} ft, from {fmt(phantom.storedDp.L, 2)} to
            {' '}{fmt(phantom.subtracted.L, 2)} ft. The two 95 percent intervals
            {phantom.intervalsOverlap ? ' overlap' : ' never meet'}. The permeability does not
            move at all. A parameter the data do not constrain is decided by rounding.
          </p>
        </div>
      )}
      {!phantom && fit.converged === false && (
        <Note>
          The optimiser reports failure. Look at the parameter that has reached a bound before
          concluding the answer is wrong: a model asked to describe a reservoir it does not apply
          to often degenerates to the right answer and cannot say so.
        </Note>
      )}
    </>
  );
};

const ProductionMode = () => {
  const mr = useMemo(() => multiRateCase(), []);
  const oil = useMemo(() => rtaOil(), []);
  const gas = useMemo(() => rtaGas(), []);
  const lin = useMemo(() => rtaLinear(), []);
  const dl = useMemo(() => deliverabilityCase(), []);
  const gap = useMemo(() => pseudoPressureGap(2000, 4000), []);

  const rows = [
    ['Multi-rate semilog, three rates', fmt(mr.multiRate.k, 4), `mD, planted ${mr.truthK}`],
    ['The last period read alone', fmt(mr.naive.k, 4), `mD, ${fmt(mr.naiveKErrorPct, 2)} percent high`],
    ['Equivalent producing time', fmt(mr.equivalentTp, 5), `h, the last rate ran for ${mr.lastRateHours}`],
    ['Oil in place, flowing material balance', fmt(oil.N, 1), `stb, planted ${oil.truth.N}`],
    ['Productivity index', fmt(oil.J, 5), 'stb/d/psi'],
    ['Gas in place, dynamic material balance', fmt(gas.G, 1), `Mscf in ${gas.iterations} iterations`],
    ['Pseudo-time over material-balance time', fmt(gas.tcaLast / gas.teLast, 5), 'at the last row'],
    ['Half-length times root permeability', fmt(lin.xfSqrtK, 4), 'ft sqrt(mD), and it will not split'],
    ['m(4000) over m(2000)', fmt(gap.mRatio, 5), `against ${gap.pSquaredRatio} for pressure squared`],
    ['Back-pressure absolute open flow', fmt(dl.backPressure.aof, 1), `Mscf/d at r2 ${fmt(dl.backPressure.r2, 8)}`],
    ['LIT absolute open flow', fmt(dl.lit.aof, 1), `Mscf/d at r2 ${fmt(dl.lit.r2, 8)}`],
    ['The two disagree by', fmt(dl.aofGapPct, 4), 'percent on the same three points'],
  ];

  return (
    <>
      <p className="text-[11px] text-gray-400">
        No shut-in anywhere below. Rate and flowing pressure, a time transform, and a straight line.
      </p>
      <div className="mt-3 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <tbody>
            {rows.map(([label, value, unit]) => (
              <tr key={label} className="border-t border-gray-800 first:border-t-0">
                <td className="p-2 text-gray-400">{label}</td>
                <td className="p-2 text-right text-white">{value}</td>
                <td className="p-2 text-gray-500">{unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="text-left p-2">If the permeability were</th>
              {lin.split.map((s) => <th key={s.k} className="text-right p-2">{s.k} mD</th>)}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-800">
              <td className="p-2 text-white">the half-length would be (ft)</td>
              {lin.split.map((s) => <td key={s.k} className="p-2 text-right text-gray-200">{fmt(s.xf, 2)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
      <Note>
        The linear-flow analysis measures a product. Every column above fits the data exactly as
        well as every other, and choosing between them needs a permeability from somewhere that is
        not this test.
      </Note>
    </>
  );
};

const RegressionExplorer = () => {
  const [mode, setMode] = useState('fit');
  return (
    <PanelShell
      title="Regression explorer"
      subtitle="An automatic match, and the production-data analyses that never shut the well in"
    >
      <SelectField label="Mode" value={mode} onChange={setMode} options={MODE_OPTIONS} />
      <div className="mt-3">
        {mode === 'fit' ? <FitMode /> : <ProductionMode />}
      </div>
    </PanelShell>
  );
};

export default RegressionExplorer;
