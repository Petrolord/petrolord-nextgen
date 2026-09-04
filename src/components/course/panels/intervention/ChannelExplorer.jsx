import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, ReferenceLine, ReferenceArea,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { channelExplorer } from './interventionLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Channel explorer, the Professional tier. THE WINDOWED READING.
//
// Four modes. The late window as a fraction of the history and where it
// actually starts; the two fits one classifier call returns and the derivative
// slope that decides between channelling and displacement, with the boundary
// and the band around it drawn on the chart; what removing skin is worth; and
// the treatment screening read as a set of GATES, with the gate that blocked
// each treatment and the reason it gave.
//
// Every figure on this page is a return value from interventionLab, which is a
// return value from the vendored intervention diagnostics engine. Nothing here
// classifies a history, fits a slope or scores a treatment. And every mechanism
// on this page carries the WINDOW that produced it, because on this history the
// window and not the data is what moves the verdict.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const tiny = (v) => {
  if (!Number.isFinite(v)) return '-';
  if (v === 0) return '0';
  return Math.abs(v) < 0.0005 ? v.toExponential(3) : fmt(v, 8);
};

const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['window', 'The late window: how much of the history, and where it starts'],
  ['reading', 'Two fits, one boundary, and the band around it'],
  ['worth', 'What removing skin is worth'],
  ['gates', 'Seven treatments, and the gate that decided each one'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

// --------------------------------------------------------------------------

const Window = () => {
  const [fraction, setFraction] = useState('0.5');
  const data = useMemo(() => {
    try {
      return {
        head: channelExplorer.headline(),
        samples: channelExplorer.samples(),
        sweep: channelExplorer.windowSweep(),
        thresholds: channelExplorer.thresholds(),
      };
    } catch { return null; }
  }, []);
  const chosen = useMemo(() => {
    try {
      return channelExplorer.diagnosis(Number(fraction));
    } catch { return null; }
  }, [fraction]);
  if (!data || !chosen) {
    return (
      <Note>
        A reading needs a history, not a handful of points. Six producing samples is the bare
        minimum the classifier accepts and a useful reading wants far more, so with a short series
        there is no window to place and nothing to show.
      </Note>
    );
  }
  const channelling = data.thresholds.find((t) => t.key === 'channellingSlope');
  const chart = data.samples.map((s) => ({
    tDays: s.tDays,
    ratio: s.ratio,
    inTheWindow: chosen.lateFromT !== null && s.tDays >= chosen.lateFromT ? s.ratio : null,
  }));
  return (
    <>
      <FieldGrid>
        <SelectField label="How much of the history counts as late" value={fraction} onChange={setFraction}
          options={data.sweep.map((r) => [String(r.lateFraction), `${r.lateFraction}${r.isDefault ? ', the engine default' : ''}`])} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="The dial, as handed in" value={fmt(chosen.lateFraction, 2)} />
          <Tile label="The window starts on day" value={fmt(chosen.lateFromT, 6)} />
          <Tile label="Samples in the window" value={fmt(chosen.lateSamples, 0)} />
          <Tile label="The window runs" value={fmt(chosen.windowRunsDecades, 6)} unit="log cycles" />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="tDays" type="number" scale="log" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'producing time, days', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis type="number" scale="log" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'water-oil ratio', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {chosen.lateFromT !== null && (
              <ReferenceLine x={chosen.lateFromT} stroke="#f97316" strokeDasharray="4 4" />
            )}
            <Line type="monotone" dataKey="ratio" name="the whole history" stroke="#475569" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="inTheWindow" name="the late window the reading uses" stroke="#BFFF00" dot connectNulls={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE READING IS MADE ON THE LATE PART OF THE HISTORY, AND HOW MUCH OF IT IS AN INPUT. Early
        data is dominated by cleanup and by whatever the well was doing before it settled, so the
        mechanisms only separate late. At {fmt(chosen.lateFraction, 2)} the window starts on day
        {' '}{fmt(chosen.lateFromT, 6)} and holds {fmt(chosen.lateSamples, 0)} of the
        {' '}{fmt(data.head.sampleCount, 0)} samples, of which
        {' '}{fmt(chosen.latePositiveDerivatives, 0)} have a positive derivative and
        {' '}{fmt(chosen.lateNegativeDerivatives, 0)} do not. The verdict that comes out is
        {' '}{chosen.mechanismLabel || 'nothing'} at {chosen.confidence} confidence, on a
        derivative slope of {fmt(chosen.derivativeSlope, 9)} against the channelling THRESHOLD of
        {' '}{fmt(chosen.channellingThreshold, 2)}, a margin of {fmt(chosen.marginToThreshold, 9)}.
        THE DIAL HAS A DEFAULT AND NO GUIDANCE ANYWHERE. There is no sweep helper in the module and
        nothing in the return object names its effect, so the table below is this course putting
        one there.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the dial</th>
              <th className="text-left pr-3">window starts, days</th>
              <th className="text-left pr-3">samples</th>
              <th className="text-left pr-3">of which the derivative is positive</th>
              <th className="text-left pr-3">of which it is negative</th>
              <th className="text-left pr-3">derivative slope</th>
              <th className="text-left pr-3">threshold</th>
              <th className="text-left pr-3">margin</th>
              <th className="text-left">mechanism</th>
            </tr>
          </thead>
          <tbody>
            {data.sweep.map((r) => (
              <tr key={r.lateFraction}>
                <td className="pr-3">{fmt(r.lateFraction, 2)}{r.isDefault ? ' (default)' : ''}</td>
                <td className="pr-3">{fmt(r.lateFromT, 6)}</td>
                <td className="pr-3">{fmt(r.lateSamples, 0)}</td>
                <td className="pr-3">{fmt(r.latePositiveDerivatives, 0)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.lateNegativeDerivatives, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.derivativeSlope, 9)}</td>
                <td className="pr-3">{fmt(r.channellingThreshold, 2)}</td>
                <td className="pr-3">{fmt(r.marginToThreshold, 9)}</td>
                <td className={r.mechanismId === 'channelling' ? '' : 'text-[#f97316]'}>{r.mechanismLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The window is placed by index and not by time: the classifier cuts the sorted samples at a
        position and reads from there, so a history sampled unevenly gives a window whose LENGTH IN
        DAYS depends on how the data was collected rather than on the reading. Above
        {' '}{fmt(channelling ? channelling.value : null, 2)} on the derivative slope the reading
        says channelling and a shutoff squeeze becomes a candidate; below it the same well is
        blocked. That is the whole spend, decided on one comparison.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Reading = () => {
  const data = useMemo(() => {
    try {
      return {
        diagnosis: channelExplorer.diagnosis(0.5),
        two: channelExplorer.twoWindows(0.5),
        sweep: channelExplorer.windowSweep(),
        bands: channelExplorer.bands(),
        thresholds: channelExplorer.thresholds(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.diagnosis.ok) {
    return (
      <Note>
        A reading that cannot be made comes back as a finding rather than as a number: the
        classifier returns an indeterminate mechanism with the reason, and that is an answer. It
        says do not spend money on a treatment chosen by guesswork.
      </Note>
    );
  }
  const d = data.diagnosis;
  const chart = data.sweep.map((r) => ({
    lateFraction: r.lateFraction,
    derivativeSlope: r.derivativeSlope,
    ratioSlope: r.worSlope,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="The ratio slope" value={fmt(d.worSlope, 9)} />
        <Tile label="The derivative slope, which decides" value={fmt(d.derivativeSlope, 9)} />
        <Tile label="The channelling threshold" value={fmt(d.channellingThreshold, 2)} />
        <Tile label="Margin to that threshold" value={fmt(d.marginToThreshold, 9)} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="lateFraction" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'how much of the history counts as late', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'log-log slope', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceArea y1={data.bands.lower} y2={data.bands.upper} fill="#f97316" fillOpacity={0.12} />
            <ReferenceLine y={data.bands.channellingThreshold} stroke="#f97316" strokeDasharray="4 4" />
            <ReferenceLine y={data.bands.coningThreshold} stroke="#38bdf8" strokeDasharray="2 4" />
            <Line type="monotone" dataKey="derivativeSlope" name="derivative slope, which decides" stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="ratioSlope" name="ratio slope, which does not" stroke="#94a3b8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE TWO LINES ON THAT CHART ARE THE BOUNDARIES AND THE SHADED STRIP IS THE BAND AROUND ONE
        OF THEM. At or below {fmt(data.bands.coningThreshold, 2)} the derivative is FALLING, which
        is the coning signature: the ratio has stopped climbing because the cone has reached the
        perforations and stopped growing. A falling derivative is qualitatively different from a
        rising one and the sign carries the distinction, so that threshold barely matters. At or
        above {fmt(data.bands.channellingThreshold, 2)} the climb is distinctly faster than
        proportional, which is channelling. That is the SOFT end of the reading and it is worth
        being blunt about why: for any power law history the ratio and its derivative have the SAME
        log-log slope, so the two pictures cannot be separated by comparing them to each other, and
        the only thing that separates ordinary displacement from channelling is HOW STEEP the climb
        is. Steady arrival sits around a slope of one. The shaded strip runs from
        {' '}{fmt(data.bands.lower, 6)} to {fmt(data.bands.upper, 6)}, a width of
        {' '}{fmt(data.bands.width, 6)}, and anything inside it is reported as close to the
        boundary rather than resolved.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">one call returns both of these</th>
              <th className="text-left pr-3">samples it used</th>
              <th className="text-left pr-3">log cycles it sat on</th>
              <th className="text-left pr-3">slope</th>
              <th className="text-left">fit quality, as a fraction</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-3">the RATIO fit, over every late sample</td>
              <td className="pr-3">{fmt(data.two.ratioFitSamples, 0)}</td>
              <td className="pr-3">{fmt(data.two.ratioFitSpanDecades, 9)}</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(data.two.ratioSlope, 9)}</td>
              <td>{fmt(data.two.ratioR2Fraction, 9)}</td>
            </tr>
            <tr>
              <td className="pr-3">the DERIVATIVE fit, over the late samples whose derivative is positive</td>
              <td className="pr-3">{fmt(data.two.derivativeFitSamples, 0)}</td>
              <td className="pr-3">{fmt(data.two.derivativeFitSpanDecades, 9)}</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(data.two.derivativeSlope, 9)}</td>
              <td>{fmt(data.two.derivativeR2Fraction, 9)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THEY COME BACK SIDE BY SIDE AND NOTHING IN THE OBJECT SAYS THEY WERE MEASURED ON DIFFERENT
        DATA. The derivative fit is {fmt(data.two.samplesShort, 0)} samples short of the ratio fit
        and {fmt(data.two.decadesShort, 9)} of a log cycle short of the window it is describing,
        and the field the engine calls the span describes the SECOND window only while being named
        as though it described the reading. The two slopes differ by
        {' '}{fmt(data.two.slopeGap, 9)}. Only the second of them decides anything.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">threshold</th>
              <th className="text-left pr-3">value</th>
              <th className="text-left">what it is for</th>
            </tr>
          </thead>
          <tbody>
            {data.thresholds.map((t) => (
              <tr key={t.key}>
                <td className="pr-3">{t.key}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(t.value, 6)}</td>
                <td>{t.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        WHAT THE ENGINE SAID, IN ITS OWN WORDS, AT A WINDOW OF {fmt(d.lateFraction, 2)} STARTING ON
        DAY {fmt(d.lateFromT, 6)}:
      </div>
      <ul className="mt-1 text-xs text-slate-400 list-disc pl-5 space-y-1">
        {d.notes.map((n) => (<li key={n.slice(0, 40)}>{n}</li>))}
      </ul>
      <Note>
        The mechanism is {d.mechanismLabel} at {d.confidence} confidence, flagged close to the
        boundary {yn(d.ambiguous)}, and it is treatable {yn(d.treatable)}. That last column is the
        one the money turns on: channelling is plumbing and plumbing can be sealed, coning is not
        and cannot, and the two need OPPOSITE treatments. A planner who recommends a squeeze
        without the diagnosis is wrong about half the time.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Worth = () => {
  const [which, setWhich] = useState('published');
  const data = useMemo(() => {
    try {
      return {
        published: channelExplorer.publishedSkin(),
        identity: channelExplorer.identity(),
        oneUnit: channelExplorer.oneUnit(),
        acid: channelExplorer.acid(),
        geometry: channelExplorer.teachingGeometry(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.acid.ok) {
    return (
      <Note>
        A productivity multiplier is a ratio of two pseudo steady state denominators and nothing
        more, so it refuses whenever either denominator is at or below zero. That refusal comes
        back as an object carrying a reason rather than as a number, and there is no multiplier to
        show.
      </Note>
    );
  }
  const chart = which === 'published'
    ? data.published.map((r) => ({ x: r.index, published: r.publishedMultiplier, engine: r.engineMultiplier }))
    : data.oneUnit.map((r) => ({ x: r.skinBefore, engine: r.multiplier, published: null }));
  const label = which === 'published' ? 'published case' : 'skin before, one unit removed';
  return (
    <>
      <FieldGrid>
        <SelectField label="Sweep" value={which} onChange={setWhich}
          options={[
            ['published', 'The five published before and after pairs'],
            ['oneunit', 'The same one unit of skin, removed from different starting points'],
          ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="The teaching acid job, skin 7.5 down to -2.2" value={fmt(data.acid.multiplier, 9)} unit="times" />
          <Tile label="Denominator before" value={fmt(data.acid.denominatorBefore, 9)} />
          <Tile label="Denominator after" value={fmt(data.acid.denominatorAfter, 9)} />
          <Tile label="Flow efficiency after" value={fmt(data.acid.flowEfficiencyAfter, 9)} />
        </TileGrid>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" tick={AXIS} interval={0} height={40}
              label={{ value: label, position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'productivity multiplier', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#f97316" strokeDasharray="4 4" />
            <Bar dataKey="engine" name="the engine multiplier" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {which === 'published' ? (
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">case</th>
                <th className="text-left pr-3">skin before</th>
                <th className="text-left pr-3">skin after</th>
                <th className="text-left pr-3">published multiplier</th>
                <th className="text-left pr-3">engine multiplier</th>
                <th className="text-left pr-3">difference</th>
                <th className="text-left pr-3">flow efficiency before</th>
                <th className="text-left">flow efficiency after</th>
              </tr>
            </thead>
            <tbody>
              {data.published.map((r) => (
                <tr key={r.index}>
                  <td className="pr-3">{fmt(r.index, 0)}</td>
                  <td className="pr-3">{fmt(r.skinBefore, 2)}</td>
                  <td className="pr-3">{fmt(r.skinAfter, 2)}</td>
                  <td className="pr-3">{fmt(r.publishedMultiplier, 9)}</td>
                  <td className="pr-3 text-[#BFFF00]">{fmt(r.engineMultiplier, 9)}</td>
                  <td className="pr-3">{tiny(r.difference)}</td>
                  <td className="pr-3">{fmt(r.flowEfficiencyBefore, 9)}</td>
                  <td>{fmt(r.flowEfficiencyAfter, 9)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">skin before</th>
                <th className="text-left pr-3">skin after</th>
                <th className="text-left pr-3">multiplier</th>
                <th className="text-left">uplift, percent</th>
              </tr>
            </thead>
            <tbody>
              {data.oneUnit.map((r) => (
                <tr key={r.skinBefore}>
                  <td className="pr-3">{fmt(r.skinBefore, 2)}</td>
                  <td className="pr-3">{fmt(r.skinAfter, 2)}</td>
                  <td className="pr-3 text-[#BFFF00]">{fmt(r.multiplier, 9)}</td>
                  <td>{fmt(r.upliftPct, 6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 text-xs text-slate-300">
        NO CORRELATION, NO TYPE CURVE, NO RULE OF THUMB. The multiplier is a ratio of two
        denominators and it falls straight out of radial Darcy flow, which is why the first gate on
        it is that it is EXACTLY {fmt(data.identity.multiplier, 9)} when the skin does not change,
        to a departure of {tiny(data.identity.departureFromOne)}: it is one number divided by
        itself. The oracle checks it a completely different way, by building a full radial Darcy
        rate in SI with permeability in square metres and pressures in pascals and dividing two
        real flow rates, and the two agree on all five published pairs. AND THIS IS WHY A
        STIMULATION IS WORTH SO LITTLE ON A WELL THAT WAS NEVER DAMAGED. The same one unit of skin
        removed is worth {fmt(data.oneUnit[data.oneUnit.length - 1].upliftPct, 6)} percent taken
        from a skin of {fmt(data.oneUnit[data.oneUnit.length - 1].skinBefore, 0)} and only
        {' '}{fmt(data.oneUnit[0].upliftPct, 6)} percent taken from a skin of
        {' '}{fmt(data.oneUnit[0].skinBefore, 0)}. The group adds the skin undivided, so what
        matters is how large the denominator already was.
      </div>
      <Note>
        On the teaching geometry, a drainage radius of {fmt(data.geometry.reFt, 0)} ft and a
        wellbore radius of {fmt(data.geometry.rwFt, 4)} ft, the designed acid job takes the skin
        from {fmt(data.acid.skinBefore, 2)} to {fmt(data.acid.skinAfter, 2)} and the productivity
        index by {fmt(data.acid.multiplier, 9)}. The floor this geometry allows is
        {' '}{fmt(data.acid.minimumSkin, 9)}, and the engine returns that floor inside every
        successful result and then compares it against nothing but zero. What that costs is the
        Expert tier.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Gates = () => {
  const [source, setSource] = useState('water050');
  const [sweep, setSweep] = useState('water');
  const data = useMemo(() => {
    try {
      return {
        gates: channelExplorer.gates(),
        water: channelExplorer.waterGate(),
        gas: channelExplorer.gasGate(),
        limits: channelExplorer.limits(),
      };
    } catch { return null; }
  }, []);
  const screening = useMemo(() => {
    try {
      return {
        rows: channelExplorer.screening(source),
        head: channelExplorer.screeningHeadline(source),
      };
    } catch { return null; }
  }, [source]);
  if (!data || !screening) {
    return (
      <Note>
        The screening reads a well row and a diagnosis. With no diagnosis at all it still answers,
        and the answer on the water shutoff is a BLOCK with a reason: the mechanism has not been
        established, and a shutoff squeeze on a coning well is money down a hole. That refusal is
        the module at its best.
      </Note>
    );
  }
  const rows = screening.rows;
  const head = screening.head;
  const sweepRows = sweep === 'water' ? data.water : data.gas;
  return (
    <>
      <FieldGrid>
        <SelectField label="Which diagnosis the screening is handed" value={source} onChange={setSource}
          options={[
            ['water050', 'The water history at the default window'],
            ['water090', 'The same water history at a window of 0.9'],
            ['gasNull', 'The gas history, whose derivative column was never computed'],
            ['none', 'No diagnosis at all'],
          ]} />
        <SelectField label="Gate to sweep" value={sweep} onChange={setSweep}
          options={[['water', 'The water cut gate'], ['gas', 'The gas-oil ratio gate']]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Treatments screened" value={fmt(head.treatmentCount, 0)} />
          <Tile label="Candidates" value={fmt(head.candidates, 0)} />
          <Tile label="Blocked with a reason" value={fmt(head.blocked, 0)} />
          <Tile label="That read the diagnosis at all" value={fmt(head.readTheDiagnosis, 0)} />
        </TileGrid>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE DIAGNOSIS IN CHARGE OF THIS SCREENING IS {head.sourceLabel.toUpperCase()}. It reads
        mechanism {head.mechanismLabel || 'none'} at {head.confidence} confidence, on a window
        starting day {fmt(head.lateFromT, 6)}. The WELL ROW never changes: the same skin, the same
        water cut, the same gas-oil ratio and the same geometry go in every time. Everything that
        moves below is the diagnosis moving.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">rank</th>
              <th className="text-left pr-3">treatment</th>
              <th className="text-left pr-3">verdict</th>
              <th className="text-left pr-3">the gate that decided it</th>
              <th className="text-left pr-3">reads the diagnosis</th>
              <th className="text-left">blocked, and why</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{fmt(r.rank, 0)}</td>
                <td className="pr-3">{r.label}</td>
                <td className={r.blocked ? 'pr-3 text-[#f97316]' : 'pr-3 text-[#BFFF00]'}>{r.verdict}</td>
                <td className="pr-3">{r.gate}</td>
                <td className="pr-3">{yn(r.readsTheDiagnosis)}</td>
                <td>{r.blockReason || 'not blocked'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="rounded-md border border-slate-700 bg-[#0F172A] p-3">
            <p className="text-xs text-white font-medium mb-1">
              {r.label}: {r.verdict}, on {r.gate}
            </p>
            <p className="text-[11px] text-slate-400 mb-1">{r.gateDescription}</p>
            <ul className="text-[11px] text-slate-300 list-disc pl-5 space-y-1">
              {r.reasons.map((x) => (<li key={x.slice(0, 40)}>{x}</li>))}
              {r.blockReason && (<li className="text-[#f97316]">{r.blockReason}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-slate-300">
        EVERY VERDICT CARRIES ITS REASONS IN FULL, and that is a design decision rather than an
        omission. A score with the reasoning folded into it is a number nobody can argue with, and
        the arguing is the point: an intervention is somebody else money. Of the
        {' '}{fmt(head.treatmentCount, 0)} treatments only {fmt(head.readTheDiagnosis, 0)} read the
        diagnosis at all; the other {fmt(head.neverReadTheDiagnosis, 0)} are decided on the well
        row alone. Ranked, this screening reads: {head.rankedOrder.join(', ')}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">{sweep === 'water' ? 'water cut, percent' : 'gas-oil ratio, scf/stb'}</th>
              <th className="text-left pr-3">{sweep === 'water' ? 'water shutoff verdict' : 'gas shutoff verdict'}</th>
              <th className="text-left pr-3">{sweep === 'water' ? 'blocked' : 'ratio to expected'}</th>
              <th className="text-left pr-3">reasons given</th>
              <th className="text-left">this is the teaching well</th>
            </tr>
          </thead>
          <tbody>
            {sweepRows.map((r, i) => (
              <tr key={`${sweep}-${i}`}>
                <td className="pr-3">{fmt(sweep === 'water' ? r.wctPct : r.gorScfStb, 4)}</td>
                <td className="pr-3 text-[#BFFF00]">{sweep === 'water' ? r.waterShutoffVerdict : r.verdict}</td>
                <td className="pr-3">{sweep === 'water' ? yn(r.blocked) : fmt(r.ratioToExpected, 9)}</td>
                <td className="pr-3">{fmt(sweep === 'water' ? r.waterReasonCount : r.reasonCount, 0)}</td>
                <td>{yn(r.isTheTeachingWell)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A GATE FIRES BEFORE THE THING BEHIND IT IS EVER READ, AND EVERY GATE IS A THRESHOLD. Below
        a threshold of 30 percent water there is no water problem worth an intervention whatever
        the diagnosis says, and the mechanism is never consulted. The gas gate is a threshold too,
        a factor of two on the expected ratio and nothing else, and the diagnosis is never
        consulted there either. Order matters: a verdict that looks like a judgement about a
        mechanism is often a judgement about a water cut that stopped the mechanism being read at
        all.
      </div>
      <Note>
        What this screening does not do: {data.limits.join(' ')}
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const ChannelExplorer = ({ initialMode = 'reading' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Channel explorer"
      subtitle="The windowed reading: how much of the history counts as late and where that window starts, the two fits one classifier call returns with the boundary and the band around it drawn on the chart, what removing skin is worth, and the seven treatments read as a set of gates"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'window' && <Window />}
        {mode === 'reading' && <Reading />}
        {mode === 'worth' && <Worth />}
        {mode === 'gates' && <Gates />}
      </div>
    </PanelShell>
  );
};

export default ChannelExplorer;
