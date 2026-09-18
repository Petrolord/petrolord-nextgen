import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  OGBOGENE, fireCase, fireBands, straightRun, heldRegister,
} from './meteringLab';
import {
  PanelShell, NumField, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import { Relation, Refusal } from './MeterRunExplorer';

// THE TWO WITHHELD ANSWERS. This panel exists so a learner sees a refusal as a
// thing the software DOES rather than as a gap in a lesson, and so that they
// can drive an input into one and watch it refuse by name.
//
// THE FIRE VENT. The tank engine computes the fire heat input from the wetted
// area and then refuses to turn it into a required vent capacity, because the
// relation that would do that is not in the package and the two plausible forms
// of it differ by a factor of about 24. An emergency vent sized 24 times too
// small is how a tank is destroyed. Move the liquid level and the diameter
// anywhere at all: the duty moves, the band name changes, and the vent comes
// back empty every single time with the engine's own reason beside it.
//
// THE STRAIGHT RUN FOR TWO ELBOWS IN DIFFERENT PLANES. The metering engine
// refuses that column by name. In its own words the figures it could offer
// fall as beta rises and then rise again, and a published requirement rises
// with beta. The column is shown AS WITHHELD, with the reason.
//
// NEITHER IS GRADED ANYWHERE IN THIS COURSE, and nothing downstream of either
// is graded. This panel never presents either as an answer.
//
// A WITHHELD ANSWER IS NEVER A BLANK, A ZERO, A DASH OR A PLACEHOLDER. All four
// read as a number the tool failed to compute rather than as an answer that is
// being refused, which is the opposite of what this course is teaching.
//
// Every number on this page is a return value from meteringLab, which is a
// return value from the vendored engines. This panel computes no quantity,
// imports no engine, reads no clock and draws no random number.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const raw = (v) => (v === null || v === undefined ? 'none' : String(v));
const num = (v, fallback) => (Number.isFinite(Number(v)) && String(v).trim() !== '' ? Number(v) : fallback);

export const MODES = [
  ['fire', 'The fire case: the duty computed and the vent refused'],
  ['bands', 'The heat input bands, walked, with every edge found by bisecting the band name'],
  ['straight', 'The straight-run table, and the column that is withheld'],
  ['register', 'The register: everything these three engines do not carry or do not cite'],
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

/** THE ANSWER THAT IS BEING REFUSED: the word withheld, and the engine's own
 *  reason under it. A blank, a zero, a dash or a placeholder would all read as
 *  a number the tool failed to compute rather than as an answer being refused,
 *  so this component uses none of the four. */
export const Withheld = ({ label, reason }) => (
  <div className="mt-3 rounded-md border border-red-800/60 bg-red-950/20 p-3">
    <p className="text-slate-500 text-xs mb-1">{label}</p>
    <p className="text-red-300 text-base font-medium mb-2">withheld</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{reason}</p>
  </div>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const FireMode = ({ f }) => {
  if (!f) return <Note>The fire reader did not answer.</Note>;
  if (f.refused) return <Refusal label="The engine will not compute this fire case" message={f.error} />;
  return (
    <>
      <TileGrid>
        <Tile label="Wetted area" value={four(f.areaFt2)} unit="ft2" />
        <Tile label="Effective wetted height" value={six(f.effectiveHeightFt)} unit="ft" />
        <Tile label="Heat input band" value={raw(f.band)} />
        <Tile label="Fire duty" value={four(f.qBtuHr)} unit="Btu/hr" />
        <Tile label="Environment factor" value={six(f.environmentFactor)} />
        <Tile label="The vent is withheld" value={String(f.ventWithheld)} />
        <Tile label="The reason is the exported constant" value={String(f.reasonIsTheExportedConstant)} />
        <Tile label="Required vent capacity" value="withheld" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        THE DUTY IS COMPUTED AND THE VENT IS WITHHELD. Move the liquid level and the diameter and watch the wetted area
        move, the band name change and the duty follow. The required vent capacity comes back empty at every one of
        them. The engine exports that sentence as a named constant, which is what stops a screen printing a blank where
        the vent should be, and this page checks that the returned reason and the exported constant are the same
        string: {String(f.reasonIsTheExportedConstant)}.
      </p>
      <Withheld label="Required vent capacity, scfh of air equivalent" reason={f.ventWithheldReason} />
      <Refusal label="The engine's note on the height cap" message={f.heightCapNote} />
      <Refusal label="The engine's warning on a tank this large" message={f.warning} />
      <div className="mt-3 rounded-md border border-slate-700 bg-[#0F172A] p-2">
        <p className="text-xs text-slate-300 font-mono mb-0">{f.comparisonNote}</p>
      </div>
      <Relation r={f.creditRelation} />
      <Refusal label="An environment factor used as a penalty" message={f.penaltyRefusal} />
      <Note>
        Nothing on this page is graded anywhere in this course, and nothing downstream of it is graded either. It is
        taught as a limit. Size the vent from the standard against the heat input above, or from the vent
        manufacturer&apos;s certified capacity curve, which is what the engine&apos;s own sentence tells you to do.
      </Note>
    </>
  );
};

export const BandsMode = ({ b }) => {
  if (!b) return <Note>The band reader did not answer.</Note>;
  const chart = b.rows.map((r) => ({ area: r.wettedFt2, duty: r.qBtuHr }));
  return (
    <>
      <TileGrid>
        <Tile label="Bands the engine carries" value={raw(b.bands.length)} />
        <Tile label="Edges measured" value={raw(b.edges.length)} />
        <Tile label="Every vent is empty" value={String(b.everyVentIsNull)} />
        <Tile label="Every edge discriminates" value={String(b.edges.every((e) => e.edge.discriminates))} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The wetted area at which each band gives way to the next is found by bisecting the band NAME the engine
        returns, rather than by reading a number out of the source. Tree: {b.countTree}. Rule: {b.countRule}.
      </p>
      <Tbl
        head={['wetted area, ft2', 'band', 'duty, Btu/hr', 'vent, scfh']}
        rows={b.rows.map((r) => [four(r.wettedFt2), r.band, four(r.qBtuHr), r.ventScfhAir === null ? 'withheld' : four(r.ventScfhAir)])}
      />
      <Tbl
        head={['band edge', 'wetted area, ft2', 'the duty there, Btu/hr', 'halvings', 'discriminates']}
        rows={b.edges.map((e) => [`${e.from} gives way to ${e.to}`, four(e.edge.at), four(e.qAtEdgeBtuHr), raw(e.edge.halvings), String(e.edge.discriminates)])}
      />
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="area" tick={AXIS} label={{ value: 'wetted area, ft2', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {b.edges.map((e) => (
              <ReferenceLine key={e.to} x={e.edge.at} stroke="#f472b6" strokeDasharray="3 3" />
            ))}
            <Line dataKey="duty" name="fire duty, Btu/hr" stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The duty column is full at every one of those areas. The vent column is empty at every one of them, and it says
        withheld rather than a blank, a zero or a dash, because all three of those read as a number the tool failed to
        compute rather than as an answer that is being refused.
      </p>
      <Withheld label="Required vent capacity, at every wetted area above" reason={b.withheldReason} />
    </>
  );
};

export const StraightMode = ({ s }) => {
  if (!s) return <Note>The straight-run reader did not answer.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Fittings this engine refuses to answer for" value={raw(s.refusedFittings.length)} />
        <Tile label="Which one" value={s.refusedFittings.join(', ') || 'none'} />
        <Tile label="The table stops above a beta of" value={six(s.tableMaxBeta)} />
        <Tile label="The reason is the exported constant" value={String(s.withheldReasonIsTheEngineConstant)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Straight-run requirements are table values. They depend on the beta and on what is upstream, and the engine
        says it is not calculating them. None of the columns is cited to a document in this repository, and one of them
        is withheld by name. Tree: {s.countTree}. Rule: {s.countRule}.
      </p>
      <Tbl
        head={['fitting', ...s.betas.map((b) => `beta ${b}`)]}
        rows={s.rows.map((r) => [
          r.fitting,
          ...r.cells.map((c) => (c.withheld ? 'withheld' : raw(c.upstreamDiameters))),
        ])}
      />
      <Withheld label="The straight run for two elbows in different planes, at every beta above" reason={s.withheldReason} />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        AND THE CEILING. Above the last row of the table the engine refuses rather than reading off the last row:
      </p>
      <Refusal label="A beta above where the table stops" message={s.ceilingRefusal} />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The note every answered row carries, in the engine&apos;s own words. Quoted exactly, because a learner running
        the shipped app sees these words:
      </p>
      <div className="mt-2 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
        <p className="text-xs text-slate-300 font-mono mb-0">{s.answeredRowNote}</p>
      </div>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The downstream requirement steps up above a beta of {six(s.downstreamEdge.at)}, found by bisecting the number
        the engine returns rather than by reading the table: {raw(s.downstreamEdge.readingFrom)} diameters below it and
        {' '}{raw(s.downstreamEdge.readingTo)} above.
      </p>
    </>
  );
};

export const RegisterMode = ({ h }) => {
  if (!h) return <Note>The register reader did not answer.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Items in the register" value={raw(h.count)} />
        <Tile label="Of them, outright refusals" value={raw(h.refusalCount)} />
        <Tile label="Both refusals proved by calling them" value={String(h.bothRefusalsProved.every((x) => x.holds))} />
        <Tile label="Items carrying the engine's own words" value={raw(h.rows.filter((r) => r.words).length)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Every row below is the ENGINE&apos;S OWN SENTENCE, fetched by calling the engine or by reading a constant it
        exports, rather than typed onto this page. Nothing in this course is graded on any of them.
        Tree: {h.countTree}. Rule: {h.countRule}.
      </p>
      <Tbl
        head={['', 'engine', 'the item', 'refusal']}
        rows={h.rows.map((r) => [r.id, r.engine, r.item, r.refusal ? 'yes' : ''])}
      />
      <div className="mt-3 space-y-2">
        {h.rows.map((r) => (
          <div key={r.id} className={`rounded-md border p-2 ${r.refusal ? 'border-red-800/60 bg-red-950/20' : 'border-amber-700/60 bg-amber-950/20'}`}>
            <p className={`text-xs font-medium mb-1 ${r.refusal ? 'text-red-300' : 'text-amber-300'}`}>{r.id}: {r.item}</p>
            <p className="text-xs text-slate-300 font-mono mb-0">{r.words}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-3 mb-0">BOTH REFUSALS PROVED, BY CALLING THEM:</p>
      <Tbl
        head={['the claim', 'it holds']}
        rows={h.bothRefusalsProved.map((x) => [x.claim, String(x.holds)])}
      />
    </>
  );
};

const WithheldExplorer = ({ initialMode = 'fire' }) => {
  const [mode, setMode] = useState(initialMode);
  const [liquidLevelFt, setLevel] = useState(String(OGBOGENE.liquidLevelFt));
  const [diameterFt, setDiameter] = useState(String(OGBOGENE.diameterFt));
  const [environmentFactor, setEnvironment] = useState('1');

  const f = useMemo(() => (mode === 'fire' ? safe(() => fireCase({
    liquidLevelFt: num(liquidLevelFt, OGBOGENE.liquidLevelFt),
    diameterFt: num(diameterFt, OGBOGENE.diameterFt),
    environmentFactor: num(environmentFactor, 1),
  })) : null), [mode, liquidLevelFt, diameterFt, environmentFactor]);

  const b = useMemo(() => (mode === 'bands' ? safe(fireBands) : null), [mode]);
  const s = useMemo(() => (mode === 'straight' ? safe(() => straightRun()) : null), [mode]);
  const h = useMemo(() => (mode === 'register' ? safe(heldRegister) : null), [mode]);

  return (
    <PanelShell
      title="Withheld explorer"
      subtitle="The two answers these engines refuse to give, shown as the refusals they are. The fire heat input is computed and the required vent capacity comes back empty with the engine's own reason beside it, at every wetted area you can reach. The straight run for two elbows in different planes is shown as a withheld column. Neither is graded anywhere in this course."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <NumField label="Liquid level, ft" value={liquidLevelFt} onChange={setLevel} />
        <NumField label="Diameter, ft" value={diameterFt} onChange={setDiameter} />
        <NumField label="Environment factor" value={environmentFactor} onChange={setEnvironment} />
      </FieldGrid>
      <Note>
        Set the environment factor above one and the engine refuses it by name: that factor is a credit for drainage,
        insulation or a water spray, and a figure above one would be a penalty the relation does not carry.
      </Note>
      <div className="mt-3">
        {mode === 'fire' && <FireMode f={f} />}
        {mode === 'bands' && <BandsMode b={b} />}
        {mode === 'straight' && <StraightMode s={s} />}
        {mode === 'register' && <RegisterMode h={h} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored engines, reached through the teaching lab. Wetted
        areas in square feet and fire duties in Btu an hour print to four decimals; betas and heights to six. Every
        sentence in a box is the engine&apos;s own text, quoted rather than paraphrased, because a paraphrase teaches a
        sentence the learner will never see on the screen.
      </Note>
    </PanelShell>
  );
};

export default WithheldExplorer;
