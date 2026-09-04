import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { trunkExplorer } from './networkLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Trunk explorer, the Associate tier. The LINE, and one well on its own.
//
// Five modes. The pipe table and the redundancy that is its only self check,
// what a wall can hold and what a design factor is, a fitting count as a
// length of pipe, the three node kinds with the eleven refusals that are
// refusals rather than repairs, and one well solved on its own flowline
// against the boundary.
//
// Every figure on this page is a return value from networkLab, which is a
// return value from the vendored pipe schedule and network solver engines.
// Nothing here computes a rating, a length, a pressure or a rate. And every
// solve on this page carries its CONSERVATION GAP beside its converged flag,
// because a converged flag on its own is the thing this whole course is about.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const tiny = (v) => {
  if (!Number.isFinite(v)) return '-';
  if (v === 0) return '0';
  return Math.abs(v) < 0.0005 ? v.toExponential(3) : fmt(v, 8);
};

const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['table', 'The pipe table, and the redundancy that checks it'],
  ['wall', 'What a wall can hold, and the design factor that is an input'],
  ['fittings', 'A fitting count as a length of pipe'],
  ['topology', 'Three node kinds, and what a drawing has to be'],
  ['solo', 'One well on its own line, against the boundary'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

// --------------------------------------------------------------------------

const Table = () => {
  const data = useMemo(() => {
    try {
      return {
        rows: trunkExplorer.scheduleRows(),
        check: trunkExplorer.tableSelfCheck(),
        pairs: trunkExplorer.schedulePairs(),
        refusals: trunkExplorer.scheduleRefusals(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A pipe schedule is a published table rather than a calculation, so with the module absent there is nothing to read off.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="Rows in the table" value={fmt(data.check.rowCount, 0)} />
        <Tile label="Rows failing the header own statement, run as equality" value={fmt(data.check.rowsFailingStrictEquality, 0)} />
        <Tile label="The largest residual in the table" value={tiny(data.check.largestResidualIn)} unit="in" />
        <Tile label="The band the shipped gate uses" value={fmt(data.check.gateBandIn, 6)} unit="in" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">NPS</th>
              <th className="text-left pr-3">schedule</th>
              <th className="text-left pr-3">outside diameter, in</th>
              <th className="text-left pr-3">wall, in</th>
              <th className="text-left pr-3">published bore, in</th>
              <th className="text-left pr-3">od less two walls, in</th>
              <th className="text-left pr-3">residual, in</th>
              <th className="text-left">equality holds</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={`${r.nps}-${r.schedule}`}>
                <td className="pr-3">{fmt(r.nps, 0)}</td>
                <td className="pr-3">{r.schedule}</td>
                <td className="pr-3">{fmt(r.odIn, 4)}</td>
                <td className="pr-3">{fmt(r.wallIn, 4)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.publishedBoreIn, 4)}</td>
                <td className="pr-3">{fmt(r.odMinusTwoWallsIn, 16)}</td>
                <td className="pr-3">{tiny(r.residualIn)}</td>
                <td className={r.strictEqualityHolds ? '' : 'text-[#f97316]'}>{yn(r.strictEqualityHolds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE REDUNDANCY IS THE CHECK, AND THE GATE IS WIDER THAN THE THING IT CHECKS FOR. Every row
        carries the outside diameter, the wall AND the published bore even though the third is
        arithmetically the first two, because a transcription error in any one of the three makes
        the outside diameter less two walls stop equalling the bore. Run as written, one row already
        misses, by {tiny(data.check.largestResidualIn)} in, which is floating point residue and not
        a transcription error. The shipped gate does not run it as equality: it admits anything
        within {fmt(data.check.gateBandIn, 6)} in, which is
        {' '}{fmt(data.check.bandOverLargestResidual, 0)} times wider than anything the table
        actually needs. A bore typed as {fmt(data.check.typoBoreIn, 4)} in instead of
        {' '}{fmt(data.rows.find((r) => r.nps === 6 && r.schedule === '40').publishedBoreIn, 4)} in
        is a real error and the gate still passes it: {yn(data.check.typoPassesTheGate)}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">NPS</th>
              <th className="text-left pr-3">outside diameter, in</th>
              <th className="text-left pr-3">wall 40 against 80, in</th>
              <th className="text-left pr-3">bore 40 against 80, in</th>
              <th className="text-left pr-3">bore lost, in</th>
              <th className="text-left">flow area lost, percent</th>
            </tr>
          </thead>
          <tbody>
            {data.pairs.map((r) => (
              <tr key={r.nps}>
                <td className="pr-3">{fmt(r.nps, 0)}</td>
                <td className="pr-3">{fmt(r.odIn, 4)}</td>
                <td className="pr-3">{fmt(r.wall40In, 4)} against {fmt(r.wall80In, 4)}</td>
                <td className="pr-3">{fmt(r.bore40In, 4)} against {fmt(r.bore80In, 4)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.boreLostIn, 6)}</td>
                <td>{fmt(r.flowAreaLostPct, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        A SIZE THAT IS NOT IN THE TABLE RETURNS NOTHING RATHER THAN A NEARBY ONE.
        {' '}{data.refusals.map((r) => `${r.call} returns ${r.isNull ? 'null' : 'a row'}`).join('; ')}.
        The table is a working subset of the standard and it says so, because reproducing a hundred
        rows of a published table from memory is exactly what this package does not do. And there is
        no Python referee for this module anywhere, so that gate is the only thing standing behind
        it: {yn(data.check.thereIsNoPythonOracleForThisTable)}.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Wall = () => {
  const [which, setWhich] = useState('grade');
  const data = useMemo(() => {
    try {
      return {
        published: trunkExplorer.publishedBarlow(),
        scalings: trunkExplorer.barlowScalings(),
        grades: trunkExplorer.barlowGrades(),
        gradeRows: trunkExplorer.grades(),
        teaching: trunkExplorer.teachingLine(),
        factors: trunkExplorer.barlowDesignFactors(),
        refusals: trunkExplorer.barlowRefusals(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A rating needs an outside diameter, a wall and a minimum yield. With any of those missing the module returns a not-a-number rather than a rating.</Note>;
  }
  const chart = which === 'grade'
    ? data.grades.map((r) => ({ x: r.yieldPsi, rating: r.ratingPsi }))
    : data.factors.map((r) => ({ x: r.designFactor, rating: r.ratingPsi }));
  const label = which === 'grade' ? 'minimum yield, psi' : 'design factor';
  return (
    <>
      <FieldGrid>
        <SelectField label="Sweep" value={which} onChange={setWhich}
          options={[
            ['grade', 'Grade, on the published pipe at the gate design factor'],
            ['factor', 'Design factor, on the teaching line'],
          ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="The published pipe, rated" value={fmt(data.published.ratingPsi, 6)} unit="psi" />
          <Tile label="The same wall with NO design factor" value={fmt(data.published.bareHoopPsi, 6)} unit="psi" />
          <Tile label="Which is larger by" value={fmt(data.published.bareOverRated, 6)} unit="times" />
          <Tile label="The teaching line, rated" value={fmt(data.teaching.ratingPsi, 6)} unit="psi" />
        </TileGrid>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: label, position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'rating, psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="rating" name="Barlow rating, psi"
              stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {which === 'grade' ? (
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">grade</th>
                <th className="text-left pr-3">minimum yield, psi</th>
                <th className="text-left pr-3">design factor</th>
                <th className="text-left pr-3">rating, psi</th>
                <th className="text-left pr-3">bare hoop, psi</th>
                <th className="text-left">the published case</th>
              </tr>
            </thead>
            <tbody>
              {data.grades.map((r) => (
                <tr key={r.gradeId}>
                  <td className="pr-3">{r.label || r.gradeId}</td>
                  <td className="pr-3">{fmt(r.yieldPsi, 0)}</td>
                  <td className="pr-3">{fmt(r.designFactor, 2)}</td>
                  <td className="pr-3 text-[#BFFF00]">{fmt(r.ratingPsi, 6)}</td>
                  <td className="pr-3">{fmt(r.bareHoopPsi, 6)}</td>
                  <td>{yn(r.published)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">design factor</th>
                <th className="text-left pr-3">rating, psi</th>
                <th className="text-left pr-3">as a fraction of the bare hoop</th>
                <th className="text-left">no design factor at all</th>
              </tr>
            </thead>
            <tbody>
              {data.factors.map((r) => (
                <tr key={r.designFactor}>
                  <td className="pr-3">{fmt(r.designFactor, 2)}</td>
                  <td className="pr-3 text-[#BFFF00]">{fmt(r.ratingPsi, 6)}</td>
                  <td className="pr-3">{fmt(1 / r.bareOverRated, 6)}</td>
                  <td className={r.noDesignFactorAtAll ? 'text-[#f97316]' : ''}>{yn(r.noDesignFactorAtAll)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 text-xs text-slate-300">
        THE DESIGN FACTOR IS AN INPUT AND IT IS NEVER DEFAULTED, because it is the whole regulatory
        content of the number: it differs by code, by class location and by fluid, and burying one
        in the module would be pretending a jurisdiction. Leave it out and the return is the bare
        hoop stress, {fmt(data.published.bareHoopPsi, 6)} psi on the published pipe, which is
        {' '}{fmt(data.published.bareOverRated, 6)} times the rating and is not a pressure anybody
        may operate to. Barlow is linear in the wall, so twice the wall is
        {' '}{fmt(data.scalings[1].ratioToPublished, 6)} times the rating, and inverse in the
        OUTSIDE diameter, so twice the diameter is {fmt(data.scalings[2].ratioToPublished, 6)} times
        it. Substituting the bore for the outside diameter pushes the answer the wrong way, because
        the bore is the smaller number.
      </div>
      <Note>
        What it refuses, and it refuses as a bare not-a-number rather than as an object with a
        reason: {data.refusals.map((r) => `${r.label} (not a number: ${yn(r.isNaN)})`).join('; ')}.
        An unknown grade id does the same:
        {' '}{yn(!data.gradeRows.find((r) => r.id === 'x55').resolved)}.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Fittings = () => {
  const [which, setWhich] = useState('friction');
  const data = useMemo(() => {
    try {
      return {
        fittings: trunkExplorer.fittings(),
        roughnesses: trunkExplorer.roughnesses(),
        published: trunkExplorer.publishedEquivalentLength(),
        friction: trunkExplorer.frictionRows(),
        bores: trunkExplorer.boreRows(),
        rule: trunkExplorer.thirtyDiametersRule(),
        teaching: trunkExplorer.teachingFittingRows(),
        headline: trunkExplorer.teachingFittingHeadline(),
        refusals: trunkExplorer.equivalentLengthRefusals(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>An equivalent length needs a bore and a friction factor, and the module refuses without both, because the equivalence is between a velocity head loss and a length of pipe.</Note>;
  }
  const chart = which === 'friction'
    ? data.friction.map((r) => ({ x: r.frictionFactor, lengthFt: r.lengthFt }))
    : data.bores.map((r) => ({ x: r.idIn, lengthFt: r.lengthFt }));
  const label = which === 'friction' ? 'friction factor' : 'bore, in';
  return (
    <>
      <FieldGrid>
        <SelectField label="Sweep" value={which} onChange={setWhich}
          options={[
            ['friction', 'Friction factor, on the published fitting count and bore'],
            ['bore', 'Bore, on the published fitting count and friction factor'],
          ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Sum of K on the published set" value={fmt(data.published.sumK, 6)} />
          <Tile label="Equivalent length at f 0.018" value={fmt(data.published.roughLengthFt, 6)} unit="ft" />
          <Tile label="Which is diameters of pipe" value={fmt(data.published.roughDiametersOfPipe, 6)} />
          <Tile label="The same fittings at f 0.012" value={fmt(data.published.smoothLengthFt, 6)} unit="ft" />
        </TileGrid>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: label, position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'equivalent length, ft', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="lengthFt" name="equivalent length, ft"
              stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">{which === 'friction' ? 'friction factor' : 'bore, in'}</th>
              <th className="text-left pr-3">length, ft</th>
              <th className="text-left pr-3">diameters of pipe</th>
              <th className="text-left">the published case</th>
            </tr>
          </thead>
          <tbody>
            {(which === 'friction' ? data.friction : data.bores).map((r) => (
              <tr key={which === 'friction' ? r.frictionFactor : r.idIn}>
                <td className="pr-3">{which === 'friction' ? fmt(r.frictionFactor, 4) : fmt(r.idIn, 4)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.lengthFt, 6)}</td>
                <td className="pr-3">{fmt(r.diametersOfPipe, 6)}</td>
                <td>{yn(r.published)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A FIXED DIAMETERS COUNT IS A FRICTION FACTOR IN DISGUISE. The count is the sum of K over the
        friction factor and nothing else, so a rule that puts this whole set at
        {' '}{fmt(data.rule.diametersPerFitting, 0)} diameters is assuming a friction factor of
        {' '}{fmt(data.rule.impliedFrictionFactorWholeList, 6)}. It is NOT assuming 0.02: that would
        put the same set at {fmt(data.rule.diametersAtFrictionFactorPointOhTwo, 6)} diameters,
        beside the engine {fmt(data.rule.engineDiametersOfPipe, 6)} at a friction factor of
        {' '}{fmt(data.rule.engineFrictionFactor, 4)}. AND THE SCOPE DECIDES THE SIGN. Applied once
        to the whole list it gives {fmt(data.rule.wholeListLengthFt, 6)} ft and understates the
        engine by {fmt(data.rule.wholeListUnderstatesByFactor, 6)} times. Read the conventional way,
        thirty diameters PER FITTING, the {fmt(data.rule.fittingCount, 0)} fittings come to
        {' '}{fmt(data.rule.perFittingDiameters, 0)} diameters and
        {' '}{fmt(data.rule.perFittingLengthFt, 6)} ft, which OVERSTATES by
        {' '}{fmt(data.rule.perFittingOverstatesByFactor, 6)} times. Anything written on this line
        has to say which reading it is using.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">on the teaching line</th>
              <th className="text-left pr-3">count</th>
              <th className="text-left pr-3">K each</th>
              <th className="text-left pr-3">K contributed</th>
              <th className="text-left pr-3">share, percent</th>
              <th className="text-left">worth, ft</th>
            </tr>
          </thead>
          <tbody>
            {data.teaching.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.count, 0)}</td>
                <td className="pr-3">{fmt(r.kEach, 4)}</td>
                <td className="pr-3">{fmt(r.sumK, 6)}</td>
                <td className="pr-3">{fmt(r.sharePct, 6)}</td>
                <td className="text-[#BFFF00]">{fmt(r.lengthFt, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-slate-300">
        ONE GLOBE VALVE IS WORTH MORE THAN EVERYTHING ELSE ON THAT LIST PUT TOGETHER. It carries
        {' '}{fmt(data.headline.worstSumK, 4)} of the {fmt(data.headline.totalSumK, 4)} total, which
        is {fmt(data.headline.worstSharePct, 6)} percent and
        {' '}{fmt(data.headline.worstLengthFt, 6)} ft of the
        {' '}{fmt(data.headline.totalLengthFt, 6)} ft, against
        {' '}{fmt(data.headline.everythingElseSumK, 4)} for everything else. That is the reason a
        fitting count is never a detail. And the smoother line is worth MORE feet, not fewer:
        {' '}{fmt(data.published.smoothLengthFt, 6)} ft against
        {' '}{fmt(data.published.roughLengthFt, 6)} ft, a factor of
        {' '}{fmt(data.published.smoothOverRough, 6)}, which reads backwards until you remember
        that the equivalence is between a loss and a LENGTH OF PIPE, and better pipe costs less per
        foot.
      </div>
      <Note>
        What it refuses, with a reason rather than a guess:
        {' '}{data.refusals.map((r) => `${r.label} (${r.error || 'accepted'})`).join(' ')} An
        unknown fitting id resolves to a not-a-number and never to a default, and so does an unknown
        roughness id.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Topology = () => {
  const data = useMemo(() => {
    try {
      return {
        kinds: trunkExplorer.nodeKinds,
        topology: trunkExplorer.topology(),
        conditions: trunkExplorer.conditions(),
        refusals: trunkExplorer.topologyRefusals(),
        limits: trunkExplorer.refusals(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A network needs at least one node, at least one well and a delivery point with a pressure. Without those there is nothing to index.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="Nodes" value={fmt(data.topology.nodeCount, 0)} />
        <Tile label="Branches" value={fmt(data.topology.branchCount, 0)} />
        <Tile label="Pressures the solver has to find" value={fmt(data.topology.unknownCount, 0)} />
        <Tile label="Delivery points" value={fmt(data.topology.sinkCount, 0)} />
      </TileGrid>
      <div className="mt-3 text-xs text-slate-300">
        The unknowns in the order the solver indexes them: {data.topology.unknownIds.join(', ')}.
        The separator is not among them, because a sink is a FIXED pressure and takes whatever
        arrives. That index is what every later function reads.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">node</th>
              <th className="text-left pr-3">kind</th>
              <th className="text-left pr-3">branches on it</th>
              <th className="text-left">its pressure is</th>
            </tr>
          </thead>
          <tbody>
            {data.topology.nodes.map((n) => (
              <tr key={n.id}>
                <td className="pr-3">{n.id} ({n.label})</td>
                <td className="pr-3">{n.kind}</td>
                <td className="pr-3">{fmt(n.branchCount, 0)}</td>
                <td className="text-[#BFFF00]">{n.pressureIsUnknown ? 'unknown, and solved for' : 'fixed, and given'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">branch</th>
              <th className="text-left pr-3">drawn from</th>
              <th className="text-left pr-3">drawn to</th>
              <th className="text-left pr-3">conductance, lb/d per root psi</th>
              <th className="text-left">capacity limit, lb/d</th>
            </tr>
          </thead>
          <tbody>
            {data.topology.branches.map((b) => (
              <tr key={b.id}>
                <td className="pr-3">{b.id} ({b.label})</td>
                <td className="pr-3">{b.from}</td>
                <td className="pr-3">{b.to}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(b.conductanceLbDPerRootPsi, 4)}</td>
                <td>{b.capacityLimitedLbD === null ? 'none' : fmt(b.capacityLimitedLbD, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE THREE NODE KINDS ARE THE WHOLE VOCABULARY.
        {' '}{data.kinds.map((k) => `A ${k.kind} ${k.note}`).join(' ')} Anything a real gathering
        system has that is not one of those three has to be written as a branch relation or left
        out.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">what was handed in</th>
              <th className="text-left pr-3">refused</th>
              <th className="text-left">what it said</th>
            </tr>
          </thead>
          <tbody>
            {data.refusals.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3 text-[#f97316]">{yn(r.refused)}</td>
                <td>{r.error || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        EVERY FAILURE HERE IS A REFUSAL WITH A REASON AND NEVER A REPAIR. The header says a network
        with a well that cannot reach a delivery point is not a network with a small problem, it is
        a drawing mistake, and solving it anyway would produce a confident answer about a system
        that does not exist. That is {fmt(data.refusals.length, 0)} refusals here and
        {' '}{fmt(data.limits.length, 0)} stated limits in all.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Solo = () => {
  const data = useMemo(() => {
    try {
      return {
        rows: trunkExplorer.solo(),
        reductions: trunkExplorer.seriesParallel(),
        conditions: trunkExplorer.conditions(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>One well on one line against one boundary is a two node problem, and it still needs a delivery point with a pressure before anything can be solved.</Note>;
  }
  const chart = data.rows.map((r) => ({
    name: r.label, drawdownPsi: r.drawdownPsi, lineDropPsi: r.lineDropPsi,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="The boundary they are all solved against" value={fmt(data.conditions.separatorPsia, 0)} unit="psia" />
        <Tile label="Wells on their own lines" value={fmt(data.rows.length, 0)} />
        <Tile label="How many report converged" value={fmt(data.rows.filter((r) => r.converged).length, 0)} />
        <Tile label="How many actually close their mass balance" value={fmt(data.rows.filter((r) => r.massBalanceCloses).length, 0)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="name" tick={AXIS} interval={0} angle={-12} textAnchor="end" height={44} />
            <YAxis tick={AXIS}
              label={{ value: 'pressure, psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="drawdownPsi" name="drawdown, reservoir to wellhead" fill="#BFFF00" isAnimationActive={false} />
            <Bar dataKey="lineDropPsi" name="line drop, wellhead to separator" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">well</th>
              <th className="text-left pr-3">qmax, lb/d</th>
              <th className="text-left pr-3">reservoir, psia</th>
              <th className="text-left pr-3">wellhead, psia</th>
              <th className="text-left pr-3">rate, lb/d</th>
              <th className="text-left pr-3">its line carries, lb/d</th>
              <th className="text-left pr-3">drawdown, psi</th>
              <th className="text-left">line drop, psi</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.qmaxLbD, 0)}</td>
                <td className="pr-3">{fmt(r.reservoirPressurePsia, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.wellheadPsia, 6)}</td>
                <td className="pr-3">{fmt(r.rateLbD, 6)}</td>
                <td className="pr-3">{fmt(r.flowlineLbD, 6)}</td>
                <td className="pr-3">{fmt(r.drawdownPsi, 6)}</td>
                <td>{fmt(r.lineDropPsi, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">well</th>
              <th className="text-left pr-3">iterations</th>
              <th className="text-left pr-3">converged</th>
              <th className="text-left pr-3">pinned</th>
              <th className="text-left pr-3">reported residual, lb/d</th>
              <th className="text-left">conservation gap, lb/d</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.iterations, 0)}</td>
                <td className="pr-3">{yn(r.converged)}</td>
                <td className="pr-3">{r.pinned.length ? r.pinned.join(', ') : 'none'}</td>
                <td className="pr-3 text-[#38bdf8]">{tiny(r.reportedResidualLbD)}</td>
                <td className={r.massBalanceCloses ? 'text-[#38bdf8]' : 'text-[#f97316]'}>{tiny(r.conservationGapLbD)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        READ THE LAST TWO COLUMNS TOGETHER, ALWAYS. The reported residual is what the ITERATION says
        about itself. The conservation gap is what an AUDIT says about the answer, and it is the
        only one of the two that can see a node the iteration left out of its own measurement.
        Three of these four wells agree on both. The fourth reports a residual of
        {' '}{tiny(data.rows[3].reportedResidualLbD)} lb/d and a gap of
        {' '}{fmt(data.rows[3].conservationGapLbD, 6)} lb/d, and the two are not in contradiction:
        they are answers to two different questions. Its allocation of
        {' '}{fmt(data.conditions.allocationLbD, 0)} lb/d is larger than its flowline can pass,
        which is {fmt(data.conditions.lineCapacityLbD, 0)} lb/d, so the line saturates, the node
        goes flat, it is pinned, and the difference stops being counted. On its own line it is
        already the case the whole Expert tier is about.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the topology reduces the way a network must</th>
              <th className="text-left pr-3">many branches, psia</th>
              <th className="text-left pr-3">one equivalent branch, psia</th>
              <th className="text-left">difference, psia</th>
            </tr>
          </thead>
          <tbody>
            {data.reductions.map((r) => (
              <tr key={r.rule}>
                <td className="pr-3">{r.rule}</td>
                <td className="pr-3">{fmt(r.manyBranchWellheadPsia, 9)}</td>
                <td className="pr-3">{fmt(r.oneBranchWellheadPsia, 9)}</td>
                <td className="text-[#BFFF00]">{tiny(r.differencePsia)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Both reductions are exact because a LINEAR branch is a resistor, and neither survives a
        turbulent branch. What one well on its own line cannot tell you is what the same well makes
        when three others are pushing into the same header, because every single-well study is run
        against a wellhead pressure somebody typed in.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const TrunkExplorer = ({ initialMode = 'table' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Trunk explorer"
      subtitle="The line before anything is solved together: the published pipe table and the redundancy that checks it, what a wall can hold and what a design factor is, a fitting count as a length of pipe, the three node kinds a drawing may use, and one well solved on its own flowline against the boundary"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'table' && <Table />}
        {mode === 'wall' && <Wall />}
        {mode === 'fittings' && <Fittings />}
        {mode === 'topology' && <Topology />}
        {mode === 'solo' && <Solo />}
      </div>
    </PanelShell>
  );
};

export default TrunkExplorer;
