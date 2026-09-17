import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  OGBOGENE, tank, venting, vacuumOnset, shell,
} from './meteringLab';
import {
  PanelShell, NumField, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import { Relation, Refusal, Provenance } from './MeterRunExplorer';

// THE TANK, the Expert tier. A tank shell equation is simple. VENTING is what
// actually destroys tanks: a tank is a thin-walled vessel designed for inches
// of water column, so an undersized vacuum vent pulls it flat during a cold
// rainstorm on a draining tank.
//
// MOVE THE DRAW RATE AND WATCH THE DIRECTION GOVERN. Thermal venting is
// temperature, movement venting is displacement, and the two add in each
// direction. Raise the rate the tank is being pumped out at and the inbreathing
// total climbs past the outbreathing total, and the word the engine returns
// turns over from pressure to vacuum.
//
// THE GOVERNING WORD IS THE ENGINE'S. The engine forms one predicate and
// computes it once, because two expressions of it disagreed at the tie and the
// label said vacuum while the warning stayed silent. A panel that formed its
// own predicate would reintroduce exactly that defect on the screen.
//
// Every number on this page is a return value from meteringLab, which is a
// return value from the vendored storage tank engine. This panel computes no
// tank quantity, imports no engine, reads no clock and draws no random number.
//
// NO PERCENTILE. Nothing in this course is a distribution.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const raw = (v) => (v === null || v === undefined ? 'none' : String(v));
const num = (v, fallback) => (Number.isFinite(Number(v)) && String(v).trim() !== '' ? Number(v) : fallback);

export const MODES = [
  ['venting', 'Venting in each direction, the two totals, and which one governs'],
  ['onset', 'The draw rate the vacuum case takes over at, found by bisecting the word'],
  ['capacity', 'Capacity, working capacity and the exact barrel'],
  ['shell', 'The shell, and which of three things governs each course'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

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

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const VentingMode = ({ v }) => {
  if (!v) return <Note>The venting reader did not answer.</Note>;
  if (v.refused) return <Refusal label="The engine will not vent this tank" message={v.error} />;
  return (
    <>
      <TileGrid>
        <Tile label="Nominal capacity" value={four(v.nominalBbl)} unit="bbl" />
        <Tile label="Thermal inbreathing" value={four(v.thermalInbreathingScfh)} unit="scfh" />
        <Tile label="Thermal outbreathing, low volatility" value={four(v.thermalOutbreathingLowScfh)} unit="scfh" />
        <Tile label="Thermal outbreathing, high volatility" value={four(v.thermalOutbreathingHighScfh)} unit="scfh" />
        <Tile label="Movement inbreathing" value={four(v.movementInbreathingScfh)} unit="scfh" />
        <Tile label="Movement outbreathing" value={four(v.movementOutbreathingScfh)} unit="scfh" />
        <Tile label="Total inbreathing" value={four(v.inbreathingScfh)} unit="scfh" />
        <Tile label="Total outbreathing" value={four(v.outbreathingScfh)} unit="scfh" />
      </TileGrid>
      <div className="mt-3 rounded-md border border-slate-700 bg-[#0F172A] p-3">
        <p className="text-slate-500 text-xs mb-1">The governing case, as the engine returns it</p>
        <p className="text-white text-base mb-0">{raw(v.governing)}</p>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        That word is the engine&apos;s. It comes from one predicate the engine forms and computes once, so the word and
        the warning below it can never disagree. Raise the draw rate until the inbreathing total passes the
        outbreathing total and watch it turn over.
      </p>
      <Relation r={v.directionRelation} />
      <Refusal label="The engine's warning when vacuum governs" message={v.warning} />
      <Refusal label="The engine's warning above the stated proportional capacity" message={v.thermalWarning} />
      <Provenance>{v.basis}</Provenance>
      <TileGrid>
        <Tile label="Thermal rate per barrel of capacity" value={six(v.scfhPerBbl)} unit="scfh" />
        <Tile label="Latitude factor" value={six(v.latitudeFactor)} />
        <Tile label="High volatility" value={String(v.highVolatility)} />
        <Tile label="Insulated" value={String(v.insulated)} />
      </TileGrid>
      <Relation r={v.insulationRelation} />
      <Relation r={v.volatilityRelation} />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A high volatility product doubles the movement outbreathing, because the incoming liquid also evaporates.
        Insulation cuts the thermal rate by the credit the engine states, and the engine says whose figure that is:
      </p>
      <Provenance>{v.insulationNote}</Provenance>
    </>
  );
};

export const OnsetMode = ({ o }) => {
  if (!o) return <Note>The onset reader did not answer.</Note>;
  const chart = o.rows.map((r) => ({
    draw: r.drawBblPerHr, inbreathing: r.inbreathingScfh, outbreathing: r.outbreathingScfh,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Vacuum takes the case above" value={four(o.edge.at)} unit="bbl/hr drawn" />
        <Tile label="At the fill rate" value={four(o.fillBblPerHr)} unit="bbl/hr" />
        <Tile label="Halvings" value={raw(o.edge.halvings)} />
        <Tile label="The edge discriminates" value={String(o.edge.discriminates)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The rate is found by bisecting the governing WORD the engine returns. At {four(o.edge.from)} bbl/hr the engine
        says {raw(o.edge.readingFrom)}; at {four(o.edge.to)} bbl/hr it says {raw(o.edge.readingTo)}. An edge with the
        same answer either side of it is not an edge, so that disagreement is computed rather than assumed.
      </p>
      <Tbl
        head={['draw rate, bbl/hr', 'inbreathing, scfh', 'outbreathing, scfh', 'governing']}
        rows={o.rows.map((r) => [four(r.drawBblPerHr), four(r.inbreathingScfh), four(r.outbreathingScfh), r.governing])}
      />
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="draw" tick={AXIS} label={{ value: 'draw rate, bbl/hr', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={o.edge.at} stroke="#f472b6" strokeDasharray="3 3" label={{ value: 'vacuum takes the case', fill: '#f472b6', fontSize: 9 }} />
            <Line dataKey="inbreathing" name="total inbreathing, scfh" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="outbreathing" name="total outbreathing, scfh" stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Refusal label="The engine's warning once vacuum governs" message={o.vacuumWarning} />
      <Refusal label="The engine's warning above the stated proportional capacity" message={o.proportionalWarning} />
    </>
  );
};

export const CapacityMode = ({ t }) => {
  if (!t) return <Note>The capacity reader did not answer.</Note>;
  if (t.refused) return <Refusal label="The engine will not measure this tank" message={t.error} />;
  return (
    <>
      <TileGrid>
        <Tile label="Cross section" value={four(t.crossSectionFt2)} unit="ft2" />
        <Tile label="Nominal capacity" value={four(t.nominalBbl)} unit="bbl" />
        <Tile label="Nominal capacity" value={four(t.nominalFt3)} unit="ft3" />
        <Tile label="Working capacity to the stated level" value={four(t.workingBbl)} unit="bbl" />
        <Tile label="Barrels per foot of shell" value={four(t.bblPerFt)} unit="bbl" />
        <Tile label="Cubic feet in a barrel" value={String(t.ft3PerBbl)} unit="ft3" />
        <Tile label="Diameter" value={six(t.diameterFt)} unit="ft" />
        <Tile label="Shell height" value={six(t.heightFt)} unit="ft" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The conversion between cubic feet and barrels is exact by definition and the engine returns it, so it can be
        checked rather than assumed. The three tank questions in this module share this one geometry, which is why
        they live together.
      </p>
      <Relation r={t.capacityRelation} />
      <Refusal label="A fill height below nothing" message={t.negativeFillRefusal} />
    </>
  );
};

export const ShellMode = ({ s }) => {
  if (!s) return <Note>The shell reader did not answer.</Note>;
  if (s.refused) return <Refusal label="The engine will not course this shell" message={s.error} />;
  return (
    <>
      <TileGrid>
        <Tile label="Courses" value={raw(s.count)} />
        <Tile label="The thickest course" value={raw(s.thickestCourse)} />
        <Tile label="Its required thickness" value={six(s.thickestRequiredIn)} unit="in" />
        <Tile label="What governs it" value={raw(s.governingReason)} />
      </TileGrid>
      <Tbl
        head={['course', 'bottom, ft', 'top, ft', 'head, ft', 't design, in', 't test, in', 'required, in', 'governed by']}
        rows={s.courses.map((c) => [raw(c.course), six(c.bottomFt), six(c.topFt), six(c.headFt), six(c.tDesignIn), six(c.tTestIn), six(c.requiredIn), c.governing])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The bottom course is always the thickest, and the engine returns that as a property of the method rather than
        as a result: the head falls as the courses go up, both thickness relations are linear in it, and the minimum
        plate is a floor, so the required thickness cannot increase upward. The engine&apos;s own flag for that reads
        {' '}{String(s.governingCourseIsAlwaysTheBottom)}.
      </p>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        WHAT GOVERNS THE BOTTOM COURSE ACROSS THE PRODUCT GRAVITIES. A light product makes the water test govern, which
        is the case people forget when they design for the product alone. The gravity the governing word turns over at
        is {six(s.waterTestEdge.at)}, found by bisecting that word.
      </p>
      <Tbl
        head={['specific gravity', 't design, in', 't test, in', 'required, in', 'governed by']}
        rows={s.gravityRows.map((r) => [six(r.sg), six(r.tDesignIn), six(r.tTestIn), six(r.requiredIn), r.governing])}
      />
      <Provenance>{s.minimumThicknessBasis}</Provenance>
      <Provenance>{s.methodNote}</Provenance>
    </>
  );
};

const VentingExplorer = ({ initialMode = 'venting' }) => {
  const [mode, setMode] = useState(initialMode);
  const [drawBblPerHr, setDraw] = useState(String(OGBOGENE.drawBblPerHr));
  const [fillBblPerHr, setFill] = useState(String(OGBOGENE.fillBblPerHr));
  const [diameterFt, setDiameter] = useState(String(OGBOGENE.diameterFt));
  const [sg, setSg] = useState(String(OGBOGENE.sg));

  const geometry = useMemo(() => ({
    diameterFt: num(diameterFt, OGBOGENE.diameterFt),
    heightFt: OGBOGENE.heightFt,
  }), [diameterFt]);

  const v = useMemo(() => (mode === 'venting' ? safe(() => venting({
    ...geometry,
    drawBblPerHr: num(drawBblPerHr, OGBOGENE.drawBblPerHr),
    fillBblPerHr: num(fillBblPerHr, OGBOGENE.fillBblPerHr),
  })) : null), [mode, geometry, drawBblPerHr, fillBblPerHr]);

  const o = useMemo(() => (mode === 'onset' ? safe(() => vacuumOnset({
    ...geometry,
    fillBblPerHr: num(fillBblPerHr, OGBOGENE.fillBblPerHr),
  })) : null), [mode, geometry, fillBblPerHr]);

  const t = useMemo(() => (mode === 'capacity' ? safe(() => tank({
    ...geometry, fillHeightFt: OGBOGENE.liquidLevelFt,
  })) : null), [mode, geometry]);

  const s = useMemo(() => (mode === 'shell' ? safe(() => shell({
    ...geometry, sg: num(sg, OGBOGENE.sg),
  })) : null), [mode, geometry, sg]);

  return (
    <PanelShell
      title="Venting explorer"
      subtitle="A fixed-roof tank in field units: the capacity, the thermal venting in each direction, the movement venting in each direction, the two totals, and the direction that governs. Raise the draw rate until the vacuum case takes over, and read the word the engine returns rather than one this page decided."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <NumField label="Draw rate, bbl/hr" value={drawBblPerHr} onChange={setDraw} />
        <NumField label="Fill rate, bbl/hr" value={fillBblPerHr} onChange={setFill} />
        <NumField label="Diameter, ft" value={diameterFt} onChange={setDiameter} />
        <NumField label="Specific gravity" value={sg} onChange={setSg} />
      </FieldGrid>
      <Note>
        The shell height and the design liquid level are held at the teaching tank&apos;s stated values. The draw rate
        is the box that crosses the boundary, and the specific gravity is the one that changes what governs the shell.
      </Note>
      <div className="mt-3">
        {mode === 'venting' && <VentingMode v={v} />}
        {mode === 'onset' && <OnsetMode o={o} />}
        {mode === 'capacity' && <CapacityMode t={t} />}
        {mode === 'shell' && <ShellMode s={s} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored storage tank engine, reached through the teaching
        lab. Volumes are in barrels and cubic feet, movement rates in barrels an hour, venting rates in scfh of air and
        plate thicknesses in inches. Volumes, venting rates and movement rates print to four decimals; thicknesses,
        gravities and factors to six.
      </Note>
    </PanelShell>
  );
};

export default VentingExplorer;
