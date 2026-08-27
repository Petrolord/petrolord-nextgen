import React, { useMemo, useState } from 'react';
import {
  WELLS, FLOOD_START, ECON_LIMIT_BOPD, fitWell, bookFromFit, arpsRate, daysBetween,
} from './declineLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Fit explorer: pick a producer, a model and a fit window, and watch the
// real engine fit the committed Ekene monthly rates. The tiles show the
// booking chain the Associate capstone grades; the window selector is the
// Professional tier's central lever (the flood is IN the data from 2023-01).

const W = 620;
const H = 340;
const PAD = { left: 52, top: 16, right: 14, bottom: 30 };

const MODELS = [
  ['Auto-Select', 'Auto-select'],
  ['Exponential', 'Exponential'],
  ['Hyperbolic', 'Hyperbolic'],
  ['Harmonic', 'Harmonic'],
];
const WINDOW_OPTIONS = [
  ['primary', 'Primary (pre-flood)'],
  ['full', 'Full history'],
  ['postRamp', 'Post-ramp (2024-05 on)'],
  ['custom', 'Custom'],
];

const fmt = (v, d = 4) => (Number.isFinite(v) ? Number(v).toFixed(d) : '-');

const FitExplorer = () => {
  const [wellName, setWellName] = useState('Ekene-1');
  const [model, setModel] = useState('Auto-Select');
  const [windowKey, setWindowKey] = useState('primary');
  const [customStart, setCustomStart] = useState('2020-01-01');
  const [customEnd, setCustomEnd] = useState('2022-12-15');
  const [semilog, setSemilog] = useState(true);

  const out = useMemo(() => {
    try {
      const custom = windowKey === 'custom' ? { startDate: customStart, endDate: customEnd } : null;
      const { well, fit, window } = fitWell(wellName, model, windowKey, custom);
      const params = fit.parameters;
      const usable = params.modelType !== 'None' && params.qi > 0;
      const book = usable ? bookFromFit(params, ECON_LIMIT_BOPD, fit.t0) : null;
      return { well, fit, window, book, usable };
    } catch (e) {
      return { error: e.message };
    }
  }, [wellName, model, windowKey, customStart, customEnd]);

  if (out.error) return <PanelShell title="Fit explorer"><Note>Engine error: {out.error}</Note></PanelShell>;
  const { well, fit, window: win, book, usable } = out;
  const params = fit.parameters;

  const t0Well = well.start_date;
  const pts = well.monthly.map((r) => ({
    t: daysBetween(t0Well, r.date),
    rate: r.oil_bpd,
    date: r.date,
    inWindow: (!win?.startDate || r.date >= win.startDate) && (!win?.endDate || r.date <= win.endDate),
  }));
  const tMax = pts[pts.length - 1].t;
  const rMax = Math.max(...pts.map((p) => p.rate)) * 1.08;
  const rMin = semilog ? Math.max(1, Math.min(...pts.map((p) => p.rate)) * 0.8) : 0;
  const yOf = (r) => {
    const v = semilog ? Math.log10(Math.max(r, rMin)) : r;
    const lo = semilog ? Math.log10(rMin) : 0;
    const hi = semilog ? Math.log10(rMax) : rMax;
    return PAD.top + (1 - (v - lo) / (hi - lo)) * (H - PAD.top - PAD.bottom);
  };
  const xOf = (t) => PAD.left + (t / tMax) * (W - PAD.left - PAD.right);

  // Fitted curve drawn from the FIT's own t0 across the plotted range.
  const tFit0 = usable ? daysBetween(t0Well, fit.t0.slice(0, 10)) : 0;
  const curve = usable
    ? Array.from({ length: 121 }, (_, i) => {
        const t = (tMax * i) / 120;
        if (t < tFit0) return null;
        const q = arpsRate(params.modelType.toLowerCase(), params.qi, params.Di, params.b, t - tFit0);
        return `${xOf(t).toFixed(1)},${yOf(q).toFixed(1)}`;
      }).filter(Boolean)
    : [];

  const floodT = daysBetween(t0Well, FLOOD_START);
  const showNp = usable && fit.t0.slice(0, 10) === t0Well;

  return (
    <PanelShell
      title="Fit explorer"
      subtitle="The real engine (fitArpsModel) over the committed Ekene monthly rates. The window is part of the model."
    >
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <SelectField label="Well" value={wellName} onChange={setWellName}
          options={WELLS.map((w) => [w.name, `${w.name} (${w.planted.model})`])} />
        <SelectField label="Model" value={model} onChange={setModel} options={MODELS} />
        <SelectField label="Fit window" value={windowKey} onChange={setWindowKey} options={WINDOW_OPTIONS} />
        <SelectField label="Rate axis" value={semilog ? 'log' : 'lin'} onChange={(v) => setSemilog(v === 'log')}
          options={[['log', 'Semilog'], ['lin', 'Linear']]} />
      </div>
      {windowKey === 'custom' && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <NumFieldLike label="Window start (YYYY-MM-DD)" value={customStart} onChange={setCustomStart} />
          <NumFieldLike label="Window end (YYYY-MM-DD)" value={customEnd} onChange={setCustomEnd} />
        </div>
      )}

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#334155" />
        <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#334155" />
        {[0, 500, 1000, 1500, 2000].filter((t) => t <= tMax).map((t) => (
          <g key={t}>
            <line x1={xOf(t)} y1={H - PAD.bottom} x2={xOf(t)} y2={H - PAD.bottom + 3} stroke="#334155" />
            <text x={xOf(t)} y={H - PAD.bottom + 14} fontSize="9" fill="#64748b" textAnchor="middle">{t} d</text>
          </g>
        ))}
        {(semilog ? [10, 30, 100] : [0, 40, 80, 120]).filter((r) => r <= rMax && r >= rMin).map((r) => (
          <g key={r}>
            <line x1={PAD.left - 3} y1={yOf(r)} x2={PAD.left} y2={yOf(r)} stroke="#334155" />
            <text x={PAD.left - 6} y={yOf(r) + 3} fontSize="9" fill="#64748b" textAnchor="end">{r}</text>
          </g>
        ))}
        {floodT <= tMax && (
          <g>
            <line x1={xOf(floodT)} y1={PAD.top} x2={xOf(floodT)} y2={H - PAD.bottom} stroke="#eab308" strokeDasharray="5 4" opacity="0.6" />
            <text x={xOf(floodT) + 4} y={PAD.top + 10} fontSize="9" fill="#eab308">flood start</text>
          </g>
        )}
        {curve.length > 1 && (
          <path d={`M${curve.join(' L')}`} fill="none" stroke="#BFFF00" strokeWidth="1.6" opacity="0.9" />
        )}
        {pts.map((p) => (
          <circle key={p.date} cx={xOf(p.t)} cy={yOf(p.rate)} r="2.4"
            fill={p.inWindow ? '#38bdf8' : '#475569'} />
        ))}
        <text x={PAD.left + 8} y={PAD.top + 10} fontSize="10" fill="#38bdf8">monthly rate (in window)</text>
        <text x={PAD.left + 8} y={PAD.top + 23} fontSize="10" fill="#475569">outside window</text>
        <text x={PAD.left + 8} y={PAD.top + 36} fontSize="10" fill="#BFFF00">fitted curve</text>
      </svg>

      {usable ? (
        <TileGrid>
          <Tile label="Fitted model" value={params.modelType} />
          <Tile label="qi" value={fmt(params.qi, 4)} unit="stb/d" />
          <Tile label="Di" value={fmt(params.Di, 7)} unit="1/d" />
          <Tile label="b (raw)" value={String(params.b)} />
          <Tile label="R2" value={fmt(fit.R2, 6)} />
          <Tile label="RMSE" value={fmt(fit.RMSE, 4)} unit="stb/d" />
          <Tile label={`EUR @ ${ECON_LIMIT_BOPD} stb/d`} value={fmt(book.eur, 1)} unit="stb" />
          <Tile label="Time to limit" value={fmt(book.timeToLimitDays, 1)} unit="days" />
          {showNp && <Tile label={`Np at ${FLOOD_START}`} value={fmt(book.npAtDate, 1)} unit="stb" />}
          <Tile label="Tangent effective decline" value={fmt(book.effectiveDeclinePct, 4)} unit="%/yr" />
        </TileGrid>
      ) : (
        <Note>The engine returned no usable fit for this window (too few points or a degenerate regression).</Note>
      )}
      <Note>
        Grey points are excluded by the window. Fit through the flood response and the engine still
        returns numbers, with a plausible R2. The window is a statement about which physics you
        believe, not a display preference.
      </Note>
    </PanelShell>
  );
};

// Text input dressed like the panelKit fields (dates rather than numbers).
const NumFieldLike = ({ label, value, onChange }) => (
  <div>
    <p className="text-gray-400 text-xs mb-1">{label}</p>
    <input value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-700 text-white border border-gray-600 rounded-md h-8 text-sm px-2" />
  </div>
);

export default FitExplorer;
