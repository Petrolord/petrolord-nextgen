import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ScatterChart, Scatter, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  TEXTBOOK_LP, APAPA_PMS_POOL, APAPA_AGO_POOL, PMS_LIMITS, LIMIT_RANGES, PMS_BLANKS, PROBES, ROW_BASES,
  textbookDrag, lpCases, pmsRecipe, giveaway, blendingRules, relief, reliefResolve, reliefSweep, agoRecipe,
  refusedAndSkipped,
} from './crudeLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, f4, usable, Tbl, Basis, Shortcut, Refused, Note, Lead, Empty, safe, Slider,
} from './panelBits';
import { PanelShell, SelectField, FieldGrid } from '@/components/course/panels/petrophysics/panelKit';

// Recipe explorer, the Expert tier throughout.
//
// THE LP FIRST, IN TWO DIMENSIONS. The textbook problem's feasible region is
// drawn from vertices THE KERNEL FOUND, the optimum sits on one of them, and
// dragging a right-hand side re-solves: the change in the optimum sits beside
// the row price times the step, and the two agree while the optimal vertex holds.
//
// SHADOW PRICES AS THE VALUE OF RELIEF. The Product Blending Optimizer, and this
// page, report the money one unit of relief saves per whole unit of the
// property (per ppm, per psi, per octane number, per kg/l). rowPrice, the LP's
// own price per unit of the row, is printed beside it and never in its place.
// Dragging a limit re-solves the recipe, and the saving the move really made is
// printed next to the derivative's prediction so a learner watches them part.
//
// INFEASIBLE IS AN ANSWER, a blank cost is refused, a typed 0 is none, and a
// specification that cannot be applied is listed as skipped with its reason.
// Every sentence is the engine's.

export const MODES = [
  ['lp', 'The textbook LP: the feasible region, its vertices, the optimum, and a right-hand side dragged'],
  ['pms', 'The APAPA PMS pool: the least-cost recipe, binding specifications and giveaway'],
  ['relief', 'Shadow prices as the value of relief, with rowPrice beside them, and a limit dragged'],
  ['ago', 'The AGO pool: viscosity through the Refutas index on mass'],
  ['refused', 'Availability typed as 0 or left blank, a blank cost, a skipped specification, and infeasible'],
];

const RHS_RANGE = [[12, 40, 1], [2, 12, 0.5]];

// ---------------------------------------------------------------------------

