import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, ComposedChart, Line, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot,
} from 'recharts';
import { stringExplorer, ODUMA, STRING_IDS } from './rodPumpLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// String explorer, the Associate tier. Everything a rod pump design has BEFORE
// anything is marched: the four objects and what each one owns, the taper as a
// compromise, the note a stepped bar rings at and the grid the engine scans for
// it, the four-bar linkage and the stroke it gives, and the pump itself.
//
// Five modes, and not one of them needs a march. That is the point of the tier
// and it is why this panel is fast while the other two are not.
//
// Every figure on this page is a return value from rodPumpLab, which is a return
// value from the vendored rod pump engines. Nothing here sums a compliance,
// solves a linkage, scans for an eigenvalue or multiplies a displacement.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const tiny = (v) => {
  if (!Number.isFinite(v)) return '-';
  if (v === 0) return '0';
  return Math.abs(v) < 0.0005 ? v.toExponential(3) : fmt(v, 9);
};

const MODES = [
  { value: 'objects', label: 'Four objects, one well' },
  { value: 'taper', label: 'The rod string, and the taper as a compromise' },
  { value: 'note', label: 'The note, and the grid the scan walks' },
  { value: 'linkage', label: 'The four-bar linkage and the stroke' },
  { value: 'pump', label: 'The pump itself' },
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const useSafe = (fn, deps = []) => useMemo(() => {
  try { return fn(); } catch { return null; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, deps);

const Objects = () => {
  const d = useSafe(() => stringExplorer.objects());
  if (!d) {
    return <Note>A rod pump design needs a string, a unit, a pump and a fluid before any of the four objects has anything to contribute. With any of them missing there is nothing to name the owner of.</Note>;
  }
  return (
    <>
      <div className="overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">object</th>
              <th className="text-left pr-3">module</th>
              <th className="text-left pr-3">what it owns</th>
              <th className="text-left">needs a march</th>
            </tr>
          </thead>
          <tbody>
            {d.objects.map((o) => (
              <tr key={o.object}>
                <td className="pr-3 text-[#BFFF00]">{o.object}</td>
                <td className="pr-3">{o.module}</td>
                <td className="pr-3">{o.owns}</td>
                <td className={o.needsAMarch ? 'text-[#f97316]' : ''}>{o.needsAMarch ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <TileGrid>
          {d.objects.flatMap((o) => o.figures).map((x) => (
            <Tile key={x.label} label={x.label} value={fmt(x.value, 6)} unit={x.unit} />
          ))}
        </TileGrid>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE PUMP CONSTANT IS BUILT AND NOT REMEMBERED. It is
        {' '}{fmt(d.constants[0].engineValue, 12)} bbl per day per squared inch of plunger
        DIAMETER per inch of stroke per spm, and the pi over four is already inside it. The engine
        builds it from {fmt(d.engineConstants.in3PerBbl, 0)} cubic inches to the barrel, which is 42
        gallons of 231, and the independent oracle builds the same number starting from gallons, so a
        slip anywhere in that chain shows up as a disagreement rather than as a shared error. The
        engine reproduces the published constant with a difference of
        {' '}{tiny(d.constants[0].engineValue - d.constants[0].goldenValue)}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">rod</th>
              <th className="text-left pr-3">diameter, in</th>
              <th className="text-left pr-3">area, in2</th>
              <th className="text-left pr-3">published weight, lb/ft</th>
              <th className="text-left pr-3">bare steel, lb/ft</th>
              <th className="text-left">wave speed, ft/s</th>
            </tr>
          </thead>
          <tbody>
            {d.couplings.map((c) => (
              <tr key={c.label}>
                <td className="pr-3">{c.label}</td>
                <td className="pr-3">{fmt(c.dIn, 6)}</td>
                <td className="pr-3">{fmt(c.areaIn2, 9)}</td>
                <td className="pr-3">{fmt(c.weightLbPerFt, 4)}</td>
                <td className="pr-3">{fmt(c.bareWeightLbPerFt, 9)}</td>
                <td>{fmt(c.waveSpeedFtS, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        WHAT THE ENGINE REFUSES, collected. Every capability comes with a limit, and these are the
        limits stated as refusals rather than as caveats.
      </div>
      <ul className="mt-2 text-xs text-slate-400 list-disc pl-5 space-y-1">
        {d.refusals.map((r) => <li key={r.what}><span className="text-slate-300">{r.what}</span>: {r.message}</li>)}
      </ul>
      <div className="mt-3 text-xs text-slate-300">
        AND WHAT IT DOES NOT MODEL AT ALL, so no number on this panel speaks to it:
        {' '}{d.notModelled.join('; ')}.
      </div>
      <Note>{d.verdict.seam}</Note>
    </>
  );
};

const Taper = () => {
  const d = useSafe(() => stringExplorer.taper());
  const [pick, setPick] = useState('taper');
  if (!d || !d.split.length) {
    return <Note>A rod string needs a size, a length and a fluid before it weighs anything. With no fluid gravity there is no buoyancy factor, so there is a weight in air and nothing to subtract from it.</Note>;
  }
  const all = [...d.published, d.teaching];
  const s = all.find((x) => x.id === pick) || all[0];
  const options = all.map((x) => ({ value: x.id, label: x.id === ODUMA.label ? `${x.id}, the teaching well` : `published ${x.id}` }));
  return (
    <>
      <FieldGrid>
        <SelectField label="String" value={pick} onChange={setPick} options={options} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Length" value={fmt(s.lengthFt, 0)} unit="ft" />
          <Tile label="Weight in air" value={fmt(s.weightAirLb, 6)} unit="lb" />
          <Tile label="Buoyancy factor" value={fmt(s.buoyancy, 12)} />
          <Tile label="Buoyed weight" value={fmt(s.weightFluidLb, 6)} unit="lb" />
          <Tile label="Elastic constant Er" value={tiny(s.erInPerLb)} unit="in/lb" />
          <Tile label="Spring rate Kr" value={fmt(s.krLbPerIn, 9)} unit="lb/in" />
          <Tile label="Grade" value={s.grade} />
          <Tile label="Minimum tensile" value={fmt(s.minTensilePsi, 0)} unit="psi" />
        </TileGrid>
      </div>
      {s.goldenKrLbPerIn !== undefined && (
        <div className="mt-3 text-xs text-slate-300">
          THE ENGINE AND THE ORACLE AGREE TO THE LAST FIGURE HERE. Weight in air differs by
          {' '}{tiny(s.weightAirDiffLb)} lb, buoyed weight by {tiny(s.weightFluidDiffLb)} lb and the
          spring rate by {tiny(s.krDiffLbPerIn)} lb/in, because a compliance sum and Archimedes have
          only one answer. The two routes separate only on the eigenvalue.
        </div>
      )}
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">section</th>
              <th className="text-left pr-3">length, ft</th>
              <th className="text-left pr-3">area, in2</th>
              <th className="text-left pr-3">weight, lb/ft</th>
              <th className="text-left pr-3">compliance, in/lb</th>
              <th className="text-left pr-3">spring rate alone, lb/in</th>
              <th className="text-left">share of compliance, %</th>
            </tr>
          </thead>
          <tbody>
            {s.sections.map((sec) => (
              <tr key={sec.index}>
                <td className="pr-3 text-[#BFFF00]">{sec.label}</td>
                <td className="pr-3">{fmt(sec.lengthFt, 0)}</td>
                <td className="pr-3">{fmt(sec.areaIn2, 9)}</td>
                <td className="pr-3">{fmt(sec.weightLbPerFt, 4)}</td>
                <td className="pr-3">{tiny(sec.stretchPerLb)}</td>
                <td className="pr-3">{fmt(sec.sectionKrLbPerIn, 9)}</td>
                <td>{fmt(sec.compliancePct, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        COMPLIANCES ADD, SPRING RATES DO NOT. On the published taper the engine adds
        {' '}{tiny(d.series.erInPerLb)} in/lb of compliance and returns
        {' '}{fmt(d.series.krLbPerIn, 9)} lb/in. Adding the section spring rates instead gives
        {' '}{fmt(d.series.springRatesAddedLbPerIn, 9)} lb/in, which is
        {' '}{fmt(d.series.timesTooStiff, 6)} times the true rate. One line catches it every time: a
        series string is always softer than its softest section, and the softest section here stands
        alone at {fmt(d.series.softestSectionLbPerIn, 9)} lb/in.
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={d.split} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="topFt" type="number" tick={AXIS}
              label={{ value: '7/8 rods over the top, ft', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="k" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'spring rate, lb/in', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="n" orientation="right" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'fundamental, spm', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="k" type="monotone" dataKey="krLbPerIn" name="spring rate, climbing the whole way"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line yAxisId="n" type="monotone" dataKey="fundamentalSpm" name="the note, which turns"
              stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE SAME 5000 FT AND THE SAME TWO ROD SIZES, with the split walked from all 3/4 to all 7/8.
        This is the honest same length comparison: the published pair are 6000 and 5000 ft, so most
        of the weight and stiffness gap between them is the thousand feet and neither is a taper
        result. Down this sweep the weight and the stiffness move together, so there is no split
        that is both light and stiff. The note does not follow them: it rises, turns, and comes back
        to where it started while the string goes on getting heavier and stiffer.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">7/8 over the top, ft</th>
              <th className="text-left pr-3">weight in air, lb</th>
              <th className="text-left pr-3">buoyed, lb</th>
              <th className="text-left pr-3">Kr, lb/in</th>
              <th className="text-left pr-3">stretch under 5000 lb, in</th>
              <th className="text-left">fundamental, spm</th>
            </tr>
          </thead>
          <tbody>
            {d.split.map((r) => (
              <tr key={r.topFt}>
                <td className="pr-3">{fmt(r.topFt, 0)}</td>
                <td className="pr-3">{fmt(r.weightAirLb, 6)}</td>
                <td className="pr-3">{fmt(r.weightFluidLb, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.krLbPerIn, 9)}</td>
                <td className="pr-3">{fmt(r.stretchUnder5000LbIn, 6)}</td>
                <td className="text-[#38bdf8]">{fmt(r.fundamentalSpm, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        BUOYED WEIGHT IS ARCHIMEDES AND NOTHING ELSE, one minus the fluid gravity over the steel
        gravity, with no other coefficient in it. The last column prices a predecessor that carried
        a 1.2 in that expression: it runs {fmt(d.buoyancy.find((b) => b.fluidSg === 1).errorPct, 6)}
        {' '}percent of the buoyed weight at a gravity of 1.00 and
        {' '}{fmt(d.buoyancy[d.buoyancy.length - 1].errorPct, 6)} percent at 1.15, which is single
        digit percent and not a fifth.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">fluid gravity</th>
              <th className="text-left pr-3">factor</th>
              <th className="text-left pr-3">buoyed weight of the taper, lb</th>
              <th className="text-left pr-3">the 1.2 factor</th>
              <th className="text-left">error, %</th>
            </tr>
          </thead>
          <tbody>
            {d.buoyancy.map((b) => (
              <tr key={b.fluidSg}>
                <td className="pr-3">{fmt(b.fluidSg, 2)}</td>
                <td className="pr-3">{fmt(b.factor, 12)}</td>
                <td className="pr-3">{fmt(b.buoyedWeightLb, 6)}</td>
                <td className="pr-3 text-slate-500">{fmt(b.predecessorFactor, 12)}</td>
                <td className="text-[#f97316]">{fmt(b.errorPct, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE ORDER IS A DESIGN ERROR AND NOT A PARSE ERROR, so the engine WARNS rather than refusing.
        Reverse the published taper and it returns ok {String(d.order.ok)} with a
        {' '}{d.order.warnings} warning and a spring rate of {fmt(d.order.krLbPerIn, 9)} lb/in. A
        size it cannot read is a different matter and is REFUSED: {d.sizeRefusal.message} Reading
        that size as a decimal instead would give an area of {fmt(d.sizeRefusal.misreadAreaIn2, 6)}
        {' '}in2 against the true {fmt(d.sizeRefusal.trueAreaIn2, 9)} in2, a factor of
        {' '}{fmt(d.sizeRefusal.areaFactor, 6)}, and a string that cannot stretch.
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const NoteMode = () => {
  const d = useSafe(() => stringExplorer.note());
  const [pick, setPick] = useState('taper');
  if (!d || !d.routes.length) {
    return <Note>A natural frequency needs a string with at least one section of known area and weight. With no string there is no wave speed, so there is no note and no speed to refuse a design against.</Note>;
  }
  const r = d.routes.find((x) => x.id === pick) || d.routes[0];
  const grid = d.grids.find((g) => g.id === pick) || d.grids[0];
  const gridRows = grid.points.slice(0, 40).map((spm, i) => ({
    i,
    spm,
    intervalSpm: i === 0 ? 0 : spm - grid.points[i - 1],
  }));
  return (
    <>
      <FieldGrid>
        <SelectField label="String" value={pick} onChange={setPick}
          options={STRING_IDS.map((id) => ({ value: id, label: id === ODUMA.label ? `${id}, the teaching well` : `published ${id}` }))} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Engine scan fundamental" value={fmt(r.engineScanSpm, 12)} unit="spm" />
          <Tile label="Dense mode scan, first mode" value={fmt(r.modeScanSpm[0], 9)} unit="spm" />
          <Tile label="Second mode" value={fmt(r.modeScanSpm[1], 9)} unit="spm" />
          <Tile label="Third mode" value={fmt(r.modeScanSpm[2], 9)} unit="spm" />
          <Tile label="Mode ratios" value={`${fmt(r.modeRatios[0], 9)} and ${fmt(r.modeRatios[1], 9)}`} />
          <Tile label="Uniform" value={String(r.uniform)} />
          <Tile label="Base note n0" value={fmt(r.n0Spm, 12)} unit="spm" />
          <Tile label="Taper factor" value={fmt(r.taperFactor, 12)} />
        </TileGrid>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        TWO ROUTES, ONE EIGENVALUE. The engine scan walks its own 400 point grid and bisects the
        first sign change it meets. The mode scan walks the same transfer matrix end force on a
        uniform two million point grid from zero, so no root can be stepped over. They agree to
        every figure printed here. A uniform bar gives the odd harmonics 3 and 5 exactly; a stepped
        bar does not and is not going to, and how far it misses is what a taper factor measures.
        {r.oracleFundamentalSpm ? ` The oracle's own finite element eigenvalue differs from the engine scan by ${tiny(r.oracleDiffSpm)} spm.` : ''}
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={gridRows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="i" type="number" tick={AXIS}
              label={{ value: 'point index into the scan', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'speed, spm', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={grid.hiSpm} stroke="#f97316" strokeDasharray="4 3"
              label={{ value: 'the top of the intended range', fill: '#f97316', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={grid.fundamentalSpm} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'the fundamental', fill: '#f472b6', fontSize: 10, position: 'insideBottomRight' }} />
            <Line type="monotone" dataKey="spm" name="where the scan actually samples"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Scatter dataKey="spm" name="sample points" fill="#BFFF00" isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Intended range, low" value={fmt(grid.loSpm, 6)} unit="spm" />
          <Tile label="Intended range, high" value={fmt(grid.hiSpm, 6)} unit="spm" />
          <Tile label="Intended spacing" value={fmt(grid.intendedSpacingSpm, 9)} unit="spm" />
          <Tile label="Points inside that range" value={`${grid.pointsInRange} of ${grid.pointsTotal}`} />
          <Tile label="Widest interval inside it" value={fmt(grid.widestSpm, 9)} unit="spm" />
          <Tile label="Which is the intended spacing times" value={fmt(grid.widestOverIntended, 6)} />
          <Tile label="Last point the scan evaluates" value={grid.lastPointSpm.toExponential(6)} unit="spm" />
          <Tile label="Times the top of the range" value={grid.lastPointOverTop.toExponential(4)} />
        </TileGrid>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE SCAN MEANS TO LAY 400 EVENLY SPACED POINTS and does not. It adds its increment to the
        running position rather than to the lower bound, so the spacing grows by one increment every
        step: the first twelve intervals are
        {' '}{grid.firstTwelveIntervals.map((x) => fmt(x, 6)).join(', ')} spm, each a whole multiple
        of the intended one.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        AND THE ANSWER IS STILL RIGHT. The fundamental at {fmt(grid.fundamentalSpm, 9)} spm falls in
        an interval {fmt(grid.fundamentalIntervalWidthSpm, 9)} spm wide, from
        {' '}{fmt(grid.fundamentalIntervalLoSpm, 6)} to {fmt(grid.fundamentalIntervalHiSpm, 6)} spm.
        One root inside an interval still flips the sign at its ends, so the bisection that follows
        lands on it exactly. The comparison that decides whether a scan can be trusted on a string is
        the worst spacing against the smallest gap between roots:
        {' '}{fmt(grid.widestSpm, 9)} spm against {fmt(grid.secondModeAboveFirstSpm, 9)} spm. What
        the coarse grid costs is the guarantee, not the answer.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        WHAT THE NOTE DOES NOT PROMISE. It is a property of a string in free vibration: it says
        where the string would ring, not what the plunger does and not whether the design is any
        good. What it does decide is a refusal. Ask for {d.refusal.askedSpm} spm on a string whose
        fundamental is {fmt(d.refusal.fundamentalSpm, 9)} spm and the engine returns ok
        {' '}{String(d.refusal.ok)} with a message rather than a warning: {d.refusal.message}
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const Linkage = () => {
  const d = useSafe(() => stringExplorer.linkage());
  if (!d || !d.revolution.length) {
    return <Note>A four-bar linkage needs all five dimensions before it closes. With any of them missing the equalizer bearing does not lie on two circles at once, so there is no beam angle, no stroke and no torque factor.</Note>;
  }
  const u = d.summary;
  return (
    <>
      <TileGrid>
        <Tile label="Stroke" value={fmt(u.strokeIn, 9)} unit="in" />
        <Tile label="Beam sweep" value={fmt(u.beamSweepRad, 12)} unit="rad" />
        <Tile label="Sweep times the front arm" value={fmt(u.sweepTimesFrontArmIn, 9)} unit="in" />
        <Tile label="Oracle stroke, less the engine" value={tiny(u.strokeDiffIn)} unit="in" />
        <Tile label="Upstroke fraction" value={fmt(u.upstrokeFraction, 12)} />
        <Tile label="Upstroke at 10 spm" value={fmt(u.upstrokeSecondsAt10Spm, 9)} unit="s" />
        <Tile label="Downstroke at 10 spm" value={fmt(u.downstrokeSecondsAt10Spm, 9)} unit="s" />
        <Tile label="Largest torque factor" value={fmt(u.torqueFactorMaxIn, 9)} unit="in" />
      </TileGrid>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={d.revolution} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="crankDeg" type="number" domain={[0, 360]} tick={AXIS}
              label={{ value: 'crank angle, deg', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="p" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'position below the top, in', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="t" orientation="right" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'torque factor, in', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="t" y={0} stroke="#64748b" />
            <Line yAxisId="p" type="monotone" dataKey="positionIn" name="polished rod position, measured DOWN from the top"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line yAxisId="t" type="monotone" dataKey="torqueFactorIn" name="torque factor ds/dtheta, negative going UP"
              stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE CLOSURE IS EXACT RATHER THAN FITTED. The equalizer bearing lies on two circles at once,
        radius C about the saddle bearing and radius P about the crank pin, and intersecting them IS
        the solution. Across the whole revolution the solved point misses the rear arm by at most
        {' '}{tiny(Math.max(...d.revolution.map((r) => Math.abs(r.rearArmResidualIn))))} in and the
        pitman by at most
        {' '}{tiny(Math.max(...d.revolution.map((r) => Math.abs(r.pitmanResidualIn))))} in, which is
        round-off.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">crank, deg</th>
              <th className="text-left pr-3">beam angle, rad</th>
              <th className="text-left pr-3">position, in</th>
              <th className="text-left pr-3">torque factor, in</th>
              <th className="text-left">velocity at 10 spm, in/s</th>
            </tr>
          </thead>
          <tbody>
            {d.revolution.map((r) => (
              <tr key={r.crankDeg}>
                <td className="pr-3">{fmt(r.crankDeg, 1)}</td>
                <td className="pr-3">{fmt(r.psiRad, 9)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.positionIn, 9)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.torqueFactorIn, 9)}</td>
                <td>{fmt(r.velocityInPerS, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE UPSTROKE IS NOT HALF THE REVOLUTION. It takes {fmt(u.upstrokePct, 9)} percent of the
        turn, on a crank running at one constant speed, so the polished rod spends longer lifting
        than dropping and the two fastest velocities are not equal in size: the slower over the
        faster is {fmt(d.velocity.slowerOverFaster, 9)}. That asymmetry is exactly what a sine wave
        assumption throws away.
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={d.sine} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="tFrac" type="number" domain={[0, 1]} tick={AXIS}
              label={{ value: 'cycle fraction', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'position, in', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="fourBarIn" name="the four-bar" stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="alignedSineIn" name="a sine wave, measured from the same end"
              stroke="#f97316" strokeDasharray="5 3" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="shapeDifferenceIn" name="the SHAPE disagreement"
              stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        TWO CURVES MEASURED FROM OPPOSITE ENDS ARE NOT OUT OF STEP. The four-bar reports position
        downward from the top and a simple harmonic reports it upward from the bottom, so subtracting
        them raw gives a difference that runs the whole stroke and is almost all convention. The
        aligned curve above is a REFLECTION, not a phase shift, and its difference is the shape
        disagreement worth quoting.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">crank radius, in</th>
              <th className="text-left pr-3">stroke, in</th>
              <th className="text-left pr-3">stroke over crank radius</th>
              <th className="text-left pr-3">front arm, in</th>
              <th className="text-left pr-3">stroke, in</th>
              <th className="text-left">stroke over front arm</th>
            </tr>
          </thead>
          <tbody>
            {d.crank.map((c, i) => (
              <tr key={c.rIn}>
                <td className="pr-3">{fmt(c.rIn, 3)}</td>
                <td className="pr-3">{c.ok ? fmt(c.strokeIn, 9) : 'the linkage does not close'}</td>
                <td className="pr-3 text-[#f97316]">{c.ok ? fmt(c.strokeOverCrank, 9) : '-'}</td>
                <td className="pr-3">{d.arm[i] ? fmt(d.arm[i].aIn, 4) : ''}</td>
                <td className="pr-3">{d.arm[i] ? fmt(d.arm[i].strokeIn, 9) : ''}</td>
                <td className="text-[#BFFF00]">{d.arm[i] ? fmt(d.arm[i].strokeOverArm, 12) : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        TWICE THE CRANK RADIUS IS THE WRONG RULE, and it is not even a constant of the machine: the
        middle column moves down the sweep while the right hand one does not move at all. The front
        arm is an exact scale factor and the crank is not.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A STROKE IS REQUESTED ONLY OF THE GENERIC GEOMETRY, which scales a fixed shape rather than
        describing a real unit. {d.generic.map((g) => `Ask for ${fmt(g.requestedIn, 1)} in and it achieves ${fmt(g.achievedIn, 9)} in`).join('; ')}.
        The engine labels every one of them: {d.generic[0].note} And a linkage that cannot close is
        REPORTED rather than clamped: {d.closureRefusal.message}
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">designation</th>
              <th className="text-left pr-3">kind</th>
              <th className="text-left pr-3">gearbox, in-lb</th>
              <th className="text-left pr-3">structural, lb</th>
              <th className="text-left pr-3">stroke, in</th>
              <th className="text-left">reduction</th>
            </tr>
          </thead>
          <tbody>
            {d.designations.map((r) => (
              <tr key={r.designation}>
                <td className="pr-3 text-[#BFFF00]">{r.designation}</td>
                <td className="pr-3">{r.kind}</td>
                <td className="pr-3">{fmt(r.torqueRatingInLb, 0)}</td>
                <td className="pr-3">{fmt(r.structuralCapacityLb, 0)}</td>
                <td className="pr-3">{fmt(r.strokeIn, 0)}</td>
                <td>{r.reduction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const Pump = () => {
  const d = useSafe(() => stringExplorer.pump());
  if (!d || !d.plungers.length) {
    return <Note>A pump needs a plunger diameter and two pressures before it has a fluid load, and a stroke and a speed before it has a displacement. With the discharge below the intake there is nothing to lift and the engine says so rather than returning zero.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label={`Fluid load on ${ODUMA.label}`} value={fmt(d.teaching.fluidLoadLb, 9)} unit="lb" />
        <Tile label="Plunger area" value={fmt(d.teaching.plungerAreaIn2, 9)} unit="in2" />
        <Tile label="Volume per surface stroke" value={fmt(d.teaching.volumePerStrokeIn3, 6)} unit="in3" />
        <Tile label="Which is" value={fmt(d.teaching.volumePerStrokeBbl, 9)} unit="bbl" />
        <Tile label="Rated displacement" value={fmt(d.teaching.ratedBpd, 9)} unit="bbl/d" />
        <Tile label="Static stretch under that load" value={fmt(d.teachingStretch.stretchIn, 9)} unit="in" />
        <Tile label="Which is of the surface stroke" value={fmt(d.teachingStretch.pctOfSurfaceStroke, 6)} unit="%" />
        <Tile label="Speed over the fundamental" value={fmt(d.teaching.speedOverFundamental, 9)} />
      </TileGrid>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={d.plungers} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="dIn" type="number" tick={AXIS}
              label={{ value: 'plunger diameter, in', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'rated displacement, bbl/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="ratedBpd" name="the constant times the DIAMETER SQUARED"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="areaFormBpd" name="the same constant fed the AREA, pi over four twice"
              stroke="#f97316" strokeDasharray="5 3" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">plunger, in</th>
              <th className="text-left pr-3">area, in2</th>
              <th className="text-left pr-3">fluid load, lb</th>
              <th className="text-left pr-3">volume per stroke, in3</th>
              <th className="text-left pr-3">rated, bbl/d</th>
              <th className="text-left pr-3">area form, bbl/d</th>
              <th className="text-left">understated by, %</th>
            </tr>
          </thead>
          <tbody>
            {d.plungers.map((r) => (
              <tr key={r.dIn}>
                <td className="pr-3">{fmt(r.dIn, 4)}</td>
                <td className="pr-3">{fmt(r.areaIn2, 9)}</td>
                <td className="pr-3">{fmt(r.fluidLoadLb, 6)}</td>
                <td className="pr-3">{fmt(r.volumePerStrokeIn3, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.ratedBpd, 9)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.areaFormBpd, 9)}</td>
                <td>{fmt(r.understatedPct, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE LAST COLUMN DOES NOT MOVE, and that is what makes the error dangerous. A shortfall that
        changed with plunger size would look like a bug. One that holds at
        {' '}{fmt(d.plungers[0].understatedPct, 6)} percent on every plunger looks like a
        conservative design basis, and a designer who checks two plungers and finds the same
        relationship between them has confirmed nothing.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">differential, psi</th>
              <th className="text-left pr-3">fluid load, lb</th>
              <th className="text-left">static stretch on the published taper, in</th>
            </tr>
          </thead>
          <tbody>
            {d.fluidLoads.map((r) => (
              <tr key={r.dpPsi}>
                <td className="pr-3">{fmt(r.dpPsi, 1)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.loadLb, 9)}</td>
                <td>{fmt(r.staticStretchIn, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        FLUID LOAD IS A DIFFERENTIAL TIMES AN AREA, so it is linear in both, and static stretch is
        the elastic constant times the load, so it is linear too. A RATING IS NOT A FORECAST: rated
        displacement uses the SURFACE stroke, which the plunger never sees, and it assumes the
        barrel fills completely. Neither assumption is checked here. And a plunger with nothing to
        lift is REFUSED rather than returned as zero: {d.refusal.message}
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const StringExplorer = ({ initialMode = 'objects' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="String explorer"
      subtitle="Everything a rod pump design has before anything is marched: the four objects and what each owns, the taper as a compromise, the note and the grid the engine scans for it, the four-bar linkage and the stroke it gives, and the pump itself"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'objects' && <Objects />}
        {mode === 'taper' && <Taper />}
        {mode === 'note' && <NoteMode />}
        {mode === 'linkage' && <Linkage />}
        {mode === 'pump' && <Pump />}
      </div>
    </PanelShell>
  );
};

export default StringExplorer;
