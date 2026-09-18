import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  balanceThreeWays, logMeanBothPairings, surfaceFromThree, tubesAndOvershoot, loopCloses,
  historyCarryingRefusals, heldItems, e6, r4, n0, yn,
  STUDIO_TERMINALS, STUDIO_GEOMETRY, STUDIO_SEEDS,
} from './heattransferLab';
import {
  Tbl, Held, Refusal, Note, Empty, safe,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Exchanger explorer, the Associate tier throughout.
//
// FOUR QUESTIONS IN A CHAIN, AND THE CHAIN IS A LOOP. What duty do these two
// streams exchange, across what driving force, through what coefficient, over
// how much surface and how many tubes. The last of those feeds the first, and the
// point of this page is the fifth view, where the count settles and a reader
// watches it settle rather than being told that it does.
//
// WHICH STATING PRODUCED A DUTY IS THE THING A READER HAS TO BE ABLE TO SAY, so
// the basis the engine reports sits beside every duty on the first view.
//
// THE ARITHMETIC MEAN IS DRAWN RATHER THAN ASSERTED. The log mean sitting below
// it whenever the two ends differ is an analytic limit, and a limit is worth more
// seen than stated.
//
// Every figure on this page is a return value from heattransferLab, which is a
// return value of the vendored heat transfer engine on the studio case and on
// ORON. Nothing here computes a duty, a driving force, a coefficient or a count,
// and nothing reads a clock.
//
// NO PERCENTILE. Nothing in this course is a distribution. The letter P on this
// page is the dimensionless temperature group and nothing else.

export const MODES = [
  ['balance', 'The balance: one duty, three statings, and the basis the engine reports'],
  ['logmean', 'The driving force: two pairings, with the arithmetic mean drawn'],
  ['surface', 'The surface out of three numbers, clean and dirty'],
  ['tubes', 'The tubes: two roundings up, and an overshoot that is always positive'],
  ['loop', 'The tube count closing as a loop, with its trail'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const SERIES = ['#38bdf8', '#f472b6', '#BFFF00', '#fbbf24'];

// ---------------------------------------------------------------------------

export const BalanceMode = ({ b, history }) => {
  if (!b || !b.studio) return <Empty>The balance reader has returned nothing, so there is no duty to show.</Empty>;
  const frames = history && Array.isArray(history.labels) ? history.labels : [];
  return (
    <>
      <TileGrid>
        <Tile label="Hot capacity rate" value={r4(b.cMin)} unit="Btu/hr.F" />
        <Tile label="Cold capacity rate" value={r4(b.cMax)} unit="Btu/hr.F" />
        <Tile label="Duty" value={r4(b.studio.qBtuHr)} unit="Btu/hr" />
        <Tile label="Basis the engine reports" value={b.studio.basis} />
      </TileGrid>
      <Note>
        A capacity rate is a mass flow times a heat capacity, and it is the whole of what a balance knows about a
        stream. The smaller of the two governs a rating, and the capacity ratio is {e6(b.capacityRatioDerived)},
        derived as the smaller over the larger.
      </Note>
      <Tbl
        head={['stream', 'lb/hr', 'Btu/lb.F', 'capacity rate, Btu/hr.F']}
        rows={b.capacityRates.map((c) => [c.label, r4(c.mLbHr), e6(c.cpBtuLbF), r4(c.cBtuHrF)])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The same duty, stated three ways on the same two streams. All three agree, and the engine names which one it
        worked from on its own basis key, which is why that column is here at all.
      </p>
      <Tbl
        head={['stated', 'duty, Btu/hr', 'hot outlet, degF', 'cold outlet, degF', 'basis']}
        rows={b.statings.map((s) => [s.stated, r4(s.qBtuHr), e6(s.thOut), e6(s.tcOut), s.basis])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The arrangement decides which cross test runs. This duty is refused for parallel flow with both outlet
        temperatures handed back as evidence, and answered counter-current at the same figure.
      </p>
      <Refusal probe={b.parallelRefusedCounterAnswered.refusal} />
      <TileGrid>
        <Tile label="Counter-current duty" value={r4(b.parallelRefusedCounterAnswered.answer.qBtuHr)} unit="Btu/hr" />
        <Tile label="Hot leaving" value={e6(b.parallelRefusedCounterAnswered.answer.thOut)} unit="degF" />
        <Tile label="Cold leaving" value={e6(b.parallelRefusedCounterAnswered.answer.tcOut)} unit="degF" />
        <Tile label="Hot inlet" value={e6(STUDIO_TERMINALS.thIn)} unit="degF" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        And the arrangement itself, read three ways. A capital letter answers as the arrangement it names, and a string
        this module does not carry is refused rather than defaulted.
      </p>
      <Tbl
        head={['given as', 'log mean, degF', 'counter-current on the same four temperatures']}
        rows={[
          [b.arrangementThreeWays.lowerCase.given, e6(b.arrangementThreeWays.lowerCase.lmtdF), e6(b.arrangementThreeWays.counterOnTheSameFour)],
          [b.arrangementThreeWays.capitalised.given, e6(b.arrangementThreeWays.capitalised.lmtdF), e6(b.arrangementThreeWays.counterOnTheSameFour)],
        ]}
      />
      <Refusal probe={b.arrangementThreeWays.unknown} />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        Six states this balance will not compute, each one a state a saved study can carry, and each message naming the
        box rather than the physics.
      </p>
      {b.refusals.map((r) => (
        <Refusal key={r.label} probe={r} frame={frames.includes(r.label) ? history.frame : null} />
      ))}
    </>
  );
};

export const LogMeanMode = ({ l }) => {
  if (!l || !Array.isArray(l.rows)) return <Empty>The log mean reader has returned nothing, so there is no driving force to draw.</Empty>;
  const chart = l.rows.map((r, i) => ({
    row: `${i + 1}`,
    label: `${r.label} ${r.arrangement}`,
    logMean: r.lmtdF,
    arithmeticMean: r.arithmeticMeanDerived,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Studio counter-current log mean" value={e6(l.rows[0].lmtdF)} unit="degF" />
        <Tile label="Its arithmetic mean" value={e6(l.rows[0].arithmeticMeanDerived)} unit="degF" />
        <Tile label="Studio parallel log mean" value={e6(l.rows[1].lmtdF)} unit="degF" />
        <Tile label="Below on every unequal row" value={yn(l.strictlyBelowOnEveryUnequalRow)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="row" tick={AXIS} label={{ value: 'case', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => e6(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="arithmeticMean" name="arithmetic mean of the two ends, degF" stroke={SERIES[1]} dot isAnimationActive={false} />
            <Line dataKey="logMean" name="log mean, degF" stroke={SERIES[0]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Read the two curves against each other. The log mean sits strictly below the arithmetic mean on every row whose
        two ends differ and lands on it where they do not. That is an analytic limit and it needs no publication to
        check, which is why it is drawn here rather than claimed.
      </Note>
      <Tbl
        head={['case', 'arrangement', 'end one, degF', 'end two, degF', 'log mean, degF', 'arithmetic mean, degF', 'equal ends', 'golden log mean']}
        rows={l.rows.map((r) => [
          r.label, r.arrangement, e6(r.dt1), e6(r.dt2), e6(r.lmtdF),
          e6(r.arithmeticMeanDerived), yn(r.equalEnds), r.goldenLmtdF === null ? 'none' : e6(r.goldenLmtdF),
        ])}
      />
      <Note>
        The golden column is the oracle's own answer, reached by integrating the driving force the closed form is the
        closed form of, so it never evaluates a logarithm at all. Two methods meeting is worth more than one method
        restated.
      </Note>
      <TileGrid>
        <Tile label="Ends driven to the same number" value={e6(l.equalEnded.dt1)} unit="degF" />
        <Tile label="Log mean there" value={e6(l.equalEnded.lmtdF)} unit="degF" />
        <Tile label="Equal ends reported as" value={yn(l.equalEnded.equalEnds)} />
        <Tile label="1-2 shell log mean" value={e6(l.shell1.lmtdF)} unit="degF" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A 1-2 shell exchanger asks for the log mean too and gets the counter-current one with a note attached, on a
        basis the engine reports as {l.shell1.basis}. The note is the engine's own and it is the point of the tile:
      </p>
      <p className="text-xs text-slate-300 font-mono mt-1 mb-0">{l.shell1.note}</p>
      {l.refusals.map((r) => <Refusal key={r.label} probe={r} />)}
    </>
  );
};

export const SurfaceMode = ({ s, coefficient, onCoefficient }) => {
  if (!s || !Array.isArray(s.rows)) return <Empty>The surface reader has returned nothing, so there is no area to show.</Empty>;
  const dirty = coefficient !== 'clean';
  const chosen = dirty ? s.cleanAgainstDirty.atDirty : s.cleanAgainstDirty.atClean;
  const chosenU = dirty ? s.cleanAgainstDirty.uDirty : s.cleanAgainstDirty.uClean;
  return (
    <>
      <FieldGrid>
        <SelectField
          label="Coefficient"
          value={coefficient}
          onChange={onCoefficient}
          options={[['dirty', 'U dirty, the one the exchanger is bought on'], ['clean', 'U clean, the one it starts life at']]}
        />
      </FieldGrid>
      <TileGrid>
        <Tile label="Coefficient in hand" value={e6(chosenU)} unit="Btu/hr.ft2.F" />
        <Tile label="Surface it asks for" value={e6(chosen)} unit="ft2" />
        <Tile label="At U dirty" value={e6(s.cleanAgainstDirty.atDirty)} unit="ft2" />
        <Tile label="At U clean" value={e6(s.cleanAgainstDirty.atClean)} unit="ft2" />
      </TileGrid>
      <Note>
        The surface you buy is sized on the dirty coefficient, because the exchanger has to do its duty when it is
        dirty. Switch the box above and the difference between the two is the whole of what a fouling allowance costs in
        steel.
      </Note>
      <Tbl
        head={['case', 'duty, Btu/hr', 'U, Btu/hr.ft2.F', 'F', 'log mean, degF', 'area, ft2', 'golden area, ft2']}
        rows={s.rows.map((r) => [
          r.label, r4(r.qBtuHr), e6(r.uDirty), e6(r.f), e6(r.lmtdF), e6(r.areaFt2),
          r.goldenAreaFt2 === null ? 'none' : e6(r.goldenAreaFt2),
        ])}
      />
      <Note>
        The surface is the duty divided by the coefficient, the correction factor and the log mean, and nothing else,
        which means every error in any of those three arrives in the area unchanged.
      </Note>
      {s.refusals.map((r) => <Refusal key={r.label} probe={r} />)}
    </>
  );
};

export const TubesMode = ({ t }) => {
  if (!t || !Array.isArray(t.rows)) return <Empty>The tube reader has returned nothing, so there is no count to show.</Empty>;
  return (
    <>
      <TileGrid>
        <Tile label="One tube carries" value={e6(t.rows[0].areaPerTubeFt2)} unit="ft2" />
        <Tile label="Tubes" value={n0(t.rows[0].nTubes)} />
        <Tile label="Tubes a pass" value={n0(t.rows[0].tubesPerPass)} />
        <Tile label="Overshoot" value={e6(t.rows[0].areaMarginPct)} unit="percent" />
      </TileGrid>
      <Note>
        The count is the area divided by one tube, rounded up twice: once to a whole tube, and again to a whole multiple
        of the pass count, because a multi-pass bundle puts the same number of tubes in every pass. Before that second
        rounding the studio count would have been {n0(t.countBeforeTheSecondRoundingDerived)}, derived as the area over
        one tube rounded up, and the engine returns {n0(t.countTheEngineReturns)}.
      </Note>
      <Tbl
        head={['case', 'area asked for, ft2', 'one tube, ft2', 'passes', 'tubes', 'tubes a pass', 'actual area, ft2', 'overshoot, percent', 'golden tubes']}
        rows={t.rows.map((r) => [
          r.label, e6(r.areaAskedForFt2), e6(r.areaPerTubeFt2), n0(r.passes), n0(r.nTubes),
          n0(r.tubesPerPass), e6(r.actualAreaFt2), e6(r.areaMarginPct),
          r.goldenTubes === null ? 'none' : n0(r.goldenTubes),
        ])}
      />
      <Note>
        The overshoot is positive on every row above, measured as {yn(t.overshootIsAlwaysPositive)}, and the engine
        reports it rather than leaving a reader to notice. A whole number of tubes cannot land exactly on a required
        area, so the surface you get is always at or above the surface you asked for. Every published count agrees with
        the oracle: {yn(t.everyPublishedCountAgrees)}.
      </Note>
      {t.refusals.map((r) => <Refusal key={r.label} probe={r} />)}
    </>
  );
};

export const LoopMode = ({ loop, held }) => {
  if (!loop || !loop.studio) return <Empty>The loop reader has returned nothing, so there is no trail to draw.</Empty>;
  const trail = loop.studio.trail.concat([loop.studio.nTubes])
    .map((nTubes, i) => ({ pass: i, nTubes }));
  const cost = loop.trailRows.filter((r) => !r.refusal).map((r) => ({
    nTubes: r.nTubes, re: r.re, film: r.hBtuHrFt2F, uDirty: r.uDirty, area: r.areaFt2,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Trail" value={loop.studio.trail.map((n) => n0(n)).join(', ')} unit="tubes" />
        <Tile label="Passes of the loop" value={n0(loop.studio.iterations)} />
        <Tile label="Converged" value={yn(loop.studio.converged)} />
        <Tile label="Seed ladder" value={STUDIO_SEEDS.map((n) => n0(n)).join(', ')} unit="tubes" />
      </TileGrid>
      <Note>
        The chain is a loop rather than a line: the film needs a tube count, the count needs an area, the area needs the
        coefficient, and the coefficient needs the film. The map is a contraction, so plain iteration settles. The
        studio walks a seed ladder because an intermediate count can land in the band the film refuses, and the first
        seed that evaluates starts the loop.
      </Note>
      {loop.studio.refusedSeeds.map((r) => <Refusal key={r.label} probe={r} />)}
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trail} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="pass" tick={AXIS} label={{ value: 'pass of the loop', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => n0(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={loop.studio.nTubes} stroke="#BFFF00" strokeDasharray="4 4" label={{ value: `settles at ${n0(loop.studio.nTubes)}`, fill: '#BFFF00', fontSize: 10, position: 'insideTopRight' }} />
            <Line dataKey="nTubes" name="tube count" stroke={SERIES[0]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={cost} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="nTubes" tick={AXIS} label={{ value: 'tubes', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} yAxisId="left" />
            <YAxis tick={AXIS} yAxisId="right" orientation="right" />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => e6(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="left" dataKey="film" name="inside film coefficient, Btu/hr.ft2.F" stroke={SERIES[1]} dot isAnimationActive={false} />
            <Line yAxisId="right" dataKey="uDirty" name="U dirty, Btu/hr.ft2.F" stroke={SERIES[2]} dot isAnimationActive={false} />
            <Line yAxisId="right" dataKey="area" name="area it asks for, ft2" stroke={SERIES[3]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['tubes', 'tubes a pass', 'Reynolds', 'regime', 'film coefficient', 'U dirty that follows', 'area that follows, ft2']}
        rows={loop.trailRows.map((r) => (r.refusal
          ? [n0(r.nTubes), 'refused', e6(r.refusal.evidence.re), 'refused', 'refused', 'refused', 'refused']
          : [n0(r.nTubes), n0(r.tubesPerPass), e6(r.re), r.regime, e6(r.hBtuHrFt2F), e6(r.uDirty), e6(r.areaFt2)]))}
      />
      <Note>
        The count is what sets the velocity, so it sets the Reynolds number, so it sets the film, so it sets the
        coefficient and the area. A coefficient computed at a tube count the same screen contradicts is not a
        coefficient of anything, which is why the loop is closed here rather than seeded with a better constant.
      </Note>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The studio case at its converged count, top to bottom. Every figure is on the live app screen.
      </p>
      <Tbl
        head={['quantity', 'value']}
        rows={[
          ['duty, Btu/hr', r4(loop.studio.qBtuHr)],
          ['cold outlet, degF', e6(loop.studio.tcOut)],
          ['log mean driving force, degF', e6(loop.studio.lmtdF)],
          ['P', e6(loop.studio.p)],
          ['R', e6(loop.studio.r)],
          ['tube-side Reynolds number', e6(loop.studio.re)],
          ['tube-side Prandtl number', e6(loop.studio.pr)],
          ['tube-side regime', loop.studio.regime],
          ['inside film coefficient, Btu/hr.ft2.F', e6(loop.studio.hiBtuHrFt2F)],
          ['U clean, Btu/hr.ft2.F', e6(loop.studio.uClean)],
          ['U dirty, Btu/hr.ft2.F', e6(loop.studio.uDirty)],
          ['fouling penalty, percent', e6(loop.studio.foulingPenaltyPct)],
          ['controlling resistance', loop.studio.controlling],
          ['its runner up', loop.studio.runnerUp],
          ['the margin between them, percent', e6(loop.studio.controllingMarginPct)],
          ['is that margin clear of the declared threshold', yn(loop.studio.controllingClear)],
          ['area required, ft2', e6(loop.studio.areaFt2)],
          ['tubes', n0(loop.studio.nTubes)],
          ['tubes a pass', n0(loop.studio.tubesPerPass)],
          ['actual area, ft2', e6(loop.studio.actualAreaFt2)],
          ['area overshoot, percent', e6(loop.studio.areaMarginPct)],
          ['bundle diameter, inches', e6(loop.studio.bundleDiameterIn)],
          ['shell diameter, inches', e6(loop.studio.shellDiameterIn)],
        ]}
      />
      <Note>
        Self-consistency is the check that catches a loop that has not closed. U times the area times F times the log
        mean is {r4(loop.selfConsistency.studioUatfDerived)} Btu an hour, derived from the four figures above, against
        the duty of {r4(loop.selfConsistency.studioDuty)}. ORON closes the same way at four passes, with a trail of
        {' '}{loop.oron.trail.map((n) => n0(n)).join(', ')} tubes in {n0(loop.oron.iterations)} passes of the loop.
      </Note>
      {held && (
        <Held>
          The bundle and shell diameters in the table above come from a fitted geometry table whose source is not
          established in this repository, and the film coefficient in it comes from a fitted correlation whose validity
          band nobody here can state. Both are stated limits rather than validated answers, and nothing in this course
          grades either. The Coefficient explorer carries the whole register.
        </Held>
      )}
    </>
  );
};

const ExchangerExplorer = ({ initialMode = 'balance' }) => {
  const [mode, setMode] = useState(initialMode);
  const [coefficient, setCoefficient] = useState('dirty');
  const b = useMemo(() => (mode === 'balance' ? safe(balanceThreeWays) : null), [mode]);
  const history = useMemo(() => (mode === 'balance' ? safe(historyCarryingRefusals) : null), [mode]);
  const l = useMemo(() => (mode === 'logmean' ? safe(logMeanBothPairings) : null), [mode]);
  const s = useMemo(() => (mode === 'surface' ? safe(surfaceFromThree) : null), [mode]);
  const t = useMemo(() => (mode === 'tubes' ? safe(tubesAndOvershoot) : null), [mode]);
  const loop = useMemo(() => (mode === 'loop' ? safe(loopCloses) : null), [mode]);
  const held = useMemo(() => (mode === 'loop' ? safe(heldItems) : null), [mode]);

  return (
    <PanelShell
      title="Exchanger explorer"
      subtitle={`The studio case and ORON in field units: the duty from any one of three statings with the basis beside it, the log mean in both pairings against the arithmetic mean, the surface out of three numbers, the tubes with their two roundings, and the tube count closing as a loop at ${n0(STUDIO_GEOMETRY.passes)} passes.`}
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'balance' && <BalanceMode b={b} history={history} />}
        {mode === 'logmean' && <LogMeanMode l={l} />}
        {mode === 'surface' && <SurfaceMode s={s} coefficient={coefficient} onCoefficient={setCoefficient} />}
        {mode === 'tubes' && <TubesMode t={t} />}
        {mode === 'loop' && <LoopMode loop={loop} held={held} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored heat transfer engine through the teaching lab,
        printed to the precision the teaching digest prints. Duties, capacity rates and UA are in Btu an hour,
        temperatures and log means in degF, areas in ft2, coefficients in Btu an hour per ft2 per degF, and diameters in
        inches. Every refusal shown is the engine's own message, with whatever evidence the same return carried.
      </Note>
    </PanelShell>
  );
};

export default ExchangerExplorer;
