import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, LineChart, Line, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot,
} from 'recharts';
import {
  PUBLISHED_DESIGN_IDS, KNIFE_EDGE_ID, KNIFE_EDGE_DECREMENTS,
  PUBLISHED_TABULATION_SEGMENTS, INJECTION_POINT_GATE_PSI,
  unloadingExplorer,
} from './gasLiftLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Unloading explorer, the Expert tier. What the design sheet does not show and
// what breaks it: the order the valves hand the well down, and how deep the gas
// actually gets in.
//
// Four modes. The unloading sequence stage by stage, the published knife edge
// where one boolean hangs on a fraction of a psi, the deepest injection point on
// its two named runs, and two sweeps of the same verdict that move in two
// different ways.
//
// TWO RUNS OF THE INJECTION POINT AND THEY ARE KEPT APART HERE. The SHIPPED run
// is the published tabulation with the injection curve at the engine's own
// default sample count, which is the answer a user of the studio is handed. The
// REFINEMENT run holds the injection column converged and varies only the
// tabulation, which isolates the traverse chord. Different residuals, different
// ratios, and a caption must say which one it is quoting.
//
// Every figure on this page is a return value from gasLiftLab. Nothing here
// walks a string, tests a valve or locates a crossing.

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
  ['stages', 'The unloading sequence, stage by stage'],
  ['knifeedge', 'The published knife edge, where one boolean hangs on a fraction of a psi'],
  ['injectionpoint', 'The crossing, on both of its runs, and a residual that cannot see its own error'],
  ['sweep', 'Two sweeps of one verdict, one smooth and one a staircase'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const Stages = () => {
  const [pick, setPick] = useState('');
  const id = pick || PUBLISHED_DESIGN_IDS[0];
  const data = useMemo(() => {
    try { return unloadingExplorer.stages(id); } catch { return null; }
  }, [id]);
  const [stage, setStage] = useState('');
  if (!data || !data.rows || !data.rows.length) {
    return <Note>An unloading sequence needs a string of valves and a fluid level to walk down. A single point injection installation has one stage and no handover, so there is nothing to sequence and no upper valve that could still be open.</Note>;
  }
  const rows = data.rows;
  const here = rows.find((r) => String(r.stage) === stage) || rows[0];
  const multi = data.verdict.multipointingStages;
  const chart = rows.map((r) => ({
    stage: r.stage,
    depthFt: r.depthFt,
    injectionAtDepthPsia: r.injectionAtDepthPsia,
    productionAtDepthPsia: r.productionAtDepthPsia,
    surfaceInjectionPsia: r.surfaceInjectionPsia,
    openAbove: r.oracleUpperValvesOpen.length,
    gasRateMscfd: r.gasRateMscfd,
  }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Published design" value={id} onChange={setPick}
          options={PUBLISHED_DESIGN_IDS.map((x) => [x, x])} />
        <SelectField label="Stage to open up" value={stage || String(here.stage)} onChange={setStage}
          options={rows.map((r) => [String(r.stage), `stage ${r.stage}`])} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Stages in the sequence" value={fmt(rows.length, 0)} />
          <Tile label="Stages injecting at two depths" value={multi.length ? multi.join(', ') : 'none'} />
          <Tile label="Engine and oracle agree" value={yn(data.verdict.engineAgreesWithOracle)} />
          <Tile label="This stage injects at valve" value={fmt(here.valve, 0)} />
          <Tile label="Which sits at" value={fmt(here.depthFt, 4)} unit="ft TVD" />
          <Tile label="Casing at surface" value={fmt(here.surfaceInjectionPsia, 4)} unit="psia" />
          <Tile label="Injection pressure at that depth" value={fmt(here.injectionAtDepthPsia, 4)} unit="psia" />
          <Tile label="Gas the valve passes" value={fmt(here.gasRateMscfd, 4)} unit="Mscf/d" />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="stage" tick={AXIS}
              label={{ value: 'unloading stage', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="p" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'pressure, psia', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="n" orientation="right" tick={AXIS} allowDecimals={false}
              label={{ value: 'valves above still open', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="n" dataKey="openAbove" name="valves ABOVE this one still open" fill="#ef4444" isAnimationActive={false} />
            <Line yAxisId="p" type="monotone" dataKey="injectionAtDepthPsia" name="injection pressure at the operating valve"
              stroke="#BFFF00" isAnimationActive={false} />
            <Line yAxisId="p" type="monotone" dataKey="productionAtDepthPsia" name="production pressure there"
              stroke="#38bdf8" isAnimationActive={false} />
            <Line yAxisId="p" type="monotone" dataKey="surfaceInjectionPsia" name="casing at surface"
              stroke="#f97316" strokeDasharray="5 3" isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">stage</th>
              <th className="text-left pr-3">injecting at valve</th>
              <th className="text-left pr-3">depth, ft TVD</th>
              <th className="text-left pr-3">casing at surface, psia</th>
              <th className="text-left pr-3">injection at depth, psia</th>
              <th className="text-left pr-3">production at depth, psia</th>
              <th className="text-left pr-3">gas rate, Mscf/d</th>
              <th className="text-left pr-3">the oracle says open above</th>
              <th className="text-left">the engine says open above</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.stage} className={r.oracleMultipointing ? 'text-white' : ''}>
                <td className="pr-3">{fmt(r.stage, 0)}</td>
                <td className="pr-3">{fmt(r.valve, 0)}</td>
                <td className="pr-3">{fmt(r.depthFt, 3)}</td>
                <td className="pr-3">{fmt(r.surfaceInjectionPsia, 4)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.injectionAtDepthPsia, 6)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.productionAtDepthPsia, 6)}</td>
                <td className="pr-3">{fmt(r.gasRateMscfd, 4)}</td>
                <td className={`pr-3 ${r.oracleMultipointing ? 'text-[#ef4444]' : ''}`}>
                  {r.oracleUpperValvesOpen.length ? r.oracleUpperValvesOpen.join(', ') : 'none'}
                </td>
                <td className={r.engineMultipointing ? 'text-[#ef4444]' : ''}>
                  {r.engineUpperValvesOpen.length ? r.engineUpperValvesOpen.join(', ') : 'none'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 rounded-md border border-gray-700 bg-[#0F172A] p-3">
        <p className="text-xs text-gray-400 mb-2">
          STAGE {fmt(here.stage, 0)}, OPENED UP. The closing test on every valve ABOVE the operating
          one, which is the test the whole verdict rests on. A valve whose margin is positive is
          still open, and a stage with any of them open injects at two depths.
        </p>
        {here.closingMargins.length ? (
          <div className="overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">valve</th>
                  <th className="text-left pr-3">family</th>
                  <th className="text-left pr-3">the dome acts on</th>
                  <th className="text-left pr-3">acting pressure, psia</th>
                  <th className="text-left pr-3">dome at valve temperature, psia</th>
                  <th className="text-left pr-3">margin, psi</th>
                  <th className="text-left pr-3">spread, psi</th>
                  <th className="text-left pr-3">casing drop since it opened, psi</th>
                  <th className="text-left">still open</th>
                </tr>
              </thead>
              <tbody>
                {here.closingMargins.map((m) => (
                  <tr key={m.valve} className={m.open ? 'text-white' : ''}>
                    <td className="pr-3">{fmt(m.valve, 0)}</td>
                    <td className="pr-3">{m.family}</td>
                    <td className="pr-3">{m.actingOn}</td>
                    <td className="pr-3">{fmt(m.actingPressurePsia, 6)}</td>
                    <td className="pr-3">{fmt(m.domeAtTempPsia, 6)}</td>
                    <td className={`pr-3 ${m.open ? 'text-[#ef4444]' : 'text-[#BFFF00]'}`}>{fmt(m.marginPsi, 6)}</td>
                    <td className="pr-3">{fmt(m.spreadPsi, 6)}</td>
                    <td className="pr-3">{fmt(m.casingDropPsi, 6)}</td>
                    <td>{yn(m.open)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Note>Stage {fmt(here.stage, 0)} is the first one, so there is no valve above it to test. A closing margin needs a valve that has already been handed off, and at the top of the string there is none.</Note>
        )}
      </div>
      <div className="mt-3 text-xs text-slate-300">
        TWO ROADS TO ONE VERDICT, AND THAT IS WHY IT IS WORTH ANYTHING. The oracle evaluates the
        closing rule at VALVE DEPTH off a forward march, and the engine evaluates the same rule at
        SURFACE by inverting a coarser column. They are different arithmetic on different quantities,
        and on this design they agree: {yn(data.verdict.engineAgreesWithOracle)}. That agreement is
        the check. A verdict that only one road ever computed is not checked at all, however
        confidently it is printed, and this course exists partly because the first version of that
        oracle appended an empty open valve list at every stage without ever evaluating the
        condition. Coverage that is not coverage is worse than no coverage, because no coverage is
        visible.
      </div>
      <Note>{data.verdict.note}</Note>
    </>
  );
};

const KnifeEdge = () => {
  const [dec, setDec] = useState('');
  const base = useMemo(() => {
    try { return unloadingExplorer.knifeedge(); } catch { return null; }
  }, []);
  const chosen = Number(dec);
  const single = useMemo(() => {
    if (!dec || !Number.isFinite(chosen)) return null;
    try { return unloadingExplorer.knifeedge(chosen); } catch { return null; }
  }, [dec, chosen]);
  if (!base || !base.published || !base.mechanism || !base.mechanism.length || !base.sweep || !base.sweep.length) {
    return <Note>A knife edge needs a string whose closing test lands close to its own boundary. On a design with a wide margin at every stage the verdict does not move when the decrement does, so there is nothing on an edge to watch and no flip to find.</Note>;
  }
  const k = base.published;
  const mech = base.mechanism;
  const edge = mech.reduce((a, b) => (Math.abs(b.spreadLessDropPsi) < Math.abs(a.spreadLessDropPsi) ? b : a));
  const sweep = base.sweep;
  const picked = single && single.sweep.length ? single.sweep[0] : null;
  const publishedRow = sweep.find((r) => r.isPublished) || null;
  const flipped = sweep.filter((r) => publishedRow && r.stage5Multipointing !== publishedRow.stage5Multipointing);
  const nearestFlip = flipped.length
    ? flipped.reduce((a, b) => (Math.abs(b.decrementPsi - k.decrementPsi) < Math.abs(a.decrementPsi - k.decrementPsi) ? b : a))
    : null;
  return (
    <>
      <FieldGrid>
        <SelectField label="Surface decrement, psi per valve" value={dec} onChange={setDec}
          options={[['', `the published ${fmt(k.decrementPsi, 4)}`], ...KNIFE_EDGE_DECREMENTS.map((d) => [String(d), `${fmt(d, 4)} psi`])]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="The published case" value={k.id} />
          <Tile label="Spaced on" value={fmt(k.decrementPsi, 4)} unit="psi per valve" />
          <Tile label="Kicked off at" value={fmt(k.pKickoffPsia, 2)} unit="psia" />
          <Tile label="The stage the verdict hangs on" value={fmt(k.stage, 0)} />
          <Tile label="On the valve above it" value={fmt(k.valve, 0)} />
          <Tile label="THE MARGIN, off the forward march" value={fmt(k.oracleMarginPsi, 9)} unit="psi" />
          <Tile label="The engine reads the same margin as" value={fmt(k.engineMarginPsi, 9)} unit="psi" />
          <Tile label="Injection pressure at that valve" value={fmt(k.injectionAtValve4Psia, 6)} unit="psia" />
        </TileGrid>
      </div>
      <div className="mt-3 rounded-md border border-[#f472b6]/50 bg-[#0F172A] p-4">
        <p className="text-xs text-gray-400 mb-1">
          The whole verdict on this string, in one number, on a system running at
          {' '}{fmt(k.pKickoffPsia, 2)} psia:
        </p>
        <p className="text-3xl text-[#f472b6] font-semibold mb-1">{fmt(k.oracleMarginPsi, 9)} psi</p>
        <p className="text-xs text-gray-400 mb-0">
          That is how much valve {fmt(k.valve, 0)}&apos;s spread beats the casing drop by at stage
          {' '}{fmt(k.stage, 0)}. Stages {k.multipointingStages.join(', ')} inject at two depths.
          Stages {k.cleanStages.join(', ')} are clean.
        </p>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={mech} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="valve" tick={AXIS}
              label={{ value: 'valve, top to bottom', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'pressure, psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 9)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'the edge', fill: '#f472b6', fontSize: 10, position: 'insideBottomRight' }} />
            <Bar dataKey="spreadLessDropPsi" name="spread LESS the casing drop, which is the open flag" fill="#f472b6" isAnimationActive={false} />
            <Line type="monotone" dataKey="spreadPsi" name="the valve's own SPREAD"
              stroke="#BFFF00" isAnimationActive={false} />
            <Line type="monotone" dataKey="casingDropPsi" name="the casing DROP since that valve's opening stage"
              stroke="#38bdf8" isAnimationActive={false} />
            <ReferenceDot x={edge.valve} y={edge.spreadLessDropPsi} r={6} fill="#f472b6" stroke="#fff" isFront />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">valve</th>
              <th className="text-left pr-3">decrement, psi</th>
              <th className="text-left pr-3">its SPREAD, psi</th>
              <th className="text-left pr-3">casing DROP since it opened, psi</th>
              <th className="text-left pr-3">spread less drop, psi</th>
              <th className="text-left">still open</th>
            </tr>
          </thead>
          <tbody>
            {mech.map((m) => (
              <tr key={m.valve} className={m.valve === edge.valve ? 'text-white' : ''}>
                <td className="pr-3">{fmt(m.valve, 0)}</td>
                <td className="pr-3">{fmt(m.decrementPsi, 4)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(m.spreadPsi, 9)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(m.casingDropPsi, 9)}</td>
                <td className={`pr-3 ${m.valve === edge.valve ? 'text-[#f472b6]' : ''}`}>{fmt(m.spreadLessDropPsi, 9)}</td>
                <td className={m.open ? 'text-[#ef4444]' : ''}>{yn(m.open)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE OPEN FLAG IS A SUBTRACTION AND NOTHING MORE. A valve stays open when the casing has not
        yet fallen, since that valve&apos;s own opening stage, by as much as the valve&apos;s spread.
        Those are the two lines. Where the green line is above the blue one the valve is still open,
        and the bars are the gap. Read down the bars and they shrink, valve by valve, until valve
        {' '}{fmt(edge.valve, 0)} where the gap is {fmt(edge.spreadLessDropPsi, 9)} psi. That is the
        whole verdict for this string: {fmt(edge.spreadPsi, 9)} psi of spread against
        {' '}{fmt(edge.casingDropPsi, 9)} psi of casing drop, on a system kicked off at
        {' '}{fmt(k.pKickoffPsia, 2)} psia. Nothing on an installation is controlled to that.
      </div>
      <div className="mt-4 rounded-md border border-gray-700 bg-[#0F172A] p-3">
        <p className="text-xs text-gray-400 mb-2">
          MOVE THE DECREMENT AND WATCH THE BOOLEAN FLIP. The selector above re-runs the same
          published case at a different surface decrement. Everything else is held.
        </p>
        <TileGrid>
          <Tile label="Decrement in the box" value={picked ? fmt(picked.decrementPsi, 4) : fmt(k.decrementPsi, 4)} unit="psi per valve" />
          <Tile label="Is that the published one" value={yn(picked ? picked.isPublished : true)} />
          <Tile label="The margin it gives" value={fmt(picked ? picked.stage5MarginPsi : k.oracleMarginPsi, 9)} unit="psi" />
          <Tile label="Does that stage inject at two depths" value={picked ? yn(picked.stage5Multipointing) : yn(k.multipointingStages.includes(k.stage))} />
          <Tile label="Stages injecting at two depths" value={picked ? (picked.multipointingStages.length ? picked.multipointingStages.join(', ') : 'none') : k.multipointingStages.join(', ')} />
          <Tile label="Decrements the sweep walks" value={fmt(sweep.length, 0)} />
          <Tile label="Of those, the verdict differs on" value={fmt(flipped.length, 0)} />
          <Tile label="Nearest decrement that flips it" value={nearestFlip ? fmt(nearestFlip.decrementPsi, 4) : '-'} unit={nearestFlip ? 'psi per valve' : ''} />
        </TileGrid>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sweep} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
              {GRID}
              <XAxis dataKey="decrementPsi" type="number" domain={['dataMin', 'dataMax']} tick={AXIS}
                label={{ value: 'surface decrement, psi per valve', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={AXIS}
                label={{ value: 'closing margin, psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 9)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#f472b6" strokeDasharray="4 3"
                label={{ value: 'the verdict flips here', fill: '#f472b6', fontSize: 10, position: 'insideBottomRight' }} />
              <ReferenceLine x={k.decrementPsi} stroke="#64748b"
                label={{ value: 'as published', fill: '#64748b', fontSize: 10, position: 'top' }} />
              <Line type="monotone" dataKey="stage5MarginPsi" name="the margin, swept over the decrement"
                stroke="#BFFF00" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">decrement, psi per valve</th>
                <th className="text-left pr-3">published</th>
                <th className="text-left pr-3">the margin, psi</th>
                <th className="text-left pr-3">that stage injects at two depths</th>
                <th className="text-left">stages that do</th>
              </tr>
            </thead>
            <tbody>
              {sweep.map((r) => (
                <tr key={r.decrementPsi} className={r.isPublished ? 'text-white' : ''}>
                  <td className="pr-3">{fmt(r.decrementPsi, 4)}</td>
                  <td className="pr-3">{yn(r.isPublished)}</td>
                  <td className={`pr-3 ${r.stage5MarginPsi < 0 ? 'text-[#38bdf8]' : 'text-[#ef4444]'}`}>{fmt(r.stage5MarginPsi, 9)}</td>
                  <td className="pr-3">{yn(r.stage5Multipointing)}</td>
                  <td>{r.multipointingStages.length ? r.multipointingStages.join(', ') : 'none'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A QUARTER OF A PSI DECIDES IT. Whether this string injects at two depths is the single most
        consequential thing the design emits, and on the published case it hangs on
        {' '}{fmt(k.oracleMarginPsi, 9)} psi.
        {nearestFlip
          ? ` The nearest decrement in this sweep that gives a different answer at that stage is ${fmt(nearestFlip.decrementPsi, 4)} psi per valve against the published ${fmt(k.decrementPsi, 4)}.`
          : ' Every decrement in this sweep gives the same answer at that stage.'}
        {' '}No surface decrement on any installation on earth is held to a fraction of a psi per
        valve. So the honest reading of this output is not that the string multipoints, it is that
        the string is AT the boundary and the design does not resolve which side of it the well is
        on. A boolean that consequential, decided that finely, is not a detail of the answer. It is
        the answer, and it needs a design change rather than a tighter number.
      </div>
      <Note>{base.verdict.note}</Note>
    </>
  );
};

const InjectionPoint = () => {
  const data = useMemo(() => {
    try { return unloadingExplorer.injectionpoint(); } catch { return null; }
  }, []);
  if (!data || !data.tabulation || !data.tabulation.length || !data.shipped || !data.converged) {
    return <Note>The crossing needs a flowing production traverse handed in as a depth and pressure table. This module does not solve multiphase outflow, so with no table there is no production line to cross and the engine reports no injection point rather than inventing a gradient.</Note>;
  }
  const shipped = data.shipped;
  const converged = data.converged;
  const tab = data.tabulation;
  const atShipped = tab.find((r) => r.isShippedSpacing) || null;
  const teaching = data.teaching;
  const lowest = tab.reduce((a, b) => (b.trueOverReported < a.trueOverReported ? b : a));
  const finest = tab[tab.length - 1];
  const bestReported = tab.reduce((a, b) => (Math.abs(b.reportedResidualPsi) < Math.abs(a.reportedResidualPsi) ? b : a));
  const bestTrue = tab.reduce((a, b) => (Math.abs(b.depthErrorFt) < Math.abs(a.depthErrorFt) ? b : a));
  return (
    <>
      <div className="mt-1 rounded-md border border-gray-700 bg-[#0F172A] p-3">
        <p className="text-xs text-gray-400 mb-2">
          RUN ONE, THE SHIPPED ENGINE LINE. The published tabulation at
          {' '}{fmt(PUBLISHED_TABULATION_SEGMENTS, 0)} segments AND the injection curve at the
          engine&apos;s own default sample count. This is the answer a user of the studio is handed.
        </p>
        <TileGrid>
          <Tile label="The depth it reports" value={fmt(shipped.depthFt, 6)} unit="ft TVD" />
          <Tile label="Injection pressure there" value={fmt(shipped.pInjPsia, 6)} unit="psia" />
          <Tile label="Production pressure there" value={fmt(shipped.pProdPsia, 6)} unit="psia" />
          <Tile label="What limits it" value={shipped.limitedBy} />
          <Tile label="THE RESIDUAL IT REPORTS" value={tiny(shipped.reportedResidualPsi)} unit="psi" />
          <Tile label="The TRUE residual at that depth" value={tiny(shipped.trueResidualPsi)} unit="psi" />
          <Tile label="True over reported" value={fmt(shipped.trueOverReported, 4)} />
          <Tile label="How far off the depth is" value={fmt(shipped.depthErrorFt, 9)} unit="ft" />
        </TileGrid>
      </div>
      <div className="mt-3 rounded-md border border-gray-700 bg-[#0F172A] p-3">
        <p className="text-xs text-gray-400 mb-2">
          CONVERGED. The same crossing with the tabulation refined until it stops moving. This is
          what the answer above was trying to be.
        </p>
        <TileGrid>
          <Tile label="The converged depth" value={fmt(converged.depthFt, 6)} unit="ft TVD" />
          <Tile label="Injection pressure there" value={fmt(converged.pInjPsia, 6)} unit="psia" />
          <Tile label="Production pressure there" value={fmt(converged.pProdPsia, 6)} unit="psia" />
          <Tile label="Its residual" value={tiny(converged.residualPsi)} unit="psi" />
          <Tile label="The acceptance gate the engine applies" value={fmt(INJECTION_POINT_GATE_PSI, 3)} unit="psi" />
          <Tile label="The shipped answer passes that gate" value={yn(Math.abs(shipped.reportedResidualPsi) < INJECTION_POINT_GATE_PSI)} />
          <Tile label="And is wrong by" value={fmt(shipped.depthErrorFt, 9)} unit="ft" />
          <Tile label="And by" value={fmt(shipped.pressureErrorPsi, 9)} unit="psi" />
        </TileGrid>
      </div>
      <div className="mt-3 rounded-md border border-gray-700 bg-[#0F172A] p-3">
        <p className="text-xs text-gray-400 mb-2">
          RUN TWO, THE REFINEMENT. A DIFFERENT RUN, AND ITS NUMBERS DO NOT BELONG IN A SENTENCE WITH
          RUN ONE&apos;S. Here the injection column is held CONVERGED and only the tabulation of the
          production traverse is varied, which isolates the traverse chord. The row marked as the
          shipped spacing is the same {fmt(PUBLISHED_TABULATION_SEGMENTS, 0)} segments the studio
          ships, on this second run.
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tab} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
              {GRID}
              <XAxis dataKey="segments" type="number" scale="log" domain={['dataMin', 'dataMax']} tick={AXIS}
                label={{ value: 'segments the traverse is tabulated at', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={AXIS}
                label={{ value: 'true residual over reported residual', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {atShipped ? (
                <ReferenceLine x={atShipped.segments} stroke="#64748b"
                  label={{ value: 'the shipped spacing', fill: '#64748b', fontSize: 10, position: 'top' }} />
              ) : null}
              <Line type="monotone" dataKey="trueOverReported"
                name="how many times bigger the true residual is than the reported one"
                stroke="#ef4444" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tab} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
              {GRID}
              <XAxis dataKey="segments" type="number" scale="log" domain={['dataMin', 'dataMax']} tick={AXIS}
                label={{ value: 'segments the traverse is tabulated at', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={AXIS}
                label={{ value: 'psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => tiny(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#64748b" />
              <Line type="monotone" dataKey="reportedResidualPsi" name="the residual the function REPORTS"
                stroke="#BFFF00" dot isAnimationActive={false} />
              <Line type="monotone" dataKey="trueResidualPsi" name="the residual that is actually there"
                stroke="#ef4444" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">segments</th>
                <th className="text-left pr-3">rows</th>
                <th className="text-left pr-3">spacing, ft</th>
                <th className="text-left pr-3">the shipped one</th>
                <th className="text-left pr-3">depth, ft TVD</th>
                <th className="text-left pr-3">depth error, ft</th>
                <th className="text-left pr-3">reported residual, psi</th>
                <th className="text-left pr-3">true residual, psi</th>
                <th className="text-left">true over reported</th>
              </tr>
            </thead>
            <tbody>
              {tab.map((r) => (
                <tr key={r.segments} className={r.isShippedSpacing ? 'text-white' : ''}>
                  <td className="pr-3">{fmt(r.segments, 0)}</td>
                  <td className="pr-3">{fmt(r.rows, 0)}</td>
                  <td className="pr-3">{fmt(r.spacingFt, 5)}</td>
                  <td className="pr-3">{yn(r.isShippedSpacing)}</td>
                  <td className="pr-3">{fmt(r.depthFt, 6)}</td>
                  <td className="pr-3">{tiny(r.depthErrorFt)}</td>
                  <td className="pr-3 text-[#BFFF00]">{tiny(r.reportedResidualPsi)}</td>
                  <td className="pr-3 text-[#ef4444]">{tiny(r.trueResidualPsi)}</td>
                  <td className="text-[#f472b6]">{fmt(r.trueOverReported, 4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE RESIDUAL DOES NOT FALL AS THE ERROR FALLS, AND THAT IS THE FINDING. The crossing is
        located on straight lines drawn between whatever rows the caller tabulated, and BOTH SIDES of
        the residual come off the SAME pair of chords. So the number the function reports at its own
        answer is a statement that the two chords agree with each other, and nothing else. On the
        shipped run above it reports {tiny(shipped.reportedResidualPsi)} psi against a true
        {' '}{tiny(shipped.trueResidualPsi)} psi, {fmt(shipped.trueOverReported, 4)} times larger,
        while the depth is {fmt(shipped.depthErrorFt, 9)} ft off. It passes the engine&apos;s own
        {' '}{fmt(INJECTION_POINT_GATE_PSI, 3)} psi acceptance gate comfortably. The gate is
        measuring the wrong thing.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        AND IT IS WORSE THAN A CONSTANT OFFSET, BECAUSE THE RATIO IS NOT EVEN MONOTONE. Read the
        last column of the refinement table from top to bottom. It starts at
        {' '}{fmt(tab[0].trueOverReported, 4)} at {fmt(tab[0].segments, 0)} segments, falls through
        the shipped spacing, collapses to {fmt(lowest.trueOverReported, 4)} at
        {' '}{fmt(lowest.segments, 0)} segments, and then CLIMBS again, refinement after refinement,
        all the way back to {fmt(finest.trueOverReported, 4)} at {fmt(finest.segments, 0)} segments.
        Refining the tabulation made the reported residual less representative of the real error,
        not more. If the ratio were a constant, a reader who knew it could correct for it. If it fell
        with refinement, it would at least be conservative. It does neither, so the reported residual
        carries no information about which DIRECTION the error is moving in, let alone how big it is.
        An engineer who tightens an acceptance tolerance on that number is choosing between answers
        on a quantity that cannot rank them: the tabulation with the smallest reported residual here
        is {fmt(bestReported.segments, 0)} segments, and the one with the smallest actual depth error
        is {fmt(bestTrue.segments, 0)}.
      </div>
      {teaching && teaching.length ? (
        <div className="mt-4 rounded-md border border-gray-700 bg-[#0F172A] p-3">
          <p className="text-xs text-gray-400 mb-2">
            THE SAME MECHANISM ON THIS COURSE&apos;S OWN TEACHING TRAVERSE, WHICH IS A THIRD SET OF
            CONDITIONS AND IS LABELLED AS ONE. It is built to make the effect large: the ratio here
            holds near {fmt(teaching[0].trueOverReported, 4)} down the whole refinement instead of
            wandering. A number from this table does not belong in a sentence with a number from
            either run above.
          </p>
          <div className="overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">segments</th>
                  <th className="text-left pr-3">spacing, ft</th>
                  <th className="text-left pr-3">depth, ft TVD</th>
                  <th className="text-left pr-3">depth error, ft</th>
                  <th className="text-left pr-3">reported residual, psi</th>
                  <th className="text-left pr-3">true residual, psi</th>
                  <th className="text-left">true over reported</th>
                </tr>
              </thead>
              <tbody>
                {teaching.map((r) => (
                  <tr key={r.segments}>
                    <td className="pr-3">{fmt(r.segments, 0)}</td>
                    <td className="pr-3">{fmt(r.spacingFt, 4)}</td>
                    <td className="pr-3">{fmt(r.depthFt, 6)}</td>
                    <td className="pr-3">{fmt(r.depthErrorFt, 9)}</td>
                    <td className="pr-3 text-[#BFFF00]">{tiny(r.reportedResidualPsi)}</td>
                    <td className="pr-3 text-[#ef4444]">{tiny(r.trueResidualPsi)}</td>
                    <td className="text-[#f472b6]">{fmt(r.trueOverReported, 4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
      <div className="mt-3 text-xs text-slate-300">
        THREE SETS OF CONDITIONS ARE ON THIS PAGE AND THE COURSE NAMES THEM RATHER THAN AVERAGING
        THEM. Run one is the shipped engine line and its ratio is
        {' '}{fmt(shipped.trueOverReported, 4)}. Run two is the tabulation refinement, which reads
        {' '}{atShipped ? fmt(atShipped.trueOverReported, 4) : '-'} at the SAME
        {' '}{fmt(PUBLISHED_TABULATION_SEGMENTS, 0)} segments, because it holds the injection column
        converged and run one does not. The teaching traverse is a third. Quoting a ratio without
        naming its run is how a finding stops being reproducible.
      </div>
      <Note>{data.verdict.note}</Note>
    </>
  );
};

const Sweep = () => {
  const data = useMemo(() => {
    try { return unloadingExplorer.sweep(); } catch { return null; }
  }, []);
  if (!data || !data.decrement || !data.decrement.length || !data.gasRate || !data.gasRate.length) {
    return <Note>A sweep needs a verdict that responds to something. On a design whose closing test never lands near its boundary the margin does not change sign anywhere in either sweep, so there is nothing to see moving and nothing to compare the two resolutions on.</Note>;
  }
  const dec = data.decrement;
  const gas = data.gasRate;
  const decDistinct = new Set(dec.map((r) => r.stage5MarginPsi)).size;
  const gasDistinct = new Set(gas.map((r) => r.stage5MarginPsi)).size;
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Decrements swept" value={fmt(dec.length, 0)} />
          <Tile label="Distinct margins they give" value={fmt(decDistinct, 0)} />
          <Tile label="So the decrement moves it" value={data.verdict.decrementIsSmooth ? 'smoothly' : 'in steps'} />
          <Tile label="Margin at the shallowest decrement" value={fmt(dec[0].stage5MarginPsi, 9)} unit="psi" />
          <Tile label="Gas rates swept" value={fmt(gas.length, 0)} />
          <Tile label="Distinct margins THEY give" value={fmt(gasDistinct, 0)} />
          <Tile label="So the gas rate moves it" value={data.verdict.gasRateIsAStep ? 'in steps' : 'smoothly'} />
          <Tile label="Margin at the lowest gas rate" value={fmt(gas[0].stage5MarginPsi, 9)} unit="psi" />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dec} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="decrementPsi" type="number" domain={['dataMin', 'dataMax']} tick={AXIS}
              label={{ value: 'surface decrement, psi per valve', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'closing margin, psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 9)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'the verdict flips here', fill: '#f472b6', fontSize: 10, position: 'insideBottomRight' }} />
            <Line type="monotone" dataKey="stage5MarginPsi" name="THE SAME MARGIN, swept over the decrement"
              stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={gas} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="qgiTargetMscfd" type="number" domain={['dataMin', 'dataMax']} tick={AXIS}
              label={{ value: 'design gas rate, Mscf/d', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'closing margin, psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 9)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'the verdict flips here', fill: '#f472b6', fontSize: 10, position: 'insideBottomRight' }} />
            <Line type="stepAfter" dataKey="stage5MarginPsi" name="THE SAME MARGIN, swept over the design gas rate"
              stroke="#38bdf8" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        SAME QUANTITY, SAME UNITS, SAME AXIS LABEL. The two plots differ only in what is being swept,
        and they do not look alike. Over the decrement the margin moves continuously: every one of
        the {fmt(dec.length, 0)} rows gives a different margin, {fmt(decDistinct, 0)} distinct values
        out of {fmt(dec.length, 0)} points, so a finer sweep here genuinely tells you more. Over the
        design gas rate it is a staircase: {fmt(gas.length, 0)} rates produce only
        {' '}{fmt(gasDistinct, 0)} distinct margins, because the rate reaches the verdict ONLY
        through the port selection and the port selection is a lookup in a catalogue.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        A SWEEP&apos;S RESOLUTION HAS TO MATCH THE MECHANISM AND NOT THE AXIS. On the lower plot a
        coarse sweep steps over a tread and misses the flip. A fine one lands repeatedly inside one
        tread, finds nothing, and reads that as evidence of stability. Both readings are wrong for
        the same reason: the sweep was placed on the axis instead of on the mechanism. The only
        informative sweep of the lower plot is one placed at the catalogue boundaries, and you cannot
        know where those are by looking at the axis.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">design gas rate, Mscf/d</th>
              <th className="text-left pr-3">published</th>
              <th className="text-left pr-3">ports the string carries, in</th>
              <th className="text-left pr-3">the margin, psi</th>
              <th className="text-left">stages injecting at two depths</th>
            </tr>
          </thead>
          <tbody>
            {gas.map((r, k) => {
              const moved = k > 0 && r.stage5MarginPsi !== gas[k - 1].stage5MarginPsi;
              return (
                <tr key={r.qgiTargetMscfd} className={moved ? 'text-white' : ''}>
                  <td className="pr-3">{fmt(r.qgiTargetMscfd, 0)}</td>
                  <td className="pr-3">{yn(r.isPublished)}</td>
                  <td className="pr-3">{r.ports.map((p) => fmt(p, 5)).join(', ')}</td>
                  <td className={`pr-3 ${moved ? 'text-[#38bdf8]' : ''}`}>{fmt(r.stage5MarginPsi, 9)}</td>
                  <td>{r.multipointingStages.length ? r.multipointingStages.join(', ') : 'none'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Note>{data.verdict.note}</Note>
    </>
  );
};

const UnloadingExplorer = () => {
  const [mode, setMode] = useState('stages');
  return (
    <PanelShell
      title="Unloading explorer"
      subtitle={`What the design sheet does not show: the unloading sequence stage by stage, the ${KNIFE_EDGE_ID} case where one boolean hangs on a fraction of a psi, the deepest injection point on both of its named runs with a residual that cannot see its own error, and two sweeps of the same verdict that move in two different ways`}
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'stages' && <Stages />}
        {mode === 'knifeedge' && <KnifeEdge />}
        {mode === 'injectionpoint' && <InjectionPoint />}
        {mode === 'sweep' && <Sweep />}
      </div>
    </PanelShell>
  );
};

export default UnloadingExplorer;
