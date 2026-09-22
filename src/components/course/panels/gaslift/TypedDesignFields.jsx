import React from 'react';
import { TYPED_VALVE_TYPES, TYPED_METHODS } from './gasLiftLab';
import { SelectField, NumField, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// The typed installation inputs, shared by the Valve explorer's and the
// Unloading explorer's typed views so the two ask for one installation in one
// way. Every value is held as the string the learner typed; gasLiftLab reads
// and checks them.

/** A plain decimal print: no thousands separators, so it can be typed back into an answer box. */
export const plain = (v, d) => (Number.isFinite(v) ? Number(v).toFixed(d) : '-');

/** The typed state of a default case object: every value as a string. */
export const typedState = (defaults) => Object.fromEntries(
  Object.entries(defaults).map(([k, v]) => [k, v === null || v === undefined ? '' : String(v)]),
);

export const GEOTHERM_FIELDS = [
  ['gasSg', 'Gas specific gravity'],
  ['whtF', 'Wellhead temperature, degF'],
  ['bhtF', 'Temperature at the reference depth, degF'],
  ['refDepthFt', 'Reference depth, ft TVD'],
  ['packerFt', 'Packer depth, ft TVD'],
];

const DESIGN_FIELDS = [
  ['pKickoffPsia', 'Kickoff pressure, psia'],
  ['pOperatingPsia', 'Operating pressure, psia'],
  ['dpPerValvePsi', 'Surface decrement per valve, psi'],
  ['dpTransferPsi', 'Transfer differential, psi'],
  ['killGradPsiPerFt', 'Kill fluid gradient, psi/ft'],
  ['unloadGradPsiPerFt', 'Unloading gradient, psi/ft'],
  ['pWhUnloadPsia', 'Unloading wellhead pressure, psia'],
  ['minSpacingFt', 'Minimum spacing, ft'],
  ['maxValves', 'Maximum valve count'],
  ['bellowsAreaIn2', 'Bellows area, in2'],
  ['qgiTargetMscfd', 'Design gas rate, Mscf/d'],
  ['orificeIdIn', 'Bottom orifice bore, in'],
];

export const TypedFieldList = ({ fields, values, set }) => (
  <FieldGrid>
    {fields.map(([key, label]) => (
      <NumField key={key} label={label} value={values[key]} onChange={(v) => set(key, v)} />
    ))}
  </FieldGrid>
);

/** The whole typed installation: geotherm, design inputs, catalogue and the three choices. */
export const TypedDesignFields = ({ values, set, withTarget = false }) => (
  <>
    <TypedFieldList fields={GEOTHERM_FIELDS} values={values} set={set} />
    <div className="mt-3">
      <TypedFieldList fields={DESIGN_FIELDS} values={values} set={set} />
    </div>
    <div className="mt-3">
      <FieldGrid>
        <SelectField label="Valve type" value={values.valveType} onChange={(v) => set('valveType', v)}
          options={TYPED_VALVE_TYPES.map((x) => [x, x])} />
        <SelectField label="Spacing method" value={values.method} onChange={(v) => set('method', v)}
          options={TYPED_METHODS.map((x) => [x, x])} />
        <SelectField label="Bottom orifice" value={values.bottomOrifice} onChange={(v) => set('bottomOrifice', v)}
          options={[['true', 'yes, an orifice at the bottom'], ['false', 'no, a valve at the bottom']]} />
        {withTarget && (
          <NumField label="Target depth, ft TVD (blank is the packer)" value={values.targetDepthFt}
            onChange={(v) => set('targetDepthFt', v)} />
        )}
      </FieldGrid>
    </div>
    <div className="mt-3">
      <label className="text-gray-400 text-xs mb-1 block" htmlFor="typed-port-catalogue">
        Port catalogue, bores in inches separated by commas
      </label>
      <input id="typed-port-catalogue" type="text" value={values.ports}
        onChange={(e) => set('ports', e.target.value)}
        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md h-8 text-sm px-2" />
      <Note>selectPort takes the smallest bore in this list that passes the design gas rate at each valve.</Note>
    </div>
  </>
);

export const Refusal = ({ result }) => (
  <Note>{result && result.errors && result.errors.length ? result.errors.join(' ') : 'This case cannot be run.'}</Note>
);
