import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  PARAMS, PROPPANT, CFD_OPTIMUM, CFD_RANGE, M2_PER_DARCY,
  balanceOf, scheduleOf, leakoffSweep, packOf, publishedPack, publishedPkn,
  publishedProductivity, cfdSweep, searchOptimum, PROP_VOLUME_M3,
} from './stimulationLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Pack explorer, the Expert tier. The pad trap, what the proppant actually
// leaves behind, what that pack is worth to the well, and the search that
// rederives the unified optimum without being told it.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const mm = (v) => fmt(v * 1000, 4);

const MODES = [
  ['schedule', 'The pad trap and the ramp'],
  ['pack', 'What the proppant leaves behind'],
  ['conductivity', 'Length against conductivity'],
  ['optimum', 'The one point six result'],
];

const Schedule = () => {
  const bal = useMemo(() => balanceOf(), []);
  const sch = useMemo(() => scheduleOf(), []);
  const sw = useMemo(() => leakoffSweep(), []);
  const naive = 1 - bal.etaFrac;
  const err = naive - sch.padFrac;
  const data = sw.map((r) => ({
    etaFrac: r.etaFrac,
    padFrac: r.padFrac,
    oneMinusEta: r.oneMinusEta,
    padFracError: r.padFracError,
  })).sort((a, b) => a.etaFrac - b.etaFrac);
  return (
    <>
      <TileGrid>
        <Tile label="Fluid efficiency" value={fmt(bal.etaFrac, 6)} />
        <Tile label="Pad fraction, the engine" value={fmt(sch.padFrac, 6)} />
        <Tile label="One minus efficiency, the naive form" value={fmt(naive, 6)} />
        <Tile label="Error between them" value={fmt(err, 6)} />
        <Tile label="Error as a share of the pad" value={fmt(100 * err / sch.padFrac, 3)} unit="pct too much pad" />
        <Tile label="Ramp exponent" value={fmt(sch.eps, 6)} />
        <Tile label="Pad time" value={fmt(sch.tPadS / 60, 4)} unit="min" />
        <Tile label="Ramp time" value={fmt(sch.rampS / 60, 4)} unit="min" />
        <Tile label="Pad volume" value={fmt(sch.padM3, 4)} unit="m3" />
        <Tile label="Naive pad volume" value={fmt(naive * bal.viM3, 4)} unit="m3" />
        <Tile label="Extra pad the naive form pumps" value={fmt(naive * bal.viM3 - sch.padM3, 4)} unit="m3" />
        <Tile label="Ramp steps" value={sch.steps.length} />
      </TileGrid>
      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="etaFrac" type="number" domain={[0, 1]}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'fluid efficiency', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 1]}
                label={{ value: 'pad fraction', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 6)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine x={bal.etaFrac} stroke="#f472b6"
                label={{ value: 'this job', fill: '#f472b6', fontSize: 10, position: 'top' }} />
              <Line type="monotone" dataKey="oneMinusEta" name="one minus efficiency, WRONG" stroke="#f472b6" dot isAnimationActive={false} />
              <Line type="monotone" dataKey="padFrac" name="the engine pad fraction" stroke="#BFFF00" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="etaFrac" tickFormatter={(x) => fmt(x, 3)}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                label={{ value: 'fluid efficiency', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }}
                label={{ value: 'error in the pad fraction', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 6)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#64748b" />
              <Bar dataKey="padFracError" name="how much too much pad" fill="#f472b6" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">leakoff</th>
                <th className="text-right pr-3">efficiency</th>
                <th className="text-right pr-3">pad fraction</th>
                <th className="text-right pr-3">one minus efficiency</th>
                <th className="text-right">error</th>
              </tr>
            </thead>
            <tbody>
              {sw.map((r) => (
                <tr key={r.clMSqrtS}>
                  <td className="pr-3">{r.clMSqrtS === 0 ? 'none' : r.clMSqrtS.toExponential(1)}</td>
                  <td className="text-right pr-3">{fmt(r.etaFrac, 5)}</td>
                  <td className="text-right pr-3 text-emerald-400">{fmt(r.padFrac, 5)}</td>
                  <td className="text-right pr-3 text-rose-400">{fmt(r.oneMinusEta, 5)}</td>
                  <td className="text-right text-amber-400">{fmt(r.padFracError, 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">step</th>
                <th className="text-right pr-3">start (min)</th>
                <th className="text-right pr-3">end (min)</th>
                <th className="text-right pr-3">concentration (kg/m3)</th>
                <th className="text-right">slurry (m3)</th>
              </tr>
            </thead>
            <tbody>
              {sch.steps.map((s, i) => (
                <tr key={s.tStartS}>
                  <td className="pr-3">{i + 1}</td>
                  <td className="text-right pr-3">{fmt(s.tStartS / 60, 3)}</td>
                  <td className="text-right pr-3">{fmt(s.tEndS / 60, 3)}</td>
                  <td className="text-right pr-3">{fmt(s.cKgM3, 3)}</td>
                  <td className="text-right">{fmt(s.slurryM3, 4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Read the two lines on the left chart. The pad fraction is
        {' '}(one minus efficiency) divided by (one plus efficiency), and NOT one minus efficiency.
        On this job the engine asks for {fmt(sch.padFrac, 4)} and the naive form asks for
        {' '}{fmt(naive, 4)}, an error of {fmt(err, 4)}, which is
        {' '}{fmt(100 * err / sch.padFrac, 1)} percent too much pad and
        {' '}{fmt(naive * bal.viM3 - sch.padM3, 1)} extra cubic metres of clean fluid.
      </div>
      <Note>
        Too much pad shortens the fracture, because the pad is the part of the job that carries no
        proppant. The bar chart shows the error vanishing at both ends and peaking in between,
        which is not what intuition says: it is worst at an intermediate efficiency and not at the
        hardest job. The ramp is a power law with the same exponent as the pad fraction, stepped
        into {sch.steps.length} stages for the blender, and the concentration reaches
        {' '}{fmt(PARAMS.cEojKgM3, 0)} kg per cubic metre at the end of the job.
      </Note>
    </>
  );
};

const Pack = () => {
  const [mass, setMass] = useState('');
  const defaultMass = useMemo(() => scheduleOf().massKg, []);
  const massKg = mass === '' ? defaultMass : Number(mass);
  const pack = useMemo(() => {
    try { return packOf(massKg); } catch { return null; }
  }, [massKg]);
  const pub = useMemo(() => publishedPack(), []);
  const created = useMemo(() => publishedPkn().wAvgM, []);
  const prod = useMemo(() => publishedProductivity(), []);
  if (!pack) {
    return <Note>That mass does not place a pack. The proppant mass has to be positive before there is a propped width to report.</Note>;
  }
  const bars = [
    { name: 'created width (mm)', v: created * 1000 },
    { name: 'propped width (mm)', v: pack.wpM * 1000 },
  ];
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumField label={`Proppant mass (kg, default the scheduled ${fmt(defaultMass, 0)})`} value={mass} onChange={setMass} placeholder={fmt(defaultMass, 0)} />
      </div>
      <TileGrid>
        <Tile label="Areal concentration" value={fmt(pack.arealKgM2, 6)} unit="kg/m2" />
        <Tile label="Propped width" value={mm(pack.wpM)} unit="mm" />
        <Tile label="Created width, PKN average" value={mm(created)} unit="mm" />
        <Tile label="Created over propped" value={fmt(created / pack.wpM, 5)} unit="times" />
        <Tile label="Fracture conductivity" value={fmt(pack.kfwM3 / (M2_PER_DARCY * 1000), 6)} unit="mD.m" />
        <Tile label="Retained pack permeability" value={fmt(pack.retainedKfM2 / (M2_PER_DARCY * 1000), 3)} unit="mD" />
        <Tile label="Damage factor on the pack" value={fmt(PARAMS.damageFactor, 3)} />
        <Tile label="Pack porosity" value={fmt(PROPPANT.packPorosity, 3)} />
        <Tile label="Proppant density" value={fmt(PROPPANT.rhoKgM3, 0)} unit="kg/m3" />
        <Tile label="Proppant" value={PROPPANT.name} />
        <Tile label="Published areal concentration" value={fmt(pub.arealKgM2, 6)} unit="kg/m2" />
        <Tile label="Dimensionless conductivity" value={fmt(prod.cfd, 6)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'width (mm)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 5)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="v" name="width" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The fracture you created is {mm(created)} mm across and the pack you left in it is only
        {' '}{mm(pack.wpM)} mm, a factor of {fmt(created / pack.wpM, 2)}. The fracture closes on
        the proppant and the propped width is set by how much proppant is there, not by how wide
        the rock was held open while the pumps were running.
      </div>
      <Note>
        Areal concentration is the honest currency here: kilogrammes on every square metre of one
        fracture face. Divide it by the density of the packed grains, which is the grain density
        times one minus the pack porosity, and you have the propped width. The damage factor of
        {' '}{fmt(PARAMS.damageFactor, 2)} is the fraction of the pack permeability that survives
        the gel and the fines, and it is applied before anything else is calculated from it.
      </Note>
    </>
  );
};

const Conductivity = () => {
  const sw = useMemo(() => cfdSweep(), []);
  const prod = useMemo(() => publishedProductivity(), []);
  const vp = useMemo(() => PROP_VOLUME_M3(), []);
  const data = sw.map((r) => ({ ...r, wpMm: r.wpM * 1000 }));
  return (
    <>
      <TileGrid>
        <Tile label="Proppant volume held fixed" value={fmt(vp, 5)} unit="m3" />
        <Tile label="Rows" value={sw.length} />
        <Tile label="Shortest half-length" value={fmt(sw[0].xfM, 0)} unit="m" />
        <Tile label="Conductivity there" value={fmt(sw[0].cfd, 5)} />
        <Tile label="Longest half-length" value={fmt(sw[sw.length - 1].xfM, 0)} unit="m" />
        <Tile label="Conductivity there" value={fmt(sw[sw.length - 1].cfd, 5)} />
        <Tile label="Published conductivity" value={fmt(prod.cfd, 6)} />
        <Tile label="Published pseudo-skin" value={fmt(prod.sF, 6)} />
        <Tile label="Published effective radius" value={fmt(prod.rwPrimeM, 5)} unit="m" />
        <Tile label="The f function there" value={fmt(prod.f, 6)} />
        <Tile label="Correlation range" value={CFD_RANGE.join(' to ')} />
        <Tile label="Published sits" value={prod.cfd < CFD_OPTIMUM ? 'BELOW the optimum' : 'above the optimum'} />
      </TileGrid>
      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="xfM" type="number" scale="log" domain={['dataMin', 'dataMax']}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'half-length (m, log)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'dimensionless conductivity', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 5)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={CFD_OPTIMUM} stroke="#f472b6"
                label={{ value: `the engine optimum ${CFD_OPTIMUM}`, fill: '#f472b6', fontSize: 10, position: 'insideTopRight' }} />
              <Line type="monotone" dataKey="cfd" name="dimensionless conductivity" stroke="#BFFF00" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="xfM" type="number" scale="log" domain={['dataMin', 'dataMax']}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'half-length (m, log)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'pseudo-skin', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 5)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="sF" name="pseudo-skin, lower is better" stroke="#38bdf8" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">xf (m)</th>
              <th className="text-right pr-3">propped width (mm)</th>
              <th className="text-right pr-3">conductivity</th>
              <th className="text-right pr-3">f</th>
              <th className="text-right pr-3">pseudo-skin</th>
              <th className="text-right">effective radius (m)</th>
            </tr>
          </thead>
          <tbody>
            {sw.map((r) => (
              <tr key={r.xfM}>
                <td className="pr-3">{fmt(r.xfM, 0)}</td>
                <td className="text-right pr-3">{mm(r.wpM)}</td>
                <td className={`text-right pr-3 ${r.cfd > CFD_OPTIMUM ? 'text-emerald-400' : 'text-rose-400'}`}>{fmt(r.cfd, 5)}</td>
                <td className="text-right pr-3">{fmt(r.f, 5)}</td>
                <td className="text-right pr-3">{fmt(r.sF, 5)}</td>
                <td className="text-right">{fmt(r.rwPrimeM, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The proppant volume is held fixed down the whole table, so a longer fracture is a thinner
        one and the conductivity falls on every row. The pseudo-skin does not fall with it. It
        turns, which means somewhere between a short fat fracture and a long thin one there is a
        best answer, and the next view goes and finds it.
      </div>
      <Note>
        Dimensionless conductivity compares the fracture with the rock it has to drain, so it is
        the pack conductivity divided by the formation permeability times the half-length. A
        conductivity on its own says nothing. The published job sits at {fmt(prod.cfd, 4)}, which
        is below the optimum, so it is conductivity-starved rather than length-starved and the fix
        is more proppant per metre and not more metres.
      </Note>
    </>
  );
};

const Optimum = () => {
  const found = useMemo(() => searchOptimum(), []);
  const prod = useMemo(() => publishedProductivity(), []);
  const around = useMemo(() => cfdSweep([
    found.xfM * 0.25, found.xfM * 0.4, found.xfM * 0.6, found.xfM * 0.8,
    found.xfM, found.xfM * 1.25, found.xfM * 1.7, found.xfM * 2.5, found.xfM * 4,
  ]), [found.xfM]);
  const gap = found.cfd - found.publishedConstant;
  return (
    <>
      <div className="rounded-md border border-[#BFFF00]/40 bg-[#BFFF00]/5 p-4 mb-3">
        <p className="text-xs text-gray-400 mb-1">The headline result of the course</p>
        <div className="grid gap-3 sm:grid-cols-3 items-end">
          <div>
            <p className="text-gray-500 text-xs mb-0">Searched on the engine</p>
            <p className="text-[#BFFF00] text-3xl font-bold mb-0">{fmt(found.cfd, 4)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-0">The published constant</p>
            <p className="text-white text-3xl font-bold mb-0">{fmt(found.publishedConstant, 4)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-0">Apart by</p>
            <p className="text-white text-3xl font-bold mb-0">{fmt(100 * Math.abs(found.ratioToConstant - 1), 2)}<span className="text-sm text-gray-400 ml-1">pct</span></p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 mb-0">
          A golden-section search on the engine's OWN pseudo-skin, which has never been shown the
          constant, walks the length and width trade at fixed proppant volume and stops at
          {' '}{fmt(found.cfd, 6)}. The engine publishes {fmt(found.publishedConstant, 2)}. The gap
          is {fmt(gap, 6)}.
        </p>
      </div>
      <TileGrid>
        <Tile label="Searched conductivity" value={fmt(found.cfd, 8)} />
        <Tile label="Published CFD_OPTIMUM" value={fmt(found.publishedConstant, 4)} />
        <Tile label="Searched over published" value={fmt(found.ratioToConstant, 8)} />
        <Tile label="Difference" value={fmt(gap, 8)} />
        <Tile label="Optimum half-length" value={fmt(found.xfM, 4)} unit="m" />
        <Tile label="Pseudo-skin there" value={fmt(found.sF, 6)} />
        <Tile label="Effective wellbore radius there" value={fmt(found.rwPrimeM, 5)} unit="m" />
        <Tile label="Designed half-length" value={fmt(PARAMS.xfM, 0)} unit="m" />
        <Tile label="Published conductivity" value={fmt(prod.cfd, 6)} />
        <Tile label="Published pseudo-skin" value={fmt(prod.sF, 6)} />
        <Tile label="Pseudo-skin left on the table" value={fmt(prod.sF - found.sF, 6)} />
        <Tile label="The published job is" value={prod.cfd < found.publishedConstant ? 'conductivity-starved' : 'length-starved'} />
      </TileGrid>
      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={around} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="xfM" type="number" scale="log" domain={['dataMin', 'dataMax']}
                tickFormatter={(x) => fmt(x, 0)} tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'half-length (m, log)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'pseudo-skin', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 6)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine x={found.xfM} stroke="#BFFF00"
                label={{ value: 'the search stops here', fill: '#BFFF00', fontSize: 10, position: 'top' }} />
              <Line type="monotone" dataKey="sF" name="pseudo-skin, the thing being minimised" stroke="#38bdf8" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={around} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="xfM" type="number" scale="log" domain={['dataMin', 'dataMax']}
                tickFormatter={(x) => fmt(x, 0)} tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'half-length (m, log)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'dimensionless conductivity', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 6)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={found.publishedConstant} stroke="#f472b6"
                label={{ value: `published ${fmt(found.publishedConstant, 2)}`, fill: '#f472b6', fontSize: 10, position: 'insideTopRight' }} />
              <ReferenceLine x={found.xfM} stroke="#BFFF00"
                label={{ value: `searched ${fmt(found.cfd, 3)}`, fill: '#BFFF00', fontSize: 10, position: 'top' }} />
              <Line type="monotone" dataKey="cfd" name="dimensionless conductivity" stroke="#BFFF00" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">xf (m)</th>
              <th className="text-right pr-3">propped width (mm)</th>
              <th className="text-right pr-3">conductivity</th>
              <th className="text-right pr-3">pseudo-skin</th>
              <th className="text-right">against the optimum</th>
            </tr>
          </thead>
          <tbody>
            {around.map((r) => (
              <tr key={r.xfM} className={Math.abs(r.xfM - found.xfM) < 1e-9 ? 'text-[#BFFF00]' : ''}>
                <td className="pr-3">{fmt(r.xfM, 2)}</td>
                <td className="text-right pr-3">{mm(r.wpM)}</td>
                <td className="text-right pr-3">{fmt(r.cfd, 5)}</td>
                <td className="text-right pr-3">{fmt(r.sF, 6)}</td>
                <td className="text-right">{fmt(r.sF - found.sF, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The last column is zero on exactly one row and positive on every other, which is what an
        interior minimum looks like. Go shorter and the fracture is fat but does not reach; go
        longer and it reaches but cannot carry. The searched conductivity at that point is
        {' '}{fmt(found.cfd, 4)} against a published {fmt(found.publishedConstant, 2)}.
      </div>
      <Note>
        A constant you can rederive from an independent route is a RESULT. One you can only quote
        is a convention. Nothing in this search knows the number it is going to land on: it walks
        the trade between length and width at a fixed proppant volume and minimises the engine's
        own Cinco-Ley pseudo-skin. If a future edit broke that f function, the search would drift
        off {fmt(found.publishedConstant, 2)} and the test that pins this panel would say so.
        Notice also what the optimum is NOT. It is not a rule that more conductivity is better, and
        it is not a target you chase past the point where the pseudo-skin has flattened out.
      </Note>
    </>
  );
};

const PackExplorer = () => {
  const [mode, setMode] = useState('schedule');
  return (
    <PanelShell
      title="Proppant pack and optimum explorer"
      subtitle="The pad trap, the propped width, what the pack is worth, and the search that rederives the unified optimum"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'schedule' && <Schedule />}
        {mode === 'pack' && <Pack />}
        {mode === 'conductivity' && <Conductivity />}
        {mode === 'optimum' && <Optimum />}
      </div>
    </PanelShell>
  );
};

export default PackExplorer;
