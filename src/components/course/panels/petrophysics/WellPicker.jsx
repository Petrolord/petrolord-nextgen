import React, { useState } from 'react';
import { parseLas } from '@petrolord/engines/engines/welldata/lasParse.js';
import { TYPEWELL, wellFromLas, num } from './typewellLab';
import { NumField, Note } from './panelKit';

// Pick the well the panels run on: the bundled typewell, or a LAS file opened
// from your computer (the capstone case wells download from the capstone
// card). A LAS file carries curves only, so its zones and water leg are typed
// here from the brief. Nothing is uploaded; the file is parsed in the browser.
const ZONE_FIELDS = [
  ['aTop', 'SAND_A top (m)'], ['aBase', 'SAND_A base (m)'], ['bTop', 'SAND_B top (m)'],
  ['bBase', 'SAND_B base (m)'], ['wTop', 'Water leg top (m)'], ['wBase', 'Water leg base (m)'],
];

const WellPicker = ({ well, onWell }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [z, setZ] = useState({ aTop: '', aBase: '', bTop: '', bBase: '', wTop: '', wBase: '' });

  const build = (f, zones) => {
    const v = Object.fromEntries(Object.entries(zones).map(([k, x]) => [k, num(x)]));
    if (!f) return;
    if (!Object.values(v).every(Number.isFinite)) {
      setError('Type the zone and water-leg depths the brief states to run this well.');
      onWell(null);
      return;
    }
    try {
      const w = wellFromLas(parseLas(f.text), {
        name: f.name,
        zones: { SAND_A: [v.aTop, v.aBase], SAND_B: [v.bTop, v.bBase] },
        waterLeg: [v.wTop, v.wBase],
      });
      setError(null);
      onWell(w);
    } catch (e) {
      setError(e.message);
      onWell(null);
    }
  };

  return (
    <div className="rounded-lg border border-gray-700 bg-[#1E293B] p-4 space-y-3" data-testid="well-picker">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-400">Well:</span>
        <button type="button" onClick={() => { setFile(null); setError(null); onWell(TYPEWELL); }}
          className={`px-3 py-1.5 rounded-md border text-xs ${well === TYPEWELL ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
          Typewell (teaching)
        </button>
        <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-dashed border-gray-500 text-gray-300 text-xs cursor-pointer hover:border-[#BFFF00]">
          {file ? `Open LAS: ${file.name}` : 'Open a LAS file'}
          <input type="file" accept=".las,.LAS,.txt" className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (!f) return;
              const next = { name: f.name, text: await f.text() };
              setFile(next);
              build(next, z);
            }} />
        </label>
        <span className="text-xs text-gray-500">Running on: {well ? well.name : 'no well yet'}</span>
      </div>
      {file && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-6">
          {ZONE_FIELDS.map(([k, l]) => (
            <NumField key={k} label={l} value={z[k]}
              onChange={(x) => { const nz = { ...z, [k]: x }; setZ(nz); build(file, nz); }} />
          ))}
        </div>
      )}
      {error && <Note>{error}</Note>}
    </div>
  );
};

export default WellPicker;
