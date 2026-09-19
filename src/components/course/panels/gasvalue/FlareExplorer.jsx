import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend,
} from 'recharts';
import {
  GAS_PRESETS, presetRows, gasAt, referenceAt, pureComponentsAt, carbonProbeAt, analysisRefusalsAt, richnessEdgesAt,
  missingProbesAt, flareAt, BLANK_FLARE, egbemaFlareInputs, flareMolarMassesAt, passThroughAt, destructionSweepAt,
  gwpSweepAt, flareRefusalsAt, fmt, plain,
} from './gasvalueLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, txt, usable, Tbl, Refusal, EngineNote, Note, Lead, Labelled, Empty, safe, NumBox,
  Button, Missing, Basis,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Flare explorer, the Associate tier throughout.
//
// A FLARE IS A MEASURED GAS FIRST. The analysis is an editable table filled
// from the engine's reference rows; every property of the gas, its liquids and
// its flare is a return value of the vendored flareToValue module through the
// teaching lab, printed on the basis the engine names.
//
// THE FLARE HAS NO DEFAULTS. Volume, days, both efficiencies and the GWP start
// blank and the engine's refusal is what the learner reads first. EGBEMA's
// study is a preset button; nothing here types an efficiency or a GWP for the
// learner.
//
// A SHORTCUT IS SHOWN AS THE READING THE ENGINE DOES NOT USE, from the lab and
// labelled so: the heating value weighted by mass, and every unburned carbon
// counted as methane.

export const MODES = [
  ['analysis', 'The analysis: the sheet, its sum and the reference table'],
  ['mole', 'The gas by the mole: heating value, inerts, carbon and mass'],
  ['liquids', 'The liquids: gallons per Mscf, richness and the mass ceiling'],
  ['flare', 'The flare by 40 CFR 98.233(n): CO2, methane and CO2e'],
];

const COLUMNS = [
  ['moleFraction', 'mole fraction'],
  ['c', 'carbon per molecule'],
  ['molarMassLbLbmol', 'molar mass lb/lbmol'],
  ['ghvBtuScf', 'heating value Btu/scf'],
  ['liquidDensityLbGal', 'liquid density lb/gal'],
];

const Presets = ({ onPreset }) => (
  <div className="mt-2 flex flex-wrap gap-2">
    {GAS_PRESETS.map(([id, label]) => <Button key={id} onClick={() => onPreset(id)}>{label}</Button>)}
  </div>
);

