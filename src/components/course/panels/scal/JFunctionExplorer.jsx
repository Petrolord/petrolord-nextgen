import React, { useMemo, useState } from 'react';
import {
  plugJTables, fitPlugJ, reservoirCapillary, makeJFunction,
} from './scalLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// J-function explorer: three Ekene plugs from three different labs (air-brine,
// mercury-air, oil-brine) whose Pc curves disagree by an order of magnitude,
// collapsed onto one dimensionless J(Sw) curve. The fitted power law is then
// scaled back to reservoir rock: entry pressure, free water level, and the
// saturation the crest drains to.

const W = 620;
const H = 300;
const PAD = { left: 56, top: 16, right: 16, bottom: 40 };

const fmt = (v, d = 4) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d }) : '-');
const sci = (v, d = 6) => (Number.isFinite(v) ? Number(v).toPrecision(d) : '-');

const PLUG_COLORS = ['#38bdf8', '#f97316', '#a78bfa'];

const JFunctionExplorer = () => {
  const [plugSel, setPlugSel] = useState('all');
  const [swirrText, setSwirrText] = useState('0.25');

  const out = useMemo(() => {
    try {
      const plugs = plugJTables();
      const Swirr = Number(swirrText);
      if (!Number.isFinite(Swirr) || Swirr < 0) return { error: 'Enter a non-negative Swirr.' };
      const minSw = Math.min(...plugs.flatMap((p) => p.jRows.map((r) => r.Sw)));
      if (Swirr >= minSw) {
        return { error: `Swirr must sit below the lowest measured Sw (${minSw.toFixed(2)}).` };
      }
      const idx = plugSel === 'all' ? null : Number(plugSel);
      const fit = fitPlugJ(idx, Swirr);
      if (!fit.ok) return { error: fit.errors.join('; ') };
      const cap = reservoirCapillary();
      return { plugs, fit, cap, Swirr, idx };
    } catch (e) {
      return { error: e.message };
    }
  }, [plugSel, swirrText]);

  const controls = (
    <div className="grid gap-3 grid-cols-2 sm:w-96">
      <SelectField
        label="Plug"
        value={plugSel}
        onChange={setPlugSel}
        options={[['all', 'All three plugs'], ['0', 'EK1-P (air-brine)'], ['1', 'EK3-P (mercury-air)'], ['2', 'EK5-P (oil-brine)']]}
      />
      <NumField label="Swirr for the fit" value={swirrText} onChange={setSwirrText} />
    </div>
  );

  if (out.error) {
    return (
      <PanelShell title="J-function explorer" subtitle="Three labs, one rock: the Leverett collapse.">
        {controls}
        <Note>{out.error}</Note>
      </PanelShell>
    );
  }

  const { plugs, fit, cap, Swirr, idx } = out;
  const shown = idx == null ? plugs : [plugs[idx]];
  const shownColors = idx == null ? PLUG_COLORS : [PLUG_COLORS[idx]];

  // Left plot: lab Pc on a log axis (the three labs disagree by 10x and more).
  const allPc = shown.flatMap((p) => p.pcRows.map((r) => r.Pc_psi)).filter((v) => v > 0);
  const pcLo = Math.min(...allPc) * 0.8;
  const pcHi = Math.max(...allPc) * 1.2;
  const xSw = (Sw) => PAD.left + ((Sw - 0.25) / 0.8) * (W - PAD.left - PAD.right);
  const yPc = (v) => H - PAD.bottom - (Math.log10(v / pcLo) / Math.log10(pcHi / pcLo)) * (H - PAD.top - PAD.bottom);
  const pcPath = (rows) => rows.map((r, i) => `${i ? 'L' : 'M'}${xSw(r.Sw).toFixed(1)},${yPc(r.Pc_psi).toFixed(1)}`).join(' ');

  // Right plot: the collapsed J cloud and the fitted power law.
  const allJ = shown.flatMap((p) => p.jRows.map((r) => r.J));
  const jHi = Math.max(...allJ) * 1.1;
  const yJ = (v) => H - PAD.bottom - (v / jHi) * (H - PAD.top - PAD.bottom);
  const jEval = makeJFunction({ type: 'power', a: fit.a, b: fit.b, Swirr: fit.Swirr });
  const fitPts = [];
  for (let i = 0; i <= 80; i++) {
    const Sw = 0.3 + (0.7 * i) / 80;
    const J = jEval.j(Sw);
    if (Number.isFinite(J) && J <= jHi) fitPts.push({ Sw, J });
  }
  const fitPath = fitPts.map((p, i) => `${i ? 'L' : 'M'}${xSw(p.Sw).toFixed(1)},${yJ(p.J).toFixed(1)}`).join(' ');

  return (
    <PanelShell
      title="J-function explorer"
      subtitle="Lab Pc curves on the left, an order of magnitude apart; the same points collapsed to J(Sw) on the right, with the fitted power law scaled back to the Ekene reservoir rock in the tiles."
    >
      {controls}

      <div className="grid gap-3 lg:grid-cols-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#334155" />
          <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#334155" />
          {shown.map((p, i) => (
            <path key={p.name} d={pcPath(p.pcRows)} fill="none" stroke={shownColors[i]} strokeWidth="1.6" />
          ))}
          {shown.map((p, i) => (
            <text key={p.name} x={PAD.left + 8} y={PAD.top + 11 + 13 * i} fontSize="10" fill={shownColors[i]}>
              {p.name} ({p.system})
            </text>
          ))}
          <text x={W / 2} y={H - 8} fontSize="10" fill="#64748b" textAnchor="middle">Sw</text>
          <text x={14} y={H / 2} fontSize="10" fill="#64748b" transform={`rotate(-90 14 ${H / 2})`} textAnchor="middle">lab Pc (psi, log axis)</text>
        </svg>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#334155" />
          <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#334155" />
          <path d={fitPath} fill="none" stroke="#BFFF00" strokeWidth="1.4" />
          {shown.map((p, i) => p.jRows.map((r) => (
            <circle key={`${p.name}-${r.Sw}`} cx={xSw(r.Sw)} cy={yJ(r.J)} r="3.2" fill="none" stroke={shownColors[i]} strokeWidth="1.2" />
          )))}
          <text x={PAD.left + 8} y={PAD.top + 11} fontSize="10" fill="#BFFF00">
            fit J = {sci(fit.a, 4)} Sw*^(-{sci(fit.b, 4)}), Swirr {Swirr}
          </text>
          <text x={W / 2} y={H - 8} fontSize="10" fill="#64748b" textAnchor="middle">Sw</text>
          <text x={14} y={H / 2} fontSize="10" fill="#64748b" transform={`rotate(-90 14 ${H / 2})`} textAnchor="middle">J (dimensionless)</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Reservoir psi per unit J" value={sci(cap.psiPerJ, 9)} unit="psi" />
        <Tile label="Fitted a" value={sci(fit.a, 9)} />
        <Tile label="Fitted b" value={sci(fit.b, 9)} />
        <Tile label="Entry Pc (reservoir)" value={sci(cap.pcEntryPsi, 9)} unit="psi" />
        <Tile label="Entry height" value={sci(cap.hEntryM, 9)} unit="m" />
        <Tile label="Free water level" value={fmt(cap.fwlM, 4)} unit="m TVD" />
        <Tile label="Sw at the crest" value={sci(cap.swAtCrest, 9)} />
        <Tile label="Fit r2 (log space)" value={sci(fit.r2Log, 6)} />
      </TileGrid>

      <Note>
        Three different laboratories measured three different Pc curves on the same rock type, and
        every one of them collapses onto the same J curve: pick a single plug and the fit does not
        change. The tiles carry the collapse back to the field: the mapped 1560 m contact is where
        Sw reaches 1, the free water level sits one entry height below it, and the crest of the
        structure drains to the booking saturation. Move Swirr off 0.25 and watch the fitted
        exponent absorb the distortion of the normalized axis.
      </Note>
    </PanelShell>
  );
};

export default JFunctionExplorer;
