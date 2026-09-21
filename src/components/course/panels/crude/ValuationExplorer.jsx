import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend, Cell,
} from 'recharts';
import {
  KWALE_SHARES, KWALE_CUT_POINTS, kwaleBlend, kwalePartial, studioPair, kwaleCuts, cutPointRange, netback, marker,
} from './crudeLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, f4, usable, Tbl, Basis, Shortcut, Refused, Note, Lead, Empty, safe, Slider, Toggle, Button,
} from './panelBits';
import { PanelShell, SelectField, FieldGrid } from '@/components/course/panels/petrophysics/panelKit';

// Valuation explorer, the Professional tier throughout.
//
// THE BLEND HAS ITS OWN CURVE. Yields add on volume, so the engine forms the
// blend's curve at every temperature either crude measured, and T50 is read off
// that curve by interpolation. The grid reading and the averaged component
// midpoints are drawn beside it as the readings the engine does not use, and
// Watson K is labelled as the screening figure it is.
//
// A CUT POINT MOVES BARRELS BETWEEN TWO CUTS. Dragging one of the KWALE
// refinery's cut points re-reads the blend's curve through the engine, and the
// change column shows barrels leaving one cut and arriving in its neighbour.
//
// THE NETBACK IS A WATERFALL of the engine's own terms in the engine's order:
// gross product value, the loss on the product side, processing, freight, the
// netback, then the marker and the differential. A blank cost is named as taken
// as zero, an unpriced cut is named, and the valuation says it is incomplete.
// At the refinery's own settings every figure is the digest's.

export const MODES = [
  ['curve', "The blend's own curve beside its two crudes, and a partial assay in a blend"],
  ['t50', 'The fifty percent point read off the blend, and the Watson factor as a screening figure'],
  ['cuts', "The refinery's cut points, dragged: barrels move between two cuts and nowhere else"],
  ['netback', 'The netback as a waterfall, and the differential against the marker'],
];

// ---------------------------------------------------------------------------

export const BlendCurveMode = ({
  kw, partial, share, onShare,
}) => {
  const slider = <Slider label="Kwale Light, share by volume (Ughelli Medium takes the rest)" value={share ?? KWALE_SHARES.kwl} min={0} max={100} onChange={onShare} />;
  if (!usable(kw) || !Array.isArray(kw.table)) return <>{slider}<Empty>The blend reader has returned nothing, so there is no curve to draw.</Empty></>;
  return (
    <>
      {slider}
      <Lead>
        blendDistillationCurves: at every temperature either crude measured, the blend has distilled the volume-weighted
        sum of what each crude has distilled. Temperatures are never averaged.
      </Lead>
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={kw.table} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="temperatureF" type="number" domain={[0, 1500]} tick={AXIS} />
            <YAxis domain={[0, 100]} tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="linear" dataKey="light" name="Kwale Light" stroke={SERIES[0]} dot={false} isAnimationActive={false} />
            <Line type="linear" dataKey="medium" name="Ughelli Medium" stroke={SERIES[1]} dot={false} isAnimationActive={false} />
            <Line type="linear" dataKey="blend" name="the blend (blendDistillationCurves)" stroke={SERIES[2]} strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Blend API {f4(kw.api)}, SG {f4(kw.sg)}, sulfur {f4(kw.sulfurWtPct)} wt% on <Basis>{kw.sulfurBasis}</Basis>. The
        blend&apos;s curve has {kw.curve.length} points, one at every temperature either crude measured.
      </Note>
      <Tbl
        head={['temperature F', 'Kwale Light volume percent', 'Ughelli Medium volume percent', 'blend volume percent']}
        rows={kw.table.map((r) => [String(r.temperatureF), f4(r.light), f4(r.medium), f4(r.blend)])}
      />
      {usable(partial) && Array.isArray(partial.curve) ? (
        <>
          <Lead>
            A partial assay in a blend: {partial.names.join(' with ')}, 50 and 50. Where the partial curve says nothing the
            blend&apos;s value is not known either, so those temperatures are dropped.
          </Lead>
          <Tbl head={['temperature F', 'blend volume percent']} rows={partial.curve.map((q) => [String(q.temperatureF), f4(q.volumePercent)])} />
          <Note>
            Dropped, because one crude&apos;s curve is silent there: {partial.dropped.map((t) => `${t} F`).join(', ')}. The
            blend keeps {partial.curve.length} of the {partial.measured} temperatures measured.
          </Note>
        </>
      ) : <Empty>The partial blend reader has returned nothing.</Empty>}
    </>
  );
};

