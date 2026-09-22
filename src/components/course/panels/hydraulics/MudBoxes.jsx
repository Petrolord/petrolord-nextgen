import React from 'react';
import { MUD_FIELDS } from './hydraulicsLab';
import { NumField, Note } from '@/components/course/panels/petrophysics/panelKit';

// Your mud: four dial readings and a density, shared by the three hydraulics
// explorers. Blank boxes keep the selected case's own mud.
const MudBoxes = ({ typed, setTyped, valid }) => (
  <div className="mt-2">
    <p className="text-[11px] text-gray-500">
      Your mud: type all four readings and a density to run your own mud in every view. Blank boxes
      keep the selected case&apos;s own mud.
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-1">
      {MUD_FIELDS.map((f) => (
        <NumField key={f.key} label={f.label} value={typed[f.key]}
          onChange={(v) => setTyped((t) => ({ ...t, [f.key]: v }))} />
      ))}
    </div>
    {!valid && <Note>Type all four readings (600 above 300) or none, and a density between 0 and 7850 kg/m3 or none.</Note>}
  </div>
);

export default MudBoxes;
