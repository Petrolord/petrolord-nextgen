import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
} from 'recharts';
import ChartFrame from '@/components/charts/ChartFrame';
import { GRID_STYLE, TOOLTIP_STYLE } from '@/utils/chartTheme';
import { AXIS_TICK, SVG_CHART, seriesColor } from '@/utils/chartSvg';
import {
  PARAMS, KT_RPD_RANGE, KT_HD_MAX, publishedGun, skinOf, prOf, PUBLISHED_KEYS,
  catalogSweep, zeroCrossing, outOfRange, phasingSweep, sensitivity, reSweep,
  underbalanceAdvice,
} from './perfsandLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Skin explorer: the four Karakas-Tariq components, what moves them, the whole
// gun catalog ranked, and the productivity ratio that follows.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const MODES = [
  { value: 'components', label: 'The four components' },
  { value: 'catalog', label: 'The catalog ranked' },
  { value: 'phasing', label: 'Phasing' },
  { value: 'ratio', label: 'Productivity ratio' },
];

const Components = () => {
  const [key, setKey] = useState('hsd-4-5-8');
  const [khkv, setKhkv] = useState('');
  const [kkc, setKkc] = useState('');
  const i = publishedGun(key);
  const khOverKv = khkv === '' ? PARAMS.khOverKv : Number(khkv);
  const kOverKc = kkc === '' ? i.kOverKc : Number(kkc);
  const s = useMemo(() => {
    try { return skinOf(i, { khOverKv, kOverKc }); } catch { return null; }
  }, [i, khOverKv, kOverKc]);
  const sens = useMemo(() => sensitivity(key), [key]);
  if (!s) return <Note>Those numbers do not describe a case the correlation accepts.</Note>;
  const bars = [
    { name: 'plane flow', v: s.sH },
    { name: 'converging', v: s.sV },
    { name: 'blockage', v: s.sWb },
    { name: 'crushed zone', v: s.sCz },
    { name: 'total', v: s.total },
  ];
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <SelectField label="Gun" value={key} onChange={setKey}
          options={PUBLISHED_KEYS.map((k) => ({ value: k, label: k }))} />
        <NumField label={`kH/kV (default ${PARAMS.khOverKv})`} value={khkv} onChange={setKhkv} placeholder={String(PARAMS.khOverKv)} />
        <NumField label={`k/kc (default ${i.kOverKc})`} value={kkc} onChange={setKkc} placeholder={String(i.kOverKc)} />
      </div>
      <TileGrid>
        <Tile label="Plane flow" value={fmt(s.sH, 6)} />
        <Tile label="Converging flow" value={fmt(s.sV, 6)} />
        <Tile label="Wellbore blockage" value={fmt(s.sWb, 6)} />
        <Tile label="Crushed zone" value={fmt(s.sCz, 6)} />
        <Tile label="Total skin" value={fmt(s.total, 6)} />
        <Tile label="Productivity ratio" value={fmt(prOf(s.total).ratio, 6)} />
        <Tile label="Effective wellbore radius" value={fmt(s.rwPrimeM, 6)} unit="m" />
        <Tile label="hD" value={fmt(s.hD, 6)} />
        <Tile label="rpD" value={fmt(s.rpD, 6)} />
      </TileGrid>
      <ChartFrame height={224} className="mt-3">
        <BarChart data={bars} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="name" tick={AXIS_TICK} />
          <YAxis tick={AXIS_TICK}
            label={{ value: 'skin', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE}
            formatter={(x) => fmt(x, 5)} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine y={0} stroke={SVG_CHART.reference} />
          <Bar dataKey="v" name="skin component" fill={seriesColor(0)} isAnimationActive={false} />
        </BarChart>
      </ChartFrame>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">one input moved</th>
              <th className="text-right pr-3">plane flow</th>
              <th className="text-right pr-3">converging</th>
              <th className="text-right pr-3">crushed</th>
              <th className="text-right pr-3">total</th>
              <th className="text-right">ratio</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(sens).map(([k, v]) => (
              <tr key={k}>
                <td className="pr-3">{k}</td>
                <td className="text-right pr-3">{fmt(v.sH, 5)}</td>
                <td className="text-right pr-3">{fmt(v.sV, 5)}</td>
                <td className="text-right pr-3">{fmt(v.sCz, 5)}</td>
                <td className="text-right pr-3">{fmt(v.total, 5)}</td>
                <td className="text-right">{fmt(v.ratio, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The four components add and nothing else is in the total. Only the plane-flow term can be
        negative, and it is the one that decides whether a gun helps or hurts. The crushed zone is
        the only term that can be removed by an operation rather than by a choice of gun.
      </Note>
    </>
  );
};

const Catalog = () => {
  const rows = useMemo(() => catalogSweep(), []);
  const z = useMemo(() => zeroCrossing(), []);
  const out = useMemo(() => outOfRange(), []);
  const data = rows.map((r) => ({ od: r.odIn, total: r.total, ratio: r.ratio }));
  return (
    <>
      <TileGrid>
        <Tile label="Rows" value={rows.length} />
        <Tile label="Worst skin" value={fmt(Math.max(...rows.map((r) => r.total)), 5)} />
        <Tile label="Best skin" value={fmt(Math.min(...rows.map((r) => r.total)), 5)} />
        <Tile label="Crosses zero between" value={`${z.above.odIn} and ${z.below.odIn} in`} />
        <Tile label="Rows out of range" value={out.length} />
        <Tile label="Which" value={out.map((r) => `${r.odIn} in`).join(', ') || 'none'} />
      </TileGrid>
      <ChartFrame height={256} className="mt-3">
        <BarChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="od" tick={AXIS_TICK}
            label={{ value: 'gun outside diameter (in)', position: 'insideBottom', offset: -3, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis tick={AXIS_TICK}
            label={{ value: 'total skin', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE}
            formatter={(x) => fmt(x, 5)} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine y={0} stroke={seriesColor(1)} />
          <Bar dataKey="total" name="total skin" fill={seriesColor(4)} isAnimationActive={false} />
        </BarChart>
      </ChartFrame>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">gun</th>
              <th className="text-right pr-3">phasing</th>
              <th className="text-right pr-3">plane flow</th>
              <th className="text-right pr-3">converging</th>
              <th className="text-right pr-3">crushed</th>
              <th className="text-right pr-3">total</th>
              <th className="text-right pr-3">ratio</th>
              <th className="text-right">rpD</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td className="pr-3">{r.name}</td>
                <td className="text-right pr-3">{fmt(r.phasingDeg, 0)}</td>
                <td className="text-right pr-3">{fmt(r.sH, 4)}</td>
                <td className="text-right pr-3">{fmt(r.sV, 4)}</td>
                <td className="text-right pr-3">{fmt(r.sCz, 4)}</td>
                <td className="text-right pr-3 text-pl-text">{fmt(r.total, 4)}</td>
                <td className="text-right pr-3">{fmt(r.ratio, 4)}</td>
                <td className={`text-right ${r.warnings.length ? 'text-pl-warning-text' : ''}`}>
                  {fmt(r.rpD, 5)}{r.warnings.length ? <span className="ml-1 text-[10px]">out of range</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        Every row is the same rock and the same wellbore, so the only thing changing down the table
        is the gun. The two rows above the line are the through-tubing guns, and both shoot in
        line at zero phasing. The amber rpD is the one row whose dimensionless perforation radius
        leaves the range the correlation was developed over, which is between {KT_RPD_RANGE.join(' and ')}.
      </div>
      <Note>
        The most attractive row on the sheet is also the least trustworthy one. A big-hole charge
        makes a wide tunnel, a wide tunnel is a large rpD, and a large rpD is outside the data the
        correlation was fitted to. The engine still returns the number and flags it, which is the
        right behaviour: the reader decides what to do about it.
      </Note>
    </>
  );
};

const Phasing = () => {
  const [key, setKey] = useState('hsd-4-5-8');
  const sw = useMemo(() => phasingSweep(key), [key]);
  const zero = sw.find((r) => r.phasingDeg === 0);
  const best = sw.reduce((a, b) => (b.total < a.total ? b : a));
  return (
    <>
      <SelectField label="Gun" value={key} onChange={setKey}
        options={PUBLISHED_KEYS.map((k) => ({ value: k, label: k }))} />
      <TileGrid>
        <Tile label="In line, total" value={fmt(zero.total, 6)} />
        <Tile label="Best angle" value={best.phasingDeg} unit="deg" />
        <Tile label="Best total" value={fmt(best.total, 6)} />
        <Tile label="Worth" value={fmt(zero.total - best.total, 6)} unit="skin" />
        <Tile label="Of which plane flow" value={fmt(100 * (zero.sH - best.sH) / (zero.total - best.total), 3)} unit="pct" />
        <Tile label="Ratio gained" value={fmt(best.ratio - zero.ratio, 6)} />
      </TileGrid>
      <ChartFrame height={256} className="mt-3">
        <LineChart data={sw} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="phasingDeg" type="number" domain={[0, 180]} ticks={[0, 45, 60, 90, 120, 180]}
            tick={AXIS_TICK}
            label={{ value: 'phasing (deg)', position: 'insideBottom', offset: -3, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis tick={AXIS_TICK}
            label={{ value: 'skin', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE}
            formatter={(x) => fmt(x, 5)} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine y={0} stroke={SVG_CHART.reference} />
          <Line type="monotone" dataKey="sH" name="plane flow" stroke={seriesColor(0)} dot isAnimationActive={false} />
          <Line type="monotone" dataKey="total" name="total" stroke={seriesColor(1)} dot isAnimationActive={false} />
        </LineChart>
      </ChartFrame>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">phasing</th><th className="text-right pr-3">alpha</th>
              <th className="text-right pr-3">rw prime (m)</th><th className="text-right pr-3">plane flow</th>
              <th className="text-right pr-3">blockage</th><th className="text-right pr-3">total</th>
              <th className="text-right">ratio</th>
            </tr>
          </thead>
          <tbody>
            {sw.map((r) => (
              <tr key={r.phasingDeg}>
                <td className="pr-3">{r.phasingDeg} deg</td>
                <td className="text-right pr-3">{fmt(r.alpha, 4)}</td>
                <td className="text-right pr-3">{fmt(r.rwPrimeM, 6)}</td>
                <td className="text-right pr-3">{fmt(r.sH, 5)}</td>
                <td className="text-right pr-3">{fmt(r.sWb, 6)}</td>
                <td className="text-right pr-3">{fmt(r.total, 5)}</td>
                <td className="text-right">{fmt(r.ratio, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Zero phasing is not an angle, it is a different formula: the effective wellbore radius
        becomes a quarter of the tunnel length and loses the wellbore radius entirely. That
        discontinuity is why in-line shooting is so much worse than any real angle, and why the
        step from zero to forty five degrees buys more than any other single change on the sheet.
      </Note>
    </>
  );
};

const Ratio = () => {
  const [skinIn, setSkinIn] = useState('');
  const [kMd, setKMd] = useState('');
  const s = skinIn === '' ? -1.706447001228452 : Number(skinIn);
  const k = kMd === '' ? PARAMS.kMd : Number(kMd);
  const sw = useMemo(() => {
    try { return reSweep(s); } catch { return null; }
  }, [s]);
  const ub = useMemo(() => {
    try { return { oil: underbalanceAdvice({ kMd: k, fluid: 'oil' }), gas: underbalanceAdvice({ kMd: k, fluid: 'gas' }) }; } catch { return null; }
  }, [k]);
  if (!sw || !ub) return <Note>That skin or that permeability is outside what the model accepts.</Note>;
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="Total skin (default the HSD gun)" value={skinIn} onChange={setSkinIn} placeholder="-1.7064" />
        <NumField label={`Permeability (mD, default ${PARAMS.kMd})`} value={kMd} onChange={setKMd} placeholder={String(PARAMS.kMd)} />
      </div>
      <TileGrid>
        <Tile label="Ratio at 300 m" value={fmt(sw.find((r) => r.reM === 300).ratio, 6)} />
        <Tile label="ln(re/rw) at 300 m" value={fmt(sw.find((r) => r.reM === 300).lnReRw, 6)} />
        <Tile label="Ratio at 50 m" value={fmt(sw[0].ratio, 6)} />
        <Tile label="Ratio at 2000 m" value={fmt(sw.at(-1).ratio, 6)} />
        <Tile label="Spread over 40x" value={fmt(sw[0].ratio - sw.at(-1).ratio, 6)} />
        <Tile label="Class" value={ub.oil.classLabel} />
        <Tile label="Oil underbalance" value={`${ub.oil.minPsi} to ${ub.oil.maxPsi}`} unit="psi" />
        <Tile label="Gas underbalance" value={`${ub.gas.minPsi} to ${ub.gas.maxPsi}`} unit="psi" />
        <Tile label="Oil band" value={`${fmt(ub.oil.minPa / 1e6, 4)} to ${fmt(ub.oil.maxPa / 1e6, 4)}`} unit="MPa" />
      </TileGrid>
      <ChartFrame height={224} className="mt-3">
        <LineChart data={sw} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="reM" type="number" scale="log" domain={['dataMin', 'dataMax']}
            tick={AXIS_TICK}
            label={{ value: 'drainage radius (m, log)', position: 'insideBottom', offset: -3, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis tick={AXIS_TICK}
            label={{ value: 'productivity ratio', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE}
            formatter={(x) => fmt(x, 6)} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine y={1} stroke={SVG_CHART.reference} />
          <Line type="monotone" dataKey="ratio" name="productivity ratio" stroke={seriesColor(1)} dot isAnimationActive={false} />
        </LineChart>
      </ChartFrame>
      <Note>
        The ratio compares the perforated completion against an open hole of the same radius with
        no skin at all. It is not a rate and it is not a comparison against another gun. And it
        depends on the drainage radius, which nobody knows to better than a factor of two, though
        only through a logarithm, so the dependence is weak.
      </Note>
    </>
  );
};

const SkinExplorer = () => {
  const [mode, setMode] = useState('components');
  return (
    <PanelShell
      title="Perforation skin explorer"
      subtitle="The four Karakas-Tariq components, the catalog ranked, phasing, and the productivity ratio"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'components' && <Components />}
        {mode === 'catalog' && <Catalog />}
        {mode === 'phasing' && <Phasing />}
        {mode === 'ratio' && <Ratio />}
      </div>
    </PanelShell>
  );
};

export default SkinExplorer;
