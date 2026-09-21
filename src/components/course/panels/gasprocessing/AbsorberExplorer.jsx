import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  stagedDevice, acidGasByMoles, threeAmines, vesselGasGoesUp, flagControls,
  KREMSER_FACTORS, UBIE, UBIE_CONTACTOR,
} from './gasprocessingLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Absorber explorer, the Professional tier.
//
// A CONTACTOR IS NOT A TANK. Read as a staged device it grows a ceiling that no
// amount of steel buys past: below an absorption factor of one the removal
// cannot exceed the factor itself however many trays are bought, and the
// engine's refusal names the remedy as more solvent rather than more stages.
// The ceiling is drawn explicitly here, because a surface that only climbs
// teaches the opposite lesson.
//
// THE SAME COLUMN ANSWERS A SECOND QUESTION BY A DIFFERENT ROUTE. The amine
// half is a mole balance with a loading swing and arrives at a circulation for
// reasons the stage relation knows nothing about, so the two are kept on
// separate views and the panel says which question each answers.
//
// THE EQUATION UNDER THE VESSEL IS NOT THIS COURSE'S. Souders-Brown, the K
// value and the settling velocity belong to the Separation & Slug Catching
// course, which owns the published K rows and the mist extractor that sets
// them. This panel draws no K-value chart and re-derives nothing: what is new
// here is the DUTY, a mass transfer column rather than a knockout drum.
//
// Every figure on this page is a return value from gasprocessingLab. Nothing
// here computes a removal, a circulation or a diameter, and nothing reads a
// clock.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no percentile
// label appears anywhere on this page.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const nine = (v) => (Number.isFinite(v) ? Number(v).toFixed(9) : 'none');

