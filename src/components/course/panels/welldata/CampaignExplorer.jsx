import React, { useMemo, useState } from 'react';
import { TEACHING_FILES, computeAdvanced } from '@/lib/welldataTeaching';
import { parseLas } from '@petrolord/engines/engines/welldata/lasParse.js';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Campaign explorer: all six teaching files at once, with each aggregate
// shown beside the composition behind it. The point of the tier is that
// a total hides what it is made of, so the per-curve breakdown of the
// null count is one click away rather than buried.
const fmt = (v) => (Number.isFinite(v) ? String(v) : '-');

const A = computeAdvanced();

function curveBreakdown(fileId) {
  const f = TEACHING_FILES.find((x) => x.id === fileId);
  const parsed = parseLas(f.text);
  const rows = [];
  for (let i = 1; i < parsed.curves.length; i++) {
    const c = parsed.curves[i];
    let finite = 0;
    for (const v of c.data) if (Number.isFinite(v)) finite += 1;
    rows.push({
      mnemonic: c.mnemonic, unit: c.unit, n: c.data.length,
      nulls: c.data.length - finite, dead: finite === 0,
    });
  }
  return { nullValue: parsed.nullValue, rows };
}

const CampaignExplorer = () => {
  const [openFile, setOpenFile] = useState('nullheavy_20');
  const detail = useMemo(() => curveBreakdown(openFile), [openFile]);
  const detailTotal = detail.rows.reduce((s, r) => s + r.nulls, 0);

  return (
    <PanelShell title="Campaign explorer"
      subtitle={`All ${A.perFile.length} teaching files through the import pipeline at once. Every aggregate below is shown beside the composition behind it.`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2 pr-4">file</th>
              <th className="text-left py-2 pr-4">curves</th>
              <th className="text-left py-2 pr-4">converted</th>
              <th className="text-left py-2 pr-4">uniform step</th>
              <th className="text-left py-2 pr-4">dead</th>
              <th className="text-left py-2 pr-4">nulls</th>
              <th className="text-left py-2">samples</th>
            </tr>
          </thead>
          <tbody>
            {A.perFile.map((f) => (
              <tr key={f.id} className="border-b border-gray-800 cursor-pointer hover:bg-gray-800"
                onClick={() => setOpenFile(f.id)}>
                <td className={`py-2 pr-4 ${openFile === f.id ? 'text-[#BFFF00] font-semibold' : 'text-white'}`}>{f.label}</td>
                <td className="py-2 pr-4 text-gray-300">{f.curves}</td>
                <td className={`py-2 pr-4 ${f.converted ? 'text-[#BFFF00] font-semibold' : 'text-gray-500'}`}>
                  {f.converted ? 'YES' : 'no'}
                </td>
                <td className={`py-2 pr-4 ${f.uniform ? 'text-gray-500' : 'text-[#f472b6] font-semibold'}`}>
                  {f.uniform ? 'yes' : 'NO'}
                </td>
                <td className={`py-2 pr-4 ${f.dead ? 'text-[#f472b6] font-semibold' : 'text-gray-500'}`}>{f.dead}</td>
                <td className="py-2 pr-4 text-gray-300">{f.nulls}</td>
                <td className="py-2 text-gray-300">{f.samples}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-gray-600">
              <td className="py-2 pr-4 text-[#BFFF00] font-semibold">campaign</td>
              <td className="py-2 pr-4 text-[#BFFF00] font-semibold">{A.campaignCurves}</td>
              <td className="py-2 pr-4 text-[#BFFF00] font-semibold">{A.convertedFiles}</td>
              <td className="py-2 pr-4 text-[#BFFF00] font-semibold">{A.uniformFiles} of {A.perFile.length}</td>
              <td className="py-2 pr-4 text-[#BFFF00] font-semibold">{A.deadCurves}</td>
              <td className="py-2 pr-4 text-gray-500">see below</td>
              <td className="py-2 text-gray-500"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500">
        Click any file above to open its per-curve composition.
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2 pr-4">{openFile}: curve</th>
              <th className="text-left py-2 pr-4">unit</th>
              <th className="text-left py-2 pr-4">nulls</th>
              <th className="text-left py-2 pr-4">of samples</th>
              <th className="text-left py-2">verdict</th>
            </tr>
          </thead>
          <tbody>
            {detail.rows.map((r) => (
              <tr key={r.mnemonic} className="border-b border-gray-800">
                <td className="py-2 pr-4 text-white">{r.mnemonic}</td>
                <td className="py-2 pr-4 text-gray-300">{r.unit}</td>
                <td className={`py-2 pr-4 ${r.dead ? 'text-[#f472b6] font-semibold' : 'text-gray-300'}`}>{r.nulls}</td>
                <td className="py-2 pr-4 text-gray-300">{r.n}</td>
                <td className={`py-2 ${r.dead ? 'text-[#f472b6] font-semibold' : 'text-gray-500'}`}>
                  {r.dead ? 'DEAD, no finite samples' : r.nulls > 0 ? 'scattered nulls' : 'complete'}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-gray-600">
              <td className="py-2 pr-4 text-[#BFFF00] font-semibold">total</td>
              <td className="py-2 pr-4 text-gray-500">NULL {fmt(detail.nullValue)}</td>
              <td className="py-2 pr-4 text-[#BFFF00] font-semibold">{detailTotal}</td>
              <td className="py-2 pr-4 text-gray-500"></td>
              <td className="py-2 text-gray-500"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <TileGrid>
        <Tile label="Curves imported" value={String(A.campaignCurves)} unit="depth excluded" />
        <Tile label="Files needing conversion" value={String(A.convertedFiles)} unit="count" />
        <Tile label="Dead curves" value={String(A.deadCurves)} unit="count" />
        <Tile label="Files with a uniform step" value={String(A.uniformFiles)} unit={`of ${A.perFile.length}`} />
        <Tile label="wrapped_12 depth samples" value={String(A.wrappedSamples)} unit="samples" />
        <Tile label="nullheavy_20 flagged nulls" value={String(A.nullheavyNulls)} unit="count" />
      </TileGrid>

      <Note>
        Open nullheavy_20 in the lower table. Its 272 nulls are not 272 scattered bad readings: 201
        of them are NPHI, which has no finite sample at all and is the campaign's one dead curve,
        and only 71 are scattered nulls inside a GR that does have data. Those are two different
        findings with two different responses, and the single number 272 shows neither. Every
        aggregate on this panel behaves the same way, which is why each one is shown beside what it
        is made of.
      </Note>
    </PanelShell>
  );
};

export default CampaignExplorer;
