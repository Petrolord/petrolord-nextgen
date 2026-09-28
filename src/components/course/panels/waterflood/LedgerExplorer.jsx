import React, { useMemo, useState } from 'react';
import {
  ledgerWith, pressureView, trackedFvfLedger, periodVoidage, TARGET_BAND, LEDGER_FVF,
} from './floodLab';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import { useThemeClass } from '@/design/themeClass';
import SvgChartFrame from '@/components/charts/SvgChartFrame';
import { seriesColor, SVG_CHART, GRID_LINE_PROPS } from '@/utils/chartSvg';

// Ledger explorer: the Ekene flood read through the real voidage engine. The
// window slider shows that a rolling average is a lag, not a smoother; the band
// fields separate the operator's target from the interpretation bands; the FVF
// toggle swaps the frozen Bo for a pressure-tracked one.

const W = 640;
const H = 300;
const PAD = { left: 46, top: 14, right: 46, bottom: 34 };


// A typed number box, dressed like the sliders (the capstone states values
// the sliders do not reach).
const NumBox = ({ label, value, onChange }) => {
  const tc = useThemeClass();
  return (
  <div>
    <p className={tc('text-gray-400 text-xs mb-1', 'text-pl-muted text-xs mb-1')}>{label}</p>
    <input value={value} onChange={(e) => onChange(e.target.value)}
      className={tc('w-full bg-gray-800 border border-gray-600 rounded-md text-white text-xs px-2 py-1.5', 'w-full bg-pl-surface border border-pl-border-strong rounded-md text-pl-text text-xs px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus')} />
  </div>
  );
};

const fmt = (v, d = 4) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d }) : '-');

const RangeField = ({ label, value, min, max, step, onChange }) => {
  const tc = useThemeClass();
  return (
  <div>
    <p className={tc('text-gray-400 text-xs mb-1', 'text-pl-muted text-xs mb-1')}>
      {label}: <span className={tc('text-white', 'text-pl-text')}>{value}</span>
    </p>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={tc('w-full accent-[#BFFF00]', 'w-full accent-pl-primary')}
    />
  </div>
  );
};

