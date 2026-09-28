import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import ChartFrame from '@/components/charts/ChartFrame';
import { GRID_STYLE, TOOLTIP_STYLE } from '@/utils/chartTheme';
import { AXIS_TICK, SVG_CHART, seriesColor } from '@/utils/chartSvg';
import { WELLS, volumes, tolerance, toleranceSweep, boyle } from './wellcontrolLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Tolerance explorer: how big a kick the well can take, which of the two cases
// binds, and how quickly it disappears as the mud weight rises.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const MPa = (v) => fmt(v / 1e6, 5);

const MODES = [
  { value: 'tolerance', label: 'Kick tolerance' },
  { value: 'sweep', label: 'Against mud weight' },
  { value: 'boyle', label: 'The bubble' },
];
const WELL_OPTIONS = WELLS.map((w) => ({ value: w.id, label: w.id }));

const Tolerance = () => {
  const [id, setId] = useState('slant');
  const [frac, setFrac] = useState('1750');
  const [ki, setKi] = useState('60');
  const [rhoI, setRhoI] = useState('240');
  const t = useMemo(() => {
    const f = Number(frac); const k = Number(ki); const r = Number(rhoI);
    if (![f, k, r].every(Number.isFinite)) return null;
    try { return tolerance(id, { fracEmwKgM3: f, kickIntensityKgM3: k, influxDensityKgM3: r }); } catch { return null; }
  }, [id, frac, ki, rhoI]);
  const v = volumes(id);
  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <SelectField label="Well" value={id} onChange={setId} options={WELL_OPTIONS} />
        <NumField label="Fracture EMW (kg/m3)" value={frac} onChange={setFrac} />
        <NumField label="Kick intensity (kg/m3)" value={ki} onChange={setKi} />
        <NumField label="Influx density (kg/m3)" value={rhoI} onChange={setRhoI} />
      </div>
      {t && (
        <>
          <TileGrid>
            <Tile label="MAASP" value={MPa(t.maaspPa)} unit="MPa" />
            <Tile label="Formation pressure" value={MPa(t.formationPressurePa)} unit="MPa" />
            <Tile label="Shoe headroom" value={MPa(t.headroomPa)} unit="MPa" />
            <Tile label="Shut in, at bottom" value={fmt(t.cases.shutInM3, 8)} unit="m3" />
            <Tile label="Circulated to the shoe" value={fmt(t.cases.atShoeM3, 8)} unit="m3" />
            <Tile label="Kick tolerance" value={fmt(t.kickToleranceM3, 8)} unit="m3" />
          </TileGrid>
          <div className={`mt-3 text-xs ${t.cases.shutInM3 < t.cases.atShoeM3 ? 'text-pl-primary-text' : 'text-pl-warning-text'}`}>
            The binding case here is
            {t.cases.shutInM3 < t.cases.atShoeM3
              ? ' the shut-in one: the influx sitting at the bottom of the hole.'
              : ' the circulated one: the bubble expanded up to the shoe.'}
          </div>
        </>
      )}
      <Note>
        Two cases and the smaller wins. Shut in, the influx stands at the bottom and the shoe sees
        the formation pressure less a full mud column. Circulated up, the bubble has expanded and
        sits just below the shoe, where the same headroom buys a different volume. On the slant well
        the shut-in case binds; on the horizontal well the shoe is only
        {' '}{fmt(v.tvdBhM - v.tvdShoeM, 1)} m of TVD above the bit and the other one does.
      </Note>
    </>
  );
};

const Sweep = () => {
  const [id, setId] = useState('slant');
  const [frac, setFrac] = useState('1750');
  const rows = useMemo(() => {
    const f = Number(frac);
    if (!Number.isFinite(f)) return [];
    try {
      return toleranceSweep(id, {
        mudDensities: [1200, 1260, 1320, 1380, 1440, 1500, 1560, 1620, 1680],
        over: { fracEmwKgM3: f },
      });
    } catch { return []; }
  }, [id, frac]);
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Well" value={id} onChange={setId} options={WELL_OPTIONS} />
        <NumField label="Fracture EMW (kg/m3)" value={frac} onChange={setFrac} />
      </div>
      <ChartFrame height={224} className="mt-3">
        <LineChart data={rows.map((r) => ({ rho: r.mudDensityKgM3, kt: r.kickToleranceM3, maasp: r.maaspPa / 1e6 }))}
          margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="rho" type="number" domain={['auto', 'auto']} tick={AXIS_TICK}
            label={{ value: 'mud density (kg/m3)', position: 'insideBottom', offset: -3, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis yAxisId="l" tick={AXIS_TICK} />
          <YAxis yAxisId="r" orientation="right" tick={AXIS_TICK} />
          <Tooltip contentStyle={TOOLTIP_STYLE}
            formatter={(v) => fmt(v, 5)} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine yAxisId="l" y={0} stroke={seriesColor(3)} strokeDasharray="4 4" />
          <Line yAxisId="l" dataKey="kt" name="kick tolerance (m3)" stroke={seriesColor(0)} strokeWidth={2} isAnimationActive={false} />
          <Line yAxisId="r" dataKey="maasp" name="MAASP (MPa)" stroke={seriesColor(1)} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </ChartFrame>
      <Note>
        Both fall as the mud weight rises, and the kick tolerance reaches zero first. At the point
        where it crosses zero, the well cannot take any influx at all: the shoe is already at its
        fracture pressure with the hole full of mud. That is the mud weight at which the section
        has to be cased off, and it is the single most useful output of a well control calculation
        at the planning stage.
      </Note>
    </>
  );
};

const Bubble = () => {
  const [p1, setP1] = useState('30');
  const [v1, setV1] = useState('2');
  const [p2, setP2] = useState('10');
  const out = useMemo(() => {
    const a = Number(p1) * 1e6; const b = Number(v1); const c = Number(p2) * 1e6;
    if (![a, b, c].every(Number.isFinite) || a <= 0 || c <= 0 || b <= 0) return null;
    return boyle({ p1Pa: a, v1M3: b, p2Pa: c });
  }, [p1, v1, p2]);
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <NumField label="Pressure at depth (MPa)" value={p1} onChange={setP1} />
        <NumField label="Volume there (m3)" value={v1} onChange={setV1} />
        <NumField label="Pressure higher up (MPa)" value={p2} onChange={setP2} />
      </div>
      {out != null && (
        <TileGrid>
          <Tile label="Volume higher up" value={fmt(out, 6)} unit="m3" />
          <Tile label="Expansion factor" value={fmt(out / Number(v1), 6)} />
          <Tile label="Pressure ratio" value={fmt(Number(p1) / Number(p2), 6)} />
        </TileGrid>
      )}
      <Note>
        Boyle: pressure times volume is constant. A gas bubble migrating up a shut-in well doubles
        in volume every time the pressure halves, and the pressure at surface is a small fraction of
        the pressure at the bit. That expansion is what the kick tolerance is really about, and it
        is the reason a gas kick is far more dangerous than a liquid one of the same pit gain. This
        model is isothermal and treats the influx as a single bubble, and both are simplifications.
      </Note>
    </>
  );
};

const ToleranceExplorer = () => {
  const [mode, setMode] = useState('tolerance');
  return (
    <PanelShell
      title="Kick tolerance explorer"
      subtitle="How much influx the shoe can take, which case binds, and how fast the margin disappears"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'tolerance' && <Tolerance />}
        {mode === 'sweep' && <Sweep />}
        {mode === 'boyle' && <Bubble />}
      </div>
    </PanelShell>
  );
};

export default ToleranceExplorer;
