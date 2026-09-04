import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot,
} from 'recharts';
import { profileExplorer } from './gasWellLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Profile explorer, the Professional tier. A well is not a station.
//
// Five modes. The traverse down the hole with its own z and density, the
// loading profile and where the crossing sits, the rate sweep that walks the
// crossing up the hole as the well declines, the velocity string sizing with
// every candidate and the ok key beside the pick, and the plunger screen with
// the three flags its verdict is built from.
//
// EBOCHA-5 and OGUTA-2 are TEACHING WELLS. Neither is a published case, neither
// is a real well, and no oracle has ever checked either of them. The published
// plunger case beside the screen is a golden.
//
// Every figure on this page is a return value from gasWellLab, which is a
// return value from the vendored engines. Nothing here marches a traverse,
// locates a crossing, sizes a string or balances a plunger.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['traverse', 'The traverse down the hole'],
  ['profile', 'The loading profile, and where the crossing sits'],
  ['rates', 'The same well as it declines'],
  ['sizing', 'Sizing a velocity string, every candidate and the pick'],
  ['plunger', 'The plunger, and the screen that judges it'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const CORRELATIONS = [
  ['coleman', 'Coleman, which is what the wellhead pressure selects'],
  ['turner', 'Turner, which the controlling station would select'],
];

// --------------------------------------------------------------------------

const Traverse = () => {
  const data = useMemo(() => {
    try {
      return {
        def: profileExplorer.definition(),
        rows: profileExplorer.traverse(),
        rec: profileExplorer.recommendation(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.rows.length) {
    return <Note>A loading profile is a reading of a traverse somebody supplied. The engine does not solve multiphase flow and does not invent a gradient, so with no stations there is no profile: an empty traverse is refused outright rather than treated as a passing well.</Note>;
  }
  const { def, rows, rec } = data;
  return (
    <>
      <TileGrid>
        <Tile label="Well" value={def.name} />
        <Tile label="Tubing shoe" value={fmt(def.depthFt, 0)} unit="ft" />
        <Tile label="Current string" value={fmt(def.idIn, 3)} unit="in" />
        <Tile label="Flow area" value={fmt(def.areaFt2, 10)} unit="ft2" />
        <Tile label="Gas gravity" value={fmt(def.gasSg, 3)} />
        <Tile label="Produced liquid" value={`${fmt(def.sigmaDyneCm, 1)} dyne/cm, ${fmt(def.rhoLiquidLbFt3, 1)} lbm/ft3`} />
        <Tile label="Gas rate" value={fmt(def.qMscfd, 1)} unit="Mscf/d" />
        <Tile label="Wellhead over shoe pressure" value={fmt(def.pressureRatio, 8)} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="depthFt" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'depth, ft', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="p" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'pressure, psia', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="r" orientation="right" tick={AXIS} domain={['auto', 'auto']} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="p" type="monotone" dataKey="pPsia" name="flowing pressure, psia"
              stroke="#BFFF00" dot isAnimationActive={false} />
            <Line yAxisId="r" type="monotone" dataKey="rhoGasLbFt3" name="gas density, lbm/ft3"
              stroke="#38bdf8" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">depth, ft</th>
              <th className="text-left pr-3">pressure, psia</th>
              <th className="text-left pr-3">temperature, degF</th>
              <th className="text-left pr-3">temperature, degR</th>
              <th className="text-left pr-3">z</th>
              <th className="text-left pr-3">gas density, lbm/ft3</th>
              <th className="text-left">tubing, in</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.depthFt}>
                <td className="pr-3">{fmt(r.depthFt, 1)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.pPsia, 1)}</td>
                <td className="pr-3">{fmt(r.tF, 2)}</td>
                <td className="pr-3">{fmt(r.tempR, 2)}</td>
                <td className="pr-3">{fmt(r.z, 10)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.rhoGasLbFt3, 10)}</td>
                <td>{fmt(r.idIn, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE CORRELATION IS CHOSEN HERE, AT THE TOP. Handed the wellhead pressure of{' '}
        {fmt(rows[0].pPsia, 1)} psia the recommendation returns {rec.correlation}, and that one
        answer is then used at every station in the study including the one that actually controls,
        where the pressure is {fmt(rows[rows.length - 1].pPsia, 1)} psia. Hold on to which station
        this choice was made at; the Expert tier is largely about what it costs.
      </div>
      <Note>
        {def.name} is a TEACHING WELL. It is not a published case, it is not a real well, and no
        oracle has checked it. The traverse is PASSED IN as six stations with their own pressure,
        temperature, compressibility factor and diameter, because the module does not solve
        multiphase flow.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Profile = () => {
  const [correlation, setCorrelation] = useState('coleman');
  const data = useMemo(() => {
    try {
      return {
        rows: profileExplorer.profile(correlation),
        summary: profileExplorer.summary(correlation),
        wellheadOnly: profileExplorer.wellheadOnly(correlation),
        refusals: profileExplorer.refusals(),
      };
    } catch { return null; }
  }, [correlation]);
  if (!data || !data.rows.length) {
    return <Note>The profile needs at least one station from the flowing traverse, and it refuses an unknown correlation rather than silently treating it as Turner. Both refusals come back as a return value with an error on it, not as a throw.</Note>;
  }
  const { rows, summary, wellheadOnly } = data;
  const crossing = rows.find((r) => r.loaded);
  return (
    <>
      <FieldGrid>
        <SelectField label="Correlation" value={correlation} onChange={setCorrelation} options={CORRELATIONS} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Controlling station" value={fmt(summary.controllingDepthFt, 0)} unit="ft" />
          <Tile label="Its critical rate" value={fmt(summary.controllingCriticalRateMscfd, 9)} unit="Mscf/d" />
          <Tile label="Its ratio" value={fmt(summary.controllingRatio, 10)} />
          <Tile label="The well is loaded" value={yn(summary.loaded)} />
          <Tile label="Margin at the controlling station" value={fmt(summary.marginPct, 8)} unit="%" />
          <Tile label="Margin at the wellhead alone" value={fmt(summary.wellheadMarginPct, 8)} unit="%" />
          <Tile label="Deepest healthy station" value={fmt(summary.deepestHealthyDepthFt, 0)} unit="ft" />
          <Tile label="Shallowest loading station" value={fmt(summary.shallowestLoadingDepthFt, 0)} unit="ft" />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="depthFt" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'depth, ft', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'ratio, actual over critical', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 10)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'the crossing', fill: '#f472b6', fontSize: 10, position: 'insideTopRight' }} />
            <Line type="monotone" dataKey="ratio" name="the profile ratio, station by station"
              stroke="#BFFF00" dot isAnimationActive={false} />
            {crossing ? (
              <ReferenceDot x={crossing.depthFt} y={crossing.ratio} r={5} fill="#f97316" stroke="none" isFront />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">depth, ft</th>
              <th className="text-left pr-3">critical velocity, ft/s</th>
              <th className="text-left pr-3">critical rate, Mscf/d</th>
              <th className="text-left pr-3">actual velocity, ft/s</th>
              <th className="text-left pr-3">ratio</th>
              <th className="text-left pr-3">loaded</th>
              <th className="text-left pr-3">critical rate rises, Mscf/d</th>
              <th className="text-left">ratio falls</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.depthFt} className={r.loaded ? 'text-[#f97316]' : ''}>
                <td className="pr-3">{fmt(r.depthFt, 1)}</td>
                <td className="pr-3">{fmt(r.criticalVelocityFtS, 10)}</td>
                <td className="pr-3">{fmt(r.criticalRateMscfd, 9)}</td>
                <td className="pr-3">{fmt(r.actualVelocityFtS, 10)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.ratio, 10)}</td>
                <td className="pr-3">{yn(r.loaded)}</td>
                <td className="pr-3">{r.criticalRateRiseMscfd === null ? '-' : fmt(r.criticalRateRiseMscfd, 9)}</td>
                <td>{r.ratioFall === null ? '-' : fmt(r.ratioFall, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE CRITICAL RATE RISES MONOTONICALLY WITH DEPTH ON A NORMAL TRAVERSE, which is WHY the shoe
        controls. It goes as roughly the square root of pressure, so it is highest at the bottom of
        the tubing, exactly where the liquid actually collects. The ratio therefore falls all the way
        down and crosses one somewhere below the midpoint. This well passes at the gauge and loads at
        the shoe, and the crossing sits inside the deepest {fmt(summary.insideDeepestPct, 4)} percent
        of the string and outside the deepest {fmt(summary.outsideDeepestPct, 4)} percent. Six
        stations is as far as six stations can pin it.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        AND A POINT CHECK AT THE GAUGE INVERTS THE VERDICT. Handed only the wellhead station the
        profile names {fmt(wellheadOnly.controllingDepthFt, 0)} ft as the controlling station, reads
        a ratio of {fmt(wellheadOnly.controllingRatio, 10)} and reports loaded ={' '}
        {yn(wellheadOnly.loaded)}. The function is right and the traverse was wrong, and nothing in
        the return value says which. The whole traverse names{' '}
        {fmt(wellheadOnly.fullTraverseControllingDepthFt, 0)} ft and reports loaded ={' '}
        {yn(wellheadOnly.fullTraverseLoaded)}.
      </div>
      <Note>
        {data.refusals.map((r) => `${r.label}: ${r.error}`).join(' ')}
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Rates = () => {
  const data = useMemo(() => {
    try { return { rows: profileExplorer.rateSweep(), rates: profileExplorer.rates }; } catch { return null; }
  }, []);
  if (!data || !data.rows.length) return <Note>A rate sweep is a sequence of verdicts at rates a caller supplied. There is no inflow performance in these modules, so nothing here predicts the decline it walks along.</Note>;
  const chart = data.rows.map((r) => ({
    qMscfd: r.qMscfd,
    marginPct: r.marginPct,
    crossingFt: r.shallowestLoadingDepthFt === null ? null : r.shallowestLoadingDepthFt,
  }));
  return (
    <>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="qMscfd" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'gas rate, Mscf/d', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="m" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'margin, percent', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="d" orientation="right" tick={AXIS} domain={[0, 7500]} reversed />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="m" y={0} stroke="#f472b6" strokeDasharray="4 3" />
            <Line yAxisId="m" type="monotone" dataKey="marginPct" name="margin at the controlling station, percent"
              stroke="#BFFF00" dot isAnimationActive={false} />
            <Line yAxisId="d" type="monotone" dataKey="crossingFt" name="shallowest loading station, ft"
              stroke="#f97316" dot connectNulls={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">gas rate, Mscf/d</th>
              <th className="text-left pr-3">ratios, top station first</th>
              <th className="text-left pr-3">loaded</th>
              <th className="text-left pr-3">margin, percent</th>
              <th className="text-left">shallowest loading station</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.qMscfd} className={r.loaded ? 'text-[#f97316]' : ''}>
                <td className="pr-3">{fmt(r.qMscfd, 1)}</td>
                <td className="pr-3 text-[#BFFF00]">{r.ratios.map((x) => fmt(x, 6)).join(', ')}</td>
                <td className="pr-3">{yn(r.loaded)}</td>
                <td className="pr-3">{fmt(r.marginPct, 6)}</td>
                <td>{r.shallowestLoadingDepthFt === null ? 'none' : `${fmt(r.shallowestLoadingDepthFt, 1)} ft`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE CROSSING WALKS UP THE HOLE AS THE WELL DECLINES, and it does not walk smoothly. It moves
        in station-sized jumps, because six stations is the resolution the traverse has, so the
        column above says which BRACKET the crossing is in and never where inside it. The two highest
        rates cross nothing at all and are printed rather than dropped, because a sweep with the
        uninteresting ends cut off is a sweep whose shape a reader has to take on trust.
      </div>
      <Note>
        Every ratio in that table is a verdict at a rate somebody supplied. Nothing here says the well
        will reach any of these rates, or when.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Sizing = () => {
  const [correlation, setCorrelation] = useState('coleman');
  const [station, setStation] = useState('controlling');
  const data = useMemo(() => {
    try {
      return {
        rows: profileExplorer.sizingRows(correlation, station),
        verdict: profileExplorer.sizingVerdict(correlation, station),
        at: profileExplorer.sizingStation(station),
        hopeless: profileExplorer.hopeless(),
        refusals: profileExplorer.sizingRefusals(),
      };
    } catch { return null; }
  }, [correlation, station]);
  if (!data || !data.rows.length) {
    return <Note>A sizing scores a list of candidates a caller supplied. Handed no candidates at all it returns ok = false and a reason, rather than an empty pick that reads like a finding.</Note>;
  }
  const { rows, verdict, at, hopeless } = data;
  return (
    <>
      <FieldGrid>
        <SelectField label="Correlation" value={correlation} onChange={setCorrelation} options={CORRELATIONS} />
        <SelectField label="Station handed to the sizing" value={station} onChange={setStation}
          options={[['controlling', 'the controlling station, the shoe'], ['wellhead', 'the wellhead, which is the classic error']]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Evaluated at" value={`${fmt(at.depthFt, 0)} ft, ${fmt(at.pPsia, 1)} psia`} />
          <Tile label="At a gas rate of" value={fmt(at.qMscfd, 1)} unit="Mscf/d" />
          <Tile label="ok" value={yn(verdict.ok)} />
          <Tile label="largestUnloaded" value={verdict.pickIdIn === null ? 'null' : fmt(verdict.pickIdIn, 3)} unit={verdict.pickIdIn === null ? '' : 'in'} />
          <Tile label="Its ratio" value={verdict.pickRatio === null ? '-' : fmt(verdict.pickRatio, 10)} />
          <Tile label="Candidates that unload" value={verdict.unloadIdsIn.length ? verdict.unloadIdsIn.map((x) => fmt(x, 3)).join(', ') : 'none'} />
          <Tile label="Candidates that do not" value={verdict.rejectedIdsIn.length ? verdict.rejectedIdsIn.map((x) => fmt(x, 3)).join(', ') : 'none'} />
          <Tile label="Best ratio on the list" value={fmt(verdict.bestRatioOnTheList, 10)} />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[...rows].reverse()} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="idIn" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'candidate inside diameter, in', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'ratio', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 10)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'clears one', fill: '#f472b6', fontSize: 10, position: 'insideTopLeft' }} />
            <Line type="monotone" dataKey="ratio" name={`ratio under ${correlation}`}
              stroke="#BFFF00" dot isAnimationActive={false} />
            {verdict.pickIdIn === null ? null : (
              <ReferenceDot x={verdict.pickIdIn} y={verdict.pickRatio} r={5} fill="#f97316" stroke="none" isFront />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">candidate, in</th>
              <th className="text-left pr-3">flow area, ft2</th>
              <th className="text-left pr-3">critical velocity, ft/s</th>
              <th className="text-left pr-3">critical rate, Mscf/d</th>
              <th className="text-left pr-3">actual velocity, ft/s</th>
              <th className="text-left pr-3">ratio</th>
              <th className="text-left">unloads</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.idIn} className={r.idIn === verdict.pickIdIn ? 'text-white' : (r.unloads ? '' : 'text-slate-500')}>
                <td className="pr-3">{fmt(r.idIn, 3)}{r.idIn === verdict.pickIdIn ? ' (the pick)' : ''}</td>
                <td className="pr-3">{fmt(r.areaFt2, 10)}</td>
                <td className="pr-3">{fmt(r.criticalVelocityFtS, 10)}</td>
                <td className="pr-3">{fmt(r.criticalRateMscfd, 9)}</td>
                <td className="pr-3">{fmt(r.actualVelocityFtS, 10)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.ratio, 10)}</td>
                <td>{yn(r.unloads)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE PICK IS ONE LINE OUT OF THAT TABLE. It is the largest inside diameter whose critical rate
        the well still beats, and the rejections are the rest of it. The critical velocity is the same
        on every row, because velocity belongs to the station; only the area moves, so only the rate
        and the ratio move with it. The returned object carries {verdict.objectKeys.join(', ')}, and
        each row carries {verdict.rowKeys.join(', ')}. There is no depth anywhere in either list.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        AND ok IS NOT DECORATION. Ask this list for a rate nothing on it can carry,{' '}
        {fmt(hopeless.qMscfd, 1)} Mscf/d, and largestUnloaded comes back null with ok ={' '}
        {yn(hopeless.ok)} and a best ratio anywhere on the list of{' '}
        {fmt(hopeless.bestRatioOnTheList, 10)}. That null is a FINDING: every candidate was evaluated
        and none of them unloads this well, and there is no least bad candidate and no clamp to the
        smallest diameter. The three rows below return the same null with ok = false, and those are
        REFUSALS: the question was never evaluated, so the pick is not a finding about this well at
        all. Read the boolean before the pick.
      </div>
      <div className="mt-2 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">what went wrong</th>
              <th className="text-left pr-3">ok</th>
              <th className="text-left pr-3">rows scored</th>
              <th className="text-left">the reason it gives</th>
            </tr>
          </thead>
          <tbody>
            {data.refusals.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3 text-[#f97316]">{yn(r.ok)}</td>
                <td className="pr-3">{r.rowCount}</td>
                <td>{r.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The sizing has no opinion about which station its pressure, temperature and compressibility
        factor came from. Switch the station control above and both the pick and the rejections move,
        while ok stays true either way: the sizing that was asked for was answerable and was
        answered. The boolean is honest about the question it covers and silent about the one nobody
        asked.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Plunger = () => {
  const data = useMemo(() => {
    try {
      return {
        pub: profileExplorer.plunger(),
        well: profileExplorer.plungerWell(),
        screen: profileExplorer.screen(),
        refusals: profileExplorer.screenRefusals(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>The plunger balance is STATIC. It needs a depth, a tubing size, a slug, a plunger weight and a gas column, and it refuses each of those missing by name rather than returning a number it cannot stand behind.</Note>;
  }
  const { pub, well, screen } = data;
  const terms = [
    ['line pressure', screen.linePressurePsi],
    ['slug hydrostatic', screen.slugPsi],
    ['plunger weight', screen.plungerPsi],
    ['gas column', screen.gasColumnPsi],
    ['friction, an input', screen.frictionPsi],
  ];
  return (
    <>
      <TileGrid>
        <Tile label="Well" value={well.name} />
        <Tile label="Depth" value={fmt(well.depthFt, 0)} unit="ft" />
        <Tile label="Tubing" value={fmt(well.idIn, 3)} unit="in" />
        <Tile label="Slug" value={`${fmt(well.slugLengthFt, 0)} ft of ${fmt(well.liquidSg, 3)} SG`} />
        <Tile label="Line pressure" value={fmt(well.linePressurePsia, 1)} unit="psia" />
        <Tile label="Casing pressure" value={fmt(well.casingPressurePsia, 1)} unit="psia" />
        <Tile label="Required lift pressure" value={fmt(screen.requiredPsia, 10)} unit="psia" />
        <Tile label="The casing exceeds it by" value={fmt(screen.casingExceedsByPsi, 10)} unit="psi" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">term of the static balance</th>
              <th className="text-left pr-3">psi</th>
              <th className="text-left">share of the requirement</th>
            </tr>
          </thead>
          <tbody>
            {terms.map(([label, psi]) => (
              <tr key={label}>
                <td className="pr-3">{label}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(psi, 10)}</td>
                <td>{fmt((psi / screen.requiredPsia) * 100, 4)} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Gas a cycle needs" value={fmt(screen.gasPerCycleScf, 9)} unit="scf" />
          <Tile label="Liquid a cycle brings up" value={fmt(screen.liquidPerCycleBbl, 10)} unit="bbl" />
          <Tile label="Required gas-liquid ratio" value={fmt(screen.requiredGlrScfBbl, 8)} unit="scf/bbl" />
          <Tile label="The well makes" value={fmt(screen.wellGlrScfBbl, 1)} unit="scf/bbl" />
          <Tile label="The rule of thumb asks" value={fmt(screen.ruleOfThumbGlrScfBbl, 8)} unit="scf/bbl" />
          <Tile label="The physics is this much more demanding" value={fmt(screen.requirementOverRuleOfThumb, 8)} />
          <Tile label="Total cycle" value={fmt(screen.totalMin, 8)} unit="min" />
          <Tile label="Trips a day" value={fmt(screen.cyclesPerDay, 8)} />
          <Tile label="pressureOk" value={yn(screen.pressureOk)} />
          <Tile label="glrOk" value={yn(screen.glrOk)} />
          <Tile label="ruleOfThumbAgrees" value={yn(screen.ruleOfThumbAgrees)} />
          <Tile label="feasible" value={yn(screen.feasible)} />
        </TileGrid>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE RULE OF THUMB BLESSES WHAT THE PHYSICS REFUSES. This well makes{' '}
        {fmt(screen.wellGlrScfBbl, 1)} scf/bbl and clears the {fmt(screen.ruleOfThumbGlrScfBbl, 1)}{' '}
        scf/bbl screening heuristic comfortably, so ruleOfThumbAgrees would read true on that reading
        alone. The balance the engine actually solves asks for {fmt(screen.requiredGlrScfBbl, 8)}{' '}
        scf/bbl, about {fmt(screen.requirementOverRuleOfThumb, 2)} times what the heuristic asks, so
        glrOk reads {yn(screen.glrOk)}. The 400 scf per barrel per thousand feet rule is carried for
        comparison only and never decides feasibility.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        {screen.warnings.map((w) => `${w.code}: ${w.message}`).join(' ')}
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE SAME BALANCE ON THE PUBLISHED CASE, which an oracle did check: {fmt(pub.inputs.depthFt, 0)}{' '}
        ft of {fmt(pub.inputs.idIn, 3)} in tubing, a {fmt(pub.inputs.slugLengthFt, 0)} ft slug of{' '}
        {fmt(pub.inputs.liquidSg, 3)} SG liquid, a {fmt(pub.inputs.linePressurePsia, 1)} psia line and
        a {fmt(pub.inputs.plungerWeightLb, 1)} lb plunger. The engine returns{' '}
        {fmt(pub.requiredPsia, 10)} psia and the oracle published{' '}
        {fmt(pub.goldenRequiredPsia, 10)} psia. That gap is not a tolerance question and it is not two
        roads to one number; the Expert tier names the constant it comes from.
      </div>
      <Note>
        WHAT IT REFUSES OUTRIGHT, on the same well with one input broken:{' '}
        {data.refusals.map((r) => `${r.label} gives "${r.errors}"`).join(' ')}
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const ProfileExplorer = () => {
  const [mode, setMode] = useState('profile');
  return (
    <PanelShell
      title="Profile explorer"
      subtitle="A well is not a station: the traverse down the hole, the loading profile and where it crosses, the controlling station a point check never reaches, sizing a velocity string, and the plunger screen with the flags its verdict is built from"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'traverse' && <Traverse />}
        {mode === 'profile' && <Profile />}
        {mode === 'rates' && <Rates />}
        {mode === 'sizing' && <Sizing />}
        {mode === 'plunger' && <Plunger />}
      </div>
    </PanelShell>
  );
};

export default ProfileExplorer;
