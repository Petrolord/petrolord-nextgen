import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
} from 'recharts';
import ChartFrame from '@/components/charts/ChartFrame';
import { GRID_STYLE, TOOLTIP_STYLE } from '@/utils/chartTheme';
import { AXIS_TICK, SVG_CHART, seriesColor } from '@/utils/chartSvg';
import {
  PARAMS, D010_DEFAULT_RULES,
  publishedPlug, excessSweep, ruleSweep, annularSweep, publishedProgram,
} from './integrityLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// P&A explorer, the Expert tier. The balanced plug arithmetic, where the plug
// actually ends up once the stinger comes out, the two length rules, and a
// programme that fails on one zone while its surface phase passes.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const MODES = [
  ['plug', 'The balanced plug'],
  ['excess', 'Excess and where the plug ends up'],
  ['rules', 'The length rules'],
  ['programme', 'The programme and what a log is worth'],
];

const FIX = PARAMS.plugFixture || {};

const Plug = () => {
  const [hole, setHole] = useState('');
  const [stingerOd, setStingerOd] = useState('');
  const holeIdM = hole === '' ? FIX.holeIdM : Number(hole);
  const stingerOdM = stingerOd === '' ? FIX.stingerOdM : Number(stingerOd);
  const p = useMemo(() => {
    try { return publishedPlug({ holeIdM, stingerOdM }); } catch { return null; }
  }, [holeIdM, stingerOdM]);
  const pub = useMemo(() => {
    try { return publishedPlug(); } catch { return null; }
  }, []);

  if (!p || !pub) {
    return (
      <Note>
        That geometry cannot be pumped. The stinger needs an inside diameter smaller than its
        outside diameter, the outside diameter has to clear the hole, and the plug top has to sit
        above its base. Nothing about a balanced plug survives a stinger that does not fit down the
        hole, so the engine refuses rather than returning a number.
      </Note>
    );
  }

  const asPumpedCapM2 = p.cAnnM2 + p.cInM2;
  const caps = [
    { name: 'full hole', v: p.cHoleM2 },
    { name: 'annulus', v: p.cAnnM2 },
    { name: 'stinger bore', v: p.cInM2 },
    { name: 'annulus plus bore', v: asPumpedCapM2 },
  ];
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumField label={`Hole or casing ID (m, published ${FIX.holeIdM})`} value={hole} onChange={setHole} placeholder={String(FIX.holeIdM)} />
        <NumField label={`Stinger OD (m, published ${FIX.stingerOdM})`} value={stingerOd} onChange={setStingerOd} placeholder={String(FIX.stingerOdM)} />
      </div>
      <TileGrid>
        <Tile label="Full hole capacity" value={fmt(p.cHoleM2, 8)} unit="m2/m" />
        <Tile label="Annulus capacity" value={fmt(p.cAnnM2, 8)} unit="m2/m" />
        <Tile label="Stinger bore capacity" value={fmt(p.cInM2, 8)} unit="m2/m" />
        <Tile label="Annulus plus bore, what the column stands in" value={fmt(asPumpedCapM2, 8)} unit="m2/m" />
        <Tile label="Plug length designed" value={fmt(p.lengthM, 3)} unit="m" />
        <Tile label="Excess" value={fmt(FIX.excessFrac, 3)} />
        <Tile label="Slurry" value={fmt(p.slurryM3, 6)} unit="m3" />
        <Tile label="Balanced height" value={fmt(p.balancedHeightM, 6)} unit="m" />
        <Tile label="Spacer ahead, in the annulus" value={fmt(p.spacerAheadM3, 6)} unit="m3" />
        <Tile label="Spacer behind, inside the string" value={fmt(p.spacerBehindM3, 6)} unit="m3" />
        <Tile label="Displacement" value={fmt(p.displacementM3, 6)} unit="m3" />
        <Tile label="Warnings" value={p.warnings.length ? p.warnings.length : 'none'} />
      </TileGrid>
      <ChartFrame height={224} className="mt-3">
        <BarChart data={caps} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="name" tick={{ ...AXIS_TICK, fontSize: 10 }} interval={0} />
          <YAxis tick={AXIS_TICK}
            label={{ value: 'capacity (m2 per m)', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE}
            formatter={(x) => fmt(x, 8)} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine y={p.cHoleM2} stroke={seriesColor(4)}
            label={{ value: 'the full hole', fill: seriesColor(4), fontSize: 10, position: 'top' }} />
          <Bar dataKey="v" name="capacity" fill={seriesColor(1)} isAnimationActive={false} />
        </BarChart>
      </ChartFrame>
      {p.warnings.length ? (
        <div className="mt-3 rounded-md border border-pl-warning/30 bg-pl-warning-bg p-3 text-xs text-pl-warning-text">
          {p.warnings.map((w) => <p key={w} className="mb-0">{w}</p>)}
        </div>
      ) : null}
      <div className="mt-3 text-xs text-pl-text">
        Four capacities and only three of them are geometry. The full hole is {fmt(p.cHoleM2, 6)}
        {' '}square metres per metre, the annulus around the stinger is {fmt(p.cAnnM2, 6)} and the
        stinger bore is {fmt(p.cInM2, 6)}. The fourth is the sum of the last two, and it is the one
        that decides where the slurry stands WHILE THE STINGER IS STILL IN THE HOLE. It comes to
        {' '}{fmt(asPumpedCapM2, 6)}, which is smaller than the full hole, and that single
        inequality is the whole of the next view.
      </div>
      <Note>
        The balance is the point of the exercise. The spacer behind, {fmt(p.spacerBehindM3, 4)} m3,
        is the spacer ahead scaled by the ratio of the bore to the annulus, so the two spacer
        columns stand at the same height and the U-tube is neutral when the pumps stop. Get that
        ratio wrong and the plug either falls out of the string or sucks back into it the moment
        the pump is shut down, and neither shows up on a pump chart until it is far too late.
      </Note>
    </>
  );
};

