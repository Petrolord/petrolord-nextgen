import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import { lineExplorer } from './flowAssuranceLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Line explorer, the Professional tier. A whole line in operation.
//
// Six modes. The energy balance and the relaxation length it collapses to, the
// station profile at published length, the inverse that turns a target arrival
// into a required U, the cooldown and its time constant, the two masses a
// cooldown can be run on and what the gap between them is worth, and the
// margin against a boundary the engine never draws.
//
// Every figure on this page is a return value from flowAssuranceLab, which is
// a return value from the vendored flowline thermal engine. Nothing here
// computes a relaxation length, an arrival, an ntu or a cooldown.

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
  ['balance', 'The energy balance, the relaxation length and the ntu'],
  ['profile', 'The profile station by station'],
  ['target', 'Designing to a target arrival'],
  ['cooldown', 'Cooldown, the time constant and the no touch time'],
  ['mass', 'The mass the cooldown uses, and the one it leaves out'],
  ['margin', 'The margin, on a line with a boundary'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

// --------------------------------------------------------------------------

const Balance = () => {
  const data = useMemo(() => {
    try {
      return {
        relaxation: lineExplorer.relaxationRows(),
        scalings: lineExplorer.relaxationScalings(),
        byBuild: lineExplorer.relaxationByBuild(),
        refusals: lineExplorer.relaxationRefusals(),
        profiles: lineExplorer.profileRows(),
        ntu: lineExplorer.ntuSweep(),
        fluid: lineExplorer.fluid,
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>The balance needs a length, a mass rate, a heat capacity and a heat transfer coefficient. The relaxation length refuses without them and it refuses as a bare not-a-number rather than as an object, so a caller that does not check gets a not-a-number everywhere downstream.</Note>;
  }
  const chart = data.ntu.map((r) => ({
    ntu: r.ntu, retained: r.retainedExcessFraction * 100, arrival: r.arrivalTempF,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Inlet" value={fmt(data.fluid.inletTempF, 1)} unit="degF" />
        <Tile label="Ambient" value={fmt(data.fluid.ambientTempF, 1)} unit="degF" />
        <Tile label="Mass rate" value={fmt(data.fluid.massRateLbHr, 0)} unit="lb/hr" />
        <Tile label="Heat capacity" value={fmt(data.fluid.cpBtuLbF, 2)} unit="Btu/(lb degF)" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">case</th>
              <th className="text-left pr-3">mass rate, lb/hr</th>
              <th className="text-left pr-3">Cp</th>
              <th className="text-left pr-3">the oracle, ft</th>
              <th className="text-left pr-3">the engine, ft</th>
              <th className="text-left">the two are</th>
            </tr>
          </thead>
          <tbody>
            {data.relaxation.map((r) => (
              <tr key={r.caseNumber}>
                <td className="pr-3">{r.caseNumber}</td>
                <td className="pr-3">{fmt(r.massRateLbHr, 0)}</td>
                <td className="pr-3">{fmt(r.cpBtuLbF, 2)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.goldenRelaxationLengthFt, 8)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.engineRelaxationLengthFt, 8)}</td>
                <td>{tiny(r.relaxationRelDiff)} apart, relative</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        TWO ROADS TO ONE LENGTH, AND A LESSON STAYS ON ONE. The oracle worked entirely in SI, watts
        and metres and kelvin and seconds, and converted only at the boundary. The engine works in
        field units and never leaves them. They agree to the conversion factors and the residual is
        the round trip, not a disagreement about physics. Quote one column, say which, and never
        pair a length from one with an arrival from the other.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        The relaxation length is exactly linear in the mass rate, a ratio of
        {' '}{fmt(data.scalings.lengthRatioAcrossMassRate, 10)} against a mass rate ratio of
        {' '}{fmt(data.scalings.massRateRatio, 10)}, and exactly linear in the heat capacity, a
        ratio of {fmt(data.scalings.lengthRatioAcrossCp, 10)} against
        {' '}{fmt(data.scalings.cpRatio, 10)}. It is also exactly inverse in the U and in the bore.
        On the three published builds the same fluid gives
        {' '}{data.byBuild.map((b) => `${b.build} ${fmt(b.engineRelaxationLengthFt, 4)} ft`).join(', ')}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">length, ft</th>
              <th className="text-left pr-3">ntu, the oracle</th>
              <th className="text-left pr-3">ntu, the engine</th>
              <th className="text-left pr-3">arrival, the oracle, degF</th>
              <th className="text-left pr-3">arrival, the engine, degF</th>
              <th className="text-left">excess lost, percent</th>
            </tr>
          </thead>
          <tbody>
            {data.profiles.map((r) => (
              <tr key={r.lengthFt}>
                <td className="pr-3">{fmt(r.lengthFt, 0)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.goldenNtu, 10)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.engineNtu, 10)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.goldenArrivalTempF, 8)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.engineArrivalTempF, 8)}</td>
                <td>{fmt(r.lostExcessPct, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="ntu" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'ntu, the length measured in relaxation lengths', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={[0, 100]}
              label={{ value: 'excess over ambient retained, percent', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="retained" name="excess over ambient still carried"
              stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        NTU IS THE WHOLE STORY. It is the length measured in relaxation lengths, and once the inlet
        and the ambient are fixed the arrival depends on nothing else. A line much shorter than its
        relaxation length arrives hot whatever the ambient. A line much longer than it arrives at
        ambient whatever it started at. Every row of that sweep is a SWEEP POINT on published
        inputs and none of them is a published case.
      </div>
      <Note>
        No pressures are set in any published case, so the Joule-Thomson term is exactly zero in
        every row here. What the relaxation length refuses:
        {' '}{data.refusals.map((r) => `${r.label} (not a number: ${yn(r.isNaN)})`).join('; ')}.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Profile = () => {
  const [lengthFt, setLengthFt] = useState('105600');
  const data = useMemo(() => {
    try {
      return {
        stations: lineExplorer.stations(Number(lengthFt)),
        ratio: lineExplorer.dropRatio(Number(lengthFt)),
        counts: lineExplorer.stationCountRows(lineExplorer.stationCounts, Number(lengthFt)),
        refusals: lineExplorer.profileRefusals(),
        profiles: lineExplorer.profileRows(),
      };
    } catch { return null; }
  }, [lengthFt]);
  if (!data) {
    return <Note>A profile with nothing to go on is refused rather than returned empty, and the message names all four things it needed.</Note>;
  }
  const chart = data.stations.map((s) => ({ x: s.xFt, t: s.tempF }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Published length" value={lengthFt} onChange={setLengthFt}
          options={data.profiles.map((p) => [String(p.lengthFt), `${fmt(p.lengthFt, 0)} ft, ntu ${fmt(p.engineNtu, 4)}`])} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Stations returned" value={fmt(data.stations.length, 0)} />
          <Tile label="Station spacing" value={fmt(data.ratio.stationSpacingFt, 2)} unit="ft" />
          <Tile label="ntu" value={fmt(data.ratio.ntu, 10)} />
          <Tile label="Arrival" value={fmt(data.stations[data.stations.length - 1].tempF, 8)} unit="degF" />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'distance along the line, ft', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'temperature, degF', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 8)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={lineExplorer.fluid.ambientTempF} stroke="#38bdf8" strokeDasharray="4 3" />
            <Line type="monotone" dataKey="t" name="fluid temperature down the line"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">station</th>
              <th className="text-left pr-3">x, ft</th>
              <th className="text-left pr-3">temperature, degF</th>
              <th className="text-left pr-3">pressure, psia</th>
              <th className="text-left pr-3">excess over ambient, degF</th>
              <th className="text-left pr-3">fraction of the inlet excess</th>
              <th className="text-left">drop from the station above, degF</th>
            </tr>
          </thead>
          <tbody>
            {data.stations.map((s) => (
              <tr key={s.station}>
                <td className="pr-3">{s.station}</td>
                <td className="pr-3">{fmt(s.xFt, 2)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(s.tempF, 8)}</td>
                <td className="pr-3 text-[#f97316]">{s.pressureIsNaN ? 'not a number' : fmt(s.pPsia, 2)}</td>
                <td className="pr-3">{fmt(s.excessOverAmbientF, 8)}</td>
                <td className="pr-3">{fmt(s.retainedExcessFraction, 10)}</td>
                <td>{s.dropFromStationAboveF === null ? '-' : fmt(s.dropFromStationAboveF, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE PRESSURE COLUMN IS NOT A NUMBER IN EVERY ROW, and it is printed rather than hidden. No
        published case sets a pressure at either end, so the profile has no pressure drop to carry
        and no Joule-Thomson term to apply.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        WHERE THE LINE IS COLDEST is the far end and only the far end, because this profile is a
        monotone exponential with nothing else in it. The first station interval drops
        {' '}{fmt(data.ratio.firstIntervalDropF, 8)} degF and the last drops
        {' '}{fmt(data.ratio.lastIntervalDropF, 8)}, a ratio of {fmt(data.ratio.dropRatio, 8)}. That
        ratio is NOT the whole line excess ratio, which is
        {' '}{fmt(data.ratio.wholeLineExcessRatio, 8)}: the two intervals are equal in length, so
        each drop carries the same factor and the ratio is the ratio of the two starting excesses,
        {' '}{fmt(data.ratio.excessRatioAcrossTheInnerSpan, 8)}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">stations asked for</th>
              <th className="text-left pr-3">stations returned</th>
              <th className="text-left pr-3">arrival, degF</th>
              <th className="text-left">difference from the default reading</th>
            </tr>
          </thead>
          <tbody>
            {data.counts.map((r) => (
              <tr key={r.nStations}>
                <td className="pr-3">{r.nStations}</td>
                <td className="pr-3">{r.stationsReturned}</td>
                <td className="pr-3">{fmt(r.arrivalTempF, 12)}</td>
                <td>{tiny(r.differenceFrom21StationArrivalF)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-slate-300">
        THE STATION COUNT IS A RESOLUTION SETTING AND NOTHING MORE. The arrival is a closed form and
        does not move. The ugly two station row is kept rather than dropped, because it is the one
        that proves the point: refining a profile buys resolution in the middle of the line and
        buys nothing at the end of it.
      </div>
      <Note>
        {data.refusals.map((r) => `${r.label}: ok ${yn(r.ok)}`).join('; ')}. The last of those is
        not a refusal and should not be. A line colder than its surroundings warms towards them on
        the same exponential, and the engine handles it with no special case at all.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Target = () => {
  const [which, setWhich] = useState('published');
  const data = useMemo(() => {
    try {
      return {
        published: lineExplorer.targetRows(),
        refusals: lineExplorer.inverseRefusals(),
        akaso: lineExplorer.akaso(),
        akasoTargets: lineExplorer.akasoTargets(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>The inverse returns null for a target it cannot reach, and it separates the two ways of being unreachable because they send an engineer looking in different places.</Note>;
  }
  const rows = which === 'published' ? data.published : data.akasoTargets;
  const chart = rows.map((r) => ({
    t: r.targetTempF,
    u: which === 'published' ? r.uBtuHrFt2F : r.uNeededBtuHrFt2F,
  }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Line" value={which} onChange={setWhich}
          options={[
            ['published', 'The published fluid at five miles'],
            ['akaso', `${data.akaso.name}, a TEACHING line with its own boundary`],
          ]} />
      </FieldGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="t" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'target arrival temperature, degF', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'U needed, Btu/(hr ft2 degF)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 8)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="u" name="the overall U this target needs"
              stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {which === 'published' ? (
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">target arrival, degF</th>
                <th className="text-left pr-3">U needed, Btu/(hr ft2 degF)</th>
                <th className="text-left pr-3">ntu implied</th>
                <th className="text-left pr-3">forward profile on that U arrives at</th>
                <th className="text-left">round trip error, degF</th>
              </tr>
            </thead>
            <tbody>
              {data.published.map((r) => (
                <tr key={r.targetTempF}>
                  <td className="pr-3">{fmt(r.targetTempF, 2)}</td>
                  <td className="pr-3 text-[#BFFF00]">{fmt(r.uBtuHrFt2F, 10)}</td>
                  <td className="pr-3">{fmt(r.ntuImplied, 10)}</td>
                  <td className="pr-3">{fmt(r.forwardArrivalTempF, 10)}</td>
                  <td>{tiny(r.roundTripErrorF)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">target arrival, degF</th>
                <th className="text-left pr-3">U needed, Btu/(hr ft2 degF)</th>
                <th className="text-left pr-3">ntu implied</th>
                <th className="text-left pr-3">ratio to the U this line has</th>
                <th className="text-left">is the hydrate boundary</th>
              </tr>
            </thead>
            <tbody>
              {data.akasoTargets.map((r) => (
                <tr key={r.targetTempF} className={r.isTheHydrateBoundary ? 'text-[#f97316]' : ''}>
                  <td className="pr-3">{fmt(r.targetTempF, 2)}</td>
                  <td className="pr-3 text-[#BFFF00]">{fmt(r.uNeededBtuHrFt2F, 10)}</td>
                  <td className="pr-3">{fmt(r.ntuImplied, 10)}</td>
                  <td className="pr-3">{fmt(r.ratioToTheUThisLineHas, 8)}</td>
                  <td>{yn(r.isTheHydrateBoundary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">target, degF</th>
              <th className="text-left pr-3">ok</th>
              <th className="text-left pr-3">which kind of impossible</th>
              <th className="text-left">the reason it gives</th>
            </tr>
          </thead>
          <tbody>
            {data.refusals.map((r) => (
              <tr key={r.targetTempF}>
                <td className="pr-3">{fmt(r.targetTempF, 2)}</td>
                <td className="pr-3 text-[#f97316]">{yn(r.ok)}</td>
                <td className="pr-3">{r.kind}</td>
                <td>{r.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE TWO REFUSALS ARE DIFFERENT REFUSALS AND THE MESSAGES SAY SO. A target at or below
        ambient is a physical impossibility and no insulation reaches it. A target at or above the
        inlet is not a cooling problem at all. Collapsing them into one message would send an
        engineer looking in the wrong place.
      </div>
      <Note>
        {which === 'akaso'
          ? `The ${data.akaso.hydrateFlowingF} degF boundary on this TEACHING line is a LABORATORY INPUT and not an engine output. The U it would need is above the U this line actually has, which is the same statement as the arrival being above the boundary.`
          : 'The round trip closes to machine precision because the forward profile and the inverse are the same exponential read in two directions, so a round trip error here is a regression and not a tolerance.'}
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Cooldown = () => {
  const data = useMemo(() => {
    try {
      return {
        cooldown: lineExplorer.cooldown(),
        stations: lineExplorer.cooldownStations(),
        stagnant: lineExplorer.stagnantBore(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A cooldown needs a heat capacity for what is cooling and a heat transfer coefficient, and it refuses when either is missing.</Note>;
  }
  const chart = data.stations.map((s) => ({ t: s.hours, temp: s.tempF }));
  return (
    <>
      <TileGrid>
        <Tile label="Start" value={fmt(data.cooldown.startTempF, 1)} unit="degF" />
        <Tile label="Ambient" value={fmt(data.cooldown.ambientTempF, 1)} unit="degF" />
        <Tile label="Target" value={fmt(data.cooldown.targetTempF, 1)} unit="degF" />
        <Tile label="U it was given" value={fmt(data.cooldown.goldenUBtuHrFt2F, 10)} unit="Btu/(hr ft2 degF)" />
        <Tile label="Heat capacity per foot" value={fmt(data.cooldown.mcpBtuFtF, 10)} unit="Btu/(ft degF)" />
        <Tile label="U times area per foot" value={fmt(data.cooldown.uaPerFtBtuHrFtF, 10)} unit="Btu/(hr ft degF)" />
        <Tile label="Time constant, the engine" value={fmt(data.cooldown.engineTimeConstantHr, 10)} unit="hr" />
        <Tile label="No touch time, the engine" value={fmt(data.cooldown.engineHours, 10)} unit="hr" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">quantity</th>
              <th className="text-left pr-3">the oracle</th>
              <th className="text-left pr-3">the engine</th>
              <th className="text-left">the two are</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-3">no touch time, hr</td>
              <td className="pr-3 text-[#38bdf8]">{fmt(data.cooldown.goldenHours, 10)}</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(data.cooldown.engineHours, 10)}</td>
              <td>{tiny(data.cooldown.hoursRelDiff)} apart, relative</td>
            </tr>
            <tr>
              <td className="pr-3">time constant, hr</td>
              <td className="pr-3 text-[#38bdf8]">{fmt(data.cooldown.goldenTimeConstantHr, 10)}</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(data.cooldown.engineTimeConstantHr, 10)}</td>
              <td>{tiny(data.cooldown.timeConstantRelDiff)} apart, relative</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="t" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'hours after the line stops', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'temperature, degF', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 8)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={data.cooldown.targetTempF} stroke="#f97316" strokeDasharray="4 3" />
            <ReferenceLine y={data.cooldown.ambientTempF} stroke="#38bdf8" strokeDasharray="4 3" />
            <Line type="monotone" dataKey="temp" name="the line cooling towards ambient"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">station</th>
              <th className="text-left pr-3">hours</th>
              <th className="text-left pr-3">temperature, degF</th>
              <th className="text-left pr-3">excess over ambient, degF</th>
              <th className="text-left">past the target</th>
            </tr>
          </thead>
          <tbody>
            {data.stations.filter((s) => s.station % 2 === 0).map((s) => (
              <tr key={s.station}>
                <td className="pr-3">{s.station}</td>
                <td className="pr-3">{fmt(s.hours, 8)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(s.tempF, 8)}</td>
                <td className="pr-3">{fmt(s.excessOverAmbientF, 8)}</td>
                <td>{yn(s.pastTheTarget)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE NO TOUCH TIME IS THE TIME CONSTANT TIMES A LOG TERM, and the log term here is
        {' '}{fmt(data.cooldown.logTerm, 10)}, so the answer is that many time constants and no
        more. Everything an engineer can change moves one of the two: better insulation lengthens
        the time constant in proportion, and a colder target lengthens the log term.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        THE U THIS COOLDOWN USES IS THE FLOWING U. A shut in line has a stagnant bore and its inside
        film falls from the flowing catalogue value of
        {' '}{fmt(data.stagnant.insideFilmFlowing, 1)} to something near the stagnant
        {' '}{fmt(data.stagnant.insideFilmStagnant, 1)}. Rebuild the stack that way and U falls from
        {' '}{fmt(data.stagnant.flowingUBtuHrFt2F, 8)} to
        {' '}{fmt(data.stagnant.stagnantUBtuHrFt2F, 8)}, and the same cooldown then runs
        {' '}{fmt(data.stagnant.hoursRatio, 8)} times longer. The engine will take whichever U it is
        given and nothing in the cooldown asks whether the U it got was measured on a flowing line.
      </div>
      <Note>
        The cooldown is LUMPED CAPACITANCE: one temperature for the whole cross section, no radial
        gradient, no axial conduction, and no phase change in anything that is cooling.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Mass = () => {
  const [reading, setReading] = useState('api');
  const data = useMemo(() => {
    try {
      return {
        akaso: lineExplorer.akaso(),
        masses: lineExplorer.akasoMasses(),
        pair: lineExplorer.akasoCooldown(),
        stations: lineExplorer.akasoCooldownStations(reading),
        backwards: lineExplorer.akasoBackwards(),
        branches: lineExplorer.akasoBranches(),
        reversal: lineExplorer.massAgainstHeatCapacity(),
        nanDrop: lineExplorer.nanMassDrop(),
      };
    } catch { return null; }
  }, [reading]);
  if (!data) {
    return <Note>A cooldown has exactly two mass slots, contents and shell, so a line with a coating on it cannot be described to it without folding one layer into another by hand.</Note>;
  }
  const chart = data.stations.map((s) => ({ t: s.hours, temp: s.tempF }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Which mass" value={reading} onChange={setReading}
          options={[
            ['api', 'The API reading: contents and the steel shell'],
            ['lumped', 'The lumped reading: the coatings folded in by hand'],
          ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Contents mass" value={fmt(data.masses.contentsMassLbPerFt, 8)} unit="lbm/ft" />
          <Tile label="Steel mass" value={fmt(data.masses.steelMassLbPerFt, 8)} unit="lbm/ft" />
          <Tile label="Foam mass" value={fmt(data.masses.foamMassLbPerFt, 8)} unit="lbm/ft" />
          <Tile label="Weight coat mass" value={fmt(data.masses.coatMassLbPerFt, 8)} unit="lbm/ft" />
          <Tile label="Mass the API reading carries" value={fmt(data.masses.apiMassLbPerFt, 8)} unit="lbm/ft" />
          <Tile label="Mass it leaves out" value={fmt(data.masses.massLeftOutLbPerFt, 8)} unit="lbm/ft" />
          <Tile label="Resistance share of what it leaves out" value={fmt(data.masses.resistanceShareLeftOutPct, 6)} unit="percent" />
          <Tile label="Heat capacity ratio of the two readings" value={fmt(data.masses.mcpRatio, 8)} />
        </TileGrid>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">reading</th>
              <th className="text-left pr-3">mass carried, lbm/ft</th>
              <th className="text-left pr-3">M Cp, Btu/(ft degF)</th>
              <th className="text-left pr-3">time constant, hr</th>
              <th className="text-left">no touch time, hr</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-3">the API reading</td>
              <td className="pr-3">{fmt(data.pair.apiMassLbPerFt, 8)}</td>
              <td className="pr-3">{fmt(data.pair.apiMcpBtuFtF, 8)}</td>
              <td className="pr-3">{fmt(data.pair.apiTimeConstantHr, 8)}</td>
              <td className="text-[#f97316]">{fmt(data.pair.apiNoTouchHours, 8)}</td>
            </tr>
            <tr>
              <td className="pr-3">the lumped reading</td>
              <td className="pr-3">{fmt(data.pair.lumpedMassLbPerFt, 8)}</td>
              <td className="pr-3">{fmt(data.pair.lumpedMcpBtuFtF, 8)}</td>
              <td className="pr-3">{fmt(data.pair.lumpedTimeConstantHr, 8)}</td>
              <td className="text-[#BFFF00]">{fmt(data.pair.lumpedNoTouchHours, 8)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="t" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'hours after the line stops', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'temperature, degF', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 8)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={data.pair.targetTempF} stroke="#f97316" strokeDasharray="4 3" />
            <Line type="monotone" dataKey="temp" name={`the ${reading} reading cooling`}
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE TEACHING LINE {data.akaso.name} IS NOT A PUBLISHED CASE AND NO ORACLE HAS CHECKED IT.
        Its insulation and its weight coat carry
        {' '}{fmt(data.pair.resistanceShareLeftOutPct, 6)} percent of the thermal resistance and, as
        the cooldown signature reads, none of the thermal mass. Folding them into the shell slot by
        hand at their own heat capacities takes the no touch time from
        {' '}{fmt(data.pair.apiNoTouchHours, 8)} hr to {fmt(data.pair.lumpedNoTouchHours, 8)} hr, a
        factor of {fmt(data.pair.hoursRatio, 8)} and {fmt(data.pair.hoursGivenAwayByTheApiReading, 8)}
        {' '}hr the API reading gives away.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        THE TWO RATIOS ARE THE SAME NUMBER, and that is why the finding can be stated as a ratio of
        heat capacities and needs no second temperature. The log term is identical in both at
        {' '}{fmt(data.pair.sharedLogTerm, 10)}, so only the heat capacity moved: the time constant
        ratio is {fmt(data.pair.timeConstantRatio, 8)} and the no touch ratio is
        {' '}{fmt(data.pair.hoursRatio, 8)}.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        AND A MASS THAT COULD NOT BE COMPUTED BECOMES A MASS OF ZERO. Both slots are read as a value
        or zero, and a not-a-number is falsy, so the guard only fires when the TOTAL heat capacity
        reaches zero. Both slots bad is refused correctly, ok {yn(data.nanDrop.bothNaNOk)}. ONE slot
        bad returns ok {yn(data.nanDrop.contentsNaNOk)} with
        {' '}{fmt(data.nanDrop.contentsNaNHours, 8)} hr against the correct
        {' '}{fmt(data.nanDrop.bothGoodHours, 8)}, a full station table, no note and no error, short
        by exactly the dropped slot's share of the heat capacity.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">branch</th>
              <th className="text-left pr-3">ok</th>
              <th className="text-left pr-3">hours</th>
              <th className="text-left pr-3">handled</th>
              <th className="text-left">what it says</th>
            </tr>
          </thead>
          <tbody>
            {data.branches.map((b) => (
              <tr key={b.branch} className={b.handled ? '' : 'text-[#f97316]'}>
                <td className="pr-3">{b.label}</td>
                <td className="pr-3">{yn(b.ok)}</td>
                <td className="pr-3">{b.hours === null ? '-' : fmt(b.hours, 8)}</td>
                <td className="pr-3">{yn(b.handled)}</td>
                <td>{b.note || b.error || 'nothing at all'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-slate-300">
        THE MISSING BRANCH RETURNS A NEGATIVE NUMBER OF HOURS AS A NORMAL ANSWER. The cooldown
        guards its start against ambient and its target against ambient, and never checks the start
        against the target. Asked for the time to fall from {fmt(data.backwards.startTempF, 8)} degF
        to {fmt(data.backwards.targetTempF, 2)} degF against a
        {' '}{fmt(data.backwards.seabedTempF, 1)} degF seabed it returns ok
        {' '}{yn(data.backwards.ok)}, {fmt(data.backwards.hours, 8)} hr, and a station table that
        runs backwards in time and WARMS UP by
        {' '}{fmt(data.backwards.temperatureRiseAcrossTheTableF, 8)} degF. The mirror of that
        question put to the inverse is refused outright: {data.backwards.mirrorReason}
      </div>
      <Note>
        The right answer is that there is no no touch time at all: the line is inside its shut in
        boundary from the moment it stops. Every temperature in that paragraph is a TEACHING input
        on a TEACHING line, and the boundary itself is a laboratory number the engine never
        computes.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Margin = () => {
  const data = useMemo(() => {
    try {
      return {
        akaso: lineExplorer.akaso(),
        heat: lineExplorer.akasoHeatLoss(),
        stations: lineExplorer.akasoStations(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A margin needs a boundary, and neither engine computes one. Without a laboratory hydrate temperature there is an arrival and nothing to read it against.</Note>;
  }
  const chart = data.stations.map((s) => ({ x: s.xFt, t: s.tempF, m: s.marginAgainstFlowingBoundaryF }));
  return (
    <>
      <TileGrid>
        <Tile label="Overall U, referred to the bore" value={fmt(data.heat.engineUBtuHrFt2F, 10)} unit="Btu/(hr ft2 degF)" />
        <Tile label="Relaxation length" value={fmt(data.heat.relaxationLengthFt, 8)} unit="ft" />
        <Tile label="ntu over the whole line" value={fmt(data.heat.ntu, 10)} />
        <Tile label="Inlet excess over the seabed" value={fmt(data.heat.inletExcessOverSeabedF, 4)} unit="degF" />
        <Tile label="Arrival, heat loss only" value={fmt(data.heat.arrivalTempF, 8)} unit="degF" />
        <Tile label="Arrival excess over the seabed" value={fmt(data.heat.arrivalExcessOverSeabedF, 8)} unit="degF" />
        <Tile label="Hydrate boundary, a laboratory input" value={fmt(data.heat.hydrateFlowingF, 2)} unit="degF" />
        <Tile label="Margin against it" value={fmt(data.heat.marginF, 8)} unit="degF" />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'distance along the line, ft', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'temperature, degF', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 8)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={data.akaso.hydrateFlowingF} stroke="#f97316" strokeDasharray="4 3" />
            <ReferenceLine y={data.akaso.seabedTempF} stroke="#38bdf8" strokeDasharray="4 3" />
            <Line type="monotone" dataKey="t" name="fluid temperature, heat loss only"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">station</th>
              <th className="text-left pr-3">x, ft</th>
              <th className="text-left pr-3">temperature, degF</th>
              <th className="text-left pr-3">excess over the seabed, degF</th>
              <th className="text-left pr-3">margin against the boundary, degF</th>
              <th className="text-left">inside the hydrate region</th>
            </tr>
          </thead>
          <tbody>
            {data.stations.filter((s) => s.station % 2 === 0).map((s) => (
              <tr key={s.station} className={s.insideTheHydrateRegion ? 'text-[#f97316]' : ''}>
                <td className="pr-3">{s.station}</td>
                <td className="pr-3">{fmt(s.xFt, 2)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(s.tempF, 8)}</td>
                <td className="pr-3">{fmt(s.excessOverSeabedF, 8)}</td>
                <td className="pr-3">{fmt(s.marginAgainstFlowingBoundaryF, 8)}</td>
                <td>{yn(s.insideTheHydrateRegion)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        ONLY THE EVEN STATIONS ARE LISTED, so a reading taken off this table has to say which
        station it came from. The arrival is the last station and it is on its own tile above.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        A MARGIN IS A DIFFERENCE AGAINST A NUMBER THE ENGINE NEVER COMPUTED. Both module headers say
        the hydrate boundary is a fluid property that comes from a lab or a compositional flash and
        that the consumer supplies it. Every verdict on this page is conditional on that
        {' '}{fmt(data.akaso.hydrateFlowingF, 2)} degF, and the same line reads as safe or as
        gassing up depending on a laboratory report nobody in this module has seen.
      </div>
      <Note>
        {data.akaso.name} is a TEACHING LINE. It is not a published case, it is not a real line, and
        no oracle has ever checked it. It exists because the published cases set no pressures, carry
        no coating and have no hydrate boundary at all, so a margin cannot be shown on them.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const LineExplorer = ({ initialMode = 'balance' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Line explorer"
      subtitle="A flowline in operation: the energy balance and the relaxation length it collapses to, the profile down the line, the U a target arrival needs, the cooldown after a shutdown, the mass that cooldown is run on, and the margin against a boundary somebody else measured"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'balance' && <Balance />}
        {mode === 'profile' && <Profile />}
        {mode === 'target' && <Target />}
        {mode === 'cooldown' && <Cooldown />}
        {mode === 'mass' && <Mass />}
        {mode === 'margin' && <Margin />}
      </div>
    </PanelShell>
  );
};

export default LineExplorer;
