import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot,
} from 'recharts';
import { remedyExplorer } from './gasWellLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Remedy explorer, the Expert tier. What the design hides or breaks.
//
// Five modes, one per finding.
//   seam      a correlation chosen once at the gauge and used everywhere,
//             including at the station that actually controls
//   discarded the sizing candidate the pick threw away, and the four answers
//             the same list gives under two correlations at two stations
//   gradient  a rounded 0.433 psi/ft per unit SG against rho g exactly, and
//             which one term of five carries it into the verdict
//   falling   the plunger gas requirement falling as the well weakens, the flag
//             that flips the wrong way, and the clamp at zero
//   nobody    what the screen never checks at all: the liquid the cycle carries
//             against the liquid the well makes, and two molecular weights of
//             air in one domain
//
// THE FALLING REQUIREMENT AND THE CLAMP ARE RECORDED OWNER DECISIONS, not
// defects this course fixes. The composite verdict still catches every case,
// because feasible is pressureOk and glrOk; what is wrong is the headline
// number an operator quotes, and it is wrong in the flattering direction.
//
// Every figure on this page is a return value from gasWellLab, which is a
// return value from the vendored engines.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const tiny = (v) => {
  if (!Number.isFinite(v)) return '-';
  if (v === 0) return '0';
  return Math.abs(v) < 0.0005 ? v.toExponential(3) : fmt(v, 10);
};

