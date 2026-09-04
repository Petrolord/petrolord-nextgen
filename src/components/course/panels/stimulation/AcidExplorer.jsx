import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  PARAMS, ACID, ACID_MU_PA_S, hawkinsOf, hawkinsSweep, radiusSweep,
  sandstoneOf, acidSweep, carbonateOf, carbonateSweep, matrixCeilingOf, ceilingSweep,
} from './stimulationLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Acid explorer, the Associate tier. What the damage costs, what a sandstone
// job removes, what a carbonate job creates, and how fast the well will take
// the acid before it fractures instead.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const MODES = [
  ['damage', 'Damage and the Hawkins skin'],
  ['sandstone', 'A sandstone job'],
  ['carbonate', 'A carbonate job'],
  ['ceiling', 'The matrix rate ceiling'],
];

const Damage = () => {
  const [kk, setKk] = useState('');
  const [rs, setRs] = useState('');
  const kOverKs = kk === '' ? ACID.kOverKs : Number(kk);
  const rsM = rs === '' ? ACID.rsM : Number(rs);
  const skin = useMemo(() => {
    try { return hawkinsOf({ kOverKs, rsM }); } catch { return null; }
  }, [kOverKs, rsM]);
  const contrast = useMemo(() => hawkinsSweep(), []);
  const radius = useMemo(() => radiusSweep(), []);
  const doubled = useMemo(() => radius.map((r) => {
    let gain = null;
    try { gain = hawkinsOf({ rsM: 2 * r.rsM }) / r.skin; } catch { gain = null; }
    return { ...r, gainFromDoubling: gain };
  }), [radius]);
  const published = useMemo(() => hawkinsOf(), []);
  if (skin == null || !Number.isFinite(skin)) {
    return <Note>That contrast or that damaged radius is outside what Hawkins accepts. The contrast has to be at least one, and the damage has to sit outside the wellbore.</Note>;
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumField label={`Permeability contrast k/ks (default ${ACID.kOverKs})`} value={kk} onChange={setKk} placeholder={String(ACID.kOverKs)} />
        <NumField label={`Damaged radius rs (m, default ${ACID.rsM})`} value={rs} onChange={setRs} placeholder={String(ACID.rsM)} />
      </div>
      <TileGrid>
        <Tile label="Skin here" value={fmt(skin, 6)} />
        <Tile label="Published skin" value={fmt(published, 6)} />
        <Tile label="Wellbore radius" value={fmt(PARAMS.rwM, 4)} unit="m" />
        <Tile label="Skin at twice the contrast" value={fmt(hawkinsOf({ kOverKs: 2 * kOverKs - 1, rsM }), 6)} />
        <Tile label="Skin at twice the radius" value={fmt(hawkinsOf({ kOverKs, rsM: 2 * rsM }), 6)} />
        <Tile label="Skin at contrast one" value={fmt(hawkinsOf({ kOverKs: 1, rsM }), 6)} />
      </TileGrid>
      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={contrast} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="kOverKs" type="number" domain={['dataMin', 'dataMax']}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'permeability contrast k/ks', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'skin', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 5)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#64748b" />
              <Line type="monotone" dataKey="skin" name="skin against contrast" stroke="#BFFF00" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={radius} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="rsM" type="number" scale="log" domain={['dataMin', 'dataMax']}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'damaged radius (m, log)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'skin', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 5)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="skin" name="skin against radius" stroke="#38bdf8" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">k/ks</th>
                <th className="text-right pr-3">skin</th>
                <th className="text-right">skin per unit of contrast above one</th>
              </tr>
            </thead>
            <tbody>
              {contrast.map((r) => (
                <tr key={r.kOverKs}>
                  <td className="pr-3">{fmt(r.kOverKs, 0)}</td>
                  <td className="text-right pr-3">{fmt(r.skin, 5)}</td>
                  <td className="text-right text-emerald-400">{r.kOverKs === 1 ? '-' : fmt(r.skin / (r.kOverKs - 1), 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">rs (m)</th>
                <th className="text-right pr-3">skin</th>
                <th className="text-right">what doubling rs buys</th>
              </tr>
            </thead>
            <tbody>
              {doubled.map((r) => (
                <tr key={r.rsM}>
                  <td className="pr-3">{fmt(r.rsM, 2)}</td>
                  <td className="text-right pr-3">{fmt(r.skin, 5)}</td>
                  <td className="text-right text-amber-400">{fmt(r.gainFromDoubling, 4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The left column is a straight line and the right one is not. Skin is LINEAR in the
        permeability contrast: the third column of the left table is the same number on every row,
        so doubling the contrast above one exactly doubles the skin. Skin is only LOGARITHMIC in
        the damaged radius, and the last column of the right table shows what that costs. Close to
        the wellbore doubling the radius more than doubles the skin, because the logarithm is still
        steep there. Further out the same doubling buys less and less.
      </div>
      <Note>
        This is where the money is. A treatment cannot change the contrast, only the radius the
        acid reaches, so the shallow part of the damage is worth far more per barrel of acid than
        the deep part. And the whole of the model is one line of algebra on two numbers nobody
        measures directly.
      </Note>
    </>
  );
};

const Sandstone = () => {
  const [ra, setRa] = useState('');
  const raM = ra === '' ? ACID.raM : Number(ra);
  const job = useMemo(() => {
    try { return sandstoneOf({ raM }); } catch { return null; }
  }, [raM]);
  const sw = useMemo(() => acidSweep(), []);
  const published = useMemo(() => sandstoneOf(), []);
  const shaped = useMemo(() => sw.map((r) => ({
    ...r,
    volumeRatio: r.volumeM3 / sw[0].volumeM3,
    radiusRatio: r.raM / sw[0].raM,
  })), [sw]);
  if (!job) {
    return <Note>That acid radius does not describe a treatment. The front has to reach beyond the wellbore wall before there is any volume to pump.</Note>;
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumField label={`Target acid radius ra (m, default ${ACID.raM})`} value={ra} onChange={setRa} placeholder={String(ACID.raM)} />
      </div>
      <TileGrid>
        <Tile label="Planning volume" value={fmt(job.volumeM3, 4)} unit="m3" />
        <Tile label="Skin before" value={fmt(job.sBefore, 6)} />
        <Tile label="Skin after" value={fmt(job.sAfter, 6)} />
        <Tile label="Damage removed" value={job.removed ? 'yes' : 'no'} />
        <Tile label="Published volume" value={fmt(published.volumeM3, 4)} unit="m3" />
        <Tile label="Published residual skin" value={fmt(published.sAfter, 6)} />
        <Tile label="Pore volume factor" value={fmt(PARAMS.pvFactor, 2)} />
        <Tile label="Interval and porosity" value={`${fmt(ACID.hM, 0)} m at ${fmt(ACID.porosity, 3)}`} />
      </TileGrid>
      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sw} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="raM" type="number" domain={['dataMin', 'dataMax']}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'acid radius (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'volume (m3)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 4)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="volumeM3" name="planning volume" stroke="#BFFF00" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sw} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="raM" type="number" domain={['dataMin', 'dataMax']}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'acid radius (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'skin left behind', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 5)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine x={ACID.rsM} stroke="#f472b6"
                label={{ value: 'damage ends here', fill: '#f472b6', fontSize: 10, position: 'top' }} />
              <Line type="monotone" dataKey="sAfter" name="residual skin" stroke="#38bdf8" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">acid radius (m)</th>
              <th className="text-right pr-3">volume (m3)</th>
              <th className="text-right pr-3">radius against the first row</th>
              <th className="text-right pr-3">volume against the first row</th>
              <th className="text-right pr-3">residual skin</th>
              <th className="text-right">removed</th>
            </tr>
          </thead>
          <tbody>
            {shaped.map((r) => (
              <tr key={r.raM}>
                <td className="pr-3">{fmt(r.raM, 2)}</td>
                <td className="text-right pr-3">{fmt(r.volumeM3, 4)}</td>
                <td className="text-right pr-3">{fmt(r.radiusRatio, 4)}</td>
                <td className="text-right pr-3 text-amber-400">{fmt(r.volumeRatio, 4)}</td>
                <td className={`text-right pr-3 ${r.sAfter > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{fmt(r.sAfter, 5)}</td>
                <td className="text-right">{r.removed ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Compare the two ratio columns. Doubling the radius does not double the volume, it roughly
        quadruples it, because the acid has to fill an annulus and an annulus grows with the SQUARE
        of its outer radius. Reaching twice as far costs about four times as much acid.
      </div>
      <Note>
        The published job pumps to {fmt(ACID.raM, 2)} m against damage that runs out to
        {' '}{fmt(ACID.rsM, 2)} m, so the front stops short and a residual skin of
        {' '}{fmt(published.sAfter, 4)} survives the treatment. The skin does not fall to zero
        gradually as the front approaches the damage: it falls to zero the moment the front passes
        it, and not one metre earlier. This is a volumetric planning rule. Stoichiometry, preflush
        chemistry and mineralogy are lab work and are out of the engine.
      </Note>
    </>
  );
};

const Carbonate = () => {
  const [vol, setVol] = useState('');
  const volumeM3 = vol === '' ? ACID.volumeM3 : Number(vol);
  const job = useMemo(() => {
    try { return carbonateOf({ volumeM3 }); } catch { return null; }
  }, [volumeM3]);
  const sw = useMemo(() => carbonateSweep(), []);
  const published = useMemo(() => carbonateOf(), []);
  const stepped = useMemo(() => sw.map((r, i) => ({
    ...r,
    skinBought: i === 0 ? null : sw[i - 1].skin - r.skin,
  })), [sw]);
  if (!job) {
    return <Note>That volume does not describe a wormhole job. The pumped volume has to be positive before there is anything for the acid to dissolve.</Note>;
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumField label={`Pumped volume (m3, default ${ACID.volumeM3})`} value={vol} onChange={setVol} placeholder={String(ACID.volumeM3)} />
      </div>
      <TileGrid>
        <Tile label="Wormhole radius" value={fmt(job.rWhM, 6)} unit="m" />
        <Tile label="Skin" value={fmt(job.skin, 6)} />
        <Tile label="Published radius" value={fmt(published.rWhM, 6)} unit="m" />
        <Tile label="Published skin" value={fmt(published.skin, 6)} />
        <Tile label="Pore volumes to breakthrough" value={fmt(PARAMS.pvBt, 2)} />
        <Tile label="Radius at four times the volume" value={fmt(carbonateOf({ volumeM3: 4 * volumeM3 }).rWhM, 6)} unit="m" />
        <Tile label="Skin at four times the volume" value={fmt(carbonateOf({ volumeM3: 4 * volumeM3 }).skin, 6)} />
        <Tile label="Skin bought by that four times" value={fmt(job.skin - carbonateOf({ volumeM3: 4 * volumeM3 }).skin, 6)} />
      </TileGrid>
      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sw} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="volumeM3" type="number" scale="log" domain={['dataMin', 'dataMax']}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'pumped volume (m3, log)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'wormhole radius (m)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 5)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="rWhM" name="wormhole radius" stroke="#BFFF00" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sw} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="volumeM3" type="number" scale="log" domain={['dataMin', 'dataMax']}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'pumped volume (m3, log)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'skin', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 5)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#64748b" />
              <Line type="monotone" dataKey="skin" name="wormhole skin" stroke="#38bdf8" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">volume (m3)</th>
              <th className="text-right pr-3">wormhole radius (m)</th>
              <th className="text-right pr-3">skin</th>
              <th className="text-right">skin bought by this doubling</th>
            </tr>
          </thead>
          <tbody>
            {stepped.map((r) => (
              <tr key={r.volumeM3}>
                <td className="pr-3">{fmt(r.volumeM3, 0)}</td>
                <td className="text-right pr-3">{fmt(r.rWhM, 6)}</td>
                <td className="text-right pr-3 text-emerald-400">{fmt(r.skin, 5)}</td>
                <td className="text-right text-amber-400">{r.skinBought == null ? '-' : fmt(r.skinBought, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Every row in the table doubles the volume of the row above it, and the last column is the
        skin that doubling bought. Those numbers are all about the same size, which is the
        diminishing return: the first doubling and the last doubling buy the same small decrement,
        but the last one costs sixteen times as much acid. The radius chart says why. Radius grows
        with the SQUARE ROOT of volume, and skin is a logarithm of radius, so two weak functions
        are stacked on top of each other.
      </div>
      <Note>
        A carbonate job does not restore a permeability, it creates a new flow path. The skin is
        negative because the wormholes make the well behave as though it had been drilled larger.
        The pore volumes to breakthrough is a lab number and the single most important input here.
        The engine takes it, it does not predict it.
      </Note>
    </>
  );
};

const Ceiling = () => {
  const [skinIn, setSkinIn] = useState('');
  const sSkin = skinIn === '' ? hawkinsOf() : Number(skinIn);
  const withAcid = useMemo(() => {
    try { return matrixCeilingOf({ sSkin }); } catch { return null; }
  }, [sSkin]);
  const withFracFluid = useMemo(() => {
    try { return matrixCeilingOf({ sSkin, muPaS: PARAMS.muPaS }); } catch { return null; }
  }, [sSkin]);
  const sw = useMemo(() => ceilingSweep(), []);
  const swWrong = useMemo(() => ceilingSweep().map((r) => ({
    sSkin: r.sSkin,
    qAcid: r.qM3s,
    qFracFluid: matrixCeilingOf({ sSkin: r.sSkin, muPaS: PARAMS.muPaS }).qM3s,
  })), []);
  if (!withAcid || !withFracFluid) {
    return <Note>That skin does not leave a ceiling to compute. The natural logarithm of the radius ratio plus the skin has to stay positive, or the well is already taking no fluid at all.</Note>;
  }
  const perMin = (q) => q * 60;
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="Skin (default the damaged well)" value={skinIn} onChange={setSkinIn} placeholder={fmt(hawkinsOf(), 4)} />
      </div>
      <TileGrid>
        <Tile label="Acid viscosity used" value={ACID_MU_PA_S.toExponential(0)} unit="Pa.s" />
        <Tile label="Frac fluid viscosity" value={fmt(PARAMS.muPaS, 3)} unit="Pa.s" />
        <Tile label="Ratio of the two" value={fmt(PARAMS.muPaS / ACID_MU_PA_S, 0)} unit="times" />
        <Tile label="Ceiling with the acid" value={withAcid.qM3s.toExponential(4)} unit="m3/s" />
        <Tile label="Same, per minute" value={fmt(perMin(withAcid.qM3s), 5)} unit="m3/min" />
        <Tile label="Wrong answer, frac fluid" value={withFracFluid.qM3s.toExponential(4)} unit="m3/s" />
        <Tile label="Wrong answer, per minute" value={fmt(perMin(withFracFluid.qM3s), 7)} unit="m3/min" />
        <Tile label="Size of the error" value={fmt(withAcid.qM3s / withFracFluid.qM3s, 0)} unit="times too low" />
        <Tile label="Skin used" value={fmt(sSkin, 6)} />
        <Tile label="Clean well ceiling" value={matrixCeilingOf({ sSkin: 0 }).qM3s.toExponential(4)} unit="m3/s" />
        <Tile label="Frac pressure" value={fmt(PARAMS.closurePa / 1e6, 4)} unit="MPa" />
        <Tile label="Reservoir pressure" value={fmt(PARAMS.pResPa / 1e6, 4)} unit="MPa" />
      </TileGrid>
      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sw} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="sSkin" type="number" domain={['dataMin', 'dataMax']}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'skin', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'ceiling (m3/s)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => Number(x).toExponential(4)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine x={hawkinsOf()} stroke="#f472b6"
                label={{ value: 'the damaged well', fill: '#f472b6', fontSize: 10, position: 'top' }} />
              <Line type="monotone" dataKey="qM3s" name="ceiling with the acid" stroke="#BFFF00" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={swWrong} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="sSkin" tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'skin', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis scale="log" domain={['dataMin', 'dataMax']} tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(x) => Number(x).toExponential(0)}
                label={{ value: 'ceiling (m3/s, log)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => Number(x).toExponential(4)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="qAcid" name="acid viscosity, right" fill="#BFFF00" isAnimationActive={false} />
              <Bar dataKey="qFracFluid" name="frac fluid viscosity, wrong" fill="#f472b6" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">skin</th>
              <th className="text-right pr-3">acid viscosity (m3/s)</th>
              <th className="text-right pr-3">frac fluid viscosity (m3/s)</th>
              <th className="text-right">ratio</th>
            </tr>
          </thead>
          <tbody>
            {swWrong.map((r) => (
              <tr key={r.sSkin}>
                <td className="pr-3">{fmt(r.sSkin, 0)}</td>
                <td className="text-right pr-3 text-emerald-400">{r.qAcid.toExponential(5)}</td>
                <td className="text-right pr-3 text-rose-400">{r.qFracFluid.toExponential(5)}</td>
                <td className="text-right">{fmt(r.qAcid / r.qFracFluid, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The viscosity in this ceiling is the ACID that is being pumped, which is near water at
        {' '}{ACID_MU_PA_S.toExponential(0)} Pa.s, and NOT the crosslinked gel at
        {' '}{fmt(PARAMS.muPaS, 2)} Pa.s that you would pump to make a fracture. On this fixture
        those two differ by a factor of {fmt(PARAMS.muPaS / ACID_MU_PA_S, 0)}, and the last column
        of the table is that factor on every row. Use the frac fluid and a job that is perfectly
        pumpable at {fmt(perMin(withAcid.qM3s), 4)} m3 per minute looks impossible at
        {' '}{fmt(perMin(withFracFluid.qM3s), 6)}.
      </div>
      <Note>
        Skin sits in the DENOMINATOR of the ceiling, so the damaged well you are trying to treat is
        the one that accepts acid most slowly. The ceiling is taken at the damaged skin on purpose,
        because that is the well as it stands before any acid has gone into it. Using the clean
        skin would overstate what the well can take, which is the opposite of a safe default.
      </Note>
    </>
  );
};

const AcidExplorer = () => {
  const [mode, setMode] = useState('damage');
  return (
    <PanelShell
      title="Acid and damage explorer"
      subtitle="What the damage costs, what a sandstone job removes, what a carbonate job creates, and how fast the well will take it"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'damage' && <Damage />}
        {mode === 'sandstone' && <Sandstone />}
        {mode === 'carbonate' && <Carbonate />}
        {mode === 'ceiling' && <Ceiling />}
      </div>
    </PanelShell>
  );
};

export default AcidExplorer;
