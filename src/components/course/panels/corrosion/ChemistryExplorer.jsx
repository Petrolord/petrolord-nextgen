import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  fugacityAndPartialPressure, h2sThreshold, whichFilmGoverns, theWithdrawal,
  PRESSURE_SWEEP, REGIME_PAIRS,
} from './corrosionLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// The chemistry explorer: what is in the stream, and which quantity drives what.
//
// TWO QUANTITIES, ONE MOLECULE. The CO2 partial pressure is the total pressure
// times the mole fraction. The CO2 fugacity is that partial pressure times a
// coefficient below one at high pressure, and it is the FUGACITY that drives the
// rate. The H2S screening threshold and the film-governing ratio use PARTIAL
// PRESSURES, and the engine applies no fugacity correction to H2S at all, which
// it declares in a returned field rather than leaving to be discovered.
//
// WHAT THIS PANEL REFUSES TO SHOW, and says so on the page. There is no
// sour-service severity region here and no material guidance, because the engine
// WITHDREW both rather than retuning them. The two rows that say so are printed
// as the engine returns them, false and false, so the absence is read as a
// statement and not as a missing value.
//
// Every figure on this page is a return value of the vendored Corrosion &
// Integrity engine through corrosionLab. Nothing here computes a partial
// pressure, a fugacity, a ratio or a threshold comparison, and nothing reads a
// clock.
//
// NO P LABEL. Nothing in this course is a distribution.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');

