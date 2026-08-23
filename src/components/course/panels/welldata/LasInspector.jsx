import React, { useMemo, useState } from 'react';
import { TEACHING_FILES, qcFile, headerRows } from '@/lib/welldataTeaching';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// LAS inspector: the six golden teaching files through the real parser,
// with the QC panel the capstone is read from. Shared by the Well Data
// Manager learning page and the DC5 lesson embeds. The learner drives
// the file choice; every number on screen is parsed live.
const num = (v, dp = 4) => (v == null || Number.isNaN(v) ? '-' : Number(v).toFixed(dp));

const LasInspector = () => {
  const [fileId, setFileId] = useState(TEACHING_FILES[0].id);
  const [showRaw, setShowRaw] = useState(false);

  const file = TEACHING_FILES.find((f) => f.id === fileId);
  const qc = useMemo(() => {
    try {
      return qcFile(file);
    } catch (e) {
      return { error: e.message };
    }
  }, [file]);

  const rawPreview = useMemo(
    () => file.text.split('\n').slice(0, 40).join('\n'),
    [file],
  );

  return (
    <PanelShell title="LAS inspector"
      subtitle="Load each teaching file with the real parser and read its QC panel. The capstone numbers are read from exactly these tiles and rows.">
      <div className="flex flex-wrap gap-2">
        {TEACHING_FILES.map((f) => (
          <button key={f.id} type="button" onClick={() => setFileId(f.id)}
            className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
              f.id === fileId
                ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'
                : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-400'
            }`}>
            {f.label}
          </button>
        ))}
      </div>
      <Note>{file.hint}</Note>

      {qc.error ? (
        <p className="text-red-400 text-sm mb-0">Parse failed: {qc.error}</p>
      ) : (
        <>
          <TileGrid>
            <Tile label="LAS version / wrap" value={`${qc.version} / ${qc.wrap}`} />
            <Tile label={`Depth range (${qc.depth.unit})`} value={`${num(qc.depth.first, 1)} to ${num(qc.depth.last, 1)}`} />
            <Tile label="Step (native / metres)" value={`${num(qc.depth.stepNative, 4)} ${qc.depth.unit} / ${num(qc.depth.stepM, 4)} m`} />
            <Tile label="Samples / NULL flag" value={`${qc.depth.nSamples} / ${qc.nullValue ?? '-'}`} />
          </TileGrid>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="py-2 pr-4">Curve</th><th className="py-2 pr-4">Unit</th>
                  <th className="py-2 pr-4">Samples</th><th className="py-2 pr-4">Nulls</th>
                  <th className="py-2 pr-4">First</th><th className="py-2 pr-4">Last</th>
                  <th className="py-2 pr-4">Mean (finite)</th>
                </tr>
              </thead>
              <tbody>
                {qc.curves.map((c) => (
                  <tr key={c.mnemonic} className={`border-b border-gray-800 ${c.nullCount === c.nSamples ? 'text-red-400' : 'text-gray-300'}`}>
                    <td className="py-2 pr-4 text-white">{c.mnemonic}</td>
                    <td className="py-2 pr-4">{c.unit}</td>
                    <td className="py-2 pr-4">{c.nSamples}</td>
                    <td className="py-2 pr-4">{c.nullCount}</td>
                    <td className="py-2 pr-4">{num(c.firstFinite)}</td>
                    <td className="py-2 pr-4">{num(c.lastFinite)}</td>
                    <td className="py-2 pr-4">{num(c.mean)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-gray-400">
              <tbody>
                {headerRows(qc.well).map((r) => (
                  <tr key={r.key} className="border-b border-gray-800/60">
                    <td className="py-1 pr-3 text-gray-500 font-mono">{r.key}</td>
                    <td className="py-1 pr-3">{String(r.value ?? '')} {r.unit}</td>
                    <td className="py-1">{r.descr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={() => setShowRaw((s) => !s)}
            className="text-xs text-[#BFFF00] hover:underline">
            {showRaw ? 'Hide raw file' : 'Show raw file (first 40 lines)'}
          </button>
          {showRaw && (
            <pre className="bg-[#0F172A] border border-gray-700 rounded-md p-3 overflow-x-auto text-xs text-gray-300 max-h-72 overflow-y-auto">
              {rawPreview}
            </pre>
          )}
        </>
      )}
    </PanelShell>
  );
};

export default LasInspector;
