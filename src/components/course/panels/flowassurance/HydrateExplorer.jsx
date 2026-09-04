import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import { hydrateExplorer } from './flowAssuranceLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Hydrate explorer, the Expert tier. The boundary and the chemical.
//
// Six modes. The Joule-Thomson term damped against undamped and the verdict it
// flips, the ground resistance that is caught and dropped rather than refused,
// the reference nobody accepts priced on a consumer, the two depression
// relations side by side on the published table, a dose sized with one of them
// and checked with the other, and the ceilings and conventions that do not
// travel.
//
// Every figure on this page is a return value from flowAssuranceLab, which is
// a return value from the two vendored engines. Nothing here computes a
// depression, an arrival, a U or an injection rate. The one thing the lab does
// that neither engine offers, the inverse of Nielsen-Bucklin, is a bracket on
// the engine's own forward function and is labelled as one.

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
  ['jt', 'Joule-Thomson, damped against undamped'],
  ['trench', 'A ground term caught and dropped rather than refused'],
  ['reference', 'The reference nobody accepts, priced on a consumer'],
  ['depression', 'Two relations for one depression'],
  ['dose', 'Sized one way, checked another'],
  ['ceiling', 'Ceilings and conventions that do not travel'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

// --------------------------------------------------------------------------

const JouleThomson = () => {
  const data = useMemo(() => {
    try {
      return {
        akaso: hydrateExplorer.akaso(),
        jt: hydrateExplorer.jouleThomson(),
        lengths: hydrateExplorer.jtLengths(),
        below: hydrateExplorer.belowSeabed(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>The Joule-Thomson coefficient is an INPUT and so are both pressures. With none of the three set the term is exactly zero and there is nothing here to read, which is the case in every published golden.</Note>;
  }
  const chart = data.lengths.map((r) => ({
    x: r.lengthFt,
    heat: r.heatLossOnlyArrivalTempF,
    engine: r.engineJtArrivalTempF,
    damped: r.dampedJtArrivalTempF,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Pressure drop" value={fmt(data.jt.pressureDropPsi, 1)} unit="psi" />
        <Tile label="Joule-Thomson coefficient, an input" value={fmt(data.jt.jtCoeffFPerPsi, 4)} unit="degF/psi" />
        <Tile label="ntu on this line" value={fmt(data.jt.ntu, 10)} />
        <Tile label="The damping factor the balance asks for" value={fmt(data.jt.dampingFactor, 10)} />
        <Tile label="Arrival, heat loss only" value={fmt(data.jt.heatLossOnlyArrivalTempF, 8)} unit="degF" />
        <Tile label="Arrival, the engine with the term on" value={fmt(data.jt.engineJtArrivalTempF, 8)} unit="degF" />
        <Tile label="Arrival, the same term damped" value={fmt(data.jt.dampedJtArrivalTempF, 8)} unit="degF" />
        <Tile label="Spurious cooling" value={fmt(data.jt.spuriousCoolingF, 8)} unit="degF" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">reading</th>
              <th className="text-left pr-3">arrival, degF</th>
              <th className="text-left pr-3">margin against the boundary, degF</th>
              <th className="text-left">inside the hydrate region</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-3">heat loss only, no pressures set</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(data.jt.heatLossOnlyArrivalTempF, 8)}</td>
              <td className="pr-3">{fmt(data.jt.heatLossOnlyMarginF, 8)}</td>
              <td>no</td>
            </tr>
            <tr className="text-[#f97316]">
              <td className="pr-3">the engine, term applied undamped</td>
              <td className="pr-3">{fmt(data.jt.engineJtArrivalTempF, 8)}</td>
              <td className="pr-3">{fmt(data.jt.engineJtMarginF, 8)}</td>
              <td>{yn(data.jt.engineSaysInsideTheHydrateRegion)}</td>
            </tr>
            <tr>
              <td className="pr-3">the same term damped by the balance</td>
              <td className="pr-3 text-[#38bdf8]">{fmt(data.jt.dampedJtArrivalTempF, 8)}</td>
              <td className="pr-3">{fmt(data.jt.dampedJtMarginF, 8)}</td>
              <td>{yn(data.jt.dampedSaysInsideTheHydrateRegion)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE VERDICT FLIPS: {yn(data.jt.verdictFlips)}. The engine writes the arrival as the
        exponential approach to ambient minus the coefficient times the whole pressure drop, and its
        header justifies carrying the term linearly as what a linear pressure profile implies. It
        does not. A linear pressure profile implies a CONSTANT cooling sink per foot, and a constant
        sink inside an exponentially relaxing line integrates to a SATURATING offset rather than a
        linear one. The engine therefore over-applies the cooling by the ratio of the ntu to the
        excess the line has already given up, which on this line is
        {' '}{fmt(data.jt.dampingFactor, 10)}: it is one on a short line and unbounded on a long
        one. The undamped drop is {fmt(data.jt.engineJtDropF, 8)} degF where the damped drop is
        {' '}{fmt(data.jt.dampedJtDropF, 8)}.
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'line length, ft', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'arrival temperature, degF', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={data.akaso.hydrateFlowingF} stroke="#f97316" strokeDasharray="4 3" />
            <ReferenceLine y={data.akaso.seabedTempF} stroke="#38bdf8" strokeDasharray="4 3" />
            <Line type="monotone" dataKey="heat" name="heat loss only" stroke="#94a3b8" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="engine" name="the engine, term undamped" stroke="#f97316" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="damped" name="the same term damped" stroke="#BFFF00" strokeDasharray="5 3" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">length, ft</th>
              <th className="text-left pr-3">ntu</th>
              <th className="text-left pr-3">damping factor</th>
              <th className="text-left pr-3">engine arrival, degF</th>
              <th className="text-left pr-3">damped arrival, degF</th>
              <th className="text-left pr-3">spurious cooling, degF</th>
              <th className="text-left">arrival below the seabed</th>
            </tr>
          </thead>
          <tbody>
            {data.lengths.map((r) => (
              <tr key={r.lengthFt} className={r.arrivalBelowSeabed ? 'text-[#f97316]' : ''}>
                <td className="pr-3">{fmt(r.lengthFt, 0)}{r.isTheTeachingLength ? ' (this line)' : ''}</td>
                <td className="pr-3">{fmt(r.ntu, 8)}</td>
                <td className="pr-3">{fmt(r.dampingFactor, 8)}</td>
                <td className="pr-3">{fmt(r.engineJtArrivalTempF, 8)}</td>
                <td className="pr-3">{fmt(r.dampedJtArrivalTempF, 8)}</td>
                <td className="pr-3">{fmt(r.spuriousCoolingF, 8)}</td>
                <td>{yn(r.arrivalBelowSeabed)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        AND IT COLLIDES WITH THE MODULE'S OWN PHYSICS. Push the same line to
        {' '}{fmt(data.below.lengthMultipleOfTheTeachingLine, 0)} times its length and the profile
        returns ok {yn(data.below.profileOk)} with an arrival of
        {' '}{fmt(data.below.engineJtArrivalTempF, 8)} degF against a
        {' '}{fmt(data.below.seabedTempF, 1)} degF seabed, which is
        {' '}{fmt(data.below.belowSeabedByF, 8)} degF BELOW the water it is losing heat to. Hand
        that exact temperature to the inverse in the same file as a target and it refuses:
        {' '}{data.below.inverseReason} The damped reading on the same line arrives at
        {' '}{fmt(data.below.dampedJtArrivalTempF, 8)} degF, above the seabed, which is where a
        cooling line has to end up.
      </div>
      <Note>
        Every number in this view is on a TEACHING LINE, and every hydrate temperature on it is a
        LABORATORY INPUT the engine never computes. No published golden sets a pressure anywhere, so
        the oracle that cut the goldens has never seen this term at any value but zero.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Trench = () => {
  const [which, setWhich] = useState('published');
  const data = useMemo(() => {
    try {
      return {
        published: hydrateExplorer.droppedTrench(),
        teaching: hydrateExplorer.akasoSwallowedTrench(),
        asymmetry: hydrateExplorer.refusalAsymmetry(),
        akaso: hydrateExplorer.akaso(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>The ground resistance has no real value when the burial is shallower than half the coated diameter, which is the input class this view exists to follow.</Note>;
  }
  const d = which === 'published' ? data.published : data.teaching;
  return (
    <>
      <FieldGrid>
        <SelectField label="Which pipe" value={which} onChange={setWhich}
          options={[
            ['published', 'The published pipe, a three foot trench entered as a third of one'],
            ['teaching', `${data.akaso.name}, a TEACHING line with a larger coated diameter`],
          ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Trench that was meant" value={fmt(d.intendedBurialFt, 4)} unit="ft" />
          <Tile label="Trench as it was entered" value={fmt(d.typoBurialFt, 4)} unit="ft" />
          <Tile label="Half the coated diameter" value={fmt(which === 'published' ? d.halfDiameterFt : d.halfCoatedDiameterFt, 8)} unit="ft" />
          <Tile label="Terms with the trench" value={fmt(d.withTermCount, 0)} />
          <Tile label="Terms without it" value={fmt(d.droppedTermCount, 0)} />
          <Tile label="U with the term" value={fmt(d.withTermUBtuHrFt2F, 10)} unit="Btu/(hr ft2 degF)" />
          <Tile label="U with the term dropped" value={fmt(d.droppedTermUBtuHrFt2F, 10)} unit="Btu/(hr ft2 degF)" />
          <Tile label="Error in U" value={fmt(d.uErrorPct, 6)} unit="percent" />
        </TileGrid>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">what the call returned</th>
              <th className="text-left pr-3">ok</th>
              <th className="text-left pr-3">a burial term is present</th>
              <th className="text-left pr-3">a note</th>
              <th className="text-left">U, Btu/(hr ft2 degF)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-3">the trench that was meant</td>
              <td className="pr-3">yes</td>
              <td className="pr-3">yes</td>
              <td className="pr-3">none needed</td>
              <td className="text-[#BFFF00]">{fmt(d.withTermUBtuHrFt2F, 10)}</td>
            </tr>
            <tr className="text-[#f97316]">
              <td className="pr-3">the same trench with a decimal point moved</td>
              <td className="pr-3">{yn(d.droppedTermOk)}</td>
              <td className="pr-3">{yn(d.droppedTermHasBurial)}</td>
              <td className="pr-3">{d.droppedTermNote === null ? 'none' : d.droppedTermNote}</td>
              <td>{fmt(d.droppedTermUBtuHrFt2F, 10)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {which === 'published' && (
        <div className="mt-3 text-xs text-slate-300">
          THE BURIED ANSWER AND THE EXPOSED ANSWER ARE THE SAME NUMBER. The no-burial build of the
          same pipe returns {fmt(d.exposedBuildUBtuHrFt2F, 10)}, identical to the swallowed result
          to {tiny(d.droppedAgainstExposedRelDiff)} relative. Nothing in the return says a trench
          was asked for, and the ground carried {fmt(d.withTermGroundSharePct, 6)} percent of the
          correct stack.
        </div>
      )}
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">one input class, two treatments</th>
              <th className="text-left pr-3">refused</th>
              <th className="text-left">what it said</th>
            </tr>
          </thead>
          <tbody>
            {data.asymmetry.map((r) => (
              <tr key={r.label} className={r.refused ? '' : 'text-[#f97316]'}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{yn(r.refused)}</td>
                <td>{r.error || 'nothing at all'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE GUARD IS IN THE WRONG PLACE. The ground resistance is checked for being a real number
        BEFORE it is pushed onto the list, so the term never reaches the refusal three lines later
        that catches an unresolvable layer. A term that cannot be computed is not a term worth zero.
        The same file states the discipline in as many words on its conductivity helper: a
        not-a-number propagates into a refusal, and a plausible wrong number does not. Here the
        not-a-number is caught and swallowed, and what comes back is a plausible wrong number.
      </div>
      <Note>
        A U most of a factor too high with ok true is the cleanest fails open in this module: the
        answer is not merely wrong, it is wrong in the optimistic direction, because a line that
        loses heat faster on paper than it does in the trench would have been designed with less
        insulation than it needs.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Reference = () => {
  const data = useMemo(() => {
    try {
      return {
        rows: hydrateExplorer.mixedReference(),
        headline: hydrateExplorer.mixedReferenceHeadline(),
        akasoPair: hydrateExplorer.akasoReferencePair(),
        akasoFoam: hydrateExplorer.akasoFoamRemoved(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A U value and the diameter it is referred to have to travel together, and none of the three consumers in this module accepts the pair.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="Consumers that accept a reference" value={fmt(data.headline.consumersThatAcceptAReference, 0)} />
        <Tile label="Consumers that take a bare diameter" value={fmt(data.headline.consumersThatTakeABareIdIn, 0)} />
        <Tile label="Ratio of the two references" value={fmt(data.headline.diameterRatio, 10)} />
        <Tile label="Relaxation length error from mixing them" value={fmt(data.headline.relaxationErrorPct, 6)} unit="percent" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">length, ft</th>
              <th className="text-left pr-3">route</th>
              <th className="text-left pr-3">correct</th>
              <th className="text-left pr-3">relaxation length, ft</th>
              <th className="text-left pr-3">ntu</th>
              <th className="text-left pr-3">arrival, degF</th>
              <th className="text-left">arrival error, degF</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, i) => (
              <tr key={`${r.lengthFt}-${i}`} className={r.correct ? '' : 'text-[#f97316]'}>
                <td className="pr-3">{fmt(r.lengthFt, 0)}</td>
                <td className="pr-3">{r.route}</td>
                <td className="pr-3">{yn(r.correct)}</td>
                <td className="pr-3">{fmt(r.relaxationLengthFt, 6)}</td>
                <td className="pr-3">{fmt(r.ntu, 8)}</td>
                <td className="pr-3">{fmt(r.arrivalTempF, 8)}</td>
                <td>{fmt(r.arrivalErrorF, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE TWO CORRECT ROUTES AGREE EXACTLY, because the U and the diameter both carry the same
        reference and the reference cancels. The mixed route is dimensionally consistent, raises no
        complaint anywhere, and is wrong on the relaxation length by
        {' '}{fmt(data.headline.relaxationErrorPct, 6)} percent, which is the reference ratio and
        nothing else. Its cost in degF depends on where the line already sits on its own
        exponential: the worst of these three lengths is
        {' '}{fmt(data.headline.worstArrivalErrorF, 8)} degF at
        {' '}{fmt(data.headline.worstAtLengthFt, 0)} ft.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        THE SAME PAIR ON THE TEACHING LINE, whose coated outside diameter is further from its bore:
        the two U values are {fmt(data.akasoPair.boreUBtuHrFt2F, 10)} and
        {' '}{fmt(data.akasoPair.coatedUBtuHrFt2F, 10)}, a ratio of
        {' '}{fmt(data.akasoPair.uRatio, 10)} against a diameter ratio of
        {' '}{fmt(data.akasoPair.diameterRatio, 10)}, and the product of each U with its own
        reference in feet is the same number both ways at
        {' '}{fmt(data.akasoPair.boreUTimesIdFt, 10)}.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        AND A SHARE MOVES WHEN NOTHING ABOUT ITS OWN TERM MOVED. Take the foam out of the teaching
        line and carry the weight coat straight from the steel to the same outside diameter: the
        trench resistance does not change at all, at
        {' '}{fmt(data.akasoFoam.trenchResistanceWithFoam, 10)} and
        {' '}{fmt(data.akasoFoam.trenchResistanceWithoutFoam, 10)}, and its share goes from
        {' '}{fmt(data.akasoFoam.trenchSharePctWithFoam, 6)} percent to
        {' '}{fmt(data.akasoFoam.trenchSharePctWithoutFoam, 6)} percent while the overall U rises by
        a factor of {fmt(data.akasoFoam.uRatio, 8)}.
      </div>
      <Note>
        The module header calls mixing two references the commonest mistake in a flow assurance hand
        calculation, and it duly returns the reference it used. Then the three functions that
        consume a U each take a bare diameter and none of them can see it. The seam the module names
        is left open in the module's own interface.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Depression = () => {
  const [inhibitorId, setInhibitorId] = useState('methanol');
  const data = useMemo(() => {
    try {
      return {
        golden: hydrateExplorer.goldenInhibition(),
        rows: hydrateExplorer.depressionRows(inhibitorId),
        line: hydrateExplorer.reliableLine('methanol'),
        inhibitors: hydrateExplorer.inhibitors(),
        fallback: hydrateExplorer.unknownInhibitor(),
      };
    } catch { return null; }
  }, [inhibitorId]);
  if (!data) {
    return <Note>A depression needs a weight percent in the AQUEOUS phase and a molecular weight, and the module refuses a concentration at or above a hundred percent because there would be no water left to depress.</Note>;
  }
  const goldenRows = data.golden.filter((r) => r.inhibitorId === inhibitorId);
  const chart = goldenRows.map((r) => ({
    w: r.weightPct, ham: r.engineHammerschmidtF, nb: r.engineNielsenBucklinF,
  }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Inhibitor" value={inhibitorId} onChange={setInhibitorId}
          options={data.inhibitors.map((i) => [i.id, `${i.label}, molecular weight ${fmt(i.molecularWeight, 2)}`])} />
      </FieldGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="w" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'inhibitor in the aqueous phase, weight percent', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'depression, degF', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={data.line.reliableWtPct} stroke="#f97316" strokeDasharray="4 3" />
            <Line type="monotone" dataKey="ham" name="Hammerschmidt, in weight percent" stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="nb" name="Nielsen-Bucklin, in mole fraction" stroke="#38bdf8" strokeDasharray="5 3" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">weight percent</th>
              <th className="text-left pr-3">Hammerschmidt, the oracle</th>
              <th className="text-left pr-3">Hammerschmidt, the engine</th>
              <th className="text-left pr-3">the two are</th>
              <th className="text-left pr-3">Nielsen-Bucklin, the oracle</th>
              <th className="text-left pr-3">Nielsen-Bucklin, the engine</th>
              <th className="text-left">the two are</th>
            </tr>
          </thead>
          <tbody>
            {goldenRows.map((r) => (
              <tr key={r.weightPct}>
                <td className="pr-3">{fmt(r.weightPct, 1)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.goldenHammerschmidtF, 8)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.engineHammerschmidtF, 8)}</td>
                <td className="pr-3">{tiny(r.hammerschmidtRelDiff)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.goldenNielsenBucklinF, 8)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.engineNielsenBucklinF, 8)}</td>
                <td>{tiny(r.nielsenBucklinRelDiff)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        NOTE THE TWO RELATIVE DIFFERENCES. The oracle computed both relations in CELSIUS with the
        metric constants and converted the answers, so the field constants the engine carries have
        to fall out of the metric ones. Nielsen-Bucklin does, to machine precision. Hammerschmidt
        does not, and the residual is the constant rather than the arithmetic.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">weight percent</th>
              <th className="text-left pr-3">Hammerschmidt, degF</th>
              <th className="text-left pr-3">Nielsen-Bucklin, degF</th>
              <th className="text-left pr-3">recommended, degF</th>
              <th className="text-left pr-3">basis</th>
              <th className="text-left pr-3">reliable</th>
              <th className="text-left">published case</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.weightPct} className={r.reliable ? '' : 'text-[#f97316]'}>
                <td className="pr-3">{fmt(r.weightPct, 1)}</td>
                <td className="pr-3">{fmt(r.hammerschmidtF, 8)}</td>
                <td className="pr-3">{r.nielsenBucklinF === null ? 'no relation for this fluid' : fmt(r.nielsenBucklinF, 8)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.recommendedF, 8)}</td>
                <td className="pr-3">{r.basis}</td>
                <td className="pr-3">{yn(r.reliable)}</td>
                <td>{yn(r.published)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-slate-300">
        THE RELIABLE LINE IS NOT WHERE THE TWO RELATIONS START TO DISAGREE. At the line itself the
        engine already reports {fmt(data.line.hammerschmidtF, 8)} degF against
        {' '}{fmt(data.line.nielsenBucklinF, 8)}, a spread of {fmt(data.line.spreadF, 8)} degF and
        {' '}{fmt(data.line.spreadPctOfHammerschmidt, 6)} percent, with reliable
        {' '}{yn(data.line.reliable)} beside it. A thousandth of a weight percent past it the basis
        changes and the recommended depression jumps by
        {' '}{fmt(data.line.recommendedJumpF, 8)} degF, although neither relation moved at all.
      </div>
      <Note>
        For a glycol Nielsen-Bucklin is null, because it was developed for methanol and using it on
        MEG because Hammerschmidt ran out would be substituting one wrong answer for another. The
        module says so in a note instead. An unknown inhibitor id, by contrast, FALLS BACK: asking
        for {data.fallback.askedFor} returns {data.fallback.returnedLabel}.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Dose = () => {
  const [inhibitorId, setInhibitorId] = useState('methanol');
  const data = useMemo(() => {
    try {
      return {
        req: hydrateExplorer.requirement(inhibitorId),
        nielsen: hydrateExplorer.nielsenSized(inhibitorId),
        seam: hydrateExplorer.moleFractionSeam(),
        sweep: hydrateExplorer.shortfallSweep(),
        fluids: hydrateExplorer.oneNeedFourFluids(),
        missing: hydrateExplorer.missingSubcooling(),
        refusals: hydrateExplorer.injectionRefusals(),
      };
    } catch { return null; }
  }, [inhibitorId]);
  if (!data) {
    return <Note>A fluid already outside the hydrate region needs nothing, and that is returned as a real answer rather than as a rate of zero dressed up as a design.</Note>;
  }
  const r = data.req;
  return (
    <>
      <FieldGrid>
        <SelectField label="Inhibitor" value={inhibitorId} onChange={setInhibitorId}
          options={[
            ['methanol', 'Methanol, which has a check'],
            ['meg', 'MEG, which has no check at all'],
          ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Subcooling to kill, a teaching input" value={fmt(r.subcoolingF, 2)} unit="degF" />
          <Tile label="Safety margin" value={fmt(r.safetyMarginF, 2)} unit="degF" />
          <Tile label="Depression asked for" value={fmt(r.neededDepressionF, 2)} unit="degF" />
          <Tile label="Concentration it designed" value={fmt(r.designWtPct, 10)} unit="weight percent" />
          <Tile label="Sized depression, Hammerschmidt" value={fmt(r.sizedDepressionF, 10)} unit="degF" />
          <Tile label="Delivered depression, Nielsen-Bucklin" value={fmt(r.deliveredDepressionF, 10)} unit="degF" />
          <Tile label="Shortfall against what was asked" value={fmt(r.shortfallF, 10)} unit="degF" />
          <Tile label="It returned ok" value={yn(r.ok)} />
        </TileGrid>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">field of the same returned object</th>
              <th className="text-left pr-3">value</th>
              <th className="text-left">what it means</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-3">neededDepressionF</td>
              <td className="pr-3">{fmt(r.neededDepressionF, 8)}</td>
              <td>the subcooling plus the margin, in degF</td>
            </tr>
            <tr>
              <td className="pr-3">weightPct</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(r.designWtPct, 10)}</td>
              <td>picked by inverting Hammerschmidt, so its Hammerschmidt depression is exact</td>
            </tr>
            <tr>
              <td className="pr-3">depressionCheck.hammerschmidtF</td>
              <td className="pr-3">{fmt(r.sizedDepressionF, 10)}</td>
              <td>the relation it SIZED with, agreeing with itself</td>
            </tr>
            <tr className="text-[#f97316]">
              <td className="pr-3">depressionCheck.nielsenBucklinF</td>
              <td className="pr-3">{r.engineCheckNielsenBucklinF === null ? 'null, there is no check at all' : fmt(r.engineCheckNielsenBucklinF, 10)}</td>
              <td>the relation it CHECKED with, and nothing compares it back</td>
            </tr>
            <tr>
              <td className="pr-3">depressionCheck.recommendedF</td>
              <td className="pr-3">{fmt(r.engineRecommendedF, 10)}</td>
              <td>on basis {r.engineBasis}, reliable {yn(r.engineReliable)}</td>
            </tr>
            <tr>
              <td className="pr-3">rate.rateBpd</td>
              <td className="pr-3">{fmt(r.rateBpd, 8)}</td>
              <td>{fmt(r.leanWtPct, 1)} weight percent lean into {fmt(r.waterRateBpd, 1)} bbl/d of water</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE DOSE PASSES ITS OWN CHECK WHILE MISSING ITS OWN TARGET. The chain inside one call is
        that the concentration is picked by inverting Hammerschmidt, the check is then run on that
        concentration, the check decides the concentration is above the reliable line and reports
        Nielsen-Bucklin as the recommended depression, and nothing compares that back to what was
        asked for. The design is
        {' '}{fmt(r.shortfallF, 8)} degF short of the depression ordered and
        {' '}{fmt(r.shortfallAgainstBareSubcoolingF, 8)} degF short of the BARE subcooling before
        any margin, which means the line is still inside the hydrate region:
        {' '}{yn(r.shortOfTheBareSubcooling)}. The evidence is sitting in an adjacent field of the
        same return value.
      </div>
      {r.thereIsNoCheckAtAll && (
        <div className="mt-2 text-xs text-slate-300">
          AND FOR THIS FLUID THERE IS NO CHECK AT ALL. Nielsen-Bucklin is null, the basis stays
          Hammerschmidt, and the recommended depression is
          {' '}{fmt(r.engineRecommendedF, 8)} degF, which is exactly what was ordered, so the design
          reads as delivering it. Run Nielsen-Bucklin on that same concentration by hand through the
          module's own function and it gives {fmt(r.handRunNielsenBucklinF, 10)} degF. The module
          could check the glycol and does not.
        </div>
      )}
      <div className="mt-2 text-xs text-slate-300">
        THE TWO DOSES SIT AT THE SAME MOLE FRACTION. For one wanted depression the Hammerschmidt
        inverse fixes the inhibitor to water mole ratio and nothing else, so the methanol dose at
        {' '}{fmt(data.seam.methanolWtPct, 8)} weight percent and the MEG dose at
        {' '}{fmt(data.seam.megWtPct, 8)} weight percent land on mole fractions
        {' '}{fmt(data.seam.methanolMoleFraction, 12)} and
        {' '}{fmt(data.seam.megMoleFraction, 12)}, {tiny(data.seam.moleFractionDifference)} apart,
        and therefore on the same Nielsen-Bucklin depression to the last figure.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">sized by</th>
              <th className="text-left pr-3">weight percent</th>
              <th className="text-left pr-3">what the check then says, degF</th>
              <th className="text-left">injection rate, bbl/d</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-3">the Hammerschmidt inverse, which is what the engine does</td>
              <td className="pr-3">{fmt(data.nielsen.hammerschmidtSizedWtPct, 10)}</td>
              <td className="pr-3 text-[#f97316]">{fmt(r.deliveredDepressionF, 8)}</td>
              <td>{fmt(data.nielsen.hammerschmidtSizedRateBpd, 8)}</td>
            </tr>
            <tr>
              <td className="pr-3">bracketing the engine's own Nielsen-Bucklin instead</td>
              <td className="pr-3">{fmt(data.nielsen.nielsenBucklinSizedWtPct, 10)}</td>
              <td className="pr-3 text-[#BFFF00]">{fmt(data.nielsen.checkAtTheNielsenDoseF, 8)}</td>
              <td>{fmt(data.nielsen.nielsenBucklinSizedRateBpd, 8)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-slate-300">
        Sizing on the relation the engine trusts up there costs
        {' '}{fmt(data.nielsen.wtPctDifference, 8)} more weight percent and
        {' '}{fmt(data.nielsen.extraRateBpd, 8)} bbl/d, which is
        {' '}{fmt(data.nielsen.extraRatePct, 6)} percent more inhibitor. The module offers a closed
        form inverse of Hammerschmidt and no inverse of Nielsen-Bucklin at all, so the second row is
        a BRACKET on the engine's own forward function rather than a second correlation.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">depression asked for, degF</th>
              <th className="text-left pr-3">design, weight percent</th>
              <th className="text-left pr-3">basis of the check</th>
              <th className="text-left pr-3">delivered, degF</th>
              <th className="text-left pr-3">short by, degF</th>
              <th className="text-left pr-3">short by, percent of the need</th>
              <th className="text-left">ok</th>
            </tr>
          </thead>
          <tbody>
            {data.sweep.map((r) => (
              <tr key={r.neededDepressionF} className={r.accepted ? '' : 'text-[#f97316]'}>
                <td className="pr-3">{fmt(r.neededDepressionF, 1)}</td>
                <td className="pr-3">{fmt(r.designWtPct, 8)}</td>
                <td className="pr-3">{r.basis || 'refused before any check'}</td>
                <td className="pr-3">{fmt(r.deliveredDepressionF, 8)}</td>
                <td className="pr-3">{fmt(r.shortfallF, 8)}</td>
                <td className="pr-3">{fmt(r.shortfallPctOfNeed, 6)}</td>
                <td>{yn(r.ok)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-slate-300">
        READ THAT SWEEP IN TWO HALVES. Below the reliability line the check reports the SAME
        relation the dose was sized with, so the shortfall reads as exactly zero and the check has
        proved nothing at all. Above it the check switches relation, the shortfall appears in one
        step and then grows monotonically, and ok stays true through every row but the last. The
        last row is not refused for being short by the most. It is refused for asking a
        concentration past the practical ceiling, and sorting that table by shortfall leaves the
        refusal exactly where it is.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">fluid</th>
              <th className="text-left pr-3">molecular weight</th>
              <th className="text-left pr-3">design, weight percent</th>
              <th className="text-left pr-3">mole fraction</th>
              <th className="text-left pr-3">Nielsen-Bucklin by hand, degF</th>
              <th className="text-left">what the check RETURNS</th>
            </tr>
          </thead>
          <tbody>
            {data.fluids.map((r) => (
              <tr key={r.inhibitorId} className={r.thereIsNoCheckAtAll ? 'text-[#f97316]' : ''}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.molecularWeight, 3)}</td>
                <td className="pr-3">{fmt(r.designWtPct, 8)}</td>
                <td className="pr-3">{fmt(r.moleFraction, 14)}</td>
                <td className="pr-3">{fmt(r.handRunNielsenBucklinF, 10)}</td>
                <td>{r.engineCheckNielsenBucklinF === null ? 'null, no check at all' : fmt(r.engineCheckNielsenBucklinF, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-slate-300">
        FOUR DIFFERENT CONCENTRATIONS, ONE MOLE FRACTION, ONE IDENTICAL CHECK. The Hammerschmidt
        inverse fixes the inhibitor to water mole ratio, and that ratio contains no molecular weight
        at all once every fluid in the catalogue carries the same constant. The stated reason for
        suppressing the check on the glycols is that Nielsen-Bucklin was developed for methanol, and
        the arithmetic does not support it: the number being suppressed is the one it already
        computed for the fourth fluid. A reader who sees a glycol design come back with a null check
        should not conclude it was validated some other way. It was not validated at all.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        AND A SUBCOOLING NOBODY SUPPLIED FAILS OPEN. The guard is a test that the need is greater
        than zero, which is true for a not-a-number, so the branch written for a fluid already
        outside the hydrate region also catches a call where nobody said where the fluid is. It
        returns ok {yn(data.missing.ok)} and required {yn(data.missing.required)}, exactly as the
        real answer does, and its note prints the words not a number to a user:
        {' '}{data.missing.noteMentionsNotANumber ? 'yes' : 'no'}. From ok and required alone the
        two are indistinguishable: {yn(data.missing.theTwoAreIndistinguishableFromOkAndRequired)}.
      </div>
      <Note>
        {data.refusals.map((x) => `${x.label}: ok ${yn(x.ok)}`).join('; ')}. Every temperature here
        is a TEACHING input on a TEACHING line, and the subcooling itself is the distance inside a
        hydrate boundary neither engine computes.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Ceiling = () => {
  const [which, setWhich] = useState('ceiling');
  const data = useMemo(() => {
    try {
      return {
        ceiling: hydrateExplorer.ceiling('methanol'),
        refusal: hydrateExplorer.ceilingRefusal(),
        leans: hydrateExplorer.leanBlend('methanol'),
        akasoLeans: hydrateExplorer.akasoLeanBlend(),
        constants: hydrateExplorer.hammerschmidtConstants(),
        dilute: hydrateExplorer.diluteLimit(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>The Hammerschmidt inverse is asymptotic to a hundred percent, so it will happily return a concentration for a subcooling nothing can actually kill. The ceiling exists to stop that, and where the ceiling is measured is the question this view asks.</Note>;
  }
  return (
    <>
      <FieldGrid>
        <SelectField label="Which convention" value={which} onChange={setWhich}
          options={[
            ['ceiling', 'The concentration ceiling, and the coordinates it is measured in'],
            ['lean', 'The lean strength, a weight percent on one line and a volume percent on the next'],
            ['constants', 'Three values of one constant'],
          ]} />
      </FieldGrid>
      {which === 'ceiling' && (
        <>
          <div className="mt-3">
            <TileGrid>
              <Tile label="The practical ceiling" value={fmt(data.ceiling.maxPracticalWtPct, 1)} unit="weight percent" />
              <Tile label="Hammerschmidt depression there" value={fmt(data.ceiling.hammerschmidtAtCeilingF, 8)} unit="degF" />
              <Tile label="Nielsen-Bucklin depression there" value={fmt(data.ceiling.nielsenBucklinAtCeilingF, 8)} unit="degF" />
              <Tile label="The band between them" value={fmt(data.ceiling.bandF, 8)} unit="degF" />
              <Tile label="As a share of the Hammerschmidt figure" value={fmt(data.ceiling.bandPctOfHammerschmidt, 6)} unit="percent" />
              <Tile label="Concentration Nielsen-Bucklin would need for the same depression" value={fmt(data.ceiling.ceilingInNielsenBucklinWtPct, 8)} unit="weight percent" />
              <Tile label="The ceiling is measured in" value={data.ceiling.theCeilingIsMeasuredIn} />
              <Tile label="The check is measured in" value={data.ceiling.theCheckIsMeasuredIn} />
            </TileGrid>
          </div>
          <div className="mt-3 text-xs text-slate-300">
            THE REFUSAL BOUNDARY IS DRAWN IN THE COORDINATES OF THE OVER-PREDICTING RELATION. The
            requirement compares the ceiling against the concentration it got from the Hammerschmidt
            inverse, so it will accept and design for a stated subcooling anywhere up to
            {' '}{fmt(data.ceiling.hammerschmidtAtCeilingF, 8)} degF, while the deepest subcooling
            the ceiling concentration can actually kill, by the relation the module itself switches
            to up there, is {fmt(data.ceiling.nielsenBucklinAtCeilingF, 8)} degF. That is a
            {' '}{fmt(data.ceiling.bandF, 8)} degF band in which the engine designs and the
            chemistry does not deliver.
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <tbody>
                <tr>
                  <td className="pr-3">a subcooling just past the ceiling</td>
                  <td className="pr-3">{fmt(data.refusal.subcoolingF, 8)} degF</td>
                  <td className="pr-3 text-[#f97316]">ok {yn(data.refusal.ok)}</td>
                  <td>{data.refusal.error}</td>
                </tr>
                <tr>
                  <td className="pr-3">the concentration it printed</td>
                  <td className="pr-3">{data.refusal.printedToOneDecimal} to one decimal</td>
                  <td className="pr-3">{data.refusal.printedWhole} at whole percent</td>
                  <td>prints as the ceiling itself: {yn(data.refusal.printsAsTheCeiling)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-slate-300">
            ONE DECIMAL NARROWS A COLLISION BY TEN RATHER THAN CLOSING IT. At whole percent the
            refusal named the very limit its own concentration had just cleared, which reads as a
            refusal whose own numbers say nothing was exceeded.
          </div>
        </>
      )}
      {which === 'lean' && (
        <>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">lean strength, weight percent</th>
                  <th className="text-left pr-3">stream density the engine returns, lb/gal</th>
                  <th className="text-left pr-3">the mass additive blend, lb/gal</th>
                  <th className="text-left pr-3">engine rate, bbl/d</th>
                  <th className="text-left pr-3">mass additive rate, bbl/d</th>
                  <th className="text-left">rate low by, percent of the engine rate</th>
                </tr>
              </thead>
              <tbody>
                {data.leans.map((r) => (
                  <tr key={r.leanWtPct} className={r.isTheTeachingLean ? 'text-[#BFFF00]' : ''}>
                    <td className="pr-3">{fmt(r.leanWtPct, 1)}</td>
                    <td className="pr-3">{fmt(r.engineStreamDensityLbGal, 8)}</td>
                    <td className="pr-3">{fmt(r.massAdditiveDensityLbGal, 8)}</td>
                    <td className="pr-3">{fmt(r.engineRateBpd, 8)}</td>
                    <td className="pr-3">{fmt(r.massAdditiveRateBpd, 8)}</td>
                    <td>{fmt(r.rateLowByPctOfEngineRate, 6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-slate-300">
            ONE NUMBER, TWO CONVENTIONS, ONE LINE APART. The mass gross-up divides by the lean
            strength, which treats it as a WEIGHT percent, and it is one. The density blend on the
            very next line weights the two component densities by the same number, which is the
            VOLUME fraction rule. The mass fraction form of an ideal blend is the reciprocal of a
            sum of weight fractions over densities, and the arithmetic mean of two densities always
            exceeds the harmonic mean, so the stream density comes out HIGH and the injection rate,
            a mass over a density, comes out LOW.
          </div>
          <div className="mt-2 text-xs text-slate-300">
            THE ERROR GROWS WITH DILUTION, which is why a strong lean stream hides it. On the
            teaching line's own two doses it is
            {' '}{data.akasoLeans.map((x) => `${x.inhibitorId} at ${fmt(x.leanWtPct, 1)} weight percent lean, ${fmt(x.rateLowByPctOfEngineRate, 6)} percent`).join(', and ')}.
            Both are small because both lean streams are strong.
          </div>
          <Note>
            It cannot be both. Either the lean strength stays a weight percent and the blend is
            fixed, or it becomes a volume percent and the gross-up is fixed. The injection rate is a
            mass balance on the aqueous phase and nothing more: there is no inhibitor lost to the
            gas or the condensate anywhere in it, which on a real line is most of the reason a
            project chooses glycol. The rate error read against the engine's own rate is the SAME
            percentage the density is high by, because the rate is a mass over that density and the
            mass did not move.
          </Note>
        </>
      )}
      {which === 'constants' && (
        <>
          <div className="mt-3">
            <TileGrid>
              <Tile label="The constant the engine carries" value={fmt(data.constants.engineK, 6)} />
              <Tile label="The oracle's metric round trip" value={fmt(data.constants.goldenKFromMetric, 6)} />
              <Tile label="The value that makes the two relations meet when dilute" value={fmt(data.constants.diluteMatchK, 6)} />
              <Tile label="Engine over the metric round trip" value={fmt(data.constants.engineOverGolden, 10)} />
              <Tile label="Engine over the dilute match" value={fmt(data.constants.engineOverDiluteMatch, 10)} />
              <Tile label="Ratio of the two relations when dilute" value={fmt(data.constants.ratioAtDiluteLimit, 10)} />
              <Tile label="Hammerschmidt tolerance in the gate" value={tiny(data.constants.hammerschmidtGateTolerance)} />
              <Tile label="Nielsen-Bucklin tolerance in the same gate" value={tiny(data.constants.nielsenBucklinGateTolerance)} />
            </TileGrid>
          </div>
          <div className="mt-3 text-xs text-slate-300">
            THE TWO CONSTANTS ARE NOT INDEPENDENT. Hammerschmidt written in mole terms is the
            constant over the molecular weight of water times the mole ratio, and Nielsen-Bucklin's
            leading term as the concentration goes to zero is its own constant times the mole
            fraction. For the module's own two relations to meet in the dilute limit the
            Hammerschmidt constant has to be the Nielsen-Bucklin constant times the molecular weight
            of water, which is {fmt(data.constants.diluteMatchK, 6)}. The oracle's metric round trip
            gives a third value. At {fmt(data.constants.weightPct, 3)} weight percent the series
            correction is far below the gap, so the residual ratio of
            {' '}{fmt(data.constants.ratioAtDiluteLimit, 10)} is the constant and nothing else.
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">weight percent</th>
                  <th className="text-left pr-3">Hammerschmidt, degF</th>
                  <th className="text-left pr-3">Nielsen-Bucklin, degF</th>
                  <th className="text-left pr-3">ratio</th>
                  <th className="text-left">what is left over the constant ratio</th>
                </tr>
              </thead>
              <tbody>
                {data.dilute.map((r) => (
                  <tr key={r.weightPct}>
                    <td className="pr-3">{fmt(r.weightPct, 3)}</td>
                    <td className="pr-3">{fmt(r.hammerschmidtF, 12)}</td>
                    <td className="pr-3">{fmt(r.nielsenBucklinF, 12)}</td>
                    <td className="pr-3 text-[#BFFF00]">{fmt(r.ratio, 10)}</td>
                    <td>{tiny(r.seriesCorrection)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-slate-300">
            THE RATIO WALKS DOWN TOWARD THE RATIO OF THE TWO CONSTANTS as the solution goes dilute,
            and what is left over is the series correction on the logarithm. The gap is a CONSTANT
            and not a curvature, which is what makes it adjudicable rather than a modelling choice.
          </div>
          <div className="mt-2 text-xs text-slate-300">
            THE SIZE IS NOT THE FINDING. The gate compares Hammerschmidt at a relative tolerance
            {' '}{fmt(data.constants.gateToleranceRatio, 0)} times looser than the one it uses on
            its neighbour, and the disagreement sits comfortably inside it. A tolerance doing the
            work of a decision nobody made is the finding, and the fix is to adjudicate which of the
            three values the module should carry and then tighten the tolerance to match.
          </div>
        </>
      )}
    </>
  );
};

// --------------------------------------------------------------------------

const HydrateExplorer = ({ initialMode = 'jt' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Hydrate explorer"
      subtitle="Both halves of a flow assurance answer rest on something the engine did not compute: a boundary somebody measured in a laboratory, and a chemistry checked against a different correlation from the one it was sized with"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'jt' && <JouleThomson />}
        {mode === 'trench' && <Trench />}
        {mode === 'reference' && <Reference />}
        {mode === 'depression' && <Depression />}
        {mode === 'dose' && <Dose />}
        {mode === 'ceiling' && <Ceiling />}
      </div>
    </PanelShell>
  );
};

export default HydrateExplorer;
