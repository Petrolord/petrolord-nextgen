import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, BarChart, Line, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  ESP_THRESHOLDS, PSI_PER_FT_SG, EXACT_PSI_PER_FT_SG, REQUIREMENT_SWEEP_FT,
  allCases, intakeReading, gasVerdictSweepRows, separatorDensityRows,
  tdhDecomposition, stackSizing, requirementSweepRows,
  gradientConversionSummary, gradientConventionRows,
} from './espLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Lift explorer, the Professional tier. What the pump actually swallows, what
// the pressure it has to add is worth in feet of the fluid it is pumping, how
// many integer stages that takes, and the two forms of one conversion that the
// package carries at once.
//
// Every figure on this page is a return value from espLab, which is a return
// value from the vendored ESP engine. Nothing here computes a pressure, a
// density, a head or a stage count.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const pct = (v, d = 2) => (Number.isFinite(v) ? `${fmt(v * 100, d)} %` : '-');

const MODES = [
  ['intake', 'What the pump swallows'],
  ['tdh', 'Total dynamic head, in three parts'],
  ['stack', 'Integer stages, and the margin they buy'],
  ['gradient', 'One conversion, carried twice'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const VERDICT_COLOUR = {
  standard: '#BFFF00',
  gasHandler: '#f97316',
  separatorRequired: '#f472b6',
};

// The four cases the course walks, built once. Every one of them is a bundle of
// engine returns, so if the engine cannot build them there is nothing to show.
const CASES = (() => {
  try { return allCases(); } catch { return []; }
})();

const caseOf = (id) => CASES.find((c) => c.id === id) || CASES[0];

const Intake = ({ c }) => {
  const r = useMemo(() => {
    try { return intakeReading(c); } catch { return null; }
  }, [c]);
  const sweep = useMemo(() => {
    try { return gasVerdictSweepRows(c); } catch { return null; }
  }, [c]);
  const density = useMemo(() => {
    try { return separatorDensityRows(); } catch { return null; }
  }, []);
  if (!r || !sweep || !sweep.length || !density) {
    return <Note>An intake reading needs a flowing bottomhole pressure, a pump depth and a black oil description of what is coming past it. With any of those missing the engine returns no stream at all rather than a guessed one, so there is no gas volume fraction to compare against either limit.</Note>;
  }
  const crossesHandler = sweep.some((s) => s.verdict === 'separatorRequired');
  const crossesStandard = sweep.some((s) => s.verdict === 'gasHandler');
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Flowing bottomhole pressure" value={fmt(r.pwfPsia, 0)} unit="psia" />
          <Tile label="Column standing above the pump" value={fmt(r.annulusColumnPsi, 4)} unit="psi" />
          <Tile label="Pressure at the intake" value={fmt(r.pIntakePsia, 4)} unit="psia" />
          <Tile label="Liquid at reservoir conditions" value={fmt(r.liquidResBpd, 4)} unit="bbl/d" />
          <Tile label="Free gas, standard" value={fmt(r.freeGasScfd, 0)} unit="scf/d" />
          <Tile label="Free gas at those conditions" value={fmt(r.freeGasResBpd, 4)} unit="bbl/d" />
          <Tile label="Everything the perforations deliver" value={fmt(r.totalResBpd, 4)} unit="bbl/d" />
          <Tile label="Gas volume fraction of the STREAM" value={pct(r.streamGvf, 4)} />
          <Tile label="Separator efficiency" value={pct(r.separatorEfficiency, 1)} />
          <Tile label="Gas vented up the annulus" value={fmt(r.ventedResBpd, 4)} unit="bbl/d" />
          <Tile label="Gas still going through the pump" value={fmt(r.throughPumpGasResBpd, 4)} unit="bbl/d" />
          <Tile label="Gas volume fraction THROUGH THE PUMP" value={pct(r.gvfThroughPump, 4)} />
          <Tile label="What the pump swallows" value={fmt(r.pumpIntakeBpd, 4)} unit="bbl/d" />
          <Tile label="Density of the stream" value={fmt(r.streamMixtureDensityLbFt3, 6)} unit="lbm/ft3" />
          <Tile label="Density through the pump" value={fmt(r.pumpMixtureDensityLbFt3, 6)} unit="lbm/ft3" />
          <Tile label="Verdict" value={r.verdict} />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={sweep} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="separatorEfficiency" type="number" domain={[0, 1]} tick={AXIS}
              label={{ value: 'separator efficiency, fraction', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'gas volume fraction', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {/* BOTH published limits, drawn separately. They are checked in
                order, so only one of them ever decides a verdict, and neither
                of them is ever compared against the stream's own fraction. */}
            <ReferenceLine y={ESP_THRESHOLDS.standardMaxGvf} stroke="#f97316" strokeWidth={2}
              label={{ value: 'standard stages stop here', fill: '#f97316', fontSize: 10, position: 'insideTopLeft' }} />
            <ReferenceLine y={ESP_THRESHOLDS.handlerMaxGvf} stroke="#f472b6" strokeWidth={2}
              label={{ value: 'a gas handler stops here', fill: '#f472b6', fontSize: 10, position: 'insideTopLeft' }} />
            <ReferenceLine y={r.streamGvf} stroke="#94a3b8" strokeDasharray="5 3"
              label={{ value: 'the stream, never compared', fill: '#94a3b8', fontSize: 10, position: 'insideBottomLeft' }} />
            <ReferenceLine x={r.separatorEfficiency} stroke="#e2e8f0"
              label={{ value: 'this design', fill: '#e2e8f0', fontSize: 10, position: 'top' }} />
            <Line type="monotone" dataKey="gvfThroughPump" name="gas volume fraction through the pump"
              stroke="#BFFF00" strokeWidth={2} dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">separator efficiency</th>
              <th className="text-left pr-3">gas through the pump, bbl/d</th>
              <th className="text-left pr-3">what the pump swallows, bbl/d</th>
              <th className="text-left pr-3">gas volume fraction</th>
              <th className="text-left pr-3">mixture density, lbm/ft3</th>
              <th className="text-left">verdict</th>
            </tr>
          </thead>
          <tbody>
            {sweep.map((s) => (
              <tr key={s.separatorEfficiency} className={s.separatorEfficiency === r.separatorEfficiency ? 'text-white' : ''}>
                <td className="pr-3">{fmt(s.separatorEfficiency, 2)}</td>
                <td className="pr-3">{fmt(s.throughPumpGasResBpd, 4)}</td>
                <td className="pr-3">{fmt(s.pumpIntakeBpd, 4)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(s.gvfThroughPump, 6)}</td>
                <td className="pr-3">{fmt(s.mixtureDensityLbFt3, 6)}</td>
                <td style={{ color: VERDICT_COLOUR[s.verdict] }}>{s.verdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        WHAT THE PUMP SEES IS NOT WHAT THE PERFORATIONS DELIVER. The reservoir hands over
        {' '}{fmt(r.totalResBpd, 4)} bbl/d at pump conditions, of which
        {' '}{fmt(r.freeGasResBpd, 4)} bbl/d is free gas: a stream fraction of
        {' '}{pct(r.streamGvf, 4)}. The separator takes {pct(r.separatorEfficiency, 1)} of that gas
        up the annulus, so {fmt(r.pumpIntakeBpd, 4)} bbl/d actually goes through the stages at a
        fraction of {pct(r.gvfThroughPump, 4)}. Taking gas out leaves the pump swallowing something
        HEAVIER than the whole stream was, {fmt(r.pumpMixtureDensityLbFt3, 6)} against
        {' '}{fmt(r.streamMixtureDensityLbFt3, 6)} lbm/ft3, which is why the gradient the head
        conversion runs on is not the stream gradient.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        BOTH LIMITS ARE DRAWN AND ONLY ONE OF THEM EVER DECIDES. The engine compares the
        THROUGH-PUMP fraction against the handler limit of
        {' '}{pct(ESP_THRESHOLDS.handlerMaxGvf, 0)} first and against the standard limit of
        {' '}{pct(ESP_THRESHOLDS.standardMaxGvf, 0)} only if the first one did not fire, so a verdict
        is one comparison and never two. The grey line is the STREAM fraction, and it is on the
        chart precisely because nothing is ever compared against it: it is the number a reader
        reaches for and the number the verdict never sees.
        {crossesHandler && crossesStandard
          ? ' Sweeping the separator on this case, the through-pump fraction crosses both limits, so all three verdicts appear in the table above.'
          : crossesStandard
            ? ' Sweeping the separator on this case, the through-pump fraction crosses the standard limit but never reaches the handler limit, so only two of the three verdicts appear in the table above.'
            : ' Sweeping the separator on this case, the through-pump fraction never reaches either limit, so the verdict is the same on every row of the table above.'}
        {' '}At the separator efficiency this design actually carries, the verdict is {r.verdict}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">published design</th>
              <th className="text-left pr-3">stream density, lbm/ft3</th>
              <th className="text-left pr-3">through the pump, lbm/ft3</th>
              <th className="text-left pr-3">density the separator bought, lbm/ft3</th>
              <th className="text-left">gradient it bought, psi/ft</th>
            </tr>
          </thead>
          <tbody>
            {density.map((d) => (
              <tr key={d.id}>
                <td className="pr-3">{d.id}</td>
                <td className="pr-3">{fmt(d.streamMixtureDensityLbFt3, 6)}</td>
                <td className="pr-3">{fmt(d.pumpMixtureDensityLbFt3, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(d.densityGainLbFt3, 6)}</td>
                <td>{fmt(d.gradientGainPsiPerFt, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Nothing about this verdict is a correlation. The separator efficiency is a vendor or a user
        number, both limits are inputs with published defaults, no gas handling performance is
        modelled anywhere, and the verdict names a class of equipment and then stops. It will not
        tell you whether the handler you fit will work, and it was never asked to.
      </Note>
    </>
  );
};

const Tdh = ({ c }) => {
  const t = useMemo(() => {
    try { return tdhDecomposition(c); } catch { return null; }
  }, [c]);
  if (!t) {
    return <Note>Total dynamic head is a pressure difference divided by a gradient, so it needs both. Handed a gradient of nought the engine returns the pressure difference and no head at all, because feet of a fluid with no weight is not a number.</Note>;
  }
  const parts = [
    { part: 'net vertical lift', ft: t.netLiftFt, sharePct: t.netLiftSharePct, fill: '#BFFF00' },
    { part: 'friction', ft: t.frictionFt, sharePct: t.frictionSharePct, fill: '#f97316' },
    { part: 'wellhead pressure', ft: t.whpHeadFt, sharePct: t.whpSharePct, fill: '#38bdf8' },
  ];
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Discharge pressure" value={fmt(t.pDischargePsia, 0)} unit="psia" />
          <Tile label="Intake pressure" value={fmt(t.pIntakePsia, 4)} unit="psia" />
          <Tile label="Pressure the pump has to add" value={fmt(t.dpPsi, 4)} unit="psi" />
          <Tile label="Gradient of what it is pumping" value={fmt(t.gradientPsiPerFt, 8)} unit="psi/ft" />
          <Tile label="Total dynamic head" value={fmt(t.tdhFt, 6)} unit="ft" />
          <Tile label="Wellhead pressure" value={fmt(t.whpPsia, 0)} unit="psia" />
          <Tile label="Fluid standing above the intake" value={fmt(t.fluidAboveIntakeFt, 6)} unit="ft" />
          <Tile label="Dynamic fluid level" value={fmt(t.dynamicFluidLevelFt, 6)} unit="ft" />
          <Tile label="Net vertical lift" value={fmt(t.netLiftFt, 6)} unit="ft" />
          <Tile label="Friction" value={fmt(t.frictionFt, 6)} unit="ft" />
          <Tile label="Wellhead pressure as head" value={fmt(t.whpHeadFt, 6)} unit="ft" />
          <Tile label="The three parts summed" value={fmt(t.summedTdhFt, 6)} unit="ft" />
          <Tile label="Summed less the pressure route" value={fmt(t.summedLessPressureTdhFt, 12)} unit="ft" />
          <Tile label="Friction as pressure" value={fmt(t.frictionPsi, 6)} unit="psi" />
          <Tile label="The same figure from the two pressures" value={fmt(t.identityPsi, 6)} unit="psi" />
          <Tile label="Friction share of the whole" value={pct(t.frictionSharePct / 100, 4)} />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={parts} layout="vertical" margin={{ top: 10, right: 30, bottom: 18, left: 110 }}>
            {GRID}
            <XAxis type="number" tick={AXIS}
              label={{ value: 'feet of the fluid being pumped', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis type="category" dataKey="part" tick={AXIS} width={110} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <ReferenceLine x={t.tdhFt} stroke="#e2e8f0" strokeDasharray="5 3"
              label={{ value: 'the whole', fill: '#e2e8f0', fontSize: 10, position: 'top' }} />
            <Bar dataKey="ft" name="feet" isAnimationActive={false}>
              {parts.map((p) => <Cell key={p.part} fill={p.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">part</th>
              <th className="text-left pr-3">feet</th>
              <th className="text-left">share of the total dynamic head</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((p) => (
              <tr key={p.part}>
                <td className="pr-3" style={{ color: p.fill }}>{p.part}</td>
                <td className="pr-3">{fmt(p.ft, 6)}</td>
                <td>{fmt(p.sharePct, 4)} %</td>
              </tr>
            ))}
            <tr className="text-white">
              <td className="pr-3">summed</td>
              <td className="pr-3">{fmt(t.summedTdhFt, 6)}</td>
              <td>the whole, by construction</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        TOTAL DYNAMIC HEAD IS THE PRESSURE THE PUMP HAS TO ADD, IN FEET OF WHAT IT IS PUMPING. The
        two pressures give {fmt(t.dpPsi, 4)} psi, the gradient of the mixture through the pump is
        {' '}{fmt(t.gradientPsiPerFt, 8)} psi/ft, and the quotient is {fmt(t.tdhFt, 6)} ft. It is
        NOT the friction plus the wellhead: the net vertical lift is {fmt(t.netLiftSharePct, 4)}
        {' '}percent of it here, and a design that leaves it out understates the stage count by
        roughly an order of magnitude.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        THE CLOSURE IS {fmt(t.summedLessPressureTdhFt, 12)} FT, AND IT IS NOT A TEST THIS PACKAGE
        RUNS. Read how the three parts were got. The net lift is the pump depth less the fluid
        standing above the intake, the wellhead part is the wellhead pressure over the same
        gradient, and the friction is what is LEFT once those two are taken off the head the two
        pressures already gave. So the three add back to the whole by construction, and the number
        in that tile is the rounding of a subtraction rather than an agreement between two
        independent routes. The engine never checks it, never reports it and would not complain if
        it were large.
      </div>
      <Note>
        The one place two routes really do meet is the friction column: {fmt(t.frictionPsi, 6)} psi
        as feet times the gradient, against {fmt(t.identityPsi, 6)} psi straight from the discharge
        pressure less the static column less the wellhead. Those are two different pieces of
        arithmetic on the same inputs, and they agree. That is worth more than a closure that could
        not have failed.
      </Note>
    </>
  );
};

const Stack = ({ c }) => {
  const s = useMemo(() => {
    try { return stackSizing(c); } catch { return null; }
  }, [c]);
  const sweep = useMemo(() => {
    try { return requirementSweepRows(); } catch { return null; }
  }, []);
  const all = useMemo(() => {
    try { return CASES.map(stackSizing); } catch { return null; }
  }, []);
  if (!s || !sweep || !sweep.length || !all || !all.length) {
    return <Note>A stack needs a head per stage to divide by. With a head of nought or below, stageCount refuses and returns no stage count at all rather than an infinity, so there is nothing to round up and no margin to measure.</Note>;
  }
  const tightest = all.reduce((a, b) => (b.headMarginPct < a.headMarginPct ? b : a));
  const loosest = all.reduce((a, b) => (b.headMarginPct > a.headMarginPct ? b : a));
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Head the duty requires" value={fmt(s.tdhFt, 6)} unit="ft" />
          <Tile label="Head one stage makes" value={fmt(s.headPerStageFt, 6)} unit="ft" />
          <Tile label="Stages the division asks for" value={fmt(s.stagesExact, 6)} />
          <Tile label="Stages the engine buys" value={fmt(s.stages, 0)} />
          <Tile label="Fraction of a stage rounded away" value={fmt(s.stageRoundedAway, 6)} />
          <Tile label="Head the stack MAKES" value={fmt(s.headMadeFt, 6)} unit="ft" />
          <Tile label="Margin, in feet" value={fmt(s.headMarginFt, 6)} unit="ft" />
          <Tile label="Margin, as a percentage" value={fmt(s.headMarginPct, 6)} unit="%" />
          <Tile label="Margin, in stages" value={fmt(s.headMarginStages, 6)} />
          <Tile label="Rate through the stages" value={fmt(s.pumpIntakeBpd, 4)} unit="bbl/d" />
          <Tile label="Region the duty sits in" value={s.region} />
          <Tile label="Warnings the sizing raised" value={fmt(s.warningCount, 0)} />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={sweep} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="stages" type="number" domain={['dataMin', 'dataMax']} tick={AXIS}
              label={{ value: 'stages the sizing bought', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="pct" tick={AXIS}
              label={{ value: 'margin, percent', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="stg" orientation="right" domain={[0, 1]} tick={AXIS}
              label={{ value: 'margin, in stages', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="stg" y={1} stroke="#f97316" strokeWidth={2}
              label={{ value: 'one whole stage, the bound', fill: '#f97316', fontSize: 10, position: 'insideTopRight' }} />
            <Line yAxisId="pct" type="monotone" dataKey="headMarginPct" name="margin, percent of the requirement"
              stroke="#BFFF00" dot isAnimationActive={false} />
            <Line yAxisId="stg" type="monotone" dataKey="headMarginStages" name="margin, in stages"
              stroke="#38bdf8" dot isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">requirement, ft</th>
              <th className="text-left pr-3">stages exactly</th>
              <th className="text-left pr-3">stages bought</th>
              <th className="text-left pr-3">head made, ft</th>
              <th className="text-left pr-3">margin, ft</th>
              <th className="text-left pr-3">margin, percent</th>
              <th className="text-left pr-3">margin, stages</th>
              <th className="text-left">power ratio less head ratio</th>
            </tr>
          </thead>
          <tbody>
            {sweep.map((r) => (
              <tr key={r.tdhFt}>
                <td className="pr-3">{fmt(r.tdhFt, 0)}</td>
                <td className="pr-3">{fmt(r.stagesExact, 6)}</td>
                <td className="pr-3 text-white">{fmt(r.stages, 0)}</td>
                <td className="pr-3">{fmt(r.headMadeFt, 6)}</td>
                <td className="pr-3">{fmt(r.headMarginFt, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.headMarginPct, 6)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.headMarginStages, 6)}</td>
                <td>{fmt(r.identity, 18)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">case</th>
              <th className="text-left pr-3">head required, ft</th>
              <th className="text-left pr-3">head per stage, ft</th>
              <th className="text-left pr-3">stages</th>
              <th className="text-left pr-3">head made, ft</th>
              <th className="text-left pr-3">margin, ft</th>
              <th className="text-left pr-3">margin, percent</th>
              <th className="text-left">margin, stages</th>
            </tr>
          </thead>
          <tbody>
            {all.map((r) => (
              <tr key={r.id} className={r.id === s.id ? 'text-white' : ''}>
                <td className="pr-3">{r.tag}</td>
                <td className="pr-3">{fmt(r.tdhFt, 4)}</td>
                <td className="pr-3">{fmt(r.headPerStageFt, 6)}</td>
                <td className="pr-3">{fmt(r.stages, 0)}</td>
                <td className="pr-3">{fmt(r.headMadeFt, 4)}</td>
                <td className="pr-3">{fmt(r.headMarginFt, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.headMarginPct, 6)}</td>
                <td className="text-[#38bdf8]">{fmt(r.headMarginStages, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE MARGIN IS BOUNDED BY ONE STAGE, NOT BY A PERCENTAGE. stageCount rounds UP always, so the
        head the stack makes exceeds the head the duty requires by somewhere between nothing and one
        whole stage. Read the blue line on the chart: it is the margin in STAGES, it lives between
        nought and one across the whole requirement sweep, and it never reaches the orange bound. The
        lime line is the same margin as a percentage, and it is the one that moves, because the same
        fraction of a stage is a different fraction of the whole depending on how many stages there
        are.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        The four cases in the lower table make that concrete. The tightest is {tightest.tag} at
        {' '}{fmt(tightest.headMarginPct, 6)} percent on {fmt(tightest.stages, 0)} stages; the
        loosest is {loosest.tag} at {fmt(loosest.headMarginPct, 6)} percent on
        {' '}{fmt(loosest.stages, 0)} stages. As percentages those two are worlds apart. As
        margins in stages, {fmt(tightest.headMarginStages, 6)} against
        {' '}{fmt(loosest.headMarginStages, 6)}, they are the same kind of number, and both of them
        are under one. A short stack has nowhere to hide a rounded stage.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        The last column of the requirement sweep is the identity behind the Expert tier: brake power
        is linear in head at a fixed rate and efficiency, so the ratio of the two brake powers IS the
        ratio of the two heads, and the difference between them is nought to machine precision at
        every requirement on the ladder. The sweep runs from
        {' '}{fmt(REQUIREMENT_SWEEP_FT[0], 0)} to
        {' '}{fmt(REQUIREMENT_SWEEP_FT[REQUIREMENT_SWEEP_FT.length - 1], 0)} ft on the short
        teaching well, so the stage count can be watched stepping.
      </div>
      <Note>
        Watch the margin collapse and recover as the requirement crosses a stage boundary. It is
        largest just after a new stage was bought and smallest just before the next one is, and it
        has nothing to do with how well the design was done. Reporting it as a design safety factor
        is reporting the remainder of a division.
      </Note>
    </>
  );
};

const Gradient = ({ c }) => {
  const summary = useMemo(() => {
    try { return gradientConversionSummary(); } catch { return null; }
  }, []);
  const rows = useMemo(() => {
    try { return gradientConventionRows(); } catch { return null; }
  }, []);
  if (!summary || !rows || !rows.length) {
    return <Note>The two conversions need a mixture density to convert. With no stream there is no density, so there is no gradient either way and nothing to disagree about.</Note>;
  }
  const row = rows.find((r) => r.id === c.id) || rows[0];
  const worst = rows.reduce((a, b) => (Math.abs(b.gapFt) > Math.abs(a.gapFt) ? b : a));
  return (
    <>
      <div className="rounded-md border border-amber-700 bg-amber-900/20 p-4">
        <p className="text-xs text-gray-400 mb-1">
          One conversion from density to gradient, carried twice in one module
        </p>
        <p className="text-2xl font-bold text-white mb-1">
          {fmt(summary.exactPsiPerFtSg, 10)}
          <span className="text-[#BFFF00]"> against </span>
          {fmt(summary.roundedPsiPerFtSg, 10)} <span className="text-gray-400 text-sm">psi/ft per unit specific gravity</span>
        </p>
        <p className="text-sm text-amber-200 mb-0">
          gradientFromDensity divides by 144, which is exact. PSI_PER_FT_SG is the familiar rounded
          field figure. They are {fmt(summary.differencePsiPerFtSg, 10)} psi/ft apart, which is
          {' '}{fmt(summary.differencePct, 6)} percent, and both of them are in the same file.
        </p>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Exact form, water weight over 144" value={fmt(EXACT_PSI_PER_FT_SG, 10)} unit="psi/ft" />
          <Tile label="Rounded field form" value={fmt(PSI_PER_FT_SG, 10)} unit="psi/ft" />
          <Tile label="Difference" value={fmt(summary.differencePsiPerFtSg, 10)} unit="psi/ft" />
          <Tile label="Difference, as a percentage" value={fmt(summary.differencePct, 6)} unit="%" />
          <Tile label="This case, specific gravity a reader reaches for" value={fmt(row.trueSg, 8)} />
          <Tile label="This case, specific gravity the convention derives" value={fmt(row.launderedSg, 8)} />
          <Tile label="Design gradient, the one every consumer uses" value={fmt(row.designGradientPsiPerFt, 8)} unit="psi/ft" />
          <Tile label="Gradient on the reader's specific gravity" value={fmt(row.diagnosticsGradientOnTrueSgPsiPerFt, 8)} unit="psi/ft" />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 10, right: 20, bottom: 40, left: 0 }}>
            {GRID}
            <XAxis dataKey="id" tick={AXIS} interval={0} angle={-12} textAnchor="end" height={50} />
            <YAxis tick={AXIS}
              label={{ value: 'head the disagreement is worth, ft', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Bar dataKey="gapFt" name="feet of head" isAnimationActive={false}>
              {rows.map((r) => <Cell key={r.id} fill={r.id === row.id ? '#BFFF00' : '#38bdf8'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">case</th>
              <th className="text-left pr-3">specific gravity, density over water</th>
              <th className="text-left pr-3">specific gravity, derived from the gradient</th>
              <th className="text-left pr-3">head on the design gradient, ft</th>
              <th className="text-left pr-3">head on the reader's gravity, ft</th>
              <th className="text-left pr-3">gap, ft</th>
              <th className="text-left pr-3">gap, percent</th>
              <th className="text-left">gap when the convention is followed, ft</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={r.id === row.id ? 'text-white' : ''}>
                <td className="pr-3">{r.tag}</td>
                <td className="pr-3">{fmt(r.trueSg, 8)}</td>
                <td className="pr-3">{fmt(r.launderedSg, 8)}</td>
                <td className="pr-3">{fmt(r.headOnDesignGradientFt, 6)}</td>
                <td className="pr-3">{fmt(r.headOnTrueSgFt, 6)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.gapFt, 6)}</td>
                <td className="pr-3">{fmt(r.gapPct, 6)}</td>
                <td className="text-[#BFFF00]">{fmt(r.gapOnLaunderedSgFt, 12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        WHAT THE DISAGREEMENT IS WORTH. Take the specific gravity the obvious way, density over the
        weight of water, multiply by the rounded field constant, and divide the same pressure
        difference by it. On {worst.tag} that lands {fmt(worst.gapFt, 6)} ft away from the design
        answer, which is {fmt(worst.gapPct, 6)} percent, and the sign is always the same because the
        rounded constant is always the smaller of the two.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        THE CONVENTION THAT KEEPS THEM EXACT is to derive the specific gravity FROM the design
        gradient rather than from the density. Then the rounded constant times that gravity is
        identically the design gradient again, the design chain and the diagnostics chain sit on one
        column, and the last table column is nought on every case in this course. That is not a
        rounding that happens to be small. It is an identity, and it is why the goldens were cut
        that way. On the case selected above, {row.tag}, the design gradient is
        {' '}{fmt(row.designGradientPsiPerFt, 8)} psi/ft.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        The gap is a FIXED PERCENTAGE of whatever head it sits on, which is exactly why these
        figures are given on the published designs and the two teaching wells and nowhere else. A
        figure in feet divides straight back to the head that produced it, so quoting one on a
        graded case would hand over the answer.
      </div>
      <Note>
        Two forms of one constant in one file is the kind of thing that never shows up in a test and
        never shows up in a review, because each one is right. It shows up when two engineers who
        each did it correctly compare a stage count and find they are one stage apart, and neither
        of them can say why. Pick the convention, write it in the header, and derive everything
        downstream from it. In here the design gradient is the source, and specific gravity is what
        comes out of it.
      </Note>
    </>
  );
};

const LiftExplorer = () => {
  const [mode, setMode] = useState('intake');
  const [caseId, setCaseId] = useState(CASES.length ? CASES[0].id : '');
  const c = caseOf(caseId);
  if (!c) {
    return (
      <PanelShell title="Lift explorer" subtitle="What the pump swallows, what it has to add, and what that costs in stages">
        <Note>None of the four design cases would build. Every one of them is an intake pressure, a black oil stream, a gas split, a gradient, a head and a stack in that order, and the chain stops at the first step the engine will not take, so there is nothing to read at any of the four views.</Note>
      </PanelShell>
    );
  }
  return (
    <PanelShell
      title="Lift explorer"
      subtitle="What the pump actually swallows once the separator has had the gas, what the pressure it must add is worth in feet of that mixture, how many integer stages that takes and what the rounding buys, and the two forms of one conversion the module carries at once"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <SelectField label="Case" value={caseId} onChange={setCaseId}
          options={CASES.map((x) => [x.id, `${x.tag}`])} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'intake' && <Intake c={c} />}
        {mode === 'tdh' && <Tdh c={c} />}
        {mode === 'stack' && <Stack c={c} />}
        {mode === 'gradient' && <Gradient c={c} />}
      </div>
    </PanelShell>
  );
};

export default LiftExplorer;
