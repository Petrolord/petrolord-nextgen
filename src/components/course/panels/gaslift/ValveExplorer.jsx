import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, LineChart, Line, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  PUBLISHED_DESIGN_IDS, CATALOGUE_PORTS_IN, GAS_LIFT_THRESHOLDS,
  SPACING_MAX_ITERATES, TC_K,
  valveExplorer, designInputs,
} from './gasLiftLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Valve explorer, the Professional tier. Where the mandrels go and what the
// shop dials into them.
//
// Four modes. The spacing recursion made visible iterate by iterate, one valve
// read as dome, bellows and port at two temperatures, the spread across the
// string with the production operated case shown as its own series, and what a
// port passes across the regime.
//
// TWO ROADS TO A SPACING DEPTH AND THEY ARE KEPT APART HERE. Road one is the
// recursion re-run standalone; road two is what the design itself returned. They
// agree to about seven significant figures and no further, so every table below
// says which road it is on and no chart mixes them.
//
// Every figure on this page is a return value from gasLiftLab. Nothing here
// solves a fixed point, charges a dome or sizes a port.

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
  ['spacing', 'The recursion, iterate by iterate, and what a decrement moves'],
  ['valve', 'Dome, bellows and port, read at two temperatures'],
  ['spread', 'Spread across the string, and the case where it comes out negative'],
  ['throughput', 'What a port passes, and why the design rate moves in steps'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const SERIES = ['#BFFF00', '#38bdf8', '#f97316', '#f472b6'];

const idOptions = () => PUBLISHED_DESIGN_IDS.map((id) => [id, id]);

const Spacing = () => {
  const [pick, setPick] = useState('');
  const [dec, setDec] = useState('');
  const id = pick || PUBLISHED_DESIGN_IDS[0];
  const published = useMemo(() => {
    try { return designInputs(id).dpPerValvePsi; } catch { return null; }
  }, [id]);
  const chosen = Number(dec);
  const useChosen = dec !== '' && Number.isFinite(chosen) && chosen > 0;
  const data = useMemo(() => {
    try { return valveExplorer.spacing(id, useChosen ? chosen : undefined); } catch { return null; }
  }, [id, useChosen, chosen]);
  const [valve, setValve] = useState('');
  if (!data || !data.recursion || !data.recursion.length || !data.design || !data.design.length) {
    return <Note>A spacing recursion needs at least two valves before there is anything to recurse. A design that places one mandrel and stops has a top valve and no increments, so there is no fixed point to watch converge and no decrement to move.</Note>;
  }
  const step = data.recursion.find((r) => String(r.valve) === valve) || data.recursion[0];
  const sweep = data.sweep;
  const swept = sweep.length ? sweep : null;
  const shallowest = swept ? swept[0] : null;
  const deepest = swept ? swept[swept.length - 1] : null;
  return (
    <>
      <FieldGrid>
        <SelectField label="Published design" value={id} onChange={setPick} options={idOptions()} />
        <NumField label="Surface decrement, psi per valve" value={dec} onChange={setDec}
          placeholder={published === null ? '' : String(published)} />
        <SelectField label="Valve to watch converge" value={valve || String(step.valve)} onChange={setValve}
          options={data.recursion.map((r) => [String(r.valve), `valve ${r.valve}`])} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Decrement in use" value={fmt(step.decrementPsi, 4)} unit="psi per valve" />
          <Tile label="Published decrement" value={fmt(published, 4)} unit="psi per valve" />
          <Tile label="Surface pressure at this valve" value={fmt(step.surfacePressurePsia, 4)} unit="psia" />
          <Tile label="The valve above sits at" value={fmt(step.previousFt, 4)} unit="ft TVD" />
          <Tile label="Transfer pressure there" value={fmt(step.previousTransferPsia, 4)} unit="psia" />
          <Tile label="Seed the recursion starts from" value={fmt(step.seedFt, 4)} unit="ft TVD" />
          <Tile label="Iterates it took" value={fmt(step.iterates.length, 0)} unit={`of ${fmt(SPACING_MAX_ITERATES, 0)}`} />
          <Tile label="Where it converged" value={fmt(step.convergedFt, 4)} unit="ft TVD" />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={step.iterates} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="iterate" tick={AXIS}
              label={{ value: 'iterate', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="d" tick={AXIS}
              label={{ value: 'depth, ft TVD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="m" orientation="right" tick={AXIS}
              label={{ value: 'move this iterate, ft', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="d" y={step.convergedFt} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'the fixed point', fill: '#f472b6', fontSize: 10, position: 'right' }} />
            <Line yAxisId="d" type="monotone" dataKey="atFt" name="the depth this iterate was evaluated at"
              stroke="#BFFF00" isAnimationActive={false} />
            <Bar yAxisId="m" dataKey="moveFt" name="how far the next iterate moves it" fill="#38bdf8" isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">iterate</th>
              <th className="text-left pr-3">evaluated at, ft TVD</th>
              <th className="text-left pr-3">injection pressure there, psia</th>
              <th className="text-left pr-3">head available, psi</th>
              <th className="text-left pr-3">it moves to, ft TVD</th>
              <th className="text-left">the move, ft</th>
            </tr>
          </thead>
          <tbody>
            {step.iterates.map((r) => (
              <tr key={r.iterate}>
                <td className="pr-3">{fmt(r.iterate, 0)}</td>
                <td className="pr-3">{fmt(r.atFt, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.pInjPsia, 6)}</td>
                <td className="pr-3">{fmt(r.availableHeadPsi, 6)}</td>
                <td className="pr-3">{fmt(r.nextFt, 6)}</td>
                <td className={Math.abs(r.moveFt) < GAS_LIFT_THRESHOLDS.fixedPointToleranceFt ? 'text-[#38bdf8]' : ''}>
                  {tiny(r.moveFt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        ROAD ONE: THE RECURSION RE-RUN STANDALONE. A valve depth is not a formula, it is the fixed
        point of a map that has the depth on both sides: the injection pressure at a depth decides
        where the valve goes, and where the valve goes decides the injection pressure. The engine
        seeds it at the minimum spacing below the valve above and stops when a step moves it less
        than {fmt(GAS_LIFT_THRESHOLDS.fixedPointToleranceFt, 4)} ft, which on this valve took
        {' '}{fmt(step.iterates.length, 0)} iterates. Watch the move column: it falls by a large
        factor each time, which is what a contraction looks like.
      </div>
      <div className="mt-4 rounded-md border border-gray-700 bg-[#0F172A] p-3">
        <p className="text-xs text-gray-400 mb-2">
          ROAD TWO, KEPT SEPARATE ON PURPOSE. These are the depths the DESIGN ITSELF returned and
          the increments of those same depths. They agree with road one to about seven significant
          figures and no further, because the fixed point is stopped at a tolerance rather than
          solved. Neither road is wrong, and pairing a depth from one with an increment from the
          other is how a difference in the seventh figure turns into a number nobody can reproduce.
        </p>
        <div className="overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">valve</th>
                <th className="text-left pr-3">depth the design returned, ft TVD</th>
                <th className="text-left pr-3">surface pressure at it, psia</th>
                <th className="text-left pr-3">increment from the valve above, ft</th>
                <th className="text-left">minimum spacing, ft</th>
              </tr>
            </thead>
            <tbody>
              {data.design.map((d) => {
                const inc = data.increments.find((x) => x.to === d.valve);
                return (
                  <tr key={d.valve}>
                    <td className="pr-3">{fmt(d.valve, 0)}</td>
                    <td className="pr-3 text-[#BFFF00]">{fmt(d.depthFt, 6)}</td>
                    <td className="pr-3">{fmt(d.surfacePressurePsia, 4)}</td>
                    <td className="pr-3">{inc ? fmt(inc.incrementFt, 6) : '-'}</td>
                    <td>{inc ? fmt(inc.minSpacingFt, 0) : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {swept ? (
        <div className="mt-4 rounded-md border border-gray-700 bg-[#0F172A] p-3">
          <p className="text-xs text-gray-400 mb-2">
            CHANGE THE DECREMENT AND EVERY DEPTH BELOW THE CHANGE MOVES. This is the whole design
            re-run at each decrement, so the shifts compound downward. VALVE 1 NEVER MOVES, because
            it is set by the kickoff pressure alone and the decrement has not been applied yet when
            it is placed. A decrement is not a property of a valve, it is the step size of the whole
            recursion.
          </p>
          <TileGrid>
            <Tile label="Decrements swept" value={fmt(swept.length, 0)} />
            <Tile label="Shallowest sweep" value={fmt(shallowest.decrementPsi, 4)} unit="psi per valve" />
            <Tile label="Valves it places" value={fmt(shallowest.valveCount, 0)} />
            <Tile label="It stops because" value={shallowest.stopReason} />
            <Tile label="Deepest sweep" value={fmt(deepest.decrementPsi, 4)} unit="psi per valve" />
            <Tile label="Valves it places" value={fmt(deepest.valveCount, 0)} />
            <Tile label="It stops because" value={deepest.stopReason} />
            <Tile label="Valve 1 moves at any decrement" value={yn(swept.some((s) => s.depths[0].shiftFt !== 0))} />
          </TileGrid>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">decrement, psi</th>
                  <th className="text-left pr-3">published</th>
                  <th className="text-left pr-3">valves</th>
                  <th className="text-left pr-3">stops on</th>
                  {swept[0].depths.map((d) => (
                    <th key={d.valve} className="text-left pr-3">valve {d.valve} shift, ft</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {swept.map((s) => (
                  <tr key={s.decrementPsi} className={s.isPublished ? 'text-white' : ''}>
                    <td className="pr-3">{fmt(s.decrementPsi, 4)}</td>
                    <td className="pr-3">{yn(s.isPublished)}</td>
                    <td className="pr-3">{fmt(s.valveCount, 0)}</td>
                    <td className="pr-3">{s.stopReason}</td>
                    {swept[0].depths.map((d) => {
                      const here = s.depths.find((x) => x.valve === d.valve);
                      return (
                        <td key={d.valve} className="pr-3">
                          {here && Number.isFinite(here.shiftFt) ? tiny(here.shiftFt) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Note>
          This design carries no decrement sweep, so the compounding cannot be shown on it. Pick a
          design that does and the whole string re-runs at each decrement. The recursion above still
          responds to the decrement box, but read it for what it is: it re-runs ONE valve off the
          PUBLISHED depth of the valve above, so it shows the one step and not the compounding.
        </Note>
      )}
      <div className="mt-3 text-xs text-slate-300">
        A CAVEAT WORTH CARRYING. The standalone recursion above starts each valve from the PUBLISHED
        depth of the valve above it. That is what makes it readable one valve at a time, and it also
        means that at a decrement other than {fmt(published, 4)} psi its converged depth is the one
        step of the map and not the depth the design would actually place. The compounded answer is
        the sweep table, which re-runs the whole design.
      </div>
      <Note>{data.verdict.note}</Note>
    </>
  );
};

const Valve = () => {
  const [pick, setPick] = useState('');
  const id = pick || PUBLISHED_DESIGN_IDS[0];
  const data = useMemo(() => {
    try { return valveExplorer.valve(id); } catch { return null; }
  }, [id]);
  if (!data || !data.rows || !data.rows.length) {
    return <Note>A valve reading needs a dome charge, a bellows area and a port. An orifice at the bottom of a string has no dome and no bellows at all, so it has no opening pressure, no spread and nothing to dial into a test rack.</Note>;
  }
  const rows = data.rows;
  const charged = rows.filter((r) => Number.isFinite(r.domeAtTempPsia));
  const worstNitrogen = data.nitrogen.reduce((a, b) => (Math.abs(b.linearDomeMissPsi) > Math.abs(a.linearDomeMissPsi) ? b : a));
  return (
    <>
      <FieldGrid>
        <SelectField label="Published design" value={id} onChange={setPick} options={idOptions()} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Valves in the string" value={fmt(rows.length, 0)} />
          <Tile label="Carrying a dome charge" value={fmt(charged.length, 0)} />
          <Tile label="Test rack temperature" value={fmt(GAS_LIFT_THRESHOLDS.testRackTempF, 0)} unit="degF" />
          <Tile label="Ports in the catalogue" value={fmt(CATALOGUE_PORTS_IN.length, 0)} />
          <Tile label="Shallowest valve temperature" value={fmt(rows[0].tempF, 2)} unit="degF" />
          <Tile label="Deepest valve temperature" value={fmt(rows[rows.length - 1].tempF, 2)} unit="degF" />
          <Tile label="Worst drift of the linear dome rule" value={fmt(worstNitrogen.linearDomeMissPsi, 6)} unit="psi" />
          <Tile label="At" value={fmt(worstNitrogen.tF, 0)} unit="degF" />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="valve" tick={AXIS}
              label={{ value: 'valve, top to bottom', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="p" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'pressure, psia', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="r" orientation="right" tick={AXIS}
              label={{ value: 'port over bellows', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="p" type="monotone" dataKey="pInjAtDepthPsia" name="injection pressure at valve depth"
              stroke="#BFFF00" isAnimationActive={false} />
            <Line yAxisId="p" type="monotone" dataKey="domeAtTempPsia" name="dome AT VALVE TEMPERATURE"
              stroke="#38bdf8" isAnimationActive={false} />
            <Line yAxisId="p" type="monotone" dataKey="dome60Psia" name={`dome as charged at ${fmt(GAS_LIFT_THRESHOLDS.testRackTempF, 0)} degF`}
              stroke="#f472b6" strokeDasharray="5 3" isAnimationActive={false} />
            <Line yAxisId="p" type="monotone" dataKey="testRackOpeningPsia" name="test rack opening pressure"
              stroke="#f97316" isAnimationActive={false} />
            <Line yAxisId="r" type="monotone" dataKey="r" name="port to bellows ratio R"
              stroke="#94a3b8" strokeDasharray="2 2" isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">valve</th>
              <th className="text-left pr-3">depth, ft TVD</th>
              <th className="text-left pr-3">temperature, degF</th>
              <th className="text-left pr-3">type</th>
              <th className="text-left pr-3">port, in</th>
              <th className="text-left pr-3">R</th>
              <th className="text-left pr-3">injection at depth, psia</th>
              <th className="text-left pr-3">dome at temperature, psia</th>
              <th className="text-left pr-3">dome at {fmt(GAS_LIFT_THRESHOLDS.testRackTempF, 0)} degF, psia</th>
              <th className="text-left pr-3">test rack opening, psia</th>
              <th className="text-left pr-3">spread, psi</th>
              <th className="text-left">passes the target</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.valve}>
                <td className="pr-3">{fmt(r.valve, 0)}</td>
                <td className="pr-3">{fmt(r.depthFt, 3)}</td>
                <td className="pr-3">{fmt(r.tempF, 3)}</td>
                <td className="pr-3">{r.valveType}</td>
                <td className="pr-3">{fmt(r.portIdIn, 5)}</td>
                <td className="pr-3">{fmt(r.r, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.pInjAtDepthPsia, 6)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.domeAtTempPsia, 6)}</td>
                <td className="pr-3 text-[#f472b6]">{fmt(r.dome60Psia, 6)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.testRackOpeningPsia, 6)}</td>
                <td className="pr-3">{fmt(r.spreadPsi, 6)}</td>
                <td>{r.enginePassesTarget === null ? '-' : yn(r.enginePassesTarget)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A DOME IS A THERMOMETER AS MUCH AS IT IS A SPRING. The shop charges the dome cold, at
        {' '}{fmt(GAS_LIFT_THRESHOLDS.testRackTempF, 0)} degF on a test rack, and the well reads it
        hot. Those are the two blue and pink columns and they are the same nitrogen: the charge does
        not change, the temperature it is read at does. Down this string the valve temperature runs
        from {fmt(rows[0].tempF, 2)} to {fmt(rows[rows.length - 1].tempF, 2)} degF, and the gap
        between the two readings widens with it. Report the test rack figure at valve temperature,
        or the valve temperature figure at {fmt(GAS_LIFT_THRESHOLDS.testRackTempF, 0)} degF, and the
        two swap places.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        AND THE THIRD COLUMN IS NOT THE SECOND ONE COOLED DOWN. The test rack opening also divides
        the cold dome by one minus the port to bellows ratio R, which is the grey line on the right
        axis. R is geometry: it is the port area over the bellows area and nothing else. So a valve
        whose port steps up in the catalogue gains opening pressure and spread at the same time,
        with no change to its charge.
      </div>
      <div className="mt-4 rounded-md border border-gray-700 bg-[#0F172A] p-3">
        <p className="text-xs text-gray-400 mb-2">
          THE NITROGEN, AND WHAT THE LINEAR RULE OF THUMB COSTS. The engine takes the dome from
          {' '}{fmt(GAS_LIFT_THRESHOLDS.testRackTempF, 0)} degF to valve temperature through a real
          equation of state and inverts it exactly. The familiar linear correction factor is a
          straight line through the same job.
        </p>
        <div className="overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">charge at {fmt(GAS_LIFT_THRESHOLDS.testRackTempF, 0)} degF, psia</th>
                <th className="text-left pr-3">read at, degF</th>
                <th className="text-left pr-3">the engine reads, psia</th>
                <th className="text-left pr-3">it inverts back to, psia</th>
                <th className="text-left pr-3">correction factor</th>
                <th className="text-left pr-3">the linear rule gives</th>
                <th className="text-left pr-3">error in the factor, %</th>
                <th className="text-left">the linear dome misses by, psi</th>
              </tr>
            </thead>
            <tbody>
              {data.nitrogen.map((n) => (
                <tr key={`${n.pd60Psia}-${n.tF}`}>
                  <td className="pr-3">{fmt(n.pd60Psia, 2)}</td>
                  <td className="pr-3">{fmt(n.tF, 1)}</td>
                  <td className="pr-3 text-[#BFFF00]">{fmt(n.engineDomeAtTempPsia, 6)}</td>
                  <td className="pr-3">{fmt(n.engineBackTo60Psia, 6)}</td>
                  <td className="pr-3">{fmt(n.engineCt, 8)}</td>
                  <td className="pr-3">{fmt(n.linearCt, 8)}</td>
                  <td className="pr-3">{fmt(n.linearCtErrorPct, 6)}</td>
                  <td className="text-[#f97316]">{fmt(n.linearDomeMissPsi, 6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 rounded-md border border-gray-700 bg-[#0F172A] p-3">
        <p className="text-xs text-gray-400 mb-2">
          THE PORT CATALOGUE AS GEOMETRY. R and one over one minus R for every catalogue port
          against both bellows families. Nothing here is a design decision, it is the arithmetic a
          port choice commits a valve to.
        </p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.geometry} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
              {GRID}
              <XAxis dataKey="portIdIn" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
                label={{ value: 'port inside diameter, in', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={AXIS}
                label={{ value: 'one over one minus R', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="oneOverOneMinusR" name="port geometry across both bellows families"
                stroke="#BFFF00" isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Note>{data.verdict.note}</Note>
    </>
  );
};

const Spread = () => {
  const data = useMemo(() => {
    try { return valveExplorer.spread(); } catch { return null; }
  }, []);
  if (!data || !data.ipoRows || !data.ipoRows.length || !data.ppoRows || !data.ppoRows.length) {
    return <Note>A spread needs both sides of a valve. Where the string carries only an orifice, or where a design placed no injection pressure operated valve at all, there is no opening and closing pair to take a difference between and the engine returns none.</Note>;
  }
  const valves = [...new Set([
    ...data.ipoRows.flatMap((s) => s.spreads.map((v) => v.valve)),
    ...data.ppoRows.map((v) => v.valve),
  ])].sort((a, b) => a - b);
  const chart = valves.map((valve) => {
    const row = { valve };
    data.ipoRows.forEach((s) => {
      const hit = s.spreads.find((v) => v.valve === valve);
      row[s.id] = hit ? hit.spreadPsi : null;
    });
    const ppo = data.ppoRows.find((v) => v.valve === valve);
    row.ppo = ppo ? ppo.spreadPsi : null;
    return row;
  });
  const worstPpo = data.ppoRows.reduce((a, b) => (b.spreadPsi < a.spreadPsi ? b : a));
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Injection operated strings shown" value={fmt(data.ipoRows.length, 0)} />
          <Tile label="Production operated valves shown" value={fmt(data.ppoRows.length, 0)} />
          <Tile label="Every production operated spread negative" value={yn(data.verdict.everyPpoSpreadNegative)} />
          <Tile label="Most negative of them" value={fmt(worstPpo.spreadPsi, 6)} unit="psi" />
          <Tile label="At valve" value={fmt(worstPpo.valve, 0)} />
          <Tile label="Shallowest injection operated spread" value={fmt(data.ipoRows[0].spreads[0].spreadPsi, 6)} unit="psi" />
          <Tile label="Valve positions plotted" value={fmt(valves.length, 0)} />
          <Tile label="Deepest injection operated spread shown" value={fmt(data.ipoRows[0].spreads.filter((v) => Number.isFinite(v.spreadPsi)).slice(-1)[0].spreadPsi, 6)} unit="psi" />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="valve" tick={AXIS}
              label={{ value: 'valve, top to bottom', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'spread, psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#f472b6"
              label={{ value: 'a spread cannot be below this line', fill: '#f472b6', fontSize: 10, position: 'insideBottomRight' }} />
            {data.ipoRows.map((s, k) => (
              <Line key={s.id} type="monotone" dataKey={s.id} name={`${s.id}, injection operated`}
                stroke={SERIES[k % SERIES.length]} connectNulls isAnimationActive={false} />
            ))}
            <Line type="monotone" dataKey="ppo" name="the PRODUCTION operated case, its own series"
              stroke="#ef4444" strokeWidth={2} connectNulls isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">valve</th>
              {data.ipoRows.map((s) => (
                <th key={s.id} className="text-left pr-3">{s.id}, psi</th>
              ))}
              <th className="text-left">production operated, psi</th>
            </tr>
          </thead>
          <tbody>
            {chart.map((r) => (
              <tr key={r.valve}>
                <td className="pr-3">{fmt(r.valve, 0)}</td>
                {data.ipoRows.map((s) => (
                  <td key={s.id} className="pr-3">{Number.isFinite(r[s.id]) ? fmt(r[s.id], 6) : '-'}</td>
                ))}
                <td className={Number.isFinite(r.ppo) && r.ppo < 0 ? 'text-[#ef4444]' : ''}>
                  {Number.isFinite(r.ppo) ? fmt(r.ppo, 6) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE NEGATIVE SERIES IS A KNOWN DIVERGENCE AND NOT A VALVE PROPERTY. A spread is a pressure
        FALL across a valve between opening and closing, so it is a positive number by construction,
        and every injection operated string above says so. The production operated case comes back
        negative on every valve, down to {fmt(worstPpo.spreadPsi, 6)} psi at valve
        {' '}{fmt(worstPpo.valve, 0)}. That is not a discovery about production operated valves. It
        is the two sides entered the wrong way round: the closing test converts a dome that balances
        against the TUBING into a CASING surface pressure, and the same swapped line produces both
        symptoms. One root cause, two faces, and the louder of the two is this plot.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        It is PINNED rather than fixed, because the engine is consumed by a live application and the
        divergence is recorded where it can be seen. So the reading to take away is procedural: a
        design sheet that reports a negative spread has not found a strange valve, it has found a
        convention error upstream of the valve, and the number to distrust is the closing pressure
        rather than the spread.
      </div>
      <Note>{data.verdict.note}</Note>
    </>
  );
};

const Throughput = () => {
  const data = useMemo(() => {
    try { return valveExplorer.throughput(); } catch { return null; }
  }, []);
  if (!data || !data.regime || !data.regime.length || !data.portLadder || !data.portLadder.length) {
    return <Note>A throughput reading needs a port, an upstream pressure and a downstream pressure. With the two pressures equal there is no drop across the port, so there is no flow to report and the orifice equation has nothing to return.</Note>;
  }
  const critical = data.verdict.criticalRatio;
  const ladder = data.portLadder;
  const steps = ladder.filter((r, k) => k > 0 && r.stage5MarginPsi !== ladder[k - 1].stage5MarginPsi);
  const flat = ladder.filter((r, k) => k > 0 && r.stage5MarginPsi === ladder[k - 1].stage5MarginPsi);
  const choked = data.regime.filter((r) => r.regime === 'critical');
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Critical pressure ratio" value={fmt(critical, 8)} />
          <Tile label="Specific heat ratio it is built on" value={fmt(TC_K, 3)} />
          <Tile label="Discharge coefficient" value={fmt(GAS_LIFT_THRESHOLDS.dischargeCoefficient, 4)} />
          <Tile label="Ratios swept" value={fmt(data.regime.length, 0)} />
          <Tile label="Of those, choked" value={fmt(choked.length, 0)} />
          <Tile label="Design gas rates swept" value={fmt(ladder.length, 0)} />
          <Tile label="Rates where the verdict MOVED" value={fmt(steps.length, 0)} />
          <Tile label="Rates where nothing moved at all" value={fmt(flat.length, 0)} />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.regime} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="ratio" type="number" domain={[0, 1]} tick={AXIS}
              label={{ value: 'downstream over upstream pressure', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'gas through the port, Mscf/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={critical} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'critical ratio', fill: '#f472b6', fontSize: 10, position: 'top' }} />
            <Line type="monotone" dataKey="qMscfd" name="Thornhill and Craver across the regime"
              stroke="#BFFF00" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">downstream, psia</th>
              <th className="text-left pr-3">ratio</th>
              <th className="text-left pr-3">regime</th>
              <th className="text-left">gas rate, Mscf/d</th>
            </tr>
          </thead>
          <tbody>
            {data.regime.map((r) => (
              <tr key={r.pDnPsia} className={r.regime === 'critical' ? '' : 'text-[#f97316]'}>
                <td className="pr-3">{fmt(r.pDnPsia, 2)}</td>
                <td className="pr-3">{fmt(r.ratio, 4)}</td>
                <td className="pr-3">{r.regime}</td>
                <td>{fmt(r.qMscfd, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        BELOW THE CRITICAL RATIO NOTHING DOWNSTREAM MATTERS. Every choked row above carries the same
        {' '}{fmt(choked.length ? choked[0].qMscfd : NaN, 6)} Mscf/d, because a choked port cannot
        hear the pressure on the far side of it. Past {fmt(critical, 6)} the rate falls away with the
        ratio and reaches nothing as the two pressures meet. This is an ORIFICE equation and the
        engine says so: a real gas lift valve throttles on its STEM before the port is fully open, so
        this curve is an upper bound on what a valve passes, not a prediction of it.
      </div>
      <div className="mt-4 rounded-md border border-gray-700 bg-[#0F172A] p-3">
        <p className="text-xs text-gray-400 mb-2">
          THE PORT SELECTION, WHICH IS WHERE THE STEP BEHAVIOUR COMES FROM. Sweep the design gas
          rate and watch what the string does with it. The rate reaches the verdict only through
          selectPort, and selectPort takes the SMALLEST catalogue port that passes the target. So
          nothing happens until the target crosses a catalogue step, and then everything happens at
          once.
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={ladder} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
              {GRID}
              <XAxis dataKey="qgiTargetMscfd" type="number" domain={['dataMin', 'dataMax']} tick={AXIS}
                label={{ value: 'design gas rate, Mscf/d', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
              <YAxis yAxisId="m" tick={AXIS}
                label={{ value: 'closing margin, psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <YAxis yAxisId="p" orientation="right" tick={AXIS}
                label={{ value: 'port at valve 1, in', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="m" type="stepAfter" dataKey="stage5MarginPsi"
                name="the margin the verdict turns on" stroke="#BFFF00" isAnimationActive={false} />
              <Line yAxisId="p" type="stepAfter" dataKey={(r) => r.ports[0]}
                name="the port selectPort brings out" stroke="#38bdf8" strokeDasharray="4 3" isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">design gas rate, Mscf/d</th>
                <th className="text-left pr-3">published</th>
                <th className="text-left pr-3">ports the string carries, in</th>
                <th className="text-left pr-3">closing margin, psi</th>
                <th className="text-left">stages injecting at two depths</th>
              </tr>
            </thead>
            <tbody>
              {ladder.map((r, k) => {
                const moved = k > 0 && r.stage5MarginPsi !== ladder[k - 1].stage5MarginPsi;
                return (
                  <tr key={r.qgiTargetMscfd} className={moved ? 'text-white' : ''}>
                    <td className="pr-3">{fmt(r.qgiTargetMscfd, 0)}</td>
                    <td className="pr-3">{yn(r.isPublished)}</td>
                    <td className="pr-3">{r.ports.map((p) => fmt(p, 5)).join(', ')}</td>
                    <td className={`pr-3 ${moved ? 'text-[#BFFF00]' : ''}`}>{fmt(r.stage5MarginPsi, 8)}</td>
                    <td>{r.multipointingStages.length ? r.multipointingStages.join(', ') : 'none'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A SWEEP HAS TO MATCH THE MECHANISM, NOT THE AXIS. Across {fmt(ladder.length, 0)} design gas
        rates the margin moved on {fmt(steps.length, 0)} of them and did not move at all on
        {' '}{fmt(flat.length, 0)}. A coarse sweep steps straight over a flip. A fine one finds
        nothing between two steps and reads that as evidence of stability, which it is not: it is
        evidence that the sweep was run between two catalogue sizes. The design rate is not a knob
        with a slope behind it, it is a lookup, and the only sweep that says anything about it is one
        placed at the catalogue boundaries.
      </div>
      <Note>{data.verdict.note}</Note>
    </>
  );
};

const ValveExplorer = () => {
  const [mode, setMode] = useState('spacing');
  return (
    <PanelShell
      title="Valve explorer"
      subtitle="Where the mandrels go and what the shop dials into them: the spacing recursion iterate by iterate on both of its roads, dome and bellows and port read at two temperatures, the spread across the string with the production operated divergence as its own series, and what a port passes across the regime"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'spacing' && <Spacing />}
        {mode === 'valve' && <Valve />}
        {mode === 'spread' && <Spread />}
        {mode === 'throughput' && <Throughput />}
      </div>
    </PanelShell>
  );
};

export default ValveExplorer;
