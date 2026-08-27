import React, { useMemo, useState } from 'react';
import { displacementWith, textbookCase, btDaysAt, EKENE_SCAL } from './scalLab';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Displacement explorer: the Ekene rel-perm set through the real
// fractional-flow engine, with the Welge tangent drawn from (Swc, 0). The
// sliders bend the fw curve one factor at a time; the textbook preset swaps
// in the classroom hand case (M = 4, closed forms at Sw 0.5).

const W = 620;
const H = 320;
const PAD = { left: 52, top: 16, right: 16, bottom: 40 };

const fmt = (v, d = 4) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d }) : '-');
const sci = (v, d = 6) => (Number.isFinite(v) ? Number(v).toPrecision(d) : '-');

const RangeField = ({ label, value, min, max, step, onChange, disabled }) => (
  <div>
    <p className="text-gray-400 text-xs mb-1">
      {label}: <span className="text-white">{value}</span>
    </p>
    <input
      type="range" min={min} max={max} step={step} value={value} disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-[#BFFF00] disabled:opacity-40"
    />
  </div>
);

const DisplacementExplorer = () => {
  const [muO, setMuO] = useState(EKENE_SCAL.design.muO_cp);
  const [nw, setNw] = useState(EKENE_SCAL.design.krSpec.nw);
  const [textbook, setTextbook] = useState(false);

  const out = useMemo(() => {
    try {
      const r = textbook ? textbookCase() : displacementWith({ muO, nw });
      const Swc = textbook ? r.spec.params.Swc : EKENE_SCAL.design.krSpec.Swc;
      const btDays = textbook ? null : btDaysAt(8000, r.bl.QiBt);
      return { r, Swc, btDays };
    } catch (e) {
      return { error: e.message };
    }
  }, [muO, nw, textbook]);

  if (out.error) return <PanelShell title="Displacement explorer"><Note>Engine error: {out.error}</Note></PanelShell>;
  const { r, Swc, btDays } = out;
  const { curves, bl } = r;

  const x = (Sw) => PAD.left + Sw * (W - PAD.left - PAD.right);
  const y = (v) => H - PAD.bottom - v * (H - PAD.top - PAD.bottom);
  const path = (key) => curves.map((c, i) => `${i ? 'L' : 'M'}${x(c.Sw).toFixed(1)},${y(c[key]).toFixed(1)}`).join(' ');

  return (
    <PanelShell
      title="Displacement explorer"
      subtitle="Corey rel perm to fractional flow to the Welge tangent. The tangent from (Swc, 0) touches the fw curve at the front saturation; where it reaches fw = 1 is the average saturation behind the front."
    >
      <div className="grid gap-4 sm:grid-cols-3 items-end">
        <RangeField label="Oil viscosity muO (cp)" value={muO} min={0.5} max={10} step={0.1} onChange={setMuO} disabled={textbook} />
        <RangeField label="Water Corey exponent nw" value={nw} min={1} max={4} step={0.1} onChange={setNw} disabled={textbook} />
        <button
          type="button" onClick={() => setTextbook((v) => !v)}
          className={`px-3 py-1.5 rounded-md border text-xs ${textbook ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}
        >
          {textbook ? 'Textbook case (M = 4) active' : 'Load the textbook case'}
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#334155" />
        <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#334155" />
        {[0, 0.25, 0.5, 0.75, 1].map((s) => (
          <text key={s} x={x(s)} y={H - PAD.bottom + 14} fontSize="9" fill="#64748b" textAnchor="middle">{s}</text>
        ))}
        {[0.25, 0.5, 0.75, 1].map((v) => (
          <text key={v} x={PAD.left - 6} y={y(v) + 3} fontSize="9" fill="#64748b" textAnchor="end">{v}</text>
        ))}
        <path d={path('krw')} fill="none" stroke="#38bdf8" strokeWidth="1.4" />
        <path d={path('kro')} fill="none" stroke="#f97316" strokeWidth="1.4" />
        <path d={path('fw')} fill="none" stroke="#BFFF00" strokeWidth="1.8" />
        {/* Welge tangent: from (Swc, 0) through the front to fw = 1 at SwAvgBt */}
        {Number.isFinite(bl.SwAvgBt) && (
          <line x1={x(Swc)} y1={y(0)} x2={x(bl.SwAvgBt)} y2={y(1)} stroke="#e2e8f0" strokeWidth="1.1" strokeDasharray="5 4" />
        )}
        {Number.isFinite(bl.Swf) && <circle cx={x(bl.Swf)} cy={y(bl.fwf)} r="4" fill="#e2e8f0" />}
        <text x={PAD.left + 8} y={PAD.top + 11} fontSize="10" fill="#38bdf8">krw</text>
        <text x={PAD.left + 8} y={PAD.top + 24} fontSize="10" fill="#f97316">kro</text>
        <text x={PAD.left + 8} y={PAD.top + 37} fontSize="10" fill="#BFFF00">fw</text>
        <text x={PAD.left + 8} y={PAD.top + 50} fontSize="10" fill="#e2e8f0">Welge tangent from (Swc, 0)</text>
        <text x={W / 2} y={H - 8} fontSize="10" fill="#64748b" textAnchor="middle">Sw, water saturation</text>
      </svg>

      <TileGrid>
        <Tile label="Mobility ratio M" value={sci(r.M, 6)} />
        <Tile label="Front saturation Swf" value={sci(bl.Swf, 6)} />
        <Tile label="fw at the front" value={sci(bl.fwf, 6)} />
        <Tile label="PV injected at breakthrough" value={sci(bl.QiBt, 6)} unit="PV" />
        <Tile label="Average Sw behind the front" value={sci(bl.SwAvgBt, 6)} />
        <Tile label="ED at breakthrough" value={sci(bl.EDbt, 6)} />
        <Tile label="ED ceiling (endpoints only)" value={sci(bl.EDmax, 6)} />
        <Tile label="Days to breakthrough at 8000 bwpd" value={btDays == null ? '-' : fmt(btDays, 1)} unit={btDays == null ? '' : 'days'} />
      </TileGrid>

      {textbook ? (
        <Note>
          The classroom case: M = 4 is unfavorable, so the front is low and early. At Sw 0.5 every
          number is closed form (krw 0.1, kro 0.25, fw 0.8), which is why this case is worked by
          hand before any engine is trusted. The days tile is blank because the pore volume
          belongs to the Ekene sand, not to this textbook rock.
        </Note>
      ) : (
        <Note>
          Raise the oil viscosity and watch the front saturation fall: a more mobile water phase
          races ahead and breaks through earlier, with less oil displaced when it does. The ED
          ceiling never moves with viscosity or exponents, only with the endpoints Swc and Sor.
          Days to breakthrough uses the fixture pore volume at a steady 8000 bwpd.
        </Note>
      )}
    </PanelShell>
  );
};

export default DisplacementExplorer;
