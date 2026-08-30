import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  G, PARAMS, PROFILE, stresses, atDepth, orderingViolations, ucsFromDt,
  frictionalLimitRatio, qualityScore, LITHOLOGY_SEEDS,
} from './geomechLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Stress explorer: the 1D mechanical earth model, the frictional bounds that
// clamp it, and the sonic correlations that turn a log into a strength.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const MPa = (v) => fmt(v / 1e6, 5);

const MODES = [
  { value: 'profile', label: 'The stress profile' },
  { value: 'point', label: 'At one depth' },
  { value: 'ucs', label: 'Strength from sonic' },
];

const Profile = () => {
  const [nu, setNu] = useState(String(PARAMS.nu));
  const [phi, setPhi] = useState(String(PARAMS.frictionAngleDeg));
  const [eps, setEps] = useState('1');
  const over = useMemo(() => {
    const n = Number(nu); const f = Number(phi); const k = Number(eps);
    if (!(n > 0 && n < 0.5) || !(f >= 0) || !Number.isFinite(k)) return null;
    return { nu: n, frictionAngleDeg: f, epsX: PARAMS.epsX * k, epsY: PARAMS.epsY * k };
  }, [nu, phi, eps]);
  const s = useMemo(() => { try { return over ? stresses(over) : null; } catch { return null; } }, [over]);
  const rows = useMemo(() => (s ? PROFILE.tvdM.map((t, i) => ({
    tvd: t,
    sv: PROFILE.svPa[i] / (G * t),
    pp: PROFILE.ppPa[i] / (G * t),
    shmin: s.shminPa[i] / (G * t),
    shmax: s.shmaxPa[i] / (G * t),
  })) : []), [s]);
  const viol = useMemo(() => { try { return over ? orderingViolations(over) : []; } catch { return []; } }, [over]);
  const q = useMemo(() => (s ? qualityScore({
    svPa: PROFILE.svPa, shmaxPa: s.shmaxPa, shminPa: s.shminPa, ppPa: PROFILE.ppPa, regime: 'NF',
  }) : null), [s]);
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <NumField label="Poisson ratio" value={nu} onChange={setNu} />
        <NumField label="Friction angle (deg)" value={phi} onChange={setPhi} />
        <NumField label="Tectonic strain multiplier" value={eps} onChange={setEps} />
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="tvd" type="number" domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'true vertical depth (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis domain={[900, 6000]} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'EMW (kg/m3)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 2)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={2300} stroke="#475569" strokeDasharray="4 4" />
            <Line dataKey="sv" name="overburden" stroke="#f8fafc" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line dataKey="shmax" name="SHmax" stroke="#fb7185" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line dataKey="shmin" name="Shmin" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line dataKey="pp" name="pore pressure" stroke="#BFFF00" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {s && q && (
        <TileGrid>
          <Tile label="k0 used" value={fmt(s.k0Used, 8)} />
          <Tile label="Frictional ratio q" value={fmt(frictionalLimitRatio(Number(phi)), 8)} />
          <Tile label="Samples clamped" value={s.clampedCount} unit={`of ${PROFILE.tvdM.length}`} />
          <Tile label="Ordering breaches" value={viol.length} unit={`of ${PROFILE.tvdM.length}`} />
          <Tile label="Quality score" value={q.score} unit="of 100" />
          <Tile label="Deepest breach" value={viol.length ? fmt(viol[viol.length - 1].tvdM, 0) : '-'} unit="m" />
        </TileGrid>
      )}
      <Note>
        Watch the top of the hole. The tectonic strain adds the SAME pressure at every depth, so it
        is a large fraction of a shallow overburden and a small one of a deep overburden. At the
        published settings that pushes SHmax above the overburden over the top 1150 m, which is not
        a normal faulting stress state at all, and the quality score drops to 80 for exactly that.
        Only four of those depths are clamped to the frictional bound: the rest are the strain term
        on its own. Turn the strain multiplier down to zero and the breaches disappear.
      </Note>
    </>
  );
};

