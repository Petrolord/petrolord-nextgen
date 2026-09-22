import React, { useMemo, useState } from 'react';
import {
  TEACHING_WELLS, TARGET, E7, parseWellTable, wellTableText,
} from '@/lib/mappingTeaching';
import { SelectField, NumField } from '@/components/course/panels/petrophysics/panelKit';

// The mapping panels open on the Ekene wells, the teaching case. "Type a
// well set" swaps in a case of the learner's own (the capstone states one):
// a well table, a prospect and, on the validation panel, an appraisal well.
// It starts from the Ekene values so it is never blank; nothing here
// preloads the capstone's case.
export function useMappingCase({ appraisal = false } = {}) {
  const [mode, setMode] = useState('ekene');
  const [table, setTable] = useState(wellTableText(TEACHING_WELLS));
  const [p, setP] = useState({ tx: String(TARGET.x), ty: String(TARGET.y), ex: String(E7.x), ey: String(E7.y), ea: String(E7.actual) });
  const setK = (k) => (v) => setP((o) => ({ ...o, [k]: v }));

  const kase = useMemo(() => {
    if (mode === 'ekene') return { ok: true, kase: null };
    const wells = parseWellTable(table);
    const n = Object.fromEntries(Object.entries(p).map(([k, v]) => [k, Number(v)]));
    if (!wells || !Object.values(n).every(Number.isFinite)) return { ok: false, kase: null };
    return {
      ok: true,
      kase: {
        wells,
        target: { x: n.tx, y: n.ty, label: 'the prospect' },
        e7: { name: 'the appraisal well', x: n.ex, y: n.ey, actual: n.ea },
      },
    };
  }, [mode, table, p]);

  const ui = (
    <div className="space-y-2">
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <SelectField label="Wells" value={mode} onChange={setMode}
          options={[['ekene', 'Ekene wells (teaching)'], ['typed', 'Type a well set']]} />
      </div>
      {mode === 'typed' && (
        <>
          <div>
            <label className="text-gray-400 text-xs mb-1 block" htmlFor="map-well-table">
              One well per line: name, x, y, TOP_SAND MD, BASE_SAND MD
            </label>
            <textarea id="map-well-table" rows={7} value={table} onChange={(e) => setTable(e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md text-sm px-2 py-1 font-mono" />
          </div>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-5 items-end">
            <NumField label="Prospect x (m)" value={p.tx} onChange={setK('tx')} />
            <NumField label="Prospect y (m)" value={p.ty} onChange={setK('ty')} />
            {appraisal && (
              <>
                <NumField label="Appraisal well x (m)" value={p.ex} onChange={setK('ex')} />
                <NumField label="Appraisal well y (m)" value={p.ey} onChange={setK('ey')} />
                <NumField label="Appraisal well TOP_SAND pick (m)" value={p.ea} onChange={setK('ea')} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );

  return { ...kase, typed: mode === 'typed', ui };
}
