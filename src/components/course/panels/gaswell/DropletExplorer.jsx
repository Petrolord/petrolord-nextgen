import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import { dropletExplorer } from './gasWellLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Droplet explorer, the Associate tier. One station, read completely.
//
// Five modes. The station end to end from density to verdict, the droplet
// balance and what moves it, the rate sweep that shows the ratio is the only
// number carrying a verdict, Turner against Coleman, and the threshold between
// them with the sentence that prints it.
//
// Every figure on this page is a return value from gasWellLab, which is a
// return value from the vendored gas well loading engine. Nothing here computes
// a density, a velocity, a rate or a ratio.

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
  ['station', 'One station, from density to verdict'],
  ['balance', 'The droplet balance, and what moves it'],
  ['sweep', 'One station, every rate, and the ratio that decides'],
  ['pair', 'Turner and Coleman, and the twenty percent'],
  ['threshold', 'The threshold between them, and the sentence that prints it'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const rowOptions = (rows) => rows.map((r) => [
  String(r.row),
  `published row ${r.row}: ${r.fluid} at ${fmt(r.pPsia, 0)} psia, ${fmt(r.tempR, 0)} degR`,
]);

// --------------------------------------------------------------------------

const Station = () => {
  const golden = useMemo(() => { try { return dropletExplorer.goldenRows(); } catch { return null; } }, []);
  const [pick, setPick] = useState('3');
  const [correlation, setCorrelation] = useState('turner');
  const built = useMemo(() => {
    try { return dropletExplorer.goldenRowStation(Number(pick), 1000, correlation); } catch { return null; }
  }, [pick, correlation]);
  if (!golden || !golden.length || !built) {
    return <Note>A station needs a pressure, a temperature, a compressibility factor and a gas gravity before a density can be formed, and without a density there is no droplet balance to solve. With any of the four missing the engine has nothing to read.</Note>;
  }
  const g = golden[built.row - 1];
  return (
    <>
      <FieldGrid>
        <SelectField label="Published station" value={pick} onChange={setPick} options={rowOptions(golden)} />
        <SelectField label="Correlation" value={correlation} onChange={setCorrelation}
          options={[['turner', 'Turner, the adjusted equation'], ['coleman', 'Coleman, unadjusted']]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Pressure" value={fmt(built.pPsia, 1)} unit="psia" />
          <Tile label="Temperature" value={fmt(built.tempR, 1)} unit="degR" />
          <Tile label="z, pinned as an input" value={fmt(built.z, 2)} />
          <Tile label="Gas gravity" value={fmt(built.gasSg, 2)} />
          <Tile label="Interfacial tension" value={fmt(built.sigmaDyneCm, 1)} unit="dyne/cm" />
          <Tile label="Liquid density" value={fmt(built.rhoLiquidLbFt3, 1)} unit="lbm/ft3" />
          <Tile label="Gas density" value={fmt(built.rhoGasLbFt3, 10)} unit="lbm/ft3" />
          <Tile label="Terminal droplet velocity" value={fmt(built.terminalFtS, 10)} unit="ft/s" />
          <Tile label="Critical velocity" value={fmt(built.criticalVelocityFtS, 10)} unit="ft/s" />
          <Tile label="Flow area" value={fmt(built.areaFt2, 10)} unit="ft2" />
          <Tile label="Critical rate" value={fmt(built.criticalRateMscfd, 9)} unit="Mscf/d" />
          <Tile label="Tubing" value={fmt(built.idIn, 3)} unit="in" />
        </TileGrid>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">quantity</th>
              <th className="text-left pr-3">the engine</th>
              <th className="text-left pr-3">the oracle</th>
              <th className="text-left">the two are</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-3">gas density, lbm/ft3</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(built.rhoGasLbFt3, 10)}</td>
              <td className="pr-3 text-[#38bdf8]">{fmt(g.rhoGasLbFt3, 10)}</td>
              <td>{tiny(built.rhoGasLbFt3 - g.rhoGasLbFt3)} apart</td>
            </tr>
            <tr>
              <td className="pr-3">terminal droplet velocity, ft/s</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(built.terminalFtS, 10)}</td>
              <td className="pr-3 text-[#38bdf8]">{fmt(built.goldenTerminalFtS, 10)}</td>
              <td>{tiny(built.terminalFtS - built.goldenTerminalFtS)} apart</td>
            </tr>
            <tr>
              <td className="pr-3">Turner critical rate through 2.441 in, Mscf/d</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(built.criticalRateMscfd, 9)}</td>
              <td className="pr-3 text-[#38bdf8]">{fmt(built.goldenTurnerRateMscfd, 9)}</td>
              <td>{tiny(built.criticalRateMscfd - built.goldenTurnerRateMscfd)} apart</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        TWO ROADS TO ONE NUMBER, AND A LESSON STAYS ON ONE. The engine works in dyne/cm, lbm/ft3 and
        ft/s and carries gc explicitly. The oracle that cut the goldens worked in N/m, kg/m3 and m/s
        with no gc anywhere, and built the rate constant from the molar volume rather than from
        86400 Tsc over psc. They agree to about ten significant figures and disagree after that.
        Neither column is wrong. Quote one of them, say which, and never pair a rate from one with a
        velocity from the other.
      </div>
      <Note>
        The compressibility factor here is an INPUT, pinned at {fmt(built.z, 2)} on every published
        row, so this table never exercises the compressibility route at all. Interfacial tension and
        liquid density are inputs too, and neither is a function of anything these modules know.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Balance = () => {
  const data = useMemo(() => {
    try {
      return {
        power: dropletExplorer.powerLaws(),
        drag: dropletExplorer.drag(),
        weber: dropletExplorer.weber(),
        tension: dropletExplorer.tension(),
        density: dropletExplorer.density(),
        fluids: dropletExplorer.fluids(),
        pair: dropletExplorer.fluidPair(),
        refusals: dropletExplorer.refusals(),
        constants: dropletExplorer.constants(),
      };
    } catch { return null; }
  }, []);
  const [which, setWhich] = useState('tension');
  if (!data) {
    return <Note>The droplet balance needs an interfacial tension, a liquid density and a gas density. It refuses a liquid lighter than the gas and it refuses a tension of zero, because neither describes a droplet that can be held together and then dropped.</Note>;
  }
  const sweep = which === 'tension'
    ? data.tension.map((r) => ({ x: r.sigmaDyneCm, terminalFtS: r.terminalFtS, turnerFtS: r.turnerFtS }))
    : data.density.map((r) => ({ x: r.rhoLiquidLbFt3, terminalFtS: r.terminalFtS, turnerFtS: r.turnerFtS }));
  const label = which === 'tension' ? 'interfacial tension, dyne/cm' : 'liquid density, lbm/ft3';
  return (
    <>
      <FieldGrid>
        <SelectField label="Sweep" value={which} onChange={setWhich}
          options={[['tension', 'Interfacial tension, at one published gas density'], ['density', 'Liquid density, at the same gas density']]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Drag coefficient, an input" value={fmt(data.constants.dragCoefficient, 2)} />
          <Tile label="Critical Weber number, an input" value={fmt(data.constants.criticalWeber, 1)} />
          <Tile label="Droplet constant the engine derives" value={fmt(data.constants.engineTurnerConstant, 10)} />
          <Tile label="Droplet constant the oracle published" value={fmt(data.constants.goldenTurnerConstant, 10)} />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sweep} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: label, position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'velocity, ft/s', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="terminalFtS" name="terminal droplet velocity, which is also the Coleman velocity"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="turnerFtS" name="the Turner velocity, the same curve times 1.2"
              stroke="#f97316" strokeDasharray="5 3" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">group driven</th>
              <th className="text-left pr-3">sigma, dyne/cm</th>
              <th className="text-left pr-3">density difference, lbm/ft3</th>
              <th className="text-left pr-3">gas density, lbm/ft3</th>
              <th className="text-left pr-3">terminal, ft/s</th>
              <th className="text-left">ratio to the row above</th>
            </tr>
          </thead>
          <tbody>
            {data.power.map((r, i) => (
              <tr key={`${r.group}-${i}`}>
                <td className="pr-3">{r.group}</td>
                <td className="pr-3">{fmt(r.sigmaDyneCm, 1)}</td>
                <td className="pr-3">{fmt(r.densityDiff, 1)}</td>
                <td className="pr-3">{fmt(r.rhoGasLbFt3, 1)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.velocityFtS, 10)}</td>
                <td>{r.ratioToRowAbove === null ? '-' : fmt(r.ratioToRowAbove, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">drag coefficient</th>
              <th className="text-left pr-3">constant</th>
              <th className="text-left pr-3">critical Weber number</th>
              <th className="text-left">constant</th>
            </tr>
          </thead>
          <tbody>
            {data.drag.map((r, i) => (
              <tr key={r.dragCoefficient} className={r.isShipped || data.weber[i].isShipped ? 'text-white' : ''}>
                <td className="pr-3">{fmt(r.dragCoefficient, 2)}{r.isShipped ? ' (shipped)' : ''}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.constant, 10)}</td>
                <td className="pr-3">{fmt(data.weber[i].criticalWeber, 1)}{data.weber[i].isShipped ? ' (shipped)' : ''}</td>
                <td className="text-[#38bdf8]">{fmt(data.weber[i].constant, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        BRINE AGAINST CONDENSATE, AT ONE STATION AND NOT AS A CONSTANT. At{' '}
        {fmt(data.pair.pPsia, 1)} psia and {fmt(data.pair.tempR, 1)} degR the water terminal velocity
        is {fmt(data.pair.waterTerminalFtS, 10)} ft/s and the condensate is{' '}
        {fmt(data.pair.condensateTerminalFtS, 10)} ft/s, a ratio of {fmt(data.pair.terminalRatio, 10)}.
        Condensate loads a well at a LOWER rate than water, because it has about a third the tension
        and a lower density, so its droplets are easier to carry. That ratio belongs to this station
        and does not hold at another one: the gas density enters the balance twice, once under the
        square root on its own and once inside the density difference, so nothing here is a fluid
        constant.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        {data.fluids.map((f) => `${f.label}: ${fmt(f.sigmaDyneCm, 1)} dyne/cm and ${fmt(f.densityLbFt3, 1)} lbm/ft3`).join('. ')}. These are labelled starting points and not correlations.
      </div>
      <Note>
        WHAT IT REFUSES:{' '}
        {data.refusals.map((r) => `${r.label} returns ok = ${yn(r.ok)}`).join(', ')}. An unknown fluid
        id does NOT refuse: it falls back to water silently, which is two failure policies in one
        module.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Sweep = () => {
  const data = useMemo(() => {
    try { return { base: dropletExplorer.station(), rows: dropletExplorer.stationSweep(), areas: dropletExplorer.areas(), inverse: dropletExplorer.inverse() }; } catch { return null; }
  }, []);
  if (!data || !data.rows.length) {
    return <Note>A ratio needs a rate as well as a station. The engine has no inflow performance anywhere in it, so the gas rate is something a caller supplies and a loading verdict is a verdict at that rate, not a prediction of what the well will do next.</Note>;
  }
  const { base, rows } = data;
  return (
    <>
      <TileGrid>
        <Tile label="Station" value={`${fmt(base.pPsia, 1)} psia, ${fmt(base.tempR, 1)} degR`} />
        <Tile label="Gas density" value={fmt(base.rhoGasLbFt3, 10)} unit="lbm/ft3" />
        <Tile label="Terminal droplet velocity" value={fmt(base.terminalFtS, 10)} unit="ft/s" />
        <Tile label="Turner critical velocity" value={fmt(base.turnerCriticalVelocityFtS, 10)} unit="ft/s" />
        <Tile label="Flow area" value={fmt(base.areaFt2, 10)} unit="ft2" />
        <Tile label="Turner critical rate" value={fmt(base.turnerCriticalRateMscfd, 9)} unit="Mscf/d" />
        <Tile label="Coleman critical rate" value={fmt(base.colemanCriticalRateMscfd, 9)} unit="Mscf/d" />
        <Tile label="Tubing" value={fmt(base.idIn, 3)} unit="in" />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="qMscfd" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'gas rate, Mscf/d', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'ratio, actual over critical', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 10)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'the verdict sits here', fill: '#f472b6', fontSize: 10, position: 'insideTopLeft' }} />
            <Line type="monotone" dataKey="ratio" name="the ratio, the only one of the three carrying a verdict"
              stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">gas rate, Mscf/d</th>
              <th className="text-left pr-3">actual velocity, ft/s</th>
              <th className="text-left pr-3">critical rate, Mscf/d</th>
              <th className="text-left pr-3">ratio</th>
              <th className="text-left">loaded</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.qMscfd} className={r.loaded ? 'text-[#f97316]' : ''}>
                <td className="pr-3">{fmt(r.qMscfd, 1)}</td>
                <td className="pr-3">{fmt(r.actualVelocityFtS, 10)}</td>
                <td className="pr-3 text-slate-500">{fmt(r.criticalRateMscfd, 9)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.ratio, 10)}</td>
                <td>{yn(r.loaded)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE CRITICAL RATE DOES NOT MOVE DOWN THAT COLUMN. It belongs to the STATION and not to the
        well: change what the well makes and the critical rate is unchanged, while the actual
        velocity and the ratio move with it. The ratio is the rate ratio and the velocity ratio at
        once, because both sides of it are evaluated at the same station on the same area, and the
        flag is a STRICT comparison, so a ratio a ten thousandth under one still reads loaded.
      </div>
      <Note>
        Rate and velocity are exact inverses: {fmt(data.inverse.velocityFtS, 1)} ft/s through{' '}
        {fmt(data.inverse.idIn, 3)} in at {fmt(data.inverse.pPsia, 1)} psia and{' '}
        {fmt(data.inverse.tempR, 1)} degR is {fmt(data.inverse.qMscfd, 9)} Mscf/d, and that rate
        comes back to {fmt(data.inverse.backToVelocityFtS, 10)} ft/s. The area is where the tubing
        size enters and it is the only place it enters, which is why a velocity string works at all.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Pair = () => {
  const data = useMemo(() => {
    try { return { rows: dropletExplorer.pairs(), identity: dropletExplorer.adjustment(), air: dropletExplorer.air() }; } catch { return null; }
  }, []);
  if (!data || !data.rows.length) return <Note>Turner and Coleman are one equation and one factor, so with no published row to read there is nothing to compare and no factor to show.</Note>;
  const chart = data.rows.map((r) => ({
    row: r.row, colemanRateMscfd: r.colemanRateMscfd, turnerRateMscfd: r.turnerRateMscfd,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Turner adjustment" value={fmt(data.identity.turnerAdjustment, 4)} />
        <Tile label="Coleman adjustment" value={fmt(data.identity.colemanAdjustment, 4)} />
        <Tile label="Between them" value={fmt(data.identity.adjustmentGapPct, 6)} unit="%" />
        <Tile label="Shared droplet constant" value={fmt(data.identity.sharedConstant, 10)} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="row" type="number" tick={AXIS} domain={[1, 12]}
              label={{ value: 'published golden row', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'critical rate, Mscf/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="colemanRateMscfd" name="Coleman, the unadjusted equation"
              stroke="#38bdf8" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="turnerRateMscfd" name="Turner, the same equation times 1.2"
              stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">row</th>
              <th className="text-left pr-3">Coleman, ft/s</th>
              <th className="text-left pr-3">Turner, ft/s</th>
              <th className="text-left pr-3">Coleman rate, Mscf/d</th>
              <th className="text-left pr-3">Turner rate, Mscf/d</th>
              <th className="text-left pr-3">difference, Mscf/d</th>
              <th className="text-left">as a percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.row}>
                <td className="pr-3">{r.row}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.colemanFtS, 10)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.turnerFtS, 10)}</td>
                <td className="pr-3">{fmt(r.colemanRateMscfd, 9)}</td>
                <td className="pr-3">{fmt(r.turnerRateMscfd, 9)}</td>
                <td className="pr-3">{fmt(r.turnerMinusColemanMscfd, 9)}</td>
                <td>{fmt(r.turnerOverColemanPct, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE TERMINAL VELOCITY IS IDENTICAL UNDER BOTH, so a lesson that says the two correlations use
        different physics is wrong. At {fmt(data.identity.pPsia, 1)} psia and{' '}
        {fmt(data.identity.tempR, 1)} degR both give a terminal velocity of{' '}
        {fmt(data.identity.turnerTerminalFtS, 10)} ft/s, and the two critical velocities that follow
        are {fmt(data.identity.colemanCriticalFtS, 10)} and {fmt(data.identity.turnerCriticalFtS, 10)}{' '}
        ft/s. Turner et al. found their field data sat about twenty percent above the theoretical
        velocity and applied the adjustment. Coleman et al., on low-pressure wells, found the
        unadjusted equation fitted better. That is the whole difference, and it carries straight
        through to rate because the rate is linear in the velocity at a fixed station on a fixed area.
      </div>
      <Note>
        And the two production modules do not agree about the density that feeds either of them. At{' '}
        {fmt(data.air.pPsia, 1)} psia and {fmt(data.air.tempR, 1)} degR one route gives{' '}
        {fmt(data.air.rhoLoading, 10)} lbm/ft3 and the other {fmt(data.air.rhoProperties, 10)},
        because they carry two molecular weights of air, {fmt(data.air.airMwLoading, 4)} against{' '}
        {fmt(data.air.airMwProperties, 4)}, on one shared gas constant.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Threshold = () => {
  const data = useMemo(() => {
    try { return { rows: dropletExplorer.threshold(), labels: dropletExplorer.thresholdLabels() }; } catch { return null; }
  }, []);
  if (!data || !data.rows.length) return <Note>The recommendation takes one pressure and returns guidance rather than a decision. With no pressure to read it says so, and it does not choose a correlation for anybody.</Note>;
  return (
    <>
      <div className="overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">pressure, psia</th>
              <th className="text-left pr-3">returns</th>
              <th className="text-left pr-3">below the limit</th>
              <th className="text-left pr-3">rounded whole it printed as</th>
              <th className="text-left pr-3">to one decimal it prints as</th>
              <th className="text-left">distance to the limit, psi</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.pPsia} className={r.printsAsTheLimit && r.belowLimit ? 'text-[#f97316]' : ''}>
                <td className="pr-3">{r.pPsia.toFixed(2)}</td>
                <td className="pr-3 text-[#BFFF00]">{r.correlation}</td>
                <td className="pr-3">{yn(r.belowLimit)}</td>
                <td className="pr-3">{r.roundedWhole}</td>
                <td className="pr-3">{r.printedOneDecimal}</td>
                <td>{fmt(r.distanceToLimitPsi, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE BRANCH WAS NEVER AMBIGUOUS. The sentence attached to it was. The reason used to round the
        pressure it branched on to a whole number, so a well below the limit printed AS the limit
        under a branch that by construction only takes wells below it, and a reader checking the
        sentence against the constant concluded the engine had the comparison backwards. It also
        hardcoded the word wellhead for whatever station it was handed. Both are display-only and both
        are fixed: one decimal, and a station label the caller sets.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        ONE DECIMAL NARROWS THE COLLISION BY TEN RATHER THAN REMOVING IT. Anything inside 0.05 psi of
        the limit still renders as the limit, and the row highlighted above is the one that still
        does. A narrower print is a smaller target, not an absent one.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        With no label: {data.labels.withoutLabel}
      </div>
      <div className="mt-2 text-xs text-slate-300">
        With a label: {data.labels.withLabel}
      </div>
      <Note>
        The function takes ONE pressure and cannot see which station it came from, so the word in the
        sentence has to be the caller's to set. That matters more than it looks: whatever station this
        pressure came from, the answer is used at every station in the study that follows.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const DropletExplorer = () => {
  const [mode, setMode] = useState('station');
  return (
    <PanelShell
      title="Droplet explorer"
      subtitle="One station in a gas well, read completely: the density it starts from, the drag against weight balance that sets a terminal velocity, the critical velocity and the rate that follows, the actual velocity, and the ratio that decides"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'station' && <Station />}
        {mode === 'balance' && <Balance />}
        {mode === 'sweep' && <Sweep />}
        {mode === 'pair' && <Pair />}
        {mode === 'threshold' && <Threshold />}
      </div>
    </PanelShell>
  );
};

export default DropletExplorer;
