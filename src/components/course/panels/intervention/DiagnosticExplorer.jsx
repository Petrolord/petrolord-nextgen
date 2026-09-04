import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, ReferenceLine,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { diagnosticExplorer } from './interventionLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Diagnostic explorer, the Associate tier. THE FIT AND THE GEOMETRY.
//
// Four modes. A raw ratio history with the least squares line fitted through
// it in log space, read off ONE return; what a clean fit does not prove; the
// pseudo steady state denominator as one group, with the drainage radius shown
// for what it is; and the floor a geometry allows.
//
// Every figure on this page is a return value from interventionLab, which is a
// return value from the vendored intervention diagnostics engine. Nothing here
// fits a line, takes a logarithm of a radius or works out a skin. And every
// slope on this page is shown against the THRESHOLD it would be read against,
// because a slope with no boundary beside it is a number nobody can act on.

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
  ['fit', 'A raw history, and the line fitted through it in log space'],
  ['notproof', 'What a clean fit does not prove'],
  ['group', 'One group decides what a stimulation is worth'],
  ['floor', 'The floor a geometry allows, and what it refuses'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

// --------------------------------------------------------------------------

const Fit = () => {
  const data = useMemo(() => {
    try {
      return {
        head: diagnosticExplorer.headline(),
        fit: diagnosticExplorer.fullFit(),
        rows: diagnosticExplorer.fitRows(),
        samples: diagnosticExplorer.samples(),
        thresholds: diagnosticExplorer.thresholds(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.fit.ok) {
    return (
      <Note>
        A slope needs at least three samples whose time and whose ratio are both strictly positive.
        With a history that does not have them the measurement returns a refusal with a reason
        rather than a slope, and there is nothing to draw.
      </Note>
    );
  }
  const chart = data.rows.map((r) => ({
    tDays: r.tDays, ratio: r.ratio, fittedRatio: r.fittedRatio,
  }));
  const channelling = data.thresholds.find((t) => t.key === 'channellingSlope');
  return (
    <>
      <TileGrid>
        <Tile label="Samples handed to the fit" value={fmt(data.fit.handedIn, 0)} />
        <Tile label="Slope of the line, per log cycle" value={fmt(data.fit.slope, 6)} />
        <Tile label="Fit quality, as a fraction" value={fmt(data.fit.r2Fraction, 6)} />
        <Tile label="The history it sits on" value={fmt(data.fit.spanDecades, 6)} unit="log cycles" />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="tDays" type="number" scale="log" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'producing time, days', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis type="number" scale="log" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'water-oil ratio', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="ratio" name="the samples" stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="fittedRatio" name="the fitted line" stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        ONE CALL RETURNS ALL FOUR NUMBERS AND THIS PAGE READS THEM OFF IT, on the WHOLE history
        with no late window and no classifier anywhere near it. The slope is
        {' '}{fmt(data.fit.slope, 9)} per log cycle, the intercept is {fmt(data.fit.intercept, 9)},
        the fit quality is {fmt(data.fit.r2Fraction, 9)} as a fraction and
        {' '}{fmt(data.fit.r2Percent, 6)} as a percentage, and the span is
        {' '}{fmt(data.fit.spanDecades, 9)} log cycles. A log-log slope is d ln y over d ln x and
        carries NO UNIT AT ALL, so do not give it one. The intercept is a logarithm too: as a
        coefficient it is {tiny(data.fit.coefficientFromIntercept)}, which is the number the
        history is a power law in. The fit was handed {fmt(data.fit.handedIn, 0)} samples and used
        {' '}{fmt(data.fit.n, 0)}, dropping {fmt(data.fit.dropped, 0)}.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        AND THE SAME HISTORY FITTED ON ITS DERIVATIVE IS A DIFFERENT MEASUREMENT ON A DIFFERENT
        SET OF SAMPLES. The derivative fit returns a slope of {fmt(data.fit.derivativeSlope, 6)}
        {' '}against the channelling THRESHOLD of {fmt(channelling ? channelling.value : null, 2)},
        at a fit quality of {fmt(data.fit.derivativeR2Fraction, 6)} as a fraction, and it used
        {' '}{fmt(data.fit.derivativeN, 0)} of the {fmt(data.fit.derivativeHandedIn, 0)} samples it
        was handed, dropping {fmt(data.fit.derivativeDropped, 0)} whose derivative was not strictly
        positive, over {fmt(data.fit.derivativeSpanDecades, 6)} log cycles rather than
        {' '}{fmt(data.fit.spanDecades, 6)}. Two slopes, two point counts, two spans, one history.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">sample</th>
              <th className="text-left pr-3">time, days</th>
              <th className="text-left pr-3">water-oil ratio</th>
              <th className="text-left pr-3">derivative</th>
              <th className="text-left pr-3">the fitted line</th>
              <th className="text-left pr-3">residual in ln ratio</th>
              <th className="text-left">after the choke</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, i) => (
              <tr key={r.index}>
                <td className="pr-3">{fmt(r.index, 0)}</td>
                <td className="pr-3">{fmt(r.tDays, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.ratio, 9)}</td>
                <td className={data.samples[i].derivativeIsPositive ? 'pr-3' : 'pr-3 text-[#f97316]'}>{fmt(data.samples[i].derivative, 9)}</td>
                <td className="pr-3">{fmt(r.fittedRatio, 9)}</td>
                <td className="pr-3">{tiny(r.residualInLnRatio)}</td>
                <td>{yn(data.samples[i].afterTheChoke)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        {data.head.name} is a TEACHING case built by this course, not a real well and not a
        published one. It runs {fmt(data.head.sampleCount, 0)} samples from
        {' '}{fmt(data.head.firstDay, 0)} to {fmt(data.head.lastDay, 0)} days, the ratio climbs to
        a peak of {fmt(data.head.peakRatio, 6)} on day {fmt(data.head.lastDayBeforeTheChoke, 6)},
        the well is beaned back on day {fmt(data.head.chokedOnDay, 0)}, and the last
        {' '}{fmt(data.head.negativeDerivatives, 0)} samples fall. Everything on this page is that
        history read by the vendored engine. Never show it as real or as published.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const NotProof = () => {
  const data = useMemo(() => {
    try {
      return {
        power: diagnosticExplorer.powerLaw(),
        powerRows: diagnosticExplorer.powerLawRows(),
        drop: diagnosticExplorer.silentDrop(),
        refusals: diagnosticExplorer.refusals(),
        histories: diagnosticExplorer.publishedHistories(),
        verdicts: diagnosticExplorer.publishedVerdicts(),
        thresholds: diagnosticExplorer.thresholds(),
        oracle: diagnosticExplorer.oracle(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return (
      <Note>
        The published power law and the four published histories are shipped inside the engine
        package. With that package absent there is no case to fit and nothing to compare a fit
        against.
      </Note>
    );
  }
  const channelling = data.thresholds.find((t) => t.key === 'channellingSlope');
  const chart = data.histories.map((h) => ({
    name: h.name,
    derivativeSlope: h.derivativeSlope,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Published points on the power law" value={fmt(data.power.pointCount, 0)} />
        <Tile label="The engine slope less the published one" value={tiny(data.power.slopeDifference)} />
        <Tile label="Fit quality on it, as a fraction" value={fmt(data.power.engineR2Fraction, 9)} />
        <Tile label="Shortfall from a perfect fit" value={tiny(data.power.r2ShortfallFromPerfect)} />
      </TileGrid>
      <div className="mt-3 text-xs text-slate-300">
        A PERFECT FIT IS EVIDENCE ABOUT THE ARITHMETIC AND NOT ABOUT THE WELL. The published case
        is eleven points on a power law and the oracle commits the slope through them by
        THEIL-SEN, the median of every pairwise slope, which shares no mean, no square and no
        covariance with the engine least squares. The two routes agree at {fmt(data.power.publishedSlope, 9)}
        {' '}to a difference of {tiny(data.power.slopeDifference)} and the fit quality comes back
        at exactly {fmt(data.power.engineR2Fraction, 9)}. That is the gate, and it says the
        measurement is correct. It says nothing whatever about which mechanism a real history is
        showing.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">point</th>
              <th className="text-left pr-3">x</th>
              <th className="text-left pr-3">y</th>
              <th className="text-left pr-3">ln x</th>
              <th className="text-left pr-3">ln y</th>
              <th className="text-left">the fitted line</th>
            </tr>
          </thead>
          <tbody>
            {data.powerRows.map((r) => (
              <tr key={r.index}>
                <td className="pr-3">{fmt(r.index, 0)}</td>
                <td className="pr-3">{fmt(r.x, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.y, 9)}</td>
                <td className="pr-3">{fmt(r.lnX, 9)}</td>
                <td className="pr-3">{fmt(r.lnY, 9)}</td>
                <td>{fmt(r.fittedY, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-300">
        THE FILTER IS SILENT, AND THE COUNT IT RETURNS IS THE COUNT AFTER THE DROP. Hand the
        measurement {fmt(data.drop.handedIn, 0)} points of which {fmt(data.drop.dropped, 0)} are
        not strictly positive and it succeeds, returns n of {fmt(data.drop.nReturned, 0)} with a
        slope of {fmt(data.drop.slope, 6)} and a fit quality of {fmt(data.drop.r2Fraction, 6)}, and
        says nothing at all about what it threw away. The span it reports is
        {' '}{fmt(data.drop.reportedSpanDecades, 9)} log cycles against the
        {' '}{fmt(data.drop.handedSpanDecades, 9)} the points actually cover, so it understates the
        window by {fmt(data.drop.spanUnderstatedByDecades, 9)} of a log cycle. On a real history
        the samples that get dropped are the ones that argue the other way.
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="name" tick={AXIS} interval={0} height={40} />
            <YAxis tick={AXIS}
              label={{ value: 'derivative slope', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={channelling ? channelling.value : 1.3} stroke="#f97316" strokeDasharray="4 4" />
            <Bar dataKey="derivativeSlope" name="late derivative slope" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">published history</th>
              <th className="text-left pr-3">shape</th>
              <th className="text-left pr-3">derivative slope</th>
              <th className="text-left pr-3">fit quality, fraction</th>
              <th className="text-left pr-3">mechanism</th>
              <th className="text-left pr-3">confidence</th>
              <th className="text-left pr-3">close to the boundary</th>
              <th className="text-left">water shutoff</th>
            </tr>
          </thead>
          <tbody>
            {data.histories.map((h, i) => (
              <tr key={h.name}>
                <td className="pr-3">{h.name}</td>
                <td className="pr-3">{h.form}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(h.derivativeSlope, 9)}</td>
                <td className="pr-3">{fmt(h.derivativeR2Fraction, 9)}</td>
                <td className="pr-3">{h.mechanismLabel || 'none'}</td>
                <td className="pr-3">{h.confidence}</td>
                <td className="pr-3">{yn(h.ambiguous)}</td>
                <td className={data.verdicts[i].waterShutoffBlocked ? 'text-[#f97316]' : ''}>{data.verdicts[i].waterShutoffVerdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        FOUR HISTORIES, FOUR VERDICTS, AND NOT ONE OF THEM IS ASSERTED ANYWHERE. The golden
        publishes each history and a late derivative slope for it and stops. It names no expected
        mechanism, no expected confidence, no expected verdict and no expected block reason, so the
        mechanism column above is what the classifier says when nothing is checking it, and the
        last column is a shutoff squeeze recommended or refused on that. The functions with a
        golden are {data.oracle.functionsWithAGolden.join(', ')}. The functions with none at all
        are {data.oracle.functionsWithNoGoldenAtAll.join(', ')}. The only part of this module that
        returns a VERDICT is the part with no golden. Look at the displacement row: a derivative
        slope of exactly {fmt(data.histories[2].derivativeSlope, 6)} against the channelling
        THRESHOLD of {fmt(channelling ? channelling.value : null, 2)}, returned at
        {' '}{data.histories[2].confidence} confidence and flagged close to the boundary
        {' '}{yn(data.histories[2].ambiguous)}, on the case the oracle own docstring calls the one
        that genuinely needs the plot and a person.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">what was handed in</th>
              <th className="text-left pr-3">refused</th>
              <th className="text-left pr-3">points it kept</th>
              <th className="text-left">what it said</th>
            </tr>
          </thead>
          <tbody>
            {data.refusals.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3 text-[#f97316]">{yn(r.refused)}</td>
                <td className="pr-3">{fmt(r.n, 0)}</td>
                <td>{r.error || 'accepted'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        A clean fit proves that a line was drawn correctly through the samples that survived the
        filter. It does not prove that the samples that survived are the ones that matter, that the
        shape is a power law at all, or that the picture the slope suggests is the picture the
        reservoir is in. That is why every threshold in this engine is an explicit named input and
        why a reading close to one is reported as close to it rather than resolved.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Group = () => {
  const [which, setWhich] = useState('skin');
  const data = useMemo(() => {
    try {
      return {
        floor: diagnosticExplorer.publishedFloor(),
        drainage: diagnosticExplorer.drainage(),
        drainageHead: diagnosticExplorer.drainageHeadline(),
        denominator: diagnosticExplorer.denominator(),
        teaching: diagnosticExplorer.teachingGeometry(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return (
      <Note>
        The group needs a drainage radius, a wellbore radius and a skin, and it needs the drainage
        radius to be the larger of the two. Without that it returns a bare not-a-number rather than
        a denominator, which is a refusal a caller has to test for by hand.
      </Note>
    );
  }
  const chart = which === 'skin'
    ? data.denominator.map((r) => ({ x: r.skin, denominator: r.denominator, flowEfficiency: r.flowEfficiency }))
    : data.drainage.map((r) => ({ x: r.reFt, denominator: r.denominatorAtZeroSkin, flowEfficiency: null }));
  const label = which === 'skin' ? 'skin' : 'drainage radius, ft';
  return (
    <>
      <FieldGrid>
        <SelectField label="Sweep" value={which} onChange={setWhich}
          options={[
            ['skin', 'Skin, on the published geometry'],
            ['drainage', 'Drainage radius, which is a guess'],
          ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Published drainage radius" value={fmt(data.floor.reFt, 0)} unit="ft" />
          <Tile label="Published wellbore radius" value={fmt(data.floor.rwFt, 4)} unit="ft" />
          <Tile label="The logarithm of their ratio" value={fmt(data.floor.lnReOverRw, 9)} />
          <Tile label="The denominator at zero skin" value={fmt(data.floor.denominatorAtZeroSkin, 9)} />
        </TileGrid>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: label, position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'ln(re/rw) less 3/4 plus S', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="denominator" name="the denominator" stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        EVERYTHING ABOUT WHAT A STIMULATION IS WORTH COMES OUT OF ONE GROUP, because the
        productivity index is inversely proportional to it. The group is the logarithm of the
        radius ratio, less {fmt(data.floor.pssConstant, 2)}, plus the skin. The
        {' '}{fmt(data.floor.pssConstant, 2)} is the pseudo steady state constant for a circular drainage area;
        it is not a fudge and it is not adjustable. AND THE TWO INPUTS ARE NOT THE SAME KIND OF
        THING. A drainage radius is a GUESS, and the group takes its logarithm, so the guess is
        forgiven: moving it from {fmt(data.drainageHead.loReFt, 0)} ft to
        {' '}{fmt(data.drainageHead.hiReFt, 0)} ft, a factor of
        {' '}{fmt(data.drainageHead.foldChangeInDrainageRadius, 0)}, moves the denominator by only
        {' '}{fmt(data.drainageHead.denominatorMovesBy, 9)}. A skin is a MEASUREMENT, and the group
        adds it undivided: one unit of skin moves the denominator by exactly
        {' '}{fmt(data.drainageHead.oneUnitOfSkinMovesItBy, 0)}. Three units of skin outweigh a
        twentyfold error in the drainage radius.
      </div>
      {which === 'skin' ? (
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">skin</th>
                <th className="text-left pr-3">the denominator</th>
                <th className="text-left">flow efficiency against an undamaged well</th>
              </tr>
            </thead>
            <tbody>
              {data.denominator.map((r) => (
                <tr key={r.skin}>
                  <td className="pr-3">{fmt(r.skin, 2)}</td>
                  <td className="pr-3 text-[#BFFF00]">{fmt(r.denominator, 9)}</td>
                  <td>{fmt(r.flowEfficiency, 9)}</td>
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
                <th className="text-left pr-3">drainage radius, ft</th>
                <th className="text-left pr-3">wellbore radius, ft</th>
                <th className="text-left pr-3">the logarithm of their ratio</th>
                <th className="text-left pr-3">the denominator at zero skin</th>
                <th className="text-left pr-3">the floor this geometry allows</th>
                <th className="text-left">the published case</th>
              </tr>
            </thead>
            <tbody>
              {data.drainage.map((r) => (
                <tr key={r.reFt}>
                  <td className="pr-3">{fmt(r.reFt, 0)}</td>
                  <td className="pr-3">{fmt(r.rwFt, 4)}</td>
                  <td className="pr-3">{fmt(r.lnReOverRw, 9)}</td>
                  <td className="pr-3 text-[#BFFF00]">{fmt(r.denominatorAtZeroSkin, 9)}</td>
                  <td className="pr-3">{fmt(r.minimumSkin, 9)}</td>
                  <td>{yn(r.published)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Note>
        On the teaching well the drainage radius is {fmt(data.teaching.reFt, 0)} ft and the
        wellbore radius {fmt(data.teaching.rwFt, 4)} ft, so the group runs
        {' '}{fmt(data.teaching.lnReOverRw, 9)} less {fmt(data.floor.pssConstant, 2)} plus a skin of
        {' '}{fmt(data.teaching.skinBefore, 2)}, which is {fmt(data.teaching.denominatorAtSkin, 9)},
        against {fmt(data.teaching.denominatorAtZeroSkin, 9)} for the same well undamaged. That
        ratio is a flow efficiency of {fmt(data.teaching.flowEfficiency, 9)}: the well is making
        about half of what it could. Nothing on this page is an economics answer. A multiplier on
        the productivity index is not a barrel and it is not a dollar.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Floor = () => {
  const data = useMemo(() => {
    try {
      return {
        floor: diagnosticExplorer.publishedFloor(),
        drainage: diagnosticExplorer.drainage(),
        teaching: diagnosticExplorer.teachingGeometry(),
        refusals: diagnosticExplorer.geometryRefusals(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return (
      <Note>
        The floor needs the drainage radius to be larger than the wellbore radius and the wellbore
        radius to be above zero. Given anything else it returns a bare not-a-number, which is a
        refusal with no message and no flag on it.
      </Note>
    );
  }
  const chart = data.drainage.map((r) => ({ x: r.reFt, floor: r.minimumSkin }));
  return (
    <>
      <TileGrid>
        <Tile label="The published floor" value={fmt(data.floor.publishedMinimumSkin, 9)} />
        <Tile label="The engine floor" value={fmt(data.floor.engineMinimumSkin, 9)} />
        <Tile label="Difference from the published value" value={tiny(data.floor.difference)} />
        <Tile label="The teaching well floor" value={fmt(data.teaching.minimumSkin, 9)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'drainage radius, ft', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'the most negative skin allowed', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="floor" name="the floor a geometry allows" stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE FLOOR IS WHERE THE ARITHMETIC RUNS OUT, NOT WHERE THE WELL STOPS GETTING BETTER. At a
        skin of {fmt(data.floor.engineMinimumSkin, 9)} on the published geometry the denominator
        reaches zero and the productivity index goes INFINITE. That is not an aggressive design, it
        is a broken equation, and a screening tool that quietly returned a huge uplift there would
        be worse than useless. The engine floor and the published one agree to
        {' '}{tiny(data.floor.difference)}. Notice how little the floor moves: across a
        {' '}{fmt(data.drainage[data.drainage.length - 1].reFt / data.drainage[0].reFt, 0)}-fold
        change in drainage radius it runs from {fmt(data.drainage[0].minimumSkin, 6)} to
        {' '}{fmt(data.drainage[data.drainage.length - 1].minimumSkin, 6)}. It is a property of a
        geometry and barely a property of the guess inside it.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">drainage radius, ft</th>
              <th className="text-left pr-3">the floor</th>
              <th className="text-left pr-3">the denominator at zero skin</th>
              <th className="text-left">the published case</th>
            </tr>
          </thead>
          <tbody>
            {data.drainage.map((r) => (
              <tr key={r.reFt}>
                <td className="pr-3">{fmt(r.reFt, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.minimumSkin, 9)}</td>
                <td className="pr-3">{fmt(r.denominatorAtZeroSkin, 9)}</td>
                <td>{yn(r.published)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">what was handed in</th>
              <th className="text-left pr-3">refused</th>
              <th className="text-left pr-3">the answer is a finite number</th>
              <th className="text-left">how it refused</th>
            </tr>
          </thead>
          <tbody>
            {data.refusals.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3 text-[#f97316]">{yn(r.refused)}</td>
                <td className="pr-3">{yn(r.isFinite)}</td>
                <td>{r.contract}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        READ THE LAST COLUMN. Every one of these refuses as a BARE NOT-A-NUMBER, with no message
        and no flag, which is a different failure contract from the one the productivity multiplier
        uses on exactly the same bad geometry: that function returns an object carrying a reason. A
        caller who does not test every one of these results by hand cannot tell an answer from a
        refusal, and a not-a-number propagates silently through everything downstream of it. Real
        treatments reach about -3 to -5 on an acid job and -5 to -6 on a decent fracture, and the
        teaching geometry floor is {fmt(data.teaching.minimumSkin, 6)}. Everything between those is
        arithmetic the engine will accept without comment.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const DiagnosticExplorer = ({ initialMode = 'fit' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Diagnostic explorer"
      subtitle="The fit and the geometry, before any classifier is involved: a raw ratio history with the least squares line fitted through it in log space, what a clean fit does not prove, the pseudo steady state group that decides what a stimulation is worth, and the floor a geometry allows"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'fit' && <Fit />}
        {mode === 'notproof' && <NotProof />}
        {mode === 'group' && <Group />}
        {mode === 'floor' && <Floor />}
      </div>
    </PanelShell>
  );
};

export default DiagnosticExplorer;