const Excess = () => {
  const sweep = useMemo(() => {
    try { return excessSweep(); } catch { return null; }
  }, []);
  const zero = useMemo(() => {
    try { return excessSweep([0])[0]; } catch { return null; }
  }, []);
  const published = useMemo(() => (sweep || []).find((r) => r.excess === FIX.excessFrac) || null, [sweep]);
  if (!sweep || !sweep.length || !zero) {
    return <Note>That plug cannot be swept for excess. The excess has to be zero or more, and the fixture needs a plug top above its base before there is a column to redistribute.</Note>;
  }
  const designTopM = FIX.plugTopMdM;
  const data = sweep.map((r) => ({
    excessPct: 100 * r.excess,
    asPumpedTopMdM: r.asPumpedTopMdM,
    pluggedTopMdM: r.pluggedTopMdM,
    settleM: r.settleM,
    slurryM3: r.slurryM3,
  }));
  return (
    <>
      <div className="rounded-md border border-pl-accent/40 bg-pl-accent/5 p-4 mb-3">
        <p className="text-xs text-pl-muted mb-1">At ZERO excess, both of these are true at once</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-pl-success/30 bg-pl-success-bg p-3">
            <p className="text-pl-muted text-xs mb-1">The settled top IS the design top</p>
            <p className="text-pl-success-text text-2xl font-bold mb-0">
              {fmt(zero.pluggedTopMdM, 3)} <span className="text-sm text-pl-muted">against a design {fmt(designTopM, 3)} m</span>
            </p>
            <p className="text-xs text-pl-muted mt-1 mb-0">
              apart by {fmt(zero.pluggedTopMdM - designTopM, 6)} m, which is the identity the
              engine is built on
            </p>
          </div>
          <div className="rounded-md border border-pl-danger/30 bg-pl-danger-bg p-3">
            <p className="text-pl-muted text-xs mb-1">And the plug still SETTLES</p>
            <p className="text-pl-danger-text text-2xl font-bold mb-0">
              {fmt(zero.settleM, 3)} <span className="text-sm text-pl-muted">m below the as-pumped top</span>
            </p>
            <p className="text-xs text-pl-muted mt-1 mb-0">
              as-pumped {fmt(zero.asPumpedTopMdM, 3)} m, settled {fmt(zero.pluggedTopMdM, 3)} m,
              with no excess anywhere in the job
            </p>
          </div>
        </div>
        <p className="text-xs text-pl-muted mt-2 mb-0">
          Both boxes describe the same pump. The column stands in the annulus PLUS the stinger bore
          while the stinger is in the hole, and once the stinger is pulled the same slurry
          redistributes across the FULL hole, which is wider. The top drops
          {' '}{fmt(zero.settleM, 3)} m for that reason alone. Excess adds to that drop, it does
          not cause it.
        </p>
      </div>
      <TileGrid>
        <Tile label="Design plug top" value={fmt(designTopM, 3)} unit="m MD" />
        <Tile label="Settled top at zero excess" value={fmt(zero.pluggedTopMdM, 3)} unit="m MD" />
        <Tile label="Those two apart by" value={fmt(zero.pluggedTopMdM - designTopM, 6)} unit="m" />
        <Tile label="As-pumped top at zero excess" value={fmt(zero.asPumpedTopMdM, 3)} unit="m MD" />
        <Tile label="Settle at zero excess" value={fmt(zero.settleM, 4)} unit="m" />
        <Tile label="Slurry at zero excess" value={fmt(zero.slurryM3, 5)} unit="m3" />
        <Tile label="Settle at the published excess" value={fmt(published ? published.settleM : NaN, 4)} unit="m" />
        <Tile label="Settle at the largest excess swept" value={fmt(sweep[sweep.length - 1].settleM, 4)} unit="m" />
      </TileGrid>
      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <ChartFrame height={256}>
          <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis dataKey="excessPct" type="number" domain={['dataMin', 'dataMax']}
              tick={AXIS_TICK}
              label={{ value: 'excess (pct)', position: 'insideBottom', offset: -3, fill: SVG_CHART.note, fontSize: 10 }} />
            <YAxis reversed domain={['dataMin', 'dataMax']} tick={AXIS_TICK}
              label={{ value: 'top (m MD, deeper is down)', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE}
              formatter={(x) => fmt(x, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={designTopM} stroke={seriesColor(4)}
              label={{ value: `the design top ${fmt(designTopM, 0)} m`, fill: seriesColor(4), fontSize: 10, position: 'insideBottomRight' }} />
            <Line type="monotone" dataKey="asPumpedTopMdM" name="as-pumped top, stinger still in" stroke={seriesColor(0)} dot isAnimationActive={false} />
            <Line type="monotone" dataKey="pluggedTopMdM" name="settled top, stinger pulled" stroke={seriesColor(1)} dot isAnimationActive={false} />
          </LineChart>
        </ChartFrame>
        <ChartFrame height={256}>
          <BarChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis dataKey="excessPct" tick={AXIS_TICK}
              label={{ value: 'excess (pct)', position: 'insideBottom', offset: -3, fill: SVG_CHART.note, fontSize: 10 }} />
            <YAxis tick={AXIS_TICK}
              label={{ value: 'settle (m)', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE}
              formatter={(x) => fmt(x, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={zero.settleM} stroke={seriesColor(4)}
              label={{ value: `${fmt(zero.settleM, 2)} m with NO excess at all`, fill: seriesColor(4), fontSize: 10, position: 'insideTopRight' }} />
            <Bar dataKey="settleM" name="how far the top drops" fill={seriesColor(1)} isAnimationActive={false} />
          </BarChart>
        </ChartFrame>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">excess</th>
              <th className="text-right pr-3">slurry (m3)</th>
              <th className="text-right pr-3">balanced height (m)</th>
              <th className="text-right pr-3">as-pumped top (m MD)</th>
              <th className="text-right pr-3">settled top (m MD)</th>
              <th className="text-right pr-3">settle (m)</th>
              <th className="text-right">settle above the zero-excess floor (m)</th>
            </tr>
          </thead>
          <tbody>
            {sweep.map((r) => (
              <tr key={r.excess} className={r.excess === 0 ? 'text-pl-accent-text font-semibold' : ''}>
                <td className="pr-3">{fmt(100 * r.excess, 1)} pct</td>
                <td className="text-right pr-3">{fmt(r.slurryM3, 5)}</td>
                <td className="text-right pr-3">{fmt(r.balancedHeightM, 4)}</td>
                <td className="text-right pr-3">{fmt(r.asPumpedTopMdM, 3)}</td>
                <td className="text-right pr-3">{fmt(r.pluggedTopMdM, 3)}</td>
                <td className="text-right pr-3 text-pl-text">{fmt(r.settleM, 4)}</td>
                <td className="text-right text-pl-text">{fmt(r.settleM - zero.settleM, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        The last column is what excess actually buys you, and it is zero on the highlighted row.
        Everything to the left of it on that row is what the geometry costs you whatever you do.
        The settled top is always DEEPER than the as-pumped top, so a plug tagged where the pump
        chart said it would be is a plug that did not do what the arithmetic says.
      </div>
      <Note>
        A reader told that settling is an excess effect would tighten the excess and expect the gap
        to close. It would not: the floor is {fmt(zero.settleM, 3)} m and no amount of discipline on
        the batch mixer moves it. The way to move it is geometry, either a wider stinger annulus or
        an acceptance that the plug is set {fmt(zero.settleM, 1)} m low and the tag depth planned
        accordingly. Notice also that the design top and the settled top coincide EXACTLY at zero
        excess, and that is what makes every metre of the difference attributable to excess and to
        nothing else.
      </Note>
    </>
  );
};

const Rules = () => {
  const sweep = useMemo(() => {
    try { return ruleSweep(); } catch { return null; }
  }, []);
  if (!sweep || !sweep.length) {
    return <Note>Those lengths do not describe plugs. A plug needs its bottom below its top before any rule can be read against it.</Note>;
  }
  const lengths = Array.from(new Set(sweep.map((r) => r.lengthM))).sort((a, b) => a - b);
  const at = (lengthM, foundation) => sweep.find((r) => r.lengthM === lengthM && r.foundation === foundation);
  const data = lengths.map((lengthM) => ({
    lengthM,
    none: at(lengthM, 'none') && at(lengthM, 'none').pass ? 1 : 0,
    tagged: at(lengthM, 'tagged') && at(lengthM, 'tagged').pass ? 1 : 0,
  }));
  const between = lengths.filter((l) => {
    const a = at(l, 'none');
    const b = at(l, 'tagged');
    return a && b && !a.pass && b.pass;
  });
  return (
    <>
      <TileGrid>
        <Tile label="Plug minimum, no foundation" value={fmt(D010_DEFAULT_RULES.plugMinLengthM, 0)} unit="m MD" />
        <Tile label="Plug minimum on a verified foundation" value={fmt(D010_DEFAULT_RULES.plugMinLengthOnFoundationM, 0)} unit="m MD" />
        <Tile label="What the foundation is worth" value={fmt(D010_DEFAULT_RULES.plugMinLengthM - D010_DEFAULT_RULES.plugMinLengthOnFoundationM, 0)} unit="m" />
        <Tile label="Extends above the source" value={fmt(D010_DEFAULT_RULES.plugAboveSourceMinM, 0)} unit="m" />
        <Tile label="Surface plug minimum" value={fmt(D010_DEFAULT_RULES.surfacePlugMinLengthM, 0)} unit="m MD" />
        <Tile label="Lengths swept" value={fmt(lengths.length, 0)} />
        <Tile label="Lengths that need the foundation" value={between.length ? between.map((l) => fmt(l, 0)).join(', ') : 'none'} unit="m" />
        <Tile label="Rows in the sweep" value={fmt(sweep.length, 0)} />
      </TileGrid>
      <ChartFrame height={224} className="mt-3">
        <BarChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="lengthM" tick={AXIS_TICK}
            label={{ value: 'plug length (m MD)', position: 'insideBottom', offset: -3, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis domain={[0, 1]} ticks={[0, 1]} tickFormatter={(x) => (x ? 'pass' : 'fail')}
            tick={AXIS_TICK} />
          <Tooltip contentStyle={TOOLTIP_STYLE}
            formatter={(x) => (x ? 'pass' : 'fail')} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="none" name="no foundation" fill={seriesColor(4)} isAnimationActive={false} />
          <Bar dataKey="tagged" name="on a tagged foundation" fill={seriesColor(1)} isAnimationActive={false} />
        </BarChart>
      </ChartFrame>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">length (m MD)</th>
              <th className="text-right pr-3">required, no foundation (m)</th>
              <th className="text-left pr-3">verdict</th>
              <th className="text-right pr-3">required, on a foundation (m)</th>
              <th className="text-left pr-3">verdict</th>
              <th className="text-left">what the foundation changed</th>
            </tr>
          </thead>
          <tbody>
            {lengths.map((l) => {
              const a = at(l, 'none');
              const b = at(l, 'tagged');
              if (!a || !b) return null;
              return (
                <tr key={l}>
                  <td className="pr-3">{fmt(l, 0)}</td>
                  <td className="text-right pr-3">{fmt(a.checks[0].requiredM, 0)}</td>
                  <td className={`pr-3 ${a.pass ? 'text-pl-success-text' : 'text-pl-danger-text'}`}>{a.pass ? 'pass' : 'fail'}</td>
                  <td className="text-right pr-3">{fmt(b.checks[0].requiredM, 0)}</td>
                  <td className={`pr-3 ${b.pass ? 'text-pl-success-text' : 'text-pl-danger-text'}`}>{b.pass ? 'pass' : 'fail'}</td>
                  <td className="text-pl-text">{a.pass === b.pass ? 'nothing' : 'everything, it turned a fail into a pass'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        There are two thresholds and not one. A plug hanging in open hole has to be
        {' '}{fmt(D010_DEFAULT_RULES.plugMinLengthM, 0)} m of cement, and a plug sitting on a
        foundation somebody has actually tagged has to be
        {' '}{fmt(D010_DEFAULT_RULES.plugMinLengthOnFoundationM, 0)} m. In the band between them the
        same length is a fail and a pass depending on nothing but whether a bridge plug is under it
        and whether anyone confirmed that.
      </div>
      <Note>
        Below the lower threshold the foundation buys nothing at all. A
        {' '}{fmt(lengths[0], 0)} m plug fails in both columns, because the foundation moves the bar
        and does not remove it. Read the rule that way round and the design question stops being
        how short a plug can be and becomes what has to be true under it, which is a question about
        the well rather than about the cement.
      </Note>
    </>
  );
};

const Programme = () => {
  const prog = useMemo(() => {
    try { return publishedProgram(); } catch { return null; }
  }, []);
  const annular = useMemo(() => {
    try { return annularSweep(); } catch { return null; }
  }, []);
  if (!prog || !annular || !prog.zoneCompliance) {
    return <Note>That programme cannot be assessed. It needs at least one zone and one plug before there is any compliance to report, and an abandonment with nothing recorded in it is not a compliant abandonment.</Note>;
  }
  const lengths = Array.from(new Set(annular.map((r) => r.lengthM))).sort((a, b) => a - b);
  const at = (lengthM, verifiedByLog) => annular.find((r) => r.lengthM === lengthM && r.verifiedByLog === verifiedByLog);
  const worth = D010_DEFAULT_RULES.annularCementUnverifiedMinM - D010_DEFAULT_RULES.annularCementVerifiedMinM;
  const rescued = lengths.filter((l) => {
    const a = at(l, false);
    const b = at(l, true);
    return a && b && !a.pass && b.pass;
  });
  const failingZones = prog.zoneCompliance.filter((z) => !z.pass);
  return (
    <>
      <div className={`rounded-md border p-4 mb-3 ${prog.pass ? 'border-pl-success/30 bg-pl-success-bg' : 'border-pl-danger/30 bg-pl-danger-bg'}`}>
        <p className="text-xs text-pl-muted mb-1">The programme as a whole</p>
        <p className={`text-3xl font-bold mb-0 ${prog.pass ? 'text-pl-success-text' : 'text-pl-danger-text'}`}>
          {prog.pass ? 'PASS' : 'FAIL'}
        </p>
        <p className="text-xs text-pl-muted mt-2 mb-0">
          and its surface plug, {prog.surfacePlug.name || 'none proposed'}, is
          {' '}{prog.surfacePlug.pass ? 'compliant' : 'not compliant'}. A compliant surface phase
          does not rescue a zone with only one qualifying barrier, and on this well
          {' '}{failingZones.length} of the {prog.zoneCompliance.length} zones is short.
        </p>
      </div>
      <TileGrid>
        <Tile label="Zones with flow potential" value={fmt(prog.zoneCompliance.length, 0)} />
        <Tile label="Zones passing" value={fmt(prog.zoneCompliance.filter((z) => z.pass).length, 0)} />
        <Tile label="Surface plug" value={prog.surfacePlug.name || 'none'} />
        <Tile label="Surface plug verdict" value={prog.surfacePlug.pass ? 'pass' : 'fail'} />
        <Tile label="Plugs in the takeoff" value={fmt(prog.takeoff.plugCount, 0)} />
        <Tile label="Slurry designed" value={fmt(prog.takeoff.slurryM3, 4)} unit="m3" />
        <Tile label="Plugs with no geometry yet" value={prog.takeoff.undesignedPlugs.length ? fmt(prog.takeoff.undesignedPlugs.length, 0) : 'none'} />
        <Tile label="Programme steps" value={fmt(prog.steps.length, 0)} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">zone</th>
              <th className="text-right pr-3">top (m MD)</th>
              <th className="text-left pr-3">primary qualifying</th>
              <th className="text-left pr-3">secondary qualifying</th>
              <th className="text-right pr-3">required</th>
              <th className="text-left">verdict</th>
            </tr>
          </thead>
          <tbody>
            {prog.zoneCompliance.map((z) => (
              <tr key={z.zone}>
                <td className="pr-3">{z.zone}</td>
                <td className="text-right pr-3">{fmt(z.topMdM, 0)}</td>
                <td className="pr-3">{z.primaryQualifying.length ? z.primaryQualifying.join(', ') : 'none'}</td>
                <td className="pr-3">{z.secondaryQualifying.length ? z.secondaryQualifying.join(', ') : 'none'}</td>
                <td className="text-right pr-3">{fmt(z.required, 0)}</td>
                <td className={z.pass ? 'text-pl-success-text' : 'text-pl-danger-text'}>{z.pass ? 'pass' : 'FAIL'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">phase</th>
              <th className="text-left pr-3">step</th>
              <th className="text-left">what happens</th>
            </tr>
          </thead>
          <tbody>
            {prog.steps.map((s) => (
              <tr key={`${s.phase}-${s.step}`}>
                <td className="pr-3">{s.phase}</td>
                <td className="pr-3">{s.step}</td>
                <td className="text-pl-muted">{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ChartFrame height={224} className="mt-4">
        <BarChart data={lengths.map((l) => ({
          lengthM: l,
          unverified: at(l, false) && at(l, false).pass ? 1 : 0,
          logged: at(l, true) && at(l, true).pass ? 1 : 0,
        }))} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="lengthM" tick={AXIS_TICK}
            label={{ value: 'annular cement length (m MD)', position: 'insideBottom', offset: -3, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis domain={[0, 1]} ticks={[0, 1]} tickFormatter={(x) => (x ? 'pass' : 'fail')}
            tick={AXIS_TICK} />
          <Tooltip contentStyle={TOOLTIP_STYLE}
            formatter={(x) => (x ? 'pass' : 'fail')} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="unverified" name="not logged" fill={seriesColor(4)} isAnimationActive={false} />
          <Bar dataKey="logged" name="verified by log" fill={seriesColor(1)} isAnimationActive={false} />
        </BarChart>
      </ChartFrame>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">annular cement (m MD)</th>
              <th className="text-right pr-3">required unlogged (m)</th>
              <th className="text-left pr-3">verdict</th>
              <th className="text-right pr-3">required with a log (m)</th>
              <th className="text-left pr-3">verdict</th>
              <th className="text-left">what the log changed</th>
            </tr>
          </thead>
          <tbody>
            {lengths.map((l) => {
              const a = at(l, false);
              const b = at(l, true);
              if (!a || !b) return null;
              return (
                <tr key={l}>
                  <td className="pr-3">{fmt(l, 1)}</td>
                  <td className="text-right pr-3">{fmt(a.requiredM, 0)}</td>
                  <td className={`pr-3 ${a.pass ? 'text-pl-success-text' : 'text-pl-danger-text'}`}>{a.pass ? 'pass' : 'fail'}</td>
                  <td className="text-right pr-3">{fmt(b.requiredM, 0)}</td>
                  <td className={`pr-3 ${b.pass ? 'text-pl-success-text' : 'text-pl-danger-text'}`}>{b.pass ? 'pass' : 'fail'}</td>
                  <td className="text-pl-text">{a.pass === b.pass ? 'nothing' : 'everything'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        A cement bond log is worth {fmt(worth, 0)} metres of cement. Unlogged annular cement has to
        be {fmt(D010_DEFAULT_RULES.annularCementUnverifiedMinM, 0)} m to count as a barrier and
        logged cement has to be {fmt(D010_DEFAULT_RULES.annularCementVerifiedMinM, 0)} m, so the
        lengths {rescued.length ? rescued.map((l) => fmt(l, 1)).join(', ') : 'in that band'} pass
        with a log and fail without one. That is not a discount for paperwork. Unlogged cement is
        an assumption about a volume nobody has seen, and the extra {fmt(worth, 0)} m is what the
        standard charges for the assumption.
      </div>
      <Note>
        Read the zone table beside the programme verdict. {prog.zoneCompliance[0].zone} has
        {' '}{prog.zoneCompliance[0].primaryQualifying.length} plugs covering the source and
        {' '}{prog.zoneCompliance[0].secondaryQualifying.length} backing them up from above, so it
        passes. {failingZones.length ? `${failingZones[0].zone} has ${failingZones[0].primaryQualifying.length} and ${failingZones[0].secondaryQualifying.length}, so it does not.` : ''}
        {' '}One zone short is the whole programme short, and no amount of compliant work at
        surface changes that. This is a PLANNING checklist in the well programme tradition and not
        an operational procedure: it tells you the abandonment is not finished, and it does not
        tell you how to finish it.
      </Note>
    </>
  );
};

const PaExplorer = () => {
  const [mode, setMode] = useState('plug');
  return (
    <PanelShell
      title="Plug and abandonment explorer"
      subtitle="The balanced plug, where it actually ends up, the two length rules, and a programme that fails on one zone"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'plug' && <Plug />}
        {mode === 'excess' && <Excess />}
        {mode === 'rules' && <Rules />}
        {mode === 'programme' && <Programme />}
      </div>
    </PanelShell>
  );
};

export default PaExplorer;
