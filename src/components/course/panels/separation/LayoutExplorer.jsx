import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, ScatterChart, Scatter, Bar, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import { distancesAndSetbacks, stationJudged, layoutReading } from './separationLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Layout explorer, the Professional and Expert tiers. THE PLOT: distances on a
// sphere, a flare and a pool fire setback computed from their own duty, the
// whole layout reading with its four separate answers, the two rankings that
// disagree, and the spacing table shown as a table.
//
// Every figure on this page is a return value from separationLab, which is a
// return value from the vendored Facility Layout Mapper engine on the teaching
// site, the ERHA flow station. Nothing here computes a distance, a setback or a
// verdict, and nothing reads a clock.
//
// SITE WORK IS IN METRES throughout, heat release in kilowatts.

const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

export const MODES = [
  ['distances', 'Distances: the ERHA site plan, the pairs, and the published cases against Vincenty'],
  ['setbacks', 'Setbacks: the flare and the pool fire, computed from their own duty'],
  ['check', 'Check: checked, zero requirement, violations, skipped, complete and pass'],
  ['rankings', 'Rankings: the two the engine returns, and the single one it retired'],
  ['table', 'Table: the spacing figures used, and the null a pair the table does not carry returns'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={i} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
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

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const DistancesMode = ({ ds, sj }) => {
  if (!ds) return <Note>The distance reader did not return the site plan.</Note>;
  const plan = (sj?.neighbours || []).map((r) => ({ x: r.distanceM, y: r.requiredM === null ? 0 : r.requiredM, name: r.name }));
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        The ERHA station sits at {six(ds.datum.lat)} north, {six(ds.datum.lon)} east. The engine measures on a sphere,
        because a site plan at a real latitude is not a flat grid.
      </p>
      <Tbl
        head={['from', 'to', 'distance m']}
        rows={ds.distances.map((d) => [d.fromName, d.toName, four(d.distanceM)])}
      />
      {plan.length > 0 && (
        <div className="h-48 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 15, left: 20 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name="nearest neighbour, m" tick={AXIS} label={{ value: 'distance to nearest neighbour, m', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -10 }} />
              <YAxis type="number" dataKey="y" name="table requirement, m" tick={AXIS} />
              <ZAxis range={[60, 60]} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
              <Scatter data={plan} name="each placed item" fill="#38bdf8" isAnimationActive={false} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
      <Tbl
        head={['published distance case', 'haversine m', 'Vincenty m (golden)', 'chord m (golden)']}
        rows={ds.publishedDistances.map((c) => [c.name, four(c.haversineM), four(c.vincentyM), four(c.chordM)])}
      />
      <Note>
        On every published case the haversine distance, an independent Vincenty solution and the three-dimensional chord
        agree to the printed precision. At the scale of a production site the three methods are the same answer, and the
        check exists so that a change of method would show.
      </Note>
    </>
  );
};

export const SetbacksMode = ({ ds }) => {
  if (!ds) return <Note>The setback reader did not return the duties.</Note>;
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Flare relief rate" value={six(ds.flareInput.reliefRateKgS)} unit={`kg/s at ${six(ds.flareInput.lhvKjKg)} kJ/kg`} />
          <Tile label="Heat release" value={four(ds.flare.qKw)} unit="kW" />
          <Tile label="Fraction radiated" value={six(ds.flareInput.fractionRadiated)} unit={`allowable ${six(ds.flareInput.allowableKwM2)} kW/m2`} />
          <Tile label="Setback" value={four(ds.flare.distanceM)} unit="m" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A radiation setback is computed from the duty, so it moves when the duty moves. Double the relief rate and the
        setback grows with the square root of the heat release.
      </p>
      <Tbl
        head={['allowable kW/m2', 'what the label says it is for']}
        rows={ds.radiationLevels.map((r) => [six(r.kWm2), r.label])}
      />
      <Tbl
        head={['published flare case', 'kW', 'setback m', 'intensity back at that distance, kW/m2 (golden)']}
        rows={ds.publishedFlare.map((c) => [c.name, four(c.qKw), four(c.distanceM), four(c.intensityAtDistance)])}
      />
      <div className="mt-4">
        <TileGrid>
          <Tile label="The bund" value={six(ds.poolInput.poolDiameterM)} unit={`m across, ${four(ds.pool.areaM2)} m2 of pool`} />
          <Tile label="Burning at" value={six(ds.poolInput.burnRateKgM2S)} unit={`kg/m2/s, so ${four(ds.pool.burnRateKgS)} kg/s`} />
          <Tile label="Heat release" value={four(ds.pool.qKw)} unit="kW" />
          <Tile label="Flame height by Thomas" value={four(ds.pool.flameHeightM)} unit="m" />
          <Tile label="Radius from the pool CENTRE" value={four(ds.pool.radiusFromCentreM)} unit="m" />
          <Tile label="Setback from the pool EDGE" value={four(ds.pool.setbackFromEdgeM)} unit="m" />
          <Tile label="setbackStatus" value={ds.pool.setbackStatus} />
          <Tile label="The difference (derived)" value={four(ds.halfPoolDiameterDerivedM)} unit="m, half the pool diameter" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        That difference is the defect the Suite layer carried. The layout check measures centre to centre and the tank
        icon is the pool centre, so passing the setback measured from the EDGE made every check short by half the bund and
        the check failed open.
      </p>
      <Tbl
        head={['published pool fire case', 'kW', 'flame m', 'radius m', 'edge setback m', 'setbackStatus']}
        rows={ds.publishedPool.map((c) => [c.name, four(c.qKw), four(c.flameHeightM), four(c.radiusFromCentreM), four(c.setbackFromEdgeM), c.setbackStatus])}
      />
      <Note>
        The pool fire model is a POINT SOURCE. It computes no view factor and no solid-flame surface emissive power, and
        inside the flame height it under-predicts, which is why the engine flags that case and reports a setback of zero
        with a status rather than answering it flat.
      </Note>
    </>
  );
};

export const CheckMode = ({ sj, lr }) => {
  if (!sj || !lr) return <Note>The layout reader did not return the check.</Note>;
  const bars = sj.violations.map((v) => ({ pair: `${v.aId} to ${v.bId}`, shortfall: v.shortfallM }));
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Comparisons with a positive requirement" value={String(sj.checked)} unit="checked" />
          <Tile label="Pairs with no requirement" value={String(sj.zeroRequirementPairs)} unit="a table figure of zero" />
          <Tile label="Comparisons that failed" value={String(sj.violationCount)} unit="violations" />
          <Tile label="Type pairs the table has no figure for" value={String(sj.unknownPairCount)} unit="unknown" />
          <Tile label="Items skipped" value={String(sj.skipped.length)} />
          <Tile label="complete" value={String(sj.complete)} unit="was the layout fully judged" />
          <Tile label="pass" value={String(sj.pass)} unit="did the comparisons made all clear" />
          <Tile label="passStatus" value={sj.passStatus} />
        </TileGrid>
      </div>
      <Tbl
        head={['kind', 'from', 'to', 'actual m', 'required m', 'shortfall m', 'shortfall fraction']}
        rows={sj.violations.map((v) => [v.kind, v.aName, v.bName, four(v.actualM), four(v.requiredM), four(v.shortfallM), six(v.shortfallFraction)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} layout="vertical" margin={{ top: 10, right: 20, bottom: 5, left: 80 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis type="number" tick={AXIS} />
            <YAxis type="category" dataKey="pair" tick={{ ...AXIS, fontSize: 9 }} width={80} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <ReferenceLine x={0} stroke="#94a3b8" />
            <Bar dataKey="shortfall" name="shortfall, m" fill="#f472b6" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['item skipped', 'why']}
        rows={sj.skipped.map((s) => [s.id, s.reason])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        What the half-bund correction is worth on this plot. The retired Suite layer handed the check the setback from
        the pool EDGE, {four(sj.retiredEdge.edgeSetbackM)} m, where the check measures centre to centre and the real
        requirement is {four(sj.retiredEdge.radiusFromCentreM)} m. The same plot judged both ways:
      </p>
      <Tbl
        head={['pair', 'actual m', 'required from the centre m', 'shortfall m', 'the retired edge figure m', 'residual shortfall under the retired figure m']}
        rows={sj.retiredEdge.rows.map((r) => [`Crude tank to ${r.bName}`, four(r.actualM), four(r.requiredM), four(r.shortfallM),
          four(r.retiredRequiredM), r.retiredShortfallM === null ? 'not flagged at all' : four(r.retiredShortfallM)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Every row&apos;s two shortfalls differ by {four(sj.retiredEdge.halfBundDerivedM)} m, the half bund. The heater
        treater shows what the defect cost: {four(sj.retiredEdge.heaterTreaterShortfallM)} m short of the real
        requirement and only {four(sj.retiredEdge.heaterTreaterRetiredShortfallM)} m short of the retired one. Judged the
        retired way the plot still fails, {String(sj.retiredEdge.retiredViolationCount)} breaches against
        {' '}{String(sj.violationCount)}, so the defect never showed as a pass. It showed as a smaller number, which is the
        harder kind to notice.
      </p>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Complete and pass answer different questions. Complete says the layout was fully judged, and it is false here
        because things were skipped and some type pairs have no table figure. Pass says the comparisons that were made all
        cleared. A layout can pass and still be incomplete.
      </p>
      <Tbl
        head={['published layout case', 'checked', 'zero requirement', 'violations', 'complete', 'pass', 'passStatus', 'the retired rule said pass']}
        rows={lr.published.map((c) => [c.name, String(c.checked), String(c.zeroRequirementPairs), String(c.violationCount),
          String(c.complete), String(c.pass), c.passStatus, String(c.retiredPass)])}
      />
      <Note>
        Nothing checked is not a pass. On the case where every item is unplaced the engine answers pass null with
        passStatus nothing-checked, where the retired rule answered pass true and a reviewer would have signed it.
      </Note>
    </>
  );
};

export const RankingsMode = ({ sj, lr }) => {
  if (!sj || !lr) return <Note>The layout reader did not return the rankings.</Note>;
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="worstAbsolute names" value={`${sj.worstAbsolute.aName} to ${sj.worstAbsolute.bName}`} />
          <Tile label="Short by" value={four(sj.worstAbsolute.shortfallM)} unit={`m of ${four(sj.worstAbsolute.requiredM)} m`} />
          <Tile label="worstRelative names" value={`${sj.worstRelative.aName} to ${sj.worstRelative.bName}`} />
          <Tile label="Short by" value={six(sj.worstRelative.shortfallFraction)} unit={`of its requirement, ${four(sj.worstRelative.requiredM)} m`} />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Two rankings are returned and neither is called the worst on its own. They name different pairs here. A pair a
        couple of metres short of a three metre figure is the worst RELATIVE breach, while a control room tens of metres
        short of ninety is the worst ABSOLUTE one, and which of the two matters is a judgement the engine leaves to the
        reviewer.
      </p>
      <Tbl
        head={['published layout case', 'worstAbsolute', 'its shortfall m', 'worstRelative', 'its fraction', 'the retired single ranking (history)']}
        rows={lr.published.map((c) => [
          c.name,
          c.worstAbsolute ? `${c.worstAbsolute.kind} ${c.worstAbsolute.aId} to ${c.worstAbsolute.bId}` : 'none',
          c.worstAbsolute ? four(c.worstAbsolute.shortfallM) : 'none',
          c.worstRelative ? `${c.worstRelative.kind} ${c.worstRelative.aId} to ${c.worstRelative.bId}` : 'none',
          c.worstRelative ? six(c.worstRelative.shortfallFraction) : 'none',
          c.retiredWorstPair ? c.retiredWorstPair.join(' ') : 'null',
        ])}
      />
      <Note>
        The retired code returned one ranking, built on the relative shortfall, and called it worst. Where the two
        rankings disagree that single answer sent a reviewer to the tightest small gap on the plot and never mentioned the
        largest one.
      </Note>
    </>
  );
};

export const TableMode = ({ ds }) => {
  if (!ds) return <Note>The table reader did not return the figures.</Note>;
  return (
    <>
      <Tbl
        head={['pair of equipment types', 'required m']}
        rows={ds.table.map((r) => [`${r.typeA} to ${r.typeB}`, r.requiredM === null ? 'null, the table has no figure' : six(r.requiredM)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The lookup is symmetric, so a pair reads the same in either order. A pair the table does not carry comes back as
        null rather than a guess, which is why a real plot with a modern skid or a flow meter on it reports incomplete the
        moment it is checked.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="A figure of zero" value="no requirement" unit="counted separately, never as a check" />
          <Tile label="A null" value="no figure at all" unit="the pair is reported as unknown" />
          <Tile label="A table figure" value="a table figure" unit="it is never a calculation" />
          <Tile label="A radiation setback" value="computed" unit="it moves when the duty moves" />
        </TileGrid>
      </div>
      <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
        <p className="text-amber-300 text-xs font-medium mb-1">HELD FOR LITERATURE</p>
        <p className="text-xs text-slate-300 mb-2">{ds.heldTable.note}</p>
        <p className="text-xs text-slate-300 mb-0">{ds.heldLabels.note}</p>
      </div>
    </>
  );
};

const LayoutExplorer = ({ initialMode = 'distances' }) => {
  const [mode, setMode] = useState(initialMode);
  const ds = useMemo(() => (['distances', 'setbacks', 'table'].includes(mode) ? safe(distancesAndSetbacks) : null), [mode]);
  const sj = useMemo(() => (['distances', 'check', 'rankings'].includes(mode) ? safe(stationJudged) : null), [mode]);
  const lr = useMemo(() => (['check', 'rankings'].includes(mode) ? safe(layoutReading) : null), [mode]);

  return (
    <PanelShell
      title="Layout explorer"
      subtitle="The ERHA flow station in metres: distances on a sphere, the flare and pool fire setbacks computed from their own duty, the whole layout reading, the two rankings, and the spacing table."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'distances' && <DistancesMode ds={ds} sj={sj} />}
        {mode === 'setbacks' && <SetbacksMode ds={ds} />}
        {mode === 'check' && <CheckMode sj={sj} lr={lr} />}
        {mode === 'rankings' && <RankingsMode sj={sj} lr={lr} />}
        {mode === 'table' && <TableMode ds={ds} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored layout engine on the teaching site, printed to the
        precision the teaching digest prints. Distances and setbacks are in metres, areas in square metres, heat release
        in kilowatts, and intensities in kilowatts per square metre.
      </Note>
    </PanelShell>
  );
};

export default LayoutExplorer;
