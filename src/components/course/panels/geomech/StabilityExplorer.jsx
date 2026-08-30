import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  PARAMS, PROFILE, atDepth, stability, attitudeSweep, wallStresses,
  farFieldInBoreholeFrame, VERTICAL, verticalCheck, frictionalLimitRatio,
} from './geomechLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Stability explorer: the Kirsch wall stresses around the hole, the two
// criteria that bound the mud weight at one depth, and the closed-form
// vertical case that a person can check on paper.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const MPa = (v) => fmt(v / 1e6, 5);

const MODES = [
  { value: 'point', label: 'At one depth' },
  { value: 'wall', label: 'Around the wall' },
  { value: 'attitude', label: 'Against hole attitude' },
  { value: 'closed', label: 'The closed form' },
];
const DEPTHS = PROFILE.tvdM.filter((t) => t >= 1000).map((t) => ({ value: String(t), label: `${t} m` }));

const Point = () => {
  const [tvd, setTvd] = useState('2500');
  const [inc, setInc] = useState('0');
  const [azi, setAzi] = useState('0');
  const s = useMemo(() => {
    try { return stability(Number(tvd), { incDeg: Number(inc), aziDeg: Number(azi) }); } catch { return null; }
  }, [tvd, inc, azi]);
  const a = useMemo(() => { try { return atDepth(Number(tvd)); } catch { return null; } }, [tvd]);
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <SelectField label="TVD" value={tvd} onChange={setTvd} options={DEPTHS} />
        <NumField label="Inclination (deg)" value={inc} onChange={setInc} />
        <NumField label="Azimuth (deg)" value={azi} onChange={setAzi} />
      </div>
      {s && a && (
        <>
          <TileGrid>
            <Tile label="Collapse pressure" value={MPa(s.collapsePa)} unit="MPa" />
            <Tile label="Fracture initiation" value={MPa(s.fracInitPa)} unit="MPa" />
            <Tile label="Breakout angle" value={s.breakoutThetaDeg} unit="deg from high side" />
            <Tile label="Collapse EMW" value={fmt(s.collapseEmw, 4)} unit="kg/m3" />
            <Tile label="Fracture EMW" value={fmt(s.fracInitEmw, 4)} unit="kg/m3" />
            <Tile label="Window width" value={fmt(s.widthEmw, 4)} unit="kg/m3" />
          </TileGrid>
          <div className={`mt-3 text-xs ${s.ppEmw > s.collapseEmw ? 'text-[#BFFF00]' : 'text-amber-400'}`}>
            {s.ppEmw > s.collapseEmw
              ? `The pore pressure at ${fmt(s.ppEmw, 1)} kg/m3 is above the collapse pressure, so it is the pore pressure that sets the lower bound here.`
              : `The collapse pressure is above the pore pressure of ${fmt(s.ppEmw, 1)} kg/m3, so wellbore stability sets the lower bound here.`}
          </div>
        </>
      )}
      <Note>
        Two criteria and two bounds. Below the collapse pressure the rock around the hole fails in
        shear and a breakout forms; above the fracture initiation pressure the hoop stress goes into
        tension and the wall splits. The mud has to sit between them, and above the pore pressure as
        well. The reported lower bound is the LARGER of the collapse pressure and the pore pressure,
        which is not always the same one.
      </Note>
    </>
  );
};

const Wall = () => {
  const [tvd, setTvd] = useState('2500');
  const [inc, setInc] = useState('60');
  const [azi, setAzi] = useState('60');
  const [pw, setPw] = useState('40');
  const rows = useMemo(() => {
    try {
      const a = atDepth(Number(tvd));
      const sig = farFieldInBoreholeFrame({
        svPa: a.svPa, shmaxPa: a.shmaxPa, shminPa: a.shminPa, ppPa: a.ppPa,
        alphaBiot: PARAMS.alphaBiot, shmaxAzimuthDeg: PARAMS.shmaxAzimuthDeg,
        incDeg: Number(inc), aziDeg: Number(azi),
      });
      const dP = Number(pw) * 1e6 - a.ppPa;
      const out = [];
      for (let t = 0; t <= 360; t += 2) {
        const w = wallStresses(sig, PARAMS.nu, t, dP);
        out.push({ theta: t, tmax: w.tmax / 1e6, tmin: w.tmin / 1e6, srr: w.srr / 1e6 });
      }
      return out;
    } catch { return []; }
  }, [tvd, inc, azi, pw]);
  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <SelectField label="TVD" value={tvd} onChange={setTvd} options={DEPTHS} />
        <NumField label="Inclination (deg)" value={inc} onChange={setInc} />
        <NumField label="Azimuth (deg)" value={azi} onChange={setAzi} />
        <NumField label="Well pressure (MPa)" value={pw} onChange={setPw} />
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="theta" type="number" domain={[0, 360]} ticks={[0, 90, 180, 270, 360]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'angle from the high side (deg)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'effective stress (MPa)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" />
            <Line dataKey="tmax" name="largest wall stress" stroke="#fb7185" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line dataKey="tmin" name="smallest wall stress" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line dataKey="srr" name="radial (the mud)" stroke="#BFFF00" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The wall is not uniformly loaded. Walk once round the hole and the largest wall stress peaks
        somewhere and dips a quarter turn away, and the breakout forms wherever the peak is. Raise
        the well pressure and the whole hoop curve drops while the flat radial line rises: that is
        why a heavier mud stabilises a hole against shear and eventually splits it in tension. On a
        deviated well the shear term tilts the pattern and moves the peak away from the position a
        vertical-well picture would predict.
      </Note>
    </>
  );
};

