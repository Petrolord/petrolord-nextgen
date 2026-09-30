import React from 'react';
import { FlaskConical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Small shared atoms so every teaching panel looks and behaves the same
// in both hosts (lesson embeds via {{panel:...}} and the Learning Mode
// tier workflows).
//
// Every atom takes the theme roles and the Suite's input styling (batch 1B,
// docs/scope/DesignSystem-Rollout.md).
const THEMED_SELECT =
  'w-full rounded-md border border-pl-border-strong bg-pl-surface text-pl-text h-8 text-sm px-2 '
  + 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus disabled:cursor-not-allowed disabled:opacity-50';

export const PanelShell = ({ title, subtitle, children }) => {
  return (
    <div className="rounded-lg border border-pl-border bg-pl-surface text-pl-text shadow-pl-sm p-4 space-y-4">
      <div>
        <p className="text-pl-text font-semibold flex items-center gap-2 mb-0">
          <FlaskConical className="h-4 w-4 text-pl-primary-text" /> {title}
        </p>
        {subtitle && <p className="text-xs text-pl-muted mt-1 mb-0">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

export const NumField = ({ label, value, onChange, placeholder }) => {
  return (
    <div>
      <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
      <Input type="number" step="any" value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-sm" />
    </div>
  );
};

/**
 * Accepts EITHER shape of option, because both are in use across the course
 * panels and neither is wrong:
 *   [['a', 'Alpha'], ['b', 'Beta']]        the array-pair form
 *   [{ value: 'a', label: 'Alpha' }, ...]  the object form
 *
 * This used to destructure `([v, l])` only. Array-destructuring an object
 * throws "object is not iterable", so every panel passing the object form
 * crashed the moment its select rendered. Eight call sites across five panels
 * were doing exactly that, in Drilling Hydraulics, Geomechanics and
 * Perforation & Sand Control, and nothing caught it because no test rendered a
 * panel. A shared component with two callers using two shapes has to accept
 * both or reject one loudly; silently supporting the less common one was the
 * bug.
 */
const optionPair = (o) => (Array.isArray(o)
  ? [o[0], o[1] === undefined ? o[0] : o[1]]
  : [o.value, o.label === undefined ? o.value : o.label]);

export const SelectField = ({ label, value, onChange, options }) => {
  return (
    <div>
      <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={THEMED_SELECT}>
        {(options || []).map((o) => {
          const [v, l] = optionPair(o);
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </div>
  );
};

export const Tile = ({ label, value, unit }) => {
  return (
    <div className="rounded-md border border-pl-border bg-pl-sunken p-3">
      <p className="text-pl-muted text-xs mb-0">{label}</p>
      <p className="text-pl-text font-pl-mono tabular-nums mb-0">{value}{unit ? <span className="text-pl-muted font-pl-sans text-xs ml-1">{unit}</span> : null}</p>
    </div>
  );
};

export const TileGrid = ({ children }) => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">{children}</div>
);

export const FieldGrid = ({ children }) => (
  <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">{children}</div>
);

export const Note = ({ children }) => {
  return <p className="text-xs text-pl-muted mt-1 mb-0">{children}</p>;
};
