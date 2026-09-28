import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter,
} from 'recharts';
import ChartFrame from '@/components/charts/ChartFrame';
import { GRID_STYLE, TOOLTIP_STYLE } from '@/utils/chartTheme';
import { AXIS_TICK, SVG_CHART, seriesColor } from '@/utils/chartSvg';
import {
  CASES, rheology, rheologyCurve, fitResiduals, pressureSplit, flowSweep, flowElements,
  BLANK_MUD, mudOver,
} from './hydraulicsLab';
import MudBoxes from './MudBoxes';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Rheology explorer: four dial readings, three models, and the pressure chain
// those models produce.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : 'n/a');
// Pressures in MPa to 6 dp, which is 1 Pa: the precision the course grades them at.
const MPa = (v) => fmt(v / 1e6, 6);

const MODES = [
  { value: 'models', label: 'Three models, four readings' },
  { value: 'curve', label: 'Stress against shear rate' },
  { value: 'chain', label: 'The pressure chain' },
];
const CASE_OPTIONS = CASES.map((c) => ({ value: c.id, label: `${c.well} / ${c.mudName}` }));

const Models = ({ over }) => {
  const [id, setId] = useState('slant_kcl_polymer');
  const f = useMemo(() => rheology(over.fann ?? id), [id, over]);
  const res = useMemo(() => fitResiduals(over.fann ?? id), [id, over]);
  return (
    <>
      <SelectField label="Case" value={id} onChange={setId} options={CASE_OPTIONS} />
      <TileGrid>
        <Tile label="Power law n" value={fmt(f.powerLaw.n, 8)} />
        <Tile label="Power law K" value={fmt(f.powerLaw.kPaSn, 8)} unit="Pa.s^n" />
        <Tile label="Bingham PV" value={fmt(f.bingham.pvPaS, 8)} unit="Pa.s" />
        <Tile label="Bingham YP" value={fmt(f.bingham.ypPa, 6)} unit="Pa" />
        <Tile label="Herschel-Bulkley tau_y" value={fmt(f.herschelBulkley.tauYPa, 6)} unit="Pa" />
        <Tile label="Herschel-Bulkley n" value={fmt(f.herschelBulkley.n, 8)} />
      </TileGrid>
      <div className="mt-4 rounded border border-pl-border overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-pl-sunken text-pl-muted">
            <tr>
              <th className="text-left p-2">Reading</th>
              <th className="text-right p-2">Shear rate (1/s)</th>
              <th className="text-right p-2">Measured (Pa)</th>
              <th className="text-right p-2">Power law</th>
              <th className="text-right p-2">Bingham</th>
              <th className="text-right p-2">Herschel-Bulkley</th>
            </tr>
          </thead>
          <tbody>
            {res.map((r) => (
              <tr key={r.name} className="border-t border-pl-border">
                <td className="p-2 text-pl-text">{r.name}</td>
                <td className="p-2 text-right text-pl-muted">{fmt(r.gammaDot, 3)}</td>
                <td className="p-2 text-right text-pl-text">{fmt(r.measuredPa, 5)}</td>
                <td className={`p-2 text-right ${Math.abs(r.powerLawPa - r.measuredPa) < 1e-6 ? 'text-pl-success-text' : 'text-pl-muted'}`}>{fmt(r.powerLawPa, 5)}</td>
                <td className={`p-2 text-right ${Math.abs(r.binghamPa - r.measuredPa) < 1e-6 ? 'text-pl-success-text' : 'text-pl-muted'}`}>{fmt(r.binghamPa, 5)}</td>
                <td className="p-2 text-right text-pl-muted">{fmt(r.herschelBulkleyPa, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Green is an exact reproduction. The power law and the Bingham model are fitted to the 600
        and 300 rpm readings only, so they hit those two exactly and miss the 6 and 3 rpm readings,
        which is where a mud actually sits in the annulus. Herschel-Bulkley uses a low-rate reading
        as well and misses all of them by a little instead of two of them by a lot.
      </Note>
    </>
  );
};

const Curve = ({ over }) => {
  const [id, setId] = useState('slant_kcl_polymer');
  const curve = useMemo(() => rheologyCurve(over.fann ?? id), [id, over]);
  return (
    <>
      <SelectField label="Case" value={id} onChange={setId} options={CASE_OPTIONS} />
      <ChartFrame height={256} className="mt-3">
        <LineChart data={curve} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="gammaDot" type="number" scale="log" domain={['auto', 'auto']}
            tick={AXIS_TICK}
            label={{ value: 'shear rate (1/s)', position: 'insideBottom', offset: -3, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis tick={AXIS_TICK}
            label={{ value: 'shear stress (Pa)', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE}
            formatter={(v) => fmt(v, 4)} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line dataKey="powerLaw" name="power law" stroke={seriesColor(1)} dot={false} strokeWidth={2} isAnimationActive={false} />
          <Line dataKey="bingham" name="Bingham" stroke={seriesColor(2)} dot={false} strokeWidth={2} isAnimationActive={false} />
          <Line dataKey="herschelBulkley" name="Herschel-Bulkley" stroke={seriesColor(0)} dot={false} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </ChartFrame>
      <Note>
        The three curves converge at high shear rate, where the pipe is, and separate at low shear
        rate, where the annulus is. A model chosen on how well it fits the 600 and 300 rpm readings
        is being chosen on the part of the range that matters least for annular pressure loss.
      </Note>
    </>
  );
};

const Chain = ({ over }) => {
  const [id, setId] = useState('slant_kcl_polymer');
  const [q, setQ] = useState('0.025');
  const sweep = useMemo(() => flowSweep(id, undefined, over), [id, over]);
  const split = useMemo(() => {
    const v = Number(q);
    if (!Number.isFinite(v) || v <= 0) return null;
    return pressureSplit(id, v, over);
  }, [id, q, over]);
  const el = useMemo(() => flowElements(id), [id]);
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Case" value={id} onChange={setId} options={CASE_OPTIONS} />
        <NumField label="Flow rate (m3/s)" value={q} onChange={setQ} />
      </div>
      {split && (
        <TileGrid>
          <Tile label="Pump pressure" value={MPa(split.pumpPressurePa)} unit="MPa" />
          <Tile label="Inside the pipe" value={MPa(split.pipeDpPa)} unit="MPa" />
          <Tile label="Up the annulus" value={MPa(split.annulusDpPa)} unit="MPa" />
          <Tile label="Across the bit" value={MPa(split.bitDpPa)} unit="MPa" />
          <Tile label="Bit share" value={fmt(split.bitShare * 100, 3)} unit="%" />
          <Tile label="ECD at total depth" value={fmt(split.ecdAtTdKgM3, 4)} unit="kg/m3" />
        </TileGrid>
      )}
      <ChartFrame height={208} className="mt-3">
        <LineChart data={sweep.map((r) => ({ q: r.flowRateM3s, pump: r.pumpPressurePa / 1e6, bit: r.bitShare * 100 }))}
          margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="q" type="number" tick={AXIS_TICK}
            label={{ value: 'flow rate (m3/s)', position: 'insideBottom', offset: -3, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis yAxisId="l" tick={AXIS_TICK} />
          <YAxis yAxisId="r" orientation="right" tick={AXIS_TICK} />
          <Tooltip contentStyle={TOOLTIP_STYLE}
            formatter={(v) => fmt(v, 4)} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line yAxisId="l" dataKey="pump" name="pump (MPa)" stroke={seriesColor(0)} strokeWidth={2} isAnimationActive={false} />
          <Line yAxisId="r" dataKey="bit" name="bit share (%)" stroke={seriesColor(1)} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </ChartFrame>
      <Note>
        The flow path is {el.pipeElements.length} elements down the inside and
        {' '}{el.annulusElements.length} back up the annulus, with the bit between them. Pipe and
        annulus losses grow roughly as the flow rate to a power below two; the bit grows as the
        square exactly, so the bit&apos;s SHARE rises with every extra litre per second.
      </Note>
    </>
  );
};

const RheologyExplorer = () => {
  const [mode, setMode] = useState('models');
  const [mud, setMud] = useState(BLANK_MUD);
  const over = useMemo(() => mudOver(mud), [mud]);
  return (
    <PanelShell
      title="Rheology and pressure explorer"
      subtitle="Four dial readings, three models, and the pump pressure they produce"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <p className="text-[11px] text-pl-muted mt-2">
        Two wells crossed with two muds, one string, one bit at 0.000461814 m2 of nozzle area, and
        a discharge coefficient of 0.95.
      </p>
      <MudBoxes typed={mud} setTyped={setMud} valid={over !== null} />
      <div className="mt-3">
        {over && mode === 'models' && <Models over={over} />}
        {over && mode === 'curve' && <Curve over={over} />}
        {over && mode === 'chain' && <Chain over={over} />}
      </div>
    </PanelShell>
  );
};

export default RheologyExplorer;
