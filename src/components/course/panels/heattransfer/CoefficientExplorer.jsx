import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceArea, ReferenceLine,
} from 'recharts';
import {
  resistanceStack, thinWallLimit, filmThreeRegimes, coolingRefused, correctionAcrossP,
  bundleAndLayout, historyCarryingRefusals, e6, r4, r9, n0, yn,
  F_R_FIXED, FILM_WALL_VISCOSITY,
} from './heattransferLab';
import {
  Tbl, Held, Refusal, Note, Empty, safe,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Coefficient explorer, the Professional tier throughout and the Expert module
// that reads the bundle.
//
// THE WHOLE POINT OF ASSEMBLING U FROM ITS PARTS IS THAT THE CONTROLLING TERM
// BECOMES VISIBLE, so this page prints the five resistances as a stack with their
// shares, the runner up, and the margin that decided the verdict. A panel that
// printed one word would have thrown the point away.
//
// A WARNING AND A REFUSAL ARE DIFFERENT ANSWERS and the two are marked
// differently here, on the correction curve and on the film curve both. The
// transition band is drawn as the refusal it is rather than as a gap in a curve,
// and the engine hands back the Reynolds number that put the case there.
//
// FIVE FITTED CONSTANTS AND SEVEN HELD ENTRIES REACH THIS PAGE. A pin is not a
// validation and no oracle can validate a fit, so none of them is presented as
// validated anywhere on it. The Layout box is DECORATIVE between two of the three
// angles the module carries, measured as data rather than claimed, and the bundle
// view says so beside the table that shows it.
//
// Every figure here is a return value from heattransferLab. Nothing on this page
// computes a resistance, a film coefficient, a correction factor or a diameter,
// and nothing reads a clock.

export const MODES = [
  ['stack', 'Five named resistances, their shares, the runner up and the margin'],
  ['wall', 'The thin-wall limit against the flat plate, and the factor it fixes'],
  ['film', 'The tube-side film across three regimes, with the refused band drawn'],
  ['cooling', 'The cooling exponent this module declines to invent'],
  ['correction', 'The correction factor across P, with the warning band and the refusal'],
  ['bundle', 'The bundle, the shell, and the two layout rows that are equal'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const SERIES = ['#38bdf8', '#f472b6', '#BFFF00', '#fbbf24'];

// ---------------------------------------------------------------------------

export const StackMode = ({ s, history }) => {
  if (!s || !Array.isArray(s.terms)) return <Empty>The resistance reader has returned nothing, so there is no stack to draw.</Empty>;
  const frames = history && Array.isArray(history.labels) ? history.labels : [];
  const chart = s.terms.map((t) => ({ term: t.name, sharePct: t.sharePct }));
  return (
    <>
      <TileGrid>
        <Tile label="U clean" value={e6(s.uClean)} unit="Btu/hr.ft2.F" />
        <Tile label="U dirty" value={e6(s.uDirty)} unit="Btu/hr.ft2.F" />
        <Tile label="Controlling resistance" value={s.controlling} />
        <Tile label="Its runner up" value={s.runnerUp} />
      </TileGrid>
      <TileGrid>
        <Tile label="Margin that decided it" value={e6(s.controllingMarginPct)} unit="percent" />
        <Tile label="Declared threshold" value={n0(s.declaredMarginPct)} unit="percent" />
        <Tile label="Clear of that threshold" value={yn(s.controllingClear)} />
        <Tile label="Reference area" value={s.referenceArea} />
      </TileGrid>
      <Note>
        Naming the largest resistance is the point of assembling U from its parts, because that is the term worth
        spending money on. A one-word verdict decided by a small gap is a coin toss wearing a result's clothes, so the
        engine reports the runner up and the margin as well. The threshold is declared by this module and is not a
        published limit.
      </Note>
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="term" tick={AXIS} />
            <YAxis tick={AXIS} label={{ value: 'share of the total, percent', fill: '#94a3b8', fontSize: 11, angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => e6(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="sharePct" name="share of the total resistance, percent" stroke={SERIES[0]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['term', 'resistance, hr.ft2.F per Btu', 'share of the total, percent']}
        rows={s.terms.map((t) => [t.name, r9(t.resistance), e6(t.sharePct)])
          .concat([['the total', r9(s.totalResistance), e6(s.shareSumDerived)]])}
      />
      <Note>
        The five add to the total: {r9(s.totalSumDerived)}, derived as the five rows above added, against the engine's
        {' '}{r9(s.totalResistance)}. U dirty is one over that total and U clean is one over the three terms that carry
        no fouling.
      </Note>
      <TileGrid>
        <Tile label="Fouling penalty" value={e6(s.foulingPenaltyPct)} unit="percent" />
        <Tile label="The two fouling terms' share" value={e6(s.foulingShareOfTotalPctDerived)} unit="percent" />
        <Tile label="Diameter ratio" value={e6(s.diameterRatioDerived)} />
        <Tile label="Inside film coefficient" value={e6(s.insideFilmCoefficient)} unit="Btu/hr.ft2.F" />
      </TileGrid>
      <Note>
        Those first two tiles are the same number, and that identity is the thing worth seeing: one minus clean over
        total is exactly the fouling terms over the total, so the penalty in percent IS the fouling share of the
        resistance stack. It is an identity rather than a second calculation.
      </Note>
      <Note>
        The inside terms are referred to the outside area by the diameter ratio, and that is visible in the numbers.
        One over the inside film coefficient is {r9(s.oneOverInsideFilmDerived)}, derived, and the engine's inside film
        resistance is {r9(s.insideFilmResistance)}, which is the first figure multiplied by the ratio. The inside
        fouling allowance is {r9(s.insideFoulingAsTyped)} as typed and {r9(s.insideFoulingInTheStack)} in the stack, by
        the same ratio, while the outside allowance of {r9(s.outsideFoulingAsTyped)} is already on the reference area and
        is carried unchanged.
      </Note>
      <Tbl
        head={['case', 'controlling', 'runner up', 'margin, percent of the controlling term', 'clear']}
        rows={s.verdictRows.map((v) => [v.label, v.controlling, v.runnerUp, e6(v.controllingMarginPct), yn(v.controllingClear)])}
      />
      <Tbl
        head={['ho', 'hi', 'do', 'di', 'U clean', 'golden U clean', 'U dirty', 'golden U dirty', 'controlling']}
        rows={s.publishedU.map((p) => [
          e6(p.ho), e6(p.hi), e6(p.doIn), e6(p.diIn), e6(p.uClean), e6(p.goldenUClean),
          e6(p.uDirty), e6(p.goldenUDirty), p.controlling,
        ])}
      />
      <Note>
        The golden columns sit beside the engine columns on purpose. The oracle builds this stack on each term's own area
        and refers it to the outside only at the end, and it takes the wall term by quadrature rather than by a
        logarithm, so the agreement there is two methods meeting.
      </Note>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        And a case built deliberately near, where the verdict is a coin toss and the engine says so rather than letting
        one word stand.
      </p>
      <Tbl
        head={['outside film', 'inside film', 'controlling', 'runner up', 'margin, percent', 'clear']}
        rows={[[
          r9(s.builtDeliberatelyNear.outsideFilm), r9(s.builtDeliberatelyNear.insideFilm),
          s.builtDeliberatelyNear.controlling, s.builtDeliberatelyNear.runnerUp,
          e6(s.builtDeliberatelyNear.controllingMarginPct), yn(s.builtDeliberatelyNear.controllingClear),
        ]]}
      />
      <p className="text-xs text-slate-300 font-mono mt-1 mb-0">{s.builtDeliberatelyNear.note}</p>
      {s.refusals.map((r) => (
        <Refusal key={r.label} probe={r} frame={frames.includes(r.label) ? history.frame : null} />
      ))}
    </>
  );
};

export const WallMode = ({ w }) => {
  if (!w || !Array.isArray(w.rows)) return <Empty>The wall reader has returned nothing, so there is no limit to draw.</Empty>;
  const chart = w.rows.map((r) => ({ thickness: r.thicknessIn, ratio: r.ratioAtMiddleKDerived }));
  return (
    <>
      <TileGrid>
        <Tile label="Outside diameter" value={e6(w.doIn)} unit="inches" />
        <Tile label="Middle conductivity" value={n0(w.middleK)} unit="Btu/hr.ft.F" />
        <Tile label="Ratio at the thickest wall" value={e6(w.rows[0].ratioAtMiddleKDerived)} />
        <Tile label="Ratio at the thinnest" value={e6(w.rows[w.rows.length - 1].ratioAtMiddleKDerived)} />
      </TileGrid>
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="thickness" tick={AXIS} reversed label={{ value: 'wall thickness, inches, thinning to the right', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} domain={[1, 'auto']} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => e6(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#BFFF00" strokeDasharray="4 4" label={{ value: 'the flat plate', fill: '#BFFF00', fontSize: 10, position: 'insideBottomRight' }} />
            <Line dataKey="ratio" name="cylindrical wall over flat plate" stroke={SERIES[0]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        As the wall thins the cylindrical expression has to collapse onto the flat plate, which is the thickness over the
        conductivity and nothing else. The curve approaching one is that limit, and it is the limit that fixes the factor
        of two in the wall term. Move that factor the same way in the engine and in the oracle and the two files go on
        agreeing with each other while neither agrees with the plate, which is why an analytic limit is worth more than a
        matching method here.
      </Note>
      <Tbl
        head={['wall thickness, inches']
          .concat(w.kSweep.map((k) => `wall at k ${n0(k)}`))
          .concat(w.kSweep.map((k) => `flat plate at k ${n0(k)}`))
          .concat(['ratio at the middle conductivity'])}
        rows={w.rows.map((r) => [e6(r.thicknessIn)]
          .concat(r.wall.map((x) => r9(x.resistance)))
          .concat(r.plateDerived.map((x) => r9(x.resistance)))
          .concat([e6(r.ratioAtMiddleKDerived)]))}
      />
      <Note>
        Read the two halves of the table against each other row by row. Every ratio is above one, measured as
        {' '}{yn(w.everyRatioAboveOne)}, and each row is closer to one than the row above it, measured as
        {' '}{yn(w.ratioFallsTowardOne)}. The wall is the smallest of the five terms on the studio case at
        {' '}{e6(w.wallSharePctOnTheStudioCase)} percent of the total, which is usual for metal and is not a reason to
        skip it: the three conductivity columns stand in inverse proportion to their conductivities.
      </Note>
    </>
  );
};

export const FilmMode = ({ f, history }) => {
  if (!f || !f.converged) return <Empty>The film reader has returned nothing, so there is no regime to draw.</Empty>;
  const frames = history && Array.isArray(history.labels) ? history.labels : [];
  const answered = f.flowRows.filter((r) => !r.refusal);
  const refused = f.flowRows.filter((r) => r.refusal);
  const chart = f.flowRows.map((r) => ({
    re: r.re,
    film: r.refusal ? null : r.hBtuHrFt2F,
    flow: r.mLbHr,
  })).sort((a, b) => a.re - b.re);
  return (
    <>
      <TileGrid>
        <Tile label="Reynolds at the converged count" value={e6(f.converged.re)} />
        <Tile label="Prandtl" value={e6(f.converged.pr)} />
        <Tile label="Regime" value={f.converged.regime} />
        <Tile label="Film coefficient" value={e6(f.converged.hBtuHrFt2F)} unit="Btu/hr.ft2.F" />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="re" scale="log" domain={['auto', 'auto']} type="number" tick={AXIS} label={{ value: 'Reynolds number', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => e6(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceArea
              x1={f.transitionBand.low}
              x2={f.transitionBand.high}
              fill="#dc2626"
              fillOpacity={0.25}
              stroke="#dc2626"
              label={{ value: 'REFUSED', fill: '#fca5a5', fontSize: 10 }}
            />
            <Line dataKey="film" name="film coefficient, Btu/hr.ft2.F" stroke={SERIES[0]} connectNulls={false} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The red band between Reynolds {n0(f.transitionBand.low)} and {n0(f.transitionBand.high)} is a REFUSAL rather than
        a gap in a curve. No correlation there is trustworthy, so the engine declines and hands back the Reynolds number
        that put the case in the band, which is the evidence a reader needs in order to leave it. The curve is drawn
        broken across the band on purpose.
      </Note>
      <Refusal probe={f.transitionBand.refusal} />
      <Tbl
        head={['tube-side flow, lb/hr', 'Reynolds', 'regime', 'film coefficient', 'warning']}
        rows={f.flowRows.map((r) => (r.refusal
          ? [r4(r.mLbHr), e6(r.re), 'refused', 'refused', 'refused']
          : [r4(r.mLbHr), e6(r.re), r.regime, e6(r.hBtuHrFt2F), r.warning ? 'yes' : 'none']))}
      />
      <Note>
        {n0(answered.length)} of those flows answer and {n0(refused.length)} is refused. Below Reynolds
        {' '}{n0(f.transitionBand.low)} the engine uses the laminar constant-wall-temperature limit and says what that
        costs in a warning, which is a different answer again from a refusal.
      </Note>
      <TileGrid>
        <Tile label="Laminar flow" value={r4(f.laminar.mLbHr)} unit="lb/hr" />
        <Tile label="Reynolds there" value={e6(f.laminar.re)} />
        <Tile label="Film coefficient" value={e6(f.laminar.hBtuHrFt2F)} unit="Btu/hr.ft2.F" />
        <Tile label="At double the flow" value={e6(f.laminar.doubledH)} unit="Btu/hr.ft2.F" />
      </TileGrid>
      <p className="text-xs text-slate-300 font-mono mt-1 mb-0">{f.laminar.warning}</p>
      <Note>
        The warning said the film would not move with the flow, and doubling the flow to {r4(f.laminar.doubledFlow)} lb an
        hour takes the Reynolds number to {e6(f.laminar.doubledRe)} and leaves the film coefficient where it was,
        measured as {yn(f.laminar.filmDidNotMoveWithTheFlow)}.
      </Note>
      <Tbl
        head={['wall viscosity given, cp', 'Sieder-Tate applied', 'correction factor', 'film coefficient']}
        rows={f.siederTateRows.map((r) => [
          r.muWallCp === null ? 'none' : e6(r.muWallCp), yn(r.applied),
          r.factor === null ? 'none' : e6(r.factor), e6(r.hBtuHrFt2F),
        ])}
      />
      <Tbl
        head={['flow, lb/hr', 'bore, inches', 'viscosity, cp', 'Reynolds', 'golden Reynolds', 'Prandtl', 'film coefficient', 'golden film coefficient']}
        rows={f.publishedFilm.map((p) => [
          r4(p.mLbHr), e6(p.diIn), e6(p.muCp), e6(p.re), e6(p.goldenRe), e6(p.pr), e6(p.hBtuHrFt2F), e6(p.goldenH),
        ])}
      />
      <Note>
        The engine and the oracle disagree in the last digits of those columns and the disagreement is understood: the
        oracle forms no flow area at all and derives every unit conversion from the SI definitions, while the engine
        types a rounded viscosity conversion. The residual that rounding causes is measured rather than waved at.
      </Note>
      {f.refusals.map((r) => (
        <Refusal key={r.label} probe={r} frame={frames.includes(r.label) ? history.frame : null} />
      ))}
      <Held>
        The validity band of this correlation, in Reynolds and in Prandtl, is not established in this repository. The
        engine reports a band of {String(f.correlationBand.validityBand)} with the two numbers beside it so they can be
        checked against a source the caller trusts, and its own note reads: {f.correlationBand.note} Nothing in this
        course grades a film coefficient, and the Sieder-Tate exponent is held the same way. The wall viscosity of
        {' '}{e6(FILM_WALL_VISCOSITY)} cp above exercises that exponent, and a number it produces is a stated limit
        rather than a validated answer.
      </Held>
    </>
  );
};

export const CoolingMode = ({ c }) => {
  if (!c || !c.cooling) return <Empty>The cooling reader has returned nothing, so there is no refusal to show.</Empty>;
  return (
    <>
      <TileGrid>
        <Tile label="Prandtl on the studio case" value={e6(c.prandtlOnTheStudioCase)} />
        <Tile label="Heating exponent carried" value={e6(c.heatingExponent)} />
        <Tile label="Answer with the tube side heating" value={e6(c.heatingAnswer.hBtuHrFt2F)} unit="Btu/hr.ft2.F" />
        <Tile label="Service reported back" value={c.heatingAnswer.service} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        A cooled tube side is REFUSED. The engine will neither answer it with the heating exponent nor invent a cooling
        one, and its message states the size of the thing it is declining to guess. This is the refusal to read twice:
      </p>
      <Refusal probe={c.cooling} />
      <Refusal probe={c.unknownService} />
      <Note>
        Answering a cooled tube side with the heating exponent would be a confident wrong number, which is the worst
        thing an engine can return, and inventing the cooling exponent here would be worse because it would carry no
        source at all and would then be quoted as though it did. What a caller does instead is type the film
        coefficient: the module takes a stated inside film and the studio offers that box, so a cooled tube side is
        designed with a coefficient the engineer stands behind.
      </Note>
      <Note>
        The studio's own Prandtl number is {e6(c.prandtlOnTheStudioCase)}, which is the neighbourhood the engine's own
        register is talking about, and the engine reports that number on every call so a reader can see which
        neighbourhood they are in.
      </Note>
      <Held>
        {c.registerNote}
      </Held>
      <Note>
        Nothing in this course grades a cooled tube side and nothing in it grades a film coefficient at all, for exactly
        this reason.
      </Note>
    </>
  );
};

export const CorrectionMode = ({ k }) => {
  if (!k || !Array.isArray(k.sweep)) return <Empty>The correction reader has returned nothing, so there is no curve to draw.</Empty>;
  const answered = k.sweep.filter((s) => !s.refusal);
  const chart = answered.map((s) => ({ p: s.p, f: s.f, warned: s.warning ? s.f : null }));
  const firstRefusedP = k.sweep.find((s) => s.refusal);
  return (
    <>
      <TileGrid>
        <Tile label="R held fixed at" value={e6(k.rFixed)} />
        <Tile label="Answers" value={n0(answered.length)} />
        <Tile label="Of those, warned" value={n0(k.warnedCount)} />
        <Tile label="Refused" value={n0(k.refusedCount)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="p" type="number" domain={['auto', 'auto']} tick={AXIS} label={{ value: 'P, the dimensionless temperature group', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} domain={[0, 1]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => e6(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceArea y1={0} y2={0.8} fill="#fbbf24" fillOpacity={0.12} stroke="#fbbf24" label={{ value: 'WARNED below F 0.8', fill: '#fbbf24', fontSize: 10, position: 'insideBottomLeft' }} />
            {firstRefusedP && (
              <ReferenceArea
                x1={firstRefusedP.p}
                x2={firstRefusedP.p + 0.02}
                fill="#dc2626"
                fillOpacity={0.3}
                stroke="#dc2626"
                label={{ value: 'REFUSED', fill: '#fca5a5', fontSize: 10 }}
              />
            )}
            <Line dataKey="f" name="F at one shell pass" stroke={SERIES[0]} dot isAnimationActive={false} />
            <Line dataKey="warned" name="the same F, inside the warning band" stroke={SERIES[3]} strokeWidth={3} dot isAnimationActive={false} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The amber band and the red band are different answers. Inside the amber one the engine ANSWERS and says the curve
        is steep here, so a small error in the terminal temperatures swings the area badly and the remedy is another
        shell. In the red one it REFUSES, because the configuration cannot reach the duty at all, and a refusal is not a
        lower F.
      </Note>
      <Tbl
        head={['P', 'F', 'warning']}
        rows={k.sweep.map((s) => (s.refusal
          ? [e6(s.p), 'refused', 'refused']
          : [e6(s.p), e6(s.f), s.warning ? 'yes' : 'none']))}
      />
      {k.sweep.filter((s) => s.refusal).map((s) => <Refusal key={s.refusal.label} probe={s.refusal} />)}
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The correction factor is COMPUTED from a closed form rather than read off a chart or typed, and the published
        cases say whether the closed form is right.
      </p>
      <Tbl
        head={['case', 'P', 'R', 'F at one shell pass', 'warning', 'golden F']}
        rows={k.cases.map((c) => [
          c.label, e6(c.p), e6(c.r), e6(c.f), c.warning ? 'yes' : 'none',
          c.goldenF === null ? 'none' : e6(c.goldenF),
        ])}
      />
      <Note>
        Every published case agrees with the oracle to the precision printed here, measured as
        {' '}{yn(k.everyPublishedCaseAgrees)}. The oracle reaches F by inverting a marched NTU rather than by evaluating
        the closed form, so that column is a second method.
      </Note>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        And an analytic limit: F tends to one as P tends to zero, at every R. A vanishing cold rise is a vanishing
        departure from counter-current flow, so there is nothing left to correct.
      </p>
      <Tbl
        head={['P'].concat(k.limitSetR.map((r) => `F at R ${e6(r)}`))}
        rows={k.limitTable.map((row) => [e6(row.p)].concat(row.byR.map((x) => e6(x.f))))}
      />
      {k.refusals.map((r) => <Refusal key={r.label} probe={r} />)}
    </>
  );
};

export const BundleMode = ({ b }) => {
  if (!b || !Array.isArray(b.rows)) return <Empty>The bundle reader has returned nothing, so there is no diameter to show.</Empty>;
  return (
    <>
      <TileGrid>
        <Tile label="Layouts carried" value={n0(b.layoutCount)} />
        <Tile label="Pass counts carried" value={n0(b.passCount)} />
        <Tile label="Constant pairs" value={n0(b.pairCount)} />
        <Tile label="Area read across" value={e6(b.areaFt2)} unit="ft2" />
      </TileGrid>
      <Tbl
        head={['layout, degrees', 'passes', 'tubes', 'bundle diameter, inches', 'shell diameter, inches', 'layout note']}
        rows={b.rows.map((r) => [
          n0(r.layoutDeg), n0(r.passes), n0(r.nTubes), e6(r.bundleDiameterIn), e6(r.shellDiameterIn),
          r.layoutNote ? 'yes' : 'none',
        ])}
      />
      <Note>
        Read the last two layout blocks against each other. Every figure is the same, measured as
        {' '}{yn(b.everyPairedRowAgrees)}, and the two constant rows the engine carries for those angles compare equal as
        data, measured as {yn(b.fortyFiveAndNinetyAreIdentical)}. So THE LAYOUT BOX IS DECORATIVE BETWEEN THOSE TWO
        ANGLES: choosing one over the other changes nothing at all, and this panel says so rather than letting the box
        look live. The engine attaches its own note to any answer at either angle.
      </Note>
      <p className="text-xs text-slate-300 font-mono mt-1 mb-0">{b.layoutNote}</p>
      <Note>
        The first angle against the second IS live, which is why the box is decorative between a named pair rather than
        useless in general: bundle {e6(b.firstAgainstSecond.firstBundleIn)} against
        {' '}{e6(b.firstAgainstSecond.secondBundleIn)} inches at the same area and pass count, a ratio of
        {' '}{e6(b.firstAgainstSecond.ratioDerived)}, derived as the second over the first.
      </Note>
      <TileGrid>
        <Tile label="Bundle-to-shell clearance" value={e6(b.clearance.bundleClearanceIn)} unit="inches" />
        <Tile label="Shell with it" value={e6(b.clearance.shellWithClearanceIn)} unit="inches" />
        <Tile label="Shell with none" value={e6(b.clearance.shellWithNoClearanceIn)} unit="inches" />
        <Tile label="Difference" value={e6(b.clearance.differenceDerived)} unit="inches" />
      </TileGrid>
      <Note>
        The shell is the bundle plus a clearance, the clearance is an INPUT because it depends on the head type, and the
        engine adds it once. The difference above is the clearance itself.
      </Note>
      <Tbl
        head={['area, ft2', 'tube OD, inches', 'length, ft', 'layout', 'passes', 'tubes', 'golden tubes', 'bundle diameter', 'golden bundle diameter']}
        rows={b.publishedBundle.map((p) => [
          e6(p.areaFt2), e6(p.doIn), e6(p.tubeLengthFt), n0(p.layoutDeg), n0(p.passes),
          n0(p.nTubes), n0(p.goldenTubes), e6(p.bundleDiameterIn), e6(p.goldenBundleIn),
        ])}
      />
      <Note>
        The oracle reaches the bundle diameter by bisecting on the diameter until the geometry form balances rather than
        by raising a ratio to a reciprocal exponent, which is what makes that column independent: inverting an exponent
        is one of the easiest errors to make in this expression and among the hardest to see in an answer.
      </Note>
      {b.refusals.map((r) => <Refusal key={r.label} probe={r} />)}
      <Held>
        {b.heldNote}
      </Held>
    </>
  );
};

const CoefficientExplorer = ({ initialMode = 'stack' }) => {
  const [mode, setMode] = useState(initialMode);
  const s = useMemo(() => (mode === 'stack' ? safe(resistanceStack) : null), [mode]);
  const history = useMemo(() => (mode === 'stack' ? safe(historyCarryingRefusals) : null), [mode]);
  const w = useMemo(() => (mode === 'wall' ? safe(thinWallLimit) : null), [mode]);
  const f = useMemo(() => (mode === 'film' ? safe(filmThreeRegimes) : null), [mode]);
  const filmHistory = useMemo(() => (mode === 'film' ? safe(historyCarryingRefusals) : null), [mode]);
  const c = useMemo(() => (mode === 'cooling' ? safe(coolingRefused) : null), [mode]);
  const k = useMemo(() => (mode === 'correction' ? safe(correctionAcrossP) : null), [mode]);
  const b = useMemo(() => (mode === 'bundle' ? safe(bundleAndLayout) : null), [mode]);

  return (
    <PanelShell
      title="Coefficient explorer"
      subtitle={`What decides the driving force and what decides the coefficient: five named resistances with the margin that picked the controlling one, the thin-wall limit against the flat plate, the tube-side film across three regimes with the refused band drawn as a refusal, the cooling exponent the module declines, the correction factor across P at a fixed R of ${e6(F_R_FIXED)}, and the bundle whose layout table is equal in two of its three angles.`}
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'stack' && <StackMode s={s} history={history} />}
        {mode === 'wall' && <WallMode w={w} />}
        {mode === 'film' && <FilmMode f={f} history={filmHistory} />}
        {mode === 'cooling' && <CoolingMode c={c} />}
        {mode === 'correction' && <CorrectionMode k={k} />}
        {mode === 'bundle' && <BundleMode b={b} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored heat transfer engine through the teaching lab,
        printed to the precision the lessons use. Resistances are in hr.ft2.F per Btu to nine decimals,
        coefficients in Btu an hour per ft2 per degF, diameters in inches, and the P and R groups and F are plain
        numbers. Every refusal shown is the engine's own message, with whatever evidence the same return carried.
      </Note>
    </PanelShell>
  );
};

export default CoefficientExplorer;
