import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  effectivenessSurface, collapseAtZero, hotDaySweep, secondMethod, airCoolerDesign,
  historyCarryingRefusals, e6, r4, r9, n0, yn, CEILING_CR,
} from './heattransferLab';
import {
  Tbl, Held, Refusal, Note, Empty, safe,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Rating explorer, the Expert tier throughout.
//
// A RATING ASKS THE OTHER QUESTION. Given a surface, what fraction of the most
// heat that could possibly be moved does this machine actually move.
//
// TWO ARRANGEMENTS HAVE A CEILING AND ONE HAS NONE, and the difference is drawn
// rather than asserted: the parallel and 1-2 shell curves are drawn with their
// asymptotes and the counter-current curve is drawn with no asymptote at all. The
// help text this course corrects claimed every arrangement has a ceiling, and
// counter-current is the Rating tab's own default, so it is the one a reader meets
// first.
//
// THE HOT DAY IS RATED, AND FOUR COLUMNS DO NOT MOVE. Effectiveness, NTU, the
// capacity ratio and UA are flat across every ambient, and the duty fraction and
// the process outlet are not. That contrast is the mechanism, so the flat columns
// and the moving ones sit side by side with the count of distinct values in each.
//
// AND THE SECOND METHOD. UA times the hot-day log mean against the rated duty, as
// a ratio that sits at one. A page that shows two methods agreeing teaches more
// than one that shows an answer.
//
// Every figure here is a return value from heattransferLab. Nothing on this page
// computes an effectiveness, an NTU, a duty or a fan power, and nothing reads a
// clock.

export const MODES = [
  ['surface', 'Effectiveness against NTU, with two ceilings drawn and one curve with none'],
  ['collapse', 'The capacity ratio of zero, where all three curves become one curve'],
  ['bay', 'The bay at its design point, its draft type and the correction it declines'],
  ['hotday', 'The hot day: four columns that hold beside two that move'],
  ['second', 'The second method, and what two methods agreeing buys'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const SERIES = ['#38bdf8', '#f472b6', '#BFFF00', '#fbbf24'];
const ARRANGEMENT_LABEL = { counter: 'counter-current', parallel: 'parallel', shell1: '1-2 shell' };

// ---------------------------------------------------------------------------

export const EffectivenessMode = ({ e, cr, onCr }) => {
  if (!e || !Array.isArray(e.grid)) return <Empty>The rating reader has returned nothing, so there is no curve to draw.</Empty>;
  const crValue = Number(cr);
  const j = e.crSweep.indexOf(crValue);
  const index = j === -1 ? 0 : j;
  const chosenCr = e.crSweep[index];
  const chart = e.grid.map((row) => {
    const point = { ntu: row.ntu };
    row.byArrangement.forEach((a) => { point[a.arrangement] = a.byCr[index].effectiveness; });
    return point;
  });
  const ceilingRow = e.ceilings.find((c) => c.cr === chosenCr);
  return (
    <>
      <FieldGrid>
        <SelectField
          label="Capacity ratio"
          value={String(crValue)}
          onChange={onCr}
          options={e.crSweep.map((c) => [String(c), `Cr ${e6(c)}`])}
        />
      </FieldGrid>
      <TileGrid>
        <Tile label="Parallel ceiling" value={ceilingRow.parallel === null ? 'none' : e6(ceilingRow.parallel)} />
        <Tile label="1-2 shell ceiling" value={ceilingRow.shell1 === null ? 'none' : e6(ceilingRow.shell1)} />
        <Tile label="Counter-current ceiling" value={ceilingRow.counter === null ? 'none' : e6(ceilingRow.counter)} />
        <Tile label="Counter-current is highest every time" value={yn(e.counterIsHighestEveryTime)} />
      </TileGrid>
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="ntu" type="number" domain={['auto', 'auto']} tick={AXIS} label={{ value: 'NTU, the surface written dimensionlessly', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} domain={[0, 1]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => e6(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {ceilingRow.parallel !== null && (
              <ReferenceLine y={ceilingRow.parallel} stroke={SERIES[1]} strokeDasharray="5 3" label={{ value: `parallel ceiling ${e6(ceilingRow.parallel)}`, fill: SERIES[1], fontSize: 10, position: 'insideBottomRight' }} />
            )}
            {ceilingRow.shell1 !== null && (
              <ReferenceLine y={ceilingRow.shell1} stroke={SERIES[2]} strokeDasharray="5 3" label={{ value: `1-2 shell ceiling ${e6(ceilingRow.shell1)}`, fill: SERIES[2], fontSize: 10, position: 'insideTopRight' }} />
            )}
            <Line dataKey="counter" name="counter-current, drawn with no asymptote" stroke={SERIES[0]} dot isAnimationActive={false} />
            <Line dataKey="parallel" name="parallel" stroke={SERIES[1]} dot isAnimationActive={false} />
            <Line dataKey="shell1" name="1-2 shell" stroke={SERIES[2]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The two dashed lines are the effectivenesses those two arrangements cannot pass at ANY area, and the engine
        reports each of them on every answer. The counter-current curve is drawn with no dashed line because it HAS
        none: the engine returns null there rather than a number, and that is an analytic truth about counter-current
        flow. At a capacity ratio of zero every arrangement reaches
        {' '}{e.ceilingAtCapacityRatioZero === null ? 'none' : e6(e.ceilingAtCapacityRatioZero)}, because with nothing
        limiting the cold side there is no arrangement penalty left to pay.
      </Note>
      <Tbl
        head={['capacity ratio', 'parallel ceiling', '1-2 shell ceiling', 'counter-current ceiling']}
        rows={e.ceilings.map((c) => [
          e6(c.cr),
          c.parallel === null ? 'none' : e6(c.parallel),
          c.shell1 === null ? 'none' : e6(c.shell1),
          c.counter === null ? 'none' : e6(c.counter),
        ])}
      />
      <Tbl
        head={['NTU'].concat(e.arrangements.map((a) => `${ARRANGEMENT_LABEL[a]} at Cr ${e6(chosenCr)}`))}
        rows={e.grid.map((row) => [e6(row.ntu)]
          .concat(row.byArrangement.map((a) => e6(a.byCr[index].effectiveness))))}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        Proved the other way round, at a capacity ratio of {e6(e.ceilingCr)}: asked for an NTU at effectivenesses
        climbing toward one, the counter-current column answers every time, measured as {yn(e.counterAnswersEveryTime)},
        and the other two stop with their ceiling beside the message.
      </p>
      <Tbl
        head={['effectiveness asked for'].concat(e.arrangements.map((a) => ARRANGEMENT_LABEL[a]))}
        rows={e.probe.map((p) => [e6(p.effectiveness)].concat(p.byArrangement.map((a) => (a.refusal
          ? `refused, ceiling ${a.ceiling === null ? 'none' : e6(a.ceiling)}`
          : e6(a.ntu)))))}
      />
      <Note>
        A counter-current unit needs more and more surface as the effectiveness approaches one, without bound, and that
        is the honest answer rather than a refusal.
      </Note>
      {e.refusals.map((r) => <Refusal key={r.label} probe={r} />)}
      <Tbl
        head={['NTU', 'capacity ratio', 'arrangement', 'effectiveness', 'golden effectiveness', 'NTU recovered']}
        rows={e.publishedEpsNtu.map((p) => [
          e6(p.ntu), e6(p.cr), p.arrangement, e6(p.effectiveness),
          p.goldenEffectiveness === null || p.goldenEffectiveness === undefined ? 'none' : e6(p.goldenEffectiveness),
          p.ntuRecovered === null ? 'refused' : e6(p.ntuRecovered),
        ])}
      />
      <Note>
        The last column is the inversion returning the NTU the row started with. That is a self-consistency check and it
        is NOT evidence that either direction is right, because an identity between a function and its own inverse holds
        whether or not either one is correct. The golden column is the evidence, because the oracle reaches it by
        marching the differential equations rather than by algebra.
      </Note>
    </>
  );
};

export const CollapseMode = ({ c }) => {
  if (!c || !Array.isArray(c.rows)) return <Empty>The collapse reader has returned nothing, so there is no limit to draw.</Empty>;
  return (
    <>
      <TileGrid>
        <Tile label="Rows where all three agree" value={n0(c.rows.filter((r) => r.allEqual).length)} />
        <Tile label="Rows read" value={n0(c.rows.length)} />
        <Tile label="Every row collapses" value={yn(c.everyRowCollapses)} />
        <Tile label="Ceiling at that limit" value={c.ceiling === null ? 'none' : e6(c.ceiling)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={c.rows} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="ntu" type="number" domain={['auto', 'auto']} tick={AXIS} label={{ value: 'NTU', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} domain={[0, 1]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => e6(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="counter" name="counter-current" stroke={SERIES[0]} strokeWidth={6} dot={false} isAnimationActive={false} />
            <Line dataKey="parallel" name="parallel" stroke={SERIES[1]} strokeWidth={3} dot={false} isAnimationActive={false} />
            <Line dataKey="shell1" name="1-2 shell" stroke={SERIES[2]} strokeWidth={1} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Three curves are drawn here and one curve is visible, because at a capacity ratio of zero all three lie exactly on
        top of each other. A capacity ratio of zero is a stream changing phase: it absorbs heat without changing
        temperature, so the arrangement stops mattering. Three separate closed forms, three separate branches of the
        code, one answer, and a wrong constant in any one of them would break the row it sits on and nothing else.
      </Note>
      <Tbl
        head={['NTU', 'counter-current', 'parallel', '1-2 shell', 'all three equal', 'distinct values']}
        rows={c.rows.map((r, i) => [
          e6(r.ntu), e6(r.counter), e6(r.parallel), e6(r.shell1), yn(r.allEqual), n0(c.distinctValuesPerRow[i]),
        ])}
      />
      <Note>
        The last column is MEASURED rather than asserted: it counts how many distinct effectivenesses the three
        arrangements returned on that row, and one is the collapse.
      </Note>
    </>
  );
};

export const BayMode = ({ a, history }) => {
  if (!a || !Array.isArray(a.bays)) return <Empty>The bay reader has returned nothing, so there is no design point to show.</Empty>;
  const frames = history && Array.isArray(history.labels) ? history.labels : [];
  const studio = a.bays[0];
  return (
    <>
      <TileGrid>
        <Tile label="Design duty" value={r4(studio.qBtuHr)} unit="Btu/hr" />
        <Tile label="Log mean" value={e6(studio.lmtdF)} unit="degF" />
        <Tile label="Bare surface" value={e6(studio.areaFt2)} unit="ft2" />
        <Tile label="Cross-flow correction reported" value={studio.fCorrection === null ? 'none' : e6(studio.fCorrection)} />
      </TileGrid>
      <Tbl
        head={['quantity'].concat(a.bays.map((b) => b.label))}
        rows={[
          ['duty, Btu/hr', ...a.bays.map((b) => r4(b.qBtuHr))],
          ['process in, degF', ...a.bays.map((b) => e6(b.processInF))],
          ['process out, degF', ...a.bays.map((b) => e6(b.processOutF))],
          ['design ambient, degF', ...a.bays.map((b) => e6(b.ambientF))],
          ['air rise, degF', ...a.bays.map((b) => e6(b.airRiseF))],
          ['air outlet, degF', ...a.bays.map((b) => e6(b.airOutF))],
          ['log mean, degF', ...a.bays.map((b) => e6(b.lmtdF))],
          ['U, Btu/hr.ft2.F', ...a.bays.map((b) => e6(b.uBtuHrFt2F))],
          ['bare surface, ft2', ...a.bays.map((b) => e6(b.areaFt2))],
          ['air, lb/hr', ...a.bays.map((b) => r4(b.airLbHr))],
          ['draft type', ...a.bays.map((b) => b.draftType)],
          ['fan inlet, degF', ...a.bays.map((b) => e6(b.fanInletF))],
          ['barometric pressure, psia', ...a.bays.map((b) => e6(b.barometricPsia))],
          ['air density at the fan inlet, lb/ft3', ...a.bays.map((b) => r9(b.airDensityLbFt3))],
          ['actual ft3 a minute', ...a.bays.map((b) => r4(b.acfm))],
          ['fan brake horsepower', ...a.bays.map((b) => e6(b.fanBhp))],
          ['motor horsepower', ...a.bays.map((b) => e6(b.motorHp))],
        ]}
      />
      <Note>
        The air outlet is the ambient plus the rise, and the air mass follows from the duty and the rise through the
        module's declared air heat capacity. That constant can be MEASURED out of the engine's own answer rather than read
        from its source: {e6(a.airHeatCapacityDerived)} Btu per lb per degF, derived as the duty over the air mass and
        the rise.
      </Note>
      <Tbl
        head={['draft type', 'fan inlet, degF', 'air density, lb/ft3', 'actual ft3 a minute', 'fan brake horsepower', 'motor horsepower']}
        rows={a.draftRows.map((d) => [
          d.draftType, e6(d.fanInletF), r9(d.airDensityLbFt3), r4(d.acfm), e6(d.fanBhp), e6(d.motorHp),
        ])}
      />
      <Note>
        A forced-draft fan sits below the bundle and handles ambient air, an induced-draft fan sits above it and handles
        the heated air leaving, and those are different densities, so different volumes, so different fan powers. The gap
        on the same bay is a ratio of {e6(a.draftRatioDerived)}, derived as the induced over the forced. The engine will
        not pick one for you and it reports the fan inlet temperature so the answer says which machine it belongs to.
      </Note>
      <Tbl
        head={['barometric pressure, psia', 'air density at the fan inlet, lb/ft3', 'actual ft3 a minute', 'fan brake horsepower']}
        rows={a.barometricRows.map((b) => [e6(b.barometricPsia), r9(b.airDensityLbFt3), r4(b.acfm), e6(b.fanBhp)])}
      />
      <Note>
        The barometer is an input too, because the duty of this machine is set by air density and a bay on a plateau
        breathes thinner air. The density is an ideal-gas density and it can be measured out of the engine directly: at
        {' '}{e6(a.densityProbe.tF)} degF and {e6(a.densityProbe.psia)} psia it returns {r9(a.densityProbe.lbFt3)} lb per
        ft3. That one export answers with a bare number rather than an object, which is the documented exception to this
        module's error contract, and below absolute zero it answers {a.densityProbe.belowAbsoluteZero}, which the bay
        turns into a named refusal rather than passing on.
      </Note>
      {a.refusals.map((r) => (
        <Refusal key={r.label} probe={r} frame={frames.includes(r.label) ? history.frame : null} />
      ))}
      <Held>
        {a.crossFlow.note}
      </Held>
      <Note>
        Read that tile again: the correction is reported as
        {' '}{a.crossFlow.fCorrection === null ? 'none' : e6(a.crossFlow.fCorrection)} on both bays, measured as
        {' '}{yn(a.crossFlow.reportedOnBothBays)}, so the bare surface above is a counter-current-basis surface and a
        real cross-flow bay needs more. The engine declares that basis on every answer rather than quietly applying a
        one, and the hot-day rating on the next view does not depend on it at all.
      </Note>
    </>
  );
};

export const HotDayMode = ({ h }) => {
  if (!h || !Array.isArray(h.studioRows)) return <Empty>The hot-day reader has returned nothing, so there is no rating to draw.</Empty>;
  const flat = h.studioRows.map((r) => ({
    ambient: r.checkAmbientF,
    effectiveness: r.effectiveness,
    ntu: r.ntu,
    cr: r.cr,
    dutyFraction: r.dutyFraction,
  }));
  const moving = h.studioRows.map((r) => ({
    ambient: r.checkAmbientF, dutyFraction: r.dutyFraction, processOutF: r.processOutF,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Effectiveness" value={e6(h.studioRows[0].effectiveness)} />
        <Tile label="NTU" value={e6(h.studioRows[0].ntu)} />
        <Tile label="Capacity ratio" value={e6(h.studioRows[0].cr)} />
        <Tile label="UA" value={r4(h.studioRows[0].uaBtuHrF)} unit="Btu/hr.F" />
      </TileGrid>
      <Note>
        Those four tiles are the same four numbers at every ambient in the table below. What a machine actually holds on a
        hot afternoon is its SURFACE and its AIR MASS, and those two fix UA and both capacity rates, so they fix NTU and
        the capacity ratio, so they fix the effectiveness. The duty then follows from the inlet temperature difference
        alone. The engine states the basis on every answer: {h.basis}
      </Note>
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={flat} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="ambient" type="number" domain={['auto', 'auto']} tick={AXIS} label={{ value: 'check ambient, degF', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} domain={[0, 'auto']} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => e6(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="effectiveness" name="effectiveness, which holds" stroke={SERIES[0]} dot isAnimationActive={false} />
            <Line dataKey="ntu" name="NTU, which holds" stroke={SERIES[1]} dot isAnimationActive={false} />
            <Line dataKey="cr" name="capacity ratio, which holds" stroke={SERIES[2]} dot isAnimationActive={false} />
            <Line dataKey="dutyFraction" name="duty fraction, which moves" stroke={SERIES[3]} strokeWidth={3} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={moving} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="ambient" type="number" domain={['auto', 'auto']} tick={AXIS} label={{ value: 'check ambient, degF', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis yAxisId="left" tick={AXIS} />
            <YAxis yAxisId="right" orientation="right" tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => e6(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="left" y={1} stroke="#BFFF00" strokeDasharray="4 4" label={{ value: 'the design duty', fill: '#BFFF00', fontSize: 10, position: 'insideTopLeft' }} />
            <Line yAxisId="left" dataKey="dutyFraction" name="duty fraction" stroke={SERIES[3]} dot isAnimationActive={false} />
            <Line yAxisId="right" dataKey="processOutF" name="process leaving, degF" stroke={SERIES[1]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Read those two together. As the air gets hotter the duty falls AND the process leaves hotter, and those two go
        together: a rating that reports one without the other is asserting something it did not compute.
      </Note>
      <Tbl
        head={['check ambient, degF', 'regime', 'duty fraction', 'duty, Btu/hr', 'process out, degF', 'air rise, degF', 'air out, degF', 'effectiveness', 'NTU', 'capacity ratio', 'UA, Btu/hr.F', 'hot-day log mean, degF', 'design outlet reached']}
        rows={h.studioRows.map((r) => [
          e6(r.checkAmbientF), r.regime, e6(r.dutyFraction), r4(r.qBtuHr), e6(r.processOutF), e6(r.airRiseF),
          e6(r.airOutF), e6(r.effectiveness), e6(r.ntu), e6(r.cr), r4(r.uaBtuHrF), e6(r.lmtdF),
          yn(r.designOutletReached),
        ])}
      />
      <Tbl
        head={['column', 'distinct values down the studio table', 'distinct values down the second bay']}
        rows={h.flatColumns.concat(h.movingColumns).map((k) => [
          k, n0(h.studioDistinct[k]), n0(h.antanDistinct[k]),
        ])}
      />
      <Note>
        That last table is the mechanism in one place, MEASURED rather than asserted. The four held columns carry one
        distinct value down each table, measured as {yn(h.fourColumnsHold)}, and the two that move carry as many values as
        there are rows, measured as {yn(h.twoColumnsMove)}. The machine is the same machine at every ambient, and what
        changes is the air it is given.
      </Note>
      <TileGrid>
        <Tile label="At the default check ambient" value={e6(h.defaultCheck.checkAmbientF)} unit="degF" />
        <Tile label="Duty fraction" value={e6(h.defaultCheck.dutyFraction)} />
        <Tile label="Duty" value={r4(h.defaultCheck.qBtuHr)} unit="Btu/hr" />
        <Tile label="Process leaving" value={e6(h.defaultCheck.processOutF)} unit="degF" />
      </TileGrid>
      <p className="text-xs text-slate-300 font-mono mt-1 mb-0">{h.defaultCheck.note}</p>
      <Note>
        The rated answer is self-consistent in both directions: the process capacity rate times the drop to the new
        outlet is {r4(h.selfConsistency.processSideDerived)} Btu an hour, derived, and the air capacity rate times the new
        rise is {r4(h.selfConsistency.airSideDerived)}, derived, against a rated duty of
        {' '}{r4(h.selfConsistency.ratedDuty)}.
      </Note>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        And a cold morning, where the duty fraction goes above one. The engine says what that means in words rather than
        printing a number above one and leaving it there:
      </p>
      <p className="text-xs text-slate-300 font-mono mt-1 mb-0">{h.coldDay.note}</p>
      <Tbl
        head={['U, Btu/hr.ft2.F', 'bare surface, ft2', 'UA, Btu/hr.F', 'duty fraction', 'process out on the hot day, degF']}
        rows={h.uInvariance.map((u) => [
          e6(u.uBtuHrFt2F), e6(u.areaFt2), r4(u.uaBtuHrF), e6(u.dutyFraction), e6(u.processOutF),
        ])}
      />
      <Note>
        The surface column moves and the last three do not. UA is the duty over the design log mean, so the hot-day rating
        cannot see U and the area separately at all, which is why the published rows carry UA and no coefficient.
      </Note>
      <Tbl
        head={['design duty', 'process in', 'process out', 'design ambient', 'check ambient', 'duty fraction', 'golden', 'duty', 'golden duty', 'process out', 'golden', 'air rise', 'golden', 'UA', 'golden UA']}
        rows={h.publishedHotDay.map((p) => [
          r4(p.qBtuHr), e6(p.processInF), e6(p.processOutF), e6(p.ambientF), e6(p.checkAmbientF),
          e6(p.dutyFraction), e6(p.goldenDutyFraction), r4(p.hotQBtuHr), r4(p.goldenHotQBtuHr),
          e6(p.hotProcessOutF), e6(p.goldenHotProcessOutF), e6(p.hotAirRiseF), e6(p.goldenHotAirRiseF),
          r4(p.uaBtuHrF), r4(p.goldenUaBtuHrF),
        ])}
      />
      <Note>
        The oracle behind those golden columns reaches the same answers by the OTHER method: it bisects on the duty until
        the surface equation balances and never evaluates the effectiveness relation at all.
      </Note>
      {h.refusals.map((r) => <Refusal key={r.label} probe={r} />)}
    </>
  );
};

export const SecondMethodMode = ({ m }) => {
  if (!m || !Array.isArray(m.rows)) return <Empty>The second-method reader has returned nothing, so there is no ratio to draw.</Empty>;
  const chart = m.rows.map((r, i) => ({ row: i + 1, ratio: r.ratioDerived }));
  return (
    <>
      <TileGrid>
        <Tile label="Rows checked" value={n0(m.rows.length)} />
        <Tile label="First ratio" value={e6(m.rows[0].ratioDerived)} />
        <Tile label="Last ratio" value={e6(m.rows[m.rows.length - 1].ratioDerived)} />
        <Tile label="Every ratio is one to the printed precision" value={yn(m.everyRatioIsOneToThePrintedPrecision)} />
      </TileGrid>
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="row" tick={AXIS} label={{ value: 'row of the sweep', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} domain={[0.99, 1.01]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => e6(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#BFFF00" strokeDasharray="4 4" label={{ value: 'the two methods agreeing', fill: '#BFFF00', fontSize: 10, position: 'insideTopRight' }} />
            <Line dataKey="ratio" name="UA times the hot-day log mean, over the rated duty" stroke={SERIES[0]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The hot day was rated by effectiveness-NTU. There is another classical route to the same answer and it is
        genuinely independent: solve the duty out of the surface equation itself, at the fixed UA and at whatever log
        mean the new outlet and the new air rise produce. If both are right they must agree, because a rated answer has
        to satisfy the surface equation it came from, so the product of the fixed UA and the hot-day log mean is a CHECK
        rather than a restatement.
      </Note>
      <Tbl
        head={['case', 'check ambient, degF', 'rated duty, Btu/hr', 'UA times the hot-day log mean, Btu/hr', 'the two as a ratio']}
        rows={m.rows.map((r) => [r.label, e6(r.checkAmbientF), r4(r.ratedDuty), r4(r.uaTimesLmtdDerived), e6(r.ratioDerived)])}
      />
      <Note>
        Two methods agree where a single method can only be consistent with itself. A rating that holds a duty and an
        outlet temperature its own duty cannot produce satisfies NEITHER method, and checking against a second method is
        what turns an answer into a result.
      </Note>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The other places this course shows two methods meeting, all of them in a golden column. Read the last column for
        what it does NOT contain: a second copy of the first.
      </p>
      <Tbl
        head={['what', 'the engine route', 'the oracle route']}
        rows={m.routes.map((r) => [r.what, r.engineRoute, r.oracleRoute])}
      />
      <Note>
        Restating the same expression in SI units and converting back is a multiply followed by a divide, so it checks the
        units and nothing else. Marching a differential equation to the answer a closed form claims, or bisecting on a
        different equation entirely, is a second method. The difference is whether the check could have failed for a
        reason other than a typing error.
      </Note>
    </>
  );
};

const RatingExplorer = ({ initialMode = 'surface' }) => {
  const [mode, setMode] = useState(initialMode);
  const [cr, setCr] = useState(String(CEILING_CR));
  const e = useMemo(() => (mode === 'surface' ? safe(effectivenessSurface) : null), [mode]);
  const c = useMemo(() => (mode === 'collapse' ? safe(collapseAtZero) : null), [mode]);
  const a = useMemo(() => (mode === 'bay' ? safe(airCoolerDesign) : null), [mode]);
  const history = useMemo(() => (mode === 'bay' ? safe(historyCarryingRefusals) : null), [mode]);
  const h = useMemo(() => (mode === 'hotday' ? safe(hotDaySweep) : null), [mode]);
  const m = useMemo(() => (mode === 'second' ? safe(secondMethod) : null), [mode]);

  return (
    <PanelShell
      title="Rating explorer"
      subtitle="Rating, the hot day and the second method: effectiveness against NTU for three arrangements with two ceilings drawn as asymptotes and the counter-current curve drawn with none, the collapse at a capacity ratio of zero, the bay whose cross-flow correction the module declines, the hot day with four columns that hold beside two that move, and UA times the hot-day log mean against the rated duty as a ratio that sits at one."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'surface' && <EffectivenessMode e={e} cr={cr} onCr={setCr} />}
        {mode === 'collapse' && <CollapseMode c={c} />}
        {mode === 'bay' && <BayMode a={a} history={history} />}
        {mode === 'hotday' && <HotDayMode h={h} />}
        {mode === 'second' && <SecondMethodMode m={m} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored heat transfer engine through the teaching lab,
        printed to the precision the teaching digest prints. Duties and UA are in Btu an hour, temperatures in degF, air
        densities in lb per ft3 to nine decimals, fan and motor power in horsepower, and effectiveness, NTU and the
        capacity ratio are plain numbers. Every refusal shown is the engine's own message, with whatever evidence the
        same return carried.
      </Note>
    </PanelShell>
  );
};

export default RatingExplorer;
