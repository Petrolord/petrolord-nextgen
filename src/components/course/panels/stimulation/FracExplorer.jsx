import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  PARAMS, E_PRIME_PA, FRAC_MODELS, geometryOf, publishedPkn, publishedKgd, modelSweep,
  ratePower, balanceOf, scheduleOf, leakoffSweep, noltekLSweep,
} from './stimulationLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Frac explorer, the Professional tier. The two width models side by side,
// what they disagree about, what the pump rate is worth, and the material
// balance that decides how long the job runs.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const mm = (v) => fmt(v * 1000, 4);
const mpa = (v) => fmt(v / 1e6, 5);

const MODES = [
  ['geometry', 'Both models at one design'],
  ['models', 'What the two models disagree about'],
  ['rate', 'The quarter power on rate'],
  ['balance', 'Material balance and the schedule'],
];

const MODEL_OPTIONS = [['pkn', 'PKN'], ['kgd', 'KGD']];

const Geometry = () => {
  const [xf, setXf] = useState('');
  const [hf, setHf] = useState('');
  const [qi, setQi] = useState('');
  const xfM = xf === '' ? PARAMS.xfM : Number(xf);
  const hfM = hf === '' ? PARAMS.hfM : Number(hf);
  const qiM3s = qi === '' ? PARAMS.qiM3s : Number(qi);
  const both = useMemo(() => {
    try {
      return {
        pkn: geometryOf('pkn', { xfM, hfM, qiM3s }),
        kgd: geometryOf('kgd', { xfM, hfM, qiM3s }),
      };
    } catch { return null; }
  }, [xfM, hfM, qiM3s]);
  const pub = useMemo(() => ({ pkn: publishedPkn(), kgd: publishedKgd() }), []);
  if (!both) {
    return <Note>Those numbers do not describe a fracture. The rate, the half-length and the height all have to be positive before either model returns a width.</Note>;
  }
  const bars = [
    { name: 'max width (mm)', pkn: both.pkn.wMaxM * 1000, kgd: both.kgd.wMaxM * 1000 },
    { name: 'average width (mm)', pkn: both.pkn.wAvgM * 1000, kgd: both.kgd.wAvgM * 1000 },
    { name: 'net pressure (MPa)', pkn: both.pkn.pNetPa / 1e6, kgd: both.kgd.pNetPa / 1e6 },
  ];
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <NumField label={`Half-length xf (m, default ${PARAMS.xfM})`} value={xf} onChange={setXf} placeholder={String(PARAMS.xfM)} />
        <NumField label={`Height hf (m, default ${PARAMS.hfM})`} value={hf} onChange={setHf} placeholder={String(PARAMS.hfM)} />
        <NumField label={`Injection rate (m3/s, default ${PARAMS.qiM3s})`} value={qi} onChange={setQi} placeholder={String(PARAMS.qiM3s)} />
      </div>
      <TileGrid>
        <Tile label="PKN max width" value={mm(both.pkn.wMaxM)} unit="mm" />
        <Tile label="PKN average width" value={mm(both.pkn.wAvgM)} unit="mm" />
        <Tile label="PKN net pressure" value={mpa(both.pkn.pNetPa)} unit="MPa" />
        <Tile label="PKN treating pressure" value={mpa(both.pkn.bhtpPa)} unit="MPa" />
        <Tile label="KGD max width" value={mm(both.kgd.wMaxM)} unit="mm" />
        <Tile label="KGD average width" value={mm(both.kgd.wAvgM)} unit="mm" />
        <Tile label="KGD net pressure" value={mpa(both.kgd.pNetPa)} unit="MPa" />
        <Tile label="KGD treating pressure" value={mpa(both.kgd.bhtpPa)} unit="MPa" />
        <Tile label="KGD average over PKN" value={fmt(both.kgd.wAvgM / both.pkn.wAvgM, 5)} unit="times" />
        <Tile label="Closure pressure" value={mpa(PARAMS.closurePa)} unit="MPa" />
        <Tile label="Plane strain modulus" value={fmt(E_PRIME_PA / 1e9, 5)} unit="GPa" />
        <Tile label="Published KGD over PKN" value={fmt(pub.kgd.wAvgM / pub.pkn.wAvgM, 5)} unit="times" />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 5)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="pkn" name="PKN" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="kgd" name="KGD" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Same rock, same fluid, same rate, same target. The two models return widths that differ by
        a factor of {fmt(both.kgd.wAvgM / both.pkn.wAvgM, 3)} and net pressures that differ by
        more. The bottomhole treating pressure is the closure pressure plus the net pressure, and
        it is the only quantity on this list you can actually measure at surface.
      </div>
      <Note>
        Neither model is a truth. PKN assumes the fracture is much longer than it is tall and lets
        each vertical section behave independently, so it is the one to use when the height is
        contained. KGD assumes the opposite, that the fracture is much taller than it is long, so
        it belongs to the very start of the job and to short fractures. The choice is made from the
        height compared with the length, not from which answer you prefer.
      </Note>
    </>
  );
};

