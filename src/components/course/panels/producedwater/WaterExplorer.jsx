import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine,
} from 'recharts';
import {
  temperatureAndSalinity, theDistribution, riseAndItsBand, gravityDevices, heldItems,
  UZERE_WATER, UZERE_OIL, UZERE_INLET, UZERE_BASIN, UZERE_BWPD,
} from './producedWaterLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// The water explorer, the Associate tier. The water and the oil first, then the
// droplets, then what gravity catches.
//
// THE DENSITY DIFFERENCE IS THE WHOLE DRIVING FORCE, and this panel puts the
// viscosity, the brine density and the crude density on the same page for that
// reason: the two inputs the predecessor model collected and ignored are what
// decide every cut size further on.
//
// Every figure on this page is a return value from producedWaterLab, which is a
// return value from the vendored Produced Water Treatment engine on the
// teaching stream UZERE. Nothing here computes a viscosity, a density, a rise
// velocity or a cut size, nothing imports an engine, and nothing reads a clock.
//
// NO P LABEL. Nothing here is a distribution a percentile would describe. The
// droplet distribution is a volume distribution over size and its median is
// reported as a median.
//
// COPY RULE: no em dash and no en dash anywhere a learner reads.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');

export const MODES = [
  ['fluids', 'The water and the oil: viscosity against temperature and salinity, and the density difference'],
  ['droplets', 'The droplets: the bins, the grid they are reported on, and the truncated tail'],
  ['rise', 'A droplet rising, and the creeping flow band it is honest in'],
  ['gravity', 'The two gravity cuts against plan area, plate count and the short circuit allowance'],
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

/** A refusal shown as a refusal. The message is the engine's, through the lab. */
export const Refusal = ({ label, message }) => (
  <div className="mt-2 rounded-md border border-red-800/60 bg-red-950/20 p-2">
    <p className="text-red-300 text-xs font-medium mb-1">{label}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{message}</p>
  </div>
);

/** A warning shown as a warning. It withholds nothing and it says what it judged. */
export const Warning = ({ children }) => (
  <div className="mt-2 rounded-md border border-amber-700/60 bg-amber-950/10 p-2">
    <p className="text-xs text-amber-200 mb-0">{children}</p>
  </div>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const FluidsMode = ({ s }) => {
  if (!s) return <Note>The property reader did not return a sweep.</Note>;
  const chart = s.byTemperature.map((r) => ({ tC: r.tC, fresh: r.muFreshPaS, brine: r.muPaS }));
  const crude = s.crude.map((r) => ({ api: r.apiGravity, rho: r.rhoKgM3, gap: r.differenceFromBrine }));
  return (
    <>
      <TileGrid>
        <Tile label="Water thins across the sweep by" value={six(s.thinningFactor)} unit="times" />
        <Tile label="Salinity multiplier, declared" value={String(s.salinityMultiplier)} />
        <Tile label="Salinity correction stated to" value={String(s.tdsMaxPpm)} unit="ppm TDS" />
        <Tile label="Brine at the stream conditions" value={six(s.densities[1].rhoKgM3)} unit="kg/m3" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A Stokes rise velocity goes as one over the viscosity, so the same basin on the same water catches a very
        different droplet at two temperatures. The salinity correction is linear and it is stated only to
        {' '}{s.tdsMaxPpm} ppm, because past saturation a linear correction has nothing behind it.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="tC" tick={AXIS} label={{ value: 'degC', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => twelve(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="fresh" name="fresh water, Pa.s" stroke={SERIES[0]} dot={false} isAnimationActive={false} />
            <Line dataKey="brine" name="brine, Pa.s" stroke={SERIES[2]} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['ppm TDS', 'salinity factor', 'brine Pa.s']}
        rows={s.bySalinity.map((r) => [String(r.tdsPpm), six(r.salinityFactor), twelve(r.muPaS)])}
      />
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={crude} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="api" tick={AXIS} label={{ value: 'degrees API', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="rho" name="crude density, kg/m3" stroke={SERIES[1]} dot={false} isAnimationActive={false} />
            <Line dataKey="gap" name="difference from the brine, kg/m3" stroke={SERIES[3]} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The difference between those two curves is the entire driving force for every gravity and centrifugal device in
        this module. Across this sweep it changes by a factor of about three, which lands on every cut size squared.
      </Note>
    </>
  );
};

export const DropletsMode = ({ s }) => {
  if (!s) return <Note>The distribution reader did not return a grid.</Note>;
  const sigma = s.bySigma.map((r) => ({
    sigma: r.sigma, removal: r.removalPct, median: r.outletMedianMicron,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Bins on the module's own grid" value={String(s.nBins)} />
        <Tile label="Sigma either side" value={String(s.spanSigma)} />
        <Tile label="Volume median of the bin set" value={six(s.medianMicron)} unit="micron" />
        <Tile label="Volume in the truncated tails" value={twelve(s.truncatedTailFraction)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The volume median of the bin set reproduces the typed d50 of {UZERE_INLET.d50Micron} micron, which is the
        identity a median has to satisfy, because the volume median of a log-normal is its own d50. The coarsest bin
        reaches {six(s.coarsestMicron)} micron and the finest starts at {twelve(s.finestMicron)}.
      </p>
      <Tbl
        head={['bins', 'median micron', 'truncated tail', 'tail over twice the cdf below the span']}
        rows={s.byBinCount.map((r) => [String(r.nBins), six(r.medianMicron), twelve(r.truncatedTailFraction), twelve(r.tailOverAnalytic)])}
      />
      <Note>
        The last column is the reported tail over twice the module&apos;s own cdf at the lower span edge. It comes out at
        one, which says the tail the normalisation absorbs is exactly the analytic tail rather than a binning artefact.
        That check needs no publication at all, which is what makes it worth having.
      </Note>
      <Tbl
        head={['sigma spans', 'truncated tail', 'coarsest bin micron']}
        rows={s.bySpan.map((r) => [String(r.spanSigma), twelve(r.truncatedTailFraction), six(r.coarsestMicron)])}
      />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sigma} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="sigma" tick={AXIS} label={{ value: 'sigma', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="removal" name={`removal at a ${s.probeCutMicron} micron cut, percent`} fill={SERIES[0]} isAnimationActive={false} />
            <Bar dataKey="median" name="outlet median, micron" fill={SERIES[2]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Sigma is the input a reader is least likely to have measured and it moves the answer more than almost anything
        else on the page. The module warns outside {s.sigmaCustomaryMin} to {s.sigmaCustomaryMax} and refuses above
        {' '}{s.sigmaMax}, because a wider spread than that is not what produced water carries.
      </Note>
    </>
  );
};

export const RiseMode = ({ s }) => {
  if (!s) return <Note>The rise reader did not return a sweep.</Note>;
  const chart = s.rows.map((r) => ({ d: r.dMicron, ratio: r.ratio, re: r.reynolds }));
  return (
    <>
      <TileGrid>
        <Tile label="Water viscosity" value={twelve(s.muPaS)} unit="Pa.s" />
        <Tile label="Density difference" value={six(s.densityDifference)} unit="kg/m3" />
        <Tile label="Stokes is stated to Reynolds" value={String(s.stokesReynoldsLimit)} />
        <Tile label="Overstatement at the coarse end" value={six(s.coarse.departure * 100)} unit="percent" />
      </TileGrid>
      <Tbl
        head={['droplet micron', 'Stokes m/s', 'Reynolds', 'full drag balance m/s', 'Stokes over the balance', 'in band']}
        rows={s.rows.map((r) => [String(r.dMicron), twelve(r.stokesMS), six(r.reynolds), twelve(r.balanceMS), six(r.ratio), r.inBand ? 'yes' : 'no'])}
      />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="d" tick={AXIS} label={{ value: 'droplet micron', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#64748b" strokeDasharray="4 4" />
            <Line dataKey="ratio" name="Stokes over the full drag balance" stroke={SERIES[2]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The departure grows with the Reynolds number on every row of that table, and that is the whole content of the
        band. An overstated rise velocity means an understated cut size, which is the optimistic direction, which is why
        the module warns rather than leaving it to the reader. The two routes are different methods: Stokes is closed
        form and the balance is a damped iteration on the Schiller-Naumann drag coefficient, so their agreement inside
        the band is evidence of something.
      </Note>
    </>
  );
};

export const GravityMode = ({ s }) => {
  if (!s) return <Note>The gravity reader did not return a sweep.</Note>;
  const areas = s.areas.map((r) => ({ area: r.planAreaM2, cut: r.d50cMicron, perRoot: r.cutPerRootLoading }));
  const plates = s.plates.map((r) => ({ plates: r.nPlates, cut: r.d50cMicron, area: r.effectiveAreaM2 }));
  return (
    <>
      <TileGrid>
        <Tile label="Surface loading" value={twelve(s.basin.overflowRateMS)} unit="m/s" />
        <Tile label="Basin cut size" value={six(s.basin.d50cMicron)} unit="micron" />
        <Tile label="Horizontal velocity" value={twelve(s.basin.horizontalVelocityMS)} unit="m/s" />
        <Tile label="Against the fixed limit" value={six(s.basin.horizontalVelocityLimitMS)} unit="m/s" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The basin is {UZERE_BASIN.lengthM} by {UZERE_BASIN.widthM} by {UZERE_BASIN.depthM} m on {UZERE_BWPD} bwpd at
        {' '}{UZERE_WATER.tC} C and {UZERE_WATER.tdsPpm} ppm TDS with {UZERE_OIL.apiGravity} API oil. Write out the
        settling time against the residence time and the depth cancels: what is left is the flow over the plan area,
        times an allowance for turbulence and short circuiting.
      </p>
      <Tbl
        head={['water depth m', 'cut micron', 'horizontal velocity m/s', 'residence s', 'warning']}
        rows={s.depths.map((r) => [String(r.depthM), six(r.d50cMicron), twelve(r.horizontalVelocityMS), six(r.residenceS), r.warning])}
      />
      <Note>
        The cut size is the same number on both rows, because it comes from the flow over the PLAN AREA. The depth
        leaves the cut alone and it moves the velocity check, and a reader who takes the cut size as the whole answer
        has missed the constraint that actually sizes the vessel.
      </Note>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={areas} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="area" tick={AXIS} label={{ value: 'plan area m2', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="cut" name="basin cut, micron" stroke={SERIES[0]} dot isAnimationActive={false} />
            <Line dataKey="perRoot" name="cut over the root of the loading" stroke={SERIES[3]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The second line is flat, which says the cut size goes as the square root of the surface loading exactly. Halving
        the cut size costs four times the basin.
      </Note>
      <Tbl
        head={['F', 'cut micron', 'warning']}
        rows={s.shortCircuit.map((r) => [String(r.shortCircuitF), six(r.d50cMicron), r.warning])}
      />
      {s.shortCircuitRefusals.map((r) => (
        <Refusal key={r.label} label={`The engine refuses ${r.label}`} message={r.error} />
      ))}
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={plates} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="plates" tick={AXIS} label={{ value: 'plates', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="cut" name="plate pack cut, micron" stroke={SERIES[2]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Held>
        The plate pack efficiency factor, {s.plateEfficiencyFactor}, is the fraction of the projected plate area that
        actually settles. It is worth a large part of the answer and it has no source in this repository. The second
        half of the API 421 horizontal velocity rule is held the same way: only the fixed velocity half is here, and
        every return that carries the check says so on its own face.
      </Held>
    </>
  );
};

const WaterExplorer = ({ initialMode = 'fluids' }) => {
  const [mode, setMode] = useState(initialMode);
  const f = useMemo(() => (mode === 'fluids' ? safe(temperatureAndSalinity) : null), [mode]);
  const d = useMemo(() => (mode === 'droplets' ? safe(theDistribution) : null), [mode]);
  const r = useMemo(() => (mode === 'rise' ? safe(riseAndItsBand) : null), [mode]);
  const g = useMemo(() => (mode === 'gravity' ? safe(gravityDevices) : null), [mode]);
  const held = useMemo(() => safe(heldItems) || [], []);

  return (
    <PanelShell
      title="Water explorer"
      subtitle="UZERE in the engine's own units: the water and the oil, the droplet distribution and the grid it is reported on, a droplet's rise and the band it is honest in, and the two gravity cuts."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'fluids' && <FluidsMode s={f} />}
        {mode === 'droplets' && <DropletsMode s={d} />}
        {mode === 'rise' && <RiseMode s={r} />}
        {mode === 'gravity' && <GravityMode s={g} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored Produced Water Treatment engine on the teaching
        stream UZERE, printed to the precision the lessons use. Six of this module&apos;s quantities are HELD
        FOR LITERATURE and are taught as absences rather than as answers: {held.map((h) => h.title).join('; ')}.
      </Note>
    </PanelShell>
  );
};

export default WaterExplorer;
