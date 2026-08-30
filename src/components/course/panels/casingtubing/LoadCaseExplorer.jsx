import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  LOAD_CASE_KINDS, PUBLISHED, runCase, runAllCases, shoeOnlyComparison, verdictThresholds,
} from './casingTubingLab';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Load case explorer: the two pressure columns down the hole, the differential
// that drives each check, and the section verdicts the whole-profile scan gives.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const sf = (v) => (Number.isFinite(v) ? fmt(v, 6) : 'none');

const CASE_OPTIONS = LOAD_CASE_KINDS.map((k) => ({ value: k, label: k }));
const MODES = [
  { value: 'profile', label: 'One case' },
  { value: 'matrix', label: 'All seven' },
  { value: 'governing', label: 'Governing depth' },
];
const STATUS_COLOUR = { PASS: 'text-[#BFFF00]', WARNING: 'text-amber-400', FAIL: 'text-rose-400' };

const Profile = () => {
  const [kind, setKind] = useState('gasKickBurst');
  const run = useMemo(() => runCase(kind), [kind]);
  const rows = useMemo(() => run.rows.map((r) => ({
    tvd: r.tvdM,
    pi: r.piPa / 1e6,
    po: r.poPa / 1e6,
    dp: (r.piPa - r.poPa) / 1e6,
    fa: r.faN / 1e3,
  })), [run]);
  return (
    <>
      <SelectField label="Load case" value={kind} onChange={setKind} options={CASE_OPTIONS} />
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="tvd" type="number" domain={[0, 'auto']} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'true vertical depth (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'MPa, or kN for axial', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={PUBLISHED.breakTvdM} stroke="#f59e0b" strokeDasharray="4 4" />
            <Line dataKey="pi" name="inside" stroke="#fb7185" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line dataKey="po" name="outside" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line dataKey="dp" name="inside less outside" stroke="#BFFF00" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line dataKey="fa" name="axial (kN)" stroke="#94a3b8" strokeWidth={1} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">section</th><th className="text-right pr-3">burst SF</th>
              <th className="text-right pr-3">at TVD</th><th className="text-right pr-3">collapse SF</th>
              <th className="text-right pr-3">at TVD</th><th className="text-right pr-3">regime</th>
              <th className="text-right pr-3">tension SF</th><th className="text-right pr-3">triaxial SF</th>
              <th className="text-right">status</th>
            </tr>
          </thead>
          <tbody>
            {run.sections.map((s, i) => (
              <tr key={`sec${i + 1}`}>
                <td className="pr-3">{i + 1}</td>
                <td className="text-right pr-3">{sf(s.burstSF)}</td>
                <td className="text-right pr-3">{s.burstAtTvdM == null ? '-' : fmt(s.burstAtTvdM, 3)}</td>
                <td className="text-right pr-3">{sf(s.collapseSF)}</td>
                <td className="text-right pr-3">{s.collapseAtTvdM == null ? '-' : fmt(s.collapseAtTvdM, 3)}</td>
                <td className="text-right pr-3">{s.collapseRegime || '-'}</td>
                <td className="text-right pr-3">{sf(s.tensionSF)}</td>
                <td className="text-right pr-3">{sf(s.triaxSF)}</td>
                <td className={`text-right ${STATUS_COLOUR[s.status]}`}>{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        A load case is two pressure columns and an axial profile, nothing more. Burst is driven by
        inside less outside and collapse by outside less inside, so on any one case at any one
        depth at most one of the two exists. The axial profile is the buoyed weight hanging below
        each depth, which is why it goes to zero at the shoe.
      </Note>
    </>
  );
};

const Matrix = () => {
  const runs = useMemo(() => runAllCases(), []);
  const th = verdictThresholds();
  return (
    <>
      <div className="overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">case</th><th className="text-left pr-3">sec</th>
              <th className="text-right pr-3">burst</th><th className="text-right pr-3">collapse</th>
              <th className="text-right pr-3">tension</th><th className="text-right pr-3">triaxial</th>
              <th className="text-right">status</th>
            </tr>
          </thead>
          <tbody>
            {LOAD_CASE_KINDS.flatMap((k) => runs[k].sections.map((s, i) => (
              <tr key={`${k}-${i + 1}`}>
                <td className="pr-3">{i === 0 ? k : ''}</td>
                <td className="pr-3">{i + 1}</td>
                <td className="text-right pr-3">{sf(s.burstSF)}</td>
                <td className="text-right pr-3">{sf(s.collapseSF)}</td>
                <td className="text-right pr-3">{sf(s.tensionSF)}</td>
                <td className="text-right pr-3">{sf(s.triaxSF)}</td>
                <td className={`text-right ${STATUS_COLOUR[s.status]}`}>{s.status}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      <TileGrid>
        <Tile label="Burst design factor" value={fmt(th.burst, 2)} />
        <Tile label="Collapse design factor" value={fmt(th.collapse, 2)} />
        <Tile label="Tension design factor" value={fmt(th.tension, 2)} />
        <Tile label="Triaxial design factor" value={fmt(th.triaxial, 2)} />
        <Tile label="Burst warning below" value={fmt(th.burstWarn, 4)} />
        <Tile label="Triaxial warning below" value={fmt(th.triaxialWarn, 4)} />
      </TileGrid>
      <Note>
        Fourteen evaluations, seven cases on two sections. Exactly one of them is not a PASS, and
        the check that produced it is the triaxial one rather than any of the three named checks
        the case is called after. A string that passes burst and collapse and tension separately
        can still be too close to yield once all three act together.
      </Note>
    </>
  );
};

const Governing = () => {
  const kick = useMemo(() => shoeOnlyComparison('gasKickBurst'), []);
  const test = useMemo(() => shoeOnlyComparison('pressureTestBurst'), []);
  return (
    <>
      <TileGrid>
        <Tile label="Gas kick, section 1 scanned" value={fmt(kick[0].scannedSf, 6)} />
        <Tile label="Gas kick, section 1 at its bottom" value={fmt(kick[0].bottomSf, 6)} />
        <Tile label="Overstatement" value={fmt(100 * (kick[0].overstatement - 1), 3)} unit="pct" />
        <Tile label="Governing depth" value={fmt(kick[0].governingTvdM, 3)} unit="m TVD" />
        <Tile label="Pressure test, section 2 scanned" value={fmt(test[1].scannedSf, 6)} />
        <Tile label="Its governing depth" value={fmt(test[1].governingTvdM, 3)} unit="m TVD" />
      </TileGrid>
      <div className="mt-3 text-xs text-slate-300">
        On the gas kick the differential SHRINKS with depth, because the gas column inside loses
        far less pressure per metre than the water column outside gains. So the worst point is the
        wellhead. On the pressure test the differential GROWS with depth, because the mud inside
        outweighs the water outside, so the worst point is the deepest one. Two burst cases on one
        string, and their governing depths are at opposite ends of it.
      </div>
      <Note>
        This is the whole reason the check scans every depth inside a section rather than
        evaluating the section shoe. Evaluating only the bottom of the surface section on the gas
        kick would have reported a safety factor 41.8 percent higher than the real one, and a
        design factor of 1.1 does not survive an error of that size.
      </Note>
    </>
  );
};

const LoadCaseExplorer = () => {
  const [mode, setMode] = useState('profile');
  return (
    <PanelShell
      title="Load case explorer"
      subtitle="Two pressure columns, an axial profile, and the section verdicts they produce"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'profile' && <Profile />}
        {mode === 'matrix' && <Matrix />}
        {mode === 'governing' && <Governing />}
      </div>
    </PanelShell>
  );
};

export default LoadCaseExplorer;
