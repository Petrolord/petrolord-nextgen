import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  wallCode, pigging, correlationLimits, refusalCatalogue, heldItems,
} from './linesizingLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Wall and pig explorer, the Expert tier. THE TWO QUESTIONS NOBODY CAN SIZE
// FROM A PRESSURE DROP: the wall a code demands, and the liquid a pig will push
// in front of it. Then the audit: where the correlations stop being honest, what
// a refusal is, and what this engine will and will not answer.
//
// Every figure on this page is a return value from linesizingLab, which is a
// return value from the vendored engines. Nothing here computes a wall, a
// rating, a volume or an interval, and nothing reads a clock.
//
// EVERY REFUSAL SHOWN HERE IS THE ENGINE'S OWN MESSAGE. Not one of them is
// retyped: a gate in linesizingLab.test.js greps the lab for every message the
// engine produces and fails if any appears as a literal.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no P label
// appears anywhere on this page.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const ten = (v) => (Number.isFinite(v) ? Number(v).toFixed(10) : 'none');

export const MODES = [
  ['wall', 'The wall a code demands: Barlow, the location classes, and the rating read back'],
  ['pig', 'The pig: line volume, the holdup that is an INPUT, and the interval'],
  ['limits', 'Where the correlations stop being honest'],
  ['refusals', 'What a refusal is: the contract, every message, and both sides of every guard'],
  ['held', 'What the method does not know'],
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

const Held = ({ note }) => (
  <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">HELD FOR LITERATURE</p>
    <p className="text-xs text-slate-300 mb-0">{note}</p>
  </div>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const WallMode = ({ w }) => {
  if (!w) return <Note>The wall reader did not return the code.</Note>;
  const chart = w.classRows.map((r) => ({
    cls: `class ${r.locationClass}`, pressure: r.tPressureIn, required: r.tRequiredIn,
  }));
  return (
    <>
      <Tbl
        head={['location class', 'design factor']}
        rows={w.designFactors.map((r) => [String(r.locationClass), six(r.f)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        B31.4 uses a flat design factor of {six(w.b314Factor)} whatever the route, which is the same number B31.8 gives
        to Class 1. For B31.8 the class must be STATED, because assuming Class 1 near a school is exactly the mistake
        the classes exist to prevent.
      </p>
      <Tbl
        head={['code', 'class', 'design factor', 'pressure wall in', 'required wall in', 'MAOP of that wall psig']}
        rows={[
          ...w.classRows.map((r) => ['B31.8', String(r.locationClass), six(r.designFactor), six(r.tPressureIn), six(r.tRequiredIn), six(r.maopPsig)]),
          ['B31.4', 'any', six(w.b314Row.designFactor), six(w.b314Row.tPressureIn), six(w.b314Row.tRequiredIn), six(w.b314Row.maopPsig)],
        ]}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="cls" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="pressure" name="pressure wall, in" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="required" name="required wall, in" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Class 4 asks for {six(w.class4OverClass1Derived)} times the pressure wall of Class 1 on the same pipe at the
        same pressure. The route, not the fluid, is what moved it.
      </p>
      <Tbl
        head={['joint factor', 'pressure wall in', 'temperature derate', 'pressure wall in']}
        rows={w.factorRows.map((r) => [six(r.jointFactor), six(r.jointWallIn), six(r.tempDerate), six(r.derateWallIn)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Both sit in the denominator beside the design factor, so both make the wall thicker, and neither of them is
        strength: they are confidence in the seam and confidence in the steel when it is hot.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Pressure part of the wall at Class 3" value={six(w.class3PressureIn)} unit="in" />
          <Tile label="Required wall at Class 3" value={six(w.class3RequiredIn)} unit={`in, with the ${six(w.corrosionAllowanceIn)} in allowance`} />
          <Tile label="As built" value={six(w.asBuiltIn)} unit="in" />
          <Tile label="Rated with the allowance" value={six(w.maopWithPsig)} unit="psig" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The corrosion allowance is not strength either. It holds no pressure on the day it is installed and it is what
        lets the pipe still hold pressure years later. Read the rating back off the wall the mill actually rolled and
        the allowance decides the answer: {six(w.maopWithPsig)} psig with it respected against {six(w.maopWithoutPsig)}
        {' '}psig with it left out of the call, which is {six(w.maopRatioDerived)} times the rating with the
        {' '}allowance respected. Both calls are legal,
        both are correct for what they were asked, and neither warns. A guard cannot fix a question that was fully
        formed and simply wrong.
      </p>
      <Tbl
        head={['published wall case', 'design factor', 'required wall in', 'golden wall in', 'MAOP back psig', 'golden MAOP psig']}
        rows={w.published.map((c) => [
          `${c.input.code} class ${c.input.locationClass}, ${six(c.input.designPsig)} psig on ${six(c.input.odIn)} in`,
          six(c.designFactor), ten(c.tRequiredIn), ten(c.goldenWallIn), six(c.maopPsig), six(c.goldenMaopPsig),
        ])}
      />
    </>
  );
};

export const PigMode = ({ p }) => {
  if (!p) return <Note>The pigging reader did not return the duty.</Note>;
  const chart = p.holdupRows.map((r) => ({
    holdup: six(r.holdupFrac), swept: r.sweptBbl, interval: r.intervalDays,
  }));
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Line volume" value={four(p.lineVolumeBbl)} unit="bbl" />
          <Tile label="Run time" value={six(p.runHours)} unit={`hours at ${six(p.pigSpeedFtS)} ft/s`} />
          <Tile label="Bore" value={six(p.pig.idIn)} unit="in" />
          <Tile label="Length" value={six(p.pig.lengthFt)} unit="ft" />
        </TileGrid>
      </div>
      <div className="mt-3 rounded-md border border-sky-800/60 bg-sky-950/20 p-3">
        <p className="text-sky-300 text-xs font-medium mb-1">THE HOLDUP IS AN INPUT AND NOT A RESULT</p>
        <p className="text-xs text-slate-300 mb-0">
          The swept volume is the line volume times a holdup somebody else measured or assumed. There is no flow
          regime, no slip and no holdup correlation anywhere in this engine, so a pigging estimate is only as honest as
          that number. This is a seam a reader has to see rather than infer.
        </p>
      </div>
      <Tbl
        head={['holdup', 'swept bbl', 'as a fraction of the line volume', 'days between runs']}
        rows={p.holdupRows.map((r) => [six(r.holdupFrac), four(r.sweptBbl), six(r.fractionOfVolumeDerived), r.error ? r.error : four(r.intervalDays)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="holdup" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="interval" name="days between runs" stroke="#38bdf8" dot connectNulls={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        At a holdup of zero the sweep is {four(p.zeroHoldupSweptBbl)} bbl, and at a holdup of one it
        is {four(p.fullHoldupSweptBbl)} bbl against a line volume of {four(p.lineVolumeBbl)} bbl, which is the whole
        line.
        The interval collapses as the holdup rises, and past a point the catcher cannot take the sweep at all and the
        engine refuses rather than returning a negative interval. The line on the chart stops where that happens.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label={`At the nominal holdup of ${six(p.nominalHoldup)}`} value={four(p.nominalSweptBbl)} unit="bbl swept ahead of the pig" />
          <Tile label="Into a catcher of" value={six(p.catcherBbl)} unit="bbl" />
          <Tile label="Leaving room (derived)" value={four(p.roomDerivedBbl)} unit="bbl" />
          <Tile label={`At ${six(p.dropoutBpd)} bpd of dropout`} value={four(p.nominalIntervalDays)} unit="days between runs" />
        </TileGrid>
      </div>
      <div className="mt-3 rounded-md border border-red-800/60 bg-red-950/20 p-3">
        <p className="text-red-300 text-xs font-medium mb-1">{`The same sweep into a ${six(p.smallCatcherBbl)} bbl catcher`}</p>
        <p className="text-xs text-slate-300 font-mono mb-0">{p.smallCatcherError}</p>
      </div>
      <Tbl
        head={['published pigging case', 'volume bbl', 'golden volume', 'swept bbl', 'golden swept', 'run h', 'golden run']}
        rows={p.published.map((c) => [
          `${six(c.input.idIn)} in over ${six(c.input.lengthFt)} ft at holdup ${six(c.input.holdupFrac)}`,
          four(c.lineVolumeBbl), four(c.goldenVolumeBbl), four(c.sweptBbl), four(c.goldenSweptBbl), six(c.runHours), six(c.goldenRunHours),
        ])}
      />
      <Note>
        That refusal is the handshake with the separation course: the slug a catcher has to hold is what this engine
        computes, and the vessel that holds it is sized elsewhere.
      </Note>
    </>
  );
};

export const LimitsMode = ({ c }) => {
  if (!c) return <Note>The limits reader did not return the audit.</Note>;
  const chart = c.weymouthFriction.map((r) => ({
    bore: six(r.idIn), settled: r.generalFDarcy, matching: r.matchingFDerived,
  }));
  return (
    <>
      <p className="text-xs text-slate-400 mt-1 mb-0">
        The jump at the branch, exactly: the friction factor is {ten(c.fJustBelow)} at Reynolds
        {' '}{Number(c.reJustBelow).toFixed(7)} and {ten(c.fAtBranch)} at Reynolds {four(c.reAtBranch)}, a ratio of
        {' '}{six(c.jumpRatioDerived)}. Nothing physical happens in that interval. The engine leaves the laminar law and
        starts the turbulent one, and the discontinuity is the price of having no correlation for the band between them.
      </p>
      <Held note={c.heldBand.note} />
      <Tbl
        head={['relative roughness', `f at Reynolds ${four(c.reForDomainSweep)}`]}
        rows={c.domainRows.map((r) => [six(r.relRough), ten(r.f)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Colebrook was published to a relative roughness of about 0.05. The engine answers all five rows and flags none
        of them. The last two are extrapolations of a fitted curve into a region where the pipe is more obstruction
        than pipe.
      </p>
      <Tbl
        head={['bore in', 'weymouth scfd', 'general scfd', 'f general settled on', 'f that would make them agree']}
        rows={c.weymouthFriction.map((r) => [six(r.idIn), four(r.weymouthScfd), four(r.generalScfd), ten(r.generalFDarcy), ten(r.matchingFDerived)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="bore" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => ten(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="settled" name="f General Flow settled on" stroke="#38bdf8" dot isAnimationActive={false} />
            <Line dataKey="matching" name="f that would make General match Weymouth" stroke="#f472b6" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The last column falls as the bore grows, which is the signature of a fully rough friction law that depends on
        the diameter and not on the Reynolds number. That is the friction assumption hidden inside the Weymouth
        constant, measured out of the engine rather than sourced.
      </p>
      <Held note={c.heldWeymouth.note} />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Nearly dead, Weymouth" value={four(c.deadWeymouthScfd)} unit="scfd" />
          <Tile label="Nearly dead, General Flow" value={four(c.deadGeneralScfd)} unit={`scfd at f ${ten(c.deadGeneralFDarcy)}`} />
          <Tile label="Ratio when barely flowing" value={six(c.deadRatioDerived)} />
          <Tile label="Ratio at full duty" value={six(c.fullDutyRatioDerived)} />
        </TileGrid>
      </div>
      <Note>
        No form checks its own regime. The forms agree better when the line is working than when it is barely flowing,
        and neither of them says so. Neither iteration in this module reports whether it converged either: the friction
        factor solve and the General Flow solve both return their last iterate with no flag beside it. They do converge
        everywhere this course looked, which is exactly what makes the absence easy to miss.
      </Note>
    </>
  );
};

export const RefusalsMode = ({ r }) => {
  if (!r) return <Note>The refusal reader did not return the catalogue.</Note>;
  return (
    <>
      <p className="text-xs text-slate-400 mt-1 mb-0">
        A refusal in this engine is an object carrying an error string. It is never a thrown exception, never a null
        and never a bare number, and the shape is the contract: a caller checks a property rather than inspecting a
        value. That is exactly why a NaN or an Infinity returned WITHOUT an error is worse than no guard at all. It
        passes the check and then propagates into a sizing sweep, a marched profile or a wall specification.
      </p>
      <Tbl
        head={['the three returns that sit outside the contract on purpose', 'what comes back']}
        rows={[
          ['the Reynolds number of a line with no viscosity', r.reynoldsNoViscosity],
          ['the volume of a line with no bore', r.volumeNoBore],
          ['the friction factor at a negative relative roughness', JSON.stringify(r.frictionNegativeRoughnessShape)],
        ]}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The first two are bare numbers with nowhere to put a message, so they answer NaN by documented contract and the
        functions that wrap them refuse in words. The third carries its refusal in the regime it already returns. Note
        that a NaN has no JSON spelling and serialises as null: the engine returns NaN, and null is what printing it
        does.
      </p>
      <Tbl
        head={['an input with no physical meaning', 'the engine\'s own message']}
        rows={r.refusals.map((x) => [x.label, x.error])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Every one of those messages is the engine's own, read back from the call rather than retyped here. Each guard
        also has a boundary, and the boundary is where the teaching is: a resistance sum of zero is a line with no
        fittings and is perfectly legal, an efficiency of exactly one is the ideal the forms are written for, a holdup
        of one is a line running full, and a line exactly as tall as it is long is vertical.
      </p>
      <Tbl
        head={['guard', 'value', 'the engine']}
        rows={r.boundaries.map((b) => [b.label, six(b.value), b.refuses ? 'refuses' : 'answers'])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A guard that refuses its own limit is as wrong as one that accepts nonsense, which is why both sides are read
        rather than one.
      </p>
      <Tbl
        head={['the same question asked of the catalogues', 'what comes back']}
        rows={[
          ['a fitting the table does not carry', r.catalogueAnswers.fittingK],
          ['a roughness the table does not carry', r.catalogueAnswers.roughnessOf],
          ['a grade the table does not carry', r.catalogueAnswers.gradeYield],
          ['a pipe size the table does not carry', JSON.stringify(r.catalogueAnswers.scheduleRow)],
          ['an erosional service the table does not carry', JSON.stringify(r.catalogueAnswers.erosionalC)],
        ]}
      />
      <Note>
        Four of the five say they do not know. The fifth answers under a label that is not the one it was asked for,
        and it is the one that was NOT repaired: that table belongs to the wellhead engine two other studios read, so
        changing what an unknown service returns is a decision for that table rather than for this chain.
      </Note>
    </>
  );
};

export const HeldMode = ({ h }) => {
  if (!h) return <Note>The held reader did not return the items.</Note>;
  return (
    <>
      <p className="text-xs text-slate-400 mt-1 mb-0">
        Five things this course teaches as limits and never as answers. Not one of them is read by a graded value:
        every c factor, efficiency, roughness, resistance sum, location class and holdup in the assessment is a STATED
        condition of its tier.
      </p>
      {h.items.map((x) => (
        <div key={x.id} className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
          <p className="text-amber-300 text-xs font-medium mb-1">{x.title}</p>
          <p className="text-xs text-slate-300 mb-0">{x.note}</p>
        </div>
      ))}
      <div className="mt-3">
        <TileGrid>
          <Tile label="c continuous" value={six(h.cContinuous)} />
          <Tile label="c intermittent" value={six(h.cIntermittent)} />
          <Tile label="c clean, inhibited" value={six(h.cCleanInhibited)} />
          <Tile label="The step across the branch" value={six(h.jumpRatioDerived)} unit="times" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        And one thing that is not held but simply absent: THE MULTIPHASE HALF IS NOT IN THIS ENGINE. There is no flow
        regime, no slip, no holdup correlation and no slug model anywhere in it. Wherever a holdup is needed the engine
        takes it as an input.
      </p>
      <Tbl
        head={['one barrel for the package, measured out of each module', 'cubic feet per barrel']}
        rows={[
          ['from the line-hydraulics module, as the flow area times the length over the line volume', Number(h.bblFromLineHydraulicsDerived).toFixed(13)],
          ['from the choke module, as the erosional velocity times the area times the seconds in a day over the erosional rate', Number(h.bblFromChokePerformanceDerived).toFixed(13)],
          ['the ratio of the two', Number(h.bblRatioDerived).toFixed(13)],
        ]}
      />
      <Note>
        Those were two different numbers one import apart, inside the single chain this studio composes, until the
        package gave them one definition. The one it kept is exact by definition rather than by measurement, and both
        modules' own oracles already worked from it, so the goldens said which half of the disagreement was right
        before anyone asked them.
      </Note>
    </>
  );
};

const WallPigExplorer = ({ initialMode = 'wall' }) => {
  const [mode, setMode] = useState(initialMode);
  const w = useMemo(() => (mode === 'wall' ? safe(wallCode) : null), [mode]);
  const p = useMemo(() => (mode === 'pig' ? safe(pigging) : null), [mode]);
  const c = useMemo(() => (mode === 'limits' ? safe(correlationLimits) : null), [mode]);
  const r = useMemo(() => (mode === 'refusals' ? safe(refusalCatalogue) : null), [mode]);
  const h = useMemo(() => (mode === 'held' ? safe(heldItems) : null), [mode]);

  return (
    <PanelShell
      title="Wall, pig and refusal explorer"
      subtitle="The two questions no pressure drop answers, and then the audit: the wall a code demands, the liquid a pig pushes ahead of it, where the correlations stop being honest, and what this engine will and will not answer."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'wall' && <WallMode w={w} />}
        {mode === 'pig' && <PigMode p={p} />}
        {mode === 'limits' && <LimitsMode c={c} />}
        {mode === 'refusals' && <RefusalsMode r={r} />}
        {mode === 'held' && <HeldMode h={h} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored engines, printed to the precision the teaching
        digest prints. Walls and bores are in inches, lengths in feet, volumes in barrels, and every refusal shown is
        the engine's own message rather than a description of one.
      </Note>
    </PanelShell>
  );
};

export default WallPigExplorer;
