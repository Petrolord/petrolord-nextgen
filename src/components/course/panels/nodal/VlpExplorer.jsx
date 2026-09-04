import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ReferenceDot,
} from 'recharts';
import {
  TEACHING_WELLS, FORCADOS_3, CS_STEP_LIST, PUBLISHED_CS_STEPS,
  wellDecomposition, wellTubingCurve, wellOutflowReadings, wellLimbCrossover,
  wellMinimumSensitivity, wellColumnStepStudy, wellColumnVsAverageTz, wellFrictionGroup,
  teachingColumnTruncationTable,
} from './nodalLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// VLP explorer, the Professional tier. What the tubing will take: the J taken
// apart into the two terms that make it, the bottom of the J and what moves it,
// the one column the engine builds for itself by Cullender and Smith with its
// step count and its truncation, and a second opinion on the same column
// reached by a different road.
//
// Every figure on this page is a return value from nodalLab, which is a return
// value from the vendored nodal engine. Nothing here computes a pressure.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const pct = (v, d = 2) => (Number.isFinite(v) ? `${fmt(v * 100, d)} %` : '-');

// A gap smaller than a hundredth of a psi still has to be readable, because
// rounding it to 0.00 would claim an exactness it does not have.
const tiny = (v) => {
  if (!Number.isFinite(v)) return '-';
  if (v === 0) return '0';
  return Math.abs(v) < 0.005 ? v.toExponential(3) : fmt(v, 6);
};

const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['shape', 'The J, taken apart'],
  ['minimum', 'The bottom of the J, and what moves it'],
  ['gascolumn', 'The gas column, and what two stations cost'],
  ['secondopinion', 'The same column by a different road'],
];

const LEVERS = [
  ['wellheadPressure', 'Wellhead pressure, psia'],
  ['lighteningConstant', 'The lightening constant qRef, stb/d'],
  ['frictionConstant', 'The friction constant kFric, psi per (stb/d)^2'],
];

const LEVER_KEY = {
  wellheadPressure: 'pWhPsia',
  lighteningConstant: 'qRefStbd',
  frictionConstant: 'kFricPsiPerStbd2',
};

const WELLS = TEACHING_WELLS.map((W) => [W.label, `${W.label}: ${W.note}`]);

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const wellOf = (label) => TEACHING_WELLS.find((W) => W.label === label) || FORCADOS_3;