export const LpMode = ({
  drag, cases, row, rhs, onRow, onRhs,
}) => {
  const r = Number.isInteger(row) ? row : 0;
  const [lo, hi, step] = RHS_RANGE[r] || RHS_RANGE[0];
  const controls = (
    <div className="grid gap-3 sm:grid-cols-2">
      <SelectField label="Drag the right-hand side of" value={String(r)} onChange={(v) => onRow && onRow(Number(v))} options={[['0', 'row 1, 6x + 4y <= b1'], ['1', 'row 2, 1x + 2y <= b2']]} />
      <Slider label={`b${r + 1}`} value={rhs ?? TEXTBOOK_LP.b[r]} min={lo} max={hi} step={step} onChange={onRhs} />
    </div>
  );
  if (!usable(drag) || !usable(drag.moved) || !Array.isArray(drag.moved.vertices)) {
    return <>{controls}<Empty>The LP reader has returned nothing, so there is no region to draw.</Empty></>;
  }
  const m = drag.moved;
  const base = drag.base;
  const polygon = [...m.vertices, m.vertices[0]];
  return (
    <>
      {controls}
      <Lead>
        Maximise {TEXTBOOK_LP.c[0]}x + {TEXTBOOK_LP.c[1]}y. The shaded outline is the feasible region at the right-hand
        sides you set, its corners found by the kernel itself: asked to maximise in 72 directions, every distinct optimum
        it returns is a vertex. The dashed line is the objective through the optimum, which sits on a vertex.
      </Lead>
      <div className="h-72 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="x" type="number" domain={[0, 8]} tick={AXIS} name="x" />
            <YAxis dataKey="y" type="number" domain={[0, 8]} tick={AXIS} name="y" />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Scatter name="feasible region, vertices from the kernel" data={polygon} line fill={SERIES[0]} isAnimationActive={false} />
            {m.objectiveLine && <Scatter name="objective line through the optimum" data={m.objectiveLine} line={{ strokeDasharray: '5 3' }} fill={SERIES[3]} isAnimationActive={false} />}
            {m.status === 'optimal' && <Scatter name="the optimum" data={[{ x: m.x[0], y: m.x[1] }]} fill={SERIES[2]} isAnimationActive={false} />}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <Tbl head={['vertex x', 'vertex y', 'objective at the vertex']} rows={m.vertices.map((v) => [f4(v.x), f4(v.y), f4(v.objective)])} />
      <Tbl
        head={['', 'status', 'x', 'y', 'objective', 'row price, row 1', 'row price, row 2', 'iterations']}
        rows={[
          ['the textbook case', base.status, f4(base.x[0]), f4(base.x[1]), f4(base.objective), f4(base.shadowPrices[0]), f4(base.shadowPrices[1]), String(base.iterations)],
          [`with b${drag.row} at ${drag.rhs}`, m.status, f4(m.x ? m.x[0] : null), f4(m.x ? m.x[1] : null), f4(m.objective), f4(m.shadowPrices ? m.shadowPrices[0] : null), f4(m.shadowPrices ? m.shadowPrices[1] : null), String(m.iterations)],
        ]}
      />
      <Note>
        A shadow price is the change in the optimum per unit of a row&apos;s right-hand side. You moved b{drag.row} by
        {' '}{drag.step}: the kernel re-solved to a change of {f4(drag.change)}, and the row price times the step is
        {' '}{f4(drag.priceTimesStep)}. They agree while the same vertex stays optimal, and part once it does not.
      </Note>
      {Array.isArray(base.raised) && (
        <Tbl head={['row raised by one', 'objective', 'change from the optimum']} rows={base.raised.map((x) => [`row ${x.row}, rhs ${x.rhs}`, f4(x.objective), f4(x.change)])} />
      )}
      {usable(cases) && Array.isArray(cases.statuses) && (
        <>
          <Lead>Infeasible and unbounded are answers, and the kernel says which:</Lead>
          <Tbl head={['problem', 'status']} rows={cases.statuses.map((x) => [x.problem, x.objective === undefined ? x.status : `${x.status}, objective ${f4(x.objective)}`])} />
          <Note>A malformed problem is not an answer: the kernel throws ({cases.malformed}).</Note>
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const specRows = (achieved) => achieved.map((a) => [
  a.name, a.min === null ? 'no minimum' : String(a.min), a.max === null ? 'no maximum' : String(a.max),
  f4(a.value), f4(a.giveaway), a.binding ? 'binding' : 'not binding', <Basis key="b">{a.basis}</Basis>,
]);

export const PmsMode = ({ pms, giveaway: gv, rules }) => {
  const pool = (
    <Tbl
      head={['component', 'cost $/bbl', 'SG', 'RON', 'MON', 'sulfur ppm', 'RVP psi', 'available bbl']}
      rows={APAPA_PMS_POOL.map((c) => [c.name, String(c.cost), String(c.sg), String(c.ron), String(c.mon), String(c.sulfurPpm), String(c.rvp), String(c.maxVolume)])}
    />
  );
  if (!usable(pms) || pms.status !== 'optimal') {
    return <>{pool}{pms && pms.error ? <Refused label="optimiseBlend" reason={pms.error} /> : <Empty>The recipe reader has returned nothing, so there is no recipe to show.</Empty>}</>;
  }
  const tpl = usable(rules) && Array.isArray(rules.templates) ? rules.templates.find((t) => t.id === 'gasoline_50ppm') : null;
  return (
    <>
      <Lead>APAPA makes an 8000 bbl PMS cargo from four bought-in components:</Lead>
      {pool}
      {tpl && (
        <>
          <Lead>{tpl.name}, the template&apos;s specifications and the basis each one blends on. A template is a starting shape, never a compliance source.</Lead>
          <Tbl head={['specification', 'basis', 'min', 'max', 'unit']} rows={tpl.specs.map((x) => [x.name, <Basis key="b">{x.basis}</Basis>, x.min === null ? 'no minimum' : String(x.min), x.max === null ? 'no maximum' : String(x.max), x.unit || 'no unit'])} />
        </>
      )}
      <Tbl head={['basis', 'w_i (numerator weight)', 'd_i (denominator weight)']} rows={ROW_BASES} />
      <Lead>The least-cost recipe, solved by optimiseBlend:</Lead>
      <Tbl head={['component', 'volume bbl', 'volume fraction', 'cost $']} rows={pms.recipe.map((x) => [x.name, f4(x.volume), f4(x.volumeFraction), f4(x.cost)])} />
      <Note>
        Total {f4(pms.totalVolume)} bbl for {f4(pms.totalCost)} $, unit cost {f4(pms.unitCost)} $/bbl. At their
        availability: {pms.atAvailability.length ? pms.atAvailability.join(', ') : 'nothing'}.
      </Note>
      <div className="h-48 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pms.recipe} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} />
            <Bar dataKey="volume" name="volume bbl" fill={SERIES[0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Lead>Achieved, recomputed by each specification&apos;s own rule. Binding rows are highlighted: the optimum is pressed against them.</Lead>
      <Tbl head={['specification', 'min', 'max', 'achieved', 'giveaway', 'binding', 'basis']} rows={specRows(pms.achieved)} highlight={(i) => pms.achieved[i].binding} />
      {usable(gv) && Array.isArray(gv.rows) && (
        <>
          <Lead>Giveaway is quality handed over for nothing. It is worth money only where a unit of the property has a price:</Lead>
          <Tbl head={['specification', 'giveaway', 'unit value $ per unit per bbl', 'value $ over the batch']} rows={gv.rows.map((x) => [x.name, f4(x.giveaway), x.unitValue === null ? 'not given' : String(x.unitValue), f4(x.value, 'not priced')])} />
          <Note>With no giveaway, so not listed: {gv.notListed.join(', ')}.</Note>
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

export const ReliefMode = ({
  pms, rel, drag, sweep, pick, limit, onPick, onLimit,
}) => {
  const key = typeof pick === 'string' ? pick : 'sulfurPpm.max';
  const [lo, hi, step] = LIMIT_RANGES[key] || LIMIT_RANGES['sulfurPpm.max'];
  const controls = (
    <div className="grid gap-3 sm:grid-cols-2">
      <SelectField label="Drag the limit on" value={key} onChange={(v) => onPick && onPick(v)} options={PMS_LIMITS.map((x) => [`${x.id}.${x.bound}`, `${x.name} ${x.bound === 'max' ? 'maximum' : 'minimum'}, ${x.value} ${x.unit}`])} />
      <Slider label="the limit" value={limit ?? lo} min={lo} max={hi} step={step} onChange={onLimit} />
    </div>
  );
  if (!usable(rel) || !Array.isArray(rel.rows)) return <>{controls}<Empty>The relief reader has returned nothing, so there is no price to show.</Empty></>;
  const binding = usable(pms) && Array.isArray(pms.bindingSpecs) ? pms.bindingSpecs : [];
  return (
    <>
      <Lead>
        The value of one unit of relief: the money SAVED by raising a maximum or lowering a minimum by one whole unit of
        the property, at the margin. rowPrice is the LP&apos;s price per unit of the row, printed beside it; for a
        specification row it is a different quantity in different units.
      </Lead>
      <Tbl
        head={['row', 'value of one unit of relief $', 'per', 'rowPrice']}
        rows={rel.rows.map((s) => [s.name, f4(s.price), s.per, <Shortcut key="r">{f4(s.rowPrice)}</Shortcut>])}
        highlight={(i) => binding.some((n) => rel.rows[i].name.startsWith(n))}
      />
      <Note>
        The sulfur row blends on mass, so one ppm of relief moves the row by sum(SG x volume), {f4(rel.sulfurScale)}:
        rowPrice x that sum is {f4(rel.sulfurRowTimesScale)}, and the value of relief is {f4(rel.sulfurPrice)} $ per ppm.
        The RVP row is in index units: rowPrice x the batch is {f4(rel.rvpPerIndex)} $ per index point, and the index
        slope at the limit, {f4(rel.rvpIndexSlope)} index points per psi, turns it into {f4(rel.rvpPrice)} $ per psi.
      </Note>
      {controls}
      {usable(drag) ? (
        <Tbl
          head={['limit', 'relief', 're-solved status', 're-solved cost $', 'saving the move made $', 'value of relief x relief $']}
          rows={[[`${drag.name} ${drag.limit} to ${drag.newLimit}`, String(drag.relief), drag.status, f4(drag.totalCost, 'no recipe'), f4(drag.saving, 'no recipe'), f4(drag.predicted)]]}
        />
      ) : <Empty>The re-solve has returned nothing.</Empty>}
      {Array.isArray(sweep) && (
        <div className="h-56 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sweep} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="limit" type="number" domain={['dataMin', 'dataMax']} tick={AXIS} />
              <YAxis tick={AXIS} />
              <Tooltip contentStyle={TOOLTIP} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line dataKey="saving" name="saving, re-solved" stroke={SERIES[2]} isAnimationActive={false} connectNulls={false} />
              <Line dataKey="predicted" name="shadow price x relief" stroke={SERIES[1]} strokeDasharray="4 2" dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <Note>A shadow price is a derivative at the optimum. One whole unit of relief can differ from it, because the rows move non-linearly in the limit and the optimal vertex can change.</Note>
      {usable(rel.marginal) && (
        <Tbl
          head={['figure', '$/bbl']}
          rows={[
            ['the volume row price, the marginal barrel', f4(rel.marginal.volumeRowPrice)],
            ['the unit cost, the average barrel', f4(rel.marginal.unitCost)],
            ['marginal minus average', f4(rel.marginal.marginalMinusAverage)],
            [`re-solved at ${rel.marginal.resolvedTarget} bbl, cost minus the optimum`, f4(rel.marginal.resolvedStep)],
          ]}
        />
      )}
      <Note>Non-binding, so relief saves nothing: {Array.isArray(rel.nonBinding) ? rel.nonBinding.join(', ') : 'none'}.</Note>
    </>
  );
};

// ---------------------------------------------------------------------------

export const AgoMode = ({ ago, agoVol }) => {
  if (!usable(ago) || ago.status !== 'optimal') return <Empty>The AGO reader has returned nothing, so there is no recipe to show.</Empty>;
  const vol = usable(agoVol) && Array.isArray(agoVol.recipe) ? agoVol : null;
  return (
    <>
      <Lead>A 6000 bbl AGO cargo to the 50 ppm diesel template. Viscosity at 40 C blends through the Refutas index on MASS.</Lead>
      <Tbl
        head={['component', 'cost $/bbl', 'SG', 'cetane', 'sulfur ppm', 'viscosity cSt', 'flash point C', 'available bbl']}
        rows={APAPA_AGO_POOL.map((c) => [c.name, String(c.cost), String(c.sg), String(c.cetane), String(c.sulfurPpm), String(c.viscosityCSt), String(c.flashPointC), String(c.maxVolume)])}
      />
      <Tbl
        head={['component', 'volume bbl, index on mass (the engine)', 'volume bbl, index on volume']}
        rows={ago.recipe.map((x, i) => [x.name, f4(x.volume), vol ? f4(vol.recipe[i].volume) : 'not formed'])}
      />
      <Note>Total cost {f4(ago.totalCost)} $, unit cost {f4(ago.unitCost)} $/bbl.</Note>
      <div className="h-48 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ago.recipe} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} />
            <Bar dataKey="volume" name="volume bbl" fill={SERIES[4]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['specification', 'achieved', 'giveaway', 'binding', 'value of one unit of relief $', 'per']}
        rows={ago.bySpec.map((s) => [s.name, f4(s.value), f4(s.giveaway), s.binding ? 'binding' : 'not binding', f4(s.price), s.per])}
        highlight={(i) => ago.bySpec[i].binding}
      />
      <Note>
        The recipe&apos;s viscosity with the index on mass (the engine) is {f4(ago.viscosityIndexOnMass)} cSt; with the same
        index on volume it reads {f4(ago.viscosityIndexOnVolume)} cSt. A price per unit of the property is per whole unit,
        so the density relief is dollars per kg/l.
      </Note>
      <Tbl
        head={['row', 'rowPrice', 'scale', 'rowPrice x scale', 'value of one unit of relief', 'per']}
        rows={ago.volumeRows.map((s) => [s.name, f4(s.rowPrice), f4(s.scale), f4(s.rowTimesScale), f4(s.price), s.per])}
      />
    </>
  );
};

// ---------------------------------------------------------------------------

export const RefusedMode = ({
  refd: ref, recipe, butane, onButane, blank, onBlank,
}) => {
  const controls = (
    <div className="grid gap-3 sm:grid-cols-2">
      <SelectField label="Butane availability" value={String(butane ?? '0')} onChange={(v) => onButane && onButane(v)} options={PROBES.butaneMaxima.map(([label], i) => [String(i), label])} />
      <SelectField label="Leave blank" value={typeof blank === 'string' ? blank : ''} onChange={(v) => onBlank && onBlank(v)} options={PMS_BLANKS.map(([k, label]) => [k, label])} />
    </div>
  );
  return (
    <>
      {controls}
      {usable(recipe) && recipe.status === 'optimal' ? (
        <>
          <Tbl head={['component', 'volume bbl']} rows={recipe.recipe.map((x) => [x.name, f4(x.volume)])} />
          <Note>
            Status {recipe.status}, total cost {f4(recipe.totalCost)} $. Binding: {recipe.bindingSpecs.join(', ') || 'nothing'}.
          </Note>
          {recipe.skippedSpecs.map((x) => <Refused key={x.id} label={`${x.name} skipped`} reason={x.reason} />)}
        </>
      ) : (recipe && recipe.error ? <Refused label={`optimiseBlend returned ${recipe.status}`} reason={recipe.error} /> : <Empty>The recipe reader has returned nothing.</Empty>)}
      {usable(ref) && Array.isArray(ref.availability) && (
        <>
          <Lead>A maximum left blank is no limit; a typed number is exactly that number, and a typed 0 is none:</Lead>
          <Tbl head={['butane maximum', 'status', 'butane bbl', 'total cost $', 'binding']} rows={ref.availability.map((x) => [x.label, x.status, f4(x.butane), f4(x.totalCost), x.binding.join(', ')])} />
          <Lead>Infeasible is an answer:</Lead>
          {ref.infeasible.map((x) => <Refused key={x.label} label={`${x.label}: ${x.status}`} reason={x.reason} />)}
          <Tbl head={['one limit of the 10 ppm template moved back', '10 ppm', '50 ppm', 'status']} rows={ref.movedBack.map((x) => [`${x.name} ${x.key === 'min' ? 'minimum' : 'maximum'}`, String(x.t10), String(x.t50), x.status])} />
          <Tbl head={['one limit of the 50 ppm template tightened', '50 ppm', '10 ppm', 'status']} rows={ref.tightened.map((x) => [`${x.name} ${x.key === 'min' ? 'minimum' : 'maximum'}`, String(x.t50), String(x.t10), x.status])} />
          <Lead>What optimiseBlend refuses, each in its own words:</Lead>
          {ref.refusals.map((x) => <Refused key={x.label} label={x.label} reason={x.reason} />)}
          <Tbl head={['asked', 'status', 'total cost $', 'skipped', 'reason (the engine)']} rows={ref.skipped.map((x) => [x.label, x.status, f4(x.totalCost), x.skipped, x.reason])} />
          {usable(ref.floor) && (
            <Note>
              A component floor: Isomerate at least {PROBES.isoFloor} bbl solves {ref.floor.status} at {f4(ref.floor.totalCost)} $, with
              sulfur relief at {f4(ref.floor.sulfurRelief)} $ per ppm and butane {f4(ref.floor.butane)} bbl against its
              availability of {ref.floor.butaneCap}.
            </Note>
          )}
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const RecipeExplorer = ({ initialMode = 'relief' }) => {
  const [mode, setMode] = useState(initialMode);
  const [row, setRow] = useState(0);
  const [rhs, setRhs] = useState(TEXTBOOK_LP.b[0]);
  const [pick, setPick] = useState('sulfurPpm.max');
  const [limit, setLimit] = useState(51);
  const [butane, setButane] = useState('0');
  const [blank, setBlank] = useState('');

  const drag = useMemo(() => (mode === 'lp' ? safe(() => textbookDrag(row, rhs)) : null), [mode, row, rhs]);
  const cases = useMemo(() => (mode === 'lp' ? safe(lpCases) : null), [mode]);
  const pms = useMemo(() => (mode === 'pms' || mode === 'relief' ? safe(() => pmsRecipe()) : null), [mode]);
  const gv = useMemo(() => (mode === 'pms' ? safe(() => giveaway()) : null), [mode]);
  const rules = useMemo(() => (mode === 'pms' ? safe(blendingRules) : null), [mode]);
  const rel = useMemo(() => (mode === 'relief' ? safe(relief) : null), [mode]);
  const [pid, pbound] = pick.split('.');
  const rdrag = useMemo(() => (mode === 'relief' ? safe(() => reliefResolve(pid, pbound, limit)) : null), [mode, pid, pbound, limit]);
  const sweep = useMemo(() => (mode === 'relief' ? safe(() => reliefSweep(pid, pbound)) : null), [mode, pid, pbound]);
  const ago = useMemo(() => (mode === 'ago' ? safe(() => agoRecipe()) : null), [mode]);
  const agoVol = useMemo(() => (mode === 'ago' ? safe(() => agoRecipe({ indexOnMass: false })) : null), [mode]);
  const ref = useMemo(() => (mode === 'refused' ? safe(refusedAndSkipped) : null), [mode]);
  const recipe = useMemo(() => {
    if (mode !== 'refused') return null;
    const b = PROBES.butaneMaxima[Number(butane)] || PROBES.butaneMaxima[0];
    const bl = (PMS_BLANKS.find(([k]) => k === blank) || PMS_BLANKS[0])[2];
    return safe(() => pmsRecipe({ butaneMax: b[1], blank: bl }));
  }, [mode, butane, blank]);

  const onPick = (v) => {
    setPick(v);
    const x = PMS_LIMITS.find((q) => `${q.id}.${q.bound}` === v);
    if (x) setLimit(x.value);
  };
  const onRow = (v) => { setRow(v); setRhs(TEXTBOOK_LP.b[v]); };

  return (
    <PanelShell
      title="Recipe explorer"
      subtitle="The least-cost recipe as a linear programme: the textbook LP in two dimensions, then the APAPA terminal's PMS and AGO pools. Shadow prices are the value of one unit of relief, per whole unit of the property, with rowPrice beside them."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'lp' && <LpMode drag={drag} cases={cases} row={row} rhs={rhs} onRow={onRow} onRhs={setRhs} />}
        {mode === 'pms' && <PmsMode pms={pms} giveaway={gv} rules={rules} />}
        {mode === 'relief' && <ReliefMode pms={pms} rel={rel} drag={rdrag} sweep={sweep} pick={pick} limit={limit} onPick={onPick} onLimit={setLimit} />}
        {mode === 'ago' && <AgoMode ago={ago} agoVol={agoVol} />}
        {mode === 'refused' && <RefusedMode refd={ref} recipe={recipe} butane={butane} onButane={setButane} blank={blank} onBlank={setBlank} />}
      </div>
      <Note>
        Every recipe, price and refusal on this page is a return value of the vendored productBlending module and its LP
        kernel through the teaching lab, printed to four decimals. Every component, price and specification is invented
        and illustrative.
      </Note>
    </PanelShell>
  );
};

export default RecipeExplorer;