const Models = () => {
  const sw = useMemo(() => modelSweep(), []);
  const first = sw[0];
  const last = sw[sw.length - 1];
  const data = sw.map((r) => ({
    xfM: r.xfM,
    pknWAvgMm: r.pknWAvgM * 1000,
    kgdWAvgMm: r.kgdWAvgM * 1000,
    pknPNetMPa: r.pknPNetPa / 1e6,
    kgdPNetMPa: r.kgdPNetPa / 1e6,
    ratio: r.widthRatioKgdOverPkn,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Rows" value={sw.length} />
        <Tile label="Shortest half-length" value={fmt(first.xfM, 0)} unit="m" />
        <Tile label="Longest half-length" value={fmt(last.xfM, 0)} unit="m" />
        <Tile label="KGD over PKN, shortest" value={fmt(first.widthRatioKgdOverPkn, 5)} unit="times" />
        <Tile label="KGD over PKN, longest" value={fmt(last.widthRatioKgdOverPkn, 5)} unit="times" />
        <Tile label="PKN net pressure, shortest" value={mpa(first.pknPNetPa)} unit="MPa" />
        <Tile label="PKN net pressure, longest" value={mpa(last.pknPNetPa)} unit="MPa" />
        <Tile label="PKN net pressure moves" value={last.pknPNetPa > first.pknPNetPa ? 'UP with length' : 'DOWN with length'} />
        <Tile label="KGD net pressure, shortest" value={mpa(first.kgdPNetPa)} unit="MPa" />
        <Tile label="KGD net pressure, longest" value={mpa(last.kgdPNetPa)} unit="MPa" />
        <Tile label="KGD net pressure moves" value={last.kgdPNetPa > first.kgdPNetPa ? 'UP with length' : 'DOWN with length'} />
        <Tile label="They move" value={(last.pknPNetPa - first.pknPNetPa) * (last.kgdPNetPa - first.kgdPNetPa) < 0 ? 'in OPPOSITE directions' : 'the same way'} />
      </TileGrid>
      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="xfM" type="number" domain={['dataMin', 'dataMax']}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'half-length (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'average width (mm)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 5)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="kgdWAvgMm" name="KGD width" stroke="#BFFF00" dot isAnimationActive={false} />
              <Line type="monotone" dataKey="pknWAvgMm" name="PKN width" stroke="#38bdf8" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="xfM" type="number" domain={['dataMin', 'dataMax']}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'half-length (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'net pressure (MPa)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 5)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="pknPNetMPa" name="PKN net pressure, RISES" stroke="#38bdf8" dot isAnimationActive={false} />
              <Line type="monotone" dataKey="kgdPNetMPa" name="KGD net pressure, FALLS" stroke="#f472b6" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="xfM" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'half-length (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 'dataMax']}
              label={{ value: 'KGD width over PKN width', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 5)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#64748b" />
            <Bar dataKey="ratio" name="KGD is this many times wider" fill="#a78bfa" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">xf (m)</th>
              <th className="text-right pr-3">PKN width (mm)</th>
              <th className="text-right pr-3">KGD width (mm)</th>
              <th className="text-right pr-3">KGD over PKN</th>
              <th className="text-right pr-3">PKN net (MPa)</th>
              <th className="text-right pr-3">KGD net (MPa)</th>
              <th className="text-right pr-3">PKN treating (MPa)</th>
              <th className="text-right">KGD treating (MPa)</th>
            </tr>
          </thead>
          <tbody>
            {sw.map((r) => (
              <tr key={r.xfM}>
                <td className="pr-3">{fmt(r.xfM, 0)}</td>
                <td className="text-right pr-3">{mm(r.pknWAvgM)}</td>
                <td className="text-right pr-3">{mm(r.kgdWAvgM)}</td>
                <td className="text-right pr-3 text-violet-400">{fmt(r.widthRatioKgdOverPkn, 4)}</td>
                <td className="text-right pr-3 text-sky-400">{mpa(r.pknPNetPa)}</td>
                <td className="text-right pr-3 text-pink-400">{mpa(r.kgdPNetPa)}</td>
                <td className="text-right pr-3">{mpa(r.pknBhtpPa)}</td>
                <td className="text-right">{mpa(r.kgdBhtpPa)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Two findings, both visible above. KGD is about {fmt(last.widthRatioKgdOverPkn, 2)} times
        wider than PKN at the same conditions, and the ratio bar chart shows it barely moving down
        the sweep. And the two net pressures move in OPPOSITE directions: read the sky blue line
        going up and the pink line coming down. PKN net pressure RISES from
        {' '}{mpa(first.pknPNetPa)} to {mpa(last.pknPNetPa)} MPa as the fracture lengthens, while
        KGD net pressure FALLS from {mpa(first.kgdPNetPa)} to {mpa(last.kgdPNetPa)}.
      </div>
      <Note>
        That is a disagreement about the DIRECTION the job moves in, not about a number. On a
        falling pressure record a PKN reading says the fracture is not extending and a KGD reading
        says it is, from the same chart. Which model you picked before the job started therefore
        decides what you conclude during it, which is why the model choice is a decision and not a
        preference.
      </Note>
    </>
  );
};

const Rate = () => {
  const [model, setModel] = useState('pkn');
  const sw = useMemo(() => {
    try { return ratePower(model); } catch { return null; }
  }, [model]);
  if (!sw || !sw.length) {
    return <Note>That model is not one the engine carries. It knows {FRAC_MODELS.join(' and ')}.</Note>;
  }
  const at16 = sw.find((r) => r.rateFactor === 16);
  const at2 = sw.find((r) => r.rateFactor === 2);
  const data = sw.map((r) => ({ ...r, wAvgMm: r.wAvgM * 1000 }));
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Model" value={model} onChange={setModel} options={MODEL_OPTIONS} />
      </div>
      <TileGrid>
        <Tile label="Base rate" value={fmt(PARAMS.qiM3s, 4)} unit="m3/s" />
        <Tile label="Base average width" value={mm(sw[0].wAvgM)} unit="mm" />
        <Tile label="Twice the rate buys" value={fmt(at2.widthFactor, 6)} unit="times the width" />
        <Tile label="Sixteen times the rate buys" value={fmt(at16.widthFactor, 6)} unit="times the width" />
        <Tile label="Width at sixteen times" value={mm(at16.wAvgM)} unit="mm" />
        <Tile label="The exponent" value={fmt(Math.log(at16.widthFactor) / Math.log(16), 6)} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="rateFactor" type="number" scale="log" domain={['dataMin', 'dataMax']}
              ticks={[1, 2, 4, 8, 16]} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'rate as a multiple of the base (log)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'width as a multiple', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={2} stroke="#f472b6"
              label={{ value: 'twice the width', fill: '#f472b6', fontSize: 10, position: 'insideTopLeft' }} />
            <ReferenceLine x={16} stroke="#f472b6" />
            <Line type="monotone" dataKey="widthFactor" name="width multiple" stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">rate multiple</th>
              <th className="text-right pr-3">rate (m3/s)</th>
              <th className="text-right pr-3">average width (mm)</th>
              <th className="text-right">width multiple</th>
            </tr>
          </thead>
          <tbody>
            {sw.map((r) => (
              <tr key={r.rateFactor}>
                <td className="pr-3">{fmt(r.rateFactor, 0)}</td>
                <td className="text-right pr-3">{fmt(PARAMS.qiM3s * r.rateFactor, 5)}</td>
                <td className="text-right pr-3">{mm(r.wAvgM)}</td>
                <td className={`text-right ${r.rateFactor === 16 ? 'text-[#BFFF00]' : ''}`}>{fmt(r.widthFactor, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Width goes as the QUARTER power of rate, and the last row is the whole argument: sixteen
        times the rate buys {fmt(at16.widthFactor, 4)} times the width. Two times the rate buys
        only {fmt(at2.widthFactor, 4)}. The measured exponent in the tile above is
        {' '}{fmt(Math.log(at16.widthFactor) / Math.log(16), 4)}, which is a quarter.
      </div>
      <Note>
        Rate is the most expensive knob on the location and the weakest one in the width equation.
        It is still worth turning, because rate also shortens the job and a shorter job loses less
        fluid, but nobody buys width with horsepower. Viscosity and modulus enter at the same
        quarter power, so the same argument applies to them.
      </Note>
    </>
  );
};

const Balance = () => {
  const [cl, setCl] = useState('');
  const clMSqrtS = cl === '' ? PARAMS.clMSqrtS : Number(cl);
  const bal = useMemo(() => {
    try { return balanceOf({ clMSqrtS }); } catch { return null; }
  }, [clMSqrtS]);
  const sch = useMemo(() => {
    try { return scheduleOf(balanceOf({ clMSqrtS })); } catch { return null; }
  }, [clMSqrtS]);
  const sw = useMemo(() => leakoffSweep(), []);
  const kl = useMemo(() => noltekLSweep(), []);
  if (!bal || !sch) {
    return <Note>That leakoff coefficient does not close a material balance. It has to be zero or positive, and at zero the job loses nothing and the efficiency is one.</Note>;
  }
  const volumes = [
    { name: 'pumped', v: bal.viM3 },
    { name: 'in the fracture', v: bal.vfM3 },
    { name: 'lost to the rock', v: bal.vlM3 },
  ];
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumField label={`Leakoff coefficient (m per root second, default ${PARAMS.clMSqrtS})`} value={cl} onChange={setCl} placeholder={String(PARAMS.clMSqrtS)} />
      </div>
      <TileGrid>
        <Tile label="Fluid efficiency" value={fmt(bal.etaFrac, 6)} />
        <Tile label="Efficiency as a percentage" value={fmt(100 * bal.etaFrac, 3)} unit="pct" />
        <Tile label="Pump time" value={fmt(bal.tiS, 3)} unit="s" />
        <Tile label="Pump time" value={fmt(bal.tiS / 60, 4)} unit="min" />
        <Tile label="Volume pumped" value={fmt(bal.viM3, 4)} unit="m3" />
        <Tile label="Volume in the fracture" value={fmt(bal.vfM3, 4)} unit="m3" />
        <Tile label="Volume lost to the rock" value={fmt(bal.vlM3, 4)} unit="m3" />
        <Tile label="Fixed point iterations" value={bal.iterations} />
        <Tile label="Pad fraction" value={fmt(sch.padFrac, 6)} />
        <Tile label="Pad volume" value={fmt(sch.padM3, 4)} unit="m3" />
        <Tile label="Pad time" value={fmt(sch.tPadS / 60, 4)} unit="min" />
        <Tile label="Proppant mass" value={fmt(sch.massKg, 2)} unit="kg" />
      </TileGrid>
      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumes} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'volume (m3)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 4)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="v" name="volume" fill="#38bdf8" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={kl} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="eta" type="number" domain={[0, 1]}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'efficiency', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[1.3, 1.6]}
                label={{ value: 'Nolte factor', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                formatter={(x) => fmt(x, 6)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine x={bal.etaFrac} stroke="#f472b6"
                label={{ value: 'this job', fill: '#f472b6', fontSize: 10, position: 'top' }} />
              <Line type="monotone" dataKey="kL" name="Nolte factor" stroke="#BFFF00" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">leakoff</th>
              <th className="text-right pr-3">efficiency</th>
              <th className="text-right pr-3">pump time (min)</th>
              <th className="text-right pr-3">pumped (m3)</th>
              <th className="text-right pr-3">in the fracture (m3)</th>
              <th className="text-right pr-3">lost (m3)</th>
              <th className="text-right">pad fraction</th>
            </tr>
          </thead>
          <tbody>
            {sw.map((r) => (
              <tr key={r.clMSqrtS}>
                <td className="pr-3">{r.clMSqrtS === 0 ? 'none' : r.clMSqrtS.toExponential(1)}</td>
                <td className="text-right pr-3">{fmt(r.etaFrac, 5)}</td>
                <td className="text-right pr-3">{fmt(r.tiS / 60, 3)}</td>
                <td className="text-right pr-3">{fmt(r.viM3, 3)}</td>
                <td className="text-right pr-3">{fmt(r.vfM3, 3)}</td>
                <td className="text-right pr-3 text-rose-400">{fmt(r.vlM3, 3)}</td>
                <td className="text-right">{fmt(r.padFrac, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        At the published leakoff the job pumps {fmt(bal.viM3, 2)} cubic metres to leave
        {' '}{fmt(bal.vfM3, 2)} in the fracture, so {fmt(bal.vlM3, 2)} goes into the rock and the
        efficiency is {fmt(100 * bal.etaFrac, 1)} percent. Most of what you pump is not there when
        you stop.
      </div>
      <Note>
        This balance is a FIXED POINT rather than a formula. The Nolte factor depends on the
        efficiency, the efficiency depends on the pump time and the pump time depends on the
        factor, so the engine iterates until they agree, and it reports how many passes it took.
        With no leakoff at all the loop is unnecessary and the iteration count is zero, which is
        the one case that is closed form. Spurt loss is neglected and the engine says so.
      </Note>
    </>
  );
};

const FracExplorer = () => {
  const [mode, setMode] = useState('geometry');
  return (
    <PanelShell
      title="Fracture geometry explorer"
      subtitle="Two width models, what they disagree about, the quarter power on rate, and the material balance behind the schedule"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'geometry' && <Geometry />}
        {mode === 'models' && <Models />}
        {mode === 'rate' && <Rate />}
        {mode === 'balance' && <Balance />}
      </div>
    </PanelShell>
  );
};

export default FracExplorer;
