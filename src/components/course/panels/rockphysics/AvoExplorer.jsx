import React, { useMemo, useState } from 'react';
import {
  TEACHING_FREQ_HZ, CLASS_THRESHOLDS, ANGLE_MAX_DEG, computeAvoDetail, ekeneInterface,
} from '@/lib/rockphysicsTeaching';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// AVO explorer: both fluid cases screened under the Ekene shale across
// angle, with the Shuey approximation drawn against the exact Zoeppritz
// solution so the gap is visible rather than asserted, plus the class call
// and the threshold that decides it.
const W = 560;
const H = 320;
const PAD = { left: 58, top: 18, right: 18, bottom: 42 };

const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : '-');
const COLOR = { brine: '#38bdf8', gas: '#fbbf24' };

// The panel opens on the Ekene teaching interface, with the gas twin carried
// from the substitution at full precision. "Type an interface" swaps in
// typed rocks for all three layers (it starts from the Ekene values, the
// twin to 0.1), so a case of your own is worked by typing it in; nothing
// here preloads one.
const r1 = (v) => String(Math.round(v * 10) / 10);
const EK = ekeneInterface();
const TYPED_DEFAULTS = {
  shVp: r1(EK.shale.vp), shVs: r1(EK.shale.vs), shRho: r1(EK.shale.rho),
  brVp: r1(EK.brineSand.vp), brVs: r1(EK.brineSand.vs), brRho: r1(EK.brineSand.rho),
  gsVp: r1(EK.gasSand.vp), gsVs: r1(EK.gasSand.vs), gsRho: r1(EK.gasSand.rho),
};
const LAYERS = [
  ['sh', 'Shale (upper)'],
  ['br', 'Brine sand (lower)'],
  ['gs', 'Gas sand (lower)'],
];

