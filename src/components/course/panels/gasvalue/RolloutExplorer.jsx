import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  BLEND_PRESETS, blendRowsOf, blendAt, blendRefusalsAt, lpgReferenceAt, FILL_BASES, kanoVesselInputs, vesselAt,
  vesselEdgesAt, kanoVaporizerInputs, KANO_VAPORIZER, BUTANE_ATMOSPHERIC_BOILING_C, vaporizerAt, vaporizerRefusalsAt,
  KANO_BOTTLING, carouselAt, positionsSweepAt, carouselRefusalsAt, kanoCylindersInputs, ibafoTrailersInputs, floatAt,
  floatRefusalsAt, ibafoBankInputs, ibafoGaugeInputs, bankAt, ibafoBanksAt, coldBankAt, bankRefusalsAt, DAK_RANGE,
  ibafoCascadeInputs, cascadeAt, cascadeRefusalsAt, ibafoCompressionInputs, compressionAt, compressionRefusalsAt,
  ibafoForecourtInputs, forecourtAt, overloadAt, forecourtRefusalsAt, ibafoSwitchInputs, switchAt, ratioSweepAt,
  switchEdgesAt, IBAFO_CONVERSION, PRESSURE_BASIS, FORECOURT_OVERLOAD, fmt, plain,
} from './gasvalueLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, txt, usable, Tbl, Refusal, EngineNote, Note, Lead, Labelled, Empty, safe, NumBox,
  Button, Missing, Basis, RequiredSelect,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Rollout explorer, the Expert tier throughout.
//
// LPG AND CNG ON THE GROUND, each sized on the basis the engine states: the
// blend on volume, mass and moles, the fill limit on a basis the learner must
// choose, the vaporizer on the boiling point at its own pressure, the carousel
// on the positions wholly working, every CNG pressure absolute in bar(a), the
// bank on real gas, the cascade by equalisation, the compressor as a unit
// bridge only, and the customer's switch on an efficiency ratio the engine will
// not assume. Every figure is a return value of the vendored lpgCng module
// through the teaching lab.
//
// THREE INPUTS START EMPTY ON PURPOSE: the fill limit and its basis, the
// boiling point at the vaporizer's pressure, and the efficiency ratio. The
// engine's refusal, or its floor, is the first thing a learner reads.

export const MODES = [
  ['blend', 'The LPG blend on its three bases'],
  ['vessel', 'The vessel: the fill limit and its basis, cover and reorder'],
  ['vaporizer', "The vaporizer: three terms and the boiling point at the vaporizer's pressure"],
  ['carousel', 'The carousel on the positions wholly working, and the floats'],
  ['bank', 'Gas in a bank: real gas, ideal gas, gauge and absolute'],
  ['cascade', 'The cascade: equalising bank by bank'],
  ['station', 'The compressor bridge and the forecourt queue'],
  ['switch', "The customer's switch: cost per km and payback"],
];

const BAR_A = 'bar(a)';

// ---------------------------------------------------------------------------

export const BlendMode = ({ blend, rows, onRow, onPreset, reference, refusals }) => {
  if (!Array.isArray(rows)) return <Empty>The blend reader has returned nothing, so there is no blend to edit.</Empty>;
  const b = usable(blend) ? blend : null;
  return (
    <>
      <div className="mt-1 flex flex-wrap gap-2">
        {BLEND_PRESETS.map(([id, label]) => <Button key={id} onClick={() => onPreset(id)}>{label}, on LPG_REFERENCE&apos;s typical figures</Button>)}
      </div>
      {rows.map((r, i) => (
        <FieldGrid key={r.code}>
          <NumBox label={`${r.code} volume fraction`} value={r.volumeFraction} onChange={(v) => onRow(i, 'volumeFraction', v)} />
          <NumBox label={`${r.code} liquid density, kg/m3`} value={r.liquidDensityKgM3} onChange={(v) => onRow(i, 'liquidDensityKgM3', v)} />
          <NumBox label={`${r.code} molar mass, kg/kmol`} value={r.molarMassKgKmol} onChange={(v) => onRow(i, 'molarMassKgKmol', v)} />
          <NumBox label={`${r.code} latent heat, kJ/kg`} value={r.latentHeatKJkg} onChange={(v) => onRow(i, 'latentHeatKJkg', v)} />
        </FieldGrid>
      ))}
      {b && b.refusal && <Refusal message={b.refusal} />}
      {b && !b.refusal && (
        <>
          <TileGrid>
            <Tile label={<>densityKgM3<Basis>{b.densityBasis}</Basis></>} value={fmt.f4(b.densityKgM3)} />
            <Tile label={<>latentHeatKJkg<Basis>{b.latentHeatBasis}</Basis></>} value={fmt.f4(b.latentHeatKJkg)} />
            <Tile label={<>molarMassKgKmol<Basis>{b.molarMassBasis}</Basis></>} value={fmt.f4(b.molarMassKgKmol)} />
            {b.massFractions.map((m) => <Tile key={m.code} label={`${m.code} mass fraction`} value={fmt.f4(m.massFraction)} />)}
          </TileGrid>
          <Labelled tag="the reading the engine does not use">
            <p className="text-xs text-slate-300 mb-0">
              The latent heat averaged on the volume fractions: {fmt.f4(b.latentOnVolumeNotUsed)} kJ/kg, which is
              {' '}{fmt.f4(b.latentOnVolumeLessEngineNotUsed)} kJ/kg from the engine&apos;s. The engine blends latent heat on mass.
            </p>
          </Labelled>
        </>
      )}
      {usable(reference) && Array.isArray(reference.table) && (
        <>
          <Lead>LPG_REFERENCE, as the engine exports it:</Lead>
          <Tbl
            head={['code', 'label', 'molar mass kg/kmol', 'typical liquid density kg/m3', 'range', 'typical latent heat kJ/kg', 'range', 'typical boiling point C']}
            rows={reference.table.map((r) => [r.code, r.label, r.molarMassKgKmol, r.typicalLiquidDensityKgM3, r.liquidDensityRange, r.typicalLatentHeatKJkg, r.latentHeatRange, r.typicalBoilingPointC])}
          />
          <EngineNote>{reference.note}</EngineNote>
        </>
      )}
      <Lead>What lpgBlendProperties refuses:</Lead>
      <Tbl head={['probe', 'engine']} rows={(Array.isArray(refusals) ? refusals : []).map((x) => [x.probe, `REFUSED: ${txt(x.refusal)}`])} />
    </>
  );
};

