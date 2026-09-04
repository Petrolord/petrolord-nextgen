import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, ComposedChart, Line, Scatter, ScatterChart,
  XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import { cardExplorer, ODUMA } from './rodPumpLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Card explorer, the Professional tier. The design IS the card, so this panel is
// the card: what the march computes and what it then throws away, the static
// stretch against the wave answer and the overtravel between them, the two
// polished rod loads and what moves them, the power the loop costs, and what the
// well actually makes.
//
// Five modes, and every one of them marches the damped wave equation at least
// once, so a mode takes a moment to open. Only the selected mode computes.
//
// Every figure on this page is a return value from rodPumpLab, which is a return
// value from the vendored rod pump engines. Nothing here marches a wave,
// integrates a card or applies a fillage.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const tiny = (v) => {
  if (!Number.isFinite(v)) return '-';
  if (v === 0) return '0';
  return Math.abs(v) < 0.0005 ? v.toExponential(3) : fmt(v, 9);
};

const MODES = [
  { value: 'march', label: 'What the march computes, and what it keeps' },
  { value: 'stretch', label: 'The spring rule against the wave equation' },
  { value: 'loads', label: 'The two loads, and what moves them' },
  { value: 'power', label: 'Power, and what power does not include' },
  { value: 'fillage', label: 'Fillage, the cliff and the effective factor' },
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const useSafe = (fn, deps = []) => useMemo(() => {
  try { return fn(); } catch { return null; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, deps);

const March = () => {
  const d = useSafe(() => cardExplorer.march());
  if (!d || !d.surfaceCard.length) {
    return <Note>A card needs a string, a surface motion, a speed, a fluid load and a damping ratio. With no damping the string never settles into a repeating stroke, and the engine refuses the march rather than returning a confident answer from one that never converged.</Note>;
  }
  const t = d.teaching;
  const s = d.sampling;
  return (
    <>
      <TileGrid>
        <Tile label="Marched steps in a cycle" value={fmt(s.samples, 0)} />
        <Tile label="Card points kept" value={fmt(s.cardPoints, 0)} />
        <Tile label="Decimation stride" value={fmt(s.stride, 0)} />
        <Tile label="Of the marched steps, kept" value={fmt(s.keptPct, 6)} unit="%" />
        <Tile label="Envelope nodes" value={fmt(s.envelopeNodes, 0)} />
        <Tile label="Node spacing" value={fmt(s.nodeSpacingFt, 9)} unit="ft" />
        <Tile label="Shallowest envelope sample" value={fmt(s.shallowestNodeFt, 9)} unit="ft" />
        <Tile label="Time step" value={t.dtS.toExponential(6)} unit="s" />
      </TileGrid>
      <div className="mt-3 text-xs text-slate-300">
        TWO SAMPLINGS OF ONE MARCH, IN ONE RETURN OBJECT. The march advances displacement on a
        collocated grid with an explicit central difference at a step short enough to keep the wave
        inside one cell, and it repeats whole cycles until the stroke stops changing:
        {' '}{ODUMA.label} settles after {fmt(t.cycles, 0)} and reports converged
        {' '}{String(t.converged)}. The tension envelope is accumulated over ALL
        {' '}{fmt(s.samples, 0)} of those steps at all {fmt(s.envelopeNodes, 0)} interior nodes. The
        surface card is DECIMATED to {fmt(s.cardPoints, 0)} points, and both polished rod loads are
        read off that subsample. Only one of the two is the card.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">case</th>
              <th className="text-left pr-3">marched steps</th>
              <th className="text-left pr-3">card points</th>
              <th className="text-left pr-3">stride</th>
              <th className="text-left pr-3">time step, s</th>
              <th className="text-left">cycles</th>
            </tr>
          </thead>
          <tbody>
            {d.publishedSampling.map((r) => (
              <tr key={r.spm}>
                <td className="pr-3">published taper, {fmt(r.spm, 1)} spm</td>
                <td className="pr-3">{fmt(r.samples, 0)}</td>
                <td className="pr-3">{fmt(r.cardPoints, 0)}</td>
                <td className="pr-3">{fmt(r.stride, 0)}</td>
                <td className="pr-3">{r.dtS.toExponential(6)}</td>
                <td>{fmt(r.cycles, 0)}</td>
              </tr>
            ))}
            <tr>
              <td className="pr-3 text-[#BFFF00]">{ODUMA.label}, {fmt(ODUMA.spm, 1)} spm</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(s.samples, 0)}</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(s.cardPoints, 0)}</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(s.stride, 0)}</td>
              <td className="pr-3 text-[#BFFF00]">{t.dtS.toExponential(6)}</td>
              <td className="text-[#BFFF00]">{fmt(t.cycles, 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="h-80 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="positionIn" type="number" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'position, in', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis dataKey="loadLb" type="number" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'load, lb', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <ZAxis range={[16, 16]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Scatter name="the surface card, at the polished rod" data={d.surfaceCard} fill="#BFFF00" line isAnimationActive={false} />
            <Scatter name="the pump card, at the plunger" data={d.pumpCard} fill="#38bdf8" line isAnimationActive={false} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE TWO VERTICAL SIDES OF THE PUMP CARD ARE THE VALVE TRANSFERS, where the plunger is held
        still and the rod above it stretches or relaxes. Away from them the pump load takes two
        values: {fmt(d.areas.fluidLoadLb, 9)} lb while lifting or pounding down, and 0 lb while
        falling. The surface card encloses {fmt(d.areas.surfaceAreaInLb, 6)} in-lb per cycle against
        the pump card's {fmt(d.areas.pumpAreaInLb, 6)}, and the difference of
        {' '}{fmt(d.areas.differenceInLb, 6)} in-lb is the work the rods and the damping absorb.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">speed, spm</th>
              <th className="text-left pr-3">stroke period, s</th>
              <th className="text-left pr-3">round trips of the string per stroke</th>
              <th className="text-left">speed over the fundamental</th>
            </tr>
          </thead>
          <tbody>
            {d.transit.map((r) => (
              <tr key={r.spm}>
                <td className="pr-3">{fmt(r.spm, 1)}</td>
                <td className="pr-3">{fmt(r.periodS, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.roundTripsPerStroke, 9)}</td>
                <td>{fmt(r.speedOverFundamental, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A STRING THE WAVE CROSSES A HUNDRED TIMES A STROKE IS A SPRING. One it crosses a handful of
        times is a wave machine, and the two rules for the plunger stroke separate over exactly that
        range. On the published taper a round trip takes
        {' '}{fmt(d.transitHeadline.roundTripS, 9)} s at a wave speed of
        {' '}{fmt(d.transitHeadline.waveSpeedFtS, 6)} ft/s.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        WHAT THE CALLER CANNOT ASK FOR. The march accepts a card sample count, a node count, a cycle
        cap of {fmt(s.maxCyclesDefault, 0)} and a tolerance of {s.tolDefault}. The design function
        forwards none of them, so a studio user gets the loads that came off the default decimation
        and has no way to request a finer one. And an undamped march is refused outright:
        {' '}{d.refusal.message}
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const Stretch = () => {
  const d = useSafe(() => cardExplorer.stretch());
  const [pick, setPick] = useState('published');
  if (!d || !d.publishedLadder.length) {
    return <Note>The spring rule needs a surface stroke, a fluid load and an elastic constant, and the wave answer needs a march on top of them. With no fluid load there is no static stretch to subtract, so the two rules collapse onto the surface stroke and there is nothing to compare.</Note>;
  }
  const rows = pick === 'published' ? d.publishedLadder : d.teachingLadder.filter((r) => r.ok);
  const rule = pick === 'published' ? d.publishedRule : d.teachingRule;
  return (
    <>
      <FieldGrid>
        <SelectField label="Case" value={pick} onChange={setPick} options={[
          { value: 'published', label: 'the published taper, simple harmonic motion' },
          { value: 'teaching', label: `${ODUMA.label}, on the published four-bar` },
        ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Surface stroke S" value={fmt(rule.strokeIn, 9)} unit="in" />
          <Tile label="Fluid load Fo" value={fmt(rule.fluidLoadLb, 9)} unit="lb" />
          <Tile label="Elastic constant Er" value={tiny(rule.erInPerLb)} unit="in/lb" />
          <Tile label="Static stretch Fo Er" value={fmt(rule.staticStretchIn, 9)} unit="in" />
          <Tile label="Spring rule S - Fo Er" value={fmt(rule.springRuleIn, 9)} unit="in" />
          <Tile label="And it does not depend on speed" value={String(new Set(rows.map((r) => r.springRuleIn)).size === 1)} />
          <Tile label="Longest wave answer in the ladder" value={fmt(Math.max(...rows.map((r) => r.waveMarchIn)), 9)} unit="in" />
          <Tile label="Largest overtravel" value={fmt(Math.max(...rows.map((r) => r.overtravelPct)), 6)} unit="%" />
        </TileGrid>
      </div>
      <div className="h-80 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="spm" type="number" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'pumping speed, spm', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="s" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'plunger stroke, in', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="p" orientation="right" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'overtravel, %', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="s" type="monotone" dataKey="springRuleIn" name="the spring rule, S less Fo Er"
              stroke="#f97316" strokeDasharray="5 3" dot={false} isAnimationActive={false} />
            <Line yAxisId="s" type="monotone" dataKey="waveMarchIn" name="the wave march"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line yAxisId="p" type="monotone" dataKey="overtravelPct" name="overtravel, per cent of the spring rule"
              stroke="#38bdf8" dot={{ r: 2 }} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">speed, spm</th>
              <th className="text-left pr-3">spring rule, in</th>
              <th className="text-left pr-3">wave march, in</th>
              <th className="text-left pr-3">overtravel, in</th>
              <th className="text-left pr-3">overtravel, %</th>
              <th className="text-left">speed over the fundamental</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.spm}>
                <td className="pr-3">{fmt(r.spm, 1)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.springRuleIn, 9)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.waveMarchIn, 9)}</td>
                <td className="pr-3">{fmt(r.overtravelIn, 9)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.overtravelPct, 6)}</td>
                <td>{fmt(r.speedOverFundamental, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE WAVE ANSWER IS LONGER AT EVERY SPEED ON THIS LADDER, and the difference is inertial
        OVERTRAVEL: the spring rule subtracts a static stretch from the surface stroke and knows
        nothing about a rod string that is still moving when the polished rod turns round. Read the
        whole ladder rather than one row. The overtravel is small near the static limit and large at
        a working speed, but it is NOT MONOTONE in between, because the settled cycle a march lands
        on depends on where the valve transfers fall relative to the wave arriving back from the
        pump, and that phase is not a smooth function of speed. Never quote a rising trio and call
        it a trend.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">fluid load, lb</th>
              <th className="text-left pr-3">spring rule, in</th>
              <th className="text-left pr-3">wave march, in</th>
              <th className="text-left pr-3">overtravel, in</th>
              <th className="text-left">overtravel, %</th>
            </tr>
          </thead>
          <tbody>
            {d.byLoad.map((r) => (
              <tr key={r.fluidLoadLb}>
                <td className="pr-3">{fmt(r.fluidLoadLb, 0)}</td>
                <td className="pr-3">{fmt(r.springRuleIn, 9)}</td>
                <td className="pr-3">{fmt(r.waveMarchIn, 9)}</td>
                <td className="pr-3">{fmt(r.overtravelIn, 9)}</td>
                <td className="text-[#38bdf8]">{fmt(r.overtravelPct, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE OVERTRAVEL IS AN INERTIA EFFECT, so it shrinks when the string is stiff relative to the
        load it carries. The published case at 9 spm with the fluid load walked down says so, and
        the percentage is the column to read because the spring rule moves too. WHICH ONE IS THE
        STROKE: the wave answer, because it is the travel of the plunger the barrel actually sees,
        and it is what the displacement is fed. The spring rule is the static limit of the same
        thing. Neither is a correction to the other and averaging them would be meaningless.
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const Loads = () => {
  const d = useSafe(() => cardExplorer.loads());
  const [sweep, setSweep] = useState('damping');
  if (!d || !d.damping.length) {
    return <Note>Both polished rod loads come off a card, and a card needs a settled march. With no converged cycle there is no peak and no minimum to report, only an indicative pair the engine flags as unsettled.</Note>;
  }
  const t = d.teaching;
  const rows = { damping: d.damping, plunger: d.plunger, gravity: d.gravity }[sweep];
  const xKey = { damping: 'dampingRatio', plunger: 'plungerDIn', gravity: 'fluidSg' }[sweep];
  const xLabel = { damping: 'damping ratio', plunger: 'plunger diameter, in', gravity: 'fluid specific gravity' }[sweep];
  return (
    <>
      <TileGrid>
        <Tile label="Peak polished rod load" value={fmt(t.pprlLb, 9)} unit="lb" />
        <Tile label="Minimum polished rod load" value={fmt(t.mprlLb, 9)} unit="lb" />
        <Tile label="Load range" value={fmt(t.loadRangeLb, 9)} unit="lb" />
        <Tile label="Plunger stroke" value={fmt(t.plungerStrokeIn, 9)} unit="in" />
        <Tile label="Skr, the load scale" value={fmt(d.groups.skrLb, 6)} unit="lb" />
        <Tile label="Fo over Skr" value={fmt(d.groups.foOverSkr, 9)} />
        <Tile label="F1 over Skr" value={fmt(d.groups.f1OverSkr, 9)} />
        <Tile label="F2 over Skr" value={fmt(d.groups.f2OverSkr, 9)} />
      </TileGrid>
      <div className="mt-3 text-xs text-slate-300">
        THE RANGE IS THE NUMBER THE RODS FEEL, because steel fails on the swing and not on the
        average, and it is the only one of the three headline numbers that collects a movement at
        both ends of the card. On the published taper it runs
        {' '}{fmt(d.published[0].loadRangeLb, 9)} lb at {fmt(d.published[0].spm, 0)} spm and
        {' '}{fmt(d.published[1].loadRangeLb, 9)} lb at {fmt(d.published[1].spm, 0)} spm: the peak
        climbed and the minimum fell.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">section</th>
              <th className="text-left pr-3">top, ft</th>
              <th className="text-left pr-3">envelope sample read at, ft</th>
              <th className="text-left pr-3">max stress, psi</th>
              <th className="text-left pr-3">min stress, psi</th>
              <th className="text-left pr-3">allowable, psi</th>
              <th className="text-left">loading, %</th>
            </tr>
          </thead>
          <tbody>
            {d.stresses.map((r) => (
              <tr key={r.index}>
                <td className="pr-3 text-[#BFFF00]">{r.label}</td>
                <td className="pr-3">{fmt(r.topDepthFt, 1)}</td>
                <td className="pr-3">{fmt(r.envelopeSampleFt, 6)}</td>
                <td className="pr-3">{fmt(r.maxStressPsi, 6)}</td>
                <td className="pr-3">{fmt(r.minStressPsi, 6)}</td>
                <td className="pr-3">{fmt(r.allowablePsi, 6)}</td>
                <td>{fmt(r.loadingPct, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE TWO READINGS ARE NOT TAKEN THE SAME WAY. The reported peak and minimum above are read
        off the surface card the function returns. The section maxima and minima that feed this
        table are read off the tension envelope the march accumulated. They come out of one call and
        describe the same cycle, so a range built from one pair is not interchangeable with a range
        built from the other, and quoting a reported load range and a stress percentage in one
        sentence as though the second followed from the first is the mistake this distinction exists
        to prevent.
      </div>
      <FieldGrid>
        <SelectField label="Sweep, one input at a time" value={sweep} onChange={setSweep} options={[
          { value: 'damping', label: 'the damping ratio, which nobody measures' },
          { value: 'plunger', label: 'the plunger size' },
          { value: 'gravity', label: 'the fluid gravity' },
        ]} />
      </FieldGrid>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey={xKey} type="number" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: xLabel, position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'load, lb', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="pprlLb" name="peak polished rod load" stroke="#BFFF00" dot={{ r: 2 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="mprlLb" name="minimum polished rod load" stroke="#38bdf8" dot={{ r: 2 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">{xLabel}</th>
              <th className="text-left pr-3">PPRL, lb</th>
              <th className="text-left pr-3">MPRL, lb</th>
              <th className="text-left pr-3">plunger stroke, in</th>
              <th className="text-left pr-3">worst loading, %</th>
              <th className="text-left">warnings</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[xKey]}>
                <td className="pr-3">{fmt(r[xKey], 4)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.pprlLb, 6)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.mprlLb, 6)}</td>
                <td className="pr-3">{fmt(r.plungerStrokeIn, 6)}</td>
                <td className="pr-3">{fmt(r.worstLoadingPct, 6)}</td>
                <td>{r.warnings || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        {sweep === 'damping' && `THE DAMPING RATIO IS THE INPUT NOBODY MEASURES, and across these nine contiguous rows the peak moves ${fmt(d.dampingSpread.pprlSpreadLb, 6)} lb, the minimum ${fmt(d.dampingSpread.mprlSpreadLb, 6)} lb and the plunger stroke ${fmt(d.dampingSpread.plungerStrokeSpreadIn, 6)} in. Field strings sit between about 0.05 and 0.15 of critical, which is most of this column.`}
        {sweep === 'plunger' && 'THE PLUNGER SIZE MOVES THE LOAD AND THE VOLUME in opposite directions on the thing a designer cares about: a bigger bore lifts more barrels and hangs more weight on the same steel, and the loading column is where the two meet.'}
        {sweep === 'gravity' && 'THE FLUID GRAVITY MOVES THE BUOYED WEIGHT and therefore both loads, and it moves nothing else in the string. The spring rate and the elastic constant are properties of the steel and the geometry, so the fluid changes the weight the polished rod carries and not how far the string stretches under a given load.'}
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const Power = () => {
  const d = useSafe(() => cardExplorer.power());
  if (!d || !d.teaching.length) {
    return <Note>Polished rod horsepower is a card area times a speed, so it needs a closed loop of load against position. With no card there is no area, and a rate of work cannot be recovered from the loads alone.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="Card area at the design speed" value={fmt(d.areas.surfaceAreaInLb, 6)} unit="in-lb per cycle" />
        <Tile label="Polished rod horsepower" value={fmt(d.teaching.find((r) => r.spm === ODUMA.spm).prhp, 9)} unit="hp" />
        <Tile label="Horsepower per barrel produced" value={fmt(d.perBarrel.hpPerBpd, 9)} unit="hp per bbl/d" />
        <Tile label="Produced" value={fmt(d.perBarrel.producedBpd, 6)} unit="bbl/d" />
      </TileGrid>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={d.teaching} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="spm" type="number" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'pumping speed, spm', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="a" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'card area, in-lb per cycle', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="h" orientation="right" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'horsepower, hp', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="a" type="monotone" dataKey="cardAreaInLb" name="the loop the polished rod does once a stroke"
              stroke="#BFFF00" dot={{ r: 2 }} isAnimationActive={false} />
            <Line yAxisId="h" type="monotone" dataKey="prhp" name="the power that loop costs"
              stroke="#38bdf8" dot={{ r: 2 }} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">speed, spm</th>
              <th className="text-left pr-3">card area, in-lb per cycle</th>
              <th className="text-left pr-3">horsepower, hp</th>
              <th className="text-left">area times speed over 396000</th>
            </tr>
          </thead>
          <tbody>
            {d.teaching.map((r) => (
              <tr key={r.spm}>
                <td className="pr-3">{fmt(r.spm, 1)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.cardAreaInLb, 6)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.prhp, 9)}</td>
                <td>{fmt(r.areaTimesSpeedOver396000, 9)}</td>
              </tr>
            ))}
            {d.published.map((r) => (
              <tr key={`p${r.spm}`} className="text-slate-500">
                <td className="pr-3">published taper, {fmt(r.spm, 1)}</td>
                <td className="pr-3">{fmt(r.cardAreaInLb, 6)}</td>
                <td className="pr-3">{fmt(r.prhp, 9)}</td>
                <td>-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE SPEED IS IN THE ANSWER TWICE. Horsepower is the card area times the speed over 396000,
        and raising the speed makes the loop bigger as well as more frequent, so both columns climb
        and the horsepower does not scale with the speed. A designer who prorated the low figure
        would size the surface equipment for a machine that does not exist.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        AND IT REFUSES TO BE MORE EXACT THAN THE CARD IT WAS HANDED. The area comes off the
        decimated card, which is {fmt(d.subsampleCost.cardAreaLowByInLb, 4)} in-lb per cycle below
        the area over every marched step, {fmt(d.subsampleCost.cardAreaLowByPct, 6)} percent, and
        the horsepower moves with it. It is also the power AT THE POLISHED ROD: no gearbox loss, no
        belt loss, no motor efficiency and no counterbalance work, and it is a rate of work rather
        than a verdict on the design.
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const Fillage = () => {
  const d = useSafe(() => cardExplorer.fillage());
  if (!d || !d.sweep.length) {
    return <Note>Fillage is a fraction of the barrel that fills, so it needs a marched plunger stroke to be charged against. With no card there is no swept volume, and a produced rate cannot be recovered from a rating.</Note>;
  }
  const s = d.summary;
  return (
    <>
      <TileGrid>
        <Tile label="Largest overstatement" value={fmt(s.largestOverstatementPct, 6)} unit="%" />
        <Tile label="At a fillage of" value={fmt(s.largestOverstatementAtFillage, 4)} />
        <Tile label="Largest understatement" value={fmt(s.largestUnderstatementPct, 6)} unit="%" />
        <Tile label="At a fillage of" value={fmt(s.largestUnderstatementAtFillage, 4)} />
        <Tile label="Rows above the nominal factor" value={fmt(s.aboveNominalCount, 0)} />
        <Tile label="Rows below it" value={fmt(s.belowNominalCount, 0)} />
        <Tile label="Longest plunger stroke in the sweep" value={fmt(s.longestPlungerStrokeIn, 6)} unit="in" />
        <Tile label="At a fillage of" value={fmt(s.longestAtFillage, 4)} />
      </TileGrid>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={d.sweep} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="fillage" type="number" tick={AXIS} domain={['auto', 'auto']} reversed
              label={{ value: 'fillage', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="r" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'effective over nominal', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="q" orientation="right" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'produced, bbl/d', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="r" y={1} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'the factor that was typed', fill: '#f472b6', fontSize: 10, position: 'insideTopLeft' }} />
            <ReferenceLine yAxisId="r" x={d.threshold} stroke="#f97316" strokeDasharray="4 3"
              label={{ value: 'the warning threshold', fill: '#f97316', fontSize: 10, position: 'top' }} />
            <Line yAxisId="r" type="monotone" dataKey="effectiveOverNominal" name="what the design really applied, over what was typed"
              stroke="#BFFF00" dot={{ r: 2 }} isAnimationActive={false} />
            <Line yAxisId="q" type="monotone" dataKey="producedBpd" name="produced"
              stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">fillage</th>
              <th className="text-left pr-3">plunger stroke, in</th>
              <th className="text-left pr-3">swept, bbl/d</th>
              <th className="text-left pr-3">produced, bbl/d</th>
              <th className="text-left pr-3">effective factor</th>
              <th className="text-left pr-3">effective over nominal</th>
              <th className="text-left">warnings</th>
            </tr>
          </thead>
          <tbody>
            {d.sweep.map((r) => (
              <tr key={r.fillage}>
                <td className="pr-3">{fmt(r.fillage, 4)}</td>
                <td className="pr-3">{fmt(r.plungerStrokeIn, 6)}</td>
                <td className="pr-3">{fmt(r.sweptBpd, 6)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.producedBpd, 6)}</td>
                <td className="pr-3">{fmt(r.effectiveFactor, 9)}</td>
                <td className={r.effectiveOverNominal > 1 ? 'pr-3 text-[#BFFF00]' : 'pr-3 text-[#f97316]'}>
                  {fmt(r.effectiveOverNominal, 9)}
                </td>
                <td>{r.warnings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE FACTOR THAT COMES OUT IS NOT THE FACTOR THAT WENT IN. The swept rate is computed from the
        plunger stroke the march returned, then multiplied by the fillage, and the plunger stroke had
        already moved with that same fillage: the pound down state holds the fluid load on the
        plunger while it travels down through the empty part of the barrel, and that travel is inside
        the stroke. So a fillage multiplier is charged against a swept volume the same fillage
        already changed. The last column is above one on {fmt(s.aboveNominalCount, 0)} of these rows
        and below it on {fmt(s.belowNominalCount, 0)}, so THE SIGN FLIPS: there is no direction to
        defend and no correction to apply. The plunger stroke is not monotone in fillage either, and
        the longest stroke in the sweep is not at a full barrel.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">fillage</th>
              <th className="text-left pr-3">produced, bbl/d</th>
              <th className="text-left pr-3">plunger stroke, in</th>
              <th className="text-left">warning raised</th>
            </tr>
          </thead>
          <tbody>
            {d.cliff.map((r) => (
              <tr key={r.fillage} className={r.incompleteFillage ? 'text-[#f97316]' : ''}>
                <td className="pr-3">{fmt(r.fillage, 4)}</td>
                <td className="pr-3">{fmt(r.producedBpd, 6)}</td>
                <td className="pr-3">{fmt(r.plungerStrokeIn, 6)}</td>
                <td>{r.incompleteFillage ? 'incompleteFillage' : 'silent'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A CLIFF IN THE CODE. The warning fires at a hard fillage below {d.threshold}, with no
        hysteresis and no graduation. The silent design above makes {fmt(d.pair.silentProducedBpd, 6)}
        {' '}bbl/d and the warned one makes {fmt(d.pair.warnedProducedBpd, 6)} bbl/d: they are
        {' '}{fmt(d.pair.apartBpd, 6)} bbl/d apart and one of them raises a warning. The point is not
        that {d.threshold} is the wrong place to draw a line, because the design is genuinely
        pounding on both sides of it. The point is that the warning list is not a substitute for
        reading the number.
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const CardExplorer = ({ initialMode = 'march' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Card explorer"
      subtitle="The design is the card: what the march computes and what it throws away, the static stretch against the wave answer, both polished rod loads and what moves them, the power the loop costs, and what the well actually makes"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'march' && <March />}
        {mode === 'stretch' && <Stretch />}
        {mode === 'loads' && <Loads />}
        {mode === 'power' && <Power />}
        {mode === 'fillage' && <Fillage />}
      </div>
    </PanelShell>
  );
};

export default CardExplorer;