const Attitude = () => {
  const [tvd, setTvd] = useState('2500');
  const rows = useMemo(() => {
    try {
      return attitudeSweep(Number(tvd), { incs: [0, 15, 30, 45, 60, 75, 90], azis: [0, 60, 150] });
    } catch { return []; }
  }, [tvd]);
  const byInc = useMemo(() => {
    const m = new Map();
    for (const r of rows) {
      if (!m.has(r.incDeg)) m.set(r.incDeg, { inc: r.incDeg });
      m.get(r.incDeg)[`a${r.aziDeg}`] = r.widthEmw;
    }
    return [...m.values()];
  }, [rows]);
  return (
    <>
      <SelectField label="TVD" value={tvd} onChange={setTvd} options={DEPTHS} />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={byInc} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="inc" type="number" domain={[0, 90]} ticks={[0, 30, 60, 90]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'inclination (deg)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'window width (kg/m3)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="a60" name="toward SHmax (060)" stroke="#fb7185" strokeWidth={2} isAnimationActive={false} />
            <Line dataKey="a0" name="toward north (000)" stroke="#f8fafc" strokeWidth={2} isAnimationActive={false} />
            <Line dataKey="a150" name="toward Shmin (150)" stroke="#38bdf8" strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Vertical is the widest window at this depth and every deviation costs some of it, but the
        cost depends enormously on which way you go. Drilling along the maximum horizontal stress
        loses the most; drilling along the minimum horizontal stress loses the least. A vertical
        hole gives the same window at every azimuth because there is no azimuth to it, though the
        breakout still rotates to face the minimum stress. That single chart is the reason a
        geomechanics study is done before a trajectory is chosen rather than after.
      </Note>
    </>
  );
};

const Closed = () => {
  const v = useMemo(() => verticalCheck(), []);
  const i = VERTICAL.inputs;
  return (
    <>
      <TileGrid>
        <Tile label="Overburden" value={MPa(i.svPa)} unit="MPa" />
        <Tile label="SHmax" value={MPa(i.shmaxPa)} unit="MPa" />
        <Tile label="Shmin" value={MPa(i.shminPa)} unit="MPa" />
        <Tile label="Pore pressure" value={MPa(i.ppPa)} unit="MPa" />
        <Tile label="UCS" value={MPa(i.ucsPa)} unit="MPa" />
        <Tile label="Frictional ratio q" value={fmt(frictionalLimitRatio(i.frictionAngleDeg), 6)} />
      </TileGrid>
      <TileGrid>
        <Tile label="Engine collapse" value={MPa(v.engine.collapsePa)} unit="MPa" />
        <Tile label="Closed form" value={MPa(v.closedCollapsePa)} unit="MPa" />
        <Tile label="Difference" value={fmt(v.collapseErrPa, 9)} unit="Pa" />
        <Tile label="Engine fracture" value={MPa(v.engine.fracInitPa)} unit="MPa" />
        <Tile label="Closed form" value={MPa(v.closedFracPa)} unit="MPa" />
        <Tile label="Difference" value={fmt(v.fracErrPa, 9)} unit="Pa" />
      </TileGrid>
      <Note>
        A vertical well in this stress field is the one case in the course you can settle on paper.
        The hoop stress runs between three times the smaller horizontal stress less the larger, and
        three times the larger less the smaller, both in effective terms. Raising the well pressure
        by one unit lowers the largest wall stress by one and raises the smallest by one, so the
        Mohr-Coulomb gap closes at one plus q per unit. That gives collapse in one line and fracture
        initiation in another, and the engine reproduces both exactly rather than nearly.
      </Note>
    </>
  );
};

const StabilityExplorer = () => {
  const [mode, setMode] = useState('point');
  return (
    <PanelShell
      title="Stability explorer"
      subtitle="Kirsch wall stresses, the two criteria, and what the hole attitude costs"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'point' && <Point />}
        {mode === 'wall' && <Wall />}
        {mode === 'attitude' && <Attitude />}
        {mode === 'closed' && <Closed />}
      </div>
    </PanelShell>
  );
};

export default StabilityExplorer;