const VESSEL_BOXES = [
  ['vesselCapacityM3', 'Vessel capacity, m3'],
  ['maxFillRatio', 'Maximum fill ratio (the site types its code value)'],
  ['demandTonnesPerDay', 'Demand, t/day'],
  ['deliveryTonnes', 'Delivery, t'],
  ['leadTimeDays', 'Lead time, days'],
  ['safetyDays', 'Safety stock, days'],
];

export const VesselMode = ({ vessel, inputs, onInput, edges }) => {
  const v = usable(vessel) ? vessel : null;
  const I = usable(inputs) ? inputs : {};
  const e = usable(edges) ? edges : null;
  return (
    <>
      <Lead>
        The fill limit is required and has no default, and its basis is a required choice. The liquid density is the
        blend&apos;s, {v ? fmt.f4(v.densityKgM3) : 'none'} kg/m3.{e ? ` On the water-capacity basis the engine weighs water at WATER_KG_M3 = ${e.waterKgM3} kg/m3.` : ''}
      </Lead>
      <FieldGrid>
        {VESSEL_BOXES.map(([k, label]) => <NumBox key={k} label={label} value={I[k]} onChange={(x) => onInput(k, x)} />)}
        <RequiredSelect label="fillRatioBasis" value={I.fillRatioBasis} onChange={(x) => onInput('fillRatioBasis', x)} options={FILL_BASES} none="choose a basis" />
      </FieldGrid>
      {!v && <Empty>The vessel reader has returned nothing.</Empty>}
      {v && v.refusal && <Refusal message={v.refusal} />}
      {v && !v.refusal && (
        <>
          <TileGrid>
            <Tile label={<>usableM3<Basis>{v.fillRatioBasis}</Basis></>} value={fmt.f4(v.usableM3)} />
            <Tile label={<>usableTonnes<Basis>{v.fillRatioBasis}</Basis></>} value={fmt.f4(v.usableTonnes)} />
            <Tile label="vapourSpaceM3" value={fmt.f4(v.vapourSpaceM3)} />
            <Tile label="coverDays" value={fmt.f4(v.coverDays)} />
            <Tile label="safetyStockTonnes" value={fmt.f4(v.safetyStockTonnes)} />
            {v.reorderAtTonnes === null ? <Missing label="reorderAtTonnes" why={txt(v.missingInputs)} /> : <Tile label="reorderAtTonnes" value={fmt.f4(v.reorderAtTonnes)} />}
            {v.ullageAtReorderTonnes === null ? <Missing label="ullageAtReorderTonnes" /> : <Tile label="ullageAtReorderTonnes" value={fmt.f4(v.ullageAtReorderTonnes)} />}
            {v.deliveryFitsUllage === null ? <Missing label="deliveryFitsUllage" why="no verdict" /> : <Tile label="deliveryFitsUllage" value={plain(v.deliveryFitsUllage)} />}
            <Tile label="deliveriesPerMonth" value={fmt.f4(v.deliveriesPerMonth)} />
          </TileGrid>
          {v.missingInputs.length > 0 && <EngineNote>missingInputs: {v.missingInputs.join(', ')}</EngineNote>}
          {v.deliveryWarning && <EngineNote>{v.deliveryWarning}</EngineNote>}
          <Labelled tag="the reading the engine does not use">
            <p className="text-xs text-slate-300 mb-0">
              The same fill ratio read on the other basis ({txt(v.otherBasis)}): {fmt.f4(v.otherBasisTonnesNotUsed)} t, which is
              {' '}{fmt.f4(v.otherBasisLessEngineNotUsed)} t against the engine&apos;s {fmt.f4(v.usableTonnes)} t on {v.fillRatioBasis}.
            </p>
          </Labelled>
        </>
      )}
      {e && (
        <>
          <Lead>What lpgStorageSizing refuses:</Lead>
          <Tbl head={['probe', 'engine']} rows={e.refusals.map((x) => [x.probe, `REFUSED: ${txt(x.refusal)}`])} />
        </>
      )}
      <Note>Code fill limits are held: the limit is a safety code value the site types with its basis. No figure here is a code value.</Note>
    </>
  );
};

const VAP_BOXES = [
  ['massFlowKgHr', 'Mass flow, kg/h'],
  ['liquidCpKJkgK', 'Liquid heat capacity, kJ/kg K'],
  ['inletTempC', 'Liquid in, C'],
  ['boilingPointC', "Boiling point at the vaporizer's pressure, C"],
  ['vapourCpKJkgK', 'Vapour heat capacity, kJ/kg K'],
  ['outletTempC', 'Vapour out, C'],
  ['designMarginPercent', 'Design margin, percent'],
];

