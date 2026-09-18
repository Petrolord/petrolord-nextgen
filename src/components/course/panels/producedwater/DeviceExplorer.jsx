import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ReferenceLine, ReferenceArea,
} from 'recharts';
import {
  kokori, theEnvelope, linerBankAt, flotationKinetics, twoKindsOfCell, theBed, bedAt, heldItems,
  DECLARED, KOKORI_FILTER, KOKORI_BWPD,
} from './producedWaterLab';
import { Refusal, Warning } from './WaterExplorer';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// The device explorer, the Professional tier. The three devices whose cut size
// does not come from gravity alone.
//
// TWO CONTROLS ON THIS PAGE ARE DRAGGABLE, and each exists because the old
// screen could not show what it does.
//
// THE LINER SWEEP TURNS OVER. Below a certain bank the cut size stops improving
// and starts getting worse, because the field stops rising at the top of the
// operating envelope while the inlet shear penalty keeps climbing. A panel that
// plotted only the sensible range would have removed the one thing this tier
// exists to teach, so the chart runs past the envelope and into the refusal,
// and the refusal is drawn as a refusal.
//
// THE BED AREA REFUSAL ARRIVES WHILE YOU DRAG. Widening a bed lowers its loading
// rate, and under the declared floor this module stops answering and names the
// bed that would run the flow at the floor. Before FC7-1 the same slider moved
// nothing at all below that rate and the screen said so nowhere.
//
// Every figure on this page is a return value from producedWaterLab, which is a
// return value from the vendored engine on the teaching stream KOKORI. Nothing
// here computes a cut size, nothing imports an engine, and nothing reads a clock.
//
// NO P LABEL. Nothing here is a distribution a percentile would describe.
//
// COPY RULE: no em dash and no en dash anywhere a learner reads.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');

