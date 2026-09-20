import React from 'react';
import { Label } from '@/components/ui/label';
import { NumField, SelectField, FieldGrid } from '@/components/course/panels/petrophysics/panelKit';
import { parseNumber } from './lopaLab';

// Small shared pieces for the three H3 panels. Nothing here computes a number.

export const six = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? 'none' : Number(v).toFixed(6));
export const twelve = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? 'none' : Number(v).toFixed(12));
export const silText = (s) => (s === null || s === undefined ? 'none' : String(s));
export const ex = (x) => (x === 0 ? '0' : Number(x).toExponential().replace(/\.?0+e/, 'e'));

export const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={h} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** A free-text box: one row per line, or a list of numbers. */
export const TextRows = ({ label, value, onChange, rows = 3 }) => (
  <div className="col-span-2 sm:col-span-3 lg:col-span-5">
    <Label className="text-gray-400 text-xs mb-1 block">{label}</Label>
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-700 text-white border border-gray-600 rounded-md text-xs p-2 font-mono"
    />
  </div>
);

/** The engine's own refusal, verbatim, naming the field. */
export const Refusal = ({ r }) => (
  <div className="mt-3 rounded-md border border-red-800/60 bg-red-950/20 p-3">
    <p className="text-red-300 text-xs font-medium mb-1">THE ENGINE REFUSED, NAMING {String(r.field)}</p>
    <p className="text-xs text-slate-300 mb-0 font-mono">{r.error}</p>
  </div>
);

export const Declared = ({ title, children }) => (
  <div className="mt-3 rounded-md border border-sky-800/60 bg-sky-950/20 p-3">
    <p className="text-sky-300 text-xs font-medium mb-1">{title}</p>
    <p className="text-xs text-slate-300 mb-0">{children}</p>
  </div>
);

export const Warnings = ({ list }) => (list && list.length ? (
  <div className="mt-3 rounded-md border border-amber-800/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">THE ENGINE WARNED, AND STILL ANSWERED</p>
    {list.map((w) => <p key={w} className="text-xs text-slate-300 mb-0 font-mono">{w}</p>)}
  </div>
) : null);

export const ARCH_OPTIONS = [['1oo1', '1oo1'], ['1oo2', '1oo2'], ['2oo2', '2oo2'], ['2oo3', '2oo3'], ['1oo3', '1oo3'], ['2oo4', '2oo4 (see the refusal)']];

const str = (v) => (v === undefined || v === null ? '' : String(v));
export const fromParams = (p) => ({
  architecture: p.architecture,
  lambdaDuPerHour: str(p.lambdaDuPerHour),
  lambdaDdPerHour: str(p.lambdaDdPerHour),
  proofTestIntervalHours: str(p.proofTestIntervalHours),
  mttrHours: str(p.mttrHours),
  mrtHours: str(p.mrtHours),
  beta: str(p.beta),
  betaD: str(p.betaD),
  proofTestCoverage: str(p.proofTestCoverage),
  lifetimeHours: str(p.lifetimeHours),
});
export const toParams = (s) => {
  const p = { architecture: s.architecture };
  ['lambdaDuPerHour', 'lambdaDdPerHour', 'proofTestIntervalHours', 'mttrHours', 'mrtHours', 'beta', 'betaD', 'proofTestCoverage', 'lifetimeHours']
    .forEach((k) => { const v = parseNumber(s[k]); if (v !== undefined) p[k] = v; });
  return p;
};

/** One subsystem's inputs: every field the engine takes, a blank box left out. */
export const SubsystemFields = ({ s, set, prefix = '' }) => {
  const up = (k) => (v) => set({ ...s, [k]: v });
  return (
    <FieldGrid>
      <SelectField label={`${prefix}Architecture`} value={s.architecture} onChange={up('architecture')} options={ARCH_OPTIONS} />
      <NumField label="lambdaDU, per hour" value={s.lambdaDuPerHour} onChange={up('lambdaDuPerHour')} />
      <NumField label="lambdaDD, per hour" value={s.lambdaDdPerHour} onChange={up('lambdaDdPerHour')} />
      <NumField label="Proof test interval T1, hours" value={s.proofTestIntervalHours} onChange={up('proofTestIntervalHours')} />
      <NumField label="MTTR, hours" value={s.mttrHours} onChange={up('mttrHours')} />
      <NumField label="MRT after a proof test, hours" value={s.mrtHours} onChange={up('mrtHours')} />
      <NumField label="Beta factor" value={s.beta} onChange={up('beta')} />
      <NumField label="betaD, the detected beta factor" value={s.betaD} onChange={up('betaD')} />
      <NumField label="Proof test coverage (blank for 1)" value={s.proofTestCoverage} onChange={up('proofTestCoverage')} />
      <NumField label="Lifetime T2, hours" value={s.lifetimeHours} onChange={up('lifetimeHours')} />
    </FieldGrid>
  );
};

export const safe = (fn) => { try { return fn(); } catch { return null; } };
