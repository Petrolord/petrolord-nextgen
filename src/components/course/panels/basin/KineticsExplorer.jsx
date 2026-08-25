import React, { useMemo, useState } from 'react';
import { computeKineticsExplorer, KEROGEN_TYPES, RAMP_RATES } from '@/lib/basinTeaching';
import { PanelShell, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Kinetics explorer: the three golden Easy%Ro ramps on a log reflectance
// axis, and the kerogen clock at a temperature the learner picks. The
// ramps are drawn together because their ORDERING and widening gaps are
// the lesson; the isothermal curve is drawn because its bend, the stall,
// is the other lesson. The closed-form anchors sit in the tiles as the
// panel's own quality control.
const W = 560;
const H = 300;
const PAD = { left: 52, top: 20, right: 16, bottom: 32 };
const T0 = 20;
const T1 = 200;
const RO_LO = 0.18;
const RO_HI = 5.0;
const ISO_MAX_MA = 100;

const RATE_COLORS = { 1: '#f87171', 3: '#BFFF00', 10: '#38bdf8' };
const TYPE_LABELS = { type1: 'Type I', type2: 'Type II', type3: 'Type III' };

const fmt = (v, d = 6) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const KineticsExplorer = () => {
  const [rate, setRate] = useState(3);
  const [isoTemp, setIsoTemp] = useState('100');
  const [ktype, setKtype] = useState('type2');

  const tRaw = Number(isoTemp);
  const tOk = Number.isFinite(tRaw) && tRaw >= 60 && tRaw <= 180;

  const m = useMemo(
    () => computeKineticsExplorer(tOk ? tRaw : 100, ktype),
    [tRaw, tOk, ktype],
  );

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const halfW = plotW / 2 - 14;
  const sxT = (t) => PAD.left + ((t - T0) / (T1 - T0)) * halfW;
  const syRo = (ro) => {
    const f = (Math.log10(ro) - Math.log10(RO_LO)) / (Math.log10(RO_HI) - Math.log10(RO_LO));
    return PAD.top + (1 - f) * plotH;
  };
  const sxMa = (ma) => PAD.left + halfW + 28 + (ma / ISO_MAX_MA) * halfW;
  const syTr = (tr) => PAD.top + (1 - tr) * plotH;

  const rampLines = RAMP_RATES.map((r) => ({
    r,
    pts: m.ramps[r].map((e) => `${sxT(e.t_c)},${syRo(e.ro)}`).join(' '),
  }));
  const isoPts = m.iso.map((e) => `${sxMa(e.ma)},${syTr(e.tr)}`).join(' ');

  const cross05 = m.crossings(0.5).find((c) => c.rate === rate)?.t_c;
  const cross10 = m.crossings(1.0).find((c) => c.rate === rate)?.t_c;

  return (
    <PanelShell title="Kinetics explorer"
      subtitle="Left: the three golden Easy%Ro ramps, 20 to 200 degC, reflectance on a log axis with the 150 degC marker. Right: the kerogen clock at the temperature and type you pick.">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400">Heating rate (degC/Ma):</span>
        {RAMP_RATES.map((r) => (
          <button key={r} type="button" onClick={() => setRate(r)}
            className={`px-3 py-1.5 rounded-md border text-sm ${rate === r
              ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'
              : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
            {r}
          </button>
        ))}
        <span className="text-xs text-gray-400 ml-3">Kerogen:</span>
        {KEROGEN_TYPES.map((k) => (
          <button key={k} type="button" onClick={() => setKtype(k)}
            className={`px-3 py-1.5 rounded-md border text-sm ${ktype === k
              ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'
              : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
            {TYPE_LABELS[k]}
          </button>
        ))}
      </div>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <NumField label="Isothermal temperature (degC)" value={isoTemp} onChange={setIsoTemp} />
        <div className="text-xs text-gray-500 sm:col-span-3">
          The capstone reads the ramps at 150 degC for rates 3 and 1, and the Type II clock at
          100 degC after 10 and 50 Ma. {tOk ? '' : 'Enter a temperature between 60 and 180.'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 460 }} role="img"
          aria-label="Easy%Ro ramps and the isothermal kerogen transformation curve">
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />

          {[0.2, 0.5, 1, 2, 4].map((ro) => (
            <g key={ro}>
              <line x1={sxT(T0)} y1={syRo(ro)} x2={sxT(T1)} y2={syRo(ro)}
                stroke="#1e293b" strokeWidth="1" />
              <text x={sxT(T0) - 4} y={syRo(ro) + 3} fill="#64748b" fontSize="8" textAnchor="end">{ro}</text>
            </g>
          ))}
          <line x1={sxT(150)} y1={PAD.top} x2={sxT(150)} y2={PAD.top + plotH}
            stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 3" />
          <text x={sxT(150)} y={PAD.top + plotH + 12} fill="#e2e8f0" fontSize="8" textAnchor="middle">150</text>
          {rampLines.map(({ r, pts }) => (
            <polyline key={r} points={pts} fill="none" stroke={RATE_COLORS[r]}
              strokeWidth={r === rate ? 2.4 : 1.2} opacity={r === rate ? 1 : 0.75} />
          ))}
          <text x={PAD.left} y="13" fill="#94a3b8" fontSize="9">Ro (log), rates 1 / 3 / 10 degC per Ma</text>
          <text x={PAD.left} y={H - 8} fill="#64748b" fontSize="9">20 to 200 degC</text>

          {[0.25, 0.5, 0.75].map((tr) => (
            <line key={tr} x1={sxMa(0)} y1={syTr(tr)} x2={sxMa(ISO_MAX_MA)} y2={syTr(tr)}
              stroke="#1e293b" strokeWidth="1" />
          ))}
          <polyline points={isoPts} fill="none" stroke="#fb923c" strokeWidth="2" />
          <text x={sxMa(0)} y="13" fill="#fb923c" fontSize="9">
            TR at {tOk ? tRaw : 100} degC, {TYPE_LABELS[ktype]} (0 to 1)
          </text>
          <text x={sxMa(0)} y={H - 8} fill="#64748b" fontSize="9">0 to {ISO_MAX_MA} Ma</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Ro at zero reaction" value={fmt(m.roF0, 8)} unit="%Ro" />
        <Tile label="Ro at full reaction" value={fmt(m.roFull, 8)} unit="%Ro" />
        <Tile label={`Ro at 150 degC, rate ${rate}`} value={fmt(m.roAt(rate, 150), 8)} unit="%Ro" />
        <Tile label={`First degree at Ro 0.5, rate ${rate}`} value={cross05 ?? '-'} unit="degC" />
        <Tile label={`First degree at Ro 1.0, rate ${rate}`} value={cross10 ?? '-'} unit="degC" />
        <Tile label="TR at 10 Ma" value={fmt(m.trAt(10), 8)} unit="frac" />
        <Tile label="TR at 50 Ma" value={fmt(m.trAt(50), 8)} unit="frac" />
        <Tile label="TR at 100 Ma" value={fmt(m.trAt(100), 8)} unit="frac" />
      </TileGrid>

      <Note>
        The slow ramp sits highest at every temperature: same rock, same temperatures, three times
        the residence per degree. The two anchor tiles never move whatever you touch, because they
        are the closed forms exp(-1.6) and exp(-1.6 + 3.7 x 0.85), the panel checking itself. Switch
        kerogen type and watch the clock move while every reflectance stays put: that separation is
        the tier's first lesson, and software that fails it cannot be calibrated.
      </Note>
    </PanelShell>
  );
};

export default KineticsExplorer;
