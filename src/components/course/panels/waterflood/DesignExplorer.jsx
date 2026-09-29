import React, { useMemo, useState } from 'react';
import {
  layerSweep, forecast, evAtFirstBreakthrough, channelBackoutFor, LAYERS, LAYER_DESIGN, ELEMENT, EKENE_SCAL, EKENE_FLOOD,
} from './floodLab';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import { useThemeClass } from '@/design/themeClass';
import SvgChartFrame from '@/components/charts/SvgChartFrame';
import { seriesColor, SVG_CHART, GRID_LINE_PROPS } from '@/utils/chartSvg';
import { getStreamPalette } from '@/utils/chartTheme';

// Design explorer: the two Expert engines side by side. Layers mode runs the
// Dykstra-Parsons and Stiles stage tables on the planted column; forecast mode
// runs the five-spot rate-time march. The EV toggle is the link between them.

const W = 640;
const H = 300;
const PAD = { left: 52, top: 14, right: 46, bottom: 34 };


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

const DesignExplorer = () => {
  const tc = useThemeClass();
  const [mode, setMode] = useState('layers');
  const [M, setM] = useState(LAYER_DESIGN.mobility_ratio);
  const [iw, setIw] = useState(ELEMENT.iw_design_rb_d);
  const [useEv, setUseEv] = useState(true);
  const [sgi, setSgi] = useState(0);
  // The layer column, M, the rate, the oil viscosity and the breakthrough the
  // back-out reads open on the teaching case; a capstone brief states its own.
  const [perms, setPerms] = useState(() => LAYERS.map((l) => String(l.k_md)));
  const [mT, setMT] = useState('');
  const [iwT, setIwT] = useState('');
  const [muO, setMuO] = useState(String(EKENE_SCAL.design.muO_cp));
  const [prod, setProd] = useState(EKENE_FLOOD.expected.channeling.producer);
  const [btDate, setBtDate] = useState(EKENE_FLOOD.expected.channeling.breakthrough_date);

  const out = useMemo(() => {
    try {
      const k = perms.map(Number);
      if (k.some((v) => !(v > 0))) throw new Error('Every layer permeability must be positive.');
      const Mv = mT === '' ? M : Number(mT);
      const iwv = iwT === '' ? iw : Number(iwT);
      const mu = Number(muO);
      if (!(Mv > 0 && iwv > 0 && mu > 0)) throw new Error('M, the injection rate and the oil viscosity must be positive.');
      const sweep = layerSweep({ M: Mv, perms: k });
      const EV = useEv ? evAtFirstBreakthrough(Mv, k) : 1;
      const f = forecast({ iw: iwv, EV, Sgi: sgi, muO: mu });
      const ch = /^\d{4}-\d{2}-\d{2}$/.test(btDate) ? channelBackoutFor({ producer: prod, btDate, muO: mu }) : null;
      return { sweep, f, EV, ch };
    } catch (e) {
      return { error: e.message };
    }
  }, [M, iw, useEv, sgi, perms, mT, iwT, muO, prod, btDate]);

  if (out.error) return <PanelShell title="Design explorer"><Note>Engine error: {out.error}</Note></PanelShell>;
  const { sweep, f, EV, ch } = out;

  const maxK = Math.max(...LAYERS.map((l) => l.k_md));
  const totalH = LAYER_DESIGN.net_pay_ft;
  const layersView = (() => {
    let acc = 0;
    return LAYERS.map((l) => {
      const top = acc;
      acc += l.h_ft;
      return { ...l, top, bottom: acc };
    });
  })();

  const series = f.series;
  const tMax = series.length ? series[series.length - 1].t_days : 1;
  const qMax = Math.max(1, ...series.map((s) => Math.max(s.qo_stbd, s.qw_stbd)));
  const fx = (t) => PAD.left + (t / tMax) * (W - PAD.left - PAD.right);
  const fy = (q) => H - PAD.bottom - (q / qMax) * (H - PAD.top - PAD.bottom);
  const fline = (key) => series.map((s, i) => `${i ? 'L' : 'M'}${fx(s.t_days).toFixed(1)},${fy(s[key]).toFixed(1)}`).join(' ');

  return (
    <PanelShell
      title="Design explorer"
      subtitle="Vertical sweep from the layer column, areal sweep and rate-time from the five-spot forecast. The vertical sweep the forecast borrows is the coverage at the first layer breakthrough."
    >
      <div className="grid gap-4 sm:grid-cols-4 items-end">
        <div>
          <p className={tc('text-gray-400 text-xs mb-1', 'text-pl-muted text-xs mb-1')}>Mode</p>
          <select
            value={mode} onChange={(e) => setMode(e.target.value)}
            className={tc('w-full bg-gray-800 border border-gray-600 rounded-md text-white text-xs px-2 py-1.5', 'w-full bg-pl-surface border border-pl-border-strong rounded-md text-pl-text text-xs px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus')}
          >
            <option value="layers">Layered sweep</option>
            <option value="forecast">Pattern forecast</option>
          </select>
        </div>
        <RangeField label="Mobility ratio M" value={M} min={0.5} max={5} step={0.1} onChange={setM} />
        <RangeField label="Injection rate (rb/d)" value={iw} min={500} max={4000} step={100} onChange={setIw} />
        <RangeField label="Initial free gas Sgi" value={sgi} min={0} max={0.1} step={0.01} onChange={setSgi} />
      </div>

      <div className="grid gap-4 sm:grid-cols-8 items-end mt-3">
        {perms.map((p, i) => (
          <NumBox key={LAYERS[i].name} label={`${LAYERS[i].name} k (md)`} value={p} onChange={(v) => setPerms((a) => a.map((x, j) => (j === i ? v : x)))} />
        ))}
        <NumBox label="M (typed)" value={mT} onChange={setMT} />
        <NumBox label="Rate rb/d (typed)" value={iwT} onChange={setIwT} />
        <NumBox label="Oil viscosity (cp)" value={muO} onChange={setMuO} />
      </div>
      <p className={tc('text-xs text-gray-500 mt-1', 'text-xs text-pl-muted mt-1')}>
        The panel opens on the teaching column, M {LAYER_DESIGN.mobility_ratio}, {ELEMENT.iw_design_rb_d} rb/d and the SCAL oil.
        Typed M and rate override the sliders. A capstone brief states its own; type it in.
      </p>

      <button
        type="button" onClick={() => setUseEv((v) => !v)}
        className={tc(`mt-3 px-3 py-1.5 rounded-md border text-xs ${useEv ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`, `mt-3 px-3 py-1.5 rounded-md border text-xs ${useEv ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong'}`)}
      >
        {useEv ? `EV from the layer column (${fmt(EV, 4)})` : 'EV = 1 (no vertical sweep penalty)'}
      </button>

      {mode === 'layers' ? (
        <SvgChartFrame width={W} height={H} label="Layer permeability and thickness in depth order" minWidth={460} maxWidth={720} className="mt-3">
          {layersView.map((l) => {
            const yTop = PAD.top + (l.top / totalH) * (H - PAD.top - PAD.bottom);
            const hgt = (l.h_ft / totalH) * (H - PAD.top - PAD.bottom);
            const wdt = (l.k_md / maxK) * (W - PAD.left - PAD.right);
            return (
              <g key={l.name}>
                <rect x={PAD.left} y={yTop} width={wdt} height={Math.max(1, hgt - 2)} fill={seriesColor(0)} opacity="0.55" />
                <text x={PAD.left - 6} y={yTop + hgt / 2 + 4} textAnchor="end" fill={SVG_CHART.tick} fontSize="10">{l.name}</text>
                <text x={PAD.left + wdt + 6} y={yTop + hgt / 2 + 4} fill={SVG_CHART.label} fontSize="10">
                  {fmt(l.k_md, 1)} md, {l.h_ft} ft
                </text>
              </g>
            );
          })}
          <text x={PAD.left} y={H - 10} fill={SVG_CHART.tick} fontSize="10">bar length is permeability, bar height is thickness, order is depth</text>
        </SvgChartFrame>
      ) : (
        <SvgChartFrame width={W} height={H} label="Oil and water rate against time for the pattern forecast" minWidth={460} maxWidth={720} className="mt-3">
          {[0.25, 0.5, 0.75, 1].map((frac) => (
            <g key={frac}>
              <line x1={PAD.left} y1={fy(qMax * frac)} x2={W - PAD.right} y2={fy(qMax * frac)} {...GRID_LINE_PROPS} />
              <text x={PAD.left - 6} y={fy(qMax * frac) + 4} textAnchor="end" fill={SVG_CHART.tick} fontSize="10">{fmt(qMax * frac, 0)}</text>
            </g>
          ))}
          <path d={fline('qo_stbd')} fill="none" stroke={getStreamPalette('oil').primary} strokeWidth="2" />
          <path d={fline('qw_stbd')} fill="none" stroke={getStreamPalette('water').primary} strokeWidth="2" />
          {f.summary.breakthrough_days != null && (
            <line
              x1={fx(f.summary.breakthrough_days)} y1={PAD.top}
              x2={fx(f.summary.breakthrough_days)} y2={H - PAD.bottom}
              stroke={seriesColor(4)} strokeWidth="1.5" strokeDasharray="4 3"
            />
          )}
          <text x={PAD.left} y={H - 10} fill={SVG_CHART.tick} fontSize="10">0 d</text>
          <text x={W - PAD.right} y={H - 10} textAnchor="end" fill={SVG_CHART.tick} fontSize="10">{fmt(tMax, 0)} d</text>
          <text x={W - PAD.right + 4} y={PAD.top + 10} textAnchor="end" fill={getStreamPalette('oil').primary} fontSize="10">oil</text>
          <text x={W - PAD.right + 4} y={PAD.top + 24} textAnchor="end" fill={getStreamPalette('water').primary} fontSize="10">water</text>
        </SvgChartFrame>
      )}

      {mode === 'layers' ? (
        <TileGrid>
          <Tile label="Permeability variation V" value={fmt(sweep.V.V, 6)} unit="-" />
          <Tile label="sigma of ln k" value={fmt(sweep.V.sigma, 6)} unit="-" />
          <Tile label="k50" value={fmt(sweep.V.k50, 4)} unit="md" />
          <Tile label="Stiles capacity ratio A" value={fmt(sweep.A, 6)} unit="-" />
          <Tile label="DP coverage at 1st BT" value={fmt(sweep.dykstraParsons[0].coverage, 6)} unit="fraction" />
          <Tile label="DP WOR at 1st BT" value={fmt(sweep.dykstraParsons[0].WOR, 4)} unit="rb/rb" />
          <Tile label="Stiles coverage at 1st BT" value={fmt(sweep.stiles[0].coverage, 6)} unit="fraction" />
          <Tile label="Stiles water cut at 1st BT" value={fmt(sweep.stiles[0].waterCut, 6)} unit="fraction" />
          <Tile label="Coverage at 3rd BT" value={fmt(sweep.dykstraParsons[2].coverage, 6)} unit="fraction" />
          <Tile label="Net pay" value={sweep.netPayFt} unit="ft" />
        </TileGrid>
      ) : (
        <TileGrid>
          <Tile label="Mobility ratio M" value={fmt(f.summary.M, 4)} unit="-" />
          <Tile label="Areal sweep at BT" value={fmt(f.summary.EAbt, 6)} unit="fraction" />
          <Tile label="Water to breakthrough" value={fmt(f.summary.WiBT_bbl, 0)} unit="rb" />
          <Tile label="Breakthrough" value={f.summary.breakthrough_days == null ? 'none in horizon' : fmt(f.summary.breakthrough_days, 2)} unit={f.summary.breakthrough_days == null ? '' : 'days'} />
          <Tile label="Np at stop" value={fmt(f.summary.Np_stb, 0)} unit="stb" />
          <Tile label="RF of flooded OOIP" value={fmt(f.summary.recoveryFactorOfFloodedOOIP, 6)} unit="fraction" />
          <Tile label="Final WOR" value={fmt(f.summary.finalWOR, 3)} unit="stb/stb" />
          <Tile label="Elapsed" value={fmt(f.summary.elapsed_days, 0)} unit="days" />
          <Tile label="Stopped by" value={f.summary.stopped} unit="" />
          <Tile label="Flooded OOIP" value={fmt(f.summary.ooip_flooded_stb, 0)} unit="stb" />
        </TileGrid>
      )}

      <div className="mt-4">
        <p className={tc('text-gray-400 text-xs mb-1', 'text-pl-muted text-xs mb-1')}>Channel back-out: the contacted pore volume a producer&apos;s breakthrough implies (opens on Ekene-6)</p>
        <div className="grid gap-4 sm:grid-cols-4 items-end">
          <div>
            <p className={tc('text-gray-400 text-xs mb-1', 'text-pl-muted text-xs mb-1')}>Producer</p>
            <select value={prod} onChange={(e) => setProd(e.target.value)}
              className={tc('w-full bg-gray-800 border border-gray-600 rounded-md text-white text-xs px-2 py-1.5', 'w-full bg-pl-surface border border-pl-border-strong rounded-md text-pl-text text-xs px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus')}>
              {['Ekene-1', 'Ekene-3', 'Ekene-5', 'Ekene-6'].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <NumBox label="Breakthrough date (YYYY-MM-DD)" value={btDate} onChange={setBtDate} />
        </div>
        <TileGrid>
          <Tile label="Allocated before breakthrough" value={ch ? fmt(ch.allocatedBbl, 2) : '-'} unit="bbl" />
          <Tile label="QiBt" value={ch ? fmt(ch.QiBt, 6) : '-'} unit="PV" />
          <Tile label="Implied contacted PV" value={ch ? fmt(ch.impliedSweptPvRb, 0) : '-'} unit="rb" />
          <Tile label="Fraction of the element" value={ch ? fmt(ch.fractionOfElement, 6) : '-'} unit="-" />
        </TileGrid>
      </div>

      {f.warnings.length > 0 && <Note>{f.warnings.join(' ')}</Note>}
      <Note>
        The layer column is drawn in DEPTH order and the engine floods it in PERMEABILITY order, so the second
        bar from the top breaks through first. Mobility ratio moves both halves of the answer: it changes the
        Dykstra-Parsons front positions and it changes the areal sweep at breakthrough.
      </Note>
    </PanelShell>
  );
};

export default DesignExplorer;
