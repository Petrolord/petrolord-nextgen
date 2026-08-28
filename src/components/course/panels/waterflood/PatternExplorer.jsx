import React, { useMemo, useState } from 'react';
import {
  patternLedger, patternAdvice, allocationAudit, fieldLedger, PATTERNS,
} from './floodLab';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Pattern explorer: the same flood split by allocation. The field line never
// moves; the pattern line does, and the gap between them is the argument for
// pattern-level surveillance. Advice is withheld rather than faked when a
// pattern has no allocation routed to it.

const W = 640;
const H = 280;
const PAD = { left: 46, top: 14, right: 16, bottom: 34 };

const fmt = (v, d = 4) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d }) : '-');

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

const PatternExplorer = () => {
  const [name, setName] = useState(PATTERNS[0].name);
  const [target, setTarget] = useState(1.0);
  const [win, setWin] = useState(3);

  const out = useMemo(() => {
    try {
      return {
        pat: patternLedger(name, { window: win }),
        advice: patternAdvice(name, { targetVRR: target, windowPeriods: win }),
        audit: allocationAudit(),
        field: fieldLedger(),
      };
    } catch (e) {
      return { error: e.message };
    }
  }, [name, target, win]);

  if (out.error) return <PanelShell title="Pattern explorer"><Note>Engine error: {out.error}</Note></PanelShell>;
  const { pat, advice, audit, field } = out;

  const n = field.series.length;
  const vMin = 0.4;
  const vMax = 1.45;
  const x = (i) => PAD.left + (i / (n - 1)) * (W - PAD.left - PAD.right);
  const y = (v) => H - PAD.bottom - ((v - vMin) / (vMax - vMin)) * (H - PAD.top - PAD.bottom);
  const line = (vals) => vals
    .map((v, i) => (v == null ? '' : `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`))
    .join(' ')
    .trim()
    .replace(/^L/, 'M');

  const totalAlloc = Object.values(audit.perProducer).reduce((s, v) => s + v.winj_stb, 0) + audit.unallocated.winj_stb;
  const bars = [
    ...Object.entries(audit.perProducer).map(([k, v]) => ({ label: k, value: v.winj_stb })),
    { label: 'out of zone', value: audit.unallocated.winj_stb },
  ];

  return (
    <PanelShell
      title="Pattern explorer"
      subtitle="One flood, two elements. The field cumulative VRR is the pink line and does not move; the pattern is the lime line."
    >
      <div className="grid gap-4 sm:grid-cols-3 items-end">
        <div>
          <p className="text-gray-400 text-xs mb-1">Pattern</p>
          <select
            value={name} onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md text-white text-xs px-2 py-1.5"
          >
            {PATTERNS.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
            <option value="Unrouted element">Unrouted element (no allocation)</option>
          </select>
        </div>
        <RangeField label="Target VRR" value={target} min={0.8} max={1.3} step={0.05} onChange={setTarget} />
        <RangeField label="Rolling window (periods)" value={win} min={1} max={6} step={1} onChange={setWin} />
      </div>

      {pat ? (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
          {[0.6, 0.8, 1.0, 1.2, 1.4].map((v) => (
            <g key={v}>
              <line x1={PAD.left} y1={y(v)} x2={W - PAD.right} y2={y(v)} stroke="#334155" strokeWidth="1" />
              <text x={PAD.left - 6} y={y(v) + 4} textAnchor="end" fill="#94A3B8" fontSize="10">{v.toFixed(1)}</text>
            </g>
          ))}
          <line x1={PAD.left} y1={y(target)} x2={W - PAD.right} y2={y(target)} stroke="#BFFF00" strokeWidth="1" strokeDasharray="5 4" opacity="0.6" />
          <path d={line(field.series.map((r) => r.cumulativeVRR))} fill="none" stroke="#F472B6" strokeWidth="2" />
          <path d={line(pat.series.map((r) => r.cumulativeVRR))} fill="none" stroke="#BFFF00" strokeWidth="2" />
          <path d={line(pat.rolling)} fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.75" />
          <text x={PAD.left} y={H - 10} fill="#94A3B8" fontSize="10">{field.series[0].label}</text>
          <text x={W - PAD.right} y={H - 10} textAnchor="end" fill="#94A3B8" fontSize="10">{field.series[n - 1].label}</text>
        </svg>
      ) : (
        <Note>No pattern by that name is defined in the fixture.</Note>
      )}

      <div className="mt-3">
        <p className="text-gray-400 text-xs mb-1">Where every injected barrel went ({fmt(totalAlloc, 0)} bbl)</p>
        <div className="flex w-full h-5 rounded overflow-hidden border border-gray-700">
          {bars.map((b, i) => (
            <div
              key={b.label}
              style={{ width: `${(b.value / totalAlloc) * 100}%`, background: b.label === 'out of zone' ? '#64748B' : ['#BFFF00', '#38BDF8', '#F472B6', '#FBBF24'][i % 4] }}
              title={`${b.label}: ${fmt(b.value, 0)} bbl`}
            />
          ))}
        </div>
      </div>

      <TileGrid>
        <Tile label="Field cumulative VRR" value={fmt(field.summary.cumulativeVRR, 6)} unit="rb/rb" />
        <Tile label="Pattern cumulative VRR" value={pat ? fmt(pat.cumulativeVRR, 6) : '-'} unit="rb/rb" />
        <Tile label={`Pattern rolling ${win}`} value={pat ? fmt(pat.rolling[pat.rolling.length - 1], 4) : '-'} unit="rb/rb" />
        <Tile label="Pattern fill-up" value={pat ? (pat.fillUp ? `${pat.fillUp.label}${pat.fillUp.startedAbove ? ' (started above)' : ''}` : 'never') : '-'} unit="" />
        <Tile label="Out-of-zone injection" value={fmt(audit.unallocated.winj_stb, 0)} unit="bbl" />
        <Tile label="Conservation residual" value={audit.residual} unit="bbl" />
        <Tile label="Advice scale" value={advice.withheld ? 'withheld' : fmt(advice.scale, 4)} unit={advice.clamped ? 'clamped' : ''} />
        <Tile label="Recommended injection" value={advice.withheld ? '-' : fmt(advice.recommendedWi, 1)} unit="bbl/period" />
      </TileGrid>

      {advice.withheld ? (
        <Note>Advice withheld: {advice.reason}</Note>
      ) : (
        <Note>
          Scaling recent allocated injection by {fmt(advice.scale, 4)} toward a target of {fmt(target, 2)}
          {advice.clamped ? ' (the raw scale was outside the 0.5 to 2.0 band and has been clamped, which the engine reports rather than hides)' : ''}.
          {advice.perInjector.map((p) => ` ${p.well} ${fmt(p.currentWi, 0)} to ${fmt(p.recommendedWi, 0)} bbl.`).join('')}
        </Note>
      )}
    </PanelShell>
  );
};

export default PatternExplorer;
