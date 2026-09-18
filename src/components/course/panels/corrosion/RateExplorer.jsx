import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  twoResistances, protectiveFilm, phAndItsReference, waterWetting, studioDefaults,
} from './corrosionLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// The rate explorer: the two resistances, the film, the pH correction and the
// wetting regime, each shown as the separate factor the engine reports.
//
// THE RATE IS TWO RESISTANCES IN SERIES. It is not the reaction rate and it is
// not the transport rate. It is the reciprocal of the sum of the reciprocals, so
// the combined answer is always BELOW BOTH TERMS and sits close to whichever
// term is smaller. That property is visible on every row of the first table.
//
// THE FILM ONSET IS COMPUTED AND IT MOVES. This panel prints no round onset
// temperature anywhere, because there is no such number: the onset is where the
// scale expression crosses zero and it moves with the CO2 fugacity. Across the
// fugacities the lab sweeps it moves by more than ninety degrees Celsius, so a
// fixed figure would be wrong at every fugacity except one.
//
// AND NOTHING DOWNSTREAM OF THE SCALE FACTOR IS GRADED. Whether that factor
// multiplies the reaction term or the combined rate is UNRESOLVED. This module
// multiplies the combined rate, the two give materially different answers
// whenever mass transfer controls, and which the published correlation intends
// is not established in this repository. No band label appears on this page as a
// measurement for the same reason.
//
// Every figure here is a return value of the vendored engine through
// corrosionLab. Nothing on this page computes a rate, and nothing reads a clock.
//
// NO P LABEL. Nothing in this course is a distribution.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');