const Shape = ({ W }) => {
  const rows = useMemo(() => {
    try { return wellDecomposition(W); } catch { return null; }
  }, [W]);
  const readings = useMemo(() => {
    try { return wellOutflowReadings(W); } catch { return null; }
  }, [W]);
  const crossover = useMemo(() => {
    try { return wellLimbCrossover(W); } catch { return null; }
  }, [W]);
  const sampled = useMemo(() => {
    try { return wellTubingCurve(W); } catch { return null; }
  }, [W]);
  if (!rows || !rows.length || !readings || !crossover || !sampled || !sampled.minimum) {
    return <Note>An outflow curve needs an upper rate bound to be sampled across, and that bound is the inflow's own open flow. A well whose inflow returns no curve has no rate range for the tubing to be asked about, so the engine returns an empty curve and no minimum rather than a curve starting at zero rate, where the column would be infinite.</Note>;
  }
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Wellhead pressure" value={fmt(readings.wellheadPsia, 0)} unit="psia" />
          <Tile label="The dead column, wellhead plus full gravity"
            value={fmt(readings.deadColumnPsia, 0)} unit="psia" />
          <Tile label="Dead column above the reservoir pressure"
            value={fmt(readings.deadColumnAbovePrPsi, 0)} unit="psi" />
          <Tile label="Column outweighs the reservoir at low rate"
            value={yn(readings.columnOutweighsReservoirAtLowRate)} />
          <Tile label="Bottom of the J, rate" value={fmt(readings.trueMinimumQStbd, 4)} unit="stb/d" />
          <Tile label="Bottom of the J, pressure" value={fmt(readings.trueMinimumBhpPsia, 4)} unit="psia" />
          <Tile label="Rate where friction overtakes gravity"
            value={fmt(crossover.qStbd, 4)} unit="stb/d" />
          <Tile label="Pressure the tubing wants there" value={fmt(crossover.bhpPsia, 4)} unit="psia" />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="qStbd" type="number" tick={AXIS}
              label={{ value: 'rate, stb/d', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'pressure the tubing demands, psia', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceDot x={readings.trueMinimumQStbd} y={readings.trueMinimumBhpPsia} r={5}
              fill="#f472b6" stroke="none" />
            <ReferenceLine x={readings.trueMinimumQStbd} stroke="#f472b6" strokeDasharray="5 3"
              label={{ value: 'the bottom of the J', fill: '#f472b6', fontSize: 10, position: 'top' }} />
            <Line type="monotone" dataKey="bhpPsia" name="the outflow curve, the sum of the two"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="qStbd" type="number" tick={AXIS}
              label={{ value: 'rate, stb/d', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'the two terms, psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={crossover.qStbd} stroke="#94a3b8" strokeDasharray="5 3"
              label={{ value: 'the terms cross here', fill: '#94a3b8', fontSize: 10, position: 'top' }} />
            <Line type="monotone" dataKey="gravityPsi" name="gravity: the weight of the column, falling"
              stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="frictionPsi" name="friction: the price of the pipe, rising"
              stroke="#f97316" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">rate, stb/d</th>
              <th className="text-left pr-3">wellhead, psia</th>
              <th className="text-left pr-3">gravity term, psi</th>
              <th className="text-left pr-3">friction term, psi</th>
              <th className="text-left pr-3">outflow, psia</th>
              <th className="text-left pr-3">gravity's share</th>
              <th className="text-left">friction is winning</th>
            </tr>
          </thead>
          <tbody>
            {rows.filter((r, i) => i % 4 === 0 || i === rows.length - 1).map((r) => (
              <tr key={r.qStbd} className={r.frictionExceedsGravity ? 'text-[#f97316]' : ''}>
                <td className="pr-3">{fmt(r.qStbd, 3)}</td>
                <td className="pr-3 text-slate-400">{fmt(r.wellheadPsia, 0)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.gravityPsi, 3)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.frictionPsi, 3)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.bhpPsia, 3)}</td>
                <td className="pr-3">{pct(r.gravityShare, 2)}</td>
                <td>{yn(r.frictionExceedsGravity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The lower chart is the whole of the upper one. A wellhead pressure of
        {' '}{fmt(readings.wellheadPsia, 0)} psia sits under both terms as a constant, the blue term
        is the weight of the column and it FALLS as rate rises because gas breaks out and lightens
        what has to be lifted, and the orange term is what the pipe charges and it GROWS as the
        square of rate. Their sum has to fall first and rise later, which is a J, and the bottom of
        it sits at {fmt(readings.trueMinimumQStbd, 4)} stb/d asking for
        {' '}{fmt(readings.trueMinimumBhpPsia, 4)} psia.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        The two vertical markers are not the same rate and the gap between them is the point. The
        terms cross at {fmt(crossover.qStbd, 4)} stb/d, which is where friction first exceeds
        gravity in SIZE. The curve bottoms out at {fmt(readings.trueMinimumQStbd, 4)} stb/d, which
        is where the two terms balance in SLOPE. A curve turns when the rates of change cancel, not
        when the quantities do, so the minimum always arrives first.
      </div>
      <Note>
        The engine samples this curve at {fmt(readings.nPoints, 0)} points and reports the lowest
        sampled row as the minimum, which lands at {fmt(readings.sampledMinimumQStbd, 4)} stb/d and
        {' '}{fmt(readings.sampledMinimumBhpPsia, 4)} psia,
        {' '}{fmt(readings.sampledMinusTrueQStbd, 4)} stb/d and
        {' '}{tiny(readings.sampledMinusTrueBhpPsi)} psi away from the finely resolved answer. A
        minimum found by a reduction over samples is a property of the sampling as much as of the
        curve, which is why the engine gates it as its own value and why both readings are printed
        here instead of one.
      </Note>
    </>
  );
};

const Minimum = ({ W }) => {
  const [lever, setLever] = useState('wellheadPressure');
  const sens = useMemo(() => {
    try { return wellMinimumSensitivity(W); } catch { return null; }
  }, [W]);
  const readings = useMemo(() => {
    try { return wellOutflowReadings(W); } catch { return null; }
  }, [W]);
  if (!sens || !readings || !sens[lever] || !sens[lever].length) {
    return <Note>There is no minimum to move. The bottom of the J is a reduction over a sampled outflow curve, so a well whose inflow gives no rate range has no curve to sample and no minimum to be sensitive about.</Note>;
  }
  const rows = sens[lever];
  const key = LEVER_KEY[lever];
  const rateMoves = new Set(rows.map((r) => r.minQStbd)).size;
  const pressureMoves = new Set(rows.map((r) => r.minBhpPsia)).size;
  return (
    <>
      <FieldGrid>
        <SelectField label="Lever" value={lever} onChange={setLever} options={LEVERS} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Bottom of the J, rate" value={fmt(sens.baseMinQStbd, 4)} unit="stb/d" />
          <Tile label="Bottom of the J, pressure" value={fmt(sens.baseMinBhpPsia, 4)} unit="psia" />
          <Tile label="Distinct RATES this lever produces" value={fmt(rateMoves, 0)} />
          <Tile label="Distinct PRESSURES this lever produces" value={fmt(pressureMoves, 0)} />
          <Tile label="Loaded end of the curve, rate" value={fmt(readings.loadedEndQStbd, 4)} unit="stb/d" />
          <Tile label="Loaded end of the curve, pressure" value={fmt(readings.loadedEndBhpPsia, 4)} unit="psia" />
          <Tile label="Friction end of the curve, rate" value={fmt(readings.frictionEndQStbd, 4)} unit="stb/d" />
          <Tile label="Friction end of the curve, pressure" value={fmt(readings.frictionEndBhpPsia, 4)} unit="psia" />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 30, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey={key} type="number" tick={AXIS}
              label={{ value: LEVERS.find((l) => l[0] === lever)[1], position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="q" tick={AXIS}
              label={{ value: 'rate at the bottom, stb/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="p" orientation="right" tick={AXIS}
              label={{ value: 'pressure at the bottom, psia', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="q" type="monotone" dataKey="minQStbd" name="rate at the bottom of the J"
              stroke="#BFFF00" dot isAnimationActive={false} />
            <Line yAxisId="p" type="monotone" dataKey="minBhpPsia" name="pressure at the bottom of the J"
              stroke="#f472b6" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">{LEVERS.find((l) => l[0] === lever)[1]}</th>
              <th className="text-left pr-3">rate at the bottom, stb/d</th>
              <th className="text-left pr-3">pressure at the bottom, psia</th>
              <th className="text-left pr-3">move in the rate, stb/d</th>
              <th className="text-left">move in the pressure, psi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[key]} className={r.dMinQStbd === 0 && r.dMinBhpPsi === 0 ? 'text-white' : ''}>
                <td className="pr-3">{fmt(r[key], 8)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.minQStbd, 4)}</td>
                <td className="pr-3 text-[#f472b6]">{fmt(r.minBhpPsia, 4)}</td>
                <td className="pr-3">{tiny(r.dMinQStbd)}</td>
                <td>{tiny(r.dMinBhpPsi)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        READ THE RATE COLUMN, NOT ONLY THE PRESSURE ONE. On this lever the sweep produces
        {' '}{fmt(rateMoves, 0)} distinct rate{rateMoves === 1 ? '' : 's'} at the bottom of the J and
        {' '}{fmt(pressureMoves, 0)} distinct pressure{pressureMoves === 1 ? '' : 's'}. Wellhead
        pressure is the lever that moves one and not the other: it shifts the whole curve vertically
        and drops out of the derivative, so the pressure at the bottom follows it one for one while
        the rate at the bottom does not move at all. Choking a well back does not change the rate at
        which it loads up. It changes how much pressure the reservoir has to find to hold it there.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        The other two levers move both columns, and only one of them moves them predictably. More
        friction always pulls the bottom of the J in to a lower rate and lifts it, so the friction
        constant is monotone in both columns. The lightening constant is NOT: a column that
        lightens very fast and a column that barely lightens at all both load up at a low rate, for
        opposite reasons, so the rate column climbs to an interior maximum and falls away again
        while the pressure column keeps climbing throughout. Read the rate column alone on that
        lever and two completely different columns look identical.
      </div>
      <Note>
        This is why the bottom of the J is an operating fact and not a curiosity. Everything to the
        left of it is a well that gets worse as it slows down, which is a well that stops. What this
        panel refuses to tell you is which side the well is actually sitting on, because that
        depends on the inflow and nothing on this page has drawn one.
      </Note>
    </>
  );
};

const GasColumn = ({ W }) => {
  const table = useMemo(() => {
    try { return teachingColumnTruncationTable(); } catch { return null; }
  }, []);
  const own = useMemo(() => {
    try { return wellColumnStepStudy(W); } catch { return null; }
  }, [W]);
  const ownFriction = useMemo(() => {
    try { return wellFrictionGroup(W); } catch { return null; }
  }, [W]);
  const frictionGroup = useMemo(() => {
    try { return wellFrictionGroup(FORCADOS_3); } catch { return null; }
  }, []);
  if (!table || !table.length || !own || !own.length || !frictionGroup) {
    return <Note>A Cullender and Smith column needs a wellhead pressure, a gas gravity, a measured and a vertical depth and two temperatures. With any of them missing the march has no integrand to accumulate and the engine returns no column rather than a gradient guessed from depth.</Note>;
  }
  const two = table[0];
  const ownTwo = own[0];
  return (
    <>
      <div className="rounded-md border border-amber-700 bg-amber-900/20 p-4">
        <p className="text-xs text-gray-400 mb-1">
          What the published two station method costs, on a GRAVITY ONLY column and on a FRICTION
          LOADED one, side by side
        </p>
        <p className="text-2xl font-bold text-white mb-1">
          <span className="text-[#38bdf8]">{tiny(two.gravityOnlyErrorPsi)}</span>
          <span className="text-gray-400"> psi against </span>
          <span className="text-[#f97316]">{tiny(two.frictionLoadedErrorPsi)}</span>
          <span className="text-gray-400 text-sm"> psi</span>
        </p>
        <p className="text-sm mb-0 text-amber-200">
          Same method, same step count, same kind of string. {two.gravityLabel} carries a static
          injection gradient and loses {tiny(two.gravityOnlyErrorPsi)} psi to the truncation.
          {' '}{two.frictionLabel} carries {fmt(frictionGroup.qMmscfd, 3)} MMscf/d up a
          {' '}{fmt(frictionGroup.idIn, 4)} in string and loses
          {' '}{tiny(two.frictionLoadedErrorPsi)} psi, which is {fmt(two.errorRatio, 2)} times as
          much. These two numbers are not the same number at different sizes. They are different in
          kind, and the only thing between them is the friction group.
        </p>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="The engine's own default step count" value={fmt(PUBLISHED_CS_STEPS, 0)} />
          <Tile label="Gravity only column, two stations" value={fmt(two.gravityOnlyPwfPsia, 6)} unit="psia" />
          <Tile label="Gravity only column, converged" value={fmt(two.gravityOnlyConvergedPwfPsia, 6)} unit="psia" />
          <Tile label="Gravity only two station gap" value={tiny(two.gravityOnlyErrorPsi)} unit="psi" />
          <Tile label="Friction loaded column, two stations" value={fmt(two.frictionLoadedPwfPsia, 6)} unit="psia" />
          <Tile label="Friction loaded column, converged" value={fmt(two.frictionLoadedConvergedPwfPsia, 6)} unit="psia" />
          <Tile label="Friction loaded two station gap" value={tiny(two.frictionLoadedErrorPsi)} unit="psi" />
          <Tile label="One gap over the other" value={fmt(two.errorRatio, 2)} unit="times" />
        </TileGrid>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">sub-intervals</th>
              <th className="text-left pr-3">{two.gravityLabel}, gravity only, psia</th>
              <th className="text-left pr-3">its gap to the converged march, psi</th>
              <th className="text-left pr-3">{two.frictionLabel}, friction loaded, psia</th>
              <th className="text-left pr-3">its gap to the converged march, psi</th>
              <th className="text-left">one gap over the other</th>
            </tr>
          </thead>
          <tbody>
            {table.map((r) => (
              <tr key={r.steps}
                className={r.steps === PUBLISHED_CS_STEPS ? 'text-white font-semibold bg-amber-900/20' : ''}>
                <td className="pr-3">{fmt(r.steps, 0)}{r.steps === PUBLISHED_CS_STEPS ? ' (the default)' : ''}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.gravityOnlyPwfPsia, 6)}</td>
                <td className="pr-3">{tiny(r.gravityOnlyErrorPsi)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.frictionLoadedPwfPsia, 6)}</td>
                <td className="pr-3">{tiny(r.frictionLoadedErrorPsi)}</td>
                <td>{Number.isFinite(r.errorRatio) ? fmt(r.errorRatio, 2) : 'both gaps are nought'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={table} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="steps" type="number" scale="log" domain={[2, 256]} tick={AXIS}
              ticks={CS_STEP_LIST}
              label={{ value: 'sub-intervals the column is marched in', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'gap to the converged march, psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => tiny(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#94a3b8" />
            <Line type="monotone" dataKey="gravityOnlyErrorPsi" name={`${two.gravityLabel}, gravity only`}
              stroke="#38bdf8" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="frictionLoadedErrorPsi" name={`${two.frictionLabel}, friction loaded`}
              stroke="#f97316" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Both curves approach nought from BELOW, which is the direction the engine's own header
        states: two stations run LOW and the gap falls roughly with the square of the step count.
        The published method is one midpoint station, two trapezoid halves and one Simpson pass, and
        it rests on the integrand being close to linear over the whole column. That holds while the
        column is a weight of gas and stops holding once the friction group is comparable to the
        gravity term. On {two.frictionLabel} the Reynolds number is
        {' '}{fmt(frictionGroup.reynolds, 0)}, the Moody friction factor is
        {' '}{fmt(frictionGroup.fMoody, 6)} and the friction group comes to
        {' '}{fmt(frictionGroup.f2, 8)}. On {two.gravityLabel} it is nought, because nothing is
        moving.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        The column on {W.label} marched at the {fmt(ownTwo.actualSteps, 0)} station
        default reads {fmt(ownTwo.pwfPsia, 6)} psia against a converged
        {' '}{fmt(ownTwo.convergedPwfPsia, 6)} psia, a gap of {tiny(ownTwo.errorVsConvergedPsi)} psi,
        and its friction group is
        {' '}{ownFriction ? fmt(ownFriction.f2, 8) : 'nought, because the column is static'}.
      </div>
      <Note>
        The default of two is not a bug and it is not sloppiness. It IS the published Cullender and
        Smith method, and on a static gradient it is accurate to a fraction of a psi, which is far
        inside anything a gas gravity or a temperature profile is known to. What it will not do is
        tell you when it has stopped being enough, because the truncation is silent: the answer
        comes back with the same shape and the same units whether it is right to a hundredth of a
        psi or wrong by several. The check is the step count, and it costs one more call.
      </Note>
    </>
  );
};

const SecondOpinion = ({ W }) => {
  const own = useMemo(() => {
    try { return wellColumnVsAverageTz(W); } catch { return null; }
  }, [W]);
  const all = useMemo(() => {
    try { return TEACHING_WELLS.map((x) => wellColumnVsAverageTz(x)); } catch { return null; }
  }, []);
  if (!own || !all || !all.length) {
    return <Note>A second opinion needs the same column to be reachable by both roads. Average temperature and z asks for a single average compressibility over the whole column, and on a column the engine cannot march there is nothing to average and no comparison to draw.</Note>;
  }
  const bars = [
    { name: 'Cullender and Smith, converged', v: own.convergedPwfPsia },
    { name: `Cullender and Smith, ${fmt(own.stepsUsed, 0)} steps`, v: own.pwfPsia },
    { name: 'average temperature and z', v: own.averageTzPwfPsia },
  ];
  return (
    <>
      <div className="rounded-md border border-sky-700 bg-sky-900/20 p-4">
        <p className="text-xs text-gray-400 mb-1">
          The same column on {W.label}, by a marched integral and by one average z
        </p>
        <p className="text-2xl font-bold text-white mb-1">
          {fmt(own.convergedPwfPsia, 6)}
          <span className="text-[#BFFF00]"> against </span>
          {fmt(own.averageTzPwfPsia, 6)} <span className="text-gray-400 text-sm">psia</span>
        </p>
        <p className="text-sm mb-0 text-sky-200">
          A gap of {fmt(own.convergedMinusAverageTzPsi, 6)} psi. That is a METHOD gap and not an
          arithmetic one. Both answers are converged, neither has any truncation left in it, and
          neither is a worse implementation of the other. They disagree because one of them holds
          the compressibility at a single average of {fmt(own.averageTzZbar, 6)} over the whole
          column and the other lets it vary all the way down. Refining either one does not close the
          gap, and no step count will.
        </p>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Steps the column is marched in" value={fmt(own.stepsUsed, 0)} />
          <Tile label="Cullender and Smith at that count" value={fmt(own.pwfPsia, 6)} unit="psia" />
          <Tile label="Its midpoint station" value={fmt(own.pmfPsia, 6)} unit="psia" />
          <Tile label="Cullender and Smith, converged" value={fmt(own.convergedPwfPsia, 6)} unit="psia" />
          <Tile label="Truncation still in it" value={tiny(own.truncationAtStepsUsedPsi)} unit="psi" />
          <Tile label="Average temperature and z" value={fmt(own.averageTzPwfPsia, 6)} unit="psia" />
          <Tile label="The one average z it uses" value={fmt(own.averageTzZbar, 6)} />
          <Tile label="z at the wellhead conditions" value={fmt(own.zAtWellheadConditions, 6)} />
          <Tile label="The METHOD gap" value={fmt(own.convergedMinusAverageTzPsi, 6)} unit="psi" />
          <Tile label="Average gradient over the column" value={fmt(own.gradientPsiPerFt, 8)} unit="psi/ft" />
          <Tile label="The defining integral came to" value={fmt(own.definingIntegral.integral, 3)} />
          <Tile label="It was supposed to come to" value={fmt(own.definingIntegral.target, 3)} />
        </TileGrid>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={bars} margin={{ top: 10, right: 16, bottom: 24, left: 20 }}>
            {GRID}
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} interval={0} />
            <YAxis domain={['auto', 'auto']} tick={AXIS} tickFormatter={(v) => fmt(v, 2)}
              label={{ value: 'bottomhole pressure, psia', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <ReferenceLine y={own.convergedPwfPsia} stroke="#BFFF00" strokeDasharray="5 3"
              label={{ value: 'the marched integral', fill: '#BFFF00', fontSize: 10, position: 'insideBottomRight' }} />
            <Line type="linear" dataKey="v" name="psia" stroke="#f472b6" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">teaching well</th>
              <th className="text-left pr-3">Cullender and Smith, converged, psia</th>
              <th className="text-left pr-3">average temperature and z, psia</th>
              <th className="text-left pr-3">the method gap, psi</th>
              <th className="text-left pr-3">the one average z</th>
              <th className="text-left">defining integral closure</th>
            </tr>
          </thead>
          <tbody>
            {all.map((r) => (
              <tr key={r.label} className={r.label === W.label ? 'text-white' : ''}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.convergedPwfPsia, 6)}</td>
                <td className="pr-3 text-[#f472b6]">{fmt(r.averageTzPwfPsia, 6)}</td>
                <td className="pr-3">{fmt(r.convergedMinusAverageTzPsi, 6)}</td>
                <td className="pr-3">{fmt(r.averageTzZbar, 6)}</td>
                <td>{fmt(r.definingIntegral.closureError, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Read the method gap column against the well descriptions. On a static column the two roads
        land within a psi of each other, and the closed form is a perfectly good answer for a lift
        gas design. On a column with gas moving up it they part company by an order more, because a
        single average z is being asked to stand for a compressibility that swings across the whole
        pressure range of a flowing well. The gap is not noise, it is the price of the assumption,
        and it is signed: the closed form does not scatter around the marched answer, it sits on one
        side of it.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        The last column is why the marched answer is the one to trust when they disagree. Cullender
        and Smith is not a formula, it is the statement that the integral of the integrand between
        the two pressures equals 18.75 times the gas gravity times the measured depth. Marching that
        equation independently and reporting what the integral actually came to against what it was
        supposed to come to is a CLOSURE test, and it uses the engine's own integrand and z factor
        and nothing else. A method that closes on its own defining equation and a method that
        assumes an average are not two opinions of equal weight.
      </div>
      <Note>
        Neither road knows anything about liquid. Both of these are DRY GAS columns, and the engine
        says so: it will march a gas gradient for you and it will refuse a black oil traverse,
        because a traverse belongs to whoever owns the PVT stack. That is why the outflow on the
        other views of this panel is injected as a function rather than computed here. An engine
        that quietly supplied a liquid column would be inventing the hardest part of the problem.
      </Note>
    </>
  );
};

const VlpExplorer = () => {
  const [mode, setMode] = useState('shape');
  const [wellLabel, setWellLabel] = useState(FORCADOS_3.label);
  const W = wellOf(wellLabel);
  return (
    <PanelShell
      title="Outflow explorer"
      subtitle="The J taken apart into the two terms that make it, the bottom of the J and the levers that move it, the gas column the engine builds for itself and what the published two station method costs on it"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <SelectField label="Teaching well" value={wellLabel} onChange={setWellLabel} options={WELLS} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'shape' && <Shape W={W} />}
        {mode === 'minimum' && <Minimum W={W} />}
        {mode === 'gascolumn' && <GasColumn W={W} />}
        {mode === 'secondopinion' && <SecondOpinion W={W} />}
      </div>
    </PanelShell>
  );
};

export default VlpExplorer;