// ---------------------------------------------------------------------------

const t50Rows = (t) => [
  ['T50, interpolated on the blend\'s own curve (the engine)', f4(t.t50), <Basis key="b">temperatureAtVolumePercent(curve, 50)</Basis>, ''],
  ['the first curve point at or past 50 percent', String(t.grid), <Shortcut key="s">a grid reading, which the engine does not use</Shortcut>, f4(t.gridMinusEngine)],
  ["the volume-weighted mean of the crudes' own T50", f4(t.volumeMean), <Shortcut key="s">averaged midpoints, which the engine does not use</Shortcut>, f4(t.volumeMeanMinusEngine)],
  ["the mass-weighted mean of the crudes' own T50", f4(t.massMean), <Shortcut key="s">averaged midpoints on mass, which the engine does not use</Shortcut>, f4(t.massMeanMinusEngine)],
];

export const T50Mode = ({ kw, studio }) => {
  if (!usable(kw) || !usable(kw.t50)) return <Empty>The T50 reader has returned nothing, so there is no reading to show.</Empty>;
  const t = kw.t50;
  return (
    <>
      <Lead>
        The Kwale blend, {kw.shareLight} and {kw.shareMedium}: T50 is read off the blend&apos;s own curve by
        interpolation. Three other readings are drawn beside it, each labelled as a reading the engine does not use, with
        its difference from the engine&apos;s figure.
      </Lead>
      <Tbl head={['reading', 'F', 'what it is', 'minus the engine F']} rows={t50Rows(t)} />
      <div className="h-56 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={kw.curve} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="temperatureF" type="number" domain={[300, 900]} allowDataOverflow tick={AXIS} />
            <YAxis domain={[0, 100]} tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} />
            <ReferenceLine y={50} stroke="#64748b" strokeDasharray="4 2" />
            <ReferenceLine x={t.t50} stroke={SERIES[2]} label={{ value: 'T50, the engine', fill: '#BFFF00', fontSize: 10, position: 'insideTopLeft' }} />
            {t.grid !== null && <ReferenceLine x={t.grid} stroke="#94a3b8" strokeDasharray="4 2" label={{ value: 'grid', fill: '#94a3b8', fontSize: 10, position: 'insideTopRight' }} />}
            <ReferenceLine x={t.volumeMean} stroke={SERIES[1]} strokeDasharray="2 2" label={{ value: 'averaged', fill: '#f472b6', fontSize: 10, position: 'insideBottomLeft' }} />
            <Line type="linear" dataKey="volumePercent" name="blend" stroke={SERIES[0]} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Lead>
        Watson K, a SCREENING figure: the studio takes the boiling point as the blend&apos;s T50, and the strict basis is the
        mean average boiling point, which the studio does not compute (a held item, C13).
      </Lead>
      <Tbl
        head={['blend', 'SG', 'Watson K at T50 (screening)', 'Watson K at the grid reading']}
        rows={[
          ['the Kwale blend', f4(t.sg), f4(t.watsonK), f4(t.watsonKAtGrid)],
          ...(usable(studio) && usable(studio.t50) ? [["the studio's default pair, 60 and 40", f4(studio.t50.sg), f4(studio.t50.watsonK), f4(studio.t50.watsonKAtGrid)]] : []),
        ]}
      />
      {Array.isArray(kw.points) && (
        <Tbl head={['volume percent', 'temperature F off the blend']} rows={kw.points.map((q) => [String(q.volumePercent), f4(q.temperatureF)])} />
      )}
      {usable(studio) && usable(studio.t50) && (
        <>
          <Lead>What the live studio opens on, its default pair at 60 and 40:</Lead>
          <Tbl head={['reading', 'F', 'what it is', 'minus the engine F']} rows={t50Rows(studio.t50)} />
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

export const CutsMode = ({
  cuts, points, onPoint, onReset,
}) => {
  const pts = Array.isArray(points) ? points : KWALE_CUT_POINTS;
  const sliders = (
    <div className="grid gap-3 sm:grid-cols-4">
      {pts.map((v, i) => {
        const range = safe(() => cutPointRange(pts, i)) || { min: 40, max: 1100 };
        return (
          <Slider key={`pt${i}`} label={`cut point ${i + 1}, F`} value={v} min={range.min} max={range.max} step={5} onChange={(x) => onPoint && onPoint(i, x)} />
        );
      })}
      <div><Button onClick={onReset}>Back to the refinery&apos;s own cut points</Button></div>
    </div>
  );
  if (!usable(cuts) || !Array.isArray(cuts.rows)) return <>{sliders}<Empty>The cut reader has returned nothing, so there is no yield to show.</Empty></>;
  return (
    <>
      {sliders}
      <Lead>
        cutYields on the blend&apos;s own curve. The change column is against the refinery&apos;s own cut points: move one
        point and the barrels leave one cut and arrive in its neighbour, and nowhere else.
      </Lead>
      <Tbl
        head={['cut', 'from F', 'to F', 'the blend', 'change', 'Kwale Light', 'Ughelli Medium', 'the two crudes on volume', 'blend minus that']}
        rows={cuts.rows.map((r) => [
          r.name, r.fromF === null ? 'from 0 percent' : String(r.fromF), r.toF === null ? 'to 100 percent' : String(r.toF),
          f4(r.yieldVolPercent, 'unknown'), f4(r.change, ''), f4(r.light, 'unknown'), f4(r.medium, 'unknown'), f4(r.onVolume), f4(r.blendMinusOnVolume, ''),
        ])}
        highlight={(i) => Boolean(cuts.rows[i].change)}
      />
      <Note>
        Total {f4(cuts.total)} percent, change {f4(cuts.totalChange)}. Closes: {String(cuts.closes)}. Cuts with no yield:
        {' '}{cuts.unknownCuts.length ? cuts.unknownCuts.join(', ') : 'nothing'}. Yields add on volume, so the blend&apos;s yield is
        the volume-weighted yield of its crudes.
      </Note>
      <div className="h-56 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cuts.rows} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={AXIS} interval={0} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="base" name="at the refinery's cut points" fill="#475569" isAnimationActive={false} />
            <Bar dataKey="yieldVolPercent" name="at the points you set" fill={SERIES[2]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------

const FLAGS = [
  ['blankFreight', 'Leave freight blank'],
  ['blankLosses', 'Leave losses blank'],
  ['blankResidue', 'Leave the residue price blank'],
];

export const NetbackMode = ({
  nb, marker: mk, flags, onFlag,
}) => {
  const fl = flags && typeof flags === 'object' && !flags.error ? flags : {};
  const toggles = (
    <div className="grid gap-2 sm:grid-cols-3">
      {FLAGS.map(([k, label]) => <Toggle key={k} label={label} on={fl[k]} onChange={(v) => onFlag && onFlag(k, v)} />)}
    </div>
  );
  if (!usable(nb) || !Array.isArray(nb.rows)) {
    return <>{toggles}{nb && nb.error ? <Refused label="netbackValue refused" reason={nb.error} /> : <Empty>The netback reader has returned nothing, so there is no valuation to draw.</Empty>}</>;
  }
  return (
    <>
      {toggles}
      <Lead>
        netbackValue, every term per barrel of crude. Losses are a shrinkage on the product side, so they come off the
        product value before the costs.
      </Lead>
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={nb.waterfall} margin={{ top: 10, right: 20, bottom: 30, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="step" tick={{ ...AXIS, fontSize: 9 }} interval={0} angle={-12} textAnchor="end" />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} />
            <Bar dataKey="low" stackId="w" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="span" stackId="w" isAnimationActive={false}>
              {nb.waterfall.map((w) => <Cell key={w.step} fill={w.value < 0 ? '#f87171' : w.step === 'netback' ? '#BFFF00' : SERIES[0]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Tbl head={['step', '$/bbl of crude']} rows={nb.waterfall.map((w) => [w.step, f4(w.value)])} />
      <Tbl
        head={['cut', 'yield volume percent', 'price $/bbl of product', 'value $/bbl of crude']}
        rows={nb.rows.map((r) => [r.name, f4(r.yieldVolPercent, 'no yield'), r.pricePerBbl === null ? 'no price' : String(r.pricePerBbl), f4(r.valuePerBblCrude, 'not valued')])}
      />
      <Note>
        Complete: {String(nb.complete)}. Taken as zero because they were blank: {nb.assumedZero.length ? nb.assumedZero.join(', ') : 'nothing'}.
        {nb.unpricedCuts.length > 0 && ` Cuts with no price, which contribute nothing and make the valuation incomplete: ${nb.unpricedCuts.join(', ')}.`}
        {nb.unyieldedCuts.length > 0 && ` Cuts with no yield: ${nb.unyieldedCuts.join(', ')}.`}
      </Note>
      <Lead>Losses applied the ways the engine does not apply them, from the same terms:</Lead>
      <Tbl
        head={['reading', 'netback $/bbl', 'minus the engine']}
        rows={[
          ['losses on the product side, before the costs (the engine)', f4(nb.netback), f4(0)],
          ['losses taken off the netback after the costs', f4(nb.lossesAfterCosts), f4(nb.lossesAfterCostsMinusEngine)],
          ['losses left out', f4(nb.lossesLeftOut), f4(nb.lossesLeftOutMinusEngine)],
        ]}
      />
      {usable(mk) && Array.isArray(mk.rows) && (
        <>
          <Lead>Against the marker, {mk.marker} $/bbl, each crude valued alone on the same cut set, prices and costs:</Lead>
          <Tbl head={['crude or blend', 'gross $/bbl', 'netback $/bbl', 'differential $/bbl']} rows={mk.rows.map((r) => [r.label, f4(r.grossValue), f4(r.netback), f4(r.differential)])} />
          <Note>
            The volume-weighted mean of the two crudes&apos; netbacks is {f4(mk.volumeMean)} $/bbl, and the blend&apos;s netback
            minus it is {f4(mk.blendMinusMean)}: the blend is worth what its barrels are worth.
          </Note>
          {[...mk.refusals, ...mk.d86].map((r) => <Refused key={r.label} label={r.label} reason={r.reason} />)}
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const ValuationExplorer = ({ initialMode = 'netback' }) => {
  const [mode, setMode] = useState(initialMode);
  const [share, setShare] = useState(KWALE_SHARES.kwl);
  const [points, setPoints] = useState(KWALE_CUT_POINTS);
  const [flags, setFlags] = useState({});

  const kw = useMemo(() => (mode === 'curve' || mode === 't50' ? safe(() => kwaleBlend(share)) : null), [mode, share]);
  const partial = useMemo(() => (mode === 'curve' ? safe(kwalePartial) : null), [mode]);
  const studio = useMemo(() => (mode === 't50' ? safe(studioPair) : null), [mode]);
  const cuts = useMemo(() => (mode === 'cuts' ? safe(() => kwaleCuts(points, share)) : null), [mode, points, share]);
  const nb = useMemo(() => (mode === 'netback' ? safe(() => netback({
    shareLight: share, points, blankFreight: flags.blankFreight, blankLosses: flags.blankLosses, blankPrice: flags.blankResidue ? 'residue' : null,
  })) : null), [mode, share, points, flags]);
  const mk = useMemo(() => (mode === 'netback' ? safe(marker) : null), [mode]);

  return (
    <PanelShell
      title="Valuation explorer"
      subtitle="The KWALE modular refinery values a blend of Kwale Light and Ughelli Medium on its own cut set, prices and costs. The share and the cut points you set carry across every view; at 55 and 45 on the refinery's own cut points every figure is the one the lessons quote."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'curve' && <BlendCurveMode kw={kw} partial={partial} share={share} onShare={setShare} />}
        {mode === 't50' && (
          <>
            <Slider label="Kwale Light, share by volume" value={share} min={0} max={100} onChange={setShare} />
            <T50Mode kw={kw} studio={studio} />
          </>
        )}
        {mode === 'cuts' && (
          <CutsMode cuts={cuts} points={points} onPoint={(i, v) => setPoints((p) => p.map((x, k) => (k === i ? v : x)))} onReset={() => setPoints(KWALE_CUT_POINTS)} />
        )}
        {mode === 'netback' && <NetbackMode nb={nb} marker={mk} flags={flags} onFlag={(k, v) => setFlags((f) => ({ ...f, [k]: v }))} />}
      </div>
      <Note>
        Every figure, basis and refusal on this page is a return value of the vendored crudeAssay module through the
        teaching lab, printed to four decimals. Every crude, price and cost is invented and illustrative.
      </Note>
    </PanelShell>
  );
};

export default ValuationExplorer;