export const MODES = [
  ['series', 'Two resistances in series, and which one is holding the rate back'],
  ['film', 'The protective film, and an onset temperature that MOVES'],
  ['ph', 'pH, the reference it is taken against, and the refusal below it'],
  ['wetting', 'Water wetting, a dropdown that can take the rate to zero'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const SERIES = ['#38bdf8', '#f472b6', '#BFFF00', '#fbbf24'];

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

const Unresolved = ({ children }) => (
  <div className="mt-3 rounded-md border border-fuchsia-800/60 bg-fuchsia-950/20 p-3">
    <p className="text-fuchsia-300 text-xs font-medium mb-1">UNRESOLVED, AND NOTHING BELOW IT IS GRADED</p>
    <p className="text-xs text-slate-300 mb-0">{children}</p>
  </div>
);

const Absent = ({ children }) => (
  <div className="mt-3 rounded-md border border-slate-600 bg-slate-900/40 p-3">
    <p className="text-slate-300 text-xs font-medium mb-1">NOT PROVIDED</p>
    <p className="text-xs text-slate-400 mb-0">{children}</p>
  </div>
);

const Quote = ({ children }) => (
  <p className="mt-2 mb-0 border-l-2 border-slate-600 pl-3 text-xs text-slate-400 font-mono">{children}</p>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const SeriesMode = ({ s, d }) => {
  if (!s || !d) return <Note>The series reader did not return its streams.</Note>;
  const chart = s.rows.map((r) => ({
    name: r.name, reaction: r.reactionMmYr, transport: r.massTransferMmYr, combined: r.combinedMmYr,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Reaction term at the studio defaults" value={six(d.reactionMmYr)} unit="mm/yr" />
        <Tile label="Mass-transfer term at the same case" value={six(d.massTransferMmYr)} unit="mm/yr" />
        <Tile label="Combined, below both of them" value={six(d.combinedMmYr)} unit="mm/yr" />
        <Tile label="Controlling, and its margin" value={`${d.controlling}, ${six(d.controllingMargin)}`} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The combined answer is below both terms on every row, and it sits close to whichever term is smaller. That is
        what a series combination means, and it is a property you can state before you see a number. The controlling
        word carries a REPORTING margin of {six(s.controllingMarginPct)} percent, inside which the engine answers
        comparable rather than naming one term, because a bare comparison of two nearly equal numbers flips on
        floating-point noise.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="reaction" name="reaction term, mm/yr" stroke={SERIES[0]} dot isAnimationActive={false} />
            <Line dataKey="transport" name="mass-transfer term, mm/yr" stroke={SERIES[1]} dot isAnimationActive={false} />
            <Line dataKey="combined" name="combined, mm/yr" stroke={SERIES[2]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['stream', 'reaction mm/yr', 'mass transfer mm/yr', 'combined mm/yr', 'combined over the smaller term', 'controlling', 'margin']}
        rows={s.rows.map((r) => [
          r.name, six(r.reactionMmYr), six(r.massTransferMmYr), six(r.combinedMmYr),
          six(r.combinedOverSmaller), r.controlling, six(r.controllingMargin),
        ])}
      />
      <Note>
        The transport term is a power law and its powers are measurable properties rather than typed constants. The
        velocity exponent measured out of the engine is {twelve(s.velocityExponent)} and the diameter exponent is
        {' '}{twelve(s.diameterExponent)}, and both ratio columns below are constant down the table, which is what a
        power law means.
      </Note>
      <Tbl
        head={['diameter m', 'at 1 m/s', 'at 2 m/s', 'ratio', 'at 4 m/s', 'ratio']}
        rows={s.powerLaw.map((p) => [six(p.diameterM), six(p.at1), six(p.at2), twelve(p.ratioOne), six(p.at4), twelve(p.ratioTwo)])}
      />
      <Held>
        Every de Waard-Milliams constant, and therefore every rate the correlation produced. The reaction pair, the
        transport coefficient and both of its exponents are unsourced in this repository, so this course grades no rate
        the correlation produced at all. Read the two terms as an argument about which mechanism limits the wall loss,
        and read the combined figure as a screening number to be argued with.
      </Held>
      <Absent>
        An absent velocity is not an unlimited transport capacity. The transport door returns not-a-number rather than
        infinity when the velocity or the line diameter is missing, because an infinite transport rate makes the series
        combination equal the reaction term exactly and the engine would then name reaction kinetics as the controlling
        mechanism from an input nobody supplied.
      </Absent>
    </>
  );
};

export const FilmMode = ({ f }) => {
  if (!f) return <Note>The film reader did not return an onset sweep.</Note>;
  const chart = f.onsets.map((o) => ({ fco2: o.fco2Bar, onset: o.onsetC }));
  const temps = f.temperatureRows.map((r) => ({ tC: r.tC, factor: r.scaleFactor, rate: r.rateMmYr }));
  return (
    <>
      <TileGrid>
        <Tile label="Computed onset at the studio fugacity" value={six(f.appOnsetC)} unit="C" />
        <Tile label="The fugacity that onset belongs to" value={six(f.appFco2Bar)} unit="bar" />
        <Tile label="How far the onset moves across the swept fugacities" value={six(f.onsetSpreadC)} unit="C" />
        <Tile label="Scale factor at the studio's own temperature" value={twelve(f.appScaleFactor)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        THE ONSET IS NOT A FIXED TEMPERATURE, so this page prints no round one. It is the temperature at which the scale
        expression crosses zero, it moves with the CO2 fugacity, and across the fugacities below it moves by
        {' '}{six(f.onsetSpreadC)} degrees Celsius. A help guide that quotes one figure is wrong at every fugacity
        except one. The fourth column is the proof that the computed onset is the crossing: the factor there is exactly
        one to twelve decimals, by construction rather than by a clamp.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="fco2" scale="log" domain={['auto', 'auto']} tick={AXIS} label={{ value: 'CO2 fugacity, bar', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} label={{ value: 'computed onset, C', angle: -90, fill: '#94a3b8', fontSize: 11, position: 'insideLeft' }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={f.appOnsetC} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: 'the studio case', fill: '#fbbf24', fontSize: 10 }} />
            <Line dataKey="onset" name="computed onset, C" stroke={SERIES[0]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['CO2 fugacity bar', 'computed onset C', 'factor at 60 C', 'factor at the onset', 'factor 20 C above it']}
        rows={f.onsets.map((o) => [six(o.fco2Bar), six(o.onsetC), six(o.at60), twelve(o.atOnset), six(o.above)])}
      />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={temps} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="tC" tick={AXIS} label={{ value: 'temperature, C', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="factor" name="scale factor" stroke={SERIES[2]} dot isAnimationActive={false} />
            <Line dataKey="rate" name="rate, mm/yr" stroke={SERIES[1]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Two streams, one number, two answers. The hot stream runs at {six(f.kanbiTC)} C with a fugacity of
        {' '}{six(f.kanbiFco2Bar)} bar, so its computed onset is {six(f.kanbiOnsetC)} C and its factor is
        {' '}{six(f.kanbiScaleFactor)}. The base stream runs at {six(f.etelebouTC)} C with a fugacity of
        {' '}{six(f.etelebouFco2Bar)} bar, so its onset is {six(f.etelebouOnsetC)} C and its factor is exactly
        {' '}{twelve(f.etelebouScaleFactor)}.
      </Note>
      <Unresolved>
        The engine forms the series combination FIRST and then multiplies by this factor, so it applies a
        protective-film correction to a rate that mass transfer may be controlling. Multiplying the reaction term
        instead is a different physical claim and gives a materially different answer whenever mass transfer controls,
        which it does at the studio's own defaults. Which of the two the published correlation intends is not
        established here, the engine says so in its own held list, and nothing downstream of this factor is graded in
        this course.
      </Unresolved>
      <Held>
        The three scale constants, and the temperature at which the PUBLISHED correlation turns protective. The onset
        this page prints is the one the engine computes from its own expression, which is a different claim from a
        published onset and is the reason the computed figure is the only one shown.
      </Held>
    </>
  );
};

export const PhMode = ({ p }) => {
  if (!p) return <Note>The pH reader did not return a sweep.</Note>;
  const chart = p.rows.map((r) => ({ ph: r.ph, factor: r.factor, rate: r.rateMmYr }));
  return (
    <>
      <TileGrid>
        <Tile label="The reference the correction is taken against" value={six(p.phReference)} />
        <Tile label="Factor at the reference, by definition" value={twelve(p.referenceFactor)} />
        <Tile label="Rate at the bottom of the swept band" value={six(p.firstRateMmYr)} unit="mm/yr" />
        <Tile label="And at the top of it" value={six(p.lastRateMmYr)} unit="mm/yr" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The rate falls strictly with pH across the whole band above the reference, by a factor of
        {' '}{six(p.spanFactor)} from pH {six(p.firstPh)} to pH {six(p.lastPh)}. Exactly one decade per two pH units is
        a PROPERTY of the correction and it is scale free, so it tests the form rather than the slope:
        {' '}{p.decade.map((d) => twelve(d.ratio)).join(', ')}.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="ph" tick={AXIS} label={{ value: 'in-situ pH', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={p.phReference} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: 'the reference', fill: '#fbbf24', fontSize: 10 }} />
            <Line dataKey="factor" name="pH factor" stroke={SERIES[2]} dot isAnimationActive={false} />
            <Line dataKey="rate" name="rate, mm/yr" stroke={SERIES[1]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['pH', 'factor', 'factor relative to the reference', 'rate on the base stream mm/yr']}
        rows={p.rows.map((r) => [six(r.ph), six(r.factor), six(r.relativeToReference), six(r.rateMmYr)])}
      />
      <Note>
        BELOW THE REFERENCE THE ENGINE REFUSES. It does not return a factor of one, and that distinction is the whole of
        this view: a more acid water is a more corrosive one, so a factor of one would be the least limiting possible
        answer to a question the module cannot answer. Its own message for one pH below the boundary:
      </Note>
      <Quote>{p.boundaryMessage}</Quote>
      <Tbl
        head={['pH', 'what the engine returns', 'the boundary it carries']}
        rows={p.refusals.map((r) => [six(r.ph), 'a refusal', six(r.phReference)])}
      />
      <Held>
        The pH slope, the reference pH itself, and what the published correction does below that reference. All three
        are unsourced, and the refusal below the reference is this module's own stated convention rather than a
        published behaviour.
      </Held>
    </>
  );
};

export const WettingMode = ({ ww }) => {
  if (!ww) return <Note>The wetting reader did not return its regimes.</Note>;
  return (
    <>
      <TileGrid>
        {ww.regimes.map((r) => (
          <Tile key={r.regime} label={`${r.regime}, wetting factor`} value={six(r.waterWettingFactor)} />
        ))}
        <Tile label="Effective protection in the oil-wet case" value={String(ww.oilWetEffectiveInhibitionPct)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Steel does not corrode where it is oil wet, and the engine treats that as a REGIME rather than as a multiplier
        applied always. The multiplier for the oil-wet regime is zero, a zero rate is the strongest reassurance a screen
        can give, and whether the wall is oil wet is an INPUT. That makes this dropdown able to take the rate to zero
        with nothing else touched.
      </p>
      <Tbl
        head={['regime', 'wetting factor', 'rate mm/yr', 'what the engine says']}
        rows={ww.regimes.map((r) => [r.regime, six(r.waterWettingFactor), six(r.rateMmYr), r.why])}
      />
      <Note>
        The oil-wet case withholds its band label and its remaining life, and it says why in its own words:
      </Note>
      <Quote>{ww.oilWetWhy}</Quote>
      <Note>
        And the effective protection figure comes back as {String(ww.oilWetEffectiveInhibitionPct)} rather than zero. A
        reported zero percent on a line that has a corrosion inhibitor programme is a statement, and it would be a false
        one: there is nothing to be effective against when the rate is zero by assumption.
      </Note>
      <Tbl
        head={['regime', 'water cut', 'wetting factor', 'rate mm/yr']}
        rows={ww.cuts.map((c) => [c.regime, six(c.waterCutFrac), six(c.waterWettingFactor), six(c.rateMmYr)])}
      />
      <Absent>
        A wetting regime is not a measurement. The engine has no way to tell whether the wall is oil wet, so it takes
        the answer from the caller and reports the factor it used. It also has no pitting criterion, no localised rate
        and no top-of-line model, so the single rate on this page is a general uniform rate and nothing else.
      </Absent>
    </>
  );
};

const RateExplorer = ({ initialMode = 'series' }) => {
  const [mode, setMode] = useState(initialMode);
  const s = useMemo(() => (mode === 'series' ? safe(twoResistances) : null), [mode]);
  const d = useMemo(() => (mode === 'series' ? safe(studioDefaults) : null), [mode]);
  const f = useMemo(() => (mode === 'film' ? safe(protectiveFilm) : null), [mode]);
  const p = useMemo(() => (mode === 'ph' ? safe(phAndItsReference) : null), [mode]);
  const ww = useMemo(() => (mode === 'wetting' ? safe(waterWetting) : null), [mode]);

  return (
    <PanelShell
      title="Rate explorer"
      subtitle="The rate taken apart into the factors the engine reports separately: two resistances in series, a protective film whose onset is computed rather than quoted, a pH correction with a reference it refuses below, and a wetting regime that is an input."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'series' && <SeriesMode s={s} d={d} />}
        {mode === 'film' && <FilmMode f={f} />}
        {mode === 'ph' && <PhMode p={p} />}
        {mode === 'wetting' && <WettingMode ww={ww} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored Corrosion & Integrity engine through the teaching
        lab, in the engine's own units: temperature in degrees Celsius, pressures in bar, rates in millimetres a year.
        No band label appears here as a measurement, because the bands that produce it are unsourced.
      </Note>
    </PanelShell>
  );
};

export default RateExplorer;
