import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  coldEnd, flagControls, vesselGasGoesUp, refusalContract,
  AGBADA, AGBADA_STEP_REFERENCE,
} from './gasprocessingLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Cold end explorer, the Expert tier, and the Professional contactor.
//
// THIS IS THE ONLY MODULE IN THE PACKAGE THAT COMPUTES A JOULE-THOMSON
// COEFFICIENT. The flowline thermal engine takes one as a typed input from its
// caller and never forms one, so this panel is where the number a caller types
// comes from. The coefficient itself belongs to the Flow Assurance course over
// a whole module; what belongs here is the chain that produces it.
//
// THE DERIVATIVE IS DRAWN BESIDE THE COEFFICIENT because it is the only term in
// the relation that carries any real-gas behaviour at all. A reader who sees it
// understands why the coefficient does not vanish as the pressure falls: the
// derivative divided by the pressure tends to a finite limit even as the
// compressibility tends to one.
//
// THE FOUR-STATE WATER TABLE IS THE POINT OF THIS PANEL. Letting the gas down
// without cooling it lets it hold MORE water than it arrived with, so the
// expansion dries the gas only through the cooling it causes, and a learner who
// has not seen those four rows believes expansion dries gas directly.
//
// A MARCH REPORTS THREE COEFFICIENTS AND THEY ARE THREE DIFFERENT NUMBERS. The
// Suite prints an inlet coefficient beside an arrival temperature that twenty
// other coefficients produced, so all three are on the page with the inlet
// measured against the mean.
//
// Every figure on this page is a return value from gasprocessingLab. Nothing
// here computes a coefficient, a cooling or a water content, and nothing reads
// a clock.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no percentile
// label appears anywhere on this page.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const nine = (v) => (Number.isFinite(v) ? Number(v).toFixed(9) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');

