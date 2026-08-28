import React, { useMemo, useState } from 'react';
import {
  ekeneDisplacement, fitLabGrid, dipCase, polymerCase, averageRefit,
  swAvgCrestColumn, EKENE_SCAL,
} from './scalLab';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Design explorer (Expert): three ways to interrogate the same displacement.
// Fit-the-lab recovers the Corey plant from the 13-row grid; the dip mode
// prices the gravity term at a chosen rate and angle; the polymer mode
// thickens the water and moves the front. The base Ekene fw curve stays on
// the plot throughout so every case is read against the same reference.

const W = 620;
const H = 320;
const PAD = { left: 52, top: 16, right: 16, bottom: 40 };

const sci = (v, d = 6) => (Number.isFinite(v) ? Number(v).toPrecision(d) : '-');

const RangeField = ({ label, value, min, max, step, onChange }) => (
  <div>
    <p className="text-gray-400 text-xs mb-1">
      {label}: <span className="text-white">{value}</span>
    </p>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-[#BFFF00]"
    />
  </div>
);

const DesignExplorer = () => {
  const [mode, setMode] = useState('fit');
  const [qt, setQt] = useState(2000);
  const [dip, setDip] = useState(10);
  const [mult, setMult] = useState(4);

  const out = useMemo(() => {
    try {
      const base = ekeneDisplacement();
      const context = { avgA: averageRefit().fit.a, swAvg: swAvgCrestColumn() };
      if (mode === 'fit') {
        const { fit } = fitLabGrid();
        if (!fit.ok) return { error: fit.errors.join('; ') };
        return { base, context, fit, caseOut: base };
      }
      if (mode === 'dip') {
        return { base, context, caseOut: dipCase(qt, dip) };
      }
      return { base, context, caseOut: polymerCase(mult) };
    } catch (e) {
      return { error: e.message };
    }
  }, [mode, qt, dip, mult]);

  if (out.error) return <PanelShell title="Design explorer"><Note>Engine error: {out.error}</Note></PanelShell>;
  const { base, context, fit, caseOut } = out;
  const Swc = EKENE_SCAL.design.krSpec.Swc;

  const x = (Sw) => PAD.left + Sw * (W - PAD.left - PAD.right);
  const y = (v) => H - PAD.bottom - v * (H - PAD.top - PAD.bottom);
  const fwPath = (curves) => curves.map((c, i) => `${i ? 'L' : 'M'}${x(c.Sw).toFixed(1)},${y(c.fw).toFixed(1)}`).join(' ');
  const tangent = (bl, stroke) => (Number.isFinite(bl.SwAvgBt) ? (
    <line x1={x(Swc)} y1={y(0)} x2={x(bl.SwAvgBt)} y2={y(1)} stroke={stroke} strokeWidth="1" strokeDasharray="5 4" opacity="0.85" />
  ) : null);

  const caseLabel = mode === 'fit' ? 'fitted Corey (overlays the base)' : mode === 'dip' ? `dip ${dip} deg at ${qt} rb/d` : `polymer, muW x ${mult}`;

  return (
    <PanelShell
      title="Design explorer"
      subtitle="The base Ekene fw curve against a designed case, each with its own Welge tangent. Fit the lab grid, tilt the sand, or thicken the water."
    >
      <div className="grid gap-4 sm:grid-cols-3 items-end">
        <SelectField
          label="Mode"
          value={mode}
          onChange={setMode}
          options={[['fit', 'Fit the lab grid'], ['dip', 'Gravity / dip'], ['polymer', 'Polymer screening']]}
        />
        {mode === 'dip' && (
          <>
            <RangeField label="Total rate qt (rb/d)" value={qt} min={500} max={8000} step={100} onChange={setQt} />
            <RangeField label="Dip angle (deg, updip positive)" value={dip} min={-10} max={10} step={1} onChange={setDip} />
          </>
        )}
        {mode === 'polymer' && (
          <RangeField label="Water viscosity multiplier" value={mult} min={1} max={6} step={0.5} onChange={setMult} />
        )}
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
        {tangent(base.bl, '#64748b')}
        {tangent(caseOut.bl, '#BFFF00')}
        <path d={fwPath(base.curves)} fill="none" stroke="#64748b" strokeWidth="1.4" />
        <path d={fwPath(caseOut.curves)} fill="none" stroke="#BFFF00" strokeWidth="1.8" />
        <circle cx={x(base.bl.Swf)} cy={y(base.bl.fwf)} r="3.5" fill="#64748b" />
        {Number.isFinite(caseOut.bl.Swf) && <circle cx={x(caseOut.bl.Swf)} cy={y(caseOut.bl.fwf)} r="3.5" fill="#BFFF00" />}
        <text x={PAD.left + 8} y={PAD.top + 11} fontSize="10" fill="#64748b">base Ekene fw</text>
        <text x={PAD.left + 8} y={PAD.top + 24} fontSize="10" fill="#BFFF00">{caseLabel}</text>
        <text x={W / 2} y={H - 8} fontSize="10" fill="#64748b" textAnchor="middle">Sw, water saturation</text>
      </svg>

      <TileGrid>
        {mode === 'fit' && (
          <>
            <Tile label="Fitted nw (plant 2.5)" value={sci(fit.params.nw, 12)} />
            <Tile label="Fitted no (plant 2.0)" value={sci(fit.params.no, 12)} />
            <Tile label="RMS log residual" value={sci(fit.rmsLog, 4)} />
            <Tile label="Points used (of 26)" value={fit.pointsUsed} />
          </>
        )}
        {mode === 'dip' && (
          <>
            <Tile label="Gravity coefficient" value={sci(caseOut.gCoef, 9)} />
            <Tile label="Front saturation Swf" value={sci(caseOut.bl.Swf, 6)} />
            <Tile label="ED at breakthrough" value={sci(caseOut.bl.EDbt, 9)} />
            <Tile label="Delta EDbt vs flat" value={sci(caseOut.bl.EDbt - base.bl.EDbt, 4)} />
          </>
        )}
        {mode === 'polymer' && (
          <>
            <Tile label="Effective water viscosity" value={sci(caseOut.muWeff, 6)} unit="cp" />
            <Tile label="Mobility ratio M" value={sci(caseOut.M, 6)} />
            <Tile label="ED at breakthrough" value={sci(caseOut.bl.EDbt, 9)} />
            <Tile label="Delta EDbt vs base" value={sci(caseOut.bl.EDbt - base.bl.EDbt, 4)} />
          </>
        )}
        <Tile label="Averaged-refit a (design 0.25)" value={sci(context.avgA, 9)} />
        <Tile label="Crest-column average Sw" value={sci(context.swAvg, 9)} />
      </TileGrid>

      {caseOut.warnings?.length > 0 && (
        <Note>Engine warning: {caseOut.warnings.join(' ')}</Note>
      )}

      {mode === 'fit' && (
        <Note>
          The fit reads 24 log-space points (the two endpoint zeros are definitional and sit under
          the kr floor) and recovers the planted exponents to machine precision, because the grid
          is noise free. The two context tiles are the honest numbers of this tier: the averaged
          J refit drifts off the design 0.25 through log-linear resampling, and the crest column
          averages far wetter than the flat 0.35 booking.
        </Note>
      )}
      {mode === 'dip' && (
        <Note>
          The gravity term scales with one over the rate: at 2000 rb/d the dip is worth about
          0.0007 in EDbt either side of flat, and at field rate it nearly vanishes. Updip
          displacement holds the water back and lands the front slightly higher; downdip does the
          opposite. Sign discipline matters more than magnitude here.
        </Note>
      )}
      {mode === 'polymer' && (
        <Note>
          Thickened water drops the mobility ratio below one and moves the front saturation up
          sharply, but the ED ceiling does not move: endpoints rule the ultimate, polymer only
          buys it earlier. The engine flags this path as screening only, and the warning above is
          its own words.
        </Note>
      )}
    </PanelShell>
  );
};

export default DesignExplorer;
