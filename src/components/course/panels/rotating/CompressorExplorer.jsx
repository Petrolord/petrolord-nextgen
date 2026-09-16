import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  stageIsNotAPump, stageCountAndLimit, trainAndCooling, machineDriverFuel, refusalContract, heldItems,
} from './rotatingLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Compressor explorer, the Expert tier, with the inlet-volume view open to the
// Professional tier. THE SAME DISCIPLINE WITH THE FLUID NO LONGER
// INCOMPRESSIBLE: there is no curve the user can type in, so every answer comes
// out of a thermodynamic path rather than an intersection. The polytropic
// exponent carries the efficiency, the stage count is the larger of two limits
// and the engine names which one bound, and the train is tested at the inlet
// the stages will really have.
//
// Then the audit: what a refusal IS, the five exports that have nowhere to put
// one and hold a documented contract instead, four faults that used to share
// one sentence, the compressibility window one module in this package declares
// and this one imports, and a gate that could not fail beside one that can.
//
// Every figure on this page is a return value from rotatingLab, which is a
// return value from the vendored Compressor Station Designer engine on the
// teaching train SOKU K-2101. Nothing here computes an exponent, a temperature,
// a head, a power or a fuel rate, and nothing reads a clock.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no percentile
// label appears anywhere on this page.

const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const nine = (v) => (Number.isFinite(v) ? Number(v).toFixed(9) : 'none');
const raw = (v) => (v === null || v === undefined ? 'none' : String(v));

