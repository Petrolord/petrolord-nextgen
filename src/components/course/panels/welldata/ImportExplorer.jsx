import React, { useMemo, useState } from 'react';
import { TEACHING_FILES } from '@/lib/welldataTeaching';
import { parseLas } from '@petrolord/engines/engines/welldata/lasParse.js';
import { depthUnitToMetres, prepareLogs, uniformStepM } from '@petrolord/engines/engines/welldata/lasImport.js';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Import explorer: run the prepareLogs pipeline on any teaching file and
// show what it decided. The converted flag and the kind are the two
// columns the Professional capstone is counted from, and the uniformity
// verdict is deliberately shown next to the first two consecutive
// differences, because the test compares differences rather than
// averaging them.
const fmt = (v, d = 6) => (Number.isFinite(v) ? v.toFixed(d) : '-');

function runImport(file) {
  const parsed = parseLas(file.text);
  const prep = prepareLogs(parsed, { sourceFile: file.label });
  const dept = parsed.curves[0];
  const factor = depthUnitToMetres(dept.unit);
  const depthM = prep.logs[0].data;
  const diffs = [];
  for (let i = 1; i < Math.min(depthM.length, 4); i++) diffs.push(depthM[i] - depthM[i - 1]);
  const step = uniformStepM(depthM);
  const native = Array.from(dept.data).filter(Number.isFinite);
  return {
    parsed,
    prep,
    nativeUnit: dept.unit,
    factor,
    nativeFirst: native[0],
    nativeLast: native[native.length - 1],
    samples: dept.data.length,
    diffs,
    step,
    uniform: step === null ? 0 : 1,
    converted: prep.logs.filter((l) => l.converted).length,
    kinds: prep.logs.filter((l, i) => i > 0 && l.kind).length,
  };
}

const ImportExplorer = () => {
  const [fileId, setFileId] = useState('feet_20');
  const file = TEACHING_FILES.find((f) => f.id === fileId) || TEACHING_FILES[0];
  const r = useMemo(() => {
    try {
      return runImport(file);
    } catch {
      return null;
    }
  }, [file]);

  if (!r) {
    return (
      <PanelShell title="Import explorer" subtitle="That file could not be parsed.">
        <Note>Pick another teaching file.</Note>
      </PanelShell>
    );
  }

  return (
    <PanelShell title="Import explorer"
      subtitle={`${file.label} through the full import pipeline: parse, convert units, assign kinds, test the depth step. ${file.hint}`}>
      <div className="flex flex-wrap gap-2">
        {TEACHING_FILES.map((f) => (
          <button key={f.id} type="button" onClick={() => setFileId(f.id)}
            className={`px-3 py-1.5 rounded-md border text-sm ${fileId === f.id
              ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'
              : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2 pr-4">curve</th>
              <th className="text-left py-2 pr-4">kind</th>
              <th className="text-left py-2 pr-4">unit before</th>
              <th className="text-left py-2 pr-4">unit after</th>
              <th className="text-left py-2">converted</th>
            </tr>
          </thead>
          <tbody>
            {r.prep.logs.map((l, i) => (
              <tr key={l.mnemonic} className="border-b border-gray-800">
                <td className="py-2 pr-4 text-white">{l.mnemonic}{i === 0 ? ' (index)' : ''}</td>
                <td className="py-2 pr-4 text-gray-300">{l.kind || 'not recognised'}</td>
                <td className="py-2 pr-4 text-gray-300">{l.sourceUnit || '-'}</td>
                <td className="py-2 pr-4 text-gray-300">{l.unit || '-'}</td>
                <td className={`py-2 ${l.converted ? 'text-[#BFFF00] font-semibold' : 'text-gray-500'}`}>
                  {l.converted ? 'YES' : 'no'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TileGrid>
        <Tile label="Native depth unit" value={String(r.nativeUnit)} />
        <Tile label="Factor to metres" value={r.factor == null ? 'unknown' : String(r.factor)} />
        <Tile label="Native start" value={fmt(r.nativeFirst, 2)} unit={String(r.nativeUnit)} />
        <Tile label="Native stop" value={fmt(r.nativeLast, 2)} unit={String(r.nativeUnit)} />
        <Tile label="Start converted" value={fmt(r.prep.startMdM, 8)} unit="m" />
        <Tile label="Stop converted" value={fmt(r.prep.stopMdM, 8)} unit="m" />
        <Tile label="Samples" value={String(r.samples)} unit="rows" />
        <Tile label="Curves unit-converted" value={String(r.converted)} unit="count" />
        <Tile label="Curve kinds recognised" value={String(r.kinds)} unit="count (index excluded)" />
        <Tile label="Uniform depth step" value={String(r.uniform)} unit={r.uniform ? '1 yes' : '0 no'} />
        <Tile label="Reported step" value={r.step === null ? 'none' : fmt(r.step, 12)} unit="m" />
        <Tile label="First differences" value={r.diffs.map((d) => fmt(d, 6)).join(', ')} unit="m" />
      </TileGrid>

      <Note>
        The uniformity test does not average. It takes the first difference as the candidate step,
        then requires every later difference to sit within a tolerance of it, and reports that first
        difference. Watch the first-differences tile as you switch files: on feet_20 the values wobble
        in the fifth decimal because the depth column is stored as float32, and the test still passes.
        On irregular_20 the differences are genuinely different sizes, and the same test returns no.
      </Note>
    </PanelShell>
  );
};

export default ImportExplorer;
