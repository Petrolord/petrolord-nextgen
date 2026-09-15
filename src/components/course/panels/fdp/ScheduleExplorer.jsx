import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  EGINA_RIG_COUNTS,
  network, dates, wellsAndRigs, facilities, riskRegister,
} from './fdpLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Schedule explorer, the Professional tier. THE PLAN IN TIME AND SPACE: the
// schedule as a network with a real critical path method, the calendar against
// the logic, the wells and what a rig day costs, the facilities sized and
// priced, and one risk scale with four bands and an unscored row.
//
// Every figure on this page is a return value from fdpLab, which is a return
// value from the vendored FDP Accelerator engines, or arithmetic the digest
// itself labels derived (a campaign laid out on N rigs, utilisation against the
// plan's peak, a scaling factor). Nothing here runs a forward pass, prices a
// rig day or scores a risk.
//
// THE CLOCK. The calendar span reads only the dates typed on the activities.
// An activity with no readable dates answers null rather than filling the gap
// from today.
//
// P-LABELS. None. A duration, a float, a well cost, a facility capex, a
// utilisation and a risk score are not outcomes and never carry one.

const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const whole = (v) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 }) : 'none');

export const MODES = [
  ['network', 'Network: the activities and the full critical path method table'],
  ['path', 'Path: the critical path, the calendar against the logic, the refusals'],
  ['wells', 'Wells: days, cost at the plan rig rate, and a campaign on one, two and three rigs'],
  ['facilities', 'Facilities: scaling, decommissioning, utilisation and the flow assurance screen'],
  ['risk', 'Risk: one scale, four bands, the unscored row, exposure and health'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const DurationLabel = ({ children }) => <span data-plabel="duration">{children}</span>;
const CostLabel = ({ children }) => <span data-plabel="cost">{children}</span>;
const CapexLabel = ({ children }) => <span data-plabel="capex">{children}</span>;
const RatioLabel = ({ children }) => <span data-plabel="ratio">{children}</span>;

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

export const NetworkMode = ({ net }) => {
  if (!net) return <Note>The schedule engine did not return the network.</Note>;
  const bars = net.cpm.map((a) => ({ id: a.id, duration: a.duration, float: a.float }));
  return (
    <>
      <Tbl
        head={['activity', 'type', <DurationLabel key="d">duration, days</DurationLabel>, 'must finish first']}
        rows={net.activities.map((a) => [`${a.id} ${a.name}`, a.type, a.duration, a.dependencies.length ? a.dependencies.join(', ') : 'nothing'])}
      />
      <Tbl
        head={['activity', <DurationLabel key="d">duration</DurationLabel>, 'early start', 'early finish', 'late start', 'late finish',
          <DurationLabel key="f">float</DurationLabel>, 'critical']}
        rows={net.cpm.map((a) => [`${a.id} ${a.name}`, a.duration, a.es, a.ef, a.ls, a.lf, a.float, String(a.isCritical)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="id" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => whole(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="duration" name="duration, days" stackId="a" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="float" name="float, days" stackId="a" fill="#475569" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Float is the late start less the early start. An activity with float can slip by that much without moving the end
        date, and one on the critical path cannot slip at all. Before the repair every activity on this network read
        critical at float 0.
      </Note>
    </>
  );
};

export const PathMode = ({ net, dt }) => {
  if (!net || !dt) return <Note>The schedule engine did not return the path.</Note>;
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label={<DurationLabel>Network duration</DurationLabel>} value={whole(net.duration)} unit="days, what the work must take" />
          <Tile label={<DurationLabel>Calendar span</DurationLabel>} value={whole(net.calendarSpan)} unit="days, how long the window is" />
          <Tile label="Critical path" value={net.paths.map((p) => p.join(' to ')).join(' and ')} />
          <Tile label={<DurationLabel>Milestones</DurationLabel>} value={dt.milestones.join(', ')} />
        </TileGrid>
      </div>
      <Tbl
        head={['activity with float', <DurationLabel key="f">days it can slip</DurationLabel>]}
        rows={net.withFloat.map((a) => [a.id, a.float])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A date is not a timestamp. A date-only string is read as local midnight and a span is counted in whole calendar
        days, so the window {dt.dstWindow.startDate} to {dt.dstWindow.endDate}, which crosses a daylight-saving change in
        some zones, is {whole(dt.dstWindow.days)} days for every reader. An activity with no readable dates answers
        {' '}{dt.undatedSpan === null ? 'null' : 'a number'}, and an empty schedule answers {whole(dt.emptySpan)}.
      </p>
      <Tbl
        head={['a concept sanctioned', 'facility type', 'first production', <DurationLabel key="m">months</DurationLabel>]}
        rows={dt.conceptSchedules.map((s) => [s.startDate, s.facilityType, s.firstOilDate, s.durationMonths])}
      />
      <Tbl
        head={['what the network refuses', 'message']}
        rows={[...net.refusals.map((c) => [c.name, c.error]),
          ['an unreadable concept start date with no today given', dt.unreadableStartRefusal.error]]}
      />
      <Tbl
        head={['published case', <DurationLabel key="d">engine duration</DurationLabel>, 'engine critical', 'golden reference duration', 'golden critical']}
        rows={net.published.map((c) => [c.name, whole(c.duration), JSON.stringify(c.critical), whole(c.goldenDuration), JSON.stringify(c.goldenCritical)])}
      />
      <Note>
        On the textbook network the engine used to mark all {net.textbook.retiredCount} activities critical at float 0. The
        method puts the path at {JSON.stringify(net.textbook.criticalPath)} and gives {JSON.stringify(net.textbook.disagreements)} four
        days of float each.
      </Note>
    </>
  );
};

export const WellsMode = ({ wr, rigs, onRigs }) => {
  if (!wr) return <Note>The well engine did not return the campaign.</Note>;
  const chosen = wr.campaigns.find((c) => c.rigs === Number(rigs)) || wr.campaigns[0];
  return (
    <>
      <Tbl
        head={['well', 'type', 'trajectory', 'measured depth, ft', <DurationLabel key="d">days</DurationLabel>, <CostLabel key="c">cost, USD</CostLabel>]}
        rows={wr.rows.map((x) => [x.name, x.type, x.trajectory, whole(x.md), whole(x.days), whole(x.cost)])}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label={<CostLabel>Rig rate</CostLabel>} value={whole(wr.rigRate)} unit="USD a day, services at 1.5 times" />
          <Tile label={<DurationLabel>Campaign rig days</DurationLabel>} value={whole(wr.totals.daysDerived)} unit="derived" />
          <Tile label={<CostLabel>Campaign cost</CostLabel>} value={whole(wr.totals.costDerived)} unit="USD (derived)" />
          <Tile label={<CostLabel>The same all-in day on every row</CostLabel>} value={whole(wr.totals.allInDayDerived)} unit="USD (derived)" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Trajectory and depth move the days; the day itself is priced the same for a producer, an injector, a vertical well
        and a horizontal one. The same four wells at {whole(wr.alternativeRate.rate)} USD a day cost
        {' '}{whole(wr.alternativeRate.costDerived)} USD, so the rig rate is not a detail.
      </p>
      <Tbl
        head={['the same depth on', <DurationLabel key="d">days</DurationLabel>, <CostLabel key="c">cost, USD</CostLabel>]}
        rows={wr.trajectories.map((x) => [`${whole(x.depthFt)} ft ${x.trajectory}`, whole(x.days), whole(x.cost)])}
      />
      <Tbl
        head={['a horizontal well at', <DurationLabel key="d">days</DurationLabel>]}
        rows={wr.complexities.map((x) => [`${x.complexity} complexity`, whole(x.days)])}
      />
      {onRigs && (
        <FieldGrid>
          <SelectField label="Rigs on the campaign" value={String(chosen.rigs)} onChange={onRigs}
            options={EGINA_RIG_COUNTS.map((n) => [String(n), `${n} rig${n === 1 ? '' : 's'}`])} />
        </FieldGrid>
      )}
      <Tbl
        head={['rigs', <DurationLabel key="c">campaign days (derived)</DurationLabel>, <DurationLabel key="r">rig days of work</DurationLabel>, 'each rig finishes at']}
        rows={wr.campaigns.map((c) => [c.rigs, whole(c.daysDerived), whole(c.rigDaysDerived), c.rigFinishDaysDerived.map((d) => whole(d)).join(', ')])}
      />
      <Note>
        Each well goes to the rig that comes free first, taken in the order the wells sit in the plan. A different order can
        give a different campaign length for the same four wells. On {chosen.rigs} rig{chosen.rigs === 1 ? '' : 's'} the
        campaign runs {whole(chosen.daysDerived)} days against {whole(chosen.rigDaysDerived)} rig days of work.
      </Note>
    </>
  );
};

export const FacilitiesMode = ({ fac }) => {
  if (!fac) return <Note>The facilities engine did not return the facilities.</Note>;
  return (
    <>
      <Tbl
        head={['facility', 'type', 'nameplate bopd', <CapexLabel key="c">capex</CapexLabel>, <CostLabel key="o">annual operating cost</CostLabel>,
          <CostLabel key="d">decommissioning</CostLabel>, 'gas capacity Mscf/d', 'water bopd']}
        rows={fac.rows.map((x) => [x.name, x.type, whole(x.nameplateCapacity), four(x.capex), four(x.opex), four(x.decommissioning),
          whole(x.gasCapacity), whole(x.waterHandling)])}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label={<RatioLabel>Size factor</RatioLabel>} value={six(fac.scaling.sizeFactorDerived)} unit={`${whole(fac.scaling.fromNameplate)} to ${whole(fac.scaling.toNameplate)} bopd`} />
          <Tile label={<RatioLabel>Capex factor</RatioLabel>} value={six(fac.scaling.capexFactorDerived)} unit="size to the power 0.7" />
          <Tile label={<RatioLabel>Operating cost factor</RatioLabel>} value={six(fac.scaling.opexFactorDerived)} unit="size to the power 0.6" />
          <Tile label="The plan&apos;s peak" value={whole(fac.utilisation.peakBpdDerived)} unit={`bopd, and ${whole(fac.utilisation.gasMscfdDerived)} Mscf/d at a gas-oil ratio of ${whole(fac.utilisation.gor)}`} />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Two and a half times the size costs {six(fac.scaling.capexFactorDerived)} times the money. Size does not price in
        proportion, and neither does the operating cost.
      </p>
      <Tbl
        head={['facility', <CapexLabel key="c">capex</CapexLabel>, <CostLabel key="d">decommissioning</CostLabel>, <RatioLabel key="s">share of capex (derived)</RatioLabel>]}
        rows={fac.decommissioning.rows.map((x) => [x.name, four(x.capex), four(x.decommissioning), six(x.shareDerived)])}
      />
      <Tbl
        head={['facility', <RatioLabel key="o">oil utilisation (derived)</RatioLabel>, <RatioLabel key="g">gas utilisation (derived)</RatioLabel>,
          'water handling bopd', 'bottlenecks']}
        rows={fac.utilisation.rows.map((x) => [x.name, six(x.oilUtilisationDerived), six(x.gasUtilisationDerived), whole(x.waterHandling),
          x.bottlenecks.length ? JSON.stringify(x.bottlenecks) : 'none'])}
      />
      <p className="text-xs text-slate-500 mt-2 mb-0">
        There is no produced water forecast at all, so the water handling column has nothing to be divided by.
      </p>
      <Tbl
        head={['facility', 'flow assurance score', 'level', 'hazards']}
        rows={[...fac.flowAssurance.rows.map((x) => [x.name, whole(x.score), x.level, x.hazards.length ? JSON.stringify(x.hazards) : 'none']),
          [`${fac.flowAssurance.h2sProbe.name} on a fluid carrying ${fac.flowAssurance.h2sProbe.h2sPpm} ppm H2S`, 'see hazards', 'see hazards',
            JSON.stringify(fac.flowAssurance.h2sProbe.hazards)]]}
      />
      <Note>
        Flow assurance runs its own scale and it is not the risk register&apos;s. Without an H2S figure the corrosion screen
        cannot fire at all, so a blank field reads as no corrosion risk rather than as an unknown, and it fires at any H2S
        above zero and always at High.
      </Note>
    </>
  );
};

export const RiskMode = ({ risk }) => {
  if (!risk) return <Note>The risk engine did not return the register.</Note>;
  const bars = [
    { band: 'Critical', count: risk.levels.Critical },
    { band: 'High', count: risk.levels.High },
    { band: 'Medium', count: risk.levels.Medium },
    { band: 'Low', count: risk.levels.Low },
    { band: 'Unscored', count: risk.levels.Unscored },
  ];
  return (
    <>
      <Tbl
        head={['probability', 'impact', 'score', 'band']}
        rows={risk.bands.map((b) => [b.probability, b.impact, whole(b.score), b.level])}
      />
      <Tbl
        head={['risk', 'source', 'probability', 'impact', 'score', 'band', <CostLabel key="c">cost impact, million USD</CostLabel>, 'mitigation']}
        rows={risk.rows.map((x) => [x.name, x.source, x.probability === null ? 'none' : x.probability, x.impact === null ? 'none' : x.impact,
          x.score === null ? 'none' : whole(x.score), x.band, four(x.costImpact), x.mitigation])}
      />
      <div className="h-40 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="band" tick={AXIS} />
            <YAxis tick={AXIS} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP} />
            <Bar dataKey="count" name="risks" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Consolidated score" value={whole(risk.consolidated)} unit="the scored risks, summed" />
          <Tile label="Unscored risks" value={whole(risk.unscoredCount)} />
          <Tile label="Portfolio health" value={whole(risk.health)} unit={`and ${whole(risk.healthWithoutUnscored)} with the unscored risk left out`} />
          <Tile label={<CostLabel>Risk exposure</CostLabel>} value={four(risk.exposure)} unit="million USD" />
        </TileGrid>
      </div>
      <Tbl
        head={['risk', 'probability', 'factor', <CostLabel key="c">cost impact</CostLabel>, <CostLabel key="x">contribution (derived)</CostLabel>]}
        rows={risk.contributions.map((x) => [x.name, x.probability === null ? 'none' : x.probability,
          x.factor === null ? 'no factor' : six(x.factor), four(x.costImpact),
          x.contributionDerived === null ? 'none, its probability is missing' : four(x.contributionDerived)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The five cost impacts add to {four(risk.costImpactTotalDerived)} million USD, which is what the register would cost if
        every risk happened. The exposure of {four(risk.exposure)} is neither that number nor a worst case.
      </p>
      <p className="text-xs text-slate-500 mt-2 mb-0">
        The HSE matrix on the same register reads critical {risk.matrix.critical}, high {risk.matrix.high}, medium
        {' '}{risk.matrix.medium}, low {risk.matrix.low}, unscored {risk.matrix.unscored}, total {risk.matrix.total}. The two
        agree because there is one scale. By source: {JSON.stringify(risk.bySource)}.
      </p>
      <Tbl
        head={['published risk set', 'consolidated', <CostLabel key="e">exposure</CostLabel>, 'health', 'by level']}
        rows={risk.published.map((c) => [c.name, c.consolidatedScore === null ? 'null' : whole(c.consolidatedScore),
          four(c.exposure), whole(c.health), JSON.stringify(c.byLevel)])}
      />
      <Note>
        An unscored risk neither helps nor hurts. It is reported as unscored, it contributes nothing to the exposure because
        its probability is missing, and it leaves the health score where it was. Before the repair it counted as Low and
        improved the score.
      </Note>
    </>
  );
};

const ScheduleExplorer = ({ initialMode = 'network' }) => {
  const [mode, setMode] = useState(initialMode);
  const [rigs, setRigs] = useState(String(EGINA_RIG_COUNTS[1]));
  const net = useMemo(() => (mode === 'network' || mode === 'path' ? safe(network) : null), [mode]);
  const dt = useMemo(() => (mode === 'path' ? safe(dates) : null), [mode]);
  const wr = useMemo(() => (mode === 'wells' ? safe(wellsAndRigs) : null), [mode]);
  const fac = useMemo(() => (mode === 'facilities' ? safe(facilities) : null), [mode]);
  const risk = useMemo(() => (mode === 'risk' ? safe(riskRegister) : null), [mode]);

  return (
    <PanelShell
      title="Schedule explorer"
      subtitle="EGINA in time and space: the schedule as a network, the calendar against the logic, the wells and what a rig day costs, the facilities sized and priced, and one risk scale."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'network' && <NetworkMode net={net} />}
        {mode === 'path' && <PathMode net={net} dt={dt} />}
        {mode === 'wells' && <WellsMode wr={wr} rigs={rigs} onRigs={setRigs} />}
        {mode === 'facilities' && <FacilitiesMode fac={fac} />}
        {mode === 'risk' && <RiskMode risk={risk} />}
      </div>
    </PanelShell>
  );
};

export default ScheduleExplorer;