export const MODES = [
  ['fugacity', 'Partial pressure, coefficient and fugacity, side by side'],
  ['sour', 'The H2S screening comparison, in bar and in psia'],
  ['ratio', 'The H2S to CO2 ratio, and the film that governs'],
  ['absent', 'What this door does not answer, printed as fields rather than gaps'],
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

export const FugacityMode = ({ f, pressure }) => {
  if (!f) return <Note>The fugacity reader did not return a sweep.</Note>;
  const row = f.sweep.find((r) => r.pTotalBar === Number(pressure)) || f.sweep[0];
  const chart = f.sweep.map((r) => ({
    p: r.pTotalBar, pco2: r.pco2Bar, fco2: r.fco2Bar, coeff: r.fugacityCoefficient,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="CO2 partial pressure, the total times the mole fraction" value={six(row.pco2Bar)} unit="bar" />
        <Tile label="Fugacity coefficient, the correction" value={six(row.fugacityCoefficient)} />
        <Tile label="CO2 fugacity, and THIS is what drives the rate" value={six(row.fco2Bar)} unit="bar" />
        <Tile label="Pressure cap applied" value={String(row.pressureCapApplied)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Read the first three tiles left to right. The partial pressure is bookkeeping over the stream. The coefficient is
        a correction that falls below one as the pressure rises. The fugacity is their product, and it is the one of the
        three that enters the rate correlation. At the shipped studio defaults the three read {six(f.appPco2Bar)} bar,
        {' '}{six(f.appCoefficient)} and {six(f.appFco2Bar)} bar.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="p" tick={AXIS} label={{ value: 'total pressure, bar', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={f.capBar} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: 'cap', fill: '#fbbf24', fontSize: 10 }} />
            <Line dataKey="pco2" name="CO2 partial pressure, bar" stroke={SERIES[0]} dot={false} isAnimationActive={false} />
            <Line dataKey="fco2" name="CO2 fugacity, bar" stroke={SERIES[1]} dot={false} isAnimationActive={false} />
            <Line dataKey="coeff" name="fugacity coefficient" stroke={SERIES[2]} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['total pressure bar', 'coefficient', 'CO2 partial pressure bar', 'CO2 fugacity bar', 'cap applied']}
        rows={f.sweep.map((r) => [six(r.pTotalBar), six(r.fugacityCoefficient), six(r.pco2Bar), six(r.fco2Bar), String(r.pressureCapApplied)])}
      />
      <Note>
        The cap is REPORTED rather than applied in silence. At {six(f.belowCapBar)} bar the coefficient is
        {' '}{six(f.belowCapCoefficient)} and the flag reads {String(f.belowCapApplied)}. At {six(f.aboveCapBar)} bar the
        coefficient is {six(f.aboveCapCoefficient)}, identical to its value at the cap, and the flag reads
        {' '}{String(f.aboveCapApplied)}. The engine returns this note with it:
      </Note>
      <Quote>{f.capNote}</Quote>
      <Held>
        The {six(f.capBar)} bar pressure cap, and what the published correlation does above it. The engine holds the
        coefficient flat and declares that it is doing so, which is a stated convention rather than a prediction. No
        graded field in this course sits above the cap.
      </Held>
    </>
  );
};

export const SourMode = ({ h, w }) => {
  if (!h || !w) return <Note>The sour reader did not return a comparison.</Note>;
  const chart = h.rows.map((r) => ({
    bar: r.ph2sBar, decades: r.decadesAboveThreshold, psia: r.ph2sPsia,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="H2S partial pressure at the studio defaults" value={six(w.ph2sBar)} unit="bar" />
        <Tile label="The same, by the engine's exact bar to psia factor" value={six(w.ph2sPsia)} unit="psia" />
        <Tile label="The screening threshold" value={twelve(h.thresholdBar)} unit="bar" />
        <Tile label="Decades above the threshold" value={six(w.decadesAboveThreshold)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        This door compares one partial pressure against one threshold and reports the comparison in two units. The
        threshold in psia is {twelve(h.thresholdPsia)}, derived by the engine rather than rounded, and a learner who has
        seen a round 0.05 psia in a hint has seen a different number.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="bar" scale="log" domain={['auto', 'auto']} tick={AXIS} label={{ value: 'H2S partial pressure, bar', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: 'the threshold', fill: '#fbbf24', fontSize: 10 }} />
            <Line dataKey="decades" name="decades above the threshold" stroke={SERIES[0]} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['H2S partial pressure bar', 'psia', 'above the threshold', 'decades above', 'label']}
        rows={h.rows.map((r) => [twelve(r.ph2sBar), twelve(r.ph2sPsia), String(r.sour), six(r.decadesAboveThreshold), r.label])}
      />
      <Note>
        At zero H2S the decade count is {String(h.zeroDecades)} rather than minus infinity, and the sour flag is
        {' '}{String(h.zeroSour)}. The logarithm of zero is not a screening result. The engine's own note above the
        threshold reads:
      </Note>
      <Quote>{h.aboveNote}</Quote>
      <Held>
        The VALUE of the screening threshold. The engine declares it held in a returned field, `thresholdHeld`, which
        reads {String(h.thresholdHeld)}. It is not sourced anywhere in this repository, and the repair kept it exactly
        where it was rather than moving a live number without a source.
      </Held>
    </>
  );
};

export const RatioMode = ({ g }) => {
  if (!g) return <Note>The regime reader did not return a ratio.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Carbonate boundary, as an H2S to CO2 ratio" value={twelve(g.carbonateBoundary)} />
        <Tile label="Mixed boundary, as the same ratio" value={twelve(g.mixedBoundary)} />
        <Tile label="Answers the door can give" value={g.regimeWords.join(', ')} />
        <Tile label="Ratio at the sour teaching stream" value={twelve(g.diebuRatio)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        THE RATIO NEEDS NO PRESSURE AT ALL. Both arguments are partial pressures, both are the total pressure times a
        mole fraction, so the total pressure divides out and the ratio equals the ratio of the mole fractions at every
        pressure. The difference column below is zero at each of five pressures, which is the whole claim.
      </p>
      <Tbl
        head={['total pressure bar', 'ratio from partial pressures', 'ratio from mole fractions', 'difference']}
        rows={g.pressureFree.map((r) => [six(r.pTotalBar), twelve(r.ratioFromPartials), twelve(r.ratioFromMoles), r.difference === 0 ? '0' : r.difference.toExponential(3)])}
      />
      <Tbl
        head={['CO2 mol fraction', 'H2S mol fraction', 'ratio', 'regime', 'does the CO2 rate model apply', 'upper bound']}
        rows={g.regimeRows.map((r) => [
          six(r.co2MolFrac), six(r.h2sMolFrac), r.ratio === null ? 'none' : twelve(r.ratio),
          r.regime, String(r.rateApplies), String(r.rateIsUpperBound),
        ])}
      />
      <Note>
        In the sulphide regime the engine withholds the band label and the remaining life and keeps its rate only as a
        stated upper bound of {six(g.diebuUpperBoundMmYr)} mm/yr. Its own words:
      </Note>
      <Quote>{g.diebuWhy}</Quote>
      <Held>
        BOTH transition ratios. The carbonate boundary and the mixed boundary are unsourced numbers, so the WORD this
        door returns moves with two figures nobody in this repository can check. Read the ratio, and read the word as a
        label over it.
      </Held>
    </>
  );
};

export const AbsentMode = ({ w, f }) => {
  if (!w || !f) return <Note>The withdrawal reader did not return its fields.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="regionProvided" value={String(w.regionProvided)} />
        <Tile label="materialGuidanceProvided" value={String(w.materialGuidanceProvided)} />
        <Tile label="thresholdHeld" value={String(w.thresholdHeld)} />
        <Tile label="ph2sFugacityApplied" value={String(f.ph2sFugacityApplied)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        THESE FOUR ARE FIELDS AND NOT GAPS. An earlier version of this engine computed a sour-service severity region
        from an expression of its own invention, labelled it with the names of two standards, and served three named
        material recommendations off it. The repair did not retune that expression. It withdrew the claim, and the
        engine now returns the first two fields above as false on every call, so a caller cannot read the absence as an
        unset property.
      </p>
      <Tbl
        head={['field', 'value', 'what it means']}
        rows={[
          ['ph2sBar', six(w.ph2sBar), 'the H2S partial pressure, the total pressure times the mole fraction'],
          ['ph2sPsia', six(w.ph2sPsia), 'the same, by a factor exact by the definition of the bar'],
          ['thresholdBar', six(w.thresholdBar), 'the screening threshold, whose VALUE is held'],
          ['thresholdPsia', twelve(w.thresholdPsia), 'the same threshold, derived rather than rounded'],
          ['sour', String(w.sour), 'above the threshold or below it, and nothing more'],
          ['regionProvided', String(w.regionProvided), 'declared false today, permanently'],
          ['materialGuidanceProvided', String(w.materialGuidanceProvided), 'the same for the material recommendation'],
          ['label', w.label, 'the whole verdict, in words'],
        ]}
      />
      <Absent>
        No severity region, no material selection, no hardness limit, no weldment qualification, no sulphide stress
        cracking criterion and no hydrogen induced cracking criterion. All of that needs the standard, and the standard
        is not in this repository. The fourth tile is a separate statement of the same kind: the engine applies no
        fugacity correction to H2S at any pressure, and it says so in a field rather than leaving it to be inferred.
      </Absent>
      <Held>
        The threshold VALUE, and both H2S to CO2 transition ratios. Three unsourced numbers decide a flag, a word and a
        coloured label, and none of the three is graded anywhere in this course.
      </Held>
    </>
  );
};

const ChemistryExplorer = ({ initialMode = 'fugacity' }) => {
  const [mode, setMode] = useState(initialMode);
  const [pressure, setPressure] = useState(String(PRESSURE_SWEEP[3]));

  const f = useMemo(() => safe(fugacityAndPartialPressure), []);
  const h = useMemo(() => safe(h2sThreshold), []);
  const g = useMemo(() => safe(whichFilmGoverns), []);
  const w = useMemo(() => safe(theWithdrawal), []);

  return (
    <PanelShell
      title="Chemistry explorer"
      subtitle="What is in the stream, in the engine's own units: the CO2 partial pressure beside the coefficient and the fugacity, the H2S comparison in bar and in psia, the ratio that decides which film governs, and the two answers this door refuses to give."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        {mode === 'fugacity' && (
          <SelectField
            label="Total pressure, bar"
            value={pressure}
            onChange={setPressure}
            options={PRESSURE_SWEEP.map((p) => [String(p), `${p} bar`])}
          />
        )}
        {mode === 'ratio' && (
          <SelectField
            label="Mole fractions the sweep carries"
            value={String(REGIME_PAIRS.length)}
            onChange={() => {}}
            options={[[String(REGIME_PAIRS.length), `${REGIME_PAIRS.length} CO2 and H2S pairs`]]}
          />
        )}
      </FieldGrid>
      <div className="mt-3">
        {mode === 'fugacity' && <FugacityMode f={f} pressure={pressure} />}
        {mode === 'sour' && <SourMode h={h} w={w} />}
        {mode === 'ratio' && <RatioMode g={g} />}
        {mode === 'absent' && <AbsentMode w={w} f={f} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored Corrosion & Integrity engine on the teaching streams
        and the studio's shipped defaults, printed to the precision the teaching digest prints. Pressures are in bar and
        in psia, and every ratio is a plain number.
      </Note>
    </PanelShell>
  );
};

export default ChemistryExplorer;
