import React, { useMemo, useState } from 'react';
import {
  typedNetwork, TYPED_NETWORK_DEFAULT, TYPED_NETWORK_LIMITS, TYPED_SEPARATOR_ID,
  TEACHING_NETWORK_NAME, DEFAULT_TOLERANCE_LB_D, DEFAULT_MAX_ITER,
} from './networkLab';
import { SelectField, NumField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// A NETWORK THE LEARNER TYPES, shared by the Network explorer (the solve) and
// the Fight explorer (the solve plus what it hides). One input component and
// one result component, over one lab call, `typedNetwork`, which runs the
// vendored solver, its conservation check, its stream propagation and its
// closed form linear solve. Nothing here computes: every figure is a return
// value, printed as a plain decimal with no thousands separator so it can be
// typed into an answer box as read.
//
// The view opens on the teaching network. Inputs are held as strings.

/** The decimals each kind of figure is printed at. */
export const TYPED_PRINT_DP = Object.freeze({
  pressure: 6,
  mass: 6,
  stream: 6,
  fraction: 12,
});

const fx = (v, d) => (Number.isFinite(v) ? Number(v).toFixed(d) : '-');
const tiny = (v) => (Number.isFinite(v) ? (v === 0 ? '0' : Number(v).toExponential(6)) : '-');
const yn = (b) => (b ? 'yes' : 'no');
const str = (v) => (v === undefined || v === null ? '' : String(v));

const WELL_FIELDS = ['name', 'qmax', 'prPsia', 'allocationLbD', 'k', 'capLbD', 'to', 'kLinear', 'qoStbd', 'qwStbd', 'qgMscfd'];
const BRANCH_FIELDS = ['name', 'from', 'to', 'k', 'kLinear'];

const pad = (rows, n, fields) => Array.from({ length: n }, (_, i) => {
  const r = rows[i];
  return Object.fromEntries(fields.map((f) => [f, r ? str(r[f]) : '']));
});

const initialState = () => ({
  separatorPsia: str(TYPED_NETWORK_DEFAULT.separatorPsia),
  tolerance: str(TYPED_NETWORK_DEFAULT.tolerance),
  maxIter: str(TYPED_NETWORK_DEFAULT.maxIter),
  wells: pad(TYPED_NETWORK_DEFAULT.wells, TYPED_NETWORK_LIMITS.wells, WELL_FIELDS),
  nodes: pad(TYPED_NETWORK_DEFAULT.nodes, TYPED_NETWORK_LIMITS.nodes, ['name']),
  branches: pad(TYPED_NETWORK_DEFAULT.branches, TYPED_NETWORK_LIMITS.branches, BRANCH_FIELDS),
});

const TextField = ({ label, value, onChange }) => (
  <div>
    <div className="text-gray-400 text-xs mb-1">{label}</div>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-700 text-white border border-gray-600 rounded-md h-8 text-sm px-2" />
  </div>
);

const Th = ({ children }) => <th className="text-left pr-3">{children}</th>;

const TypedNetworkInputs = ({ s, setTop, setRow, advanced }) => {
  const endOptions = [{ value: '', label: 'none' }]
    .concat(s.nodes.map((n, i) => ({ value: `n${i + 1}`, label: n.name.trim() ? n.name : `node ${i + 1} (unnamed)` }))
      .filter((o, i) => s.nodes[i].name.trim() !== ''))
    .concat([{ value: TYPED_SEPARATOR_ID, label: 'Separator' }]);
  return (
    <>
      <FieldGrid>
        <NumField label="Separator pressure, psia" value={s.separatorPsia} onChange={(v) => setTop('separatorPsia', v)} />
        <NumField label="Tolerance" value={s.tolerance} onChange={(v) => setTop('tolerance', v)} />
        <NumField label="Iteration cap" value={s.maxIter} onChange={(v) => setTop('maxIter', v)} />
      </FieldGrid>
      <div className="mt-3 text-xs text-slate-400">Internal nodes. A blank name leaves the slot unused.</div>
      <div className="mt-1">
        <FieldGrid>
          {s.nodes.map((n, i) => (
            <TextField key={`node-${i + 1}`} label={`Node ${i + 1} name`} value={n.name}
              onChange={(v) => setRow('nodes', i, { name: v })} />
          ))}
        </FieldGrid>
      </div>
      <div className="mt-3 text-xs text-slate-400">
        Wells. Leave the allocation or the capacity limit blank for none. A well with no name and no numbers is left off.
      </div>
      {s.wells.map((w, i) => (
        <div key={`well-${i + 1}`} className="mt-2 rounded-md border border-gray-700 p-2">
          <FieldGrid>
            <TextField label={`Well ${i + 1} name`} value={w.name} onChange={(v) => setRow('wells', i, { name: v })} />
            <NumField label="Vogel qmax, lb/d" value={w.qmax} onChange={(v) => setRow('wells', i, { qmax: v })} />
            <NumField label="Reservoir pressure, psia" value={w.prPsia} onChange={(v) => setRow('wells', i, { prPsia: v })} />
            <NumField label="Allocation, lb/d" value={w.allocationLbD} onChange={(v) => setRow('wells', i, { allocationLbD: v })} />
            <NumField label="Flowline k, lb/d per root psi" value={w.k} onChange={(v) => setRow('wells', i, { k: v })} />
            <NumField label="Flowline capacity limit, lb/d" value={w.capLbD} onChange={(v) => setRow('wells', i, { capLbD: v })} />
            <SelectField label="Flowline lands on" value={w.to} onChange={(v) => setRow('wells', i, { to: v })} options={endOptions} />
            {advanced && (
              <>
                <NumField label="Linear flowline k, lb/d per psi" value={w.kLinear} onChange={(v) => setRow('wells', i, { kLinear: v })} />
                <NumField label="Tested oil, stb/d" value={w.qoStbd} onChange={(v) => setRow('wells', i, { qoStbd: v })} />
                <NumField label="Tested water, stb/d" value={w.qwStbd} onChange={(v) => setRow('wells', i, { qwStbd: v })} />
                <NumField label="Tested gas, Mscf/d" value={w.qgMscfd} onChange={(v) => setRow('wells', i, { qgMscfd: v })} />
              </>
            )}
          </FieldGrid>
        </div>
      ))}
      <div className="mt-3 text-xs text-slate-400">
        Branches between internal nodes and the separator, each signed from its drawn start to its drawn end.
      </div>
      {s.branches.map((b, i) => (
        <div key={`branch-${i + 1}`} className="mt-2 rounded-md border border-gray-700 p-2">
          <FieldGrid>
            <TextField label={`Branch ${i + 1} name`} value={b.name} onChange={(v) => setRow('branches', i, { name: v })} />
            <SelectField label="Drawn from" value={b.from} onChange={(v) => setRow('branches', i, { from: v })} options={endOptions} />
            <SelectField label="Drawn to" value={b.to} onChange={(v) => setRow('branches', i, { to: v })} options={endOptions} />
            <NumField label="k, lb/d per root psi" value={b.k} onChange={(v) => setRow('branches', i, { k: v })} />
            {advanced && (
              <NumField label="Linear k, lb/d per psi" value={b.kLinear} onChange={(v) => setRow('branches', i, { kLinear: v })} />
            )}
          </FieldGrid>
        </div>
      ))}
    </>
  );
};

const TypedNetworkResults = ({ r, advanced }) => (
  <>
    <div className="mt-3">
      <TileGrid>
        <Tile label="Converged" value={yn(r.converged)} />
        <Tile label="Iterations" value={String(r.iterations)} />
        <Tile label="Reported residual" value={tiny(r.reportedResidualLbD)} unit="lb/d" />
        <Tile label="Pinned nodes" value={r.pinned.length ? r.pinned.join(', ') : 'none'} />
        <Tile label="Produced, the sum of the reported well rates" value={fx(r.producedLbD, TYPED_PRINT_DP.mass)} unit="lb/d" />
        <Tile label="Delivered to the separator" value={fx(r.deliveredLbD, TYPED_PRINT_DP.mass)} unit="lb/d" />
        <Tile label="Conservation gap" value={fx(r.conservationGapLbD, TYPED_PRINT_DP.mass)} unit="lb/d" />
        <Tile label="Relative conservation gap, a fraction" value={fx(r.conservationRelative, TYPED_PRINT_DP.fraction)} />
      </TileGrid>
    </div>
    <div className="mt-3 overflow-x-auto">
      <table className="text-xs text-slate-300 w-full">
        <thead className="text-slate-500">
          <tr><Th>node</Th><Th>kind</Th><Th>pressure, psia</Th><Th>pinned</Th></tr>
        </thead>
        <tbody>
          {r.nodes.map((n) => (
            <tr key={n.id}>
              <td className="pr-3">{n.label}</td>
              <td className="pr-3">{n.kind}</td>
              <td className="pr-3">{fx(n.pressurePsia, TYPED_PRINT_DP.pressure)}</td>
              <td className="pr-3">{yn(n.isPinned)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-3 overflow-x-auto">
      <table className="text-xs text-slate-300 w-full">
        <thead className="text-slate-500">
          <tr>
            <Th>branch</Th><Th>drawn from</Th><Th>drawn to</Th>
            <Th>mass, lb/d, signed in the drawn sense</Th><Th>runs as drawn</Th>
            {advanced && (<><Th>oil, stb/d</Th><Th>water, stb/d</Th><Th>gas, Mscf/d</Th></>)}
          </tr>
        </thead>
        <tbody>
          {r.branches.map((b) => (
            <tr key={b.id}>
              <td className="pr-3">{b.label}</td>
              <td className="pr-3">{b.drawnFrom}</td>
              <td className="pr-3">{b.drawnTo}</td>
              <td className="pr-3">{fx(b.signedMassDrawnSenseLbD, TYPED_PRINT_DP.mass)}</td>
              <td className="pr-3">{yn(b.runsAsDrawn)}</td>
              {advanced && (
                <>
                  <td className="pr-3">{fx(b.oilStbd, TYPED_PRINT_DP.stream)}</td>
                  <td className="pr-3">{fx(b.waterStbd, TYPED_PRINT_DP.stream)}</td>
                  <td className="pr-3">{fx(b.gasMscfd, TYPED_PRINT_DP.stream)}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-3 overflow-x-auto">
      <table className="text-xs text-slate-300 w-full">
        <thead className="text-slate-500">
          <tr><Th>well</Th><Th>rate on the system, lb/d</Th><Th>wellhead, psia</Th><Th>flowline mass, lb/d</Th><Th>pinned</Th></tr>
        </thead>
        <tbody>
          {r.wells.map((w) => (
            <tr key={w.id}>
              <td className="pr-3">{w.label}</td>
              <td className="pr-3">{fx(w.rateOnSystemLbD, TYPED_PRINT_DP.mass)}</td>
              <td className="pr-3">{fx(w.wellheadPsia, TYPED_PRINT_DP.pressure)}</td>
              <td className="pr-3">{fx(w.flowlineMassLbD, TYPED_PRINT_DP.mass)}</td>
              <td className="pr-3">{yn(w.isPinned)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {advanced && r.streams && !r.streams.ok && <Note>Streams: {r.streams.error}</Note>}
    {advanced && r.linear && (r.linear.ok ? (
      <div className="mt-3 overflow-x-auto">
        <div className="text-xs text-slate-400 mb-1">
          The linearised twin: every branch at its linear k in lb/d per psi, every well as q = qmax (1 - p/pr), no allocation
          and no capacity limit, solved by the weighted graph Laplacian with no iteration.
        </div>
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr><Th>node</Th><Th>kind</Th><Th>linear twin pressure, psia</Th></tr>
          </thead>
          <tbody>
            {r.linear.nodes.map((n) => (
              <tr key={n.id}>
                <td className="pr-3">{n.label}</td>
                <td className="pr-3">{n.kind}</td>
                <td className="pr-3">{fx(n.pressurePsia, TYPED_PRINT_DP.pressure)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : <Note>Linearised twin: {r.linear.error}</Note>)}
    {r.warnings.length > 0 && <Note>Engine warning: {r.warnings.map((w) => (typeof w === 'string' ? w : w.message)).join(' ')}</Note>}
  </>
);

/** The whole typed view. `advanced` adds the tested splits and the linearised twin. */
export const TypedNetworkView = ({ advanced = false }) => {
  const [s, setS] = useState(initialState);
  const setTop = (key, v) => setS((x) => ({ ...x, [key]: v }));
  const setRow = (list, i, patch) => setS((x) => ({
    ...x,
    [list]: x[list].map((row, j) => (j === i ? { ...row, ...patch } : row)),
  }));
  const r = useMemo(() => typedNetwork(s, { streams: advanced, linear: advanced }), [s, advanced]);
  return (
    <>
      <div className="text-xs text-slate-300">
        Type a gathering system and solve it whole. The view opens on the {TEACHING_NETWORK_NAME} teaching network at the
        module default tolerance of {String(DEFAULT_TOLERANCE_LB_D)} and iteration cap of {DEFAULT_MAX_ITER}, and every input
        can be retyped.
        {advanced
          ? ' The tested splits ride on each well\'s solved mass along the solved flow directions, and the linearised twin is solved by its closed form.'
          : ''}
      </div>
      <div className="mt-3">
        <TypedNetworkInputs s={s} setTop={setTop} setRow={setRow} advanced={advanced} />
      </div>
      {r.ok ? <TypedNetworkResults r={r} advanced={advanced} /> : <Note>{r.errors.join(' ')}</Note>}
      <Note>
        Pressures and masses print to {TYPED_PRINT_DP.pressure} decimals and the relative conservation gap to{' '}
        {TYPED_PRINT_DP.fraction}. The converged flag is what the iteration says about itself; the conservation gap is
        what an audit says about the answer.
      </Note>
    </>
  );
};

export default TypedNetworkView;
