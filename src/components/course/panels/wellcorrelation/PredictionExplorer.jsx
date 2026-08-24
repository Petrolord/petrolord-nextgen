import React, { useMemo, useState } from 'react';
import { TEACHING_WELLS, computeAdvanced } from '@/lib/correlationTeaching';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Prediction explorer: predict Ekene-4's missing TOP_B from a marker the
// learner chooses, and show BOTH estimates against each other. The
// spread between them is the point of the tier, so it is drawn rather
// than only tabulated.
const MARKERS = [
  { key: 'TOP_A', label: 'from TOP_A (layer-cake)' },
  { key: 'TOP_SAND', label: 'from TOP_SAND' },
];
const W = 560;
const H = 260;

const fmt = (v, d = 0) => (Number.isFinite(v) ? v.toFixed(d) : '-');
const pickOf = (w, n) => w.tops.find((t) => t.name === n)?.md_m ?? null;

const A = computeAdvanced();
const TARGET = TEACHING_WELLS.find((w) => w.tops.length === 3);

const PredictionExplorer = () => {
  const [marker, setMarker] = useState('TOP_A');

  const model = useMemo(() => {
    const carriers = TEACHING_WELLS.filter((w) => pickOf(w, 'TOP_B') != null);
    const intervals = carriers.map((w) => ({
      id: w.id, name: w.name, from: pickOf(w, marker), topB: pickOf(w, 'TOP_B'),
      interval: pickOf(w, 'TOP_B') - pickOf(w, marker),
    }));
    const mean = intervals.reduce((s, r) => s + r.interval, 0) / intervals.length;
    const anchor = pickOf(TARGET, marker);
    return { carriers, intervals, mean, anchor, prediction: anchor + mean };
  }, [marker]);

  const lo = Math.min(A.w4TopBLayercake, A.w4TopBFromSand);
  const hi = Math.max(A.w4TopBLayercake, A.w4TopBFromSand);
  const axLo = lo - 20;
  const axHi = hi + 20;
  const sx = (d) => 40 + ((d - axLo) / (axHi - axLo)) * (W - 80);

  return (
    <PanelShell title="Prediction explorer"
      subtitle={`${TARGET.name} reached total depth above TOP_B. Predict it from a marker the well does have, using the three wells that carry TOP_B.`}>
      <div className="flex flex-wrap gap-2">
        {MARKERS.map((m) => (
          <button key={m.key} type="button" onClick={() => setMarker(m.key)}
            className={`px-3 py-1.5 rounded-md border text-sm ${marker === m.key
              ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'
              : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2 pr-4">well</th>
              <th className="text-left py-2 pr-4">{marker}</th>
              <th className="text-left py-2 pr-4">TOP_B</th>
              <th className="text-left py-2">{marker} to TOP_B</th>
            </tr>
          </thead>
          <tbody>
            {model.intervals.map((r) => (
              <tr key={r.id} className="border-b border-gray-800">
                <td className="py-2 pr-4 text-white">{r.name}</td>
                <td className="py-2 pr-4 text-gray-300">{r.from}</td>
                <td className="py-2 pr-4 text-gray-300">{r.topB}</td>
                <td className="py-2 text-gray-300">{fmt(r.interval)}</td>
              </tr>
            ))}
            <tr className="border-b border-gray-800">
              <td className="py-2 pr-4 text-[#BFFF00]">{TARGET.name}</td>
              <td className="py-2 pr-4 text-[#BFFF00]">{model.anchor}</td>
              <td className="py-2 pr-4 text-[#f472b6]">missing</td>
              <td className="py-2 text-gray-500">mean {fmt(model.mean)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 460 }} role="img"
          aria-label="The two TOP_B predictions and the spread between them">
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          <text x="40" y="24" fill="#e2e8f0" fontSize="10">Both estimates of {TARGET.name} TOP_B</text>
          <line x1={sx(axLo)} y1="120" x2={sx(axHi)} y2="120" stroke="#334155" strokeWidth="1.5" />
          <rect x={sx(lo)} y="104" width={sx(hi) - sx(lo)} height="32" fill="#BFFF00" fillOpacity="0.14" />
          <line x1={sx(lo)} y1="96" x2={sx(lo)} y2="144" stroke="#38bdf8" strokeWidth="2" />
          <line x1={sx(hi)} y1="96" x2={sx(hi)} y2="144" stroke="#f472b6" strokeWidth="2" />
          <text x={sx(A.w4TopBLayercake)} y="88" fill="#38bdf8" fontSize="10" textAnchor="middle">
            {fmt(A.w4TopBLayercake)} from TOP_A
          </text>
          <text x={sx(A.w4TopBFromSand)} y="164" fill="#f472b6" fontSize="10" textAnchor="middle">
            {fmt(A.w4TopBFromSand)} from TOP_SAND
          </text>
          <text x={(sx(lo) + sx(hi)) / 2} y="196" fill="#BFFF00" fontSize="11" textAnchor="middle">
            spread {fmt(A.predictionSpread)} m
          </text>
          <text x={(sx(lo) + sx(hi)) / 2} y="214" fill="#94a3b8" fontSize="9" textAnchor="middle">
            this band is the uncertainty, not a rounding
          </text>
          <text x="40" y={H - 12} fill="#64748b" fontSize="9">measured depth, m</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Wells carrying TOP_B" value={String(model.carriers.length)} unit="of 4" />
        <Tile label={`Mean ${marker} to TOP_B`} value={fmt(model.mean)} unit="m" />
        <Tile label={`${TARGET.name} ${marker}`} value={String(model.anchor)} unit="m" />
        <Tile label="Prediction from this marker" value={fmt(model.prediction)} unit="m" />
        <Tile label="Mean TOP_A to TOP_B" value={fmt(A.aToBMean)} unit="m" />
        <Tile label="Mean TOP_SAND to TOP_B" value={fmt(A.sandToBMean)} unit="m" />
        <Tile label="Layer-cake estimate" value={fmt(A.w4TopBLayercake)} unit="m" />
        <Tile label="From TOP_SAND estimate" value={fmt(A.w4TopBFromSand)} unit="m" />
        <Tile label="Spread between them" value={fmt(A.predictionSpread)} unit="m" />
        <Tile label="TOP_B structural relief" value={fmt(A.topBRelief)} unit="m (3 wells)" />
      </TileGrid>

      <Note>
        Two defensible methods on the same three wells land {fmt(A.predictionSpread)} m apart. That
        gap is the measured uncertainty on a pick nobody logged, and it exists because the section
        grows. Note the two right-hand tiles are different quantities: the spread is how much the
        two predictions disagree, while the relief is how much TOP_B itself moves structurally
        across the wells that have it. Quoting the relief as the error bar is the classic mistake.
      </Note>
    </PanelShell>
  );
};

export default PredictionExplorer;