const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['seam', 'Chosen once at the gauge, used everywhere'],
  ['discarded', 'The candidate the sizing discarded'],
  ['gradient', 'A rounded constant, and the one term that carries it'],
  ['falling', 'A requirement that falls the wrong way, and a clamp at zero'],
  ['nobody', 'What nobody checks'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

// --------------------------------------------------------------------------

const Seam = () => {
  const data = useMemo(() => {
    try {
      return {
        rows: remedyExplorer.seam(),
        verdicts: remedyExplorer.seamVerdicts(),
        perStation: remedyExplorer.perStation(),
        mixed: remedyExplorer.mixedProfile(),
        mixedSummary: remedyExplorer.mixedSummary(),
        published: remedyExplorer.publishedSeam(),
        threshold: remedyExplorer.threshold(),
        labels: remedyExplorer.thresholdLabels(),
      };
    } catch { return null; }
  }, []);
  const [view, setView] = useState('rates');
  if (!data || !data.rows.length) {
    return <Note>The recommendation takes ONE pressure and returns guidance rather than a decision. It does not switch the correlation for anybody and it cannot see which station the pressure came from, so with no station to read there is no seam to price.</Note>;
  }
  const { rows, verdicts, perStation, mixed, mixedSummary, published } = data;
  return (
    <>
      <FieldGrid>
        <SelectField label="Show" value={view} onChange={setView}
          options={[
            ['rates', 'What the choice is worth, in Mscf/d'],
            ['verdicts', 'What the choice is worth, in verdicts'],
            ['mixed', 'Choosing per station instead'],
          ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Chosen at the wellhead" value={perStation[0].correlation} />
          <Tile label="At the wellhead pressure of" value={fmt(perStation[0].pPsia, 1)} unit="psia" />
          <Tile label="The controlling station would choose" value={perStation[perStation.length - 1].correlation} />
          <Tile label="At its pressure of" value={fmt(perStation[perStation.length - 1].pPsia, 1)} unit="psia" />
          <Tile label="Coleman margin for the well" value={fmt(verdicts.coleman.marginPct, 8)} unit="%" />
          <Tile label="Turner margin for the well" value={fmt(verdicts.turner.marginPct, 8)} unit="%" />
          <Tile label="Verdicts differ at" value={verdicts.disagreeAtDepthsFt.length ? verdicts.disagreeAtDepthsFt.map((d) => fmt(d, 0)).join(', ') : 'no'} unit="ft" />
          <Tile label="Both name the controlling station" value={fmt(verdicts.coleman.controllingDepthFt, 0)} unit="ft" />
        </TileGrid>
      </div>
      {view === 'rates' ? (
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
              {GRID}
              <XAxis dataKey="depthFt" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
                label={{ value: 'depth, ft', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={AXIS} domain={['auto', 'auto']}
                label={{ value: 'critical rate, Mscf/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="colemanCriticalRateMscfd" name="Coleman, chosen at the gauge"
                stroke="#38bdf8" dot isAnimationActive={false} />
              <Line type="monotone" dataKey="turnerCriticalRateMscfd" name="Turner, the same equation times 1.2"
                stroke="#BFFF00" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
      {view === 'verdicts' ? (
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
              {GRID}
              <XAxis dataKey="depthFt" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
                label={{ value: 'depth, ft', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={AXIS} domain={['auto', 'auto']}
                label={{ value: 'ratio', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 10)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={1} stroke="#f472b6" strokeDasharray="4 3" />
              <Line type="monotone" dataKey="colemanRatio" name="under Coleman" stroke="#38bdf8" dot isAnimationActive={false} />
              <Line type="monotone" dataKey="turnerRatio" name="under Turner" stroke="#BFFF00" dot isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
      {view === 'mixed' ? (
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mixed} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
              {GRID}
              <XAxis dataKey="depthFt" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
                label={{ value: 'depth, ft', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={AXIS} domain={['auto', 'auto']}
                label={{ value: 'critical rate, Mscf/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="criticalRateMscfd" name="each station under the correlation its own pressure selects"
                stroke="#f97316" dot isAnimationActive={false} />
              <ReferenceDot x={mixedSummary.correlationChangesAtDepthFt}
                y={mixedSummary.rateAfterStepMscfd} r={5} fill="#f472b6" stroke="none" isFront />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">depth, ft</th>
              <th className="text-left pr-3">pressure, psia</th>
              <th className="text-left pr-3">Coleman rate, Mscf/d</th>
              <th className="text-left pr-3">Turner rate, Mscf/d</th>
              <th className="text-left pr-3">difference, Mscf/d</th>
              <th className="text-left pr-3">Coleman ratio</th>
              <th className="text-left pr-3">Turner ratio</th>
              <th className="text-left pr-3">verdicts agree</th>
              <th className="text-left">asked here it would return</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.depthFt} className={r.verdictsAgree ? '' : 'text-[#f97316]'}>
                <td className="pr-3">{fmt(r.depthFt, 1)}</td>
                <td className="pr-3">{fmt(r.pPsia, 1)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.colemanCriticalRateMscfd, 9)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.turnerCriticalRateMscfd, 9)}</td>
                <td className="pr-3">{fmt(r.rateDifferenceMscfd, 9)}</td>
                <td className="pr-3">{fmt(r.colemanRatio, 10)}</td>
                <td className="pr-3">{fmt(r.turnerRatio, 10)}</td>
                <td className="pr-3">{yn(r.verdictsAgree)}</td>
                <td>{perStation[i].correlation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        TURNER IS COLEMAN PLUS TWENTY PERCENT, so the choice is worth twenty percent of EVERY critical
        rate the study goes on to compute, at every station, exactly. It was made at the gauge, from
        one pressure, by a function that cannot see which station that pressure came from. Ask the
        same function at every station and it does not give the same answer back: two stations here
        return {perStation[0].correlation} and the rest return{' '}
        {perStation[perStation.length - 1].correlation}. Nothing in the module refuses that, warns
        about it, or offers a recommendation that takes the controlling station.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        CHOOSING PER STATION IS NOT THE FIX EITHER. Under the mixed reading the shallowest loading
        station moves from {fmt(mixedSummary.shippedShallowestLoadingDepthFt, 0)} ft to{' '}
        {fmt(mixedSummary.mixedShallowestLoadingDepthFt, 0)} ft, and the critical rate stops rising
        smoothly: at {fmt(mixedSummary.correlationChangesAtDepthFt, 0)} ft it jumps from{' '}
        {fmt(mixedSummary.rateBeforeStepMscfd, 9)} to {fmt(mixedSummary.rateAfterStepMscfd, 9)}{' '}
        Mscf/d. That step is an artefact of where the correlation changed and not a property of the
        well.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        ON A PUBLISHED STATION, so this is not a teaching-well artefact: the Coleman rate is{' '}
        {fmt(published.colemanRateMscfd, 9)} Mscf/d and the Turner rate is{' '}
        {fmt(published.turnerRateMscfd, 9)} Mscf/d, {fmt(published.differenceMscfd, 9)} Mscf/d apart.
        A well making exactly the Coleman rate at that station is loading under Turner, at a ratio of{' '}
        {fmt(published.ratioUnderTurner, 10)}.
      </div>
      <Note>{data.labels.withLabel}</Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Discarded = () => {
  const data = useMemo(() => {
    try {
      return {
        cmp: remedyExplorer.sizingComparison(),
        cost: remedyExplorer.stationCost(),
        coleman: remedyExplorer.sizingRows('coleman', 'controlling'),
        turner: remedyExplorer.sizingRows('turner', 'controlling'),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.coleman.length) {
    return <Note>A sizing returns one answer out of a list it was given. With no list there is no pick and no rejection, and the function says so rather than returning a null that reads like a finding.</Note>;
  }
  const { cmp, cost, coleman, turner } = data;
  const merged = coleman.map((r, i) => ({
    idIn: r.idIn,
    colemanRatio: r.ratio,
    turnerRatio: turner[i].ratio,
    colemanRateMscfd: r.criticalRateMscfd,
    turnerRateMscfd: turner[i].criticalRateMscfd,
    flips: r.unloads !== turner[i].unloads,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Coleman pick" value={fmt(cmp.colemanPickIdIn, 3)} unit="in" />
        <Tile label="Its ratio under Coleman" value={fmt(cmp.colemanPickRatio, 10)} />
        <Tile label="Turner pick" value={fmt(cmp.turnerPickIdIn, 3)} unit="in" />
        <Tile label="Its ratio under Turner" value={fmt(cmp.turnerPickRatio, 10)} />
        <Tile label="THE DISCARDED CANDIDATE" value={fmt(cmp.discardedIdIn, 3)} unit="in" />
        <Tile label="It reads, under Coleman" value={fmt(cmp.discardedRatioUnderColeman, 10)} />
        <Tile label="And under Turner" value={fmt(cmp.discardedRatioUnderTurner, 10)} />
        <Tile label="A loss of" value={fmt(cmp.discardedRatioLossPct, 6)} unit="%" />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[...merged].reverse()} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="idIn" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'candidate inside diameter, in', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'ratio', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 10)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'clears one', fill: '#f472b6', fontSize: 10, position: 'insideTopLeft' }} />
            <Line type="monotone" dataKey="colemanRatio" name="under Coleman" stroke="#38bdf8" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="turnerRatio" name="under Turner" stroke="#BFFF00" dot isAnimationActive={false} />
            <ReferenceDot x={cmp.discardedIdIn} y={cmp.discardedRatioUnderColeman} r={5} fill="#f97316" stroke="none" isFront />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">candidate, in</th>
              <th className="text-left pr-3">Coleman rate, Mscf/d</th>
              <th className="text-left pr-3">Coleman ratio</th>
              <th className="text-left pr-3">Turner rate, Mscf/d</th>
              <th className="text-left pr-3">Turner ratio</th>
              <th className="text-left">the verdict changes</th>
            </tr>
          </thead>
          <tbody>
            {merged.map((r) => (
              <tr key={r.idIn} className={r.flips ? 'text-[#f97316]' : ''}>
                <td className="pr-3">{fmt(r.idIn, 3)}</td>
                <td className="pr-3">{fmt(r.colemanRateMscfd, 9)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.colemanRatio, 10)}</td>
                <td className="pr-3">{fmt(r.turnerRateMscfd, 9)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.turnerRatio, 10)}</td>
                <td>{yn(r.flips)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        ONE CANDIDATE OUT OF NINE CHANGES ITS VERDICT, and it is the one the Coleman run picked. The
        twenty percent lands in the denominator, so the ratio falls by one sixth rather than rising by
        a fifth, and a candidate sitting two thousandths above one comes back sixteen percent under
        it. Nothing in the returned object says the pick was a function of a correlation chosen
        somewhere else, and nothing in it says which station it was evaluated at either.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">station</th>
              <th className="text-left pr-3">correlation</th>
              <th className="text-left pr-3">pick, in</th>
              <th className="text-left pr-3">its ratio</th>
              <th className="text-left">the station is worth, in</th>
            </tr>
          </thead>
          <tbody>
            {cost.perCorrelation.map((r) => (
              <React.Fragment key={r.correlation}>
                <tr>
                  <td className="pr-3">the controlling station</td>
                  <td className="pr-3">{r.correlation}</td>
                  <td className="pr-3 text-[#BFFF00]">{fmt(r.controllingPickIdIn, 3)}</td>
                  <td className="pr-3">{fmt(r.controllingPickRatio, 10)}</td>
                  <td className="pr-3">{fmt(r.stationWorthIn, 3)}</td>
                </tr>
                <tr className="text-[#f97316]">
                  <td className="pr-3">the wellhead</td>
                  <td className="pr-3">{r.correlation}</td>
                  <td className="pr-3">{fmt(r.wellheadPickIdIn, 3)}</td>
                  <td className="pr-3">{fmt(r.wellheadPickRatio, 10)}</td>
                  <td className="pr-3">{fmt(r.stationWorthIn, 3)}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        FOUR RUNS OF ONE LIST, AND TWO OF THEM PICK THE SAME STRING FROM OPPOSITE ERRORS. Sized at
        this well's wellhead the function returns {fmt(cost.wellheadSizingPickIdIn, 3)} in against a
        current string of {fmt(cost.currentStringIdIn, 3)} in, so it reports that no workover is
        needed. The current string reads {fmt(cost.currentStringRatioAtWellhead, 10)} at the gauge and{' '}
        {fmt(cost.currentStringRatioAtControlling, 10)} at the station that controls, on a well
        loading over the bottom {fmt(cost.loadingOverBottomPct, 4)} percent of its tubing. The
        controlling profile point already carries the pressure, temperature, compressibility factor
        and diameter so it can be handed straight in. Nothing makes a caller do it.
      </div>
      <Note>
        And ok is TRUE on the wrong station, because the sizing that was asked for was answerable and
        was answered. A boolean that reports whether a question could be evaluated says nothing about
        whether it was the right question.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Gradient = () => {
  const data = useMemo(() => {
    try {
      return {
        g: remedyExplorer.gradient(),
        slugs: remedyExplorer.gradientSlugs(),
        terms: remedyExplorer.liftTerms(),
        column: remedyExplorer.gasColumn(),
      };
    } catch { return null; }
  }, []);
  if (!data) return <Note>A hydrostatic needs a gradient, and this domain carries three different numbers for one column of water. With none of them there is no slug term and no lift pressure to build.</Note>;
  const { g, slugs, terms, column } = data;
  return (
    <>
      <TileGrid>
        <Tile label="1000 kg/m3 times g" value={fmt(g.paPerMetre, 6)} unit="Pa/m" />
        <Tile label="Times metres per foot" value={fmt(g.paPerFt, 6)} unit="Pa/ft" />
        <Tile label="Over pascals per psi" value={fmt(g.exactPsiPerFtSg, 13)} unit="psi/ft per unit SG" />
        <Tile label="The engine ships" value={fmt(g.shippedPsiPerFtSg, 13)} unit="psi/ft per unit SG" />
        <Tile label="Exact minus shipped" value={fmt(g.difference, 13)} />
        <Tile label="Exact over shipped" value={fmt(g.exactOverShipped, 13)} />
        <Tile label="The rounding, as a share of the exact value" value={fmt(g.roundingPctOfExact, 10)} unit="%" />
        <Tile label="A third value in the same domain, 62.4 over 144" value={fmt(g.sixtyTwoPointFourOver144, 13)} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={slugs} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="slugLengthFt" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'slug length, ft', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="c" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'cost, psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="p" orientation="right" tick={AXIS} domain={[0, 0.25]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 10)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="c" type="monotone" dataKey="costPsi" name="the cost in psi, which grows with the slug"
              stroke="#f97316" dot isAnimationActive={false} />
            <Line yAxisId="p" type="monotone" dataKey="costPct" name="the cost as a percentage, which does not move at all"
              stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">slug, ft</th>
              <th className="text-left pr-3">specific gravity</th>
              <th className="text-left pr-3">through the shipped constant, psi</th>
              <th className="text-left pr-3">through the exact gradient, psi</th>
              <th className="text-left pr-3">cost, psi</th>
              <th className="text-left">cost, percent</th>
            </tr>
          </thead>
          <tbody>
            {slugs.map((r) => (
              <tr key={r.slugLengthFt}>
                <td className="pr-3">{fmt(r.slugLengthFt, 1)}</td>
                <td className="pr-3">{fmt(r.liquidSg, 3)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.roundedPsi, 10)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.exactPsi, 10)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.costPsi, 10)}</td>
                <td>{fmt(r.costPct, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">term of the published lift balance</th>
              <th className="text-left pr-3">psi</th>
              <th className="text-left pr-3">built from the rounded constant</th>
              <th className="text-left">what it is</th>
            </tr>
          </thead>
          <tbody>
            {terms.map((t) => (
              <tr key={t.term} className={t.builtFromTheConstant ? 'text-[#f97316]' : ''}>
                <td className="pr-3">{t.term}</td>
                <td className="pr-3">{fmt(t.psi, 10)}</td>
                <td className="pr-3">{yn(t.builtFromTheConstant)}</td>
                <td>{t.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        ONE TERM OF FIVE CARRIES IT, AND NOTHING CANCELS. The oracle that cut the goldens used rho g
        exactly and published {fmt(g.goldenSlugPsi, 10)} psi for its own slug; the engine returns{' '}
        {fmt(g.engineSlugPsi, 10)} psi, a gap of {fmt(g.costOnPublishedSlugPsi, 10)} psi that carries
        whole into the required lift pressure and is then compared against a casing pressure built
        from nothing at all. THIS IS NOT A TOLERANCE PROBLEM. It is one constant against another, a
        fixed {fmt(g.roundingPctOfExact, 6)} percent, and no amount of refinement removes a
        difference between two formulations. The gate knows: it pins the shipped constant exactly and
        loosens that single slug assertion to a relative tolerance{' '}
        {fmt(g.gateSlackFactor, 6)} times the disagreement it is covering.
      </div>
      <Note>
        And the same term hides a second unstated choice. The gas column is carried over{' '}
        {fmt(column.heightFt, 0)} ft at the LINE pressure, which gives {fmt(column.atLinePsi, 10)}{' '}
        psi. Carried at the pressure at the top of the slug it gives {fmt(column.atSlugTopPsi, 10)}{' '}
        psi, and at the average of the two, {fmt(column.atAveragePsi, 10)} psi. A defensible choice
        stated is worth more than a better choice left implicit, and a reader cannot judge the choice
        without the spread of {fmt(column.spreadPsi, 10)} psi.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Falling = () => {
  const data = useMemo(() => {
    try {
      return {
        rows: remedyExplorer.casingSweep(),
        head: remedyExplorer.casingHeadline(),
        published: remedyExplorer.publishedCasingSweep(),
        clamp: remedyExplorer.clamp(),
        clampTerms: remedyExplorer.clampTerms(),
        zero: remedyExplorer.clampZero(),
        top: remedyExplorer.clampTop(),
        check: remedyExplorer.clampCheck(),
        refusal: remedyExplorer.clampRefusal(),
      };
    } catch { return null; }
  }, []);
  const [view, setView] = useState('requirement');
  if (!data || !data.rows.length) {
    return <Note>The gas a cycle needs is an expansion from the casing pressure down to the pressure still needed at the top of the rise. With no casing pressure there is no expansion to compute, and the screen refuses the inputs it cannot read.</Note>;
  }
  const { rows, head, published, clamp, clampTerms, zero, top, check, refusal } = data;
  return (
    <>
      <FieldGrid>
        <SelectField label="Show" value={view} onChange={setView}
          options={[
            ['requirement', 'The gas requirement against casing pressure'],
            ['clamp', 'The longest slug the well can lift, and the clamp'],
          ]} />
      </FieldGrid>
      {view === 'requirement' ? (
        <>
          <div className="mt-3">
            <TileGrid>
              <Tile label="Required lift, fixed throughout" value={fmt(head.requiredPsiaFixed, 10)} unit="psia" />
              <Tile label="The well makes" value={fmt(head.wellGlrScfBbl, 1)} unit="scf/bbl" />
              <Tile label={`At ${fmt(head.highCasingPsia, 0)} psia of casing it asks`} value={fmt(head.highRequiredGlrScfBbl, 8)} unit="scf/bbl" />
              <Tile label={`At ${fmt(head.lowCasingPsia, 0)} psia it asks`} value={fmt(head.lowRequiredGlrScfBbl, 8)} unit="scf/bbl" />
              <Tile label="A fall of" value={fmt(head.dropScfBbl, 8)} unit="scf/bbl" />
              <Tile label="Which is" value={fmt(head.dropPct, 6)} unit="%" />
              <Tile label="glrOk at the strong end" value={yn(head.highGlrOk)} />
              <Tile label="glrOk at the dead end" value={yn(head.lowGlrOk)} />
            </TileGrid>
          </div>
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...rows].reverse()} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
                {GRID}
                <XAxis dataKey="casingPressurePsia" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
                  label={{ value: 'casing pressure, psia', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={AXIS} domain={['auto', 'auto']}
                  label={{ value: 'required gas-liquid ratio, scf/bbl', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={head.wellGlrScfBbl} stroke="#38bdf8" strokeDasharray="4 3"
                  label={{ value: 'what the well makes', fill: '#38bdf8', fontSize: 10, position: 'insideTopRight' }} />
                <ReferenceLine x={head.requiredPsiaFixed} stroke="#f472b6" strokeDasharray="4 3"
                  label={{ value: 'the plunger stops moving here', fill: '#f472b6', fontSize: 10, position: 'top' }} />
                <Line type="monotone" dataKey="requiredGlrScfBbl" name="what the screen says a cycle needs"
                  stroke="#f97316" dot isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">casing, psia</th>
                  <th className="text-left pr-3">gas per cycle, scf</th>
                  <th className="text-left pr-3">required ratio, scf/bbl</th>
                  <th className="text-left pr-3">casing less requirement, psi</th>
                  <th className="text-left pr-3">expansion runs the right way</th>
                  <th className="text-left pr-3">pressureOk</th>
                  <th className="text-left pr-3">glrOk</th>
                  <th className="text-left">feasible</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.casingPressurePsia} className={r.expansionRunsTheRightWay ? '' : 'text-[#f97316]'}>
                    <td className="pr-3">{fmt(r.casingPressurePsia, 1)}</td>
                    <td className="pr-3">{fmt(r.gasPerCycleScf, 8)}</td>
                    <td className="pr-3 text-[#BFFF00]">{fmt(r.requiredGlrScfBbl, 8)}</td>
                    <td className="pr-3">{fmt(r.casingMinusRequirementPsi, 8)}</td>
                    <td className="pr-3">{yn(r.expansionRunsTheRightWay)}</td>
                    <td className="pr-3">{yn(r.pressureOk)}</td>
                    <td className="pr-3">{yn(r.glrOk)}</td>
                    <td>{yn(r.feasible)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-slate-300">
            READ THAT SWEEP IN TWO HALVES. Above the crossing the fall is defensible: less casing
            pressure genuinely means less gas expanded per cycle, and feasible turns true over that
            band because the requirement really did drop under what the well makes. Below the
            crossing, the highlighted rows, there is no expansion at all. The gas number is the
            average of two ends with no check that they are the right way round, so the average just
            keeps falling, and glrOk turns TRUE on a well that cannot move the plunger. Every step of
            that is in the flattering direction.
          </div>
          <div className="mt-3 text-xs text-slate-300">
            feasible STILL CATCHES BOTH ENDS, because it is pressureOk and glrOk, so nothing ships a
            wrong composite verdict today. That is one flag covering for another by arithmetic rather
            than by design, and the headline number an operator actually quotes is the inverted one.
            THIS IS A RECORDED OWNER DECISION, not a defect to fix from here. The guard that is
            missing is one line: refuse the gas number when the casing pressure is at or below the
            lift requirement, rather than averaging across the crossing.
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">the same shape on the published case, casing psia</th>
                  <th className="text-left pr-3">required ratio, scf/bbl</th>
                  <th className="text-left pr-3">pressureOk</th>
                  <th className="text-left pr-3">glrOk</th>
                  <th className="text-left">feasible</th>
                </tr>
              </thead>
              <tbody>
                {published.map((r) => (
                  <tr key={r.casingPressurePsia}>
                    <td className="pr-3">{fmt(r.casingPressurePsia, 1)}</td>
                    <td className="pr-3 text-[#BFFF00]">{fmt(r.requiredGlrScfBbl, 8)}</td>
                    <td className="pr-3">{yn(r.pressureOk)}</td>
                    <td className="pr-3">{yn(r.glrOk)}</td>
                    <td>{yn(r.feasible)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Note>
            The well gas-liquid ratio on that published run is a DERIVED figure chosen to straddle the
            requirement. Everything else is the published input set.
          </Note>
        </>
      ) : (
        <>
          <div className="mt-3">
            <TileGrid>
              <Tile label="The plunger weight term" value={fmt(clampTerms.plungerPsi, 10)} unit="psi" />
              <Tile label="Gas density at line pressure" value={fmt(clampTerms.rhoGasLbFt3, 10)} unit="lbm/ft3" />
              <Tile label="So the gas column costs" value={fmt(clampTerms.gasPsiPerFt, 12)} unit="psi/ft" />
              <Tile label="Net cost of a foot of slug" value={fmt(clampTerms.netPsiPerFtOfSlug, 12)} unit="psi/ft" />
            </TileGrid>
          </div>
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...clamp].reverse()} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
                {GRID}
                <XAxis dataKey="casingPressurePsia" type="number" tick={AXIS} domain={['dataMin', 1000]}
                  label={{ value: 'casing pressure, psia', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={AXIS} domain={['auto', 'auto']}
                  label={{ value: 'slug length, ft', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 8)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={0} stroke="#f472b6" strokeDasharray="4 3" />
                <Line type="monotone" dataKey="unclampedFt" name="the solution the balance actually has"
                  stroke="#38bdf8" strokeDasharray="5 3" dot isAnimationActive={false} />
                <Line type="monotone" dataKey="returnedFt" name="what maxSlugLengthFt returns"
                  stroke="#BFFF00" dot isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">casing, psia</th>
                  <th className="text-left pr-3">available, psi</th>
                  <th className="text-left pr-3">unclamped solution, ft</th>
                  <th className="text-left pr-3">returned, ft</th>
                  <th className="text-left">clamped</th>
                </tr>
              </thead>
              <tbody>
                {clamp.map((r) => (
                  <tr key={r.casingPressurePsia} className={r.clamped ? 'text-[#f97316]' : ''}>
                    <td className="pr-3">{fmt(r.casingPressurePsia, 1)}</td>
                    <td className="pr-3">{fmt(r.availablePsi, 8)}</td>
                    <td className="pr-3 text-[#38bdf8]">{fmt(r.unclampedFt, 8)}</td>
                    <td className="pr-3 text-[#BFFF00]">{fmt(r.returnedFt, 8)}</td>
                    <td>{yn(r.clamped)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-slate-300">
            WHAT ZERO ACTUALLY MEANS. At the casing pressures where this returns zero, the balance
            with NO SLUG AT ALL still is not satisfied:{' '}
            {zero.map((r) => `at ${fmt(r.casingPressurePsia, 1)} psia it still needs ${fmt(r.bareBalanceRequiredPsia, 10)} psia and is short by ${fmt(r.shortByPsi, 10)} psi`).join(', ')}
            . So zero is not the longest slug this well can lift. It is a refusal wearing a number,
            and a caller reading it as an answer would size a cycle on it. The upper clamp has the
            same shape: at {fmt(top.casingPressurePsia, 1)} psia the function returns{' '}
            {fmt(top.returnedFt, 8)} ft, which is the tubing length rather than a computed maximum.
          </div>
          <div className="mt-3 text-xs text-slate-300">
            AND THE FUNCTION ALREADY KNOWS HOW TO REFUSE. Handed {refusal.label} it returns NaN rather
            than a clamped number. One refusal and two clamps sit in one function for one kind of
            question. Where the clamp does not bite the solve is exact: at{' '}
            {fmt(check.maxSlugFt, 8)} ft the required lift comes back to{' '}
            {fmt(check.requiredAtMaxPsia, 10)} psia against a casing of{' '}
            {fmt(check.casingPressurePsia, 1)} psia, a residual of {tiny(check.residualPsi)} psi, and
            that slug holds {fmt(check.slugVolumeBbl, 8)} bbl.
          </div>
          <Note>
            A clamp is not an answer, and zero is a number. This is a recorded owner decision and not
            a defect to fix from here; what a reader owes it is to check the sign of the unclamped
            solution before quoting the returned one.
          </Note>
        </>
      )}
    </>
  );
};

// --------------------------------------------------------------------------

const Nobody = () => {
  const data = useMemo(() => {
    try {
      return {
        capacity: remedyExplorer.capacity(),
        sweep: remedyExplorer.shutInSweep(),
        published: remedyExplorer.publishedCapacity(),
        slow: remedyExplorer.slowCycle(),
        air: remedyExplorer.air(),
        refusals: remedyExplorer.refusals(),
      };
    } catch { return null; }
  }, []);
  if (!data || !data.sweep.length) {
    return <Note>The screen computes a liquid rate per day and never compares it to anything. With no cycle to time there is no liquid rate, and with no well rate beside it there is nothing the comparison could have been made against.</Note>;
  }
  const { capacity, sweep, published, slow, air } = data;
  return (
    <>
      <TileGrid>
        <Tile label="The cycle delivers" value={fmt(capacity.liquidPerCycleBbl, 10)} unit="bbl per trip" />
        <Tile label="Trips a day" value={fmt(capacity.cyclesPerDay, 8)} />
        <Tile label="liquidPerDayBbl" value={fmt(capacity.liquidPerDayBbl, 8)} unit="bbl/d" />
        <Tile label="The well makes" value={fmt(capacity.wellLiquidBpd, 8)} unit="bbl/d" />
        <Tile label="The well over the cycle" value={fmt(capacity.wellOverCycle, 8)} />
        <Tile label="The shortfall" value={fmt(capacity.shortfallBpd, 8)} unit="bbl/d" />
        <Tile label="pressureOk" value={yn(capacity.pressureOk)} />
        <Tile label="glrOk" value={yn(capacity.glrOk)} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[...sweep].reverse()} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="shutInMin" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'shut-in, min, with no afterflow', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'liquid, bbl/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 8)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={capacity.wellLiquidBpd} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'what the well makes', fill: '#f472b6', fontSize: 10, position: 'insideTopRight' }} />
            <Line type="monotone" dataKey="liquidPerDayBbl" name="what the cycle carries"
              stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">shut-in, min</th>
              <th className="text-left pr-3">cycle, min</th>
              <th className="text-left pr-3">trips a day</th>
              <th className="text-left pr-3">liquid a day, bbl/d</th>
              <th className="text-left pr-3">the well makes, bbl/d</th>
              <th className="text-left pr-3">the well over the cycle</th>
              <th className="text-left">carries the well</th>
            </tr>
          </thead>
          <tbody>
            {sweep.map((r) => (
              <tr key={r.shutInMin}>
                <td className="pr-3">{fmt(r.shutInMin, 1)}</td>
                <td className="pr-3">{fmt(r.totalMin, 8)}</td>
                <td className="pr-3">{fmt(r.cyclesPerDay, 8)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.liquidPerDayBbl, 8)}</td>
                <td className="pr-3 text-slate-500">{fmt(r.wellLiquidBpd, 8)}</td>
                <td className="pr-3">{fmt(r.ratio, 8)}</td>
                <td className="text-[#f97316]">{yn(r.carriesTheWell)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE THIRD STEP THE SCREEN NEVER TAKES. liquidPerDayBbl is computed, returned, and compared to
        nothing. feasible is built from the pressure balance and the gas-liquid ratio only, and it
        carries these keys: {capacity.designKeys.join(', ')}. Every ingredient for the comparison is
        already in that list: the cycle's liquid rate is there, and the well's gas-liquid ratio is
        there beside it. Even cycling with no afterflow and no shut-in at all, the installation as
        specified stays behind this well's own liquid make, and nothing in the return says so.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE SAME READING ON THE PUBLISHED CASE: the cycle carries{' '}
        {fmt(published.liquidPerDayBbl, 8)} bbl/d against a well liquid make of{' '}
        {fmt(published.wellLiquidBpd, 8)} bbl/d, a factor of {fmt(published.ratio, 8)}, with
        pressureOk = {yn(published.pressureOk)}, glrOk = {yn(published.glrOk)} and feasible ={' '}
        {yn(published.feasible)}. The liquid comparison appears nowhere in that verdict either.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE ONLY TIMING CHECK THERE IS FIRES ON TRIPS A DAY AND NOT ON BARRELS. Push the shut-in to{' '}
        {fmt(slow.shutInMin, 1)} min and the cycle runs to {fmt(slow.totalMin, 8)} min at{' '}
        {fmt(slow.cyclesPerDay, 8)} trips a day, and the warning raised is: {slow.message}
      </div>
      <div className="mt-3 text-xs text-slate-300">
        AND TWO MOLECULAR WEIGHTS OF AIR SIT IN ONE DOMAIN. At {fmt(air.pPsia, 1)} psia and{' '}
        {fmt(air.tempR, 1)} degR the same gas is {fmt(air.rhoLoading, 10)} lbm/ft3 through one module
        and {fmt(air.rhoProperties, 10)} through the other, {tiny(air.rhoGap)} lbm/ft3 apart, because
        one carries {fmt(air.airMwLoading, 4)} and the other {fmt(air.airMwProperties, 4)} on the same
        gas constant. Nothing in this course turns on {fmt(air.mwGapPpm, 4)} parts per million. It is
        recorded because it is a duplicated named constant carrying two values, which is how larger
        disagreements start, and because a reader comparing the two modules cannot tell which is
        intended. The same seam has a units half: one module takes degrees Rankine at the door and the
        other degrees Fahrenheit, with no shared door between them.
      </div>
      <Note>
        WHAT THESE MODULES REFUSE TO DO: {data.refusals.slice(-4).join(' ')}
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const RemedyExplorer = () => {
  const [mode, setMode] = useState('seam');
  return (
    <PanelShell
      title="Remedy explorer"
      subtitle="What a deliquification study hides or breaks: a correlation chosen once and used everywhere, the sizing candidate that was discarded, a rounded gradient constant, a gas requirement that falls the wrong way, and the checks nobody performs"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'seam' && <Seam />}
        {mode === 'discarded' && <Discarded />}
        {mode === 'gradient' && <Gradient />}
        {mode === 'falling' && <Falling />}
        {mode === 'nobody' && <Nobody />}
      </div>
    </PanelShell>
  );
};

export default RemedyExplorer;