export const MODES = [
  ['stage', 'A stage: the polytropic exponent, both heads, and an identity that is not a check'],
  ['staging', 'The stage count: two limits, which one governed, and a refusal that carries its evidence'],
  ['train', 'The train: stage by stage with its cooling duty, and the trade that reverses'],
  ['volume', 'Actual inlet volume: what the machine screen turns on, and why it falls with pressure'],
  ['fuel', 'The driver and the fuel: taken out of the stream being compressed'],
  ['limits', 'Where both engines stop: what a refusal is, the bare-number contract, and the validity window'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const Tbl = ({ head, rows }) => (
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

const Held = ({ children }) => (
  <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">HELD FOR LITERATURE</p>
    <p className="text-xs text-slate-300 mb-0">{children}</p>
  </div>
);

const EngineSays = ({ label, message, tone = 'sky' }) => (
  <div className={`mt-2 rounded-md border p-2 ${tone === 'red' ? 'border-red-800/60 bg-red-950/20' : 'border-sky-800/60 bg-sky-950/20'}`}>
    <p className={`text-xs font-medium mb-1 ${tone === 'red' ? 'text-red-300' : 'text-sky-300'}`}>{label}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{message}</p>
  </div>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

const shapeText = (sh) => {
  if (!sh) return 'none';
  if (sh.scalar) return String(sh.value);
  return `{ ${sh.entries.map(([k, kind, v]) => {
    if (kind === 'function') return `${k}: <function>`;
    if (kind === 'string') return `${k}: "${v}"`;
    if (kind === 'array') return `${k}: [${v.join(' | ')}]`;
    if (kind === 'null') return `${k}: null`;
    if (kind === 'undefined') return `${k}: undefined`;
    if (kind === 'object') return `${k}: {object}`;
    return `${k}: ${String(v)}`;
  }).join(', ')} }`;
};

// ---------------------------------------------------------------------------

export const StageMode = ({ s }) => {
  if (!s) return <Note>The stage reader did not return the path.</Note>;
  const chart = s.etaSweep.map((r) => ({
    eta: r.polytropicEfficiency, discharge: r.tDischargeF, head: r.headPolyFtLbfLbm,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Polytropic exponent ratio" value={nine(s.exponentRatio)} />
        <Tile label="Isentropic exponent ratio" value={nine(s.isentropicExponentRatio)} />
        <Tile label="Discharge temperature" value={four(s.tDischargeF)} unit="degF" />
        <Tile label="Discharge pressure" value={four(s.pDischargePsia)} unit="psia" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The exponent that governs a real stage is not the isentropic one: their quotient is
        {' '}{nine(s.exponentQuotientDerived)}, which is one over the polytropic efficiency. Using the isentropic
        exponent would have predicted {four(s.isentropicDischargeF)} degF, which is
        {' '}{four(s.isentropicBelowDerivedF)} degF below the real discharge. That gap is the whole of what an
        irreversible path costs in temperature.
      </p>
      <Tbl
        head={['quantity', 'value', 'unit']}
        rows={[
          ['compressibility at suction', nine(s.z1), ''],
          ['compressibility at discharge', nine(s.z2), ''],
          ['compressibility averaged', nine(s.zAvg), ''],
          ['the two ends differ by', nine(s.zSpreadDerived), ''],
          ['mass flow', four(s.massLbHr), 'lb per hr'],
          ['polytropic head', four(s.headPolyFtLbfLbm), 'ft lbf per lbm'],
          ['isentropic head', four(s.headIsenFtLbfLbm), 'ft lbf per lbm'],
          ['their quotient', nine(s.headQuotientDerived), ''],
          ['polytropic efficiency', nine(s.polytropicEfficiency), ''],
          ['isentropic efficiency', nine(s.isentropicEfficiency), ''],
          ['gas power, polytropic route', four(s.gasHp), 'hp'],
          ['gas power, isentropic route', four(s.gasHpIsentropicRoute), 'hp'],
          ['brake power', four(s.brakeHp), 'hp'],
        ]}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Both heads are reported so neither gets quoted as the other, and the compressibility is evaluated at both ends
        and averaged rather than carrying the suction value through.
      </p>
      <div className="mt-3 rounded-md border border-slate-700 bg-[#0F172A] p-3">
        <p className="text-white text-xs font-medium mb-2">An identity is not a check</p>
        <p className="text-xs text-slate-400 mb-2">
          The two power routes above differ by {raw(s.gasHpDifferenceDerived)} hp. That agreement is an algebraic
          identity: the exponent ratio times the polytropic efficiency IS the isentropic exponent ratio, exactly, for
          every pair. The last column below is the difference, computed rather than asserted.
        </p>
        <Tbl
          head={['k', 'polytropic efficiency', 'exponent ratio', 'times the efficiency', 'the isentropic exponent ratio', 'difference']}
          rows={s.identity.map((r) => [six(r.k), six(r.polytropicEfficiency), nine(r.exponentRatio), raw(r.timesEfficiencyDerived), raw(r.isentropicExponentRatio), raw(r.differenceDerived)])}
        />
        <p className="text-xs text-slate-400 mt-2 mb-0">
          Because that identity holds for every input, including an input transcribed wrong, the agreement of the two
          horsepower figures is a shape property rather than evidence about either head. Ask the same question of every
          gate you meet: what input would make it fail? If there is none, it restates the formula rather than testing
          it.
        </p>
      </div>
      <Tbl
        head={['stated limit degF', 'discharge degF', 'warned']}
        rows={s.statedLimits.map((r) => [four(r.statedLimitF), four(r.tDischargeF), String(r.warned)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The hot-stage warning fires on the limit the CALLER stated. The discharge is the same
        {' '}{four(s.tDischargeF)} degF on all four rows, because a limit is a limit rather than an input to the
        thermodynamics. With no limit stated, the warning turns on between a ratio of
        {' '}{raw(s.defaultBracket.lowRatio)} and {raw(s.defaultBracket.highRatio)}, where the discharge temperatures
        are {raw(s.defaultBracket.lowDischargeF)} and {raw(s.defaultBracket.highDischargeF)} degF. That brackets the
        default the engine applies when the caller states none.
      </p>
      <Held>
        That default discharge-temperature limit. It is the figure the engine uses when the caller states none, it is
        measured out of the engine by bisection above rather than quoted, and it is a customary number with no
        publication behind it here. It is taught as a limit and never as an answer.
      </Held>
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="eta" tick={AXIS} label={{ value: 'polytropic efficiency', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="discharge" name="discharge, degF" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['k', 'exponent ratio', 'discharge degF', 'polytropic head ft lbf per lbm', 'gas hp']}
        rows={s.kSweep.map((r) => [six(r.k), nine(r.exponentRatio), four(r.tDischargeF), four(r.headPolyFtLbfLbm), four(r.gasHp)])}
      />
      <Tbl
        head={['ratio', 'discharge psia', 'discharge degF', 'polytropic head ft lbf per lbm', 'gas hp', 'warned']}
        rows={s.ratioSweep.map((r) => [six(r.ratio), four(r.pDischargePsia), four(r.tDischargeF), four(r.headPolyFtLbfLbm), four(r.gasHp), r.warned ? 'set' : 'null'])}
      />
    </>
  );
};

export const StagingMode = ({ s }) => {
  if (!s) return <Note>The staging reader did not return the counts.</Note>;
  const rows = s.sweep.filter((r) => !r.refused);
  const chart = rows.map((r) => ({
    discharge: r.pDischargePsia, stages: r.stages, brakeHp: r.totalBrakeHp,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Overall ratio" value={nine(s.overallRatio)} />
        <Tile label="Stages the ratio rule demands" value={raw(s.byRatio)} />
        <Tile label="Stages the temperature limit demands" value={raw(s.byTemp)} />
        <Tile label="Stages, governed by" value={`${raw(s.stages)} (${s.governedBy})`} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The count is the larger of two limits and the engine names which one bound, at a ratio per stage of
        {' '}{nine(s.ratioPerStage)}. It is chosen against the temperature the stages will ACTUALLY see: a single stage
        starts from the suction and is never cooled, and every stage after the first starts from the interstage
        approach, so the inlet a trial count is tested at is the suction for one stage and the hotter of the suction and
        the cooled temperature for more than one. This duty cools back to {four(s.duty.interstageCoolToF)} degF against
        a suction of {four(s.duty.tSuctionF)} degF.
      </p>
      <Tbl
        head={['discharge psia', 'by ratio', 'by temperature', 'stages', 'governed by', 'ratio per stage', 'brake hp', 'hottest stage degF', 'the stated limit less the hottest degF', 'cooling MMBtu per hr', 'fuel MMscfd']}
        rows={s.sweep.map((r) => (r.refused
          ? [six(r.pDischargePsia), 'refused', '', '', '', '', '', '', '', '', '']
          : [six(r.pDischargePsia), raw(r.byRatio), raw(r.byTemp), raw(r.stages), r.governedBy, nine(r.ratioPerStage), four(r.totalBrakeHp), four(r.hottestF), four(r.roomDerivedF), four(r.totalCoolingMMBtuHr), nine(r.fuelMMscfd)]))}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="discharge" tick={AXIS} label={{ value: 'discharge pressure, psia', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis yAxisId="left" tick={AXIS} />
            <YAxis yAxisId="right" orientation="right" tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="left" dataKey="brakeHp" name="total brake hp" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line yAxisId="right" dataKey="stages" name="stages" stroke="#BFFF00" dot type="stepAfter" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Power climbs smoothly and the stage count climbs in steps, and each step is a machine, a cooler and a
        foundation. The room column is the stated limit of {four(s.duty.maxDischargeF)} degF less the hottest stage, so
        a negative entry would be a train running over the limit it was staged against. {raw(s.sweepOverLimit)} of the
        {' '}{raw(s.sweepRows)} rows do that.
      </p>
      <div className="mt-3 rounded-md border border-slate-700 bg-[#0F172A] p-3">
        <p className="text-white text-xs font-medium mb-2">A refusal carries its evidence</p>
        <p className="text-xs text-slate-400 mb-2">
          The search for the temperature-driven count runs from one stage to twelve and refuses past it. That refusal is
          hard to reach, because every cheaper explanation is caught at the door first. It needs a discharge limit above
          the suction temperature, {four(s.capDuty.maxDischargeF)} degF against {four(s.capDuty.tSuctionF)} degF here, a
          readable efficiency, a workable ratio limit, and an overall ratio large enough that twelve equal stages are
          still too hot.
        </p>
        <EngineSays tone="red" label="A duty no practical stage count can cool" message={s.cap.error} />
        <Tbl
          head={['what the refusal also carries', 'value']}
          rows={[
            ['the stage counts tried', raw(s.cap.triedStages)],
            ['the coolest discharge those stages could reach', `${four(s.cap.coolestReachedF)} degF`],
            ['the limit it was measured against', `${four(s.cap.maxDischargeF)} degF`],
            ['the inlet it was measured from', `${four(s.cap.hottestInletF)} degF`],
            ['the overall ratio it was working on', nine(s.cap.overallRatio)],
            ['the gap between the coolest reachable discharge and the limit', `${four(s.cap.gapDerivedF)} degF`],
          ]}
        />
        <p className="text-xs text-slate-400 mt-2 mb-0">
          That gap is what tells a reader whether the approach or the limit is the impossible one, rather than sending
          them off to intercool harder. The same sentence used to answer four unrelated faults as well as this one; the
          domain-limits view shows each of those four refused by name instead.
        </p>
      </div>
    </>
  );
};

export const TrainMode = ({ t }) => {
  if (!t) return <Note>The train reader did not return the stages.</Note>;
  const rows = t.coolSweep.filter((r) => !r.refused);
  const chart = rows.map((r) => ({
    cooledTo: r.cooledToF, cooling: r.totalCoolingMMBtuHr, gasHp: r.totalGasHp, stages: r.stages,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Total gas power" value={four(t.totalGasHp)} unit="hp" />
        <Tile label="Total brake power" value={four(t.totalBrakeHp)} unit="hp" />
        <Tile label="Total cooling duty" value={four(t.totalCoolingMMBtuHr)} unit="MMBtu per hr" />
        <Tile label="Room under the stated limit" value={four(t.roomDerivedF)} unit="degF" />
      </TileGrid>
      <Tbl
        head={['stage', 'suction psia', 'discharge psia', 'in degF', 'out degF', 'ratio', 'z average', 'polytropic head ft lbf per lbm', 'gas hp', 'brake hp', 'cooling Btu per hr', 'cooled to degF']}
        rows={t.stages.map((s) => [raw(s.stage), four(s.pSuctionPsia), four(s.pDischargePsia), four(s.tSuctionF), four(s.tDischargeF), nine(s.ratio), nine(s.zAvg), four(s.headPolyFtLbfLbm), four(s.gasHp), four(s.brakeHp), four(s.coolingBtuHr), s.cooledToF === null ? 'null' : four(s.cooledToF)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The interstage cooling is a real exchanger duty rather than a bookkeeping entry, and the final discharge is
        {' '}{four(t.finalDischargeF)} degF. The hottest stage on that table is {four(t.hottestDerivedF)} degF against a
        stated limit of {four(t.maxDischargeF)} degF.
      </p>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        Now move the intercooler approach across the suction temperature. A warmer approach makes every stage after the
        first start hotter, so at a fixed count it finishes hotter, and the count the temperature limit demands rises
        once that is no longer affordable. The second column is the inlet the count was tested at, which is the only
        thing on the table that says which machine the count was bought for.
      </p>
      <Tbl
        head={['cooled to degF', 'inlet the count was tested at degF', 'stages', 'governed by', 'hottest degF', 'the stated limit less the hottest degF', 'stages over the limit', 'stages warned']}
        rows={t.coolSweep.map((r) => (r.refused
          ? [four(r.cooledToF), 'refused', '', '', '', '', '', '']
          : [four(r.cooledToF), four(r.inletTestedAtF), raw(r.stages), r.governedBy, four(r.hottestF), four(r.roomDerivedF), raw(r.stagesOverLimit), raw(r.stagesWarned)]))}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        {raw(t.coolSweepOver)} stages across that whole table run over the stated limit. A count chosen at the suction
        while the stages run from the cooler is a count chosen for a machine that is not the one being built, and the
        cost of a hotter approach is paid in MACHINES rather than in temperature.
      </p>
      <div className="mt-3 rounded-md border border-slate-700 bg-[#0F172A] p-3">
        <p className="text-white text-xs font-medium mb-2">A case cut to press on it</p>
        <p className="text-xs text-slate-400 mb-2">
          The same gas from {six(t.hotCase.duty.pSuctionPsia)} psia to {six(t.hotCase.duty.pDischargePsia)} psia at
          {' '}{four(t.hotCase.duty.tSuctionF)} degF, a stated discharge limit of
          {' '}{four(t.hotCase.duty.maxDischargeF)} degF, and an intercooler approach of
          {' '}{four(t.hotCase.duty.interstageCoolToF)} degF, which sits
          {' '}{four(t.hotCase.approachAboveSuctionDerivedF)} degF ABOVE the suction. The count comes back as
          {' '}{raw(t.hotCase.stages)} stages governed by {t.hotCase.governedBy}, the hottest stage reaches
          {' '}{four(t.hotCase.hottestF)} degF with {four(t.hotCase.roomDerivedF)} degF of room, and
          {' '}{raw(t.hotCase.stagesOverLimit)} of {raw(t.hotCase.stages)} stages run over the limit. The first stage
          runs from the suction and reaches {four(t.hotCase.firstDischargeF)} degF; every later stage runs from the
          approach and reaches {four(t.hotCase.lastDischargeF)} degF, a difference of
          {' '}{four(t.hotCase.firstToLastDerivedF)} degF at the same ratio.
        </p>
      </div>
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="cooledTo" tick={AXIS} label={{ value: 'intercooler approach, degF', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis yAxisId="left" tick={AXIS} />
            <YAxis yAxisId="right" orientation="right" tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="left" dataKey="cooling" name="total cooling, MMBtu per hr" stroke="#38bdf8" dot isAnimationActive={false} />
            <Line yAxisId="left" dataKey="gasHp" name="total gas hp" stroke="#f472b6" dot isAnimationActive={false} />
            <Line yAxisId="right" dataKey="stages" name="stages" stroke="#BFFF00" dot type="stepAfter" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Colder suction to the next stage means less work for the same ratio and more heat to take out. Across the
        {' '}{raw(t.trade.fixedCountRows)} rows that share a stage count of {raw(t.trade.fixedCountStages)}, the cooling
        falls and the gas power rises on every step: {String(t.trade.holds)}. The cooling goes from
        {' '}{four(t.trade.coolingFromMMBtuHr)} to {four(t.trade.coolingToMMBtuHr)} MMBtu per hr while the gas power
        goes from {four(t.trade.gasHpFrom)} to {four(t.trade.gasHpTo)} hp.
      </p>
      <Note>
        Then it reverses. {raw(t.trade.crossings)} rows add a stage, and on the first of them the cooling goes back UP
        from {four(t.trade.beforeCrossingCoolingMMBtuHr)} to {four(t.trade.atCrossingCoolingMMBtuHr)} MMBtu per hr while
        the gas power goes DOWN from {four(t.trade.beforeCrossingGasHp)} to {four(t.trade.atCrossingGasHp)} hp, because
        the extra machine changed the ratio each stage takes. The trade is a statement about a FIXED number of stages,
        and quoting it without the count attached quotes it wrong.
      </Note>
    </>
  );
};

export const VolumeMode = ({ m }) => {
  if (!m) return <Note>The volume reader did not return the sweep.</Note>;
  const chart = m.acfmSweep.map((r) => ({ pressure: r.pPsia, acfm: r.acfm }));
  return (
    <>
      <TileGrid>
        <Tile label="At the teaching suction" value={six(m.atSuctionPsia)} unit="psia" />
        <Tile label="Actual inlet volume there" value={four(m.atSuctionAcfm)} unit="acfm" />
        <Tile label="Duties screened" value={raw(m.screenCount)} />
        <Tile label="Distinct first reasons reached" value={raw(m.distinctFirstReasonsDerived)} />
      </TileGrid>
      <Tbl
        head={['suction psia', 'actual inlet acfm']}
        rows={m.acfmSweep.map((r) => [six(r.pPsia), four(r.acfm)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="pressure" tick={AXIS} label={{ value: 'suction pressure, psia', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="acfm" name="actual inlet volume, acfm" stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The same standard rate occupies less and less volume as the suction pressure rises, and the machine screen turns
        on that volume rather than on the rate. The branch is decided on the inlet volume first and on the ratio second,
        so two duties can reach the same recommendation by different roads. The reason line is the only thing that says
        which road.
      </p>
      {m.screen.map((d) => (
        <div key={d.label} className="mt-3 rounded-md border border-slate-700 bg-[#0F172A] p-3">
          <p className="text-white text-xs font-medium mb-1">{d.label}</p>
          <p className="text-xs text-slate-400 mb-1">
            {four(d.acfm)} acfm at an overall ratio of {six(d.overallRatio)} and {four(d.totalBrakeHp)} brake hp gives
            {' '}{d.recommendation}
          </p>
          <ul className="mb-0">
            {d.reasons.map((r) => <li key={r} className="text-xs text-slate-300">{r}</li>)}
          </ul>
        </div>
      ))}
      <p className="text-xs text-slate-400 mt-3 mb-1">
        The screen asks for the compressibility BEFORE it asks for the volume, so a suction state outside the
        correlation is refused by name rather than as a missing volume:
      </p>
      {m.screenDomain.map((r) => <EngineSays key={r.label} tone="red" label={r.label} message={r.error} />)}
      <Note>
        A volume is positive, and the guard says so. Finiteness alone is not enough, because a NEGATIVE number is
        finite: a suction below absolute zero puts a negative absolute temperature into the volume, and a screen that
        only asked whether the answer was finite would take that negative volume, find it below the smallest threshold
        and recommend a reciprocating machine on it.
      </Note>
      <Held>
        The screening thresholds themselves, the inlet volumes, the overall ratios and the brake powers the screen
        branches on. They are customary and unsourced here, so they are taught as limits and never as answers, and no
        graded value in this course is a recommendation.
      </Held>
    </>
  );
};

export const FuelMode = ({ m }) => {
  if (!m) return <Note>The fuel reader did not return the driver.</Note>;
  const chart = m.heatRates.map((r) => ({
    heatRate: r.heatRateBtuHpHr, fuel: r.fuelMMscfd, share: r.sharePctDerived,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Fuel" value={nine(m.fuelMMscfd)} unit="MMscfd" />
        <Tile label="Fuel" value={four(m.fuelBtuHr)} unit="Btu per hr" />
        <Tile label="Driver thermal efficiency" value={six(m.thermalEfficiencyPct)} unit="percent" />
        <Tile label="Share of the stream compressed" value={six(m.fuelSharePctDerived)} unit="percent" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The driver burns gas out of the stream it is compressing, so the fuel is a share of the throughput rather than a
        separate supply. At a heat rate of {six(m.heatRateBtuHpHr)} Btu per hp hr on gas of {six(m.lhvBtuScf)} Btu per
        scf, that share is {six(m.fuelSharePctDerived)} percent of the {six(m.throughputMMscfd)} MMscfd going through.
      </p>
      <Tbl
        head={['heat rate Btu per hp hr', 'fuel MMscfd', 'thermal efficiency percent', 'share of throughput percent']}
        rows={m.heatRates.map((r) => [six(r.heatRateBtuHpHr), nine(r.fuelMMscfd), six(r.thermalEfficiencyPct), six(r.sharePctDerived)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="heatRate" tick={AXIS} label={{ value: 'heat rate, Btu per hp hr', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => nine(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="fuel" name="fuel, MMscfd" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        Every packaging below is MEASURED out of the engine by asking it a question about itself, because the module
        exports none of them.
      </p>
      <Tbl
        head={['constant', 'measured value', 'how it was measured']}
        rows={[
          ['standard cubic feet per lbmol', six(m.measured.scfPerLbmol), 'the mass flow of one MMscfd of a gravity-one gas'],
          ['the molecular weight of air', six(m.measured.airMw), 'the same return, once the first is known'],
          ['the gas constant, ft lbf per lbmol degR', six(m.measured.gasConstantFtLbfLbmolR), 'the polytropic head over its own z, temperature, exponent and ratio group'],
          ['the same constant as gasProperties carries it', six(m.measured.exportedGasConstantTimes144Derived), 'the export, times 144 square inches per square foot'],
          ['ft lbf per minute per horsepower', six(m.measured.ftLbfPerMinutePerHp), 'the mass, head, power and efficiency of one stage'],
          ['Btu per horsepower hour', six(m.measured.btuPerHpHr), 'the thermal efficiency at a stated heat rate'],
          ['the same constant again', six(m.measured.btuPerHpHrFromRefusal), 'the heat rate the engine refuses below, found by halving'],
          ['the standard pressure over the standard temperature', six(m.measured.baseQuotientPsiaPerR), 'one inlet-volume return, its own z, its pressure and its temperature'],
          ['the same quotient by the mass route', six(m.measured.baseQuotientFromMassRouteDerived), 'the gas constant above and the standard cubic feet per lbmol'],
        ]}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Two of those pairs are the point. The gas constant measured out of the head and the one gasProperties exports
        differ by {raw(m.measured.gasConstantDifferenceDerived)}, so this package holds ONE value of one constant across
        two modules where one imports from the other. And the two routes to the standard base differ by
        {' '}{raw(m.measured.baseQuotientDifferenceDerived)} psia per degR, so the same MMscfd is one molar quantity
        whether it becomes a mass flow or an inlet volume.
      </p>
      <Note>
        A driver that burned less than a horsepower-hour of fuel to make one would be more than 100 percent efficient,
        so the first-law refusal boundary IS the Btu in a horsepower-hour. The two routes to it differ by
        {' '}{raw(m.measured.btuPerHpHrDifferenceDerived)}, which is why walking a guard until it turns over is a
        measurement rather than a guess.
      </Note>
    </>
  );
};

export const LimitsMode = ({ r, h }) => {
  if (!r) return <Note>The refusal reader did not return the guards.</Note>;
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        Every refusal in both modules is a RETURNED OBJECT carrying an error string that names the input which is
        actually wrong. Neither module throws, so a caller checks a property rather than catching, and that property is
        the only check most callers make. A NaN and an Infinity have no spelling in JSON and both come back as null
        through the usual serialiser, so the returns below are printed by a hand-rolled one.
      </p>
      <Tbl
        head={['the input the pump module used to answer with a number', 'what it returns now']}
        rows={r.pumpProbes.map((x) => [x.label, shapeText(x.shape)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The sharpest of the set is a system curve with no static head: {shapeText(r.systemNoStatic)}. The object looked
        healthy and the coefficient was right, and the failure only appeared when the curve was called. A static head
        may be NEGATIVE, because the destination can sit below the pump, so the guard is finiteness rather than
        positivity, and the message says so.
      </p>
      <Tbl
        head={['the input the compression module used to answer with a number', 'what it returns now']}
        rows={r.compressionProbes.map((x) => [x.label, shapeText(x.shape)])}
      />
      <div className="mt-3 rounded-md border border-slate-700 bg-[#0F172A] p-3">
        <p className="text-white text-xs font-medium mb-2">The bare-number contract</p>
        <p className="text-xs text-slate-400 mb-2">
          {r.bareNumberNames.length} exports hand back a bare number and have nowhere to put an error key at all:
          {' '}{r.bareNumberNames.join(', ')}. They hold a documented contract instead: NaN when the inputs cannot be
          read, never an Infinity and never a plausible number.
        </p>
        <Tbl
          head={['function', 'input', 'returns']}
          rows={r.nanContract.map((x) => [x.fn, x.label, String(x.returns)])}
        />
        <p className="text-xs text-slate-400 mt-2 mb-0">
          Read the two control rows against the rest. A contract that says NaN is only worth something if the same
          function returns a real number when it can, and those two rows are what makes the others mean anything.
        </p>
      </div>
      <p className="text-xs text-slate-400 mt-3 mb-1">
        Four faults, four refusals, each naming the input that is actually wrong rather than the one a reader would
        check first:
      </p>
      {r.fourFaults.map((x) => <EngineSays key={x.label} tone="red" label={x.label} message={x.error} />)}
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Two of those messages carry the value that was typed, because two typed values reach one guard from opposite
        directions. A zero and a value above one are different mistakes, and a reader told only the rule has to work out
        which of them they made. A refusal that names the wrong cause sends a reader to fix an input that was correct.
      </p>
      <p className="text-xs text-slate-400 mt-3 mb-1">
        And the same fault asked through both functions, so the message cannot drift between them:
      </p>
      <EngineSays tone="red" label="A per-stage ratio limit of one, through the stage count" message={shapeText(r.ratioOneShape)} />
      <EngineSays tone="red" label="The same through the train" message={r.ratioOneThroughTrain} />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The compressibility window. Another module in this same package exports its validity bounds and refuses outside
        them by name, and this module now IMPORTS those bounds rather than restating them. That is the same one-owner
        rule the gas constant is settled by.
      </p>
      <Tbl
        head={['probe', 'suction psia', 'suction degF', 'Ppr', 'Tpr', 'z at suction', 'the solver says converged', 'error key', 'gas hp']}
        rows={r.window.map((x) => [x.label, six(x.pSuctionPsia), four(x.tSuctionF), six(x.ppr), six(x.tpr),
          x.refused ? 'refused' : nine(x.z1), String(x.solverConverged), x.refused ? 'present' : 'absent',
          x.refused ? 'refused' : four(x.gasHp)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Two of those three rows sit outside the published window and are refused. The convergence column is why reading
        that flag would never have caught either: the solver is perfectly happy at both and reports so. The refusal
        carries the reduced coordinates and the state they were taken at, and it says which end of the train died.
      </p>
      <Tbl
        head={['refusal', 'Ppr', 'Tpr', 'at psia', 'at degF', 'state']}
        rows={r.windowRefusals.map((x) => [x.label, six(x.ppr), six(x.tpr), six(x.atPsia), four(x.atF), x.state])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A suction BELOW the reduced pressure the fit data start at is accepted rather than refused, and noted instead:
        {' '}{r.lowPressureNote === null ? 'no note' : r.lowPressureNote}. The surface runs to the ideal-gas limit as the
        reduced pressure goes to zero, so a low-pressure suction is an ordinary machine rather than an extrapolation. A
        window has two kinds of edge and they are different kinds.
      </p>
      {h && (
        <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
          <p className="text-amber-300 text-xs font-medium mb-1">HELD FOR LITERATURE</p>
          <p className="text-xs text-slate-300 mb-2">
            Eight things in this course are used, printed, and never allowed to decide a graded answer:
          </p>
          <ul className="mb-2">
            {h.items.map((x) => (
              <li key={x.id} className="text-xs text-slate-300">{x.title}, Section {x.section}. {x.note}</li>
            ))}
          </ul>
          <p className="text-xs text-slate-300 mb-1">And four things are not in these engines at all:</p>
          <ul className="mb-0">
            {h.seams.map((x) => <li key={x} className="text-xs text-slate-300">{x}</li>)}
          </ul>
        </div>
      )}
    </>
  );
};

const CompressorExplorer = ({ initialMode = 'stage' }) => {
  const [mode, setMode] = useState(initialMode);
  const s = useMemo(() => (mode === 'stage' ? safe(stageIsNotAPump) : null), [mode]);
  const c = useMemo(() => (mode === 'staging' ? safe(stageCountAndLimit) : null), [mode]);
  const t = useMemo(() => (mode === 'train' ? safe(trainAndCooling) : null), [mode]);
  const m = useMemo(() => ((mode === 'volume' || mode === 'fuel') ? safe(machineDriverFuel) : null), [mode]);
  const r = useMemo(() => (mode === 'limits' ? safe(refusalContract) : null), [mode]);
  const h = useMemo(() => (mode === 'limits' ? safe(heldItems) : null), [mode]);

  return (
    <PanelShell
      title="Compressor explorer"
      subtitle="SOKU K-2101 in field units: the polytropic path and both heads, the two staging limits and which one governed, the train stage by stage with its cooling duty, the machine screen and the driver fuel, and the boundary either side of every guard."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'stage' && <StageMode s={s} />}
        {mode === 'staging' && <StagingMode s={c} />}
        {mode === 'train' && <TrainMode t={t} />}
        {mode === 'volume' && <VolumeMode m={m} />}
        {mode === 'fuel' && <FuelMode m={m} />}
        {mode === 'limits' && <LimitsMode r={r} h={h} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored Compressor Station Designer engine on the teaching
        train, printed to the precision the teaching digest prints. Rates are in MMscfd, pressures in psia, temperatures
        in degF, head in ft lbf per lbm, power in horsepower and cooling duty in Btu per hr.
      </Note>
    </PanelShell>
  );
};

export default CompressorExplorer;