export const MODES = [
  ['coefficient', 'The coefficient across pressure, with the derivative that produces it beside it'],
  ['capacity', 'The heat capacity as a divisor, and the product that does not move'],
  ['march', 'The march, its step count against a converged answer, and its three coefficients'],
  ['cold', 'The cold separator, and the four states that separate the cooling from the let-down'],
  ['refusals', 'What the march refuses, and the evidence a refusal carries with it'],
  ['contactor', 'The contactor, for the Professional tier'],
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

const Held = ({ children }) => (
  <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">HELD FOR LITERATURE</p>
    <p className="text-xs text-slate-300 mb-0">{children}</p>
  </div>
);

/** A refusal shown as a refusal, with the evidence it carries beside it. */
const Refusal = ({ label, message, evidence }) => (
  <div className="mt-2 rounded-md border border-red-800/60 bg-red-950/20 p-2">
    <p className="text-red-300 text-xs font-medium mb-1">{label}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{message}</p>
    {evidence ? <p className="text-xs text-slate-400 mt-1 mb-0">{evidence}</p> : null}
  </div>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const CoefficientMode = ({ c }) => {
  if (!c) return <Note>The cold end reader did not return a coefficient.</Note>;
  const rows = c.pressureSweep.filter((r) => !r.refused);
  return (
    <>
      <TileGrid>
        <Tile label="Compressibility at inlet" value={nine(c.z)} />
        <Tile label="Temperature derivative" value={twelve(c.dzdT)} unit="per degR" />
        <Tile label="Coefficient" value={nine(c.muFPerPsi)} unit="degF/psi" />
        <Tile label="In the unit a field engineer quotes" value={six(c.muPer100PsiDerived)} unit="degF/100 psi" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The relation the module derives is mu = (R T squared over Cp P) times the temperature derivative of the
        compressibility. Every term on the right is either the caller&apos;s or comes from the same validated
        correlation the contactor uses, and nothing about the gas beyond its gravity enters. At a reduced pressure of
        {' '}{six(c.ppr)} and a reduced temperature of {six(c.tpr)}, those four tiles are the whole chain.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows.map((r) => ({ p: r.pPsia, z: r.z, mu100: r.muPer100PsiDerived }))} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="p" tick={AXIS} label={{ value: 'psia', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="z" name="compressibility" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="mu100" name="mu, degF/100 psi" stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-44 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows.map((r) => ({ p: r.pPsia, dzdT: r.dzdT }))} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="p" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => twelve(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="dzdT" name="dz/dT, per degR" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Read the lowest pressure against the highest. The compressibility climbs back towards one as the pressure falls
        and the derivative falls away with it, yet the coefficient stays large, because what enters the relation is the
        derivative DIVIDED by the pressure and that tends to a finite limit. A gas at near-atmospheric pressure still
        cools when it expands, and a method that treated the departure from ideality as the whole story would say it
        does not.
      </Note>
      <Tbl
        head={['psia', 'z', 'dz/dT, per degR', 'mu, degF/psi', 'mu, degF/100 psi']}
        rows={c.pressureSweep.map((r) => [six(r.pPsia), r.refused ? 'refuses' : nine(r.z), r.refused ? '' : twelve(r.dzdT), r.refused ? '' : nine(r.muFPerPsi), r.refused ? '' : six(r.muPer100PsiDerived)])}
      />
    </>
  );
};

export const CapacityMode = ({ c }) => {
  if (!c) return <Note>The cold end reader did not return a heat capacity sweep.</Note>;
  return (
    <>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={c.cpSweep.map((r) => ({ cp: r.cpBtuLbmolF, mu100: r.muPer100PsiDerived, product: r.cpTimesMuDerived }))} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="cp" tick={AXIS} label={{ value: 'Cp, Btu/lbmol.degF', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => nine(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="mu100" name="mu, degF/100 psi" stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line dataKey="product" name="Cp times mu" stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        One line falls and the other is flat. The flat line is the product of the two, and it not moving is what says the
        heat capacity enters the relation exactly once and as a divisor. Everything else about the gas is in the other
        factor.
      </Note>
      <Tbl
        head={['Cp, Btu/lbmol.degF', 'mu, degF/100 psi', 'Cp times mu']}
        rows={c.cpSweep.map((r) => [six(r.cpBtuLbmolF), six(r.muPer100PsiDerived), nine(r.cpTimesMuDerived)])}
      />
      <Held>
        The heat capacity is a caller&apos;s number here and this module carries no correlation for it. Taught as an
        input whose value the reader has to bring, and never as an answer this engine produces.
      </Held>
    </>
  );
};

export const MarchMode = ({ c }) => {
  if (!c) return <Note>The march reader did not return a sweep.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Arrival temperature" value={nine(c.t2F)} unit="degF" />
        <Tile label="Cooling" value={nine(c.dropF)} unit="degF" />
        <Tile label="Steps the default takes" value={String(c.steps)} />
        <Tile label="Reference march" value={String(AGBADA_STEP_REFERENCE)} unit="steps" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A coefficient is a slope, so a finite pressure drop is an integration rather than a multiplication. The module
        marches it in equal pressure steps, taking the half-step temperature as well as the half-step pressure, which is
        a midpoint step and second order in the step size.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={c.stepSweep.map((r) => ({ steps: r.steps, over: r.overReferenceDerived }))} margin={{ top: 10, right: 20, bottom: 5, left: 30 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="steps" tick={AXIS} scale="log" domain={['auto', 'auto']} label={{ value: 'steps', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} domain={[0.998, 1]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => twelve(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#BFFF00" strokeDasharray="3 3" label={{ value: 'the converged answer', fill: '#BFFF00', fontSize: 10 }} />
            <Line dataKey="over" name={`cooling over the ${AGBADA_STEP_REFERENCE}-step answer`} stroke="#38bdf8" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['steps', 'cooling, degF', 'arrival, degF', `cooling over the ${AGBADA_STEP_REFERENCE}-step answer`]}
        rows={c.stepSweep.map((r) => [String(r.steps), nine(r.dropF), nine(r.t2F), twelve(r.overReferenceDerived)])}
      />
      <Note>
        The reference march itself reports {nine(c.referenceDropF)} degF. Twenty steps is the module&apos;s default, and
        the table says what that default is worth on this let-down: one step is short by more than a thousandth, and the
        default is inside a hundred thousandth.
      </Note>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        THREE COEFFICIENTS, AND THEY ARE THREE DIFFERENT NUMBERS.
      </p>
      <div className="h-44 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[
              { name: 'at the inlet', mu: c.muInletFPerPsi },
              { name: 'the mean the cooling delivered', mu: c.muMeanFPerPsi },
              { name: 'at the last half step', mu: c.muLastStepFPerPsi },
            ]}
            margin={{ top: 10, right: 20, bottom: 5, left: 20 }}
          >
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={AXIS} />
            <YAxis tick={AXIS} domain={['auto', 'auto']} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => nine(val)} />
            <Bar dataKey="mu" name="degF per psi" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The mean is the cooling over the pressure drop and is the one that belongs beside an arrival temperature. The
        inlet coefficient is {nine(c.inletOverMeanDerived)} times that mean, so quoting the inlet beside the arrival
        understates the slope the answer was actually built from.
      </Note>
    </>
  );
};

export const ColdMode = ({ c }) => {
  if (!c) return <Note>The cold separator reader did not return its states.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Water at the inlet" value={nine(c.waterInLbMMscf)} unit="lb/MMscf" />
        <Tile label="Water the cold gas can hold" value={nine(c.waterOutLbMMscf)} unit="lb/MMscf" />
        <Tile label="Dropped into the boot" value={nine(c.dropOutLbMMscfDerived)} unit="lb/MMscf" />
        <Tile label="The cold gas holds this fraction" value={nine(c.heldFractionDerived)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={c.fourStates.map((r) => ({ name: r.label, water: r.lbPerMMscf }))} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} interval={0} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => nine(val)} />
            <ReferenceLine y={c.waterInLbMMscf} stroke="#BFFF00" strokeDasharray="3 3" label={{ value: 'what it arrived with', fill: '#BFFF00', fontSize: 10 }} />
            <Bar dataKey="water" name="lb/MMscf" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['state', 'psia', 'degF', 'water the gas can hold, lb/MMscf']}
        rows={c.fourStates.map((r) => [r.label, six(r.pPsia), six(r.tF), r.error ? 'refuses' : nine(r.lbPerMMscf)])}
      />
      <Note>
        The third row is the one that surprises a reader, and it is the point of this panel. Letting the gas down WITHOUT
        cooling it would let it hold MORE water than it arrived with, because the mole fraction of water at a fixed
        vapour pressure rises as the total pressure falls. It sits above the marked line for exactly that reason. The
        expansion dries the gas only through the cooling it causes, and the two effects pull in opposite directions all
        the way down.
      </Note>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        And this is the seam. Dehydration and a cold separator are two answers to one question, and a third answer,
        injecting an inhibitor so the water that is there cannot form a hydrate, belongs to the Flow Assurance course
        along with the hydrate boundary itself. Nothing in this engine computes a hydrate boundary.
      </p>
      <Held>
        The real-gas departure of the saturated water content. Every water read on this page sits below the pressure the
        engine warns at, because nothing in this package stands behind a figure for the correction. Taught as a limit and
        never as an answer.
      </Held>
    </>
  );
};

export const RefusalsMode = ({ c, f, r }) => {
  if (!c) return <Note>The march reader did not return its refusals.</Note>;
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        Every refusal below is the engine&apos;s own returned message, and many of them carry EVIDENCE beside it. A
        panel that showed only the message would throw that away.
      </p>
      {c.stepRefusals.map((s) => <Refusal key={s.steps} label={`a march of ${String(s.steps)} steps`} message={s.error} />)}
      {c.backwardsRefusal && <Refusal label="a let-down to a pressure above the inlet" message={c.backwardsRefusal} />}
      {c.equalPressureRefusal && <Refusal label="a let-down with the two pressures equal" message={c.equalPressureRefusal} />}
      {c.coldInletRefusal && (
        <Refusal
          label="the same gas entering cold, and let down only part as far"
          message={c.coldInletRefusal}
          evidence={`It hands back where: step ${String(c.coldDiedAtStep)} of ${String(c.coldSteps)}, at ${six(c.coldDiedAtPsia)} psia and ${six(c.coldDiedAtF)} degF. Three fields beside a message, and between them they say the march was part way down and the gas was already cold when the method ran out.`}
        />
      )}
      {f && (
        <>
          <p className="text-xs text-slate-400 mt-3 mb-0">
            WHAT KILLS A MARCH IS NOT WHAT IT LOOKS LIKE. A deep outlet looks like the thing that kills it. It is not:
            what kills it is a COLD INLET walking the gas off the compressibility correlation part way down.
          </p>
          <Tbl
            head={['case', 'inlet degF', 'outlet psia', 'the outlet is a deep one', 'the engine', 'died at step']}
            rows={f.marchCases.map((m) => [m.label, six(m.tF), six(m.p2Psia), String(m.deepOutletPredicate), m.refused ? 'refuses' : 'answers', m.diedAtStep === null ? 'none' : String(m.diedAtStep)])}
          />
          <Note>
            The deepest let-down on that list ANSWERS, and the shallowest one refuses. A predicate built on the outlet
            pressure would have got both of them the wrong way round.
          </Note>
        </>
      )}
      <Tbl
        head={['outlet psia', 'arrival, degF', 'cooling, degF']}
        rows={c.deeperLetDown.map((d) => [six(d.p2Psia), d.error ? 'refuses' : nine(d.t2F), d.error ? '' : nine(d.dropF)])}
      />
      <Note>
        Letting the same gas down further does not go on cooling it in proportion, because the coefficient falls with the
        pressure the march is walking down.
      </Note>
      <Tbl
        head={['gravity', 'the engine']}
        rows={c.gravityEdge.map((g) => [six(g.gasSg), g.error ? 'refuses' : `answers ${nine(g.muFPerPsi)} degF per psi`])}
      />
      {r && (
        <Tbl
          head={['a refusal that carries evidence', 'fields beside the message']}
          rows={r.evidence.map((e) => [e.label, `${String(e.fieldCount)}: ${e.fields.join(', ')}`])}
        />
      )}
    </>
  );
};

export const ContactorMode = ({ v }) => {
  if (!v) return <Note>The vessel reader did not return a sizing.</Note>;
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        The contactor sizing is shown here for the Professional tier. Souders-Brown, the K value and the settling
        velocity belong to the Separation and Slug Catching course; there is no K-value chart on this page.
      </p>
      <TileGrid>
        <Tile label="Gas density" value={six(v.obiafu.rhoG)} unit="lb/ft3" />
        <Tile label="Compressibility" value={nine(v.obiafu.z)} />
        <Tile label="Allowed velocity" value={six(v.obiafu.vAllowFtS)} unit="ft/s" />
        <Tile label="Diameter" value={six(v.obiafu.diameterFt)} unit="ft" />
      </TileGrid>
      <Tbl
        head={['K, ft/s', 'allowed velocity, ft/s', 'diameter, ft']}
        rows={v.kSweep.map((r) => [six(r.ksFtS), six(r.vAllowFtS), six(r.diameterFt)])}
      />
      <Held>
        The contactor liquid density. The module&apos;s default is a glycol density, which is the wrong fluid for an
        amine column. Taught as a limit and never as an answer.
      </Held>
    </>
  );
};

const ColdEndExplorer = ({ initialMode = 'coefficient' }) => {
  const [mode, setMode] = useState(initialMode);
  const c = useMemo(() => (mode === 'contactor' ? null : safe(coldEnd)), [mode]);
  const f = useMemo(() => (mode === 'refusals' ? safe(flagControls) : null), [mode]);
  const r = useMemo(() => (mode === 'refusals' ? safe(refusalContract) : null), [mode]);
  const v = useMemo(() => (mode === 'contactor' ? safe(vesselGasGoesUp) : null), [mode]);

  return (
    <PanelShell
      title="Cold end explorer"
      subtitle={`AGBADA, a dew point skid letting down from ${AGBADA.p1Psia} psia: the coefficient and the derivative behind it, the heat capacity as a divisor, the march against a converged answer, its three coefficients, and the four states that separate the cooling from the let-down.`}
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'coefficient' && <CoefficientMode c={c} />}
        {mode === 'capacity' && <CapacityMode c={c} />}
        {mode === 'march' && <MarchMode c={c} />}
        {mode === 'cold' && <ColdMode c={c} />}
        {mode === 'refusals' && <RefusalsMode c={c} f={f} r={r} />}
        {mode === 'contactor' && <ContactorMode v={v} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored Gas Processing engine on the teaching stream AGBADA,
        printed to the precision the lessons use. Pressures are in psia, temperatures in degF, the
        coefficient in degF per psi and per 100 psi, water in lb per MMscf and vessels in feet.
      </Note>
    </PanelShell>
  );
};

export default ColdEndExplorer;
