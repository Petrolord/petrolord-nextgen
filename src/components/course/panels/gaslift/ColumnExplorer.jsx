import React, { useMemo, useState } from 'react';
import {
  ComposedChart, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot,
} from 'recharts';
import ChartFrame from '@/components/charts/ChartFrame';
import { GRID_STYLE, TOOLTIP_STYLE, LEGEND_PROPS, XAXIS_LABEL_HEIGHT } from '@/utils/chartTheme';
import { seriesColor, AXIS_TICK, SVG_CHART } from '@/utils/chartSvg';
import {
  RULE_OF_THUMB_PSI_PER_FT, REFINEMENT_STEPS, CLOSED_FORM_STEPS, PUBLISHED_DESIGN_IDS,
  columnExplorer, refinementTargets, typedGasColumn, TYPED_COLUMN_DEFAULT,
} from './gasLiftLab';
import { plain, typedState, GEOTHERM_FIELDS, TypedFieldList, Refusal } from './TypedDesignFields';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Column explorer, the Associate tier. The layer every depth and every dome
// charge in a gas lift design stands on: the weight of the injection gas in the
// annulus.
//
// Four modes. What the real column does against the flat rule of thumb, the
// local gradient with its ISOTHERMAL CONTROL beside it, the step refinement
// study against three references, and the three straight lines whose first
// crossing is the top valve.
//
// Every figure on this page is a return value from gasLiftLab, which is a
// return value from the vendored gas lift engine. Nothing here marches a
// column, differentiates a pressure or locates a crossing.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : 'n/a');

const tiny = (v) => {
  if (!Number.isFinite(v)) return 'n/a';
  if (v === 0) return '0';
  return Math.abs(v) < 0.0005 ? v.toExponential(3) : fmt(v, 8);
};

const MODES = [
  ['column', 'The real column against the flat rule of thumb'],
  ['gradient', 'The local gradient, and the same column with its temperature held'],
  ['convergence', 'Three references against one march'],
  ['lines', 'Three straight lines, and where the first two meet'],
  ['typed', 'Your well, typed'],
];

const AXIS = AXIS_TICK;
const TOOLTIP = TOOLTIP_STYLE;
const GRID = <CartesianGrid {...GRID_STYLE} />;

const columnOptions = () => columnExplorer.columnIds.map((i) => [String(i), `published column ${i}`]);