const Point = () => {
  const [tvd, setTvd] = useState('2000');
  const a = useMemo(() => { try { return atDepth(Number(tvd)); } catch { return null; } }, [tvd]);
  return (
    <>
      <SelectField label="True vertical depth (m)" value={tvd} onChange={setTvd}
        options={PROFILE.tvdM.map((t) => ({ value: String(t), label: `${t} m` }))} />
      {a && (
        <>
          <TileGrid>
            <Tile label="Overburden" value={MPa(a.svPa)} unit="MPa" />
            <Tile label="SHmax" value={MPa(a.shmaxPa)} unit="MPa" />
            <Tile label="Shmin" value={MPa(a.shminPa)} unit="MPa" />
            <Tile label="Pore pressure" value={MPa(a.ppPa)} unit="MPa" />
            <Tile label="Sonic" value={fmt(a.dtUsPerM, 1)} unit="us/m" />
            <Tile label="UCS" value={MPa(a.ucsPa)} unit="MPa" />
          </TileGrid>
          <TileGrid>
            <Tile label="Overburden EMW" value={fmt(a.svEmw, 2)} unit="kg/m3" />
            <Tile label="SHmax EMW" value={fmt(a.shmaxEmw, 2)} unit="kg/m3" />
            <Tile label="Shmin EMW" value={fmt(a.shminEmw, 2)} unit="kg/m3" />
            <Tile label="Pore pressure EMW" value={fmt(a.ppEmw, 2)} unit="kg/m3" />
          </TileGrid>
          <div className={`mt-3 text-xs ${a.svEmw >= a.shmaxEmw ? 'text-[#BFFF00]' : 'text-amber-400'}`}>
            {a.svEmw >= a.shmaxEmw
              ? 'The overburden is the largest stress here, which is the normal faulting order this run assumes.'
              : 'SHmax exceeds the overburden here, so this depth is not in the normal faulting order the run assumes.'}
          </div>
        </>
      )}
      <Note>
        Six numbers describe the rock at a depth: three stresses, a pore pressure, a sonic reading
        and a strength. Everything the rest of this course computes is a function of those six.
        Read them as equivalent mud weights as well as pressures, because the mud window is quoted
        in mud weight and a gradient is easier to carry in your head than a pressure.
      </Note>
    </>
  );
};

const Ucs = () => {
  const [dt, setDt] = useState('250');
  const out = useMemo(() => {
    const d = Number(dt);
    if (!(d > 0)) return null;
    return {
      h: ucsFromDt({ dtUsPerM: [d] }).ucsPa[0],
      m: ucsFromDt({ dtUsPerM: [d], correlation: 'mcnally' }).ucsPa[0],
    };
  }, [dt]);
  const rows = useMemo(() => {
    const xs = [];
    for (let d = 150; d <= 550; d += 5) {
      xs.push({
        dt: d,
        horsrud: ucsFromDt({ dtUsPerM: [d] }).ucsPa[0] / 1e6,
        mcnally: ucsFromDt({ dtUsPerM: [d], correlation: 'mcnally' }).ucsPa[0] / 1e6,
      });
    }
    return xs;
  }, []);
  return (
    <>
      <NumField label="Sonic slowness (us/m)" value={dt} onChange={setDt} />
      {out && (
        <TileGrid>
          <Tile label="Horsrud (shale)" value={MPa(out.h)} unit="MPa" />
          <Tile label="McNally (sandstone)" value={MPa(out.m)} unit="MPa" />
          <Tile label="Ratio" value={fmt(out.h / out.m, 6)} />
        </TileGrid>
      )}
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="dt" type="number" domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'slowness (us/m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis scale="log" domain={[1, 400]} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'UCS (MPa)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={198.685} stroke="#f59e0b" strokeDasharray="4 4" />
            <ReferenceLine x={409.836} stroke="#f59e0b" strokeDasharray="4 4" />
            <Line dataKey="horsrud" name="Horsrud (shale)" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line dataKey="mcnally" name="McNally (sandstone)" stroke="#fb7185" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        A power law and an exponential, and they meet TWICE. The two marked crossings are at about
        198.7 and about 409.8 microseconds per metre, and both fall inside this profile's sonic
        range. Between them the sandstone correlation reads higher and outside them the shale one
        does, so there is no rule of thumb about which is the conservative choice. Both are
        screening correlations quoted for their own datasets, and neither is a substitute for a
        core test. The lithology seeds below the chart are starting values, not measurements:
        {' '}{LITHOLOGY_SEEDS.map((l) => l.name).join(', ')}.
      </Note>
    </>
  );
};

const StressExplorer = () => {
  const [mode, setMode] = useState('profile');
  return (
    <PanelShell
      title="Stress explorer"
      subtitle="The 1D mechanical earth model, the bounds that clamp it, and strength from a sonic log"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'profile' && <Profile />}
        {mode === 'point' && <Point />}
        {mode === 'ucs' && <Ucs />}
      </div>
    </PanelShell>
  );
};

export default StressExplorer;
