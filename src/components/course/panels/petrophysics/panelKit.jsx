import React from 'react';
import { FlaskConical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Small shared atoms so every teaching panel looks and behaves the same
// in both hosts (lesson embeds via {{panel:...}} and the Learning Mode
// tier workflows).

export const PanelShell = ({ title, subtitle, children }) => (
  <div className="rounded-lg border border-gray-700 bg-[#1E293B] p-4 space-y-4">
    <div>
      <p className="text-white font-semibold flex items-center gap-2 mb-0">
        <FlaskConical className="h-4 w-4 text-[#BFFF00]" /> {title}
      </p>
      {subtitle && <p className="text-xs text-gray-400 mt-1 mb-0">{subtitle}</p>}
    </div>
    {children}
  </div>
);

export const NumField = ({ label, value, onChange, placeholder }) => (
  <div>
    <Label className="text-gray-400 text-xs mb-1 block">{label}</Label>
    <Input type="number" step="any" value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-700 text-white border-gray-600 h-8 text-sm" />
  </div>
);

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

export const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <Label className="text-gray-400 text-xs mb-1 block">{label}</Label>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-700 text-white border border-gray-600 rounded-md h-8 text-sm px-2">
      {(options || []).map((o) => {
        const [v, l] = optionPair(o);
        return <option key={v} value={v}>{l}</option>;
      })}
    </select>
  </div>
);

export const Tile = ({ label, value, unit }) => (
  <div className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
    <p className="text-gray-500 text-xs mb-0">{label}</p>
    <p className="text-white mb-0">{value}{unit ? <span className="text-gray-400 text-xs ml-1">{unit}</span> : null}</p>
  </div>
);

export const TileGrid = ({ children }) => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">{children}</div>
);

export const FieldGrid = ({ children }) => (
  <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">{children}</div>
);

export const Note = ({ children }) => (
  <p className="text-xs text-gray-500 mt-1 mb-0">{children}</p>
);