const Column = () => {
  const [pick, setPick] = useState('1');
  const all = useMemo(() => {
    try {
      return columnExplorer.columnIds.map((i) => ({ i, ...columnExplorer.column(i) }));
    } catch { return null; }
  }, []);
  if (!all || !all.length || all.some((c) => !c.rows || !c.rows.length)) {
    return <Note>A column needs a surface pressure, a gravity and a temperature profile before anything can be marched down it. With any of the three missing the engine has no column to weigh, so there is no pressure at depth to compare a rule of thumb against.</Note>;
  }
  const c = all.find((x) => String(x.i) === pick) || all[0];
  const low = all.find((x) => x.verdict.ruleReadsHigh);
  const high = all.find((x) => x.verdict.ruleReadsLow);
  const bottom = c.rows[c.rows.length - 1];
  return (
    <>
      <FieldGrid>
        <SelectField label="Published column" value={pick} onChange={setPick} options={columnOptions()} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Surface pressure" value={fmt(c.rows[0].pSurfPsia, 1)} unit="psia" />
          <Tile label="Gas gravity" value={fmt(c.rows[0].gasSg, 3)} />
          <Tile label="Depth at the packer" value={fmt(bottom.tvdFt, 0)} unit="ft TVD" />
          <Tile label="The engine reads there" value={fmt(bottom.enginePsia, 4)} unit="psia" />
          <Tile label="The flat rule reads there" value={fmt(bottom.flatPsia, 4)} unit="psia" />
          <Tile label="The rule less the engine" value={fmt(c.verdict.missAtPackerPsi, 4)} unit="psi" />
          <Tile label="As a share of the lift" value={fmt(c.verdict.missAsPctOfLift, 4)} unit="%" />
          <Tile label="Local gradient over the rule, at surface" value={fmt(c.rows[0].gradientOverRule, 4)} />
        </TileGrid>
      </div>
      <ChartFrame height={288} className="mt-3">
        <LineChart data={c.rows} margin={{ top: 20, right: 20, bottom: 18, left: 0 }}>
          {GRID}
          <XAxis height={XAXIS_LABEL_HEIGHT} dataKey="tvdFt" type="number" tick={AXIS}
            label={{ value: 'depth, ft TVD', position: 'insideBottom', offset: 0, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis tick={AXIS} domain={['auto', 'auto']}
            label={{ value: 'pressure, psia', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
          <Legend {...LEGEND_PROPS} />
          <Line type="monotone" dataKey="enginePsia" name="the gas column the engine marches"
            stroke={seriesColor(1)} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="flatPsia" name={`the flat ${fmt(RULE_OF_THUMB_PSI_PER_FT, 3)} psi/ft rule`}
            stroke={seriesColor(2)} strokeDasharray="5 3" dot={false} isAnimationActive={false} />
        </LineChart>
      </ChartFrame>
      <ChartFrame height={224} className="mt-3">
        <LineChart data={c.rows} margin={{ top: 20, right: 20, bottom: 18, left: 0 }}>
          {GRID}
          <XAxis dataKey="tvdFt" type="number" tick={AXIS}
            label={{ value: 'depth, ft TVD', position: 'insideBottom', offset: -8, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis tick={AXIS}
            label={{ value: 'rule less engine, psi', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
          <ReferenceLine y={0} stroke={SVG_CHART.reference} />
          <Line type="monotone" dataKey="ruleErrorPsi" name="the miss" stroke={seriesColor(0)} dot={false} isAnimationActive={false} />
        </LineChart>
      </ChartFrame>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">depth, ft TVD</th>
              <th className="text-left pr-3">engine, psia</th>
              <th className="text-left pr-3">flat rule, psia</th>
              <th className="text-left pr-3">rule less engine, psi</th>
              <th className="text-left pr-3">local gradient, psi/ft</th>
              <th className="text-left pr-3">gradient over the rule</th>
              <th className="text-left pr-3">z</th>
              <th className="text-left">temperature, degF</th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={r.tvdFt}>
                <td className="pr-3">{fmt(r.tvdFt, 0)}</td>
                <td className="pr-3 text-pl-primary-text">{fmt(r.enginePsia, 4)}</td>
                <td className="pr-3 text-pl-warning-text">{fmt(r.flatPsia, 4)}</td>
                <td className="pr-3">{fmt(r.ruleErrorPsi, 4)}</td>
                <td className="pr-3">{fmt(r.localGradientPsiPerFt, 8)}</td>
                <td className="pr-3">{fmt(r.gradientOverRule, 4)}</td>
                <td className="pr-3">{fmt(r.z, 6)}</td>
                <td>{fmt(r.tF, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        THE RULE ERRS IN BOTH DIRECTIONS, AND THAT IS THE POINT. A flat
        {' '}{fmt(RULE_OF_THUMB_PSI_PER_FT, 3)} psi/ft has no pressure in it at all, so it cannot be
        low on one column and right on another: it is wrong in one direction on a heavy column and
        in the other on a light one.
        {high
          ? ` On published column ${high.i}, at ${fmt(high.rows[0].pSurfPsia, 1)} psia, the local gradient at surface is ${fmt(high.rows[0].gradientOverRule, 4)} times the rule, the rule less the engine at the packer is ${fmt(high.verdict.missAtPackerPsi, 4)} psi, and the rule therefore reads LOW.`
          : ''}
        {low
          ? ` On published column ${low.i}, at ${fmt(low.rows[0].pSurfPsia, 1)} psia, the same rule sits at ${fmt(low.rows[0].gradientOverRule, 4)} times the local gradient, the rule less the engine at the packer is ${fmt(low.verdict.missAtPackerPsi, 4)} psi, and the rule therefore reads HIGH.`
          : ''}
        {' '}Those are the same rule, the same arithmetic and opposite signs, which is what a
        constant standing in for a function does.
      </div>
      <Note>{c.verdict.note}</Note>
    </>
  );
};

const Gradient = () => {
  const [pick, setPick] = useState('1');
  const all = useMemo(() => {
    try {
      return columnExplorer.columnIds.map((i) => ({ i, ...columnExplorer.gradient(i) }));
    } catch { return null; }
  }, []);
  if (!all || !all.length || all.some((g) => !g.control || !g.control.length)) {
    return <Note>The control needs the same column marched twice, once on its geotherm and once at its wellhead temperature. With no temperature profile there is only one column, so there is no comparison to draw and no way to tell compression from the geotherm.</Note>;
  }
  const g = all.find((x) => String(x.i) === pick) || all[0];
  const s = g.isothermal;
  const bottom = g.control[g.control.length - 1];
  const allFall = all.every((x) => x.verdict.geothermalGradientFallsWithDepth);
  const allRise = all.every((x) => x.verdict.isothermalGradientRisesWithDepth);
  return (
    <>
      <FieldGrid>
        <SelectField label="Published column" value={pick} onChange={setPick} options={columnOptions()} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Gradient at surface" value={fmt(s.surfaceGradientPsiPerFt, 8)} unit="psi/ft" />
          <Tile label="Gradient at the packer, on the geotherm" value={fmt(s.bottomGradientPsiPerFt, 8)} unit="psi/ft" />
          <Tile label="Change over the well, on the geotherm" value={fmt(s.gradientChangePct, 4)} unit="%" />
          <Tile label="Gradient at the packer, temperature HELD" value={fmt(s.isothermalBottomGradientPsiPerFt, 8)} unit="psi/ft" />
          <Tile label="Change over the well, temperature HELD" value={fmt(s.isothermalGradientChangePct, 4)} unit="%" />
          <Tile label="Temperature at surface" value={fmt(s.surfaceTempF, 2)} unit="degF" />
          <Tile label="Temperature at the packer" value={fmt(s.bottomTempF, 2)} unit="degF" />
          <Tile label="The control is held at" value={fmt(s.isothermalTempF, 2)} unit="degF" />
        </TileGrid>
      </div>
      <ChartFrame height={320} className="mt-3">
        <LineChart data={g.control} margin={{ top: 20, right: 20, bottom: 18, left: 0 }}>
          {GRID}
          <XAxis height={XAXIS_LABEL_HEIGHT} dataKey="tvdFt" type="number" tick={AXIS}
            label={{ value: 'depth, ft TVD', position: 'insideBottom', offset: 0, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis tick={AXIS} domain={['auto', 'auto']}
            label={{ value: 'local gradient, psi/ft', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 8)} />
          <Legend {...LEGEND_PROPS} />
          <ReferenceLine y={RULE_OF_THUMB_PSI_PER_FT} stroke={seriesColor(2)} strokeDasharray="5 3"
            label={{ value: 'the flat rule', fill: seriesColor(2), fontSize: 10, position: 'insideTopRight' }} />
          <Line type="monotone" dataKey="geothermalGradientPsiPerFt"
            name="temperature MOVING, the real well" stroke={seriesColor(1)} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="isothermalGradientPsiPerFt"
            name="temperature HELD at the wellhead, the control" stroke={seriesColor(0)} dot={false} isAnimationActive={false} />
        </LineChart>
      </ChartFrame>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">depth, ft TVD</th>
              <th className="text-left pr-3">temperature, degF</th>
              <th className="text-left pr-3">gradient on the geotherm, psi/ft</th>
              <th className="text-left pr-3">held at {fmt(s.isothermalTempF, 0)} degF, psi/ft</th>
              <th className="text-left pr-3">control less real, psi/ft</th>
              <th className="text-left pr-3">z on the geotherm</th>
              <th className="text-left">z on the control</th>
            </tr>
          </thead>
          <tbody>
            {g.control.map((r) => (
              <tr key={r.tvdFt}>
                <td className="pr-3">{fmt(r.tvdFt, 0)}</td>
                <td className="pr-3">{fmt(r.geothermalTempF, 2)}</td>
                <td className="pr-3 text-pl-primary-text">{fmt(r.geothermalGradientPsiPerFt, 8)}</td>
                <td className="pr-3 text-pl-info-text">{fmt(r.isothermalGradientPsiPerFt, 8)}</td>
                <td className="pr-3">{fmt(r.isothermalLessGeothermalGradientPsiPerFt, 8)}</td>
                <td className="pr-3">{fmt(r.geothermalZ, 6)}</td>
                <td>{fmt(r.isothermalZ, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        THE CORRECTED RESULT, AND IT IS A RACE RATHER THAN A STORY. The gas gradient is density over
        144, and density goes as pressure over z times temperature, so going down the hole
        compression pushes the gradient UP and the geotherm pushes it DOWN. Which one wins has to be
        computed. On this column the two curves start together at
        {' '}{fmt(s.surfaceGradientPsiPerFt, 8)} psi/ft, because at surface the control IS the well,
        and they separate by {fmt(bottom.isothermalLessGeothermalGradientPsiPerFt, 8)} psi/ft at the
        packer. With the temperature moving the gradient
        {' '}{s.gradientChangePct < 0 ? 'FALLS' : 'RISES'} over the well, a change of
        {' '}{fmt(s.gradientChangePct, 4)} percent. With it held, which is compression on its own,
        the same column {s.isothermalGradientChangePct > 0 ? 'RISES' : 'FALLS'}, a change of
        {' '}{fmt(s.isothermalGradientChangePct, 4)} percent.
        {allFall && allRise
          ? ' Every published column in this course does the same thing: the geotherm wins on all three, and holding the temperature flips the sign on all three.'
          : ''}
        {' '}The gradient grows with PRESSURE and there is no argument about that. Whether it grows
        with DEPTH is the race, and this plot is the only honest way to answer it: two curves, one
        input changed, everything else identical.
      </div>
      <div className="mt-2 text-xs text-pl-text">
        SO THE {fmt(RULE_OF_THUMB_PSI_PER_FT, 3)} PSI/FT RULE ERRS IN BOTH DIRECTIONS. It is not a
        conservative approximation that always reads one way, and it cannot be, because a constant
        cannot follow a quantity that moves with pressure. Across the three published columns the
        local gradient runs from
        {' '}{fmt(Math.min(...all.map((x) => x.rows[0].gradientOverRule)), 4)} times the rule to
        {' '}{fmt(Math.max(...all.map((x) => x.rows[0].gradientOverRule)), 4)} times it at surface
        alone. A designer who assumes the rule is safe in one direction has assumed the half of the
        answer the plot disagrees with.
      </div>
      <Note>{g.verdict.note}</Note>
    </>
  );
};

const Convergence = () => {
  const targets = useMemo(() => {
    try { return refinementTargets(); } catch { return null; }
  }, []);
  const [label, setLabel] = useState('');
  const study = useMemo(() => {
    if (!targets || !targets.length) return null;
    try { return columnExplorer.convergence(label || targets[0].label); } catch { return null; }
  }, [targets, label]);
  if (!targets || !targets.length || !study || !study.rows || !study.rows.length) {
    return <Note>A refinement study needs a column to refine and a reference to refine towards. With no published column and no design at a packer there is nothing to march at two step counts, so there is no truncation to measure and no ratio to read.</Note>;
  }
  const rows = study.rows;
  const ratios = rows.filter((r) => Number.isFinite(r.errorRatio));
  const doubling = rows.filter((r, k) => k > 0 && r.steps === rows[k - 1].steps * 2);
  const head = study.headline;
  const cf = study.closedForm[0];
  const coeff = study.coefficients;
  return (
    <>
      <FieldGrid>
        <SelectField label="Column" value={label || targets[0].label} onChange={setLabel}
          options={targets.map((t) => [t.label, t.label])} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Reference, marched at the finest step" value={fmt(rows[0].referencePsia, 6)} unit="psia" />
          <Tile label="At the 20 steps the engine uses inside its own spacing" value={fmt(head.at20StepsPsia, 6)} unit="psia" />
          <Tile label="At 2000 steps" value={fmt(head.at2000StepsPsia, 6)} unit="psia" />
          <Tile label="The whole spread between them" value={tiny(head.spreadPsi)} unit="psi" />
          <Tile label="The lift this column makes" value={fmt(head.liftPsi, 4)} unit="psi" />
          <Tile label="The spread as a share of that lift" value={tiny(head.spreadAsFractionOfLift)} />
          <Tile label="Steps the study walks" value={fmt(REFINEMENT_STEPS.length, 0)} />
          <Tile label="Ratios over that contiguous run" value={fmt(ratios.length, 0)} />
        </TileGrid>
      </div>
      <ChartFrame height={288} className="mt-3">
        <LineChart data={rows} margin={{ top: 20, right: 20, bottom: 18, left: 0 }}>
          {GRID}
          <XAxis dataKey="steps" type="number" scale="log" domain={['dataMin', 'dataMax']} tick={AXIS}
            label={{ value: 'steps in the march', position: 'insideBottom', offset: -8, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis tick={AXIS}
            label={{ value: 'march less reference, psi', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => tiny(v)} />
          <ReferenceLine y={0} stroke={SVG_CHART.reference} />
          <Line type="monotone" dataKey="errorPsi" name="the truncation, which goes to zero"
            stroke={seriesColor(1)} dot isAnimationActive={false} />
        </LineChart>
      </ChartFrame>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">steps</th>
              <th className="text-left pr-3">the march reads, psia</th>
              <th className="text-left pr-3">less the reference, psi</th>
              <th className="text-left pr-3">previous error over this one</th>
              <th className="text-left">is this row a doubling of the one above</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, k) => (
              <tr key={r.steps}>
                <td className="pr-3">{fmt(r.steps, 0)}</td>
                <td className="pr-3">{fmt(r.pPsia, 8)}</td>
                <td className="pr-3 text-pl-primary-text">{tiny(r.errorPsi)}</td>
                <td className="pr-3">{Number.isFinite(r.errorRatio) ? fmt(r.errorRatio, 4) : 'n/a'}</td>
                <td>{k > 0 && r.steps === rows[k - 1].steps * 2 ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        THE RATIO COLUMN RUNS OVER THE WHOLE CONTIGUOUS SEQUENCE AND IS NOT PICKED OVER. The march is
        a predictor with a trapezoidal corrector, so it is second order and every DOUBLING of the
        step count should cut the remaining error by about four.
        {' '}{fmt(doubling.length, 0)} of the {fmt(rows.length, 0)} rows are doublings, and their
        ratios run from {fmt(Math.min(...doubling.map((r) => r.errorRatio)), 4)} to
        {' '}{fmt(Math.max(...doubling.map((r) => r.errorRatio)), 4)}. The rows that are NOT
        doublings are shown with the same ratio beside them and they do not read four, because they
        are not doublings. Dropping them would make the column look like a cleaner result than the
        study actually contains, which is the whole reason the sequence is walked contiguously and
        printed contiguously.
      </div>
      <div className="mt-4 rounded-md border border-pl-border bg-pl-sunken p-3">
        <p className="text-xs text-pl-muted mb-2">
          THREE REFERENCES AND ONE MARCH. The same isothermal column has a closed form, and there
          are TWO of them: the textbook coefficient {fmt(coeff.textbookCoeff, 6)} and the engine's
          own air molar mass over 144 times the gas constant, {fmt(coeff.engineCoeff, 12)}. They
          differ by {tiny(coeff.relativeDifference)} relative. Refining the march removes a
          truncation and does not remove a difference between two formulations, which is exactly
          what the two error columns below show.
        </p>
        <TileGrid>
          <Tile label="Surface pressure" value={fmt(cf.pSurfPsia, 1)} unit="psia" />
          <Tile label="Depth" value={fmt(cf.tvdFt, 0)} unit="ft TVD" />
          <Tile label="The textbook closed form" value={fmt(cf.textbookPsia, 8)} unit="psia" />
          <Tile label="The engine constant closed form" value={fmt(cf.enginePsia, 8)} unit="psia" />
          <Tile label="The gap between the two forms" value={tiny(cf.formDifferencePsi)} unit="psi" />
          <Tile label="Step counts the march is run at" value={fmt(CLOSED_FORM_STEPS.length, 0)} />
          <Tile label="Against the textbook, at the finest step" value={tiny(cf.marches[cf.marches.length - 1].errorAgainstTextbookPsi)} unit="psi" />
          <Tile label="Against the engine constant, at the finest step" value={tiny(cf.marches[cf.marches.length - 1].errorAgainstEnginePsi)} unit="psi" />
        </TileGrid>
        <ChartFrame height={256} className="mt-3">
          <ComposedChart data={cf.marches} margin={{ top: 20, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis height={XAXIS_LABEL_HEIGHT} dataKey="steps" type="number" scale="log" domain={['dataMin', 'dataMax']} tick={AXIS}
              label={{ value: 'steps in the march', position: 'insideBottom', offset: 0, fill: SVG_CHART.note, fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'march less closed form, psi', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => tiny(v)} />
            <Legend {...LEGEND_PROPS} />
            <ReferenceLine y={0} stroke={SVG_CHART.reference} />
            <Line type="monotone" dataKey="errorAgainstTextbookPsi"
              name="against the TEXTBOOK form, which parks" stroke={seriesColor(2)} dot isAnimationActive={false} />
            <Line type="monotone" dataKey="errorAgainstEnginePsi"
              name="against the ENGINE CONSTANT form, which converges" stroke={seriesColor(0)} dot isAnimationActive={false} />
          </ComposedChart>
        </ChartFrame>
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-pl-text w-full">
            <thead className="text-pl-muted">
              <tr>
                <th className="text-left pr-3">steps</th>
                <th className="text-left pr-3">the march reads, psia</th>
                <th className="text-left pr-3">less the textbook form, psi</th>
                <th className="text-left">less the engine constant form, psi</th>
              </tr>
            </thead>
            <tbody>
              {cf.marches.map((m) => (
                <tr key={m.steps}>
                  <td className="pr-3">{fmt(m.steps, 0)}</td>
                  <td className="pr-3">{fmt(m.pPsia, 8)}</td>
                  <td className="pr-3 text-pl-warning-text">{tiny(m.errorAgainstTextbookPsi)}</td>
                  <td className="text-pl-info-text">{tiny(m.errorAgainstEnginePsi)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        READ THE TWO COLUMNS SIDE BY SIDE AND THE DIFFERENCE IS THE WHOLE LESSON. The engine constant
        column falls by about four per doubling and keeps falling, all the way to
        {' '}{tiny(cf.marches[cf.marches.length - 1].errorAgainstEnginePsi)} psi. The textbook column
        PARKS: it stops at {tiny(cf.marches[cf.marches.length - 1].errorAgainstTextbookPsi)} psi and
        no amount of further refinement moves it, because what remains is not a truncation at all,
        it is the {tiny(coeff.relativeDifference)} relative gap between two constants. A truncation
        is a thing refinement removes. A formulation gap is not, and telling the two apart by
        refining and watching is the only method that works on both.
      </div>
      <Note>{study.verdict.note}</Note>
    </>
  );
};

const Lines = () => {
  const [pick, setPick] = useState('');
  const ids = useMemo(() => {
    try { return [...PUBLISHED_DESIGN_IDS]; } catch { return []; }
  }, []);
  const data = useMemo(() => {
    try { return columnExplorer.lines(pick || ids[0]); } catch { return null; }
  }, [ids, pick]);
  if (!ids.length || !data || !data.rows || !data.rows.length || !data.crossing) {
    return <Note>The three lines need a kickoff pressure, an unloading gradient and a transfer gradient before any of them exists. Where the injection line never overcomes a full column of kill fluid there is no crossing at all, so the design has no top valve and the engine returns none rather than inventing one.</Note>;
  }
  const x = data.crossing;
  const rows = data.rows;
  const deepest = rows[rows.length - 1];
  return (
    <>
      <FieldGrid>
        <SelectField label="Published design" value={pick || ids[0]} onChange={setPick}
          options={ids.map((id) => [id, id])} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Injection pressure at surface" value={fmt(rows[0].injectionPsia, 4)} unit="psia" />
          <Tile label="Unloading line at surface" value={fmt(rows[0].unloadingPsia, 4)} unit="psia" />
          <Tile label="Transfer line at surface" value={fmt(rows[0].transferPsia, 4)} unit="psia" />
          <Tile label="THE TOP VALVE, where the first two meet" value={fmt(x.tvdFt, 4)} unit="ft TVD" />
          <Tile label="Injection line reads there" value={fmt(x.injectionPsia, 4)} unit="psia" />
          <Tile label="Unloading line reads there" value={fmt(x.unloadingPsia, 4)} unit="psia" />
          <Tile label="Transfer line reads there" value={fmt(x.transferPsia, 4)} unit="psia" />
          <Tile label="Deepest station plotted" value={fmt(deepest.tvdFt, 0)} unit="ft TVD" />
        </TileGrid>
      </div>
      <ChartFrame height={320} className="mt-3">
        <LineChart data={rows} margin={{ top: 20, right: 20, bottom: 18, left: 0 }}>
          {GRID}
          <XAxis height={XAXIS_LABEL_HEIGHT} dataKey="tvdFt" type="number" domain={['dataMin', 'dataMax']} tick={AXIS}
            label={{ value: 'depth, ft TVD', position: 'insideBottom', offset: 0, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis tick={AXIS} domain={['auto', 'auto']}
            label={{ value: 'pressure, psia', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
          <Legend {...LEGEND_PROPS} />
          <ReferenceLine x={x.tvdFt} stroke={seriesColor(4)} strokeDasharray="4 3"
            label={{ value: 'top valve', fill: seriesColor(4), fontSize: 10, position: 'top' }} />
          <Line type="monotone" dataKey="injectionPsia" name="the injection gas in the annulus"
            stroke={seriesColor(1)} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="unloadingPsia" name="the kill fluid being unloaded"
            stroke={seriesColor(0)} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="transferPsia" name="the transfer line, once gas is in"
            stroke={seriesColor(2)} dot={false} isAnimationActive={false} />
          <ReferenceDot x={x.tvdFt} y={x.injectionPsia} r={5} fill={seriesColor(4)} stroke="none" isFront />
        </LineChart>
      </ChartFrame>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">depth, ft TVD</th>
              <th className="text-left pr-3">injection, psia</th>
              <th className="text-left pr-3">unloading, psia</th>
              <th className="text-left">transfer, psia</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.tvdFt} className={r.tvdFt > x.tvdFt ? 'text-pl-muted' : ''}>
                <td className="pr-3">{fmt(r.tvdFt, 1)}</td>
                <td className="pr-3 text-pl-primary-text">{fmt(r.injectionPsia, 4)}</td>
                <td className="pr-3 text-pl-info-text">{fmt(r.unloadingPsia, 4)}</td>
                <td className="text-pl-warning-text">{fmt(r.transferPsia, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        THREE STRAIGHT LINES, AND ONLY ONE OF THEM IS A GAS COLUMN. The injection line is the real
        marched column from the mode above. The unloading line and the transfer line are STRAIGHT,
        on constant gradients the caller declares, and the engine does not pretend otherwise: a real
        unloading column is neither straight nor constant. Where the injection line first overcomes
        a full column of kill fluid, at {fmt(x.tvdFt, 4)} ft, is the top valve. Below that crossing
        the annulus can push the fluid out; above it, it cannot, so a mandrel there would sit in a
        well the gas can never reach. Rows past the crossing are greyed above.
      </div>
      <Note>{data.verdict.note}</Note>
    </>
  );
};

const COLUMN_FIELDS = [
  ['pKickoffPsia', 'Kickoff pressure at surface, psia'],
  ['steps', 'Column step count'],
  ['killGradPsiPerFt', 'Kill fluid gradient, psi/ft'],
  ['pWhUnloadPsia', 'Unloading wellhead pressure, psia'],
  ['packerTargetPsia', 'Target pressure at the packer, psia'],
  ['curveSteps', 'Injection curve sample count'],
  ['readDepthFt', 'Read the curve at, ft TVD'],
];

const Typed = () => {
  const [values, setValues] = useState(() => typedState(TYPED_COLUMN_DEFAULT));
  const set = (k, v) => setValues((o) => ({ ...o, [k]: v }));
  const r = useMemo(() => {
    try { return typedGasColumn(values); } catch { return null; }
  }, [values]);
  return (
    <>
      <div className="text-xs text-pl-text">
        Type a well and weigh its injection gas. The view opens on the AKASO-3 teaching well, and
        every input can be retyped. The temperature runs in a straight line from the wellhead to the
        reference depth, which need not be the packer. The column is marched on the step count you
        type, and the injection curve is cut on its own sample count and read by straight line
        between its samples.
      </div>
      <div className="mt-3">
        <TypedFieldList fields={GEOTHERM_FIELDS} values={values} set={set} />
      </div>
      <div className="mt-3">
        <TypedFieldList fields={COLUMN_FIELDS} values={values} set={set} />
      </div>
      {(!r || !r.ok) ? <Refusal result={r} /> : (
        <>
          <div className="mt-3">
            <TileGrid>
              <Tile label="z at the kickoff pressure and wellhead temperature" value={plain(r.zKickoff, 8)} />
              <Tile label="Static gas gradient there" value={plain(r.gradKickoffPsiPerFt, 10)} unit="psi/ft" />
              <Tile label="Temperature at the packer" value={plain(r.tempAtPackerF, 4)} unit="degF" />
              <Tile label="Injection pressure at the packer" value={plain(r.colAtPackerPsia, 6)} unit="psia" />
              <Tile label="Surface pressure for the target at the packer" value={plain(r.surfForTargetPsia, 6)} unit="psia" />
              <Tile label="Top valve depth" value={plain(r.topValveFt, 6)} unit="ft TVD" />
              <Tile label="Kill line at the top valve" value={plain(r.killLineAtTopValvePsia, 6)} unit="psia" />
              <Tile label="Curve sample spacing" value={plain(r.curveSpacingFt, 6)} unit="ft" />
              <Tile label="Injection curve read at the read depth" value={plain(r.curveAtReadPsia, 6)} unit="psia" />
            </TileGrid>
          </div>
          {r.warnings.length > 0 && <Note>{r.warnings.join(' ')}</Note>}
          <Note>
            The packer pressure and the surface pressure for the target are one march run in two
            directions on the same step count. The top valve is where the injection column first
            balances a full column of kill fluid above the unloading wellhead pressure, marched on
            the engine&apos;s own fixed step count.
          </Note>
        </>
      )}
    </>
  );
};

const ColumnExplorer = ({ initialMode = 'column' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Column explorer"
      subtitle="The weight of the injection gas: the real column against the flat rule of thumb, the local gradient with the isothermal control that settles which way it moves, the refinement study against three references, and the three lines whose first crossing is the top valve"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'column' && <Column />}
        {mode === 'gradient' && <Gradient />}
        {mode === 'convergence' && <Convergence />}
        {mode === 'lines' && <Lines />}
        {mode === 'typed' && <Typed />}
      </div>
    </PanelShell>
  );
};

export default ColumnExplorer;
