import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { thermalExplorer } from './flowAssuranceLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Thermal explorer, the Associate tier. One pipe, read completely.
//
// Six modes. What the two engines carry as catalogue values and what they
// refuse to look up, the resistance stack of a build term by term with the
// share the engine itself returns, what insulation buys and where it stops
// buying it, the trench as one more resistance in the same series, what a U is
// REFERRED TO, and both mass helpers with the heat capacity split that
// reverses their ranking.
//
// Every figure on this page is a return value from flowAssuranceLab, which is
// a return value from the vendored flowline thermal engine. Nothing here
// computes a resistance, a share, a U or a mass.

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
  ['catalog', 'What the engine offers, and what it refuses to look up'],
  ['stack', 'One build, term by term, with every share'],
  ['insulation', 'What insulation buys, and where it stops buying it'],
  ['burial', 'The trench, its depth, its soil and its floor'],
  ['reference', 'What a U value is referred to'],
  ['mass', 'What the line weighs, and what carries the heat'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const buildOptions = () => thermalExplorer.builds.map((id) => [
  id, `${id}: ${thermalExplorer.buildLabels[id]}`,
]);

// --------------------------------------------------------------------------

const Catalog = () => {
  const data = useMemo(() => {
    try {
      return {
        constants: thermalExplorer.constants(),
        conductivities: thermalExplorer.conductivities(),
        films: thermalExplorer.films(),
        refusals: thermalExplorer.catalogRefusals(),
        limits: thermalExplorer.refusals(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A conductivity catalogue is a set of defaults offered rather than product data, and every layer still takes its own conductivity as an input, so with the module absent there is nothing to list.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="Steel density the module carries" value={fmt(data.constants.steelDensityLbFt3, 1)} unit="lbm/ft3" />
        <Tile label="Where Hammerschmidt stops being trusted" value={fmt(data.constants.hammerschmidtReliableWtPct, 1)} unit="weight percent" />
        <Tile label="The practical concentration ceiling" value={fmt(data.constants.maxPracticalWtPct, 1)} unit="weight percent" />
        <Tile label="Molecular weight of water" value={fmt(data.constants.waterMolecularWeight, 4)} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">material</th>
              <th className="text-left pr-3">k, Btu/(hr ft degF)</th>
              <th className="text-left pr-3">against carbon steel</th>
              <th className="text-left">steel over this</th>
            </tr>
          </thead>
          <tbody>
            {data.conductivities.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.kBtuHrFtF, 4)}</td>
                <td className="pr-3">{fmt(r.ratioToSteel, 8)}</td>
                <td>{fmt(r.steelOverThis, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">film coefficient</th>
              <th className="text-left pr-3">which face</th>
              <th className="text-left">h, Btu/(hr ft2 degF)</th>
            </tr>
          </thead>
          <tbody>
            {data.films.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{r.side}</td>
                <td className="text-[#BFFF00]">{fmt(r.hBtuHrFt2F, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        NO SILENT FALLBACK, AND THE HEADER SAYS WHY. An id in neither catalogue is a NaN, because an
        earlier version returned the first entry, carbon steel, for an unknown id, so a typo in an
        insulation id quietly turned aerogel into steel and made a line look two thousand times
        better insulated than it is. The ratio that mistake was worth is on the aerogel row above.
      </div>
      <div className="mt-2 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <tbody>
            {data.refusals.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3 text-[#f97316]">
                  {r.isNaN === undefined ? `ok ${yn(r.ok)}` : `not a number: ${yn(r.isNaN)}`}
                </td>
                <td>{r.error || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        THE HYDRATE BOUNDARY IS NOT IN EITHER CATALOGUE, AND IT IS NOT COMPUTED ANYWHERE. Both
        module headers say so: it is a fluid property that comes from a lab or a compositional
        flash, and the consumer supplies it. Every verdict in this course is conditional on a
        number somebody else measured. That is the first of {fmt(data.limits.length, 0)} stated
        limits.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Stack = () => {
  const [build, setBuild] = useState('insulated');
  const data = useMemo(() => {
    try {
      return {
        rows: thermalExplorer.buildRows(build),
        summary: thermalExplorer.buildSummary(build),
        pairs: thermalExplorer.uPairs(),
        ratios: thermalExplorer.buildRatios(),
        foam: thermalExplorer.foamShares(),
        steel: thermalExplorer.steelShares(),
        logs: thermalExplorer.logTerms(),
        refusals: thermalExplorer.stackRefusals(),
      };
    } catch { return null; }
  }, [build]);
  if (!data) {
    return <Note>A stack needs at least one layer, its own wall, and every layer needs an inside diameter, a larger outside diameter and a positive conductivity. With any of those missing the engine refuses rather than skipping the term.</Note>;
  }
  const pair = data.pairs.find((p) => p.build === build) || null;
  const chart = data.rows.map((r) => ({
    name: r.label || r.term, sharePct: r.sharePct,
  }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Build" value={build} onChange={setBuild} options={buildOptions()} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Overall U, the engine" value={fmt(data.summary.engineUBtuHrFt2F, 10)} unit="Btu/(hr ft2 degF)" />
          <Tile label="Referred to" value={fmt(data.summary.referenceIdIn, 3)} unit="in" />
          <Tile label="Total resistance" value={fmt(data.summary.totalResistance, 10)} unit="hr ft degF/Btu per ft" />
          <Tile label="Terms in the stack" value={fmt(data.summary.termCount, 0)} />
          <Tile label="Largest term" value={data.summary.largestTerm} />
          <Tile label="Its share" value={fmt(data.summary.largestSharePct, 8)} unit="percent" />
          <Tile label="Shares sum to" value={fmt(data.summary.sharesSumPct, 8)} unit="percent" />
          <Tile label="U times its reference diameter in feet" value={fmt(data.summary.uTimesReferenceIdFt, 10)} unit="Btu/(hr ft degF) per ft" />
        </TileGrid>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="name" tick={AXIS} interval={0} angle={-12} textAnchor="end" height={44} />
            <YAxis tick={AXIS}
              label={{ value: 'share of the stack, percent', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Bar dataKey="sharePct" name="share of the total resistance" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">term</th>
              <th className="text-left pr-3">what it is</th>
              <th className="text-left pr-3">resistance, hr ft degF/Btu per ft</th>
              <th className="text-left">share, percent</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.term}>
                <td className="pr-3">{r.term}</td>
                <td className="pr-3">{r.label || 'a boundary layer'}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.resistance, 10)}</td>
                <td>{fmt(r.sharePct, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pair && (
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">overall U on this build</th>
                <th className="text-left pr-3">the oracle</th>
                <th className="text-left pr-3">the engine</th>
                <th className="text-left">the two are</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pr-3">Btu/(hr ft2 degF)</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(pair.goldenUBtuHrFt2F, 10)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(pair.engineUBtuHrFt2F, 10)}</td>
                <td>{tiny(pair.uRelDiff)} apart, relative</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 text-xs text-slate-300">
        A SHARE IS A PROPERTY OF A BUILD AND NOT A NUMBER TO MEMORISE. The foam layer is the same
        two inches of the same material in every build here and its RESISTANCE never changes at
        {' '}{fmt(data.foam[0].resistance, 10)}. Its share runs from
        {' '}{fmt(Math.min(...data.foam.map((f) => f.sharePct)), 6)} percent to
        {' '}{fmt(Math.max(...data.foam.map((f) => f.sharePct)), 6)} percent across the four builds
        it appears in, because everything around it moved.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        AND THE STEEL WALL IS THE CONTRAST. It is the strongest material in the stack and it carries
        almost nothing, because a layer resistance is the log of the diameter ratio over the
        conductivity and the steel has both the thinnest log,
        {' '}{fmt(data.logs.steelLogTerm, 10)} against {fmt(data.logs.foamLogTerm, 10)}, and the
        largest conductivity, a ratio of {fmt(data.logs.conductivityRatio, 8)}. Those two ratios
        multiply to {fmt(data.logs.productOfRatios, 6)}, which is the foam resistance over the steel
        resistance taken straight from the two engine returns:
        {' '}{fmt(data.logs.resistanceRatio, 6)}.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        Two inches of foam is worth a factor of {fmt(data.ratios.bareOverInsulated, 8)} on the bare
        U. Four feet of wet soil on top of that is worth
        {' '}{fmt(data.ratios.insulatedOverBuried, 8)}. The stack ADDS, so once one term dominates
        the next one added has little left to do.
      </div>
      <Note>
        What the stack refuses: {data.refusals.map((r) => `${r.label} (ok ${yn(r.ok)})`).join('; ')}.
        A layer that cannot be resolved is refused rather than skipped, which is worth remembering
        when the trench is reached.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Insulation = () => {
  const [which, setWhich] = useState('thickness');
  const data = useMemo(() => {
    try {
      return {
        thickness: thermalExplorer.foamThickness(),
        logs: thermalExplorer.foamLogs(),
        materials: thermalExplorer.materials(),
        contrast: thermalExplorer.materialContrast(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A coating buys nothing until it has a conductivity and an outside diameter larger than the pipe it sits on. Below that the engine has no layer to resolve.</Note>;
  }
  const chart = which === 'thickness'
    ? data.thickness.map((r) => ({ x: r.foamOdIn, u: r.engineUBtuHrFt2F }))
    : data.materials.map((r) => ({ x: r.kBtuHrFtF, u: r.engineUBtuHrFt2F }));
  const label = which === 'thickness'
    ? 'foam outside diameter, in'
    : 'coating conductivity, Btu/(hr ft degF)';
  return (
    <>
      <FieldGrid>
        <SelectField label="Sweep" value={which} onChange={setWhich}
          options={[
            ['thickness', 'Thickness, at the published conductivity'],
            ['material', 'Material, at the published thickness'],
          ]} />
      </FieldGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: label, position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'overall U, Btu/(hr ft2 degF)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 8)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="u" name="overall U, referred to the bore"
              stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {which === 'thickness' ? (
        <>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">foam outside diameter, in</th>
                  <th className="text-left pr-3">wall, in</th>
                  <th className="text-left pr-3">U, Btu/(hr ft2 degF)</th>
                  <th className="text-left pr-3">foam resistance</th>
                  <th className="text-left pr-3">foam share, percent</th>
                  <th className="text-left pr-3">U ratio to the row above</th>
                  <th className="text-left">published case</th>
                </tr>
              </thead>
              <tbody>
                {data.thickness.map((r) => (
                  <tr key={r.foamOdIn} className={r.published ? 'text-[#BFFF00]' : ''}>
                    <td className="pr-3">{fmt(r.foamOdIn, 3)}</td>
                    <td className="pr-3">{fmt(r.wallIn, 4)}</td>
                    <td className="pr-3">{fmt(r.engineUBtuHrFt2F, 8)}</td>
                    <td className="pr-3">{r.foamResistance === null ? 'none' : fmt(r.foamResistance, 8)}</td>
                    <td className="pr-3">{fmt(r.foamSharePct, 6)}</td>
                    <td className="pr-3">{r.uRatioToRowAbove === null ? '-' : fmt(r.uRatioToRowAbove, 8)}</td>
                    <td>{yn(r.published)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-slate-300">
            THE ROWS ARE A CONTIGUOUS SLICE AND ONLY ONE OF THEM IS A PUBLISHED CASE. Every other
            row is a sweep point on published inputs. The FIRST quarter inch of foam wall divides U
            by more than twenty, and a quarter inch added at the outside divides it by a small
            fraction of that. The reason is in the log: a layer resistance goes as the log of the
            diameter ratio, so equal THICKNESS added far out is less log than the same thickness
            added close in. The two logs are {fmt(data.logs.firstQuarterLog, 10)} and
            {' '}{fmt(data.logs.outerQuarterLog, 10)}, a ratio of {fmt(data.logs.logRatio, 8)}.
          </div>
        </>
      ) : (
        <>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">coating</th>
                  <th className="text-left pr-3">k, Btu/(hr ft degF)</th>
                  <th className="text-left pr-3">U, Btu/(hr ft2 degF)</th>
                  <th className="text-left pr-3">layer resistance</th>
                  <th className="text-left pr-3">layer share, percent</th>
                  <th className="text-left">published case</th>
                </tr>
              </thead>
              <tbody>
                {data.materials.map((r) => (
                  <tr key={r.materialId} className={r.published ? 'text-[#BFFF00]' : ''}>
                    <td className="pr-3">{r.label}</td>
                    <td className="pr-3">{fmt(r.kBtuHrFtF, 4)}</td>
                    <td className="pr-3">{fmt(r.engineUBtuHrFt2F, 8)}</td>
                    <td className="pr-3">{fmt(r.layerResistance, 8)}</td>
                    <td className="pr-3">{fmt(r.layerSharePct, 6)}</td>
                    <td>{yn(r.published)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-slate-300">
            THE LAYER RESISTANCE IS EXACTLY INVERSE IN THE CONDUCTIVITY, so the whole table reads
            off one row and a division: the conductivity ratio between the two ends is
            {' '}{fmt(data.contrast.conductivityRatio, 8)} and the layer resistance ratio is
            {' '}{fmt(data.contrast.layerResistanceRatio, 8)}. What is NOT inverse in the
            conductivity is the U, at {fmt(data.contrast.uRatio, 8)}, because the films and the
            steel do not move.
          </div>
        </>
      )}
      <Note>
        Every conductivity here is an INPUT. The catalogue is a set of defaults offered rather than
        anybody's product data, and a real project uses the manufacturer's number for a specific
        insulation.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Burial = () => {
  const [which, setWhich] = useState('depth');
  const data = useMemo(() => {
    try {
      return {
        depths: thermalExplorer.burialDepths(),
        soils: thermalExplorer.soils(),
        floor: thermalExplorer.burialFloor(),
        convention: thermalExplorer.burialConvention(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A trench has no ground resistance until the burial reaches half the coated diameter, because below that the shape factor has no real value at all.</Note>;
  }
  const chart = which === 'depth'
    ? data.depths.map((r) => ({ x: r.burialFt, r: r.groundResistance, share: r.groundSharePct }))
    : data.soils.map((r) => ({ x: r.kSoil, r: r.groundResistance, share: r.groundSharePct }));
  const label = which === 'depth'
    ? 'burial to centreline, ft'
    : 'soil conductivity, Btu/(hr ft degF)';
  const rows = which === 'depth' ? data.depths : data.soils;
  return (
    <>
      <FieldGrid>
        <SelectField label="Sweep" value={which} onChange={setWhich}
          options={[
            ['depth', 'Depth, at the published soil'],
            ['soil', 'Soil conductivity, at the published depth'],
          ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Half the coated diameter" value={fmt(data.floor.burialFt, 8)} unit="ft" />
          <Tile label="Ground resistance of a pipe lying on the bottom" value={fmt(data.floor.engineBurialAtHalfDiameterField, 8)} unit="hr ft degF/Btu per ft" />
          <Tile label="The same limit as the oracle published it" value={tiny(data.floor.goldenBurialAtHalfDiameterSI)} unit="K m / W" />
          <Tile label="The exact answer both approximate" value={fmt(data.floor.exactAnswer, 0)} />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: label, position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'ground share of the stack, percent', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 8)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="share" name="share of the whole stack the ground carries"
              stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">{which === 'depth' ? 'burial to centreline, ft' : 'soil k'}</th>
              {which === 'depth' && <th className="text-left pr-3">2H over D</th>}
              {which === 'depth' && <th className="text-left pr-3">acosh of it</th>}
              <th className="text-left pr-3">ground resistance</th>
              <th className="text-left pr-3">U of the buried build</th>
              <th className="text-left pr-3">ground share, percent</th>
              <th className="text-left">published case</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={which === 'depth' ? r.burialFt : r.kSoil} className={r.published ? 'text-[#BFFF00]' : ''}>
                <td className="pr-3">{fmt(which === 'depth' ? r.burialFt : r.kSoil, 6)}</td>
                {which === 'depth' && <td className="pr-3">{fmt(r.twoHOverD, 8)}</td>}
                {which === 'depth' && <td className="pr-3">{fmt(r.acoshTerm, 10)}</td>}
                <td className="pr-3">{fmt(r.groundResistance, 10)}</td>
                <td className="pr-3">{fmt(r.engineUBtuHrFt2F, 8)}</td>
                <td className="pr-3">{fmt(r.groundSharePct, 6)}</td>
                <td>{yn(r.published)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A PIPE LYING ON THE SEABED GETS NOTHING FROM THE GROUND, and that is the right answer rather
        than a limitation. It is also the check that this is the shape factor and not something that
        merely looks like one, because the inverse cosine of one has to vanish there. The oracle
        publishes that limit in SI and the engine returns it in field units, and both are floating
        point residue of an exact zero reached by different routes. They are not a disagreement and
        neither should be converted into the other.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        DOUBLING THE DEPTH DOES NOT DOUBLE THE GROUND TERM, because the inverse cosine grows like a
        logarithm once the depth is past about one diameter. Depth is cheap insulation at first and
        then it is nothing.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        AND THE BURIAL IS MEASURED TO THE CENTRELINE. Read the same trench to the TOP of the coated
        pipe instead and the ground resistance moves from
        {' '}{fmt(data.convention.toCentrelineResistance, 10)} to
        {' '}{fmt(data.convention.readAsTopOfPipeResistance, 10)}, which is
        {' '}{fmt(data.convention.relDiffPct, 6)} percent on one reading of one trench. Nothing in
        the module checks which of the two a number was measured as.
      </div>
      <Note>
        The term is the classical shape factor for an ISOTHERMAL cylinder in a SEMI-INFINITE medium,
        out of the method of images. That means one uniform soil conductivity everywhere, a flat
        surface at ambient, no groundwater movement and no seasonal front. None of those is checked
        by anything in the module.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Reference = () => {
  const [build, setBuild] = useState('buried4ft');
  const data = useMemo(() => {
    try {
      return {
        rows: thermalExplorer.references(build),
        invariant: thermalExplorer.referenceInvariant(build),
      };
    } catch { return null; }
  }, [build]);
  if (!data) {
    return <Note>A U value cannot be read at all until the area it is referred to is named, which is why the engine returns the reference beside the number.</Note>;
  }
  return (
    <>
      <FieldGrid>
        <SelectField label="Build" value={build} onChange={setBuild} options={buildOptions()} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="U referred to the bore" value={fmt(data.invariant.boreUBtuHrFt2F, 10)} unit="Btu/(hr ft2 degF)" />
          <Tile label="U referred to the coated outside diameter" value={fmt(data.invariant.coatedUBtuHrFt2F, 10)} unit="Btu/(hr ft2 degF)" />
          <Tile label="Ratio of the two U values" value={fmt(data.invariant.uRatio, 10)} />
          <Tile label="Ratio of the two diameters" value={fmt(data.invariant.diameterRatio, 10)} />
          <Tile label="Difference between those two ratios" value={tiny(data.invariant.ratioDifference)} />
          <Tile label="The two total resistances differ by" value={tiny(data.invariant.resistancesRelDiff)} unit="relative" />
          <Tile label="U times the bore reference, in feet" value={fmt(data.invariant.boreUTimesIdFt, 10)} unit="Btu/(hr ft degF) per ft" />
          <Tile label="U times the coated reference, in feet" value={fmt(data.invariant.coatedUTimesIdFt, 10)} unit="Btu/(hr ft degF) per ft" />
        </TileGrid>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">referred to, in</th>
              <th className="text-left pr-3">U, Btu/(hr ft2 degF)</th>
              <th className="text-left pr-3">total resistance</th>
              <th className="text-left">U times the reference, in feet</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.referenceIdIn}>
                <td className="pr-3">{fmt(r.referenceIdIn, 3)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.engineUBtuHrFt2F, 10)}</td>
                <td className="pr-3">{fmt(r.totalResistance, 10)}</td>
                <td>{fmt(r.uTimesReferenceIdFt, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        NOTHING ABOUT THE PIPE CHANGED BETWEEN THOSE TWO ROWS. The same layers, the same films, the
        same trench and the same total resistance to the last figure. Only the reference diameter
        moved. A U is a resistance divided by an AREA, so naming a different area gives a different
        U for identical physics, and the engine reports which one it used.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        THE INVARIANT IS THE PRODUCT. U times its reference diameter is the same number whichever
        reference is chosen, and that product times the circle constant is the conductance per foot
        of pipe, which does not care what area you name. It is
        {' '}{fmt(data.invariant.conductanceFromBoreU, 10)} Btu/(hr ft degF) per foot, and one over
        the total resistance is the same number: {fmt(data.invariant.conductancePerFootBtuHrFtF, 10)}.
        The diameter has to be in FEET there. Multiplying a U by a diameter in inches, which is how
        the engine carries a diameter, is a number with no meaning at all.
      </div>
      <Note>
        THE OMISSION. The relaxation length, the steady state profile and the cooldown each take a
        bare diameter. None of the three takes the U result and none of them can see which reference
        it carried, so keeping the pair together is the caller's job and nothing complains when the
        caller does not.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Mass = () => {
  const data = useMemo(() => {
    try {
      return {
        masses: thermalExplorer.masses(),
        reversal: thermalExplorer.massAgainstHeatCapacity(),
        foam: thermalExplorer.foamMass(),
        refusals: thermalExplorer.massRefusals(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>Both mass helpers are geometry and nothing else, so neither returns a number without a diameter pair and a density.</Note>;
  }
  const chart = [
    { name: 'steel', mass: data.masses.steelMassLbPerFt, mcp: data.masses.steelMcpBtuFtF },
    { name: 'contents', mass: data.masses.contentsMassLbPerFt, mcp: data.masses.contentsMcpBtuFtF },
    { name: 'foam, a teaching mass', mass: data.foam.foamMassLbPerFt, mcp: data.foam.foamMcpBtuFtF },
  ];
  return (
    <>
      <TileGrid>
        <Tile label="Steel mass per foot" value={fmt(data.masses.steelMassLbPerFt, 10)} unit="lbm/ft" />
        <Tile label="Contents mass per foot" value={fmt(data.masses.contentsMassLbPerFt, 10)} unit="lbm/ft" />
        <Tile label="Steel cross sectional area" value={fmt(data.masses.steelAreaFt2, 10)} unit="ft2" />
        <Tile label="Bore cross sectional area" value={fmt(data.masses.boreAreaFt2, 10)} unit="ft2" />
        <Tile label="Steel heat capacity per foot" value={fmt(data.masses.steelMcpBtuFtF, 10)} unit="Btu/(ft degF)" />
        <Tile label="Contents heat capacity per foot" value={fmt(data.masses.contentsMcpBtuFtF, 10)} unit="Btu/(ft degF)" />
        <Tile label="Total heat capacity per foot" value={fmt(data.masses.totalMcpBtuFtF, 10)} unit="Btu/(ft degF)" />
        <Tile label="Contents share of it" value={fmt(data.masses.contentsShareOfMcpPct, 6)} unit="percent" />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="name" tick={AXIS} interval={0} height={40} />
            <YAxis tick={AXIS}
              label={{ value: 'lbm/ft and Btu/(ft degF)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 8)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="mass" name="mass per foot, lbm/ft" fill="#BFFF00" isAnimationActive={false} />
            <Bar dataKey="mcp" name="heat capacity per foot, Btu/(ft degF)" fill="#f97316" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        MASS IS NOT HEAT CAPACITY, AND THE RANKING REVERSES. The cooldown header warns that on an
        insulated small bore line the steel can hold as much heat as the oil in it. On this pipe the
        steel does outweigh the contents, by a factor of
        {' '}{fmt(data.reversal.publishedSteelOverContentsMass, 8)}. Once the two specific heats are
        applied the contents carry {fmt(data.reversal.publishedContentsShareOfMcpPct, 6)} percent of
        the heat capacity, a factor of {fmt(data.reversal.publishedContentsOverSteelMcp, 8)} the
        other way. The ranking reverses: {yn(data.reversal.rankingReverses)}. On a gas filled line
        it reverses again, and the contents carry
        {' '}{fmt(data.reversal.teachingContentsShareOfApiMcpPct, 6)} percent.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        THE LAYERS THAT CARRY NONE. The overall U takes an unbounded layer list and the cooldown has
        exactly {fmt(data.foam.massSlotsCooldownOffers, 0)} mass slots, contents and shell. There is
        no slot for a coating, no helper that lumps one, and no warning when the layer list is
        longer than the slots. On the published insulated build the foam carries
        {' '}{fmt(data.foam.foamShareOfInsulatedResistancePct, 6)} percent of the resistance and, as
        the API reads, none of the mass. At a TEACHING density of
        {' '}{fmt(data.foam.foamDensityLbFt3, 1)} lbm/ft3 and a TEACHING heat capacity of
        {' '}{fmt(data.foam.foamCp, 2)} Btu/(lb degF), neither of which any golden publishes, that
        layer would add {fmt(data.foam.foamMcpBtuFtF, 8)} Btu/(ft degF), which is
        {' '}{fmt(data.foam.asFractionOfCooldownMcpPct, 6)} percent of the published cooldown heat
        capacity and none of it is in the published cooldown at all.
      </div>
      <div className="mt-2 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <tbody>
            {data.refusals.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="text-[#f97316]">not a number: {yn(r.isNaN)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Both helpers refuse what they cannot compute, and they refuse it as a BARE not-a-number
        rather than as an object with a reason. What the cooldown does with one of those is a
        question for a later tier, and the answer is not the one the module header would lead you to
        expect.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const ThermalExplorer = ({ initialMode = 'stack' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Thermal explorer"
      subtitle="One flowline cross section, read completely: the catalogue values the engine offers, the resistances in series that make an overall coefficient, what insulation and a trench each add, the area that coefficient is referred to, and what the line weighs"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'catalog' && <Catalog />}
        {mode === 'stack' && <Stack />}
        {mode === 'insulation' && <Insulation />}
        {mode === 'burial' && <Burial />}
        {mode === 'reference' && <Reference />}
        {mode === 'mass' && <Mass />}
      </div>
    </PanelShell>
  );
};

export default ThermalExplorer;
