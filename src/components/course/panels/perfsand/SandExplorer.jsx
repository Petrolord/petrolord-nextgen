import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  UM, THOU, PARAMS, SAUCIER_RANGE, rungTable, saucierSweep, gaugeTable, packFor,
  publishedStats, sandControlAdvisor, screenSelection, sieveStats, ptsOf, RUNG_SANDS,
  cdpFor, stepIndependence, weakenedCurves, boostSweep, boostAtZeroMargin,
} from './perfsandLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Sand explorer: which completion type the sieve indicates, what gravel and
// screen follow from it, and whether the rock will make sand at all.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const MODES = [
  { value: 'ladder', label: 'The advisor ladder' },
  { value: 'gravel', label: 'Gravel and screens' },
  { value: 'sanding', label: 'Sanding onset' },
];

const Ladder = () => {
  const rows = useMemo(() => rungTable(), []);
  const published = useMemo(() => {
    const s = publishedStats();
    return { stats: s, advisor: sandControlAdvisor(s) };
  }, []);
  return (
    <>
      <TileGrid>
        <Tile label="Published sand uniformity" value={fmt(published.stats.uniformity, 5)} />
        <Tile label="Published sand fines" value={fmt(published.stats.finesPct, 4)} unit="pct" />
        <Tile label="Indication" value={published.advisor.indication} />
        <Tile label="Rungs" value={published.advisor.checks.length} />
        <Tile label="Rungs passed" value={published.advisor.checks.filter((c) => c.pass).length} />
        <Tile label="Sands shown" value={rows.length} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">rule</th><th className="text-right pr-3">holds</th>
              <th className="text-left">indication</th>
            </tr>
          </thead>
          <tbody>
            {published.advisor.checks.map((c) => (
              <tr key={c.rule}>
                <td className="pr-3">{c.rule}</td>
                <td className={`text-right pr-3 ${c.pass ? 'text-emerald-400' : 'text-slate-500'}`}>{c.pass ? 'yes' : 'no'}</td>
                <td>{c.indication}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">sand</th><th className="text-right pr-3">D50 (um)</th>
              <th className="text-right pr-3">uniformity</th><th className="text-right pr-3">fines (pct)</th>
              <th className="text-left">indication</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td className="pr-3">{r.name}</td>
                <td className="text-right pr-3">{fmt(r.d50M / UM, 3)}</td>
                <td className="text-right pr-3">{fmt(r.uniformity, 5)}</td>
                <td className="text-right pr-3">{fmt(r.finesPct, 4)}</td>
                <td>{r.indication}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Look at the third and fourth rows. Their uniformity is within a fifth of a point of each
        other and they land on different rungs, because the FINES moved. In the middle of the
        range the fines decide, and the uniformity only takes over at the extremes.
      </div>
      <Note>
        The ladder is ordered and exhaustive: the first rule that holds is the answer, and the last
        rule catches everything the first three do not. It is a screening indication from two
        numbers. A real selection is decided by lab particle size analysis and by retained
        permeability testing on the actual screen and the actual fluid.
      </Note>
    </>
  );
};

const Gravel = () => {
  const [d50Um, setD50Um] = useState('');
  const names = Object.keys(RUNG_SANDS);
  const [name, setName] = useState('graded');
  const stats = useMemo(() => sieveStats(ptsOf(RUNG_SANDS[name])), [name]);
  const d50 = d50Um === '' ? stats.d50M / UM : Number(d50Um);
  const pack = useMemo(() => {
    try { return packFor(d50 * UM); } catch { return null; }
  }, [d50]);
  const sw = useMemo(() => saucierSweep(), []);
  const gt = useMemo(() => gaugeTable(), []);
  const sa = useMemo(() => screenSelection({ mode: 'standalone', stats }), [stats]);
  if (!pack) return <Note>That D50 does not size a gravel.</Note>;
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Sand" value={name} onChange={setName}
          options={names.map((n) => ({ value: n, label: n }))} />
        <NumField label="Or a D50 directly (um)" value={d50Um} onChange={setD50Um} placeholder={fmt(stats.d50M / UM, 2)} />
      </div>
      <TileGrid>
        <Tile label="Formation D50" value={fmt(d50, 4)} unit="um" />
        <Tile label="Saucier band" value={`${fmt(pack.bandMinM / UM, 2)} to ${fmt(pack.bandMaxM / UM, 2)}`} unit="um" />
        <Tile label="Commercial match" value={pack.noMatch ? 'none, nearest used' : 'yes'} />
        <Tile label="Gravel" value={pack.mesh} />
        <Tile label="Largest gauge that fits" value={fmt(pack.maxGaugeM / THOU, 4)} unit="thou" />
        <Tile label="Gauge chosen" value={fmt(pack.gaugeThou, 0)} unit="thou" />
        <Tile label="Gauge margin" value={fmt(pack.marginM / UM, 3)} unit="um" />
        <Tile label="Standalone slot window" value={`${fmt(sa.slotMinM / UM, 2)} to ${fmt(sa.slotMaxM / UM, 2)}`} unit="um" />
        <Tile label="Saucier range" value={SAUCIER_RANGE.join(' to ')} unit="x D50" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">formation D50 (um)</th><th className="text-right pr-3">band (um)</th>
              <th className="text-left pr-3">matches</th><th className="text-left">nearest</th>
            </tr>
          </thead>
          <tbody>
            {sw.map((r) => (
              <tr key={r.d50Um}>
                <td className="pr-3">{r.d50Um}</td>
                <td className="text-right pr-3">{fmt(r.bandMinM / UM, 1)} to {fmt(r.bandMaxM / UM, 1)}</td>
                <td className={`pr-3 ${r.noMatch ? 'text-amber-400' : 'text-emerald-400'}`}>{r.noMatch ? 'none' : r.matches.join(', ')}</td>
                <td>{r.nearest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">gravel</th><th className="text-right pr-3">smallest grain (um)</th>
              <th className="text-right pr-3">gauge (thou)</th><th className="text-right">margin (um)</th>
            </tr>
          </thead>
          <tbody>
            {gt.map((r) => (
              <tr key={r.mesh}>
                <td className="pr-3">{r.mesh}</td>
                <td className="text-right pr-3">{fmt(r.minM / UM, 1)}</td>
                <td className="text-right pr-3">{fmt(r.gaugeThou, 0)}</td>
                <td className="text-right">{fmt(r.marginM / UM, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The Saucier band is only one point two times wide and the commercial sands are dual
        designations spanning nearly two to one, so three of the seven sample sands in the table
        above have no match at all. The gauge series saturates at both ends, which is why two
        different gravels can arrive at the same screen.
      </Note>
    </>
  );
};

const Sanding = () => {
  const [geometry, setGeometry] = useState('perf-tunnel');
  const [boost, setBoost] = useState('');
  const [step, setStep] = useState('');
  const [weak, setWeak] = useState('published');
  const boostFactor = boost === '' ? PARAMS.boostFactor : Number(boost);
  const stepMdM = step === '' ? PARAMS.stepMdM : Number(step);
  const curves = useMemo(() => (weak === 'published' ? undefined : weakenedCurves()), [weak]);
  const r = useMemo(() => {
    try { return cdpFor({ geometry, boostFactor, stepMdM, ...(curves ? { curves } : {}) }); } catch { return null; }
  }, [geometry, boostFactor, stepMdM, curves]);
  const steps = useMemo(() => {
    try { return stepIndependence(undefined, { geometry, boostFactor, ...(curves ? { curves } : {}) }); } catch { return []; }
  }, [geometry, boostFactor, curves]);
  const bs = useMemo(() => {
    try { return boostSweep(undefined, { geometry, stepMdM, ...(curves ? { curves } : {}) }); } catch { return []; }
  }, [geometry, stepMdM, curves]);
  const zero = useMemo(() => {
    try { return boostAtZeroMargin({ geometry, stepMdM, ...(curves ? { curves } : {}) }); } catch { return null; }
  }, [geometry, stepMdM, curves]);
  if (!r) return <Note>That interval, step or boost does not describe a sweep.</Note>;
  const data = r.rows.map((x) => ({ md: x.mdM, cdpMPa: x.cdpPa / 1e6, ppMPa: x.ppPa / 1e6, pwfMPa: x.pwfCritPa / 1e6 }));
  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <SelectField label="Cavity" value={geometry} onChange={setGeometry}
          options={[{ value: 'perf-tunnel', label: 'Perf tunnel' }, { value: 'openhole', label: 'Open hole' }]} />
        <SelectField label="Profile" value={weak} onChange={setWeak}
          options={[{ value: 'published', label: 'Published' }, { value: 'weak', label: 'Weak at the base' }]} />
        <NumField label={`Strength boost (default ${PARAMS.boostFactor})`} value={boost} onChange={setBoost} placeholder={String(PARAMS.boostFactor)} />
        <NumField label={`Step (m, default ${PARAMS.stepMdM})`} value={step} onChange={setStep} placeholder={String(PARAMS.stepMdM)} />
      </div>
      <TileGrid>
        <Tile label="Rows" value={r.rows.length} />
        <Tile label="First row" value={fmt(r.rows[0].mdM, 1)} unit="m MD" />
        <Tile label="Last row" value={fmt(r.rows[r.rows.length - 1].mdM, 1)} unit="m MD" />
        <Tile label="Governing depth" value={fmt(r.governing.mdM, 1)} unit="m MD" />
        <Tile label="Governing margin" value={fmt(r.governing.cdpPa / 1e6, 5)} unit="MPa" />
        <Tile label="Critical flowing pressure" value={fmt(r.governing.pwfCritPa / 1e6, 5)} unit="MPa" />
        <Tile label="Margin at the bottom" value={fmt(r.rows[r.rows.length - 1].cdpPa / 1e6, 5)} unit="MPa" />
        <Tile label="Boost for zero margin" value={zero == null ? '-' : fmt(zero, 6)} />
        <Tile label="Screening grade" value="yes" />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="md" type="number" domain={['dataMin', 'dataMax']}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'measured depth (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'MPa', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 5)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#f472b6" />
            <Line type="monotone" dataKey="cdpMPa" name="drawdown margin" stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="ppMPa" name="pore pressure" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="pwfMPa" name="critical flowing pressure" stroke="#94a3b8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">step (m)</th><th className="text-right pr-3">rows</th>
                <th className="text-right pr-3">last row</th><th className="text-right">governing (MPa)</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((x) => (
                <tr key={x.stepMdM}>
                  <td className="pr-3">{x.stepMdM}</td>
                  <td className="text-right pr-3">{x.rows}</td>
                  <td className="text-right pr-3">{fmt(x.lastMdM, 1)}</td>
                  <td className="text-right">{fmt(x.governingCdpPa / 1e6, 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bs} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="boostFactor" tick={{ fill: '#94a3b8', fontSize: 10 }}
                label={{ value: 'strength boost', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x / 1e6, 4)} />
              <ReferenceLine y={0} stroke="#f472b6" />
              <Bar dataKey="governingCdpPa" name="governing margin" fill="#38bdf8" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Every step size in the left table ends at the same depth, which is the interval bottom.
        That was not always true: a step that did not divide the interval used to stop at the last
        whole step, and on the weak profile in the drop-down the row it dropped was the one that
        governed. Switch the profile and set the step to 30 to see the two rows the sweep now keeps.
      </div>
      <Note>
        This is a screening criterion and not a sand rate. It says whether the cavity wall reaches
        its unconfined strength at the flowing pressure, on a Kirsch hoop stress with the near-wall
        pore pressure. It does not say how much sand, for how long, or whether the well can live
        with it. The strength boost is the knob a thick-walled-cylinder calibration turns.
      </Note>
    </>
  );
};

const SandExplorer = () => {
  const [mode, setMode] = useState('ladder');
  return (
    <PanelShell
      title="Sand control explorer"
      subtitle="Which completion type, which gravel and screen, and whether the rock makes sand at all"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'ladder' && <Ladder />}
        {mode === 'gravel' && <Gravel />}
        {mode === 'sanding' && <Sanding />}
      </div>
    </PanelShell>
  );
};

export default SandExplorer;
