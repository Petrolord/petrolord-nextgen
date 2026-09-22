import React from 'react';
import { TYPED_STRING_SIZES, TYPED_WELL_MAX_SECTIONS, TYPED_WELL_GRADES } from './rodPumpLab';
import { SelectField, NumField, FieldGrid } from '@/components/course/panels/petrophysics/panelKit';

// The input block of a typed well, shared by the card explorer and the balance
// explorer. It holds nothing and computes nothing: the explorer owns the draft
// (every value a string, as typed) and hands it to rodPumpLab when the learner
// asks for the march.

const SIZE_OPTIONS = [{ value: '', label: 'none' }]
  .concat(TYPED_STRING_SIZES.map((x) => ({ value: x, label: `${x} in` })));

const GRADE_OPTIONS = TYPED_WELL_GRADES.map((id) => ({ value: id, label: `API grade ${id}` }));

/** A draft of strings from a lab default, padded to the section count. */
export const draftFrom = (defaults) => {
  const out = {};
  Object.entries(defaults).forEach(([k, v]) => {
    if (k !== 'sections') out[k] = String(v);
  });
  out.sections = Array.from({ length: TYPED_WELL_MAX_SECTIONS }, (_, i) => {
    const s = defaults.sections[i];
    return s ? { size: s.size, lengthFt: String(s.lengthFt) } : { size: '', lengthFt: '' };
  });
  return out;
};

const WELL_FIELDS = [
  ['fluidSg', 'Fluid specific gravity'],
  ['aIn', 'Front arm, saddle bearing to polished rod, in'],
  ['cIn', 'Rear arm, saddle bearing to equalizer, in'],
  ['pIn', 'Pitman, in'],
  ['crankBehindIn', 'Crank pivot behind the saddle bearing, in'],
  ['crankBelowIn', 'Crank pivot below the saddle bearing, in'],
  ['rIn', 'Crank radius, in'],
  ['kinSteps', 'Crank angles the cycle is closed at'],
  ['plungerDIn', 'Plunger diameter, in'],
  ['pIntakePsia', 'Intake pressure, psia'],
  ['pDischargePsia', 'Discharge pressure, psia'],
  ['spm', 'Speed, spm'],
  ['dampingRatio', 'Damping, fraction of critical'],
  ['fillage', 'Barrel fillage, fraction'],
  ['pumpEfficiency', 'Pump efficiency, fraction'],
];

export const BALANCE_FIELDS = [
  ['structuralUnbalanceLb', 'Structural unbalance, lb'],
  ['crankOffsetDeg', 'Crank offset, degrees'],
  ['serviceFactor', 'Service factor'],
  ['harmonics', 'Gibbs harmonics'],
];

const TypedWellFields = ({ draft, setDraft, extra = [], designation = false }) => {
  const setKey = (k) => (v) => setDraft((d) => ({ ...d, [k]: v }));
  const setRow = (i, patch) => setDraft((d) => ({
    ...d,
    sections: d.sections.map((r, j) => (j === i ? { ...r, ...patch } : r)),
  }));
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {draft.sections.map((row, i) => (
          <FieldGrid key={`section-${i + 1}`}>
            <SelectField label={`Section ${i + 1} size`} value={row.size}
              onChange={(v) => setRow(i, { size: v })} options={SIZE_OPTIONS} />
            <NumField label={`Section ${i + 1} length, ft`} value={row.lengthFt}
              onChange={(v) => setRow(i, { lengthFt: v })} />
          </FieldGrid>
        ))}
      </div>
      <div className="mt-3">
        <FieldGrid>
          <SelectField label="Rod grade" value={draft.gradeId} onChange={setKey('gradeId')} options={GRADE_OPTIONS} />
          {WELL_FIELDS.map(([k, label]) => (
            <NumField key={k} label={label} value={draft[k]} onChange={setKey(k)} />
          ))}
        </FieldGrid>
      </div>
      {(extra.length > 0 || designation) && (
        <div className="mt-3">
          <FieldGrid>
            {extra.map(([k, label]) => (
              <NumField key={k} label={label} value={draft[k]} onChange={setKey(k)} />
            ))}
            {designation && (
              <div>
                <label className="text-gray-400 text-xs mb-1 block" htmlFor="typed-unit-designation">Unit designation</label>
                <input id="typed-unit-designation" type="text" value={draft.unitDesignation}
                  onChange={(e) => setKey('unitDesignation')(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md h-8 text-sm px-2" />
              </div>
            )}
          </FieldGrid>
        </div>
      )}
    </>
  );
};

export default TypedWellFields;
