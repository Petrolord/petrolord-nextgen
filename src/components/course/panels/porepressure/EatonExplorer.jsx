import React, { useMemo, useState } from 'react';
import {
  TD_M, RAMP_TOP_M, TEACHING_EATON_N, PARAMS,
  EXPLORER_N_OPTIONS_PRO, EXPLORER_THRESHOLDS_MPA, computeEatonExplorer,
} from '@/lib/porepressureTeaching';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Eaton explorer: the full prognosis down the golden well with the tier's
// three levers exposed: the exponent, the trend the ratio is measured
// against, and the onset detection threshold. The pressure curves are drawn
// because the SHAPE of the departure from hydrostatic is the lesson; the
// ramp-recovery tile is the quality control that closes the loop on the
// well trend at n = 3.
const W = 560;
const H = 420;
const PAD = { left: 54, top: 22, right: 16, bottom: 34 };

const fmt = (v, d = 3) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const EatonExplorer = () => {
  const [n, setN] = useState(String(TEACHING_EATON_N));
  const [trend, setTrend] = useState('well');
  const [thr, setThr] = useState('0.05');
  // The well setting opens on the golden well's header; a capstone brief
  // states its own and the learner types it in.
  const [wd, setWd] = useState(String(PARAMS.waterDepthM));
  const [rf, setRf] = useState(String(PARAMS.rhoFluidKgM3));
  const [nu, setNu] = useState(String(PARAMS.nu));

  const m = useMemo(() => {
    const c = { waterDepthM: Number(wd), rhoFluidKgM3: Number(rf), nu: Number(nu) };
    const ok = Number(n) > 0 && Number(n) <= 10 && Number(thr) > 0 && Number(thr) < 20
      && c.waterDepthM >= 0 && c.waterDepthM <= 3000 && c.rhoFluidKgM3 >= 900 && c.rhoFluidKgM3 <= 1300
      && c.nu > 0 && c.nu < 0.5;
    if (!ok) return null;
    try {
      return computeEatonExplorer(Number(n), trend, Number(thr), c);
    } catch {
      return null;
    }
  }, [n, trend, thr, wd, rf, nu]);

  const inputs = (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 items-end">
      <NumField label="Eaton exponent n" value={n} onChange={setN} />
      <SelectField label="Compaction trend" value={trend} onChange={setTrend}
        options={[['well', "the well's own (656 / 0.6 per km)"], ['fitted', 'fitted to the picks (650 / 0.7 per km)']]} />
      <NumField label="Onset threshold (MPa)" value={thr} onChange={setThr} />
      <NumField label="Water depth (m)" value={wd} onChange={setWd} />
      <NumField label="Pore fluid density (kg/m3)" value={rf} onChange={setRf} />
      <NumField label="Poisson's ratio" value={nu} onChange={setNu} />
    </div>
  );

  if (!m) {
    return (
      <PanelShell title="Eaton explorer" subtitle="Enter an exponent, a threshold and a well setting.">
        {inputs}
        <Note>The exponent must lie between 0 and 10, the threshold above 0 MPa, the water depth 0 to 3000 m, the pore fluid 900 to 1300 kg/m3 and Poisson&apos;s ratio between 0 and 0.5.</Note>
      </PanelShell>
    );
  }

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const pMax = m.curve[m.curve.length - 1].obMpa;
  const sy = (z) => PAD.top + (z / TD_M) * plotH;
  const sx = (mpa) => PAD.left + (mpa / pMax) * plotW;
  const path = (key) => m.curve.map((p, i) => `${i ? 'L' : 'M'} ${sx(p[key]).toFixed(1)} ${sy(p.z).toFixed(1)}`).join(' ');
  const loopCloses = trend === 'well' && Number(n) === TEACHING_EATON_N
    && Number(wd) === PARAMS.waterDepthM && Number(rf) === PARAMS.rhoFluidKgM3;

  return (
    <PanelShell title="Eaton explorer"
      subtitle="The prognosis over the golden sonic. The exponent, the trend and the onset threshold are the choices an interpreter actually makes, so all three are exposed.">
      {inputs}
      <div className="text-xs text-gray-500">
        The panel opens on the teaching case: the golden well&apos;s header at n = {TEACHING_EATON_N}, a 0.05 MPa
        onset threshold and Poisson&apos;s ratio {PARAMS.nu}. Try {EXPLORER_N_OPTIONS_PRO.join(', ')} for the exponent
        and {EXPLORER_THRESHOLDS_MPA.join(', ')} MPa for the threshold. A capstone brief states a setting of its
        own; type it in.
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-3" role="img"
        aria-label="Pore pressure, fracture pressure, hydrostatic and overburden against depth">
        <rect x={PAD.left} y={PAD.top} width={plotW} height={plotH} fill="none" stroke="#d4d4d8" />
        {[0, 20, 40, 60, 80].map((p) => (
          <g key={p}>
            <line x1={sx(p)} y1={PAD.top} x2={sx(p)} y2={PAD.top + plotH} stroke="#f1f1f4" />
            <text x={sx(p)} y={H - 12} fontSize="10" textAnchor="middle" fill="#71717a">{p}</text>
          </g>
        ))}
        {[0, 1000, 2000, 3000, 4000].map((z) => (
          <text key={z} x={PAD.left - 6} y={sy(z) + 3} fontSize="10" textAnchor="end" fill="#71717a">{z}</text>
        ))}
        <line x1={PAD.left} y1={sy(RAMP_TOP_M)} x2={PAD.left + plotW} y2={sy(RAMP_TOP_M)} stroke="#f59e0b" strokeDasharray="3 3" />
        <text x={PAD.left + plotW - 4} y={sy(RAMP_TOP_M) - 4} fontSize="9" textAnchor="end" fill="#b45309">ramp top 2500 m</text>
        <path d={path('hydroMpa')} fill="none" stroke="#0ea5e9" strokeWidth="1.4" strokeDasharray="5 3" />
        <path d={path('obMpa')} fill="none" stroke="#525252" strokeWidth="1.4" strokeDasharray="5 3" />
        <path d={path('fpMpa')} fill="none" stroke="#16a34a" strokeWidth="1.6" />
        <path d={path('ppMpa')} fill="none" stroke="#dc2626" strokeWidth="2" />
        {m.onsetM != null && (
          <circle cx={sx(m.curve.find((p) => p.z >= m.onsetM)?.ppMpa ?? 0)} cy={sy(m.onsetM)} r="4" fill="#dc2626" />
        )}
        <text x={PAD.left + 6} y={PAD.top + 12} fontSize="10" fill="#0369a1">hydrostatic</text>
        <text x={PAD.left + plotW - 6} y={PAD.top + 12} fontSize="10" textAnchor="end" fill="#404040">overburden</text>
        <text x={W / 2} y={H - 2} fontSize="10" textAnchor="middle" fill="#71717a">pressure (MPa); pore pressure red, fracture green</text>
      </svg>

      <TileGrid>
        <Tile label="Overpressure onset" value={m.onsetM == null ? 'none' : String(m.onsetM)} unit="m bml" />
        <Tile label="NCT at TD" value={fmt(m.dtnTd, 4)} unit="us/m" />
        <Tile label="PP at 3000 m" value={fmt(m.pp3000Mpa)} unit="MPa" />
        <Tile label="PP at TD" value={fmt(m.ppTdMpa)} unit="MPa" />
        <Tile label="Overpressure at TD" value={fmt(m.opTdMpa)} unit="MPa" />
        <Tile label="Fracture pressure at TD" value={fmt(m.fpTdMpa)} unit="MPa" />
        <Tile label="Ratio at TD" value={fmt(m.ratioTd, 4)} unit="" />
        <Tile label="Budget S minus Ph at TD" value={fmt(m.budgetTdMpa)} unit="MPa" />
        <Tile label="Worst gap to the encoded ramp" value={loopCloses ? fmt(m.maxRampErrPa, 8) : fmt(m.maxRampErrPa / 1e6, 3)} unit={loopCloses ? 'Pa' : 'MPa'} />
      </TileGrid>

      <Note>
        {loopCloses
          ? 'On the well trend at n = 3 the loop closes: the recovered overpressure matches the encoded 4 kPa/m ramp to a hundred-millionth of a pascal at every one of the 401 samples.'
          : 'With this exponent or trend the prognosis no longer matches the ramp the well encodes. The gap tile now reads in MPa: that is the size of the error this choice would ship.'}
      </Note>
    </PanelShell>
  );
};

export default EatonExplorer;