export const MODES = [
  ['liners', 'The liner sweep: the envelope, the ceiling on the field, the shear penalty and the refusal'],
  ['flotation', 'The flotation chain: gas rate to bubble size to holdup to cut, with the two presets'],
  ['bed', 'The bed against depth, grain size and loading, and the floor it refuses below'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const SERIES = ['#38bdf8', '#f472b6', '#BFFF00', '#fbbf24', '#a78bfa'];

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

/** The one kind of control this course needs: a value a learner drags. */
const Slider = ({
  label, value, min, max, step, onChange, unit,
}) => (
  <label className="block">
    <span className="block text-[11px] uppercase tracking-wide text-slate-500 mb-1">
      {label}: <span className="text-slate-200 normal-case tracking-normal">{value}{unit ? ` ${unit}` : ''}</span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-[#BFFF00]"
    />
  </label>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const LinerMode = ({ s, ko, nLiners, setLiners }) => {
  if (!s || !ko) return <Note>The liner reader did not return a sweep.</Note>;
  const here = safe(() => linerBankAt(ko.q, nLiners, ko.fluid));
  // THE CHART RUNS PAST THE ENVELOPE AND INTO THE REFUSAL. A refused bank has no
  // cut size, so its point is absent from the cut series and present in the
  // refused band underneath, which is how a refusal is drawn as a refusal.
  const counts = [];
  for (let n = 100; n <= 640; n += 10) counts.push(n);
  const chart = counts.map((n) => {
    const r = safe(() => linerBankAt(ko.q, n, ko.fluid));
    if (!r) return { n };
    return {
      n,
      cut: r.refused ? null : r.d50cMicron,
      ideal: r.refused ? null : r.idealD50cMicron,
      refusedBand: r.refused ? 1 : null,
    };
  });
  const answering = chart.filter((p) => p.cut !== null && p.cut !== undefined);
  const refusedCounts = chart.filter((p) => p.refusedBand).map((p) => p.n);
  return (
    <>
      <FieldGrid>
        <Slider label="Liner count" value={nLiners} min={100} max={640} step={1} onChange={setLiners} unit="liners" />
      </FieldGrid>
      {here && here.refused ? (
        <Refusal
          label={`The engine refuses a bank of ${nLiners} liners on this flow`}
          message={here.error}
        />
      ) : (
        <>
          <TileGrid>
            <Tile label="Turndown" value={six(here ? here.turndownRatio : NaN)} unit="times design" />
            <Tile label="Field" value={six(here ? here.gField : NaN)} unit="g" />
            <Tile label="Shear penalty" value={six(here ? here.shearPenalty : NaN)} />
            <Tile label="Cut size" value={six(here ? here.d50cMicron : NaN)} unit="micron" />
          </TileGrid>
          {here && here.warning !== 'none' && (
            <Warning>
              The engine warns that this bank is {here.warning}. A warning withholds nothing: the cut size beside it is
              the engine&apos;s answer, and the warning says what it judged against.
            </Warning>
          )}
        </>
      )}
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="n" tick={AXIS} label={{ value: 'liners in the bank', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} label={{ value: 'cut micron', angle: -90, fill: '#94a3b8', fontSize: 11, position: 'insideLeft' }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {refusedCounts.length > 0 && (
              <ReferenceArea
                x1={Math.min(...refusedCounts)}
                x2={Math.max(...refusedCounts)}
                fill="#7f1d1d"
                fillOpacity={0.35}
                label={{ value: 'REFUSED', fill: '#fca5a5', fontSize: 11 }}
              />
            )}
            <ReferenceLine x={nLiners} stroke="#BFFF00" strokeDasharray="4 4" />
            <Line dataKey="cut" name="reported cut, micron" stroke={SERIES[2]} dot={false} connectNulls={false} isAnimationActive={false} />
            <Line dataKey="ideal" name="ideal cut before the shear penalty, micron" stroke={SERIES[0]} dot={false} connectNulls={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Read that curve from the right. Taking liners out of the bank improves the cut for a while and then it turns
        over, and the finest cut in the published sweep is at {s.best.nLiners} liners rather than at the smallest bank.
        The smallest bank in the sweep, {s.fewest.nLiners} liners, cuts {six(s.fewestOverBest)} times worse. Two things
        put the ceiling there: the field stops rising past {s.overloadTurndown} times design, so it cannot exceed
        {' '}{six(s.fieldCeiling)} g, and above the envelope the cut carries the root of the overload as an inlet shear
        penalty, which is the gap between the two lines. Past {s.maxTurndown} times design the module stops answering.
      </Note>
      <Tbl
        head={['liners', 'turndown', 'field g', 'shear penalty', 'ideal cut micron', 'cut micron', 'warning']}
        rows={s.rows.map((r) => [String(r.nLiners), six(r.turndownRatio), six(r.gField), six(r.shearPenalty), six(r.idealD50cMicron), six(r.d50cMicron), r.warning])}
      />
      {s.refusals.map((r) => (
        <Refusal key={r.label} label={`The engine refuses ${r.label}`} message={r.error} />
      ))}
      <Warning>
        And at the other end, a bank running at {six(s.starved.turndownRatio)} of design still answers, with a cut of
        {' '}{six(s.starved.d50cMicron)} micron and this warning from the engine: {s.starved.warning}
      </Warning>
      <Note>
        The starved warning and the overload warning are different statements. Starved is advice about how to run the
        bank you have. Overloaded says the number beside it is getting worse and that the bank is too small. The oracle
        fires droplets of the reported cut size from starting radii spread uniformly by area and counts how many reach
        the core: it comes out at {six(s.captureAtCut)} against the one half a cut size is defined as, which is a
        different method agreeing with the definition.
      </Note>
      <Held>
        The capture this model computes is an ideal. Field de-oilers are customarily credited with a coarser cut than
        this model gives, and no vendor performance curve exists in this repository to calibrate against. That is a
        statement about what the model leaves out rather than a number, and it belongs beside every cyclone cut size.
        The whole liner geometry with its rated field and design flow is declared and pinned rather than published.
      </Held>
    </>
  );
};

export const FlotationMode = ({ s, preset, setPreset }) => {
  if (!s) return <Note>The flotation reader did not return a chain.</Note>;
  const bubbles = s.bubbles.map((r) => ({ b: r.bubbleMicron, cut: r.d50cMicron, holdup: r.gasHoldup }));
  const shown = preset === 'stream' ? null : s.presets.find((p) => p.name === preset);
  return (
    <>
      <FieldGrid>
        <SelectField
          label="Cell"
          value={preset}
          onChange={setPreset}
          options={[
            ['stream', 'The stream as it runs'],
            ...s.presets.map((p) => [p.name, `The ${p.name} preset`]),
          ]}
        />
      </FieldGrid>
      <TileGrid>
        <Tile label="Superficial gas velocity" value={twelve(shown ? shown.superficialGasMS : s.cell.superficialGasMS)} unit="m/s" />
        <Tile label="Bubble rise" value={twelve(s.cell.bubbleRiseMS)} unit="m/s" />
        <Tile label="Gas holdup" value={twelve(s.cell.gasHoldup)} />
        <Tile label="Cut size" value={six(shown ? shown.d50cMicron : s.cell.d50cMicron)} unit="micron" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Gas flotation carries droplets out rather than settling them, so the cut size is a rate question. Gas is fed at
        {' '}{s.gasRatio} times the water flow to each cell, the bubbles rise at Reynolds
        {' '}{six(s.cell.bubbleReynolds)} on the full drag balance, the swarm holdup is the gas velocity over the bubble
        velocity, capture is by interception at a rate constant of {twelve(s.cell.rateCoefficientPerSPerM2)} per second
        per square metre of droplet diameter, and the cut is the droplet for which the rate times the
        {' '}{six(s.cell.residenceS)} s of residence is the log of two.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={bubbles} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="b" tick={AXIS} label={{ value: 'bubble micron', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="cut" name="cut, micron" stroke={SERIES[2]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The cut goes as the bubble diameter to the three halves, because the rate carries the inverse cube of it and the
        cut is a square root of a rate. Finer bubbles cut finer, and that is the larger of the two engineering
        differences between an induced gas cell and a dissolved gas one: on the induced cell the dissolved bubble alone
        cuts {six(s.bubbleLever)} times finer, and the dissolved gas ratio alone cuts {six(s.gasLever)} times coarser. On these two presets the dissolved cell cuts {six(s.presets[0].d50cMicron / s.presets[1].d50cMicron)}
        {' '}times finer on {six(s.presets[1].gasRatio / s.presets[0].gasRatio)} times the gas.
      </Note>
      <Tbl
        head={['gas to water ratio', 'superficial gas m/s', 'holdup', 'cut micron', 'warning']}
        rows={s.gasRatios.map((r) => [String(r.gasRatio), twelve(r.superficialGasMS), twelve(r.gasHoldup), six(r.d50cMicron), r.warning])}
      />
      {s.refusals.map((r) => (
        <Refusal key={r.label} label={`The engine refuses ${r.label}`} message={r.error} />
      ))}
      <Tbl
        head={['cell m3', 'residence s', 'holdup', 'cut micron', 'warning']}
        rows={s.straddle.map((r) => [String(r.cellVolumeM3), six(r.residenceS), twelve(r.gasHoldup), six(r.d50cMicron), r.warning])}
      />
      <Warning>{s.straddle[1].message}</Warning>
      <Note>
        Those two published rows differ in the cell volume alone, and the cut size is the same number on both of them. A
        smaller cell is a shorter residence and a higher gas flux through a smaller plan area at the same time, so the
        cell volume cancels out of the cut entirely. The warning is a statement about the cell and about how little time
        the attachment process is being given, and the cut size beside it will not show it. The threshold it judged
        against is declared at {s.residenceWarnS} s and the warning quotes it, so a reader can disagree with it.
      </Note>
      <Tbl
        head={['cell depth m', 'plan area m2', 'superficial gas m/s', 'cut micron']}
        rows={s.depths.map((r) => [String(r.cellDepthM), six(r.planAreaM2), twelve(r.superficialGasMS), six(r.d50cMicron)])}
      />
      <Held>
        The attachment efficiency, {DECLARED.attachmentEfficiency}, is the one calibration in this module and the one
        number in it with no derivation at all. It was chosen so a cell at the module&apos;s own defaults cuts in the
        range induced gas flotation is customarily credited with. It is an input, so a caller with a vendor curve can
        move it, and no graded answer in this course depends on it.
      </Held>
    </>
  );
};

export const BedMode = ({
  s, ko, areaM2, setArea,
}) => {
  if (!s || !ko) return <Note>The bed reader did not return a sweep.</Note>;
  const here = safe(() => bedAt(ko.q, areaM2, {
    bedDepthM: KOKORI_FILTER.bedDepthM, mediaMicron: KOKORI_FILTER.mediaMicron,
  }));
  const areas = [];
  for (let a = 10; a <= 900; a += 10) areas.push(a);
  const chart = areas.map((a) => {
    const r = safe(() => bedAt(ko.q, a, {
      bedDepthM: KOKORI_FILTER.bedDepthM, mediaMicron: KOKORI_FILTER.mediaMicron,
    }));
    if (!r) return { a };
    return { a, cut: r.refused ? null : r.d50cMicron, refusedBand: r.refused ? 1 : null };
  });
  const refusedAreas = chart.filter((p) => p.refusedBand).map((p) => p.a);
  return (
    <>
      <FieldGrid>
        <Slider label="Bed area" value={areaM2} min={10} max={900} step={5} onChange={setArea} unit="m2" />
      </FieldGrid>
      {here && here.refused ? (
        <Refusal
          label={`The engine refuses a ${areaM2} m2 bed on this flow`}
          message={here.error}
        />
      ) : (
        <TileGrid>
          <Tile label="Loading" value={six(here ? here.loadingMHr : NaN)} unit="m/hr" />
          <Tile label="Filter coefficient" value={twelve(here ? here.filterCoefficientPerM : NaN)} unit="per m" />
          <Tile label="Cut size" value={six(here ? here.d50cMicron : NaN)} unit="micron" />
          <Tile label="Bed that runs this flow at the floor" value={six(s.areaAtFloorM2)} unit="m2" />
        </TileGrid>
      )}
      {here && !here.refused && here.warning && <Warning>{here.warning}</Warning>}
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="a" tick={AXIS} label={{ value: 'bed area m2', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} label={{ value: 'cut micron', angle: -90, fill: '#94a3b8', fontSize: 11, position: 'insideLeft' }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {refusedAreas.length > 0 && (
              <ReferenceArea
                x1={Math.min(...refusedAreas)}
                x2={Math.max(...refusedAreas)}
                fill="#7f1d1d"
                fillOpacity={0.35}
                label={{ value: 'REFUSED', fill: '#fca5a5', fontSize: 11 }}
              />
            )}
            <ReferenceLine x={areaM2} stroke="#BFFF00" strokeDasharray="4 4" />
            <Line dataKey="cut" name="cut, micron" stroke={SERIES[2]} dot={false} connectNulls={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Drag that slider to the right and watch the refusal arrive. A wider bed is a lower loading rate, and under
        {' '}{s.minLoadingMHr} m/hr this module stops answering and says why: its filter coefficient is declared at one
        loading, {s.referenceLoadingMHr} m/hr, the loading exponent is the only velocity dependence in the model, and
        what a bed really does far below its design rate needs bed data this repository does not carry. The refusal
        names four things, and the last of them is the {six(s.areaAtFloorM2)} m2 bed that would run this flow at the
        floor, against the {s.installedAreaM2} m2 this stream actually runs.
      </Note>
      <Tbl
        head={['area m2', 'loading m/hr', 'lambda per m', 'cut micron', 'warning']}
        rows={s.loadings.map((r) => [String(r.areaM2), six(r.loadingMHr), twelve(r.filterCoefficientPerM), six(r.d50cMicron), r.warning])}
      />
      <Tbl
        head={['depth m', 'lambda per m', 'removal at the reference droplet percent', 'cut micron', 'cut times the root of the depth']}
        rows={s.depths.map((r) => [String(r.bedDepthM), twelve(r.filterCoefficientPerM), six(r.removalAtRefDropletPct), six(r.d50cMicron), six(r.cutTimesRootDepth)])}
      />
      <Note>
        The last column is constant, which says the cut goes as one over the root of the depth exactly. Across that
        sweep the depth moves the cut by a factor of {six(s.depthFactor)}. The cut size is an inversion of the same
        depth filtration law the removal comes from rather than a second opinion about it, and the engine says so on
        every return.
      </Note>
      <Tbl
        head={['media micron', 'lambda per m', 'cut micron', `lambda over the ${s.referenceMediaMicron} micron row`]}
        rows={s.grains.map((r) => [String(r.mediaMicron), twelve(r.filterCoefficientPerM), six(r.d50cMicron), six(r.overReference)])}
      />
      {s.floorRefusals.map((r) => (
        <Refusal key={r.label} label={`The engine refuses ${r.label}`} message={r.error} />
      ))}
      <Held>
        The grain size exponent. The last column above is the cube of the grain ratio, because both the number of
        collectors per unit volume and the interception efficiency of each one depend on the grain size. The
        interception derivation gives that cube, it is a strong dependence, and this repository carries no bed data to
        check it against. Treat the grain column as the model&apos;s statement rather than as a measurement. The
        reference triple itself, {s.referenceCoefficientPerM} per m at a {s.referenceDropletMicron} micron droplet,
        {' '}{s.referenceMediaMicron} micron media and {s.referenceLoadingMHr} m/hr, is declared, with no
        published source here, and the attachment efficiency is still the one calibration in this module.
      </Held>
    </>
  );
};

const DeviceExplorer = ({ initialMode = 'liners' }) => {
  const [mode, setMode] = useState(initialMode);
  const [nLiners, setLiners] = useState(200);
  const [areaM2, setArea] = useState(20);
  const [preset, setPreset] = useState('stream');
  const ko = useMemo(() => safe(kokori), []);
  const e = useMemo(() => (mode === 'liners' ? safe(theEnvelope) : null), [mode]);
  const f = useMemo(() => (mode === 'flotation' ? safe(flotationKinetics) : null), [mode]);
  const cells = useMemo(() => (mode === 'flotation' ? safe(twoKindsOfCell) : null), [mode]);
  const b = useMemo(() => (mode === 'bed' ? safe(theBed) : null), [mode]);
  const held = useMemo(() => safe(heldItems) || [], []);
  const flot = useMemo(() => (f && cells ? {
    ...f, presets: cells.presets, bubbleLever: cells.bubbleLever, gasLever: cells.gasLever,
  } : f), [f, cells]);

  return (
    <PanelShell
      title="Device explorer"
      subtitle={`KOKORI at ${KOKORI_BWPD} bwpd: a liner bank you can drag past its own envelope, a flotation chain from the gas rate to the cut, and a bed you can widen until the module refuses.`}
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'liners' && <LinerMode s={e} ko={ko} nLiners={nLiners} setLiners={setLiners} />}
        {mode === 'flotation' && <FlotationMode s={flot} preset={preset} setPreset={setPreset} />}
        {mode === 'bed' && <BedMode s={b} ko={ko} areaM2={areaM2} setArea={setArea} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored Produced Water Treatment engine on the teaching
        stream KOKORI. Where the engine refuses, this page shows the refusal and the cause the engine named. Six of
        this module&apos;s quantities are HELD FOR LITERATURE and are taught as absences rather than as answers:
        {' '}{held.map((h) => h.title).join('; ')}.
      </Note>
    </PanelShell>
  );
};

export default DeviceExplorer;
