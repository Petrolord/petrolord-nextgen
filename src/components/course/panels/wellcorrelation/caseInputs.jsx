import React, { useMemo, useState } from 'react';
import { TEACHING_WELLS, parseSectionTable, sectionTableText } from '@/lib/correlationTeaching';
import { SelectField } from '@/components/course/panels/petrophysics/panelKit';

// The correlation panels open on the four Ekene wells, the teaching case.
// "Type a section" swaps in a section of the learner's own (the capstone
// states one): one well per line, name then its TOP_A, TOP_SAND, BASE_SAND
// and TOP_B picks in MD, a dash for a top the well did not reach. It starts
// from the Ekene picks so it is never blank; nothing here preloads the
// capstone's section.
export function useSectionWells() {
  const [mode, setMode] = useState('ekene');
  const [table, setTable] = useState(sectionTableText(TEACHING_WELLS));

  const wells = useMemo(() => (mode === 'ekene' ? TEACHING_WELLS : parseSectionTable(table)), [mode, table]);

  const ui = (
    <div className="space-y-2">
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <SelectField label="Section" value={mode} onChange={setMode}
          options={[['ekene', 'Ekene wells (teaching)'], ['typed', 'Type a section']]} />
      </div>
      {mode === 'typed' && (
        <div>
          <label className="text-gray-400 text-xs mb-1 block" htmlFor="wc-section-table">
            One well per line: name, TOP_A, TOP_SAND, BASE_SAND, TOP_B (MD in m; a dash for a top not reached)
          </label>
          <textarea id="wc-section-table" rows={5} value={table} onChange={(e) => setTable(e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md text-sm px-2 py-1 font-mono" />
        </div>
      )}
    </div>
  );

  return { wells, ok: Boolean(wells), typed: mode === 'typed', ui };
}