export const VaporizerMode = ({ vap, inputs, onInput, onKano, onAtmospheric, refusals }) => {
  const v = usable(vap) ? vap : null;
  const I = usable(inputs) ? inputs : {};
  return (
    <>
      <Lead>
        The latent heat is the blend&apos;s, on mass: {v ? fmt.f4(v.latentHeatKJkg) : 'none'} kJ/kg. The boiling point is the one at
        the vaporizer&apos;s pressure, and it starts blank.
      </Lead>
      <FieldGrid>
        {VAP_BOXES.map(([k, label]) => <NumBox key={k} label={label} value={I[k]} onChange={(x) => onInput(k, x)} />)}
      </FieldGrid>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button onClick={onKano}>KANO&apos;s boiling point at the vaporizer&apos;s pressure, {KANO_VAPORIZER.boilingPointC} C</Button>
        <Button onClick={onAtmospheric}>n-butane&apos;s atmospheric boiling point from LPG_REFERENCE, {BUTANE_ATMOSPHERIC_BOILING_C} C</Button>
        <Button onClick={() => onInput('boilingPointC', '')}>Blank the boiling point</Button>
      </div>
      {!v && <Empty>The vaporizer reader has returned nothing.</Empty>}
      {v && v.refusal && <Refusal message={v.refusal} />}
      {v && !v.refusal && (
        <>
          <Tbl
            head={['term', 'kW', 'share of the duty']}
            rows={v.terms.map((t) => [t.label, t.kW === null ? 'missing' : fmt.f4(t.kW), t.share === null ? 'missing' : fmt.f4(t.share)])}
          />
          <TileGrid>
            <Tile label={v.complete ? 'dutyKW' : 'dutyKW (a floor, terms missing)'} value={fmt.f4(v.dutyKW)} />
            <Tile label="designDutyKW (with the margin)" value={fmt.f4(v.designDutyKW)} />
          </TileGrid>
          {v.note && <EngineNote>{v.note}</EngineNote>}
          <div className="mt-3 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={v.terms.filter((t) => t.kW !== null).map((t) => ({ name: t.label, kW: t.kW }))} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={AXIS} />
                <YAxis tick={AXIS} label={{ value: 'kW', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP} formatter={(x) => fmt.f4(x)} />
                <Bar dataKey="kW" fill={SERIES[3]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      <Lead>What vaporizerDuty refuses:</Lead>
      <Tbl head={['probe', 'engine']} rows={(Array.isArray(refusals) ? refusals : []).map((x) => [x.probe, `REFUSED: ${txt(x.refusal)}`])} />
    </>
  );
};

const CAROUSEL_BOXES = [
  ['cylindersPerDay', 'Cylinders a day'],
  ['fillMinutesPerCylinder', 'Fill minutes a cylinder'],
  ['positions', 'Positions'],
  ['shiftHoursPerDay', 'Shift hours'],
  ['availabilityFraction', 'Availability, (0, 1]'],
];

const FloatBlock = ({ title, result, inputs, onStage, onField }) => {
  const r = usable(result) ? result : null;
  const I = usable(inputs) ? inputs : { cycleStages: [] };
  return (
    <div className="mt-3 rounded-md border border-gray-700 p-3">
      <p className="text-white text-sm font-medium mb-1">{title}</p>
      <FieldGrid>
        <NumBox label="Units a day" value={I.unitsPerDay} onChange={(x) => onField('unitsPerDay', x)} />
        <NumBox label="Spares allowance" value={I.sparesFraction} onChange={(x) => onField('sparesFraction', x)} />
        {(I.cycleStages || []).map((s, i) => <NumBox key={s.label} label={`${s.label}, days`} value={s.days} onChange={(x) => onStage(i, x)} />)}
      </FieldGrid>
      {r && r.refusal && <Refusal message={r.refusal} />}
      {r && !r.refusal && (
        <>
          <TileGrid>
            <Tile label="cycleDays" value={fmt.f4(r.cycleDays)} />
            <Tile label="inCirculation" value={fmt.f4(r.inCirculation)} />
            <Tile label="sparesAllowance" value={fmt.f4(r.sparesAllowance)} />
            <Tile label="fleetRequired" value={plain(r.fleetRequired)} />
            <Tile label="spareCapacityUnits (what the ceiling adds)" value={fmt.f4(r.spareCapacityUnits)} />
            <Tile label="dominantStage" value={txt(r.dominantStage)} />
          </TileGrid>
          <Tbl head={['stage', 'share of the cycle']} rows={r.stages.map((s) => [s.label, fmt.f4(s.share)])} />
          {r.basis && <EngineNote>{r.basis}</EngineNote>}
        </>
      )}
    </div>
  );
};

export const CarouselMode = ({ carousel, inputs, onInput, sweep, refusals, cylinders, cylIn, onCyl, trailers, trlIn, onTrl, floatRefusals }) => {
  const k = usable(carousel) ? carousel : null;
  const I = usable(inputs) ? inputs : {};
  return (
    <>
      <FieldGrid>
        {CAROUSEL_BOXES.map(([key, label]) => <NumBox key={key} label={label} value={I[key]} onChange={(x) => onInput(key, x)} />)}
      </FieldGrid>
      {!k && <Empty>The carousel reader has returned nothing.</Empty>}
      {k && k.refusal && <Refusal message={k.refusal} />}
      {k && !k.refusal && (
        <>
          <TileGrid>
            <Tile label="arrivalsPerHour" value={fmt.f4(k.arrivalsPerHour)} />
            <Tile label="effectivePositions" value={fmt.f4(k.effectivePositions)} />
            <Tile label={<>queuePositions<Basis>positions wholly working</Basis></>} value={plain(k.queuePositions)} />
            <Tile label="minimumPositionsForThroughput" value={plain(k.minimumPositionsForThroughput)} />
            <Tile label="queue offered (erlangs)" value={fmt.f4(k.queue.offered)} />
            <Tile label="queue utilisation" value={fmt.f4(k.queue.utilisation)} />
            <Tile label="queue probabilityOfWaiting" value={fmt.f4(k.queue.probabilityOfWaiting)} />
            <Tile label="queue averageWaitMinutes" value={fmt.f4(k.queue.averageWaitMinutes)} />
            <Tile label="queue queueLength" value={fmt.f4(k.queue.queueLength)} />
            <Tile label="throughputCapacityPerDay" value={fmt.f4(k.throughputCapacityPerDay)} />
            <Tile label="meetsDemand" value={plain(k.meetsDemand)} />
          </TileGrid>
          {k.positionRoundingNote && <EngineNote>{k.positionRoundingNote}</EngineNote>}
          {k.queue.message && <EngineNote>{k.queue.message}</EngineNote>}
          {k.note && <EngineNote>{k.note}</EngineNote>}
        </>
      )}
      <Lead>The same carousel on other whole numbers of positions, availability set to 1 so the count is the count typed:</Lead>
      <Tbl
        head={['positions (input)', 'probabilityOfWaiting', 'averageWaitMinutes']}
        rows={(Array.isArray(sweep) ? sweep : []).map((x) => [x.positions, fmt.f4(x.queue && x.queue.probabilityOfWaiting), fmt.f4(x.queue && x.queue.averageWaitMinutes)])}
      />
      <Lead>What bottlingPlant refuses:</Lead>
      <Tbl head={['probe', 'engine']} rows={(Array.isArray(refusals) ? refusals : []).map((x) => [x.probe, `REFUSED: ${txt(x.refusal)}`])} />
      <FloatBlock title="KANO's cylinders in circulation" result={cylinders} inputs={cylIn} onStage={(i, x) => onCyl('stage', i, x)} onField={(key, x) => onCyl(key, null, x)} />
      <FloatBlock title="IBAFO's trailers to its daughter stations" result={trailers} inputs={trlIn} onStage={(i, x) => onTrl('stage', i, x)} onField={(key, x) => onTrl(key, null, x)} />
      <Lead>What assetFloat refuses:</Lead>
      <Tbl head={['probe', 'engine']} rows={(Array.isArray(floatRefusals) ? floatRefusals : []).map((x) => [x.probe, `REFUSED: ${txt(x.refusal)}`])} />
    </>
  );
};

export const BankMode = ({ bank, inputs, onInput, onPreset, banks, cold, refusals }) => {
  const b = usable(bank) ? bank : null;
  const I = usable(inputs) ? inputs : {};
  return (
    <>
      <Lead>Every pressure lpgCng takes is absolute, in {BAR_A}. With the gauge toggle on, the pressure typed is a gauge reading and the engine is given it plus the stated atmosphere.</Lead>
      <FieldGrid>
        <NumBox label="Bank volume, m3" value={I.volumeM3} onChange={(x) => onInput('volumeM3', x)} />
        <NumBox label={I.gauge ? 'Pressure on the gauge, bar' : `Pressure, ${BAR_A}`} value={I.pressureBar} onChange={(x) => onInput('pressureBar', x)} />
        <NumBox label="Temperature, C" value={I.temperatureC} onChange={(x) => onInput('temperatureC', x)} />
        <NumBox label="Gas specific gravity" value={I.gasSg} onChange={(x) => onInput('gasSg', x)} />
        {I.gauge && <NumBox label={`Site atmosphere, ${BAR_A}`} value={I.atmosphereBar} onChange={(x) => onInput('atmosphereBar', x)} />}
      </FieldGrid>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button active={!I.gauge} onClick={() => onInput('gauge', false)}>The pressure typed is absolute</Button>
        <Button active={!!I.gauge} onClick={() => onInput('gauge', true)}>The pressure typed is a gauge reading</Button>
        <Button onClick={() => onPreset('mid')}>IBAFO&apos;s Mid bank</Button>
        <Button onClick={() => onPreset('gauge')}>IBAFO&apos;s bank read on its gauge</Button>
      </div>
      {!b && <Empty>The bank reader has returned nothing.</Empty>}
      {b && b.refusal && <Refusal message={b.refusal} />}
      {b && !b.refusal && (
        <>
          <TileGrid>
            <Tile label={`pressure given to the engine, ${BAR_A}`} value={fmt.f4(b.pressureSentBar)} />
            <Tile label="z (Dranchuk-Abou-Kassem on Sutton)" value={fmt.f4(b.z)} />
            <Tile label="ppr" value={fmt.f4(b.ppr)} />
            <Tile label="tpr" value={fmt.f4(b.tpr)} />
            <Tile label="correlationInRange" value={plain(b.correlationInRange)} />
            <Tile label={<>massKg<Basis>real gas</Basis></>} value={fmt.f4(b.massKg)} />
            <Tile label={<>idealMassKg<Basis>ideal gas</Basis></>} value={fmt.f4(b.idealMassKg)} />
            <Tile label="realVersusIdeal" value={fmt.f4(b.realVersusIdeal)} />
            <Tile label="pressureBasis" value={txt(b.pressureBasis)} />
          </TileGrid>
          {b.correlationNote && <EngineNote>{b.correlationNote}</EngineNote>}
          {I.gauge && (
            <Labelled tag="the reading the engine does not use">
              <p className="text-xs text-slate-300 mb-0">
                The gauge reading typed as if absolute: {fmt.f4(b.gaugeAsAbsoluteMassNotUsed)} kg. Absolute minus gauge-as-absolute:
                {' '}{fmt.f4(b.absoluteLessGaugeAsAbsoluteNotUsed)} kg.
              </p>
            </Labelled>
          )}
          <Note>DAK_RANGE: ppr {DAK_RANGE.pprMin} to {DAK_RANGE.pprMax}, tpr {DAK_RANGE.tprMin} to {DAK_RANGE.tprMax}. Outside it the engine still answers and says so.</Note>
        </>
      )}
      <Lead>IBAFO&apos;s three banks, each read as absolute:</Lead>
      <Tbl
        head={['bank', `pressure ${BAR_A}`, 'z', 'massKg', 'idealMassKg', 'realVersusIdeal']}
        rows={(Array.isArray(banks) ? banks : []).map((x) => [x.label, plain(x.inputs && x.inputs.pressureBar), fmt.f4(x.z), fmt.f4(x.massKg), fmt.f4(x.idealMassKg), fmt.f4(x.realVersusIdeal)])}
      />
      {usable(cold) && !cold.refusal && (
        <Note>The Low bank at -80 C: tpr {fmt.f4(cold.tpr)}, correlationInRange {plain(cold.correlationInRange)}. {txt(cold.correlationNote)}</Note>
      )}
      <Lead>What gasMassInVessel refuses:</Lead>
      <Tbl head={['probe', 'engine']} rows={(Array.isArray(refusals) ? refusals : []).map((x) => [x.probe, `REFUSED: ${txt(x.refusal)}`])} />
    </>
  );
};

export const CascadeMode = ({ cascade, inputs, onBank, onInput, refusals }) => {
  const c = usable(cascade) ? cascade : null;
  const I = usable(inputs) ? inputs : { banks: [] };
  return (
    <>
      <FieldGrid>
        {(I.banks || []).map((b, i) => (
          <React.Fragment key={b.label}>
            <NumBox label={`${b.label} bank volume, m3`} value={b.volumeM3} onChange={(x) => onBank(i, 'volumeM3', x)} />
            <NumBox label={`${b.label} bank pressure, ${BAR_A}`} value={b.pressureBar} onChange={(x) => onBank(i, 'pressureBar', x)} />
          </React.Fragment>
        ))}
        <NumBox label="Vehicle tank, m3" value={I.vehicleTankM3} onChange={(x) => onInput('vehicleTankM3', x)} />
        <NumBox label={`Vehicle arrives at, ${BAR_A}`} value={I.vehicleStartBar} onChange={(x) => onInput('vehicleStartBar', x)} />
        <NumBox label={`Vehicle filled to, ${BAR_A}`} value={I.vehicleTargetBar} onChange={(x) => onInput('vehicleTargetBar', x)} />
        <NumBox label="Temperature, C" value={I.temperatureC} onChange={(x) => onInput('temperatureC', x)} />
        <NumBox label="Gas specific gravity" value={I.gasSg} onChange={(x) => onInput('gasSg', x)} />
      </FieldGrid>
      {!c && <Empty>The cascade reader has returned nothing.</Empty>}
      {c && c.refusal && <Refusal message={c.refusal} />}
      {c && !c.refusal && (
        <>
          <TileGrid>
            <Tile label="kgPerFill" value={fmt.f4(c.kgPerFill)} />
            <Tile label="fillsBeforeRecharge" value={plain(c.fillsBeforeRecharge)} />
            <Tile label="deliveredKg" value={fmt.t3(c.deliveredKg)} />
            <Tile label="storedKg" value={fmt.t3(c.storedKg)} />
            <Tile label="leftInBanksKg" value={fmt.t3(c.leftInBanksKg)} />
            <Tile label="storedKg minus deliveredKg minus leftInBanksKg" value={fmt.t3(c.ledgerDerivedKg)} />
            <Tile label="cascadeEfficiency (delivered over stored)" value={fmt.f4(c.cascadeEfficiency)} />
            <Tile label={`nextVehicleReachesBar, ${BAR_A}`} value={fmt.f4(c.nextVehicleReachesBar)} />
            <Tile label="hitFillLimit" value={plain(c.hitFillLimit)} />
            <Tile label="pressureBasis" value={txt(c.pressureBasis)} />
          </TileGrid>
          <Tbl head={['bank', `startBar, ${BAR_A}`, `endBar, ${BAR_A}`]} rows={c.banksAfter.map((b) => [b.label, fmt.f4(b.startBar), fmt.f4(b.endBar)])} />
          <div className="mt-3 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={c.banksAfter.map((b) => ({ name: b.label, start: b.startBar, end: b.endBar }))} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={AXIS} />
                <YAxis tick={AXIS} label={{ value: BAR_A, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP} formatter={(x) => fmt.f4(x)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="start" name="before the first fill" fill={SERIES[0]} isAnimationActive={false} />
                <Bar dataKey="end" name="after the last whole fill" fill={SERIES[1]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Lead>The first fills and the last, with the banks each drew on (lowest first):</Lead>
          <Tbl
            head={['fill', 'banks used']}
            rows={[...c.fills.slice(0, 3), ...c.fills.slice(Math.max(3, c.fills.length - 2))].map((f) => [plain(f.fill), f.banks.join(', ')])}
          />
          {c.note && <EngineNote>{c.note}</EngineNote>}
          {c.oneBank && (
            <Labelled tag="one bank, for comparison">
              <p className="text-xs text-slate-300 mb-0">
                The same {fmt.f4(c.oneBank.volumeM3)} m3 as one bank at the {c.oneBank.atBank} bank&apos;s {plain(c.oneBank.pressureBar)} {BAR_A}:
                {' '}fillsBeforeRecharge {plain(c.oneBank.fillsBeforeRecharge)}, cascadeEfficiency {fmt.f4(c.oneBank.cascadeEfficiency)},
                {' '}leftInBanksKg {fmt.t3(c.oneBank.leftInBanksKg)}.
              </p>
            </Labelled>
          )}
        </>
      )}
      <Lead>What cascadeFills refuses:</Lead>
      <Tbl head={['probe', 'engine']} rows={(Array.isArray(refusals) ? refusals : []).map((x) => [x.probe, `REFUSED: ${txt(x.refusal)}`])} />
    </>
  );
};

const COMP_BOXES = [
  ['throughputKgPerHour', 'Throughput, kg/h'],
  ['suctionBar', `Suction, ${BAR_A}`],
  ['dischargeBar', `Discharge, ${BAR_A}`],
  ['suctionTempC', 'Suction temperature, C'],
  ['gasSg', 'Gas specific gravity'],
];

export const StationMode = ({ comp, compIn, onComp, compRefusals, forecourt, fcIn, onFc, kgPerFill, overload, fcRefusals }) => {
  const c = usable(comp) ? comp : null;
  const C = usable(compIn) ? compIn : {};
  const f = usable(forecourt) ? forecourt : null;
  const F = usable(fcIn) ? fcIn : {};
  const o = usable(overload) ? overload : null;
  return (
    <>
      <Lead>The compressor as a unit bridge: the station&apos;s metric inputs converted to the field units the Facilities compression engine speaks. Its thermodynamics belong to the Facilities course and are not shown here.</Lead>
      <FieldGrid>
        {COMP_BOXES.map(([k, label]) => <NumBox key={k} label={label} value={C[k]} onChange={(x) => onComp(k, x)} />)}
      </FieldGrid>
      {c && c.refusal && <Refusal message={c.refusal} />}
      {c && !c.refusal && (
        <>
          <TileGrid>
            <Tile label="qMMscfd (the throughput as standard volume)" value={fmt.f4(c.qMMscfd)} />
            <Tile label="suction, psia" value={fmt.f4(c.suctionPsia)} />
            <Tile label="stageCount" value={plain(c.stageCount)} />
            <Tile label="pressureBasis" value={txt(c.pressureBasis)} />
          </TileGrid>
          <Tbl head={['stage', `suction ${BAR_A}`, `discharge ${BAR_A}`, 'ratio']} rows={c.stages.map((s) => [plain(s.stage), fmt.f4(s.suctionBar), fmt.f4(s.dischargeBar), fmt.f4(s.ratio)])} />
          <EngineNote>{c.basis}</EngineNote>
        </>
      )}
      <Tbl head={['probe', 'engine']} rows={(Array.isArray(compRefusals) ? compRefusals : []).map((x) => [x.probe, `REFUSED: ${txt(x.refusal)}`])} />
      <Lead>The forecourt, each fill the cascade&apos;s {fmt.f4(kgPerFill)} kg:</Lead>
      <FieldGrid>
        <NumBox label="Vehicles an hour" value={F.vehiclesPerHour} onChange={(x) => onFc('vehiclesPerHour', x)} />
        <NumBox label="Fill minutes" value={F.fillMinutes} onChange={(x) => onFc('fillMinutes', x)} />
        <NumBox label="Dispensers (whole)" value={F.dispensers} onChange={(x) => onFc('dispensers', x)} />
      </FieldGrid>
      {f && f.refusal && <Refusal message={f.refusal} />}
      {f && !f.refusal && (
        <>
          <TileGrid>
            <Tile label="utilisation" value={fmt.f4(f.queue.utilisation)} />
            <Tile label="stable" value={plain(f.queue.stable)} />
            <Tile label="probabilityOfWaiting" value={fmt.f4(f.queue.probabilityOfWaiting)} />
            <Tile label="averageWaitMinutes" value={fmt.f4(f.queue.averageWaitMinutes)} />
            <Tile label="kgPerHour" value={fmt.f4(f.kgPerHour)} />
          </TileGrid>
          {f.queue.message && <EngineNote>{f.queue.message}</EngineNote>}
          {f.note && <EngineNote>{f.note}</EngineNote>}
        </>
      )}
      {o && !o.refusal && (
        <Note>{FORECOURT_OVERLOAD} buses an hour on 2 dispensers: stable {plain(o.queue.stable)}, utilisation {fmt.f4(o.queue.utilisation)}. {txt(o.queue.message)}</Note>
      )}
      <Tbl head={['probe', 'engine']} rows={(Array.isArray(fcRefusals) ? fcRefusals : []).map((x) => [x.probe, `REFUSED: ${txt(x.refusal)}`])} />
    </>
  );
};

const SWITCH_BOXES = [
  ['annualDistanceKm', 'Annual distance, km'],
  ['baseFuel.consumptionPer100Km', 'PMS, litres per 100 km'],
  ['baseFuel.pricePerUnit', 'PMS, naira a litre'],
  ['baseFuel.energyPerUnitMJ', 'PMS, MJ a litre'],
  ['newFuel.pricePerUnit', 'CNG, naira a kg'],
  ['newFuel.energyPerUnitMJ', 'CNG, MJ a kg'],
  ['newFuel.efficiencyRatio', 'Efficiency ratio (required unless measured)'],
  ['newFuel.consumptionPer100Km', 'Measured CNG, kg per 100 km'],
  ['conversionCost', 'Conversion, naira'],
  ['annualExtraMaintenance', 'Extra maintenance, naira a year'],
];
const valueAt = (obj, path) => path.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), obj);

export const SwitchMode = ({ sw, inputs, onInput, onRatio, sweep, edges }) => {
  const s = usable(sw) ? sw : null;
  const I = usable(inputs) ? inputs : {};
  const e = usable(edges) ? edges : null;
  return (
    <>
      <FieldGrid>
        {SWITCH_BOXES.map(([k, label]) => <NumBox key={k} label={label} value={valueAt(I, k)} onChange={(x) => onInput(k, x)} />)}
      </FieldGrid>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button onClick={onRatio}>The IBAFO bus&apos;s efficiency ratio, {IBAFO_CONVERSION.newFuel.efficiencyRatio}</Button>
        <Button onClick={() => onInput('newFuel.efficiencyRatio', '')}>Blank the efficiency ratio</Button>
      </div>
      {!s && <Empty>The switch reader has returned nothing.</Empty>}
      {s && s.refusal && <Refusal message={s.refusal} />}
      {s && !s.refusal && (
        <>
          <TileGrid>
            <Tile label="consumptionSource" value={txt(s.consumptionSource)} />
            <Tile label="newFuelConsumptionPer100Km (kg)" value={fmt.f4(s.newFuelConsumptionPer100Km)} />
            <Tile label="PMS cost per km" value={fmt.f4(s.baseFuel.costPerKm)} />
            <Tile label="CNG cost per km" value={fmt.f4(s.newFuel.costPerKm)} />
            <Tile label="annualSaving (after maintenance)" value={fmt.f4(s.annualSaving)} />
            <Tile label="savingPerKm" value={fmt.f4(s.savingPerKm)} />
            {s.simplePaybackYears === null
              ? <Missing label="simplePaybackYears" why="no saving" />
              : <Tile label={<>simplePaybackYears<Basis>undiscounted</Basis></>} value={fmt.f4(s.simplePaybackYears)} />}
            <Tile label="kgCo2eAvoidedPerYear" value={fmt.f4(s.kgCo2eAvoidedPerYear)} />
            <Tile label="annualCashFlow.year0" value={fmt.f4(s.annualCashFlow.year0)} />
            <Tile label="annualCashFlow.recurring" value={fmt.f4(s.annualCashFlow.recurring)} />
          </TileGrid>
          {s.paybackNote && <EngineNote>{s.paybackNote}</EngineNote>}
        </>
      )}
      <Lead>The same bus at other efficiency ratios:</Lead>
      <Tbl
        head={['efficiency ratio (input)', 'newFuelConsumptionPer100Km', 'annualSaving', 'simplePaybackYears']}
        rows={(Array.isArray(sweep) ? sweep : []).map((x) => [x.ratio, fmt.f4(x.newFuelConsumptionPer100Km), fmt.f4(x.annualSaving), fmt.f4(x.simplePaybackYears)])}
      />
      {e && (
        <Tbl
          head={['probe', 'engine']}
          rows={[
            ['a measured CNG consumption', `consumptionSource ${txt(e.measured.consumptionSource)}, simplePaybackYears ${fmt.f4(e.measured.simplePaybackYears)}`],
            ['CNG priced with no saving', `annualSaving ${fmt.f4(e.noSaving.annualSaving)}, simplePaybackYears ${plain(e.noSaving.simplePaybackYears)}; ${txt(e.noSaving.paybackNote)}`],
            ['no measured consumption and the efficiency ratio left blank', `REFUSED: ${txt(e.noRatio)}`],
            ['no annual distance', `REFUSED: ${txt(e.noDistance)}`],
          ]}
        />
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const setPath = (obj, path, v) => {
  const [head, ...rest] = path.split('.');
  if (!rest.length) return { ...obj, [head]: v };
  return { ...obj, [head]: setPath(obj[head] || {}, rest.join('.'), v) };
};

const RolloutExplorer = ({ initialMode = 'blend' }) => {
  const [mode, setMode] = useState(MODES.some(([m]) => m === initialMode) ? initialMode : 'blend');
  const [blendRows, setBlendRows] = useState(() => blendRowsOf(BLEND_PRESETS[0][2]));
  const [vesselIn, setVesselIn] = useState(() => kanoVesselInputs());
  const [vapIn, setVapIn] = useState(() => kanoVaporizerInputs());
  const [carIn, setCarIn] = useState(() => ({ ...KANO_BOTTLING }));
  const [cylIn, setCylIn] = useState(() => kanoCylindersInputs());
  const [trlIn, setTrlIn] = useState(() => ibafoTrailersInputs());
  const [bankIn, setBankIn] = useState(() => ibafoBankInputs());
  const [casIn, setCasIn] = useState(() => ibafoCascadeInputs());
  const [compIn, setCompIn] = useState(() => ibafoCompressionInputs());
  const [fcIn, setFcIn] = useState(() => ibafoForecourtInputs());
  const [swIn, setSwIn] = useState(() => ibafoSwitchInputs());

  const blend = useMemo(() => safe(() => blendAt(blendRows)), [blendRows]);
  const density = blend && !blend.refusal ? blend.densityKgM3 : null;
  const latent = blend && !blend.refusal ? blend.latentHeatKJkg : null;
  const reference = useMemo(() => (mode === 'blend' ? safe(lpgReferenceAt) : null), [mode]);
  const blendRefusals = useMemo(() => (mode === 'blend' ? safe(blendRefusalsAt) : null), [mode]);
  const vessel = useMemo(() => (mode === 'vessel' ? safe(() => vesselAt(vesselIn, density)) : null), [mode, vesselIn, density]);
  const vesselEdges = useMemo(() => (mode === 'vessel' ? safe(vesselEdgesAt) : null), [mode]);
  const vap = useMemo(() => (mode === 'vaporizer' ? safe(() => vaporizerAt(vapIn, latent)) : null), [mode, vapIn, latent]);
  const vapRefusals = useMemo(() => (mode === 'vaporizer' ? safe(vaporizerRefusalsAt) : null), [mode]);
  const carousel = useMemo(() => (mode === 'carousel' ? safe(() => carouselAt(carIn)) : null), [mode, carIn]);
  const sweep = useMemo(() => (mode === 'carousel' ? safe(() => positionsSweepAt(carIn)) : null), [mode, carIn]);
  const carRefusals = useMemo(() => (mode === 'carousel' ? safe(carouselRefusalsAt) : null), [mode]);
  const cylinders = useMemo(() => (mode === 'carousel' ? safe(() => floatAt(cylIn)) : null), [mode, cylIn]);
  const trailers = useMemo(() => (mode === 'carousel' ? safe(() => floatAt(trlIn)) : null), [mode, trlIn]);
  const floatRefusals = useMemo(() => (mode === 'carousel' ? safe(floatRefusalsAt) : null), [mode]);
  const bank = useMemo(() => (mode === 'bank' ? safe(() => bankAt(bankIn)) : null), [mode, bankIn]);
  const banks = useMemo(() => (mode === 'bank' ? safe(ibafoBanksAt) : null), [mode]);
  const cold = useMemo(() => (mode === 'bank' ? safe(coldBankAt) : null), [mode]);
  const bankRefusals = useMemo(() => (mode === 'bank' ? safe(bankRefusalsAt) : null), [mode]);
  const cascade = useMemo(() => (mode === 'cascade' || mode === 'station' ? safe(() => cascadeAt(casIn)) : null), [mode, casIn]);
  const casRefusals = useMemo(() => (mode === 'cascade' ? safe(cascadeRefusalsAt) : null), [mode]);
  const kgPerFill = cascade && !cascade.refusal ? cascade.kgPerFill : null;
  const comp = useMemo(() => (mode === 'station' ? safe(() => compressionAt(compIn)) : null), [mode, compIn]);
  const compRefusals = useMemo(() => (mode === 'station' ? safe(compressionRefusalsAt) : null), [mode]);
  const forecourt = useMemo(() => (mode === 'station' ? safe(() => forecourtAt({ ...fcIn, kgPerFill })) : null), [mode, fcIn, kgPerFill]);
  const overload = useMemo(() => (mode === 'station' ? safe(overloadAt) : null), [mode]);
  const fcRefusals = useMemo(() => (mode === 'station' ? safe(forecourtRefusalsAt) : null), [mode]);
  const sw = useMemo(() => (mode === 'switch' ? safe(() => switchAt(swIn)) : null), [mode, swIn]);
  const ratioSweep = useMemo(() => (mode === 'switch' ? safe(ratioSweepAt) : null), [mode]);
  const swEdges = useMemo(() => (mode === 'switch' ? safe(switchEdgesAt) : null), [mode]);

  const onFloat = (setter) => (key, i, x) => setter((s) => (key === 'stage'
    ? { ...s, cycleStages: s.cycleStages.map((st, j) => (j === i ? { ...st, days: x } : st)) }
    : { ...s, [key]: x }));

  return (
    <PanelShell
      title="Rollout explorer"
      subtitle="The KANO LPG plant and the IBAFO CNG station: the blend, the vessel, the vaporizer, the carousel and floats, the bank, the cascade, the compressor bridge, the forecourt and a bus operator's switch. Every figure is the engine's, on the basis it names."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'blend' && (
          <BlendMode
            blend={blend}
            rows={blendRows}
            onRow={(i, k, v) => setBlendRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)))}
            onPreset={(id) => setBlendRows(blendRowsOf((BLEND_PRESETS.find(([k]) => k === id) || BLEND_PRESETS[0])[2]))}
            reference={reference}
            refusals={blendRefusals}
          />
        )}
        {mode === 'vessel' && <VesselMode vessel={vessel} inputs={vesselIn} onInput={(k, v) => setVesselIn((x) => ({ ...x, [k]: v }))} edges={vesselEdges} />}
        {mode === 'vaporizer' && (
          <VaporizerMode
            vap={vap}
            inputs={vapIn}
            onInput={(k, v) => setVapIn((x) => ({ ...x, [k]: v }))}
            onKano={() => setVapIn((x) => ({ ...x, boilingPointC: KANO_VAPORIZER.boilingPointC }))}
            onAtmospheric={() => setVapIn((x) => ({ ...x, boilingPointC: BUTANE_ATMOSPHERIC_BOILING_C }))}
            refusals={vapRefusals}
          />
        )}
        {mode === 'carousel' && (
          <CarouselMode
            carousel={carousel}
            inputs={carIn}
            onInput={(k, v) => setCarIn((x) => ({ ...x, [k]: v }))}
            sweep={sweep}
            refusals={carRefusals}
            cylinders={cylinders}
            cylIn={cylIn}
            onCyl={onFloat(setCylIn)}
            trailers={trailers}
            trlIn={trlIn}
            onTrl={onFloat(setTrlIn)}
            floatRefusals={floatRefusals}
          />
        )}
        {mode === 'bank' && (
          <BankMode
            bank={bank}
            inputs={bankIn}
            onInput={(k, v) => setBankIn((x) => ({ ...x, [k]: v }))}
            onPreset={(id) => setBankIn(id === 'gauge' ? ibafoGaugeInputs() : ibafoBankInputs())}
            banks={banks}
            cold={cold}
            refusals={bankRefusals}
          />
        )}
        {mode === 'cascade' && (
          <CascadeMode
            cascade={cascade}
            inputs={casIn}
            onBank={(i, k, v) => setCasIn((x) => ({ ...x, banks: x.banks.map((b, j) => (j === i ? { ...b, [k]: v } : b)) }))}
            onInput={(k, v) => setCasIn((x) => ({ ...x, [k]: v }))}
            refusals={casRefusals}
          />
        )}
        {mode === 'station' && (
          <StationMode
            comp={comp}
            compIn={compIn}
            onComp={(k, v) => setCompIn((x) => ({ ...x, [k]: v }))}
            compRefusals={compRefusals}
            forecourt={forecourt}
            fcIn={fcIn}
            onFc={(k, v) => setFcIn((x) => ({ ...x, [k]: v }))}
            kgPerFill={kgPerFill}
            overload={overload}
            fcRefusals={fcRefusals}
          />
        )}
        {mode === 'switch' && (
          <SwitchMode
            sw={sw}
            inputs={swIn}
            onInput={(k, v) => setSwIn((x) => setPath(x, k, v))}
            onRatio={() => setSwIn((x) => setPath(x, 'newFuel.efficiencyRatio', IBAFO_CONVERSION.newFuel.efficiencyRatio))}
            sweep={ratioSweep}
            edges={swEdges}
          />
        )}
      </div>
      <Note>
        Every figure on this page is a return value of the vendored lpgCng module through the teaching lab, on the basis the
        engine names ({PRESSURE_BASIS} for every CNG pressure). Every refusal and note is the engine&apos;s own sentence. Every
        blend, vessel, price and vehicle figure here is invented and illustrative.
      </Note>
    </PanelShell>
  );
};

export default RolloutExplorer;