const AvoExplorer = () => {
  const [freq, setFreq] = useState(String(TEACHING_FREQ_HZ));
  const [threshold, setThreshold] = useState('0.02');
  const [mode, setMode] = useState('ekene');
  const [typed, setTyped] = useState(TYPED_DEFAULTS);
  const set = (k) => (v) => setTyped((o) => ({ ...o, [k]: v }));

  const d = useMemo(() => {
    try {
      const f = Number(freq);
      if (!(f > 0)) return null;
      let iface = null;
      if (mode === 'typed') {
        const t = Object.fromEntries(Object.entries(typed).map(([k, v]) => [k, Number(v)]));
        if (!Object.values(t).every((v) => Number.isFinite(v) && v > 0)) return null;
        iface = {
          shale: { vp: t.shVp, vs: t.shVs, rho: t.shRho },
          brineSand: { vp: t.brVp, vs: t.brVs, rho: t.brRho },
          gasSand: { vp: t.gsVp, vs: t.gsVs, rho: t.gsRho },
        };
      }
      const out = computeAvoDetail(f, Number(threshold), iface);
      return [out.brine.a, out.gas.a, out.gas.zoep30, out.tuning.tuningMs].every(Number.isFinite) ? out : null;
    } catch {
      return null;
    }
  }, [freq, threshold, mode, typed]);

  const controls = (
    <div className="space-y-2">
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <SelectField label="Interface" value={mode} onChange={setMode}
          options={[['ekene', 'Ekene shale over sand'], ['typed', 'Type an interface']]} />
        <NumField label="Wavelet frequency (Hz)" value={freq} onChange={setFreq} />
        <SelectField label="Class II band on |A|" value={threshold} onChange={setThreshold}
          options={CLASS_THRESHOLDS.map((v) => [String(v), v.toFixed(2)])} />
        <div className="text-xs text-gray-500">
          The class II band is a documented convention. Widen it and watch which case changes name.
        </div>
      </div>
      {mode === 'typed' && LAYERS.map(([p, name]) => (
        <div key={p} className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
          <div className="text-xs text-gray-400">{name}</div>
          <NumField label="vp (m/s)" value={typed[`${p}Vp`]} onChange={set(`${p}Vp`)} />
          <NumField label="vs (m/s)" value={typed[`${p}Vs`]} onChange={set(`${p}Vs`)} />
          <NumField label="Density (kg/m3)" value={typed[`${p}Rho`]} onChange={set(`${p}Rho`)} />
        </div>
      ))}
    </div>
  );

  if (!d) {
    return (
      <PanelShell title="AVO explorer" subtitle="Choose an interface, a wavelet frequency and a class threshold.">
        {controls}
        <Note>That combination could not be screened: every velocity, density and the frequency must be a positive number.</Note>
      </PanelShell>
    );
  }

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const all = [...d.brine.curve, ...d.gas.curve].flatMap((p) => [p.shuey, p.exact]);
  const rMin = Math.min(...all, 0);
  const rMax = Math.max(...all, 0);
  const sx = (t) => PAD.left + (t / ANGLE_MAX_DEG) * plotW;
  const sy = (r) => PAD.top + (1 - (r - rMin) / Math.max(1e-9, rMax - rMin)) * plotH;
  const line = (curve, key) => curve.map((p, i) => `${i ? 'L' : 'M'}${sx(p.theta).toFixed(1)},${sy(p[key]).toFixed(1)}`).join(' ');

  return (
    <PanelShell title="AVO explorer"
      subtitle="A shale over a sand, screened for the brine case and its gas-substituted twin; it opens on the Ekene shale and sand. Solid lines are the exact Zoeppritz solution and dashed lines are the Shuey approximation, so the gap between them is a reading rather than a claim.">
      {controls}

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 420 }} role="img"
          aria-label="Reflection coefficient against incidence angle for the brine and gas cases">
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          <line x1={PAD.left} y1={sy(0)} x2={W - PAD.right} y2={sy(0)} stroke="#475569" strokeDasharray="3 3" />
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#334155" />
          {['brine', 'gas'].map((k) => (
            <g key={k}>
              <path d={line(d[k].curve, 'exact')} fill="none" stroke={COLOR[k]} strokeWidth="2" />
              <path d={line(d[k].curve, 'shuey')} fill="none" stroke={COLOR[k]} strokeWidth="1.5"
                strokeDasharray="5 3" opacity="0.85" />
              <text x={W - PAD.right - 84} y={sy(d[k].curve[ANGLE_MAX_DEG].exact) + 4}
                fill={COLOR[k]} fontSize="10">
                {k} class {d[k].klass}
              </text>
            </g>
          ))}
          {d.brine.crossingDeg !== null && (
            <line x1={sx(d.brine.crossingDeg)} y1={PAD.top} x2={sx(d.brine.crossingDeg)} y2={H - PAD.bottom}
              stroke="#f87171" strokeWidth="1" strokeDasharray="4 4" />
          )}
          <text x={PAD.left} y={H - 14} fill="#64748b" fontSize="9">0 deg</text>
          <text x={W - PAD.right - 40} y={H - 14} fill="#64748b" fontSize="9">{ANGLE_MAX_DEG} deg</text>
          <text x={6} y={PAD.top + 10} fill="#64748b" fontSize="9">{fmt(rMax, 3)}</text>
          <text x={6} y={H - PAD.bottom} fill="#64748b" fontSize="9">{fmt(rMin, 3)}</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Brine intercept A" value={fmt(d.brine.a, 6)} />
        <Tile label="Brine gradient B" value={fmt(d.brine.b, 6)} />
        <Tile label="Brine class" value={d.brine.klass} unit={`(${d.brine.klassNum})`} />
        <Tile label="Brine polarity flip" value={d.brine.crossingDeg === null ? 'none' : `${d.brine.crossingDeg} deg`} />
        <Tile label="Gas intercept A" value={fmt(d.gas.a, 6)} />
        <Tile label="Gas gradient B" value={fmt(d.gas.b, 6)} />
        <Tile label="Gas class" value={d.gas.klass} unit={`(${d.gas.klassNum})`} />
        <Tile label="Exact Zoeppritz at 30 deg, gas" value={fmt(d.gas.zoep30, 6)} />
        <Tile label="Shuey at 30 deg, gas" value={fmt(d.gas.shuey30, 6)} />
        <Tile label="Largest Shuey error, gas" value={fmt(d.gas.maxErr, 6)} />
        <Tile label="Largest Shuey error, brine" value={fmt(d.brine.maxErr, 6)} />
        <Tile label={`Wedge tuning at ${d.tuning.freqHz} Hz`} value={String(d.tuning.tuningMs)} unit="ms" />
      </TileGrid>

      <Note>
        The two cases differ only in what fills the pores of the lower halfspace, and they are two
        different pictures. The brine reflection starts positive and changes polarity partway out
        the gather; the gas reflection starts negative and only gets stronger. Notice that the gas
        sand is still FASTER than the shale: the intercept goes negative on the density contrast
        rather than the velocity contrast. Notice too where the dashed and solid lines part company,
        and that they part faster on the brine case, which carries nearly three times the curvature.
      </Note>
    </PanelShell>
  );
};

export default AvoExplorer;