export const MODES = [
  ['kremser', 'The Kremser surface, and the ceiling a factor below one puts on it'],
  ['stages', 'The other direction: the stages a spec demands, and the spec that has none'],
  ['moles', 'Acid gas removed by moles: the lean loading, the rich loading and the swing'],
  ['amines', 'Three amines at their own values, and two orderings that are not the same size'],
  ['vessel', 'The vessel the gas goes up, whose equation belongs to another course'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const SERIES = ['#38bdf8', '#f472b6', '#BFFF00', '#fbbf24', '#a78bfa', '#34d399', '#fb7185'];

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

export const KremserMode = ({ k }) => {
  if (!k) return <Note>The stage reader did not return a surface.</Note>;
  const chart = k.surface.map((row) => {
    const point = { stages: row.stages };
    KREMSER_FACTORS.forEach((a, i) => { point[`a${String(a).replace('.', '_')}`] = row.removals[i]; });
    return point;
  });
  return (
    <>
      <TileGrid>
        <Tile label="Removal at the stated working point" value={nine(k.obiafuRemoval)} />
        <Tile label="Factors swept" value={String(KREMSER_FACTORS.length)} />
        <Tile label="Stage counts swept" value={String(k.surface.length)} />
        <Tile label="Ceiling rows read" value={String(k.ceiling.length)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="stages" tick={AXIS} label={{ value: 'theoretical stages', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} domain={[0, 1]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => nine(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {KREMSER_FACTORS.map((a, i) => (
              <ReferenceLine
                key={`ceil${a}`}
                y={a < 1 ? a : null}
                stroke={SERIES[i % SERIES.length]}
                strokeDasharray="2 4"
                ifOverflow="hidden"
              />
            ))}
            {KREMSER_FACTORS.map((a, i) => (
              <Line key={a} dataKey={`a${String(a).replace('.', '_')}`} name={`A = ${a}`} stroke={SERIES[i % SERIES.length]} dot={false} isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The dashed lines are the CEILING. For every absorption factor below one the removal flattens onto the factor
        itself and stops, and the dashed line it stops on is drawn at that factor. Above one there is no dashed line and
        no ceiling, and the curve climbs towards total removal as the stages are added.
      </Note>
      <Tbl
        head={['A', 'removal at 12 stages', 'removal at 200 stages', 'A itself', '200 stages less A']}
        rows={k.ceiling.map((r) => [six(r.absorptionFactor), nine(r.at12), nine(r.at200), nine(r.absorptionFactor), nine(r.gapDerived)])}
      />
      <Note>
        Read the last column only on the rows where the factor is below one. At and above unity there is no ceiling to
        measure against, so that column is arithmetic about the table rather than physics about the absorber. At exactly
        one the closed form is indeterminate and the engine takes a separate branch, and the two rows a billionth either
        side of it are continuous with it, which is what says the branch is a limit rather than a patch.
      </Note>
    </>
  );
};

export const StagesMode = ({ k, f }) => {
  if (!k) return <Note>The stage reader did not return a solve.</Note>;
  return (
    <>
      <Tbl
        head={['A', 'removal wanted', 'stages', 'check: removal at those stages']}
        rows={k.solvedBack.map((r) => [six(r.absorptionFactor), six(r.fractionRemoved), r.error ? 'refuses' : nine(r.stages), r.checkRemoval === null ? 'none' : nine(r.checkRemoval)])}
      />
      <Note>
        The last column is the answer put back through the forward relation. A stage count that does not reproduce the
        removal it was solved for would say the two branches disagree.
      </Note>
      {k.starvedRefusal && (
        <Refusal
          label="A spec a starved absorber cannot reach at any stage count"
          message={k.starvedRefusal}
          evidence="The refusal names the remedy, which is more solvent rather than more trays, and hands back the ceiling it capped at."
        />
      )}
      {f && (
        <>
          <p className="text-xs text-slate-400 mt-3 mb-0">
            WHAT ACTUALLY REFUSES IS NOT WHAT IT LOOKS LIKE. A factor below one looks like the thing that has no stage
            count. It is not: what refuses is a factor at or below the REMOVAL the spec asks for. The middle row below is
            the case that tells the two apart.
          </p>
          <Tbl
            head={['A', 'removal wanted', 'A is below one', 'A is at or below the removal', 'the engine']}
            rows={f.ceilingCases.map((c) => [six(c.absorptionFactor), six(c.fractionRemoved), String(c.belowUnityPredicate), String(c.ceilingPredicate), c.refused ? 'refuses' : 'answers'])}
          />
          <Note>
            The third column is true for a case that answers and for a case that refuses, so it separates nothing. The
            fourth column is the engine&apos;s own test and it separates them exactly.
          </Note>
        </>
      )}
    </>
  );
};

export const MolesMode = ({ m }) => {
  if (!m) return <Note>The mole balance reader did not return a sweep.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Lean loading, an input" value={six(UBIE.leanLoading)} unit="mol/mol" />
        <Tile label="Rich loading, an input" value={six(m.richLoadingUsed)} unit="mol/mol" />
        <Tile label="Loading swing, the difference" value={nine(m.swingDerived)} unit="mol/mol" />
        <Tile label="Acid gas picked up" value={four(m.acidMolesDay)} unit="lbmol/day" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Three names and three different numbers. The rich loading is a CEILING that corrosion sets. The swing is a
        THROUGHPUT that the regenerator buys, it is the difference between the two loadings, and it is what sets the
        circulation of {six(m.circGpm)} gpm and the {six(m.reboilerMMBtuHr)} MMBtu an hour of regenerator. The engine
        returns the two loadings and never the swing.
      </p>
      <Tbl
        head={['rich loading', 'swing', 'circulation, gpm', 'regenerator, MMBtu/hr', 'warned']}
        rows={m.richSweep.map((r) => [six(r.richLoading), nine(r.swingDerived), six(r.circGpm), six(r.reboilerMMBtuHr), r.warned ? 'yes' : 'no'])}
      />
      <Tbl
        head={['lean loading', 'swing', 'circulation, gpm', 'regenerator, MMBtu/hr', 'MMBtu/hr per gpm']}
        rows={m.leanSweep.map((r) => [six(r.leanLoading), nine(r.swingDerived), six(r.circGpm), six(r.reboilerMMBtuHr), nine(r.perGpmDerived)])}
      />
      <Note>
        Read the last two columns of the lean table together before reading any sentence about them. In this model a
        leaner lean costs nothing: the circulation falls AND the regenerator falls, because the duty per gallon is a
        stated input the engine never changes, so the duty is the circulation in other units. On a real regenerator
        stripping a solution leaner is work, and none of that work is in this engine. The table says honestly how much
        SOLUTION a given lean loading has to move, which is the answer a mole balance is entitled to give.
      </Note>
      {m.lookalikeRefusals.map((r) => <Refusal key={r.label} label={r.label} message={r.error} />)}
      <Tbl
        head={['case', 'gpm engine', 'gpm golden', 'ratio', 'MMBtu/hr engine', 'MMBtu/hr golden', 'ratio']}
        rows={m.published.map((r) => [r.amineId, six(r.circGpm), six(r.circGpmGolden), nine(r.circRatioDerived), six(r.reboilerMMBtuHr), six(r.reboilerMMBtuHrGolden), nine(r.reboilerRatioDerived)])}
      />
      <Note>
        Every ratio in that table is the same number and it is not one. The whole balance is a mole balance, so every
        figure in it carries the standard molar volume, and the oracle builds that volume from a different gas constant.
      </Note>
    </>
  );
};

export const AminesMode = ({ a }) => {
  if (!a) return <Note>The amine reader did not return its table.</Note>;
  return (
    <>
      <Tbl
        head={['amine', 'molecular weight', 'typical strength, wt %', 'customary rich limit', 'customary duty, Btu/gal', 'solution gravity']}
        rows={a.propertyRows.map((r) => [r.id, six(r.mw), six(r.wtPctTypical), six(r.maxLoading), six(r.heatBtuPerGal), six(r.sgSolution)])}
      />
      <Tbl
        head={['amine', 'circulation, gpm', 'regenerator, MMBtu/hr', 'rich used', 'MMBtu/hr per gpm']}
        rows={a.runs.map((r) => [r.id, six(r.circGpm), six(r.reboilerMMBtuHr), six(r.richLoadingUsed), nine(r.perGpmDerived)])}
      />
      <Tbl
        head={['pair', 'circulation ratio', 'duty ratio']}
        rows={a.pairs.map((r) => [`${r.left} over ${r.right}`, nine(r.circRatioDerived), nine(r.dutyRatioDerived)])}
      />
      <Note>
        The two ratio columns are not equal, and that is the whole point of the table. Circulation is set by the rich
        limit and the strength; duty is set by the rich limit, the strength and the duty per gallon. The same ordering is
        reached by two routes and the gaps between the amines are different sizes on each.
      </Note>
      {a.unknownAmineRefusal && (
        <Refusal
          label="An amine the table does not carry"
          message={a.unknownAmineRefusal}
          evidence="This is the one catalogue lookup in the module and it says it does not know rather than guessing."
        />
      )}
      <Held>
        The three amines property set. The molecular weights are chemistry; the typical strengths, the rich limits, the
        duties and the solution gravities are customary practice with no source in this package. Taught as a limit and
        never as an answer.
      </Held>
    </>
  );
};

export const VesselMode = ({ v }) => {
  if (!v) return <Note>The vessel reader did not return a sizing.</Note>;
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        THE EQUATION IS NOT NEW. Souders-Brown, the K value and the settling velocity are owned by the Separation and
        Slug Catching course, which teaches the published K rows and the mist extractor that sets them. There is no
        K-value chart on this page. What is new here is the duty: a contactor is a mass transfer column, sized on the gas
        that has to rise through a descending liquid.
      </p>
      <TileGrid>
        <Tile label="Gas density at column conditions" value={six(v.ubie.rhoG)} unit="lb/ft3" />
        <Tile label="Compressibility the engine formed" value={nine(v.ubie.z)} />
        <Tile label="Allowed velocity" value={six(v.ubie.vAllowFtS)} unit="ft/s" />
        <Tile label="Diameter" value={six(v.ubie.diameterFt)} unit="ft" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The compressibility is not an input on that row. The engine formed it from the same correlation the rest of the
        platform uses, at {six(UBIE_CONTACTOR.pPsia)} psia and {six(UBIE_CONTACTOR.tF)} degF, and reports where it came
        from as {v.zSourceFormed}. Handed one instead, it reports {v.zSourceGiven}.
      </p>
      <Tbl
        head={['psia', 'degF', 'gravity', 'z', 'gas density, lb/ft3', 'allowed velocity, ft/s', 'diameter, ft']}
        rows={v.zSurface.map((r) => [six(r.pPsia), six(r.tF), six(r.gasSg), nine(r.z), six(r.rhoG), six(r.vAllowFtS), six(r.diameterFt)])}
      />
      <Tbl
        head={['K, ft/s', 'allowed velocity, ft/s', 'diameter, ft']}
        rows={v.kSweep.map((r) => [six(r.ksFtS), six(r.vAllowFtS), six(r.diameterFt)])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The liquid the gas rises against is an input. The same published case sized against glycol comes out
        {' '}{nine(v.thirdAgainstGlycolFt)} ft and against MDEA solution {nine(v.thirdAgainstAmineFt)} ft, a factor of
        {' '}{nine(v.thirdLiquidFactorDerived)}. A column sized against the wrong fluid is confidently the wrong width.
      </p>
      <Tbl
        head={['amine', 'solution density, lb/ft3']}
        rows={v.amineLiquids.map((r) => [r.id, six(r.lbPerFt3)])}
      />
      <Held>
        The contactor liquid density. It is declared, and the module&apos;s default is a glycol density, which is the
        wrong fluid for an amine column. Taught as a limit and never as an answer, which is why no graded field in this
        course is a contactor diameter.
      </Held>
    </>
  );
};

const AbsorberExplorer = ({ initialMode = 'kremser' }) => {
  const [mode, setMode] = useState(initialMode);
  const k = useMemo(() => ((mode === 'kremser' || mode === 'stages') ? safe(stagedDevice) : null), [mode]);
  const f = useMemo(() => (mode === 'stages' ? safe(flagControls) : null), [mode]);
  const m = useMemo(() => (mode === 'moles' ? safe(acidGasByMoles) : null), [mode]);
  const a = useMemo(() => (mode === 'amines' ? safe(threeAmines) : null), [mode]);
  const v = useMemo(() => (mode === 'vessel' ? safe(vesselGasGoesUp) : null), [mode]);

  return (
    <PanelShell
      title="Absorber explorer"
      subtitle="UBIE and a generic absorber: the Kremser relation in both directions with its ceiling drawn, the mole balance and its loading swing, the three amines at their own values, and the vessel the gas goes up."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'kremser' && <KremserMode k={k} />}
        {mode === 'stages' && <StagesMode k={k} f={f} />}
        {mode === 'moles' && <MolesMode m={m} />}
        {mode === 'amines' && <AminesMode a={a} />}
        {mode === 'vessel' && <VesselMode v={v} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored Gas Processing engine, printed to the precision the
        lessons use. Gas is in MMscfd, pressures in psia, temperatures in degF, acid gas in mol percent and
        lbmol a day, solution in gpm, heat in MMBtu an hour and vessels in feet.
      </Note>
    </PanelShell>
  );
};

export default AbsorberExplorer;