const LedgerExplorer = () => {
  const tc = useThemeClass();
  const [win, setWin] = useState(3);
  const [bandMin, setBandMin] = useState(TARGET_BAND.min);
  const [bandMax, setBandMax] = useState(TARGET_BAND.max);
  const [tracked, setTracked] = useState(false);
  // The factor set, the band and the month open on the teaching case; a
  // capstone brief states its own and the learner types them in.
  const [bo, setBo] = useState(String(LEDGER_FVF.Bo));
  const [bw, setBw] = useState(String(LEDGER_FVF.Bw));
  const [rs, setRs] = useState(String(LEDGER_FVF.Rs));
  const [bandMinT, setBandMinT] = useState('');
  const [bandMaxT, setBandMaxT] = useState('');
  const [month, setMonth] = useState('2023-01');

  const out = useMemo(() => {
    try {
      const fvf = { ...LEDGER_FVF, Bo: Number(bo), Bw: Number(bw), Rs: Number(rs) };
      if (!(fvf.Bo > 0 && fvf.Bw > 0 && fvf.Rs >= 0)) throw new Error('Bo and Bw must be positive and Rs zero or more.');
      const lo = bandMinT === '' ? bandMin : Number(bandMinT);
      const hi = bandMaxT === '' ? bandMax : Number(bandMaxT);
      const band = { min: lo, max: Math.max(hi, lo) };
      const led = ledgerWith({ window: win, band, fvf });
      const pv = pressureView();
      const tr = tracked ? trackedFvfLedger() : null;
      const one = periodVoidage(month, fvf);
      return { led, pv, tr, band, one };
    } catch (e) {
      return { error: e.message };
    }
  }, [win, bandMin, bandMax, tracked, bo, bw, rs, bandMinT, bandMaxT, month]);

  if (out.error) return <PanelShell title="Ledger explorer"><Note>Engine error: {out.error}</Note></PanelShell>;
  const { led, pv, tr, band, one } = out;

  const n = led.series.length;
  const vMin = 0.5;
  const vMax = 1.35;
  const x = (i) => PAD.left + (i / (n - 1)) * (W - PAD.left - PAD.right);
  const y = (v) => H - PAD.bottom - ((v - vMin) / (vMax - vMin)) * (H - PAD.top - PAD.bottom);
  const pMin = 2085;
  const pMax = 2126;
  const yp = (p) => H - PAD.bottom - ((p - pMin) / (pMax - pMin)) * (H - PAD.top - PAD.bottom);

  const line = (vals, mapY) => vals
    .map((v, i) => (v == null ? null : `${i ? 'L' : 'M'}${x(i).toFixed(1)},${mapY(v).toFixed(1)}`))
    .filter(Boolean)
    .join(' ')
    .replace(/^L/, 'M');

  const cumSeries = tr ? tr.series.map((r) => r.cumulativeVRR) : led.series.map((r) => r.cumulativeVRR);
  const cumLast = cumSeries[cumSeries.length - 1];

  return (
    <PanelShell
      title="Ledger explorer"
      subtitle="Thirty-six months of the Ekene flood through the voidage engine. Grey band is the operator target; the dashed line is reservoir pressure on the right axis."
    >
      <div className="grid gap-4 sm:grid-cols-4 items-end">
        <RangeField label="Rolling window (periods)" value={win} min={1} max={12} step={1} onChange={setWin} />
        <RangeField label="Band minimum" value={bandMin} min={0.8} max={1.1} step={0.01} onChange={setBandMin} />
        <RangeField label="Band maximum" value={bandMax} min={1.0} max={1.4} step={0.01} onChange={setBandMax} />
        <button
          type="button" onClick={() => setTracked((v) => !v)}
          className={tc(`px-3 py-1.5 rounded-md border text-xs ${tracked ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`, `px-3 py-1.5 rounded-md border text-xs ${tracked ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong'}`)}
        >
          {tracked ? 'Bo tracked on pressure' : 'Bo frozen at 1.21584'}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-6 items-end mt-3">
        <NumBox label="Bo (rb/stb)" value={bo} onChange={setBo} />
        <NumBox label="Bw (rb/stb)" value={bw} onChange={setBw} />
        <NumBox label="Rs (scf/stb)" value={rs} onChange={setRs} />
        <NumBox label="Band minimum (typed)" value={bandMinT} onChange={setBandMinT} />
        <NumBox label="Band maximum (typed)" value={bandMaxT} onChange={setBandMaxT} />
        <NumBox label="Read month (YYYY-MM)" value={month} onChange={setMonth} />
      </div>
      <p className={tc('text-xs text-gray-500 mt-1', 'text-xs text-pl-muted mt-1')}>
        The panel opens on the teaching factor set (Bo {LEDGER_FVF.Bo}, Bw {LEDGER_FVF.Bw}, Rs {LEDGER_FVF.Rs}) and the
        1.00 to 1.20 band. A typed band overrides the sliders. A capstone brief states its own factors, band and month.
      </p>

      <SvgChartFrame width={W} height={H} label="Voidage replacement ratio by month with reservoir pressure" minWidth={460} maxWidth={720}>
        <rect
          x={PAD.left} y={y(band.max)} width={W - PAD.left - PAD.right}
          height={Math.max(0, y(band.min) - y(band.max))} fill={SVG_CHART.reference} opacity="0.12"
        />
        {[0.6, 0.8, 1.0, 1.2].map((v) => (
          <g key={v}>
            <line x1={PAD.left} y1={y(v)} x2={W - PAD.right} y2={y(v)} {...GRID_LINE_PROPS} />
            <text x={PAD.left - 6} y={y(v) + 4} textAnchor="end" fill={SVG_CHART.tick} fontSize="10">{v.toFixed(1)}</text>
          </g>
        ))}
        <path d={line(led.series.map((r) => r.instantaneousVRR), y)} fill="none" stroke={seriesColor(1)} strokeWidth="1.5" opacity="0.7" />
        <path d={line(led.rolling, y)} fill="none" stroke={seriesColor(0)} strokeWidth="2" />
        <path d={line(cumSeries, y)} fill="none" stroke={seriesColor(4)} strokeWidth="2" />
        <path d={line(pv.track.map((r) => r.p_end_psia), yp)} fill="none" stroke={seriesColor(2)} strokeWidth="1.5" strokeDasharray="4 3" />
        <path d={line(pv.attached.map((r) => r.pressure), yp)} fill="none" stroke={seriesColor(2)} strokeWidth="1" opacity="0.5" />
        {led.fillUp && (
          <line x1={x(led.fillUp.index)} y1={PAD.top} x2={x(led.fillUp.index)} y2={H - PAD.bottom} stroke={seriesColor(4)} strokeWidth="1" strokeDasharray="3 3" />
        )}
        <text x={PAD.left} y={H - 10} fill={SVG_CHART.tick} fontSize="10">{led.series[0].label}</text>
        <text x={W - PAD.right} y={H - 10} textAnchor="end" fill={SVG_CHART.tick} fontSize="10">{led.series[n - 1].label}</text>
        <text x={W - PAD.right + 6} y={yp(2120) + 4} fill={seriesColor(2)} fontSize="10">psia</text>
      </SvgChartFrame>

      <TileGrid>
        <Tile label="Cumulative VRR" value={fmt(cumLast, 6)} unit="rb/rb" />
        <Tile label="Latest instantaneous" value={fmt(led.series[n - 1].instantaneousVRR, 4)} unit="rb/rb" />
        <Tile label={`Rolling ${win}`} value={fmt(led.rolling[n - 1], 4)} unit="rb/rb" />
        <Tile label="Fill-up month" value={led.fillUp ? `${led.fillUp.label} (index ${led.fillUp.index})` : 'never'} unit="" />
        <Tile label="Months under band" value={led.monthsUnder} unit="of 36" />
        <Tile label="Months over band" value={led.monthsOver} unit="of 36" />
        <Tile label="Produced voidage" value={fmt(led.summary.totalProducedVoidage, 0)} unit="rb" />
        <Tile label="Injected voidage" value={fmt(led.summary.totalInjectedVoidage, 0)} unit="rb" />
        <Tile label={`Produced voidage, ${month}`} value={one ? fmt(one.producedVoidage, 2) : '-'} unit="rb" />
        <Tile label="Pressure trough" value={pv.trough.label} unit={`${fmt(pv.trough.p_end_psia, 1)} psia`} />
        <Tile label="Trough the surveys see" value={pv.interpolatedTrough.label} unit={`${fmt(pv.troughMissedByPsi, 2)} psi high`} />
      </TileGrid>

      <Note>
        Green is instantaneous VRR, blue is the rolling window, violet is cumulative, and the violet dashed line marks fill-up.
        The bright amber line is the closed-form pressure track; the faint one is what a six-monthly survey cadence
        interpolates. {tracked ? 'Bo is being read off the pressure track through the PVT table.' : 'Bo is frozen at the flood-era 1.21584 rb/stb.'}
      </Note>
    </PanelShell>
  );
};

export default LedgerExplorer;
