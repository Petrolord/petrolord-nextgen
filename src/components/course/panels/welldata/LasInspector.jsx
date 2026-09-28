import React, { useMemo, useState } from 'react';
import { TEACHING_FILES, qcFile, headerRows } from '@/lib/welldataTeaching';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import UserLasPicker, { mergeFiles } from './UserLasPicker';
import { useThemeClass } from '@/design/themeClass';

// LAS inspector: the six golden teaching files through the real parser,
// with the QC panel. Shared by the Well Data Manager learning page and the
// DC5 lesson embeds. The learner drives the file choice; every number on
// screen is parsed live. It opens on a teaching file; the capstone case files
// are never preloaded, and appear only when the learner opens them.
const num = (v, dp = 4) => (v == null || Number.isNaN(v) ? '-' : Number(v).toFixed(dp));

const LasInspector = () => {
  const tc = useThemeClass();
  const [fileId, setFileId] = useState(TEACHING_FILES[0].id);
  const [showRaw, setShowRaw] = useState(false);
  const [userFiles, setUserFiles] = useState([]);

  const allFiles = [...TEACHING_FILES, ...userFiles];
  const file = allFiles.find((f) => f.id === fileId) || TEACHING_FILES[0];
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
      subtitle="Load each file with the real parser and read its QC panel. The capstone asks for the same tiles and rows on its own case files: download them from the capstone card and open them here.">
      <UserLasPicker onFiles={(files) => { setUserFiles((prev) => mergeFiles(prev, files)); setFileId(files[0].id); }} />
      <div className="flex flex-wrap gap-2">
        {allFiles.map((f) => (
          <button key={f.id} type="button" onClick={() => setFileId(f.id)}
            className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
              f.id === fileId
                ? tc('bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold', 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold')
                : tc('bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-400', 'bg-pl-surface text-pl-text border-pl-border-strong hover:border-pl-border-strong')
            }`}>
            {f.label}
          </button>
        ))}
      </div>
      <Note>{file.hint}</Note>

      {qc.error ? (
        <p className={tc('text-red-400 text-sm mb-0', 'text-pl-danger-text text-sm mb-0')}>Parse failed: {qc.error}</p>
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
                <tr className={tc('text-left text-gray-400 border-b border-gray-700', 'text-left text-pl-muted border-b border-pl-border')}>
                  <th className="py-2 pr-4">Curve</th><th className="py-2 pr-4">Unit</th>
                  <th className="py-2 pr-4">Samples</th><th className="py-2 pr-4">Nulls</th>
                  <th className="py-2 pr-4">First</th><th className="py-2 pr-4">Last</th>
                  <th className="py-2 pr-4">Mean (finite)</th>
                </tr>
              </thead>
              <tbody>
                {qc.curves.map((c) => (
                  <tr key={c.mnemonic} className={`${tc('border-b border-gray-800 ', 'border-b border-pl-border ')}${c.nullCount === c.nSamples ? tc('text-red-400', 'text-pl-danger-text') : tc('text-gray-300', 'text-pl-text')}`}>
                    <td className={tc('py-2 pr-4 text-white', 'py-2 pr-4 text-pl-text')}>{c.mnemonic}</td>
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
            <table className={tc('w-full text-xs text-gray-400', 'w-full text-xs text-pl-muted')}>
              <tbody>
                {headerRows(qc.well).map((r) => (
                  <tr key={r.key} className={tc('border-b border-gray-800/60', 'border-b border-pl-border/60')}>
                    <td className={tc('py-1 pr-3 text-gray-500 font-mono', 'py-1 pr-3 text-pl-muted font-mono')}>{r.key}</td>
                    <td className="py-1 pr-3">{String(r.value ?? '')} {r.unit}</td>
                    <td className="py-1">{r.descr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={() => setShowRaw((s) => !s)}
            className={tc('text-xs text-[#BFFF00] hover:underline', 'text-xs text-pl-primary-text hover:underline')}>
            {showRaw ? 'Hide raw file' : 'Show raw file (first 40 lines)'}
          </button>
          {showRaw && (
            <pre className={tc('bg-[#0F172A] border border-gray-700 rounded-md p-3 overflow-x-auto text-xs text-gray-300 max-h-72 overflow-y-auto', 'bg-pl-sunken border border-pl-border rounded-md p-3 overflow-x-auto text-xs text-pl-text max-h-72 overflow-y-auto')}>
              {rawPreview}
            </pre>
          )}
        </>
      )}
    </PanelShell>
  );
};

export default LasInspector;
