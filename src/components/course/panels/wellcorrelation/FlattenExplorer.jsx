import React, { useMemo, useState } from 'react';
import { TEACHING_WELLS, INTERMEDIATE_DATUM } from '@/lib/correlationTeaching';
import { PanelShell, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Flatten explorer: pick a flattening top and a datum, and read the
// shifts, displayed depths and the growth range. Intervals are shown
// beside displayed depths on purpose, because the tier turns on
// intervals surviving the shift while displayed depths do not.
const TOPS = ['TOP_A', 'TOP_SAND', 'BASE_SAND', 'TOP_B'];
const W = 560;
const H = 300;
const PAD = { left: 54, top: 26, right: 16, bottom: 28 };

const fmt = (v, d = 0) => (Number.isFinite(v) ? v.toFixed(d) : '-');
const pickOf = (w, name) => w.tops.find((t) => t.name === name)?.md_m ?? null;

const FlattenExplorer = () => {
  const [topName, setTopName] = useState(INTERMEDIATE_DATUM.topName);
  const [datum, setDatum] = useState(String(INTERMEDIATE_DATUM.datumM));

  const datumM = Number(datum);
  const ok = Number.isFinite(datumM) && datumM >= 1000 && datumM <= 2000;

  const rows = useMemo(() => {
    if (!ok) return null;
    return TEACHING_WELLS.map((w) => {
      const anchor = pickOf(w, topName);
      const shift = anchor == null ? null : datumM - anchor;
      const a = pickOf(w, 'TOP_A');
      const s = pickOf(w, 'TOP_SAND');
      return {
        id: w.id,
        name: w.name,
        anchor,
        shift,
        aToSand: a != null && s != null ? s - a : null,
        tops: w.tops.map((t) => ({
          name: t.name, md: t.md_m, displayed: shift == null ? null : t.md_m + shift,
        })),
        allFour: w.tops.length === 4,
      };
    });
  }, [topName, datumM, ok]);

  if (!rows) {
    return (
      <PanelShell title="Flatten explorer" subtitle="Enter a datum between 1000 and 2000 m.">
        <NumField label="Datum (m)" value={datum} onChange={setDatum} />
        <Note>The datum must be a number in that range.</Note>
      </PanelShell>
    );
  }

  const shown = rows.flatMap((r) => r.tops.map((t) => t.displayed)).filter((v) => v != null);
  const dMin = Math.min(...shown);
  const dMax = Math.max(...shown);
  const spanM = dMax - dMin;
  const intervals = rows.map((r) => r.aToSand).filter((v) => v != null);
  const growth = intervals.length ? Math.max(...intervals) - Math.min(...intervals) : null;
  const missing = rows.filter((r) => r.anchor == null).length;

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const colX = (i) => PAD.left + (i + 0.5) * (plotW / rows.length);
  const sy = (d) => PAD.top + ((d - dMin) / Math.max(1, dMax - dMin)) * plotH;
  const COLORS = { TOP_A: '#BFFF00', TOP_SAND: '#38bdf8', BASE_SAND: '#a78bfa', TOP_B: '#f472b6' };

  return (
    <PanelShell title="Flatten explorer"
      subtitle={`The four Ekene wells flattened on ${topName} at a ${fmt(datumM)} m datum. The capstone flattens on TOP_A at 1450 m.`}>
      <div className="flex flex-wrap gap-2 items-end">
        {TOPS.map((t) => (
          <button key={t} type="button" onClick={() => setTopName(t)}
            className={`px-3 py-1.5 rounded-md border text-sm ${topName === t
              ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'
              : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
            {t}
          </button>
        ))}
        <NumField label="Datum (m)" value={datum} onChange={setDatum} />
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 460 }} role="img"
          aria-label={`Section flattened on ${topName} at ${fmt(datumM)} m`}>
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          {TOPS.map((tn) => {
            const pts = rows
              .map((r, i) => ({ r, i, t: r.tops.find((x) => x.name === tn) }))
              .filter((p) => p.t && p.t.displayed != null)
              .map((p) => `${colX(p.i)},${sy(p.t.displayed)}`);
            return pts.length > 1 ? (
              <polyline key={tn} points={pts.join(' ')} fill="none" stroke={COLORS[tn]} strokeWidth="1.6" opacity="0.9" />
            ) : null;
          })}
          {rows.map((r, i) => (
            <g key={r.id}>
              <line x1={colX(i)} y1={PAD.top} x2={colX(i)} y2={H - PAD.bottom} stroke="#334155" strokeWidth="1" />
              <text x={colX(i)} y={PAD.top - 10} fill="#e2e8f0" fontSize="9" textAnchor="middle">{r.name}</text>
              {r.tops.map((t) => (t.displayed == null ? null : (
                <circle key={t.name} cx={colX(i)} cy={sy(t.displayed)} r="3" fill={COLORS[t.name]} />
              )))}
            </g>
          ))}
          <text x="10" y={sy(dMin) + 3} fill="#64748b" fontSize="9">{fmt(dMin)}</text>
          <text x="10" y={sy(dMax) + 3} fill="#64748b" fontSize="9">{fmt(dMax)}</text>
          <text x={W - 12} y={H - 10} fill="#64748b" fontSize="9" textAnchor="end">displayed depth, m</text>
        </svg>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2 pr-4">well</th>
              <th className="text-left py-2 pr-4">{topName} pick</th>
              <th className="text-left py-2 pr-4">shift</th>
              <th className="text-left py-2 pr-4">TOP_SAND displayed</th>
              <th className="text-left py-2 pr-4">A to SAND</th>
              <th className="text-left py-2">all four tops</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-gray-800">
                <td className="py-2 pr-4 text-white">{r.name}</td>
                <td className="py-2 pr-4 text-gray-300">{r.anchor ?? 'missing'}</td>
                <td className="py-2 pr-4 text-gray-300">{r.shift == null ? '-' : fmt(r.shift)}</td>
                <td className="py-2 pr-4 text-gray-300">
                  {fmt(r.tops.find((t) => t.name === 'TOP_SAND')?.displayed)}
                </td>
                <td className="py-2 pr-4 text-gray-300">{fmt(r.aToSand)}</td>
                <td className={`py-2 ${r.allFour ? 'text-gray-500' : 'text-[#f472b6] font-semibold'}`}>
                  {r.allFour ? 'yes' : 'no, TOP_B missing'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TileGrid>
        <Tile label="Flattening top" value={topName} />
        <Tile label="Datum" value={fmt(datumM)} unit="m" />
        <Tile label="Wells with all four tops" value={String(rows.filter((r) => r.allFour).length)} unit="count" />
        <Tile label="Wells missing the flattening top" value={String(missing)} unit="count" />
        <Tile label="A to SAND growth range" value={growth == null ? '-' : fmt(growth)} unit="m" />
        <Tile label="Displayed span" value={fmt(spanM)} unit="m" />
        <Tile label="Shallowest displayed" value={fmt(dMin)} unit="m" />
        <Tile label="Deepest displayed" value={fmt(dMax)} unit="m" />
      </TileGrid>

      <Note>
        Every well's flattening top lands on the datum by construction, which is what makes the
        shift one subtraction. Watch the A to SAND column as you change the datum: it does not move,
        because both ends of an interval carry the same shift. That is why flattening is safe to do
        and why the growth range is a property of the section rather than of your datum choice.
      </Note>
    </PanelShell>
  );
};

export default FlattenExplorer;
