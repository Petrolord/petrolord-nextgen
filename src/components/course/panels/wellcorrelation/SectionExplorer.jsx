import React, { useMemo, useState } from 'react';
import {
  TEACHING_WELLS, ZONE, computeSection, structuralRelief, displayGr,
} from '@/lib/correlationTeaching';
import { depthToY, columnX } from '@petrolord/engines/engines/wellcorrelation/section.js';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Section explorer: the four-well Ekene section drawn from the central
// section engine, with the datum under the learner's control. Every
// number on screen (shifts, displayed depths, thicknesses, line reach)
// is produced by the choice the learner makes, so the capstone readings
// are earned rather than displayed.
const TOP_COLORS = {
  TOP_A: '#38bdf8',
  TOP_SAND: '#BFFF00',
  BASE_SAND: '#f59e0b',
  TOP_B: '#f472b6',
};

const W = 640;
const H = 320;
const PLOT = { left: 56, top: 24, width: W - 76, height: H - 56 };

const fmt = (v, d = 0) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const SectionExplorer = () => {
  const [mode, setMode] = useState('structural');
  const [topName, setTopName] = useState('TOP_SAND');
  const [datumM, setDatumM] = useState('1500');

  const datum = useMemo(() => (mode === 'structural'
    ? { mode: 'structural' }
    : { mode: 'flatten', topName, datumM: Number(datumM) }),
  [mode, topName, datumM]);

  const section = useMemo(() => {
    try {
      return computeSection(datum);
    } catch {
      return null;
    }
  }, [datum]);

  if (!section) {
    return (
      <PanelShell title="Section explorer" subtitle="Enter a finite datum depth to draw the section.">
        <Note>The datum depth must be a number.</Note>
      </PanelShell>
    );
  }

  const [viewTop, viewBase] = section.range;
  const pad = Math.max(4, (viewBase - viewTop) * 0.08);
  const vTop = viewTop - pad;
  const vBase = viewBase + pad;
  const n = TEACHING_WELLS.length;

  const yOf = (d) => depthToY(d, vTop, vBase, PLOT.top, PLOT.height);
  const xOf = (i) => columnX(i, n, PLOT.left, PLOT.width);

  // Display-only GR wiggle so the columns read as logs, never graded.
  const grPath = (well, i) => {
    const x0 = xOf(i);
    const pts = [];
    for (let d = vTop; d <= vBase; d += 2) {
      const shift = section.rows[i].shift ?? 0;
      const md = d - shift;
      const gr = displayGr(well, md);
      pts.push(`${x0 + (gr - 60) * 0.32},${yOf(d)}`);
    }
    return `M ${pts.join(' L ')}`;
  };

  const gridDepths = [];
  const step = (vBase - vTop) > 120 ? 50 : 25;
  for (let d = Math.ceil(vTop / step) * step; d <= vBase; d += step) gridDepths.push(d);

  return (
    <PanelShell title="Section explorer"
      subtitle="Four wells, four surfaces, one datum of your choosing. Switch between the structural view and a flattened view and watch what each one reveals.">
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <SelectField label="View" value={mode} onChange={setMode}
          options={[['structural', 'Structural (true MD)'], ['flatten', 'Flattened on a top']]} />
        <SelectField label="Datum top" value={topName} onChange={setTopName}
          options={section.topNames.map((t) => [t, t])} />
        <NumField label="Datum depth (m)" value={datumM} onChange={setDatumM} />
        <div className="text-xs text-gray-500">
          {mode === 'structural'
            ? 'Every well at true depth, no shifts.'
            : `${topName} pinned to ${datumM} m in every well that has it.`}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 480 }} role="img"
          aria-label="Well correlation section">
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          {gridDepths.map((d) => (
            <g key={d}>
              <line x1={PLOT.left - 8} y1={yOf(d)} x2={PLOT.left + PLOT.width} y2={yOf(d)}
                stroke="#334155" strokeDasharray="3 3" />
              <text x={PLOT.left - 12} y={yOf(d) + 3} fill="#64748b" fontSize="9" textAnchor="end">{d}</text>
            </g>
          ))}

          {/* SAND zone fill per well */}
          {section.rows.map((r, i) => (r.span ? (
            <rect key={`z${r.id}`} x={xOf(i) - 16} y={yOf(r.span.top)} width={32}
              height={Math.max(1, yOf(r.span.base) - yOf(r.span.top))}
              fill="#BFFF00" fillOpacity="0.12" />
          ) : null))}

          {/* GR character */}
          {TEACHING_WELLS.map((w, i) => (
            <path key={`gr${w.id}`} d={grPath(w, i)} stroke="#94a3b8" strokeWidth="1" fill="none" opacity="0.8" />
          ))}

          {/* correlation lines */}
          {section.polylines.map((pl) => (
            <g key={pl.name}>
              <polyline
                points={pl.points.map((p) => `${xOf(p.wellIndex)},${yOf(p.displayed)}`).join(' ')}
                fill="none" stroke={TOP_COLORS[pl.name] || '#e2e8f0'} strokeWidth="1.75" />
              {pl.points.map((p) => (
                <circle key={`${pl.name}${p.wellId}`} cx={xOf(p.wellIndex)} cy={yOf(p.displayed)} r="2.5"
                  fill={TOP_COLORS[pl.name] || '#e2e8f0'} />
              ))}
            </g>
          ))}

          {/* well headers */}
          {section.rows.map((r, i) => (
            <text key={`h${r.id}`} x={xOf(i)} y={14} fill="#e2e8f0" fontSize="10" textAnchor="middle">
              {r.name}
            </text>
          ))}
        </svg>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        {section.topNames.map((t) => (
          <span key={t} className="flex items-center gap-1.5 text-gray-400">
            <span style={{ background: TOP_COLORS[t] || '#e2e8f0' }} className="inline-block w-3 h-0.5" />
            {t}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="py-2 pr-4">Well</th>
              <th className="py-2 pr-4">Shift (m)</th>
              {section.topNames.map((t) => <th key={t} className="py-2 pr-4">{t}</th>)}
              <th className="py-2 pr-4">{ZONE.top} to {ZONE.base}</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {section.rows.map((r) => (
              <tr key={r.id} className="border-b border-gray-800">
                <td className="py-2 pr-4 text-white">{r.name}</td>
                <td className="py-2 pr-4">{r.shift === null ? 'not flattened' : fmt(r.shift)}</td>
                {section.topNames.map((t) => {
                  const hit = r.tops.find((x) => x.name === t);
                  return (
                    <td key={t} className={`py-2 pr-4 ${hit ? '' : 'text-red-400'}`}>
                      {hit ? fmt(hit.displayed) : 'missing'}
                    </td>
                  );
                })}
                <td className="py-2 pr-4">{r.thickness === null ? '-' : `${fmt(r.thickness)} m`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TileGrid>
        <Tile label="Displayed span" value={fmt(section.range[1] - section.range[0])} unit="m" />
        <Tile label={`${topName} structural relief`} value={fmt(structuralRelief(topName))} unit="m" />
        {section.polylines.map((pl) => (
          <Tile key={pl.name} label={`${pl.name} line reaches`} value={`${pl.points.length} of ${n}`} unit="wells" />
        ))}
      </TileGrid>

      <Note>
        Depths in the table are DISPLAYED depths for the current view, which equal true measured depth only in the structural view. Structural relief is a property of the rock, so it does not change with the datum. The gamma ray character is illustrative and is never graded.
      </Note>
    </PanelShell>
  );
};

export default SectionExplorer;
