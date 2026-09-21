import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  crossSection, twoLengths, gasCapacity, slugCatchers, threePhaseSplit, dropletsAndVerdicts, vesselFamily,
} from './separationLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Slug explorer, the Professional and Expert tiers. THE HORIZONTAL VESSEL AND
// THE FAMILY: a circle cut by a level, the two length requirements and which
// one controls, gas capacity in the gas space, slug catchers as a vessel and as
// a harp, the three-phase split with its exact interface and two droplet
// verdicts, and the L/D family with its reasons and three statuses.
//
// Every figure on this page is a return value from separationLab, which is a
// return value from the vendored Separator & Slug Catcher Designer engine on
// the teaching vessels ABANA-2 and AGBAMI. Nothing here computes an area, a
// length, an interface height, a settling time or a feasibility verdict, and
// nothing reads a clock.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no P label
// appears anywhere on this page.

const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const word = (v) => (v === null || v === undefined ? 'null' : String(v));

export const MODES = [
  ['segments', 'Segments: the cross-section at a range of levels, the chord, and the inverse'],
  ['lengths', 'Lengths: the two requirements across the family, and which one controls'],
  ['capacity', 'Capacity: the gas velocity, the margin, the verdict and what gas length cannot exceed'],
  ['slug', 'Slug catchers: the vessel, the harp, the working volume and the warning'],
  ['threephase', 'Three phase: the split, the exact interface, the droplet times and the two verdicts'],
  ['family', 'Family: every sweep with feasible, reasons, preferred and preferredStatus'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={i} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SweepTable = ({ sweep }) => (
  <>
    <Tbl
      head={['diameter ft', 'length ft', 'L/D', 'in band', 'feasible', 'reasons']}
      rows={sweep.rows.map((r) => [six(r.diameterFt), six(r.lengthFt), six(r.ldRatio), String(r.inRange), String(r.feasible), r.reasons.join(', ') || 'none'])}
    />
    <p className="text-xs text-slate-400 mt-2 mb-0">
      preferred {sweep.preferred ? `${six(sweep.preferred.diameterFt)} ft` : 'null'}, preferredStatus
      {' '}{sweep.preferredStatus}, band {six(sweep.ldMin)} to {six(sweep.ldMax)}.
    </p>
  </>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const SegmentsMode = ({ cs }) => {
  if (!cs) return <Note>The cross-section reader did not return the levels.</Note>;
  const chart = cs.rows.map((r) => ({ level: six(r.liquidLevelFrac), liquid: r.areaLiquidFt2, gas: r.areaGasFt2 }));
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        ABANA-2 is built at {six(cs.diameterFt)} ft. A horizontal drum is a circle cut by a level, and every area below
        is the exact circular segment at that depth.
      </p>
      <Tbl
        head={['level fraction', 'liquid depth ft', 'liquid area ft2', 'gas area ft2', 'gas height ft', 'gas-liquid chord ft', 'total area ft2']}
        rows={cs.rows.map((r) => [six(r.liquidLevelFrac), six(r.liquidLevelFt), six(r.areaLiquidFt2), six(r.areaGasFt2), six(r.gasHeightFt), six(r.gasLiquidChordFt), six(r.areaTotalFt2)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="level" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="liquid" name="liquid area, ft2" stackId="a" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="gas" name="gas area, ft2" stackId="a" fill="#475569" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The chord is the WIDTH of the gas-liquid surface. It is neither the oil-water interface, which three-phase sizing
        places itself, nor a length along the vessel. Half full is a special case where the two areas are equal at
        {' '}{six(cs.halfFullAreaFt2)} ft2 each and the chord is the full diameter.
      </p>
      <Tbl
        head={['published segments case', 'liquid area ft2']}
        rows={cs.published.map((c) => [c.name, six(c.areaLiquidFt2)])}
      />
      <Tbl
        head={['drum', 'level', 'depth ft', 'area the depth gives ft2', 'depth that area gives back ft']}
        rows={cs.inverses.map((r) => [`${six(r.diameterFt)} ft`, six(r.frac), six(r.liquidLevelFt), six(r.areaLiquidFt2), six(r.backHeightFt)])}
      />
      <Note>
        The area of a segment and the depth that produces it are exact inverses. The engine bisects a hundred times,
        which resolves the depth to double precision, and the depth comes back unchanged.
      </Note>
    </>
  );
};

export const LengthsMode = ({ tl }) => {
  if (!tl) return <Note>The length reader did not return the requirements.</Note>;
  const chart = tl.rows.map((r) => ({ diameter: six(r.diameterFt), liquid: r.lengthLiquidFt, gas: r.lengthGasFt }));
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="The liquid needs" value={six(tl.built.lengthLiquidFt)} unit="ft" />
          <Tile label="The gas needs" value={six(tl.built.lengthGasFt)} unit="ft" />
          <Tile label="So the vessel is" value={six(tl.built.lengthFt)} unit={`ft, controlled by the ${tl.built.controlling}`} />
          <Tile label="Slenderness" value={six(tl.built.ldRatio)} unit="L over D" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        At {six(tl.diameterFt)} ft and level {six(tl.liquidLevelFrac)} the liquid requirement is the retention volume of
        {' '}{six(tl.built.liquidVolFt3)} ft3 spread over the liquid area of {six(tl.built.areaLiquidFt2)} ft2. Drop the level
        to {six(tl.lowLevelFrac)} and the same duty in the same drum needs {six(tl.low.lengthLiquidFt)} ft, because the liquid
        area falls to {six(tl.low.areaLiquidFt2)} ft2 while the gas gets {six(tl.low.areaGasFt2)} ft2 and slows to
        {' '}{six(tl.low.gasVelocityFtS)} ft/s. Half full is an assumption somebody made.
      </p>
      <Tbl
        head={['diameter ft', 'liquid area ft2', 'gas area ft2', 'liquid length ft', 'gas length ft', 'length ft', 'controlling', 'L/D']}
        rows={tl.rows.map((r) => [six(r.diameterFt), six(r.areaLiquidFt2), six(r.areaGasFt2), six(r.lengthLiquidFt), six(r.lengthGasFt), six(r.lengthFt), r.controlling, six(r.ldRatio)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="diameter" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="liquid" name="liquid length, ft" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="gas" name="gas length, ft" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['published horizontal case', 'liquid ft', 'gas ft', 'length ft', 'controlling', 'L/D', 'gas velocity ft/s']}
        rows={tl.published.map((c) => [c.name, six(c.lengthLiquidFt), six(c.lengthGasFt), six(c.lengthFt), c.controlling, six(c.ldRatio), six(c.gasVelocityFtS)])}
      />
      <Note>
        Both length requirements are returned so the controlling one is visible. A vessel sized on the liquid alone is a
        vessel whose gas requirement was never looked at.
      </Note>
    </>
  );
};

export const CapacityMode = ({ gc }) => {
  if (!gc) return <Note>The capacity reader did not return the verdicts.</Note>;
  const chart = gc.rows.map((r) => ({ diameter: six(r.diameterFt), margin: r.gasVelocityMargin }));
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label={`Gas velocity at ${six(gc.diameterFt)} ft`} value={six(gc.gasVelocityFtS)} unit="ft/s" />
          <Tile label="Against a settling velocity of" value={six(gc.vT)} unit="ft/s" />
          <Tile label="Margin" value={six(gc.gasVelocityMargin)} unit="settling over actual" />
          <Tile label="gasCapacityOk" value={String(gc.gasCapacityOk)} />
        </TileGrid>
      </div>
      <Tbl
        head={['diameter ft', 'gas area ft2', 'gas velocity ft/s', 'margin', 'carries the gas']}
        rows={gc.rows.map((r) => [six(r.diameterFt), six(r.areaGasFt2), six(r.gasVelocityFtS), six(r.gasVelocityMargin), String(r.gasCapacityOk)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="diameter" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <ReferenceLine y={1} stroke="#BFFF00" strokeDasharray="3 3" label={{ value: 'the verdict line', fill: '#BFFF00', fontSize: 10 }} />
            <Bar dataKey="margin" name="gas velocity margin" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A margin below one is a vessel that cannot carry its gas, whatever its slenderness. The two smallest diameters on
        this family fail the verdict outright.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Gas length on the overloaded published case" value={six(gc.overloaded.lengthGasFt)} unit="ft" />
          <Tile label="Against a gas height of" value={six(gc.overloaded.gasHeightFt)} unit="ft" />
          <Tile label="Its margin" value={six(gc.overloaded.gasVelocityMargin)} unit={`gasCapacityOk ${String(gc.overloaded.gasCapacityOk)}`} />
          <Tile label="Controlling requirement" value={gc.overloaded.controlling} />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The gas length is the gas velocity over the settling velocity, times the gas height. Under the capacity rule that
        ratio is at most one, so the gas length can never exceed the gas HEIGHT, and gas controls only a vessel that is
        already overloaded or one shorter than its own diameter.
      </p>
      <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
        <p className="text-amber-300 text-xs font-medium mb-1">HELD FOR LITERATURE</p>
        <p className="text-xs text-slate-300 mb-0">{gc.held.note}</p>
      </div>
    </>
  );
};

export const SlugMode = ({ sc }) => {
  if (!sc) return <Note>The slug catcher reader did not return the sizing.</Note>;
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        The slug VOLUME is not computed here. It comes from the line, where the pigging tab of the line sizing studio
        works it out, and it is typed into this tab as a number somebody else stands behind.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="The slug that arrives" value={six(sc.slug.slugBbl)} unit="bbl" />
          <Tile label="Normal inflow over the hold" value={six(sc.vessel.normalBbl)} unit={`bbl, ${six(sc.slug.holdMin)} minutes at ${six(sc.slug.qLiquidBpd)} bpd`} />
          <Tile label="Working volume" value={six(sc.vessel.workingBbl)} unit="bbl" />
          <Tile label={`At a fill fraction of ${six(sc.slug.fillFraction)}`} value={six(sc.vessel.totalVolumeFt3)} unit="ft3" />
          <Tile label="Drum diameter" value={six(sc.vessel.diameterFt)} unit="ft" />
          <Tile label="Drum length" value={six(sc.vessel.lengthFt)} unit={`ft at L/D ${six(sc.vessel.ldRatio)}`} />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        A slug catcher holds more than the slug. The line keeps delivering at its normal rate while the slug is being
        drained, and the working volume carries both.
      </p>
      <Tbl
        head={['the same slug in a harp', 'value']}
        rows={[
          ['fingers', `${six(sc.fingersInput.nFingers)} of ${six(sc.fingersInput.fingerIdIn)} inch bore`],
          ['fill fraction', six(sc.fingersInput.fillFraction)],
          ['volume needed, ft3', six(sc.fingers.totalVolumeFt3)],
          ['length per finger, ft', six(sc.fingers.fingerLengthFt)],
          ['area per finger, ft2', six(sc.fingers.areaPerFingerFt2)],
          ['pipe in total, ft', six(sc.fingers.totalPipeFt)],
        ]}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The harp ignores the normal inflow entirely: its volume comes from the slug alone, so {six(sc.vessel.workingBbl)} bbl
        of working volume in the vessel answers {six(sc.fingersInput.slugBbl)} bbl in the fingers. Squeeze the same slug into
        {' '}{six(sc.fewInput.nFingers)} fingers of {six(sc.fewInput.fingerIdIn)} inch bore and each one runs
        {' '}{six(sc.few.fingerLengthFt)} ft, which earns the engine's warning: {sc.few.warning}
      </p>
      <Tbl
        head={['published vessel case', 'normal bbl', 'volume ft3', 'diameter ft', 'length ft']}
        rows={sc.publishedVessel.map((c) => [c.name, six(c.normalBbl), six(c.totalVolumeFt3), six(c.diameterFt), six(c.lengthFt)])}
      />
      <Tbl
        head={['published finger case', 'volume ft3', 'ft per finger', 'ft of pipe']}
        rows={sc.publishedFinger.map((c) => [c.name, six(c.totalVolumeFt3), six(c.fingerLengthFt), six(c.totalPipeFt)])}
      />
    </>
  );
};

export const ThreePhaseMode = ({ tp, dv }) => {
  if (!tp || !dv) return <Note>The three-phase reader did not return the split.</Note>;
  const p = tp.proportional;
  const ladder = dv.ladder.map((r) => ({ micron: six(r.dropletMicron), velocity: r.vFtS }));
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="The split" value={p.interfaceSplit} />
          <Tile label="Water share of the liquid area" value={six(p.waterShare)} />
          <Tile label="Interface height" value={six(p.interfaceHeightFt)} unit="ft" />
          <Tile label="The retired chord rule gave (derived)" value={six(tp.retiredChordLayerDerivedFt)} unit="ft" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The water takes {six(p.areaWaterFt2)} ft2 against {six(p.areaOilFt2)} ft2 of oil in a liquid area of
        {' '}{six(p.areaLiquidFt2)} ft2. The interface sits at the exact depth whose circular segment has the water area, so
        the water layer is {six(p.waterLayerFt)} ft and the oil layer above it {six(p.oilLayerFt)} ft, and the two add to the
        liquid level of {six(p.liquidLevelFt)} ft. The retired rule divided the water area by the gas-liquid chord of
        {' '}{six(p.gasLiquidChordFt)} ft, which understates the water layer, so the carryunder check was reading a layer that
        was not there.
      </p>
      <Tbl
        head={['reading', 'proportional split', 'pinned split']}
        rows={[
          ['interfaceSplit', p.interfaceSplit, tp.pinned.interfaceSplit],
          ['interface height, ft', six(p.interfaceHeightFt), six(tp.pinned.interfaceHeightFt)],
          ['oil layer, ft', six(p.oilLayerFt), six(tp.pinned.oilLayerFt)],
          ['oil retention length, ft', 'one requirement for both phases', six(tp.pinned.phaseRetentionLengthsFt.oilFt)],
          ['water retention length, ft', 'one requirement for both phases', six(tp.pinned.phaseRetentionLengthsFt.waterFt)],
          ['the requirement, ft', six(p.liquidRetentionLengthFt), six(tp.pinned.liquidRetentionLengthFt)],
          ['retentionPhase', word(p.retentionPhase), word(tp.pinned.retentionPhase)],
        ]}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Under the proportional split both phases need the same length by construction, so there is one requirement and
        retentionPhase is null. Pin the interface at a water share of {six(tp.explicitWaterFrac)} and the two lengths
        separate, the requirement becomes the larger of them, and retentionPhase names the phase that set it. Two lengths
        count as the same length inside a relative gap of {tp.retentionTieRel}.
      </p>
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ladder} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="micron" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="velocity" name="settling velocity, ft/s" stroke="#38bdf8" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Stokes velocity goes as the SQUARE of the droplet size and inversely with viscosity, so halving the drop quarters
        the speed. The vessel is {six(dv.lengthFt)} ft long, which gives the oil {four(dv.residenceOilS)} s of residence and
        the water {four(dv.residenceWaterS)} s.
      </p>
      <Tbl
        head={['droplet check', 'size micron', 'velocity ft/s', 'layer ft', 'time needed s', 'residence s', 'verdict']}
        rows={[
          ['water falling out of the oil', six(dv.waterDropletMicron), six(dv.waterDropVelocityFtS), six(dv.oilLayerFt), four(dv.waterDropFallS), four(dv.residenceOilS), `waterCarryover ${String(dv.waterCarryover)}`],
          ['oil rising out of the water', six(dv.oilDropletMicron), six(dv.oilDropVelocityFtS), six(dv.waterLayerFt), four(dv.oilDropRiseS), four(dv.residenceWaterS), `oilCarryunder ${String(dv.oilCarryunder)}`],
          ['water at the tighter specification', six(dv.tightMicron), six(dv.tight.waterDropVelocityFtS), six(dv.oilLayerFt), four(dv.tight.waterDropFallS), four(dv.tight.residenceOilS), `waterCarryover ${String(dv.tight.waterCarryover)}`],
        ]}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Tighten the water specification and nothing about the vessel changes except the verdict: {dv.tight.warning}
      </p>
      <Tbl
        head={['published Stokes case', 'engine ft/s', 'oracle ft/s', 'ratio (derived)']}
        rows={dv.publishedStokes.map((c) => [c.name, six(c.engineVFtS), six(c.oracleVFtS), six(c.ratioDerived)])}
      />
      <Note>
        The field constant is a rounded packaging of the SI group, so the engine sits about four parts in a thousand below
        the SI derivation on every case, in the same direction each time. That is the size of the disagreement a droplet
        verdict is decided on when a residence time is close.
      </Note>
      <Tbl
        head={['published three-phase case', 'share', 'interface ft', 'water ft', 'oil ft', 'length ft', 'controlling', 'the retired chord rule gave, ft']}
        rows={tp.published.map((c) => [c.name, six(c.waterShare), six(c.interfaceHeightFt), six(c.waterLayerFt), six(c.oilLayerFt), six(c.lengthFt), c.controlling, six(c.retiredChordWaterLayerFt)])}
      />
      <Tbl
        head={['what three-phase sizing demands', 'the input it names', 'its own message']}
        rows={tp.refusals.map((r) => [r.label, r.input, r.message])}
      />
    </>
  );
};

export const FamilyMode = ({ fam }) => {
  if (!fam) return <Note>The family reader did not return the sweeps.</Note>;
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        ABANA-1, the vertical family, band {six(fam.abana1.ldMin)} to {six(fam.abana1.ldMax)}:
      </p>
      <SweepTable sweep={fam.abana1} />
      <p className="text-xs text-slate-400 mt-4 mb-0">
        ABANA-2, the horizontal family, band {six(fam.abana2.ldMin)} to {six(fam.abana2.ldMax)}:
      </p>
      <SweepTable sweep={fam.abana2} />
      <p className="text-xs text-slate-400 mt-4 mb-0">
        The same family against a band widened to {six(fam.abana2Wide.ldMin)} to {six(fam.abana2Wide.ldMax)}, which is an
        INPUT and not a property of the vessel:
      </p>
      <SweepTable sweep={fam.abana2Wide} />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Widening the band admits a row the narrow band excluded and the preferred vessel does not move. The
        {' '}{six(fam.wideAdmittedRow.diameterFt)} ft row is now inRange {String(fam.wideAdmittedRow.inRange)} and still
        infeasible for {fam.wideAdmittedRow.reasons.join(', ')}, so the smallest FEASIBLE row in band is still
        {' '}{six(fam.wideAdmittedRow.preferredDiameterFt)} ft. A rule that took the first row in band would have moved.
      </p>
      <p className="text-xs text-slate-400 mt-4 mb-0">
        AGBAMI, the three-phase family at the {six(fam.waterDropletMicron)} micron specification:
      </p>
      <SweepTable sweep={fam.agbami} />
      <p className="text-xs text-slate-400 mt-4 mb-0">
        The same family at the {six(fam.tightMicron)} micron specification, where a droplet verdict gates feasibility:
      </p>
      <SweepTable sweep={fam.agbamiTight} />
      <p className="text-xs text-slate-400 mt-4 mb-0">
        The same family with the band narrowed to {six(fam.narrowBand.ldMin)} to {six(fam.narrowBand.ldMax)}:
      </p>
      <SweepTable sweep={fam.agbamiNarrow} />
      <div className="mt-3">
        <TileGrid>
          <Tile label="selected" value="a vessel was chosen" unit="the smallest feasible row in band" />
          <Tile label="none-in-band" value="feasible vessels exist" unit="none of them inside the band" />
          <Tile label="none-feasible" value="no vessel works at all" unit="whatever the band says" />
          <Tile label="The three statuses answer" value="different questions" />
        </TileGrid>
      </div>
      <Tbl
        head={['published sweep case', 'mode', 'band', 'preferred', 'status', 'the retired rule preferred, ft']}
        rows={fam.published.map((c) => [c.name, c.mode, `${six(c.ldMin)} to ${six(c.ldMax)}`,
          c.preferredDiameterFt === null ? 'null' : `${six(c.preferredDiameterFt)} ft`, c.preferredStatus, six(c.retiredPreferredDiameterFt)])}
      />
      <Note>
        The retired rule took the first row in band and called it the answer. On three of the five published cases it
        named a vessel that cannot carry its gas or cannot meet its droplet specification.
      </Note>
    </>
  );
};

const SlugExplorer = ({ initialMode = 'segments' }) => {
  const [mode, setMode] = useState(initialMode);
  const cs = useMemo(() => (mode === 'segments' ? safe(crossSection) : null), [mode]);
  const tl = useMemo(() => (mode === 'lengths' ? safe(twoLengths) : null), [mode]);
  const gc = useMemo(() => (mode === 'capacity' ? safe(gasCapacity) : null), [mode]);
  const sc = useMemo(() => (mode === 'slug' ? safe(slugCatchers) : null), [mode]);
  const tp = useMemo(() => (mode === 'threephase' ? safe(threePhaseSplit) : null), [mode]);
  const dv = useMemo(() => (mode === 'threephase' ? safe(dropletsAndVerdicts) : null), [mode]);
  const fam = useMemo(() => (mode === 'family' ? safe(vesselFamily) : null), [mode]);

  return (
    <PanelShell
      title="Slug explorer"
      subtitle="ABANA-2 and AGBAMI in field units: a circle cut by a level, the two length requirements, gas capacity, slug catchers, the three-phase split and the L/D family."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'segments' && <SegmentsMode cs={cs} />}
        {mode === 'lengths' && <LengthsMode tl={tl} />}
        {mode === 'capacity' && <CapacityMode gc={gc} />}
        {mode === 'slug' && <SlugMode sc={sc} />}
        {mode === 'threephase' && <ThreePhaseMode tp={tp} dv={dv} />}
        {mode === 'family' && <FamilyMode fam={fam} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored sizing engine on the teaching vessels, printed to the
        precision the lessons use. Lengths and diameters are in feet, areas in square feet, velocities in feet
        per second, residence and settling times in seconds, and slug volumes in barrels.
      </Note>
    </PanelShell>
  );
};

export default SlugExplorer;