/** The sheet as boxes. A box left blank goes to the engine blank. */
const SheetTable = ({ rows, onRow }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>
          <th className="text-left pr-3">code</th>
          {COLUMNS.map(([, h]) => <th key={h} className="text-left pr-3 whitespace-nowrap">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {(Array.isArray(rows) ? rows : []).map((r, i) => (
          <tr key={r.code}>
            <td className="pr-3 font-mono">{r.code}</td>
            {COLUMNS.map(([k]) => (
              <td key={k} className="pr-3 py-0.5">
                <input
                  type="number"
                  step="any"
                  aria-label={`${r.code} ${k}`}
                  value={r[k] === null || r[k] === undefined ? '' : r[k]}
                  onChange={(e) => onRow(i, k, e.target.value)}
                  className="w-24 bg-gray-700 text-white border border-gray-600 rounded px-1 h-7"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ---------------------------------------------------------------------------

export const AnalysisMode = ({ gas, rows, onRow, onPreset, reference, pure, refusals }) => {
  if (!Array.isArray(rows)) return <Empty>The analysis has returned nothing, so there is no sheet to edit.</Empty>;
  const g = usable(gas) ? gas : null;
  return (
    <>
      <Lead>Load a gas, then edit any box. A box left blank is handed to the engine blank.</Lead>
      <Presets onPreset={onPreset} />
      <SheetTable rows={rows} onRow={onRow} />
      {g && g.refusal && <Refusal message={g.refusal} />}
      {g && !g.refusal && (
        <>
          <TileGrid>
            <Tile label="rawMoleFractionSum (the sheet sum)" value={fmt.f4(g.rawMoleFractionSum)} />
            <Tile label="normalisationNote" value={g.normalisationNote === null ? 'none' : 'see below'} />
          </TileGrid>
          {g.normalisationNote && <EngineNote>{g.normalisationNote}</EngineNote>}
          <Lead>The fractions the engine works with, scaled to one:</Lead>
          <Tbl
            head={['code', 'typed', 'normalised']}
            rows={g.normalised.map((x, i) => [x.code, plain(rows[i] ? rows[i].moleFraction : null), fmt.f4(x.moleFraction)])}
          />
        </>
      )}
      {usable(reference) && Array.isArray(reference.table) && (
        <>
          <Lead>GAS_COMPONENT_REFERENCE, as the engine exports it:</Lead>
          <Tbl
            head={['code', 'label', 'carbon per molecule', 'molar mass lb/lbmol', 'typical heating value Btu/scf', 'liquid density lb/gal', 'recoverable as NGL', 'inert']}
            rows={reference.table.map((r) => [r.code, r.label, r.c, r.molarMassLbLbmol, r.typicalGhvBtuScf, txt(r.liquidDensityLbGal), String(r.recoverableAsNgl), String(!!r.inert)])}
          />
          <EngineNote>{reference.note}</EngineNote>
          <Lead>The engine&apos;s unit constants:</Lead>
          <Tbl head={['constant', 'value', 'what it is']} rows={reference.constants.map((c) => [c.name, String(c.value), c.what])} />
        </>
      )}
      <Lead>One Mscf of each pure component, as characteriseGas weighs it:</Lead>
      <Tbl
        head={['pure component', 'molar mass lb/lbmol (reference)', 'kgPerMscf']}
        rows={(Array.isArray(pure) ? pure : []).map((p) => [p.label, p.molarMassLbLbmol, fmt.f4(p.kgPerMscf)])}
      />
      <Lead>What characteriseGas refuses, in its own words:</Lead>
      <Tbl head={['probe', 'engine']} rows={(Array.isArray(refusals) ? refusals : []).map((x) => [x.probe, `REFUSED: ${txt(x.refusal)}`])} />
    </>
  );
};

export const MoleMode = ({ gas, rows, onRow, onPreset, probe }) => {
  const g = usable(gas) ? gas : null;
  if (!g) return <Empty>The gas reader has returned nothing, so there is no gas to read.</Empty>;
  const ghvBars = g.refusal ? [] : [
    { name: 'the engine, on moles', value: g.ghvBtuScf },
    { name: 'weighted by mass (not used)', value: g.massWeightedGhvNotUsed },
    { name: 'hydrocarbons alone', value: g.hydrocarbonsOnlyGhv },
  ].filter((b) => b.value !== null && b.value !== undefined);
  return (
    <>
      <Presets onPreset={onPreset} />
      {Array.isArray(rows) && <SheetTable rows={rows} onRow={onRow} />}
      {g.refusal && <Refusal message={g.refusal} />}
      {!g.refusal && (
        <>
          <TileGrid>
            {g.ghvBtuScf === null
              ? <Missing label="ghvBtuScf, Btu/scf" why="a heating value is blank" />
              : <Tile label={<>ghvBtuScf, Btu/scf<Basis>mole-weighted</Basis></>} value={fmt.f4(g.ghvBtuScf)} />}
            <Tile label="inertMoleFraction" value={fmt.f4(g.inertMoleFraction)} />
            <Tile label="co2MoleFraction" value={fmt.f4(g.co2MoleFraction)} />
            <Tile label="methaneMoleFraction" value={fmt.f4(g.methaneMoleFraction)} />
            <Tile label={<>carbonPerMol<Basis>every carbon atom</Basis></>} value={fmt.f4(g.carbonPerMol)} />
            <Tile label={<>hydrocarbonCarbonPerMol<Basis>the carbon that can burn</Basis></>} value={fmt.f4(g.hydrocarbonCarbonPerMol)} />
            <Tile label="carbonPerMol minus hydrocarbonCarbonPerMol" value={fmt.f4(g.carbonLessHydrocarbonDerived)} />
            {g.molarMassLbLbmol === null
              ? <Missing label="molarMassLbLbmol" why="a molar mass is blank" />
              : <Tile label="molarMassLbLbmol" value={fmt.f4(g.molarMassLbLbmol)} />}
            {g.kgPerMscf === null
              ? <Missing label="kgPerMscf" why="a molar mass is blank" />
              : <Tile label="kgPerMscf" value={fmt.f4(g.kgPerMscf)} />}
          </TileGrid>
          {g.ghvNote && <EngineNote>{g.ghvNote}</EngineNote>}
          <Labelled tag="the reading the engine does not use">
            <p className="text-xs text-slate-300 mb-0">
              The same heating values weighted by mass: {fmt.f4(g.massWeightedGhvNotUsed)} Btu/scf, minus the
              engine&apos;s: {fmt.f4(g.massWeightedLessEngineNotUsed)}. The engine asked about the hydrocarbons alone
              (inerts left out and the rest scaled to one): {fmt.f4(g.hydrocarbonsOnlyGhv)} Btu/scf, minus the
              engine&apos;s: {fmt.f4(g.hydrocarbonsOnlyLessEngine)}. The engine blends on moles.
            </p>
          </Labelled>
          {ghvBars.length > 0 && (
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ghvBars} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={AXIS} />
                  <YAxis tick={AXIS} label={{ value: 'Btu/scf', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt.f4(v)} />
                  <Bar dataKey="value" fill={SERIES[0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
      <Lead>A carbon number typed, and left blank for the engine to take from the reference by its code:</Lead>
      <Tbl
        head={['probe (methane 0.9, propane 0.1)', 'carbonPerMol', 'hydrocarbonCarbonPerMol']}
        rows={(Array.isArray(probe) ? probe : []).map((x) => [x.probe, fmt.f4(x.carbonPerMol), fmt.f4(x.hydrocarbonCarbonPerMol)])}
      />
      <Note>Blank any carbon number box above and the engine fills it from the reference by the row&apos;s code.</Note>
    </>
  );
};

export const LiquidsMode = ({ gas, rows, onRow, onPreset, edges, probes }) => {
  const g = usable(gas) ? gas : null;
  if (!g) return <Empty>The gas reader has returned nothing, so there are no liquids to read.</Empty>;
  const e = usable(edges) ? edges : null;
  const gpmMissing = g.gpmC3Plus === null || g.gpmC3Plus === undefined;
  return (
    <>
      <Presets onPreset={onPreset} />
      {Array.isArray(rows) && <SheetTable rows={rows} onRow={onRow} />}
      {g.refusal && <Refusal message={g.refusal} />}
      {!g.refusal && (
        <>
          <TileGrid>
            {gpmMissing
              ? <Missing label="gpmC2Plus, gal/Mscf" why={`no liquid density for ${txt(g.missingLiquidDensity)}`} />
              : <Tile label={<>gpmC2Plus, gal/Mscf<Basis>ethane and heavier</Basis></>} value={fmt.f4(g.gpmC2Plus)} />}
            {gpmMissing
              ? <Missing label="gpmC3Plus, gal/Mscf" why={`no liquid density for ${txt(g.missingLiquidDensity)}`} />
              : <Tile label={<>gpmC3Plus, gal/Mscf<Basis>propane and heavier</Basis></>} value={fmt.f4(g.gpmC3Plus)} />}
            {!gpmMissing && <Tile label="gpmC2Plus minus gpmC3Plus (the ethane)" value={fmt.f4(g.ethaneGpmDerived)} />}
            {g.richness === null ? <Missing label="richness" why="the liquids content is missing" /> : <Tile label="richness" value={g.richness} />}
            {g.kgPerMscf === null ? <Missing label="kgPerMscf" /> : <Tile label="kgPerMscf" value={fmt.f4(g.kgPerMscf)} />}
            {g.c3PlusKgPerMscf === null
              ? <Missing label="c3PlusKgPerMscf" />
              : <Tile label={<>c3PlusKgPerMscf<Basis>propane and heavier</Basis></>} value={fmt.f4(g.c3PlusKgPerMscf)} />}
            <Tile label="c3PlusKgPerMscf over kgPerMscf" value={fmt.f4(g.c3PlusShareDerived)} />
          </TileGrid>
          <EngineNote>{g.gpmBasis}</EngineNote>
          {e && !gpmMissing && (
            <div className="mt-3 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={[{ name: 'gpmC3Plus', value: g.gpmC3Plus }]} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis type="number" tick={AXIS} domain={[0, (max) => Math.max(max, e.moderateToRich.gpmC3Plus) * 1.2]} />
                  <YAxis type="category" dataKey="name" tick={AXIS} />
                  <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt.f4(v)} />
                  <ReferenceLine x={e.leanToModerate.gpmC3Plus} stroke={SERIES[3]} strokeDasharray="4 4" label={{ value: 'lean to moderate', fill: '#fbbf24', fontSize: 10, position: 'top' }} />
                  <ReferenceLine x={e.moderateToRich.gpmC3Plus} stroke={SERIES[1]} strokeDasharray="4 4" label={{ value: 'moderate to rich', fill: '#f472b6', fontSize: 10, position: 'top' }} />
                  <Bar dataKey="value" fill={SERIES[2]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
      {e && (
        <>
          <Lead>Where the richness word changes, asked of the engine by bisection on a methane and propane mix:</Lead>
          <Tbl
            head={['word changes', 'gpmC3Plus where it changes']}
            rows={[['lean to moderate', fmt.f4(e.leanToModerate.gpmC3Plus)], ['moderate to rich', fmt.f4(e.moderateToRich.gpmC3Plus)]]}
          />
        </>
      )}
      <Lead>EGBEMA with a liquid density, and then a heating value, left blank:</Lead>
      <Tbl
        head={['probe', 'gpmC2Plus', 'gpmC3Plus', 'richness', 'missingLiquidDensity', 'ghvBtuScf', 'ghvNote']}
        rows={(Array.isArray(probes) ? probes : []).map((x) => [x.probe, fmt.f4(x.gpmC2Plus), fmt.f4(x.gpmC3Plus), txt(x.richness), txt(x.missingLiquidDensity), fmt.f4(x.ghvBtuScf), txt(x.ghvNote)])}
      />
    </>
  );
};

const FLARE_BOXES = [
  ['volumeMMscfd', 'Volume flared, MMscfd'],
  ['onstreamDays', 'On-stream days a year'],
  ['flareDestructionEfficiency', 'Destruction efficiency, (0, 1]'],
  ['flareCombustionEfficiency', 'Combustion efficiency (leave blank for the stand-in)'],
  ['gwpMethane', 'Methane GWP (the study chooses it)'],
];

export const FlareMode = ({ flare, inputs, onInput, onEgbema, onClear, molar, passThrough, sweep, gwps, refusals }) => {
  const f = usable(flare) ? flare : null;
  const i = usable(inputs) ? inputs : BLANK_FLARE;
  const m = usable(molar) ? molar : null;
  return (
    <>
      <Lead>Every flare input starts blank. The engine assumes none of them.</Lead>
      <FieldGrid>
        {FLARE_BOXES.map(([k, label]) => <NumBox key={k} label={label} value={i[k]} onChange={(v) => onInput(k, v)} />)}
      </FieldGrid>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button onClick={onEgbema}>EGBEMA&apos;s parcel and flare study</Button>
        <Button onClick={onClear}>Blank every flare input</Button>
      </div>
      {!f && <Empty>The flare reader has returned nothing yet.</Empty>}
      {f && f.refusal && <Refusal message={f.refusal} />}
      {f && !f.refusal && (
        <>
          <TileGrid>
            <Tile label="scfPerYear" value={plain(f.scfPerYear)} />
            <Tile label="flareCo2Tonnes, t/yr" value={fmt.t3(f.flareCo2Tonnes)} />
            <Tile label="flareCh4Tonnes, t/yr" value={fmt.t3(f.flareCh4Tonnes)} />
            {f.flareCo2eTonnes === null
              ? <Missing label="flareCo2eTonnes, t/yr" why={f.gwpMethane === null ? txt(f.blockedBy) : null} />
              : <Tile label="flareCo2eTonnes, t/yr" value={fmt.t3(f.flareCo2eTonnes)} />}
            {f.methaneShareOfFlareCo2e === null
              ? <Missing label="methaneShareOfFlareCo2e" />
              : <Tile label="methaneShareOfFlareCo2e" value={fmt.f4(f.methaneShareOfFlareCo2e)} />}
            <Tile label="destruction efficiency used" value={plain(f.destructionEfficiency)} />
            <Tile label="combustion efficiency used" value={plain(f.combustionEfficiency)} />
          </TileGrid>
          {f.combustionEfficiencyNote && <EngineNote>{f.combustionEfficiencyNote}</EngineNote>}
          <EngineNote>{f.basis}</EngineNote>
          <Labelled tag="the reading the engine does not use">
            <p className="text-xs text-slate-300 mb-0">
              Every unburned carbon atom counted as methane, from the engine&apos;s own carbon per mole:
              {' '}{fmt.t3(f.allCarbonMethaneNotUsed)} t/yr, over the engine&apos;s {fmt.t3(f.flareCh4Tonnes)} t/yr:
              {' '}{fmt.f4(f.allCarbonOverEngineNotUsed)}. The engine counts the methane in the gas.
            </p>
          </Labelled>
          <div className="mt-3 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'methane, the engine', t: f.flareCh4Tonnes },
                  { name: 'every unburned carbon (not used)', t: f.allCarbonMethaneNotUsed },
                ]}
                margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={AXIS} />
                <YAxis tick={AXIS} label={{ value: 't/yr', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt.t3(v)} />
                <Bar dataKey="t" fill={SERIES[1]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      {m && (
        <Note>
          The molar masses the flare is weighed at, asked of the engine about itself: CO2 {fmt.t3(m.co2)} kg/kmol,
          methane {fmt.t3(m.methane)} kg/kmol.
        </Note>
      )}
      <Lead>The CO2 in the gas passes through. Two probes at EGBEMA&apos;s volume and days:</Lead>
      <Tbl
        head={['probe', 'flareCo2Tonnes', 'flareCh4Tonnes']}
        rows={(Array.isArray(passThrough) ? passThrough : []).map((x) => [x.probe, fmt.t3(x.flareCo2Tonnes), fmt.t3(x.flareCh4Tonnes)])}
      />
      {Array.isArray(sweep) && sweep.length > 0 && (
        <>
          <Lead>EGBEMA&apos;s destruction efficiency swept, combustion left out so it stands in each time:</Lead>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sweep.filter((x) => !x.refusal)} margin={{ top: 8, right: 16, bottom: 18, left: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="eta" type="number" domain={['dataMin', 'dataMax']} tick={AXIS} label={{ value: 'destruction efficiency', position: 'insideBottom', offset: -8, fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={AXIS} />
                <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt.t3(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="linear" dataKey="flareCo2eTonnes" name="CO2e t/yr" stroke={SERIES[0]} isAnimationActive={false} />
                <Line type="linear" dataKey="flareCo2Tonnes" name="CO2 t/yr" stroke={SERIES[2]} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Tbl
            head={['destruction efficiency (input)', 'flareCo2Tonnes', 'flareCh4Tonnes', 'flareCo2eTonnes', 'methaneShareOfFlareCo2e']}
            rows={sweep.map((x) => [x.eta, fmt.t3(x.flareCo2Tonnes), fmt.t3(x.flareCh4Tonnes), fmt.t3(x.flareCo2eTonnes), fmt.f4(x.methaneShareOfFlareCo2e)])}
          />
        </>
      )}
      <Lead>EGBEMA&apos;s flare at the study&apos;s GWP and at two others, for comparison only:</Lead>
      <Tbl
        head={['GWP (input)', 'flareCo2eTonnes', 'methaneShareOfFlareCo2e']}
        rows={(Array.isArray(gwps) ? gwps : []).map((x) => [x.gwp, fmt.t3(x.flareCo2eTonnes), fmt.f4(x.methaneShareOfFlareCo2e)])}
      />
      <Lead>What abatement refuses, each probe on EGBEMA&apos;s gas with the rest of its parcel:</Lead>
      <Tbl head={['probe', 'engine']} rows={(Array.isArray(refusals) ? refusals : []).map((x) => [x.probe, `REFUSED: ${txt(x.refusal)}`])} />
      <Note>
        Held limits, taught and never computed with: the efficiencies have no default; an unlit flare is not modelled; the
        methane GWP is a case input the engine does not ship.
      </Note>
    </>
  );
};

// ---------------------------------------------------------------------------

const FlareExplorer = ({ initialMode = 'analysis' }) => {
  const [mode, setMode] = useState(MODES.some(([m]) => m === initialMode) ? initialMode : 'analysis');
  const [rows, setRows] = useState(() => presetRows('egbema'));
  const [flareInputs, setFlareInputs] = useState({ ...BLANK_FLARE });

  const onRow = (i, k, v) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const onPreset = (id) => setRows(presetRows(id));

  const gas = useMemo(() => safe(() => gasAt(rows)), [rows]);
  const reference = useMemo(() => (mode === 'analysis' ? safe(referenceAt) : null), [mode]);
  const pure = useMemo(() => (mode === 'analysis' ? safe(pureComponentsAt) : null), [mode]);
  const refusals = useMemo(() => (mode === 'analysis' ? safe(analysisRefusalsAt) : null), [mode]);
  const probe = useMemo(() => (mode === 'mole' ? safe(carbonProbeAt) : null), [mode]);
  const edges = useMemo(() => (mode === 'liquids' ? safe(richnessEdgesAt) : null), [mode]);
  const probes = useMemo(() => (mode === 'liquids' ? safe(missingProbesAt) : null), [mode]);
  const flare = useMemo(() => (mode === 'flare' ? safe(() => flareAt(rows, flareInputs)) : null), [mode, rows, flareInputs]);
  const molar = useMemo(() => (mode === 'flare' ? safe(flareMolarMassesAt) : null), [mode]);
  const passThrough = useMemo(() => (mode === 'flare' ? safe(passThroughAt) : null), [mode]);
  const sweep = useMemo(() => (mode === 'flare' ? safe(destructionSweepAt) : null), [mode]);
  const gwps = useMemo(() => (mode === 'flare' ? safe(gwpSweepAt) : null), [mode]);
  const flareRefusals = useMemo(() => (mode === 'flare' ? safe(flareRefusalsAt) : null), [mode]);

  return (
    <PanelShell
      title="Flare explorer"
      subtitle="The EGBEMA flow station's associated gas, read by the mole: its heating value, inerts, carbon, mass and liquids, then its flare by 40 CFR 98.233(n). Every figure is the engine's."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'analysis' && <AnalysisMode gas={gas} rows={rows} onRow={onRow} onPreset={onPreset} reference={reference} pure={pure} refusals={refusals} />}
        {mode === 'mole' && <MoleMode gas={gas} rows={rows} onRow={onRow} onPreset={onPreset} probe={probe} />}
        {mode === 'liquids' && <LiquidsMode gas={gas} rows={rows} onRow={onRow} onPreset={onPreset} edges={edges} probes={probes} />}
        {mode === 'flare' && (
          <FlareMode
            flare={flare}
            inputs={flareInputs}
            onInput={(k, v) => setFlareInputs((x) => ({ ...x, [k]: v }))}
            onEgbema={() => setFlareInputs(egbemaFlareInputs())}
            onClear={() => setFlareInputs({ ...BLANK_FLARE })}
            molar={molar}
            passThrough={passThrough}
            sweep={sweep}
            gwps={gwps}
            refusals={flareRefusals}
          />
        )}
      </div>
      <Note>
        Every figure on this page is a return value of the vendored flareToValue module through the teaching lab, on the
        basis the engine names. Every refusal and note is the engine&apos;s own sentence. A blank box goes to the engine as
        missing. Every analysis, efficiency and GWP here is invented and illustrative.
      </Note>
    </PanelShell>
  );
};

export default FlareExplorer;
